# 網站用圖檔（gallery 實際載入的版本）

`gallery.html` 用到的照片放這裡，程式用 `cdlAsset('img/檔名')` 取網址（`library/src/js/01-assets.js`，會自動處理正式站首頁 `/` 的路徑）。
這些是壓縮、裁切過的網頁版；原始大圖在 `../photos/`，要換圖時從原檔重新輸出、用同一個檔名覆蓋即可。
匯出 zip 時，用到的圖會自動轉回 data URI 內嵌，匯出檔不依賴網站。（2026-11-13 IMG-ASSET:v1 從 gallery.html 內嵌的 data URI 抽出）

| 檔案 | 程式變數 | 用途 |
|---|---|---|
| card-photo.jpg | `CARD_PHOTO` | 人物牌卡主照片、圖片類元件示範 |
| person-rot-1～3.jpg | `PSC_ROT` | 人物牌卡輪播人像（1:1.08、420px） |
| card-cover.jpg | `CARD_COVER` | 牌卡封面、首頁背景選項 |
| blog-1～6.webp | `TWS_BLOG` | 網站範本部落格／文章配圖（640×400） |
| home-feedback-bg.jpg | `HX_TSM_BG` | 首頁使用回饋段落背景（原檔 `../photos/office-window.webp`） |
| phone-frame.webp | `HX_PHONE_FRAME` | 首頁手機跑馬燈的手機外框 |

首頁聯絡我頭像直接用 `../avatar/yuu-face.webp`；首頁地標圖在 `../map/`。小圖示（favicon、頭像 avatar 小圖、版本紀錄頁 GitHub 頭像）仍內嵌在原始碼裡。
