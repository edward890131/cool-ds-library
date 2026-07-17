# Goons DS Studio

把「設計系統框架（治理）」＋「元件庫網站（選取／預覽）」＋「Figma 雙向同步」三塊，整合成一條可重複執行的工作流。

> 給同事：**把這個 repo 的 GitHub 網址丟給 Claude Code，說「依 ds-studio 幫我跑一個新專案」即可**，Claude 會照下方七步依序帶你走完。

---

## 這個 repo 是什麼

| 資料夾 | 內容 | 誰維護 |
|---|---|---|
| `framework/` | ds-framework 快照（L0–L4 規範 + themes + production 規則 + 4 個 skill）。**唯讀治理層**，決定「怎麼建、怎麼推 Figma」 | goonsdesign（升級時手動同步上游） |
| `library/` | 元件庫網站 `gallery.html`（元件本體＋選取＋token 編輯＋匯入匯出）＋ `component-registry.json`（canonical 元件 id ＋軸定義） | 設計團隊 |
| `sync/` | Figma ↔ codebase drift 偵測腳本（token / component 兩軌） | FE ＋ 設計確認命名 |
| `skills/ds-studio-flow/` | 主控 skill，串起下方七步 | goonsdesign |
| `projects/` | 每個專案的狀態與輸出（token 值、選取、匯出、bake 出的預覽頁）。**不污染上面四層** | 各專案成員 |

**元件 id 主權在 `library/component-registry.json`**（library-first）。框架 L0 只當 `l0Ref` 參考，不反向覆蓋。

---

## 工作流（七步）

1. **Phase 0 訪談** — Claude 依框架 Phase 0（Q0–Q9）問你 CI／PRD／品牌／path／Figma 檔等，你回答並提供文件。
2. **Token 提案＋元件建議** — Claude 依 CI／PRD 判 L1／L2 token 值，並依規格從 registry 篩出、預勾建議元件 → 產 `proposal.json`。
3. **網站選取** — 開 `library/gallery.html?project=<名稱>`，載入 proposal，你在網站上調 token、勾最終元件、選每顆要的狀態／樣式（軸）。
4. **匯出** — 網站吐 `tokens.export.json` ＋ `components.export.json` 到 `projects/<名稱>/`。
5. **建置＋套 token** — Claude 依匯出，從 `library` 複製對應元件、套最終 token，跑框架 Gate 2 完整性檢查。
6. **寫進 Figma** — Claude 用 Figma MCP 建檔 ＋ Variables（token）＋ Component sets。**網站的「篩選項／樣式切換」＝ Figma 的 variant／boolean property**，維持同一組合邏輯；對齊框架 `production/figma-rules.yaml` 的 4 頁結構、命名、綁 token。
7. **雙向同步** — 之後 codebase 或 Figma 任一邊改動 → 跑 `sync/` 腳本 → Claude 依框架鐵則把差異分四類（token 值／結構／內容／mock）列出 → 你確認 → 統一。

---

## 專案資料夾長怎樣（共用引擎＋每專案狀態）

元件庫引擎只有一份（`library/gallery.html`）。每個專案只存自己的狀態，不複製引擎：

```
projects/<品牌>-<日期>/
├── proposal.json          # Claude 提案的 token 值＋預勾元件
├── selection.state.json   # 你在網站編輯後的狀態
├── assets/logo.<svg|png>  # 專案 logo（三處 header/footer 同步替換）
├── tokens.export.json     # 匯出（給 build 用）
├── components.export.json
└── preview.html           # 定案後 bake 出的自包含單檔（可獨立寄客戶／歸檔）
```

日常編輯走 `gallery.html?project=<名稱>`；定案要一份能單獨寄出的頁 → bake 成自包含 `preview.html`。

---

## 最少要會的 git

```
git clone <this-repo-url>   # 第一次拿整套（框架已快照在內、不用另外 clone）
git pull                    # 之後更新
```

不確定指令可以直接叫 Claude Code 幫你跑。
