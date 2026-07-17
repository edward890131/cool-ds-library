# projects/ — 每個專案的狀態與輸出

每個專案一個資料夾，只放自己的 delta（不複製 gallery 引擎）。`_demo/` 是格式範例（含一次完整往返）。

## 檔案格式

| 檔案 | 誰產生 | 內容 |
|---|---|---|
| `proposal.json` | Claude（Phase 0 後提案） | 初始 token override + 預勾元件 + 軸；網站載入時預填 |
| `selection.state.json` | 網站匯出時 | 你在網站編輯後的完整狀態（續編時優先於 proposal 載入） |
| `tokens.export.json` | 網站匯出時 | 最終 token overrides（root/dark/響應式）+ logo（data URI） |
| `components.export.json` | 網站匯出時 | `selected`（元件 id）+ `axes`（每顆選用軸）+ `counts`（變體數） |
| `assets/logo.*` | 你上傳 | 專案 logo（也會內嵌進 export 的 data URI） |
| `library.version.json` | 網站「儲存並更新」／`sync/bump-version.mjs` | 專案元件庫版本＋changelog（`{version, history:[{v,at,source,changes}]}`） |
| `sync/` | sync 腳本 | drift snapshot＋報告（見 `sync/README.md`） |
| `preview.html` | bake | 定案後自包含預覽（可寄客戶） |

## 版本化（Phase F）

`?project=` 模式下，topbar 的 CTA ＝「**儲存並更新 · v<N>**」。點了先跳防呆彈窗列出「改了哪些」＋「v1→v2」，確認才寫檔並把版本 +1、append 一筆 `library.version.json` history（`source: website`）。

版本只屬**這個專案元件庫**，不動共用引擎（`library/`）。Figma 端改動經 `sync` 吃回來後，由 `node sync/bump-version.mjs <name> --source=figma --change="..."` 記一筆（`source: figma`）；下次進網站會跳「版本已更新」說明彈窗（比對瀏覽器記住的上次版本）。

## proposal.json 結構

```json
{
  "project": "<名稱>",
  "tokens": { "overrides": { "root": { "--c-brand2-500": "#E5484D" }, "dark": {} }, "logo": {"light": null, "dark": null} },
  "components": { "selected": ["button","input"], "axes": { "button": { "variant": ["solid"], "intent": ["primary"] } } }
}
```

## 怎麼跑

```
node library/tools/studio-server.js          # 啟動本地 server（:8899）
# 開 http://localhost:8899/gallery.html?project=<名稱>
```

- 帶 `?project=<名稱>` → 網站抓 `proposal.json`（或已存的 `selection.state.json`）預填 token / 勾選 / logo。
- topbar 右側出現「STUDIO · <名稱> · 匯出到專案」；按匯出 → 寫回 `tokens.export.json` + `components.export.json` + `selection.state.json`。
- 沒帶 `?project=` 或沒開 server → gallery 維持公開版；匯出改走瀏覽器下載。
