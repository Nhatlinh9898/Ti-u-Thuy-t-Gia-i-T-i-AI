import React, { useState, useEffect } from 'react';
import LocalLLMService, { LocalModel } from '../services/localLLMService';
import { Download, Cpu, Zap, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const LocalLLMPanel: React.FC = () => {
  const [localLLM] = useState<LocalLLMService | null>(null);
  const [models, setModels] = useState<LocalModel[]>([]);
  const [selectedModelIndex, setSelectedModelIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const llmService = new LocalLLMService();
    setLocalLLM(llmService);
    setModels(llmService.getModelStatus());
    
    return () => {
      llmService.destroy();
    };
  }, []);

  const handleLoadModel = async (index: number) => {
    if (!localLLM) return;
    
    setIsLoading(true);
    try {
      const success = await localLLM.loadModel(index);
      if (success) {
        setModels(localLLM.getModelStatus());
        localLLM.switchModel(index);
        setSelectedModelIndex(index);
      }
    } catch (error) {
      console.error('Failed to load model:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateText = async () => {
    if (!localLLM || isGenerating) return;
    
    setIsGenerating(true);
    try {
      const prompt = "Hãy viết một đoạn văn bản ngắn về trí tuệ nhân tạo và tương lai của nó với xã hội.";
      const response = await localLLM.generateText(prompt, selectedModelIndex);
      console.log('Local LLM Response:', response);
      
      // Có thể gửi response đến parent component nếu cần
      if (window.parent && window.parent.postMessage) {
        window.parent.postMessage({
          type: 'local-llm-response',
          text: response
        });
      }
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const formatSize = (size: string) => {
    const sizeInMB = parseFloat(size);
    if (sizeInMB < 1) return `${(sizeInMB * 1024).toFixed(0)}MB`;
    return `${sizeInMB.toFixed(1)}GB`;
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <button
        onClick={() => {
          const panel = document.getElementById('local-llm-panel');
          if (panel) {
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
          }
        }}
        className="bg-green-600 text-white p-3 rounded-lg shadow-lg border border-green-500 hover:bg-green-700 transition-colors flex items-center gap-2"
      >
        <Cpu size={20} />
        <span className="text-sm font-medium">Local AI</span>
        {models.some(m => m.isLoaded) && (
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
        )}
      </button>

      <div 
        id="local-llm-panel"
        className="absolute bottom-16 left-0 w-96 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl p-4 hidden"
      >
        <h3 className="text-green-400 font-bold mb-4 text-center flex items-center gap-2">
          <Zap size={16} />
          Local AI Models
        </h3>

        <div className="space-y-3">
          {models.map((model, index) => (
            <div 
              key={model.name}
              className={`p-3 rounded-lg border transition-all cursor-pointer ${
                selectedModelIndex === index 
                  ? 'bg-green-800 border-green-600' 
                  : 'bg-gray-800 border-gray-600 hover:bg-gray-700'
              }`}
              onClick={() => setSelectedModelIndex(index)}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium text-white">{model.name}</h4>
                  <p className="text-xs text-gray-400 mt-1">{model.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-gray-500">Size:</span>
                    <span className="text-xs text-blue-400">{formatSize(model.size)}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {model.isLoaded ? (
                    <CheckCircle size={16} className="text-green-400" />
                  ) : model.loadProgress > 0 ? (
                    <Loader2 size={16} className="text-yellow-400 animate-spin" />
                  ) : (
                    <AlertCircle size={16} className="text-gray-500" />
                  )}
                </div>
              </div>

              {model.loadProgress > 0 && model.loadProgress < 100 && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Loading...</span>
                    <span>{model.loadProgress.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-green-500 transition-all duration-300"
                      style={{ width: `${model.loadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          ))}

          <div className="mt-4 space-y-2">
            <button
              onClick={handleLoadModel}
              disabled={isLoading || !models[selectedModelIndex]?.isLoaded}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white p-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Đang tải...</span>
                </>
              ) : (
                <>
                  <Download size={16} />
                  <span>Tải Model {models[selectedModelIndex]?.name}</span>
                </>
              )}
            </button>

            <button
              onClick={handleGenerateText}
              disabled={isGenerating || !models[selectedModelIndex]?.isLoaded}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white p-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Đang tạo...</span>
                </>
              ) : (
                <>
                  <Zap size={16} />
                  <span>Tạo Văn Bản Mẫu</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-700 text-xs text-gray-400">
            <div className="mb-2 font-medium text-white">💡 <strong>Lợi ích:</strong></div>
            <ul className="space-y-1">
              <li>• Hoàn toàn miễn phí - không cần API</li>
              <li>• Chạy offline - bảo mật dữ liệu</li>
              <li>• Nhanh - không có độ trễ mạng</li>
              <li>• Tùy chỉnh - có thể fine-tune model</li>
              <li>• Hỗ trợ tiếng Việt - các model mới</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocalLLMPanel;
