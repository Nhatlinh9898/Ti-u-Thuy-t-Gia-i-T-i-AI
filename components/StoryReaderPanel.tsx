import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Settings, Download, Upload, Mic, User, BookOpen, Headphones, Video, FileText, Clock, ChevronRight, ChevronLeft } from 'lucide-react';
import StoryReaderService from '../services/storyReaderService';
import { NovelNode } from '../types';

interface StoryReaderPanelProps {
  project?: any;
  onReaderCreated?: (reader: any) => void;
  onSegmentGenerated?: (segment: any) => void;
}

const StoryReaderPanel: React.FC<StoryReaderPanelProps> = ({ 
  project, 
  onReaderCreated,
  onSegmentGenerated 
}) => {
  const [readerService] = useState(() => new StoryReaderService());
  const [activeTab, setActiveTab] = useState<'setup' | 'narrator' | 'content' | 'generation' | 'player'>('setup');
  const [currentReader, setCurrentReader] = useState<any>(null);
  const [selectedProject, setSelectedProject] = useState<any>(project || null);
  const [isCreating, setIsCreating] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingComplete, setIsGeneratingComplete] = useState(false);
  const [currentSegment, setCurrentSegment] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generationProgress, setGenerationProgress] = useState(0);

  // Reader settings
  const [narratorSettings, setNarratorSettings] = useState({
    name: '',
    voiceType: 'neutral' as 'male' | 'female' | 'neutral' | 'character_based',
    voiceStyle: 'narrative' as 'narrative' | 'dramatic' | 'calm' | 'energetic' | 'mysterious',
    age: 'adult' as 'young' | 'adult' | 'mature' | 'elderly',
    personality: {
      tone: 'Warm and engaging',
      speakingStyle: 'Clear and expressive',
      emotionalRange: 'Versatile',
      favoritePhrases: ['Welcome to our story', 'Let\'s continue our journey']
    }
  });

  const [readingSettings, setReadingSettings] = useState({
    voiceSettings: {
      speed: 1.0,
      pitch: 1.0,
      volume: 0.8,
      language: 'en-US',
      accent: 'neutral'
    },
    contentSettings: {
      includeIntroductions: true,
      includeSummaries: true,
      includeThankYou: true,
      includeNextEpisodeHints: true,
      summaryLength: 'detailed' as 'brief' | 'detailed' | 'comprehensive'
    },
    audioSettings: {
      format: 'mp4' as 'mp3' | 'wav' | 'mp4',
      quality: 'high' as 'low' | 'medium' | 'high' | 'ultra',
      backgroundMusic: true,
      soundEffects: false,
      chapterMarkers: true
    },
    visualSettings: {
      generateVideo: true,
      includeSubtitles: true,
      backgroundImages: true,
      textOverlays: true,
      transitionEffects: true
    }
  });

  useEffect(() => {
    if (project) {
      setSelectedProject(project);
    }
  }, [project]);

  const handleCreateReader = async () => {
    if (!selectedProject) return;

    setIsCreating(true);
    try {
      const reader = await readerService.createStoryReader(
        selectedProject.id,
        narratorSettings,
        readingSettings
      );
      
      setCurrentReader(reader);
      onReaderCreated?.(reader);
      setActiveTab('content');
    } catch (error) {
      console.error('Failed to create reader:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleGenerateSegment = async (segmentId: string) => {
    if (!currentReader) return;

    try {
      const segment = await readerService.generateAudioSegment(
        segmentId,
        readingSettings.visualSettings.generateVideo
      );
      
      setCurrentSegment(segment);
      onSegmentGenerated?.(segment);
    } catch (error) {
      console.error('Failed to generate segment:', error);
    }
  };

  const handleGenerateComplete = async () => {
    if (!currentReader) return;

    setIsGenerating(true);
    setGenerationProgress(0);
    
    try {
      const result = await readerService.generateCompleteAudiobook(
        readingSettings.visualSettings.generateVideo,
        (progress) => {
          setGenerationProgress(progress);
        }
      );
      
      setIsGeneratingComplete(true);
      setActiveTab('player');
    } catch (error) {
      console.error('Failed to generate complete audiobook:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (currentReader) {
      const nextSegment = readerService.navigateToNext();
      if (nextSegment) {
        setCurrentSegment(nextSegment);
      }
    }
  };

  const handlePrevious = () => {
    if (currentReader) {
      const previousSegment = readerService.navigateToPrevious();
      if (previousSegment) {
        setCurrentSegment(previousSegment);
      }
    }
  };

  const handleDownload = () => {
    if (currentSegment?.videoUrl) {
      const a = document.createElement('a');
      a.href = currentSegment.videoUrl;
      a.download = `${currentSegment.title}.mp4`;
      a.click();
    }
  };

  const renderSetup = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Project Selection</h3>
        
        {selectedProject ? (
          <div className="border rounded-lg p-4 bg-blue-50">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{selectedProject.title}</h4>
                <p className="text-sm text-gray-600">{selectedProject.genre}</p>
                <p className="text-sm text-gray-500 mt-1">{selectedProject.synopsis}</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-500" />
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No project selected</p>
            <p className="text-sm text-gray-500 mt-2">Select a project to create a story reader</p>
          </div>
        )}

        <button
          onClick={handleCreateReader}
          disabled={!selectedProject || isCreating}
          className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          <Mic className="w-4 h-4" />
          <span>{isCreating ? 'Creating...' : 'Create Story Reader'}</span>
        </button>
      </div>
    </div>
  );

  const renderNarrator = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Narrator Profile</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Narrator Name</label>
            <input
              type="text"
              value={narratorSettings.name}
              onChange={(e) => setNarratorSettings({...narratorSettings, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter narrator name"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Voice Type</label>
              <select
                value={narratorSettings.voiceType}
                onChange={(e) => setNarratorSettings({...narratorSettings, voiceType: e.target.value as any})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="neutral">Neutral</option>
                <option value="character_based">Character Based</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Voice Style</label>
              <select
                value={narratorSettings.voiceStyle}
                onChange={(e) => setNarratorSettings({...narratorSettings, voiceStyle: e.target.value as any})}
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
              <select
                value={narratorSettings.age}
                onChange={(e) => setNarratorSettings({...narratorSettings, age: e.target.value as any})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="young">Young</option>
                <option value="adult">Adult</option>
                <option value="mature">Mature</option>
                <option value="elderly">Elderly</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Personality</label>
            <div className="space-y-2">
              <div>
                <label className="block text-xs text-gray-600">Tone</label>
                <input
                  type="text"
                  value={narratorSettings.personality.tone}
                  onChange={(e) => setNarratorSettings({
                    ...narratorSettings,
                    personality: {...narratorSettings.personality, tone: e.target.value}
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Warm and engaging"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600">Speaking Style</label>
                <input
                  type="text"
                  value={narratorSettings.personality.speakingStyle}
                  onChange={(e) => setNarratorSettings({
                    ...narratorSettings,
                    personality: {...narratorSettings.personality, speakingStyle: e.target.value}
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Clear and expressive"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (!currentReader) return null;

    const structure = currentReader.contentStructure;
    const segments = readerService.getAllSegments();

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Content Structure</h3>
          
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">Story Overview</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Title:</span>
                  <span className="font-medium ml-1">{structure.hierarchy.story.title}</span>
                </div>
                <div>
                  <span className="text-gray-600">Genre:</span>
                  <span className="font-medium ml-1">{structure.hierarchy.story.genre}</span>
                </div>
                <div>
                  <span className="text-gray-600">Total Sections:</span>
                  <span className="font-medium ml-1">{segments.length}</span>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">Reading Segments</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {segments.map((segment: any, index: number) => (
                  <div
                    key={segment.id}
                    className="flex items-center justify-between p-2 border rounded hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-500">{index + 1}</span>
                      <div>
                        <p className="font-medium text-sm">{segment.title}</p>
                        <p className="text-xs text-gray-600 capitalize">{segment.type.replace('_', ' ')}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleGenerateSegment(segment.id)}
                      className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                    >
                      Generate
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerateComplete}
              disabled={isGenerating}
              className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Video className="w-4 h-4" />
              <span>{isGenerating ? 'Generating...' : 'Generate Complete Audiobook'}</span>
            </button>

            {isGenerating && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${generationProgress}%` }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderGeneration = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Reading Settings</h3>
        
        <div className="space-y-6">
          <div>
            <h4 className="font-medium mb-3">Voice Settings</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Speed</label>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={readingSettings.voiceSettings.speed}
                  onChange={(e) => setReadingSettings({
                    ...readingSettings,
                    voiceSettings: {...readingSettings.voiceSettings, speed: parseFloat(e.target.value)}
                  })}
                  className="w-full"
                />
                <span className="text-sm text-gray-600">{readingSettings.voiceSettings.speed}x</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pitch</label>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={readingSettings.voiceSettings.pitch}
                  onChange={(e) => setReadingSettings({
                    ...readingSettings,
                    voiceSettings: {...readingSettings.voiceSettings, pitch: parseFloat(e.target.value)}
                  })}
                  className="w-full"
                />
                <span className="text-sm text-gray-600">{readingSettings.voiceSettings.pitch}</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Volume</label>
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.1"
                  value={readingSettings.voiceSettings.volume}
                  onChange={(e) => setReadingSettings({
                    ...readingSettings,
                    voiceSettings: {...readingSettings.voiceSettings, volume: parseFloat(e.target.value)}
                  })}
                  className="w-full"
                />
                <span className="text-sm text-gray-600">{Math.round(readingSettings.voiceSettings.volume * 100)}%</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">Content Settings</h4>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={readingSettings.contentSettings.includeIntroductions}
                  onChange={(e) => setReadingSettings({
                    ...readingSettings,
                    contentSettings: {...readingSettings.contentSettings, includeIntroductions: e.target.checked}
                  })}
                  className="rounded"
                />
                <span className="text-sm">Include Introductions</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={readingSettings.contentSettings.includeSummaries}
                  onChange={(e) => setReadingSettings({
                    ...readingSettings,
                    contentSettings: {...readingSettings.contentSettings, includeSummaries: e.target.checked}
                  })}
                  className="rounded"
                />
                <span className="text-sm">Include Summaries</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={readingSettings.contentSettings.includeThankYou}
                  onChange={(e) => setReadingSettings({
                    ...readingSettings,
                    contentSettings: {...readingSettings.contentSettings, includeThankYou: e.target.checked}
                  })}
                  className="rounded"
                />
                <span className="text-sm">Include Thank You Messages</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={readingSettings.contentSettings.includeNextEpisodeHints}
                  onChange={(e) => setReadingSettings({
                    ...readingSettings,
                    contentSettings: {...readingSettings.contentSettings, includeNextEpisodeHints: e.target.checked}
                  })}
                  className="rounded"
                />
                <span className="text-sm">Include Next Episode Hints</span>
              </label>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">Audio/Video Settings</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
                <select
                  value={readingSettings.audioSettings.format}
                  onChange={(e) => setReadingSettings({
                    ...readingSettings,
                    audioSettings: {...readingSettings.audioSettings, format: e.target.value as any}
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="mp3">MP3 (Audio Only)</option>
                  <option value="wav">WAV (Audio Only)</option>
                  <option value="mp4">MP4 (Video)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quality</label>
                <select
                  value={readingSettings.audioSettings.quality}
                  onChange={(e) => setReadingSettings({
                    ...readingSettings,
                    audioSettings: {...readingSettings.audioSettings, quality: e.target.value as any}
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="ultra">Ultra</option>
                </select>
              </div>
            </div>
            <div className="space-y-2 mt-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={readingSettings.visualSettings.generateVideo}
                  onChange={(e) => setReadingSettings({
                    ...readingSettings,
                    visualSettings: {...readingSettings.visualSettings, generateVideo: e.target.checked}
                  })}
                  className="rounded"
                />
                <span className="text-sm">Generate Video</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={readingSettings.visualSettings.includeSubtitles}
                  onChange={(e) => setReadingSettings({
                    ...readingSettings,
                    visualSettings: {...readingSettings.visualSettings, includeSubtitles: e.target.checked}
                  })}
                  className="rounded"
                />
                <span className="text-sm">Include Subtitles</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={readingSettings.audioSettings.backgroundMusic}
                  onChange={(e) => setReadingSettings({
                    ...readingSettings,
                    audioSettings: {...readingSettings.audioSettings, backgroundMusic: e.target.checked}
                  })}
                  className="rounded"
                />
                <span className="text-sm">Background Music</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPlayer = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Story Player</h3>
        
        {currentSegment ? (
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-medium">{currentSegment.title}</h4>
                  <p className="text-sm text-gray-600 capitalize">{currentSegment.type.replace('_', ' ')}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {Math.floor(currentSegment.duration / 60)}:{String(Math.floor(currentSegment.duration % 60)).padStart(2, '0')}
                  </span>
                  {currentSegment.videoUrl && (
                    <button
                      onClick={handleDownload}
                      className="p-2 text-gray-500 hover:text-blue-500"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Video/Audio Player */}
              {currentSegment.videoUrl ? (
                <div className="bg-black rounded-lg overflow-hidden">
                  <video
                    className="w-full"
                    controls
                    src={currentSegment.videoUrl}
                  />
                </div>
              ) : currentSegment.audioUrl ? (
                <div className="bg-gray-100 rounded-lg p-4">
                  <audio
                    className="w-full"
                    controls
                    src={currentSegment.audioUrl}
                  />
                </div>
              ) : (
                <div className="bg-gray-100 rounded-lg p-8 text-center">
                  <Headphones className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No media generated yet</p>
                </div>
              )}

              {/* Content Display */}
              <div className="mt-4">
                <h5 className="font-medium mb-2">Content:</h5>
                <div className="bg-gray-50 rounded p-3 max-h-32 overflow-y-auto">
                  <p className="text-sm text-gray-700">{currentSegment.content}</p>
                </div>
              </div>

              {/* Subtitles */}
              {currentSegment.subtitles && (
                <div className="mt-4">
                  <h5 className="font-medium mb-2">Subtitles:</h5>
                  <div className="bg-gray-50 rounded p-3 max-h-32 overflow-y-auto">
                    <pre className="text-xs text-gray-700 whitespace-pre-wrap">{currentSegment.subtitles}</pre>
                  </div>
                </div>
              )}
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={handlePrevious}
                className="p-3 bg-gray-200 rounded-full hover:bg-gray-300"
              >
                <SkipBack className="w-5 h-5" />
              </button>
              <button
                onClick={handlePlayPause}
                className="p-4 bg-blue-500 text-white rounded-full hover:bg-blue-600"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>
              <button
                onClick={handleNext}
                className="p-3 bg-gray-200 rounded-full hover:bg-gray-300"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No segment selected</p>
            <p className="text-sm text-gray-500 mt-2">Generate content to start listening</p>
          </div>
        )}
      </div>

      {/* Reading Progress */}
      {currentReader && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Reading Progress</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <FileText className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">
                {currentReader.audioGeneration.generatedSegments.length}
              </p>
              <p className="text-sm text-gray-600">Segments Generated</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Clock className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">
                {Math.floor(currentReader.audioGeneration.totalDuration / 60)}
              </p>
              <p className="text-sm text-gray-600">Minutes Generated</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <BookOpen className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">
                {currentReader.metadata.totalSegments}
              </p>
              <p className="text-sm text-gray-600">Total Segments</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <TrendingUp className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">
                {Math.round((currentReader.audioGeneration.generatedSegments.length / currentReader.metadata.totalSegments) * 100)}%
              </p>
              <p className="text-sm text-gray-600">Completion</p>
            </div>
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
            <Headphones className="w-6 h-6 text-purple-500" />
            <h2 className="text-xl font-bold">Story Reader</h2>
          </div>
          {currentReader && (
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">{currentReader.narratorProfile.name}</span>
            </div>
          )}
        </div>

        <div className="flex space-x-1 px-4">
          {[
            { id: 'setup', label: 'Setup', icon: Settings },
            { id: 'narrator', label: 'Narrator', icon: User },
            { id: 'content', label: 'Content', icon: FileText },
            { id: 'generation', label: 'Settings', icon: Settings },
            { id: 'player', label: 'Player', icon: Play }
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
        {activeTab === 'setup' && renderSetup()}
        {activeTab === 'narrator' && renderNarrator()}
        {activeTab === 'content' && renderContent()}
        {activeTab === 'generation' && renderGeneration()}
        {activeTab === 'player' && renderPlayer()}
      </div>
    </div>
  );
};

export default StoryReaderPanel;
