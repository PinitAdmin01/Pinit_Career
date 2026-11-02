import { describe, it } from 'node:test';
import assert from 'node:assert';
import * as fs from 'fs';
import * as path from 'path';

describe('Adversarial Verification: Light Mode & Checkout Modal Viewport Alignment', () => {
  const rootDir = process.cwd();

  it('Task 1.1: globals.css properly defines --card-rgb for dark and light mode', () => {
    const globalsCss = fs.readFileSync(path.join(rootDir, 'src/styles/globals.css'), 'utf-8');
    
    // Check dark mode
    assert.match(globalsCss, /--card-rgb:\s*13,\s*18,\s*30;/);
    // Check light mode
    assert.match(globalsCss, /--card-rgb:\s*255,\s*255,\s*255;/);
  });

  it('Task 1.2: CrashCoursePlanCards.tsx uses theme-adaptive container and high-contrast track badges', () => {
    const file = fs.readFileSync(path.join(rootDir, 'src/app/quests/components/CrashCoursePlanCards.tsx'), 'utf-8');

    // Container should use var(--card) gradient, NOT hardcoded 15,23,42 fallback
    assert.ok(!file.includes("rgba(var(--card-rgb, 15,23,42), 0.95)"));
    assert.ok(file.includes("background: 'linear-gradient(135deg, var(--card) 0%, var(--bg3) 100%)'"));

    // Option 2 badge must not have white text on white background
    assert.ok(!file.includes("background: activeTrack === 'python_ai' ? 'var(--green)' : 'var(--bg2)'"));
    
    // Inactive badge must use var(--bg3) and var(--t2)
    assert.ok(file.includes("background: activeTrack === 'python_ai' ? 'var(--green)' : 'var(--bg3)'"));
    assert.ok(file.includes("color: activeTrack === 'python_ai' ? '#ffffff' : 'var(--t2)'"));
    assert.ok(file.includes("background: activeTrack === 'web_fullstack' ? 'var(--accent)' : 'var(--bg3)'"));
    assert.ok(file.includes("color: activeTrack === 'web_fullstack' ? '#ffffff' : 'var(--t2)'"));
  });

  it('Task 1.3: CareerGrowthGraph.tsx replaces pitch-dark slate container and white grid lines', () => {
    const file = fs.readFileSync(path.join(rootDir, 'src/app/quests/components/CareerGrowthGraph.tsx'), 'utf-8');

    // Must not have hardcoded dark background
    assert.ok(!file.includes("background: 'rgba(15, 23, 42, 0.85)'"));
    assert.ok(file.includes("background: 'var(--card)'"));
    assert.ok(file.includes("border: '1px solid var(--border)'"));
    assert.ok(file.includes('stroke="var(--border)" strokeWidth="1"'));
  });

  it('Task 1.4: ActiveEnrollmentBanner.tsx replaces hardcoded dark gradient and white text', () => {
    const file = fs.readFileSync(path.join(rootDir, 'src/app/quests/components/ActiveEnrollmentBanner.tsx'), 'utf-8');

    // Must not have hardcoded dark gradient
    assert.ok(!file.includes("background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95))'"));
    assert.ok(file.includes("background: 'linear-gradient(135deg, var(--card) 0%, var(--bg2) 100%)'"));
    assert.ok(file.includes("color: 'var(--t1)'"));
    assert.ok(file.includes("color: 'var(--t2)'"));
  });

  it('Task 1.5: VerticalCheckpointStepper.tsx container and step cards adapt to theme', () => {
    const file = fs.readFileSync(path.join(rootDir, 'src/app/quests/components/VerticalCheckpointStepper.tsx'), 'utf-8');

    // Container must adapt
    assert.ok(!file.includes("background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(10, 15, 29, 0.98) 100%)'"));
    assert.ok(file.includes("background: 'linear-gradient(180deg, var(--card) 0%, var(--bg2) 100%)'"));
    
    // Checkpoint cards must not use hardcoded rgba(15, 23, 42)
    assert.ok(!file.includes("'rgba(15, 23, 42, 0.65)'"));
    assert.ok(file.includes("var(--card)"));
    assert.ok(file.includes("var(--bg2)"));
    assert.ok(file.includes("color: 'var(--t1)'"));
  });

  it('Task 2: CrashCourseCheckoutModal.tsx uses createPortal, locks body scroll, and centers viewport', () => {
    const file = fs.readFileSync(path.join(rootDir, 'src/app/quests/components/CrashCourseCheckoutModal.tsx'), 'utf-8');

    // Must import createPortal
    assert.ok(file.includes("import { createPortal } from 'react-dom';"));

    // Must return createPortal directly to document.body
    assert.ok(file.includes("return createPortal(modalContent, document.body);"));

    // Must lock document.body.style.overflow
    assert.ok(file.includes("document.body.style.overflow = 'hidden';"));

    // Must be fixed to entire viewport with top-level z-index
    assert.ok(file.includes("position: 'fixed'"));
    assert.ok(file.includes("width: '100vw'"));
    assert.ok(file.includes("height: '100vh'"));
    assert.ok(file.includes("zIndex: 99999"));
    assert.ok(file.includes("alignItems: 'center'"));
    assert.ok(file.includes("justifyContent: 'center'"));

    // Modal background must use var(--card)
    assert.ok(!file.includes("background: 'rgba(15, 23, 42, 0.96)'"));
    assert.ok(file.includes("background: 'var(--card)'"));
  });

  it('Task 3.1: src/app/arena/page.tsx uses theme-adaptive surface tokens', () => {
    const file = fs.readFileSync(path.join(rootDir, 'src/app/arena/page.tsx'), 'utf-8');

    // Combat header must not use hardcoded dark navy gradient
    assert.ok(!file.includes("background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.7) 0%, rgba(15, 23, 42, 0.8) 100%)'"));
    assert.ok(file.includes("background: 'linear-gradient(135deg, var(--card) 0%, var(--bg2) 100%)'"));

    // 1v1 duel quick action card must not use dark navy gradient
    assert.ok(!file.includes("background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.5) 0%, rgba(15, 23, 42, 0.7) 100%)'"));

    // Loading Monaco editor must not use #0d1117
    assert.ok(!file.includes("background: '#0d1117'"));
  });

  it('Task 3.2: Friends tab views adapt to theme without hardcoded dark cards', () => {
    const challengesView = fs.readFileSync(path.join(rootDir, 'src/components/friends/ArenaChallengesView.tsx'), 'utf-8');
    const squadView = fs.readFileSync(path.join(rootDir, 'src/components/friends/SquadProjectsView.tsx'), 'utf-8');
    const challengeModal = fs.readFileSync(path.join(rootDir, 'src/components/friends/ArenaChallengeModal.tsx'), 'utf-8');
    const projectModal = fs.readFileSync(path.join(rootDir, 'src/components/friends/ProjectInviteModal.tsx'), 'utf-8');
    const smartModal = fs.readFileSync(path.join(rootDir, 'src/components/friends/SmartMatchModal.tsx'), 'utf-8');

    assert.ok(!challengesView.includes("background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(15, 23, 42, 0.8) 100%)'"));
    assert.ok(!squadView.includes("background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(15, 23, 42, 0.7) 100%)'"));
    assert.ok(!challengeModal.includes("background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(15, 23, 42, 0.7) 100%)'"));
    assert.ok(!projectModal.includes("background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(15, 23, 42, 0.7) 100%)'"));
    assert.ok(!smartModal.includes("background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(15, 23, 42, 0.8) 100%)'"));
  });
});
