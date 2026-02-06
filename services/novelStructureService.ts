import { NovelNode, AIActionType } from "../types";
import UltimateAIService from "./ultimateAIService";
import AIWritingAssistantService from "./aiWritingAssistantService";

// Novel Structure Service - Tạo và quản lý cấu trúc truyện phức tạp
// Hỗ trợ nhiều thể loại và cấu trúc truyện khác nhau

interface NovelStructure {
  id: string;
  title: string;
  genre: string;
  structure: {
    type: 'linear' | 'nonlinear' | 'episodic' | 'multi-perspective';
    chapters: ChapterStructure[];
    arcs: StoryArc[];
    timelines: Timeline[];
    perspectives: Perspective[];
  };
  metadata: {
    totalWords: number;
    estimatedReadingTime: number;
    complexity: 'simple' | 'medium' | 'complex';
    targetAudience: string;
    themes: string[];
    tags: string[];
  };
  settings: {
    writingStyle: 'formal' | 'informal' | 'poetic' | 'dramatic';
    pacing: 'slow' | 'moderate' | 'fast' | 'variable';
    tone: 'serious' | 'humorous' | 'romantic' | 'suspenseful';
    pointOfView: 'first-person' | 'third-person-limited' | 'third-person-omniscient' | 'multiple';
  };
}

interface ChapterStructure {
  id: string;
  title: string;
  order: number;
  type: 'prologue' | 'chapter' | 'interlude' | 'epilogue';
  wordCount: number;
  summary: string;
  keyEvents: string[];
  characters: string[];
  locations: string[];
  themes: string[];
  conflicts: Conflict[];
  resolution?: string;
  cliffhanger?: boolean;
  emotionalArc: EmotionalArc;
  connections: ChapterConnection[];
}

interface StoryArc {
  id: string;
  name: string;
  type: 'character' | 'plot' | 'theme' | 'emotional';
  description: string;
  chapters: string[];
  progression: ArcProgression[];
  climax: {
    chapterId: string;
    description: string;
    impact: 'low' | 'medium' | 'high' | 'critical';
  };
  resolution: {
    chapterId: string;
    description: string;
    satisfaction: 'poor' | 'fair' | 'good' | 'excellent';
  };
}

interface Timeline {
  id: string;
  name: string;
  type: 'linear' | 'parallel' | 'flashback' | 'flashforward';
  events: TimelineEvent[];
  startPoint: {
    chapterId: string;
    description: string;
  };
  endPoint: {
    chapterId: string;
    description: string;
  };
}

interface Perspective {
  id: string;
  characterId: string;
  characterName: string;
  pointOfView: 'first-person' | 'third-person-limited';
  chapters: string[];
  voice: {
    tone: string;
    vocabulary: string;
    speechPatterns: string[];
    personality: string[];
  };
  development: PerspectiveDevelopment[];
}

interface Conflict {
  id: string;
  type: 'internal' | 'external' | 'interpersonal' | 'societal' | 'supernatural';
  description: string;
  participants: string[];
  intensity: 'low' | 'medium' | 'high' | 'extreme';
  resolution?: string;
  impact: 'minor' | 'moderate' | 'major' | 'transformative';
}

interface EmotionalArc {
  emotion: string;
  intensity: number; // 0-100
  progression: {
    start: number;
    peak: number;
    end: number;
    pattern: 'steady' | 'rising' | 'falling' | 'oscillating' | 'explosive';
  };
  triggers: string[];
}

interface ChapterConnection {
  type: 'sequential' | 'causal' | 'thematic' | 'character' | 'temporal';
  targetChapterId: string;
  description: string;
  strength: 'weak' | 'moderate' | 'strong' | 'critical';
}

interface ArcProgression {
  chapterId: string;
  progress: number; // 0-100
  significance: 'minor' | 'moderate' | 'major' | 'critical';
  description: string;
}

interface TimelineEvent {
  id: string;
  chapterId: string;
  timestamp: string;
  description: string;
  significance: 'background' | 'plot' | 'character' | 'foreshadowing';
  connections: string[]; // IDs of connected events
}

interface PerspectiveDevelopment {
  chapterId: string;
  growth: number; // -100 to 100
  change: string;
  reason: string;
  impact: 'minor' | 'moderate' | 'major' | 'transformative';
}

interface NovelTemplate {
  id: string;
  name: string;
  genre: string;
  description: string;
  structure: Omit<NovelStructure, 'id' | 'title' | 'metadata'>;
  chapterTemplates: ChapterTemplate[];
  arcTemplates: ArcTemplate[];
}

interface ChapterTemplate {
  type: 'prologue' | 'chapter' | 'interlude' | 'epilogue';
  purpose: string;
  suggestedLength: {
    min: number;
    max: number;
    optimal: number;
  };
  keyElements: string[];
  commonPitfalls: string[];
  examples: string[];
}

interface ArcTemplate {
  type: 'character' | 'plot' | 'theme' | 'emotional';
  name: string;
  description: string;
  progression: ArcProgression[];
  climax: string;
  resolution: string;
}

class NovelStructureService {
  private ultimateAI: UltimateAIService;
  private aiAssistant: AIWritingAssistantService;
  private templates: Map<string, NovelTemplate> = new Map();

  constructor() {
    this.ultimateAI = new UltimateAIService();
    this.aiAssistant = new AIWritingAssistantService();
    this.initializeTemplates();
  }

  // Initialize predefined templates
  private initializeTemplates() {
    const templates: NovelTemplate[] = [
      {
        id: 'fantasy-epic',
        name: 'Fantasy Epic',
        genre: 'fantasy',
        description: 'Epic fantasy adventure with multiple storylines and complex world-building',
        structure: {
          type: 'multi-perspective',
          chapters: [],
          arcs: [],
          timelines: [],
          perspectives: []
        },
        settings: {
          writingStyle: 'dramatic',
          pacing: 'variable',
          tone: 'serious',
          pointOfView: 'third-person-omniscient'
        },
        chapterTemplates: [
          {
            type: 'prologue',
            purpose: 'Set up the world and ancient prophecy',
            suggestedLength: { min: 1000, max: 3000, optimal: 2000 },
            keyElements: ['world-building', 'prophecy', 'ancient history', 'foreshadowing'],
            commonPitfalls: ['info-dumping', 'too much exposition'],
            examples: ['The ancient prophecy foretold...', 'In the age of legends...']
          },
          {
            type: 'chapter',
            purpose: 'Develop character and advance plot',
            suggestedLength: { min: 2000, max: 5000, optimal: 3500 },
            keyElements: ['character development', 'plot advancement', 'dialogue', 'action'],
            commonPitfalls: ['pacing issues', 'character inconsistency'],
            examples: ['The hero embarks on a journey...', 'A mysterious stranger arrives...']
          }
        ],
        arcTemplates: [
          {
            type: 'character',
            name: 'Hero\'s Journey',
            description: 'Classic hero\'s journey arc',
            progression: [
              { chapterId: '', progress: 10, significance: 'minor', description: 'Call to adventure' },
              { chapterId: '', progress: 30, significance: 'major', description: 'Crossing the threshold' },
              { chapterId: '', progress: 70, significance: 'critical', description: 'Facing the ordeal' },
              { chapterId: '', progress: 100, significance: 'critical', description: 'Return with wisdom' }
            ],
            climax: 'Hero faces greatest challenge',
            resolution: 'Hero returns transformed'
          }
        ]
      },
      {
        id: 'romance-contemporary',
        name: 'Contemporary Romance',
        genre: 'romance',
        description: 'Modern romance with emotional depth and character growth',
        structure: {
          type: 'linear',
          chapters: [],
          arcs: [],
          timelines: [],
          perspectives: []
        },
        settings: {
          writingStyle: 'informal',
          pacing: 'moderate',
          tone: 'romantic',
          pointOfView: 'multiple'
        },
        chapterTemplates: [
          {
            type: 'chapter',
            purpose: 'Develop romantic tension',
            suggestedLength: { min: 1500, max: 4000, optimal: 2500 },
            keyElements: ['romantic tension', 'character chemistry', 'emotional moments', 'dialogue'],
            commonPitfalls: ['clichés', 'unrealistic dialogue'],
            examples: ['Their eyes met across the room...', 'The moment changed everything...']
          }
        ],
        arcTemplates: [
          {
            type: 'emotional',
            name: 'Emotional Growth',
            description: 'Characters grow and heal through love',
            progression: [
              { chapterId: '', progress: 20, significance: 'moderate', description: 'Initial attraction' },
              { chapterId: '', progress: 50, significance: 'major', description: 'Emotional vulnerability' },
              { chapterId: '', progress: 80, significance: 'critical', description: 'Emotional breakthrough' },
              { chapterId: '', progress: 100, significance: 'critical', description: 'Emotional fulfillment' }
            ],
            climax: 'Emotional confession or realization',
            resolution: 'Characters find emotional completeness'
          }
        ]
      },
      {
        id: 'mystery-thriller',
        name: 'Mystery Thriller',
        genre: 'mystery',
        description: 'Suspenseful mystery with twists and turns',
        structure: {
          type: 'nonlinear',
          chapters: [],
          arcs: [],
          timelines: [],
          perspectives: []
        },
        settings: {
          writingStyle: 'dramatic',
          pacing: 'fast',
          tone: 'suspenseful',
          pointOfView: 'first-person'
        },
        chapterTemplates: [
          {
            type: 'chapter',
            purpose: 'Build suspense and reveal clues',
            suggestedLength: { min: 2000, max: 4500, optimal: 3000 },
            keyElements: ['suspense', 'clues', 'red herrings', 'revelations'],
            commonPitfalls: ['giving away too much', 'inconsistent clues'],
            examples: ['The detective found a clue...', 'Something didn\'t add up...']
          }
        ],
        arcTemplates: [
          {
            type: 'plot',
            name: 'Investigation Arc',
            description: 'Unraveling the mystery',
            progression: [
              { chapterId: '', progress: 15, significance: 'moderate', description: 'Crime discovered' },
              { chapterId: '', progress: 40, significance: 'major', description: 'Key evidence found' },
              { chapterId: '', progress: 75, significance: 'critical', description: 'Breakthrough insight' },
              { chapterId: '', progress: 100, significance: 'critical', description: 'Mystery solved' }
            ],
            climax: 'Final confrontation and revelation',
            resolution: 'Justice served and truth revealed'
          }
        ]
      }
    ];

    templates.forEach(template => {
      this.templates.set(template.id, template);
    });
  }

  // Create novel structure from template
  public async createNovelFromTemplate(
    templateId: string,
    title: string,
    customizations?: Partial<NovelStructure>
  ): Promise<NovelStructure> {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    const baseStructure: NovelStructure = {
      id: `novel-${Date.now()}`,
      title,
      genre: template.genre,
      structure: {
        type: template.structure.type,
        chapters: [],
        arcs: [],
        timelines: [],
        perspectives: []
      },
      metadata: {
        totalWords: 0,
        estimatedReadingTime: 0,
        complexity: 'medium',
        targetAudience: 'general',
        themes: [],
        tags: []
      },
      settings: template.settings
    };

    // Apply customizations
    if (customizations) {
      Object.assign(baseStructure, customizations);
    }

    // Generate initial chapters based on template
    await this.generateInitialChapters(baseStructure, template);

    return baseStructure;
  }

  // Generate initial chapters
  private async generateInitialChapters(
    structure: NovelStructure,
    template: NovelTemplate
  ): Promise<void> {
    const chapters: ChapterStructure[] = [];

    // Generate prologue if template includes it
    const prologueTemplate = template.chapterTemplates.find(t => t.type === 'prologue');
    if (prologueTemplate) {
      const prologue = await this.generateChapterFromTemplate(
        'prologue',
        0,
        prologueTemplate,
        structure
      );
      chapters.push(prologue);
    }

    // Generate main chapters (typically 3-5 chapters initially)
    const chapterTemplate = template.chapterTemplates.find(t => t.type === 'chapter');
    if (chapterTemplate) {
      for (let i = 1; i <= 5; i++) {
        const chapter = await this.generateChapterFromTemplate(
          'chapter',
          i,
          chapterTemplate,
          structure
        );
        chapters.push(chapter);
      }
    }

    structure.structure.chapters = chapters;
  }

  // Generate chapter from template
  private async generateChapterFromTemplate(
    type: 'prologue' | 'chapter' | 'interlude' | 'epilogue',
    order: number,
    template: ChapterTemplate,
    structure: NovelStructure
  ): Promise<ChapterStructure> {
    const prompt = this.buildChapterPrompt(template, structure, order);
    
    try {
      const result = await this.ultimateAI.generateContent(
        {
          id: `chapter-${order}`,
          title: `Chapter ${order}`,
          type: 'chapter',
          content: '',
          summary: '',
          children: []
        },
        AIActionType.WRITE_CONTINUE,
        prompt
      );

      const chapter: ChapterStructure = {
        id: `chapter-${order}`,
        title: result.text.includes('\n') ? result.text.split('\n')[0] : `Chapter ${order}`,
        order,
        type,
        wordCount: result.text.length,
        summary: this.extractSummary(result.text),
        keyEvents: this.extractKeyEvents(result.text),
        characters: this.extractCharacters(result.text),
        locations: this.extractLocations(result.text),
        themes: this.extractThemes(result.text),
        conflicts: this.extractConflicts(result.text),
        emotionalArc: this.analyzeEmotionalArc(result.text),
        connections: []
      };

      return chapter;
    } catch (error) {
      console.error('Failed to generate chapter:', error);
      return this.createFallbackChapter(type, order, template);
    }
  }

  // Build chapter generation prompt
  private buildChapterPrompt(
    template: ChapterTemplate,
    structure: NovelStructure,
    order: number
  ): string {
    return `
Write a ${template.type} for a ${structure.genre} novel titled "${structure.title}".

Requirements:
- Purpose: ${template.purpose}
- Length: ${template.suggestedLength.min}-${template.suggestedLength.max} words (optimal: ${template.suggestedLength.optimal})
- Key elements to include: ${template.keyElements.join(', ')}
- Writing style: ${structure.settings.writingStyle}
- Pacing: ${structure.settings.pacing}
- Tone: ${structure.settings.tone}
- Point of view: ${structure.settings.pointOfView}

Avoid these common pitfalls: ${template.commonPitfalls.join(', ')}

Chapter order: ${order}
Genre: ${structure.genre}

Example style: ${template.examples[0]}

Write compelling content that fits the novel's overall structure and advances the story meaningfully.
    `.trim();
  }

  // Extract various elements from generated text
  private extractSummary(text: string): string {
    const sentences = text.split(/[.!?]+/);
    return sentences.slice(0, 3).join('. ') + (sentences.length > 3 ? '...' : '');
  }

  private extractKeyEvents(text: string): string[] {
    // Simple keyword-based extraction for now
    const eventKeywords = ['suddenly', 'then', 'after', 'when', 'as', 'while', 'discovered', 'realized', 'decided'];
    const events: string[] = [];
    
    eventKeywords.forEach(keyword => {
      const regex = new RegExp(`[^.!?]*${keyword}[^.!?]*[.!?]`, 'gi');
      const matches = text.match(regex);
      if (matches) {
        events.push(...matches.slice(0, 2)); // Limit to avoid too many
      }
    });
    
    return events.slice(0, 5); // Limit to top 5 events
  }

  private extractCharacters(text: string): string[] {
    // Simple capitalization-based extraction
    const words = text.split(/\s+/);
    const potentialNames = words.filter(word => 
      word.length > 2 && 
      /^[A-Z][a-z]+$/.test(word) &&
      !['The', 'And', 'But', 'For', 'Not', 'With', 'Have', 'This', 'That', 'From'].includes(word)
    );
    
    // Count frequency and return most common
    const nameCount = new Map<string, number>();
    potentialNames.forEach(name => {
      nameCount.set(name, (nameCount.get(name) || 0) + 1);
    });
    
    return Array.from(nameCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name]) => name);
  }

  private extractLocations(text: string): string[] {
    // Simple location keyword extraction
    const locationKeywords = ['room', 'house', 'street', 'city', 'forest', 'mountain', 'river', 'castle', 'building'];
    const locations: string[] = [];
    
    locationKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b\\w*${keyword}\\w*\\b`, 'gi');
      const matches = text.match(regex);
      if (matches) {
        locations.push(...matches);
      }
    });
    
    return [...new Set(locations)].slice(0, 5);
  }

  private extractThemes(text: string): string[] {
    const themeKeywords = {
      'love': ['love', 'romance', 'heart', 'passion', 'affection'],
      'betrayal': ['betrayal', 'deceive', 'lie', 'cheat', 'backstab'],
      'courage': ['courage', 'brave', 'fearless', 'heroic', 'bold'],
      'mystery': ['mystery', 'secret', 'hidden', 'unknown', 'puzzle'],
      'redemption': ['redemption', 'forgive', 'second chance', 'atonement', 'mercy']
    };
    
    const themes: string[] = [];
    
    Object.entries(themeKeywords).forEach(([theme, keywords]) => {
      const found = keywords.some(keyword => 
        text.toLowerCase().includes(keyword.toLowerCase())
      );
      if (found) {
        themes.push(theme);
      }
    });
    
    return themes;
  }

  private extractConflicts(text: string): Conflict[] {
    const conflicts: Conflict[] = [];
    
    // Simple conflict detection based on keywords
    const conflictPatterns = [
      { type: 'internal', keywords: ['doubt', 'uncertainty', 'conflicted', 'struggle'] },
      { type: 'external', keywords: ['fight', 'battle', 'struggle', 'conflict'] },
      { type: 'interpersonal', keywords: ['argue', 'disagree', 'tension', 'conflict'] }
    ];
    
    conflictPatterns.forEach(pattern => {
      const found = pattern.keywords.some(keyword => 
        text.toLowerCase().includes(keyword.toLowerCase())
      );
      if (found) {
        conflicts.push({
          id: `conflict-${Date.now()}-${Math.random()}`,
          type: pattern.type as any,
          description: `Conflict detected: ${pattern.type}`,
          participants: [],
          intensity: 'medium',
          impact: 'moderate'
        });
      }
    });
    
    return conflicts.slice(0, 3);
  }

  private analyzeEmotionalArc(text: string): EmotionalArc {
    // Simple emotion analysis
    const positiveWords = ['happy', 'joy', 'love', 'excited', 'hopeful', 'peaceful'];
    const negativeWords = ['sad', 'angry', 'fear', 'despair', 'hopeless', 'anxious'];
    
    const positiveCount = positiveWords.reduce((count, word) => 
      count + (text.toLowerCase().split(word.toLowerCase()).length - 1), 0
    );
    
    const negativeCount = negativeWords.reduce((count, word) => 
      count + (text.toLowerCase().split(word.toLowerCase()).length - 1), 0
    );
    
    const totalEmotionalWords = positiveCount + negativeCount;
    const intensity = totalEmotionalWords > 0 ? 
      Math.min(100, (totalEmotionalWords / text.length * 1000)) : 0;
    
    const emotion = positiveCount > negativeCount ? 'positive' : 
                   negativeCount > positiveCount ? 'negative' : 'neutral';
    
    return {
      emotion,
      intensity,
      progression: {
        start: intensity * 0.3,
        peak: intensity,
        end: intensity * 0.7,
        pattern: 'oscillating'
      },
      triggers: this.extractEmotionalTriggers(text)
    };
  }

  private extractEmotionalTriggers(text: string): string[] {
    const triggerPatterns = [
      'suddenly', 'unexpectedly', 'shock', 'surprise',
      'realized', 'discovered', 'found', 'remembered',
      'felt', 'experienced', 'overwhelmed', 'moved'
    ];
    
    return triggerPatterns.filter(trigger => 
      text.toLowerCase().includes(trigger.toLowerCase())
    ).slice(0, 5);
  }

  // Fallback chapter creation
  private createFallbackChapter(
    type: 'prologue' | 'chapter' | 'interlude' | 'epilogue',
    order: number,
    template: ChapterTemplate
  ): ChapterStructure {
    return {
      id: `chapter-${order}`,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} ${order}`,
      order,
      type,
      wordCount: template.suggestedLength.optimal,
      summary: `Generated ${type} following template guidelines`,
      keyEvents: template.keyElements.slice(0, 3),
      characters: [],
      locations: [],
      themes: [],
      conflicts: [],
      emotionalArc: {
        emotion: 'neutral',
        intensity: 50,
        progression: {
          start: 30,
          peak: 70,
          end: 50,
          pattern: 'steady'
        },
        triggers: []
      },
      connections: []
    };
  }

  // Add new chapter to structure
  public async addChapter(
    structure: NovelStructure,
    position: number,
    context?: string
  ): Promise<ChapterStructure> {
    const template = this.templates.get(`${structure.genre}-template`);
    const chapterTemplate = template?.chapterTemplates.find(t => t.type === 'chapter');
    
    if (!chapterTemplate) {
      throw new Error('No chapter template available');
    }

    const chapter = await this.generateChapterFromTemplate(
      'chapter',
      position,
      chapterTemplate,
      structure
    );

    // Insert chapter at specified position
    structure.structure.chapters.splice(position, 0, chapter);
    
    // Update chapter orders
    structure.structure.chapters.forEach((ch, index) => {
      ch.order = index;
    });

    return chapter;
  }

  // Generate story arcs
  public async generateStoryArcs(structure: NovelStructure): Promise<StoryArc[]> {
    const template = this.templates.get(`${structure.genre}-template`);
    const arcTemplates = template?.arcTemplates || [];
    
    const arcs: StoryArc[] = [];
    
    for (const arcTemplate of arcTemplates) {
      const arc: StoryArc = {
        id: `arc-${Date.now()}-${Math.random()}`,
        name: arcTemplate.name,
        type: arcTemplate.type,
        description: arcTemplate.description,
        chapters: this.assignChaptersToArc(structure.structure.chapters, arcTemplate.progression.length),
        progression: arcTemplate.progression.map((prog, index) => ({
          ...prog,
          chapterId: structure.structure.chapters[index]?.id || ''
        })),
        climax: {
          chapterId: structure.structure.chapters[Math.floor(structure.structure.chapters.length * 0.75)]?.id || '',
          description: arcTemplate.climax,
          impact: 'critical'
        },
        resolution: {
          chapterId: structure.structure.chapters[structure.structure.chapters.length - 1]?.id || '',
          description: arcTemplate.resolution,
          satisfaction: 'good'
        }
      };
      
      arcs.push(arc);
    }

    structure.structure.arcs = arcs;
    return arcs;
  }

  // Assign chapters to arc
  private assignChaptersToArc(chapters: ChapterStructure[], progressionPoints: number): string[] {
    const step = Math.floor(chapters.length / progressionPoints);
    const assignedChapters: string[] = [];
    
    for (let i = 0; i < progressionPoints; i++) {
      const chapterIndex = Math.min(i * step, chapters.length - 1);
      assignedChapters.push(chapters[chapterIndex]?.id || '');
    }
    
    return assignedChapters.filter(id => id !== '');
  }

  // Generate perspectives
  public async generatePerspectives(structure: NovelStructure): Promise<Perspective[]> {
    const perspectives: Perspective[] = [];
    const characters = this.extractAllCharacters(structure);
    
    if (structure.settings.pointOfView === 'multiple') {
      // Create perspective for each main character
      for (const character of characters.slice(0, 3)) {
        const perspective: Perspective = {
          id: `perspective-${Date.now()}-${Math.random()}`,
          characterId: character.id,
          characterName: character.name,
          pointOfView: 'third-person-limited',
          chapters: this.assignChaptersToCharacter(structure.structure.chapters, character.name),
          voice: {
            tone: this.inferCharacterTone(character.name),
            vocabulary: 'standard',
            speechPatterns: [],
            personality: []
          },
          development: []
        };
        
        perspectives.push(perspective);
      }
    } else {
      // Single perspective
      const mainCharacter = characters[0];
      if (mainCharacter) {
        const perspective: Perspective = {
          id: `perspective-${Date.now()}`,
          characterId: mainCharacter.id,
          characterName: mainCharacter.name,
          pointOfView: structure.settings.pointOfView as any,
          chapters: structure.structure.chapters.map(ch => ch.id),
          voice: {
            tone: structure.settings.tone,
            vocabulary: 'standard',
            speechPatterns: [],
            personality: []
          },
          development: []
        };
        
        perspectives.push(perspective);
      }
    }
    
    structure.structure.perspectives = perspectives;
    return perspectives;
  }

  // Extract all characters from structure
  private extractAllCharacters(structure: NovelStructure): Array<{id: string, name: string}> {
    const characterSet = new Set<string>();
    
    structure.structure.chapters.forEach(chapter => {
      chapter.characters.forEach(character => {
        characterSet.add(character);
      });
    });
    
    return Array.from(characterSet).map((name, index) => ({
      id: `character-${index}`,
      name
    }));
  }

  // Infer character tone
  private inferCharacterTone(characterName: string): string {
    // Simple heuristic based on name patterns
    if (characterName.length <= 4) return 'formal';
    if (characterName.includes('a') || characterName.includes('e')) return 'warm';
    if (characterName.includes('k') || characterName.includes('r')) return 'strong';
    return 'neutral';
  }

  // Assign chapters to character
  private assignChaptersToCharacter(chapters: ChapterStructure[], characterName: string): string[] {
    return chapters
      .filter(chapter => chapter.characters.includes(characterName))
      .map(chapter => chapter.id);
  }

  // Get available templates
  public getAvailableTemplates(): NovelTemplate[] {
    return Array.from(this.templates.values());
  }

  // Get template by ID
  public getTemplate(templateId: string): NovelTemplate | undefined {
    return this.templates.get(templateId);
  }

  // Update structure metadata
  public updateStructureMetadata(structure: NovelStructure): void {
    structure.metadata.totalWords = structure.structure.chapters.reduce(
      (total, chapter) => total + chapter.wordCount, 0
    );
    
    structure.metadata.estimatedReadingTime = Math.ceil(
      structure.metadata.totalWords / 200 // Average reading speed
    );
    
    // Determine complexity based on structure
    const arcCount = structure.structure.arcs.length;
    const perspectiveCount = structure.structure.perspectives.length;
    const timelineCount = structure.structure.timelines.length;
    
    if (arcCount <= 2 && perspectiveCount <= 1 && timelineCount <= 1) {
      structure.metadata.complexity = 'simple';
    } else if (arcCount <= 4 && perspectiveCount <= 3 && timelineCount <= 2) {
      structure.metadata.complexity = 'medium';
    } else {
      structure.metadata.complexity = 'complex';
    }
  }

  // Export structure to JSON
  public exportStructure(structure: NovelStructure): string {
    return JSON.stringify(structure, null, 2);
  }

  // Import structure from JSON
  public importStructure(jsonString: string): NovelStructure {
    try {
      const structure = JSON.parse(jsonString) as NovelStructure;
      this.updateStructureMetadata(structure);
      return structure;
    } catch (error) {
      throw new Error('Invalid structure JSON format');
    }
  }

  // Validate structure
  public validateStructure(structure: NovelStructure): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check required fields
    if (!structure.title) errors.push('Title is required');
    if (!structure.genre) errors.push('Genre is required');
    if (!structure.structure.chapters.length) errors.push('At least one chapter is required');

    // Check chapter order
    const chapterOrders = structure.structure.chapters.map(ch => ch.order);
    for (let i = 0; i < chapterOrders.length; i++) {
      if (chapterOrders[i] !== i) {
        errors.push(`Chapter order mismatch at position ${i}`);
        break;
      }
    }

    // Check for duplicate chapter IDs
    const chapterIds = structure.structure.chapters.map(ch => ch.id);
    const duplicateIds = chapterIds.filter((id, index) => chapterIds.indexOf(id) !== index);
    if (duplicateIds.length > 0) {
      errors.push(`Duplicate chapter IDs: ${duplicateIds.join(', ')}`);
    }

    // Warnings
    if (structure.structure.chapters.length < 3) {
      warnings.push('Novel has fewer than 3 chapters');
    }

    if (structure.metadata.totalWords < 10000) {
      warnings.push('Novel is quite short (less than 10,000 words)');
    }

    if (structure.structure.arcs.length === 0) {
      warnings.push('No story arcs defined');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
}

export default NovelStructureService;
export type { 
  NovelStructure, 
  ChapterStructure, 
  StoryArc, 
  Timeline, 
  Perspective,
  NovelTemplate,
  ChapterTemplate,
  ArcTemplate
};
