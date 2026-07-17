# sync/ — Figma ↔ codebase 雙向同步（Phase E 接入）

來源：`figma-sync-setup`（https://github.com/edward890131/figma-sync-setup）

## 現況

Phase A 骨架階段先放此 stub。三支腳本尚未落地（本機沙箱擋 git clone）：

- `check-token-drift.mjs` — token 漂移偵測（code 為準）
- `check-component-drift.mjs` — component 漂移偵測（Figma→code）
- `token-adapter.mjs` — 專案專屬 token 命名對應

## 待辦（Phase E）

1. 取得原始腳本（擇一）：
   - Yuu 用 `!git clone https://github.com/edward890131/figma-sync-setup.git` 拉到本機，或
   - Claude 從 GitHub raw 抓檔。
2. 改寫對齊本庫：
   - token 命名對到 `tokens.export.json`／`library` 的 L1/L2 token。
   - component drift 對到 `library/component-registry.json` 的 canonical id ＋軸。
3. 輸出接 `CLAUDE.md` 鐵則 6：差異分四類（token 值／結構／內容／mock）歸位。
