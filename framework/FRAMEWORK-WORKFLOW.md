# Studio 工作流：框架在七步流程裡的角色

核心原則：**專案不複製框架、也不複製元件庫引擎，只放自己的 delta**（token 值、選取狀態、logo、匯出、bake 預覽）。
`framework/` 與 `library/gallery.html` 對專案唯讀；專案只在 `projects/<名稱>/` 放自己那 5%。

> 這份講「框架與元件庫怎麼被專案依賴」。成員實際操作步驟看 repo 根 `QUICKSTART.md`。

---

## 一次性設定（每個成員、每台電腦）

```
git clone <ds-studio repo-url> goons-ds-studio     # 一次拿整套：框架已快照在內、元件庫在內
```

**不需要**再 clone 框架、也**不需要** symlink 裝 skill —— `skills/ds-studio-flow` 就在 repo 內，Claude Code 進到這個資料夾會自動讀根 `CLAUDE.md` 與 skill。

之後更新：

```
cd goons-ds-studio && git pull
```

不熟 git 沒關係 —— 直接叫 Claude Code 幫你跑。

## 三塊各自的可寫性

| 區 | 內容 | 誰能改 |
|---|---|---|
| 🔒 `framework/` | L0–L4 schema、`production/*`、themes base、skills | goonsdesign（快照升級才動，記 `VENDORED.md`） |
| 🧩 `library/gallery.html` | 元件庫引擎（元件本體＋選取＋token 編輯 UI） | 設計團隊；**唯一引擎、禁 per-project fork** |
| 📇 `library/component-registry.json` | canonical 元件 id ＋軸 | 隨元件增減同步更新 |
| 🎨 token 值 | 每專案的 L1/L2 值 | 設計師在網站上編輯 → `projects/<名稱>/tokens.export.json` |
| 🔧 `sync/*.mjs` | drift 偵測腳本 | FE 維護、設計確認命名 |
| 🧪 `projects/<名稱>/` | 選取狀態、logo、匯出、bake 預覽 | 該專案成員 |

你不用記「某元件能不能改」—— 看它在哪一區就知道。

## 開一個新專案

1. 對 Claude Code 說「**依 ds-studio 幫我跑 `<客戶>` 的新專案**」→ 觸發 `ds-studio-flow`。
2. Claude 走 Phase 0 訪談，在 `projects/<客戶>-<日期>/` 建專案資料夾（**在 repo 內**，非框架外）。
3. 把這個專案的 CI／PRD／WF 提供給 Claude（拖進對話或給路徑）。

專案資料夾結構：

```
projects/<客戶>-<日期>/
├── opening-interview.md   # Phase 0 Q0–Q9 答案
├── design-principles.md   # 設計原則（Phase 0.5）
├── proposal.json          # Claude 提案：token 值＋預勾元件
├── selection.state.json   # 你在網站編輯後的狀態
├── assets/logo.<svg|png>  # 專案 logo（三處 header/footer 同步替換）
├── tokens.export.json     # 網站匯出的最終 token
├── components.export.json # 網站匯出的元件需求（id＋選用軸）
├── output/                # build 出的 DS + 給 FE 的 pack（GATE 報告等）
├── seed/                  # 互動原型 / mock data（給 FE 接）
└── preview.html           # 定案後 bake 的自包含預覽（可寄客戶）
```

## 跑設計流程（七步）

對 Claude Code 說「依 ds-studio 幫 `<客戶>` 跑設計流程」→ 觸發 `ds-studio-flow`。全程不會改到 `framework/` 或 `library/gallery.html`。

```
1. Phase 0 訪談        Claude 依框架 Q0–Q9 收 CI/PRD/品牌/path/Figma 檔
        ↓
2. Token 提案＋元件建議  依 CI/PRD 判 L1/L2 值；從 registry 篩選、預勾 → proposal.json
        ↓
3. 網站選取            開 gallery.html?project=<名稱>：調 token、勾元件、選狀態/樣式、上傳 logo
        ↓
4. 匯出               tokens.export.json ＋ components.export.json
        ↓
5. build ＋ 套 token   從 library 複製對應元件、套最終 token、跑框架 Gate 2 完整性
        ↓
6. 寫進 Figma          Variables（token）＋ Component sets（軸=variant/boolean），對齊 figma-rules 4 頁結構
        ↓
7. 雙向同步            sync/ 偵測 drift → 差異分四類歸位 → 你確認 → 統一
```

**框架在其中的職責**：提供 Phase 0 訪談題庫（Q0–Q9）、Gate 1–4 治理、`production/figma-rules.yaml` 的 Figma 建置鐵律。網站取代了框架原本 Phase 0.8 的「純文字 scope 清單」——改成視覺化選取。

## 把專案的好東西收回（upstream 棘輪）

1. 專案在網站上新增、框架/庫沒有的元件 → 隔離在 `library` 待審（標 `upstream-候選`）。
2. goonsdesign 定期挑要收的 → 進 `library/gallery.html` ＋ `registry`（＋必要時框架 L0）。
3. 成員下次 `git pull` 就拿到。

→ 「今天的客製 = 明天的模板」。**差異分四類歸位**（token 值／結構／內容／mock）見根 `CLAUDE.md` 鐵則 6。
