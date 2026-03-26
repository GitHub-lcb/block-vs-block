# Phase 4 Wave 1-2 - Implementation Code

This file contains the implementation for Shared Field module.

---

## Task 1: GameTimer.ts

**Target File:** `game/block-vs-block/assets/scripts/shared/GameTimer.ts`

```typescript
import { _decorator } from 'cc';

const { ccclass } = _decorator;

/**
 * 游戏计时器
 * 管理30秒回合和3分钟总时长
 */
@ccclass('GameTimer')
export class GameTimer {
    // 总游戏时长（毫秒）
    private totalGameTime: number = 180000; // 3分钟
    
    // 回合时长（毫秒）
    private roundDuration: number = 30000; // 30秒
    
    // 警告开始时间（毫秒）
    private warningStartTime: number = 25000; // 25秒
    
    // 当前状态
    private elapsedTime: number = 0;
    private roundTime: number = 0;
    private currentRound: number = 1;
    private totalRounds: number = 6;
    private isRunning: boolean = false;
    private isPaused: boolean = false;
    
    // 回调
    private onRoundEnd?: () => void;
    private onWarning?: () => void;
    private onGameEnd?: () => void;

    /**
     * 更新计时器
     */
    public update(deltaTime: number): void {
        if (!this.isRunning || this.isPaused) return;

        const dt = deltaTime * 1000; // 转换为毫秒
        this.elapsedTime += dt;
        this.roundTime += dt;

        // 检查警告
        if (this.roundTime >= this.warningStartTime && this.roundTime < this.warningStartTime + dt) {
            this.onWarning?.();
        }

        // 检查回合结束
        if (this.roundTime >= this.roundDuration) {
            this.handleRoundEnd();
        }

        // 检查游戏结束
        if (this.elapsedTime >= this.totalGameTime) {
            this.handleGameEnd();
        }
    }

    /**
     * 处理回合结束
     */
    private handleRoundEnd(): void {
        this.roundTime = 0;
        this.currentRound++;
        
        if (this.currentRound <= this.totalRounds) {
            this.onRoundEnd?.();
        }
    }

    /**
     * 处理游戏结束
     */
    private handleGameEnd(): void {
        this.isRunning = false;
        this.onGameEnd?.();
    }

    /**
     * 开始游戏
     */
    public start(): void {
        this.reset();
        this.isRunning = true;
    }

    /**
     * 暂停
     */
    public pause(): void {
        this.isPaused = true;
    }

    /**
     * 恢复
     */
    public resume(): void {
        this.isPaused = false;
    }

    /**
     * 重置
     */
    public reset(): void {
        this.elapsedTime = 0;
        this.roundTime = 0;
        this.currentRound = 1;
        this.isRunning = false;
        this.isPaused = false;
    }

    // ===== Getters =====

    public getRemainingTime(): number {
        return Math.max(0, this.totalGameTime - this.elapsedTime);
    }

    public getRoundRemainingTime(): number {
        return Math.max(0, this.roundDuration - this.roundTime);
    }

    public getCurrentRound(): number {
        return this.currentRound;
    }

    public getTotalRounds(): number {
        return this.totalRounds;
    }

    public isWarningPhase(): boolean {
        return this.roundTime >= this.warningStartTime;
    }

    public getRoundProgress(): number {
        return this.roundTime / this.roundDuration;
    }

    public getElapsedSeconds(): number {
        return Math.floor(this.elapsedTime / 1000);
    }

    public getRemainingSeconds(): number {
        return Math.ceil(this.getRemainingTime() / 1000);
    }

    // ===== Setters =====

    public setCallbacks(onRoundEnd: () => void, onWarning: () => void, onGameEnd: () => void): void {
        this.onRoundEnd = onRoundEnd;
        this.onWarning = onWarning;
        this.onGameEnd = onGameEnd;
    }
}
```

---

## Task 2: RoleSwapManager.ts

**Target File:** `game/block-vs-block/assets/scripts/shared/RoleSwapManager.ts`

```typescript
import { _decorator } from 'cc';
import { EventBus, GameEventType } from '../core/EventBus';
import { GameStateManager, GameState } from '../core/GameStateManager';

const { ccclass } = _decorator;

/**
 * 玩家角色
 */
export enum PlayerRole {
    TETRIS = 'TETRIS',
    BREAKOUT = 'BREAKOUT'
}

/**
 * 角色互换管理器
 */
@ccclass('RoleSwapManager')
export class RoleSwapManager {
    private p1Role: PlayerRole = PlayerRole.TETRIS;
    private p2Role: PlayerRole = PlayerRole.BREAKOUT;
    private swapCount: number = 0;
    private isSwapping: boolean = false;
    private swapAnimationDuration: number = 500; // 0.5秒

    /**
     * 获取玩家角色
     */
    public getPlayerRole(playerId: 1 | 2): PlayerRole {
        return playerId === 1 ? this.p1Role : this.p2Role;
    }

    /**
     * 执行角色互换
     */
    public swap(): void {
        if (this.isSwapping) return;

        this.isSwapping = true;
        this.swapCount++;

        // 切换状态
        GameStateManager.instance.changeState(GameState.SWAPPING);

        // 互换角色
        const temp = this.p1Role;
        this.p1Role = this.p2Role;
        this.p2Role = temp;

        // 发送事件
        EventBus.instance.emit(GameEventType.ROLE_SWAP_START, {
            roundNumber: this.swapCount + 1,
            p1NewRole: this.p1Role,
            p2NewRole: this.p2Role
        });

        // 模拟动画时间后完成
        setTimeout(() => {
            this.completeSwap();
        }, this.swapAnimationDuration);
    }

    /**
     * 完成交换
     */
    private completeSwap(): void {
        this.isSwapping = false;

        EventBus.instance.emit(GameEventType.ROLE_SWAP_COMPLETE, {
            p1Role: this.p1Role,
            p2Role: this.p2Role
        });

        EventBus.instance.emit(GameEventType.ROUND_START, {
            roundNumber: this.swapCount + 1
        });

        // 切换到正常游戏状态
        GameStateManager.instance.changeState(GameState.PLAYING);
    }

    /**
     * 是否正在互换
     */
    public isInSwap(): boolean {
        return this.isSwapping;
    }

    /**
     * 获取互换次数
     */
    public getSwapCount(): number {
        return this.swapCount;
    }

    /**
     * 重置
     */
    public reset(): void {
        this.p1Role = PlayerRole.TETRIS;
        this.p2Role = PlayerRole.BREAKOUT;
        this.swapCount = 0;
        this.isSwapping = false;
    }
}
```

---

## Task 3: SharedField.ts

**Target File:** `game/block-vs-block/assets/scripts/shared/SharedField.ts`

```typescript
import { _decorator } from 'cc';
import { TetrisBoard } from '../tetris/TetrisBoard';
import { BreakoutBoard } from '../breakout/BreakoutBoard';
import { BrickType } from '../breakout/BreakoutTypes';
import { BlockType } from '../tetris/TetrisTypes';
import { EventBus, GameEventType } from '../core/EventBus';
import { TetrisConfig } from '../tetris/TetrisConfig';

const { ccclass } = _decorator;

/**
 * 共享场地管理器
 * 管理俄罗斯方块和弹球的共享场地
 */
@ccclass('SharedField')
export class SharedField {
    private tetrisBoard: TetrisBoard;
    private breakoutBoard: BreakoutBoard;

    constructor() {
        this.tetrisBoard = new TetrisBoard();
        this.breakoutBoard = new BreakoutBoard();
    }

    /**
     * 获取俄罗斯方块场地
     */
    public getTetrisBoard(): TetrisBoard {
        return this.tetrisBoard;
    }

    /**
     * 获取弹球场地
     */
    public getBreakoutBoard(): BreakoutBoard {
        return this.breakoutBoard;
    }

    /**
     * 方块落地后转换为砖块
     */
    public convertTetrisToBricks(): void {
        const grid = this.tetrisBoard.getGrid();
        
        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[y].length; x++) {
                const cell = grid[y][x];
                if (cell.type !== null) {
                    // 在弹球场地中添加砖块
                    // 注意：坐标转换（俄罗斯方块y轴向上，弹球y轴向下）
                    const brickY = TetrisConfig.BOARD_HEIGHT - y;
                    this.breakoutBoard.addBrick(x, brickY, BrickType.NORMAL);
                }
            }
        }

        EventBus.instance.emit(GameEventType.TETRIS_PIECE_LAND, {
            bricksConverted: this.countBricks()
        });
    }

    /**
     * 行消除后通知弹球场地
     */
    public onLinesCleared(linesCleared: number[]): void {
        EventBus.instance.emit(GameEventType.TETRIS_LINE_CLEAR, {
            lines: linesCleared.length
        });
    }

    /**
     * 重置场地（互换时）
     */
    public reset(): void {
        // 清空俄罗斯方块场地
        this.tetrisBoard.reset();
        
        // 清空弹球砖块（保留钢砖可选）
        this.breakoutBoard.clearBricks();
        
        // 重置球
        const balls = this.breakoutBoard.getBalls();
        for (const ball of balls) {
            ball.reset();
        }

        EventBus.instance.emit(GameEventType.ROUND_START, {});
    }

    /**
     * 统计砖块数量
     */
    private countBricks(): number {
        return this.breakoutBoard.getBrickCount();
    }

    /**
     * 更新场地
     */
    public update(deltaTime: number): void {
        this.breakoutBoard.update(deltaTime);
    }
}
```

---

## Task 4: GameFlowManager.ts

**Target File:** `game/block-vs-block/assets/scripts/shared/GameFlowManager.ts`

```typescript
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
```

---

## Task 5: index.ts

**Target File:** `game/block-vs-block/assets/scripts/shared/index.ts`

```typescript
/**
 * 共享模块导出
 */

export { GameTimer } from './GameTimer';
export { RoleSwapManager, PlayerRole } from './RoleSwapManager';
export { SharedField } from './SharedField';
export { GameFlowManager } from './GameFlowManager';
```

---

## Summary

Phase 4 creates 5 files:

1. **GameTimer.ts** - 游戏计时器（30秒回合、3分钟总时长、警告回调）
2. **RoleSwapManager.ts** - 角色互换管理器（角色切换、动画触发）
3. **SharedField.ts** - 共享场地管理（方块转砖块、场地重置）
4. **GameFlowManager.ts** - 游戏流程管理器（整合所有系统）
5. **index.ts** - 模块导出

All files should be written to: `game/block-vs-block/assets/scripts/shared/`