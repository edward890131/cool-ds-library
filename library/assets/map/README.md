# 首頁地圖配圖（HOME-MAP）

首頁「From Taipei to every timezone」地圖段落：鏡頭移到某個地標時，旁邊浮出這張配圖（藍色四角框）。
網站以檔名讀圖，**只要用相同檔名覆蓋檔案即可換圖，不用改程式**。

2026-11-10 已換成使用者提供的正式圖（Unsplash，依 Unsplash License 免費使用、不強制標註）：

| 檔名 | 攝影師（Unsplash） |
|---|---|
| `taipei.webp` | Poh Soo Donald Soh |
| `tokyo.webp` | Annie Spratt |
| `seoul.webp` | Arkin Si |
| `hongkong.webp` | Manson |
| `newyork.webp` | Israel Andrade |
| `london.webp` | Yibei Geng |
| `home-office.webp` | Microsoft Copilot |

| 檔名 | 地標 | 建議放的圖（使用者 2026-11-10 提供） |
|---|---|---|
| `taipei.webp` | Taipei | 台北 101 天際線 |
| `tokyo.webp` | Tokyo | 木屋裡一群人用筆電開會 |
| `seoul.webp` | Seoul | 現代建築外觀＋庭園 |
| `hongkong.webp` | Hong Kong | 維多利亞港天際線 |
| `newyork.webp` | New York | 吊燈開放式辦公室 |
| `london.webp` | London | 高樓會議室落地窗 |
| `home-office.webp` | （備用，目前沒用到） | 窗邊居家工作 |

## 規格

- 格式：webp，品質約 72–80
- 尺寸：**640 × 480（4:3）**，置中裁切；直式原圖請裁上方 1/3 附近保留主體
- 單檔盡量小於 60KB

## 換圖指令（在 repo 根目錄，需要 Python 的 Pillow）

```bash
python3 - <<'EOF'
from PIL import Image
# 左邊是原圖路徑，右邊是要輸出的檔名
M = {
  'taipei.jpg':'taipei', 'tokyo.jpg':'tokyo', 'seoul.jpg':'seoul',
  'hongkong.jpg':'hongkong', 'newyork.jpg':'newyork', 'london.jpg':'london',
  'home-office.jpg':'home-office',
}
for src, name in M.items():
    im = Image.open(src).convert('RGB'); w, h = im.size
    if w / h > 4 / 3:
        nw = int(h * 4 / 3); im = im.crop(((w - nw) // 2, 0, (w - nw) // 2 + nw, h))
    else:
        nh = int(w * 3 / 4); top = int((h - nh) * 0.35); im = im.crop((0, top, w, top + nh))
    im.resize((640, 480), Image.LANCZOS).save(f'library/assets/map/{name}.webp', 'WEBP', quality=76)
EOF
```

換好後 commit 推上去即可；新增或改名地標才需要動 `gallery.html` 的 `HX_GM.cities`。
