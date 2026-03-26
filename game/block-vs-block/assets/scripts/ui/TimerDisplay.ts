import { _decorator, Component, Color } from 'cc';
import { UILabel } from './UILabel';

const { ccclass, property } = _decorator;

/**
 * 计时器显示组件
 */
@ccclass('TimerDisplay')
export class TimerDisplay extends Component {
    @property(UILabel)
    public timerLabel: UILabel | null = null;

    @property
    public warningThreshold: number = 5; // 秒

    @property
    public normalColor: Color = new Color(255, 255, 255, 255);

    @property
    public warningColor: Color = new Color(255, 200, 0, 255);

    @property
    public criticalColor: Color = new Color(255, 50, 50, 255);

    private totalSeconds: number = 180; // 3分钟
    private remainingSeconds: number = 180;
    private isWarning: boolean = false;

    public setTime(seconds: number): void {
        this.remainingSeconds = Math.max(0, seconds);
        this.updateDisplay();
    }

    public setTotalTime(seconds: number): void {
        this.totalSeconds = seconds;
        this.remainingSeconds = seconds;
        this.updateDisplay();
    }

    public tick(): void {
        if (this.remainingSeconds > 0) {
            this.remainingSeconds--;
            this.updateDisplay();
        }
    }

    public getRemainingTime(): number {
        return this.remainingSeconds;
    }

    public isTimeUp(): boolean {
        return this.remainingSeconds <= 0;
    }

    private updateDisplay(): void {
        if (!this.timerLabel) return;

        const minutes = Math.floor(this.remainingSeconds / 60);
        const seconds = this.remainingSeconds % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        this.timerLabel.setText(timeString);
        this.updateColor();
    }

    private updateColor(): void {
        if (!this.timerLabel) return;

        let color: Color;
        if (this.remainingSeconds <= 5) {
            color = this.criticalColor;
        } else if (this.remainingSeconds <= this.warningThreshold) {
            color = this.warningColor;
        } else {
            color = this.normalColor;
        }

        this.timerLabel.setColor(color);
    }

    public setWarning(isWarning: boolean): void {
        this.isWarning = isWarning;
        this.updateColor();
    }

    public reset(): void {
        this.remainingSeconds = this.totalSeconds;
        this.isWarning = false;
        this.updateDisplay();
    }
}