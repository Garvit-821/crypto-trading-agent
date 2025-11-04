-- Migration: Fix RLS policies for manual_trades and ensure price_alerts table exists
-- This fixes the issues with creating alerts and manual trades for authenticated users

-- Ensure price_alerts table exists (in case migration wasn't run)
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

-- Enable RLS on price_alerts if not already enabled
ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies on price_alerts if they exist and recreate them
DROP POLICY IF EXISTS "Users can view their own alerts" ON price_alerts;
DROP POLICY IF EXISTS "Users can insert their own alerts" ON price_alerts;
DROP POLICY IF EXISTS "Users can update their own alerts" ON price_alerts;
DROP POLICY IF EXISTS "Users can delete their own alerts" ON price_alerts;

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

-- Add authenticated user policies for manual_trades
-- (Allowing both anon and authenticated to maintain backward compatibility)
DROP POLICY IF EXISTS "Allow authenticated insert to manual_trades" ON manual_trades;
DROP POLICY IF EXISTS "Allow authenticated read to manual_trades" ON manual_trades;

-- Allow authenticated users to insert into manual_trades (for admin)
CREATE POLICY "Allow authenticated insert to manual_trades"
  ON manual_trades FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to read manual_trades
CREATE POLICY "Allow authenticated read to manual_trades"
  ON manual_trades FOR SELECT
  TO authenticated
  USING (true);

-- Create index on price_alerts if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_price_alerts_user_id ON price_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_price_alerts_status ON price_alerts(status);

