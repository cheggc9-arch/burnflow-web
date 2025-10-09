import { startBackgroundJob } from '@/utils/cache';
import { startBurnBackgroundJob } from '@/utils/burn-background-job';

// Initialize background job when the server starts
if (typeof window === 'undefined') {
  // Only run on server side
  startBackgroundJob();
  
  // Start burn background job
  startBurnBackgroundJob();
}
