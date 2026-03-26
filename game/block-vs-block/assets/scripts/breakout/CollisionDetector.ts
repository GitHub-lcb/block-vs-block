import { CollisionResult, Position } from './BreakoutTypes';
import { BreakoutConfig } from './BreakoutConfig';
import { Ball } from './Ball';
import { Paddle } from './Paddle';
import { Brick } from './Brick';
import { BreakoutBoard } from './BreakoutBoard';

/**
 * 碰撞检测器
 */
export class CollisionDetector {
    /**
     * 检测球与砖块的碰撞
     */
    public static checkBallBrickCollision(ball: Ball, brick: Brick): CollisionResult {
        const ballPos = ball.getPosition();
        const ballRadius = ball.getRadius();
        const bounds = brick.getBounds();

        // 找到砖块上离球最近的点
        const closestX = Math.max(bounds.left, Math.min(ballPos.x, bounds.right));
        const closestY = Math.max(bounds.bottom, Math.min(ballPos.y, bounds.top));

        // 计算距离
        const dx = ballPos.x - closestX;
        const dy = ballPos.y - closestY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < ballRadius) {
            // 碰撞发生，计算法线
            let normalX = dx / distance || 0;
            let normalY = dy / distance || 0;

            // 如果球在砖块内部，反转法线
            if (distance === 0) {
                normalY = -1;
            }

            return {
                hit: true,
                normalX,
                normalY,
                brickHit: brick.getState(),
                isPaddleHit: false,
                isWallHit: false,
                isBottomHit: false
            };
        }

        return {
            hit: false,
            normalX: 0,
            normalY: 0,
            isPaddleHit: false,
            isWallHit: false,
            isBottomHit: false
        };
    }

    /**
     * 检测球与挡板的碰撞
     */
    public static checkBallPaddleCollision(ball: Ball, paddle: Paddle): CollisionResult {
        const ballPos = ball.getPosition();
        const ballRadius = ball.getRadius();
        const bounds = paddle.getBounds();

        // 找到挡板上离球最近的点
        const closestX = Math.max(bounds.left, Math.min(ballPos.x, bounds.right));
        const closestY = Math.max(bounds.bottom, Math.min(ballPos.y, bounds.top));

        // 计算距离
        const dx = ballPos.x - closestX;
        const dy = ballPos.y - closestY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // 球必须从上方接近
        const ballState = ball.getState();
        if (ballState.vy < 0 && distance < ballRadius) {
            return {
                hit: true,
                normalX: 0,
                normalY: 1,
                isPaddleHit: true,
                isWallHit: false,
                isBottomHit: false
            };
        }

        return {
            hit: false,
            normalX: 0,
            normalY: 0,
            isPaddleHit: false,
            isWallHit: false,
            isBottomHit: false
        };
    }

    /**
     * 检测球与场地中所有砖块的碰撞
     */
    public static checkBallBricksCollision(ball: Ball, bricks: Brick[]): CollisionResult | null {
        let closestCollision: CollisionResult | null = null;
        let closestDistance = Infinity;

        for (const brick of bricks) {
            if (brick.isDestroyed()) continue;

            const result = this.checkBallBrickCollision(ball, brick);
            if (result.hit) {
                const ballPos = ball.getPosition();
                const brickPos = brick.getWorldPosition();
                const dx = ballPos.x - brickPos.x;
                const dy = ballPos.y - brickPos.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestCollision = result;
                }
            }
        }

        return closestCollision;
    }

    /**
     * 检测球是否丢失
     */
    public static checkBallLost(ball: Ball): boolean {
        return ball.isOutOfBounds();
    }

    /**
     * 处理碰撞响应
     */
    public static resolveCollision(ball: Ball, collision: CollisionResult): void {
        if (!collision.hit) return;

        // 根据法线方向反弹
        if (Math.abs(collision.normalX) > Math.abs(collision.normalY)) {
            ball.bounceHorizontal();
        } else {
            ball.bounceVertical();
        }
    }
}