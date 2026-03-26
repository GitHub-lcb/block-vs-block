# Phase 2 Wave 2 - Implementation Code

This file contains the implementation for Tetris module Wave 2 tasks.

---

## Task 5: TetrisBoard.ts

**Target File:** `game/block-vs-block/assets/scripts/tetris/TetrisBoard.ts`

```typescript
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
```

---

## Task 6: TetrisController.ts

**Target File:** `game/block-vs-block/assets/scripts/tetris/TetrisController.ts`

```typescript
import { _decorator } from 'cc';
import { BlockType, RotationState, Position, InputType, MoveDirection, RotateDirection } from './TetrisTypes';
import { TetrisBlock } from './TetrisBlock';
import { TetrisBoard } from './TetrisBoard';
import { TetrisConfig } from './TetrisConfig';

const { ccclass } = _decorator;

/**
 * 控制器状态
 */
interface ControllerState {
    type: BlockType;
    rotation: RotationState;
    position: Position;
    isLastMoveRotation: boolean;
    lastSuccessfulRotation: RotationState | null;
}

/**
 * 俄罗斯方块控制器
 * 处理玩家输入和方块移动
 */
@ccclass('TetrisController')
export class TetrisController {
    private board: TetrisBoard;
    private state: ControllerState | null = null;
    
    // DAS 状态
    private dasDirection: MoveDirection | null = null;
    private dasTimer: number = 0;
    private dasActive: boolean = false;

    constructor(board: TetrisBoard) {
        this.board = board;
    }

    /**
     * 生成新方块
     */
    public spawn(type: BlockType): boolean {
        const position: Position = {
            x: TetrisConfig.SPAWN_X,
            y: TetrisConfig.SPAWN_Y
        };
        
        // 检查生成位置是否有效
        if (!this.board.canPlace(type, RotationState.R0, position)) {
            return false;
        }
        
        this.state = {
            type,
            rotation: RotationState.R0,
            position,
            isLastMoveRotation: false,
            lastSuccessfulRotation: null
        };
        
        return true;
    }

    /**
     * 获取当前方块状态
     */
    public getState(): ControllerState | null {
        return this.state;
    }

    /**
     * 处理输入
     */
    public handleInput(input: InputType): boolean {
        if (!this.state) return false;
        
        switch (input) {
            case InputType.MOVE_LEFT:
                return this.move(MoveDirection.LEFT);
            case InputType.MOVE_RIGHT:
                return this.move(MoveDirection.RIGHT);
            case InputType.MOVE_DOWN:
                return this.softDrop();
            case InputType.ROTATE_CW:
                return this.rotate(RotateDirection.CLOCKWISE);
            case InputType.ROTATE_CCW:
                return this.rotate(RotateDirection.COUNTER_CLOCKWISE);
            case InputType.HARD_DROP:
                return this.hardDrop();
            default:
                return false;
        }
    }

    /**
     * 移动方块
     */
    public move(direction: MoveDirection): boolean {
        if (!this.state) return false;
        
        let newX = this.state.position.x;
        let newY = this.state.position.y;
        
        switch (direction) {
            case MoveDirection.LEFT:
                newX--;
                break;
            case MoveDirection.RIGHT:
                newX++;
                break;
            case MoveDirection.DOWN:
                newY--;
                break;
        }
        
        const newPosition = { x: newX, y: newY };
        
        if (this.board.canPlace(this.state.type, this.state.rotation, newPosition)) {
            this.state.position = newPosition;
            this.state.isLastMoveRotation = false;
            return true;
        }
        
        return false;
    }

    /**
     * 旋转方块
     */
    public rotate(direction: RotateDirection): boolean {
        if (!this.state) return false;
        
        const isClockwise = direction === RotateDirection.CLOCKWISE;
        const newRotation = this.getNewRotation(this.state.rotation, isClockwise);
        
        // 获取 Wall Kick 偏移量
        const wallKicks = TetrisBlock.getWallKicks(
            this.state.type,
            this.state.rotation,
            newRotation,
            isClockwise
        );
        
        // 尝试每个 Wall Kick
        for (const offset of wallKicks) {
            const newPosition = {
                x: this.state.position.x + offset.x,
                y: this.state.position.y - offset.y // y轴向上为正
            };
            
            if (this.board.canPlace(this.state.type, newRotation, newPosition)) {
                this.state.rotation = newRotation;
                this.state.position = newPosition;
                this.state.isLastMoveRotation = true;
                this.state.lastSuccessfulRotation = this.state.rotation;
                return true;
            }
        }
        
        return false;
    }

    /**
     * 计算新旋转状态
     */
    private getNewRotation(current: RotationState, isClockwise: boolean): RotationState {
        if (isClockwise) {
            return (current + 1) % 4 as RotationState;
        } else {
            return (current + 3) % 4 as RotationState;
        }
    }

    /**
     * 软降
     */
    public softDrop(): boolean {
        return this.move(MoveDirection.DOWN);
    }

    /**
     * 硬降
     */
    public hardDrop(): number {
        if (!this.state) return 0;
        
        const distance = this.board.getHardDropDistance(
            this.state.type,
            this.state.rotation,
            this.state.position
        );
        
        // 移动到落点
        const dropPos = this.board.getDropPosition(
            this.state.type,
            this.state.rotation,
            this.state.position
        );
        
        this.state.position = dropPos;
        this.state.isLastMoveRotation = false;
        
        return distance;
    }

    /**
     * 检查是否需要锁定
     */
    public needsLock(): boolean {
        if (!this.state) return false;
        
        return !this.board.canPlace(
            this.state.type,
            this.state.rotation,
            { x: this.state.position.x, y: this.state.position.y - 1 }
        );
    }

    /**
     * 锁定方块到场地
     */
    public lock(): void {
        if (!this.state) return;
        
        this.board.lockPiece(
            this.state.type,
            this.state.rotation,
            this.state.position
        );
    }

    /**
     * 更新 DAS
     */
    public updateDAS(deltaTime: number, direction: MoveDirection | null): boolean {
        if (direction === null || direction === MoveDirection.DOWN) {
            this.dasDirection = null;
            this.dasActive = false;
            this.dasTimer = 0;
            return false;
        }
        
        if (direction !== this.dasDirection) {
            // 新方向，重置 DAS
            this.dasDirection = direction;
            this.dasActive = false;
            this.dasTimer = 0;
            return this.move(direction);
        }
        
        // 同方向持续按住
        this.dasTimer += deltaTime;
        
        if (!this.dasActive) {
            // 等待初始延迟
            if (this.dasTimer >= TetrisConfig.DAS_DELAY) {
                this.dasActive = true;
                this.dasTimer = 0;
                return this.move(direction);
            }
        } else {
            // 自动重复
            if (this.dasTimer >= TetrisConfig.DAS_REPEAT) {
                this.dasTimer = 0;
                return this.move(direction);
            }
        }
        
        return false;
    }

    /**
     * 是否最后操作是旋转
     */
    public isLastMoveRotation(): boolean {
        return this.state?.isLastMoveRotation ?? false;
    }

    /**
     * 获取最后成功的旋转状态
     */
    public getLastSuccessfulRotation(): RotationState | null {
        return this.state?.lastSuccessfulRotation ?? null;
    }

    /**
     * 重置控制器
     */
    public reset(): void {
        this.state = null;
        this.dasDirection = null;
        this.dasActive = false;
        this.dasTimer = 0;
    }
}
```

---

## Task 7: TetrisScoring.ts

**Target File:** `game/block-vs-block/assets/scripts/tetris/TetrisScoring.ts`

```typescript
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
```

---

## Task 8: TSpinDetector.ts

**Target File:** `game/block-vs-block/assets/scripts/tetris/TSpinDetector.ts`

```typescript
import { BlockType, RotationState, Position } from './TetrisTypes';
import { TetrisBoard } from './TetrisBoard';
import { TetrisBlock } from './TetrisBlock';

/**
 * T-Spin 检测器
 * 使用 LSRP (Last Success Rotation Position) 规则
 */
export class TSpinDetector {
    /**
     * 检测 T-Spin
     * @param board 场地
     * @param position 方块位置
     * @param rotation 当前旋转状态
     * @param isLastMoveRotation 最后一次操作是否为旋转
     */
    public static detect(
        board: TetrisBoard,
        position: Position,
        rotation: RotationState,
        isLastMoveRotation: boolean
    ): { isTSpin: boolean; isTSpinMini: boolean } {
        // 基本条件：最后一次操作必须是旋转
        if (!isLastMoveRotation) {
            return { isTSpin: false, isTSpinMini: false };
        }
        
        // 获取 T 方块四个角落的位置
        const corners = TSpinDetector.getTCorners(position, rotation);
        
        // 计算被占据的角落数量
        let occupiedCorners = 0;
        for (const corner of corners) {
            if (!board.isEmpty(corner.x, corner.y)) {
                occupiedCorners++;
            }
        }
        
        // 至少 3 个角落被占据才可能是 T-Spin
        if (occupiedCorners < 3) {
            return { isTSpin: false, isTSpinMini: false };
        }
        
        // 检测是否为 T-Spin Mini
        // Mini 条件：仅3个角落被占据，且前置角落至少有一个未被占据
        const frontCorners = TSpinDetector.getFrontCorners(rotation);
        let frontOccupied = 0;
        
        for (const corner of corners) {
            const index = corners.indexOf(corner);
            if (frontCorners.includes(index) && !board.isEmpty(corner.x, corner.y)) {
                frontOccupied++;
            }
        }
        
        // 如果 4 个角落都被占据，是标准 T-Spin
        if (occupiedCorners === 4) {
            return { isTSpin: true, isTSpinMini: false };
        }
        
        // 如果 3 个角落被占据，检查前置角落
        if (occupiedCorners === 3) {
            // 前置两个角落都被占据 = 标准 T-Spin
            if (frontOccupied === 2) {
                return { isTSpin: true, isTSpinMini: false };
            }
            // 否则是 T-Spin Mini
            return { isTSpin: true, isTSpinMini: true };
        }
        
        return { isTSpin: false, isTSpinMini: false };
    }

    /**
     * 获取 T 方块四个角落的位置
     * 顺序：左上、右上、左下、右下
     */
    private static getTCorners(position: Position, rotation: RotationState): Position[] {
        // T 方块的锚点在中心
        // 根据旋转状态计算四个角落
        const baseCorners = [
            { x: -1, y: 1 },  // 左上
            { x: 1, y: 1 },   // 右上
            { x: -1, y: -1 }, // 左下
            { x: 1, y: -1 }   // 右下
        ];
        
        // 应用旋转
        const rotatedCorners = baseCorners.map(corner => {
            return TSpinDetector.rotatePosition(corner, rotation);
        });
        
        // 加上锚点位置
        return rotatedCorners.map(corner => ({
            x: position.x + corner.x,
            y: position.y + corner.y
        }));
    }

    /**
     * 旋转位置
     */
    private static rotatePosition(pos: Position, rotation: RotationState): Position {
        switch (rotation) {
            case RotationState.R0:
                return pos;
            case RotationState.R90:
                return { x: -pos.y, y: pos.x };
            case RotationState.R180:
                return { x: -pos.x, y: -pos.y };
            case RotationState.R270:
                return { x: pos.y, y: -pos.x };
            default:
                return pos;
        }
    }

    /**
     * 获取前置角落索引
     * 根据 T 方块的朝向，前方两个角落
     */
    private static getFrontCorners(rotation: RotationState): number[] {
        // 索引：0=左上, 1=右上, 2=左下, 3=右下
        switch (rotation) {
            case RotationState.R0:
                return [0, 1]; // 上方两个角落
            case RotationState.R90:
                return [1, 3]; // 右侧两个角落
            case RotationState.R180:
                return [2, 3]; // 下方两个角落
            case RotationState.R270:
                return [0, 2]; // 左侧两个角落
            default:
                return [0, 1];
        }
    }
}
```

---

## Summary

Wave 2 creates 4 files:

1. **TetrisBoard.ts** - 场地系统（网格、碰撞检测、行消除、锁定）
2. **TetrisController.ts** - 控制器（移动、旋转、DAS、硬降）
3. **TetrisScoring.ts** - 计分系统（基础分、T-Spin、Back-to-Back、Perfect Clear）
4. **TSpinDetector.ts** - T-Spin 检测（LSRP 规则）

All files should be written to: `game/block-vs-block/assets/scripts/tetris/`