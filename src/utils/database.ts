import fs from 'fs';
import path from 'path';

export interface DistributionTransaction {
  recipient: string;
  amount: number;
  signature: string;
  weightage: number;
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

export interface DistributionHistory {
  distributions: DistributionRecord[];
  lastId: number;
}

const DATABASE_FILE = path.join(process.cwd(), 'distribution-history.json');

// Initialize database if it doesn't exist
function initializeDatabase(): DistributionHistory {
  const defaultData: DistributionHistory = {
    distributions: [],
    lastId: 0
  };
  
  if (!fs.existsSync(DATABASE_FILE)) {
    fs.writeFileSync(DATABASE_FILE, JSON.stringify(defaultData, null, 2));
  }
  
  return defaultData;
}

// Load distribution history from database
export function loadDistributionHistory(): DistributionHistory {
  try {
    if (!fs.existsSync(DATABASE_FILE)) {
      return initializeDatabase();
    }
    
    const data = fs.readFileSync(DATABASE_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading distribution history:', error);
    return initializeDatabase();
  }
}

// Save distribution record to database
export function saveDistributionRecord(record: Omit<DistributionRecord, 'id'>): DistributionRecord {
  try {
    const history = loadDistributionHistory();
    const newId = history.lastId + 1;
    
    const newRecord: DistributionRecord = {
      id: newId,
      ...record
    };
    
    // Add to beginning of array (most recent first)
    history.distributions.unshift(newRecord);
    history.lastId = newId;
    
    // Keep only last 300 distributions (4 days worth: 4 days × 3 per hour × 24 hours = 288, rounded up to 300)
    if (history.distributions.length > 300) {
      history.distributions = history.distributions.slice(0, 300);
    }
    
    fs.writeFileSync(DATABASE_FILE, JSON.stringify(history, null, 2));
    
    console.log(`💾 Saved distribution #${newId} to database`);
    return newRecord;
  } catch (error) {
    console.error('Error saving distribution record:', error);
    throw error;
  }
}

// Get recent distributions (for API)
export function getRecentDistributions(limit: number = 10): DistributionRecord[] {
  const history = loadDistributionHistory();
  return history.distributions.slice(0, limit);
}

// Get all distributions (for full history)
export function getAllDistributions(): DistributionRecord[] {
  const history = loadDistributionHistory();
  return history.distributions;
}