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