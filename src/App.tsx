import { useState, useEffect } from 'react';
import { LayoutDashboard, TrendingUp, Send, Brain, Wifi } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { StrategyAlerts } from './components/StrategyAlerts';
import { ManualTrades } from './components/ManualTrades';
import { AIStrategyBuilder } from './components/AIStrategyBuilder';

type View = 'dashboard' | 'alerts' | 'manual' | 'ai';

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsConnected(true), 500);
  }, []);

  const menuItems = [
    { id: 'dashboard' as View, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'alerts' as View, label: 'Strategy Alerts', icon: TrendingUp },
    { id: 'manual' as View, label: 'Manual Trades', icon: Send },
    { id: 'ai' as View, label: 'AI Strategy Builder', icon: Brain }
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="flex h-screen">
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">CryptoAgent</h1>
                <p className="text-xs text-gray-500">Trading Platform</p>
              </div>
            </div>
          </div>

          <div className="p-4 border-b border-gray-200">
            <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${isConnected ? 'bg-green-50 border border-green-200' : 'bg-gray-100'}`}>
              <Wifi className={`w-4 h-4 ${isConnected ? 'text-green-600' : 'text-gray-400'}`} />
              <span className={`text-sm font-medium ${isConnected ? 'text-green-700' : 'text-gray-600'}`}>
                {isConnected ? 'Connected' : 'Connecting...'}
              </span>
              {isConnected && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse ml-auto" />}
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">System Status</h3>
              <p className="text-xs text-gray-600">All modules operational</p>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-gray-600">Uptime</span>
                <span className="text-green-600 font-semibold">99.9%</span>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-8">
            {currentView === 'dashboard' && <Dashboard />}
            {currentView === 'alerts' && <StrategyAlerts />}
            {currentView === 'manual' && <ManualTrades />}
            {currentView === 'ai' && <AIStrategyBuilder />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
