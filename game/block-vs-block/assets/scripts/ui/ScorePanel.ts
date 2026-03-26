import { _decorator, Component, Node, Color } from 'cc';
import { UILabel } from './UILabel';
import { EventBus, GameEventType } from '../core/EventBus';

const { ccclass, property } = _decorator;

/**
 * 分数面板组件
 */
@ccclass('ScorePanel')
export class ScorePanel extends Component {
    @property(UILabel)
    public scoreLabel: UILabel | null = null;

    @property(UILabel)
    public comboLabel: UILabel | null = null;

    @property(UILabel)
    public levelLabel: UILabel | null = null;

    @property(Node)
    public playerIndicator: Node | null = null;

    @property
    public playerId: number = 1;

    private score: number = 0;
    private combo: number = 0;
    private level: number = 1;

    protected onLoad(): void {
        this.registerEvents();
        this.updateDisplay();
    }

    private registerEvents(): void {
        EventBus.instance.on(GameEventType.SCORE_UPDATE, this.onScoreUpdate, this);
        EventBus.instance.on(GameEventType.BREAKOUT_COMBO_UPDATE, this.onComboUpdate, this);
    }

    protected onDestroy(): void {
        EventBus.instance.off(GameEventType.SCORE_UPDATE, this.onScoreUpdate, this);
        EventBus.instance.off(GameEventType.BREAKOUT_COMBO_UPDATE, this.onComboUpdate, this);
    }

    private onScoreUpdate(data: { playerId: number; score: number }): void {
        if (data.playerId !== this.playerId) return;
        
        this.score = data.score;
        this.updateDisplay();
    }

    private onComboUpdate(data: { playerId: number; combo: number }): void {
        if (data.playerId !== this.playerId) return;
        
        this.combo = data.combo;
        this.updateComboDisplay();
    }

    private updateDisplay(): void {
        if (this.scoreLabel) {
            this.scoreLabel.setText(this.score.toString());
        }
        if (this.levelLabel) {
            this.levelLabel.setText(`Lv.${this.level}`);
        }
    }

    private updateComboDisplay(): void {
        if (this.comboLabel) {
            if (this.combo > 1) {
                this.comboLabel.setText(`${this.combo}连击`);
                this.comboLabel.node.active = true;
            } else {
                this.comboLabel.node.active = false;
            }
        }
    }

    public setLevel(level: number): void {
        this.level = level;
        this.updateDisplay();
    }

    public setScore(score: number): void {
        this.score = score;
        this.updateDisplay();
    }

    public getScore(): number {
        return this.score;
    }

    public reset(): void {
        this.score = 0;
        this.combo = 0;
        this.level = 1;
        this.updateDisplay();
    }
}