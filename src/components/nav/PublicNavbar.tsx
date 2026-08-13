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
    { name: 'Home', href: '/' },
    { name: 'Problem', href: '/#the-problem' },
    { name: 'Identity', href: '/#career-identity' },
    { name: 'Who it\'s for', href: '/#audiences' },
    { name: 'About Us', href: '/about' },
    { name: 'For Companies', href: '/recruiter' },
    { name: 'Campus Consult', href: '/contact' },
  ];

  return (
    <header className="public-navbar-root">
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        height: '100%',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* BRAND LOGO & TOP LEFT DEV MODE BUTTON */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isDemoAuthEnabled() && (
          <button
            type="button"
            className="lp-dev"
            onClick={handleDevModeClick}
            style={{
              border: 'none',
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap'
            }}
            title="Skip login/signup, assign default name Vinay with random unique ID, and launch Onboarding"
          >
            Dev Mode
          </button>
          )}

          <Link href="/" className="lp-brand" aria-label="PINIT CAREER home">
            <span className="lp-brand-lockup">
              <img
                src="/brand/pinit-career-logo.png"
                alt="PINIT CAREER"
                className="lp-brand-logo"
              />
            </span>
          </Link>
        </div>

        {/* DESKTOP NAV LINKS */}
        <nav className="desktop-nav-links" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px'
        }}>
          {navLinks.map((link) => {
            const hash = link.href.startsWith('/#') ? link.href.slice(1) : '';
            const isActive = !hash && pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={isActive ? 'lp-nav-link is-on' : 'lp-nav-link'}
                onClick={(e) => {
                  if (!hash || pathname !== '/') return;
                  const el = document.getElementById(hash.slice(1));
                  if (!el) return;
                  e.preventDefault();
                  el.scrollIntoView({ behavior: 'smooth' });
                  history.replaceState(null, '', hash);
                }}
              >
                {link.name}
              </Link>
            );
          })}

          {/* QUICK HUB LAUNCHER DROPDOWN */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsHubDropdownOpen(!isHubDropdownOpen)}
              className="lp-hub"
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>All 8 Hubs</span>
              <span style={{ fontSize: '10px' }}>{isHubDropdownOpen ? '▲' : '▼'}</span>
            </button>

            {isHubDropdownOpen && (
              <div style={{
                position: 'absolute',
                top: '40px',
                right: '0',
                width: '240px',
                background: theme === 'dark' ? '#0F1225' : '#FFFFFF',
                border: theme === 'dark' ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.12)',
                borderRadius: '16px',
                padding: '10px',
                boxShadow: '0 16px 40px rgba(0,0,0,0.35)',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                zIndex: 1001
              }}>
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#64748B', padding: '4px 8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Quick jump
                </div>
                {[
                  { label: '1. Landing', href: '/' },
                  { label: '2. About', href: '/about' },
                  { label: '3. Pricing', href: '/pricing' },
                  { label: '4. Companies', href: '/recruiter' },
                  { label: '5. Features', href: '/services' },
                  { label: '6. Contact', href: '/contact' },
                  { label: '7. Privacy', href: '/privacy' },
                  { label: '8. Terms', href: '/terms' }
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsHubDropdownOpen(false)}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: pathname === item.href ? '#7C3AED' : (theme === 'dark' ? '#E2E8F0' : '#334155'),
                      background: pathname === item.href ? 'rgba(124,58,237,0.12)' : 'transparent',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span>{item.label}</span>
                    {pathname === item.href && <span style={{ fontSize: '10px', color: '#7C3AED' }}>Active</span>}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* ACTIONS (THEME TOGGLE + SIGN IN / GET STARTED) */}
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

          {onLoginClick ? (
            <button
              onClick={onLoginClick}
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: theme === 'dark' ? '#CBD5E1' : '#334155',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '8px 12px'
              }}
            >
              Sign In
            </button>
          ) : (
            <Link
              href="/login"
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: theme === 'dark' ? '#CBD5E1' : '#334155',
                textDecoration: 'none',
                padding: '8px 12px'
              }}
            >
              Sign In
            </Link>
          )}

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
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontSize: '15px',
                fontWeight: pathname === link.href ? 700 : 500,
                color: pathname === link.href ? '#7C3AED' : (theme === 'dark' ? '#94A3B8' : '#475569'),
                textDecoration: 'none',
                padding: '8px 0'
              }}
            >
              {link.name}
            </Link>
          ))}
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
