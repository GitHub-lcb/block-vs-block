import { _decorator } from 'cc';
import { BlockType, RotationState, Position, ClearInfo } from './TetrisTypes';
import { TetrisBlock } from './TetrisBlock';
import { TetrisConfig } from './TetrisConfig';

const { ccclass } = _decorator;

/**
 * 场地格子状态
 */
export interface CellData {
    type: BlockType | null;
    color: string | null;
}

/**
 * 俄罗斯方块场地系统
 */
@ccclass('TetrisBoard')
export class TetrisBoard {
    private grid: CellData[][];
    private width: number;
    private height: number;

    constructor(width: number = TetrisConfig.BOARD_WIDTH, height: number = TetrisConfig.TOTAL_HEIGHT) {
        this.width = width;
        this.height = height;
        this.grid = this.createEmptyGrid();
    }

    /**
     * 创建空场地
     */
    private createEmptyGrid(): CellData[][] {
        const grid: CellData[][] = [];
        for (let y = 0; y < this.height; y++) {
            grid[y] = [];
            for (let x = 0; x < this.width; x++) {
                grid[y][x] = { type: null, color: null };
            }
        }
        return grid;
    }

    /**
     * 重置场地
     */
    public reset(): void {
        this.grid = this.createEmptyGrid();
    }

    /**
     * 获取格子状态
     */
    public getCell(x: number, y: number): CellData {
        if (this.isInBounds(x, y)) {
            return this.grid[y][x];
        }
        return { type: BlockType.I, color: '#000000' }; // 边界视为已占用
    }

    /**
     * 设置格子状态
     */
    public setCell(x: number, y: number, type: BlockType, color: string): void {
        if (this.isInBounds(x, y)) {
            this.grid[y][x] = { type, color };
        }
    }

    /**
     * 清除格子
     */
    public clearCell(x: number, y: number): void {
        if (this.isInBounds(x, y)) {
            this.grid[y][x] = { type: null, color: null };
        }
    }

    /**
     * 检查位置是否在场地内
     */
    public isInBounds(x: number, y: number): boolean {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }

    /**
     * 检查格子是否为空
     */
    public isEmpty(x: number, y: number): boolean {
        if (!this.isInBounds(x, y)) {
            return false; // 边界外视为非空
        }
        return this.grid[y][x].type === null;
    }

    /**
     * 检查方块是否可以放置在指定位置
     */
    public canPlace(type: BlockType, rotation: RotationState, position: Position): boolean {
        const cells = TetrisBlock.getOccupiedCells(type, rotation, position);
        return cells.every(cell => this.isEmpty(cell.x, cell.y));
    }

    /**
     * 锁定方块到场地
     */
    public lockPiece(type: BlockType, rotation: RotationState, position: Position): void {
        const cells = TetrisBlock.getOccupiedCells(type, rotation, position);
        const color = TetrisBlock.getColor(type);
        
        cells.forEach(cell => {
            this.setCell(cell.x, cell.y, type, color.primary);
        });
    }

    /**
     * 检查行是否已满
     */
    public isLineFull(y: number): boolean {
        return this.grid[y].every(cell => cell.type !== null);
    }

    /**
     * 清除指定行
     */
    public clearLine(y: number): void {
        // 移除该行
        this.grid.splice(y, 1);
        // 在顶部添加新行
        const newRow: CellData[] = [];
        for (let x = 0; x < this.width; x++) {
            newRow.push({ type: null, color: null });
        }
        this.grid.unshift(newRow);
    }

    /**
     * 检查并清除所有满行
     */
    public clearLines(): ClearInfo {
        const linesCleared: number[] = [];
        
        // 从底部向上检查
        for (let y = this.height - 1; y >= 0; y--) {
            if (this.isLineFull(y)) {
                linesCleared.push(y);
                this.clearLine(y);
                y++; // 重新检查当前行（因为行已下移）
            }
        }
        
        // 检查是否 Perfect Clear
        const isPerfectClear = this.grid.every(row => 
            row.every(cell => cell.type === null)
        );
        
        return {
            lines: linesCleared.length,
            isTSpin: false, // 由外部设置
            isTSpinMini: false,
            isPerfectClear,
            linesCleared
        };
    }

    /**
     * 获取方块落点位置（Ghost计算）
     */
    public getDropPosition(type: BlockType, rotation: RotationState, position: Position): Position {
        let dropY = position.y;
        
        while (this.canPlace(type, rotation, { x: position.x, y: dropY - 1 })) {
            dropY--;
        }
        
        return { x: position.x, y: dropY };
    }

    /**
     * 计算硬降距离
     */
    public getHardDropDistance(type: BlockType, rotation: RotationState, position: Position): number {
        const dropPos = this.getDropPosition(type, rotation, position);
        return position.y - dropPos.y;
    }

    /**
     * 检查是否游戏结束（方块堆到顶部）
     */
    public isGameOver(): boolean {
        // 检查缓冲区是否有方块
        for (let y = TetrisConfig.BOARD_HEIGHT; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.grid[y][x].type !== null) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * 获取场地数据（用于渲染）
     */
    public getGrid(): CellData[][] {
        return this.grid;
    }

    /**
     * 获取可见区域数据（20行）
     */
    public getVisibleGrid(): CellData[][] {
        return this.grid.slice(TetrisConfig.BOARD_BUFFER, TetrisConfig.BOARD_BUFFER + TetrisConfig.BOARD_HEIGHT);
    }

    /**
     * 获取高度
     */
    public getHeight(): number {
        return this.height;
    }

    /**
     * 获取宽度
     */
    public getWidth(): number {
        return this.width;
    }
}