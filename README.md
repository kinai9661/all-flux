# 🎨 Flux AI Pro v10 - 方案 B （分離架構）

> AI 圖像生成器 - Worker API + React 前端 + Radix UI

## 🎯 架構說明

```
all-flux/
├── worker.js           # Cloudflare Worker API 後端 (純 API)
├── wrangler.toml        # Worker 配置
├── package.json         # 前端依賴
├── vite.config.ts       # Vite 構建配置
└── src/                 # React 前端應用
    ├── App.tsx
    ├── main.tsx
    ├── lib/
    │   ├── api.ts         # API 調用邏輯
    │   └── utils.ts
    └── components/
        ├── ImageGenerator.tsx
        ├── StyleSelector.tsx
        └── ui/              # Radix UI 組件
```

## ✨ 功能特點

### API 後端 (Worker)
- ✅ 純 RESTful API
- ✅ Workers AI 中文翻譯
- ✅ 45+ 風格預設
- ✅ 智能參數優化
- ✅ 多模型支持 (Z-Image, Flux, Turbo, Kontext)

### 前端 (React + Radix UI)
- ✅ 現代化 UI/UX
- ✅ Radix UI 無障礙組件
- ✅ Tailwind CSS 樣式
- ✅ React Query 狀態管理
- ✅ 歷史記錄功能
- ✅ 響應式設計

## 🚀 快速開始

### 1. 部署 Worker API

```bash
# 設置 API Key
wrangler secret put POLLINATIONS_API_KEY

# 部署 Worker
wrangler deploy

# 測試 API
curl https://your-worker.workers.dev/api/health
```

### 2. 開發前端

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev

# 訪問 http://localhost:3000
```

### 3. 部署前端到 Cloudflare Pages

```bash
# 構建生產版本
npm run build

# 部署到 Pages
npx wrangler pages deploy dist
```

## 📁 API 端點

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
    "quality_mode": "standard"
  }'
```

### GET /api/config
獲取配置信息（模型、風格、尺寸等）

```bash
curl https://your-worker.workers.dev/api/config
```

### GET /api/health
健康檢查

```bash
curl https://your-worker.workers.dev/api/health
```

## 🎨 支持的風格

### 10 大分類，45+ 風格

- 🎨 **插畫動畫**: 動漫、吉卜力
- 📖 **漫畫**: 日本漫畫、美式漫畫、Q版
- ⚫ **黑白**: 素描、水墨
- 📷 **寫實**: 超高清攝影
- 🖼️ **繪畫**: 油畫、水彩
- 🎭 **藝術流派**: 印象派、抽象、立體主義、超現實
- ✨ **視覺風格**: 霸虹、復古、賽博朋克、蒸汽朋克
- 💻 **數位**: 像素、低多邊形、3D渲染
- 🐉 **奇幻**: 魔法、史詩

## 🔧 技術棧

### 後端
- Cloudflare Workers
- Workers AI (m2m100-1.2b)
- Pollinations.ai API

### 前端
- React 18
- TypeScript
- Vite
- Radix UI
- Tailwind CSS
- TanStack Query
- Axios
- Lucide Icons

## 💻 開發

```bash
# 本地開發（同時啟動 Worker 和前端）

# Terminal 1: 啟動 Worker
npx wrangler dev

# Terminal 2: 啟動前端
npm run dev
```

前端會自動代理 `/api` 請求到 Worker。

## 🔐 環境變量

### Worker
```bash
POLLINATIONS_API_KEY=your_api_key_here
```

### 前端 (生產環境)
在 `src/lib/api.ts` 中修改：
```typescript
const API_BASE = 'https://your-worker.workers.dev/api';
```

## 🚀 部署流程

### 選項 1：分離部署（推薦）

1. **Worker API**: Cloudflare Workers
2. **前端**: Cloudflare Pages / Vercel / Netlify

### 選項 2：同域名部署

使用 Cloudflare Pages + Workers 整合：
- Pages 處理静態文件
- Worker 處理 `/api/*` 路徑

## 🐞 常見問題

### Q: 前端無法連接 API？
A: 確保 `src/lib/api.ts` 中的 `API_BASE` 指向正確的 Worker 地址。

### Q: CORS 錯誤？
A: Worker 已配置 CORS，如果仍有問題，檢查是否使用 HTTPS。

### Q: 翻譯功能不工作？
A: 確保 Worker 的 `wrangler.toml` 中已啟用 `[ai]` binding。

## 📝 License

MIT License

## 💬 聯繫

GitHub: [@kinai9661](https://github.com/kinai9661)

---

**Enjoy creating amazing AI art! 🎨✨**
