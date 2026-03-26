import { BallState, BreakoutInput, CollisionResult } from './BreakoutTypes';
import { BreakoutConfig } from './BreakoutConfig';
import { Paddle } from './Paddle';

/**
 * 球类
 */
export class Ball {
    private state: BallState;
    private paddle: Paddle | null = null;

    constructor() {
        this.state = {
            x: BreakoutConfig.BOARD_WIDTH / 2,
            y: BreakoutConfig.PADDLE_Y + BreakoutConfig.PADDLE_HEIGHT / 2 + BreakoutConfig.BALL_RADIUS,
            vx: 0,
            vy: 0,
            speed: BreakoutConfig.BALL_SPEED,
            isLaunched: false,
            isAccelerated: false
        };
    }

    /**
     * 设置关联挡板
     */
    public setPaddle(paddle: Paddle): void {
        this.paddle = paddle;
    }

    /**
     * 获取状态
     */
    public getState(): BallState {
        return { ...this.state };
    }

    /**
     * 获取位置
     */
    public getPosition(): { x: number; y: number } {
        return { x: this.state.x, y: this.state.y };
    }

    /**
     * 获取半径
     */
    public getRadius(): number {
        return BreakoutConfig.BALL_RADIUS;
    }

    /**
     * 发射球
     */
    public launch(): void {
        if (this.state.isLaunched) {
            return;
        }

        // 随机发射角度
        const minAngle = BreakoutConfig.BALL_LAUNCH_ANGLE_MIN;
        const maxAngle = BreakoutConfig.BALL_LAUNCH_ANGLE_MAX;
        const angle = this.degreesToRadians(minAngle + Math.random() * (maxAngle - minAngle));

        this.state.vx = Math.sin(angle) * this.state.speed;
        this.state.vy = Math.cos(angle) * this.state.speed; // 向上为正
        this.state.isLaunched = true;
    }

    /**
     * 更新球位置
     */
    public update(deltaTime: number): void {
        if (!this.state.isLaunched) {
            // 未发射时跟随挡板
            if (this.paddle) {
                const paddlePos = this.paddle.getPosition();
                this.state.x = paddlePos.x;
                this.state.y = paddlePos.y + BreakoutConfig.PADDLE_HEIGHT / 2 + BreakoutConfig.BALL_RADIUS;
            }
            return;
        }

        // 计算当前速度
        let currentSpeed = this.state.speed;
        if (this.state.isAccelerated) {
            currentSpeed *= BreakoutConfig.BALL_ACCELERATE_MULTIPLIER;
        }

        // 归一化速度向量
        const magnitude = Math.sqrt(this.state.vx * this.state.vx + this.state.vy * this.state.vy);
        if (magnitude > 0) {
            this.state.vx = (this.state.vx / magnitude) * currentSpeed;
            this.state.vy = (this.state.vy / magnitude) * currentSpeed;
        }

        // 移动
        this.state.x += this.state.vx * deltaTime;
        this.state.y += this.state.vy * deltaTime;
    }

    /**
     * 处理输入
     */
    public handleInput(input: BreakoutInput): void {
        switch (input) {
            case BreakoutInput.LAUNCH:
                this.launch();
                break;
            case BreakoutInput.ACCELERATE:
                this.state.isAccelerated = true;
                break;
            case BreakoutInput.STOP_ACCELERATE:
                this.state.isAccelerated = false;
                break;
        }
    }

    /**
     * 反弹 - 水平方向
     */
    public bounceHorizontal(): void {
        this.state.vx = -this.state.vx;
    }

    /**
     * 反弹 - 垂直方向
     */
    public bounceVertical(): void {
        this.state.vy = -this.state.vy;
    }

    /**
     * 根据挡板位置反弹
     */
    public bounceOffPaddle(paddle: Paddle): void {
        const bounceAngle = paddle.calculateBounceAngle(this.state.x);
        const angle = this.degreesToRadians(bounceAngle);
        const speed = this.state.isAccelerated 
            ? this.state.speed * BreakoutConfig.BALL_ACCELERATE_MULTIPLIER 
            : this.state.speed;

        this.state.vx = Math.sin(angle) * speed;
        this.state.vy = Math.abs(Math.cos(angle) * speed); // 确保向上
    }

    /**
     * 检查是否出界（底部）
     */
    public isOutOfBounds(): boolean {
        return this.state.y < -BreakoutConfig.BALL_RADIUS;
    }

    /**
     * 检查边界碰撞
     */
    public checkBoundaryCollision(): { left: boolean; right: boolean; top: boolean; bottom: boolean } {
        const radius = BreakoutConfig.BALL_RADIUS;
        
        return {
            left: this.state.x - radius < 0,
            right: this.state.x + radius > BreakoutConfig.BOARD_WIDTH,
            top: this.state.y + radius > BreakoutConfig.BOARD_HEIGHT,
            bottom: this.state.y - radius < 0
        };
    }

    /**
     * 处理边界碰撞
     */
    public handleBoundaryCollision(): void {
        const collision = this.checkBoundaryCollision();
        const radius = BreakoutConfig.BALL_RADIUS;

        if (collision.left) {
            this.state.x = radius;
            this.bounceHorizontal();
        }
        if (collision.right) {
            this.state.x = BreakoutConfig.BOARD_WIDTH - radius;
            this.bounceHorizontal();
        }
        if (collision.top) {
            this.state.y = BreakoutConfig.BOARD_HEIGHT - radius;
            this.bounceVertical();
        }
    }

    /**
     * 重置球
     */
    public reset(): void {
        this.state = {
            x: BreakoutConfig.BOARD_WIDTH / 2,
            y: BreakoutConfig.PADDLE_Y + BreakoutConfig.PADDLE_HEIGHT / 2 + BreakoutConfig.BALL_RADIUS,
            vx: 0,
            vy: 0,
            speed: BreakoutConfig.BALL_SPEED,
            isLaunched: false,
            isAccelerated: false
        };
    }

    /**
     * 角度转弧度
     */
    private degreesToRadians(degrees: number): number {
        return degrees * (Math.PI / 180);
    }
}