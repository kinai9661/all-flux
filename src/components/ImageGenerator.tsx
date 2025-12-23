import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api, type GenerateImageParams } from '../lib/api';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Loader2, Sparkles, Download, Trash2, Image as ImageIcon } from 'lucide-react';
import { downloadImage } from '../lib/utils';
import { cn } from '../lib/utils';

interface ImageGeneratorProps {
  config: any;
}

interface HistoryItem {
  image: string;
  prompt: string;
  metadata: any;
  timestamp: number;
}

export default function ImageGenerator({ config }: ImageGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [model, setModel] = useState('zimage');
  const [size, setSize] = useState('square-1k');
  const [style, setStyle] = useState('none');
  const [qualityMode, setQualityMode] = useState('standard');
  const [seed, setSeed] = useState(-1);
  const [currentResult, setCurrentResult] = useState<any>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // 從 LocalStorage 加載歷史
  useEffect(() => {
    const saved = localStorage.getItem('flux_ai_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load history', e);
      }
    }
  }, []);

  // 保存歷史到 LocalStorage
  const saveHistory = (newHistory: HistoryItem[]) => {
    setHistory(newHistory);
    localStorage.setItem('flux_ai_history', JSON.stringify(newHistory));
  };

  const generateMutation = useMutation({
    mutationFn: (params: GenerateImageParams) => api.generateImage(params),
    onSuccess: (data) => {
      if (data.success && data.data && data.data[0]) {
        const result = data.data[0];
        setCurrentResult(result);
        
        // 添加到歷史
        const newItem: HistoryItem = {
          image: result.image,
          prompt,
          metadata: result.metadata,
          timestamp: Date.now()
        };
        const newHistory = [newItem, ...history].slice(0, 50);
        saveHistory(newHistory);
      }
    },
  });

  const handleGenerate = () => {
    if (!prompt.trim()) {
      alert('請輸入提示詞');
      return;
    }

    const selectedSize = config.sizes.find((s: any) => s.id === size);
    
    generateMutation.mutate({
      prompt,
      model,
      width: selectedSize?.width || 1024,
      height: selectedSize?.height || 1024,
      negative_prompt: negativePrompt,
      style,
      quality_mode: qualityMode,
      seed: seed === -1 ? undefined : seed,
    });
  };

  const clearHistory = () => {
    if (confirm('確定要清空歷史記錄嗎？')) {
      saveHistory([]);
    }
  };

  const currentStyle = config.styles.find((s: any) => s.id === style);

  // 按分類組織風格
  const stylesByCategory = config.style_categories.map((category: any) => ({
    ...category,
    styles: config.styles.filter((s: any) => s.category === category.id)
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white p-6">
      <div className="container mx-auto">
        {/* 頂部標題 */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-2">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              🎨 Flux AI Pro
            </span>
          </h1>
          <p className="text-gray-400">
            v{config.version} | {config.styles.length} 種風格 | 
            {config.api_status.authenticated ? ' 🔐 已認證' : ' ⚠️ 未認證'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左側：參數面板 */}
          <div className="space-y-4">
            {/* 提示詞 */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-400">
                  💬 提示詞
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>正面提示詞</Label>
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="描述你想生成的圖像...

例如：
• A beautiful sunset over mountains
• 一隻可愛的貓咪在花園裡玩耍
• Cyberpunk city at night, neon lights"
                    rows={6}
                    className="bg-gray-900/50 border-gray-700"
                  />
                </div>

                <div className="space-y-2">
                  <Label>負面提示詞（可選）</Label>
                  <Textarea
                    value={negativePrompt}
                    onChange={(e) => setNegativePrompt(e.target.value)}
                    placeholder="不想要的內容... 例如：blurry, low quality"
                    rows={2}
                    className="bg-gray-900/50 border-gray-700"
                  />
                </div>
              </CardContent>
            </Card>

            {/* 生成參數 */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-400">
                  ⚙️ 生成參數
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 模型 */}
                <div className="space-y-2">
                  <Label>模型</Label>
                  <Select value={model} onValueChange={setModel}>
                    <SelectTrigger className="bg-gray-900/50 border-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {config.models.map((m: any) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.icon} {m.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 尺寸 */}
                <div className="space-y-2">
                  <Label>尺寸</Label>
                  <Select value={size} onValueChange={setSize}>
                    <SelectTrigger className="bg-gray-900/50 border-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {config.sizes.map((s: any) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.icon} {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 質量模式 */}
                <div className="space-y-2">
                  <Label>質量模式</Label>
                  <Select value={qualityMode} onValueChange={setQualityMode}>
                    <SelectTrigger className="bg-gray-900/50 border-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {config.quality_modes.map((q: any) => (
                        <SelectItem key={q.id} value={q.id}>
                          {q.icon} {q.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Seed */}
                <div className="space-y-2">
                  <Label>Seed (-1 = 隨機)</Label>
                  <input
                    type="number"
                    value={seed}
                    onChange={(e) => setSeed(parseInt(e.target.value))}
                    min={-1}
                    max={999999}
                    className="w-full h-10 bg-gray-900/50 border border-gray-700 rounded-md px-3 text-white"
                  />
                </div>

                {/* 生成按鈕 */}
                <Button
                  onClick={handleGenerate}
                  disabled={generateMutation.isPending}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  size="lg"
                >
                  {generateMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      生成中...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      開始生成
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* 中間：風格選擇 */}
          <div>
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-400">
                  🎨 藝術風格
                </CardTitle>
                <CardDescription>
                  {currentStyle && (
                    <span className="text-purple-300">
                      當前：{currentStyle.icon} {currentStyle.name}
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[650px] overflow-y-auto">
                  {stylesByCategory.map((category: any) => (
                    category.styles.length > 0 && (
                      <div key={category.id}>
                        <h3 className="text-sm font-semibold text-gray-400 mb-2">
                          {category.icon} {category.name}
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                          {category.styles.map((s: any) => (
                            <button
                              key={s.id}
                              onClick={() => setStyle(s.id)}
                              className={cn(
                                'p-3 rounded-lg border transition-all text-left',
                                style === s.id
                                  ? 'bg-purple-500/20 border-purple-500'
                                  : 'bg-gray-900/50 border-gray-700 hover:border-purple-500/50'
                              )}
                            >
                              <div className="text-xl mb-1">{s.icon}</div>
                              <div className="text-sm font-medium">{s.name}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 右側：結果展示 */}
          <div className="space-y-4">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-400">
                  🖼️ 生成結果
                </CardTitle>
              </CardHeader>
              <CardContent>
                {generateMutation.isPending && (
                  <div className="text-center py-20">
                    <Loader2 className="w-12 h-12 animate-spin text-purple-500 mx-auto mb-4" />
                    <p className="text-gray-400">AI 正在創作中...</p>
                    <p className="text-sm text-gray-500 mt-2">這可能需要 30-60 秒</p>
                  </div>
                )}

                {generateMutation.isError && (
                  <div className="text-center py-20 text-red-400">
                    <p className="text-4xl mb-4">❌</p>
                    <p>生成失敗</p>
                  </div>
                )}

                {!generateMutation.isPending && !currentResult && (
                  <div className="text-center text-gray-400 py-20">
                    <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>尚未生成圖像</p>
                    <p className="text-sm mt-2">填寫參數後點擊生成</p>
                  </div>
                )}

                {currentResult && (
                  <div className="space-y-4">
                    <img
                      src={currentResult.image}
                      alt="Generated"
                      className="w-full rounded-lg border border-gray-700"
                    />
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                        {currentResult.metadata.model}
                      </span>
                      <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs">
                        Seed: {currentResult.metadata.seed}
                      </span>
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs">
                        {currentResult.metadata.width}x{currentResult.metadata.height}
                      </span>
                    </div>
                    <Button
                      onClick={() => downloadImage(currentResult.image, `flux-${currentResult.metadata.seed}.png`)}
                      variant="outline"
                      className="w-full"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      下載圖片
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 歷史記錄 */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-purple-400">
                    📚 歷史記錄
                  </span>
                  {history.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearHistory}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </CardTitle>
                <CardDescription>
                  總共 {history.length} 條記錄
                </CardDescription>
              </CardHeader>
              <CardContent>
                {history.length === 0 ? (
                  <p className="text-center text-gray-400 py-8">暫無歷史</p>
                ) : (
                  <div className="grid grid-cols-2 gap-2 max-h-[400px] overflow-y-auto">
                    {history.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentResult({ image: item.image, metadata: item.metadata })}
                        className="relative group"
                      >
                        <img
                          src={item.image}
                          alt="History"
                          className="w-full h-24 object-cover rounded-lg border border-gray-700 group-hover:border-purple-500 transition-colors"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <span className="text-white text-xs">查看</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
