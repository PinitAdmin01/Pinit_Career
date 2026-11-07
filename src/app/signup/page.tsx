'use client';
import Image from 'next/image';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';
import CollegeIdScanner from '@/components/auth/CollegeIdScanner';
import { CollegeMetadata } from '@/lib/utils/pinitIdGenerator';
import { supabase } from '@/lib/supabaseClient';

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({ username: '', displayName: '', password: '' });
  const [pinitId, setPinitId] = useState('');
  const [idMode, setIdMode] = useState<'college' | 'global'>('global');
  const [collegeMeta, setCollegeMeta] = useState<CollegeMetadata | undefined>();
  const [uploadedCardFile, setUploadedCardFile] = useState<File | null>(null);
  const [uploadedCardStoragePath, setUploadedCardStoragePath] = useState<string>('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleIdGenerated = useCallback((id: string, mode: 'college' | 'global', meta?: CollegeMetadata, file?: File | null) => {
    setPinitId(id);
    setIdMode(mode);
    setCollegeMeta(meta);
    if (file !== undefined) setUploadedCardFile(file);
  }, []);

  const handleNameExtracted = useCallback((extractedName: string) => {
    if (extractedName && extractedName !== 'Student') {
      setForm((prev) => ({
        ...prev,
        displayName: extractedName,
      }));
    }
  }, []);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!form.username || !form.displayName || !form.password) {
      setError('Please fill out all credentials.');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 0. Fraud & Collision Guard: Prevent duplicate registration of the same institutional ID
      if (idMode === 'college' && pinitId) {
        try {
          const { data: existingUser } = await supabase
            .from('users')
            .select('id, register_number')
            .or(`register_number.ilike.${pinitId},roll_number.ilike.${pinitId}`)
            .maybeSingle();

          if (existingUser) {
            setError(`Institutional ID ${pinitId} has already been claimed by an existing student account. If this is your ID card, please sign in or contact campus support.`);
            setLoading(false);
            return;
          }
        } catch (checkErr) {
          console.warn('[Signup] Duplicate check exception:', checkErr);
        }
      }

      // 1. Signup creates student account with verified/memorable PinIT ID
      await signup({
        username: form.username,
        displayName: form.displayName,
        password: form.password,
        role: 'student',
        registerNumber: pinitId,
        pinitId: pinitId,
        collegeInfo: collegeMeta,
      });

      // 2. Persist uploaded college ID card & track in student_id_card_verifications
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const currentUserId = sessionData?.session?.user?.id;
        const finalPath = uploadedCardStoragePath || (uploadedCardFile && pinitId ? `${pinitId}/card_${Date.now()}.${uploadedCardFile.name.split('.').pop() || 'png'}` : '');

        if (uploadedCardFile && pinitId && !uploadedCardStoragePath) {
          try {
            await supabase.storage
              .from('student-id-cards')
              .upload(finalPath, uploadedCardFile, {
                cacheControl: '3600',
                upsert: true,
              });
          } catch (uploadErr) {
            console.warn('[Signup] College ID card bucket upload notice:', uploadErr);
          }
        }

        if (currentUserId && finalPath) {
          try {
            await supabase.from('student_id_card_verifications').insert({
              user_id: currentUserId,
              pinit_id: pinitId,
              card_storage_path: finalPath,
              verification_status: 'pending',
              extracted_usn: collegeMeta?.rollNumber || '',
              extracted_college: collegeMeta?.collegeName || '',
            });
          } catch (verifErr) {
            console.warn('[Signup] Verification tracking notice:', verifErr);
          }
        }
      } catch (postRegErr) {
        console.warn('[Signup] Post-registration processing notice:', postRegErr);
      }

      // 3. Persist local identification for offline continuity
      try {
        if (typeof window !== 'undefined') {
          if (pinitId) localStorage.setItem('pinit_student_id', pinitId);
          if (collegeMeta) localStorage.setItem('pinit_college_meta', JSON.stringify(collegeMeta));
          localStorage.setItem('pinit_id_mode', idMode);
        }
      } catch {}

      router.push('/onboarding');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Signup failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card animate-fade-in">
        <div className="auth-logo">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 8 }}>
            <span className="lp-brand-lockup" style={{ height: 48, padding: '2px 6px' }}>
              <Image
                src="/brand/pinit-career-logo-clear.png"
                alt="PINIT CAREER"
                width={180}
                height={44}
                className="lp-brand-logo"
                style={{ height: 44, maxWidth: 180, width: 'auto', objectFit: 'contain' }}
                priority
              />
            </span>
          </div>
          <div className="auth-sub">Create your student account</div>
        </div>

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {error && (
            <div style={{
              padding: '10px 12px',
              borderRadius: 10,
              background: 'rgba(239,68,68,0.1)',
              color: '#b91c1c',
              fontSize: 14.5,
              fontWeight: 600,
            }}>
              {error}
            </div>
          )}

          <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, fontWeight: 700, color: 'var(--t2)' }}>
            Email / Username
            <input
              className="form-input"
              value={form.username}
              onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
              placeholder="you@college.edu"
              autoComplete="username"
              required
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, fontWeight: 700, color: 'var(--t2)' }}>
            Display name
            <input
              className="form-input"
              value={form.displayName}
              onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))}
              placeholder="Your name"
              autoComplete="name"
              required
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, fontWeight: 700, color: 'var(--t2)' }}>
            Password
            <input
              className="form-input"
              type="password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              minLength={8}
              required
            />
          </label>

          {/* Task 6 & Task 7: College ID Scanner & Memorable PinIT ID Generation */}
          <CollegeIdScanner
            displayName={form.displayName}
            username={form.username}
            onIdGenerated={handleIdGenerated}
            onNameExtracted={handleNameExtracted}
            onStoragePathExtracted={setUploadedCardStoragePath}
          />

          <p style={{ margin: 0, fontSize: 13, color: 'var(--t3)', lineHeight: 1.5 }}>
            New accounts are registered as <strong>students</strong> with an official PinIT ID. Staff and recruiter access is granted by an administrator.
          </p>

          <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', marginTop: 4 }}>
            {loading ? 'Creating student profile...' : 'Create student account'}
          </button>
        </form>

        <div className="auth-links" style={{ textAlign: 'center', marginTop: 14 }}>
          <span style={{ fontSize: 13.5, color: 'var(--t3)' }}>Already have an account? </span>
          <Link href="/login" style={{ fontSize: 13.5, color: 'var(--accent)', fontWeight: 700 }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
