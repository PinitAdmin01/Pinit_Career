// src/app/api/quest/verify/route.ts
/**
 * ============================================================================
 * PRACTICAL CAPABILITY VERIFICATION ENDPOINT
 * ============================================================================
 * 
 * Endpoint: POST /api/quest/verify
 * 
 * Purpose:
 * Evaluates candidate code submissions and Socratic explanations for claimed skills.
 * Transitions candidate skills from `CLAIMED` (`DOCUMENT_SUPPORTED`) to `DEMONSTRATED`
 * or `VERIFIED_COMPETENCY` and recalibrates the live QT1 Capability Score (0–100).
 * 
 * Pipeline Stages:
 * - STAGE 1: Authentication & Request Middleware Validation
 * - STAGE 2: Challenge Lookup / Dynamic Generation (practicalVerificationEngine.ts)
 * - STAGE 3: Socratic Keyterm & Code Logic Evaluation
 * - STAGE 4: Database Sync & QT1 Score Recalibration
 */

import { NextResponse } from 'next/server';
import { requireUserFromRequest, getBearerToken, getAuthoritativeSupabaseClient } from '@/lib/server/requireAuth';
import {
  getChallengesForSkill,
  evaluateVerificationSubmission,
  calculateProgressiveQT1,
  VerificationSubmission
} from '@/lib/ats/practicalVerificationEngine';

export async function POST(req: Request) {
  const startTime = Date.now();
  console.log(`\n================================================================================`);
  console.log(`🎯 [PRACTICAL VERIFICATION PIPELINE]: New skill verification request received at ${new Date().toISOString()}`);
  console.log(`================================================================================`);

  try {
    // STAGE 1: Authentication & Input Validation
    console.log(`🔐 [STAGE 1/4 - Auth Middleware]: Authenticating candidate user session...`);
    const gated = await requireUserFromRequest(req);
    if (gated.error) {
      console.error(`❌ [STAGE 1/4 - Auth Error]: Unauthorized verification attempt.`, gated.error);
      return gated.error;
    }

    const userId = gated.user.id;
    const token = getBearerToken(req);
    const supabase = getAuthoritativeSupabaseClient(token);
    const body = await req.json();
    const { skillName, challengeId, candidateCode, socraticAnswers, verifiedCompetenciesCount = 0, verifiedProjectsCount = 0 } = body;

    console.log(`📋 [STAGE 1/4 - Input Ingested]: User = "${userId}", Skill = "${skillName}", Challenge ID = "${challengeId || 'auto'}"`);

    if (!skillName) {
      console.error(`❌ [STAGE 1/4 - Validation Error]: Missing "skillName" parameter in request body.`);
      return NextResponse.json({ error: 'skillName is required' }, { status: 400 });
    }

    // STAGE 2: Challenge Lookup
    console.log(`🎯 [STAGE 2/4 - Challenge Retrieval]: Locating challenges for "${skillName}"...`);
    const challenges = getChallengesForSkill(skillName);
    const targetChallenge = challenges.find(c => c.id === challengeId) || challenges[0];

    if (!targetChallenge) {
      console.error(`❌ [STAGE 2/4 - Retrieval Error]: No challenge found for skill "${skillName}".`);
      return NextResponse.json({ error: `No challenge available for skill: ${skillName}` }, { status: 404 });
    }

    // STAGE 3: Socratic Evaluation
    console.log(`🔬 [STAGE 3/4 - Socratic Evaluation]: Evaluating submission against rubric...`);
    const submission: VerificationSubmission = {
      challengeId: targetChallenge.id,
      skillName: targetChallenge.skillName,
      candidateCode: candidateCode || '',
      socraticAnswers: socraticAnswers || [],
      timeSpentSeconds: body.timeSpentSeconds || 60
    };

    const evaluation = evaluateVerificationSubmission(targetChallenge, submission);
    console.log(`✅ [STAGE 3/4 - Evaluation Complete]: Passed = ${evaluation.passed}, Score = ${evaluation.score}/100, Status = "${evaluation.newCapabilityStatus}"`);

    // STAGE 4: QT1 Recalibration & DB Sync
    console.log(`📊 [STAGE 4/4 - QT1 Recalibration]: Recalibrating capability score...`);
    const updatedCompetencyCount = evaluation.passed ? verifiedCompetenciesCount + 1 : verifiedCompetenciesCount;
    const recalibrated = calculateProgressiveQT1(updatedCompetencyCount, verifiedProjectsCount, 85);

    // Save earned competency badge to database if passed
    if (evaluation.passed) {
      console.log(`💾 [STAGE 4/4 - DB Sync]: Persisting verified competency badge for "${skillName}"...`);
      const { error: dbErr } = await supabase
        .from('vault_items')
        .insert([{
          user_id: userId,
          title: `Verified Competency: ${skillName}`,
          item_type: 'certification',
          organization_name: 'PinIT CareerOS Socratic Quest Sentinel',
          description: `Demonstrated practical mastery in ${skillName} (Score: ${evaluation.score}/100). Capability Status: ${evaluation.newCapabilityStatus}.`,
          verified: true,
          ai_confidence_score: evaluation.score,
          skill_tags: [skillName, 'Verified Competency', 'Practical Master'],
          is_public: true,
          used_in_resume: true,
          used_in_portfolio: true
        }]);

      if (dbErr) {
        console.error(`❌ [STAGE 4/4 - DB Sync Error]:`, dbErr.message);
        return NextResponse.json({ error: dbErr.message || 'Failed to save competency badge to database' }, { status: 500 });
      }
      console.log(`✅ [STAGE 4/4 - DB Sync Complete]: Competency badge stored in vault.`);
    }

    const durationMs = Date.now() - startTime;
    console.log(`✨ [PIPELINE SUCCESS]: Practical verification completed in ${durationMs}ms.`);
    console.log(`================================================================================\n`);

    return NextResponse.json({
      success: true,
      ok: true,
      data: {
        evaluation,
        recalibratedQT1: recalibrated.qt1Score,
        breakdown: recalibrated.breakdown,
        challenge: targetChallenge
      },
      message: evaluation.feedback
    });
  } catch (err: any) {
    console.error(`💥 [PIPELINE FATAL ERROR in /api/quest/verify]:`, err);
    return NextResponse.json({ error: err?.message || 'Server error during practical verification' }, { status: 500 });
  }
}
