import { NextResponse } from 'next/server';

/**
 * Teacher portal auth must not accept username substring tricks
 * (e.g. "noteacher") or any password >= 4 chars.
 * Credentials come from env in production; defaults are demo-only accounts.
 */
const TEACHER_ACCOUNTS: Record<string, { password: string; role: 'teacher' | 'admin'; name: string }> = {
  teacher: {
    password: process.env.TEACHER_DEMO_PASSWORD || 'teacher1234',
    role: 'teacher',
    name: 'Teacher',
  },
  admin: {
    password: process.env.TEACHER_ADMIN_PASSWORD || process.env.TEACHER_DEMO_PASSWORD || 'admin1234',
    role: 'admin',
    name: 'Admin',
  },
};

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    const cleanUser = String(username).trim().toLowerCase();
    const account = TEACHER_ACCOUNTS[cleanUser];

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
