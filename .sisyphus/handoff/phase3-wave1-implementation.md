# Phase 3 Wave 1 - Implementation Code

This file contains the implementation for Breakout module Wave 1 tasks.

---

## Task 1: BreakoutTypes.ts

**Target File:** `game/block-vs-block/assets/scripts/breakout/BreakoutTypes.ts`

```typescript
/**
 * 弹球模块类型定义
 */

/**
 * 砖块类型枚举
 */
export enum BrickType {
    NORMAL = 'NORMAL',       // 普通砖块
    COPPER = 'COPPER',       // 铜砖（需击中2次）
    GOLD = 'GOLD',           // 金砖（+5分，掉落道具）
    STEEL = 'STEEL',         // 钢砖（不可破坏）
    BOMB = 'BOMB'            // 炸弹砖（爆炸消除周围）
}

/**
 * 砖块颜色
 */
export enum BrickColor {
    WHITE = '#ffffff',
    GREEN = '#00ff88',
    BLUE = '#4488ff',
    COPPER = '#8b4513',
    GOLD = '#ffd700',
    STEEL = '#808080',
    RED = '#ff4444'
}

/**
 * 位置接口
 */
export interface Position {
    x: number;
    y: number;
}

/**
 * 砖块状态
 */
export interface BrickState {
    type: BrickType;
    gridX: number;          // 网格X坐标
    gridY: number;          // 网格Y坐标
    durability: number;     // 当前耐久
    maxDurability: number;  // 最大耐久
    isDestroyed: boolean;
}

/**
 * 球状态
 */
export interface BallState {
    x: number;
    y: number;
    vx: number;             // X方向速度
    vy: number;             // Y方向速度
    speed: number;          // 当前速度
    isLaunched: boolean;    // 是否已发射
    isAccelerated: boolean; // 是否加速中
}

/**
 * 挡板状态
 */
export interface PaddleState {
    x: number;
    y: number;
    width: number;
    height: number;
    speed: number;
}

/**
 * 碰撞结果
 */
export interface CollisionResult {
    hit: boolean;
    normalX: number;        // 碰撞法线X
    normalY: number;        // 碰撞法线Y
    brickHit?: BrickState;  // 命中的砖块
    isPaddleHit: boolean;   // 是否命中挡板
    isWallHit: boolean;     // 是否命中墙壁
    isBottomHit: boolean;   // 是否命中底部（球丢失）
}

/**
 * 弹球输入类型
 */
export enum BreakoutInput {
    MOVE_LEFT = 'MOVE_LEFT',
    MOVE_RIGHT = 'MOVE_RIGHT',
    LAUNCH = 'LAUNCH',
    ACCELERATE = 'ACCELERATE',
    STOP_ACCELERATE = 'STOP_ACCELERATE'
}

/**
 * 弹球游戏状态
 */
export interface BreakoutGameState {
    balls: BallState[];
    paddle: PaddleState;
    bricks: BrickState[];
    combo: number;
    ballsLost: number;
    score: number;
}

/**
 * 得分事件
 */
export interface BreakoutScoreEvent {
    score: number;
    combo: number;
    brickType: BrickType;
    isComboBonus: boolean;
}

/**
 * 球丢失事件
 */
export interface BallLostEvent {
    ballsLost: number;
    penalty: number;
    isNewBallSpawning: boolean;
}
```

---

## Task 2: BreakoutConfig.ts

**Target File:** `game/block-vs-block/assets/scripts/breakout/BreakoutConfig.ts`

```typescript
/**
 * 弹球模块配置
 */
export class BreakoutConfig {
    /**
     * 场地尺寸（与俄罗斯方块共享）
     */
    public static readonly BOARD_WIDTH = 10;       // 场地宽度（格）
    public static readonly BOARD_HEIGHT = 24;      // 场地高度（格）
    
    /**
     * 砖块配置
     */
    public static readonly BRICK_WIDTH = 1;        // 砖块宽度（格）
    public static readonly BRICK_HEIGHT = 0.5;     // 砖块高度（格）
    public static readonly BRICK_ROWS = 8;         // 砖块行数
    public static readonly BRICK_COLS = 10;        // 砖块列数

    /**
     * 球配置
     */
    public static readonly BALL_RADIUS = 0.3;      // 球半径（格）
    public static readonly BALL_SPEED = 8;         // 球基础速度（格/秒）
    public static readonly BALL_ACCELERATE_MULTIPLIER = 1.5; // 加速倍率
    public static readonly BALL_LAUNCH_ANGLE_MIN = -60; // 发射最小角度
    public static readonly BALL_LAUNCH_ANGLE_MAX = 60;  // 发射最大角度

    /**
     * 挡板配置
     */
    public static readonly PADDLE_WIDTH = 2;       // 挡板宽度（格）
    public static readonly PADDLE_HEIGHT = 0.3;    // 挡板高度（格）
    public static readonly PADDLE_SPEED = 15;      // 挡板移动速度（格/秒）
    public static readonly PADDLE_Y = 1;           // 挡板Y位置

    /**
     * 球丢失配置
     */
    public static readonly MAX_BALLS_LOST = 3;     // 最大丢失球数
    public static readonly BALL_LOST_PENALTY = 10; // 每次丢球扣分
    public static readonly BALL_RESPAWN_DELAY = 5000; // 新球生成延迟（毫秒）

    /**
     * 连击配置
     */
    public static readonly COMBO_TIMEOUT = 2000;   // 连击超时（毫秒）
    public static readonly COMBO_MULTIPLIER = 1;   // 连击加成倍率

    /**
     * 计分规则
     */
    public static readonly SCORE_TABLE = {
        NORMAL: 1,
        COPPER: 2,
        GOLD: 5,
        BOMB: 3
    };

    /**
     * 砖块耐久
     */
    public static readonly BRICK_DURABILITY = {
        NORMAL: 1,
        COPPER: 2,
        GOLD: 1,
        STEEL: Infinity,
        BOMB: 1
    };

    /**
     * 特殊砖块概率
     */
    public static readonly SPECIAL_BRICK_CHANCE = {
        COPPER: 0.1,    // 10%
        GOLD: 0.05,     // 5%
        BOMB: 0.03      // 3%
    };

    /**
     * 炸弹砖块爆炸范围
     */
    public static readonly BOMB_EXPLOSION_RADIUS = 1.5; // 格

    /**
     * 碰撞检测精度
     */
    public static readonly COLLISION_ITERATIONS = 4;

    /**
     * 球反弹角度限制
     */
    public static readonly MIN_BOUNCE_ANGLE = 15;  // 最小反弹角度（度）
    public static readonly MAX_BOUNCE_ANGLE = 75;  // 最大反弹角度（度）
}
```

---

## Task 3: Brick.ts

**Target File:** `game/block-vs-block/assets/scripts/breakout/Brick.ts`

```typescript
import { BrickType, BrickState, BrickColor } from './BreakoutTypes';
import { BreakoutConfig } from './BreakoutConfig';

/**
 * 砖块类
 */
export class Brick {
    private state: BrickState;

    constructor(gridX: number, gridY: number, type: BrickType = BrickType.NORMAL) {
        this.state = {
            type,
            gridX,
            gridY,
            durability: BreakoutConfig.BRICK_DURABILITY[type] || 1,
            maxDurability: BreakoutConfig.BRICK_DURABILITY[type] || 1,
            isDestroyed: false
        };
    }

    /**
     * 获取状态
     */
    public getState(): BrickState {
        return { ...this.state };
    }

    /**
     * 获取位置（格坐标）
     */
    public getPosition(): { x: number; y: number } {
        return {
            x: this.state.gridX,
            y: this.state.gridY
        };
    }

    /**
     * 获取实际位置（场景坐标）
     */
    public getWorldPosition(): { x: number; y: number } {
        return {
            x: this.state.gridX * BreakoutConfig.BRICK_WIDTH,
            y: this.state.gridY * BreakoutConfig.BRICK_HEIGHT
        };
    }

    /**
     * 获取碰撞盒
     */
    public getBounds(): { left: number; right: number; top: number; bottom: number } {
        const pos = this.getWorldPosition();
        const halfWidth = BreakoutConfig.BRICK_WIDTH / 2;
        const halfHeight = BreakoutConfig.BRICK_HEIGHT / 2;
        
        return {
            left: pos.x - halfWidth,
            right: pos.x + halfWidth,
            top: pos.y + halfHeight,
            bottom: pos.y - halfHeight
        };
    }

    /**
     * 受到攻击
     * @returns 是否被摧毁
     */
    public hit(): boolean {
        if (this.state.isDestroyed) {
            return false;
        }

        // 钢砖不受损
        if (this.state.type === BrickType.STEEL) {
            return false;
        }

        this.state.durability--;
        
        if (this.state.durability <= 0) {
            this.state.isDestroyed = true;
            return true;
        }

        return false;
    }

    /**
     * 是否已摧毁
     */
    public isDestroyed(): boolean {
        return this.state.isDestroyed;
    }

    /**
     * 是否可破坏
     */
    public isDestructible(): boolean {
        return this.state.type !== BrickType.STEEL;
    }

    /**
     * 获取类型
     */
    public getType(): BrickType {
        return this.state.type;
    }

    /**
     * 获取颜色
     */
    public getColor(): string {
        switch (this.state.type) {
            case BrickType.COPPER:
                return BrickColor.COPPER;
            case BrickType.GOLD:
                return BrickColor.GOLD;
            case BrickType.STEEL:
                return BrickColor.STEEL;
            case BrickType.BOMB:
                return BrickColor.RED;
            default:
                return BrickColor.WHITE;
        }
    }

    /**
     * 获取得分
     */
    public getScore(): number {
        switch (this.state.type) {
            case BrickType.COPPER:
                return BreakoutConfig.SCORE_TABLE.COPPER;
            case BrickType.GOLD:
                return BreakoutConfig.SCORE_TABLE.GOLD;
            case BrickType.BOMB:
                return BreakoutConfig.SCORE_TABLE.BOMB;
            default:
                return BreakoutConfig.SCORE_TABLE.NORMAL;
        }
    }

    /**
     * 摧毁砖块
     */
    public destroy(): void {
        this.state.isDestroyed = true;
    }

    /**
     * 重置砖块
     */
    public reset(): void {
        this.state.durability = this.state.maxDurability;
        this.state.isDestroyed = false;
    }

    /**
     * 是否是炸弹砖块
     */
    public isBomb(): boolean {
        return this.state.type === BrickType.BOMB;
    }

    /**
     * 获取爆炸范围
     */
    public getExplosionRadius(): number {
        return BreakoutConfig.BOMB_EXPLOSION_RADIUS;
    }
}
```

---

## Task 4: Paddle.ts

**Target File:** `game/block-vs-block/assets/scripts/breakout/Paddle.ts`

```typescript
import { PaddleState, BreakoutInput } from './BreakoutTypes';
import { BreakoutConfig } from './BreakoutConfig';

/**
 * 挡板类
 */
export class Paddle {
    private state: PaddleState;
    private moveDirection: number = 0; // -1: 左, 0: 停, 1: 右

    constructor() {
        this.state = {
            x: BreakoutConfig.BOARD_WIDTH / 2,
            y: BreakoutConfig.PADDLE_Y,
            width: BreakoutConfig.PADDLE_WIDTH,
            height: BreakoutConfig.PADDLE_HEIGHT,
            speed: BreakoutConfig.PADDLE_SPEED
        };
    }

    /**
     * 获取状态
     */
    public getState(): PaddleState {
        return { ...this.state };
    }

    /**
     * 获取位置
     */
    public getPosition(): { x: number; y: number } {
        return { x: this.state.x, y: this.state.y };
    }

    /**
     * 获取碰撞盒
     */
    public getBounds(): { left: number; right: number; top: number; bottom: number } {
        const halfWidth = this.state.width / 2;
        const halfHeight = this.state.height / 2;
        
        return {
            left: this.state.x - halfWidth,
            right: this.state.x + halfWidth,
            top: this.state.y + halfHeight,
            bottom: this.state.y - halfHeight
        };
    }

    /**
     * 更新挡板
     */
    public update(deltaTime: number): void {
        if (this.moveDirection === 0) {
            return;
        }

        // 移动
        const movement = this.moveDirection * this.state.speed * deltaTime;
        this.state.x += movement;

        // 边界限制
        const halfWidth = this.state.width / 2;
        const minX = halfWidth;
        const maxX = BreakoutConfig.BOARD_WIDTH - halfWidth;

        this.state.x = Math.max(minX, Math.min(maxX, this.state.x));
    }

    /**
     * 处理输入
     */
    public handleInput(input: BreakoutInput): void {
        switch (input) {
            case BreakoutInput.MOVE_LEFT:
                this.moveDirection = -1;
                break;
            case BreakoutInput.MOVE_RIGHT:
                this.moveDirection = 1;
                break;
            case BreakoutInput.STOP_ACCELERATE:
                this.moveDirection = 0;
                break;
            default:
                this.moveDirection = 0;
        }
    }

    /**
     * 停止移动
     */
    public stop(): void {
        this.moveDirection = 0;
    }

    /**
     * 设置位置
     */
    public setPosition(x: number): void {
        const halfWidth = this.state.width / 2;
        const minX = halfWidth;
        const maxX = BreakoutConfig.BOARD_WIDTH - halfWidth;
        
        this.state.x = Math.max(minX, Math.min(maxX, x));
    }

    /**
     * 重置
     */
    public reset(): void {
        this.state.x = BreakoutConfig.BOARD_WIDTH / 2;
        this.moveDirection = 0;
    }

    /**
     * 计算球碰撞后的反弹角度
     * 根据球击中挡板的位置计算反弹方向
     */
    public calculateBounceAngle(ballX: number): number {
        // 计算击中位置相对于挡板中心的偏移
        const relativeX = ballX - this.state.x;
        const normalizedX = relativeX / (this.state.width / 2);
        
        // 将偏移映射到反弹角度
        const minAngle = BreakoutConfig.MIN_BOUNCE_ANGLE;
        const maxAngle = BreakoutConfig.MAX_BOUNCE_ANGLE;
        const angleRange = maxAngle - minAngle;
        
        // 根据击中位置计算角度
        // 左侧：-60° ~ -15°, 中心：约45°, 右侧：15° ~ 60°
        const angle = 45 + normalizedX * angleRange;
        
        // 限制角度范围
        return Math.max(minAngle, Math.min(maxAngle, angle));
    }
}
```

---

## Summary

Wave 1 creates 4 files:

1. **BreakoutTypes.ts** - 类型定义（砖块类型、球状态、挡板状态、碰撞结果）
2. **BreakoutConfig.ts** - 配置常量（场地、球、挡板、砖块、计分）
3. **Brick.ts** - 砖块类（5种砖块、碰撞盒、耐久、得分）
4. **Paddle.ts** - 挡板类（移动、边界限制、反弹角度计算）

All files should be written to: `game/block-vs-block/assets/scripts/breakout/`