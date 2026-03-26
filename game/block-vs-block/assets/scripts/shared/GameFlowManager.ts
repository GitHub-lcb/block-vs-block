import { _decorator, Component } from 'cc';
import { GameTimer } from './GameTimer';
import { RoleSwapManager, PlayerRole } from './RoleSwapManager';
import { SharedField } from './SharedField';
import { TetrisManager } from '../tetris/TetrisManager';
import { BreakoutManager } from '../breakout/BreakoutManager';
import { GameStateManager, GameState } from '../core/GameStateManager';
import { EventBus, GameEventType } from '../core/EventBus';

const { ccclass, property } = _decorator;

/**
 * 游戏流程管理器
 * 整合所有子系统
 */
@ccclass('GameFlowManager')
export class GameFlowManager extends Component {
    private gameTimer: GameTimer = null!;
    private roleSwapManager: RoleSwapManager = null!;
    private sharedField: SharedField = null!;
    private tetrisManager: TetrisManager = null!;
    private breakoutManager: BreakoutManager = null!;

    // 玩家引用
    @property(Component)
    public p1Controller: Component | null = null;

    @property(Component)
    public p2Controller: Component | null = null;

    protected onLoad(): void {
        this.initSystems();
    }

    private initSystems(): void {
        this.gameTimer = new GameTimer();
        this.roleSwapManager = new RoleSwapManager();
        this.sharedField = new SharedField();

        // 设置计时器回调
        this.gameTimer.setCallbacks(
            () => this.onRoundEnd(),
            () => this.onWarning(),
            () => this.onGameEnd()
        );
    }

    /**
     * 开始游戏
     */
    public startGame(): void {
        GameStateManager.instance.changeState(GameState.LOADING);
        
        this.gameTimer.start();
        this.roleSwapManager.reset();
        this.sharedField.reset();

        // 启动P1俄罗斯方块
        if (this.tetrisManager) {
            this.tetrisManager.startGame();
        }

        // 启动P2弹球
        if (this.breakoutManager) {
            this.breakoutManager.startGame();
        }

        GameStateManager.instance.changeState(GameState.PLAYING);
        
        EventBus.instance.emit(GameEventType.GAME_START, {});
    }

    /**
     * 更新
     */
    protected update(deltaTime: number): void {
        if (!GameStateManager.instance.canPlay()) return;

        this.gameTimer.update(deltaTime);
        this.sharedField.update(deltaTime);
    }

    /**
     * 回合结束
     */
    private onRoundEnd(): void {
        // 触发互换警告
        GameStateManager.instance.changeState(GameState.WARNING);

        // 执行互换
        this.performSwap();
    }

    /**
     * 互换警告
     */
    private onWarning(): void {
        GameStateManager.instance.changeState(GameState.WARNING);
        
        EventBus.instance.emit(GameEventType.ROLE_SWAP_WARNING, {
            remainingTime: 5
        });
    }

    /**
     * 执行互换
     */
    private performSwap(): void {
        // 重置场地
        this.sharedField.reset();

        // 执行角色互换
        this.roleSwapManager.swap();

        // 重置玩家控制器
        const p1Role = this.roleSwapManager.getPlayerRole(1);
        const p2Role = this.roleSwapManager.getPlayerRole(2);

        // 根据新角色重置管理器
        if (p1Role === PlayerRole.TETRIS) {
            this.tetrisManager?.reset();
            this.tetrisManager?.startGame();
        } else {
            this.breakoutManager?.reset();
            this.breakoutManager?.startGame();
        }

        if (p2Role === PlayerRole.TETRIS) {
            this.tetrisManager?.reset();
            this.tetrisManager?.startGame();
        } else {
            this.breakoutManager?.reset();
            this.breakoutManager?.startGame();
        }
    }

    /**
     * 游戏结束
     */
    private onGameEnd(): void {
        GameStateManager.instance.changeState(GameState.ENDED);

        const p1Score = this.tetrisManager?.getScore() || 0;
        const p2Score = this.breakoutManager?.getScore() || 0;

        EventBus.instance.emit(GameEventType.GAME_END, {
            p1Score,
            p2Score,
            winner: p1Score > p2Score ? 1 : 2
        });
    }

    /**
     * 暂停游戏
     */
    public pauseGame(): void {
        GameStateManager.instance.changeState(GameState.PAUSED);
        this.gameTimer.pause();
    }

    /**
     * 恢复游戏
     */
    public resumeGame(): void {
        GameStateManager.instance.changeState(GameState.PLAYING);
        this.gameTimer.resume();
    }

    /**
     * 获取计时器
     */
    public getTimer(): GameTimer {
        return this.gameTimer;
    }

    /**
     * 获取角色管理器
     */
    public getRoleManager(): RoleSwapManager {
        return this.roleSwapManager;
    }
}