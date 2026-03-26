import { _decorator, Component, Node } from 'cc';
import { UILabel } from './UILabel';
import { EventBus, GameEventType } from '../core/EventBus';
import { GameStateManager, GameState } from '../core/GameStateManager';

const { ccclass, property } = _decorator;

/**
 * 游戏HUD组件
 */
@ccclass('GameHUD')
export class GameHUD extends Component {
    // 分数显示
    @property(UILabel)
    public p1ScoreLabel: UILabel | null = null;

    @property(UILabel)
    public p2ScoreLabel: UILabel | null = null;

    // 计时器显示
    @property(UILabel)
    public timerLabel: UILabel | null = null;

    // 回合显示
    @property(UILabel)
    public roundLabel: UILabel | null = null;

    // 角色显示
    @property(UILabel)
    public p1RoleLabel: UILabel | null = null;

    @property(UILabel)
    public p2RoleLabel: UILabel | null = null;

    // 警告节点
    @property(Node)
    public warningNode: Node | null = null;

    private p1Score: number = 0;
    private p2Score: number = 0;
    private currentRound: number = 1;
    private totalRounds: number = 6;

    protected onLoad(): void {
        this.registerEvents();
        this.updateDisplay();
    }

    private registerEvents(): void {
        EventBus.instance.on(GameEventType.SCORE_UPDATE, this.onScoreUpdate, this);
        EventBus.instance.on(GameEventType.ROLE_SWAP_WARNING, this.onWarning, this);
        EventBus.instance.on(GameEventType.ROLE_SWAP_COMPLETE, this.onSwapComplete, this);
        EventBus.instance.on(GameEventType.ROUND_START, this.onRoundStart, this);
    }

    protected onDestroy(): void {
        EventBus.instance.off(GameEventType.SCORE_UPDATE, this.onScoreUpdate, this);
        EventBus.instance.off(GameEventType.ROLE_SWAP_WARNING, this.onWarning, this);
        EventBus.instance.off(GameEventType.ROLE_SWAP_COMPLETE, this.onSwapComplete, this);
        EventBus.instance.off(GameEventType.ROUND_START, this.onRoundStart, this);
    }

    private onScoreUpdate(data: { playerId: number; score: number }): void {
        if (data.playerId === 1) {
            this.p1Score = data.score;
            if (this.p1ScoreLabel) {
                this.p1ScoreLabel.setText(data.score.toString());
            }
        } else {
            this.p2Score = data.score;
            if (this.p2ScoreLabel) {
                this.p2ScoreLabel.setText(data.score.toString());
            }
        }
    }

    private onWarning(data: { remainingTime: number }): void {
        if (this.warningNode) {
            this.warningNode.active = true;
        }
    }

    private onSwapComplete(data: { p1Role: string; p2Role: string }): void {
        if (this.warningNode) {
            this.warningNode.active = false;
        }
        this.updateRoleDisplay(data.p1Role, data.p2Role);
    }

    private onRoundStart(data: { roundNumber: number }): void {
        this.currentRound = data.roundNumber;
        this.updateRoundDisplay();
    }

    private updateRoleDisplay(p1Role: string, p2Role: string): void {
        if (this.p1RoleLabel) {
            this.p1RoleLabel.setText(p1Role === 'TETRIS' ? '方块' : '弹球');
        }
        if (this.p2RoleLabel) {
            this.p2RoleLabel.setText(p2Role === 'TETRIS' ? '方块' : '弹球');
        }
    }

    private updateRoundDisplay(): void {
        if (this.roundLabel) {
            this.roundLabel.setText(`回合 ${this.currentRound}/${this.totalRounds}`);
        }
    }

    public updateTimer(remainingSeconds: number): void {
        if (this.timerLabel) {
            const minutes = Math.floor(remainingSeconds / 60);
            const seconds = remainingSeconds % 60;
            this.timerLabel.setText(
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
            );
        }
    }

    private updateDisplay(): void {
        this.updateRoundDisplay();
        if (this.warningNode) {
            this.warningNode.active = false;
        }
    }

    public reset(): void {
        this.p1Score = 0;
        this.p2Score = 0;
        this.currentRound = 1;
        this.updateDisplay();
    }
}