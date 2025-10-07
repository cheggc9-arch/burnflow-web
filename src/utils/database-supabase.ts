import { supabase } from '@/lib/supabase';

export interface DistributionTransaction {
  recipient: string;
  amount: number;
  signature: string;
  weightage: number;
  error?: string;
}

export interface DistributionRecord {
  id: number;
  timestamp: string;
  totalDistributed: number;
  recipientsCount: number;
  transactionsCount: number;
  failedTransactions: number;
  transactions: DistributionTransaction[];
  treasuryBalance: number;
  status: 'success' | 'failed' | 'partial' | 'threshold_not_met';
}

// Save distribution record to Supabase
export async function saveDistributionRecord(record: Omit<DistributionRecord, 'id'>): Promise<DistributionRecord> {
  try {
    const { data, error } = await supabase
      .from('distributions')
      .insert({
        timestamp: record.timestamp,
        total_distributed: record.totalDistributed,
        recipients_count: record.recipientsCount,
        transactions_count: record.transactionsCount,
        failed_transactions: record.failedTransactions,
        transactions: record.transactions,
        treasury_balance: record.treasuryBalance,
        status: record.status
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving distribution record to Supabase:', error);
      throw error;
    }

    const newRecord: DistributionRecord = {
      id: data.id,
      timestamp: data.timestamp,
      totalDistributed: data.total_distributed,
      recipientsCount: data.recipients_count,
      transactionsCount: data.transactions_count,
      failedTransactions: data.failed_transactions,
      transactions: data.transactions,
      treasuryBalance: data.treasury_balance,
      status: data.status
    };

    console.log(`💾 Saved distribution #${data.id} to Supabase database`);
    return newRecord;
  } catch (error) {
    console.error('Error saving distribution record:', error);
    throw error;
  }
}

// Get recent distributions from Supabase
export async function getRecentDistributions(limit: number = 10): Promise<DistributionRecord[]> {
  try {
    const { data, error } = await supabase
      .from('distributions')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recent distributions from Supabase:', error);
      throw error;
    }

    return data.map(record => ({
      id: record.id,
      timestamp: record.timestamp,
      totalDistributed: record.total_distributed,
      recipientsCount: record.recipients_count,
      transactionsCount: record.transactions_count,
      failedTransactions: record.failed_transactions,
      transactions: record.transactions,
      treasuryBalance: record.treasury_balance,
      status: record.status
    }));
  } catch (error) {
    console.error('Error fetching recent distributions:', error);
    throw error;
  }
}

// Get all distributions from Supabase
export async function getAllDistributions(): Promise<DistributionRecord[]> {
  try {
    const { data, error } = await supabase
      .from('distributions')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching all distributions from Supabase:', error);
      throw error;
    }

    return data.map(record => ({
      id: record.id,
      timestamp: record.timestamp,
      totalDistributed: record.total_distributed,
      recipientsCount: record.recipients_count,
      transactionsCount: record.transactions_count,
      failedTransactions: record.failed_transactions,
      transactions: record.transactions,
      treasuryBalance: record.treasury_balance,
      status: record.status
    }));
  } catch (error) {
    console.error('Error fetching all distributions:', error);
    throw error;
  }
}

// Get distribution by ID
export async function getDistributionById(id: number): Promise<DistributionRecord | null> {
  try {
    const { data, error } = await supabase
      .from('distributions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      console.error('Error fetching distribution by ID from Supabase:', error);
      throw error;
    }

    return {
      id: data.id,
      timestamp: data.timestamp,
      totalDistributed: data.total_distributed,
      recipientsCount: data.recipients_count,
      transactionsCount: data.transactions_count,
      failedTransactions: data.failed_transactions,
      transactions: data.transactions,
      treasuryBalance: data.treasury_balance,
      status: data.status
    };
  } catch (error) {
    console.error('Error fetching distribution by ID:', error);
    throw error;
  }
}

// Get distribution count
export async function getDistributionCount(): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('distributions')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Error fetching distribution count from Supabase:', error);
      throw error;
    }

    return count || 0;
  } catch (error) {
    console.error('Error fetching distribution count:', error);
    throw error;
  }
}
