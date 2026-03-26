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