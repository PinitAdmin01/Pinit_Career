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

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = (searchParams.get('q') || '').toLowerCase().trim();
    const filter = searchParams.get('filter') || 'all';

    const localData = getLocalData();
    let students = [...localData.mockStudents];

    // Compute relationship state for each student relative to current_user
    const relationships = new Map<string, string>();
    for (const f of localData.friendships) {
      const otherId = f.requester_id === 'current_user' ? f.addressee_id : (f.addressee_id === 'current_user' ? f.requester_id : null);
      if (otherId) {
        if (f.status === 'accepted') {
          relationships.set(otherId, 'friends');
        } else if (f.status === 'pending') {
          relationships.set(otherId, f.requester_id === 'current_user' ? 'sent' : 'received');
        }
      }
    }

    if (query) {
      students = students.filter((s: any) => {
        const nameMatch = s.name?.toLowerCase().includes(query);
        const headlineMatch = s.headline?.toLowerCase().includes(query);
        const collegeMatch = s.college?.toLowerCase().includes(query);
        const courseMatch = s.course?.toLowerCase().includes(query);
        const goalMatch = s.careerGoal?.toLowerCase().includes(query);
        const skillMatch = s.skills?.some((sk: string) => sk.toLowerCase().includes(query));
        return nameMatch || headlineMatch || collegeMatch || courseMatch || goalMatch || skillMatch;
      });
    }

    if (filter === 'college') {
      students = students.filter((s: any) => s.college?.toLowerCase().includes('bgs'));
    } else if (filter === 'skills') {
      students = students.filter((s: any) => s.skills?.some((sk: string) => ['React', 'TypeScript', 'Node.js', 'Python'].includes(sk)));
    }

    const results = students.map((s: any) => ({
      ...s,
      relationship: relationships.get(s.id) || 'none'
    }));

    return NextResponse.json({ ok: true, results, total: results.length });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Search failed' }, { status: 500 });
  }
}
