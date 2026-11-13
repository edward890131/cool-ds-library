/* IMG-ASSET:v1 站內圖檔路徑（2026-11-13）：照片不再以 data URI 內嵌，改放 library/assets/，由這裡統一算網址。
   正式站首頁是「/」改寫到 /library/gallery，網址停在根目錄 → 相對路徑會找錯地方，要用 /library/assets/ 絕對路徑；
   其他情況（/library/gallery、本機 server、studio-server 的 /gallery.html、直接開 file://）網址都在 library/ 底下，用相對路徑 assets/。
   匯出 zip 時會把用到的圖檔轉回 data URI（flwInlineAssets），匯出檔仍可單獨開。 */
const CDL_ASSET_BASE=(location.protocol!=='file:'&&/\/$/.test(location.pathname))?'/library/assets/':'assets/';
function cdlAsset(p){return CDL_ASSET_BASE+p;}
