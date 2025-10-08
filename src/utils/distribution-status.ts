/**
 * Shared distribution status management
 * This module manages the global distribution running state
 */

let isDistributionRunning = false;

export function setDistributionRunning(running: boolean): void {
  isDistributionRunning = running;
  console.log(`🔄 Distribution status updated: ${running ? 'RUNNING' : 'STOPPED'}`);
}

export function getDistributionRunning(): boolean {
  return isDistributionRunning;
}

export function isDistributionCurrentlyRunning(): boolean {
  return isDistributionRunning;
}
