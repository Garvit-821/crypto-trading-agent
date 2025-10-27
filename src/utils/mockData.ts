// Define TypeScript interfaces for exported data
export interface StrategyMetric {
  id: number;
  name: string;
  accuracy: number;
  winRate: number;
  drawdown: number;
  profitRatio: number;
  totalTrades: number;
  color: string;
}

export interface ChartDataPoint {
  date: string;
  value: number;
}

export const STRATEGY_METRICS: StrategyMetric[] = [
  {
    id: 1,
    name: 'EMA Crossover',
    accuracy: 78.5,
    winRate: 72.3,
    drawdown: -12.4,
    profitRatio: 2.8,
    totalTrades: 245,
    color: '#3b82f6', // blue
  },
  {
    id: 2,
    name: 'RSI Oversold/Overbought',
    accuracy: 82.1,
    winRate: 76.8,
    drawdown: -9.8,
    profitRatio: 3.2,
    totalTrades: 198,
    color: '#10b981', // green
  },
  {
    id: 3,
    name: 'MACD Signal',
    accuracy: 75.6,
    winRate: 68.9,
    drawdown: -15.2,
    profitRatio: 2.5,
    totalTrades: 312,
    color: '#f59e0b', // yellow
  },
  {
    id: 4,
    name: 'Bollinger Bands',
    accuracy: 80.3,
    winRate: 74.5,
    drawdown: -11.1,
    profitRatio: 2.9,
    totalTrades: 276,
    color: '#8b5cf6', // purple
  },
];

export const generateChartData = (points: number): ChartDataPoint[] => {
  const data: ChartDataPoint[] = [];
  let value = 10000;
  
  for (let i = 0; i < points; i++) {
    const change = (Math.random() - 0.45) * 500; // Slight upward bias
    value += change;
    
    data.push({
      date: new Date(Date.now() - (points - i) * 24 * 60 * 60 * 1000)
        .toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: Math.round(value),
    });
  }
  
  return data;
};

