# Goons DS Studio — Claude Code 作業規則

任何 Claude Code session 進到這個 repo，**先讀完本檔再動作**。本檔是「永遠生效的護欄」；`skills/ds-studio-flow` 是「跑流程時的步驟」。護欄被動、流程主動。

本 repo 整合三塊：`framework/`（治理）＋ `library/`（元件庫網站）＋ `sync/`（Figma 雙向同步）。

---

## 鐵則 1：分層可寫性，看「位置」不靠記憶

| 區 | 內容 | 可寫性 |
|---|---|---|
| 🔒 `framework/` | ds-framework 快照（L0–L4 schema、production 規則、themes base、skills） | **唯讀**。要升級 = 刻意動作：手動 diff 上游 → 更新 → 記 `framework/VENDORED.md` |
| 🧩 `library/gallery.html` | 元件庫引擎（元件本體＋選取＋token 編輯 UI） | 設計團隊維護；**唯一的元件庫，禁止 per-project fork** |
| 📇 `library/component-registry.json` | canonical 元件 id ＋軸定義 | 隨 gallery 元件增減同步更新（見鐵則 2） |
| 🔧 `sync/*.mjs` | drift 偵測腳本 | FE 維護、設計確認命名對應 |
| 🧪 `projects/<name>/` | 專案狀態、匯出、bake 預覽、logo asset | 各專案成員；**所有專案產出只能寫這裡**，不得污染上面四層 |

**跑流程時所有輸出寫到 `projects/<name>/`**，永遠不要改 `framework/`。

---

## 鐵則 2：元件 id 主權在 library（library-first）

- canonical 元件 id 以 `library/component-registry.json` 為準，**不是** 框架 L0。
- registry 的 `l0Ref` 只是「有同名 L0 就標一下」的軟參考，供借用框架建置規則／軸定義；**L0 不反向覆蓋 library id**。
- 框架有、但 library 已移除的元件 → 不理會、不建。
- library 新增元件 → 同步在 registry 補一筆（id／name／status／axes），有對應 L0 才填 `l0Ref`。

## 鐵則 3：元件的「篩選項／樣式切換」＝ Figma 的 variant／boolean property

寫進 Figma 時，registry 每顆元件的軸（variant／intent／state／size…）必須 1:1 對映成 Figma 的 variant property 或 boolean property，維持「codebase 怎麼組合、Figma 就怎麼組合」。**結構差異走 variant、內容開關走 boolean**（沿用框架 figma-rules）。禁止把可切換的軸畫死成獨立不相干的節點。

## 鐵則 4：token / logo 一律綁定，禁止 hard-code

- 顏色／間距／字級／圓角／陰影 → 綁 Figma Variables（對應 `tokens.export.json`），禁止直接寫死色值／px。
- logo 是**專案級品牌資產**：一次替換同步三處（網站 topbar `.brand-logo`、library header `hdrLogo`、library footer `ftrLogo`）；鎖寬度、高度等比；存在 `projects/<name>/assets/`，bake 時以 data URI inline。

## 鐵則 5：複合元件內部一律取用既有原子，禁 inline 重畫

建 header／footer／modal／drawer 等複合元件時，內部的 button／input／menu／search／icon 一律 INSTANCE_SWAP 到 registry 既有原子；沒有對應原子就**先建原子再組裝**，不得 inline 畫成 primitive。

## 鐵則 6：跨邊差異分四類歸位（sync 階段）

設計師在 Figma／codebase 改完、要比較差異時，把改動分四類、各自歸位（沿用框架鐵則 3）：
- **token 值變動** → `projects/<name>/tokens.export.json`（＋回填 theme delta）
- **結構變動**（新元件／新 variant） → `library` ＋ `registry`，標 `upstream-候選`
- **內容變動**（文案／圖片／logo） → `projects/<name>/`
- **互動原型／mock data** → `projects/<name>/seed/`

不自己決定要不要寫回框架 —— 那是 goonsdesign 人工審核。

---

## 跑完整流程時，用 skill，不要即興

要從頭跑「Phase 0 訪談 → token/元件提案 → 網站選取 → build → 寫 Figma → sync」→ 觸發 `skills/ds-studio-flow`（復用框架 `ds-architecture-flow` 的 Phase 0、Gate、figma-rules，不重造）。

## Figma 操作前置

任何寫入 Figma 畫布前，先載入 `/figma-use` skill（強制前置，不跳過）。動工前先 `search_design_system` / scan Components page 盤點既有 token／component，缺漏先回報再決定補建或沿用，不用 hard-code 繞過。
