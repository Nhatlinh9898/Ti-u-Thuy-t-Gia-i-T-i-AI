import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Settings, 
  Activity, 
  GitBranch, 
  MessageSquare, 
  Video, 
  Share2, 
  Clock, 
  TrendingUp, 
  BarChart3, 
  Calendar, 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  RefreshCw, 
  Save, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  ChevronRight, 
  ChevronDown, 
  MoreVertical, 
  UserPlus, 
  UserMinus, 
  Shield, 
  Lock, 
  Unlock, 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Info, 
  Zap, 
  Target, 
  Award, 
  BookOpen, 
  Hash, 
  Star, 
  Flag, 
  Globe, 
  Database, 
  Server, 
  Cpu, 
  HardDrive, 
  Wifi, 
  WifiOff, 
  Monitor, 
  Smartphone, 
  Tablet, 
  Laptop, 
  Headphones, 
  Mic, 
  MicOff, 
  VideoOff, 
  Phone, 
  PhoneOff, 
  Mail, 
  Bell, 
  BellOff, 
  Settings2, 
  LogOut, 
  LogIn, 
  User, 
  UserCheck, 
  UserX, 
  Crown, 
  Key, 
  FileText, 
  Folder, 
  FolderOpen, 
  File, 
  FilePlus, 
  FileMinus, 
  FileCheck, 
  FileX, 
  Copy, 
  Move, 
  Archive, 
  Trash, 
  Recycle, 
  History, 
  Timeline, 
  GitMerge, 
  GitCommit, 
  GitPullRequest, 
  GitBranchPlus, 
  GitCompare, 
  GitFork, 
  Layers, 
  Package, 
  Box, 
  PackageOpen, 
  PackagePlus, 
  PackageMinus, 
  PackageX, 
  PackageCheck, 
  PackageSearch, 
  PackageOpen, 
  PackageMinus, 
  PackagePlus, 
  PackageX, 
  PackageCheck, 
  PackageSearch
} from 'lucide-react';
import CollaborationService from '../services/collaborationService';

interface CollaborationPanelProps {
  onWorkspaceCreated?: (workspace: any) => void;
  onUserJoined?: (member: any) => void;
  onProjectCreated?: (project: any) => void;
}

const CollaborationPanel: React.FC<CollaborationPanelProps> = ({ 
  onWorkspaceCreated,
  onUserJoined,
  onProjectCreated
}) => {
  const [collabService] = useState(() => new CollaborationService());
  const [activeTab, setActiveTab] = useState<'overview' | 'workspaces' | 'members' | 'projects' | 'activity' | 'analytics'>('overview');
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const workspaceList = collabService.getWorkspaces();
      setWorkspaces(workspaceList);
      
      if (workspaceList.length > 0) {
        const firstWorkspace = workspaceList[0];
        setSelectedWorkspace(firstWorkspace);
        setMembers(firstWorkspace.members);
        setProjects(firstWorkspace.projects);
        setActivities(firstWorkspace.activity);
        
        const analyticsData = await collabService.getWorkspaceAnalytics(
          firstWorkspace.id,
          {
            start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            end: new Date(),
            type: 'weekly'
          }
        );
        setAnalytics(analyticsData);
      }
    } catch (error) {
      console.error('Failed to load collaboration data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateWorkspace = async () => {
    const name = prompt('Enter workspace name:');
    if (!name) return;

    const description = prompt('Enter workspace description:') || '';
    const type = prompt('Enter workspace type (personal/team/public/private):') as any || 'team';

    try {
      const workspace = await collabService.createWorkspace(
        name,
        description,
        type,
        'current-user',
        {
          autoSave: true,
          autoSaveInterval: 5,
          realTimeEditing: true,
          enableComments: true,
          enableChat: true,
          enableVideoCall: false,
          enableScreenShare: false,
          conflictResolution: 'auto',
          maxUsers: 10
        }
      );

      setWorkspaces([workspace, ...workspaces]);
      setSelectedWorkspace(workspace);
      onWorkspaceCreated?.(workspace);

    } catch (error) {
      console.error('Failed to create workspace:', error);
    }
  };

  const handleJoinWorkspace = async () => {
    if (!selectedWorkspace) return;

    const username = prompt('Enter your username:');
    if (!username) return;

    const email = prompt('Enter your email:') || '';
    const role = prompt('Enter role (viewer/editor/admin):') as any || 'viewer';

    try {
      const member = await collabService.joinWorkspace(
        selectedWorkspace.id,
        'user-' + Date.now(),
        username,
        email,
        role
      );

      setMembers([member, ...members]);
      onUserJoined?.(member);

    } catch (error) {
      console.error('Failed to join workspace:', error);
    }
  };

  const handleCreateProject = async () => {
    if (!selectedWorkspace) return;

    const name = prompt('Enter project name:');
    if (!name) return;

    const description = prompt('Enter project description:') || '';
    const type = prompt('Enter project type (novel/story/character/world/other):') as any || 'novel';

    try {
      const project = {
        id: `project-${Date.now()}`,
        name,
        description,
        type,
        content: {},
        collaborators: [],
        versions: [],
        comments: [],
        settings: {
          isPublic: false,
          allowComments: true,
          allowEditing: true,
          requireApproval: false,
          autoSave: true,
          versionControl: true,
          lockOnEdit: false
        },
        createdAt: new Date(),
        lastModified: new Date(),
        lastModifiedBy: 'current-user'
      };

      setProjects([project, ...projects]);
      onProjectCreated?.(project);

    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const getWorkspaceIcon = (type: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'personal': <User className="w-5 h-5" />,
      'team': <Users className="w-5 h-5" />,
      'public': <Globe className="w-5 h-5" />,
      'private': <Lock className="w-5 h-5" />
    };

    return iconMap[type] || <Folder className="w-5 h-5" />;
  };

  const getRoleIcon = (role: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'owner': <Crown className="w-4 h-4" />,
      'admin': <Shield className="w-4 h-4" />,
      'editor': <Edit className="w-4 h-4" />,
      'viewer': <Eye className="w-4 h-4" />
    };

    return iconMap[role] || <User className="w-4 h-4" />;
  };

  const getRoleColor = (role: string) => {
    const colorMap: Record<string, string> = {
      'owner': 'text-yellow-600 bg-yellow-100',
      'admin': 'text-red-600 bg-red-100',
      'editor': 'text-blue-600 bg-blue-100',
      'viewer': 'text-gray-600 bg-gray-100'
    };

    return colorMap[role] || 'text-gray-600 bg-gray-100';
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      'active': 'text-green-600 bg-green-100',
      'inactive': 'text-gray-600 bg-gray-100',
      'pending': 'text-yellow-600 bg-yellow-100',
      'banned': 'text-red-600 bg-red-100'
    };

    return colorMap[status] || 'text-gray-600 bg-gray-100';
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-blue-500" />
              <div>
                <h3 className="text-lg font-semibold">Workspaces</h3>
                <p className="text-sm text-gray-600">Total workspaces</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">{workspaces.length}</div>
              <div className="text-sm text-gray-500">workspaces</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <UserPlus className="w-8 h-8 text-green-500" />
              <div>
                <h3 className="text-lg font-semibold">Members</h3>
                <p className="text-sm text-gray-600">Total members</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600">{members.length}</div>
              <div className="text-sm text-gray-500">members</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <FileText className="w-8 h-8 text-purple-500" />
              <div>
                <h3 className="text-lg font-semibold">Projects</h3>
                <p className="text-sm text-gray-600">Total projects</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-purple-600">{projects.length}</div>
              <div className="text-sm text-gray-500">projects</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Activity className="w-8 h-8 text-orange-500" />
              <div>
                <h3 className="text-lg font-semibold">Activities</h3>
                <p className="text-sm text-gray-600">Recent activities</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-orange-600">{activities.length}</div>
              <div className="text-sm text-gray-500">activities</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {activities.slice(0, 5).map((activity, index) => (
            <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                  <Activity className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <div className="font-medium">{activity.username}</div>
                  <div className="text-sm text-gray-500">
                    {activity.action.description} - {activity.target.name}
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(activity.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">
                  {activity.action.type}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderWorkspaces = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Workspaces</h3>
          <button
            onClick={handleCreateWorkspace}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center space-x-1"
          >
            <Plus className="w-4 h-4" />
            <span>Create Workspace</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workspaces.map((workspace) => (
            <div key={workspace.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {getWorkspaceIcon(workspace.type)}
                  <div>
                    <div className="font-medium">{workspace.name}</div>
                    <div className="text-sm text-gray-500">{workspace.type}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-1 text-gray-500 hover:text-gray-700">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-500 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Members:</span>
                    <span className="text-gray-600">{workspace.members.length}</span>
                  </div>
                  <div>
                    <span className="font-medium">Projects:</span>
                    <span className="text-gray-600">{workspace.projects.length}</span>
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  <div>{workspace.description}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    Created: {new Date(workspace.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <div className="text-sm text-gray-600 mb-2">Features:</div>
                <div className="flex flex-wrap gap-2">
                  {workspace.settings.realTimeEditing && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Real-time</span>
                  )}
                  {workspace.settings.enableComments && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Comments</span>
                  )}
                  {workspace.settings.enableChat && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">Chat</span>
                  )}
                  {workspace.settings.enableVideoCall && (
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs">Video</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMembers = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Members</h3>
          <button
            onClick={handleJoinWorkspace}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 flex items-center space-x-1"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Member</span>
          </button>
        </div>

        <div className="space-y-3">
          {members.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <div className="font-medium">{member.username}</div>
                  <div className="text-sm text-gray-500">{member.email}</div>
                  <div className="text-xs text-gray-400">
                    Joined: {new Date(member.joinedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  {getRoleIcon(member.role)}
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleColor(member.role)}`}>
                    {member.role}
                  </span>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(member.status)}`}>
                  {member.status}
                </div>
                <div className="flex items-center space-x-1">
                  {member.isOnline ? (
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  ) : (
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  )}
                  <span className="text-xs text-gray-500">
                    {member.isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProjects = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Projects</h3>
          <button
            onClick={handleCreateProject}
            className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 flex items-center space-x-1"
          >
            <Plus className="w-4 h-4" />
            <span>Create Project</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div key={project.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                    <FileText className="w-4 h-4 text-gray-500" />
                  </div>
                  <div>
                    <div className="font-medium">{project.name}</div>
                    <div className="text-sm text-gray-500">{project.type}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-1 text-gray-500 hover:text-gray-700">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-500 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-gray-600">
                  <div>{project.description}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    Created: {new Date(project.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-gray-400">
                    Modified: {new Date(project.lastModified).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <div className="text-sm text-gray-600 mb-2">Settings:</div>
                <div className="flex flex-wrap gap-2">
                  {project.settings.isPublic && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Public</span>
                  )}
                  {project.settings.allowComments && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Comments</span>
                  )}
                  {project.settings.allowEditing && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">Editing</span>
                  )}
                  {project.settings.versionControl && (
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs">Version Control</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderActivity = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Activity Log</h3>
        
        <div className="space-y-3">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                  <Activity className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <div className="font-medium">{activity.username}</div>
                  <div className="text-sm text-gray-500">
                    {activity.action.description} - {activity.target.name}
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(activity.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">
                  {activity.action.type}
                </div>
                <div className="text-xs text-gray-400">
                  {activity.target.type}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Analytics Dashboard</h3>
        
        {analytics ? (
          <div className="space-y-6">
            {/* User Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-8 h-8 text-blue-500" />
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{analytics.metrics.totalUsers}</div>
                    <div className="text-sm text-gray-500">Total Users</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">Active: {analytics.metrics.activeUsers}</div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <FileText className="w-8 h-8 text-green-500" />
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">{analytics.metrics.totalProjects}</div>
                    <div className="text-sm text-gray-500">Total Projects</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">Active: {analytics.metrics.activeProjects}</div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <Edit className="w-8 h-8 text-purple-500" />
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-600">{analytics.metrics.totalEdits}</div>
                    <div className="text-sm text-gray-500">Total Edits</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">Comments: {analytics.metrics.totalComments}</div>
              </div>

              <div className="bg-orange-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-8 h-8 text-orange-500" />
                  <div className="text-right">
                    <div className="text-2xl font-bold text-orange-600">{analytics.metrics.peakConcurrentUsers}</div>
                    <div className="text-sm text-gray-500">Peak Concurrent</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">Avg Session: {analytics.metrics.averageSessionDuration}min</div>
              </div>
            </div>

            {/* Engagement Metrics */}
            <div className="border-t pt-4">
              <h4 className="font-medium mb-4">Engagement Metrics</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Daily Active Users</div>
                  <div className="text-2xl font-bold text-gray-800">
                    {analytics.userActivity.engagementMetrics.dailyActiveUsers}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Weekly Active Users</div>
                  <div className="text-2xl font-bold text-gray-800">
                    {analytics.userActivity.engagementMetrics.weeklyActiveUsers}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Monthly Active Users</div>
                  <div className="text-2xl font-bold text-gray-800">
                    {analytics.userActivity.engagementMetrics.monthlyActiveUsers}
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="border-t pt-4">
              <h4 className="font-medium mb-4">Performance Metrics</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Response Time</div>
                  <div className="text-2xl font-bold text-gray-800">
                    {analytics.performanceMetrics.averageResponseTime}ms
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Uptime</div>
                  <div className="text-2xl font-bold text-gray-800">
                    {analytics.performanceMetrics.uptime}%
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Error Rate</div>
                  <div className="text-2xl font-bold text-gray-800">
                    {analytics.performanceMetrics.errorRate}%
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600">Throughput</div>
                  <div className="text-2xl font-bold text-gray-800">
                    {analytics.performanceMetrics.throughput}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-500">No analytics data available</div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg h-full flex flex-col">
      <div className="border-b border-gray-200">
        <div className="flex items-center p-4">
          <Users className="w-6 h-6 text-blue-500 mr-2" />
          <h2 className="text-xl font-bold">Collaboration Features</h2>
        </div>

        <div className="flex space-x-1 px-4">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'workspaces', label: 'Workspaces', icon: Folder },
            { id: 'members', label: 'Members', icon: Users },
            { id: 'projects', label: 'Projects', icon: FileText },
            { id: 'activity', label: 'Activity', icon: Activity },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
              <div className="text-gray-500">Loading collaboration data...</div>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'workspaces' && renderWorkspaces()}
            {activeTab === 'members' && renderMembers()}
            {activeTab === 'projects' && renderProjects()}
            {activeTab === 'activity' && renderActivity()}
            {activeTab === 'analytics' && renderAnalytics()}
          </>
        )}
      </div>
    </div>
  );
};

export default CollaborationPanel;
