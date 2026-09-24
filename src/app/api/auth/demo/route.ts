import { NextRequest, NextResponse } from 'next/server';
import { isDemoAuthEnabled, DEMO_ROLE_BY_EMAIL } from '@/lib/demoAuth';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  if (!isDemoAuthEnabled()) {
    return NextResponse.json({ error: 'Demo auth is not enabled' }, { status: 403 });
  }

  let body: { email?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const email = (body.email || '').toLowerCase().trim();
  if (!email || !DEMO_ROLE_BY_EMAIL[email]) {
    return NextResponse.json({ error: 'Not a recognized demo email' }, { status: 400 });
  }

  const demoPassword = process.env.DEMO_AUTH_PASSWORD;
  if (!demoPassword) {
    return NextResponse.json({ error: 'Demo credentials not configured on server' }, { status: 503 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const { data, error } = await supabaseAdmin.auth.signInWithPassword({
    email,
    password: demoPassword,
  });

  if (error || !data.session) {
    // Demo account may not exist yet — attempt to create it
    const { data: signUpData, error: signUpErr } = await supabaseAdmin.auth.signUp({
      email,
      password: demoPassword,
    });

    if (signUpErr || !signUpData.session) {
      return NextResponse.json(
        { error: signUpErr?.message || 'Demo login failed' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      access_token: signUpData.session.access_token,
      refresh_token: signUpData.session.refresh_token,
    });
  }

  return NextResponse.json({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
  });
}
