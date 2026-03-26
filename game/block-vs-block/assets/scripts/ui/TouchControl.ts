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