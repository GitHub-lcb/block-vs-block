import { ClearInfo, ScoreEvent, GameStats } from './TetrisTypes';
import { TetrisConfig } from './TetrisConfig';

/**
 * 俄罗斯方块计分系统
 */
export class TetrisScoring {
    private stats: GameStats;
    private isBackToBack: boolean = false;
    private lastClearWasDifficult: boolean = false;

    constructor() {
        this.stats = this.createInitialStats();
    }

    /**
     * 创建初始统计
     */
    private createInitialStats(): GameStats {
        return {
            score: 0,
            level: 1,
            linesCleared: 0,
            tetrominosPlaced: 0,
            tSpins: 0,
            perfectClears: 0,
            maxCombo: 0,
            currentCombo: 0
        };
    }

    /**
     * 计算得分
     */
    public calculateScore(clearInfo: ClearInfo, level: number): ScoreEvent {
        let baseScore = 0;
        let bonusScore = 0;
        
        // 计算基础分
        baseScore = this.calculateBaseScore(clearInfo, level);
        
        // Back-to-Back 加成
        if (this.isBackToBack && this.isDifficultClear(clearInfo)) {
            baseScore = Math.floor(baseScore * TetrisConfig.SCORE_TABLE.BACK_TO_BACK);
        }
        
        // 更新 Back-to-Back 状态
        if (this.isDifficultClear(clearInfo)) {
            this.isBackToBack = true;
        } else if (clearInfo.lines > 0) {
            this.isBackToBack = false;
        }
        
        // Perfect Clear 奖励
        if (clearInfo.isPerfectClear && clearInfo.lines > 0) {
            const pcBonus = TetrisConfig.PERFECT_CLEAR_BONUS[clearInfo.lines] || TetrisConfig.SCORE_TABLE.PERFECT_CLEAR;
            bonusScore += pcBonus * level;
        }
        
        // 连击加成
        if (clearInfo.lines > 0) {
            this.stats.currentCombo++;
            bonusScore += this.stats.currentCombo * 50 * level;
            this.stats.maxCombo = Math.max(this.stats.maxCombo, this.stats.currentCombo);
        } else {
            this.stats.currentCombo = 0;
        }
        
        const totalScore = baseScore + bonusScore;
        
        // 更新统计
        this.stats.score += totalScore;
        this.stats.linesCleared += clearInfo.lines;
        
        if (clearInfo.isTSpin) {
            this.stats.tSpins++;
        }
        
        if (clearInfo.isPerfectClear) {
            this.stats.perfectClears++;
        }
        
        return {
            baseScore,
            bonusScore,
            totalScore,
            clearInfo,
            isBackToBack: this.isBackToBack && this.isDifficultClear(clearInfo)
        };
    }

    /**
     * 计算基础分
     */
    private calculateBaseScore(clearInfo: ClearInfo, level: number): number {
        if (clearInfo.lines === 0) {
            return 0;
        }
        
        // T-Spin 加成
        if (clearInfo.isTSpin) {
            switch (clearInfo.lines) {
                case 1:
                    return clearInfo.isTSpinMini 
                        ? TetrisConfig.SCORE_TABLE.TSPIN_MINI * level
                        : TetrisConfig.SCORE_TABLE.TSPIN_SINGLE * level;
                case 2:
                    return TetrisConfig.SCORE_TABLE.TSPIN_DOUBLE * level;
                case 3:
                    return TetrisConfig.SCORE_TABLE.TSPIN_TRIPLE * level;
                default:
                    return TetrisConfig.SCORE_TABLE.TSPIN * level;
            }
        }
        
        // 普通消除
        switch (clearInfo.lines) {
            case 1:
                return TetrisConfig.SCORE_TABLE.SINGLE * level;
            case 2:
                return TetrisConfig.SCORE_TABLE.DOUBLE * level;
            case 3:
                return TetrisConfig.SCORE_TABLE.TRIPLE * level;
            case 4:
                return TetrisConfig.SCORE_TABLE.TETRIS * level;
            default:
                return 0;
        }
    }

    /**
     * 判断是否为高难度消除（触发 Back-to-Back）
     */
    private isDifficultClear(clearInfo: ClearInfo): boolean {
        // Tetris 或 T-Spin 消除
        return clearInfo.lines === 4 || (clearInfo.isTSpin && clearInfo.lines > 0);
    }

    /**
     * 方块放置计分
     */
    public addPlacement(): void {
        this.stats.tetrominosPlaced++;
    }

    /**
     * 硬降额外得分
     */
    public addHardDropScore(distance: number): void {
        this.stats.score += distance * 2;
    }

    /**
     * 软降额外得分
     */
    public addSoftDropScore(): void {
        this.stats.score += 1;
    }

    /**
     * 更新等级
     */
    public updateLevel(level: number): void {
        this.stats.level = Math.min(level, TetrisConfig.MAX_LEVEL);
    }

    /**
     * 获取当前统计
     */
    public getStats(): GameStats {
        return { ...this.stats };
    }

    /**
     * 获取当前分数
     */
    public getScore(): number {
        return this.stats.score;
    }

    /**
     * 获取当前等级
     */
    public getLevel(): number {
        return this.stats.level;
    }

    /**
     * 重置计分系统
     */
    public reset(): void {
        this.stats = this.createInitialStats();
        this.isBackToBack = false;
    }
}