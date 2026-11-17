# EMMA HAUTE NAIL ATELIER · 3D 滾動視差拆解展示

專為頂級高訂美甲作品打造的 Apple 官網級別「3D 滾動視差影格動畫（Frame Sequence Animation）」沈浸式展示系統。

---

## 🌟 核心特色

1. **Apple 官網級 3D 滾動視差引擎**：
   - `400vh` 沉浸式滾動高度，精確映射 300 幀 3D 三層工藝拆解動畫。
   - 搭載 **Lerp 物理平滑阻尼插值**（Lerp Factor `0.14`），即便快速滑動或滾輪跳格也能絲滑過渡。
   - 支援 **Retina / High-DPI 螢幕高解析度適配** 與動態寬高比 Contain 自適應。

2. **100% 無縫黑金邊緣融合（Seamless Vignette Blending）**：
   - 畫布內建動態雙重放射狀漸層羽化（Radial Vignette）。
   - 外層搭配純黑 `#070709` 漸層遮罩，消除照片原有邊框線條，讓黑金貓眼主體無縫懸浮於螢幕中央。

3. **智能影格載入器（Sequence Preload & Auto-detection）**：
   - 自動讀取 `public/frames/manifest.json` 或依序自動偵測 `emma_001.jpg` ~ `emma_300.jpg`（支援 3 位數零補齊）。
   - 12 軌非同步併發批次預載，Frame 0 優先秒開渲染，搭配香檳金環形進度儀表，提供零等待的純淨體驗。

4. **高奢藝術總監排版與隨滾動浮動工藝敘事**：
   - **0% – 30%**：品牌大標 `NOCTURNE EMERALD` 與「三層工藝・微雕之境」引言。
   - **40%**：側邊優雅浮現「01. 溫和卸甲與建構護甲基底」。
   - **65%**：側邊優雅浮現「02. 深邃祖母綠貓眼磁粉光影層」。
   - **90%**：側邊優雅浮現「03. 純手工立體香檳金浮雕與高透封層」。
   - **95% – 100%**：完整三層合體展示與鑑賞預約引導。

5. **奢華細節配備**：
   - 底部 Apple 質感時間軸控制器（支援拖拉微調、章節一鍵跳轉、自動旋轉演示 Play/Pause）。
   - Web Audio API 432Hz 氛圍微音效與滑動觸感音（可自由切換開關）。
   - 毛玻璃高訂鑑賞預約表單與技術規格彈窗。

---

## 📂 專案檔案結構

```
haute-nail-sequence/
├── public/
│   └── frames/
│       ├── manifest.json         # 影格規格設定與章節標記
│       ├── emma_001.jpg          # 影格檔案（001 ~ 300）
│       └── ...
├── src/
│   ├── components/
│   │   ├── CanvasStage.jsx       # Canvas 高效繪製、Lerp 插值與羽化融合核心
│   │   ├── StoryOverlays.jsx     # 4 階段浮動工藝敘事卡片（0-30%, 40%, 65%, 90%）
│   │   ├── LuxuryHeader.jsx      # 頂部高奢導航、章節提示、音效開關、預約 CTA
│   │   ├── TimelineControls.jsx  # 底部時間軸控制器、章節快選與播放模式
│   │   ├── Preloader.jsx         # 香檳金環形預載儀表
│   │   └── CraftModal.jsx        # 高訂美甲材料規格與預約彈窗
│   ├── hooks/
│   │   └── useImageSequence.js   # 影格自動偵測與高效併發預載 Hook
│   ├── utils/
│   │   └── audio.js              # 輕量級 Web Audio 氛圍合成器
│   ├── App.jsx                   # 400vh 滾動容器與狀態中樞
│   ├── index.css                 # 高奢字體、金色漸層與毛玻璃樣式
│   └── main.jsx
├── index.html
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## 🚀 啟動與執行指令

### 1. 進入專案目錄
```bash
cd C:\Users\DESMOND\.gemini\antigravity\scratch\haute-nail-sequence
```

### 2. 安裝依賴套件（已預先安裝完成）
```bash
npm install
```
*(Windows PowerShell 若受執行策略限制，可使用 `npm.cmd install`)*

### 3. 啟動開發伺服器
```bash
npm run dev
```
*(或在 PowerShell 執行 `npm.cmd run dev`)*

啟動後請使用瀏覽器開啟終端機顯示的本機網址（預設為 `http://localhost:3000`），即可體驗極致流暢的 Apple 官網級 3D 滾動視差展示！
