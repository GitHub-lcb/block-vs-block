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