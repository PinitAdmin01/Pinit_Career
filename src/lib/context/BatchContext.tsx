'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DB } from '@/lib/dsaiFirebase';

export interface Batch {
  id?: string;
  name: string;
  color: string;
  order?: number;
}

export const DEFAULT_BATCHES: Batch[] = [
  { name: 'Batch 1', color: '#ea6c0a' },
  { name: 'Batch 2', color: '#059669' },
  { name: 'Batch 3', color: '#7c3aed' },
  { name: 'Batch 4', color: '#d97706' },
  { name: 'Batch 5', color: '#dc2626' },
  { name: 'Batch 6', color: '#0891b2' },
];

interface BatchContextType {
  batches: Batch[];
  batchNames: string[];
  allBatchNames: string[];
  colorMap: Record<string, string>;
  reload: () => Promise<void>;
  loading: boolean;
}

const BatchContext = createContext<BatchContextType>({
  batches: DEFAULT_BATCHES,
  batchNames: DEFAULT_BATCHES.map(b => b.name),
  allBatchNames: ['All Batches', ...DEFAULT_BATCHES.map(b => b.name)],
  colorMap: Object.fromEntries(DEFAULT_BATCHES.map(b => [b.name, b.color])),
  reload: async () => {},
  loading: false,
});

export function BatchProvider({ children }: { children: React.ReactNode }) {
  const [batches, setBatches] = useState<Batch[]>(DEFAULT_BATCHES);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    try {
      const rows = await DB.getAll('batches');
      if (rows && rows.length > 0) {
        rows.sort((a: any, b: any) => (a.order ?? 999) - (b.order ?? 999) || a.name.localeCompare(b.name));
        setBatches(rows.map((r: any) => ({ id: r.id, name: r.name, color: r.color || '#ea6c0a', order: r.order })));
      } else {
        // Seed default batches into Firestore on first load
        const seeded: Batch[] = [];
        for (let i = 0; i < DEFAULT_BATCHES.length; i++) {
          const docId = await DB.save('batches', { 
            ...DEFAULT_BATCHES[i], 
            order: i, 
            createdAt: new Date().toISOString() 
          });
          seeded.push({ id: docId, ...DEFAULT_BATCHES[i], order: i });
        }
        setBatches(seeded);
      }
    } catch (e) {
      console.warn('BatchContext: could not load batches, using defaults', e);
      setBatches(DEFAULT_BATCHES);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const batchNames = batches.map(b => b.name);
  const allBatchNames = ['All Batches', ...batchNames];
  const colorMap = Object.fromEntries(batches.map(b => [b.name, b.color]));

  return (
    <BatchContext.Provider value={{ batches, batchNames, allBatchNames, colorMap, reload, loading }}>
      {children}
    </BatchContext.Provider>
  );
}

export function useBatches() {
  return useContext(BatchContext);
}
