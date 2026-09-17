'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/lib/store/useAppStore';
import { generateTxId } from '@/lib/utils/transactionId';
import { api } from '@/lib/api/client';

export interface VaultItem {
  id: string;
  title: string;
  item_type: string;
  organization_name?: string;
  description?: string;
  verified: boolean;
  ai_confidence_score: number;
  skill_tags: string[];
  is_public: boolean;
  used_in_resume?: boolean;
  used_in_portfolio?: boolean;
}

export interface UseVaultOptions {
  userId?: string;
  onAddXp?: (amount: number, reason: string) => void;
  onEarnPins?: (source: 'vault_verify') => void;
}

export function useVault(options: UseVaultOptions = {}) {
  const { userId = 'guest', onAddXp, onEarnPins } = options;
  const storageKey = `pinit_vault_${userId}`;

  const [vaultItems, setVaultItemsState] = useState<VaultItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setVaultItemsState(parsed);
        }
      }
    } catch {
      // Fallback to empty
    } finally {
      setIsLoaded(true);
    }
  }, [storageKey]);

  // Hydrate from Supabase on mount
  useEffect(() => {
    if (!userId || userId === 'guest') return;
    supabase.from('vault_items').select('*').eq('user_id', userId).then(({ data }) => {
      if (data) {
        setVaultItemsState(data.filter((item: any) => item.item_type !== 'campus_kv'));
      }
    });
  }, [userId]);

  // Persist helper
  const saveVault = useCallback((items: VaultItem[]) => {
    setVaultItemsState(items);
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch {
      // Ignore storage errors
    }
  }, [storageKey]);

  const setVaultItems = useCallback((items: VaultItem[]) => {
    saveVault(items);
  }, [saveVault]);

  const addVaultItem = useCallback(async (item: {
    id?: string;
    title: string;
    item_type: string;
    organization_name?: string;
    description?: string;
    skill_tags?: string[];
    verified?: boolean;
    ai_confidence_score?: number;
  }) => {
    const tempId = item.id || generateTxId('vlt');
    const newItem: VaultItem = {
      id: tempId,
      title: item.title,
      item_type: item.item_type,
      organization_name: item.organization_name || '',
      description: item.description || '',
      verified: item.verified ?? false,
      ai_confidence_score: item.ai_confidence_score ?? 0,
      skill_tags: item.skill_tags || [],
      is_public: false,
      used_in_resume: false,
      used_in_portfolio: false,
    };

    const updated = [newItem, ...vaultItems];
    saveVault(updated);

    toast.success('🔒 Added to Vault', `"${item.title}" saved securely.`);

    const isRealUserUUID = typeof userId === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);
    if (userId !== 'guest' && isRealUserUUID) {
      try {
        const { data, error } = await supabase
          .from('vault_items')
          .insert([{
            user_id: userId,
            title: item.title,
            item_type: item.item_type,
            organization_name: item.organization_name || '',
            description: item.description || 'Uploaded document.',
            verified: false,
            ai_confidence_score: newItem.ai_confidence_score,
            skill_tags: item.skill_tags || [],
            is_public: false,
          }])
          .select();

        if (!error && data && data.length > 0) {
          const dbItem = data[0];
          const remapped = updated.map(v => v.id === tempId ? { ...v, id: dbItem.id } : v);
          saveVault(remapped);
        }
      } catch (e) {
        console.error('Failed to sync vault item to database:', e);
      }
    }
  }, [vaultItems, userId, saveVault]);

  const updateVaultItem = useCallback((id: string, updates: Partial<VaultItem>) => {
    const updated = vaultItems.map(item => {
      if (item.id !== id) return item;
      const merged = { ...item, ...updates };
      if (updates.verified && !item.verified) {
        toast.success('✓ Proof Verified', `"${item.title}" is officially verified!`);
        if (onAddXp) onAddXp(20, 'Proof Verified');
        if (onEarnPins) onEarnPins('vault_verify');
      }
      return merged;
    });
    saveVault(updated);
  }, [vaultItems, onAddXp, onEarnPins, saveVault]);

  const removeVaultItem = useCallback((id: string) => {
    const itemToDelete = vaultItems.find(item => item.id === id);
    const updated = vaultItems.filter(item => item.id !== id);
    saveVault(updated);
    toast.info('Item Removed', 'Vault item deleted.');

    if (userId && userId !== 'guest') {
      api.post('/api/vault/delete', {
        documentId: id,
        storageUrl: (itemToDelete as any)?.storage_url || (itemToDelete as any)?.storageUrl,
      }).catch((err) => {
        console.warn('Failed to purge vault document file via /api/vault/delete, attempting fallback delete:', err);
        supabase
          .from('vault_items')
          .delete()
          .eq('id', id)
          .then(({ error }) => {
            if (error) {
              console.error('Failed to delete vault item from Supabase:', error.message);
            }
          });
      });
    }
  }, [vaultItems, userId, saveVault]);

  const verifiedCount = useMemo(() => {
    return vaultItems.filter(v => v.verified).length;
  }, [vaultItems]);

  return {
    vaultItems,
    setVaultItems,
    addVaultItem,
    updateVaultItem,
    removeVaultItem,
    verifiedCount,
    isLoaded,
  };
}
