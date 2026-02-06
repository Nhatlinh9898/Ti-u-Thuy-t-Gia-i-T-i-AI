import React, { useState, useEffect } from 'react';
import { Brain, Settings, Play, Download, BarChart3, User, Clock, Target, TrendingUp } from 'lucide-react';
import AITrainingPipeline from '../services/aiTrainingPipeline';
import { NovelNode } from '../types';

interface TrainingPanelProps {
  userData?: NovelNode[];
  userId?: string;
  onTrainingComplete?: (result: any) => void;
}

const TrainingPanel: React.FC<TrainingPanelProps> = ({ 
  userData = [], 
  userId = 'default-user',
  onTrainingComplete 
}) => {
  const [config, setConfig] = useState({
    enabled: true,
    method: 'lora',
    dataPrivacy: true,
    trainingDataSize: 100,
    maxEpochs: 10,
    learningRate: 0.001,
    batchSize: 32,
    validationSplit: 0.2,
    styleAdaptation: {
      enabled: true,
      adaptationSpeed: 0.5,
      minSamples: 50,
      styleFeatures: ['vocabulary', 'sentence-structure', 'tone', 'complexity']
    },
    modelManagement: {
      saveTrainedModels: true,
      modelVersioning: true,
      autoBackup: true,
      compressionEnabled: true
    },
    performance: {
      useGPU: false,
      memoryLimit: 4,
      timeoutMinutes: 30,
      parallelTraining: false
    }
  });

  const [service, setService] = useState<AITrainingPipeline | null>(null);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [trainingResult, setTrainingResult] = useState<any>(null);
  const [styleProfile, setStyleProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'config' | 'profile' | 'results'>('config');

  useEffect(() => {
    const trainingService = new AITrainingPipeline(config);
    setService(trainingService);
    
    // Load existing style profile
    const existingProfile = trainingService.getStyleProfile(userId);
    if (existingProfile) {
      setStyleProfile(existingProfile);
    }
  }, [userId]);

  const handleStartTraining = async () => {
    if (!service || userData.length === 0) return;

    setIsTraining(true);
    setTrainingProgress(0);

    try {
      // Simulate training progress
      const progressInterval = setInterval(() => {
        setTrainingProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + Math.random() * 10;
        });
      }, 1000);

      const result = await service.trainModel(userId, userData);
      
      clearInterval(progressInterval);
      setTrainingProgress(100);
      setTrainingResult(result);
      onTrainingComplete?.(result);
      
      // Update style profile
      const updatedProfile = service.getStyleProfile(userId);
      if (updatedProfile) {
        setStyleProfile(updatedProfile);
      }
    } catch (error) {
      console.error('Training failed:', error);
    } finally {
      setIsTraining(false);
    }
  };

  const updateConfig = (key: string, value: any) => {
    const newConfig = { ...config };
    const keys = key.split('.');
    let current: any = newConfig;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
    setConfig(newConfig);
    
    if (service) {
      service.updateConfig(newConfig);
    }
  };

  const renderConfig = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-4">Training Configuration</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">Training Method</label>
              <select
                value={config.method}
                onChange={(e) => updateConfig('method', e.target.value)}
                className="w-full px-2 py-1 border rounded"
              >
                <option value="lora">LoRA (Recommended)</option>
                <option value="qlora">QLoRA (Memory Efficient)</option>
                <option value="full">Full Fine-tuning</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-600">Max Epochs</label>
              <input
                type="number"
                value={config.maxEpochs}
                onChange={(e) => updateConfig('maxEpochs', parseInt(e.target.value))}
                className="w-full px-2 py-1 border rounded"
                min="1"
                max="100"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Learning Rate</label>
              <input
                type="number"
                value={config.learningRate}
                onChange={(e) => updateConfig('learningRate', parseFloat(e.target.value))}
                className="w-full px-2 py-1 border rounded"
                min="0.0001"
                max="0.1"
                step="0.0001"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Batch Size</label>
              <input
                type="number"
                value={config.batchSize}
                onChange={(e) => updateConfig('batchSize', parseInt(e.target.value))}
                className="w-full px-2 py-1 border rounded"
                min="1"
                max="128"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Validation Split</label>
              <input
                type="number"
                value={config.validationSplit}
                onChange={(e) => updateConfig('validationSplit', parseFloat(e.target.value))}
                className="w-full px-2 py-1 border rounded"
                min="0.1"
                max="0.5"
                step="0.1"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold mb-4">Style Adaptation</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Enable Style Adaptation</span>
              <button
                onClick={() => updateConfig('styleAdaptation.enabled', !config.styleAdaptation.enabled)}
                className={`px-3 py-1 rounded-full text-sm ${
                  config.styleAdaptation.enabled
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {config.styleAdaptation.enabled ? 'On' : 'Off'}
              </button>
            </div>

            {config.styleAdaptation.enabled && (
              <>
                <div>
                  <label className="text-sm text-gray-600">Adaptation Speed</label>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.1"
                    value={config.styleAdaptation.adaptationSpeed}
                    onChange={(e) => updateConfig('styleAdaptation.adaptationSpeed', parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-sm">{config.styleAdaptation.adaptationSpeed}</span>
                </div>

                <div>
                  <label className="text-sm text-gray-600">Minimum Samples</label>
                  <input
                    type="number"
                    value={config.styleAdaptation.minSamples}
                    onChange={(e) => updateConfig('styleAdaptation.minSamples', parseInt(e.target.value))}
                    className="w-full px-2 py-1 border rounded"
                    min="10"
                    max="1000"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Style Features</label>
                  <div className="space-y-2">
                    {['vocabulary', 'sentence-structure', 'tone', 'complexity'].map((feature) => (
                      <label key={feature} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={config.styleAdaptation.styleFeatures.includes(feature)}
                          onChange={(e) => {
                            const features = e.target.checked
                              ? [...config.styleAdaptation.styleFeatures, feature]
                              : config.styleAdaptation.styleFeatures.filter(f => f !== feature);
                            updateConfig('styleAdaptation.styleFeatures', features);
                          }}
                          className="rounded"
                        />
                        <span className="text-sm capitalize">{feature.replace('-', ' ')}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold mb-4">Performance Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Use GPU</span>
              <button
                onClick={() => updateConfig('performance.useGPU', !config.performance.useGPU)}
                className={`px-3 py-1 rounded-full text-sm ${
                  config.performance.useGPU
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {config.performance.useGPU ? 'On' : 'Off'}
              </button>
            </div>

            <div>
              <label className="text-sm text-gray-600">Memory Limit (GB)</label>
              <input
                type="number"
                value={config.performance.memoryLimit}
                onChange={(e) => updateConfig('performance.memoryLimit', parseInt(e.target.value))}
                className="w-full px-2 py-1 border rounded"
                min="1"
                max="32"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">Timeout (minutes)</label>
              <input
                type="number"
                value={config.performance.timeoutMinutes}
                onChange={(e) => updateConfig('performance.timeoutMinutes', parseInt(e.target.value))}
                className="w-full px-2 py-1 border rounded"
                min="5"
                max="120"
              />
            </div>

            <div className="flex items-center justify-between">
              <span>Parallel Training</span>
              <button
                onClick={() => updateConfig('performance.parallelTraining', !config.performance.parallelTraining)}
                className={`px-3 py-1 rounded-full text-sm ${
                  config.performance.parallelTraining
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {config.performance.parallelTraining ? 'On' : 'Off'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      {styleProfile ? (
        <>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-4">Writing Style Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Style Characteristics</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Vocabulary Size:</span>
                    <span className="font-medium">{styleProfile.writingStyle.vocabulary.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Sentence Patterns:</span>
                    <span className="font-medium">{styleProfile.writingStyle.sentencePatterns.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Tone:</span>
                    <span className="font-medium capitalize">{styleProfile.writingStyle.tone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Complexity:</span>
                    <span className="font-medium">{styleProfile.writingStyle.complexity.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Preferences</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Creativity:</span>
                    <span className="font-medium">{(styleProfile.preferences.creativity * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Formality:</span>
                    <span className="font-medium">{(styleProfile.preferences.formality * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Detail Level:</span>
                    <span className="font-medium">{(styleProfile.preferences.detailLevel * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Emotional Tone:</span>
                    <span className="font-medium capitalize">{styleProfile.preferences.emotionalTone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-4">Preferred Genres & Themes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Preferred Genres</h4>
                <div className="flex flex-wrap gap-2">
                  {styleProfile.writingStyle.preferredGenres.map((genre: string, index: number) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {genre}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Common Themes</h4>
                <div className="flex flex-wrap gap-2">
                  {styleProfile.writingStyle.commonThemes.slice(0, 5).map((theme: string, index: number) => (
                    <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      {theme}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-4">Adaptation History</h3>
            <div className="space-y-3">
              {styleProfile.adaptationHistory.slice(-5).reverse().map((entry: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">{entry.feedback}</p>
                      <p className="text-xs text-gray-600">
                        {new Date(entry.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{(entry.accuracy * 100).toFixed(1)}%</p>
                    <p className="text-xs text-gray-600">Accuracy</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No style profile available yet.</p>
          <p className="text-sm text-gray-500 mt-2">Start training to create your personalized AI model.</p>
        </div>
      )}
    </div>
  );

  const renderResults = () => (
    <div className="space-y-6">
      {trainingResult ? (
        <>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-4">Training Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <Target className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">{(trainingResult.accuracy * 100).toFixed(1)}%</p>
                <p className="text-sm text-gray-600">Accuracy</p>
              </div>
              
              <div className="text-center">
                <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">{trainingResult.loss.toFixed(4)}</p>
                <p className="text-sm text-gray-600">Loss</p>
              </div>
              
              <div className="text-center">
                <Clock className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">{(trainingResult.trainingTime / 1000).toFixed(1)}s</p>
                <p className="text-sm text-gray-600">Training Time</p>
              </div>
              
              <div className="text-center">
                <BarChart3 className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">{trainingResult.modelSize.toFixed(1)}MB</p>
                <p className="text-sm text-gray-600">Model Size</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-4">Model Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium mb-3">Vocabulary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Size:</span>
                    <span className="font-medium">{trainingResult.features.vocabularySize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Diversity:</span>
                    <span className="font-medium">High</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Style Accuracy</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Overall:</span>
                    <span className="font-medium">{(trainingResult.features.styleAccuracy * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Consistency:</span>
                    <span className="font-medium">{(trainingResult.features.styleAccuracy * 0.9 * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Adaptation</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Level:</span>
                    <span className="font-medium">{(trainingResult.features.adaptationLevel * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Speed:</span>
                    <span className="font-medium">Fast</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-4">Training Metadata</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Model ID:</span>
                  <span className="font-medium text-sm">{trainingResult.modelId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Trained At:</span>
                  <span className="font-medium">{new Date(trainingResult.metadata.trainedAt).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Training Data Size:</span>
                  <span className="font-medium">{trainingResult.metadata.trainingDataSize} samples</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Epochs:</span>
                  <span className="font-medium">{trainingResult.metadata.epochs}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Method:</span>
                  <span className="font-medium uppercase">{trainingResult.metadata.method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className="font-medium text-green-600">Completed</span>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No training results available yet.</p>
          <p className="text-sm text-gray-500 mt-2">Start training to see results here.</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <Brain className="w-6 h-6 text-indigo-500" />
            <h2 className="text-xl font-bold">AI Training Pipeline</h2>
          </div>
          <button
            onClick={handleStartTraining}
            disabled={isTraining || userData.length === 0}
            className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Play className="w-4 h-4" />
            <span>{isTraining ? 'Training...' : 'Start Training'}</span>
          </button>
        </div>

        <div className="flex space-x-1 px-4">
          {[
            { id: 'config', label: 'Configuration', icon: Settings },
            { id: 'profile', label: 'Style Profile', icon: User },
            { id: 'results', label: 'Results', icon: BarChart3 }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {isTraining && (
        <div className="bg-indigo-50 border-b border-indigo-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
              <span className="text-indigo-800">Training in progress...</span>
            </div>
            <span className="text-indigo-800 font-medium">{trainingProgress.toFixed(0)}%</span>
          </div>
          <div className="mt-2 bg-indigo-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${trainingProgress}%` }}
            />
          </div>
        </div>
      )}

      <div className="p-6">
        {activeTab === 'config' && renderConfig()}
        {activeTab === 'profile' && renderProfile()}
        {activeTab === 'results' && renderResults()}
      </div>
    </div>
  );
};

export default TrainingPanel;
