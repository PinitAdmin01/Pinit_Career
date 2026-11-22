'use client';

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import type { Round2CodingProps } from './Round2Coding';
import { DefenseProgressStrip } from './DefenseProgressStrip';

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

export interface CaseMemoItem {
  from: string;
  role: string;
  subject: string;
  body: string;
}

export interface CaseRedFlagOption {
  id: string;
  label: string;
  journalOrControl: string;
  isCorrect: boolean;
  explanation: string;
}

export interface CaseData {
  company: string;
  roleContext: string;
  jurisdictionTag: string;
  context: string;
  financialTable: Array<{ label: string; value: string; note?: string }>;
  memos: CaseMemoItem[];
  redFlagPrompt: string;
  redFlagOptions: CaseRedFlagOption[];
  verdictOptions: Array<{ id: string; label: string; tone: 'positive' | 'caution' | 'negative' }>;
  metrics: CaseMetric[];
  promptQuestion: string;
}

/**
 * Resolves realistic Indian & Global B.Com / Big-4 / Corporate Finance / Banking
 * interview cases calibrated to the candidate's selected commerce track — zero answer leaks.
 */
export function resolveCaseStudyData(topic: string): CaseData {
  const lower = (topic || '').toLowerCase();

  if (lower.includes('bank') || lower.includes('credit') || lower.includes('loan') || lower.includes('treasury')) {
    return {
      company: 'Pinnacle Commercial Logistics Ltd. — ₹5.0 Cr Term Loan Credit Committee',
      roleContext: 'Corporate Banking & Credit Appraisal Desk',
      jurisdictionTag: 'RBI Prudential Norms · Basel III · Mumbai / Global Credit',
      context:
        'Pinnacle Logistics applied for a 5-year ₹5.00 Cr capex term loan to expand its cold-chain fleet. As a Credit Analyst presenting to the Credit Committee, inspect Exhibit A & Exhibit B, flag the key credit-underwriting risk, compute the 4 repayment & solvency ratios, and record your sanction verdict.',
      financialTable: [
        { label: 'Annual Operating Revenue', value: '₹12.50 Cr', note: 'FY25 Audited' },
        { label: 'EBITDA', value: '₹2.50 Cr', note: '20.0% Operating Margin' },
        { label: 'Annual Total Debt Service (P + I)', value: '₹1.25 Cr', note: 'Existing + Proposed EMI' },
        { label: 'Total Outstanding Funded Debt', value: '₹5.00 Cr', note: 'Post-Sanction Exposure' },
        { label: 'Tangible Net Worth (Equity)', value: '₹4.00 Cr', note: 'Excl. Revaluation Reserve' },
        { label: 'Current Assets / Current Liabilities', value: '₹3.60 Cr / ₹2.00 Cr', note: 'CMA Data FY25' },
      ],
      memos: [
        {
          from: 'Suresh Menon',
          role: 'Relationship Manager (Corporate Banking)',
          subject: 'Urgent: Borrower requesting zero-covenant fast-track sanction',
          body: 'Pinnacle’s promoter wants disbursement by Friday and asked to waive the Debt Service Reserve Account (DSRA) and end-use monitoring certificate. Note that 42% of their revenue comes from one single frozen-food anchor buyer whose payment cycle recently stretched from 45 to 85 days.',
        },
        {
          from: 'Risk & Compliance Desk',
          role: 'RBI / Basel III Credit Policy',
          subject: 'Collateral & Receivable Concentration Check',
          body: 'Under bank credit policy, single-buyer concentration above 35% requires a ring-fenced escrow/DSRA mechanism and strict end-use verification for capex term loans to prevent working-capital diversion.',
        },
      ],
      redFlagPrompt: 'Spot the primary credit underwriting risk in Exhibit B & select the required banking control:',
      redFlagOptions: [
        {
          id: 'concentration_covenant',
          label: 'Single-buyer concentration (42%) + promoter resisting end-use & DSRA controls',
          journalOrControl: 'Control: Mandate 3-month DSRA escrow, CA end-use certificate, and minimum DSCR ≥ 1.50x covenant',
          isCorrect: true,
          explanation: 'Customer concentration + waiver of end-use monitoring is a classic Indian & global corporate credit red flag.',
        },
        {
          id: 'waive_all',
          label: 'EBITDA is ₹2.50 Cr so waive all covenants to win the mandate quickly',
          journalOrControl: 'Control: Approve unsecured loan without escrow or DSRA',
          isCorrect: false,
          explanation: 'Strong headline DSCR never justifies waiving end-use monitoring or concentration covenants.',
        },
        {
          id: 'ignore_receivables',
          label: 'Ignore the 85-day buyer stretch because revenue grew YoY',
          journalOrControl: 'Control: Focus only on Top-Line Revenue growth',
          isCorrect: false,
          explanation: 'Stretched receivables from a 42% anchor buyer directly threaten cash debt-servicing capacity.',
        },
      ],
      verdictOptions: [
        { id: 'sanction_covenants', label: '✅ Sanction with Covenants (DSRA + End-Use)', tone: 'positive' },
        { id: 'defer_review', label: '⚠️ Defer Pending Anchor-Buyer Audit', tone: 'caution' },
        { id: 'decline_facility', label: '⛔ Decline Facility', tone: 'negative' },
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
        'Present your Credit Committee note: defend your sanction verdict, explain how DSCR (2.0x) balances against the 42% buyer concentration risk, and specify one financial covenant you will enforce.',
    };
  }

  if (lower.includes('tax') || lower.includes('gst') || lower.includes('audit') || lower.includes('statutory')) {
    return {
      company: 'Meridian Precision Manufacturing Ltd. — FY25 Big-4 Statutory & GST Audit',
      roleContext: 'Big-4 Assurance & Indirect Tax Desk',
      jurisdictionTag: 'Ind AS / IFRS · CGST Sec 17(5) · Big-4 Audit Practice',
      context:
        'During the FY25 statutory & GST audit of Meridian Manufacturing (Pune), review Exhibit A and the junior auditor’s voucher findings in Exhibit B. Identify the blocked Input Tax Credit (ITC) error, pass the rectification journal entry, verify the 4 profitability/tax metrics, and state your audit opinion.',
      financialTable: [
        { label: 'Net Revenue from Operations', value: '₹250.0 Lakhs', note: 'FY25 Trial Balance' },
        { label: 'Cost of Goods Sold (COGS)', value: '₹160.0 Lakhs', note: 'Raw Material + Direct Mfg' },
        { label: 'Operating Expenses (SG&A)', value: '₹45.0 Lakhs', note: 'Incl. Admin & Selling' },
        { label: 'Output GST Liability (18%)', value: '₹45.0 Lakhs', note: 'GSTR-1 Reconciled' },
        { label: 'Eligible Input Tax Credit (ITC)', value: '₹36.0 Lakhs', note: 'Verified GSTR-2B Match' },
        { label: 'Closing Trade Receivables', value: '₹37.5 Lakhs', note: 'Aging Check Pending' },
      ],
      memos: [
        {
          from: 'Ananya Deshmukh (Audit Associate)',
          role: 'Big-4 Field Audit Team',
          subject: 'Voucher Finding #14: ITC claimed on MD’s luxury passenger car + club fees',
          body: 'While vouching March expenses, we noticed the client’s accountant claimed ₹4.20 Lakhs of GST Input Tax Credit on a 5-seater executive sedan purchased for the Managing Director and club membership bills. The CFO says "everybody claims it, leave it alone so our tax cash outflow stays low."',
        },
        {
          from: 'Indirect Tax Partner Note',
          role: 'CGST Act Sec 17(5) & SA 240',
          subject: 'Blocked Credits & Audit Independence',
          body: 'Motor vehicles for passenger transport (seating ≤ 13) and club memberships are strictly blocked credits under Section 17(5) of the CGST Act, 2017. Unreversed blocked ITC triggers 18%–24% interest and penalty under Sec 73/74.',
        },
      ],
      redFlagPrompt: 'Identify the statutory violation in Exhibit B & pass the correct Rectification Journal Entry:',
      redFlagOptions: [
        {
          id: 'reverse_blocked_itc',
          label: 'Blocked ITC wrongly claimed under Sec 17(5) CGST (Executive Sedan & Club Fees)',
          journalOrControl: 'Dr. Fixed Asset / Admin Expense A/c ₹4.20L  |  Cr. Input GST (ITC Reversal) A/c ₹4.20L',
          isCorrect: true,
          explanation: 'Sec 17(5) CGST explicitly blocks ITC on passenger vehicles (≤ 13 seats) & club memberships; it must be reversed and capitalized/expensed.',
        },
        {
          id: 'keep_itc',
          label: 'Allow the ₹4.20L ITC claim since the invoice has a valid GSTIN',
          journalOrControl: 'No adjustment entry required — valid tax invoice is sufficient',
          isCorrect: false,
          explanation: 'A valid GSTIN invoice does NOT override statutory Sec 17(5) blocked credit prohibitions.',
        },
        {
          id: 'debit_sales',
          label: 'Reduce Net Revenue by ₹4.20L to offset the GST discrepancy',
          journalOrControl: 'Dr. Sales Revenue A/c ₹4.20L  |  Cr. Debtors A/c ₹4.20L',
          isCorrect: false,
          explanation: 'Reversing blocked input tax has nothing to do with customer sales revenue or debtors.',
        },
      ],
      verdictOptions: [
        { id: 'unqualified_post_adj', label: '✅ Unqualified Opinion (Only After ITC Reversal)', tone: 'positive' },
        { id: 'qualified_opinion', label: '⚠️ Qualified Audit Opinion (If CFO Refuses)', tone: 'caution' },
        { id: 'adverse_opinion', label: '⛔ Adverse Audit Opinion', tone: 'negative' },
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
        'Draft your audit sign-off note for the Engagement Partner: explain how you handle the CFO’s pushback on Sec 17(5) ITC, plus two GSTR-2B and debtor-aging controls before signing.',
    };
  }

  if (lower.includes('market') || lower.includes('dmkt') || lower.includes('ecom') || lower.includes('brand') || lower.includes('growth') || lower.includes('sales')) {
    return {
      company: 'NovaCart India Retail Pvt. Ltd. — Q3 Commercial Finance & Growth Board Review',
      roleContext: 'Commercial Finance & E-Commerce Unit Economics Desk',
      jurisdictionTag: 'India D2C + Global Retail Benchmarks · Board P&L Review',
      context:
        'NovaCart scaled Q3 festive ad spend by 40%. Before approving Q4 budgets, inspect Exhibit A and the Finance Controller’s memo in Exhibit B, spot the hidden margin distortion, compute the 4 unit-economics metrics, and recommend your Q4 capital allocation verdict.',
      financialTable: [
        { label: 'Total Q3 Digital Ad Spend', value: '₹80,00,000 (₹80L)', note: 'Meta + Google Performance' },
        { label: 'New Paying Customers Acquired', value: '5,000', note: 'First-Time Buyers' },
        { label: 'Average Order Value (AOV)', value: '₹3,200', note: 'Net of GST' },
        { label: 'Average Orders / Customer / Year', value: '2.5 orders', note: 'Trailing 12-Month Cohort' },
        { label: 'Gross Contribution Margin %', value: '45.0%', note: 'After COGS & Packaging' },
        { label: 'Q3 Attributed Cohort Revenue', value: '₹3,20,00,000 (₹3.20 Cr)', note: 'Gross Attributed GMV' },
      ],
      memos: [
        {
          from: 'Ritu Kapoor (Commercial Controller)',
          role: 'FP&A & Revenue Operations',
          subject: 'Alert: Cash-on-Delivery (COD) Return-to-Origin (RTO) excluded from Ad ROAS',
          body: 'The marketing agency’s deck celebrates 4.0x ROAS, but 22% of COD orders were returned undelivered (RTO), incurring ₹180 two-way shipping cost per failed order and shrinking true repeat orders. Expanding paid spend blindly will burn working capital.',
        },
        {
          from: 'Chief Commercial Officer',
          role: 'Board Mandate',
          subject: 'Institutional Unit Economics Guardrail',
          body: 'Our investors require LTV:CAC ≥ 3.0x before releasing incremental Q4 acquisition capital. Decide whether to scale paid ads as-is or shift budget into prepaid incentives & CRM retention.',
        },
      ],
      redFlagPrompt: 'Spot the hidden P&L distortion in Exhibit B & select the correct commercial control:',
      redFlagOptions: [
        {
          id: 'adjust_rto_and_retention',
          label: 'Headline 4.0x ROAS ignores 22% COD RTO return leakage & LTV:CAC is only 2.25x (< 3.0x hurdle)',
          journalOrControl: 'Control: Deduct RTO logistics from contribution margin; shift 25% Q4 spend into prepaid nudges & CRM retention',
          isCorrect: true,
          explanation: 'Gross ROAS masks return-to-origin (RTO) logistics bleed and sub-3.0x LTV:CAC unit economics.',
        },
        {
          id: 'double_ad_spend',
          label: '4.0x ROAS proves strong profitability — double Q4 Meta/Google ad budgets immediately',
          journalOrControl: 'Control: Scale paid acquisition by 2x without modifying COD or retention',
          isCorrect: false,
          explanation: 'Scaling when LTV:CAC is 2.25x and COD RTO is 22% accelerates cash burn.',
        },
        {
          id: 'cut_product_price',
          label: 'Slash AOV by 30% across the catalog to chase higher order counts',
          journalOrControl: 'Control: Deep discounting to lift headline volume',
          isCorrect: false,
          explanation: 'Slashing AOV destroys gross contribution margin and worsens LTV:CAC further.',
        },
      ],
      verdictOptions: [
        { id: 'rebalance_retention', label: '⚠️ Hold Paid Spend · Rebalance to Retention & Prepaid', tone: 'caution' },
        { id: 'expand_paid', label: '✅ Expand Q4 Paid Ad Spend Aggressively', tone: 'positive' },
        { id: 'pause_all_ads', label: '⛔ Freeze All Acquisition Channels', tone: 'negative' },
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
        'ROAS is 4.0x yet LTV:CAC sits at 2.25x with 22% COD RTO leakage. Defend your Q4 budget recommendation to the CCO and explain how you will raise LTV:CAC above 3.0x.',
    };
  }

  // Default: Corporate Finance, Accounting, Financial Analysis & Management (India Ind AS + Global IFRS)
  return {
    company: 'Apex Horizon Consumer Goods Ltd. — FY25 CFO Working Capital & Ind AS / IFRS Review',
    roleContext: 'Corporate Accounting & CFO Advisory Desk',
    jurisdictionTag: 'Ind AS 115 / IFRS 15 · Balance Sheet & Liquidity Audit',
    context:
      'Before Apex Horizon’s statutory board meeting, review Exhibit A (Financial Statements) and Exhibit B (Controller’s Year-End Cutoff Memo). Spot the revenue-recognition error, pass the correct rectification journal entry, compute the 4 liquidity/solvency ratios, and present your CFO recommendation.',
    financialTable: [
      { label: 'Net Operating Revenue', value: '₹1,200 Lakhs', note: 'FY25 Draft P&L' },
      { label: 'Cost of Goods Sold (COGS)', value: '₹720 Lakhs', note: 'Direct Inventory Cost' },
      { label: 'Operating SG&A Expenses', value: '₹240 Lakhs', note: 'Admin & Distribution' },
      { label: 'Cash & Bank Equivalents', value: '₹90 Lakhs', note: 'Unencumbered Balances' },
      { label: 'Trade Receivables (Debtors)', value: '₹110 Lakhs', note: 'Net of ECL Provision' },
      { label: 'Closing Merchandise Inventory', value: '₹160 Lakhs', note: '44% of Current Assets' },
      { label: 'Current Liabilities (Creditors + ST Debt)', value: '₹180 Lakhs', note: 'Due < 12 Months' },
      { label: 'Total Funded Debt', value: '₹250 Lakhs', note: 'Long-Term + Working Cap' },
      { label: 'Total Shareholders’ Equity', value: '₹500 Lakhs', note: 'Share Capital + Reserves' },
    ],
    memos: [
      {
        from: 'Vikramaditya Joshi (Plant Controller)',
        role: 'Year-End Cutoff Review (March 31)',
        subject: 'Cut-off Query: ₹35L distributor invoice booked before goods left warehouse',
        body: 'To hit Q4 sales targets, the regional sales team raised a ₹35.0 Lakhs invoice on March 31 and recorded it as FY25 Revenue. However, the goods were still sitting in our Bhiwandi warehouse awaiting quality clearance and were only dispatched on April 4.',
      },
      {
        from: 'IFRS / Ind AS Technical Desk',
        role: 'Ind AS 115 & IFRS 15 Revenue Cutoff',
        subject: 'Transfer of Control Principle',
        body: 'Under Ind AS 115 / IFRS 15, revenue is recognized ONLY when control transfers to the customer (dispatch/delivery per Incoterms), not when an invoice is raised early. Premature booking overstates FY25 Profit and Debtors.',
      },
    ],
    redFlagPrompt: 'Spot the Ind AS 115 / IFRS 15 cutoff error in Exhibit B & pass the Rectification Journal Entry:',
    redFlagOptions: [
      {
        id: 'defer_cutoff_revenue',
        label: 'Premature revenue recognition (₹35L booked March 31 before transfer of control on April 4)',
        journalOrControl: 'Dr. Revenue from Operations A/c ₹35L  |  Cr. Trade Receivables / Contract Liability A/c ₹35L',
        isCorrect: true,
        explanation: 'Under Ind AS 115 / IFRS 15, control had not transferred on March 31, so the ₹35L sale must be reversed out of FY25 revenue.',
      },
      {
        id: 'keep_march_revenue',
        label: 'Keep ₹35L in FY25 Revenue because the customer issued a purchase order in March',
        journalOrControl: 'No rectification required — PO date determines revenue recognition',
        isCorrect: false,
        explanation: 'A purchase order or invoice never satisfies the performance obligation under Ind AS 115 / IFRS 15.',
      },
      {
        id: 'capitalize_inventory',
        label: 'Reclassify the ₹160L closing inventory into Non-Current Fixed Assets to boost Quick Ratio',
        journalOrControl: 'Dr. Property, Plant & Equipment A/c ₹160L  |  Cr. Inventory A/c ₹160L',
        isCorrect: false,
        explanation: 'Reclassifying merchandise inventory as PPE violates Ind AS 2 / IAS 2 and constitutes financial window-dressing.',
      },
    ],
    verdictOptions: [
      { id: 'rectify_and_destock', label: '⚠️ Rectify ₹35L Cutoff + Launch Inventory Liquidation Plan', tone: 'caution' },
      { id: 'approve_as_drafted', label: '✅ Approve FY25 Draft Financials As-Is', tone: 'positive' },
      { id: 'raise_emergency_debt', label: '⛔ Raise Emergency High-Cost Debt Immediately', tone: 'negative' },
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
      'Brief the CFO: explain the sharp gap between Current Ratio (2.00x) and Quick Ratio (1.11x), justify reversing the ₹35L cutoff entry under Ind AS 115 / IFRS 15, and propose two working-capital actions.',
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
  defenseState,
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

  const [activeFolderTab, setActiveFolderTab] = useState<'workbench' | 'exhibit_a' | 'exhibit_b'>('workbench');
  const [selectedRedFlagId, setSelectedRedFlagId] = useState<string>('');
  const [selectedVerdictId, setSelectedVerdictId] = useState<string>('');
  const [metricInputs, setMetricInputs] = useState<Record<string, string>>({});
  const [recommendationText, setRecommendationText] = useState('');
  const [verifiedStatus, setVerifiedStatus] = useState<Record<string, boolean | null>>({});
  const [redFlagVerified, setRedFlagVerified] = useState<boolean | null>(null);
  const [auditSummary, setAuditSummary] = useState<string | null>(null);
  const [hasAuditedOnce, setHasAuditedOnce] = useState(false);
  const [showFormulaHints, setShowFormulaHints] = useState(false);

  useEffect(() => {
    setActiveFolderTab('workbench');
    setSelectedRedFlagId('');
    setSelectedVerdictId('');
    setMetricInputs({});
    setRecommendationText('');
    setVerifiedStatus({});
    setRedFlagVerified(null);
    setAuditSummary(null);
    setHasAuditedOnce(false);
    setShowFormulaHints(false);
  }, [caseData.company]);

  const handleMetricChange = (id: string, val: string) => {
    setMetricInputs(prev => ({ ...prev, [id]: val }));
    codeModifiedRef.current = true;
  };

  const buildCaseMemo = (passedCount: number, redFlagOk: boolean) => {
    const pickedFlag = caseData.redFlagOptions.find(o => o.id === selectedRedFlagId);
    const pickedVerdict = caseData.verdictOptions.find(v => v.id === selectedVerdictId);
    return [
      `=== B.COM CORPORATE CASE DESK: ${caseData.company.toUpperCase()} ===`,
      `[JURISDICTION]: ${caseData.jurisdictionTag}`,
      `[RED FLAG & RECTIFICATION JOURNAL/CONTROL — ${redFlagOk ? 'VERIFIED' : 'NEEDS REVIEW'}]`,
      pickedFlag ? `* Flag: ${pickedFlag.label}\n* Entry/Control: ${pickedFlag.journalOrControl}` : '* Not selected',
      ``,
      `[QUANTITATIVE RATIOS — ${passedCount}/${caseData.metrics.length} VERIFIED]`,
      ...caseData.metrics.map(
        m => `* ${m.label}: ${metricInputs[m.id] ? `${metricInputs[m.id]} ${m.unit}` : 'Not entered'}`
      ),
      ``,
      `[FORMAL PANEL VERDICT]: ${pickedVerdict?.label || 'Not selected'}`,
      `[EXECUTIVE BOARDROOM RATIONALE]`,
      recommendationText.trim() || '(No written rationale entered)',
    ].join('\n');
  };

  const executeCaseAudit = (allowPartialSubmit: boolean = false) => {
    if (isRunning || isSendingInterviewMessage || defenseState?.status === 'in_progress' || defenseState?.status === 'eliminated') return;

    const newLogs: string[] = [];
    newLogs.push(`[AUDIT] Reviewing Corporate Case Desk: ${caseData.company}`);

    // 1. Check Red Flag & Rectification Entry
    const chosenFlag = caseData.redFlagOptions.find(o => o.id === selectedRedFlagId);
    const redFlagOk = Boolean(chosenFlag?.isCorrect);
    setRedFlagVerified(redFlagOk);
    if (!chosenFlag) {
      newLogs.push('❌ Accounting/Compliance Red Flag: Not selected yet (inspect Exhibit B memo).');
    } else if (redFlagOk) {
      newLogs.push(`✅ Red Flag & Journal/Control Verified: ${chosenFlag.explanation}`);
    } else {
      newLogs.push(`❌ Red Flag / Entry Issue: ${chosenFlag.explanation}`);
    }

    // 2. Check Quantitative Indicators
    let passedCount = 0;
    const newStatus: Record<string, boolean> = {};
    caseData.metrics.forEach(m => {
      const enteredRaw = (metricInputs[m.id] || '').trim().replace(/[^0-9.-]/g, '');
      const enteredNum = parseFloat(enteredRaw);
      if (isNaN(enteredNum)) {
        newStatus[m.id] = false;
        newLogs.push(`❌ ${m.label}: Missing or invalid number.`);
      } else {
        const isClose = Math.abs(enteredNum - m.expected) <= m.tolerance;
        newStatus[m.id] = isClose;
        if (isClose) {
          passedCount += 1;
          newLogs.push(`✅ ${m.label}: ${enteredNum}${m.unit} verified (${m.explanation}).`);
        } else {
          newLogs.push(`❌ ${m.label}: Entered ${enteredNum}${m.unit} — recheck using ${m.formulaHint}.`);
        }
      }
    });

    // 3. Check Board Verdict & Written Rationale
    const verdictChosen = Boolean(selectedVerdictId);
    const wordsInThesis = recommendationText.trim().split(/\s+/).filter(Boolean).length;
    const thesisValid = wordsInThesis >= 12;
    if (verdictChosen) {
      newLogs.push(`✅ Formal Verdict Selected: ${caseData.verdictOptions.find(v => v.id === selectedVerdictId)?.label}`);
    } else {
      newLogs.push('❌ Formal Panel Verdict: Choose your board decision pill.');
    }
    if (thesisValid) {
      newLogs.push(`✅ Boardroom Rationale: Recorded (${wordsInThesis} words).`);
    } else {
      newLogs.push(`⚠️ Boardroom Rationale: Write at least 12 words defending your recommendation (currently ${wordsInThesis}).`);
    }

    setVerifiedStatus(newStatus);
    setHasAuditedOnce(true);

    const memo = buildCaseMemo(passedCount, redFlagOk);
    setCodeContent(memo);
    codeModifiedRef.current = true;

    const fullPass = redFlagOk && passedCount === caseData.metrics.length && verdictChosen && thesisValid;
    const partialEligible = allowPartialSubmit && (passedCount >= 1 || redFlagOk || wordsInThesis >= 6);

    if (fullPass || partialEligible) {
      newLogs.push(
        fullPass
          ? '\n✅ [CASE DESK AUDITED] Starting 5-Question Panel Cross-Examination on the right!'
          : `\n⚠️ [WORKING SUBMITTED] (${passedCount}/${caseData.metrics.length} ratios, red flag ${redFlagOk ? 'verified' : 'flagged'}). Starting 5-Question Panel Cross-Examination!`
      );
      setTerminalLogs(newLogs);
      setAuditSummary(
        fullPass
          ? `✅ Case Desk Verified (${passedCount}/${caseData.metrics.length} ratios + journal entry) — Clear 3 of 5 panel questions on the right to advance!`
          : `⚠️ Working submitted (${passedCount}/${caseData.metrics.length} ratios) — Clear 3 of 5 panel questions on the right to advance!`
      );
      runCodeAndTests();
    } else {
      newLogs.push('\n⚠️ Review the red items above, or click "Submit Working for 5-Q Defense" to defend as-is.');
      setTerminalLogs(newLogs);
      setAuditSummary(
        `⚠️ ${passedCount}/${caseData.metrics.length} ratios verified · Red flag ${redFlagOk ? '✓' : '✗'} · Verdict ${verdictChosen ? '✓' : '✗'}. Fix highlighted items or submit working for defense.`
      );
    }
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const target = e.target as HTMLElement | null;
        if (target?.closest('[data-testid="case-defense-chat"]')) return;
        e.preventDefault();
        executeCaseAudit(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  const wordCount = recommendationText.trim().split(/\s+/).filter(Boolean).length;
  const defenseActive = defenseState?.status === 'in_progress';
  const defenseEliminated = defenseState?.status === 'eliminated';

  return (
    <div
      className="iv-round-layout iv-round2-layout iv-stage-viewport"
      style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.48fr) minmax(290px, 0.72fr)', gap: 12, alignItems: 'stretch' }}
    >
      {/* ── LEFT: Real-Life Indian & Global B.Com Corporate Case Desk ── */}
      <div
        className="iv-panel"
        style={{
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          minHeight: 0,
          overflow: 'hidden',
          borderRadius: 14,
        }}
      >
        {/* Top Header */}
        <div style={{
          padding: '12px 16px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 10,
          flexShrink: 0,
        }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 10.5, fontWeight: 900, color: 'var(--pink)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                ROUND 2 OF 4 — APPLIED BUSINESS CASE STUDY · {caseData.roleContext}
              </span>
              <span style={{
                fontSize: 10,
                fontWeight: 800,
                padding: '2px 7px',
                borderRadius: 999,
                background: 'rgba(var(--brand-rgb), 0.14)',
                border: '1px solid rgba(var(--brand-rgb), 0.3)',
                color: 'var(--accent-mid)',
              }}>
                {caseData.jurisdictionTag}
              </span>
            </div>
            <h2 style={{ fontSize: 15, fontWeight: 900, margin: '4px 0 0', color: 'var(--t1)', lineHeight: 1.3 }}>
              {caseData.company}
            </h2>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0, flexWrap: 'wrap' }}>
            {canProceed ? (
              <button onClick={onProceed} className="iv-btn-primary" style={{ borderRadius: 8, padding: '7px 14px', fontSize: 12 }}>
                Continue to Round 3 ➔
              </button>
            ) : codeSubmitted && !defenseActive && !defenseEliminated && (
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
                {isSendingInterviewMessage || codeReviewStarted ? 'Starting 5-Q Defense…' : '🎙️ Start 5-Q Panel Defense'}
              </button>
            )}

            {!canProceed && !defenseEliminated && onSkipChallenge && (
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

        {/* Case Folder Navigation Tabs */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          padding: '8px 16px',
          background: 'var(--bg3)',
          borderBottom: '1px solid var(--border)',
          flexShrink: 0,
          flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {([
              { id: 'workbench', label: '⚖️ Case Workbench (Solve & Submit)' },
              { id: 'exhibit_a', label: '📄 Exhibit A: Financial Statements' },
              { id: 'exhibit_b', label: `🧾 Exhibit B: Audit / Client Memos (${caseData.memos.length})` },
            ] as const).map(tab => {
              const active = activeFolderTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  data-testid={`bcom-tab-${tab.id}`}
                  onClick={() => setActiveFolderTab(tab.id)}
                  style={{
                    padding: '5px 11px',
                    borderRadius: 7,
                    fontSize: 11.5,
                    fontWeight: 800,
                    cursor: 'pointer',
                    background: active ? 'var(--accent)' : 'var(--bg2)',
                    color: active ? '#ffffff' : 'var(--t2)',
                    border: active ? '1px solid var(--accent)' : '1px solid var(--border)',
                    transition: 'all 0.14s ease',
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
          <span style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 700 }}>
            Real-World Big-4 &amp; Corporate Desk
          </span>
        </div>

        {/* Scrollable Case Folder Content */}
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <p style={{ fontSize: 12.5, color: 'var(--t2)', margin: 0, lineHeight: 1.5 }}>
            {caseData.context}
          </p>

          {/* Status Banner */}
          <div
            data-testid="round2-progress-banner"
            style={{
              background: defenseEliminated
                ? 'rgba(239, 68, 68, 0.12)'
                : canProceed || (codeSubmitted && !codeRunFailed)
                ? 'rgba(34, 197, 94, 0.12)'
                : hasAuditedOnce && !codeSubmitted
                ? 'rgba(245, 158, 11, 0.12)'
                : 'rgba(var(--brand-rgb), 0.08)',
              border: defenseEliminated
                ? '1px solid rgba(239, 68, 68, 0.45)'
                : canProceed || (codeSubmitted && !codeRunFailed)
                ? '1px solid rgba(34, 197, 94, 0.4)'
                : hasAuditedOnce && !codeSubmitted
                ? '1px solid rgba(245, 158, 11, 0.4)'
                : '1px solid rgba(var(--brand-rgb), 0.22)',
              borderRadius: 8,
              padding: '8px 12px',
              fontSize: 12,
              fontWeight: 700,
              color: defenseEliminated ? 'var(--coral-mid)' : 'var(--t1)',
            }}
          >
            {defenseEliminated
              ? `⛔ Panel Defense Concluded (${defenseState?.passedCount}/${defenseState?.totalQuestions} cleared) — Did not qualify for Round 3. Generating final scorecard…`
              : canProceed
              ? `✅ Case Desk & Panel Defense Cleared (${defenseState?.passedCount ?? 3}/${defenseState?.requiredToPass ?? 3}) — Click "Continue to Round 3 ➔" to proceed!`
              : defenseActive
              ? `🎯 Step 2 of 2: Answer Question ${defenseState?.currentQuestionNumber} of ${defenseState?.totalQuestions} in the Corporate Panel chat on the right. Clear ${defenseState?.requiredToPass || 3} of 5 correctly to advance!`
              : auditSummary || '📊 Step 1 of 2: Inspect Exhibit A & Exhibit B, pass the red-flag/journal entry, compute the 4 ratios, select your verdict, and submit (clear 3 of 5 panel questions to advance).'}
          </div>

          {/* Exhibit A: Financial Statements (shown on Exhibit A tab + compact reference on Workbench so SSR & candidates always see figures) */}
          {(activeFolderTab === 'exhibit_a' || activeFolderTab === 'workbench') && (
            <div style={{ background: 'var(--bg3)', borderRadius: 10, border: '1px solid var(--border)', padding: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 900, color: 'var(--accent-mid)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Financial Ledger &amp; Balance Data (Exhibit A)
                </div>
                {activeFolderTab === 'workbench' && (
                  <button
                    type="button"
                    onClick={() => setActiveFolderTab('exhibit_b')}
                    style={{
                      background: 'rgba(245, 158, 11, 0.14)',
                      border: '1px solid rgba(245, 158, 11, 0.4)',
                      color: 'var(--amber-mid)',
                      borderRadius: 6,
                      padding: '2px 8px',
                      fontSize: 10.5,
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    🧾 Read Exhibit B Client Memo →
                  </button>
                )}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(175px, 1fr))', gap: 8 }}>
                {caseData.financialTable.map((item, idx) => (
                  <div key={idx} style={{ background: 'var(--bg2)', padding: '7px 10px', borderRadius: 8, border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 10.5, color: 'var(--t3)', fontWeight: 600 }}>{item.label}</div>
                    <div style={{ fontSize: 13, color: 'var(--t1)', fontWeight: 800, fontFamily: 'var(--font-mono)', marginTop: 2 }}>{item.value}</div>
                    {item.note && <div style={{ fontSize: 10, color: 'var(--t3)', marginTop: 1 }}>{item.note}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Exhibit B: Realistic Internal Memos & Red-Flag Clues */}
          {activeFolderTab === 'exhibit_b' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }} data-testid="bcom-exhibit-b">
              <div style={{ fontSize: 11, fontWeight: 900, color: 'var(--amber-mid)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Exhibit B — Internal Audit, Tax &amp; Client Correspondence
              </div>
              {caseData.memos.map((memo, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'var(--bg3)',
                    border: '1px solid var(--border)',
                    borderLeft: '3px solid var(--amber-mid)',
                    borderRadius: 10,
                    padding: 12,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 900, color: 'var(--t1)' }}>{memo.from}</span>
                    <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--t3)' }}>{memo.role}</span>
                  </div>
                  <div style={{ fontSize: 11.5, fontWeight: 800, color: 'var(--accent-mid)' }}>
                    Subject: {memo.subject}
                  </div>
                  <p style={{ margin: 0, fontSize: 12.5, color: 'var(--t2)', lineHeight: 1.55 }}>
                    {memo.body}
                  </p>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setActiveFolderTab('workbench')}
                className="iv-btn-primary"
                style={{ alignSelf: 'flex-start', borderRadius: 8, padding: '7px 14px', fontSize: 12 }}
              >
                ← Back to Case Workbench to Pass Entry &amp; Solve
              </button>
            </div>
          )}

          {/* Workbench: 1) Red Flag & Journal/Control Entry, 2) 4 Quantitative Ratios, 3) Formal Verdict + Rationale */}
          {activeFolderTab === 'workbench' && (
            <>
              {/* Part 1: Practical Accounting / Compliance Red Flag & Rectification Entry */}
              <div style={{
                background: 'var(--bg3)',
                borderRadius: 10,
                border: redFlagVerified === true
                  ? '1px solid rgba(34, 197, 94, 0.45)'
                  : redFlagVerified === false
                  ? '1px solid rgba(239, 68, 68, 0.45)'
                  : '1px solid var(--border)',
                padding: 12,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }} data-testid="bcom-red-flag-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 900, color: 'var(--t2)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Part 1: Accounting / Compliance Red Flag &amp; Rectification Entry
                  </span>
                  {redFlagVerified === true && <span style={{ fontSize: 10.5, color: 'var(--green-mid)', fontWeight: 800 }}>✅ Entry Verified</span>}
                  {redFlagVerified === false && <span style={{ fontSize: 10.5, color: 'var(--coral-mid)', fontWeight: 800 }}>❌ Recheck Exhibit B</span>}
                </div>
                <div style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.45 }}>{caseData.redFlagPrompt}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                  {caseData.redFlagOptions.map(opt => {
                    const selected = selectedRedFlagId === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        data-testid={`bcom-redflag-${opt.id}`}
                        onClick={() => {
                          setSelectedRedFlagId(opt.id);
                          codeModifiedRef.current = true;
                        }}
                        style={{
                          textAlign: 'left',
                          padding: '9px 11px',
                          borderRadius: 8,
                          background: selected ? 'rgba(var(--brand-rgb), 0.14)' : 'var(--bg2)',
                          border: selected ? '1.5px solid var(--accent)' : '1px solid var(--border)',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 3,
                        }}
                      >
                        <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--t1)' }}>
                          {selected ? '● ' : '○ '}{opt.label}
                        </span>
                        <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: selected ? 'var(--accent-mid)' : 'var(--t3)' }}>
                          {opt.journalOrControl}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Part 2: Quantitative Financial Ratios */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, fontWeight: 900, color: 'var(--t2)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Part 2: Quantitative Financial Ratios
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

              {/* Part 3: Formal Panel Verdict & Executive Boardroom Rationale */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label htmlFor="case-recommendation-textarea" style={{ fontSize: 11, fontWeight: 900, color: 'var(--t2)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Part 3: Formal Panel Verdict &amp; Boardroom Recommendation
                  </label>
                  <span style={{ fontSize: 11, color: wordCount >= 12 ? 'var(--green-mid)' : 'var(--t3)', fontWeight: 700 }}>
                    {wordCount} words {wordCount < 12 ? '(min 12)' : '✓'}
                  </span>
                </div>

                {/* Decision Pills */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {caseData.verdictOptions.map(v => {
                    const active = selectedVerdictId === v.id;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        data-testid={`bcom-verdict-${v.id}`}
                        onClick={() => {
                          setSelectedVerdictId(v.id);
                          codeModifiedRef.current = true;
                        }}
                        style={{
                          padding: '6px 11px',
                          borderRadius: 8,
                          fontSize: 11.5,
                          fontWeight: 800,
                          cursor: 'pointer',
                          background: active ? 'rgba(var(--brand-rgb), 0.18)' : 'var(--bg3)',
                          border: active ? '1.5px solid var(--accent)' : '1px solid var(--border)',
                          color: active ? 'var(--t1)' : 'var(--t2)',
                        }}
                      >
                        {v.label}
                      </button>
                    );
                  })}
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
                  placeholder="Write your boardroom note: 1) Key diagnosis from the ratios, 2) Accounting/credit/commercial risk from Exhibit B, 3) Concrete control or action plan..."
                  rows={3}
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
                    minHeight: 76,
                  }}
                />
              </div>
            </>
          )}
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
            Tip: Press <strong style={{ color: 'var(--t2)' }}>Ctrl+↵</strong> to submit &amp; begin the 5-question panel cross-exam
          </span>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {hasAuditedOnce && !codeSubmitted && !defenseEliminated && (
              <button
                type="button"
                data-testid="case-submit-partial-btn"
                onClick={() => executeCaseAudit(true)}
                disabled={isRunning || isSendingInterviewMessage || defenseActive}
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
                Submit Working for 5-Q Defense
              </button>
            )}
            <button
              type="button"
              data-testid="case-audit-submit-btn"
              onClick={() => executeCaseAudit(false)}
              disabled={isRunning || isSendingInterviewMessage || defenseActive || defenseEliminated}
              className="iv-btn-success"
              style={{ borderRadius: 8, padding: '8px 16px', fontSize: 12.5, fontWeight: 800 }}
            >
              {isRunning ? 'Auditing…' : defenseActive ? '🎯 5-Q Defense Active' : '📊 Audit & Submit Case Desk (Ctrl+↵)'}
            </button>
          </div>
        </div>
      </div>

      {/* ── RIGHT: 3D Avatar Panelist, 5-Q Defense Tracker, Live Q&A & Audit Log ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, height: '100%', minHeight: 0, overflow: 'hidden' }}>
        <div style={{ height: 132, flexShrink: 0, background: 'var(--bg3)', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden', position: 'relative' }}>
          <VRoidInterviewAvatar teacherId={activeTeacher.id} animState={animState} zoom={1.55} />
          <div style={{ position: 'absolute', bottom: 6, left: 8, padding: '2px 8px', borderRadius: 6, background: 'rgba(10, 14, 26, 0.82)', color: '#f8fafc', fontSize: 10.5, fontWeight: 800 }}>
            {activeTeacher.emoji} {activeTeacher.name}
          </div>
        </div>

        {/* Corporate Panelist 5-Question Cross-Examination Chat */}
        <div
          className="iv-panel"
          data-testid="case-defense-chat"
          style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8, flex: '1 1 0%', minHeight: 0, overflow: 'hidden' }}
          aria-live="polite"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 10.5, fontWeight: 900, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Senior Corporate Panelist
            </span>
            {defenseActive && (
              <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--accent-mid)' }}>5-Q Defense Live</span>
            )}
          </div>

          <DefenseProgressStrip defenseState={defenseState} />

          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', fontSize: 12.5, color: 'var(--t1)', lineHeight: 1.55, paddingRight: 4 }}>
            {lastInterviewerSpeech}
          </div>

          {!defenseEliminated && (
            <form
              onSubmit={e => {
                e.preventDefault();
                const ans = manualTextInput.trim();
                if (!ans || isSendingInterviewMessage) return;
                setManualTextInput('');
                onSendMessage(ans);
              }}
              style={{ display: 'flex', gap: 6, flexShrink: 0 }}
            >
              <input
                value={manualTextInput}
                onChange={e => setManualTextInput(e.target.value)}
                onKeyDown={e => {
                  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                    e.preventDefault();
                    const ans = manualTextInput.trim();
                    if (!ans || isSendingInterviewMessage) return;
                    setManualTextInput('');
                    onSendMessage(ans);
                  }
                }}
                disabled={isSendingInterviewMessage}
                aria-label="Respond to corporate panelist"
                placeholder={defenseActive ? `Answer Question ${defenseState?.currentQuestionNumber}/5…` : 'Ask a clarifying question or defend your numbers…'}
                style={{
                  flex: 1,
                  minWidth: 0,
                  padding: '7px 10px',
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
                  padding: '7px 12px',
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
          )}
        </div>

        {/* Audit Verification Log */}
        <div style={{ height: 140, flexShrink: 0, background: '#020617', borderRadius: 12, border: '1px solid var(--border)', padding: 10, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <span style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase' }}>
              Financial Verification Log
            </span>
            <button
              type="button"
              onClick={() => setTerminalLogs([])}
              style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 4, padding: '1px 6px', fontSize: 10, color: 'var(--t3)', cursor: 'pointer' }}
            >
              Clear
            </button>
          </div>
          <div style={{ flex: 1, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--success-bright)', overflowY: 'auto', lineHeight: 1.45 }}>
            {terminalLogs.length > 0 ? (
              terminalLogs.map((l, idx) => <div key={idx} style={{ marginBottom: 2 }}>{l}</div>)
            ) : (
              <div style={{ color: 'var(--text-dim)', fontStyle: 'italic' }}>
                Select the Exhibit B red flag, enter your 4 ratios, pick a verdict, and click Audit &amp; Submit Case Desk…
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Round2CaseStudy;
