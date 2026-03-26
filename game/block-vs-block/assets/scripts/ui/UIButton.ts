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