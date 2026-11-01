'use client';

import React, { useState, useEffect } from 'react';
import { adminEconomyService, PinsEconomyConfig, PinsPack } from '@/lib/services/adminEconomyService';

export default function AdminPinsEconomyTab() {
  const [config, setConfig] = useState<PinsEconomyConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  async function loadConfig() {
    setLoading(true);
    const data = await adminEconomyService.getPinsEconomyConfig();
    setConfig(data);
    setLoading(false);
  }

  async function handleSave() {
    if (!config) return;
    setSaving(true);
    try {
      const updated = await adminEconomyService.updatePinsEconomyConfig(config);
      setConfig(updated);
      setFeedback('✅ Pins economy conversion rates and pack pricing updated successfully.');
      setTimeout(() => setFeedback(null), 4000);
    } catch {
      setFeedback('❌ Failed to update pins economy configuration.');
    } finally {
      setSaving(false);
    }
  }

  function handlePackChange(index: number, field: keyof PinsPack, value: any) {
    if (!config) return;
    const nextPacks = [...config.packs];
    nextPacks[index] = { ...nextPacks[index], [field]: value };
    setConfig({ ...config, packs: nextPacks });
  }

  if (loading || !config) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--t3)' }}>
        Loading Pins Economy configuration...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: 'var(--t1)' }}>
            🪙 Pins Rate & Economy Treasury Controls
          </h2>
          <p style={{ margin: '4px 0 0', color: 'var(--t3)', fontSize: 14.5 }}>
            Configure Pin conversion rate to INR, student reward grants, tournament entry benchmarks, and store purchase bundles.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            padding: '10px 20px',
            borderRadius: 8,
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: '#fff',
            border: 'none',
            fontWeight: 700,
            fontSize: 14,
            cursor: saving ? 'wait' : 'pointer',
            boxShadow: '0 4px 12px rgba(16,185,129,0.3)'
          }}
        >
          {saving ? 'Saving Changes...' : '💾 Save Economy Rates'}
        </button>
      </div>

      {feedback && (
        <div style={{ padding: '12px 16px', borderRadius: 8, background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', color: '#10b981', fontWeight: 600, fontSize: 14 }}>
          {feedback}
        </div>
      )}

      {/* Core Economy Parameters Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
        <div style={{ padding: 20, borderRadius: 12, border: '1px solid var(--border)', background: 'var(--card, #fff)' }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--t3)', marginBottom: 8 }}>
            Base Conversion Rate (1 Pin = ₹ INR)
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--t1)' }}>₹</span>
            <input
              type="number"
              value={config.inrPerPin}
              onChange={e => setConfig({ ...config, inrPerPin: Number(e.target.value) })}
              style={{
                width: 100,
                fontSize: 22,
                fontWeight: 800,
                padding: '6px 10px',
                borderRadius: 8,
                border: '1px solid var(--border)',
                background: 'var(--bg3)',
                color: 'var(--t1)'
              }}
            />
          </div>
          <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 6 }}>
            Defines purchasing power of 1 pin when redeeming certifications.
          </div>
        </div>

        <div style={{ padding: 20, borderRadius: 12, border: '1px solid var(--border)', background: 'var(--card, #fff)' }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--t3)', marginBottom: 8 }}>
            Daily Mission Streak Bonus (Pins)
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 20 }}>🪙</span>
            <input
              type="number"
              value={config.dailyLoginBonusPins}
              onChange={e => setConfig({ ...config, dailyLoginBonusPins: Number(e.target.value) })}
              style={{
                width: 100,
                fontSize: 22,
                fontWeight: 800,
                padding: '6px 10px',
                borderRadius: 8,
                border: '1px solid var(--border)',
                background: 'var(--bg3)',
                color: 'var(--t1)'
              }}
            />
          </div>
          <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 6 }}>
            Rewarded to students maintaining active daily problem-solving.
          </div>
        </div>

        <div style={{ padding: 20, borderRadius: 12, border: '1px solid var(--border)', background: 'var(--card, #fff)' }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--t3)', marginBottom: 8 }}>
            Quest Completion Bonus (Pins)
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 20 }}>⭐</span>
            <input
              type="number"
              value={config.questCompleteBonusPins}
              onChange={e => setConfig({ ...config, questCompleteBonusPins: Number(e.target.value) })}
              style={{
                width: 100,
                fontSize: 22,
                fontWeight: 800,
                padding: '6px 10px',
                borderRadius: 8,
                border: '1px solid var(--border)',
                background: 'var(--bg3)',
                color: 'var(--t1)'
              }}
            />
          </div>
          <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 6 }}>
            Awarded when a student passes an oral defense & coding project.
          </div>
        </div>

        <div style={{ padding: 20, borderRadius: 12, border: '1px solid var(--border)', background: 'var(--card, #fff)' }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--t3)', marginBottom: 8 }}>
            Tournament Entry Base (Pins)
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 20 }}>⚔️</span>
            <input
              type="number"
              value={config.tournamentEntryBasePins}
              onChange={e => setConfig({ ...config, tournamentEntryBasePins: Number(e.target.value) })}
              style={{
                width: 100,
                fontSize: 22,
                fontWeight: 800,
                padding: '6px 10px',
                borderRadius: 8,
                border: '1px solid var(--border)',
                background: 'var(--bg3)',
                color: 'var(--t1)'
              }}
            />
          </div>
          <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 6 }}>
            Standard fee for ranked 1v1 arenas and code wars.
          </div>
        </div>
      </div>

      {/* Pins Store Purchase Bundles */}
      <div style={{ background: 'var(--card, #fff)', border: '1px solid var(--border)', borderRadius: 14, padding: 24 }}>
        <h3 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 700, color: 'var(--t1)' }}>
          📦 Student Pin Store Purchase Packages
        </h3>
        <p style={{ margin: '0 0 20px', color: 'var(--t3)', fontSize: 14 }}>
          Adjust package pricing in INR, base pin counts, and bonus pin incentives shown to students in the Pins & Wallet checkout modal.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          {config.packs.map((pack, idx) => (
            <div
              key={pack.id}
              style={{
                padding: 18,
                borderRadius: 12,
                border: pack.popular ? '2px solid #2563eb' : '1px solid var(--border)',
                background: pack.popular ? 'rgba(37,99,235,0.03)' : 'var(--bg1, #f8fafc)',
                position: 'relative'
              }}
            >
              {pack.popular && (
                <span style={{
                  position: 'absolute',
                  top: -10,
                  right: 14,
                  background: '#2563eb',
                  color: '#fff',
                  fontSize: 10,
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: 10,
                  textTransform: 'uppercase'
                }}>
                  Popular
                </span>
              )}

              <input
                type="text"
                value={pack.name}
                onChange={e => handlePackChange(idx, 'name', e.target.value)}
                style={{
                  fontWeight: 700,
                  fontSize: 15,
                  color: 'var(--t1)',
                  marginBottom: 12,
                  width: '100%',
                  border: '1px solid var(--border)',
                  borderRadius: 6,
                  padding: '4px 8px',
                  background: 'var(--card, #fff)'
                }}
              />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: 'var(--t3)', marginBottom: 2 }}>Pins Amount</label>
                  <input
                    type="number"
                    value={pack.pinsAmount}
                    onChange={e => handlePackChange(idx, 'pinsAmount', Number(e.target.value))}
                    style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid var(--border)', fontWeight: 700 }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, color: 'var(--t3)', marginBottom: 2 }}>Price in INR (₹)</label>
                  <input
                    type="number"
                    value={pack.priceInr}
                    onChange={e => handlePackChange(idx, 'priceInr', Number(e.target.value))}
                    style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid var(--border)', fontWeight: 700, color: 'var(--accent)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, color: 'var(--t3)', marginBottom: 2 }}>Bonus Pins</label>
                  <input
                    type="number"
                    value={pack.bonusPins}
                    onChange={e => handlePackChange(idx, 'bonusPins', Number(e.target.value))}
                    style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid var(--border)' }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
