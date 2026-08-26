'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { isDemoAuthEnabled } from '@/lib/demoAuth';

interface PublicNavbarProps {
  onLoginClick?: () => void;
}

export default function PublicNavbar({ onLoginClick }: PublicNavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { loginWithVaultSession } = useAuth();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isHubDropdownOpen, setIsHubDropdownOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('pc_theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('pc_theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('pc_theme_toggled', { detail: { theme: nextTheme, time: Date.now() } }));
    }
  };

  const handleDevModeClick = async () => {
    if (!isDemoAuthEnabled()) return;
    const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
    const devId = `usr_dev_${Date.now()}_${randomSuffix.toLowerCase()}`;
    const devUser = {
      id: devId,
      name: 'Vinay',
      email: `vinay.dev.${randomSuffix.toLowerCase()}@pinit.in`,
      role: 'student',
      identityStatus: 'Active',
      isDevUser: true
    };

    if (typeof window !== 'undefined') {
      localStorage.removeItem(`pinit_${devId}_onboarding_answers`);
      localStorage.removeItem(`pinit_${devId}_ob_step`);
      localStorage.removeItem(`pinit_${devId}_completed_quests`);
      localStorage.removeItem(`pinit_${devId}_completed_missions`);
      localStorage.setItem('pinit_current_user', JSON.stringify(devUser));
    }

    await loginWithVaultSession({
      user: devUser,
      token: `jwt_dev_${Date.now()}`
    }, true);

    router.push('/onboarding');
  };

  const navLinks = [
    { name: 'Landing Page', href: '/' },
    { name: 'Problem', href: '/problem' },
    { name: 'Identity', href: '/identity' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: '54 Ecosystem Modules', href: '/modules' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Campus Demo', href: '/campus-demo' },
  ];

  return (
    <header className="public-navbar-root" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      height: '64px',
      background: 'var(--bg-card)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-color)'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        height: '100%',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* BRAND LOGO */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/" className="lp-brand" aria-label="PINIT CAREER home" style={{ display: 'inline-flex', alignItems: 'center', height: '36px' }}>
            <span className="lp-brand-lockup" style={{ display: 'inline-flex', alignItems: 'center', height: '36px' }}>
              <img
                src="/brand/pinit-career-logo-clear.png"
                alt="PINIT CAREER"
                className="lp-brand-logo"
                style={{ height: '36px', maxHeight: '36px', width: 'auto', objectFit: 'contain', display: 'block' }}
              />
            </span>
          </Link>
        </div>

        {/* DESKTOP NAV LINKS */}
        <nav className="desktop-nav-links" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '22px'
        }}>
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={isActive ? 'lp-nav-link is-on' : 'lp-nav-link'}
                style={{
                  fontSize: '13.5px',
                  fontWeight: isActive ? 750 : 600,
                  color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                  padding: '6px 0'
                }}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* ACTIONS (THEME TOGGLE + SIGN UP / GET STARTED) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            className="lp-theme"
            onClick={toggleTheme}
            style={{
              background: 'transparent',
              border: theme === 'dark' ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.12)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            title="Toggle Theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          <Link
            href="/signup"
            style={{
              fontSize: '13px',
              fontWeight: 700,
              color: theme === 'dark' ? '#CBD5E1' : '#334155',
              textDecoration: 'none',
              padding: '8px 14px',
              borderRadius: '8px',
              border: theme === 'dark' ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(0,0,0,0.15)',
              transition: 'all 0.2s'
            }}
          >
            Sign Up
          </Link>

          {onLoginClick ? (
            <button
              type="button"
              className="lp-start"
              onClick={onLoginClick}
              style={{
                padding: '9px 18px',
                fontSize: '13px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Get started
            </button>
          ) : (
            <Link
              href="/login?mode=signup"
              className="lp-start"
              style={{
                padding: '9px 18px',
                fontSize: '13px',
                fontWeight: 700,
                textDecoration: 'none'
              }}
            >
              Get started
            </Link>
          )}

          {/* MOBILE HAMBURGER BUTTON */}
          <button
            className="mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              fontSize: '22px',
              color: theme === 'dark' ? '#FFF' : '#000',
              cursor: 'pointer',
              marginLeft: '4px'
            }}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* MOBILE MENU DRAWER */}
      {mobileMenuOpen && (
        <div style={{
          position: 'absolute',
          top: '64px',
          left: 0,
          width: '100%',
          background: theme === 'dark' ? '#080A1A' : '#FFFFFF',
          borderBottom: theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
          padding: '16px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          boxShadow: '0 12px 30px rgba(0,0,0,0.25)'
        }}>
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  fontSize: '15px',
                  fontWeight: isActive ? 750 : 500,
                  color: isActive ? 'var(--accent)' : (theme === 'dark' ? '#94A3B8' : '#475569'),
                  textDecoration: 'none',
                  padding: '8px 0'
                }}
              >
                {link.name}
              </Link>
            );
          })}
          <Link
            href="/signup"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              fontSize: '15px',
              fontWeight: 800,
              color: '#041018',
              background: 'linear-gradient(135deg, #5ad0ff, #0077cc)',
              textDecoration: 'none',
              padding: '10px 16px',
              borderRadius: '10px',
              textAlign: 'center',
              marginTop: '8px'
            }}
          >
            Sign Up →
          </Link>
        </div>
      )}

      <style jsx>{`
        @media (max-width: 900px) {
          :global(.desktop-nav-links) { display: none !important; }
          :global(.mobile-hamburger-btn) { display: block !important; min-height: 44px; min-width: 44px; }
        }
      `}</style>
    </header>
  );
}
