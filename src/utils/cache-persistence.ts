import fs from 'fs';
import path from 'path';

const CACHE_FILE = path.join(process.cwd(), '.cache.json');

export interface CacheData {
  treasuryBalance: number;
  activeHolders: number;
  lastUpdated: number;
  isUpdating: boolean;
  lastDistributionTime: number;
}

// Load cache from file
export function loadCacheFromFile(): CacheData | null {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const data = fs.readFileSync(CACHE_FILE, 'utf8');
      const cache = JSON.parse(data);
      return cache;
    }
  } catch (error) {
    console.error('Error loading cache from file:', error);
  }
  return null;
}

// Save cache to file
export function saveCacheToFile(cache: CacheData): void {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
  } catch (error) {
    console.error('Error saving cache to file:', error);
  }
}
