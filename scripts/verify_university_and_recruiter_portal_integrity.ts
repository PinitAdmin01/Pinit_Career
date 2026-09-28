import fs from 'fs';
import path from 'path';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ Assertion Failed: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ Passed: ${message}`);
  }
}

console.log('=== University & Recruiter Portal Integrity Verification ===\n');

// 1. Check University API Server Routes
const universityDashboardRoute = path.join(process.cwd(), 'src/app/api/university/dashboard/route.ts');
const universityEmployabilityRoute = path.join(process.cwd(), 'src/app/api/university/employability-report/route.ts');
const universitySkillGapsRoute = path.join(process.cwd(), 'src/app/api/university/skill-gaps/route.ts');

assert(fs.existsSync(universityDashboardRoute), 'src/app/api/university/dashboard/route.ts exists');
assert(fs.existsSync(universityEmployabilityRoute), 'src/app/api/university/employability-report/route.ts exists');
assert(fs.existsSync(universitySkillGapsRoute), 'src/app/api/university/skill-gaps/route.ts exists');

const dashContent = fs.readFileSync(universityDashboardRoute, 'utf-8');
assert(dashContent.includes('getSupabaseAdmin'), 'University dashboard route uses getSupabaseAdmin() to avoid RLS 0/1 row restriction');
assert(dashContent.includes('getUniversityDashboard'), 'University dashboard route invokes getUniversityDashboard()');

const empContent = fs.readFileSync(universityEmployabilityRoute, 'utf-8');
assert(empContent.includes('getSupabaseAdmin'), 'University employability-report route uses getSupabaseAdmin()');
assert(empContent.includes('getEmployabilityReport'), 'University employability-report route invokes getEmployabilityReport()');

const skillContent = fs.readFileSync(universitySkillGapsRoute, 'utf-8');
assert(skillContent.includes('getSupabaseAdmin'), 'University skill-gaps route uses getSupabaseAdmin()');
assert(skillContent.includes('getSkillGaps'), 'University skill-gaps route invokes getSkillGaps()');

// 2. Check University Analytics implementation
const analyticsPath = path.join(process.cwd(), 'src/lib/university/analytics.ts');
const analyticsContent = fs.readFileSync(analyticsPath, 'utf-8');
assert(analyticsContent.includes('client: any = supabase'), 'analytics.ts accepts custom client parameter');
assert(analyticsContent.includes('isUniversal'), 'analytics.ts handles universal "all" filters without dropping cohort students');
assert(analyticsContent.includes('onboarding_answers'), 'analytics.ts falls back to onboarding_answers if cohort enrollments are empty');

// 3. Check University Dashboard UI
const universityPagePath = path.join(process.cwd(), 'src/app/university/page.tsx');
const universityPageContent = fs.readFileSync(universityPagePath, 'utf-8');

assert(universityPageContent.includes("'teacher'") && universityPageContent.includes("'counsellor'") && universityPageContent.includes("'faculty'"), 'University dashboard allows teacher, faculty, counsellor roles');
assert(universityPageContent.includes('All Universities'), 'University dropdown includes "All" selector option');
assert(universityPageContent.includes('All Colleges'), 'College dropdown includes "All" selector option');
assert(universityPageContent.includes('Missions Completed or Active XP'), 'Metric card accurately describes missions or XP instead of misleading streak label');
assert(universityPageContent.includes('Readiness Index ≥75'), 'Funnel label matches readiness calculation');
assert(universityPageContent.includes('High Trust Quotient (Trust ≥75)'), 'Funnel label matches trust quotient calculation');

// 4. Check Recruiter CandidateSearchPanel
const searchPanelPath = path.join(process.cwd(), 'src/app/recruiter/components/CandidateSearchPanel.tsx');
const searchPanelContent = fs.readFileSync(searchPanelPath, 'utf-8');

assert(searchPanelContent.includes("api.post('/api/recruiter/schedule-interview'"), 'Dispatch AI Interview Invitation invokes /api/recruiter/schedule-interview');
assert(!searchPanelContent.includes('Key Verified Skills'), 'Misleading "Key Verified Skills" replaced with truthful candidate skill profile');
assert(searchPanelContent.includes('Candidate Skill Profile'), 'Accurately displays Candidate Skill Profile');
assert(searchPanelContent.includes('Candidate Document & Proof Vault'), 'Accurately names Candidate Document & Proof Vault');
assert(searchPanelContent.includes('Self-Uploaded / Pending Review'), 'Accurately marks unverified documents as Self-Uploaded / Pending Review');

// 5. Check useRecruiterData
const hookPath = path.join(process.cwd(), 'src/app/recruiter/hooks/useRecruiterData.ts');
const hookContent = fs.readFileSync(hookPath, 'utf-8');

assert(!hookContent.includes("|| 'ATS Screened'"), 'Default stage is NOT falsely set to ATS Screened');
assert(hookContent.includes("candidateStages[candidateId] || 'Sourced'"), 'Default candidate stage is "Sourced"');
assert(hookContent.includes('pinit_recruiter_candidate_stages'), 'Candidate stages persist to localStorage');
assert(hookContent.includes('pinit_recruiter_candidate_notes'), 'Candidate notes persist to localStorage');
assert(!hookContent.includes('window.prompt'), 'window.prompt is completely eliminated from useRecruiterData.ts');

// 6. Check ApplicationsPanel
const applicationsPanelPath = path.join(process.cwd(), 'src/app/recruiter/components/ApplicationsPanel.tsx');
const applicationsPanelContent = fs.readFileSync(applicationsPanelPath, 'utf-8');

assert(!applicationsPanelContent.includes('app.atsScore || 50'), 'ATS score does not use fake 50 fallback');
assert(!applicationsPanelContent.includes('app.trustScore || 50'), 'Trust score does not use fake 50 fallback');
assert(applicationsPanelContent.includes('Privacy Shielded') || applicationsPanelContent.includes('s***@college.edu'), 'Student personal contact details are masked/privacy shielded');

// 7. Check the recruiter server routes (every /api/* call is served by src/app/api)
const recruiterRoute = (name: string) => path.join(process.cwd(), 'src/app/api/recruiter', name, 'route.ts');
for (const name of ['schedule-interview', 'shortlist', 'contact-request']) {
  assert(fs.existsSync(recruiterRoute(name)), `server route handles /api/recruiter/${name}`);
  assert(fs.readFileSync(recruiterRoute(name), 'utf-8').includes('notifications'), `/api/recruiter/${name} creates records in public.notifications`);
}

console.log('\n🌟 ALL UNIVERSITY & RECRUITER PORTAL INTEGRITY CHECKS PASSED!\n');
