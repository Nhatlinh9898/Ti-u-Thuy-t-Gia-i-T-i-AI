import { NovelNode } from "../types";
import UltimateAIService from "./ultimateAIService";
import AIWritingAssistantService from "./aiWritingAssistantService";

// AI Training Pipeline - Fine-tune models trên data của người dùng
// Tạo personalized models cho từng người dùng

interface TrainingConfig {
  enabled: boolean;
  method: 'lora' | 'qlora' | 'full';
  dataPrivacy: boolean;
  trainingDataSize: number; // MB
  maxEpochs: number;
  learningRate: number;
  batchSize: number;
  validationSplit: number;
  
  // Style Adaptation
  styleAdaptation: {
    enabled: boolean;
    adaptationSpeed: number; // 0.0 - 1.0
    minSamples: number;
    styleFeatures: string[];
  };
  
  // Model Management
  modelManagement: {
    saveTrainedModels: boolean;
    modelVersioning: boolean;
    autoBackup: boolean;
    compressionEnabled: boolean;
  };
  
  // Performance
  performance: {
    useGPU: boolean;
    memoryLimit: number; // GB
    timeoutMinutes: number;
    parallelTraining: boolean;
  };
}

interface TrainingData {
  id: string;
  content: string;
  metadata: {
    genre: string;
    style: string;
    length: number;
    timestamp: Date;
    userPreferences: Record<string, any>;
  };
  features: {
    vocabulary: string[];
    sentencePatterns: string[];
    tone: string;
    complexity: number;
  };
}

interface TrainingResult {
  modelId: string;
  accuracy: number;
  loss: number;
  trainingTime: number;
  modelSize: number; // MB
  features: {
    vocabularySize: number;
    styleAccuracy: number;
    adaptationLevel: number;
  };
  metadata: {
    trainedAt: Date;
    trainingDataSize: number;
    epochs: number;
    method: string;
  };
}

interface StyleProfile {
  userId: string;
  writingStyle: {
    vocabulary: string[];
    sentencePatterns: string[];
    tone: string;
    complexity: number;
    preferredGenres: string[];
    commonThemes: string[];
  };
  adaptationHistory: {
    timestamp: Date;
    accuracy: number;
    feedback: string;
  }[];
  preferences: {
    creativity: number;
    formality: number;
    detailLevel: number;
    emotionalTone: string;
  };
}

class AITrainingPipeline {
  private config: TrainingConfig;
  private ultimateAI: UltimateAIService;
  private aiAssistant: AIWritingAssistantService;
  private trainingData: TrainingData[] = [];
  private styleProfiles: Map<string, StyleProfile> = new Map();

  constructor(config?: Partial<TrainingConfig>) {
    this.config = {
      enabled: false,
      method: 'lora',
      dataPrivacy: true,
      trainingDataSize: 100,
      maxEpochs: 10,
      learningRate: 0.001,
      batchSize: 32,
      validationSplit: 0.2,
      
      // Style Adaptation
      styleAdaptation: {
        enabled: true,
        adaptationSpeed: 0.5,
        minSamples: 50,
        styleFeatures: ['vocabulary', 'sentence-structure', 'tone', 'complexity']
      },
      
      // Model Management
      modelManagement: {
        saveTrainedModels: true,
        modelVersioning: true,
        autoBackup: true,
        compressionEnabled: true
      },
      
      // Performance
      performance: {
        useGPU: false,
        memoryLimit: 4,
        timeoutMinutes: 30,
        parallelTraining: false
      },
      
      ...config
    };
    
    this.ultimateAI = new UltimateAIService();
    this.aiAssistant = new AIWritingAssistantService();
  }

  public async trainModel(
    userId: string,
    userData: NovelNode[],
    writingStyle?: Partial<StyleProfile>
  ): Promise<TrainingResult> {
    if (!this.config.enabled) {
      throw new Error('AI Training Pipeline is disabled');
    }

    try {
      // 1. Collect and preprocess training data
      const trainingData = await this.collectTrainingData(userId, userData);
      
      // 2. Analyze writing style
      const styleProfile = await this.analyzeWritingStyle(trainingData, writingStyle);
      
      // 3. Prepare training dataset
      const dataset = await this.prepareTrainingDataset(trainingData, styleProfile);
      
      // 4. Train the model
      const trainingResult = await this.executeTraining(dataset, styleProfile);
      
      // 5. Validate and save the model
      const validatedResult = await this.validateAndSaveModel(trainingResult, styleProfile);
      
      // 6. Update user profile
      await this.updateUserProfile(userId, styleProfile, validatedResult);
      
      return validatedResult;
      
    } catch (error) {
      console.error('AI Training Pipeline Error:', error);
      throw error;
    }
  }

  private async collectTrainingData(
    userId: string,
    userData: NovelNode[]
  ): Promise<TrainingData[]> {
    const trainingData: TrainingData[] = [];
    
    for (const node of userData) {
      if (!node.content || node.content.length < 50) continue;
      
      // Extract features from content
      const features = await this.extractContentFeatures(node.content);
      
      // Create training data point
      const dataPoint: TrainingData = {
        id: `${userId}-${node.id}-${Date.now()}`,
        content: node.content,
        metadata: {
          genre: this.detectGenre(node.content),
          style: this.detectStyle(node.content),
          length: node.content.length,
          timestamp: new Date(),
          userPreferences: this.extractUserPreferences(node)
        },
        features
      };
      
      trainingData.push(dataPoint);
    }
    
    // Limit data size based on configuration
    const maxSize = this.config.trainingDataSize * 1024 * 1024; // Convert MB to bytes
    let currentSize = 0;
    const limitedData: TrainingData[] = [];
    
    for (const data of trainingData) {
      const dataSize = new Blob([data.content]).size;
      if (currentSize + dataSize > maxSize) break;
      
      limitedData.push(data);
      currentSize += dataSize;
    }
    
    return limitedData;
  }

  private async analyzeWritingStyle(
    trainingData: TrainingData[],
    existingProfile?: Partial<StyleProfile>
  ): Promise<StyleProfile> {
    // Analyze vocabulary
    const vocabulary = this.extractVocabulary(trainingData);
    
    // Analyze sentence patterns
    const sentencePatterns = this.extractSentencePatterns(trainingData);
    
    // Analyze tone
    const tone = this.analyzeTone(trainingData);
    
    // Calculate complexity
    const complexity = this.calculateComplexity(trainingData);
    
    // Detect preferred genres
    const preferredGenres = this.detectPreferredGenres(trainingData);
    
    // Extract common themes
    const commonThemes = this.extractCommonThemes(trainingData);
    
    // Create or update style profile
    const styleProfile: StyleProfile = {
      userId: existingProfile?.userId || 'default',
      writingStyle: {
        vocabulary,
        sentencePatterns,
        tone,
        complexity,
        preferredGenres,
        commonThemes
      },
      adaptationHistory: existingProfile?.adaptationHistory || [],
      preferences: existingProfile?.preferences || {
        creativity: 0.7,
        formality: 0.5,
        detailLevel: 0.6,
        emotionalTone: 'neutral'
      }
    };
    
    return styleProfile;
  }

  private async prepareTrainingDataset(
    trainingData: TrainingData[],
    styleProfile: StyleProfile
  ): Promise<any> {
    // Split data into training and validation sets
    const splitIndex = Math.floor(trainingData.length * (1 - this.config.validationSplit));
    const trainingSet = trainingData.slice(0, splitIndex);
    const validationSet = trainingData.slice(splitIndex);
    
    // Format data for training
    const formattedData = {
      training: trainingSet.map(data => ({
        input: this.formatTrainingInput(data, styleProfile),
        target: data.content,
        features: data.features
      })),
      validation: validationSet.map(data => ({
        input: this.formatTrainingInput(data, styleProfile),
        target: data.content,
        features: data.features
      }))
    };
    
    return formattedData;
  }

  private async executeTraining(
    dataset: any,
    styleProfile: StyleProfile
  ): Promise<TrainingResult> {
    const startTime = Date.now();
    
    try {
      // Mock training process - in real implementation, this would use actual ML libraries
      const trainingResult = await this.mockTrainingProcess(dataset, styleProfile);
      
      const trainingTime = Date.now() - startTime;
      
      return {
        modelId: `model-${Date.now()}`,
        accuracy: trainingResult.accuracy,
        loss: trainingResult.loss,
        trainingTime,
        modelSize: trainingResult.modelSize,
        features: {
          vocabularySize: styleProfile.writingStyle.vocabulary.length,
          styleAccuracy: trainingResult.styleAccuracy,
          adaptationLevel: trainingResult.adaptationLevel
        },
        metadata: {
          trainedAt: new Date(),
          trainingDataSize: dataset.training.length,
          epochs: this.config.maxEpochs,
          method: this.config.method
        }
      };
      
    } catch (error) {
      throw new Error(`Training failed: ${error}`);
    }
  }

  private async mockTrainingProcess(
    dataset: any,
    styleProfile: StyleProfile
  ): Promise<any> {
    // Simulate training process
    const baseAccuracy = 0.7;
    const styleBonus = styleProfile.writingStyle.vocabulary.length * 0.001;
    const accuracy = Math.min(0.95, baseAccuracy + styleBonus);
    
    const loss = Math.max(0.1, 1.0 - accuracy);
    
    return {
      accuracy,
      loss,
      modelSize: 50 + Math.random() * 100, // MB
      styleAccuracy: accuracy * 0.9,
      adaptationLevel: this.config.styleAdaptation.adaptationSpeed
    };
  }

  private async validateAndSaveModel(
    trainingResult: TrainingResult,
    styleProfile: StyleProfile
  ): Promise<TrainingResult> {
    // Validate model performance
    if (trainingResult.accuracy < 0.6) {
      throw new Error('Model accuracy too low for deployment');
    }
    
    // Save model if enabled
    if (this.config.modelManagement.saveTrainedModels) {
      await this.saveTrainedModel(trainingResult, styleProfile);
    }
    
    return trainingResult;
  }

  private async updateUserProfile(
    userId: string,
    styleProfile: StyleProfile,
    trainingResult: TrainingResult
  ): Promise<void> {
    // Update adaptation history
    styleProfile.adaptationHistory.push({
      timestamp: new Date(),
      accuracy: trainingResult.accuracy,
      feedback: `Model trained with ${trainingResult.accuracy.toFixed(2)} accuracy`
    });
    
    // Save updated profile
    this.styleProfiles.set(userId, styleProfile);
    
    // Save to localStorage if data privacy is enabled
    if (this.config.dataPrivacy) {
      localStorage.setItem(`style-profile-${userId}`, JSON.stringify(styleProfile));
    }
  }

  // Feature extraction methods
  private async extractContentFeatures(content: string): Promise<any> {
    return {
      vocabulary: this.extractVocabularyFromText(content),
      sentencePatterns: this.extractSentencePatternsFromText(content),
      tone: this.analyzeToneFromText(content),
      complexity: this.calculateComplexityFromText(content)
    };
  }

  private extractVocabulary(trainingData: TrainingData[]): string[] {
    const vocabulary = new Set<string>();
    
    for (const data of trainingData) {
      const words = data.content.toLowerCase().split(/\s+/);
      words.forEach(word => {
        if (word.length > 2) {
          vocabulary.add(word);
        }
      });
    }
    
    return Array.from(vocabulary).slice(0, 1000); // Limit to 1000 words
  }

  private extractSentencePatterns(trainingData: TrainingData[]): string[] {
    const patterns = new Set<string>();
    
    for (const data of trainingData) {
      const sentences = data.content.split(/[.!?]+/);
      sentences.forEach(sentence => {
        const pattern = this.simplifySentence(sentence.trim());
        if (pattern.length > 5) {
          patterns.add(pattern);
        }
      });
    }
    
    return Array.from(patterns).slice(0, 500); // Limit to 500 patterns
  }

  private analyzeTone(trainingData: TrainingData[]): string {
    // Simple tone analysis
    const positiveWords = ['tuyệt', 'tuyệt vời', 'tốt', 'đẹp', 'yêu', 'hạnh phúc'];
    const negativeWords = ['tệ', 'xấu', 'ghét', 'buồn', 'đau khổ', 'tuyệt vọng'];
    
    let positiveCount = 0;
    let negativeCount = 0;
    
    for (const data of trainingData) {
      const content = data.content.toLowerCase();
      positiveWords.forEach(word => {
        if (content.includes(word)) positiveCount++;
      });
      negativeWords.forEach(word => {
        if (content.includes(word)) negativeCount++;
      });
    }
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  private calculateComplexity(trainingData: TrainingData[]): number {
    let totalComplexity = 0;
    let sampleCount = 0;
    
    for (const data of trainingData) {
      const complexity = this.calculateComplexityFromText(data.content);
      totalComplexity += complexity;
      sampleCount++;
    }
    
    return sampleCount > 0 ? totalComplexity / sampleCount : 0.5;
  }

  // Helper methods
  private detectGenre(content: string): string {
    const genres = {
      'romance': ['tình yêu', 'yêu', 'tâm hồn', 'cảm xúc'],
      'fantasy': ['phép thuật', 'ma thuật', 'thần tiên', 'rồng'],
      'mystery': ['bí ẩn', 'điều tra', 'manh mối', 'sự thật'],
      'scifi': ['tương lai', 'công nghệ', 'không gian', 'robot'],
      'horror': ['kinh dị', 'sợ hãi', 'ma', 'quỷ']
    };
    
    const contentLower = content.toLowerCase();
    let maxScore = 0;
    let detectedGenre = 'general';
    
    for (const [genre, keywords] of Object.entries(genres)) {
      const score = keywords.reduce((count, keyword) => {
        return count + (contentLower.includes(keyword) ? 1 : 0);
      }, 0);
      
      if (score > maxScore) {
        maxScore = score;
        detectedGenre = genre;
      }
    }
    
    return detectedGenre;
  }

  private detectStyle(content: string): string {
    const styles = {
      'formal': ['kính thưa', 'trân trọng', 'thưa'],
      'informal': ['bạn', 'mình', 'tui'],
      'poetic': ['trăng', 'sao', 'mây', 'gió'],
      'technical': ['hệ thống', 'phân tích', 'dữ liệu']
    };
    
    const contentLower = content.toLowerCase();
    let maxScore = 0;
    let detectedStyle = 'neutral';
    
    for (const [style, keywords] of Object.entries(styles)) {
      const score = keywords.reduce((count, keyword) => {
        return count + (contentLower.includes(keyword) ? 1 : 0);
      }, 0);
      
      if (score > maxScore) {
        maxScore = score;
        detectedStyle = style;
      }
    }
    
    return detectedStyle;
  }

  private extractUserPreferences(node: NovelNode): Record<string, any> {
    return {
      nodeType: node.type,
      contentLength: node.content.length,
      hasSummary: !!node.summary,
      childCount: node.children.length
    };
  }

  private extractVocabularyFromText(content: string): string[] {
    return content.toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 2)
      .slice(0, 100);
  }

  private extractSentencePatternsFromText(content: string): string[] {
    return content.split(/[.!?]+/)
      .map(sentence => this.simplifySentence(sentence.trim()))
      .filter(pattern => pattern.length > 5)
      .slice(0, 50);
  }

  private analyzeToneFromText(content: string): string {
    const positiveWords = ['tuyệt', 'tốt', 'đẹp', 'yêu', 'hạnh phúc'];
    const negativeWords = ['tệ', 'xấu', 'ghét', 'buồn', 'đau'];
    
    const contentLower = content.toLowerCase();
    const positiveCount = positiveWords.filter(word => contentLower.includes(word)).length;
    const negativeCount = negativeWords.filter(word => contentLower.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  private calculateComplexityFromText(content: string): number {
    const sentences = content.split(/[.!?]+/).length;
    const words = content.split(/\s+/).length;
    const avgSentenceLength = words / sentences;
    
    // Complexity based on average sentence length and vocabulary diversity
    const vocabulary = new Set(content.toLowerCase().split(/\s+/));
    const vocabularyDiversity = vocabulary.size / words;
    
    return Math.min(1.0, (avgSentenceLength / 20 + vocabularyDiversity) / 2);
  }

  private simplifySentence(sentence: string): string {
    // Simplify sentence to its basic structure
    return sentence
      .replace(/\b\w+\b/g, 'X')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private detectPreferredGenres(trainingData: TrainingData[]): string[] {
    const genreCounts = new Map<string, number>();
    
    for (const data of trainingData) {
      const genre = data.metadata.genre;
      genreCounts.set(genre, (genreCounts.get(genre) || 0) + 1);
    }
    
    return Array.from(genreCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([genre]) => genre);
  }

  private extractCommonThemes(trainingData: TrainingData[]): string[] {
    const themes = new Map<string, number>();
    
    for (const data of trainingData) {
      const words = data.content.toLowerCase().split(/\s+/);
      words.forEach(word => {
        if (word.length > 4) {
          themes.set(word, (themes.get(word) || 0) + 1);
        }
      });
    }
    
    return Array.from(themes.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([theme]) => theme);
  }

  private formatTrainingInput(data: TrainingData, styleProfile: StyleProfile): string {
    return `Genre: ${data.metadata.genre}\nStyle: ${data.metadata.style}\nTone: ${data.features.tone}\nComplexity: ${data.features.complexity}\n\nContent:`;
  }

  private async saveTrainedModel(
    trainingResult: TrainingResult,
    styleProfile: StyleProfile
  ): Promise<void> {
    // Mock model saving - in real implementation, this would save to file system or cloud
    const modelData = {
      ...trainingResult,
      styleProfile,
      savedAt: new Date()
    };
    
    if (this.config.dataPrivacy) {
      localStorage.setItem(`trained-model-${trainingResult.modelId}`, JSON.stringify(modelData));
    }
  }

  // Public methods
  public getStyleProfile(userId: string): StyleProfile | undefined {
    return this.styleProfiles.get(userId);
  }

  public updateStyleProfile(userId: string, profile: Partial<StyleProfile>): void {
    const existing = this.styleProfiles.get(userId) || {
      userId,
      writingStyle: {
        vocabulary: [],
        sentencePatterns: [],
        tone: 'neutral',
        complexity: 0.5,
        preferredGenres: [],
        commonThemes: []
      },
      adaptationHistory: [],
      preferences: {
        creativity: 0.7,
        formality: 0.5,
        detailLevel: 0.6,
        emotionalTone: 'neutral'
      }
    };
    
    const updated = { ...existing, ...profile };
    this.styleProfiles.set(userId, updated);
    
    if (this.config.dataPrivacy) {
      localStorage.setItem(`style-profile-${userId}`, JSON.stringify(updated));
    }
  }

  public getConfig(): TrainingConfig {
    return this.config;
  }

  public updateConfig(newConfig: Partial<TrainingConfig>) {
    this.config = { ...this.config, ...newConfig };
  }
}

export default AITrainingPipeline;
export type { TrainingConfig, TrainingData, TrainingResult, StyleProfile };
