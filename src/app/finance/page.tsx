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
  
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const ob = (user?.onboardingAnswers || {}) as Record<string, any>;
  const institutionName = ob.college || ob.university || ob.institution || 'PinIT Institute of Technology';

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
        toast.success('Scholarship Applied! 🎓', `A waiver of ₹${(res.waiver ?? 0).toLocaleString()} has been deducted from your remaining final installment.`);
        fetchDuesData();
      }
    } catch (err: unknown) {
      // e.g. "Scholarships are awarded by the finance office. Please contact them to apply."
      toast.info('Scholarship', err instanceof Error && err.message ? err.message : 'Failed to apply scholarship. Please try again.');
    } finally {
      setApplyingSch(false);
    }
  };

  const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';
  const paymentsLive = Boolean(razorpayKey);

  const handleDownloadFeeVoucher = (receipt: any) => {
    if (!receipt) return;
    const voucherRef = receipt.receiptId || `VOUCHER-${receipt.id}-${Date.now().toString().slice(-6)}`;
    const paidDate = receipt.paidOn ? new Date(receipt.paidOn).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const regNo = user?.registerNumber && user.registerNumber !== 'Not available' ? user.registerNumber : (user?.id ? `REG-${user.id.slice(0, 8).toUpperCase()}` : 'REG-2026-001');
    const totPaid = (receipt.amount || 0) + (receipt.fineLevied || 0);

    const voucherHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Official Fee Voucher - ${voucherRef}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #0f172a; max-width: 640px; margin: 0 auto; background: #fff; }
    .header { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 16px; margin-bottom: 24px; }
    .header h1 { margin: 0; font-size: 20px; font-weight: 900; text-transform: uppercase; color: #1e3a8a; }
    .header p { margin: 4px 0 0; font-size: 12px; color: #64748b; font-family: monospace; letter-spacing: 0.5px; }
    .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; font-size: 14.5px; background: #f8fafc; padding: 14px; border-radius: 8px; border: 1px solid #e2e8f0; }
    .table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    .table th, .table td { padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 14.5px; }
    .table th { text-align: left; background: #f1f5f9; font-size: 12px; text-transform: uppercase; color: #475569; }
    .total-row { font-size: 16.5px; font-weight: 800; display: flex; justify-content: space-between; border-top: 2px solid #0f172a; padding-top: 12px; margin-bottom: 30px; }
    .footer { display: flex; justify-content: space-between; align-items: flex-end; font-size: 12px; color: #64748b; border-top: 1px dashed #cbd5e1; padding-top: 16px; }
    .seal { border: 2px solid #16a34a; color: #16a34a; padding: 6px 12px; border-radius: 6px; font-weight: 800; text-transform: uppercase; font-family: monospace; }
  </style>
</head>
<body>
  <div class="header">
    <h1>${institutionName}</h1>
    <p>OFFICE OF THE COMPTROLLER & BURSAR · OFFICIAL TUITION FEE VOUCHER</p>
  </div>
  <div class="details-grid">
    <div><strong>Voucher Ref:</strong> ${voucherRef}</div>
    <div><strong>Payment Date:</strong> ${paidDate}</div>
    <div><strong>Student Name:</strong> ${user?.displayName || 'Registered Student'}</div>
    <div><strong>Registration No:</strong> ${regNo}</div>
  </div>
  <table class="table">
    <thead>
      <tr><th>Payment Item</th><th style="text-align: right;">Amount (INR)</th></tr>
    </thead>
    <tbody>
      <tr><td>${receipt.name || 'Tuition Fee Installment'}</td><td style="text-align: right;">₹${(receipt.amount || 0).toLocaleString()}</td></tr>
      ${receipt.fineLevied ? `<tr><td style="color: #dc2626;">Late Payment Penalty Fee</td><td style="text-align: right; color: #dc2626;">₹${receipt.fineLevied.toLocaleString()}</td></tr>` : ''}
    </tbody>
  </table>
  <div class="total-row">
    <span>Total Settled Amount:</span>
    <span>₹${totPaid.toLocaleString()}</span>
  </div>
  <div class="footer">
    <div>
      <div>Verified by Campus Comptroller Accounts</div>
      <div style="font-family: monospace; font-size: 10px; margin-top: 3px; color: #94a3b8;">TRANSACTION REF: ${voucherRef}</div>
    </div>
    <div class="seal">✓ PAID & CLEARED</div>
  </div>
</body>
</html>`;

    const blob = new Blob([voucherHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Fee_Voucher_${voucherRef}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Fee Voucher Downloaded! 📄', `Official fee voucher ${voucherRef} downloaded.`);
  };

  const handleProcessPayment = async (instParam?: any) => {
    const inst = instParam || activeCheckoutInst;
    if (!inst) return;

    if (!paymentsLive) {
      toast.error('Payments unavailable', 'Fees are recorded only after a verified Razorpay payment or an admin update. Online checkout is not configured.');
      return;
    }

    setProcessing(true);
    setActiveCheckoutInst(inst);
    try {
      const isOverdue = inst.status?.toLowerCase() === 'overdue' || (inst.dueDate && new Date(inst.dueDate).getTime() < Date.now());
      const payAmount = (isOverdue && dues?.fineLevied > 0)
        ? (inst.amount || 10000) + (dues.fineLevied || 0)
        : (inst.amount || 10000);

      const orderRes = await api.post<{ orderId: string; amount: number; keyId: string }>('/api/payment/create-order', {
        planId: `installment_${inst.id}`,
        amount: payAmount * 100
      });

      await openRazorpayCheckout({
        key: orderRes.keyId || razorpayKey,
        amount: orderRes.amount || (payAmount * 100),
        currency: 'INR',
        name: institutionName,
        description: `Installment ${inst.installmentNo || inst.name} — Tuition Fee`,
        order_id: orderRes.orderId,
        prefill: {
          name: user?.displayName,
          email: user?.email
        },
        handler: async (response) => {
          const res = await api.post<{ ok: boolean; receiptId: string }>('/api/finance/pay-due', {
            installmentId: inst.id,
            paymentId: response.razorpay_payment_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
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
          font-size: 26.5px;
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
          font-size: 12px;
          font-weight: 800;
          color: var(--t2);
          text-transform: uppercase;
          letter-spacing: 0.6px;
        }
        .stats-val {
          font-size: 28.5px;
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
          font-size: 17.5px;
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
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          color: var(--t2);
          padding-bottom: 12px;
          border-bottom: 1px solid var(--border2);
        }
        .table-fees td {
          padding: 14px 0;
          font-size: 15px;
          border-bottom: 1px solid var(--border);
        }
        .table-fees tr:last-child td {
          border-bottom: none;
        }
        .badge-status {
          padding: 3px 8px;
          border-radius: 20px;
          font-size: 11.5px;
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
          font-size: 13px;
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
        {dues.fineLevied > 0 && (() => {
          const overdueInst = (dues.installments || []).find(
            (i: any) => i.status?.toLowerCase() === 'overdue' || (i.dueDate && new Date(i.dueDate).getTime() < Date.now() && i.status?.toLowerCase() !== 'paid' && i.status?.toLowerCase() !== 'waived')
          );
          const deadlineStr = overdueInst?.dueDate ? new Date(overdueInst.dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'recently';
          const instTitle = overdueInst?.name || 'Tuition Fee';

          return (
            <div className="alert-banner">
              <span style={{ fontSize: 22 }}>⚠️</span>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--amber)' }}>Installment Overdue Alert</div>
                <p style={{ fontSize: 13, color: 'var(--t2)', marginTop: 3 }}>
                  Your {instTitle} deadline was <strong>{deadlineStr}</strong>. A late payment fine of <strong>₹{dues.fineLevied.toLocaleString('en-IN')}</strong> has been applied to your outstanding balance. Please clear dues online to remove late restrictions.
                </p>
              </div>
            </div>
          );
        })()}

        {!paymentsLive && (
          <div className="alert-banner" style={{ marginBottom: 20 }}>
            <div>
              <strong style={{ fontSize: 14.5 }}>Online fee checkout is not configured</strong>
              <div style={{ fontSize: 13, marginTop: 4, color: 'var(--t2)' }}>
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
              <div style={{ fontSize: 12, color: 'var(--green)', fontWeight: 700, marginTop: 4 }}>
                Includes Waiver: -₹{(dues.scholarshipWaiver ?? 0).toLocaleString()}
              </div>
            )}
          </div>
          <div className="stats-card">
            <div className="stats-lbl">Fees Cleared To Date</div>
            <div className="stats-val" style={{ color: 'var(--green)' }}>₹{totalPaid.toLocaleString()}</div>
            <div style={{ fontSize: 12, color: 'var(--t2)', marginTop: 4 }}>
              Payment efficiency: {dues.totalTermFees > 0 ? Math.round((totalPaid / dues.totalTermFees) * 100) : 0}%
            </div>
          </div>
          <div className="stats-card">
            <div className="stats-lbl">Dues Outstanding (with Fines)</div>
            <div className="stats-val" style={{ color: totalOutstanding > 0 ? 'var(--coral)' : 'var(--green)' }}>
              ₹{totalOutstanding.toLocaleString()}
            </div>
            <div style={{ fontSize: 12, color: 'var(--t2)', marginTop: 4 }}>
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
                      {inst.id === 'Inst-3' && dues.fineLevied > 0 && <span style={{ fontSize: 11, color: 'var(--coral)', marginLeft: 4 }}>(+₹1,500 Fine)</span>}
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
                          style={{ border: '1px solid var(--border2)', fontSize: 12 }}
                        >
                          📄 View Receipt
                        </button>
                      ) : paymentsLive ? (
                        <button
                          onClick={() => handleProcessPayment(inst)}
                          disabled={processing}
                          className="btn-primary"
                          style={{ fontSize: 12, padding: '6px 12px', background: 'var(--accent)', opacity: processing && activeCheckoutInst?.id === inst.id ? 0.7 : 1 }}
                        >
                          {processing && activeCheckoutInst?.id === inst.id ? 'Opening Razorpay...' : 'Pay Online'}
                        </button>
                      ) : (
                        <span style={{ fontSize: 12, color: 'var(--t3)', fontWeight: 700 }}>
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
            <p style={{ fontSize: 14, color: 'var(--t2)' }}>
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
                      <span style={{ fontSize: 14.5, fontWeight: 700 }}>{s.name}</span>
                      <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--green)' }}>-₹{(s.value ?? 0).toLocaleString()}</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--t2)', marginTop: 4 }}>Criteria: {s.criteria}</div>
                    
                    <div style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-end' }}>
                      {isApplied ? (
                        <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--green)' }}>✓ Waiver Applied</span>
                      ) : (
                        <button
                          onClick={() => handleApplyScholarship(s.id)}
                          disabled={!isEligible || applyingSch}
                          className="btn-ghost btn-sm"
                          style={{
                            border: '1.5px solid var(--border2)', fontSize: 12,
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

      {/* Online Checkout Confirmation Drawer Modal */}
      {activeCheckoutInst && (
        <div className="checkout-overlay">
          <div className="checkout-modal">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17.5, fontWeight: 800 }}>🔒 Secure Fee Payment Checkout</h3>
              <button onClick={() => setActiveCheckoutInst(null)} style={{ border: 'none', background: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--t2)' }}>✕</button>
            </div>

            {success ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 44, marginBottom: 10 }}>🎉</div>
                <h4 style={{ fontSize: 17.5, fontWeight: 800, color: 'var(--green)' }}>Payment Confirmed!</h4>
                <p style={{ fontSize: 13, color: 'var(--t2)', marginTop: 4 }}>Your transaction was verified and recorded in the campus accounts ledger.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ background: 'var(--bg3)', padding: 16, borderRadius: 12, border: '1px solid var(--border)', fontSize: 14.5 }}>
                  <div style={{ color: 'var(--t2)', fontSize: 13, fontWeight: 700, textTransform: 'uppercase' }}>Installment Fee Head</div>
                  <div style={{ fontSize: 16.5, fontWeight: 800, color: 'var(--t1)', marginTop: 2 }}>{activeCheckoutInst.name}</div>
                  
                  <div style={{ borderTop: '1px solid var(--border)', marginTop: 12, paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--t2)' }}>
                      <span>Base Tuition Amount:</span>
                      <span>₹{(activeCheckoutInst.amount || 0).toLocaleString()}</span>
                    </div>
                    {activeCheckoutInst.status?.toLowerCase() === 'overdue' && dues?.fineLevied > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--coral)' }}>
                        <span>Late Payment Penalty:</span>
                        <span>₹{dues.fineLevied.toLocaleString()}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900, fontSize: 17.5, color: 'var(--t1)', borderTop: '1px dashed var(--border2)', paddingTop: 8, marginTop: 4 }}>
                      <span>Total Payable Amount:</span>
                      <span>
                        ₹{(
                          (activeCheckoutInst.amount || 0) +
                          (activeCheckoutInst.status?.toLowerCase() === 'overdue' && dues?.fineLevied > 0 ? dues.fineLevied : 0)
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ background: 'rgba(37, 99, 235, 0.06)', border: '1px solid rgba(37, 99, 235, 0.2)', padding: 12, borderRadius: 10, fontSize: 12.5, color: 'var(--t2)', lineHeight: 1.5 }}>
                  🛡️ <strong>PCI-DSS Certified Gateway:</strong> Payments are processed directly through Razorpay Level-1 PCI-DSS compliant checkout. PinIT never captures or stores your card numbers, CVVs, or banking credentials.
                </div>

                <button
                  type="button"
                  onClick={() => handleProcessPayment(activeCheckoutInst)}
                  className="btn-pay"
                  disabled={processing}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                >
                  {processing ? 'Connecting to Razorpay...' : '🔒 Launch Secure Razorpay Checkout →'}
                </button>
              </div>
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
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 16.5, fontWeight: 900, margin: 0 }}>{institutionName.toUpperCase()}</h4>
                <div style={{ fontSize: 11, color: 'var(--t2)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>CAMPUS ACCOUNTS & COMPTROLLER BURSAR OFFICE</div>
              </div>
              <button onClick={() => setActiveReceipt(null)} style={{ border: 'none', background: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--t2)' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 14.5 }}>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--t2)', fontSize: 14 }}>
                  <span>{activeReceipt.name}</span>
                  <span>₹{(activeReceipt.amount ?? 0).toLocaleString()}</span>
                </div>
                {activeReceipt.fineLevied > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--coral)', fontSize: 14, marginTop: 4 }}>
                    <span>Late Payment Penalty Fee</span>
                    <span>₹{activeReceipt.fineLevied.toLocaleString()}</span>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 17.5, fontWeight: 900, marginBottom: 20 }}>
                <span>Total Amount Paid:</span>
                <span>₹{((activeReceipt.amount || 0) + (activeReceipt.fineLevied || 0)).toLocaleString()}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                <div className="receipt-seal">Secured Paid</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => handleDownloadFeeVoucher(activeReceipt)}
                    className="btn-primary"
                    style={{ fontSize: 13, padding: '6px 12px', background: 'var(--accent)' }}
                  >
                    📄 Download Fee Voucher
                  </button>
                  <button
                    onClick={() => { window.print(); }}
                    className="btn-ghost"
                    style={{ border: '1.5px solid var(--border2)', fontSize: 13, padding: '6px 12px' }}
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
