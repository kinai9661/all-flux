# 🎨 Flux AI Pro v10 - React 前端應用

> 強大的 AI 圖像生成器 - Worker API + React + Radix UI

![Version](https://img.shields.io/badge/version-10.0.0-purple)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## ✨ 功能特點

### 🎨 完整 UI 生圖界面
- **提示詞輸入**：中英文支持，自動翻譯
- **45+ 藝術風格**：插畫、漫畫、寫實、數位、奇幻等 10 大分類
- **智能參數控制**：模型、尺寸、質量、Seed
- **實時預覽**：即時查看生成結果
- **歷史記錄**：自動保存最近 50 張圖片

### 🚀 技術亮點
- **React 18** + **TypeScript** 現代化開發
- **Radix UI** 無障礙組件庫
- **Tailwind CSS** 快速樣式開發
- **TanStack Query** 強大的異步狀態管理
- **Vite** 極速構建工具
- **Cloudflare Workers** 全球邊緣計算

## 📸 界面預覽

```
┌───────────────────────────────────────────────────────┐
│           🎨 Flux AI Pro v10.0.0                      │
│        45 種風格 | 🔐 已認證                        │
├──────────────┬──────────────┬────────────────────────┤
│  💬 提示詞  │  🎨 風格  │    🖼️ 結果展示      │
│              │              │                        │
│ [輸入框]    │ ⚡ 無風格    │   [生成的圖片]   │
│              │ 🎭 動漫      │                        │
│ ⚙️ 模型      │ 🍃 吉卜力    │   Seed: 123456       │
│ ⚙️ 尺寸      │ 📖 漫畫      │   1024x1024          │
│ ⚙️ 質量      │ 📷 寫實      │                        │
│ ⚙️ Seed      │ 🖼️ 油畫     │   [💾 下載]         │
│              │ ...          │                        │
│ [✨開始生成] │              │  📚 歷史 (12)       │
│              │              │  [🖼️][🖼️][🖼️][🖼️]  │
└──────────────┴──────────────┴────────────────────────┘
```

## 🚀 快速開始

### 1️⃣ 克隆項目

```bash
git clone https://github.com/kinai9661/all-flux.git
cd all-flux
```

### 2️⃣ 安裝依賴

```bash
npm install
```

### 3️⃣ 配置 API Key

```bash
# 設置 Pollinations API Key
wrangler secret put POLLINATIONS_API_KEY
# 輸入你的 API Key
```

### 4️⃣ 啟動開發環境

```bash
# Terminal 1: 啟動 Worker API
npx wrangler dev

# Terminal 2: 啟動前端應用
npm run dev
```

### 5️⃣ 訪問應用

打開瀏覽器訪問：**http://localhost:3000**

---

## 📚 詳細說明

### 📁 項目結構

```
all-flux/
├── worker.js                  # Cloudflare Worker API 後端
├── wrangler.toml               # Worker 配置
├── package.json                # 前端依賴
├── vite.config.ts              # Vite 配置
├── tailwind.config.js          # Tailwind 配置
├── tsconfig.json               # TypeScript 配置
└── src/
    ├── App.tsx                 # 主應用
    ├── main.tsx                # 入口文件
    ├── lib/
    │   ├── api.ts              # API 調用邏輯
    │   └── utils.ts            # 工具函數
    ├── components/
    │   ├── ImageGenerator.tsx  # 主界面組件
    │   └── ui/                 # Radix UI 組件
    │       ├── button.tsx
    │       ├── card.tsx
    │       ├── select.tsx
    │       ├── slider.tsx
    │       ├── tabs.tsx
    │       ├── textarea.tsx
    │       └── label.tsx
    └── styles/
        └── globals.css         # 全局樣式
```

### 🎨 支持的風格分類

| 分類 | 風格數量 | 代表風格 |
|------|---------|----------|
| 🎨 插畫動畫 | 2 | 動漫、吉卜力 |
| 📖 漫畫 | 4 | 日本漫畫、美式漫畫、Q版 |
| ⚫ 黑白 | 3 | 素描、水墨 |
| 📷 寫實 | 1 | 超高清攝影 |
| 🖼️ 繪畫 | 2 | 油畫、水彩 |
| 🎭 藝術流派 | 4 | 印象派、抽象、立體主義 |
| ✨ 視覺風格 | 5 | 霸虹、賽博朋克、復古 |
| 💻 數位 | 4 | 像素、低多邊形、3D渲染 |
| 🐉 奇幻 | 1 | 魔法史詩 |

### 🧪 支持的模型

- **⚡ Z-Image Turbo**：快速 6B 參數生成
- **🎨 Flux 標準版**：平衡速度與質量
- **⚡ Flux Turbo**：超快速生成
- **🖼️ Kontext**：支持圖生圖

### 📊 質量模式

- **⚡ 經濟模式**：快速生成，質量較低
- **⚖️ 標準模式**：平衡速度與質量（推薦）
- **💎 超高清模式**：極致質量，耗時較長

---

## 🛠️ 開發指南

### 本地開發

```bash
# 安裝依賴
npm install

# 同時啟動 Worker 和前端
# Terminal 1
npx wrangler dev

# Terminal 2
npm run dev
```

前端會自動代理 `/api` 請求到 Worker。

### 構建生產版本

```bash
npm run build
```

構建輸出在 `dist/` 目錄。

---

## 🌐 部署

### 部署 Worker API

```bash
# 1. 設置 API Key
wrangler secret put POLLINATIONS_API_KEY

# 2. 部署
wrangler deploy

# 得到 URL：https://fluxaipor8.kinai9661.workers.dev
```

### 部署前端到 Cloudflare Pages

```bash
# 1. 修改 src/lib/api.ts 中的 API_BASE
const API_BASE = 'https://fluxaipor8.kinai9661.workers.dev/api';

# 2. 構建
npm run build

# 3. 部署
npx wrangler pages deploy dist
```

### 或者部署到其他平台

- **Vercel**：`vercel deploy`
- **Netlify**：`netlify deploy`
- **Zeabur**：直接連接 GitHub 自動部署

---

## 🔧 API 端點

### POST /api/generate
生成圖像

```bash
curl -X POST https://your-worker.workers.dev/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A beautiful sunset over mountains",
    "model": "zimage",
    "width": 1024,
    "height": 1024,
    "style": "anime",
    "quality_mode": "standard",
    "seed": -1
  }'
```

### GET /api/config
獲取配置（模型、風格、尺寸等）

```bash
curl https://your-worker.workers.dev/api/config
```

### GET /api/health
健康檢查

```bash
curl https://your-worker.workers.dev/api/health
```

---

## ❓ 常見問題

### Q: 前端無法連接 API？

**A:** 確保：
1. Worker 已啟動：`npx wrangler dev`
2. `vite.config.ts` 中的 proxy 配置正確
3. 生產環境中修改 `src/lib/api.ts` 的 `API_BASE`

### Q: 翻譯功能不工作？

**A:** 確保 `wrangler.toml` 中已啟用：
```toml
[ai]
binding = "AI"
```

### Q: 如何獲取 Pollinations API Key？

**A:** 訪問 [Pollinations.ai](https://pollinations.ai) 註冊獲取。

### Q: 歷史記錄保存在哪裡？

**A:** 保存在瀏覽器的 LocalStorage 中，清空瀏覽器緩存會清除。

---

## 💻 技術棧

### 後端
- Cloudflare Workers
- Workers AI (m2m100-1.2b 翻譯模型)
- Pollinations.ai API

### 前端
- React 18.2
- TypeScript 5.3
- Vite 5.0
- Radix UI
- Tailwind CSS 3.4
- TanStack Query 5.17
- Axios 1.6
- Lucide React (Icons)

---

## 📝 計劃中的功能

- [ ] 多張圖片同時生成
- [ ] 圖生圖功能（上傳參考圖）
- [ ] 更多風格預設
- [ ] 提示詞範例庫
- [ ] 批量下載
- [ ] 分享功能

---

## 📝 License

MIT License

---

## 👏 貪献

歡迎提交 PR 或 Issue！

---

## 💬 聯繫

- GitHub: [@kinai9661](https://github.com/kinai9661)
- Email: kinai9661@gmail.com

---

**Enjoy creating amazing AI art with Flux AI Pro! 🎨✨**
