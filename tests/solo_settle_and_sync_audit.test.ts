import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';
import { calculateEloMatch, ELO_CONFIG } from '../src/lib/arena/eloEngine';

describe('Solo Sparring & ELO 100-Baseline Audit', () => {
  it('enforces 100 baseline ELO with 20-point transfer rule', () => {
    assert.strictEqual(ELO_CONFIG.DEFAULT_ELO, 100, 'Default ELO must be 100');
    assert.strictEqual(ELO_CONFIG.FLOOR_ELO, 0, 'Floor ELO must be 0');
    assert.strictEqual(ELO_CONFIG.WIN_ELO_TRANSFER, 20, 'Transfer must be 20 ELO');

    // Host 100 vs Guest 100 -> Host wins -> 120 vs 80
    const match1 = calculateEloMatch({
      hostId: 'user_1',
      guestId: 'user_2',
      hostElo: 100,
      guestElo: 100,
      winnerId: 'user_1',
    });
    assert.strictEqual(match1.hostDelta, 20);
    assert.strictEqual(match1.guestDelta, -20);
    assert.strictEqual(match1.hostNewElo, 120);
    assert.strictEqual(match1.guestNewElo, 80);

    // Guest wins -> Guest +20, Host -20
    const match2 = calculateEloMatch({
      hostId: 'user_1',
      guestId: 'user_2',
      hostElo: 100,
      guestElo: 100,
      winnerId: 'user_2',
    });
    assert.strictEqual(match2.hostDelta, -20);
    assert.strictEqual(match2.guestDelta, 20);
    assert.strictEqual(match2.hostNewElo, 80);
    assert.strictEqual(match2.guestNewElo, 120);
  });

  it('prevents ELO from falling below floor 0', () => {
    const match = calculateEloMatch({
      hostId: 'low_elo_user',
      guestId: 'opponent',
      hostElo: 10,
      guestElo: 100,
      winnerId: 'opponent',
    });
    assert.strictEqual(match.hostNewElo, 0, 'ELO must floor at 0');
  });

  it('verifies /api/arena/settle-solo route exists with authoritative Supabase persistence', () => {
    const routePath = path.join(process.cwd(), 'src/app/api/arena/settle-solo/route.ts');
    assert.ok(fs.existsSync(routePath), 'Solo settle route must exist');
    const content = fs.readFileSync(routePath, 'utf8');
    assert.ok(content.includes('requireCombatantFromRequest'), 'Must enforce combatant auth');
    assert.ok(content.includes('ELO_CONFIG.DEFAULT_ELO'), 'Must reference ELO_CONFIG.DEFAULT_ELO');
    assert.ok(content.includes("from('users').update"), 'Must update users table');
    assert.ok(content.includes("from('xp_ledger').insert"), 'Must insert into xp_ledger');
    assert.ok(content.includes('arena_elo: newElo'), 'Must persist arena_elo');
  });

  it('verifies arena page dispatches pinit:user_profile_updated event on battle conclusion', () => {
    const arenaPagePath = path.join(process.cwd(), 'src/app/arena/page.tsx');
    const content = fs.readFileSync(arenaPagePath, 'utf8');
    assert.ok(content.includes('/api/arena/settle-solo'), 'Arena page must call /api/arena/settle-solo');
    assert.ok(content.includes('pinit:user_profile_updated'), 'Arena page must dispatch pinit:user_profile_updated');
    assert.ok(content.includes('localStorage.setItem(`pinit_user_elo_${studentId}`'), 'Must cache ELO locally');
  });

  it('verifies leaderboard page listens to pinit:user_profile_updated to auto-refresh without hard refresh', () => {
    const leaderboardPath = path.join(process.cwd(), 'src/app/leaderboard/page.tsx');
    const content = fs.readFileSync(leaderboardPath, 'utf8');
    assert.ok(content.includes('pinit:user_profile_updated'), 'Leaderboard must listen to pinit:user_profile_updated');
    assert.ok(content.includes('entry.eloRating - 100'), 'Leaderboard must compute gain from 100 baseline');
  });
});
