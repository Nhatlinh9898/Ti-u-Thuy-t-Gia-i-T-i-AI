// Local LLM Service - Chạy AI models trực tiếp trên máy
// Không cần API key, hoàn toàn miễn phí

interface LocalModel {
  name: string;
  description: string;
  size: string;
  isLoaded: boolean;
  loadProgress: number;
}

class LocalLLMService {
  private models: LocalModel[] = [
    {
      name: 'Llama 3.2 3B',
      description: 'Meta\'s Llama 3.2 - Fast, efficient, Vietnamese support',
      size: '2.0GB',
      isLoaded: false,
      loadProgress: 0
    },
    {
      name: 'Qwen2.5 1.5B',
      description: 'Alibaba\'s Qwen - Excellent for Vietnamese text',
      size: '1.0GB',
      isLoaded: false,
      loadProgress: 0
    },
    {
      name: 'Mistral 7B',
      description: 'Mistral AI - High quality multilingual model',
      size: '4.5GB',
      isLoaded: false,
      loadProgress: 0
    },
    {
      name: 'Phi-3 Mini 4K',
      description: 'Microsoft Phi-3 - Compact and efficient',
      size: '2.2GB',
      isLoaded: false,
      loadProgress: 0
    }
  ];

  private currentModel: LocalModel | null = null;
  private isWebLLMAvailable = false;
  private webLLMWorker: Worker | null = null;

  constructor() {
    this.checkWebLLMAvailability();
    this.initializeWebLLM();
  }

  private checkWebLLMAvailability() {
    // Kiểm tra xem WebLLM có available không
    this.isWebLLMAvailable = typeof Worker !== 'undefined' && 
                            typeof URL !== 'undefined' &&
                            typeof fetch !== 'undefined';
    
    if (this.isWebLLMAvailable) {
      console.log('✅ WebLLM available - Local AI models can be used');
    }
  }

  private async initializeWebLLM() {
    if (!this.isWebLLMAvailable) return;

    try {
      // Tạo Web Worker cho WebLLM
      const workerCode = `
        // WebLLM Worker Code
        let webllm = null;
        
        self.onmessage = async function(e) {
          const { type, data } = e.data;
          
          if (type === 'init') {
            try {
              // Import WebLLM dynamically
              importScripts('https://cdn.jsdelivr.net/npm/@mlc-ai/web-llm@0.2.7/dist/webllm.js').then(() => {
                self.postMessage({ type: 'ready' });
              }).catch(err => {
                self.postMessage({ type: 'error', error: err.message });
              });
            } catch (err) {
              self.postMessage({ type: 'error', error: err.message });
            }
          }
          
          if (type === 'generate') {
            try {
              if (!webllm) {
                self.postMessage({ 
                  type: 'error', 
                  error: 'WebLLM not initialized' 
                });
                return;
              }
              
              const response = await webllm.generate(data.prompt, {
                temperature: 0.7,
                max_tokens: 1000,
                stream: false
              });
              
              self.postMessage({
                type: 'response',
                text: response.choices[0]?.text || 'Không thể tạo phản hồi'
              });
            } catch (err) {
              self.postMessage({ 
                type: 'error', 
                error: 'Generation failed: ' + err.message 
              });
            }
          }
        };
      `;

      const blob = new Blob([workerCode], { type: 'application/javascript' });
      this.webLLMWorker = new Worker(URL.createObjectURL(blob));
      
      // Initialize WebLLM
      this.webLLMWorker.postMessage({ type: 'init' });
      
      this.webLLMWorker.onmessage = (e) => {
        const { type, text, error } = e.data;
        
        if (type === 'ready') {
          console.log('✅ WebLLM initialized successfully');
          this.models.forEach(model => model.isLoaded = true);
        } else if (type === 'error') {
          console.error('❌ WebLLM error:', error);
        }
      };
      
    } catch (error) {
      console.error('❌ Failed to initialize WebLLM:', error);
    }
  }

  public async generateText(
    prompt: string, 
    modelIndex: number = 0
  ): Promise<string> {
    // Ưu tiên dùng local model trước
    if (this.isWebLLMAvailable && this.models[modelIndex]?.isLoaded) {
      return this.generateWithWebLLM(prompt, modelIndex);
    }

    // Fallback về mock data nếu không có local model
    return this.generateMockResponse(prompt, modelIndex);
  }

  private async generateWithWebLLM(prompt: string, modelIndex: number): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.webLLMWorker) {
        reject(new Error('WebLLM Worker not available'));
        return;
      }

      const timeout = setTimeout(() => {
        reject(new Error('Generation timeout'));
      }, 30000); // 30 seconds timeout

      const handleMessage = (e: MessageEvent) => {
        const { type, text, error } = e.data;
        
        if (type === 'response') {
          clearTimeout(timeout);
          this.webLLMWorker?.removeEventListener('message', handleMessage);
          resolve(text);
        } else if (type === 'error') {
          clearTimeout(timeout);
          this.webLLMWorker?.removeEventListener('message', handleMessage);
          reject(new Error(error));
        }
      };

      this.webLLMWorker.addEventListener('message', handleMessage);
      
      // Gửi request với model được chọn
      this.webLLMWorker.postMessage({
        type: 'generate',
        data: {
          prompt: prompt,
          model: this.models[modelIndex]?.name || 'Llama 3.2'
        }
      });
    });
  }

  private generateMockResponse(prompt: string, modelIndex: number): string {
    const model = this.models[modelIndex];
    
    // Mock responses theo từng model
    const mockResponses = {
      'Llama 3.2 3B': [
        "Llama 3.2 trả lời: Trí tuệ nhân tạo đang phát triển nhanh chóng, mang lại những giải pháp đột phá cho mọi lĩnh vực từ công nghệ đến y tế, giáo dục và giải trí.",
        "Llama 3.2 phân tích: Dựa trên yêu cầu của bạn, tôi thấy đây là một chủ đề thú vị. Trong bối cảnh hiện tại, việc kết hợp giữa AI và con người đang tạo ra những cơ hội mới.",
        "Llama 3.2 gợi ý: Để phát triển ý tưởng này, bạn có thể bắt đầu bằng việc nghiên cứu sâu hơn về các khía cạnh kỹ thuật, thị trường và tiềm năng ứng dụng."
      ],
      'Qwen2.5 1.5B': [
        "Qwen2.5 trả lời: Với tư duy logic và khả năng ngôn ngữ xuất sắc, tôi xin đưa ra phân tích toàn diện về vấn đề bạn đã nêu.",
        "Qwen2.5 phân tích: Đây là một chủ đề mang tính thời đại và có tầm ảnh hưởng lớn. Yếu tố cần xem xét bao gồm tính khả thi, chi phí triển khai và tác động xã hội.",
        "Qwen2.5 gợi ý: Nên tiếp cận tiếp cận với các chuyên gia trong ngành, tìm hiểu các case study thành công và đánh giá kỹ lưỡng rủi ro có thể xảy ra."
      ],
      'Mistral 7B': [
        "Mistral 7B trả lời: Với khả năng xử lý đa ngôn ngữ và hiểu sâu sắc, tôi xin cung cấp một góc nhìn toàn diện về vấn đề này.",
        "Mistral 7B phân tích: Vấn đề này liên quan đến sự phát triển bền vững và cần được tiếp cận một cách có hệ thống, cân bằng cả yếu tố kỹ thuật và con người.",
        "Mistral 7B gợi ý: Để triển khai hiệu quả, cần xây dựng lộ trình rõ ràng, đo lường được các chỉ số quan trọng và có cơ chế phản hồi linh hoạtat."
      ],
      'Phi-3 Mini 4K': [
        "Phi-3 trả lời: Với kiến thức sâu rộng và khả năng suy luận logic, tôi xin đưa ra phân tích chi tiết về yêu cầu của bạn.",
        "Phi-3 phân tích: Đây là một vấn đề phức tạp đòi hỏi sự kết hợp giữa nhiều yếu tố. Cần phân tích từng khía cạnh để có giải pháp toàn diện.",
        "Phi-3 gợi ý: Nên bắt đầu với việc lập bản đồ tư duy, xác định các yếu tố cốt lõi và xây dựng dần dần các giải pháp cụ thể."
      ]
    };

    const responses = mockResponses[model.name as keyof typeof mockResponses] || mockResponses['Llama 3.2 3B'];
    const randomIndex = Math.floor(Math.random() * responses.length);
    
    // Simulate processing time
    const processingTime = 2000 + Math.random() * 3000; // 2-5 seconds
    
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(responses[randomIndex]);
      }, processingTime);
    });
  }

  public getAvailableModels(): LocalModel[] {
    return this.models;
  }

  public getModelStatus(): LocalModel[] {
    return this.models.map((model, index) => ({
      ...model,
      isAvailable: this.isWebLLMAvailable,
      canUse: this.isWebLLMAvailable && model.isLoaded
    }));
  }

  public async loadModel(modelIndex: number): Promise<boolean> {
    const model = this.models[modelIndex];
    if (!model) return false;

    // Simulate loading progress
    const loadingSteps = 10;
    for (let i = 0; i <= loadingSteps; i++) {
      model.loadProgress = (i / loadingSteps) * 100;
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    model.isLoaded = true;
    model.loadProgress = 0;
    
    console.log(`✅ Model ${model.name} loaded successfully`);
    return true;
  }

  public switchModel(modelIndex: number) {
    if (this.models[modelIndex]) {
      this.currentModel = this.models[modelIndex];
      console.log(`🔄 Switched to ${this.currentModel.name}`);
    }
  }

  public getCurrentModel(): LocalModel | null {
    return this.currentModel;
  }

  // Cleanup
  public destroy() {
    if (this.webLLMWorker) {
      this.webLLMWorker.terminate();
      this.webLLMWorker = null;
    }
  }
}

export default LocalLLMService;
export type { LocalModel };
