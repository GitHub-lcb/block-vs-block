# Phase 7 - 优化与测试实现代码

---

## 文件 1: ObjectPool.ts

**目标文件:** `game/block-vs-block/assets/scripts/core/ObjectPool.ts`

```typescript
/**
 * 对象池
 * 用于复用游戏对象，提升性能
 */
export class ObjectPool<T> {
    private pool: T[] = [];
    private createFn: () => T;
    private resetFn: (obj: T) => void;
    private maxSize: number;

    constructor(
        createFn: () => T,
        resetFn: (obj: T) => void,
        initialSize: number = 10,
        maxSize: number = 50
    ) {
        this.createFn = createFn;
        this.resetFn = resetFn;
        this.maxSize = maxSize;

        // 预创建对象
        for (let i = 0; i < initialSize; i++) {
            this.pool.push(this.createFn());
        }
    }

    /**
     * 获取对象
     */
    public get(): T {
        if (this.pool.length > 0) {
            return this.pool.pop()!;
        }
        return this.createFn();
    }

    /**
     * 归还对象
     */
    public release(obj: T): void {
        if (this.pool.length < this.maxSize) {
            this.resetFn(obj);
            this.pool.push(obj);
        }
    }

    /**
     * 清空池
     */
    public clear(): void {
        this.pool = [];
    }

    /**
     * 获取池大小
     */
    public size(): number {
        return this.pool.length;
    }
}

/**
 * 对象池管理器
 */
export class PoolManager {
    private static pools: Map<string, ObjectPool<any>> = new Map();

    /**
     * 注册对象池
     */
    public static register<T>(
        name: string,
        createFn: () => T,
        resetFn: (obj: T) => void,
        initialSize: number = 10,
        maxSize: number = 50
    ): void {
        this.pools.set(name, new ObjectPool(createFn, resetFn, initialSize, maxSize));
    }

    /**
     * 获取对象
     */
    public static get<T>(name: string): T {
        const pool = this.pools.get(name);
        if (!pool) {
            console.warn(`Pool "${name}" not found`);
            return null as T;
        }
        return pool.get();
    }

    /**
     * 归还对象
     */
    public static release<T>(name: string, obj: T): void {
        const pool = this.pools.get(name);
        if (pool) {
            pool.release(obj);
        }
    }

    /**
     * 清空所有池
     */
    public static clearAll(): void {
        this.pools.forEach(pool => pool.clear());
    }
}
```

---

## 文件 2: GameConfig.ts

**目标文件:** `game/block-vs-block/assets/scripts/core/GameConfig.ts`

```typescript
/**
 * 游戏全局配置
 */
export class GameConfig {
    /**
     * 游戏时长（毫秒）
     */
    public static readonly GAME_DURATION = 180000; // 3分钟

    /**
     * 回合时长（毫秒）
     */
    public static readonly ROUND_DURATION = 30000; // 30秒

    /**
     * 警告开始时间（毫秒）
     */
    public static readonly WARNING_START_TIME = 25000; // 25秒

    /**
     * 总回合数
     */
    public static readonly TOTAL_ROUNDS = 6;

    /**
     * 场地尺寸
     */
    public static readonly FIELD_WIDTH = 10;
    public static readonly FIELD_HEIGHT = 24;

    /**
     * 分数配置
     */
    public static readonly SCORE = {
        // 俄罗斯方块
        TETRIS_SINGLE: 100,
        TETRIS_DOUBLE: 300,
        TETRIS_TRIPLE: 500,
        TETRIS_TETRIS: 800,
        TETRIS_TSPIN: 800,
        TETRIS_TSPIN_SINGLE: 800,
        TETRIS_TSPIN_DOUBLE: 1200,
        TETRIS_TSPIN_TRIPLE: 1600,
        TETRIS_PERFECT_CLEAR: 800,
        TETRIS_BACK_TO_BACK_MULTIPLIER: 1.5,

        // 弹球
        BREAKOUT_NORMAL: 1,
        BREAKOUT_COPPER: 2,
        BREAKOUT_GOLD: 5,
        BREAKOUT_BOMB: 3,
        BREAKOUT_COMBO_MULTIPLIER: 1,

        // 惩罚
        BALL_LOST_PENALTY: 10
    };

    /**
     * 球配置
     */
    public static readonly BALL = {
        MAX_LOST: 3,
        RESPAWN_DELAY: 5000,
        BASE_SPEED: 8,
        ACCELERATE_MULTIPLIER: 1.5
    };

    /**
     * 砖块概率
     */
    public static readonly BRICK_CHANCE = {
        COPPER: 0.10,   // 10%
        GOLD: 0.05,     // 5%
        BOMB: 0.03      // 3%
    };

    /**
     * 性能配置
     */
    public static readonly PERFORMANCE = {
        MAX_PARTICLES: 200,
        OBJECT_POOL_SIZE: 50,
        UPDATE_INTERVAL: 16 // 60 FPS
    };

    /**
     * 音量默认值
     */
    public static readonly AUDIO = {
        BGM_VOLUME: 0.5,
        SFX_VOLUME: 0.7
    };

    /**
     * 震动反馈
     */
    public static readonly VIBRATION = {
        PIECE_LAND: 50,      // 毫秒
        LINE_CLEAR: 100,
        BRICK_DESTROY: 30,
        ROLE_SWAP: 150,
        BALL_LOST: 200
    };
}
```

---

## 文件 3: GameValidator.ts

**目标文件:** `game/block-vs-block/assets/scripts/core/GameValidator.ts`

```typescript
import { BlockType, RotationState, Position } from '../tetris/TetrisTypes';
import { BrickType } from '../breakout/BreakoutTypes';

/**
 * 游戏验证器
 * 验证游戏状态和数据有效性
 */
export class GameValidator {
    /**
     * 验证方块类型
     */
    public static isValidBlockType(type: string): boolean {
        const validTypes = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
        return validTypes.includes(type);
    }

    /**
     * 验证砖块类型
     */
    public static isValidBrickType(type: string): boolean {
        const validTypes = ['NORMAL', 'COPPER', 'GOLD', 'STEEL', 'BOMB'];
        return validTypes.includes(type);
    }

    /**
     * 验证场地坐标
     */
    public static isValidFieldPosition(x: number, y: number): boolean {
        return x >= 0 && x < 10 && y >= 0 && y < 24;
    }

    /**
     * 验证旋转状态
     */
    public static isValidRotation(rotation: number): boolean {
        return rotation >= 0 && rotation <= 3;
    }

    /**
     * 验证分数
     */
    public static isValidScore(score: number): boolean {
        return Number.isInteger(score) && score >= 0;
    }

    /**
     * 验证回合数
     */
    public static isValidRound(round: number): boolean {
        return Number.isInteger(round) && round >= 1 && round <= 6;
    }

    /**
     * 验证玩家ID
     */
    public static isValidPlayerId(playerId: number): boolean {
        return playerId === 1 || playerId === 2;
    }

    /**
     * 验证时间值
     */
    public static isValidTime(time: number): boolean {
        return Number.isInteger(time) && time >= 0;
    }

    /**
     * 验证连击数
     */
    public static isValidCombo(combo: number): boolean {
        return Number.isInteger(combo) && combo >= 0;
    }

    /**
     * 验证等级
     */
    public static isValidLevel(level: number): boolean {
        return Number.isInteger(level) && level >= 1 && level <= 15;
    }

    /**
     * 验证游戏结束条件
     */
    public static checkGameOver(
        p1Score: number,
        p2Score: number,
        elapsedTime: number,
        fieldOverflow: boolean
    ): { isOver: boolean; winner: number | null; reason: string | null } {
        // 时间结束
        if (elapsedTime >= 180000) {
            return {
                isOver: true,
                winner: p1Score > p2Score ? 1 : (p2Score > p1Score ? 2 : null),
                reason: '时间结束'
            };
        }

        // 场地溢出（由外部检测）
        if (fieldOverflow) {
            return {
                isOver: true,
                winner: null, // 需要知道是哪个玩家溢出
                reason: '场地溢出'
            };
        }

        return { isOver: false, winner: null, reason: null };
    }
}
```

---

## 文件 4: GameStats.ts

**目标文件:** `game/block-vs-block/assets/scripts/core/GameStats.ts`

```typescript
/**
 * 游戏统计数据
 */
export interface PlayerStats {
    // 总分
    totalScore: number;
    
    // 俄罗斯方块统计
    tetrisScore: number;
    linesCleared: number;
    tetrominosPlaced: number;
    tSpins: number;
    perfectClears: number;
    maxCombo: number;
    
    // 弹球统计
    breakoutScore: number;
    bricksDestroyed: number;
    maxBreakoutCombo: number;
    ballsLost: number;
    
    // 道具统计
    itemsAcquired: number;
    itemsUsed: number;
}

/**
 * 游戏统计管理器
 */
export class GameStatsManager {
    private static _instance: GameStatsManager | null = null;

    private p1Stats: PlayerStats;
    private p2Stats: PlayerStats;
    private gameStartTime: number = 0;
    private roundStartTime: number = 0;

    public static get instance(): GameStatsManager {
        if (!GameStatsManager._instance) {
            GameStatsManager._instance = new GameStatsManager();
        }
        return GameStatsManager._instance;
    }

    private constructor() {
        this.p1Stats = this.createEmptyStats();
        this.p2Stats = this.createEmptyStats();
    }

    private createEmptyStats(): PlayerStats {
        return {
            totalScore: 0,
            tetrisScore: 0,
            linesCleared: 0,
            tetrominosPlaced: 0,
            tSpins: 0,
            perfectClears: 0,
            maxCombo: 0,
            breakoutScore: 0,
            bricksDestroyed: 0,
            maxBreakoutCombo: 0,
            ballsLost: 0,
            itemsAcquired: 0,
            itemsUsed: 0
        };
    }

    /**
     * 开始新游戏
     */
    public startGame(): void {
        this.p1Stats = this.createEmptyStats();
        this.p2Stats = this.createEmptyStats();
        this.gameStartTime = Date.now();
        this.roundStartTime = Date.now();
    }

    /**
     * 开始新回合
     */
    public startRound(): void {
        this.roundStartTime = Date.now();
    }

    /**
     * 添加分数
     */
    public addScore(playerId: 1 | 2, score: number, source: 'tetris' | 'breakout'): void {
        const stats = playerId === 1 ? this.p1Stats : this.p2Stats;
        stats.totalScore += score;
        
        if (source === 'tetris') {
            stats.tetrisScore += score;
        } else {
            stats.breakoutScore += score;
        }
    }

    /**
     * 记录行消除
     */
    public recordLinesCleared(playerId: 1 | 2, lines: number): void {
        const stats = playerId === 1 ? this.p1Stats : this.p2Stats;
        stats.linesCleared += lines;
    }

    /**
     * 记录方块放置
     */
    public recordTetrominoPlaced(playerId: 1 | 2): void {
        const stats = playerId === 1 ? this.p1Stats : this.p2Stats;
        stats.tetrominosPlaced++;
    }

    /**
     * 记录T-Spin
     */
    public recordTSpin(playerId: 1 | 2): void {
        const stats = playerId === 1 ? this.p1Stats : this.p2Stats;
        stats.tSpins++;
    }

    /**
     * 记录完美消除
     */
    public recordPerfectClear(playerId: 1 | 2): void {
        const stats = playerId === 1 ? this.p1Stats : this.p2Stats;
        stats.perfectClears++;
    }

    /**
     * 记录连击
     */
    public recordCombo(playerId: 1 | 2, combo: number, type: 'tetris' | 'breakout'): void {
        const stats = playerId === 1 ? this.p1Stats : this.p2Stats;
        
        if (type === 'tetris') {
            stats.maxCombo = Math.max(stats.maxCombo, combo);
        } else {
            stats.maxBreakoutCombo = Math.max(stats.maxBreakoutCombo, combo);
        }
    }

    /**
     * 记录砖块击碎
     */
    public recordBrickDestroyed(playerId: 1 | 2, count: number = 1): void {
        const stats = playerId === 1 ? this.p1Stats : this.p2Stats;
        stats.bricksDestroyed += count;
    }

    /**
     * 记录球丢失
     */
    public recordBallLost(playerId: 1 | 2): void {
        const stats = playerId === 1 ? this.p1Stats : this.p2Stats;
        stats.ballsLost++;
    }

    /**
     * 记录道具获得
     */
    public recordItemAcquired(playerId: 1 | 2): void {
        const stats = playerId === 1 ? this.p1Stats : this.p2Stats;
        stats.itemsAcquired++;
    }

    /**
     * 记录道具使用
     */
    public recordItemUsed(playerId: 1 | 2): void {
        const stats = playerId === 1 ? this.p1Stats : this.p2Stats;
        stats.itemsUsed++;
    }

    /**
     * 获取玩家统计
     */
    public getStats(playerId: 1 | 2): PlayerStats {
        return playerId === 1 ? { ...this.p1Stats } : { ...this.p2Stats };
    }

    /**
     * 获取游戏时长（毫秒）
     */
    public getGameDuration(): number {
        return Date.now() - this.gameStartTime;
    }

    /**
     * 获取回合时长（毫秒）
     */
    public getRoundDuration(): number {
        return Date.now() - this.roundStartTime;
    }

    /**
     * 生成游戏报告
     */
    public generateReport(): {
        p1Stats: PlayerStats;
        p2Stats: PlayerStats;
        winner: number | null;
        gameDuration: number;
    } {
        return {
            p1Stats: { ...this.p1Stats },
            p2Stats: { ...this.p2Stats },
            winner: this.p1Stats.totalScore > this.p2Stats.totalScore ? 1
                : (this.p2Stats.totalScore > this.p1Stats.totalScore ? 2 : null),
            gameDuration: this.getGameDuration()
        };
    }

    /**
     * 重置
     */
    public reset(): void {
        this.p1Stats = this.createEmptyStats();
        this.p2Stats = this.createEmptyStats();
        this.gameStartTime = 0;
        this.roundStartTime = 0;
    }
}
```

---

## 文件 5: index.ts (core)

**目标文件:** `game/block-vs-block/assets/scripts/core/index.ts`

```typescript
/**
 * Core 模块导出
 */

export { GameStateManager, GameState } from './GameStateManager';
export { EventBus, GameEventType } from './EventBus';
export { AudioManager, SoundType, BGMType } from './AudioManager';
export { ObjectPool, PoolManager } from './ObjectPool';
export { GameConfig } from './GameConfig';
export { GameValidator } from './GameValidator';
export { GameStatsManager, PlayerStats } from './GameStats';
export { SFXType, BGMType as SoundBGMType, SoundConfig } from './SoundConfig';
```

---

## 总结

Phase 7 创建 5 个文件：

1. **ObjectPool.ts** - 对象池（性能优化）
2. **GameConfig.ts** - 游戏全局配置
3. **GameValidator.ts** - 游戏验证器
4. **GameStats.ts** - 游戏统计管理器
5. **index.ts** (core) - 核心模块导出

文件位置：
- `game/block-vs-block/assets/scripts/core/ObjectPool.ts`
- `game/block-vs-block/assets/scripts/core/GameConfig.ts`
- `game/block-vs-block/assets/scripts/core/GameValidator.ts`
- `game/block-vs-block/assets/scripts/core/GameStats.ts`
- `game/block-vs-block/assets/scripts/core/index.ts`