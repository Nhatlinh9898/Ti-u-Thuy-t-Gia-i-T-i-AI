import React, { useState, useEffect } from 'react';
import { Image, Mic, Code, FileText, Settings, Play, Download, Eye, BarChart3 } from 'lucide-react';
import MultiModalAIService from '../services/multiModalAIService';
import { NovelNode, AIActionType } from '../types';

interface MultiModalPanelProps {
  node?: NovelNode;
  action?: AIActionType;
  onContentGenerated?: (content: any) => void;
}

const MultiModalPanel: React.FC<MultiModalPanelProps> = ({ 
  node, 
  action = AIActionType.WRITE_CONTINUE, 
  onContentGenerated 
}) => {
  const [config, setConfig] = useState({
    textGeneration: {
      enabled: true,
      provider: 'ultimate',
      style: 'creative',
      maxLength: 2000
    },
    imageGeneration: {
      enabled: false,
      provider: 'dall-e',
      style: 'realistic',
      size: '512x512',
      quality: 'standard'
    },
    voiceGeneration: {
      enabled: false,
      provider: 'elevenlabs',
      voice: 'natural',
      language: 'vi',
      speed: 1.0
    },
    codeGeneration: {
      enabled: false,
      provider: 'copilot',
      language: 'typescript',
      framework: 'react'
    }
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'text' | 'images' | 'voice' | 'code'>('text');
  const [service, setService] = useState<MultiModalAIService | null>(null);

  useEffect(() => {
    const multiModalService = new MultiModalAIService(config);
    setService(multiModalService);
  }, []);

  const handleGenerate = async () => {
    if (!service || !node) return;

    setIsGenerating(true);
    try {
      const result = await service.generateMultiModalContent(node, action);
      setGeneratedContent(result);
      onContentGenerated?.(result);
    } catch (error) {
      console.error('Multi-modal generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleFeature = (feature: string) => {
    const newConfig = {
      ...config,
      [feature]: {
        ...config[feature as keyof typeof config],
        enabled: !config[feature as keyof typeof config].enabled
      }
    };
    setConfig(newConfig);
    
    if (service) {
      service.updateConfig(newConfig);
    }
  };

  const updateFeatureConfig = (feature: string, key: string, value: any) => {
    const newConfig = {
      ...config,
      [feature]: {
        ...config[feature as keyof typeof config],
        [key]: value
      }
    };
    setConfig(newConfig);
    
    if (service) {
      service.updateConfig(newConfig);
    }
  };

  const renderTextContent = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-semibold mb-3">Text Generation</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span>Enabled</span>
            <button
              onClick={() => toggleFeature('textGeneration')}
              className={`px-3 py-1 rounded-full text-sm ${
                config.textGeneration.enabled
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {config.textGeneration.enabled ? 'On' : 'Off'}
            </button>
          </div>
          
          {config.textGeneration.enabled && (
            <>
              <div>
                <label className="text-sm text-gray-600">Provider</label>
                <select
                  value={config.textGeneration.provider}
                  onChange={(e) => updateFeatureConfig('textGeneration', 'provider', e.target.value)}
                  className="w-full px-2 py-1 border rounded"
                >
                  <option value="ultimate">Ultimate AI</option>
                  <option value="local">Local AI</option>
                  <option value="cloud">Cloud AI</option>
                  <option value="hybrid">Hybrid AI</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm text-gray-600">Style</label>
                <select
                  value={config.textGeneration.style}
                  onChange={(e) => updateFeatureConfig('textGeneration', 'style', e.target.value)}
                  className="w-full px-2 py-1 border rounded"
                >
                  <option value="creative">Creative</option>
                  <option value="professional">Professional</option>
                  <option value="academic">Academic</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm text-gray-600">Max Length</label>
                <input
                  type="number"
                  value={config.textGeneration.maxLength}
                  onChange={(e) => updateFeatureConfig('textGeneration', 'maxLength', parseInt(e.target.value))}
                  className="w-full px-2 py-1 border rounded"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {generatedContent?.text && (
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold mb-3">Generated Text</h3>
          <div className="bg-gray-50 p-3 rounded max-h-64 overflow-y-auto">
            <p className="whitespace-pre-wrap">{generatedContent.text}</p>
          </div>
          <div className="flex space-x-2 mt-3">
            <button
              onClick={() => navigator.clipboard.writeText(generatedContent.text)}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              Copy
            </button>
            <button className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600">
              Download
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderImageContent = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-semibold mb-3">Image Generation</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span>Enabled</span>
            <button
              onClick={() => toggleFeature('imageGeneration')}
              className={`px-3 py-1 rounded-full text-sm ${
                config.imageGeneration.enabled
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {config.imageGeneration.enabled ? 'On' : 'Off'}
            </button>
          </div>
          
          {config.imageGeneration.enabled && (
            <>
              <div>
                <label className="text-sm text-gray-600">Provider</label>
                <select
                  value={config.imageGeneration.provider}
                  onChange={(e) => updateFeatureConfig('imageGeneration', 'provider', e.target.value)}
                  className="w-full px-2 py-1 border rounded"
                >
                  <option value="dall-e">DALL-E</option>
                  <option value="stable-diffusion">Stable Diffusion</option>
                  <option value="midjourney">Midjourney</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm text-gray-600">Style</label>
                <select
                  value={config.imageGeneration.style}
                  onChange={(e) => updateFeatureConfig('imageGeneration', 'style', e.target.value)}
                  className="w-full px-2 py-1 border rounded"
                >
                  <option value="realistic">Realistic</option>
                  <option value="artistic">Artistic</option>
                  <option value="anime">Anime</option>
                  <option value="cartoon">Cartoon</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm text-gray-600">Size</label>
                <select
                  value={config.imageGeneration.size}
                  onChange={(e) => updateFeatureConfig('imageGeneration', 'size', e.target.value)}
                  className="w-full px-2 py-1 border rounded"
                >
                  <option value="256x256">256x256</option>
                  <option value="512x512">512x512</option>
                  <option value="1024x1024">1024x1024</option>
                </select>
              </div>
            </>
          )}
        </div>
      </div>

      {generatedContent?.images && generatedContent.images.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold mb-3">Generated Images</h3>
          <div className="grid grid-cols-2 gap-4">
            {generatedContent.images.map((image: any, index: number) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                <img
                  src={image.url}
                  alt={image.description}
                  className="w-full h-48 object-cover"
                />
                <div className="p-2">
                  <p className="text-sm text-gray-600">{image.description}</p>
                  <div className="flex space-x-2 mt-2">
                    <button className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600">
                      View
                    </button>
                    <button className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600">
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderVoiceContent = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-semibold mb-3">Voice Generation</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span>Enabled</span>
            <button
              onClick={() => toggleFeature('voiceGeneration')}
              className={`px-3 py-1 rounded-full text-sm ${
                config.voiceGeneration.enabled
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {config.voiceGeneration.enabled ? 'On' : 'Off'}
            </button>
          </div>
          
          {config.voiceGeneration.enabled && (
            <>
              <div>
                <label className="text-sm text-gray-600">Provider</label>
                <select
                  value={config.voiceGeneration.provider}
                  onChange={(e) => updateFeatureConfig('voiceGeneration', 'provider', e.target.value)}
                  className="w-full px-2 py-1 border rounded"
                >
                  <option value="elevenlabs">ElevenLabs</option>
                  <option value="azure">Azure</option>
                  <option value="google">Google</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm text-gray-600">Voice</label>
                <select
                  value={config.voiceGeneration.voice}
                  onChange={(e) => updateFeatureConfig('voiceGeneration', 'voice', e.target.value)}
                  className="w-full px-2 py-1 border rounded"
                >
                  <option value="natural">Natural</option>
                  <option value="professional">Professional</option>
                  <option value="character">Character</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm text-gray-600">Language</label>
                <select
                  value={config.voiceGeneration.language}
                  onChange={(e) => updateFeatureConfig('voiceGeneration', 'language', e.target.value)}
                  className="w-full px-2 py-1 border rounded"
                >
                  <option value="vi">Vietnamese</option>
                  <option value="en">English</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm text-gray-600">Speed: {config.voiceGeneration.speed}x</label>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={config.voiceGeneration.speed}
                  onChange={(e) => updateFeatureConfig('voiceGeneration', 'speed', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {generatedContent?.voice && generatedContent.voice.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold mb-3">Generated Voice</h3>
          <div className="space-y-3">
            {generatedContent.voice.map((voice: any, index: number) => (
              <div key={index} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Voice {index + 1}</span>
                  <span className="text-sm text-gray-600">
                    {voice.language} • {voice.duration}s
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-2">{voice.text}</p>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 flex items-center space-x-1">
                    <Play className="w-3 h-3" />
                    <span>Play</span>
                  </button>
                  <button className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 flex items-center space-x-1">
                    <Download className="w-3 h-3" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderCodeContent = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-semibold mb-3">Code Generation</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span>Enabled</span>
            <button
              onClick={() => toggleFeature('codeGeneration')}
              className={`px-3 py-1 rounded-full text-sm ${
                config.codeGeneration.enabled
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {config.codeGeneration.enabled ? 'On' : 'Off'}
            </button>
          </div>
          
          {config.codeGeneration.enabled && (
            <>
              <div>
                <label className="text-sm text-gray-600">Provider</label>
                <select
                  value={config.codeGeneration.provider}
                  onChange={(e) => updateFeatureConfig('codeGeneration', 'provider', e.target.value)}
                  className="w-full px-2 py-1 border rounded"
                >
                  <option value="copilot">GitHub Copilot</option>
                  <option value="codeium">Codeium</option>
                  <option value="tabnine">Tabnine</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm text-gray-600">Language</label>
                <select
                  value={config.codeGeneration.language}
                  onChange={(e) => updateFeatureConfig('codeGeneration', 'language', e.target.value)}
                  className="w-full px-2 py-1 border rounded"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="python">Python</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm text-gray-600">Framework</label>
                <select
                  value={config.codeGeneration.framework}
                  onChange={(e) => updateFeatureConfig('codeGeneration', 'framework', e.target.value)}
                  className="w-full px-2 py-1 border rounded"
                >
                  <option value="react">React</option>
                  <option value="vue">Vue</option>
                  <option value="angular">Angular</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
            </>
          )}
        </div>
      </div>

      {generatedContent?.code && generatedContent.code.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold mb-3">Generated Code</h3>
          <div className="space-y-4">
            {generatedContent.code.map((code: any, index: number) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-3 py-2 border-b">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">
                      {code.language} • {code.framework}
                    </span>
                    <span className="text-xs text-gray-600">
                      {code.complexity} complexity
                    </span>
                  </div>
                </div>
                <div className="p-3">
                  <pre className="bg-gray-900 text-green-400 p-3 rounded text-sm overflow-x-auto">
                    <code>{code.code}</code>
                  </pre>
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 mb-2">{code.explanation}</p>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
                        Copy
                      </button>
                      <button className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600">
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <Image className="w-6 h-6 text-purple-500" />
            <h2 className="text-xl font-bold">Multi-Modal AI</h2>
          </div>
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !node}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <BarChart3 className="w-4 h-4" />
            <span>{isGenerating ? 'Generating...' : 'Generate'}</span>
          </button>
        </div>

        <div className="flex space-x-1 px-4">
          {[
            { id: 'text', label: 'Text', icon: FileText },
            { id: 'images', label: 'Images', icon: Image },
            { id: 'voice', label: 'Voice', icon: Mic },
            { id: 'code', label: 'Code', icon: Code }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-purple-500 text-purple-600'
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
        {activeTab === 'text' && renderTextContent()}
        {activeTab === 'images' && renderImageContent()}
        {activeTab === 'voice' && renderVoiceContent()}
        {activeTab === 'code' && renderCodeContent()}
      </div>

      {generatedContent?.metadata && (
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Generated at: {new Date(generatedContent.metadata.generatedAt).toLocaleString()}
            </span>
            <span>
              Total tokens: {generatedContent.metadata.totalTokens}
            </span>
            <span>
              Processing time: {generatedContent.metadata.processingTime}ms
            </span>
            <span>
              Confidence: {(generatedContent.metadata.confidence * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiModalPanel;
