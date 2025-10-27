import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, Award, AlertTriangle, BarChart3, Sparkles } from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar 
} from 'recharts';
import { STRATEGY_METRICS, generateChartData } from '../utils/mockData';
import type { StrategyMetric } from '../utils/mockData';

// Define additional TypeScript interfaces
interface ChartData {
  date: string;
  value: number;
  strategy1?: number;
  strategy2?: number;
  strategy3?: number;
  strategy4?: number;
}

interface RadarData {
  metric: string;
  value: number;
}

export const AIStrategyBuilder: React.FC = () => {
  const [selectedStrategy, setSelectedStrategy] = useState<StrategyMetric>(STRATEGY_METRICS[0]);
  const [backtestData, setBacktestData] = useState<ChartData[]>([]);
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [trainingProgress, setTrainingProgress] = useState<number>(0);

  useEffect(() => {
    setBacktestData(generateChartData(60));
  }, []);

  useEffect(() => {
    if (isTraining) {
      const interval = setInterval(() => {
        setTrainingProgress(prev => {
          if (prev >= 100) {
            setIsTraining(false);
            return 0;
          }
          return prev + 2;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isTraining]);

  const radarData: RadarData[] = [
    { metric: 'Accuracy', value: selectedStrategy.accuracy },
    { metric: 'Win Rate', value: selectedStrategy.winRate },
    { metric: 'Risk Control', value: 100 - Math.abs(selectedStrategy.drawdown) * 5 },
    { metric: 'Profit Factor', value: selectedStrategy.profitRatio * 20 },
    { metric: 'Consistency', value: 75 },
  ];

  const comparisonData: ChartData[] = generateChartData(30).map((item: { date: string; value: number }) => ({
    ...item,
    strategy1: STRATEGY_METRICS[0].accuracy + (Math.random() - 0.5) * 20,
    strategy2: STRATEGY_METRICS[1].accuracy + (Math.random() - 0.5) * 20,
    strategy3: STRATEGY_METRICS[2].accuracy + (Math.random() - 0.5) * 20,
    strategy4: STRATEGY_METRICS[3].accuracy + (Math.random() - 0.5) * 20,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <Brain className="w-8 h-8 text-blue-600" />
            <span>AI Strategy Builder</span>
          </h2>
          <p className="text-gray-600 mt-1">Backtest, optimize, and deploy AI-powered trading strategies</p>
        </div>
        <button
          onClick={() => setIsTraining(true)}
          disabled={isTraining}
          className={`px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all flex items-center space-x-2 ${isTraining ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{isTraining ? `Training... ${trainingProgress}%` : 'Start Training'}</span>
        </button>
      </div>

      {/* Training Progress */}
      {isTraining && (
        <div className="bg-white border border-blue-200 rounded-lg p-6 shadow-sm fade-in">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-900">Training Neural Network...</span>
            <span className="text-sm text-blue-600">{trainingProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${trainingProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Strategy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {STRATEGY_METRICS.map((strategy: StrategyMetric) => (
          <div
            key={strategy.id}
            onClick={() => setSelectedStrategy(strategy)}
            className={`bg-white border rounded-lg p-6 cursor-pointer transition-all hover:shadow-md ${
              selectedStrategy.id === strategy.id
                ? 'ring-2 ring-blue-500 border-blue-200 shadow-md'
                : 'border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: strategy.color }}></div>
              <Brain className="w-5 h-5 text-gray-400" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">{strategy.name}</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Accuracy</span>
                <span className="text-green-600 font-medium">{strategy.accuracy}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Win Rate</span>
                <span className="text-blue-600 font-medium">{strategy.winRate}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Strategy Details */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          Strategy Details: {selectedStrategy.name}
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Award className="w-4 h-4 text-green-600" />
              <span className="text-xs text-gray-600">Accuracy</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{selectedStrategy.accuracy}%</p>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="text-xs text-gray-600">Max Drawdown</span>
            </div>
            <p className="text-2xl font-bold text-red-600">{selectedStrategy.drawdown}%</p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="text-xs text-gray-600">Profit Ratio</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">{selectedStrategy.profitRatio}x</p>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <BarChart3 className="w-4 h-4 text-yellow-600" />
              <span className="text-xs text-gray-600">Total Trades</span>
            </div>
            <p className="text-2xl font-bold text-yellow-600">{selectedStrategy.totalTrades}</p>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Strategy Performance Radar</h4>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="metric" stroke="#6b7280" style={{ fontSize: '12px' }} />
                <PolarRadiusAxis stroke="#6b7280" />
                <Radar
                  name={selectedStrategy.name}
                  dataKey="value"
                  stroke={selectedStrategy.color}
                  fill={selectedStrategy.color}
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Equity Curve</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={backtestData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  labelStyle={{ color: '#1f2937' }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={selectedStrategy.color}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Strategy Comparison */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Strategy Comparison</h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px' }} />
            <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              labelStyle={{ color: '#1f2937' }}
            />
            <Legend />
            {STRATEGY_METRICS.map((strategy: StrategyMetric, index: number) => (
              <Line
                key={strategy.id}
                type="monotone"
                dataKey={`strategy${index + 1}`}
                name={strategy.name}
                stroke={strategy.color}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Future Integration Placeholder */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-8 shadow-sm">
        <div className="flex items-start space-x-4">
          <div className="p-4 bg-blue-100 rounded-lg">
            <Sparkles className="w-8 h-8 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Future: Self-Learning AI Integration
            </h3>
            <p className="text-gray-700 mb-4">
              The next phase will include advanced machine learning capabilities:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                <span>Real-time strategy optimization using reinforcement learning</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                <span>Automated hyperparameter tuning with neural architecture search</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                <span>Market regime detection and adaptive strategy switching</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                <span>Sentiment analysis integration from news and social media</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};