'use client';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { toast } from '@/lib/store/useAppStore';
import { useMe } from '@/lib/api/hooks';
import { useCareerOS, PIN_COSTS } from '@/lib/context/CareerOSContext';
import PinsHistory from '@/components/pins/PinsHistory';
import { openRazorpayCheckout } from '@/lib/razorpay';
import Link from 'next/link';

interface PaymentStatus {
  tier: string; endsAt: string|null; planName: string;
  limits: { aiInterviews: number; resumeUploads: number };
}

const PIN_PACKS = [
  { id: 'pack_50',  name: 'Starter',   pins: 50,  price: '₹49',  priceNum: 4900,  highlight: false, desc: 'For trying AI features' },
  { id: 'pack_150', name: 'Builder',   pins: 150, price: '₹99',  priceNum: 9900,  highlight: true,  desc: 'Most popular — best value' },
  { id: 'pack_500', name: 'Grinder',   pins: 500, price: '₹249', priceNum: 24900, highlight: false, desc: 'For power users' },
];

const EARN_WAYS = [
  { icon:'⚡', label:'Complete a Mission',       amount:'+10 cr',  color:'var(--accent)', href:'/missions' },
  { icon:'📝', label:'Pass an Exam',             amount:'+25 cr',  color:'var(--teal)',   href:'/exams' },
  { icon:'🎙', label:'Finish Interview Session', amount:'+15 cr',  color:'var(--purple)', href:'/interview' },
  { icon:'📚', label:'Complete Study Session',   amount:'+5 cr',   color:'var(--blue)',   href:'/learning' },
  { icon:'🧬', label:'Career Onboarding',        amount:'+50 cr',  color:'var(--green)',  href:'/onboarding' },
  { icon:'✓',  label:'Vault Item Verified',      amount:'+20 cr',  color:'var(--amber)',  href:'/vault' },
  { icon:'🔥', label:'7-Day Streak Bonus',       amount:'+15 cr',  color:'var(--coral)',  href:'/missions' },
  { icon:'🌅', label:'Daily Login',              amount:'+3 cr',   color:'var(--teal)',   href:'/dashboard' },
];

export default function PricingPage() {
  const { data: user }   = useMe();
  const { pins, pinHistory } = useCareerOS();

  const { data: status } = useQuery({
    queryKey: ['payment', 'status'],
    queryFn:  () => api.get<PaymentStatus>('/api/payment/status'),
    enabled:  !!user,
  });

  const orderMutation = useMutation({
    mutationFn: (planId: string) =>
      api.post<{ orderId: string; amount: number; keyId: string; devMode?: boolean }>('/api/payment/create-order', { planId }),
    onSuccess: async (data, planId) => {
      try {
        await openRazorpayCheckout({
          key: data.keyId,
          amount: data.amount,
          currency: 'INR',
          name: 'PinIT Career OS',
          description: `${planId.toUpperCase()} Subscription Plan`,
          order_id: data.orderId,
          handler: (response) => verifyMutation.mutate({ ...response, planId }),
          prefill: { name: user?.displayName, email: user?.username },
          theme: { color: '#4f46e5' },
        });
      } catch (e: any) {
        toast.error('Checkout Error', e.message);
      }
    },
    onError: () => toast.error('Payment Error', 'Could not initiate Razorpay payment. Please try again.'),
  });

  const verifyMutation = useMutation({
    mutationFn: (data: any) => api.post('/api/payment/verify', data),
    onSuccess: (data: any) => { toast.success('🎉 Plan Active!', data.message); window.location.reload(); },
    onError: () => toast.error('Verification Failed', 'Contact support with your payment ID.'),
  });

  const packMutation = useMutation({
    mutationFn: (pack: typeof PIN_PACKS[0]) =>
      api.post<{ orderId: string; amount: number; keyId: string; devMode?: boolean }>('/api/payment/create-order', { planId: pack.id }),
    onSuccess: async (data, pack) => {
      try {
        await openRazorpayCheckout({
          key: data.keyId,
          amount: data.amount,
          currency: 'INR',
          name: 'PinIT Pins Upgrade',
          description: `${pack.pins} Pins — ${pack.name} Pack`,
          order_id: data.orderId,
          // Pins are granted only after server verify — never mint client-side.
          handler: (response) => verifyMutation.mutate({ ...response, planId: pack.id }),
          prefill: { name: user?.displayName },
          theme: { color: '#4f46e5' },
        });
      } catch (e: any) {
        toast.error('Checkout Error', e.message);
      }
    },
    onError: () => toast.error('Payment Error', 'Failed to initialize Razorpay checkout.'),
  });

  const currentTier = status?.tier || 'free';
  const isPro = ['pro', 'institution'].includes(currentTier);

  return (
    <div style={{ maxWidth: 980, margin: '0 auto', paddingBottom: 60 }} className="animate-fade-in">

      {/* Hero */}
      <div className="page-hero" style={{ marginBottom: 28, textAlign: 'center' }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 className="page-hero-title" style={{ fontSize: 28, textAlign: 'center' }}>⚡ Pins & Plans</h1>
          <p className="page-hero-sub" style={{ textAlign: 'center', margin: '0 auto', maxWidth: 540 }}>
            Pins power AI features. Earn free by completing missions and sessions — or buy a pack via Razorpay to unlock everything instantly.
          </p>
          {/* Big pin balance */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            marginTop: 20, padding: '12px 24px',
            background: pins < 20 ? 'rgba(220,38,38,0.12)' : 'rgba(79,70,229,0.1)',
            border: `1px solid ${pins < 20 ? 'rgba(220,38,38,0.25)' : 'rgba(79,70,229,0.2)'}`,
            borderRadius: 20,
          }}>
            <span style={{ fontSize: 24 }}>⚡</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 900, color: pins < 20 ? 'var(--coral)' : 'var(--accent)', letterSpacing: '-1px' }}>
              {pins.toLocaleString()}
            </span>
            <span style={{ fontSize: 14, color: 'var(--t2)', fontWeight: 600 }}>pins available</span>
          </div>
        </div>
      </div>

      <div className="pricing-grid-split">

        {/* LEFT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Enterprise Campus & Recruiter Tier Card */}
          <div style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(16,185,129,0.08))', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 18, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 10, fontWeight: 900, background: 'linear-gradient(135deg, #7C3AED, #A855F7)', color: '#FFF', padding: '3px 10px', borderRadius: 50, textTransform: 'uppercase' }}>ENTERPRISE & CAMPUS</span>
              <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--accent)' }}>Custom Pricing</span>
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: 6 }}>Campus & Recruiter OS Pass</h3>
            <p style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.5, marginBottom: 14 }}>
              Unlimited Student Licenses, Placement CRM, Candidate Skill Passports, and University Operations Command Center.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <Link href="/contact" style={{ flex: 1, textDecoration: 'none', background: 'linear-gradient(135deg, #7C3AED, #A855F7)', color: '#FFF', padding: '10px 16px', borderRadius: 50, fontSize: 12, fontWeight: 800, textAlign: 'center' }}>
                Request Campus Demo →
              </Link>
            </div>
          </div>

          {/* Pin Packs */}
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 18, overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', background: 'var(--bg3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 800 }}>💳 Buy Pin Packs (Razorpay)</span>
              <span style={{ fontSize: 11, color: 'var(--t3)' }}>Instant delivery</span>
            </div>
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {PIN_PACKS.map(pack => (
                <div key={pack.id} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 16px',
                  background: pack.highlight ? 'linear-gradient(135deg, rgba(79,70,229,0.08), rgba(124,58,237,0.06))' : 'var(--bg3)',
                  border: `1.5px solid ${pack.highlight ? 'rgba(79,70,229,0.25)' : 'var(--border)'}`,
                  borderRadius: 12, position: 'relative',
                }}>
                  {pack.highlight && (
                    <div style={{ position: 'absolute', top: -8, right: 12, background: 'var(--amber)', color: '#000', fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 10, letterSpacing: '0.5px' }}>
                      BEST VALUE
                    </div>
                  )}
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: pack.highlight ? 'var(--accent-light)' : 'var(--bg2)', border: `1px solid ${pack.highlight ? 'rgba(79,70,229,0.2)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 900, color: pack.highlight ? 'var(--accent)' : 'var(--t1)' }}>⚡</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--t1)', marginBottom: 2 }}>
                      {pack.pins} Pins
                      <span style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 500, marginLeft: 6 }}>{pack.name}</span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--t3)' }}>{pack.desc}</div>
                  </div>
                  <button
                    onClick={() => packMutation.mutate(pack)}
                    disabled={packMutation.isPending}
                    style={{
                      padding: '7px 16px', borderRadius: 8, cursor: 'pointer',
                      background: pack.highlight ? 'var(--accent)' : 'var(--bg2)',
                      color: pack.highlight ? 'white' : 'var(--t1)',
                      border: pack.highlight ? 'none' : '1px solid var(--border)',
                      fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap',
                      fontFamily: 'var(--font-body)',
                    }}>
                    {pack.price}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* How to Earn Free Pins */}
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 18, overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', background: 'var(--bg3)' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 800 }}>🎁 Earn Pins Free</span>
            </div>
            <div style={{ padding: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {EARN_WAYS.map(w => (
                <Link key={w.label} href={w.href} style={{ textDecoration: 'none' }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '10px 12px', borderRadius: 10,
                    background: 'var(--bg3)', border: '1px solid var(--border)',
                    transition: 'all 0.15s', cursor: 'pointer',
                  }}>
                    <span style={{ fontSize: 16 }}>{w.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--t1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{w.label}</div>
                    </div>
                    <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 700, color: w.color, flexShrink: 0 }}>{w.amount}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Feature Cost Table */}
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 18, overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', background: 'var(--bg3)' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 800 }}>🔧 Feature Pin Costs</span>
            </div>
            <table className="data-table" style={{ margin: 0, width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg3)', fontSize: 12, color: 'var(--t3)' }}>
                  <th style={{ textAlign: 'left', padding: '10px 14px' }}>Feature</th>
                  <th style={{ textAlign: 'right', padding: '10px 14px' }}>Cost</th>
                  <th style={{ textAlign: 'right', padding: '10px 14px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(PIN_COSTS).map(([key, meta]) => {
                  const can = pins >= meta.cost;
                  return (
                    <tr key={key} style={{ borderTop: '1px solid var(--border)' }}>
                      <td style={{ padding: '10px 14px', fontSize: 12.5 }}>
                        <span style={{ marginRight: 7 }}>{meta.icon}</span>
                        <span style={{ fontWeight: 500 }}>{meta.label}</span>
                      </td>
                      <td style={{ textAlign: 'right', padding: '10px 14px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent)', fontSize: 12.5 }}>
                        {meta.cost} ⚡
                      </td>
                      <td style={{ textAlign: 'right', padding: '10px 14px' }}>
                        <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 700, color: can ? 'var(--green)' : 'var(--coral)' }}>
                          {can ? '✓ Unlocked' : 'Need more'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Subscription Plans */}
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 18, overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', background: 'var(--bg3)' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 800 }}>🚀 Subscription Plans (Razorpay Checkout)</span>
            </div>
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>

              {/* Free Plan */}
              <div style={{ padding: '16px 18px', border: `2px solid ${currentTier === 'free' ? 'var(--border2)' : 'var(--border)'}`, borderRadius: 14, background: currentTier === 'free' ? 'var(--bg3)' : 'transparent' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4 }}>Free</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 900, color: 'var(--t1)' }}>₹0</div>
                    <div style={{ fontSize: 11, color: 'var(--t3)' }}>Forever free</div>
                  </div>
                  {currentTier === 'free' && <span className="badge badge-neutral">Current Plan</span>}
                </div>
                {['100 starter pins', '3 AI interviews/mo', '2 resume uploads/mo', 'Basic Career DNA', 'Full mission system'].map(f => (
                  <div key={f} style={{ fontSize: 12.5, color: 'var(--t2)', padding: '3px 0', display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ color: 'var(--t3)', fontSize: 10 }}>✓</span>{f}
                  </div>
                ))}
              </div>

              {/* Pro Plan */}
              <div style={{ padding: '16px 18px', border: `2px solid ${isPro ? 'var(--accent)' : 'rgba(79,70,229,0.3)'}`, borderRadius: 14, background: 'linear-gradient(135deg, rgba(79,70,229,0.08), rgba(124,58,237,0.06))', position: 'relative' }}>
                {!isPro && <div style={{ position: 'absolute', top: -9, right: 14, background: 'var(--accent)', color: 'white', fontSize: 9, fontWeight: 800, padding: '2px 10px', borderRadius: 10, letterSpacing: '0.5px' }}>RECOMMENDED</div>}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4 }}>Pro</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 900, color: 'var(--t1)' }}>₹499<span style={{ fontSize: 13, fontWeight: 500, color: 'var(--t3)' }}>/mo</span></div>
                    <div style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600 }}>+200 pins every month</div>
                  </div>
                  {isPro && <span className="badge badge-accent">Active ✓</span>}
                </div>
                {['200 pins/month included', 'Unlimited AI interviews', 'Unlimited resume uploads', 'Full Career Twin simulation', 'Priority evaluation queue', 'All avatar coaching modes'].map(f => (
                  <div key={f} style={{ fontSize: 12.5, color: 'var(--t1)', padding: '3px 0', display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ color: 'var(--accent)', fontSize: 10 }}>✓</span>{f}
                  </div>
                ))}
                {!isPro && (
                  <button
                    onClick={() => orderMutation.mutate('pro')}
                    disabled={orderMutation.isPending || verifyMutation.isPending}
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center', marginTop: 14, padding: 12, borderRadius: 10, cursor: 'pointer', background: 'var(--accent)', color: '#fff', border: 'none', fontWeight: 800 }}>
                    {orderMutation.isPending ? 'Connecting Razorpay...' : 'Upgrade via Razorpay ➔'}
                  </button>
                )}
                {status?.endsAt && <div style={{ fontSize: 11, color: 'var(--green)', marginTop: 8, textAlign: 'center' }}>Active until {new Date(status.endsAt).toLocaleDateString()}</div>}
              </div>

            </div>
          </div>

          {/* Pin Transaction History */}
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 18, overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', background: 'var(--bg3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 800 }}>📊 Pin History</span>
              <span style={{ fontSize: 11, color: 'var(--t3)' }}>Last {Math.min(pinHistory.length, 10)} transactions</span>
            </div>
            <div style={{ padding: 16 }}>
              <PinsHistory limit={10} />
            </div>
          </div>

          <p style={{ textAlign: 'center', color: 'var(--t4)', fontSize: 11, marginTop: 4 }}>
            💳 Powered by Razorpay · UPI / Credit / Debit / Netbanking · GST Included
          </p>
        </div>
      </div>
      <style>{`
        .pricing-grid-split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        @media (max-width: 860px) {
          .pricing-grid-split {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}