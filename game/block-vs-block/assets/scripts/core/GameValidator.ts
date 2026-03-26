import { BlockType, RotationState, Position } from '../tetris/TetrisTypes';
import { BrickType } from '../breakout/BreakoutTypes';

/**
 * 游戏验证器
 * 验证游戏状态和数据有效性
 */
export class GameValidator {
    /**
     * 验证方块类型
     */
    public static isValidBlockType(type: string): boolean {
        const validTypes = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
        return validTypes.includes(type);
    }

    /**
     * 验证砖块类型
     */
    public static isValidBrickType(type: string): boolean {
        const validTypes = ['NORMAL', 'COPPER', 'GOLD', 'STEEL', 'BOMB'];
        return validTypes.includes(type);
    }

    /**
     * 验证场地坐标
     */
    public static isValidFieldPosition(x: number, y: number): boolean {
        return x >= 0 && x < 10 && y >= 0 && y < 24;
    }

    /**
     * 验证旋转状态
     */
    public static isValidRotation(rotation: number): boolean {
        return rotation >= 0 && rotation <= 3;
    }

    /**
     * 验证分数
     */
    public static isValidScore(score: number): boolean {
        return Number.isInteger(score) && score >= 0;
    }

    /**
     * 验证回合数
     */
    public static isValidRound(round: number): boolean {
        return Number.isInteger(round) && round >= 1 && round <= 6;
    }

    /**
     * 验证玩家ID
     */
    public static isValidPlayerId(playerId: number): boolean {
        return playerId === 1 || playerId === 2;
    }

    /**
     * 验证时间值
     */
    public static isValidTime(time: number): boolean {
        return Number.isInteger(time) && time >= 0;
    }

    /**
     * 验证连击数
     */
    public static isValidCombo(combo: number): boolean {
        return Number.isInteger(combo) && combo >= 0;
    }

    /**
     * 验证等级
     */
    public static isValidLevel(level: number): boolean {
        return Number.isInteger(level) && level >= 1 && level <= 15;
    }

    /**
     * 验证游戏结束条件
     */
    public static checkGameOver(
        p1Score: number,
        p2Score: number,
        elapsedTime: number,
        fieldOverflow: boolean
    ): { isOver: boolean; winner: number | null; reason: string | null } {
        // 时间结束
        if (elapsedTime >= 180000) {
            return {
                isOver: true,
                winner: p1Score > p2Score ? 1 : (p2Score > p1Score ? 2 : null),
                reason: '时间结束'
            };
        }

        // 场地溢出（由外部检测）
        if (fieldOverflow) {
            return {
                isOver: true,
                winner: null, // 需要知道是哪个玩家溢出
                reason: '场地溢出'
            };
        }

        return { isOver: false, winner: null, reason: null };
    }
}