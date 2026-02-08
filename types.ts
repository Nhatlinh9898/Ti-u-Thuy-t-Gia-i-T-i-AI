export type NodeType = 'novel' | 'part' | 'chapter' | 'act' | 'section';

export interface NovelNode {
  id: string;
  type: NodeType;
  title: string;
  content: string;
  summary: string;
  children: NovelNode[];
  isExpanded?: boolean;
}

export enum AIActionType {
  WRITE_CONTINUE = 'WRITE_CONTINUE',
  SUMMARIZE = 'SUMMARIZE',
  GENERATE_TITLE = 'GENERATE_TITLE',
  STRUCT_MARKDOWN = 'STRUCT_MARKDOWN',
  END_NODE = 'END_NODE', // Kết thúc mục/chương
  GENERATE_CHOICES = 'GENERATE_CHOICES', // Sinh lựa chọn dẫn chuyện
  STYLE_NARRATIVE = 'STYLE_NARRATIVE', // Dẫn chuyện theo phong cách
  INTRO_METAPHOR = 'INTRO_METAPHOR', // Dẫn nhập ví von
  DIRECT_NARRATOR = 'DIRECT_NARRATOR', // Người kể chuyện trực tiếp
}

export interface GenerationConfig {
  action: AIActionType;
  context?: string; // Additional context prompt
  style?: string; // For style-specific prompts
}
