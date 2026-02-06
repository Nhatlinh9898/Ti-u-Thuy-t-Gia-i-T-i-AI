import { 
  UserProfile, 
  Achievement, 
  Badge, 
  Streak, 
  UserStats, 
  Leaderboard, 
  Challenge, 
  Notification,
  AchievementCategory,
  AchievementRarity,
  BadgeCategory,
  StreakType,
  LeaderboardType,
  LeaderboardPeriod,
  ChallengeType,
  ChallengeDifficulty,
  RewardType,
  RewardRarity,
  NotificationType,
  AchievementRequirement,
  ChallengeRequirement,
  ChallengeReward
} from '../types';

class GamificationService {
  private static instance: GamificationService;
  private userProfile: UserProfile | null = null;
  private achievements: Achievement[] = [];
  private badges: Badge[] = [];
  private challenges: Challenge[] = [];
  private leaderboards: Leaderboard[] = [];
  private notifications: Notification[] = [];

  private constructor() {
    this.initializeDefaultData();
    this.loadUserData();
  }

  static getInstance(): GamificationService {
    if (!GamificationService.instance) {
      GamificationService.instance = new GamificationService();
    }
    return GamificationService.instance;
  }

  private initializeDefaultData() {
    this.achievements = this.getDefaultAchievements();
    this.badges = this.getDefaultBadges();
    this.challenges = this.getDefaultChallenges();
    this.leaderboards = this.getDefaultLeaderboards();
  }

  private getDefaultAchievements(): Achievement[] {
    return [
      {
        id: 'first_words',
        title: 'Lời Đầu Tiên',
        description: 'Viết 100 từ đầu tiên',
        icon: '✍️',
        category: AchievementCategory.WRITING,
        rarity: AchievementRarity.COMMON,
        points: 10,
        requirements: [{ type: 'words_written', value: 100, operator: 'gte' }],
        progress: 0,
        maxProgress: 100,
        unlocked: false,
        hidden: false
      },
      {
        id: 'chapter_complete',
        title: 'Hoàn Thành Chương',
        description: 'Hoàn thành chương đầu tiên',
        icon: '📖',
        category: AchievementCategory.MILESTONES,
        rarity: AchievementRarity.UNCOMMON,
        points: 50,
        requirements: [{ type: 'chapters_completed', value: 1, operator: 'gte' }],
        progress: 0,
        maxProgress: 1,
        unlocked: false,
        hidden: false
      },
      {
        id: 'writing_streak_7',
        title: 'Tác Giả Siêu Năng',
        description: 'Viết liên tục trong 7 ngày',
        icon: '🔥',
        category: AchievementCategory.CONSISTENCY,
        rarity: AchievementRarity.RARE,
        points: 100,
        requirements: [{ type: 'daily_writing_streak', value: 7, operator: 'gte' }],
        progress: 0,
        maxProgress: 7,
        unlocked: false,
        hidden: false
      },
      {
        id: 'ai_master',
        title: 'Bậc Thầy AI',
        description: 'Sử dụng AI 100 lần',
        icon: '🤖',
        category: AchievementCategory.TECHNICAL,
        rarity: AchievementRarity.UNCOMMON,
        points: 75,
        requirements: [{ type: 'ai_usage', value: 100, operator: 'gte' }],
        progress: 0,
        maxProgress: 100,
        unlocked: false,
        hidden: false
      },
      {
        id: 'novel_complete',
        title: 'Hoàn Thiện Tiểu Thuyết',
        description: 'Hoàn thành tiểu thuyết đầu tiên',
        icon: '🏆',
        category: AchievementCategory.MILESTONES,
        rarity: AchievementRarity.LEGENDARY,
        points: 500,
        requirements: [{ type: 'novels_completed', value: 1, operator: 'gte' }],
        progress: 0,
        maxProgress: 1,
        unlocked: false,
        hidden: false
      },
      {
        id: 'word_warrior',
        title: 'Chiến Binh Chữ',
        description: 'Viết 50,000 từ',
        icon: '⚔️',
        category: AchievementCategory.WRITING,
        rarity: AchievementRarity.EPIC,
        points: 200,
        requirements: [{ type: 'total_words', value: 50000, operator: 'gte' }],
        progress: 0,
        maxProgress: 50000,
        unlocked: false,
        hidden: false
      },
      {
        id: 'creative_genius',
        title: 'Thiên Sáng Tạo',
        description: 'Sử dụng tất cả các tính năng AI',
        icon: '💡',
        category: AchievementCategory.CREATIVITY,
        rarity: AchievementRarity.RARE,
        points: 150,
        requirements: [{ type: 'all_ai_features', value: 1, operator: 'gte' }],
        progress: 0,
        maxProgress: 1,
        unlocked: false,
        hidden: true
      }
    ];
  }

  private getDefaultBadges(): Badge[] {
    return [
      {
        id: 'novice_writer',
        name: 'Tác Giả Mới',
        description: 'Bắt đầu hành trình viết lách',
        icon: '🌟',
        color: '#10B981',
        category: BadgeCategory.WRITING,
        unlocked: true,
        unlockedAt: new Date(),
        displayOrder: 1
      },
      {
        id: 'daily_writer',
        name: 'Viết Hàng Ngày',
        description: 'Viết liên tục 3 ngày',
        icon: '📅',
        color: '#3B82F6',
        category: BadgeCategory.WRITING,
        unlocked: false,
        displayOrder: 2
      },
      {
        id: 'ai_enthusiast',
        name: 'Yêu AI',
        description: 'Sử dụng AI 50 lần',
        icon: '🤖',
        color: '#8B5CF6',
        category: BadgeCategory.ACHIEVEMENT,
        unlocked: false,
        displayOrder: 3
      },
      {
        id: 'collaborator',
        name: 'Đồng Tác Giả',
        description: 'Tham gia 5 dự án hợp tác',
        icon: '🤝',
        color: '#F59E0B',
        category: BadgeCategory.SOCIAL,
        unlocked: false,
        displayOrder: 4
      }
    ];
  }

  private getDefaultChallenges(): Challenge[] {
    return [
      {
        id: 'daily_500',
        title: 'Thử Thách 500 Từ',
        description: 'Viết 500 từ trong một ngày',
        type: ChallengeType.WORD_COUNT,
        difficulty: ChallengeDifficulty.EASY,
        requirements: [{ type: 'words_today', description: 'Viết 500 từ', target: 500, current: 0 }],
        rewards: [{ type: RewardType.EXPERIENCE, value: 50, description: '50 điểm kinh nghiệm' }],
        startDate: new Date(),
        endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        participants: 0,
        isActive: true
      },
      {
        id: 'week_streak',
        title: 'Tuần Luyện Viết',
        description: 'Viết liên tục 7 ngày',
        type: ChallengeType.WRITING_STREAK,
        difficulty: ChallengeDifficulty.MEDIUM,
        requirements: [{ type: 'daily_streak', description: 'Viết 7 ngày liên tục', target: 7, current: 0 }],
        rewards: [{ type: RewardType.BADGE, value: 1, description: 'Huy hiệu Tuần Luyện' }],
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        participants: 0,
        isActive: true
      },
      {
        id: 'ai_master_challenge',
        title: 'Bậc Thầy AI',
        description: 'Sử dụng AI 20 lần trong 3 ngày',
        type: ChallengeType.AI_MASTER,
        difficulty: ChallengeDifficulty.HARD,
        requirements: [{ type: 'ai_usage_3days', description: 'Sử dụng AI 20 lần', target: 20, current: 0 }],
        rewards: [{ type: RewardType.THEME, value: 1, description: 'Chủ đề AI Master' }],
        startDate: new Date(),
        endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        participants: 0,
        isActive: true
      }
    ];
  }

  private getDefaultLeaderboards(): Leaderboard[] {
    return [
      {
        id: 'daily_words',
        type: LeaderboardType.WORDS_WRITTEN,
        period: LeaderboardPeriod.DAILY,
        entries: [],
        lastUpdated: new Date()
      },
      {
        id: 'weekly_xp',
        type: LeaderboardType.EXPERIENCE,
        period: LeaderboardPeriod.WEEKLY,
        entries: [],
        lastUpdated: new Date()
      },
      {
        id: 'all_time_achievements',
        type: LeaderboardType.ACHIEVEMENTS,
        period: LeaderboardPeriod.ALL_TIME,
        entries: [],
        lastUpdated: new Date()
      }
    ];
  }

  private loadUserData() {
    const savedProfile = localStorage.getItem('gamification_profile');
    if (savedProfile) {
      this.userProfile = JSON.parse(savedProfile);
    } else {
      this.userProfile = this.createDefaultProfile();
    }

    const savedNotifications = localStorage.getItem('gamification_notifications');
    if (savedNotifications) {
      this.notifications = JSON.parse(savedNotifications);
    }
  }

  private createDefaultProfile(): UserProfile {
    return {
      id: 'user_' + Math.random().toString(36).substr(2, 9),
      username: 'Tác Giả' + Math.floor(Math.random() * 1000),
      level: 1,
      experience: 0,
      totalWordsWritten: 0,
      achievements: [],
      badges: this.badges.filter(b => b.unlocked),
      streaks: [
        {
          id: 'daily_writing',
          type: StreakType.DAILY_WRITING,
          currentCount: 0,
          bestCount: 0,
          startDate: new Date(),
          lastUpdate: new Date(),
          isActive: false
        }
      ],
      stats: {
        totalWritingTime: 0,
        averageWordsPerSession: 0,
        totalSessions: 0,
        favoriteWritingTime: '09:00',
        mostProductiveDay: 'Thứ Hai',
        chaptersCompleted: 0,
        aiAssistanceUsage: 0,
        collaborationCount: 0
      },
      preferences: {
        notificationsEnabled: true,
        soundEnabled: true,
        theme: 'dark',
        language: 'vi',
        autoSave: true,
        showAchievements: true,
        privacy: {
          shareStats: false,
          shareAchievements: false,
          publicProfile: false,
          showOnlineStatus: false
        }
      },
      createdAt: new Date(),
      lastActive: new Date()
    };
  }

  private saveUserData() {
    if (this.userProfile) {
      localStorage.setItem('gamification_profile', JSON.stringify(this.userProfile));
    }
    localStorage.setItem('gamification_notifications', JSON.stringify(this.notifications));
  }

  // Public Methods
  getUserProfile(): UserProfile | null {
    return this.userProfile;
  }

  updateUserProfile(updates: Partial<UserProfile>) {
    if (this.userProfile) {
      this.userProfile = { ...this.userProfile, ...updates, lastActive: new Date() };
      this.saveUserData();
    }
  }

  trackWordsWritten(wordCount: number) {
    if (!this.userProfile) return;

    this.userProfile.totalWordsWritten += wordCount;
    this.userProfile.stats.totalSessions++;
    
    // Update daily writing streak
    this.updateDailyStreak();
    
    // Check achievements
    this.checkAchievements();
    
    // Update challenges
    this.updateChallenges();
    
    // Add experience
    this.addExperience(Math.floor(wordCount / 10));
    
    this.saveUserData();
  }

  trackAIUsage() {
    if (!this.userProfile) return;

    this.userProfile.stats.aiAssistanceUsage++;
    
    // Check AI-related achievements
    this.checkAchievements();
    
    // Update challenges
    this.updateChallenges();
    
    this.saveUserData();
  }

  trackChapterCompletion() {
    if (!this.userProfile) return;

    this.userProfile.stats.chaptersCompleted++;
    
    // Check achievements
    this.checkAchievements();
    
    // Add bonus experience
    this.addExperience(100);
    
    this.saveUserData();
  }

  private updateDailyStreak() {
    if (!this.userProfile) return;

    const dailyStreak = this.userProfile.streaks.find(s => s.type === StreakType.DAILY_WRITING);
    if (!dailyStreak) return;

    const today = new Date().toDateString();
    const lastUpdate = dailyStreak.lastUpdate.toDateString();

    if (today !== lastUpdate) {
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
      
      if (lastUpdate === yesterday) {
        // Continue streak
        dailyStreak.currentCount++;
      } else {
        // Reset streak
        dailyStreak.currentCount = 1;
        dailyStreak.startDate = new Date();
      }
      
      dailyStreak.lastUpdate = new Date();
      dailyStreak.isActive = true;
      
      if (dailyStreak.currentCount > dailyStreak.bestCount) {
        dailyStreak.bestCount = dailyStreak.currentCount;
      }
    }
  }

  private addExperience(exp: number) {
    if (!this.userProfile) return;

    this.userProfile.experience += exp;
    
    // Check for level up
    const newLevel = Math.floor(this.userProfile.experience / 100) + 1;
    if (newLevel > this.userProfile.level) {
      this.userProfile.level = newLevel;
      this.addNotification({
        id: 'level_up_' + Date.now(),
        type: NotificationType.LEVEL_UP,
        title: 'Lên Cấp!',
        message: `Chúc mừng! Bạn đã đạt cấp ${newLevel}`,
        icon: '⬆️',
        timestamp: new Date(),
        read: false
      });
    }
  }

  private checkAchievements() {
    if (!this.userProfile) return;

    this.achievements.forEach(achievement => {
      if (achievement.unlocked) return;

      let progress = 0;
      let shouldUnlock = false;

      achievement.requirements.forEach(req => {
        switch (req.type) {
          case 'words_written':
            progress = this.userProfile!.totalWordsWritten;
            if (progress >= req.value) shouldUnlock = true;
            break;
          case 'chapters_completed':
            progress = this.userProfile!.stats.chaptersCompleted;
            if (progress >= req.value) shouldUnlock = true;
            break;
          case 'daily_writing_streak':
            const streak = this.userProfile!.streaks.find(s => s.type === StreakType.DAILY_WRITING);
            progress = streak?.currentCount || 0;
            if (progress >= req.value) shouldUnlock = true;
            break;
          case 'ai_usage':
            progress = this.userProfile!.stats.aiAssistanceUsage;
            if (progress >= req.value) shouldUnlock = true;
            break;
          case 'total_words':
            progress = this.userProfile!.totalWordsWritten;
            if (progress >= req.value) shouldUnlock = true;
            break;
        }
      });

      achievement.progress = Math.min(progress, achievement.maxProgress);

      if (shouldUnlock) {
        this.unlockAchievement(achievement);
      }
    });
  }

  private unlockAchievement(achievement: Achievement) {
    if (!this.userProfile) return;

    achievement.unlocked = true;
    achievement.unlockedAt = new Date();
    
    this.userProfile.achievements.push(achievement);
    this.addExperience(achievement.points);
    
    this.addNotification({
      id: 'achievement_' + achievement.id + '_' + Date.now(),
      type: NotificationType.ACHIEVEMENT_UNLOCKED,
      title: 'Thành Tựu Mới!',
      message: `${achievement.title} - ${achievement.description}`,
      icon: achievement.icon,
      timestamp: new Date(),
      read: false
    });
  }

  private updateChallenges() {
    if (!this.userProfile) return;

    this.challenges.forEach(challenge => {
      if (!challenge.isActive) return;

      challenge.requirements.forEach(req => {
        switch (req.type) {
          case 'words_today':
            // This would need daily tracking implementation
            req.current = Math.min(this.userProfile!.totalWordsWritten, req.target);
            break;
          case 'daily_streak':
            const streak = this.userProfile!.streaks.find(s => s.type === StreakType.DAILY_WRITING);
            req.current = streak?.currentCount || 0;
            break;
          case 'ai_usage_3days':
            // This would need 3-day tracking implementation
            req.current = Math.min(this.userProfile!.stats.aiAssistanceUsage, req.target);
            break;
        }
      });

      const isCompleted = challenge.requirements.every(req => req.current >= req.target);
      if (isCompleted && !challenge.userProgress) {
        this.completeChallenge(challenge);
      }
    });
  }

  private completeChallenge(challenge: Challenge) {
    if (!this.userProfile) return;

    challenge.userProgress = 100;
    
    challenge.rewards.forEach(reward => {
      switch (reward.type) {
        case RewardType.EXPERIENCE:
          this.addExperience(reward.value);
          break;
        case RewardType.BADGE:
          // Award badge logic
          break;
        case RewardType.THEME:
          // Unlock theme logic
          break;
      }
    });

    this.addNotification({
      id: 'challenge_' + challenge.id + '_' + Date.now(),
      type: NotificationType.CHALLENGE_COMPLETED,
      title: 'Hoàn Thành Thử Thách!',
      message: `${challenge.title} - ${challenge.description}`,
      icon: '🎯',
      timestamp: new Date(),
      read: false
    });
  }

  private addNotification(notification: Notification) {
    this.notifications.unshift(notification);
    if (this.notifications.length > 50) {
      this.notifications = this.notifications.slice(0, 50);
    }
    this.saveUserData();
  }

  // Getters
  getAchievements(): Achievement[] {
    return this.achievements;
  }

  getBadges(): Badge[] {
    return this.badges;
  }

  getChallenges(): Challenge[] {
    return this.challenges;
  }

  getLeaderboards(): Leaderboard[] {
    return this.leaderboards;
  }

  getNotifications(): Notification[] {
    return this.notifications;
  }

  markNotificationAsRead(notificationId: string) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.saveUserData();
    }
  }

  clearAllNotifications() {
    this.notifications = [];
    this.saveUserData();
  }

  // Leaderboard methods
  updateLeaderboard(type: LeaderboardType, period: LeaderboardPeriod) {
    const leaderboard = this.leaderboards.find(l => l.type === type && l.period === period);
    if (!leaderboard) return;

    // This would normally fetch from server
    // For now, we'll create mock data
    leaderboard.entries = this.generateMockLeaderboardEntries();
    leaderboard.lastUpdated = new Date();
    
    // Set user rank
    const userEntry = leaderboard.entries.find(e => e.userId === this.userProfile?.id);
    if (userEntry) {
      leaderboard.userRank = userEntry.rank;
    }
  }

  private generateMockLeaderboardEntries() {
    const mockEntries = [];
    const names = ['NguyenVanA', 'TranThiB', 'LeVanC', 'PhamThiD', 'HoangVanE'];
    
    for (let i = 0; i < 10; i++) {
      mockEntries.push({
        userId: 'mock_' + i,
        username: names[i] || `User${i + 1}`,
        rank: i + 1,
        score: Math.floor(Math.random() * 10000) + 1000,
        trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.5 ? 'down' : 'same',
        change: Math.floor(Math.random() * 10) - 5
      });
    }
    
    // Add current user if exists
    if (this.userProfile) {
      mockEntries.push({
        userId: this.userProfile.id,
        username: this.userProfile.username,
        rank: Math.floor(Math.random() * 50) + 1,
        score: this.userProfile.experience,
        trend: 'up',
        change: 5
      });
    }
    
    return mockEntries.sort((a, b) => b.score - a.score).map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));
  }

  // Stats and analytics
  getUserStats() {
    if (!this.userProfile) return null;

    return {
      totalWords: this.userProfile.totalWordsWritten,
      currentLevel: this.userProfile.level,
      experience: this.userProfile.experience,
      achievementsUnlocked: this.userProfile.achievements.length,
      totalAchievements: this.achievements.length,
      currentStreak: this.userProfile.streaks.find(s => s.type === StreakType.DAILY_WRITING)?.currentCount || 0,
      bestStreak: this.userProfile.streaks.find(s => s.type === StreakType.DAILY_WRITING)?.bestCount || 0,
      totalSessions: this.userProfile.stats.totalSessions,
      averageWordsPerSession: this.userProfile.stats.averageWordsPerSession
    };
  }
}

export default GamificationService;
