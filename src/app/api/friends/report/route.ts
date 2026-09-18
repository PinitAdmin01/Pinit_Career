import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const DB_PATH = path.join(process.cwd(), 'src', 'lib', 'data', 'friends_db.json');

function readDb() {
  try {
    if (fs.existsSync(DB_PATH)) {
      return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    }
  } catch (err) {
    console.error('Error reading friends_db.json:', err);
  }
  return { moderationReports: [] };
}

function writeDb(data: any) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing friends_db.json:', err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { reportedStudentId, reportedStudentName, reason, details } = body;

    if (!reportedStudentId || !reason || typeof reason !== 'string' || !reason.trim()) {
      return NextResponse.json({ ok: false, error: 'Student ID and non-empty Reason are required' }, { status: 400 });
    }
    if (reportedStudentId === 'current_user') {
      return NextResponse.json({ ok: false, error: 'Cannot report yourself' }, { status: 400 });
    }
    if (details && typeof details === 'string' && details.length > 2000) {
      return NextResponse.json({ ok: false, error: 'Report details exceed maximum length of 2000 characters' }, { status: 400 });
    }

    const db = readDb();
    if (!db.moderationReports) db.moderationReports = [];

    const newReport = {
      id: `report-${Date.now()}`,
      reporterId: 'current_user',
      reportedStudentId,
      reportedStudentName: reportedStudentName || 'Student',
      reason,
      details: details || '',
      status: 'pending_review',
      createdAt: new Date().toISOString()
    };

    db.moderationReports.unshift(newReport);
    writeDb(db);

    return NextResponse.json({
      ok: true,
      report: newReport,
      message: 'Report submitted successfully. PinIT Campus Trust & Safety team will review within 24 hours.'
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
