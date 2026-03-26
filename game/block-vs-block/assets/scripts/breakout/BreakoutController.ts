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