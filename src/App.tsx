import { useQuery } from '@tanstack/react-query';
import { api } from './lib/api';
import ImageGenerator from './components/ImageGenerator';
import { Loader2 } from 'lucide-react';

function App() {
  const { data: config, isLoading, error } = useQuery({
    queryKey: ['config'],
    queryFn: () => api.getConfig(),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-400">載入中...</p>
        </div>
      </div>
    );
  }

  if (error || !config?.success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-2">❌ 載入配置失敗</p>
          <p className="text-gray-400 text-sm">{error?.message || '請檢查 API 連接'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <ImageGenerator config={config.data} />
    </div>
  );
}

export default App;
