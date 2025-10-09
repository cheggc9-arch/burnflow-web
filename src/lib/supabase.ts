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
      burn_records: {
        Row: {
          id: number;
          timestamp: string;
          sol_amount: number;
          tokens_burned: number;
          buy_signature: string | null;
          burn_signature: string | null;
          status: 'success' | 'failed' | 'buy_only';
          burn_wallet_address: string;
          token_contract_address: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          timestamp: string;
          sol_amount: number;
          tokens_burned: number;
          buy_signature?: string | null;
          burn_signature?: string | null;
          status: 'success' | 'failed' | 'buy_only';
          burn_wallet_address: string;
          token_contract_address: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          timestamp?: string;
          sol_amount?: number;
          tokens_burned?: number;
          buy_signature?: string | null;
          burn_signature?: string | null;
          status?: 'success' | 'failed' | 'buy_only';
          burn_wallet_address?: string;
          token_contract_address?: string;
          created_at?: string;
        };
      };
    };
  };
}

// Burn records functionality
export const burnRecords = {
  async add(record: Database['public']['Tables']['burn_records']['Insert']) {
    const { data, error } = await supabase
      .from('burn_records')
      .insert(record)
      .select()
      .single();
    
    if (error) {
      console.error('Error adding burn record:', error);
      throw error;
    }
    
    return data;
  },

  async getAll() {
    const { data, error } = await supabase
      .from('burn_records')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching burn records:', error);
      throw error;
    }
    
    return data || [];
  },

  async getStats() {
    const { data, error } = await supabase
      .from('burn_records')
      .select('sol_amount, tokens_burned');
    
    if (error) {
      console.error('Error fetching burn stats:', error);
      throw error;
    }
    
    const totalBurns = data?.length || 0;
    const totalBurned = data?.reduce((sum, record) => sum + (record.tokens_burned || 0), 0) || 0;
    const totalSolUsed = data?.reduce((sum, record) => sum + (record.sol_amount || 0), 0) || 0;
    
    return {
      totalBurns,
      totalBurned,
      totalSolUsed
    };
  }
};
