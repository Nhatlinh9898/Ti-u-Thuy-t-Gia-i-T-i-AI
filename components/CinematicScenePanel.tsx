import React, { useState, useEffect } from 'react';
import { 
  Film, 
  Camera, 
  Settings, 
  Play, 
  Plus, 
  Edit, 
  Trash2, 
  ChevronRight, 
  Video, 
  Music, 
  Volume2, 
  Eye, 
  Clock, 
  Zap, 
  Target, 
  Award,
  Sliders,
  Palette,
  Wand2,
  Download,
  Upload
} from 'lucide-react';
import CinematicSceneGenerator from '../services/cinematicSceneGenerator';

interface CinematicScenePanelProps {
  onSceneCreated?: (scene: any) => void;
  onVideoExported?: (video: any) => void;
}

const CinematicScenePanel: React.FC<CinematicScenePanelProps> = ({ 
  onSceneCreated,
  onVideoExported
}) => {
  const [cinematicGenerator] = useState(() => new CinematicSceneGenerator());
  const [activeTab, setActiveTab] = useState<'scenes' | 'shots' | 'effects' | 'audio' | 'export'>('scenes');
  const [cinematicScenes, setCinematicScenes] = useState<any[]>([]);
  const [selectedScene, setSelectedScene] = useState<any>(null);
  const [isGeneratingScene, setIsGeneratingScene] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);

  // Scene creation form
  const [sceneForm, setSceneForm] = useState({
    title: '',
    description: '',
    aspectRatio: '16:9',
    resolution: '1920x1080',
    frameRate: 24,
    style: 'cinematic'
  });

  // Shot configuration
  const [shotConfig, setShotConfig] = useState({
    type: 'medium',
    angle: 'eye_level',
    movement: 'static',
    focus: 'sharp',
    composition: {
      rule_of_thirds: true,
      leading_lines: false,
      framing: 'balanced',
      depth_of_field: 'medium'
    }
  });

  // Effect configuration
  const [effectConfig, setEffectConfig] = useState({
    type: 'lighting',
    intensity: 0.5,
    duration: 3,
    layer: 'background',
    description: ''
  });

  // Audio configuration
  const [audioConfig, setAudioConfig] = useState({
    mood: 'dramatic',
    tempo: 120,
    instruments: ['piano', 'strings', 'percussion'],
    volume: 0.8
  });

  useEffect(() => {
    loadCinematicScenes();
  }, []);

  const loadCinematicScenes = () => {
    const scenes = cinematicGenerator.getAllScenes();
    setCinematicScenes(scenes);
    if (scenes.length > 0) {
      setSelectedScene(scenes[0]);
    }
  };

  const handleGenerateScene = async () => {
    if (!sceneForm.title) return;

    setIsGeneratingScene(true);
    try {
      const scene = await cinematicGenerator.generateSceneFromStory(
        sceneForm.description || 'Default story content',
        sceneForm
      );
      
      setCinematicScenes([...cinematicScenes, scene]);
      setSelectedScene(scene);
      onSceneCreated?.(scene);
      
      // Reset form
      setSceneForm({
        title: '',
        description: '',
        aspectRatio: '16:9',
        resolution: '1920x1080',
        frameRate: 24,
        style: 'cinematic'
      });
      
    } catch (error) {
      console.error('Failed to generate scene:', error);
    } finally {
      setIsGeneratingScene(false);
    }
  };

  const handleExportVideo = async () => {
    if (!selectedScene) return;

    setIsGeneratingVideo(true);
    try {
      const video = await cinematicGenerator.exportToVideo(selectedScene.id);
      onVideoExported?.(video);
      console.log('Video exported:', video);
      
    } catch (error) {
      console.error('Failed to export video:', error);
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  const renderScenes = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Cinematic Scenes</h3>
        
        {/* Create Scene Form */}
        <div className="border rounded-lg p-4 mb-6">
          <h4 className="font-medium mb-4">Create New Scene</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Scene Title</label>
              <input
                type="text"
                value={sceneForm.title}
                onChange={(e) => setSceneForm({...sceneForm, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter scene title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Style</label>
              <select
                value={sceneForm.style}
                onChange={(e) => setSceneForm({...sceneForm, style: e.target.value as any})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="cinematic">Cinematic</option>
                <option value="documentary">Documentary</option>
                <option value="action">Action</option>
                <option value="drama">Drama</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Story Content</label>
            <textarea
              value={sceneForm.description}
              onChange={(e) => setSceneForm({...sceneForm, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={6}
              placeholder="Enter story content for scene generation"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Aspect Ratio</label>
              <select
                value={sceneForm.aspectRatio}
                onChange={(e) => setSceneForm({...sceneForm, aspectRatio: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="16:9">16:9 (Widescreen)</option>
                <option value="21:9">21:9 (Cinemascope)</option>
                <option value="4:3">4:3 (Traditional)</option>
                <option value="1:1">1:1 (Square)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Resolution</label>
              <select
                value={sceneForm.resolution}
                onChange={(e) => setSceneForm({...sceneForm, resolution: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1920x1080">1920x1080 (Full HD)</option>
                <option value="2560x1440">2560x1440 (2K)</option>
                <option value="3840x2160">3840x2160 (4K)</option>
                <option value="4096x2160">4096x2160 (Cinema 4K)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Frame Rate</label>
              <select
                value={sceneForm.frameRate}
                onChange={(e) => setSceneForm({...sceneForm, frameRate: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={24}>24 fps (Cinema)</option>
                <option value={30}>30 fps (Broadcast)</option>
                <option value={60}>60 fps (Smooth)</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerateScene}
            disabled={!sceneForm.title || isGeneratingScene}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <Film className="w-4 h-4" />
            <span>{isGeneratingScene ? 'Generating...' : 'Generate Scene'}</span>
          </button>
        </div>

        {/* Scenes List */}
        <div className="space-y-4">
          {cinematicScenes.map((scene) => (
            <div key={scene.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Film className="w-8 h-8 text-blue-500" />
                  <div>
                    <h4 className="font-medium">{scene.title}</h4>
                    <p className="text-sm text-gray-600">{scene.style}</p>
                    <p className="text-xs text-gray-500">{scene.duration}s duration</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedScene(scene)}
                    className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-blue-500">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Camera className="w-4 h-4 text-gray-500" />
                  <span>{scene.shots?.length || 0} Shots</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Wand2 className="w-4 h-4 text-gray-500" />
                  <span>{scene.visualEffects?.length || 0} Effects</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Music className="w-4 h-4 text-gray-500" />
                  <span>{scene.audio?.music?.length || 0} Tracks</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Video className="w-4 h-4 text-gray-500" />
                  <span>{scene.metadata?.resolution || 'Unknown'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderShots = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Camera Shots</h3>
        
        {selectedScene ? (
          <>
            {/* Shot Configuration */}
            <div className="border rounded-lg p-4 mb-6">
              <h4 className="font-medium mb-4">Shot Configuration</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Shot Type</label>
                  <select
                    value={shotConfig.type}
                    onChange={(e) => setShotConfig({...shotConfig, type: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="wide">Wide</option>
                    <option value="medium">Medium</option>
                    <option value="close_up">Close Up</option>
                    <option value="extreme_close_up">Extreme Close Up</option>
                    <option value="establishing">Establishing</option>
                    <option value="point_of_view">Point of View</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Camera Angle</label>
                  <select
                    value={shotConfig.angle}
                    onChange={(e) => setShotConfig({...shotConfig, angle: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="eye_level">Eye Level</option>
                    <option value="high_angle">High Angle</option>
                    <option value="low_angle">Low Angle</option>
                    <option value="dutch_angle">Dutch Angle</option>
                    <option value="bird_eye">Bird's Eye</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Movement</label>
                  <select
                    value={shotConfig.movement}
                    onChange={(e) => setShotConfig({...shotConfig, movement: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="static">Static</option>
                    <option value="pan">Pan</option>
                    <option value="tilt">Tilt</option>
                    <option value="dolly">Dolly</option>
                    <option value="zoom">Zoom</option>
                    <option value="handheld">Handheld</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Focus</label>
                  <select
                    value={shotConfig.focus}
                    onChange={(e) => setShotConfig({...shotConfig, focus: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="sharp">Sharp</option>
                    <option value="soft">Soft</option>
                    <option value="rack_focus">Rack Focus</option>
                    <option value="deep_focus">Deep Focus</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <h5 className="font-medium mb-2">Composition</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={shotConfig.composition.rule_of_thirds}
                        onChange={(e) => setShotConfig({
                          ...shotConfig,
                          composition: {...shotConfig.composition, rule_of_thirds: e.target.checked}
                        })}
                        className="rounded"
                      />
                      <span className="text-sm">Rule of Thirds</span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={shotConfig.composition.leading_lines}
                        onChange={(e) => setShotConfig({
                          ...shotConfig,
                          composition: {...shotConfig.composition, leading_lines: e.target.checked}
                        })}
                        className="rounded"
                      />
                      <span className="text-sm">Leading Lines</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Shots Preview */}
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-4">Shot Preview</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-100 rounded p-4">
                  <h5 className="font-medium mb-2">Shot Type: {shotConfig.type}</h5>
                  <p className="text-sm text-gray-600">Angle: {shotConfig.angle}</p>
                  <p className="text-sm text-gray-600">Movement: {shotConfig.movement}</p>
                  <p className="text-sm text-gray-600">Focus: {shotConfig.focus}</p>
                </div>
                <div className="bg-gray-100 rounded p-4">
                  <h5 className="font-medium mb-2">Composition</h5>
                  <p className="text-sm">Rule of Thirds: {shotConfig.composition.rule_of_thirds ? 'Yes' : 'No'}</p>
                  <p className="text-sm">Leading Lines: {shotConfig.composition.leading_lines ? 'Yes' : 'No'}</p>
                  <p className="text-sm">Framing: {shotConfig.composition.framing}</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Film className="w-12 h-12 mx-auto mb-4" />
            <p>Select a scene to configure shots</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderEffects = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Visual Effects</h3>
        
        {selectedScene ? (
          <>
            {/* Effect Configuration */}
            <div className="border rounded-lg p-4 mb-6">
              <h4 className="font-medium mb-4">Add Visual Effect</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Effect Type</label>
                  <select
                    value={effectConfig.type}
                    onChange={(e) => setEffectConfig({...effectConfig, type: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="particle">Particle</option>
                    <option value="lighting">Lighting</option>
                    <option value="color_grading">Color Grading</option>
                    <option value="motion_blur">Motion Blur</option>
                    <option value="depth_of_field">Depth of Field</option>
                    <option value="lens_flare">Lens Flare</option>
                    <option value="film_grain">Film Grain</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Layer</label>
                  <select
                    value={effectConfig.layer}
                    onChange={(e) => setEffectConfig({...effectConfig, layer: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="foreground">Foreground</option>
                    <option value="midground">Midground</option>
                    <option value="background">Background</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Intensity</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={effectConfig.intensity}
                    onChange={(e) => setEffectConfig({...effectConfig, intensity: parseFloat(e.target.value)})}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-600">{Math.round(effectConfig.intensity * 100)}%</span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration (seconds)</label>
                  <input
                    type="number"
                    min="0.5"
                    max="10"
                    step="0.5"
                    value={effectConfig.duration}
                    onChange={(e) => setEffectConfig({...effectConfig, duration: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={effectConfig.description}
                  onChange={(e) => setEffectConfig({...effectConfig, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Describe the visual effect"
                />
              </div>

              <button
                onClick={() => {
                  // Add effect to scene
                  console.log('Adding effect:', effectConfig);
                }}
                className="w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 flex items-center justify-center space-x-2"
              >
                <Wand2 className="w-4 h-4" />
                <span>Add Effect</span>
              </button>
            </div>

            {/* Current Effects */}
            <div className="space-y-4">
              <h4 className="font-medium mb-4">Current Effects</h4>
              {selectedScene.visualEffects?.map((effect: any, index) => (
                <div key={effect.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <Wand2 className="w-6 h-6 text-purple-500" />
                      <div>
                        <h5 className="font-medium">{effect.type}</h5>
                        <p className="text-sm text-gray-600">{effect.layer}</p>
                        <p className="text-xs text-gray-500">Intensity: {Math.round(effect.intensity * 100)}%</p>
                      </div>
                    </div>
                    <button className="p-2 text-gray-500 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Wand2 className="w-12 h-12 mx-auto mb-4" />
            <p>Select a scene to add effects</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderAudio = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Audio & Soundtrack</h3>
        
        {selectedScene ? (
          <>
            {/* Audio Configuration */}
            <div className="border rounded-lg p-4 mb-6">
              <h4 className="font-medium mb-4">Generate Soundtrack</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mood</label>
                  <select
                    value={audioConfig.mood}
                    onChange={(e) => setAudioConfig({...audioConfig, mood: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="dramatic">Dramatic</option>
                    <option value="romantic">Romantic</option>
                    <option value="mysterious">Mysterious</option>
                    <option value="action">Action</option>
                    <option value="comedy">Comedy</option>
                    <option value="horror">Horror</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tempo (BPM)</label>
                  <input
                    type="number"
                    min="60"
                    max="180"
                    value={audioConfig.tempo}
                    onChange={(e) => setAudioConfig({...audioConfig, tempo: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Instruments</label>
                <div className="flex flex-wrap gap-2">
                  {['piano', 'strings', 'percussion', 'brass', 'woodwind', 'synthesizer'].map(instrument => (
                    <label key={instrument} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={audioConfig.instruments.includes(instrument)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setAudioConfig({
                              ...audioConfig,
                              instruments: [...audioConfig.instruments, instrument]
                            });
                          } else {
                            setAudioConfig({
                              ...audioConfig,
                              instruments: audioConfig.instruments.filter(i => i !== instrument)
                            });
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">{instrument}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Master Volume</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={audioConfig.volume}
                  onChange={(e) => setAudioConfig({...audioConfig, volume: parseFloat(e.target.value)})}
                  className="w-full"
                />
                <span className="text-sm text-gray-600">{Math.round(audioConfig.volume * 100)}%</span>
              </div>

              <button
                onClick={() => {
                  // Generate soundtrack
                  console.log('Generating soundtrack:', audioConfig);
                }}
                className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center justify-center space-x-2"
              >
                <Music className="w-4 h-4" />
                <span>Generate Soundtrack</span>
              </button>
            </div>

            {/* Current Audio Tracks */}
            <div className="space-y-4">
              <h4 className="font-medium mb-4">Audio Tracks</h4>
              {selectedScene.audio?.music?.map((track: any, index) => (
                <div key={track.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <Music className="w-6 h-6 text-green-500" />
                      <div>
                        <h5 className="font-medium">{track.title}</h5>
                        <p className="text-sm text-gray-600">{track.tempo} BPM</p>
                        <p className="text-xs text-gray-500">{track.duration}s</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-500 hover:text-blue-500">
                        <Volume2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Music className="w-12 h-12 mx-auto mb-4" />
            <p>Select a scene to configure audio</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderExport = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Export Video</h3>
        
        {selectedScene ? (
          <>
            {/* Export Configuration */}
            <div className="border rounded-lg p-4 mb-6">
              <h4 className="font-medium mb-4">Export Settings</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="mp4">MP4</option>
                    <option value="mov">MOV</option>
                    <option value="avi">AVI</option>
                    <option value="webm">WebM</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quality</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="ultra">Ultra</option>
                  </select>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <h5 className="font-medium mb-2">Scene Summary</h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{selectedScene.duration}s</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Shots:</span>
                    <span className="font-medium">{selectedScene.shots?.length || 0}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Effects:</span>
                    <span className="font-medium">{selectedScene.visualEffects?.length || 0}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Audio Tracks:</span>
                    <span className="font-medium">{selectedScene.audio?.music?.length || 0}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleExportVideo}
                disabled={isGeneratingVideo}
                className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>{isGeneratingVideo ? 'Exporting...' : 'Export Video'}</span>
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Video className="w-12 h-12 mx-auto mb-4" />
            <p>Select a scene to export</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="border-b border-gray-200">
        <div className="flex items-center p-4">
          <Film className="w-6 h-6 text-red-500 mr-2" />
          <h2 className="text-xl font-bold">Cinematic Scene Generator</h2>
        </div>

        <div className="flex space-x-1 px-4">
          {[
            { id: 'scenes', label: 'Scenes', icon: Film },
            { id: 'shots', label: 'Shots', icon: Camera },
            { id: 'effects', label: 'Effects', icon: Wand2 },
            { id: 'audio', label: 'Audio', icon: Music },
            { id: 'export', label: 'Export', icon: Download }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-red-500 text-red-600'
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
        {activeTab === 'scenes' && renderScenes()}
        {activeTab === 'shots' && renderShots()}
        {activeTab === 'effects' && renderEffects()}
        {activeTab === 'audio' && renderAudio()}
        {activeTab === 'export' && renderExport()}
      </div>
    </div>
  );
};

export default CinematicScenePanel;
