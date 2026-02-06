import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Languages, 
  Volume2, 
  Settings, 
  Download, 
  Upload, 
  RefreshCw, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Mic, 
  MicOff, 
  Headphones, 
  FileText, 
  Copy, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Clock, 
  Calendar, 
  DollarSign, 
  Users, 
  MessageSquare, 
  ChevronRight, 
  ChevronDown,
  MoreVertical,
  Search,
  Filter,
  Zap,
  Target,
  Award,
  BookOpen,
  Hash,
  Star,
  Flag,
  Shield
} from 'lucide-react';
import MultiLanguageService from '../services/multiLanguageService';

interface MultiLanguagePanelProps {
  onLanguageAdded?: (language: any) => void;
  onTranslationCompleted?: (translation: any) => void;
  onVoiceGenerated?: (voice: any) => void;
}

const MultiLanguagePanel: React.FC<MultiLanguagePanelProps> = ({ 
  onLanguageAdded,
  onTranslationCompleted,
  onVoiceGenerated
}) => {
  const [multiLangService] = useState(() => new MultiLanguageService());
  const [activeTab, setActiveTab] = useState<'overview' | 'languages' | 'translation' | 'voice' | 'localization' | 'analytics'>('overview');
  const [languages, setLanguages] = useState<any[]>([]);
  const [translations, setTranslations] = useState<any[]>([]);
  const [voices, setVoices] = useState<any[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [translationText, setTranslationText] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('vi');
  const [voiceText, setVoiceText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('default');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isGeneratingVoice, setIsGeneratingVoice] = useState(false);
  const [translationProgress, setTranslationProgress] = useState(0);
  const [voiceProgress, setVoiceProgress] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const supportedLanguages = multiLangService.getSupportedLanguages();
    setLanguages(supportedLanguages);
    
    const translationHistory = multiLangService.getTranslationHistory();
    setTranslations(translationHistory);
    
    const customVoices = multiLangService.getCustomVoices();
    setVoices(customVoices);
  };

  const handleTranslate = async () => {
    if (!translationText.trim()) return;

    setIsTranslating(true);
    setTranslationProgress(0);

    try {
      const result = await multiLangService.translateText(
        translationText,
        targetLanguage,
        'en',
        {
          type: 'general',
          domain: 'general',
          audience: 'general',
          formality: 'formal',
          tone: 'neutral',
          purpose: 'communication'
        }
      );

      setTranslations([result, ...translations]);
      onTranslationCompleted?.(result);

    } catch (error) {
      console.error('Translation failed:', error);
    } finally {
      setIsTranslating(false);
      setTranslationProgress(0);
    }
  };

  const handleGenerateVoice = async () => {
    if (!voiceText.trim()) return;

    setIsGeneratingVoice(true);
    setVoiceProgress(0);

    try {
      const result = await multiLangService.generateLocalizedVoice(
        voiceText,
        targetLanguage,
        selectedVoice,
        'neutral',
        {
          speed: 1.0,
          pitch: 1.0,
          volume: 1.0
        }
      );

      setVoices([result, ...voices]);
      onVoiceGenerated?.(result);

    } catch (error) {
      console.error('Voice generation failed:', error);
    } finally {
      setIsGeneratingVoice(false);
      setVoiceProgress(0);
    }
  };

  const handleDetectLanguage = async (text: string) => {
    try {
      const result = await multiLangService.detectLanguage(text, undefined, {
        minConfidence: 0.7,
        maxLanguages: 5,
        includeDialects: true,
        includeScript: true,
        culturalContext: true
      });

      console.log('Detected language:', result);
      
    } catch (error) {
      console.error('Language detection failed:', error);
    }
  };

  const getLanguageIcon = (code: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'en': <Globe className="w-5 h-5" />,
      'vi': <Languages className="w-5 h-5" />,
      'ja': <Globe className="w-5 h-5" />,
      'es': <Globe className="w-5 h-5" />,
      'fr': <Globe className="w-5 h-5" />,
      'de': <Globe className="w-5 h-5" />,
      'zh': <Globe className="w-5 h-5" />,
      'ko': <Globe className="w-5 h-5" />,
      'ar': <Globe className="w-5 h-5" />
    };

    return iconMap[code] || <Globe className="w-5 h-5" />;
  };

  const getCompletionColor = (completionRate: number) => {
    if (completionRate >= 95) return 'text-green-600';
    if (completionRate >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Globe className="w-8 h-8 text-blue-500" />
              <div>
                <h3 className="text-lg font-semibold">Supported Languages</h3>
                <p className="text-sm text-gray-600">Total languages supported</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">{languages.length}</div>
              <div className="text-sm text-gray-500">languages</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-8 h-8 text-green-500" />
              <div>
                <h3 className="text-lg font-semibold">Translations</h3>
                <p className="text-sm text-gray-600">Total translations</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600">{translations.length}</div>
              <div className="text-sm text-gray-500">translations</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Volume2 className="w-8 h-8 text-purple-500" />
              <div>
                <h3 className="text-lg font-semibold">Voice Generations</h3>
                <p className="text-sm text-gray-600">Total voice generations</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-purple-600">{voices.length}</div>
              <div className="text-sm text-gray-500">voices</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-8 h-8 text-orange-500" />
              <div>
                <h3 className="text-lg font-semibold">Avg Completion Rate</h3>
                <p className="text-sm text-gray-600">Translation quality</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-orange-600">92%</div>
              <div className="text-sm text-gray-500">quality</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {translations.slice(0, 5).map((translation, index) => (
            <div key={translation.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                  <Languages className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <div className="font-medium">{translation.sourceLanguage} → {translation.targetLanguage}</div>
                  <div className="text-sm text-gray-500">
                    {translation.sourceText.substring(0, 50)}...
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(translation.metadata?.processingTime || Date.now()).toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-medium ${getCompletionColor(translation.confidence)}`}>
                  {Math.round(translation.confidence)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderLanguages = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Supported Languages</h3>
          <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center space-x-1">
            <Plus className="w-4 h-4" />
            <span>Add Language</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {languages.map((language) => (
            <div key={language.code} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {getLanguageIcon(language.code)}
                  <div>
                    <div className="font-medium">{language.name}</div>
                    <div className="text-sm text-gray-500">{language.englishName}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-1 text-gray-500 hover:text-gray-700">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-500 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Direction:</span>
                    <span className="text-gray-600">{language.direction === 'ltr' ? 'Left to Right' : 'Right to Left'}</span>
                  </div>
                  <div>
                    <span className="font-medium">Region:</span>
                    <span className="text-gray-600">{language.region || 'N/A'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Completion:</span>
                    <span className={`font-medium ${getCompletionColor(language.completionRate)}`}>
                      {language.completionRate}%
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Updated:</span>
                    <span className="text-gray-600">
                      {new Date(language.lastUpdated).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <div className="text-sm text-gray-600 mb-2">Supported Features:</div>
                <div className="flex flex-wrap gap-2">
                  {language.supported && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Translation</span>
                  )}
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Voice</span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">Localization</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTranslation = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Translation</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Source Language</label>
            <select
              value="en"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled
            >
              <option value="en">English</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Target Language</label>
            <select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name} ({lang.englishName})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Text to Translate</label>
          <textarea
            value={translationText}
            onChange={(e) => setTranslationText(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Enter text to translate..."
          />
        </div>

        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handleDetectLanguage}
            disabled={!translationText.trim()}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Search className="w-4 h-4" />
            <span>Detect Language</span>
          </button>
          
          <button
            onClick={handleTranslate}
            disabled={!translationText.trim() || isTranslating}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Languages className="w-4 h-4" />
            <span>{isTranslating ? 'Translating...' : 'Translate'}</span>
          </button>
        </div>

        {isTranslating && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Translating...</span>
              <span className="text-sm text-gray-500">{translationProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${translationProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Translation History */}
      <div className="border-t pt-4">
        <h4 className="font-medium mb-4">Translation History</h4>
        <div className="space-y-3">
          {translations.slice(0, 10).map((translation) => (
            <div key={translation.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                  <Languages className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <div className="font-medium">{translation.sourceLanguage} → {translation.targetLanguage}</div>
                  <div className="text-sm text-gray-500">
                    {translation.sourceText.substring(0, 50)}...
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(translation.metadata?.processingTime || Date.now()).toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-medium ${getCompletionColor(translation.confidence)}`}>
                  {Math.round(translation.confidence)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderVoice = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Voice Generation</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
            <select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name} ({lang.englishName})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Voice</label>
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="default">Default</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="child">Child</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Text to Generate Voice</label>
          <textarea
            value={voiceText}
            onChange={(e) => setVoiceText(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Enter text to generate voice..."
          />
        </div>

        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handleGenerateVoice}
            disabled={!voiceText.trim() || isGeneratingVoice}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Volume2 className="w-4 h-4" />
            <span>{isGeneratingVoice ? 'Generating...' : 'Generate Voice'}</span>
          </button>
        </div>

        {isGeneratingVoice && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Generating voice...</span>
              <span className="text-sm text-gray-500">{voiceProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${voiceProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Voice Library */}
      <div className="border-t pt-4">
        <h4 className="font-medium mb-4">Voice Library</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {voices.map((voice) => (
            <div key={voice.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                    <Volume2 className="w-4 h-4 text-gray-500" />
                  </div>
                  <div>
                    <div className="font-medium">{voice.name}</div>
                    <div className="text-sm text-gray-500">{voice.language}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-1 text-gray-500 hover:text-gray-700">
                    <Play className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-500 hover:text-gray-700">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                <div>Duration: {voice.duration}s</div>
                <div>Quality: {voice.quality}</div>
                <div>Format: {voice.format}</div>
                <div>Size: {(voice.fileSize / 1024).toFixed(1)}KB</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderLocalization = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Localization Settings</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Format</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="HH:mm:ss">24-hour</option>
              <option value="hh:mm a">12-hour</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Number Format</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="1,234.56">1,234.56</option>
              <option value="1.234,56">1,234.56</option>
              <option value="1,234.56">1,234.56</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Currency Format</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="$1,234.56">$1,234.56</option>
              <option value="€1,234.56">€1,234.56</option>
              <option value="£1,234.56">£1,234.56</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Measurement System</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="metric">Metric</option>
              <option value="imperial">Imperial</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="UTC">UTC</option>
              <option value="America/New_York">America/New_York</option>
              <option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Translation Analytics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="w-8 h-8 text-blue-500" />
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">1,234</div>
                <div className="text-sm text-gray-500">translations today</div>
              </div>
            </div>
            <div className="text-sm text-gray-600">Total Translations</div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-green-500" />
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">92%</div>
                <div className="text-sm text-gray-500">avg quality</div>
              </div>
            </div>
            <div className="text-sm text-gray-600">Translation Quality</div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 text-purple-500" />
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">2.5s</div>
                <div className="text-sm text-gray-500">avg time</div>
              </div>
            </div>
            <div className="text-sm text-gray-600">Processing Time</div>
          </div>

          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 text-orange-500" />
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-600">$0.05</div>
                <div className="text-sm text-gray-500">avg cost</div>
              </div>
            </div>
            <div className="text-sm text-gray-600">Translation Cost</div>
          </div>
        </div>

        {/* Language Usage Chart */}
        <div className="border-t pt-4">
          <h4 className="font-medium mb-4">Language Usage</h4>
          <div className="space-y-3">
            {languages.slice(0, 5).map((language) => (
              <div key={language.code} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getLanguageIcon(language.code)}
                  <div>
                    <div className="font-medium">{language.name}</div>
                    <div className="text-sm text-gray-500">{translations.filter(t => t.targetLanguage === language.code).length} translations</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-600">
                    {translations.filter(t => t.targetLanguage === language.code).length}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg h-full flex flex-col">
      <div className="border-b border-gray-200">
        <div className="flex items-center p-4">
          <Globe className="w-6 h-6 text-blue-500 mr-2" />
          <h2 className="text-xl font-bold">Multi-Language Support</h2>
        </div>

        <div className="flex space-x-1 px-4">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'languages', label: 'Languages', icon: Languages },
            { id: 'translation', label: 'Translation', icon: MessageSquare },
            { id: 'voice', label: 'Voice', icon: Volume2 },
            { id: 'localization', label: 'Localization', icon: Settings },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp }
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
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'languages' && renderLanguages()}
        {activeTab === 'translation' && renderTranslation()}
        {activeTab === 'voice' && renderVoice()}
        {activeTab === 'localization' && renderLocalization()}
        {activeTab === 'analytics' && renderAnalytics()}
      </div>
    </div>
  );
};

export default MultiLanguagePanel;
