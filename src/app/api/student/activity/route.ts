import { NextResponse } from 'next/server';
import { requireUserFromRequest, getBearerToken, getAuthoritativeSupabaseClient } from '@/lib/server/requireAuth';

interface StudentAuditItem {
  id: string;
  actor_id: string;
  action: string;
  timestamp: string;
  meta?: {
    questTitle?: string;
    title?: string;
    roomTitle?: string;
    [key: string]: any;
  };
}

export async function GET(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const studentId = gated.user!.id;
    const token = getBearerToken(req);
    const supabase = getAuthoritativeSupabaseClient(token);

    const items: StudentAuditItem[] = [];
    const seenIds = new Set<string>();

    // 1. Query audit_logs strictly for entries related to this student
    try {
      const { data: auditLogs, error: auditErr } = await supabase
        .from('audit_logs')
        .select('*')
        .or(`actor_id.eq.${studentId},target_id.eq.${studentId}`)
        .order('created_at', { ascending: false })
        .limit(50);

      if (!auditErr && Array.isArray(auditLogs)) {
        for (const row of auditLogs) {
          const id = String(row.id || `${studentId}-${items.length}`);
          if (!seenIds.has(id)) {
            seenIds.add(id);
            items.push({
              id,
              actor_id: String(row.actor_id || studentId),
              action: String(row.action || 'system_event'),
              timestamp: String(row.timestamp || row.created_at || new Date().toISOString()),
              meta: row.meta || {},
            });
          }
        }
      }
    } catch {
      // Supabase table may not exist or query error; proceed
    }

    // 2. Query quest_completions for student's completed quests
    try {
      const { data: questCompletions, error: questErr } = await supabase
        .from('quest_completions')
        .select('*')
        .eq('user_id', studentId)
        .order('completed_at', { ascending: false })
        .limit(50);

      if (!questErr && Array.isArray(questCompletions)) {
        for (const row of questCompletions) {
          const id = `quest-${row.id || row.quest_id}`;
          if (!seenIds.has(id)) {
            seenIds.add(id);
            items.push({
              id,
              actor_id: studentId,
              action: 'quest_complete',
              timestamp: String(row.completed_at || row.created_at || new Date().toISOString()),
              meta: {
                questTitle: row.quest_title || row.quest_id || 'Completed Learning Quest',
                xp: row.xp || 150,
              },
            });
          }
        }
      }
    } catch {
      // Non-blocking
    }

    // Sort descending by timestamp
    items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return NextResponse.json({
      log: items,
      activity: items,
      count: items.length,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const studentId = gated.user!.id;
    const token = getBearerToken(req);
    const supabase = getAuthoritativeSupabaseClient(token);

    const body = await req.json().catch(() => ({}));
    const action = String(body.action || 'user_activity');
    const meta = body.meta || {};
    const now = new Date().toISOString();

    // 1. Record student event into audit_logs (separated from admin audit trails)
    try {
      const insRes = await supabase.from('audit_logs').insert({
        actor_id: studentId,
        target_id: studentId,
        action,
        meta,
        created_at: now,
      });
      if (insRes.error) {
        console.warn('[Student Activity] audit_logs insert error:', insRes.error.message);
      }
    } catch {
      // Non-blocking
    }

    const newLog: StudentAuditItem = {
      id: `act-${Date.now()}`,
      actor_id: studentId,
      action,
      timestamp: now,
      meta,
    };

    return NextResponse.json({
      ok: true,
      entry: newLog,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
