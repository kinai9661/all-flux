import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api, type GenerateImageParams } from '../lib/api';
import StyleSelector from './StyleSelector';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Loader2, Sparkles, Image as ImageIcon, Settings, History, Download } from 'lucide-react';
import { downloadImage, formatDuration } from '../lib/utils';

interface ImageGeneratorProps {
  config: any;
}

export default function ImageGenerator({ config }: ImageGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [model, setModel] = useState('zimage');
  const [size, setSize] = useState('square-1k');
  const [style, setStyle] = useState('none');
  const [qualityMode, setQualityMode] = useState('standard');
  const [seed, setSeed] = useState(-1);
  const [results, setResults] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);

  const generateMutation = useMutation({
    mutationFn: (params: GenerateImageParams) => api.generateImage(params),
    onSuccess: (data) => {
      if (data.success && data.data) {
        setResults(data.data);
        setHistory(prev => [...data.data, ...prev].slice(0, 50));
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

  const currentStyle = config.styles.find((s: any) => s.id === style);

  return (
    <div className="container mx-auto p-6">
      {/* 頂部標題 */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500 mb-2">
          🎨 Flux AI Pro
        </h1>
        <p className="text-gray-400">
          v{config.version} | {config.styles.length} 種風格 | 
          {config.api_status.authenticated ? ' 🔐 已認證' : ' ⚠️ 未認證'}
        </p>
      </div>

      <Tabs defaultValue="generate" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="generate" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            生成圖像
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="w-4 h-4" />
            歷史記錄 ({history.length})
          </TabsTrigger>
        </TabsList>

        {/* 生成頁面 */}
        <TabsContent value="generate" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 左側面板：參數 */}
            <Card className="lg:col-span-1 bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-500">
                  <Settings className="w-5 h-5" />
                  生成參數
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 模型選擇 */}
                <div className="space-y-2">
                  <Label>模型</Label>
                  <Select value={model} onValueChange={setModel}>
                    <SelectTrigger>
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

                {/* 尺寸選擇 */}
                <div className="space-y-2">
                  <Label>尺寸</Label>
                  <Select value={size} onValueChange={setSize}>
                    <SelectTrigger>
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
                    <SelectTrigger>
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
                  <Slider
                    value={[seed]}
                    onValueChange={(v) => setSeed(v[0])}
                    min={-1}
                    max={999999}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500">{seed}</p>
                </div>
              </CardContent>
            </Card>

            {/* 中間面板：提示詞和結果 */}
            <Card className="lg:col-span-2 bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-500">
                  <ImageIcon className="w-5 h-5" />
                  提示詞與結果
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 正面提示詞 */}
                <div className="space-y-2">
                  <Label>正面提示詞</Label>
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="描述你想生成的圖像...

例如：
• A beautiful sunset over mountains
• 一隻可愛的貓咖在花園裡玩耶
• Cyberpunk city at night"
                    rows={6}
                    className="bg-gray-900/50"
                  />
                </div>

                {/* 負面提示詞 */}
                <div className="space-y-2">
                  <Label>負面提示詞 (可選)</Label>
                  <Textarea
                    value={negativePrompt}
                    onChange={(e) => setNegativePrompt(e.target.value)}
                    placeholder="不想要的內容...例：blurry, low quality"
                    rows={2}
                    className="bg-gray-900/50"
                  />
                </div>

                {/* 風格選擇 */}
                <StyleSelector
                  styles={config.styles}
                  categories={config.style_categories}
                  selectedStyle={style}
                  onStyleChange={setStyle}
                />

                {/* 生成按鈕 */}
                <Button
                  onClick={handleGenerate}
                  disabled={generateMutation.isPending}
                  className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
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

                {/* 當前風格信息 */}
                {currentStyle && (
                  <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                    <p className="text-sm text-purple-300">
                      <strong>🎨 當前風格：</strong> {currentStyle.icon} {currentStyle.name}
                    </p>
                    {currentStyle.prompt && (
                      <p className="text-xs text-gray-400 mt-1">
                        {currentStyle.prompt}
                      </p>
                    )}
                  </div>
                )}

                {/* 結果顯示 */}
                {generateMutation.isError && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <p className="text-red-400">❌ 生成失敗</p>
                  </div>
                )}

                {results.length > 0 && (
                  <div className="space-y-4">
                    {results.map((result, idx) => (
                      <div key={idx} className="border border-gray-700 rounded-lg overflow-hidden">
                        <img
                          src={result.image}
                          alt="Generated"
                          className="w-full h-auto"
                        />
                        <div className="p-4 bg-gray-900/50">
                          <div className="flex flex-wrap gap-2 mb-2">
                            <span className="px-2 py-1 bg-orange-500/20 text-orange-300 rounded text-xs">
                              {result.metadata.model}
                            </span>
                            <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs">
                              Seed: {result.metadata.seed}
                            </span>
                            <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">
                              {result.metadata.width}x{result.metadata.height}
                            </span>
                          </div>
                          <Button
                            onClick={() => downloadImage(result.image, `flux-${result.metadata.seed}.png`)}
                            variant="outline"
                            size="sm"
                            className="w-full"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            下載
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 歷史記錄 */}
        <TabsContent value="history">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle>歷史記錄</CardTitle>
              <CardDescription>總共 {history.length} 條記錄</CardDescription>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <p className="text-center text-gray-500 py-8">暫無歷史記錄</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {history.map((item, idx) => (
                    <div key={idx} className="border border-gray-700 rounded-lg overflow-hidden">
                      <img src={item.image} alt="History" className="w-full h-48 object-cover" />
                      <div className="p-3 bg-gray-900/50">
                        <div className="flex gap-2 text-xs text-gray-400">
                          <span>{item.metadata.model}</span>
                          <span>Seed: {item.metadata.seed}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
