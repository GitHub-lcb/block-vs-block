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
                .to(0.25, { a: 200 } as any)
                .to(0.25, { a: 100 } as any)
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