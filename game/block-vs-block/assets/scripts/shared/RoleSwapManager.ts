import { _decorator } from 'cc';
import { EventBus, GameEventType } from '../core/EventBus';
import { GameStateManager, GameState } from '../core/GameStateManager';

const { ccclass } = _decorator;

/**
 * 玩家角色
 */
export enum PlayerRole {
    TETRIS = 'TETRIS',
    BREAKOUT = 'BREAKOUT'
}

/**
 * 角色互换管理器
 */
@ccclass('RoleSwapManager')
export class RoleSwapManager {
    private p1Role: PlayerRole = PlayerRole.TETRIS;
    private p2Role: PlayerRole = PlayerRole.BREAKOUT;
    private swapCount: number = 0;
    private isSwapping: boolean = false;
    private swapAnimationDuration: number = 500; // 0.5秒

    /**
     * 获取玩家角色
     */
    public getPlayerRole(playerId: 1 | 2): PlayerRole {
        return playerId === 1 ? this.p1Role : this.p2Role;
    }

    /**
     * 执行角色互换
     */
    public swap(): void {
        if (this.isSwapping) return;

        this.isSwapping = true;
        this.swapCount++;

        // 切换状态
        GameStateManager.instance.changeState(GameState.SWAPPING);

        // 互换角色
        const temp = this.p1Role;
        this.p1Role = this.p2Role;
        this.p2Role = temp;

        // 发送事件
        EventBus.instance.emit(GameEventType.ROLE_SWAP_START, {
            roundNumber: this.swapCount + 1,
            p1NewRole: this.p1Role,
            p2NewRole: this.p2Role
        });

        // 模拟动画时间后完成
        setTimeout(() => {
            this.completeSwap();
        }, this.swapAnimationDuration);
    }

    /**
     * 完成交换
     */
    private completeSwap(): void {
        this.isSwapping = false;

        EventBus.instance.emit(GameEventType.ROLE_SWAP_COMPLETE, {
            p1Role: this.p1Role,
            p2Role: this.p2Role
        });

        EventBus.instance.emit(GameEventType.ROUND_START, {
            roundNumber: this.swapCount + 1
        });

        // 切换到正常游戏状态
        GameStateManager.instance.changeState(GameState.PLAYING);
    }

    /**
     * 是否正在互换
     */
    public isInSwap(): boolean {
        return this.isSwapping;
    }

    /**
     * 获取互换次数
     */
    public getSwapCount(): number {
        return this.swapCount;
    }

    /**
     * 重置
     */
    public reset(): void {
        this.p1Role = PlayerRole.TETRIS;
        this.p2Role = PlayerRole.BREAKOUT;
        this.swapCount = 0;
        this.isSwapping = false;
    }
}