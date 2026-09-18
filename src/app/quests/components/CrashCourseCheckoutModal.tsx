'use client';

import React, { useState } from 'react';
import type { CrashPlan } from '@/lib/data/crashPlansData';
import { openRazorpayCheckout } from '@/lib/razorpay';
import { toast } from '@/lib/store/useAppStore';

// ─────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────
type PaymentState = 'idle' | 'processing' | 'success';
type PaymentMethod = 'razorpay' | 'pins' | 'sandbox';

export interface CrashCourseCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: CrashPlan | null;
  activeTrack: 'web_fullstack' | 'python_ai';
  onSuccessEnrollment: (enrollment: any) => void;
  studentName?: string;
  userPins?: number;
}

// ─────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────
const PROMO_CODE = 'PINIT2026';
const PROMO_DISCOUNT = 1000;
const GST_RATE = 0.18;

const TRACK_LABELS: Record<'web_fullstack' | 'python_ai', string> = {
  web_fullstack: 'Full-Stack Web Dev',
  python_ai: 'Python & AI Engineering',
};

const DELIVERABLES = [
  { icon: '🎓', label: 'Project-Based Certificate', sub: 'SHA-256 verifiable credential' },
  { icon: '🏢', label: 'Real-Time Internship Certificate', sub: 'QR + verifiable hash' },
  { icon: '💼', label: 'Placement-Ready Prep', sub: 'Interview & resume coaching' },
  { icon: '🌐', label: '4 Language Trainings', sub: 'English, German, French, Spanish' },
];

const PAYMENT_METHODS = [
  {
    id: 'razorpay',
    icon: '💳',
    title: 'Razorpay Live',
    subtitle: 'UPI • Cards • NetBanking',
    description: 'Secure instant payment via Razorpay gateway',
    gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  },
  {
    id: 'pins',
    icon: '🪙',
    title: 'PinIT Vault Coins',
    subtitle: 'Spend your earned Pins',
    description: 'Pay directly from your PinIT wallet balance',
    gradient: 'linear-gradient(135deg, #f59e0b, #f97316)',
  },
  {
    id: 'sandbox',
    icon: '🧪',
    title: 'Instant Demo Checkout',
    subtitle: 'Sandbox / Offline Testing',
    description: 'Simulated verified transaction for development',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
  },
];

// ─────────────────────────────────────────────────────────────────────
// Helper: generate mock transaction ID
// ─────────────────────────────────────────────────────────────────────
function generateMockTransactionId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = 'TXN-';
  for (let i = 0; i < 12; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

// ─────────────────────────────────────────────────────────────────────
// Helper: format INR currency
// ─────────────────────────────────────────────────────────────────────
function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

// ─────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────
export default function CrashCourseCheckoutModal({
  isOpen,
  onClose,
  plan,
  activeTrack,
  onSuccessEnrollment,
  studentName = '',
  userPins = 0,
}: CrashCourseCheckoutModalProps) {
  const [paymentState, setPaymentState] = useState<PaymentState>('idle');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('razorpay');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [orderId, setOrderId] = useState('');
  const [walletInfo, setWalletInfo] = useState<any>(null);
  const [isLaunchingWorkspace, setIsLaunchingWorkspace] = useState(false);

  if (!isOpen || !plan) return null;

  const baseTuition = plan.inrPrice;
  const discount = promoApplied ? PROMO_DISCOUNT : 0;
  const discountedSubtotal = Math.max(0, baseTuition - discount);
  const gstAmount = Math.round(discountedSubtotal * GST_RATE);
  const finalPayable = discountedSubtotal + gstAmount;
  const canPayWithPins = userPins >= plan.pinsPrice;

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === PROMO_CODE) {
      setPromoApplied(true);
      toast.success('Scholarship Applied!', '₹1,000 Early Bird discount added to your order.');
    } else {
      setPromoApplied(false);
      toast.error('Invalid Promo Code', 'Please check the code and try again.');
    }
  };

  const handleDownloadReceipt = () => {
    const receiptContent = `
PINIT CAREER OS — ENROLLMENT RECEIPT
=====================================
Student: ${studentName || 'PinIT Student'}
Program: ${plan.title}
Track: ${TRACK_LABELS[activeTrack]}
Transaction ID: ${transactionId}
Order ID: ${orderId}
Amount Paid: ${formatINR(finalPayable)}
Payment Method: ${PAYMENT_METHODS.find(m => m.id === selectedMethod)?.title}
Enrollment Date: ${new Date().toLocaleDateString('en-IN')}
Status: ACTIVE
=====================================
Thank you for enrolling with PinIT Career OS!
`;
    const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pinit-enrollment-receipt-${transactionId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Receipt Downloaded', 'Your enrollment receipt has been saved.');
  };

  const handleLaunchWorkspace = () => {
    setIsLaunchingWorkspace(true);
    toast.success('Workspace Launching...', 'Your personalized program workspace is being prepared.');
    const enrollment = {
      enrollmentId: `enr-${Date.now()}`,
      userId: 'current-user',
      planId: plan.id,
      track: activeTrack,
      amountPaid: finalPayable,
      paymentId: transactionId,
      orderId,
      paymentMethod: selectedMethod,
      status: 'active',
      enrolledAt: new Date().toISOString(),
      currentSprint: 1,
      dailyLearningHoursTarget: 1,
      milestoneProgress: {
        sprint1Approved: false,
        sprint2Approved: false,
      },
      certificatesIssued: {},
    };
    onSuccessEnrollment(enrollment);
    setTimeout(() => setIsLaunchingWorkspace(false), 1200);
  };

  const completeEnrollment = (paymentId: string, orderReference: string, walletData?: any) => {
    setTransactionId(paymentId);
    setOrderId(orderReference);
    if (walletData) setWalletInfo(walletData);
    setPaymentState('success');
    setProcessingMessage('');
    if (walletData?.rewardPinsCredited) {
      toast.success('Reward Pins Credited! ⚡', `+${walletData.rewardPinsCredited} PinIT Coins added to your wallet!`);
    } else if (walletData?.pinsDeducted) {
      toast.success('Pins Deducted 🪙', `-${walletData.pinsDeducted} Pins debited from your wallet for enrollment.`);
    } else {
      toast.success('Enrollment Confirmed!', `Welcome to ${plan.title}. Your journey begins now.`);
    }
  };

  const handleRazorpayPayment = async () => {
    try {
      setPaymentState('processing');
      setProcessingMessage('Creating your secure payment order...');

      const orderResponse = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: plan.id, track: activeTrack }),
      });

      if (!orderResponse.ok) throw new Error('Failed to create payment order');
      const orderData = await orderResponse.json();

      const razorpaySuccess = await openRazorpayCheckout({
        key: orderData.keyId || orderData.key || '',
        amount: orderData.amount,
        currency: 'INR',
        name: 'PinIT Career OS',
        description: plan.title,
        order_id: orderData.orderId || orderData.order_id || '',
        handler: async (response) => {
          setProcessingMessage('Verifying your payment...');
          const verifyResponse = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response),
          });
          if (!verifyResponse.ok) throw new Error('Payment verification failed');
          const verifyData = await verifyResponse.json();
          completeEnrollment(
            verifyData.payment_id || response.razorpay_payment_id,
            orderData.order_id
          );
        },
        prefill: {
          name: studentName || undefined,
        },
        modal: {
          ondismiss: () => {
            setPaymentState('idle');
            setProcessingMessage('');
          },
        },
      });

      if (!razorpaySuccess) throw new Error('Razorpay SDK failed to load');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to process payment';
      toast.error('Payment Failed', message);
      setPaymentState('idle');
      setProcessingMessage('');
    }
  };

  const handlePinsPayment = async () => {
    if (!canPayWithPins) {
      toast.error('Insufficient Pins', `You need ${plan.pinsPrice} Pins. Current balance: ${userPins}.`);
      return;
    }
    setPaymentState('processing');
    setProcessingMessage('Authorizing & deducting PinIT Vault Coins...');
    try {
      const res = await fetch('/api/quests/enrollment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: plan.id,
          track: activeTrack,
          paymentMethod: 'pins',
          amountPaid: plan.pinsPrice,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.message || data.error || 'Failed to process pin payment.');
      }
      const txnId = data.wallet?.transaction?.id || `TXN-PIN-${Date.now()}`;
      completeEnrollment(txnId, `PIN-ORDER-${Date.now()}`, data.wallet);
    } catch (err: any) {
      toast.error('Pin Payment Failed', err.message || 'Could not deduct pins.');
      setPaymentState('idle');
      setProcessingMessage('');
    }
  };

  const handleSandboxPayment = async () => {
    setPaymentState('processing');
    setProcessingMessage('Simulating verified transaction & crediting reward pins...');
    try {
      const res = await fetch('/api/quests/enrollment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: plan.id,
          track: activeTrack,
          paymentMethod: 'sandbox',
          amountPaid: finalPayable,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.message || data.error || 'Failed to process sandbox transaction.');
      }
      const txnId = data.wallet?.transaction?.id || `TXN-SBOX-${Date.now()}`;
      completeEnrollment(txnId, `SANDBOX-${Date.now()}`, data.wallet);
    } catch (err: any) {
      toast.error('Sandbox Transaction Error', err.message || 'Error processing transaction.');
      setPaymentState('idle');
      setProcessingMessage('');
    }
  };

  const handlePayment = () => {
    if (selectedMethod === 'razorpay') {
      handleRazorpayPayment();
    } else if (selectedMethod === 'pins') {
      handlePinsPayment();
    } else {
      handleSandboxPayment();
    }
  };

  const renderConfetti = () => {
    const colors = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#38bdf8', '#ec4899'];
    const pieces = Array.from({ length: 24 }, (_, index) => ({
      left: `${(index * 37) % 100}%`,
      background: colors[index % colors.length],
      animationDelay: `${(index % 8) * 0.12}s`,
      animationDuration: `${2.4 + (index % 4) * 0.3}s`,
      width: index % 3 === 0 ? '6px' : '8px',
      height: index % 3 === 0 ? '14px' : '6px',
      borderRadius: index % 3 === 0 ? '50%' : '2px',
    }));

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {pieces.map((piece, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: '-20px',
              left: piece.left,
              width: piece.width,
              height: piece.height,
              borderRadius: piece.borderRadius,
              background: piece.background,
              animation: `confetti-fall ${piece.animationDuration} linear infinite`,
              animationDelay: piece.animationDelay,
              opacity: 0.9,
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 24,
      }}
      aria-modal="true"
      role="dialog"
      aria-label={`${plan.title} checkout`}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 620,
          maxHeight: '92vh',
          overflow: 'auto',
          background: 'rgba(15, 23, 42, 0.92)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 24,
          boxShadow: '0 24px 80px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(99, 102, 241, 0.15)',
          color: 'var(--text)',
        }}
      >
        {paymentState === 'success' && renderConfetti()}

        {/* ── Header ───────────────────────────────────────────────── */}
        <div style={{
          padding: '22px 28px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(16, 185, 129, 0.08))',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 26 }}>🚀</span>
              <h2 style={{ fontSize: 21, fontWeight: 900, margin: 0, fontFamily: 'var(--font-display)', color: 'var(--t1)' }}>
                {paymentState === 'success' ? 'Welcome Aboard!' : 'Secure Checkout'}
              </h2>
            </div>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--t3)' }}>
              {paymentState === 'success' ? 'Your enrollment is confirmed. Let\'s build your future.' : 'Complete your enrollment in under 2 minutes.'}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close checkout"
            style={{
              padding: '6px 12px',
              borderRadius: 8,
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'var(--t2)',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>

        {/* ── Success State ────────────────────────────────────────── */}
        {paymentState === 'success' ? (
          <div style={{ padding: '32px 28px', textAlign: 'center' }}>
            <div style={{
              width: 88,
              height: 88,
              margin: '0 auto 18px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 40,
              boxShadow: '0 12px 32px rgba(16, 185, 129, 0.4)',
            }}>
              ✓
            </div>
            <h3 style={{ fontSize: 22, fontWeight: 900, margin: '0 0 6px', fontFamily: 'var(--font-display)', color: 'var(--t1)' }}>
              Enrollment Confirmed!
            </h3>
            <p style={{ fontSize: 13.5, color: 'var(--t3)', marginBottom: 22 }}>
              You're now enrolled in <strong style={{ color: 'var(--accent)' }}>{plan.title}</strong>.
            </p>

            <div style={{
              padding: 16,
              borderRadius: 14,
              background: 'var(--bg3)',
              border: '1px solid var(--border)',
              marginBottom: 20,
              textAlign: 'left',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: 'var(--t3)' }}>Transaction ID</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--accent)', fontFamily: 'monospace' }}>{transactionId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: 'var(--t3)' }}>Order ID</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--t1)', fontFamily: 'monospace' }}>{orderId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: 'var(--t3)' }}>Program Start Date</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#10b981' }}>{new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN')}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                onClick={handleDownloadReceipt}
                style={{
                  padding: '13px 20px',
                  borderRadius: 12,
                  background: 'var(--bg3)',
                  border: '1px solid var(--border)',
                  color: 'var(--t1)',
                  fontSize: 13.5,
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                📄 Download Enrollment Receipt
              </button>
              <button
                onClick={handleLaunchWorkspace}
                disabled={isLaunchingWorkspace}
                style={{
                  padding: '14px 20px',
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  border: 'none',
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: 900,
                  cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(99, 102, 241, 0.35)',
                  opacity: isLaunchingWorkspace ? 0.6 : 1,
                }}
              >
                {isLaunchingWorkspace ? '⏳ Launching...' : '🚀 Launch Program Workspace'}
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* ── Plan Summary ─────────────────────────────────────── */}
            <div style={{ padding: '20px 28px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div>
                  <h3 style={{ fontSize: 17, fontWeight: 900, margin: '0 0 4px', fontFamily: 'var(--font-display)', color: 'var(--t1)' }}>
                    {plan.title}
                  </h3>
                  <p style={{ margin: 0, fontSize: 12, color: 'var(--t3)' }}>{plan.subtitle}</p>
                </div>
                <span style={{
                  padding: '5px 12px',
                  borderRadius: 8,
                  background: plan.highlightColor + '22',
                  border: `1px solid ${plan.highlightColor}55`,
                  color: plan.highlightColor,
                  fontSize: 11,
                  fontWeight: 800,
                  whiteSpace: 'nowrap',
                }}>
                  {TRACK_LABELS[activeTrack]}
                </span>
              </div>

              <div style={{
                padding: '10px 14px',
                borderRadius: 10,
                background: 'rgba(56, 189, 248, 0.08)',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                marginBottom: 16,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 700, color: '#38bdf8' }}>
                  <span>⏱️</span>
                  <span>{plan.totalProgramDuration} (Course + 1M Project + {plan.internshipDurationMonths} Real-time Internship)</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 8 }}>
                {DELIVERABLES.map((item) => (
                  <div key={item.label} style={{
                    padding: 10,
                    borderRadius: 10,
                    background: 'var(--bg3)',
                    border: '1px solid var(--border)',
                  }}>
                    <div style={{ fontSize: 18, marginBottom: 4 }}>{item.icon}</div>
                    <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--t1)', marginBottom: 2 }}>{item.label}</div>
                    <div style={{ fontSize: 9.5, color: 'var(--t4)' }}>{item.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Pricing Breakdown ───────────────────────────────── */}
            <div style={{ padding: '20px 28px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <h4 style={{ fontSize: 14, fontWeight: 900, margin: '0 0 14px', fontFamily: 'var(--font-display)', color: 'var(--t1)' }}>
                💰 Pricing Breakdown
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: 'var(--t2)' }}>Base Tuition Fee</span>
                  <span style={{ fontWeight: 800, color: 'var(--t1)' }}>{formatINR(baseTuition)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: 'var(--t2)' }}>Scholar Scholarship / Early Bird Promo</span>
                  <span style={{ fontWeight: 800, color: '#10b981' }}>
                    {promoApplied ? `− ${formatINR(PROMO_DISCOUNT)}` : 'Not applied'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: 'var(--t2)' }}>18% GST</span>
                  <span style={{ fontWeight: 800, color: 'var(--t1)' }}>{formatINR(gstAmount)}</span>
                </div>
              </div>

              <div style={{
                padding: '12px 14px',
                borderRadius: 10,
                background: 'var(--bg3)',
                border: '1px dashed rgba(245, 158, 11, 0.3)',
                marginBottom: 12,
              }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter promo code (e.g. PINIT2026)"
                    style={{
                      flex: 1,
                      padding: '9px 12px',
                      borderRadius: 8,
                      border: '1px solid var(--border)',
                      background: 'var(--bg2)',
                      color: 'var(--text)',
                      fontSize: 12.5,
                      fontWeight: 600,
                      outline: 'none',
                    }}
                    aria-label="Promo code"
                  />
                  <button
                    onClick={handleApplyPromo}
                    style={{
                      padding: '9px 16px',
                      borderRadius: 8,
                      background: 'linear-gradient(135deg, #f59e0b, #f97316)',
                      border: 'none',
                      color: '#fff',
                      fontSize: 12,
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    Apply
                  </button>
                </div>
                <div style={{ fontSize: 11, color: 'var(--t4)' }}>
                  💡 Use code <strong style={{ color: '#f59e0b', fontFamily: 'monospace' }}>PINIT2026</strong> to save ₹1,000 instantly
                </div>
              </div>

              <div style={{
                padding: '14px 16px',
                borderRadius: 12,
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.1))',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--t1)' }}>Final Payable</span>
                <span style={{ fontSize: 24, fontWeight: 900, color: '#fff', fontFamily: 'var(--font-display)' }}>
                  {formatINR(finalPayable)}
                </span>
              </div>
            </div>

            {/* ── Payment Methods ─────────────────────────────────── */}
            <div style={{ padding: '20px 28px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <h4 style={{ fontSize: 14, fontWeight: 900, margin: '0 0 12px', fontFamily: 'var(--font-display)', color: 'var(--t1)' }}>
                🛡️ Choose Payment Method
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {PAYMENT_METHODS.map((method) => {
                  const isDisabled = method.id === 'pins' && !canPayWithPins;
                  const isSelected = selectedMethod === method.id;
                  return (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id as PaymentMethod)}
                      disabled={isDisabled}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 14,
                        padding: '14px 16px',
                        borderRadius: 14,
                        border: isSelected ? '1.5px solid var(--accent)' : '1px solid var(--border)',
                        background: isSelected
                          ? 'rgba(99, 102, 241, 0.1)'
                          : isDisabled
                            ? 'rgba(255, 255, 255, 0.02)'
                            : 'var(--bg3)',
                        cursor: isDisabled ? 'not-allowed' : 'pointer',
                        opacity: isDisabled ? 0.5 : 1,
                        transition: 'all 0.2s ease',
                        textAlign: 'left',
                      }}
                    >
                      <span style={{
                        width: 42,
                        height: 42,
                        borderRadius: 12,
                        background: method.gradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 19,
                        flexShrink: 0,
                      }}>
                        {method.icon}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 900, color: 'var(--t1)', marginBottom: 2 }}>
                          {method.title}
                        </div>
                        <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--t3)', marginBottom: 3 }}>
                          {method.subtitle}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--t4)' }}>{method.description}</div>
                        {method.id === 'pins' && (
                          <div style={{ fontSize: 11, fontWeight: 700, color: canPayWithPins ? '#f59e0b' : '#ef4444', marginTop: 3 }}>
                            {canPayWithPins ? `Balance: ${userPins} Pins • Price: ${plan.pinsPrice} Pins` : `Need ${plan.pinsPrice} Pins • You have ${userPins}`}
                          </div>
                        )}
                      </div>
                      <span style={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        border: `2px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
                        background: isSelected ? 'var(--accent)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 11,
                        fontWeight: 900,
                        color: isSelected ? '#fff' : 'transparent',
                        flexShrink: 0,
                      }}>
                        {isSelected ? '✓' : ''}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Processing State ────────────────────────────────── */}
            {paymentState === 'processing' && (
              <div style={{
                padding: '28px',
                textAlign: 'center',
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.06), rgba(16, 185, 129, 0.04))',
              }}>
                <div style={{
                  width: 64,
                  height: 64,
                  margin: '0 auto 16px',
                  borderRadius: '50%',
                  border: '4px solid rgba(99, 102, 241, 0.15)',
                  borderTopColor: '#6366f1',
                  borderRightColor: '#8b5cf6',
                  animation: 'spin 1s linear infinite',
                }} />
                <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--t1)', marginBottom: 6 }}>
                  {processingMessage}
                </div>
                <div style={{ fontSize: 12, color: 'var(--t3)' }}>
                  Please do not close this window...
                </div>
              </div>
            )}

            {/* ── Footer / CTA ───────────────────────────────────── */}
            <div style={{
              padding: '18px 28px',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              background: 'var(--bg3)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--t4)' }}>
                <span>🔒</span>
                <span>Payments are encrypted and secure. By enrolling, you agree to the program terms.</span>
              </div>
              <button
                onClick={handlePayment}
                disabled={paymentState === 'processing'}
                style={{
                  padding: '15px 20px',
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  border: 'none',
                  color: '#fff',
                  fontSize: 14.5,
                  fontWeight: 900,
                  cursor: paymentState === 'processing' ? 'not-allowed' : 'pointer',
                  boxShadow: '0 6px 20px rgba(99, 102, 241, 0.35)',
                  opacity: paymentState === 'processing' ? 0.6 : 1,
                }}
              >
                {paymentState === 'processing' ? '⏳ Processing...' : `Enroll Now — ${formatINR(finalPayable)}`}
              </button>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
