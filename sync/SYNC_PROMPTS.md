# SYNC_PROMPTS — 拉 Figma snapshot 的操作手冊

drift 腳本只負責「比對 + 出報告」，**碰不到 Figma**。真正去 Figma 拉現況那一步要靠 Claude 用 Figma MCP 拉，寫成腳本看得懂的 snapshot JSON。以下是給 Claude 的 prompt 樣板（把 `<...>` 換成實際值）。

前置：先 `mcp__claude_ai_Figma__whoami` 確認登入帳號對該檔有存取權；載 `/figma-use` skill。

---

## A. Token snapshot → `projects/<name>/sync/figma-snapshot.json`

> 「用 Figma MCP 對檔案 `<figma-url-或-fileKey>` 拉 Variables，輸出成 `projects/<name>/sync/figma-snapshot.json`，格式如下：
>
> ```json
> {
>   "$metadata": { "fileName": "<檔名>", "fileKey": "<key>", "snapshotAt": "<今天·台北時間>" },
>   "collections": [
>     { "name": "Primitives", "modes": ["Value"], "variables": [
>       { "name": "color/brand/500", "type": "COLOR", "values": { "Value": "#1c1c20" } },
>       { "name": "radius/md", "type": "FLOAT", "values": { "Value": 8 } }
>     ]},
>     { "name": "Theme", "modes": ["Light","Dark"], "variables": [
>       { "name": "semantic/action/primary", "type": "COLOR", "values": { "Light": "→ color/brand/500", "Dark": "→ color/brand/200" } }
>     ]},
>     { "name": "Device", "modes": ["Desktop","Tablet","Mobile"], "variables": [
>       { "name": "font/size/h1", "type": "FLOAT", "values": { "Desktop": 48, "Tablet": 40, "Mobile": 32 } }
>     ]}
>   ]
> }
> ```
>
> 規則：
> - variable name 用 **slash path**，跟 code 端一致：`--c-brand-500`→`color/brand/500`、`--r-md`→`radius/md`、`--sp-4`→`spacing/4`、`--fs-h1`→`font/size/h1`、`--s-action-primary`→`semantic/action/primary`（見 `sync/token-adapter.mjs` 的 `toPath`）。
> - alias（Figma variable 指到另一個 variable）→ 值寫 `"→ 目標path"`（箭頭 + 空格 + path）。
> - literal 顏色 → hex 小寫；數字 → 去單位純數（`8px`→`8`、`-0.01em`→`-1`＝em×100）。
> - collection / mode 名稱照上面三組（Primitives/Theme/Device）。若 Figma 實際 collection 命名不同，對到最接近的並在 metadata 註記。」

拉完跑：`node sync/check-token-drift.mjs <name>`

---

## B. Component snapshot → `projects/<name>/sync/figma-component-snapshot.json`

> 「用 Figma MCP 對這些元件節點拉 variant property，輸出成 `projects/<name>/sync/figma-component-snapshot.json`：先跑 `node sync/build-component-spec.mjs <name>` 生 code 端 spec，對照 spec 裡每顆元件的 `figmaNode`（沒填就用 `get_metadata` 找到對應 component set 的 node-id）。格式：
>
> ```json
> {
>   "$metadata": { "fileName": "<檔名>", "fileKey": "<key>", "snapshotAt": "<今天>" },
>   "components": {
>     "button": {
>       "figmaNode": "146:709",
>       "axes": { "variant": ["solid","soft","outline","text"], "intent": ["primary","secondary","danger"], "state": ["default","hover","pressed","disabled"], "size": ["s","m","l"] },
>       "colorCssVarNamed": []
>     }
>   }
> }
> ```
>
> 規則：
> - `axes` 從 component set 的 **variant / boolean property** 讀出（`get_metadata` 拿 property 名與 options）。property 名對到 code 軸：`Variant`→`variant`、`Intent`→`intent`、`State`→`state`、`Size`→`size`；boolean property（`Show-Leading-Icon=True`）視情況對到對應軸。
> - option 值**基底正規化**對齊 code：小寫、`Unchecked`→`default`、`Focus`→`focus-visible`、`Small`→`s`/`Medium`→`m`/`Large`→`l`。
> - `colorCssVarNamed`（advisory）：該元件把顏色綁到 `var(--*)` 命名變數而非語意 token 的清單，用 `get_variable_defs` 看綁定；沒有就給 `[]`。」

拉完跑：`node sync/check-component-drift.mjs <name>`

---

## C. 依報告對齊後回寫

- **token 值變動** → 改 `projects/<name>/tokens.export.json`（或回填 gallery base 若是全域）→ 重跑 A 驗證歸零。
- **結構變動**（新 variant / 新元件）→ 進 `library` ＋ `registry`，標 `upstream-候選`（人工審核）。
- **Figma hygiene** → 在 **Figma 端** 用 `use_figma` rebind 到語意 token，再重拉 snapshot。

四分類歸位規則見 `sync/README.md` ＋ repo 根 `CLAUDE.md` 鐵則 6。
