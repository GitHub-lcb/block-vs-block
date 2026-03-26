import { BreakoutConfig } from './BreakoutConfig';

/**
 * 连击系统
 */
export class ComboSystem {
    private combo: number = 0;
    private lastHitTime: number = 0;
    private maxCombo: number = 0;

    /**
     * 记录击中
     */
    public recordHit(currentTime: number): void {
        if (currentTime - this.lastHitTime <= BreakoutConfig.COMBO_TIMEOUT) {
            this.combo++;
        } else {
            this.combo = 1;
        }
        
        this.lastHitTime = currentTime;
        this.maxCombo = Math.max(this.maxCombo, this.combo);
    }

    /**
     * 球丢失时重置连击
     */
    public resetCombo(): void {
        this.combo = 0;
    }

    /**
     * 获取当前连击数
     */
    public getCombo(): number {
        return this.combo;
    }

    /**
     * 获取最大连击数
     */
    public getMaxCombo(): number {
        return this.maxCombo;
    }

    /**
     * 计算连击加成分数
     */
    public calculateComboBonus(baseScore: number): number {
        if (this.combo <= 1) return 0;
        return this.combo * BreakoutConfig.COMBO_MULTIPLIER;
    }

    /**
     * 获取连击状态
     */
    public isActive(): boolean {
        return this.combo > 1;
    }

    /**
     * 重置系统
     */
    public reset(): void {
        this.combo = 0;
        this.lastHitTime = 0;
        this.maxCombo = 0;
    }
}