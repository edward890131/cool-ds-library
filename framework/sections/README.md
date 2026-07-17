# sections/ — Section Library（organism 層）

> 狀態：**佔位、待建**（scaffold only）

## 是什麼

Section 是「用 L3 元件組成、有內容槽 + 狀態 + 防呆」的**可重用區塊**（organism），
住在 L3 component 跟頁面之間。SME 官網的主要積木就在這層。

預期會有的 section（待建）：
- `hero` — 英雄首屏
- `feature-grid` — 服務 / 優勢介紹
- `testimonial` — 客戶見證
- `contact-form` — 聯絡我們
- `pricing` — 方案價目
- `faq` — 常見問題
- `cta-banner` — 行動呼籲橫幅
- `footer` — 頁尾

## 跟其他層的關係

```
L3 component（button / card / input…）
   ↓ 組成
Section（hero / feature-grid…）         ← 本資料夾
   ↓ 排列
L5 Business Template（restaurant-landing = 一串 section + 綁 theme）
```

## 為什麼要這層

讓「第二個相似客戶」便宜的關鍵。沒有 section 層，每個專案的頁面都要重畫；
有了它，新專案是「重排既有 section + 換 content + 換 theme」。

## 防呆（reality defense）寫在這層

SME 客戶給的文案長短不一、照片比例亂。section spec 要內建：
- 文字截斷（line-clamp）
- 圖片強制 aspect-ratio + overlay dimmer（保標題可讀）
- fallback（缺圖時的預設）

## 怎麼長出來

走 `ds-architecture-flow` skill 的 **Gate 4 反向 audit**：CD 客製頁做出來的新 section，
審核後 harvest 回這裡，下個專案就能重用。**今天的客製 = 明天的 section。**
