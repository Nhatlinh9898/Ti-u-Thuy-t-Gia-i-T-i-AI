import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  Wifi, 
  WifiOff, 
  Cloud, 
  CloudOff, 
  Sync, 
  Settings, 
  Bell, 
  Shield, 
  Battery, 
  Activity, 
  Download, 
  Upload, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Users, 
  Globe, 
  Lock, 
  Unlock, 
  Smartphone as PhoneIcon,
  RefreshCw,
  BarChart3,
  Cpu,
  HardDrive,
  Zap,
  Database,
  Server,
  Trash2,
  Edit,
  Save,
  Plus,
  X,
  ChevronRight,
  ChevronDown,
  Eye,
  EyeOff
} from 'lucide-react';
import MobileAppIntegrationService from '../services/mobileAppIntegrationService';

interface MobileAppPanelProps {
  onDeviceRegistered?: (device: any) => void;
  onSyncCompleted?: (sync: any) => void;
}

const MobileAppPanel: React.FC<MobileAppPanelProps> = ({ 
  onDeviceRegistered,
  onSyncCompleted
}) => {
  const [mobileService] = useState(() => new MobileAppIntegrationService());
  const [activeTab, setActiveTab] = useState<'devices' | 'sync' | 'offline' | 'notifications' | 'analytics'>('devices');
  const [devices, setDevices] = useState<any[]>([]);
  const [syncOperations, setSyncOperations] = useState<any[]>([]);
  const [offlineQueues, setOfflineQueues] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any[]>([]);

  // Device registration form
  const [deviceForm, setDeviceForm] = useState({
    platform: 'ios' as 'ios' | 'android' | 'web' | 'desktop',
    deviceId: '',
    deviceName: '',
    osVersion: '',
    pushToken: '',
    preferences: {
      language: 'en',
      timezone: 'UTC',
      theme: 'auto' as 'light' | 'dark' | 'auto',
      fontSize: 'medium' as 'small' | 'medium' | 'large',
      notifications: true,
      autoSync: true,
      offlineMode: false,
      dataUsage: 'wifi_only' as 'wifi_only' | 'wifi_and_cellular' | 'offline_only'
    }
  });

  // Sync settings
  const [syncSettings, setSyncSettings] = useState({
    autoSync: true,
    syncInterval: 30,
    syncOnWifi: true,
    syncOnCellular: false,
    conflictResolution: 'merge' as 'client_wins' | 'server_wins' | 'manual' | 'merge',
    maxRetries: 3,
    batchSize: 10,
    compressionEnabled: true,
    encryptionEnabled: true
  });

  // Offline settings
  const [offlineSettings, setOfflineSettings] = useState({
    enabled: true,
    maxStorageSize: 500,
    cacheStrategy: 'lru' as 'lru' | 'fifo' | 'priority',
    autoCleanup: true,
    cleanupInterval: 24,
    essentialDataOnly: false,
    syncOnReconnect: true,
    offlineQueueSize: 100,
    dataRetention: 30
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setDevices(mobileService.getDevices() || []);
    setSyncOperations(mobileService.getSyncOperations());
    setAnalytics(mobileService.getAnalytics());
  };

  const handleRegisterDevice = async () => {
    try {
      const config = await mobileService.initializeMobileApp(
        deviceForm.platform,
        'user123',
        {
          deviceId: deviceForm.deviceId,
          deviceName: deviceForm.deviceName,
          osVersion: deviceForm.osVersion,
          pushToken: deviceForm.pushToken,
          preferences: deviceForm.preferences
        }
      );

      if (deviceForm.pushToken) {
        await mobileService.registerDeviceForPush(
          config.id,
          deviceForm.pushToken,
          deviceForm.preferences
        );
      }

      loadData();
      onDeviceRegistered?.(config);

      // Reset form
      setDeviceForm({
        ...deviceForm,
        deviceId: '',
        deviceName: '',
        osVersion: '',
        pushToken: ''
      });

    } catch (error) {
      console.error('Failed to register device:', error);
    }
  };

  const handleStartSync = async (deviceId: string, dataType: string, operation: string, dataId: string) => {
    try {
      const sync = await mobileService.startSync(deviceId, dataType, operation as any, dataId);
      setSyncOperations([...syncOperations, sync]);
      onSyncCompleted?.(sync);
      loadData();
    } catch (error) {
      console.error('Failed to start sync:', error);
    }
  };

  const handleEnableOffline = async (deviceId: string) => {
    try {
      const enabled = await mobileService.enableOfflineMode(deviceId, offlineSettings);
      if (enabled) {
        loadData();
      }
    } catch (error) {
      console.error('Failed to enable offline mode:', error);
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'ios': return <Smartphone className="w-5 h-5 text-blue-500" />;
      case 'android': return <Smartphone className="w-5 h-5 text-green-500" />;
      case 'web': return <Monitor className="w-5 h-5 text-purple-500" />;
      case 'desktop': return <Monitor className="w-5 h-5 text-gray-500" />;
      default: return <Smartphone className="w-5 h-5 text-gray-500" />;
    }
  };

  const getSyncStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in_progress': return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'failed': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const renderDevices = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Device Management</h3>
        
        {/* Register Device Form */}
        <div className="border rounded-lg p-4 mb-6">
          <h4 className="font-medium mb-4">Register New Device</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
              <select
                value={deviceForm.platform}
                onChange={(e) => setDeviceForm({...deviceForm, platform: e.target.value as any})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ios">iOS</option>
                <option value="android">Android</option>
                <option value="web">Web</option>
                <option value="desktop">Desktop</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Device ID</label>
              <input
                type="text"
                value={deviceForm.deviceId}
                onChange={(e) => setDeviceForm({...deviceForm, deviceId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Unique device identifier"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Device Name</label>
              <input
                type="text"
                value={deviceForm.deviceName}
                onChange={(e) => setDeviceForm({...deviceForm, deviceName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Device display name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">OS Version</label>
              <input
                type="text"
                value={deviceForm.osVersion}
                onChange={(e) => setDeviceForm({...deviceForm, osVersion: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Operating system version"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Push Token (Optional)</label>
            <input
              type="text"
              value={deviceForm.pushToken}
              onChange={(e) => setDeviceForm({...deviceForm, pushToken: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Push notification token"
            />
          </div>

          <button
            onClick={handleRegisterDevice}
            disabled={!deviceForm.deviceId || !deviceForm.deviceName}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Register Device</span>
          </button>
        </div>

        {/* Devices List */}
        <div className="space-y-4">
          <h4 className="font-medium mb-4">Registered Devices</h4>
          {devices.map((device) => (
            <div key={device.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getPlatformIcon(device.deviceType)}
                  <div>
                    <h5 className="font-medium">{device.deviceName}</h5>
                    <p className="text-sm text-gray-600">{device.osVersion}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-500">ID: {device.deviceId}</span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className={`text-xs px-2 py-1 rounded ${device.isOnline ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {device.isOnline ? 'Online' : 'Offline'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-500 hover:text-blue-500">
                    <Settings className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <HardDrive className="w-4 h-4 text-gray-500" />
                  <span>{device.capabilities?.storage || 'N/A'} GB</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Cpu className="w-4 h-4 text-gray-500" />
                  <span>{device.capabilities?.cpuCores || 'N/A'} cores</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Wifi className="w-4 h-4 text-gray-500" />
                  <span>{device.capabilities?.networkType || 'N/A'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Battery className="w-4 h-4 text-gray-500" />
                  <span>{device.capabilities?.biometric ? 'Biometric' : 'No Biometric'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSync = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Sync Management</h3>
        
        {/* Sync Settings */}
        <div className="border rounded-lg p-4 mb-6">
          <h4 className="font-medium mb-4">Sync Settings</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={syncSettings.autoSync}
                  onChange={(e) => setSyncSettings({...syncSettings, autoSync: e.target.checked})}
                  className="rounded"
                />
                <span className="text-sm">Auto Sync</span>
              </label>
            </div>
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={syncSettings.syncOnWifi}
                  onChange={(e) => setSyncSettings({...syncSettings, syncOnWifi: e.target.checked})}
                  className="rounded"
                />
                <span className="text-sm">Sync on WiFi Only</span>
              </label>
            </div>
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={syncSettings.compressionEnabled}
                  onChange={(e) => setSyncSettings({...syncSettings, compressionEnabled: e.target.checked})}
                  className="rounded"
                />
                <span className="text-sm">Enable Compression</span>
              </label>
            </div>
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={syncSettings.encryptionEnabled}
                  onChange={(e) => setSyncSettings({...syncSettings, encryptionEnabled: e.target.checked})}
                  className="rounded"
                />
                <span className="text-sm">Enable Encryption</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sync Interval (minutes)</label>
              <input
                type="number"
                value={syncSettings.syncInterval}
                onChange={(e) => setSyncSettings({...syncSettings, syncInterval: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                max="1440"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Retries</label>
              <input
                type="number"
                value={syncSettings.maxRetries}
                onChange={(e) => setSyncSettings({...syncSettings, maxRetries: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                max="10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Batch Size</label>
              <input
                type="number"
                value={syncSettings.batchSize}
                onChange={(e) => setSyncSettings({...syncSettings, batchSize: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                max="100"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Conflict Resolution</label>
            <select
              value={syncSettings.conflictResolution}
              onChange={(e) => setSyncSettings({...syncSettings, conflictResolution: e.target.value as any})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="client_wins">Client Wins</option>
              <option value="server_wins">Server Wins</option>
              <option value="manual">Manual Resolution</option>
              <option value="merge">Auto Merge</option>
            </select>
          </div>

          <button className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center justify-center space-x-2">
            <Save className="w-4 h-4" />
            <span>Save Sync Settings</span>
          </button>
        </div>

        {/* Sync Operations */}
        <div className="space-y-4">
          <h4 className="font-medium mb-4">Recent Sync Operations</h4>
          {syncOperations.slice(0, 10).map((sync) => (
            <div key={sync.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getSyncStatusIcon(sync.status)}
                  <div>
                    <h5 className="font-medium">{sync.operation.toUpperCase()} {sync.dataType}</h5>
                    <p className="text-sm text-gray-600">{sync.dataId}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-500">
                        {new Date(sync.timestamp).toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-500">
                        {sync.fileSize ? `${(sync.fileSize / 1024).toFixed(1)} KB` : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <div className="font-medium">{sync.progress}%</div>
                    <div className="text-xs text-gray-500">Progress</div>
                  </div>
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${sync.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {sync.error && (
                <div className="mt-2 p-2 bg-red-50 text-red-700 rounded text-sm">
                  Error: {sync.error}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderOffline = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Offline Mode</h3>
        
        {/* Offline Settings */}
        <div className="border rounded-lg p-4 mb-6">
          <h4 className="font-medium mb-4">Offline Settings</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={offlineSettings.enabled}
                  onChange={(e) => setOfflineSettings({...offlineSettings, enabled: e.target.checked})}
                  className="rounded"
                />
                <span className="text-sm">Enable Offline Mode</span>
              </label>
            </div>
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={offlineSettings.autoCleanup}
                  onChange={(e) => setOfflineSettings({...offlineSettings, autoCleanup: e.target.checked})}
                  className="rounded"
                />
                <span className="text-sm">Auto Cleanup</span>
              </label>
            </div>
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={offlineSettings.essentialDataOnly}
                  onChange={(e) => setOfflineSettings({...offlineSettings, essentialDataOnly: e.target.checked})}
                  className="rounded"
                />
                <span className="text-sm">Essential Data Only</span>
              </label>
            </div>
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={offlineSettings.syncOnReconnect}
                  onChange={(e) => setOfflineSettings({...offlineSettings, syncOnReconnect: e.target.checked})}
                  className="rounded"
                />
                <span className="text-sm">Sync on Reconnect</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Storage (MB)</label>
              <input
                type="number"
                value={offlineSettings.maxStorageSize}
                onChange={(e) => setOfflineSettings({...offlineSettings, maxStorageSize: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="100"
                max="2000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cleanup Interval (hours)</label>
              <input
                type="number"
                value={offlineSettings.cleanupInterval}
                onChange={(e) => setOfflineSettings({...offlineSettings, cleanupInterval: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                max="168"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Data Retention (days)</label>
              <input
                type="number"
                value={offlineSettings.dataRetention}
                onChange={(e) => setOfflineSettings({...offlineSettings, dataRetention: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                max="365"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Cache Strategy</label>
            <select
              value={offlineSettings.cacheStrategy}
              onChange={(e) => setOfflineSettings({...offlineSettings, cacheStrategy: e.target.value as any})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="lru">LRU (Least Recently Used)</option>
              <option value="fifo">FIFO (First In, First Out)</option>
              <option value="priority">Priority Based</option>
            </select>
          </div>

          <button className="w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 flex items-center justify-center space-x-2">
            <Save className="w-4 h-4" />
            <span>Save Offline Settings</span>
          </button>
        </div>

        {/* Offline Queues */}
        <div className="space-y-4">
          <h4 className="font-medium mb-4">Offline Queues</h4>
          {devices.map((device) => {
            const queue = mobileService.getOfflineQueue(device.id);
            if (!queue || queue.operations.length === 0) return null;

            return (
              <div key={device.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <WifiOff className="w-5 h-5 text-orange-500" />
                    <div>
                      <h5 className="font-medium">{device.deviceName}</h5>
                      <p className="text-sm text-gray-600">{queue.operations.length} pending operations</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-500">
                          Size: {(queue.size / 1024).toFixed(1)} KB
                        </span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          queue.status === 'completed' ? 'bg-green-100 text-green-700' :
                          queue.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {queue.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleEnableOffline(device.id)}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 flex items-center space-x-1"
                  >
                    <Cloud className="w-3 h-3" />
                    <span>Process Queue</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Push Notifications</h3>
        
        <div className="space-y-4">
          <h4 className="font-medium mb-4">Recent Notifications</h4>
          {notifications.slice(0, 10).map((notification) => (
            <div key={notification.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Bell className={`w-5 h-5 ${
                    notification.priority === 'urgent' ? 'text-red-500' :
                    notification.priority === 'high' ? 'text-orange-500' :
                    notification.priority === 'medium' ? 'text-blue-500' :
                    'text-gray-500'
                  }`} />
                  <div>
                    <h5 className="font-medium">{notification.title}</h5>
                    <p className="text-sm text-gray-600">{notification.message}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-500">
                        {new Date(notification.timestamp).toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        notification.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                        notification.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                        notification.priority === 'medium' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {notification.priority}
                      </span>
                      {!notification.read && (
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">Unread</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-500 hover:text-blue-500">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">App Analytics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Smartphone className="w-8 h-8 text-blue-500" />
              <span className="text-2xl font-bold text-blue-600">{devices.length}</span>
            </div>
            <div className="text-sm text-gray-600">Total Devices</div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Sync className="w-8 h-8 text-green-500" />
              <span className="text-2xl font-bold text-green-600">
                {syncOperations.filter(s => s.status === 'completed').length}
              </span>
            </div>
            <div className="text-sm text-gray-600">Completed Syncs</div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-8 h-8 text-purple-500" />
              <span className="text-2xl font-bold text-purple-600">{analytics.length}</span>
            </div>
            <div className="text-sm text-gray-600">Active Sessions</div>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="w-8 h-8 text-orange-500" />
              <span className="text-2xl font-bold text-orange-600">
                {notifications.filter(n => !n.read).length}
              </span>
            </div>
            <div className="text-sm text-gray-600">Unread Notifications</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-4">Device Performance</h4>
            <div className="space-y-3">
              {devices.map((device) => {
                const deviceAnalytics = analytics.filter(a => a.deviceId === device.id);
                const avgPerformance = deviceAnalytics.length > 0 
                  ? deviceAnalytics.reduce((acc, a) => acc + a.performance.appStartupTime, 0) / deviceAnalytics.length 
                  : 0;
                
                return (
                  <div key={device.id} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center space-x-3">
                      {getPlatformIcon(device.deviceType)}
                      <div>
                        <div className="font-medium">{device.deviceName}</div>
                        <div className="text-sm text-gray-500">{deviceAnalytics.length} sessions</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{avgPerformance.toFixed(0)}ms</div>
                      <div className="text-xs text-gray-500">Avg Startup</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-4">Recent Activity</h4>
            <div className="space-y-3">
              {analytics
                .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
                .slice(0, 5)
                .map((session) => (
                  <div key={session.sessionId} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <div>
                        <div className="font-medium">{session.deviceId}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(session.startTime).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{session.actions.length}</div>
                      <div className="text-xs text-gray-500">Actions</div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg h-full flex flex-col">
      <div className="border-b border-gray-200">
        <div className="flex items-center p-4">
          <Smartphone className="w-6 h-6 text-blue-500 mr-2" />
          <h2 className="text-xl font-bold">Mobile App Integration</h2>
        </div>

        <div className="flex space-x-1 px-4">
          {[
            { id: 'devices', label: 'Devices', icon: Smartphone },
            { id: 'sync', label: 'Sync', icon: Sync },
            { id: 'offline', label: 'Offline', icon: WifiOff },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        {activeTab === 'devices' && renderDevices()}
        {activeTab === 'sync' && renderSync()}
        {activeTab === 'offline' && renderOffline()}
        {activeTab === 'notifications' && renderNotifications()}
        {activeTab === 'analytics' && renderAnalytics()}
      </div>
    </div>
  );
};

export default MobileAppPanel;
