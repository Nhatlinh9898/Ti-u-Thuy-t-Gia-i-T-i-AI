import React, { useState, useEffect } from 'react';
import { Users, Mic, Settings, Play, Pause, Volume2, Heart, Brain, MessageCircle, Sparkles, User, Music, Clock, TrendingUp, ChevronRight, Plus, Edit, Trash2, BarChart3, Zap, Target, Award } from 'lucide-react';
import CharacterVoiceService from '../services/characterVoiceService';

interface CharacterVoicePanelProps {
  characters?: any[];
  onVoiceProfileCreated?: (profile: any) => void;
  onAudioGenerated?: (audio: any) => void;
}

const CharacterVoicePanel: React.FC<CharacterVoicePanelProps> = ({ 
  characters = [],
  onVoiceProfileCreated,
  onAudioGenerated 
}) => {
  const [characterVoiceService] = useState(() => new CharacterVoiceService());
  const [activeTab, setActiveTab] = useState<'profiles' | 'dialogue' | 'performance' | 'analytics'>('profiles');
  const [voiceProfiles, setVoiceProfiles] = useState<any[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<any>(null);
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [isGeneratingDialogue, setIsGeneratingDialogue] = useState(false);

  // Voice profile form
  const [voiceProfileForm, setVoiceProfileForm] = useState({
    characterId: '',
    baseVoice: {
      type: 'character_based' as 'male' | 'female' | 'neutral' | 'character_based',
      age: 'adult' as 'child' | 'teen' | 'young_adult' | 'adult' | 'elderly',
      pitch: 1.0,
      speed: 1.0,
      volume: 0.8,
      resonance: 0.7
    },
    personalityTraits: {
      confidence: 0.7,
      formality: 0.5,
      friendliness: 0.8,
      intelligence: 0.6,
      humor: 0.5,
      seriousness: 0.6,
      dominance: 0.4,
      empathy: 0.7
    },
    emotionalRange: {
      primaryEmotion: 'neutral' as 'joy' | 'sadness' | 'anger' | 'fear' | 'surprise' | 'disgust' | 'neutral',
      emotionalIntensity: 0.7,
      emotionalStability: 0.6,
      emotionalExpressiveness: 0.8
    },
    speechPatterns: {
      vocabularyComplexity: 'moderate' as 'simple' | 'moderate' | 'complex' | 'academic',
      formality: 'informal' as 'casual' | 'informal' | 'formal' | 'professional',
      pace: 'moderate' as 'slow' | 'moderate' | 'fast' | 'variable',
      pauses: 'moderate' as 'frequent' | 'moderate' | 'rare' | 'dramatic',
      emphasis: 'moderate' as 'minimal' | 'moderate' | 'strong' | 'dramatic'
    }
  });

  // Dialogue scene
  const [dialogueScene, setDialogueScene] = useState({
    sceneId: '',
    title: '',
    lines: [] as any[],
    sceneContext: {
      type: 'drama',
      location: 'indoor',
      environment: 'quiet',
      audience: 'intimate'
    }
  });

  useEffect(() => {
    if (characters.length > 0) {
      setSelectedCharacter(characters[0]);
      setVoiceProfileForm(prev => ({
        ...prev,
        characterId: characters[0].id
      }));
    }
  }, [characters]);

  const handleCreateVoiceProfile = async () => {
    if (!selectedCharacter) return;

    setIsCreatingProfile(true);
    try {
      const profile = await characterVoiceService.createCharacterVoiceProfile(
        selectedCharacter.id,
        selectedCharacter
      );

      setVoiceProfiles([...voiceProfiles, profile]);
      onVoiceProfileCreated?.(profile);
      
    } catch (error) {
      console.error('Failed to create voice profile:', error);
    } finally {
      setIsCreatingProfile(false);
    }
  };

  const handleGenerateCharacterAudio = async (characterId: string, text: string) => {
    setIsGeneratingAudio(true);
    try {
      const audio = await characterVoiceService.generateCharacterAudio(
        characterId,
        text,
        {
          emotion: 'neutral',
          relationship: 'friend',
          environment: 'indoor',
          audience: 'intimate',
          intensity: 0.7
        }
      );

      onAudioGenerated?.(audio);
      console.log('Generated character audio:', audio);
    } catch (error) {
      console.error('Failed to generate character audio:', error);
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const handleGenerateDialogue = async () => {
    setIsGeneratingDialogue(true);
    try {
      const dialogue = await characterVoiceService.generateCharacterDialogue(
        dialogueScene,
        dialogueScene.sceneContext
      );

      console.log('Generated dialogue:', dialogue);
    } catch (error) {
      console.error('Failed to generate dialogue:', error);
    } finally {
      setIsGeneratingDialogue(false);
    }
  };

  const renderProfiles = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Character Voice Profiles</h3>
        
        {/* Create Profile Form */}
        <div className="border rounded-lg p-4 mb-6">
          <h4 className="font-medium mb-4">Create Voice Profile</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Character</label>
              <select
                value={voiceProfileForm.characterId}
                onChange={(e) => {
                  const character = characters.find(c => c.id === e.target.value);
                  setSelectedCharacter(character);
                  setVoiceProfileForm({...voiceProfileForm, characterId: e.target.value});
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {characters.map(character => (
                  <option key={character.id} value={character.id}>
                    {character.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Voice Type</label>
              <select
                value={voiceProfileForm.baseVoice.type}
                onChange={(e) => setVoiceProfileForm({
                  ...voiceProfileForm,
                  baseVoice: {...voiceProfileForm.baseVoice, type: e.target.value as any}
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="neutral">Neutral</option>
                <option value="character_based">Character Based</option>
              </select>
            </div>
          </div>

          {/* Voice Characteristics */}
          <div className="space-y-4 mb-4">
            <h5 className="font-medium">Voice Characteristics</h5>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pitch</label>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={voiceProfileForm.baseVoice.pitch}
                  onChange={(e) => setVoiceProfileForm({
                    ...voiceProfileForm,
                    baseVoice: {...voiceProfileForm.baseVoice, pitch: parseFloat(e.target.value)}
                  })}
                  className="w-full"
                />
                <span className="text-sm text-gray-600">{voiceProfileForm.baseVoice.pitch}</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Speed</label>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={voiceProfileForm.baseVoice.speed}
                  onChange={(e) => setVoiceProfileForm({
                    ...voiceProfileForm,
                    baseVoice: {...voiceProfileForm.baseVoice, speed: parseFloat(e.target.value)}
                  })}
                  className="w-full"
                />
                <span className="text-sm text-gray-600">{voiceProfileForm.baseVoice.speed}x</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Volume</label>
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.1"
                  value={voiceProfileForm.baseVoice.volume}
                  onChange={(e) => setVoiceProfileForm({
                    ...voiceProfileForm,
                    baseVoice: {...voiceProfileForm.baseVoice, volume: parseFloat(e.target.value)}
                  })}
                  className="w-full"
                />
                <span className="text-sm text-gray-600">{Math.round(voiceProfileForm.baseVoice.volume * 100)}%</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Resonance</label>
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.1"
                  value={voiceProfileForm.baseVoice.resonance}
                  onChange={(e) => setVoiceProfileForm({
                    ...voiceProfileForm,
                    baseVoice: {...voiceProfileForm.baseVoice, resonance: parseFloat(e.target.value)}
                  })}
                  className="w-full"
                />
                <span className="text-sm text-gray-600">{Math.round(voiceProfileForm.baseVoice.resonance * 100)}%</span>
              </div>
            </div>
          </div>

          {/* Personality Traits */}
          <div className="space-y-4 mb-4">
            <h5 className="font-medium">Personality Traits</h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(voiceProfileForm.personalityTraits).map(([trait, value]) => (
                <div key={trait}>
                  <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                    {trait.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <input
                    type="range"
                    min="0.0"
                    max="1.0"
                    step="0.1"
                    value={value}
                    onChange={(e) => setVoiceProfileForm({
                      ...voiceProfileForm,
                      personalityTraits: {
                        ...voiceProfileForm.personalityTraits,
                        [trait]: parseFloat(e.target.value)
                      }
                    })}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-600">{Math.round(value * 100)}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Emotional Range */}
          <div className="space-y-4 mb-4">
            <h5 className="font-medium">Emotional Range</h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Primary Emotion</label>
                <select
                  value={voiceProfileForm.emotionalRange.primaryEmotion}
                  onChange={(e) => setVoiceProfileForm({
                    ...voiceProfileForm,
                    emotionalRange: {...voiceProfileForm.emotionalRange, primaryEmotion: e.target.value as any}
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="neutral">Neutral</option>
                  <option value="joy">Joy</option>
                  <option value="sadness">Sadness</option>
                  <option value="anger">Anger</option>
                  <option value="fear">Fear</option>
                  <option value="surprise">Surprise</option>
                  <option value="disgust">Disgust</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Emotional Intensity</label>
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.1"
                  value={voiceProfileForm.emotionalRange.emotionalIntensity}
                  onChange={(e) => setVoiceProfileForm({
                    ...voiceProfileForm,
                    emotionalRange: {...voiceProfileForm.emotionalRange, emotionalIntensity: parseFloat(e.target.value)}
                  })}
                  className="w-full"
                />
                <span className="text-sm text-gray-600">{Math.round(voiceProfileForm.emotionalRange.emotionalIntensity * 100)}%</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expressiveness</label>
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.1"
                  value={voiceProfileForm.emotionalRange.emotionalExpressiveness}
                  onChange={(e) => setVoiceProfileForm({
                    ...voiceProfileForm,
                    emotionalRange: {...voiceProfileForm.emotionalRange, emotionalExpressiveness: parseFloat(e.target.value)}
                  })}
                  className="w-full"
                />
                <span className="text-sm text-gray-600">{Math.round(voiceProfileForm.emotionalRange.emotionalExpressiveness * 100)}%</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleCreateVoiceProfile}
            disabled={!selectedCharacter || isCreatingProfile}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>{isCreatingProfile ? 'Creating...' : 'Create Voice Profile'}</span>
          </button>
        </div>

        {/* Voice Profiles List */}
        <div className="space-y-4">
          {voiceProfiles.map((profile) => (
            <div key={profile.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <User className="w-8 h-8 text-blue-500" />
                  <div>
                    <h4 className="font-medium">{profile.characterName}</h4>
                    <p className="text-sm text-gray-600 capitalize">
                      {profile.voiceSettings.baseVoice.type} • {profile.voiceSettings.baseVoice.age}
                    </p>
                    <p className="text-xs text-gray-500">
                      Primary Emotion: {profile.emotionalRange.primaryEmotion}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleGenerateCharacterAudio(profile.characterId, "Hello, this is a test of my voice.")}
                    disabled={isGeneratingAudio}
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

              {/* Voice Characteristics Display */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Volume2 className="w-4 h-4 text-gray-500" />
                  <span>Pitch: {profile.voiceSettings.baseVoice.pitch}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>Speed: {profile.voiceSettings.baseVoice.speed}x</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-gray-500" />
                  <span>Confidence: {Math.round(profile.personalityTraits.confidence * 100)}%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Brain className="w-4 h-4 text-gray-500" />
                  <span>Intelligence: {Math.round(profile.personalityTraits.intelligence * 100)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDialogue = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Character Dialogue Generator</h3>
        
        <div className="border rounded-lg p-4">
          <h4 className="font-medium mb-4">Create Dialogue Scene</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Scene Title</label>
              <input
                type="text"
                value={dialogueScene.title}
                onChange={(e) => setDialogueScene({...dialogueScene, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter scene title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Scene Type</label>
              <select
                value={dialogueScene.sceneContext.type}
                onChange={(e) => setDialogueScene({
                  ...dialogueScene,
                  sceneContext: {...dialogueScene.sceneContext, type: e.target.value}
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="drama">Drama</option>
                <option value="comedy">Comedy</option>
                <option value="romance">Romance</option>
                <option value="mystery">Mystery</option>
                <option value="horror">Horror</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Dialogue Lines</label>
            <div className="space-y-2">
              {dialogueScene.lines.map((line, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <select
                    value={line.characterId}
                    onChange={(e) => {
                      const newLines = [...dialogueScene.lines];
                      newLines[index].characterId = e.target.value;
                      setDialogueScene({...dialogueScene, lines: newLines});
                    }}
                    className="px-2 py-1 border border-gray-300 rounded"
                  >
                    {characters.map(character => (
                      <option key={character.id} value={character.id}>
                        {character.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={line.text}
                    onChange={(e) => {
                      const newLines = [...dialogueScene.lines];
                      newLines[index].text = e.target.value;
                      setDialogueScene({...dialogueScene, lines: newLines});
                    }}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded"
                    placeholder="Enter dialogue"
                  />
                  <select
                    value={line.emotion}
                    onChange={(e) => {
                      const newLines = [...dialogueScene.lines];
                      newLines[index].emotion = e.target.value;
                      setDialogueScene({...dialogueScene, lines: newLines});
                    }}
                    className="px-2 py-1 border border-gray-300 rounded"
                  >
                    <option value="neutral">Neutral</option>
                    <option value="happy">Happy</option>
                    <option value="sad">Sad</option>
                    <option value="angry">Angry</option>
                    <option value="excited">Excited</option>
                  </select>
                  <button
                    onClick={() => {
                      const newLines = dialogueScene.lines.filter((_, i) => i !== index);
                      setDialogueScene({...dialogueScene, lines: newLines});
                    }}
                    className="p-1 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => setDialogueScene({
                  ...dialogueScene,
                  lines: [...dialogueScene.lines, {
                    characterId: characters[0]?.id || '',
                    text: '',
                    emotion: 'neutral',
                    intensity: 0.7,
                    timing: 0
                  }]
                })}
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
              >
                <Plus className="w-4 h-4 inline mr-1" />
                Add Line
              </button>
            </div>
          </div>

          <button
            onClick={handleGenerateDialogue}
            disabled={dialogueScene.lines.length === 0 || isGeneratingDialogue}
            className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{isGeneratingDialogue ? 'Generating...' : 'Generate Dialogue'}</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderPerformance = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Award className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">95%</p>
            <p className="text-sm text-gray-600">Authenticity</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Target className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">88%</p>
            <p className="text-sm text-gray-600">Emotional Accuracy</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Zap className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">92%</p>
            <p className="text-sm text-gray-600">Consistency</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <TrendingUp className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">85%</p>
            <p className="text-sm text-gray-600">Engagement</p>
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <h4 className="font-medium mb-4">Character Performance Analysis</h4>
          <div className="space-y-3">
            {voiceProfiles.map((profile) => (
              <div key={profile.id} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium">{profile.characterName}</p>
                    <p className="text-sm text-gray-600">
                      {profile.performanceMetrics?.authenticity || 85}% authentic • 
                      {profile.performanceMetrics?.emotionalAccuracy || 88}% emotional accuracy
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium">
                    {Math.round(((profile.performanceMetrics?.authenticity || 85) + 
                    (profile.performanceMetrics?.emotionalAccuracy || 88) + 
                    (profile.performanceMetrics?.consistency || 92)) / 3)}%
                  </span>
                </div>
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
        <h3 className="text-lg font-semibold mb-4">Voice Analytics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-4">Voice Distribution</h4>
            <div className="space-y-3">
              {['male', 'female', 'neutral', 'character_based'].map(type => (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-sm capitalize">{type.replace('_', ' ')}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${Math.random() * 100}%` }}
                      />
                    </div>
                    <span className="text-sm">{Math.round(Math.random() * 100)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-4">Emotional Range Analysis</h4>
            <div className="space-y-3">
              {['joy', 'sadness', 'anger', 'fear', 'surprise', 'neutral'].map(emotion => (
                <div key={emotion} className="flex items-center justify-between">
                  <span className="text-sm capitalize">{emotion}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${Math.random() * 100}%` }}
                      />
                    </div>
                    <span className="text-sm">{Math.round(Math.random() * 100)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-4 mt-6">
          <h4 className="font-medium mb-4">Performance Trends</h4>
          <div className="h-32 bg-gray-100 rounded flex items-center justify-center">
            <TrendingUp className="w-8 h-8 text-gray-400" />
            <span className="ml-2 text-gray-600">Performance chart would go here</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="border-b border-gray-200">
        <div className="flex items-center p-4">
          <Users className="w-6 h-6 text-purple-500 mr-2" />
          <h2 className="text-xl font-bold">Character Voice System</h2>
        </div>

        <div className="flex space-x-1 px-4">
          {[
            { id: 'profiles', label: 'Voice Profiles', icon: Mic },
            { id: 'dialogue', label: 'Dialogue', icon: MessageCircle },
            { id: 'performance', label: 'Performance', icon: Award },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 }
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
        {activeTab === 'profiles' && renderProfiles()}
        {activeTab === 'dialogue' && renderDialogue()}
        {activeTab === 'performance' && renderPerformance()}
        {activeTab === 'analytics' && renderAnalytics()}
      </div>
    </div>
  );
};

export default CharacterVoicePanel;
