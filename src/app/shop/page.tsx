'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useCareerOS } from '@/lib/context/CareerOSContext';
import { usePins } from '@/hooks/usePins';
import { useItemLocks } from '@/hooks/useItemLocks';
import { triggerCoinStream } from '@/components/pins/coinAnimation';
import { toast } from '@/lib/store/useAppStore';

interface ShopItem {
  id: string;
  name: string;
  category: 'cosmetic' | 'pass' | 'title';
  categoryLabel: string;
  description: string;
  price: number;
  icon: string;
  isTimed: boolean;
  durationMinutes?: number;
  highlight?: string;
  themeColor: string;
}

const SHOP_CATALOG: ShopItem[] = [
  {
    id: 'pass_jury_fasttrack',
    name: '30-Min Fast-Track Jury Pass',
    category: 'pass',
    categoryLabel: 'AI Power Pass',
    description: 'Instant priority queue for faculty jury review & live voice viva defense on active capstone projects.',
    price: 25,
    icon: '⚡',
    isTimed: true,
    durationMinutes: 30,
    highlight: 'Instant Defense',
    themeColor: '#38bdf8',
  },
  {
    id: 'pass_resume_deepscan',
    name: 'Deep ATS Resume Audit Pass',
    category: 'pass',
    categoryLabel: 'AI Power Pass',
    description: '30-minute access to deep AI keyword extraction, Harvard formatting audit, and role-fit scoring.',
    price: 20,
    icon: '📄',
    isTimed: true,
    durationMinutes: 30,
    highlight: 'Career Mirror',
    themeColor: '#60a5fa',
  },
  {
    id: 'pass_arena_turing',
    name: 'Turing Sparring Booster',
    category: 'pass',
    categoryLabel: 'AI Power Pass',
    description: 'Unlimited single-player arena duels against Turing AI with 1.5x weekly league XP multiplier for 30 minutes.',
    price: 30,
    icon: '⚔️',
    isTimed: true,
    durationMinutes: 30,
    highlight: '1.5x League XP',
    themeColor: '#818cf8',
  },
  {
    id: 'avatar_holo_halo',
    name: 'Cyber Neon Halo',
    category: 'cosmetic',
    categoryLabel: 'Avatar Gear',
    description: 'High-visibility floating cyan pulse aura encircling your VRoid mentor and profile card.',
    price: 40,
    icon: '✨',
    isTimed: false,
    highlight: 'Permanent Holo',
    themeColor: '#38bdf8',
  },
  {
    id: 'avatar_apex_visor',
    name: 'Apex Gold Scanner Visor',
    category: 'cosmetic',
    categoryLabel: 'Avatar Gear',
    description: 'Cybernetic golden heads-up display visor tracking live telemetry during missions and arena code wars.',
    price: 50,
    icon: '🥽',
    isTimed: false,
    highlight: 'Golden HUD',
    themeColor: '#fbbf24',
  },
  {
    id: 'avatar_quantum_cloak',
    name: 'Quantum Stealth Cloak',
    category: 'cosmetic',
    categoryLabel: 'Avatar Gear',
    description: 'Iridescent translucent particle cloak radiating defensive cyber security telemetry.',
    price: 75,
    icon: '🥋',
    isTimed: false,
    highlight: 'Prestige Item',
    themeColor: '#a855f7',
  },
  {
    id: 'title_algorithm_titan',
    name: 'Title: Algorithm Titan',
    category: 'title',
    categoryLabel: 'Prestige Title',
    description: 'Elite student distinction badge highlighted on global leaderboards and peer battle invitations.',
    price: 60,
    icon: '👑',
    isTimed: false,
    highlight: 'Leaderboard Flair',
    themeColor: '#f59e0b',
  },
  {
    id: 'title_forensic_auditor',
    name: 'Title: Forensic Auditor',
    category: 'title',
    categoryLabel: 'Prestige Title',
    description: 'Official corporate accounting honorific badge unlocked for enterprise forensic ledger specialists.',
    price: 60,
    icon: '🔍',
    isTimed: false,
    highlight: 'B.Com Enterprise',
    themeColor: '#10b981',
  },
];

export default function ShopPage() {
  const { addVaultItem, vaultItems } = useCareerOS();
  const { pins, bonusPins, spendPins } = usePins();
  const { isItemUnlocked, getItemRemainingSeconds, unlockItem } = useItemLocks({
    pins: pins + bonusPins,
    spendPins,
  });

  const [activeTab, setActiveTab] = useState<'all' | 'pass' | 'cosmetic' | 'title'>('all');
  const [purchasingId, setPurchasingId] = useState<string | null>(null);
  const [unlockedPermanents, setUnlockedPermanents] = useState<string[]>([]);
  const balanceRef = useRef<HTMLDivElement>(null);

  // Hydrate purchased items from vault / localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('pinit_student_shop_items');
      if (stored) {
        setUnlockedPermanents(JSON.parse(stored));
      }
    } catch {}
  }, []);

  const totalPins = pins + bonusPins;

  const filteredCatalog = useMemo(() => {
    if (activeTab === 'all') return SHOP_CATALOG;
    return SHOP_CATALOG.filter(item => item.category === activeTab);
  }, [activeTab]);

  const handlePurchase = async (item: ShopItem, event: React.MouseEvent<HTMLButtonElement>) => {
    if (purchasingId) return;
    console.log('[PinIT System] [Shop-Page] Starting purchase for item:', item.id, 'Price:', item.price);

    // Check if permanent item already owned
    if (!item.isTimed && unlockedPermanents.includes(item.id)) {
      toast.info('Already Owned', `You already own ${item.name}!`);
      return;
    }

    // Check if timed pass is currently active
    if (item.isTimed && isItemUnlocked(item.id)) {
      const remainingSec = getItemRemainingSeconds(item.id);
      toast.info('Pass Active', `${item.name} is already active for ${Math.ceil(remainingSec / 60)} more minutes!`);
      return;
    }

    if (totalPins < item.price) {
      console.warn('[PinIT System] [Shop-Page] Insufficient balance:', totalPins, 'Needed:', item.price);
      toast.error('Insufficient Pins 📌', `You need ${item.price} Pins. Current balance: ${totalPins} Pins.`);
      return;
    }

    setPurchasingId(item.id);

    try {
      // Trigger visual coin stream towards topbar balance badge
      const btn = event.currentTarget;
      triggerCoinStream({
        sourceElement: btn,
        targetElement: balanceRef.current,
        count: 16,
      });

      if (item.isTimed) {
        console.log('[PinIT System] [Shop-Page] Action: Unlocking timed pass via useItemLocks...');
        const success = await unlockItem(item.id, 'arena', `Shop: ${item.name}`);
        if (!success) {
          throw new Error('Lock activation failed');
        }
      } else {
        console.log('[PinIT System] [Shop-Page] Action: Debiting pins for permanent item...');
        const ok = await spendPins('arena', item.id, `Purchased ${item.name}`);
        if (!ok) {
          throw new Error('Pin transaction declined');
        }

        const next = [...unlockedPermanents, item.id];
        setUnlockedPermanents(next);
        try {
          localStorage.setItem('pinit_student_shop_items', JSON.stringify(next));
        } catch {}

        // Add to permanent proof vault
        addVaultItem({
          title: item.name,
          item_type: 'certification',
          organization_name: 'PinIT Career OS Shop',
          description: item.description,
          skill_tags: [item.categoryLabel, 'Shop Unlock'],
          verified: true,
          ai_confidence_score: 98,
        });
      }

      console.log('[PinIT System] [Shop-Page] Completed: Successfully purchased and unlocked:', item.id);
      toast.success('Purchase Successful! 🛍️', `${item.name} unlocked and equipped.`);
    } catch (err: any) {
      console.error('[PinIT System] [Shop-Page] Purchase error:', err);
      toast.error('Transaction Failed ⚠️', err?.message || 'Could not complete pin transaction.');
    } finally {
      setPurchasingId(null);
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 20px', minHeight: '85vh' }}>
      {/* Header Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 28,
        paddingBottom: 20,
        borderBottom: '1px solid var(--border)',
      }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '3px 10px',
            borderRadius: 20,
            background: 'rgba(56, 189, 248, 0.12)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            color: '#38bdf8',
            fontSize: 11,
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: 8,
          }}>
            ⚡ Pin Economy Marketplace
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--t1)', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
            Customization & Power Shop
          </h1>
          <p style={{ margin: 0, fontSize: 14, color: 'var(--t3)' }}>
            Equip real-time avatar cosmetics, unlock 30-minute AI feature passes, and showcase prestigious leaderboard titles.
          </p>
        </div>

        {/* Live Pin Balance Badge */}
        <div
          ref={balanceRef}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '12px 20px',
            borderRadius: 16,
            background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.14) 0%, rgba(37, 99, 235, 0.08) 100%)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
          }}
        >
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Spendable Balance
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>🪙</span>
              <span>{totalPins.toLocaleString()}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--t3)' }}>Pins</span>
            </div>
          </div>
          <Link
            href="/pins"
            style={{
              padding: '8px 14px',
              borderRadius: 10,
              background: 'linear-gradient(135deg, #0284c7, #2563eb)',
              color: '#ffffff',
              fontSize: 12.5,
              fontWeight: 800,
              textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
            }}
          >
            + Get Pins
          </Link>
        </div>
      </div>

      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
        {[
          { id: 'all', label: 'All Items' },
          { id: 'pass', label: '⚡ 30-Min AI Passes' },
          { id: 'cosmetic', label: '✨ Avatar Holo-Gear' },
          { id: 'title', label: '👑 Prestige Titles' },
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '9px 18px',
              borderRadius: 12,
              border: activeTab === tab.id ? '1px solid #38bdf8' : '1px solid var(--border)',
              background: activeTab === tab.id ? 'rgba(56, 189, 248, 0.12)' : 'var(--card)',
              color: activeTab === tab.id ? (activeTab === 'all' ? '#38bdf8' : 'var(--t1)') : 'var(--t3)',
              fontSize: 13.5,
              fontWeight: activeTab === tab.id ? 800 : 600,
              cursor: 'pointer',
              transition: 'all 0.18s ease',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Item Catalog Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
        gap: 20,
      }}>
        {filteredCatalog.map(item => {
          const isTimedActive = item.isTimed && isItemUnlocked(item.id);
          const remainingSec = isTimedActive ? getItemRemainingSeconds(item.id) : 0;
          const isPermanentOwned = !item.isTimed && unlockedPermanents.includes(item.id);
          const isOwnedOrActive = isTimedActive || isPermanentOwned;
          const isAffordable = totalPins >= item.price;
          const isProcessing = purchasingId === item.id;

          return (
            <div
              key={item.id}
              style={{
                borderRadius: 18,
                background: 'var(--card)',
                border: isOwnedOrActive
                  ? '1px solid rgba(56, 189, 248, 0.5)'
                  : '1px solid var(--border)',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                boxShadow: isOwnedOrActive
                  ? '0 8px 30px rgba(56, 189, 248, 0.12)'
                  : '0 4px 16px rgba(0, 0, 0, 0.05)',
                transition: 'transform 0.2s ease, border-color 0.2s ease',
              }}
            >
              {/* Badge Top Tag */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{
                  fontSize: 10.5,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  padding: '3px 8px',
                  borderRadius: 6,
                  background: 'rgba(255, 255, 255, 0.06)',
                  color: item.themeColor,
                }}>
                  {item.categoryLabel}
                </span>

                {item.highlight && (
                  <span style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: 6,
                    background: 'rgba(56, 189, 248, 0.1)',
                    color: '#38bdf8',
                  }}>
                    {item.highlight}
                  </span>
                )}
              </div>

              {/* Icon & Details */}
              <div>
                <div style={{
                  width: 54,
                  height: 54,
                  borderRadius: 14,
                  background: `linear-gradient(135deg, ${item.themeColor}22, ${item.themeColor}11)`,
                  border: `1px solid ${item.themeColor}44`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 26,
                  marginBottom: 14,
                }}>
                  {item.icon}
                </div>

                <h3 style={{ fontSize: 16.5, fontWeight: 800, color: 'var(--t1)', margin: '0 0 8px 0' }}>
                  {item.name}
                </h3>
                <p style={{ fontSize: 13, color: 'var(--t3)', lineHeight: 1.5, margin: '0 0 16px 0' }}>
                  {item.description}
                </p>
              </div>

              {/* Price & Action Area */}
              <div style={{
                paddingTop: 16,
                borderTop: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
              }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 600 }}>
                    {item.isTimed ? '30-Min Unlock' : 'Permanent'}
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 900, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span>🪙</span>
                    <span>{item.price}</span>
                  </div>
                </div>

                {isTimedActive ? (
                  <div style={{
                    padding: '8px 12px',
                    borderRadius: 10,
                    background: 'rgba(56, 189, 248, 0.15)',
                    border: '1px solid #38bdf8',
                    color: '#38bdf8',
                    fontSize: 12,
                    fontWeight: 800,
                    textAlign: 'center',
                  }}>
                    ⏱️ {Math.ceil(remainingSec / 60)}m Left
                  </div>
                ) : isPermanentOwned ? (
                  <div style={{
                    padding: '8px 12px',
                    borderRadius: 10,
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid #10b981',
                    color: '#10b981',
                    fontSize: 12,
                    fontWeight: 800,
                  }}>
                    ✓ Equipped
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={isProcessing || !isAffordable}
                    onClick={(e) => handlePurchase(item, e)}
                    style={{
                      padding: '9px 16px',
                      borderRadius: 10,
                      border: 'none',
                      background: isAffordable
                        ? 'linear-gradient(135deg, #0284c7, #2563eb)'
                        : 'rgba(255, 255, 255, 0.08)',
                      color: isAffordable ? '#ffffff' : 'var(--t3)',
                      fontSize: 13,
                      fontWeight: 800,
                      cursor: isAffordable && !isProcessing ? 'pointer' : 'not-allowed',
                      boxShadow: isAffordable ? '0 4px 14px rgba(37, 99, 235, 0.3)' : 'none',
                      opacity: isProcessing ? 0.7 : 1,
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {isProcessing ? 'Unlocking...' : isAffordable ? 'Unlock Item' : 'Low Balance'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
