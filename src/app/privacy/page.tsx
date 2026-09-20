'use client';

import Link from 'next/link';
import PublicNavbar from '@/components/nav/PublicNavbar';
import PublicFooter from '@/components/nav/PublicFooter';

export default function PrivacyPageRevamp() {
  return (
    <main style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      color: 'var(--t1)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Universal Public Navbar */}
      <PublicNavbar />

      {/* Content Area */}
      <div style={{
        flex: 1,
        maxWidth: '800px',
        width: '100%',
        margin: '0 auto',
        padding: '60px 24px',
        zIndex: 10
      }}>
        <div style={{
          background: 'rgba(10, 15, 26, 0.65)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '24px',
          padding: '40px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
        }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 900,
            marginBottom: '10px',
            background: 'linear-gradient(to right, #a5b4fc, #c084fc)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: 'var(--font-display)'
          }}>🔒 Privacy Policy</h1>
          <p style={{ fontSize: '12.5px', color: 'var(--t4)', fontFamily: 'var(--font-mono)', marginBottom: '32px' }}>
            Last Updated: September 20, 2026
          </p>

          <section style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontSize: '14px', lineHeight: '1.6', color: 'var(--t2)' }}>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--t1)', marginBottom: '8px' }}>1. Information We Collect</h2>
              <p>
                We collect information you provide directly to us when creating an account, uploading files to your Secure Vault, and completing socratic quests. This includes your username, email address, password, resume text, and verification records.
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--t1)', marginBottom: '8px' }}>2. Cryptographic Hashes &amp; Sentinel Registry</h2>
              <p>
                To provide verified skill claims, our Sentinel system generates SHA-256 hashes of your certifications, credentials, and coding quest completion records. Only the cryptographic hashes and timestamps are stored on the verification registry. Your raw document data remains privately stored and encrypted.
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--t1)', marginBottom: '8px' }}>3. Real-time Recruiter Access Controls</h2>
              <p>
                You retain complete, real-time control over who can view your parsed resume details and portfolio items. Recruiter access permissions can be enabled or revoked instantly from your Sentinel dashboard.
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--t1)', marginBottom: '8px' }}>4. Data Processing &amp; AI Inference</h2>
              <p>
                Your data is processed locally and stored securely in <strong>Supabase Cloud (PostgreSQL with Row Level Security)</strong>. We use local and API-driven LLM models to analyze skill gaps and generate socratic challenges.
              </p>
              <p style={{ marginTop: 8 }}>
                <strong>Third-Party AI Processors:</strong> Inference API calls are made to Groq and OpenRouter for AI mentor responses, and to the Render voice host for speech synthesis. <strong>Prompts are not used to train public models.</strong> Your personal credentials are never sold or shared with third parties.
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--t1)', marginBottom: '8px' }}>5. Camera, Microphone &amp; Voice Biometrics (DPDP Compliance)</h2>
              <p style={{ marginBottom: '8px' }}>
                In full compliance with India&apos;s Digital Personal Data Protection (DPDP) Act, 2023:
              </p>
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li>
                  <strong>Opt-In &amp; Explicit Consent:</strong> Camera access for proctored missions and microphone access for voice interviews are disabled by default. Capture requires your explicit opt-in and is always accompanied by a visible indicator.
                </li>
                <li>
                  <strong>On-Device Processing:</strong> Brightness/gaze estimation and speech processing happen locally in your browser. We do not run ambient background recording.
                </li>
                <li>
                  <strong>Voice Biometrics:</strong> If you calibrate your voice profile, acoustic parameters are stored locally. Biometric audio templates are never sold, monetized, or shared with third parties.
                </li>
                <li>
                  <strong>User Rights &amp; Revocation:</strong> You may mute camera/microphone access, disable voice navigation, or clear your voice calibration profile at any time through browser permissions or the mentor widget.
                </li>
              </ul>
            </div>

            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--t1)', marginBottom: '8px' }}>6. Data Retention &amp; Deletion Rights (DPDP Act 2023)</h2>
              <p>
                We retain your personal data only as long as necessary to provide the requested services. You have the right to access, correct, and erase your personal data at any time by contacting us at the Grievance Officer details below.
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--t1)', marginBottom: '8px' }}>7. Grievance Redressal Officer (DPDP Act 2023)</h2>
              <p>
                As required by India&apos;s Digital Personal Data Protection Act, 2023, PinIT Designates the following officer for data protection queries and complaints:
              </p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', padding: '12px', borderRadius: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                <strong>Data Protection / Grievance Officer</strong><br />
                Email: <Link href="mailto:grievance@pinit.in" style={{ color: 'var(--accent)' }}>grievance@pinit.in</Link><br />
                Response SLA: Within 30 days of receiving your request.
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--t1)', marginBottom: '8px' }}>8. Contact Us</h2>
              <p>
                If you have any questions or concerns regarding this Privacy Policy, please visit our <Link href="/contact" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Contact Page</Link>.
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* Universal Public Footer */}
      <PublicFooter />
    </main>
  );
}
