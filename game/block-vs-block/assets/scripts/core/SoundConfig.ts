/**
 * 音效配置
 * 定义游戏中所有音效的路径和设置
 */

/**
 * BGM 类型
 */
export enum BGMType {
    MENU = 'bgm_menu',
    GAME = 'bgm_game',
    WARNING = 'bgm_warning',
    RESULT = 'bgm_result'
}

/**
 * 音效类型
 */
export enum SFXType {
    // 方块音效
    TETRIS_MOVE = 'sfx_tetris_move',
    TETRIS_ROTATE = 'sfx_tetris_rotate',
    TETRIS_LAND = 'sfx_tetris_land',
    TETRIS_CLEAR = 'sfx_tetris_clear',
    TETRIS_TSPIN = 'sfx_tetris_tspin',
    TETRIS_PERFECT_CLEAR = 'sfx_tetris_perfect_clear',
    
    // 弹球音效
    BREAKOUT_LAUNCH = 'sfx_breakout_launch',
    BREAKOUT_BOUNCE = 'sfx_breakout_bounce',
    BREAKOUT_HIT = 'sfx_breakout_hit',
    BREAKOUT_DESTROY = 'sfx_breakout_destroy',
    BREAKOUT_LOST = 'sfx_breakout_lost',
    BREAKOUT_COMBO = 'sfx_breakout_combo',
    
    // 系统音效
    UI_CLICK = 'sfx_ui_click',
    UI_BACK = 'sfx_ui_back',
    SWAP_WARNING = 'sfx_swap_warning',
    SWAP_START = 'sfx_swap_start',
    GAME_START = 'sfx_game_start',
    GAME_END = 'sfx_game_end',
    VICTORY = 'sfx_victory',
    DEFEAT = 'sfx_defeat',
    
    // 道具音效
    ITEM_ACQUIRE = 'sfx_item_acquire',
    ITEM_USE = 'sfx_item_use'
}

/**
 * 音效配置表
 */
export const SoundConfig = {
    /**
     * BGM 配置
     */
    BGM: {
        [BGMType.MENU]: {
            path: 'audio/bgm/bgm_menu',
            volume: 0.5,
            loop: true
        },
        [BGMType.GAME]: {
            path: 'audio/bgm/bgm_game',
            volume: 0.5,
            loop: true
        },
        [BGMType.WARNING]: {
            path: 'audio/bgm/bgm_warning',
            volume: 0.6,
            loop: false
        },
        [BGMType.RESULT]: {
            path: 'audio/bgm/bgm_result',
            volume: 0.5,
            loop: false
        }
    },

    /**
     * 音效配置
     */
    SFX: {
        [SFXType.TETRIS_MOVE]: {
            path: 'audio/sfx/tetris_move',
            volume: 0.3
        },
        [SFXType.TETRIS_ROTATE]: {
            path: 'audio/sfx/tetris_rotate',
            volume: 0.3
        },
        [SFXType.TETRIS_LAND]: {
            path: 'audio/sfx/tetris_land',
            volume: 0.5
        },
        [SFXType.TETRIS_CLEAR]: {
            path: 'audio/sfx/tetris_clear',
            volume: 0.6
        },
        [SFXType.TETRIS_TSPIN]: {
            path: 'audio/sfx/tetris_tspin',
            volume: 0.7
        },
        [SFXType.TETRIS_PERFECT_CLEAR]: {
            path: 'audio/sfx/tetris_perfect_clear',
            volume: 0.8
        },
        [SFXType.BREAKOUT_LAUNCH]: {
            path: 'audio/sfx/breakout_launch',
            volume: 0.4
        },
        [SFXType.BREAKOUT_BOUNCE]: {
            path: 'audio/sfx/breakout_bounce',
            volume: 0.3
        },
        [SFXType.BREAKOUT_HIT]: {
            path: 'audio/sfx/breakout_hit',
            volume: 0.4
        },
        [SFXType.BREAKOUT_DESTROY]: {
            path: 'audio/sfx/breakout_destroy',
            volume: 0.5
        },
        [SFXType.BREAKOUT_LOST]: {
            path: 'audio/sfx/breakout_lost',
            volume: 0.6
        },
        [SFXType.BREAKOUT_COMBO]: {
            path: 'audio/sfx/breakout_combo',
            volume: 0.5
        },
        [SFXType.UI_CLICK]: {
            path: 'audio/sfx/ui_click',
            volume: 0.4
        },
        [SFXType.UI_BACK]: {
            path: 'audio/sfx/ui_back',
            volume: 0.4
        },
        [SFXType.SWAP_WARNING]: {
            path: 'audio/sfx/swap_warning',
            volume: 0.6
        },
        [SFXType.SWAP_START]: {
            path: 'audio/sfx/swap_start',
            volume: 0.7
        },
        [SFXType.GAME_START]: {
            path: 'audio/sfx/game_start',
            volume: 0.6
        },
        [SFXType.GAME_END]: {
            path: 'audio/sfx/game_end',
            volume: 0.6
        },
        [SFXType.VICTORY]: {
            path: 'audio/sfx/victory',
            volume: 0.8
        },
        [SFXType.DEFEAT]: {
            path: 'audio/sfx/defeat',
            volume: 0.7
        },
        [SFXType.ITEM_ACQUIRE]: {
            path: 'audio/sfx/item_acquire',
            volume: 0.5
        },
        [SFXType.ITEM_USE]: {
            path: 'audio/sfx/item_use',
            volume: 0.5
        }
    }
};