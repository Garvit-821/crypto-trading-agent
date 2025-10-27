import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface StrategyAlert {
  id: string;
  coin_name: string;
  condition_type: string;
  condition_message: string;
  entry_price: number;
  stop_loss: number;
  target_price: number;
  status: string;
  created_at: string;
}

export interface ManualTrade {
  id: string;
  coin_name: string;
  entry_price: number;
  stop_loss: number;
  target_price: number;
  message: string;
  created_at: string;
}

export interface AIStrategy {
  id: string;
  strategy_name: string;
  accuracy: number;
  drawdown: number;
  profit_ratio: number;
  trades_count: number;
  win_rate: number;
  updated_at: string;
}
