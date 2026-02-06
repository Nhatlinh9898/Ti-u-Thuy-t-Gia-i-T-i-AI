import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Star,
  Target,
  Flame,
  Award,
  TrendingUp,
  Calendar,
  Bell,
  Settings,
  User,
  Zap,
  Crown,
  Medal,
  Gem,
  Lock,
  Unlock,
  CheckCircle,
  Clock,
  BarChart3,
  Users,
  Gift,
  Gamepad2,
  Heart,
  BookOpen,
  PenTool,
  MessageSquare,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  ChevronRight,
  ChevronDown,
  MoreVertical,
  RefreshCw,
  Filter,
  Search,
  X
} from 'lucide-react';
import GamificationService from '../services/gamificationService';
import {
  UserProfile,
  Achievement,
  Badge,
  Challenge,
  Leaderboard,
  Notification,
  AchievementCategory,
  AchievementRarity,
  LeaderboardType,
  LeaderboardPeriod,
  ChallengeDifficulty
} from '../types';

interface GamificationPanelProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const GamificationPanel: React.FC<GamificationPanelProps> = ({ isOpen = true, onClose }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'achievements' | 'challenges' | 'leaderboard' | 'notifications'>('profile');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [leaderboards, setLeaderboards] = useState<Leaderboard[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedLeaderboard, setSelectedLeaderboard] = useState<LeaderboardType>(LeaderboardType.EXPERIENCE);
  const [selectedPeriod, setSelectedPeriod] = useState<LeaderboardPeriod>(LeaderboardPeriod.WEEKLY);
  const [achievementFilter, setAchievementFilter] = useState<AchievementCategory | 'all'>('all');
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false);
  const [expandedAchievements, setExpandedAchievements] = useState<Set<string>>(new Set());

  const gamificationService = GamificationService.getInstance();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setUserProfile(gamificationService.getUserProfile());
    setAchievements(gamificationService.getAchievements());
    setChallenges(gamificationService.getChallenges());
    setLeaderboards(gamificationService.getLeaderboards());
    setNotifications(gamificationService.getNotifications());
    
    // Update leaderboards
    gamificationService.updateLeaderboard(selectedLeaderboard, selectedPeriod);
  };

  const markNotificationAsRead = (notificationId: string) => {
    gamificationService.markNotificationAsRead(notificationId);
    loadData();
  };

  const clearAllNotifications = () => {
    gamificationService.clearAllNotifications();
    loadData();
  };

  const toggleAchievementExpanded = (achievementId: string) => {
    const newExpanded = new Set(expandedAchievements);
    if (newExpanded.has(achievementId)) {
      newExpanded.delete(achievementId);
    } else {
      newExpanded.add(achievementId);
    }
    setExpandedAchievements(newExpanded);
  };

  const getRarityColor = (rarity: AchievementRarity) => {
    switch (rarity) {
      case AchievementRarity.COMMON: return 'text-gray-400 border-gray-600';
      case AchievementRarity.UNCOMMON: return 'text-green-400 border-green-600';
      case AchievementRarity.RARE: return 'text-blue-400 border-blue-600';
      case AchievementRarity.EPIC: return 'text-purple-400 border-purple-600';
      case AchievementRarity.LEGENDARY: return 'text-yellow-400 border-yellow-600';
      default: return 'text-gray-400 border-gray-600';
    }
  };

  const getDifficultyColor = (difficulty: ChallengeDifficulty) => {
    switch (difficulty) {
      case ChallengeDifficulty.EASY: return 'bg-green-600';
      case ChallengeDifficulty.MEDIUM: return 'bg-yellow-600';
      case ChallengeDifficulty.HARD: return 'bg-orange-600';
      case ChallengeDifficulty.EXPERT: return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const filteredAchievements = achievements.filter(achievement => {
    const categoryMatch = achievementFilter === 'all' || achievement.category === achievementFilter;
    const unlockedMatch = !showUnlockedOnly || achievement.unlocked;
    return categoryMatch && unlockedMatch;
  });

  const currentLeaderboard = leaderboards.find(l => l.type === selectedLeaderboard && l.period === selectedPeriod);

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-vip-900 rounded-2xl w-full max-w-6xl h-[90vh] max-h-[900px] flex flex-col border border-vip-700 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-vip-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-vip-gold to-yellow-600 rounded-xl">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Hệ Thống Game Hóa</h2>
              <p className="text-vip-300 text-sm">Theo dõi thành tích và thử thách của bạn</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              className="p-2 hover:bg-vip-800 rounded-lg transition-colors text-vip-300"
              title="Làm mới"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-vip-800 rounded-lg transition-colors text-vip-300"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 p-4 border-b border-vip-800 bg-vip-800/30">
          {[
            { id: 'profile', label: 'Hồ Sơ', icon: User },
            { id: 'achievements', label: 'Thành Tựu', icon: Trophy, badge: achievements.filter(a => a.unlocked).length },
            { id: 'challenges', label: 'Thử Thách', icon: Target, badge: challenges.filter(c => c.userProgress === 100).length },
            { id: 'leaderboard', label: 'Bảng Xếp Hạng', icon: TrendingUp },
            { id: 'notifications', label: 'Thông Báo', icon: Bell, badge: unreadCount }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-vip-700 text-white'
                  : 'text-vip-300 hover:bg-vip-800 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="font-medium">{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="px-2 py-0.5 bg-vip-gold text-vip-900 text-xs font-bold rounded-full">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {/* Profile Tab */}
          {activeTab === 'profile' && userProfile && (
            <div className="h-full overflow-y-auto p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* User Info Card */}
                <div className="lg:col-span-1">
                  <div className="bg-gradient-to-br from-vip-800 to-vip-900 rounded-xl p-6 border border-vip-700">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-vip-gold to-yellow-600 rounded-full flex items-center justify-center">
                        <Crown className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{userProfile.username}</h3>
                        <p className="text-vip-300">Cấp {userProfile.level}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-vip-300">Kinh Nghiệm</span>
                          <span className="text-white font-medium">{userProfile.experience} / {userProfile.level * 100}</span>
                        </div>
                        <div className="w-full bg-vip-950 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-vip-gold to-yellow-600 h-2 rounded-full transition-all"
                            style={{ width: `${(userProfile.experience / (userProfile.level * 100)) * 100}%` }}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="bg-vip-950 rounded-lg p-3">
                          <div className="text-2xl font-bold text-vip-gold">{userProfile.totalWordsWritten.toLocaleString()}</div>
                          <div className="text-xs text-vip-300">Tổng Từ</div>
                        </div>
                        <div className="bg-vip-950 rounded-lg p-3">
                          <div className="text-2xl font-bold text-vip-gold">{userProfile.achievements.length}</div>
                          <div className="text-xs text-vip-300">Thành Tựu</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Streaks */}
                  <div className="bg-vip-800 rounded-xl p-6 border border-vip-700 mt-6">
                    <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                      <Flame className="w-5 h-5 text-orange-400" />
                      Chuỗi Viết
                    </h4>
                    {userProfile.streaks.map(streak => (
                      <div key={streak.id} className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            streak.isActive ? 'bg-orange-600' : 'bg-vip-700'
                          }`}>
                            <Flame className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="text-white font-medium">Viết Hàng Ngày</div>
                            <div className="text-vip-300 text-sm">
                              {streak.isActive ? 'Đang hoạt động' : 'Đã dừng'}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-orange-400">{streak.currentCount}</div>
                          <div className="text-xs text-vip-300">Tốt nhất: {streak.bestCount}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats & Badges */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-vip-800 rounded-xl p-4 border border-vip-700">
                      <div className="flex items-center gap-3 mb-2">
                        <Clock className="w-5 h-5 text-blue-400" />
                        <span className="text-vip-300 text-sm">Thời Gian Viết</span>
                      </div>
                      <div className="text-2xl font-bold text-white">{userProfile.stats.totalWritingTime}</div>
                      <div className="text-xs text-vip-300">phút</div>
                    </div>
                    
                    <div className="bg-vip-800 rounded-xl p-4 border border-vip-700">
                      <div className="flex items-center gap-3 mb-2">
                        <BookOpen className="w-5 h-5 text-green-400" />
                        <span className="text-vip-300 text-sm">Chương Hoàn Thành</span>
                      </div>
                      <div className="text-2xl font-bold text-white">{userProfile.stats.chaptersCompleted}</div>
                      <div className="text-xs text-vip-300">chương</div>
                    </div>
                    
                    <div className="bg-vip-800 rounded-xl p-4 border border-vip-700">
                      <div className="flex items-center gap-3 mb-2">
                        <Zap className="w-5 h-5 text-purple-400" />
                        <span className="text-vip-300 text-sm">Sử Dụng AI</span>
                      </div>
                      <div className="text-2xl font-bold text-white">{userProfile.stats.aiAssistanceUsage}</div>
                      <div className="text-xs text-vip-300">lần</div>
                    </div>
                    
                    <div className="bg-vip-800 rounded-xl p-4 border border-vip-700">
                      <div className="flex items-center gap-3 mb-2">
                        <Users className="w-5 h-5 text-yellow-400" />
                        <span className="text-vip-300 text-sm">Hợp Tác</span>
                      </div>
                      <div className="text-2xl font-bold text-white">{userProfile.stats.collaborationCount}</div>
                      <div className="text-xs text-vip-300">lần</div>
                    </div>
                  </div>

                  {/* Recent Badges */}
                  <div className="bg-vip-800 rounded-xl p-6 border border-vip-700">
                    <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                      <Medal className="w-5 h-5 text-vip-gold" />
                      Huy Hiệu Gần Đây
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {userProfile.badges.slice(0, 8).map(badge => (
                        <div key={badge.id} className="text-center">
                          <div 
                            className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl mb-2 border-2"
                            style={{ 
                              backgroundColor: badge.color + '20',
                              borderColor: badge.color 
                            }}
                          >
                            {badge.icon}
                          </div>
                          <div className="text-white text-sm font-medium">{badge.name}</div>
                          <div className="text-vip-300 text-xs">{badge.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div className="h-full overflow-y-auto p-6">
              {/* Filters */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <select
                    value={achievementFilter}
                    onChange={(e) => setAchievementFilter(e.target.value as AchievementCategory | 'all')}
                    className="bg-vip-800 border border-vip-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-vip-gold"
                  >
                    <option value="all">Tất Cả Danh Mục</option>
                    <option value={AchievementCategory.WRITING}>Viết Lách</option>
                    <option value={AchievementCategory.CREATIVITY}>Sáng Tạo</option>
                    <option value={AchievementCategory.CONSISTENCY}>Đều Đặn</option>
                    <option value={AchievementCategory.MILESTONES}>Cột Mốc</option>
                    <option value={AchievementCategory.TECHNICAL}>Kỹ Thuật</option>
                  </select>
                  
                  <button
                    onClick={() => setShowUnlockedOnly(!showUnlockedOnly)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      showUnlockedOnly 
                        ? 'bg-vip-gold text-vip-900' 
                        : 'bg-vip-800 text-vip-300 hover:bg-vip-700'
                    }`}
                  >
                    {showUnlockedOnly ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    {showUnlockedOnly ? 'Tất Cả' : 'Chỉ Đã Mở'}
                  </button>
                </div>
                
                <div className="text-vip-300">
                  {filteredAchievements.filter(a => a.unlocked).length} / {filteredAchievements.length} đã mở
                </div>
              </div>

              {/* Achievement Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAchievements.map(achievement => (
                  <div 
                    key={achievement.id}
                    className={`bg-vip-800 rounded-xl p-6 border transition-all cursor-pointer hover:shadow-lg ${
                      achievement.unlocked 
                        ? getRarityColor(achievement.rarity) 
                        : 'border-vip-700 opacity-60'
                    }`}
                    onClick={() => toggleAchievementExpanded(achievement.id)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`text-3xl ${achievement.unlocked ? '' : 'grayscale'}`}>
                        {achievement.icon}
                      </div>
                      <div className="flex items-center gap-2">
                        {achievement.unlocked && (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        )}
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          achievement.rarity === AchievementRarity.LEGENDARY ? 'bg-yellow-600 text-white' :
                          achievement.rarity === AchievementRarity.EPIC ? 'bg-purple-600 text-white' :
                          achievement.rarity === AchievementRarity.RARE ? 'bg-blue-600 text-white' :
                          achievement.rarity === AchievementRarity.UNCOMMON ? 'bg-green-600 text-white' :
                          'bg-gray-600 text-white'
                        }`}>
                          {achievement.rarity}
                        </span>
                      </div>
                    </div>
                    
                    <h3 className="font-bold text-white mb-2">{achievement.title}</h3>
                    <p className="text-vip-300 text-sm mb-4">{achievement.description}</p>
                    
                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-vip-300">Tiến Trình</span>
                        <span className="text-white font-medium">
                          {achievement.progress} / {achievement.maxProgress}
                        </span>
                      </div>
                      <div className="w-full bg-vip-950 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${
                            achievement.unlocked ? 'bg-green-500' : 'bg-vip-gold'
                          }`}
                          style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-vip-300">Điểm</span>
                        <span className="text-vip-gold font-medium">+{achievement.points}</span>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {expandedAchievements.has(achievement.id) && (
                      <div className="mt-4 pt-4 border-t border-vip-700">
                        <div className="text-sm text-vip-300">
                          <div className="font-medium text-white mb-2">Yêu Cầu:</div>
                          {achievement.requirements.map((req, index) => (
                            <div key={index} className="mb-1">
                              • {req.type}: {req.value}+
                            </div>
                          ))}
                          {achievement.unlockedAt && (
                            <div className="mt-2 text-green-400">
                              Đã mở: {new Date(achievement.unlockedAt).toLocaleDateString('vi-VN')}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Challenges Tab */}
          {activeTab === 'challenges' && (
            <div className="h-full overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {challenges.map(challenge => (
                  <div key={challenge.id} className="bg-vip-800 rounded-xl p-6 border border-vip-700">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getDifficultyColor(challenge.difficulty)}`}>
                        {challenge.difficulty}
                      </span>
                      <div className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-vip-gold" />
                        <span className="text-vip-300">{challenge.participants} người tham gia</span>
                      </div>
                    </div>
                    
                    <h3 className="font-bold text-white mb-2">{challenge.title}</h3>
                    <p className="text-vip-300 text-sm mb-4">{challenge.description}</p>
                    
                    {/* Requirements */}
                    <div className="space-y-3 mb-4">
                      {challenge.requirements.map((req, index) => (
                        <div key={index}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-vip-300">{req.description}</span>
                            <span className="text-white font-medium">
                              {req.current} / {req.target}
                            </span>
                          </div>
                          <div className="w-full bg-vip-950 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-vip-gold to-yellow-600 h-2 rounded-full transition-all"
                              style={{ width: `${Math.min((req.current / req.target) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Rewards */}
                    <div className="border-t border-vip-700 pt-4">
                      <div className="text-sm font-medium text-vip-gold mb-2">Phần Thưởng:</div>
                      {challenge.rewards.map((reward, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-vip-300">
                          <Gift className="w-4 h-4" />
                          {reward.description}
                        </div>
                      ))}
                    </div>
                    
                    {/* Time Remaining */}
                    <div className="mt-4 pt-4 border-t border-vip-700">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-vip-300">Thời gian còn lại</span>
                        <span className="text-white font-medium">
                          {Math.ceil((challenge.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} ngày
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Leaderboard Tab */}
          {activeTab === 'leaderboard' && (
            <div className="h-full overflow-y-auto p-6">
              {/* Controls */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <select
                    value={selectedLeaderboard}
                    onChange={(e) => {
                      setSelectedLeaderboard(e.target.value as LeaderboardType);
                      gamificationService.updateLeaderboard(e.target.value as LeaderboardType, selectedPeriod);
                    }}
                    className="bg-vip-800 border border-vip-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-vip-gold"
                  >
                    <option value={LeaderboardType.EXPERIENCE}>Kinh Nghiệm</option>
                    <option value={LeaderboardType.WORDS_WRITTEN}>Từ Đã Viết</option>
                    <option value={LeaderboardType.ACHIEVEMENTS}>Thành Tựu</option>
                    <option value={LeaderboardType.STREAKS}>Chuỗi</option>
                  </select>
                  
                  <select
                    value={selectedPeriod}
                    onChange={(e) => {
                      setSelectedPeriod(e.target.value as LeaderboardPeriod);
                      gamificationService.updateLeaderboard(selectedLeaderboard, e.target.value as LeaderboardPeriod);
                    }}
                    className="bg-vip-800 border border-vip-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-vip-gold"
                  >
                    <option value={LeaderboardPeriod.DAILY}>Hàng Ngày</option>
                    <option value={LeaderboardPeriod.WEEKLY}>Hàng Tuần</option>
                    <option value={LeaderboardPeriod.MONTHLY}>Hàng Tháng</option>
                    <option value={LeaderboardPeriod.ALL_TIME}>Tất Cả Thời Gian</option>
                  </select>
                </div>
                
                <button
                  onClick={() => gamificationService.updateLeaderboard(selectedLeaderboard, selectedPeriod)}
                  className="flex items-center gap-2 px-4 py-2 bg-vip-700 hover:bg-vip-600 rounded-lg text-white transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Làm Mới
                </button>
              </div>

              {/* Leaderboard Table */}
              {currentLeaderboard && (
                <div className="bg-vip-800 rounded-xl border border-vip-700 overflow-hidden">
                  <div className="p-6">
                    <div className="space-y-1">
                      {currentLeaderboard.entries.map((entry, index) => (
                        <div 
                          key={entry.userId}
                          className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                            entry.userId === userProfile?.id 
                              ? 'bg-vip-700 border border-vip-gold' 
                              : 'hover:bg-vip-700/50'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                              entry.rank === 1 ? 'bg-yellow-600 text-white' :
                              entry.rank === 2 ? 'bg-gray-400 text-white' :
                              entry.rank === 3 ? 'bg-orange-600 text-white' :
                              'bg-vip-700 text-vip-300'
                            }`}>
                              {entry.rank}
                            </div>
                            
                            <div>
                              <div className="font-medium text-white flex items-center gap-2">
                                {entry.username}
                                {entry.userId === userProfile?.id && (
                                  <span className="px-2 py-0.5 bg-vip-gold text-vip-900 text-xs font-bold rounded-full">
                                    BẠN
                                  </span>
                                )}
                              </div>
                              {entry.badge && (
                                <div className="text-vip-300 text-sm">{entry.badge}</div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="font-bold text-white text-lg">{entry.score.toLocaleString()}</div>
                              <div className="flex items-center gap-1 text-sm">
                                {entry.trend === 'up' && <TrendingUp className="w-3 h-3 text-green-400" />}
                                {entry.trend === 'down' && <TrendingUp className="w-3 h-3 text-red-400 rotate-180" />}
                                {entry.trend === 'same' && <div className="w-3 h-3 bg-gray-400 rounded-full" />}
                                <span className={`${
                                  entry.trend === 'up' ? 'text-green-400' :
                                  entry.trend === 'down' ? 'text-red-400' :
                                  'text-gray-400'
                                }`}>
                                  {entry.change > 0 ? '+' : ''}{entry.change}
                                </span>
                              </div>
                            </div>
                            
                            {entry.rank <= 3 && (
                              <div className="text-2xl">
                                {entry.rank === 1 && '🥇'}
                                {entry.rank === 2 && '🥈'}
                                {entry.rank === 3 && '🥉'}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="h-full overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Thông Báo</h3>
                {notifications.length > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    className="px-4 py-2 bg-vip-700 hover:bg-vip-600 rounded-lg text-white transition-colors text-sm"
                  >
                    Xóa Tất Cả
                  </button>
                )}
              </div>
              
              {notifications.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="w-16 h-16 text-vip-600 mx-auto mb-4" />
                  <p className="text-vip-300">Không có thông báo nào</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.map(notification => (
                    <div 
                      key={notification.id}
                      className={`bg-vip-800 rounded-xl p-4 border transition-all cursor-pointer hover:bg-vip-700 ${
                        notification.read ? 'border-vip-700 opacity-60' : 'border-vip-gold'
                      }`}
                      onClick={() => markNotificationAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-2xl">{notification.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-bold text-white">{notification.title}</h4>
                            <span className="text-vip-300 text-sm">
                              {new Date(notification.timestamp).toLocaleString('vi-VN')}
                            </span>
                          </div>
                          <p className="text-vip-300">{notification.message}</p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-vip-gold rounded-full mt-2"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GamificationPanel;
