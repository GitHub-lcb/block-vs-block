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