import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Edit, Trash2, Download, Upload, Eye, Settings, Layers, Users, Clock, Target } from 'lucide-react';
import NovelStructureService from '../services/novelStructureService';
import { NovelNode } from '../types';

interface NovelStructurePanelProps {
  novel?: NovelNode;
  onStructureCreated?: (structure: any) => void;
  onChapterGenerated?: (chapter: any) => void;
}

const NovelStructurePanel: React.FC<NovelStructurePanelProps> = ({ 
  novel, 
  onStructureCreated,
  onChapterGenerated 
}) => {
  const [structureService] = useState(() => new NovelStructureService());
  const [activeTab, setActiveTab] = useState<'templates' | 'structure' | 'chapters' | 'arcs' | 'perspectives'>('templates');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [currentStructure, setCurrentStructure] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [templates, setTemplates] = useState<any[]>([]);

  useEffect(() => {
    const availableTemplates = structureService.getAvailableTemplates();
    setTemplates(availableTemplates);
  }, [structureService]);

  const handleCreateFromTemplate = async () => {
    if (!selectedTemplate || !novel) return;

    setIsGenerating(true);
    try {
      const structure = await structureService.createNovelFromTemplate(
        selectedTemplate,
        novel.title
      );
      
      setCurrentStructure(structure);
      onStructureCreated?.(structure);
      
      // Generate story arcs and perspectives
      await structureService.generateStoryArcs(structure);
      await structureService.generatePerspectives(structure);
      
      setCurrentStructure({...structure});
    } catch (error) {
      console.error('Failed to create structure:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddChapter = async (position: number) => {
    if (!currentStructure) return;

    setIsGenerating(true);
    try {
      const newChapter = await structureService.addChapter(
        currentStructure,
        position
      );
      
      setCurrentStructure({
        ...currentStructure,
        structure: {
          ...currentStructure.structure,
          chapters: [...currentStructure.structure.chapters, newChapter]
        }
      });
      
      onChapterGenerated?.(newChapter);
    } catch (error) {
      console.error('Failed to add chapter:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportStructure = () => {
    if (!currentStructure) return;
    
    const exported = structureService.exportStructure(currentStructure);
    const blob = new Blob([exported], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentStructure.title}-structure.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportStructure = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = structureService.importStructure(e.target?.result as string);
        setCurrentStructure(imported);
        onStructureCreated?.(imported);
      } catch (error) {
        console.error('Failed to import structure:', error);
      }
    };
    reader.readAsText(file);
  };

  const renderTemplates = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Choose Template</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  {template.genre}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{template.description}</p>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Structure:</span>
                  <span className="font-medium capitalize">{template.structure.type}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Point of View:</span>
                  <span className="font-medium capitalize">{template.settings.pointOfView}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Pacing:</span>
                  <span className="font-medium capitalize">{template.settings.pacing}</span>
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
            onClick={handleCreateFromTemplate}
            disabled={!selectedTemplate || !novel || isGenerating}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>{isGenerating ? 'Creating...' : 'Create Structure'}</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderStructure = () => (
    <div className="space-y-6">
      {currentStructure ? (
        <>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Novel Structure</h3>
              <div className="flex space-x-2">
                <button
                  onClick={handleExportStructure}
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
                    onChange={handleImportStructure}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <BookOpen className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">{currentStructure.structure.chapters.length}</p>
                <p className="text-sm text-gray-600">Chapters</p>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Target className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">{currentStructure.structure.arcs.length}</p>
                <p className="text-sm text-gray-600">Story Arcs</p>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Users className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">{currentStructure.structure.perspectives.length}</p>
                <p className="text-sm text-gray-600">Perspectives</p>
              </div>
              
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <Clock className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">{currentStructure.metadata.estimatedReadingTime}</p>
                <p className="text-sm text-gray-600">Min Read</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Structure Details</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Type:</span>
                    <span className="font-medium capitalize">{currentStructure.structure.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Genre:</span>
                    <span className="font-medium capitalize">{currentStructure.genre}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Complexity:</span>
                    <span className="font-medium capitalize">{currentStructure.metadata.complexity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Words:</span>
                    <span className="font-medium">{currentStructure.metadata.totalWords.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Writing Settings</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Style:</span>
                    <span className="font-medium capitalize">{currentStructure.settings.writingStyle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Pacing:</span>
                    <span className="font-medium capitalize">{currentStructure.settings.pacing}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Tone:</span>
                    <span className="font-medium capitalize">{currentStructure.settings.tone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Point of View:</span>
                    <span className="font-medium capitalize">{currentStructure.settings.pointOfView}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No structure created yet.</p>
          <p className="text-sm text-gray-500 mt-2">Select a template and create your novel structure.</p>
        </div>
      )}
    </div>
  );

  const renderChapters = () => (
    <div className="space-y-6">
      {currentStructure ? (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Chapters</h3>
            <button
              onClick={() => handleAddChapter(currentStructure.structure.chapters.length)}
              disabled={isGenerating}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-1"
            >
              <Plus className="w-3 h-3" />
              <span>Add Chapter</span>
            </button>
          </div>

          <div className="space-y-3">
            {currentStructure.structure.chapters.map((chapter: any, index: number) => (
              <div key={chapter.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-500">#{chapter.order + 1}</span>
                    <h4 className="font-medium">{chapter.title}</h4>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded capitalize">
                      {chapter.type}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-1 text-gray-500 hover:text-blue-500">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-500 hover:text-green-500">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-500 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Words:</span>
                    <span className="font-medium ml-1">{chapter.wordCount.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Characters:</span>
                    <span className="font-medium ml-1">{chapter.characters.length}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Conflicts:</span>
                    <span className="font-medium ml-1">{chapter.conflicts.length}</span>
                  </div>
                </div>

                {chapter.summary && (
                  <div className="mt-3 p-3 bg-gray-50 rounded">
                    <p className="text-sm text-gray-700">{chapter.summary}</p>
                  </div>
                )}

                {chapter.keyEvents.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Key Events:</p>
                    <div className="flex flex-wrap gap-2">
                      {chapter.keyEvents.slice(0, 3).map((event: string, idx: number) => (
                        <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {event.slice(0, 30)}...
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {currentStructure.structure.chapters.length === 0 && (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No chapters yet.</p>
              <p className="text-sm text-gray-500 mt-2">Add your first chapter to get started.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No structure available.</p>
          <p className="text-sm text-gray-500 mt-2">Create a structure first to manage chapters.</p>
        </div>
      )}
    </div>
  );

  const renderArcs = () => (
    <div className="space-y-6">
      {currentStructure ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Story Arcs</h3>
          
          <div className="space-y-4">
            {currentStructure.structure.arcs.map((arc: any) => (
              <div key={arc.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Target className="w-5 h-5 text-purple-500" />
                    <h4 className="font-medium">{arc.name}</h4>
                    <span className="text-xs bg-purple-100 px-2 py-1 rounded capitalize">
                      {arc.type}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-1 text-gray-500 hover:text-blue-500">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-500 hover:text-green-500">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-gray-700 mb-3">{arc.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Climax:</p>
                    <div className="p-2 bg-red-50 rounded text-sm">
                      <p className="text-red-800">{arc.climax.description}</p>
                      <p className="text-xs text-red-600 mt-1">
                        Impact: {arc.climax.impact}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Resolution:</p>
                    <div className="p-2 bg-green-50 rounded text-sm">
                      <p className="text-green-800">{arc.resolution.description}</p>
                      <p className="text-xs text-green-600 mt-1">
                        Satisfaction: {arc.resolution.satisfaction}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">Progression:</p>
                  <div className="flex items-center space-x-2">
                    {arc.progression.map((prog: any, index: number) => (
                      <div key={index} className="flex-1">
                        <div className="text-xs text-center mb-1">
                          Chapter {prog.chapterId ? prog.chapterId.slice(-2) : '?'}
                        </div>
                        <div className="bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-500 h-2 rounded-full"
                            style={{ width: `${prog.progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-center mt-1 capitalize">
                          {prog.significance}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {currentStructure.structure.arcs.length === 0 && (
            <div className="text-center py-8">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No story arcs defined.</p>
              <p className="text-sm text-gray-500 mt-2">Story arcs help structure your narrative.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No structure available.</p>
          <p className="text-sm text-gray-500 mt-2">Create a structure first to manage story arcs.</p>
        </div>
      )}
    </div>
  );

  const renderPerspectives = () => (
    <div className="space-y-6">
      {currentStructure ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Perspectives</h3>
          
          <div className="space-y-4">
            {currentStructure.structure.perspectives.map((perspective: any) => (
              <div key={perspective.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-indigo-500" />
                    <h4 className="font-medium">{perspective.characterName}</h4>
                    <span className="text-xs bg-indigo-100 px-2 py-1 rounded">
                      {perspective.pointOfView}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-1 text-gray-500 hover:text-blue-500">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-500 hover:text-green-500">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Voice Characteristics:</p>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tone:</span>
                        <span className="font-medium capitalize">{perspective.voice.tone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Vocabulary:</span>
                        <span className="font-medium">{perspective.voice.vocabulary}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Chapter Coverage:</p>
                    <div className="flex flex-wrap gap-1">
                      {perspective.chapters.slice(0, 5).map((chapterId: string) => (
                        <span key={chapterId} className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                          {chapterId.slice(-2)}
                        </span>
                      ))}
                      {perspective.chapters.length > 5 && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          +{perspective.chapters.length - 5}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {currentStructure.structure.perspectives.length === 0 && (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No perspectives defined.</p>
              <p className="text-sm text-gray-500 mt-2">Perspectives add depth to your storytelling.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No structure available.</p>
          <p className="text-sm text-gray-500 mt-2">Create a structure first to manage perspectives.</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <Layers className="w-6 h-6 text-purple-500" />
            <h2 className="text-xl font-bold">Novel Structure</h2>
          </div>
          {currentStructure && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Current:</span>
              <span className="font-medium">{currentStructure.title}</span>
            </div>
          )}
        </div>

        <div className="flex space-x-1 px-4">
          {[
            { id: 'templates', label: 'Templates', icon: BookOpen },
            { id: 'structure', label: 'Structure', icon: Settings },
            { id: 'chapters', label: 'Chapters', icon: Layers },
            { id: 'arcs', label: 'Story Arcs', icon: Target },
            { id: 'perspectives', label: 'Perspectives', icon: Users }
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
        {activeTab === 'templates' && renderTemplates()}
        {activeTab === 'structure' && renderStructure()}
        {activeTab === 'chapters' && renderChapters()}
        {activeTab === 'arcs' && renderArcs()}
        {activeTab === 'perspectives' && renderPerspectives()}
      </div>
    </div>
  );
};

export default NovelStructurePanel;
