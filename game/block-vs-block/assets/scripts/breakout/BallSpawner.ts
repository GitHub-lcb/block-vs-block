import { BreakoutConfig } from './BreakoutConfig';
import { BreakoutBoard } from './BreakoutBoard';
import { Ball } from './Ball';

/**
 * 球生成器
 */
export class BallSpawner {
    private board: BreakoutBoard;
    private ballsLost: number = 0;
    private spawnTimer: number = 0;
    private isSpawning: boolean = false;

    constructor(board: BreakoutBoard) {
        this.board = board;
    }

    /**
     * 请求生成新球
     */
    public requestSpawn(): void {
        if (this.isSpawning) return;
        
        this.isSpawning = true;
        this.spawnTimer = 0;
    }

    /**
     * 更新生成器
     */
    public update(deltaTime: number): void {
        if (!this.isSpawning) return;

        this.spawnTimer += deltaTime * 1000; // 转换为毫秒

        if (this.spawnTimer >= BreakoutConfig.BALL_RESPAWN_DELAY) {
            this.spawn();
            this.isSpawning = false;
        }
    }

    /**
     * 生成球
     */
    private spawn(): Ball {
        return this.board.addBall();
    }

    /**
     * 记录球丢失
     */
    public recordBallLost(): void {
        this.ballsLost++;
    }

    /**
     * 获取丢失球数
     */
    public getBallsLost(): number {
        return this.ballsLost;
    }

    /**
     * 是否超过最大丢失数
     */
    public isOverLimit(): boolean {
        return this.ballsLost > BreakoutConfig.MAX_BALLS_LOST;
    }

    /**
     * 获取扣分
     */
    public getPenalty(): number {
        if (this.ballsLost <= BreakoutConfig.MAX_BALLS_LOST) {
            return 0;
        }
        return BreakoutConfig.BALL_LOST_PENALTY;
    }

    /**
     * 是否正在生成
     */
    public isSpawningBall(): boolean {
        return this.isSpawning;
    }

    /**
     * 获取剩余生成时间
     */
    public getRemainingSpawnTime(): number {
        if (!this.isSpawning) return 0;
        return Math.max(0, BreakoutConfig.BALL_RESPAWN_DELAY - this.spawnTimer);
    }

    /**
     * 重置生成器
     */
    public reset(): void {
        this.ballsLost = 0;
        this.spawnTimer = 0;
        this.isSpawning = false;
    }
}