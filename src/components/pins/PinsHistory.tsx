'use client';
// PinsHistory — shows recent pin transactions with clean timeline styling
import { useCareerOS } from '@/lib/context/CareerOSContext';
import './pins.css';

function timeAgo(ts: number) {
  const m = Math.floor((Date.now() - ts) / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h/24)}d ago`;
}

interface Props { limit?: number; }

export default function PinsHistory({ limit = 10 }: Props) {
  const { pinHistory } = useCareerOS();
  const shown = pinHistory.slice(0, limit);

  if (!shown.length) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '32px 20px',
        color: 'var(--t3)',
        fontSize: 13,
        background: 'rgba(255,255,255,0.02)',
        borderRadius: 16,
        border: '1px dashed var(--border)',
      }}>
        <div style={{ fontSize: 28, marginBottom: 8 }}>⚡</div>
        <p style={{ margin: 0, fontWeight: 500 }}>No pin transactions yet.</p>
        <p style={{ margin: '4px 0 0 0', fontSize: 12, opacity: 0.7 }}>Daily 120 Pins arrive automatically at 1:00 AM.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {shown.map(tx => (
        <div 
          key={tx.id} 
          style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '12px 16px',
            background: 'var(--bg3)',
            border: '1px solid var(--border)',
            borderRadius: 14,
            transition: 'transform 0.15s ease, border-color 0.15s ease',
          }}
        >
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: tx.type === 'earn' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
            border: `1px solid ${tx.type === 'earn' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 15, flexShrink: 0,
            color: tx.type === 'earn' ? '#10b981' : '#ef4444',
          }}>
            {tx.type === 'earn' ? '⚡' : '🔓'}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {tx.reason}
            </div>
            <div style={{ fontSize: 11, color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>
              {timeAgo(tx.timestamp)}
            </div>
          </div>

          <div style={{
            fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 14,
            color: tx.type === 'earn' ? '#10b981' : '#ef4444',
            flexShrink: 0,
            display: 'flex', alignItems: 'center', gap: 4
          }}>
            <span>{tx.type === 'earn' ? '+' : '-'}{tx.amount}</span>
            <span style={{ fontSize: 11 }}>⚡</span>
          </div>
        </div>
      ))}
    </div>
  );
}
