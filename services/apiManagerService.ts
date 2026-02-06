interface APIConfig {
  name: string;
  key: string;
  baseUrl: string;
  model: string;
  rateLimit: {
    requestsPerMinute: number;
    tokensPerMinute: number;
    requestsPerDay: number;
    resetTime: string; // UTC time when daily limit resets
  };
  usage: {
    requestsToday: number;
    requestsThisMinute: number;
    tokensThisMinute: number;
    lastRequestTime: number;
  };
  isActive: boolean;
  priority: number; // 1 = highest priority
}

class APIManager {
  private apis: APIConfig[] = [];
  private currentAPIIndex: number = 0;
  private storageKey = 'api-manager-config';

  constructor() {
    this.initializeAPIs();
    this.loadUsageFromStorage();
    this.startResetTimer();
  }

  private initializeAPIs() {
    // Gemini API Configuration
    this.apis.push({
      name: 'Gemini',
      key: import.meta.env?.GEMINI_API_KEY || '',
      baseUrl: 'https://generativelanguage.googleapis.com',
      model: 'gemini-3-flash-preview',
      rateLimit: {
        requestsPerMinute: 15,
        tokensPerMinute: 1000000,
        requestsPerDay: 50,
        resetTime: '00:00:00' // Midnight UTC
      },
      usage: {
        requestsToday: 0,
        requestsThisMinute: 0,
        tokensThisMinute: 0,
        lastRequestTime: 0
      },
      isActive: true,
      priority: 1
    });

    // Groq API Configuration (Free Alternative)
    this.apis.push({
      name: 'Groq',
      key: import.meta.env?.GROQ_API_KEY || '',
      baseUrl: 'https://api.groq.com',
      model: 'llama-3.1-70b-versatile',
      rateLimit: {
        requestsPerMinute: 30,
        tokensPerMinute: 6000,
        requestsPerDay: 14400,
        resetTime: '00:00:00'
      },
      usage: {
        requestsToday: 0,
        requestsThisMinute: 0,
        tokensThisMinute: 0,
        lastRequestTime: 0
      },
      isActive: false,
      priority: 2
    });

    // OpenAI API Configuration (if available)
    this.apis.push({
      name: 'OpenAI',
      key: import.meta.env?.OPENAI_API_KEY || '',
      baseUrl: 'https://api.openai.com',
      model: 'gpt-3.5-turbo',
      rateLimit: {
        requestsPerMinute: 60,
        tokensPerMinute: 90000,
        requestsPerDay: 1000,
        resetTime: '00:00:00'
      },
      usage: {
        requestsToday: 0,
        requestsThisMinute: 0,
        tokensThisMinute: 0,
        lastRequestTime: 0
      },
      isActive: false,
      priority: 3
    });
  }

  private loadUsageFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        this.apis.forEach((api, index) => {
          if (data[index]) {
            api.usage = { ...api.usage, ...data[index].usage };
          }
        });
      }
    } catch (error) {
      console.error('Error loading API usage from storage:', error);
    }
  }

  private saveUsageToStorage() {
    try {
      const data = this.apis.map(api => ({
        name: api.name,
        usage: api.usage
      }));
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving API usage to storage:', error);
    }
  }

  private startResetTimer() {
    // Reset daily counters at midnight UTC
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    tomorrow.setUTCHours(0, 0, 0, 0);
    
    const msUntilMidnight = tomorrow.getTime() - now.getTime();
    
    setTimeout(() => {
      this.resetDailyUsage();
      this.startResetTimer(); // Start next day's timer
    }, msUntilMidnight);

    // Reset minute counters every minute
    setInterval(() => {
      this.resetMinuteUsage();
    }, 60000);
  }

  private resetDailyUsage() {
    this.apis.forEach(api => {
      api.usage.requestsToday = 0;
    });
    this.saveUsageToStorage();
    console.log('Daily API usage reset');
  }

  private resetMinuteUsage() {
    this.apis.forEach(api => {
      api.usage.requestsThisMinute = 0;
      api.usage.tokensThisMinute = 0;
    });
    this.saveUsageToStorage();
  }

  private updateUsage(apiIndex: number, tokensUsed: number = 0) {
    const api = this.apis[apiIndex];
    const now = Date.now();
    
    api.usage.requestsToday++;
    api.usage.requestsThisMinute++;
    api.usage.tokensThisMinute += tokensUsed;
    api.usage.lastRequestTime = now;
    
    this.saveUsageToStorage();
  }

  private isRateLimited(apiIndex: number, tokensNeeded: number = 0): boolean {
    const api = this.apis[apiIndex];
    
    return (
      api.usage.requestsThisMinute >= api.rateLimit.requestsPerMinute ||
      api.usage.tokensThisMinute + tokensNeeded > api.rateLimit.tokensPerMinute ||
      api.usage.requestsToday >= api.rateLimit.requestsPerDay
    );
  }

  private getNextAvailableAPI(): number {
    // Find first available API by priority
    for (let i = 0; i < this.apis.length; i++) {
      const apiIndex = (this.currentAPIIndex + i) % this.apis.length;
      const api = this.apis[apiIndex];
      
      if (api.key && api.key !== '' && !this.isRateLimited(apiIndex)) {
        return apiIndex;
      }
    }
    
    // If all APIs are rate limited, return the one that resets soonest
    return this.findSoonestResetAPI();
  }

  private findSoonestResetAPI(): number {
    let soonestIndex = 0;
    let soonestTime = Infinity;
    
    this.apis.forEach((api, index) => {
      if (api.key && api.key !== '') {
        const resetTime = this.getTimeUntilReset(api);
        if (resetTime < soonestTime) {
          soonestTime = resetTime;
          soonestIndex = index;
        }
      }
    });
    
    return soonestIndex;
  }

  private getTimeUntilReset(api: APIConfig): number {
    const now = new Date();
    const [hours, minutes, seconds] = api.rateLimit.resetTime.split(':').map(Number);
    
    const reset = new Date(now);
    reset.setUTCHours(hours, minutes, seconds, 0);
    
    // If reset time has passed today, set it for tomorrow
    if (reset.getTime() <= now.getTime()) {
      reset.setUTCDate(reset.getUTCDate() + 1);
    }
    
    return reset.getTime() - now.getTime();
  }

  public async makeRequest(prompt: string, tokensNeeded: number = 0): Promise<{ response: string; apiUsed: string; waitTime?: number }> {
    const apiIndex = this.getNextAvailableAPI();
    const api = this.apis[apiIndex];
    
    // Check if we need to wait for rate limit reset
    if (this.isRateLimited(apiIndex, tokensNeeded)) {
      const waitTime = this.getTimeUntilReset(api);
      console.log(`API ${api.name} rate limited. Waiting ${Math.ceil(waitTime / 1000)} seconds for reset.`);
      
      return {
        response: '',
        apiUsed: api.name,
        waitTime: waitTime
      };
    }
    
    this.currentAPIIndex = apiIndex;
    this.updateUsage(apiIndex, tokensNeeded);
    
    console.log(`Using API: ${api.name} (Request ${api.usage.requestsToday}/${api.rateLimit.requestsPerDay} today)`);
    
    // Return API config for the actual service to use
    return {
      response: '',
      apiUsed: api.name,
      apiConfig: {
        key: api.key,
        baseUrl: api.baseUrl,
        model: api.model
      }
    };
  }

  public getAPIStatus() {
    return this.apis.map(api => ({
      name: api.name,
      isActive: api.isActive,
      hasKey: api.key && api.key !== '',
      usage: {
        requestsToday: api.usage.requestsToday,
        requestsPerDay: api.rateLimit.requestsPerDay,
        requestsThisMinute: api.usage.requestsThisMinute,
        requestsPerMinute: api.rateLimit.requestsPerMinute,
        tokensThisMinute: api.usage.tokensThisMinute,
        tokensPerMinute: api.rateLimit.tokensPerMinute
      },
      timeUntilReset: this.getTimeUntilReset(api),
      priority: api.priority
    }));
  }

  public switchToAPI(apiName: string) {
    const index = this.apis.findIndex(api => api.name === apiName);
    if (index !== -1) {
      this.currentAPIIndex = index;
      console.log(`Switched to ${apiName} API`);
    }
  }

  public addCustomAPI(config: Partial<APIConfig>) {
    const newAPI: APIConfig = {
      name: config.name || 'Custom',
      key: config.key || '',
      baseUrl: config.baseUrl || '',
      model: config.model || '',
      rateLimit: {
        requestsPerMinute: config.rateLimit?.requestsPerMinute || 10,
        tokensPerMinute: config.rateLimit?.tokensPerMinute || 1000,
        requestsPerDay: config.rateLimit?.requestsPerDay || 100,
        resetTime: config.rateLimit?.resetTime || '00:00:00'
      },
      usage: {
        requestsToday: 0,
        requestsThisMinute: 0,
        tokensThisMinute: 0,
        lastRequestTime: 0
      },
      isActive: config.isActive || false,
      priority: config.priority || 999
    };
    
    this.apis.push(newAPI);
    this.apis.sort((a, b) => a.priority - b.priority);
  }
}

export default APIManager;
export type { APIConfig };
