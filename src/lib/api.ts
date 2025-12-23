// API 調用邏輯
import axios from 'axios';

// 根據環境自動切換 API 地址
const API_BASE = import.meta.env.PROD 
  ? 'https://fluxaipor8.kinai9661.workers.dev/api'
  : '/api';

export interface GenerateImageParams {
  prompt: string;
  model?: string;
  width?: number;
  height?: number;
  seed?: number;
  negative_prompt?: string;
  style?: string;
  quality_mode?: string;
  reference_images?: string[];
  num_outputs?: number;
}

export interface ImageResult {
  image: string;
  metadata: {
    model: string;
    seed: number;
    width: number;
    height: number;
    style: string;
    steps: number;
    guidance: number;
    quality_mode: string;
    translated: boolean;
  };
}

export interface GenerateResponse {
  success: boolean;
  data?: ImageResult[];
  generation_time_ms?: number;
  logs?: any[];
  error?: {
    message: string;
    logs?: any[];
  };
}

export interface ConfigResponse {
  success: boolean;
  data: {
    version: string;
    models: any[];
    sizes: any[];
    styles: any[];
    style_categories: any[];
    quality_modes: any[];
    api_status: {
      authenticated: boolean;
      workers_ai: boolean;
    };
  };
}

export const api = {
  async generateImage(params: GenerateImageParams): Promise<GenerateResponse> {
    try {
      const response = await axios.post<GenerateResponse>(`${API_BASE}/generate`, params, {
        responseType: params.num_outputs === 1 ? 'blob' : 'json',
        timeout: 120000,
      });

      // 單張圖片：直接返回二進制
      if (response.headers['content-type']?.startsWith('image/')) {
        const blob = response.data as any;
        const imageUrl = URL.createObjectURL(blob);
        
        return {
          success: true,
          data: [{
            image: imageUrl,
            metadata: {
              model: response.headers['x-model'] || 'unknown',
              seed: parseInt(response.headers['x-seed'] || '0'),
              width: parseInt(response.headers['x-width'] || '1024'),
              height: parseInt(response.headers['x-height'] || '1024'),
              style: response.headers['x-style'] || 'none',
              steps: 0,
              guidance: 0,
              quality_mode: response.headers['x-quality-mode'] || 'standard',
              translated: false
            }
          }],
          generation_time_ms: parseInt(response.headers['x-generation-time']?.replace('ms', '') || '0')
        };
      }

      // 多張圖片：JSON 響應
      return response.data;
    } catch (error: any) {
      console.error('API Error:', error);
      if (error.response?.data) {
        return error.response.data;
      }
      return {
        success: false,
        error: {
          message: error.message || 'Network error'
        }
      };
    }
  },

  async getConfig(): Promise<ConfigResponse> {
    try {
      const response = await axios.get<ConfigResponse>(`${API_BASE}/config`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch config');
    }
  },

  async healthCheck() {
    try {
      const response = await axios.get(`${API_BASE}/health`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Health check failed');
    }
  }
};
