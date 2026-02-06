import React, { useState, useEffect } from 'react';
import { User, Plus, Edit, Trash2, Download, Upload, Eye, Settings, Heart, Brain, Target, Users, TrendingUp } from 'lucide-react';
import CharacterDevelopmentService from '../services/characterDevelopmentService';
import { NovelNode } from '../types';

interface CharacterDevelopmentPanelProps {
  novel?: NovelNode;
  onCharacterCreated?: (character: any) => void;
  onCharacterUpdated?: (character: any) => void;
}

const CharacterDevelopmentPanel: React.FC<CharacterDevelopmentPanelProps> = ({ 
  novel, 
  onCharacterCreated,
  onCharacterUpdated 
}) => {
  const [characterService] = useState(() => new CharacterDevelopmentService());
  const [activeTab, setActiveTab] = useState<'templates' | 'characters' | 'relationships' | 'development' | 'analysis'>('templates');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [characters, setCharacters] = useState<any[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [templates, setTemplates] = useState<any[]>([]);

  useEffect(() => {
    const availableTemplates = characterService.getAvailableTemplates();
    setTemplates(availableTemplates);
  }, [characterService]);

  const handleCreateCharacter = async () => {
    if (!selectedTemplate) return;

    setIsCreating(true);
    try {
      const character = await characterService.createCharacterFromTemplate(
        selectedTemplate,
        `Character ${characters.length + 1}`
      );
      
      setCharacters([...characters, character]);
      onCharacterCreated?.(character);
      setSelectedCharacter(character);
    } catch (error) {
      console.error('Failed to create character:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleGenerateRelationships = async (character: any) => {
    try {
      const otherCharacters = characters.filter(c => c.id !== character.id);
      const relationships = await characterService.generateRelationships(character, otherCharacters);
      
      const updatedCharacter = {
        ...character,
        relationships
      };
      
      setCharacters(characters.map(c => c.id === character.id ? updatedCharacter : c));
      if (selectedCharacter?.id === character.id) {
        setSelectedCharacter(updatedCharacter);
      }
      
      onCharacterUpdated?.(updatedCharacter);
    } catch (error) {
      console.error('Failed to generate relationships:', error);
    }
  };

  const handleGenerateDevelopment = async (character: any) => {
    try {
      // Mock chapters for development
      const mockChapters = [
        { id: 'ch1', title: 'Chapter 1', content: 'Introduction to character' },
        { id: 'ch2', title: 'Chapter 2', content: 'Character faces challenge' },
        { id: 'ch3', title: 'Chapter 3', content: 'Character growth moment' }
      ];
      
      const developments = await characterService.generateDevelopmentArc(character, mockChapters);
      
      const updatedCharacter = {
        ...character,
        development: developments
      };
      
      setCharacters(characters.map(c => c.id === character.id ? updatedCharacter : c));
      if (selectedCharacter?.id === character.id) {
        setSelectedCharacter(updatedCharacter);
      }
      
      onCharacterUpdated?.(updatedCharacter);
    } catch (error) {
      console.error('Failed to generate development:', error);
    }
  };

  const handleAnalyzeCharacter = (character: any) => {
    const profile = characterService.analyzeCharacter(character);
    setSelectedCharacter({
      ...character,
      profile
    });
  };

  const handleExportCharacter = (character: any) => {
    const exported = characterService.exportCharacter(character);
    const blob = new Blob([exported], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${character.name}-character.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportCharacter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = characterService.importCharacter(e.target?.result as string);
        setCharacters([...characters, imported]);
        onCharacterCreated?.(imported);
      } catch (error) {
        console.error('Failed to import character:', error);
      }
    };
    reader.readAsText(file);
  };

  const renderTemplates = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Character Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedTemplate === template.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedTemplate(template.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{template.name}</h4>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {template.archetype}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{template.description}</p>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Genre:</span>
                  <span className="font-medium capitalize">{template.genre}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Role:</span>
                  <span className="font-medium capitalize">{template.baseCharacter.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {selectedTemplate ? `Selected: ${templates.find(t => t.id === selectedTemplate)?.name}` : 'No template selected'}
          </div>
          <button
            onClick={handleCreateCharacter}
            disabled={!selectedTemplate || isCreating}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <User className="w-4 h-4" />
            <span>{isCreating ? 'Creating...' : 'Create Character'}</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderCharacters = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Characters</h3>
          <div className="flex space-x-2">
            <label className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 flex items-center space-x-1 cursor-pointer">
              <Upload className="w-3 h-3" />
              <span>Import</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportCharacter}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {characters.map((character) => (
            <div
              key={character.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedCharacter?.id === character.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedCharacter(character)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-blue-500" />
                  <h4 className="font-medium">{character.name}</h4>
                </div>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded capitalize">
                  {character.role}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Age:</span>
                  <span className="font-medium">{character.basicInfo.age}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Gender:</span>
                  <span className="font-medium capitalize">{character.basicInfo.gender}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Occupation:</span>
                  <span className="font-medium">{character.basicInfo.occupation}</span>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1">
                {character.basicInfo.personality.slice(0, 3).map((trait: string, index: number) => (
                  <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {trait}
                  </span>
                ))}
                {character.basicInfo.personality.length > 3 && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    +{character.basicInfo.personality.length - 3}
                  </span>
                )}
              </div>

              <div className="mt-3 flex space-x-2">
                <button className="p-1 text-gray-500 hover:text-blue-500">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-1 text-gray-500 hover:text-green-500">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-1 text-gray-500 hover:text-purple-500">
                  <Brain className="w-4 h-4" />
                </button>
                <button className="p-1 text-gray-500 hover:text-orange-500">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {characters.length === 0 && (
          <div className="text-center py-8">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No characters created yet.</p>
            <p className="text-sm text-gray-500 mt-2">Create your first character to get started.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderRelationships = () => (
    <div className="space-y-6">
      {selectedCharacter ? (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Relationships - {selectedCharacter.name}</h3>
            <button
              onClick={() => handleGenerateRelationships(selectedCharacter)}
              className="px-3 py-1 bg-purple-500 text-white rounded text-sm hover:bg-purple-600 flex items-center space-x-1"
            >
              <Users className="w-3 h-3" />
              <span>Generate</span>
            </button>
          </div>

          <div className="space-y-4">
            {selectedCharacter.relationships?.map((relationship: any) => (
              <div key={relationship.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-purple-500" />
                    <h4 className="font-medium">{relationship.targetCharacterName}</h4>
                    <span className="text-xs bg-purple-100 px-2 py-1 rounded capitalize">
                      {relationship.type}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      relationship.currentStatus === 'positive' ? 'bg-green-100 text-green-800' :
                      relationship.currentStatus === 'negative' ? 'bg-red-100 text-red-800' :
                      relationship.currentStatus === 'complicated' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {relationship.currentStatus}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-700 mb-3">{relationship.description}</p>

                {relationship.keyMoments && relationship.keyMoments.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Key Moments:</p>
                    <div className="space-y-2">
                      {relationship.keyMoments.slice(0, 2).map((moment: any, index: number) => (
                        <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                          <p className="text-gray-700">{moment.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Impact: {moment.emotionalImpact}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {(!selectedCharacter.relationships || selectedCharacter.relationships.length === 0) && (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No relationships defined.</p>
              <p className="text-sm text-gray-500 mt-2">Generate relationships to explore character dynamics.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No character selected.</p>
          <p className="text-sm text-gray-500 mt-2">Select a character to manage relationships.</p>
        </div>
      )}
    </div>
  );

  const renderDevelopment = () => (
    <div className="space-y-6">
      {selectedCharacter ? (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Character Development - {selectedCharacter.name}</h3>
            <button
              onClick={() => handleGenerateDevelopment(selectedCharacter)}
              className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 flex items-center space-x-1"
            >
              <TrendingUp className="w-3 h-3" />
              <span>Generate Arc</span>
            </button>
          </div>

          <div className="space-y-4">
            {selectedCharacter.development?.map((dev: any, index: number) => (
              <div key={dev.chapterId} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <Target className="w-5 h-5 text-green-500" />
                    <h4 className="font-medium">{dev.chapterTitle}</h4>
                    <span className={`text-xs px-2 py-1 rounded ${
                      dev.significance === 'transformative' ? 'bg-red-100 text-red-800' :
                      dev.significance === 'major' ? 'bg-orange-100 text-orange-800' :
                      dev.significance === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {dev.significance}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">
                      Growth: {dev.growth > 0 ? '+' : ''}{dev.growth}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-700 mb-3">{dev.description}</p>

                {dev.changes && dev.changes.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Changes:</p>
                    <div className="space-y-1">
                      {dev.changes.slice(0, 3).map((change: any, idx: number) => (
                        <div key={idx} className="text-xs bg-green-50 p-2 rounded">
                          <span className="font-medium">{change.aspect}:</span>
                          <span className="text-gray-600"> {change.before} → {change.after}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {dev.triggers && dev.triggers.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Triggers:</p>
                    <div className="flex flex-wrap gap-1">
                      {dev.triggers.map((trigger: string, idx: number) => (
                        <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {trigger}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {(!selectedCharacter.development || selectedCharacter.development.length === 0) && (
            <div className="text-center py-8">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No development arc defined.</p>
              <p className="text-sm text-gray-500 mt-2">Generate a development arc to track character growth.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No character selected.</p>
          <p className="text-sm text-gray-500 mt-2">Select a character to manage development.</p>
        </div>
      )}
    </div>
  );

  const renderAnalysis = () => (
    <div className="space-y-6">
      {selectedCharacter?.profile ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Character Analysis - {selectedCharacter.name}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Character Metrics</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Complexity:</span>
                    <span className="font-medium capitalize">{selectedCharacter.profile.analysis.complexity}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        selectedCharacter.profile.analysis.complexity === 'complex' ? 'bg-red-500 w-full' :
                        selectedCharacter.profile.analysis.complexity === 'moderate' ? 'bg-yellow-500 w-2/3' :
                        'bg-green-500 w-1/3'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Consistency:</span>
                    <span className="font-medium">{selectedCharacter.profile.analysis.consistency}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${selectedCharacter.profile.analysis.consistency}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Growth:</span>
                    <span className="font-medium">{selectedCharacter.profile.analysis.growth}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${selectedCharacter.profile.analysis.growth}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Relatability:</span>
                    <span className="font-medium">{selectedCharacter.profile.analysis.relatability}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: `${selectedCharacter.profile.analysis.relatability}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Uniqueness:</span>
                    <span className="font-medium">{selectedCharacter.profile.analysis.uniqueness}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full"
                      style={{ width: `${selectedCharacter.profile.analysis.uniqueness}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Improvement Suggestions</h4>
              <div className="space-y-2">
                {selectedCharacter.profile.suggestions.improvements.map((suggestion: string, index: number) => (
                  <div key={index} className="flex items-start space-x-2 p-2 bg-blue-50 rounded">
                    <span className="text-blue-600 text-sm">•</span>
                    <span className="text-sm text-gray-700">{suggestion}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Plot Opportunities</h4>
              <div className="space-y-2">
                {selectedCharacter.profile.suggestions.plotOpportunities.map((opportunity: string, index: number) => (
                  <div key={index} className="flex items-start space-x-2 p-2 bg-green-50 rounded">
                    <Target className="w-3 h-3 text-green-600 mt-0.5" />
                    <span className="text-sm text-gray-700">{opportunity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Conflict Sources</h4>
              <div className="space-y-2">
                {selectedCharacter.profile.suggestions.conflictSources.map((conflict: string, index: number) => (
                  <div key={index} className="flex items-start space-x-2 p-2 bg-red-50 rounded">
                    <Heart className="w-3 h-3 text-red-600 mt-0.5" />
                    <span className="text-sm text-gray-700">{conflict}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No character analysis available.</p>
          <p className="text-sm text-gray-500 mt-2">Select a character and analyze to get insights.</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <User className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-bold">Character Development</h2>
          </div>
          {selectedCharacter && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Selected:</span>
              <span className="font-medium">{selectedCharacter.name}</span>
            </div>
          )}
        </div>

        <div className="flex space-x-1 px-4">
          {[
            { id: 'templates', label: 'Templates', icon: Settings },
            { id: 'characters', label: 'Characters', icon: User },
            { id: 'relationships', label: 'Relationships', icon: Users },
            { id: 'development', label: 'Development', icon: TrendingUp },
            { id: 'analysis', label: 'Analysis', icon: Brain }
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
        {activeTab === 'templates' && renderTemplates()}
        {activeTab === 'characters' && renderCharacters()}
        {activeTab === 'relationships' && renderRelationships()}
        {activeTab === 'development' && renderDevelopment()}
        {activeTab === 'analysis' && renderAnalysis()}
      </div>
    </div>
  );
};

export default CharacterDevelopmentPanel;
