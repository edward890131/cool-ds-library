---
name: ds-architecture-flow
description: Orchestrate the full F-flow (CD → CC → Figma) using **the cloned framework repo (folder containing L0-scope-manifest.yaml + L4-archetype-library.yaml + VERSION)** as the central governance schema. Encodes 4 Gates with explicit L0/L4 references at each, plus a reverse-audit mechanism (Gate 4) that auto-proposes L0/L4 extensions from hand-built / approximation findings. Triggers when user wants to "走完整 F 流程"、"用 L0/L4 規範跑一遍設計"、"產品從 CD 出貨到 Figma 全程套用 DS Architecture"。NOT for one-off page rebuilds with an existing Figma DS (that's `/visual-to-figma-ds` skill).
---

# DS Architecture F-flow runner

## When to trigger

User wants to run the full design-to-Figma pipeline where `/AI projects/DS Architecture/` (L0 manifest + L4 archetype library) serves as the **central spec that all Gates reference**. Typical phrasings:

- "走 F 流程把 X 產品建起來"
- "用 L0/L4 跑一遍設計流程"
- "從 CD 出貨開始、用 DS Architecture 規範到 Figma 完工"
- "進一輪設計、要從 CD → CC → Figma 全部對齊 DS Architecture"

**Do NOT trigger for**:
- 已有 Figma DS、單純重建一頁 → use `/visual-to-figma-ds`
- 純 token / 純元件建構（沒有 CD 介入、沒有頁面交付）→ direct work
- 規範文件本身的修改（更新 L0 / L4 schema）→ direct edit by user

## Prerequisites

Before this skill can run, the following must exist:

| Artifact | Path | Required state |
|---|---|---|
| L0 scope manifest | `/AI projects/DS Architecture/L0-scope-manifest.yaml` | foundations + components 至少 80% 已列；schema 完整 |
| L4 archetype spec | `/AI projects/DS Architecture/L4-archetype-spec.yaml` | ✅ 已存在 |
| L4 archetype library | `/AI projects/DS Architecture/L4-archetype-library.yaml` | ✅ 至少 7 starter archetypes |
| PRD (with DS structure section) | user-provided path | DS 章節已寫（可在 Phase 0 詢問取得） |
| Design Principles | user-provided path or inline | 通則性、可作為 lint reference（可在 Phase 0 詢問取得） |

**Will work but degraded** if missing:
- L3 canonical state taxonomy → required-states 詞彙無法統一驗證；先以 ad-hoc 跑、累積後一致化
- L1 primitive token values → Step 2 build 階段 token 沒實值可填；可用 placeholder
- L2 semantic alias → 同上
- production/code-rules + figma-rules + mapping → Step 3 push Figma 細節缺；可後續補

---

## Phase 0 prelude — Framework 路徑自動偵測 + 必讀檔(HARD,Q0 之前)

**v0.7.1 新增**(2026-06-17 SME Level 2 自驗 harvest):skill description 寫死絕對路徑導致 CC 詢問;CC 不讀 figma-rules 就動工。本 prelude 強制把這兩個基底處理掉、再進 Q0。

### Step prelude.1 — Framework repo 自動偵測(**不問 user**)

CC 必須**自己定位 framework**、不可問 user「要用哪個路徑」:

1. cwd 是否含 `L0-scope-manifest.yaml + L4-archetype-library.yaml + VERSION` 三檔?
   - 是 → framework path = cwd、繼續
2. 不是 → 往 parent 走最多 3 層找含上述三檔的 dir
   - 找到 → framework path = 該 dir
3. 仍找不到 → 看 `~/.claude/skills/ds-architecture-flow` symlink 的 readlink target
   - 解析 symlink、找其 parent 包含上述三檔的 dir
4. 還找不到 → HARD block,提示「請 cd 進 framework repo,或 `git clone`」

✅ CC 偵測到 framework path 後、寫進 opening-interview.md 開頭的 `Framework path: <abs>` 欄位。
❌ 不允許詢問「要用 path A 還是 path B」(v0.7 Level 2 此問題復現,寫死絕對路徑導致)。

### Step prelude.2 — 必讀檔 HARD

CC 進 Q0 之前必須**逐字讀完**以下三檔(不可摘要、不可跳):

```
<framework>/CLAUDE.md
<framework>/L0-scope-manifest.yaml
<framework>/L4-archetype-library.yaml
<framework>/production/figma-rules.yaml
<framework>/production/icon-library.yaml
<framework>/production/code-rules.yaml(只看 presets 區段)
<framework>/themes/_base.theme.yaml
```

**為什麼 HARD**:v0.7 Level 2 自驗 6/12 觀察都是「skill 寫了但 CC 沒按 figma-rules / L0 結構建」、根因 = **CC 沒讀 figma-rules**。寫死必讀檔是治本。

### Step prelude.3 — Echo summary(HARD,給設計師確認 CC 真的讀了)

CC 把以上檔案的關鍵設定 echo 一段給設計師:
```
✅ Framework path: <abs>
✅ Skill version: v0.7.1
✅ Framework version: <VERSION>
✅ L0 components 已掃: N entries
✅ L4 archetypes 已掃: M entries
✅ figma-rules.yaml 已讀: file-structure / auto-layout / naming / specimen-rendering / style-guide-presentation
✅ icon library: <library-name>(libraryKey: lk-...)
✅ base theme: status=<scaffold | ready>、N primitives、M semantic
```

設計師看到這段才繼續、缺項 / 錯項立刻喊停。

---

## Phase 0 — Opening Interview (HARD before any other phase)

**Empirically validated on JoiiNi F-flow trial 1 (2026-05-17 → 2026-05-19)**: skipping this phase means CC自己 judge brand color / dev stack / dark mode 等決策，導致 trial 1 大量越權。Path B 之後加 Phase 0.5 source-binding pledge 處理「CD 已產出後的紀律」，但 Phase 0 處理「CC 開始建框架前的 input 收集」。

CC 在跑 step 1 之前**必須主動問**以下問題（如果 user 已提供答案，跳過該題）。

**Universal pattern：spec-first → 沒寫再問**
所有問題的執行順序:
1. 先 grep / read 設計師提供的 spec / PRD / CI 等輸入,**從中萃取答案**
2. 抓不到、或抓到的內容矛盾/不明 → 才問設計師(問題如下列 Q1-Q9)
3. 設計師回答後寫進 `opening-interview.md`,後續所有 step 以此為準

不要劈頭就把所有問題丟出去問人 —— 對能在 spec 抓的東西這樣做會擾民。

**三層問題嚴重度（govern「沒給/抓不到怎麼辦」）:**
- **HARD** — 不給就**炸**,必須阻斷流程等回答(沒這項,下游一定錯)
- **ask-first-deferred-OK** — 必問,但若 user 明確答「**之後補**」,標 `pending: true` + 用 fallback 推進,後補時回填
- **SOFT** — 可不答、CC 用 sensible default、輸出後標 `assumed-default`
- **not-applicable** — 該項目對「本階段/本專案」不適用(例:純建 DS、不做頁面 → WF not-applicable),跳過後續依賴它的 step

### Q0 — 專案資料夾(HARD,必須最先確認)

> 「跑 skill 前必須先有專案資料夾(放 inputs / theme delta / output 等)。選一個方式:
>   - **(A) CC 幫我建** → 給「想建在哪個目錄」+「資料夾名稱」,CC 自動 mkdir + 複製 `_project-template/` 骨架 + cd 進去(**推薦給第一次跑的成員、取代手動建路徑**)
>   - **(B) 已有資料夾** → 給絕對路徑(例:`~/Desktop/快電商-DS`),CC `cd` 進去
>   - **(C) 不確定** → CC 用「當前 cwd」當專案位置;cwd 是框架 repo 自己時擋下(避免污染)」

為什麼放最前面、為什麼 HARD:
- 後續所有 Q 的 output 都要寫進 `<project>/`,沒先定位資料夾會錯地方
- 寫到框架 repo 內 = 污染唯讀框架(違反 CLAUDE.md 鐵則 1)、寫到 home 散亂

Q0 答完後 CC 把專案絕對路徑記在 opening-interview.md 開頭、後續 step 都對著這個路徑寫入。

### Q1 — CI / 品牌規範文件(HARD,spec-first 起點)

> 「請提供 CI / 品牌識別文件(PDF / Notion / 品牌書 / 連結):
>   - 有 → 丟過來、給檔案路徑或拖進來,CC 從中萃取色彩 / 字體 / logo / 品牌調性 / 設計概念
>   - 暫時沒有 → 標 `pending: true`,Q3 brand 答案當 fallback 推進;CI 到位後跑一輪「升級設計概念」回填」

CI 是視覺權威源、後續 Phase 0.5 design-principles 跟 Step 3 build 的 token 主要依據。**沒 CI 也可跑,但 CC 必須 flag「視覺判讀為 v0.1-provisional」**,等 CI 到位再升 v0.2。

### Q2 — 規格 / PRD(HARD,scope 來源)

> 「請提供以下其中一項:
>   - **PRD**(檔案路徑 / markdown / PDF;含對象 / 成功指標 / 頁面架構等較完整)
>   - **規格 / 專案計畫書**(功能需求清單;缺 PRD 級維度時 CC 用 sensible default + 標 `assumed`、跟你 confirm)」

影響:
- L4 archetype 對應 page 的判斷
- **Phase 0.8 scope inventory:CC 從規格 extract 需要的元件 subset、不全套**
- L0 component scope 篩選的依據

**SME L5 模板情境常只拿到規格,接受規格也能跑**,但 CC 要列出用了哪些 default。

### Q3 — Brand 視覺確認(HARD,Q1 CI extract 結果讓設計師 confirm)

CC **不要直接問設計師色彩字體**,而是先從 Q1 CI 自動萃取、列出來給設計師 confirm / 補充:

> 「我從 Q1 CI 文件萃取了:
>   - 色彩:<hex 列表>(主色 / 副色 / 灰階 / feedback)
>   - 字體:<中文字體 / 英文字體 / weight 覆蓋>
>   - 整體調性:<keyword,如 warm / energetic / 圓潤俏皮>
>
>   你 confirm?或要補充 / 修正?
>   (沒 CI 的話、請直接給色彩 hex / 字體 / 調性,當這次的 brand anchor)」

**Don't** continue without at least one color anchor。CC 自己 judge brand color 是 trial 1 主要越權點。

### Q4 — Path(HARD,專案級決定)

> 「DS 要怎麼建?兩條 path 二擇一:
>   - **Path 1(Figma 路線)** — CC 直接依框架建 DS、寫進 Figma。多數情境用這條。
>   - **Path 2(第三方路線,目前只支援 CD)** — CC 把 Q1 + Q2 + 規範打包給 CD,CD 建出 DS + 設計後 CC 收回整合寫 Figma。」

差異:
- Path 1 = framework → Figma 直線,CC 全程主導
- Path 2 = framework → CD → Figma round-trip;Path 2 接回由 `cd-handoff-rebuild` skill 處理(已驗證、不重發明)

### Q5 — Dev Stack(HARD,layered resolution)

**不是直接問設計師**。Q5 走三層解析:

1. **讀框架 base**:`framework/production/code-rules.yaml` 抓 presets
2. **讀專案 delta**:`<project>/code-rules.delta.yaml`(如有)抓 preset-id
3. **merge 後判斷**:
   - delta 已選 preset(非 custom)→ 不問設計師,直接用 merged 結果
   - delta 不存在 / preset-id 空 → 把 presets 清單給設計師看、讓他選一個(預設 highlight `recommended: true`)
   - 設計師選 `custom` → **停下來、提示「請 FE 補 code-rules.delta」**,標 `pending-fe-code-rules-delta`

**HARD 模糊 fallback**:框架 base 給多選 + delta 沒挑 → **找 FE,不問設計師**(設計師不該回答「React 還是 Vue」)。

skill 把選擇結果寫進 `<project>/code-rules.delta.yaml` 的 `preset-id`(如果原本不存在、skill 從 `_project-template/code-rules.delta.yaml` 複製)。

### Q6 — Figma DS 檔(HARD,含 workspace + 檔名)

CC 問 Q6 主問題:

> 「是否有既有 Figma DS file?
>   - 有 → 提供 file key(後續 backfill 用)
>   - 沒有,請開新檔 → 必須接著 Q6a + Q6b
>   - 部分有(別專案 DS,參考不延用)→ 標 `partial`」

**只要選「開新檔」就必問 Q6a + Q6b**(2026-06-16 SME harvest:不問會落 CC 預設帳號根目錄、彼此覆蓋):

#### Q6a — Figma 工作空間(HARD,開新檔時)

> 「新檔要建在哪個 Figma team / project / folder?
>   - 給 team 名稱 / project 名稱(例:`GOONS 果思設計 / SME-trials/`)
>   - 不熟 → CC 列當下 Figma 帳號可用的 team/project 給你選」

#### Q6b — 檔名(HARD,開新檔時)

> 「Figma 檔名怎麼定?
>   - 預設規約:`<品牌名> - DS - <成員名> - <日期>`(例:`JoiiNi - DS - 鎮瑜 - 2026-06-16`)
>   - 自選 → 給字串、CC 直接用」

### Q7 — Dark mode(SOFT)

> 「Dark mode 是否需要?
>   - 立即建(token 雙 mode + Figma Variables 雙 mode)
>   - 之後補(先 light only,token 結構預留 dark slot)
>   - 不需要(純 light)」

決定 token JSON 結構 + Figma collection modes 數量。

### Q8 — WF / 頁面架構(ask-first-deferred-OK / not-applicable,post-path 追問)

> 「有沒有已設計好的頁面架構?(WF 或 mockup 都可)
>   - 引用團隊既有 `wf-templates/`(指明哪些頁套哪個模板)
>   - 客戶 / PM 提供的 WF 檔(圖檔 / Figma WF / 手繪)
>   - 用 `mockup-to-ia` skill 從現有 mockup 反推 IA
>   - **暫時沒有、之後會補** → 標 `pending: true`,後補可被 inject 替換
>   - **沒有也不打算做** → 標 `not-applicable: true`(純建 DS、不做頁面 rebuild)」

依 Q4 path:
- **Path 1**:WF 作為 Figma rebuild 的參照
- **Path 2**:WF 跟 Q1/Q2 一起打包進 CD pack

三種 status:
- **provided** → 正常跑頁面 rebuild
- **pending** → Path 1:CC 從規格推測頁面清單 + 套 wf-templates 當 placeholder;Path 2:CD pack 標明「pending-wf」
- **not-applicable** → Phase 0.6 path branch 後**只跑到 DS 建完就停**(教學試跑、純 DS 交付情境)

### Q9 — Responsive 設定(spec-first → 沒寫再問)

兩個子題,先 grep spec/PRD,沒寫才問:

> **9a. Breakpoint 值**
> 「斷點怎麼定?
>   - 規格通常會寫(例:`360 / 768 / 1024 / 1280`)
>   - 規格沒寫 → 用 default `360 / 768 / 1024 / 1280` 或設計師指定
>   - 值寫進專案 theme delta 的 L1 primitive.breakpoints」

> **9b. Responsive-layout 啟用 / 哪些 archetype 要做**
> 「跨斷點 reflow 規則要不要做?
>   - Web stack(React/Vue web)→ **預設 required** 所有 archetype
>   - App stack(native / RN)→ **預設 ask**(看是否做 RWD layout)
>   - 規格指定就照規格;沒指定帶 default 問設計師 confirm」

決定影響:
- L1 primitive.breakpoints 的值
- L0 components 的 `responsive-behavior` 欄位是否要填(元件級 reflow,如 modal mobile 變 route)
- L4 archetypes 的 `responsive-layout` 欄位是否要填(頁面級 reflow 編排)

### Phase 0 output

CC 把答案存到 `<project>/opening-interview.md`：

```markdown
# Opening Interview — <project-name>
Date: YYYY-MM-DD

Q0 Project folder:
  - Path: <absolute path, e.g. /Users/.../Desktop/快電商-DS>
  - Created-by: <existing | scaffolded-from-template | cc-created>
  - Cwd-warning-triggered: <yes | no>  (yes if cwd 是框架 repo 而擋下)

Q1 CI:
  - Status: <provided | pending>
  - Source: <path / URL>  (if provided)
  - Extracted: <色彩 / 字體 / logo / 調性 summary>  (if provided)
  - Expected-by: <date / condition>  (if pending)

Q2 Spec / PRD:
  - Type: <prd | spec>
  - Location: <path / URL>
  - Assumed defaults (if spec only): <list of fields where CC used defaults>

Q3 Brand visual (confirmed):
  - Source: <extracted-from-Q1-CI | designer-input | hybrid>
  - Color: <hex / keyword>
  - Typography: <font choice>
  - Mood: <keyword>

Q4 Path:
  - Choice: <path-1-figma-direct | path-2-cd-3rd-party>
  - Reasoning: <why this path>

Q5 Dev stack:
  - Source: <framework-base | project-delta | designer-pick-from-presets | pending-fe>
  - Preset-id: <react-tailwind-vite | vue-tailwind-vite | svelte-tailwind-vite | custom>
  - Framework / Styling / Bundler: <derived from preset>
  - Code-rules-delta-path: <project>/code-rules.delta.yaml
  - Pending-fe-reason: <if preset = custom>
  - Code Connect: <yes / no / later>

Q6 Figma DS:
  - File-key: <key or new>
  - Scope: <full | partial | fresh>
  - Q6a Workspace: <team / project / folder>  (if fresh)
  - Q6b Filename: <string>                     (if fresh)

Q7 Dark mode:
  - Decision: <immediate | later | no>

Q8 WF:
  - Status: <provided | pending | not-applicable>
  - Source: <wf-template-ref | external file | mockup-to-ia output>  (if provided)
  - Placeholder strategy: <which wf-templates used as fallback>  (if pending)
  - Expected-by: <date / condition>  (if pending)
  - Reason: <e.g., DS-only run>  (if not-applicable)

Q9 Responsive:
  - Breakpoint values: <[360, 768, 1024, 1280] or per-spec>
  - Source: <extracted-from-spec | designer-input | default>
  - Responsive-layout enabled: <yes | no | per-archetype>
  - Per-archetype overrides: <list, if not uniform>
```

這份文件成為 Phase 0.5 + 後續 step 的 source of truth — CC 不可違背已 confirm 的答案做決策。**Pending 項目要被 follow-up**(見 Phase 0.5 + Gate 1)。

### Phase 0.7 — Brand 一致性檢查(HARD,Q1/Q2/Q3 全答完後執行)

**Empirically validated on JoiiNi DS test (2026-06-10)**: trial 撞到 CI=JoiiNi 但 spec=快電商 的不一致,CC 即興處理。要把這個動作 codify 進 skill。
**2026-06-16 SME 試跑 harvest**:「正交解法」措辭技術太強、設計師卡住、看不懂。改成**三選一明文化**+ 情境舉例。

CC 在 Phase 0 答完 + 進 Phase 0.8 之前,**主動比對三個來源的「品牌身分」**:
- Q1 CI 文件指向的品牌(視覺權威源)
- Q2 spec/PRD 提到的產品名(規格寫的是「給誰做的」)
- Q3 設計師 confirm 的 brand 視覺

**判斷情境**:
- **一致**(三邊同一品牌)→ 直接過,不擾民
- **不一致** → flag 給設計師,**三選一明文化**(不要用「正交」這種技術詞):

  ```
  ⚠ 我發現品牌不一致:
    - CI(Q1) = <品牌 A>(視覺來源)
    - Spec scope(Q2) = <品牌 B>(元件範圍)

  你要怎麼處理?三選一:

  (1) 視覺取 A、功能 scope 取 B(各取一邊用)
      → **預設推薦**;適用「為 B 客戶做、但用 A 的視覺指南」情境

  (2) 全部以 A(CI)為準
      → spec(B)退場、純做 A 的 DS、scope 不對應 B 規格
      → 適用「教學試跑、只要視覺 DS、規格只是借用」

  (3) 全部以 B(spec)為準
      → CI(A)退場、用 spec 暗示的視覺風格自己 judge
      → 適用「CI 是誤給的、實際是 B 的 DS」
  ```

  設計師選 → 寫進 opening-interview.md 的 `Brand Consistency Check` 區段,後續一致依此處理
- **完全衝突**(三選一都不適用)→ HARD block,要求設計師釐清

寫進 opening-interview.md 一段:

```markdown
## Brand Consistency Check (Phase 0.7)
- Q1 CI 指向: <品牌名 / N/A>
- Q2 spec 指向產品: <產品名>
- Q3 confirmed brand: <品牌名>
- Consistency: <consistent | mismatch-resolved | mismatch-blocked>
- Resolution (if mismatch): <visual-from-A-scope-from-B | all-A | all-B | designer-custom | blocked-pending-clarification>
- Source authority: <CI | spec | hybrid>  ← 後續所有風格決定的權威源
```

### Phase 0.8 — Scope Inventory Confirmation(HARD,Phase 0.7 後、Phase 0.5 前)

**Empirically validated on SME 試跑(2026-06-16)**:CC 預設把 L0 全套元件拉進來建、不依規格篩選,設計師看到 70+ 元件嚇到。等成員提醒才回頭篩。**這步應該強制自動執行**,不能省。

CC 在 Phase 0.7 brand 一致性處理完後、Phase 0.5 設計原則開始前,**自動跑 spec-based scope filtering**:

1. **讀 Q2 spec/PRD**,parse 出明確 mention 的元件 keyword(button / 表單 / 卡片 / 列表 / modal / table 等中英文皆掃)
2. **Cross-reference L0**:列出 spec 提到 + L0 有對應 + 該專案明顯需要的 subset
3. **產出 scope inventory**,結構固定:

```
=========================================
   SCOPE INVENTORY — 等你確認
=========================================

根據:
  - Q1 CI: <品牌>
  - Q2 spec: <規格摘要>
  - Q3 brand: <confirmed>
  - Q4 path: <path-1 | path-2>

我會建出來的東西:

【Foundations(8 個 token 類別)】
  color / typography / spacing / radius / elevation / motion / grid / breakpoints
  (由 CI 萃取 + 規格 + framework base default 混合)

【Components(N 個,從 L0 篩出 spec 需要的 subset + 預設展度)】
  ⭐ v0.7.1 升級:列出每元件的 variant/intent 細節(不只總數)、設計師才能逐項確認

  基本(M個):
    button
      variants:        [solid, outline, text]
      intents:         [primary, secondary, danger]
      sizes:           [s, m, l]
      states:          [default, hover, pressed, disabled](無 focus)
      booleans:        [show-leading-icon, show-trailing-icon](v0.7.1 加,取代 icon-only variant)
      formula:         3 × 3 × 3 × 4 = 108 variants ★ 全展(documentation 重點)

    input
      variants:        [outline, filled]
      booleans:        [with-label, with-hint, with-leading-icon, with-trailing-icon](v0.7.1 改 boolean)
      states:          [default, hover, focus, filled-value, disabled, error, success]
      formula:         2 variants(boolean 不入 variant 矩陣、show by props)

    password-input
      variants:        [outline, filled]
      axes:            Reveal [Masked, Visible](v0.7.1 加,與 eye 點擊連動)
      states:          [default, hover, focus, filled-value, disabled, error, success]
      formula:         2 × 2 = 4 variants

    search
      variants:        [default]
      booleans:        [with-button](v0.7.1 改 boolean)
      states:          [default, hover, focus, filled-value, disabled, has-suggestion]
      formula:         1 variant

    tag
      variants:        [solid, outline, soft]
      intents:         [brand, neutral]
      formula:         3 × 2 = 6 variants

    badge
      variants:        [subtle, solid]
      intents:         [brand, neutral]
      formula:         2 × 2 = 4 variants

    pagination
      variants:        [numbered, prev-next]
      composition:     prev-button + next-button(雙邊箭頭、icon-button INSTANCE_SWAP)+ page-button + ellipsis
      formula:         2 variants

    breadcrumb / tab(+ tab-item × 3)/ icon / etc...

  回饋(K個):
    alert
      layout-variants: [banner, stacked, compact]
      variants:        [soft(預設), outline, solid](v0.7.1:預設 soft、避免整個底層套色)
      intents:         [success, warning, error, info]
      composition:     icon + title + body + cta(button)+ dismiss(icon-button)
      formula:         3 × 3 × 4 = 36 variants

    tooltip            1 variant
    notification       36 variants(同 alert 軸數但 position-variants 不同)

  複雜(L個):
    card / table(+ table-header / table-row / table-cell / table-footer)
    modal / calendar(+ calendar-day × 42 INSTANCE_SWAP)
    header / footer / article-card / ...

  總計:約 <X> variants
  設計師如果覺得某個元件展度太多、可以喊「button 不要 size 軸」等調整、CC 重算後 confirm。

【明確排除】
  - <L0 有但這次 spec 沒需要>:menu / cascader / multi-select / file-input 等(可隨需新增)

【Nested 結構】
  - alert 內含 icon-button(dismiss)+ button(cta)
  - notification 內含 icon-button(close)
  - calendar 內含 calendar-day × 42 + icon-button(prev/next)
  - pagination 內含 icon-button(prev/next)+ button(page-number)
  - tab 內含 tab-item × N
  - 所有 icon → INSTANCE_SWAP 到 `production/icon-library.yaml` 設定的 team library

【Output 檔案】
  - output/tokens/{primitives,semantics}.json
  - output/components/component-specs.yaml
  - output/preview/tokens.html + components.html
  - Figma file(將建在 Q6a workspace、用 Q6b filename、4 頁結構)
  - 4 份報告(opening-interview / design-principles / GATE2 / GATE3 / ITERATION)

【預計時長(v0.6 Step 切細後)】
  Step 3a tokens build:                ~5 min
  Step 3.5a tokens preview + Review:   ~3 min
  Step 4a Foundations push + Review:   ~5 min
  Step 3b components build:            ~5 min
  Step 3.5b components preview + Review:~3 min
  Step 4b1-3 Components Basic/Feedback/Complex push:  ~10 min(分三段、每段 Review)
  Step 4c Masters push:                ~3 min
  Step 4.5 audit:                      ~1 min
  總計:                                 ~35-40 min

請確認 scope 對嗎?
  - [ ] 全部 OK,繼續
  - [ ] 想增減元件:____
  - [ ] 想調整展度(例:button 砍 size 軸 / tag 加 state 等):____
  - [ ] 想換 scope mode:輕量(只建 starter 5-10 個)/ 全建 / 部分建
=========================================
```

4. **設計師 confirm** → 寫進 opening-interview.md 的 `Scope Inventory` 區段,後續 Step 3 build 嚴格按此 subset、不擴張
5. **不 confirm 就不繼續**(HARD block)

**為什麼 HARD**:SME 試跑 CC 預設把 L0 全套(70+ 元件)都拉進來建、設計師看了驚嚇,還得人工介入篩。這步必須機器自動跑、避免 dump 全集。

寫進 opening-interview.md:

```markdown
## Scope Inventory (Phase 0.8)
- Source: <Q2 spec/PRD + L0 cross-reference>
- Confirmed components: <list, N items>
- Excluded: <list>
- Scope mode: <starter | filtered | full>
- Designer confirmed: <yes | no>
```

---

## Phase 0.5 — 產出 per-project Design Principles（Phase 0 output 後立即）

**為何要做**：鎮瑜的 design-principles.md 形態（敘事豐厚：標語 + 為什麼 + 怎麼落實 + 反例）證明比表格式 Q1 答案更能驅動下游 DS / 頁面決策。**Phase 0 收集 input、Phase 0.5 產出設計概念文件**，這份文件接 Step 2 driver。

### 觸發

Phase 0 完成後（含 Q6 deferred 的情境也跑、用 Q1 fallback）。

### 輸入

- `opening-interview.md` 全部欄位
- Q6 CI 文件內容（若 provided）
- Q1 brand text（若 Q6 pending、當 fallback source）

### 輸出

`<project>/design-principles.md`，採鎮瑜風格敘事豐厚格式：

```markdown
# <project-name> Design Principles · 設計原則

> 版本：v0.1（<date>）  
> 適用：<project description>
> 對象：未來自己 / 協作者 / AI 助理在做設計或前端決策時，用這份文件對齊基準。

## 為什麼需要設計原則
<從 Q3 spec/PRD 萃取的產品定位 + Q1/Q6 brand 推導>

## 1. <第一條原則的標語>
> **<一句口號>**
### 為什麼
### 怎麼落實
### 反例 ❌

## 2. <第二條>
...

（建議 5-7 條，過多會稀釋、過少不足以驅動決策）
```

### 跑出來給誰看 / 怎麼用

- **設計師 review** 必經（這份是後續所有設計決策的 anchor，不對齊一定要改）
- 通過 review 後，**寫進 `<project>/` 變專案輸入**（同 PRD、CI 並列）
- Step 2-6 都會引用本檔做決策

### Q6 pending 時的特例

CI 還沒到、design-principles 用 Q1 brand text 當 fallback 產出時：
- 文件版本標 `v0.1-provisional`
- meta 加 `pending-source: ci`
- CI 到位後跑一輪「升級設計概念」（讀 CI、跟原版 diff、提案更新項給設計師審）→ 版本升 v0.2、移除 provisional 標記

---

## Phase 0.6 — Path branch（依 Q7 分岔 + Q8 not-applicable 短路）

Phase 0.5 產完 design-principles 後，依 Q7 path choice + Q8 WF status 分流：

### Q8 = not-applicable 的特例（DS-only 模式）

如果 Q8 status = `not-applicable`（純建 DS、不做頁面 rebuild）→ **不分 path、直接走「DS-only 子流程」**：
- Step 3 build（CC build Design Token + component library per L0 spec）
- Step 4 push to Figma（Variables + Component sets per L0 schema）
- **跳過 step 5 / step 6**（無 designer refine page、無 rebuild mockup）
- Gate 2（commit gate HARD）+ Gate 3（Figma DS 完整性 soft）照跑；Gate 1 / 4 / 4.5 跳過（依賴頁面）

適用情境：教學試跑、客戶只要 DS 不要頁面、純 brand DS package。

### Path 1（Figma 路線）— 走下方 F-flow 簡化版（Q8 有效時）

跳過 step 1（CD generates mockup）。直接從 step 2 起跑、但 input 來源不是 CD output，而是：
- L0/L4 framework + Phase 0.5 design-principles
- Q8 WF（若有，當頁面架構參照；若 pending，CC 從規格推測）
- Step 3 build → step 4 push Figma → step 5 designer refine → step 6 rebuild pages in Figma（仍可委派 `visual-to-figma-ds` 處理單頁 rebuild）

Gates 1-4 + 4.5 行為照舊（governance 不變）。

### Path 2（CD 第三方路線）— 打包 + 委派(v0.7 升級)

完整 Path 2 流程(v0.7 跟 cd-handoff-rebuild align):

```
Phase 0(Q0-Q9)→ Phase 0.5(design-principles)→ Phase 0.7(brand 一致性)
                                                      ↓
Phase 0.8(scope inventory 第 1 次,Stage 0 之前跑)
   - 從 Q2 spec 篩 L0 元件 subset
   - 列出 composition / default-expansion / 預估 variants 數量
   - 設計師 confirm
                                                      ↓
[Stage 0 pack]
   - 打包 Phase 0+0.5 + scope-inventory.md → <project>/cd-pack/
                                                      ↓
[handoff to CD,external]
                                                      ↓
[Stage 1 fetch CD bundle](委派 cd-handoff-rebuild)
                                                      ↓
[Gate 1 L4 archetype required-states audit]
                                                      ↓
[Stage 2 gap analysis + Phase 0.8 scope inventory 第 2 次]
   - reconcile CD 產出 vs scope-inventory
                                                      ↓
[Stage 3 backfill 3 layers + v0.7 reformat]
   - built-ds tokens / Figma Variables / 25-30 component sets
   - reformat 成 v0.6 4 頁結構(Page=4,SECTION 往右)
   - icon swap to Untitled UI library
   - build-time binding remediation(Path 2 例外、接受 patch,但 Stage 3 結束時 100%)
                                                      ↓
[Stage 4 page rebuild with source-binding pledge HARD]
                                                      ↓
[Stage 5 audit + visual iteration loop]
   - audit 14 項(v0.7 升級、跟 ds-architecture-flow v0.6 Step 4.5 同步)
   - Gate 4.5 DS-instance-required HARD
                                                      ↓
[本 skill Gate 4 — reverse audit → L0/L4 extension proposal]
```

**為何不重寫**:`cd-handoff-rebuild` 已涵蓋 CD bundle → Figma 完整 rebuild + 反向 audit、是 Path 2 接回段最成熟的 skill。本 skill 在 Path 2 模式負責「Phase 0+0.5+0.7+0.8 input 收集 + 打包 + 委派 + 接回後 Gate 4 governance」。

**v0.6 規則在 Path 2 的對應**:
- Build-time token binding HARD:Path 1 不接受 patch、Path 2 接受 Stage 3 一輪 remediation(時機後、結果同)
- Nested INSTANCE_SWAP HARD:Path 1 build 時強制、Path 2 Stage 5 audit + visual iteration 修正
- Page = 4:Path 1 Step 4 寫死、Path 2 Stage 3 reformat 收斂
- Icon library:Path 1 INSTANCE_SWAP、Path 2 Stage 3 swap CD 自帶 icon → Untitled UI library

詳細 alignment 表 + Stage 0 + Path 2 ITERATION 模板見 `cd-handoff-rebuild` SKILL.md 開頭的「v0.7 Path 2 alignment」段。

---

## The F-flow (6 steps + 4 Gates)

**註**：本節描述 Path 2 的完整 6 step 流程（CD 介入版）。Path 1 簡化版見 Phase 0.6。Gates governance 兩條 path 共用。

```
1. Designer provides Ref → CD generates mockup
                  ↓
2. CC receives CD output + PRD + Principles + L0 + L4
   ─ Gate 1 ✋ soft：列 CD output vs L4 archetype.required-states 偏差
                  ↓
3. CC builds Design Token + component library per L0 spec
                  ↓
   ─ Gate 2 ✋ HARD：L0 完整性 + token-policy 檢查
                  ↓
3.5a Local preview HTML — tokens(output/preview/tokens.html,純靜態 + 引用 tokens.css + CC 自動 open)
     → Designer Review tokens(色階/字級/間距/...)、改完 OK
                  ↓
4a.  push Foundations 頁(**單一 section、所有 token 往下堆疊**、v0.7.1 修正)
     → Designer Review Foundations 視覺
                  ↓
3b.  CC builds component specs(per L0,加 composition / default-expansion 資訊)
                  ↓
3.5b Local preview HTML — components(output/preview/components.html,精簡 Demo + 軸資訊)
     → 內含每元件:1-2 個 default instance + 展開公式(例:button 全展 108 variants)
     → Designer Review 方向、改完 OK
                  ↓
4b1. push Components 頁 — Basic SECTION
     → Designer Review Basic
                  ↓
4b2. push Components 頁 — Feedback SECTION
     → Designer Review Feedback
                  ↓
4b3. push Components 頁 — Complex SECTION
     → Designer Review Complex
                  ↓
4c.  push Masters 頁(所有 master sets,SECTION 依 category 往右)
                  ↓
   **v0.6 prescriptive Figma 結構**(寫死,2026-06-16 SME harvest):

   **Pages — 嚴格 4 頁**:
   ```
   1. Cover
   2. Foundations
   3. Components       (documentation 用、含 instance examples、無 master sets)
   4. Masters          (所有 master sets 集中、設計師 edit 唯一來源)
   ```

   **每頁內部結構**(v0.7.1 修正):
   - **Foundations 頁:單一 SECTION,所有 token 往下堆疊**(2026-06-17 SME harvest 修正:不再 8 SECTION 往右)
     - color / typography / spacing / radius / elevation / motion / grid / breakpoints 各 sub-section group 在同一個 SECTION 內往下
     - typography 用三欄表格(中 / 英 / 角色)
     - grid 用 Figma 原生 layoutGrid(不要手畫方塊)
     - 標注必齊:swatch label + hex + opacity / 字級 size+weight+lh / spacing px / radius px
   - **Components 頁:3 個 Figma SECTION 往右**(Basic → Feedback → Complex)
     - SECTION 內 section/<id> 往下 stack
     - **每元件必完整三軸 grid 展示**(variant × intent × state 全展、非截取)
   - **Masters 頁:3 個 Figma SECTION 往右**(Basic Masters → Feedback Masters → Complex Masters)
     - 只放 master sets

   **每頁根 frame 必須 AUTO_LAYOUT vertical**(寫死、不可 absolute x/y positioning)

   **Components 頁內部 section/<id> 結構**(寫死,v0.7.1 強化「完整展示 + 表格」):
   ```
   section/<component-id> (AUTO_LAYOUT vertical)
     ├── title (text, 綁 Text Style zh.h6)
     ├── usage-caption (text, 綁 Text Style zh.h8, from L0 description)
     └── specimen-frame (**表格排版**, 多軸元件必走表格)
        - instances 點向 Masters 頁的 master(跨頁連結)
        - 多軸元件(button / input / alert / ...) 用表格:
            row = state(default / hover / pressed / disabled)
            col = variant × intent 組合(每欄一個)
        - **完整展示所有 default-expansion 軸,不可截取代表性**(v0.7.1 強化、figma-rules 已寫但 CC 反覆沒做)
   ```
   ⚠ **spec-callout 拿掉**(徹底移除、不留 optional)
   ⚠ **Components 頁必有 documentation instances / Masters 頁必有 master sets — 兩頁都不可空**(v0.7.1 雙向 audit)

   **HARD rules**(任一違反 → Step 4.5 audit 會炸):
   1. **DS 頁 = 4**(寫死,Cover/Foundations/Components/Masters);**頁面 rebuild 額外開 `Pages/<name>` 頁、不計入** 4 頁 DS 結構(v0.8 修正:WF 試跑撞「DS 第 5 頁」問題)
   2. Foundations 頁 = **單一 SECTION + 所有 token 在內往下堆疊**(v0.7.1 修正、上輪 8 SECTION 錯)
   3. Components 頁 = 3 SECTION 往右 + 每元件**完整三軸 grid 表格展示**(非截取)
   4. **Components 頁不可空 / Masters 頁不可空**(雙向檢查、v0.7.1 新)
   5. 命名(v0.8 跟 figma-rules.yaml v0.2 對齊):
      - **Master name = L0 id 直接用**(`button` 不是 `btn`、`icon-button` 不是 `icon-btn`、`tab-item` 不是 `tab/item`)
      - **section frame name = `section/<L0-id>`**(documentation 包裝)
      - **variant property = `PascalCase=lowercase-with-hyphen`**(`Style=Solid`、`Layout-Variant=Inline-Card`、`Show-Leading-Icon=True`)
      - master 內部 layer = lowercase + underscore(`title_text`、`specimen_frame`)
      - 不可混用舊縮寫(btn / img / ill 等已 deprecated)
   5. **Build-time token binding**(v0.6 新增,2026-06-16 SME harvest):
      - 任何 fill / stroke / text 創建前,**Variable-first 三步**:
        - Step 1. 確認 token 的 Variable 存在(getVariableByName 或 createVariable + setMode)
        - Step 2. setBoundVariable 綁 Variable 到 node(不可先設 SOLID color 後綁)
        - Step 3. assert 綁定生效(node.boundVariables.fills?.[0] 必非空)
      - **禁止** node.fills = [{ type: 'SOLID', ... }] 直接設色
      - **禁止** text inline fontSize / fontWeight / lineHeight
      - 文字必綁 Text Style(zh/en × h1-h10)
      - font 必先 await loadFontAsync(family, style)
   6. **Nested INSTANCE_SWAP**(v0.6 新增,延伸 Gate 4.5 到 component-level):
      - L0 元件 composition 宣告的 nested(uses-component)必走 INSTANCE_SWAP
      - 任何 inline frame 對應 L0 已有元件 → FAIL
      - 例:alert 內 CTA 必 INSTANCE_SWAP 到 button master、icon 必 INSTANCE_SWAP 到 icon library
   8. **Icon library 整合**(v0.7.1 改 library-key):
      - icon 元件不在 project DS 自建 master,改 INSTANCE_SWAP 到 `production/icon-library.yaml` 設定的 team library
      - **改用 library-key**(team 等級、跨檔 INSTANCE_SWAP 用),file-key deprecated
      - 失敗 fallback:標 `pending-icon-resolution`、**禁止用 unicode / placeholder / emoji 模擬後再 swap**(2026-06-17 SME 復現 anti-pattern)
      - Phase 0 加「icon library 可存取性檢查」(無權時引導改指可用 team library)

   **Boolean vs Variant 原則**(v0.7.1 新增,2026-06-17 SME harvest):
   - **內容差異走 boolean property**:show-label / show-leading-icon / show-trailing-icon 等
   - **結構差異走 variant**:solid / outline / text 等視覺型態
   - 例:button 不再拆 icon-button 獨立元件、用 `show-leading-icon` / `show-trailing-icon` boolean 合併
   - 例:input 不用 with-label / with-hint variant、改 boolean
   - 例:search with-button 用 boolean
   - 違反 → 元件結構爆炸 + 維護成本高

   **Figma variant 策略**:
   - 依 L0 `default-expansion.axes` 決定展什麼軸
   - 多軸元件(button / input / alert)用**表格方式**展示(state 為 row,variant×intent 為 col)
   - **完整展示**所有 variant × intent × state、不可截取代表(framework figma-rules 寫過、CC 反覆沒做、v0.7.1 強調)
                  ↓
   ─ Step 4.5 ✋ HARD:Post-build Figma audit(本 skill 自動跑,任一 FAIL 不可結束 step 4)
                  ↓
5. Designer manually refines Figma DS, fills variants/components
                  ↓
   ─ Gate 3 ✋ soft：Figma DS 對照 L0 完整性提示
                  ↓
6. CC rebuilds mockup in Figma using DS (delegate to `visual-to-figma-ds` skill)
   **v0.8 新增 — 頁面 rebuild HARD rules**(2026-06-17 SME WF 試跑 harvest):
   - **產出位置:`Pages/<name>` 額外頁、不計入 DS 4 頁結構**(WF 撞「DS 第 5 頁」問題)
   - **「有就先建再套」原則**:rebuild 過程發現需要 L0 有但未建的元件 → 自動補建 master(Phase 0.8 scope cross-check during step 6)、不直接走 DSGAP
     - Phase 0.8 scope 排除的 L0 元件 vs 頁面實際需要 → 列出缺漏 → CC 補建 → 才繼續 rebuild
   - **複合元件內 image 預設 FILL**:card / article-card 等內含 image 的 master、image 預設 `layoutSizingHorizontal=FILL`(避免 resize 不跟隨)
   - **Instance text override 用直接子層**:`findChild()` / 已知 layer name 直接 set characters,不可用 `findOne(deep)` 抓到 nested tag 內文字
   ─ Gate 4 ✋ soft：hand-build / approx → L0/L4 extension proposal
                  ↓
   Designer reviews proposals → 進 L0/L4（reverse sync）OR mark page-level
```

## Gate-by-Gate reference

### Gate 1 — CD output 進 CC 時 (soft)

**Read**:
- L4 archetype matching this page's type (designer or CC infers from PRD)
- `archetype.required-states` + `archetype.typical-components`

**Check**:
- 該 archetype 的 required-states 是否都在 CD mockup 內表達
- 用到的元件是否落在 typical-components 範圍

**Output (no block)**:
```
=== Gate 1 偏差清單 ===
Page: <name>
Archetype: <from L4>

Required states coverage:
  ✅ idle (covered in mockup)
  ❌ validation-error (not shown — CD did not mock this state)
  ❌ submit-success (not shown)

Components used outside L4 typical:
  - <component> — not in L4.{archetype}.typical-components

Designer 決策：
  □ 請 CD 補畫 missing states
  □ 接受現狀、states 在後續 step 5 補
  □ 補進 L4.{archetype} 當新 typical-state
```

### Gate 2 — CC commit gate (HARD)

**Read**:
- L0 整份 (foundations + components)
- L0.components[*].token-policy

**Check**:
1. Every L0.foundations entry has a corresponding token file built
2. Every L0.components entry has a corresponding code-side implementation
3. Component implementations follow token-policy.allowed (e.g., no primitive.* direct binding)
4. variants / intents / states / sizes axes match L0 declared values

**Output (HARD block)**:
```
=== Gate 2 commit gate ===
✅ Foundations: 7/7 built
✅ Components: 14/14 built
❌ token-policy violations:
  - button.tsx line 23: uses primitive.color.green directly (forbidden)
  - tag.tsx line 12: uses primitive.spacing.4 directly (forbidden)

⛔ COMMIT BLOCKED — fix violations and re-commit.
```

### Step 3.5 — Local preview HTML (after Gate 2, before Step 4)

**Empirically validated on team 試跑 (2026-06-11)**: Step 4 push Figma 動作慢(10-20 分鐘),期間設計師沒東西看、且不確定 tokens / components 設計對不對。如果 push 完才發現方向錯,浪費整輪 Figma 工時。Step 3.5 加快回饋。

**Trigger**: v0.6 拆兩段 — Step 3.5a 在 Step 3a tokens build 完後、Step 3.5b 在 Step 3b components build 完後。各自 Designer Review 後才繼續。

**Purpose**:
- 給設計師看 tokens / components 樣態(在 Figma push 前)
- 早期 sanity check:設計師可以喊「顏色不對 / 元件樣子怪」、CC 修完才推 Figma
- 不替代 Figma(Figma 仍是 SSOT)、只是 fast feedback

### Step 3.5a — Tokens preview

**輸出檔案**: `<project>/output/preview/tokens.html`

**HTML 結構(寫死)**:
```html
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="../tokens/tokens.css">
</head>
<body>
  <h1>Tokens Preview — <project-name></h1>
  <section id="color">
    <!-- 每色階一行:swatch + token name + hex + opacity -->
  </section>
  <section id="typography">
    <!-- 中英 H1-H10 demo:中英並排、size/weight/lh 標注 -->
  </section>
  <section id="spacing"><!-- 視覺 bar + token + px --></section>
  <section id="radius"><!-- 圓角樣本 + token + px --></section>
  <section id="elevation"><!-- shadow 樣本 + token --></section>
  <section id="motion"><!-- duration 視覺 + easing 函數 --></section>
  <section id="grid"><!-- per-bp column overlay --></section>
  <section id="breakpoints"><!-- 視覺裝置寬度標注 --></section>
</body>
</html>
```

### Step 3.5b — Components preview(精簡 Demo + 軸資訊,**不全展**)

**輸出檔案**: `<project>/output/preview/components.html`

**Per #14 result**:preview 是「方向確認用」、不是 documentation。每元件只展 1-2 instance、附**展開軸資訊 + 數量公式**讓設計師預知 Figma 會建多少。

**HTML 結構(寫死)**:
```html
<body>
  <h1>Components Preview — <project-name></h1>
  <!-- 每元件一個 card -->
  <article class="component-card">
    <h2>Button (button)</h2>
    <p class="usage-caption">動作元件、L0 description from L0</p>
    <div class="demo">
      <!-- 1 個 default state instance:variant=solid, intent=primary -->
      <button class="solid primary">Confirm</button>
      <!-- 1 個對比 state instance(突顯軸特色) -->
      <button class="outline secondary">Cancel</button>
    </div>
    <small class="expansion-info">
      Figma 展開:variant × intent × size × state = 3 × 3 × 3 × 4 = <strong>108 variants</strong>
      (default-expansion: 全展、button 為 documentation 重點)
    </small>
  </article>

  <article class="component-card">
    <h2>Tag (tag)</h2>
    <p class="usage-caption">類別標籤</p>
    <div class="demo">
      <span class="tag solid brand">活動</span>
      <span class="tag soft neutral">標籤</span>
    </div>
    <small class="expansion-info">
      Figma 展開:variant × intent = 3 × 2 = <strong>6 variants</strong>
    </small>
  </article>

  <!-- alert 顯示 2 個 layout-variant 對比 -->
  <article class="component-card">
    <h2>Alert (alert)</h2>
    <p class="usage-caption">頁面內固定訊息</p>
    <div class="demo">
      <!-- banner layout-variant -->
      <div class="alert banner success">
        <span class="icon">[✓ icon]</span>
        <div class="content">
          <h3>儲存成功</h3>
          <p>變動已套用</p>
        </div>
        <button class="cta outline">查看</button>
        <button class="dismiss">[× icon]</button>
      </div>
      <!-- stacked layout-variant 對比 -->
      <div class="alert stacked error">...</div>
    </div>
    <small class="expansion-info">
      Figma 展開:layout-variant × variant × intent = 3 × 3 × 4 = <strong>36 variants</strong>
    </small>
  </article>

  <!-- ...每元件都這樣 render -->
</body>
```

**HARD rules**(兩個 preview 共用):
1. HTML 不可有 inline hex 顏色、inline fontSize → 必須**全部**引用 `../tokens/tokens.css` 的 CSS variables
2. 不引入任何 external JavaScript / npm dependency(純靜態、瀏覽器雙擊就開)
3. Components preview **不全展、精簡 Demo**:每元件 1-2 instance(default + 對比軸)
4. **每元件必含 `.expansion-info` 區塊**:列出 Figma 會展開的軸 + 公式 + 數量(讓設計師預知 Figma 規模)
5. nested 元件用 HTML 結構表達(例:alert 內含 `<button>` 跟 `<icon-placeholder>`)、不是純文字 placeholder
6. font 用 CSS class 對應 Text Style 名稱(例:class="zh-h6")

**自動打開**:
CC 跑 `open <project>/output/preview/index.html` (macOS) —— 預設瀏覽器立刻開,設計師看到。

**修改回圈**:
設計師看 preview 發現問題 → 喊 CC「button 紅色不對」/「字級太小」→ CC 改 tokens / components → 重 generate preview → 設計師再 review。**修到設計師 OK 才進 Step 4**(避免浪費 Figma push 工時)。

### Step 4.5 — Post-build Figma audit (HARD)

**Empirically validated on team 試跑 (2026-06-11)**: 6/6 trial 都有「CC 給第一個元件套完整 skeleton、後續元件裸放 canvas、命名混雜兩種規約並存」的 pattern。任何沒 audit 的 trial 都產出品質不一,設計師後續無法維護。

**Trigger**: end of Step 4(CC 完成 Figma push 後)、Step 5 designer 接手前。

**Check via Plugin API walk**(每頁逐項):

| # | 檢查項 | PASS 條件 | FAIL 後果 |
|---|---|---|---|
| 1 | Page 數 = **4 DS 頁** + N Pages/<name>(v0.8 修正)| DS 4 頁(Cover/Foundations/Components/Masters)固定;頁面 rebuild 產出在 `Pages/<name>` 額外頁、不計入 4 | 4 頁 DS 結構違規 |
| 2 | 每頁根 frame AUTO_LAYOUT | `root.layoutMode === "VERTICAL"` | 裸 absolute = 視覺重疊高風險 |
| 3 | Foundations 頁 = **單一 SECTION**(v0.7.1 修正)| Foundations 頁只含 1 個 Figma SECTION node、內含所有 token sub-group 往下 | 8 SECTION 往右 = 違反 v0.7.1 規約 |
| 3b | Components / Masters 頁 = 3 SECTION 往右 | Basic / Feedback / Complex 各一、x 座標遞增 | 無 SECTION = 無分區 |
| 4 | Components 頁:所有 component instance 在 `section/<id>` 內 | parent.name 符合 `^section/[a-z0-9-]+$` | 裸 component = 沒套 skeleton |
| 5 | Components 頁:**無 master sets + 有 documentation instances**(v0.7.1 雙向)| 該頁無 COMPONENT_SET node、且 instance count > 0 | master 散落 / 頁空 = 違反 |
| 6 | Masters 頁:**有 master sets + 無 documentation instances**(v0.7.1 雙向)| 該頁 COMPONENT_SET node count > 0、且無單獨 instance | master 缺 / 文件混入 = 違反 |
| 7 | 命名統一 `section/<id>` pattern | 無 `page/components-<id>` / 純名 / 大小寫不一 | 命名混雜 |
| 8 | 同頁 frame bbox 不重疊 | 任兩個 top-level frame 交集面積 = 0 | 視覺重疊 |
| 9 | Specimen 高度 > 20px(無 stub) | 每個 component frame `height > 20` | < 20 = 空白條 |
| 10 | **Build-time token binding**(v0.6) | 任何 SOLID fill/stroke `boundVariables.fills?.[i]` 必非空、任何 text 無 inline fontSize | 未綁 = build 違規、**不接受 patch**、必須 rebuild 該 frame |
| 11 | **Nested INSTANCE_SWAP**(v0.6) | L0 composition 宣告的 nested 必為 instance node、非 inline frame | inline frame 替代 = nested 違規 |
| 12 | **Icon library 連結**(v0.7.1 改 library-key) | 所有 icon 必為 library asset instance(via library-key,team library)、非 unicode / 文字 / placeholder | 用文字 / placeholder / emoji 模擬 = FAIL |
| 13 | **Spec-callout 缺席** | section/<id> 內無 spec-callout frame | 出現 = 用舊 pattern |
| 14 | 每個 component ≥ default-expansion 宣告的 state | 至少展開 default-expansion 列出的所有 state | state 覆蓋不足 |
| 15 | **多軸元件用表格排版**(v0.7.1 新增)| button / input / alert / notification 等多軸元件 specimen-frame 內排成 row=state × col=variant×intent 表格 | 自由 stack / 截取代表 = 違反「完整展示」原則 |
| 16 | **Boolean property 使用**(v0.7.1 新增) | L0 宣告 boolean 的元件(button / input / search)在 Figma 用 BOOLEAN property、非獨立 variant | 用 variant 模擬 boolean = FAIL |
| 17 | **Foundations 標注完整**(v0.7.1 新增)| color swatch 必含 token-name + hex + opacity;字級必含 size+weight+line-height;spacing/radius 必含 px | 缺標注 = 設計師無法閱讀 |

**Output(HARD block 範例)**:

```
=== Step 4.5 Post-build Figma audit ===
Page count: 4 ✅
Page 1 (Cover): root AUTO_LAYOUT ✅
Page 2 (Foundations): root AUTO_LAYOUT ✅、7 sections ✅
Page 3 (Components/Basic):
  ❌ root container: 找到 5 個 top-level frame(應該 1 個)
  ❌ 命名混雜: `page/components-button` 跟 `tag` / `badge` 兩種規約並存
  ❌ bbox 重疊: tag (700,100) 跟 button container (100,100) 在 x 700-1112 範圍重疊
  ❌ specimen stub: card (height=10), modal (height=10), notification (height=10)
  ❌ 未綁: 12 個 fill 用 hex、2 個 text 用 inline fontSize
Page 4 (Components/Feedback): ✅

⛔ STEP 4 NOT COMPLETE — fix all FAIL items and re-run audit.
```

**FAIL 處理**:
- **結構違規**(#1-#9 #13)→ CC 自動修(重 build section 容器、刪重疊 frame、移 master 到 Masters 頁等)、再跑一輪 audit
- **Build-time binding 違規**(#10)→ **不接受 patch、必須從頭重 build 該 frame**(走 Variable-first 三步、避免「先錯後修」變工作模式)
- **Nested INSTANCE_SWAP 違規**(#11)→ CC 自動修(將 inline frame 替換為 library/master instance)
- **Icon 違規**(#12)→ CC 自動修(unicode → library asset)、修不掉(library 無對應)標 `pending-icon-resolution`
- **State 覆蓋不足**(#14)→ CC 補展 default-expansion 列出的 state
- 修不掉的個案(例如 L0 真的少某個 component)→ 標 `pending-l0-update` 給設計師後續處理、不擋 step 5
- 全 PASS → 進 Step 5

### Gate 3 — Figma DS 完整性 (soft)

**Read**:
- L0.foundations + L0.foundations[*].modes
- L0.components + L0.components[*].variants/intents/states/sizes

**Check via Plugin API**:
- Figma Variables 是否完整：每個 L0 foundation 對應一個 Variables collection；modes 數量對齊
- Figma Component sets 是否完整：每個 L0 component 對應一個 set；variant property 覆蓋所有 axes

**Output (soft, list)**:
```
=== Gate 3 Figma 完整性 ===
Variables:
  ✅ color (with light/dark modes)
  ✅ typography
  ❌ elevation (missing light/dark modes — only single mode found)

Components:
  ✅ button (all 12 variants present)
  ⚠ tag (only 8/24 variants — missing intent×size combinations)
  ❌ pagination (not found in Figma — L0 says it should exist)

設計師補：
  ▢ 加 elevation Variables collection 的 dark mode
  ▢ 補齊 tag 16 個 variants
  ▢ 建 pagination component set
```

### Gate 4 — 重建時反向 audit (soft, → L0/L4 update)

**Trigger**: every time CC needs hand-build OR approximation during step 6 (delegated to `visual-to-figma-ds` Phase 3).

**Read**:
- L0.components (full list, to verify "really not there")
- L4.archetypes[*].typical-components (to check if this pattern belongs to current page type)

**Check + Output**:

For each hand-build pattern:
1. Cross-check L0.components — is there really no match?
2. If absent → generate **L0.components proposal** in L0 schema format:

```yaml
# === Gate 4 proposal: new L0.component entry ===
- id: <inferred-name>           # 例：numbered-pillar-card
  category: <inferred>          # 例：complex
  variants: [<from-mockup>]
  intents: [<from-mockup>]
  states: [<from-context>]
  sizes: []                     # 通常 page-level pattern 無 size
  a11y:
    contrast: required
    keyboard: <inferred>
    aria-role: ""
    extra: []
  token-policy:
    allowed: [semantic.surface.*, semantic.text.*]
    forbidden: [primitive.*]
  archetypes-used-in:
    - <current-archetype-id>
  test-hooks:
    visual-regression: required
    a11y-scan: required
    states-coverage: required
    extra: []
  status: proposed              # designer 審後改為 planned
  refs:
    source-doc:
      doc: "PRD"
      section: "<inferred from where in PRD this pattern lives>"
      url: ""
    figma: ""
    code: ""
  notes: "Gate 4 反向 audit @ <page-name> 提議；CD round <N>；hand-build x<count>。"

# === also propose L4.archetype typical-components addition ===
# archetype: <current-archetype-id>
# add to typical-components: - <inferred-name>
```

3. Output stacks all proposals at end of build, designer reviews + approves selectively.

**Loop close**: approved proposals → CC writes into `L0-scope-manifest.yaml` (under appropriate category) + `L4-archetype-library.yaml` (typical-components list). Next iteration uses the enriched spec.

### Gate 4.5 — DS-instance-required after step 6 (HARD)

**Empirically validated on JoiiNi Path B trial 2 (2026-05-20)**: step 6 (rebuild) initially produced 64 inline-styled frames that should have been DS instances — caught only after second audit. Adding Gate 4.5 as HARD between step 6 build and Gate 4 reverse audit prevents this slip.

**Trigger**: end of step 6 build batch, before Gate 4 fires.

**Check** (programmatic via Plugin API walk):

For each `FRAME` node in the rebuild path:
1. Does any L0.components entry exist whose any variant matches this frame's structure + visual purpose?
2. If yes — this frame should be a DS instance, not inline.
3. If frame name ends with `-DSGAP` or `-APPROX-*` — exempt (intentional DS gap).
4. Otherwise — HARD violation.

**Pattern detection heuristics**:

| Inline frame name pattern | Probable should-be-instance |
|---|---|
| `*-pill` / `kind` / `status-pill` / `type-badge` / `label-pill` | badge |
| `cta` / `btn-*` / `*-btn` (not in master component) | button |
| `*-tag` / `chip-*` | tag |
| `play` / `chevron-up-btn` / `chevron-down-btn` | button (icon-only variant) or DSGAP if no such variant |
| `*-card` (with image + text composition) | card OR page-composite DSGAP |

**Output (HARD block)**:
```
=== Gate 4.5 DS-instance-required ===
Total inline frames flagged: <N>

(b) DS exists / CC didn't apply — to fix:
  - banner-label × 1 → should be Badge (Variant=dark, Intent=neutral, Size=sm)
  - kind × 5 → should be Badge
  - type-badge × 14 → should be Badge
  ...

(a) DS doesn't exist — DSGAP candidates:
  - art-card × 4 → not in L0.components; flag DSGAP-article-card
  - rank-row × 10 → not in L0.components; flag DSGAP-rank-row
  ...

⛔ STEP 6 NOT COMPLETE — fix (b) violations before Gate 4.
```

Loop closes when (b) = 0. (a) feeds Gate 4 as L0/L4 extension proposals.

## Soft vs Hard gates

| Gate | Type | What happens on fail |
|---|---|---|
| Gate 1 | soft | List discrepancies, designer decides whether to fix or accept |
| Gate 2 | **HARD** | CC blocks the Figma push; must fix code-side to pass |
| **Step 4.5** | **HARD** | **CC blocks step 4 completion; must fix Figma structure(skeleton/auto-layout/binding/重疊)to pass** |
| Gate 3 | soft | List discrepancies, designer fills the Figma side |
| Gate 4 | soft | Generate proposals, designer approves/rejects per item |
| **Gate 4.5** | **HARD** | **CC blocks step 6 completion; must replace inline → instance** |

Three HARD gates(Gate 2 + Step 4.5 + Gate 4.5)are automated strict-block。其他 surface findings for human decision。

## Variable isolation for trial design

**Empirically validated on JoiiNi F-flow Trial 1 → Path B trial 2 (2026-05-17 → 2026-05-20)**: when 4 variables move simultaneously, "the rebuild looks bad" is unattributable. Trial 1 had ~4 days of effort that couldn't be diagnosed because V3 (protocol) and V4 (CC discipline) were both uncontrolled and uncodified.

Across the workflow, **4 variables jointly determine output quality**:

| Variable | Description | How to verify in trial |
|---|---|---|
| V1 — Upstream source binding capacity | CD's output formats (HTML/CSS/jsx/SVG/tokens) machine-readable? | Test: can CC parse every relevant CD output programmatically? |
| V2 — Tool wiring | WebFetch + Figma plugin + Variables API path complete? | Test: does each link in the chain work end-to-end? |
| V3 — Protocol clarity | SKILL.md explicit on source-binding + DS-instance-required + decision ownership? | Test: can someone re-running the pipeline reach the same outcome from the docs? |
| V4 — CC execution discipline | Even with protocol, does CC follow source-binding consistently? | Test: post-build audit shows ≤ trial-target inline frames, ≤ trial-target unbound tokens |

**Trial design rule**: change at most 1-2 variables per trial cycle, hold others constant. Document baseline → after-change deltas explicitly.

**Anti-pattern**: starting a trial with "let's see what happens" mode — every output divergence becomes a possible source, root cause never lockable. Always pre-declare which variable the trial is testing.

## Coordination with other skills

- **`visual-to-figma-ds`**: handles step 6 (CC rebuilds mockup in Figma). This skill (`ds-architecture-flow`) wraps around it for Gates 1-4 + L0/L4 governance. When step 6 fires, the audit output from visual-to-figma-ds feeds into Gate 4 logic here.
- **`session-stats`**: report-only; useful at end of iteration to see token cost.

## Known limitations + future work

The DS Architecture framework (L0/L4) and this skill are **co-evolving**. Run a trial cycle and update both:

| Area | Known gap | Likely action |
|---|---|---|
| L3 canonical state taxonomy 待建 | required-states 詞彙未統一 | 跑第一輪 Gate 4 時順便累積 vocabulary |
| L1 primitive + L2 semantic 實值未填 | Step 2 build 沒實值 | 第一個 trial project 啟動時依 Ref 補；或從現有 DS（如 Cathay）借 |
| production/code-rules / figma-rules / mapping 內容未填 | Step 3-6 細節未規範 | 跑一輪後依踩到的具體需求補 |
| L0/L4 跟前端 / UI / 開發團隊對齊 | 命名 / variants / archetypes 是否合用尚未跨團隊驗證 | trial cycle 後 review、調整 schema |
| Reverse audit proposal 自動寫回 L0/L4 | 目前是 CC 產 proposal、人審；自動寫回需 schema 變動安全機制 | 視 trial cycle 風險評估後決定 |

### 已知 anti-pattern（避開）

| Anti-pattern | 來源 | 替代解法 |
|---|---|---|
| Figma 上全展 variant × intent × state × size cross-product | JoiiNi DS test 2026-06-10：Button 單個就 270 個變體、爆炸 | Step 4 instruction：visual axes 上 Figma、interaction states/size scale 留 code(token-bound),Figma 預設只放 default state + 基準 size |
| 元件 token-policy 用了 base L2 不存在的 alias | JoiiNi trial 提出 17 個 component-scoped alias | Phase 0.6 build 階段:把缺的 alias 綁「最接近的 base role」+ 提案進 extensions/L2-semantic-aliases.proposal.yaml,**不在元件硬刻 primitive** |
| CC 撞到 spec / CI 品牌不一致時即興處理 | JoiiNi(CI) vs 快電商(spec)不同 | Phase 0.7 Brand 一致性檢查（已 codify 進 skill） |
| CC 只給第一個元件套完整 skeleton、後續元件裸放 canvas | team 試跑 2026-06-11:6/6 trial 都有此 pattern(關子例外為人工 guide)、命名 `page/components-X` 跟裸名混雜、彼此 bbox 重疊 | Step 4 prescriptive 寫死:每個 component **必須**包進 `section/<id>` 容器、所有 section 是同一 root 子節點、命名統一(skill v0.4 +Step 4.5 audit 強制驗) |
| `resize()` reset auto-layout sizing mode | SME 試跑 2026-06-16 N=3+ 復現(input/table/overlay 都塌成 10px) | skill component-build helper 強制「sizing mode 設在 resize 之後」、或建立後再設 AUTO;**不可在 setProperty AUTO 後再 resize** |
| VERTICAL auto-layout 軸向混淆(hug 高度設錯軸)| SME 試跑 2026-06-16 | hug 高度要 `primaryAxisSizingMode='AUTO'`(不是 counterAxisSizingMode);frame template helper 內定 |
| opacity on bound paint 不生效 → tag/badge 文字底色撞色 | SME 試跑 2026-06-16 + 上次 JoiiNi trial | tint 色階是正解、不要用 opacity 模擬 soft;framework base 補 success/warning tint 色階(v0.5 已 ship,2026-06-16) |
| `loadFontAsync` 未先載 → `use_figma` 原子性失敗、字型 render 失敗多次 | SME 試跑 2026-06-16 | skill build helper 必先 `await Promise.all(fonts.map(loadFontAsync))` 所有需要字型再開始建 component |
| image 中央放 emoji / 箭頭 icon 綁太小字級 | SME 試跑 2026-06-16 | image 中央禁 emoji、用文字 placeholder("Image placeholder" + 比例);arrow / chevron 等 icon 用 icon 元件 INSTANCE_SWAP、**不可用文字 + 字級**綁 size;L0 icon notes 已明文 |
| 「先 build frame 用 default 色、Step 4.5 audit 後再 patch binding」(v0.6 新增) | SME 試跑 2026-06-16:CC 反射性走 build-fast → audit-fix-later、preview 中途錯版 | v0.6 Step 4 寫死 Variable-first 三步:getVariableByName/create → setBoundVariable → assert,build-time 必綁;**audit FAIL 不接受 patch、必須 rebuild 該 frame** |
| 「第一個元件套 skeleton、後續元件 nested(button/icon)用 inline frame 模擬」(v0.6 新增) | SME 試跑 2026-06-16:alert 內 CTA 不是 button instance、變成 inline 矩形 + 文字 | v0.6 Nested INSTANCE_SWAP HARD:L0 composition 宣告的 nested 必走 INSTANCE_SWAP 連到 master,Step 4.5 audit 抓 inline 替代 |
| 「自己 build icon master、不接 library」(v0.6 新增)| SME 試跑 + 多輪 trial:icon master 用文字模擬 / SVG 失敗 / 字級綁住變視覺崩壞 | v0.6 icon library 整合:reference Untitled UI icons(file-key: hnySloSFGa5ju356tbr5C4)、INSTANCE_SWAP 跨檔;framework 端維護 `production/icon-library.yaml` 設定 |
| 「alert 跟 notification 撞臉、shape 都用 [solid/outline/soft] × intent」(v0.6 新增)| SME 試跑 2026-06-16 設計師覺得兩者太像 | v0.6 L0 重新區分:alert 加 `layout-variants: [banner, stacked, compact]` + composition(icon+title+body+cta+dismiss);notification 加 `position-variants: [toast-top-right, toast-bottom-right, snackbar-bottom-center]` + composition(icon+body+close,**無 CTA / 無 title**) |
| 「Components 頁 master sets + documentation 混塞、9774px 長卷」(v0.6 新增)| 去趣AI trial 內 35 元件全擠 Components 一頁 | v0.6 結構分離:Components 頁只放 documentation instance、Masters 頁集中所有 master sets;設計師 edit master 在 Masters 頁、無干擾;Page=4 寫死 |
| 「skill description 寫死絕對路徑、CC 詢問該指哪」(v0.7.1 新增)| 2026-06-17 SME Level 2 自驗:clone 到不同路徑時 CC 問「要用哪個 path?」| v0.7.1 改 self-locating:Phase 0 prelude 自動偵測 framework path(看 L0/L4/VERSION 三檔)、不問 user |
| 「CC 沒讀 figma-rules.yaml 就動工」(v0.7.1 新增)| SME Level 2 自驗:Foundations 結構、表格排版、完整展示等規約 figma-rules 寫過、CC 沒讀 | v0.7.1 Phase 0 prelude HARD 加「必讀檔列表」+ Echo summary 給設計師確認 |
| 「icon 用 placeholder/emoji 先做、之後 swap」(v0.7.1 新增)| SME Level 2:CC 先用 emoji 模擬、設計師要求才換 icon、套色錯誤 | v0.7.1 寫死:icon 必直接 INSTANCE_SWAP、無 placeholder pattern |
| 「字型問句弱、容易跳過、實際影響大」(v0.7.1 新增)| SME Level 2:CC 問「字型不一致要替換嗎」設計師沒注意 | v0.7.1 改 HARD-block + 強調「取代字型 / 安裝字型」二選一明文 |
| 「Foundations 8 SECTION 往右、設計師看不順」(v0.7.1 新增、跟 v0.6 寫法衝突)| SME Level 2 復現:設計師上輪已說一整段、這輪 CC 又分 8 個 | v0.7.1 修:Foundations 單一 SECTION + token 往下堆疊;與「Components / Masters 3 SECTION 往右」不混淆 |
| 「Components 頁空、所有 master 建在 Masters 頁就以為完成」(v0.7.1 新增)| SME Level 2 復現:CC 把 master 直接排列當 documentation、Component 頁無 instance | v0.7.1 Step 4.5 audit 雙向檢查:Components 頁必有 instance(#5)、Masters 頁必有 master sets(#6) |
| 「多軸元件 specimen 用堆疊、看不出分組」(v0.7.1 新增)| SME Level 2:設計師每次都要手動調整成表格 | v0.7.1 寫死「多軸元件用表格排版」(row=state, col=variant×intent)、Step 4.5 audit 第 15 項驗 |
| 「icon-button vs button 雙元件並存、結構爆炸」(v0.7.1 新增)| SME Level 2:設計師問能否整併、開拓 boolean 路徑 | v0.7.1 加 Boolean vs Variant 原則:**內容差異走 boolean、結構差異走 variant**;button 加 boolean show-label/show-leading-icon/show-trailing-icon、icon-button 標 deprecated-merge |
| 「input 用 variant 表達 with-label / with-hint 等內容差異」(v0.7.1 新增)| 同上、內容差異變 variant 矩陣爆炸 | v0.7.1 改 boolean property、masked state 移至 password-input 的 Reveal 軸 |
| 「alert 整片底色染 intent、視覺疲勞」(v0.8 新增)| SME Level 2:設計師指出 alert 應沉穩、像 modal 風格 | v0.8 改 inline-card:白底 + intent 在 icon 體現 + brand primary CTA;舊 soft/outline/solid variants 拿掉、配色 J1 衝突自動解(CTA 不繼承 alert intent) |
| 「Master name 用 2025 縮寫(btn/img/ill)、跟 L0 id 不一致」(v0.8 新增)| SME Level 2 三個命名衝突點:中線禁、btn vs button、variant 寫法 | v0.8 figma-rules 升 v0.2:四層命名分開(schema-id / figma-master / variant-property / internal-layer),master name = L0 id 直接用,縮寫 deprecated |
| 「頁面 rebuild 產出在 DS 檔第 5 頁、撞「Page=4」規約」(v0.8 新增)| SME WF 試跑撞、4 頁寫死跟 step 6 rebuild 互斥 | v0.8 修:DS 結構 4 頁固定 + 頁面 rebuild 額外開 `Pages/<name>` 頁、不計入;Step 4.5 audit #1 同步調 |
| 「rebuild 中發現缺元件、直接 DSGAP 不補建」(v0.8 新增)| SME WF 試跑:announcement-item / price / stat-number / category-tile 原 scope 排除、頁面要時直接 DSGAP | v0.8「有就先建再套」原則:rebuild 過程 Phase 0.8 cross-check、L0 有的先補建 master 再套、不是直接 DSGAP |
| 「Instance text override 用 deep findOne 抓錯 nested 文字」(v0.8 新增)| SME WF 試跑:article-card 標題 override 抓到 nested tag 內文字 | v0.8 helper 寫死:用 `findChild()` / 直接 layer name 找直接子層、不 deep findOne |
| 「複合元件內 image 預設 FIXED、卡片 resize 不跟隨」(v0.8 新增)| SME WF 試跑:card / article-card 內 image 固定尺寸 | v0.8 寫死:複合元件 master 建立時 image 預設 `layoutSizingHorizontal=FILL` |
| 「CTA / footer 同色 → 視覺黏連」(v0.8 新增)| SME WF 試跑:navy CTA banner + navy footer 融成一塊 | 頁面 rebuild 階段:相鄰深色區塊需分隔(換色 / 分隔線 / 留白) |

**Treat this skill as v0.8** — run, learn, update.

## After the run — ITERATION-report.md (MANDATORY)

每次 trial 跑完都**必須**產出 `<project>/output/ITERATION-report.md`,作為 harvest 框架演進的資料來源。**沒這份 = trial 不算完成**。

### 模板（CC 嚴格依此結構填）

```markdown
# <project-name> — Iteration Report (ds-architecture-flow <skill-version>)
Date: YYYY-MM-DD · Mode: Path <1|2> + <DS-only|with-pages> · Round: <descriptor>

## Inputs resolved (Phase 0)
- CI: <source + 簡述>
- Spec: <source + 簡述>
- ⚠ Brand consistency: <consistent | mismatch-resolved | mismatch-blocked> — <resolution if applicable>
- Stack: <preset-id> · Dark mode: <decision> · Breakpoints: <values>

## Gates fired
| Gate | Type | Result |
|---|---|---|
| Gate <N> | <HARD|soft> | <PASS / FAIL / SKIPPED + 一行原因> |

## Built
- Tokens: <檔案列表>
- Components: <count> L0 ids
- Figma: <collections / component-sets count> → <Figma URL>

## Proposals raised (→ upstream candidates, need designer sign-off)
- <每筆寫位置 + 理由,例:extensions/L2-semantic-aliases.proposal.yaml — N aliases proposed>
- <theme.delta promote-to-base candidates: 列當輪填了什麼還在 scaffold 的 base>

## Drift vs skill expectations (→ skill update candidates)
- <skill 沒明文叫 CC 做、但 CC 必須即興處理的東西>
- <skill 寫了但實務發現不對 / 不合理的>
- <skill 缺的明文 instruction>

## Anti-patterns surfaced
- <實際撞到的死路 / cross-product 爆炸 / 不切實際的展開 等>

## Next round candidates
1. <下一輪可以做什麼>
2. ...
```

### 為什麼 mandatory

- 多輪 trial(教學/真實案)累積 = 框架 v0.x → v0.(x+1) 的 harvest 來源
- 設計師個人有同樣形狀的回饋、user 跨 trial 對照容易
- 沒這份 = harvest 靠記憶,失真且偏

### 其他規則

- Note any drift between trial result and skill expectations → propose skill update(寫進「Drift vs skill expectations」)
- Don't auto-update L0/L4 without designer approval(每個 proposal 都要 human sign-off)
- 多輪 trial 一致提出的 proposal(N=3+ 個 trial 都提) = 強 signal 升 framework;單輪 only = 持續觀察
