'use client';

import React, { useState } from 'react';
import type { CrashPlan } from '@/lib/data/crashPlansData';
import { INTERNSHIP_AVAILABLE } from '@/lib/data/crashPlansData';
import { openRazorpayCheckout } from '@/lib/razorpay';
import { toast } from '@/lib/store/useAppStore';
import { api, ApiError } from '@/lib/api/client';
import type { CrashCourseEnrollment } from '@/lib/services/crashCourseEnrollmentService';

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
  /** Called with the enrollment the server created once payment was confirmed. */
  onSuccessEnrollment: (enrollment: CrashCourseEnrollment, newPinBalance?: number | null) => void;
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

const ALL_DELIVERABLES = [
  { icon: '🎓', label: 'Verifiable Certificate', sub: 'SHA-256 signed credential' },
  { icon: '🏢', label: 'Industry Internship', sub: 'Live real-time supervisor grading' },
  { icon: '💼', label: 'Campus Placement Prep', sub: '1-on-1 AI mock interviews' },
  { icon: '🌐', label: 'Corporate Languages', sub: 'Technical English & documentation' },
];
const DELIVERABLES = ALL_DELIVERABLES.filter((d) => INTERNSHIP_AVAILABLE || !/internship/i.test(d.label));

const PAYMENT_METHODS = [
  {
    id: 'razorpay',
    icon: '💳',
    title: 'Razorpay Live UPI',
    subtitle: 'Google Pay • PhonePe • Cards',
    description: 'Instant secure checkout via UPI or NetBanking',
    gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  },
  {
    id: 'pins',
    icon: '🪙',
    title: 'PinIT Vault Coins',
    subtitle: 'Pay with earned Pins',
    description: 'Debit directly from your PinIT student wallet',
    gradient: 'linear-gradient(135deg, #f59e0b, #f97316)',
  },
  {
    id: 'sandbox',
    icon: '🧪',
    title: 'Instant Sandbox Demo',
    subtitle: 'Offline Verification Testing',
    description: 'Simulate verified enrollment without live payment keys',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
  },
];

// ─────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateCheckoutPricing(baseTuition: number, promoApplied: boolean) {
  const discount = promoApplied ? PROMO_DISCOUNT : 0;
  const discountedSubtotal = Math.max(0, baseTuition - discount);
  const gstAmount = Math.round(discountedSubtotal * GST_RATE);
  const finalPayable = discountedSubtotal + gstAmount;
  return {
    baseTuition,
    discount,
    discountedSubtotal,
    gstAmount,
    finalPayable,
  };
}

// ─────────────────────────────────────────────────────────────────────
// Main Component
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
  const [confirmedEnrollment, setConfirmedEnrollment] = useState<CrashCourseEnrollment | null>(null);

  React.useEffect(() => {
    if (!isOpen || paymentState === 'processing' || typeof window === 'undefined') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (confirmedEnrollment) {
          onSuccessEnrollment(confirmedEnrollment, walletInfo?.newBalance ?? null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, paymentState, confirmedEnrollment, walletInfo, onSuccessEnrollment, onClose]);

  if (!isOpen || !plan) return null;

  const { baseTuition, gstAmount, finalPayable } = calculateCheckoutPricing(plan.inrPrice, promoApplied);
  const canPayWithPins = userPins >= plan.pinsPrice;
  const amountPaidLabel = confirmedEnrollment
    ? confirmedEnrollment.paymentMethod === 'pins'
      ? `${confirmedEnrollment.pinsDeducted ?? confirmedEnrollment.amountPaid} Pins`
      : formatINR(confirmedEnrollment.amountPaid)
    : formatINR(finalPayable);

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
Amount Paid: ${amountPaidLabel}
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
    if (!confirmedEnrollment) return;
    setIsLaunchingWorkspace(true);
    toast.success('Workspace Launching...', 'Your personalized program workspace is being prepared.');
    onSuccessEnrollment(confirmedEnrollment, walletInfo?.newBalance ?? null);
    setTimeout(() => setIsLaunchingWorkspace(false), 1200);
  };

  const handleClose = () => {
    if (confirmedEnrollment) {
      onSuccessEnrollment(confirmedEnrollment, walletInfo?.newBalance ?? null);
      return;
    }
    onClose();
  };

  const completeEnrollment = (
    paymentId: string,
    orderReference: string,
    enrollment: CrashCourseEnrollment,
    walletData?: any,
    alreadyEnrolled = false,
  ) => {
    setTransactionId(paymentId);
    setOrderId(orderReference);
    setConfirmedEnrollment(enrollment);
    if (walletData) setWalletInfo(walletData);
    setPaymentState('success');
    setProcessingMessage('');
    if (alreadyEnrolled) {
      toast.info('Already Enrolled', `You're already enrolled in ${plan.title}. You were not charged again.`);
    } else if (walletData?.rewardPinsCredited) {
      toast.success('Reward Pins Credited! ⚡', `+${walletData.rewardPinsCredited} PinIT Coins added to your wallet!`);
    } else if (walletData?.pinsDeducted) {
      toast.success('Pins Deducted 🪙', `-${walletData.pinsDeducted} Pins debited from your wallet for enrollment.`);
    } else {
      toast.success('Enrollment Confirmed!', `Welcome to ${plan.title}. Your journey begins now.`);
    }
  };

  const failPayment = (title: string, err: unknown) => {
    toast.error(title, err instanceof Error ? err.message : 'Unable to process payment');
    setPaymentState('idle');
    setProcessingMessage('');
  };

  type VerifyResponse = { ok: boolean; enrollment?: CrashCourseEnrollment; paymentId?: string; rewardPinsCredited?: number };

  const verifyAndEnroll = async (verifyBody: Record<string, string>): Promise<VerifyResponse> => {
    for (let attempt = 1; ; attempt++) {
      try {
        return await api.post<VerifyResponse>('/api/payment/verify', verifyBody);
      } catch (err) {
        const retryable = err instanceof ApiError && err.code === 'ENROLLMENT_FAILED';
        if (!retryable || attempt >= 3) throw err;
        setProcessingMessage('Payment confirmed. Finishing your enrollment...');
        await new Promise(resolve => setTimeout(resolve, 1500 * attempt));
      }
    }
  };

  const finishCardEnrollment = (verifyData: VerifyResponse, fallbackPaymentId: string, orderReference: string) => {
    if (!verifyData.enrollment) {
      throw new Error('Payment verified but no enrollment was returned. Please contact support.');
    }
    completeEnrollment(
      verifyData.paymentId || fallbackPaymentId,
      orderReference,
      verifyData.enrollment,
      { rewardPinsCredited: verifyData.rewardPinsCredited || 0 },
    );
  };

  const handleRazorpayPayment = async () => {
    try {
      setPaymentState('processing');
      setProcessingMessage('Creating secure order...');

      const orderData = await api.post<{ orderId?: string; order_id?: string; amount: number; keyId?: string; key?: string; isMock?: boolean }>(
        '/api/payment/create-order',
        { planId: plan.id, track: activeTrack },
      );
      const razorpayOrderId = orderData.orderId || orderData.order_id || '';

      if (orderData.isMock) {
        setProcessingMessage('Verifying sandbox payment...');
        const mockPaymentId = `pay_mock_${Date.now()}`;
        const verifyData = await verifyAndEnroll({
          razorpay_order_id: razorpayOrderId,
          razorpay_payment_id: mockPaymentId,
          razorpay_signature: 'sig_mock_dev',
          planId: plan.id,
          track: activeTrack,
        });
        finishCardEnrollment(verifyData, mockPaymentId, razorpayOrderId);
        return;
      }

      const razorpaySuccess = await openRazorpayCheckout({
        key: orderData.keyId || orderData.key || '',
        amount: orderData.amount,
        currency: 'INR',
        name: 'PinIT Career OS',
        description: plan.title,
        order_id: razorpayOrderId,
        handler: async (response) => {
          try {
            setProcessingMessage('Verifying payment & issuing credential...');
            const verifyData = await verifyAndEnroll({ ...response, planId: plan.id, track: activeTrack });
            finishCardEnrollment(verifyData, response.razorpay_payment_id, razorpayOrderId);
          } catch (err) {
            failPayment('Enrollment Failed', err);
          }
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

      if (!razorpaySuccess) throw new Error('Razorpay checkout initialization failed.');
    } catch (error) {
      failPayment('Payment Error', error);
    }
  };

  type EnrollmentResponse = {
    ok: boolean;
    enrollment: CrashCourseEnrollment;
    alreadyEnrolled?: boolean;
    wallet?: { newBalance: number | null; pinsDeducted: number; rewardPinsCredited: number };
  };

  const handlePinsPayment = async () => {
    if (!canPayWithPins) {
      toast.error('Insufficient Pins', `You need ${plan.pinsPrice} Pins. Current balance: ${userPins}.`);
      return;
    }
    setPaymentState('processing');
    setProcessingMessage('Authorizing & deducting PinIT Vault Coins...');
    try {
      const data = await api.post<EnrollmentResponse>('/api/quests/enrollment', {
        planId: plan.id,
        track: activeTrack,
        paymentMethod: 'pins',
      });
      completeEnrollment(data.enrollment.paymentId, `PIN-ORDER-${data.enrollment.enrollmentId}`, data.enrollment, data.wallet, data.alreadyEnrolled);
    } catch (err) {
      failPayment('Pin Payment Failed', err);
    }
  };

  const handleSandboxPayment = async () => {
    setPaymentState('processing');
    setProcessingMessage('Simulating verified transaction & crediting reward pins...');
    try {
      const data = await api.post<EnrollmentResponse>('/api/quests/enrollment', {
        planId: plan.id,
        track: activeTrack,
        paymentMethod: 'sandbox',
      });
      completeEnrollment(data.enrollment.paymentId, `SANDBOX-${data.enrollment.enrollmentId}`, data.enrollment, data.wallet, data.alreadyEnrolled);
    } catch (err) {
      failPayment('Sandbox Transaction Error', err);
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
      data-testid="crash-checkout-modal"
      onClick={(e) => { if (paymentState !== 'processing' && e.target === e.currentTarget) handleClose(); }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 16,
      }}
      aria-modal="true"
      role="dialog"
      aria-label={`${plan.title} checkout`}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 820,
          maxHeight: 'min(92vh, 620px)',
          display: 'flex',
          flexDirection: 'column',
          background: 'rgba(15, 23, 42, 0.96)',
          border: '1.5px solid rgba(99, 102, 241, 0.25)',
          borderRadius: 20,
          boxShadow: '0 24px 80px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.08)',
          color: 'var(--text)',
          overflow: 'hidden',
        }}
      >
        {paymentState === 'success' && renderConfetti()}

        {/* ── Compact Header (Zero Scroll Header) ────────────────── */}
        <div style={{
          padding: '14px 22px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.14), rgba(16, 185, 129, 0.08))',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 22 }}>🚀</span>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 900, margin: 0, fontFamily: 'var(--font-display)', color: 'var(--t1)', lineHeight: 1.2 }}>
                {paymentState === 'success' ? 'Enrollment Confirmed!' : `Enroll in ${plan.title}`}
              </h2>
              <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 2 }}>
                {paymentState === 'success' ? 'Your curriculum workspace is ready.' : 'Instant verified activation • Zero hidden charges'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              padding: '4px 10px', borderRadius: 20,
              background: plan.highlightColor + '22',
              border: `1px solid ${plan.highlightColor}55`,
              color: plan.highlightColor,
              fontSize: 11, fontWeight: 800,
            }}>
              {TRACK_LABELS[activeTrack]}
            </span>
            <button
              data-testid="btn-close-checkout"
              onClick={handleClose}
              aria-label="Close checkout"
              style={{
                width: 32, height: 32, borderRadius: 8,
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'var(--t2)', fontSize: 14, fontWeight: 700,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* ── Success State View ─────────────────────────────────── */}
        {paymentState === 'success' ? (
          <div data-testid="checkout-success-view" style={{ padding: '32px 28px', textAlign: 'center', overflowY: 'auto' }}>
            <div style={{
              width: 76, height: 76, margin: '0 auto 16px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 38, boxShadow: '0 12px 32px rgba(16, 185, 129, 0.4)',
            }}>
              ✓
            </div>
            <h3 style={{ fontSize: 22, fontWeight: 900, margin: '0 0 6px', fontFamily: 'var(--font-display)', color: 'var(--t1)' }}>
              Welcome to {plan.title}!
            </h3>
            <p style={{ fontSize: 14, color: 'var(--t3)', marginBottom: 20 }}>
              Your seat is confirmed with verified SHA-256 credentials tracking.
            </p>

            <div style={{
              padding: 14, borderRadius: 12, background: 'var(--bg3)',
              border: '1px solid var(--border)', marginBottom: 18, textAlign: 'left', maxWidth: 440, margin: '0 auto 18px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12.5 }}>
                <span style={{ color: 'var(--t3)' }}>Transaction ID</span>
                <span style={{ fontWeight: 800, color: 'var(--accent)', fontFamily: 'monospace' }}>{transactionId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12.5 }}>
                <span style={{ color: 'var(--t3)' }}>Order Reference</span>
                <span style={{ fontWeight: 800, color: 'var(--t1)', fontFamily: 'monospace' }}>{orderId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5 }}>
                <span style={{ color: 'var(--t3)' }}>Curriculum Access</span>
                <span style={{ fontWeight: 800, color: '#10b981' }}>Instant 24/7 Access</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                data-testid="btn-download-receipt"
                onClick={handleDownloadReceipt}
                style={{
                  padding: '11px 18px', borderRadius: 10,
                  background: 'var(--bg3)', border: '1px solid var(--border)',
                  color: 'var(--t1)', fontSize: 13.5, fontWeight: 700, cursor: 'pointer',
                }}
              >
                📄 Download Receipt
              </button>
              <button
                data-testid="btn-launch-workspace"
                onClick={handleLaunchWorkspace}
                disabled={isLaunchingWorkspace}
                style={{
                  padding: '11px 22px', borderRadius: 10,
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  border: 'none', color: '#fff', fontSize: 14, fontWeight: 800,
                  cursor: 'pointer', boxShadow: '0 4px 16px rgba(99, 102, 241, 0.35)',
                  opacity: isLaunchingWorkspace ? 0.6 : 1,
                }}
              >
                {isLaunchingWorkspace ? '⏳ Launching...' : '🚀 Launch Program Workspace →'}
              </button>
            </div>
          </div>
        ) : (
          /* ── 2-Column Side-by-Side Split Body (Zero Vertical Scrolling Needed) ── */
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', flex: 1, minHeight: 0, overflow: 'hidden' }}>

            {/* ── LEFT COLUMN: Plan & Pricing Summary ── */}
            <div style={{
              padding: '18px 22px',
              borderRight: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              background: 'rgba(255, 255, 255, 0.01)',
              overflowY: 'auto',
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)', padding: '3px 8px', borderRadius: 6 }}>
                    ⏱️ {plan.totalProgramDuration}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--t3)' }}>
                    ({plan.totalProgramDuration} + Capstone)
                  </span>
                </div>

                {/* Deliverables Pills */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 14 }}>
                  {DELIVERABLES.map((item) => (
                    <div key={item.label} style={{
                      padding: '7px 9px', borderRadius: 8,
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border)',
                      display: 'flex', alignItems: 'center', gap: 8,
                    }}>
                      <span style={{ fontSize: 16 }}>{item.icon}</span>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 11.5, fontWeight: 800, color: 'var(--t1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.label}
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--t4)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.sub}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing Calculation */}
                <div style={{
                  padding: '12px 14px', borderRadius: 12,
                  background: 'var(--bg3)', border: '1px solid var(--border)',
                  display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ color: 'var(--t2)' }}>Base Tuition Fee</span>
                    <span data-testid="checkout-base-tuition" style={{ fontWeight: 700, color: 'var(--t1)' }}>{formatINR(baseTuition)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ color: 'var(--t2)' }}>Scholarship Promo</span>
                    <span data-testid="checkout-promo-discount" style={{ fontWeight: 800, color: '#10b981' }}>
                      {promoApplied ? `− ${formatINR(PROMO_DISCOUNT)}` : 'Available'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ color: 'var(--t2)' }}>Statutory GST (18%)</span>
                    <span data-testid="checkout-gst-amount" style={{ fontWeight: 700, color: 'var(--t1)' }}>{formatINR(gstAmount)}</span>
                  </div>
                </div>

                {/* Promo Code Input */}
                <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                  <input
                    data-testid="input-promo-code"
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Promo code (PINIT2026)"
                    style={{
                      flex: 1, padding: '7px 10px', borderRadius: 8,
                      border: '1px solid var(--border)', background: 'var(--bg2)',
                      color: 'var(--text)', fontSize: 12.5, fontWeight: 600, outline: 'none',
                    }}
                    aria-label="Promo code"
                  />
                  <button
                    data-testid="btn-apply-promo"
                    onClick={handleApplyPromo}
                    style={{
                      padding: '7px 12px', borderRadius: 8,
                      background: 'linear-gradient(135deg, #f59e0b, #f97316)',
                      border: 'none', color: '#fff', fontSize: 12, fontWeight: 800, cursor: 'pointer',
                    }}
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Final Payable Total Banner */}
              <div style={{
                padding: '10px 14px', borderRadius: 10,
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.1))',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--t1)' }}>Final Payable</span>
                <span data-testid="checkout-final-payable" style={{ fontSize: 22, fontWeight: 900, color: '#fff', fontFamily: 'var(--font-display)' }}>
                  {formatINR(finalPayable)}
                </span>
              </div>
            </div>

            {/* ── RIGHT COLUMN: Payment Methods & Instant Sticky Action ── */}
            <div style={{
              padding: '18px 22px',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              background: 'rgba(255, 255, 255, 0.02)',
              overflowY: 'auto',
            }}>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--t1)', marginBottom: 10 }}>
                  🛡️ Select Payment Method
                </div>

                {/* Method Options */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
                  {PAYMENT_METHODS.map((method) => {
                    const isDisabled = method.id === 'pins' && !canPayWithPins;
                    const isSelected = selectedMethod === method.id;
                    return (
                      <button
                        key={method.id}
                        data-testid={`btn-payment-method-${method.id}`}
                        onClick={() => setSelectedMethod(method.id as PaymentMethod)}
                        disabled={isDisabled}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          padding: '10px 12px', borderRadius: 10,
                          border: isSelected ? '1.5px solid var(--accent)' : '1px solid var(--border)',
                          background: isSelected ? 'rgba(99, 102, 241, 0.12)' : isDisabled ? 'rgba(255, 255, 255, 0.02)' : 'var(--bg3)',
                          cursor: isDisabled ? 'not-allowed' : 'pointer',
                          opacity: isDisabled ? 0.45 : 1,
                          textAlign: 'left',
                          transition: 'border-color 0.15s, background 0.15s',
                        }}
                      >
                        <span style={{
                          width: 34, height: 34, borderRadius: 8,
                          background: method.gradient, display: 'flex',
                          alignItems: 'center', justifyContent: 'center',
                          fontSize: 17, flexShrink: 0,
                        }}>
                          {method.icon}
                        </span>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--t1)' }}>
                            {method.title}
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--t3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {method.subtitle}
                          </div>
                          {method.id === 'pins' && (
                            <div style={{ fontSize: 10.5, fontWeight: 700, color: canPayWithPins ? '#f59e0b' : '#ef4444', marginTop: 2 }}>
                              {canPayWithPins ? `Balance: ${userPins} Pins • Cost: ${plan.pinsPrice} Pins` : `Need ${plan.pinsPrice} Pins (You have ${userPins})`}
                            </div>
                          )}
                        </div>

                        <span style={{
                          width: 18, height: 18, borderRadius: '50%',
                          border: `2px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
                          background: isSelected ? 'var(--accent)' : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 10, fontWeight: 900, color: isSelected ? '#fff' : 'transparent',
                          flexShrink: 0,
                        }}>
                          ✓
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Sticky Action Area */}
              <div>
                {paymentState === 'processing' ? (
                  <div style={{ padding: '12px', textAlign: 'center', background: 'rgba(99, 102, 241, 0.08)', borderRadius: 10, marginBottom: 8 }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--accent)' }}>
                      ⏳ {processingMessage || 'Authorizing enrollment...'}
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--t4)', marginBottom: 8 }}>
                      <span>🔒</span>
                      <span>256-bit encrypted checkout. Instant enrollment confirmation.</span>
                    </div>

                    <button
                      data-testid="btn-submit-checkout"
                      onClick={handlePayment}
                      disabled={false}
                      style={{
                        width: '100%', padding: '12px 0', borderRadius: 10,
                        background: selectedMethod === 'sandbox'
                          ? 'linear-gradient(135deg, #10b981, #059669)'
                          : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        border: 'none', color: '#fff', fontSize: 15, fontWeight: 900,
                        cursor: 'pointer',
                        boxShadow: '0 4px 16px rgba(99, 102, 241, 0.35)',
                        transition: 'transform 0.15s',
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; }}
                    >
                      {selectedMethod === 'sandbox'
                        ? '🧪 Instant Demo Enroll (Free Sandbox)'
                        : selectedMethod === 'pins'
                        ? `Pay with ${plan.pinsPrice} Pins →`
                        : `Pay & Enroll — ${formatINR(finalPayable)} →`}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
