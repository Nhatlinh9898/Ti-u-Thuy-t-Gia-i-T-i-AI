import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Users, 
  Play, 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  ChevronRight, 
  Book, 
  Map, 
  Compass, 
  Heart, 
  Brain, 
  Zap, 
  Target, 
  Award,
  TreePine,
  MessageSquare,
  Eye,
  Clock,
  TrendingUp
} from 'lucide-react';
import InteractiveStoryEngine from '../services/interactiveStoryEngine';

interface InteractiveStoryPanelProps {
  onWorldCreated?: (world: any) => void;
  onSessionStarted?: (session: any) => void;
  onChoiceMade?: (choice: any) => void;
}

const InteractiveStoryPanel: React.FC<InteractiveStoryPanelProps> = ({ 
  onWorldCreated,
  onSessionStarted,
  onChoiceMade
}) => {
  const [storyEngine] = useState(() => new InteractiveStoryEngine());
  const [activeTab, setActiveTab] = useState<'worlds' | 'characters' | 'scenes' | 'play'>('worlds');
  const [storyWorlds, setStoryWorlds] = useState<any[]>([]);
  const [selectedWorld, setSelectedWorld] = useState<any>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<any>(null);
  const [currentSession, setCurrentSession] = useState<any>(null);
  const [isCreatingWorld, setIsCreatingWorld] = useState(false);
  const [isCreatingCharacter, setIsCreatingCharacter] = useState(false);
  const [isCreatingScene, setIsCreatingScene] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // World creation form
  const [worldForm, setWorldForm] = useState({
    name: '',
    description: '',
    genre: 'fantasy',
    setting: {
      timePeriod: 'medieval',
      location: 'fantasy kingdom',
      atmosphere: 'magical'
    }
  });

  // Character creation form
  const [characterForm, setCharacterForm] = useState({
    name: '',
    role: 'protagonist',
    personality: {
      traits: ['brave', 'curious'],
      values: ['justice', 'freedom'],
      goals: ['save world']
    },
    abilities: []
  });

  // Scene creation form
  const [sceneForm, setSceneForm] = useState({
    title: '',
    description: '',
    characters: [],
    setting: {
      location: '',
      timeOfDay: 'morning',
      weather: 'clear'
    }
  });

  // Current story context
  const [storyContext, setStoryContext] = useState<any>(null);
  const [currentChoices, setCurrentChoices] = useState<any[]>([]);
  const [currentContent, setCurrentContent] = useState<any>(null);

  useEffect(() => {
    loadStoryWorlds();
  }, []);

  const loadStoryWorlds = () => {
    const worlds = storyEngine.getAllStoryWorlds();
    setStoryWorlds(worlds);
    if (worlds.length > 0) {
      setSelectedWorld(worlds[0]);
    }
  };

  const handleCreateWorld = async () => {
    if (!worldForm.name) return;

    setIsCreatingWorld(true);
    try {
      const world = await storyEngine.createStoryWorld(worldForm);
      setStoryWorlds([...storyWorlds, world]);
      setSelectedWorld(world);
      onWorldCreated?.(world);
      
      // Reset form
      setWorldForm({
        name: '',
        description: '',
        genre: 'fantasy',
        setting: {
          timePeriod: 'medieval',
          location: 'fantasy kingdom',
          atmosphere: 'magical'
        }
      });
      
    } catch (error) {
      console.error('Failed to create world:', error);
    } finally {
      setIsCreatingWorld(false);
    }
  };

  const handleCreateCharacter = async () => {
    if (!selectedWorld || !characterForm.name) return;

    setIsCreatingCharacter(true);
    try {
      const character = await storyEngine.addCharacter(selectedWorld.id, characterForm);
      setSelectedWorld({
        ...selectedWorld,
        characters: [...selectedWorld.characters, character]
      });
      setSelectedCharacter(character);
      
      // Reset form
      setCharacterForm({
        name: '',
        role: 'protagonist',
        personality: {
          traits: ['brave', 'curious'],
          values: ['justice', 'freedom'],
          goals: ['save world']
        },
        abilities: []
      });
      
    } catch (error) {
      console.error('Failed to create character:', error);
    } finally {
      setIsCreatingCharacter(false);
    }
  };

  const handleCreateScene = async () => {
    if (!selectedWorld || !sceneForm.title) return;

    setIsCreatingScene(true);
    try {
      const scene = await storyEngine.createScene(selectedWorld.id, sceneForm);
      console.log('Scene created:', scene);
      
      // Reset form
      setSceneForm({
        title: '',
        description: '',
        characters: [],
        setting: {
          location: '',
          timeOfDay: 'morning',
          weather: 'clear'
        }
      });
      
    } catch (error) {
      console.error('Failed to create scene:', error);
    } finally {
      setIsCreatingScene(false);
    }
  };

  const handleStartSession = async () => {
    if (!selectedWorld) return;

    try {
      const session = await storyEngine.startInteractiveSession(selectedWorld.id, 'user-001');
      setCurrentSession(session);
      setStoryContext(storyEngine.getCurrentContext());
      setIsPlaying(true);
      onSessionStarted?.(session);
      
      // Generate initial content
      await generateInitialContent();
      
    } catch (error) {
      console.error('Failed to start session:', error);
    }
  };

  const handleMakeChoice = async (choice: any) => {
    if (!currentSession) return;

    try {
      const nextBranch = await storyEngine.handleUserChoice(choice);
      setStoryContext(storyEngine.getCurrentContext());
      setCurrentChoices(nextBranch.choices);
      setCurrentContent(nextBranch);
      onChoiceMade?.(choice);
      
    } catch (error) {
      console.error('Failed to handle choice:', error);
    }
  };

  const generateInitialContent = async () => {
    if (!storyContext) return;

    try {
      const content = await storyEngine.generateDynamicContent(storyContext);
      setCurrentContent(content);
      setCurrentChoices(content.choices || []);
      
    } catch (error) {
      console.error('Failed to generate content:', error);
    }
  };

  const renderWorlds = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Story Worlds</h3>
        
        {/* Create World Form */}
        <div className="border rounded-lg p-4 mb-6">
          <h4 className="font-medium mb-4">Create New World</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">World Name</label>
              <input
                type="text"
                value={worldForm.name}
                onChange={(e) => setWorldForm({...worldForm, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter world name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Genre</label>
              <select
                value={worldForm.genre}
                onChange={(e) => setWorldForm({...worldForm, genre: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="fantasy">Fantasy</option>
                <option value="scifi">Science Fiction</option>
                <option value="mystery">Mystery</option>
                <option value="romance">Romance</option>
                <option value="horror">Horror</option>
                <option value="adventure">Adventure</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={worldForm.description}
              onChange={(e) => setWorldForm({...worldForm, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Describe your world"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
              <select
                value={worldForm.setting.timePeriod}
                onChange={(e) => setWorldForm({
                  ...worldForm,
                  setting: {...worldForm.setting, timePeriod: e.target.value}
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ancient">Ancient</option>
                <option value="medieval">Medieval</option>
                <option value="modern">Modern</option>
                <option value="futuristic">Futuristic</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={worldForm.setting.location}
                onChange={(e) => setWorldForm({
                  ...worldForm,
                  setting: {...worldForm.setting, location: e.target.value}
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter location"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Atmosphere</label>
              <select
                value={worldForm.setting.atmosphere}
                onChange={(e) => setWorldForm({
                  ...worldForm,
                  setting: {...worldForm.setting, atmosphere: e.target.value}
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="magical">Magical</option>
                <option value="mysterious">Mysterious</option>
                <option value="dark">Dark</option>
                <option value="peaceful">Peaceful</option>
                <option value="chaotic">Chaotic</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleCreateWorld}
            disabled={!worldForm.name || isCreatingWorld}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <Globe className="w-4 h-4" />
            <span>{isCreatingWorld ? 'Creating...' : 'Create World'}</span>
          </button>
        </div>

        {/* Worlds List */}
        <div className="space-y-4">
          {storyWorlds.map((world) => (
            <div key={world.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Globe className="w-8 h-8 text-blue-500" />
                  <div>
                    <h4 className="font-medium">{world.name}</h4>
                    <p className="text-sm text-gray-600 capitalize">{world.genre}</p>
                    <p className="text-xs text-gray-500">{world.setting.location}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedWorld(world)}
                    className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                  >
                    <Play className="w-4 h-4" />
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
                  <Users className="w-4 h-4 text-gray-500" />
                  <span>{world.characters?.length || 0} Characters</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Book className="w-4 h-4 text-gray-500" />
                  <span>{world.plotPoints?.length || 0} Plot Points</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Map className="w-4 h-4 text-gray-500" />
                  <span>{world.setting?.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>{world.metadata?.estimatedPlaytime || 'Unknown'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCharacters = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Characters</h3>
        
        {selectedWorld ? (
          <>
            {/* Create Character Form */}
            <div className="border rounded-lg p-4 mb-6">
              <h4 className="font-medium mb-4">Create New Character</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Character Name</label>
                  <input
                    type="text"
                    value={characterForm.name}
                    onChange={(e) => setCharacterForm({...characterForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter character name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <select
                    value={characterForm.role}
                    onChange={(e) => setCharacterForm({...characterForm, role: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="protagonist">Protagonist</option>
                    <option value="antagonist">Antagonist</option>
                    <option value="supporting">Supporting</option>
                    <option value="npc">NPC</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Personality Traits</label>
                <div className="flex flex-wrap gap-2">
                  {['brave', 'curious', 'compassionate', 'wise', 'funny', 'serious', 'mysterious', 'loyal', 'ambitious'].map(trait => (
                    <label key={trait} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={characterForm.personality.traits.includes(trait)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setCharacterForm({
                              ...characterForm,
                              personality: {
                                ...characterForm.personality,
                                traits: [...characterForm.personality.traits, trait]
                              }
                            });
                          } else {
                            setCharacterForm({
                              ...characterForm,
                              personality: {
                                ...characterForm.personality,
                                traits: characterForm.personality.traits.filter(t => t !== trait)
                              }
                            });
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">{trait}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={handleCreateCharacter}
                disabled={!characterForm.name || isCreatingCharacter}
                className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <Users className="w-4 h-4" />
                <span>{isCreatingCharacter ? 'Creating...' : 'Create Character'}</span>
              </button>
            </div>

            {/* Characters List */}
            <div className="space-y-4">
              {selectedWorld.characters?.map((character: any) => (
                <div key={character.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Users className="w-8 h-8 text-green-500" />
                      <div>
                        <h4 className="font-medium">{character.name}</h4>
                        <p className="text-sm text-gray-600 capitalize">{character.role}</p>
                        <p className="text-xs text-gray-500">
                          {character.personality?.traits?.join(', ') || 'No traits defined'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedCharacter(character)}
                        className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                      >
                        Select
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
                      <Heart className="w-4 h-4 text-gray-500" />
                      <span>Health: {character.currentState?.health || 100}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Brain className="w-4 h-4 text-gray-500" />
                      <span>Mood: {character.currentState?.mood || 'neutral'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Map className="w-4 h-4 text-gray-500" />
                      <span>Location: {character.currentState?.location || 'Unknown'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-gray-500" />
                      <span>{character.abilities?.length || 0} Abilities</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Globe className="w-12 h-12 mx-auto mb-4" />
            <p>Select a world to manage characters</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderScenes = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Scenes</h3>
        
        {selectedWorld ? (
          <>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Characters</label>
                  <select
                    multiple
                    value={sceneForm.characters}
                    onChange={(e) => setSceneForm({
                      ...sceneForm,
                      characters: Array.from(e.target.selectedOptions, option => option.value)
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {selectedWorld.characters?.map((character: any) => (
                      <option key={character.id} value={character.id}>
                        {character.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={sceneForm.description}
                  onChange={(e) => setSceneForm({...sceneForm, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Describe the scene"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={sceneForm.setting.location}
                    onChange={(e) => setSceneForm({
                      ...sceneForm,
                      setting: {...sceneForm.setting, location: e.target.value}
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter location"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time of Day</label>
                  <select
                    value={sceneForm.setting.timeOfDay}
                    onChange={(e) => setSceneForm({
                      ...sceneForm,
                      setting: {...sceneForm.setting, timeOfDay: e.target.value}
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                    <option value="evening">Evening</option>
                    <option value="night">Night</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Weather</label>
                  <select
                    value={sceneForm.setting.weather}
                    onChange={(e) => setSceneForm({
                      ...sceneForm,
                      setting: {...sceneForm.setting, weather: e.target.value}
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="clear">Clear</option>
                    <option value="cloudy">Cloudy</option>
                    <option value="rainy">Rainy</option>
                    <option value="stormy">Stormy</option>
                    <option value="snowy">Snowy</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleCreateScene}
                disabled={!sceneForm.title || isCreatingScene}
                className="w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                <span>{isCreatingScene ? 'Creating...' : 'Create Scene'}</span>
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Globe className="w-12 h-12 mx-auto mb-4" />
            <p>Select a world to manage scenes</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderPlay = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Interactive Story</h3>
        
        {!currentSession ? (
          <div className="text-center py-8">
            {selectedWorld ? (
              <div>
                <div className="mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="w-8 h-8 text-blue-500" />
                  </div>
                  <h4 className="text-lg font-medium mb-2">{selectedWorld.name}</h4>
                  <p className="text-gray-600 mb-4">{selectedWorld.description}</p>
                  <button
                    onClick={handleStartSession}
                    className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center justify-center space-x-2 mx-auto"
                  >
                    <Play className="w-5 h-5" />
                    <span>Start Interactive Session</span>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>{selectedWorld.characters?.length || 0} Characters</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Book className="w-4 h-4" />
                    <span>{selectedWorld.plotPoints?.length || 0} Story Points</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{selectedWorld.metadata?.estimatedPlaytime || 'Unknown'}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <Globe className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">Select a world to start playing</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Session Info */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-medium">Session Active</h4>
                  <p className="text-sm text-gray-600">
                    Started: {currentSession.startTime.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600">Playing</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-gray-500" />
                  <span>Branch: {currentSession.progress.branchesExplored}/{currentSession.progress.totalBranches}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-gray-500" />
                  <span>{Math.round(currentSession.progress.completionPercentage)}% Complete</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-gray-500" />
                  <span>{currentSession.achievements.length} Achievements</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>{Math.round((Date.now() - currentSession.startTime.getTime()) / 60000)} min</span>
                </div>
              </div>
            </div>

            {/* Current Content */}
            {currentContent && (
              <div className="border rounded-lg p-6">
                <h4 className="font-medium mb-4">Current Scene</h4>
                
                <div className="prose max-w-none mb-6">
                  <p className="text-gray-800 leading-relaxed">
                    {currentContent.content}
                  </p>
                </div>

                {/* Scene Description */}
                {currentContent.sceneDescription && (
                  <div className="bg-gray-50 rounded p-4 mb-6">
                    <h5 className="font-medium mb-2">Scene Description</h5>
                    <p className="text-sm text-gray-600">{currentContent.sceneDescription}</p>
                  </div>
                )}

                {/* Choices */}
                {currentChoices.length > 0 && (
                  <div className="space-y-3">
                    <h5 className="font-medium mb-4">What do you do?</h5>
                    {currentChoices.map((choice: any) => (
                      <button
                        key={choice.id}
                        onClick={() => handleMakeChoice(choice)}
                        className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                      >
                        <div className="flex items-start space-x-3">
                          <ChevronRight className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-800">{choice.text}</p>
                            {choice.description && (
                              <p className="text-sm text-gray-600 mt-1">{choice.description}</p>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Story Context */}
            {storyContext && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium mb-3">World State</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium">{storyContext.worldState.currentLocation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span className="font-medium">{storyContext.worldState.timeOfDay}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Weather:</span>
                      <span className="font-medium">{storyContext.worldState.weather}</span>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium mb-3">Emotional State</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current:</span>
                      <span className="font-medium capitalize">{storyContext.currentEmotion}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Choices Made:</span>
                      <span className="font-medium">{storyContext.userHistory.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Branches Visited:</span>
                      <span className="font-medium">{storyContext.visitedBranches.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="border-b border-gray-200">
        <div className="flex items-center p-4">
          <TreePine className="w-6 h-6 text-green-500 mr-2" />
          <h2 className="text-xl font-bold">Interactive Story Engine</h2>
        </div>

        <div className="flex space-x-1 px-4">
          {[
            { id: 'worlds', label: 'Worlds', icon: Globe },
            { id: 'characters', label: 'Characters', icon: Users },
            { id: 'scenes', label: 'Scenes', icon: Eye },
            { id: 'play', label: 'Play', icon: Play }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-green-500 text-green-600'
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
        {activeTab === 'worlds' && renderWorlds()}
        {activeTab === 'characters' && renderCharacters()}
        {activeTab === 'scenes' && renderScenes()}
        {activeTab === 'play' && renderPlay()}
      </div>
    </div>
  );
};

export default InteractiveStoryPanel;
