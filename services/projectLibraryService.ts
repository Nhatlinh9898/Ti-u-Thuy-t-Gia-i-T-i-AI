import { NovelNode, AIActionType } from "../types";
import UltimateAIService from "./ultimateAIService";
import StoryArchitectureService from "./storyArchitectureService";
import CharacterDevelopmentService from "./characterDevelopmentService";
import NovelStructureService from "./novelStructureService";

// Project Library Service - Quản lý nhiều dự án viết truyện
// Tạo thư viện truyện, quản lý dự án, và tạo ý tưởng mới từ thư viện

interface ProjectLibrary {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  lastUpdated: Date;
  projects: NovelProject[];
  templates: ProjectTemplate[];
  ideas: StoryIdea[];
  settings: LibrarySettings;
  statistics: LibraryStatistics;
}

interface NovelProject {
  id: string;
  title: string;
  genre: string;
  status: 'planning' | 'writing' | 'reviewing' | 'completed' | 'archived';
  createdAt: Date;
  lastUpdated: Date;
  wordCount: number;
  targetWordCount: number;
  progress: number;
  tags: string[];
  synopsis: string;
  coreConcept: {
    premise: string;
    theme: string;
    message: string;
    targetAudience: string;
    originalIdea: string;
  };
  structure?: any; // StoryArchitecture
  characters?: any[]; // Character[]
  novelStructure?: any; // NovelStructure
  metadata: {
    writingSessions: WritingSession[];
    notes: ProjectNote[];
    milestones: ProjectMilestone[];
    inspirationSources: InspirationSource[];
  };
}

interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  genre: string;
  type: 'structure' | 'character' | 'plot' | 'world' | 'complete';
  isPublic: boolean;
  usageCount: number;
  rating: number;
  createdBy: string;
  createdAt: Date;
  content: {
    structure?: any;
    characters?: any[];
    plotPoints?: any[];
    worldBuilding?: any;
    guidelines?: any;
  };
  tags: string[];
}

interface StoryIdea {
  id: string;
  title: string;
  description: string;
  genre: string;
  type: 'premise' | 'character' | 'setting' | 'plot' | 'theme' | 'hybrid';
  inspiration: string;
  source: 'original' | 'library' | 'ai_generated' | 'user_submitted';
  status: 'raw' | 'developing' | 'ready' | 'used';
  createdAt: Date;
  lastAccessed: Date;
  connections: IdeaConnection[];
  development: IdeaDevelopment;
  tags: string[];
  potential: number; // 0-100
}

interface IdeaConnection {
  connectedIdeaId: string;
  connectionType: 'similar' | 'complementary' | 'contrasting' | 'inspired_by';
  strength: number; // 0-100
  description: string;
}

interface IdeaDevelopment {
  notes: string[];
  variations: string[];
  relatedProjects: string[];
  developmentLevel: number; // 0-100
  lastModified: Date;
}

interface WritingSession {
  id: string;
  date: Date;
  duration: number; // minutes
  wordsWritten: number;
  chaptersWorked: string[];
  notes: string;
  mood: string;
  productivity: number; // 0-100
}

interface ProjectNote {
  id: string;
  title: string;
  content: string;
  type: 'general' | 'character' | 'plot' | 'setting' | 'dialogue' | 'research';
  createdAt: Date;
  lastModified: Date;
  tags: string[];
  relatedTo: string[]; // character IDs, scene IDs, etc.
}

interface ProjectMilestone {
  id: string;
  title: string;
  description: string;
  targetDate: Date;
  completedDate?: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'missed';
  type: 'word_count' | 'chapter' | 'scene' | 'review' | 'deadline';
  target: number;
  current: number;
}

interface InspirationSource {
  id: string;
  type: 'book' | 'movie' | 'article' | 'image' | 'music' | 'experience' | 'conversation';
  title: string;
  description: string;
  url?: string;
  tags: string[];
  influence: number; // 0-100
  addedAt: Date;
}

interface LibrarySettings {
  defaultGenre: string;
  autoSave: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  sharingSettings: {
    allowPublicTemplates: boolean;
    allowIdeaSharing: boolean;
    defaultTemplateVisibility: 'private' | 'public';
  };
  writingGoals: {
    dailyWords: number;
    weeklyWords: number;
    monthlyWords: number;
    preferredWritingTime: string;
  };
  aiSettings: {
    enableSuggestions: boolean;
    ideaGenerationFrequency: 'daily' | 'weekly' | 'monthly';
    inspirationLevel: 'conservative' | 'moderate' | 'creative';
  };
}

interface LibraryStatistics {
  totalProjects: number;
  completedProjects: number;
  totalWords: number;
  averageWordsPerProject: number;
  mostProductiveDay: string;
  favoriteGenre: string;
  totalWritingTime: number; // hours
  ideasGenerated: number;
  ideasUsed: number;
  templatesCreated: number;
  templatesUsed: number;
}

class ProjectLibraryService {
  private ultimateAI: UltimateAIService;
  private storyArchitectureService: StoryArchitectureService;
  private characterDevelopmentService: CharacterDevelopmentService;
  private novelStructureService: NovelStructureService;
  private currentLibrary: ProjectLibrary | null = null;

  constructor() {
    this.ultimateAI = new UltimateAIService();
    this.storyArchitectureService = new StoryArchitectureService();
    this.characterDevelopmentService = new CharacterDevelopmentService();
    this.novelStructureService = new NovelStructureService();
  }

  // Create new project library
  public createLibrary(name: string, description: string): ProjectLibrary {
    const library: ProjectLibrary = {
      id: `library-${Date.now()}`,
      name,
      description,
      createdAt: new Date(),
      lastUpdated: new Date(),
      projects: [],
      templates: [],
      ideas: [],
      settings: {
        defaultGenre: 'fiction',
        autoSave: true,
        backupFrequency: 'weekly',
        sharingSettings: {
          allowPublicTemplates: false,
          allowIdeaSharing: true,
          defaultTemplateVisibility: 'private'
        },
        writingGoals: {
          dailyWords: 1000,
          weeklyWords: 7000,
          monthlyWords: 30000,
          preferredWritingTime: 'morning'
        },
        aiSettings: {
          enableSuggestions: true,
          ideaGenerationFrequency: 'weekly',
          inspirationLevel: 'moderate'
        }
      },
      statistics: {
        totalProjects: 0,
        completedProjects: 0,
        totalWords: 0,
        averageWordsPerProject: 0,
        mostProductiveDay: '',
        favoriteGenre: '',
        totalWritingTime: 0,
        ideasGenerated: 0,
        ideasUsed: 0,
        templatesCreated: 0,
        templatesUsed: 0
      }
    };

    this.currentLibrary = library;
    return library;
  }

  // Create new project
  public async createProject(
    title: string,
    genre: string,
    coreConcept: {
      premise: string;
      theme: string;
      message: string;
      targetAudience: string;
      originalIdea: string;
    },
    targetWordCount: number = 50000
  ): Promise<NovelProject> {
    if (!this.currentLibrary) {
      throw new Error('No library created. Create a library first.');
    }

    const project: NovelProject = {
      id: `project-${Date.now()}`,
      title,
      genre,
      status: 'planning',
      createdAt: new Date(),
      lastUpdated: new Date(),
      wordCount: 0,
      targetWordCount,
      progress: 0,
      tags: [genre],
      synopsis: coreConcept.premise,
      coreConcept,
      metadata: {
        writingSessions: [],
        notes: [],
        milestones: [],
        inspirationSources: []
      }
    };

    // Generate initial structure
    try {
      const architecture = await this.storyArchitectureService.createStoryArchitecture(
        title,
        genre,
        coreConcept
      );
      project.structure = architecture;

      // Generate initial characters
      const mainCharacter = await this.characterDevelopmentService.createCharacterFromTemplate(
        'hero-journey',
        'Main Character'
      );
      project.characters = [mainCharacter];

      // Generate novel structure
      const novelStructure = await this.novelStructureService.createNovelFromTemplate(
        genre === 'fantasy' ? 'fantasy-epic' : 'contemporary-romance',
        title
      );
      project.novelStructure = novelStructure;

    } catch (error) {
      console.error('Failed to generate initial structure:', error);
    }

    this.currentLibrary.projects.push(project);
    this.updateLibraryStatistics();

    return project;
  }

  // Generate new ideas from library
  public async generateIdeasFromLibrary(
    inspirationSources: string[] = [],
    count: number = 5
  ): Promise<StoryIdea[]> {
    if (!this.currentLibrary) {
      throw new Error('No library created. Create a library first.');
    }

    const ideas: StoryIdea[] = [];
    const libraryContent = this.analyzeLibraryContent();

    try {
      const prompt = `
Based on this writer's library and preferences, generate ${count} new story ideas:

Library Analysis:
- Favorite genres: ${libraryContent.favoriteGenres.join(', ')}
- Common themes: ${libraryContent.commonThemes.join(', ')}
- Character archetypes used: ${libraryContent.characterArchetypes.join(', ')}
- Setting preferences: ${libraryContent.settingPreferences.join(', ')}
- Completed projects: ${libraryContent.completedProjects.length}
- Writing style: ${libraryContent.writingStyle}

Inspiration sources: ${inspirationSources.join(', ')}

Please generate diverse, creative story ideas that:
1. Align with the writer's interests but introduce new elements
2. Mix and match elements from their previous work in innovative ways
3. Challenge them to explore new genres or themes
4. Include both character-driven and plot-driven concepts
5. Vary in complexity and scope

For each idea, provide:
- Catchy title
- Brief description (2-3 sentences)
- Genre suggestion
- Type (premise, character, setting, plot, theme, or hybrid)
- Inspiration source
- Development potential (0-100)
      `.trim();

      const result = await this.ultimateAI.generateContent(
        {
          id: 'idea-generation',
          title: 'AI Idea Generation',
          type: 'planning',
          content: '',
          summary: '',
          children: []
        },
        AIActionType.WRITE_CONTINUE,
        prompt
      );

      const parsedIdeas = this.parseIdeasFromAI(result.text);
      
      for (const ideaData of parsedIdeas) {
        const idea: StoryIdea = {
          id: `idea-${Date.now()}-${Math.random()}`,
          title: ideaData.title,
          description: ideaData.description,
          genre: ideaData.genre,
          type: ideaData.type,
          inspiration: ideaData.inspiration,
          source: 'ai_generated',
          status: 'raw',
          createdAt: new Date(),
          lastAccessed: new Date(),
          connections: [],
          development: {
            notes: [],
            variations: [],
            relatedProjects: [],
            developmentLevel: 0,
            lastModified: new Date()
          },
          tags: ideaData.tags || [],
          potential: ideaData.potential || 50
        };

        ideas.push(idea);
        this.currentLibrary.ideas.push(idea);
      }

      this.updateLibraryStatistics();
      return ideas;

    } catch (error) {
      console.error('Failed to generate ideas:', error);
      return this.createFallbackIdeas(count);
    }
  }

  // Find related ideas
  public findRelatedIdeas(ideaId: string, limit: number = 5): StoryIdea[] {
    if (!this.currentLibrary) return [];

    const targetIdea = this.currentLibrary.ideas.find(i => i.id === ideaId);
    if (!targetIdea) return [];

    const relatedIdeas = this.currentLibrary.ideas
      .filter(idea => idea.id !== ideaId)
      .map(idea => ({
        idea,
        similarity: this.calculateIdeaSimilarity(targetIdea, idea)
      }))
      .filter(item => item.similarity > 0.3)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)
      .map(item => item.idea);

    return relatedIdeas;
  }

  // Combine ideas to create new concepts
  public async combineIdeas(ideaIds: string[]): Promise<StoryIdea> {
    if (!this.currentLibrary) {
      throw new Error('No library created. Create a library first.');
    }

    const ideas = this.currentLibrary.ideas.filter(idea => 
      ideaIds.includes(idea.id)
    );

    if (ideas.length < 2) {
      throw new Error('Need at least 2 ideas to combine');
    }

    try {
      const prompt = `
Combine these story ideas into a new, innovative concept:

Ideas to combine:
${ideas.map(idea => `
- Title: ${idea.title}
- Description: ${idea.description}
- Genre: ${idea.genre}
- Type: ${idea.type}
- Tags: ${idea.tags.join(', ')}
`).join('\n')}

Please create a new story idea that:
1. Combines the best elements of all ideas
2. Creates something fresh and original
3. Maintains coherence and appeal
4. Has clear development potential

Provide:
- New title
- Combined description
- Resulting genre
- Type of concept
- How the ideas connect
- Development potential (0-100)
      `.trim();

      const result = await this.ultimateAI.generateContent(
        {
          id: 'idea-combination',
          title: 'AI Idea Combination',
          type: 'planning',
          content: '',
          summary: '',
          children: []
        },
        AIActionType.WRITE_CONTINUE,
        prompt
      );

      const combinedIdea = this.parseCombinedIdeaFromAI(result.text, ideas);

      this.currentLibrary.ideas.push(combinedIdea);
      this.updateLibraryStatistics();

      return combinedIdea;

    } catch (error) {
      console.error('Failed to combine ideas:', error);
      throw new Error('Failed to combine ideas');
    }
  }

  // Create template from project
  public createTemplateFromProject(
    projectId: string,
    templateName: string,
    description: string,
    type: 'structure' | 'character' | 'plot' | 'world' | 'complete'
  ): ProjectTemplate {
    if (!this.currentLibrary) {
      throw new Error('No library created. Create a library first.');
    }

    const project = this.currentLibrary.projects.find(p => p.id === projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    const template: ProjectTemplate = {
      id: `template-${Date.now()}`,
      name: templateName,
      description,
      genre: project.genre,
      type,
      isPublic: false,
      usageCount: 0,
      rating: 0,
      createdBy: 'user',
      createdAt: new Date(),
      content: {},
      tags: [project.genre, type]
    };

    // Extract content based on template type
    switch (type) {
      case 'structure':
        if (project.structure) {
          template.content.structure = project.structure;
        }
        break;
      case 'character':
        if (project.characters) {
          template.content.characters = project.characters;
        }
        break;
      case 'plot':
        if (project.structure?.guidelines.plotPoints) {
          template.content.plotPoints = project.structure.guidelines.plotPoints;
        }
        break;
      case 'complete':
        template.content = {
          structure: project.structure,
          characters: project.characters,
          plotPoints: project.structure?.guidelines.plotPoints,
          worldBuilding: project.structure?.guidelines.worldBuilding
        };
        break;
    }

    this.currentLibrary.templates.push(template);
    this.updateLibraryStatistics();

    return template;
  }

  // Apply template to project
  public async applyTemplateToProject(
    projectId: string,
    templateId: string
  ): Promise<NovelProject> {
    if (!this.currentLibrary) {
      throw new Error('No library created. Create a library first.');
    }

    const project = this.currentLibrary.projects.find(p => p.id === projectId);
    const template = this.currentLibrary.templates.find(t => t.id === templateId);

    if (!project || !template) {
      throw new Error('Project or template not found');
    }

    // Apply template content to project
    if (template.content.structure) {
      project.structure = template.content.structure;
    }
    if (template.content.characters) {
      project.characters = template.content.characters;
    }
    if (template.content.plotPoints && project.structure) {
      project.structure.guidelines.plotPoints = template.content.plotPoints;
    }

    template.usageCount++;
    project.lastUpdated = new Date();

    this.updateLibraryStatistics();
    return project;
  }

  // Get library overview
  public getLibraryOverview(): {
    projects: {
      total: number;
      byStatus: Record<string, number>;
      byGenre: Record<string, number>;
      totalWords: number;
    };
    ideas: {
      total: number;
      byStatus: Record<string, number>;
      byType: Record<string, number>;
      averagePotential: number;
    };
    templates: {
      total: number;
      byType: Record<string, number>;
      averageRating: number;
      totalUsage: number;
    };
    writing: {
      totalSessions: number;
      totalHours: number;
      averageSessionLength: number;
      mostProductiveDay: string;
      dailyAverage: number;
    };
  } {
    if (!this.currentLibrary) {
      return this.getEmptyOverview();
    }

    const projects = this.currentLibrary.projects;
    const ideas = this.currentLibrary.ideas;
    const templates = this.currentLibrary.templates;

    // Project statistics
    const projectsByStatus: Record<string, number> = {};
    const projectsByGenre: Record<string, number> = {};
    let totalWords = 0;

    projects.forEach(project => {
      projectsByStatus[project.status] = (projectsByStatus[project.status] || 0) + 1;
      projectsByGenre[project.genre] = (projectsByGenre[project.genre] || 0) + 1;
      totalWords += project.wordCount;
    });

    // Idea statistics
    const ideasByStatus: Record<string, number> = {};
    const ideasByType: Record<string, number> = {};
    let totalPotential = 0;

    ideas.forEach(idea => {
      ideasByStatus[idea.status] = (ideasByStatus[idea.status] || 0) + 1;
      ideasByType[idea.type] = (ideasByType[idea.type] || 0) + 1;
      totalPotential += idea.potential;
    });

    // Template statistics
    const templatesByType: Record<string, number> = {};
    let totalRating = 0;
    let totalUsage = 0;

    templates.forEach(template => {
      templatesByType[template.type] = (templatesByType[template.type] || 0) + 1;
      totalRating += template.rating;
      totalUsage += template.usageCount;
    });

    // Writing statistics
    const allSessions = projects.flatMap(p => p.metadata.writingSessions);
    const totalSessions = allSessions.length;
    const totalHours = allSessions.reduce((sum, session) => sum + (session.duration / 60), 0);
    const averageSessionLength = totalSessions > 0 ? totalHours / totalSessions : 0;
    
    // Find most productive day
    const wordsByDay: Record<string, number> = {};
    allSessions.forEach(session => {
      const day = new Date(session.date).toLocaleDateString();
      wordsByDay[day] = (wordsByDay[day] || 0) + session.wordsWritten;
    });
    
    const mostProductiveDay = Object.entries(wordsByDay)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || '';

    const dailyAverage = this.currentLibrary.statistics.totalWords / 
      Math.max(1, Math.floor((Date.now() - this.currentLibrary.createdAt.getTime()) / (1000 * 60 * 60 * 24)));

    return {
      projects: {
        total: projects.length,
        byStatus: projectsByStatus,
        byGenre: projectsByGenre,
        totalWords
      },
      ideas: {
        total: ideas.length,
        byStatus: ideasByStatus,
        byType: ideasByType,
        averagePotential: ideas.length > 0 ? totalPotential / ideas.length : 0
      },
      templates: {
        total: templates.length,
        byType: templatesByType,
        averageRating: templates.length > 0 ? totalRating / templates.length : 0,
        totalUsage
      },
      writing: {
        totalSessions,
        totalHours,
        averageSessionLength,
        mostProductiveDay,
        dailyAverage
      }
    };
  }

  // Search library
  public searchLibrary(query: string, filters: {
    type?: 'projects' | 'ideas' | 'templates' | 'all';
    genre?: string;
    status?: string;
    tags?: string[];
  } = {}): {
    projects: NovelProject[];
    ideas: StoryIdea[];
    templates: ProjectTemplate[];
  } {
    if (!this.currentLibrary) {
      return { projects: [], ideas: [], templates: [] };
    }

    const searchQuery = query.toLowerCase();
    const results = {
      projects: [] as NovelProject[],
      ideas: [] as StoryIdea[],
      templates: [] as ProjectTemplate[]
    };

    // Search projects
    if (filters.type === 'projects' || filters.type === 'all' || !filters.type) {
      results.projects = this.currentLibrary.projects.filter(project => {
        const matchesQuery = !query || 
          project.title.toLowerCase().includes(searchQuery) ||
          project.synopsis.toLowerCase().includes(searchQuery) ||
          project.coreConcept.premise.toLowerCase().includes(searchQuery);

        const matchesGenre = !filters.genre || project.genre === filters.genre;
        const matchesStatus = !filters.status || project.status === filters.status;
        const matchesTags = !filters.tags?.length || 
          filters.tags.some(tag => project.tags.includes(tag));

        return matchesQuery && matchesGenre && matchesStatus && matchesTags;
      });
    }

    // Search ideas
    if (filters.type === 'ideas' || filters.type === 'all' || !filters.type) {
      results.ideas = this.currentLibrary.ideas.filter(idea => {
        const matchesQuery = !query || 
          idea.title.toLowerCase().includes(searchQuery) ||
          idea.description.toLowerCase().includes(searchQuery);

        const matchesGenre = !filters.genre || idea.genre === filters.genre;
        const matchesStatus = !filters.status || idea.status === filters.status;
        const matchesTags = !filters.tags?.length || 
          filters.tags.some(tag => idea.tags.includes(tag));

        return matchesQuery && matchesGenre && matchesStatus && matchesTags;
      });
    }

    // Search templates
    if (filters.type === 'templates' || filters.type === 'all' || !filters.type) {
      results.templates = this.currentLibrary.templates.filter(template => {
        const matchesQuery = !query || 
          template.name.toLowerCase().includes(searchQuery) ||
          template.description.toLowerCase().includes(searchQuery);

        const matchesGenre = !filters.genre || template.genre === filters.genre;
        const matchesTags = !filters.tags?.length || 
          filters.tags.some(tag => template.tags.includes(tag));

        return matchesQuery && matchesGenre && matchesTags;
      });
    }

    return results;
  }

  // Helper methods
  private analyzeLibraryContent() {
    if (!this.currentLibrary) {
      return {
        favoriteGenres: [],
        commonThemes: [],
        characterArchetypes: [],
        settingPreferences: [],
        completedProjects: [],
        writingStyle: ''
      };
    }

    const projects = this.currentLibrary.projects;
    const ideas = this.currentLibrary.ideas;

    // Analyze favorite genres
    const genreCount: Record<string, number> = {};
    projects.forEach(project => {
      genreCount[project.genre] = (genreCount[project.genre] || 0) + 1;
    });
    const favoriteGenres = Object.entries(genreCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([genre]) => genre);

    // Analyze common themes
    const themes: string[] = [];
    projects.forEach(project => {
      themes.push(project.coreConcept.theme);
    });
    const commonThemes = [...new Set(themes)];

    // Analyze character archetypes
    const archetypes: string[] = [];
    projects.forEach(project => {
      if (project.characters) {
        project.characters.forEach(character => {
          if (character.role) {
            archetypes.push(character.role);
          }
        });
      }
    });
    const characterArchetypes = [...new Set(archetypes)];

    return {
      favoriteGenres,
      commonThemes,
      characterArchetypes,
      settingPreferences: ['fantasy', 'contemporary', 'historical'],
      completedProjects: projects.filter(p => p.status === 'completed'),
      writingStyle: 'descriptive'
    };
  }

  private calculateIdeaSimilarity(idea1: StoryIdea, idea2: StoryIdea): number {
    let similarity = 0;
    let factors = 0;

    // Genre similarity
    if (idea1.genre === idea2.genre) {
      similarity += 0.3;
    }
    factors++;

    // Type similarity
    if (idea1.type === idea2.type) {
      similarity += 0.2;
    }
    factors++;

    // Tag similarity
    const commonTags = idea1.tags.filter(tag => idea2.tags.includes(tag));
    const tagSimilarity = commonTags.length / Math.max(idea1.tags.length, idea2.tags.length);
    similarity += tagSimilarity * 0.3;
    factors++;

    // Description similarity (simple word overlap)
    const words1 = idea1.description.toLowerCase().split(/\s+/);
    const words2 = idea2.description.toLowerCase().split(/\s+/);
    const commonWords = words1.filter(word => words2.includes(word));
    const wordSimilarity = commonWords.length / Math.max(words1.length, words2.length);
    similarity += wordSimilarity * 0.2;
    factors++;

    return similarity / factors;
  }

  private parseIdeasFromAI(aiResponse: string): any[] {
    // Simple parsing - in production, use more sophisticated parsing
    const ideas: any[] = [];
    const lines = aiResponse.split('\n');
    
    let currentIdea: any = {};
    let inIdea = false;
    
    lines.forEach(line => {
      if (line.match(/^\d+\./)) {
        if (inIdea && currentIdea.title) {
          ideas.push(currentIdea);
        }
        currentIdea = {
          title: line.replace(/^\d+\.\s*/, '').trim(),
          description: '',
          genre: 'fiction',
          type: 'premise',
          inspiration: 'AI generated',
          tags: [],
          potential: 50
        };
        inIdea = true;
      } else if (inIdea) {
        if (line.toLowerCase().includes('description:')) {
          currentIdea.description = line.split(':')[1]?.trim() || '';
        } else if (line.toLowerCase().includes('genre:')) {
          currentIdea.genre = line.split(':')[1]?.trim() || 'fiction';
        } else if (line.toLowerCase().includes('type:')) {
          currentIdea.type = line.split(':')[1]?.trim() || 'premise';
        } else if (line.toLowerCase().includes('potential:')) {
          const match = line.match(/(\d+)/);
          currentIdea.potential = match ? parseInt(match[0]) : 50;
        }
      }
    });
    
    if (inIdea && currentIdea.title) {
      ideas.push(currentIdea);
    }
    
    return ideas.length > 0 ? ideas : this.createFallbackIdeas(5);
  }

  private parseCombinedIdeaFromAI(aiResponse: string, sourceIdeas: StoryIdea[]): StoryIdea {
    // Simple parsing - would be more sophisticated in production
    const lines = aiResponse.split('\n');
    let title = 'Combined Idea';
    let description = '';
    let genre = 'fiction';
    let type = 'hybrid';
    
    lines.forEach(line => {
      if (line.toLowerCase().includes('title:')) {
        title = line.split(':')[1]?.trim() || 'Combined Idea';
      } else if (line.toLowerCase().includes('description:')) {
        description = line.split(':')[1]?.trim() || '';
      } else if (line.toLowerCase().includes('genre:')) {
        genre = line.split(':')[1]?.trim() || 'fiction';
      } else if (line.toLowerCase().includes('type:')) {
        type = line.split(':')[1]?.trim() || 'hybrid';
      }
    });
    
    return {
      id: `idea-${Date.now()}`,
      title,
      description,
      genre,
      type: type as any,
      inspiration: `Combined from: ${sourceIdeas.map(i => i.title).join(', ')}`,
      source: 'library',
      status: 'raw',
      createdAt: new Date(),
      lastAccessed: new Date(),
      connections: sourceIdeas.map(idea => ({
        connectedIdeaId: idea.id,
        connectionType: 'inspired_by' as const,
        strength: 80,
        description: `Combined with ${idea.title}`
      })),
      development: {
        notes: [],
        variations: [],
        relatedProjects: [],
        developmentLevel: 0,
        lastModified: new Date()
      },
      tags: sourceIdeas.flatMap(i => i.tags),
      potential: 75
    };
  }

  private createFallbackIdeas(count: number): StoryIdea[] {
    const fallbackIdeas: StoryIdea[] = [
      {
        id: `idea-fallback-1`,
        title: 'The Last Library',
        description: 'In a world where books are banned, a librarian protects the last collection of stories.',
        genre: 'dystopian',
        type: 'premise',
        inspiration: 'AI generated',
        source: 'ai_generated',
        status: 'raw',
        createdAt: new Date(),
        lastAccessed: new Date(),
        connections: [],
        development: {
          notes: [],
          variations: [],
          relatedProjects: [],
          developmentLevel: 0,
          lastModified: new Date()
        },
        tags: ['dystopian', 'books', 'freedom'],
        potential: 70
      },
      {
        id: `idea-fallback-2`,
        title: 'Memory Merchant',
        description: 'A person who can buy and sell memories discovers a memory that could change everything.',
        genre: 'sci-fi',
        type: 'character',
        inspiration: 'AI generated',
        source: 'ai_generated',
        status: 'raw',
        createdAt: new Date(),
        lastAccessed: new Date(),
        connections: [],
        development: {
          notes: [],
          variations: [],
          relatedProjects: [],
          developmentLevel: 0,
          lastModified: new Date()
        },
        tags: ['sci-fi', 'memory', 'identity'],
        potential: 65
      }
    ];

    return fallbackIdeas.slice(0, count);
  }

  private updateLibraryStatistics(): void {
    if (!this.currentLibrary) return;

    const projects = this.currentLibrary.projects;
    const ideas = this.currentLibrary.ideas;
    const templates = this.currentLibrary.templates;

    this.currentLibrary.statistics = {
      totalProjects: projects.length,
      completedProjects: projects.filter(p => p.status === 'completed').length,
      totalWords: projects.reduce((sum, p) => sum + p.wordCount, 0),
      averageWordsPerProject: projects.length > 0 ? 
        projects.reduce((sum, p) => sum + p.wordCount, 0) / projects.length : 0,
      mostProductiveDay: 'Monday', // Would calculate from sessions
      favoriteGenre: this.getMostCommonGenre(projects),
      totalWritingTime: projects.reduce((sum, p) => 
        sum + p.metadata.writingSessions.reduce((sessionSum, s) => sessionSum + s.duration, 0), 0
      ) / 60, // Convert to hours
      ideasGenerated: ideas.length,
      ideasUsed: ideas.filter(i => i.status === 'used').length,
      templatesCreated: templates.length,
      templatesUsed: templates.reduce((sum, t) => sum + t.usageCount, 0)
    };

    this.currentLibrary.lastUpdated = new Date();
  }

  private getMostCommonGenre(projects: NovelProject[]): string {
    const genreCount: Record<string, number> = {};
    projects.forEach(project => {
      genreCount[project.genre] = (genreCount[project.genre] || 0) + 1;
    });
    
    return Object.entries(genreCount)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'fiction';
  }

  private getEmptyOverview() {
    return {
      projects: {
        total: 0,
        byStatus: {},
        byGenre: {},
        totalWords: 0
      },
      ideas: {
        total: 0,
        byStatus: {},
        byType: {},
        averagePotential: 0
      },
      templates: {
        total: 0,
        byType: {},
        averageRating: 0,
        totalUsage: 0
      },
      writing: {
        totalSessions: 0,
        totalHours: 0,
        averageSessionLength: 0,
        mostProductiveDay: '',
        dailyAverage: 0
      }
    };
  }

  // Export/Import methods
  public exportLibrary(): string {
    if (!this.currentLibrary) return '';
    
    return JSON.stringify(this.currentLibrary, (key, value) => {
      if (value instanceof Map) {
        return Object.fromEntries(value);
      }
      return value;
    }, 2);
  }

  public importLibrary(jsonString: string): ProjectLibrary {
    try {
      const library = JSON.parse(jsonString) as ProjectLibrary;
      
      // Convert Maps back from objects if needed
      // (Would need to handle any Map conversions here)
      
      this.currentLibrary = library;
      return library;
    } catch (error) {
      throw new Error('Invalid library JSON format');
    }
  }

  // Get current library
  public getCurrentLibrary(): ProjectLibrary | null {
    return this.currentLibrary;
  }
}

export default ProjectLibraryService;
export type {
  ProjectLibrary,
  NovelProject,
  ProjectTemplate,
  StoryIdea,
  WritingSession,
  ProjectNote,
  ProjectMilestone,
  InspirationSource,
  LibrarySettings,
  LibraryStatistics
};
