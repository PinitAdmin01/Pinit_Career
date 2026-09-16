import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';
import { validateBody } from '@/lib/server/validate';
import { z } from 'zod';

const CareerTwinResultsSchema = z.object({
  answers: z.record(z.string(), z.any()).optional(),
  onboardingAnswers: z.record(z.string(), z.any()).optional(),
}).passthrough();

export interface CareerPath {
  name: string;
  probability: number;
  role: string;
  salary_range: string;
  timeline: string;
  requirements: string[];
  fit_score: number;
  risk: string;
  milestones: Array<{ month: number; milestone: string }>;
}

export interface CareerSimulation {
  current_trajectory: string;
  paths: CareerPath[];
  startup_founder_fit: number;
  mba_suitability: number;
  global_readiness: number;
  top_recommendation: string;
  urgent_actions: string[];
}

function calculateSimulation(profile: any, answers?: any): CareerSimulation {
  const targetRole = answers?.role || profile?.target_role || 'Full Stack Engineer';
  const skills: string[] = [
    ...(Array.isArray(profile?.skill_tags) ? profile.skill_tags : []),
    ...(typeof answers?.skills === 'string' ? answers.skills.split(',').map((s: string) => s.trim()) : []),
  ].filter(Boolean);

  const weakAreas: string[] = Array.isArray(profile?.weak_areas) ? profile.weak_areas : ['System Design', 'DSA - Trees'];
  const atsScore = Number(profile?.ats_score) || 0;
  const trustScore = Number(profile?.trust_score) || 0;
  const executionScore = Number(profile?.execution_score) || 0;
  const leadershipScore = Number(profile?.leadership_score) || 0;
  const communicationScore = Number(profile?.communication_score) || 0;
  const innovationScore = Number(profile?.innovation_score) || 0;

  // Base readiness multiplier
  const skillCount = Math.max(1, skills.length);
  const coreCompetencyFit = Math.min(95, Math.max(45, Math.round(atsScore * 0.45 + trustScore * 0.35 + (skillCount * 3))));

  // Defect 098 Fix: Salary computation decoupled from mutable client XP & unverified self-reported skill_tags
  // Brackets based strictly on verified competencies and completed verified evidence:
  // Entry Level (<= 2): ₹4–7 LPA | Intermediate (3–6): ₹8–14 LPA | Advanced (7+): ₹15–24 LPA
  const verifiedCount = typeof profile?.verified_skills_count === 'number' && profile.verified_skills_count > 0
    ? profile.verified_skills_count
    : (Array.isArray(profile?.completed_quests) && profile.completed_quests.length > 0)
      ? Math.floor(profile.completed_quests.length / 2)
      : (Number(profile?.missions_completed) > 0)
        ? Math.floor(Number(profile.missions_completed) / 2)
        : 0;

  let baseSalaryMin: number;
  let baseSalaryMax: number;
  if (verifiedCount <= 2) {
    baseSalaryMin = 4;
    baseSalaryMax = 7;
  } else if (verifiedCount <= 6) {
    baseSalaryMin = 8;
    baseSalaryMax = 14;
  } else {
    baseSalaryMin = 15;
    baseSalaryMax = 24;
  }

  // Derive Trajectory Paths
  const paths: CareerPath[] = [
    {
      name: `Core Industry Track (${targetRole})`,
      role: targetRole,
      probability: Math.min(96, Math.max(55, Math.round(coreCompetencyFit * 0.9 + (100 - weakAreas.length * 8) * 0.1))),
      salary_range: `₹${baseSalaryMin} - ${baseSalaryMax} LPA`,
      timeline: `${Math.max(3, 8 - Math.round(atsScore / 25))} - ${Math.max(6, 12 - Math.round(atsScore / 25))} Months`,
      requirements: ['Verified Capstone Defense', 'ATS Score >= 75', ...weakAreas.slice(0, 2).map(w => `Mastery in ${w}`)],
      fit_score: coreCompetencyFit,
      risk: weakAreas.length > 2 ? 'Moderate: Skill gaps in system architecture require remediation' : 'Low: Core competencies aligned with current market demand',
      milestones: [
        { month: 2, milestone: `Resolve core gap: ${weakAreas[0] || 'Data Structures'}` },
        { month: 4, milestone: 'Pass Capstone Viva & Publish Verified SHA-256 Proof' },
        { month: 6, milestone: 'Complete 3 Tier-1 Mock Technical Interviews' },
        { month: 8, milestone: `Receive placement offers for ${targetRole}` },
      ],
    },
    {
      name: 'High-Scale Product / Tech Lead Track',
      role: `Senior ${targetRole}`,
      probability: Math.min(90, Math.max(40, Math.round(coreCompetencyFit * 0.75 + executionScore * 0.25 - (weakAreas.length * 4)))),
      salary_range: `₹${Math.round(baseSalaryMin * 1.5)} - ${Math.round(baseSalaryMax * 1.7)} LPA`,
      timeline: '12 - 18 Months',
      requirements: ['Distributed Systems Defense', 'Production Scale Deployment Evidence', 'High-Trust Mentorship Voucher'],
      fit_score: Math.min(92, Math.max(40, Math.round(coreCompetencyFit * 0.8 + executionScore * 0.15))),
      risk: 'Elevated: Demands deep distributed architecture and concurrency defense',
      milestones: [
        { month: 3, milestone: 'Deploy microservices pipeline with automated CI/CD' },
        { month: 6, milestone: 'Optimize query throughput and DB sharding benchmarks' },
        { month: 12, milestone: 'Defend High-Scale Architecture with Senior Industry Panel' },
      ],
    },
    {
      name: 'Venture & Early-Stage Startup Founder',
      role: 'Technical Co-Founder / Founding Engineer',
      probability: Math.min(92, Math.max(35, Math.round((innovationScore * 0.5 + leadershipScore * 0.3 + executionScore * 0.2) * 0.95))),
      salary_range: `₹${Math.max(10, Math.round(baseSalaryMin * 1.1))} LPA + 2-5% Equity`,
      timeline: '6 - 12 Months',
      requirements: ['0-to-1 Product Launch Proof', 'User Traction Validation', 'Rapid Prototyping Velocity'],
      fit_score: Math.min(95, Math.max(40, Math.round((innovationScore * 0.6 + leadershipScore * 0.4)))),
      risk: 'High Market Risk: Product-market fit uncertainty compensated by high equity upside',
      milestones: [
        { month: 2, milestone: 'Ship functional MVP to at least 100 active beta users' },
        { month: 4, milestone: 'Pitch to campus incubator or angel syndicate' },
        { month: 8, milestone: 'Scale initial revenue / recurring transaction metrics' },
      ],
    },
  ];

  const founderFit = Math.min(98, Math.max(45, Math.round(innovationScore * 0.45 + leadershipScore * 0.35 + executionScore * 0.2)));
  const globalReadiness = Math.min(98, Math.max(40, Math.round(communicationScore * 0.5 + atsScore * 0.35 + (profile?.certifications?.length || 1) * 5)));
  const mbaSuitability = Math.min(95, Math.max(35, Math.round(leadershipScore * 0.55 + communicationScore * 0.45)));

  return {
    current_trajectory: `${targetRole} Placement Velocity (${coreCompetencyFit}% Market Readiness)`,
    paths,
    startup_founder_fit: founderFit,
    mba_suitability: mbaSuitability,
    global_readiness: globalReadiness,
    top_recommendation: weakAreas.length > 0 
      ? `Prioritize closing ${weakAreas[0]} to unlock the ${paths[0].salary_range} core trajectory.`
      : `High readiness detected. Target top-tier product residencies immediately.`,
    urgent_actions: weakAreas.map(w => `Complete targeted quest & mock viva for ${w}`),
  };
}

export async function GET(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const userId = gated.user!.id;

    // Fetch user profile from Supabase
    let profileData: any = null;
    try {
      const supabase = getSupabaseAdmin();
      // DEF-056 Fix: Query canonical 'users' table instead of non-existent 'profiles' table
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      profileData = data;
    } catch {
      // Fallback
    }

    const answers = profileData?.onboarding_answers || (gated.user as any)?.onboardingAnswers;
    const hasProfileData = Boolean(
      profileData && (
        profileData.onboarding_answers ||
        profileData.target_role ||
        (Array.isArray(profileData.skill_tags) && profileData.skill_tags.length > 0) ||
        Number(profileData.ats_score) > 0
      )
    );
    const hasAnswers = Boolean(answers && (answers.role || answers.skills));

    // Defect 097: Do not generate fake default simulations for un-onboarded candidates
    if (!hasProfileData && !hasAnswers) {
      return NextResponse.json({
        ok: false,
        needsOnboarding: true,
        message: 'Complete onboarding diagnostics and skill assessment to generate your personalized Career Twin simulation.',
      }, { status: 200 });
    }

    const simulation = calculateSimulation(profileData || gated.user, answers);
    return NextResponse.json({ ok: true, simulation });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const rawBody = await req.json().catch(() => ({}));
    const { data, error } = validateBody(CareerTwinResultsSchema, rawBody);
    if (error) return error;

    const customAnswers = data.answers || data.onboardingAnswers;

    let profileData: any = null;
    try {
      const supabase = getSupabaseAdmin();
      // DEF-056 Fix: Query canonical 'users' table instead of non-existent 'profiles' table
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('id', gated.user!.id)
        .maybeSingle();
      profileData = data;
    } catch {}

    const hasProfileData = Boolean(
      profileData && (
        profileData.onboarding_answers ||
        profileData.target_role ||
        (Array.isArray(profileData.skill_tags) && profileData.skill_tags.length > 0) ||
        Number(profileData.ats_score) > 0
      )
    );
    const hasAnswers = Boolean(customAnswers && (customAnswers.role || customAnswers.skills));

    if (!hasProfileData && !hasAnswers) {
      return NextResponse.json({
        ok: false,
        needsOnboarding: true,
        message: 'Complete onboarding diagnostics and skill assessment to generate your personalized Career Twin simulation.',
      }, { status: 200 });
    }

    const simulation = calculateSimulation(profileData || gated.user, customAnswers);
    return NextResponse.json({ ok: true, simulation });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
