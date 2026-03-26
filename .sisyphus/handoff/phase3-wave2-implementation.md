# Phase 3 Wave 2 - Implementation Code

This file contains the implementation for Breakout module Wave 2 tasks.

---

## Task 5: Ball.ts

**Target File:** `game/block-vs-block/assets/scripts/breakout/Ball.ts`

```typescript
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
```

---

## Task 6: BreakoutBoard.ts

**Target File:** `game/block-vs-block/assets/scripts/breakout/BreakoutBoard.ts`

```typescript
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
```

---

## Task 7: CollisionDetector.ts

**Target File:** `game/block-vs-block/assets/scripts/breakout/CollisionDetector.ts`

```typescript
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
```

---

## Task 8: BreakoutController.ts

**Target File:** `game/block-vs-block/assets/scripts/breakout/BreakoutController.ts`

```typescript
import { BreakoutInput, CollisionResult } from './BreakoutTypes';
import { BreakoutBoard } from './BreakoutBoard';
import { Ball } from './Ball';
import { Brick } from './Brick';
import { Paddle } from './Paddle';
import { CollisionDetector } from './CollisionDetector';
import { BreakoutConfig } from './BreakoutConfig';
import { EventBus, GameEventType } from '../core/EventBus';

/**
 * 弹球控制器
 */
export class BreakoutController {
    private board: BreakoutBoard;
    private playerId: number;

    constructor(board: BreakoutBoard, playerId: number = 2) {
        this.board = board;
        this.playerId = playerId;
    }

    /**
     * 更新控制器
     */
    public update(deltaTime: number): void {
        // 更新场地
        this.board.update(deltaTime);

        // 检测所有球的碰撞
        const balls = this.board.getBalls();
        const bricks = this.board.getAllBricks();
        const paddle = this.board.getPaddle();

        for (const ball of balls) {
            const ballState = ball.getState();
            
            if (!ballState.isLaunched) continue;

            // 边界碰撞
            ball.handleBoundaryCollision();

            // 挡板碰撞
            const paddleCollision = CollisionDetector.checkBallPaddleCollision(ball, paddle);
            if (paddleCollision.hit) {
                ball.bounceOffPaddle(paddle);
                EventBus.instance.emit(GameEventType.BREAKOUT_BALL_BOUNCE, {
                    playerId: this.playerId,
                    type: 'paddle'
                });
            }

            // 砖块碰撞
            const brickCollision = CollisionDetector.checkBallBricksCollision(ball, bricks);
            if (brickCollision && brickCollision.hit) {
                this.handleBrickHit(ball, brickCollision.brickHit!);
                CollisionDetector.resolveCollision(ball, brickCollision);
            }

            // 检查球丢失
            if (CollisionDetector.checkBallLost(ball)) {
                this.handleBallLost(ball);
            }
        }
    }

    /**
     * 处理输入
     */
    public handleInput(input: BreakoutInput): boolean {
        const paddle = this.board.getPaddle();

        switch (input) {
            case BreakoutInput.MOVE_LEFT:
            case BreakoutInput.MOVE_RIGHT:
                paddle.handleInput(input);
                return true;

            case BreakoutInput.LAUNCH:
                const balls = this.board.getBalls();
                for (const ball of balls) {
                    if (!ball.getState().isLaunched) {
                        ball.launch();
                        EventBus.instance.emit(GameEventType.BREAKOUT_BALL_LAUNCH, {
                            playerId: this.playerId
                        });
                        return true;
                    }
                }
                return false;

            case BreakoutInput.ACCELERATE:
            case BreakoutInput.STOP_ACCELERATE:
                const activeBalls = this.board.getActiveBalls();
                for (const ball of activeBalls) {
                    ball.handleInput(input);
                }
                return true;

            default:
                return false;
        }
    }

    /**
     * 处理砖块被击中
     */
    private handleBrickHit(ball: Ball, brickState: { type: string; gridX: number; gridY: number }): void {
        const brick = this.board.getBrick(brickState.gridX, brickState.gridY);
        if (!brick) return;

        const destroyed = brick.hit();
        
        EventBus.instance.emit(GameEventType.BREAKOUT_BRICK_HIT, {
            playerId: this.playerId,
            gridX: brickState.gridX,
            gridY: brickState.gridY,
            destroyed
        });

        if (destroyed) {
            // 检查是否是炸弹砖块
            if (brick.isBomb()) {
                this.handleBombExplosion(brick);
            }

            EventBus.instance.emit(GameEventType.BREAKOUT_BRICK_DESTROY, {
                playerId: this.playerId,
                type: brick.getType(),
                score: brick.getScore(),
                gridX: brickState.gridX,
                gridY: brickState.gridY
            });
        }
    }

    /**
     * 处理炸弹爆炸
     */
    private handleBombExplosion(bombBrick: Brick): void {
        const pos = bombBrick.getWorldPosition();
        const radius = bombBrick.getExplosionRadius();
        const affectedBricks = this.board.getBricksInExplosionRadius(pos.x, pos.y, radius);

        for (const brick of affectedBricks) {
            if (brick !== bombBrick && brick.isDestructible()) {
                brick.destroy();
                EventBus.instance.emit(GameEventType.BREAKOUT_BRICK_DESTROY, {
                    playerId: this.playerId,
                    type: brick.getType(),
                    score: brick.getScore(),
                    exploded: true
                });
            }
        }
    }

    /**
     * 处理球丢失
     */
    private handleBallLost(ball: Ball): void {
        this.board.removeBall(ball);
        
        EventBus.instance.emit(GameEventType.BREAKOUT_BALL_LOST, {
            playerId: this.playerId
        });
    }

    /**
     * 生成新球
     */
    public spawnBall(): Ball {
        return this.board.addBall();
    }

    /**
     * 是否有活动的球
     */
    public hasActiveBall(): boolean {
        return this.board.getActiveBalls().length > 0;
    }

    /**
     * 获取场地
     */
    public getBoard(): BreakoutBoard {
        return this.board;
    }
}
```

---

## Summary

Wave 2 creates 4 files:

1. **Ball.ts** - 球类（运动、发射、反弹、边界碰撞）
2. **BreakoutBoard.ts** - 场地系统（砖块管理、球管理、挡板）
3. **CollisionDetector.ts** - 碰撞检测（球-砖块、球-挡板、边界）
4. **BreakoutController.ts** - 控制器（输入处理、碰撞响应、事件触发）

All files should be written to: `game/block-vs-block/assets/scripts/breakout/`