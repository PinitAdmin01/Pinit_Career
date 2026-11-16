'use client';

import Link from 'next/link';

type CompetitionSection = 'arena' | 'leaderboard';

export default function CompetitionNavigation({
  active,
  hidden = false,
}: {
  active: CompetitionSection;
  hidden?: boolean;
}) {
  if (hidden) return null;

  const items: Array<{ id: CompetitionSection; label: string; href: string }> = [
    { id: 'arena', label: 'Arena', href: '/arena' },
    { id: 'leaderboard', label: 'League Standings', href: '/leaderboard?mode=global' },
  ];

  return (
    <nav
      aria-label="Competition sections"
      style={{
        display: 'flex',
        gap: 6,
        width: 'fit-content',
        maxWidth: '100%',
        padding: 5,
        borderRadius: 12,
        background: 'var(--bg2)',
        border: '1px solid var(--border)',
        marginBottom: 18,
        overflowX: 'auto',
      }}
    >
      {items.map(item => {
        const selected = active === item.id;
        return (
          <Link
            key={item.id}
            href={item.href}
            aria-current={selected ? 'page' : undefined}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: 132,
              padding: '10px 18px',
              borderRadius: 9,
              border: selected ? '1px solid var(--accent)' : '1px solid transparent',
              background: selected ? 'var(--accent-light)' : 'transparent',
              color: selected ? 'var(--accent-hover, var(--brand-bright, #4f46e5))' : 'var(--t2)',
              fontSize: 13.5,
              fontWeight: 800,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
