# 开发计划：Phase 2 - 俄罗斯方块模块

## TL;DR

> **Quick Summary**: 实现完整的俄罗斯方块游戏模块，包括7种标准方块、SRS旋转系统、碰撞检测、行消除、Hold/Next系统。
> 
> **Deliverables**:
> - TetrisBlock.ts - 方块定义与数据结构
> - TetrisBoard.ts - 游戏场地与碰撞检测
> - TetrisController.ts - 玩家控制逻辑
> - TetrisSpawner.ts - 方块生成器
> - TetrisScoring.ts - 计分系统
> - GhostPiece.ts - 落点预览
> - NextPreview.ts - Next预览UI
> - HoldSystem.ts - Hold暂存系统
> 
> **Estimated Effort**: Large (Day 4-7)
> **Parallel Execution**: YES - 4 waves
> **Critical Path**: 方块定义 → 场地系统 → 控制器 → 集成

---

## Context

### Original Request
Phase 2 核心玩法开发 - 俄罗斯方块模块实现。

### 需求要点（来自需求文档）

#### 7种标准方块
| 方块 | 颜色 | 形状 |
|------|------|------|
| I | `#00ffff` 青色 | ████ |
| O | `#ffff00` 黄色 | ████ |
| T | `#ff00ff` 紫色 |  ███ / █ |
| S | `#00ff88` 绿色 |  ████ / ██ |
| Z | `#ff4444` 红色 | ████ / ██ |
| J | `#4488ff` 蓝色 | ██ / ███ |
| L | `#ff8800` 橙色 | ██ / ███ |

#### 操作方式
| 操作 | 触控 | 说明 |
|------|------|------|
| 左移 | 点击左区 | 向左移动一格 |
| 右移 | 点击右区 | 向右移动一格 |
| 旋转 | 点击中区 | 顺时针旋转 |
| 软降 | 下滑 | 加速下落 |
| 硬降 | 快速下滑 | 瞬间落底 |
| Hold | 双击 | 暂存当前方块 |

#### 计分规则
| 消除行数 | 基础分 | T-Spin加成 |
|----------|--------|------------|
| 1行 | 100 × 等级 | T-Spin: 800 × 等级 |
| 2行 | 300 × 等级 | T-Spin Double: 1200 × 等级 |
| 3行 | 500 × 等级 | T-Spin Triple: 1600 × 等级 |
| 4行 | 800 × 等级 | - |

#### 等级系统
- 升级机制：时间驱动，每60秒自动升级1级
- 等级影响：方块下落速度提升
- 最高等级：15级

---

## Work Objectives

### Core Objective
实现完整的俄罗斯方块游戏模块，可作为独立组件运行，为后续与弹球模块集成做准备。

### Concrete Deliverables
- `assets/scripts/tetris/TetrisBlock.ts` - 方块定义
- `assets/scripts/tetris/TetrisBoard.ts` - 场地系统
- `assets/scripts/tetris/TetrisController.ts` - 控制器
- `assets/scripts/tetris/TetrisSpawner.ts` - 生成器
- `assets/scripts/tetris/TetrisScoring.ts` - 计分
- `assets/scripts/tetris/GhostPiece.ts` - Ghost预览
- `assets/scripts/tetris/NextPreview.ts` - Next预览
- `assets/scripts/tetris/HoldSystem.ts` - Hold系统
- `assets/scripts/tetris/TetrisManager.ts` - 总管理器

### Definition of Done
- [ ] 所有方块正确渲染
- [ ] SRS旋转系统工作正常
- [ ] 碰撞检测准确
- [ ] 行消除逻辑正确
- [ ] Hold/Next/Ghost功能正常
- [ ] T-Spin检测正确
- [ ] 计分系统准确

### Must Have
- 7种标准方块（I/O/T/S/Z/J/L）
- SRS旋转系统（包含wall kick）
- 碰撞检测
- 行消除
- Hold系统
- Next预览（3个）
- Ghost Piece
- 计分系统

### Must NOT Have (Guardrails)
- 不引入物理引擎（使用自定义碰撞检测）
- 不依赖弹球模块
- 不实现特殊方块（钻石、炸弹、彩虹）- 留到后续版本

---

## Verification Strategy

### Test Decision
- **Infrastructure exists**: NO
- **Automated tests**: NO（游戏模块，使用运行时验证）
- **Framework**: 无
- **Agent-Executed QA**: Cocos Creator 预览验证

### QA Policy
每个任务包含运行时验证场景。

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately — 数据定义):
├── Task 1: TetrisTypes.ts - 类型定义 [quick]
├── Task 2: TetrisBlock.ts - 方块定义 [unspecified-high]
├── Task 3: TetrisConfig.ts - 配置常量 [quick]
└── Task 4: TetrisSpawner.ts - 方块生成器 [unspecified-high]

Wave 2 (After Wave 1 — 核心系统):
├── Task 5: TetrisBoard.ts - 场地系统 [deep]
├── Task 6: TetrisController.ts - 控制器 [unspecified-high]
├── Task 7: TetrisScoring.ts - 计分系统 [unspecified-high]
└── Task 8: TSpinDetector.ts - T-Spin检测 [unspecified-high]

Wave 3 (After Wave 2 — 辅助系统):
├── Task 9: GhostPiece.ts - 落点预览 [quick]
├── Task 10: NextPreview.ts - Next预览 [quick]
├── Task 11: HoldSystem.ts - Hold系统 [quick]
└── Task 12: LevelManager.ts - 等级管理 [quick]

Wave 4 (After Wave 3 — 集成):
├── Task 13: TetrisManager.ts - 总管理器 [deep]
├── Task 14: TetrisView.ts - 渲染组件 [visual-engineering]
└── Task 15: 集成测试 [unspecified-high]

Critical Path: Task 1-4 → Task 5-8 → Task 9-12 → Task 13-15
Parallel Speedup: ~60% faster than sequential
Max Concurrent: 4 (Wave 1)
```

---

## TODOs

- [ ] 1. TetrisTypes.ts - 类型定义

  **What to do**:
  - 定义 `BlockType` 枚举（I/O/T/S/Z/J/L）
  - 定义 `RotationState` 枚举（0/90/180/270）
  - 定义 `Position` 接口（x, y）
  - 定义 `BlockShape` 类型（4x4矩阵）
  - 定义 `Tetromino` 接口

  **References**:
  - 需求文档.md: 1.2 俄罗斯方块玩家 - 方块类型

  **Acceptance Criteria**:
  - [ ] 所有类型正确导出
  - [ ] TypeScript 编译无错误

- [ ] 2. TetrisBlock.ts - 方块定义

  **What to do**:
  - 实现7种方块的形状定义
  - 实现旋转矩阵（SRS标准）
  - 实现wall kick数据

  **References**:
  - Tetris Guideline SRS标准

  **Acceptance Criteria**:
  - [ ] 7种方块形状正确
  - [ ] 4种旋转状态正确
  - [ ] Wall kick数据完整

- [ ] 3. TetrisConfig.ts - 配置常量

  **What to do**:
  - 场地尺寸（10列 × 20行 + 4行缓冲）
  - 下落速度表（1-15级）
  - 计分规则表
  - 颜色配置

  **Acceptance Criteria**:
  - [ ] 场地尺寸正确
  - [ ] 速度表完整（15级）

- [ ] 4. TetrisSpawner.ts - 方块生成器

  **What to do**:
  - 实现7-bag随机算法
  - 实现Next队列（3个预览）
  - 实现方块生成逻辑

  **Acceptance Criteria**:
  - [ ] 7-bag算法正确
  - [ ] Next预览正确显示

- [ ] 5. TetrisBoard.ts - 场地系统

  **What to do**:
  - 实现场地数据结构（10x24网格）
  - 实现碰撞检测
  - 实现行消除逻辑
  - 实现方块锁定

  **Acceptance Criteria**:
  - [ ] 碰撞检测准确
  - [ ] 行消除正确
  - [ ] 方块锁定正确

- [ ] 6. TetrisController.ts - 控制器

  **What to do**:
  - 实现移动控制（左/右）
  - 实现旋转控制（SRS wall kick）
  - 实现软降/硬降
  - 实现DAS（延迟自动移位）

  **Acceptance Criteria**:
  - [ ] 移动响应灵敏
  - [ ] 旋转wall kick正确
  - [ ] DAS工作正常

- [ ] 7. TetrisScoring.ts - 计分系统

  **What to do**:
  - 实现基础计分
  - 实现T-Spin加成
  - 实现Back-to-Back加成
  - 实现Perfect Clear奖励

  **References**:
  - 需求文档.md: 1.2 计分规则

  **Acceptance Criteria**:
  - [ ] 计分准确
  - [ ] 加成正确计算

- [ ] 8. TSpinDetector.ts - T-Spin检测

  **What to do**:
  - 实现LSRP检测规则
  - 检测T方块旋转后4角占据情况
  - 返回T-Spin类型

  **References**:
  - Tetris Guideline LSRP规则

  **Acceptance Criteria**:
  - [ ] T-Spin检测正确
  - [ ] T-Spin Mini检测正确

- [ ] 9. GhostPiece.ts - 落点预览

  **What to do**:
  - 计算方块最终落点
  - 渲染半透明预览

  **Acceptance Criteria**:
  - [ ] Ghost位置准确
  - [ ] 视觉效果清晰

- [ ] 10. NextPreview.ts - Next预览

  **What to do**:
  - 显示接下来3个方块
  - 更新Next队列

  **Acceptance Criteria**:
  - [ ] 显示3个方块
  - [ ] 更新正确

- [ ] 11. HoldSystem.ts - Hold系统

  **What to do**:
  - 实现Hold暂存
  - 限制每回合只能Hold一次

  **Acceptance Criteria**:
  - [ ] Hold功能正常
  - [ ] 使用限制正确

- [ ] 12. LevelManager.ts - 等级管理

  **What to do**:
  - 实现时间驱动升级（每60秒）
  - 更新下落速度
  - 最高15级限制

  **References**:
  - 需求文档.md: 等级系统

  **Acceptance Criteria**:
  - [ ] 60秒升级正确
  - [ ] 速度变化正确

- [ ] 13. TetrisManager.ts - 总管理器

  **What to do**:
  - 整合所有子系统
  - 实现游戏循环
  - 处理事件通信

  **Acceptance Criteria**:
  - [ ] 所有系统集成正确
  - [ ] 游戏循环正常

- [ ] 14. TetrisView.ts - 渲染组件

  **What to do**:
  - 实现场地渲染
  - 实现方块渲染
  - 实现消除动画

  **Acceptance Criteria**:
  - [ ] 渲染正确
  - [ ] 动画流畅

- [ ] 15. 集成测试

  **What to do**:
  - 在Game.scene中测试完整功能
  - 验证所有功能正常

  **Acceptance Criteria**:
  - [ ] 方块生成正确
  - [ ] 控制响应正常
  - [ ] 消除计分正确

---

## Final Verification Wave

- [ ] F1. 模块编译验证
- [ ] F2. 运行时功能验证
- [ ] F3. 文档更新

---

## Commit Strategy

- **1-4**: `feat(tetris): 添加方块定义和生成系统`
- **5-8**: `feat(tetris): 添加场地系统和控制`
- **9-12**: `feat(tetris): 添加辅助系统`
- **13-15**: `feat(tetris): 集成并完成模块`

---

## Success Criteria

### Verification Commands
```bash
# 检查文件结构
ls -la game/block-vs-block/assets/scripts/tetris/

# TypeScript 编译检查
# (在 Cocos Creator 中编译)
```

### Final Checklist
- [ ] 所有文件创建完成
- [ ] TypeScript 编译无错误
- [ ] 方块正确显示和操作
- [ ] 消除和计分正确