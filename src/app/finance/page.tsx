'use client';
// src/app/finance/page.tsx
// Student Finance & Fees portal page detailing payment dues, installment tracking, simulated checkout, and downloadable receipts.

import { useState, useEffect } from 'react';
import { api } from '@/lib/api/client';
import { openRazorpayCheckout } from '@/lib/razorpay';

export default function StudentFinance() {
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
  const [eligibleGpa] = useState(9.4); // Ashwanth Kumar's GPA

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
        alert(`Scholarship applied! A waiver of ₹${res.waiver.toLocaleString()} has been deducted from your remaining final installment.`);
        fetchDuesData();
      }
    } catch {
      alert('Failed to apply scholarship.');
    } finally {
      setApplyingSch(false);
    }
  };

  const handleProcessPayment = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!activeCheckoutInst) return;

    setProcessing(true);
    try {
      const orderRes = await api.post<{ orderId: string; amount: number; keyId: string }>('/api/payment/create-order', {
        planId: `installment_${activeCheckoutInst.id}`,
        amount: (activeCheckoutInst.amount || 10000) * 100
      });

      await openRazorpayCheckout({
        key: orderRes.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || (() => { throw new Error('Razorpay key not configured'); })(),
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
        theme: { color: '#4f46e5' }
      });
    } catch (err: any) {
      alert(err.message || 'Razorpay checkout initialization failed.');
    } finally {
      setProcessing(false);
    }
  };

  if (!dues) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>
        Loading finance records...
      </div>
    );
  }

  // Calculators
  const totalPaid = (dues.installments || [])
    .filter((i: any) => i.status === 'Paid')
    .reduce((sum: number, i: any) => sum + i.amount, 0);

  const totalOutstanding = (dues.installments || [])
    .filter((i: any) => i.status === 'Unpaid')
    .reduce((sum: number, i: any) => sum + i.amount, 0) + (dues.fineLevied || 0);

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a', padding: '30px 20px', fontFamily: 'var(--font-body), sans-serif' }}>
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
          background: #ffffff;
          border: 1px solid rgba(15, 23, 42, 0.05);
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.01);
        }
        .stats-lbl {
          font-size: 11px;
          font-weight: 800;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.6px;
        }
        .stats-val {
          font-size: 26px;
          font-weight: 900;
          color: #0f172a;
          margin-top: 6px;
        }
        .alert-banner {
          background: #fffbeb;
          border: 1px solid #fef3c7;
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
          background: #ffffff;
          border: 1px solid rgba(15, 23, 42, 0.06);
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(15, 23, 42, 0.02);
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
          color: #64748b;
          padding-bottom: 12px;
          border-bottom: 1px solid #cbd5e1;
        }
        .table-fees td {
          padding: 14px 0;
          font-size: 13.5px;
          border-bottom: 1px solid #f1f5f9;
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
        .badge-paid { background: #ecfdf5; color: #059669; }
        .badge-unpaid { background: #fef2f2; color: #dc2626; }
        .checkout-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(15, 23, 42, 0.45);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .checkout-modal {
          background: #ffffff;
          border-radius: 24px;
          width: 100%;
          max-width: 440px;
          padding: 28px;
          box-shadow: 0 20px 50px rgba(15, 23, 42, 0.15);
        }
        .btn-pay {
          background: #2563eb;
          color: #ffffff;
          border: none;
          border-radius: 10px;
          padding: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s;
        }
        .btn-pay:hover { background: #1d4ed8; }
        .receipt-seal {
          border: 2px dashed #059669;
          color: #059669;
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
              <div style={{ fontSize: 13.5, fontWeight: 800, color: '#92400e' }}>Installment Overdue Alert</div>
              <p style={{ fontSize: 12, color: '#b45309', marginTop: 3 }}>
                Your Final Installment deadline was <strong>July 10, 2026</strong>. A late payment fine of <strong>₹1,500</strong> has been applied to your outstanding balance. Please clear dues online to remove late restrictions.
              </p>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid-3">
          <div className="stats-card">
            <div className="stats-lbl">Total Annual Course Fees</div>
            <div className="stats-val" style={{ color: '#2563eb' }}>₹{dues.totalTermFees.toLocaleString()}</div>
            {dues.scholarshipWaiver > 0 && (
              <div style={{ fontSize: 11, color: '#059669', fontWeight: 700, marginTop: 4 }}>
                Includes Waiver: -₹{dues.scholarshipWaiver.toLocaleString()}
              </div>
            )}
          </div>
          <div className="stats-card">
            <div className="stats-lbl">Fees Cleared To Date</div>
            <div className="stats-val" style={{ color: '#10b981' }}>₹{totalPaid.toLocaleString()}</div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
              Payment efficiency: {Math.round((totalPaid / dues.totalTermFees) * 100)}%
            </div>
          </div>
          <div className="stats-card">
            <div className="stats-lbl">Dues Outstanding (with Fines)</div>
            <div className="stats-val" style={{ color: totalOutstanding > 0 ? '#ef4444' : '#10b981' }}>
              ₹{totalOutstanding.toLocaleString()}
            </div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
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
                    <td style={{ color: '#64748b' }}>{new Date(inst.deadline).toLocaleDateString()}</td>
                    <td style={{ fontWeight: 700 }}>
                      ₹{(inst.id === 'Inst-3' && dues.fineLevied > 0 ? inst.amount + dues.fineLevied : inst.amount).toLocaleString()}
                      {inst.id === 'Inst-3' && dues.fineLevied > 0 && <span style={{ fontSize: 10, color: '#dc2626', marginLeft: 4 }}>(+₹1,500 Fine)</span>}
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
                          style={{ border: '1px solid #cbd5e1', fontSize: 11 }}
                        >
                          📄 View Receipt
                        </button>
                      ) : (
                        <button
                          onClick={() => setActiveCheckoutInst(inst)}
                          className="btn-primary"
                          style={{ fontSize: 11, padding: '6px 12px', background: '#2563eb' }}
                        >
                          💳 Pay Online
                        </button>
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
            <p style={{ fontSize: 12.5, color: '#64748b' }}>
              Students meeting institutional performance benchmarks are eligible to claim waivers applied directly to their due sheets.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {scholarships.map(s => {
                const isApplied = dues.scholarshipWaiver === s.value;
                const isEligible = eligibleGpa >= 9.0;
                return (
                  <div key={s.id} style={{ background: '#f8fafc', padding: 14, borderRadius: 12, border: '1px solid #cbd5e1' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 13, fontWeight: 700 }}>{s.name}</span>
                      <span style={{ fontSize: 12, fontWeight: 800, color: '#059669' }}>-₹{s.value.toLocaleString()}</span>
                    </div>
                    <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>Criteria: {s.criteria}</div>
                    
                    <div style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-end' }}>
                      {isApplied ? (
                        <span style={{ fontSize: 11, fontWeight: 800, color: '#059669' }}>✓ Waiver Applied</span>
                      ) : (
                        <button
                          onClick={() => handleApplyScholarship(s.id)}
                          disabled={!isEligible || applyingSch}
                          className="btn-ghost btn-sm"
                          style={{
                            border: '1.5px solid #cbd5e1', fontSize: 11,
                            background: isEligible ? '#eff6ff' : '#f1f5f9',
                            color: isEligible ? '#2563eb' : '#94a3b8'
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
              <button onClick={() => setActiveCheckoutInst(null)} style={{ border: 'none', background: 'none', fontSize: 18, cursor: 'pointer', color: '#64748b' }}>✕</button>
            </div>

            {success ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>🎉</div>
                <h4 style={{ fontSize: 16, fontWeight: 800, color: '#059669' }}>Payment Confirmed!</h4>
                <p style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>Your transaction was logged and receipt generated.</p>
              </div>
            ) : (
              <form onSubmit={handleProcessPayment} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ background: '#f8fafc', padding: 12, borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 13 }}>
                  <div style={{ color: '#64748b' }}>Paying: {activeCheckoutInst.name}</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: '#0f172a', marginTop: 4 }}>
                    ₹{(activeCheckoutInst.id === 'Inst-3' && dues.fineLevied > 0 ? activeCheckoutInst.amount + dues.fineLevied : activeCheckoutInst.amount).toLocaleString()}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, background: '#f1f5f9', padding: 4, borderRadius: 10 }}>
                  <button type="button" onClick={() => setPaymentMethod('card')} style={{ padding: '8px', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, background: paymentMethod === 'card' ? '#ffffff' : 'transparent', color: paymentMethod === 'card' ? '#0f172a' : '#64748b', cursor: 'pointer' }}>Credit / Debit Card</button>
                  <button type="button" onClick={() => setPaymentMethod('upi')} style={{ padding: '8px', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, background: paymentMethod === 'upi' ? '#ffffff' : 'transparent', color: paymentMethod === 'upi' ? '#0f172a' : '#64748b', cursor: 'pointer' }}>UPI Payment</button>
                </div>

                {paymentMethod === 'card' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 800, color: '#64748b' }}>CARD NUMBER</label>
                      <input type="text" className="form-input" style={{ marginTop: 4 }} placeholder="4111 2222 3333 4444" value={cardDetails.number} onChange={e => setCardDetails(prev => ({ ...prev, number: e.target.value }))} required />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 800, color: '#64748b' }}>EXPIRY DATE</label>
                        <input type="text" className="form-input" style={{ marginTop: 4 }} placeholder="MM/YY" value={cardDetails.expiry} onChange={e => setCardDetails(prev => ({ ...prev, expiry: e.target.value }))} required />
                      </div>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 800, color: '#64748b' }}>CVC CODE</label>
                        <input type="text" className="form-input" style={{ marginTop: 4 }} placeholder="123" value={cardDetails.cvc} onChange={e => setCardDetails(prev => ({ ...prev, cvc: e.target.value }))} required />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 800, color: '#64748b' }}>UPI VIRTUAL PAYMENT ADDRESS (VPA)</label>
                    <input type="text" className="form-input" style={{ marginTop: 4 }} placeholder="ashwanth@oksbi" value={upiVpa} onChange={e => setUpiVpa(e.target.value)} required />
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #0f172a', paddingBottom: 16, marginBottom: 20 }}>
              <div>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 900 }}>BGS INSTITUTE OF MANAGEMENT</h4>
                <div style={{ fontSize: 10, color: '#64748b', fontFamily: 'var(--font-mono)' }}>AFFILIATED TO CAMPUS CORE OS</div>
              </div>
              <button onClick={() => setActiveReceipt(null)} style={{ border: 'none', background: 'none', fontSize: 18, cursor: 'pointer', color: '#64748b' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 13 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Receipt Reference:</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{activeReceipt.receiptId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Student Name:</span>
                <span style={{ fontWeight: 700 }}>Ashwanth Kumar</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Paid Date:</span>
                <span style={{ fontWeight: 700 }}>{new Date(activeReceipt.paidOn).toLocaleDateString()}</span>
              </div>

              <div style={{ borderTop: '1px dashed #cbd5e1', borderBottom: '1px dashed #cbd5e1', padding: '12px 0', margin: '10px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, marginBottom: 6 }}>
                  <span>Payment Item</span>
                  <span>Amount</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569', fontSize: 12.5 }}>
                  <span>{activeReceipt.name}</span>
                  <span>₹{activeReceipt.amount.toLocaleString()}</span>
                </div>
                {activeReceipt.id === 'Inst-3' && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#dc2626', fontSize: 12.5, marginTop: 4 }}>
                    <span>Late Payment Penalty Fee</span>
                    <span>₹1,500</span>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 900, marginBottom: 20 }}>
                <span>Total Amount Paid:</span>
                <span>₹{(activeReceipt.id === 'Inst-3' ? activeReceipt.amount + 1500 : activeReceipt.amount).toLocaleString()}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="receipt-seal">Secured Paid</div>
                <button
                  onClick={() => { window.print(); }}
                  className="btn-ghost"
                  style={{ border: '1.5px solid #cbd5e1', fontSize: 12, padding: '6px 12px' }}
                >
                  🖨 Print Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
