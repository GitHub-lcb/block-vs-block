# 方块战方块

双人实时对战微信小游戏，融合俄罗斯方块和弹球两种经典游戏模式。

## 核心玩法

- **共享场地对战**：双方在同一个游戏场地内实时对抗
- **角色互换**：每30秒强制切换，策略规划与临场反应并存
- **节奏切换**：每个回合独立，分数累计

## 文档

- [需求文档](需求文档.md) - 完整的游戏设计和开发计划

## 项目结构

```
game/block-vs-block/
├── assets/
│   ├── scenes/           # 场景文件
│   │   ├── MainMenu.scene
│   │   ├── Game.scene
│   │   └── Result.scene
│   └── scripts/
│       └── core/         # 核心模块
│           ├── GameStateManager.ts
│           ├── EventBus.ts
│           └── AudioManager.ts
└── build-templates/
    └── wechat-game/      # 微信小游戏配置
        ├── game.json
        └── project.config.json
```

## 开发进度

- [x] 需求验证与用户调研
- [x] 项目初始化 ✅ 2026-03-25
- [ ] 核心玩法开发
- [ ] 微信小游戏适配
- [ ] 测试与上线

## 版本

当前版本: 0.0.1.0 (开发阶段)

## 技术栈

- **游戏引擎**: Cocos Creator 3.8+
- **开发语言**: TypeScript
- **目标平台**: 微信小游戏