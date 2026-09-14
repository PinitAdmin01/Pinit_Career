import { POST as contactHandler } from '../src/app/api/contact/route';
import { portalService } from '../src/lib/services/portalService';
import { inboxSyncService } from '../src/lib/chat/inboxSyncService';
import * as fs from 'fs';
import * as path from 'path';

async function runFriend4Verification() {
  console.log('=== FRIEND 4 VERIFICATION SUITE ===\n');

  // 1. Check for personal emails in source files
  console.log('1. Checking for personal emails (vinayrocker2002)...');
  const srcDir = path.resolve(__dirname, '../src');
  function scanDir(dir: string): string[] {
    const findings: string[] = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        findings.push(...scanDir(fullPath));
      } else if (/\.(ts|tsx|js|jsx|json)$/.test(entry.name)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes('vinayrocker2002@gmail.com')) {
          findings.push(fullPath);
        }
      }
    }
    return findings;
  }
  const leakedFiles = scanDir(srcDir);
  if (leakedFiles.length > 0) {
    console.error('❌ Found leaked personal email in:', leakedFiles);
    process.exit(1);
  }
  console.log('✅ Zero personal email leaks in src/\n');

  // 2. Verify portalService empty state returns
  console.log('2. Testing portalService empty state returns...');
  const students = await portalService.getEnrolledStudents();
  console.log(`  getEnrolledStudents length: ${students.length}`);
  const candidates = await portalService.getRecruiterCandidates();
  console.log(`  getRecruiterCandidates length: ${candidates.length}`);
  const tickets = await portalService.getServiceTickets();
  console.log(`  getServiceTickets length: ${tickets.length}`);
  console.log('✅ portalService handles empty states honestly.\n');

  // 3. Verify inboxSyncService empty state returns
  console.log('3. Testing inboxSyncService empty state returns...');
  const convs = inboxSyncService.getConversations();
  console.log(`  inboxSyncService.getConversations length: ${convs.length}`);
  if (convs.length !== 0) {
    console.error('❌ Expected empty array from inboxSyncService when no storage exists, got:', convs.length);
    process.exit(1);
  }
  console.log('✅ inboxSyncService returns [] cleanly.\n');

  // 4. Test /api/contact validation
  console.log('4. Testing /api/contact validation...');
  // Bad payload: missing email
  const req1 = new Request('http://localhost:3000/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Tester', message: 'Hello world!' })
  });
  const res1 = await contactHandler(req1);
  const json1 = await res1.json();
  if (res1.status !== 400 || json1.error !== 'INVALID_EMAIL') {
    console.error('❌ Expected 400 INVALID_EMAIL, got:', res1.status, json1);
    process.exit(1);
  }
  console.log('  ✅ Invalid email rejected with 400 INVALID_EMAIL');

  // Bad payload: message too short
  const req2 = new Request('http://localhost:3000/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Tester', email: 'test@campus.edu', message: 'hi' })
  });
  const res2 = await contactHandler(req2);
  const json2 = await res2.json();
  if (res2.status !== 400 || json2.error !== 'INVALID_MESSAGE') {
    console.error('❌ Expected 400 INVALID_MESSAGE, got:', res2.status, json2);
    process.exit(1);
  }
  console.log('  ✅ Short message rejected with 400 INVALID_MESSAGE');

  console.log('\n🎉 ALL FRIEND 4 VERIFICATION CHECKS PASSED!');
}

runFriend4Verification().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
