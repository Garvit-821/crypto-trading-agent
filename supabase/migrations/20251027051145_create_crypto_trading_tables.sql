/*
  # Crypto Trading Agent Database Schema

  1. New Tables
    - `strategy_alerts`
      - `id` (uuid, primary key)
      - `coin_name` (text) - Cryptocurrency name (e.g., BTC/USDT)
      - `condition_type` (text) - Type of trigger (EMA crossover, RSI, MACD, etc.)
      - `condition_message` (text) - Human-readable trigger description
      - `entry_price` (numeric) - Entry price for the trade
      - `stop_loss` (numeric) - Stop loss price
      - `target_price` (numeric) - Target price
      - `status` (text) - Alert status (active, triggered, expired)
      - `created_at` (timestamptz) - Timestamp of alert creation
    
    - `manual_trades`
      - `id` (uuid, primary key)
      - `coin_name` (text) - Cryptocurrency name
      - `entry_price` (numeric) - Entry price
      - `stop_loss` (numeric) - Stop loss price
      - `target_price` (numeric) - Target price
      - `message` (text) - Custom message from admin
      - `created_at` (timestamptz) - Timestamp of trade post
    
    - `ai_strategies`
      - `id` (uuid, primary key)
      - `strategy_name` (text) - Strategy name (EMA, RSI, MACD, etc.)
      - `accuracy` (numeric) - Accuracy percentage
      - `drawdown` (numeric) - Maximum drawdown percentage
      - `profit_ratio` (numeric) - Profit ratio
      - `trades_count` (integer) - Number of trades in backtest
      - `win_rate` (numeric) - Win rate percentage
      - `updated_at` (timestamptz) - Last update timestamp
  
  2. Security
    - Enable RLS on all tables
    - Add policies for public read access (demo purposes)
    - Add policies for authenticated insert (for future admin features)
*/

-- Create strategy_alerts table
CREATE TABLE IF NOT EXISTS strategy_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coin_name text NOT NULL,
  condition_type text NOT NULL,
  condition_message text NOT NULL,
  entry_price numeric NOT NULL,
  stop_loss numeric NOT NULL,
  target_price numeric NOT NULL,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

-- Create manual_trades table
CREATE TABLE IF NOT EXISTS manual_trades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coin_name text NOT NULL,
  entry_price numeric NOT NULL,
  stop_loss numeric NOT NULL,
  target_price numeric NOT NULL,
  message text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create ai_strategies table
CREATE TABLE IF NOT EXISTS ai_strategies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  strategy_name text NOT NULL UNIQUE,
  accuracy numeric DEFAULT 0,
  drawdown numeric DEFAULT 0,
  profit_ratio numeric DEFAULT 0,
  trades_count integer DEFAULT 0,
  win_rate numeric DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE strategy_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE manual_trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_strategies ENABLE ROW LEVEL SECURITY;

-- Public read access for demo
CREATE POLICY "Allow public read access to strategy_alerts"
  ON strategy_alerts FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public read access to manual_trades"
  ON manual_trades FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public read access to ai_strategies"
  ON ai_strategies FOR SELECT
  TO anon
  USING (true);

-- Public insert for demo (no auth required)
CREATE POLICY "Allow public insert to strategy_alerts"
  ON strategy_alerts FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public insert to manual_trades"
  ON manual_trades FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public insert to ai_strategies"
  ON ai_strategies FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public update to ai_strategies"
  ON ai_strategies FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Insert initial AI strategy data
INSERT INTO ai_strategies (strategy_name, accuracy, drawdown, profit_ratio, trades_count, win_rate)
VALUES 
  ('EMA Crossover', 68.5, 12.3, 1.85, 127, 71.2),
  ('RSI Oversold/Overbought', 72.3, 8.7, 2.12, 98, 74.5),
  ('MACD Signal', 65.8, 15.2, 1.62, 156, 67.9),
  ('Bollinger Bands', 70.1, 10.5, 1.95, 112, 72.3)
ON CONFLICT (strategy_name) DO NOTHING;