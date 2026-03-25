import { _decorator } from 'cc';
const { ccclass } = _decorator;

/**
 * 游戏事件类型定义
 */
export enum GameEventType {
    // 方块相关事件
    TETRIS_PIECE_SPAWN = 'TETRIS_PIECE_SPAWN',
    TETRIS_PIECE_MOVE = 'TETRIS_PIECE_MOVE',
    TETRIS_PIECE_ROTATE = 'TETRIS_PIECE_ROTATE',
    TETRIS_PIECE_LAND = 'TETRIS_PIECE_LAND',
    TETRIS_LINE_CLEAR = 'TETRIS_LINE_CLEAR',
    TETRIS_TSPIN = 'TETRIS_TSPIN',
    TETRIS_PERFECT_CLEAR = 'TETRIS_PERFECT_CLEAR',

    // 弹球相关事件
    BREAKOUT_BALL_SPAWN = 'BREAKOUT_BALL_SPAWN',
    BREAKOUT_BALL_LAUNCH = 'BREAKOUT_BALL_LAUNCH',
    BREAKOUT_BALL_LOST = 'BREAKOUT_BALL_LOST',
    BREAKOUT_BALL_BOUNCE = 'BREAKOUT_BALL_BOUNCE',
    BREAKOUT_BRICK_HIT = 'BREAKOUT_BRICK_HIT',
    BREAKOUT_BRICK_DESTROY = 'BREAKOUT_BRICK_DESTROY',
    BREAKOUT_COMBO_UPDATE = 'BREAKOUT_COMBO_UPDATE',

    // 角色互换事件
    ROLE_SWAP_WARNING = 'ROLE_SWAP_WARNING',
    ROLE_SWAP_START = 'ROLE_SWAP_START',
    ROLE_SWAP_COMPLETE = 'ROLE_SWAP_COMPLETE',
    ROUND_START = 'ROUND_START',
    ROUND_END = 'ROUND_END',

    // 游戏流程事件
    GAME_START = 'GAME_START',
    GAME_END = 'GAME_END',
    GAME_PAUSE = 'GAME_PAUSE',
    GAME_RESUME = 'GAME_RESUME',

    // 道具事件
    ITEM_ACQUIRED = 'ITEM_ACQUIRED',
    ITEM_USED = 'ITEM_USED',

    // 分数事件
    SCORE_UPDATE = 'SCORE_UPDATE',

    // 音效事件
    SOUND_PLAY = 'SOUND_PLAY',
    BGM_CHANGE = 'BGM_CHANGE',

    // UI事件
    UI_UPDATE = 'UI_UPDATE',
    SHOW_TOAST = 'SHOW_TOAST',
}

/**
 * 事件数据接口
 */
export interface EventData {
    [key: string]: any;
}

/**
 * 事件监听器类型
 */
export type EventListener = (data: EventData) => void;

/**
 * 事件总线
 * 单例模式，管理全局事件订阅/发布
 */
@ccclass('EventBus')
export class EventBus {
    private static _instance: EventBus | null = null;
    
    private _listeners: Map<GameEventType | string, EventListener[]> = new Map();
    private _onceListeners: Map<GameEventType | string, EventListener[]> = new Map();
    private _eventHistory: Array<{ type: GameEventType | string; data: EventData; timestamp: number }> = [];
    private _maxHistoryLength: number = 100;
    private _debugMode: boolean = false;

    /**
     * 获取单例实例
     */
    public static get instance(): EventBus {
        if (!EventBus._instance) {
            EventBus._instance = new EventBus();
        }
        return EventBus._instance;
    }

    private constructor() {}

    /**
     * 订阅事件
     */
    public on(type: GameEventType | string, listener: EventListener): void {
        if (!this._listeners.has(type)) {
            this._listeners.set(type, []);
        }
        this._listeners.get(type)!.push(listener);
    }

    /**
     * 订阅一次性事件
     */
    public once(type: GameEventType | string, listener: EventListener): void {
        if (!this._onceListeners.has(type)) {
            this._onceListeners.set(type, []);
        }
        this._onceListeners.get(type)!.push(listener);
    }

    /**
     * 取消订阅
     */
    public off(type: GameEventType | string, listener?: EventListener): void {
        if (listener) {
            const listeners = this._listeners.get(type);
            if (listeners) {
                const index = listeners.indexOf(listener);
                if (index !== -1) {
                    listeners.splice(index, 1);
                }
            }
        } else {
            this._listeners.delete(type);
        }
    }

    /**
     * 发布事件
     */
    public emit(type: GameEventType | string, data: EventData = {}): void {
        this._addToHistory(type, data);

        const listeners = this._listeners.get(type);
        if (listeners) {
            listeners.forEach(listener => {
                try {
                    listener(data);
                } catch (error) {
                    console.error(`[EventBus] Listener error for ${type}:`, error);
                }
            });
        }

        const onceListeners = this._onceListeners.get(type);
        if (onceListeners) {
            onceListeners.forEach(listener => {
                try {
                    listener(data);
                } catch (error) {
                    console.error(`[EventBus] Once listener error for ${type}:`, error);
                }
            });
            this._onceListeners.delete(type);
        }

        if (this._debugMode) {
            console.log(`[EventBus] Emitted: ${type}`, data);
        }
    }

    /**
     * 清除所有监听器
     */
    public clear(): void {
        this._listeners.clear();
        this._onceListeners.clear();
    }

    /**
     * 设置调试模式
     */
    public setDebugMode(enabled: boolean): void {
        this._debugMode = enabled;
    }

    private _addToHistory(type: GameEventType | string, data: EventData): void {
        this._eventHistory.push({ type, data, timestamp: Date.now() });
        if (this._eventHistory.length > this._maxHistoryLength) {
            this._eventHistory.shift();
        }
    }
}