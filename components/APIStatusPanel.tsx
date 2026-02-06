import React from 'react';
import { getAPIStatus } from '../services/smartGeminiService';

interface APIStatus {
  name: string;
  isActive: boolean;
  hasKey: boolean;
  usage: {
    requestsToday: number;
    requestsPerDay: number;
    requestsThisMinute: number;
    requestsPerMinute: number;
    tokensThisMinute: number;
    tokensPerMinute: number;
  };
  timeUntilReset: number;
  priority: number;
}

const APIStatusPanel: React.FC = () => {
  const [apiStatus, setApiStatus] = React.useState<APIStatus[]>([]);
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    const updateStatus = () => {
      setApiStatus(getAPIStatus());
    };

    updateStatus();
    const interval = setInterval(updateStatus, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const getUsageColor = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage >= 90) return 'text-red-400';
    if (percentage >= 70) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getUsagePercentage = (current: number, max: number) => {
    return Math.min((current / max) * 100, 100).toFixed(1);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-vip-800 text-white p-3 rounded-lg shadow-lg border border-vip-600 hover:bg-vip-700 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          <span className="text-sm font-medium">API Status</span>
        </div>
      </button>

      {isOpen && (
        <div className="absolute bottom-16 right-0 w-96 bg-vip-900 border border-vip-700 rounded-lg shadow-2xl p-4 max-h-96 overflow-y-auto">
          <h3 className="text-vip-gold font-bold mb-4 text-center">API Status Dashboard</h3>
          
          {apiStatus.map((api, index) => (
            <div key={api.name} className="mb-4 p-3 bg-vip-800 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    api.hasKey ? 'bg-green-400' : 'bg-gray-500'
                  }`}></div>
                  <span className="font-medium text-white">{api.name}</span>
                  {api.isActive && (
                    <span className="text-xs bg-vip-600 text-vip-gold px-2 py-1 rounded">Active</span>
                  )}
                </div>
                <span className="text-xs text-gray-400">Priority: {api.priority}</span>
              </div>

              {!api.hasKey && (
                <div className="text-xs text-yellow-400 mb-2">
                  ⚠️ No API key configured
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-400">Daily Usage:</span>
                  <div className="flex items-center gap-1">
                    <div className="flex-1 bg-vip-700 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-full transition-all ${getUsageColor(api.usage.requestsToday, api.usage.requestsPerDay)}`}
                        style={{ width: `${getUsagePercentage(api.usage.requestsToday, api.usage.requestsPerDay)}%` }}
                      ></div>
                    </div>
                    <span className={getUsageColor(api.usage.requestsToday, api.usage.requestsPerDay)}>
                      {api.usage.requestsToday}/{api.usage.requestsPerDay}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-gray-400">Minute Usage:</span>
                  <div className="flex items-center gap-1">
                    <div className="flex-1 bg-vip-700 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-full transition-all ${getUsageColor(api.usage.requestsThisMinute, api.usage.requestsPerMinute)}`}
                        style={{ width: `${getUsagePercentage(api.usage.requestsThisMinute, api.usage.requestsPerMinute)}%` }}
                      ></div>
                    </div>
                    <span className={getUsageColor(api.usage.requestsThisMinute, api.usage.requestsPerMinute)}>
                      {api.usage.requestsThisMinute}/{api.usage.requestsPerMinute}
                    </span>
                  </div>
                </div>

                <div className="col-span-2">
                  <span className="text-gray-400">Reset in: </span>
                  <span className="text-vip-gold font-medium">
                    {formatTime(api.timeUntilReset)}
                  </span>
                </div>
              </div>
            </div>
          ))}

          <div className="mt-4 pt-3 border-t border-vip-700 text-xs text-gray-400">
            <div className="mb-2">💡 <strong>Tips:</strong></div>
            <ul className="space-y-1">
              <li>• Add multiple API keys for automatic failover</li>
              <li>• Free tiers reset daily at midnight UTC</li>
              <li>• Monitor usage to avoid rate limits</li>
              <li>• Higher priority APIs are used first</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default APIStatusPanel;
