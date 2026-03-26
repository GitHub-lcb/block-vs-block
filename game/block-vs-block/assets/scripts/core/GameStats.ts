/**
 * 游戏统计数据
 */
export interface PlayerStats {
    // 总分
    totalScore: number;
    
    // 俄罗斯方块统计
    tetrisScore: number;
    linesCleared: number;
    tetrominosPlaced: number;
    tSpins: number;
    perfectClears: number;
    maxCombo: number;
    
    // 弹球统计
    breakoutScore: number;
    bricksDestroyed: number;
    maxBreakoutCombo: number;
    ballsLost: number;
    
    // 道具统计
    itemsAcquired: number;
    itemsUsed: number;
}

/**
 * 游戏统计管理器
 */
export class GameStatsManager {
    private static _instance: GameStatsManager | null = null;

    private p1Stats: PlayerStats;
    private p2Stats: PlayerStats;
    private gameStartTime: number = 0;
    private roundStartTime: number = 0;

    public static get instance(): GameStatsManager {
        if (!GameStatsManager._instance) {
            GameStatsManager._instance = new GameStatsManager();
        }
        return GameStatsManager._instance;
    }

    private constructor() {
        this.p1Stats = this.createEmptyStats();
        this.p2Stats = this.createEmptyStats();
    }

    private createEmptyStats(): PlayerStats {
        return {
            totalScore: 0,
            tetrisScore: 0,
            linesCleared: 0,
            tetrominosPlaced: 0,
            tSpins: 0,
            perfectClears: 0,
            maxCombo: 0,
            breakoutScore: 0,
            bricksDestroyed: 0,
            maxBreakoutCombo: 0,
            ballsLost: 0,
            itemsAcquired: 0,
            itemsUsed: 0
        };
    }

    /**
     * 开始新游戏
     */
    public startGame(): void {
        this.p1Stats = this.createEmptyStats();
        this.p2Stats = this.createEmptyStats();
        this.gameStartTime = Date.now();
        this.roundStartTime = Date.now();
    }

    /**
     * 开始新回合
     */
    public startRound(): void {
        this.roundStartTime = Date.now();
    }

    /**
     * 添加分数
     */
    public addScore(playerId: 1 | 2, score: number, source: 'tetris' | 'breakout'): void {
        const stats = playerId === 1 ? this.p1Stats : this.p2Stats;
        stats.totalScore += score;
        
        if (source === 'tetris') {
            stats.tetrisScore += score;
        } else {
            stats.breakoutScore += score;
        }
    }

    /**
     * 记录行消除
     */
    public recordLinesCleared(playerId: 1 | 2, lines: number): void {
        const stats = playerId === 1 ? this.p1Stats : this.p2Stats;
        stats.linesCleared += lines;
    }

    /**
     * 记录方块放置
     */
    public recordTetrominoPlaced(playerId: 1 | 2): void {
        const stats = playerId === 1 ? this.p1Stats : this.p2Stats;
        stats.tetrominosPlaced++;
    }

    /**
     * 记录T-Spin
     */
    public recordTSpin(playerId: 1 | 2): void {
        const stats = playerId === 1 ? this.p1Stats : this.p2Stats;
        stats.tSpins++;
    }

    /**
     * 记录完美消除
     */
    public recordPerfectClear(playerId: 1 | 2): void {
        const stats = playerId === 1 ? this.p1Stats : this.p2Stats;
        stats.perfectClears++;
    }

    /**
     * 记录连击
     */
    public recordCombo(playerId: 1 | 2, combo: number, type: 'tetris' | 'breakout'): void {
        const stats = playerId === 1 ? this.p1Stats : this.p2Stats;
        
        if (type === 'tetris') {
            stats.maxCombo = Math.max(stats.maxCombo, combo);
        } else {
            stats.maxBreakoutCombo = Math.max(stats.maxBreakoutCombo, combo);
        }
    }

    /**
     * 记录砖块击碎
     */
    public recordBrickDestroyed(playerId: 1 | 2, count: number = 1): void {
        const stats = playerId === 1 ? this.p1Stats : this.p2Stats;
        stats.bricksDestroyed += count;
    }

    /**
     * 记录球丢失
     */
    public recordBallLost(playerId: 1 | 2): void {
        const stats = playerId === 1 ? this.p1Stats : this.p2Stats;
        stats.ballsLost++;
    }

    /**
     * 记录道具获得
     */
    public recordItemAcquired(playerId: 1 | 2): void {
        const stats = playerId === 1 ? this.p1Stats : this.p2Stats;
        stats.itemsAcquired++;
    }

    /**
     * 记录道具使用
     */
    public recordItemUsed(playerId: 1 | 2): void {
        const stats = playerId === 1 ? this.p1Stats : this.p2Stats;
        stats.itemsUsed++;
    }

    /**
     * 获取玩家统计
     */
    public getStats(playerId: 1 | 2): PlayerStats {
        return playerId === 1 ? { ...this.p1Stats } : { ...this.p2Stats };
    }

    /**
     * 获取游戏时长（毫秒）
     */
    public getGameDuration(): number {
        return Date.now() - this.gameStartTime;
    }

    /**
     * 获取回合时长（毫秒）
     */
    public getRoundDuration(): number {
        return Date.now() - this.roundStartTime;
    }

    /**
     * 生成游戏报告
     */
    public generateReport(): {
        p1Stats: PlayerStats;
        p2Stats: PlayerStats;
        winner: number | null;
        gameDuration: number;
    } {
        return {
            p1Stats: { ...this.p1Stats },
            p2Stats: { ...this.p2Stats },
            winner: this.p1Stats.totalScore > this.p2Stats.totalScore ? 1
                : (this.p2Stats.totalScore > this.p1Stats.totalScore ? 2 : null),
            gameDuration: this.getGameDuration()
        };
    }

    /**
     * 重置
     */
    public reset(): void {
        this.p1Stats = this.createEmptyStats();
        this.p2Stats = this.createEmptyStats();
        this.gameStartTime = 0;
        this.roundStartTime = 0;
    }
}