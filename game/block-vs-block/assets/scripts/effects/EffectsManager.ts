import { _decorator, Component, Node, Vec3 } from 'cc';
import { ParticleManager } from './ParticleManager';
import { AnimationManager } from './AnimationManager';
import { EventBus, GameEventType } from '../core/EventBus';
import { GameStateManager, GameState } from '../core/GameStateManager';
import { AudioManager, SoundType, BGMType } from '../core/AudioManager';

const { ccclass, property } = _decorator;

/**
 * 特效管理器
 * 统一管理音效和视觉特效
 */
@ccclass('EffectsManager')
export class EffectsManager extends Component {
    private static _instance: EffectsManager | null = null;

    @property(Node)
    public gameField: Node | null = null;

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
            AudioManager.instance.playSFX(SoundType.TETRIS_TSPIN);
            ParticleManager.instance?.playTSpin(5, 10);
        } else {
            AudioManager.instance.playSFX(SoundType.TETRIS_CLEAR);
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
        AudioManager.instance.playSFX(SoundType.TETRIS_LAND);
    }

    private onPieceMove(data: { input: string }): void {
        // 只播放移动音效，不播放旋转
        if (data.input === 'MOVE_LEFT' || data.input === 'MOVE_RIGHT') {
            AudioManager.instance.playSFX(SoundType.TETRIS_MOVE);
        }
    }

    // ===== 弹球特效 =====

    private onBrickDestroy(data: { gridX: number; gridY: number; type: string }): void {
        AudioManager.instance.playSFX(SoundType.BREAKOUT_DESTROY);
        ParticleManager.instance?.playBrickDestroy(data.gridX, data.gridY);
    }

    private onBallBounce(data: { type: string }): void {
        if (data.type === 'paddle') {
            AudioManager.instance.playSFX(SoundType.BREAKOUT_BOUNCE);
        } else {
            AudioManager.instance.playSFX(SoundType.BREAKOUT_HIT);
        }
    }

    private onBallLaunch(data: any): void {
        AudioManager.instance.playSFX(SoundType.BREAKOUT_LAUNCH);
    }

    private onBallLost(data: any): void {
        AudioManager.instance.playSFX(SoundType.BREAKOUT_LOST);
    }

    private onCombo(data: { combo: number }): void {
        if (data.combo > 1) {
            // 使用 TETRIS_CLEAR 作为连击音效的替代
            AudioManager.instance.playSFX(SoundType.TETRIS_CLEAR);
            ParticleManager.instance?.playCombo(5, 5);
        }
    }

    // ===== 角色互换特效 =====

    private onSwapWarning(data: { remainingTime: number }): void {
        AudioManager.instance.playSFX(SoundType.SWAP_WARNING);
        AnimationManager.instance?.playWarningAnimation();
    }

    private onSwapStart(data: any): void {
        AudioManager.instance.playSFX(SoundType.SWAP_START);
        ParticleManager.instance?.playRoleSwap();
        AnimationManager.instance?.stopWarningAnimation();
    }

    private onSwapComplete(data: any): void {
        AnimationManager.instance?.stopWarningAnimation();
    }

    // ===== 游戏流程特效 =====

    private onGameStart(data: any): void {
        AudioManager.instance.playSFX(SoundType.GAME_START);
        AudioManager.instance.playBGM(BGMType.GAME);
    }

    private onGameEnd(data: { winner: number }): void {
        AudioManager.instance.stopBGM();
        
        if (data.winner === 1) {
            AudioManager.instance.playSFX(SoundType.VICTORY);
        } else {
            AudioManager.instance.playSFX(SoundType.DEFEAT);
        }
        
        AudioManager.instance.playBGM(BGMType.RESULT);
    }
}