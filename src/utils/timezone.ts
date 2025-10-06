/**
 * Timezone utilities - All timestamps displayed in UTC to match Bitquery
 */

/**
 * Format a timestamp to UTC timezone with consistent formatting
 * Matches the timezone used by Bitquery API (UTC)
 */
export function formatUTCTime(timestamp: string | number | Date): string {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', { 
    timeZone: 'UTC',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  });
}

/**
 * Format a timestamp to UTC timezone (time only)
 * For use in timer displays
 */
export function formatUTCTimeOnly(timestamp: string | number | Date): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', { 
    timeZone: 'UTC',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  });
}

/**
 * Get current UTC timestamp
 * For consistent timestamp generation
 */
export function getCurrentUTCTimestamp(): number {
  return Date.now();
}

/**
 * Convert any timestamp to UTC ISO string
 * For API responses and database storage
 */
export function toUTCISOString(timestamp: string | number | Date): string {
  const date = new Date(timestamp);
  return date.toISOString();
}
