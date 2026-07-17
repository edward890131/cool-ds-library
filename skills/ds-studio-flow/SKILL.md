---
name: ds-studio-flow
description: 主控 skill（Phase D 施工中）。串起 Goons DS Studio 七步工作流——Phase 0 訪談 → token/元件提案 → 網站選取 → build 套 token → 寫 Figma → 雙向同步。復用 framework/ 的 ds-architecture-flow Phase 0、Gate、figma-rules，不重造。
---

# ds-studio-flow（Phase D 施工中）

> 此檔為 Phase A 佔位。完整步驟於 Phase D 撰寫。

## 七步骨架（詳見 repo 根 README）

1. Phase 0 訪談（引用 `framework/skills/ds-architecture-flow` 的 Q0–Q9）
2. Token 提案 ＋ 從 `library/component-registry.json` 篩選預勾 → `projects/<name>/proposal.json`
3. 網站選取（`library/gallery.html?project=<name>`）
4. 匯出 `tokens.export.json` ＋ `components.export.json`
5. build ＋ 套 token（跑框架 Gate 2）
6. 寫進 Figma（Variables ＋ Component sets，軸對映 variant/boolean，對齊 `framework/production/figma-rules.yaml`）
7. 雙向同步（`sync/`，差異分四類歸位）

## 治理

全程遵守 repo 根 `CLAUDE.md` 六條鐵則。輸出只寫 `projects/<name>/`，不改 `framework/`。
