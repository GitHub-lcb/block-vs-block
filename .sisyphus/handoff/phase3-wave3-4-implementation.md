# Phase 3 Wave 3-4 - Implementation Code

This file contains the implementation for Breakout module Wave 3-4 tasks.

---

## Task 9: ComboSystem.ts

**Target File:** `game/block-vs-block/assets/scripts/breakout/ComboSystem.ts`

```typescript
import { BreakoutConfig } from './BreakoutConfig';

/**
 * 连击系统
 */
export class ComboSystem {
    private combo: number = 0;
    private lastHitTime: number = 0;
    private maxCombo: number = 0;

    /**
     * 记录击中
     */
    public recordHit(currentTime: number): void {
        if (currentTime - this.lastHitTime <= BreakoutConfig.COMBO_TIMEOUT) {
            this.combo++;
        } else {
            this.combo = 1;
        }
        
        this.lastHitTime = currentTime;
        this.maxCombo = Math.max(this.maxCombo, this.combo);
    }

    /**
     * 球丢失时重置连击
     */
    public resetCombo(): void {
        this.combo = 0;
    }

    /**
     * 获取当前连击数
     */
    public getCombo(): number {
        return this.combo;
    }

    /**
     * 获取最大连击数
     */
    public getMaxCombo(): number {
        return this.maxCombo;
    }

    /**
     * 计算连击加成分数
     */
    public calculateComboBonus(baseScore: number): number {
        if (this.combo <= 1) return 0;
        return this.combo * BreakoutConfig.COMBO_MULTIPLIER;
    }

    /**
     * 获取连击状态
     */
    public isActive(): boolean {
        return this.combo > 1;
    }

    /**
     * 重置系统
     */
    public reset(): void {
        this.combo = 0;
        this.lastHitTime = 0;
        this.maxCombo = 0;
    }
}
```

---

## Task 10: BallSpawner.ts

**Target File:** `game/block-vs-block/assets/scripts/breakout/BallSpawner.ts`

```typescript
import { BreakoutConfig } from './BreakoutConfig';
import { BreakoutBoard } from './BreakoutBoard';
import { Ball } from './Ball';

/**
 * 球生成器
 */
export class BallSpawner {
    private board: BreakoutBoard;
    private ballsLost: number = 0;
    private spawnTimer: number = 0;
    private isSpawning: boolean = false;

    constructor(board: BreakoutBoard) {
        this.board = board;
    }

    /**
     * 请求生成新球
     */
    public requestSpawn(): void {
        if (this.isSpawning) return;
        
        this.isSpawning = true;
        this.spawnTimer = 0;
    }

    /**
     * 更新生成器
     */
    public update(deltaTime: number): void {
        if (!this.isSpawning) return;

        this.spawnTimer += deltaTime * 1000; // 转换为毫秒

        if (this.spawnTimer >= BreakoutConfig.BALL_RESPAWN_DELAY) {
            this.spawn();
            this.isSpawning = false;
        }
    }

    /**
     * 生成球
     */
    private spawn(): Ball {
        return this.board.addBall();
    }

    /**
     * 记录球丢失
     */
    public recordBallLost(): void {
        this.ballsLost++;
    }

    /**
     * 获取丢失球数
     */
    public getBallsLost(): number {
        return this.ballsLost;
    }

    /**
     * 是否超过最大丢失数
     */
    public isOverLimit(): boolean {
        return this.ballsLost > BreakoutConfig.MAX_BALLS_LOST;
    }

    /**
     * 获取扣分
     */
    public getPenalty(): number {
        if (this.ballsLost <= BreakoutConfig.MAX_BALLS_LOST) {
            return 0;
        }
        return BreakoutConfig.BALL_LOST_PENALTY;
    }

    /**
     * 是否正在生成
     */
    public isSpawningBall(): boolean {
        return this.isSpawning;
    }

    /**
     * 获取剩余生成时间
     */
    public getRemainingSpawnTime(): number {
        if (!this.isSpawning) return 0;
        return Math.max(0, BreakoutConfig.BALL_RESPAWN_DELAY - this.spawnTimer);
    }

    /**
     * 重置生成器
     */
    public reset(): void {
        this.ballsLost = 0;
        this.spawnTimer = 0;
        this.isSpawning = false;
    }
}
```

---

## Task 11: BrickGenerator.ts

**Target File:** `game/block-vs-block/assets/scripts/breakout/BrickGenerator.ts`

```typescript
import { BrickType } from './BreakoutTypes';
import { BreakoutBoard } from './BreakoutBoard';
import { BreakoutConfig } from './BreakoutConfig';

/**
 * 砖块生成器
 * 从俄罗斯方块落地生成砖块
 */
export class BrickGenerator {
    private board: BreakoutBoard;

    constructor(board: BreakoutBoard) {
        this.board = board;
    }

    /**
     * 从方块格子数据生成砖块
     * @param gridData 10x24的网格数据，每个格子包含方块类型或null
     */
    public generateFromTetrisGrid(gridData: (string | null)[][]): void {
        this.board.clearBricks();

        for (let y = 0; y < gridData.length; y++) {
            for (let x = 0; x < gridData[y].length; x++) {
                if (gridData[y][x] !== null) {
                    // 方块存在，生成砖块
                    const brickType = this.determineBrickType();
                    this.board.addBrick(x, y, brickType);
                }
            }
        }
    }

    /**
     * 添加单个砖块（方块落地时）
     */
    public addBrickFromBlock(gridX: number, gridY: number): void {
        const brickType = this.determineBrickType();
        this.board.addBrick(gridX, gridY, brickType);
    }

    /**
     * 确定砖块类型
     */
    private determineBrickType(): BrickType {
        const rand = Math.random();

        // 检查各特殊砖块概率
        if (rand < BreakoutConfig.SPECIAL_BRICK_CHANCE.BOMB) {
            return BrickType.BOMB;
        }
        if (rand < BreakoutConfig.SPECIAL_BRICK_CHANCE.BOMB + BreakoutConfig.SPECIAL_BRICK_CHANCE.GOLD) {
            return BrickType.GOLD;
        }
        if (rand < BreakoutConfig.SPECIAL_BRICK_CHANCE.BOMB + 
                 BreakoutConfig.SPECIAL_BRICK_CHANCE.GOLD + 
                 BreakoutConfig.SPECIAL_BRICK_CHANCE.COPPER) {
            return BrickType.COPPER;
        }

        return BrickType.NORMAL;
    }

    /**
     * 生成钢砖（场地障碍）
     * @param level 当前等级
     */
    public generateSteelBricks(level: number): void {
        const count = level * 2;
        
        for (let i = 0; i < count; i++) {
            const gridX = Math.floor(Math.random() * BreakoutConfig.BOARD_WIDTH);
            const gridY = Math.floor(Math.random() * BreakoutConfig.BRICK_ROWS) + 4; // 从第4行开始
            
            // 不覆盖已有砖块
            if (!this.board.hasBrickAt(gridX, gridY)) {
                this.board.addBrick(gridX, gridY, BrickType.STEEL);
            }
        }
    }

    /**
     * 清空所有砖块
     */
    public clearAllBricks(): void {
        this.board.clearBricks();
    }
}
```

---

## Task 12: BreakoutManager.ts

**Target File:** `game/block-vs-block/assets/scripts/breakout/BreakoutManager.ts`

```typescript
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
```

---

## Task 13: index.ts

**Target File:** `game/block-vs-block/assets/scripts/breakout/index.ts`

```typescript
/**
 * 弹球模块导出
 */

// 类型定义
export * from './BreakoutTypes';

// 配置
export { BreakoutConfig } from './BreakoutConfig';

// 核心组件
export { Brick } from './Brick';
export { Paddle } from './Paddle';
export { Ball } from './Ball';

// 场地
export { BreakoutBoard } from './BreakoutBoard';

// 控制器
export { BreakoutController } from './BreakoutController';

// 碰撞检测
export { CollisionDetector } from './CollisionDetector';

// 辅助系统
export { ComboSystem } from './ComboSystem';
export { BallSpawner } from './BallSpawner';
export { BrickGenerator } from './BrickGenerator';

// 主管理器
export { BreakoutManager } from './BreakoutManager';
```

---

## Summary

Wave 3-4 creates 5 files:

1. **ComboSystem.ts** - 连击系统
2. **BallSpawner.ts** - 球生成器
3. **BrickGenerator.ts** - 砖块生成器
4. **BreakoutManager.ts** - 总管理器
5. **index.ts** - 模块导出

Total: 13 TypeScript files for complete Breakout module.