import React, { useEffect } from 'react';
import { INTERNSHIP_AVAILABLE, INTERNSHIP_TIER_AVAILABLE } from '@/lib/data/crashPlansData';
import { INTERNSHIP_TIERS } from '@/lib/internships/tiers';

export interface CredentialPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  planTitle?: string;
  trackTitle?: string;
  tierKey?: keyof typeof INTERNSHIP_TIERS;
  onProceedToEnroll?: () => void;
}

const CredentialPreviewModal: React.FC<CredentialPreviewModalProps> = ({
  isOpen, onClose, planTitle = INTERNSHIP_AVAILABLE ? 'Crash Course & Internship' : 'Crash Course',
  trackTitle = 'Full-Stack Software Architecture', tierKey = 't1_job_sim', onProceedToEnroll,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const track = trackTitle;
  const ig = 'linear-gradient(135deg, #6366f1, #8b5cf6)';
  const eg = 'linear-gradient(135deg, #10b981, #059669)';

  const t1Available = INTERNSHIP_TIER_AVAILABLE.t1_job_sim;
  const t2Available = INTERNSHIP_TIER_AVAILABLE.t2_virtual_team;

  const getTierWording = () => {
    if (tierKey === 't1_job_sim' || t1Available) {
      return '2-Week Python Job Simulation (simulated company)';
    }
    if (tierKey === 't2_virtual_team' || t2Available) {
      return '4-Week Virtual Internship – Backend (team, simulated company)';
    }
    return INTERNSHIP_TIERS[tierKey]?.name || 'Industrial Project Certification';
  };

  const base = (s: Partial<React.CSSProperties>): React.CSSProperties => s as React.CSSProperties;
  const s = {
    overlay: base({ position:'fixed', inset:0, background:'rgba(2,6,23,0.85)', backdropFilter:'blur(8px)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:'24px', animation:'fadeIn 0.25s ease-out' }),
    modal: base({ width:'100%', maxWidth:'980px', maxHeight:'90vh', overflow:'auto', background:'rgba(15,23,42,0.95)', backdropFilter:'blur(16px)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'20px', boxShadow:'0 25px 50px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05) inset', animation:'slideUp 0.35s cubic-bezier(0.16,1,0.3,1)', fontFamily:'var(--font-display,"Inter",system-ui,sans-serif)', color:'var(--t1,#f8fafc)' }),
    header: base({ display:'flex', alignItems:'flex-start', justifyContent:'space-between', padding:'28px 32px 20px', borderBottom:'1px solid rgba(255,255,255,0.06)' }),
    title: base({ fontSize:'1.65rem', fontWeight:700, letterSpacing:'-0.02em', margin:0, background:'linear-gradient(135deg,var(--t1,#f8fafc),var(--t2,#cbd5e1))', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }),
    subtitle: base({ fontSize:'0.99rem', color:'var(--t3,#94a3b8)', margin:'6px 0 0', lineHeight:1.5 }),
    closeBtn: base({ width:'36px', height:'36px', borderRadius:'10px', border:'1px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.03)', color:'var(--t2,#cbd5e1)', fontSize:'1.21rem', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }),
    cards: base({ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))', gap:'20px', padding:'24px 32px' }),
    card: base({ position:'relative', padding:'28px 24px', borderRadius:'16px', background:'rgba(15,23,42,0.8)', border:'1px solid transparent', overflow:'hidden' }),
    badge: base({ display:'inline-block', fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', padding:'4px 10px', borderRadius:'999px', marginBottom:'16px' }),
    heading: base({ fontSize:'1.38rem', fontWeight:700, margin:'0 0 12px', letterSpacing:'-0.01em' }),
    details: base({ fontSize:'0.96rem', color:'var(--t3,#94a3b8)', lineHeight:1.6, marginBottom:'20px' }),
    seal: base({ display:'flex', alignItems:'center', gap:'8px', fontSize:'0.83rem', fontWeight:600, color:'var(--t2,#cbd5e1)' }),
    sealIcon: (c:string) => base({ fontSize:'1.1rem', color:c }),
    hud: base({ display:'flex', alignItems:'center', gap:'10px', padding:'16px 20px', margin:'0 32px 24px', borderRadius:'12px', background:'rgba(99,102,241,0.12)', border:'1px solid rgba(99,102,241,0.25)', fontSize:'0.88rem', color:'var(--t2,#cbd5e1)' }),
    hudIcon: base({ fontSize:'0.99rem', flexShrink:0 }),
    hudLink: base({ color:'var(--accent,#6366f1)', textDecoration:'none', fontWeight:600 }),
    footer: base({ display:'flex', gap:'12px', justifyContent:'flex-end', padding:'20px 32px 28px', borderTop:'1px solid rgba(255,255,255,0.06)' }),
    secBtn: base({ padding:'12px 24px', borderRadius:'10px', border:'1px solid rgba(255,255,255,0.15)', background:'rgba(255,255,255,0.04)', color:'var(--t1,#f8fafc)', fontSize:'0.96rem', fontWeight:600, cursor:'pointer', transition:'all 0.2s ease' }),
    priBtn: base({ padding:'12px 28px', borderRadius:'10px', border:'none', background:'linear-gradient(135deg,var(--accent,#6366f1),var(--accent-hover,#8b5cf6))', color:'#fff', fontSize:'0.96rem', fontWeight:700, cursor:'pointer', transition:'all 0.2s ease', boxShadow:'0 4px 14px rgba(99,102,241,0.35)', letterSpacing:'0.01em' }),
  };

  const bBadge = (bg:string, color:string, border:string) => ({ ...s.badge, background:bg, color, border:`1px solid ${border}` });
  const bCard = (bi:string) => ({ ...s.card, borderImage:`${bi} 1`, borderWidth:'1px' });

  return (
    <div style={s.overlay} onClick={(e) => { if (e.target===e.currentTarget) onClose(); }} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div style={s.modal}>
        <style jsx>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes slideUp{from{opacity:0;transform:translateY(16px) scale(0.98)}to{opacity:1;transform:translateY(0) scale(1)}}`}</style>

        <header style={s.header}>
          <div>
            <h2 id="modal-title" style={s.title}>{INTERNSHIP_AVAILABLE ? '🏆 Dual Verifiable Credential Portfolio' : '🏆 Verifiable Capstone Certificate (sample)'}</h2>
            <p style={s.subtitle}>{INTERNSHIP_AVAILABLE
              ? 'Every graduate receives an Industrial Project Certificate AND an official PinIT Tech Labs Fellowship Letter.'
              : 'Graduates receive a signed Project Certificate that anyone can verify online.'}</p>
          </div>
          <button onClick={onClose} style={s.closeBtn} aria-label="Close" title="Close">✕</button>
        </header>

        <div style={s.cards}>
          <article style={bCard(ig)}>
            <span style={bBadge('rgba(99,102,241,0.18)','#a5b4fc','rgba(99,102,241,0.3)')}>ACCREDITED PROJECT CERTIFICATION</span>
            <h3 style={s.heading}>{track}</h3>
            <p style={s.details}>Awarded for independent execution of 1-Month production capstone with automated test passing.</p>
            <div style={s.seal}><span style={s.sealIcon('#f59e0b')}>🏅</span><span>✓ ISO-Aligned • Cryptographically Signed</span></div>
          </article>
          {INTERNSHIP_AVAILABLE && <article style={bCard(eg)}>
            <span style={bBadge('rgba(16,185,129,0.18)','#6ee7b7','rgba(16,185,129,0.3)')}>VENTURE APPRENTICESHIP & FELLOWSHIP</span>
            <h3 style={s.heading}>{getTierWording()}</h3>
            <p style={s.details}>Verified software development program contributing to production-grade repositories.</p>
            <div style={s.seal}><span style={s.sealIcon('#10b981')}>🛡️</span><span>✓ SHA-256 Tamper-Proof Hash • QR Verifiable</span></div>
          </article>}
        </div>

        <div style={s.hud} role="status" aria-live="polite">
          <span style={s.hudIcon}>🔎</span>
          <span>Public Verification Gateway: Recruiters verify live Git commits and project integrity at <a href="/verify/[id]" style={s.hudLink} target="_blank" rel="noopener noreferrer">pinitcareer.vercel.app/verify/[id]</a></span>
        </div>

        <footer style={s.footer}>
          <button onClick={onClose} style={s.secBtn} onMouseOver={(e)=>{e.currentTarget.style.background='rgba(255,255,255,0.08)'}} onMouseOut={(e)=>{e.currentTarget.style.background='rgba(255,255,255,0.04)'}}>Close Preview</button>
          <button onClick={onProceedToEnroll} style={s.priBtn} onMouseOver={(e)=>{e.currentTarget.style.transform='translateY(-1px)';e.currentTarget.style.boxShadow='0 6px 20px rgba(99,102,241,0.45)'}} onMouseOut={(e)=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='0 4px 14px rgba(99,102,241,0.35)'}}>Enroll & Unlock Credentials ➔</button>
        </footer>
      </div>
    </div>
  );
};

export default CredentialPreviewModal;