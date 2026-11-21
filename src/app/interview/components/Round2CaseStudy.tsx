'use client';

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import type { Round2CodingProps } from './Round2Coding';

const VRoidInterviewAvatar = dynamic(
  () => import('@/components/avatar/VRoidInterviewAvatar'),
  { ssr: false }
);

export interface CaseMetric {
  id: string;
  label: string;
  formulaHint: string;
  unit: string;
  expected: number;
  tolerance: number;
  explanation: string;
}

export interface CaseData {
  company: string;
  roleContext: string;
  context: string;
  financialTable: Array<{ label: string; value: string }>;
  metrics: CaseMetric[];
  promptQuestion: string;
}

/**
 * Resolves realistic Indian B.Com / Commerce / Corporate Finance interview cases
 * calibrated to the candidate's selected business track — zero answer leaks in hints.
 */
export function resolveCaseStudyData(topic: string): CaseData {
  const lower = (topic || '').toLowerCase();

  if (lower.includes('bank') || lower.includes('credit') || lower.includes('loan') || lower.includes('treasury')) {
    return {
      company: 'Pinnacle Commercial Logistics Ltd. — ₹5.0 Cr Term Loan Appraisal',
      roleContext: 'Corporate Banking & Credit Committee Case',
      context:
        'Pinnacle Logistics has applied for a 5-year capex term loan of ₹5.00 Cr to expand its cold-chain fleet. As a Credit Analyst, compute the borrower’s repayment capacity, leverage, and liquidity ratios from Exhibit A and recommend whether the bank should sanction the facility.',
      financialTable: [
        { label: 'Annual Operating Revenue', value: '₹12.50 Cr' },
        { label: 'EBITDA', value: '₹2.50 Cr' },
        { label: 'Annual Total Debt Service (P + I)', value: '₹1.25 Cr' },
        { label: 'Total Outstanding Debt', value: '₹5.00 Cr' },
        { label: 'Tangible Net Worth (Equity)', value: '₹4.00 Cr' },
        { label: 'Current Assets / Current Liabilities', value: '₹3.60 Cr / ₹2.00 Cr' },
      ],
      metrics: [
        {
          id: 'dscr',
          label: 'Debt Service Coverage Ratio (DSCR)',
          formulaHint: 'EBITDA ÷ Annual Total Debt Service',
          unit: 'x',
          expected: 2.0,
          tolerance: 0.1,
          explanation: '₹2.50 Cr ÷ ₹1.25 Cr = 2.00x (Bank comfort hurdle ≥ 1.50x)',
        },
        {
          id: 'debt_to_ebitda',
          label: 'Total Debt / EBITDA',
          formulaHint: 'Total Outstanding Debt ÷ EBITDA',
          unit: 'x',
          expected: 2.0,
          tolerance: 0.1,
          explanation: '₹5.00 Cr ÷ ₹2.50 Cr = 2.00x (Prudent ceiling ≤ 3.50x)',
        },
        {
          id: 'debt_to_equity',
          label: 'Debt-to-Equity Ratio (D/E)',
          formulaHint: 'Total Debt ÷ Tangible Net Worth',
          unit: 'x',
          expected: 1.25,
          tolerance: 0.1,
          explanation: '₹5.00 Cr ÷ ₹4.00 Cr = 1.25x',
        },
        {
          id: 'current_ratio',
          label: 'Current Ratio',
          formulaHint: 'Current Assets ÷ Current Liabilities',
          unit: 'x',
          expected: 1.8,
          tolerance: 0.1,
          explanation: '₹3.60 Cr ÷ ₹2.00 Cr = 1.80x (MPBF benchmark ≥ 1.33x)',
        },
      ],
      promptQuestion:
        'Based on your credit ratios, would you recommend sanctioning the ₹5.0 Cr term loan? Identify two key credit risks and propose one financial covenant to protect the bank.',
    };
  }

  if (lower.includes('tax') || lower.includes('gst') || lower.includes('audit') || lower.includes('statutory')) {
    return {
      company: 'Meridian Precision Manufacturing Ltd. — FY25 Statutory & GST Audit',
      roleContext: 'Big-4 Audit & Direct/Indirect Tax Review',
      context:
        'During the FY25 statutory review of Meridian Manufacturing (Pune), you must verify gross profitability, net GST cash outflow after Input Tax Credit (ITC), operating margin, and working-capital receivable cycle before signing off the audit memo.',
      financialTable: [
        { label: 'Net Revenue from Operations', value: '₹250.0 Lakhs' },
        { label: 'Cost of Goods Sold (COGS)', value: '₹160.0 Lakhs' },
        { label: 'Operating Expenses (SG&A)', value: '₹45.0 Lakhs' },
        { label: 'Output GST Liability (18%)', value: '₹45.0 Lakhs' },
        { label: 'Eligible Input Tax Credit (ITC)', value: '₹36.0 Lakhs' },
        { label: 'Closing Trade Receivables', value: '₹37.5 Lakhs' },
      ],
      metrics: [
        {
          id: 'gross_margin',
          label: 'Gross Profit Margin (%)',
          formulaHint: '((Net Revenue − COGS) ÷ Net Revenue) × 100',
          unit: '%',
          expected: 36.0,
          tolerance: 0.5,
          explanation: '(₹250L − ₹160L) ÷ ₹250L × 100 = 36.0%',
        },
        {
          id: 'operating_margin',
          label: 'Operating Profit (EBIT) Margin (%)',
          formulaHint: '((Gross Profit − SG&A) ÷ Net Revenue) × 100',
          unit: '%',
          expected: 18.0,
          tolerance: 0.5,
          explanation: '(₹90L − ₹45L) ÷ ₹250L × 100 = 18.0%',
        },
        {
          id: 'net_gst_payable',
          label: 'Net GST Payable in Cash (₹ Lakhs)',
          formulaHint: 'Output GST Liability − Eligible ITC',
          unit: '₹L',
          expected: 9.0,
          tolerance: 0.2,
          explanation: '₹45.0L − ₹36.0L = ₹9.0 Lakhs net cash GST payable',
        },
        {
          id: 'receivable_days',
          label: 'Debtor / Receivable Days (DSO)',
          formulaHint: '(Closing Trade Receivables ÷ Net Revenue) × 365',
          unit: 'days',
          expected: 54.75,
          tolerance: 1.5,
          explanation: '(₹37.5L ÷ ₹250L) × 365 = 54.75 days',
        },
      ],
      promptQuestion:
        'Summarize your statutory audit findings. What two GSTR-2B / ITC reconciliation controls and receivable aging checks would you perform before issuing an unqualified audit opinion?',
    };
  }

  if (lower.includes('market') || lower.includes('dmkt') || lower.includes('ecom') || lower.includes('brand') || lower.includes('growth') || lower.includes('sales')) {
    return {
      company: 'NovaCart India Retail Pvt. Ltd. — Q3 Performance & Unit Economics Audit',
      roleContext: 'Commercial Finance & Growth Marketing Board Review',
      context:
        'NovaCart India scaled its Q3 digital ad spend by 40% ahead of the festive sale. The Chief Commercial Officer needs a strict unit-economics audit from Exhibit A to decide whether to expand Q4 acquisition budgets or fix retention leakage first.',
      financialTable: [
        { label: 'Total Q3 Digital Ad Spend', value: '₹80,00,000 (₹80L)' },
        { label: 'New Paying Customers Acquired', value: '5,000' },
        { label: 'Average Order Value (AOV)', value: '₹3,200' },
        { label: 'Average Orders / Customer / Year', value: '2.5 orders' },
        { label: 'Gross Contribution Margin %', value: '45.0%' },
        { label: 'Q3 Attributed Cohort Revenue', value: '₹3,20,00,000 (₹3.20 Cr)' },
      ],
      metrics: [
        {
          id: 'cac',
          label: 'Customer Acquisition Cost (CAC)',
          formulaHint: 'Total Digital Ad Spend ÷ New Paying Customers Acquired',
          unit: '₹',
          expected: 1600,
          tolerance: 25,
          explanation: '₹80,00,000 ÷ 5,000 customers = ₹1,600 CAC',
        },
        {
          id: 'ltv',
          label: '1-Year Gross Profit LTV per Customer',
          formulaHint: 'AOV × Annual Orders per Customer × Gross Margin %',
          unit: '₹',
          expected: 3600,
          tolerance: 50,
          explanation: '₹3,200 × 2.5 × 45% = ₹3,600 1-Year Gross Profit LTV',
        },
        {
          id: 'ltv_cac',
          label: 'LTV : CAC Ratio',
          formulaHint: '1-Year Gross Profit LTV ÷ Customer Acquisition Cost (CAC)',
          unit: 'x',
          expected: 2.25,
          tolerance: 0.1,
          explanation: '₹3,600 ÷ ₹1,600 = 2.25x (Healthy scaling benchmark is ≥ 3.0x)',
        },
        {
          id: 'roas',
          label: 'Return on Ad Spend (ROAS)',
          formulaHint: 'Q3 Attributed Cohort Revenue ÷ Total Digital Ad Spend',
          unit: 'x',
          expected: 4.0,
          tolerance: 0.1,
          explanation: '₹3,20,00,000 ÷ ₹80,00,000 = 4.00x blended ROAS',
        },
      ],
      promptQuestion:
        'ROAS looks strong at 4.0x, yet LTV:CAC is below the 3.0x institutional benchmark. Would you expand Q4 ad spend as-is, or rebalance spend toward retention and repeat orders? Explain your commercial trade-off.',
    };
  }

  // Default: Corporate Finance, Accounting, Financial Analysis & Management (INR ₹ Lakhs)
  return {
    company: 'Apex Horizon Consumer Goods Ltd. — FY25 Working Capital & Liquidity Audit',
    roleContext: 'Corporate Finance & Accounting Boardroom Case',
    context:
      'Apex Horizon built up heavy inventory ahead of the festival quarter. Before the statutory board meeting, the CFO asked you to calculate key profitability, liquidity, and leverage ratios from Exhibit A and advise on working-capital risk.',
    financialTable: [
      { label: 'Net Operating Revenue', value: '₹1,200 Lakhs' },
      { label: 'Cost of Goods Sold (COGS)', value: '₹720 Lakhs' },
      { label: 'Operating SG&A Expenses', value: '₹240 Lakhs' },
      { label: 'Cash & Bank Equivalents', value: '₹90 Lakhs' },
      { label: 'Trade Receivables (Debtors)', value: '₹110 Lakhs' },
      { label: 'Closing Merchandise Inventory', value: '₹160 Lakhs' },
      { label: 'Current Liabilities (Creditors + Short-Term Debt)', value: '₹180 Lakhs' },
      { label: 'Total Funded Debt', value: '₹250 Lakhs' },
      { label: 'Total Shareholders’ Equity', value: '₹500 Lakhs' },
    ],
    metrics: [
      {
        id: 'gross_margin',
        label: 'Gross Profit Margin (%)',
        formulaHint: '((Net Revenue − COGS) ÷ Net Revenue) × 100',
        unit: '%',
        expected: 40.0,
        tolerance: 0.5,
        explanation: '(₹1,200L − ₹720L) ÷ ₹1,200L × 100 = 40.0%',
      },
      {
        id: 'current_ratio',
        label: 'Current Ratio',
        formulaHint: '(Cash + Receivables + Inventory) ÷ Current Liabilities',
        unit: 'x',
        expected: 2.0,
        tolerance: 0.05,
        explanation: '(₹90L + ₹110L + ₹160L) ÷ ₹180L = 2.00x',
      },
      {
        id: 'quick_ratio',
        label: 'Quick Ratio (Acid-Test)',
        formulaHint: '(Cash + Trade Receivables) ÷ Current Liabilities',
        unit: 'x',
        expected: 1.11,
        tolerance: 0.05,
        explanation: '(₹90L + ₹110L) ÷ ₹180L = 1.11x',
      },
      {
        id: 'debt_to_equity',
        label: 'Debt-to-Equity Ratio',
        formulaHint: 'Total Funded Debt ÷ Shareholders’ Equity',
        unit: 'x',
        expected: 0.5,
        tolerance: 0.05,
        explanation: '₹250L ÷ ₹500L = 0.50x',
      },
    ],
    promptQuestion:
      'Assess Apex Horizon’s liquidity health. Why is there a sharp gap between Current Ratio and Quick Ratio, what cash-conversion risk does ₹160L inventory create, and what two corrective actions would you recommend to the CFO?',
  };
}

export const Round2CaseStudy: React.FC<Round2CodingProps> = ({
  currentCodingProb,
  onProceed,
  onReviewSolution,
  canProceed,
  codeSubmitted,
  codeRunFailed,
  codeReviewStarted,
  isSendingInterviewMessage,
  lastInterviewerSpeech,
  manualTextInput,
  setManualTextInput,
  onSendMessage,
  runCodeAndTests,
  isRunning,
  setCodeContent,
  codeModifiedRef,
  activeTeacher,
  animState,
  terminalLogs,
  setTerminalLogs,
  onSkipChallenge,
}) => {
  const caseData = useMemo(() => resolveCaseStudyData(currentCodingProb.title), [currentCodingProb.title]);

  const [metricInputs, setMetricInputs] = useState<Record<string, string>>({});
  const [recommendationText, setRecommendationText] = useState('');
  const [verifiedStatus, setVerifiedStatus] = useState<Record<string, boolean | null>>({});
  const [auditSummary, setAuditSummary] = useState<string | null>(null);
  const [hasAuditedOnce, setHasAuditedOnce] = useState(false);
  const [showFormulaHints, setShowFormulaHints] = useState(false);

  useEffect(() => {
    setMetricInputs({});
    setRecommendationText('');
    setVerifiedStatus({});
    setAuditSummary(null);
    setHasAuditedOnce(false);
    setShowFormulaHints(false);
  }, [caseData.company]);

  const handleMetricChange = (id: string, val: string) => {
    setMetricInputs(prev => ({ ...prev, [id]: val }));
    codeModifiedRef.current = true;
  };

  const buildCaseMemo = (passedCount: number) => {
    return [
      `=== B.COM CASE AUDIT MEMO: ${caseData.company.toUpperCase()} ===`,
      `[QUANTITATIVE WORKING — ${passedCount}/${caseData.metrics.length} VERIFIED]`,
      ...caseData.metrics.map(
        m => `* ${m.label}: ${metricInputs[m.id] ? `${metricInputs[m.id]} ${m.unit}` : 'Not entered'}`
      ),
      ``,
      `[EXECUTIVE RECOMMENDATION]`,
      recommendationText.trim() || '(No written recommendation entered)',
    ].join('\n');
  };

  const executeCaseAudit = (allowPartialSubmit: boolean = false) => {
    if (isRunning || isSendingInterviewMessage) return;

    const newLogs: string[] = [];
    newLogs.push(`[AUDIT] Checking quantitative indicators for ${caseData.company}...`);

    let passedCount = 0;
    const newStatus: Record<string, boolean> = {};

    caseData.metrics.forEach(m => {
      const enteredRaw = (metricInputs[m.id] || '').trim().replace(/[^0-9.-]/g, '');
      const enteredNum = parseFloat(enteredRaw);

      if (isNaN(enteredNum)) {
        newStatus[m.id] = false;
        newLogs.push(`❌ ${m.label}: Missing or invalid number.`);
      } else {
        const diff = Math.abs(enteredNum - m.expected);
        const isClose = diff <= m.tolerance;
        newStatus[m.id] = isClose;
        if (isClose) {
          passedCount += 1;
          newLogs.push(`✅ ${m.label}: ${enteredNum}${m.unit} verified (${m.explanation}).`);
        } else {
          newLogs.push(`❌ ${m.label}: Entered ${enteredNum}${m.unit} — re-check using ${m.formulaHint}.`);
        }
      }
    });

    const wordsInThesis = recommendationText.trim().split(/\s+/).filter(Boolean).length;
    const thesisValid = wordsInThesis >= 12;
    if (thesisValid) {
      newLogs.push(`✅ Executive Recommendation: Recorded (${wordsInThesis} words).`);
    } else {
      newLogs.push(`⚠️ Executive Recommendation: Add at least 12 words explaining your commercial decision and risk mitigation.`);
    }

    setVerifiedStatus(newStatus);
    setTerminalLogs(newLogs);
    setHasAuditedOnce(true);

    const memo = buildCaseMemo(passedCount);
    setCodeContent(memo);
    codeModifiedRef.current = true;

    const allPassed = passedCount === caseData.metrics.length && thesisValid;
    if (allPassed) {
      setAuditSummary(`✅ Audit Passed (${passedCount}/${caseData.metrics.length} ratios + recommendation verified). Click "Defend with Evaluator" above or explain your reasoning in chat.`);
      runCodeAndTests();
    } else if (allowPartialSubmit && (passedCount > 0 || wordsInThesis >= 6)) {
      setAuditSummary(`📋 Submitted partial analysis (${passedCount}/${caseData.metrics.length} ratios verified). Click "Defend with Evaluator" to discuss your assumptions with ${activeTeacher.name}.`);
      runCodeAndTests();
    } else {
      setAuditSummary(`⚠️ ${passedCount}/${caseData.metrics.length} ratios verified${!thesisValid ? ' · recommendation needs ≥12 words' : ''}. Fix highlighted fields or submit for panel defense.`);
    }
  };

  const handlePanelKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      executeCaseAudit(false);
    }
  };

  const wordCount = recommendationText.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div
      className="iv-round-layout iv-round2-layout iv-stage-viewport"
      onKeyDown={handlePanelKeyDown}
      style={{ display: 'grid', gridTemplateColumns: '1.42fr 0.58fr', gap: 14, alignItems: 'stretch', height: '100%', minHeight: 0 }}
    >
      {/* Left 70%: Scrollable Financial Case Study Studio + Fixed Submit Footer */}
      <div
        className="iv-panel"
        style={{
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          minHeight: 0,
          overflow: 'hidden',
        }}
      >
        {/* Fixed Header Strip */}
        <div style={{
          padding: '12px 16px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 12,
          flexShrink: 0,
        }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 10.5, fontWeight: 900, color: 'var(--pink)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              ROUND 2 OF 4 — APPLIED BUSINESS CASE STUDY · {caseData.roleContext}
            </div>
            <h2 style={{ fontSize: 15, fontWeight: 900, margin: '2px 0 0', color: 'var(--t1)', lineHeight: 1.3 }}>
              {caseData.company}
            </h2>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0, flexWrap: 'wrap' }}>
            {canProceed ? (
              <button onClick={onProceed} className="iv-btn-primary" style={{ borderRadius: 8, padding: '7px 14px', fontSize: 12 }}>
                Continue to Round 3 ➔
              </button>
            ) : codeSubmitted && (
              <button
                onClick={onReviewSolution}
                disabled={isSendingInterviewMessage || codeReviewStarted}
                className="iv-btn-primary"
                style={{
                  borderRadius: 8,
                  padding: '7px 12px',
                  fontSize: 12,
                  cursor: isSendingInterviewMessage || codeReviewStarted ? 'wait' : 'pointer',
                  opacity: isSendingInterviewMessage || codeReviewStarted ? 0.7 : 1,
                }}
              >
                {isSendingInterviewMessage || codeReviewStarted ? 'Waiting for evaluator…' : '🎙️ Defend with Evaluator'}
              </button>
            )}

            {!canProceed && onSkipChallenge && (
              <button
                type="button"
                data-testid="round2-skip-challenge-btn"
                onClick={onSkipChallenge}
                title="Skip Round 2 Case Study and move directly to Round 3"
                style={{
                  background: 'var(--bg3)',
                  border: '1px solid var(--border)',
                  color: 'var(--t2)',
                  borderRadius: 8,
                  padding: '7px 12px',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                ⏭ Skip Round
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Case Content */}
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <p style={{ fontSize: 12.5, color: 'var(--t2)', margin: 0, lineHeight: 1.5 }}>
            {caseData.context}
          </p>

          {/* Status Banner */}
          <div
            data-testid="round2-progress-banner"
            style={{
              background: canProceed || (codeSubmitted && !codeRunFailed)
                ? 'rgba(34, 197, 94, 0.12)'
                : hasAuditedOnce && !codeSubmitted
                ? 'rgba(245, 158, 11, 0.12)'
                : 'rgba(var(--brand-rgb), 0.08)',
              border: canProceed || (codeSubmitted && !codeRunFailed)
                ? '1px solid rgba(34, 197, 94, 0.4)'
                : hasAuditedOnce && !codeSubmitted
                ? '1px solid rgba(245, 158, 11, 0.4)'
                : '1px solid rgba(var(--brand-rgb), 0.22)',
              borderRadius: 8,
              padding: '8px 12px',
              fontSize: 12,
              fontWeight: 700,
              color: 'var(--t1)',
            }}
          >
            {canProceed
              ? '✅ Case Study Approved — Click "Continue to Round 3 ➔" above to proceed!'
              : auditSummary || '📊 Step 1 of 2: Calculate the 4 financial indicators using Exhibit A, write your executive recommendation, then click "Audit & Submit Analysis".'}
          </div>

          {/* Exhibit A: Financial Data Grid */}
          <div style={{ background: 'var(--bg3)', borderRadius: 10, border: '1px solid var(--border)', padding: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 900, color: 'var(--accent-mid)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
              Financial Ledger &amp; Balance Data (Exhibit A)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(175px, 1fr))', gap: 8 }}>
              {caseData.financialTable.map((item, idx) => (
                <div key={idx} style={{ background: 'var(--bg2)', padding: '7px 10px', borderRadius: 8, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 10.5, color: 'var(--t3)', fontWeight: 600 }}>{item.label}</div>
                  <div style={{ fontSize: 13, color: 'var(--t1)', fontWeight: 800, fontFamily: 'var(--font-mono)', marginTop: 2 }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Part 1: Quantitative Calculations */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, fontWeight: 900, color: 'var(--t2)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Part 1: Quantitative Indicators
              </span>
              <button
                type="button"
                data-testid="case-formula-hints-toggle"
                onClick={() => setShowFormulaHints(v => !v)}
                style={{
                  background: showFormulaHints ? 'rgba(245, 158, 11, 0.16)' : 'var(--bg3)',
                  border: showFormulaHints ? '1px solid rgba(245, 158, 11, 0.45)' : '1px solid var(--border)',
                  color: showFormulaHints ? 'var(--amber-mid)' : 'var(--t2)',
                  borderRadius: 6,
                  padding: '3px 9px',
                  fontSize: 11,
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                {showFormulaHints ? '🙈 Hide Formulas' : '💡 Show Formula Hints'}
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
              {caseData.metrics.map(m => {
                const isVerified = verifiedStatus[m.id];
                return (
                  <div
                    key={m.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4,
                      background: 'var(--bg2)',
                      padding: 10,
                      borderRadius: 10,
                      border: isVerified === true
                        ? '1px solid rgba(34, 197, 94, 0.45)'
                        : isVerified === false
                        ? '1px solid rgba(239, 68, 68, 0.5)'
                        : '1px solid var(--border)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 6 }}>
                      <label htmlFor={`case-metric-${m.id}`} style={{ fontSize: 11.5, fontWeight: 800, color: 'var(--t1)' }}>
                        {m.label}
                      </label>
                      {isVerified === true && <span style={{ fontSize: 10.5, color: 'var(--green-mid)', fontWeight: 800 }}>✅ Verified</span>}
                      {isVerified === false && <span style={{ fontSize: 10.5, color: 'var(--coral-mid)', fontWeight: 800 }}>❌ Recheck</span>}
                    </div>
                    {showFormulaHints && (
                      <div style={{ fontSize: 10.5, color: 'var(--amber-mid)', fontStyle: 'italic' }}>
                        Formula: {m.formulaHint}
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                      <input
                        id={`case-metric-${m.id}`}
                        type="text"
                        inputMode="decimal"
                        placeholder="Enter calculated value…"
                        value={metricInputs[m.id] || ''}
                        onChange={e => handleMetricChange(m.id, e.target.value)}
                        style={{
                          flex: 1,
                          minWidth: 0,
                          padding: '7px 10px',
                          borderRadius: 7,
                          border: '1px solid var(--border)',
                          background: 'var(--bg3)',
                          color: 'var(--t1)',
                          fontSize: 12.5,
                          fontFamily: 'var(--font-mono)',
                        }}
                      />
                      <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--t3)', minWidth: 26 }}>{m.unit}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Part 2: Executive Recommendation */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label htmlFor="case-recommendation-textarea" style={{ fontSize: 11, fontWeight: 900, color: 'var(--t2)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Part 2: Executive Assessment &amp; Recommendation
              </label>
              <span style={{ fontSize: 11, color: wordCount >= 12 ? 'var(--green-mid)' : 'var(--t3)', fontWeight: 700 }}>
                {wordCount} words {wordCount < 12 ? '(min 12)' : '✓'}
              </span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.45 }}>
              {caseData.promptQuestion}
            </div>
            <textarea
              id="case-recommendation-textarea"
              value={recommendationText}
              onChange={e => {
                setRecommendationText(e.target.value);
                codeModifiedRef.current = true;
              }}
              placeholder="Write your boardroom recommendation: 1) Diagnosis from the ratios, 2) Key financial or commercial risk, 3) Concrete action plan..."
              rows={4}
              style={{
                width: '100%',
                padding: 10,
                borderRadius: 8,
                border: '1px solid var(--border)',
                background: 'var(--bg3)',
                color: 'var(--t1)',
                fontSize: 12.5,
                lineHeight: 1.5,
                resize: 'vertical',
                minHeight: 84,
              }}
            />
          </div>
        </div>

        {/* Sticky Always-Visible Submit Bar */}
        <div style={{
          padding: '10px 16px',
          borderTop: '1px solid var(--border)',
          background: 'var(--bg2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 10,
          flexWrap: 'wrap',
          flexShrink: 0,
        }}>
          <span style={{ fontSize: 11, color: 'var(--t3)' }}>
            Tip: Press <strong style={{ color: 'var(--t2)' }}>Ctrl+↵</strong> anytime to audit your numbers
          </span>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {hasAuditedOnce && !codeSubmitted && (
              <button
                type="button"
                data-testid="case-submit-partial-btn"
                onClick={() => executeCaseAudit(true)}
                disabled={isRunning || isSendingInterviewMessage}
                style={{
                  background: 'var(--bg3)',
                  border: '1px solid var(--accent)',
                  color: 'var(--accent-mid)',
                  borderRadius: 8,
                  padding: '7px 12px',
                  fontSize: 12,
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                Submit Working for Defense
              </button>
            )}
            <button
              type="button"
              data-testid="case-audit-submit-btn"
              onClick={() => executeCaseAudit(false)}
              disabled={isRunning || isSendingInterviewMessage}
              className="iv-btn-success"
              style={{ borderRadius: 8, padding: '8px 16px', fontSize: 12.5, fontWeight: 800 }}
            >
              {isRunning ? 'Auditing…' : '📊 Audit & Submit Analysis (Ctrl+↵)'}
            </button>
          </div>
        </div>
      </div>

      {/* Right 30%: Evaluator Viewport, Always-Open Boardroom Q&A, & Audit Log */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, height: '100%', minHeight: 0, overflow: 'hidden' }}>
        <div style={{ height: 155, flexShrink: 0, background: 'var(--bg3)', borderRadius: 14, border: '1px solid var(--border)', overflow: 'hidden', position: 'relative' }}>
          <VRoidInterviewAvatar teacherId={activeTeacher.id} animState={animState} zoom={1.6} />
          <div style={{ position: 'absolute', bottom: 6, left: 6, padding: '3px 8px', borderRadius: 6, background: 'rgba(10, 14, 26, 0.82)', color: '#f8fafc', fontSize: 11, fontWeight: 800 }}>
            {activeTeacher.emoji} {activeTeacher.name}
          </div>
        </div>

        {/* Always-Available Corporate Evaluator Q&A (Just like a real B.Com case interview) */}
        <div className="iv-panel" style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minHeight: 0, overflow: 'hidden' }} aria-live="polite">
          <div style={{ fontSize: 11, fontWeight: 900, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.04em', flexShrink: 0 }}>
            Corporate Panel Evaluator
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--t1)', lineHeight: 1.5, flex: 1, overflowY: 'auto' }}>
            {lastInterviewerSpeech}
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              const answer = manualTextInput.trim();
              if (!answer || isSendingInterviewMessage) return;
              setManualTextInput('');
              onSendMessage(answer);
            }}
            style={{ display: 'flex', gap: 6, flexShrink: 0 }}
          >
            <input
              value={manualTextInput}
              onChange={(event) => setManualTextInput(event.target.value)}
              disabled={isSendingInterviewMessage}
              aria-label="Ask clarifying question or defend your case analysis"
              placeholder={codeSubmitted ? 'Defend your financial reasoning…' : 'Ask a clarifying question or explain your working…'}
              style={{
                flex: 1,
                minWidth: 0,
                padding: '8px 10px',
                borderRadius: 7,
                border: '1px solid var(--border)',
                background: 'var(--bg3)',
                color: 'var(--t1)',
                fontSize: 12,
              }}
            />
            <button
              type="submit"
              disabled={!manualTextInput.trim() || isSendingInterviewMessage}
              style={{
                padding: '8px 12px',
                borderRadius: 7,
                border: 0,
                background: 'var(--accent)',
                color: '#ffffff',
                fontSize: 11.5,
                fontWeight: 800,
                cursor: isSendingInterviewMessage ? 'wait' : 'pointer',
              }}
            >
              {isSendingInterviewMessage ? '…' : 'Send'}
            </button>
          </form>
        </div>

        {/* Audit Verification Log */}
        <div className="iv-panel" style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0, height: 150, overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, fontWeight: 900, color: 'var(--t2)', textTransform: 'uppercase' }}>Financial Audit Log</span>
            <button
              onClick={() => setTerminalLogs([])}
              type="button"
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 4,
                padding: '2px 6px',
                fontSize: 10.5,
                color: 'var(--t3)',
                cursor: 'pointer',
              }}
            >
              Clear
            </button>
          </div>
          <div style={{ flex: 1, fontFamily: 'var(--font-mono)', fontSize: 11.5, overflowY: 'auto', lineHeight: 1.45 }}>
            {terminalLogs.length > 0 ? (
              terminalLogs.map((l, idx) => (
                <div
                  key={idx}
                  style={{
                    marginBottom: 3,
                    color: l.startsWith('❌') ? 'var(--coral-mid)' : l.startsWith('⚠️') ? 'var(--amber-mid)' : 'var(--green-mid)',
                  }}
                >
                  {l}
                </div>
              ))
            ) : (
              <div style={{ color: 'var(--t3)', fontStyle: 'italic' }}>
                Calculate your ratios and click &apos;Audit &amp; Submit Analysis&apos; to validate…
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Round2CaseStudy;
