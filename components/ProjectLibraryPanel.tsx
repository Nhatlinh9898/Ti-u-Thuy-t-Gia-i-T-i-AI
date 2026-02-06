import React, { useState, useEffect } from 'react';
import { Library, Plus, BookOpen, Lightbulb, FileText, Search, Filter, Download, Upload, Settings, TrendingUp, Calendar, Target, Star, Clock, Edit, Eye, Trash2 } from 'lucide-react';
import ProjectLibraryService from '../services/projectLibraryService';
import { NovelNode } from '../types';

interface ProjectLibraryPanelProps {
  onProjectSelected?: (project: any) => void;
  onIdeaSelected?: (idea: any) => void;
  onTemplateSelected?: (template: any) => void;
}

const ProjectLibraryPanel: React.FC<ProjectLibraryPanelProps> = ({ 
  onProjectSelected,
  onIdeaSelected,
  onTemplateSelected 
}) => {
  const [libraryService] = useState(() => new ProjectLibraryService());
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'ideas' | 'templates' | 'analytics'>('overview');
  const [currentLibrary, setCurrentLibrary] = useState<any>(null);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [selectedIdea, setSelectedIdea] = useState<any>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState({
    type: 'all',
    genre: '',
    status: '',
    tags: [] as string[]
  });
  const [isCreating, setIsCreating] = useState(false);
  const [isGeneratingIdeas, setIsGeneratingIdeas] = useState(false);

  useEffect(() => {
    // Try to load existing library or create new one
    const library = libraryService.getCurrentLibrary();
    if (library) {
      setCurrentLibrary(library);
    } else {
      // Create default library
      const newLibrary = libraryService.createLibrary(
        'My Story Library',
        'Personal collection of writing projects and ideas'
      );
      setCurrentLibrary(newLibrary);
    }
  }, [libraryService]);

  const handleCreateProject = async () => {
    if (!currentLibrary) return;

    setIsCreating(true);
    try {
      const project = await libraryService.createProject(
        'New Novel Project',
        'fantasy',
        {
          premise: 'A young hero discovers an ancient power that could save or destroy the world',
          theme: 'Power and Responsibility',
          message: 'True strength comes from wisdom, not power',
          targetAudience: 'Young adult',
          originalIdea: 'What if power was a burden rather than a gift?'
        }
      );
      
      setCurrentLibrary({
        ...currentLibrary,
        projects: [...currentLibrary.projects, project]
      });
      
      onProjectSelected?.(project);
    } catch (error) {
      console.error('Failed to create project:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleGenerateIdeas = async () => {
    if (!currentLibrary) return;

    setIsGeneratingIdeas(true);
    try {
      const ideas = await libraryService.generateIdeasFromLibrary([], 5);
      
      setCurrentLibrary({
        ...currentLibrary,
        ideas: [...currentLibrary.ideas, ...ideas]
      });
    } catch (error) {
      console.error('Failed to generate ideas:', error);
    } finally {
      setIsGeneratingIdeas(false);
    }
  };

  const handleCombineIdeas = async (ideaIds: string[]) => {
    if (!currentLibrary) return;

    try {
      const combinedIdea = await libraryService.combineIdeas(ideaIds);
      
      setCurrentLibrary({
        ...currentLibrary,
        ideas: [...currentLibrary.ideas, combinedIdea]
      });
      
      setSelectedIdea(combinedIdea);
    } catch (error) {
      console.error('Failed to combine ideas:', error);
    }
  };

  const handleCreateTemplate = (projectId: string) => {
    if (!currentLibrary) return;

    try {
      const template = libraryService.createTemplateFromProject(
        projectId,
        'Template from ' + selectedProject?.title,
        'Template created from successful project',
        'complete'
      );
      
      setCurrentLibrary({
        ...currentLibrary,
        templates: [...currentLibrary.templates, template]
      });
    } catch (error) {
      console.error('Failed to create template:', error);
    }
  };

  const handleSearch = () => {
    if (!currentLibrary) return { projects: [], ideas: [], templates: [] };
    
    return libraryService.searchLibrary(searchQuery, searchFilters);
  };

  const handleExportLibrary = () => {
    if (!currentLibrary) return;
    
    const exported = libraryService.exportLibrary();
    const blob = new Blob([exported], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentLibrary.name}-library.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportLibrary = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = libraryService.importLibrary(e.target?.result as string);
        setCurrentLibrary(imported);
      } catch (error) {
        console.error('Failed to import library:', error);
      }
    };
    reader.readAsText(file);
  };

  const renderOverview = () => {
    if (!currentLibrary) return null;

    const overview = libraryService.getLibraryOverview();

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Library Overview</h3>
            <div className="flex space-x-2">
              <button
                onClick={handleExportLibrary}
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
                  onChange={handleImportLibrary}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <BookOpen className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{overview.projects.total}</p>
              <p className="text-sm text-gray-600">Projects</p>
              <p className="text-xs text-gray-500 mt-1">{overview.projects.totalWords.toLocaleString()} words</p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Lightbulb className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{overview.ideas.total}</p>
              <p className="text-sm text-gray-600">Ideas</p>
              <p className="text-xs text-gray-500 mt-1">{Math.round(overview.ideas.averagePotential)}% avg potential</p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <FileText className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{overview.templates.total}</p>
              <p className="text-sm text-gray-600">Templates</p>
              <p className="text-xs text-gray-500 mt-1">{overview.templates.totalUsage} uses</p>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <TrendingUp className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{overview.writing.totalSessions}</p>
              <p className="text-sm text-gray-600">Sessions</p>
              <p className="text-xs text-gray-500 mt-1">{Math.round(overview.writing.totalHours)}h total</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Project Status</h4>
              <div className="space-y-2">
                {Object.entries(overview.projects.byStatus).map(([status, count]) => (
                  <div key={status} className="flex justify-between">
                    <span className="text-sm text-gray-600 capitalize">{status}:</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Writing Stats</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Daily Average:</span>
                  <span className="font-medium">{Math.round(overview.writing.dailyAverage)} words</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Most Productive:</span>
                  <span className="font-medium">{overview.writing.mostProductiveDay}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Avg Session:</span>
                  <span className="font-medium">{Math.round(overview.writing.averageSessionLength * 60)} min</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleCreateProject}
              disabled={isCreating}
              className="p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>{isCreating ? 'Creating...' : 'New Project'}</span>
            </button>
            
            <button
              onClick={handleGenerateIdeas}
              disabled={isGeneratingIdeas}
              className="p-4 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Lightbulb className="w-5 h-5" />
              <span>{isGeneratingIdeas ? 'Generating...' : 'Generate Ideas'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderProjects = () => {
    if (!currentLibrary) return null;

    const searchResults = handleSearch();
    const projects = searchQuery ? searchResults.projects : currentLibrary.projects;

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Projects</h3>
            <button
              onClick={handleCreateProject}
              disabled={isCreating}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Project</span>
            </button>
          </div>

          <div className="space-y-4">
            {projects.map((project: any) => (
              <div
                key={project.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedProject?.id === project.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedProject(project)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <BookOpen className="w-5 h-5 text-blue-500" />
                    <h4 className="font-medium">{project.title}</h4>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded capitalize">
                      {project.genre}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      project.status === 'completed' ? 'bg-green-100 text-green-800' :
                      project.status === 'writing' ? 'bg-blue-100 text-blue-800' :
                      project.status === 'reviewing' ? 'bg-yellow-100 text-yellow-800' :
                      project.status === 'archived' ? 'bg-gray-100 text-gray-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {project.status}
                    </span>
                    <div className="flex space-x-1">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onProjectSelected?.(project);
                        }}
                        className="p-1 text-gray-500 hover:text-blue-500"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-500 hover:text-green-500">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCreateTemplate(project.id);
                        }}
                        className="p-1 text-gray-500 hover:text-purple-500"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-700 mb-3">{project.synopsis}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Progress:</span>
                    <span className="font-medium ml-1">{Math.round(project.progress)}%</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Words:</span>
                    <span className="font-medium ml-1">{project.wordCount.toLocaleString()}/{project.targetWordCount.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Updated:</span>
                    <span className="font-medium ml-1">{new Date(project.lastUpdated).toLocaleDateString()}</span>
                  </div>
                </div>

                {project.tags.length > 0 && (
                  <div className="mt-3">
                    <div className="flex flex-wrap gap-1">
                      {project.tags.map((tag: string, index: number) => (
                        <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {projects.length === 0 && (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No projects yet.</p>
              <p className="text-sm text-gray-500 mt-2">Create your first project to get started.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderIdeas = () => {
    if (!currentLibrary) return null;

    const searchResults = handleSearch();
    const ideas = searchQuery ? searchResults.ideas : currentLibrary.ideas;

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Story Ideas</h3>
            <div className="flex space-x-2">
              <button
                onClick={handleGenerateIdeas}
                disabled={isGeneratingIdeas}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Lightbulb className="w-4 h-4" />
                <span>Generate Ideas</span>
              </button>
              {selectedIdea && selectedIdea.id && (
                <button
                  onClick={() => handleCombineIdeas([selectedIdea.id])}
                  className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Combine</span>
                </button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {ideas.map((idea: any) => (
              <div
                key={idea.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedIdea?.id === idea.id
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedIdea(idea)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <Lightbulb className="w-5 h-5 text-green-500" />
                    <h4 className="font-medium">{idea.title}</h4>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded capitalize">
                      {idea.type}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-500" />
                      <span className="text-sm font-medium">{idea.potential}%</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      idea.status === 'used' ? 'bg-green-100 text-green-800' :
                      idea.status === 'ready' ? 'bg-blue-100 text-blue-800' :
                      idea.status === 'developing' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {idea.status}
                    </span>
                    <div className="flex space-x-1">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onIdeaSelected?.(idea);
                        }}
                        className="p-1 text-gray-500 hover:text-blue-500"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-500 hover:text-green-500">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-700 mb-3">{idea.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Genre:</span>
                    <span className="font-medium ml-1 capitalize">{idea.genre}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Source:</span>
                    <span className="font-medium ml-1 capitalize">{idea.source.replace('_', ' ')}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Created:</span>
                    <span className="font-medium ml-1">{new Date(idea.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {idea.tags.length > 0 && (
                  <div className="mt-3">
                    <div className="flex flex-wrap gap-1">
                      {idea.tags.map((tag: string, index: number) => (
                        <span key={index} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {ideas.length === 0 && (
            <div className="text-center py-8">
              <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No ideas yet.</p>
              <p className="text-sm text-gray-500 mt-2">Generate ideas or add your own to get started.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderTemplates = () => {
    if (!currentLibrary) return null;

    const searchResults = handleSearch();
    const templates = searchQuery ? searchResults.templates : currentLibrary.templates;

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Templates</h3>
          
          <div className="space-y-4">
            {templates.map((template: any) => (
              <div
                key={template.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedTemplate?.id === template.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedTemplate(template)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-purple-500" />
                    <h4 className="font-medium">{template.name}</h4>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded capitalize">
                      {template.type}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-500" />
                      <span className="text-sm font-medium">{template.rating}</span>
                    </div>
                    <span className="text-sm text-gray-600">{template.usageCount} uses</span>
                    <div className="flex space-x-1">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onTemplateSelected?.(template);
                        }}
                        className="p-1 text-gray-500 hover:text-blue-500"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-500 hover:text-green-500">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-700 mb-3">{template.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Genre:</span>
                    <span className="font-medium ml-1 capitalize">{template.genre}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Visibility:</span>
                    <span className="font-medium ml-1 capitalize">{template.isPublic ? 'Public' : 'Private'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Created:</span>
                    <span className="font-medium ml-1">{new Date(template.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {template.tags.length > 0 && (
                  <div className="mt-3">
                    <div className="flex flex-wrap gap-1">
                      {template.tags.map((tag: string, index: number) => (
                        <span key={index} className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {templates.length === 0 && (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No templates yet.</p>
              <p className="text-sm text-gray-500 mt-2">Create templates from your completed projects.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderAnalytics = () => {
    if (!currentLibrary) return null;

    const overview = libraryService.getLibraryOverview();

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Writing Analytics</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Project Progress</h4>
              <div className="space-y-3">
                {Object.entries(overview.projects.byStatus).map(([status, count]) => (
                  <div key={status}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600 capitalize">{status}</span>
                      <span className="text-sm font-medium">{count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          status === 'completed' ? 'bg-green-500' :
                          status === 'writing' ? 'bg-blue-500' :
                          status === 'reviewing' ? 'bg-yellow-500' :
                          'bg-gray-400'
                        }`}
                        style={{ width: `${(count / overview.projects.total) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Genre Distribution</h4>
              <div className="space-y-3">
                {Object.entries(overview.projects.byGenre).map(([genre, count]) => (
                  <div key={genre}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600 capitalize">{genre}</span>
                      <span className="text-sm font-medium">{count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ width: `${(count / overview.projects.total) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Calendar className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{overview.writing.totalSessions}</p>
              <p className="text-sm text-gray-600">Total Sessions</p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Clock className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{Math.round(overview.writing.totalHours)}h</p>
              <p className="text-sm text-gray-600">Total Hours</p>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <Target className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{Math.round(overview.writing.dailyAverage)}</p>
              <p className="text-sm text-gray-600">Daily Average</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <Library className="w-6 h-6 text-purple-500" />
            <h2 className="text-xl font-bold">Project Library</h2>
          </div>
          {currentLibrary && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">{currentLibrary.name}</span>
              <span className="text-sm text-gray-500">({currentLibrary.projects.length} projects)</span>
            </div>
          )}
        </div>

        <div className="flex space-x-1 px-4">
          {[
            { id: 'overview', label: 'Overview', icon: Library },
            { id: 'projects', label: 'Projects', icon: BookOpen },
            { id: 'ideas', label: 'Ideas', icon: Lightbulb },
            { id: 'templates', label: 'Templates', icon: FileText },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp }
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
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'projects' && renderProjects()}
        {activeTab === 'ideas' && renderIdeas()}
        {activeTab === 'templates' && renderTemplates()}
        {activeTab === 'analytics' && renderAnalytics()}
      </div>
    </div>
  );
};

export default ProjectLibraryPanel;
