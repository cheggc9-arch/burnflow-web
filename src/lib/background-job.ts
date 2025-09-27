import { startBackgroundJob } from '@/utils/cache';

// Initialize background job when the server starts
if (typeof window === 'undefined') {
  // Only run on server side
  startBackgroundJob();
}
