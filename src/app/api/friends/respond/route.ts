export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'src/lib/data/friends_db.json');

function getLocalData() {
  try {
    if (fs.existsSync(dbPath)) {
      return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    }
  } catch {}
  return { friendships: [], mockStudents: [] };
}

function saveLocalData(data: any) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
  } catch {}
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { requestId, action } = body;

    if (!requestId || !action || !['accept', 'decline'].includes(action)) {
      return NextResponse.json({ ok: false, error: 'Valid requestId and action (accept/decline) required' }, { status: 400 });
    }

    const localData = getLocalData();
    const item = localData.friendships.find((f: any) => f.id === requestId);

    if (!item) {
      return NextResponse.json({ ok: false, error: 'Request not found' }, { status: 404 });
    }

    item.status = action === 'accept' ? 'accepted' : 'declined';
    item.updated_at = new Date().toISOString();
    item.responded_at = new Date().toISOString();

    saveLocalData(localData);
    return NextResponse.json({ ok: true, status: item.status });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to respond to request' }, { status: 500 });
  }
}
