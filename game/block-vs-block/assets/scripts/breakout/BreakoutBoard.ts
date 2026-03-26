import { BrickType, BrickState, BallState, PaddleState, Position } from './BreakoutTypes';
import { BreakoutConfig } from './BreakoutConfig';
import { Brick } from './Brick';
import { Paddle } from './Paddle';
import { Ball } from './Ball';

/**
 * 弹球场地系统
 */
export class BreakoutBoard {
    private bricks: Map<string, Brick> = new Map(); // key: "x,y"
    private paddle: Paddle;
    private balls: Ball[] = [];

    constructor() {
        this.paddle = new Paddle();
    }

    /**
     * 添加砖块
     */
    public addBrick(gridX: number, gridY: number, type: BrickType = BrickType.NORMAL): Brick {
        const key = `${gridX},${gridY}`;
        const brick = new Brick(gridX, gridY, type);
        this.bricks.set(key, brick);
        return brick;
    }

    /**
     * 移除砖块
     */
    public removeBrick(gridX: number, gridY: number): boolean {
        const key = `${gridX},${gridY}`;
        return this.bricks.delete(key);
    }

    /**
     * 获取砖块
     */
    public getBrick(gridX: number, gridY: number): Brick | undefined {
        const key = `${gridX},${gridY}`;
        return this.bricks.get(key);
    }

    /**
     * 获取所有砖块
     */
    public getAllBricks(): Brick[] {
        return Array.from(this.bricks.values()).filter(b => !b.isDestroyed());
    }

    /**
     * 获取砖块数量
     */
    public getBrickCount(): number {
        return this.getAllBricks().length;
    }

    /**
     * 清空所有砖块
     */
    public clearBricks(): void {
        this.bricks.clear();
    }

    /**
     * 获取挡板
     */
    public getPaddle(): Paddle {
        return this.paddle;
    }

    /**
     * 添加球
     */
    public addBall(): Ball {
        const ball = new Ball();
        ball.setPaddle(this.paddle);
        this.balls.push(ball);
        return ball;
    }

    /**
     * 移除球
     */
    public removeBall(ball: Ball): void {
        const index = this.balls.indexOf(ball);
        if (index !== -1) {
            this.balls.splice(index, 1);
        }
    }

    /**
     * 获取所有球
     */
    public getBalls(): Ball[] {
        return [...this.balls];
    }

    /**
     * 获取活动中的球
     */
    public getActiveBalls(): Ball[] {
        return this.balls.filter(b => b.getState().isLaunched);
    }

    /**
     * 更新场地
     */
    public update(deltaTime: number): void {
        // 更新挡板
        this.paddle.update(deltaTime);

        // 更新所有球
        for (const ball of this.balls) {
            ball.update(deltaTime);
        }
    }

    /**
     * 重置场地
     */
    public reset(): void {
        this.bricks.clear();
        this.balls = [];
        this.paddle.reset();
    }

    /**
     * 获取指定位置的砖块（场景坐标）
     */
    public getBrickAtPosition(x: number, y: number): Brick | null {
        // 转换为网格坐标
        const gridX = Math.floor(x / BreakoutConfig.BRICK_WIDTH);
        const gridY = Math.floor(y / BreakoutConfig.BRICK_HEIGHT);
        
        return this.getBrick(gridX, gridY) || null;
    }

    /**
     * 检查位置是否有砖块
     */
    public hasBrickAt(gridX: number, gridY: number): boolean {
        const brick = this.getBrick(gridX, gridY);
        return brick !== undefined && !brick.isDestroyed();
    }

    /**
     * 获取炸弹砖块爆炸范围内的其他砖块
     */
    public getBricksInExplosionRadius(centerX: number, centerY: number, radius: number): Brick[] {
        const affectedBricks: Brick[] = [];
        
        for (const brick of this.getAllBricks()) {
            const pos = brick.getWorldPosition();
            const dx = pos.x - centerX;
            const dy = pos.y - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance <= radius) {
                affectedBricks.push(brick);
            }
        }
        
        return affectedBricks;
    }

    /**
     * 获取场地宽度
     */
    public getWidth(): number {
        return BreakoutConfig.BOARD_WIDTH;
    }

    /**
     * 获取场地高度
     */
    public getHeight(): number {
        return BreakoutConfig.BOARD_HEIGHT;
    }
}