import { PaddleState, BreakoutInput } from './BreakoutTypes';
import { BreakoutConfig } from './BreakoutConfig';

/**
 * 挡板类
 */
export class Paddle {
    private state: PaddleState;
    private moveDirection: number = 0; // -1: 左, 0: 停, 1: 右

    constructor() {
        this.state = {
            x: BreakoutConfig.BOARD_WIDTH / 2,
            y: BreakoutConfig.PADDLE_Y,
            width: BreakoutConfig.PADDLE_WIDTH,
            height: BreakoutConfig.PADDLE_HEIGHT,
            speed: BreakoutConfig.PADDLE_SPEED
        };
    }

    /**
     * 获取状态
     */
    public getState(): PaddleState {
        return { ...this.state };
    }

    /**
     * 获取位置
     */
    public getPosition(): { x: number; y: number } {
        return { x: this.state.x, y: this.state.y };
    }

    /**
     * 获取碰撞盒
     */
    public getBounds(): { left: number; right: number; top: number; bottom: number } {
        const halfWidth = this.state.width / 2;
        const halfHeight = this.state.height / 2;
        
        return {
            left: this.state.x - halfWidth,
            right: this.state.x + halfWidth,
            top: this.state.y + halfHeight,
            bottom: this.state.y - halfHeight
        };
    }

    /**
     * 更新挡板
     */
    public update(deltaTime: number): void {
        if (this.moveDirection === 0) {
            return;
        }

        // 移动
        const movement = this.moveDirection * this.state.speed * deltaTime;
        this.state.x += movement;

        // 边界限制
        const halfWidth = this.state.width / 2;
        const minX = halfWidth;
        const maxX = BreakoutConfig.BOARD_WIDTH - halfWidth;

        this.state.x = Math.max(minX, Math.min(maxX, this.state.x));
    }

    /**
     * 处理输入
     */
    public handleInput(input: BreakoutInput): void {
        switch (input) {
            case BreakoutInput.MOVE_LEFT:
                this.moveDirection = -1;
                break;
            case BreakoutInput.MOVE_RIGHT:
                this.moveDirection = 1;
                break;
            case BreakoutInput.STOP_ACCELERATE:
                this.moveDirection = 0;
                break;
            default:
                this.moveDirection = 0;
        }
    }

    /**
     * 停止移动
     */
    public stop(): void {
        this.moveDirection = 0;
    }

    /**
     * 设置位置
     */
    public setPosition(x: number): void {
        const halfWidth = this.state.width / 2;
        const minX = halfWidth;
        const maxX = BreakoutConfig.BOARD_WIDTH - halfWidth;
        
        this.state.x = Math.max(minX, Math.min(maxX, x));
    }

    /**
     * 重置
     */
    public reset(): void {
        this.state.x = BreakoutConfig.BOARD_WIDTH / 2;
        this.moveDirection = 0;
    }

    /**
     * 计算球碰撞后的反弹角度
     * 根据球击中挡板的位置计算反弹方向
     */
    public calculateBounceAngle(ballX: number): number {
        // 计算击中位置相对于挡板中心的偏移
        const relativeX = ballX - this.state.x;
        const normalizedX = relativeX / (this.state.width / 2);
        
        // 将偏移映射到反弹角度
        const minAngle = BreakoutConfig.MIN_BOUNCE_ANGLE;
        const maxAngle = BreakoutConfig.MAX_BOUNCE_ANGLE;
        const angleRange = maxAngle - minAngle;
        
        // 根据击中位置计算角度
        // 左侧：-60° ~ -15°, 中心：约45°, 右侧：15° ~ 60°
        const angle = 45 + normalizedX * angleRange;
        
        // 限制角度范围
        return Math.max(minAngle, Math.min(maxAngle, angle));
    }
}