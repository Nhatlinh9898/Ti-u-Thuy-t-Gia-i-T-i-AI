import { AIActionType, NovelNode } from "../types";
import APIManager, { APIConfig } from "./apiManagerService";

const apiManager = new APIManager();

// Service-specific implementations
const geminiService = async (config: any, prompt: string): Promise<string> => {
  // Import dynamically to avoid build errors
  const { generateNovelContent } = await import('./geminiService');
  return generateNovelContent(
    { content: '', type: 'novel', title: '', summary: '', children: [], id: '' },
    AIActionType.WRITE_CONTINUE,
    prompt
  );
};

const groqService = async (config: any, prompt: string): Promise<string> => {
  // Mock Groq implementation - replace with actual Groq SDK
  const responses = [
    "Groq Response: Trí tuệ nhân tạo đang phát triển nhanh chóng, mang lại những giải pháp đột phá cho mọi lĩnh vực.",
    "Groq Response: Tương lai của công nghệ AI sẽ định hình lại cách chúng ta sống và làm việc.",
    "Groq Response: Machine learning và deep learning đang mở ra những khả năng vô hạn."
  ];
  
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
  return responses[Math.floor(Math.random() * responses.length)];
};

const openAIService = async (config: any, prompt: string): Promise<string> => {
  // Mock OpenAI implementation - replace with actual OpenAI SDK
  const responses = [
    "OpenAI Response: Trí tuệ nhân tạo đang thay đổi thế giới một cách nhanh chóng.",
    "OpenAI Response: AI đang giúp con người giải quyết những vấn đề phức tạp.",
    "OpenAI Response: Tương lai của AI sẽ mang lại nhiều tiến bộ vượt bậc."
  ];
  
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500));
  return responses[Math.floor(Math.random() * responses.length)];
};

const serviceMap = {
  'Gemini': geminiService,
  'Groq': groqService,
  'OpenAI': openAIService
};

export const generateSmartNovelContent = async (
  node: NovelNode, 
  action: AIActionType, 
  extraContext: string = ''
): Promise<string> => {
  const prompt = constructPrompt(node, action, extraContext);
  const tokensNeeded = estimateTokens(prompt);
  
  try {
    const result = await apiManager.makeRequest(prompt, tokensNeeded);
    
    if (result.waitTime) {
      // Wait for rate limit reset
      await new Promise(resolve => setTimeout(resolve, result.waitTime));
      return generateSmartNovelContent(node, action, extraContext);
    }
    
    if (result.apiConfig) {
      const service = serviceMap[result.apiUsed as keyof typeof serviceMap];
      if (service) {
        return await service(result.apiConfig, prompt);
      }
    }
    
    throw new Error(`No service available for API: ${result.apiUsed}`);
    
  } catch (error) {
    console.error('Smart AI Service Error:', error);
    throw error;
  }
};

function constructPrompt(node: NovelNode, action: AIActionType, extraContext: string): string {
  const nodePath = `${node.type.toUpperCase()}: ${node.title}`;
  const baseContent = node.content ? `Nội dung hiện tại:\n${node.content.slice(-2000)}` : 'Chưa có nội dung.';
  
  switch (action) {
    case AIActionType.WRITE_CONTINUE:
      return `Viết tiếp nội dung cho [${nodePath}]. ${extraContext ? 'Gợi ý: ' + extraContext : ''} ${baseContent}`;
    
    case AIActionType.SUMMARIZE:
      return `Tóm tắt nội dung cho [${nodePath}}. ${baseContent}`;
    
    case AIActionType.GENERATE_TITLE:
      return `Tạo 5 tiêu đề cho [${nodePath}]. Dựa trên: ${baseContent}`;
    
    default:
      return `Thực hiện ${action} cho [${nodePath}]. ${extraContext} ${baseContent}`;
  }
}

function estimateTokens(text: string): number {
  // Rough estimation: ~4 characters per token
  return Math.ceil(text.length / 4);
}

export const getAPIStatus = () => {
  return apiManager.getAPIStatus();
};

export const switchAPI = (apiName: string) => {
  apiManager.switchToAPI(apiName);
};

export const addCustomAPI = (config: Partial<APIConfig>) => {
  apiManager.addCustomAPI(config);
};
