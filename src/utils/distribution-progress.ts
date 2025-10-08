/**
 * Distribution progress tracking utility
 * Manages real-time progress updates during distribution processing
 */

interface BatchProgress {
  batchIndex: number;
  totalBatches: number;
  batchSize: number;
  currentTransaction: number;
  totalTransactions: number;
  completedTransactions: number;
  failedTransactions: number;
  startTime: number;
  estimatedTimeRemaining?: number;
}

interface DistributionProgress {
  isRunning: boolean;
  currentBatch?: BatchProgress;
  totalBatches: number;
  totalTransactions: number;
  completedTransactions: number;
  failedTransactions: number;
  startTime: number;
  estimatedCompletion?: number;
}

class DistributionProgressTracker {
  private progress: DistributionProgress = {
    isRunning: false,
    totalBatches: 0,
    totalTransactions: 0,
    completedTransactions: 0,
    failedTransactions: 0,
    startTime: 0,
  };

  private listeners: Array<(progress: DistributionProgress) => void> = [];

  startDistribution(totalBatches: number, totalTransactions: number) {
    this.progress = {
      isRunning: true,
      totalBatches,
      totalTransactions,
      completedTransactions: 0,
      failedTransactions: 0,
      startTime: Date.now(),
    };
    this.notifyListeners();
  }

  updateBatchProgress(batchIndex: number, batchSize: number, currentTransaction: number, completed: number, failed: number) {
    if (!this.progress.isRunning) return;

    this.progress.currentBatch = {
      batchIndex: batchIndex + 1, // 1-based for display
      totalBatches: this.progress.totalBatches,
      batchSize,
      currentTransaction: currentTransaction + 1, // 1-based for display
      totalTransactions: this.progress.totalTransactions,
      completedTransactions: completed,
      failedTransactions: failed,
      startTime: this.progress.startTime,
    };

    this.progress.completedTransactions = completed;
    this.progress.failedTransactions = failed;

    // Calculate estimated completion time
    const elapsed = Date.now() - this.progress.startTime;
    const progressPercentage = completed / this.progress.totalTransactions;
    
    if (progressPercentage > 0) {
      const estimatedTotal = elapsed / progressPercentage;
      this.progress.estimatedCompletion = this.progress.startTime + estimatedTotal;
      
      if (this.progress.currentBatch) {
        this.progress.currentBatch.estimatedTimeRemaining = estimatedTotal - elapsed;
      }
    }

    this.notifyListeners();
  }

  completeDistribution() {
    this.progress.isRunning = false;
    this.progress.currentBatch = undefined;
    this.notifyListeners();
  }

  getProgress(): DistributionProgress {
    return { ...this.progress };
  }

  addListener(listener: (progress: DistributionProgress) => void) {
    this.listeners.push(listener);
  }

  removeListener(listener: (progress: DistributionProgress) => void) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener({ ...this.progress }));
  }
}

// Global progress tracker instance
export const distributionProgress = new DistributionProgressTracker();

// Export types for use in components
export type { DistributionProgress, BatchProgress };
