import { BlockType, RotationState, Position } from './TetrisTypes';
import { TetrisBoard } from './TetrisBoard';
import { TetrisBlock } from './TetrisBlock';

/**
 * Ghost Piece 落点预览系统
 */
export class GhostPiece {
    private board: TetrisBoard;

    constructor(board: TetrisBoard) {
        this.board = board;
    }

    /**
     * 计算Ghost位置
     */
    public getGhostPosition(type: BlockType, rotation: RotationState, position: Position): Position {
        return this.board.getDropPosition(type, rotation, position);
    }

    /**
     * 获取Ghost占用的格子
     */
    public getGhostCells(type: BlockType, rotation: RotationState, position: Position): Position[] {
        const ghostPos = this.getGhostPosition(type, rotation, position);
        return TetrisBlock.getOccupiedCells(type, rotation, ghostPos);
    }

    /**
     * 计算下落距离
     */
    public getDropDistance(type: BlockType, rotation: RotationState, position: Position): number {
        const ghostPos = this.getGhostPosition(type, rotation, position);
        return position.y - ghostPos.y;
    }

    /**
     * 是否显示Ghost（当前位置与落点不同）
     */
    public shouldShowGhost(type: BlockType, rotation: RotationState, position: Position): boolean {
        return this.getDropDistance(type, rotation, position) > 0;
    }
}