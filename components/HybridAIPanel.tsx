import React, { useState, useEffect } from 'react';
import HybridAIService, { HybridConfig } from '../services/hybridAIService';
import { Settings, Brain, Zap, BarChart3, Cpu, Globe, Shield, TrendingUp } from 'lucide-react';

const HybridAIPanel: React.FC = () => {
  const [hybridAI, setHybridAI] = useState<HybridAIService | null>(null);
  const [config, setConfig] = useState<HybridConfig>({
    enableLocalAI: true,
    enableCloudAI: true,
    localPriority: 1,
    cloudFallback: true,
    performanceMode: 'balanced',
    autoSwitchThreshold: 80
  });
  const [stats, setStats] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const service = new HybridAIService(config);
    setHybridAI(service);
    setStats(service.getUsageStats());
    
    return () => {
      service.destroy();
    };
  }, [config]);

  const handleConfigChange = (key: keyof HybridConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getPerformanceIcon = (mode: string) => {
    switch (mode) {
      case 'speed': return <Zap size={16} className="text-yellow-400" />;
      case 'quality': return <Shield size={16} className="text-blue-400" />;
      case 'balanced': return <BarChart3 size={16} className="text-green-400" />;
      default: return <Brain size={16} className="text-purple-400" />;
    }
  };

  return (
    <div className="fixed bottom-4 left-20 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 rounded-lg shadow-lg border border-purple-500 hover:from-purple-500 hover:to-blue-500 transition-colors flex items-center gap-2"
      >
        <Brain size={20} />
        <span className="text-sm font-medium">Hybrid AI</span>
        {hybridAI && (
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        )}
      </button>

      {isOpen && (
        <div className="absolute bottom-16 left-0 w-112 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl p-4 max-h-96 overflow-y-auto">
          <h3 className="text-purple-400 font-bold mb-4 text-center flex items-center gap-2">
            <Settings size={16} />
            Hybrid AI Control Panel
          </h3>

          {/* Configuration */}
          <div className="space-y-4 mb-6">
            <h4 className="text-white font-medium mb-3">⚙️ Cấu hình</h4>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Local AI</label>
                <select
                  value={config.enableLocalAI ? 'true' : 'false'}
                  onChange={(e) => handleConfigChange('enableLocalAI', e.target.value === 'true')}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                >
                  <option value="true">✅ Bật</option>
                  <option value="false">❌ Tắt</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1">Cloud AI</label>
                <select
                  value={config.enableCloudAI ? 'true' : 'false'}
                  onChange={(e) => handleConfigChange('enableCloudAI', e.target.value === 'true')}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                >
                  <option value="true">✅ Bật</option>
                  <option value="false">❌ Tắt</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1">Ưu tiên Local</label>
                <select
                  value={config.localPriority.toString()}
                  onChange={(e) => handleConfigChange('localPriority', parseInt(e.target.value))}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                >
                  <option value="1">1 (Cao nhất)</option>
                  <option value="2">2 (Trung bình)</option>
                  <option value="3">3 (Thấp nhất)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1">Chế độ</label>
                <select
                  value={config.performanceMode}
                  onChange={(e) => handleConfigChange('performanceMode', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                >
                  <option value="speed">⚡ Tốc độ</option>
                  <option value="quality">🛡️ Chất lượng</option>
                  <option value="balanced">⚖️ Cân bằng</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1">Auto Switch</label>
                <input
                  type="number"
                  min="50"
                  max="95"
                  value={config.autoSwitchThreshold}
                  onChange={(e) => handleConfigChange('autoSwitchThreshold', parseInt(e.target.value))}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                />
                <div className="text-xs text-gray-500 mt-1">
                  Chuyển sang Cloud khi Local AI dùng {config.autoSwitchThreshold}%
                </div>
              </div>
            </div>
          </div>

          {/* Statistics */}
          {stats && (
            <div className="space-y-4 mb-6">
              <h4 className="text-white font-medium mb-3">📊 Thống kê sử dụng</h4>
              
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div className="text-center">
                  <div className="text-gray-400 mb-1">Local AI</div>
                  <div className="text-green-400 font-bold">{stats.local?.requests || 0}</div>
                  <div className="text-gray-400 mb-1">Requests</div>
                  <div className="text-yellow-400">{stats.local?.success || 0} ✅</div>
                </div>

                <div className="text-center">
                  <div className="text-gray-400 mb-1">Cloud AI</div>
                  <div className="text-blue-400 font-bold">{stats.cloud?.requests || 0}</div>
                  <div className="text-gray-400 mb-1">Requests</div>
                  <div className="text-yellow-400">{stats.cloud?.success || 0} ✅</div>
                </div>

                <div className="text-center">
                  <div className="text-gray-400 mb-1">Tổng cộng</div>
                  <div className="text-purple-400 font-bold">{(stats.local?.requests || 0) + (stats.cloud?.requests || 0)}</div>
                  <div className="text-gray-400 mb-1">Requests</div>
                  <div className="text-gray-500">Avg: {stats.total?.avgResponseTime?.toFixed(0)}ms</div>
                </div>

                <div className="text-center">
                  <div className="text-gray-400 mb-1">Local Model</div>
                  <div className="text-green-400">{stats.localModel?.name || 'None'}</div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-700">
                <div className="text-xs text-gray-400">
                  <div className="mb-2 font-medium text-white">💡 <strong>Hiệu suất Hybrid:</strong></div>
                  <ul className="space-y-1">
                    <li>• Local AI: Sáng tạo, nhanh, nhất quán</li>
                    <li>• Cloud AI: Chính xác, kiến thức rộng</li>
                    <li>• Hybrid: Kết hợp sức mạnh cả hai</li>
                    <li>• Auto-switch: Tối ưu dựa trên usage</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Recommendations */}
          <div className="mt-4 pt-3 border-t border-gray-700">
            <h4 className="text-white font-medium mb-3">🎯 Tối ưu hóa</h4>
            
            <div className="space-y-2 text-xs text-gray-400">
              <div className="mb-2">
                <div className="font-medium text-white">Local AI:</div>
                <ul className="space-y-1 ml-4">
                  <li>• Dùng WebGPU để tăng tốc 10x</li>
                  <li>• Chọn model quantized (GGUF)</li>
                  <li>• Tăng context window cho consistency</li>
                </ul>
              </div>

              <div className="mb-2">
                <div className="font-medium text-white">Cloud AI:</div>
                <ul className="space-y-1 ml-4">
                  <li>• Thêm nhiều API keys để load balancing</li>
                  <li>• Sử dụng batch processing</li>
                  <li>• Cache các query lặp lại</li>
                </ul>
              </div>

              <div>
                <div className="font-medium text-white">Hybrid:</div>
                <ul className="space-y-1 ml-4">
                  <li>• Local AI viết creative, Cloud AI bổ sung chi tiết</li>
                  <li>• Tự động routing dựa trên task complexity</li>
                  <li>• Threshold-based switching để tối ưu cost</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HybridAIPanel;
