import { TetrisConfig } from './TetrisConfig';

/**
 * 等级管理器
 * 时间驱动升级系统
 */
export class LevelManager {
    private currentLevel: number = 1;
    private timeSinceLastLevelUp: number = 0;
    private totalGameTime: number = 0;

    /**
     * 更新等级（每帧调用）
     * @param deltaTime 距离上一帧的时间（毫秒）
     */
    public update(deltaTime: number): void {
        this.totalGameTime += deltaTime;
        this.timeSinceLastLevelUp += deltaTime;

        // 每60秒升级一次
        if (this.timeSinceLastLevelUp >= TetrisConfig.LEVEL_UP_TIME) {
            this.levelUp();
            this.timeSinceLastLevelUp = 0;
        }
    }

    /**
     * 升级
     */
    private levelUp(): void {
        if (this.currentLevel < TetrisConfig.MAX_LEVEL) {
            this.currentLevel++;
            console.log(`[LevelManager] Level up! Now level ${this.currentLevel}`);
        }
    }

    /**
     * 获取当前等级
     */
    public getLevel(): number {
        return this.currentLevel;
    }

    /**
     * 获取当前下落速度（毫秒/格）
     */
    public getFallSpeed(): number {
        return TetrisConfig.getFallSpeed(this.currentLevel);
    }

    /**
     * 获取距离下一等级的时间（毫秒）
     */
    public getTimeToNextLevel(): number {
        return TetrisConfig.LEVEL_UP_TIME - this.timeSinceLastLevelUp;
    }

    /**
     * 获取总游戏时间（毫秒）
     */
    public getTotalGameTime(): number {
        return this.totalGameTime;
    }

    /**
     * 获取总游戏时间（秒）
     */
    public getTotalGameTimeSeconds(): number {
        return Math.floor(this.totalGameTime / 1000);
    }

    /**
     * 获取升级进度（0-1）
     */
    public getLevelUpProgress(): number {
        return this.timeSinceLastLevelUp / TetrisConfig.LEVEL_UP_TIME;
    }

    /**
     * 是否最高等级
     */
    public isMaxLevel(): boolean {
        return this.currentLevel >= TetrisConfig.MAX_LEVEL;
    }

    /**
     * 设置等级（用于测试或特殊场景）
     */
    public setLevel(level: number): void {
        this.currentLevel = Math.min(Math.max(1, level), TetrisConfig.MAX_LEVEL);
    }

    /**
     * 重置等级管理器
     */
    public reset(): void {
        this.currentLevel = 1;
        this.timeSinceLastLevelUp = 0;
        this.totalGameTime = 0;
    }
}