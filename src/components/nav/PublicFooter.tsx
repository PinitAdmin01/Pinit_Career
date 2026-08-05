'use client';

import Link from 'next/link';

export default function PublicFooter() {
  return (
    <footer className="public-footer-root" style={{
      background: '#05060F',
      color: '#FFFFFF',
      padding: '60px 0 24px',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 24px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
          gap: '40px',
          marginBottom: '50px'
        }}>
          {/* BRAND COLUMN */}
          <div>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '16px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '16px',
                color: '#FFFFFF'
              }}>Pi</div>
              <span style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.5px' }}>PINITCAREER</span>
            </Link>
            <p style={{ color: '#94A3B8', fontSize: '13.5px', lineHeight: '1.6', maxWidth: '320px' }}>
              PinitCareer is an AI-powered Career Operating System connecting personalized skill learning, real project building, code wars, and enterprise hiring into one ecosystem.
            </p>
          </div>

          {/* PLATFORM */}
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', marginBottom: '18px' }}>Platform</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px' }}>
              <li><Link href="/" style={{ color: '#94A3B8', textDecoration: 'none' }}>Home</Link></li>
              <li><Link href="/about" style={{ color: '#94A3B8', textDecoration: 'none' }}>About Us</Link></li>
              <li><Link href="/pricing" style={{ color: '#94A3B8', textDecoration: 'none' }}>Pricing & Plans</Link></li>
              <li><Link href="/services" style={{ color: '#94A3B8', textDecoration: 'none' }}>Platform Services</Link></li>
            </ul>
          </div>

          {/* FOR ENTERPRISE */}
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', marginBottom: '18px' }}>Enterprise</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px' }}>
              <li><Link href="/recruiter" style={{ color: '#94A3B8', textDecoration: 'none' }}>For Companies</Link></li>
              <li><Link href="/contact" style={{ color: '#94A3B8', textDecoration: 'none' }}>Campus Consultation</Link></li>
              <li><Link href="/pricing" style={{ color: '#94A3B8', textDecoration: 'none' }}>Campus OS Pass</Link></li>
            </ul>
          </div>

          {/* RESOURCES */}
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', marginBottom: '18px' }}>Resources</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px' }}>
              <li><Link href="/quests" style={{ color: '#94A3B8', textDecoration: 'none' }}>S-Curve Quests</Link></li>
              <li><Link href="/interview" style={{ color: '#94A3B8', textDecoration: 'none' }}>AI Mock Interview</Link></li>
              <li><Link href="/contact" style={{ color: '#94A3B8', textDecoration: 'none' }}>Support Center</Link></li>
            </ul>
          </div>

          {/* LEGAL */}
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', marginBottom: '18px' }}>Legal</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px' }}>
              <li><Link href="/privacy" style={{ color: '#94A3B8', textDecoration: 'none' }}>Privacy Policy</Link></li>
              <li><Link href="/terms" style={{ color: '#94A3B8', textDecoration: 'none' }}>Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT BAR */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          fontSize: '13px',
          color: '#64748B'
        }}>
          <div>© 2026 PinitCareer Technologies Inc. All rights reserved.</div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Link href="/privacy" style={{ color: '#64748B', textDecoration: 'none' }}>Privacy</Link>
            <Link href="/terms" style={{ color: '#64748B', textDecoration: 'none' }}>Terms</Link>
            <Link href="/contact" style={{ color: '#64748B', textDecoration: 'none' }}>Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
