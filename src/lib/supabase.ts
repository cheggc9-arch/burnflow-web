import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env file');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      distributions: {
        Row: {
          id: number;
          timestamp: string;
          total_distributed: number;
          recipients_count: number;
          transactions_count: number;
          failed_transactions: number;
          transactions: any; // JSON array
          treasury_balance: number;
          status: 'success' | 'failed' | 'partial' | 'threshold_not_met';
          created_at: string;
        };
        Insert: {
          id?: number;
          timestamp: string;
          total_distributed: number;
          recipients_count: number;
          transactions_count: number;
          failed_transactions: number;
          transactions: any;
          treasury_balance: number;
          status: 'success' | 'failed' | 'partial' | 'threshold_not_met';
          created_at?: string;
        };
        Update: {
          id?: number;
          timestamp?: string;
          total_distributed?: number;
          recipients_count?: number;
          transactions_count?: number;
          failed_transactions?: number;
          transactions?: any;
          treasury_balance?: number;
          status?: 'success' | 'failed' | 'partial' | 'threshold_not_met';
          created_at?: string;
        };
      };
      token_metadata: {
        Row: {
          id: number;
          token_address: string;
          launch_time: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          token_address: string;
          launch_time?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          token_address?: string;
          launch_time?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
