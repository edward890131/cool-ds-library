# Figma ↔ Code Component Drift — _demo

> 產生：2026-07-17（台北時間）  
> Figma：_demo DS（範例·鏡像） (`DEMOKEY`)　Snapshot：2026-07-17
> 正本：Figma（component 軌單向 figma→code）；比對範圍＝結構（軸）。

## TL;DR

| 類別 | 數量 |
|---|---|
| ✅ 結構乾淨 | 4 |
| ⚠️ 結構漂移 | 0 |
| 🧩 缺件 | 0 |
| 📍 figmaNode 未回填 | 0 |
| 🎨 Figma hygiene（advisory） | 1 |

## 🎨 Figma 綁定 hygiene（advisory，不擋）

元件在 Figma 把顏色綁到 `var(--*)` 命名變數而非語意 token，建議在 **Figma 端** rebind（用 use_figma）：

- `input`：var(--muted)

## ✅ 結構乾淨

`button`, `card`, `input`, `tag`
