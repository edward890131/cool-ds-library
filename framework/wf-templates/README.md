# wf-templates/ — Wireframe 版型模板

> 狀態：**佔位、待匯入**（團隊已有多個 WF 模板，待整理進來）

## 是什麼

可重用的「頁面版型」—— Path CC 的彈藥。團隊現有的 WF 模板放這裡，
變成跨專案可套用的資產。

## 與「專案 WF」的區別（重要）

| | wf-templates/（這裡） | 專案的 inputs/wireframe/ |
|---|---|---|
| 性質 | 可重用模板 | 某專案的實際 WF |
| 屬於 | 框架（唯讀） | 專案輸入 |
| 例 | `landing-standard` / `about-standard` | acme-cafe 的首頁實際 wireframe |

專案的 WF 可以「從 wf-template 實例化」，也可以全新畫（走 Path CD 的重點頁）。

## 與 path 的關係

- 頁面有對應 wf-template → 宣告 `path: cc`（套模板、CC compile，便宜）
- 頁面要 high-fi 客製、無模板 → 宣告 `path: cd`（CD 設計，貴）

見 `_project-template/pages/*.page.yaml` 的兩種範例。

## 怎麼長出來

同 sections：CD 客製頁的新版型，透過 Gate 4 反向 audit harvest 回這裡。
