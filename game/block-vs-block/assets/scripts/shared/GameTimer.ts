import { _decorator } from 'cc';

const { ccclass } = _decorator;

/**
 * 游戏计时器
 * 管理30秒回合和3分钟总时长
 */
@ccclass('GameTimer')
export class GameTimer {
    // 总游戏时长（毫秒）
    private totalGameTime: number = 180000; // 3分钟
    
    // 回合时长（毫秒）
    private roundDuration: number = 30000; // 30秒
    
    // 警告开始时间（毫秒）
    private warningStartTime: number = 25000; // 25秒
    
    // 当前状态
    private elapsedTime: number = 0;
    private roundTime: number = 0;
    private currentRound: number = 1;
    private totalRounds: number = 6;
    private isRunning: boolean = false;
    private isPaused: boolean = false;
    
    // 回调
    private onRoundEnd?: () => void;
    private onWarning?: () => void;
    private onGameEnd?: () => void;

    /**
     * 更新计时器
     */
    public update(deltaTime: number): void {
        if (!this.isRunning || this.isPaused) return;

        const dt = deltaTime * 1000; // 转换为毫秒
        this.elapsedTime += dt;
        this.roundTime += dt;

        // 检查警告
        if (this.roundTime >= this.warningStartTime && this.roundTime < this.warningStartTime + dt) {
            this.onWarning?.();
        }

        // 检查回合结束
        if (this.roundTime >= this.roundDuration) {
            this.handleRoundEnd();
        }

        // 检查游戏结束
        if (this.elapsedTime >= this.totalGameTime) {
            this.handleGameEnd();
        }
    }

    /**
     * 处理回合结束
     */
    private handleRoundEnd(): void {
        this.roundTime = 0;
        this.currentRound++;
        
        if (this.currentRound <= this.totalRounds) {
            this.onRoundEnd?.();
        }
    }

    /**
     * 处理游戏结束
     */
    private handleGameEnd(): void {
        this.isRunning = false;
        this.onGameEnd?.();
    }

    /**
     * 开始游戏
     */
    public start(): void {
        this.reset();
        this.isRunning = true;
    }

    /**
     * 暂停
     */
    public pause(): void {
        this.isPaused = true;
    }

    /**
     * 恢复
     */
    public resume(): void {
        this.isPaused = false;
    }

    /**
     * 重置
     */
    public reset(): void {
        this.elapsedTime = 0;
        this.roundTime = 0;
        this.currentRound = 1;
        this.isRunning = false;
        this.isPaused = false;
    }

    // ===== Getters =====

    public getRemainingTime(): number {
        return Math.max(0, this.totalGameTime - this.elapsedTime);
    }

    public getRoundRemainingTime(): number {
        return Math.max(0, this.roundDuration - this.roundTime);
    }

    public getCurrentRound(): number {
        return this.currentRound;
    }

    public getTotalRounds(): number {
        return this.totalRounds;
    }

    public isWarningPhase(): boolean {
        return this.roundTime >= this.warningStartTime;
    }

    public getRoundProgress(): number {
        return this.roundTime / this.roundDuration;
    }

    public getElapsedSeconds(): number {
        return Math.floor(this.elapsedTime / 1000);
    }

    public getRemainingSeconds(): number {
        return Math.ceil(this.getRemainingTime() / 1000);
    }

    // ===== Setters =====

    public setCallbacks(onRoundEnd: () => void, onWarning: () => void, onGameEnd: () => void): void {
        this.onRoundEnd = onRoundEnd;
        this.onWarning = onWarning;
        this.onGameEnd = onGameEnd;
    }
}