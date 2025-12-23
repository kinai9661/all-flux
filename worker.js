// =================================================================================
//  Flux AI Pro - Worker API Backend
//  版本: 10.0.0-radix-ui
//  作者: Enhanced by AI Assistant
//  日期: 2025-12-23
//  說明: 純 API 後端，配合 React + Radix UI 前端使用
// =================================================================================

const CONFIG = {
  PROJECT_NAME: "Flux-AI-Pro-API",
  PROJECT_VERSION: "10.0.0-radix-ui",
  API_MASTER_KEY: "1",
  FETCH_TIMEOUT: 120000,
  MAX_RETRIES: 3,
  
  POLLINATIONS_AUTH: {
    enabled: true,
    token: "",  // 從 env.POLLINATIONS_API_KEY 讀取
    method: "header"
  },
  
  PROVIDERS: {
    pollinations: {
      name: "Pollinations.ai",
      endpoint: "https://gen.pollinations.ai",
      pathPrefix: "/image",
      enabled: true,
      default: true,
      models: [
        { 
          id: "zimage", 
          name: "Z-Image Turbo", 
          category: "zimage",
          description: "快速 6B 參數圖像生成",
          max_size: 2048,
          pricing: { image_price: 0.0002, currency: "pollen" },
          icon: "⚡"
        },
        { 
          id: "flux", 
          name: "Flux 標準版", 
          category: "flux",
          description: "平衡速度與質量",
          max_size: 2048,
          pricing: { image_price: 0.00012, currency: "pollen" },
          icon: "🎨"
        },
        { 
          id: "turbo", 
          name: "Flux Turbo", 
          category: "flux",
          description: "超快速生成",
          max_size: 2048,
          pricing: { image_price: 0.0003, currency: "pollen" },
          icon: "⚡"
        },
        { 
          id: "kontext", 
          name: "Kontext", 
          category: "kontext",
          description: "支持圖生圖",
          max_size: 2048,
          pricing: { image_price: 0.04, currency: "pollen" },
          supports_reference_images: true,
          max_reference_images: 1,
          icon: "🖼️"
        }
      ]
    }
  },
  
  PRESET_SIZES: [
    { id: "square-1k", name: "方形 1024x1024", width: 1024, height: 1024, icon: "⬜" },
    { id: "square-1.5k", name: "方形 1536x1536", width: 1536, height: 1536, icon: "⬜" },
    { id: "square-2k", name: "方形 2048x2048", width: 2048, height: 2048, icon: "⬜" },
    { id: "portrait-9-16", name: "豎屏 9:16", width: 1080, height: 1920, icon: "📱" },
    { id: "landscape-16-9", name: "橫屏 16:9", width: 1920, height: 1080, icon: "🖥️" },
    { id: "instagram", name: "Instagram", width: 1080, height: 1080, icon: "📸" },
    { id: "wallpaper", name: "桌布", width: 1920, height: 1080, icon: "🖼️" }
  ],
  
  STYLE_PRESETS: {
    // 基礎
    none: { name: "無風格", prompt: "", negative: "", category: "basic", icon: "⚡" },
    
    // 插畫動畫
    anime: { name: "動漫", prompt: "anime style, vibrant colors, cel shading", negative: "realistic, photograph", category: "illustration", icon: "🎭" },
    ghibli: { name: "吉卜力", prompt: "Studio Ghibli style, Hayao Miyazaki, soft colors", negative: "realistic, dark", category: "illustration", icon: "🍃" },
    
    // 漫畫
    manga: { name: "日本漫畫", prompt: "manga style, black and white, screentones", negative: "color, realistic", category: "manga", icon: "📖" },
    "manga-color": { name: "彩色漫畫", prompt: "colored manga, vibrant colors, cel shading", negative: "realistic", category: "manga", icon: "🎨" },
    "american-comic": { name: "美式漫畫", prompt: "american comic book style, bold lines", negative: "anime, realistic", category: "manga", icon: "💥" },
    chibi: { name: "Q版", prompt: "chibi style, cute, kawaii, big head", negative: "realistic", category: "manga", icon: "🥰" },
    
    // 黑白
    "black-white": { name: "黑白", prompt: "black and white, monochrome, high contrast", negative: "color", category: "monochrome", icon: "⚫" },
    sketch: { name: "素描", prompt: "pencil sketch, hand drawn, graphite", negative: "color, digital", category: "monochrome", icon: "✏️" },
    "ink-drawing": { name: "水墨", prompt: "chinese ink painting, brush strokes", negative: "color, western", category: "monochrome", icon: "🖌️" },
    
    // 寫實
    photorealistic: { name: "寫實", prompt: "photorealistic, 8k uhd, professional photography", negative: "anime, cartoon", category: "realistic", icon: "📷" },
    
    // 繪畫
    "oil-painting": { name: "油畫", prompt: "oil painting, canvas texture, brushstrokes", negative: "photograph, digital", category: "painting", icon: "🖼️" },
    watercolor: { name: "水彩", prompt: "watercolor painting, soft colors", negative: "photograph, sharp", category: "painting", icon: "💧" },
    
    // 藝術流派
    impressionism: { name: "印象派", prompt: "impressionist painting, Monet style", negative: "sharp, photorealistic", category: "art-movement", icon: "🌅" },
    abstract: { name: "抽象", prompt: "abstract art, geometric shapes, bold colors", negative: "realistic", category: "art-movement", icon: "🎭" },
    cubism: { name: "立體主義", prompt: "cubist style, Picasso inspired", negative: "realistic", category: "art-movement", icon: "🔷" },
    surrealism: { name: "超現實", prompt: "surrealist art, dreamlike, Dali style", negative: "realistic, mundane", category: "art-movement", icon: "🌀" },
    
    // 視覺
    neon: { name: "霓虹", prompt: "neon lights, glowing, vibrant neon colors", negative: "daylight, muted", category: "visual", icon: "💡" },
    vintage: { name: "復古", prompt: "vintage style, retro, aged, nostalgic", negative: "modern", category: "visual", icon: "📻" },
    cyberpunk: { name: "賽博朋克", prompt: "cyberpunk, neon lights, futuristic", negative: "natural", category: "visual", icon: "🌃" },
    steampunk: { name: "蒸汽朋克", prompt: "steampunk, Victorian, brass and copper", negative: "modern", category: "visual", icon: "⚙️" },
    minimalist: { name: "極簡", prompt: "minimalist design, clean, simple", negative: "detailed, complex", category: "visual", icon: "◽" },
    
    // 數位
    "pixel-art": { name: "像素", prompt: "pixel art, 8-bit, retro gaming", negative: "high resolution", category: "digital", icon: "🎮" },
    "low-poly": { name: "低多邊形", prompt: "low poly 3d, geometric, faceted", negative: "detailed", category: "digital", icon: "🔺" },
    "3d-render": { name: "3D渲染", prompt: "3d render, octane render, ray tracing", negative: "2d, flat", category: "digital", icon: "🎬" },
    glitch: { name: "故障", prompt: "glitch art, digital corruption, RGB shift", negative: "clean", category: "digital", icon: "📺" },
    
    // 奇幻
    fantasy: { name: "奇幻", prompt: "fantasy art, magical, epic fantasy", negative: "modern, realistic", category: "fantasy", icon: "🐉" }
  },
  
  STYLE_CATEGORIES: [
    { id: "basic", name: "基礎", icon: "⚡" },
    { id: "illustration", name: "插畫動畫", icon: "🎨" },
    { id: "manga", name: "漫畫", icon: "📖" },
    { id: "monochrome", name: "黑白", icon: "⚫" },
    { id: "realistic", name: "寫實", icon: "📷" },
    { id: "painting", name: "繪畫", icon: "🖼️" },
    { id: "art-movement", name: "藝術流派", icon: "🎭" },
    { id: "visual", name: "視覺風格", icon: "✨" },
    { id: "digital", name: "數位", icon: "💻" },
    { id: "fantasy", name: "奇幻", icon: "🐉" }
  ],
  
  QUALITY_MODES: [
    { id: "economy", name: "經濟模式", description: "快速出圖", steps_multiplier: 0.85, icon: "⚡" },
    { id: "standard", name: "標準模式", description: "平衡質量與速度", steps_multiplier: 1.0, icon: "⚖️" },
    { id: "ultra", name: "超高清模式", description: "極致質量", steps_multiplier: 1.35, icon: "💎" }
  ]
};
// =================================================================================
// 工具類
// =================================================================================

class Logger {
  constructor() {
    this.logs = [];
  }
  add(title, data) {
    this.logs.push({ title, data, timestamp: new Date().toISOString() });
  }
  get() {
    return this.logs;
  }
}

function getClientIP(request) {
  return request.headers.get('cf-connecting-ip') || 
         request.headers.get('x-forwarded-for') || 
         request.headers.get('x-real-ip') || 
         'unknown';
}

async function translateToEnglish(text, env) {
  try {
    const hasChinese = /[\u4e00-\u9fa5]/.test(text);
    if (!hasChinese) return { text, translated: false };
    
    if (!env?.AI) {
      return { text, translated: false, reason: "AI not configured" };
    }
    
    const response = await env.AI.run("@cf/meta/m2m100-1.2b", { 
      text, 
      source_lang: "chinese", 
      target_lang: "english" 
    });
    
    if (response?.translated_text) {
      return { 
        text: response.translated_text, 
        translated: true, 
        original: text 
      };
    }
    
    return { text, translated: false };
  } catch (error) {
    console.error("Translation error:", error);
    return { text, translated: false };
  }
}

function corsHeaders(additionalHeaders = {}) {
  return { 
    'Access-Control-Allow-Origin': '*', 
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS', 
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With', 
    'Access-Control-Max-Age': '86400', 
    ...additionalHeaders 
  };
}

async function fetchWithTimeout(url, options = {}, timeout = CONFIG.FETCH_TIMEOUT) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeout}ms`);
    }
    throw error;
  }
}

// =================================================================================
// 風格處理器
// =================================================================================

class StyleProcessor {
  static applyStyle(prompt, style, negativePrompt) {
    const styleConfig = CONFIG.STYLE_PRESETS[style];
    if (!styleConfig || style === 'none') {
      return { 
        enhancedPrompt: prompt, 
        enhancedNegative: negativePrompt || "" 
      };
    }
    
    let enhancedPrompt = prompt;
    if (styleConfig.prompt) {
      enhancedPrompt = `${prompt}, ${styleConfig.prompt}`;
    }
    
    let enhancedNegative = negativePrompt || "";
    if (styleConfig.negative) {
      enhancedNegative = enhancedNegative 
        ? `${enhancedNegative}, ${styleConfig.negative}` 
        : styleConfig.negative;
    }
    
    return { enhancedPrompt, enhancedNegative };
  }
}

// =================================================================================
// 參數優化器
// =================================================================================

class ParameterOptimizer {
  static optimizeSteps(model, width, height, qualityMode = 'standard') {
    const baseSteps = {
      'zimage': 15,
      'flux': 20,
      'turbo': 8,
      'kontext': 25
    }[model] || 20;
    
    const qualityMultiplier = CONFIG.QUALITY_MODES.find(q => q.id === qualityMode)?.steps_multiplier || 1.0;
    const totalPixels = width * height;
    const sizeMultiplier = totalPixels > 1536 * 1536 ? 1.2 : 1.0;
    
    return Math.round(baseSteps * qualityMultiplier * sizeMultiplier);
  }
  
  static optimizeGuidance(model, style) {
    if (model === 'turbo') return 2.5;
    if (style === 'photorealistic') return 8.5;
    return 7.5;
  }
}

// =================================================================================
// 圖像生成提供商
// =================================================================================

class PollinationsProvider {
  constructor(config, env) {
    this.config = config;
    this.env = env;
  }
  
  async generate(prompt, options, logger) {
    const {
      model = "zimage",
      width = 1024,
      height = 1024,
      seed = -1,
      negativePrompt = "",
      style = "none",
      qualityMode = "standard",
      referenceImages = []
    } = options;
    
    // 風格處理
    const { enhancedPrompt, enhancedNegative } = StyleProcessor.applyStyle(
      prompt, style, negativePrompt
    );
    
    logger.add("Style Applied", { 
      style, 
      original_length: prompt.length, 
      enhanced_length: enhancedPrompt.length 
    });
    
    // 翻譯
    const translation = await translateToEnglish(enhancedPrompt, this.env);
    const finalPrompt = translation.text;
    
    if (translation.translated) {
      logger.add("Translation", { 
        original: translation.original?.substring(0, 50),
        translated: finalPrompt.substring(0, 50)
      });
    }
    
    // 參數優化
    const steps = ParameterOptimizer.optimizeSteps(model, width, height, qualityMode);
    const guidance = ParameterOptimizer.optimizeGuidance(model, style);
    
    logger.add("Parameters", { model, width, height, steps, guidance, quality: qualityMode });
    
    // 構建請求
    const currentSeed = seed === -1 ? Math.floor(Math.random() * 1000000) : seed;
    let fullPrompt = finalPrompt;
    if (enhancedNegative) {
      fullPrompt = `${finalPrompt} [negative: ${enhancedNegative}]`;
    }
    
    const encodedPrompt = encodeURIComponent(fullPrompt);
    const baseUrl = `${this.config.endpoint}${this.config.pathPrefix}/${encodedPrompt}`;
    
    const params = new URLSearchParams({
      model,
      width: width.toString(),
      height: height.toString(),
      seed: currentSeed.toString(),
      steps: steps.toString(),
      guidance: guidance.toString(),
      nologo: 'true',
      enhance: 'false',
      private: 'true'
    });
    
    if (referenceImages.length > 0) {
      params.append('image', referenceImages.join(','));
    }
    
    const url = `${baseUrl}?${params.toString()}`;
    
    const headers = {
      'User-Agent': 'Mozilla/5.0',
      'Accept': 'image/*',
      'Referer': 'https://pollinations.ai/'
    };
    
    // API 認證
    const authToken = CONFIG.POLLINATIONS_AUTH.token;
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
      logger.add("Auth", { status: "enabled" });
    } else {
      logger.add("Auth", { status: "disabled", warning: "No API key" });
    }
    
    // 發送請求
    for (let retry = 0; retry < CONFIG.MAX_RETRIES; retry++) {
      try {
        const response = await fetchWithTimeout(url, { 
          method: 'GET', 
          headers 
        }, 120000);
        
        if (response.ok) {
          const contentType = response.headers.get('content-type');
          if (contentType?.startsWith('image/')) {
            const imageBlob = await response.blob();
            const imageBuffer = await imageBlob.arrayBuffer();
            
            logger.add("Success", { 
              model, 
              seed: currentSeed, 
              size: `${width}x${height}`,
              style
            });
            
            return {
              imageData: imageBuffer,
              contentType,
              metadata: {
                model,
                seed: currentSeed,
                width,
                height,
                style,
                steps,
                guidance,
                quality_mode: qualityMode,
                translated: translation.translated
              }
            };
          } else {
            throw new Error(`Invalid content type: ${contentType}`);
          }
        } else if (response.status === 401) {
          throw new Error("Authentication failed: Invalid API key");
        } else {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText.substring(0, 200)}`);
        }
      } catch (error) {
        logger.add("Request Failed", { 
          error: error.message, 
          retry: retry + 1 
        });
        
        if (retry < CONFIG.MAX_RETRIES - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (retry + 1)));
        } else {
          throw new Error(`Generation failed: ${error.message}`);
        }
      }
    }
    
    throw new Error(`Failed after ${CONFIG.MAX_RETRIES} retries`);
  }
}
// =================================================================================
// 主入口：Worker Fetch Handler
// =================================================================================

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const startTime = Date.now();
    
    // 讀取 API Key
    if (env.POLLINATIONS_API_KEY) {
      CONFIG.POLLINATIONS_AUTH.token = env.POLLINATIONS_API_KEY;
      CONFIG.POLLINATIONS_AUTH.enabled = true;
    }
    
    console.log("Request:", url.pathname, "IP:", getClientIP(request));
    
    // CORS 預檢
    if (request.method === 'OPTIONS') {
      return new Response(null, { 
        status: 204, 
        headers: corsHeaders() 
      });
    }
    
    try {
      let response;
      
      // 路由分發
      switch (url.pathname) {
        case '/api/generate':
          response = await handleGenerate(request, env, ctx);
          break;
          
        case '/api/config':
          response = await handleGetConfig(request, env, ctx);
          break;
          
        case '/api/health':
          response = await handleHealth(request, env, ctx);
          break;
          
        default:
          response = new Response(JSON.stringify({
            error: 'Not Found',
            message: 'Available endpoints: /api/generate, /api/config, /api/health'
          }), { 
            status: 404,
            headers: corsHeaders({ 'Content-Type': 'application/json' })
          });
      }
      
      // 添加響應時間
      const duration = Date.now() - startTime;
      const headers = new Headers(response.headers);
      headers.set('X-Response-Time', `${duration}ms`);
      headers.set('X-Worker-Version', CONFIG.PROJECT_VERSION);
      
      return new Response(response.body, {
        status: response.status,
        headers
      });
      
    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({
        error: {
          message: error.message,
          type: 'worker_error'
        }
      }), {
        status: 500,
        headers: corsHeaders({ 'Content-Type': 'application/json' })
      });
    }
  }
};

// =================================================================================
// API 端點：生成圖像
// =================================================================================

async function handleGenerate(request, env, ctx) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: corsHeaders({ 'Content-Type': 'application/json' })
    });
  }
  
  const logger = new Logger();
  const startTime = Date.now();
  
  try {
    const body = await request.json();
    
    // 驗證必需參數
    if (!body.prompt?.trim()) {
      throw new Error("Prompt is required");
    }
    
    // 解析參數
    const options = {
      model: body.model || "zimage",
      width: Math.min(Math.max(body.width || 1024, 256), 2048),
      height: Math.min(Math.max(body.height || 1024, 256), 2048),
      seed: body.seed !== undefined ? parseInt(body.seed) : -1,
      negativePrompt: body.negative_prompt || "",
      style: body.style || "none",
      qualityMode: body.quality_mode || "standard",
      referenceImages: Array.isArray(body.reference_images) ? body.reference_images : [],
      numOutputs: Math.min(Math.max(body.num_outputs || 1, 1), 4)
    };
    
    logger.add("Request", { 
      prompt_length: body.prompt.length, 
      ...options 
    });
    
    // 生成圖像
    const provider = new PollinationsProvider(CONFIG.PROVIDERS.pollinations, env);
    const results = [];
    
    for (let i = 0; i < options.numOutputs; i++) {
      const currentOptions = {
        ...options,
        seed: options.seed === -1 ? -1 : options.seed + i
      };
      
      const result = await provider.generate(body.prompt, currentOptions, logger);
      results.push(result);
    }
    
    const duration = Date.now() - startTime;
    
    // 單張圖片：直接返回二進制
    if (results.length === 1) {
      const result = results[0];
      
      return new Response(result.imageData, {
        headers: {
          'Content-Type': result.contentType,
          'Content-Disposition': `inline; filename="flux-${result.metadata.seed}.png"`,
          'X-Model': result.metadata.model,
          'X-Seed': result.metadata.seed.toString(),
          'X-Width': result.metadata.width.toString(),
          'X-Height': result.metadata.height.toString(),
          'X-Style': result.metadata.style,
          'X-Quality-Mode': result.metadata.quality_mode,
          'X-Generation-Time': `${duration}ms`,
          ...corsHeaders()
        }
      });
    }
    
    // 多張圖片：返回 JSON（base64）
    const imagesData = await Promise.all(results.map(async (r) => {
      const uint8Array = new Uint8Array(r.imageData);
      let binary = '';
      for (let i = 0; i < uint8Array.byteLength; i++) {
        binary += String.fromCharCode(uint8Array[i]);
      }
      const base64 = btoa(binary);
      
      return {
        image: `data:${r.contentType};base64,${base64}`,
        metadata: r.metadata
      };
    }));
    
    return new Response(JSON.stringify({
      success: true,
      data: imagesData,
      generation_time_ms: duration,
      logs: logger.get()
    }), {
      headers: corsHeaders({ 
        'Content-Type': 'application/json',
        'X-Generation-Time': `${duration}ms`
      })
    });
    
  } catch (error) {
    logger.add("Error", { message: error.message });
    
    return new Response(JSON.stringify({
      success: false,
      error: {
        message: error.message,
        logs: logger.get()
      }
    }), {
      status: 400,
      headers: corsHeaders({ 'Content-Type': 'application/json' })
    });
  }
}

// =================================================================================
// API 端點：獲取配置
// =================================================================================

async function handleGetConfig(request, env, ctx) {
  return new Response(JSON.stringify({
    success: true,
    data: {
      version: CONFIG.PROJECT_VERSION,
      models: CONFIG.PROVIDERS.pollinations.models,
      sizes: CONFIG.PRESET_SIZES,
      styles: Object.entries(CONFIG.STYLE_PRESETS).map(([id, config]) => ({
        id,
        ...config
      })),
      style_categories: CONFIG.STYLE_CATEGORIES,
      quality_modes: CONFIG.QUALITY_MODES,
      api_status: {
        authenticated: CONFIG.POLLINATIONS_AUTH.enabled,
        workers_ai: !!env.AI
      }
    }
  }), {
    headers: corsHeaders({ 'Content-Type': 'application/json' })
  });
}

// =================================================================================
// API 端點：健康檢查
// =================================================================================

async function handleHealth(request, env, ctx) {
  return new Response(JSON.stringify({
    success: true,
    data: {
      status: 'ok',
      version: CONFIG.PROJECT_VERSION,
      timestamp: new Date().toISOString(),
      api_endpoint: CONFIG.PROVIDERS.pollinations.endpoint,
      authenticated: CONFIG.POLLINATIONS_AUTH.enabled,
      workers_ai: !!env.AI
    }
  }), {
    headers: corsHeaders({ 'Content-Type': 'application/json' })
  });
}
