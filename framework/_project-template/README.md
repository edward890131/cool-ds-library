# _project-template/ — 新專案起手樣板

複製這個資料夾到框架**外面**，當作新專案的起點。例：

```
cp -R ds-framework/_project-template ~/projects/acme-cafe
```

然後：
1. 編 `project.yaml`（版本 / theme / scope）
2. 把 spec / PRD / WF 丟進 `inputs/`
3. 編 `theme.delta.yaml`（這客戶的品牌差異）
4. 每頁在 `pages/` 宣告走 cc 還是 cd

完整說明見框架根目錄的 `FRAMEWORK-WORKFLOW.md`。

> 這是樣板（框架的一部分、唯讀）。複製出去後那份才是你的專案、才能改。
