import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { deriveShelfLocation } from '../src/lib/services/libraryService';

describe('FLAWLESS PLATFORM AUDIT: Navigation Handoffs, Headers & Embedded Views', () => {

  it('F1.1: EnrolledCoursesPanel has eliminated dead /practice link in favor of /quests', () => {
    const filePath = path.join(process.cwd(), 'src/app/learning/components/EnrolledCoursesPanel.tsx');
    const content = fs.readFileSync(filePath, 'utf-8');

    assert.equal(
      content.includes('href="/practice"'),
      false,
      'EnrolledCoursesPanel must NOT contain dead link href="/practice"'
    );
    assert.ok(
      content.includes('href="/quests"'),
      'EnrolledCoursesPanel must link practice CTA to /quests'
    );
  });

  it('F1.2: useLearningData has eliminated dead /resume links in favor of /mirror', () => {
    const filePath = path.join(process.cwd(), 'src/app/learning/hooks/useLearningData.ts');
    const content = fs.readFileSync(filePath, 'utf-8');

    assert.equal(
      content.includes("href: '/resume'"),
      false,
      'useLearningData must NOT contain dead link href: "/resume"'
    );
    assert.ok(
      content.includes("href: '/mirror?tab=career-builder'"),
      'useLearningData quest stages must link to unified Mirror career-builder'
    );
  });

  it('F1.3: libraryService deriveShelfLocation outputs clean bullet with zero corrupted glyphs', () => {
    const filePath = path.join(process.cwd(), 'src/lib/services/libraryService.ts');
    const content = fs.readFileSync(filePath, 'utf-8');

    assert.equal(
      content.includes('Aisle 3 · Rack') || content.includes('Aisle 3 \ufffd Rack'),
      false,
      'libraryService must not contain corrupted glyphs in shelf locations'
    );

    // Verify runtime output
    const csShelf = deriveShelfLocation('Computer Science');
    const bizShelf = deriveShelfLocation('Business Management');
    const finShelf = deriveShelfLocation('Finance & Banking');
    const mathShelf = deriveShelfLocation('Physics & Engineering');
    const genShelf = deriveShelfLocation('History');

    assert.ok(csShelf.includes('• Rack CS-04'), `Expected clean bullet in CS shelf: ${csShelf}`);
    assert.ok(bizShelf.includes('• Rack MG-12'), `Expected clean bullet in Business shelf: ${bizShelf}`);
    assert.ok(finShelf.includes('• Rack FC-08'), `Expected clean bullet in Finance shelf: ${finShelf}`);
    assert.ok(mathShelf.includes('• Rack EN-02'), `Expected clean bullet in Engineering shelf: ${mathShelf}`);
    assert.ok(genShelf.includes('• Rack GN-01'), `Expected clean bullet in General shelf: ${genShelf}`);
  });

  it('F2.1: CareerBuilderPage wires embedded prop to suppress redundant header', () => {
    const filePath = path.join(process.cwd(), 'src/app/career-builder/page.tsx');
    const content = fs.readFileSync(filePath, 'utf-8');

    assert.ok(
      content.includes('export default function CareerBuilderPage({ embedded = false }'),
      'CareerBuilderPage must export with embedded prop'
    );
    assert.ok(
      content.includes('{!embedded && (') && content.includes('Career Architecture & ATS Intelligence Studio'),
      'CareerBuilderPage header must be wrapped in {!embedded && (...)} guard'
    );
  });

  it('F2.2: GroupDiscussionPage wires embedded prop to suppress redundant banner title', () => {
    const filePath = path.join(process.cwd(), 'src/app/group-discussion/page.tsx');
    const content = fs.readFileSync(filePath, 'utf-8');

    assert.ok(
      content.includes('export default function GroupDiscussionPage({ embedded = false }'),
      'GroupDiscussionPage must export with embedded prop'
    );
    assert.ok(
      content.includes('{!embedded && (') && content.includes('🗣️ Group Discussion Practice'),
      'GroupDiscussionPage header banner title must be wrapped in {!embedded && (...)} guard'
    );
  });

  it('F3.1: MirrorPage passes embedded={true} and initialTab to LearningPage views', () => {
    const filePath = path.join(process.cwd(), 'src/app/mirror/page.tsx');
    const content = fs.readFileSync(filePath, 'utf-8');

    assert.ok(
      content.includes('<LearningPage initialTab="twin" embedded={true} />'),
      'MirrorPage must pass initialTab="twin" and embedded={true} to digital twin view'
    );
    assert.ok(
      content.includes('<LearningPage initialTab="roadmap" embedded={true} />'),
      'MirrorPage must pass initialTab="roadmap" and embedded={true} to roadmap view'
    );
  });

  it('F3.2: LearningFilters exposes data-testid="learning-subtabs" with embedded scaling', () => {
    const filePath = path.join(process.cwd(), 'src/app/learning/components/LearningFilters.tsx');
    const content = fs.readFileSync(filePath, 'utf-8');

    assert.ok(
      content.includes('data-testid="learning-subtabs"'),
      'LearningFilters must have data-testid="learning-subtabs"'
    );
    assert.ok(
      content.includes('embedded ?'),
      'LearningFilters must adapt subtab padding when embedded'
    );
  });

  it('F4.1: StandupModal adapts to CSS theme variables and eliminates hardcoded pitch dark', () => {
    const filePath = path.join(process.cwd(), 'src/app/quests/components/internship/StandupModal.tsx');
    const content = fs.readFileSync(filePath, 'utf-8');

    assert.equal(
      content.includes("background: '#0f172a'"),
      false,
      'StandupModal must not contain hardcoded #0f172a dialog background'
    );
    assert.equal(
      content.includes("background: '#1e293b'"),
      false,
      'StandupModal textareas must not contain hardcoded #1e293b'
    );
    assert.ok(
      content.includes("background: 'var(--card)'"),
      'StandupModal dialog must use var(--card)'
    );
    assert.ok(
      content.includes("background: 'var(--bg2)'"),
      'StandupModal textareas must use var(--bg2)'
    );
  });

  it('F4.2: Internship cards adapt to semantic tokens (SprintBoard, Team, Backlog)', () => {
    const files = [
      'SprintBoardCard.tsx',
      'TeamCard.tsx',
      'BacklogCard.tsx',
      'CodeReviewCard.tsx',
      'Tier2Desk.tsx'
    ];

    for (const f of files) {
      const p = path.join(process.cwd(), 'src/app/quests/components/internship', f);
      const content = fs.readFileSync(p, 'utf-8');
      assert.equal(
        content.includes("background: 'rgba(15, 23, 42, 0.65)'") || content.includes("background: '#0f172a'"),
        false,
        `${f} must not contain hardcoded dark card backgrounds`
      );
    }
  });

});
