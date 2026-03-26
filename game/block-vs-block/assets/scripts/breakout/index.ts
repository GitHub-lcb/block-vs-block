/**
 * 弹球模块导出
 */

// 类型定义
export * from './BreakoutTypes';

// 配置
export { BreakoutConfig } from './BreakoutConfig';

// 核心组件
export { Brick } from './Brick';
export { Paddle } from './Paddle';
export { Ball } from './Ball';

// 场地
export { BreakoutBoard } from './BreakoutBoard';

// 控制器
export { BreakoutController } from './BreakoutController';

// 碰撞检测
export { CollisionDetector } from './CollisionDetector';

// 辅助系统
export { ComboSystem } from './ComboSystem';
export { BallSpawner } from './BallSpawner';
export { BrickGenerator } from './BrickGenerator';

// 主管理器
export { BreakoutManager } from './BreakoutManager';