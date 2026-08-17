'use client';
// src/app/finance/page.tsx
// Student Finance & Fees portal page detailing payment dues, installment tracking, simulated checkout, and downloadable receipts.

import { useState, useEffect } from 'react';
import { api } from '@/lib/api/client';
import { toast } from '@/lib/store/useAppStore';
import { openRazorpayCheckout } from '@/lib/razorpay';
import { RoleGate } from '@/components/auth/RoleGate';
import { useAuth } from '@/lib/context/AuthContext';

function StudentFinanceInner() {
  const { user } = useAuth();
  const [dues, setDues] = useState<any>(null);
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [activeCheckoutInst, setActiveCheckoutInst] = useState<any | null>(null);
  const [activeReceipt, setActiveReceipt] = useState<any | null>(null);
  
  // Checkout form states
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('card');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvc: '' });
  const [upiVpa, setUpiVpa] = useState('');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Scholarship applying states
  const [applyingSch, setApplyingSch] = useState(false);

  useEffect(() => {
    fetchDuesData();
    fetchScholarshipData();
  }, []);

  const fetchDuesData = async () => {
    try {
      const data = await api.get('/api/finance/student-dues');
      setDues(data);
    } catch (err) {
      console.error('Failed to load dues sheet', err);
    }
  };

  const fetchScholarshipData = async () => {
    try {
      const data = await api.get<{ scholarships: any[] }>('/api/finance/scholarships');
      setScholarships(data.scholarships || []);
    } catch {}
  };

  const handleApplyScholarship = async (scholarshipId: string) => {
    setApplyingSch(true);
    try {
      const res = await api.post<{ ok: boolean; waiver: number }>('/api/finance/apply-scholarship', { scholarshipId });
      if (res && res.ok) {
        alert(`Scholarship applied! A waiver of ₹${(res.waiver ?? 0).toLocaleString()} has been deducted from your remaining final installment.`);
        fetchDuesData();
      }
    } catch {
      alert('Failed to apply scholarship.');
    } finally {
      setApplyingSch(false);
    }
  };

  const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';
  const paymentsLive = Boolean(razorpayKey);

  const handleProcessPayment = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!activeCheckoutInst) return;

    if (!paymentsLive) {
      toast.error('Payments unavailable', 'Fees are recorded only after a verified Razorpay payment or an admin update. Online checkout is not configured.');
      return;
    }

    setProcessing(true);
    try {
      const orderRes = await api.post<{ orderId: string; amount: number; keyId: string }>('/api/payment/create-order', {
        planId: `installment_${activeCheckoutInst.id}`,
        amount: (activeCheckoutInst.amount || 10000) * 100
      });

      await openRazorpayCheckout({
        key: orderRes.keyId || razorpayKey,
        amount: orderRes.amount || (activeCheckoutInst.amount * 100),
        currency: 'INR',
        name: 'PinIT Campus Fee Payment',
        description: `Installment ${activeCheckoutInst.installmentNo} — ${activeCheckoutInst.title || 'Tuition Fee'}`,
        order_id: orderRes.orderId,
        handler: async (response) => {
          const res = await api.post<{ ok: boolean; receiptId: string }>('/api/finance/pay-due', {
            installmentId: activeCheckoutInst.id,
            paymentId: response.razorpay_payment_id
          });
          if (res && res.ok) {
            setSuccess(true);
            setTimeout(() => {
              setSuccess(false);
              setActiveCheckoutInst(null);
              fetchDuesData();
            }, 1200);
          }
        },
        theme: { color: 'var(--accent)' }
      });
    } catch (err: any) {
      toast.error('Payment failed', err.message || 'Order could not be created. The installment was not marked paid.');
    } finally {
      setProcessing(false);
    }
  };

  if (!dues) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--t2)' }}>
        Loading finance records...
      </div>
    );
  }

  // Calculators
  const totalPaid = (dues.installments || [])
    .filter((i: any) => i.status === 'Paid')
    .reduce((sum: number, i: any) => sum + (i.amount || 0), 0);

  const totalOutstanding = (dues.installments || [])
    .filter((i: any) => i.status === 'Unpaid')
    .reduce((sum: number, i: any) => sum + (i.amount || 0), 0) + (dues.fineLevied || 0);

  return (
    <div className="portal-page">
      <style>{`
        .finance-wrapper {
          max-width: 1080px;
          margin: 0 auto;
        }
        .section-title {
          font-family: var(--font-display), sans-serif;
          font-size: 24px;
          font-weight: 900;
          letter-spacing: -0.6px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .grid-3 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }
        @media (max-width: 768px) {
          .grid-3 {
            grid-template-columns: 1fr;
          }
        }
        .stats-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 20px;
          box-shadow: var(--shadow-sm);
        }
        .stats-lbl {
          font-size: 11px;
          font-weight: 800;
          color: var(--t2);
          text-transform: uppercase;
          letter-spacing: 0.6px;
        }
        .stats-val {
          font-size: 26px;
          font-weight: 900;
          color: var(--t1);
          margin-top: 6px;
        }
        .alert-banner {
          background: var(--amber-light);
          border: 1px solid var(--amber-light);
          border-radius: 12px;
          padding: 16px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 24px;
        }
        .main-grid {
          display: grid;
          grid-template-columns: 1.3fr 1fr;
          gap: 24px;
        }
        @media (max-width: 900px) {
          .main-grid {
            grid-template-columns: 1fr;
          }
        }
        .card-block {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 24px;
          box-shadow: var(--shadow-sm);
        }
        .card-subtitle {
          font-family: var(--font-display), sans-serif;
          font-size: 16px;
          font-weight: 800;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .table-fees {
          width: 100%;
          border-collapse: collapse;
        }
        .table-fees th {
          text-align: left;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          color: var(--t2);
          padding-bottom: 12px;
          border-bottom: 1px solid var(--border2);
        }
        .table-fees td {
          padding: 14px 0;
          font-size: 13.5px;
          border-bottom: 1px solid var(--border);
        }
        .table-fees tr:last-child td {
          border-bottom: none;
        }
        .badge-status {
          padding: 3px 8px;
          border-radius: 20px;
          font-size: 10.5px;
          font-weight: 700;
        }
        .badge-paid { background: var(--green-light); color: var(--green); }
        .badge-unpaid { background: var(--coral-light); color: var(--coral); }
        .checkout-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: color-mix(in srgb, var(--bg) 55%, transparent);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .checkout-modal {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 24px;
          width: 100%;
          max-width: 440px;
          padding: 28px;
          box-shadow: var(--shadow-xl);
        }
        .btn-pay {
          background: var(--accent);
          color: #fff;
          border: none;
          border-radius: 10px;
          padding: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s;
        }
        .btn-pay:hover { background: var(--accent-mid); }
        .receipt-seal {
          border: 2px dashed var(--green);
          color: var(--green);
          font-family: monospace;
          font-weight: 800;
          font-size: 12px;
          padding: 8px;
          text-transform: uppercase;
          border-radius: 4px;
          display: inline-block;
          transform: rotate(-3deg);
        }
      `}</style>

      <div className="finance-wrapper">
        <h1 className="section-title">💳 Finance & Fee Desk</h1>

        {/* Reminders / Overdue Alerts */}
        {dues.fineLevied > 0 && (
          <div className="alert-banner">
            <span style={{ fontSize: 20 }}>⚠️</span>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--amber)' }}>Installment Overdue Alert</div>
              <p style={{ fontSize: 12, color: 'var(--t2)', marginTop: 3 }}>
                Your Final Installment deadline was <strong>July 10, 2026</strong>. A late payment fine of <strong>₹1,500</strong> has been applied to your outstanding balance. Please clear dues online to remove late restrictions.
              </p>
            </div>
          </div>
        )}

        {!paymentsLive && (
          <div className="alert-banner" style={{ marginBottom: 20 }}>
            <div>
              <strong style={{ fontSize: 13 }}>Online fee checkout is not configured</strong>
              <div style={{ fontSize: 12, marginTop: 4, color: 'var(--t2)' }}>
                Installments stay unpaid until a verified Razorpay payment or an admin records the receipt. This page will not mark fees paid locally.
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid-3">
          <div className="stats-card">
            <div className="stats-lbl">Total Annual Course Fees</div>
            <div className="stats-val" style={{ color: 'var(--accent)' }}>₹{(dues.totalTermFees ?? 0).toLocaleString()}</div>
            {dues.scholarshipWaiver > 0 && (
              <div style={{ fontSize: 11, color: 'var(--green)', fontWeight: 700, marginTop: 4 }}>
                Includes Waiver: -₹{(dues.scholarshipWaiver ?? 0).toLocaleString()}
              </div>
            )}
          </div>
          <div className="stats-card">
            <div className="stats-lbl">Fees Cleared To Date</div>
            <div className="stats-val" style={{ color: 'var(--green)' }}>₹{totalPaid.toLocaleString()}</div>
            <div style={{ fontSize: 11, color: 'var(--t2)', marginTop: 4 }}>
              Payment efficiency: {dues.totalTermFees > 0 ? Math.round((totalPaid / dues.totalTermFees) * 100) : 0}%
            </div>
          </div>
          <div className="stats-card">
            <div className="stats-lbl">Dues Outstanding (with Fines)</div>
            <div className="stats-val" style={{ color: totalOutstanding > 0 ? 'var(--coral)' : 'var(--green)' }}>
              ₹{totalOutstanding.toLocaleString()}
            </div>
            <div style={{ fontSize: 11, color: 'var(--t2)', marginTop: 4 }}>
              Next due deadline: Immediate
            </div>
          </div>
        </div>

        <div className="main-grid">
          {/* Section 1: Dues Tracker Schedule */}
          <div className="card-block" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h3 className="card-subtitle">📅 Installments Timeline</h3>
            
            <table className="table-fees">
              <thead>
                <tr>
                  <th>Milestone Name</th>
                  <th>Deadline Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {(dues.installments || []).map((inst: any) => (
                  <tr key={inst.id}>
                    <td style={{ fontWeight: 700 }}>{inst.name}</td>
                    <td style={{ color: 'var(--t2)' }}>{new Date(inst.deadline).toLocaleDateString()}</td>
                    <td style={{ fontWeight: 700 }}>
                      ₹{(inst.id === 'Inst-3' && dues.fineLevied > 0 ? (inst.amount || 0) + (dues.fineLevied || 0) : (inst.amount || 0)).toLocaleString()}
                      {inst.id === 'Inst-3' && dues.fineLevied > 0 && <span style={{ fontSize: 10, color: 'var(--coral)', marginLeft: 4 }}>(+₹1,500 Fine)</span>}
                    </td>
                    <td>
                      <span className={`badge-status ${inst.status === 'Paid' ? 'badge-paid' : 'badge-unpaid'}`}>
                        {inst.status}
                      </span>
                    </td>
                    <td>
                      {inst.status === 'Paid' ? (
                        <button
                          onClick={() => setActiveReceipt(inst)}
                          className="btn-ghost btn-sm"
                          style={{ border: '1px solid var(--border2)', fontSize: 11 }}
                        >
                          📄 View Receipt
                        </button>
                      ) : paymentsLive ? (
                        <button
                          onClick={() => setActiveCheckoutInst(inst)}
                          className="btn-primary"
                          style={{ fontSize: 11, padding: '6px 12px', background: 'var(--accent)' }}
                        >
                          Pay Online
                        </button>
                      ) : (
                        <span style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 700 }}>
                          Awaiting verified payment
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Section 2: Scholarships Desk */}
          <div className="card-block" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3 className="card-subtitle">🎓 Scholarships & Waivers Desk</h3>
            <p style={{ fontSize: 12.5, color: 'var(--t2)' }}>
              Students meeting institutional performance benchmarks are eligible to claim waivers applied directly to their due sheets.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {scholarships.map(s => {
                const isApplied = dues.scholarshipWaiver === s.value;
                // Only treat as eligible when the API provides a numeric GPA
                const apiGpa = typeof dues?.gpa === 'number' ? dues.gpa
                  : typeof dues?.eligibleGpa === 'number' ? dues.eligibleGpa
                  : null;
                const isEligible = apiGpa != null && apiGpa >= 9.0;
                return (
                  <div key={s.id} style={{ background: 'var(--bg3)', padding: 14, borderRadius: 12, border: '1px solid var(--border2)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 13, fontWeight: 700 }}>{s.name}</span>
                      <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--green)' }}>-₹{(s.value ?? 0).toLocaleString()}</span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--t2)', marginTop: 4 }}>Criteria: {s.criteria}</div>
                    
                    <div style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-end' }}>
                      {isApplied ? (
                        <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--green)' }}>✓ Waiver Applied</span>
                      ) : (
                        <button
                          onClick={() => handleApplyScholarship(s.id)}
                          disabled={!isEligible || applyingSch}
                          className="btn-ghost btn-sm"
                          style={{
                            border: '1.5px solid var(--border2)', fontSize: 11,
                            background: isEligible ? 'var(--accent-light)' : 'var(--bg3)',
                            color: isEligible ? 'var(--accent)' : 'var(--t3)'
                          }}
                        >
                          {isEligible ? 'Claim Waiver' : 'Ineligible'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Online Checkout Simulator Drawer Modal */}
      {activeCheckoutInst && (
        <div className="checkout-overlay">
          <div className="checkout-modal">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 800 }}>🔒 Secure Fee Payment Checkout</h3>
              <button onClick={() => setActiveCheckoutInst(null)} style={{ border: 'none', background: 'none', fontSize: 18, cursor: 'pointer', color: 'var(--t2)' }}>✕</button>
            </div>

            {success ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>🎉</div>
                <h4 style={{ fontSize: 16, fontWeight: 800, color: 'var(--green)' }}>Payment Confirmed!</h4>
                <p style={{ fontSize: 12, color: 'var(--t2)', marginTop: 4 }}>Your transaction was logged and receipt generated.</p>
              </div>
            ) : (
              <form onSubmit={handleProcessPayment} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ background: 'var(--bg3)', padding: 12, borderRadius: 10, border: '1px solid var(--border)', fontSize: 13 }}>
                  <div style={{ color: 'var(--t2)' }}>Paying: {activeCheckoutInst.name}</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--t1)', marginTop: 4 }}>
                    ₹{(activeCheckoutInst.id === 'Inst-3' && dues.fineLevied > 0 ? (activeCheckoutInst.amount || 0) + (dues.fineLevied || 0) : (activeCheckoutInst.amount || 0)).toLocaleString()}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, background: 'var(--bg3)', padding: 4, borderRadius: 10 }}>
                  <button type="button" onClick={() => setPaymentMethod('card')} style={{ padding: '8px', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, background: paymentMethod === 'card' ? 'var(--card)' : 'transparent', color: paymentMethod === 'card' ? 'var(--t1)' : 'var(--t2)', cursor: 'pointer' }}>Credit / Debit Card</button>
                  <button type="button" onClick={() => setPaymentMethod('upi')} style={{ padding: '8px', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, background: paymentMethod === 'upi' ? 'var(--card)' : 'transparent', color: paymentMethod === 'upi' ? 'var(--t1)' : 'var(--t2)', cursor: 'pointer' }}>UPI Payment</button>
                </div>

                {paymentMethod === 'card' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--t2)' }}>CARD NUMBER</label>
                      <input type="text" className="form-input" style={{ marginTop: 4 }} placeholder="4111 2222 3333 4444" value={cardDetails.number} onChange={e => setCardDetails(prev => ({ ...prev, number: e.target.value }))} required />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--t2)' }}>EXPIRY DATE</label>
                        <input type="text" className="form-input" style={{ marginTop: 4 }} placeholder="MM/YY" value={cardDetails.expiry} onChange={e => setCardDetails(prev => ({ ...prev, expiry: e.target.value }))} required />
                      </div>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--t2)' }}>CVC CODE</label>
                        <input type="text" className="form-input" style={{ marginTop: 4 }} placeholder="123" value={cardDetails.cvc} onChange={e => setCardDetails(prev => ({ ...prev, cvc: e.target.value }))} required />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--t2)' }}>UPI VIRTUAL PAYMENT ADDRESS (VPA)</label>
                    <input type="text" className="form-input" style={{ marginTop: 4 }} placeholder="yourname@upi" value={upiVpa} onChange={e => setUpiVpa(e.target.value)} required />
                  </div>
                )}

                <button type="submit" className="btn-pay" disabled={processing}>
                  {processing ? 'Processing Securely...' : `✓ Complete Payment Gateway`}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Printable Receipt Lightbox Modal */}
      {activeReceipt && (
        <div className="checkout-overlay">
          <div className="checkout-modal" style={{ maxWidth: 500, padding: 36, position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--t1)', paddingBottom: 16, marginBottom: 20 }}>
              <div>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 900 }}>BGS INSTITUTE OF MANAGEMENT</h4>
                <div style={{ fontSize: 10, color: 'var(--t2)', fontFamily: 'var(--font-mono)' }}>AFFILIATED TO CAMPUS CORE OS</div>
              </div>
              <button onClick={() => setActiveReceipt(null)} style={{ border: 'none', background: 'none', fontSize: 18, cursor: 'pointer', color: 'var(--t2)' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 13 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--t2)' }}>Receipt Reference:</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{activeReceipt.receiptId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--t2)' }}>Student Name:</span>
                <span style={{ fontWeight: 700 }}>{user?.displayName || 'Not available'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--t2)' }}>Paid Date:</span>
                <span style={{ fontWeight: 700 }}>{new Date(activeReceipt.paidOn).toLocaleDateString()}</span>
              </div>

              <div style={{ borderTop: '1px dashed var(--border2)', borderBottom: '1px dashed var(--border2)', padding: '12px 0', margin: '10px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, marginBottom: 6 }}>
                  <span>Payment Item</span>
                  <span>Amount</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--t2)', fontSize: 12.5 }}>
                  <span>{activeReceipt.name}</span>
                  <span>₹{(activeReceipt.amount ?? 0).toLocaleString()}</span>
                </div>
                {activeReceipt.id === 'Inst-3' && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--coral)', fontSize: 12.5, marginTop: 4 }}>
                    <span>Late Payment Penalty Fee</span>
                    <span>₹1,500</span>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 900, marginBottom: 20 }}>
                <span>Total Amount Paid:</span>
                <span>₹{(activeReceipt.id === 'Inst-3' ? (activeReceipt.amount || 0) + 1500 : (activeReceipt.amount || 0)).toLocaleString()}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                <div className="receipt-seal">Secured Paid</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => {
                      alert(`Official Fee Receipt Voucher (PIN-FEE-2026-${Math.floor(1000 + Math.random() * 9000)}) generated and saved!`);
                    }}
                    className="btn-primary"
                    style={{ fontSize: 12, padding: '6px 12px', background: 'var(--accent)' }}
                  >
                    📄 Download Fee Voucher
                  </button>
                  <button
                    onClick={() => { window.print(); }}
                    className="btn-ghost"
                    style={{ border: '1.5px solid var(--border2)', fontSize: 12, padding: '6px 12px' }}
                  >
                    🖨 Print Invoice
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function StudentFinance() {
  return (
    <RoleGate
      allow={['student', 'admin', 'superadmin']}
      label="Student finance access required"
    >
      <StudentFinanceInner />
    </RoleGate>
  );
}
