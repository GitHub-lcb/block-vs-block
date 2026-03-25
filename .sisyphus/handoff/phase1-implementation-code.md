# Phase 1 Implementation Code

This file contains the implementation code for Phase 1 tasks that need to be written to the project.

---

## Task 3: GameStateManager.ts

**Target File:** `game/block-vs-block/assets/scripts/core/GameStateManager.ts`

```typescript
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
```

---

## Task 4: EventBus.ts

**Target File:** `game/block-vs-block/assets/scripts/core/EventBus.ts`

```typescript
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
```

---

## Task 5: AudioManager.ts

**Target File:** `game/block-vs-block/assets/scripts/core/AudioManager.ts`

```typescript
import { _decorator, AudioSource, AudioClip, resources, Node, director } from 'cc';
const { ccclass } = _decorator;

/**
 * 音效类型
 */
export enum SoundType {
    TETRIS_MOVE = 'tetris_move',
    TETRIS_ROTATE = 'tetris_rotate',
    TETRIS_LAND = 'tetris_land',
    TETRIS_CLEAR = 'tetris_clear',
    TETRIS_TSPIN = 'tetris_tspin',
    
    BREAKOUT_LAUNCH = 'breakout_launch',
    BREAKOUT_BOUNCE = 'breakout_bounce',
    BREAKOUT_HIT = 'breakout_hit',
    BREAKOUT_DESTROY = 'breakout_destroy',
    BREAKOUT_LOST = 'breakout_lost',
    
    UI_CLICK = 'ui_click',
    SWAP_WARNING = 'swap_warning',
    SWAP_START = 'swap_start',
    GAME_START = 'game_start',
    GAME_END = 'game_end',
    VICTORY = 'victory',
    DEFEAT = 'defeat',
    
    ITEM_ACQUIRE = 'item_acquire',
    ITEM_USE = 'item_use'
}

/**
 * BGM类型
 */
export enum BGMType {
    MENU = 'bgm_menu',
    GAME = 'bgm_game',
    WARNING = 'bgm_warning',
    RESULT = 'bgm_result'
}

/**
 * 音频管理器
 */
@ccclass('AudioManager')
export class AudioManager {
    private static _instance: AudioManager | null = null;

    private _bgmSource: AudioSource | null = null;
    private _sfxSources: AudioSource[] = [];
    private _maxSfxChannels: number = 8;

    private _bgmVolume: number = 1.0;
    private _sfxVolume: number = 1.0;
    private _isMuted: boolean = false;

    private _audioCache: Map<string, AudioClip> = new Map();
    private _currentBGM: BGMType | null = null;
    private _audioNode: Node | null = null;

    public static get instance(): AudioManager {
        if (!AudioManager._instance) {
            AudioManager._instance = new AudioManager();
        }
        return AudioManager._instance;
    }

    public get bgmVolume(): number { return this._bgmVolume; }
    public set bgmVolume(value: number) {
        this._bgmVolume = Math.max(0, Math.min(1, value));
        if (this._bgmSource) {
            this._bgmSource.volume = this._isMuted ? 0 : this._bgmVolume;
        }
    }

    public get sfxVolume(): number { return this._sfxVolume; }
    public set sfxVolume(value: number) {
        this._sfxVolume = Math.max(0, Math.min(1, value));
    }

    public get isMuted(): boolean { return this._isMuted; }
    public set isMuted(value: boolean) {
        this._isMuted = value;
        if (this._bgmSource) {
            this._bgmSource.volume = value ? 0 : this._bgmVolume;
        }
    }

    private constructor() {}

    /**
     * 初始化音频管理器
     */
    public init(): void {
        this._audioNode = new Node('AudioManager');
        director.getScene()?.addChild(this._audioNode);
        
        this._bgmSource = this._audioNode.addComponent(AudioSource);
        this._bgmSource.loop = true;
        
        for (let i = 0; i < this._maxSfxChannels; i++) {
            const source = this._audioNode.addComponent(AudioSource);
            source.loop = false;
            this._sfxSources.push(source);
        }

        console.log('[AudioManager] Initialized');
    }

    /**
     * 播放BGM
     */
    public async playBGM(type: BGMType, fadeIn: number = 0.5): Promise<void> {
        if (this._currentBGM === type && this._bgmSource?.playing) {
            return;
        }

        const path = `audio/bgm/${type}`;
        const clip = await this._loadAudioClip(path);
        
        if (!clip || !this._bgmSource) {
            console.warn(`[AudioManager] Failed to load BGM: ${type}`);
            return;
        }

        if (this._bgmSource.playing) {
            this._bgmSource.stop();
        }

        this._bgmSource.clip = clip;
        this._bgmSource.volume = this._isMuted ? 0 : 0;
        this._bgmSource.play();
        this._currentBGM = type;

        if (fadeIn > 0 && !this._isMuted) {
            this._fadeInBGM(fadeIn);
        }
    }

    /**
     * 停止BGM
     */
    public stopBGM(fadeOut: number = 0.5): void {
        if (!this._bgmSource || !this._bgmSource.playing) return;
        if (fadeOut > 0) {
            this._fadeOutBGM(fadeOut);
        } else {
            this._bgmSource.stop();
            this._currentBGM = null;
        }
    }

    /**
     * 播放音效
     */
    public async playSFX(type: SoundType, volume: number = 1.0): Promise<void> {
        if (this._isMuted) return;

        const path = `audio/sfx/${type}`;
        const clip = await this._loadAudioClip(path);

        if (!clip) {
            console.warn(`[AudioManager] Failed to load SFX: ${type}`);
            return;
        }

        const source = this._getAvailableSfxSource();
        if (!source) return;

        source.clip = clip;
        source.volume = this._sfxVolume * volume;
        source.play();
    }

    /**
     * 停止所有音效
     */
    public stopAllSFX(): void {
        this._sfxSources.forEach(source => {
            if (source.playing) source.stop();
        });
    }

    /**
     * 加载设置
     */
    public loadSettings(): void {
        try {
            const savedBgmVolume = localStorage.getItem('bgmVolume');
            const savedSfxVolume = localStorage.getItem('sfxVolume');
            const savedMuted = localStorage.getItem('isMuted');

            if (savedBgmVolume !== null) this._bgmVolume = parseFloat(savedBgmVolume);
            if (savedSfxVolume !== null) this._sfxVolume = parseFloat(savedSfxVolume);
            if (savedMuted !== null) this._isMuted = savedMuted === 'true';
        } catch (error) {
            console.warn('[AudioManager] Failed to load settings:', error);
        }
    }

    /**
     * 保存设置
     */
    public saveSettings(): void {
        try {
            localStorage.setItem('bgmVolume', this._bgmVolume.toString());
            localStorage.setItem('sfxVolume', this._sfxVolume.toString());
            localStorage.setItem('isMuted', this._isMuted.toString());
        } catch (error) {
            console.warn('[AudioManager] Failed to save settings:', error);
        }
    }

    private async _loadAudioClip(path: string): Promise<AudioClip | null> {
        if (this._audioCache.has(path)) {
            return this._audioCache.get(path)!;
        }

        return new Promise((resolve) => {
            resources.load(path, AudioClip, (error, clip) => {
                if (error) {
                    resolve(null);
                } else {
                    this._audioCache.set(path, clip);
                    resolve(clip);
                }
            });
        });
    }

    private _getAvailableSfxSource(): AudioSource | null {
        for (const source of this._sfxSources) {
            if (!source.playing) return source;
        }
        return null;
    }

    private _fadeInBGM(duration: number): void {
        if (!this._bgmSource) return;
        const targetVolume = this._bgmVolume;
        const startTime = Date.now();
        
        const fadeIn = () => {
            const progress = Math.min((Date.now() - startTime) / 1000 / duration, 1);
            this._bgmSource!.volume = targetVolume * progress;
            if (progress < 1) requestAnimationFrame(fadeIn);
        };
        fadeIn();
    }

    private _fadeOutBGM(duration: number): void {
        if (!this._bgmSource) return;
        const startVolume = this._bgmSource.volume;
        const startTime = Date.now();
        
        const fadeOut = () => {
            const progress = Math.min((Date.now() - startTime) / 1000 / duration, 1);
            this._bgmSource!.volume = startVolume * (1 - progress);
            if (progress < 1) {
                requestAnimationFrame(fadeOut);
            } else {
                this._bgmSource!.stop();
                this._currentBGM = null;
            }
        };
        fadeOut();
    }
}
```

---

## Summary

These three files need to be written to:
1. `game/block-vs-block/assets/scripts/core/GameStateManager.ts`
2. `game/block-vs-block/assets/scripts/core/EventBus.ts`
3. `game/block-vs-block/assets/scripts/core/AudioManager.ts`

After writing, verify compilation in Cocos Creator.