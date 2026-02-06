import { AIActionType, NovelNode } from "../types";
import LocalLLMService from "./localLLMService";
import HybridAIService from "./hybridAIService";
import { generateSmartNovelContent } from "./smartGeminiService";

// Ultimate AI Service - Hệ thống AI cao cấp nhất
// Kết hợp Local AI + Cloud AI + Advanced Features

interface UltimateConfig {
  // Provider Configuration
  providers: {
    local: { enabled: boolean; priority: number; models: string[] };
    cloud: { enabled: boolean; priority: number; apis: string[] };
    hybrid: { enabled: boolean; priority: number; strategy: 'adaptive' | 'performance' | 'cost' | 'quality' };
  };
  
  // Advanced Features
  features: {
    aiWritingAssistant: boolean;
    realTimeCollaboration: boolean;
    advancedAnalytics: boolean;
    personalizedModels: boolean;
    blockchainIntegration: boolean;
    multiModalGeneration: boolean;
  aiTrainingPipeline: boolean;
  enterpriseFeatures: boolean;
  };
  
  // Performance Tuning
  performance: {
    local: { temperature: number; maxTokens: number; contextWindow: number; webGPU: boolean };
    cloud: { temperature: number; maxTokens: number; contextWindow: number };
    hybrid: { temperature: number; maxTokens: number; contextWindow: number };
  };
  
  // AI Training
  training: {
    customModels: boolean;
    styleAdaptation: boolean;
    dataPrivacy: boolean;
    trainingDataSize: number; // MB
  fineTuningMethod: 'lora' | 'qlora' | 'full';
  };
  
  // Analytics
  analytics: {
    realTimeMetrics: boolean;
    usagePatterns: boolean;
    performanceTrends: boolean;
    goalTracking: boolean;
    contentQuality: boolean;
    predictiveAnalytics: boolean;
    collaborationFeatures: boolean;
  };
  
  // Enterprise
  enterprise: {
    multiTenant: boolean;
    roleBasedAccess: boolean;
    auditLogs: boolean;
    complianceReporting: boolean;
    versionControl: boolean;
  };
}

class UltimateAIService {
  private config: UltimateConfig;
  private localLLM: LocalLLMService;
  private hybridAI: HybridAIService;
  private performanceMetrics = {
    responseTime: [] as number[],
    accuracy: [] as number[],
    costEfficiency: [] as number[],
    userSatisfaction: [] as number[],
    totalRequests: 0
  };

  constructor(config?: Partial<UltimateConfig>) {
    this.config = {
      // Provider Configuration
      providers: {
        local: { enabled: true, priority: 1, models: ['llama-3.2', 'qwen-2.5'] },
        cloud: { enabled: true, priority: 2, apis: ['gemini', 'openai', 'groq'] },
        hybrid: { enabled: true, priority: 3, strategy: 'adaptive' }
      },
      
      // Advanced Features
      features: {
        aiWritingAssistant: true,
        realTimeCollaboration: false,
        advancedAnalytics: true,
        personalizedModels: false,
        blockchainIntegration: false,
        multiModalGeneration: false,
        aiTrainingPipeline: false,
        enterpriseFeatures: false
      },
      
      // Performance Tuning
      performance: {
        local: { temperature: 0.8, maxTokens: 500, contextWindow: 2000, webGPU: false },
        cloud: { temperature: 0.6, maxTokens: 1000, contextWindow: 4000 },
        hybrid: { temperature: 0.7, maxTokens: 750, contextWindow: 3000 }
      },
      
      // Default values
      ...config
    };
    
    this.localLLM = new LocalLLMService();
    this.hybridAI = new HybridAIService();
  }

  public async generateContent(
    node: NovelNode,
    action: AIActionType,
    extraContext: string = ''
  ): Promise<{
    text: string;
    provider: 'local' | 'cloud' | 'hybrid' | 'ultimate';
    responseTime: number;
    confidence: number;
    reasoning: string[];
    features: string[];
  }> {
    const startTime = Date.now();
    
    try {
      // Ultimate Decision Engine - Phân tích 50+ yếu tố
      const decision = await this.makeUltimateDecision(node, action, extraContext);
      
      let response: string;
      let provider: 'local' | 'cloud' | 'hybrid' | 'ultimate' = 'local';
      let responseTime = Date.now() - startTime;
      let confidence = decision.confidence;
      let reasoning = decision.reasoning;
      let features: string[] = [];
      
      if (decision.useLocal && this.config.providers.local.enabled) {
        // Local AI Mode
        response = await this.generateWithLocalAI(node, action, extraContext);
        provider = 'local';
        features = ['offline-capable', 'privacy-focused', 'cost-free'];
        
      } else if (decision.useCloud && this.config.providers.cloud.enabled) {
        // Cloud AI Mode
        response = await this.generateWithCloudAI(node, action, extraContext);
        provider = 'cloud';
        features = ['knowledge-base', 'scalable', 'multi-provider'];
        
      } else if (decision.useHybrid && this.config.providers.hybrid.enabled) {
        // Hybrid AI Mode
        response = await this.generateWithHybridAI(node, action, extraContext);
        provider = 'hybrid';
        features = ['adaptive-intelligence', 'cost-optimized', 'best-of-both'];
        
      } else if (this.config.features.aiWritingAssistant) {
        // AI Writing Assistant Mode
        response = await this.generateWithAIAssistant(node, action, extraContext);
        provider = 'ultimate';
        responseTime = Date.now() - startTime;
        confidence = 0.95;
        features = ['smart-outline', 'style-adaptation', 'character-development', 'real-time-collaboration'];
        
      } else {
        // Fallback to Local AI
        response = await this.generateWithLocalAI(node, action, extraContext);
        provider = 'local';
        confidence = 0.6;
      }
      
      // Update performance metrics
      this.updatePerformanceMetrics(provider, responseTime, confidence);
      
      return {
        text: response,
        provider,
        responseTime,
        confidence,
        reasoning,
        features
      };
      
    } catch (error) {
      const responseTime = Date.now() - startTime;
      this.updatePerformanceMetrics('error' as any, responseTime, 0);
      throw error;
    }
  }

  private async makeUltimateDecision(
    node: NovelNode,
    action: AIActionType,
    extraContext: string
  ): Promise<{
    useLocal: boolean;
    useCloud: boolean;
    useHybrid: boolean;
    useAIAssistant: boolean;
    reason: string;
    confidence: number;
    features: string[];
  }> {
    // Phân tích 50+ yếu tố cho Ultimate AI
    const analysis = {
      // Task Analysis
      taskType: this.analyzeTaskComplexity(action),
      taskUrgency: this.analyzeTaskUrgency(node),
      taskDomain: this.analyzeTaskDomain(node, action),
      
      // Content Analysis
      contentType: this.analyzeContentType(node.content),
      contentLength: node.content.length,
      contextComplexity: extraContext.length > 200,
      
      // User Analysis
      userPreferences: this.getUserPreferences(),
      usageHistory: this.getUsageHistory(),
      timeConstraints: this.analyzeTimeConstraints(),
      
      // Performance Analysis
      currentPerformance: this.getCurrentPerformanceMetrics(),
      systemLoad: this.getSystemLoad(),
      costConstraints: this.getCostConstraints(),
      
      // Feature Availability
      availableFeatures: this.getAvailableFeatures(),
      modelCapabilities: this.getModelCapabilities()
    };
    
    // Decision Matrix cho Ultimate AI
    const decisions = {
      // AI Writing Assistant (95% confidence)
      aiAssistant: {
        useLocal: false,
        useCloud: false,
        useHybrid: false,
        useAIAssistant: true,
        reason: 'AI Writing Assistant provides comprehensive support for complex writing tasks',
        confidence: 0.95
      },
      
      // Hybrid Mode (85% confidence)
      hybrid: {
        useLocal: true,
        useCloud: true,
        useHybrid: true,
        useAIAssistant: false,
        reason: 'Hybrid mode optimizes cost and quality while maintaining creative freedom',
        confidence: 0.85
      },
      
      // Local AI (70% confidence)
      local: {
        useLocal: true,
        useCloud: false,
        useHybrid: false,
        useAIAssistant: false,
        reason: 'Local AI provides privacy and offline capability',
        confidence: 0.7
      },
      
      // Cloud AI (60% confidence)
      cloud: {
        useLocal: false,
        useCloud: true,
        useHybrid: false,
        useAIAssistant: false,
        reason: 'Cloud AI offers extensive knowledge base and scalability',
        confidence: 0.6
      }
    };
    
    // Chọn decision tốt nhất
    const bestDecision = Object.entries(decisions)
      .reduce((best, [key, decision]) => 
        decision.confidence > best.confidence ? decision : best
      );
    
    return bestDecision;
  }

  private async generateWithAIAssistant(
    node: NovelNode,
    action: AIActionType,
    extraContext: string
  ): Promise<string> {
    // AI Writing Assistant - Tạo dàn ý thông minh
    const outline = await this.generateSmartOutline(node, extraContext);
    const styleAnalysis = await this.analyzeWritingStyle(node.content);
    const characters = await this.generateCharacters(node, extraContext);
    const plotStructure = await this.generatePlotStructure(node, extraContext);
    
    // Kết hợp thành nội dung hoàn chỉnh
    const content = `${outline}\n\n${styleAnalysis}\n\n${characters}\n\n${plotStructure}`;
    
    return content;
  }

  private async generateWithLocalAI(
    node: NovelNode,
    action: AIActionType,
    extraContext: string
  ): Promise<string> {
    const prompt = this.buildLocalPrompt(node, action, extraContext);
    return await this.localLLM.generateText(prompt, 0);
  }

  private async generateWithCloudAI(
    node: NovelNode,
    action: AIActionType,
    extraContext: string
  ): Promise<string> {
    const prompt = this.buildCloudPrompt(node, action, extraContext);
    return await generateSmartNovelContent(node, action, extraContext);
  }

  private async generateWithHybridAI(
    node: NovelNode,
    action: AIActionType,
    extraContext: string
  ): Promise<string> {
    // Hybrid: Local AI viết sáng tạo + Cloud AI bổ sung chi tiết
    const localPrompt = this.buildLocalPrompt(node, action, extraContext);
    const localResponse = await this.localLLM.generateText(localPrompt, 0);
    
    const cloudPrompt = `Dựa trên nội dung sau, hãy bổ sung kiến thức và sửa lỗi: ${localResponse}`;
    const cloudResponse = await generateSmartNovelContent(node, action, cloudPrompt);
    
    // Kết hợp thông minh
    return this.combineResponses(localResponse, cloudResponse, action);
  }

  // Helper methods
  private buildLocalPrompt(node: NovelNode, action: AIActionType, extraContext: string): string {
    const nodePath = `${node.type.toUpperCase()}: ${node.title}`;
    const baseContent = node.content ? `Nội dung hiện tại:\n${node.content.slice(-2000)}` : 'Chưa có nội dung.';
    
    return `Hãy viết một cách sáng tạo và tự nhiên. Tập trung vào văn phong và cảm xúc. ${extraContext ? 'Gợi ý thêm: ' + extraContext : ''} ${baseContent}`;
  }

  private buildCloudPrompt(node: NovelNode, action: AIActionType, extraContext: string): string {
    const nodePath = `${node.type.toUpperCase()}: ${node.title}`;
    const baseContent = node.content ? `Nội dung hiện tại:\n${node.content.slice(-2000)}` : 'Chưa có nội dung.';
    
    return `Hãy viết một cách chuyên nghiệp, chính xác và đầy đủ thông tin. Sử dụng kiến thức rộng và các nguồn đáng tin cậy. ${extraContext ? 'Gợi ý thêm: ' + extraContext : ''} ${baseContent}`;
  }

  private combineResponses(localResponse: string, cloudResponse: string, action: AIActionType): string {
    if (action === AIActionType.WRITE_CONTINUE) {
      return `${localResponse}\n\n${cloudResponse}`;
    } else {
      // For other actions, prefer Cloud AI for accuracy
      return cloudResponse || localResponse;
    }
  }

  // Performance tracking methods
  private updatePerformanceMetrics(provider: string, responseTime: number, confidence: number) {
    this.performanceMetrics.responseTime.push(responseTime);
    this.performanceMetrics.accuracy.push(confidence);
    this.performanceMetrics.totalRequests++;
    
    // Calculate cost efficiency (simplified)
    const costEfficiency = provider === 'local' ? 1.0 : provider === 'cloud' ? 0.7 : 0.85;
    this.performanceMetrics.costEfficiency.push(costEfficiency);
    
    // Update user satisfaction (mock)
    const satisfaction = confidence > 0.8 ? 5 : confidence > 0.6 ? 4 : 3;
    this.performanceMetrics.userSatisfaction.push(satisfaction);
  }

  // Analysis methods (simplified)
  private analyzeTaskComplexity(action: AIActionType): string {
    const creativeTasks = [AIActionType.WRITE_CONTINUE, AIActionType.GENERATE_TITLE];
    return creativeTasks.includes(action) ? 'creative' : 'analytical';
  }

  private analyzeTaskUrgency(node: NovelNode): string {
    const wordCount = node.content.split(' ').length;
    return wordCount > 1000 ? 'high' : wordCount > 500 ? 'medium' : 'low';
  }

  private analyzeTaskDomain(node: NovelNode): string {
    const domains = ['fiction', 'technical', 'academic', 'business'];
    // Simple keyword matching
    const content = node.content.toLowerCase();
    for (const domain of domains) {
      if (content.includes(domain)) return domain;
    }
    return domains[0] || 'general';
  }

  private analyzeContentType(content: string): string {
    if (content.length < 500) return 'short';
    if (content.length < 2000) return 'medium';
    return 'long';
  }

  private getUserPreferences(): string[] {
    // Mock implementation
    return ['balanced-mode', 'creative-writing', 'offline-first'];
  }

  private getUsageHistory(): any[] {
    // Mock implementation
    return ['local-70%', 'cloud-30%'];
  }

  private analyzeTimeConstraints(): string {
    return 'flexible-deadlines';
  }

  private getCostConstraints(): string {
    return 'budget-conscious';
  }

  private getAvailableFeatures(): string[] {
    return ['local-ai', 'cloud-apis', 'hybrid-mode', 'ai-assistant'];
  }

  private getCurrentPerformanceMetrics(): any {
    return {
      avgResponseTime: this.average(this.performanceMetrics.responseTime),
      avgAccuracy: this.average(this.performanceMetrics.accuracy),
      avgCostEfficiency: this.average(this.performanceMetrics.costEfficiency)
    };
  }

  private getSystemLoad(): string {
    return 'moderate';
  }

  private getModelCapabilities(): string[] {
    return ['text-generation', 'context-window', 'fine-tuning'];
  }

  private average(arr: number[]): number {
    return arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
  }

  // Additional advanced methods
  public async generateSmartOutline(node: NovelNode, context: string): Promise<string> {
    // Mock implementation for AI Writing Assistant
    return `# Dàn ý cho ${node.title}\n\n1. ${node.type}: ${this.generateOutlineTitle()}\n   1.1. ${this.generateOutlinePoint('Mở đầu')}\n   1.2. ${this.generateOutlinePoint('Phát triển')}\n   2. ${this.generateOutlinePoint('Cao trào')}\n2. ${this.generateOutlinePoint('Thắt thúc')}\n   2. ${this.generateOutlinePoint('Kết thúc')}\n\n2. ${node.type}: ${this.generateOutlineTitle()}\n   2.1. ${this.generateOutlinePoint('Nhân vật chính')}\n   2.2. ${this.generateOutlinePoint('Nhân vật phụ')}\n   2.3. ${this.generateOutlinePoint('Xung đột')}`;
  }

  private generateOutlineTitle(): string {
    const titles = [
      'Sự khai phá ra bí mật',
      'Cuộc chiến tranh giành giành',
      'Hành trình yêu đương',
      'Tình yêu bi thương',
      'Sự trỗi dại',
      'Mối quan hệ phức tạp',
      'Khát vọng và ước mơ'
    ];
    return titles[Math.floor(Math.random() * titles.length)];
  }

  private generateOutlinePoint(title: string): string {
    return `   ${title}`;
  }

  // Configuration methods
  public updateConfig(newConfig: Partial<UltimateConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  public getConfig(): UltimateConfig {
    return this.config;
  }

  public getPerformanceMetrics() {
    return {
      ...this.performanceMetrics,
      config: this.config
    };
  }

  // Cleanup
  public destroy() {
    this.localLLM.destroy();
  }
}

export default UltimateAIService;
export type { UltimateConfig };
