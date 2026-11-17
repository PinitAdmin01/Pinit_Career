'use client';

import Link from 'next/link';
import styles from '@/app/competition-experience.module.css';

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
    { id: 'leaderboard', label: 'Leaderboard', href: '/leaderboard?mode=global' },
  ];

  return (
    <nav
      aria-label="Competition sections"
      className={styles.competitionNavigation}
    >
      {items.map(item => {
        const selected = active === item.id;
        return (
          <Link
            key={item.id}
            href={item.href}
            aria-current={selected ? 'page' : undefined}
            className={`${styles.competitionNavItem} ${selected ? styles.competitionNavItemSelected : ''}`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
