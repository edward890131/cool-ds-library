# DS 元件陳列頁 — 變更紀錄

> 檔案：`ds-component-gallery.html`（self-contained HTML，用來跟設計/團隊溝通「元件該多複雜」）
> 來源 spec：`../ds-framework/L0-scope-manifest.yaml`（唯讀，勿寫入）
> 註：本專案尚未建 git repo，此檔手動記錄變更；之後若正式版控可移除。

---

## 2026-11-11（一百二十八）　Tag／Chip 中文置中 v3：只補純中文、拿掉 text-box-trim、Mac 另一組數值

- 使用者回報其他頁面英數變低、部分中文也偏低。原因：①補正套在所有文字上（含英數），且沒標尺寸的預設 Tag 也被補；②`text-box-trim` 在 10px 與縮放範本裡造成 0.5～1px 落差。
- **TXT-OPTICAL:v3**：拿掉 text-box-trim；JS 以 MutationObserver（只看有變動的節點）替「純中文」的 `.tg > span`、`.chp-t` 加 `data-cjk`，只有它們往下補，英文、數字、中英混合不動，切英文自動取消。補正量：一般系統 Tag s 0／m .05em／l .025em、Chip .05em／l .025em；Mac（`html.os-mac`，依使用者截圖實測）Tag s 0／m .09em／l .13em、Chip .09em／l .13em。

## 2026-11-11（一百二十七）　Tag／Chip 中文置中改用 text-box-trim（Mac 一致）

- **TXT-OPTICAL:v2**：使用者在 Mac 實測 Tag L、Chip L 仍偏高約 1.5px、Chip M 約 0.5px。原因是 Mac 的 Chrome 用不同的字體行高數值算行框，固定像素補正在不同系統結果不同。改成兩步：`.tg > span`、`.chp-t` 加 `text-box: trim-both cap alphabetic`（文字框裁到大寫高度～基線，位置不再受行高數值影響；實測行高 1～2.4 位置都不動），再沿用中文模式的 `translateY` 補正（.05em／s 0／l .025em）。Linux 實測六種尺寸上下差 ≤ 0.25px。

## 2026-11-11（一百二十六）　Tag／Chip 中文字垂直置中、建立流程小卡更精緻

- **中文字視覺置中**（`TXT-OPTICAL:v1`）：實測文字框本身已置中，但 Noto Sans TC 疊在 Geist 的行框裡，中文筆畫重心比中心高約 0.6px（12px 字）。中文模式下 `.tg > span`、`.chp-t` 以 `transform: translateY(--txt-optical)` 往下補正（`top` 會被對齊整數像素、無效）：預設 .05em、Tag s 0、Tag／Chip l .025em。補正後六種尺寸上下差都在 0.25px 內；英文模式不補。Button 也有相同偏移，這次未動。
- **建立流程小卡**：圓角 `--r-lg`→`--r-md`、外距 16→6px、項目內距 8→6／8px、項目圓角 `--r-sm`、寬 300→272；標題與項目文字左緣對齊；膠囊內距同步縮小。

## 2026-11-11（一百二十五）　浮動鈕展開／收合動態

- **Floating Line · FAB**（`FAB-MOTION:v1`）：子項不再用 `display` 切換，改成常駐 DOM、以 `.is-open` 切換。展開＝離主鈕近的先出（上移＋放大＋淡入，`--ease-spring`，每顆間隔 45ms）；收合＝遠的先收、往主鈕縮回（`--ease-in`，間隔 30ms）。主鈕 ＋→× 旋轉改彈性曲線。收合時子項 `inert`，不會被 Tab 到。reduced-motion 只淡入淡出。

## 2026-11-11（一百二十四）　模式切換移到頂欄、裝置預覽改下拉、引導小卡放大＋動態、Token 頁「沿用提案」

- **模式切換**（`MODE:v2`）：拿掉專案名下拉選單；logo 右邊放「瀏覽｜編輯」Segmented（新增 `__set` 外部同步選中項、不觸發 onChange）。切到編輯＝開啟新專案（走 `#start`，已走完流程的草稿直接回編輯）；切回瀏覽＝草稿保留、網站回預設，不再跳確認。編輯模式專案名改純 Tag，旁邊放「重新開始」（Button 原子 text）。手機頂欄放不下：切換與重新開始放在側欄最上方（`.nav-mode`）。
- **裝置預覽**：頂欄的四顆 icon Segmented 改成下拉（Button 觸發＋Action Menu 原子，通用 `dsMenu()`），Segmented 留在 DOM 當狀態來源。
- **引導小卡**：距右下 24px（手機 12px）、寬 300、字級 16／14／12、內距放大；展開／收合用 Web Animations 補間寬高，內容淡入（reduced-motion 時不動）。修正 `.pjg`、專案名、重新開始被元件 display 蓋過 `hidden` 而切回瀏覽仍看得到的問題。小卡內的「沿用提案」移除。
- **Token 頁「沿用提案」**：編輯模式且已套用提案時，「查看程式碼 SCSS」右邊放主按鈕。有改動（token 覆寫＋元件換綁，跟提案比）→ 確認後改回提案的值與快速風格；沒改動 → 直接標記沿用，按鈕變「已沿用提案」。
- **品牌問卷「其他」**：字體偏好、深色模式改用 Chip（單選），跟其他題一致。
- **側欄**：編輯模式隱藏版本紀錄，下載元件庫停用（提示改用右上「匯出檔案」）。
- **重新開始**：頂欄 1279px 以下只留 reload 圖示（文字留給讀屏，`aria-label`），768–800px 不再溢出。
- **小卡反色**：引導小卡與收合膠囊改成 `--ink` 底、`--panel` 字（同底部浮動列），淺色模式深底、深色模式淺底；說明字、分隔、hover、進度環都改用 panel 混色。
- 英文翻譯；網站更新紀錄 v46。

## 2026-11-11（一百二十三）　瀏覽／編輯兩種模式、建立流程 4 步＋引導小卡、品牌問卷換算快速風格

依方案 C 修訂版實作（預覽：流程提案 artifact）。

- **兩種模式**（`MODE:v1`）：`dsEditing()`＝`?project=` 或 `FLW.active`；`<html data-mode="browse|edit">`。
  - 瀏覽：元件頁變數篩選與控制面板照常操作（不記錄）；Token 頁只能看（不放快速風格與「重設」，數值欄唯讀、色票不開選色器，頂部 Alert 說明）；側欄沒有「選擇元件」，直接進 `#summary` 顯示 Empty 原子引導開新專案。
  - 進入編輯（`dsEnterEdit`）：有草稿就還原快照接續，沒有就把瀏覽時玩過的篩選清回預設；已走完建立流程的草稿直接回到編輯＋引導小卡，不再開彈窗。
  - 結束編輯（`dsExitEdit`）：草稿保留在瀏覽器，網站回到預設。
- **頂欄**：瀏覽＝母庫提示＋「開啟新專案」；編輯＝專案名（Tag 原子、點開 Action Menu：回到建立流程／結束編輯／重新開始）＋「匯出檔案」（開匯出視窗＝原流程第 6 步內容）。手機專案名截斷，≤374px 只留箭頭。`?project=` 模式維持「儲存並更新」。
- **建立流程彈窗**：`FLW_STEPS` 6 → 4 步（基本資料、匯入資料、品牌問卷、提案確認）；最後一步主按鈕「套用並開始調整」（已套用時「回到網站」）。舊的「調整」步驟移除，舊草稿自動轉換。問卷答案沒變就不重算提案。
- **引導小卡**（取代底部專案浮動列）：右下固定，7 項（4 步＋調整 Token／選擇元件／匯出檔案），可收成膠囊（記在瀏覽器）、點項目回到該步或跳頁。完成判斷：匯入沒放檔＝略過；調整 Token＝跟提案比有改（顯示改了幾個）或「沿用提案」（按鈕，或已確認元件）；選擇元件＝選擇元件頁按「確認元件」且至少 5 個；匯出＝下載後內容沒再變，再改顯示「有新變更」（token、換綁、停用、勾選、各元件篩選一起算）。
- **品牌問卷**（`QS-PRESET:v1`）：4 題 → 快速風格。主色方向→用色（有色號以色號為準）；品牌感覺（最後選的那個）→圓角／陰影／動態／字重；資訊量→間距＋元件尺寸；主要讀者→字級對比＋文字對比。每題下方即時顯示帶入的值；提案確認頁放快速風格面板直接改，提案理由跟著更新；套用後 Token 頁的快速風格跟提案一致。原本的「密度」「圓角感」兩題移除，字體與深色模式保留。
- **英文**：模式、引導小卡、問卷、提案理由（建議元件 69 條）、匯出視窗補齊；網站更新紀錄 v45。

## 2026-11-11（一百二十二）　側欄新增「下載元件庫」，先隱藏上手指南與偏好設定

- **下載元件庫**（`NAV-DL:v1`）：側欄版本紀錄下方新增入口，下載 `goons-ds-library.zip`：`styles/`（Design Token 與基礎樣式）、`styles/components/`（全部元件 SCSS＋`_index.scss`）、`components.html`、`README.md`。內容一律是預設值：打包時暫時清掉 token 覆寫、停用、換綁，元件全選、變數全開，打包完還原，不影響使用者正在調整的畫面。按下後顯示「打包中 n / m」進度。
- **側欄**：上手指南（含手機版入口）、偏好設定先不放入口，頁面本身保留。
- 英文翻譯；網站更新紀錄 v44。

## 2026-11-11（一百二十一）　控制項高度第三包：Tag 高度、關閉鈕統一、快速風格「元件尺寸」

- **Tag 高度**（`CTL-H:v3`）：新增 `--tag-h-s／m／l`＝20／24／28（原本寫死 22／26／32），比控制項小一階；`.tg` 改走 `--tg-h`。表格緊湊、數字變化、首頁霧面標籤的局部覆寫改綁 token。Token 頁「間距與尺寸」新增 Tag Height 群組。
- **關閉 × 鈕**：新增 `--close-h-s`（＝`--ctl-h-xs` 24）與 `--close-h-m`（＝`--ctl-h-s` 32）。Notification 22→24、Alert 28→24、Popover／Tour 26→24（圖示 14）；Modal 28→32、Drawer 30→32（圖示 18，Drawer 拿掉外框，跟 Modal 一樣滑過才出底色）。
- **Drawer 標題列高度**（`DRW-HEAD:v1`）：關閉鈕放大到 32 後把標題列撐成 65 高；改成跟 Modal 一樣用負邊距（−6）讓按鈕吃進 padding，標題列回到由文字決定的 54。
- **快速風格「元件尺寸」**：精巧／標準／寬大，放在「版面」欄間距下方。精巧＝控制項 20／28／36／44、Tag 18／22／26；寬大＝28／36／44／52、Tag 22／26／30；標準＝回預設。
- 英文翻譯（`CTL-H:v3`）；網站更新紀錄 v43。

## 2026-11-11（一百二十）　控制項高度第二包：Tab、Segmented、Pagination 對齊 32／40／48

延續一百一十的控制項高度 token（`--ctl-h-s／m／l`），把另外三顆會跟 Button 並排的控制項也綁上去。

- **Tab**（`CTL-H:v2`）：`.tabi` 高度改走 `--tab-h`（預設 `--ctl-h-m`）；s 30→32、m 38→40，新增 l 48（字級 h10、左右 sp-6）。size 軸改成 s／m／l。範本工具列的檢視分頁（`.ttb-views`）原本寫死 40／緊湊 36，改成 `--ctl-h-m`／緊湊 `--ctl-h-s`。
- **Segmented**：外框高度 s 34→32、m 維持 40，新增 l 48；選項高度＝`--ctl-h-*` − 8（軌道 padding 3＋邊框 1）。size 軸改成 s／m／l，公式 2 × 3 = 6。
- **Pagination**：頁碼方鈕 s 28→32、m 34→40、l 40→48，m 字級改 h10。
- Token 頁「控制項高度」說明補上這三顆；registry 重新產生；英文翻譯（`CTL-H:v2`）。

## 2026-11-11（一百一十九）　P3 六顆元件完成：Time Picker／Color Picker／Cascader／Tree Select／Tour／Menubar

側欄「規劃中」清空（0 顆），六顆都有元件頁（矩陣、展開的樣子／內容組合、什麼時候用、互動預覽＋程式碼）、選擇元件頁、站內搜尋、registry、英文。

- **共用欄位（`PKR-FIELD:v1`）**：四顆表單選擇器共用 `pkrField／pkrPop`：欄位取用 Input 的 `.field`、浮層沿用 Popover（`.pop.pop-float`），開合、點外面、Esc、焦點回欄位的行為同 Date Picker；多選已選項取用 Dropdown 的 `.ddchip`（超過 3 個收成 +N）。軸同 Date Picker：variant × state（預設／聚焦／已選／停用／錯誤）。
- **Time Picker 時間選擇**（`TPK:v1`）：一律 24 小時制；時、分兩欄捲動（分鐘 5 分一格），選項取用 Dropdown 的 `.ddopt`；時段（range）用 Segmented 切「開始／結束」，結束早於開始即時標紅；底部「現在／確定」取用 Button。↑↓ 換數字、←→ 換欄。
- **Color Picker 選色器**（`CPK:v1`）：色票版＝Chip（帶色點）；完整版＝彩度平面＋色相（取用 Slider，軌道換成色相漸層）＋色碼欄（Input）＋同一組色票。欄位左側色塊沿用四邊等距正方形。平面／色相漸層是色彩空間本身，用固定色。
- **Cascader 多層選擇**（`CSC:v1`）：縣市 → 鄉鎮市區兩欄並排，滑過即展開；多選取用 Checkbox（`cbxEl`），縣市旁顯示已選數量。→ 進下一層、← 回上一層。
- **Tree Select 樹狀選擇**（`TSL:v1`）：浮層直接放 Tree View（單選 plain、多選 checkbox variant）；多選補上「勾上層＝整組、下層全勾＝上層自動勾」。
- **Tour 新手導覽**（`TUR:v1`）：placement × step（4 × 3），boolean progress／close。卡片沿用 Popover（箭頭、標題列、動作列），按鈕取用 Button；導覽遮罩用 modal 的 `--s-scrim`。互動預覽是一個小訂單頁，三步依序框出搜尋、篩選、新增；側邊放不下自動改放下方，箭頭始終對準目標。
- **Menubar 選單列**（`MBR:v1`）：variant（外框／無框）× state × size（2 × 4 × 2）。上層取用 Menu item、下拉面板取用 Action Menu、快捷鍵取用 Kbd；打開後滑到其他選單直接切換、←→↑↓ Enter Esc 完整鍵盤操作，右邊放不下時面板靠右。
- **英文**（`P3-I18N:v1`）：196 條字串＋動態字串規則；6 個和既有譯法衝突的詞（說明、展開、外框…）不覆蓋，選單列內的「檔案／說明」另外譯成 File／Help。

## 2026-11-11（一百一十八）　色號欄色票四邊等距；手機跑馬燈拿掉左右漸層

- **色號欄色票**（`SWATCH-SQ:v1`）：首頁快速風格「主色／輔助色」與開新專案流程的色號欄，左側色票原本 28×24 長方形，在 40 高欄位裡左距 5px、上下各 8px。改成上下內距同左側（`--sp-1`），色票撐滿內高並固定正方形（40 高時為 30×30），四邊都是 5px；欄位高度改變也會跟著等距。
- **手機跑馬燈**（`PHS-NOFADE:v1`）：拿掉 `.hx-phs-view` 左右 6% 的漸層遮罩，手機在畫面邊緣直接切齊。

## 2026-11-11（一百一十七）　頁面小標只留分類

- **頁面標題上方小標**（`EYEBROW-TRIM:v1`）：元件頁、範本頁的小標原本是「L3 Component · Button Group」，後半跟大標重複，改成只留分類（L3 Component／L3 Family／Template／Basic）。共用 `ebTrim()` 套在 `viewScaffold`、`bentoHTML`，Button 與 Logo 頁的寫死小標一起改。Design Token、選擇元件、上手指南等非元件頁的小標（如「Foundation · Design Token」）維持原樣。

## 2026-11-10（一百一十六）　範本分頁補回切換動態；水平選單加滑動底線

- **範本分頁動態**（`TAB-KEEP:v1`）：後台儀表板（營運摘要／統計報表）和網站範本最新消息（全部／重要公告／最新消息）的 Tab 用的是 contained 元件，但點擊後整頁重畫、分頁列被重建，元件的果凍切換動態還沒播就被換掉。改成分頁列只建一次、重畫時搬回同一條，點擊就看得到跟 Tab 元件頁一樣的果凍彈跳。
- **水平選單滑動底線**（`MENU-SLIDE:v1`）：Menu 水平版（Header 導覽、Menu 元件頁、Shell 頂部導覽）可點擊時，選中底線改成單一條 `.mn-sind`，換選中項時滑過去，曲線與時長同 Tab line 的 `.tab-ind`（`--dur-default`）；原本各項自己的 `.mn-ind` 在這時隱藏。字型載入前不顯示、首次定位不滑；選中字變粗造成寬度變化時用滑動補位，不會中途跳掉。靜態矩陣不受影響。

## 2026-11-10（一百一十五）　選擇元件頁變數改用 Chip；搜尋彈窗底部內距

- **選擇元件頁**：展開牌卡後的變數選項原本是手刻 `.sum-chip`（外框膠囊、未選加刪除線），改取用 Chip 原子 multi／s（24 高、12px、semibold；選中＝`--ink` 底＋勾、未選＝`--panel-2`），每軸一個 `role=group`。「每軸至少留一個」與輕晃提示保留（`.sa-chips .chp.is-deny`），選取一樣寫回共用的 `CHOICE`，與元件頁變數篩選器同步。刪除 `.sum-chip` 樣式。
- **搜尋彈窗底部操作列**（Command 元件 `.cmd-foot`）：padding 由 `--sp-2 --sp-4`（6／12）改成 `--sp-4`（四邊 12），上下與左右一致；Command 元件頁與站內搜尋同步。
- **Chip 多選拿掉勾**（改 Chip 原子）：刪除 `.chp-ck`，單選與多選外觀相同、只靠 `--ink` 底區分選中；Chip 頁說明與 Live 註記同步。
- **選擇元件頁變數**改用 Chip m（32 高）；文字只顯示一種語言：每顆放中文、英文兩段，依 `html[lang]` 只顯示目前語言（中文模式＝去掉附帶英文，如「標準 m」→「標準」、「Stack 直排」→「直排」；英文模式＝軸值本身，如 line／contained）。Size 軸兩種語言都只顯示 s／m／l；純英數標籤（如「sp-2 · 6」）照原樣。
- 網站版本紀錄加 v40；英文同步。

## 2026-11-10（一百一十四）　說明文字連結改用 Link 元件、不再加粗

- **問題**：元件頁標題下方說明（`.lede`）、段落副標（`.bh-d`）、首頁 FAQ 裡的 `<a>` 沒有任何 class，吃瀏覽器預設樣式（未造訪藍、已造訪紫、實線底線），深色模式特別突兀。全站盤點 39 頁、91 個（lede 86、FAQ 4、副標 1）。
- **修正**（`LNK-ADOPT:v1`）：`renderView` 換頁後呼叫 `adoptTextLinks(view)`，替這三處沒有 class 的連結套上 Link 原子 inline（`.lnk.lnk-inline`：`--accent` 字色、35% 透明底線、hover 轉實色、focus 外框），不必逐頁改 lede 字串；元件示範與程式碼裡的連結不動。修正後盤點 0 個殘留。
- **說明文字不加粗**：`.lede b`／`.lede strong` 改成 `font-weight:inherit; color:inherit`，原本標粗（並加深成 `--ink`）的字跟內文一樣；字串裡的 `<b>` 保留不刪，之後要恢復只改這一條 CSS。全站 96 頁 256 處，量測確認沒有比內文粗的字。
- **Link inline 字重**：`.lnk-inline` 加 `font-weight:var(--lnk-fw,var(--fw-medium))`（400→500），與 standalone 一致；改的是 Link 原子本身，全站段落內連結一起變（說明文字、FAQ、Link 元件頁、範本內 inline 連結）。
- **Link 顏色改資訊藍**（試用）：新增 `--lnk-c`，淺色 `--c-info-600`（#2563EB，對淺底 4.95:1）、深色 `--c-info-400`（#60A5FA，對深底 8.06:1），皆過 WCAG AA；聚焦外框同色；已造訪、停用維持原樣。改的是 Link 原子，全站文字連結一起變；要換回品牌色只改 `--lnk-c` 那三行。
- 網站版本紀錄 v39 加四項；英文同步。

## 2026-11-10（一百一十三）　頂欄改用元件庫元件：Toggle（新增圓鈕圖示）、Input＋Kbd、Tag

- **盤點**：頂欄 10 個元素中有 3 個沒取用元件庫（鐵則 5）：深淺色切換 `.theme-toggle`、搜尋入口 `.ss-trig`、專案名稱 `.ds-badge-proj`；其餘（選單／上手指南／Github／開啟新專案＝Button、裝置預覽／中 EN＝Segmented、logo＝品牌資產）已是原子。
- **Toggle 新增 boolean `icon`**（`TOGGLE-IC:v1`）：圓鈕裡放圖示，關＝`ic-off`、開＝`ic-on`，跟著圓鈕彈簧移動；關＝白鈕＋`--c-neutral-800` 圖示、開＝`--primary-on` 鈕＋`--accent` 圖示。`switchEl(state,{icon})`、`switchIc(icon)`；Toggle 頁新增「icon 圓鈕圖示」四態示範、Live 多一個 icon 開關；DIAL_SPECS／registry 加 `bools.icon`。另補 `.switch:focus-visible` 外框。
- **深淺色切換**改用 Toggle（`switch has-ic`，開＝深色＋月亮、關＝淺色＋太陽，`role=switch`＋`aria-checked`），尺寸 46×26 → Toggle 的 44×24；刪除 `.theme-toggle`／`.knob`。
- **搜尋入口**改用 Input 原子（`.field v-outline fsz-s live-field`，32 高）＋既有 Kbd（⌘K），頂欄只留寬度與彈性設定；平板 220 寬、隱藏 ⌘K；**手機**改用 Button 原子 outline／secondary／icon-only s（`#ssTrigM`，跟漢堡鈕同款），不再用 CSS 把欄位硬改成圖示鈕。兩個入口都開同一個搜尋面板。
- **專案名稱**（專案模式）改用 Tag 原子 soft／neutral／round／m；母庫模式的提示是一整句說明，維持文字。版本號更新改寫 Tag 內層文字。
- 網站版本紀錄加 v39；英文同步。

## 2026-11-10（一百一十二）　新元件 Chip 選擇膠囊；快速風格改取用 Chip

- **起因**：快速風格的選項膠囊是手刻的 `.tkp-pill`（`token-presets-pills` patch 加的），沒取用任何原子，違反鐵則 5；Tag 只顯示狀態、站內 `.chip` 不是 library 元件，都沒有單選狀態可用。照鐵則 5「沒有對應原子就先建原子」新增 Chip。
- **Chip 選擇膠囊**（`CHIP:v1`，Form 表單，id `chip`）：`type` single／multi × `state` default／hover／selected／disabled × `size` s／m／l（**24**），boolean `dot` 色點、`icon` 前置圖示。高度綁 `--ctl-h-xs`／`--ctl-h-s`／`--ctl-h-m`（24／32／40）；未選 `--panel-2`、滑過 `--panel-3`、選中 `--ink` 底＋`--panel` 字，多選選中時前面多一個勾；圓角 `--r-pill`。**字級、字重對齊同高度的 Button**：m 32＝Button s（`--fs-h11` 12px）、l 40＝Button m（`--fs-h10` 14px）、s 24 也用 12px；字重 `--fw-semibold`。
- **建構器**：`chpEl(type,state,size,o)` 單顆、`chpGroup(type,size,{items,value,onChange,label|labelledby})` 一組。單選＝`radiogroup`／`radio`（方向鍵移動並選取，跳過停用項，Tab 只停在選中項），多選＝`group`／`checkbox`；`aria-checked` 同步。
- **元件頁**：State × Size 矩陣（每個 type 一塊）、Content 示範、使用時機（vs Segmented／Radio・Checkbox／Dropdown／Tag）、Live（Type、Size、dot、icon、停用一項）與自動產生的 HTML／SCSS。同步 NAV、DIAL_SPECS、BUILD／LIVE、搜尋關鍵字、TOKEN_SLOTS（`--chp-radius`／`--chp-pad-x`／`--chp-fs`）、ATOM_SET、registry（`build-registry.js` 重產，只多 chip 一筆，總數 96→97）。
- **快速風格**改用 `chpGroup('single','m')`（用色帶 dot），刪除 `.tkp-*` 樣式；選項文字 14→12px、字重 400→600。
- **順手修正**：TOKEN_SLOTS 裡 Segmented 圓角預設仍寫 `--r-md`，改成實際的 `--r-sm`。
- **順手修正**：首頁地圖配圖的點狀過場在配圖框還沒有尺寸（換頁中、隱藏）時會用 0 寬畫布呼叫 `drawImage` 報錯；框寬或高 < 2px 時跳過過場直接換圖。
- 網站版本紀錄加 v38；英文同步。

## 2026-11-10（一百一十一）　控制項高度後續：Segmented 圓角、按鈕 hover 底色、列高切換、甘特圖進場

- **Segmented 圓角縮小**：外框預設 `--r-md`（8）→ `--r-sm`（4），滑塊／選項 −2px、最小 `--r-xs`（2）；`.sgm`（元件）與 `.seg`（站內控制項）兩套一起改，`--sgm-radius` 局部覆寫不受影響。
- **text／soft 按鈕 hover 底色變小一圈**：hover 掃入底色畫在 `::before`（inset:0），只蓋到 0.75px 透明邊框內側；旁邊的 solid 按鈕邊框與底色同色，所以看起來比較大（表單「清除」vs「建立帳號」、篩選浮層「清除」vs「套用」）。改成 `inset:-0.75px`，text／soft 的 `.live` 不裁切，底色與 solid 同大。
- **Table Toolbar 列高切換**（寬鬆／緊湊）：boolean `densityToggle` 預設改關，demo 與矩陣不再顯示；需要時可在 Content 打開。
- **甘特圖進場**：`gnt-reveal` 的 clip-path 拿掉 pill 圓角，長條進場時就是直角。
- **頂欄裝置預覽的 tooltip 被切掉**：開啟平板／手機預覽時，頂欄 tooltip 下半被預覽層（z 39）蓋住。原因是 `tb.classList.add('has-rwd')` 先前被併進上一行的 `//` 註解、從沒執行，`.topbar.has-rwd{position:relative;z-index:41}` 沒生效；拆回獨立一行。
- **元件頁左側控制面板 Size 選項統一**：一律由小到大（xs → s → m → l → xl），只顯示 s／m／l 英文，拿掉「小／標準／大／精簡／寬」等中文與大寫 S／M／L（23 處 `mountLive` segs＋Calendar）。原本反序的：Tab、Article Card、Person Card、Calendar、Chart、Schedule Chart；Price 的 sm／md／lg 顯示成 s／m／l；Icon 維持 16／20／24／32（px）。預設選取與切換不變。

## 2026-11-10（一百一十）　控制項高度 token：Button、Input、Dropdown（第一包）

- **新 token**（`CTL-H:v1`，L1「間距與尺寸」新增 Control Height 群組，可在 Token 頁手調）：`--ctl-h-xs 24`、`--ctl-h-s 32`、`--ctl-h-m 40`、`--ctl-h-l 48`；手機先不另給。
- **Button**：`.btn.sz-*` 從固定 `height` 改成 `min-height:var(--ctl-h-*)`＋上下 padding（s 6／m 8／l 12px），平常一樣高，字放大時跟著長；icon-only 維持正方形（寬＝token）。刻意做小的按鈕（邀請卡 accept 連結、AI 專案＋、小月曆箭頭、商品卡購物車）明確解除最小高度。
- **Input／Dropdown**：`.field` 改 `min-height:var(--field-h,var(--ctl-h-m))`＋上下 4px；新增尺寸 class `fsz-s`／`fsz-l`（`inputEl(v,s,size)`、`ddEl(…,size)`、`ddField({size})`）；DIAL_SPECS 的 input、dropdown 加上 `size` 軸（s／m／l），元件頁矩陣依尺寸分塊、Live 多一個 Size 切換；registry 同步。**預設 m 從 36 改為 40**，跟 Button m 對齊。
- **清掉局部寫死**：表格工具列、圖表卡內下拉、清單選單、Token 頁預覽欄位改用 `--field-h`；邀請卡輸入框拿掉 40px（預設即 40）。範本（後台、網站、AI 對話控制卡）工具列與卡片標題列的下拉、搜尋框改用 s，跟旁邊的 s 按鈕同為 32。
- **稽核**：寫了一支全站高度比對腳本（106 頁逐一量每顆 `.btn`／`.field`），改動後 Button 高度零變動；Input／Dropdown 只有預設 36→40 與範本工具列 36→32 兩種預期變化。
- 網站版本紀錄加 v37；英文同步。

## 2026-11-10（一百零九）　快速風格改兩欄表單式、可收合

- **排版**（`TOK-PRESET:v2`）：原本 8 組依寬度自動換行，上下兩排起點對不齊。改成兩欄：左「版面」（間距、圓角、陰影、動態）、右「色彩與文字」（用色、字級對比、字重、文字對比），欄首小標＋細線；每列「固定寬標籤（5.5em）｜膠囊」，同欄膠囊起點對齊。≤1100px 單欄、≤599px 標籤在上膠囊在下。
- **收合**：標題列右側收合鈕（Button 原子 text／secondary／s＋chevron，展開朝上、收合朝下，`aria-expanded`），預設展開；內容以 grid-template-rows 0fr↔1fr 過場。收合時說明文字換成摘要，用 Tag 原子列出非預設選項（如「間距：寬鬆」「用色：冷靜」），全部預設顯示「全部預設」。收合狀態在選項觸發的重繪、切換 L1／L2 分頁時都會保留。
- **回到預設**：收合鈕左邊加一顆（Button 原子 text／secondary／s），只把八組選項還原成預設（各組刪掉自己管的覆寫），手調的其他 token 保留；全部預設時停用。上方「重設」仍是清掉全部覆寫。手機版（≤599px）改成 reload 圖示按鈕（`refresh-cw`，32×32，aria-label／title 仍是「回到預設」）。
- **選擇元件頁**：先移除右上角「複製此頁 JSON」按鈕（首頁示意圖同步拿掉）。
- 網站版本紀錄加 v36；英文同步。

## 2026-11-10（一百零八）　快速風格新增圓角、陰影、動態、文字對比

- **圓角**：方正（xs 0／sm 2／md 4／lg 6／xl 8／2xl 12／3xl 16）／柔和＝預設／圓潤（4／8／12／14／20／28／36）／膠囊（圓潤＋`--btn-radius`、`--field-radius` 改 pill）；lg、xl 依 desktop／tablet／mobile 各自給值（mobile 4／6、12／16）。
- **陰影**：扁平（`--e-sm…2xl` 全部 none）／輕柔＝預設／立體（亮色濃度約加倍、模糊約 ×1.5；暗色另給一組 .6–.85）。
- **動態**：俐落（fast 90／default 180／slow 300、hover-delay 150ms）／適中＝預設／悠緩（225／450／750、350ms）／靜止（全部 1ms、hover-delay 0）。
- **文字對比**：柔和（亮：text-2 → neutral-500、text-3 → 400、border 200／300；暗另給）／標準＝預設／高對比（亮：text-2 → 700、text-3 → 600、border 400／500；暗：text-1 #FFF、text-2 #C4C6CC、text-3 #9A9CA4、border #3A3C42／#4A4D54）。
- **修正**：L2 亮色值定義在 `:root[data-theme="light"]`，原本覆寫只寫 `:root` 蓋不過（手調 L2 亮色、陰影都沒生效）；覆寫改成 `:root,:root[data-theme="light"]`。
- 字級對比選項改名「強烈／適中／含蓄」、動態「靜止」：原本「大／中／小」「關閉」的英文對照會蓋掉全站同字的翻譯（尺寸標籤、關閉按鈕），已還原為 Large／Small／Close。
- 網站版本紀錄加 v35；英文同步。

## 2026-11-10（一百零七）　AI 輸入列使用量、首頁手機跑馬燈更順

- **方案使用量**（`AIC-USAGE:v1`，Chat Composer 新 boolean `usage`，標準版）：送出鈕左邊一顆圓環顯示每週額度 %（≥80% warning、≥95% danger），滑過／聚焦／點擊浮出面板（參考 Claude Code）：「方案使用量限制 · Pro」＋查看全部、每週 · 所有模型與每 5 小時 · 對話兩列（重設時間＋%＋Progress 條）。Live 每送出一則 +1／+2%，圓環輕彈。AI 對話範本電腦版同步出現。
- **首頁手機跑馬燈效能**：原本每一幀都讀 `offsetWidth`、`getComputedStyle` 與每支手機的 `getBoundingClientRect`，每幀強迫 15 份範本 DOM 重排，所以卡。改成尺寸變動時才量（ResizeObserver），可視判斷用位置推算、每 250ms 一次；手機螢幕 `contain:strict`＋獨立圖層，內部捲動只重繪自己；複製組數改為剛好蓋滿螢幕（1440 寬從 15 支降到 10 支）。主執行緒耗時實測約少 40%（519 → 309 ms/s）。速度 26 → 40 px/s。
- 網站版本紀錄加 v34；英文同步。

## 2026-11-10（一百零六）　首頁手機新增圖表展示

- **首頁手機跑馬燈**新增第五支「圖表：統計報表」（第三支）：以後台統計報表手機版為底，在原本的堆疊面積、付款方式甜甜圈、熱銷排名、結帳漏斗外，再補上 spark 趨勢小圖卡（開頭）與 combo 組合、heatmap 熱力、bar-stack 堆疊長條（結尾），一支手機就看到 8 種圖表。
- 流程：切掉／切回一條堆疊面積的系列（圖例）→ 排名改由低到高再改回 → 漏斗下拉選「手機」→ 往下捲過組合、熱力、堆疊長條。點這支手機會開 Chart 元件頁。
- 網站版本紀錄加 v33；英文同步。

## 2026-11-10（一百零五）　快速風格改單選膠囊、用色換主色

- 快速風格面板移到 L1／L2／框架索引分頁上方（三個分頁都顯示），與分頁列之間留 `--sp-6`。
- 選項從 Segmented 改成單選膠囊（`role=radiogroup`，方向鍵切換；選中＝ink 底），參考篩選面板的 chip 排法：每組依選項寬度排開、放不下才換行。拿掉選項下方的數值小字與標題旁的說明。
- 用色新增「中性」（預設黑），冷靜／自然／溫暖／活潑改成換**主色** `--c-brand-*`（9 階）＋灰階色調，不再改輔色 brand2；用色膠囊前加色點。
- 新 class 用 `tkp-` 前綴（`.tok-pill` 已被 token 狀態標籤使用）。
- 網站版本紀錄加 v32；英文同步。

## 2026-11-10（一百零四）　Design Token 快速風格、選擇元件頁直接點選變數

- **快速風格**（`TOK-PRESET:v1`，Design Token 頁 L1 分頁最上方、色彩之前）：四組 Segmented，不用輸入數值，選了就改寫 `__tokOverrides`（跟手調同一份，可再微調、可匯出 SCSS；「重設」一併清掉）。第一版數值：
  - 間距：密集 ×0.8／適中＝預設／寬鬆 ×1.25（`--sp-1…9`，desktop／tablet／mobile 各自依該 tier 的 base 值換算，取偶數 px）。
  - 字級對比：大／中／小＝標題 h1–h8 與 16px 的差距 ×1.2／×1／×0.8（內文 h9–h12 不動，依 tier 換算）。
  - 字重：份量（medium 600、semibold 700、bold 800、標題 h1–h4 700、h5–h7 600）／適中＝預設／輕盈（medium 400、semibold 500、bold 600、標題 500／400）。
  - 用色：冷靜（藍 brand2＋冷灰 slate）／自然（綠＋中性灰）／溫暖（橘＝原本 brand2＋暖灰 stone）／活潑（桃紅＋預設灰）；改 `--c-neutral-*`（11 階）與 `--c-brand2-*`（9 階），主色 brand（黑）不動。
- **選擇元件頁**：展開牌卡後不再掛實際操作 Live；各軸選項改成可點的按鈕，直接加入／排除該變數（共用元件頁「變數篩選器」的 CHOICE，每軸至少留一個，最後一個再點會輕晃提示），變體數與總數即時更新；底部「我要調整」改成主 CTA「前往元件」（solid primary）。
- 網站版本紀錄加 v31；英文同步。

## 2026-11-10（一百零三）　範本側邊欄 hover 修正

- **Menu hover 底色**：範本畫面被等比縮放（tplFit）時，hover 底色的位置與大小用元件自身座標計算（rect 差 × 縮放比、寬高取 offsetWidth／offsetHeight），不再偏位。
- 網站版本紀錄加 v30；英文同步。

## 2026-11-10（一百零二）　地圖方塊移動、手機流程去點擊圈、消息列 hover

- **首頁地圖**：目前地標的方塊（含十字細線、經緯度、城市名、配圖）改成自己在地圖上移動（每格 7.5% 緩動），鏡頭以 2.8% 慢一拍跟上，畫面上看得到方塊與細線從上一個城市滑到下一個；原城市位置保留一般地標小方塊。經緯度改依方塊進度滾動。
- **首頁手機流程**：拿掉灰色點擊圓圈（`.hx-ph-tap`），只保留節奏（停頓後呼叫元素 `click()`），直接呈現元件狀態變化。
- **News Item**：hover 底色加 `background-color` 過場（進場 dur-default、離場 dur-slow×1.2，ease-out）。
- 網站版本紀錄加 v29；英文同步。

## 2026-11-10（一百零一）　首頁手機操作流程、圖表對齊、兩顆新牌卡、AI 側欄專案

- **首頁手機**（`HOME-PHONES:v2`）：七支改成四支，每支跑一段真的操作流程，手指圓點移到目標、按下（縮小＋漣漪）再呼叫範本元素自己的 `click()`：
  - AI 對話：點輸入框 → 逐字打字 → 送出 → 等回覆完成，兩輪後重來。
  - 後台：儀表板點待處理訂單 → 訂單明細捲動 → 開選單 → 點「訂單」到訂單列表。
  - 最新消息：點「重要公告」分頁 → 點消息 → 文章內頁慢慢往下捲。
  - 商品列表：點「篩選」→ 選類型 → 收起 → 結果往下捲。
  計時只算手機在畫面上的時間（離開畫面就暫停），每輪結束淡出後換新的一份範本重來；四支一組依螢幕寬複製 2–3 組，複本錯開起始。首頁協作游標（藍色名牌）在這個段落隱藏，只留「查看範本」跟隨按鈕。
- **Chart**：funnel 列不再左右內縮（hover 底色改往外長），文字與長條跟標題切齊；combo 拿掉「分開／雙軸」切換（Live 的 layout 選項一併移除），固定上下分開，刻度貼左、圖表撐到右緣；卡內下拉改 32px 與 s 按鈕同高；bar-rank s 改成名稱在上、長條＋數值在下，最小寬 220px；stat 統計數字的趨勢改用 Tag（soft success／danger）。
- **新牌卡**（`CARDS6:v1`，Card 分類）：**News Item 消息列表項**（type 重要公告／最新消息 × state，boolean date／summary）、**Product Tile 商品格**（badge 無／新品／熱門 × price 一般／折扣 × state，boolean cart）。都從網站範本抽出；最新消息範本、商品列表、文章內頁相關商品改取用元件；registry 與 TPL_COMPOSE 同步。
- **文章卡封面 hover**：參考 transitions.dev「Image open tilt」（Zoom with 3D tilt and bend，Pro 付費、無原始碼，依描述重做）：放大 1.1＋跟著游標的 3D 傾斜（±6°，perspective 720px），離開回正；減少動態時只微放大。順便修正 `.im-img.is-loaded` 的 blur-up 動畫用 `fill:both` 卡住 transform，導致所有牌卡 hover 放大失效（改 `backwards`）。
- **AI 對話範本側欄**：最上方新增「專案」資料夾（用 Menu 元件 vertical＋groups＋nested＋icon），點資料夾展開收合、圖示在 folder／folder-open 之間切換，標題列有「新增專案」；專案對話與最近對話共用同一個選取狀態。
- **AI 輸入列**：附件與工具 chip 的移除 × 收進 chip 右側，不再夾在兩顆 chip 中間。
- **首頁地圖十字座標**：參考 piergorelli.com 的游標座標效果：目前地標方塊拉出貫穿地圖的 X／Y 1px 細線，右下方以等寬小字顯示經緯度（例 `N 25.0330° · E 121.5654°`，城市真實座標寫在 `HX_GM.geo`）；鏡頭移動時細線跟著走，數字依鏡頭進度從上一個城市滾到下一個。
- 網站版本紀錄加 v28；英文同步。

## 2026-11-10（一百）　首頁手機與地圖過場、圖表同步範本、Menu 側欄結構、行動版頁尾

- **首頁手機跑馬燈**（`HOME-PHONES:v1`）：Figma 外框已移除狀態列，程式畫的 9:41／訊號／電量一併拿掉，只留動態島下方留白；拿掉段落小標題、每支手機下方字幕與「看所有範本」按鈕。改成滑過段落時游標變成跟隨的「查看範本」按鈕（同首屏 mockup 的 cursor pill 作法），點哪支手機就開對應範本；段落可用 Tab 聚焦、Enter 開 AI 對話範本。手機內自動送出的程式點擊不會誤觸換頁（只接受 `isTrusted` 點擊）。滑過不再減速；畫面捲動改成 easeInOutSine 連續緩動（每段 140px／2.8 秒，到底停 2.2 秒再 4 秒慢慢回頂）。AI 對話畫面高度改成剛好填滿螢幕（742px），輸入列底部多留 22px 避開圓角。
- **地圖配圖過場**：參考 transitions.dev「Image generation placeholder」（Dot noise wakes, then resolves into the image；該效果為 Pro 付費、拿不到原始碼，依描述重做）。canvas 點陣雜訊（地標藍）先亮起，再依亂數順序逐點換成照片取色（小圖放大＋點遮罩，`file://` 也不需讀像素），最後原圖由模糊淡入、點陣淡出，全程約 1.6 秒；減少動態時直接換圖。
- **Chart 圖表同步後台範本**：長條（bar、bar-rank、combo）預設細柱，funnel／bar-rank 列高改 10px（s 8px）；卡內切換預設改 Dropdown（`o.dropdown===false` 才用 Segmented），bar-rank 排序改一顆按鈕切換，Live 控制列的「排序 sort」分段移除；下拉寬 112px 改為全域。**移除 gauge 儀表**（DIAL_SPECS、群組、Live 選項、CSS、繪製程式），圖型 16 → 15，矩陣 32 → 30；「進度與分布」段改名「分布」。
- **Schedule Chart 排程圖**：甘特條 16 → 12px（s 10 → 8px），圓角 pill → 直角，跟長條圖細柱一致。
- **Menu 選單**（`MENU-TREE:v1`）：後台範本側欄用的就是 Menu（vertical）。新增三個 boolean property：`icon` 左側圖示、`groups` 分類小標題（`o.sections=[{title,items}]`）、`nested` 內層列表展開收合（`item.children`，父層帶箭頭、aria-expanded，含當前頁的父層預設展開，收合時內層 inert）。hover 底色改用 rect 定位以支援分組與巢狀；葉節點可用 Tab／Enter 操作。元件頁新增「Sidebar 結構」段落，Live 新增 groups／nested 勾選（水平時隱藏）。後台範本側欄改直接用 `mnBar` 的 sections，不再自己拼小標題。registry 的 menu 補上 bools。
- **Footer 頁尾**：行動版連結欄改兩欄並排、間距收緊；底列改成版權一行＋一列動作（社群靠左、語言＋回到頂部靠右），回到頂部在行動版只留上箭頭（icon-only）。社群拿掉 Twitter、Instagram，改 Gmail（`mailto:edward890131@gmail.com`）；GitHub 連到 repo；LinkedIn 連到 `linkedin.com/in/chenyu-yang-023886201`，另開分頁。回到頂部按鈕實際可捲回頂端。Icon Library 品牌社群分類補上 Gmail。
- 網站版本紀錄加 v27；英文同步。

## 2026-11-10（九十九）　地圖配圖與部落格換成正式照片

- **首頁地圖配圖**：`library/assets/map/` 六座城市換成使用者提供的正式圖（台北 101、木屋筆電會議、現代建築庭園、維多利亞港、吊燈開放式辦公室、高樓會議室），另補備用 `home-office.webp`；檔名不變，程式不用改。
- **網站範本配圖**：部落格卡片、文章封面與插圖、推薦文章改用六張新照片（白板討論、設計工具筆電、夜間程式桌面、手機 App、剪影群像、山景），以 640×400 webp 內嵌（`TWS_BLOG`，共約 140KB），原檔 1280 寬存在 `library/assets/photos/`。商品列表維持原本服飾照片。
- 照片皆來自 Unsplash（Unsplash License），攝影師列在兩份 README。

## 2026-11-10（九十八）　網站範本四頁、首頁手機跑馬燈、地圖配圖、FAQ 改寫

- **網站內容頁範本**（`TPL:v3`）：Product List 商品列表、Blog 部落格、News 最新消息、Article 文章內頁。只取參考稿（全網全站 UI）的版型架構：頁首（Header）→ 頁面橫幅 → 左側篩選 240px／右側內容 → 頁尾（Footer simple）；內容欄最寬 1120px。電腦 1280／手機 375，情境：正常、載入中（Skeleton）、空資料（Empty）。
  - 商品列表：類型 Segmented、標籤 Checkbox、優惠 Tag、價格 Slider；商品格改用 Image＋Tag＋Price＋Button 原子組成（Product Card 已從元件庫移除，鐵則 2；手機兩欄）、排序 Dropdown、Pagination。手機篩選收進「篩選」按鈕。
  - 部落格：主題篩選＋Article Card 格線＋「載入更多」。
  - 最新消息：Tab（全部／重要公告／最新消息）＋排序＋消息清單（Tag、日期、標題、摘要）＋分頁；點消息進文章內頁。
  - 文章內頁：主欄（回部落格、作者與閱讀時間、標題、封面、內文、清單、配圖、引言、表格、Alert 重點整理、上一篇／下一篇）＋右側目錄（點擊捲到段落）與推薦文章＋相關商品（同商品格）。
  - `build-registry.js` 改為讀取所有 `*_SHELL` 共用清單，範本的組成元件都對得到 registry。
  - 圖片沿用站內已內嵌的示範照片。
- **首頁手機跑馬燈**（`HOME-PHONES:v1`，FAQ 之後）：iPhone 外框取自 Figma 社群檔「iPhone 16/17 Free Mockup」（iphone17pro），螢幕挖空、狀態列改用程式畫（跟著主題變色），webp 內嵌約 13KB。7 支手機裡是真的手機版範本（AI 對話、後台儀表板、商品列表、訂單列表、最新消息、統計報表、文章內頁）等比縮小；**主題與外面相反**（暫時切換根節點主題讀出全部 token 套在跑馬燈上），切換深淺色會即時更新。慢速向左捲動（26px／秒），滑出左邊的手機搬到最後，不複製 DOM；畫面外暫停、滑過放慢、減少動態時靜止；手機內容不可點（inert）。螢幕內自動捲動，AI 對話每 9 秒自動送出問題跑完整流程。
- **地圖配圖**：鏡頭移到地標時，旁邊浮出 4:3 配圖並加藍色四角框（同地標色）；切換時淡出換圖再淡入。圖片放在 `library/assets/map/<城市>.webp`，同名覆蓋即可換圖；目前是用現有示範照片裁切的暫代圖，命名與換圖指令記在 `library/assets/map/README.md`。
- **常見問題**：改寫為 6 題——新增「這個網站是做什麼的？」「我要怎麼開始一個新專案？」「範本（Template）是什麼？可以直接用嗎？」；「首頁調色會不會改到整站」併入第一題；「可以直接複製程式碼嗎」補上範本頁。
- 網站版本紀錄加 v25；英文同步。

## 2026-11-10（九十七）　後台小分頁、營收標題帶單位、手機分頁列重排

- 後台儀表板 Tab 改 s 尺寸。
- 今日營收：標題改「今日營收 (NT$)」，數字前後不再放單位或前綴。
- 訂單列表分頁列改三區（每頁筆數｜筆數範圍｜分頁器）；手機版每頁筆數靠左、範圍靠右，分頁器換到下一行置中，不再錯位。英文版「筆」不顯示。
- 網站版本紀錄加 v24。

## 2026-11-10（九十六）　範本控制卡均分與可調寬、後台外框分頁、付款方式甜甜圈

- **範本左側控制卡**：分段按鈕改為均分寬度（`sgm-full`，比照元件頁）；控制卡與預覽之間加拖曳把手（沿用 `.bento-rz`），寬度 200–400px，可用方向鍵調整，記在 localStorage。
- **後台分頁**：灰底 soft 在淺色模式下未選取的分頁幾乎看不見，改為外框（contained）樣式。
- **統計報表（手機）**：分頁獨立一行，下一行年份切換靠左、下載按鈕靠右，對齊內容邊界。
- **今日營收**：金額單位「元」改為數字左側的小前綴（英文為 NT$），英文版不再撐寬。
- **甜甜圈圖**：「每月訂單的付款方式」改為「付款方式占比」甜甜圈（占比類資料最適合；營收趨勢、排行、漏斗都不是部分對整體的關係）：中央顯示總訂單、右側清單列出占比與筆數，月份用 Dropdown 切換；窄版改上下排列。Chart donut 新增自訂資料參數（`segs`、中央文字、aria），hover 提示一併支援，預設外觀不變。
- 網站版本紀錄加 v23；英文同步。

## 2026-11-10（九十五）　範本控制項移到左側、後台對齊與手機頁首

- **範本頁版型**：裝置／情境切換比照元件頁，放在左側控制卡（標籤靠左、Bento 控制欄樣式，捲動時固定）；選項超過 4 個（AI 對話的情境）改用 Dropdown。電腦版範本以原寬度（1180／1080）排版，預覽區不夠寬時等比縮放（`tplFit`），不會被擠成平板版面。
- **商品明細**：卡片內的表格首末欄去掉左右內距，與卡片標題、合計區切齊；Table 表頭對齊改為跟著欄位（`tbl-num` 欄靠右），修正單價、數量表頭跑掉。
- **KPI**：單位改為與數字基線對齊、拉開距離；英文版計數單位（筆）不顯示、金額單位 NTD，不再撐爆。
- **手機版**：頁面上方內距加大；頁首主要按鈕留在右上角不換行，次要按鈕（下載 CSV、列印出貨單）只留圖示。
- 網站版本紀錄加 v22；英文同步。

## 2026-11-10（九十四）　後台範本：灰底分頁、圖表下拉篩選與排序按鈕

- 後台範本的 Tab 從底線（line）改為灰底（soft）。
- Chart 新增 `dropdown` 選項（預設不變）：指標／分組切換改用 Dropdown、排行的排序改用一顆排序按鈕（Button＋升／降冪圖示，點擊切換由高到低／由低到高），放在原本分段按鈕的位置。後台統計報表的熱銷商品、結帳漏斗改用此樣式。
- 結帳漏斗、熱銷排行在後台改細柱（10px）。
- 後台使用者頭像（側欄、頂欄）改為文字縮寫，不用照片。
- 網站版本紀錄加 v21；英文同步。

## 2026-11-10（九十三）　後台範本重新排版：小元件組卡、列表篩選列、詳情頁重做

- **參考稿對照**：重看「預約管理」列表與「預約詳情」頁，照它的資訊架構重排；不再整張套用組好的牌卡（Metric、Widget 等），改用文字、Tag、Button、Dropdown、Table、Descriptions 結構依內容排版。
- **字級統一四級**：頁標 `--fs-h6`、卡片標題 `--fs-h9`、內文與表格內容 `--fs-h10`、標籤／說明／表頭 `--fs-h11`；KPI 數字 `--fs-h6`（窄版 `--fs-h7`）。商品明細表格、合計與內文同級，不再大小落差。
- **儀表板**：KPI 收成一張卡分四欄＋分隔線，趨勢改用 Tag（綠／紅）與數字同一行對齊；待處理訂單改用 Dropdown 篩選（取代 Segmented）、整列可點進詳情；「查看全部訂單」改成卡片底部的小尺寸文字按鈕；近 7 日營收單獨一張卡、改細柱並加圖例。
- **統計報表**：期間改成「‹ 2026 年 ›」年份切換＋下載 CSV（參考稿做法，取代 tab 式切換）；圖表改細柱。
- **訂單列表**：參考稿的篩選列（搜尋、狀態、負責人、排序，欄位上方小標）→ 已篩選條件（Tag chip＋清除篩選）→ 表格 → 每頁筆數＋分頁（Pagination）。拿掉寬鬆／緊湊切換；每一欄表頭都有升降冪箭頭。
- **訂單詳情**：頁首（麵包屑、返回、標題、編號與建立時間、列印出貨單）→ 狀態摘要（訂單狀態 Dropdown、付款狀態、預計送達、安排出貨）→ 訂單資訊（收件資訊／訂單內容兩欄，中間分隔線，標籤：值）＋最後編輯 → 商品明細（單價、數量、小計＋合計區）→ 處理進度。Tag 不再被拉伸跑版。
- **框架**：側欄寬 240、分組間距與項目間距加大（Menu 改 m 尺寸）；主要按鈕全部改 s 尺寸。
- **元件改善**（會影響所有用到的地方，行為向下相容）：
  - Table：任一欄都能排序（數字比大小、文字依中文排序）；可帶入目前排序、或交由外部排序（`o.onSort`，分頁表格排整份資料）；排序鈕補 aria-label。
  - Chart bar／bar-stack：新增 `thin` 選項（細柱），預設外觀不變。
- **手機版**：頁面左右內距 16 → 20px、卡片內距統一 20px、區塊間距加大；商品明細在窄版隱藏單價欄，表格不再被切掉；訂單資訊兩欄改單欄時段落間距加大。
- 英文：新文案與動態文字（年份、分頁、排序說明、篩選 chip、狀態提示）以規則翻譯；網站版本紀錄加 v20。
- 驗證：五頁中英文、深淺色、電腦／平板／手機；列表搜尋＋篩選＋排序（升降）＋清除＋分頁、整列進詳情、建立流程、抽屜、情境切換自動測試通過，無 JS 錯誤、無溢出；英文模式殘留中文 0。

## 2026-11-10（九十二）　Template 範本：後台五頁

- **新增後台範本五頁**（`TPL:v2`）：Admin Dashboard 儀表板、Admin Report 統計報表、Admin List 資料列表、Admin Detail 詳情頁、Admin Form 建立表單。參考先前專案的後台流程稿（儀表板／統計資料／預約管理／詳情／建單），改成通用的電商訂單假資料。
- **共用框架** `tadApp(page, device, scenario)`：電腦版側欄 232px 常駐（Logo＋Menu 分組＋使用者）、內容欄最寬 960px；平板 768 與手機 375 改成頂欄＋抽屜。五頁是同一個框架的不同起始頁，側欄、表格列、訂單編號、麵包屑、按鈕都會真的切換頁面。
- **各頁內容**（全部取用既有元件，沒有新增元件）：
  - 儀表板：Tab（營運摘要／統計報表）、KPI 用 Number 的 `prMetricEl`、待處理訂單用 Table＋Segmented 篩選、近 7 日營收用 Chart bar、Link「查看全部訂單」。
  - 統計報表：Segmented 期間、下載 CSV（Button＋Notification）、Chart area-stack／bar-stack／bar-rank／funnel。
  - 資料列表：直接用 Table Toolbar（搜尋、篩選、已存檢視、批次操作、列高）；訂單編號改成 Link 開詳情。
  - 詳情頁：Breadcrumb、Tag 狀態、Descriptions 訂單資訊、Table 商品明細（含總計）、Avatar 客戶、Step timeline 處理進度。
  - 建立表單：Field、Dropdown、Quantity、Date Picker、Segmented、Textarea；必填檢查換成 Field error 狀態 → Modal popup 確認 → Notification 完成提示 → 前往詳情。
- **情境**：每頁都有正常、載入中（Skeleton）、空資料（Empty，引導下一步）、錯誤（Alert＋Empty，可重試）。
- **registry**：新增 5 筆 `kind: template`＋`composedOf`；`build-registry.js` 支援 `Object.assign(TPL_COMPOSE, …)` 追加的範本。
- 英文：新頁全部文案、aria-label、提示訊息；順手補上 Chart bar-rank 第 7、8 名與兩張圖表的 aria-label（原本 Chart 頁也沒翻）。網站版本紀錄加 v19。
- 驗證：五頁中英文、深淺色、電腦／平板／手機截圖；流程自動測試（列表 → 詳情 → 編輯 → 必填錯誤 → 確認 → 建立 → 抽屜導覽 → 情境切換與重試）通過、無 JS 錯誤、無水平溢出；英文模式殘留中文 0。

## 2026-11-10（九十一）　首頁新增點陣世界地圖段落

- **用戶回饋下方新增「From Taipei to every timezone」**（`HOME-MAP:v1`，`#hxMap`）：canvas 畫陸地點陣，依序高亮 Taipei → Tokyo → Seoul → Hong Kong → New York → London（每站約 3.6 秒），鏡頭平移把城市帶進畫面；隨機點會輕輕閃爍（三成重點色）。只放視覺，不放統計數字。
- 互動概念參考 Aceternity Inference Landing Page 的 Global network 段落；顏色全走 token（點＝`--ink` 加透明度、重點＝`--c-info-600`／深色 `--c-info-400`），深淺色切換會重畫。
- 地圖資料：Natural Earth 50m 陸地（公有領域）以 Miller 投影、每格 2° 轉成 180×82 位元圖，base64 內嵌約 2.4KB，不外連任何資源。
- **地標**：正方形（目前城市＝實心方塊＋向外擴散的方框，其他城市＝淡色小方塊）；城市名改首字大寫、字距歸零。滑鼠移到地標上顯示城市名（地標加深放大），點擊直接跳到該城市，之後從它的下一站接續輪播（地標是真的按鈕，鍵盤 Tab 也能操作）。
- 只有段落在畫面內才動畫（離開或分頁隱藏即停）；手機地圖置中、點距縮小；系統「減少動態」時停在 Taipei 不動。協作游標在此段顯示「worldwide」。

## 2026-11-10（九十）　首頁標語換字加上「方向感知選取」

- **Hero 標語尾字（recolors／rounds…）滑鼠移上去**：出現 Figma 式選取框（沿用元件牆 hover 的 `.hx-sel` 細框＋四角方點），從滑鼠進來的那一側滑入；底色用當下字色的淡色、從同一側填進來；框下方有尺寸標籤即時顯示寬×高。離開時往滑出的那一側收掉。互動概念參考 Aceternity「Direction Aware Selection」，樣式全部用站內 token。
- 滑鼠停在字上時換字會暫停（正在刪的字會倒回打完），移開後照常輪播；框跟著字寬即時伸縮。
- 只在有滑鼠的裝置啟用，手機／平板觸控不顯示；系統「減少動態」時直接出現不滑動。
- 進出判斷改用座標而非 pointerenter／leave：打字時文字節點一直被替換，瀏覽器會誤判「離開又進來」造成閃爍。

## 2026-11-10（八十九）　思考中改點陣環繞、＋按鈕灰底

- **思考中動畫**：參考 transitions.dev Matrix dot loader 的第三種「orbit」，以本站 token 自行實作：4×4 點陣去掉四角，外圈 8 點順時針輪流亮起（每點間隔 150ms、一圈 1.2s），中間 4 點維持半亮；取代原本四種節奏輪替。用在思考、推理摘要進行中。
- **輸入列＋按鈕**：改為 Button `soft × secondary`（灰底）。
- 網站版本紀錄 v16 補一筆；英文同步。

## 2026-11-10（八十八）　AI Chat 調整：頭像用專案 logo、輸入列＋選單、對話動態

- **AI 頭像**：不重新設計，直接用**專案 logo**，放在圓框裡（`activeLogo()`，與 Header／Footer 同源；沒上傳就是 cdl 字標），換專案 logo 自動跟著換。內容與動態都裁在圓框內（`overflow:hidden`）。思考中＝一道光掃過、回覆中＝logo 輕輕呼吸。原本偏移、看起來超出框的原因是全站給按鈕用的 `.sz-s/m/l`（含 `padding:0 var(--sp-5)`）套到了頭像，改用專屬的 `as-s/m/l`。
- **輸入列**：網頁搜尋不再放在外層；「＋」改成選單（取用 Action Menu 的 `am-panel`／`amItem`）：上傳檔案、加入照片｜網頁搜尋、深度思考、深度研究、建立圖片（工具為開關，勾選有打勾）。開啟的工具與附件出現在輸入框上方，可移除。上方放不下時往下開、展開原點跟著換；鍵盤 ↑↓／Enter／Esc。圓角 `--r-xl → --r-lg`、內距 `--sp-3 → --sp-4`（精簡版 `--sp-2 → --sp-3`）。`tools` boolean 改為「已開啟工具」。
- **來源／附件 chip 可點**：原本用 Tag 預設 s（22px、字 10px、圖示 12px），尺寸符合 Tag 規格，但當可點元素太小；改用 Tag **m（26px、字 12px、圖示 14px）**並補 hover／focus／按下。來源是開新分頁的連結；附件是按鈕，輸入列裡的可移除。回饋原因也改成按鈕。
- **動態**（參考 transitions.dev 的動態類型，用本站 token 自行實作，未複製其程式碼）：16 點矩陣 loader（四種節奏輪替）、狀態文字微光並模糊換句（思考中 → 理解你的問題 → 整理回覆重點）、推理串流兩行往上捲、串流文字尾端六級由模糊漸清（取代游標）、送出／停止與複製圖示的縮放模糊切換、複製成功勾（旋轉＋彈性）、讚彈一下、歡迎畫面錯開上升、錯誤模糊縮放浮現。皆遵守「減少動態」。
- 修正：使用者訊息「沒有送出」的警示圖示沒有限制尺寸。
- 英文：新增文案與改寫過的句子同步更新；網站版本紀錄加 v16。

## 2026-11-10（八十七）　AI Chat 對話元件系列＋Template 範本「AI 對話」

- **盤點**：參考 ChatGPT／Claude／Gemini 共通的介面，整理出對話中常見的狀態（歡迎、送出中、思考、搜尋、推理摘要、串流、停止、錯誤）、元件與互動（Enter 送出／Shift＋Enter 換行、生成中送出鍵變停止鍵、複製／讚／倒讚／重新產生／分享、倒讚回饋原因、捲到最新、手機抽屜），拆成 6 顆元件，不照抄任何單一產品。
- **新增 AI Chat 對話分類**（`AIC:v1`，皆有 DIAL_SPECS 軸、變數篩選器、互動預覽與程式碼）：
  - **AI Avatar 頭像**：state（待命／思考中／回覆中）× size（24／32／48）＝ 9。由 cdl logo 延伸：c 弧線＋品牌橘點 `--accent2`，底色 `--ink` 深淺色自動翻轉；思考中弧線旋轉、橘點呼吸，回覆中橘點閃爍。
  - **Chat Message 訊息**：role（使用者／AI）× state（完成／進行中／中斷）＝ 6；boolean：avatar／actions／sources／files。使用者用泡泡、AI 用頭像＋純文字；串流有游標；倒讚跳出回饋 Popover。
  - **Chat Thinking 思考狀態**：kind（思考／搜尋／推理摘要）× state（進行中／完成）＝ 6；文字微光、可展開的「已思考 12 秒」。
  - **Chat Composer 輸入列**：layout（標準／精簡）× state（空白／輸入中／生成中／停用）＝ 8；boolean：attach／tools／model／voice／files。輸入框隨內容長高，生成中送出鍵變停止鍵。
  - **Prompt Suggestion 建議問題**：variant（膠囊／卡片）＝ 2；boolean：icon。
  - **Chat Error 對話錯誤**：kind（網路中斷／伺服器錯誤／用量上限／登入過期／內容規範）＝ 5。
  - 內部一律取用既有原子（鐵則 5）：Button、Tag、Popover、Alert、Avatar、Loader、Segmented；沒有新增其他原子。動態只在程式碼，Figma 以靜態 variant 表示。
- **新增 Template 範本分類**（`TPL:v1`）與第一個範本 **AI 對話**：電腦版（1080，左側對話紀錄）與手機版（375，紀錄收進抽屜、輸入列精簡版）；情境：歡迎／對話中／思考中／串流中／錯誤。可直接打字送出，跑完整流程：思考 → 逐字串流 → 停止 → 重新產生 → 讚／倒讚回饋；開「搜尋」會先顯示搜尋狀態；歷史紀錄切換、新對話、捲到最新、Esc 關抽屜。假資料為通用情境（台南週末美食行程）。頁尾列出組成元件並可點去元件頁。
- **registry**：新增 7 筆（範本標 `kind: template`＋`composedOf`）；`build-registry.js` 改為保留舊 registry 手動補的欄位（如 icon 的 `tokens`／`codeOnlyProps`），並順帶修正 Icon（16→32）、Tab（24→32）過期的組合數。
- 英文：新頁全部文案、aria-label／placeholder、串流回覆內容（英文模式先整段翻好再逐字顯示）；側欄名稱改為「AI Avatar 頭像」「AI Chat 對話」以免英文抽取多帶一個 AI。網站版本紀錄加 v15。
- 驗證：7 頁中英文、深淺色、電腦／手機截圖；範本流程（思考→串流→停止→重新產生→倒讚回饋→手機抽屜）自動測試通過、無 JS 錯誤；英文模式殘留中文 0。

## 2026-11-10（八十六）　英文模式：程式碼區按鈕、樣式包匯出、色票表

- **程式碼區不再整區跳過翻譯**：`I18N_SKIP` 原本把 `.live-code`、`.tokexp` 整塊排除，連標題與按鈕都沒翻（元件頁 HTML／SCSS 面板的「複製」、Token 頁匯出區的「樣式包檔案／複製此檔／下載此檔／全部下載」）。改為只跳過程式碼本體（`.code-pre`、`.code-gutter`），程式碼內容維持原樣。
- **Design Guideline 色票表**：英文對照原本只寫了深色模式的完整字串（如「主要文字 · #F4F4F5」），淺色模式色碼不同就對不上；改成只翻名稱（主要文字／次要文字／更淡文字／品牌色），色碼不論深淺都照原樣保留。
- 驗證：英文模式掃 92 頁，程式碼以外只剩刻意保留的「果思設計」字型範例與語言選單「繁體中文」；展開程式碼視窗、淺色模式色票表皆已確認。

## 2026-11-08（八十五）　iPhone 聚焦輸入框不再自動放大

- iPhone／iPad 的 Safari 遇到字級小於 16px 的輸入框（搜尋彈窗等），聚焦時會自動放大畫面、右側內容被切掉。只對 iOS 在 viewport 加上 `maximum-scale=1`：iOS 10 起只擋自動放大、使用者仍可雙指縮放；Android 不加（會擋掉縮放，且本來就不會自動放大）。不改輸入框字級，元件預覽維持 token 原值。

## 2026-11-08（八十四）　原生 checkbox 直接換成 Checkbox 元件

- **改用元件本身**（`CBX-IN:v1`，鐵則 5）：上一版只把原生 checkbox 的勾「畫得像」元件，外觀仍有差、也沒有元件的動態。現在網站上所有 `<input type=checkbox>`（互動預覽 content、變數篩選器、選擇元件頁、開新專案流程等 18 處）都會自動在旁邊放一顆 `cbxEl()` 產生的 `.cbx` 原子，原生 input 改成透明蓋在上面，點擊、鍵盤、讀屏、表單值仍由原生 input 負責；程式直接改 `checked`（如全選）也會同步。外觀、勾選動態、滑過重畫全部沿用 Checkbox 元件。
- **勾選動態統一為「一筆畫出」**：Checkbox 元件勾選時，勾勾以 PulsoIcon check 的 draw 方式一筆畫出（0.55s），取代原本的由左往右揭開；Selector 頁 `.optrow` 裡的元件也套用（先前只有互動預覽區有動畫）。
- **恢復滑過重畫**：上一版把 checkbox／下拉多選／步驟節點裡的 PulsoIcon 滑過動態關掉了，這版恢復。

## 2026-11-08（八十三）　「需求匯總」改名「選擇元件」、原生 checkbox 對齊 Checkbox 元件

- **改名**：「需求匯總」頁與流程改叫「**選擇元件**」（英文 **Select Comps**）：側欄、頁面眉標與標題、搜尋彈窗（舊名保留為搜尋關鍵字）、Design Guideline 說明、上手指南卡片（標籤 SUMMARY → SELECT）與步驟、首頁輪播與上手指南的模擬畫面、開新專案流程的步驟／套用提示／空狀態、規劃中元件說明；重複的句子順便潤飾（「在選擇元件頁勾要的元件」）。網址 `#summary`、程式內部名稱、註解與歷史版本紀錄不動。`HANDOFF.md`、`REGISTRY-NOTES.md` 同步。
- **原生 checkbox 對齊 Checkbox 元件**：互動預覽的 content 勾選、變數篩選器等原生 `input[type=checkbox]` 的勾原本還是舊的 Phosphor 粗勾、半選是 Phosphor minus；改用與 `.cbx` 相同的 PulsoIcon check／minus（線寬 2.5）。checkbox、下拉多選勾、步驟節點裡的勾不再疊播 PulsoIcon 的滑過動態，統一只用勾選時的「由左往右揭開」。
- 英文：補上改名後的文案，以及 Token 頁匯出視窗的「樣式包檔案／複製此檔／下載此檔／全部下載」、開新專案流程的套用狀態提示（先前漏翻）。

## 2026-11-08（八十二）　checkbox 勾變細、Icon 頁線寬調整、Avatar 人物照片

- **修正 checkbox 打勾太粗**：`.cbx`／`.ddcheck`／步驟完成勾原本加 `stroke-width:8`，那是 Phosphor 256 格的單位，換成 PulsoIcon（24 格）後粗了約十倍；改成 `calc(var(--icon-stroke) + .5)`，跟著線寬 token 走、略粗一點（＝原 Phosphor bold 粗細）。
- **Icon 頁線寬調整**：互動預覽、Icon Library、搜尋完整圖示庫都加上「線寬」切換（1／1.5／2／2.5／3，Segmented 原子），只在該區覆寫 `--icon-stroke` 預覽，不改全站 token（全站值在 Token 頁「Icon 圖示」）。
- **Avatar photo 型改人物照片**：原本是插畫風 SVG 人像，改用卡片類元件共用的內嵌人物照（`CARD_AV`，96×96，離線可顯示），依名字挑照片（同名同一人）。`CARD_AV` 定義移到 `avtEl` 前。
- 英文對照補上新文案。

## 2026-11-08（八十一）　Icon 換成 PulsoIcon、搜尋完整圖示庫、搜尋彈窗英文補齊

- **全站 icon 從 Phosphor 換成 PulsoIcon**（`PULSO:BEGIN…END`＋`PULSO-RT:v1`）：網站內 125 種 Phosphor 圖示（含各元件內部用到的）依對照表全部換成 PulsoIcon 對應的 113 種＋裝置預覽工具列 9 種；寫法從寫死的 SVG 字串改成 `PI('key')`／`PI('key',{solid:1})`。用到的圖示資料與播放器（pulsoicon-core 6.1.0＋motion 12.43.0）由新腳本 `sync/build-pulso-icons.mjs` 打包內嵌，離線也能顯示與播放。實心版的遮罩 id 會在插入時自動去重。
- **動態**：icon 在所在的按鈕、連結、分頁、選單項被滑過或聚焦時播放專屬動態（PulsoIcon 的觸發規則；第一次碰到才綁定），系統開「減少動態」時不動。
- **Icon 元件**：新增 `style` 軸（`outline 線框／solid 實心`，對應 L0 line／solid），矩陣變成 `style × size × tone` = 2 × 4 × 4 = 32；新增線寬 token `--icon-stroke`（預設 2，Token 頁「Icon 圖示」群組可調，全站 icon 線寬吃它）；`animated` 登錄為 registry `codeOnlyProps`，Figma 不建屬性（使用者同意的鐵則 3 例外）。Icon Library 可切線框／實心；`icons.catalog.json` 改出 PulsoIcon（含 `solidSvg`），`ds-studio-flow` 的 Icon 圖庫寫入步驟同步更新（stroke／線寬綁 Variable、每顆 Style variant）。
- **搜尋完整圖示庫**（`ICX:v1`）：Icon 頁新增搜尋 PulsoIcon 全庫 9,955 顆（名稱＋其他 icon 庫的別名），結果可切線框／實心、滑過會動；標示「網站已有」「已加入專案」。專案模式按「加入專案」→ `studio-server` 新端點 `POST /api/project/<name>/icons` 寫進 `projects/<name>/icons.json`（含 PulsoIcon 資料，可切實心、會動）；連不到 server 改下載 `icons.add.json`；母元件庫只能預覽、複製 SVG。資料從 jsDelivr 載入（鎖同版本），需要連網。「本專案 Icon」區同時顯示 Figma 同步與圖示庫加入的 icon。
- **授權**：新增 `library/THIRD_PARTY_NOTICES.md`（PulsoIcon LICENSE 全文，含 Lucide／Tabler／Iconoir／Hugeicons／Phosphor 聲明＋motion MIT），由腳本產生；Icon 頁規格列加連結。
- **搜尋彈窗英文**：補上「最近搜尋」「清除紀錄」「頁面」「規劃中」；Icon 頁與搜尋完整圖示庫的新文案全部有英文。
- `studio-server` 擋掉 `../` 形式的專案名稱，避免寫到 `projects/` 以外。

## 2026-11-08（八十）　Tab 新增灰底 variant、容器／灰底果凍切換

- **新增 variant `soft`（灰底）**：與 contained 同為獨立藥丸＋間距，未選中為 `--panel-2` 灰底、無框線，滑過 `--panel-3`，選中與其他 variant 一致（`--accent`／`--primary-on`）。Tab 軸變為 `variant(line／contained／soft／pill) × state × size` = 4 × 4 × 2；`component-registry.json` 同步新增 soft。寫入 Figma 時對應 Variant property 新增一個值（鐵則 3），尚未同步到 Figma。
- **果凍切換**（`TAB-JELLY:v1`，參考 React Bits「Jelly Radio」）：互動預覽中 contained／soft 點選時，選中那顆微微膨脹（約 1.05）、其餘略縮並往兩側推開 3px，停 100ms 後以柔和的彈簧回彈到 1 倍原樣，約 0.35 秒結束、幾乎不晃（依使用者回饋從參考元件的 1.2 倍大幅收斂；scaleY 晚 50ms、越遠的晚 30ms 起動）。純 JS 彈簧積分，不引入動畫套件；鍵盤切換與「減少動態」時不播；按壓疊加 `scale:.97`。矩陣靜態格不受影響。
- 英文對照補上新文案。

## 2026-11-08（七十九）　搜尋彈窗英文、版本紀錄標籤爆版

- **搜尋彈窗**（⌘K）EN 模式補齊：placeholder、「常用」、底部提示、找不到結果訊息；結果名稱在 EN 只顯示英文（「Button Group 按鈕組」→ Button Group），中文關鍵字高亮不再把名稱切成碎片。
- **修正 `I18N_RX` 規則從未生效**：規則存成字串，`replace` 時被當成字面字串比對，所有帶數字／變數的句型（步驟 n / m、n 項、找不到「…」等）都沒換成英文；改為 `new RegExp(rx)`。
- **版本紀錄**：EN 模式標籤（Improved／Fixed／Add）比中文寬、壓到內文，標籤欄在 EN 改為 76px。

## 2026-11-08（七十八）　全站英文版

- **範圍擴大到全站**（標記 `I18N:v2`）：中英切換原本只涵蓋外框、首頁與開新專案流程，現在 85 頁全部支援 EN——所有元件頁、Design Token、Design Guideline、Summary、Guide、Changelog、Settings，包含收合面板內的文字與示範用假資料（人名用威妥瑪拼音，跟第一階段一致）。對照表新增約 2,260 條（`Object.assign(I18N_EN,…)`）。
- **通用規則**：「實心·solid」這類中英並列標籤只留英文；「圓角 radius」→ Radius；「預設 --r-sm」→ Default --r-sm。
- **拼接修正**：EN 模式下全形標點自動轉半形（，。（）＋／「」→ , . ( ) + / “ ”），翻譯片段與相鄰 `<b>`／`<code>`／`<a>` 之間自動補空格，避免英文黏在一起。
- **程式碼區內的按鈕**（如「展開檢視」）的 `title`／`aria-label` 現在也會翻；程式碼內容本身仍不動。
- 刻意保留中文：Settings 語言選單的「繁體中文」、Token 頁字型範例「果思設計」（展示中文字形）。
- 驗證：Playwright 掃 85 頁（含隱藏元素）EN 模式殘留中文 2 條（即上述刻意保留）；切回中文完整還原；無 console 錯誤；手機 390px 無新增溢出。

## 2026-11-06（七十七）　手機／平板箭頭分開、icon 重畫、膠囊細線

- **手機（≤767，含 iPad mini 預覽）箭頭**改為指定路徑：網站→程式碼沿左側空隙往下、網站→Variables 從網站卡右側繞進 Variables 右側、程式碼→元件 L 形轉入；Variables 卡改 `left:13%／width:74%` 讓右側留走線空間，控制點不超出舞台。
- **平板（768–1180）**拉開卡片間距（網站 37%、Variables 從 51% 起、元件從 61% 起），箭頭不再短到看不見。
- **亮點 icon** hover 改為線條從頭重新描繪（`hxSyRedraw`，依序延遲），拿掉原本的縮放／旋轉／位移；減少動態時不播。
- **同步膠囊**亮起不再加粗主色外框，只把邊框換成淡淡的主色細線。

## 2026-11-06（七十六）　三方同步箭頭分開、尖端變色、游標黑白

- **箭頭路徑**（`HOME19:v1`，照使用者手繪）：桌機改為指定出發／到達點——網站→程式碼從網站卡底部左側出發、L 形往下彎進程式碼卡左側；網站→Variables 從網站卡右側偏下出發、往上拱進 Variables 左側；程式碼→元件維持往上拱。手機沿用依相對位置自動計算。
- **箭頭尖端**改為每條線各自的 marker，同步時與線一起換成主色。
- **示範游標**改吃 `--ink`：淺色模式黑、深色模式白，標籤底色同色、文字 `--panel`。

## 2026-11-06（七十五）　修正動態展示被波及、亮點精簡與手機輪播

- **修正**：三方同步拼貼用的 class 前綴 `hx-sc-` 與首頁「動態展示」卡片（`.hx-sc`、`.hx-sc-stage`…）撞名，拼貼樣式（格線底、`height:560px`、`overflow:hidden`）套到動態展示每張卡，造成卡片被裁、排版留白。拼貼全部改用 `hx-tw-` 前綴（CSS、JS、`--hx-tw-pc`／`--hx-tw-pad`、keyframes），動態展示恢復與正式站一致。
- **亮點**四則說明精簡成一句；**手機**改為水平輪播（scroll-snap 滑動、Button 原子左右箭頭、頁碼 n / 4，到頭尾箭頭停用）（`HOME18:v1`）。
- 拿掉段落右上「看全部 Design Token」按鈕。
- **同步膠囊**改跟隨淺／深色（`--panel` 底＋`--line-strong` 框，淺色模式白底）、主色圓點縮為 8px；「⇄」改為分開的「← →」。
- 英文對照補上新文案。

## 2026-11-06（七十四）　三方同步拼貼：平放＋拋物線箭頭

- **拼貼改平放**（`HOME17:v1`，參考 Razorpay）：四張卡不再旋轉、不漂浮，直角交疊排列；卡片間加 3 條細虛線拋物線箭頭（網站→程式碼、網站→Variables、程式碼→Button 元件），資料同步時箭頭換主色、虛線流動，一顆小點沿線移動（SVG `animateMotion`）；箭頭依卡片實際位置計算，視窗縮放時重算。
- **網站卡**標題改用 cdl logo（網址保留在右側）；**間距**改為與主色一樣的輸入欄位、逐字打字切換（`--sp-4`→`--sp-5`→`--sp-6` 實際 px）；**顯示 icon** 改用 Checkbox 原子（Figma 元件卡的 Icon boolean 也改 Checkbox）。
- **Variables 卡**改回前一版 Figma 面板樣式：左側 Collections（Semantic 選中）＋右側 Name／Value 表格（action/primary、spacing/inset、feedback/success、radius/sm）。
- **程式碼卡**語法色比照 `.live-code`：淺色模式白底、深色模式深底。
- **手機**維持交疊拼貼（不改直向堆疊）：卡片縮窄、左右錯位往下疊，Variables 收起 Collections 欄；直向箭頭改往右拱、箭頭朝下進入目標。
- 補充：元件庫 Toggle 只有一種尺寸（44×24），沒有 size 軸。

## 2026-11-06（七十三）　段標題、三方同步拼貼動畫

- **流程教學**加段標題「Start editing on this site」（與 Code ⇄ Figma 同字級），副標改為一般字重，移除「看 skill 路徑」按鈕；目錄改由段標題自動帶出。
- **Code ⇄ Figma**：段標題改為「Start from Claude, Code & Figma auto-sync」，副標改寫為下載 Skill 用 Claude 從訪談跑的說明；移除路徑 A／B 對比卡。
- **三方同步動畫**改為拼貼式（`HOME16:v1`，參考 Razorpay）：格線底＋依主色變化的下方光帶，四張微傾斜、緩慢漂浮的卡片——專案網站（網址 `productname.vercel.app`，Design Token：主色色碼、間距 Slider、Button 狀態 Checkbox、顯示 icon Switch）、程式碼（tokens／components export）、Figma Local variables（color／spacing）、Figma Button 元件（Button 原子預覽＋State variant／Icon boolean／Size）。游標依序：輸入色碼 → 拖間距 → 勾 hover → 開 icon，對應列與卡片亮框，黑色提示膠囊顯示對應的 Figma 概念（Variables／Variant property／Boolean property）。手機改為直向堆疊。
- 英文對照表補上新文案。

## 2026-11-06（七十二）　中英切換、三方同步說明、Figma logo

- **中英切換**（標記 `I18N:v1`）：頂部列深淺色切換右邊新增 Segmented 原子（中／EN），預設中文、選擇存在 `localStorage['cdl-lang']`。做法是「對照表替換」：切到 EN 時把文字節點與 `aria-label`／`placeholder`／`title` 查 `I18N_EN`（約 480 條）與 `I18N_RX`（數字、日期、上傳進度等規則）換成英文，原文另存、切回中文還原；`MutationObserver` 追動畫與換頁的新文字。查不到的維持中文；側欄「Button 按鈕」這類英中並列的名稱，在 EN 時只留英文。第一階段範圍：外框、首頁全部段落、開新專案流程。人名轉拼音。
- **流程教學**加「從網站開始，不用寫程式」引言＋「看 skill 路徑」連結；**Step 04** 改為「輸出檔案，交給 Claude 接上 Figma」，動畫改為輸出 `tokens.export.json`／`components.export.json` → 交給 Claude → 已寫入 Figma（`HOME15:v1`）。
- **Code ⇄ Figma 三方同步**：說明改為路徑 A／B 兩張卡（步驟用 Tag 原子）＋會合說明；中央 ⇄ 換成專案 library 網址的小瀏覽器，網站／Figma／程式碼輪流當起點；亮點新增 Library Edit（2×2，≥1441px 四欄），Drift Check 改為三邊。
- **Figma logo**：新增 `ICON_FIGMA`（官方五色，屬品牌資產不綁 token），用在 Local variables 面板標題、「已寫入 Figma」標籤。
- 手機（≤480px）頂部列「開啟新專案」只留＋圖示，文字保留給讀屏。

## 2026-11-06（七十一）　首頁步驟示意、Code ⇄ Figma 說明、本頁目錄、手機元件頁間距

- **Step 04 進度條**：`prgEl('label','m')` → `'s'`，與 Step 01 Dropzone 內的細版一致。
- **Step 02 挑風格和主色**示意改版（標記 `HOME14:v1`）：Segmented 選起始風格（俐落／柔和／活潑 → 圓角 `--r-xs`／`--r-md`／`--r-pill`，活潑主色換 brand2）→ Design Token 主色欄位逐字輸入色碼（`--c-info-600`）→ Slider 原子以鍵盤步進拖曳圓角 token（xs～pill 尺標）→ 下方淺色／深色兩個預覽（Button 原子）同時換色換形。兩個預覽以區域變數覆寫 `--panel`／`--ink`／`--i-primary` 等，全部綁 L1 token。
- **Code ⇄ Figma**：標題下新增說明段，說明下載 `ds-studio-flow` skill 交給 Claude 的七步流程與優點，下方七步用 Tag 原子（outline／neutral／m）；三個亮點說明改寫得更完整。
- **本頁目錄**：`buildTOC` 新增讀取 `[data-toc]`，首頁補上試玩區、元件跑馬燈、關於 CDL、動態 Demo、流程教學、用戶回饋。
- **手機版元件內頁**（≤767px、有 bento 操作區的頁）：眉標上方加 `--sp-6`、說明到操作區 `--sp-6` → `--sp-8`。
- 網站版本紀錄新增 v14。

## 2026-11-05（七十）　版本紀錄頁只顯示最新三筆

- **原因**：v11 的一則內文寫了「動態 `<style>`」，版本紀錄是用 innerHTML 組出來的，未跳脫的 `<style>` 被瀏覽器當成真的樣式標籤，後面 v10 以前的內容全被吞掉，只剩 v13／v12／v11 前半。
- **修正**：該段與「Code <-> Figma」改寫成 `&lt;…&gt;` 實體；其餘內文已檢查沒有其他未跳脫的角括號。

## 2026-11-05（六十九）　Dropdown 多選勾選框改用 Checkbox 原子

- Dropdown 多選選單原本用手刻的 `.ddcheck`（勾勾顏色沒設，繼承文字色；深色模式下主色是淺灰 `--c-brand-200`，勾勾也是淺灰，看起來像灰底灰勾）。改為取用 Checkbox 原子 `cbxEl('default','s')`，勾選時切 `st-checked`，樣式與 Checkbox 元件完全一致（鐵則 5）。網站版本紀錄新增 v13。

## 2026-11-05（六十八）　Image／Carousel 換照片

- **Image 圖片**：圖片池（`IM_POOL`／`IM_CIRCLE`）改對應網站內嵌照片（辦公室、天空、人像），新增 `imEmbed()`；`imUrl()` 先找內嵌照片、找不到才用 Unsplash。預覽環境（會擋遠端圖）也看得到圖，全站用到圖片池的地方一起換。
- **Carousel 輪播**：五張投影片原本只有色塊漸層，改成內嵌照片底（`crsPhoto()`）＋下方加深遮罩（`--c-neutral-900` 混透明），文字維持可讀。

## 2026-11-05（六十七）　新牌卡圓角與間距

- **趨勢卡**互動預覽預設底色改墨黑（ink）。
- **圓角**：趨勢卡、照片標籤卡、天氣卡、播放器卡外框 `--radius` → `--r-lg`（10px，Token 綁定預設同步）；登機證卡維持 `--radius`。
- **播放器卡間距收緊**：內距 `--sp-6` → `--sp-5`；標題列、進度條上距 `--sp-5` → `--sp-4`；播放控制列上下 `--sp-5／--sp-6` → `--sp-4`、按鈕間距 `--sp-6` → `--sp-5`；按讚列上距與間距 `--sp-4` → `--sp-3`。

## 2026-11-05（六十六）　牌卡整理

- **新 5 張牌卡圓角**對齊其他牌卡：外框 `--r-xl`／`--r-2xl` → `--radius`（Token 綁定預設 `--r-sm`），趨勢卡配圖與播放器封面改 `--r-xs`。
- **趨勢卡編號**改正體、實心淡字（`--trd-fg` 40%），拿掉傾斜與描邊。
- **照片標籤卡**互動預覽預設不選取。
- **移除** Card 卡片、Product Card 商品卡、Category Tile 分類磚：側欄、DIAL_SPECS（需求匯總）、AI 建議清單、開新專案產業對照表（教育／其他改推 Article Card）、registry（total 78／ready 72／withAxes 70）一併拿掉；Rating 頁說明不再連到商品卡。
- **文章卡**三張示意圖改用網站內嵌照片（辦公室、人像、天空）；原本是 Unsplash 遠端圖，預覽環境會被擋。`imUrl()` 遇到 data／http 網址直接回傳。

## 2026-11-05（六十五）　Card 新增 5 種單張牌卡

- **Card 卡片**群組新增 5 張「單張」牌卡（NAV、DIAL_SPECS、BUILD、搜尋關鍵字、Token 綁定槽、registry 同步；標記 `CARDS5:v1`）：
  - `trend-card` 趨勢卡：tone 5（墨黑／紫／白／萊姆／綠，綁 `--c-brand-800`／`--c-violet-400`／`--c-neutral-0`／`warning-300 × success-300` 混色／`--c-success-400`）；boolean `index`、`media`。
  - `media-card` 照片標籤卡：ratio 3（4:5／1:1／4:3）；boolean `label`、`selected`（`--accent2` 虛線外框）、`tilt`（預設關）。照片沿用已內嵌的 CARD_PHOTO／PSC_ROT／CARD_COVER。
  - `weather-card` 天氣卡：cond 4（晴／多雲／雨／雷雨，各綁 info／violet 色階漸層）；boolean `forecast`。五日列取用 Segmented 原子（`sgmEl`）＋磨砂情境樣式，溫度用 `chtxRoll`。
  - `player-card` 音樂播放卡：state 2（暫停／播放中）；boolean `likes`。進度取用 Slider 原子（播放中以原子自身鍵盤步進每秒 +1，可拖曳）、控制鈕取用 Button（icon-only）、按讚列取用 Avatar＋`.avt-grp`、分隔線取用 Divider；封面為 token 漸層。
  - `ticket-card` 登機證：status 4（準時／登機中／延誤／取消 → Tag success／info／warning／danger）；boolean `passenger`。兩側半圓缺口用 CSS mask（上下兩段各挖四分之一圓），撕線為 Divider dashed。
- 網站版本紀錄新增 v12。

## 2026-11-05（六十四）　版本紀錄整理

- 網站版本紀錄 v11 重新排序（新增 → 改善 → 修正）並更新標題為「Chart 半圓／實心圓餅 · Tag 尺寸 · 開新專案改版 · 套用 token 修正」，共 24 項。

## 2026-11-05（六十三）　重新開始回到預設

- **開新專案「重新開始」**（流程內與底部浮動列兩處）：原本只清草稿、網站保留已套用的 token；改為呼叫 `flwResetSite()` 一併清掉 token 覆寫（含 inline 保底）、元件 Token 綁定、停用 token、需求匯總勾選，並把各元件的變數篩選還原成全選，背景頁重繪。確認框文案同步改為「…都會清掉，回到元件庫預設」。

## 2026-11-05（六十二）　token 覆寫加「生效抽查＋inline 保底」

- 使用者環境回報：套用提案後專案浮動列顯示「已設定 31 項 token」（覆寫值確實存在），但 Guideline／元件仍是預設色；本機 Chromium（file://、http、模擬 CSP）皆無法重現。
- 新增保底：每次寫入 `#tokenOverrides` 後抽查（取 root 層前 3 個 hex 值比對 computed）；若沒生效，改把覆寫直接寫到 `<html>` 的 inline style（`style.setProperty`，任何環境都生效），依目前主題／斷點合併 root＋dark＋當前 tier（深色時略過 root 的 L2 light `--s-*`），主題切換與視窗尺寸改變時重算。`window.__tokApplyMode` 會是 `sheet` 或 `inline`，主控台也會印出改用 inline 的提示，方便回報。

## 2026-11-05（六十一）　Noto Sans TC、Guideline 色塊

- **字體**：`--font-sans`／`--font-display`／`--font-mono` 在英文字體後緊接 `'Noto Sans TC'`（原本排在 PingFang TC 之後、且沒載入網路字型，Windows／Android 會落到系統字）；head 以 Google Fonts 載入 Noto Sans TC 400–700；SCSS 樣式包的 `@import` 一併補上。
- **Guideline 色彩**：色塊圓角 12px → `--r-sm`。
- **Guideline 色塊即時更新**：色塊背景改直接用 `var(--token)`（原本寫死渲染當下讀到的色號，切換深淺色或套用 token 後不會變，截圖中淺色頁面卻顯示深色值就是這個原因）；色號文字在主題切換、token／綁定覆寫寫入後自動重讀。

## 2026-11-05（六十）　套用 token 在預覽環境不生效（真正原因）

- **症狀**：套用提案或在 Token 頁改色後，Token 頁欄位數值有變，但 Guideline、元件仍是預設色。
- **原因**：token／綁定覆寫是動態建立 `<style id="tokenOverrides">`／`#bindOverrides` 再寫 textContent；預覽 artifact 的 CSP 只放行頁面原本的樣式表，動態 `<style>` 被擋（`style.sheet` 為 null），所以覆寫從沒生效。本機與 Vercel 不受影響，所以先前驗證沒抓到。
- **修正**：新增 `dynCss(el,css)`：照舊寫 textContent（觀察者仍收得到）；若偵測到 `<style>` 沒有產生 sheet，改用 CSSOM `insertRule` 把規則寫進頁面既有樣式表最後面（CSSOM 不受 CSP 限制），每次重寫前先移除上次插入的規則。三處（Token 頁 apply、`applyTokOverrides`、`applyCompBindings`）都改走它。已用模擬 CSP（nonce 限定樣式）驗證：套用 #0033FF 後 Guideline 與 Button 皆換色。

## 2026-11-05（五十九）　提案配色修正、popup 上距

- **開新專案 · 提案**：
  - Token 提案的色階條原本讀網站目前的 `--c-brand-*`，不會隨問卷色號改；改成直接顯示提案值。下方按鈕／標籤預覽也改吃提案色（還沒套用就看得到）。
  - 套用後元件與 Guideline 看起來沒換色：網站預設深色模式，主色按鈕走 `--c-brand-200`（為近黑中性品牌設計），彩色主色在這裡會變成很淡的粉色。提案改為：主色彩度夠時，另寫 dark 覆寫，`--s-action-primary` 用「在深底上對比 ≥ 3:1」的最深一階（例：#0011FF → 400），hover／press 取相鄰階、`--s-on-primary` 依對比選白或黑；提案理由列同步說明。
- **Modal popup（確認框）**上方內距 `--sp-4` → `--sp-5`，與左右、底部一致。

## 2026-11-05（五十八）　開新專案彈窗加寬、建議元件分類

- **開新專案彈窗**寬度改 `calc(100vw - 20vw)`（左右各 10vw），最大 1000px（原 960px）；手機 bottom sheet 不變。
- **提案步驟的建議元件**依側欄分類（General 基礎、Form 表單…）分組，分組標題 sticky、顯示各組數量；≥768px 時面板高度與左邊 Token 提案拉齊，清單在面板內捲動。

## 2026-11-05（五十七）　動態展示不再拉走游標

- **首頁動態展示**：折線圖的自動 hover 示範是派發合成 pointer 事件，原本會被協作游標一起接收、看起來像滑鼠被拉到圖表上。協作游標改為只跟真實滑鼠（`isTrusted`），示範仍在牌卡內用自己的示意游標跑 hover 效果。

## 2026-11-05（五十六）　試玩預覽選取框

- **Token 試玩**：點擊／聚焦控制欄位（含手機工具列與 sheet）時，整塊試玩牌卡（左側操作區＋右側預覽）出現與元件牆 hover 相同的 Figma 式選取框（`.hx-sel`：`--c-info-500` 細框＋四角方點），往內縮 `--sp-2` 避免被外框裁切；點到試玩區以外收掉。
- **Token 試玩待辦牌卡**的標籤（設計／Figma／前端／內容）由外框改柔色 soft Tag。

## 2026-11-05（五十五）　使用回饋背景視差滾動

- **首頁使用回饋**背景圖加視差：圖比舞台高 40%（上下各超出 20%），依舞台在視窗中的位置反向慢移（最多約 ±20% 舞台高），舞台圓角裁切不露邊；只在可見時以 rAF 更新；減少動態時不動。

## 2026-11-05（五十四）　首頁游標標籤依段落換字

- **首頁協作游標**的標籤依滑鼠所在段落顯示不同文字：hero `yuu`、元件牆 `component`、數字段 `about`、動態展示 `motion`、四個步驟 `how2use`、Code ↔ Figma `highlight`、使用回饋 `feedback`、FAQ `question`。
- 切換時打字動態：先逐字刪到共同前綴、再逐字打出（速度讀 `--dur-fast`），打字中顯示細游標；快速跨段只追最新目標；減少動態時直接換字。

## 2026-11-05（五十三）　母庫提示移到 logo 右側

- **Header**：「此為母元件庫，若需更新請調整原始檔」（專案模式為專案名＋版號）從右側群組移到 logo 右側；左邊留 `--sp-3`＋`--sp-5` 間距，中間一條 1×16px 的 `--line` 細線分隔，文字改 muted／medium。≤1199px 仍隱藏（側欄底部有同一句）。

## 2026-11-05（五十二）　Tag 新增 size 軸；Step 標籤改 m

- **Tag** 新增 `size` 軸（s／m／l）：s＝原本尺寸（22px、`--fs-h12`，預設、不加 class）、m＝26px（`--fs-h11`）、l＝32px（`--fs-h10`、左右 `--sp-4`）；icon 12／14／16px。
  - `tagEl(variant,intent,state,corner,size)` 加第 5 參數；Tag 頁矩陣依 variant × size 分塊、Live 加 Size 切換；registry 補 `size` 軸，variantCount 126 → 378。
- **首頁步驟牌卡**的 Step 標籤改用 m。

## 2026-11-05（五十一）　四個步驟說明改寫

- **首頁四個步驟**的說明改寫成網站上的實際操作：開新專案填資料＋品牌問卷（草稿自動保存）／Design Token 頁自行輸入色碼、調整間距圓角字級陰影／變數篩選器勾選樣式意圖狀態尺寸、即時預覽與 HTML／CSS 同步、Token 綁定／寫入 Figma Variables 與 variant、下載 SCSS 樣式包與元件程式碼、差異檢查。說明寬度 34ch → 42ch。

## 2026-11-05（五十）　FAQ 下方間距

- **首頁 FAQ**（最後一段）下方加 `calc(var(--sp-9) * 2)`（桌機 128px／手機 96px），與 footer 拉開、和段落間距一致；原本只有 8–16px。

## 2026-11-05（四十九）　Chart 新增半圓、實心圓餅；甜甜圈細緻化

- **新圖型**（基礎段，Chart 14 → 16 型；registry 同步補 `semi`／`pie`，variantCount 32）：
  - `semi` 半圓：180° 弧，樣式同甜甜圈（平頭、環寬比例一致、段間 1% 細縫），中央「完成率＋大數字」，可開圖例。
  - `pie` 實心圓餅：扇形以面板色細線分隔，≥10% 的扇形內標百分比（Live 可關 `labels`），可開圖例。
- **甜甜圈**參考細環樣式調整：環寬 15→7、半徑 46→52、段間 1% 細縫；尺寸 m 120→156px、s 80→96px、卡內 110→140px；中央改小標在上、大數字（Epilogue）＋小單位。
- 三型共用同一組資料與色 token（`--accent`／`--ok`／`--warn`／`--i-danger`）與 hover tooltip。

## 2026-11-05（四十八）　收合動畫、版本紀錄補齊

- **變數篩選器／Token 綁定／狀態一覽表**（`.dcard`）展開收合改成高度補間（約 375ms、`--ease-out`）＋內容淡入淡出，箭頭同步旋轉；連點會先收尾到終點再反向；尊重「減少動態」。
- **首頁 slogan（手機）**：換字改從第三行開頭打字，不接在第二行尾巴。
- **首頁段落標題**：「Code <-> Figma, Auto-connect」「常見問題 FAQ」字級改與宣言段「Every component grows…」一致（clamp 24–44px、Epilogue semibold）。
- **網站版本紀錄**補上 v8（11-02）、v9（11-03）、v10（11-04）、v11（11-05），footer 版號跟著顯示 v11。

## 2026-11-05（四十七）　Slider 軌道樣式

- **Slider**：圓點縮小、軌道加粗——s：軌道 3→5px、圓點 14→12px；m：軌道 4→6px、圓點 18→14px（全站使用 Slider 原子處同步）。

## 2026-11-05（四十六）　搜尋位置、開新專案版型、首頁細節

- **Header 搜尋**：所有寬度（含手機／平板與 RWD 預覽框內）都放在右側、深淺色切換左邊。
- **搜尋彈窗**：圓角改用 `--radius`（與 Modal 一致）；畫面垂直置中。
- **開新專案**：
  - 桌機／平板：高度固定撐到最大（90dvh），換步驟不跳動；步驟改放左側（Steps vertical）。
  - 手機：改 bottom sheet（貼底、上緣圓角、由下滑入），步驟維持置頂水平。
- **三大特色**標題改首字母大寫（Variables／Variants／Drift Check）。
- **使用回饋**中間牌卡圓角改 `--radius`，引言字級降一級（桌機 h7、手機 h8）。
- **FAQ** 可同時展開多個。

## 2026-11-04（四十五）　Favicon 與分享封面

- **Favicon** 換成新 logo：深色圓角方塊＋白色 cdl 字標＋橘色方點；SVG 為主、32px PNG 備援、180px apple-touch-icon，皆以 data URI 內嵌。
- **分享封面**：新增 `library/assets/og-cover.png`（1200×630，標語 Tune one token, every component follows.）；補 `og:*`、`twitter:card`（summary_large_image）、description 與 theme-color。封面以絕對網址 `https://cool-ds-library.vercel.app/library/assets/og-cover.png` 指定，合併到 main、Vercel 部署後生效。

## 2026-11-04（四十四）　試玩預設、header 排列、側欄待調整項

- **Token 試玩**預設陰影改「無」、外框深淺預設 35%；預覽卡底色淺色更淺（混白）、深色更深（混黑）。
- **使用回饋**手機高度改 75vh（最矮 420px）。
- **Header**：搜尋框移到 RWD 切換左邊（右側群組）。
- **需求匯總**：類別卡左側 icon 拿掉（同側欄）。
- **側欄**：「上手指南」「偏好設定」標示（待調整）並停用。

## 2026-11-04（四十三）　Figma 同步段落改雙筆電場景

- 標題改「Code <-> Figma, Auto-connect」。
- 中間改成大型場景（1440 寬約 460px 高）：左右各一台 CSS 繪製的筆電，往外側延伸、只露出靠中間的部分，中間放同步標誌與「已同步／同步中」Tag。
- 左螢幕是程式碼編輯器（tokens.export.json 分頁、行號、語法上色、色票）：第 4 行 `primary` 反白，舊色號刪掉、逐字打上新色號；右螢幕是 Figma Local variables 面板，`action/primary` 列閃一下並更新色票與色號。兩邊輪流當起點，用的是 :root 實際色值；只在畫面內播放、減少動態時靜止。手機改上下兩螢幕各自裁切外側。

## 2026-11-04（四十二）　首頁細修：手機瀑布流、Step 標籤、回饋背景不閃

- **手機動態展示**改回瀑布流（兩欄、元件縮到約 58%），取代橫向滑動。
- **裝置預覽變淡**：外層顆粒層疊在 iframe 上造成畫面變灰；預覽開著時外層顆粒關閉。
- **段落間距**再加大（上方段落 `--sp-9 + --sp-6`、下方四段 `--sp-9 × 2`）。
- **四個步驟**：「Step 01」改用 Tag 原子；Step 02「活潑」主色橘、輔色紫，不再相同；進度條跑到 100% 轉成綠色。
- **使用回饋（續）**：手機固定 50vh 高；換則改成先退後進，兩張引言卡不再疊在一起。
- **Step 標籤**改為 solid 中性 Tag。
- **使用回饋**：背景改成固定一張，切換時只換引言卡、不再閃；引號縮小；手機上下留大量 padding。
- **試玩區標題**改「Try to change the token setting.」。

## 2026-11-04（四十一）　首頁下半部統一風格

- **間距**：四個步驟、Figma 同步、使用回饋、常見問題四段之間的距離與上方段落相同。
- **四個步驟**：「Step 01」放大成淡色大字裝飾（Epilogue、約 64px、14% 透明度），與標題拉開距離。
- **Figma 三個亮點**改回 bento 卡片（取代細線分隔）；icon 簡化成兩個基本形，加一顆 `--accent2` 小方塊點綴（同 logo），滑過時方塊微放大。
- **使用回饋**：背景圖圓角改 `--radius`、疊一層 42% 淺黑、拿掉 zoom；切換箭頭與進度移進引言卡底部；換則時卡內資訊依序上移淡入。
- **常見問題**：標題改「常見問題 FAQ」，移除卡內小標，問題列表不再多包一層卡。

## 2026-11-04（四十）　Figma 亮點改幾何 icon、新增使用回饋段落

- **Figma 同步段落**底部的三個亮點改成無外框三欄（細直線分隔）：每欄一個幾何線條 icon（VARIABLES 疊層八角、VARIANTS 斜切＋旋轉、DRIFT CHECK 位移副本），進入畫面時線條依序畫出、滑過微位移；標題用 Epilogue，說明改寫。手機改單欄、橫線分隔。
- **動態展示**的元件卡陰影統一為淡淡的 `--e-sm`。
- **Token 試玩**新增「外框深淺」滑桿（0–100%，50 為預設）：往上混入文字色讓 `--s-border-1／2` 變深，往下淡化。
- **新增使用回饋段落**（FAQ 前）：寬幅背景照片（使用者提供的辦公室窗景）上疊引言卡（大引號、Epilogue 引言、姓名職稱、頭像），下方左右箭頭＋進度線＋01 / 05；五則回饋約 6 秒自動淡換，滑過／聚焦／捲出畫面暫停，聚焦時可用 ←／→；減少動態不自動播放。

## 2026-11-04（三十九）　四個步驟：Step 標、動態配圖、只留最後 CTA

- 拿掉段落大標（保留 aria-label）；每張卡標題上方改為 Epilogue 的「Step 01–04」。
- 右側配圖改成循環動態（進入畫面才播、分頁隱藏暫停、減少動態顯示完成狀態）：上傳進度跑滿→第二個檔案上傳；風格 俐落→柔和→活潑，色票／Tag／按鈕圓角與色彩跟著變；勾選框逐一打勾、計數 0→3；兩條進度填滿→按下寫入 Figma→出現成功 Tag→下載 SCSS。
- 只有第 4 張卡保留「開始新專案」與「看 Figma 同步」，草稿提示移到按鈕下方。

## 2026-11-04（三十八）　動態展示間距、元件牆跟手加強

- **動態展示**：卡片之間的距離縮成與元件牆相同（`--sp-5`），每張元件卡撐滿欄寬（同欄等寬），段落上下留白加大；手機不再多包一層外框。
- **元件牆**：滑過時的跟手位移與傾斜加大一倍（16px／5°）；跑馬燈上下各留 `--sp-6` 空間，格子往上位移時不再被上緣裁掉。

## 2026-11-04（三十七）　首頁「四個步驟」改疊卡、下方段落限寬

- **四個步驟**改成疊卡（參考 arqe.ai）：每步一張全寬大卡，左側淡色編號 01–04＋標題＋說明＋「開始新專案」與對應頁面的文字按鈕，右側大面板放放大的元件示範（Dropzone、Segmented＋色票＋Tag＋Button、Checkbox 清單、Progress＋Button）。≥768px 捲動時卡片 sticky 疊上，被蓋住的卡從上緣略縮、變淡；手機一般直排；減少動態時不縮不淡。
- **首頁下方三段**最大寬度改為與 hero 相同（1180px）。
- **常見問題段**先隱藏「最近的版本」，標題改「有問題看這裡」。

## 2026-11-04（三十六）　Header／側欄重排、手機首頁調整

- **Header**：搜尋框移到 logo 右邊；RWD 預覽切換移到深淺色切換左邊；topbar 的「上手指南」按鈕拿掉。
- **側欄**：「上手指南」固定放在「偏好設定」上方（全尺寸都顯示），原本手機頂端的入口移除。
- **手機／平板首頁**：沒有游標互動，hero 的光暈全部拿掉，只留點陣。
- **手機動態展示**：改成橫向一列卡片，自動以約 18px/s 慢慢左右來回滑動；手指觸碰後暫停 4 秒、捲出畫面停止、減少動態時不動。人物卡與群組卡在手機也顯示。

## 2026-11-04（三十五）　首頁 03–05 段落改版、網站預設深色、人物卡輪播

- **網站預設改深色**：沒選過主題的訪客一律深色；只有在 topbar 明確切到淺色才記住淺色。
- **首頁三段改版**（拿掉段落數字、標題改口語）：
  - 「四個步驟，開好一個新專案」：四張步驟卡，每張放一個小的實際元件（Dropzone、Segmented＋Tag、Checkbox、Progress＋Button）示範該步，下方「開始新專案」按鈕。
  - 「改一邊，另一邊自動跟上」：程式碼卡與 Figma 卡左右對照，一邊的色彩 token 換值、另一邊跟著更新，方向交替；下方三點說明（Variables／Variants／Drift）。捲出畫面、分頁隱藏、減少動態時停止。
  - 「最近改了什麼？有問題看這裡」：左卡列最近四筆版本，右卡用 Collapse 呈現四題常見問題。
- **動態展示的人物牌卡**撐滿欄寬，照片改為淡入淡出輪播（站內四張人像），加入成員鈕照舊切換。

## 2026-11-04（三十四）　首頁動態展示精簡、協作游標全首頁

- **元件牆**：原本虛線透明底、棋盤格的格子改成實底淡漸層；標籤格的 Tag 放大一級（30px／`--fs-h10`）、數量 5 → 12 個（三排；有滑過動態的 4 個保留原色，其餘用中性外框）；頭像格改用 Avatar image 型（人物照片頭貼）。
- **數字段落**上下留白加倍。
- **動態展示**：拿掉暫停鈕（滑過／聚焦、捲出畫面、減少動態仍會停）與卡片間虛線；KPI 走勢卡只留一張圖；拿掉熱銷商品卡；原本待辦卡的位置改放「27 New Messages」群組卡。
- **協作游標**擴大到整個首頁（不只 hero），元件牆格子上也維持「yuu」游標；離開首頁自動移除。

## 2026-11-04（三十三）　元件牆 Figma 選取框、hero 協作游標

- **元件牆**：滑過或聚焦的格子顯示 Figma 式選取框（藍色 1px 外框＋四角白底小方塊），跟著格子一起跟手位移。
- **Hero**：拿掉跟隨滑鼠的光暈，改成協作游標——藍色箭頭＋「yuu」名牌彈性跟隨滑鼠；移到按鈕、連結或試玩區時自動隱藏、恢復系統游標。只在有滑鼠的裝置、未開減少動態時啟用；點陣散開效果保留。

## 2026-11-04（三十二）　非元件頁改 bento 版面、手刻控制換成元件庫原子

- Design Token、Design Guideline、需求匯總、版本紀錄、偏好設定、上手指南六頁改用 bento 卡片＋間距排版（`--panel` 底、1px `--line`、`--radius`、卡內 `--sp-5`、段落間 40px），拿掉頁首下方分隔線、段落標題 2px 底線與條目間分隔線；段落標題在卡外、用 `--font-display`。
- 手刻控制換成元件庫原子：Token 頁 L1／L2／框架索引分頁、Desktop／Tablet／Mobile、中／En、Sans／Mono 切換改 Segmented；預覽文字框改 Input；重設、停用部分數值、查看程式碼、複製／下載此檔、全部下載改 Button。Guideline 裝置／語言／字體分頁改 Segmented；需求匯總 AI 建議產出改 Switch、複製 JSON／我要調整改 Button；上手指南示意的深淺色切換改 Segmented。
- 部分輔助文字精簡（匯出段落說明、磨砂說明）。

## 2026-11-04（三十一）　首頁元件牆改一列、滑過換狀態＋跟手

- 元件牆改成一列 15 格方格跑馬燈。拿掉儀表板、評價、步驟、分頁器；新增 Date Picker（區間月曆）、Metric Card、Tooltip；Slider 改填充樣式；人物牌卡整張放得下。
- 滑過（或鍵盤聚焦）時，格子裡的元件會依序切換自己的狀態，例如按鈕 預設 → 滑過 → 按下、下拉 收起 → 展開 → 選項反白、開關 關 → 開，約 0.8 秒一拍，離開回到靜止狀態；全部用元件自己的狀態 class／事件，不另外重畫。
- 滑過的格子會帶點彈性往游標方向位移、微傾斜，離開彈回。保留減速、拖曳慣性、名稱淡入與點擊進元件頁；減少動態時直接顯示代表狀態、不跟手。

## 2026-11-04（三十）　字體來源統一、光暈改小圓

- **Eyebrow 與軸標籤改 Epilogue**：頁首「L3 COMPONENT · …」與控制區／變數篩選器的軸標籤（VARIANT、SIZE、CONTENT…）全站改用 `--font-display`，保留大寫與字距。
- **Epilogue 內嵌**：與 Geist／Geist Mono 一樣以 Latin 子集變體字（100–900）內嵌，不再從 Google Fonts 載入，離線、內網也正常；Design Token 頁「Font Family」群組加入 `--font-display`，`tokens.base.json` 同步。
- **未套字體 token 的等寬字**：`code／kbd／samp／pre` 預設改走 `--font-mono`（Token 綁定欄位名旁的 radius／spacing／typography 原本落到瀏覽器內建 monospace）。
- **Metric Card 平均線標籤**改用 `--font-sans`＋tabular-nums，與卡片大數字、圖表元件一致。
- **手機字級層級**：hero 標題由 `--fs-h4`（28px）提高到 `--fs-h2`（36px），CTA 改 Button sz-m 規格（40px／`--fs-h10`），試玩段落標題改 `--fs-h5`；數字段落手機兩兩並排。
- **Hero 游標光暈**改為正圓（半徑 140px），透明度減半（淺色 11%、深色 8%）。

## 2026-11-04（二十九）　首頁細修：英文 slogan、光暈換色、數字段落、Epilogue 補齊

- **Topbar** 拿掉 logo 旁的「cool-ds-library」文字。
- **Slogan** 只留英文、恢復一般大小寫，換字的動詞維持正體。
- **試玩區**拿掉三種裝置外框與「調整 token」小標（手機仍限高 80vh、內部捲動，工具列 icon 靠右）。
- **Hero 光暈**：跟隨游標的光暈縮小為原本約 1/4 面積（260×210）；淺色模式改用資訊藍＋紫的淡色（原本混近黑主色顯得髒），深色模式維持主色微光。
- **數字段落**：最大寬度同 hero、拿掉卡片外框，文案改英文並縮短、整寬 balance 斷行、逐字（單字）變色；只留三個數字（拿掉主題 × 斷點）；標籤移到數字上方，數字字體改用圖表元件同款（Geist＋tabular-nums）。
- **Button soft**：改成半透明面板底＋背景模糊，磨砂效果在點陣／光暈上看得出來。
- **Epilogue 補齊**：首頁段落標題、Design Token 段落標題、Guideline 段落標題、版本號、上手指南示意圖、狀態一覽表標頭等原本寫死 Geist Mono 的標題類文字改為 Epilogue；eyebrow、標籤、程式碼、字體標本維持原字。

## 2026-11-04（二十八）　首頁新增宣言段落與大數字

- 元件牆下方新增一張 bento 卡：一段宣言文字隨捲動逐字由淡轉實；下方四個大數字（已定案元件、變體組合、Design Token、主題 × 斷點）在進入畫面時從 0 滾動計數到實際值（ease-out、依序錯開）。數字直接從網站資料計算，元件或軸增減會自動更新。減少動態時直接顯示終值與實色文字。

## 2026-11-04（二十七）　標題字改 Epilogue；首頁 slogan、試玩區裝置外框

- **Display 字體改為 Epilogue**（新增 `--font-display` token）：頁面標題、側欄項目、段落標題、品牌名稱、首頁 slogan 改用 Epilogue；說明文字回到內文 Geist；Geist Mono 只留給程式碼、token 名稱與小型標籤。樣式包 `_font.scss` 同步輸出 `--font-display`。
- **首頁 slogan**：英文全大寫；預先量測兩種語言所有詞的最大高度並鎖定，換字時下方按鈕不再上下跳動；hero 上下留白加大。
- **試玩區**：段落標題改為「Change the token, change the component」（字級 `--fs-h7`）；預覽外加裝置外框——桌機為瀏覽器視窗（三點＋網址列）、平板為平板邊框、手機為手機邊框＋動態島，手機限高 80vh、內部捲動。手機工具列補上底部 padding。
- **Hero 互動背景**：主光暈以彈性補間跟隨游標；點陣改用 canvas 繪製，游標附近的點會被推開、變亮略放大，離開後彈回。只在有滑鼠的裝置、未開減少動態時啟用，捲出畫面即停止。
- **Button soft**：加上背景模糊（`backdrop-filter`），放在漸層或圖片上更清楚。

## 2026-11-04（二十六）　手機試玩改分組工具列、浮動列離邊、編輯中停用開新專案

- **手機試玩**：「調整 token」大按鈕改成一列工具列——左側標題＋四顆 icon-only Button（顏色／形狀／文字／間距與動態，Phosphor icon）＋已改數 Tag；點任一顆開底部抽屜並自動捲到該分組，分組短暫高亮。
- **手機浮動列**不再貼邊貼底：左右與底部各留 12px（含安全區），`--r-md` 圓角。
- **編輯中停用「開啟新專案」**：已套用提案的專案編輯中，右上按鈕停用並提示改用浮動列的「重新開始」。
- **手機搜尋鈕**：icon 改 14px 與選單鈕一致，hover 樣式只在有游標的裝置生效（避免觸控後殘留深色外框）。

## 2026-11-04（二十五）　首頁 slogan 加英文版

- Hero 標題先播英文「Tune one token, / every component recolors · rounds · reweights · tightens」，四個詞播完淡出換成中文「調一次 token，/ 整套元件一起換主色 · 改圓角 · 調字重 · 變密度」，循環；每個詞仍各有顏色。減少動態時固定英文第一句。
- 網站頁尾版權改為「© 2026 YUUDESIGN, all rights reserved. Powered by Yuu」。

## 2026-11-04（二十四）　Logo 換成 CDL

- 母庫 logo 由 Goons 字標換成 **CDL**（Cool Design Library）：小寫幾何字標「cdl」（同一支 6 單位筆畫）＋句尾強調方塊，方塊綁 `--accent2`、字身走 `currentColor`（深淺色自動反白）。三處同步：網站 topbar `.brand-logo`、library header `hdrLogo`、footer `ftrLogo`；鎖寬 40／46px、高度等比。專案上傳的 logo 仍優先顯示。
- 產品名稱同步改為 CDL（CDL Studio、樣式包與匯出檔註解、說明文字、guide 示意圖的字標）；公司版權「果思設計 Goons Design」維持不變。

## 2026-11-04（二十三）　專案浮動列改反白、套用提案後直接到 Token 頁

- **專案浮動列**改用元件庫浮動批次列（Table Toolbar `.ttb-bar`）同一套反白樣式：`--ink` 底、`--panel` 字、`--r-md`、`--e-xl`；「匯出」為反白外框、「下一步」為反白實心，深色模式自動反轉。進場改成彈性上滑＋淡入（手機為底部滑入）。
- **浮動列加「重新開始」**（反白文字按鈕，放在「匯出」左邊）：確認後清除流程草稿、回到開新專案第 1 步；`?project=` 模式不顯示。
- **開新專案「套用到網站」**：套用後自動關閉流程、流程進到「調整」步驟，跳到 Design Token 頁並顯示提示，底部浮動列動態進場。

## 2026-11-04（二十二）　手機：調整 token 移到試玩區上方、搜尋鈕與彈窗

- 手機試玩區的「調整 token」不再懸浮在畫面底部，改放在試玩卡片最上方、滿寬。
- 手機 header 的搜尋鈕改成與選單鈕同款（outline · secondary icon-only，透明底、同色 icon）。
- 搜尋在手機／小平板改為彈窗（上方留出 header、左右 12px 側距、列表在彈窗內捲動），不再滿版。

## 2026-11-04（二十一）　Header、裝置預覽與專案編輯模式

- **裝置預覽載入動畫**：裝置螢幕內顯示 % 進度（Progress＋Loader 原子），依框內頁面的真實訊號推進（文件開始→腳本執行完→字型就緒），完成後淡出。慢與空白的原因：每次開預覽都重新載入整份約 1.8MB 的單檔頁面，靜態殼先畫出（只有 topbar、空側欄、頁尾），大段腳本跑完才出現內容；現在載入動畫蓋住這段空殼，切換裝置沿用同一個 iframe 不重載。
- **Header 手機／平板**：選單鈕固定 32×32 方形 icon 按鈕；搜尋在 ≤599px 改 icon 按鈕、600–1023px 為 220px 欄位（修正被 1199px 規則蓋掉的問題）。
- **側邊欄**：901–1199px（iPad Pro）預設收合，使用者手動切換會記住。
- **右上按鈕改「開啟新專案」**（開 #start 流程）；`?project=` 模式維持「儲存並更新」。匯出改在流程的匯出步驟與浮動列。
- **專案編輯模式**（`?project=` 或已套用流程提案）：元件頁 Token 綁定可編輯，綁定存進草稿、重整後保留。原右下「專案進行中」改成底部置中浮動列：專案名 Tag＋「已設定 N 項 token · 已選 M 個元件」（即時更新）＋「匯出」「下一步」；手機為滿寬底部列並避開安全區。

## 2026-11-04（二十）　首頁手機／平板：CTA 破版修正、試玩區改版

- **Hero CTA**：手機寬度下按鈕被 `flex:1 1 0` 擠到比文字還窄而破版；改為維持原尺寸，≤599px 時兩顆等寬並排撐滿。
- **iPad mini 直式（600–767px）**：試玩控制改成面板內兩欄格線（同類控制成對排），整組約 414px 高、不再需要「更多選項」；footer 單列。
- **手機（≤599px）**：控制收進一顆浮動「調整 token」按鈕（附已改數量 Tag），點開 library Modal 底部抽屜，內含全部控制與重設／複製 CSS 變數，預覽即時更新；Esc／×／點背景關閉，焦點回到按鈕。移除舊的「更多選項／收合」列。

## 2026-11-04（十九）　匯出 zip 元件程式碼改成合併檔結構

- 原本每個元件一個資料夾（`components/<id>/<id>.html＋<id>.scss`），32 個元件就是 64 個檔。改成：樣式每顆一個 SCSS partial 平放在 `styles/components/_<id>.scss`，加 `styles/components/_index.scss` 合併入口（`@forward` 全部已選元件，`@use "styles/components"` 一行引入）；HTML 全部合在專案根目錄 `components.html`（開頭附元件清單，依元件分段註解）。交棒說明與檔案清單文字同步更新。

## 2026-11-04（十八）　Slider 頁新增「Variant 樣式軸」段落

- 填充式滑桿原本只藏在互動預覽的 Variant 切換與狀態一覽表裡，不容易發現。新增「Variant 樣式軸」段落，並排展示軌道／填充 × 單值／區間四種（都可直接拖曳）；示意列改成等寬格線，兩種樣式的長度一致好比較。

## 2026-11-04（十七）　首頁 hero 精簡

- 拿掉左上「新」公告膠囊與底部「已定案元件」分類數字列；說明改寫為「N 個元件共用同一套 Design Token。改一個值，網站、程式碼與 Figma Variables 會一起更新。」並移到「開始新專案」按鈕下方，hero 改為單欄靠左。

## 2026-11-04（十六）　首頁 Token 試玩面板拿掉小標

- 拿掉面板標題「Token 試玩」與分組小標（顏色／形狀／文字／間距與動態），分組之間的虛線分隔也拿掉（只留間距）；分組仍有 aria-label。桌機不顯示面板標題列，手機保留（改動數＋收合鈕）。

## 2026-11-04（十五）　首頁第六輪：元件牆互動還原、動態展示換輸入類牌卡

- **Token 試玩**：團隊成員改回頭像列版（加到 6 位，與趨勢圖等高）；快速新增拿掉「說明」欄位，欄位重新排列。
- **元件牆、動態展示**：不顯示段落標題（保留 aria-label）；動態展示的暫停／播放改成卡片右上的小按鈕。
- **元件牆互動**（參考 designsystems.surf 的 ticker）：持續橫向輪播，滑過時減速到 25%（不是硬停）；可滑鼠／觸控拖曳並帶慣性、觸控板橫向捲動；滑過或聚焦時格子下方的名稱與「查看元件 →」以彈性曲線淡入上滑；拖曳不會誤觸點擊。移除「查看 X →」游標提示。
- **動態展示**：移除儀表、品牌牌卡、動態速度卡；新增三張輸入類牌卡——建立帳號表單（自動打字、驗證錯誤→修正→成功）、任務清單篩選（搜尋逐字篩選、套用狀態 chip）、排程上線（下拉選負責人、日期選擇）。熱銷商品改成模擬游標滑過長條顯示 tooltip，不再切換排名。KPI 折線的 hover 一次只動一張、十字線與 tooltip 淡入淡出、每張約 3.8 秒，修正切換時跳動閃爍。

## 2026-11-04（十四）　圖表頁控制區只顯示該圖型可控制的選項

- 圖表頁原本就有「依圖型顯示選項」的邏輯，但改成 bento 版面後控制列被移出原本的區塊，判斷找不到元素，所以 14 種圖型的選項全部攤開。現在改從整頁找控制列：例如折線只顯示面積／漸層／格線／X、Y 軸 5 項，橫向排名長條只顯示排序＋排名數值，熱力圖只顯示色階＋色階圖例。

## 2026-11-04（十三）　所有元件頁改用 bento 版面；長選項改下拉

- **元件頁 bento 化**：除 Logo（品牌資產上傳頁）外，所有元件頁沿用 Button 頁版型——第一列控制｜預覽｜變數篩選＋Token 綁定（可拖寬）、第二列 HTML｜SCSS、內容段落（標題在卡外、內容一張卡）、最後狀態一覽表預設收合；拿掉 spec 列、分隔線與「互動預覽與程式碼」「變數與 Token」段落標題。依預覽寬度自動選三欄／兩欄／寬版（控制橫排、預覽滿寬，用在 header、footer、app-shell、table、table-toolbar、modal、drawer 等）。selector 依 checkbox／radio 各一組；input 子元件、tab item 各成段落；progress、calendar 無程式碼列。`PAGE_LAYOUT[id]='classic'` 可退回舊版。
- **長選項改下拉**：互動預覽的選項超過 6 個（或設定 `as:'select'`）改用 Dropdown 元件——Chart 圖型（14 種）、Tag intent、Icon。被變數篩選器關掉的選項會停用，鍵盤可操作、點外面收合。
- 手機寬度下 header、input、list、table-toolbar 原本會撐出橫向捲動，現在寬預覽在卡片內部捲動。

## 2026-11-04（十二）　首頁第五輪：元件牆跑馬燈、動態展示錯落 bento、段落 bento 化

- **Token 試玩預覽**：待辦卡拿掉封面、改 6 項＋完成進度；團隊成員改成人物照片小卡（Person Card 的相框＋站內照片）；快速新增加入負責人（下拉）、截止日（Date Picker）、優先度、標籤（多選）、說明、通知成員，新增／清除改 s 尺寸放到卡片右上角；「進行中」tag 文字修正為綠色。
- **元件牆**：改成兩排 300px 正方形格、16 顆真實元件原尺寸展示，背景輪流用漸層、照片、虛線框、點點、棋盤格；兩排反向無限跑馬燈（52s／60s 一圈），滑過或聚焦暫停、捲出畫面暫停，減少動態時改成可橫向捲動；保留「查看 X →」游標提示與點擊進元件頁。
- **動態展示**：改成高低錯落的 bento 欄位排列＋虛線格線，欄數依寬度 4／3／2／1；自動動態節奏不變，暫停鈕移到段落標題列。
- **段落**：所有段落內容改用 bento 卡片、段落間距 40px，拿掉段落說明、腳註、自動播放說明等輔助文字；段落標題精簡為：元件牆、動態展示、四步開新專案、Figma 同步、更新與常見問題。

## 2026-11-04（十一）　Header 新增 RWD 裝置預覽切換

- 「上手指南」右邊新增裝置切換（Segmented 原子＋Tooltip）：桌機／平板 iPad Pro 13"（1024×1366）／小平板 iPad mini（744×1133）／手機 iPhone 16（393×852）。選平板或手機時，在 header 下方開啟預覽區，用裝置外框（動態島、狀態列、home 指示條；外框色走 neutral token）以真實 CSS 尺寸顯示目前頁面，超過視窗高度時等比縮小；下方顯示裝置名稱與尺寸，附「旋轉」「關閉」（Button 原子），Esc 也可關閉。
- 外框內是同一頁的 iframe（加 `rwdframe=1`，內層不再出現切換鈕）；主題、磨砂設定即時同步，內外頁換頁雙向同步；選擇記在分頁 session。視窗寬度小於 1024px 時隱藏切換、自動關閉預覽。

## 2026-11-04（十）　首頁 Token 試玩改版第三輪；Button bento 段落間距修正

- **首頁 Token 試玩**：操作區與預覽合成同一張實底卡片，左右等高（預覽決定列高、操作區內部捲動），不再透出點點背景；拿掉「底色染色」與染色強度；預覽主題只留淺色／深色（進站跟網站主題）；「快速新增」欄位與底部按鈕間距拉開並加分隔線；「邀請」改 Button soft／secondary 灰底；卡片標題列改依內容高度，四邊 padding 一致；待辦卡加上 Image 元件封面（站內照片）；預覽內圖表系列 1 跟主色、系列 2 跟輔助色。
- **Button bento 頁段落間距修正**：上一版加的間距被 `.bento section.block{margin:0}` 蓋掉沒生效；現在 Size／Content／狀態一覽表之間＝40px（依 Figma 17756:22864）。

## 2026-11-04（九）　全站確認框改用 library Modal 元件

- 原本的確認框（`dsDialog`：開新專案「重新開始」、匯出／儲存確認等）是另一套自訂樣式（`.ds-dlg`），跟 Modal 元件圓角、字級、按鈕排列都不同。現在一律取用 Modal：單純確認＝**popup**（置中標題＋說明＋次／主並排等寬按鈕），帶變更清單＝**modal**（標題列＋×、可捲內容、右對齊 footer）。支援 Esc 關閉、關閉後焦點回到觸發按鈕；疊在其他 Modal 上方時層級正確。

## 2026-11-04（八）　分段控制選取底色錯位修正；流程「重新開始」移到底部；步驟打勾加粗

- **分段控制（`.seg`）**：選取底色改由 ResizeObserver 跟著元件自身尺寸重新對齊（只在尺寸真的改變時 snap，點選切換仍保留滑動動畫）——拖曳欄寬、容器換版時不再錯位；Button bento 控制欄的分段鈕改用等分格線，字放不下時該格撐開、不溢出，控制欄最小寬度 200 → 240px。
- **開新專案**：「重新開始」從右上角移到底部「上一步」右邊。
- **Step**：完成步驟的打勾改成 bold 粗細（與 checkbox 一致）。
- **Button bento 頁**：Size／Content／狀態一覽表段落間距再加大（`--sp-8`）。

## 2026-11-04（七）　開新專案匯出含元件程式碼；Button bento 頁細修

- **匯出改成一個 zip**：除了原本的訪談、提案、token、元件、狀態 JSON 與 README，新增 `styles/`（_variables／_breakpoints／_font／layout.scss＋README，與 Design Token 頁「輸出 · 樣式包」同一套產生器）與 `components/<id>/<id>.html＋<id>.scss`（每顆已選元件，內容與元件頁程式碼區一致、已套用變數篩選）。檔案清單分「文件／樣式包／元件程式碼」三組。JSON 檔維持放在專案根目錄，sync 腳本與 `?project=` 續編才讀得到。
- **修正**：樣式包原本漏掉全寬（root）層的響應式 token 覆寫（圓角／間距／字級），現在 tablet／mobile 覆寫 > root 覆寫 > 預設，與網站實際套用一致（Design Token 頁的輸出也一起修正）。
- **「專案進行中」膠囊改用 Notification 元件**（outline · info，附「回到流程」動作鈕），移除自訂樣式。
- **Button bento 頁**：控制區分段鈕等分寬度；變數篩選器的 checkbox 改用與 checkbox 元件同款的打勾動態（全站原生 checkbox 一起套用）；HTML／SCSS 兩張卡在寬螢幕只顯示標題、不再有分頁切換，手機上只留一張卡並保留切換；Size、Content、狀態一覽表段落間距加大。

## 2026-11-04（六）　Step／Table Toolbar 重新設計；首頁試玩預覽改成 bento 介面

- **Step 新增 `type` 軸：`classic`（原版）／`compact`（精簡進度：分段進度條＋「步驟 n / m」，可點回已完成步驟、錯誤狀態擋下一步）／`timeline`（垂直時間軸：每步可展開細節、一次只開一個）**。`orientation`、`variant` 只在 classic 生效，有效組合 8 種（以 `when` 記錄稀疏組合，Figma 只建有效組合）；boolean：description／count／time／expandable。
- **Table Toolbar 改成 `filter × bulk × density`（2×3×2＝12）**：已存檢視分頁（可另存新檢視）、篩選氣泡卡＋條件 chip、列高切換；勾選列時底部浮出批次操作列（全選 N 筆／只選本頁、指派、匯出、刪除需確認）。原 `mode`、`size` 軸移除。全部取用既有原子（tab、field、button、popover、checkbox、tag、segmented、table、action menu）。
- **registry 產生器**：支援 `when`（稀疏組合）與 `bools`（Figma boolean property），每顆元件加 `variantCount`。
- **首頁試玩預覽**：改成一個「春季活動頁」專案總覽介面——頂列＋7 張 bento 卡（三張 KPI、交付趨勢圖、團隊成員、待辦任務、快速新增），所有卡片同一套圓角（`--radius`）、陰影、外框、底色、padding 與標題列；可直接操作（切月份／本週、勾待辦、新增任務），依預覽寬度自動換欄。
- **slogan 換字加換色**：換主色／改圓角／調字重／變密度各一色（紫／藍／橘／綠，深色模式用亮階），游標跟著變色；減少動態時固定第一個字。
- **動態展示放慢**：每拍停 2.5～4 秒並加隨機偏移，各卡錯開開始；游標掃過圖表改成緩入緩出的弧線，展示卡內的動態時間拉長、改用 ease-out。

## 2026-11-04（五）　Button 頁改 bento 版面；全站 checkbox 與遮罩統一

- **Button 頁改 bento 版面**（依 Figma 17753:18970）：第一列「控制｜預覽｜變數篩選＋Token 綁定」三欄可拖曳調寬（鍵盤 ←／→、雙擊還原，寬度記在瀏覽器）；第二列 HTML／SCSS 左右並列；第三、四列 Size、Content；第五列狀態一覽表預設收合。每塊都是同款卡片（`--panel` 底、1px `--line`、`--radius`、間距 `--sp-5`），拿掉細線分段與不必要的輔助文字。其他元件頁暫不變。
- **checkbox 統一**：全站原生 checkbox（控制面板、篩選清單、表單）改成與元件 `.cbx` 標準尺寸同外觀（20px、1.5px 外框、`--r-sm`）；勾與半選符號改成 bold 粗細，元件內的勾也一起加粗。
- **遮罩統一成 `--s-scrim` token**：modal、drawer、搜尋、確認框、App Shell、手機側欄共用；淺色 40%、深色 62%，兩種主題看起來的壓暗程度一致（原本深色遮罩偏淺，部分用 `--ink` 混色在深色下反而變亮）。

## 2026-11-04（四）　Slider 新增填充式樣式；首頁試玩改用填充滑桿與色號欄；側邊欄拿掉 icon

- **Slider 新增 `variant` 軸：`track`（軌道，原版）／`fill`（填充）**。填充式沿用偏好設定的磨砂程度滑桿：整條就是控制項，標籤在左、數值在右、填色代表目前值，點或拖任何位置都能調，鍵盤操作同軌道版；單值與區間都支援，尺寸 s＝32px、m＝40px。握把只在滑過、聚焦、拖曳時出現，避免壓到標籤。組合數 16 → 32。
- **首頁 Token 試玩**：所有滑桿改用填充式；主色、輔助色、底色染色從色票改成「色號預覽＋色號輸入欄」（取用開新專案流程同款的色彩欄位）。輸入格式錯誤時欄位轉紅框；清空＝回到預設（底色染色清空＝不染色）。
- **側邊欄**：拿掉各項目前方的線框 icon。

## 2026-11-04（三）　牌卡與卡片容器圓角統一走 `--radius`

- 新牌卡（person／profile／metric／invite／widget-card）的圓角預設改綁共用的 `--radius`（＝`--r-sm`，與 card、product-card、article-card、category-tile、chart 卡同一個），之後改 `--radius` 全部一起變。
- 首頁玩玩看：預覽裡的表單卡原本用 `--r-lg`（10px）和其他卡片不一致，改為 `--radius`；「圓角」滑桿改成調「元件圓角（--radius）」，預設 4px、範圍 0–16px，等比例帶動其他 `--r-*`；預覽外框與操作面板圓角收為 `--r-md`。

## 2026-11-04（二）　磨砂時浮層不再透出背後內容

- 磨砂偏好會把 `--panel` 系列換成半透明，原本連彈窗（開始新專案、對話框）、下拉、選單、浮出卡、搜尋面板也一起變透明、且沒有模糊，背後的字直接透出來。浮層改為只淡淡透一點（磨砂 100% 時約 86% 不透明）並加強背景模糊（16＋24×磨砂 px），浮層內的標題列、內容區、底部列不再各自疊半透明底。

## 2026-11-04（一）　移除 Typography、牌卡圓角統一、Modal 次按鈕一致、token 收尾

- **移除 Typography 文字元件**（頁面、DIAL_SPECS、registry、搜尋別名）；文字樣式仍由 Design Token 的 h1–h12 text style 管理。
- **新牌卡圓角改用舊牌卡的值**：person／profile／metric／invite／widget-card 外框由 `--r-lg`／`--r-xl` 改為 `--r-sm`（與 card、product-card、category-tile、article-card 一致），內層照片、分享區塊、通知改 `--r-xs`，對話泡泡 `--r-sm`；TOKEN_SLOTS 預設同步。
- **Modal（popup）底部次按鈕**原本用 outline **primary**（深色外框），和全站「次動作＝outline secondary」不一致，改為 `v-outline i-secondary`。
- 圖表／牌卡剩下的寫死值改綁 token：小尺寸座標字級 → `--fs-h12`、人物卡照片漸層 → `--c-neutral-900` 混色、在線呼吸動畫 → `--dur-slow` 倍數；舊 Card 內距 → `--crd-pad`（預設 `--sp-4`）。
- registry 70 ready＋6 planned；需求匯總 1138 個變體。

## 2026-11-03（十七）　首頁第三輪：玩玩看左右版面＋更多選項、元件牆不縮放、會動的卡片與圖表加快

- **玩玩看**：左側固定的操作面板（約 320px，手機收合為「更多選項」）＋右側預覽。選項：主色／副色（色票＋自訂）、底色染色與強度、預覽單獨切深淺、圓角（0–24px，等比例套到所有 `--r-*`）、外框粗細、陰影層級、字體（Geist／系統黑體／明體）、字重、字級比例、間距密度、動態速度（`--dur-*` 倍率）。即時列出改了哪些 token，可重設、可「複製 CSS 變數」。預覽精簡為 4 個元件（表單＋按鈕、profile-card、堆疊面積圖、metric-card）；只寫在預覽容器，不動 `:root`。
- **元件牆**：拿掉格子下的名稱與說明；元件用原尺寸、不縮放（放不下就裁切）；卡片類只留 metric-card，其餘換成日期選擇、下拉選單、指令面板、通知、標籤、分頁籤、頭像群組、儀表、滑桿、評分、進度、步驟、分頁、表格工具列。滑過格子時游標旁跟著「查看 ○○ →」的按鈕樣式標籤（只在滑鼠／筆，觸控不顯示；鍵盤聚焦時顯示在格內）。
- **會動的卡片與圖表**：拿掉說明文字；每 1.2–2 秒換一次狀態、各卡錯開，動態加量（十字準線掃過、長條重排、儀表擺針、頭像散開等）；離開畫面／滑過／聚焦／切分頁暫停，減少動態時不自動播放。

## 2026-11-03（十六）　側欄圖示改用 Phosphor

- 側欄、需求匯總分類、上手指南按鈕與上手指南裡的仿側欄示意，原本用 emoji，改成 Phosphor regular 線條圖示（16px、`--muted`，滑過或目前頁轉 `--ink`）：首頁 house-simple、Design Token palette、Design Guideline ruler、需求匯總 clipboard-text、上手指南 book-open-text、General shapes、Layout layout、Navigation compass、Form textbox、Feedback & Overlay chat-circle-dots、Data Display rows、Card cards、Table & Chart chart-bar、版本紀錄 clock-counter-clockwise、偏好設定 gear-six。NAV 每組新增 `ic` 欄位（emoji 欄位保留供舊資料相容）。

## 2026-11-03（十五）　首頁改版：hero 版型、牌卡圖表試玩、瀑布流元件牆、會動的卡片與圖表

- **Hero**：參考 designsystems.surf 的結構（不沿用品牌與文案）——靠左大標、最後一個詞輪流打字（換主色／改圓角／調字重／變密度，減少動態時靜止）、CTA 在左、說明在右，下方細線＋各分類元件數。「新」標籤連到 person-card。
- **玩玩看**：hero 下方的大視窗，內容換成真的 person-card、metric-card、profile-card、widget-card 與 area-stack／heatmap 圖表（瀑布排列，手機只顯示 3 張）；工具列的主色／圓角／字重／密度只改 hero 範圍內的變數，不寫 `:root`，附重設。
- **01 元件牆**：改成 15 格精選的瀑布流（四種尺寸、無空格），捲動時依序浮現（未觸發時仍保持 40% 可見）、滑過微浮起；拿掉篩選 chip，底部「瀏覽元件」→ Button 頁。
- **02 會動的卡片與圖表（新段落）**：趨勢小圖卡換區間、追蹤切換、排名重排、週次輪播、儀表換門市、加入成員切換、待辦切換、motion token 示意；離開畫面、滑過、聚焦或切到別的分頁時暫停，有全域暫停鈕，減少動態時不自動播放。
- 拿掉「動手試試」；四步／Token 與 Figma／最新更新與 FAQ 保留（編號 03～05）。

## 2026-11-03（十四）　開新專案改成大 popup、表單改用元件庫元件、Dropdown 外點收合

- **開始新專案改在一個大 Modal 內完成**（取用 Modal 元件的開合動態）：960px、最高 90vh，標題列＋步驟條與「上一步／下一步」固定，只有內容捲動；手機為全螢幕。`#start` 會在目前頁面上開啟，× 與 Esc 關閉並保留草稿，點遮罩不會丟失內容；首頁按鈕、搜尋、右下角「回到流程」都會開它；焦點鎖在視窗內、關閉後回到原按鈕。
- **表單全部改用元件庫元件**：Field（label／hint／錯誤）、Dropdown、Segmented、Tag、Dropzone、textarea；兩欄 label、控制項、提示對齊，控制項一律 36px 高，間距走 `--sp-*`。第一步的「上一步」用 disabled 樣式。
- **Dropdown 元件修正（全站）**：原本只能點觸發器才收合；改為展開時監聽外點、Esc、焦點離開，關閉後移除監聽。觸發器可聚焦（combobox／listbox、aria-expanded），↑↓ Home End 移動、Enter 選取、Esc 回到觸發器。
- **topbar 在 1024／768px 不再橫向超出**：1199px 以下藏起頂部的「此為母元件庫…」（側欄底部仍有），899px 以下搜尋框縮成圖示。

## 2026-11-03（十三）　metric-card 長條圓角對齊 chart

- chart 的 line／curve／bar 原本寫死 300／340／380px 寬，現在和進階 9 型一樣依容器寬度重畫（ResizeObserver；viewBox 寬＝實際像素，文字與線條不被拉伸），互動預覽、Dashboard 示意、矩陣格都會跟著伸縮。

- metric-card 的週長條／每日長條原本用 `rx:6`／`rx:1.2` 四角圓，和 chart 元件不一致；改用 chart 同一支 `chtxBarTop`＋`--r-xs`（只有頂端圓角、底部貼齊基準線）。折線版的重點欄底色也改用 `--r-xs`。

## 2026-11-03（十二）　Card 新增 5 種牌卡（牌卡提案第二版進庫）

- **person-card 照片人物卡**：`state`（default／added）× `size`（m／s）＝4；boolean `tags`（照片左上的磨砂標籤）。加入成員 → 已加入。
- **profile-card 品牌檔案卡**：`cover`（graphic／image／color）× `state`（default／following）＝6；boolean `verified`。追蹤者數字逐位滾動（顯示完整數字，+1 才看得出變化）。
- **metric-card 指標週卡**：`chart`（daily-bar／weekly-bar／line）× `tone`（brand／info／success／violet）＝12；點週次切換、平均值滾動，平均線數值滑過才出現；附 Walking／Active calories／Sleep／Weight 範例。
- **invite-card 邀請協作卡**：`layout`（card／modal）× `members`（empty／list）＝4；email 驗證（錯誤輕晃）、新成員滑入標 Invited、權限選單（取用 action-menu 項目，↑↓／Enter／Esc）、複製連結、全部移除後顯示 empty。
- **widget-card 小工具卡**：`kind`（message／todo／group／welcome／date）＝5；附參考圖版面的 Bento 組合。
- 原子擴充：`avtEl` 可帶自訂照片（`o.src`）；Tag 新增 `.tg-frost`（壓在照片上的磨砂標籤）。新增 Phosphor icon：caret-right、link、seal-check（fill）、person-simple-walk、fire、gauge、chat-centered-text。
- 示範照片：原檔在 `library/assets/photos/`，頁面內以壓縮 data URI 嵌入（約 51KB）。
- 元件內容維持提案的英文；registry 重生 71 ready＋6 planned；需求匯總 1150 個變體；首頁元件牆多 5 格。
- ✅ Playwright：5 頁段落順序、矩陣、互動、深淺、390px；全站 84 頁無空頁、0 console error。

## 2026-11-03（十一）　Chart 新增 9 種圖型（提案定案 → 進庫）

- **chart variant 擴充為 14 種 × m／s＝28**：原有 stat／line／curve／bar／donut，新增 spark（趨勢小圖卡）、brush（刷選縮放折線）、area-stack（堆疊面積）、bar-stack（堆疊長條）、combo（長條＋折線，預設上下分開、可切雙軸）、bar-rank（橫向排名）、gauge（儀表）、funnel（漏斗）、heatmap（熱力圖）。頁面依「基礎／趨勢／組成／比較／進度與分布」分組顯示，DIAL_SPECS 仍是唯一來源。
- 互動沿用提案：跟著游標的十字準線提示、圖例開關（其他層補位）、hover 淡化、區間切換變形、方向鍵逐點查看、數字逐位滾動、排名 FLIP 重排、刷選拖曳／把手／鍵盤縮放；reduced-motion 直接到終點。
- **新 token**：primitive `--c-violet-100…900`；semantic `--s-chart-2`（info）、`--s-chart-3`（success）、`--s-chart-4`（violet），熱力圖色階 `--s-chart-seq-0…5`（brand2）；深淺各自定義，Design Token 頁與 `tokens.base.json` 同步。系列 1 仍是 chart 的 `--accent`（brand2）。門檻與流失只用 feedback token。圓角改用元件庫 token（提案頁的圓角過大已修正）。
- registry 重生（chart 軸 +9）；需求匯總 1101 → 1119 個變體。
- ✅ Playwright：28 格矩陣、9 種互動、深淺、390px；全站 79 頁、0 console error。

## 2026-11-03（十）　新首頁、磨砂滑桿互動

- **新首頁（`#home`，無網址時的預設頁；上手指南仍在 `#guide`）**：
  - Hero：「調一次 token，整套元件一起變。」＋ token 試玩區（主色色票／自訂、圓角、字重、密度），只改 hero 範圍內的變數，旁邊一格格真實元件（按鈕、toggle、slider、segmented、欄位、tag、alert、avatar、progress、圖表）即時換樣式；CTA「開始新專案」→ `#start`、「瀏覽元件」。
  - 01 元件牆：66 顆已定案元件的迷你即時預覽（取用各元件工廠函式），依 8 組分類篩選，點了進元件頁。
  - 02 四步開一個新專案、03 動手試試（輪播、評分、可滑掉的通知）、04 Token 與 Figma 同步（三層 token、四類差異、Local Variables 示意）、05 最新更新（讀更新紀錄）＋常見問題（取用 Collapse）。
  - 側欄最上方加「首頁」，logo 點擊回首頁；搜尋可找到「首頁」。
- **磨砂滑桿**：填色加深、看得到目前值；整條游標改為 pointer；握把滑過時放大（3×14 → 4×20px），拖曳時再拉長到 24px（spring）。

## 2026-11-03（九）　專案流程原型（#start）、磨砂滑桿改版

- **開始新專案（`#start`，無 AI 原型）**：六步精靈——① 專案基本資料（品牌、專案名稱自動 `<品牌>-YYYYMMDD`、產業、平台、Figma 檔）② 匯入資料（取用 Dropzone，檔案只留在記憶體；貼文字／網址）③ 品牌問卷（精簡 Phase 0；沒有主色不能往下）④ 提案（依答案產生 token 與元件建議並附理由，「套用到網站」走 Design Token 頁同一條 `applyTokOverrides`，元件預選進需求匯總）⑤ 調整（跳到 Token／需求匯總／Guideline，其他頁右下角顯示「專案進行中 · 回到流程」）⑥ 匯出（opening-interview.md、proposal.json、tokens／components／selection、README，可逐檔或全部下載；匯出前規則檢查：主色對比、元件數）。三處標示「AI 之後接上」並有固定規則的替代做法。草稿存在這台裝置，可中斷後續作。搜尋可找到「開始新專案」。
- **磨砂滑桿改版**（參考 React Bits 參數面板）：控制區收窄到 340px；滑桿改成整條可拖的填充式控制（標籤在左、數值在右、填色＝目前值、邊緣握把、刻度），底下仍是原生 range（鍵盤 ←→、螢幕閱讀器照常）；快速值改用 Segmented 原子（關閉／輕／中／重，自訂值時都不選）。

## 2026-11-03（八）　磨砂偏好、topbar 深淺色切換、全站模糊搜尋

- **磨砂材質（偏好設定）**：0～100 滑桿＋關閉／輕／中／重快速值，預設 0（與原本完全相同）。往上調時全站背景透出依 `--accent2` 等 token 生成的漸層，網站外框（頁底、topbar、側欄、規格／篩選／互動預覽／矩陣面板）變半透明＋背景模糊。只是看站的偏好：元件預覽區（矩陣格、互動預覽舞台、內容示範列）把 surface token 釘回實心值，元件外觀與匯出結果一致。存 localStorage `ds-frost`。
- **深淺色切換移回 topbar 右上角**：預設淺色，拿掉「跟隨系統」（舊的 system 設定視為淺色）；偏好設定頁移除主題區塊。切換鈕為 `role=switch`，太陽／月亮圖示。
- **全站搜尋**：topbar 搜尋框，或按 ⌘K／Ctrl+K、`/` 開啟；面板取用 Command 元件。搜尋元件（含規劃中，會標示）、頁面、token（例如 `--sp-4`，選了會跳到 Token 頁並亮出那一列）。模糊比對：子字串 → 依序出現的字母（`dtpk` → Date Picker）→ 4 字以上容許錯字（`buton` → Button）；中英文名稱、id 與常用別名（「彈窗」→ Modal、「上傳」→ Dropzone）都能搜，命中字標色。沒輸入時顯示最近搜尋與常用頁面。手機為全螢幕面板。
- **Command 元件**同步改用同一套模糊比對。
- **搜尋細修**：觸發框快捷鍵改成單一鍵帽（⌘K／Ctrl K）靠右；無結果的空狀態置中；「最近搜尋」右側加「清除紀錄」；群組標題、說明與提示列字級不低於 14px；拿掉元件右側的分類備注（token 仍顯示目前數值）；注音／中文輸入法組字時不搜尋，選字完成才搜。
- ✅ Playwright：預設淺色、切換持久化、搜尋 7 組關鍵字結果、Enter 換頁、token 跳轉亮列、磨砂 60% 時 topbar backdrop-filter 生效且矩陣格／預覽舞台維持實心白、390px 無橫向捲動；全站 78 頁無空頁、0 console error。

## 2026-11-03（七）　P2 元件全部完成（17 顆，規劃中 → 完成）

每顆都有變數篩選、矩陣、「什麼時候用」、互動預覽與程式碼；內部一律取用既有原子（鐵則 5）。
- **第一批**
  - **Button Group**（General）：`variant`（outline／soft／split）× `size`＝9；取用 Button，相鄰圓角歸零、外框重疊；icon／icon-only／toggle。
  - **Typography**（General）：`kind`（heading／body／caption／code）× `tone`＝12；level 直接套 `.ty-h1～h12` text style；truncate。
  - **Link**（General）：`variant`（inline／standalone）× `state`＝10；半透明底線 hover 轉實色、箭頭前推、external 圖示。
  - **Kbd**（General）：`variant` × `size`＝4；mac／win 符號切換；按鍵測試區按下時鍵帽壓平。
  - **Divider**（General）：`orientation` × `variant`（solid／dashed／strong）＝6；可帶文字。
  - **Descriptions**（Data Display）：`layout` × `columns`＝6；dl／dt／dd 語意結構，狀態取用 Tag，可複製，手機自動單欄。
- **第二批**
  - **Splitter**（Layout）：`orientation` × `handle`（line／grip）＝4；拖曳（20%～80%）、方向鍵（Shift 一次 10%）、Home／End、雙擊／Enter 還原（有過渡）；`role=separator`＋aria-value*。
  - **Scroll Area**（Layout）：`orientation` × `scrollbar`（always／hover）＝4；細捲軸、邊緣漸層提示「還有內容」；內容取用 list-item。
  - **Number Input**（Form）：`variant`（stacked／plain）× `state`＝8；取用 field 外框；↑↓（Shift ×10）、Home／End、超出範圍即時標紅、離開時夾回並輕晃；`role=spinbutton`。
  - **Rating**（Data Display）：`size` × `state`（default／readonly／disabled）＝9；半顆星、hover 預覽、點選 spring 彈一下、再點同分清除、鍵盤調整；星色綁 `--warn`。
  - **Carousel**（Data Display）：`arrows`（inside／outside）× `indicator`（dots／number）＝4；箭頭取用 Button；拖曳跟手（超過 20% 或甩得夠快換頁）、loop／autoplay（滑過或聚焦暫停）、方向鍵。
  - **Hover Card**（Feedback & Overlay）：`placement` × `size`＝12；卡片與浮層定位沿用 popover，內容取用 avatar／button；`--dur-hover-delay` 後才出現、離開有 150ms 緩衝可移進卡片、Tab 聚焦也會開、Esc 關閉。
- **第三批**
  - **Context Menu**（Navigation）：`variant`（default／with-icon／with-shortcut）× `size`＝9；面板取用 action-menu、快捷鍵取用 kbd；從游標位置展開、靠邊自動反向並換展開原點；Shift＋F10、↑↓、Enter、Esc（焦點回原區塊）。
  - **Command**（Navigation）：`state`（default／results／empty）× `size`＝6；搜的是元件庫自己的側欄清單，命中字標色、無結果取用 empty；↑↓／Enter／Esc，⌘K 重新開啟；combobox＋aria-activedescendant。
  - **Date Picker**（Form）：`variant`（single／range）× `state`＝10；欄位取用 field、浮層沿用 popover、內容直接取用 calendar（`calMonthEl` 新增 `onPick` 回呼與 `selY／selM`）；開啟時焦點跳到今天，Esc／點外面關閉。
  - **Dropzone**（Form）：`state`（default／dragover／uploading／done／error）× `size`＝10；進度取用 progress、移除取用 button；真的可拖曳／選檔，超過 10 MB 直接標錯；附「加入範例檔」模擬上傳。
  - **Table Toolbar**（Table & Chart）：`mode`（default／filtered／bulk）× `size`＝6；搜尋取用 field、篩選 chip 取用 tag；搜尋與篩選即時套用到下方 table，勾選列切換成批次操作（匯出／刪除／取消選取）。
- TOKEN_SLOTS：descriptions、splitter、scroll-area、carousel、command、dropzone、table-toolbar 補綁定槽。
- registry 重生：66 ready＋6 planned（P2 清空，剩 P3）；需求匯總 66 顆、1101 個變體。
- ✅ Playwright：17 頁段落順序、互動（splitter 鍵盤／拖曳／還原、number-input 夾值、rating 點選與鍵盤、carousel 箭頭／拖曳換頁、hover-card 延遲與緩衝、context-menu 右鍵靠邊反向與鍵盤、command 篩選與選取、date-picker 選日回填、dropzone 進度／錯誤／移除、table-toolbar 篩選→批次刪除）、深淺截圖；全站 78 頁無空頁、390px 無橫向捲動、0 console error。

## 2026-11-03（六）　頭像改取用 Avatar 原子、站上 .seg 改用 Segmented 規格、群組 hover 調整

- **Avatar 群組 hover**：滑過只往上位移 2px，拿掉 `z-index`，疊放順序不變。
- **頭像改取用 Avatar 原子**（鐵則 5）：Header 帳號鈕（原本是 soft 按鈕寫字「楊」→ button 包 `avtEl` s 28px，保留按壓縮放與 focus 外框）；Article Card 作者（原本拿 image 原子縮到 24px → `avtEl` s 縮寫，依作者名固定底色，疊字版保留白色外圈）；Skeleton→內容示範（`--avt-s:40px` 對齊骨架 m 圓，轉場不跳位）。移除未使用的 `.lst-avatar`。Guide 頁模擬 GitHub 畫面的小頭像屬插圖，不動。
- **站上所有 `.seg` 改用 Segmented 規格**（互動預覽控制列、程式碼 HTML／SCSS 分頁、展開視窗分頁、圖表切換等）：柔色軌道＋`--sgm-radius`、滑動指示器改 `--accent`＋選中字 `--primary-on`（與 tab pill／Segmented 一致，深淺自動對比）、字體改 sans medium、motion token。結構與 aria-pressed 切換邏輯不變（全域 MutationObserver 照舊）。新增方向鍵切換；重建型控制列（如 button 頁）切換後以 `data-seg` 找回新列，焦點不遺失。
- ✅ Playwright：.seg 深淺計算色（軌道／指示器／選中字）、方向鍵切換與焦點保留、群組 hover translate 0 -2px＋z-index auto、Header／Article／Skeleton 頭像皆為 .avt 且舊 image 頭像 0、全站 78 頁無空頁、0 console error。

## 2026-11-03（五）　P1 元件全部完成：Avatar、Segmented、Slider、Field、Stack、App Shell、Empty

依差距分析 P1 清單一次補齊 7 顆（規劃中 → 完成），每顆都有變數篩選、矩陣、內容軸、「什麼時候用」、互動預覽與程式碼。
- **Avatar 頭像**（General）：`size`（xs 20～xl 64）× `shape`（circle／rounded）× `content`（image／initials／icon）＝30；在線狀態點（online／away／busy／offline，外圈 --panel 描邊）、群組疊放＋N。照片用內嵌 SVG（不依賴網路）。
- **Segmented 分段控制**（Form）：`variant`（soft／outline）× `size`（s／m）＝4；單一滑動指示器，選中＝`--accent`＋`--primary-on`（與 tab pill 同一套）；`role=radiogroup`、方向鍵切換、roving tabindex；ResizeObserver 在字型載入後重新量測。
- **Slider 滑桿**（Form）：`type`（single／range）× `size` × `state`＝16；拖曳（pointer capture）、點軌道跳值（只有這時才用 --ease-out 過渡）、鍵盤（方向鍵／PageUp／PageDown／Home／End）、`role=slider` 與 aria-value*；區間兩端不交叉；拖曳時顯示數值提示。
- **Field 表單欄位**（Form）：`layout`（vertical／horizontal）× `state`（default／filled／error／disabled）＝8；label＋控制項（取用 input 原子）＋提示／錯誤（帶圖示，不只靠紅色）＋字數；互動預覽是完整表單：送出驗證、錯誤摘要（取用 alert，可點欄位名跳過去）、焦點移到第一個錯誤欄、修正即時清除、成功提示；aria-invalid／aria-describedby。
- **Stack 版面排列**（Layout）：`direction`（Stack／Inline／Grid）× `gap`（sp-2～sp-5）＝12；gap 只接受 --sp-* token，align／justify／wrap；附「對應 Figma auto layout」對照。
- **App Shell 應用程式框架**（Layout）：`layout`（side／top／side-top）× `device`（desktop／mobile）＝6；內部取用 menu／avatar／button 原子（鐵則 5）；電腦版側欄收合（寬度動畫、只留圖示）、行動版抽屜＋遮罩。
- **Empty 空狀態**（Feedback & Overlay）：`kind`（first／search／error／permission）× `size`（s 卡片內／m 整頁）＝8；icon／title／description／主次動作；內容逐行淡入；附放在列表裡的情境示範。
- TOKEN_SLOTS：avatar、segmented、field、app-shell、empty 各補綁定槽；slider／stack 以 token 本身為軸，不另設。
- registry 重生：49 ready＋23 planned（P1 清空，剩 P2／P3）；需求匯總 49 顆。
- ✅ Playwright：7 頁段落順序與矩陣格數（30／4／16／8／12／6／8）、Segmented 指示器位移與鍵盤、Slider 拖曳／鍵盤／不交叉、Field 送出 3 錯→修正→成功、Stack 程式碼 var(--sp-3)、App Shell 收合 58px／行動版抽屜開關、深淺截圖，0 console error。

## 2026-11-03（四）　新增 Alert 提示橫幅、Popover 氣泡卡（P1，規劃中 → 完成）

依差距分析優先處理「文件已在引用、元件卻不存在」的兩顆。
- **Alert 提示橫幅**（Feedback & Overlay）：頁內常駐、不自動消失的提示。`variant`（soft／outline／accent 左側色條）× `intent`（info／success／warning／error）＝12；內容 boolean：icon／title／description／action／close。意圖色綁 `--s-feedback-*`（不沿用 notification 寫死的 hex），深淺自動切換。關閉＝淡出後高度收合（示意 1 秒後復原）。附「什麼時候用」與 notification／modal 分工。TOKEN_SLOTS：radius／pad／gap／title-fs。
- **Popover 氣泡卡**（Feedback & Overlay）：點擊觸發、可放互動內容的浮層。`placement`（bottom／top／left／right）× `size`（s 220／m 280／l 340）＝12；內容 boolean：arrow／header／close／footer。內容取用既有原子（selector 的 `.cbx`、`mkBtn`，鐵則 5）。互動：從 trigger 方向縮放展開；點外面、Esc、×、套用皆關閉；開啟 focus 進 popover、關閉 focus 回 trigger；`aria-haspopup`／`aria-expanded`／`role=dialog`。定位用獨立 `translate`、動畫用 `transform`，互不覆蓋。TOKEN_SLOTS 同上。
- **文件引用改為連結**：tooltip 頁「改用 popover」、loader 頁「那是 alert 的事」改為可點連結；新頁 lede 也互相連到 tooltip／modal／notification。
- registry 重生：42 ready＋30 planned；alert `l0Ref: alert`，popover 無同名 L0。
- ✅ Playwright：兩頁段落順序、矩陣各 12 格、綁定槽各 4、Alert 關閉收合與復原、深淺意圖色跟隨 token、Popover 外點／Esc／套用關閉與焦點回收、右側 placement 位置與 transform-origin；全站 78 頁無空頁、需求匯總 42 顆、0 console error。

## 2026-11-03（三）　分類重整為 8 組＋32 顆規劃中元件＋toggle 升格

- **分類**：側欄與 registry 由 Basic／Complex／Card／Table & Chart 4 組，改為依用途的 8 組：General 基礎、Layout 版面、Navigation 導覽、Form 表單、Feedback & Overlay 回饋與浮層、Data Display 資料展示、Card 卡片、Table & Chart 表格圖表。**元件 id 全部不變**，sync 腳本只認 id 不受影響。
- **規劃中元件 32 顆**：依「7 套元件庫差距分析」以 `st:'planned'` 列入 NAV（附優先級 P1–P3 與理由）。側欄字色淡＋優先級 pill，群組數字顯示「已完成／全部」；點進去顯示佔位頁。不會進需求匯總與匯出。
- **toggle 升格**：從 tab 頁拆出為獨立元件頁 `buildToggle`（變數篩選＋狀態矩陣＋互動預覽），補 `DIAL_SPECS.toggle`，進需求匯總（40 顆）。tab 頁留一行指引。
- **registry**：`library/tools/build-registry.js` 改為相對 repo 路徑（原本寫死本機絕對路徑）、logo／selector 依 id 查找（不依群組名）、輸出 planned 的 `priority`／`note`、`meta.counts` 加 ready／planned；L0 比對改為只認 `- id:` 條目。重生 `component-registry.json`（v0.2.0，72 項＝40 ready＋32 planned），既有 39 項內容逐欄比對無變動。`REGISTRY-NOTES.md` 同步。
- ✅ Playwright：78 頁逐一開啟無空頁、8 組與 32 顆規劃中正確、toggle 頁段落順序、需求匯總 8 組／40 顆、0 console error、390px 無橫捲。

## 2026-11-03（二）　Motion v1 第二、三批＋Button 按壓

- **Button 按壓**：靜態 pressed 與 live :active 由下移 1px 改為 `scale(.97)`。
- **浮層**：Dropdown（從觸發框縮放展開、收合更快；全站 ddField 共用）、Action Menu（常駐掛載、從觸發鈕角落展開、項目依序淡入、程式碼區同步）、Modal（進場加大、關閉先播退場再移除）、Drawer（開減速／關加速；可拖曳關閉、反向阻尼、拖不夠遠 spring 彈回）、Toast（從上方落入不回彈、關閉加速淡出、可往右滑掉）、Menu（單一 hover 指示器跟著滑動）。
- **內容**：文字滾換（程式碼面板等 4 處「已複製」）、圖示交叉替換（密碼眼睛）、Skeleton→內容（組合卡片加「模擬載入完成」）、Tag／多選 chip 移除縮小淡出、Step（連接線填滿→節點變色打勾→下一步微彈）、Progress（減速到達、不加閃光）、Chart（長條依序長出、hover 其餘淡化、折線描繪）、Tree view（高度展開收合）、Breadcrumb（「…」可點擊展開）、List（新增 removable：刪除淡出後收合、新增淡入；巢狀子列高度展開）、List Item（尾端動作鈕 hover／focus 才滑入）、Table（排序 FLIP 重排）、Floating Line（出現時從下方彈上，用獨立 translate 保留置中）、Schedule（排程條 clip-path 揭開不壓扁文字、逐列接續、hover 浮起）。
- **不採用**：數字切換、Input 聚焦、Pagination 指示器、Calendar 換月、Header 捲動收合、Button 光澤掃過。
- 共用 helper：`afterAnim`、`afterTransition`、`swapText`、`swapIcon`、`slideToggle`、`flipFirst/flipPlay`；全部尊重 `prefers-reduced-motion`。
- ✅ Playwright：逐項驗證（Drawer 小拖彈回／大拖關閉、Toast 滑掉後復原、Table 排序 2/5 列移動、List 收合時間軸 124→12→0px、Chart hover 12/21 淡化等），0 console error。

## 2026-11-03　Motion v1：元件動態對照採用項（第一批）

依「元件動態對照」頁的評審結果，第一批套用 CSS 為主的項目；只作用在 `.live` 互動 demo，矩陣靜態格不變。時長／曲線一律取 motion token。
- **Token**：`--ease-out` 改 `cubic-bezier(.22,1,.36,1)`、`--ease-in` 改 `cubic-bezier(.55,0,1,.45)`（框架原值 `0,0,.2,1`／`.4,0,1,1`，兩者原本無元件引用）；新增 `--dur-hover-delay:250ms`；Token 頁 Motion 群組補上這三列。
- **Button**：outline／soft／text 的 hover 底色由左掃入（`::before` scaleX）；有右側 icon（`mkBtn` 的 `trail`，新增 `.has-trail`）時箭頭前推 3px。不採用光澤掃過。
- **Toggle**：圓鈕 `--ease-spring` 到位、按住拉長、底色稍慢跟上。
- **Checkbox／Radio**：勾勾由左往右揭開（實心 icon，改用 clip-path 而非描邊動畫）；單選點改 transform scale 彈出（原本動 width／height）；按下微縮。
- **Tooltip**：停留 `--dur-hover-delay` 才出現、從箭頭方向微放大；離開立刻以 `--ease-in` 收；鍵盤 focus 也會顯示。
- **Card 家族**（card／product-card／article-card／category-tile）：hover 統一上浮 2px（原本 3px／無）、按下壓回 scale .985（內部按鈕按下時不觸發）、封面圖慢速放大；category-tile 圖示 spring 微浮。
- **Image**：圖片 `load` 後加 `.is-loaded`，由模糊、微放大轉清晰。
- 全部尊重 `prefers-reduced-motion`。
- ✅ Playwright：填色掃入、toggle 按壓拉長與切換、勾勾動畫、tooltip 延遲（120ms 未顯示／620ms 已顯示）、商品卡上浮 2px、圖片 blur-up（本機 data URI 驗證；Unsplash 圖在測試環境無網路）、Token 頁三列，0 console error。

## 2026-11-02（四）　Toggle 開啟態改用模式對比色＋互動預覽程式碼同步

- **症狀**：深色模式開啟態＝`--accent`（亮灰）軌道＋寫死 `#fff` 圓鈕，白鈕糊在亮軌上；淺色則是黑軌白鈕。兩模式邏輯不一致。
- **修正**：開啟態圓鈕改 `--primary-on`（同 checkbox 勾、tab 選中的模式對比色）→ 淺＝黑軌白鈕、深＝亮軌深鈕；關閉態圓鈕 `#fff` 改綁 `--c-neutral-0`。
- **程式碼同步**：Toggle 互動預覽點擊後只改 DOM、程式碼區仍顯示初始 `class="switch"`／「關閉」。`mountLive` 的 `cfg.render(state, sync)` 新增第二參數 `sync`，預覽內自行改 DOM 後呼叫即同步程式碼區（不重建節點，保留切換動態）；toggle 已接上。
- ✅ Playwright：深淺 × 開關四態計算色正確、點擊後程式碼區同步為 `switch on`／開啟，0 console error。

## 2026-11-02（三）　Tab pill 改回單一 token 做法＋變數與 Token 左右並排

- **Tab pill 修正上一版**：上一版在淺色加了白片＋描邊＋陰影、深色另寫 `[data-theme=dark]` 覆寫，兩模式做法不一致。改為與 line／contained 同一套：選中＝`--accent` 底＋`--primary-on` 字，深淺由 token 自動切換；移除 `--pill-*` 元件變數、主題覆寫、描邊與陰影。軌道回 `--panel-2`。count badge 選中態沿用 contained 規則。
- **變數與 Token 段落**：變數篩選器（左）＋ Token 綁定（右）改 grid 左右並排；只有一張卡（selector／icon 無綁定槽）時佔滿整列；≤1023px 改回上下。
- ✅ Playwright：深淺截圖確認 pill 選中態、段落並排，0 console error。

## 2026-11-02（二）　Tab pill 選中態加強＋元件頁段落統一順序

- **Tab pill 選中態**：原本選中片＝`--panel`、軌道＝`--panel-2`，明度幾乎相同（深色甚至片比軌道暗）→ 兩種主題都看不出選中。改為元件內變數 `--pill-track／--pill-ind／--pill-ind-edge`：淺色＝白片浮在 `--panel-3` 灰軌、深色＝`--i-sec-fill-p` 亮片浮在 `--panel-2` 暗軌；皆加 `--line-strong` 描邊＋`--e-md` 陰影、選中字改 `--ink`。靜態 `.st-active` 與滑動 `.tab-ind` 同步。
- **段落順序**：新增 `reorderSections(view)`，在 `renderView` 渲染後集中重排為「互動預覽與程式碼 → 變數與 Token → 矩陣 → 其餘（維持原相對順序）」，取代原本 button／BUILD 兩處各自的 `vt.after(liveSec)`。只搬主要那一段，子元件段落（如 tab 頁的 Toggle 互動預覽）留在原位。
- ✅ Playwright：39 頁逐一確認順序（logo 無段落略過）、0 console error；pill 深淺截圖確認。

## 2026-11-02　元件接上字重／行高／陰影／動態 token（修「Token 頁調了元件不會變」）

- **症狀**：同事試用回報部分元件樣式調不動。稽核發現 Token 頁可編輯的 Font Weight／Line Height／Elevation／Motion 四類，元件 CSS 引用數皆為 **0**——值全寫死，調 token 無效。
- **修正**（僅元件 CSS：`.btn` 區＋input → calendar 區段，網站外殼 UI 不動）：
  - 字重 88 處：`500/600/700` → `var(--fw-medium/semibold/bold)`（值相同，零視覺差）
  - 行高 41 處：依最近值對映 `--lh-tight/snug/normal/relaxed`；`line-height:1`（單行置中結構用）保留
  - 陰影 35 處：依 blur 對映 `--e-sm`（≤4）／`--e-md`（≤14）／`--e-lg`（≤28）／`--e-xl`；focus ring、inset 底線保留。附帶：深色模式自動吃加深版陰影
  - 動態 84 處：`≤.2s` → `--dur-fast`、`.22–.35s` → `--dur-default`；`.06s` 按壓微動保留
- ✅ Playwright：改 `--fw-semibold`／`--dur-fast`／`--e-*` 後 button、notification 計算值即時跟隨，0 console error。
- 待辦（稽核其餘項）：元件尺寸 token（按鈕／輸入高度）、零星寫死字級與顏色、擴充元件 Token 綁定槽。

## 2026-07-17（二十二）　甘特直欄格線捲動消失＝絕對層丟格：改 in-flow cell 根治

- **症狀**：甘特右滑後內文的直欄格線消失（表頭的線正常）。決定性線索：表頭線畫在 in-flow 的 `.gnt-g-hcell`（不掉），內文線畫在 `.gnt-g-bg`（`position:absolute` 背景層）→ **絕對定位層的 1px 線在橫向捲動時被 GPU 合成器丟格**（同層的實色週末底不會掉，所以灰底還在、線沒了）。
- **根治**：廢除絕對背景層 `.gnt-g-bg`／`.gnt-g-col`，改由**每列 `.gnt-g-row`(display:flex) 內放 14 個 in-flow `.gnt-g-cell`** 提供直欄格線＋週末底——與表頭 hcell 同結構、同為 in-flow，捲動時可靠重繪且 x 自動對齊。JS `gntGantt` 移除 bg 迴圈、改在每列塞 cell；CSS `.gnt-g-col*`→`.gnt-g-cell*`。
- 驗證：每列 14 cell、`.gnt-g-bg` 已不存在、內文格線 x 與表頭 diff=0、週末底 rgb(244,245,247) 保留、bar left% 定位正確、左右橫線 diff=0、今日線在、0 語法錯誤。

## 2026-07-17（二十一）　甘特左右橫線對齊修正（真兇）＋圖表主色黑→品牌藍

- **甘特左右分隔線錯位（真兇）**：量測發現左表頭 `.gnt-g-side-head` 高 34px、右表頭 `.gnt-g-head` 高 **35px**——因左側 border-bottom 在框內（border-box），右側 border-bottom 加在**容器**上（34+1=35）。這 1px 從表頭起讓左右每條橫線都差 1px。修法：把 border-bottom 從 `.gnt-g-head` 容器**移到 `.gnt-g-hcell`**（border-box 內含）→ 右表頭 35→34，與左側齊。驗證：sideHeadH=headH=34、每列底緣 diff=0。※（二十）的 `translateZ(0)` 是誤判重繪，本輪已撤除。
- **圖表主色黑→品牌藍**：品牌改黑後圖表主色（`--accent`）= 黑。用 **scoped 覆寫** `.cht-box,.cht-tile,.cht-card,.cht-dash,.gnt-box{--accent:var(--c-brand2-500)}` 一條規則，讓 Chart（bar/line/curve/area/donut 主段/圖例點/hover dot）＋ Schedule Chart（gantt 預設 bar `c-accent`）的黑主色一次轉 #3358D4 品牌藍；狀態色（ok 綠/warn 橘/danger 紅）與 series B 綠不受影響。驗證：cht bar/line/donut/legend 全 rgb(51,88,212)、gantt c-accent bar #3358D4、c-ok/warn/danger 原色不變。※`--i-primary-tint` 在 :root 已算好不隨 scoped 翻，故 gantt 今日淺底維持中性、今日線/文字才轉藍。

## 2026-07-17（二十）　甘特隔線重繪修正、月曆（去週數/事件點藍/M·S）、長條圖去圓角+M·S

- **甘特隔線捲動斷裂**：DOM 量測證實格線像素完美（欄恆 46px 整數、表頭與內文欄 x 完全對齊 diff=0），斷裂是 `.gnt-g-bg`（絕對定位格線層）在捲動時的 GPU 重繪殘影。修法：`.gnt-g-bg` 加 `transform:translateZ(0)` 提升為獨立合成層，讓捲動時 crisp 重繪（不動版面）。※此頁環境無法截圖，需 Yuu 端目視確認。
- **月曆**：①移除「週數」篩選項（CAL_BOOLS.month 拿掉 weeknum，元件仍支援只是不再可切）；②事件圓點 `--accent`→**`--c-brand2-500`（品牌藍 #3358D4）**；③size label 標準/精簡→**M/S**（DIAL_SPECS.calendar + Live calSeg 兩處）。
- **長條圖**：①bar rect `rx="2"`→**`rx="0"`**（3 處，去圓角；hover 高亮 rx=3 保留）；②size label 標準/精簡→**M/S**（DIAL_SPECS.chart + Live segs 兩處）。
- 驗證：Playwright 屬性查驗——事件點 rgb(51,88,212)=品牌藍、週數項不存在、chart/calendar Live 皆 M/S、bar rx=0、甘特 layer 提升後對齊 diff=0；0 語法錯誤。※預覽 server 有快取，驗證要加 `?v=` cache-buster。

## 2026-07-17（十九）　Complex padding 二次收緊（list 放大/divider 對齊/collapse 縮/drawer 對齊 action menu/footer base）＋ 側邊欄拖曳調寬

**padding 微調（承十八，Yuu 逐頁看效果後再調）**
- **list**：`lst-item`/`lst-sel` 再大一級 sp-2(6)→**sp-3(8)**；`lst-divider` margin 12→**8** 對齊 item padding（原本分隔線比內容更內縮、沒對齊）。
- **collapse**：縮小一級——`cps-head` 16→**12**、`cps-body` 橫向 16→**12**（跟 head 對齊）、body 底部 ::after 16→**12**。
- **drawer**：縮到跟 action menu 同級——`drw-nav` 容器 12→**6**（＝am-panel）、`drw-foot` 16→**6**；`drw-navrow` 已是 6（＝am-item）。
- **footer**：修正上輪漏改的 **base `.ftr-foot`（rich 預設）**——padding `32/32/24`→**16**（就是「看起來還很寬鬆」那顆）；連帶 `ftr-main`/`ftr-cols` 欄距 32/48→**24/32**、`ftr-bottom` 上緣 margin 24→**16**。

**側邊欄拖曳調寬（新功能）**
- sidebar 右緣加 `.sidebar-resize` 把手（hover/拖曳才亮 accent 線），pointer 拖曳即時更新 `--sb`，寬度夾在 **180 ~ min(480, 42vw)**，放開存 localStorage(`ds-sidebar-w`)、重整還原、**雙擊還原**預設 20vw。
- `.layout` 加 position:relative 供把手定位；收合／行動抽屜模式自動隱藏把手；setPointerCapture 包 try/catch。
- 驗證：Playwright 屬性查驗 padding 全部落地；拖曳 end-to-end（拖到 250px→存 250→放開清乾淨→下限 clamp 180）通過；0 真實 console error。

## 2026-07-17（十八）　Complex 12 padding 首輪分類收緊（一般列/迷你列/大容器/標題底部）

依 Yuu 訂的四類尺標一次收齊 Complex 內部 padding（18 筆確定性替換、match==1）：**一般列 sp-2(6)**（lst-item/lst-sel/am-item/drw-navrow）、**迷你列 sp-1(4)**（drw-pitem/flo-toolbar）、**大容器 sp-4(12)**（hdr-bar 橫向/footer×3/sch-demo/flo-stage/drw-nav/mdl-layer-wrap/mdl-vp-page/mdl-pop-body）、**標題/底部 sp-5(16)**（cps-head/drw-foot；modal head/foot 本就 16）。堆疊型元件（modal/collapse）橫向保持對齊避免歪位。

## 2026-07-16（十七）　Design Token Batch 4+5：Card 4 ＋ Table&Chart 5 內部值接 token（backlog 收尾）

- Batch 4 Card：card(`.crd-`)／product-card(`.pcd-`)／category-tile(`.cat-`)／article-card(`.art-`)。
- Batch 5 Table&Chart：table(`.tbl-`)／chart(`.cht-`)／tree-view(`.trv-`)／schedule-chart(`.gnt-`)／calendar(`.cal-`)。
- 129 筆確定性套用（同 Batch 3 政策：font-size 吸附 --fs-h*、spacing 吸附 --sp-*、radius 吸附 --r-*，tie→較緊；≤3px／寬高／邊框／0／50%／pill 保留）。
- 驗證：product-card padding/gap/font 解析正常、schedule-chart(gnt) 523 節點無 0 崩塌、pill radius=9999 解析、calendar/table 正常。
- ✅ **Design Token 內部值接 token backlog 全數收尾**（Batch 2 Basic 17 ＋ Batch 3 Complex 12 ＋ Batch 4 Card 4 ＋ Batch 5 Table&Chart 5＝全 38 顆）。

### 側邊欄左緣 peek 熱區加寬＋延遲（同日）
- edge-trigger 14→28px；進入延遲 .14s（hover-intent）、離開延遲 .32s（滑走不馬上縮回）。

---

## 2026-07-16（十六・撤除）　移除元件組合示範頁

- Yuu 覺得視覺不夠好，整頁移除（`git revert` 前一版 Batch 1）：拿掉側邊欄「Showcase 組合示範」群組＋入口、renderView dispatch、`renderCompose`/`composeShop`＋`.cmp-*` CSS。組合示範方向暫緩，日後要做再重規劃視覺。

---

## 2026-07-16（十五）　Chart：新增曲線圖 curve ＋ 甜甜圈 hover 互動

### 曲線圖 curve（第 5 型態）
- 新增 `chtSmoothPath()`（Catmull-Rom → cubic bezier），`chtLineSVG` 加 `o.smooth` 走平滑路徑；curve＝折線的平滑版，面積填充／格線／座標軸／hover tooltip 全沿用 line。
- 接進 DIAL_SPECS（variant 4→5）、VN、矩陣、Live seg／render／free row、bool scope（line 選項改陣列 `['line','curve']` 一起顯示）；formula 4×2→5×2=10。
- CSS：`.cht-curve` 尺寸沿用 `.cht-line`。

### 甜甜圈 donut hover（改成 tooltip，非改中央數字）
- 每段 circle 加 `.cht-seg`＋`data-i`；`chtDonutHover()` 改成跟折線／長條一樣浮 `.cht-tip` tooltip（label＋%，跟隨滑鼠），**不動中央數字、不 focus/淡化其他段**（依 Yuu 回饋修正）。
- 驗證：矩陣 5 列（統計/折線/曲線/長條/甜甜圈）、curve path 含 C bezier；hover 進行中段→浮出「26% 進行中」tooltip、中央維持 46%、他段 opacity 不變。

### 補回 line／curve 的「漸層填充 gradient」篩選項（Yuu 回饋）
- 新增 `chtUID` 計數＋`<linearGradient>` defs（accent .32→0 直向漸層）；`chtLineSVG` 加 `o.grad`→面積填充從 flat `.14` 改 `url(#gradN)`。
- 接進 chtChart line／curve 分支、LIVE initial/bools（新增「漸層填充 gradient」勾選）/render、CHT_BOOL_SCOPE（scope `['line','curve']`）。
- 驗證：line/curve 顯示該勾選、勾選後 area fill=url(#chtGrad1) 且有 linearGradient def；bar/stat/donut 自動隱藏此項。

---

## 2026-07-16（十四）　右緣本頁目錄（Notion 式錨點）

- 每個元件頁右側加「本頁目錄」：滑鼠靠近右緣（<130px 露把手提示、<22px 浮出面板）→ 顯示浮動目錄；點項目 smooth scroll 到該段落；捲動時當前段落高亮。
- 目錄內容：`.block>h2`＝主段落（lv1）＋ `.famhead .fz`＝家族子元件小標（lv2 縮排）；`renderView` 換頁後重建。
- 段落 <2 的頁面（需求匯總／Design Token）自動隱藏；≤900px 行動版隱藏。
- **不放實體 overlay**：用 document mousemove 偵測右緣 x 座標，避免熱區蓋到 `.main` 捲軸拖曳。
- 驗證：price 頁 4 段、input 頁 3 段＋4 個 lv2 家族子項、點擊 scroll（0→1312）、summary 頁 dock display:none。

---

## 2026-07-16（十三）　表格真正修好：class 撞名（.tbl-row）害整張表變 grid

### 真因（前一版沒抓到）
- Table 元件的資料列 `<tr>` 本來就用 `class="tbl-row"`；（十）為了「並排 table 等分」新增的 utility `.tbl-row{display:grid}` **class 撞名** → 把每一張表的每一列 `<tr>` 都變成 grid，欄位全錯位（表頭與資料對不齊、格子擠成一坨）。矩陣小表與 Showcase 完整表都因此爆掉。
- 前一版（mincol 448＋nowrap）只是把矩陣「看起來」蓋過去，Showcase 表照樣壞。

### 修正
- 移除撞名的 `.tbl-row` grid 規則，改名為 `.tbl-cols`（未來要並排等分 table 用這個不撞名的容器）；`<tr class="tbl-row">` 回歸正常 table-row。
- mincol 改回 300（撞名修掉後小表自然寬 ~244，不需要 448 硬撐）。
- 驗證：Showcase 表頭/資料每欄 left 完全對齊（trDisplay=table-row）；矩陣 6 格小表列高一致、狀態/金額不換行、無多餘橫向捲動。

---

## 2026-07-16（十二）　兩張 Live 牌卡間距、price/pagination 連動補齊、輸入框 36px、頁面標題區重塑

### A　同段兩張 Live 牌卡間距（原 0px 貼在一起）
- Number 頁 Live 段落有兩張 `.livewrap`（price + metric），原本 margin 0 → 貼死。加 `.livewrap + .livewrap{margin-top:var(--sp-6)}`（24px）。驗證：gap 0→24。

### 4　price / pagination 自訂 Live 補上篩選器連動
- 上輪只接了 button+14 顆 mountLive 主 Live；這輪補 price（兩段 mountLive 都加 `gate:'price'`）、pagination（`gate:'pagination'`）。
- 驗證：price 取消 sale → Live sale disabled；pagination 取消 prev-next → Live 前後 disabled；勾回還原。

### 6　輸入框 / dropdown / file 高度 40 → 36px
- `.field`、`.field.dd.multi` min-height、`.filefield` 一律 40→36。padding 維持 sp-3(8)。驗證：field/dropdown trigger computed height=36。

### B　頁面標題區重塑（參考 Design Token 頁樣式，全站通則）
- **eyebrow** 調小調淡：`fs-h9(13)→fs-h10(11)`、`color accent→faint`。
- **h1** 放大：`fs-h3(26)→fs-h2(32)`；margin-bottom `sp-2(6)→sp-5(16)`（元件頁 h1→lede 距離加大）。
- **匯總/Token 頁**（h1 在 sum-top flex 內）：加 `.sum-top + .lede{margin-top:sp-5}` → 標題區塊→說明 0→16px。
- **說明文字下方淺分隔線**：新增 `.head-rule{border-top:1px solid var(--line);margin:sp-5 0 0}`（滿內容寬），插入 viewScaffold（元件頁）／renderSummary（需求匯總）／renderTokens（Design Token）三處 lede 之後。
- 順手：需求匯總 lede 移除已作廢的「右上 方案 tab 可切三種檢視版型」過時文案。
- 驗證：三種頁型 eyebrow 11px/faint、h1 32px、標題→說明 16px、head-rule 滿寬(1077/1088)、lede→rule 16。

手法：batch2_0716.js 確定性套用 13 筆逐筆唯一匹配；node --check + Playwright computed/互動全驗證，0 error。

---

## 2026-07-16（十一）　需求匯總改名+分隔線、AI 建議推薦集、篩選器連動 Live disable、分類磚1px、輸入框內距、Token 複製鈕、Number 節奏

### T1　側邊欄：匯出需求 → 需求匯總 + 分隔線
- 導覽 pin「📋 匯出需求」→「📋 需求匯總」；頁面 header eyebrow/h1 同步改名。
- 需求匯總 ↔ Design Token 間補 `.nav-sep`（1px hairline），與下方 Basic 群 border-top 一致，三段皆有分隔。

### T2　AI 建議＝最常見推薦集 + 未選為「unselected 非 disabled」
- `RECOMMEND` 由 6 顆擴為 15 顆最常見/高使用率元件：button/input/dropdown/checkbox/radio/tag/icon/tooltip/notification/modal/card/table/tab/pagination/menu。
- 點 AI 建議 → 只選這 15 顆，其餘變「未選」；未選卡 opacity .5→**.8**（讀作未選、非停用，仍可點）；再勾任一未選卡 → `onManual` 關閉 AI 已選模式（aiBtn 去 on），選擇保留。
- 驗證：39→15 選中、未選 opacity .8、再勾 action-menu → aiOn=false 且該卡變已選。

### T3　需求匯總移除檢視版型 tab
- 移除「分類展開／緊湊清單／分組網格」sum-tabs（HTML+handler），固定以 accordion（分類展開）呈現。makeRow/makeTile 留著未用（無害）。

### T4　變數篩選器連動：未勾軸值 → Live 對應選項 disable
- **機制**：`mountLive` 加 `gate:'<id>'` → 讀 `DIAL_SPECS[id].axes`（完整軸值）+ `CHOICE[id].active`（目前勾選）；seg 選項若屬某軸且未被勾 → `disabled`+`.is-off`。選中值被篩掉時自動跳到第一個仍啟用值。
- **連動**：`LIVE_REFRESH`（Map: active 物件→syncActive fns）；`mountDial` 勾選改變時觸發同一 active 的 refresh；`renderView` 換頁先 `clear()` 避免累積。
- **button 專屬**（renderLive/seg 非走 mountLive）：seg() 依 module `active` gate + renderLive 開頭 clamp、renderAxes 勾選改變加呼叫 renderLive。
- 已接：button + 14 顆 mountLive 主 Live（input/dropdown/checkbox/radio/tag/tab/tooltip/notification/skeleton/loader/menu/action-menu/breadcrumb/icon/image）。price/pagination 自訂 Live 暫未接。
- 驗證：button 取消 outline → Live outline disabled、pressed 留 solid、勾回還原；dropdown 取消 filled → disabled，且先選 filled 再篩掉 → 自動跳 outline。
- CSS：`.seg button:disabled,.seg button.is-off{opacity:.32;cursor:not-allowed;box-shadow:none;}`

### T5　分類磚 active 邊框只要 1px
- `.cat-tile.is-active` 去掉外加 `box-shadow 0 0 0 1px`（原 1px 邊框+1px 影＝視覺 2px）→ 只留 1px 邊框變 accent；hover 態同步去環只留 drop shadow。
- `.cat-gradient.is-active` 2px gap+2px accent → **1px gap(panel)+1px accent**。

### T6　輸入框 / dropdown 內距縮小
- `.field`（含 dropdown＝.field.dd）水平 padding `sp-4(12)` → `sp-3(8)`；`.tarea` 水平同縮；height 維持 40。filefield 本就 sp-3 免動。

### T7　複製 Token CSS 鈕移右上角（同需求匯總 CTA）
- Design Token 頁 header `.sum-top` 右上放 `#tokCopy`（class 改 `copybtn`，與匯出 CTA 一致）；原 tok-lead 內的複製鈕移除，重設鈕留原位。onclick 不變。

### T8　Number 頁 section 節奏修正
- 量測：段落實際節奏 6/6/16/**6**/32/32/32/32——唯一異數是 spec strip → 變數篩選器 只有 6px（`.spec` margin-bottom `sp-2`），讓篩選器貼著 spec、破壞節奏。
- 修：`.spec` margin `sp-5 0 sp-2` → **`sp-5 0`**（上下皆 16）→ 節奏變 6/6/16/16/32。此為全站 `.spec` 通則（所有元件頁 spec→filter 一致變 16）。

手法：batch_0716.js（T1/2/3/5/6/7，17 筆）+ task4_gate.js（T4，22 筆）確定性套用逐筆唯一匹配；`.spec` 單筆 Edit；node --check + Playwright computed/互動全驗證，0 error。

---

## 2026-07-16（十）　站台 chrome 英文改 mono + 側邊欄收合/edge-peek + table 並排等分 + 骨架字級接 token

### T1　站台 chrome 英文 → Geist Mono（元件維持 sans）
- **關鍵**：多數元件沒自帶 font-family、靠繼承 body 的 sans → 不能翻 body（會害元件全變 mono）。正解：body 維持 sans，只對 chrome 葉節點文字加 mono。中文自動 fallback PingFang，只有英數變 Geist Mono。
- 加 mono 的 chrome selector：`.brand-title, h1, .lede, .block>.sub, .dial h2/.hint, .spec .cell .v, .vname/.vdesc, .nav-item .nm, .nav-group .gh .gh-t, .famhead .fz, .placeholder h2/p, .site-footer, .sc-name/.sumcat-t/.sr-name/.st-name, .tok-gh .t/.d, .dh-title, .tok-tab/.tokbtn/.copybtn`。
- 驗證：chrome h1/lede/nav/sub 全 Geist Mono；元件 .btn/.tg/.tbl-wrap 維持 Geist(sans)。

### T2　桌機側邊欄收合 + 左緣 hover peek（漢堡切換）
- `.hamb` 桌機也顯示（原 display:none 只行動版）；點擊：`innerWidth>900` → toggle `.nav-collapsed`，否則行動抽屜 `.nav-open`。
- 收合（@media min-width:901）：`.layout` grid 首軌→0（主內容滿寬）、`.sidebar` 改 position:fixed 藏到 translateX(-100%) 完全移出畫面。
- 左緣 peek：DOM 插入 `.edge-trigger`(14px 熱區) 在 sidebar 前；`.edge-trigger:hover ~ .sidebar, .sidebar:hover{translateX(0)}` 純 CSS 滑出蓋在內容上，離開即收。
- 驗證：漢堡 toggle nav-collapsed、收合 grid=0/sidebar 右緣=0 offscreen、edge-trigger display:block。（hover-peek 純 CSS ~ 選擇器，headless 無法真 hover，需實機點一下確認手感）

### T3　並排 table 等分填滿（全站通則）
- `.tbl-demo` max-width 760px → 100%（表格填滿內容區，table 本身已 width:100%）。
- 新增通則 utility `.tbl-row{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(0,1fr);gap}` + 子項 min-width:0 → 任何並排 table 等分填滿、非固定寬。（目前站上無 2-up table，此為通則 + 移除固定寬；未來並排直接套 .tbl-row）
- 驗證：tbl-demo maxW=100%、寬度 1077/主內容 1152。

### T4　共用骨架字級對齊 token（吸附 --fs-h*）
- `.demo-item .cap` 11→h10、`.ctl .lab` 10→h10、`.seg button` 12→h9、`.chk` 12.5→h9、`.live-note` 11.5→h10、`.placeholder h2` 20→h5 / p 14→h8 / .axhint 12→h9、`.famhead .fz` 16→h7 / .fe 11→h10。（`.placeholder .em` 30px 裝飾 emoji 保留）

手法：apply_four.js 確定性套用 16 筆、逐筆唯一匹配檢查；node --check + Playwright computed 驗證，0 error。

---

## 2026-07-16（九）　全站預設圓角 → 4px + 輸入框統一 + 共用骨架間距接 token

### 起因（Yuu 回報）
1. 頁面段落間距鬆散、不一致、沒套 token。
2. 元件庫輸入框（`.field`，8px 圓角）跟 Design Token 頁的 hex 輸入框（`.tok-hex`，4px 圓角）長不一樣，哪個才是元件庫的？

### 釐清
- **`.field` 才是元件庫正版輸入框**（全站 input/dropdown/選擇器/搜尋框/表格欄位都用它）；`.tok-hex` 只是 token 頁改值的內部小工具、非元件。
- Yuu 決策：**全站預設圓角收到 4px**（改 `--radius` alias，選項 C — 卡片/面板/modal/輸入全 4px）。

### 圓角（radius_global.js 確定性套用）
- `--radius` alias `r-md(8px)` → `r-sm(4px)`（連帶 43 處 `var(--radius)` 消費者全變 4px）。
- 所有 `border-radius:var(--r-md)` ×33、`var(--r-lg)` ×9 → `var(--r-sm)`。
- 硬寫單值 px 圓角 {5,6,7,8,9,10,11,12,14}px ×45 → `var(--r-sm)`。
- 複合端蓋（segmented / date-range cap / bottom-sheet 頂角）×5 → r-sm 版。
- **保留**：pill(`999px`/`--r-pill` ×34)、圓形(`50%` ×12)、`0`、微圓角(1/2/3px 的 dot/dash/indicator/arrow)、以及 `.im-rounded`（圖片圓角變體，若也 4px 會跟 `.im-rectangular` 撞、變體示範失效）。
- 結果：`.field`／`.btn`（含 sz-l 原 10px）／卡片／面板／spec／dial 全 4px；**輸入框自動與 `.tok-hex` 統一**（皆 r-sm 4px）。`.field` 保留 40px 高與 12px 內距（舒適/可及性；未縮成 tok-hex 的 30px 緊湊編輯盒尺寸）。

### 共用骨架間距（scaffold_spacing.js，13 筆）
Batch 2 只掃各元件前綴 class，共用示範骨架漏掉 → 這批鬆散元兇。吸附到 token 網格（0/4/6/8/12/16/24/32/48/64，平手取較緊，對齊 v0）：
- `.row-demo` 26/30→24/32、`.demo-item` 12→sp-4、`.livewrap` 24→sp-6、`.ctl-row` 20/30/22→16/32/24、`.ctl` 8→sp-3、`.seg button` 6/12→sp-2/sp-4、`.checks` 18→sp-5、`.chk` 7→sp-2、`.live-stage` 44→sp-8、`.live-note` 16/8→sp-5/sp-3、`.live-free` 16→sp-5、`.famhead` 10/46/6/24→sp-3/sp-8/sp-2/sp-6。

### 驗證
node --check OK、雙主題、computed 實測：`.field` r=4px、`.btn` r=4px、`.btn.sz-l` r=4px、`.ctl-row` gap=16/32 mb=24、`.demo-item` gap=12、0 真實 console error（僅 favicon 404）。

---

## 2026-07-16（八）　Batch 2：Basic 17 顆元件內部值接 token + 元件 bug 修正

### Bug 修正（品牌改黑後的連帶問題）
- **深色模式 solid/active/checked 文字消失**：tab active(v-contained)、tag solid(i-brand/i-danger)、checkbox 打勾/dash、tab count 的硬寫 `#fff` → `var(--primary-on)`/`var(--danger-on)`（會隨主題翻轉：淺色白字、深色深字）。已於深色實測：tag solid 亮底深字、checkbox 深勾亮底。
- **action-menu 面板防塌**：`.am-panel` 加 `height:max-content` + `flex:0 0 auto` + item `flex:0 0 auto`，強化巢狀 flex/grid 內不被壓縮。

### Batch 2 tokenization（多 agent 並行分析 + 序列套用）
用 5 個並行 agent 分析 Basic 17 顆元件的硬寫值,回傳精確整行編輯,主控序列套用(避免多 agent 同寫衝突),共 **~126 筆**：
- **font-size → `--fs-h*`**（吸附 v0 字級階）、**border-radius → `--r-*`**、**padding/margin/gap → `--sp-*`**（v0 較緊尺標）。
- 涵蓋:button/input/dropdown/selector/tag/tab/icon/notification/tooltip/skeleton/loader/number/menu/action-menu/breadcrumb/pagination/image。共用尺寸類 `.sz-s/m/l` 一併接上。
- 顏色早已 token 化,故不動;≤2-3px 微值、width/height/border 寬度、line-height、0 值保留。
- 驗證:node OK、button/notification computed 值正確解析(桌面 sz-m 16/14/8、sz-l 16/16/10;響應式 mobile 自動變 12/15/8)、0 console error、雙主題無破版。

**待辦**：Batch 3(Complex 12)／Batch 4(Card 4)／Batch 5(Table&Chart 5) 同法接 token。

---

## 2026-07-16（七）　數值字體一致（.m-val 補 mono）+ 預覽 Sans/Mono 切換

揪出真正的不一致（前幾次沒抓到）：

- **`.m-val` 漏綁 mono**：Breakpoints／Grid 的值（如「360px」「4 欄 gutter 16」）落在 `.tok-mode` scope 外 → fallback 成 Geist Sans；其他 token 值（hex/字級）都 mono，就它 sans。把 `.tok-mode .m-val` 改為全域 `.m-val{font-family:var(--font-mono)}`，所有數值統一 Geist Mono。
- **預覽加 Sans/Mono 字體切換**：typo 預覽原本固定 Geist Sans（因為預覽的是標題樣式）；新增第三組 tab **Sans／Mono**，可即時看數字在 Geist Mono 下的樣子（打「000」→ 零與底部 Geist Mono 示意一致）。
- **`--font-mono` 補 CJK fallback**（PingFang TC／Noto Sans TC）：mono 情境含中文時不再掉到系統等寬醜字。

**釐清**：Geist Mono 字檔本身正確（官方 latin woff2、每個英數字元等寬無 fallback）。之前的「零不一樣」＝該用 mono 的數值被 sans 渲染（已修）＋ 預覽是標題樣式故為 sans（現可切 Mono）。

---

## 2026-07-16（六）　全站字體統一（消除 Arial）+ Geist Mono 驗證

- **全域字體繼承**：加 `input,button,select,textarea{font-family:inherit}`。原本 72 個表單控制項（色票 input、圖示按鈕等）fallback 到瀏覽器預設 **Arial**；補後整頁只剩 **Geist / Geist Mono**（實測 arial=0），數字/文字全站一致。
- **Geist Mono 驗證**：比對官方 Google Fonts（`fonts.googleapis.com/css2?family=Geist+Mono`），內嵌的 latin woff2 `or3nQ6H-…FrcdmhHkjko.woff2` 與官方**同一支**、已載入、為真等寬。頁面上「零看起來不同」＝數值用 Geist Mono、預覽/示意文字用 Geist Sans（比例字）的差異，非字體錯誤。
- Design Token 頁 CSS 確認**全綁 token**（無硬寫色、type 用 `--fs-*`、間距 `--sp-*`），本頁已完整 dogfood DS。

---

## 2026-07-16（五）　字重/字級對齊 v0 + typo 預覽強化

- **字重全站對齊 v0**：v0 量測顯示標題全用 **600、無 700**。`--fw-h*` 改 600 封頂；並全域把 32 處硬寫重字重（700/680/660/650/640/620）→ **600**，所有頁面標題即時變 v0 感（Geist 本就＝v0 的 GeistSans，已確認載入）。
- **字級對齊 v0**：`--fs-h*` 依 v0 ladder 微調（h2 36→32、h3 28→26、h9 12→13、h10 10→11…），響應式同步。
- **typo 預覽強化**：加 **自訂預覽文案 input**、**中／En 切換 tab**；預覽即時反映選定 device 字級＋語言的行高與字距。
- **字距中／英分軌**：新增 `--ls-en-h*`；字距組改「中／英兩欄」可各自調（中文 CJK 幾乎不收、英文 Latin 大標題略收）。

**待辦**：元件內部 spacing 仍多為硬寫（~486 處），token 尺標改動不會自動套到元件頁 → 需 Batch 2–5 逐元件接 token 才會整體收緊（字重已可全域替換是因為 weight 值單一好掃，spacing 涉及版面較需逐一確認）。

---

## 2026-07-16（四）　牌卡 2 欄 + Spacing 依 v0 量測校準（B）

- **牌卡固定 2 欄**：3 欄太擠、內容被切；改 `.tok-cardgrid` 固定兩兩並列（`repeat(2,minmax(0,1fr))`），窄螢幕收 1 欄。
- **Spacing 依 v0.app 實測校準**（跑 B）：用 Playwright 量 v0.app computed style —— padding 最常用 **12px**、gap 最常用 **6px**，比原尺標緊一階且缺 6px 階。故 `--sp-*` 重定為 `0/4/6/8/12/16/24/32/48/64`（補 6px、base 12），比原 `0/4/8/12/16/24/32/48/64` 緊一階；響應式 tablet/mobile 同步收緊；新增 `--sp-9:64`。chrome 隨之變緊（.main padding 32→24）。
- v0 其他量測（待 Yuu 決定是否套用）：圓角 base 8px（＝現況、不需改）；字級 body 主力 14/13px、大字 20/24/32/48；字重幾乎全 400、少量 500/600、**完全沒用 700**（現況 h1/h2＝700 比 v0 重）。

---

## 2026-07-16（三）　Token 頁版型回調 + 淺色主色修復 + typo 預覽

依 Yuu 回饋修正：

- **淺色主色按鈕黑底黑字（bug 修復）**：`[data-theme="light"]` 區塊漏宣告 `--s-on-primary` 與 `--e-*`，OS=深色手動切淺色時會洩漏成深字/深陰影。補齊後淺色主色＝黑底白字。
- **版型改回牌卡列**：色表回到「一列一色」原樣（撤掉太擠的 swatch grid）；改成 **group 牌卡由左至右排列、寬度不夠往下**（`.tok-cardgrid` auto-fill，桌機 3 欄；typography 寬表跨滿整列）。
- **框架索引改回值表**：撤掉難對照的 chip 索引，回到 Token｜值｜角色 的表格，並同樣左右排列成牌卡。
- **typo 預覽吃 device 值**：切 Desktop/Tablet/Mobile 時預覽字級跟著變（48↔32px），不再固定用實際視窗字級；**device tab 補下方間距**。
- 字距組改回一般列（並入牌卡流）。

---

## 2026-07-16（二）　Token 版型精簡 + 品牌色互換 + typography 中英/device

依 Yuu 回饋再調整：

### 版型（充分利用左右寬度、大幅縮短頁面）
- **L1 色彩表** 由一列一色 → **水平 swatch grid**（auto-fill，桌機約 6 欄／列）。Neutral 從 11 列變 2 列。
- **框架索引 tab** 由 139 列值表 → **分類索引卡片**（水平排列）：只列「共哪幾類 · 各類要產出哪些 token 名稱」，不列值（值看 L1／L2）。

### Typography 重構
- 複合樣式表新增 **device 切換**（🖥/▭/▯ tab）改字級欄；補上 **英文行高**（`--lh-en-h*`），中英並列。
- **字距抽成獨立組別**（Letter Spacing 字距，水平 grid），不再包在 typography 內。

### 品牌色互換
- **主色改深黑**（`--c-brand-*` 9 階黑，500=#1C1C20；primary 動作＝黑按鈕白字）。暗色模式翻成亮端（`brand-200` 亮按鈕深字），on-primary 自動切換。
- **副色改品牌藍**（`--c-brand2-*`＝原 #3358D4 indigo）。元件端 secondary 仍走中性色（要不要接藍待確認）。

### 斷點
- **wide 1280 → 1920**。

### 驗證
- node --check 通過；Playwright：色表 6 欄×2 列、typo 無溢出、device 切換（48↔32px）、框架索引 17 卡/139 chip 無值、主色黑（按鈕 rgb(28,28,32) 白字）、暗色翻亮、匯出含 fs/fw/lh/lh-en/ls + 響應式 media、**0 console error**。

---

## 2026-07-16　Token 補齊框架缺口 + 框架索引 tab

對照 `../ds-framework/themes/_base.theme.yaml` 原始定義，補齊網頁上遺漏的 token，並讓 Design Token 頁能索引框架完整定義。

### L1 色階補齊
- **Brand 主色** 4 階 → **9 階**（100–900，種子 500=#3358D4）。
- **Brand 副色** 新增 **9 階 slate**（`--c-brand2-*`，佔位、之後可換 Goons 副色）。
- **Feedback**（success/warning/error/info）各 3–4 階 → **各 9 階**（框架完整 Tailwind ramp）。

### Radius / Elevation
- Radius 補 `xs(2)` / `2xl(24)` / `3xl(32)`（→ 9 階；pill＝框架 full）。
- Elevation 補 `2xl`；新增**暗色模式加深陰影**（dark 兩區塊各補一套 `--e-*`）。

### Typography 複合 token（方案 A）
- 新增每階 `--fw-h1..h10` / `--lh-h1..h10` / `--ls-h1..h10`（依框架 weight/line-height，中文優先取 zh 行高；補 letter-spacing）。
- 新增 `.ty-h1..h10` utility class＝把 size＋weight＋line-height＋字距綁成一包，對應 Figma text style。
- Design Token 頁 Typography 多一組「複合樣式（text style）」：一列＝字重/行高/字距＋即時 `.ty-h*` 預覽。

### 框架索引 tab（唯讀）
- Design Token 頁加第 3 個 tab **「框架索引」**：唯讀呈現 `_base.theme.yaml` 完整 L1+L2 定義（17 段／139 列），色值帶色塊。
- ⚠ 標記處＝框架原值與本專案 v0 種子刻意不同（如 gray Tailwind vs v0 單色、radius lg 12 vs 10）；空值處＝框架留白由專案 delta 填。

### 驗證
- node --check 通過；Playwright：15 個 L1 組、3 tab、複合列即時編輯與預覽、框架索引 17 段渲染、匯出 CSS 含全部新 token（含響應式 media）、暗色陰影生效、reset 還原、**0 console error**。

---

## 2026-07-13 ~ 07-14　初版建置（Basic 六顆）

分階段做出來，依序如下：

### 1. Button 陳列頁（起點）
- 依 L3 spec 攤開 button 完整複雜度：variant × intent × state × size（3 × 3 × 4 × 3 = 108）。
- State × Intent 矩陣（每 variant 一塊）、Size 尺寸列、Content 內容軸（boolean：leading/trailing icon、icon-only）。
- 「複雜度轉盤」：勾掉任一軸值 → 矩陣與變體計數即時縮減。
- 色值為 placeholder token（inline 寫死、self-contained），對應 `semantic.action.*`。
- 深淺色兩套 token 都調過。

### 2. 導覽 + Live 互動
- 左側元件導覽（依 L0 category 分組：Basic / Feedback / Complex），header 有 ☰ 開關、手機版變抽屜。
- 右上深淺色切換（sun/moon + 標籤）。
- 新增「實際互動 Live」區：真的可 hover / 按下的按鈕 + 可調 variant/intent/size/icon/disabled 的控制器。

### 3~4. 複雜度轉盤樣式
- 轉盤 chip 改成 tab button 樣式：active 實色填滿、inactive 灰階。
- chip 圓角改為 999（全圓角膠囊）。

### 5. 補齊其餘 Basic 元件（input / checkbox / radio / tag / tab）
- 每顆依各自 L3 spec 的實際軸建矩陣（不是自編）：
  - **Input**：variant(outline/filled) × 7 狀態（含 focus/error/success）；label/hint/icon 走 boolean；Live 欄位可 focus。
  - **Checkbox**：6 狀態 × 3 size（含 indeterminate）；無 variant；Live 可勾選。
  - **Radio**：5 狀態 × 3 size；Live 群組單選。
  - **Tag**：variant(solid/outline/soft) × intent(brand/neutral) × 狀態；Live 有 removable / selectable。
  - **Tab**：variant(line/contained/pill) × 4 狀態；Live 三條可切換的分頁列。

### 6. 複雜度轉盤 → 可收合具名牌卡
- 轉盤改成獨立牌卡，標題列（標題 + 即時計數 + caret）可點擊收合。
- 六顆元件**都**配上各自的可收合轉盤，且真的能過濾各自矩陣（不是裝飾）。

### 7. 全頁 icon 改用 Phosphor（開源）
- 來源：`phosphor-icons/core` regular（viewBox 256、fill-based）。
- 對應：check / minus / caret-down / pencil-simple / arrow-right / x / magnifying-glass / list / sun / moon-stars。
- 修好兩個原本沒顯示的 icon：
  1. 收合 caret（原本用文字字元 `▾`，部分字型不顯示）＋ button 那顆漏改的 chevron。
  2. **Checkbox 勾看不到（真 bug）**：`.cbx svg` 用 `width:70%`，SVG 在 inline-flex 容器裡百分比寬度會塌成 0px；改固定 px（11/14/16）修正。

---

## 2026-07-14　側邊欄改用自訂分類藍圖 + 永遠顯示

- **側邊欄結構重寫**：從舊的「Basic 6 顆 + Feedback/Complex 少數」換成 Yuu 自訂的分類藍圖 —— 8 大類、**43 個陳列項目**（把框架 60 顆 L3 併組而成，詳見 memory `project_ds_component_taxonomy`）。
  - Basic 27→14：button（含 icon-button）、form、selector、tag、step、tab（+toggle）、menu、action-menu、breadcrumb、icon、pagination、price、section-head、announcement-item。
  - Complex 16→12：calendar（併 date/time/range picker + calendar-day）、collapse、list、card、modal、drawer、header、footer、floating-line、product-card、category-tile、article-card。
  - 其餘 6 類（table/chart/feedback/loading/special/media）照框架原樣列出。
- **狀態三態**：已定案（綠）／部分（琥珀，代表子元件已建、家族其餘待補）／待建（灰）。
- **新增 `selector` 家族頁**：一頁內用「家族小標」分隔，同時攤開 Checkbox、Radio 兩個既有矩陣 + Multi-select 待建佔位（把舊的獨立 checkbox/radio 收進來，不損失既有成果）。form→接 input、tag→接 tag、tab→接 tab 為代表子元件。
- **側邊欄永遠顯示**：移除 header 漢堡鈕與 scrim 遮罩、拿掉 `nav-hidden` 收合邏輯；行動版改成靜態堆疊（不再是覆蓋抽屜）。

---

## 2026-07-14　側邊欄分類收合 + 轉盤改勾選清單

- **側邊欄分類可收合**：類別標題（`.gh`）改成按鈕，左側 caret、右側顯示該類項目數；點一下收合／展開該類的項目（`.nav-group.collapsed .ng-items{display:none}`）。預設全展開。
- **檔案可直接雙擊開**：開頭補 `<meta charset="utf-8">`，不再依賴 http server（原本臨時 server 跑在沙箱內、空檔會被凍結導致「拒絕連線」）。
- **複雜度轉盤：tab-button chips → checkbox list**。每個軸值一列（前置 `<input type=checkbox>`），勾／取消即時過濾矩陣與變體計數；每軸至少保留一個（取消最後一個會被擋回）。button 頁 `renderAxes` 與其餘元件共用的 `mountDial` 兩處都改。
- **預設值**：初始強制淺色（`set('light')`，不跟隨系統）；側邊欄只展開第一類 Basic、其餘 7 類預設收合（`renderNav` 對 `gi>0` 加 `collapsed`）。

---

## 2026-07-14　Input 依 Figma spec 調整（Web Guideline input 元件）

比對來源 Figma：Web Guideline 檔 `InputFill`（node `17405:44467`）。token 差異這次不處理（框架每次建立會重設），只調行為／樣式與內容軸：

- **保留** outline（線框）＋ filled（底色）兩個 variant。
- **focus 去外陰影**：`.field.st-focus` 與 `input.field:focus` 移除 `box-shadow` ring，只留邊框變色。（error 狀態的紅框 ring 仍保留。）
- **移除 success 狀態**：states 從 7 → 6（default/hover/focus/filled-value/disabled/error），formula 改 `2 × 6`。錯誤文案維持用 boolean 控制（`error + hint`），不併進矩陣。
- **Content boolean 新增兩項**：`label 必填 (required)`（label 帶紅色 `*`，樣式 `.fieldwrap .fl .req`）、`後綴 eye (密碼顯示切換)`（欄位右側 Phosphor eye icon，新增 `ICON_EYE`）。

### 追加（同日）
- **filled hover 改加深底色**：`.field.v-filled.st-hover` 改成 `background:var(--panel-3)`、`border-color:transparent`（原本會冒出邊框）。outline hover 維持換邊框色。
- **error 去外陰影**：`.field.st-error` 移除 `box-shadow` ring（與 focus 一致，只描紅框）。
- **補上真實 hover 互動**：
  - live 欄位加 `input.field:hover`（outline 換框色）、`input.field.v-filled:hover`（加深底色）；Live 區改放 outline + filled 兩個真欄位可互動試。
  - 其餘 live demo 一併補真 `:hover`（scoped 不影響 matrix 靜態格）：checkbox／radio 用 `.optrow:hover`、tag 用 `.row-demo .tg:hover`、tab 用 `.row-demo .tabi:hover`。

---

## 2026-07-14　每個元件都補上「Live 控制面板」

原本只有 button 頁有 segmented 控制 + boolean 勾選 + 即時預覽的互動面板；抽成通用 `mountLive(host,cfg)`，套到所有已建元件。

- **`mountLive` cfg**：`segs`（分段控制，如 variant/intent/size）、`bools`（勾選內容軸）、`render(state)`（回傳預覽節點）、選用 `free`/`note`（快速對照列）。控制項一動 → 重繪 stage。
- **各元件配置**：
  - **input**：Variant(outline/filled) × 內容 label／必填／hint／leading icon／後綴 eye；預覽是真的可打字欄位（`.field.live-field` + 裸 `.bare` input，hover/focus-within 為真，eye 可切換 password 顯示）＋ outline/filled 快速對照列。
  - **checkbox**：Size(s/m/l) × indeterminate／disabled；預覽可真的點擊勾選。
  - **radio**：Size × disabled；預覽群組真的單選。
  - **tag**：Variant(solid/outline/soft) × Intent(brand/neutral) × icon／removable／selectable。
  - **tab**：Variant(line/contained/pill)；預覽分頁列可真的切換。
  - selector 家族頁因含 checkbox+radio，兩個 Live 面板都在。
- button 頁維持原本自己的 `renderLive`（外觀相同，未動以免回歸）。

---

## 2026-07-14　Input 補清除 × + form 拆成 input／dropdown

- **清除 × icon**：
  - live 可輸入欄位：打字後右側自動出現清除 ×（`.fieldclear`），點了清空並重新聚焦、隱藏（`onmousedown preventDefault` 避免點擊時失焦）。
  - 矩陣 `filled-value` 狀態也補上清除 ×（`inputEl` 對齊 Figma：有值 → clear）。後綴 eye demo 變成 clear ×＋eye 並存。
  - **清除 icon 改用圓底版**：新增 `ICON_XCIRCLE`（Phosphor `x-circle` fill，灰底圓 + 鏤空 ×），input 清除鍵改用它；配色 `.field .fieldclear svg` 預設 `--faint`、hover `--muted`。tag 的 removable × 維持細線 `ICON_CLOSE`。
- **後綴 eye 切換 icon**：新增 `ICON_EYE_SLASH`（Phosphor `eye-slash` regular，curl 官方 raw SVG）。live 密碼欄位點眼睛時，除了切 input type，icon 也在 eye ↔ eye-slash 間切換（遮罩→一般眼、顯示明文→斜線眼，示意再點會隱藏）。
- **Live 預覽 stage 背景調淡**：`.live-stage` 背景 `--panel-2` → `--panel`。原本 stage 與 filled 欄位同為 `--panel-2`，filled 預覽會融進背景看不到；改白底後淺灰 filled 欄位可浮現（虛線框仍界定預覽區）。
- **分類拆分**：原 `form` 家族拆成兩個獨立 Basic 項目 —— **input**（input／password／file／search／textarea，接 `buildInput`）與 **dropdown**（dropdown／cascader，待建 placeholder）。NAV id `form`→`input`、新增 `dropdown`；`BUILD.form`→`BUILD.input`。Basic 由 14 → 15 項、總數 43 → 44。詳見 memory `project_ds_component_taxonomy`。

---

## 2026-07-14　Input 擴成家族頁（補齊 search／password／textarea／file）

input 頁改成家族頁：基本 input 之後用家族小標接續四個子元件，各有「狀態列 + Live 控制面板」。狀態升為「已定案」。

- **共用**：新增 `famBlock(host,cfg)`（小標 + 說明 + 狀態列 + Live）；`mountLive` 支援無控制項（空 ctl-row 不顯示）；新增 `ICON_UPLOAD`（Phosphor upload-simple）。
- **Search 搜尋框**：前置放大鏡 + 有值清除 ×；狀態 default/hover/focus/filled-value/disabled；Live 可 outline/filled + 真搜尋。
- **Password 密碼輸入**：遮罩 •••• + 後綴 eye（eye↔eye-slash）+ 清除；狀態含 error；Live 真的可輸入切明碼。
- **Textarea 多行輸入**：新 `.tarea` 樣式（多行、可垂直 resize）；6 狀態；Live outline/filled 真 textarea。
- **File 檔案上傳**：新 `.filefield`／`.filebtn` 樣式（選檔鈕 + 檔名 + 已選檔清除）；狀態含未選／已選檔／error；Live 點鈕切換檔名。
  - 修：file live 補真實 hover（`.live-stage .filefield:hover` 邊框轉 accent、按鈕 bg 加深，scoped 不影響狀態列）＋ 選檔後出現圓底刪除 ×（點了清掉檔案、重置未選）。

---

## 2026-07-14　新增「複雜度確認」總覽頁 + 中央複雜度 store

- **中央複雜度 store**：新增 `DIAL_SPECS`（button/input/checkbox/radio/tag/tab 六個轉盤元件的 axes/zh/label）＋ `CHOICE`（各元件選擇集，載入時預設全展）。六個 build 的 `active` 改接 `CHOICE[id].active`、axes/zh 改讀 `DIAL_SPECS[id]`，選擇**跨切頁持久**（原本切頁重置）。
- **複雜度確認總覽頁**（側邊欄置頂 📋）：`renderSummary` 彙整每個轉盤元件最後選定的 variant × state；每軸顯示選中（accent 藥丸）vs 排除（刪除線），附各軸 n/total、單元件變體數、全頁總計（例 154/189）。
- **複製篩選結果 (JSON)**：一鍵把各元件選擇 + 變體數複製成 JSON，供 DS 建立流程使用。
- 用途：每次建新 DS 時，這頁即為預覽 + 篩選結果交付，讓 Yuu 確認會在設計稿中建立哪些元件與狀態。

---

## 2026-07-14　新增 Dropdown 下拉元件

- **Dropdown**（側邊欄升「已定案」）：對齊 spec 但沿用 input 決策 —— variant outline/filled × state default/hover/focus/**open**/disabled/error（拿掉 spec 的 size 與 success，已在頁面註明可補）。
- 觸發器用 `.field.dd` + `.ddcaret`（open 時 caret 朝上 + accent 描邊）；矩陣 State × Variant。
- **Live**：真的可點開/選項/關閉的下拉（`.ddmenu`/`.ddopt`），`searchable` 開啟時出現 `.ddsearch` 過濾。
- 已納入中央 `DIAL_SPECS`/`CHOICE` → 複雜度總覽自動多一張 Dropdown 卡（共 7 張）。

### 追加：label／hint boolean + 單選／多選
- **Content boolean**：比照 input 加 `with-label`／`label 必填 (required)`／`with-hint` demo（＋Live 的 label／必填 *／hint 勾選，label 開時勾必填出現紅星 `.req`）。
- **單選／多選兩種**：Live 加 Type 分段（單選／多選）。`ddField(variant,{searchable,multi})` —— 單選點選項即關閉；多選選項帶勾選框（`.ddcheck`）、勾選不關、選中在 trigger 內成可移除 chip（`.ddchip`，`.field.dd.multi` 允許換行）。
- **補已選狀態**：state 軸加 `selected`（已選）—— 矩陣單選已選顯示選定值。

### 藍圖決策：single/multi 改成 dropdown 的變體軸（併入 multi-select）
- 原本 single/multi 是 Live 的功能開關；改成**跟 outline/filled 同層級的 `type` 變體軸**。dropdown 軸 = `type(單選/多選) × variant(outline/filled) × state` = **2×2×7 = 28**。
- **multi-select 併入 dropdown**（作為多選 type），從 selector 家族移除（`buildSelector` 拿掉 multi-select 佔位、改註記）。
- 矩陣改成「每個 type 一塊、欄=variant、列=state」；`ddEl(variant,state,multi)` 的 selected 列：單選顯示值、多選顯示 chips。`ddField` Live 不變（Type 分段仍在）。
- 中央 `DIAL_SPECS.dropdown` 加 type 軸 → 複雜度總覽 Dropdown 卡自動變 type×variant×state。詳見 memory `project_ds_component_taxonomy`。

---

## 2026-07-14　RWD：平板／手機改漢堡抽屜

原本窄螢幕把側欄靜態堆疊，整頁被側欄佔滿、內容被推到下面。改為：

- **桌機（>900px）**：側欄常駐 sticky 雙欄，無漢堡（維持原樣）。
- **平板／手機（≤900px）**：加回漢堡鈕（`.hamb`，只在窄螢幕顯示）；側欄改 `position:fixed` 抽屜、預設 `translateX(-100%)` 收起、內容全寬可見；點漢堡 `shell.nav-open` 滑出 + 遮罩（`.scrim`）、點遮罩或選完項目自動收起（`renderView` 在 `innerWidth<=900` 時移除 `nav-open`）。抽屜**不加陰影**，改 1px `border-right` 界定邊緣。

---

## 2026-07-14　Input 家族矩陣調整（variant 並排 + search/file variant）

- **Input base 矩陣**：改成單一表格、外框／實填**左右並排**（variant 當欄，原本是兩塊上下堆疊）。
- **famBlock 擴充**：支援 `variants` 矩陣模式（state 列 × variant 欄，`el(variant,state)`）。
- **Search 搜尋框**：補 variant 矩陣（外框／實填），`searchEl(variant,state)`。
- **File 檔案上傳**：加自己的 variant（外框／實色）；`fileEl(variant,state)` + `.filefield.v-solid` 樣式；矩陣外框／實色並排；Live 也加 variant 分段（outline/solid）。
  - 修：file 外框／底色**對齊 input** —— 邊框由虛線改 1px 實線（`--i-sec-edge`）、實色底 `--panel-2`，computed 值與 `.field` 一致；差別只在 content（按鈕＋檔名）。

- **已完成**：Basic 六顆（button / input / checkbox / radio / tag / tab），皆經 Playwright 驗證。
- **待建**：Feedback（tooltip / alert）＋ Complex（card / modal / dropdown）。
- **之後可能**：正式版控（建 repo / commit）、接真 token、生成 React/Vue 元件庫。

## 2026-07-14　元件微調（selector / tag / 邊框）

- **checkbox / radio**：修等寬等高 bug——`.cbx.sz-m` 等尺寸 class 撞到通用按鈕 `.sz-m`（帶 `padding:0 16px`），border-box 下被撐成長方形；base 補 `padding:0;box-sizing:border-box;flex:0 0 auto`。移除 focus 外陰影（只留框色）。size 軸收成只剩 `m`（矩陣、轉盤、Live 分段、公式同步）。
- **tag**：新增 `corner` 軸（圓角 999 / 方角 5px），矩陣欄＝intent×corner、Live 加 Corner 分段、轉盤多一軸。字級 padding 縮一級（font 12→11、pad 11→8、height 26→22）與按鈕拉開。移除 `selected` 狀態。
- **outline 邊框 0.75px**：button / field(input+dropdown) / textarea / file / tag 的 base border 一律 `0.75px`（filled/solid 邊框透明或同色不受影響）。

## 2026-07-14　側邊欄 menu list 大改版

- 類別標題與頁籤標題同字級/字重/色（sans 13.5 / 600 / `--muted`）；計數＋chevron 靠標題右側、標題靠左、無底色。
- 展開內層往內縮＋導引細線；類別間 1px `--line` 分隔線。
- 當前頁淺藍底（`.nav-item[aria-current]`）；「匯出需求」pin 套同一套高亮邏輯。
- 建立狀態改成右側色圈（綠已定案／琥珀部分／灰待建），移除文字 tag。hover 底色調淺（`--panel-2`→`--canvas`）。類別標題前加 emoji（🧱/🧩/📊）。

## 2026-07-14　分類藍圖重組（8 組 → 3 組、37 項）

- **Basic（18）**：併入 Feedback（alert/tooltip/notification）、Loading（skeleton/loader）、Media（image）。
- **Complex（15）**：收 step、announcement、section-head。
- **Table & Chart（4）**：table、chart 各自子部件收成一頁；併入原 Special（tree-view / schedule-chart）。
- selector / tag 狀態改「已定案」。詳見 memory `project_ds_component_taxonomy`。

## 2026-07-14　品牌 / 主題 / scrollbar

- 站名改 **Design System Library**；topbar 換 **GOONS logo**（單一 path + `currentColor`，色綁 `--ink` → 深淺自動替換）。
- 主題切換鈕改 **toggle switch**（軌道＋滑動 knob，深色右滑、太陽/月亮）。
- **scrollbar**：最終改**純標準屬性**（`scrollbar-width:thin` + `scrollbar-color`，會被繼承，側邊欄與整頁自動一致）——不再混用 `::-webkit-scrollbar`（與標準並存會讓 Chrome 對 root/元素捲軸走不同渲染、一粗一細）。無底色、深淺分色（淺 `#C4C9D3` / 深 `#3D4553`）。

## 2026-07-14　匯出需求頁（原「複雜度確認」）大改

- 頁名改 **匯出需求**（pin、eyebrow、h1）；設為**預設首頁**、**預設展開第一張**卡片。
- 元件牌卡可**展開／收合**；展開顯示該元件在自己頁面上的**實際操作 Live**——抽出共用 `LIVE` registry（button/input/dropdown/checkbox/radio/tag/tab），**元件頁與此頁共用同一份**、不 drift。
- 牌卡前加**選取 checkbox**（決定要不要產出，`SUMSEL`）；右下角「**我要調整**」→ 跳該元件頁（checkbox/radio → selector）。
- **「AI 建議產出」toggle**：開→套用建議（已定案 6 顆）並存快照；關→還原點擊前選擇；手動改勾選即脫離 AI 態。
- 「複製並匯出JSON」primary 按鈕移到**頁面右上角**（只匯出已選元件）。
- 每頁底部固定 footer：`© 2026 GOONS DESIGN, all rights reserved. Powered by 最厲害的 Yuu`。

## 2026-07-14　大頁面框架改 app-shell（RWD 基礎修正）

- 從「document 捲動 + sticky」換成 **app-shell**：`.shell` 固定 `100vh/100dvh` flex 直列、`body{overflow:hidden}`；topbar `flex:0 0 58px`；`.layout flex:1;min-height:0`；`.sidebar` 與 `.main` 各自 `overflow:auto` 內捲（`min-height/min-width:0`）。
- 側邊欄寬 `max(200px,20vw)`；`.container max-width:none`（內容填滿寬）；main 高度填滿、內容過寬可左右捲。
- 解掉舊的「sticky 側欄比內容矮 → 左欄下方露白」bug（不再需要漸層補底）。`renderView` 改捲 `.main`。

## 2026-07-14　Basic 排序重整 + Tab 家族頁

- **Basic 18 項改依「心智模型」排序**（原本前 6 依建置狀態、之後無邏輯）：動作(button) → 表單輸入(input/dropdown/selector) → 導覽(tab/menu/action-menu/breadcrumb/pagination) → 標示內容(tag/icon/price/image) → 回饋(alert/notification/tooltip) → 載入(skeleton/loader)。順序講「使用者主動操作 → 系統被動回饋」的故事。tab 從第 6 移入導覽群、tag 從第 5 移入標示群。
- **Tab 擴成家族頁**（tab + tab-item + toggle），狀態改 `ready`：
  - 基本 tab：三 variant 併成 **State × Variant 對照表**（列＝狀態、欄＝底線／容器／藥丸並排）+ 轉盤 + Live（內容開關 icon／count，`LIVE.tab` 共用到匯出需求頁）。
  - **size 軸 m/s**：加入 `.tabi.sz-s`（h30／padding12／font12.5，count/icon 同步縮小）；DIAL_SPECS.tab 加 size 軸，公式 `3 × 4 × 2`；轉盤勾 size → 每 size 各出一張對照表（標準 m／小 s），Live 加 size seg。
  - **contained 圓角改 999**：`.v-contained .tabi` border-radius 8 → 999（帶邊框的藥丸，仍與 pill 的無邊框灰底容器區隔）。
  - **tab-item 原子**：`tabItemEl()` 支援 leading icon（TAB_ICONS 池：house/list/gear）、count badge（`.tcount`，選中態轉 accent 底）、size m/s；四種內容組合示意。（可關閉 × 已依需求移除）。
  - **toggle 開關**：新增 `.switch` 樣式 + `switchEl()`；關／開／停用(關)／停用(開) 四態 + 可點擊 Live。

## 2026-07-14　回饋+載入 5 頁（平行 workflow 首批）

用平行 workflow 一次產 5 顆元件頁（每顆一個 agent 產 self-contained `buildXxx` + namespace CSS），主控端序列整合。狀態設 `partial`（已建、待 Yuu 定案軸）。

- **alert**（`.al-`）：intent(success/warning/error/info) × layout(banner/stacked/compact)=12；白底 inline-card + intent 圖示 + accent line（banner/compact 左直條、stacked 頂橫條）+ brand CTA + dismiss ×。feature：icon/title/action/dismissible。
- **tooltip**（`.tt-`）：placement(top/bottom/left/right) × size(s/m)=8；solid 深底白字（`--ink`/`--canvas` 反相、免 feedback hex）+ rotate 方塊箭頭；Live 真 hover 浮出。feature：with-arrow / placement-auto（行為旗標僅文案示意）。
- **notification**（`.nt-`）：variant(solid/outline/soft) × intent 4=12 toast 卡 + Position 三停靠小螢幕示意；auto-dismiss 進度條 CSS 動畫、hover 暫停。feature：close/icon/action/auto-dismiss。
- **skeleton**（`.sk-`）：shape(text/rect/circle) × size(s/m/l)=9；純中性 `--panel-3` 佔位；shimmer/pulse/none 動畫對照 + 組合範例（頭像卡）；`prefers-reduced-motion` 停動畫。
- **loader**（`.ld-`）：variant(circular/dots/bar) × size=9 + intent(neutral/primary) 對照；keyframes `ld-spin/ld-bounce/ld-bar`；feature：label/inline/full-screen/progress。

**整合方式**：CSS 插 `</style>` 前、`buildXxx` 插 `const BUILD=` 前、擴充 BUILD map；撞名稽核（僅註解內 token 路徑誤判、零實際撞名）；整檔 `node --check` + 5 頁 Playwright render 驗證。
**待辦**：success/warning/info 回饋色框架尚無 token，暫用固定 hex（CSS 標 TODO）；這 5 頁尚未接進「匯出需求」中央轉盤（各自 local 軸），待定案後再決定是否納入。

## 2026-07-14　狀態定案 + notification 接入 summary + 刪除 alert

- **notification/tooltip/skeleton/loader 狀態 partial→ready**（NAV 綠點）。
- **notification 接入匯出需求頁**：`NT_IC_*`/`NT_ICON`/`NT_TITLE`/`NT_MSG`/`dismiss`（改名 `ntDismiss`）/`ntEl` 提升頂層、註冊 `LIVE.notification`；buildNotification 改接 `DIAL_SPECS.notification`＋`CHOICE`；加 DIAL_SPECS/DIAL_PAGE 條目。summary 卡片依側邊欄序出現在 tag 之後（4×4=16）。ntRectEl + rect 區塊保留在頁面（不進 summary Live）。
- **刪除 alert 元件**（Yuu：其他元件已能涵蓋其功能）：移除 NAV 項、`.al-*` CSS、`buildAlert` 函式、BUILD map 的 `alert:buildAlert`。Basic 由 18→17；alert 本就不在 DIAL_SPECS，summary 無殘留。

## 2026-07-14　notification 調整（說明文字 flag + auto-dismiss 簡化）

- **說明文字改 feature flag**：`ntEl` 的 `nt-msg` 從固定顯示改成 `opts.desc!==false` 條件顯示（預設仍顯示，矩陣外觀不變）；Live 加 `說明文字` bool（with-icon 之後）。關掉只留標題。features 說明同步補上。
- **auto-dismiss 拿掉倒數進度條**：移除 `.nt-bar`／`@keyframes nt-count`／`restartBar` 與 hover 暫停；改成 `setTimeout` 3 秒後直接 `dismiss` 淡出（示意用復原後重新計時）。注意坑：`arm()` 在 `ntEl` 建構時呼叫，此時 toast 尚未 append，`isConnected` 為 false → isConnected 檢查要移到 timer **觸發時**、不能在設定時。
- **info icon 改實心**：`NT_IC_INFO` 從 Phosphor outline（空心環）換成 fill 實心版，與 success／warning／error 三個 fill icon 一致。
- **加第 4 個 variant `dark`（半透明黑）**：`.nt-v-dark` frosted 半透明黑底（`rgba(22,24,30,.82)` + backdrop blur）、白字、icon 保留 intent 語意色、白 ×。矩陣 3×4→**4×4=16**；軸/zh/VN/Live seg/lede/formula 同步更新。
- **加 Rect Toast 方形（獨立區塊）**：對齊 Yuu Figma guideline 的 `toast/rect_success`（置中方形：圓 icon badge 在上、文字在下、白底圓角 8、toast 陰影 w124）。icon badge 32px（內 svg 18px）、文字 14px 一般內文。卡片固定 124×124 方形；互動改用一致的 `.chk` checkbox「自動輪播」，勾選後每 3 秒切換一種 intent（`setInterval`，離開頁面自動停），取消清空。`ntRectEl(intent)` + `.nt-rect`；intent 配色沿用本頁 DS 色（非 Figma 橘）。靜態四意圖預覽 + 互動（選 intent → 顯示 toast → `requestAnimationFrame` 彈入、3 秒 `setTimeout` 自動移除）。獨立於上方 banner 矩陣，屬另一個 layout 格式。

## 2026-07-14　tooltip/skeleton/loader 接入匯出需求頁

- **接中央 store**：把 tooltip/skeleton/loader 三顆從「自包含 local 軸」改成接 `DIAL_SPECS`＋`CHOICE`（與既有 8 顆一致），summary 才能顯示軸 chips＋計數。alert/notification 因 Yuu 還要調整，**維持自包含、不進 summary**。
- **builder 提升頂層**：tooltip 的 `TT_INFO/ttEl/ttTrigger`、loader 的 `loaderEl` 原本 nested 在 buildFn 內 → 提升到頂層，並註冊 `LIVE.tooltip/skeleton/loader`（skeleton 的 `skelEl` 等本就在頂層）；summary 卡展開即用 `LIVE[id]` 掛實際操作。頁面 `mountLive` 改呼叫 `LIVE.xxx(sl)`（單一來源、免漂移）。
- **summary 卡片改依側邊欄順序**：`renderSummary` 不再照 `Object.keys(DIAL_SPECS)`，改用 `_navOrder`（NAV flatMap）＋ `DIAL_PAGE` 反查排序（checkbox/radio 同映射 selector、穩定排序保留原序）。實測序＝button→input→dropdown→checkbox→radio→tab→tag→tooltip→skeleton→loader。
- 轉換用 tokenizer-aware brace matcher（跳過字串/樣板/註解）精準替換三個函式，`node --check` + Playwright 驗證 10 張卡 Live 全掛、alert/notification 未進。

## 2026-07-15　上線 GitHub + Vercel／導覽 4 顆（平行 workflow 第二批）+ review 修正

**上線基礎建設**：本資料夾接 GitHub **public** repo `edward890131/goons-ds-library`（push 全歷史）＋ **Vercel** 部署（綁 repo、push 自動重新部署）：**https://goons-ds-library.vercel.app** 。`vercel.json` 用 rewrite 把根網址 `/` 導到 `ds-component-gallery.html`；README 補專案說明＋線上連結。

**平行建 4 顆導覽元件**（做法同首批：平行產碼＋序列整合；4 個 agent 各讀同檔 helper 合約＋golden 範例 buildTooltip、依 L0 軸線設計，回傳 namespaced CSS＋`buildXxx`＋`DIAL_SPECS/DIAL_PAGE/BUILD/LIVE` 字串，主控端序列插入）：
- **Menu 選單**（`mn-`）：常駐導航容器。variant(horizontal/vertical) × state(default/hover/active/disabled/focus) × size(s/m/l)＝**2×5×3=30**。State×Size 矩陣＋Orientation（navbar 橫／sidebar 直，active 指示）＋Live 點項切 active。
- **Action Menu 動作選單**（`am-`）：trigger 觸發浮出的動作清單（≠ dropdown 表單選值、≠ menu 常駐導航）。variant(default/with-icon/with-divider) × state(closed/open/hover/focused/disabled) × size＝**3×5×3=45**。Variant×Size 矩陣（展開面板）＋Item States 排＋Live 可開合。
- **Breadcrumb 麵包屑**（`bc-`）：階層路徑。L0 原生 variant/size 皆空、state=default/hover/current。**gallery 端補一個 separator 軸**（chevron/slash/arrow）讓它能進總覽——已在 lede 明確註記此為陳列頁擴充、非 L0 定義（呼應「未來以 library 為主體」的方向）。States 排＋分隔符×(標準/省略) 矩陣＋Live 切分隔符/省略/層數。
- **Pagination 分頁器**（`pg-`）：variant(numbered/prev-next) × state(default/hover/active/disabled) × size＝**2×4×3=24**。單顆頁碼鈕 State×Size 矩陣＋numbered/prev-next 並排＋Live 點頁碼真的移動 current。
- 4 顆 NAV 狀態設 **ready**；全數接中央 store、進「複雜度確認」總覽頁，序＝…tab／menu／action-menu／breadcrumb／pagination／tag…（依側邊欄由上至下）。

**Yuu review 修正（4 項，皆以 computed style 屬性查驗通過）**：
- **Menu**：focus 外框 `2px→1px`；垂直 sidebar 的 active 左側指示線段移除（`.mn-bar--vertical .mn-item--active .mn-ind{display:none}`，保留 `--i-primary-tint` 底當指示）。
- **Pagination**：非 active 頁碼鈕去外框（base `border` 改 transparent、hover 只留底色不加框）；current 仍 `--i-primary` 實心。達成「直接呈現數字」。
- **Breadcrumb**：hover 去底線、只變色（移除 `text-decoration:underline`）。
- **Action Menu**：修正浮出面板在矩陣格子內被壓成單列高的 bug（見踩坑）。後續延伸修 Live 區同坑（根因統一到 base `.am-panel{min-height:max-content}`、Live 面板改順流排 trigger 下方）。
- **Action Menu（trigger 統一）**：Live 的「動作」trigger 原本是自訂 `.am-trigger`（solid 底卻配 outline 文字色的混搭），改成直接沿用 Button 元件 class `.btn v-solid i-secondary sz-m live`（次要實心），computed 樣式與按鈕頁 100% 一致（bg/color/height/radius/border/font/padding/gap 全對）；僅保留 `.am-trig .am-tcaret` 處理 caret 展開翻轉。
- **Action Menu（Live 互動）**：Live 展開後不再預設第一項 focused、全部 default；新增 scoped `.am-live-wrap .am-item:hover`（含 danger 項走 danger-tint）讓**真滑鼠 hover** 能看到 hover 效果（實測 hover 背景＝`--panel-2`）。矩陣仍用 class 版 `.st-hover` 靜態展示、不受影響。
- **匯出需求頁**：移除「第一張牌卡預設展開」的設定，改成**全部預設收合**（`sumcard` 一律加 `collapsed`、移除 i===0 立即掛 Live 的分支）；Live 仍由展開時 lazy 掛載。

## 2026-07-15　媒體/標示 3 顆（icon / price / image，平行 workflow 第三批）

**平行建**（做法同前批：3 個 agent 依 L0 軸線各產 self-contained `buildXxx`＋namespaced CSS，主控端序列整合、接中央 store、進總覽頁）：
- **Icon 圖示**（`ic-`）：採 **Phosphor**（Yuu 指定的開源 set，單一 weight、fill-based、viewBox 256）。L0 的 variant（line/solid/duocolor/duotone，源自 Untitled UI）**不採用**、改以 Phosphor 現實陳列並在 lede 註記落差。軸＝`size × tone`＝**4×4=16**（size s/m/l/xl＝16/20/24/32 px 為 L0 原生；**tone 為陳列頁擴充軸**，對應 `semantic.icon.*`）。含 Size×Tone 矩陣＋Icon Library grid（20 顆：既有 `ICON_*` 15＋自訂 heart/star/bell/trash/user）＋Usage（decorative/semantic、行內對齊、in-button）＋Live。
- **Price 價格**（`pr-`）：variant(normal/discount/sale/free) × size(sm/md/lg)＝**4×3=12**。discount 用真 `<s>` 包原價（`line-through`＋`aria-label` 讓報讀「原價 X、優惠價 Y」）、sale 帶 SALE badge、free 標「免費」。矩陣＋情境示意＋Live。
- **Image 圖片**（`im-`）：variant(rectangular/rounded/circular 形狀) × state(default/loading/error) × size(s/m/l/xl)。**素材統一用 Unsplash**（`images.unsplash.com` CDN，10 個 ID 事前 curl 驗證 200；circular 用人像圖）。default=真圖 object-fit cover、loading=shimmer 骨架、error=破圖 icon＋「載入失敗」。Shape×State 矩陣（實測 8 張圖全載入 400×400）＋Size 列＋Live。**註**：image 是唯一允許外部資源（Unsplash CDN）的元件，非嚴格自包含，但 CDN 圖在 Vercel/本機皆正常。
- 3 顆 NAV 設 **ready**；序＝…pagination／**icon／price／image**／notification…（依側邊欄）。

## 2026-07-15　icon 換官方 Phosphor regular 全集 + image 換美圖／加長寬比

**Icon**：Yuu 反映 gear/heart 有立體感、跟線框不搭（實際是 house/x-circle/sparkle 為 fill 實心、整組 weight 混雜）。改用**官方 Phosphor regular（線框）**：curl `phosphor-icons/core` 的 `assets/regular/*.svg`、事前驗證 200，抓 **38 顆常見 dashboard icon** 重建 Icon Library（house/dashboard/settings/user/users/bell/search/calendar/clock/chart-bar/trending/pie/folder/file/mail/download/upload/trash/edit/plus/check/close/caret-down/arrow-right/heart/star/eye/tag/filter/sliders/card/money/cart/bookmark/chat/gift/location/logout）。全部單一 regular weight、風格一致。矩陣示意 icon／LIVE glyph／Usage 都改用新 regular（gear→settings/dashboard）。**與其他元件共用的舊 `ICON_*`（menu/input/summary 在用）不動**，library 改用獨立 `IC_*` regular 集、解耦（menu 側邊欄仍用舊 fill icon，之後要統一再議）。

**Image**：① 換掉醜圖 → 8 張 curl 驗證的**漂亮自然風景** Unsplash（山湖／森林／瀑布／綠丘）；circular 改用構圖置中的湖光山色（不再用人像）。② `imUrl` 拿掉 `&h`（不鎖正方），裁切交給盒子 `aspect-ratio` + `object-fit:cover`，圖片 w 400→600。③ **新增長寬比軸 ratio**（`1:1 / 4:3 / 16:9 / 2:1`）：進 `DIAL_SPECS`（image 變 4 軸、summary 顯示 **3×3×4×4=144**）、CSS 加 `.im-r-*` aspect-ratio、`imEl` 加 ratio class（circular 恆正方不套）、新增「Ratio 長寬比」section、LIVE 加 ratio 控制。

**（同日再調）size 改由「高度」驅動**：Yuu 指定 s/m/l/xl 高度＝**40／64／120／240 px**，寬度交給 `aspect-ratio` 依比例算（`.im-sz-*` 從設 width 改設 height、`.im-box` 保留 `aspect-ratio:1` 預設方形）。Size section 標註改高度值；Ratio section 改「固定高度（l＝120）、寬度依比例伸縮」（1:1 120×120、4:3 160×120、16:9 213×120、2:1 240×120）；circular 恆正方。

## 2026-07-15　Tag 加 danger intent + price SALE 統一用 DS Tag

Yuu 發現 price 的 SALE 是價格 agent 自製的 `.pr-badge`（沒用 DS Tag 元件）。因 **alert 已刪**（當初 Tag 不做 feedback 色的理由消失），決定**幫 Tag 元件補 `danger` intent**、SALE 維持紅：
- **Tag**：CSS 加 `.tg.i-danger`（鏡射 i-brand、綁 `--i-danger` token）；`DIAL_SPECS.tag` intent 軸 `brand/neutral → +danger`（矩陣/轉盤/summary 自動長出 danger，18 顆紅 tag；tag 全展 3×2×2→**3×2×3=18**）；`buildTag` 的 colLab 從硬寫 `brand?品牌:中性` 改用 `zh.intent[]` map（否則 danger 誤標中性）；LIVE.tag intent seg 加 danger；lede/formula 更新。
- **Price**：`prEl` 的 sale 從 `<span class="pr-badge">` 改成 DS Tag `<span class="tg v-solid c-round i-danger st-default"><span>SALE</span></span>`；移除 `.pr-badge` CSS、加 `.pr-price .tg{align-self:center}`（在 baseline flex 內置中）。實測 SALE 背景＝`--i-danger`、與 Tag 元件同源。

## 2026-07-15　「複雜度轉盤」改名變數篩選器 + Complex 群組重排

- **改名**：各元件頁的可收合「**複雜度轉盤**」→「**變數篩選器**」（6 處：mountDial 標題、button 頁硬寫標題、summary lede 引用、3 處註解）。**匯出總覽頁「複雜度確認」不動**（不同東西）。
- **Complex 群組重排**：原 15 顆順序無規律，改依**心智模型 5 群**（維持扁平側邊欄、相鄰即群、與 Basic 一致，NAV 內加群註解）：① 版面結構 header／footer／section-head ② 內容容器 card／list／collapse ③ 內容卡片 product-card／category-tile／article-card／announcement ④ 覆蓋／浮動 modal／drawer／floating-line ⑤ 流程／時間 step／calendar。敘事：頁面骨架 → 裝內容的容器 → 特定內容卡 → 浮在上層的覆蓋層 → 流程與時間。summary 卡片依 NAV 順序、自動跟進。

## 2026-07-15　新增「Card 卡片」群 + calendar 移入 Table & Chart

側邊欄從 3 大組 → **4 大組**（共 36 項不變）：
- **新增「Card 卡片」群**（🗂️，放 Basic 之後、Complex 之前）：把 `card` 與內容卡 `product-card／category-tile／article-card／announcement-item` 從 Complex 抽出獨立成群（5 項）。
- **calendar 移入 Table & Chart**（放末尾、跟 schedule-chart 同屬時間類）。
- **Complex 瘦身為 9 項**：header／footer／section-head（版面結構）、list／collapse（容器）、modal／drawer／floating-line（覆蓋/浮動）、step（流程）。
- 群順序＝Basic → Card → Complex → Table & Chart（積木 → 內容卡 → 結構/覆蓋 → 資料）。summary 卡片依 NAV 順序自動跟進（Card/Complex/T&C 尚未建、暫不進總覽）。

## 已知踩坑（避免重犯）
- summary 卡片要「接進匯出需求頁」＝該元件必須進 `DIAL_SPECS`（給軸/計數）＋ 有頂層 `LIVE[id]`（給展開的實際操作）。自包含頁若 Live builder nested 在 buildFn 內，summary 首次載入時 `LIVE[id]` 還沒定義 → 必須把 builder 提升頂層再註冊。
- 平行建「同一個 self-contained 單檔」的多個頁面：不要讓多 agent 同時寫檔（會衝突）。正解＝平行「設計+產碼」（各回傳 namespace 過的 `buildXxx`+CSS 字串）、主控端序列整合。CSS class 一律加元件前綴防撞。
- 本機用 Playwright 驗證含中文的 HTML：`python -m http.server` 要送 `charset=utf-8`，否則瀏覽器誤解碼中文、噴假的 JS 語法錯（`node --check` 過就是 server 的鍋）。`file://` 會被 Playwright 擋。
- SVG 放在 `inline-flex` 容器內、寬度用 `%` 會塌成 0px → icon 尺寸一律用固定 px。
- `var()` 在 `::-webkit-scrollbar-*` 偽元素解析不穩，會掉回瀏覽器預設；捲軸樣式用明確 hex 或純標準 `scrollbar-*` 屬性。
- 尺寸類 class（sz-s/m/l）跨元件共用會撞（按鈕 padding 洩漏到 checkbox）→ 命名或在 base 重置 padding/box-sizing。
- **頂層 `const` 陣列/物件引用「定義在更後面」的 `const` 會 TDZ 崩整份 script**：icon 的 `const IC_LIBRARY=[...ICON_SPARK...]` 在載入時求值，但 `ICON_SPARK`（給 summary 用、定義在檔案較後）當下還在 TDZ → `ReferenceError: Cannot access 'ICON_SPARK' before initialization`，整個 `<script>` 中斷。平行產碼的元件被「插在 BUILD 前」，很容易跨過某些後定義的常數。修法：把這種 top-level 資料改成**延遲函式**（`function icLibrary(){return [...]}`，render 時才求值），或確保被引用的常數定義在前。整合後**務必開 console 看有沒有 error**（node --check 抓不到 TDZ，只有執行時才爆）。
- **`flex-direction:column` 的高瘦卡片巢在別的 flex/grid 容器內，auto min-height 會被算成單列高、內容溢出**（實測 action-menu 面板 `offsetHeight=32/40` 但 `scrollHeight=151`）。`align-self`／`flex:none`／改父層 `align-items`／改順流 都無效，**只有撐 `min-height:max-content` 有效**。此坑**會同時出現在矩陣（`.mcell` 內）與 Live（`.am-live-wrap` flex 容器內）兩處** —— 一開始只 scoped `.mcell` 修矩陣，Live 仍壞；正解是把 `min-height:max-content` 加在 **base `.am-panel`**（一次涵蓋所有掛載位置）。凡「容器裡放 flex-column 卡片」的元件都要在該卡片 base 補這行。（另：Live 的浮出面板也從 `position:absolute` 改順流排在 trigger 下方，框才會跟著長高、開合時 stage 130↔295 伸縮。）

## 2026-07-15　Complex 群序上移 + Complex 9 顆全數建置（平行 agent）

- **群序調整**：把 **Complex 移到 Card 之上** → 側邊欄群序＝**Basic → Complex → Card → Table & Chart**（積木 → 結構/覆蓋 → 內容卡 → 資料）。
- **Complex 9 顆一次建完**（開 9 個並行 agent、各回傳 namespace 過的 `buildXxx`＋CSS＋store 片段，主控端序列整合）：
  - **header**（`hdr-`）：layout(logo-nav/logo-search/centered) × density(comfortable/compact)＝3×2。矩陣每格一整條頁首 bar（logo＋導覽/搜尋＋登入 CTA＋鈴鐺＋頭像）、行動版收合列、Live。自訂 icon `HDR_IC_BELL/LIST`。
  - **footer**（`ftr-`）：variant(rich/simple/minimal)，勾選幾個就渲染幾段完整頁尾。rich＝品牌＋4 欄連結＋電子報訂閱＋社群＋語言 pill。自訂 6 社群/品牌 icon。Live。
  - **section-head**（`sch-`）：align(left/center) × size(m/l)。矩陣＋5 種內容組合（eyebrow/計數 badge/分隔線/filter 群/麵包屑 eyebrow）＋Live。重用 Button/Tag/ICON_ARROW，無自訂 icon。
  - **list**（`lst-`）：variant(simple/detailed/avatar) × state(default/hover/selected/disabled)。矩陣＋整組列表（可多選＋分隔線＋動作鈕）＋Live。重用 `.cbx`/Button/ICON_*。自訂 `LST_IC_CHEVRON`。
  - **collapse**（`cps-`）：variant(bordered/filled/plain) × state(collapsed/expanded/hover/disabled)。矩陣＋真互動手風琴（單開）＋Live（multiple 切多開）。caret 用 ICON_CARET rotate 180。自訂 `CPS_ICON_QUESTION`。
  - **modal**（`mdl-`）：variant(dialog/confirm/form) × size(s/m/l)。矩陣（縮小靜態卡）＋浮層結構示意＋Live（**overlay `position:absolute` 限縮在 stage 內、不遮全頁**，× / 取消 / 點遮罩可關）。重用 Button（含 i-danger 刪除）/field。自訂 `MDL_ICON_WARNING`。
  - **drawer**（`drw-`）：side(left/right) × size(s/m/l)。矩陣（裝置框內滑入抽屜＋backdrop）＋內容結構＋Live（stage 內滑入動畫、close/backdrop 可關）。backdrop 用 `color-mix` 從 token 混。無自訂 icon。
  - **floating-line**（`flo-`）：variant(selection/toolbar/fab) × position(bottom-center/bottom-right)。矩陣（假內容區浮動列）＋型態細節＋Live。selection pill 用 `--ink`底/`--canvas`字（自動反相）。自訂 `FLO_ICON_PLUS/TRASH`。
  - **step**（`stp-`）：orientation(horizontal/vertical) × variant(numbered/dotted/icon)。矩陣（4 步混合狀態 stepper）＋單一 step 狀態列（done/current/todo/error/disabled）＋Live（上一步/下一步互動）。自訂 `STP_ICON_WARN`。
- **驗證**：整合後 `node --check` 過；Playwright 逐頁 `renderView` 9 頁全渲染、**0 console error**；匯出總覽頁 27 卡（18 舊＋9 新）正常；modal Live overlay 實測 `position:absolute` 限縮 stage、側邊欄仍可見。
- **NAV 狀態**：9 顆全設 `st:'ready'`。**Complex 群 9/9 建置完成**。
- **整合手法沿用**：9 agent 各寫 7 個分離純文字檔（css/icons.js/build.js/dialspec/dialpage/buildmap/live）避開 JSON escape；主控端用 `integrate.js` 依 8 個錨點序列插入（CSS 進 `</style>` 前、buildFn 進 `const BUILD=` 前、dialspec 進 DIAL_SPECS、dialpage/buildmap/NAV ready flag）。事前掃描跨檔命名衝突＋未定義 token（皆 0）。

## 2026-07-15　Header 整修：原子重用 + 分類邏輯重構

依 Yuu 6 點回饋改寫 Header：
- **陳列改「上下堆疊」**：原 layout×density 2D 矩陣把整條頁首 bar 擠進窄欄 → 改成 `.hdr-stack` 垂直堆疊，每條 bar 全寬、上方帶 caption，不再擠壓。
- **logo 換 Goons 官方字標**：`hdrLogo` 從「accent 方塊＋文字 Goons」改成**複用檔內 topbar 既有的 Goons wordmark svg**（`apply_header.js` 自動從 `.brand-logo` 抽出、去 class、注入 `HDR_LOGO` 常數，避免手抄長 path）。
- **登入鈕移到 avatar 右側**：`hdrActions` 順序 登入→鈴鐺→頭像　改成　**鈴鐺→頭像→登入**（登入最右）。
- **搜尋與導覽並存（分類邏輯重構）**：原 `layout` 軸 logo-nav／logo-search／centered **互斥** → 拿掉。改成 **導覽（nav）與搜尋（search）都是可並存的內容開關**，bar 版位＝`logo · nav · spacer · search · actions`，兩者可同時出現。
- **行動版/電腦版升格為軸**：新增 `device` 軸（desktop／mobile），取代原本獨立的「行動版收合」section；篩選器與 Live 都可切換。行動版導覽收進漢堡鈕。DIAL_SPECS.header 改 `device × density`（2×2=4）。
- **原子建構原則**：header 內部零件全部改用 library 既有元件——**導覽＝Menu 元件 `mnBar('horizontal')`**（在 header 內用 `.hdr-nav-slot .mn-bar{border:0;background:transparent;padding:0}` de-chrome）、搜尋＝Search／Input `.field v-outline`、漢堡/鈴鐺＝Button icon-only、登入＝`.btn v-solid i-primary`。specStrip 加 `atoms` 欄標註 Button·Icon Button·Menu·Search。
- **驗證**：`node --check` 過；Playwright renderView header **0 console error**、4 條上下堆疊 bar、nav 用 `.mn-item`（Menu 元件）、logo svg、nav+search 並存、actions 順序 bell→avatar→login、mobile 有漢堡，全數確認。
- **新增 feedback memory**：`feedback_ds_atomic_reuse` — 複合元件內部一律取用 library 原子、禁 inline 重畫（Yuu 要求「確保不再犯」）。

## 2026-07-15　Header 微調：移除緊湊密度 + icon btn 補 .live 吃 hover

- **移除「緊湊 compact」**：Header 拿掉 density 軸，DIAL_SPECS.header 改單軸 `device`（desktop／mobile），陳列從 4 條 → 2 條堆疊 bar；Live 移除密度 seg；清掉所有 `.hdr-compact` CSS（0 殘留）。
- **修 icon btn 沒 hover**：Button 元件把真實 `:hover`/`:active` 用 `.live` class 把關（矩陣格子用 `.st-hover`/`.st-pressed` 假狀態、不吃真 hover）。header 的鈴鐺／漢堡／登入鈕原本漏了 `.live` → 全補上（`btn v-text i-secondary sz-s icon-only live` 等），實測 hover 後背景轉 `--i-sec-tint`（`rgba(90,100,116,.1)`）。頭像加 `:hover` inset ring。**釐清**：無底色無外框的純 icon btn 樣式本來就有（`v-text`＋`icon-only`），只是要 `.live` 才有真實 hover。
- **memory**：`feedback_ds_atomic_reuse` 補記「重用 .btn 的互動實例必須加 .live 才吃 hover」。
- 驗證：`node --check` 過、Playwright 0 console error、2 條堆疊 bar、7 顆按鈕全帶 live、`.v-text.live:hover` 規則存在、實測 hover 背景變色。

## 2026-07-15　Button 補完：新增 soft 淺色變體 + Live 加 icon-only 開關

Yuu 檢查 Button 發現兩缺口：
- **Live 沒有 icon-only 選項**：Button 元件本來就支援 icon-only（`mkBtn` 有 `iconOnly`、下方「Content 內容軸」靜態區也展示 `show-label=false (icon-only)`），只是**實際互動 Live 的 Content 勾選漏了**。已補：button 頁 renderLive 的 checks 加 `['iconOnly','icon only']`、stage mkBtn 傳 `iconOnly`、`live` 物件加 `iconOnly:false`；registry `LIVE.button` 的 bools/render 同步加（summary 展開頁也吃到）。
- **缺 soft 淺色變體**：Button 只有 solid/outline/text，沒有 avatar 那種「淡底填色＋彩色字」的 soft 樣式。已新增 **`v-soft`**：CSS `.v-soft{background:var(--tint);color:var(--fg);border-color:transparent}` + hover/pressed/live 用 `--tint2`；`AXES.variant`＝`['solid','soft','outline','text']`（矩陣/變數篩選器/summary 自動長出 soft 欄，button 全展 3→**4 variant**，FULL 108→**144**、公式 `4×3×4×3`）；`ZH.variant` 加 `soft:'柔色'`、`VDESC` 加 soft 說明；LIVE.button 與 renderLive 的 free 對照列加 soft、note 更新。
- **驗證**：`node --check` 過、Playwright 0 console error；矩陣 4 variant panel（實心/柔色/外框/文字）、Live Content 含 icon only（勾選後 stage 按鈕帶 `icon-only`）、soft primary 實測 bg=`rgba(51,88,212,.1)`/color=`rgb(51,88,212)`、公式顯示 144。

## 2026-07-15　統一：header avatar 改走 Button v-soft 原子

延續 soft 變體，把 header 頭像從自製淺色圓形元素改成**複用 Button `v-soft` 原子**：
- `hdrAvatar` 從 `<div class="hdr-avatar">` 改成 `<button class="btn v-soft i-primary sz-s icon-only live hdr-avatar">楊</button>`。
- CSS 移除自製的 `.hdr-avatar{background/color/...}` 與 `:hover` ring，只留 `.hdr-avatar.btn{border-radius:50%}` 把 32px 方鈕覆蓋成圓形；底色/文字色/尺寸/hover 全部繼承 Button v-soft（`--tint`/`--fg`，hover→`--tint2`）。
- 掃描確認：其餘 tint 背景（menu active、list selected、tab/toggle on、action-menu focus 等）都是**元件內部狀態色**、非獨立 soft 按鈕，維持原樣不動；複合元件內沒有其他自製 soft 鈕。
- 驗證：`node --check` 過、Playwright 0 console error；avatar tag=BUTTON、class 含 `btn v-soft`、圓形 radius 50%、bg=`rgba(51,88,212,.1)`、hover→`rgba(51,88,212,.2)`、文字「楊」，外觀與改前一致但多了真實 hover。

## 2026-07-15　統一 gear icon：舊 ICON_GEAR → 新版 settings（IC_SETTINGS）

Yuu 發現 tab／menu 等元件仍用「已移除的舊 gear」。查出檔內有兩顆 gear：舊 `ICON_GEAR`（line 1983，被 6 顆元件共用）與 icon library 重建後的新版 `IC_SETTINGS`（Phosphor regular，兩者 path 微異，`107.6`→`107.21`）。
- **做法**：把 `ICON_GEAR` 的 svg 內容替換成 `IC_SETTINGS` 的 glyph（保留 const 名，單一 literal 替換）。**不直接 `const ICON_GEAR=IC_SETTINGS`**，因 `TAB_ICONS`／`MN_ICONS` 等 top-level const 在 IC_SETTINGS 定義之前求值、會 TDZ。改一處即讓所有共用處同步。
- **波及並全部更新**：tab（TAB_ICONS）、menu（MN_ICONS）、list（LST_LEAD_ICONS＋動作鈕）、drawer（DRW_NAV「系統設定」）、floating-line（FLO_TOOLS）、step（STP_ICONS＋「完成設定」）共 6 顆。
- **驗證**：`node --check` 過；`ICON_GEAR===IC_SETTINGS` glyph；Playwright renderView 6 顆全渲染新版 gear（尾段特徵 `199.87` 有、舊 `199.9` 無）、0 console error。
- **新規則 memory**：`feedback_ds_crosscomponent_confirm` — 改動會牽動其他元件/頁面時，先回報波及清單並問 Yuu 要不要一併統一調整。

## 2026-07-15　Icon Library 擴充到 60 顆、依產品功能分 6 類

Yuu 要求針對旅遊／生活／工作／購物／社群等常見產品功能，把 icon 補到 60 顆。
- **+22 顆新 Phosphor regular icon**（官方 `phosphor-icons/core` curl 驗證 200、去 xmlns 正規化成 `<svg viewBox="0 0 256 256" fill=currentColor>`）：airplane／suitcase／map／globe／bed／camera／coffee／sun／music／food(fork-knife)／briefcase／note／paperclip／send(paper-plane-tilt)／bag(shopping-bag)／wallet／receipt／store(storefront)／truck／percent／share／thumbs-up。新 `IC_*` const 插在 `IC_LOGOUT` 後（在 `icLibrary()` 之前定義、無 TDZ）。
- **icLibrary() 從扁平 38 顆改成分組 60 顆**：通用介面 12／工作 10／資料操作 8／購物 11／社群溝通 9／旅遊生活 10。回傳結構從 `[[name,svg]]` 改成 `[[群名,[[name,svg]…]]]`。
- **buildIcon Library 區改分組陳列**：每類一個 `.ic-lib-group`（標題 `.ic-lib-cap` 顯示群名＋數量）+ 一個 `.ic-lib` grid；section 副標更新為「共 60 顆、6 類、涵蓋旅遊/生活/工作/購物/社群」。
- **範圍**：只動 Icon 頁自己的 `IC_*` 與 `icLibrary()`／`buildIcon`，**不碰其他元件共用的 `ICON_*`**，自包含。
- **驗證**：`node --check` 過；Playwright renderView icon → 6 群、60 cell、0 空格（全有 svg path）、新 icon 全在、0 console error。

## 2026-07-15　Footer 大改：全寬版面 + 原子重用 + 聯絡資訊 + 社群進 Icon 頁

依 Yuu 8 點回饋改寫 Footer：
- **版面全寬對齊**：`.ftr-main`/`.ftr-simplerow`/`.ftr-minirow` 都 `width:100%`；連結欄群 `.ftr-cols` 改 `justify-content:flex-end`（靠右）；simple 用 `justify-content:space-between`（logo 左、連結右）。
- **分隔線撐滿寬度**：`.ftr-bottom` 用負邊距 breakout（`margin:28px -32px 0;padding:20px 32px 0`）+ 容器 `overflow:hidden`，border-top 從卡片左緣延伸到右緣。
- **版權與按鈕左右撐滿**：底列 = 版權（左）+ `.ftr-botspacer`（flex:1）+ `.ftr-actions`（社群／語言／回到頂部，右）。
- **移除電子報功能組**：刪 `ftrNews()`、`.ftr-news*` CSS、Live 的 newsletter bool。
- **新增「回到頂部」按鈕篩選項**：`ftrBackTop()` = `.btn v-outline i-secondary sz-s live` + 上箭頭（`ICON_CARET` rotate 180）；Live 加 `backTop` bool、rich/simple/minimal 底列都可帶。
- **社群 icon 修正（2 項）**：① `ftrSocial()` 從自製 `.ftr-soc` 錨點改成 **library Button**（`.btn v-text i-secondary sz-s icon-only live`）；② 4 顆品牌社群 icon（Twitter/GitHub/LinkedIn/Instagram）**收進 Icon Library** 新增「品牌社群 Brand」分類，Icon 頁從 60 → **65 顆**（另把 phone 加進「社群溝通」群、供聯絡資訊用）。
- **logo 與 header 同一 svg**：`ftrLogo()` 從自製 cube mark + 文字改成複用 header 的 `HDR_LOGO`（Goons 官方字標）。
- **多欄版加聯絡資訊**：`ftrContact()` = 地址／信箱／電話三列，各帶 library icon（`IC_LOCATION`／`IC_MAIL`／新增 `IC_PHONE`）。
- **驗證**：`node --check` 過、Playwright 0 console error；logo=字標（viewBox 209 64）、社群/回到頂部皆 `.btn`、聯絡 3 列文字正確、電子報 0 殘留、分隔線 `margin-left:-32px`、Icon 頁 7 群 65 cell 含品牌社群。三變體截圖確認版面。

## 2026-07-15　Footer 二修：修 display 撐滿 bug + 移除資源欄/簡介 + 語言改 library Button

- **底列分隔線與按鈕群沒撐滿的根因**：全域 `footer{display:flex;flex-wrap:wrap;…}`（第 506 行，給 button 頁的來源 footer 用）覆蓋了 `.ftr-foot`（也是 `<footer>`），使 `.ftr-bottom`（無 width:100%）在 flex 容器內被 shrink-wrap 成 713px、`.ftr-botspacer` 塌成 0。修法：`.ftr-foot` 明確 `display:block;margin-top:0`。改後底列寬 713→**1041**（撐滿卡片）、spacer 0→**322px**（把社群/語言/回到頂部推到最右）、分隔線 breakout 到卡片邊緣。
- **移除「資源 Resources」連結欄**：FTR_COLS 從 4 欄 → 3 欄（產品／公司／法務）。
- **移除 logo 下方簡介**：`ftrBrand` 拿掉 `.ftr-desc`，只留 logo + 聯絡資訊。
- **語言切換改用 library Button**：`ftrLang` 從自製 `.ftr-lang` pill 改成 `.btn v-outline i-secondary sz-s live`（globe＋繁體中文＋caret），與回到頂部同款；移除 `.ftr-lang*` CSS。至此底列 social／language／back-to-top 全部為 library Button 實例。
- **驗證**：`node --check` 過、Playwright 0 console error；`.ftr-foot` display=block、bottom 撐滿 1041、spacer 322、連結欄 3 欄、無 desc、語言與回到頂部 class 皆 `btn v-outline i-secondary sz-s live`。截圖確認。

## 2026-07-15　Footer 加 device（電腦／行動）軸，補手機版

依 Yuu「和 header 一樣補上控制選項」——footer 新增 `device` 軸（desktop／mobile），與 header 一致：
- **DIAL_SPECS.footer** order `['variant','device']`、axes 加 `device:['desktop','mobile']`；變數篩選器與 Live 都能切電腦／行動。
- **手機版設計**：`ftrFooter` 加 `device` 參數，mobile 時 foot 掛 `.ftr-mobile` 並包進 `.ftr-phone`（限寬 390px 手機框）。CSS `.ftr-mobile`（container-based、不靠 viewport media query）把 `.ftr-main`／`.ftr-cols`／`.ftr-simplerow`／`.ftr-bottom`／`.ftr-minirow` 全改單欄堆疊、隱藏 spacer、actions 換行；分隔線 breakout 改 `-20px` 對齊手機 padding。
- **陳列**：renderM 改 variant × device（全勾 3×2＝6 段，標題標「電腦版／行動版」）；Live 加 Device seg（電腦版／行動版）。
- **驗證**：`node --check` 過、Playwright 0 console error；dial 兩軸（Variant／Device）、6 段、`.ftr-phone` 寬 390、mobile main/cols/bottom flex-direction=column、Live segs＝Variant/Device/Content。截圖確認手機版單欄堆疊（logo→聯絡→連結欄縱堆→分隔線→版權→按鈕換行）。

## 2026-07-15　header/footer 行動版統一以 375px 手機框示意

- **footer**：`.ftr-phone` max-width 390 → **375px**。
- **header**：行動版 bar 原本全寬呈現，改包進 `.hdr-phone`（max-width **375px**）手機框，與 footer 一致、和全寬電腦版對比清楚。`hdrBar` mobile 分支改回傳 frame。
- 驗證：`node --check` 過、Playwright 0 console error；header/footer 行動版框實測寬 **375px**。

## 2026-07-15　Complex 五元件平行升級（fable agent）

以 fable 模型開 5 個平行 agent（各產出 anchor-based 套用腳本、自我驗證），主流程依序整合、統一 Playwright 驗收。

- **Price 價格**：新增「數值 Metric」大類，型態分 **價格 / 數值** 兩種。metric 四子型態 plain（純數字）/ delta（趨勢，升綠 `--ok`／降紅 `--i-danger`、箭頭重用 `IC_TRENDING`）/ unit（帶單位）/ label（小標＋大數字）；獨立「數值矩陣」（4 子型態 × sm/md/lg）＋ Live 兩段化。未動 Tag（無 success intent，依「跨元件先問」原則改用 icon＋token 上色）。
- **List 列表**（參考 Figma）：矩陣重構為 **basic 基本列 / two-column 雙欄 / selection 選項卡** × 狀態。新增 selection card（checkbox 版＋radio 版、default/hover/selected/error/disabled 五態＋卡下錯誤訊息＋展開帶 inline 下拉）；整組列表補巢狀可展開子列與明細總計列（總計重用 `.pr-price`）；trailing 標準化。全數重用 `.cbx/.rdo/.tg/.field/.pr-price/.btn` 原子。
- **Collapse 摺疊**：① filled 改整張填色（`--panel-2` 從 head 移到 panel 本體）② 移除互動 hover（刪 `.cps-head-btn:hover` 底色）③ 收合寬度＝展開寬度（panel/acc/live-box 補 `width:100%`）④ 往下展開淡出（`.cps-body-wrap` grid-rows 0fr↔1fr＋opacity，toggle 改切 class）⑤ 指示可切 chevron／加減 icon（新增 `CPS_ICON_PLUS/MINUS`、Live 加 Indicator seg）。
- **Modal 對話框**（參考 Figma）：軸改 `kind(popup/modal) × variant`。popup＝置中小卡（警示圖／記住帳號 checkbox／桌機並排・行動堆疊 footer）；modal＝寬版（header＋可捲動 content max-height 80vh/min 30vh＋右對齊 footer，regular 800／larger 1224px）。**Live 預設即顯示開啟的對話框**，關閉後浮出「重新開啟」鈕。舊 `.mdl-sz-*` class 全清。
- **Drawer 抽屜**：① 修高度（面板 `top/bottom:24px` 在 `min-height` 容器內不自動撐開，補 `height:calc(100% - 48px)` → 272px）② 面板浮動、四邊內縮 24px、圓角 14px（backdrop 仍鋪滿舞台）③ **Live 預設即顯示開啟的抽屜**，保留關閉／重開互動。
- **驗證**：整合後 `node --check` SYNTAX OK、Playwright 0 JS console error（僅 favicon 404）；逐一屬性查驗（drawer inset 24/24/24・高 272、collapse filled=panel-2 底・hover 規則已移除、price 升綠降紅、modal Live 預設開啟・舊 class 0、list 選項卡五態＋原子重用）＋ list/modal/drawer 截圖目視符合 Figma。
- **已知小殘留**：modal 匯出/篩選頁乘積顯示 `2×4=8`（實際組合 4，variant 依 kind 各取兩種），文案已註明；未擅改共用計數邏輯（跨元件改動）。

## 2026-07-15　List 拆分重構：抽出 List Item、雙欄改上下巢狀

依 Yuu 五點回饋修正 list：
- **抽出「List Item 資訊列」獨立元件頁**（Complex 群、List 隔壁）：專門呈現「左 leading（無／圖示／勾選框）＋中 title（可加副描述）＋右 trailing（tag／info／meta／動作鈕／caret／checkbox 可複選）」的單列，每個 slot 都能獨立開關。矩陣 `leading × state`（3×4），Live 每個 slot 一個開關、全部對應樣式。原 list 的「基本列 trailing 組合」整段移來成「Slot 組合」。
- **雙欄改成上下巢狀**：原本誤做成左右兩欄，修正為「母列＋內縮子列」的上下兩層巢狀結構，與原「巢狀可展開列」合併成同一 `nested` variant；左右式 value 列本質是 List Item 的 trailing，不再重複放。DIAL_SPECS.list variant 改 `nested / selection`。
- **Live 每個選項都對應樣式**：mountLive 控制列只渲染一次、不支援依 variant 動態顯示，故把 list 的 Live 拆成兩段 scoped block（雙欄／巢狀、選項卡各一），只放對該類有效的開關，消除空轉勾選。
- **狀態表格已選出現 checkbox**：矩陣 selected 欄，List Item（basic）與 list 的巢狀母列都出現「已勾選 checkbox」當選取指示；非 checkbox-leading 的已選列於右側補已勾選框（`lstRowBasic` 新增 `selCheck`）。
- **註冊**：NAV／DIAL_SPECS／BUILD／DIAL_PAGE 都加 `list-item`；CHOICE 與匯出頁自動涵蓋（皆從 DIAL_SPECS 生成）。Complex 群 9 → 10。
- **驗證**：`node --check` SYNTAX OK、Playwright 0 console error；矩陣已選 checkbox（List Item 3 格、巢狀 1 格）、兩段 scoped Live、逐一互動測試（filled→v-filled、關展開→子列隱藏、關 divider→無分隔線、expand→出現下拉）全部即時反應；截圖確認 List Item 矩陣＋Slot 組合、list 上下巢狀＋兩段 Live。

## 2026-07-15　List Item／List 細修 ＋ Collapse／Modal／Drawer 第二輪（fable 平行 agent）

List Item／List 由主流程直接改；Collapse／Modal／Drawer 開 3 個 fable 平行 agent 產腳本、序列整合。

**List Item 資訊列**
- 矩陣「已選」狀態只有 checkbox leading 適用，圖示／無 leading 的已選改「—（需勾選框）」不適用。
- Slot 動作鈕從 icon-only 改**文字按鈕**（`btn v-text i-primary sz-s`＋文字）。
- Live 拿掉 State seg，改成比照其他頁面的 **disabled 勾選**＋真實 hover；新增 **amount 金額** trailing 開關（重用 `.pr-price`）。
- 已選狀態**移除左側 accent 色條**（`.lst-item.is-selected` 去掉 `box-shadow`），只留淡藍底。

**List 列表**
- 雙欄／巢狀不再分「白底／填色灰底」兩版本，改為**內層子列用灰底圓角區塊**（`.lst-subwrap` 綁 `--panel-2`＋radius）；移除 filled 版 demo 與 Live 的 filled 開關。
- 選項卡 Live 操作區**移除 expand 展開下拉**開關（展開版保留在上方靜態示意）。
- 明細金額能力已同步進 List Item（amount 開關）。

**Collapse 摺疊**（agent）
- 修收合殘留 padding：根因＝`.cps-body` 的 `padding-bottom:16px` 撐出 grid track 最小高度；改 `padding:0 16px`＋`::after{height:16px}`（收合時被 overflow 夾掉），收合面板高度＝header 高、垂直置中。
- **補回實際互動區 hover**（上一輪誤移除）：`.cps-head-btn:hover` 底色回歸，filled 深一階；矩陣靜態 state 不動。

**Modal 對話框**（agent）
- popup 按鈕排列與 device 脫鉤：改 segmented「按鈕排列（並排／垂直堆疊）」＋「文字按鈕」boolean（並排/垂直互斥故用 segment，非三個獨立 boolean——待 Yuu 確認是否改回）。
- 一般版也有 **icon 開關**，警示 vs 一般差異只在**顏色**（一般＝primary、警示＝danger）。
- 大 modal 行動版改 **bottom sheet**（貼底、全寬、上緣圓角、由下滑入、max-height 95%）；device 軸真正造成差異。
- Live 拆 **popup 段／modal 段兩個 scoped block**，各只顯示對該 kind 有效的控制項，消除「一般版勾長內容卷軸卻無差異」的空轉。

**Drawer 抽屜**（agent）
- 矩陣（Side × Size）改用**浮動內縮樣式**（縮小版：內縮 9px＋1px border＝10px、圓角 9px、正確高度、無錯位超框）。
- Live 導覽改 **9 項長清單**，內容溢出可捲（scrollable 236px）。

**驗證**：整合後 `node --check` SYNTAX OK、Playwright 0 console error；逐一屬性＋幾何查驗（collapse 收合高=header、hover 規則在；drawer 矩陣四邊內縮 10px、Live 9 項可捲；modal 兩段 scoped、icon 顏色語意、bottom sheet 貼底全寬圓角；list-item NA 2 格、無左色條、文字按鈕、amount；list 子列灰底、無 filled、選項卡無 expand）＋ drawer 矩陣／modal Live 截圖確認。

## 2026-07-15　Modal popup 按鈕排列改四選一

依 Yuu：popup footer 按鈕排列從「並排／垂直」二選一，擴為 **並排／垂直／單顆主按鈕／單顆次按鈕** 四選一（`mdlPopFoot` 的 `lay.arrange`：row／stack／primary／secondary；單顆走 `.stack` 全寬）。矩陣 popup 欄向、Live「按鈕排列」seg、mdlCard 參數（`stack`→`arrange`）同步。文字按鈕仍為獨立 boolean。驗證：`node --check` OK、Playwright 逐一切換確認 並排=次+主、垂直=主/次堆疊、單顆主=solid、單顆次=outline。

## 2026-07-15　Modal 標準/大版統一內容（只差寬度）

依 Yuu：regular 與 larger 應只差寬度。移除 larger 專屬的兩個示範輸入框（收件人姓名／配送備註），並把 `MDL_CONTENT.modal.larger` 內容改成與 regular 完全一致（標題／副標題／footer 皆同）。兩版現在只差 max-width（regular 800px、larger ≤1224px）。`.mdl-fields` CSS 保留但已無引用。驗證：node --check OK、Playwright 兩版標題／段落數／輸入框數一致、寬度 regular<larger。

## 2026-07-15　List 對齊/寬度 ＋ Drawer/Floating-line 修 ＋ 新增 Quantity/Progress

List/List Item、Quantity、Progress 由主流程直接做；Drawer、Floating-line 開 fable agent 修。

**List／List Item**
- 實際互動區寬度統一 **300px**（list 巢狀群組、list-item 單列）。
- 巢狀子列 padding-left 18→**30px**，補足「母列 checkbox(16)＋gap(12)」寬度，讓子標題與母標題**左緣對齊**（實測差 0）。

**Drawer**（agent）
- header 分隔線內縮根因＝面板 `sz-s/m/l` class **撞到 Button 裸 `.sz-*` padding 規則**（padding 漏進面板）。修法：`.drw-live-panel`／`.drw-panel` 補 `padding:0`。Live headW 298／panelW 300、矩陣 6 格同修，分隔線填滿寬度。
- ⚠️ agent 提醒：`.am-panel.sz-*` 等其他掛 `sz-*` 的非按鈕元素可能有同樣 padding 漏染——待 Yuu 決定是否統一處理。

**Floating-line**（agent）
- 矩陣爆版根因＝`.flo-stage` 在 flex 置中格內 intrinsic 寬度趨近 0、`.flo-toolbar`/`.flo-select` 缺 `display:flex` → 直立堆疊。修法：`.flo-stage` 加 `width:100%`、toolbar/select 補 inline-flex、mincol 320→360。
- selection 爆版：圓角 999px→**10px**、padding 調整、按鈕統一 `.btn sz-s` 等高、細節欄改整列寬。FAB 展開加 `.flo-tall` 防裁切。

**新增 Quantity 商品計數**（Complex）
- 電商數量選擇器 −／值／＋，variant 外框／膠囊／極簡 × s/m/l；狀態 default／min(−停用)／max(＋停用)／disabled；＋／− 重用 Button 原子（icon-only）。Live 範圍 1–10 邊界自動停用。

**新增 Progress 進度條**（Complex）
- 線性進度 track＋fill，variant 基本／帶百分比／不確定(animated) × 細/標準/粗；語意色 primary(--accent)／success(--ok)／warning(--warn)／danger(--i-danger)。Live 滑桿控 0–100%。

**註冊**：NAV／DIAL_SPECS／BUILD／DIAL_PAGE 加 quantity、progress；Complex 群 10→**12**。
**驗證**：node --check OK、Playwright 0 console error；list 寬 300／巢狀對齊差 0、drawer 分隔線 298/300、floating-line selection 10px flex、quantity 用 .btn 原子、progress success 綠(46,158,107)＋四色語意；quantity／progress／floating-line 截圖確認。

---

## 2026-07-15　RWD 修正 ＋ Floating-line/Progress/List 再修

手機開網址顯示電腦版縮放、floating 子項灰底不明顯、progress 缺漸層、list 巢狀仍未內縮 → 一次修。全部由主流程直接做（無 agent）。

**RWD（全域）**
- 根因：`<head>` 缺 `<meta name="viewport">`，手機 Safari 以 ~980px 桌面寬渲染 → `@media(max-width:900px)` 從不觸發，看到的是桌面版縮放。
- 修法：補 `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`。既有響應式殼（漢堡＋抽屜側欄＋scrim＋窄螢幕自動收）本就完整，加一行即生效。
- 驗證：390px 下 `docScrollW==viewportW`（無橫向捲）、漢堡 display:flex、側欄 translateX(-300) 收起；progress／list／匯出頁橫向溢出皆 0。

**Floating-line — FAB 展開子項**
- 「勾選坐進按鈕點擊」＋「白底 library 樣式」：原本「灰底文字 pill ＋ 圓形 mini 鈕」兩件拆開 → 合成**單顆白底膠囊按鈕**（icon＋文字整顆可點，`.flo-fab-child-btn`）。白底＋1px 外框＋陰影，明顯浮於灰底。移除 `.flo-fab-lb`／`.flo-fab-mini`。

**Progress**
- **移除 indeterminate**（不確定循環動畫）variant 與相關 CSS/keyframes。
- **新增 gradient 漸層** variant：每語意色各自 `base→淺色` 專屬漸層（`color-mix`），矩陣一列、Live 一個勾選項；prgEl 重構成 label／gradient 可用旗標獨立疊加。
- **粗(l) 尺寸**標題與百分比字級一併放大（cap 13→15、pct 12→14）。
- **Live 進度條寬度固定為互動區 50%**（實測 452/903＝0.50）；**滑桿移到勾選項右側**同一列（改自訂 Live 手刻控制列，非 mountLive）。

**List／List Item**
- 巢狀**再修內縮**：改由**整塊灰底 `.lst-subwrap` margin-left:28px**（＝母列 checkbox.sz-s 16＋gap 12）內縮，子列還原預設 padding；子標題左緣＝28+14=42＝母標題（pad14＋cbx16＋gap12），**實測對齊差 0**、灰底又明顯內縮。（先前假設 checkbox 20px 算成 32→差 4px，改 28 修正。）
- 實際互動區寬度 300→**600px**（list 巢狀群組、list-item 單列、selection Live 一併）。

**驗證**：node --check OK、Playwright 0 console error；RWD 390px 無橫向溢出、progress 漸層四色 render＋l 字級 15/14＋bar 50%＋滑桿在勾選右、floating 子項白底(255,255,255) pill、list 巢狀對齊差 0／寬 600。截圖：mobile 首頁、floating 展開、progress 矩陣、list 巢狀。

---

## 2026-07-15　Price→Number 改名＋metric 可組合 ＋ progress 字級 ＋ FAB 點擊展開 ＋ 檢視記憶

**Price → Number 數值**
- 頁面／nav／DIAL label 顯示改「Number 數值」（內部 id 仍 `price`、class 仍 `pr-*` 不動，避免連鎖破壞）；eyebrow → `L3 Component · Number`。umbrella 概念：price 與 metric 都是「數值」。
- **儀表數值 metric 改可組合式**：`prMetricEl(size,o)`（原 `(mvariant,size,opts)` 四選一），基底大數字＋`o.title/o.unit/o.trend` 三者正交、可任意疊加。Live 控制改：Size seg＋Trend seg（無／上升／下降，「無」＝隱藏）＋顯示欄位 checkbox（標題／單位），三者皆可開關；矩陣改「單一欄位示意」列（純數字／＋趨勢／＋單位／＋標題）。

**Progress — m／l 百分比數字放大**
- `.prg-sz-m .prg-pct` 12→**15px**、`.prg-sz-l .prg-pct` 14→**19px**（s 維持 12）。

**Floating-line — FAB Live 可點擊展開**
- `floFab` 加 `o.interactive`：子項預建、預設隱藏，**點主鈕即時展開／收合**（＋ 旋轉 45° 成 ×，`.flo-fab.is-open svg`）。Live fab 一律 interactive，「展開子項」勾選改為設定初始狀態。

**檢視記憶（重整不跳回匯出頁）＋ Basic 不預設展開**
- 加 URL hash 路由：`renderView` 寫 `location.hash`、init 用 `hashId()` 還原（無效／無 hash → summary）、`hashchange` 監聽支援深連結／上一頁。
- 側邊欄群組改「只展開當前檢視所在群組」（原本 `gi>0` 收合＝Basic 永遠展開）；summary 或其他群組時 Basic 收合。

**驗證**：node --check OK、Playwright 0 console error。Number title/nav=「Number 數值」、metric 三欄位可同時出現（本月營收／8,542 筆／↗+12.5%）、Trend「無」→ 趨勢消失；progress pct s/m/l=12/15/19；FAB 點主鈕 0→3 子項＋is-open、再點→0；重整 #floating-line 停留原頁＋僅 Complex 展開、fresh 載入→summary＋四群全收合。截圖：Number metric 組合。

---

## 2026-07-15　Card 群 5 顆全建置（fable 平行 agent → 序列整合）

Card 卡片群（🗂️）5 顆一次做完，5 個 fable agent 平行產出、主控序列整合。全部**重用既有原子**（Image／Tag／Price／Button／Icon），namespace 前綴各自獨立。

- **card 基礎卡片**（`crd-`）：variant elevated/outlined/filled × state default/hover/selected/disabled（3×4=12）。slots media/badge/title/desc/actions 可組合；媒體圖=imEl、角標=.tg、動作鈕=.btn。
- **product-card 商品卡**（`pcd-`）：variant vertical/horizontal/minimal × state default/hover/soldout（3×3=9）。縮圖=imEl、角標/售完標=.tg、價格=prEl(normal/discount)、加入購物車=.btn＋IC_CART、收藏愛心/評分星（新增 PCD_IC_STAR_FILL/PCD_IC_HEART_FILL fill 版）；soldout=grayscale＋覆蓋標＋按鈕停用。
- **category-tile 分類磚**（`cat-`）：variant icon/image/gradient × state default/hover/active（3×3=9）。icon 磚=既有 Phosphor＋i-primary-tint 圈、image 磚=imEl 鋪底＋暗遮罩、gradient 磚=accent 漸層；count=.tg；含 6 磚 grid 示意。
- **article-card 文章卡**（`art-`）：variant vertical/horizontal/overlay × state default/hover（3×2=6）。封面=imEl(16:9)、作者頭像=imEl(circular,s)、分類標=.tg、閱讀更多=.btn v-text；overlay=暗漸層白字置底。
- **announcement-item 公告項**（`anc-`）：variant banner/card/inline × intent info/success/warning/danger（3×4=12）。語意 icon 重用 notification 的 NT_IC_*＋新增 ANC_IC_PROHIBIT(danger)；日期=.tg、動作/關閉=.btn；banner 左色條＋tint 底、card 圓角＋色圈、inline 單行。LIVE['announcement-item'] 有註冊。

**整合手法**：各 agent 寫 `<id>.css`+`<id>.js` 純文字檔（不碰主檔），主控 integrate.js 依錨點插入（CSS 前 `</style>`、JS 前 `const BUILD`），DIAL_SPECS/BUILD/DIAL_PAGE/NAV st 4 處中央註冊由主控做。零 icon/class/fn 命名衝突。

**驗證**：node --check OK、Playwright 0 console error。5 頁矩陣格數對（12/9/9/6/12）＋ Live ＋ 原子重用（product 用 13 個 prEl、article 20 個 imEl 等）；匯出頁列出 5 顆、總數 30/679→**35/727**（+5 元件、+48 變體）；dark mode 卡片底走 --panel(22,26,33) 非白；hash 路由對新元件正常。截圖：5 頁 showcase 全確認。**Card 群完成，剩 Table & Chart（5）未建。**

---

## 2026-07-15　Card 群改樣式（padding／玻璃標／真實照片／unify）＋ 移除 announcement

參考 NFT 卡風格微調四張卡，並移除已無用的公告項。

**共用**
- 新增 `.tg.tg-glass`：圖片上的標籤改**半透明黑玻璃＋背景模糊**（`rgba(18,20,26,.5)`＋`backdrop-filter:blur(10px)`、白字），card／product 壓在照片上的角標共用。

**Card**
- 卡片加 `padding:12px`，媒體圖**內縮＋10px 圓角**（圖周圍留白）；body/foot 水平 padding 收成 4px（改由卡片 padding 提供）。
- selected 外框改**只 1px**（移除 `box-shadow inset` 那圈，含 elevated 變體）。
- 底部按鈕 `justify-content:flex-end` **靠右**，DOM 順序改「次要在左、主 CTA 最右」。
- 角標壓在圖上時套 `tg-glass`；無圖時維持柔色標。

**Product Card**
- **爆版修正**：三 variant 寬度 `216/340px 固定 → width:100%+max-width`，矩陣格不再溢出（實測 0 overflow cell）。
- 卡片加 `padding:10px`、縮圖 10px 圓角內縮（同 card）。
- 縮圖換**真實商品照**（已驗證 200）：托特包 `1544816155`／羊毛圍巾 `1601924994987`／保溫瓶（minimal 無圖）；`PCD_IMG` const 收攏。
- 角標套 `tg-glass` 半透明黑玻璃。

**Category Tile**
- image 磚換**真實美食照** `1504674900247`（原為風景）。
- 三 variant **文案／icon／count 統一**（`CAT_MDATA` 全指向「美食餐飲」、Showcase 同步），只差樣式（icon 圈／圖片底／漸層底）。

**Article Card**
- 三封面換**與標題相符的照片**：設計系統 `1531403009284`／資料密集後台 `1551288049`／AI `1526378722484`（`srcIdx`→`srcId` 直接吃 photo id）。
- 疊字 hover **標題不再轉藍**（`:not(.v-overlay)` 排除 overlay），維持白字。
- 疊字圖上遮罩改 **≥40% 黑**（`linear-gradient(rgba(0,0,0,.7),rgba(0,0,0,.4) 55%)`）突顯文字。

**移除 announcement-item**：NAV／DIAL_SPECS／BUILD／DIAL_PAGE／CSS 區塊／JS 區塊／`LIVE['announcement-item']` 全數清除（anc- 殘留 0）。Card 群 5→**4 顆**、匯出頁 35/727 → **34/715**。

**驗證**：node --check OK、Playwright 0 console error。card padding12/媒體 10px 圓角/selected 1px/footer 主 CTA 最右/玻璃標 blur10；product 0 爆版＋真實商品照＋玻璃標；category 三 variant 同為美食餐飲＋真食照；article 三封面對題＋疊字 hover 白字＋40% 遮罩。截圖四頁全確認。

---

## 2026-07-16　Product Card 收藏愛心去白底＋精簡版角標對齊修正

- **愛心去白底**：`.pcd-wish` 移除白色圓框（`background:var(--panel)`＋shadow），改 `background:transparent`；直接壓在照片上、靠 `drop-shadow` 保可讀；點擊仍轉紅色實心愛心（`is-on`→`--i-danger`＋fill svg）。精簡版無圖故 icon 陰影關閉。
- **精簡版跑版修正**：`mkBadge(inline)` 新增 inline 參數——精簡版角標不掛 `.pcd-badge`（絕對定位）也不掛 `tg-glass`（無圖背景），正常排進 `.pcd-toprow`；`.pcd-toprow` 對齊改 `align-items:flex-start`，角標與愛心**靠上對齊**。實測角標 position:static、top 對齊差 0、無溢出。

**驗證**：node --check OK、Playwright 0 console error；13 顆愛心 bg 全 transparent、Live 點擊→紅實心；精簡版角標 static/非玻璃/top 對齊/不跑版。

---

## 2026-07-16　卡片圖片 hover 放大 ＋ 四卡新增 size 軸（m/s）

- **hover 圖片放大**：card（`.crd-media`）、product-card（`.pcd-thumb`）、category-tile（`.cat-image`）的圖片，hover 時 `transform:scale(1.05)`（.35s，比照 article-card）；容器 overflow:hidden 已就位，product soldout 不放大。
- **size 軸 m/s**：card／product-card／category-tile／article-card 四張卡 DIAL_SPECS 加 `size:['m','s']`（order＋zh＋axisName）；各加 `-sz-s` CSS（字級/間距/尺寸縮小）；工廠函式吃 `size`、矩陣依轉盤 size 呈現、Live 加 Size seg 可切 m/s。

**驗證**：node --check OK、Playwright 0 console error；三卡 hover img scale 1.05（去 transition 讀到 matrix(1.05)）；四卡 Live 有 m/s seg、切 s 加 `-sz-s`、標題字級縮小。

---

## 2026-07-16　Table & Chart 群 5 顆全建置（fable 平行 agent → 序列整合）＝ DS 全數完成

最後一組 Table & Chart（📊）5 顆一次做完，5 個 fable agent 平行產出、主控序列整合。charts 全 inline SVG 手刻、無外部 lib；namespace 各自獨立、避開既有 `sch-`（用 `gnt-`）。

- **table 資料表格**（`tbl-`）：variant bordered/striped/plain × density comfortable/compact（3×2）。重用 `.cbx`（全選含 indeterminate 半選／列選）、`.tg`（狀態欄 完成/進行中/逾期）、`.btn`（排序鈕＋分頁）；金額右對齊 tabular-nums、表尾總計、可點表頭排序、點列選取。新增 `TBL_IC_SORT`。
- **chart 圖表**（`cht-`）：variant stat/line/bar/donut × size m/s（4×2）。stat 重用 `prMetricEl`；line=面積填充＋端點、bar=雙系列、donut=`stroke-dasharray` 四段環＋中央%＋圖例；系列色綁 --accent/--ok/--warn/--i-danger。s=sparkline 簡配。無新增 icon。
- **tree-view 樹狀**（`trv-`）：variant lines/plain/checkbox × state default/hover/selected（3×3）。重用 `ICON_CARET`（箭頭旋轉）、`.cbx`、`IC_FOLDER`/`IC_FILE`；檔案總管樹、L 形連接線、縮排、真實展開/選取。無新增 icon。
- **schedule-chart 排程圖**（`gnt-`，‼️ 非 sch-）：variant gantt/week/timeline × size m/s（3×2）。重用 `.tg`、`IC_CLOCK`；甘特橫條＋進度填色＋今日線＋週末底、週排程 grid、垂直時間軸狀態圓點。無新增 icon。
- **calendar 日曆時間**（`cal-`）：variant month/range/time × size m/s（3×2）。重用 `.btn`、`IC_CLOCK`；月曆 6×7＋日狀態（今日/選取/非本月/停用/事件點）、區間連續帶、時間清單；純數學算日期（不碰 Date，寫死 2026-07）。新增 `CAL_IC_CARET_L/R`。

**整合手法**：各 agent 寫 `<id>.css`+`<id>.js`（不碰主檔），主控 integrate2.js 依錨點插入＋中央註冊（DIAL_SPECS/BUILD/DIAL_PAGE/NAV st）。零 icon/class/fn 命名衝突、schedule-chart 0 處 sch-、calendar 0 處 Date。

**驗證**：node --check OK、Playwright 0 console error。5 頁矩陣格數對（6/8/9/6/6）＋ Live ＋ SVG 圖表 render（line 面積/bar 雙系列/donut 四段環/月曆/甘特/時間軸皆正確）；匯出頁 34/715 → **39/786**。**四大組（Basic 17／Complex 12／Card 4／Table&Chart 5）全數 ready，整套 DS 陳列完成。**

---

## 2026-07-16　Table/Chart 打磨＋側邊欄去綠點＋匯出頁分類三版型

四項同步調整（單檔 self-contained HTML，Playwright 全驗、0 console error）。

- **Table**：① 分頁改用 library **Pagination 元件**（`pgBar('numbered','s')`＝`pg-btn`＋`pgArrow`），不再自畫 `.btn`。② 新增 **Cell Types 欄位型別** 區塊＋ `tblTable({cellTypes:true})`：資料格新增「**Dropdown**」（重用 `ddField`、可展開選單，`.tbl-celltypes{overflow:visible}` 免裁切）與「**文字按鈕**」（重用 `.btn v-text`）兩型別，連同原文字/Tag/數字共 5 種。
- **Chart**：① line/bar 改 DOM 節點（`chtLineNode`/`chtBarNode`），新增 **X 軸類別／Y 軸數值** 可各自開關（`chtPad`＋`chtAxisSVG`，line=月份、bar=星期）。② **hover tooltip**：滑到折線/長條顯示該點數值＋類別（`.cht-tip`，色 `--ink/--canvas` 雙主題安全）。③ **端點 dots 改 hover 驅動**：移除永遠顯示的每點圓點，改滑到最近點才出現 dot＋垂直導引。④ 圖表**加寬**（m 300→wide 380／s 170→210；Live/dashboard 用 `wide`）。scope map／Live bools 同步（移 `dots`、加 `lineXcat/lineYval/barXcat/barYval`）。
- **側邊欄**：`renderNav` 移除每項的**綠點製作狀態** `.dot`（全數 ready，圓圈已無資訊量）。
- **匯出頁**（`renderSummary` 重寫）：① 元件牌卡不再攤平，**多一層「四大分類」**（比照側邊欄 Basic/Complex/Card/Table&Chart，`.sumcat` 可折疊、預設收合、header 帶 選取/總數 pill）。② **三種版型**：`accordion 分類展開`（原可展開牌卡＋Live）／`list 緊湊清單`（一列一元件、點列跳頁）／`grid 分組網格`（小磚＋勾選＋變體數）。③ AI toggle **右側加方案 tab**（`.sum-tabs`）切換三版型；`sumLayout` 跨切頁持久。SUMSEL／AI 建議／JSON 匯出邏輯共用，切版型與 AI 皆 `renderBody()` 重繪、分類 pill 即時連動。

**驗證**：node --check OK、Playwright 0 error。table pager=5 顆 pg-btn／cellTypes 有 dropdown＋文字按鈕且無爆版；chart Live 寬 380、X/Y 軸 label、hover 顯示 tooltip（78／6月）＋單一 hover-dot；匯出頁 tab 在 AI 右側、4 分類（18/12/4/5）預設收合、三版型各 39 項、勾選連動 total 786↔642。

---

## 2026-07-16　Design Token 系統（v0 種子）＋網站 chrome 全 token 化

依 DS Framework L1 Primitive → L2 Semantic 架構、v0 by Vercel 視覺為種子，建立整套預設 token，並把網站自身 chrome 全數接上 token。分批進行、每批 Yuu review。

**Batch 1 — Token 地基 + Design Token 頁**
- 內嵌 GeistSans/GeistMono（Latin 變體字 base64；CJK 走系統字 fallback），離線可用。
- L1 Primitive：neutral 11 階／brand 4／feedback（success/warning/error/info）／radius（md 8 預設＋pill）／spacing 8-base 9 階／typography H1–H10＋weight＋line-height／elevation／motion。
- L2 Semantic：surface/text/border/action/danger/sec/feedback，light + dark（dark 覆寫語意層＋品牌 accent 提亮）；tint 一律 color-mix 跟著品牌色走。
- 舊 28 個 CSS 變數改為 semantic 別名 → 全站零改動即套上 v0 皮（單色底＋品牌藍 accent、圓角折衷 8px、按鈕 pill）。
- 新增 🎨 Design Token 頁：79 列可即時手調、Neutral/Brand/Feedback 層層下傳、複製 Token CSS、重設；routing/hashId/nav pin 全接。

**Batch 6 — 網站自身 chrome 全 token 化**
- 顏色：scrollbar → --line-strong；#fff → --primary-on／--c-neutral-0；陰影 rgba(0,0,0) → color-mix(var(--ink))（dark 不再死黑）。
- 圓角：字面值 8/9/999/5/6/7px → --r-md/--r-pill/--r-sm。
- 字級：topbar/sidebar/nav/headings/dial/blocks/vpanel/mgrid/eyebrow/footer/匯出頁/Design Token 頁的 font-size 全吸附到 H1–H10（13.5→h8、12.5→h9、11→h9…，Yuu 定案「吸附到尺標」）。
- 間距：padding/margin/gap ≥7px 吸附到 8-base（7/10→sp2、20→sp5、34→sp6…；≤6px 光學微調保留；main 下捲 96px 為標註例外）。
- 明暗兩模式驗過、0 console error。元件內部 CSS（.btn/.cbx/.tabi/.nt-/.tg…）留待 Batch 2–5。
