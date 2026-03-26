# Phase 2 Wave 1 - Implementation Code

This file contains the implementation for Tetris module Wave 1 tasks.

---

## Task 1: TetrisTypes.ts

**Target File:** `game/block-vs-block/assets/scripts/tetris/TetrisTypes.ts`

```typescript
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
```

---

## Task 2: TetrisBlock.ts

**Target File:** `game/block-vs-block/assets/scripts/tetris/TetrisBlock.ts`

```typescript
import { BlockType, RotationState, Position, BlockShape, WallKickData } from './TetrisTypes';

/**
 * 方块定义
 * 包含形状、旋转状态、Wall Kick数据
 */
export class TetrisBlock {
    /**
     * 标准方块形状定义
     * 每种方块有4种旋转状态
     * 使用 SRS (Super Rotation System) 标准
     */
    private static readonly SHAPES: Record<BlockType, BlockShape[]> = {
        [BlockType.I]: [
            // R0
            [
                [0, 0, 0, 0],
                [1, 1, 1, 1],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ],
            // R90
            [
                [0, 0, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 1, 0]
            ],
            // R180
            [
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [1, 1, 1, 1],
                [0, 0, 0, 0]
            ],
            // R270
            [
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0]
            ]
        ],
        [BlockType.O]: [
            // O方块不旋转，所有状态相同
            [
                [0, 0, 0, 0],
                [0, 1, 1, 0],
                [0, 1, 1, 0],
                [0, 0, 0, 0]
            ],
            [
                [0, 0, 0, 0],
                [0, 1, 1, 0],
                [0, 1, 1, 0],
                [0, 0, 0, 0]
            ],
            [
                [0, 0, 0, 0],
                [0, 1, 1, 0],
                [0, 1, 1, 0],
                [0, 0, 0, 0]
            ],
            [
                [0, 0, 0, 0],
                [0, 1, 1, 0],
                [0, 1, 1, 0],
                [0, 0, 0, 0]
            ]
        ],
        [BlockType.T]: [
            // R0
            [
                [0, 0, 0, 0],
                [0, 1, 0, 0],
                [1, 1, 1, 0],
                [0, 0, 0, 0]
            ],
            // R90
            [
                [0, 0, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 1, 0],
                [0, 1, 0, 0]
            ],
            // R180
            [
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [1, 1, 1, 0],
                [0, 1, 0, 0]
            ],
            // R270
            [
                [0, 0, 0, 0],
                [0, 1, 0, 0],
                [1, 1, 0, 0],
                [0, 1, 0, 0]
            ]
        ],
        [BlockType.S]: [
            // R0
            [
                [0, 0, 0, 0],
                [0, 1, 1, 0],
                [1, 1, 0, 0],
                [0, 0, 0, 0]
            ],
            // R90
            [
                [0, 0, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 1, 0],
                [0, 0, 1, 0]
            ],
            // R180
            [
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 1, 1, 0],
                [1, 1, 0, 0]
            ],
            // R270
            [
                [0, 0, 0, 0],
                [1, 0, 0, 0],
                [1, 1, 0, 0],
                [0, 1, 0, 0]
            ]
        ],
        [BlockType.Z]: [
            // R0
            [
                [0, 0, 0, 0],
                [1, 1, 0, 0],
                [0, 1, 1, 0],
                [0, 0, 0, 0]
            ],
            // R90
            [
                [0, 0, 0, 0],
                [0, 0, 1, 0],
                [0, 1, 1, 0],
                [0, 1, 0, 0]
            ],
            // R180
            [
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [1, 1, 0, 0],
                [0, 1, 1, 0]
            ],
            // R270
            [
                [0, 0, 0, 0],
                [0, 1, 0, 0],
                [1, 1, 0, 0],
                [1, 0, 0, 0]
            ]
        ],
        [BlockType.J]: [
            // R0
            [
                [0, 0, 0, 0],
                [1, 0, 0, 0],
                [1, 1, 1, 0],
                [0, 0, 0, 0]
            ],
            // R90
            [
                [0, 0, 0, 0],
                [0, 1, 1, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0]
            ],
            // R180
            [
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [1, 1, 1, 0],
                [0, 0, 1, 0]
            ],
            // R270
            [
                [0, 0, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [1, 1, 0, 0]
            ]
        ],
        [BlockType.L]: [
            // R0
            [
                [0, 0, 0, 0],
                [0, 0, 1, 0],
                [1, 1, 1, 0],
                [0, 0, 0, 0]
            ],
            // R90
            [
                [0, 0, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 1, 0]
            ],
            // R180
            [
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [1, 1, 1, 0],
                [1, 0, 0, 0]
            ],
            // R270
            [
                [0, 0, 0, 0],
                [1, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0]
            ]
        ]
    };

    /**
     * Wall Kick 数据 (SRS标准)
     * 格式: [旋转前状态][旋转后状态] -> 偏移量数组
     */
    private static readonly WALL_KICKS: Record<string, Position[][]> = {
        // J, L, S, T, Z 方块的 Wall Kick
        'JLSTZ': [
            // R0 -> R90
            [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: -1, y: -1 }, { x: 0, y: 2 }, { x: -1, y: 2 }],
            // R90 -> R180
            [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: -2 }, { x: 1, y: -2 }],
            // R180 -> R270
            [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: -1 }, { x: 0, y: 2 }, { x: 1, y: 2 }],
            // R270 -> R0
            [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: -1, y: 1 }, { x: 0, y: -2 }, { x: -1, y: -2 }],
            // 逆时针旋转
            // R0 -> R270
            [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: -1 }, { x: 0, y: 2 }, { x: 1, y: 2 }],
            // R270 -> R180
            [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: -1, y: -1 }, { x: 0, y: 2 }, { x: -1, y: 2 }],
            // R180 -> R90
            [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: -1, y: 1 }, { x: 0, y: -2 }, { x: -1, y: -2 }],
            // R90 -> R0
            [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: -2 }, { x: 1, y: -2 }]
        ],
        // I 方块的 Wall Kick
        'I': [
            // R0 -> R90
            [{ x: 0, y: 0 }, { x: -2, y: 0 }, { x: 1, y: 0 }, { x: -2, y: 1 }, { x: 1, y: -2 }],
            // R90 -> R180
            [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: 2, y: 0 }, { x: -1, y: -2 }, { x: 2, y: 1 }],
            // R180 -> R270
            [{ x: 0, y: 0 }, { x: 2, y: 0 }, { x: -1, y: 0 }, { x: 2, y: -1 }, { x: -1, y: 2 }],
            // R270 -> R0
            [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: -2, y: 0 }, { x: 1, y: 2 }, { x: -2, y: -1 }],
            // 逆时针旋转
            // R0 -> R270
            [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: 2, y: 0 }, { x: -1, y: -2 }, { x: 2, y: 1 }],
            // R270 -> R180
            [{ x: 0, y: 0 }, { x: 2, y: 0 }, { x: -1, y: 0 }, { x: 2, y: -1 }, { x: -1, y: 2 }],
            // R180 -> R90
            [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: -2, y: 0 }, { x: 1, y: 2 }, { x: -2, y: -1 }],
            // R90 -> R0
            [{ x: 0, y: 0 }, { x: -2, y: 0 }, { x: 1, y: 0 }, { x: -2, y: 1 }, { x: 1, y: -2 }]
        ]
    };

    /**
     * 获取方块形状
     */
    public static getShape(type: BlockType, rotation: RotationState): BlockShape {
        return TetrisBlock.SHAPES[type][rotation];
    }

    /**
     * 获取 Wall Kick 偏移量
     * @param type 方块类型
     * @param fromRotation 旋转前状态
     * @param toRotation 旋转后状态
     * @param isClockwise 是否顺时针旋转
     */
    public static getWallKicks(
        type: BlockType,
        fromRotation: RotationState,
        toRotation: RotationState,
        isClockwise: boolean
    ): Position[] {
        let kicks: Position[];
        
        if (type === BlockType.I) {
            kicks = TetrisBlock.getIWallKicks(fromRotation, isClockwise);
        } else if (type === BlockType.O) {
            // O方块不需要 Wall Kick
            return [{ x: 0, y: 0 }];
        } else {
            kicks = TetrisBlock.getJLSTZWallKicks(fromRotation, isClockwise);
        }
        
        return kicks;
    }

    /**
     * 获取 J/L/S/T/Z 方块的 Wall Kick
     */
    private static getJLSTZWallKicks(fromRotation: RotationState, isClockwise: boolean): Position[] {
        const index = isClockwise ? fromRotation : fromRotation + 4;
        return TetrisBlock.WALL_KICKS['JLSTZ'][index % 8];
    }

    /**
     * 获取 I 方块的 Wall Kick
     */
    private static getIWallKicks(fromRotation: RotationState, isClockwise: boolean): Position[] {
        const index = isClockwise ? fromRotation : fromRotation + 4;
        return TetrisBlock.WALL_KICKS['I'][index % 8];
    }

    /**
     * 获取方块所有占用的格子位置
     * @param type 方块类型
     * @param rotation 旋转状态
     * @param position 方块锚点位置
     */
    public static getOccupiedCells(
        type: BlockType,
        rotation: RotationState,
        position: Position
    ): Position[] {
        const shape = TetrisBlock.getShape(type, rotation);
        const cells: Position[] = [];
        
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                if (shape[row][col] === 1) {
                    cells.push({
                        x: position.x + col,
                        y: position.y - row  // y轴向上为正
                    });
                }
            }
        }
        
        return cells;
    }

    /**
     * 获取方块颜色
     */
    public static getColor(type: BlockType): { primary: string; glow: string } {
        const colors: Record<BlockType, { primary: string; glow: string }> = {
            [BlockType.I]: { primary: '#00ffff', glow: '#00cccc' },
            [BlockType.O]: { primary: '#ffff00', glow: '#cccc00' },
            [BlockType.T]: { primary: '#ff00ff', glow: '#cc00cc' },
            [BlockType.S]: { primary: '#00ff88', glow: '#00cc66' },
            [BlockType.Z]: { primary: '#ff4444', glow: '#cc3333' },
            [BlockType.J]: { primary: '#4488ff', glow: '#3366cc' },
            [BlockType.L]: { primary: '#ff8800', glow: '#cc6600' }
        };
        
        return colors[type];
    }
}
```

---

## Task 3: TetrisConfig.ts

**Target File:** `game/block-vs-block/assets/scripts/tetris/TetrisConfig.ts`

```typescript
import { BlockType } from './TetrisTypes';

/**
 * 俄罗斯方块配置
 */
export class TetrisConfig {
    /**
     * 场地尺寸
     */
    public static readonly BOARD_WIDTH = 10;       // 场地宽度（格）
    public static readonly BOARD_HEIGHT = 20;      // 可见场地高度（格）
    public static readonly BOARD_BUFFER = 4;       // 顶部缓冲区高度（格）
    public static readonly TOTAL_HEIGHT = 24;      // 总高度

    /**
     * 方块初始位置（锚点）
     */
    public static readonly SPAWN_X = 3;            // 初始X位置
    public static readonly SPAWN_Y = 20;           // 初始Y位置（缓冲区底部）

    /**
     * 下落速度（毫秒/格）
     * 等级越高，下落越快
     */
    public static readonly FALL_SPEEDS: number[] = [
        1000,  // Level 1
        900,   // Level 2
        800,   // Level 3
        700,   // Level 4
        600,   // Level 5
        500,   // Level 6
        400,   // Level 7
        350,   // Level 8
        300,   // Level 9
        250,   // Level 10
        200,   // Level 11
        150,   // Level 12
        100,   // Level 13
        80,    // Level 14
        60     // Level 15
    ];

    /**
     * 软降速度倍率
     */
    public static readonly SOFT_DROP_MULTIPLIER = 20;

    /**
     * DAS（延迟自动移位）设置
     */
    public static readonly DAS_DELAY = 170;        // 首次延迟（毫秒）
    public static readonly DAS_REPEAT = 50;        // 重复间隔（毫秒）

    /**
     * 等级系统
     */
    public static readonly LEVEL_UP_TIME = 60000;  // 升级时间（毫秒）
    public static readonly MAX_LEVEL = 15;         // 最高等级

    /**
     * 计分规则
     */
    public static readonly SCORE_TABLE = {
        SINGLE: 100,       // 消除1行
        DOUBLE: 300,       // 消除2行
        TRIPLE: 500,       // 消除3行
        TETRIS: 800,       // 消除4行
        TSPIN: 800,        // T-Spin（无消除）
        TSPIN_SINGLE: 800,  // T-Spin Single
        TSPIN_DOUBLE: 1200, // T-Spin Double
        TSPIN_TRIPLE: 1600, // T-Spin Triple
        TSPIN_MINI: 100,    // T-Spin Mini
        PERFECT_CLEAR: 800, // Perfect Clear（额外奖励）
        BACK_TO_BACK: 1.5   // Back-to-Back 倍率
    };

    /**
     * Perfect Clear 额外奖励（根据消除行数）
     */
    public static readonly PERFECT_CLEAR_BONUS: Record<number, number> = {
        1: 800,
        2: 1200,
        3: 1800,
        4: 2000
    };

    /**
     * Next 预览数量
     */
    public static readonly NEXT_COUNT = 3;

    /**
     * Hold 使用限制
     */
    public static readonly HOLD_LIMIT_PER_PIECE = 1;

    /**
     * 锁定延迟（毫秒）
     */
    public static readonly LOCK_DELAY = 500;

    /**
     * 视觉设置
     */
    public static readonly CELL_SIZE = 32;         // 格子大小（像素）
    public static readonly BOARD_X = 160;          // 场地X偏移
    public static readonly BOARD_Y = 40;           // 场地Y偏移

    /**
     * 获取当前等级的下落速度
     */
    public static getFallSpeed(level: number): number {
        const index = Math.min(level - 1, TetrisConfig.FALL_SPEEDS.length - 1);
        return TetrisConfig.FALL_SPEEDS[Math.max(0, index)];
    }
}
```

---

## Task 4: TetrisSpawner.ts

**Target File:** `game/block-vs-block/assets/scripts/tetris/TetrisSpawner.ts`

```typescript
import { BlockType } from './TetrisTypes';
import { TetrisConfig } from './TetrisConfig';

/**
 * 方块生成器
 * 使用 7-bag 随机算法
 */
export class TetrisSpawner {
    private bag: BlockType[] = [];
    private nextQueue: BlockType[] = [];
    private random: () => number;

    constructor(randomFn?: () => number) {
        this.random = randomFn || Math.random;
        this.initNextQueue();
    }

    /**
     * 初始化 Next 队列
     */
    private initNextQueue(): void {
        // 填充足够的方块到 Next 队列
        for (let i = 0; i < TetrisConfig.NEXT_COUNT + 1; i++) {
            this.nextQueue.push(this.getNextFromBag());
        }
    }

    /**
     * 从 7-bag 中获取下一个方块
     */
    private getNextFromBag(): BlockType {
        // 如果 bag 为空，重新填充
        if (this.bag.length === 0) {
            this.fillBag();
        }
        
        return this.bag.pop()!;
    }

    /**
     * 填充 7-bag
     * 随机打乱7种方块
     */
    private fillBag(): void {
        this.bag = [
            BlockType.I,
            BlockType.O,
            BlockType.T,
            BlockType.S,
            BlockType.Z,
            BlockType.J,
            BlockType.L
        ];
        
        // Fisher-Yates 洗牌算法
        for (let i = this.bag.length - 1; i > 0; i--) {
            const j = Math.floor(this.random() * (i + 1));
            [this.bag[i], this.bag[j]] = [this.bag[j], this.bag[i]];
        }
    }

    /**
     * 获取下一个方块
     * 同时更新 Next 队列
     */
    public spawn(): BlockType {
        const next = this.nextQueue.shift()!;
        this.nextQueue.push(this.getNextFromBag());
        return next;
    }

    /**
     * 获取 Next 预览队列
     */
    public getNextQueue(): BlockType[] {
        return [...this.nextQueue];
    }

    /**
     * 预览指定位置的方块
     * @param index 位置索引（0 = 当前方块, 1 = 下一个, 2 = 下下个）
     */
    public peek(index: number = 0): BlockType {
        if (index >= 0 && index < this.nextQueue.length) {
            return this.nextQueue[index];
        }
        return this.nextQueue[0];
    }

    /**
     * 重置生成器
     */
    public reset(): void {
        this.bag = [];
        this.nextQueue = [];
        this.initNextQueue();
    }

    /**
     * 设置随机函数（用于测试）
     */
    public setRandom(randomFn: () => number): void {
        this.random = randomFn;
    }
}
```

---

## Summary

Wave 1 creates 4 files:

1. **TetrisTypes.ts** - 类型定义（枚举、接口）
2. **TetrisBlock.ts** - 方块形状、旋转、Wall Kick
3. **TetrisConfig.ts** - 配置常量（场地、速度、计分）
4. **TetrisSpawner.ts** - 7-bag 生成器

All files should be written to: `game/block-vs-block/assets/scripts/tetris/`