# themes/ — Theme Packs

Theme Pack 是 L1/L2 token 的「值」。**這是 L1/L2 數值真正的家**（L0 只宣告結構）。

## 檔案

- `_base.theme.yaml` — goonsdesign 預設基底（那 95% 共用的）。框架維護。
- `<name>.theme.yaml` —（未來）跨專案常用的產業主題包，如 `cozy` / `cyberpunk`。可選。

## 繼承機制

```
專案的 theme.delta.yaml
  meta.extends: base@0.1.0      # 繼承哪個 base 版本
  → 只寫跟 base 不同的值（通常是 brand 色、字體、圓角）
  → build 階段：base + delta 合併解析成完整 token set
```

## 規則

- **可改值、不可改名**：delta 只能 override `semantic.action.primary` 的「值」，
  不能把它改名成別的（名稱是框架鎖定的，改名會破壞跨專案一致性）。
- **新增 token** 屬結構變動 → 走專案 `extensions/`，不是塞進 theme delta。
- 切換產業氛圍 = 換 delta；L3 元件透過 L2 自動繼承，不重畫。

## 重要前提

theme pack 給的是「**風格**」的零成本多樣性（顏色/字體/圓角/陰影），
**不是「版面」多樣性**。版面差異要靠 `wf-templates/` + `sections/`，不是換 theme。
