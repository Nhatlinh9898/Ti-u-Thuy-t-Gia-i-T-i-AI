import React, { useState, useEffect } from 'react';
import { Brain, Zap, Shield, Settings, BarChart3, Users, Globe, Lock, Cpu, Cloud, Database } from 'lucide-react';
import UltimateAIService from '../services/ultimateAIService';
import MultiModalAIService from '../services/multiModalAIService';
import AITrainingPipeline from '../services/aiTrainingPipeline';
import BlockchainAIService from '../services/blockchainAIService';

interface UltimateAIPanelProps {
  onConfigChange?: (config: any) => void;
}

const UltimateAIPanel: React.FC<UltimateAIPanelProps> = ({ onConfigChange }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'providers' | 'features' | 'performance' | 'advanced'>('overview');
  const [config, setConfig] = useState({
    providers: {
      local: { enabled: true, priority: 1, models: ['llama-3.2', 'qwen-2.5'] },
      cloud: { enabled: true, priority: 2, apis: ['gemini', 'openai', 'groq'] },
      hybrid: { enabled: true, priority: 3, strategy: 'adaptive' }
    },
    features: {
      aiWritingAssistant: true,
      advancedAnalytics: true,
      personalizedModels: false,
      blockchainIntegration: false,
      multiModalGeneration: false,
      aiTrainingPipeline: false,
      enterpriseFeatures: false
    },
    performance: {
      mode: 'balanced',
      local: { temperature: 0.8, maxTokens: 500, contextWindow: 2000, webGPU: true },
      cloud: { temperature: 0.6, maxTokens: 1000, contextWindow: 4000 },
      hybrid: { temperature: 0.7, maxTokens: 750, contextWindow: 3000 }
    }
  });

  const [metrics, setMetrics] = useState({
    totalRequests: 0,
    averageResponseTime: 0,
    successRate: 100,
    costEfficiency: 0,
    providerUsage: {
      local: 0,
      cloud: 0,
      hybrid: 0,
      ultimate: 0
    }
  });

  const [services, setServices] = useState({
    ultimateAI: null as any,
    multiModalAI: null as any,
    trainingPipeline: null as any,
    blockchainAI: null as any
  });

  useEffect(() => {
    // Initialize services
    try {
      const ultimateAI = new UltimateAIService(config);
      const multiModalAI = new MultiModalAIService();
      const trainingPipeline = new AITrainingPipeline();
      const blockchainAI = new BlockchainAIService();

      setServices({
        ultimateAI,
        multiModalAI,
        trainingPipeline,
        blockchainAI
      });

      // Load metrics
      loadMetrics();
    } catch (error) {
      console.error('Failed to initialize Ultimate AI services:', error);
    }
  }, []);

  const loadMetrics = async () => {
    try {
      // Mock metrics - in real implementation, get from services
      setMetrics({
        totalRequests: Math.floor(Math.random() * 1000) + 100,
        averageResponseTime: Math.random() * 2 + 0.5,
        successRate: 95 + Math.random() * 5,
        costEfficiency: 80 + Math.random() * 20,
        providerUsage: {
          local: Math.floor(Math.random() * 40) + 20,
          cloud: Math.floor(Math.random() * 30) + 10,
          hybrid: Math.floor(Math.random() * 30) + 10,
          ultimate: Math.floor(Math.random() * 20) + 5
        }
      });
    } catch (error) {
      console.error('Failed to load metrics:', error);
    }
  };

  const handleConfigUpdate = (newConfig: any) => {
    setConfig(newConfig);
    onConfigChange?.(newConfig);
  };

  const toggleProvider = (provider: string) => {
    const newConfig = {
      ...config,
      providers: {
        ...config.providers,
        [provider]: {
          ...config.providers[provider as keyof typeof config.providers],
          enabled: !config.providers[provider as keyof typeof config.providers].enabled
        }
      }
    };
    handleConfigUpdate(newConfig);
  };

  const toggleFeature = (feature: string) => {
    const newConfig = {
      ...config,
      features: {
        ...config.features,
        [feature]: !config.features[feature as keyof typeof config.features]
      }
    };
    handleConfigUpdate(newConfig);
  };

  const setPerformanceMode = (mode: string) => {
    const newConfig = {
      ...config,
      performance: {
        ...config.performance,
        mode
      }
    };
    handleConfigUpdate(newConfig);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Requests</p>
              <p className="text-2xl font-bold">{metrics.totalRequests}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Avg Response Time</p>
              <p className="text-2xl font-bold">{metrics.averageResponseTime.toFixed(2)}s</p>
            </div>
            <Zap className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Success Rate</p>
              <p className="text-2xl font-bold">{metrics.successRate.toFixed(1)}%</p>
            </div>
            <Shield className="w-8 h-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Cost Efficiency</p>
              <p className="text-2xl font-bold">{metrics.costEfficiency.toFixed(0)}%</p>
            </div>
            <Database className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Provider Usage</h3>
        <div className="space-y-3">
          {Object.entries(metrics.providerUsage).map(([provider, usage]) => (
            <div key={provider} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {provider === 'local' && <Cpu className="w-4 h-4 text-blue-500" />}
                {provider === 'cloud' && <Cloud className="w-4 h-4 text-green-500" />}
                {provider === 'hybrid' && <Zap className="w-4 h-4 text-purple-500" />}
                {provider === 'ultimate' && <Brain className="w-4 h-4 text-orange-500" />}
                <span className="capitalize">{provider}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${usage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600">{usage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProviders = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Cpu className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold">Local AI</h3>
            </div>
            <button
              onClick={() => toggleProvider('local')}
              className={`px-3 py-1 rounded-full text-sm ${
                config.providers.local.enabled
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {config.providers.local.enabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Priority:</span>
              <span className="font-medium">{config.providers.local.priority}</span>
            </div>
            <div className="flex justify-between">
              <span>Models:</span>
              <span className="font-medium">{config.providers.local.models.length}</span>
            </div>
            <div className="flex justify-between">
              <span>WebGPU:</span>
              <span className="font-medium">{config.performance.local.webGPU ? 'Enabled' : 'Disabled'}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Cloud className="w-5 h-5 text-green-500" />
              <h3 className="font-semibold">Cloud AI</h3>
            </div>
            <button
              onClick={() => toggleProvider('cloud')}
              className={`px-3 py-1 rounded-full text-sm ${
                config.providers.cloud.enabled
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {config.providers.cloud.enabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Priority:</span>
              <span className="font-medium">{config.providers.cloud.priority}</span>
            </div>
            <div className="flex justify-between">
              <span>APIs:</span>
              <span className="font-medium">{config.providers.cloud.apis.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Max Tokens:</span>
              <span className="font-medium">{config.performance.cloud.maxTokens}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-purple-500" />
              <h3 className="font-semibold">Hybrid AI</h3>
            </div>
            <button
              onClick={() => toggleProvider('hybrid')}
              className={`px-3 py-1 rounded-full text-sm ${
                config.providers.hybrid.enabled
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {config.providers.hybrid.enabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Priority:</span>
              <span className="font-medium">{config.providers.hybrid.priority}</span>
            </div>
            <div className="flex justify-between">
              <span>Strategy:</span>
              <span className="font-medium">{config.providers.hybrid.strategy}</span>
            </div>
            <div className="flex justify-between">
              <span>Max Tokens:</span>
              <span className="font-medium">{config.performance.hybrid.maxTokens}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFeatures = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(config.features).map(([feature, enabled]) => (
          <div key={feature} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {feature === 'aiWritingAssistant' && <Brain className="w-4 h-4 text-blue-500" />}
                {feature === 'advancedAnalytics' && <BarChart3 className="w-4 h-4 text-green-500" />}
                {feature === 'personalizedModels' && <Users className="w-4 h-4 text-purple-500" />}
                {feature === 'blockchainIntegration' && <Lock className="w-4 h-4 text-orange-500" />}
                {feature === 'multiModalGeneration' && <Globe className="w-4 h-4 text-red-500" />}
                {feature === 'aiTrainingPipeline' && <Settings className="w-4 h-4 text-indigo-500" />}
                {feature === 'enterpriseFeatures' && <Shield className="w-4 h-4 text-gray-500" />}
                <span className="text-sm font-medium capitalize">
                  {feature.replace(/([A-Z])/g, ' $1').trim()}
                </span>
              </div>
              <button
                onClick={() => toggleFeature(feature)}
                className={`px-2 py-1 rounded text-xs ${
                  enabled
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {enabled ? 'On' : 'Off'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPerformance = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Performance Mode</h3>
        <div className="grid grid-cols-3 gap-4">
          {['speed', 'quality', 'balanced'].map((mode) => (
            <button
              key={mode}
              onClick={() => setPerformanceMode(mode)}
              className={`p-4 rounded-lg border-2 transition-all ${
                config.performance.mode === mode
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <p className="font-medium capitalize">{mode}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {mode === 'speed' && 'Fastest response'}
                  {mode === 'quality' && 'Best quality'}
                  {mode === 'balanced' && 'Optimal mix'}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="font-semibold mb-3">Local AI</h4>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-600">Temperature</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={config.performance.local.temperature}
                onChange={(e) => {
                  const newConfig = {
                    ...config,
                    performance: {
                      ...config.performance,
                      local: {
                        ...config.performance.local,
                        temperature: parseFloat(e.target.value)
                      }
                    }
                  };
                  handleConfigUpdate(newConfig);
                }}
                className="w-full"
              />
              <span className="text-sm">{config.performance.local.temperature}</span>
            </div>
            <div>
              <label className="text-sm text-gray-600">Max Tokens</label>
              <input
                type="number"
                value={config.performance.local.maxTokens}
                onChange={(e) => {
                  const newConfig = {
                    ...config,
                    performance: {
                      ...config.performance,
                      local: {
                        ...config.performance.local,
                        maxTokens: parseInt(e.target.value)
                      }
                    }
                  };
                  handleConfigUpdate(newConfig);
                }}
                className="w-full px-2 py-1 border rounded"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="font-semibold mb-3">Cloud AI</h4>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-600">Temperature</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={config.performance.cloud.temperature}
                onChange={(e) => {
                  const newConfig = {
                    ...config,
                    performance: {
                      ...config.performance,
                      cloud: {
                        ...config.performance.cloud,
                        temperature: parseFloat(e.target.value)
                      }
                    }
                  };
                  handleConfigUpdate(newConfig);
                }}
                className="w-full"
              />
              <span className="text-sm">{config.performance.cloud.temperature}</span>
            </div>
            <div>
              <label className="text-sm text-gray-600">Max Tokens</label>
              <input
                type="number"
                value={config.performance.cloud.maxTokens}
                onChange={(e) => {
                  const newConfig = {
                    ...config,
                    performance: {
                      ...config.performance,
                      cloud: {
                        ...config.performance.cloud,
                        maxTokens: parseInt(e.target.value)
                      }
                    }
                  };
                  handleConfigUpdate(newConfig);
                }}
                className="w-full px-2 py-1 border rounded"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="font-semibold mb-3">Hybrid AI</h4>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-600">Temperature</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={config.performance.hybrid.temperature}
                onChange={(e) => {
                  const newConfig = {
                    ...config,
                    performance: {
                      ...config.performance,
                      hybrid: {
                        ...config.performance.hybrid,
                        temperature: parseFloat(e.target.value)
                      }
                    }
                  };
                  handleConfigUpdate(newConfig);
                }}
                className="w-full"
              />
              <span className="text-sm">{config.performance.hybrid.temperature}</span>
            </div>
            <div>
              <label className="text-sm text-gray-600">Max Tokens</label>
              <input
                type="number"
                value={config.performance.hybrid.maxTokens}
                onChange={(e) => {
                  const newConfig = {
                    ...config,
                    performance: {
                      ...config.performance,
                      hybrid: {
                        ...config.performance.hybrid,
                        maxTokens: parseInt(e.target.value)
                      }
                    }
                  };
                  handleConfigUpdate(newConfig);
                }}
                className="w-full px-2 py-1 border rounded"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAdvanced = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Advanced Settings</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Service Status</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Ultimate AI Service</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Multi-Modal AI</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">AI Training Pipeline</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Blockchain AI</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Configuration Export</h4>
            <button
              onClick={() => {
                const configBlob = new Blob([JSON.stringify(config, null, 2)], {
                  type: 'application/json'
                });
                const url = URL.createObjectURL(configBlob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'ultimate-ai-config.json';
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Export Configuration
            </button>
          </div>

          <div>
            <h4 className="font-medium mb-2">Reset to Defaults</h4>
            <button
              onClick={() => {
                const defaultConfig = {
                  providers: {
                    local: { enabled: true, priority: 1, models: ['llama-3.2', 'qwen-2.5'] },
                    cloud: { enabled: true, priority: 2, apis: ['gemini', 'openai', 'groq'] },
                    hybrid: { enabled: true, priority: 3, strategy: 'adaptive' }
                  },
                  features: {
                    aiWritingAssistant: true,
                    advancedAnalytics: true,
                    personalizedModels: false,
                    blockchainIntegration: false,
                    multiModalGeneration: false,
                    aiTrainingPipeline: false,
                    enterpriseFeatures: false
                  },
                  performance: {
                    mode: 'balanced',
                    local: { temperature: 0.8, maxTokens: 500, contextWindow: 2000, webGPU: true },
                    cloud: { temperature: 0.6, maxTokens: 1000, contextWindow: 4000 },
                    hybrid: { temperature: 0.7, maxTokens: 750, contextWindow: 3000 }
                  }
                };
                handleConfigUpdate(defaultConfig);
              }}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Reset to Defaults
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <Brain className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-bold">Ultimate AI Control Panel</h2>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">System Status:</span>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-green-600">Online</span>
          </div>
        </div>

        <div className="flex space-x-1 px-4">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'providers', label: 'Providers', icon: Cpu },
            { id: 'features', label: 'Features', icon: Settings },
            { id: 'performance', label: 'Performance', icon: Zap },
            { id: 'advanced', label: 'Advanced', icon: Shield }
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

      <div className="p-6">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'providers' && renderProviders()}
        {activeTab === 'features' && renderFeatures()}
        {activeTab === 'performance' && renderPerformance()}
        {activeTab === 'advanced' && renderAdvanced()}
      </div>
    </div>
  );
};

export default UltimateAIPanel;
