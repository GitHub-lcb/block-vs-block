import { _decorator, Component, director } from 'cc';
import { BlockType, RotationState, Position, InputType, ClearInfo, GameStats, MoveDirection } from './TetrisTypes';
import { TetrisBoard } from './TetrisBoard';
import { TetrisController } from './TetrisController';
import { TetrisSpawner } from './TetrisSpawner';
import { TetrisScoring } from './TetrisScoring';
import { TSpinDetector } from './TSpinDetector';
import { GhostPiece } from './GhostPiece';
import { NextPreview } from './NextPreview';
import { HoldSystem } from './HoldSystem';
import { LevelManager } from './LevelManager';
import { TetrisConfig } from './TetrisConfig';
import { GameStateManager, GameState } from '../core/GameStateManager';
import { EventBus, GameEventType } from '../core/EventBus';

const { ccclass, property } = _decorator;

/**
 * 俄罗斯方块管理器
 * 整合所有子系统，管理游戏循环
 */
@ccclass('TetrisManager')
export class TetrisManager extends Component {
    // 子系统
    private board: TetrisBoard = null!;
    private controller: TetrisController = null!;
    private spawner: TetrisSpawner = null!;
    private scoring: TetrisScoring = null!;
    private ghostPiece: GhostPiece = null!;
    private nextPreview: NextPreview = null!;
    private holdSystem: HoldSystem = null!;
    private levelManager: LevelManager = null!;

    // 游戏状态
    private isRunning: boolean = false;
    private isPaused: boolean = false;
    private fallTimer: number = 0;
    private lockTimer: number = 0;
    private isLocking: boolean = false;

    // 玩家ID（用于双人模式）
    @property
    public playerId: number = 1;

    /**
     * 初始化
     */
    protected onLoad(): void {
        this.initSystems();
    }

    /**
     * 初始化所有子系统
     */
    private initSystems(): void {
        this.board = new TetrisBoard();
        this.spawner = new TetrisSpawner();
        this.controller = new TetrisController(this.board);
        this.scoring = new TetrisScoring();
        this.ghostPiece = new GhostPiece(this.board);
        this.nextPreview = new NextPreview(this.spawner);
        this.holdSystem = new HoldSystem();
        this.levelManager = new LevelManager();
    }

    /**
     * 开始游戏
     */
    public startGame(): void {
        this.reset();
        this.isRunning = true;
        this.isPaused = false;
        this.spawnNewPiece();
        
        EventBus.instance.emit(GameEventType.GAME_START, { playerId: this.playerId });
        console.log(`[TetrisManager] Player ${this.playerId} game started`);
    }

    /**
     * 暂停游戏
     */
    public pauseGame(): void {
        this.isPaused = true;
        EventBus.instance.emit(GameEventType.GAME_PAUSE, { playerId: this.playerId });
    }

    /**
     * 恢复游戏
     */
    public resumeGame(): void {
        this.isPaused = false;
        EventBus.instance.emit(GameEventType.GAME_RESUME, { playerId: this.playerId });
    }

    /**
     * 结束游戏
     */
    public endGame(): void {
        this.isRunning = false;
        EventBus.instance.emit(GameEventType.GAME_END, { playerId: this.playerId, stats: this.getStats() });
    }

    /**
     * 重置游戏
     */
    public reset(): void {
        this.board.reset();
        this.spawner.reset();
        this.controller.reset();
        this.scoring.reset();
        this.holdSystem.reset();
        this.levelManager.reset();
        
        this.isRunning = false;
        this.isPaused = false;
        this.fallTimer = 0;
        this.lockTimer = 0;
        this.isLocking = false;
    }

    /**
     * 每帧更新
     */
    protected update(deltaTime: number): void {
        if (!this.isRunning || this.isPaused) {
            return;
        }

        const dt = deltaTime * 1000; // 转换为毫秒

        // 更新等级
        this.levelManager.update(dt);

        // 更新下落计时器
        this.fallTimer += dt;
        const fallSpeed = this.levelManager.getFallSpeed();

        if (this.fallTimer >= fallSpeed) {
            this.fallTimer = 0;
            this.tick();
        }

        // 更新锁定计时器
        if (this.isLocking) {
            this.lockTimer += dt;
            if (this.lockTimer >= TetrisConfig.LOCK_DELAY) {
                this.lockPiece();
            }
        }
    }

    /**
     * 游戏时钟tick
     */
    private tick(): void {
        if (!this.controller.getState()) {
            return;
        }

        // 尝试下落
        if (!this.controller.move(MoveDirection.DOWN)) {
            // 无法下落，开始锁定
            if (!this.isLocking) {
                this.isLocking = true;
                this.lockTimer = 0;
            }
        } else {
            // 成功下落，取消锁定
            this.isLocking = false;
            this.lockTimer = 0;
        }
    }

    /**
     * 锁定当前方块
     */
    private lockPiece(): void {
        const state = this.controller.getState();
        if (!state) return;

        // 检测 T-Spin
        const tSpinResult = state.type === BlockType.T
            ? TSpinDetector.detect(
                this.board,
                state.position,
                state.rotation,
                this.controller.isLastMoveRotation()
            )
            : { isTSpin: false, isTSpinMini: false };

        // 锁定方块
        this.controller.lock();

        // 清除行
        let clearInfo = this.board.clearLines();
        clearInfo.isTSpin = tSpinResult.isTSpin;
        clearInfo.isTSpinMini = tSpinResult.isTSpinMini;

        // 计分
        if (clearInfo.lines > 0) {
            const scoreEvent = this.scoring.calculateScore(clearInfo, this.levelManager.getLevel());
            this.emitScoreUpdate(scoreEvent.totalScore);
            
            EventBus.instance.emit(GameEventType.TETRIS_LINE_CLEAR, {
                playerId: this.playerId,
                lines: clearInfo.lines,
                isTSpin: clearInfo.isTSpin
            });
        }

        // 放置计分
        this.scoring.addPlacement();

        // 重置 Hold 可用性
        this.holdSystem.resetForNewPiece();

        // 检查游戏结束
        if (this.board.isGameOver()) {
            this.endGame();
            return;
        }

        // 生成新方块
        this.spawnNewPiece();

        // 重置锁定状态
        this.isLocking = false;
        this.lockTimer = 0;
    }

    /**
     * 生成新方块
     */
    private spawnNewPiece(): void {
        const type = this.spawner.spawn();
        
        if (!this.controller.spawn(type)) {
            // 无法生成，游戏结束
            this.endGame();
            return;
        }

        this.fallTimer = 0;

        EventBus.instance.emit(GameEventType.TETRIS_PIECE_SPAWN, {
            playerId: this.playerId,
            type
        });
    }

    /**
     * 处理输入
     */
    public handleInput(input: InputType): boolean {
        if (!this.isRunning || this.isPaused) {
            return false;
        }

        const state = this.controller.getState();
        if (!state) return false;

        switch (input) {
            case InputType.HOLD:
                return this.doHold();
            
            case InputType.HARD_DROP:
                return this.doHardDrop();
            
            default:
                const result = this.controller.handleInput(input);
                
                // 软降计分
                if (input === InputType.MOVE_DOWN && result) {
                    this.scoring.addSoftDropScore();
                }

                // 如果是移动，重置锁定计时
                if (result && !this.controller.isLastMoveRotation()) {
                    this.isLocking = false;
                    this.lockTimer = 0;
                }

                return result;
        }
    }

    /**
     * 执行 Hold
     */
    private doHold(): boolean {
        const state = this.controller.getState();
        if (!state || !this.holdSystem.isHoldAvailable()) {
            return false;
        }

        const heldType = this.holdSystem.hold(state.type);
        
        if (heldType === null) {
            // 第一次 Hold，生成新方块
            this.spawnNewPiece();
        } else {
            // 有暂存的方块，切换
            this.controller.spawn(heldType);
        }

        return true;
    }

    /**
     * 执行硬降
     */
    private doHardDrop(): boolean {
        const state = this.controller.getState();
        if (!state) return false;

        const distance = this.controller.hardDrop();
        this.scoring.addHardDropScore(distance);
        
        // 立即锁定
        this.lockPiece();

        return true;
    }

    /**
     * 发送分数更新事件
     */
    private emitScoreUpdate(score: number): void {
        EventBus.instance.emit(GameEventType.SCORE_UPDATE, {
            playerId: this.playerId,
            score
        });
    }

    // ===== 公共访问器 =====

    /**
     * 获取场地数据
     */
    public getBoard(): TetrisBoard {
        return this.board;
    }

    /**
     * 获取控制器
     */
    public getController(): TetrisController {
        return this.controller;
    }

    /**
     * 获取当前方块状态
     */
    public getCurrentPiece(): { type: BlockType; rotation: RotationState; position: Position } | null {
        const state = this.controller.getState();
        return state ? {
            type: state.type,
            rotation: state.rotation,
            position: state.position
        } : null;
    }

    /**
     * 获取 Ghost 位置
     */
    public getGhostPosition(): Position | null {
        const state = this.controller.getState();
        if (!state) return null;
        
        return this.ghostPiece.getGhostPosition(state.type, state.rotation, state.position);
    }

    /**
     * 获取 Next 预览
     */
    public getNextQueue(): BlockType[] {
        return this.nextPreview.getPreviewQueue();
    }

    /**
     * 获取 Hold 的方块
     */
    public getHeldPiece(): BlockType | null {
        return this.holdSystem.getHeldPiece();
    }

    /**
     * 获取统计
     */
    public getStats(): GameStats {
        return this.scoring.getStats();
    }

    /**
     * 获取当前分数
     */
    public getScore(): number {
        return this.scoring.getScore();
    }

    /**
     * 获取当前等级
     */
    public getLevel(): number {
        return this.levelManager.getLevel();
    }

    /**
     * 是否游戏运行中
     */
    public isGameRunning(): boolean {
        return this.isRunning && !this.isPaused;
    }
}