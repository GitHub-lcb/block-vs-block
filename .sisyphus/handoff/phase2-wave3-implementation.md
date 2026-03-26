# Phase 2 Wave 3 - Implementation Code

This file contains the implementation for Tetris module Wave 3 tasks.

---

## Task 9: GhostPiece.ts

**Target File:** `game/block-vs-block/assets/scripts/tetris/GhostPiece.ts`

```typescript
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
```

---

## Task 10: NextPreview.ts

**Target File:** `game/block-vs-block/assets/scripts/tetris/NextPreview.ts`

```typescript
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
```

---

## Task 11: HoldSystem.ts

**Target File:** `game/block-vs-block/assets/scripts/tetris/HoldSystem.ts`

```typescript
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
```

---

## Task 12: LevelManager.ts

**Target File:** `game/block-vs-block/assets/scripts/tetris/LevelManager.ts`

```typescript
import { TetrisConfig } from './TetrisConfig';

/**
 * 等级管理器
 * 时间驱动升级系统
 */
export class LevelManager {
    private currentLevel: number = 1;
    private timeSinceLastLevelUp: number = 0;
    private totalGameTime: number = 0;

    /**
     * 更新等级（每帧调用）
     * @param deltaTime 距离上一帧的时间（毫秒）
     */
    public update(deltaTime: number): void {
        this.totalGameTime += deltaTime;
        this.timeSinceLastLevelUp += deltaTime;

        // 每60秒升级一次
        if (this.timeSinceLastLevelUp >= TetrisConfig.LEVEL_UP_TIME) {
            this.levelUp();
            this.timeSinceLastLevelUp = 0;
        }
    }

    /**
     * 升级
     */
    private levelUp(): void {
        if (this.currentLevel < TetrisConfig.MAX_LEVEL) {
            this.currentLevel++;
            console.log(`[LevelManager] Level up! Now level ${this.currentLevel}`);
        }
    }

    /**
     * 获取当前等级
     */
    public getLevel(): number {
        return this.currentLevel;
    }

    /**
     * 获取当前下落速度（毫秒/格）
     */
    public getFallSpeed(): number {
        return TetrisConfig.getFallSpeed(this.currentLevel);
    }

    /**
     * 获取距离下一等级的时间（毫秒）
     */
    public getTimeToNextLevel(): number {
        return TetrisConfig.LEVEL_UP_TIME - this.timeSinceLastLevelUp;
    }

    /**
     * 获取总游戏时间（毫秒）
     */
    public getTotalGameTime(): number {
        return this.totalGameTime;
    }

    /**
     * 获取总游戏时间（秒）
     */
    public getTotalGameTimeSeconds(): number {
        return Math.floor(this.totalGameTime / 1000);
    }

    /**
     * 获取升级进度（0-1）
     */
    public getLevelUpProgress(): number {
        return this.timeSinceLastLevelUp / TetrisConfig.LEVEL_UP_TIME;
    }

    /**
     * 是否最高等级
     */
    public isMaxLevel(): boolean {
        return this.currentLevel >= TetrisConfig.MAX_LEVEL;
    }

    /**
     * 设置等级（用于测试或特殊场景）
     */
    public setLevel(level: number): void {
        this.currentLevel = Math.min(Math.max(1, level), TetrisConfig.MAX_LEVEL);
    }

    /**
     * 重置等级管理器
     */
    public reset(): void {
        this.currentLevel = 1;
        this.timeSinceLastLevelUp = 0;
        this.totalGameTime = 0;
    }
}
```

---

## Summary

Wave 3 creates 4 files:

1. **GhostPiece.ts** - 落点预览（Ghost位置计算）
2. **NextPreview.ts** - Next预览（3个方块预览）
3. **HoldSystem.ts** - Hold系统（暂存方块，每方块限用1次）
4. **LevelManager.ts** - 等级管理（时间驱动升级，每60秒升级）

All files should be written to: `game/block-vs-block/assets/scripts/tetris/`