/**
 * 对象池
 * 用于复用游戏对象，提升性能
 */
export class ObjectPool<T> {
    private pool: T[] = [];
    private createFn: () => T;
    private resetFn: (obj: T) => void;
    private maxSize: number;

    constructor(
        createFn: () => T,
        resetFn: (obj: T) => void,
        initialSize: number = 10,
        maxSize: number = 50
    ) {
        this.createFn = createFn;
        this.resetFn = resetFn;
        this.maxSize = maxSize;

        // 预创建对象
        for (let i = 0; i < initialSize; i++) {
            this.pool.push(this.createFn());
        }
    }

    /**
     * 获取对象
     */
    public get(): T {
        if (this.pool.length > 0) {
            return this.pool.pop()!;
        }
        return this.createFn();
    }

    /**
     * 归还对象
     */
    public release(obj: T): void {
        if (this.pool.length < this.maxSize) {
            this.resetFn(obj);
            this.pool.push(obj);
        }
    }

    /**
     * 清空池
     */
    public clear(): void {
        this.pool = [];
    }

    /**
     * 获取池大小
     */
    public size(): number {
        return this.pool.length;
    }
}

/**
 * 对象池管理器
 */
export class PoolManager {
    private static pools: Map<string, ObjectPool<any>> = new Map();

    /**
     * 注册对象池
     */
    public static register<T>(
        name: string,
        createFn: () => T,
        resetFn: (obj: T) => void,
        initialSize: number = 10,
        maxSize: number = 50
    ): void {
        this.pools.set(name, new ObjectPool(createFn, resetFn, initialSize, maxSize));
    }

    /**
     * 获取对象
     */
    public static get<T>(name: string): T {
        const pool = this.pools.get(name);
        if (!pool) {
            console.warn(`Pool "${name}" not found`);
            return null as T;
        }
        return pool.get();
    }

    /**
     * 归还对象
     */
    public static release<T>(name: string, obj: T): void {
        const pool = this.pools.get(name);
        if (pool) {
            pool.release(obj);
        }
    }

    /**
     * 清空所有池
     */
    public static clearAll(): void {
        this.pools.forEach(pool => pool.clear());
    }
}