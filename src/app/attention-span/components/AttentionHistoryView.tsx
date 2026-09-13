'use client';

import { HistoryEntry, GAMES } from '@/components/attention-span/types';

interface AttentionHistoryViewProps {
  history: HistoryEntry[];
  historyFilter: string;
  setHistoryFilter: (f: string) => void;
  onResetAllProgress: () => void;
  onClearHistory: () => void;
}

export function AttentionHistoryView({
  history,
  historyFilter,
  setHistoryFilter,
  onResetAllProgress,
  onClearHistory,
}: AttentionHistoryViewProps) {
  const filteredHistory = historyFilter === 'all'
    ? history
    : history.filter(h => h.gameId === historyFilter);

  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px 26px', position: 'relative', boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--t1)', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
            Session history
          </h2>
          <p style={{ color: 'var(--t2)', fontSize: 13, margin: '4px 0 0' }}>
            Complete log of all your focus game sessions, accuracy gains, and difficulty levels.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            onClick={onResetAllProgress}
            style={{
              background: 'var(--bg3)',
              border: '1px solid var(--border)',
              color: 'var(--t2)',
              padding: '6px 14px',
              borderRadius: 8,
              fontSize: 11,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            ↺ Reset Progress
          </button>
          {history.length > 0 && (
            <button
              type="button"
              onClick={onClearHistory}
              style={{
                background: 'rgba(var(--danger-rgb), 0.1)',
                border: '1px solid rgba(var(--danger-rgb), 0.25)',
                color: 'var(--danger)',
                padding: '6px 14px',
                borderRadius: 8,
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Clear History
            </button>
          )}
        </div>
      </div>

      {/* Filter Pills */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto', paddingBottom: 4 }}>
        {[{ id: 'all', name: 'All Games' }, ...GAMES].map(f => (
          <button
            key={f.id}
            type="button"
            onClick={() => setHistoryFilter(f.id)}
            style={{
              background: historyFilter === f.id ? 'var(--amber-light)' : 'var(--bg3)',
              border: `1px solid ${historyFilter === f.id ? 'var(--amber)' : 'var(--border)'}`,
              color: historyFilter === f.id ? 'var(--amber)' : 'var(--t2)',
              borderRadius: 8,
              padding: '5px 12px',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {f.name}
          </button>
        ))}
      </div>

      {/* History List */}
      {filteredHistory.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--t2)', fontSize: 14, background: 'var(--bg3)', borderRadius: 12, border: '1px solid var(--border)' }}>
          No sessions yet. Play a drill above to start the log.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: 12,
                background: 'var(--bg3)',
                border: '1px solid var(--border)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ fontSize: 24, width: 36, textAlign: 'center' }}>{item.gameIcon}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    {item.gameName}
                    <span style={{
                      fontSize: 10,
                      padding: '1px 6px',
                      borderRadius: 4,
                      fontWeight: 700,
                      background: item.difficulty === 'hard' ? 'rgba(var(--danger-rgb), 0.15)' : item.difficulty === 'easy' ? 'rgba(var(--success-rgb), 0.15)' : 'var(--amber-light)',
                      color: item.difficulty === 'hard' ? 'var(--danger)' : item.difficulty === 'easy' ? 'var(--success)' : 'var(--amber)',
                      border: `1px solid ${item.difficulty === 'hard' ? 'rgba(var(--danger-rgb), 0.3)' : item.difficulty === 'easy' ? 'rgba(var(--success-rgb), 0.3)' : 'var(--border)'}`,
                      textTransform: 'uppercase',
                    }}>
                      {item.difficulty}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 2 }}>
                    {item.timestamp}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--success)' }}>
                  +{item.accuracyEarned} Accuracy • {item.scoreDisplay}
                </div>
                <div style={{ fontSize: 11, color: 'var(--purple-mid, #8b5cf6)', fontWeight: 600 }}>
                  +{item.xpEarned} XP Earned
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
