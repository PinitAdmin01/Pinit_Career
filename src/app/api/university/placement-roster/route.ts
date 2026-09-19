import { NextRequest, NextResponse } from 'next/server';

export interface VerifiedStudentPlacementCandidate {
  id: string;
  name: string;
  usn: string;
  college: string;
  targetRole: string;
  readinessPercentage: number;
  academicBaseline: number;
  verifiedEvidence: number;
  pinsMinted: number;
  diagnosticStatus: 'ready' | 'needs_remediation';
  competencyProofs: string[];
}

const MOCK_ROSTER: VerifiedStudentPlacementCandidate[] = [
  {
    id: 'cand-001',
    name: 'Aarav Sharma',
    usn: '1MS21CS045',
    college: 'M.S. Ramaiah Institute of Technology',
    targetRole: 'Full-Stack Software Engineer',
    readinessPercentage: 92,
    academicBaseline: 84,
    verifiedEvidence: 94,
    pinsMinted: 340,
    diagnosticStatus: 'ready',
    competencyProofs: ['6 Capstone Commits Signed', 'HMAC Security Lab Pass', 'JWT RBAC Shipped']
  },
  {
    id: 'cand-002',
    name: 'Priya Venkatesh',
    usn: '1RV21IS088',
    college: 'RV College of Engineering',
    targetRole: 'Cloud & DevOps Architect',
    readinessPercentage: 88,
    academicBaseline: 80,
    verifiedEvidence: 90,
    pinsMinted: 295,
    diagnosticStatus: 'ready',
    competencyProofs: ['Blue-Green Deploy Pipeline', 'Kubernetes Pod Recovery Lab', 'Docker Compose Microservices']
  },
  {
    id: 'cand-003',
    name: 'Rohan Deshmukh',
    usn: '1BM21CS112',
    college: 'BMS College of Engineering',
    targetRole: 'AI/ML Systems Engineer',
    readinessPercentage: 86,
    academicBaseline: 82,
    verifiedEvidence: 88,
    pinsMinted: 280,
    diagnosticStatus: 'ready',
    competencyProofs: ['RAG Retrieval Evaluation Harness', 'ETL Data Pipeline Signed', 'Prompt Red-Teaming Checklist']
  },
  {
    id: 'cand-004',
    name: 'Sneha Kulkarni',
    usn: '1DS21EC074',
    college: 'Dayananda Sagar College of Engineering',
    targetRole: 'Data Platform Engineer',
    readinessPercentage: 84,
    academicBaseline: 78,
    verifiedEvidence: 86,
    pinsMinted: 260,
    diagnosticStatus: 'ready',
    competencyProofs: ['Streaming Quality Gate', 'SQL Query Plan Optimization', 'dbt Modeling Suite Green']
  },
  {
    id: 'cand-005',
    name: 'Vikram Nair',
    usn: '1PE21CS150',
    college: 'PES University',
    targetRole: 'Full-Stack Software Engineer',
    readinessPercentage: 73,
    academicBaseline: 76,
    verifiedEvidence: 71,
    pinsMinted: 185,
    diagnosticStatus: 'needs_remediation',
    competencyProofs: ['React State Management Pass', 'REST API Basics Pass']
  },
  {
    id: 'cand-006',
    name: 'Ananya Gupta',
    usn: '1MS21IS019',
    college: 'M.S. Ramaiah Institute of Technology',
    targetRole: 'AI/ML Systems Engineer',
    readinessPercentage: 68,
    academicBaseline: 75,
    verifiedEvidence: 64,
    pinsMinted: 140,
    diagnosticStatus: 'needs_remediation',
    competencyProofs: ['Python Core Diagnostic Passed']
  }
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role') || 'all';
    const minReadiness = parseInt(searchParams.get('minReadiness') || '0', 10);
    const search = (searchParams.get('search') || '').toLowerCase().trim();

    let filtered = MOCK_ROSTER;

    if (role !== 'all') {
      filtered = filtered.filter(s => s.targetRole.toLowerCase().includes(role.toLowerCase()));
    }

    if (minReadiness > 0) {
      filtered = filtered.filter(s => s.readinessPercentage >= minReadiness);
    }

    if (search) {
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(search) ||
        s.usn.toLowerCase().includes(search) ||
        s.college.toLowerCase().includes(search)
      );
    }

    return NextResponse.json({
      success: true,
      count: filtered.length,
      candidates: filtered,
      generatedAt: new Date().toISOString()
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
