# 關鍵詞螢光筆 (Keyword Highlighter)

[English Version](README.md)

這是一款專為 Chrome 瀏覽器設計的擴充功能，能夠自動在網頁上尋找並標示出您感興趣的關鍵詞。

## ✨ 特色功能

- **🚀 自動化標示**：開啟網頁後自動偵測並高亮關鍵詞，無須手動操作。
- **📦 預設資料庫支援**：支援載入自定義的初始關鍵詞列表。
- **🎨 現代化 UI**：採用精緻的漸層設計與 Noto Sans TC 字體，提供極佳的視覺體驗。
- **動態管理**：
  - 即時新增或刪除關鍵詞。
  - **最新優先排序**：新加入的關鍵詞會自動排在清單最上方。
  - 即時同步：在彈窗中修改後，頁面標示會即時更新。
- **⚡ 高效能設計**：延遲執行與節點數量限制，確保不影響網頁載入速度。

## 🚀 快速開始 (Quick Start)

為了開始使用預設的高亮功能，請按照以下步驟操作：

1. **複製範例檔案**：將 `default_keywords.example.json` 檔案複製並重新命名為 `default_keywords.json`。
   ```bash
   cp default_keywords.example.json default_keywords.json
   ```
2. **自定義關鍵詞**（可選）：在 `default_keywords.json` 中輸入您想預設追蹤的關鍵詞。
3. **載入擴充功能**：
   - 打開 Chrome，進入 `chrome://extensions/`。
   - 開啟「開發者模式」。
   - 點擊「載入解壓縮共用功能」，選擇專案所在的資料夾。

> [!TIP]
> 預設資料庫支援：安裝後，若儲存庫為空，系統會自動嘗試載入 `default_keywords.json` 中的內容。

## 🛠️ 安裝說明

1. 下載或複製此專案到您的本地目錄。
2. 打開 Chrome 瀏覽器，進入 `chrome://extensions/`。
3. 開啟右上角的「開發者模式」。
4. 點擊「載入解壓縮共用功能」，選擇專案所在的資料夾。

## 檔案結構

- `manifest.json`: 擴充功能設定檔。
- `popup.html/.css/.js`: 管理介面的結構、樣式與邏輯。
- `content.js`: 負責在網頁上執行高亮邏輯。
- `default_keywords.json`: 內建的關鍵詞資料庫（需自定義）。
- `default_keywords.example.json`: 關鍵詞資料庫的範例檔案。
- `icon.png`: 擴充功能圖示。

## 💡 使用小技巧

- **自動載入**：如果您想回歸初始狀態，只需清空所有關鍵詞，擴充功能會在下次開啟時自動從 `default_keywords.json` 重新載入。
- **高亮樣式**：可以透過修改 `highlight.css` 來自定義關鍵詞在網頁上的外觀。

---

_由 Senior Principal Engineer 以最高標準打造。_
