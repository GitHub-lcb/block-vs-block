import { _decorator, Component } from 'cc';
import { BreakoutInput, BrickType, BreakoutScoreEvent } from './BreakoutTypes';
import { BreakoutBoard } from './BreakoutBoard';
import { BreakoutController } from './BreakoutController';
import { ComboSystem } from './ComboSystem';
import { BallSpawner } from './BallSpawner';
import { BrickGenerator } from './BrickGenerator';
import { BreakoutConfig } from './BreakoutConfig';
import { EventBus, GameEventType } from '../core/EventBus';

const { ccclass, property } = _decorator;

/**
 * 弹球管理器
 */
@ccclass('BreakoutManager')
export class BreakoutManager extends Component {
    private board: BreakoutBoard = null!;
    private controller: BreakoutController = null!;
    private comboSystem: ComboSystem = null!;
    private ballSpawner: BallSpawner = null!;
    private brickGenerator: BrickGenerator = null!;

    private isRunning: boolean = false;
    private score: number = 0;
    private gameTime: number = 0;

    @property
    public playerId: number = 2;

    protected onLoad(): void {
        this.initSystems();
    }

    private initSystems(): void {
        this.board = new BreakoutBoard();
        this.controller = new BreakoutController(this.board, this.playerId);
        this.comboSystem = new ComboSystem();
        this.ballSpawner = new BallSpawner(this.board);
        this.brickGenerator = new BrickGenerator(this.board);
    }

    /**
     * 开始游戏
     */
    public startGame(): void {
        this.reset();
        this.isRunning = true;
        
        // 生成初始球
        this.ballSpawner.requestSpawn();
        
        console.log(`[BreakoutManager] Player ${this.playerId} game started`);
    }

    /**
     * 停止游戏
     */
    public stopGame(): void {
        this.isRunning = false;
    }

    /**
     * 重置游戏
     */
    public reset(): void {
        this.board.reset();
        this.comboSystem.reset();
        this.ballSpawner.reset();
        this.score = 0;
        this.gameTime = 0;
        this.isRunning = false;
    }

    /**
     * 更新
     */
    protected update(deltaTime: number): void {
        if (!this.isRunning) return;

        this.gameTime += deltaTime;

        // 更新控制器
        this.controller.update(deltaTime);

        // 更新球生成器
        this.ballSpawner.update(deltaTime);

        // 检查是否需要新球
        if (!this.controller.hasActiveBall() && !this.ballSpawner.isSpawningBall()) {
            this.ballSpawner.requestSpawn();
        }
    }

    /**
     * 处理输入
     */
    public handleInput(input: BreakoutInput): boolean {
        if (!this.isRunning) return false;
        return this.controller.handleInput(input);
    }

    /**
     * 从俄罗斯方块网格生成砖块
     */
    public generateBricksFromTetris(gridData: (string | null)[][]): void {
        this.brickGenerator.generateFromTetrisGrid(gridData);
    }

    /**
     * 添加单个砖块
     */
    public addBrick(gridX: number, gridY: number): void {
        this.brickGenerator.addBrickFromBlock(gridX, gridY);
    }

    /**
     * 清空砖块
     */
    public clearBricks(): void {
        this.board.clearBricks();
    }

    /**
     * 记录砖块击碎
     */
    public onBrickDestroyed(brickType: BrickType, combo: number): void {
        this.comboSystem.recordHit(this.gameTime * 1000);
        
        // 计算得分
        const baseScore = this.getBrickScore(brickType);
        const comboBonus = this.comboSystem.calculateComboBonus(baseScore);
        const totalScore = baseScore + comboBonus;

        this.score += totalScore;

        EventBus.instance.emit(GameEventType.SCORE_UPDATE, {
            playerId: this.playerId,
            score: this.score,
            delta: totalScore
        });
    }

    /**
     * 记录球丢失
     */
    public onBallLost(): void {
        this.comboSystem.resetCombo();
        this.ballSpawner.recordBallLost();

        if (this.ballSpawner.isOverLimit()) {
            const penalty = this.ballSpawner.getPenalty();
            this.score = Math.max(0, this.score - penalty);

            EventBus.instance.emit(GameEventType.BREAKOUT_BALL_LOST, {
                playerId: this.playerId,
                penalty
            });
        }
    }

    /**
     * 获取砖块得分
     */
    private getBrickScore(brickType: BrickType): number {
        return BreakoutConfig.SCORE_TABLE[brickType] || BreakoutConfig.SCORE_TABLE.NORMAL;
    }

    /**
     * 获取当前分数
     */
    public getScore(): number {
        return this.score;
    }

    /**
     * 获取连击数
     */
    public getCombo(): number {
        return this.comboSystem.getCombo();
    }

    /**
     * 获取丢失球数
     */
    public getBallsLost(): number {
        return this.ballSpawner.getBallsLost();
    }

    /**
     * 获取场地
     */
    public getBoard(): BreakoutBoard {
        return this.board;
    }

    /**
     * 是否游戏运行中
     */
    public isGameRunning(): boolean {
        return this.isRunning;
    }
}