export interface GenerateParams {
  prompt: string
  model?: 'zimage' | 'flux' | 'turbo' | 'kontext'
  width?: number
  height?: number
  style?: string
  quality_mode?: 'economy' | 'standard' | 'ultra'
  seed?: number
  n?: number
  negative_prompt?: string
  auto_optimize?: boolean
  auto_hd?: boolean
  reference_images?: string[]
}

export interface GeneratedImage {
  image: string // data URL
  model: string
  seed: number
  width: number
  height: number
  quality_mode: string
  style: string
  style_name: string
  generation_mode: string
}

export interface GenerateResponse {
  created: number
  data: GeneratedImage[]
  generation_time_ms: number
  api_endpoint: string
  authenticated: boolean
}

export interface StylePreset {
  name: string
  prompt: string
  negative: string
  category: string
  icon: string
  description: string
}

export interface HistoryItem extends GeneratedImage {
  id: string
  timestamp: string
  prompt: string
  negative_prompt?: string
  reference_images?: string[]
}
