---
name: ds-studio-flow
description: Goons DS Studio 主控 skill。串起七步工作流——Phase 0 訪談 → token/元件提案 → 網站選取 → 匯出 → build 套 token → 寫 Figma → 雙向同步。復用 framework/ 的 ds-architecture-flow（Phase 0 訪談、Gate 2、Gate 4.5）與 production/figma-rules.yaml，不重造。當同事說「依 ds-studio 幫我跑一個新專案 / 用 Goons DS Studio 建一套設計系統 / 從 CI 跑到 Figma」時觸發。
---

# ds-studio-flow — Goons DS Studio 七步主控

## 何時觸發

同事把這個 repo 丟給 Claude、想跑一輪「從品牌到 Figma」的設計系統建置。典型說法：

- 「依 ds-studio 幫我跑一個新專案」
- 「用 Goons DS Studio 建一套 DS」
- 「從 CI／PRD 一路跑到 Figma」
- 「幫 <品牌> 建初始 token + 元件 + Figma 檔」

**不要觸發**：
- 只想改網站元件本體 → 直接改 `library/gallery.html`（那是引擎維護，不是跑專案）。
- 只想升級框架 schema → 手動 diff 上游，記 `framework/VENDORED.md`（唯讀治理層）。
- 已有專案、只想再匯出一次 / 補跑某一步 → 跳到對應 step，不用從頭。

## 動工前護欄（每次都先確認）

先讀完 repo 根 `CLAUDE.md` 六條鐵則，全程生效。三個最容易犯的：

1. **所有輸出只寫 `projects/<name>/`**，永不改 `framework/`（唯讀）、也不 per-project fork `library/gallery.html`。
2. **元件 id 主權在 `library/component-registry.json`**（library-first）；框架 L0 只當 `l0Ref` 軟參考。
3. **token / logo 一律綁定，禁 hard-code**；複合元件內部一律取用既有原子（鐵則 5）。

`<name>` 命名規約：`<品牌>-<日期>`（例 `joiini-20260717`）。全程對著 `projects/<name>/` 寫。

---

## 七步總覽

| 步 | 名稱 | 主產出 | 關卡 |
|---|---|---|---|
| 1 | Phase 0 訪談 | `projects/<name>/opening-interview.md` | HARD：沒品牌錨點不前進 |
| 2 | Token 提案＋元件建議 | `projects/<name>/proposal.json` | 給設計師 confirm 才進 3 |
| 3 | 網站選取 | 設計師在 gallery 上調整 | — |
| 4 | 匯出 | `tokens.export.json`＋`components.export.json`＋`selection.state.json` | — |
| 5 | build＋套 token | 實際 token 檔／套用 | HARD：Gate 2 commit gate |
| 6 | 寫進 Figma | Figma 檔＋Variables＋Component sets | HARD：Gate 4.5 instance-required |
| 7 | 雙向同步 | drift 差異四分類清單 | 設計師 confirm 才寫回 |

步驟主動、鐵則被動。每一步做完先回報、等設計師確認再進下一步——尤其 1→2、4→5、5→6 這三個交棒點。

---

## Step 1 — Phase 0 訪談

**目標**：收齊 CI／PRD／品牌／path／Figma 檔等 input，不讓 Claude 自己 judge 品牌決策。

**做法**：**直接復用**框架 `framework/skills/ds-architecture-flow/SKILL.md` 的 **Phase 0 段落（Q0–Q9）**，逐字讀完再問。不要在這裡重寫訪談題庫。

三個 studio 專屬的調整（覆蓋框架預設）：

- **Q0 專案資料夾**：一律用 repo 內 `projects/<name>/`（不是桌面任意路徑）。沒有就從 `framework/_project-template/` 複製骨架建進去。這是鐵則 1 的校準點。
- **Q6 Figma 檔**：沒既有檔就開新檔，問 Q6a 工作空間 + Q6b 檔名（預設 `<品牌> - DS - <成員> - <日期>`）。file key 記進 `opening-interview.md`，Step 6 要用。
- **spec-first**：所有題先 grep 設計師給的 CI／PRD 萃取，抓不到才問人。品牌至少要有一個色彩錨點（Q3）才能進 Step 2，否則 HARD 擋。

**產出**：`projects/<name>/opening-interview.md`（結構照框架 Phase 0 output 模板）。這份是後續所有步驟的 source of truth，Claude 不可違背已 confirm 的答案。

**回報**：把萃取到的品牌色／字體／path／Figma 目標檔列給設計師 confirm，再進 Step 2。

---

## Step 2 — Token 提案 ＋ 元件建議

**目標**：Claude 依 CI／PRD 判初始 token 值 + 從 registry 篩出建議元件，產 `proposal.json`。這是「Claude 先擬、設計師到網站上改」的草稿。

### 2a. Token 值

依 `opening-interview.md` 的品牌錨點，判 L1／L2 token override：

- **色彩**：主色 → `--c-brand-*`、副色 → `--c-brand2-*`、語意色 → `--c-success/warning/error/info-*`、灰階 → `--c-neutral-*`。從 CI 主色推 500 階，其餘階次用 gallery 既有色階規則衍生（別硬寫每一階，只 override 差異點）。
- **圓角／間距／字級**：CI 有調性線索才 override（例圓潤品牌 → 調大 `--r-md`）；沒有就留 gallery 預設、不塞值。
- **深色**：Q7 要 dark 才填 `dark` slot；響應式字級填 `desktop/tablet/mobile`。

只寫「跟 gallery 預設不同」的 key。結構：

```json
{
  "project": "<name>",
  "tokens": {
    "overrides": {
      "root": { "--c-brand-500": "#…", "--r-md": "12px" },
      "dark": {},
      "desktop": {}, "tablet": {}, "mobile": {}
    },
    "logo": { "light": null, "dark": null }
  },
  "components": { … }
}
```

### 2b. 元件建議

從 `library/component-registry.json`（39 項 canonical）依 PRD scope 篩：

1. 讀 registry，對照 PRD 要的頁面／功能，列出需要的元件 id。
2. 每顆帶**建議軸**（`axes`）：只勾這個專案實際會用到的 variant／intent／state／size，不全套（呼應框架 Phase 0.8 scope inventory「取 subset 不全套」）。
3. 對應到 gallery 的 `RECOMMEND`＋AI toggle：proposal 的 `selected` 就是預勾清單，網站載入時會自動勾起來。

```json
"components": {
  "selected": ["button", "input", "tag", "card"],
  "axes": {
    "button": { "variant": ["solid", "outline"], "intent": ["primary", "secondary"], "state": ["default", "hover", "disabled"], "size": ["m"] }
  }
}
```

**產出**：`projects/<name>/proposal.json`。格式細節見 `projects/README.md`。

**回報**：用白話跟設計師說「我建議這些色 + 這幾顆元件，等下你在網站上可以改」，不用等 confirm，直接進 Step 3 讓他在網站上調（網站就是 confirm 介面）。

---

## Step 3 — 網站選取

**目標**：設計師在 gallery 上實際看效果 + 調 token + 勾最終元件與軸。**這步取代框架的 Step 3.5 本地 preview**——網站就是 preview＋選取二合一。

**做法**：

```
node library/tools/studio-server.js          # 啟本地 server（:8899）
# 請設計師開 http://localhost:8899/gallery.html?project=<name>
```

- `?project=<name>` → 網站抓 `proposal.json`（或已存的 `selection.state.json` 續編）→ 自動套 token override（`applyTokOverrides`）+ 勾選元件（`SUMSEL`）+ 軸（`CHOICE`）+ logo。
- 設計師在網站上：改 token（Design Token 頁的完整編輯器）、勾／取消元件、選每顆要的狀態樣式（軸）、上傳 logo（Basic → Logo，淺／深各一）。
- **Design Guideline 頁**是匯出前的最後確認關：把當前 token＋選定元件的效果整頁攤開給設計師看（＝框架 Step 3 尾端「先看效果」）。

**Claude 這步不動手**，只負責：起 server、給網址、口頭引導「調完按右上『匯出到專案』」。設計師調整期間 Claude 待命。

---

## Step 4 — 匯出

**目標**：把網站上的最終狀態落成檔案，交棒回 Claude。

**做法**：設計師按 topbar 右上「**STUDIO · <name> · 匯出到專案**」→ 網站 `POST /api/project/<name>/export` → 寫三檔到 `projects/<name>/`：

| 檔 | 內容 |
|---|---|
| `tokens.export.json` | 最終 token overrides（root/dark/響應式）+ logo（data URI） |
| `components.export.json` | `selected`（元件 id）+ `axes`（每顆選用軸）+ `counts`（變體數） |
| `selection.state.json` | 完整網站狀態（下次續編優先載這份） |

沒開 server / 沒帶 `?project=` → 網站改走瀏覽器下載，設計師手動把檔放進 `projects/<name>/`。

**回報**：Claude 讀回三檔，覆述一次「你最後選了 X 顆元件、改了這幾個 token」給設計師對，再進 Step 5。

---

## Step 5 — build ＋ 套 token

**目標**：從匯出檔產出實際 token 檔／套用到 codebase，並過完整性檢查。

**做法**：

1. 讀 `tokens.export.json` → 產專案 theme delta（套框架 `themes/` base 結構）；所有元件實作綁 semantic token，不直接綁 primitive（`token-policy.allowed`）。
2. 讀 `components.export.json` → 對每顆 `selected` 元件，從 `library` 取對應實作、套最終 token、依 `axes` 保留選用的 variant／state。
3. logo 落地到 `projects/<name>/assets/`。

**Gate 2 — commit gate（HARD）**：復用框架 `ds-architecture-flow` 的 Gate 2。檢查：

- 每個 foundation 都有對應 token 檔；每顆選定元件都有實作。
- 元件實作沒有直接綁 primitive（違者 ⛔ 擋）。
- variant／intent／state／size 軸與 `components.export.json` 宣告一致。

```
=== Gate 2 commit gate ===
✅ Foundations: n/n built
✅ Components: n/n built
❌ token-policy violations: …
⛔ COMMIT BLOCKED — 修完再繼續
```

過 Gate 2 才進 Step 6。

---

## Step 6 — 寫進 Figma

**目標**：把 token → Figma Variables、選定元件 → Figma Component sets，軸 → variant／boolean property。

**前置（HARD）**：先載入 `/figma-use` skill（不跳過）。動工前 `search_design_system` / scan Components page 盤點既有 token／component，缺漏先回報再決定補建或沿用，禁 hard-code 繞過。

**對齊 `framework/production/figma-rules.yaml`**：

- **頁面結構**：照 figma-rules `file-structure` + `style-guide-presentation.universal-skeleton`（Foundations 頁必配 token demo、Components 頁按樣式分類）。
- **鐵則 3 — 軸對映（核心）**：registry 每顆元件的軸 1:1 對映 Figma property——
  - **結構差異走 variant**（variant／intent／size → variant property）
  - **內容開關走 boolean**（有無 leading icon、狀態 on/off → boolean property）
  - 判斷法照 figma-rules `variants-policy.decision-test`；禁把可切換的軸畫成獨立不相干節點。
  - 網站的「篩選項／樣式切換」就是這裡的 variant／boolean，維持「codebase 怎麼組合、Figma 就怎麼組合」。
- **鐵則 4 — token 綁定**：所有色／間距／字級／圓角／陰影綁 Variables（對應 `tokens.export.json`），禁寫死。Q7 要 dark 就建雙 mode collection。
- **鐵則 5 — 原子重用**：複合元件（header／footer／modal）內部的 button／input／menu／icon 一律 INSTANCE_SWAP 到既有原子；沒有就先建原子再組裝，禁 inline 重畫 primitive。
- **logo**：以 Variables／component 承載，Figma 端鎖寬高度等比（對齊網站三處行為）。
- **命名**：schema-id（機器讀）/ figma-master / variant-property（Figma 原生慣例 `Prop=value`）三層分開，照 figma-rules `naming`。

**Gate 4.5 — instance-required（HARD）**：push 完檢查每顆選定元件在 Figma 都有 main component + 至少一個 instance demo（複合元件內部原子是 instance 非 detached）。復用框架 Gate 4.5。

**push Figma 慢（10–20 分）**，動工前先跟設計師講一聲、給預估。

---

## Step 7 — 雙向同步

**目標**：之後 codebase 或 Figma 任一邊改動，跑 `sync/` 偵測差異，分四類歸位。

> **現況**：`sync/` 為 stub（Phase E 才接 figma-sync-setup 的三支 drift 腳本，本機沙箱擋 git clone）。這步先講規則，腳本待接。

**鐵則 6 — 差異四分類**（沿用框架鐵則 3）：

| 類 | 例 | 歸位 |
|---|---|---|
| token 值變動 | 色、圓角改了 | `projects/<name>/tokens.export.json`（＋回填 theme delta） |
| 結構變動 | 新元件／新 variant | `library` ＋ `registry`，標 `upstream-候選` |
| 內容變動 | 文案／圖片／logo | `projects/<name>/` |
| 互動原型／mock | seed data | `projects/<name>/seed/` |

**Claude 不自己決定寫不寫回框架**——列出四分類差異清單給設計師 confirm，`upstream-候選` 由 goonsdesign 人工審核才進 `library`／`registry`。

---

## 定案：bake 自包含預覽

專案定案、要一份能單獨寄客戶／歸檔的頁 → 把當前 `selection.state.json` 狀態 bake 成自包含 `projects/<name>/preview.html`（token／logo 全 inline，不依賴 server 或外部 CSS，呼應「preview 要自包含」）。這是可選收尾，不是每次必跑。

---

## 跟其他 skill 的分工

| 情境 | 用誰 |
|---|---|
| 跑完整七步（本流程） | `ds-studio-flow`（本 skill） |
| Phase 0 訪談題庫本體 | 復用 `framework/skills/ds-architecture-flow`（Q0–Q9） |
| 寫 Figma 前置 | `/figma-use`（強制前置） |
| 已有 Figma DS、單純重建一頁 | `framework/skills/visual-to-figma-ds` |
| Path 2（CD 介入）接回 | `framework/skills/cd-handoff-rebuild` |
| 從 Figma 反向 sync | `framework/skills/ds-sync-from-figma`（＋ Phase E `sync/`） |

## 收尾報告

跑完一輪寫 `projects/<name>/ITERATION-report.md`：inputs resolved（Phase 0）、gates fired、built（token/元件/Figma）、proposals raised（→ upstream 候選）、drift、下一輪候選。格式沿用框架 ITERATION-report 模板。
