# component-registry 說明與缺口報告（Phase B）

- 生成：2026-07-17，來源 `library/gallery.html` 的 `NAV` ＋ `DIAL_SPECS`
- 原則：**library-first**，canonical id 以本 registry 為準；框架 L0 僅 `l0Ref` 軟參考。

## 盤點結果

### 2026-11-03 分類重整（依用途 8 組，參考 Ant Design／Carbon）

元件 id 全部不變，只改 `group`；sync 腳本只認 id，不受影響。新增元件依「7 套元件庫差距分析」以 `status: planned` 列入（附 `priority` P1–P3 與 `note`），側欄點進去顯示佔位頁。

| 分組 | ready | planned | 合計 |
|---|---|---|---|
| General 基礎 | 3（button／icon／logo） | 6 | 9 |
| Layout 版面 | 4（header／footer／section-head／floating-line） | 4 | 8 |
| Navigation 導覽 | 6（tab／menu／action-menu／breadcrumb／pagination／step） | 4 | 10 |
| Form 表單 | 5（input／dropdown／selector／toggle／quantity） | 10 | 15 |
| Feedback & Overlay 回饋與浮層 | 9（alert／notification／tooltip／popover／modal／drawer／progress／loader／skeleton） | 2 | 11 |
| Data Display 資料展示 | 6（tag／price／image／list／list-item／collapse） | 3 | 9 |
| Card 卡片 | 4 | 0 | 4 |
| Table & Chart 表格圖表 | 5 | 1（table-toolbar） | 6 |
| **合計** | **42** | **30** | **72** |

- **toggle 升格**：原本收在 tab 頁，改為獨立元件頁（`buildToggle`），補 `DIAL_SPECS.toggle`（state 4 值），會進需求匯總與匯出。
- **P1 規劃中**：avatar、stack、app-shell、segmented、slider、field、empty（alert、popover 已於 2026-11-03 完成）。
- **l0Ref**：比對改為只認 L0 的 `- id:` 條目。新元件命中 alert、cascader、date-picker、time-picker、typography（typography 在 L0 屬 foundation，非元件，僅軟參考）。

### 2026-07-17 初版（Phase B）

| 分組 | 項目數 |
|---|---|
| Basic 基本 | 18（含新增 logo） |
| Complex 複雜 | 12 |
| Card 卡片 | 4 |
| Table & Chart 表格圖表 | 5 |
| **合計** | **39**（38 元件 ＋ logo 品牌資產） |

全部 status = `ready`。另有 sub-component `checkbox`／`radio`（隸屬 `selector`，收在 `subComponents`）。

## 需注意項

1. **`selector` 無獨立軸** — 它是複合選擇族，內部用 `checkbox`（含 indeterminate 半選）＋ `radio`；軸見 `subComponents`。已標 `composes`。
2. **`logo` 為品牌資產** — 非一般元件，`kind:'brand-asset'`，無軸；替換同步三處 header/footer，鎖寬高度等比。
3. **l0Ref 未命中 7 項** — selector／logo／list-item／step／quantity／progress／chart 在框架 L0 找不到同名。**非缺口**：依 library-first，這些就以 library id 為準；未命中只代表框架沒有可借的同名規則。

## 未來維護

- library 新增／改名元件 → `node library/tools/build-registry.js` 重生本檔（2026-11-03 起路徑改為相對 repo）。
- 規劃中元件完成時：補 `DIAL_SPECS`（軸）、NAV 的 `st` 改 `ready`、重跑腳本。
- 新增元件請補 `DIAL_SPECS`（軸）＋ `NAV`（分組），registry 會自動帶出。
