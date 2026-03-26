# Phase 6 - 音效与特效实现代码

---

## 任务概览

Phase 6 主要完善游戏的音效和视觉特效，包括：
1. 音效配置和播放
2. 粒子特效系统
3. 动画效果

---

## 文件 1: SoundConfig.ts

**目标文件:** `game/block-vs-block/assets/scripts/core/SoundConfig.ts`

```typescript
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
```

---

## 文件 2: ParticleConfig.ts

**目标文件:** `game/block-vs-block/assets/scripts/effects/ParticleConfig.ts`

```typescript
import { Color } from 'cc';

/**
 * 粒子效果配置
 */
export class ParticleConfig {
    /**
     * 行消除粒子配置
     */
    public static readonly LINE_CLEAR = {
        count: 50,
        duration: 0.5,
        speed: 200,
        gravity: -100,
        colors: [
            new Color(0, 255, 255, 255),   // 青色
            new Color(255, 0, 255, 255),   // 紫色
            new Color(255, 255, 0, 255),   // 黄色
            new Color(0, 255, 136, 255)    // 绿色
        ],
        size: { min: 4, max: 8 },
        lifetime: { min: 0.3, max: 0.6 }
    };

    /**
     * 砖块击碎粒子配置
     */
    public static readonly BRICK_DESTROY = {
        count: 20,
        duration: 0.3,
        speed: 150,
        gravity: -50,
        colors: [
            new Color(255, 255, 255, 255),
            new Color(255, 200, 100, 255)
        ],
        size: { min: 3, max: 6 },
        lifetime: { min: 0.2, max: 0.4 }
    };

    /**
     * 角色互换粒子配置
     */
    public static readonly ROLE_SWAP = {
        count: 100,
        duration: 0.5,
        speed: 300,
        gravity: 0,
        colors: [
            new Color(0, 255, 255, 255),   // 青色
            new Color(255, 0, 255, 255)    // 紫色
        ],
        size: { min: 6, max: 12 },
        lifetime: { min: 0.4, max: 0.8 }
    };

    /**
     * 连击粒子配置
     */
    public static readonly COMBO = {
        count: 30,
        duration: 0.4,
        speed: 180,
        gravity: -80,
        colors: [
            new Color(255, 215, 0, 255)    // 金色
        ],
        size: { min: 5, max: 10 },
        lifetime: { min: 0.3, max: 0.5 }
    };

    /**
     * T-Spin 粒子配置
     */
    public static readonly TSPIN = {
        count: 80,
        duration: 0.6,
        speed: 250,
        gravity: 0,
        colors: [
            new Color(255, 0, 255, 255),   // 紫色
            new Color(255, 136, 0, 255),   // 橙色
            new Color(255, 255, 255, 255)  // 白色
        ],
        size: { min: 5, max: 10 },
        lifetime: { min: 0.4, max: 0.7 }
    };

    /**
     * 完美消除粒子配置
     */
    public static readonly PERFECT_CLEAR = {
        count: 150,
        duration: 1.0,
        speed: 350,
        gravity: 0,
        colors: [
            new Color(0, 255, 255, 255),
            new Color(255, 255, 0, 255),
            new Color(255, 0, 255, 255),
            new Color(0, 255, 136, 255),
            new Color(255, 136, 0, 255)
        ],
        size: { min: 8, max: 16 },
        lifetime: { min: 0.6, max: 1.0 }
    };
}
```

---

## 文件 3: ParticleManager.ts

**目标文件:** `game/block-vs-block/assets/scripts/effects/ParticleManager.ts`

```typescript
import { _decorator, Component, Node, ParticleSystem, Vec3, Color } from 'cc';
import { ParticleConfig } from './ParticleConfig';

const { ccclass, property } = _decorator;

/**
 * 粒子效果类型
 */
export enum ParticleType {
    LINE_CLEAR = 'LINE_CLEAR',
    BRICK_DESTROY = 'BRICK_DESTROY',
    ROLE_SWAP = 'ROLE_SWAP',
    COMBO = 'COMBO',
    TSPIN = 'TSPIN',
    PERFECT_CLEAR = 'PERFECT_CLEAR'
}

/**
 * 粒子管理器
 */
@ccclass('ParticleManager')
export class ParticleManager extends Component {
    private static _instance: ParticleManager | null = null;

    @property([Node])
    public particlePools: Node[] = [];

    public static get instance(): ParticleManager {
        return ParticleManager._instance!;
    }

    protected onLoad(): void {
        ParticleManager._instance = this;
    }

    /**
     * 播放粒子效果
     */
    public play(type: ParticleType, position: Vec3): void {
        const config = this.getConfig(type);
        if (!config) return;

        // 创建粒子节点
        const particleNode = this.createParticleNode(type, config, position);
        this.node.addChild(particleNode);

        // 自动销毁
        this.scheduleOnce(() => {
            particleNode.destroy();
        }, config.duration);
    }

    /**
     * 创建粒子节点
     */
    private createParticleNode(type: ParticleType, config: any, position: Vec3): Node {
        const node = new Node(`Particle_${type}`);
        node.setPosition(position);

        const particle = node.addComponent(ParticleSystem);
        
        // 配置粒子系统
        particle.capacity = config.count;
        particle.startLifetime = config.lifetime;
        particle.startSize = config.size;
        particle.startSpeed = config.speed;
        particle.gravityModifier = config.gravity;
        particle.duration = config.duration;
        particle.startColor = config.colors[0];

        return node;
    }

    /**
     * 获取配置
     */
    private getConfig(type: ParticleType): any {
        switch (type) {
            case ParticleType.LINE_CLEAR:
                return ParticleConfig.LINE_CLEAR;
            case ParticleType.BRICK_DESTROY:
                return ParticleConfig.BRICK_DESTROY;
            case ParticleType.ROLE_SWAP:
                return ParticleConfig.ROLE_SWAP;
            case ParticleType.COMBO:
                return ParticleConfig.COMBO;
            case ParticleType.TSPIN:
                return ParticleConfig.TSPIN;
            case ParticleType.PERFECT_CLEAR:
                return ParticleConfig.PERFECT_CLEAR;
            default:
                return null;
        }
    }

    /**
     * 行消除效果
     */
    public playLineClear(y: number): void {
        this.play(ParticleType.LINE_CLEAR, new Vec3(5, y, 0));
    }

    /**
     * 砖块击碎效果
     */
    public playBrickDestroy(x: number, y: number): void {
        this.play(ParticleType.BRICK_DESTROY, new Vec3(x, y, 0));
    }

    /**
     * 角色互换效果
     */
    public playRoleSwap(): void {
        // 屏幕中央
        this.play(ParticleType.ROLE_SWAP, new Vec3(5, 12, 0));
    }

    /**
     * 连击效果
     */
    public playCombo(x: number, y: number): void {
        this.play(ParticleType.COMBO, new Vec3(x, y, 0));
    }

    /**
     * T-Spin 效果
     */
    public playTSpin(x: number, y: number): void {
        this.play(ParticleType.TSPIN, new Vec3(x, y, 0));
    }

    /**
     * 完美消除效果
     */
    public playPerfectClear(): void {
        this.play(ParticleType.PERFECT_CLEAR, new Vec3(5, 10, 0));
    }
}
```

---

## 文件 4: AnimationManager.ts

**目标文件:** `game/block-vs-block/assets/scripts/effects/AnimationManager.ts`

```typescript
import { _decorator, Component, Node, tween, Vec3, Color, Sprite } from 'cc';
import { GameStateManager, GameState } from '../core/GameStateManager';

const { ccclass, property } = _decorator;

/**
 * 动画管理器
 */
@ccclass('AnimationManager')
export class AnimationManager extends Component {
    private static _instance: AnimationManager | null = null;

    @property(Node)
    public gameField: Node | null = null;

    @property(Node)
    public warningOverlay: Node | null = null;

    @property(Node)
    public swapOverlay: Node | null = null;

    public static get instance(): AnimationManager {
        return AnimationManager._instance!;
    }

    protected onLoad(): void {
        AnimationManager._instance = this;
        
        if (this.warningOverlay) {
            this.warningOverlay.active = false;
        }
        if (this.swapOverlay) {
            this.swapOverlay.active = false;
        }
    }

    /**
     * 播放互换警告动画
     */
    public playWarningAnimation(): void {
        if (!this.warningOverlay) return;

        this.warningOverlay.active = true;
        
        // 闪烁效果
        const sprite = this.warningOverlay.getComponent(Sprite);
        if (sprite) {
            tween(sprite.color)
                .to(0.25, { a: 200 })
                .to(0.25, { a: 100 })
                .union()
                .repeatForever()
                .start();
        }

        // 边框闪烁
        tween(this.warningOverlay)
            .to(0.25, { scale: new Vec3(1.02, 1.02, 1) })
            .to(0.25, { scale: new Vec3(1, 1, 1) })
            .union()
            .repeatForever()
            .start();
    }

    /**
     * 停止警告动画
     */
    public stopWarningAnimation(): void {
        if (!this.warningOverlay) return;

        this.warningOverlay.active = false;
        
        // 停止所有tween
        tween(this.warningOverlay).stop();
        
        const sprite = this.warningOverlay.getComponent(Sprite);
        if (sprite) {
            tween(sprite.color).stop();
        }
    }

    /**
     * 播放互换动画
     */
    public playSwapAnimation(callback?: () => void): Promise<void> {
        return new Promise((resolve) => {
            if (!this.swapOverlay) {
                callback?.();
                resolve();
                return;
            }

            this.swapOverlay.active = true;
            this.swapOverlay.setScale(new Vec3(0, 1, 1));

            // 放大动画
            tween(this.swapOverlay)
                .to(0.15, { scale: new Vec3(1, 1, 1) })
                .delay(0.2)
                .to(0.15, { scale: new Vec3(0, 1, 1) })
                .call(() => {
                    this.swapOverlay.active = false;
                    callback?.();
                    resolve();
                })
                .start();
        });
    }

    /**
     * 播放场地重置动画
     */
    public playFieldResetAnimation(field: Node): Promise<void> {
        return new Promise((resolve) => {
            if (!field) {
                resolve();
                return;
            }

            // 淡出
            tween(field)
                .to(0.15, { scale: new Vec3(1, 0, 1) })
                .call(() => {
                    // 重置场地
                    resolve();
                })
                .to(0.15, { scale: new Vec3(1, 1, 1) })
                .start();
        });
    }

    /**
     * 播放分数增加动画
     */
    public playScorePopup(node: Node, score: number): void {
        if (!node) return;

        const startY = node.position.y;
        
        tween(node)
            .to(0.3, { position: new Vec3(node.position.x, startY + 30, 0) })
            .to(0.1, { position: new Vec3(node.position.x, startY + 35, 0) })
            .call(() => {
                node.setPosition(new Vec3(node.position.x, startY, 0));
            })
            .start();
    }

    /**
     * 播放震动效果
     */
    public playShake(node: Node, intensity: number = 5, duration: number = 0.1): void {
        if (!node) return;

        const originalPos = node.position.clone();
        
        tween(node)
            .to(duration, { position: new Vec3(originalPos.x + intensity, originalPos.y, 0) })
            .to(duration, { position: new Vec3(originalPos.x - intensity, originalPos.y, 0) })
            .to(duration, { position: new Vec3(originalPos.x + intensity / 2, originalPos.y, 0) })
            .to(duration, { position: originalPos })
            .start();
    }

    /**
     * 播放游戏结束动画
     */
    public playGameOverAnimation(field: Node, callback?: () => void): void {
        if (!field) {
            callback?.();
            return;
        }

        tween(field)
            .to(0.3, { scale: new Vec3(0.8, 0.8, 1) })
            .to(0.2, { scale: new Vec3(1.1, 1.1, 1) })
            .to(0.1, { scale: new Vec3(1, 1, 1) })
            .call(() => {
                callback?.();
            })
            .start();
    }
}
```

---

## 文件 5: EffectsManager.ts

**目标文件:** `game/block-vs-block/assets/scripts/effects/EffectsManager.ts`

```typescript
import { _decorator, Component, Node, Vec3 } from 'cc';
import { ParticleManager } from './ParticleManager';
import { AnimationManager } from './AnimationManager';
import { EventBus, GameEventType } from '../core/EventBus';
import { GameStateManager, GameState } from '../core/GameStateManager';
import { AudioManager, SoundType, BGMType } from '../core/AudioManager';
import { SFXType } from '../core/SoundConfig';

const { ccclass, property } = _decorator;

/**
 * 特效管理器
 * 统一管理音效和视觉特效
 */
@ccclass('EffectsManager')
export class EffectsManager extends Component {
    private static _instance: EffectsManager | null = null;

    public static get instance(): EffectsManager {
        return EffectsManager._instance!;
    }

    protected onLoad(): void {
        EffectsManager._instance = this;
        this.registerEvents();
    }

    private registerEvents(): void {
        // 俄罗斯方块事件
        EventBus.instance.on(GameEventType.TETRIS_LINE_CLEAR, this.onLineClear, this);
        EventBus.instance.on(GameEventType.TETRIS_PIECE_LAND, this.onPieceLand, this);
        EventBus.instance.on(GameEventType.TETRIS_PIECE_MOVE, this.onPieceMove, this);
        
        // 弹球事件
        EventBus.instance.on(GameEventType.BREAKOUT_BRICK_DESTROY, this.onBrickDestroy, this);
        EventBus.instance.on(GameEventType.BREAKOUT_BALL_BOUNCE, this.onBallBounce, this);
        EventBus.instance.on(GameEventType.BREAKOUT_BALL_LAUNCH, this.onBallLaunch, this);
        EventBus.instance.on(GameEventType.BREAKOUT_BALL_LOST, this.onBallLost, this);
        EventBus.instance.on(GameEventType.BREAKOUT_COMBO_UPDATE, this.onCombo, this);
        
        // 角色互换事件
        EventBus.instance.on(GameEventType.ROLE_SWAP_WARNING, this.onSwapWarning, this);
        EventBus.instance.on(GameEventType.ROLE_SWAP_START, this.onSwapStart, this);
        EventBus.instance.on(GameEventType.ROLE_SWAP_COMPLETE, this.onSwapComplete, this);
        
        // 游戏流程事件
        EventBus.instance.on(GameEventType.GAME_START, this.onGameStart, this);
        EventBus.instance.on(GameEventType.GAME_END, this.onGameEnd, this);
    }

    protected onDestroy(): void {
        EventBus.instance.off(GameEventType.TETRIS_LINE_CLEAR, this.onLineClear, this);
        EventBus.instance.off(GameEventType.TETRIS_PIECE_LAND, this.onPieceLand, this);
        EventBus.instance.off(GameEventType.TETRIS_PIECE_MOVE, this.onPieceMove, this);
        EventBus.instance.off(GameEventType.BREAKOUT_BRICK_DESTROY, this.onBrickDestroy, this);
        EventBus.instance.off(GameEventType.BREAKOUT_BALL_BOUNCE, this.onBallBounce, this);
        EventBus.instance.off(GameEventType.BREAKOUT_BALL_LAUNCH, this.onBallLaunch, this);
        EventBus.instance.off(GameEventType.BREAKOUT_BALL_LOST, this.onBallLost, this);
        EventBus.instance.off(GameEventType.BREAKOUT_COMBO_UPDATE, this.onCombo, this);
        EventBus.instance.off(GameEventType.ROLE_SWAP_WARNING, this.onSwapWarning, this);
        EventBus.instance.off(GameEventType.ROLE_SWAP_START, this.onSwapStart, this);
        EventBus.instance.off(GameEventType.ROLE_SWAP_COMPLETE, this.onSwapComplete, this);
        EventBus.instance.off(GameEventType.GAME_START, this.onGameStart, this);
        EventBus.instance.off(GameEventType.GAME_END, this.onGameEnd, this);
    }

    // ===== 俄罗斯方块特效 =====

    private onLineClear(data: { lines: number; isTSpin: boolean }): void {
        // 播放音效
        if (data.isTSpin) {
            AudioManager.instance.playSFX(SFXType.TETRIS_TSPIN);
            ParticleManager.instance?.playTSpin(5, 10);
        } else {
            AudioManager.instance.playSFX(SFXType.TETRIS_CLEAR);
        }
        
        // 粒子效果
        for (let i = 0; i < data.lines; i++) {
            ParticleManager.instance?.playLineClear(10 + i * 2);
        }
        
        // 震动效果
        if (this.gameField) {
            AnimationManager.instance?.playShake(this.gameField, data.lines * 2);
        }
    }

    private onPieceLand(data: any): void {
        AudioManager.instance.playSFX(SFXType.TETRIS_LAND);
    }

    private onPieceMove(data: { input: string }): void {
        // 只播放移动音效，不播放旋转
        if (data.input === 'MOVE_LEFT' || data.input === 'MOVE_RIGHT') {
            AudioManager.instance.playSFX(SFXType.TETRIS_MOVE);
        }
    }

    // ===== 弹球特效 =====

    private onBrickDestroy(data: { gridX: number; gridY: number; type: string }): void {
        AudioManager.instance.playSFX(SFXType.BREAKOUT_DESTROY);
        ParticleManager.instance?.playBrickDestroy(data.gridX, data.gridY);
    }

    private onBallBounce(data: { type: string }): void {
        if (data.type === 'paddle') {
            AudioManager.instance.playSFX(SFXType.BREAKOUT_BOUNCE);
        } else {
            AudioManager.instance.playSFX(SFXType.BREAKOUT_HIT);
        }
    }

    private onBallLaunch(data: any): void {
        AudioManager.instance.playSFX(SFXType.BREAKOUT_LAUNCH);
    }

    private onBallLost(data: any): void {
        AudioManager.instance.playSFX(SFXType.BREAKOUT_LOST);
    }

    private onCombo(data: { combo: number }): void {
        if (data.combo > 1) {
            AudioManager.instance.playSFX(SFXType.BREAKOUT_COMBO);
            ParticleManager.instance?.playCombo(5, 5);
        }
    }

    // ===== 角色互换特效 =====

    private onSwapWarning(data: { remainingTime: number }): void {
        AudioManager.instance.playSFX(SFXType.SWAP_WARNING);
        AnimationManager.instance?.playWarningAnimation();
    }

    private onSwapStart(data: any): void {
        AudioManager.instance.playSFX(SFXType.SWAP_START);
        ParticleManager.instance?.playRoleSwap();
        AnimationManager.instance?.stopWarningAnimation();
    }

    private onSwapComplete(data: any): void {
        AnimationManager.instance?.stopWarningAnimation();
    }

    // ===== 游戏流程特效 =====

    private onGameStart(data: any): void {
        AudioManager.instance.playSFX(SFXType.GAME_START);
        AudioManager.instance.playBGM(BGMType.GAME);
    }

    private onGameEnd(data: { winner: number }): void {
        AudioManager.instance.stopBGM();
        
        if (data.winner === 1) {
            AudioManager.instance.playSFX(SFXType.VICTORY);
        } else {
            AudioManager.instance.playSFX(SFXType.DEFEAT);
        }
        
        AudioManager.instance.playBGM(BGMType.RESULT);
    }

    @property(Node)
    public gameField: Node | null = null;
}
```

---

## 文件 6: index.ts

**目标文件:** `game/block-vs-block/assets/scripts/effects/index.ts`

```typescript
/**
 * 特效模块导出
 */

export { SFXType, BGMType, SoundConfig } from '../core/SoundConfig';
export { ParticleConfig } from './ParticleConfig';
export { ParticleManager, ParticleType } from './ParticleManager';
export { AnimationManager } from './AnimationManager';
export { EffectsManager } from './EffectsManager';
```

---

## 总结

Phase 6 创建 6 个文件：

1. **SoundConfig.ts** - 音效配置（BGM和SFX定义）
2. **ParticleConfig.ts** - 粒子配置（消除、击碎、互换等）
3. **ParticleManager.ts** - 粒子管理器
4. **AnimationManager.ts** - 动画管理器（警告、互换、震动）
5. **EffectsManager.ts** - 特效管理器（统一管理音效和视觉）
6. **index.ts** - 模块导出

文件位置：`game/block-vs-block/assets/scripts/effects/`