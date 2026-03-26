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