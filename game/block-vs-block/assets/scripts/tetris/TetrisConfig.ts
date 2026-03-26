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