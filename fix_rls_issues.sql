-- Complete Fix for RLS Issues
-- Run this entire script in Supabase SQL Editor

-- ============================================
-- 1. Fix price_alerts table
-- ============================================

-- Drop table if exists and recreate (only if you're okay losing data)
-- Otherwise, just ensure it exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'price_alerts'
    ) THEN
        CREATE TABLE price_alerts (
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
    END IF;
END $$;

-- Enable RLS
ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies on price_alerts
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'price_alerts') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON price_alerts';
    END LOOP;
END $$;

-- Create new policies for price_alerts
CREATE POLICY "price_alerts_select_policy"
    ON price_alerts FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "price_alerts_insert_policy"
    ON price_alerts FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "price_alerts_update_policy"
    ON price_alerts FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "price_alerts_delete_policy"
    ON price_alerts FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- ============================================
-- 2. Fix manual_trades RLS policies
-- ============================================

-- Ensure manual_trades has RLS enabled
ALTER TABLE manual_trades ENABLE ROW LEVEL SECURITY;

-- Drop existing policies that might conflict
DROP POLICY IF EXISTS "Allow authenticated insert to manual_trades" ON manual_trades;
DROP POLICY IF EXISTS "Allow authenticated read to manual_trades" ON manual_trades;
DROP POLICY IF EXISTS "Allow public insert to manual_trades" ON manual_trades;

-- Create comprehensive policies for manual_trades
-- Allow both authenticated and anonymous users to read (for public feed)
CREATE POLICY "manual_trades_select_anon_policy"
    ON manual_trades FOR SELECT
    TO anon
    USING (true);

CREATE POLICY "manual_trades_select_authenticated_policy"
    ON manual_trades FOR SELECT
    TO authenticated
    USING (true);

-- Allow authenticated users to insert (for admin)
CREATE POLICY "manual_trades_insert_authenticated_policy"
    ON manual_trades FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Keep anonymous insert for backward compatibility if needed
CREATE POLICY "manual_trades_insert_anon_policy"
    ON manual_trades FOR INSERT
    TO anon
    WITH CHECK (true);

-- ============================================
-- 3. Create indexes for performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_price_alerts_user_id ON price_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_price_alerts_status ON price_alerts(status);
CREATE INDEX IF NOT EXISTS idx_price_alerts_created_at ON price_alerts(created_at DESC);

-- ============================================
-- 4. Verify tables exist and show policies
-- ============================================

-- Check if tables exist
SELECT 
    'price_alerts' as table_name,
    EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'price_alerts'
    ) as exists;

SELECT 
    'manual_trades' as table_name,
    EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'manual_trades'
    ) as exists;

-- Show current policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('price_alerts', 'manual_trades')
ORDER BY tablename, policyname;

