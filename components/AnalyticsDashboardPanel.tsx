import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  Settings, 
  Download, 
  RefreshCw, 
  Filter,
  Calendar,
  Eye,
  EyeOff,
  Zap,
  Cpu,
  HardDrive,
  Wifi,
  Globe,
  Target,
  Award,
  FileText,
  Database,
  Server,
  Monitor,
  Smartphone,
  Tablet,
  Layout,
  Grid,
  List,
  Plus,
  Edit,
  Trash2,
  Save,
  ChevronRight,
  ChevronDown,
  MoreVertical,
  Bell,
  BellOff,
  DownloadCloud,
  UploadCloud
} from 'lucide-react';
import AnalyticsDashboardService from '../services/analyticsDashboardService';

interface AnalyticsDashboardPanelProps {
  onDashboardCreated?: (dashboard: any) => void;
  onWidgetAdded?: (widget: any) => void;
}

const AnalyticsDashboardPanel: React.FC<AnalyticsDashboardPanelProps> = ({ 
  onDashboardCreated,
  onWidgetAdded
}) => {
  const [analyticsService] = useState(() => new AnalyticsDashboardService());
  const [activeTab, setActiveTab] = useState<'overview' | 'widgets' | 'reports' | 'realtime'>('overview');
  const [dashboards, setDashboards] = useState<any[]>([]);
  const [activeDashboard, setActiveDashboard] = useState<any>(null);
  const [widgets, setWidgets] = useState<any[]>([]);
  const [realTimeData, setRealTimeData] = useState<any[]>([]);
  const [insights, setInsights] = useState<any[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState('week');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Dashboard creation form
  const [dashboardForm, setDashboardForm] = useState({
    name: '',
    description: '',
    autoRefresh: true,
    refreshInterval: 60
  });

  // Widget creation form
  const [widgetForm, setWidgetForm] = useState({
    type: 'user_metrics' as any,
    title: '',
    chartType: 'line',
    timeRange: 'day',
    metrics: [],
    refreshRate: 60
  });

  useEffect(() => {
    loadData();
    startRealTimeMonitoring();
  }, []);

  useEffect(() => {
    if (activeDashboard) {
      loadDashboardWidgets();
      loadInsights();
    }
  }, [activeDashboard]);

  const loadData = () => {
    const allDashboards = analyticsService.getAllDashboards();
    setDashboards(allDashboards);
    
    if (allDashboards.length > 0 && !activeDashboard) {
      setActiveDashboard(allDashboards[0]);
    }
  };

  const startRealTimeMonitoring = () => {
    const metrics = ['cpu_usage', 'memory_usage', 'response_time', 'active_users'];
    
    const interval = setInterval(async () => {
      try {
        const data = await analyticsService.getRealTimeData(metrics);
        setRealTimeData(data);
      } catch (error) {
        console.error('Failed to fetch real-time data:', error);
      }
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  };

  const handleCreateDashboard = async () => {
    try {
      const dashboard = await analyticsService.createDashboard(
        dashboardForm.name,
        dashboardForm.description,
        {
          autoRefresh: dashboardForm.autoRefresh,
          refreshInterval: dashboardForm.refreshInterval
        }
      );
      
      setDashboards([...dashboards, dashboard]);
      setActiveDashboard(dashboard);
      onDashboardCreated?.(dashboard);
      
      // Reset form
      setDashboardForm({
        name: '',
        description: '',
        autoRefresh: true,
        refreshInterval: 60
      });
      
    } catch (error) {
      console.error('Failed to create dashboard:', error);
    }
  };

  const handleAddWidget = async () => {
    if (!activeDashboard) return;

    try {
      const widget = analyticsService.addWidget(
        activeDashboard.id,
        widgetForm.type,
        widgetForm.title,
        {
          chartType: widgetForm.chartType,
          timeRange: widgetForm.timeRange,
          metrics: widgetForm.metrics,
          refreshRate: widgetForm.refreshRate
        }
      );
      
      setWidgets([...widgets, widget]);
      onWidgetAdded?.(widget);
      
      // Reset form
      setWidgetForm({
        type: 'user_metrics',
        title: '',
        chartType: 'line',
        timeRange: 'day',
        metrics: [],
        refreshRate: 60
      });
      
    } catch (error) {
      console.error('Failed to add widget:', error);
    }
  };

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    try {
      await loadDashboardWidgets();
      await loadInsights();
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const loadDashboardWidgets = async () => {
    if (!activeDashboard) return;

    const dashboardWidgets = analyticsService.getDashboardWidgets(activeDashboard.id);
    const widgetsWithData = await Promise.all(
      dashboardWidgets.map(async (widget) => {
        const data = await analyticsService.getWidgetData(widget.id, [], selectedTimeRange);
        return { ...widget, data };
      })
    );
    
    setWidgets(widgetsWithData);
  };

  const loadInsights = async () => {
    if (!activeDashboard) return;

    try {
      const dashboardInsights = await analyticsService.getInsights(activeDashboard.id, selectedTimeRange);
      setInsights(dashboardInsights);
    } catch (error) {
      console.error('Failed to load insights:', error);
    }
  };

  const handleGenerateReport = async (format: string) => {
    if (!activeDashboard) return;

    try {
      const report = await analyticsService.generateReport(
        activeDashboard.id,
        'detailed',
        [],
        format
      );
      
      // Simulate download
      console.log('Report generated:', report);
      
    } catch (error) {
      console.error('Failed to generate report:', error);
    }
  };

  const getWidgetIcon = (type: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      user_metrics: <Users className="w-5 h-5" />,
      performance_metrics: <Activity className="w-5 h-5" />,
      content_analytics: <FileText className="w-5 h-5" />,
      engagement_analytics: <TrendingUp className="w-5 h-5" />,
      conversion_analytics: <Target className="w-5 h-5" />,
      behavioral_analytics: <Monitor className="w-5 h-5" />,
      system_health: <Server className="w-5 h-5" />,
      error_tracking: <AlertCircle className="w-5 h-5" />,
      usage_statistics: <BarChart3 className="w-5 h-5" />,
      real_time_monitoring: <Activity className="w-5 h-5" />
    };

    return iconMap[type] || <BarChart3 className="w-5 h-5" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'critical': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <div className="w-4 h-4" />;
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-blue-500" />
              <div>
                <h3 className="text-lg font-semibold">Total Users</h3>
                <p className="text-sm text-gray-600">Active users today</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              {getTrendIcon('up')}
              <span className="text-sm text-green-500">12%</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-blue-600">8,547</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Activity className="w-8 h-8 text-green-500" />
              <div>
                <h3 className="text-lg font-semibold">Engagement Rate</h3>
                <p className="text-sm text-gray-600">User engagement</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              {getTrendIcon('up')}
              <span className="text-sm text-green-500">8%</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-green-600">72.3%</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <LineChart className="w-8 h-8 text-purple-500" />
              <div>
                <h3 className="text-lg font-semibold">Avg Session</h3>
                <p className="text-sm text-gray-600">Session duration</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              {getTrendIcon('down')}
              <span className="text-sm text-red-500">5%</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-purple-600">4m 32s</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Target className="w-8 h-8 text-orange-500" />
              <div>
                <h3 className="text-lg font-semibold">Conversion</h3>
                <p className="text-sm text-gray-600">Conversion rate</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              {getTrendIcon('up')}
              <span className="text-sm text-green-500">15%</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-orange-600">3.2%</div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">AI Insights</h3>
        <div className="space-y-4">
          {insights.map((insight) => (
            <div key={insight.id} className={`border-l-4 p-4 ${
              insight.impact === 'positive' ? 'border-green-500 bg-green-50' :
              insight.impact === 'negative' ? 'border-red-500 bg-red-50' :
              'border-blue-500 bg-blue-50'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{insight.title}</h4>
                <span className={`text-sm px-2 py-1 rounded ${
                  insight.confidence > 80 ? 'bg-green-100 text-green-700' :
                  insight.confidence > 60 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {insight.confidence}% confidence
                </span>
              </div>
              <p className="text-sm text-gray-700 mb-3">{insight.description}</p>
              <div className="space-y-2">
                <h5 className="text-sm font-medium">Recommendations:</h5>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  {insight.recommendations.map((rec: string, index: number) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderWidgets = () => (
    <div className="space-y-6">
      {/* Add Widget Form */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Add Widget</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Widget Type</label>
            <select
              value={widgetForm.type}
              onChange={(e) => setWidgetForm({...widgetForm, type: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="user_metrics">User Metrics</option>
              <option value="performance_metrics">Performance Metrics</option>
              <option value="content_analytics">Content Analytics</option>
              <option value="engagement_analytics">Engagement Analytics</option>
              <option value="conversion_analytics">Conversion Analytics</option>
              <option value="behavioral_analytics">Behavioral Analytics</option>
              <option value="system_health">System Health</option>
              <option value="real_time_monitoring">Real-time Monitoring</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={widgetForm.title}
              onChange={(e) => setWidgetForm({...widgetForm, title: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Widget title"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Chart Type</label>
            <select
              value={widgetForm.chartType}
              onChange={(e) => setWidgetForm({...widgetForm, chartType: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="line">Line Chart</option>
              <option value="bar">Bar Chart</option>
              <option value="pie">Pie Chart</option>
              <option value="area">Area Chart</option>
              <option value="scatter">Scatter Plot</option>
              <option value="gauge">Gauge</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Range</label>
            <select
              value={widgetForm.timeRange}
              onChange={(e) => setWidgetForm({...widgetForm, timeRange: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="hour">Last Hour</option>
              <option value="day">Last 24 Hours</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Refresh Rate (seconds)</label>
            <input
              type="number"
              value={widgetForm.refreshRate}
              onChange={(e) => setWidgetForm({...widgetForm, refreshRate: parseInt(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="10"
              max="3600"
            />
          </div>
        </div>

        <button
          onClick={handleAddWidget}
          disabled={!widgetForm.title}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Widget</span>
        </button>
      </div>

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {widgets.map((widget) => (
          <div key={widget.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getWidgetIcon(widget.type)}
                <div>
                  <h4 className="font-medium">{widget.title}</h4>
                  <p className="text-sm text-gray-600">{widget.type.replace('_', ' ').toUpperCase()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-500 hover:text-blue-500">
                  <Settings className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-500 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Widget Data Visualization */}
            <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">
                  {widget.data ? 'Data loaded' : 'Loading data...'}
                </p>
                {widget.data && (
                  <div className="mt-2 text-xs text-gray-400">
                    Last updated: {new Date(widget.data.lastUpdated).toLocaleString()}
                  </div>
                )}
              </div>
            </div>

            {/* Widget Metadata */}
            <div className="mt-4 pt-4 border-t">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Refresh Rate:</span>
                  <span className="text-gray-600">{widget.refreshRate}s</span>
                </div>
                <div>
                  <span className="font-medium">Records:</span>
                  <span className="text-gray-600">{widget.data?.metadata?.recordCount || 0}</span>
                </div>
                <div>
                  <span className="font-medium">Processing:</span>
                  <span className="text-gray-600">{widget.data?.metadata?.processingTime || 0}ms</span>
                </div>
                <div>
                  <span className="font-medium">Status:</span>
                  <span className={`${
                    widget.data?.metadata?.hasErrors ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {widget.data?.metadata?.hasErrors ? 'Error' : 'Healthy'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Generate Reports</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <select
              value="detailed"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="summary">Summary Report</option>
              <option value="detailed">Detailed Report</option>
              <option value="custom">Custom Report</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
            <select
              value="pdf"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => handleGenerateReport('pdf')}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center justify-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>PDF Report</span>
          </button>
          <button
            onClick={() => handleGenerateReport('excel')}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center justify-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Excel Report</span>
          </button>
          <button
            onClick={() => handleGenerateReport('csv')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>CSV Report</span>
          </button>
          <button
            onClick={() => handleGenerateReport('json')}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 flex items-center justify-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>JSON Report</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderRealTime = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Real-time Monitoring</h3>
        
        {/* System Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {realTimeData.map((metric) => (
            <div key={metric.metric} className="bg-white border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    metric.status === 'normal' ? 'bg-green-500' :
                    metric.status === 'warning' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`} />
                  <span className="text-sm font-medium capitalize">{metric.metric.replace('_', ' ')}</span>
                </div>
                <span className={`text-sm ${getStatusColor(metric.status)}`}>
                  {metric.status.toUpperCase()}
                </span>
              </div>
            </div>
              <div className="text-2xl font-bold">
                {metric.value}
                {metric.metric.includes('usage') ? '%' : 
                 metric.metric.includes('time') ? 'ms' : 
                 metric.metric.includes('users') ? '' : '/s'}
              </div>
              {metric.threshold && (
                <div className="mt-2">
                  <div className="text-xs text-gray-500">Threshold: {metric.threshold}</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        metric.status === 'normal' ? 'bg-green-500' :
                        metric.status === 'warning' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`} 
                      style={{ width: `${Math.min(100, (metric.value / metric.threshold) * 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Alerts */}
        <div className="border-t pt-4">
          <h4 className="font-medium mb-4">System Alerts</h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-red-50 border border-red-200 rounded">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <div>
                <div className="font-medium text-red-700">High CPU Usage</div>
                <div className="text-sm text-red-600">CPU usage exceeded 80% threshold</div>
                <div className="text-xs text-red-500 mt-1">2 minutes ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg h-full flex flex-col">
      <div className="border-b border-gray-200">
        <div className="flex items-center p-4">
          <BarChart3 className="w-6 h-6 text-blue-500 mr-2" />
          <h2 className="text-xl font-bold">Analytics Dashboard</h2>
        </div>

        <div className="flex space-x-1 px-4">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'widgets', label: 'Widgets', icon: Layout },
            { id: 'reports', label: 'Reports', icon: FileText },
            { id: 'realtime', label: 'Real-time', icon: Activity }
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
        {/* Time Range Selector */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Calendar className="w-4 h-4 text-gray-500" />
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
          </div>
          
          <button
            onClick={handleRefreshData}
            disabled={isRefreshing}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh Data'}</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'widgets' && renderWidgets()}
        {activeTab === 'reports' && renderReports()}
        {activeTab === 'realtime' && renderRealTime()}
      </div>
    </div>
  );
};

export default AnalyticsDashboardPanel;
