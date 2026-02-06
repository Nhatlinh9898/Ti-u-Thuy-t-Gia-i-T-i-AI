import { NovelNode, AIActionType } from "../types";
import UltimateAIService from "./ultimateAIService";
import CharacterDevelopmentService from "./characterDevelopmentService";

// Interactive Story Engine - Engine truyện tương tác
// Tạo trải nghiệm truyện tương tác với branching và dynamic content

interface StoryWorld {
  id: string;
  name: string;
  description: string;
  genre: string;
  setting: StorySetting;
  characters: StoryCharacter[];
  plotPoints: PlotPoint[];
  rules: WorldRules;
  metadata: WorldMetadata;
}

interface StorySetting {
  timePeriod: string;
  location: string;
  atmosphere: string;
  physics: PhysicsRules;
  magicSystem?: MagicSystem;
  technology?: TechnologyLevel;
}

interface StoryCharacter {
  id: string;
  name: string;
  role: 'protagonist' | 'antagonist' | 'supporting' | 'npc';
  personality: CharacterPersonality;
  abilities: CharacterAbility[];
  relationships: CharacterRelationship[];
  currentState: CharacterState;
  aiProfile: CharacterAIProfile;
}

interface StoryBranch {
  id: string;
  title: string;
  description: string;
  content: string;
  choices: StoryChoice[];
  consequences: BranchConsequence[];
  requirements: BranchRequirement[];
  metadata: BranchMetadata;
}

interface StoryChoice {
  id: string;
  text: string;
  description: string;
  requirements: ChoiceRequirement[];
  consequences: ChoiceConsequence[];
  nextBranch: string;
  emotionalImpact: EmotionalImpact;
  characterDevelopment: CharacterDevelopment;
}

interface InteractiveScene {
  id: string;
  title: string;
  description: string;
  setting: SceneSetting;
  characters: string[];
  dialogue: DialogueLine[];
  actions: SceneAction[];
  environment: EnvironmentState;
  transitions: SceneTransition[];
}

interface UserChoice {
  choiceId: string;
  branchId: string;
  timestamp: Date;
  userContext: UserContext;
  emotionalState: EmotionalState;
  characterInfluence: CharacterInfluence;
}

interface StoryContext {
  currentBranch: string;
  visitedBranches: string[];
  characterStates: Map<string, CharacterState>;
  worldState: WorldState;
  userHistory: UserChoice[];
  currentEmotion: EmotionalState;
  availableChoices: StoryChoice[];
}

class InteractiveStoryEngine {
  private ultimateAI: UltimateAIService;
  private characterService: CharacterDevelopmentService;
  private storyWorlds: Map<string, StoryWorld> = new Map();
  private activeStory: StoryWorld | null = null;
  private currentContext: StoryContext | null = null;
  private userSessions: Map<string, UserSession> = new Map();

  constructor() {
    this.ultimateAI = new UltimateAIService();
    this.characterService = new CharacterDevelopmentService();
  }

  // Create story world
  public async createStoryWorld(worldConfig: Partial<StoryWorld>): Promise<StoryWorld> {
    try {
      // Generate world using AI
      const worldGeneration = await this.generateWorldWithAI(worldConfig);
      
      const storyWorld: StoryWorld = {
        id: worldConfig.id || `world-${Date.now()}`,
        name: worldConfig.name || 'Untitled World',
        description: worldConfig.description || '',
        genre: worldConfig.genre || 'fantasy',
        setting: worldGeneration.setting,
        characters: worldGeneration.characters,
        plotPoints: worldGeneration.plotPoints,
        rules: worldGeneration.rules,
        metadata: {
          createdAt: new Date(),
          lastModified: new Date(),
          version: '1.0',
          author: 'AI Generated',
          complexity: worldGeneration.complexity,
          estimatedPlaytime: worldGeneration.estimatedPlaytime
        }
      };

      this.storyWorlds.set(storyWorld.id, storyWorld);
      return storyWorld;

    } catch (error) {
      console.error('Failed to create story world:', error);
      throw error;
    }
  }

  // Add character to world
  public async addCharacter(worldId: string, characterData: Partial<StoryCharacter>): Promise<StoryCharacter> {
    const world = this.storyWorlds.get(worldId);
    if (!world) {
      throw new Error('Story world not found');
    }

    try {
      // Generate character AI profile
      const aiProfile = await this.generateCharacterAIProfile(characterData);
      
      const character: StoryCharacter = {
        id: characterData.id || `char-${Date.now()}`,
        name: characterData.name || 'Unnamed Character',
        role: characterData.role || 'supporting',
        personality: characterData.personality || await this.generatePersonality(),
        abilities: characterData.abilities || [],
        relationships: characterData.relationships || [],
        currentState: {
          health: 100,
          mood: 'neutral',
          location: world.setting.location,
          inventory: [],
          status: []
        },
        aiProfile
      };

      world.characters.push(character);
      return character;

    } catch (error) {
      console.error('Failed to add character:', error);
      throw error;
    }
  }

  // Create interactive scene
  public async createScene(worldId: string, sceneConfig: Partial<InteractiveScene>): Promise<InteractiveScene> {
    const world = this.storyWorlds.get(worldId);
    if (!world) {
      throw new Error('Story world not found');
    }

    try {
      // Generate scene content
      const sceneGeneration = await this.generateSceneWithAI(sceneConfig, world);
      
      const scene: InteractiveScene = {
        id: sceneConfig.id || `scene-${Date.now()}`,
        title: sceneConfig.title || 'Untitled Scene',
        description: sceneConfig.description || '',
        setting: sceneGeneration.setting,
        characters: sceneConfig.characters || [],
        dialogue: sceneGeneration.dialogue,
        actions: sceneGeneration.actions,
        environment: sceneGeneration.environment,
        transitions: sceneGeneration.transitions
      };

      return scene;

    } catch (error) {
      console.error('Failed to create scene:', error);
      throw error;
    }
  }

  // Handle user choice
  public async handleUserChoice(choice: UserChoice): Promise<StoryBranch> {
    try {
      // Process choice consequences
      const consequences = await this.processChoiceConsequences(choice);
      
      // Update character states
      await this.updateCharacterStates(choice);
      
      // Generate next branch
      const nextBranch = await this.generateNextBranch(choice);
      
      // Update story context
      this.updateStoryContext(choice, nextBranch);
      
      return nextBranch;

    } catch (error) {
      console.error('Failed to handle user choice:', error);
      throw error;
    }
  }

  // Generate dynamic content
  public async generateDynamicContent(context: StoryContext): Promise<GeneratedContent> {
    try {
      // Analyze current situation
      const situationAnalysis = await this.analyzeCurrentSituation(context);
      
      // Generate content based on context
      const contentGeneration = await this.generateContentWithAI(situationAnalysis);
      
      // Adapt to user emotional state
      const adaptedContent = await this.adaptContentToEmotion(contentGeneration, context.currentEmotion);
      
      return {
        content: adaptedContent.text,
        choices: adaptedContent.choices,
        sceneDescription: adaptedContent.scene,
        characterReactions: adaptedContent.reactions,
        environmentalEffects: adaptedContent.effects,
        metadata: {
          generatedAt: new Date(),
          context: situationAnalysis,
          adaptationLevel: adaptedContent.adaptationLevel,
          aiConfidence: contentGeneration.confidence
        }
      };

    } catch (error) {
      console.error('Failed to generate dynamic content:', error);
      throw error;
    }
  }

  // Start interactive session
  public async startInteractiveSession(worldId: string, userId: string): Promise<UserSession> {
    const world = this.storyWorlds.get(worldId);
    if (!world) {
      throw new Error('Story world not found');
    }

    try {
      // Create user session
      const session: UserSession = {
        id: `session-${Date.now()}`,
        userId,
        worldId,
        startTime: new Date(),
        currentBranch: world.plotPoints[0]?.id || '',
        characterStates: new Map(),
        worldState: {
          currentLocation: world.setting.location,
          timeOfDay: 'morning',
          weather: 'clear',
          globalEvents: []
        },
        userHistory: [],
        currentEmotion: 'neutral',
        achievements: [],
        progress: {
          branchesExplored: 0,
          totalBranches: world.plotPoints.length,
          completionPercentage: 0
        }
      };

      // Initialize character states
      world.characters.forEach(character => {
        session.characterStates.set(character.id, character.currentState);
      });

      this.userSessions.set(session.id, session);
      this.activeStory = world;
      this.currentContext = {
        currentBranch: session.currentBranch,
        visitedBranches: [],
        characterStates: session.characterStates,
        worldState: session.worldState,
        userHistory: [],
        currentEmotion: session.currentEmotion,
        availableChoices: []
      };

      return session;

    } catch (error) {
      console.error('Failed to start interactive session:', error);
      throw error;
    }
  }

  // Helper methods
  private async generateWorldWithAI(config: Partial<StoryWorld>): Promise<any> {
    const prompt = `
Generate a detailed story world based on this configuration:

World Configuration:
- Name: ${config.name || 'Untitled World'}
- Genre: ${config.genre || 'fantasy'}
- Description: ${config.description || ''}

Please provide:
1. Detailed setting (time period, location, atmosphere)
2. 5-10 diverse characters with personalities
3. Main plot points and story arcs
4. World rules and physics
5. Complexity and estimated playtime

Make it interactive and engaging with multiple story branches.
    `.trim();

    const result = await this.ultimateAI.generateContent(
      {
        id: 'world-generation',
        title: 'Story World Generation',
        type: 'world',
        content: '',
        summary: '',
        children: []
      },
      AIActionType.WRITE_CONTINUE,
      prompt
    );

    return this.parseWorldGeneration(result.text);
  }

  private async generateCharacterAIProfile(characterData: Partial<StoryCharacter>): Promise<CharacterAIProfile> {
    const prompt = `
Create an AI profile for this character:

Character Data:
- Name: ${characterData.name}
- Role: ${characterData.role}
- Personality: ${JSON.stringify(characterData.personality)}

Generate AI profile including:
1. Dialogue patterns and speech style
2. Decision-making logic
3. Emotional response patterns
4. Relationship behaviors
5. Character development arcs

Make the character feel alive and responsive.
    `.trim();

    const result = await this.ultimateAI.generateContent(
      {
        id: 'character-ai-profile',
        title: 'Character AI Profile',
        type: 'character',
        content: '',
        summary: '',
        children: []
      },
      AIActionType.WRITE_CONTINUE,
      prompt
    );

    return this.parseCharacterAIProfile(result.text);
  }

  private async generateSceneWithAI(sceneConfig: Partial<InteractiveScene>, world: StoryWorld): Promise<any> {
    const prompt = `
Generate an interactive scene for this story world:

Scene Configuration:
- Title: ${sceneConfig.title}
- Description: ${sceneConfig.description}
- Characters: ${sceneConfig.characters?.join(', ') || 'Available characters'}
- World: ${world.name} (${world.genre})

World Context:
- Setting: ${world.setting.location}
- Characters: ${world.characters.map(c => c.name).join(', ')}

Generate:
1. Detailed scene description
2. Character dialogue and interactions
3. Available actions for the player
4. Environmental details and atmosphere
5. Possible transitions to other scenes

Make it interactive and engaging with meaningful choices.
    `.trim();

    const result = await this.ultimateAI.generateContent(
      {
        id: 'scene-generation',
        title: 'Scene Generation',
        type: 'scene',
        content: '',
        summary: '',
        children: []
      },
      AIActionType.WRITE_CONTINUE,
      prompt
    );

    return this.parseSceneGeneration(result.text);
  }

  private async processChoiceConsequences(choice: UserChoice): Promise<ConsequenceResult> {
    // Simulate consequence processing
    return {
      immediateEffects: [],
      delayedEffects: [],
      characterChanges: [],
      worldChanges: [],
      emotionalImpact: choice.emotionalImpact,
      narrativeProgress: 0.1
    };
  }

  private async updateCharacterStates(choice: UserChoice): Promise<void> {
    // Update character states based on choice
    if (this.currentContext) {
      choice.characterInfluence.affectedCharacters.forEach(charId => {
        const currentState = this.currentContext.characterStates.get(charId);
        if (currentState) {
          // Apply character state changes
          this.currentContext.characterStates.set(charId, currentState);
        }
      });
    }
  }

  private async generateNextBranch(choice: UserChoice): Promise<StoryBranch> {
    const prompt = `
Generate the next story branch based on this user choice:

Choice Details:
- Choice ID: ${choice.choiceId}
- Branch: ${choice.branchId}
- User Context: ${JSON.stringify(choice.userContext)}
- Emotional State: ${choice.emotionalState}

Current Story Context:
${JSON.stringify(this.currentContext)}

Generate:
1. Branch title and description
2. Branch content (500-800 words)
3. 3-5 meaningful choices for the user
4. Consequences for each choice
5. Character reactions and development

Make it engaging and emotionally resonant.
    `.trim();

    const result = await this.ultimateAI.generateContent(
      {
        id: 'branch-generation',
        title: 'Story Branch Generation',
        type: 'branch',
        content: '',
        summary: '',
        children: []
      },
      AIActionType.WRITE_CONTINUE,
      prompt
    );

    return this.parseBranchGeneration(result.text);
  }

  private updateStoryContext(choice: UserChoice, branch: StoryBranch): void {
    if (this.currentContext) {
      this.currentContext.currentBranch = branch.id;
      this.currentContext.visitedBranches.push(branch.id);
      this.currentContext.userHistory.push(choice);
      this.currentContext.availableChoices = branch.choices;
      this.currentContext.currentEmotion = choice.emotionalState;
    }
  }

  private async generatePersonality(): Promise<CharacterPersonality> {
    return {
      traits: ['brave', 'curious', 'compassionate'],
      values: ['justice', 'freedom', 'knowledge'],
      fears: ['failure', 'loneliness'],
      goals: ['save the world', 'discover truth'],
      motivations: ['protect others', 'seek adventure'],
      emotionalRange: ['joy', 'anger', 'fear', 'hope'],
      socialStyle: 'friendly',
      decisionStyle: 'analytical'
    };
  }

  private async analyzeCurrentSituation(context: StoryContext): Promise<SituationAnalysis> {
    return {
      location: context.worldState.currentLocation,
      timeOfDay: context.worldState.timeOfDay,
      weather: context.worldState.weather,
      presentCharacters: Array.from(context.characterStates.keys()),
      emotionalTone: context.currentEmotion,
      narrativeTension: this.calculateNarrativeTension(context),
      userProgress: context.userHistory.length,
      availableActions: this.determineAvailableActions(context)
    };
  }

  private async generateContentWithAI(situation: SituationAnalysis): Promise<any> {
    const prompt = `
Generate dynamic content based on this situation analysis:

Situation:
- Location: ${situation.location}
- Time: ${situation.timeOfDay}
- Weather: ${situation.weather}
- Characters: ${situation.presentCharacters.join(', ')}
- Emotional Tone: ${situation.emotionalTone}
- Narrative Tension: ${situation.narrativeTension}

Generate:
1. Scene description (200-300 words)
2. Character dialogue and interactions
3. 3-5 user choices
4. Environmental details
5. Character reactions

Make it immersive and responsive to the situation.
    `.trim();

    const result = await this.ultimateAI.generateContent(
      {
        id: 'dynamic-content',
        title: 'Dynamic Content Generation',
        type: 'content',
        content: '',
        summary: '',
        children: []
      },
      AIActionType.WRITE_CONTINUE,
      prompt
    );

    return this.parseContentGeneration(result.text);
  }

  private async adaptContentToEmotion(content: any, emotion: EmotionalState): Promise<AdaptedContent> {
    return {
      text: content.text,
      choices: content.choices,
      scene: content.scene,
      reactions: content.reactions,
      effects: content.effects,
      adaptationLevel: 0.8,
      adaptedFor: emotion
    };
  }

  private calculateNarrativeTension(context: StoryContext): number {
    // Calculate tension based on various factors
    const baseTension = 0.5;
    const historyWeight = Math.min(context.userHistory.length / 10, 1);
    const emotionalWeight = context.currentEmotion === 'fear' ? 0.3 : 0;
    
    return Math.min(baseTension + historyWeight + emotionalWeight, 1);
  }

  private determineAvailableActions(context: StoryContext): string[] {
    return ['explore', 'talk', 'use_item', 'wait', 'hide'];
  }

  // Parsing methods
  private parseWorldGeneration(aiResponse: string): any {
    // Simple parsing - in production, use more sophisticated parsing
    return {
      setting: {
        timePeriod: 'medieval',
        location: 'fantasy kingdom',
        atmosphere: 'magical',
        physics: { gravity: 'normal', magic: 'present' }
      },
      characters: [],
      plotPoints: [],
      rules: { death: 'permanent', choices: 'matter' },
      complexity: 'medium',
      estimatedPlaytime: '2-4 hours'
    };
  }

  private parseCharacterAIProfile(aiResponse: string): CharacterAIProfile {
    return {
      dialogueStyle: 'friendly',
      decisionLogic: 'analytical',
      emotionalResponses: 'empathetic',
      relationshipBehaviors: 'loyal',
      developmentArcs: ['growth', 'redemption']
    };
  }

  private parseSceneGeneration(aiResponse: string): any {
    return {
      setting: {
        location: 'forest clearing',
        timeOfDay: 'afternoon',
        weather: 'sunny'
      },
      dialogue: [],
      actions: ['investigate', 'talk', 'rest'],
      environment: {
        visibility: 'good',
        noise: 'birds chirping',
        objects: ['ancient tree', 'mysterious stone']
      },
      transitions: []
    };
  }

  private parseBranchGeneration(aiResponse: string): StoryBranch {
    return {
      id: `branch-${Date.now()}`,
      title: 'The Path Forward',
      description: 'Your journey continues...',
      content: aiResponse,
      choices: [],
      consequences: [],
      requirements: [],
      metadata: {
        createdAt: new Date(),
        difficulty: 'medium',
        emotionalImpact: 'neutral',
        wordCount: aiResponse.length
      }
    };
  }

  private parseContentGeneration(aiResponse: string): any {
    return {
      text: aiResponse,
      choices: [],
      scene: 'detailed scene description',
      reactions: [],
      effects: [],
      confidence: 0.85
    };
  }

  // Getters and setters
  public getStoryWorld(worldId: string): StoryWorld | null {
    return this.storyWorlds.get(worldId) || null;
  }

  public getCurrentContext(): StoryContext | null {
    return this.currentContext;
  }

  public getUserSession(sessionId: string): UserSession | null {
    return this.userSessions.get(sessionId) || null;
  }

  public getAllStoryWorlds(): StoryWorld[] {
    return Array.from(this.storyWorlds.values());
  }
}

// Additional interfaces
interface CharacterPersonality {
  traits: string[];
  values: string[];
  fears: string[];
  goals: string[];
  motivations: string[];
  emotionalRange: string[];
  socialStyle: string;
  decisionStyle: string;
}

interface CharacterAbility {
  id: string;
  name: string;
  description: string;
  type: 'combat' | 'social' | 'magical' | 'technical';
  power: number;
  cooldown: number;
}

interface CharacterRelationship {
  characterId: string;
  type: 'friend' | 'enemy' | 'family' | 'romantic' | 'professional';
  strength: number;
  history: string;
}

interface CharacterState {
  health: number;
  mood: string;
  location: string;
  inventory: string[];
  status: string[];
}

interface CharacterAIProfile {
  dialogueStyle: string;
  decisionLogic: string;
  emotionalResponses: string;
  relationshipBehaviors: string;
  developmentArcs: string[];
}

interface WorldRules {
  death: 'permanent' | 'temporary';
  choices: 'matter' | 'cosmetic';
  time: 'linear' | 'circular';
  physics: PhysicsRules;
}

interface PhysicsRules {
  gravity: 'normal' | 'low' | 'high';
  magic: 'present' | 'absent' | 'limited';
  technology: 'primitive' | 'advanced' | 'futuristic';
}

interface MagicSystem {
  type: 'elemental' | 'arcane' | 'divine' | 'technological';
  rules: string[];
  limitations: string[];
  source: string;
}

interface TechnologyLevel {
  era: string;
  available: string[];
  restrictions: string[];
  impact: string;
}

interface WorldMetadata {
  createdAt: Date;
  lastModified: Date;
  version: string;
  author: string;
  complexity: string;
  estimatedPlaytime: string;
}

interface PlotPoint {
  id: string;
  title: string;
  description: string;
  type: 'main' | 'side' | 'hidden';
  requirements: string[];
  rewards: string[];
  consequences: string[];
}

interface BranchRequirement {
  type: 'character' | 'item' | 'skill' | 'location';
  value: string;
  operator: 'has' | 'equals' | 'greater_than';
}

interface BranchConsequence {
  type: 'character_change' | 'world_change' | 'item_gain' | 'story_progress';
  target: string;
  value: any;
  permanent: boolean;
}

interface BranchMetadata {
  createdAt: Date;
  difficulty: 'easy' | 'medium' | 'hard';
  emotionalImpact: string;
  wordCount: number;
}

interface ChoiceRequirement {
  type: 'skill' | 'item' | 'stat' | 'relationship';
  value: string;
  threshold: number;
}

interface ChoiceConsequence {
  type: 'immediate' | 'delayed';
  effect: string;
  target: string;
  value: any;
}

interface EmotionalImpact {
  primary: string;
  secondary: string[];
  intensity: number;
  duration: 'temporary' | 'permanent';
}

interface CharacterDevelopment {
  character: string;
  aspect: 'skill' | 'personality' | 'relationship';
  change: string;
  value: any;
}

interface SceneSetting {
  location: string;
  timeOfDay: string;
  weather: string;
  visibility: string;
  objects: string[];
}

interface SceneAction {
  id: string;
  name: string;
  description: string;
  requirements: string[];
  consequences: string[];
}

interface EnvironmentState {
  lighting: string;
  noise: string;
  temperature: string;
  specialEffects: string[];
}

interface SceneTransition {
  toScene: string;
  condition: string;
  description: string;
  type: 'automatic' | 'conditional';
}

interface UserContext {
  sessionId: string;
  userId: string;
  device: string;
  preferences: any;
  history: UserChoice[];
}

interface CharacterInfluence {
  affectedCharacters: string[];
  influenceType: string;
  strength: number;
  duration: number;
}

interface EmotionalState {
  primary: string;
  intensity: number;
  triggers: string[];
  duration: number;
}

interface WorldState {
  currentLocation: string;
  timeOfDay: string;
  weather: string;
  globalEvents: string[];
}

interface UserSession {
  id: string;
  userId: string;
  worldId: string;
  startTime: Date;
  currentBranch: string;
  characterStates: Map<string, CharacterState>;
  worldState: WorldState;
  userHistory: UserChoice[];
  currentEmotion: EmotionalState;
  achievements: Achievement[];
  progress: SessionProgress;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  unlockedAt: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface SessionProgress {
  branchesExplored: number;
  totalBranches: number;
  completionPercentage: number;
}

interface GeneratedContent {
  content: string;
  choices: StoryChoice[];
  sceneDescription: string;
  characterReactions: any[];
  environmentalEffects: any[];
  metadata: {
    generatedAt: Date;
    context: SituationAnalysis;
    adaptationLevel: number;
    aiConfidence: number;
  };
}

interface SituationAnalysis {
  location: string;
  timeOfDay: string;
  weather: string;
  presentCharacters: string[];
  emotionalTone: string;
  narrativeTension: number;
  userProgress: number;
  availableActions: string[];
}

interface ConsequenceResult {
  immediateEffects: any[];
  delayedEffects: any[];
  characterChanges: any[];
  worldChanges: any[];
  emotionalImpact: EmotionalImpact;
  narrativeProgress: number;
}

interface AdaptedContent {
  text: string;
  choices: StoryChoice[];
  scene: string;
  reactions: any[];
  effects: any[];
  adaptationLevel: number;
  adaptedFor: EmotionalState;
}

export default InteractiveStoryEngine;
export type {
  StoryWorld,
  StoryCharacter,
  StoryBranch,
  StoryChoice,
  InteractiveScene,
  UserChoice,
  StoryContext,
  UserSession,
  CharacterPersonality,
  CharacterAIProfile,
  GeneratedContent
};
