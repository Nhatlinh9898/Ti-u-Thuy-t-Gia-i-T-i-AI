import React, { useState, useEffect } from 'react';
import { BookOpen, Layers, Map, AlertTriangle, CheckCircle, TrendingUp, Settings, Download, Upload, Eye, Edit, Plus, Target, Clock } from 'lucide-react';
import StoryArchitectureService from '../services/storyArchitectureService';
import { NovelNode } from '../types';

interface StoryArchitecturePanelProps {
  novel?: NovelNode;
  onArchitectureCreated?: (architecture: any) => void;
  onContentTracked?: (content: any) => void;
}

const StoryArchitecturePanel: React.FC<StoryArchitecturePanelProps> = ({ 
  novel, 
  onArchitectureCreated,
  onContentTracked 
}) => {
  const [architectureService] = useState(() => new StoryArchitectureService());
  const [activeTab, setActiveTab] = useState<'overview' | 'volumes' | 'chapters' | 'scenes' | 'tracking' | 'guidelines'>('overview');
  const [currentArchitecture, setCurrentArchitecture] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedVolume, setSelectedVolume] = useState<any>(null);
  const [selectedChapter, setSelectedChapter] = useState<any>(null);
  const [selectedScene, setSelectedScene] = useState<any>(null);
  const [coreConcept, setCoreConcept] = useState({
    premise: '',
    theme: '',
    message: '',
    targetAudience: '',
    originalIdea: ''
  });

  const handleCreateArchitecture = async () => {
    if (!novel || !coreConcept.premise) return;

    setIsCreating(true);
    try {
      const architecture = await architectureService.createStoryArchitecture(
        novel.title,
        novel.genre || 'fiction',
        coreConcept
      );
      
      setCurrentArchitecture(architecture);
      onArchitectureCreated?.(architecture);
    } catch (error) {
      console.error('Failed to create architecture:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleTrackContent = (sceneId: string, chapterId: string, content: string) => {
    const trackedContent = architectureService.trackWrittenContent(sceneId, chapterId, content);
    onContentTracked?.(trackedContent);
    
    // Update current architecture
    if (currentArchitecture) {
      const updated = {
        ...currentArchitecture,
        contentTracking: {
          ...currentArchitecture.contentTracking,
          writtenContent: [...currentArchitecture.contentTracking.writtenContent, trackedContent]
        },
        metadata: {
          ...currentArchitecture.metadata,
          currentProgress: architectureService.getArchitectureOverview().currentProgress,
          lastUpdated: new Date()
        }
      };
      setCurrentArchitecture(updated);
    }
  };

  const handleCheckDuplicates = (content: string) => {
    if (!currentArchitecture) return [];
    
    const contentId = `check-${Date.now()}`;
    return architectureService.checkDuplicateContent(content, contentId);
  };

  const handleCheckContinuity = (content: string, sceneId: string, chapterId: string) => {
    if (!currentArchitecture) return [];
    
    return architectureService.checkContinuity(content, sceneId, chapterId);
  };

  const handleGenerateSuggestions = async (sceneId: string, currentContent: string, writingGoal: string) => {
    if (!currentArchitecture) return { suggestions: [], nextSteps: [], warnings: [] };
    
    return await architectureService.generateContentSuggestions(sceneId, currentContent, writingGoal);
  };

  const handleExportArchitecture = () => {
    if (!currentArchitecture) return;
    
    const exported = architectureService.exportArchitecture();
    const blob = new Blob([exported], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentArchitecture.title}-architecture.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportArchitecture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = architectureService.importArchitecture(e.target?.result as string);
        setCurrentArchitecture(imported);
        onArchitectureCreated?.(imported);
      } catch (error) {
        console.error('Failed to import architecture:', error);
      }
    };
    reader.readAsText(file);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {!currentArchitecture ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Create Story Architecture</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Premise</label>
              <textarea
                value={coreConcept.premise}
                onChange={(e) => setCoreConcept({...coreConcept, premise: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="What is your story about? (The core concept)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
              <input
                type="text"
                value={coreConcept.theme}
                onChange={(e) => setCoreConcept({...coreConcept, theme: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="What is the central theme or message?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <input
                type="text"
                value={coreConcept.message}
                onChange={(e) => setCoreConcept({...coreConcept, message: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="What message do you want to convey?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
              <input
                type="text"
                value={coreConcept.targetAudience}
                onChange={(e) => setCoreConcept({...coreConcept, targetAudience: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Who is your target audience?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Original Idea</label>
              <textarea
                value={coreConcept.originalIdea}
                onChange={(e) => setCoreConcept({...coreConcept, originalIdea: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Describe your original idea and inspiration"
              />
            </div>

            <button
              onClick={handleCreateArchitecture}
              disabled={!coreConcept.premise || !novel || isCreating}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>{isCreating ? 'Creating...' : 'Create Architecture'}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Architecture Overview</h3>
              <div className="flex space-x-2">
                <button
                  onClick={handleExportArchitecture}
                  className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 flex items-center space-x-1"
                >
                  <Download className="w-3 h-3" />
                  <span>Export</span>
                </button>
                <label className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 flex items-center space-x-1 cursor-pointer">
                  <Upload className="w-3 h-3" />
                  <span>Import</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportArchitecture}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Layers className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">{currentArchitecture.structure.volumes.length}</p>
                <p className="text-sm text-gray-600">Volumes</p>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <BookOpen className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">{currentArchitecture.structure.chapters.length}</p>
                <p className="text-sm text-gray-600">Chapters</p>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Map className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">{currentArchitecture.structure.scenes.length}</p>
                <p className="text-sm text-gray-600">Scenes</p>
              </div>
              
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <TrendingUp className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">{Math.round(currentArchitecture.metadata.currentProgress)}%</p>
                <p className="text-sm text-gray-600">Progress</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Core Concept</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Premise:</span>
                    <span className="font-medium text-sm">{currentArchitecture.coreConcept.premise.slice(0, 50)}...</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Theme:</span>
                    <span className="font-medium text-sm">{currentArchitecture.coreConcept.theme}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Message:</span>
                    <span className="font-medium text-sm">{currentArchitecture.coreConcept.message}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Writing Progress</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Est. Words:</span>
                    <span className="font-medium">{currentArchitecture.metadata.totalEstimatedWords.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Written Content:</span>
                    <span className="font-medium">{currentArchitecture.contentTracking.writtenContent.length} pieces</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Last Updated:</span>
                    <span className="font-medium">{new Date(currentArchitecture.metadata.lastUpdated).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderVolumes = () => (
    <div className="space-y-6">
      {currentArchitecture ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Volumes</h3>
          
          <div className="space-y-4">
            {currentArchitecture.structure.volumes.map((volume: any) => (
              <div
                key={volume.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedVolume?.id === volume.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedVolume(volume)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <Layers className="w-5 h-5 text-blue-500" />
                    <h4 className="font-medium">{volume.title}</h4>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      Volume {volume.order}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{volume.wordCount.toLocaleString()} words</span>
                    <button className="p-1 text-gray-500 hover:text-blue-500">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-gray-700 mb-3">{volume.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Chapters:</span>
                    <span className="font-medium ml-1">{volume.chapters.length}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Theme:</span>
                    <span className="font-medium ml-1">{volume.theme || 'Not set'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Climax Impact:</span>
                    <span className="font-medium ml-1 capitalize">{volume.climax.impact}</span>
                  </div>
                </div>

                {volume.keyEvents.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Key Events:</p>
                    <div className="flex flex-wrap gap-1">
                      {volume.keyEvents.slice(0, 3).map((event: string, index: number) => (
                        <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {event.slice(0, 30)}...
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <Layers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No architecture created yet.</p>
          <p className="text-sm text-gray-500 mt-2">Create architecture to manage volumes.</p>
        </div>
      )}
    </div>
  );

  const renderChapters = () => (
    <div className="space-y-6">
      {currentArchitecture ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Chapters</h3>
          
          <div className="space-y-4">
            {currentArchitecture.structure.chapters.map((chapter: any) => (
              <div
                key={chapter.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedChapter?.id === chapter.id
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedChapter(chapter)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <BookOpen className="w-5 h-5 text-green-500" />
                    <h4 className="font-medium">{chapter.title}</h4>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded capitalize">
                      {chapter.type}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{chapter.wordCount.toLocaleString()} words</span>
                    <button className="p-1 text-gray-500 hover:text-green-500">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-gray-700 mb-3">{chapter.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Scenes:</span>
                    <span className="font-medium ml-1">{chapter.scenes.length}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Emotional Tone:</span>
                    <span className="font-medium ml-1 capitalize">{chapter.emotionalTone}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">POV:</span>
                    <span className="font-medium ml-1">{chapter.povCharacter || 'Not set'}</span>
                  </div>
                </div>

                {chapter.objectives.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Objectives:</p>
                    <div className="flex flex-wrap gap-1">
                      {chapter.objectives.slice(0, 3).map((objective: string, index: number) => (
                        <span key={index} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          {objective.slice(0, 30)}...
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No architecture created yet.</p>
          <p className="text-sm text-gray-500 mt-2">Create architecture to manage chapters.</p>
        </div>
      )}
    </div>
  );

  const renderScenes = () => (
    <div className="space-y-6">
      {currentArchitecture ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Scenes</h3>
          
          <div className="space-y-4">
            {currentArchitecture.structure.scenes.map((scene: any) => (
              <div
                key={scene.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedScene?.id === scene.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedScene(scene)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <Map className="w-5 h-5 text-purple-500" />
                    <h4 className="font-medium">{scene.title}</h4>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded capitalize">
                      {scene.type}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      scene.emotionalImpact === 'critical' ? 'bg-red-100 text-red-800' :
                      scene.emotionalImpact === 'high' ? 'bg-orange-100 text-orange-800' :
                      scene.emotionalImpact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {scene.emotionalImpact}
                    </span>
                    <button className="p-1 text-gray-500 hover:text-purple-500">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-gray-700 mb-3">{scene.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Purpose:</span>
                    <span className="font-medium ml-1">{scene.purpose}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Characters:</span>
                    <span className="font-medium ml-1">{scene.characters.length}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Mood:</span>
                    <span className="font-medium ml-1 capitalize">{scene.mood}</span>
                  </div>
                </div>

                {scene.keyEvents.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Key Events:</p>
                    <div className="flex flex-wrap gap-1">
                      {scene.keyEvents.slice(0, 3).map((event: string, index: number) => (
                        <span key={index} className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                          {event.slice(0, 30)}...
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <Map className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No architecture created yet.</p>
          <p className="text-sm text-gray-500 mt-2">Create architecture to manage scenes.</p>
        </div>
      )}
    </div>
  );

  const renderTracking = () => (
    <div className="space-y-6">
      {currentArchitecture ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Content Tracking</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Duplicate Detection</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Similarity Threshold:</span>
                  <span className="font-medium">{currentArchitecture.contentTracking.duplicateDetector.similarityThreshold}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Content Pieces Tracked:</span>
                  <span className="font-medium">{currentArchitecture.contentTracking.writtenContent.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Detected Duplicates:</span>
                  <span className="font-medium">{currentArchitecture.contentTracking.duplicateDetector.detectedDuplicates.length}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Continuity Checking</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Character States:</span>
                  <span className="font-medium">{currentArchitecture.contentTracking.continuityChecker.characterStates.size}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Plot States:</span>
                  <span className="font-medium">{currentArchitecture.contentTracking.continuityChecker.plotStates.size}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Inconsistencies:</span>
                  <span className="font-medium">{currentArchitecture.contentTracking.continuityChecker.inconsistencies.length}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="font-medium mb-3">Written Content</h4>
            <div className="space-y-3">
              {currentArchitecture.contentTracking.writtenContent.slice(0, 5).map((content: any) => (
                <div key={content.id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{content.sceneId}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        content.status === 'final' ? 'bg-green-100 text-green-800' :
                        content.status === 'reviewed' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {content.status}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600">{content.wordCount} words</span>
                  </div>
                  <p className="text-sm text-gray-700">{content.content.slice(0, 100)}...</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {new Date(content.writtenAt).toLocaleDateString()}
                    </span>
                    <div className="flex space-x-1">
                      <button className="p-1 text-gray-500 hover:text-blue-500">
                        <Eye className="w-3 h-3" />
                      </button>
                      <button className="p-1 text-gray-500 hover:text-green-500">
                        <Edit className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No architecture created yet.</p>
          <p className="text-sm text-gray-500 mt-2">Create architecture to track content.</p>
        </div>
      )}
    </div>
  );

  const renderGuidelines = () => (
    <div className="space-y-6">
      {currentArchitecture ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Writing Guidelines</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-medium mb-3">Plot Points</h4>
              <div className="space-y-3">
                {currentArchitecture.guidelines.plotPoints.map((plot: any) => (
                  <div key={plot.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4 text-red-500" />
                        <span className="font-medium">{plot.title}</span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded capitalize">
                          {plot.type.replace('_', ' ')}
                        </span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        plot.importance === 'critical' ? 'bg-red-100 text-red-800' :
                        plot.importance === 'high' ? 'bg-orange-100 text-orange-800' :
                        plot.importance === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {plot.importance}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{plot.description}</p>
                    <div className="mt-2 text-xs text-gray-500">
                      Chapter: {plot.chapterId}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Tone Guidelines</h4>
              <div className="space-y-3">
                {currentArchitecture.guidelines.toneGuidelines.map((guideline: any) => (
                  <div key={guideline.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Settings className="w-4 h-4 text-blue-500" />
                        <span className="font-medium capitalize">{guideline.aspect}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{guideline.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {guideline.examples.slice(0, 3).map((example: string, index: number) => (
                        <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {example}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No architecture created yet.</p>
          <p className="text-sm text-gray-500 mt-2">Create architecture to view guidelines.</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-bold">Story Architecture</h2>
          </div>
          {currentArchitecture && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Progress:</span>
              <span className="font-medium">{Math.round(currentArchitecture.metadata.currentProgress)}%</span>
            </div>
          )}
        </div>

        <div className="flex space-x-1 px-4">
          {[
            { id: 'overview', label: 'Overview', icon: BookOpen },
            { id: 'volumes', label: 'Volumes', icon: Layers },
            { id: 'chapters', label: 'Chapters', icon: BookOpen },
            { id: 'scenes', label: 'Scenes', icon: Map },
            { id: 'tracking', label: 'Tracking', icon: Target },
            { id: 'guidelines', label: 'Guidelines', icon: Settings }
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
        {activeTab === 'volumes' && renderVolumes()}
        {activeTab === 'chapters' && renderChapters()}
        {activeTab === 'scenes' && renderScenes()}
        {activeTab === 'tracking' && renderTracking()}
        {activeTab === 'guidelines' && renderGuidelines()}
      </div>
    </div>
  );
};

export default StoryArchitecturePanel;
