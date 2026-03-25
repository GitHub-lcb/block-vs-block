# 开发计划：第一阶段 - 项目初始化

## TL;DR

> **Quick Summary**: 初始化 Cocos Creator 项目，搭建基础架构，实现核心游戏管理系统。
> 
> **Deliverables**:
> - Cocos Creator 项目结构
> - 游戏状态管理器
> - 事件总线系统
> - 音频管理器
> - 微信小游戏配置
> 
> **Estimated Effort**: Medium (Day 1-3)
> **Parallel Execution**: YES - 4 waves
> **Critical Path**: 项目创建 → 目录结构 → 核心模块 → 配置

---

## Context

### Original Request
用户准备开始开发「方块战方块」微信小游戏。已完成需求文档评审（CEO + 工程 + 设计），现在需要初始化项目并搭建基础架构。

### Interview Summary
**Key Discussions**:
- 开发引擎：Cocos Creator 3.8+
- 目标平台：微信小游戏
- 用户已安装 Cocos Creator

**Research Findings**:
- 项目使用 TypeScript 开发
- 需要实现核心管理系统：GameStateManager、EventBus、AudioManager
- 需要支持微信小游戏适配

---

## Work Objectives

### Core Objective
创建 Cocos Creator 项目，搭建完整的项目结构和核心管理系统。

### Concrete Deliverables
- `assets/scripts/core/GameStateManager.ts` - 游戏状态管理
- `assets/scripts/core/EventBus.ts` - 事件总线
- `assets/scripts/core/AudioManager.ts` - 音频管理
- `project.json` - Cocos Creator 项目配置
- 微信小游戏构建配置

### Definition of Done
- [ ] Cocos Creator 项目可正常打开
- [ ] 项目目录结构符合规划
- [ ] 核心模块编译无错误
- [ ] 可在微信开发者工具中预览

### Must Have
- Cocos Creator 3.8+ 兼容
- TypeScript 支持
- 微信小游戏适配

### Must NOT Have (Guardrails)
- 不使用过时的 Cocos Creator 2.x API
- 不引入不必要的第三方依赖

---

## Verification Strategy

### Test Decision
- **Infrastructure exists**: NO (新项目)
- **Automated tests**: NO (项目初始化阶段)
- **Framework**: 无
- **Agent-Executed QA**: 使用 Cocos Creator 预览和微信开发者工具验证

### QA Policy
每个任务包含 Agent-Executed QA 场景，验证构建和运行状态。

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately — 项目创建与目录结构):
├── Task 1: 创建 Cocos Creator 项目 [quick]
├── Task 2: 搭建项目目录结构 [quick]
├── Task 3: 配置 TypeScript [quick]
└── Task 4: 配置微信小游戏构建 [quick]

Wave 2 (After Wave 1 — 核心模块):
├── Task 5: 实现 GameStateManager [unspecified-high]
├── Task 6: 实现 EventBus [unspecified-high]
└── Task 7: 实现 AudioManager [unspecified-high]

Wave 3 (After Wave 2 — 配置文件):
├── Task 8: 创建场景文件 [quick]
├── Task 9: 创建预制体目录结构 [quick]
└── Task 10: 配置资源目录 [quick]

Wave FINAL (After ALL tasks — 验证):
├── Task F1: 项目编译验证
├── Task F2: 微信小游戏预览验证
└── Task F3: 文档更新

Critical Path: Task 1 → Task 2 → Task 5-7 → Task F1-F3
Parallel Speedup: ~50% faster than sequential
Max Concurrent: 4 (Wave 1)
```

---

## TODOs

- [ ] 1. 创建 Cocos Creator 项目

  **What to do**:
  - 在 Cocos Creator 中创建新的空项目
  - 项目名称：block-vs-block
  - 选择 TypeScript 模板

  **Must NOT do**:
  - 不要选择 2D/3D 游戏模板（使用空项目）
  - 不要使用旧版 Cocos Creator 2.x

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2, 3, 4)
  - **Blocks**: Tasks 5-7
  - **Blocked By**: None

  **Acceptance Criteria**:
  - [ ] 项目可在 Cocos Creator 中打开
  - [ ] 无编译错误

  **QA Scenarios**:
  ```
  Scenario: 项目创建成功
    Tool: Bash
    Steps:
      1. 检查项目根目录存在 project.json
      2. 检查 assets 目录存在
    Expected Result: 两个文件/目录都存在
    Evidence: .sisyphus/evidence/task-1-project-created.txt
  ```

- [ ] 2. 搭建项目目录结构

  **What to do**:
  - 创建 `assets/scripts/core/` 目录
  - 创建 `assets/scripts/tetris/` 目录
  - 创建 `assets/scripts/breakout/` 目录
  - 创建 `assets/scripts/shared/` 目录
  - 创建 `assets/scripts/ui/` 目录
  - 创建 `assets/scenes/` 目录
  - 创建 `assets/prefabs/` 目录
  - 创建 `assets/resources/` 目录

  **Must NOT do**:
  - 不要在 assets 外创建源代码目录

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: Tasks 5-7
  - **Blocked By**: Task 1

  **Acceptance Criteria**:
  - [ ] 所有目录创建完成
  - [ ] 目录结构符合需求文档定义

  **QA Scenarios**:
  ```
  Scenario: 目录结构正确
    Tool: Bash
    Steps:
      1. 列出 assets 下所有子目录
      2. 验证 scripts, scenes, prefabs, resources 目录存在
    Expected Result: 所有目录存在
    Evidence: .sisyphus/evidence/task-2-directories.txt
  ```

- [ ] 3. 实现 GameStateManager

  **What to do**:
  - 创建 `assets/scripts/core/GameStateManager.ts`
  - 实现游戏状态枚举：MENU, PLAYING, PAUSED, GAME_OVER
  - 实现状态切换方法
  - 实现状态监听器注册

  **Must NOT do**:
  - 不要引入外部状态管理库
  - 不要使用单例模式以外的设计

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 6, 7)
  - **Blocks**: Wave 3
  - **Blocked By**: Tasks 1, 2

  **References**:
  - 需求文档.md: 第二部分界面设计 - 游戏状态定义

  **Acceptance Criteria**:
  - [ ] GameStateManager.ts 文件创建
  - [ ] 支持 7 种游戏状态
  - [ ] 支持状态监听器

  **QA Scenarios**:
  ```
  Scenario: 状态管理器工作正常
    Tool: Bash
    Steps:
      1. 检查文件存在
      2. 检查 TypeScript 编译无错误
    Expected Result: 编译成功
    Evidence: .sisyphus/evidence/task-5-state-manager.txt
  ```

- [ ] 4. 实现 EventBus

  **What to do**:
  - 创建 `assets/scripts/core/EventBus.ts`
  - 实现事件订阅/发布机制
  - 定义游戏事件类型

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2
  - **Blocked By**: Tasks 1, 2

- [ ] 5. 实现 AudioManager

  **What to do**:
  - 创建 `assets/scripts/core/AudioManager.ts`
  - 实现 BGM 播放控制
  - 实现音效播放
  - 实现音量控制

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2
  - **Blocked By**: Tasks 1, 2

- [ ] 6. 创建场景文件

  **What to do**:
  - 创建 MainMenu.scene
  - 创建 Game.scene
  - 创建 Result.scene

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3
  - **Blocked By**: Wave 2

- [ ] 7. 配置微信小游戏

  **What to do**:
  - 配置构建发布设置
  - 设置 AppID 占位符
  - 配置小游戏权限

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocked By**: Task 1

---

## Final Verification Wave

- [ ] F1. 项目编译验证
  - 运行 TypeScript 编译
  - 检查无错误

- [ ] F2. 微信小游戏预览验证
  - 构建微信小游戏
  - 在开发者工具中预览

- [ ] F3. 文档更新
  - 更新 README.md
  - 创建 DEVELOPMENT.md

---

## Commit Strategy

- **1**: `chore: 初始化 Cocos Creator 项目`
- **2**: `chore: 搭建项目目录结构`
- **3-5**: `feat: 实现核心管理模块`
- **Final**: `chore: 完成第一阶段初始化`

---

## Success Criteria

### Verification Commands
```bash
# 检查项目结构
ls -la assets/scripts/core/

# 检查 TypeScript 编译
# (在 Cocos Creator 中编译)
```

### Final Checklist
- [ ] 项目可在 Cocos Creator 中正常打开
- [ ] 核心模块编译无错误
- [ ] 可构建微信小游戏
- [ ] 目录结构符合需求文档