# sync/ — Figma ↔ codebase 雙向同步

改寫自 `figma-sync-setup`（edward890131），**適配** Goons DS Studio 的 token／registry 結構——不是無腦複製。用「比指紋、不比畫面」的方式抓 code 與 Figma 的差異，兩條軌：

| 軌 | 方向 | 正本 | 比什麼 | 指令 |
|---|---|---|---|---|
| **Token 軌** | 雙向 | code | 每個 token 值兩邊對不對得上 | `node sync/check-token-drift.mjs <name>` |
| **Component 軌** | 單向 figma→code | Figma | 每顆元件的軸（variant/intent/state/size）結構 | `node sync/check-component-drift.mjs <name>` |

> Node 腳本只做 diff＋出報告；**去 Figma 拉現況（snapshot）要靠 Claude 用 Figma MCP**（見 `SYNC_PROMPTS.md`）。這是「半自動」——改不改由設計師決定。

---

## 檔案角色

| 檔 | 角色 |
|---|---|
| `extract-base-tokens.mjs` | 從 `library/gallery.html` :root 抽 base token → `library/tokens.base.json`（Token 軌 code 基準）。gallery :root 改了就重跑。 |
| `token-adapter.mjs` | 把 code 端（base＋專案 override）與 Figma snapshot 都 normalize 成中性 schema（三 collection：Primitives／Theme／Device）。**最需維護的一支**——token 命名規則在此。 |
| `check-token-drift.mjs` | Token 軌主腳本。讀 base＋`tokens.export.json`＋`figma-snapshot.json` → 出 drift 報告。 |
| `build-component-spec.mjs` | 🆕 從 `component-registry.json` **自動生** code 端元件指紋（不用手填，永遠跟 library 同步）。 |
| `check-component-drift.mjs` | Component 軌主腳本。逐軸比對 spec 與 `figma-component-snapshot.json`。 |
| `SYNC_PROMPTS.md` | 給 Claude 拉 snapshot 的 prompt 手冊。 |

**共用引擎**：`sync/*.mjs` 一份，讀寫各專案的 `projects/<name>/sync/`（snapshot＋報告都寫那）。

---

## 一次完整流程（某專案 `<name>`）

```bash
# 0) 一次性：抽 gallery base token（gallery :root 有改才要重跑）
node sync/extract-base-tokens.mjs

# 1) 生 code 端元件指紋（讀該專案 components.export.json 的 selected）
node sync/build-component-spec.mjs <name>

# 2) 請 Claude 用 Figma MCP 拉兩份 snapshot 到 projects/<name>/sync/
#    （prompt 見 SYNC_PROMPTS.md）
#    → figma-snapshot.json（token）＋ figma-component-snapshot.json（component）

# 3) 跑 drift
node sync/check-token-drift.mjs <name>
node sync/check-component-drift.mjs <name>
#    → projects/<name>/sync/reports/drift-<date>.md
#    → projects/<name>/sync/reports/component-drift-<date>.md
```

`projects/_demo/sync/` 是一份**乾淨往返範例**（202 token 對齊、4 元件結構乾淨、1 個 hygiene advisory 示範）。

---

## 三個 collection 怎麼對（token 軌）

| collection | modes | 內容 | gallery 來源 |
|---|---|---|---|
| **Primitives** | Value | L1 literal：色階／圓角／間距／字級／字重／行高／字距／陰影／容器／字體／動態 | `:root` 非 `--s-*` 非響應式 |
| **Theme** | Light / Dark | L2 semantic `--s-*` | root（Light）＋ dark 區塊（Dark） |
| **Device** | Desktop / Tablet / Mobile | 只有隨斷點變的尺寸 token（`fs-h1..h7`／`sp-5..9`／`r-lg`／`r-xl`／container） | root（Desktop）＋ tablet／mobile media |

不納入 diff：legacy 別名層（`--canvas`／`--ink`／`--i-*`／`--radius`／`--accent`）＝ code 便利層、非 Figma 變數。

---

## drift 報告怎麼看（＝鐵則 6 四分類歸位）

| 報告標記 | 意思 | 歸位 |
|---|---|---|
| 📥 只在 Code | 程式碼多、Figma 缺 | **推進 Figma**（code→figma，`use_figma`） |
| 📤 只在 Figma | Figma 多、程式碼缺 | **補回 code**（`tokens.export.json` 或 registry 結構） |
| ⚠️ 值不一致 | 兩邊都有但值不同 | 設計師裁決誰對 |
| ⚠️ 結構漂移 | 元件某軸 option 增減 | 結構變動 → `library`＋`registry`，標 upstream-候選 |
| 🎨 Figma hygiene | 顏色綁 `var(--*)` 非語意 token | 在 **Figma 端** rebind（advisory，不擋） |

**Claude 不自己決定寫不寫回 `library`／`framework`**——列四分類清單給設計師 confirm，`upstream-候選` 由 goonsdesign 人工審核。

---

## 誠實限制

- **半自動**：snapshot 要 Claude 用 MCP 拉，腳本碰不到 Figma。
- **Component 軌只比結構（軸）**：gallery 是單檔、沒把每顆元件 CSS 拆出來，所以 radius／color／hardcoded 樣式指紋**本階段不比**（列為未來延伸）。軸結構是 registry-driven、最高價值、可自動生。
- **色彩 alias advisory**：同色雙命名難自動判，列人工複查。
- **Token adapter 跨格式**：`toPath` 命名規則若跟 Figma 實際 collection 命名不同，要對齊（snapshot 由 Claude 產、可控）。
