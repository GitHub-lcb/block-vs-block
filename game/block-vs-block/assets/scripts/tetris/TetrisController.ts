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