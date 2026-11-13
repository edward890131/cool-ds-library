# 交接筆記（2026-11-05）

給接手的 Claude Code session：**先讀 `CLAUDE.md`（鐵則）→ 本檔 → `library/CHANGELOG.md` 最上面 5～10 筆**，再開始動手。

---

## 1. 目前狀態

- `main` 已包含到 **PR #26**（網站版本紀錄 **v13**），正式網址 https://cool-ds-library.vercel.app （`vercel.json` 把 `/` rewrite 到 `/library/gallery`）。
- 網站本體是 `library/gallery.html`（vanilla JS＋CSS），但**它是合併產生的檔，不要直接改**（2026-11-13 SPLIT-SRC:v1 起）：
  - 原始碼在 `library/src/`：`page.html` 骨架（獨佔一行的 `@@include 路徑` 引入小檔）、`css/`、`js/`、`data/`（`changelog.js` 網站版本紀錄、`i18n-en.js`／`i18n-ja.js` 翻譯）。
  - 改完跑 `node library/tools/build-gallery.js` 合併，`gallery.html` 跟 `src/` 一起 commit；`--check` 可確認兩者同步。
  - 小檔不是獨立模組，只是同一支 `<script>`／`<style>` 依序切開；新增檔案要在 `page.html` 加一行 `@@include`（沒引用會報錯）。
- 元件清單主權在 `library/component-registry.json`（78 個元件；`meta.counts` 要跟著維護）。
- 先前帳號的 Claude 預覽頁（claude.ai artifact）屬於舊帳號，新帳號無法更新；要預覽請另外發布新的 artifact，或看 Vercel。

## 2. 工作慣例（使用者 goonsdesign 的偏好）

- 一律用**繁體中文**回覆，寫給設計師看：講結果與畫面差異，少講程式細節。
- 小改直接做；大改（新元件、多頁改版）可以開背景 agent，在 scratchpad 複本上做、交回 `apply-*.py`（精確錨點 + `assert` 只出現一次 + 重跑保護標記），再由主 session 套用。
- 每次改動都要：
  1. 更新 `library/CHANGELOG.md`：新條目插在最上面一筆 `## ` 之前，標題格式 `## 2026-11-05（七十）　標題`（括號內流水號遞增）。
  2. 更新網站內版本紀錄 `const CHANGELOG_DATA=[`（在 `library/src/data/changelog.js`；最新在最上；同一批改動加到最新版本的 `items`，大批新功能開新版號）。
     ⚠ `items[].t` 會被 innerHTML 渲染：**內文不可出現未跳脫的 `<` `>`**（寫成 `&lt;` `&gt;`），否則會吞掉後面所有版本（v13 才修過這個 bug）。
  3. 新增／移除元件 → 同步 `NAV`（側欄）、`DIAL_SPECS`（軸定義，CHOICE/選擇元件頁（原需求匯總）/選取都從這裡長出來）、`BUILD`／`LIVE`、搜尋關鍵字、`TOKEN_SLOTS`、registry。
  4. 驗證（見第 4 節）→ commit → push → 使用者說「合併推」才開 PR 並 merge 到 main。
- 使用者說「合併推上去」＝開 PR 到 `main` 並直接 merge（merge commit），之後把工作分支重設到最新 `main`。

## 3. 設計系統規則（摘自 CLAUDE.md＋實作慣例）

- **全部綁 token**：色 `--c-*`／`--s-*`／`--accent`／`--accent2`／`--panel`／`--ink`／`--muted`／`--line`；圓角 `--radius`（預設 4px）、`--r-xs/sm/md/lg/xl/2xl/pill`；間距 `--sp-*`；字級 `--fs-h*`；陰影 `--e-*`；動態 `--dur-*`／`--ease-*`；字體 `--font-display`（Epilogue）／`--font-sans`（Geist＋Noto Sans TC）／`--font-mono`（Geist Mono）。
- **複合元件內部一律取用既有原子**：`mkBtn`、`tagEl(variant,intent,state,corner,size)`、`avtEl`、`sgmEl`、`cbxEl(state,size)`、`ddField`、Slider（`.sld`）、Progress（`.prg`）、`imEl`、`stpStepper`、`chtChart`…，不要手刻（Dropdown 多選勾選框就是因為手刻出錯）。
- 元件的切換軸 → Figma variant；內容開關 → boolean（`mountLive` 的 `segs`／`bools`）。
- 網站**預設深色模式**。深色時主色按鈕吃 `--c-brand-200`（為近黑品牌設計）。
- 牌卡圓角：舊卡多為 `--radius`；新 5 張（trend／media／weather／player）用 `--r-lg`、ticket 用 `--radius`。

## 4. 驗證方式

Chromium＋Playwright 在雲端環境已預裝（`require('playwright')`，不要 `playwright install`）。最小檢查：

```js
// node smoke.cjs
const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:900}});
const e=[];p.on('pageerror',x=>e.push(x.message));
for(const h of ['home','tokens','guideline','summary','changelog','button','chart','start']){
  await p.goto('file://'+process.cwd()+'/library/gallery.html#'+h);await p.waitForTimeout(900);}
console.log('errors',e);await b.close();})();
```

另外建議：每個 `<script>` 區塊用 `new Function(code)` 檢查語法；改版面時在 1280／820／390 寬、深淺兩種主題各截圖看一次。

## 5. 已知坑（踩過的）

- **預覽環境（claude.ai artifact）的 CSP**：會擋遠端圖片（Unsplash 等）和可能擋動態 `<style>`。
  - 圖片一律用檔內內嵌照片：`HX_TSM_BG`（辦公室）、`CARD_COVER`（天空）、`CARD_PHOTO`、`PSC_ROT[0..2]`（人像）。`imEmbed()` 會把 `IM_POOL` id 對應到內嵌照片。
  - token／綁定覆寫走 `dynCss()`：先寫 `<style id="tokenOverrides">`，沒生效改 CSSOM `insertRule`；`tokVerify()` 再抽查 computed 值，仍沒生效就寫到 `<html>` inline style（`window.__tokApplyMode` = `sheet`／`inline`）。
- 雲端環境網路：fontshare、figma 資產主機、vercel.app 連不到。
- `.crs-sN` 等 class 用 `background:` 簡寫會重設 `background-size`，inline 換背景圖時要一起設 size／position。
- 動態示範若派發合成 pointer 事件，記得協作游標只吃 `e.isTrusted`。

## 6. 未解決／待辦

1. **套用 token 後在使用者瀏覽器不換色**（本機 Chromium 各種情境都正常，無法重現）。已加 inline 保底（見上），**等使用者回報**：在 Guideline 頁 Console 執行
   ```
   [window.__tokApplyMode, getComputedStyle(document.documentElement).getPropertyValue('--c-brand-500'), document.documentElement.getAttribute('style'), location.href]
   ```
   以及使用的瀏覽器（Safari／Chrome）與網址（Vercel／artifact）。
2. **Plein 字體**：只在 Fontshare，雲端網路擋住，尚未導入（目前 display 用 Epilogue）。
3. 萊姆色沒有 token（趨勢卡用 warning-300／success-300 混色），若要正式化需補 L1 色階。
4. 首頁元件牆／動態展示尚未放入新 5 張牌卡（未被要求）。
5. 使用者先前提過但未執行的選項：選取框加粗或改 `--c-info-600`、照片素材可再換（目前內嵌照片多為人像）。

## 7. 關鍵程式位置（在 `library/src/` 裡 grep；行號會漂移，用函式名搜尋）

| 用途 | 搜尋 |
|---|---|
| 側欄分類 | `const NAV=[` |
| 元件軸定義 | `const DIAL_SPECS` |
| 頁面路由 | `function renderView(` |
| 頁面骨架／bento | `viewScaffold(`、`bentoHTML(`、`mountLive(`、`matrixPanel(` |
| 版本紀錄資料／渲染 | `const CHANGELOG_DATA=[`、`function renderChangelog(` |
| token 覆寫 | `applyTokOverrides`、`dynCss`、`tokVerify` |
| 開新專案流程 | `flwOpen`、`flwBuildProposal`、`flwApplyProposal`、`flwResetSite`、`FLW_RULES` |
| 首頁段落 | `hxHero`／`hxWall`／`hxStats`／`hxShow`／`hxFlow`／`hxFigma`／`hxVoice`／`hxNews` |
| 圖片池 | `IM_POOL`、`imEmbed`、`imUrl` |
