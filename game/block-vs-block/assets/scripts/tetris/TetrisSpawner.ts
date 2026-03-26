import { BlockType } from './TetrisTypes';
import { TetrisConfig } from './TetrisConfig';

/**
 * 方块生成器
 * 使用 7-bag 随机算法
 */
export class TetrisSpawner {
    private bag: BlockType[] = [];
    private nextQueue: BlockType[] = [];
    private random: () => number;

    constructor(randomFn?: () => number) {
        this.random = randomFn || Math.random;
        this.initNextQueue();
    }

    /**
     * 初始化 Next 队列
     */
    private initNextQueue(): void {
        // 填充足够的方块到 Next 队列
        for (let i = 0; i < TetrisConfig.NEXT_COUNT + 1; i++) {
            this.nextQueue.push(this.getNextFromBag());
        }
    }

    /**
     * 从 7-bag 中获取下一个方块
     */
    private getNextFromBag(): BlockType {
        // 如果 bag 为空，重新填充
        if (this.bag.length === 0) {
            this.fillBag();
        }
        
        return this.bag.pop()!;
    }

    /**
     * 填充 7-bag
     * 随机打乱7种方块
     */
    private fillBag(): void {
        this.bag = [
            BlockType.I,
            BlockType.O,
            BlockType.T,
            BlockType.S,
            BlockType.Z,
            BlockType.J,
            BlockType.L
        ];
        
        // Fisher-Yates 洗牌算法
        for (let i = this.bag.length - 1; i > 0; i--) {
            const j = Math.floor(this.random() * (i + 1));
            [this.bag[i], this.bag[j]] = [this.bag[j], this.bag[i]];
        }
    }

    /**
     * 获取下一个方块
     * 同时更新 Next 队列
     */
    public spawn(): BlockType {
        const next = this.nextQueue.shift()!;
        this.nextQueue.push(this.getNextFromBag());
        return next;
    }

    /**
     * 获取 Next 预览队列
     */
    public getNextQueue(): BlockType[] {
        return [...this.nextQueue];
    }

    /**
     * 预览指定位置的方块
     * @param index 位置索引（0 = 当前方块, 1 = 下一个, 2 = 下下个）
     */
    public peek(index: number = 0): BlockType {
        if (index >= 0 && index < this.nextQueue.length) {
            return this.nextQueue[index];
        }
        return this.nextQueue[0];
    }

    /**
     * 重置生成器
     */
    public reset(): void {
        this.bag = [];
        this.nextQueue = [];
        this.initNextQueue();
    }

    /**
     * 设置随机函数（用于测试）
     */
    public setRandom(randomFn: () => number): void {
        this.random = randomFn;
    }
}