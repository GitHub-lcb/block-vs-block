import { _decorator, Component, Node } from 'cc';
import { UILabel } from './UILabel';
import { UIButton } from './UIButton';
import { EventBus, GameEventType } from '../core/EventBus';

const { ccclass, property } = _decorator;

/**
 * 结算界面组件
 */
@ccclass('ResultUI')
export class ResultUI extends Component {
    // 结果显示
    @property(UILabel)
    public resultLabel: UILabel | null = null;

    @property(UILabel)
    public winnerLabel: UILabel | null = null;

    // 分数显示
    @property(UILabel)
    public p1ScoreLabel: UILabel | null = null;

    @property(UILabel)
    public p2ScoreLabel: UILabel | null = null;

    // 统计显示
    @property(UILabel)
    public p1StatsLabel: UILabel | null = null;

    @property(UILabel)
    public p2StatsLabel: UILabel | null = null;

    // 按钮
    @property(UIButton)
    public replayButton: UIButton | null = null;

    @property(UIButton)
    public menuButton: UIButton | null = null;

    // 回调
    private onReplayCallback: (() => void) | null = null;
    private onMenuCallback: (() => void) | null = null;

    protected onLoad(): void {
        this.setupButtons();
        this.hide();
    }

    private setupButtons(): void {
        if (this.replayButton) {
            this.replayButton.setOnClick(() => {
                if (this.onReplayCallback) {
                    this.onReplayCallback();
                }
            });
        }

        if (this.menuButton) {
            this.menuButton.setOnClick(() => {
                if (this.onMenuCallback) {
                    this.onMenuCallback();
                }
            });
        }
    }

    public show(data: {
        winner: number;
        p1Score: number;
        p2Score: number;
        p1Stats?: string;
        p2Stats?: string;
        reason?: string;
    }): void {
        this.node.active = true;

        // 设置胜负
        if (this.resultLabel) {
            this.resultLabel.setText(data.reason || '游戏结束');
        }

        if (this.winnerLabel) {
            this.winnerLabel.setText(`玩家 ${data.winner} 获胜！`);
        }

        // 设置分数
        if (this.p1ScoreLabel) {
            this.p1ScoreLabel.setText(data.p1Score.toString());
        }

        if (this.p2ScoreLabel) {
            this.p2ScoreLabel.setText(data.p2Score.toString());
        }

        // 设置统计
        if (this.p1StatsLabel && data.p1Stats) {
            this.p1StatsLabel.setText(data.p1Stats);
        }

        if (this.p2StatsLabel && data.p2Stats) {
            this.p2StatsLabel.setText(data.p2Stats);
        }
    }

    public hide(): void {
        this.node.active = false;
    }

    public setCallbacks(onReplay: () => void, onMenu: () => void): void {
        this.onReplayCallback = onReplay;
        this.onMenuCallback = onMenu;
    }
}