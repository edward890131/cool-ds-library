# Vendored framework snapshot

- Source: https://github.com/yenting-bit/ds-framework.git
- Snapshot VERSION: 0.8.2
- Snapshot commit: 37ea97c (2026-06-17)
- Snapshot date: 2026-07-17

這是「快照複製」，非 submodule。上游有更新時需手動 diff 同步。
本資料夾對 ds-studio 專案而言唯讀（沿用框架鐵則 1）。

## 為 studio 刻意分岔的檔案（跟上游 diff 時忽略這些差異）

以下三份教學文件已**就地重寫**成 studio 新版七步流程（含網站選取／token 編輯／logo／`projects/` 結構），與上游原版不同：

- `README.md` — 重新定位為「studio 內的治理層」
- `FRAMEWORK-WORKFLOW.md` — 改為 studio 三塊可寫性 + 七步流程
- `QUICKSTART.md` — 改為成員新版七步上手手冊

其餘檔案（L0/L4、`production/*`、`themes/*`、`skills/*`、`CLAUDE.md`）維持上游快照原貌。
`framework/CLAUDE.md` 仍是上游原文；**根目錄 `CLAUDE.md` 的 studio 規則優先於它**（尤其「專案產出寫 repo 內 `projects/`」覆蓋舊版「寫 repo 外」）。
