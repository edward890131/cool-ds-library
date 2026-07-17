# Goons DS Studio — CHANGELOG

studio 層里程碑（gallery 元件本身的細部改動另見 `library/CHANGELOG.md`）。

## Phase A + B（2026-07-17）
- 搭 repo 骨架：`framework/` + `library/` + `sync/` + `skills/` + `projects/`
- 快照 ds-framework（VERSION 0.8.2 · commit 37ea97c）→ `framework/`，`VENDORED.md` 記來源
- 建 `library/component-registry.json`：39 項 canonical id + 軸（library-first）
- 根 `README.md` + `CLAUDE.md`：七步工作流 + 6 條鐵則
- 就地重寫框架三份教學（README / FRAMEWORK-WORKFLOW / QUICKSTART）為新版七步流程
- `framework/CLAUDE.md` 鐵則 1 校準：專案產出寫 repo 內 `projects/`

## Phase C（進行中）
### C3 — Logo 品牌資產（2026-07-17）
- Basic 群新增「Logo 品牌標誌」項（`buildLogo` view + 上傳控制）
- **淺色／深色主題各一顆**：`PROJECT_LOGOS{light,dark}` + `activeLogo()` 依當前主題自動取用；未設定的主題 fallback 用另一顆，都無則回 Goons 字標
- `applyLogo(theme,src)` + `refreshLogo()`：同步替換三處（topbar `.brand-logo`、header `hdrLogo`、footer `ftrLogo`），主題切換即時更新
- slot 預覽墊淺／深底，直接看反白效果
- 三處 sizing 由「鎖高度」改「**鎖寬度**」（topbar 66px、header/footer 72px），高度等比
- ✅ property 驗證：雙檔切換 7 情境全對、2:1→66×33、3:1→66×22、fallback、全清回預設

### C3 修正（2026-07-17）
- **上傳/清除鈕改用 library `.btn` 原子**（原本 inline 自畫、硬寫 `color:#fff`＝違反原子重用鐵則、深色下白字糊掉）：上傳=`v-solid i-primary`、清除=`v-outline i-secondary`，token 綁 `--on` 對比色自動正確（淺色對比 16.99）
- 清掉 dead CSS（`.logo-btn`/`.logo-reset`/`.lp-box` 等舊版樣式）
- 側邊欄 Basic 重排：通知／提示／骨架／載入器移到分頁器下方
- registry 生成腳本改指 studio gallery、logo 改 enrich NAV 既有項（非重複 append）
- 註：Playwright 深色主題背景量測受 Chrome Auto Dark Mode 污染，屬測試假象非 CSS bug（無 `!important` 背景、custom property 值皆正確）

### C3 再修正（2026-07-17）— hover 契約
- 上一版只套 `.btn` class 但**漏了 `.live`**，導致無 `:hover`/`:active`（library 互動按鈕靠 `.live` 走真實 hover）
- 改為**用 `mkBtn` 建構器**（`isLive:true`）建上傳/清除鈕、僅換文字＝完整複製 library 互動契約，不再手拼 class
- ✅ 驗證：hover 背景 #1C1C20→#141417（=`--fill-h`），與 library 一致
- 教訓入庫：重用 library 元件一律走其建構器（`mkBtn`/`build*`）＋驗互動態，不只驗靜態

### C1.5 — Design Guideline 頁（2026-07-17）
- 側邊欄新增置頂項，順序 `🎨 Design Token → 📐 Design Guideline → 📋 需求匯總`
- 工作流定位：第 3 步（網站選取）尾端、匯出前的**最後確認關**（＝框架 Step 3.5「先看效果」）
- `renderGuideline` 讀 `getComputedStyle(:root)` 當前值（自動含 token 編輯結果）+ 重用 `LIVE[id]` 掛元件實例，不重畫
- 7 區塊：品牌（logo 淺/深＋主副色）／色彩（7 色階＋語意角色）／字體 h1–h10／間距／圓角／陰影／元件（依 `SUMSEL` 選定，LIVE 有的掛實例、Complex/Card/Chart 列名）
- ✅ 驗證：nav 順序、7 區塊、17 LIVE 實例掛載、0 console error

### C1.5 調整（2026-07-17）— 依 JoiiNi Web Guideline 寫法
- **移除元件段落**（改為只留 foundation：品牌/色彩/字體/間距/圓角/陰影）
- **色彩改 JoiiNi 寫法**：類別區段（英文粗體大標＋中文說明＋分隔線）＋ Base(棋盤)+Color 圓角色塊、name＋hex 於下；分 Primary/Secondary/Neutral/Notification/Semantic 5 類 39 色
- **字體改 JoiiNi 寫法**：字體家族區（Sans/Mono 大字＋字重晶片＋fallback pill）＋字級表（N｜預覽｜Size/Line/Letter｜應用方式 h1–h10）＋文字色表（色塊｜名稱｜應用）
- 值仍讀本專案當前 token（getComputedStyle），非套 JoiiNi 色
- ✅ 驗證：色彩 5 類 39 色、字體 Geist/Geist Mono、字級 10 列、文字色 6 列、0 console error

### C2 — Token 編輯（確認既有、無新增）
- 查核 `renderTokens` 本就是完整編輯器：L1（206 欄/65 色票）、L2（42 色票）可編輯、即時套 `:root`（OV override）、有 reset；Guideline 已吃此 override。C2 核心無須重建。

### C5＋C1＋C4 — 資料管線打通（2026-07-17）
- **C5 本地 server**（`library/tools/studio-server.js`）：serve `library/` 靜態檔 + `GET /api/project/<name>`（回 proposal/state）+ `POST .../export`（寫 tokens/components/state 到 `projects/<name>/`）
- **C1 proposal 匯入**：`?project=<name>` → 抓 proposal（或 state 續編）→ 套 token override（`applyTokOverrides`）+ SUMSEL 勾選 + CHOICE 軸 + logo；boot 包進 `studioInit`（先 fetch 再渲染）
- **C4 匯出**：topbar「STUDIO · <name> · 匯出到專案」（用 mkBtn 原子），寫 `tokens.export.json`（overrides+logo）+ `components.export.json`（selected+axes+counts）+ `selection.state.json`；無 server/專案 fallback 下載
- `projects/_demo/` 完整往返範例 + `projects/README.md` 格式文件
- ✅ 端到端驗證：載入 _demo 套 #E5484D/16px/4 元件、匯出寫出 3 檔內容正確、0 error（僅 favicon 404）

### C 微調（2026-07-17）— 出口收斂 + topbar
- 方案 A：「匯出到專案」為唯一正式出口；頁面兩顆降級為「複製此頁 CSS / 複製此頁 JSON」（剪貼簿輔助）
- 深淺色 toggle 移到 topbar 左側（Design System Library 右邊），匯出 badge 改靠右

Phase C 完成 🎉（logo · Design Guideline · token 編輯 · 資料管線）。

## Phase D — ds-studio-flow 主控 skill（2026-07-17）
- `skills/ds-studio-flow/SKILL.md` 從 Phase A 佔位改寫成**完整七步主控**：觸發條件、動工前護欄（六鐵則摘要）、七步總覽表、每步 goal/做法/關卡/產出/回報。
- **復用不重造**：Step 1 直接引框架 `ds-architecture-flow` Phase 0（Q0–Q9），只覆蓋三處 studio 差異（Q0 資料夾走 repo 內 `projects/<name>/`、Q6 開新檔問 workspace/檔名、spec-first + 品牌色錨點 HARD 擋）；Step 5 引 Gate 2 commit gate；Step 6 引 Gate 4.5 instance-required + `figma-rules.yaml`（file-structure / variants-policy.decision-test / universal-skeleton / naming 三層）。
- **軸對映寫死鐵則 3**：結構差異→variant、內容開關→boolean，網站篩選項／樣式切換＝Figma variant／boolean，維持同組合邏輯。
- **交棒點標記**：1→2、4→5、5→6 三處先回報等 confirm；Step 3/4 Claude 待命、設計師在網站操作。
- Step 7 sync 標明為 Phase E stub（先給鐵則 6 四分類規則，腳本待接）。
- ✅ 核對：引用的 Gate 2 / Gate 4.5 / figma-rules 四 key / 四個框架 skill 檔名皆存在對得上。

下一步 Phase E：接 figma-sync-setup 三支 drift 腳本到 `sync/`（需 Yuu 用 `!git clone` 或抓 raw，本機沙箱擋 git clone）。
