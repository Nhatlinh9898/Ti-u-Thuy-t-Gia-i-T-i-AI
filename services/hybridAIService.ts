import { AIActionType, NovelNode } from "../types";
import LocalLLMService, { LocalModel } from "./localLLMService";
import { generateSmartNovelContent } from "./smartGeminiService";

// Hybrid AI Service - Kết hợp Local AI + Cloud AI
// Tự động chọn phương án tối ưu nhất

interface HybridConfig {
  enableLocalAI: boolean;
  enableCloudAI: boolean;
  localPriority: number; // 1 = ưu tiên Local AI
  cloudFallback: boolean; // Dùng Cloud khi Local không available
  performanceMode: 'speed' | 'quality' | 'balanced'; // Ưu tiên tốc độ hoặc chất lượng
  autoSwitchThreshold: number; // % usage để tự động chuyển
}

class HybridAIService {
  private localLLM: LocalLLMService;
  private config: HybridConfig;
  private usageStats = {
    local: { requests: 0, success: 0, errors: 0 },
    cloud: { requests: 0, success: 0, errors: 0 },
    total: { requests: 0, avgResponseTime: 0 }
  };

  constructor(config?: Partial<HybridConfig>) {
    this.config = {
      enableLocalAI: true,
      enableCloudAI: true,
      localPriority: 1,
      cloudFallback: true,
      performanceMode: 'balanced',
      autoSwitchThreshold: 80, // Chuyển khi 80% usage
      ...config
    };
    
    this.localLLM = new LocalLLMService();
  }

  public async generateText(
    node: NovelNode,
    action: AIActionType,
    extraContext: string = ''
  ): Promise<{ text: string; provider: 'local' | 'cloud' | 'hybrid'; responseTime: number }> {
    const startTime = Date.now();
    
    try {
      // Hybrid Decision Engine
      const decision = this.makeHybridDecision(node, action, extraContext);
      
      let response: string;
      let provider: 'local' | 'cloud' | 'hybrid' = 'local';
      
      if (decision.useLocal && this.config.enableLocalAI) {
        // Sử dụng Local AI
        response = await this.generateWithLocalAI(node, action, extraContext);
        provider = 'local';
        
      } else if (decision.useCloud && this.config.enableCloudAI) {
        // Sử dụng Cloud AI với smart switching
        response = await this.generateWithCloudAI(node, action, extraContext);
        provider = 'cloud';
        
      } else if (decision.useHybrid && this.config.enableLocalAI && this.config.enableCloudAI) {
        // Sử dụng Hybrid approach - kết hợp cả hai
        response = await this.generateWithHybridAI(node, action, extraContext);
        provider = 'hybrid';
      }
      
      const responseTime = Date.now() - startTime;
      this.updateUsageStats(provider, responseTime, true);
      
      return {
        text: response,
        provider,
        responseTime
      };
      
    } catch (error) {
      const responseTime = Date.now() - startTime;
      this.updateUsageStats('error' as any, responseTime, false);
      throw error;
    }
  }

  private makeHybridDecision(
    node: NovelNode,
    action: AIActionType,
    extraContext: string
  ): {
    useLocal: boolean;
    useCloud: boolean;
    useHybrid: boolean;
    reason: string;
    confidence: number;
  } {
    const localModel = this.localLLM.getCurrentModel();
    const hasLocalModel = localModel && localModel.isLoaded;
    
    // Decision Matrix
    const decisionMatrix = {
      // 1. Task-based decisions
      task: this.getTaskDecision(action),
      
      // 2. Performance-based decisions
      performance: this.getPerformanceDecision(),
      
      // 3. Context-based decisions
      context: this.getContextDecision(node, extraContext),
      
      // 4. Usage-based decisions
      usage: this.getUsageDecision()
    };

    // Scoring algorithm
    const scores = {
      local: 0,
      cloud: 0,
      hybrid: 0
    };

    // Task-based scoring
    const taskScore = decisionMatrix.task;
    if (taskScore.useLocal) scores.local += 3;
    if (taskScore.useCloud) scores.cloud += 2;
    if (taskScore.useHybrid) scores.hybrid += 4;

    // Performance-based scoring
    const perfScore = decisionMatrix.performance;
    if (perfScore.useLocal) scores.local += 2;
    if (perfScore.useCloud) scores.cloud += 1;
    if (perfScore.useHybrid) scores.hybrid += 3;

    // Context-based scoring
    const contextScore = decisionMatrix.context;
    if (contextScore.useLocal) scores.local += 2;
    if (contextScore.useCloud) scores.cloud += 1;
    if (contextScore.useHybrid) scores.hybrid += 3;

    // Usage-based scoring
    const usageScore = decisionMatrix.usage;
    if (usageScore.useLocal) scores.local += 1;
    if (usageScore.useCloud) scores.cloud += 1;
    if (usageScore.useHybrid) scores.hybrid += 2;

    // Find best option
    const maxScore = Math.max(scores.local, scores.cloud, scores.hybrid);
    
    if (maxScore === scores.local && hasLocalModel) {
      return {
        useLocal: true,
        useCloud: false,
        useHybrid: false,
        reason: 'Local AI available and optimal for this task',
        confidence: 0.9
      };
    } else if (maxScore === scores.cloud) {
      return {
        useLocal: false,
        useCloud: true,
        useHybrid: false,
        reason: 'Cloud AI is optimal for this task',
        confidence: 0.8
      };
    } else {
      return {
        useLocal: true,
        useCloud: true,
        useHybrid: true,
        reason: 'Hybrid approach provides best results',
        confidence: 0.7
      };
    }
  }

  private getTaskDecision(action: AIActionType): {
    useLocal: boolean;
    useCloud: boolean;
    useHybrid: boolean;
    reason: string;
  } {
    const taskDecisions = {
      [AIActionType.WRITE_CONTINUE]: {
        useLocal: true,
        useCloud: true,
        useHybrid: true,
        reason: 'Creative writing benefits from both Local and Cloud AI'
      },
      [AIActionType.SUMMARIZE]: {
        useLocal: true,
        useCloud: true,
        useHybrid: false,
        reason: 'Summarization works well with both, Cloud better for accuracy'
      },
      [AIActionType.GENERATE_TITLE]: {
        useLocal: false,
        useCloud: true,
        useHybrid: false,
        reason: 'Title generation requires diverse knowledge, Cloud AI preferred'
      },
      [AIActionType.END_NODE]: {
        useLocal: true,
        useCloud: true,
        useHybrid: true,
        reason: 'Story ending benefits from Local creativity + Cloud knowledge'
      },
      [AIActionType.DIRECT_NARRATOR]: {
        useLocal: true,
        useCloud: false,
        useHybrid: false,
        reason: 'Narrative style works best with Local AI for consistency'
      }
    };

    return taskDecisions[action] || {
      useLocal: true,
      useCloud: true,
      useHybrid: true,
      reason: 'Default hybrid approach for unknown tasks'
    };
  }

  private getPerformanceDecision(): {
    useLocal: boolean;
    useCloud: boolean;
    useHybrid: boolean;
    reason: string;
  } {
    const mode = this.config.performanceMode;
    
    if (mode === 'speed') {
      return {
        useLocal: true,
        useCloud: false,
        useHybrid: false,
        reason: 'Speed mode prioritizes Local AI for faster responses'
      };
    } else if (mode === 'quality') {
      return {
        useLocal: false,
        useCloud: true,
        useHybrid: false,
        reason: 'Quality mode prioritizes Cloud AI for better accuracy'
      };
    } else {
      return {
        useLocal: true,
        useCloud: true,
        useHybrid: true,
        reason: 'Balanced mode uses both for optimal results'
      };
    }
  }

  private getContextDecision(node: NovelNode, extraContext: string): {
    useLocal: boolean;
    useCloud: boolean;
    useHybrid: boolean;
    reason: string;
  } {
    const contentLength = node.content.length;
    const hasComplexContext = extraContext.length > 100;
    
    if (contentLength < 500 && !hasComplexContext) {
      return {
        useLocal: true,
        useCloud: false,
        useHybrid: false,
        reason: 'Short content without complex context - Local AI sufficient'
      };
    } else if (hasComplexContext) {
      return {
        useLocal: false,
        useCloud: true,
        useHybrid: true,
        reason: 'Complex context requires Cloud AI knowledge base'
      };
    } else {
      return {
        useLocal: true,
        useCloud: true,
        useHybrid: true,
        reason: 'Long form content benefits from both providers'
      };
    }
  }

  private getUsageDecision(): {
    useLocal: boolean;
    useCloud: boolean;
    useHybrid: boolean;
    reason: string;
  } {
    const localUsage = this.usageStats.local.requests;
    const cloudUsage = this.usageStats.cloud.requests;
    const totalRequests = this.usageStats.total.requests;
    
    const localUsagePercent = totalRequests > 0 ? (localUsage / totalRequests) * 100 : 0;
    
    if (localUsagePercent >= this.config.autoSwitchThreshold && this.config.enableCloudAI) {
      return {
        useLocal: false,
        useCloud: true,
        useHybrid: false,
        reason: `Local AI usage at ${localUsagePercent.toFixed(0)}% - switching to Cloud AI`
      };
    } else if (localUsagePercent < 30 && this.config.enableLocalAI) {
      return {
        useLocal: true,
        useCloud: false,
        useHybrid: false,
        reason: `Local AI usage low at ${localUsagePercent.toFixed(0)}% - continuing with Local AI`
      };
    } else {
      return {
        useLocal: true,
        useCloud: true,
        useHybrid: true,
        reason: 'Balanced usage - using both providers'
      };
    }
  }

  private async generateWithLocalAI(
    node: NovelNode,
    action: AIActionType,
    extraContext: string
  ): Promise<string> {
    const prompt = this.buildPrompt(node, action, extraContext, 'local');
    return await this.localLLM.generateText(prompt, 0);
  }

  private async generateWithCloudAI(
    node: NovelNode,
    action: AIActionType,
    extraContext: string
  ): Promise<string> {
    const prompt = this.buildPrompt(node, action, extraContext, 'cloud');
    return await generateSmartNovelContent(node, action, extraContext);
  }

  private async generateWithHybridAI(
    node: NovelNode,
    action: AIActionType,
    extraContext: string
  ): Promise<string> {
    // Hybrid approach: Local AI for creative parts, Cloud AI for knowledge parts
    const prompt = this.buildPrompt(node, action, extraContext, 'hybrid');
    
    try {
      // Step 1: Local AI generates creative base
      const localPrompt = `Viết phần sáng tạo và văn phong cách cho: ${node.title}. ${extraContext}`;
      const localResponse = await this.localLLM.generateText(localPrompt, 0);
      
      // Step 2: Cloud AI refines and adds knowledge
      const cloudPrompt = `Dựa trên nội dung sau, hãy bổ sung kiến thức và sửa lỗi: ${localResponse}`;
      const cloudResponse = await generateSmartNovelContent(node, action, cloudPrompt);
      
      // Step 3: Combine results
      return this.combineResponses(localResponse, cloudResponse, action);
      
    } catch (error) {
      console.error('Hybrid generation failed, falling back to Cloud AI:', error);
      return await this.generateWithCloudAI(node, action, extraContext);
    }
  }

  private combineResponses(
    localResponse: string,
    cloudResponse: string,
    action: AIActionType
  ): string {
    if (action === AIActionType.WRITE_CONTINUE) {
      // Local AI viết creative, Cloud AI bổ sung chi tiết
      return `${localResponse}\n\n${cloudResponse}`;
    } else if (action === AIActionType.SUMMARIZE) {
      // Cloud AI tóm tắt chính xác hơn
      return cloudResponse;
    } else {
      // For other actions, prefer the more authoritative response
      return cloudResponse || localResponse;
    }
  }

  private buildPrompt(
    node: NovelNode,
    action: AIActionType,
    extraContext: string,
    provider: 'local' | 'cloud' | 'hybrid'
  ): string {
    const nodePath = `${node.type.toUpperCase()}: ${node.title}`;
    const baseContent = node.content ? `Nội dung hiện tại:\n${node.content.slice(-2000)}` : 'Chưa có nội dung.';
    
    const providerInstructions = {
      local: 'Hãy viết một cách sáng tạo và tự nhiên. Tập trung vào văn phong và cảm xúc.',
      cloud: 'Hãy viết một cách chuyên nghiệp, chính xác và đầy đủ thông tin. Sử dụng kiến thức rộng và các nguồn đáng tin cậy.',
      hybrid: 'Hãy viết theo phong cách tự nhiên, sau đó bổ sung các chi tiết chính xác và kiến thức liên quan.'
    };
    
    switch (action) {
      case AIActionType.WRITE_CONTINUE:
        return `${providerInstructions[provider]} Viết tiếp nội dung cho [${nodePath}]. ${extraContext ? 'Gợi ý thêm: ' + extraContext : ''} ${baseContent}`;
        
      case AIActionType.SUMMARIZE:
        return `${providerInstructions[provider]} Tóm tắt nội dung cho [${nodePath}]. ${baseContent}`;
        
      case AIActionType.GENERATE_TITLE:
        return `${providerInstructions[provider]} Tạo 5 tiêu đề hấp dẫn cho [${nodePath}]. Dựa trên: ${baseContent}`;
        
      case AIActionType.END_NODE:
        return `${providerInstructions[provider]} Viết đoạn kết thúc cho [${nodePath}]. ${baseContent}`;
        
      case AIActionType.DIRECT_NARRATOR:
        return `${providerInstructions[provider]} Viết lời dẫn chuyện cho [${nodePath}]. ${baseContent}`;
        
      default:
        return `${providerInstructions[provider]} Thực hiện ${action} cho [${nodePath}]. ${extraContext} ${baseContent}`;
    }
  }

  private updateUsageStats(provider: 'local' | 'cloud' | 'hybrid' | 'error', responseTime: number, success: boolean) {
    if (provider === 'local') {
      this.usageStats.local.requests++;
      if (success) this.usageStats.local.success++;
      else this.usageStats.local.errors++;
    } else if (provider === 'cloud') {
      this.usageStats.cloud.requests++;
      if (success) this.usageStats.cloud.success++;
      else this.usageStats.cloud.errors++;
    } else if (provider === 'hybrid') {
      // For hybrid, count as both local and cloud usage
      this.usageStats.local.requests++;
      this.usageStats.cloud.requests++;
      if (success) {
        this.usageStats.local.success++;
        this.usageStats.cloud.success++;
      } else {
        this.usageStats.local.errors++;
        this.usageStats.cloud.errors++;
      }
    }
    
    this.usageStats.total.requests++;
    this.usageStats.total.avgResponseTime = 
      (this.usageStats.total.avgResponseTime * (this.usageStats.total.requests - 1) + responseTime) / this.usageStats.total.requests;
  }

  public getUsageStats() {
    return {
      ...this.usageStats,
      localModel: this.localLLM.getCurrentModel(),
      config: this.config
    };
  }

  public updateConfig(newConfig: Partial<HybridConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  public getConfig(): HybridConfig {
    return this.config;
  }

  public getRecommendations(): {
    localOptimizations: string[];
    cloudOptimizations: string[];
    hybridOptimizations: string[];
  } {
    const stats = this.getUsageStats();
    
    return {
      localOptimizations: [
        'Enable WebGPU acceleration for 10x faster inference',
        'Use quantized models (GGUF) for better performance',
        'Increase model context window for better consistency',
        'Fine-tune models on your specific writing style'
      ],
      cloudOptimizations: [
        'Add API keys for multiple providers',
        'Implement request caching for repeated queries',
        'Use batch processing for large operations',
        'Optimize prompts for better token efficiency'
      ],
      hybridOptimizations: [
        'Use Local AI for creative writing and narrative consistency',
        'Use Cloud AI for factual accuracy and knowledge integration',
        'Implement intelligent prompt routing between providers',
        'Set dynamic thresholds based on task complexity'
      ]
    };
  }

  // Cleanup
  public destroy() {
    this.localLLM.destroy();
  }
}

export default HybridAIService;
export type { HybridConfig };
