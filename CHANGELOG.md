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
- **淺色／深色主題各一顆**：`PROJECT_LOGOS{light,dark}` + `activeLogo()` 依當前主題自動取用；未設定的主題 fallback 用另一顆，都無則回 Goons 字標
- `applyLogo(theme,src)` + `refreshLogo()`：同步替換三處（topbar `.brand-logo`、header `hdrLogo`、footer `ftrLogo`），主題切換即時更新
- slot 預覽墊淺／深底，直接看反白效果
- 三處 sizing 由「鎖高度」改「**鎖寬度**」（topbar 66px、header/footer 72px），高度等比
- ✅ property 驗證：雙檔切換 7 情境全對、2:1→66×33、3:1→66×22、fallback、全清回預設

待辦：C1 studio 啟動＋proposal 匯入 · C2 token 編輯 · C4 匯出寫檔 · C5 本地 server
