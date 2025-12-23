# All-Flux Frontend

基於 Vite + React + TypeScript + shadcn/ui 的 AI 圖像生成前端應用。

## 技術棧

- **框架**: React 18 + TypeScript
- **構建工具**: Vite
- **UI 組件**: shadcn/ui + Radix UI
- **樣式**: Tailwind CSS
- **狀態管理**: TanStack Query
- **表單處理**: React Hook Form + Zod
- **HTTP 客戶端**: Axios

## 功能特性

✨ **AI 圖像生成**
- 支持多個模型：Z-Image Turbo、Flux、Flux Turbo、Kontext
- 45+ 種藝術風格預設
- 靈活的尺寸配置（方形、橫屏、豎屏）
- 質量模式選擇（經濟、標準、超高清）

🎨 **用戶體驗**
- 響應式設計，支持移動端
- 暗色模式支持
- 圖像歷史記錄（本地存儲）
- 實時生成進度顯示
- 圖像下載和復用功能

## 開始使用

### 安裝依賴

```bash
cd frontend
npm install
```

### 開發模式

```bash
# 啟動開發服務器
npm run dev

# 同時在另一個終端啟動 Worker
cd ..
npx wrangler dev
```

訪問 http://localhost:5173

### 生產構建

```bash
npm run build
npm run preview
```

## 項目結構

```
frontend/
├── src/
│   ├── components/        # React 組件
│   │   ├── ui/           # shadcn/ui 基礎組件
│   │   ├── generate-form.tsx
│   │   ├── image-gallery.tsx
│   │   └── ...
│   ├── lib/              # 工具函數
│   │   ├── api.ts        # API 客戶端
│   │   ├── storage.ts    # 本地存儲
│   │   └── utils.ts      # 通用工具
│   ├── config/           # 配置文件
│   │   └── styles.ts     # 風格預設
│   ├── types/            # TypeScript 類型
│   │   └── api.ts
│   ├── App.tsx           # 主應用組件
│   ├── main.tsx          # 入口文件
│   └── index.css         # 全局樣式
├── public/               # 靜態資源
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 配置說明

### API 端點配置

編輯 `src/lib/api.ts`：

```typescript
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://your-worker.workers.dev' // 生產環境
  : '' // 開發環境使用 Vite proxy
```

### 環境變量

創建 `.env` 文件：

```env
VITE_API_URL=https://your-worker.workers.dev
```

## 部署

### Cloudflare Pages

```bash
# 構建
npm run build

# 部署
npx wrangler pages deploy dist
```

### Vercel / Netlify

1. 構建命令: `npm run build`
2. 輸出目錄: `dist`
3. 設置環境變量 `VITE_API_URL`

## 開發指南

### 添加新的 shadcn/ui 組件

```bash
npx shadcn@latest add [component-name]
```

### 自定義風格

編輯 `src/config/styles.ts` 添加新的藝術風格預設。

### API 集成

所有 API 調用都在 `src/lib/api.ts` 中定義，使用 axios 和 TanStack Query 進行數據管理。

## 許可證

MIT
