# component-registry 說明與缺口報告（Phase B）

- 生成：2026-07-17，來源 `library/gallery.html` 的 `NAV` ＋ `DIAL_SPECS`
- 原則：**library-first**，canonical id 以本 registry 為準；框架 L0 僅 `l0Ref` 軟參考。

## 盤點結果

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

- library 新增／改名元件 → 重跑 `scratchpad/build_registry.js`（或等 Phase D 把它移進 repo `library/tools/`）重生本檔。
- 新增元件請補 `DIAL_SPECS`（軸）＋ `NAV`（分組），registry 會自動帶出。
