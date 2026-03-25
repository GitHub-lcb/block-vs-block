# Phase 1 Remaining Tasks Implementation Code

This file contains the implementation for Tasks 6-7 that need to be written to the project.

---

## Task 6: Scene Files

### Note on Cocos Creator Scenes

Cocos Creator `.scene` files are complex JSON structures. The recommended approach is:
1. Create the scene files through the Cocos Creator Editor
2. Or create minimal placeholder scenes that can be opened and edited in the editor

Below are minimal scene file structures that Cocos Creator 3.8 can open.

### 6.1 MainMenu.scene

**Target File:** `game/block-vs-block/assets/scenes/MainMenu.scene`

```json
[
  {
    "__type__": "cc.SceneAsset",
    "_name": "MainMenu",
    "_objFlags": 0,
    "_native": "",
    "scene": {
      "__id__": 1
    }
  },
  {
    "__type__": "cc.Scene",
    "_name": "MainMenu",
    "_objFlags": 0,
    "_parent": null,
    "_children": [
      {
        "__id__": 2
      }
    ],
    "_active": true,
    "_components": [],
    "_prefab": null,
    "autoReleaseAssets": false,
    "_globals": {
      "__id__": 7
    }
  },
  {
    "__type__": "cc.Node",
    "_name": "Canvas",
    "_objFlags": 0,
    "_parent": {
      "__id__": 1
    },
    "_children": [
      {
        "__id__": 3
      },
      {
        "__id__": 4
      },
      {
        "__id__": 5
      }
    ],
    "_active": true,
    "_components": [
      {
        "__id__": 6
      }
    ],
    "_prefab": null,
    "_lpos": {
      "__type__": "cc.Vec3",
      "x": 480,
      "y": 320,
      "z": 0
    },
    "_lrot": {
      "__type__": "cc.Quat",
      "x": 0,
      "y": 0,
      "z": 0,
      "w": 1
    },
    "_lscale": {
      "__type__": "cc.Vec3",
      "x": 1,
      "y": 1,
      "z": 1
    },
    "_layer": 33554432,
    "_euler": {
      "__type__": "cc.Vec3",
      "x": 0,
      "y": 0,
      "z": 0
    }
  },
  {
    "__type__": "cc.Node",
    "_name": "Camera",
    "_objFlags": 0,
    "_parent": {
      "__id__": 2
    },
    "_children": [],
    "_active": true,
    "_components": [],
    "_prefab": null,
    "_lpos": {
      "__type__": "cc.Vec3",
      "x": 0,
      "y": 0,
      "z": 1000
    },
    "_lrot": {
      "__type__": "cc.Quat",
      "x": 0,
      "y": 0,
      "z": 0,
      "w": 1
    },
    "_lscale": {
      "__type__": "cc.Vec3",
      "x": 1,
      "y": 1,
      "z": 1
    },
    "_layer": 1073741824,
    "_euler": {
      "__type__": "cc.Vec3",
      "x": 0,
      "y": 0,
      "z": 0
    }
  },
  {
    "__type__": "cc.Node",
    "_name": "Title",
    "_objFlags": 0,
    "_parent": {
      "__id__": 2
    },
    "_children": [],
    "_active": true,
    "_components": [],
    "_prefab": null,
    "_lpos": {
      "__type__": "cc.Vec3",
      "x": 0,
      "y": 100,
      "z": 0
    },
    "_lrot": {
      "__type__": "cc.Quat",
      "x": 0,
      "y": 0,
      "z": 0,
      "w": 1
    },
    "_lscale": {
      "__type__": "cc.Vec3",
      "x": 1,
      "y": 1,
      "z": 1
    },
    "_layer": 33554432,
    "_euler": {
      "__type__": "cc.Vec3",
      "x": 0,
      "y": 0,
      "z": 0
    }
  },
  {
    "__type__": "cc.Node",
    "_name": "StartButton",
    "_objFlags": 0,
    "_parent": {
      "__id__": 2
    },
    "_children": [],
    "_active": true,
    "_components": [],
    "_prefab": null,
    "_lpos": {
      "__type__": "cc.Vec3",
      "x": 0,
      "y": -50,
      "z": 0
    },
    "_lrot": {
      "__type__": "cc.Quat",
      "x": 0,
      "y": 0,
      "z": 0,
      "w": 1
    },
    "_lscale": {
      "__type__": "cc.Vec3",
      "x": 1,
      "y": 1,
      "z": 1
    },
    "_layer": 33554432,
    "_euler": {
      "__type__": "cc.Vec3",
      "x": 0,
      "y": 0,
      "z": 0
    }
  },
  {
    "__type__": "cc.Node",
    "_name": "Version",
    "_objFlags": 0,
    "_parent": {
      "__id__": 2
    },
    "_children": [],
    "_active": true,
    "_components": [],
    "_prefab": null,
    "_lpos": {
      "__type__": "cc.Vec3",
      "x": 0,
      "y": -280,
      "z": 0
    },
    "_lrot": {
      "__type__": "cc.Quat",
      "x": 0,
      "y": 0,
      "z": 0,
      "w": 1
    },
    "_lscale": {
      "__type__": "cc.Vec3",
      "x": 1,
      "y": 1,
      "z": 1
    },
    "_layer": 33554432,
    "_euler": {
      "__type__": "cc.Vec3",
      "x": 0,
      "y": 0,
      "z": 0
    }
  },
  {
    "__type__": "cc.UITransform",
    "_name": "",
    "_objFlags": 0,
    "node": {
      "__id__": 2
    },
    "_enabled": true,
    "_contentSize": {
      "__type__": "cc.Size",
      "width": 960,
      "height": 640
    },
    "_anchorPoint": {
      "__type__": "cc.Vec2",
      "x": 0.5,
      "y": 0.5
    }
  },
  {
    "__type__": "cc.SceneGlobals",
    "ambient": {
      "__id__": 8
    },
    "shadows": {
      "__id__": 9
    },
    "_skybox": {
      "__id__": 10
    },
    "fog": {
      "__id__": 11
    }
  },
  {
    "__type__": "cc.AmbientInfo",
    "_skyColorHDR": {
      "__type__": "cc.Vec4",
      "x": 0.2,
      "y": 0.5,
      "z": 0.8,
      "w": 0.52
    },
    "_skyColor": {
      "__type__": "cc.Vec4",
      "x": 0.2,
      "y": 0.5,
      "z": 0.8,
      "w": 0.52
    },
    "_skyIllumHDR": 20000,
    "_skyIllum": 20000,
    "_groundAlbedoHDR": {
      "__type__": "cc.Vec4",
      "x": 0.2,
      "y": 0.2,
      "z": 0.2,
      "w": 1
    },
    "_groundAlbedo": {
      "__type__": "cc.Vec4",
      "x": 0.2,
      "y": 0.2,
      "z": 0.2,
      "w": 1
    }
  },
  {
    "__type__": "cc.ShadowsInfo",
    "_enabled": false,
    "_type": 0,
    "_normal": {
      "__type__": "cc.Vec3",
      "x": 0,
      "y": 1,
      "z": 0
    },
    "_distance": 0,
    "_shadowColor": {
      "__type__": "cc.Color",
      "r": 76,
      "g": 76,
      "b": 76,
      "a": 255
    },
    "_maxReceived": 4,
    "_size": {
      "__type__": "cc.Vec2",
      "x": 512,
      "y": 512
    }
  },
  {
    "__type__": "cc.SkyboxInfo",
    "_envmapHDR": null,
    "_envmap": null,
    "_enabled": false,
    "_useHDR": false
  },
  {
    "__type__": "cc.FogInfo",
    "_type": 0,
    "_fogColor": {
      "__type__": "cc.Color",
      "r": 200,
      "g": 200,
      "b": 200,
      "a": 255
    },
    "_enabled": false,
    "_fogDensity": 0.3,
    "_fogStart": 0.5,
    "_fogEnd": 300,
    "_fogAtten": 5,
    "_fogTop": 1.5,
    "_fogRange": 1.2
  }
]
```

### 6.2 Game.scene

**Target File:** `game/block-vs-block/assets/scenes/Game.scene`

Similar structure to MainMenu.scene but with game-specific nodes (GameField, P1Score, P2Score, Timer, etc.)

### 6.3 Result.scene

**Target File:** `game/block-vs-block/assets/scenes/Result.scene`

Similar structure with result-specific nodes (ResultTitle, ScorePanel, ReplayButton, MenuButton)

---

## Task 7: WeChat Mini-game Configuration

### 7.1 Create Directory

Create: `game/block-vs-block/build-templates/wechat-game/`

### 7.2 game.json

**Target File:** `game/block-vs-block/build-templates/wechat-game/game.json`

```json
{
  "deviceOrientation": "portrait",
  "showStatusBar": false,
  "networkTimeout": {
    "request": 10000,
    "connectSocket": 10000,
    "uploadFile": 10000,
    "downloadFile": 10000
  },
  "subpackages": [],
  "workers": ""
}
```

### 7.3 project.config.json

**Target File:** `game/block-vs-block/build-templates/wechat-game/project.config.json`

```json
{
  "miniprogramRoot": "./",
  "setting": {
    "es6": true,
    "postcss": true,
    "minified": true,
    "newFeature": true
  },
  "compileType": "game",
  "appid": "touristappid",
  "projectname": "block-vs-block",
  "description": "方块战方块 - 双人对战微信小游戏",
  "simulatorType": "wechat",
  "simulatorPluginLibVersion": {},
  "condition": {}
}
```

---

## Meta Files for Scenes

Each `.scene` file needs a `.scene.meta` file. Example:

**Target File:** `game/block-vs-block/assets/scenes/MainMenu.scene.meta`

```json
{
  "ver": "1.1.50",
  "importer": "scene",
  "imported": true,
  "uuid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "files": [
    ".json"
  ],
  "subMetas": {},
  "userData": {}
}
```

---

## Summary of Files to Create

| File | Path |
|------|------|
| MainMenu.scene | `game/block-vs-block/assets/scenes/MainMenu.scene` |
| MainMenu.scene.meta | `game/block-vs-block/assets/scenes/MainMenu.scene.meta` |
| Game.scene | `game/block-vs-block/assets/scenes/Game.scene` |
| Game.scene.meta | `game/block-vs-block/assets/scenes/Game.scene.meta` |
| Result.scene | `game/block-vs-block/assets/scenes/Result.scene` |
| Result.scene.meta | `game/block-vs-block/assets/scenes/Result.scene.meta` |
| game.json | `game/block-vs-block/build-templates/wechat-game/game.json` |
| project.config.json | `game/block-vs-block/build-templates/wechat-game/project.config.json` |

---

## Alternative: Create Scenes in Cocos Creator Editor

Since `.scene` files are complex, the recommended approach is:

1. Open Cocos Creator
2. Right-click `assets/scenes/` folder
3. Create → Scene
4. Name it "MainMenu"
5. Add UI nodes through the editor
6. Repeat for "Game" and "Result" scenes

This is the standard workflow and ensures proper scene format.