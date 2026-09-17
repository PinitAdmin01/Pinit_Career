export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { CURRENT_STUDENT_PROFILE, rankAndFilterStudents, MatchStudentProfile } from '@/lib/friends/matching';

const dbPath = path.resolve(process.cwd(), 'src/lib/data/friends_db.json');

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const filter = (searchParams.get('filter') || 'all') as any;

    let candidates: MatchStudentProfile[] = [
      {
        id: 'aishwarya_rao',
        name: 'Aishwarya Rao',
        headline: 'UI/UX & Frontend Technologist',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        college: 'Bangalore University',
        course: 'BCA',
        careerGoal: 'Product & Design Systems Architect',
        skills: ['UI/UX', 'React', 'Design'],
        online: true,
        careerScore: 92,
        xp: 3100,
        arenaWins: 18,
        projectsCount: 4
      },
      {
        id: 'rahul_shetty',
        name: 'Rahul Shetty',
        headline: 'Applied ML & Distributed Systems Specialist',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
        college: 'RVCE',
        course: 'B.Tech',
        careerGoal: 'AI Infrastructure Lead',
        skills: ['Python', 'AI/ML', 'Data Science'],
        online: true,
        careerScore: 88,
        xp: 2950,
        arenaWins: 24,
        projectsCount: 3
      },
      {
        id: 'sneha_iyer',
        name: 'Sneha Iyer',
        headline: 'Frontend Engineer & Web Perf Advocate',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
        college: 'Christ University',
        course: 'BCA',
        careerGoal: 'Frontend Developer',
        skills: ['Javascript', 'Web Dev', 'Product'],
        online: true,
        careerScore: 86,
        xp: 2600,
        arenaWins: 14,
        projectsCount: 5
      },
      {
        id: 'arjun_nair',
        name: 'Arjun Nair',
        headline: 'Cloud Security & Infrastructure Engineer',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        college: 'NIT Calicut',
        course: 'B.Tech',
        careerGoal: 'Cloud Security Architect',
        skills: ['Cybersecurity', 'Linux', 'Cloud'],
        online: true,
        careerScore: 84,
        xp: 2300,
        arenaWins: 19,
        projectsCount: 3
      },
      {
        id: 'karan_singh',
        name: 'Karan Singh',
        headline: 'Full Stack Node & MongoDB Developer',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        college: 'JAIN University',
        course: 'BCA',
        careerGoal: 'Fullstack Engineer',
        skills: ['React', 'Node.js', 'MongoDB'],
        online: true,
        careerScore: 82,
        xp: 2100,
        arenaWins: 11
      },
      {
        id: 'meera_krishnan',
        name: 'Meera Krishnan',
        headline: 'Product Designer & Design Systems Lead',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        college: 'Stella Maris',
        course: 'B.Com',
        careerGoal: 'Principal Product Designer',
        skills: ['UI/UX', 'Figma', 'Product Design'],
        online: true,
        careerScore: 87,
        xp: 2750,
        arenaWins: 8
      },
      {
        id: 'aditya_verma',
        name: 'Aditya Verma',
        headline: 'Computer Vision & Deep Learning Student',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
        college: 'VIT Vellore',
        course: 'B.Tech',
        careerGoal: 'Computer Vision Scientist',
        skills: ['Machine Learning', 'Python', 'OpenCV'],
        online: false,
        careerScore: 91,
        xp: 3200,
        arenaWins: 17
      },
      {
        id: 'pooja_kulkarni',
        name: 'Pooja Kulkarni',
        headline: 'Algorithms & Competitive DSA Duelist',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        college: 'Mumbai University',
        course: 'BCA',
        careerGoal: 'Distributed Systems Core Engineer',
        skills: ['Java', 'DSA', 'Problem Solving'],
        online: true,
        careerScore: 89,
        xp: 2900,
        arenaWins: 31
      }
    ];

    // Read additional candidates from friends_db.json if available
    if (fs.existsSync(dbPath)) {
      try {
        const d = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
        if (Array.isArray(d.mockStudents)) {
          d.mockStudents.forEach((ms: any) => {
            if (!candidates.some(c => c.id === ms.id)) {
              candidates.push(ms);
            }
          });
        }
      } catch (e) {
        console.error('Error loading friends_db.json in suggestions:', e);
      }
    }

    const ranked = rankAndFilterStudents(CURRENT_STUDENT_PROFILE, candidates, filter);

    return NextResponse.json({
      ok: true,
      filter,
      currentUser: CURRENT_STUDENT_PROFILE,
      totalMatches: ranked.length,
      suggestions: ranked
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to compute peer suggestions' }, { status: 500 });
  }
}