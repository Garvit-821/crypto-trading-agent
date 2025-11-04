-- Migration: Multi-asset support and enhanced alerts system
-- Adds support for Crypto, Forex, and Indian Stocks (NSE/MCX)
-- Includes alerts system with Telegram integration

-- Add asset_type column to existing tables
ALTER TABLE strategy_alerts 
  ADD COLUMN IF NOT EXISTS asset_type TEXT DEFAULT 'crypto' CHECK (asset_type IN ('crypto', 'forex', 'stock', 'commodity')),
  ADD COLUMN IF NOT EXISTS exchange TEXT,
  ADD COLUMN IF NOT EXISTS telegram_sent BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS telegram_chat_id TEXT;

ALTER TABLE manual_trades
  ADD COLUMN IF NOT EXISTS asset_type TEXT DEFAULT 'crypto' CHECK (asset_type IN ('crypto', 'forex', 'stock', 'commodity')),
  ADD COLUMN IF NOT EXISTS exchange TEXT;

-- Create watchlist table
CREATE TABLE IF NOT EXISTS watchlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  asset_type TEXT NOT NULL CHECK (asset_type IN ('crypto', 'forex', 'stock', 'commodity')),
  exchange TEXT,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, symbol, asset_type, exchange)
);

-- Create alerts table (enhanced)
CREATE TABLE IF NOT EXISTS price_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  asset_type TEXT NOT NULL CHECK (asset_type IN ('crypto', 'forex', 'stock', 'commodity')),
  exchange TEXT,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('price_above', 'price_below', 'price_cross', 'manual')),
  target_price NUMERIC,
  condition_value NUMERIC,
  message TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'triggered', 'cancelled')),
  telegram_enabled BOOLEAN DEFAULT false,
  telegram_chat_id TEXT,
  triggered_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create market_data_cache table for TradingView requests
CREATE TABLE IF NOT EXISTS market_data_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol TEXT NOT NULL,
  asset_type TEXT NOT NULL,
  exchange TEXT,
  data JSONB NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(symbol, asset_type, exchange)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_watchlists_user_id ON watchlists(user_id);
CREATE INDEX IF NOT EXISTS idx_price_alerts_user_id ON price_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_price_alerts_status ON price_alerts(status);
CREATE INDEX IF NOT EXISTS idx_market_data_cache_symbol ON market_data_cache(symbol, asset_type, exchange);
CREATE INDEX IF NOT EXISTS idx_market_data_cache_expires ON market_data_cache(expires_at);

-- Enable RLS
ALTER TABLE watchlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_data_cache ENABLE ROW LEVEL SECURITY;

-- RLS Policies for watchlists
CREATE POLICY "Users can view their own watchlists"
  ON watchlists FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own watchlists"
  ON watchlists FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own watchlists"
  ON watchlists FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for price_alerts
CREATE POLICY "Users can view their own alerts"
  ON price_alerts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own alerts"
  ON price_alerts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own alerts"
  ON price_alerts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own alerts"
  ON price_alerts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for market_data_cache (public read, service role write)
CREATE POLICY "Allow public read access to market_data_cache"
  ON market_data_cache FOR SELECT
  TO anon
  USING (expires_at > now());

CREATE POLICY "Allow authenticated insert to market_data_cache"
  ON market_data_cache FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update to market_data_cache"
  ON market_data_cache FOR UPDATE
  TO authenticated
  USING (true);

-- Function to clean expired cache entries
CREATE OR REPLACE FUNCTION clean_expired_cache()
RETURNS void AS $$
BEGIN
  DELETE FROM market_data_cache WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql;

