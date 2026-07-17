# Goons DS Studio — CHANGELOG

studio 層里程碑（gallery 元件本身的細部改動另見 `library/CHANGELOG.md`）。

## Phase A + B（2026-07-17）
- 搭 repo 骨架：`framework/` + `library/` + `sync/` + `skills/` + `projects/`
- 快照 ds-framework（VERSION 0.8.2 · commit 37ea97c）→ `framework/`，`VENDORED.md` 記來源
- 建 `library/component-registry.json`：39 項 canonical id + 軸（library-first）
- 根 `README.md` + `CLAUDE.md`：七步工作流 + 6 條鐵則
- 就地重寫框架三份教學（README / FRAMEWORK-WORKFLOW / QUICKSTART）為新版七步流程
- `framework/CLAUDE.md` 鐵則 1 校準：專案產出寫 repo 內 `projects/`

## Phase C（進行中）
### C3 — Logo 品牌資產（2026-07-17）
- Basic 群新增「Logo 品牌標誌」項（`buildLogo` view + 上傳控制）
- `PROJECT_LOGO` 共用來源 + `applyLogo()`：上傳同步替換三處（topbar `.brand-logo`、header `hdrLogo`、footer `ftrLogo`）
- 三處 sizing 由「鎖高度」改「**鎖寬度**」（topbar 66px、header/footer 72px），高度等比
- 未上傳 fallback 回 Goons 字標；深色模式反白限制已於頁面標註
- ✅ property 驗證：2:1→66×33、3:1→66×22、svg/img 切換、還原正常

待辦：C1 studio 啟動＋proposal 匯入 · C2 token 編輯 · C4 匯出寫檔 · C5 本地 server
