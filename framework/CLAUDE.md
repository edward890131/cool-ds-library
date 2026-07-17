# DS Framework — Claude Code 作業規則

這是 goonsdesign 的跨專案 Design System 框架（L0–L4 + production + themes + sections + wf-templates）。
**任何 Claude Code session 進到這個資料夾，先讀完本檔再動作。**

---

## 鐵則 1：這個 repo 是唯讀框架(**write rule**,不是 read rule)

建專案時，所有產出寫到「**專案資料夾**」——在 Goons DS Studio 內是 repo 根的 `projects/<名稱>/`（**不是** `framework/` 內、也不在 repo 外）；永遠不要改 `framework/` 這裡的檔案。

> ⚠ studio 校準（2026-07-17）：本層是 ds-studio 的內嵌治理層，專案產出改放 repo 根 `projects/`。studio 專屬規則以**根目錄 `CLAUDE.md`** 為準、優先於本檔。

要改框架本身 = 一個**刻意動作**：改完 bump `VERSION`、commit。不是隨手改。

> 💡 **這條只規範「寫入」、不規範「讀取」**:
> - **讀**(L0/L4 schema、theme base、SKILL.md、CLAUDE.md)= 允許 + 必要,跑 skill 一定要讀
> - **寫**(改 repo 內任何檔)= 禁止,除非升 framework 版本的刻意動作
>
> 若 user session 內額外加「只用某資料夾」的規則:那是 read 規則,跟本條無衝突(本條是 write、那條是 read)。CC 不應混淆這兩層。

## 鐵則 2：可變 / 不可變，看「位置」，不靠記憶

| 區 | 內容 | 誰能改 |
|---|---|---|
| 🔒 框架（本 repo） | L0–L4 schema 欄位、L2 semantic **名稱**、`production/figma-rules`、元件清單 | goonsdesign（設計面 base） |
| 🎨 theme | L1/L2 的「**值**」（`themes/*.theme.yaml`） | base = goonsdesign 維護；project = 該專案**設計師**在 `theme.delta.yaml` override |
| 🔧 code-rules | `production/code-rules.yaml`（base）+ `project/code-rules.delta.yaml`（delta） | base = **FE 團隊**；delta = **FE 團隊**（設計師不碰） |
| 🌉 mapping | `production/mapping.yaml`（Figma↔Code 命名橋樑） | FE 主導、設計師確認命名對應 |
| 🧩 project（repo 外） | scope 選用、專案專屬元件、頁面、content、seed | 該專案成員 |

你不用記「button 的 variants 能不能改」—— 看它在哪一區就知道。

**設計師絕對不該改 `production/code-rules.*` 任何一處** —— 那是 FE 的領域。skill Phase 0 Q2 走 layered resolution（framework base + project delta），遇到模糊**找 FE 不找設計師**。

## 鐵則 3：設計師在 Figma / CD 改完、要你比較差異時，把改動分四類、各自歸位

- **token 值變動**（顏色 / 圓角 / 間距…）→ 寫進「專案的 `theme.delta.yaml`」
- **結構變動**（新元件 / 新 variant / 新 section）→ 寫進「專案的 `extensions/`」，並標 `upstream-候選`
- **內容變動**（文案 / 圖片）→ 留在「專案的 `content/`」
- **互動原型 / mock data**（vibe coding 產出的假資料）→ 寫進「專案的 `seed/`」獨立 JSON、給 FE 接

**不要自己決定要不要寫回框架** —— 那是 goonsdesign 人工審核（看各專案 `extensions/` 挑、發新版本）。

## 鐵則 5：CD 跟 spec 衝突時的優先序

當 CD 生成的視覺、跟 spec(框架 + theme + L0/L4)發生衝突:
- **視覺** → **Figma 為主**(Figma 是視覺 SSOT、不是 CD)
- **結構與行為**(token 名稱、元件 prop、archetype required-states 等)→ **spec 為主**
- **無法判斷的衝突** → 回報設計師仲裁,不自己決定

註:CD 是設計生成工具,不是視覺 canonical 來源。canonical 視覺住 Figma、結構紀錄住 spec yaml。

## 鐵則 4：跑完整設計流程時，用 skill，不要自己即興

要從頭跑「讀 input → CD / CC 建 DS → 寫進 Figma」的完整流程 → 觸發 `ds-architecture-flow` skill（它有 Phase 0 訪談 + 4 Gates + 反向 audit）。

本 CLAUDE.md 是「**永遠生效的護欄**」；skill 是「**跑流程時的步驟**」。護欄被動、流程主動。

---

## 專案輸入不在本 repo

`spec` / `PRD` / `WF`（這個專案的實際 wireframe）是「**專案輸入**」，放在專案資料夾的 `inputs/`，不是框架。

框架只放「**可重用的**」：`wf-templates/`（版型模板）≠ 某專案的 WF。

## DS 永遠來自框架；Figma 是最終 / 常態調整載體

- **DS 來源固定**：本框架是唯一 DS 規則來源；不管走哪條 path，DS 規則本體都是它
- **最終 canvas**：Figma（永遠）
- **後續微調**：Figma + `ds-sync-from-figma` skill 寫回 spec（接近全部 path 都收斂到這）

## 兩條 path（專案級決定、不是 per-page；記在 `project.yaml`）

依「DS 誰建立」分：
- **Path 1（Figma 路線）**：CC 依框架直接建 DS、寫進 Figma。多數情境用這條。
- **Path 2（第三方路線，目前只支援 CD）**：CC 把 PRD+WF+CI+規範打包給 CD，CD 建 DS+設計後 CC 收回；接回段由 `cd-handoff-rebuild` skill 處理（已驗證）。

Phase 0 Q7 決定，全專案統一一條。WF 是 path 選完後的 follow-up（Q8，deferred-OK）。

## 給新進成員：最少要會的 git

```
git clone <repo-url>            # 第一次：拿框架
git pull                        # 之後：更新到最新框架版本
```

不確定指令可以直接叫 Claude Code 幫你跑。你不需要懂 git 內部，只要會這兩個。
