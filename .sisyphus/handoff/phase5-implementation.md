# Phase 5 - UI Implementation Code

This file contains the implementation for UI module.

---

## Task 1: UIButton.ts

**Target File:** `game/block-vs-block/assets/scripts/ui/UIButton.ts`

```typescript
import { _decorator, Component, Node, EventTouch, Color, Sprite, Label } from 'cc';

const { ccclass, property } = _decorator;

/**
 * UI按钮组件
 */
@ccclass('UIButton')
export class UIButton extends Component {
    @property(Sprite)
    public background: Sprite | null = null;

    @property(Label)
    public label: Label | null = null;

    @property
    public normalColor: Color = new Color(100, 100, 100, 255);

    @property
    public pressedColor: Color = new Color(70, 70, 70, 255);

    @property
    public hoverColor: Color = new Color(120, 120, 120, 255);

    @property
    public disabledColor: Color = new Color(50, 50, 50, 150);

    private isPressed: boolean = false;
    private isHovered: boolean = false;
    private isDisabled: boolean = false;
    private onClickCallback: (() => void) | null = null;

    protected onLoad(): void {
        this.registerEvents();
        this.updateVisual();
    }

    private registerEvents(): void {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    private onTouchStart(event: EventTouch): void {
        if (this.isDisabled) return;
        this.isPressed = true;
        this.updateVisual();
    }

    private onTouchEnd(event: EventTouch): void {
        if (this.isDisabled) return;
        this.isPressed = false;
        this.updateVisual();
        
        if (this.onClickCallback) {
            this.onClickCallback();
        }
    }

    private onTouchCancel(event: EventTouch): void {
        if (this.isDisabled) return;
        this.isPressed = false;
        this.updateVisual();
    }

    private updateVisual(): void {
        if (!this.background) return;

        let color: Color;
        if (this.isDisabled) {
            color = this.disabledColor;
        } else if (this.isPressed) {
            color = this.pressedColor;
        } else if (this.isHovered) {
            color = this.hoverColor;
        } else {
            color = this.normalColor;
        }

        this.background.color = color;
    }

    public setOnClick(callback: () => void): void {
        this.onClickCallback = callback;
    }

    public setText(text: string): void {
        if (this.label) {
            this.label.string = text;
        }
    }

    public setDisabled(disabled: boolean): void {
        this.isDisabled = disabled;
        this.updateVisual();
    }

    public getDisabled(): boolean {
        return this.isDisabled;
    }
}
```

---

## Task 2: UILabel.ts

**Target File:** `game/block-vs-block/assets/scripts/ui/UILabel.ts`

```typescript
import { _decorator, Component, Label, Color } from 'cc';

const { ccclass, property } = _decorator;

/**
 * UI文本标签组件
 */
@ccclass('UILabel')
export class UILabel extends Component {
    @property(Label)
    public label: Label | null = null;

    @property
    public prefix: string = '';

    @property
    public suffix: string = '';

    protected onLoad(): void {
        if (!this.label) {
            this.label = this.getComponent(Label);
        }
    }

    public setText(text: string): void {
        if (this.label) {
            this.label.string = this.prefix + text + this.suffix;
        }
    }

    public getText(): string {
        return this.label?.string || '';
    }

    public setColor(color: Color): void {
        if (this.label) {
            this.label.color = color;
        }
    }

    public setFontSize(size: number): void {
        if (this.label) {
            this.label.fontSize = size;
        }
    }

    public setPrefix(prefix: string): void {
        this.prefix = prefix;
    }

    public setSuffix(suffix: string): void {
        this.suffix = suffix;
    }
}
```

---

## Task 3: GameHUD.ts

**Target File:** `game/block-vs-block/assets/scripts/ui/GameHUD.ts`

```typescript
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
```

---

## Task 4: ScorePanel.ts

**Target File:** `game/block-vs-block/assets/scripts/ui/ScorePanel.ts`

```typescript
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
```

---

## Task 5: TimerDisplay.ts

**Target File:** `game/block-vs-block/assets/scripts/ui/TimerDisplay.ts`

```typescript
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
```

---

## Task 6: ResultUI.ts

**Target File:** `game/block-vs-block/assets/scripts/ui/ResultUI.ts`

```typescript
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
```

---

## Task 7: TouchControl.ts

**Target File:** `game/block-vs-block/assets/scripts/ui/TouchControl.ts`

```typescript
import { _decorator, Component, Node, EventTouch, Vec2 } from 'cc';
import { EventBus, GameEventType } from '../core/EventBus';
import { InputType } from '../tetris/TetrisTypes';
import { BreakoutInput } from '../breakout/BreakoutTypes';

const { ccclass, property } = _decorator;

/**
 * 触控区域类型
 */
export enum TouchZone {
    LEFT = 'LEFT',
    CENTER = 'CENTER',
    RIGHT = 'RIGHT'
}

/**
 * 触控区域组件
 */
@ccclass('TouchControl')
export class TouchControl extends Component {
    @property(Node)
    public leftZone: Node | null = null;

    @property(Node)
    public centerZone: Node | null = null;

    @property(Node)
    public rightZone: Node | null = null;

    @property
    public playerId: number = 1;

    @property
    public controlType: 'TETRIS' | 'BREAKOUT' = 'TETRIS';

    private touchStartPos: Vec2 = new Vec2();
    private isTouching: boolean = false;
    private lastTapTime: number = 0;
    private doubleTapThreshold: number = 300; // 毫秒

    // 回调
    private onTetrisInput: ((input: InputType) => void) | null = null;
    private onBreakoutInput: ((input: BreakoutInput) => void) | null = null;

    protected onLoad(): void {
        this.registerTouchEvents();
    }

    private registerTouchEvents(): void {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    private onTouchStart(event: EventTouch): void {
        this.isTouching = true;
        const pos = event.getUILocation();
        this.touchStartPos.set(pos.x, pos.y);
    }

    private onTouchEnd(event: EventTouch): void {
        if (!this.isTouching) return;
        this.isTouching = false;

        const pos = event.getUILocation();
        const deltaX = pos.x - this.touchStartPos.x;
        const deltaY = pos.y - this.touchStartPos.y;

        // 判断是否为滑动
        if (Math.abs(deltaY) > 50 && deltaY < 0) {
            // 下滑 = 软降
            this.handleSwipe('DOWN');
        } else if (Math.abs(deltaY) > 100 && deltaY < 0) {
            // 快速下滑 = 硬降
            this.handleSwipe('HARD_DROP');
        } else {
            // 点击区域
            const zone = this.getTouchZone(pos.x);
            this.handleTap(zone);
        }

        // 停止加速
        if (this.controlType === 'BREAKOUT') {
            this.sendBreakoutInput(BreakoutInput.STOP_ACCELERATE);
        }
    }

    private onTouchMove(event: EventTouch): void {
        if (!this.isTouching) return;

        // 长按加速（弹球模式）
        if (this.controlType === 'BREAKOUT') {
            this.sendBreakoutInput(BreakoutInput.ACCELERATE);
        }
    }

    private onTouchCancel(event: EventTouch): void {
        this.isTouching = false;
        if (this.controlType === 'BREAKOUT') {
            this.sendBreakoutInput(BreakoutInput.STOP_ACCELERATE);
        }
    }

    private getTouchZone(x: number): TouchZone {
        const width = this.node.getComponent('cc.UITransform')?.width || 300;
        const third = width / 3;

        if (x < third) {
            return TouchZone.LEFT;
        } else if (x < third * 2) {
            return TouchZone.CENTER;
        } else {
            return TouchZone.RIGHT;
        }
    }

    private handleTap(zone: TouchZone): void {
        const now = Date.now();
        const isDoubleTap = (now - this.lastTapTime) < this.doubleTapThreshold;
        this.lastTapTime = now;

        if (this.controlType === 'TETRIS') {
            this.handleTetrisTap(zone, isDoubleTap);
        } else {
            this.handleBreakoutTap(zone, isDoubleTap);
        }
    }

    private handleTetrisTap(zone: TouchZone, isDoubleTap: boolean): void {
        if (isDoubleTap) {
            // 双击 = Hold
            this.sendTetrisInput(InputType.HOLD);
            return;
        }

        switch (zone) {
            case TouchZone.LEFT:
                this.sendTetrisInput(InputType.MOVE_LEFT);
                break;
            case TouchZone.CENTER:
                this.sendTetrisInput(InputType.ROTATE_CW);
                break;
            case TouchZone.RIGHT:
                this.sendTetrisInput(InputType.MOVE_RIGHT);
                break;
        }
    }

    private handleBreakoutTap(zone: TouchZone, isDoubleTap: boolean): void {
        switch (zone) {
            case TouchZone.LEFT:
                this.sendBreakoutInput(BreakoutInput.MOVE_LEFT);
                break;
            case TouchZone.CENTER:
                this.sendBreakoutInput(BreakoutInput.LAUNCH);
                break;
            case TouchZone.RIGHT:
                this.sendBreakoutInput(BreakoutInput.MOVE_RIGHT);
                break;
        }
    }

    private handleSwipe(direction: string): void {
        if (this.controlType === 'TETRIS') {
            if (direction === 'DOWN') {
                this.sendTetrisInput(InputType.MOVE_DOWN);
            } else if (direction === 'HARD_DROP') {
                this.sendTetrisInput(InputType.HARD_DROP);
            }
        }
    }

    private sendTetrisInput(input: InputType): void {
        if (this.onTetrisInput) {
            this.onTetrisInput(input);
        }
        EventBus.instance.emit(GameEventType.TETRIS_PIECE_MOVE, {
            playerId: this.playerId,
            input
        });
    }

    private sendBreakoutInput(input: BreakoutInput): void {
        if (this.onBreakoutInput) {
            this.onBreakoutInput(input);
        }
    }

    public setTetrisCallback(callback: (input: InputType) => void): void {
        this.onTetrisInput = callback;
    }

    public setBreakoutCallback(callback: (input: BreakoutInput) => void): void {
        this.onBreakoutInput = callback;
    }

    public setControlType(type: 'TETRIS' | 'BREAKOUT'): void {
        this.controlType = type;
    }
}
```

---

## Task 8: index.ts

**Target File:** `game/block-vs-block/assets/scripts/ui/index.ts`

```typescript
/**
 * UI模块导出
 */

export { UIButton } from './UIButton';
export { UILabel } from './UILabel';
export { GameHUD } from './GameHUD';
export { ScorePanel } from './ScorePanel';
export { TimerDisplay } from './TimerDisplay';
export { ResultUI } from './ResultUI';
export { TouchControl, TouchZone } from './TouchControl';
```

---

## Summary

Phase 5 creates 8 files:

1. **UIButton.ts** - 按钮组件（触摸、颜色变化、回调）
2. **UILabel.ts** - 文本标签（前缀、后缀、颜色）
3. **GameHUD.ts** - 游戏HUD（分数、计时器、回合）
4. **ScorePanel.ts** - 分数面板（分数、连击、等级）
5. **TimerDisplay.ts** - 计时器显示（倒计时、警告颜色）
6. **ResultUI.ts** - 结算界面（胜负、分数、按钮）
7. **TouchControl.ts** - 触控区域（点击、滑动、双击）
8. **index.ts** - 模块导出

All files should be written to: `game/block-vs-block/assets/scripts/ui/`