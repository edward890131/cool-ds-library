# Goons DS Studio — 成員快速上手（Quick Start）

> 給第一次跑 `ds-studio-flow` 的成員。讀一次、跑的時候再翻就好。
>
> 這份是「**介面層**」說明 —— 你會看到什麼、該怎麼反應。
> 不講原理（在 `README.md` / `framework/FRAMEWORK-WORKFLOW.md`）、不講 skill 內部（在 `skills/ds-studio-flow/SKILL.md`）。

**🔗 先看成品**：母元件庫展示網站 → **[cool-ds-library.vercel.app](https://cool-ds-library.vercel.app/)**
> 不用裝任何東西、點進去就能逛所有元件、token、狀態矩陣。想給客戶或同事看「我們有哪些料」，直接丟這個網址。

**這版跟舊框架最大的差別**：選元件、調 token、換 logo 都**在網站上做**（取代舊版純文字清單）。往下會標 ★ 的那步就是。

---

## Part 1 — 跑之前（10–15 分鐘準備）

> Part 1 把環境基礎（git / Figma MCP / 路徑操作）打好，後面跑就順。

### Step 1. 設定 git authentication（只要做一次、終身有效）

CC（Claude Code）會幫你跑 git 指令，但 git 第一次連 GitHub 需要授權：

```
gh auth login              # 沒登入過 → 跑這條，選 GitHub.com → HTTPS → 用瀏覽器登入
gh auth setup-git          # 把 gh 認證套用到 git
```

不熟 gh / git 也沒關係，直接跟 CC 講：「**幫我設定 git 認證**」，CC 會引導。

### Step 2. 拿整套 studio（一次到位，不用另外裝框架 / skill）

框架、元件庫網站、sync 腳本、skill **全都在這一個 repo 內**。**不用**再 clone 框架、**不用** symlink 裝 skill。

#### 第一次：

```
cd ~/Desktop                                                        # 或你想放的地方
git clone https://github.com/edward890131/cool-ds-library.git goons-ds-studio
cd goons-ds-studio
```

#### 已 clone 過、要跑新一輪：

```
cd ~/Desktop/goons-ds-studio
git pull                     # 拉最新版（網站、腳本、skill 一起同步）
```

不熟 git 也可以直接跟 CC 講：「**幫我 pull 最新的 ds-studio**」。CC 進到這個資料夾會自動讀規則。

### Step 3. 接 Figma MCP（讓 CC 能寫 Figma）

**請使用「果思公用 Figma 帳號」執行 —— 該帳號已完成 MCP 授權，正常情況不需自己設定**。

開 Figma desktop app、用果思公用帳號登入，即可開始。

#### 確認 MCP 連線狀態（選做、不確定才查）

在 CC 對話視窗跑 `/mcp`，清單裡看到 `claude_ai_Figma` 顯示 `connected` = OK ✓

#### 若需要重新授權

跟 CC 講：「**幫我重新授權 Figma MCP**」，CC 會引導；跳出瀏覽器要你授權時，**確認當下登入的是「果思公用帳號」才按**（避免綁到個人帳號）。

> 💡 只想逛網站、暫時不推 Figma，這步可以先跳過。

### Step 4. 認識「路徑」這件事

CC 沒辦法自己用滑鼠選檔案、要你提供「**路徑**」（一個檔案 / 資料夾在 Mac 上的地址，長這樣 `~/Desktop/CI/JoiiNi_CI.pdf`）。

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
| **CI / 品牌識別 PDF** | 用文字描述顏色 / 字體 / 調性也行 |
| **品牌 logo 檔**（SVG 最佳，PNG 也行） | 先跳過、之後在網站上補；預設用 Goons 字標 |
| **規格 / PRD PDF**（可選） | 給粗略功能清單也 OK，或純建 DS 不需要 |

### Step 6. 想好專案名稱

規約：`<品牌>-<日期>`（例：`joiini-20260717` / `快電商-20260721`）。中文也 OK。

---

## Part 2 — 開始跑、CC 會問什麼

### 👉 開頭講這句話給 CC：

```
依 ds-studio 幫我跑 <客戶名> 的新專案
```

CC 會自動 trigger `ds-studio-flow`、開始逐題問 Q0–Q9。**逐題回答、不要跳題**。

> 💡 **以下表格僅供參考** —— 依你當下實際情況選擇或用自然語意描述讓 CC 引導，不必逐字照抄。CC 若從你給的 CI / PRD 已抓到答案，會自動跳過該題（spec-first）。

### Q0 — 專案資料夾（必答 HARD）

| 情境 | 應選擇 / 輸入… |
|---|---|
| **推薦** | 「放 `projects/<客戶>-<日期>`」（CC 自動建資料夾骨架，**預設放 repo 內**） |
| 想放別處 | 給絕對路徑（不建議，會跟 studio 脫節） |

### Q1 — CI / 品牌規範文件（必答 HARD，spec-first 起點）

| 情境 | 應選擇 / 輸入… |
|---|---|
| 有 CI PDF | 「CI 在 `<路徑>`」（可拖進來） |
| 暫時沒有 | 「沒有、之後補」（CC 用 Q3 brand 答案 fallback、產 v0.1-provisional 設計原則） |

### Q1.5 — Logo 檔（新版新增，SOFT）

| 情境 | 應選擇 / 輸入… |
|---|---|
| 有 logo | 「logo 在 `<路徑>`」（CC 收進 `projects/<名稱>/assets/`，之後網站三處同步替換） |
| 沒有 | 「先用預設」（網站上隨時可再上傳；替換時鎖寬度、高度等比） |

### Q2 — 規格 / PRD（必答 HARD，scope 來源）

| 情境 | 應選擇 / 輸入… |
|---|---|
| 有 PRD PDF | 「PRD 在 `<路徑>`」 |
| 只有功能清單 | 「規格在 `<路徑>`、用 default」 |
| 完全沒有（純建 DS） | 「沒規格、純建 DS」（搭配 Q8 = not-applicable） |

> 💡 CC 會根據這份規格，從 `library/component-registry.json` 篩出本次建議的元件、預先勾好，等你到網站上確認。

### Q3 — Brand 視覺確認（必答 HARD）

CC 從 Q1 CI 自動萃取「色彩 / 字體 / 調性」列出來給你 confirm，**不直接問你**色碼字體：

| 情境 | 應選擇 / 輸入… |
|---|---|
| CC 萃取對 | 「confirm」或「對」 |
| 想補 / 改 | 「主色改成 #XXXXXX」/「調性改成 energetic」 |
| Q1 沒給 CI、自己給 | 「主色 #XXXXXX、中文 Noto Sans TC、英文 Inter、調性 warm」 |

### Q4 — Path（必答 HARD）

| 情境 | 應選擇 / 輸入… |
|---|---|
| 一般專案 | **`path-1-figma-direct`**（CC 直接建） |
| 要走 CD round-trip（進階） | `path-2-cd-3rd-party` |

### Q5 — Dev Stack（必答 HARD）

CC 會列幾個 preset 給你選：不確定 → `react-tailwind-vite`；FE 已決定 → 選 FE 指定的；完全 custom → **會卡住、要找 FE 補 `code-rules.delta`**。

### Q6 — Figma DS 檔（必答 HARD，含工作空間 + 檔名）

| 情境 | 應選擇 / 輸入… |
|---|---|
| 新客戶 / 沒既有檔 | 「沒有、開新檔」→ **接著答 Q6a + Q6b**（下面） |
| 已有 | 「有、file key 是 `XXXXXXXXX`」 |

#### Q6a — Figma 工作空間（開新檔時必答）

「建在 `<team 名> / <project 名>/`」；不熟就說「**列當下可用的 team/project 給我選**」，CC 會列出來。

#### Q6b — 檔名（開新檔時必答）

用預設規約（推薦）：「叫 `<品牌名> - DS - <你的名字> - <今天日期>`」；或自選：「叫 `XXX`」。

### Q7 — Dark mode（SOFT，可不答用 default）

沒明確要求 →「之後補」（預設 light only）；客戶明確要 →「立即建」。

### Q8 — WF / 頁面架構（可後補 / 可不適用）

純建 DS、不做頁面 → **`not-applicable`**；有 WF 設計稿 →「WF 在 `<路徑>`」；沒 WF、想做頁面 → `pending`（CC 從規格推測）。

### Q9 — Responsive（spec-first、CC 通常自己抓）

CC 從規格自動抓斷點、抓不到用 default `[360, 768, 1024, 1280]`。你 confirm 就好。

---

## Part 3 — Phase 0 答完後、CC 會做什麼

### 你會依序看到以下進度（每段都會停下、等你 Review 才繼續）：

```
✅ Phase 0 完成
   → opening-interview.md 寫好（你的答案存檔）

✅ Phase 0.7 brand consistency check
   → Q1 CI / Q2 spec / Q3 brand 三邊比對品牌一致
   → 不一致 CC 給你三選一

✅ Phase 0.5 design principles
   → design-principles.md（5–7 條設計原則）
   ⚠ 這份要 review、有錯就喊 CC 改

✅ Token 提案 ＋ 元件建議
   → 依 CI/PRD 判 L1/L2 token 值（色階 / 字級 / 間距 / 圓角 / 陰影）
   → 從 registry 篩出本次需要的元件、預先勾好、標好每顆建議的軸
   → 寫成 projects/<名稱>/proposal.json
```

### ★ 接著：到網站上選取（新版核心，取代舊版純文字清單）

CC 會幫你把提案灌進網站、開一個**這個專案專屬的編輯預覽頁**：

```
CC 會：
1. 起本地 server（node library/tools/studio-server.js，:8899）
2. 開 http://localhost:8899/gallery.html?project=<名稱>
   → 網站自動載入 proposal.json：元件已預勾、token 已預填
```

（不用自己記指令，跟 CC 說「**開 `<名稱>` 的網站選取**」即可。）

**你在網站上做四件事**：

| 動作 | 怎麼做 |
|---|---|
| **調 token** | 在 token 面板改色階 / 字級 / 間距等值，即時預覽 |
| **勾最終元件** | 勾 / 取消勾要建的元件（CC 已預勾建議的） |
| **選狀態 / 樣式** | 每顆元件展開，勾要哪些軸（variant / state / size…）——**這些之後 1:1 變成 Figma 的 variant / boolean property** |
| **換 logo** | Basic 群的 Logo 項上傳品牌 logo；網站 topbar、header、footer 三處同步替換（鎖寬度、高度等比） |

改到滿意 → 按 topbar 右上的 CTA「**儲存並更新 · v\<N\>**」：先跳防呆彈窗列出「改了哪些」，確認才寫回 `projects/<名稱>/`（`tokens.export.json`＋`components.export.json`＋`selection.state.json`）並把專案版本 +1。跟 CC 說「**匯出好了**」繼續。

### 然後 CC 會：

```
✅ build + 套 token（跑 Gate 2 HARD 完整性檢查）
   → 從 library 複製你勾的元件、套上 tokens.export.json 的最終值
   → 檢查 token-policy、每顆元件軸與 export 一致；有違規會擋下、修完才繼續

✅ 寫進 Figma
   → 建 Figma 檔（Q6a 工作空間、Q6b 檔名）
   → Variables：把 token 綁成 Figma 變數
   → Component sets：每顆元件的軸 → Figma variant / boolean property
     （你在網站怎麼切換樣式，Figma 就怎麼切換）
   → 對齊 framework/production/figma-rules.yaml：4 頁結構、命名、綁 token、nested INSTANCE_SWAP

✅ Step 4.5 post-build audit
   → CC 自己 walk Figma 檢查（Page=4 / SECTION 結構 / 命名 / token-binding / nested INSTANCE_SWAP…）
   → FAIL 自動修、再跑一次；修不掉的標 pending 給後續
```

### 全程 Figma 結構（寫死 4 頁 + 頁面 rebuild 時額外開頁）

```
1. Cover
2. Foundations   ← 所有 token 在單一 SECTION 內、往下堆疊
3. Components    ← Basic → Complex → Card → Table&Chart 往右（documentation instance）
4. Masters       ← 所有 master sets（元件主源頭，改元件到這頁、其他頁 instance 自動跟著動）
+ Pages/<name>   ← 有做頁面 rebuild 才額外開、不計入 4 頁 DS 結構
```

### Icon library 整合

CC 不會自己畫 icon，改 INSTANCE_SWAP 到公用 icon library（`framework/production/icon-library.yaml` 設定、framework 維護，預設 Line style）。找不到對應 icon → 標 `pending-icon-resolution`，不會用文字或 unicode 字元假冒。
> 專案自己在 Figma 新畫的 icon，可用 sync 拉進網站顯示（見 Part 5「日後同步」）。

---

## Part 4 — 跑完後要拿到什麼

### 專案資料夾應該長這樣

```
projects/<客戶>-<日期>/
├── opening-interview.md       # 你 Q0–Q9 的答案
├── design-principles.md       # 設計原則
├── proposal.json              # CC 的提案（token 值 + 預勾元件）
├── selection.state.json       # 你在網站的最終選取
├── assets/logo.<svg|png>      # 專案 logo
├── tokens.export.json         # 最終 token 表
├── components.export.json     # 元件需求（id + 你選的軸）
├── library.version.json       # 專案元件庫版本 + 更新紀錄
├── output/                    # build 出的 DS + GATE 報告 + 給 FE 的 pack
├── seed/                      # 互動原型 / mock data（給 FE 接）
└── preview.html               # 定案後 bake 的自包含預覽（可寄客戶）
```

Figma URL 會列在 CC 的完成訊息與 `output/` 報告裡。

### 想要一份能單獨寄客戶 / 歸檔的頁

跟 CC 說「**幫我 bake `<名稱>` 的預覽頁**」→ CC 把引擎＋你的狀態烘成一份**自包含 `preview.html`**（logo、token 值都 inline 寫死，離線可開、可直接寄）。

### 把成果推上去（自動部署）

```
git add projects/<名稱>            # 只加你的專案，別動 framework/、library/
git commit -m "<專案名>：初版 DS"
git push
```

push 到 `main` → Vercel 自動部署，幾分鐘後線上網站（https://cool-ds-library.vercel.app/ ）就能看到。不熟就跟 CC 說「**幫我 push 上去**」。

> ⚠️ 只提交 `projects/<名稱>/` 下你的產出。`framework/` 是唯讀治理層、`library/gallery.html` 是共用引擎，**別在跑專案時改到它們**。

---

## Part 4.5 — 日後同步：Figma 或程式碼被改過時

專案上線後，Figma 或程式碼任一邊有人動過，用 sync 腳本抓差異對齊（不用一開始學，之後要用再翻）。整段直接跟 CC 說「**幫 `<名稱>` 跑一輪 sync**」即可，CC 會：

1. 生程式碼端元件指紋、用 Figma MCP 拉 Figma 現況 snapshot
2. 跑 token / component 兩軌 drift 報告，把差異分四類（📥 只在 Code／📤 只在 Figma／⚠️ 值不一致／🎨 Figma hygiene）
3. 列清單給你 confirm 該怎麼歸位（要不要寫回 library / 補 token）

- 吃回 Figma 改動後，網站的**專案版本 +1**、「更新紀錄」頁記一筆。
- 母元件庫本身的版更則在網站「版本紀錄」頁（右上角版本號＝目前引擎版本）。

> 細節見 `sync/README.md` 與 `sync/SYNC_PROMPTS.md`；`projects/_demo/sync/` 是一份乾淨往返範例。

---

## Part 5 — 常見問題

### Q: CC 沒問我某一題、直接跳了？

通常不是 bug —— CC 從你給的 spec / CI 已經抓到答案，就不重複問（spec-first）。打開 `opening-interview.md` 確認那題答案有沒有出現。

### Q: 網站打不開 / 開起來空白？

線上版直接開 https://cool-ds-library.vercel.app/。本地版多半是 server 沒起或快取——跟 CC 說「**重開 `<名稱>` 的預覽**」，或網址後加 `?project=<名稱>&fresh=1` 強制重載。

### Q: 網站上改了 token 但 Figma 沒變？

Figma 是在「寫進 Figma」那步才寫入的。**先在網站按「儲存並更新」匯出**、CC 再 build + 推 Figma。網站只是選取 / 預覽。

### Q: logo 換了但深色模式下看不到？

客戶 logo 不會自動反白。可以在網站上淺 / 深各傳一顆，或讓 logo 墊固定淺底——跟 CC 說一聲即可。

### Q: CC 選的元件跟我想的不一樣？

就在網站上直接勾 / 取消勾調整。語意配對需要人工 review、無法 100% 對應你心中的意思，CC 只是預勾建議。WF 階段有疑慮直接喊 CC「你之前套 X、我想改成 Y」。

### Q: 跑很久（超過 30 分鐘）沒動靜？

多半是「寫進 Figma」那步動作多、慢正常（15–20 分鐘）；或 CC 卡在某題等你回應——看 CC 最後一句。

### Q: Q0–Q9 答錯了？

直接喊 CC「我 Qx 想改成 yyy」，CC 會回填 `opening-interview.md` 與後續產物。**不要**自己手動改檔（順序會亂）。

### Q: Phase 0.5 的 design-principles 我覺得不對？

直接喊 CC「第 X 條改成 ___」或「整份重寫、用 ___ 的方向」，CC 會重產。這份是後續所有設計決策的 anchor、一定要 review 對齊才往下。

### Q: 一定要先把 cwd 切到哪嗎？

不用。Q0 會問。**唯一禁忌**是把產出寫到 `framework/`（唯讀治理層），CC 會自動擋下。

### Q: 中途想停？

按 Ctrl+C 停 CC。已產出的檔會留著，下次叫 CC「繼續上次的 ds-studio 流程」可接著跑。

---

## 對應版本

- 主控 skill：`ds-studio-flow`（復用 `framework/skills/ds-architecture-flow` 的 Phase 0、Gate、figma-rules）
- framework 快照 `VERSION`：見 `framework/VERSION`（目前 0.8.2）／來源見 `framework/VENDORED.md`
- 線上網站：https://cool-ds-library.vercel.app/（push `main` 自動部署）

> studio 更新 → 這份文件可能也更新，`git pull` 同步。不確定任何指令，直接叫 CC 幫你跑。
