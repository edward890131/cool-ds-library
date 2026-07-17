---
name: ds-sync-from-figma
description: 設計師在 Figma 端調整 token / 元件後，把變動偵測 + 分類 + 寫回 spec 的常態 sync 流程。整合鎮瑜的 figma:diff 腳本 + 框架 diff 分類器，產出 diff 報告 + 各區寫回提案，設計師逐項審後 commit。觸發於：使用者說「比較我在 Figma 改的跟原本 spec」「跑一次 sync」「同步 Figma 變動回 spec」「figma diff 一下」。NOT for 初始建立 DS（那是 ds-architecture-flow）；NOT for hand-build 元件反向 audit（那是 ds-architecture-flow Gate 4）。
---

# DS Sync from Figma

## When to trigger

設計師在 Figma 改了 token 值（顏色／圓角／間距）、調了 component variant、或加了新東西，要把變動「**正式回寫到 spec**」變成 canonical record。典型 phrasings：

- 「比較我在 Figma 改的跟 spec 差別」
- 「跑一次 sync」「figma diff」「同步回來」
- 「我剛在 Figma 改了 button hover 色，幫我寫回去」
- 「audit 一下 Figma 跟 framework 有沒有 drift」

**NOT trigger**:
- 初始建 DS（沒前置 spec、無從 diff）→ `ds-architecture-flow`
- Figma 出現大量手畫元件、要決定哪些升級成 L0 component → `ds-architecture-flow` Gate 4 反向 audit
- Code 端的修改回 Figma → 反向，本 skill 不處理

## Prerequisites

| 條件 | 檢查 |
|---|---|
| 框架 git repo cloned & up-to-date | `git pull` |
| 專案資料夾存在、有 `project.yaml` | 指向某框架版本 |
| Figma file 存在、`project.yaml.refs.figma` 設定好 | 能透過 Figma MCP 讀 |
| 鎮瑜整合腳本就位（`production/scripts/`） | `check-token-drift.mjs` / `token-adapter.mjs` |

## Flow

```
1. 讀 spec snapshot         ← 框架的 themes/ + 專案的 theme.delta + extensions/
2. 拉 Figma 當下狀態         ← Figma MCP → tokens/figma-snapshot.json
3. 跑 diff                  ← npm run figma:diff（鎮瑜腳本）→ raw drift report
4. CC 分類 diff              ← 三類：token 值 / 結構變動 / 內容變動
5. 各類各自提案寫回位置        ← theme.delta / extensions/ / content/
6. 設計師逐項審 → commit       ← 過的進專案 delta；拒的留 Figma、後續再議
7. 更新 figma-snapshot.json   ← 變成下一輪 sync 的 baseline
```

## Step 詳述

### Step 1 — 讀 spec snapshot

讀框架當下狀態（框架版本 + 專案 delta）合併解析後的「**spec 認為現在是什麼樣**」。

來源：
- `<framework>/themes/_base/{primitives,semantics,device}.json`（base theme）
- `<project>/theme.delta.json`（專案 override）
- `<project>/extensions/`（專案專屬元件 / variant）

### Step 2 — 拉 Figma 當下狀態

透過 Figma MCP 讀：
- Variables Collections（primitives / theme / device）
- Component sets（每個元件的 variants / properties）

寫入 `<project>/tokens/figma-snapshot.json`（audit log，每次 sync 覆寫）。

### Step 3 — 跑 diff（鎮瑜腳本）

```bash
cd <project> && npm run figma:diff
```

輸出 `<project>/reports/drift-<date>.md`（鎮瑜腳本原樣產物）。

### Step 4 — CC 分類 diff（核心邏輯）

讀 drift report，每筆變動分到三類其一：

| 類別 | 判斷 | 寫回去處 |
|---|---|---|
| **token 值變動** | 同名 token（如 `color.brand.primary`）的 hex/數值改了，但 token 名稱與用途不變 | 提案進 `<project>/theme.delta.json` |
| **結構變動** | 出現新元件 / 新 variant / 新 token 名 / 既有元件 prop 增刪 | 提案進 `<project>/extensions/<name>.yaml`，標 `upstream-候選` |
| **內容變動** | text override / 圖片替換 / 數值資料變動（不影響 DS 結構） | 提案進 `<project>/content/`（或忽略，視專案內容管理機制） |

**邊界曖昧時的判斷規則**：
- token 名改了 → 結構變動（影響 mapping）
- variant 名改了 → 結構變動
- 同 variant 內某個 fill 改色 + 該色屬於 brand token → token 值變動
- 同 variant 內某個 fill 改色 + 該色是 raw hex（不在 token 內） → 結構變動 + 標 `extract-to-token-候選`

### Step 5 — 寫回提案（不是直接寫）

對每類產出 markdown 提案區塊，設計師逐項勾選：

```markdown
## Sync 提案 — <date>

### Token 值變動（建議 → theme.delta.json）
- [ ] color.brand.primary: #0E4FE7 → #C4724B（赤陶色，from Figma)
- [ ] radius.md: 8px → 16px

### 結構變動（建議 → extensions/）
- [ ] 新 component: hero-banner（含 3 variants: image-left/image-right/centered）
       upstream-候選 reasoning: 跨多頁可能重用
- [ ] button 新增 variant "subtle"
       upstream-候選: 待定（goonsdesign 決定要不要進 L0）

### 內容變動（建議 → content/ 或忽略）
- [ ] hero text: "Welcome back" → "歡迎光臨"（i18n？或單純改文案）
```

### Step 6 — 設計師審 + commit

設計師對每項打勾 / 拒絕 / 改提案。CC 把過的寫進對應位置、git add + commit。被拒的記在 `<project>/sync-rejected-<date>.md`（避免下次 sync 重複跳出）。

### Step 7 — 更新 baseline

把 `<project>/tokens/figma-snapshot.json` 提升為當前 baseline，下次 sync 從這個基準算 drift。

## 輸出 artifacts

每次 sync 都產：
- `<project>/reports/drift-<date>.md`（鎮瑜腳本原樣輸出）
- `<project>/sync-proposals-<date>.md`（CC 分類後的審核清單）
- `<project>/sync-rejected-<date>.md`（被設計師拒的項目，避免下次重彈）
- 更新後的 `<project>/{theme.delta.json, extensions/, content/}`（過的提案寫入）
- 更新後的 `<project>/tokens/figma-snapshot.json`（下一輪 baseline）

## 與 ds-architecture-flow 的分工

| skill | 處理 |
|---|---|
| `ds-architecture-flow` | 初始建 DS、跨 4 Gates 的完整 build；Gate 4 處理 hand-build 變成 L0 提案（**結構大變動的反向 audit**） |
| `ds-sync-from-figma`（本 skill） | 已有 DS 後的**常態同步**；多數情境是 token 值微調 + 偶爾新 variant，**輕量、頻繁** |

兩者 overlap 在「新元件 / 新 variant」的處理：
- 出現量少（1-2 個） → 本 skill 處理進 extensions/
- 出現量大（一批新東西） → 引導 user 改跑 ds-architecture-flow Gate 4

## Known limitations

- 鎮瑜腳本目前只看 **token drift**，不看 component prop drift。Component prop 差異要靠 CC 額外 walk Figma component sets 比對。
- 沒有 Code Connect 的情況（goonsdesign 是 Pro tier），component drift 偵測精度有限、要靠 figma-mapping.md 補。
- diff 分類的「邊界曖昧」案例（如 hex 改但不在 token 內）需要設計師判斷，無法全自動。

## Coordination

- 跟 `ds-architecture-flow`: 本 skill 是其下游常態維運；累積到一定量的結構提案，可建議跑一次 Gate 4 集中處理
- 跟框架 `production/mapping.yaml`: drift 分類規則參考此檔的 namespace-registry + transform-rule

## Treat as v0.1

第一輪用是 2026 Q3 規劃。第一次跑後可能要調分類規則、提案格式、設計師審核 UX。run, learn, update.
