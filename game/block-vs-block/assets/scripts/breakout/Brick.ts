import { BrickType, BrickState, BrickColor } from './BreakoutTypes';
import { BreakoutConfig } from './BreakoutConfig';

/**
 * 砖块类
 */
export class Brick {
    private state: BrickState;

    constructor(gridX: number, gridY: number, type: BrickType = BrickType.NORMAL) {
        this.state = {
            type,
            gridX,
            gridY,
            durability: BreakoutConfig.BRICK_DURABILITY[type] || 1,
            maxDurability: BreakoutConfig.BRICK_DURABILITY[type] || 1,
            isDestroyed: false
        };
    }

    /**
     * 获取状态
     */
    public getState(): BrickState {
        return { ...this.state };
    }

    /**
     * 获取位置（格坐标）
     */
    public getPosition(): { x: number; y: number } {
        return {
            x: this.state.gridX,
            y: this.state.gridY
        };
    }

    /**
     * 获取实际位置（场景坐标）
     */
    public getWorldPosition(): { x: number; y: number } {
        return {
            x: this.state.gridX * BreakoutConfig.BRICK_WIDTH,
            y: this.state.gridY * BreakoutConfig.BRICK_HEIGHT
        };
    }

    /**
     * 获取碰撞盒
     */
    public getBounds(): { left: number; right: number; top: number; bottom: number } {
        const pos = this.getWorldPosition();
        const halfWidth = BreakoutConfig.BRICK_WIDTH / 2;
        const halfHeight = BreakoutConfig.BRICK_HEIGHT / 2;
        
        return {
            left: pos.x - halfWidth,
            right: pos.x + halfWidth,
            top: pos.y + halfHeight,
            bottom: pos.y - halfHeight
        };
    }

    /**
     * 受到攻击
     * @returns 是否被摧毁
     */
    public hit(): boolean {
        if (this.state.isDestroyed) {
            return false;
        }

        // 钢砖不受损
        if (this.state.type === BrickType.STEEL) {
            return false;
        }

        this.state.durability--;
        
        if (this.state.durability <= 0) {
            this.state.isDestroyed = true;
            return true;
        }

        return false;
    }

    /**
     * 是否已摧毁
     */
    public isDestroyed(): boolean {
        return this.state.isDestroyed;
    }

    /**
     * 是否可破坏
     */
    public isDestructible(): boolean {
        return this.state.type !== BrickType.STEEL;
    }

    /**
     * 获取类型
     */
    public getType(): BrickType {
        return this.state.type;
    }

    /**
     * 获取颜色
     */
    public getColor(): string {
        switch (this.state.type) {
            case BrickType.COPPER:
                return BrickColor.COPPER;
            case BrickType.GOLD:
                return BrickColor.GOLD;
            case BrickType.STEEL:
                return BrickColor.STEEL;
            case BrickType.BOMB:
                return BrickColor.RED;
            default:
                return BrickColor.WHITE;
        }
    }

    /**
     * 获取得分
     */
    public getScore(): number {
        switch (this.state.type) {
            case BrickType.COPPER:
                return BreakoutConfig.SCORE_TABLE.COPPER;
            case BrickType.GOLD:
                return BreakoutConfig.SCORE_TABLE.GOLD;
            case BrickType.BOMB:
                return BreakoutConfig.SCORE_TABLE.BOMB;
            default:
                return BreakoutConfig.SCORE_TABLE.NORMAL;
        }
    }

    /**
     * 摧毁砖块
     */
    public destroy(): void {
        this.state.isDestroyed = true;
    }

    /**
     * 重置砖块
     */
    public reset(): void {
        this.state.durability = this.state.maxDurability;
        this.state.isDestroyed = false;
    }

    /**
     * 是否是炸弹砖块
     */
    public isBomb(): boolean {
        return this.state.type === BrickType.BOMB;
    }

    /**
     * 获取爆炸范围
     */
    public getExplosionRadius(): number {
        return BreakoutConfig.BOMB_EXPLOSION_RADIUS;
    }
}