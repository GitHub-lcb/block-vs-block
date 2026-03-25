import { _decorator } from 'cc';
const { ccclass } = _decorator;

/**
 * 游戏状态枚举
 * 对应需求文档 2.1.1 交互状态表
 */
export enum GameState {
    LOADING = 'LOADING',     // 游戏启动中
    READY = 'READY',         // 互换后新回合，空场地
    PLAYING = 'PLAYING',     // 正常游戏进行中
    WARNING = 'WARNING',     // 互换警告（25-30秒）
    SWAPPING = 'SWAPPING',   // 角色互换动画中
    PAUSED = 'PAUSED',       // 游戏暂停（网络异常）
    ENDED = 'ENDED'          // 游戏结束
}

/**
 * 状态变化事件数据
 */
export interface StateChangeEvent {
    previousState: GameState;
    newState: GameState;
    timestamp: number;
}

/**
 * 状态变化监听器类型
 */
export type StateChangeListener = (event: StateChangeEvent) => void;

/**
 * 游戏状态管理器
 * 单例模式，管理全局游戏状态
 */
@ccclass('GameStateManager')
export class GameStateManager {
    private static _instance: GameStateManager | null = null;
    
    private _currentState: GameState = GameState.LOADING;
    private _listeners: Map<string, StateChangeListener[]> = new Map();
    private _stateHistory: StateChangeEvent[] = [];
    private _maxHistoryLength: number = 50;

    /**
     * 获取单例实例
     */
    public static get instance(): GameStateManager {
        if (!GameStateManager._instance) {
            GameStateManager._instance = new GameStateManager();
        }
        return GameStateManager._instance;
    }

    /**
     * 当前游戏状态
     */
    public get currentState(): GameState {
        return this._currentState;
    }

    /**
     * 私有构造函数，确保单例
     */
    private constructor() {}

    /**
     * 切换游戏状态
     */
    public changeState(newState: GameState, force: boolean = false): boolean {
        if (this._currentState === newState && !force) {
            return false;
        }

        const previousState = this._currentState;
        const event: StateChangeEvent = {
            previousState,
            newState,
            timestamp: Date.now()
        };

        this._currentState = newState;
        this._addToHistory(event);
        this._notifyListeners(event);

        console.log(`[GameStateManager] State changed: ${previousState} -> ${newState}`);
        return true;
    }

    /**
     * 注册状态变化监听器
     */
    public addListener(listener: StateChangeListener, id?: string): string {
        const listenerId = id || `listener_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        if (!this._listeners.has(listenerId)) {
            this._listeners.set(listenerId, []);
        }
        this._listeners.get(listenerId)!.push(listener);
        
        return listenerId;
    }

    /**
     * 移除状态变化监听器
     */
    public removeListener(id: string): boolean {
        return this._listeners.delete(id);
    }

    /**
     * 清除所有监听器
     */
    public clearListeners(): void {
        this._listeners.clear();
    }

    /**
     * 获取状态历史记录
     */
    public getStateHistory(): StateChangeEvent[] {
        return [...this._stateHistory];
    }

    /**
     * 重置状态管理器
     */
    public reset(): void {
        this._currentState = GameState.LOADING;
        this._stateHistory = [];
    }

    /**
     * 检查当前是否为指定状态
     */
    public isState(state: GameState): boolean {
        return this._currentState === state;
    }

    /**
     * 检查当前是否可以进行游戏操作
     */
    public canPlay(): boolean {
        return this._currentState === GameState.PLAYING || 
               this._currentState === GameState.WARNING;
    }

    /**
     * 检查游戏是否结束
     */
    public isEnded(): boolean {
        return this._currentState === GameState.ENDED;
    }

    private _addToHistory(event: StateChangeEvent): void {
        this._stateHistory.push(event);
        if (this._stateHistory.length > this._maxHistoryLength) {
            this._stateHistory.shift();
        }
    }

    private _notifyListeners(event: StateChangeEvent): void {
        this._listeners.forEach((listeners) => {
            listeners.forEach(listener => {
                try {
                    listener(event);
                } catch (error) {
                    console.error('[GameStateManager] Listener error:', error);
                }
            });
        });
    }
}