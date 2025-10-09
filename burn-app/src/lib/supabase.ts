import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env file');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types for burn records
export interface Database {
  public: {
    Tables: {
      burn_records: {
        Row: {
          id: number;
          timestamp: string;
          sol_amount: number;
          tokens_burned: number;
          buy_signature: string | null;
          burn_signature: string | null;
                      status: 'success' | 'failed' | 'pending' | 'buy_only';
          burn_wallet_address: string;
          token_contract_address: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          timestamp?: string;
          sol_amount: number;
          tokens_burned: number;
          buy_signature?: string | null;
          burn_signature?: string | null;
                      status: 'success' | 'failed' | 'pending' | 'buy_only';
          burn_wallet_address: string;
          token_contract_address: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          timestamp?: string;
          sol_amount?: number;
          tokens_burned?: number;
          buy_signature?: string | null;
          burn_signature?: string | null;
          status?: 'success' | 'failed' | 'pending';
          burn_wallet_address?: string;
          token_contract_address?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

// Helper functions for burn records
export const burnRecords = {
  // Get all burn records
  async getAll() {
    const { data, error } = await supabase
      .from('burn_records')
      .select('*')
      .order('timestamp', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Get burn statistics
  async getStats() {
    const { data, error } = await supabase
      .from('burn_records')
      .select('sol_amount, tokens_burned, status')
      .eq('status', 'success');
    
    if (error) throw error;
    
    const totalBurned = data?.reduce((sum, record) => sum + record.tokens_burned, 0) || 0;
    const totalBurns = data?.length || 0;
    const totalSolUsed = data?.reduce((sum, record) => sum + record.sol_amount, 0) || 0;
    
    return {
      totalBurned,
      totalBurns,
      totalSolUsed
    };
  },

  // Add a new burn record
  async add(record: Database['public']['Tables']['burn_records']['Insert']) {
    const { data, error } = await supabase
      .from('burn_records')
      .insert(record)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update burn record status
  async updateStatus(id: number, status: 'success' | 'failed' | 'pending') {
    const { data, error } = await supabase
      .from('burn_records')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};
