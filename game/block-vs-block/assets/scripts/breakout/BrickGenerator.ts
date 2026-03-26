import { BrickType } from './BreakoutTypes';
import { BreakoutBoard } from './BreakoutBoard';
import { BreakoutConfig } from './BreakoutConfig';

/**
 * 砖块生成器
 * 从俄罗斯方块落地生成砖块
 */
export class BrickGenerator {
    private board: BreakoutBoard;

    constructor(board: BreakoutBoard) {
        this.board = board;
    }

    /**
     * 从方块格子数据生成砖块
     * @param gridData 10x24的网格数据，每个格子包含方块类型或null
     */
    public generateFromTetrisGrid(gridData: (string | null)[][]): void {
        this.board.clearBricks();

        for (let y = 0; y < gridData.length; y++) {
            for (let x = 0; x < gridData[y].length; x++) {
                if (gridData[y][x] !== null) {
                    // 方块存在，生成砖块
                    const brickType = this.determineBrickType();
                    this.board.addBrick(x, y, brickType);
                }
            }
        }
    }

    /**
     * 添加单个砖块（方块落地时）
     */
    public addBrickFromBlock(gridX: number, gridY: number): void {
        const brickType = this.determineBrickType();
        this.board.addBrick(gridX, gridY, brickType);
    }

    /**
     * 确定砖块类型
     */
    private determineBrickType(): BrickType {
        const rand = Math.random();

        // 检查各特殊砖块概率
        if (rand < BreakoutConfig.SPECIAL_BRICK_CHANCE.BOMB) {
            return BrickType.BOMB;
        }
        if (rand < BreakoutConfig.SPECIAL_BRICK_CHANCE.BOMB + BreakoutConfig.SPECIAL_BRICK_CHANCE.GOLD) {
            return BrickType.GOLD;
        }
        if (rand < BreakoutConfig.SPECIAL_BRICK_CHANCE.BOMB + 
                 BreakoutConfig.SPECIAL_BRICK_CHANCE.GOLD + 
                 BreakoutConfig.SPECIAL_BRICK_CHANCE.COPPER) {
            return BrickType.COPPER;
        }

        return BrickType.NORMAL;
    }

    /**
     * 生成钢砖（场地障碍）
     * @param level 当前等级
     */
    public generateSteelBricks(level: number): void {
        const count = level * 2;
        
        for (let i = 0; i < count; i++) {
            const gridX = Math.floor(Math.random() * BreakoutConfig.BOARD_WIDTH);
            const gridY = Math.floor(Math.random() * BreakoutConfig.BRICK_ROWS) + 4; // 从第4行开始
            
            // 不覆盖已有砖块
            if (!this.board.hasBrickAt(gridX, gridY)) {
                this.board.addBrick(gridX, gridY, BrickType.STEEL);
            }
        }
    }

    /**
     * 清空所有砖块
     */
    public clearAllBricks(): void {
        this.board.clearBricks();
    }
}