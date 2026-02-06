import { NovelNode, AIActionType } from "../types";
import UltimateAIService from "./ultimateAIService";
import AIWritingAssistantService from "./aiWritingAssistantService";

// Multi-Modal AI Service - Kết hợp Text + Image + Voice + Code Generation
// Tạo nội dung đa phương tiện thông minh

interface MultiModalConfig {
  textGeneration: {
    enabled: boolean;
    provider: 'local' | 'cloud' | 'hybrid' | 'ultimate';
    style: 'creative' | 'professional' | 'academic';
    maxLength: number;
  };
  
  imageGeneration: {
    enabled: boolean;
    provider: 'dall-e' | 'stable-diffusion' | 'midjourney';
    style: 'realistic' | 'artistic' | 'anime' | 'cartoon';
    size: '256x256' | '512x512' | '1024x1024';
    quality: 'standard' | 'hd';
  };
  
  voiceGeneration: {
    enabled: boolean;
    provider: 'elevenlabs' | 'azure' | 'google';
    voice: 'natural' | 'professional' | 'character';
    language: 'vi' | 'en' | 'auto';
    speed: number; // 0.5 - 2.0
  };
  
  codeGeneration: {
    enabled: boolean;
    provider: 'copilot' | 'codeium' | 'tabnine';
    language: 'javascript' | 'python' | 'typescript' | 'auto';
    framework: 'react' | 'vue' | 'angular' | 'auto';
  };
  
  integration: {
    combineModalities: boolean;
    autoSync: boolean;
    crossModalLearning: boolean;
    contextSharing: boolean;
  };
}

interface MultiModalContent {
  text: string;
  images: ImageContent[];
  voice: VoiceContent[];
  code: CodeContent[];
  metadata: {
    generatedAt: Date;
    providers: string[];
    totalTokens: number;
    processingTime: number;
    confidence: number;
  };
}

interface ImageContent {
  url: string;
  prompt: string;
  style: string;
  size: string;
  description: string;
  relevanceScore: number;
}

interface VoiceContent {
  url: string;
  text: string;
  voice: string;
  duration: number;
  language: string;
  emotion: string;
}

interface CodeContent {
  language: string;
  code: string;
  explanation: string;
  framework: string;
  complexity: 'simple' | 'medium' | 'complex';
}

class MultiModalAIService {
  private config: MultiModalConfig;
  private ultimateAI: UltimateAIService;
  private aiAssistant: AIWritingAssistantService;

  constructor(config?: Partial<MultiModalConfig>) {
    this.config = {
      // Text Generation
      textGeneration: {
        enabled: true,
        provider: 'ultimate',
        style: 'creative',
        maxLength: 2000
      },
      
      // Image Generation
      imageGeneration: {
        enabled: false,
        provider: 'dall-e',
        style: 'realistic',
        size: '512x512',
        quality: 'standard'
      },
      
      // Voice Generation
      voiceGeneration: {
        enabled: false,
        provider: 'elevenlabs',
        voice: 'natural',
        language: 'vi',
        speed: 1.0
      },
      
      // Code Generation
      codeGeneration: {
        enabled: false,
        provider: 'copilot',
        language: 'typescript',
        framework: 'react'
      },
      
      // Integration
      integration: {
        combineModalities: true,
        autoSync: true,
        crossModalLearning: false,
        contextSharing: true
      },
      
      ...config
    };
    
    this.ultimateAI = new UltimateAIService();
    this.aiAssistant = new AIWritingAssistantService();
  }

  public async generateMultiModalContent(
    node: NovelNode,
    action: AIActionType,
    context: string = ''
  ): Promise<MultiModalContent> {
    const startTime = Date.now();
    
    try {
      // Generate content for each modality
      const results = await Promise.allSettled([
        this.generateTextContent(node, action, context),
        this.generateImageContent(node, action, context),
        this.generateVoiceContent(node, action, context),
        this.generateCodeContent(node, action, context)
      ]);
      
      // Process results
      const textResult = results[0].status === 'fulfilled' ? results[0].value : '';
      const imageResults = results[1].status === 'fulfilled' ? results[1].value : [];
      const voiceResults = results[2].status === 'fulfilled' ? results[2].value : [];
      const codeResults = results[3].status === 'fulfilled' ? results[3].value : [];
      
      // Combine modalities if enabled
      let finalText = textResult;
      if (this.config.integration.combineModalities) {
        finalText = await this.combineModalities(textResult, imageResults, voiceResults, codeResults);
      }
      
      const processingTime = Date.now() - startTime;
      
      return {
        text: finalText,
        images: imageResults,
        voice: voiceResults,
        code: codeResults,
        metadata: {
          generatedAt: new Date(),
          providers: this.getActiveProviders(),
          totalTokens: this.calculateTotalTokens(textResult, imageResults, voiceResults, codeResults),
          processingTime,
          confidence: this.calculateConfidence(results)
        }
      };
      
    } catch (error) {
      console.error('Multi-Modal Generation Error:', error);
      throw error;
    }
  }

  private async generateTextContent(
    node: NovelNode,
    action: AIActionType,
    context: string
  ): Promise<string> {
    if (!this.config.textGeneration.enabled) {
      return '';
    }

    switch (this.config.textGeneration.provider) {
      case 'ultimate':
        const ultimateResult = await this.ultimateAI.generateContent(node, action, context);
        return ultimateResult.text;
        
      case 'local':
        // Use local AI for text generation
        return await this.generateWithLocalAI(node, action, context);
        
      case 'cloud':
        // Use cloud AI for text generation
        return await this.generateWithCloudAI(node, action, context);
        
      case 'hybrid':
        // Use hybrid AI for text generation
        return await this.generateWithHybridAI(node, action, context);
        
      default:
        return await this.generateWithLocalAI(node, action, context);
    }
  }

  private async generateImageContent(
    node: NovelNode,
    action: AIActionType,
    context: string
  ): Promise<ImageContent[]> {
    if (!this.config.imageGeneration.enabled) {
      return [];
    }

    // Generate image prompts based on content
    const imagePrompts = await this.generateImagePrompts(node, action, context);
    const images: ImageContent[] = [];
    
    for (const prompt of imagePrompts) {
      try {
        const image = await this.generateSingleImage(prompt);
        images.push(image);
      } catch (error) {
        console.error('Image generation failed:', error);
      }
    }
    
    return images;
  }

  private async generateVoiceContent(
    node: NovelNode,
    action: AIActionType,
    context: string
  ): Promise<VoiceContent[]> {
    if (!this.config.voiceGeneration.enabled) {
      return [];
    }

    // Generate voice content
    const voiceText = await this.generateVoiceText(node, action, context);
    const voices: VoiceContent[] = [];
    
    try {
      const voice = await this.generateSingleVoice(voiceText);
      voices.push(voice);
    } catch (error) {
      console.error('Voice generation failed:', error);
    }
    
    return voices;
  }

  private async generateCodeContent(
    node: NovelNode,
    action: AIActionType,
    context: string
  ): Promise<CodeContent[]> {
    if (!this.config.codeGeneration.enabled) {
      return [];
    }

    // Generate code content
    const codePrompts = await this.generateCodePrompts(node, action, context);
    const codes: CodeContent[] = [];
    
    for (const prompt of codePrompts) {
      try {
        const code = await this.generateSingleCode(prompt);
        codes.push(code);
      } catch (error) {
        console.error('Code generation failed:', error);
      }
    }
    
    return codes;
  }

  private async generateImagePrompts(
    node: NovelNode,
    action: AIActionType,
    context: string
  ): Promise<string[]> {
    const prompts: string[] = [];
    
    // Generate prompts based on content
    const content = node.content || '';
    const title = node.title || '';
    
    // Scene-based prompts
    if (content.length > 100) {
      prompts.push(`Scene from "${title}": ${content.slice(0, 100)}...`);
    }
    
    // Character-based prompts
    if (content.includes('character') || content.includes('nhân vật')) {
      prompts.push(`Character portrait from "${title}"`);
    }
    
    // Setting-based prompts
    if (content.includes('setting') || content.includes('bối cảnh')) {
      prompts.push(`Setting illustration from "${title}"`);
    }
    
    return prompts.slice(0, 3); // Limit to 3 images
  }

  private async generateVoiceText(
    node: NovelNode,
    action: AIActionType,
    context: string
  ): Promise<string> {
    // Generate text for voice narration
    const content = node.content || '';
    const title = node.title || '';
    
    if (action === AIActionType.WRITE_CONTINUE) {
      return `Tiếp tục câu chuyện "${title}": ${content.slice(-500)}`;
    } else if (action === AIActionType.SUMMARIZE) {
      return `Tóm tắt nội dung "${title}": ${content}`;
    } else {
      return `Nội dung "${title}": ${content}`;
    }
  }

  private async generateCodePrompts(
    node: NovelNode,
    action: AIActionType,
    context: string
  ): Promise<string[]> {
    const prompts: string[] = [];
    
    // Generate code prompts based on content
    const content = node.content || '';
    
    // If content mentions technical aspects
    if (content.includes('code') || content.includes('programming')) {
      prompts.push(`Generate code for: ${content}`);
    }
    
    // If content is about web development
    if (content.includes('web') || content.includes('website')) {
      prompts.push(`Create web components for: ${content}`);
    }
    
    return prompts;
  }

  private async generateSingleImage(prompt: string): Promise<ImageContent> {
    // Mock implementation - in real implementation, this would call actual image generation API
    return {
      url: `https://via.placeholder.com/${this.config.imageGeneration.size.replace('x', '/')}.png?text=${encodeURIComponent(prompt)}`,
      prompt,
      style: this.config.imageGeneration.style,
      size: this.config.imageGeneration.size,
      description: `Generated image for: ${prompt}`,
      relevanceScore: 0.85
    };
  }

  private async generateSingleVoice(text: string): Promise<VoiceContent> {
    // Mock implementation - in real implementation, this would call actual voice generation API
    return {
      url: `data:audio/wav;base64,mock-audio-data-${Date.now()}`,
      text,
      voice: this.config.voiceGeneration.voice,
      duration: text.length * 0.1, // Rough estimate
      language: this.config.voiceGeneration.language,
      emotion: 'neutral'
    };
  }

  private async generateSingleCode(prompt: string): Promise<CodeContent> {
    // Mock implementation - in real implementation, this would call actual code generation API
    const language = this.config.codeGeneration.language;
    const framework = this.config.codeGeneration.framework;
    
    let code = '';
    let explanation = '';
    
    if (language === 'typescript' && framework === 'react') {
      code = `// Generated React component for: ${prompt}
import React from 'react';

interface Props {
  data: any;
}

const GeneratedComponent: React.FC<Props> = ({ data }) => {
  return (
    <div className="generated-component">
      <h1>Generated Content</h1>
      <p>{data}</p>
    </div>
  );
};

export default GeneratedComponent;`;
      
      explanation = 'React TypeScript component generated based on the prompt';
    } else {
      code = `// Generated ${language} code for: ${prompt}
function generateContent() {
  return "Generated content";
}

console.log(generateContent());`;
      
      explanation = `${language} function generated based on the prompt`;
    }
    
    return {
      language,
      code,
      explanation,
      framework,
      complexity: 'medium'
    };
  }

  private async combineModalities(
    text: string,
    images: ImageContent[],
    voices: VoiceContent[],
    codes: CodeContent[]
  ): Promise<string> {
    let combinedText = text;
    
    // Add image descriptions
    if (images.length > 0) {
      combinedText += '\n\n📸 **Hình ảnh minh họa:**\n';
      images.forEach((image, index) => {
        combinedText += `${index + 1}. ${image.description}\n`;
      });
    }
    
    // Add voice descriptions
    if (voices.length > 0) {
      combinedText += '\n\n🎤 **Nội dung giọng nói:**\n';
      voices.forEach((voice, index) => {
        combinedText += `${index + 1}. ${voice.text}\n`;
      });
    }
    
    // Add code descriptions
    if (codes.length > 0) {
      combinedText += '\n\n💻 **Code liên quan:**\n';
      codes.forEach((code, index) => {
        combinedText += `${index + 1}. ${code.explanation}\n`;
      });
    }
    
    return combinedText;
  }

  private async generateWithLocalAI(
    node: NovelNode,
    action: AIActionType,
    context: string
  ): Promise<string> {
    // Mock implementation - would use actual Local AI service
    return `Local AI generated content for ${node.title} with action ${action}`;
  }

  private async generateWithCloudAI(
    node: NovelNode,
    action: AIActionType,
    context: string
  ): Promise<string> {
    // Mock implementation - would use actual Cloud AI service
    return `Cloud AI generated content for ${node.title} with action ${action}`;
  }

  private async generateWithHybridAI(
    node: NovelNode,
    action: AIActionType,
    context: string
  ): Promise<string> {
    // Mock implementation - would use actual Hybrid AI service
    return `Hybrid AI generated content for ${node.title} with action ${action}`;
  }

  private getActiveProviders(): string[] {
    const providers: string[] = [];
    
    if (this.config.textGeneration.enabled) {
      providers.push(`text-${this.config.textGeneration.provider}`);
    }
    
    if (this.config.imageGeneration.enabled) {
      providers.push(`image-${this.config.imageGeneration.provider}`);
    }
    
    if (this.config.voiceGeneration.enabled) {
      providers.push(`voice-${this.config.voiceGeneration.provider}`);
    }
    
    if (this.config.codeGeneration.enabled) {
      providers.push(`code-${this.config.codeGeneration.provider}`);
    }
    
    return providers;
  }

  private calculateTotalTokens(
    text: string,
    images: ImageContent[],
    voices: VoiceContent[],
    codes: CodeContent[]
  ): number {
    // Rough token calculation
    let tokens = text.length / 4; // Approximate tokens for text
    
    images.forEach(image => {
      tokens += image.prompt.length / 4;
    });
    
    voices.forEach(voice => {
      tokens += voice.text.length / 4;
    });
    
    codes.forEach(code => {
      tokens += code.code.length / 4;
      tokens += code.explanation.length / 4;
    });
    
    return Math.round(tokens);
  }

  private calculateConfidence(results: PromiseSettledResult<any>[]): number {
    const fulfilledCount = results.filter(r => r.status === 'fulfilled').length;
    const totalCount = results.length;
    
    return fulfilledCount / totalCount;
  }

  // Configuration methods
  public updateConfig(newConfig: Partial<MultiModalConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  public getConfig(): MultiModalConfig {
    return this.config;
  }

  // Cleanup
  public destroy() {
    this.ultimateAI.destroy();
  }
}

export default MultiModalAIService;
export type { MultiModalConfig, MultiModalContent, ImageContent, VoiceContent, CodeContent };
