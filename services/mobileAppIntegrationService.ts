import { NovelNode, AIActionType } from "../types";
import UltimateAIService from "./ultimateAIService";

// Mobile App Integration - Tích hợp mobile app
// Cross-platform sync và offline mode cho mobile experience

interface MobileAppConfig {
  id: string;
  name: string;
  version: string;
  platform: 'ios' | 'android' | 'web' | 'desktop';
  buildNumber: string;
  environment: 'development' | 'staging' | 'production';
  features: AppFeatures;
  syncSettings: SyncSettings;
  offlineSettings: OfflineSettings;
  securitySettings: SecuritySettings;
  performanceSettings: PerformanceSettings;
}

interface AppFeatures {
  pushNotifications: boolean;
  biometricAuth: boolean;
  offlineMode: boolean;
  cloudSync: boolean;
  realTimeSync: boolean;
  backgroundSync: boolean;
  autoBackup: boolean;
  dataCompression: boolean;
  adaptiveUI: boolean;
  darkMode: boolean;
  accessibility: boolean;
}

interface SyncSettings {
  autoSync: boolean;
  syncInterval: number; // minutes
  syncOnWifi: boolean;
  syncOnCellular: boolean;
  conflictResolution: 'client_wins' | 'server_wins' | 'manual' | 'merge';
  maxRetries: number;
  batchSize: number;
  compressionEnabled: boolean;
  encryptionEnabled: boolean;
}

interface OfflineSettings {
  enabled: boolean;
  maxStorageSize: number; // MB
  cacheStrategy: 'lru' | 'fifo' | 'priority';
  autoCleanup: boolean;
  cleanupInterval: number; // hours
  essentialDataOnly: boolean;
  syncOnReconnect: boolean;
  offlineQueueSize: number;
  dataRetention: number; // days
}

interface SecuritySettings {
  encryptionEnabled: boolean;
  biometricAuth: boolean;
  pinAuth: boolean;
  twoFactorAuth: boolean;
  sessionTimeout: number; // minutes
  dataEncryption: 'aes256' | 'rsa2048' | 'custom';
  keyRotation: boolean;
  secureStorage: boolean;
  auditLogging: boolean;
}

interface PerformanceSettings {
  maxMemoryUsage: number; // MB
  maxCpuUsage: number; // percentage
  cacheSize: number; // MB
  imageCompression: number; // quality 0-100
  videoCompression: number; // quality 0-100
  lazyLoading: boolean;
  backgroundThrottling: boolean;
  adaptiveQuality: boolean;
}

interface MobileDevice {
  id: string;
  userId: string;
  deviceType: 'ios' | 'android' | 'web' | 'desktop';
  deviceId: string;
  deviceName: string;
  osVersion: string;
  appVersion: string;
  lastActive: Date;
  isOnline: boolean;
  pushToken?: string;
  capabilities: DeviceCapabilities;
  preferences: DevicePreferences;
}

interface DeviceCapabilities {
  storage: number; // MB
  memory: number; // MB
  cpuCores: number;
  camera: boolean;
  microphone: boolean;
  gps: boolean;
  biometric: boolean;
  notifications: boolean;
  backgroundMode: boolean;
  networkType: 'wifi' | 'cellular' | 'offline';
  networkSpeed: number; // Mbps
}

interface DevicePreferences {
  language: string;
  timezone: string;
  theme: 'light' | 'dark' | 'auto';
  fontSize: 'small' | 'medium' | 'large';
  notifications: boolean;
  autoSync: boolean;
  offlineMode: boolean;
  dataUsage: 'wifi_only' | 'wifi_and_cellular' | 'offline_only';
}

interface SyncOperation {
  id: string;
  deviceId: string;
  userId: string;
  operation: 'upload' | 'download' | 'delete' | 'update';
  dataType: 'project' | 'character' | 'scene' | 'audio' | 'video' | 'settings';
  dataId: string;
  timestamp: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  progress: number; // 0-100
  fileSize: number; // bytes
  transferredSize: number; // bytes
  error?: string;
  retryCount: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

interface OfflineQueue {
  id: string;
  deviceId: string;
  operations: OfflineOperation[];
  timestamp: Date;
  size: number; // total size in bytes
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

interface OfflineOperation {
  id: string;
  type: 'create' | 'update' | 'delete';
  entityType: string;
  entityId: string;
  data: any;
  timestamp: Date;
  dependencies: string[];
}

interface PushNotification {
  id: string;
  userId: string;
  deviceId?: string;
  type: 'sync_complete' | 'sync_error' | 'new_message' | 'project_update' | 'system' | 'reminder';
  title: string;
  message: string;
  data?: any;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actions?: NotificationAction[];
}

interface NotificationAction {
  id: string;
  title: string;
  action: string;
  icon?: string;
  destructive?: boolean;
}

interface AppAnalytics {
  userId: string;
  deviceId: string;
  sessionId: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // seconds
  actions: UserAction[];
  performance: PerformanceMetrics;
  errors: AppError[];
  networkUsage: NetworkUsage;
  batteryUsage: BatteryUsage;
}

interface UserAction {
  id: string;
  type: 'tap' | 'swipe' | 'scroll' | 'input' | 'navigation' | 'sync' | 'offline_mode';
  target: string;
  timestamp: Date;
  duration: number; // milliseconds
  metadata: any;
}

interface PerformanceMetrics {
  appStartupTime: number; // milliseconds
  memoryUsage: number; // MB
  cpuUsage: number; // percentage
  networkLatency: number; // milliseconds
  renderTime: number; // milliseconds
  cacheHitRate: number; // percentage
  batteryLevel: number; // percentage
}

interface AppError {
  id: string;
  type: 'crash' | 'exception' | 'network' | 'sync' | 'storage' | 'permission';
  message: string;
  stack?: string;
  timestamp: Date;
  context: any;
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolved: boolean;
}

interface NetworkUsage {
  totalBytes: number;
  uploadBytes: number;
  downloadBytes: number;
  requests: number;
  avgResponseTime: number; // milliseconds
  errors: number;
}

interface BatteryUsage {
  startLevel: number; // percentage
  endLevel: number; // percentage
  drainRate: number; // percentage per hour
  usageTime: number; // seconds
}

class MobileAppIntegrationService {
  private ultimateAI: UltimateAIService;
  private devices: Map<string, MobileDevice> = new Map();
  private syncOperations: Map<string, SyncOperation> = new Map();
  private offlineQueues: Map<string, OfflineQueue> = new Map();
  private notifications: Map<string, PushNotification> = new Map();
  private analytics: Map<string, AppAnalytics> = new Map();
  private syncEngine: SyncEngine;
  private offlineEngine: OfflineEngine;
  private pushEngine: PushEngine;
  private performanceEngine: PerformanceEngine;

  constructor() {
    this.ultimateAI = new UltimateAIService();
    this.syncEngine = new SyncEngine();
    this.offlineEngine = new OfflineEngine();
    this.pushEngine = new PushEngine();
    this.performanceEngine = new PerformanceEngine();
    this.initializeDefaultConfig();
  }

  // Initialize mobile app configuration
  public async initializeMobileApp(
    platform: 'ios' | 'android' | 'web' | 'desktop',
    userId: string,
    deviceInfo: Partial<MobileDevice>
  ): Promise<MobileAppConfig> {
    try {
      const prompt = `
Generate mobile app configuration for this platform and user:

Platform: ${platform}
User ID: ${userId}
Device Info: ${JSON.stringify(deviceInfo)}

Requirements:
1. Optimize for platform-specific features and limitations
2. Configure appropriate sync settings for mobile usage
3. Set up offline capabilities for intermittent connectivity
4. Implement security measures for mobile data protection
5. Optimize performance for mobile hardware constraints
6. Configure push notifications for user engagement
7. Set up analytics for performance monitoring
8. Enable adaptive UI for different screen sizes

Focus on creating a seamless mobile experience with robust offline support.
      `.trim();

      const result = await this.ultimateAI.generateContent(
        {
          id: 'mobile-app-config',
          title: 'Mobile App Configuration',
          type: 'configuration',
          content: '',
          summary: '',
          children: []
        },
        AIActionType.WRITE_CONTINUE,
        prompt
      );

      const config = this.parseMobileAppConfig(result.text, platform, userId, deviceInfo);
      
      // Register device
      const device: MobileDevice = {
        id: `device-${Date.now()}`,
        userId,
        deviceType: platform,
        deviceId: deviceInfo.deviceId || 'unknown',
        deviceName: deviceInfo.deviceName || 'Unknown Device',
        osVersion: deviceInfo.osVersion || 'unknown',
        appVersion: config.version,
        lastActive: new Date(),
        isOnline: true,
        pushToken: deviceInfo.pushToken,
        capabilities: deviceInfo.capabilities || this.getDefaultCapabilities(platform),
        preferences: deviceInfo.preferences || this.getDefaultPreferences()
      };

      this.devices.set(device.id, device);
      return config;

    } catch (error) {
      console.error('Failed to initialize mobile app:', error);
      throw error;
    }
  }

  // Register device for push notifications
  public async registerDeviceForPush(
    deviceId: string,
    pushToken: string,
    preferences: any
  ): Promise<boolean> {
    try {
      const device = this.devices.get(deviceId);
      if (!device) {
        throw new Error('Device not found');
      }

      device.pushToken = pushToken;
      device.preferences = { ...device.preferences, ...preferences };

      // Register with push service
      const registered = await this.pushEngine.registerDevice(deviceId, pushToken, preferences);
      
      if (registered) {
        // Send welcome notification
        await this.sendPushNotification(device.userId, {
          type: 'system',
          title: 'Welcome to Mobile App',
          message: 'Your device has been successfully registered for push notifications.',
          priority: 'medium'
        });
      }

      return registered;

    } catch (error) {
      console.error('Failed to register device for push:', error);
      return false;
    }
  }

  // Start sync operation
  public async startSync(
    deviceId: string,
    dataType: string,
    operation: 'upload' | 'download' | 'delete' | 'update',
    dataId: string,
    data?: any
  ): Promise<SyncOperation> {
    const device = this.devices.get(deviceId);
    if (!device) {
      throw new Error('Device not found');
    }

    const syncOp: SyncOperation = {
      id: `sync-${Date.now()}`,
      deviceId,
      userId: device.userId,
      operation,
      dataType: dataType as any,
      dataId,
      timestamp: new Date(),
      status: 'pending',
      progress: 0,
      fileSize: data ? JSON.stringify(data).length : 0,
      transferredSize: 0,
      retryCount: 0,
      priority: 'medium'
    };

    this.syncOperations.set(syncOp.id, syncOp);

    try {
      // Check if device is online
      if (!device.isOnline) {
        // Add to offline queue
        await this.addToOfflineQueue(deviceId, {
          id: syncOp.id,
          type: operation === 'delete' ? 'delete' : operation === 'upload' ? 'create' : 'update',
          entityType: dataType,
          entityId: dataId,
          data,
          timestamp: new Date(),
          dependencies: []
        });
        
        syncOp.status = 'failed';
        syncOp.error = 'Device offline - added to queue';
        return syncOp;
      }

      // Perform sync
      syncOp.status = 'in_progress';
      const result = await this.syncEngine.performSync(syncOp, data);

      if (result.success) {
        syncOp.status = 'completed';
        syncOp.progress = 100;
        syncOp.transferredSize = syncOp.fileSize;

        // Send success notification
        await this.sendPushNotification(device.userId, {
          type: 'sync_complete',
          title: 'Sync Complete',
          message: `${operation.charAt(0).toUpperCase() + operation.slice(1)} of ${dataType} completed successfully.`,
          priority: 'low'
        });

      } else {
        syncOp.status = 'failed';
        syncOp.error = result.error;
        
        // Retry logic
        if (syncOp.retryCount < 3) {
          syncOp.retryCount++;
          setTimeout(() => this.startSync(deviceId, dataType, operation, dataId, data), 5000 * syncOp.retryCount);
        }
      }

    } catch (error) {
      syncOp.status = 'failed';
      syncOp.error = error.message;
    }

    return syncOp;
  }

  // Enable offline mode
  public async enableOfflineMode(deviceId: string, settings?: Partial<OfflineSettings>): Promise<boolean> {
    try {
      const device = this.devices.get(deviceId);
      if (!device) {
        throw new Error('Device not found');
      }

      const offlineSettings = {
        enabled: true,
        maxStorageSize: settings?.maxStorageSize || 500, // 500MB
        cacheStrategy: settings?.cacheStrategy || 'lru',
        autoCleanup: settings?.autoCleanup !== false,
        cleanupInterval: settings?.cleanupInterval || 24, // 24 hours
        essentialDataOnly: settings?.essentialDataOnly || false,
        syncOnReconnect: settings?.syncOnReconnect !== false,
        offlineQueueSize: settings?.offlineQueueSize || 100,
        dataRetention: settings?.dataRetention || 30 // 30 days
      };

      // Initialize offline engine
      const initialized = await this.offlineEngine.initialize(deviceId, offlineSettings);
      
      if (initialized) {
        // Cache essential data
        await this.cacheEssentialData(deviceId);
        
        // Send notification
        await this.sendPushNotification(device.userId, {
          type: 'system',
          title: 'Offline Mode Enabled',
          message: 'Your app is now in offline mode. Essential data has been cached.',
          priority: 'medium'
        });
      }

      return initialized;

    } catch (error) {
      console.error('Failed to enable offline mode:', error);
      return false;
    }
  }

  // Process offline queue when back online
  public async processOfflineQueue(deviceId: string): Promise<SyncOperation[]> {
    const queue = this.offlineQueues.get(deviceId);
    if (!queue || queue.operations.length === 0) {
      return [];
    }

    const results: SyncOperation[] = [];
    queue.status = 'processing';

    try {
      for (const operation of queue.operations) {
        const syncOp = await this.startSync(
          deviceId,
          operation.entityType,
          operation.type === 'delete' ? 'delete' : operation.type === 'create' ? 'upload' : 'update',
          operation.entityId,
          operation.data
        );
        
        results.push(syncOp);
      }

      // Clear processed operations
      queue.operations = [];
      queue.status = 'completed';
      this.offlineQueues.set(deviceId, queue);

    } catch (error) {
      queue.status = 'failed';
      console.error('Failed to process offline queue:', error);
    }

    return results;
  }

  // Send push notification
  public async sendPushNotification(
    userId: string,
    notification: Partial<PushNotification>
  ): Promise<PushNotification> {
    const pushNotif: PushNotification = {
      id: `notif-${Date.now()}`,
      userId,
      type: notification.type || 'system',
      title: notification.title || 'Notification',
      message: notification.message || '',
      data: notification.data,
      timestamp: new Date(),
      read: false,
      priority: notification.priority || 'medium',
      actions: notification.actions
    };

    this.notifications.set(pushNotif.id, pushNotif);

    try {
      // Send to all user devices
      const userDevices = Array.from(this.devices.values()).filter(d => d.userId === userId);
      
      for (const device of userDevices) {
        if (device.pushToken) {
          await this.pushEngine.sendNotification(device.pushToken, pushNotif);
        }
      }

    } catch (error) {
      console.error('Failed to send push notification:', error);
    }

    return pushNotif;
  }

  // Track app analytics
  public async trackAnalytics(
    deviceId: string,
    sessionId: string,
    action: UserAction
  ): Promise<void> {
    let analytics = this.analytics.get(sessionId);
    
    if (!analytics) {
      const device = this.devices.get(deviceId);
      analytics = {
        userId: device?.userId || 'unknown',
        deviceId,
        sessionId,
        startTime: new Date(),
        actions: [],
        performance: await this.performanceEngine.getCurrentMetrics(),
        errors: [],
        networkUsage: { totalBytes: 0, uploadBytes: 0, downloadBytes: 0, requests: 0, avgResponseTime: 0, errors: 0 },
        batteryUsage: { startLevel: 100, endLevel: 100, drainRate: 0, usageTime: 0 }
      };
      this.analytics.set(sessionId, analytics);
    }

    analytics.actions.push(action);
    analytics.performance = await this.performanceEngine.getCurrentMetrics();
  }

  // Get device status
  public getDeviceStatus(deviceId: string): MobileDevice | null {
    return this.devices.get(deviceId) || null;
  }

  // Get sync operations
  public getSyncOperations(deviceId?: string): SyncOperation[] {
    const operations = Array.from(this.syncOperations.values());
    return deviceId ? operations.filter(op => op.deviceId === deviceId) : operations;
  }

  // Get offline queue
  public getOfflineQueue(deviceId: string): OfflineQueue | null {
    return this.offlineQueues.get(deviceId) || null;
  }

  // Get notifications
  public getNotifications(userId: string, unreadOnly: boolean = false): PushNotification[] {
    const notifications = Array.from(this.notifications.values()).filter(n => n.userId === userId);
    return unreadOnly ? notifications.filter(n => !n.read) : notifications;
  }

  // Get analytics
  public getAnalytics(userId?: string, deviceId?: string): AppAnalytics[] {
    let analytics = Array.from(this.analytics.values());
    
    if (userId) {
      analytics = analytics.filter(a => a.userId === userId);
    }
    
    if (deviceId) {
      analytics = analytics.filter(a => a.deviceId === deviceId);
    }
    
    return analytics;
  }

  // Private helper methods
  private initializeDefaultConfig(): void {
    // Initialize default mobile app configuration
  }

  private parseMobileAppConfig(
    aiResponse: string,
    platform: string,
    userId: string,
    deviceInfo: Partial<MobileDevice>
  ): MobileAppConfig {
    // Simple parsing - in production, use more sophisticated parsing
    return {
      id: `config-${Date.now()}`,
      name: 'AI Studio Mobile',
      version: '1.0.0',
      platform: platform as any,
      buildNumber: '1',
      environment: 'production',
      features: {
        pushNotifications: true,
        biometricAuth: true,
        offlineMode: true,
        cloudSync: true,
        realTimeSync: true,
        backgroundSync: true,
        autoBackup: true,
        dataCompression: true,
        adaptiveUI: true,
        darkMode: true,
        accessibility: true
      },
      syncSettings: {
        autoSync: true,
        syncInterval: 30,
        syncOnWifi: true,
        syncOnCellular: false,
        conflictResolution: 'merge',
        maxRetries: 3,
        batchSize: 10,
        compressionEnabled: true,
        encryptionEnabled: true
      },
      offlineSettings: {
        enabled: true,
        maxStorageSize: 500,
        cacheStrategy: 'lru',
        autoCleanup: true,
        cleanupInterval: 24,
        essentialDataOnly: false,
        syncOnReconnect: true,
        offlineQueueSize: 100,
        dataRetention: 30
      },
      securitySettings: {
        encryptionEnabled: true,
        biometricAuth: true,
        pinAuth: true,
        twoFactorAuth: false,
        sessionTimeout: 30,
        dataEncryption: 'aes256',
        keyRotation: true,
        secureStorage: true,
        auditLogging: true
      },
      performanceSettings: {
        maxMemoryUsage: 512,
        maxCpuUsage: 80,
        cacheSize: 100,
        imageCompression: 80,
        videoCompression: 70,
        lazyLoading: true,
        backgroundThrottling: true,
        adaptiveQuality: true
      }
    };
  }

  private getDefaultCapabilities(platform: string): DeviceCapabilities {
    return {
      storage: platform === 'ios' ? 64000 : 128000, // MB
      memory: platform === 'ios' ? 6000 : 8000, // MB
      cpuCores: platform === 'ios' ? 6 : 8,
      camera: true,
      microphone: true,
      gps: true,
      biometric: platform === 'ios' ? true : false,
      notifications: true,
      backgroundMode: true,
      networkType: 'wifi',
      networkSpeed: 50
    };
  }

  private getDefaultPreferences(): DevicePreferences {
    return {
      language: 'en',
      timezone: 'UTC',
      theme: 'auto',
      fontSize: 'medium',
      notifications: true,
      autoSync: true,
      offlineMode: false,
      dataUsage: 'wifi_only'
    };
  }

  private async addToOfflineQueue(deviceId: string, operation: OfflineOperation): Promise<void> {
    let queue = this.offlineQueues.get(deviceId);
    
    if (!queue) {
      queue = {
        id: `queue-${deviceId}`,
        deviceId,
        operations: [],
        timestamp: new Date(),
        size: 0,
        status: 'pending'
      };
      this.offlineQueues.set(deviceId, queue);
    }

    queue.operations.push(operation);
    queue.size += JSON.stringify(operation.data).length;
    queue.timestamp = new Date();
  }

  private async cacheEssentialData(deviceId: string): Promise<void> {
    // Cache essential data for offline use
    const device = this.devices.get(deviceId);
    if (!device) return;

    // Cache user projects, characters, and settings
    await this.offlineEngine.cacheData(deviceId, 'projects', []);
    await this.offlineEngine.cacheData(deviceId, 'characters', []);
    await this.offlineEngine.cacheData(deviceId, 'settings', {});
  }
}

// Supporting classes
class SyncEngine {
  public async performSync(operation: SyncOperation, data?: any): Promise<{ success: boolean; error?: string }> {
    // Simulate sync operation
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate 90% success rate
        const success = Math.random() > 0.1;
        resolve({
          success,
          error: success ? undefined : 'Network error during sync'
        });
      }, 2000 + Math.random() * 3000);
    });
  }
}

class OfflineEngine {
  private caches: Map<string, Map<string, any>> = new Map();

  public async initialize(deviceId: string, settings: OfflineSettings): Promise<boolean> {
    // Initialize offline storage
    this.caches.set(deviceId, new Map());
    return true;
  }

  public async cacheData(deviceId: string, type: string, data: any): Promise<void> {
    const cache = this.caches.get(deviceId);
    if (cache) {
      cache.set(type, data);
    }
  }

  public async getCachedData(deviceId: string, type: string): Promise<any> {
    const cache = this.caches.get(deviceId);
    return cache?.get(type);
  }
}

class PushEngine {
  private devices: Map<string, string> = new Map();

  public async registerDevice(deviceId: string, pushToken: string, preferences: any): Promise<boolean> {
    this.devices.set(deviceId, pushToken);
    return true;
  }

  public async sendNotification(pushToken: string, notification: PushNotification): Promise<boolean> {
    // Simulate push notification
    console.log(`Sending push notification to ${pushToken}:`, notification);
    return true;
  }
}

class PerformanceEngine {
  public async getCurrentMetrics(): Promise<PerformanceMetrics> {
    return {
      appStartupTime: 1500 + Math.random() * 1000,
      memoryUsage: 200 + Math.random() * 300,
      cpuUsage: 20 + Math.random() * 60,
      networkLatency: 50 + Math.random() * 200,
      renderTime: 16 + Math.random() * 32,
      cacheHitRate: 70 + Math.random() * 25,
      batteryLevel: 80 + Math.random() * 20
    };
  }
}

export default MobileAppIntegrationService;
export type {
  MobileAppConfig,
  AppFeatures,
  SyncSettings,
  OfflineSettings,
  SecuritySettings,
  PerformanceSettings,
  MobileDevice,
  DeviceCapabilities,
  DevicePreferences,
  SyncOperation,
  OfflineQueue,
  OfflineOperation,
  PushNotification,
  NotificationAction,
  AppAnalytics,
  UserAction,
  PerformanceMetrics,
  AppError,
  NetworkUsage,
  BatteryUsage
};
