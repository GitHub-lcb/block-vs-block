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