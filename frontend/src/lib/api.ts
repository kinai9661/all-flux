import axios from 'axios'
import type { GenerateParams, GenerateResponse } from '@/types/api'

const API_BASE_URL = import.meta.env.PROD 
  ? 'https://all-flux.kinai9661.workers.dev' // 生產環境：更改為你的 Worker 網址
  : '' // 開發環境使用 Vite proxy

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // 2 分鐘
})

export async function generateImage(params: GenerateParams): Promise<GenerateResponse | Blob> {
  const response = await api.post('/_internal/generate', params, {
    responseType: params.n === 1 ? 'blob' : 'json',
  })
  
  // 單張圖片返回 Blob
  if (response.headers['content-type']?.startsWith('image/')) {
    return response.data
  }
  
  // 多張圖片返回 JSON
  return response.data
}

export async function getHealth() {
  const response = await api.get('/health')
  return response.data
}
