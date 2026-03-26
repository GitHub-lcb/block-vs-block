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