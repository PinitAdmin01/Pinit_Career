export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'src/lib/data/friends_db.json');

export async function GET() {
  try {
    let mockStudents: any[] = [];
    if (fs.existsSync(dbPath)) {
      const d = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      mockStudents = d.mockStudents || [];
    }

    const suggestions = mockStudents.slice(0, 4).map((s: any) => ({
      id: s.id,
      name: s.name,
      headline: s.headline,
      avatar: s.avatar,
      college: s.college,
      matchReason: s.matchReason || 'Common engineering interest',
      skills: s.skills.slice(0, 3)
    }));

    return NextResponse.json({ ok: true, suggestions });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to fetch suggestions' }, { status: 500 });
  }
}
