/**
 * 俄罗斯方块类型定义
 * 遵循 Tetris Guideline 标准
 */

/**
 * 方块类型枚举
 * 7种标准俄罗斯方块
 */
export enum BlockType {
    I = 'I',
    O = 'O',
    T = 'T',
    S = 'S',
    Z = 'Z',
    J = 'J',
    L = 'L'
}

/**
 * 旋转状态枚举
 * 0: 初始, 1: 顺时针90°, 2: 180°, 3: 270°
 */
export enum RotationState {
    R0 = 0,
    R90 = 1,
    R180 = 2,
    R270 = 3
}

/**
 * 位置接口
 */
export interface Position {
    x: number;
    y: number;
}

/**
 * 方块形状类型
 * 4x4 矩阵，0表示空，1表示有方块
 */
export type BlockShape = number[][];

/**
 * Wall Kick 偏移数据
 * 用于旋转时的位置调整
 */
export interface WallKickData {
    [key: string]: Position[];
}

/**
 * 方块颜色配置
 */
export interface BlockColor {
    type: BlockType;
    primary: string;   // 主色
    glow: string;      // 发光色
}

/**
 * 移动方向
 */
export enum MoveDirection {
    LEFT = 'LEFT',
    RIGHT = 'RIGHT',
    DOWN = 'DOWN'
}

/**
 * 旋转方向
 */
export enum RotateDirection {
    CLOCKWISE = 'CLOCKWISE',        // 顺时针
    COUNTER_CLOCKWISE = 'COUNTER_CLOCKWISE'  // 逆时针
}

/**
 * 游戏输入类型
 */
export enum InputType {
    MOVE_LEFT = 'MOVE_LEFT',
    MOVE_RIGHT = 'MOVE_RIGHT',
    MOVE_DOWN = 'MOVE_DOWN',
    ROTATE_CW = 'ROTATE_CW',        // 顺时针旋转
    ROTATE_CCW = 'ROTATE_CCW',      // 逆时针旋转
    HARD_DROP = 'HARD_DROP',        // 硬降
    HOLD = 'HOLD'                   // 暂存
}

/**
 * 消除信息
 */
export interface ClearInfo {
    lines: number;          // 消除行数
    isTSpin: boolean;       // 是否T-Spin
    isTSpinMini: boolean;   // 是否T-Spin Mini
    isPerfectClear: boolean; // 是否Perfect Clear
    linesCleared: number[];  // 消除的行号
}

/**
 * 得分事件
 */
export interface ScoreEvent {
    baseScore: number;
    bonusScore: number;
    totalScore: number;
    clearInfo: ClearInfo;
    isBackToBack: boolean;
}

/**
 * 方块状态
 */
export interface TetrominoState {
    type: BlockType;
    rotation: RotationState;
    position: Position;
    isLocked: boolean;
}

/**
 * 游戏统计
 */
export interface GameStats {
    score: number;
    level: number;
    linesCleared: number;
    tetrominosPlaced: number;
    tSpins: number;
    perfectClears: number;
    maxCombo: number;
    currentCombo: number;
}