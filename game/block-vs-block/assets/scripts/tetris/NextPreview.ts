import { BlockType, RotationState } from './TetrisTypes';
import { TetrisSpawner } from './TetrisSpawner';
import { TetrisBlock } from './TetrisBlock';
import { TetrisConfig } from './TetrisConfig';

/**
 * Next 预览系统
 */
export class NextPreview {
    private spawner: TetrisSpawner;
    private previewCount: number;

    constructor(spawner: TetrisSpawner, previewCount: number = TetrisConfig.NEXT_COUNT) {
        this.spawner = spawner;
        this.previewCount = previewCount;
    }

    /**
     * 获取预览队列
     */
    public getPreviewQueue(): BlockType[] {
        return this.spawner.getNextQueue().slice(0, this.previewCount);
    }

    /**
     * 获取指定位置的预览方块
     */
    public getPreview(index: number): BlockType | null {
        const queue = this.getPreviewQueue();
        if (index >= 0 && index < queue.length) {
            return queue[index];
        }
        return null;
    }

    /**
     * 获取预览方块的形状（用于渲染）
     */
    public getPreviewShape(index: number): number[][] | null {
        const type = this.getPreview(index);
        if (type) {
            return TetrisBlock.getShape(type, RotationState.R0);
        }
        return null;
    }

    /**
     * 获取预览方块的颜色
     */
    public getPreviewColor(index: number): { primary: string; glow: string } | null {
        const type = this.getPreview(index);
        if (type) {
            return TetrisBlock.getColor(type);
        }
        return null;
    }

    /**
     * 更新预览（当新方块生成时自动更新）
     */
    public update(): void {
        // Spawner 内部已维护队列，无需手动更新
    }

    /**
     * 重置预览
     */
    public reset(): void {
        this.spawner.reset();
    }
}