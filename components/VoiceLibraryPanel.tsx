import React, { useState, useEffect } from 'react';
import { Mic, Settings, Upload, Download, Play, Pause, Calendar, TrendingUp, Users, Video, Music, Clock, ChevronRight, Plus, Edit, Trash2, Link, BarChart3, Globe, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import VoiceLibraryService from '../services/voiceLibraryService';

interface VoiceLibraryPanelProps {
  onVoiceCreated?: (voice: any) => void;
  onContentGenerated?: (content: any) => void;
}

const VoiceLibraryPanel: React.FC<VoiceLibraryPanelProps> = ({ 
  onVoiceCreated,
  onContentGenerated 
}) => {
  const [voiceLibraryService] = useState(() => new VoiceLibraryService());
  const [activeTab, setActiveTab] = useState<'voices' | 'publishing' | 'analytics' | 'automation'>('voices');
  const [currentLibrary, setCurrentLibrary] = useState<any>(null);
  const [voices, setVoices] = useState<any[]>([]);
  const [socialAccounts, setSocialAccounts] = useState<any[]>([]);
  const [isCreatingVoice, setIsCreatingVoice] = useState(false);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Voice creation form
  const [voiceForm, setVoiceForm] = useState({
    name: '',
    type: 'neutral' as 'male' | 'female' | 'neutral' | 'character_based',
    language: 'en-US',
    accent: 'neutral',
    age: 'adult' as 'young' | 'adult' | 'mature' | 'elderly',
    style: 'narrative' as 'narrative' | 'dramatic' | 'calm' | 'energetic' | 'mysterious',
    pitch: 1.0,
    speed: 1.0,
    volume: 0.8,
    emotionalRange: 'medium',
    tags: [] as string[],
    quality: 'medium' as 'low' | 'medium' | 'high' | 'ultra'
  });

  // Publishing settings
  const [publishingSettings, setPublishingSettings] = useState({
    youtube: { enabled: false, schedule: 'daily', times: ['09:00', '12:00', '18:00'] },
    facebook: { enabled: false, schedule: 'daily', times: ['10:00', '15:00'] },
    instagram: { enabled: false, schedule: 'daily', times: ['08:00', '13:00'] },
    tiktok: { enabled: false, schedule: 'daily', times: ['11:00', '16:00'] },
    twitter: { enabled: false, schedule: 'daily', times: ['09:00', '12:00'] }
  });

  useEffect(() => {
    initializeLibrary();
  }, []);

  const initializeLibrary = () => {
    const library = voiceLibraryService.createLibrary(
      'My Voice Library',
      'Collection of custom voices and publishing settings'
    );
    setCurrentLibrary(library);
  };

  const handleCreateVoice = async () => {
    setIsCreatingVoice(true);
    try {
      const voice = await voiceLibraryService.addVoice({
        name: voiceForm.name,
        type: voiceForm.type,
        language: voiceForm.language,
        accent: voiceForm.accent,
        age: voiceForm.age,
        style: voiceForm.style,
        characteristics: {
          pitch: voiceForm.pitch,
          speed: voiceForm.speed,
          volume: voiceForm.volume,
          emotionalRange: voiceForm.emotionalRange
        },
        metadata: {
          tags: voiceForm.tags,
          quality: voiceForm.quality,
          isCustom: true,
          isPublic: false
        }
      });

      setVoices([...voices, voice]);
      onVoiceCreated?.(voice);
      
      // Reset form
      setVoiceForm({
        name: '',
        type: 'neutral',
        language: 'en-US',
        accent: 'neutral',
        age: 'adult',
        style: 'narrative',
        pitch: 1.0,
        speed: 1.0,
        volume: 0.8,
        emotionalRange: 'medium',
        tags: [],
        quality: 'medium'
      });

    } catch (error) {
      console.error('Failed to create voice:', error);
    } finally {
      setIsCreatingVoice(false);
    }
  };

  const handleAutoGenerateAndPublish = async (voiceId: string) => {
    setIsGeneratingContent(true);
    try {
      const result = await voiceLibraryService.autoGenerateAndPublish(
        voiceId,
        ['story_reading', 'character_intro'],
        ['youtube', 'facebook', 'instagram']
      );

      onContentGenerated?.(result);
      console.log('Generated and published:', result);
    } catch (error) {
      console.error('Failed to generate and publish:', error);
    } finally {
      setIsGeneratingContent(false);
    }
  };

  const handleOptimizeSchedule = async (platform: string) => {
    setIsOptimizing(true);
    try {
      const schedule = await voiceLibraryService.optimizePostingSchedule(platform);
      console.log('Optimized schedule for', platform, ':', schedule);
    } catch (error) {
      console.error('Failed to optimize schedule:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleConnectSocialAccount = async (platform: string) => {
    try {
      const account = await voiceLibraryService.connectSocialMediaAccount(
        platform as any,
        {
          accessToken: 'mock-token',
          accountId: `${platform}-account-${Date.now()}`
        }
      );
      
      setSocialAccounts([...socialAccounts, account]);
      console.log('Connected account:', account);
    } catch (error) {
      console.error('Failed to connect account:', error);
    }
  };

  const renderVoices = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Voice Library</h3>
        
        {/* Create Voice Form */}
        <div className="border rounded-lg p-4 mb-6">
          <h4 className="font-medium mb-4">Create New Voice</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Voice Name</label>
              <input
                type="text"
                value={voiceForm.name}
                onChange={(e) => setVoiceForm({...voiceForm, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter voice name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={voiceForm.type}
                onChange={(e) => setVoiceForm({...voiceForm, type: e.target.value as any})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="neutral">Neutral</option>
                <option value="character_based">Character Based</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Style</label>
              <select
                value={voiceForm.style}
                onChange={(e) => setVoiceForm({...voiceForm, style: e.target.value as any})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="narrative">Narrative</option>
                <option value="dramatic">Dramatic</option>
                <option value="calm">Calm</option>
                <option value="energetic">Energetic</option>
                <option value="mysterious">Mysterious</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quality</label>
              <select
                value={voiceForm.quality}
                onChange={(e) => setVoiceForm({...voiceForm, quality: e.target.value as any})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="ultra">Ultra</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pitch</label>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={voiceForm.pitch}
                onChange={(e) => setVoiceForm({...voiceForm, pitch: parseFloat(e.target.value)})}
                className="w-full"
              />
              <span className="text-sm text-gray-600">{voiceForm.pitch}</span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Speed</label>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={voiceForm.speed}
                onChange={(e) => setVoiceForm({...voiceForm, speed: parseFloat(e.target.value)})}
                className="w-full"
              />
              <span className="text-sm text-gray-600">{voiceForm.speed}x</span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Volume</label>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.1"
                value={voiceForm.volume}
                onChange={(e) => setVoiceForm({...voiceForm, volume: parseFloat(e.target.value)})}
                className="w-full"
              />
              <span className="text-sm text-gray-600">{Math.round(voiceForm.volume * 100)}%</span>
            </div>
          </div>

          <button
            onClick={handleCreateVoice}
            disabled={!voiceForm.name || isCreatingVoice}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>{isCreatingVoice ? 'Creating...' : 'Create Voice'}</span>
          </button>
        </div>

        {/* Voices List */}
        <div className="space-y-4">
          {voices.map((voice) => (
            <div key={voice.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Mic className="w-8 h-8 text-blue-500" />
                  <div>
                    <h4 className="font-medium">{voice.name}</h4>
                    <p className="text-sm text-gray-600 capitalize">
                      {voice.type} • {voice.style} • {voice.language}
                    </p>
                    <p className="text-xs text-gray-500">
                      Quality: {voice.metadata.quality} • Used {voice.usage.usedInProjects.length} times
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleAutoGenerateAndPublish(voice.id)}
                    disabled={isGeneratingContent}
                    className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                  >
                    <Video className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-blue-500">
                    <Edit className="w-4 h-4" />
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

  const renderPublishing = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Publishing Settings</h3>
        
        {/* Social Media Accounts */}
        <div className="border rounded-lg p-4 mb-6">
          <h4 className="font-medium mb-4">Social Media Accounts</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { platform: 'youtube', icon: Youtube, color: 'red' },
              { platform: 'facebook', icon: Facebook, color: 'blue' },
              { platform: 'instagram', icon: Instagram, color: 'purple' },
              { platform: 'tiktok', icon: Music, color: 'black' },
              { platform: 'twitter', icon: Twitter, color: 'blue' }
            ].map(({ platform, icon: Icon, color }) => (
              <div key={platform} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Icon className={`w-6 h-6 text-${color}-500`} />
                    <span className="font-medium capitalize">{platform}</span>
                  </div>
                  <button
                    onClick={() => handleConnectSocialAccount(platform)}
                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                  >
                    {socialAccounts.find(acc => acc.platform === platform) ? 'Connected' : 'Connect'}
                  </button>
                </div>
                
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={publishingSettings[platform as keyof typeof publishingSettings]?.enabled}
                      onChange={(e) => setPublishingSettings({
                        ...publishingSettings,
                        [platform]: { ...publishingSettings[platform as keyof typeof publishingSettings], enabled: e.target.checked }
                      })}
                      className="rounded"
                    />
                    <span className="text-sm">Enable Auto-Publishing</span>
                  </label>
                  
                  <div>
                    <label className="block text-xs text-gray-600">Schedule</label>
                    <select
                      value={publishingSettings[platform as keyof typeof publishingSettings]?.schedule}
                      onChange={(e) => setPublishingSettings({
                        ...publishingSettings,
                        [platform]: { ...publishingSettings[platform as keyof typeof publishingSettings], schedule: e.target.value }
                      })}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scheduling */}
        <div className="border rounded-lg p-4">
          <h4 className="font-medium mb-4">Optimization & Scheduling</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['youtube', 'facebook', 'instagram', 'tiktok', 'twitter'].map(platform => (
              <div key={platform} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-gray-500" />
                  <span className="font-medium capitalize">{platform}</span>
                </div>
                <button
                  onClick={() => handleOptimizeSchedule(platform)}
                  disabled={isOptimizing}
                  className="px-3 py-1 bg-purple-500 text-white rounded text-sm hover:bg-purple-600"
                >
                  {isOptimizing ? 'Optimizing...' : 'Optimize Schedule'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Analytics & Performance</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Mic className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{voices.length}</p>
            <p className="text-sm text-gray-600">Total Voices</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Video className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-gray-600">Published Posts</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Users className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-gray-600">Total Reach</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <TrendingUp className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">0%</p>
            <p className="text-sm text-gray-600">Growth Rate</p>
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <h4 className="font-medium mb-4">Voice Performance</h4>
          <div className="space-y-3">
            {voices.map((voice) => (
              <div key={voice.id} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center space-x-3">
                  <Mic className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium">{voice.name}</p>
                    <p className="text-sm text-gray-600">
                      Used {voice.usage.usedInProjects.length} times • {voice.usage.totalUsageTime}s total
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium">{voice.usage.popularity}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAutomation = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Automation Settings</h3>
        
        <div className="space-y-6">
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-4">Content Generation</h4>
            <div className="space-y-4">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Auto-generate content</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Optimize posting times</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">A/B test content</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Analyze performance</span>
              </label>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-4">Content Types</h4>
            <div className="space-y-2">
              {['Story Reading', 'Character Introduction', 'Chapter Summary', 'Behind the Scenes'].map(type => (
                <label key={type} className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">{type}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-4">Posting Schedule</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Best Times</label>
                <input
                  type="text"
                  placeholder="09:00, 12:00, 18:00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="border-b border-gray-200">
        <div className="flex items-center p-4">
          <Mic className="w-6 h-6 text-purple-500 mr-2" />
          <h2 className="text-xl font-bold">Voice Library & Publishing</h2>
        </div>

        <div className="flex space-x-1 px-4">
          {[
            { id: 'voices', label: 'Voices', icon: Mic },
            { id: 'publishing', label: 'Publishing', icon: Video },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'automation', label: 'Automation', icon: Settings }
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
        {activeTab === 'voices' && renderVoices()}
        {activeTab === 'publishing' && renderPublishing()}
        {activeTab === 'analytics' && renderAnalytics()}
        {activeTab === 'automation' && renderAutomation()}
      </div>
    </div>
  );
};

export default VoiceLibraryPanel;
