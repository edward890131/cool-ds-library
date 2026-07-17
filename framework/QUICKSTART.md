# Goons DS Studio — 成員快速上手（Quick Start）

> 給第一次跑 `ds-studio-flow` 的成員。讀一次、跑的時候再翻就好。
> 這份是「**介面層**」說明 —— 你會看到什麼、該怎麼反應。
> 不講原理（在根 `CLAUDE.md` / `framework/FRAMEWORK-WORKFLOW.md`）、不講 skill 內部（在 `skills/ds-studio-flow/SKILL.md`）。

**新版七步流程**：Phase 0 訪談 → Token/元件提案 → **網站選取** → 匯出 → build 套 token → 寫進 Figma → 雙向同步。
和舊框架最大的差別：**選元件、調 token、換 logo 都在網站上做**（取代舊版純文字清單）。

---

## Part 1 — 跑之前（10–15 分鐘準備）

### Step 1. 設定 git authentication（只要做一次、終身有效）

Claude Code（下稱 CC）會幫你跑 git 指令，但 git 第一次連 GitHub 需要授權：

```
gh auth login              # 沒登入過 → 跑這條，選 GitHub.com → HTTPS → 用瀏覽器登入
gh auth setup-git          # 把 gh 認證套用到 git
```

不熟 gh / git 也沒關係，直接跟 CC 講：「**幫我設定 git 認證**」、CC 會引導。

### Step 2. 拿整套 studio（一次到位、不用裝 skill）

#### 第一次：

```
cd ~/Desktop                                            # 或你想放的地方
git clone <ds-studio repo-url> goons-ds-studio
```

框架、元件庫、skill **全都在這個 repo 內**，**不用**再 clone 框架、**不用** symlink 裝 skill。CC 進到這個資料夾會自動讀規則。

#### 已 clone 過、要跑新一輪：

```
cd ~/Desktop/goons-ds-studio
git pull                     # 拉最新版
```

不熟 git 也可以直接跟 CC 講：「**幫我 pull 最新 ds-studio**」。

### Step 3. 接 Figma MCP（讓 CC 能寫 Figma）

**請使用「果思公用 Figma 帳號」執行 —— 該帳號已完成 MCP 授權，正常情況不需自己設定**。

開 Figma desktop app、用果思公用帳號登入，即可開始。

確認連線（選做）：CC 對話視窗跑 `/mcp`，看到 `claude_ai_Figma` 顯示 `connected` = OK ✓。
需重新授權 → 跟 CC 講「**幫我重新授權 Figma MCP**」，授權時**確認登入的是果思公用帳號**才按。

### Step 4. 認識「路徑」這件事

CC 沒辦法自己用滑鼠選檔案、要你提供「**路徑**」（檔案在 Mac 上的地址）。

| 招式 | 怎麼做 |
|---|---|
| **拖進 CC 視窗**（最簡單） | 從 Finder 把 PDF / 資料夾直接拖進對話框，路徑自動貼上 |
| **Finder 複製路徑** | 選檔案 → `Cmd + Option + C` → 貼到 CC |
| **打 `@` autocomplete** | 對話框打 `@` + 檔名，CC 即時列出讓你選 |
| **手打絕對路徑** | 直接打 `~/Desktop/CI/JoiiNi_CI.pdf` |

要 CC 看資料夾內容：跟 CC 講「**看一下 `~/Desktop/CI/` 裡有什麼**」。

### Step 5. 準備要給的東西

| 要的東西 | 沒有怎麼辦 |
|---|---|
| **CI / 品牌識別 PDF** | 用文字描述顏色 / 字體 / 調性 |
| **品牌 logo 檔**（SVG 最佳，PNG 也行） | 沒有先跳過、之後在網站上補；預設用 Goons 字標 |
| **規格 / PRD PDF**（可選） | 給粗略功能清單也 OK，或純建 DS 不需要 |
| **專案名稱** | 建議 `<客戶名>-DS`（例：`快電商-DS`），中文 OK |

---

## Part 2 — 開始跑：Phase 0 訪談

### 👉 開頭講這句話給 CC：

```
依 ds-studio 幫我跑 <客戶名> 的新專案
```

CC 會 trigger `ds-studio-flow`、開始逐題問 Q0–Q9。**逐題回答、不要跳題**。

> 💡 以下表格僅供參考，依你當下實際情況選擇或用自然語意描述讓 CC 引導，不必逐字照抄。

### Q0 — 專案資料夾（必答 HARD）

CC 問：「專案要放哪？」新版**預設放在 repo 內的 `projects/`**：

| 情境 | 應選擇 / 輸入 |
|---|---|
| **推薦** | 「放 `projects/快電商-DS`」（CC 自動建資料夾骨架） |
| 想放別處 | 給絕對路徑（不建議，會跟 studio 脫節） |

### Q1 — CI / 品牌文件（必答 HARD，spec-first 起點）

| 情境 | 應選擇 / 輸入 |
|---|---|
| 有 CI PDF | 「CI 在 `<路徑>`」（可拖進來） |
| 暫時沒有 | 「沒有、之後補」（CC 用 Q3 fallback、產 v0.1-provisional 設計原則） |

### Q1.5 — Logo 檔（新版新增，SOFT）

| 情境 | 應選擇 / 輸入 |
|---|---|
| 有 logo | 「logo 在 `<路徑>`」（CC 收進 `projects/<名稱>/assets/`，之後網站三處同步替換） |
| 沒有 | 「先用預設」（網站上隨時可再上傳；替換時鎖寬度、高度等比） |

### Q2 — 規格 / PRD（必答 HARD，scope 來源）

| 情境 | 應選擇 / 輸入 |
|---|---|
| 有 PRD | 「PRD 在 `<路徑>`」 |
| 只有功能清單 | 「規格在 `<路徑>`、用 default」 |
| 純建 DS | 「沒規格、純建 DS」（搭配 Q8 = not-applicable） |

> 💡 CC 會根據這份規格，從 `library/component-registry.json` 篩出本次建議的元件、預先勾好，等你到網站上確認。

### Q3 — Brand 視覺確認（必答 HARD）

CC 從 Q1 CI 自動萃取「色彩 / 字體 / 調性」列出給你 confirm，不直接問你色碼：

| 情境 | 應選擇 / 輸入 |
|---|---|
| 萃取對 | 「confirm」 |
| 想改 | 「主色改 #XXXXXX」/「調性改 energetic」 |
| 沒 CI 自己給 | 「主色 #XXXXXX、中文 Noto Sans TC、英文 Inter、調性 warm」 |

### Q4 — Path（必答 HARD）

| 情境 | 應選擇 / 輸入 |
|---|---|
| 一般專案 | **`path-1-figma-direct`** |
| 走 CD round-trip（進階） | `path-2-cd-3rd-party` |

### Q5 — Dev Stack（必答 HARD）

CC 列 preset 給你選：不確定 → `react-tailwind-vite`；FE 已決定 → 選 FE 指定的；完全 custom → **會卡住、要找 FE 補 `code-rules.delta`**。

### Q6 — Figma DS 檔（必答 HARD，含工作空間 + 檔名）

| 情境 | 應選擇 / 輸入 |
|---|---|
| 新客戶 | 「開新檔」 → 接著答 Q6a（工作空間）+ Q6b（檔名） |
| 已有 | 「file key 是 `XXXXXXXXX`」 |

- **Q6a 工作空間**：「建在 `<team> / <project>/`」，不熟就說「列可用的給我選」。
- **Q6b 檔名**：預設規約「`<品牌> - DS - <你的名字> - <日期>`」，或自選。

### Q7 — Dark mode（SOFT）

沒明確要求 →「之後補」（預設 light only）；客戶要 →「立即建」。

### Q8 — WF / 頁面架構（可後補 / 可不適用）

純建 DS →`not-applicable`（跳過頁面 rebuild）；有 WF →「WF 在 `<路徑>`」；想做頁面但沒 WF →`pending`。

### Q9 — Responsive（spec-first、CC 通常自己抓）

CC 從規格抓斷點，抓不到用 default `[360, 768, 1024, 1280]`。你 confirm 即可。

---

## Part 3 — Phase 0 之後：提案 → ★ 網站選取 → 匯出

### Step A. CC 產「提案」（token 值 + 預勾元件）

Phase 0 答完，CC 會：

```
✅ Phase 0.7 brand consistency check（CI / spec / brand 三邊比對品牌一致）
✅ Phase 0.5 design principles（5–7 條設計原則，這份要 review）
✅ Token 提案
   → 依 CI/PRD 判 L1/L2 值（色階 / 字級 / 間距 / 圓角 / 陰影）
✅ 元件建議
   → 從 registry 篩出本次需要的元件、預先勾好、標好每顆建議的軸
   → 寫成 projects/<名稱>/proposal.json
```

### Step B. ★ 到網站上選取（新版核心）

CC 會幫你把提案灌進網站、開一個**這個專案專屬的編輯預覽頁**：

```
CC 會：
1. 在 projects/<名稱>/ 下起一個本地 server
2. 開 library/gallery.html?project=<名稱>
   → 網站自動載入 proposal.json：元件已預勾、token 已預填
```

**你在網站上做四件事**：

| 動作 | 怎麼做 |
|---|---|
| **調 token** | 在 token 面板改色階 / 字級 / 間距等值，即時預覽 |
| **勾最終元件** | 勾 / 取消勾要建的元件（CC 已預勾建議的） |
| **選狀態 / 樣式** | 每顆元件展開，勾要哪些軸（variant / state / size…）——**這些之後 1:1 變成 Figma 的 variant / boolean property** |
| **換 logo** | Basic 群的 Logo 項上傳品牌 logo；網站 topbar、library header、footer 三處同步替換（鎖寬度、高度等比） |

改到滿意 → 按網站上的**「匯出」**。

### Step C. 匯出

網站吐兩個檔到 `projects/<名稱>/`：

```
tokens.export.json       # 你定案的 token 表
components.export.json    # 元件需求（每顆 id + 你選的軸）
```

跟 CC 說「**匯出好了**」（或 CC 偵測到檔案），繼續 build。

### Step D. CC build + 套 token（跑框架完整性檢查）

```
✅ 從 library 複製你勾的元件、套上 tokens.export.json 的最終值
✅ Gate 2（HARD）：檢查 token-policy、每顆元件軸與 export 一致
   → 有違規會擋下、CC 修完才繼續
```

### Step E. CC 寫進 Figma

```
✅ 建 Figma 檔（Q6a 工作空間、Q6b 檔名）
✅ Variables：把 token 綁成 Figma 變數
✅ Component sets：每顆元件的軸 → Figma variant / boolean property
   → 你在網站怎麼切換樣式，Figma 就怎麼切換（同一組合邏輯）
✅ 對齊 framework/production/figma-rules.yaml：4 頁結構、命名、綁 token、nested INSTANCE_SWAP
✅ Step 4.5 post-build audit：CC 自己 walk Figma 檢查、FAIL 自動修
```

**Figma 4 頁結構**（寫死）：

```
1. Cover
2. Foundations   ← 所有 token 在單一 SECTION 內往下堆疊
3. Components    ← Basic → Complex → Card → Table&Chart 往右（documentation instance）
4. Masters       ← 所有 master sets（元件主源頭，改元件到這頁）
+ Pages/<name>   ← 有做頁面 rebuild 才額外開、不計入 4 頁
```

---

## Part 4 — 跑完後拿到什麼

```
projects/<客戶>-DS/
├── opening-interview.md       # 你 Q0–Q9 的答案
├── design-principles.md       # 設計原則
├── proposal.json              # CC 的提案
├── selection.state.json       # 你在網站的最終選取
├── assets/logo.<svg|png>      # 專案 logo
├── tokens.export.json         # 最終 token 表
├── components.export.json     # 元件需求
├── output/                    # build 出的 DS + GATE 報告 + 給 FE 的 pack
├── seed/                      # 互動原型 / mock data（給 FE）
└── preview.html               # 定案後 bake 的自包含預覽（可寄客戶）
```

Figma URL 會列在 CC 的完成訊息與 `output/` 報告裡。

### 定案後想要一份能單獨寄客戶 / 歸檔的頁

跟 CC 說「**幫我 bake `<名稱>` 的預覽頁**」→ CC 把引擎＋你的狀態烘成一份**自包含 `preview.html`**（logo、token 值都 inline 寫死，離線可開、可直接寄）。

---

## Part 5 — 常見問題

**Q：CC 沒問我某一題就跳過？** 通常不是 bug —— CC 從你給的 spec / CI 已抓到答案就不重問（spec-first）。打開 `opening-interview.md` 確認。

**Q：網站打不開 / 開起來是空白？** 多半是本地 server 沒起或快取。跟 CC 說「**重開 `<名稱>` 的預覽**」，或在網址後加 `?project=<名稱>&fresh=1` 強制重載。

**Q：網站上改了 token 但 Figma 沒變？** Figma 是在 Step E 才寫入的。**先在網站按匯出**、CC 再 build + 推 Figma。網站只是選取/預覽，Figma 才是最終 SSOT。

**Q：logo 換了但深色模式下看不到？** 上傳的客戶 logo 不會自動反白。可以在網站上淺 / 深各傳一顆，或讓 logo 墊固定淺底 —— 跟 CC 說一聲即可。

**Q：CC 建議的元件跟我想的不一樣？** 就在網站上直接勾 / 取消勾調整。語意配對需要人工 review，CC 只是預勾建議。

**Q：跑很久（超過 30 分鐘）沒動靜？** 多半是 Step E push Figma 動作多、慢正常（15–20 分鐘）；或 CC 卡在某題等你回應 —— 看 CC 最後一句。

**Q：Q0–Q9 答錯了？** 直接喊 CC「我 Qx 想改成 yyy」，CC 會回填 `opening-interview.md` 與後續產物。**不要**自己手動改檔（順序會亂）。

**Q：中途想停？** Ctrl+C 停 CC。已產出的檔會留著，下次叫 CC「繼續上次的 ds-studio 流程」可接著跑。

---

## 對應版本

- skill `ds-studio-flow`（施工中，復用 `framework/skills/ds-architecture-flow` v0.8）
- framework 快照 `VERSION` 見 `framework/VERSION`（0.8.2）／來源見 `framework/VENDORED.md`

studio 更新 → 這份文件可能也更新，`git pull` 同步。
