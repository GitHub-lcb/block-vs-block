# 开发计划：Phase 3 - 弹球模块

## TL;DR

> **Quick Summary**: 实现完整的弹球游戏模块，包括挡板控制、球物理、砖块系统、碰撞检测、连击系统。
> 
> **Deliverables**:
> - BreakoutTypes.ts - 类型定义
> - BreakoutConfig.ts - 配置常量
> - Paddle.ts - 挡板控制
> - Ball.ts - 球物理
> - Brick.ts - 砖块系统
> - BreakoutBoard.ts - 场地系统
> - BreakoutController.ts - 控制器
> - ComboSystem.ts - 连击系统
> - BreakoutManager.ts - 总管理器
> 
> **Estimated Effort**: Large (Day 8-11)
> **Parallel Execution**: YES - 4 waves
> **Critical Path**: 类型定义 → 砖块/球 → 控制器 → 集成

---

## Context

### Original Request
Phase 3 核心玩法开发 - 弹球模块实现。

### 需求要点（来自需求文档）

#### 基础操作
| 操作 | 触控方式 | 说明 |
|------|----------|------|
| 挡板左移 | 点击左区 | 挡板向左移动 |
| 挡板右移 | 点击右区 | 挡板向右移动 |
| 发射球 | 点击中区 | 发射球 |
| 加速球 | 长按 | 球速提升50% |

#### 计分规则
| 行为 | 分数 | 说明 |
|------|------|------|
| 击碎普通砖块 | +1 分 | 基础得分 |
| 击碎铜砖 | +2 分 | 需击中2次 |
| 击碎金砖 | +5 分 | 稀有砖块 |
| 连击加成 | +连击数 | 连续击中不落球 |

#### 球生成与丢失
- 球落出屏幕后，5秒自动生成新球
- 每局最多丢失3球
- 超过3球后扣分：每次丢失球扣减 10 分
- 球速度固定，不随等级变化

#### 特殊砖块
| 砖块 | 颜色 | 耐久 | 效果 |
|------|------|------|------|
| 普通 | 白/绿/蓝 | 1 | 基础砖块 |
| 铜砖 | 🟤 棕色 | 2 | 需击中2次 |
| 金砖 | 🟡 金色 | 1 | +5分，掉落道具 |
| 钢砖 | ⬜ 灰色 | ∞ | 不可破坏 |
| 炸弹砖 | 🔴 红色 | 1 | 爆炸消除周围砖块 |

---

## Work Objectives

### Core Objective
实现完整的弹球游戏模块，可与俄罗斯方块模块共享场地。

### Concrete Deliverables
- `assets/scripts/breakout/BreakoutTypes.ts` - 类型定义
- `assets/scripts/breakout/BreakoutConfig.ts` - 配置常量
- `assets/scripts/breakout/Paddle.ts` - 挡板
- `assets/scripts/breakout/Ball.ts` - 球
- `assets/scripts/breakout/Brick.ts` - 砖块
- `assets/scripts/breakout/BreakoutBoard.ts` - 场地
- `assets/scripts/breakout/BreakoutController.ts` - 控制器
- `assets/scripts/breakout/ComboSystem.ts` - 连击
- `assets/scripts/breakout/BreakoutManager.ts` - 管理器
- `assets/scripts/breakout/index.ts` - 导出

### Definition of Done
- [ ] 挡板控制正常
- [ ] 球物理正确
- [ ] 碰撞检测准确
- [ ] 砖块消除正确
- [ ] 连击系统正常
- [ ] 球丢失处理正确

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately — 数据定义):
├── Task 1: BreakoutTypes.ts - 类型定义 [quick]
├── Task 2: BreakoutConfig.ts - 配置常量 [quick]
├── Task 3: Brick.ts - 砖块系统 [unspecified-high]
└── Task 4: Paddle.ts - 挡板系统 [quick]

Wave 2 (After Wave 1 — 核心系统):
├── Task 5: Ball.ts - 球物理 [deep]
├── Task 6: BreakoutBoard.ts - 场地系统 [unspecified-high]
├── Task 7: CollisionDetector.ts - 碰撞检测 [unspecified-high]
└── Task 8: BreakoutController.ts - 控制器 [unspecified-high]

Wave 3 (After Wave 2 — 辅助系统):
├── Task 9: ComboSystem.ts - 连击系统 [quick]
├── Task 10: BallSpawner.ts - 球生成器 [quick]
└── Task 11: BrickGenerator.ts - 砖块生成器 [quick]

Wave 4 (After Wave 3 — 集成):
├── Task 12: BreakoutManager.ts - 总管理器 [deep]
└── Task 13: index.ts - 模块导出 [quick]
```

---

## TODOs

- [ ] 1. BreakoutTypes.ts - 类型定义

  **What to do**:
  - 定义 `BrickType` 枚举（NORMAL, COPPER, GOLD, STEEL, BOMB）
  - 定义 `BrickState` 接口
  - 定义 `BallState` 接口
  - 定义 `PaddleState` 接口
  - 定义碰撞相关类型

- [ ] 2. BreakoutConfig.ts - 配置常量

  **What to do**:
  - 场地尺寸（与俄罗斯方块共享）
  - 球速度配置
  - 挡板尺寸
  - 砖块尺寸
  - 连击配置

- [ ] 3. Brick.ts - 砖块系统

  **What to do**:
  - 实现5种砖块类型
  - 实现砖块状态（位置、耐久）
  - 实现砖块碰撞处理

- [ ] 4. Paddle.ts - 挡板系统

  **What to do**:
  - 实现挡板移动
  - 实现挡板碰撞
  - 实现挡板边界限制

- [ ] 5. Ball.ts - 球物理

  **What to do**:
  - 实现球运动
  - 实现边界反弹
  - 实现挡板反弹
  - 实现砖块碰撞
  - 实现加速功能

- [ ] 6. BreakoutBoard.ts - 场地系统

  **What to do**:
  - 管理砖块布局
  - 管理球和挡板
  - 实现场地边界

- [ ] 7. CollisionDetector.ts - 碰撞检测

  **What to do**:
  - 球与砖块碰撞
  - 球与挡板碰撞
  - 球与边界碰撞

- [ ] 8. BreakoutController.ts - 控制器

  **What to do**:
  - 处理玩家输入
  - 控制挡板移动
  - 控制球发射

- [ ] 9. ComboSystem.ts - 连击系统

  **What to do**:
  - 实现连击计数
  - 实现连击加成

- [ ] 10. BallSpawner.ts - 球生成器

  **What to do**:
  - 实现球生成逻辑
  - 实现球丢失处理

- [ ] 11. BrickGenerator.ts - 砖块生成器

  **What to do**:
  - 从方块落地生成砖块
  - 随机生成特殊砖块

- [ ] 12. BreakoutManager.ts - 总管理器

  **What to do**:
  - 整合所有子系统
  - 实现游戏循环
  - 处理事件通信

- [ ] 13. index.ts - 模块导出

  **What to do**:
  - 导出所有组件

---

## Commit Strategy

- **1-4**: `feat(breakout): 添加弹球基础组件`
- **5-8**: `feat(breakout): 添加核心游戏系统`
- **9-11**: `feat(breakout): 添加辅助系统`
- **12-13**: `feat(breakout): 集成并完成模块`

---

## Success Criteria

### Verification Commands
```bash
# 检查文件结构
ls -la game/block-vs-block/assets/scripts/breakout/

# TypeScript 编译检查
# (在 Cocos Creator 中编译)
```

### Final Checklist
- [ ] 所有文件创建完成
- [ ] TypeScript 编译无错误
- [ ] 球和挡板正确显示和操作
- [ ] 碰撞和消除正确