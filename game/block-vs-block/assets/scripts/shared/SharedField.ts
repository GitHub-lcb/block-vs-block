import { _decorator } from 'cc';
import { TetrisBoard } from '../tetris/TetrisBoard';
import { BreakoutBoard } from '../breakout/BreakoutBoard';
import { BrickType } from '../breakout/BreakoutTypes';
import { BlockType } from '../tetris/TetrisTypes';
import { EventBus, GameEventType } from '../core/EventBus';
import { TetrisConfig } from '../tetris/TetrisConfig';

const { ccclass } = _decorator;

/**
 * 共享场地管理器
 * 管理俄罗斯方块和弹球的共享场地
 */
@ccclass('SharedField')
export class SharedField {
    private tetrisBoard: TetrisBoard;
    private breakoutBoard: BreakoutBoard;

    constructor() {
        this.tetrisBoard = new TetrisBoard();
        this.breakoutBoard = new BreakoutBoard();
    }

    /**
     * 获取俄罗斯方块场地
     */
    public getTetrisBoard(): TetrisBoard {
        return this.tetrisBoard;
    }

    /**
     * 获取弹球场地
     */
    public getBreakoutBoard(): BreakoutBoard {
        return this.breakoutBoard;
    }

    /**
     * 方块落地后转换为砖块
     */
    public convertTetrisToBricks(): void {
        const grid = this.tetrisBoard.getGrid();
        
        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[y].length; x++) {
                const cell = grid[y][x];
                if (cell.type !== null) {
                    // 在弹球场地中添加砖块
                    // 注意：坐标转换（俄罗斯方块y轴向上，弹球y轴向下）
                    const brickY = TetrisConfig.BOARD_HEIGHT - y;
                    this.breakoutBoard.addBrick(x, brickY, BrickType.NORMAL);
                }
            }
        }

        EventBus.instance.emit(GameEventType.TETRIS_PIECE_LAND, {
            bricksConverted: this.countBricks()
        });
    }

    /**
     * 行消除后通知弹球场地
     */
    public onLinesCleared(linesCleared: number[]): void {
        EventBus.instance.emit(GameEventType.TETRIS_LINE_CLEAR, {
            lines: linesCleared.length
        });
    }

    /**
     * 重置场地（互换时）
     */
    public reset(): void {
        // 清空俄罗斯方块场地
        this.tetrisBoard.reset();
        
        // 清空弹球砖块（保留钢砖可选）
        this.breakoutBoard.clearBricks();
        
        // 重置球
        const balls = this.breakoutBoard.getBalls();
        for (const ball of balls) {
            ball.reset();
        }

        EventBus.instance.emit(GameEventType.ROUND_START, {});
    }

    /**
     * 统计砖块数量
     */
    private countBricks(): number {
        return this.breakoutBoard.getBrickCount();
    }

    /**
     * 更新场地
     */
    public update(deltaTime: number): void {
        this.breakoutBoard.update(deltaTime);
    }
}