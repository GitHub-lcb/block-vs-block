# 开发计划：Phase 4 - 共享场地与角色互换

## TL;DR

> **Quick Summary**: 实现共享场地系统和30秒角色互换机制，整合俄罗斯方块和弹球模块。
> 
> **Deliverables**:
> - SharedField.ts - 共享场地管理
> - RoleSwapManager.ts - 角色互换管理器
> - GameTimer.ts - 游戏计时器
> - SwapWarning.ts - 互换警告UI
> - GameFlowManager.ts - 游戏流程管理
> 
> **Estimated Effort**: Medium (Day 12-14)
> **Parallel Execution**: YES - 3 waves

---

## Context

### 需求要点（来自需求文档）

#### 角色互换规则
```
30秒游戏回合:
├── 0-25秒: 正常游戏
├── 25-30秒: 闪烁提示警告
├── 30秒: 互换动画 (0.5秒)
└── 新回合: 角色切换
```

#### 互换时状态处理
**场地重置**:
- 场地内所有砖块和堆叠 → 清空
- 当前下落的方块 → 消失，重新生成新方块
- 球的位置 → 重置到挡板上方

**状态归零**:
- 连击数 → 归零
- 道具效果 → 清除

**保留状态**:
- 双方得分 → 保留
- 剩余球数 → 保留
- 道具库存 → 保留

#### 游戏时长
- 每局 **3分钟**
- 共 **6个回合**（每回合30秒）

---

## Work Objectives

### Core Objective
实现共享场地和角色互换机制，让俄罗斯方块和弹球模块可以协同工作。

### Concrete Deliverables
- `assets/scripts/shared/SharedField.ts` - 共享场地
- `assets/scripts/shared/RoleSwapManager.ts` - 互换管理
- `assets/scripts/shared/GameTimer.ts` - 游戏计时
- `assets/scripts/shared/GameFlowManager.ts` - 流程管理
- `assets/scripts/shared/index.ts` - 导出

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately — 计时与警告):
├── Task 1: GameTimer.ts - 游戏计时器 [quick]
└── Task 2: SwapWarning.ts - 互换警告 [quick]

Wave 2 (After Wave 1 — 核心系统):
├── Task 3: SharedField.ts - 共享场地 [deep]
└── Task 4: RoleSwapManager.ts - 角色互换 [deep]

Wave 3 (After Wave 2 — 集成):
├── Task 5: GameFlowManager.ts - 游戏流程 [deep]
└── Task 6: index.ts - 导出 [quick]
```

---

## TODOs

- [ ] 1. GameTimer.ts - 游戏计时器
- [ ] 2. SwapWarning.ts - 互换警告
- [ ] 3. SharedField.ts - 共享场地
- [ ] 4. RoleSwapManager.ts - 角色互换
- [ ] 5. GameFlowManager.ts - 游戏流程
- [ ] 6. index.ts - 导出

---

## Success Criteria

### Final Checklist
- [ ] 30秒互换计时正确
- [ ] 场地重置正常
- [ ] 状态保留正确
- [ ] 警告提示正常