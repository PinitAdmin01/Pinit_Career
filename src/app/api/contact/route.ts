import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getClientIp, checkRateLimit } from '@/lib/server/rateLimit';

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const rateCheck = checkRateLimit(`contact:${ip}`, { limit: 5, windowMs: 60 * 1000 });
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'RATE_LIMIT_EXCEEDED', message: `Too many submissions. Please wait ${rateCheck.resetSec} seconds.` },
        { status: 429, headers: { 'Retry-After': String(rateCheck.resetSec) } }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'INVALID_PAYLOAD', message: 'Request body must be valid JSON.' }, { status: 400 });
    }

    const { name, email, subject, persona, institution, message } = body;

    if (!email || typeof email !== 'string' || !email.includes('@') || email.length > 254) {
      return NextResponse.json({ error: 'INVALID_EMAIL', message: 'A valid email address is required.' }, { status: 400 });
    }

    if (!message || typeof message !== 'string' || message.trim().length < 5) {
      return NextResponse.json({ error: 'INVALID_MESSAGE', message: 'Message must be at least 5 characters long.' }, { status: 400 });
    }

    if (message.length > 5000) {
      return NextResponse.json({ error: 'MESSAGE_TOO_LONG', message: 'Message cannot exceed 5000 characters.' }, { status: 400 });
    }

    const trimmedName = typeof name === 'string' ? name.trim().slice(0, 200) : 'Anonymous';
    const trimmedEmail = email.trim().toLowerCase();

    const metaParts: string[] = [];
    if (typeof subject === 'string' && subject.trim()) metaParts.push(`Subject: ${subject.trim()}`);
    if (typeof persona === 'string' && persona.trim()) metaParts.push(`Persona: ${persona.trim()}`);
    if (typeof institution === 'string' && institution.trim()) metaParts.push(`Institution: ${institution.trim()}`);

    const formattedMessage = metaParts.length > 0
      ? `[${metaParts.join(' | ')}]\n\n${message.trim()}`
      : message.trim();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    if (!supabaseUrl || !supabaseKey) {
      console.error('[Contact API] Missing Supabase configuration');
      return NextResponse.json({ error: 'SERVER_MISCONFIGURED', message: 'Database configuration missing.' }, { status: 503 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    });

    const { data, error } = await supabase
      .from('contact_submissions')
      .insert({
        name: trimmedName,
        email: trimmedEmail,
        message: formattedMessage
      })
      .select('id, created_at')
      .single();

    if (error) {
      console.error('[Contact API] Failed to insert contact submission:', error.message);
      return NextResponse.json({ error: 'INSERT_FAILED', message: 'Failed to record inquiry. Please try again.' }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      message: 'Inquiry received successfully.',
      id: data?.id
    }, { status: 201 });
  } catch (err: any) {
    console.error('[Contact API] Unhandled error:', err);
    return NextResponse.json({ error: 'INTERNAL_ERROR', message: 'An unexpected error occurred.' }, { status: 500 });
  }
}
