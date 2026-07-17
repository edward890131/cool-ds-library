# framework/ — DS 治理層（Goons DS Studio 內嵌）

這是 **Goons DS Studio** 的治理層（原 goonsdesign 跨專案 DS 框架的快照）。決定「怎麼建、怎麼推 Figma」的規則本體住這裡。

> 完整使用流程看 **repo 根目錄 `README.md` ＋ `QUICKSTART.md`**（新版七步流程，含網站選取）。本資料夾只講治理規則。

## 在 studio 裡的角色

- **唯讀治理**：跑專案時所有產出寫到 repo 根的 `projects/<名稱>/`，**永不改本資料夾**（見根 `CLAUDE.md` 鐵則 1）。
- **元件 id 主權不在這**：canonical id 在 `library/component-registry.json`（library-first）；本層 L0 只當 `l0Ref` 軟參考。
- **升級**：本層是「快照」非 submodule；跟上游 yenting-bit/ds-framework 對齊要手動 diff，記在 `VENDORED.md`。

## 先讀這幾份

| 檔案 | 是什麼 |
|---|---|
| `CLAUDE.md` | 框架層作業護欄（唯讀、可變/不可變三區、diff 分類）。**根 `CLAUDE.md` 的 studio 規則優先於此** |
| `FRAMEWORK-WORKFLOW.md` | studio 七步流程裡，框架扮演什麼、專案 delta 怎麼歸位、upstream 棘輪 |
| `production/figma-rules.yaml` | 寫進 Figma 的鐵律（4 頁結構、命名、綁 token、nested INSTANCE_SWAP） |
| `VERSION` / `VENDORED.md` | 快照版本與來源 |

## 結構

```
framework/
├── CLAUDE.md / FRAMEWORK-WORKFLOW.md / VERSION / VENDORED.md
├── L0-scope-manifest.yaml        # 框架元件/foundation 索引（僅供 registry 的 l0Ref 參考）
├── L4-archetype-spec.yaml        # L4 schema
├── L4-archetype-library.yaml     # archetype 內容
├── production/                   # figma-rules / code-rules / mapping
├── themes/                       # Theme Packs（L1/L2 token 值的家）
├── sections/                     # Section Library（organism 層）
├── wf-templates/                 # WF 版型模板
├── skills/                       # 框架原生 skill（ds-architecture-flow 等，被 ds-studio-flow 復用）
└── _project-template/            # 框架原生專案樣板（studio 改用根 projects/）
```

## 層級

L0 Scope ／ L1 Primitive ／ L2 Semantic ／ L3 Component ／ L4 Archetype ＋ Production Manifest。
硬規則：L3 元件禁直接用 L1，必走 L2 語意層。
