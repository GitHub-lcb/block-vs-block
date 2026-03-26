import { _decorator, Component, Node, ParticleSystem, Vec3, Color } from 'cc';
import { ParticleConfig } from './ParticleConfig';

const { ccclass, property } = _decorator;

/**
 * 粒子效果类型
 */
export enum ParticleType {
    LINE_CLEAR = 'LINE_CLEAR',
    BRICK_DESTROY = 'BRICK_DESTROY',
    ROLE_SWAP = 'ROLE_SWAP',
    COMBO = 'COMBO',
    TSPIN = 'TSPIN',
    PERFECT_CLEAR = 'PERFECT_CLEAR'
}

/**
 * 粒子管理器
 */
@ccclass('ParticleManager')
export class ParticleManager extends Component {
    private static _instance: ParticleManager | null = null;

    @property([Node])
    public particlePools: Node[] = [];

    public static get instance(): ParticleManager {
        return ParticleManager._instance!;
    }

    protected onLoad(): void {
        ParticleManager._instance = this;
    }

    /**
     * 播放粒子效果
     */
    public play(type: ParticleType, position: Vec3): void {
        const config = this.getConfig(type);
        if (!config) return;

        // 创建粒子节点
        const particleNode = this.createParticleNode(type, config, position);
        this.node.addChild(particleNode);

        // 自动销毁
        this.scheduleOnce(() => {
            particleNode.destroy();
        }, config.duration);
    }

    /**
     * 创建粒子节点
     */
    private createParticleNode(type: ParticleType, config: any, position: Vec3): Node {
        const node = new Node(`Particle_${type}`);
        node.setPosition(position);

        const particle = node.addComponent(ParticleSystem);
        
        // 配置粒子系统
        particle.capacity = config.count;
        particle.startLifetime = config.lifetime;
        particle.startSize = config.size;
        particle.startSpeed = config.speed;
        particle.gravityModifier = config.gravity;
        particle.duration = config.duration;
        particle.startColor = config.colors[0];

        return node;
    }

    /**
     * 获取配置
     */
    private getConfig(type: ParticleType): any {
        switch (type) {
            case ParticleType.LINE_CLEAR:
                return ParticleConfig.LINE_CLEAR;
            case ParticleType.BRICK_DESTROY:
                return ParticleConfig.BRICK_DESTROY;
            case ParticleType.ROLE_SWAP:
                return ParticleConfig.ROLE_SWAP;
            case ParticleType.COMBO:
                return ParticleConfig.COMBO;
            case ParticleType.TSPIN:
                return ParticleConfig.TSPIN;
            case ParticleType.PERFECT_CLEAR:
                return ParticleConfig.PERFECT_CLEAR;
            default:
                return null;
        }
    }

    /**
     * 行消除效果
     */
    public playLineClear(y: number): void {
        this.play(ParticleType.LINE_CLEAR, new Vec3(5, y, 0));
    }

    /**
     * 砖块击碎效果
     */
    public playBrickDestroy(x: number, y: number): void {
        this.play(ParticleType.BRICK_DESTROY, new Vec3(x, y, 0));
    }

    /**
     * 角色互换效果
     */
    public playRoleSwap(): void {
        // 屏幕中央
        this.play(ParticleType.ROLE_SWAP, new Vec3(5, 12, 0));
    }

    /**
     * 连击效果
     */
    public playCombo(x: number, y: number): void {
        this.play(ParticleType.COMBO, new Vec3(x, y, 0));
    }

    /**
     * T-Spin 效果
     */
    public playTSpin(x: number, y: number): void {
        this.play(ParticleType.TSPIN, new Vec3(x, y, 0));
    }

    /**
     * 完美消除效果
     */
    public playPerfectClear(): void {
        this.play(ParticleType.PERFECT_CLEAR, new Vec3(5, 10, 0));
    }
}