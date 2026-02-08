import { NovelNode, AIActionType } from "../types";
import UltimateAIService from "./ultimateAIService";

// Character Development Service - Tạo và phát triển nhân vật phức tạp
// Hỗ trợ character arcs, relationships, và development tracking

interface Character {
  id: string;
  name: string;
  role: 'protagonist' | 'antagonist' | 'supporting' | 'minor' | 'narrator';
  basicInfo: {
    age: number;
    gender: 'male' | 'female' | 'other' | 'non-binary';
    occupation: string;
    background: string;
    appearance: string;
    personality: string[];
  };
  psychology: {
    motivations: string[];
    fears: string[];
    desires: string[];
    flaws: string[];
    strengths: string[];
    values: string[];
    worldview: string;
  };
  relationships: CharacterRelationship[];
  development: CharacterDevelopment[];
  voice: {
    speechPatterns: string[];
    vocabulary: string;
    tone: string;
    accent?: string;
    catchphrases: string[];
  };
  physical: {
    height?: string;
    build?: string;
    distinguishingFeatures: string[];
    health: string;
    abilities: string[];
  };
  story: {
    introduction: string;
    backstory: string;
    characterArc: string;
    climax: string;
    resolution: string;
  };
  metadata: {
    createdAt: Date;
    lastUpdated: Date;
    version: number;
    tags: string[];
    importance: 'main' | 'secondary' | 'tertiary';
  };
}

interface CharacterRelationship {
  id: string;
  targetCharacterId: string;
  targetCharacterName: string;
  type: 'family' | 'friend' | 'enemy' | 'romantic' | 'mentor' | 'rival' | 'ally' | 'neutral';
  description: string;
  history: string;
  currentStatus: 'positive' | 'negative' | 'neutral' | 'complicated';
  development: RelationshipDevelopment[];
  keyMoments: RelationshipMoment[];
}

interface CharacterDevelopment {
  chapterId: string;
  chapterTitle: string;
  changes: CharacterChange[];
  growth: number; // -100 to 100
  significance: 'minor' | 'moderate' | 'major' | 'transformative';
  description: string;
  triggers: string[];
}

interface CharacterChange {
  aspect: 'personality' | 'belief' | 'skill' | 'relationship' | 'worldview';
  before: string;
  after: string;
  reason: string;
  permanence: 'temporary' | 'permanent';
}

interface RelationshipDevelopment {
  chapterId: string;
  change: string;
  newStatus: 'positive' | 'negative' | 'neutral' | 'complicated';
  reason: string;
  significance: 'minor' | 'moderate' | 'major';
}

interface RelationshipMoment {
  chapterId: string;
  description: string;
  emotionalImpact: 'low' | 'medium' | 'high' | 'critical';
  consequences: string[];
}

interface CharacterTemplate {
  id: string;
  name: string;
  genre: string;
  archetype: string;
  description: string;
  baseCharacter: Omit<Character, 'id' | 'metadata'>;
  commonTraits: string[];
  developmentSuggestions: string[];
  relationshipPatterns: string[];
}

interface CharacterProfile {
  character: Character;
  analysis: {
    complexity: 'simple' | 'moderate' | 'complex';
    consistency: number; // 0-100
    growth: number; // 0-100
    relatability: number; // 0-100
    uniqueness: number; // 0-100
  };
  suggestions: {
    improvements: string[];
    plotOpportunities: string[];
    relationshipIdeas: string[];
    conflictSources: string[];
  };
}

class CharacterDevelopmentService {
  private ultimateAI: UltimateAIService;
  private templates: Map<string, CharacterTemplate> = new Map();

  constructor() {
    this.ultimateAI = new UltimateAIService();
    this.initializeTemplates();
  }

  // Initialize character templates
  private initializeTemplates() {
    const templates: CharacterTemplate[] = [
      {
        id: 'hero-journey',
        name: 'Hero\'s Journey',
        genre: 'fantasy',
        archetype: 'hero',
        description: 'Classic hero character who grows through trials and transformation',
        baseCharacter: {
          name: '',
          role: 'protagonist',
          basicInfo: {
            age: 25,
            gender: 'other',
            occupation: 'adventurer',
            background: 'Ordinary background with hidden potential',
            appearance: 'Relatable appearance with distinctive feature',
            personality: ['brave', 'determined', 'curious', 'loyal']
          },
          psychology: {
            motivations: ['justice', 'protecting loved ones', 'self-discovery'],
            fears: ['failure', 'losing loved ones', 'the unknown'],
            desires: ['acceptance', 'mastery', 'purpose'],
            flaws: ['impulsiveness', 'self-doubt', 'naivety'],
            strengths: ['courage', 'resilience', 'empathy'],
            values: ['honor', 'loyalty', 'compassion'],
            worldview: 'Optimistic but realistic'
          },
          relationships: [],
          development: [],
          voice: {
            speechPatterns: ['direct', 'honest', 'sometimes hesitant'],
            vocabulary: 'moderate',
            tone: 'sincere',
            catchphrases: []
          },
          physical: {
            distinguishingFeatures: ['scar', 'unusual eye color'],
            health: 'good',
            abilities: ['growing magical powers', 'combat skills']
          },
          story: {
            introduction: 'Living ordinary life',
            backstory: 'Hidden destiny and mysterious past',
            characterArc: 'From reluctant hero to chosen one',
            climax: 'Faces greatest challenge',
            resolution: 'Transformed and fulfilled'
          }
        },
        commonTraits: ['reluctant hero', 'hidden potential', 'growth mindset'],
        developmentSuggestions: [
          'Gradual power discovery',
          'Mentor relationship',
          'Sacrifice and loss',
          'Self-acceptance journey'
        ],
        relationshipPatterns: [
          'Mentor figure guidance',
          'Rival character conflict',
          'Romantic subplot',
          'Friendship bonds'
        ]
      },
      {
        id: 'anti-hero-redemption',
        name: 'Redeemed Anti-Hero',
        genre: 'drama',
        archetype: 'anti-hero',
        description: 'Flawed character seeking redemption through difficult choices',
        baseCharacter: {
          name: '',
          role: 'protagonist',
          basicInfo: {
            age: 35,
            gender: 'other',
            occupation: 'criminal/outsider',
            background: 'Troubled past with moral ambiguity',
            appearance: 'Weathered, intimidating but with hidden vulnerability',
            personality: ['cynical', 'protective', 'pragmatic', 'loyal to few']
          },
          psychology: {
            motivations: ['redemption', 'protecting someone', 'survival'],
            fears: ['past mistakes', 'vulnerability', 'trust'],
            desires: ['forgiveness', 'peace', 'second chance'],
            flaws: ['cynicism', 'trust issues', 'moral ambiguity'],
            strengths: ['resourcefulness', 'loyalty', 'pragmatism'],
            values: ['loyalty', 'survival', 'redemption'],
            worldview: 'Cynical but hopeful'
          },
          relationships: [],
          development: [],
          voice: {
            speechPatterns: ['terse', 'sarcastic', 'guarded'],
            vocabulary: 'rough',
            tone: 'world-weary',
            catchphrases: []
          },
          physical: {
            distinguishingFeatures: ['scars', 'tired eyes'],
            health: 'declining but resilient',
            abilities: ['combat skills', 'street smarts', 'survival instincts']
          },
          story: {
            introduction: 'Living on the fringes of society',
            backstory: 'Past mistakes and regrets',
            characterArc: 'From selfish to selfless',
            climax: 'Ultimate sacrifice',
            resolution: 'Redeemed or tragic end'
          }
        },
        commonTraits: ['moral ambiguity', 'hidden goodness', 'practical skills'],
        developmentSuggestions: [
          'Gradual moral awakening',
          'Relationship that challenges worldview',
          'Sacrifice for greater good',
          'Confrontation with past'
        ],
        relationshipPatterns: [
          'Mentor who sees potential',
          'Innocent character to protect',
          'Rival from past',
          'Unlikely ally'
        ]
      },
      {
        id: 'villain-tragic',
        name: 'Tragic Villain',
        genre: 'tragedy',
        archetype: 'villain',
        description: 'Complex antagonist with understandable motivations and tragic backstory',
        baseCharacter: {
          name: '',
          role: 'antagonist',
          basicInfo: {
            age: 45,
            gender: 'other',
            occupation: 'leader/ruler',
            background: 'Once noble, now corrupted',
            appearance: 'Commanding presence with signs of inner conflict',
            personality: ['charismatic', 'ruthless', 'intelligent', 'tormented']
          },
          psychology: {
            motivations: ['power', 'order', 'proving worth'],
            fears: ['weakness', 'failure', 'being forgotten'],
            desires: ['respect', 'legacy', 'peace'],
            flaws: ['hubris', 'ruthlessness', 'inability to trust'],
            strengths: ['leadership', 'intelligence', 'determination'],
            values: ['order', 'strength', 'legacy'],
            worldview: 'The world is chaotic and needs strong control'
          },
          relationships: [],
          development: [],
          voice: {
            speechPatterns: ['commanding', 'persuasive', 'formal'],
            vocabulary: 'sophisticated',
            tone: 'authoritative',
            catchphrases: []
          },
          physical: {
            distinguishingFeatures: ['intense eyes', 'imposing stature'],
            health: 'excellent but showing stress',
            abilities: ['strategic thinking', 'leadership', 'special powers']
          },
          story: {
            introduction: 'Established power and threat',
            backstory: 'Tragic fall from grace',
            characterArc: 'From idealistic to corrupted',
            climax: 'Confrontation with hero',
            resolution: 'Redemption or destruction'
          }
        },
        commonTraits: ['charismatic leadership', 'tragic backstory', 'noble goals'],
        developmentSuggestions: [
          'Moments of doubt',
          'Flashbacks to better times',
          'Relationship that humanizes',
          'Choice between power and morality'
        ],
        relationshipPatterns: [
          'Former friend turned enemy',
          'Family complications',
          'Lieutenant who questions orders',
          'Innocent victim that causes doubt'
        ]
      },
      {
        id: 'mentor-wise',
        name: 'Wise Mentor',
        genre: 'fantasy',
        archetype: 'mentor',
        description: 'Experienced guide who helps protagonist grow',
        baseCharacter: {
          name: '',
          role: 'supporting',
          basicInfo: {
            age: 65,
            gender: 'other',
            occupation: 'teacher/advisor',
            background: 'Long history of experience and wisdom',
            appearance: 'Age with dignity and knowing eyes',
            personality: ['wise', 'patient', 'mysterious', 'caring']
          },
          psychology: {
            motivations: ['guiding next generation', 'redemption for past', 'preserving knowledge'],
            fears: ['repeating mistakes', 'failing to guide properly', 'being forgotten'],
            desires: ['peace', 'successful student', 'completion of mission'],
            flaws: ['mysteriousness', 'over-cautious', 'burden of past'],
            strengths: ['wisdom', 'patience', 'insight'],
            values: ['knowledge', 'growth', 'balance'],
            worldview: 'Cyclical nature of life and growth'
          },
          relationships: [],
          development: [],
          voice: {
            speechPatterns: ['riddling', 'metaphorical', 'patient'],
            vocabulary: 'rich and varied',
            tone: 'calm and wise',
            catchphrases: []
          },
          physical: {
            distinguishingFeatures: ['knowing smile', 'weathered hands'],
            health: 'aging but strong',
            abilities: ['wisdom', 'magic', 'experience']
          },
          story: {
            introduction: 'Mysterious appearance when needed',
            backstory: 'Great power and past failures',
            characterArc: 'From guardian to releaser',
            climax: 'Final lesson or sacrifice',
            resolution: 'Legacy through student'
          }
        },
        commonTraits: ['mysterious wisdom', 'hidden past', 'sacrificial nature'],
        developmentSuggestions: [
          'Gradual revelation of backstory',
          'Testing of student',
          'Personal sacrifice',
          'Passing of torch'
        ],
        relationshipPatterns: [
          'Parental figure to protagonist',
          'Connection to main conflict',
          'Hidden knowledge',
          'Personal stake in outcome'
        ]
      }
    ];

    templates.forEach(template => {
      this.templates.set(template.id, template);
    });
  }

  // Create character from template
  public async createCharacterFromTemplate(
    templateId: string,
    name: string,
    customizations?: Partial<Character>
  ): Promise<Character> {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    const baseCharacter: Character = {
      ...template.baseCharacter,
      id: `character-${Date.now()}`,
      name,
      metadata: {
        createdAt: new Date(),
        lastUpdated: new Date(),
        version: 1,
        tags: [template.genre, template.archetype],
        importance: template.baseCharacter.role === 'protagonist' ? 'main' : 'secondary'
      }
    };

    // Apply customizations
    if (customizations) {
      Object.assign(baseCharacter, customizations);
    }

    // Generate detailed backstory and story elements
    await this.enhanceCharacterWithAI(baseCharacter, template);

    return baseCharacter;
  }

  // Enhance character with AI
  private async enhanceCharacterWithAI(
    character: Character,
    template: CharacterTemplate
  ): Promise<void> {
    try {
      const prompt = this.buildCharacterEnhancementPrompt(character, template);
      
      const result = await this.ultimateAI.generateContent(
        {
          id: character.id,
          title: character.name,
          type: 'character',
          content: '',
          summary: '',
          children: []
        },
        AIActionType.WRITE_CONTINUE,
        prompt
      );

      // Parse AI response to enhance character
      const enhancements = this.parseCharacterEnhancements(result.text);
      
      // Apply enhancements
      if (enhancements.backstory) {
        character.story.backstory = enhancements.backstory;
      }
      
      if (enhancements.appearance) {
        character.basicInfo.appearance = enhancements.appearance;
      }
      
      if (enhancements.personality) {
        character.basicInfo.personality = [
          ...character.basicInfo.personality,
          ...enhancements.personality
        ];
      }
      
      if (enhancements.voice) {
        character.voice = {
          ...character.voice,
          ...enhancements.voice
        };
      }
      
    } catch (error) {
      console.error('Failed to enhance character with AI:', error);
    }
  }

  // Build character enhancement prompt
  private buildCharacterEnhancementPrompt(
    character: Character,
    template: CharacterTemplate
  ): string {
    return `
Enhance this character with detailed, unique elements:

Character Name: ${character.name}
Archetype: ${template.archetype}
Genre: ${template.genre}
Role: ${character.role}

Current Information:
- Age: ${character.basicInfo.age}
- Gender: ${character.basicInfo.gender}
- Occupation: ${character.basicInfo.occupation}
- Background: ${character.basicInfo.background}
- Personality: ${character.basicInfo.personality.join(', ')}
- Motivations: ${character.psychology.motivations.join(', ')}
- Fears: ${character.psychology.fears.join(', ')}

Please provide:
1. A detailed, unique appearance description (2-3 sentences)
2. An expanded backstory that explains their current motivations (3-4 sentences)
3. Additional personality traits that make them unique (3-5 traits)
4. Speech patterns and voice characteristics (2-3 sentences)
5. A distinctive catchphrase or mannerism

Make the character feel real, complex, and memorable. Avoid clichés when possible.
    `.trim();
  }

  // Parse AI enhancements
  private parseCharacterEnhancements(aiResponse: string): any {
    const enhancements: any = {};
    
    // Simple parsing based on section headers
    const sections = aiResponse.split(/\n\n+/);
    
    sections.forEach(section => {
      if (section.toLowerCase().includes('appearance')) {
        enhancements.appearance = section.split(':')[1]?.trim() || '';
      } else if (section.toLowerCase().includes('backstory')) {
        enhancements.backstory = section.split(':')[1]?.trim() || '';
      } else if (section.toLowerCase().includes('personality')) {
        const traits = section.split(':')[1]?.trim() || '';
        enhancements.personality = traits.split(',').map(t => t.trim());
      } else if (section.toLowerCase().includes('speech') || section.toLowerCase().includes('voice')) {
        enhancements.voice = {
          speechPatterns: [section.trim()],
          tone: 'determined by content'
        };
      } else if (section.toLowerCase().includes('catchphrase') || section.toLowerCase().includes('mannerism')) {
        enhancements.catchphrases = [section.split(':')[1]?.trim() || ''];
      }
    });
    
    return enhancements;
  }

  // Generate character relationships
  public async generateRelationships(
    character: Character,
    otherCharacters: Character[]
  ): Promise<CharacterRelationship[]> {
    const relationships: CharacterRelationship[] = [];
    
    // Generate relationships with other characters
    for (const otherChar of otherCharacters) {
      if (otherChar.id === character.id) continue;
      
      const relationship = await this.generateRelationship(character, otherChar);
      if (relationship) {
        relationships.push(relationship);
      }
    }
    
    character.relationships = relationships;
    return relationships;
  }

  // Generate individual relationship
  private async generateRelationship(
    character: Character,
    otherCharacter: Character
  ): Promise<CharacterRelationship | null> {
    try {
      const prompt = `
Define the relationship between these two characters:

Character 1: ${character.name} (${character.role})
- Personality: ${character.basicInfo.personality.join(', ')}
- Motivations: ${character.psychology.motivations.join(', ')}

Character 2: ${otherCharacter.name} (${otherCharacter.role})
- Personality: ${otherCharacter.basicInfo.personality.join(', ')}
- Motivations: ${otherCharacter.psychology.motivations.join(', ')}

Determine:
1. Relationship type (family, friend, enemy, romantic, mentor, rival, ally, neutral)
2. Brief description of their relationship
3. Current status (positive, negative, neutral, complicated)
4. One key moment in their relationship

Keep it concise and realistic.
      `.trim();
      
      const result = await this.ultimateAI.generateContent(
        {
          id: `relationship-${character.id}-${otherCharacter.id}`,
          title: `Relationship: ${character.name} & ${otherCharacter.name}`,
          type: 'relationship',
          content: '',
          summary: '',
          children: []
        },
        AIActionType.WRITE_CONTINUE,
        prompt
      );

      // Parse relationship from AI response
      const parsed = this.parseRelationship(result.text);
      
      if (parsed) {
        return {
          id: `rel-${character.id}-${otherCharacter.id}`,
          targetCharacterId: otherCharacter.id,
          targetCharacterName: otherCharacter.name,
          type: parsed.type,
          description: parsed.description,
          history: parsed.history || '',
          currentStatus: parsed.status,
          development: [],
          keyMoments: parsed.keyMoment ? [{
            chapterId: '',
            description: parsed.keyMoment,
            emotionalImpact: 'medium',
            consequences: []
          }] : []
        };
      }
    } catch (error) {
      console.error('Failed to generate relationship:', error);
    }
    
    return null;
  }

  // Parse relationship from AI response
  private parseRelationship(aiResponse: string): any {
    const parsed: any = {};
    
    const lines = aiResponse.split('\n');
    lines.forEach(line => {
      if (line.toLowerCase().includes('type:')) {
        parsed.type = line.split(':')[1]?.trim().toLowerCase() || 'neutral';
      } else if (line.toLowerCase().includes('description:')) {
        parsed.description = line.split(':')[1]?.trim() || '';
      } else if (line.toLowerCase().includes('status:')) {
        parsed.status = line.split(':')[1]?.trim().toLowerCase() || 'neutral';
      } else if (line.toLowerCase().includes('key moment') || line.toLowerCase().includes('moment:')) {
        parsed.keyMoment = line.split(':')[1]?.trim() || '';
      } else if (line.toLowerCase().includes('history:')) {
        parsed.history = line.split(':')[1]?.trim() || '';
      }
    });
    
    return parsed.type ? parsed : null;
  }

  // Generate character development arc
  public async generateDevelopmentArc(
    character: Character,
    chapters: any[]
  ): Promise<CharacterDevelopment[]> {
    const developments: CharacterDevelopment[] = [];
    
    // Generate development for each chapter
    for (let i = 0; i < chapters.length; i++) {
      const chapter = chapters[i];
      const previousDevelopment = i > 0 ? developments[i - 1] : null;
      
      const development = await this.generateChapterDevelopment(
        character,
        chapter,
        previousDevelopment,
        i
      );
      
      if (development) {
        developments.push(development);
      }
    }
    
    character.development = developments;
    return developments;
  }

  // Generate development for specific chapter
  private async generateChapterDevelopment(
    character: Character,
    chapter: any,
    previousDevelopment: CharacterDevelopment | null,
    chapterIndex: number
  ): Promise<CharacterDevelopment | null> {
    try {
      const previousGrowth = previousDevelopment?.growth || 0;
      const prompt = `
Character: ${character.name}
Current Growth Level: ${previousGrowth}/100
Role: ${character.role}
Personality: ${character.basicInfo.personality.join(', ')}

Chapter ${chapterIndex + 1}: ${chapter.title}
Chapter Content: ${chapter.content || chapter.summary || 'Chapter content'}

Determine how this character develops in this chapter:
1. What changes occur (personality, beliefs, skills, relationships, worldview)?
2. Growth level (-100 to 100, where positive is growth)
3. Significance (minor, moderate, major, transformative)
4. Brief description of the development
5. What triggers this development?

Consider the character's current state and the chapter events. Development should be gradual and believable.
      `.trim();
      
      const result = await this.ultimateAI.generateContent(
        {
          id: `development-${character.id}-${chapter.id}`,
          title: `Development: ${character.name} - ${chapter.title}`,
          type: 'character',
          content: '',
          summary: '',
          children: []
        },
        AIActionType.WRITE_CONTINUE,
        prompt
      );

      const parsed = this.parseDevelopment(result.text);
      
      if (parsed) {
        return {
          chapterId: chapter.id,
          chapterTitle: chapter.title,
          changes: parsed.changes || [],
          growth: parsed.growth || 0,
          significance: parsed.significance || 'minor',
          description: parsed.description || '',
          triggers: parsed.triggers || []
        };
      }
    } catch (error) {
      console.error('Failed to generate chapter development:', error);
    }
    
    return null;
  }

  // Parse development from AI response
  private parseDevelopment(aiResponse: string): any {
    const parsed: any = {};
    
    const sections = aiResponse.split(/\n\n+/);
    sections.forEach(section => {
      if (section.toLowerCase().includes('growth:') || section.toLowerCase().includes('level:')) {
        const match = section.match(/-?\d+/);
        parsed.growth = match ? parseInt(match[0]) : 0;
      } else if (section.toLowerCase().includes('significance:')) {
        parsed.significance = section.toLowerCase().includes('major') ? 'major' :
                             section.toLowerCase().includes('transformative') ? 'transformative' :
                             section.toLowerCase().includes('moderate') ? 'moderate' : 'minor';
      } else if (section.toLowerCase().includes('description:')) {
        parsed.description = section.split(':')[1]?.trim() || '';
      } else if (section.toLowerCase().includes('triggers:')) {
        const triggers = section.split(':')[1]?.trim() || '';
        parsed.triggers = triggers.split(',').map(t => t.trim());
      } else if (section.toLowerCase().includes('changes:')) {
        const changes = section.split(':')[1]?.trim() || '';
        parsed.changes = changes.split('\n').map(change => {
          const parts = change.split('-');
          return {
            aspect: parts[0]?.trim() || 'personality',
            before: parts[1]?.trim() || '',
            after: parts[2]?.trim() || '',
            reason: parts[3]?.trim() || '',
            permanence: 'permanent'
          };
        });
      }
    });
    
    return parsed.description ? parsed : null;
  }

  // Analyze character profile
  public analyzeCharacter(character: Character): CharacterProfile {
    const analysis = {
      complexity: this.calculateComplexity(character),
      consistency: this.calculateConsistency(character),
      growth: this.calculateGrowth(character),
      relatability: this.calculateRelatability(character),
      uniqueness: this.calculateUniqueness(character)
    };

    const suggestions = {
      improvements: this.generateImprovementSuggestions(character),
      plotOpportunities: this.generatePlotOpportunities(character),
      relationshipIdeas: this.generateRelationshipIdeas(character),
      conflictSources: this.generateConflictSources(character)
    };

    return {
      character,
      analysis,
      suggestions
    };
  }

  // Calculate character complexity
  private calculateComplexity(character: Character): 'simple' | 'moderate' | 'complex' {
    let complexityScore = 0;
    
    // Personality diversity
    complexityScore += character.basicInfo.personality.length * 5;
    
    // Psychological depth
    complexityScore += character.psychology.motivations.length * 10;
    complexityScore += character.psychology.fears.length * 8;
    complexityScore += character.psychology.desires.length * 8;
    complexityScore += character.psychology.flaws.length * 10;
    complexityScore += character.psychology.strengths.length * 5;
    
    // Relationship complexity
    complexityScore += character.relationships.length * 3;
    
    // Development arc complexity
    complexityScore += character.development.length * 2;
    
    if (complexityScore < 50) return 'simple';
    if (complexityScore < 100) return 'moderate';
    return 'complex';
  }

  // Calculate character consistency
  private calculateConsistency(character: Character): number {
    // Simple consistency check based on development patterns
    if (character.development.length === 0) return 100;
    
    let consistencyScore = 100;
    let lastGrowth = 0;
    
    character.development.forEach(dev => {
      const growthChange = Math.abs(dev.growth - lastGrowth);
      if (growthChange > 50) {
        consistencyScore -= 10; // Sudden changes reduce consistency
      }
      lastGrowth = dev.growth;
    });
    
    return Math.max(0, Math.min(100, consistencyScore));
  }

  // Calculate character growth
  private calculateGrowth(character: Character): number {
    if (character.development.length === 0) return 0;
    
    const totalGrowth = character.development.reduce((sum, dev) => sum + dev.growth, 0);
    return Math.max(0, Math.min(100, totalGrowth / character.development.length));
  }

  // Calculate character relatability
  private calculateRelatability(character: Character): number {
    let relatabilityScore = 50; // Base score
    
    // Relatable flaws
    const relatableFlaws = ['self-doubt', 'fear of failure', 'social anxiety', 'impatience'];
    const hasRelatableFlaws = character.psychology.flaws.some(flaw => 
      relatableFlaws.some(relatable => flaw.toLowerCase().includes(relatable))
    );
    if (hasRelatableFlaws) relatabilityScore += 20;
    
    // Universal motivations
    const universalMotivations = ['love', 'acceptance', 'security', 'purpose'];
    const hasUniversalMotivations = character.psychology.motivations.some(motivation =>
      universalMotivations.some(universal => motivation.toLowerCase().includes(universal))
    );
    if (hasUniversalMotivations) relatabilityScore += 20;
    
    // Balanced personality
    if (character.basicInfo.personality.length >= 3 && character.basicInfo.personality.length <= 7) {
      relatabilityScore += 10;
    }
    
    return Math.max(0, Math.min(100, relatabilityScore));
  }

  // Calculate character uniqueness
  private calculateUniqueness(character: Character): number {
    let uniquenessScore = 50; // Base score
    
    // Unique combination of traits
    if (character.basicInfo.personality.length > 5) uniquenessScore += 15;
    
    // Complex backstory
    if (character.story.backstory.length > 200) uniquenessScore += 15;
    
    // Distinctive appearance
    if (character.physical.distinguishingFeatures.length > 0) uniquenessScore += 10;
    
    // Unique voice
    if (character.voice.catchphrases.length > 0 || character.voice.accent) uniquenessScore += 10;
    
    return Math.max(0, Math.min(100, uniquenessScore));
  }

  // Generate improvement suggestions
  private generateImprovementSuggestions(character: Character): string[] {
    const suggestions: string[] = [];
    
    if (character.psychology.motivations.length < 2) {
      suggestions.push('Add more motivations to create deeper character drive');
    }
    
    if (character.psychology.flaws.length < 2) {
      suggestions.push('Include more flaws to make character more realistic');
    }
    
    if (character.relationships.length < 2) {
      suggestions.push('Develop more relationships to show character in different contexts');
    }
    
    if (character.development.length < 3) {
      suggestions.push('Plan more character development moments throughout the story');
    }
    
    if (!character.voice.catchphrases || character.voice.catchphrases.length === 0) {
      suggestions.push('Add distinctive speech patterns or catchphrases');
    }
    
    return suggestions;
  }

  // Generate plot opportunities
  private generatePlotOpportunities(character: Character): string[] {
    const opportunities: string[] = [];
    
    // Based on fears
    character.psychology.fears.forEach(fear => {
      opportunities.push(`Create a situation where ${character.name} must confront ${fear}`);
    });
    
    // Based on flaws
    character.psychology.flaws.forEach(flaw => {
      opportunities.push(`Develop a plot point where ${flaw} creates complications`);
    });
    
    // Based on desires
    character.psychology.desires.forEach(desire => {
      opportunities.push(`Build a subplot around the pursuit of ${desire}`);
    });
    
    return opportunities.slice(0, 5);
  }

  // Generate relationship ideas
  private generateRelationshipIdeas(character: Character): string[] {
    const ideas: string[] = [];
    
    if (character.role === 'protagonist') {
      ideas.push('Introduce a mentor character to guide development');
      ideas.push('Create a rival character to challenge growth');
      ideas.push('Add a romantic interest to explore vulnerability');
    }
    
    if (character.role === 'antagonist') {
      ideas.push('Develop a complex backstory that explains motivations');
      ideas.push('Create a personal connection to protagonist');
      ideas.push('Add moments of doubt or redemption');
    }
    
    return ideas;
  }

  // Generate conflict sources
  private generateConflictSources(character: Character): string[] {
    const conflicts: string[] = [];
    
    // Internal conflicts
    character.psychology.fears.forEach(fear => {
      conflicts.push(`Internal struggle with ${fear}`);
    });
    
    character.psychology.flaws.forEach(flaw => {
      conflicts.push(`Conflict caused by ${flaw}`);
    });
    
    // External conflicts
    character.relationships.forEach(rel => {
      if (rel.type === 'enemy' || rel.type === 'rival') {
        conflicts.push(`Conflict with ${rel.targetCharacterName}`);
      }
    });
    
    return conflicts.slice(0, 5);
  }

  // Get available templates
  public getAvailableTemplates(): CharacterTemplate[] {
    return Array.from(this.templates.values());
  }

  // Export character
  public exportCharacter(character: Character): string {
    return JSON.stringify(character, null, 2);
  }

  // Import character
  public importCharacter(jsonString: string): Character {
    try {
      return JSON.parse(jsonString) as Character;
    } catch (error) {
      throw new Error('Invalid character JSON format');
    }
  }

  // Update character
  public updateCharacter(character: Character, updates: Partial<Character>): Character {
    const updated = {
      ...character,
      ...updates,
      metadata: {
        ...character.metadata,
        lastUpdated: new Date(),
        version: character.metadata.version + 1
      }
    };
    
    return updated;
  }
}

export default CharacterDevelopmentService;
export type { 
  Character, 
  CharacterRelationship, 
  CharacterDevelopment, 
  CharacterTemplate, 
  CharacterProfile 
};
