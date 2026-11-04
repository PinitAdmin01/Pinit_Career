import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('Task 9: Project Tab and Innovation Hub Division Audit', () => {
  const root = process.cwd();

  it('Task 9.1: CourseProjectProgressBar component exists and renders course progress bar & custom project action', () => {
    const componentPath = path.join(root, 'src', 'components', 'projects', 'CourseProjectProgressBar.tsx');
    assert.ok(fs.existsSync(componentPath), 'CourseProjectProgressBar.tsx must exist');

    const content = fs.readFileSync(componentPath, 'utf8');

    // Progress card and fill
    assert.match(content, /data-testid="course-project-progress-card"/, 'Must render course progress card');
    assert.match(content, /data-testid="course-progress-fill"/, 'Must render animated progress bar');
    assert.match(content, /data-testid="start-own-project-btn"/, 'Must provide action button to start own project');

    // Milestone stages
    assert.match(content, /Milestone 1: Foundation Capstone/);
    assert.match(content, /Milestone 2: Distributed Integration/);
    assert.match(content, /Milestone 3: Production Defense/);
    assert.match(content, /Academic Curriculum Pathway/);
  });

  it('Task 9.2: InnovationHub component implements invite link, QR code, chat discussion, public search & join requests', () => {
    const hubPath = path.join(root, 'src', 'components', 'projects', 'InnovationHub.tsx');
    assert.ok(fs.existsSync(hubPath), 'InnovationHub.tsx must exist');

    const content = fs.readFileSync(hubPath, 'utf8');

    // Container
    assert.match(content, /data-testid="innovation-hub-container"/);

    // Public search
    assert.match(content, /data-testid="public-project-search-input"/, 'Must have public project search input');

    // Start project
    assert.match(content, /data-testid="start-innovation-project-btn"/);
    assert.match(content, /data-testid="start-project-modal"/);
    assert.match(content, /data-testid="create-project-submit-btn"/);

    // WhatsApp + QR code invite
    assert.match(content, /data-testid="invite-friends-btn"/);
    assert.match(content, /data-testid="invite-friends-modal"/);
    assert.match(content, /data-testid="copy-invite-link-btn"/);
    assert.match(content, /<QRCodeSVG/i, 'Must render QR code via QRCodeSVG for WhatsApp/phone scanning');
    assert.match(content, /api\.whatsapp\.com\/send/, 'Must provide direct WhatsApp group invite share');

    // Team Discussion & Chat
    assert.match(content, /data-testid="innovation-team-chat-container"/, 'Must render in-project discussion chat');
    assert.match(content, /data-testid="innovation-chat-input"/, 'Must have chat message input');
    assert.match(content, /data-testid="innovation-chat-send-btn"/, 'Must have send button');
    assert.match(content, /pinit_innovation_chat_/, 'Must persist chat messages per squad');

    // Request to join public projects
    assert.match(content, /data-testid="request-to-join-btn"/, 'Must allow non-members to request to join');
    assert.match(content, /data-testid="join-request-modal"/);
    assert.match(content, /data-testid="submit-join-request-btn"/);
    assert.match(content, /pinit_join_requests_/, 'Must track prospective contributor join requests');
  });

  it('Task 9.3: Projects page (/projects) divides into Project Workspace and Innovation Hub tabs', () => {
    const projectsPagePath = path.join(root, 'src', 'app', 'projects', 'page.tsx');
    const content = fs.readFileSync(projectsPagePath, 'utf8');

    // Tab buttons
    assert.match(content, /data-testid="tab-projects"/, 'Must render tab-projects button');
    assert.match(content, /data-testid="tab-innovation"/, 'Must render tab-innovation button');

    // Subtitle and labels
    assert.match(content, /Project Workspace \(Course & Capstones\)/);
    assert.match(content, /Innovation Hub \(Group Projects & Invites\)/);

    // Tab 1 contains CourseProjectProgressBar
    assert.match(content, /<CourseProjectProgressBar/, 'Tab 1 must render CourseProjectProgressBar');

    // Tab 2 contains InnovationHub
    assert.match(content, /<InnovationHub/, 'Tab 2 must render InnovationHub');

    // URL parameter support
    assert.match(content, /tabParam === 'squads' \|\| tabParam === 'innovation' \|\| Boolean\(joinParam\)/, 'Must handle innovation/squads and invite join params');
  });

  it('Task 9.4: Teams redirect page (/teams) redirects to /projects?tab=innovation', () => {
    const teamsPagePath = path.join(root, 'src', 'app', 'teams', 'page.tsx');
    const content = fs.readFileSync(teamsPagePath, 'utf8');

    assert.match(content, /router\.replace\('\/projects\?tab=innovation'\)/, 'Teams page must redirect to innovation tab');
  });

  it('Task 9.5: Sidebar & Shell navigation reflect Projects & Innovation', () => {
    const sidebarPath = path.join(root, 'src', 'components', 'ui', 'AppSidebar.tsx');
    const shellPath = path.join(root, 'src', 'components', 'ui', 'AppShell.tsx');

    const sidebarContent = fs.readFileSync(sidebarPath, 'utf8');
    const shellContent = fs.readFileSync(shellPath, 'utf8');

    assert.match(sidebarContent, /'\/projects':\s*\{\s*label:\s*'Projects & Innovation'/);
    assert.match(sidebarContent, /href:\s*'\/projects',\s*icon:\s*'🚀',\s*label:\s*'Projects & Innovation'/);
    assert.match(shellContent, /'\/projects':\s*'Project & Innovation Hub'/);
    assert.match(shellContent, /'\/teams':\s*'Innovation Hub'/);
  });
});
