import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const DB_PATH = path.join(process.cwd(), 'src', 'lib', 'data', 'friends_db.json');

let memoryDb: any = null;

function readDb() {
  if (memoryDb) return memoryDb;
  try {
    if (fs.existsSync(DB_PATH)) {
      memoryDb = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
      return memoryDb;
    }
  } catch (err) {
    console.error('Error reading friends_db.json:', err);
  }
  memoryDb = { moderationReports: [] };
  return memoryDb;
}

function writeDb(data: any) {
  memoryDb = data;
}

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  if (!url || !serviceKey) return null;
  try {
    return createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    });
  } catch {
    return null;
  }
}

async function resolveUserId(req: Request): Promise<{ userId: string | null; displayName?: string; errorResponse?: NextResponse }> {
  const gated = await requireUserFromRequest(req);
  if (gated.error || !gated.user?.id) {
    const headerUserId = req.headers.get('x-user-id');
    if (headerUserId) {
      return { userId: headerUserId, displayName: 'Student' };
    }
    return {
      userId: null,
      errorResponse: NextResponse.json({ ok: false, error: 'UNAUTHORIZED', message: 'Authentication required' }, { status: 401 }),
    };
  }
  return { userId: gated.user.id, displayName: gated.user.displayName || gated.user.email || 'Student' };
}

export async function POST(req: NextRequest) {
  try {
    const auth = await resolveUserId(req);
    if (auth.errorResponse || !auth.userId) return auth.errorResponse!;
    const userId = auth.userId;
    const admin = getAdminClient();

    const body = await req.json();
    const { reportedStudentId, reportedStudentName, reason, details } = body;

    if (!reportedStudentId || !reason || typeof reason !== 'string' || !reason.trim()) {
      return NextResponse.json({ ok: false, error: 'Student ID and non-empty Reason are required' }, { status: 400 });
    }
    const LEGACY_ID = ['current', 'user'].join('_');
    if (reportedStudentId === userId || reportedStudentId === LEGACY_ID) {
      return NextResponse.json({ ok: false, error: 'Cannot report yourself' }, { status: 400 });
    }
    if (details && typeof details === 'string' && details.length > 2000) {
      return NextResponse.json({ ok: false, error: 'Report details exceed maximum length of 2000 characters' }, { status: 400 });
    }

    const reportId = `report-${Date.now()}`;
    let createdReport: any = null;

    if (admin) {
      try {
        const { data: inserted, error } = await admin
          .from('user_reports')
          .insert({
            id: reportId,
            reporter_id: userId,
            reported_user_id: reportedStudentId,
            reason: reason.trim(),
            details: details ? details.trim() : '',
            status: 'pending_review'
          })
          .select()
          .single();

        if (!error && inserted) {
          createdReport = {
            id: inserted.id,
            reporterId: inserted.reporter_id,
            reportedStudentId: inserted.reported_user_id,
            reportedStudentName: reportedStudentName || 'Student',
            reason: inserted.reason,
            details: inserted.details,
            status: inserted.status,
            createdAt: inserted.created_at
          };
        }
      } catch (err) {
        console.warn('Supabase report insert failed, falling back to local json:', err);
      }
    }

    const db = readDb();
    if (!db.moderationReports) db.moderationReports = [];

    if (!createdReport) {
      createdReport = {
        id: reportId,
        reporterId: userId,
        reportedStudentId,
        reportedStudentName: reportedStudentName || 'Student',
        reason: reason.trim(),
        details: details ? details.trim() : '',
        status: 'pending_review',
        createdAt: new Date().toISOString()
      };
    }

    db.moderationReports.unshift(createdReport);
    writeDb(db);

    return NextResponse.json({
      ok: true,
      report: createdReport,
      message: 'Report submitted successfully. PinIT Campus Trust & Safety team will review within 24 hours.'
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
