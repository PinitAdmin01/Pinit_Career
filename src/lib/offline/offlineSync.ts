/**
 * PinIT Offline Proof-of-Work & Evidence Sync Service
 * Manages local client queueing and deterministic synchronization with the evidence ledger.
 */

import { PathwayApiService } from '../api/pathwayApi';

export type CreateEvidenceParams = Parameters<typeof PathwayApiService.recordEvidence>[0];

export interface PendingEvidenceQueueItem {
  id: string;
  payload: CreateEvidenceParams;
  queuedAt: number;
  retryCount: number;
}

export class OfflineSyncService {
  private static storageKey = 'pinit_offline_evidence_queue';
  private static inMemoryQueue: PendingEvidenceQueueItem[] = [];
  private static isSyncing = false;

  static enqueueEvidence(params: CreateEvidenceParams): void {
    const queue = this.getQueue();
    queue.push({
      id: `queue_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      payload: params,
      queuedAt: Date.now(),
      retryCount: 0,
    });
    this.saveQueue(queue);

    // If online, attempt immediate sync
    if (typeof navigator !== 'undefined' && navigator.onLine) {
      this.syncPendingRecords().catch(console.warn);
    }
  }

  static getQueue(): PendingEvidenceQueueItem[] {
    if (typeof window === 'undefined') return this.inMemoryQueue;
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : this.inMemoryQueue;
    } catch {
      return this.inMemoryQueue;
    }
  }

  private static saveQueue(queue: PendingEvidenceQueueItem[]): void {
    this.inMemoryQueue = queue;
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(queue));
    } catch (e) {
      console.warn('Failed to persist offline queue', e);
    }
  }

  /**
   * Drains the local queue and commits each pending record to PathwayApiService.
   */
  static async syncPendingRecords(): Promise<{ syncedCount: number; failedCount: number }> {
    if (this.isSyncing) return { syncedCount: 0, failedCount: 0 };
    this.isSyncing = true;

    const queue = this.getQueue();
    if (queue.length === 0) {
      this.isSyncing = false;
      return { syncedCount: 0, failedCount: 0 };
    }

    const remainingQueue: PendingEvidenceQueueItem[] = [];
    let syncedCount = 0;
    let failedCount = 0;

    for (const item of queue) {
      try {
        await PathwayApiService.recordEvidence(item.payload);
        syncedCount++;
      } catch (err) {
        console.warn(`Failed to sync queued evidence [${item.id}]:`, err);
        item.retryCount++;
        if (item.retryCount < 5) {
          remainingQueue.push(item);
        }
        failedCount++;
      }
    }

    this.saveQueue(remainingQueue);
    this.isSyncing = false;
    return { syncedCount, failedCount };
  }

  /**
   * Initializes automatic online event listener.
   */
  static initAutoSyncListener(): void {
    if (typeof window === 'undefined') return;
    window.addEventListener('online', () => {
      console.log('🌐 Connectivity restored: Syncing offline evidence queue...');
      this.syncPendingRecords().catch(console.warn);
    });
  }
}
