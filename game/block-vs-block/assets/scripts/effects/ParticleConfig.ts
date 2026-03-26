import { Color } from 'cc';

/**
 * 粒子效果配置
 */
export class ParticleConfig {
    /**
     * 行消除粒子配置
     */
    public static readonly LINE_CLEAR = {
        count: 50,
        duration: 0.5,
        speed: 200,
        gravity: -100,
        colors: [
            new Color(0, 255, 255, 255),   // 青色
            new Color(255, 0, 255, 255),   // 紫色
            new Color(255, 255, 0, 255),   // 黄色
            new Color(0, 255, 136, 255)    // 绿色
        ],
        size: { min: 4, max: 8 },
        lifetime: { min: 0.3, max: 0.6 }
    };

    /**
     * 砖块击碎粒子配置
     */
    public static readonly BRICK_DESTROY = {
        count: 20,
        duration: 0.3,
        speed: 150,
        gravity: -50,
        colors: [
            new Color(255, 255, 255, 255),
            new Color(255, 200, 100, 255)
        ],
        size: { min: 3, max: 6 },
        lifetime: { min: 0.2, max: 0.4 }
    };

    /**
     * 角色互换粒子配置
     */
    public static readonly ROLE_SWAP = {
        count: 100,
        duration: 0.5,
        speed: 300,
        gravity: 0,
        colors: [
            new Color(0, 255, 255, 255),   // 青色
            new Color(255, 0, 255, 255)    // 紫色
        ],
        size: { min: 6, max: 12 },
        lifetime: { min: 0.4, max: 0.8 }
    };

    /**
     * 连击粒子配置
     */
    public static readonly COMBO = {
        count: 30,
        duration: 0.4,
        speed: 180,
        gravity: -80,
        colors: [
            new Color(255, 215, 0, 255)    // 金色
        ],
        size: { min: 5, max: 10 },
        lifetime: { min: 0.3, max: 0.5 }
    };

    /**
     * T-Spin 粒子配置
     */
    public static readonly TSPIN = {
        count: 80,
        duration: 0.6,
        speed: 250,
        gravity: 0,
        colors: [
            new Color(255, 0, 255, 255),   // 紫色
            new Color(255, 136, 0, 255),   // 橙色
            new Color(255, 255, 255, 255)  // 白色
        ],
        size: { min: 5, max: 10 },
        lifetime: { min: 0.4, max: 0.7 }
    };

    /**
     * 完美消除粒子配置
     */
    public static readonly PERFECT_CLEAR = {
        count: 150,
        duration: 1.0,
        speed: 350,
        gravity: 0,
        colors: [
            new Color(0, 255, 255, 255),
            new Color(255, 255, 0, 255),
            new Color(255, 0, 255, 255),
            new Color(0, 255, 136, 255),
            new Color(255, 136, 0, 255)
        ],
        size: { min: 8, max: 16 },
        lifetime: { min: 0.6, max: 1.0 }
    };
}