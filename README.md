# Keyword Highlighter (Chrome Extension)

[中文版 (Chinese Version)](README_zh-TW.md)

A powerful Chrome extension designed to automatically detect and highlight your specified keywords on any webpage you visit.

## ✨ Features

- **🚀 Automated Highlighting**: Automatically scans and highlights keywords as you browse, no manual action required.
- **📦 Default Database Support**: Support for loading a custom initial list of keywords from a JSON file.
- **🎨 Modern UI**: Beautifully designed interface with gradients and Noto Sans TC typography for a premium experience.
- **Dynamic Management**:
  - Add or delete keywords in real-time.
  - **Newest First Priority**: Newly added keywords automatically appear at the top of the list for easy management.
  - Real-time Syncing: Changes made in the popup are instantly reflected on the active tab.
- **⚡ Performance-Oriented**: Implements smart delays and node processing limits to ensure zero impact on page load speed.

## 🚀 Quick Start

To start using this extension with your own keyword list:

1. **Setup Config**: Copy `default_keywords.example.json` to `default_keywords.json`.
   ```bash
   cp default_keywords.example.json default_keywords.json
   ```
2. **Customize**: Add your desired keywords into `default_keywords.json`.
3. **Load Extension**:
   - Open Chrome and navigate to `chrome://extensions/`.
   - Enable "Developer mode" in the top right.
   - Click "Load unpacked" and select this project folder.

> [!TIP]
> **Initialization Support**: Upon first install or if your keyword list is empty, the extension will automatically attempt to load data from `default_keywords.json`.

## 🛠️ Installation

1. Clone or download this repository to your local machine.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode".
4. Click "Load unpacked" and select the extension directory.

## File Structure

- `manifest.json`: Extension configuration.
- `popup.html/.css/.js`: Structure, styling, and logic for the management popup.
- `content.js`: Handles the highlighting logic on webpages.
- `default_keywords.json`: Your custom default keyword database (ignored by git).
- `default_keywords.example.json`: A template for your keyword database.
- `icon.png`: Extension icon.

## 💡 Tips & Tricks

- **Auto-Reload**: To reset your list to the defaults defined in `default_keywords.json`, simply delete all current keywords.
- **Custom Styling**: You can customize how keywords look on webpages by editing `highlight.css`.

---

_Crafted with the highest standards by a Senior Principal Engineer._
