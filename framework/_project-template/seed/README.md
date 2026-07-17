# seed/ — Mock data 給 FE 接

設計師在做 vibe coding(互動原型)時產生的 mock 資料放這裡。

## 規則(FE 對接會議共識)

- 結構**獨立 JSON**、不混進 `content/`(content 是真實內容、seed 是 mock 結構)
- 純 mock 資料(可用假名假數),但**資料結構**要對應 real API 預期形狀
- FE 在 real backend 還沒到位前直接接這包當 mock data

## 典型情境

- 設計師用 CD / Lovable 跑 prototype、產生「假商品列表」「假使用者資料」等
- 這些假資料的 JSON shape 放這裡(命名建議:`<entity>.mock.json`,如 `products.mock.json`)
- FE 在 dev 環境讀這包、開發完整流程

## 不放這裡的

- 真實文案 / 圖片 → `content/`
- 後端 schema 文件 → `inputs/`(若有規格)
- API mock 服務設定 → 由 FE 自己決定(這資料夾只放純 JSON 資料)
