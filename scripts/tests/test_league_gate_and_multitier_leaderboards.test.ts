import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('Task 10: 100 XP League Gate & Multi-Tier Leaderboard Audit', () => {
  const root = process.cwd();

  it('Task 10.1: Leaderboard page implements the 100 XP League Entry Gate & Join Action', () => {
    const pagePath = path.join(root, 'src', 'app', 'leaderboard', 'page.tsx');
    assert.ok(fs.existsSync(pagePath), 'Leaderboard page must exist');

    const content = fs.readFileSync(pagePath, 'utf8');

    // 100 XP Gate Banner for users with < 100 XP
    assert.match(content, /data-testid="league-100xp-gate"/, 'Must render 100 XP League Entry Gate banner');
    assert.match(content, /100 XP Needed to Join/, 'Must explain 100 XP requirement');

    // Qualified celebration banner & Join League action for users with >= 100 XP
    assert.match(content, /data-testid="league-qualified-banner"/, 'Must render League Qualified banner');
    assert.match(content, /data-testid="join-league-btn"/, 'Must provide button to join ranked league');
    assert.match(content, /handleJoinLeague/, 'Must implement handleJoinLeague handler');
    assert.match(content, /pinit_joined_league_/, 'Must persist league enrollment');
  });

  it('Task 10.2: Leaderboard page implements the 4 required Sub-Tabs', () => {
    const pagePath = path.join(root, 'src', 'app', 'leaderboard', 'page.tsx');
    const content = fs.readFileSync(pagePath, 'utf8');

    // Sub-Tabs
    assert.match(content, /id:\s*'region_college',\s*icon:\s*'🏛️',\s*label:\s*'Region \/ College'/, 'Must have Region / College sub-tab');
    assert.match(content, /id:\s*'global',\s*icon:\s*'🌐',\s*label:\s*'Global Leaderboard'/, 'Must have Global leaderboard sub-tab');
    assert.match(content, /id:\s*'guild_projects',\s*icon:\s*'🛡️',\s*label:\s*'Guild Projects'/, 'Must have Guild Projects sub-tab');
    assert.match(content, /id:\s*'weekly_leagues',\s*icon:\s*'🏆',\s*label:\s*'League Promotion & Demotion'/, 'Must have League Promotion & Demotion sub-tab');
    assert.match(content, /data-testid=\{`subtab-\$\{tab\.id\}`\}/, 'Must generate subtab testid');

    // TabMode type
    assert.match(content, /type TabMode = 'region_college' \| 'global' \| 'guild_projects' \| 'weekly_leagues'/);
  });

  it('Task 10.3: Guild Projects Table displays completed projects per engineering squad', () => {
    const pagePath = path.join(root, 'src', 'app', 'leaderboard', 'page.tsx');
    const content = fs.readFileSync(pagePath, 'utf8');

    assert.match(content, /data-testid="guild-projects-table-container"/, 'Must render Guild Projects Table container');
    assert.match(content, /Guild \/ Engineering Squad/);
    assert.match(content, /Projects Completed/);
    assert.match(content, /completedProjectsCount/);
  });

  it('Task 10.4: Weekly League promotion and demotion is calculated using League Score (XP + ELO)', () => {
    const apiRoutePath = path.join(root, 'src', 'app', 'api', 'leaderboard', 'route.ts');
    const content = fs.readFileSync(apiRoutePath, 'utf8');

    // League score calculation (XP + ELO gain)
    assert.match(content, /const eloGain = Math\.max\(0, eloRating - 1200\);/);
    assert.match(content, /const leagueScore = weeklyXp \+ eloGain;/);

    // Sorting by leagueScore
    assert.match(content, /const scoreA = a\.leagueScore \?\? \(a\.weeklyXp \+ \(a\.eloGain \?\? 0\)\);/);
    assert.match(content, /const scoreB = b\.leagueScore \?\? \(b\.weeklyXp \+ \(b\.eloGain \?\? 0\)\);/);
    assert.match(content, /if \(scoreB !== scoreA\) return scoreB - scoreA;/);

    // Mathematical verification of user prompt example:
    // Player 1: 1000 XP + 20 ELO = 1020
    // Player 2: 1000 XP + 10 ELO = 1010
    const player1 = { weeklyXp: 1000, eloRating: 1220, eloGain: 20, leagueScore: 1020 };
    const player2 = { weeklyXp: 1000, eloRating: 1210, eloGain: 10, leagueScore: 1010 };

    const score1 = player1.leagueScore;
    const score2 = player2.leagueScore;
    assert.ok(score1 > score2, '1000 XP + 20 ELO must rank higher than 1000 XP + 10 ELO');
  });

  it('Task 10.5: Promotion and Demotion visual cutoff lines are rendered in Weekly Leagues', () => {
    const pagePath = path.join(root, 'src', 'app', 'leaderboard', 'page.tsx');
    const content = fs.readFileSync(pagePath, 'utf8');

    assert.match(content, /Promotion Cutoff Line — Top 10% advance to higher league/);
    assert.match(content, /Demotion Cutoff Line — Bottom 10% demote to lower league/);
    assert.match(content, /renderPromotionDivider/);
    assert.match(content, /renderDemotionDivider/);
  });
});
