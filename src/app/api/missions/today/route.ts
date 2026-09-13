import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { PathwayApiService } from '@/lib/api/pathwayApi';
import { WorkloadBand } from '@/lib/pathway/competencySchema';

export async function GET(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;
    const studentId = gated.user!.id;

    const url = new URL(req.url);
    const bandParam = (url.searchParams.get('workloadBand') || 'standard') as WorkloadBand;
    const workloadBand = (['standard', 'light', 'exam_pause'].includes(bandParam) ? bandParam : 'standard') as WorkloadBand;

    const missionsData = await PathwayApiService.getDynamicDailyMissions(studentId, workloadBand);
    // DEF-010 / DEF-017 Schema Parity: Map DailyMissionSlot to Mission model expected by useMissionsToday hook
    const allSlots = [...(missionsData.coreMissions || []), ...(missionsData.optionalMissions || [])];
    const mappedMissions = allSlots.map(m => ({
      id: m.id,
      title: m.title,
      description: m.desc,
      type: m.category === 'learn' ? 'personality' : 'skill',
      status: m.isCompleted ? 'completed' : 'pending',
      trust_reward: Math.round((m.xpReward || 50) / 2),
      estimated_minutes: m.estDurationMinutes || 30,
      source_weakness: m.competencyId,
      target_gap: m.title,
      role_requirement: m.slotType === 'core' ? 'Core Curriculum Requirement' : 'Enrichment Track'
    }));

    return NextResponse.json({
      ok: true,
      missions: mappedMissions,
      ...missionsData
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch daily missions' }, { status: 500 });
  }
}
