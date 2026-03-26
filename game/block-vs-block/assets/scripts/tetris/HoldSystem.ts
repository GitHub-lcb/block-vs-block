import { BlockType, RotationState } from './TetrisTypes';
import { TetrisBlock } from './TetrisBlock';

/**
 * Hold 暂存系统
 */
export class HoldSystem {
    private heldPiece: BlockType | null = null;
    private canHold: boolean = true;

    /**
     * 暂存当前方块
     * @param currentType 当前方块类型
     * @returns 返回之前暂存的方块（如果有），或null
     */
    public hold(currentType: BlockType): BlockType | null {
        if (!this.canHold) {
            return null;
        }

        const previousHeld = this.heldPiece;
        this.heldPiece = currentType;
        this.canHold = false; // 每个方块只能Hold一次

        return previousHeld;
    }

    /**
     * 获取当前暂存的方块
     */
    public getHeldPiece(): BlockType | null {
        return this.heldPiece;
    }

    /**
     * 获取暂存方块的形状
     */
    public getHeldShape(): number[][] | null {
        if (this.heldPiece) {
            return TetrisBlock.getShape(this.heldPiece, RotationState.R0);
        }
        return null;
    }

    /**
     * 获取暂存方块的颜色
     */
    public getHeldColor(): { primary: string; glow: string } | null {
        if (this.heldPiece) {
            return TetrisBlock.getColor(this.heldPiece);
        }
        return null;
    }

    /**
     * 是否可以Hold
     */
    public isHoldAvailable(): boolean {
        return this.canHold;
    }

    /**
     * 重置Hold系统（新方块生成时调用）
     */
    public resetForNewPiece(): void {
        this.canHold = true;
    }

    /**
     * 完全重置
     */
    public reset(): void {
        this.heldPiece = null;
        this.canHold = true;
    }

    /**
     * 是否有暂存的方块
     */
    public hasHeldPiece(): boolean {
        return this.heldPiece !== null;
    }
}