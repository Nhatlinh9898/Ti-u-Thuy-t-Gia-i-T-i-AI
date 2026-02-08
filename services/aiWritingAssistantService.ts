import { NovelNode } from "../types";

// AI Writing Assistant Service - Tạo dàn ý thông minh và hỗ trợ viết lách

interface WritingAssistantConfig {
  outlineGeneration: {
    enabled: boolean;
    style: 'creative' | 'professional' | 'academic';
    depth: number;
    includeCharacters: boolean;
    includePlotStructure: boolean;
  };
  
  characterDevelopment: {
    enabled: boolean;
    autoConsistency: boolean;
    personalityProfiles: boolean;
    relationshipTracking: boolean;
  };
  
  styleAnalysis: {
    enabled: boolean;
    learningMode: 'passive' | 'active';
    adaptationSpeed: number;
  };
  
  collaboration: {
    enabled: boolean;
    realTimeEditing: boolean;
    versionControl: boolean;
    conflictResolution: boolean;
  };
}

class AIWritingAssistantService {
  private config: WritingAssistantConfig;

  constructor(config?: Partial<WritingAssistantConfig>) {
    this.config = {
      // Outline Generation
      outlineGeneration: {
        enabled: true,
        style: 'creative',
        depth: 3,
        includeCharacters: true,
        includePlotStructure: true
      },
      
      // Character Development
      characterDevelopment: {
        enabled: false,
        autoConsistency: true,
        personalityProfiles: false,
        relationshipTracking: false
      },
      
      // Style Analysis
      styleAnalysis: {
        enabled: true,
        learningMode: 'active',
        adaptationSpeed: 0.5
      },
      
      // Collaboration
      collaboration: {
        enabled: false,
        realTimeEditing: false,
        versionControl: false,
        conflictResolution: false
      },
      
      ...config
    };
  }

  public async generateOutline(
    node: NovelNode,
    context: string = ''
  ): Promise<{
    outline: string;
    characters: Character[];
    plotStructure: PlotPoint[];
    suggestions: string[];
  }> {
    if (!this.config.outlineGeneration.enabled) {
      throw new Error('Outline generation is disabled');
    }

    try {
      // Generate outline structure
      const outline = await this.generateOutlineStructure(node, context);
      
      // Generate characters if enabled
      let characters: Character[] = [];
      if (this.config.characterDevelopment.enabled) {
        characters = await this.generateCharacters(node, outline);
      }
      
      // Generate plot structure if enabled
      let plotStructure: PlotPoint[] = [];
      if (this.config.outlineGeneration.includePlotStructure) {
        plotStructure = await this.generatePlotStructure(node, outline);
      }
      
      // Generate suggestions
      const suggestions = await this.generateSuggestions(node, outline, characters, plotStructure);
      
      return {
        outline,
        characters,
        plotStructure,
        suggestions
      };
      
    } catch (error) {
      console.error('AI Writing Assistant Error:', error);
      throw error;
    }
  }

  private async generateOutlineStructure(
    node: NovelNode,
    context: string
  ): Promise<string> {
    const nodePath = `${node.type.toUpperCase()}: ${node.title}`;
    const depth = this.config.outlineGeneration.depth;
    const style = this.config.outlineGeneration.style;
    
    let outline = `# ${nodePath}\n\n`;
    
    // Generate sections based on depth
    const sections = await this.generateSections(node, depth, style);
    
    outline += sections.join('\n');
    
    return outline;
  }

  private async generateSections(
    node: NovelNode,
    maxDepth: number,
    style: string
  ): Promise<string[]> {
    const sections: string[] = [];
    
    if (style === 'creative') {
      sections.push(
        `## ${node.type.toUpperCase()}: ${node.title}`,
        `### Mở đầu`,
        `### Phát triển`,
        `### Cao trào`,
        `### Thắt thúc`,
        `### Kết thúc`
      );
    } else if (style === 'professional') {
      sections.push(
        `## ${node.type.toUpperCase()}: ${node.title}`,
        `## Tóm tắt`,
        `## Phân tích`,
        `## Phát triển`,
        `## Kết thúc`
      );
    } else {
      sections.push(
        `## ${node.type.toUpperCase()}: ${node.title}`,
        `## Giới thiệu`,
        `## Luận điểm`,
        `## Phân tích`,
        `## Kết luận`
      );
    }
    
    return sections;
  }

  private async generateCharacters(
    node: NovelNode,
    outline: string
  ): Promise<Character[]> {
    const characters: Character[] = [];
    
    if (!this.config.characterDevelopment.enabled) {
      return characters;
    }

    // Generate main characters
    const mainCharacterCount = Math.min(3, Math.floor(outline.split('\n').length / 10));
    
    for (let i = 0; i < mainCharacterCount; i++) {
      const character = await this.generateCharacter(node, i);
      characters.push(character);
    }
    
    // Generate supporting characters
    const supportingCount = Math.min(2, Math.floor(outline.split('\n').length / 20) - mainCharacterCount);
    
    for (let i = 0; i < supportingCount; i++) {
      const character = await this.generateCharacter(node, i + 100, true);
      characters.push(character);
    }
    
    return characters;
  }

  private async generateCharacter(
    node: NovelNode,
    index: number,
    isSupporting: boolean = false
  ): Promise<Character> {
    const characterType = isSupporting ? 'supporting' : 'main';
    const sectionIndex = Math.floor(index / 5);
    
    // Character template
    const characterTemplate = {
      name: `Nhân vật ${index + 1}`,
      role: characterType === 'main' ? 'chính' : 'phụ',
      personality: this.generatePersonality(node, sectionIndex),
      background: this.generateBackground(node, sectionIndex),
      appearance: this.generateAppearance(node, sectionIndex),
      relationships: this.generateRelationships(node, sectionIndex),
      arc: this.generateCharacterArc(node, sectionIndex)
    };
    
    return characterTemplate;
  }

  private generatePersonality(node: NovelNode, sectionIndex: number): string {
    const personalities = [
      'Lãng mạn, kiên định, trọng nghĩa',
      'Nghiêm túc, thông minh, hài hước',
      'Sáng tạo, bay bổng, mơ mộng',
      'Thực tế, thực dụng, quyết đoán',
      'Nổi nỗi, bi thương, sắc sảo'
    ];
    
    return personalities[sectionIndex % personalities.length];
  }

  private generateBackground(node: NovelNode, sectionIndex: number): string {
    const backgrounds = [
      'Gia đình quý tộc, truyền thống lâu đời',
      'Thành thị hiện đại, đầy áp lực',
      'Nông thôn làng, giản dị',
      'Trường học danh tiếng, tuổi thiếu',
      'Khu ổ nghèo, đông đúc đông người'
    ];
    
    return backgrounds[sectionIndex % backgrounds.length];
  }

  private generateAppearance(node: NovelNode, sectionIndex: number): string {
    const appearances = [
      'Vóc dáng cao ráo rạp, mái tóc đen',
      'Mắt biếc, thân hình cân đối',
      'Trung niên, gương mặt sáng sủa',
      'Cô gái xinh đẹp, nụ cười duyên',
      'Ông lão, râu bạc, nếp nhăn'
    ];
    
    return appearances[sectionIndex % appearances.length];
  }

  private generateRelationships(node: NovelNode, sectionIndex: number): string {
    const relationships = [
      'Cha và con - mối quan hệ gia đình',
      'Bạn bè - tình bạn thân thiết',
      'Thầy và trò - quan hệ thầy trò',
      'Đối thủ - đối tác kinh doanh',
      'Sếp em - tình yêu say mê',
      'Bạn thân - tình bạn bè'
    ];
    
    return relationships[sectionIndex % relationships.length];
  }

  private generateCharacterArc(node: NovelNode, sectionIndex: number): string {
    const arcs = [
      'Sự khẳng phục và trở thành người tốt',
      'Từ một cậu bé nghèo trở thành doanh nhân thành công',
      'Trải qua nhiều khó khăn nhưng không bỏ cuộc',
      'Tình yêu tan vỡ nhưng tìm thấy hạnh phúc mới',
      'Bị phản bội nhưng cuối cùng làm hòa'
    ];
    
    return arcs[sectionIndex % arcs.length];
  }

  private async generatePlotStructure(
    node: NovelNode,
    outline: string
  ): Promise<PlotPoint[]> {
    const plotPoints: PlotPoint[] = [];
    const lines = outline.split('\n');
    
    // Extract plot points from outline
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('###') && line.includes(':')) {
        const title = line.replace('###', '').trim();
        plotPoints.push({ title, point: title, type: 'section' });
      }
    }
    
    return plotPoints;
  }

  private async generateSuggestions(
    node: NovelNode,
    outline: string,
    characters: Character[],
    plotStructure: PlotPoint[]
  ): Promise<string[]> {
    const suggestions: string[] = [];
    
    // Analyze outline and generate suggestions
    suggestions.push('✅ Cấu trúc rõ ràng, dễ theo dõi');
    suggestions.push('✅ Phát triển nhân vật theo từng giai đoạn');
    suggestions.push('✅ Tạo các tình huống kịch tính');
    suggestions.push('✅ Bổ sung các chi tiết và cảm xúc');
    suggestions.push('✅ Đảm thiểu hợp lý và mâu thuẫn');
    
    return suggestions;
  }

  // Configuration methods
  public updateConfig(newConfig: Partial<WritingAssistantConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  public getConfig(): WritingAssistantConfig {
    return this.config;
  }
}

// Types
interface Character {
  name: string;
  role: string;
  personality: string;
  background: string;
  appearance: string;
  relationships: string;
  arc: string;
}

interface PlotPoint {
  title: string;
  point: string;
  type: 'section' | 'plot' | 'character';
}

export default AIWritingAssistantService;
export type { WritingAssistantConfig, Character, PlotPoint };
