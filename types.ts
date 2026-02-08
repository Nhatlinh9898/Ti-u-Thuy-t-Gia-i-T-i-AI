export type NodeType = 'novel' | 'part' | 'chapter' | 'act' | 'section' | 'dashboard' | 'insights' | 'character' | 'relationship' | 'music' | 'configuration' | 'world' | 'scene' | 'branch' | 'sound_effect' | 'planning';

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

// Gamification System Types
export interface UserProfile {
  id: string;
  username: string;
  level: number;
  experience: number;
  totalWordsWritten: number;
  achievements: Achievement[];
  badges: Badge[];
  streaks: Streak[];
  stats: UserStats;
  preferences: UserPreferences;
  createdAt: Date;
  lastActive: Date;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  rarity: AchievementRarity;
  points: number;
  requirements: AchievementRequirement[];
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedAt?: Date;
  hidden: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: BadgeCategory;
  unlocked: boolean;
  unlockedAt?: Date;
  displayOrder: number;
}

export interface Streak {
  id: string;
  type: StreakType;
  currentCount: number;
  bestCount: number;
  startDate: Date;
  lastUpdate: Date;
  isActive: boolean;
}

export interface UserStats {
  totalWritingTime: number; // minutes
  averageWordsPerSession: number;
  totalSessions: number;
  favoriteWritingTime: string; // hour of day
  mostProductiveDay: string; // day of week
  chaptersCompleted: number;
  aiAssistanceUsage: number;
  collaborationCount: number;
}

export interface UserPreferences {
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  theme: string;
  language: string;
  autoSave: boolean;
  showAchievements: boolean;
  privacy: PrivacySettings;
}

export interface PrivacySettings {
  shareStats: boolean;
  shareAchievements: boolean;
  publicProfile: boolean;
  showOnlineStatus: boolean;
}

export interface Leaderboard {
  id: string;
  type: LeaderboardType;
  period: LeaderboardPeriod;
  entries: LeaderboardEntry[];
  lastUpdated: Date;
  userRank?: number;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  rank: number;
  score: number;
  badge?: string;
  trend: 'up' | 'down' | 'same';
  change: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: ChallengeType;
  difficulty: ChallengeDifficulty;
  requirements: ChallengeRequirement[];
  rewards: ChallengeReward[];
  startDate: Date;
  endDate: Date;
  participants: number;
  isActive: boolean;
  userProgress?: number;
}

export interface Reward {
  id: string;
  type: RewardType;
  name: string;
  description: string;
  value: number;
  icon: string;
  rarity: RewardRarity;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  icon: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

// Enums
export enum AchievementCategory {
  WRITING = 'writing',
  COLLABORATION = 'collaboration',
  CREATIVITY = 'creativity',
  CONSISTENCY = 'consistency',
  MILESTONES = 'milestones',
  SOCIAL = 'social',
  TECHNICAL = 'technical'
}

export enum AchievementRarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary'
}

export enum BadgeCategory {
  WRITING = 'writing',
  SOCIAL = 'social',
  ACHIEVEMENT = 'achievement',
  SPECIAL = 'special',
  SEASONAL = 'seasonal'
}

export enum StreakType {
  DAILY_WRITING = 'daily_writing',
  WEEKLY_GOALS = 'weekly_goals',
  AI_USAGE = 'ai_usage',
  COLLABORATION = 'collaboration'
}

export enum LeaderboardType {
  WORDS_WRITTEN = 'words_written',
  EXPERIENCE = 'experience',
  ACHIEVEMENTS = 'achievements',
  STREAKS = 'streaks'
}

export enum LeaderboardPeriod {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  ALL_TIME = 'all_time'
}

export enum ChallengeType {
  WORD_COUNT = 'word_count',
  WRITING_STREAK = 'writing_streak',
  CREATIVE_PROMPT = 'creative_prompt',
  COLLABORATION = 'collaboration',
  AI_MASTER = 'ai_master'
}

export enum ChallengeDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  EXPERT = 'expert'
}

export enum RewardType {
  EXPERIENCE = 'experience',
  BADGE = 'badge',
  TITLE = 'title',
  THEME = 'theme',
  FEATURE = 'feature'
}

export enum RewardRarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary'
}

export enum NotificationType {
  ACHIEVEMENT_UNLOCKED = 'achievement_unlocked',
  LEVEL_UP = 'level_up',
  STREAK_MILESTONE = 'streak_milestone',
  CHALLENGE_COMPLETED = 'challenge_completed',
  REWARD_EARNED = 'reward_earned',
  LEADERBOARD_RANK = 'leaderboard_rank',
  FRIEND_ACTIVITY = 'friend_activity',
  SYSTEM = 'system'
}

// Helper interfaces
export interface AchievementRequirement {
  type: string;
  value: number;
  operator: 'eq' | 'gt' | 'gte' | 'lt' | 'lte';
}

export interface ChallengeRequirement {
  type: string;
  description: string;
  target: number;
  current: number;
}

export interface ChallengeReward {
  type: RewardType;
  value: number;
  description: string;
}
