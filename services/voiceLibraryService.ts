import { NovelNode, AIActionType } from "../types";
import UltimateAIService from "./ultimateAIService";
import StoryReaderService from "./storyReaderService";

// Voice Library Service - Quản lý thư viện giọng đọc và tự động đăng bài
// Tự động đăng lên YouTube và mạng xã hội theo lịch trình

interface VoiceLibrary {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  lastUpdated: Date;
  voices: StoredVoice[];
  publishingSettings: PublishingSettings;
  socialMediaAccounts: SocialMediaAccount[];
  analytics: VoiceAnalytics;
  automation: AutomationSettings;
}

interface StoredVoice {
  id: string;
  name: string;
  type: 'male' | 'female' | 'neutral' | 'character_based';
  language: string;
  accent: string;
  age: 'young' | 'adult' | 'mature' | 'elderly';
  style: 'narrative' | 'dramatic' | 'calm' | 'energetic' | 'mysterious';
  audioFile?: string;
  voiceModel?: string;
  characteristics: {
    pitch: number;
    speed: number;
    volume: number;
    emotionalRange: string;
  };
  usage: {
    usedInProjects: string[];
    totalUsageTime: number;
    lastUsed: Date;
    popularity: number;
  };
  metadata: {
    createdAt: Date;
    tags: string[];
    quality: 'low' | 'medium' | 'high' | 'ultra';
    isCustom: boolean;
    isPublic: boolean;
  };
}

interface PublishingSettings {
  youtube: {
    enabled: boolean;
    channelId: string;
    uploadSchedule: ScheduleConfig;
    videoSettings: VideoSettings;
    description: {
      template: string;
      includeHashtags: boolean;
      customHashtags: string[];
      includeLinks: boolean;
    };
  };
  facebook: {
    enabled: boolean;
    pageId: string;
    uploadSchedule: ScheduleConfig;
    postSettings: PostSettings;
  };
  instagram: {
    enabled: boolean;
    accountId: string;
    uploadSchedule: ScheduleConfig;
    postSettings: PostSettings;
  };
  tiktok: {
    enabled: boolean;
    accountId: string;
    uploadSchedule: ScheduleConfig;
    postSettings: PostSettings;
  };
  twitter: {
    enabled: boolean;
    handle: string;
    uploadSchedule: ScheduleConfig;
    postSettings: PostSettings;
  };
}

interface ScheduleConfig {
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
  times: string[];
  days: string[];
  timezone: string;
  autoOptimize: boolean;
  bestTimes: {
    morning: string[];
    afternoon: string[];
    evening: string[];
  };
}

interface VideoSettings {
  resolution: '720p' | '1080p' | '4K';
  quality: 'low' | 'medium' | 'high' | 'ultra';
  format: 'mp4' | 'mov' | 'avi';
  thumbnailStyle: 'auto' | 'custom' | 'branded';
  backgroundMusic: boolean;
  subtitles: boolean;
  endScreen: boolean;
}

interface PostSettings {
  format: 'video' | 'audio' | 'image' | 'text';
  length: 'short' | 'medium' | 'full';
  style: 'casual' | 'professional' | 'engaging' | 'educational';
  includeCallToAction: boolean;
  customTemplate?: string;
}

interface SocialMediaAccount {
  id: string;
  platform: 'youtube' | 'facebook' | 'instagram' | 'tiktok' | 'twitter';
  accountId: string;
  accountName: string;
  followers: number;
  isActive: boolean;
  lastPosted: Date;
  authentication: {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: Date;
  };
}

interface VoiceAnalytics {
  totalVoices: number;
  totalUsage: number;
  popularVoices: VoiceUsage[];
  platformPerformance: PlatformPerformance[];
  engagementMetrics: EngagementMetrics;
  growthTrends: GrowthTrend[];
}

interface VoiceUsage {
  voiceId: string;
  voiceName: string;
  usageCount: number;
  totalDuration: number;
  averageEngagement: number;
  platforms: string[];
}

interface PlatformPerformance {
  platform: string;
  totalPosts: number;
  totalViews: number;
  totalLikes: number;
  totalShares: number;
  totalComments: number;
  engagementRate: number;
  bestPerformingTime: string;
  growthRate: number;
}

interface EngagementMetrics {
  averageWatchTime: number;
  clickThroughRate: number;
  conversionRate: number;
  subscriberGrowth: number;
  engagementByTime: TimeBasedEngagement[];
}

interface TimeBasedEngagement {
  timeSlot: string;
  engagement: number;
  views: number;
  likes: number;
  shares: number;
}

interface GrowthTrend {
  date: Date;
  followers: number;
  views: number;
  engagement: number;
  revenue?: number;
}

interface AutomationSettings {
  enabled: boolean;
  postingSchedule: ScheduleConfig;
  contentGeneration: {
    autoGenerate: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    contentTypes: ('story_reading' | 'character_intro' | 'chapter_summary' | 'behind_scenes')[];
    templates: ContentTemplate[];
  };
  optimization: {
    autoOptimizePostingTimes: boolean;
    abTestContent: boolean;
    analyzePerformance: boolean;
    adjustStrategy: boolean;
  };
  integration: {
    connectToYouTube: boolean;
    connectToFacebook: boolean;
    connectToInstagram: boolean;
    connectToTikTok: boolean;
    connectToTwitter: boolean;
  };
}

interface ContentTemplate {
  id: string;
  name: string;
  type: 'story_reading' | 'character_intro' | 'chapter_summary' | 'behind_scenes';
  platform: 'youtube' | 'facebook' | 'instagram' | 'tiktok' | 'twitter';
  template: string;
  variables: TemplateVariable[];
  performance: {
    usageCount: number;
    averageEngagement: number;
    conversionRate: number;
  };
}

interface TemplateVariable {
  name: string;
  type: 'text' | 'number' | 'date' | 'custom';
  defaultValue: string;
  description: string;
}

class VoiceLibraryService {
  private ultimateAI: UltimateAIService;
  private storyReaderService: StoryReaderService;
  private currentLibrary: VoiceLibrary | null = null;

  constructor() {
    this.ultimateAI = new UltimateAIService();
    this.storyReaderService = new StoryReaderService();
  }

  // Create voice library
  public createLibrary(name: string, description: string): VoiceLibrary {
    const library: VoiceLibrary = {
      id: `voice-library-${Date.now()}`,
      name,
      description,
      createdAt: new Date(),
      lastUpdated: new Date(),
      voices: [],
      publishingSettings: this.getDefaultPublishingSettings(),
      socialMediaAccounts: [],
      analytics: {
        totalVoices: 0,
        totalUsage: 0,
        popularVoices: [],
        platformPerformance: [],
        engagementMetrics: {
          averageWatchTime: 0,
          clickThroughRate: 0,
          conversionRate: 0,
          subscriberGrowth: 0,
          engagementByTime: []
        },
        growthTrends: []
      },
      automation: {
        enabled: false,
        postingSchedule: {
          frequency: 'daily',
          times: ['09:00', '12:00', '18:00'],
          days: ['monday', 'wednesday', 'friday'],
          timezone: 'UTC',
          autoOptimize: true,
          bestTimes: {
            morning: ['09:00'],
            afternoon: ['12:00'],
            evening: ['18:00']
          }
        },
        contentGeneration: {
          autoGenerate: false,
          frequency: 'weekly',
          contentTypes: ['story_reading'],
          templates: []
        },
        optimization: {
          autoOptimizePostingTimes: true,
          abTestContent: false,
          analyzePerformance: true,
          adjustStrategy: true
        },
        integration: {
          connectToYouTube: false,
          connectToFacebook: false,
          connectToInstagram: false,
          connectToTikTok: false,
          connectToTwitter: false
        }
      }
    };

    this.currentLibrary = library;
    return library;
  }

  // Add voice to library
  public async addVoice(voiceData: Partial<StoredVoice>): Promise<StoredVoice> {
    if (!this.currentLibrary) {
      throw new Error('No library created. Create a library first.');
    }

    const voice: StoredVoice = {
      id: `voice-${Date.now()}`,
      name: voiceData.name || 'New Voice',
      type: voiceData.type || 'neutral',
      language: voiceData.language || 'en-US',
      accent: voiceData.accent || 'neutral',
      age: voiceData.age || 'adult',
      style: voiceData.style || 'narrative',
      characteristics: {
        pitch: voiceData.characteristics?.pitch || 1.0,
        speed: voiceData.characteristics?.speed || 1.0,
        volume: voiceData.characteristics?.volume || 0.8,
        emotionalRange: voiceData.characteristics?.emotionalRange || 'medium'
      },
      usage: {
        usedInProjects: [],
        totalUsageTime: 0,
        lastUsed: new Date(),
        popularity: 0
      },
      metadata: {
        createdAt: new Date(),
        tags: voiceData.metadata?.tags || [],
        quality: voiceData.metadata?.quality || 'medium',
        isCustom: voiceData.metadata?.isCustom || true,
        isPublic: voiceData.metadata?.isPublic || false
      }
    };

    this.currentLibrary.voices.push(voice);
    this.currentLibrary.lastUpdated = new Date();

    return voice;
  }

  // Auto-generate content and publish
  public async autoGenerateAndPublish(
    voiceId: string,
    contentTypes: ('story_reading' | 'character_intro' | 'chapter_summary' | 'behind_scenes')[],
    platforms: string[]
  ): Promise<{
    generatedContent: GeneratedContent[];
    publishedPosts: PublishedPost[];
    analytics: PublishingAnalytics;
  }> {
    if (!this.currentLibrary) {
      throw new Error('No library created. Create a library first.');
    }

    const voice = this.currentLibrary.voices.find(v => v.id === voiceId);
    if (!voice) {
      throw new Error('Voice not found');
    }

    try {
      // Generate content for each type
      const generatedContent: GeneratedContent[] = [];
      for (const contentType of contentTypes) {
        const content = await this.generateContent(voice, contentType);
        generatedContent.push(content);
      }

      // Publish to platforms
      const publishedPosts: PublishedPost[] = [];
      for (const platform of platforms) {
        for (const content of generatedContent) {
          const post = await this.publishToPlatform(platform, content, voice);
          if (post) {
            publishedPosts.push(post);
          }
        }
      }

      // Update analytics
      const analytics = await this.updatePublishingAnalytics(publishedPosts);

      return {
        generatedContent,
        publishedPosts,
        analytics
      };

    } catch (error) {
      console.error('Failed to auto-generate and publish:', error);
      throw error;
    }
  }

  // Optimize posting schedule
  public async optimizePostingSchedule(platform: string): Promise<OptimizedSchedule> {
    if (!this.currentLibrary) {
      throw new Error('No library created. Create a library first.');
    }

    try {
      const analytics = this.currentLibrary.analytics;
      const platformPerformance = analytics.platformPerformance.find(p => p.platform === platform);
      
      if (!platformPerformance) {
        return this.getDefaultSchedule(platform);
      }

      const prompt = `
Analyze this social media performance data and optimize posting schedule:

Platform: ${platform}
Current Performance:
- Total Posts: ${platformPerformance.totalPosts}
- Total Views: ${platformPerformance.totalViews}
- Total Likes: ${platformPerformance.totalLikes}
- Total Shares: ${platformPerformance.totalShares}
- Engagement Rate: ${platformPerformance.engagementRate}%
- Best Performing Time: ${platformPerformance.bestPerformingTime}
- Growth Rate: ${platformPerformance.growthRate}%

Engagement by Time:
${analytics.engagementMetrics.engagementByTime.map(time => 
  `- ${time.timeSlot}: ${time.engagement} engagement, ${time.views} views`
).join('\n')}

Please provide:
1. Optimal posting times (3-5 specific times)
2. Best content types for this platform
3. Recommended posting frequency
4. Content optimization suggestions
5. Growth strategies specific to platform

Consider platform-specific best practices and audience behavior.
      `.trim();

      const result = await this.ultimateAI.generateContent(
        {
          id: 'schedule-optimization',
          title: 'Posting Schedule Optimization',
          type: 'planning',
          content: '',
          summary: '',
          children: []
        },
        AIActionType.WRITE_CONTINUE,
        prompt
      );

      return this.parseOptimizedSchedule(result.text, platform);

    } catch (error) {
      console.error('Failed to optimize schedule:', error);
      return this.getDefaultSchedule(platform);
    }
  }

  // Connect social media accounts
  public async connectSocialMediaAccount(
    platform: 'youtube' | 'facebook' | 'instagram' | 'tiktok' | 'twitter',
    credentials: {
      accessToken: string;
      refreshToken?: string;
      accountId: string;
    }
  ): Promise<SocialMediaAccount> {
    try {
      // Simulate OAuth connection
      const account: SocialMediaAccount = {
        id: `account-${platform}-${Date.now()}`,
        platform,
        accountId: credentials.accountId,
        accountName: `${platform} Account`,
        followers: 0,
        isActive: true,
        lastPosted: new Date(),
        authentication: {
          accessToken: credentials.accessToken,
          refreshToken: credentials.refreshToken,
          expiresAt: new Date(Date.now() + 3600000) // 1 hour
        }
      };

      if (this.currentLibrary) {
        this.currentLibrary.socialMediaAccounts.push(account);
        this.currentLibrary.lastUpdated = new Date();
      }

      return account;

    } catch (error) {
      console.error('Failed to connect social media account:', error);
      throw error;
    }
  }

  // Get voice analytics
  public getVoiceAnalytics(voiceId: string): VoiceUsage | null {
    if (!this.currentLibrary) return null;

    const voice = this.currentLibrary.voices.find(v => v.id === voiceId);
    if (!voice) return null;

    return {
      voiceId,
      voiceName: voice.name,
      usageCount: voice.usage.usedInProjects.length,
      totalDuration: voice.usage.totalUsageTime,
      averageEngagement: voice.usage.popularity,
      platforms: this.currentLibrary.socialMediaAccounts
        .filter(account => account.isActive)
        .map(account => account.platform)
    };
  }

  // Get platform performance
  public getPlatformPerformance(platform: string): PlatformPerformance | null {
    if (!this.currentLibrary) return null;

    return this.currentLibrary.analytics.platformPerformance.find(p => p.platform === platform) || null;
  }

  // Helper methods
  private async generateContent(
    voice: StoredVoice,
    contentType: 'story_reading' | 'character_intro' | 'chapter_summary' | 'behind_scenes'
  ): Promise<GeneratedContent> {
    try {
      const prompt = `
Generate engaging content for social media using this voice profile:

Voice Profile:
- Name: ${voice.name}
- Type: ${voice.type}
- Style: ${voice.style}
- Age: ${voice.age}
- Language: ${voice.language}
- Emotional Range: ${voice.characteristics.emotionalRange}

Content Type: ${contentType}
Platform: Multiple platforms (YouTube, Facebook, Instagram, TikTok, Twitter)

Please generate:
1. Compelling title (under 60 characters)
2. Engaging content (100-300 words)
3. Relevant hashtags (5-10)
4. Call to action
5. Platform-specific adaptations

Content should be:
- Engaging and conversational
- Optimized for the voice style
- Suitable for multiple platforms
- Include emotional elements
- Have clear call to action
      `.trim();

      const result = await this.ultimateAI.generateContent(
        {
          id: `content-${Date.now()}`,
          title: 'Social Media Content Generation',
          type: 'writing',
          content: '',
          summary: '',
          children: []
        },
        AIActionType.WRITE_CONTINUE,
        prompt
      );

      return this.parseGeneratedContent(result.text, voice, contentType);

    } catch (error) {
      console.error('Failed to generate content:', error);
      return this.createFallbackContent(voice, contentType);
    }
  }

  private async publishToPlatform(
    platform: string,
    content: GeneratedContent,
    voice: StoredVoice
  ): Promise<PublishedPost | null> {
    try {
      // Simulate publishing to platform
      const post: PublishedPost = {
        id: `post-${platform}-${Date.now()}`,
        platform,
        contentId: content.id,
        voiceId: voice.id,
        title: content.title,
        content: content.content,
        hashtags: content.hashtags,
        callToAction: content.callToAction,
        publishedAt: new Date(),
        status: 'published',
        metrics: {
          views: 0,
          likes: 0,
          shares: 0,
          comments: 0,
          engagement: 0
        },
        url: `https://${platform}.com/post/${Date.now()}`
      };

      // Update voice usage
      voice.usage.usedInProjects.push(post.id);
      voice.usage.totalUsageTime += content.estimatedDuration;
      voice.usage.lastUsed = new Date();
      voice.usage.popularity += 1;

      return post;

    } catch (error) {
      console.error(`Failed to publish to ${platform}:`, error);
      return null;
    }
  }

  private async updatePublishingAnalytics(posts: PublishedPost[]): Promise<PublishingAnalytics> {
    // Simulate analytics update
    return {
      totalPosts: posts.length,
      totalViews: posts.reduce((sum, post) => sum + post.metrics.views, 0),
      totalLikes: posts.reduce((sum, post) => sum + post.metrics.likes, 0),
      totalShares: posts.reduce((sum, post) => sum + post.metrics.shares, 0),
      totalComments: posts.reduce((sum, post) => sum + post.metrics.comments, 0),
      averageEngagement: posts.length > 0 ? 
        posts.reduce((sum, post) => sum + post.metrics.engagement, 0) / posts.length : 0,
      bestPerformingPlatform: this.getBestPerformingPlatform(posts),
      optimalPostingTime: '18:00',
      growthRate: 5.2
    };
  }

  private parseGeneratedContent(aiResponse: string, voice: StoredVoice, contentType: string): GeneratedContent {
    // Simple parsing - in production, use more sophisticated parsing
    const lines = aiResponse.split('\n');
    let title = '';
    let content = '';
    let hashtags: string[] = '';
    let callToAction = '';

    lines.forEach(line => {
      if (line.toLowerCase().includes('title:')) {
        title = line.split(':')[1]?.trim() || '';
      } else if (line.toLowerCase().includes('content:')) {
        content = line.split(':')[1]?.trim() || '';
      } else if (line.toLowerCase().includes('hashtags:')) {
        hashtags = line.split(':')[1]?.trim().split(',').map(h => h.trim()) || [];
      } else if (line.toLowerCase().includes('call to action:')) {
        callToAction = line.split(':')[1]?.trim() || '';
      }
    });

    return {
      id: `content-${Date.now()}`,
      voiceId: voice.id,
      contentType,
      title: title || `Story Reading with ${voice.name}`,
      content: content || 'Amazing story content...',
      hashtags: hashtags.length > 0 ? hashtags : ['#storytelling', '#audiobook', '#voiceacting'],
      callToAction: callToAction || 'Listen to more amazing stories!',
      estimatedDuration: content.split(/\s+/).length * 0.5, // 30 seconds per 15 words
      platform: 'multi',
      generatedAt: new Date()
    };
  }

  private createFallbackContent(voice: StoredVoice, contentType: string): GeneratedContent {
    return {
      id: `content-fallback-${Date.now()}`,
      voiceId: voice.id,
      contentType,
      title: `Story Reading with ${voice.name}`,
      content: `Experience amazing storytelling with ${voice.name}'s incredible voice!`,
      hashtags: ['#storytelling', '#audiobook', '#voiceacting'],
      callToAction: 'Subscribe for more amazing stories!',
      estimatedDuration: 60,
      platform: 'multi',
      generatedAt: new Date()
    };
  }

  private parseOptimizedSchedule(aiResponse: string, platform: string): OptimizedSchedule {
    // Simple parsing - in production, use more sophisticated parsing
    const lines = aiResponse.split('\n');
    let optimalTimes: string[] = [];
    let contentTypes: string[] = [];
    let frequency = 'daily';
    let recommendations: string[] = [];

    lines.forEach(line => {
      if (line.toLowerCase().includes('optimal times:')) {
        optimalTimes = line.split(':')[1]?.trim().split(',').map(t => t.trim()) || [];
      } else if (line.toLowerCase().includes('content types:')) {
        contentTypes = line.split(':')[1]?.trim().split(',').map(t => t.trim()) || [];
      } else if (line.toLowerCase().includes('frequency:')) {
        frequency = line.split(':')[1]?.trim() as any || 'daily';
      }
    });

    return {
      platform,
      optimalTimes: optimalTimes.length > 0 ? optimalTimes : ['09:00', '12:00', '18:00'],
      contentTypes: contentTypes.length > 0 ? contentTypes : ['story_reading', 'character_intro'],
      frequency,
      recommendations: recommendations.length > 0 ? recommendations : ['Post consistently', 'Engage with audience'],
      confidence: 0.85,
      basedOnAnalytics: true
    };
  }

  private getDefaultSchedule(platform: string): OptimizedSchedule {
    const defaultTimes = {
      youtube: ['09:00', '14:00', '19:00'],
      facebook: ['10:00', '15:00', '20:00'],
      instagram: ['08:00', '13:00', '18:00'],
      tiktok: ['11:00', '16:00', '21:00'],
      twitter: ['09:00', '12:00', '18:00']
    };

    return {
      platform,
      optimalTimes: defaultTimes[platform as keyof typeof defaultTimes] || ['09:00', '12:00', '18:00'],
      contentTypes: ['story_reading', 'character_intro'],
      frequency: 'daily',
      recommendations: ['Start with optimal times', 'Monitor performance'],
      confidence: 0.6,
      basedOnAnalytics: false
    };
  }

  private getDefaultPublishingSettings(): PublishingSettings {
    return {
      youtube: {
        enabled: false,
        channelId: '',
        uploadSchedule: {
          frequency: 'daily',
          times: ['09:00', '12:00', '18:00'],
          days: ['monday', 'wednesday', 'friday'],
          timezone: 'UTC',
          autoOptimize: true,
          bestTimes: {
            morning: ['09:00'],
            afternoon: ['12:00'],
            evening: ['18:00']
          }
        },
        videoSettings: {
          resolution: '1080p',
          quality: 'high',
          format: 'mp4',
          thumbnailStyle: 'auto',
          backgroundMusic: true,
          subtitles: true,
          endScreen: true
        },
        description: {
          template: 'default',
          includeHashtags: true,
          customHashtags: [],
          includeLinks: true
        }
      },
      facebook: {
        enabled: false,
        pageId: '',
        uploadSchedule: {
          frequency: 'daily',
          times: ['10:00', '15:00'],
          days: ['tuesday', 'thursday', 'saturday'],
          timezone: 'UTC',
          autoOptimize: true,
          bestTimes: {
            morning: ['10:00'],
            afternoon: ['15:00'],
            evening: ['20:00']
          }
        },
        postSettings: {
          format: 'video',
          length: 'medium',
          style: 'engaging',
          includeCallToAction: true
        }
      },
      instagram: {
        enabled: false,
        accountId: '',
        uploadSchedule: {
          frequency: 'daily',
          times: ['08:00', '13:00', '18:00'],
          days: ['monday', 'wednesday', 'friday', 'sunday'],
          timezone: 'UTC',
          autoOptimize: true,
          bestTimes: {
            morning: ['08:00'],
            afternoon: ['13:00'],
            evening: ['18:00']
          }
        },
        postSettings: {
          format: 'video',
          length: 'short',
          style: 'engaging',
          includeCallToAction: true
        }
      },
      tiktok: {
        enabled: false,
        accountId: '',
        uploadSchedule: {
          frequency: 'daily',
          times: ['11:00', '16:00', '21:00'],
          days: ['daily'],
          timezone: 'UTC',
          autoOptimize: true,
          bestTimes: {
            morning: ['11:00'],
            afternoon: ['16:00'],
            evening: ['21:00']
          }
        },
        postSettings: {
          format: 'video',
          length: 'short',
          style: 'engaging',
          includeCallToAction: true
        }
      },
      twitter: {
        enabled: false,
        handle: '',
        uploadSchedule: {
          frequency: 'daily',
          times: ['09:00', '12:00', '18:00'],
          days: ['daily'],
          timezone: 'UTC',
          autoOptimize: true,
          bestTimes: {
            morning: ['09:00'],
            afternoon: ['12:00'],
            evening: ['18:00']
          }
        },
        postSettings: {
          format: 'text',
          length: 'short',
          style: 'engaging',
          includeCallToAction: true
        }
      }
    };
  }

  private getBestPerformingPlatform(posts: PublishedPost[]): string {
    const platformPerformance: { [key: string]: number } = {};
    
    posts.forEach(post => {
      if (!platformPerformance[post.platform]) {
        platformPerformance[post.platform] = 0;
      }
      platformPerformance[post.platform] += post.metrics.engagement;
    });

    return Object.entries(platformPerformance)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'youtube';
  }

  // Get current library
  public getCurrentLibrary(): VoiceLibrary | null {
    return this.currentLibrary;
  }

  // Export/Import methods
  public exportLibrary(): string {
    if (!this.currentLibrary) return '';
    
    return JSON.stringify(this.currentLibrary, null, 2);
  }

  public importLibrary(jsonString: string): VoiceLibrary {
    try {
      const library = JSON.parse(jsonString) as VoiceLibrary;
      this.currentLibrary = library;
      return library;
    } catch (error) {
      throw new Error('Invalid library JSON format');
    }
  }
}

// Additional interfaces
interface GeneratedContent {
  id: string;
  voiceId: string;
  contentType: 'story_reading' | 'character_intro' | 'chapter_summary' | 'behind_scenes';
  title: string;
  content: string;
  hashtags: string[];
  callToAction: string;
  estimatedDuration: number;
  platform: string;
  generatedAt: Date;
}

interface PublishedPost {
  id: string;
  platform: string;
  contentId: string;
  voiceId: string;
  title: string;
  content: string;
  hashtags: string[];
  callToAction: string;
  publishedAt: Date;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  metrics: {
    views: number;
    likes: number;
    shares: number;
    comments: number;
    engagement: number;
  };
  url: string;
}

interface PublishingAnalytics {
  totalPosts: number;
  totalViews: number;
  totalLikes: number;
  totalShares: number;
  totalComments: number;
  averageEngagement: number;
  bestPerformingPlatform: string;
  optimalPostingTime: string;
  growthRate: number;
}

interface OptimizedSchedule {
  platform: string;
  optimalTimes: string[];
  contentTypes: string[];
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
  recommendations: string[];
  confidence: number;
  basedOnAnalytics: boolean;
}

export default VoiceLibraryService;
export type {
  VoiceLibrary,
  StoredVoice,
  PublishingSettings,
  SocialMediaAccount,
  VoiceAnalytics,
  AutomationSettings,
  ContentTemplate,
  GeneratedContent,
  PublishedPost,
  PublishingAnalytics,
  OptimizedSchedule
};
