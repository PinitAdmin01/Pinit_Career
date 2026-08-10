import { NextResponse } from 'next/server';

/**
 * Teacher portal auth — exact usernames only, passwords from env (no weak defaults).
 * Intentional product demos remain the AuthContext accounts with password 111111.
 */
function buildAccounts(): Record<string, { password: string; role: 'teacher' | 'admin'; name: string }> {
  const teacherPw = process.env.TEACHER_DEMO_PASSWORD || '';
  const adminPw = process.env.TEACHER_ADMIN_PASSWORD || '';
  const accounts: Record<string, { password: string; role: 'teacher' | 'admin'; name: string }> = {};

  if (teacherPw.length >= 8) {
    accounts.teacher = { password: teacherPw, role: 'teacher', name: 'Teacher' };
  }
  if (adminPw.length >= 8) {
    accounts.admin = { password: adminPw, role: 'admin', name: 'Admin' };
  }
  return accounts;
}

export async function POST(req: Request) {
  try {
    const accounts = buildAccounts();
    if (Object.keys(accounts).length === 0) {
      return NextResponse.json(
        {
          error:
            'Teacher portal credentials are not configured. Set TEACHER_DEMO_PASSWORD / TEACHER_ADMIN_PASSWORD (min 8 chars).',
        },
        { status: 503 }
      );
    }

    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    const cleanUser = String(username).trim().toLowerCase();
    const account = accounts[cleanUser];

    if (!account || password !== account.password) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    const teacherProfile = {
      id: `t_${cleanUser}`,
      username: cleanUser,
      name: account.name,
      role: account.role,
      department: 'Computer Science & AI',
      email: `${cleanUser}@campus.edu`,
      avatarUrl: '',
      permissions: ['manage_courses', 'grade_exams', 'view_students'],
    };

    return NextResponse.json({
      success: true,
      teacher: teacherProfile,
      token: `t_token_${cleanUser}_${Date.now()}`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
