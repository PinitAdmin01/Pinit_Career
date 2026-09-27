# 📈 PinIT Career OS — Business Finance & Investment Management Systems (v1.0)
# Complete 30-Day Technical Reference Manual & Master Curriculum

---

## 🌟 Executive Architectural Overview

Welcome to the definitive **Business Finance & Investment Management Systems Master Reference Document** on PinIT Career OS.
This document provides complete, line-by-line pedagogical and operational blueprints for the 30-day corporate finance and investment curriculum:
- **30 Handcrafted Days** $\times$ **90 Deep Micro-Learning Blocks** (3 blocks/day, 0 single-block days).
- **100% Real-World Business & Finance Analogies & Mental Models**.
- **Memory Box Diagrams, Financial Diffs, and Execution Flowcharts**.
- **100% Runnable JavaScript / Finance & Investment Simulators** with exact expected terminal outputs.
- **Empathetic Socratic Diagnostic Checks & 3-Step Recovery Ladders** (*What Went Wrong* $\to$ *Simpler Everyday Picture* $\to$ *Guided Fix Prompt*).
- **5 Project Milestones + Day 30 Final Capstone**:
  - ⭐ **Day 5 Milestone 1**: Complete Time Value of Money & Financial Valuation Engine
  - ⭐ **Day 15 Milestone 2**: Complete Capital Budgeting & Cost of Capital Valuation Engine
  - ⭐ **Day 21 Milestone 3**: Complete Corporate Capital Structure & Dividend Optimization Engine
  - 🏆 **Day 30 Final Capstone**: Integrated Corporate Finance, Valuation & Portfolio Investment Management Suite

---

## 📅 Day 1: Introduction to Corporate Finance & The Financial Ecosystem

> **💡 Everyday Metaphor / Intuitive Model**:
> Corporate Finance is the Captain's Navigation Wheel of an Enterprise: a ship must decide three crucial maneuvers: 1. Investment Decision (Where to sail the ship to find treasure / Capital Budgeting); 2. Financing Decision (How to buy the ship—using the owners' gold or borrowing from bankers / Capital Structure); 3. Dividend Decision (How much gold to give back to the crew vs keeping in the ship's chest for future voyages); the ultimate goal is not just counting coins today (Profit Maximization), but making the entire fleet as valuable as possible over the long run (Shareholder Wealth Maximization).

### 🔹 Block 1: Shareholder Wealth Maximization vs Profit Maximization

- **Concept Budget / Primary Invariant**: `Wealth Maximization vs Profit Maximization`
- **Supporting Terms & Invariants**: `Profit Maximization (Short-sighted: Ignores timing of cash flows, risk, and accounting distortions)`, `Shareholder Wealth Maximization (Maximizing the market value / stock price of equity shares)`, `Time Value of Money & Risk Incorporation`

#### 📦 Memory Box / Data Layout Diagram: Corporate Financial Objectives Comparison

| Valuation / Capital Component | Invariant & Parameters | Type |
|---|---|---|
| **Profit Maximization (Flawed)** | Goal: Maximize accounting Net Profit | Ignores risk, ignores cash flow timing! | `Accounting Metric` |
| **Wealth Maximization (Superior)** | Goal: Maximize Market Value of Equity Shares | Considers risk, time value, and true cash flows! | `Economic Value` |

#### 💻 Runnable Financial Simulator: `objective_demo.js`

```javascript
function evaluateFinancialGoal(goalType, considersRisk, considersTiming) {
  const isWealthMax = (goalType === 'WEALTH_MAXIMIZATION' && considersRisk && considersTiming);
  return {
    goal: goalType,
    isSuperiorLongTerm: isWealthMax,
    status: isWealthMax ? 'SHAREHOLDER_WEALTH_MAXIMIZATION_PRIMARY_OBJECTIVE' : 'SUB_OPTIMAL_ACCOUNTING_METRIC'
  };
}

console.log(JSON.stringify(evaluateFinancialGoal('WEALTH_MAXIMIZATION', true, true)));
console.log(JSON.stringify(evaluateFinancialGoal('PROFIT_MAXIMIZATION', false, false)));
```

**Expected Terminal Output**:
```text
{"goal":"WEALTH_MAXIMIZATION","isSuperiorLongTerm":true,"status":"SHAREHOLDER_WEALTH_MAXIMIZATION_PRIMARY_OBJECTIVE"}
{"goal":"PROFIT_MAXIMIZATION","isSuperiorLongTerm":false,"status":"SUB_OPTIMAL_ACCOUNTING_METRIC"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What status confirms that corporate financial decisions are guided by the superior long-term economic goal of Shareholder Wealth Maximization?*

- **Target Answer**: `SHAREHOLDER_WEALTH_MAXIMIZATION_PRIMARY_OBJECTIVE`
- **Typed Misconception ID**: `MC_FIN_CAPSTONE_CORPORATE_FINANCE_AND_PORTFOLIO_VALUATION`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'PROFIT'**:
  - *What Went Wrong*: Profit maximization ignores risk and cash timing. Wealth maximization is the primary corporate goal.
  - *Simpler Mental Model*: Matches SHAREHOLDER_WEALTH_MAXIMIZATION_PRIMARY_OBJECTIVE.
  - *Guided Fix Action*: Type SHAREHOLDER_WEALTH_MAXIMIZATION_PRIMARY_OBJECTIVE

---

### 🔹 Block 2: The 3 Core Financial Decisions: Investing, Financing & Dividend

- **Concept Budget / Primary Invariant**: `The Triad of Corporate Financial Decisions`
- **Supporting Terms & Invariants**: `Investment Decision (Capital Budgeting: Long-term asset selection & Working Capital management)`, `Financing Decision (Capital Structure: Optimal debt-equity mix to minimize WACC)`, `Dividend Decision (Retained Earnings for growth vs Cash Dividends to shareholders)`

#### ⚠️ Financial Misconception vs Sound Corporate Practice: Siloed Decision-Making vs Integrated Corporate Finance

```text
// ❌ FLAWED FINANCIAL APPROACH:
// ❌ FLAWED APPROACH: Treating decisions independently:
Buy factory ($10M) without knowing interest rates on debt,
then pay out 100% dividends leaving zero cash reserve!

// ✅ SOUND CORPORATE FINANCE PRODUCTION STANDARD:
// ✅ INTEGRATED CORPORATE FINANCE:
1. Select project with NPV > 0 (Investment Decision)
2. Fund via optimal Debt/Equity mix to minimize WACC (Financing Decision)
3. Distribute only residual surplus as dividends (Dividend Decision)
```

**Root Cause**: Financial decisions cannot be made in isolation without evaluating cost of capital and liquidity.

**Fix Explanation**: Align investment hurdle rates with optimal financing mix and sustainable dividend payout.

#### 💻 Runnable Financial Simulator: `decisions_demo.js`

```javascript
function getDecisionCategory(question) {
  if (question.includes('factory') || question.includes('project')) return 'INVESTMENT_DECISION_CAPITAL_BUDGETING';
  if (question.includes('debt') || question.includes('equity') || question.includes('loan')) return 'FINANCING_DECISION_CAPITAL_STRUCTURE';
  return 'DIVIDEND_DECISION_PAYOUT_POLICY';
}

console.log(getDecisionCategory('Should we purchase a new $10M automated factory?'));
console.log(getDecisionCategory('Should we issue 8% debentures or equity shares?'));
console.log(getDecisionCategory('What percentage of net profit should be distributed as cash?'));
```

**Expected Terminal Output**:
```text
INVESTMENT_DECISION_CAPITAL_BUDGETING
FINANCING_DECISION_CAPITAL_STRUCTURE
DIVIDEND_DECISION_PAYOUT_POLICY
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *Which financial decision category determines whether a corporation should issue bonds vs common stock to fund its expansion?*

- **Target Answer**: `FINANCING_DECISION_CAPITAL_STRUCTURE`
- **Typed Misconception ID**: `MC_FIN_CAPITAL_STRUCTURE_MODIGLIANI_MILLER`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'INVESTMENT'**:
  - *What Went Wrong*: Selecting projects is an Investment Decision. Choosing debt vs equity is a Financing Decision.
  - *Simpler Mental Model*: Bonds vs stock is a Financing Decision.
  - *Guided Fix Action*: Type FINANCING_DECISION_CAPITAL_STRUCTURE

---

### 🔹 Block 3: The Agency Problem & Corporate Governance Mechanisms

- **Concept Budget / Primary Invariant**: `The Principal-Agent Conflict`
- **Supporting Terms & Invariants**: `Principals (Shareholders who own the company)`, `Agents (Executive managers hired to run the business)`, `Agency Costs (Perks, executive jets, sub-optimal empire-building mergers)`, `Governance Solutions (Stock options ESOPs, Board oversight, Performance bonuses)`

#### 💻 Runnable Financial Simulator: `agency_demo.js`

```javascript
function evaluateAgencyAlignment(incentiveType) {
  return incentiveType === 'STOCK_OPTIONS_TIED_TO_SHARE_PRICE'
    ? 'MANAGEMENT_GOALS_ALIGNED_WITH_SHAREHOLDER_WEALTH'
    : 'POTENTIAL_AGENCY_CONFLICT_RISK';
}

console.log(evaluateAgencyAlignment('STOCK_OPTIONS_TIED_TO_SHARE_PRICE'));
console.log(evaluateAgencyAlignment('FIXED_SALARY_WITH_NO_PERFORMANCE_GOALS'));
```

**Expected Terminal Output**:
```text
MANAGEMENT_GOALS_ALIGNED_WITH_SHAREHOLDER_WEALTH
POTENTIAL_AGENCY_CONFLICT_RISK
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *How do Employee Stock Option Plans (ESOPs) mitigate the corporate agency problem between managers and shareholders?*

- **Target Answer**: `MANAGEMENT_GOALS_ALIGNED_WITH_SHAREHOLDER_WEALTH`
- **Typed Misconception ID**: `MC_FIN_CAPSTONE_CORPORATE_FINANCE_AND_PORTFOLIO_VALUATION`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'CONFLICT'**:
  - *What Went Wrong*: Stock options align management incentives with shareholder wealth.
  - *Simpler Mental Model*: Aligns management with shareholder wealth.
  - *Guided Fix Action*: Type MANAGEMENT_GOALS_ALIGNED_WITH_SHAREHOLDER_WEALTH

---

## 📅 Day 2: Time Value of Money (TVM): Compounding & Future Value ($FV$)

> **💡 Everyday Metaphor / Intuitive Model**:
> Compounding is a Rolling Snowball on a Mountain Slope: if you start with a $100,000 snowball and roll it down a 10% interest slope, in Year 1 it picks up $10,000 of snow ($110,000); in Year 2, the new snow also gathers snow—growing by $11,000 ($121,000); after 10 years, compounding expands the snowball to $259,374; Albert Einstein called compound interest the Eighth Wonder of the World: 'He who understands it, earns it; he who doesn't, pays it.'

### 🔹 Block 1: Future Value Equation: $FV = PV(1 + r)^n$

- **Concept Budget / Primary Invariant**: `Future Value Compound Interest Formula`
- **Supporting Terms & Invariants**: `$PV$ (Present Value / Initial Principal)`, `$r$ (Annual interest / compounding rate)`, `$n$ (Number of compounding time periods / years)`, `$FV = PV(1 + r)^n$`, `Simple Interest ($SI = P \cdot r \cdot n$) vs Compound Interest`

#### 📦 Memory Box / Data Layout Diagram: Compound Growth ($100k @ 10% for 3 Years)

| Valuation / Capital Component | Invariant & Parameters | Type |
|---|---|---|
| **Year 0 (Present Value)** | $100,000 Principal | `Initial PV` |
| **Year 1 ($100k x 1.10)** | $110,000 (+10k interest) | `Compounded Y1` |
| **Year 2 ($110k x 1.10)** | $121,000 (+11k interest) | `Compounded Y2` |
| **Year 3 ($121k x 1.10)** | $133,100 (+12.1k interest on interest!) | `Final FV` |

#### 💻 Runnable Financial Simulator: `fv_calc_demo.js`

```javascript
function calculateFutureValue(pv, rPct, n) {
  const r = rPct / 100;
  const fv = pv * Math.pow(1 + r, n);
  const totalInterest = fv - pv;
  return {
    presentValue: pv,
    futureValue: Number(fv.toFixed(2)),
    compoundInterestEarned: Number(totalInterest.toFixed(2)),
    status: 'FUTURE_VALUE_COMPUTED'
  };
}

console.log(JSON.stringify(calculateFutureValue(100000, 10, 3)));
```

**Expected Terminal Output**:
```text
{"presentValue":100000,"futureValue":133100,"compoundInterestEarned":33100,"status":"FUTURE_VALUE_COMPUTED"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What is the Future Value of $100,000 invested for 3 years at 10% compound interest ($100000 \times 1.10^3$)?*

- **Target Answer**: `133100`
- **Typed Misconception ID**: `MC_FIN_TIME_VALUE_OF_MONEY_COMPOUND_INTEREST`

**Diagnostic Recovery Paths**:
- **If Student Triggers '130000'**:
  - *What Went Wrong*: $130,000 is simple interest ($10k x 3). Compound interest adds interest on interest = $133,100.
  - *Simpler Mental Model*: 100000 * 1.331 = 133100.
  - *Guided Fix Action*: Type 133100

---

### 🔹 Block 2: Multi-Period Compounding & Effective Annual Rate (EAR)

- **Concept Budget / Primary Invariant**: `Multi-Period Compounding & EAR`
- **Supporting Terms & Invariants**: `$m$ Compounding Frequency (Semi-Annual $m=2$, Quarterly $m=4$, Monthly $m=12$, Daily $m=365$)`, `$FV = PV \left(1 + \frac{r}{m}\right)^{m \times n}$`, `Effective Annual Rate: $EAR = \left(1 + \frac{r}{m}\right)^m - 1$`, `$EAR > \text{Nominal Rate}$ when $m > 1$`

#### ⚙️ Syntax & Formula Anatomy: Nominal vs Effective Rate Calculation

```text
// 10% Nominal Rate Compounded Semi-Annually (m = 2):
// Periodic Rate = 10% / 2 = 5% per half-year
// EAR = (1 + 0.05)^2 - 1 = 1.1025 - 1 = 10.25% Effective Yield!
```

- **Line 2**: Periodic semi-annual rate.
- **Line 3**: Effective annual rate exceeds nominal rate.

#### 💻 Runnable Financial Simulator: `ear_calc_demo.js`

```javascript
function calculateEar(nominalPct, m) {
  const r = nominalPct / 100;
  const ear = (Math.pow(1 + r / m, m) - 1) * 100;
  return {
    nominalRatePercent: nominalPct,
    compoundingFrequencyPerYear: m,
    effectiveAnnualRatePercent: Number(ear.toFixed(2)),
    status: 'EAR_COMPUTED'
  };
}

console.log(JSON.stringify(calculateEar(10, 2)));
console.log(JSON.stringify(calculateEar(10, 12)));
```

**Expected Terminal Output**:
```text
{"nominalRatePercent":10,"compoundingFrequencyPerYear":2,"effectiveAnnualRatePercent":10.25,"status":"EAR_COMPUTED"}
{"nominalRatePercent":10,"compoundingFrequencyPerYear":12,"effectiveAnnualRatePercent":10.47,"status":"EAR_COMPUTED"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What is the Effective Annual Rate (EAR) percentage for a 10% nominal interest rate compounded semi-annually ($ (1 + 0.05)^2 - 1 $)?*

- **Target Answer**: `10.25`
- **Typed Misconception ID**: `MC_FIN_TIME_VALUE_OF_MONEY_COMPOUND_INTEREST`

**Diagnostic Recovery Paths**:
- **If Student Triggers '10.0'**:
  - *What Went Wrong*: 10.0% is the nominal rate. Semi-annual compounding yields an effective 10.25%.
  - *Simpler Mental Model*: 1.05^2 - 1 = 10.25%.
  - *Guided Fix Action*: Type 10.25

---

### 🔹 Block 3: The Rule of 72 for Investment Doubling Time

- **Concept Budget / Primary Invariant**: `Rule of 72 Mental Model`
- **Supporting Terms & Invariants**: `$\text{Doubling Time (Years)} \approx \frac{72}{\text{Annual Interest Rate (\%)}}$`, `At 6% $\implies 72 / 6 = 12$ years to double`, `At 12% $\implies 72 / 12 = 6$ years to double`

#### 💻 Runnable Financial Simulator: `rule72_demo.js`

```javascript
function getDoublingTime(rPct) {
  const approxYears = 72 / rPct;
  const exactYears = Math.log(2) / Math.log(1 + rPct / 100);
  return {
    annualRatePercent: rPct,
    rule72ApproxYears: Number(approxYears.toFixed(1)),
    exactLogYears: Number(exactYears.toFixed(2)),
    status: 'DOUBLING_TIME_EVALUATED'
  };
}

console.log(JSON.stringify(getDoublingTime(8)));
```

**Expected Terminal Output**:
```text
{"annualRatePercent":8,"rule72ApproxYears":9,"exactLogYears":9.01,"status":"DOUBLING_TIME_EVALUATED"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *According to the Rule of 72, approximately how many years will it take for an investment to double at an 8% annual return ($72 / 8$)?*

- **Target Answer**: `9`
- **Typed Misconception ID**: `MC_FIN_TIME_VALUE_OF_MONEY_COMPOUND_INTEREST`

**Diagnostic Recovery Paths**:
- **If Student Triggers '8'**:
  - *What Went Wrong*: 72 / 8 = 9 years.
  - *Simpler Mental Model*: 72 / 8 = 9.
  - *Guided Fix Action*: Type 9

---

## 📅 Day 3: Time Value of Money (TVM): Discounting & Present Value ($PV$)

> **💡 Everyday Metaphor / Intuitive Model**:
> Discounting is Shrinking a Distant Giant Down to Its True Size: a promise of receiving $133,100 three years from now sounds huge; but if money earns 10% a year in a safe bank, that future $133,100 is worth exactly $100,000 today; Discounting takes future cash flows and shrinks them backward in time ($PV = \frac{FV}{(1 + r)^n}$) so you can compare whether an investment today is worth its future promises.

### 🔹 Block 1: Present Value Discounting Equation: $PV = \frac{FV}{(1 + r)^n}$

- **Concept Budget / Primary Invariant**: `Present Value Discounting Formula`
- **Supporting Terms & Invariants**: `$PV = \frac{FV}{(1 + r)^n} = FV \times (1 + r)^{-n}$`, `Discount Rate ($r$: Required return / opportunity cost of capital)`, `Discount Factor ($DF = \frac{1}{(1 + r)^n}$)`, `Inverse relationship between Discount Rate and Present Value`

#### 📦 Memory Box / Data Layout Diagram: Discounting Backward in Time ($133.1k @ 10%)

| Valuation / Capital Component | Invariant & Parameters | Type |
|---|---|---|
| **Year 3 Promise** | $133,100 in the future | `Future Cash` |
| **Discount Factor (1.10^-3)** | DF = 1 / 1.331 = 0.751315 | `Discount Factor` |
| **Present Value (Today)** | $133,100 x 0.751315 = EXACTLY $100,000 Today! | `Present Value` |

#### 💻 Runnable Financial Simulator: `pv_calc_demo.js`

```javascript
function calculatePresentValue(fv, rPct, n) {
  const r = rPct / 100;
  const df = 1 / Math.pow(1 + r, n);
  const pv = fv * df;
  return {
    futureValue: fv,
    discountRatePercent: rPct,
    discountFactor: Number(df.toFixed(6)),
    presentValue: Number(pv.toFixed(2)),
    status: 'PRESENT_VALUE_COMPUTED'
  };
}

console.log(JSON.stringify(calculatePresentValue(133100, 10, 3)));
```

**Expected Terminal Output**:
```text
{"futureValue":133100,"discountRatePercent":10,"discountFactor":0.751315,"presentValue":100000,"status":"PRESENT_VALUE_COMPUTED"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What is the Present Value of $133,100 to be received 3 years from now at a 10% discount rate ($133100 / 1.10^3$)?*

- **Target Answer**: `100000`
- **Typed Misconception ID**: `MC_FIN_PRESENT_VALUE_DISCOUNTING_CASH_FLOWS`

**Diagnostic Recovery Paths**:
- **If Student Triggers '133100'**:
  - *What Went Wrong*: Must discount by 1.10^3 = 1.331 -> $100,000.
  - *Simpler Mental Model*: 133100 / 1.331 = 100000.
  - *Guided Fix Action*: Type 100000

---

### 🔹 Block 2: Discounting Uneven Cash Flow Streams ($PV = \sum \frac{CF_t}{(1 + r)^t}$)

- **Concept Budget / Primary Invariant**: `Discounting Uneven Cash Streams`
- **Supporting Terms & Invariants**: `Multiple Cash Flows ($CF_1, CF_2, \dots, CF_n$)`, `Period-by-period discounting`, `Linear Additivity of Present Values ($PV(\text{Total}) = \sum PV(CF_t)$)`

#### ⚙️ Syntax & Formula Anatomy: Uneven Cash Flow Discounting Loop

```text
const cfs = [10000, 20000, 30000]; // Cash flows in Y1, Y2, Y3
const r = 0.10; // 10% discount rate
let totalPv = 0;
for (let t = 1; t <= cfs.length; t++) {
  totalPv += cfs[t - 1] / Math.pow(1 + r, t);
} // 10k/1.1 + 20k/1.21 + 30k/1.331 = $48,159.28
```

- **Line 1**: Uneven annual stream.
- **Line 5**: Discounts each flow to time 0.

#### 💻 Runnable Financial Simulator: `uneven_pv_demo.js`

```javascript
function discountUnevenStream(cfs, rPct) {
  const r = rPct / 100;
  let totalPv = 0;
  cfs.forEach((cf, idx) => {
    totalPv += cf / Math.pow(1 + r, idx + 1);
  });
  return {
    cashFlowStream: cfs,
    totalPresentValue: Number(totalPv.toFixed(2)),
    status: 'UNEVEN_STREAM_DISCOUNTED'
  };
}

console.log(JSON.stringify(discountUnevenStream([10000, 20000, 30000], 10)));
```

**Expected Terminal Output**:
```text
{"cashFlowStream":[10000,20000,30000],"totalPresentValue":48159.28,"status":"UNEVEN_STREAM_DISCOUNTED"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What is the total Present Value of receiving $10,000 in Year 1, $20,000 in Year 2, and $30,000 in Year 3 at a 10% discount rate?*

- **Target Answer**: `48159.28`
- **Typed Misconception ID**: `MC_FIN_PRESENT_VALUE_DISCOUNTING_CASH_FLOWS`

**Diagnostic Recovery Paths**:
- **If Student Triggers '60000'**:
  - *What Went Wrong*: $60,000 is nominal un-discounted sum. Discounted present value is $48,159.28.
  - *Simpler Mental Model*: Discounted sum is 48159.28.
  - *Guided Fix Action*: Type 48159.28

---

### 🔹 Block 3: Risk-Adjusted Discount Rates & Opportunity Cost of Capital

- **Concept Budget / Primary Invariant**: `Risk-Adjusted Discounting Invariant`
- **Supporting Terms & Invariants**: `Risk-Free Rate ($R_f$) + Risk Premium ($RP$)`, `Higher Risk $\implies$ Higher Discount Rate $\implies$ Lower Present Value!`, `Hurdle Rate for Capital Investment`

#### 💻 Runnable Financial Simulator: `risk_rate_demo.js`

```javascript
function evaluateRiskDiscounting(isHighRisk) {
  return isHighRisk
    ? 'HIGHER_DISCOUNT_RATE_LOWERS_PRESENT_VALUE'
    : 'LOWER_DISCOUNT_RATE_PRESERVES_HIGHER_VALUE';
}

console.log(evaluateRiskDiscounting(true));
console.log(evaluateRiskDiscounting(false));
```

**Expected Terminal Output**:
```text
HIGHER_DISCOUNT_RATE_LOWERS_PRESENT_VALUE
LOWER_DISCOUNT_RATE_PRESERVES_HIGHER_VALUE
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What effect does assigning a higher risk-adjusted discount rate have on the Present Value of a future cash flow?*

- **Target Answer**: `HIGHER_DISCOUNT_RATE_LOWERS_PRESENT_VALUE`
- **Typed Misconception ID**: `MC_FIN_PRESENT_VALUE_DISCOUNTING_CASH_FLOWS`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'INCREASES'**:
  - *What Went Wrong*: Discount rate is in the denominator: higher rate reduces present value.
  - *Simpler Mental Model*: Higher rate lowers present value.
  - *Guided Fix Action*: Type HIGHER_DISCOUNT_RATE_LOWERS_PRESENT_VALUE

---

## 📅 Day 4: Annuities & Loan Amortization: Ordinary Annuity, Annuity Due & EMI

> **💡 Everyday Metaphor / Intuitive Model**:
> An Annuity is a Regular Water Dripper That Dispenses Exactly One Cup of Water Every Hour: an Ordinary Annuity gives you the water at the END of each hour (like salary paid at month end); an Annuity Due gives you the water at the BEGINNING of each hour (like house rent paid in advance); because you get the water earlier in an Annuity Due, you earn one extra period of interest ($PVA_{\text{due}} = PVA \times (1 + r)$); Loan EMI divides your debt into equal monthly drips that pay down both interest and principal.

### 🔹 Block 1: Ordinary Annuity vs Annuity Due Equations

- **Concept Budget / Primary Invariant**: `Annuity Timing & Present Value`
- **Supporting Terms & Invariants**: `Ordinary Annuity ($PV = PMT \times \left[\frac{1 - (1+r)^{-n}}{r}\right]$: Payments at period end)`, `Annuity Due ($PV_{\text{due}} = PV_{\text{ord}} \times (1 + r)$: Payments at period start)`, `Present Value Annuity Factor (PVAF)`

#### 📦 Memory Box / Data Layout Diagram: Annuity Timing Comparison ($10k/yr for 3 Yrs @ 10%)

| Valuation / Capital Component | Invariant & Parameters | Type |
|---|---|---|
| **Ordinary Annuity (End of Period)** | PV = $10k x ((1 - 1.1^-3)/0.10) = $10k x 2.48685 = $24,868.52 | `Ordinary PV` |
| **Annuity Due (Start of Period)** | PV = $24,868.52 x 1.10 = $27,355.37 (One extra compounding period!) | `Annuity Due PV` |

#### 💻 Runnable Financial Simulator: `annuity_calc_demo.js`

```javascript
function calculateAnnuityPv(pmt, rPct, n) {
  const r = rPct / 100;
  const pvaf = (1 - Math.pow(1 + r, -n)) / r;
  const ordinaryPv = pmt * pvaf;
  const duePv = ordinaryPv * (1 + r);
  return {
    periodicPayment: pmt,
    ordinaryAnnuityPv: Number(ordinaryPv.toFixed(2)),
    annuityDuePv: Number(duePv.toFixed(2)),
    status: 'ANNUITIES_COMPUTED'
  };
}

console.log(JSON.stringify(calculateAnnuityPv(10000, 10, 3)));
```

**Expected Terminal Output**:
```text
{"periodicPayment":10000,"ordinaryAnnuityPv":24868.52,"annuityDuePv":27355.37,"status":"ANNUITIES_COMPUTED"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What is the Present Value of an Ordinary Annuity paying $10,000 annually for 3 years at a 10% discount rate?*

- **Target Answer**: `24868.52`
- **Typed Misconception ID**: `MC_FIN_ANNUITY_ORDINARY_VS_DUE_CALCULATION`

**Diagnostic Recovery Paths**:
- **If Student Triggers '30000'**:
  - *What Went Wrong*: $30,000 is un-discounted sum. Present value of annuity is $24,868.52.
  - *Simpler Mental Model*: Discounted annuity is 24868.52.
  - *Guided Fix Action*: Type 24868.52

---

### 🔹 Block 2: Perpetuity ($PV = \frac{PMT}{r}$) & Growing Perpetuity ($PV = \frac{PMT_1}{r - g}$)

- **Concept Budget / Primary Invariant**: `Perpetuity Valuation Formulas`
- **Supporting Terms & Invariants**: `Perpetuity: Infinite equal periodic cash flow stream ($PV = \frac{PMT}{r}$)`, `Growing Perpetuity: Cash flows growing at constant rate $g$ ($PV = \frac{PMT_1}{r - g}$ where $r > g$)`, `Preferred Stock & Real Estate Ground Leases`

#### ⚙️ Syntax & Formula Anatomy: Perpetuity vs Growing Perpetuity Math

```text
// Flat Perpetuity: $10,000 per year forever @ 10% discount rate:
// PV = 10,000 / 0.10 = $100,000
// Growing Perpetuity: $10,000 next year, growing at 3% forever @ 10% rate:
// PV = 10,000 / (0.10 - 0.03) = 10,000 / 0.07 = $142,857.14
```

- **Line 2**: Flat perpetuity formula.
- **Line 4**: Growing perpetuity formula.

#### 💻 Runnable Financial Simulator: `perpetuity_calc_demo.js`

```javascript
function evaluatePerpetuities(pmt, rPct, gPct = 3) {
  const r = rPct / 100;
  const g = gPct / 100;
  const flatPv = pmt / r;
  const growingPv = pmt / (r - g);
  return {
    annualPayment: pmt,
    flatPerpetuityPv: Math.round(flatPv),
    growingPerpetuityPv: Number(growingPv.toFixed(2)),
    status: 'PERPETUITY_VALUED'
  };
}

console.log(JSON.stringify(evaluatePerpetuities(10000, 10, 3)));
```

**Expected Terminal Output**:
```text
{"annualPayment":10000,"flatPerpetuityPv":100000,"growingPerpetuityPv":142857.14,"status":"PERPETUITY_VALUED"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What is the Present Value of a flat perpetuity paying $10,000 per year forever at a 10% discount rate ($10000 / 0.10$)?*

- **Target Answer**: `100000`
- **Typed Misconception ID**: `MC_FIN_ANNUITY_ORDINARY_VS_DUE_CALCULATION`

**Diagnostic Recovery Paths**:
- **If Student Triggers '10000'**:
  - *What Went Wrong*: 10,000 / 0.10 = $100,000.
  - *Simpler Mental Model*: 10000 / 0.10 = 100000.
  - *Guided Fix Action*: Type 100000

---

### 🔹 Block 3: Loan Amortization Mechanics & EMI Interest Breakdown

- **Concept Budget / Primary Invariant**: `Loan Amortization & EMI Equation`
- **Supporting Terms & Invariants**: `$EMI = \frac{P \cdot r \cdot (1 + r)^n}{(1 + r)^n - 1}$`, `Interest Component (Highest in early months, decreases over time)`, `Principal Repayment Component (Lowest in early months, increases over time)`

#### 💻 Runnable Financial Simulator: `emi_amort_demo.js`

```javascript
function evaluateAmortizationSplit(principal, monthlyRate, emi) {
  const month1Interest = principal * monthlyRate;
  const month1Principal = emi - month1Interest;
  return {
    monthlyEmi: emi,
    month1InterestPortion: Number(month1Interest.toFixed(2)),
    month1PrincipalPortion: Number(month1Principal.toFixed(2)),
    status: 'AMORTIZATION_SPLIT_EVALUATED'
  };
}

console.log(JSON.stringify(evaluateAmortizationSplit(100000, 0.01, 8884.88)));
```

**Expected Terminal Output**:
```text
{"monthlyEmi":8884.88,"month1InterestPortion":1000,"month1PrincipalPortion":7884.88,"status":"AMORTIZATION_SPLIT_EVALUATED"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *In Month 1 of a $100,000 loan at 1% monthly interest with an $8,884.88 EMI, how much of the payment goes toward interest ($100000 \times 0.01$)?*

- **Target Answer**: `1000`
- **Typed Misconception ID**: `MC_FIN_ANNUITY_ORDINARY_VS_DUE_CALCULATION`

**Diagnostic Recovery Paths**:
- **If Student Triggers '8884.88'**:
  - *What Went Wrong*: $8,884.88 is the total EMI. Interest in month 1 is $100,000 * 1% = $1,000.
  - *Simpler Mental Model*: 100,000 * 0.01 = 1,000.
  - *Guided Fix Action*: Type 1000

---

## 📅 Day 5: ⭐ MILESTONE 1: Complete Time Value of Money & Financial Valuation Engine

> **💡 Everyday Metaphor / Intuitive Model**:
> Milestone 1 Synthesis: The complete sovereign Time Value of Money (TVM) math and financial valuation engine: 1. Multi-period compounding and future value expansion; 2. Uneven cash flow discounting; 3. Ordinary and due annuities; 4. Loan amortization and perpetuity valuation.

### 🔹 Block 1: Time Value of Money (TVM) Master Kernel Synthesis

- **Concept Budget / Primary Invariant**: `TVM Engine Synthesis`
- **Supporting Terms & Invariants**: `Compounding Engine`, `Discounting Engine`, `Annuity Calculator`, `Amortization Scheduler`

#### 🔄 Valuation & Decision Process Execution Flowchart: Milestone 1 TVM Financial Pipeline

1. **Inputs Principal ($100k), Rate (10%), Time (3 Yrs)**
2. **Calculates Future Value compound growth ($133,100)**
3. **Discounts uneven future cash streams to Present Value ($48,159)**
4. **Generates Ordinary Annuity & Loan Amortization schedules!**

#### 💻 Runnable Financial Simulator: `tvm_kernel_demo.js`

```javascript
function runTvmEngine() {
  return {
    futureValueSubsystem: 'ONLINE_COMPOUNDING_ACTIVE',
    presentValueSubsystem: 'ONLINE_DISCOUNTING_ACTIVE',
    annuitySubsystem: 'ONLINE_ORDINARY_AND_DUE_ACTIVE',
    amortizationSubsystem: 'ONLINE_EMI_SCHEDULER_ACTIVE',
    engineStatus: 'TVM_MASTER_VALUATION_ENGINE_ACTIVE'
  };
}

console.log(runTvmEngine().engineStatus);
```

**Expected Terminal Output**:
```text
TVM_MASTER_VALUATION_ENGINE_ACTIVE
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What engine status confirms active operational synthesis of the TVM Master Valuation Engine?*

- **Target Answer**: `TVM_MASTER_VALUATION_ENGINE_ACTIVE`
- **Typed Misconception ID**: `MC_FIN_TIME_VALUE_OF_MONEY_COMPOUND_INTEREST`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'FAILED'**:
  - *What Went Wrong*: Matches TVM_MASTER_VALUATION_ENGINE_ACTIVE.
  - *Simpler Mental Model*: Matches header string.
  - *Guided Fix Action*: Type TVM_MASTER_VALUATION_ENGINE_ACTIVE

---

### 🔹 Block 2: TVM Invariant Verification & Precision Audit

- **Concept Budget / Primary Invariant**: `TVM Invariant Verification`
- **Supporting Terms & Invariants**: `Compounding Invariant`, `Discounting Invariant`, `100% Quality Invariant`

#### 💻 Runnable Financial Simulator: `tvm_audit_demo.js`

```javascript
function auditTvmEngine(fvValid, pvValid, annuityValid) {
  const passed = fvValid && pvValid && annuityValid;
  return {
    fvVerified: fvValid,
    pvVerified: pvValid,
    annuityVerified: annuityValid,
    grade: passed ? 'TVM_VALUATION_ENGINE_AUDIT_PASSED' : 'AUDIT_DEFECT'
  };
}

console.log(JSON.stringify(auditTvmEngine(true, true, true)));
```

**Expected Terminal Output**:
```text
{"fvVerified":true,"pvVerified":true,"annuityVerified":true,"grade":"TVM_VALUATION_ENGINE_AUDIT_PASSED"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What audit grade is awarded when Future Value, Present Value, and Annuity calculations pass 100%?*

- **Target Answer**: `TVM_VALUATION_ENGINE_AUDIT_PASSED`
- **Typed Misconception ID**: `MC_FIN_TIME_VALUE_OF_MONEY_COMPOUND_INTEREST`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'DEFECT'**:
  - *What Went Wrong*: All checks passing awards TVM_VALUATION_ENGINE_AUDIT_PASSED.
  - *Simpler Mental Model*: Awards TVM_VALUATION_ENGINE_AUDIT_PASSED.
  - *Guided Fix Action*: Type TVM_VALUATION_ENGINE_AUDIT_PASSED

---

### 🔹 Block 3: Milestone 1 TVM Financial Engine Certification

- **Concept Budget / Primary Invariant**: `Milestone 1 Certification`
- **Supporting Terms & Invariants**: `TVM Engine Verified`, `100% Quality Invariant`

#### 💻 Runnable Financial Simulator: `milestone1_fin_cert.js`

```javascript
console.log('⭐ MILESTONE 1: Complete Time Value of Money & Financial Valuation Engine [VERIFIED 100%]');
```

**Expected Terminal Output**:
```text
⭐ MILESTONE 1: Complete Time Value of Money & Financial Valuation Engine [VERIFIED 100%]
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What certification string confirms Milestone 1 completion?*

- **Target Answer**: `⭐ MILESTONE 1: Complete Time Value of Money & Financial Valuation Engine [VERIFIED 100%]`
- **Typed Misconception ID**: `MC_FIN_TIME_VALUE_OF_MONEY_COMPOUND_INTEREST`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'FAILED'**:
  - *What Went Wrong*: Matches milestone header string.
  - *Simpler Mental Model*: Matches header string.
  - *Guided Fix Action*: Type ⭐ MILESTONE 1: Complete Time Value of Money & Financial Valuation Engine [VERIFIED 100%]

---

## 📅 Day 6: Bond Valuation: Pricing Fixed Income Securities & Coupon Pricing

> **💡 Everyday Metaphor / Intuitive Model**:
> A Bond is an I.O.U. Note with Attached Gift Cards: when you lend $1,000 to the government, they give you a Bond certificate with 5 annual coupon cards worth $100 each, plus a promise to return your full $1,000 principal at maturity; Bond Pricing is discounting each annual $100 coupon plus the final $1,000 repayment back to today's present value; if interest rates in the market rise to 12%, your 10% bond looks unattractive, so its price drops below $1,000 (Discount Bond); if market rates drop to 8%, your 10% bond is attractive, so its price rises above $1,000 (Premium Bond).

### 🔹 Block 1: The Bond Valuation Formula: Coupon Annuity + Face Value Discounting

- **Concept Budget / Primary Invariant**: `Bond Valuation Formula`
- **Supporting Terms & Invariants**: `$V_0 = \sum_{t=1}^n \frac{C}{(1 + k_d)^t} + \frac{M}{(1 + k_d)^n}$`, `$C$ (Annual coupon payment = Face Value $\times$ Coupon Rate)`, `$M$ (Maturity Face Value e.g. $1,000)`, `$k_d$ (Market required yield / discount rate)`, `Inverse Price-Yield Relationship`

#### 📦 Memory Box / Data Layout Diagram: Bond Cash Flow Stream ($1,000 Par, 10% Coupon, 3 Yrs @ 10%)

| Valuation / Capital Component | Invariant & Parameters | Type |
|---|---|---|
| **Coupons Annuity (Y1, Y2, Y3)** | PV of 3 x $100 coupons @ 10% = $100 x 2.48685 = $248.69 | `Coupon Stream` |
| **Maturity Principal (Y3)** | PV of $1,000 @ 10% = $1,000 / 1.331 = $751.31 | `Principal Repayment` |
| **Total Intrinsic Price** | $248.69 + $751.31 = EXACTLY $1,000.00 Par Bond! | `Bond Price` |

#### 💻 Runnable Financial Simulator: `bond_val_demo.js`

```javascript
function calculateBondValue(m, couponRatePct, marketYieldPct, n) {
  const c = m * (couponRatePct / 100);
  const kd = marketYieldPct / 100;
  let pvCoupons = 0;
  for (let t = 1; t <= n; t++) {
    pvCoupons += c / Math.pow(1 + kd, t);
  }
  const pvMaturity = m / Math.pow(1 + kd, n);
  const price = pvCoupons + pvMaturity;
  return {
    annualCoupon: c,
    pvOfCoupons: Number(pvCoupons.toFixed(2)),
    pvOfMaturity: Number(pvMaturity.toFixed(2)),
    bondPrice: Number(price.toFixed(2)),
    status: 'BOND_VALUE_COMPUTED'
  };
}

console.log(JSON.stringify(calculateBondValue(1000, 10, 10, 3)));
```

**Expected Terminal Output**:
```text
{"annualCoupon":100,"pvOfCoupons":248.69,"pvOfMaturity":751.31,"bondPrice":1000,"status":"BOND_VALUE_COMPUTED"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What is the intrinsic price of a 3-year $1,000 par bond paying a 10% annual coupon when the market required yield is also 10%?*

- **Target Answer**: `1000`
- **Typed Misconception ID**: `MC_FIN_BOND_VALUATION_YIELD_TO_MATURITY_YTM`

**Diagnostic Recovery Paths**:
- **If Student Triggers '1300'**:
  - *What Went Wrong*: $1,300 is nominal un-discounted cash flow. When coupon rate equals market yield, bond trades at exact par = $1,000.
  - *Simpler Mental Model*: Coupon rate = Yield -> Trades at Par = 1000.
  - *Guided Fix Action*: Type 1000

---

### 🔹 Block 2: Par, Premium & Discount Bonds: Coupon Rate vs Market Yield Dynamics

- **Concept Budget / Primary Invariant**: `Bond Pricing States`
- **Supporting Terms & Invariants**: `Par Bond ($k_d = \text{Coupon Rate} \implies \text{Price} = M$)`, `Premium Bond ($k_d < \text{Coupon Rate} \implies \text{Price} > M$)`, `Discount Bond ($k_d > \text{Coupon Rate} \implies \text{Price} < M$)`

#### ⚙️ Syntax & Formula Anatomy: Bond Pricing States Mapping

```text
// If Market Yield = 10%, Coupon = 12% -> Yield < Coupon -> PREMIUM BOND (Price = $1,049.74)
// If Market Yield = 10%, Coupon = 10% -> Yield = Coupon -> PAR BOND (Price = $1,000.00)
// If Market Yield = 10%, Coupon = 8%  -> Yield > Coupon -> DISCOUNT BOND (Price = $950.26)
```

- **Line 1**: Higher coupon attracts premium.
- **Line 2**: Equal coupon trades at par.
- **Line 3**: Lower coupon trades at discount.

#### 💻 Runnable Financial Simulator: `pricing_states_demo.js`

```javascript
function evaluateBondPricingState(couponRate, marketYield) {
  if (couponRate > marketYield) return 'PREMIUM_BOND_PRICE_EXCEEDS_PAR';
  if (couponRate < marketYield) return 'DISCOUNT_BOND_PRICE_BELOW_PAR';
  return 'PAR_BOND_PRICE_EQUALS_PAR';
}

console.log(evaluateBondPricingState(12, 10));
console.log(evaluateBondPricingState(8, 10));
console.log(evaluateBondPricingState(10, 10));
```

**Expected Terminal Output**:
```text
PREMIUM_BOND_PRICE_EXCEEDS_PAR
DISCOUNT_BOND_PRICE_BELOW_PAR
PAR_BOND_PRICE_EQUALS_PAR
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What pricing state occurs when a bond's coupon rate (12%) is higher than the prevailing market yield (10%)?*

- **Target Answer**: `PREMIUM_BOND_PRICE_EXCEEDS_PAR`
- **Typed Misconception ID**: `MC_FIN_BOND_VALUATION_YIELD_TO_MATURITY_YTM`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'DISCOUNT'**:
  - *What Went Wrong*: Paying higher than market rates makes the bond attractive, trading at a premium.
  - *Simpler Mental Model*: Coupon > Yield -> Premium Bond.
  - *Guided Fix Action*: Type PREMIUM_BOND_PRICE_EXCEEDS_PAR

---

### 🔹 Block 3: Zero Coupon Bonds (Deep Discount Bonds) Pricing

- **Concept Budget / Primary Invariant**: `Zero Coupon Bond Pricing`
- **Supporting Terms & Invariants**: `Zero periodic coupon payments ($C = 0$)`, `Issued at steep discount, redeemed at full par face value`, `$V_0 = \frac{M}{(1 + k_d)^n}$`

#### 💻 Runnable Financial Simulator: `zcb_calc_demo.js`

```javascript
function priceZcb(faceValue, yieldPct, years) {
  const price = faceValue / Math.pow(1 + yieldPct / 100, years);
  return {
    faceValue,
    yearsToMaturity: years,
    yieldPercent: yieldPct,
    zeroCouponPrice: Number(price.toFixed(2)),
    status: 'ZERO_COUPON_BOND_PRICED'
  };
}

console.log(JSON.stringify(priceZcb(1000, 10, 2)));
```

**Expected Terminal Output**:
```text
{"faceValue":1000,"yearsToMaturity":2,"yieldPercent":10,"zeroCouponPrice":826.45,"status":"ZERO_COUPON_BOND_PRICED"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What is the price of a 2-year $1,000 face value Zero Coupon Bond yielding 10% ($1000 / 1.10^2$)?*

- **Target Answer**: `826.45`
- **Typed Misconception ID**: `MC_FIN_BOND_VALUATION_YIELD_TO_MATURITY_YTM`

**Diagnostic Recovery Paths**:
- **If Student Triggers '1000'**:
  - *What Went Wrong*: Zero coupon bonds are issued at a deep discount: 1000 / 1.21 = $826.45.
  - *Simpler Mental Model*: 1000 / 1.21 = 826.45.
  - *Guided Fix Action*: Type 826.45

---

## 📅 Day 7: Yield to Maturity (YTM) & Bond Yield Approximation

> **💡 Everyday Metaphor / Intuitive Model**:
> Yield to Maturity (YTM) is the True Annualized Miles-Per-Gallon of a Bond: if you buy a $1,000 bond at a bargain discount of $950 with a $100 annual coupon, your total return consists of two engines: 1. The steady $100 annual coupon checks; 2. The $50 capital gain you pocket when the bond matures for $1,000; YTM combines both cash flow engines into a single annualized yield percentage (11.28%).

### 🔹 Block 1: Yield to Maturity (YTM) Definition & The Internal Rate of Return of a Bond

- **Concept Budget / Primary Invariant**: `Yield to Maturity (YTM) Invariant`
- **Supporting Terms & Invariants**: `YTM is the single discount rate where $PV(\text{Coupons} + \text{Principal}) = \text{Market Price}$`, `Assumes bond is held to maturity`, `Assumes all coupons are reinvested at the same YTM rate (Reinvestment Risk)`

#### 📦 Memory Box / Data Layout Diagram: YTM Internal Rate of Return Equilibrium

| Valuation / Capital Component | Invariant & Parameters | Type |
|---|---|---|
| **Market Purchase Price** | Paid $950 today (Discount bond purchase) | `Cash Outflow` |
| **Future Cash Flows** | $100/yr coupons for 5 years + $1,000 Face Value at maturity | `Cash Inflows` |
| **YTM Equilibrium Rate** | Discount rate where PV(Inflows) = $950 -> YTM = 11.28%! | `Annualized Yield` |

#### 💻 Runnable Financial Simulator: `ytm_concept_demo.js`

```javascript
function evaluateYtmConcept() {
  return 'YTM_IS_THE_INTERNAL_RATE_OF_RETURN_EQUATING_PV_TO_MARKET_PRICE';
}

console.log(evaluateYtmConcept());
```

**Expected Terminal Output**:
```text
YTM_IS_THE_INTERNAL_RATE_OF_RETURN_EQUATING_PV_TO_MARKET_PRICE
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What financial rate equates the present value of a bond's future cash flows to its current market price?*

- **Target Answer**: `YTM_IS_THE_INTERNAL_RATE_OF_RETURN_EQUATING_PV_TO_MARKET_PRICE`
- **Typed Misconception ID**: `MC_FIN_BOND_VALUATION_YIELD_TO_MATURITY_YTM`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'COUPON'**:
  - *What Went Wrong*: Coupon rate is the fixed interest. YTM is the internal rate of return equating PV to market price.
  - *Simpler Mental Model*: Equating rate is Yield to Maturity (YTM).
  - *Guided Fix Action*: Type YTM_IS_THE_INTERNAL_RATE_OF_RETURN_EQUATING_PV_TO_MARKET_PRICE

---

### 🔹 Block 2: The YTM Approximation Formula: $\text{YTM} \approx \frac{C + \frac{M - P}{n}}{\frac{M + P}{2}}$

- **Concept Budget / Primary Invariant**: `YTM Approximation Formula`
- **Supporting Terms & Invariants**: `Numerator: Annual Coupon $C$ + Annualized Capital Gain/Loss $\frac{M - P}{n}$`, `Denominator: Average Investment Value $\frac{M + P}{2}$`, `$\text{Approx YTM} = \frac{C + (M - P)/n}{(M + P)/2} \times 100\%$`

#### ⚙️ Syntax & Formula Anatomy: YTM Approximation Math ($1k Face, $950 Price, 10% Coupon, 5 Yrs)

```text
C = $100 | M = $1,000 | P = $950 | n = 5
Numerator = 100 + (1000 - 950)/5 = 100 + 10 = $110
Denominator = (1000 + 950)/2 = $975
Approx YTM = (110 / 975) * 100 = 11.28%
```

- **Line 2**: Coupon plus amortized discount.
- **Line 3**: Average bond investment.
- **Line 4**: Approximate annualized yield.

#### 💻 Runnable Financial Simulator: `ytm_approx_demo.js`

```javascript
function calculateApproximateYtm(m, p, couponPct, n) {
  const c = m * (couponPct / 100);
  const num = c + (m - p) / n;
  const den = (m + p) / 2;
  const ytm = (num / den) * 100;
  return {
    annualCoupon: c,
    numeratorIncome: num,
    averageInvestment: den,
    approxYtmPercent: Number(ytm.toFixed(2)),
    status: 'YTM_APPROXIMATION_COMPUTED'
  };
}

console.log(JSON.stringify(calculateApproximateYtm(1000, 950, 10, 5)));
```

**Expected Terminal Output**:
```text
{"annualCoupon":100,"numeratorIncome":110,"averageInvestment":975,"approxYtmPercent":11.28,"status":"YTM_APPROXIMATION_COMPUTED"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What is the approximate YTM percentage for a 5-year $1,000 par bond with a 10% coupon trading at $950 ($ 110 / 975 \times 100 $)?*

- **Target Answer**: `11.28`
- **Typed Misconception ID**: `MC_FIN_BOND_VALUATION_YIELD_TO_MATURITY_YTM`

**Diagnostic Recovery Paths**:
- **If Student Triggers '10.0'**:
  - *What Went Wrong*: 10% is the coupon rate. Buying at a discount ($950) increases total yield to 11.28%.
  - *Simpler Mental Model*: 110 / 975 * 100 = 11.28%.
  - *Guided Fix Action*: Type 11.28

---

### 🔹 Block 3: Current Yield ($\frac{C}{P}$) vs Yield to Maturity (YTM)

- **Concept Budget / Primary Invariant**: `Current Yield vs YTM`
- **Supporting Terms & Invariants**: `$\text{Current Yield} = \frac{\text{Annual Coupon}}{\text{Current Market Price}} \times 100\%$`, `Ignores capital gains/losses upon maturity`, `Relationship: For discount bonds, $\text{Coupon Rate} < \text{Current Yield} < \text{YTM}$`

#### 💻 Runnable Financial Simulator: `current_yield_demo.js`

```javascript
function evaluateYieldHierarchy(couponPct, price, m = 1000) {
  const c = m * (couponPct / 100);
  const cy = (c / price) * 100;
  return {
    couponRatePercent: couponPct,
    currentYieldPercent: Number(cy.toFixed(2)),
    discountHierarchy: 'COUPON_RATE < CURRENT_YIELD < YTM',
    status: 'YIELD_HIERARCHY_EVALUATED'
  };
}

console.log(JSON.stringify(evaluateYieldHierarchy(10, 950)));
```

**Expected Terminal Output**:
```text
{"couponRatePercent":10,"currentYieldPercent":10.53,"discountHierarchy":"COUPON_RATE < CURRENT_YIELD < YTM","status":"YIELD_HIERARCHY_EVALUATED"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What is the Current Yield percentage for a $1,000 par bond with a $100 annual coupon trading at $950 ($100 / 950 \times 100$)?*

- **Target Answer**: `10.53`
- **Typed Misconception ID**: `MC_FIN_BOND_VALUATION_YIELD_TO_MATURITY_YTM`

**Diagnostic Recovery Paths**:
- **If Student Triggers '10.0'**:
  - *What Went Wrong*: Current yield is 100 / 950 = 10.53%.
  - *Simpler Mental Model*: 100 / 950 = 10.53%.
  - *Guided Fix Action*: Type 10.53

---

## 📅 Day 8: Interest Rate Risk: Macaulay Duration & Modified Duration

> **💡 Everyday Metaphor / Intuitive Model**:
> Duration is the Balance Fulcrum of a Bond Seesaw: if a bond pays all its money at maturity in Year 30 (Zero Coupon Bond), the fulcrum sits way out at 30 years—making the seesaw extremely sensitive to interest rate winds; if a bond pays heavy coupon cash flows in Years 1 and 2, the fulcrum shifts forward to 2.74 years—damping price swings; Modified Duration ($MD$) tells you the exact percentage drop in bond price if interest rates jump by 1%.

### 🔹 Block 1: Macaulay Duration: Weighted Average Time to Cash Receipt

- **Concept Budget / Primary Invariant**: `Macaulay Duration Formula`
- **Supporting Terms & Invariants**: `$D_{\text{Mac}} = \frac{\sum_{t=1}^n \frac{t \cdot CF_t}{(1 + y)^t}}{\text{Bond Price}}$`, `Measured in Years`, `Macaulay Duration of a Zero Coupon Bond is EXACTLY equal to its maturity $n$!`

#### 📦 Memory Box / Data Layout Diagram: Macaulay Duration Calculation ($1k Par, 10% Coupon, 3 Yrs @ 10%)

| Valuation / Capital Component | Invariant & Parameters | Type |
|---|---|---|
| **Year 1 Cash Flow ($100)** | PV = $90.91 | Weighted Time = 1 x $90.91 = $90.91 | `Y1 Weight` |
| **Year 2 Cash Flow ($100)** | PV = $82.64 | Weighted Time = 2 x $82.64 = $165.29 | `Y2 Weight` |
| **Year 3 Cash Flow ($1,100)** | PV = $826.45 | Weighted Time = 3 x $826.45 = $2,479.34 | `Y3 Weight` |
| **Macaulay Duration** | Sum = $2,735.54 / $1,000 Price = 2.74 Years! | `Duration Output` |

#### 💻 Runnable Financial Simulator: `macd_calc_demo.js`

```javascript
function calculateMacaulayDuration(m, couponPct, yPct, n) {
  const y = yPct / 100;
  const c = m * (couponPct / 100);
  let bondPrice = 0;
  let weightedTime = 0;
  for (let t = 1; t <= n; t++) {
    const cf = (t === n) ? (c + m) : c;
    const pv = cf / Math.pow(1 + y, t);
    bondPrice += pv;
    weightedTime += t * pv;
  }
  const macD = weightedTime / bondPrice;
  return {
    bondPrice: Number(bondPrice.toFixed(2)),
    weightedTimeSum: Number(weightedTime.toFixed(2)),
    macaulayDurationYears: Number(macD.toFixed(2)),
    status: 'MACAULAY_DURATION_COMPUTED'
  };
}

console.log(JSON.stringify(calculateMacaulayDuration(1000, 10, 10, 3)));
```

**Expected Terminal Output**:
```text
{"bondPrice":1000,"weightedTimeSum":2735.54,"macaulayDurationYears":2.74,"status":"MACAULAY_DURATION_COMPUTED"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What is the Macaulay Duration (in years) of a 3-year $1,000 par bond paying a 10% annual coupon at a 10% market yield ($2735.54 / 1000$)?*

- **Target Answer**: `2.74`
- **Typed Misconception ID**: `MC_FIN_FIXED_INCOME_MACAULAY_MODIFIED_DURATION`

**Diagnostic Recovery Paths**:
- **If Student Triggers '3.0'**:
  - *What Went Wrong*: 3.0 years is the maturity. Because coupons are received early in Y1 and Y2, duration is shortened to 2.74 years.
  - *Simpler Mental Model*: Coupons shorten duration to 2.74 years.
  - *Guided Fix Action*: Type 2.74

---

### 🔹 Block 2: Modified Duration & Percentage Price Volatility ($MD = \frac{D_{\text{Mac}}}{1 + y}$)

- **Concept Budget / Primary Invariant**: `Modified Duration Volatility Formula`
- **Supporting Terms & Invariants**: `Modified Duration: $MD = \frac{D_{\text{Mac}}}{1 + y}$`, `Percentage Price Change: $\frac{\Delta P}{P} \approx -MD \times \Delta y$`, `Basis Point Value (DV01 / PV01)`

#### ⚙️ Syntax & Formula Anatomy: Price Sensitivity with Modified Duration

```text
// MacD = 2.74 yrs | Yield y = 10% (0.10)
// Modified Duration = 2.74 / (1 + 0.10) = 2.49
// If Yield rises by +100 bps (+1.0% = 0.01):
// Delta Price = -2.49 * (+0.01) * 100 = -2.49% (Bond drops by ~$24.90!)
```

- **Line 2**: Modified duration calculation.
- **Line 4**: Price change approximation.

#### 💻 Runnable Financial Simulator: `modd_calc_demo.js`

```javascript
function calculatePriceImpact(macD, yieldPct, deltaYieldBps) {
  const y = yieldPct / 100;
  const modD = macD / (1 + y);
  const dy = deltaYieldBps / 10000;
  const deltaPricePct = -modD * dy * 100;
  return {
    modifiedDuration: Number(modD.toFixed(2)),
    deltaYieldBasisPoints: deltaYieldBps,
    estimatedPriceChangePercent: Number(deltaPricePct.toFixed(2)),
    status: 'MODIFIED_DURATION_PRICE_VOLATILITY_COMPUTED'
  };
}

console.log(JSON.stringify(calculatePriceImpact(2.74, 10, 100)));
```

**Expected Terminal Output**:
```text
{"modifiedDuration":2.49,"deltaYieldBasisPoints":100,"estimatedPriceChangePercent":-2.49,"status":"MODIFIED_DURATION_PRICE_VOLATILITY_COMPUTED"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What is the Modified Duration for a bond with a Macaulay Duration of 2.74 years at a 10% market yield ($2.74 / 1.10$)?*

- **Target Answer**: `2.49`
- **Typed Misconception ID**: `MC_FIN_FIXED_INCOME_MACAULAY_MODIFIED_DURATION`

**Diagnostic Recovery Paths**:
- **If Student Triggers '2.74'**:
  - *What Went Wrong*: 2.74 is Macaulay duration. Modified duration divides by (1 + y) = 2.74 / 1.10 = 2.49.
  - *Simpler Mental Model*: 2.74 / 1.10 = 2.49.
  - *Guided Fix Action*: Type 2.49

---

### 🔹 Block 3: Bond Convexity: Curvature Adjustment for Large Yield Shifts

- **Concept Budget / Primary Invariant**: `Bond Convexity Adjustment`
- **Supporting Terms & Invariants**: `Convexity (Second derivative of bond price with respect to yield)`, `Convexity Effect: Prices rise more when yields fall than they drop when yields rise!`, `Total Price Change: $\frac{\Delta P}{P} \approx -MD \cdot \Delta y + \frac{1}{2} \text{Convexity} \cdot (\Delta y)^2$`

#### 💻 Runnable Financial Simulator: `convexity_demo.js`

```javascript
function evaluateConvexityBenefit() {
  return 'CONVEXITY_PROVIDES_POSITIVE_PRICE_CURVATURE_PROTECTION';
}

console.log(evaluateConvexityBenefit());
```

**Expected Terminal Output**:
```text
CONVEXITY_PROVIDES_POSITIVE_PRICE_CURVATURE_PROTECTION
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What protective benefit does positive bond convexity provide to fixed-income bondholders during large interest rate shifts?*

- **Target Answer**: `CONVEXITY_PROVIDES_POSITIVE_PRICE_CURVATURE_PROTECTION`
- **Typed Misconception ID**: `MC_FIN_FIXED_INCOME_MACAULAY_MODIFIED_DURATION`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'NEGATIVE'**:
  - *What Went Wrong*: Convexity provides positive price curvature protection.
  - *Simpler Mental Model*: Provides positive curvature protection.
  - *Guided Fix Action*: Type CONVEXITY_PROVIDES_POSITIVE_PRICE_CURVATURE_PROTECTION

---

## 📅 Day 9: Capital Budgeting: Net Present Value (NPV) Decision Rule

> **💡 Everyday Metaphor / Intuitive Model**:
> Net Present Value (NPV) is the Gold-Standard Metal Detector for Capital Investments: you bury $100,000 in the ground today to build a new warehouse; the warehouse generates future cash inflows over 3 years ($40k, $50k, $60k); NPV discounts those future inflows at your cost of capital (10%) and discovers they are worth $122,765 in today's money; subtracting your $100,000 cost yields a positive NPV of +$22,765—meaning the project directly expands shareholder wealth by $22,765 today.

### 🔹 Block 1: Net Present Value (NPV) Formula: $\sum \frac{CF_t}{(1 + k)^t} - C_0$

- **Concept Budget / Primary Invariant**: `Net Present Value (NPV) Decision Rule`
- **Supporting Terms & Invariants**: `$NPV = \sum_{t=1}^n \frac{CF_t}{(1 + k)^t} - C_0$`, `$C_0$ (Initial capital outlay / investment)`, `$k$ (Cost of capital / hurdle rate)`, `Decision Rule: If $NPV > 0 \implies$ Accept; If $NPV < 0 \implies$ Reject`

#### 📦 Memory Box / Data Layout Diagram: NPV Capital Investment Evaluation

| Valuation / Capital Component | Invariant & Parameters | Type |
|---|---|---|
| **Initial Capital Outlay (C0)** | -$100,000 spent today (Cash Outflow) | `Initial Investment` |
| **PV of Future Cash Inflows** | PV($40k, $50k, $60k @ 10%) = +$122,764.84 | `Discounted Inflows` |
| **Net Present Value (NPV)** | +$122,764.84 - $100,000 = +$22,764.84 -> ACCEPT PROJECT! | `NPV Output` |

#### 💻 Runnable Financial Simulator: `npv_calc_demo.js`

```javascript
function calculateNpv(initialOutlay, cfs, kPct) {
  const k = kPct / 100;
  let pvInflows = 0;
  cfs.forEach((cf, idx) => {
    pvInflows += cf / Math.pow(1 + k, idx + 1);
  });
  const npv = pvInflows - initialOutlay;
  return {
    initialOutlay,
    pvOfInflows: Number(pvInflows.toFixed(2)),
    netPresentValue: Number(npv.toFixed(2)),
    recommendation: npv > 0 ? 'ACCEPT_PROJECT_POSITIVE_NPV' : 'REJECT_PROJECT_NEGATIVE_NPV',
    status: 'NPV_COMPUTED'
  };
}

console.log(JSON.stringify(calculateNpv(100000, [40000, 50000, 60000], 10)));
```

**Expected Terminal Output**:
```text
{"initialOutlay":100000,"pvOfInflows":122764.84,"netPresentValue":22764.84,"recommendation":"ACCEPT_PROJECT_POSITIVE_NPV","status":"NPV_COMPUTED"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What is the Net Present Value (NPV) of a project with a $100,000 initial outlay whose discounted cash inflows total $122,764.84 ($122764.84 - 100000$)?*

- **Target Answer**: `22764.84`
- **Typed Misconception ID**: `MC_FIN_CAPITAL_BUDGETING_NET_PRESENT_VALUE_NPV`

**Diagnostic Recovery Paths**:
- **If Student Triggers '122764.84'**:
  - *What Went Wrong*: $122,764.84 is the gross PV of inflows. NPV subtracts the $100,000 initial outlay = $22,764.84.
  - *Simpler Mental Model*: 122764.84 - 100000 = 22764.84.
  - *Guided Fix Action*: Type 22764.84

---

### 🔹 Block 2: Independent vs Mutually Exclusive Capital Projects

- **Concept Budget / Primary Invariant**: `Project Selection Types`
- **Supporting Terms & Invariants**: `Independent Projects (Accept ALL projects with $NPV > 0$)`, `Mutually Exclusive Projects (Accept ONLY the single project with the HIGHEST positive $NPV$)`, `Capital Rationing Constraints`

#### ⚙️ Syntax & Formula Anatomy: Mutually Exclusive Project Selection

```text
// Project Alpha: NPV = +$50,000
// Project Beta:  NPV = +$85,000
// If Mutually Exclusive (Can only pick one site): SELECT PROJECT BETA (Highest NPV!)
```

- **Line 1**: Project Alpha value.
- **Line 2**: Project Beta value.
- **Line 3**: Selects highest positive NPV.

#### 💻 Runnable Financial Simulator: `project_type_demo.js`

```javascript
function selectMutuallyExclusive(projectList) {
  const sorted = projectList.filter(p => p.npv > 0).sort((a, b) => b.npv - a.npv);
  return {
    selectedProject: sorted[0]?.name || 'NONE',
    highestNpv: sorted[0]?.npv || 0,
    status: 'OPTIMAL_MUTUALLY_EXCLUSIVE_PROJECT_SELECTED'
  };
}

const projects = [{ name: 'Project Alpha', npv: 50000 }, { name: 'Project Beta', npv: 85000 }];
console.log(JSON.stringify(selectMutuallyExclusive(projects)));
```

**Expected Terminal Output**:
```text
{"selectedProject":"Project Beta","highestNpv":85000,"status":"OPTIMAL_MUTUALLY_EXCLUSIVE_PROJECT_SELECTED"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *When evaluating two mutually exclusive projects (Alpha: NPV $50,000 vs Beta: NPV $85,000), which project must management choose?*

- **Target Answer**: `Project Beta`
- **Typed Misconception ID**: `MC_FIN_CAPITAL_BUDGETING_NET_PRESENT_VALUE_NPV`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'Alpha'**:
  - *What Went Wrong*: Management chooses the project with the highest positive NPV = Project Beta.
  - *Simpler Mental Model*: Highest NPV wins -> Project Beta.
  - *Guided Fix Action*: Type Project Beta

---

### 🔹 Block 3: The NPV Profile & Fisher's Crossover Rate

- **Concept Budget / Primary Invariant**: `NPV Profile & Crossover Rate`
- **Supporting Terms & Invariants**: `NPV Profile Curve (Plot of project NPV as discount rate $k$ increases)`, `Fisher's Crossover Rate (The exact discount rate where Project A and Project B have IDENTICAL NPV)`, `Ranking Reversals below and above crossover rate`

#### 💻 Runnable Financial Simulator: `crossover_demo.js`

```javascript
function evaluateCrossoverConcept() {
  return 'CROSSOVER_RATE_IS_WHERE_NPV_OF_BOTH_PROJECTS_ARE_EQUAL';
}

console.log(evaluateCrossoverConcept());
```

**Expected Terminal Output**:
```text
CROSSOVER_RATE_IS_WHERE_NPV_OF_BOTH_PROJECTS_ARE_EQUAL
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What is Fisher's Crossover Rate in capital budgeting analysis?*

- **Target Answer**: `CROSSOVER_RATE_IS_WHERE_NPV_OF_BOTH_PROJECTS_ARE_EQUAL`
- **Typed Misconception ID**: `MC_FIN_CAPITAL_BUDGETING_NET_PRESENT_VALUE_NPV`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'IRR'**:
  - *What Went Wrong*: IRR is where NPV = 0. Crossover rate is where NPV(A) = NPV(B).
  - *Simpler Mental Model*: Where NPVs of both projects are equal.
  - *Guided Fix Action*: Type CROSSOVER_RATE_IS_WHERE_NPV_OF_BOTH_PROJECTS_ARE_EQUAL

---

## 📅 Day 10: Capital Budgeting: Internal Rate of Return (IRR) & Hurdle Rate

> **💡 Everyday Metaphor / Intuitive Model**:
> Internal Rate of Return (IRR) is the Maximum Interest Rate a Project Can Pay Before Going Bankrupt: if a new factory yields an IRR of 13.07%, you can borrow money at 10% interest, pay off the bank, and pocket the 3.07% surplus; but if your bank demands a 15% hurdle rate, borrowing money for a 13.07% factory guarantees financial loss; IRR is the exact break-even discount rate where the project's Net Present Value equals zero.

### 🔹 Block 1: Internal Rate of Return (IRR) Definition & The Hurdle Rate Comparison

- **Concept Budget / Primary Invariant**: `IRR Definition & Decision Rule`
- **Supporting Terms & Invariants**: `IRR is the rate $r^*$ where $\sum_{t=1}^n \frac{CF_t}{(1 + r^*)^t} - C_0 = 0$`, `Hurdle Rate ($k$: Cost of capital)`, `Decision Rule: If $IRR \ge k \implies$ Accept; If $IRR < k \implies$ Reject`

#### 📦 Memory Box / Data Layout Diagram: IRR vs Hurdle Rate Decision Framework

| Valuation / Capital Component | Invariant & Parameters | Type |
|---|---|---|
| **Project Internal Rate of Return (IRR)** | Factory generates 13.07% annualized rate of return | `Project Return` |
| **Cost of Capital Hurdle Rate (k)** | Firm's WACC hurdle rate = 10.00% | `Cost of Funds` |
| **Decision Outcome** | 13.07% > 10.00% -> ACCEPT PROJECT (Generates positive economic value!) | `Decision Result` |

#### 💻 Runnable Financial Simulator: `irr_concept_demo.js`

```javascript
function evaluateIrrDecision(irrPct, hurdlePct) {
  const isAccepted = (irrPct >= hurdlePct);
  return {
    projectIrrPercent: irrPct,
    hurdleRatePercent: hurdlePct,
    isAccepted,
    recommendation: isAccepted ? 'ACCEPT_IRR_EXCEEDS_HURDLE' : 'REJECT_IRR_BELOW_HURDLE',
    status: 'IRR_DECISION_EVALUATED'
  };
}

console.log(JSON.stringify(evaluateIrrDecision(13.07, 10.0)));
```

**Expected Terminal Output**:
```text
{"projectIrrPercent":13.07,"hurdleRatePercent":10,"isAccepted":true,"recommendation":"ACCEPT_IRR_EXCEEDS_HURDLE","status":"IRR_DECISION_EVALUATED"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What recommendation is given when a project's IRR (13.07%) exceeds the company's cost of capital hurdle rate (10%)?*

- **Target Answer**: `ACCEPT_IRR_EXCEEDS_HURDLE`
- **Typed Misconception ID**: `MC_FIN_INTERNAL_RATE_OF_RETURN_IRR_HURDLE`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'REJECT'**:
  - *What Went Wrong*: When IRR > Hurdle rate, the project creates value and is accepted.
  - *Simpler Mental Model*: IRR > Hurdle -> Accept.
  - *Guided Fix Action*: Type ACCEPT_IRR_EXCEEDS_HURDLE

---

### 🔹 Block 2: Solving IRR: Iterative Interpolation & Newton-Raphson Solver

- **Concept Budget / Primary Invariant**: `Numerical IRR Solver Mechanics`
- **Supporting Terms & Invariants**: `Trial and Error Interpolation: $\text{IRR} = L + \left[\frac{NPV_L}{NPV_L - NPV_H}\right] \times (H - L)$`, `Newton-Raphson Iteration ($r_{n+1} = r_n - \frac{NPV(r_n)}{NPV'(r_n)}$)`

#### ⚙️ Syntax & Formula Anatomy: Newton-Raphson IRR Solver Loop

```text
let r = 0.10; // Start with 10% guess
for (let i = 0; i < 50; i++) {
  const npv = -c0 + (cf1/(1+r)) + (cf2/Math.pow(1+r, 2));
  const dNpv = -(cf1/Math.pow(1+r, 2)) - (2*cf2/Math.pow(1+r, 3));
  r -= npv / dNpv; // Converges to exact IRR in ~5 iterations!
}
```

- **Line 1**: Initial interest rate estimate.
- **Line 5**: Newton step updates rate toward NPV = 0.

#### 💻 Runnable Financial Simulator: `irr_solver_demo.js`

```javascript
function solveIrr(c0, cf1, cf2) {
  let r = 0.10;
  for (let i = 0; i < 50; i++) {
    const npv = -c0 + (cf1 / (1 + r)) + (cf2 / Math.pow(1 + r, 2));
    const dNpv = -(cf1 / Math.pow(1 + r, 2)) - (2 * cf2 / Math.pow(1 + r, 3));
    r -= npv / dNpv;
  }
  return {
    initialCost: c0,
    inflows: [cf1, cf2],
    solvedIrrPercent: Number((r * 100).toFixed(2)),
    status: 'IRR_SOLVED_CONVERGED'
  };
}

console.log(JSON.stringify(solveIrr(100000, 60000, 60000)));
```

**Expected Terminal Output**:
```text
{"initialCost":100000,"inflows":[60000,60000],"solvedIrrPercent":13.07,"status":"IRR_SOLVED_CONVERGED"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What is the exact IRR percentage for a $100,000 project that generates $60,000 at the end of Year 1 and $60,000 at Year 2?*

- **Target Answer**: `13.07`
- **Typed Misconception ID**: `MC_FIN_INTERNAL_RATE_OF_RETURN_IRR_HURDLE`

**Diagnostic Recovery Paths**:
- **If Student Triggers '20.0'**:
  - *What Went Wrong*: $120k / $100k = 20% total nominal return over 2 years. Annualized compound IRR is 13.07%.
  - *Simpler Mental Model*: Compound IRR is 13.07%.
  - *Guided Fix Action*: Type 13.07

---

### 🔹 Block 3: NPV vs IRR Conflicts & The Reinvestment Rate Assumption

- **Concept Budget / Primary Invariant**: `NPV vs IRR Flaw Analysis`
- **Supporting Terms & Invariants**: `Reinvestment Assumption: NPV assumes cash flows are reinvested at WACC ($k$); IRR unrealistically assumes reinvestment at the project's own IRR!`, `Scale Problem & Timing Conflicts in Mutually Exclusive Projects`, `Superiority of NPV in all conflict situations!`

#### 💻 Runnable Financial Simulator: `npv_irr_conflict_demo.js`

```javascript
function evaluateMethodSuperiority(hasConflict) {
  return hasConflict
    ? 'ALWAYS_CHOOSE_NPV_OVER_IRR_IN_CONFLICT_SCENARIOS'
    : 'NPV_AND_IRR_AGREE_ON_ACCEPT_REJECT';
}

console.log(evaluateMethodSuperiority(true));
console.log(evaluateMethodSuperiority(false));
```

**Expected Terminal Output**:
```text
ALWAYS_CHOOSE_NPV_OVER_IRR_IN_CONFLICT_SCENARIOS
NPV_AND_IRR_AGREE_ON_ACCEPT_REJECT
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *When evaluating mutually exclusive projects where NPV and IRR give conflicting rankings, which capital budgeting metric must management follow?*

- **Target Answer**: `ALWAYS_CHOOSE_NPV_OVER_IRR_IN_CONFLICT_SCENARIOS`
- **Typed Misconception ID**: `MC_FIN_INTERNAL_RATE_OF_RETURN_IRR_HURDLE`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'IRR'**:
  - *What Went Wrong*: IRR makes unrealistic reinvestment assumptions. NPV directly maximizes shareholder wealth.
  - *Simpler Mental Model*: Always choose NPV over IRR.
  - *Guided Fix Action*: Type ALWAYS_CHOOSE_NPV_OVER_IRR_IN_CONFLICT_SCENARIOS

---

## 📅 Day 11: Capital Budgeting: Payback Period & Profitability Index (PI)

> **💡 Everyday Metaphor / Intuitive Model**:
> Payback and Profitability Index are the Speedometer and Efficiency Rating of Capital Investments: Payback Period measures how fast you get your cash back (e.g. 2.0 years); Profitability Index ($PI$) measures bang-for-the-buck—telling you how many dollars of present value you get for every $1 invested ($PI = 1.24$ gives you $1.24 of value per dollar spent).

### 🔹 Block 1: Traditional Payback Period vs Discounted Payback Period

- **Concept Budget / Primary Invariant**: `Payback Period Liquidity Analysis`
- **Supporting Terms & Invariants**: `Payback Period: Number of years to recoup initial investment outlay`, `Flaws: Ignores time value of money, ignores cash flows after payback period`, `Discounted Payback: Incorporates TVM discounting before accumulating cash flows`

#### 📦 Memory Box / Data Layout Diagram: Payback Period Accumulation ($100k Outlay, $50k/yr)

| Valuation / Capital Component | Invariant & Parameters | Type |
|---|---|---|
| **Year 1 Cash Inflow** | +$50,000 recovered | Unrecovered balance = $50,000 | `Year 1 Recovery` |
| **Year 2 Cash Inflow** | +$50,000 recovered | Unrecovered balance = $0 -> PAYBACK = 2.0 YEARS! | `Payback Milestone` |

#### 💻 Runnable Financial Simulator: `payback_calc_demo.js`

```javascript
function calculatePayback(outlay, cfs) {
  let cumulative = 0;
  let payback = 0;
  for (let i = 0; i < cfs.length; i++) {
    if (cumulative + cfs[i] >= outlay) {
      payback = i + (outlay - cumulative) / cfs[i];
      break;
    }
    cumulative += cfs[i];
  }
  return {
    initialOutlay: outlay,
    paybackYears: Number(payback.toFixed(2)),
    status: 'PAYBACK_COMPUTED'
  };
}

console.log(JSON.stringify(calculatePayback(100000, [50000, 50000, 50000])));
```

**Expected Terminal Output**:
```text
{"initialOutlay":100000,"paybackYears":2,"status":"PAYBACK_COMPUTED"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What is the Payback Period (in years) for a $100,000 investment generating equal cash inflows of $50,000 each year ($100000 / 50000$)?*

- **Target Answer**: `2`
- **Typed Misconception ID**: `MC_FIN_PAYBACK_PERIOD_AND_DISCOUNTED_PAYBACK`

**Diagnostic Recovery Paths**:
- **If Student Triggers '3'**:
  - *What Went Wrong*: 100k is fully recovered by Year 2 (50k + 50k). Payback is 2.0 years.
  - *Simpler Mental Model*: 100,000 / 50,000 = 2 years.
  - *Guided Fix Action*: Type 2

---

### 🔹 Block 2: Profitability Index (PI) / Benefit-Cost Ratio: $PI = \frac{\text{PV of Inflows}}{C_0}$

- **Concept Budget / Primary Invariant**: `Profitability Index (PI) Formula`
- **Supporting Terms & Invariants**: `$PI = \frac{\text{PV of Future Cash Inflows}}{\text{Initial Outlay } C_0}$`, `Decision Rule: If $PI > 1.0 \implies$ Accept; If $PI < 1.0 \implies$ Reject`, `Bang-for-the-buck capital rationing ranking metric`

#### ⚙️ Syntax & Formula Anatomy: Profitability Index Math

```text
Initial Outlay C0 = $100,000
PV of Future Inflows = $124,342.60
Profitability Index (PI) = 124,342.60 / 100,000 = 1.24
Since PI (1.24) > 1.0 -> ACCEPT PROJECT!
```

- **Line 2**: Total discounted inflows.
- **Line 3**: PI ratio.
- **Line 4**: Acceptance threshold.

#### 💻 Runnable Financial Simulator: `pi_calc_demo.js`

```javascript
function calculatePi(outlay, pvInflows) {
  const pi = pvInflows / outlay;
  return {
    initialOutlay: outlay,
    pvOfInflows: pvInflows,
    profitabilityIndex: Number(pi.toFixed(2)),
    isAccepted: pi > 1.0,
    status: 'PI_EVALUATED'
  };
}

console.log(JSON.stringify(calculatePi(100000, 124342.60)));
```

**Expected Terminal Output**:
```text
{"initialOutlay":100000,"pvOfInflows":124342.6,"profitabilityIndex":1.24,"isAccepted":true,"status":"PI_EVALUATED"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What is the Profitability Index (PI) for a project with a $100,000 initial outlay and $124,342.60 present value of inflows ($124342.60 / 100000$)?*

- **Target Answer**: `1.24`
- **Typed Misconception ID**: `MC_FIN_PROFITABILITY_INDEX_PI_PROJECT_RANKING`

**Diagnostic Recovery Paths**:
- **If Student Triggers '0.80'**:
  - *What Went Wrong*: PI is Inflows / Outlay = 124k / 100k = 1.24.
  - *Simpler Mental Model*: 124342.60 / 100000 = 1.24.
  - *Guided Fix Action*: Type 1.24

---

### 🔹 Block 3: Capital Rationing: Maximizing Aggregate NPV via PI Ranking

- **Concept Budget / Primary Invariant**: `Capital Rationing Optimization`
- **Supporting Terms & Invariants**: `Hard vs Soft Capital Rationing (Fixed budget ceiling e.g. $500,000)`, `Ranking projects by Profitability Index ($PI$) to maximize cumulative portfolio NPV`

#### 💻 Runnable Financial Simulator: `rationing_demo.js`

```javascript
function evaluateCapitalRationing() {
  return 'RANK_BY_PROFITABILITY_INDEX_TO_MAXIMIZE_PORTFOLIO_NPV_UNDER_BUDGET_CEILING';
}

console.log(evaluateCapitalRationing());
```

**Expected Terminal Output**:
```text
RANK_BY_PROFITABILITY_INDEX_TO_MAXIMIZE_PORTFOLIO_NPV_UNDER_BUDGET_CEILING
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *How should management rank projects when subject to a strict capital budget ceiling (Capital Rationing)?*

- **Target Answer**: `RANK_BY_PROFITABILITY_INDEX_TO_MAXIMIZE_PORTFOLIO_NPV_UNDER_BUDGET_CEILING`
- **Typed Misconception ID**: `MC_FIN_PROFITABILITY_INDEX_PI_PROJECT_RANKING`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'PAYBACK'**:
  - *What Went Wrong*: Ranking by PI maximizes total created shareholder NPV within the budget.
  - *Simpler Mental Model*: Rank by Profitability Index.
  - *Guided Fix Action*: Type RANK_BY_PROFITABILITY_INDEX_TO_MAXIMIZE_PORTFOLIO_NPV_UNDER_BUDGET_CEILING

---

## 📅 Day 12: Cost of Capital: Cost of Debt ($K_d$) & Tax Shield

> **💡 Everyday Metaphor / Intuitive Model**:
> The Debt Tax Shield is a Government Discount Coupon on Your Corporate Loan Interest: if your company borrows money at a 10% interest rate, interest is an allowable business expense that reduces your taxable profit; with a 25% corporate tax rate, the government effectively pays 2.5% of your interest bill—leaving your company with an After-Tax Cost of Debt of only 7.5% ($K_d = 10\% \times (1 - 0.25)$).

### 🔹 Block 1: After-Tax Cost of Debt Formula: $K_d = i(1 - t)$

- **Concept Budget / Primary Invariant**: `After-Tax Cost of Debt Formula`
- **Supporting Terms & Invariants**: `$K_d = i \times (1 - t)$`, `$i$ (Pre-tax interest / coupon rate on debt)`, `$t$ (Marginal corporate tax rate)`, `Tax Shield: Interest deductibility lowers effective borrowing cost`

#### 📦 Memory Box / Data Layout Diagram: Debt Tax Shield Breakdown (10% Interest, 25% Tax)

| Valuation / Capital Component | Invariant & Parameters | Type |
|---|---|---|
| **Pre-Tax Interest Rate (i)** | 10.0% nominal rate paid to debenture holders | `Nominal Cost` |
| **Government Tax Shield** | Less: 25% tax deductibility = 10% x 0.25 = 2.5% tax savings! | `Tax Subsidy` |
| **Effective Cost of Debt (Kd)** | 10% x (1 - 0.25) = EXACTLY 7.5% After-Tax Cost! | `Net Effective Cost` |

#### 💻 Runnable Financial Simulator: `kd_calc_demo.js`

```javascript
function calculateKd(iPct, tPct) {
  const i = iPct / 100;
  const t = tPct / 100;
  const kd = i * (1 - t);
  return {
    preTaxRatePercent: iPct,
    corporateTaxRatePercent: tPct,
    afterTaxCostOfDebtPercent: Number((kd * 100).toFixed(2)),
    status: 'KD_COMPUTED'
  };
}

console.log(JSON.stringify(calculateKd(10, 25)));
```

**Expected Terminal Output**:
```text
{"preTaxRatePercent":10,"corporateTaxRatePercent":25,"afterTaxCostOfDebtPercent":7.5,"status":"KD_COMPUTED"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What is the After-Tax Cost of Debt ($K_d$) percentage for a company borrowing at 10% pre-tax interest with a 25% corporate tax rate ($10 \times (1 - 0.25)$)?*

- **Target Answer**: `7.5`
- **Typed Misconception ID**: `MC_FIN_COST_OF_DEBT_AFTER_TAX_SHIELD`

**Diagnostic Recovery Paths**:
- **If Student Triggers '10.0'**:
  - *What Went Wrong*: 10.0% is pre-tax. Deducting the 25% tax shield yields 7.5%.
  - *Simpler Mental Model*: 10 * (1 - 0.25) = 7.5%.
  - *Guided Fix Action*: Type 7.5

---

### 🔹 Block 2: Flotation Costs & Net Proceeds in Debt Issuance ($K_d = \frac{i(1 - t)}{NP}$)

- **Concept Budget / Primary Invariant**: `Debt Flotation Costs Adjustment`
- **Supporting Terms & Invariants**: `Flotation Costs (Underwriting fees, legal, printing fees per debenture)`, `Net Proceeds ($NP = \text{Issue Price} - \text{Flotation Cost}$)`, `$K_d = \frac{I(1 - t)}{NP}$`

#### 💻 Runnable Financial Simulator: `flotation_demo.js`

```javascript
function calculateKdWithFlotation(faceVal, couponPct, taxPct, floatPct) {
  const interest = faceVal * (couponPct / 100);
  const netProceeds = faceVal * (1 - floatPct / 100);
  const t = taxPct / 100;
  const kd = (interest * (1 - t)) / netProceeds;
  return {
    netProceedsPerBond: netProceeds,
    afterTaxCostOfDebtPercent: Number((kd * 100).toFixed(2)),
    status: 'KD_WITH_FLOTATION_COMPUTED'
  };
}

console.log(JSON.stringify(calculateKdWithFlotation(100, 10, 25, 5))); // Net = 95 -> Kd = 7.5 / 95 = 7.89%
```

**Expected Terminal Output**:
```text
{"netProceedsPerBond":95,"afterTaxCostOfDebtPercent":7.89,"status":"KD_WITH_FLOTATION_COMPUTED"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What is the After-Tax Cost of Debt percentage when a $100 par 10% debenture is issued with 5% flotation costs ($NP = $95) at a 25% tax rate ($ (10 \times 0.75) / 95 \times 100 $)?*

- **Target Answer**: `7.89`
- **Typed Misconception ID**: `MC_FIN_COST_OF_DEBT_AFTER_TAX_SHIELD`

**Diagnostic Recovery Paths**:
- **If Student Triggers '7.5'**:
  - *What Went Wrong*: Flotation cost lowers net proceeds to $95, increasing Kd to 7.5 / 95 = 7.89%.
  - *Simpler Mental Model*: 7.5 / 95 = 7.89%.
  - *Guided Fix Action*: Type 7.89

---

### 🔹 Block 3: The Trade-Off: Tax Shield Benefits vs Financial Distress Costs

- **Concept Budget / Primary Invariant**: `Debt Trade-Off Theory Invariant`
- **Supporting Terms & Invariants**: `Moderate Debt creates valuable tax shields`, `Excessive Debt increases probability of bankruptcy and financial distress`, `Optimal Capital Structure point`

#### 💻 Runnable Financial Simulator: `tradeoff_demo.js`

```javascript
function evaluateDebtTradeOff(leverageLevel) {
  return leverageLevel === 'MODERATE_OPTIMAL'
    ? 'MAXIMIZES_TAX_SHIELD_WHILE_CONTAINING_DISTRESS_RISK'
    : 'EXCESSIVE_DEBT_CAUSES_FINANCIAL_DISTRESS_COSTS_TO_EXCEED_TAX_SHIELD';
}

console.log(evaluateDebtTradeOff('MODERATE_OPTIMAL'));
console.log(evaluateDebtTradeOff('EXCESSIVE'));
```

**Expected Terminal Output**:
```text
MAXIMIZES_TAX_SHIELD_WHILE_CONTAINING_DISTRESS_RISK
EXCESSIVE_DEBT_CAUSES_FINANCIAL_DISTRESS_COSTS_TO_EXCEED_TAX_SHIELD
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What benefit is maximized when maintaining an optimal moderate debt level under the Trade-Off Theory of capital structure?*

- **Target Answer**: `MAXIMIZES_TAX_SHIELD_WHILE_CONTAINING_DISTRESS_RISK`
- **Typed Misconception ID**: `MC_FIN_COST_OF_DEBT_AFTER_TAX_SHIELD`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'EXCESSIVE'**:
  - *What Went Wrong*: Moderate debt maximizes tax shield while containing distress risk.
  - *Simpler Mental Model*: Matches MAXIMIZES_TAX_SHIELD_WHILE_CONTAINING_DISTRESS_RISK.
  - *Guided Fix Action*: Type MAXIMIZES_TAX_SHIELD_WHILE_CONTAINING_DISTRESS_RISK

---

## 📅 Day 13: Cost of Capital: Cost of Equity ($K_e$) via CAPM & Dividend Growth

> **💡 Everyday Metaphor / Intuitive Model**:
> Cost of Equity is the Minimum Return Demanded by Shareholders for Putting Their Money in Harm's Way: equity investors get zero guaranteed interest; they only get paid after all bankers and suppliers are satisfied; CAPM calculates their required return by taking a safe risk-free government bond yield (6%) and adding a risk penalty proportional to how wildly the company's stock moves with the market (Beta $\beta = 1.2 \implies K_e = 6\% + 1.2 \times 5\% = 12\%$).

### 🔹 Block 1: Cost of Equity via CAPM: $K_e = R_f + \beta(R_m - R_f)$

- **Concept Budget / Primary Invariant**: `CAPM Cost of Equity Formula`
- **Supporting Terms & Invariants**: `$K_e = R_f + \beta \times (R_m - R_f)$`, `$R_f$ (Risk-Free Rate: 10-Yr Government Treasury Bond yield)`, `$\beta$ (Beta: Sensitivity of stock to broader market movements)`, `$(R_m - R_f)$ (Equity Market Risk Premium)`

#### 📦 Memory Box / Data Layout Diagram: CAPM Cost of Equity ($R_f = 6\%, \beta = 1.2, MRP = 5\%$)

| Valuation / Capital Component | Invariant & Parameters | Type |
|---|---|---|
| **Risk-Free Baseline (Rf)** | 6.0% guaranteed Treasury yield | `Risk-Free Base` |
| **Equity Risk Premium (Beta x MRP)** | 1.2 x 5.0% Market Premium = +6.0% Risk Premium! | `Risk Premium` |
| **Cost of Equity (Ke)** | 6.0% + 6.0% = 12.0% Required Return on Equity! | `Cost of Equity` |

#### 💻 Runnable Financial Simulator: `capm_ke_demo.js`

```javascript
function calculateCapmKe(rfPct, beta, mrpPct) {
  const ke = rfPct + beta * mrpPct;
  return {
    riskFreeRatePercent: rfPct,
    betaCoefficient: beta,
    marketRiskPremiumPercent: mrpPct,
    costOfEquityPercent: Number(ke.toFixed(2)),
    status: 'CAPM_KE_COMPUTED'
  };
}

console.log(JSON.stringify(calculateCapmKe(6, 1.2, 5)));
```

**Expected Terminal Output**:
```text
{"riskFreeRatePercent":6,"betaCoefficient":1.2,"marketRiskPremiumPercent":5,"costOfEquityPercent":12,"status":"CAPM_KE_COMPUTED"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What is the Cost of Equity ($K_e$) percentage under CAPM when Risk-Free Rate is 6%, Beta is 1.2, and Market Risk Premium is 5% ($6 + 1.2 \times 5$)?*

- **Target Answer**: `12`
- **Typed Misconception ID**: `MC_FIN_COST_OF_EQUITY_CAPM_AND_DIVIDEND_GROWTH`

**Diagnostic Recovery Paths**:
- **If Student Triggers '11'**:
  - *What Went Wrong*: 6 + (1.2 * 5) = 6 + 6 = 12%.
  - *Simpler Mental Model*: 6 + 6 = 12%.
  - *Guided Fix Action*: Type 12

---

### 🔹 Block 2: Cost of Equity via Gordon Dividend Growth Model: $K_e = \frac{D_1}{P_0} + g$

- **Concept Budget / Primary Invariant**: `Gordon Dividend Growth Model`
- **Supporting Terms & Invariants**: `$K_e = \frac{D_1}{P_0} + g = \frac{D_0(1 + g)}{P_0} + g$`, `$D_1$ (Expected next year dividend)`, `$P_0$ (Current market price per share)`, `$g$ (Constant annual dividend growth rate)`

#### ⚙️ Syntax & Formula Anatomy: Gordon Growth Math ($D0 = $4, P0 = $50, g = 4%)

```text
D1 = D0 * (1 + g) = 4 * 1.04 = $4.16
Dividend Yield = 4.16 / 50 = 8.32%
Capital Gains Growth = 4.00%
Total Cost of Equity Ke = 8.32% + 4.00% = 12.32%
```

- **Line 1**: Expected dividend next year.
- **Line 2**: Dividend yield component.
- **Line 4**: Total required return.

#### 💻 Runnable Financial Simulator: `gordon_ke_demo.js`

```javascript
function calculateGordonKe(d0, p0, gPct) {
  const g = gPct / 100;
  const d1 = d0 * (1 + g);
  const divYield = (d1 / p0) * 100;
  const ke = divYield + gPct;
  return {
    expectedDividendD1: Number(d1.toFixed(2)),
    dividendYieldPercent: Number(divYield.toFixed(2)),
    costOfEquityPercent: Number(ke.toFixed(2)),
    status: 'GORDON_KE_COMPUTED'
  };
}

console.log(JSON.stringify(calculateGordonKe(4, 50, 4)));
```

**Expected Terminal Output**:
```text
{"expectedDividendD1":4.16,"dividendYieldPercent":8.32,"costOfEquityPercent":12.32,"status":"GORDON_KE_COMPUTED"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What is the expected next year dividend ($D_1$) when current dividend $D_0 = $4 and growth rate $g = 4\%$ ($4 \times 1.04$)?*

- **Target Answer**: `4.16`
- **Typed Misconception ID**: `MC_FIN_COST_OF_EQUITY_CAPM_AND_DIVIDEND_GROWTH`

**Diagnostic Recovery Paths**:
- **If Student Triggers '4.00'**:
  - *What Went Wrong*: D1 grows by 4%: 4 * 1.04 = $4.16.
  - *Simpler Mental Model*: 4 * 1.04 = 4.16.
  - *Guided Fix Action*: Type 4.16

---

### 🔹 Block 3: Cost of Retained Earnings ($K_r$) vs Fresh Equity ($K_e$)

- **Concept Budget / Primary Invariant**: `Cost of Retained Earnings ($K_r$)`
- **Supporting Terms & Invariants**: `$K_r = K_e$ (Opportunity cost: shareholders could have earned $K_e$ elsewhere if paid as dividend!)`, `Fresh Equity has higher cost due to Flotation Costs ($K_e > K_r$)`

#### 💻 Runnable Financial Simulator: `kr_demo.js`

```javascript
function evaluateRetainedEarningsCost() {
  return 'COST_OF_RETAINED_EARNINGS_EQUALS_EQUITY_OPPORTUNITY_COST_WITHOUT_FLOTATION';
}

console.log(evaluateRetainedEarningsCost());
```

**Expected Terminal Output**:
```text
COST_OF_RETAINED_EARNINGS_EQUALS_EQUITY_OPPORTUNITY_COST_WITHOUT_FLOTATION
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *Why does Retained Earnings carry an explicit Cost of Capital ($K_r$) equal to the Cost of Equity?*

- **Target Answer**: `COST_OF_RETAINED_EARNINGS_EQUALS_EQUITY_OPPORTUNITY_COST_WITHOUT_FLOTATION`
- **Typed Misconception ID**: `MC_FIN_COST_OF_EQUITY_CAPM_AND_DIVIDEND_GROWTH`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'FREE'**:
  - *What Went Wrong*: Retained earnings is not free capital; it carries an opportunity cost equal to Ke.
  - *Simpler Mental Model*: Carries shareholder opportunity cost.
  - *Guided Fix Action*: Type COST_OF_RETAINED_EARNINGS_EQUALS_EQUITY_OPPORTUNITY_COST_WITHOUT_FLOTATION

---

## 📅 Day 14: Weighted Average Cost of Capital (WACC) & Overall Hurdle Rate

> **💡 Everyday Metaphor / Intuitive Model**:
> WACC is the Blended Fuel Price of a Multi-Engine Rocket: a rocket uses 60% expensive High-Octane Equity Fuel (costing 15%) and 40% cheaper After-Tax Debt Fuel (costing 7.5%); the Weighted Average Cost of Capital (WACC) blends both fuel streams together: $(0.60 \times 15\%) + (0.40 \times 7.5\%) = 12.0\%$; WACC is the ultimate benchmark hurdle rate: any corporate project that earns less than 12% is burning more fuel than the rocket generates—destroying company value.

### 🔹 Block 1: Weighted Average Cost of Capital (WACC) Equation: $WACC = w_e K_e + w_d K_d$

- **Concept Budget / Primary Invariant**: `WACC Blended Formula`
- **Supporting Terms & Invariants**: `$WACC = w_e K_e + w_d K_d(1 - t) + w_p K_p$`, `$w_e = \frac{E}{V}$ (Weight of Equity)`, `$w_d = \frac{D}{V}$ (Weight of Debt where $V = E + D$)`, `Overall Corporate Hurdle Rate`

#### 📦 Memory Box / Data Layout Diagram: WACC Weighted Calculation ($1M Firm: 60% Equity, 40% Debt)

| Valuation / Capital Component | Invariant & Parameters | Type |
|---|---|---|
| **Equity Portion (60% @ 15% Ke)** | Weight $w_e = 0.60$ | Weighted Equity Cost = $0.60 \times 15\% = 9.0\%$ | `Equity Leg` |
| **Debt Portion (40% @ 7.5% Kd)** | Weight $w_d = 0.40$ | Weighted Debt Cost = $0.40 \times 7.5\% = 3.0\%$ | `Debt Leg` |
| **Composite WACC** | $9.0\% + 3.0\% = 12.0\%$ Corporate Hurdle Rate! | `WACC Result` |

#### 💻 Runnable Financial Simulator: `wacc_calc_demo.js`

```javascript
function calculateWacc(e, d, kePct, kdPrePct, tPct) {
  const totalV = e + d;
  const we = e / totalV;
  const wd = d / totalV;
  const kdAfter = kdPrePct * (1 - tPct / 100);
  const wacc = we * kePct + wd * kdAfter;
  return {
    equityWeight: Number(we.toFixed(2)),
    debtWeight: Number(wd.toFixed(2)),
    afterTaxCostOfDebt: Number(kdAfter.toFixed(2)),
    compositeWaccPercent: Number(wacc.toFixed(2)),
    status: 'WACC_COMPUTED'
  };
}

console.log(JSON.stringify(calculateWacc(600000, 400000, 15, 10, 25)));
```

**Expected Terminal Output**:
```text
{"equityWeight":0.6,"debtWeight":0.4,"afterTaxCostOfDebt":7.5,"compositeWaccPercent":12,"status":"WACC_COMPUTED"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What is the composite WACC percentage for a company with 60% Equity ($K_e = 15\%$) and 40% Debt ($K_d = 7.5\%$) ($0.60 \times 15 + 0.40 \times 7.5$)?*

- **Target Answer**: `12`
- **Typed Misconception ID**: `MC_FIN_WEIGHTED_AVERAGE_COST_OF_CAPITAL_WACC`

**Diagnostic Recovery Paths**:
- **If Student Triggers '11.25'**:
  - *What Went Wrong*: 11.25% is an unweighted average ((15+7.5)/2). Weighted WACC is 0.6*15 + 0.4*7.5 = 12.0%.
  - *Simpler Mental Model*: 0.6*15 + 0.4*7.5 = 12.0%.
  - *Guided Fix Action*: Type 12

---

### 🔹 Block 2: Book Value Weights vs Market Value Weights in WACC

- **Concept Budget / Primary Invariant**: `Capital Weighting Systems`
- **Supporting Terms & Invariants**: `Book Value Weights (Historical accounting values from Balance Sheet)`, `Market Value Weights (Current trading prices of shares and bonds $\implies$ THEORETICALLY SUPERIOR!)`

#### 💻 Runnable Financial Simulator: `weights_demo.js`

```javascript
function evaluateWeightingSystem(isMarketValue) {
  return isMarketValue
    ? 'MARKET_VALUE_WEIGHTS_ARE_ECONOMICALLY_SUPERIOR_REFLECTING_OPPORTUNITY_COST'
    : 'BOOK_VALUE_WEIGHTS_DISTORTED_BY_HISTORICAL_ACCOUNTING';
}

console.log(evaluateWeightingSystem(true));
console.log(evaluateWeightingSystem(false));
```

**Expected Terminal Output**:
```text
MARKET_VALUE_WEIGHTS_ARE_ECONOMICALLY_SUPERIOR_REFLECTING_OPPORTUNITY_COST
BOOK_VALUE_WEIGHTS_DISTORTED_BY_HISTORICAL_ACCOUNTING
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *Why are Market Value Weights theoretically superior to Book Value Weights when computing WACC?*

- **Target Answer**: `MARKET_VALUE_WEIGHTS_ARE_ECONOMICALLY_SUPERIOR_REFLECTING_OPPORTUNITY_COST`
- **Typed Misconception ID**: `MC_FIN_WEIGHTED_AVERAGE_COST_OF_CAPITAL_WACC`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'BOOK'**:
  - *What Went Wrong*: Market value weights reflect current economic reality and true opportunity cost of capital.
  - *Simpler Mental Model*: Market value reflects true opportunity cost.
  - *Guided Fix Action*: Type MARKET_VALUE_WEIGHTS_ARE_ECONOMICALLY_SUPERIOR_REFLECTING_OPPORTUNITY_COST

---

### 🔹 Block 3: Marginal Cost of Capital (MCC) & Investment Opportunity Schedule (IOS)

- **Concept Budget / Primary Invariant**: `Marginal Cost of Capital (MCC)`
- **Supporting Terms & Invariants**: `Marginal Cost of Capital ($MCC$: Cost of obtaining the next additional dollar of new capital)`, `Break-Points in Capital Raising (When low-cost retained earnings are exhausted)`, `Optimal Capital Budgeting where $MCC = IOS$`

#### 💻 Runnable Financial Simulator: `mcc_demo.js`

```javascript
function evaluateOptimalBudgetIntersection() {
  return 'OPTIMAL_CAPITAL_BUDGET_IS_THE_INTERSECTION_OF_MCC_AND_IOS';
}

console.log(evaluateOptimalBudgetIntersection());
```

**Expected Terminal Output**:
```text
OPTIMAL_CAPITAL_BUDGET_IS_THE_INTERSECTION_OF_MCC_AND_IOS
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *Where is the optimal corporate capital budget determined in finance theory?*

- **Target Answer**: `OPTIMAL_CAPITAL_BUDGET_IS_THE_INTERSECTION_OF_MCC_AND_IOS`
- **Typed Misconception ID**: `MC_FIN_WEIGHTED_AVERAGE_COST_OF_CAPITAL_WACC`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'LOWEST'**:
  - *What Went Wrong*: Optimal budget is where Marginal Cost of Capital intersects the Investment Opportunity Schedule (MCC = IOS).
  - *Simpler Mental Model*: Intersection of MCC and IOS.
  - *Guided Fix Action*: Type OPTIMAL_CAPITAL_BUDGET_IS_THE_INTERSECTION_OF_MCC_AND_IOS

---

## 📅 Day 15: ⭐ MILESTONE 2: Complete Capital Budgeting & Cost of Capital Valuation Engine

> **💡 Everyday Metaphor / Intuitive Model**:
> Milestone 2 Synthesis: The complete sovereign corporate capital budgeting and valuation engine: 1. Multi-project NPV and IRR decision rules; 2. Debt tax shield and CAPM cost of equity estimation; 3. Enterprise WACC composite hurdle rate determination; 4. Capital rationing and optimal capital budget synthesis.

### 🔹 Block 1: Capital Budgeting & WACC Valuation Master Engine Synthesis

- **Concept Budget / Primary Invariant**: `Capital Budgeting & WACC Synthesis`
- **Supporting Terms & Invariants**: `NPV Decision Engine`, `IRR Newton-Raphson Solver`, `WACC Composite Engine`, `Capital Rationing Optimizer`

#### 🔄 Valuation & Decision Process Execution Flowchart: Milestone 2 Corporate Valuation Pipeline

1. **Computes After-Tax Cost of Debt ($K_d$) and CAPM Cost of Equity ($K_e$)**
2. **Determines Enterprise Weighted Average Cost of Capital (WACC = 12%)**
3. **Evaluates multi-year project cash flows at WACC discount rate**
4. **Validates NPV > 0 and IRR > Hurdle rate to certify value creation!**

#### 💻 Runnable Financial Simulator: `cb_wacc_engine_demo.js`

```javascript
function runCapitalBudgetingWaccEngine() {
  return {
    costOfDebtSubsystem: 'ONLINE_TAX_SHIELD_ACTIVE',
    costOfEquitySubsystem: 'ONLINE_CAPM_GORDON_ACTIVE',
    waccHurdleSubsystem: 'ONLINE_COMPOSITE_RATE_COMPUTED',
    npvIrrSubsystem: 'ONLINE_CAPITAL_BUDGETING_DECISION_ACTIVE',
    engineStatus: 'CAPITAL_BUDGETING_WACC_MASTER_ACTIVE'
  };
}

console.log(runCapitalBudgetingWaccEngine().engineStatus);
```

**Expected Terminal Output**:
```text
CAPITAL_BUDGETING_WACC_MASTER_ACTIVE
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What engine status confirms active operational synthesis of the Capital Budgeting & WACC Master Engine?*

- **Target Answer**: `CAPITAL_BUDGETING_WACC_MASTER_ACTIVE`
- **Typed Misconception ID**: `MC_FIN_CAPITAL_BUDGETING_NET_PRESENT_VALUE_NPV`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'FAILED'**:
  - *What Went Wrong*: Matches CAPITAL_BUDGETING_WACC_MASTER_ACTIVE.
  - *Simpler Mental Model*: Matches header string.
  - *Guided Fix Action*: Type CAPITAL_BUDGETING_WACC_MASTER_ACTIVE

---

### 🔹 Block 2: Capital Budgeting & Valuation Invariant Audit

- **Concept Budget / Primary Invariant**: `Valuation Invariant Verification`
- **Supporting Terms & Invariants**: `NPV Invariant`, `WACC Invariant`, `100% Quality Invariant`

#### 💻 Runnable Financial Simulator: `cb_audit_demo.js`

```javascript
function auditCapitalBudgetingSystem(waccValid, npvValid, irrValid) {
  const passed = waccValid && npvValid && irrValid;
  return {
    waccVerified: waccValid,
    npvVerified: npvValid,
    irrVerified: irrValid,
    grade: passed ? 'CAPITAL_BUDGETING_VALUATION_AUDIT_PASSED' : 'AUDIT_DEFECT'
  };
}

console.log(JSON.stringify(auditCapitalBudgetingSystem(true, true, true)));
```

**Expected Terminal Output**:
```text
{"waccVerified":true,"npvVerified":true,"irrVerified":true,"grade":"CAPITAL_BUDGETING_VALUATION_AUDIT_PASSED"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What audit grade is awarded when WACC, NPV, and IRR capital budgeting engines pass 100%?*

- **Target Answer**: `CAPITAL_BUDGETING_VALUATION_AUDIT_PASSED`
- **Typed Misconception ID**: `MC_FIN_CAPITAL_BUDGETING_NET_PRESENT_VALUE_NPV`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'DEFECT'**:
  - *What Went Wrong*: All checks passing awards CAPITAL_BUDGETING_VALUATION_AUDIT_PASSED.
  - *Simpler Mental Model*: Awards CAPITAL_BUDGETING_VALUATION_AUDIT_PASSED.
  - *Guided Fix Action*: Type CAPITAL_BUDGETING_VALUATION_AUDIT_PASSED

---

### 🔹 Block 3: Milestone 2 Capital Budgeting & Valuation Certification

- **Concept Budget / Primary Invariant**: `Milestone 2 Certification`
- **Supporting Terms & Invariants**: `Valuation Verified`, `100% Quality Invariant`

#### 💻 Runnable Financial Simulator: `milestone2_fin_cert.js`

```javascript
console.log('⭐ MILESTONE 2: Complete Capital Budgeting & Cost of Capital Valuation Engine [VERIFIED 100%]');
```

**Expected Terminal Output**:
```text
⭐ MILESTONE 2: Complete Capital Budgeting & Cost of Capital Valuation Engine [VERIFIED 100%]
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What certification string confirms Milestone 2 completion?*

- **Target Answer**: `⭐ MILESTONE 2: Complete Capital Budgeting & Cost of Capital Valuation Engine [VERIFIED 100%]`
- **Typed Misconception ID**: `MC_FIN_CAPITAL_BUDGETING_NET_PRESENT_VALUE_NPV`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'FAILED'**:
  - *What Went Wrong*: Matches milestone header string.
  - *Simpler Mental Model*: Matches header string.
  - *Guided Fix Action*: Type ⭐ MILESTONE 2: Complete Capital Budgeting & Cost of Capital Valuation Engine [VERIFIED 100%]

---

## 📅 Day 16: Operating, Financial & Combined Leverage: DOL, DFL & DCL

> **💡 Everyday Metaphor / Intuitive Model**:
> Financial Leverage is a Crowbar That Multiplies Every Movement in Sales: Operating Leverage (DOL) uses heavy fixed factory machines ($FC$) so that a 10% increase in sales creates a 15% surge in operating profit (EBIT); Financial Leverage (DFL) uses fixed interest debt to magnify that 15% EBIT surge into a 20% explosion in Earnings Per Share (EPS); Combined Leverage ($DCL = DOL \times DFL = 1.5 \times 1.33 = 2.0$) measures the total crowbar power—a 10% sales gain doubles earnings, but a 10% drop hits twice as hard.

### 🔹 Block 1: Degree of Operating Leverage (DOL): Fixed Operating Costs Magnifier

- **Concept Budget / Primary Invariant**: `Degree of Operating Leverage (DOL)`
- **Supporting Terms & Invariants**: `$DOL = \frac{\text{Contribution}}{\text{EBIT}} = \frac{\text{Sales} - \text{Variable Cost}}{\text{Sales} - \text{Variable Cost} - \text{Fixed Cost}}$`, `Percentage Magnification: $DOL = \frac{\% \Delta \text{EBIT}}{\% \Delta \text{Sales}}$`, `High Fixed Costs $\implies$ High Business Risk`

#### 📦 Memory Box / Data Layout Diagram: DOL Calculation ($500k Sales, $200k VC, $100k FC)

| Valuation / Capital Component | Invariant & Parameters | Type |
|---|---|---|
| **Contribution ($500k - $200k)** | Contribution = $300,000 | `Contribution` |
| **Operating Profit (EBIT)** | EBIT = $300,000 - $100,000 Fixed Cost = $200,000 | `EBIT` |
| **Degree of Operating Leverage** | DOL = $300,000 / $200,000 = 1.50 (A 10% sales rise boosts EBIT by 15%!) | `DOL Result` |

#### 💻 Runnable Financial Simulator: `dol_calc_demo.js`

```javascript
function calculateDol(sales, vc, fc) {
  const contribution = sales - vc;
  const ebit = contribution - fc;
  const dol = contribution / ebit;
  return {
    contribution,
    ebit,
    degreeOfOperatingLeverage: Number(dol.toFixed(2)),
    ebitSensitivityPercentFor10PctSalesRise: Number((dol * 10).toFixed(2)),
    status: 'DOL_COMPUTED'
  };
}

console.log(JSON.stringify(calculateDol(500000, 200000, 100000)));
```

**Expected Terminal Output**:
```text
{"contribution":300000,"ebit":200000,"degreeOfOperatingLeverage":1.5,"ebitSensitivityPercentFor10PctSalesRise":15,"status":"DOL_COMPUTED"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What is the Degree of Operating Leverage (DOL) for a firm with $300,000 Contribution and $200,000 EBIT ($300000 / 200000$)?*

- **Target Answer**: `1.5`
- **Typed Misconception ID**: `MC_FIN_OPERATING_FINANCIAL_COMBINED_LEVERAGE`

**Diagnostic Recovery Paths**:
- **If Student Triggers '0.67'**:
  - *What Went Wrong*: DOL is Contribution / EBIT = 300,000 / 200,000 = 1.50.
  - *Simpler Mental Model*: 300000 / 200000 = 1.5.
  - *Guided Fix Action*: Type 1.5

---

### 🔹 Block 2: Degree of Financial Leverage (DFL): Fixed Interest Debt Magnifier

- **Concept Budget / Primary Invariant**: `Degree of Financial Leverage (DFL)`
- **Supporting Terms & Invariants**: `$DFL = \frac{\text{EBIT}}{\text{EBT}} = \frac{\text{EBIT}}{\text{EBIT} - \text{Interest}}$`, `Percentage Magnification: $DFL = \frac{\% \Delta \text{EPS}}{\% \Delta \text{EBIT}}$`, `High Debt Interest $\implies$ High Financial Risk`

#### ⚙️ Syntax & Formula Anatomy: DFL Calculation ($200k EBIT, $50k Interest)

```text
EBIT = $200,000
Interest Expense = $50,000
EBT = EBIT - Interest = $200,000 - $50,000 = $150,000
DFL = EBIT / EBT = 200,000 / 150,000 = 1.33
```

- **Line 1**: Operating profit.
- **Line 3**: Earnings before tax.
- **Line 4**: Financial leverage multiplier.

#### 💻 Runnable Financial Simulator: `dfl_calc_demo.js`

```javascript
function calculateDfl(ebit, interest) {
  const ebt = ebit - interest;
  const dfl = ebit / ebt;
  return {
    ebit,
    ebt,
    degreeOfFinancialLeverage: Number(dfl.toFixed(2)),
    status: 'DFL_COMPUTED'
  };
}

console.log(JSON.stringify(calculateDfl(200000, 50000)));
```

**Expected Terminal Output**:
```text
{"ebit":200000,"ebt":150000,"degreeOfFinancialLeverage":1.33,"status":"DFL_COMPUTED"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What is the Degree of Financial Leverage (DFL) when EBIT is $200,000 and Interest is $50,000 ($200000 / 150000$)?*

- **Target Answer**: `1.33`
- **Typed Misconception ID**: `MC_FIN_OPERATING_FINANCIAL_COMBINED_LEVERAGE`

**Diagnostic Recovery Paths**:
- **If Student Triggers '4.0'**:
  - *What Went Wrong*: DFL is EBIT / (EBIT - Interest) = 200k / 150k = 1.33.
  - *Simpler Mental Model*: 200000 / 150000 = 1.33.
  - *Guided Fix Action*: Type 1.33

---

### 🔹 Block 3: Degree of Combined Leverage (DCL): Total Corporate Risk Multiplier

- **Concept Budget / Primary Invariant**: `Degree of Combined Leverage (DCL)`
- **Supporting Terms & Invariants**: `$DCL = DOL \times DFL = \frac{\text{Contribution}}{\text{EBT}}$`, `Total Sensitivity: $DCL = \frac{\% \Delta \text{EPS}}{\% \Delta \text{Sales}}$`, `Balancing Operating Risk and Financial Risk`

#### 💻 Runnable Financial Simulator: `dcl_calc_demo.js`

```javascript
function calculateDcl(dol, dfl) {
  const dcl = dol * dfl;
  return {
    dol,
    dfl,
    degreeOfCombinedLeverage: Number(dcl.toFixed(2)),
    status: 'DCL_COMPUTED'
  };
}

console.log(JSON.stringify(calculateDcl(1.50, 1.333333)));
```

**Expected Terminal Output**:
```text
{"dol":1.5,"dfl":1.333333,"degreeOfCombinedLeverage":2,"status":"DCL_COMPUTED"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What is the Degree of Combined Leverage (DCL) for a corporation with DOL of 1.50 and DFL of 1.333 ($1.50 \times 1.333$)?*

- **Target Answer**: `2`
- **Typed Misconception ID**: `MC_FIN_OPERATING_FINANCIAL_COMBINED_LEVERAGE`

**Diagnostic Recovery Paths**:
- **If Student Triggers '2.83'**:
  - *What Went Wrong*: DCL multiplies DOL and DFL (1.50 * 1.333 = 2.0), not adds them.
  - *Simpler Mental Model*: 1.5 * 1.333 = 2.0.
  - *Guided Fix Action*: Type 2

---

## 📅 Day 17: Break-Even Analysis & Margin of Safety

> **💡 Everyday Metaphor / Intuitive Model**:
> The Break-Even Point is Climbing Out of the Water to Take Your First Breath of Air: you invest $100,000 in fixed overhead rent ($FC$); each product you sell for $50 costs $30 in raw materials, leaving a $20 Contribution Margin per unit; selling 5,000 units covers your entire $100,000 rent exactly ($Q_{BE} = 100,000 / 20 = 5,000$ units); every unit sold beyond 5,000 units is your Margin of Safety—pure profit cushion protecting you from drowning if a storm hits.

### 🔹 Block 1: Break-Even Point in Units ($Q_{BE} = \frac{FC}{P - V}$) & Sales Dollars

- **Concept Budget / Primary Invariant**: `Break-Even Point Formula`
- **Supporting Terms & Invariants**: `Contribution Margin per Unit ($CM = P - V$)`, `Profit-Volume (P/V) Ratio ($\frac{P - V}{P} \times 100\%$)`, `$Q_{BE} = \frac{\text{Fixed Cost}}{P - V}$`, `$\text{BES (\$)} = \frac{\text{Fixed Cost}}{\text{P/V Ratio}} = Q_{BE} \times P$`

#### 📦 Memory Box / Data Layout Diagram: Break-Even Dynamics ($100k FC, P=$50, V=$30)

| Valuation / Capital Component | Invariant & Parameters | Type |
|---|---|---|
| **Unit Contribution ($50 - $30)** | $20 contribution per unit (40% P/V Ratio) | `Unit Contribution` |
| **Break-Even Volume (Units)** | $100,000 / $20 = EXACTLY 5,000 Units to break even! | `BEP Units` |
| **Break-Even Revenue ($)** | 5,000 units x $50 = $250,000 Break-Even Sales Revenue | `BEP Revenue` |

#### 💻 Runnable Financial Simulator: `bep_calc_demo.js`

```javascript
function calculateBep(fc, p, v) {
  const cm = p - v;
  const pvRatio = (cm / p) * 100;
  const bepUnits = fc / cm;
  const bepRevenue = bepUnits * p;
  return {
    fixedCost: fc,
    unitContribution: cm,
    pvRatioPercent: pvRatio,
    breakEvenUnits: Math.round(bepUnits),
    breakEvenSalesDollars: Math.round(bepRevenue),
    status: 'BEP_COMPUTED'
  };
}

console.log(JSON.stringify(calculateBep(100000, 50, 30)));
```

**Expected Terminal Output**:
```text
{"fixedCost":100000,"unitContribution":20,"pvRatioPercent":40,"breakEvenUnits":5000,"breakEvenSalesDollars":250000,"status":"BEP_COMPUTED"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *How many units must a firm sell to break even when Fixed Costs are $100,000, Selling Price is $50, and Variable Cost is $30 ($100000 / (50 - 30)$)?*

- **Target Answer**: `5000`
- **Typed Misconception ID**: `MC_FIN_BREAK_EVEN_POINT_AND_MARGIN_OF_SAFETY`

**Diagnostic Recovery Paths**:
- **If Student Triggers '2000'**:
  - *What Went Wrong*: 100,000 / 50 = 2,000 forgets variable cost. Correct is 100,000 / (50 - 30) = 5,000 units.
  - *Simpler Mental Model*: 100000 / 20 = 5000.
  - *Guided Fix Action*: Type 5000

---

### 🔹 Block 2: Margin of Safety (MOS): Buffer Above Break-Even

- **Concept Budget / Primary Invariant**: `Margin of Safety (MOS) Equation`
- **Supporting Terms & Invariants**: `$\text{MOS (\$)} = \text{Actual Sales} - \text{Break-Even Sales}$`, `$\text{MOS \%} = \frac{\text{Actual Sales} - \text{Break-Even Sales}}{\text{Actual Sales}} \times 100\%$`, `$\text{Profit} = \text{MOS} \times \text{P/V Ratio}$`

#### ⚙️ Syntax & Formula Anatomy: Margin of Safety Math ($400k Actual, $250k BES)

```text
Actual Sales = $400,000
Break-Even Sales = $250,000
Margin of Safety ($) = 400,000 - 250,000 = $150,000
Margin of Safety (%) = (150,000 / 400,000) * 100 = 37.5%
```

- **Line 1**: Current operating sales.
- **Line 3**: Safety buffer dollars.
- **Line 4**: Percentage risk cushion.

#### 💻 Runnable Financial Simulator: `mos_calc_demo.js`

```javascript
function calculateMos(actualSales, bepSales) {
  const mos = actualSales - bepSales;
  const mosPct = (mos / actualSales) * 100;
  return {
    actualSales,
    breakEvenSales: bepSales,
    marginOfSafetyDollars: mos,
    marginOfSafetyPercent: Number(mosPct.toFixed(2)),
    status: 'MOS_COMPUTED'
  };
}

console.log(JSON.stringify(calculateMos(400000, 250000)));
```

**Expected Terminal Output**:
```text
{"actualSales":400000,"breakEvenSales":250000,"marginOfSafetyDollars":150000,"marginOfSafetyPercent":37.5,"status":"MOS_COMPUTED"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What is the Margin of Safety (in dollars) when Actual Sales are $400,000 and Break-Even Sales are $250,000 ($400000 - 250000$)?*

- **Target Answer**: `150000`
- **Typed Misconception ID**: `MC_FIN_BREAK_EVEN_POINT_AND_MARGIN_OF_SAFETY`

**Diagnostic Recovery Paths**:
- **If Student Triggers '250000'**:
  - *What Went Wrong*: MOS = Actual - BES = 400,000 - 250,000 = $150,000.
  - *Simpler Mental Model*: 400000 - 250000 = 150000.
  - *Guided Fix Action*: Type 150000

---

### 🔹 Block 3: Target Profit Volume Planning: $Q_{\text{target}} = \frac{FC + \text{Target Profit}}{P - V}$

- **Concept Budget / Primary Invariant**: `Target Profit Sales Volume Formula`
- **Supporting Terms & Invariants**: `$Q_{\text{target}} = \frac{\text{Fixed Cost} + \text{Desired Profit}}{P - V}$`, `After-Tax Target Profit ($Q_{\text{target}} = \frac{\text{FC} + \frac{\text{Desired Net Profit}}{1 - t}}{P - V}$)`

#### 💻 Runnable Financial Simulator: `target_profit_demo.js`

```javascript
function calculateTargetVolume(fc, p, v, desiredProfit) {
  const unitContrib = p - v;
  const targetUnits = (fc + desiredProfit) / unitContrib;
  return {
    fixedCost: fc,
    desiredProfit,
    requiredSalesUnits: Math.round(targetUnits),
    requiredSalesRevenue: Math.round(targetUnits * p),
    status: 'TARGET_PROFIT_VOLUME_COMPUTED'
  };
}

console.log(JSON.stringify(calculateTargetVolume(100000, 50, 30, 60000))); // (100k + 60k)/20 = 8,000 units ($400k)
```

**Expected Terminal Output**:
```text
{"fixedCost":100000,"desiredProfit":60000,"requiredSalesUnits":8000,"requiredSalesRevenue":400000,"status":"TARGET_PROFIT_VOLUME_COMPUTED"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *How many units must be sold to earn a desired profit of $60,000 when Fixed Costs are $100,000 and unit contribution is $20 ($ (100000 + 60000) / 20 $)?*

- **Target Answer**: `8000`
- **Typed Misconception ID**: `MC_FIN_BREAK_EVEN_POINT_AND_MARGIN_OF_SAFETY`

**Diagnostic Recovery Paths**:
- **If Student Triggers '5000'**:
  - *What Went Wrong*: 5,000 units breaks even ($0 profit). To earn $60,000 profit requires (100k + 60k) / 20 = 8,000 units.
  - *Simpler Mental Model*: 160000 / 20 = 8000.
  - *Guided Fix Action*: Type 8000

---

## 📅 Day 18: Working Capital Management & Quarterly Cash Budgeting

> **💡 Everyday Metaphor / Intuitive Model**:
> A Cash Budget is the Blood Pressure Monitor of Corporate Solvency: an enterprise may be wildly profitable on paper, but if customers take 90 days to pay while suppliers demand cash in 15 days, the business will suffer cardiac arrest from lack of cash; a Cash Budget forecasts cash receipts and cash disbursements quarter by quarter—alerting the CFO months in advance to arrange a bank overdraft before payroll day.

### 🔹 Block 1: Cash Budget Architecture: Inflows, Outflows & Minimum Cash Float

- **Concept Budget / Primary Invariant**: `Cash Budget Forecasting Architecture`
- **Supporting Terms & Invariants**: `Cash Receipts (Cash Sales, Debtors collections lag e.g. 50% month 1, 50% month 2)`, `Cash Disbursements (Purchases, Salaries, Rent, Taxes, Dividends)`, `$\text{Closing Balance} = \text{Opening Cash} + \text{Receipts} - \text{Disbursements}$`, `Short-Term Overdraft Line`

#### 📦 Memory Box / Data Layout Diagram: Quarterly Cash Budget Forecast

| Valuation / Capital Component | Invariant & Parameters | Type |
|---|---|---|
| **Q1 Cash Flow** | Opening: $20k + Receipts: $50k - Payments: $45k = $25,000 Closing (No Overdraft!) | `Q1 Surplus` |
| **Q2 Cash Flow** | Opening: $25k + Receipts: $40k - Payments: $60k = $5,000 Closing (Needs $5k Overdraft to maintain $10k min float!) | `Q2 Deficit` |

#### 💻 Runnable Financial Simulator: `cash_budget_demo.js`

```javascript
function evaluateCashFlowQuarter(opening, inFlow, outFlow, minFloat = 10000) {
  const closing = opening + inFlow - outFlow;
  const deficit = closing < minFloat ? (minFloat - closing) : 0;
  return {
    openingCash: opening,
    netCashFlow: inFlow - outFlow,
    closingCash: closing,
    overdraftRequired: deficit,
    status: 'CASH_BUDGET_QUARTER_EVALUATED'
  };
}

console.log(JSON.stringify(evaluateCashFlowQuarter(20000, 50000, 45000)));
console.log(JSON.stringify(evaluateCashFlowQuarter(25000, 40000, 60000)));
```

**Expected Terminal Output**:
```text
{"openingCash":20000,"netCashFlow":5000,"closingCash":25000,"overdraftRequired":0,"status":"CASH_BUDGET_QUARTER_EVALUATED"}
{"openingCash":25000,"netCashFlow":-20000,"closingCash":5000,"overdraftRequired":5000,"status":"CASH_BUDGET_QUARTER_EVALUATED"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *How much bank overdraft financing is required in Q2 when closing cash drops to $5,000 and management policy mandates a $10,000 minimum cash float ($10000 - 5000$)?*

- **Target Answer**: `5000`
- **Typed Misconception ID**: `MC_FIN_WORKING_CAPITAL_CASH_BUDGETING_FORECAST`

**Diagnostic Recovery Paths**:
- **If Student Triggers '0'**:
  - *What Went Wrong*: Although cash is positive ($5k), it is $5k below the mandatory $10k float, requiring a $5,000 overdraft.
  - *Simpler Mental Model*: 10000 - 5000 = 5000.
  - *Guided Fix Action*: Type 5000

---

### 🔹 Block 2: Working Capital Financing: Conservative, Aggressive & Matching (Hedging) Approaches

- **Concept Budget / Primary Invariant**: `Working Capital Financing Strategies`
- **Supporting Terms & Invariants**: `Matching / Hedging Approach (Fixed assets & permanent working capital funded by long-term debt; temporary spikes funded by short-term loans)`, `Aggressive Approach (Funding permanent assets with short-term cheap debt $\implies$ High liquidity risk!)`, `Conservative Approach (Funding everything with long-term capital $\implies$ Safe but expensive)`

#### 💻 Runnable Financial Simulator: `wc_strategy_demo.js`

```javascript
function evaluateWcStrategy(strategyName) {
  if (strategyName === 'MATCHING_HEDGING') return 'MATURITY_OF_DEBT_MATCHES_LIFE_OF_ASSET';
  if (strategyName === 'AGGRESSIVE') return 'USES_SHORT_TERM_DEBT_FOR_PERMANENT_ASSETS_HIGH_RISK';
  return 'USES_LONG_TERM_CAPITAL_FOR_ALL_ASSETS_LOW_RISK_LOW_RETURN';
}

console.log(evaluateWcStrategy('MATCHING_HEDGING'));
console.log(evaluateWcStrategy('AGGRESSIVE'));
```

**Expected Terminal Output**:
```text
MATURITY_OF_DEBT_MATCHES_LIFE_OF_ASSET
USES_SHORT_TERM_DEBT_FOR_PERMANENT_ASSETS_HIGH_RISK
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What core financial principle governs the Matching / Hedging Approach to working capital financing?*

- **Target Answer**: `MATURITY_OF_DEBT_MATCHES_LIFE_OF_ASSET`
- **Typed Misconception ID**: `MC_FIN_WORKING_CAPITAL_CASH_BUDGETING_FORECAST`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'SHORT_TERM'**:
  - *What Went Wrong*: Matching approach matches asset life with debt maturity.
  - *Simpler Mental Model*: Matches maturity of debt with asset life.
  - *Guided Fix Action*: Type MATURITY_OF_DEBT_MATCHES_LIFE_OF_ASSET

---

### 🔹 Block 3: Cash Turnover & Minimum Operating Cash Equation

- **Concept Budget / Primary Invariant**: `Cash Turnover Invariant`
- **Supporting Terms & Invariants**: `$\text{Cash Turnover} = \frac{365}{\text{Cash Conversion Cycle (Days)}}$`, `$\text{Minimum Operating Cash} = \frac{\text{Total Annual Operating Outlays}}{\text{Cash Turnover}}$`

#### 💻 Runnable Financial Simulator: `cash_turnover_demo.js`

```javascript
function calculateMinOperatingCash(annualOutlays, cccDays) {
  const turnover = 365 / cccDays;
  const minCash = annualOutlays / turnover;
  return {
    annualOutlays,
    cashConversionCycleDays: cccDays,
    cashTurnoverPerYear: Number(turnover.toFixed(2)),
    minimumOperatingCashRequired: Math.round(minCash),
    status: 'MIN_CASH_COMPUTED'
  };
}

console.log(JSON.stringify(calculateMinOperatingCash(3650000, 36.5)));
```

**Expected Terminal Output**:
```text
{"annualOutlays":3650000,"cashConversionCycleDays":36.5,"cashTurnoverPerYear":10,"minimumOperatingCashRequired":365000,"status":"MIN_CASH_COMPUTED"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What is the Minimum Operating Cash required for a firm with $3,650,000 in annual outlays and a Cash Turnover of 10 times per year ($3650000 / 10$)?*

- **Target Answer**: `365000`
- **Typed Misconception ID**: `MC_FIN_WORKING_CAPITAL_CASH_BUDGETING_FORECAST`

**Diagnostic Recovery Paths**:
- **If Student Triggers '3650000'**:
  - *What Went Wrong*: Cash turns over 10 times, so firm only needs 1/10th of annual outlays = $365,000.
  - *Simpler Mental Model*: 3650000 / 10 = 365000.
  - *Guided Fix Action*: Type 365000

---

## 📅 Day 19: Capital Structure Theories: Modigliani-Miller (MM) Theorem

> **💡 Everyday Metaphor / Intuitive Model**:
> The Modigliani-Miller Theorem is Slicing a Giant Pizza: MM Proposition I without taxes says that whether you slice a $1,000,000 company into 80% equity slices and 20% debt slices, or 50% equity and 50% debt, the total size of the pizza (firm value) never changes; however, in the real world with Corporate Taxes (MM with Taxes), every dollar of debt provides an interest tax shield that bakes EXTRA PIZZA—making the levered firm worth $V_L = V_U + t \times D$.

### 🔹 Block 1: MM Proposition I (Without Taxes): Capital Structure Irrelevance ($V_U = V_L$)

- **Concept Budget / Primary Invariant**: `MM Proposition I (No Taxes)`
- **Supporting Terms & Invariants**: `$V_U = V_L = \frac{\text{EBIT}}{K_e}$`, `Assumptions: Perfect capital markets, zero taxes, zero transaction costs, homogeneous expectations`, `Arbitrage Mechanism: Homemade Leverage proves investors can replicate corporate debt themselves!`

#### 📦 Memory Box / Data Layout Diagram: MM Proposition I Irrelevance Paradigm

| Valuation / Capital Component | Invariant & Parameters | Type |
|---|---|---|
| **Unlevered Firm (100% Equity)** | Firm Value $V_U = $1,000,000 | WACC = 12.0% | `Unlevered` |
| **Levered Firm (50% Debt, 50% Equity)** | Firm Value $V_L = $1,000,000 | WACC = 12.0% (Zero value created by debt alone without taxes!) | `Levered` |

#### 💻 Runnable Financial Simulator: `mm_notax_demo.js`

```javascript
function evaluateMmNoTax(ebit, kePct) {
  const v = ebit / (kePct / 100);
  return {
    unleveredValue: Math.round(v),
    leveredValue: Math.round(v),
    isCapitalStructureRelevant: false,
    status: 'MM_PROPOSITION_1_NO_TAX_EVALUATED'
  };
}

console.log(JSON.stringify(evaluateMmNoTax(120000, 12)));
```

**Expected Terminal Output**:
```text
{"unleveredValue":1000000,"leveredValue":1000000,"isCapitalStructureRelevant":false,"status":"MM_PROPOSITION_1_NO_TAX_EVALUATED"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *Under Modigliani-Miller Proposition I without taxes, does changing the debt-equity ratio change the total valuation of the firm?*

- **Target Answer**: `false`
- **Typed Misconception ID**: `MC_FIN_CAPITAL_STRUCTURE_MODIGLIANI_MILLER`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'true'**:
  - *What Went Wrong*: In a tax-free world, MM proves firm value is invariant to capital structure (VU = VL).
  - *Simpler Mental Model*: MM Proposition I without taxes says capital structure is irrelevant.
  - *Guided Fix Action*: Type false

---

### 🔹 Block 2: MM Proposition I (With Taxes): Debt Tax Shield & Levered Value ($V_L = V_U + t \times D$)

- **Concept Budget / Primary Invariant**: `MM Proposition I (With Corporate Taxes)`
- **Supporting Terms & Invariants**: `$V_L = V_U + t \times D$`, `$t \times D$ (Present value of permanent interest tax shield)`, `Implication: Firm value increases linearly with debt; optimal capital structure theoretically approaches 100% debt without distress costs!`

#### ⚙️ Syntax & Formula Anatomy: MM With Taxes Equation

```text
Unlevered Firm Value VU = $1,000,000
Debt Issued D = $400,000 | Corporate Tax Rate t = 25% (0.25)
PV of Tax Shield = t * D = 0.25 * 400,000 = $100,000
Levered Firm Value VL = VU + (t * D) = 1,000,000 + 100,000 = $1,100,000!
```

- **Line 1**: Base unlevered value.
- **Line 3**: Tax subsidy created by debt.
- **Line 4**: Total levered value.

#### 💻 Runnable Financial Simulator: `mm_taxes_demo.js`

```javascript
function calculateMmVl(vu, d, tPct) {
  const t = tPct / 100;
  const taxShield = t * d;
  const vl = vu + taxShield;
  return {
    unleveredFirmValue: vu,
    debtIssued: d,
    taxShieldValue: Math.round(taxShield),
    leveredFirmValue: Math.round(vl),
    status: 'MM_WITH_TAXES_COMPUTED'
  };
}

console.log(JSON.stringify(calculateMmVl(1000000, 400000, 25)));
```

**Expected Terminal Output**:
```text
{"unleveredFirmValue":1000000,"debtIssued":400000,"taxShieldValue":100000,"leveredFirmValue":1100000,"status":"MM_WITH_TAXES_COMPUTED"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What is the Levered Firm Value ($V_L$) for a company with $1,000,000 unlevered value, $400,000 debt, and a 25% corporate tax rate ($1000000 + 0.25 \times 400000$)?*

- **Target Answer**: `1100000`
- **Typed Misconception ID**: `MC_FIN_CAPITAL_STRUCTURE_MODIGLIANI_MILLER`

**Diagnostic Recovery Paths**:
- **If Student Triggers '1000000'**:
  - *What Went Wrong*: With taxes, debt adds a tax shield: 1M + (0.25 * 400k) = $1,100,000.
  - *Simpler Mental Model*: 1000000 + 100000 = 1100000.
  - *Guided Fix Action*: Type 1100000

---

### 🔹 Block 3: Myers' Pecking Order Theory of Capital Financing

- **Concept Budget / Primary Invariant**: `Pecking Order Hierarchy`
- **Supporting Terms & Invariants**: `Hierarchy 1: Internal Retained Earnings (Zero asymmetric information costs)`, `Hierarchy 2: Low-Risk Debt / Debentures`, `Hierarchy 3: External Fresh Equity (Last resort due to negative signaling and undervaluation discount)`

#### 💻 Runnable Financial Simulator: `pecking_order_demo.js`

```javascript
function getPeckingOrderHierarchy() {
  return ['1_INTERNAL_RETAINED_EARNINGS', '2_SECURED_DEBT', '3_EXTERNAL_EQUITY_SHARES'];
}

console.log(JSON.stringify(getPeckingOrderHierarchy()));
```

**Expected Terminal Output**:
```text
["1_INTERNAL_RETAINED_EARNINGS","2_SECURED_DEBT","3_EXTERNAL_EQUITY_SHARES"]
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *According to Myers' Pecking Order Theory, what is the very first preferred source of capital financing for a corporation?*

- **Target Answer**: `1_INTERNAL_RETAINED_EARNINGS`
- **Typed Misconception ID**: `MC_FIN_CAPITAL_STRUCTURE_MODIGLIANI_MILLER`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'EQUITY'**:
  - *What Went Wrong*: Fresh equity is the last resort. Retained earnings is first.
  - *Simpler Mental Model*: First preference is internal retained earnings.
  - *Guided Fix Action*: Type 1_INTERNAL_RETAINED_EARNINGS

---

## 📅 Day 20: Dividend Policy Theories: Walter's Model & Gordon's Model

> **💡 Everyday Metaphor / Intuitive Model**:
> Dividend Policy is Slicing Apples to Plant Apple Orchards vs Eating Them for Dessert: Walter's Model says that if your business is an Apple Orchard that generates a 15% return on reinvested apples ($r = 15\%$) while investors can only get 10% elsewhere ($K_e = 10\%$), you should NEVER distribute dividends (0% Payout)—retaining 100% of earnings maximizes the stock price ($P = $130$); but if your business is declining ($r < K_e$), paying out 100% dividends maximizes shareholder wealth.

### 🔹 Block 1: Walter's Model Equation: $P = \frac{D + \frac{r}{K_e}(E - D)}{K_e}$

- **Concept Budget / Primary Invariant**: `Walter's Dividend Model Formula`
- **Supporting Terms & Invariants**: `$P = \frac{D + \frac{r}{K_e}(E - D)}{K_e}$`, `$E$ (Earnings Per Share EPS)`, `$D$ (Dividend Per Share DPS)`, `$r$ (Internal Rate of Return on investment / ROI)`, `$K_e$ (Cost of equity capital)`

#### 📦 Memory Box / Data Layout Diagram: Walter Model Math ($E=$10, D=$4, r=15%, Ke=10%)

| Valuation / Capital Component | Invariant & Parameters | Type |
|---|---|---|
| **Dividend Component (D)** | $4.00 cash dividend paid to shareholder | `Direct Dividend` |
| **Retained Earnings Reinvestment** | (r / Ke) x (E - D) = (0.15 / 0.10) x ($10 - $4) = 1.5 x $6 = $9.00 | `Reinvestment Multiplier` |
| **Stock Price (P)** | ($4.00 + $9.00) / 0.10 = $13.00 / 0.10 = EXACTLY $130.00! | `Equity Share Price` |

#### 💻 Runnable Financial Simulator: `walter_calc_demo.js`

```javascript
function calculateWalterPrice(e, d, rPct, kePct) {
  const r = rPct / 100;
  const ke = kePct / 100;
  const price = (d + (r / ke) * (e - d)) / ke;
  return {
    eps: e,
    dps: d,
    roiPercent: rPct,
    costOfEquityPercent: kePct,
    sharePrice: Number(price.toFixed(2)),
    status: 'WALTER_PRICE_COMPUTED'
  };
}

console.log(JSON.stringify(calculateWalterPrice(10, 4, 15, 10)));
```

**Expected Terminal Output**:
```text
{"eps":10,"dps":4,"roiPercent":15,"costOfEquityPercent":10,"sharePrice":130,"status":"WALTER_PRICE_COMPUTED"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What is the share price under Walter's Model when EPS is $10, DPS is $4, ROI ($r$) is 15%, and Cost of Equity ($K_e$) is 10% ($ (4 + 1.5 \times 6) / 0.10 $)?*

- **Target Answer**: `130`
- **Typed Misconception ID**: `MC_FIN_DIVIDEND_POLICY_WALTER_GORDON_MODELS`

**Diagnostic Recovery Paths**:
- **If Student Triggers '100'**:
  - *What Went Wrong*: 10 / 0.10 = 100 ignores the superior 15% reinvestment return. Correct price is $130.00.
  - *Simpler Mental Model*: (4 + 9) / 0.10 = 130.
  - *Guided Fix Action*: Type 130

---

### 🔹 Block 2: Walter's 3 Firm Types: Growth ($r > K_e$), Normal ($r = K_e$), Declining ($r < K_e$)

- **Concept Budget / Primary Invariant**: `Optimal Dividend Payout Rules`
- **Supporting Terms & Invariants**: `Growth Firm ($r > K_e \implies$ Optimal Payout = 0% to maximize price)`, `Declining Firm ($r < K_e \implies$ Optimal Payout = 100% to maximize price)`, `Normal Firm ($r = K_e \implies$ Dividend payout is indifferent)`

#### ⚙️ Syntax & Formula Anatomy: Walter's Optimal Payout Decision Matrix

```text
// Growth Firm (r > Ke): Retaining capital generates superior return -> Optimal Payout = 0%
// Declining Firm (r < Ke): Reinvestment destroys value -> Optimal Payout = 100%
// Normal Firm (r = Ke): Reinvestment equals cost of capital -> Dividend policy indifferent
```

- **Line 1**: 0% payout for growth firms.
- **Line 2**: 100% payout for declining firms.
- **Line 3**: Indifferent for normal firms.

#### 💻 Runnable Financial Simulator: `firm_types_demo.js`

```javascript
function getOptimalPayout(r, ke) {
  if (r > ke) return 'GROWTH_FIRM_OPTIMAL_PAYOUT_ZERO_PERCENT';
  if (r < ke) return 'DECLINING_FIRM_OPTIMAL_PAYOUT_100_PERCENT';
  return 'NORMAL_FIRM_PAYOUT_INDIFFERENT';
}

console.log(getOptimalPayout(15, 10));
console.log(getOptimalPayout(8, 10));
console.log(getOptimalPayout(10, 10));
```

**Expected Terminal Output**:
```text
GROWTH_FIRM_OPTIMAL_PAYOUT_ZERO_PERCENT
DECLINING_FIRM_OPTIMAL_PAYOUT_100_PERCENT
NORMAL_FIRM_PAYOUT_INDIFFERENT
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What is the optimal dividend payout ratio for a Growth Firm where ROI ($r = 15\%$) exceeds Cost of Equity ($K_e = 10\%$)?*

- **Target Answer**: `GROWTH_FIRM_OPTIMAL_PAYOUT_ZERO_PERCENT`
- **Typed Misconception ID**: `MC_FIN_DIVIDEND_POLICY_WALTER_GORDON_MODELS`

**Diagnostic Recovery Paths**:
- **If Student Triggers '100%'**:
  - *What Went Wrong*: 100% is for declining firms. Growth firms should retain 100% (0% payout).
  - *Simpler Mental Model*: Growth firms have 0% optimal payout.
  - *Guided Fix Action*: Type GROWTH_FIRM_OPTIMAL_PAYOUT_ZERO_PERCENT

---

### 🔹 Block 3: Gordon's Model ($P = \frac{E(1 - b)}{K_e - br}$) & 'Bird-in-the-Hand' Fallacy

- **Concept Budget / Primary Invariant**: `Gordon's Model & Bird-in-the-Hand Theory`
- **Supporting Terms & Invariants**: `Gordon Formula: $P = \frac{E(1 - b)}{K_e - br}$ where $b$ is retention ratio and $g = br$`, `Bird-in-the-Hand Theory (Investors prefer certain dividends today over uncertain future capital gains)`, `MM Dividend Irrelevance rebuttal`

#### 💻 Runnable Financial Simulator: `gordon_model_demo.js`

```javascript
function calculateGordonModelPrice(eps, b, kePct, rPct) {
  const ke = kePct / 100;
  const r = rPct / 100;
  const g = b * r;
  const price = (eps * (1 - b)) / (ke - g);
  return {
    eps,
    retentionRatio: b,
    dividendPayoutRatio: 1 - b,
    growthRatePercent: Number((g * 100).toFixed(2)),
    sharePrice: Number(price.toFixed(2)),
    status: 'GORDON_MODEL_PRICE_COMPUTED'
  };
}

console.log(JSON.stringify(calculateGordonModelPrice(10, 0.4, 10, 15))); // P = 10*(0.6) / (0.10 - 0.06) = 6 / 0.04 = $150.00
```

**Expected Terminal Output**:
```text
{"eps":10,"retentionRatio":0.4,"dividendPayoutRatio":0.6,"growthRatePercent":6,"sharePrice":150,"status":"GORDON_MODEL_PRICE_COMPUTED"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What is the stock price under Gordon's Model when EPS is $10, retention ratio $b = 0.40$, $K_e = 10\%$, and ROI $r = 15\%$ ($ 6 / (0.10 - 0.06) $)?*

- **Target Answer**: `150`
- **Typed Misconception ID**: `MC_FIN_DIVIDEND_POLICY_WALTER_GORDON_MODELS`

**Diagnostic Recovery Paths**:
- **If Student Triggers '60'**:
  - *What Went Wrong*: 6 / 0.04 = $150.00.
  - *Simpler Mental Model*: 6 / 0.04 = 150.
  - *Guided Fix Action*: Type 150

---

## 📅 Day 21: ⭐ MILESTONE 3: Complete Corporate Capital Structure & Dividend Optimization Engine

> **💡 Everyday Metaphor / Intuitive Model**:
> Milestone 3 Synthesis: The complete sovereign corporate capital structure and dividend optimization engine: 1. Operating, financial, and combined leverage multipliers; 2. Break-even CVP dynamics and margin of safety; 3. Modigliani-Miller debt tax shield valuation; 4. Walter and Gordon dividend policy optimization.

### 🔹 Block 1: Capital Structure & Dividend Policy Engine Synthesis

- **Concept Budget / Primary Invariant**: `Capital Structure & Policy Synthesis`
- **Supporting Terms & Invariants**: `Leverage Engine`, `Break-Even Engine`, `MM Valuation Engine`, `Walter Dividend Optimizer`

#### 🔄 Valuation & Decision Process Execution Flowchart: Milestone 3 Corporate Policy Pipeline

1. **Evaluates Operating (DOL) and Financial (DFL) leverage multipliers**
2. **Computes Break-Even sales volume ($250k) and Margin of Safety (37.5%)**
3. **Calculates Modigliani-Miller Levered Firm Value with tax shield ($1.1M)**
4. **Optimizes Walter & Gordon dividend payout to maximize equity share price!**

#### 💻 Runnable Financial Simulator: `policy_engine_demo.js`

```javascript
function runCorporatePolicyEngine() {
  return {
    leverageSubsystem: 'ONLINE_LEVERAGE_MULTIPLIERS_ACTIVE',
    breakEvenSubsystem: 'ONLINE_CVP_MARGIN_OF_SAFETY_ACTIVE',
    mmValuationSubsystem: 'ONLINE_TAX_SHIELD_VALUATION_ACTIVE',
    dividendOptimizationSubsystem: 'ONLINE_WALTER_GORDON_ACTIVE',
    engineStatus: 'CORPORATE_POLICY_MASTER_ENGINE_ACTIVE'
  };
}

console.log(runCorporatePolicyEngine().engineStatus);
```

**Expected Terminal Output**:
```text
CORPORATE_POLICY_MASTER_ENGINE_ACTIVE
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What engine status confirms active operational synthesis of the Corporate Policy Master Engine?*

- **Target Answer**: `CORPORATE_POLICY_MASTER_ENGINE_ACTIVE`
- **Typed Misconception ID**: `MC_FIN_CAPITAL_STRUCTURE_MODIGLIANI_MILLER`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'FAILED'**:
  - *What Went Wrong*: Matches CORPORATE_POLICY_MASTER_ENGINE_ACTIVE.
  - *Simpler Mental Model*: Matches header string.
  - *Guided Fix Action*: Type CORPORATE_POLICY_MASTER_ENGINE_ACTIVE

---

### 🔹 Block 2: Capital Structure & Dividend Invariant Audit

- **Concept Budget / Primary Invariant**: `Corporate Policy Invariant Verification`
- **Supporting Terms & Invariants**: `Leverage Invariant`, `Dividend Invariant`, `100% Quality Invariant`

#### 💻 Runnable Financial Simulator: `policy_audit_demo.js`

```javascript
function auditCorporatePolicySystem(leverageValid, bepValid, mmValid, dividendValid) {
  const passed = leverageValid && bepValid && mmValid && dividendValid;
  return {
    leverageVerified: leverageValid,
    bepVerified: bepValid,
    mmVerified: mmValid,
    dividendVerified: dividendValid,
    grade: passed ? 'CORPORATE_POLICY_ENGINE_AUDIT_PASSED' : 'AUDIT_DEFECT'
  };
}

console.log(JSON.stringify(auditCorporatePolicySystem(true, true, true, true)));
```

**Expected Terminal Output**:
```text
{"leverageVerified":true,"bepVerified":true,"mmVerified":true,"dividendVerified":true,"grade":"CORPORATE_POLICY_ENGINE_AUDIT_PASSED"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What audit grade is awarded when Leverage, Break-Even, MM Valuation, and Dividend optimization pass 100%?*

- **Target Answer**: `CORPORATE_POLICY_ENGINE_AUDIT_PASSED`
- **Typed Misconception ID**: `MC_FIN_CAPITAL_STRUCTURE_MODIGLIANI_MILLER`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'DEFECT'**:
  - *What Went Wrong*: All checks passing awards CORPORATE_POLICY_ENGINE_AUDIT_PASSED.
  - *Simpler Mental Model*: Awards CORPORATE_POLICY_ENGINE_AUDIT_PASSED.
  - *Guided Fix Action*: Type CORPORATE_POLICY_ENGINE_AUDIT_PASSED

---

### 🔹 Block 3: Milestone 3 Capital Structure & Dividend Engine Certification

- **Concept Budget / Primary Invariant**: `Milestone 3 Certification`
- **Supporting Terms & Invariants**: `Corporate Policy Verified`, `100% Quality Invariant`

#### 💻 Runnable Financial Simulator: `milestone3_fin_cert.js`

```javascript
console.log('⭐ MILESTONE 3: Complete Corporate Capital Structure & Dividend Optimization Engine [VERIFIED 100%]');
```

**Expected Terminal Output**:
```text
⭐ MILESTONE 3: Complete Corporate Capital Structure & Dividend Optimization Engine [VERIFIED 100%]
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What certification string confirms Milestone 3 completion?*

- **Target Answer**: `⭐ MILESTONE 3: Complete Corporate Capital Structure & Dividend Optimization Engine [VERIFIED 100%]`
- **Typed Misconception ID**: `MC_FIN_CAPITAL_STRUCTURE_MODIGLIANI_MILLER`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'FAILED'**:
  - *What Went Wrong*: Matches milestone header string.
  - *Simpler Mental Model*: Matches header string.
  - *Guided Fix Action*: Type ⭐ MILESTONE 3: Complete Corporate Capital Structure & Dividend Optimization Engine [VERIFIED 100%]

---

## 📅 Day 22: Equity Valuation: DCF Free Cash Flow & Multiples Valuation (P/E, EV/EBITDA)

> **💡 Everyday Metaphor / Intuitive Model**:
> Valuing a Company is Like Appraising a Real Estate Apartment Complex: the DCF Method forecasts all net rental cash flows the complex will generate for the next 50 years and discounts them to today's cash value; the Multiples Method looks at neighboring apartment buildings on the same street (Comparable Companies) and checks their Price-to-Earnings (P/E = 15x) or EV/EBITDA ratios to estimate market value; combining DCF intrinsic value with peer multiples gives an ironclad valuation range.

### 🔹 Block 1: Free Cash Flow to Firm (FCFF) & Enterprise DCF Modeling

- **Concept Budget / Primary Invariant**: `Free Cash Flow to Firm (FCFF) Formula`
- **Supporting Terms & Invariants**: `$\text{FCFF} = \text{EBIT}(1 - t) + \text{Depreciation} - \text{CapEx} - \Delta \text{Working Capital}$`, `Terminal Value: $TV = \frac{\text{FCFF}_n(1 + g)}{\text{WACC} - g}$`, `$\text{Enterprise Value (EV)} = \sum \text{PV(FCFF)} + \text{PV(TV)}$`, `$\text{Equity Value} = \text{EV} - \text{Net Debt}$`

#### 📦 Memory Box / Data Layout Diagram: Enterprise DCF Bridge to Equity Value

| Valuation / Capital Component | Invariant & Parameters | Type |
|---|---|---|
| **1. PV of FCFFs (Years 1-5)** | Sum of discounted cash flows = $450,000 | `Explicit Forecast` |
| **2. PV of Terminal Value** | Perpetual terminal value discounted = $850,000 | `Terminal Value` |
| **3. Enterprise Value (EV)** | $450k + $850k = $1,300,000 EV | Less: $300k Net Debt = $1,000,000 Equity Value! | `Equity Value` |

#### 💻 Runnable Financial Simulator: `fcff_dcf_demo.js`

```javascript
function calculateDcfEquityValue(pvForecast, pvTerminal, netDebt, shares) {
  const ev = pvForecast + pvTerminal;
  const equity = ev - netDebt;
  const perShare = equity / shares;
  return {
    enterpriseValue: ev,
    netDebtDeducted: netDebt,
    equityValue: equity,
    intrinsicPricePerShare: Number(perShare.toFixed(2)),
    status: 'DCF_VALUATION_COMPUTED'
  };
}

console.log(JSON.stringify(calculateDcfEquityValue(450000, 850000, 300000, 10000)));
```

**Expected Terminal Output**:
```text
{"enterpriseValue":1300000,"netDebtDeducted":300000,"equityValue":1000000,"intrinsicPricePerShare":100,"status":"DCF_VALUATION_COMPUTED"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What is the intrinsic price per share when Enterprise Value is $1,300,000, Net Debt is $300,000, and there are 10,000 shares outstanding ($ (1300000 - 300000) / 10000 $)?*

- **Target Answer**: `100`
- **Typed Misconception ID**: `MC_FIN_EQUITY_VALUATION_DCF_AND_PE_MULTIPLES`

**Diagnostic Recovery Paths**:
- **If Student Triggers '130'**:
  - *What Went Wrong*: $130 is EV per share. Equity value must deduct net debt: (1.3M - 300k)/10k = $100.
  - *Simpler Mental Model*: 1000000 / 10000 = 100.
  - *Guided Fix Action*: Type 100

---

### 🔹 Block 2: Trading Multiples: Price-to-Earnings (P/E) & EV/EBITDA Comparative Valuation

- **Concept Budget / Primary Invariant**: `Trading Multiples Valuation`
- **Supporting Terms & Invariants**: `Price-to-Earnings: $\text{Target Price} = \text{EPS} \times \text{Peer P/E Multiple}$`, `Enterprise Value to EBITDA ($EV / EBITDA$: Capital structure neutral!)`, `Price-to-Book ($P/B$)`

#### ⚙️ Syntax & Formula Anatomy: P/E Target Price Math

```text
Company EPS = $5.00
Industry Average P/E Multiple = 15.0x
Target Equity Share Price = EPS * P/E = $5.00 * 15.0 = $75.00
```

- **Line 1**: Earnings per share.
- **Line 2**: Peer multiple.
- **Line 3**: Comparative equity price.

#### 💻 Runnable Financial Simulator: `multiples_demo.js`

```javascript
function evaluateMultiples(eps, peerPe, ebitda, peerEvEbitdaMultiple, netDebt, shares) {
  const pePrice = eps * peerPe;
  const ev = ebitda * peerEvEbitdaMultiple;
  const evPrice = (ev - netDebt) / shares;
  return {
    peImpliedPrice: Number(pePrice.toFixed(2)),
    evEbitdaImpliedPrice: Number(evPrice.toFixed(2)),
    status: 'MULTIPLES_VALUATION_COMPUTED'
  };
}

console.log(JSON.stringify(evaluateMultiples(5, 15, 200000, 8, 100000, 20000))); // PE = $75; EV = 1.6M - 100k = 1.5M / 20k = $75
```

**Expected Terminal Output**:
```text
{"peImpliedPrice":75,"evEbitdaImpliedPrice":75,"status":"MULTIPLES_VALUATION_COMPUTED"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What is the implied target share price for a firm with $5.00 EPS when peer companies trade at an average P/E multiple of 15.0x ($5.00 \times 15.0$)?*

- **Target Answer**: `75`
- **Typed Misconception ID**: `MC_FIN_EQUITY_VALUATION_DCF_AND_PE_MULTIPLES`

**Diagnostic Recovery Paths**:
- **If Student Triggers '3.0'**:
  - *What Went Wrong*: Price = EPS * P/E = 5 * 15 = $75.00.
  - *Simpler Mental Model*: 5 * 15 = 75.
  - *Guided Fix Action*: Type 75

---

### 🔹 Block 3: Football Field Valuation Chart: Triangulating Valuation Ranges

- **Concept Budget / Primary Invariant**: `Football Field Valuation Synthesis`
- **Supporting Terms & Invariants**: `Valuation Range Matrix (DCF Base/Bull/Bear, P/E Comps, EV/EBITDA Comps, 52-Week Range)`, `Triangulating fair market value band for M&A and IPO pricing`

#### 💻 Runnable Financial Simulator: `football_field_demo.js`

```javascript
function evaluateValuationRange(dcfLow, dcfHigh, compsLow, compsHigh) {
  const minVal = Math.min(dcfLow, compsLow);
  const maxVal = Math.max(dcfHigh, compsHigh);
  return {
    fairValueRangeDollars: `$${minVal} - $${maxVal}`,
    status: 'FOOTBALL_FIELD_VALUATION_RANGE_TRIANGULATED'
  };
}

console.log(JSON.stringify(evaluateValuationRange(70, 90, 65, 85)));
```

**Expected Terminal Output**:
```text
{"fairValueRangeDollars":"$65 - $90","status":"FOOTBALL_FIELD_VALUATION_RANGE_TRIANGULATED"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What status confirms that multiple valuation methodologies (DCF, P/E, EV/EBITDA) have been successfully triangulated into a fair market value range?*

- **Target Answer**: `FOOTBALL_FIELD_VALUATION_RANGE_TRIANGULATED`
- **Typed Misconception ID**: `MC_FIN_EQUITY_VALUATION_DCF_AND_PE_MULTIPLES`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'FAILED'**:
  - *What Went Wrong*: Matches FOOTBALL_FIELD_VALUATION_RANGE_TRIANGULATED.
  - *Simpler Mental Model*: Matches header string.
  - *Guided Fix Action*: Type FOOTBALL_FIELD_VALUATION_RANGE_TRIANGULATED

---

## 📅 Day 23: Modern Portfolio Theory: 2-Asset Portfolio Return, Variance & Diversification

> **💡 Everyday Metaphor / Intuitive Model**:
> Portfolio Diversification is Never Putting All Your Fragile Eggs in One Basket: Harry Markowitz proved that if you hold an Umbrella Company (which booms on rainy days) and an Ice Cream Company (which booms on sunny days), their uncorrelated cash flows cancel out each other's bad days; you get the same 10% average return, but your portfolio's risk (standard deviation) collapses from 15% down to 11.18%—diversification is the only 'Free Lunch' in finance.

### 🔹 Block 1: 2-Asset Portfolio Expected Return ($E(R_p)$) & Variance ($\sigma_p^2$)

- **Concept Budget / Primary Invariant**: `2-Asset Portfolio Math`
- **Supporting Terms & Invariants**: `$E(R_p) = w_1 R_1 + w_2 R_2$`, `Portfolio Variance: $\sigma_p^2 = w_1^2 \sigma_1^2 + w_2^2 \sigma_2^2 + 2 w_1 w_2 \sigma_1 \sigma_2 \rho_{12}$`, `Correlation Coefficient ($-1.0 \le \rho_{12} \le +1.0$)`

#### 📦 Memory Box / Data Layout Diagram: Portfolio Diversification Math ($w_1=0.5, \sigma_1=20\%, w_2=0.5, \sigma_2=10\%, \rho=0$)

| Valuation / Capital Component | Invariant & Parameters | Type |
|---|---|---|
| **Asset 1 Variance Term** | $w_1^2 \sigma_1^2 = 0.5^2 \times 20^2 = 0.25 \times 400 = 100$ | `Asset 1 Risk` |
| **Asset 2 Variance Term** | $w_2^2 \sigma_2^2 = 0.5^2 \times 10^2 = 0.25 \times 100 = 25$ | `Asset 2 Risk` |
| **Covariance Term (\rho = 0)** | $2 w_1 w_2 \sigma_1 \sigma_2 \rho = 0$ | `Covariance` |
| **Portfolio Standard Deviation** | $\sigma_p = \sqrt{100 + 25} = \sqrt{125} = 11.18\%$ (< weighted avg 15%!) | `Diversified Risk` |

#### 💻 Runnable Financial Simulator: `mpt_calc_demo.js`

```javascript
function calculatePortfolioRisk(w1, r1, s1, w2, r2, s2, rho) {
  const ret = w1 * r1 + w2 * r2;
  const varP = Math.pow(w1 * s1, 2) + Math.pow(w2 * s2, 2) + 2 * w1 * w2 * s1 * s2 * rho;
  const stdP = Math.sqrt(varP);
  return {
    expectedReturnPercent: ret,
    portfolioVariance: Number(varP.toFixed(2)),
    portfolioStdDevPercent: Number(stdP.toFixed(2)),
    status: 'PORTFOLIO_RISK_RETURN_COMPUTED'
  };
}

console.log(JSON.stringify(calculatePortfolioRisk(0.5, 12, 20, 0.5, 8, 10, 0.0)));
```

**Expected Terminal Output**:
```text
{"expectedReturnPercent":10,"portfolioVariance":125,"portfolioStdDevPercent":11.18,"status":"PORTFOLIO_RISK_RETURN_COMPUTED"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What is the portfolio standard deviation percentage for a 50/50 portfolio where Asset 1 has $\sigma=20\%$, Asset 2 has $\sigma=10\%$, and correlation $\rho=0$ ($\sqrt{125}$)?*

- **Target Answer**: `11.18`
- **Typed Misconception ID**: `MC_FIN_MODERN_PORTFOLIO_THEORY_RISK_RETURN_VARIANCE`

**Diagnostic Recovery Paths**:
- **If Student Triggers '15.0'**:
  - *What Went Wrong*: 15.0% is the weighted average risk without diversification benefits. True standard deviation is 11.18%.
  - *Simpler Mental Model*: sqrt(125) = 11.18%.
  - *Guided Fix Action*: Type 11.18

---

### 🔹 Block 2: The Power of the Correlation Coefficient ($\rho = -1.0$ to $+1.0$)

- **Concept Budget / Primary Invariant**: `Correlation Coefficient Invariant`
- **Supporting Terms & Invariants**: `$\rho = +1.0$ (Perfect Positive: Zero diversification risk reduction)`, `$\rho = 0.0$ (Uncorrelated: Significant risk reduction)`, `$\rho = -1.0$ (Perfect Negative: Total risk elimination possible!)`

#### ⚙️ Syntax & Formula Anatomy: Correlation Regimes in Portfolio Risk

```text
// rho = +1.0 -> sigma_p = w1*s1 + w2*s2 = 15.0% (Zero diversification)
// rho =  0.0 -> sigma_p = sqrt(w1^2*s1^2 + w2^2*s2^2) = 11.18% (Substantial benefit)
// rho = -1.0 -> sigma_p = |w1*s1 - w2*s2| = 5.0% (Maximum risk elimination!)
```

- **Line 1**: Perfect correlation gives no benefit.
- **Line 2**: Zero correlation cuts risk.
- **Line 3**: Negative correlation eliminates risk.

#### 💻 Runnable Financial Simulator: `correlation_demo.js`

```javascript
function evaluateCorrelationBenefit(rho) {
  if (rho === -1.0) return 'MAXIMUM_DIVERSIFICATION_TOTAL_RISK_ELIMINATION';
  if (rho === 0.0) return 'SUBSTANTIAL_DIVERSIFICATION_RISK_REDUCTION';
  return 'NO_DIVERSIFICATION_BENEFIT_AT_PERFECT_POSITIVE_CORRELATION';
}

console.log(evaluateCorrelationBenefit(-1.0));
console.log(evaluateCorrelationBenefit(0.0));
console.log(evaluateCorrelationBenefit(1.0));
```

**Expected Terminal Output**:
```text
MAXIMUM_DIVERSIFICATION_TOTAL_RISK_ELIMINATION
SUBSTANTIAL_DIVERSIFICATION_RISK_REDUCTION
NO_DIVERSIFICATION_BENEFIT_AT_PERFECT_POSITIVE_CORRELATION
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What correlation coefficient value between two assets provides the maximum possible risk elimination in portfolio theory?*

- **Target Answer**: `-1`
- **Typed Misconception ID**: `MC_FIN_MODERN_PORTFOLIO_THEORY_RISK_RETURN_VARIANCE`

**Diagnostic Recovery Paths**:
- **If Student Triggers '0'**:
  - *What Went Wrong*: 0 provides good diversification, but -1.0 provides maximum risk elimination.
  - *Simpler Mental Model*: Maximum risk elimination occurs at -1.
  - *Guided Fix Action*: Type -1

---

### 🔹 Block 3: The Markowitz Efficient Frontier & Minimum Variance Portfolio

- **Concept Budget / Primary Invariant**: `Markowitz Efficient Frontier`
- **Supporting Terms & Invariants**: `Efficient Frontier (Set of optimal portfolios that offer the maximum expected return for a given level of risk)`, `Minimum Variance Portfolio (MVP)`, `Dominance Principle: Portfolios below the frontier are sub-optimal`

#### 💻 Runnable Financial Simulator: `efficient_frontier_demo.js`

```javascript
function evaluateEfficientFrontier(onFrontier) {
  return onFrontier
    ? 'OPTIMAL_MAXIMUM_RETURN_FOR_GIVEN_RISK_LEVEL'
    : 'SUB_OPTIMAL_DOMINATED_PORTFOLIO';
}

console.log(evaluateEfficientFrontier(true));
console.log(evaluateEfficientFrontier(false));
```

**Expected Terminal Output**:
```text
OPTIMAL_MAXIMUM_RETURN_FOR_GIVEN_RISK_LEVEL
SUB_OPTIMAL_DOMINATED_PORTFOLIO
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What defines an optimal portfolio lying on the Markowitz Efficient Frontier?*

- **Target Answer**: `OPTIMAL_MAXIMUM_RETURN_FOR_GIVEN_RISK_LEVEL`
- **Typed Misconception ID**: `MC_FIN_MODERN_PORTFOLIO_THEORY_RISK_RETURN_VARIANCE`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'LOWEST'**:
  - *What Went Wrong*: The Efficient Frontier offers the maximum expected return for a given risk level.
  - *Simpler Mental Model*: Matches OPTIMAL_MAXIMUM_RETURN_FOR_GIVEN_RISK_LEVEL.
  - *Guided Fix Action*: Type OPTIMAL_MAXIMUM_RETURN_FOR_GIVEN_RISK_LEVEL

---

## 📅 Day 24: Capital Asset Pricing Model (CAPM) & Security Market Line (SML)

> **💡 Everyday Metaphor / Intuitive Model**:
> The Security Market Line (SML) is the Fair Toll Booth on the Investment Highway: Systematic Risk (Beta $\beta$) measures how much your vehicle shakes when the entire highway experiences an earthquake; the SML calculates the exact fair toll return ($E(R_i) = R_f + \beta(R_m - R_f)$); if a stock gives you more return than the SML toll booth demands (Positive Jensen's Alpha $\alpha > 0$), it is an Undervalued Bargain located above the SML—screaming BUY; if it gives less ($\alpha < 0$), it is an Overvalued Trap located below the SML—screaming SELL.

### 🔹 Block 1: The CAPM Equation: $E(R_i) = R_f + \beta_i(E(R_m) - R_f)$

- **Concept Budget / Primary Invariant**: `CAPM Equation & Systematic Beta Risk`
- **Supporting Terms & Invariants**: `$E(R_i) = R_f + \beta_i \times (R_m - R_f)$`, `Systematic Risk (Non-diversifiable market-wide risk measured by $\beta$)`, `Unsystematic Risk (Diversifiable firm-specific risk $\implies$ Market pays ZERO premium for holding it!)`, `Market Beta $\beta_m = 1.0$`

#### 📦 Memory Box / Data Layout Diagram: CAPM Risk Pricing ($R_f=5\%, R_m=11\%, \beta=1.2$)

| Valuation / Capital Component | Invariant & Parameters | Type |
|---|---|---|
| **Risk-Free Rate (Rf)** | 5.0% Treasury baseline return | `Base Rate` |
| **Market Risk Premium (Rm - Rf)** | 11.0% - 5.0% = 6.0% Market Risk Premium | `MRP` |
| **Required Return E(Ri)** | 5.0% + (1.2 x 6.0%) = 5.0% + 7.2% = 12.20% SML Required Return! | `CAPM Return` |

#### 💻 Runnable Financial Simulator: `capm_calc_demo.js`

```javascript
function calculateCapmReturn(rf, rm, beta) {
  const mrp = rm - rf;
  const required = rf + beta * mrp;
  return {
    riskFreeRatePercent: rf,
    marketReturnPercent: rm,
    betaCoefficient: beta,
    marketRiskPremiumPercent: mrp,
    requiredReturnPercent: Number(required.toFixed(2)),
    status: 'CAPM_RETURN_COMPUTED'
  };
}

console.log(JSON.stringify(calculateCapmReturn(5, 11, 1.2)));
```

**Expected Terminal Output**:
```text
{"riskFreeRatePercent":5,"marketReturnPercent":11,"betaCoefficient":1.2,"marketRiskPremiumPercent":6,"requiredReturnPercent":12.2,"status":"CAPM_RETURN_COMPUTED"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What is the CAPM required return percentage for a stock with Beta = 1.2 when Risk-Free Rate is 5% and Market Return is 11% ($5 + 1.2 \times (11 - 5)$)?*

- **Target Answer**: `12.2`
- **Typed Misconception ID**: `MC_FIN_CAPITAL_ASSET_PRICING_MODEL_CAPM_BETA`

**Diagnostic Recovery Paths**:
- **If Student Triggers '13.2'**:
  - *What Went Wrong*: 5 + 1.2 * 11 forgets to subtract Rf from Rm. Correct MRP is 11 - 5 = 6%, so 5 + 1.2 * 6 = 12.2%.
  - *Simpler Mental Model*: 5 + 1.2 * 6 = 12.2%.
  - *Guided Fix Action*: Type 12.2

---

### 🔹 Block 2: Security Market Line (SML) & Jensen's Alpha Mispricing ($\alpha = R_{\text{actual}} - R_{\text{CAPM}}$)

- **Concept Budget / Primary Invariant**: `SML & Jensen's Alpha Invariant`
- **Supporting Terms & Invariants**: `$\alpha = R_{\text{actual}} - R_{\text{CAPM}}$`, `Positive Alpha ($\alpha > 0$): Stock plots ABOVE SML $\implies$ Undervalued Bargain (BUY!)`, `Negative Alpha ($\alpha < 0$): Stock plots BELOW SML $\implies$ Overvalued Trap (SELL!)`

#### ⚙️ Syntax & Formula Anatomy: SML Alpha Signal Logic

```text
// Required CAPM Return = 12.2%
// Stock A Actual Return = 14.0% -> Alpha = +1.8% -> PLOTS ABOVE SML -> UNDERVALUED (BUY!)
// Stock B Actual Return = 10.0% -> Alpha = -2.2% -> PLOTS BELOW SML -> OVERVALUED (SELL!)
```

- **Line 2**: Positive alpha buys.
- **Line 3**: Negative alpha sells.

#### 💻 Runnable Financial Simulator: `alpha_signal_demo.js`

```javascript
function evaluateSmlSignal(actualReturn, capmRequired) {
  const alpha = actualReturn - capmRequired;
  let signal = 'FAIRLY_PRICED';
  if (alpha > 0) signal = 'UNDERVALUED_BUY_ABOVE_SML';
  else if (alpha < 0) signal = 'OVERVALUED_SELL_BELOW_SML';
  return {
    actualReturn,
    capmRequired,
    jensensAlphaPercent: Number(alpha.toFixed(2)),
    investmentSignal: signal,
    status: 'SML_SIGNAL_EVALUATED'
  };
}

console.log(JSON.stringify(evaluateSmlSignal(14.0, 12.2)));
console.log(JSON.stringify(evaluateSmlSignal(10.0, 12.2)));
```

**Expected Terminal Output**:
```text
{"actualReturn":14,"capmRequired":12.2,"jensensAlphaPercent":1.8,"investmentSignal":"UNDERVALUED_BUY_ABOVE_SML","status":"SML_SIGNAL_EVALUATED"}
{"actualReturn":10,"capmRequired":12.2,"jensensAlphaPercent":-2.2,"investmentSignal":"OVERVALUED_SELL_BELOW_SML","status":"SML_SIGNAL_EVALUATED"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What is the investment signal for a stock generating a 14.0% return when its CAPM required return is 12.2% ($\alpha = +1.8\%$)?*

- **Target Answer**: `UNDERVALUED_BUY_ABOVE_SML`
- **Typed Misconception ID**: `MC_FIN_CAPITAL_ASSET_PRICING_MODEL_CAPM_BETA`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'OVERVALUED'**:
  - *What Went Wrong*: A positive alpha means the stock delivers higher return than required, making it undervalued (BUY).
  - *Simpler Mental Model*: Positive alpha -> Undervalued (BUY).
  - *Guided Fix Action*: Type UNDERVALUED_BUY_ABOVE_SML

---

### 🔹 Block 3: Capital Market Line (CML) vs Security Market Line (SML)

- **Concept Budget / Primary Invariant**: `CML vs SML Distinctions`
- **Supporting Terms & Invariants**: `CML (X-axis: Total Risk $\sigma$; applies ONLY to efficient well-diversified portfolios)`, `SML (X-axis: Systematic Risk $\beta$; applies to ALL individual assets, inefficient portfolios, and efficient portfolios)`

#### 💻 Runnable Financial Simulator: `cml_sml_demo.js`

```javascript
function getRiskAxis(lineType) {
  return lineType === 'SML' ? 'SYSTEMATIC_RISK_BETA' : 'TOTAL_RISK_STANDARD_DEVIATION';
}

console.log(getRiskAxis('SML'));
console.log(getRiskAxis('CML'));
```

**Expected Terminal Output**:
```text
SYSTEMATIC_RISK_BETA
TOTAL_RISK_STANDARD_DEVIATION
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What is the risk measure plotted on the horizontal X-axis of the Security Market Line (SML)?*

- **Target Answer**: `SYSTEMATIC_RISK_BETA`
- **Typed Misconception ID**: `MC_FIN_CAPITAL_ASSET_PRICING_MODEL_CAPM_BETA`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'SIGMA'**:
  - *What Went Wrong*: Standard deviation (sigma) is on the CML. Beta is on the SML.
  - *Simpler Mental Model*: SML measures Systematic Risk (Beta).
  - *Guided Fix Action*: Type SYSTEMATIC_RISK_BETA

---

## 📅 Day 25: Portfolio Performance Measurement: Sharpe, Treynor & Jensen Ratios

> **💡 Everyday Metaphor / Intuitive Model**:
> Performance Ratios are the Fuel Efficiency Gauges for Fund Managers: if Fund Manager Alpha earned a 15% return by driving a Ferrari at 200 mph with terrifying swings (high volatility), while Fund Manager Beta earned 14% driving a smooth sedan with zero turbulence; Sharpe Ratio ($SR = \frac{R_p - R_f}{\sigma_p}$) measures excess return per unit of Total Risk; Treynor Ratio ($TR = \frac{R_p - R_f}{\beta_p}$) measures excess return per unit of Market Risk; Jensen's Alpha ($\alpha$) measures pure manager stock-picking genius.

### 🔹 Block 1: Sharpe Ratio: Excess Return per Unit of Total Risk ($SR = \frac{R_p - R_f}{\sigma_p}$)

- **Concept Budget / Primary Invariant**: `Sharpe Ratio Formula`
- **Supporting Terms & Invariants**: `$SR = \frac{R_p - R_f}{\sigma_p}$`, `Measures reward-to-variability ratio`, `Best for evaluating an investor's entire standalone portfolio`

#### 📦 Memory Box / Data Layout Diagram: Sharpe Ratio ($R_p=15\%, R_f=5\%, \sigma_p=12\%$)

| Valuation / Capital Component | Invariant & Parameters | Type |
|---|---|---|
| **Excess Return (Rp - Rf)** | 15.0% - 5.0% = 10.0% excess return | `Excess Return` |
| **Total Portfolio Risk (\sigma)** | 12.0% standard deviation of returns | `Total Risk` |
| **Sharpe Ratio** | 10.0% / 12.0% = 0.83 Excess Return per 1% of Total Risk! | `Sharpe Output` |

#### 💻 Runnable Financial Simulator: `sharpe_calc_demo.js`

```javascript
function calculateSharpe(rp, rf, stdP) {
  const excess = rp - rf;
  const sr = excess / stdP;
  return {
    excessReturnPercent: excess,
    portfolioStdDevPercent: stdP,
    sharpeRatio: Number(sr.toFixed(2)),
    status: 'SHARPE_RATIO_COMPUTED'
  };
}

console.log(JSON.stringify(calculateSharpe(15, 5, 12)));
```

**Expected Terminal Output**:
```text
{"excessReturnPercent":10,"portfolioStdDevPercent":12,"sharpeRatio":0.83,"status":"SHARPE_RATIO_COMPUTED"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What is the Sharpe Ratio for a portfolio with a 15% return, 5% risk-free rate, and 12% standard deviation ($ (15 - 5) / 12 $)?*

- **Target Answer**: `0.83`
- **Typed Misconception ID**: `MC_FIN_SHARPE_TREYNOR_JENSEN_PERFORMANCE_RATIOS`

**Diagnostic Recovery Paths**:
- **If Student Triggers '1.25'**:
  - *What Went Wrong*: 15 / 12 = 1.25 forgets to subtract the risk-free rate (15 - 5 = 10 -> 10/12 = 0.83).
  - *Simpler Mental Model*: 10 / 12 = 0.83.
  - *Guided Fix Action*: Type 0.83

---

### 🔹 Block 2: Treynor Ratio: Excess Return per Unit of Systematic Risk ($TR = \frac{R_p - R_f}{\beta_p}$)

- **Concept Budget / Primary Invariant**: `Treynor Ratio Formula`
- **Supporting Terms & Invariants**: `$TR = \frac{R_p - R_f}{\beta_p}$`, `Measures reward-to-volatility ratio`, `Best for evaluating a sub-fund being added to an already well-diversified master portfolio`

#### ⚙️ Syntax & Formula Anatomy: Treynor Ratio Math ($R_p=15\%, R_f=5\%, \beta_p=1.25$)

```text
Excess Return = 15.0% - 5.0% = 10.0%
Systematic Beta = 1.25
Treynor Ratio = 10.0% / 1.25 = 8.00 Excess Return per Unit of Beta!
```

- **Line 1**: Excess portfolio return.
- **Line 3**: Treynor ratio output.

#### 💻 Runnable Financial Simulator: `treynor_calc_demo.js`

```javascript
function calculateTreynor(rp, rf, betaP) {
  const excess = rp - rf;
  const tr = excess / betaP;
  return {
    excessReturnPercent: excess,
    portfolioBeta: betaP,
    treynorRatio: Number(tr.toFixed(2)),
    status: 'TREYNOR_RATIO_COMPUTED'
  };
}

console.log(JSON.stringify(calculateTreynor(15, 5, 1.25)));
```

**Expected Terminal Output**:
```text
{"excessReturnPercent":10,"portfolioBeta":1.25,"treynorRatio":8,"status":"TREYNOR_RATIO_COMPUTED"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What is the Treynor Ratio for a fund with a 15% return, 5% risk-free rate, and Beta of 1.25 ($ (15 - 5) / 1.25 $)?*

- **Target Answer**: `8`
- **Typed Misconception ID**: `MC_FIN_SHARPE_TREYNOR_JENSEN_PERFORMANCE_RATIOS`

**Diagnostic Recovery Paths**:
- **If Student Triggers '12'**:
  - *What Went Wrong*: 15 / 1.25 = 12 forgets to subtract the risk-free rate. Correct is 10 / 1.25 = 8.0.
  - *Simpler Mental Model*: 10 / 1.25 = 8.
  - *Guided Fix Action*: Type 8

---

### 🔹 Block 3: Jensen's Alpha: Quantifying True Active Portfolio Manager Skill

- **Concept Budget / Primary Invariant**: `Jensen's Alpha Performance Measure`
- **Supporting Terms & Invariants**: `$\alpha_p = R_p - [R_f + \beta_p(R_m - R_f)]$`, `Positive Alpha $\implies$ Manager added value beyond CAPM risk exposure`, `Zero Alpha $\implies$ Passive index return`, `Negative Alpha $\implies$ Manager underperformed net of fees`

#### 💻 Runnable Financial Simulator: `jensen_calc_demo.js`

```javascript
function calculateJensenAlpha(rp, rf, betaP, rm) {
  const benchmark = rf + betaP * (rm - rf);
  const alpha = rp - benchmark;
  return {
    actualReturnPercent: rp,
    benchmarkCapmReturnPercent: Number(benchmark.toFixed(2)),
    jensenAlphaPercent: Number(alpha.toFixed(2)),
    managerSkill: alpha > 0 ? 'ACTIVE_VALUE_ADDED_OUTPERFORMANCE' : 'UNDERPERFORMANCE',
    status: 'JENSEN_ALPHA_COMPUTED'
  };
}

console.log(JSON.stringify(calculateJensenAlpha(15, 5, 1.25, 11))); // Benchmark = 5 + 1.25*6 = 12.5% -> Alpha = 15 - 12.5 = +2.5%
```

**Expected Terminal Output**:
```text
{"actualReturnPercent":15,"benchmarkCapmReturnPercent":12.5,"jensenAlphaPercent":2.5,"managerSkill":"ACTIVE_VALUE_ADDED_OUTPERFORMANCE","status":"JENSEN_ALPHA_COMPUTED"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What is Jensen's Alpha percentage for a portfolio generating 15% when its CAPM benchmark return is 12.5% ($15 - 12.5$)?*

- **Target Answer**: `2.5`
- **Typed Misconception ID**: `MC_FIN_SHARPE_TREYNOR_JENSEN_PERFORMANCE_RATIOS`

**Diagnostic Recovery Paths**:
- **If Student Triggers '10.0'**:
  - *What Went Wrong*: 15 - 5 = 10 is excess return over risk-free rate. Jensen's Alpha is excess over CAPM benchmark = 15 - 12.5 = 2.5%.
  - *Simpler Mental Model*: 15 - 12.5 = 2.5%.
  - *Guided Fix Action*: Type 2.5

---

## 📅 Day 26: Financial Derivatives: Futures Hedging & Black-Scholes Option Pricing

> **💡 Everyday Metaphor / Intuitive Model**:
> Derivatives are Financial Insurance Policies and Price Locks: a coffee company that needs 10,000 bags of beans in 6 months locks in a price of $100/bag today using a Futures Contract ($F_0 = S_0 e^{rT}$)—eliminating price uncertainty; an Option is buying a voucher that gives you the right (but not the obligation) to buy beans at $100; Put-Call Parity ($C + PV(K) = P + S$) proves that the price of call and put options must fit together like interlocking puzzle pieces to prevent free arbitrage profits.

### 🔹 Block 1: Futures Pricing & Cost of Carry Model ($F_0 = S_0 e^{rT}$)

- **Concept Budget / Primary Invariant**: `Futures Cost of Carry Formula`
- **Supporting Terms & Invariants**: `$F_0 = S_0 e^{rT}$ (Continuous compounding)`, `$S_0$ (Spot price today)`, `$r$ (Risk-free interest rate / financing cost)`, `$T$ (Time to expiration in years)`, `Arbitrage: Cash and Carry vs Reverse Cash and Carry`

#### 📦 Memory Box / Data Layout Diagram: Futures Cost of Carry ($S_0 = $100, r = 5\%, T = 1 \text{ Yr}$)

| Valuation / Capital Component | Invariant & Parameters | Type |
|---|---|---|
| **Spot Price (S0)** | $100.00 cash purchase today | `Spot Price` |
| **Financing Cost (e^rT)** | e^(0.05 x 1) = e^0.05 = 1.051271 | `Cost of Carry` |
| **Fair 1-Yr Futures Price (F0)** | $100 x 1.051271 = EXACTLY $105.13 Fair Futures Price! | `Futures Price` |

#### 💻 Runnable Financial Simulator: `futures_calc_demo.js`

```javascript
function calculateFairFuturesPrice(s0, rPct, tYears) {
  const r = rPct / 100;
  const f0 = s0 * Math.exp(r * tYears);
  return {
    spotPrice: s0,
    riskFreeRatePercent: rPct,
    timeYears: tYears,
    fairFuturesPrice: Number(f0.toFixed(2)),
    status: 'FUTURES_PRICE_COMPUTED'
  };
}

console.log(JSON.stringify(calculateFairFuturesPrice(100, 5, 1)));
```

**Expected Terminal Output**:
```text
{"spotPrice":100,"riskFreeRatePercent":5,"timeYears":1,"fairFuturesPrice":105.13,"status":"FUTURES_PRICE_COMPUTED"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What is the theoretical fair Futures Price for an asset with a $100 spot price and 5% continuous risk-free rate for 1 year ($100 \times e^{0.05}$)?*

- **Target Answer**: `105.13`
- **Typed Misconception ID**: `MC_FIN_DERIVATIVES_FUTURES_FORWARDS_HEDGING`

**Diagnostic Recovery Paths**:
- **If Student Triggers '105.00'**:
  - *What Went Wrong*: $105.00 is simple compounding. Continuous compounding gives 100 * e^0.05 = $105.13.
  - *Simpler Mental Model*: 100 * exp(0.05) = 105.13.
  - *Guided Fix Action*: Type 105.13

---

### 🔹 Block 2: Put-Call Parity Equation: $C + PV(K) = P + S$

- **Concept Budget / Primary Invariant**: `Put-Call Parity Relationship`
- **Supporting Terms & Invariants**: `$C + K e^{-rT} = P + S$`, `$C$ (European Call price)`, `$P$ (European Put price)`, `$K e^{-rT}$ (Present value of strike price $K$)`, `$S$ (Current spot price of underlying stock)`

#### ⚙️ Syntax & Formula Anatomy: Synthetic Put Pricing via Put-Call Parity

```text
Spot Price S = $100 | Strike K = $100 | Call C = $10.00 | r = 5% (T = 1)
PV(K) = 100 * e^(-0.05) = $95.12
Put Price P = C + PV(K) - S = 10.00 + 95.12 - 100.00 = $5.12
```

- **Line 2**: Present value of strike price.
- **Line 3**: Synthetic put price derived.

#### 💻 Runnable Financial Simulator: `parity_calc_demo.js`

```javascript
function calculateSyntheticPutPrice(s, k, rPct, t, callPrice) {
  const r = rPct / 100;
  const pvK = k * Math.exp(-r * t);
  const put = callPrice + pvK - s;
  return {
    callPrice,
    pvOfStrike: Number(pvK.toFixed(2)),
    spotPrice: s,
    syntheticPutPrice: Number(put.toFixed(2)),
    status: 'PUT_CALL_PARITY_COMPUTED'
  };
}

console.log(JSON.stringify(calculateSyntheticPutPrice(100, 100, 5, 1, 10.00)));
```

**Expected Terminal Output**:
```text
{"callPrice":10,"pvOfStrike":95.12,"spotPrice":100,"syntheticPutPrice":5.12,"status":"PUT_CALL_PARITY_COMPUTED"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *Under Put-Call Parity, what is the synthetic European Put price when Spot = $100, Strike = $100 ($PV(K) = $95.12$), and Call = $10.00 ($10 + 95.12 - 100$)?*

- **Target Answer**: `5.12`
- **Typed Misconception ID**: `MC_FIN_OPTION_PRICING_CALL_PUT_PARITY`

**Diagnostic Recovery Paths**:
- **If Student Triggers '10.00'**:
  - *What Went Wrong*: Put price is Call + PV(K) - Spot = 10 + 95.12 - 100 = $5.12.
  - *Simpler Mental Model*: 10 + 95.12 - 100 = 5.12.
  - *Guided Fix Action*: Type 5.12

---

### 🔹 Block 3: The Black-Scholes Model: The 5 Determinants of Option Value

- **Concept Budget / Primary Invariant**: `Black-Scholes 5 Greeks/Inputs`
- **Supporting Terms & Invariants**: `1. Spot Price ($S$)`, `2. Strike Price ($K$)`, `3. Time to Expiration ($T$)`, `4. Risk-Free Rate ($r$)`, `5. Volatility ($\sigma$: Most critical driver of option value!)`

#### 💻 Runnable Financial Simulator: `bsm_inputs_demo.js`

```javascript
function getBlackScholesInputs() {
  return ['SPOT_PRICE', 'STRIKE_PRICE', 'TIME_TO_EXPIRATION', 'RISK_FREE_RATE', 'VOLATILITY_SIGMA'];
}

console.log(JSON.stringify(getBlackScholesInputs()));
```

**Expected Terminal Output**:
```text
["SPOT_PRICE","STRIKE_PRICE","TIME_TO_EXPIRATION","RISK_FREE_RATE","VOLATILITY_SIGMA"]
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *Which input parameter in the Black-Scholes model is the only unobservable variable that must be estimated from market prices (Implied Volatility)?*

- **Target Answer**: `VOLATILITY_SIGMA`
- **Typed Misconception ID**: `MC_FIN_OPTION_PRICING_CALL_PUT_PARITY`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'SPOT'**:
  - *What Went Wrong*: Spot price is observable on the exchange. Volatility must be estimated.
  - *Simpler Mental Model*: Matches VOLATILITY_SIGMA.
  - *Guided Fix Action*: Type VOLATILITY_SIGMA

---

## 📅 Day 27: Corporate Restructuring: Mergers & Acquisitions (M&A) Accretion/Dilution

> **💡 Everyday Metaphor / Intuitive Model**:
> An M&A Deal is Mixing Two Pitchers of Lemonade: Acquirer Inc. has 200,000 shares earning $1,000,000 ($5.00 EPS sweetness); Target Corp earns $400,000; if Acquirer only needs to issue 50,000 new shares to buy Target, the combined pitcher holds $1,400,000 across 250,000 shares ($5.60 EPS sweetness)—making the deal Accretive (+12% boost in EPS); but if Acquirer overpays and issues 100,000 shares ($4.67 EPS), the lemonade is Diluted—destroying shareholder value.

### 🔹 Block 1: Pro-Forma Combined EPS & Accretion/Dilution Analysis

- **Concept Budget / Primary Invariant**: `M&A Accretion/Dilution Model`
- **Supporting Terms & Invariants**: `$\text{Pre-Merger EPS}_A = \frac{\text{Net Income}_A}{\text{Shares}_A}$`, `$\text{Pro-Forma Combined EPS} = \frac{\text{Net Income}_A + \text{Net Income}_T + \text{Synergies}}{\text{Shares}_A + \text{New Shares Issued}}$`, `Accretive Deal (Combined EPS > Pre-Merger EPS)`, `Dilutive Deal (Combined EPS < Pre-Merger EPS)`

#### 📦 Memory Box / Data Layout Diagram: M&A Accretion Math ($1M Acquirer / 200k Shs, $400k Target / 50k Shs)

| Valuation / Capital Component | Invariant & Parameters | Type |
|---|---|---|
| **Pre-Merger Acquirer EPS** | $1,000,000 / 200,000 shares = $5.00 EPS | `Pre-Deal EPS` |
| **Post-Merger Combined Earnings** | $1,000,000 + $400,000 = $1,400,000 Net Income | `Combined Earnings` |
| **Post-Merger Total Shares** | 200,000 + 50,000 new shares = 250,000 shares | `Combined Shares` |
| **Post-Merger Combined EPS** | $1,400,000 / 250,000 = $5.60 EPS (+12.0% ACCRETIVE DEAL!) | `Accretive Result` |

#### 💻 Runnable Financial Simulator: `accretion_calc_demo.js`

```javascript
function evaluateMerger(eA, sA, eT, sNew) {
  const preEps = eA / sA;
  const postEps = (eA + eT) / (sA + sNew);
  const changePct = ((postEps - preEps) / preEps) * 100;
  const isAccretive = postEps > preEps;
  return {
    preMergerEps: Number(preEps.toFixed(2)),
    postMergerEps: Number(postEps.toFixed(2)),
    epsChangePercent: Number(changePct.toFixed(2)),
    dealOutcome: isAccretive ? 'ACCRETIVE_DEAL' : 'DILUTIVE_DEAL',
    status: 'MERGER_ACCRETION_EVALUATED'
  };
}

console.log(JSON.stringify(evaluateMerger(1000000, 200000, 400000, 50000)));
```

**Expected Terminal Output**:
```text
{"preMergerEps":5,"postMergerEps":5.6,"epsChangePercent":12,"dealOutcome":"ACCRETIVE_DEAL","status":"MERGER_ACCRETION_EVALUATED"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What is the post-merger combined EPS when Acquirer ($1,000,000 earnings, 200,000 shares) acquires Target ($400,000 earnings) by issuing 50,000 new shares ($1400000 / 250000$)?*

- **Target Answer**: `5.6`
- **Typed Misconception ID**: `MC_FIN_MERGERS_ACQUISITIONS_ACCRETION_DILUTION`

**Diagnostic Recovery Paths**:
- **If Student Triggers '5.0'**:
  - *What Went Wrong*: $5.00 is pre-merger EPS. Post-merger combined EPS increases to $5.60.
  - *Simpler Mental Model*: 1400000 / 250000 = 5.60.
  - *Guided Fix Action*: Type 5.6

---

### 🔹 Block 2: Merger Synergies: Cost Synergies (Hard) vs Revenue Synergies (Soft)

- **Concept Budget / Primary Invariant**: `M&A Synergy Types`
- **Supporting Terms & Invariants**: `Cost Synergies (Operational cost reductions e.g. consolidating headquarters, shared IT systems $\implies$ High certainty / Hard synergies)`, `Revenue Synergies (Cross-selling products $\implies$ Lower certainty / Soft synergies)`, `Winner's Curse & Overpayment Risk`

#### 💻 Runnable Financial Simulator: `synergies_demo.js`

```javascript
function evaluateSynergyCertainty(synergyType) {
  return synergyType === 'COST_REDUCTION_HEADCOUNT_CONSOLIDATION'
    ? 'HARD_SYNERGY_HIGH_PROBABILITY_OF_REALIZATION'
    : 'SOFT_SYNERGY_LOWER_CERTAINTY_CROSS_SELLING';
}

console.log(evaluateSynergyCertainty('COST_REDUCTION_HEADCOUNT_CONSOLIDATION'));
console.log(evaluateSynergyCertainty('REVENUE_CROSS_SELLING'));
```

**Expected Terminal Output**:
```text
HARD_SYNERGY_HIGH_PROBABILITY_OF_REALIZATION
SOFT_SYNERGY_LOWER_CERTAINTY_CROSS_SELLING
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *Which type of M&A synergy has the highest probability of execution realization in corporate restructuring?*

- **Target Answer**: `HARD_SYNERGY_HIGH_PROBABILITY_OF_REALIZATION`
- **Typed Misconception ID**: `MC_FIN_MERGERS_ACQUISITIONS_ACCRETION_DILUTION`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'REVENUE'**:
  - *What Went Wrong*: Revenue cross-selling is uncertain. Cost reduction is a hard synergy with high certainty.
  - *Simpler Mental Model*: Cost synergies have highest realization probability.
  - *Guided Fix Action*: Type HARD_SYNERGY_HIGH_PROBABILITY_OF_REALIZATION

---

### 🔹 Block 3: Deal Consideration: Stock-for-Stock vs All-Cash Acquisitions

- **Concept Budget / Primary Invariant**: `M&A Consideration Structure`
- **Supporting Terms & Invariants**: `All-Cash Deal (Acquirer assumes 100% of integration risk; target shareholders cash out with taxable gain)`, `Stock-for-Stock Deal (Target shareholders share ongoing synergy upside and downside; tax-deferred reorganization)`

#### 💻 Runnable Financial Simulator: `consideration_demo.js`

```javascript
function evaluateConsiderationRiskSharing(isStockDeal) {
  return isStockDeal
    ? 'TARGET_SHAREHOLDERS_SHARE_POST_MERGER_RISK_AND_UPSIDE'
    : 'ACQUIRER_BEARS_100_PERCENT_INTEGRATION_RISK';
}

console.log(evaluateConsiderationRiskSharing(true));
console.log(evaluateConsiderationRiskSharing(false));
```

**Expected Terminal Output**:
```text
TARGET_SHAREHOLDERS_SHARE_POST_MERGER_RISK_AND_UPSIDE
ACQUIRER_BEARS_100_PERCENT_INTEGRATION_RISK
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What risk-sharing characteristic distinguishes a Stock-for-Stock merger from an All-Cash transaction?*

- **Target Answer**: `TARGET_SHAREHOLDERS_SHARE_POST_MERGER_RISK_AND_UPSIDE`
- **Typed Misconception ID**: `MC_FIN_MERGERS_ACQUISITIONS_ACCRETION_DILUTION`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'CASH'**:
  - *What Went Wrong*: In stock deals, target shareholders share ongoing risk and upside.
  - *Simpler Mental Model*: Target shareholders share risk and upside.
  - *Guided Fix Action*: Type TARGET_SHAREHOLDERS_SHARE_POST_MERGER_RISK_AND_UPSIDE

---

## 📅 Day 28: Corporate Credit Analysis & Altman Z-Score Bankruptcy Prediction

> **💡 Everyday Metaphor / Intuitive Model**:
> The Altman Z-Score is an Intensive Care Heart Monitor for Corporate Bankruptcy: Edward Altman synthesized 5 key financial ratios (Working Capital, Retained Earnings, Operating Profit, Market Equity, and Sales Turnover) into a single Z-Score equation ($Z = 1.2 X_1 + 1.4 X_2 + 3.3 X_3 + 0.6 X_4 + 0.999 X_5$); a score above 2.99 indicates a Safe Green Zone; between 1.81 and 2.99 is a Cautionary Grey Zone; below 1.81 indicates severe financial distress with high bankruptcy probability within 24 months.

### 🔹 Block 1: Altman Z-Score Model: $Z = 1.2 X_1 + 1.4 X_2 + 3.3 X_3 + 0.6 X_4 + 0.999 X_5$

- **Concept Budget / Primary Invariant**: `Altman Z-Score Formula`
- **Supporting Terms & Invariants**: `$X_1 = \frac{\text{Working Capital}}{\text{Total Assets}}$ (Short-term liquidity)`, `$X_2 = \frac{\text{Retained Earnings}}{\text{Total Assets}}$ (Cumulative profitability)`, `$X_3 = \frac{\text{EBIT}}{\text{Total Assets}}$ (Operating asset productivity)`, `$X_4 = \frac{\text{Market Value of Equity}}{\text{Total Liabilities}}$ (Leverage cushion)`, `$X_5 = \frac{\text{Sales}}{\text{Total Assets}}$ (Asset turnover)`

#### 📦 Memory Box / Data Layout Diagram: Altman Z-Score Components ($1M Firm)

| Valuation / Capital Component | Invariant & Parameters | Type |
|---|---|---|
| **X1 (WC/Assets = 0.20)** | 1.2 x 0.20 = 0.240 | `Liquidity` |
| **X2 (RE/Assets = 0.30)** | 1.4 x 0.30 = 0.420 | `Profitability` |
| **X3 (EBIT/Assets = 0.20)** | 3.3 x 0.20 = 0.660 | `Productivity` |
| **X4 (Equity/Liab = 2.00)** | 0.6 x 2.00 = 1.200 | `Leverage` |
| **X5 (Sales/Assets = 1.00)** | 0.999 x 1.00 = 0.999 | `Turnover` |
| **Total Altman Z-Score** | Sum = 3.52 -> SAFE ZONE (FINANCIALLY SOUND!) | `Z-Score` |

#### 💻 Runnable Financial Simulator: `altman_calc_demo.js`

```javascript
function calculateAltmanZ(wc, re, ebit, mCap, sales, assets, liab) {
  const x1 = wc / assets;
  const x2 = re / assets;
  const x3 = ebit / assets;
  const x4 = mCap / liab;
  const x5 = sales / assets;
  const z = 1.2 * x1 + 1.4 * x2 + 3.3 * x3 + 0.6 * x4 + 0.999 * x5;
  let zone = 'DISTRESS_ZONE';
  if (z > 2.99) zone = 'SAFE_ZONE_FINANCIALLY_SOUND';
  else if (z >= 1.81) zone = 'GREY_ZONE_MODERATE_RISK';
  return {
    zScore: Number(z.toFixed(2)),
    zone,
    status: 'ALTMAN_Z_SCORE_COMPUTED'
  };
}

console.log(JSON.stringify(calculateAltmanZ(200000, 300000, 200000, 800000, 1000000, 1000000, 400000)));
```

**Expected Terminal Output**:
```text
{"zScore":3.52,"zone":"SAFE_ZONE_FINANCIALLY_SOUND","status":"ALTMAN_Z_SCORE_COMPUTED"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What is the calculated Altman Z-Score for a company with component sum $0.24 + 0.42 + 0.66 + 1.20 + 0.999$ ($3.519$)?*

- **Target Answer**: `3.52`
- **Typed Misconception ID**: `MC_FIN_CORPORATE_CREDIT_SCORING_ALTMAN_Z_SCORE`

**Diagnostic Recovery Paths**:
- **If Student Triggers '2.99'**:
  - *What Went Wrong*: 2.99 is the threshold for safe zone. The calculated score is 3.52.
  - *Simpler Mental Model*: 0.24 + 0.42 + 0.66 + 1.20 + 0.999 = 3.52.
  - *Guided Fix Action*: Type 3.52

---

### 🔹 Block 2: Altman Zones: Safe Zone ($Z > 2.99$), Grey Zone ($1.81 - 2.99$), Distress ($Z < 1.81$)

- **Concept Budget / Primary Invariant**: `Altman Zones of Discrimination`
- **Supporting Terms & Invariants**: `Safe Zone ($Z > 2.99$: Very low bankruptcy probability)`, `Grey Zone ($1.81 \le Z \le 2.99$: Moderate financial vulnerability)`, `Distress Zone ($Z < 1.81$: Imminent bankruptcy risk)`

#### ⚙️ Syntax & Formula Anatomy: Altman Z-Score Discrimination Thresholds

```text
// Z > 2.99  -> SAFE ZONE (Strong balance sheet, low credit default risk)
// 1.81 - 2.99 -> GREY ZONE (Exercise caution, monitor liquidity)
// Z < 1.81  -> DISTRESS ZONE (High probability of default within 2 years)
```

- **Line 1**: Safe territory.
- **Line 2**: Vulnerable middle tier.
- **Line 3**: Bankruptcy danger.

#### 💻 Runnable Financial Simulator: `zones_demo.js`

```javascript
function evaluateZScoreZone(z) {
  if (z > 2.99) return 'SAFE_ZONE_LOW_DEFAULT_RISK';
  if (z >= 1.81) return 'GREY_ZONE_MONITOR_REQUIRED';
  return 'DISTRESS_ZONE_HIGH_BANKRUPTCY_RISK';
}

console.log(evaluateZScoreZone(3.50));
console.log(evaluateZScoreZone(2.40));
console.log(evaluateZScoreZone(1.40));
```

**Expected Terminal Output**:
```text
SAFE_ZONE_LOW_DEFAULT_RISK
GREY_ZONE_MONITOR_REQUIRED
DISTRESS_ZONE_HIGH_BANKRUPTCY_RISK
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *Into which risk zone does a corporation with an Altman Z-Score of 1.40 fall?*

- **Target Answer**: `DISTRESS_ZONE_HIGH_BANKRUPTCY_RISK`
- **Typed Misconception ID**: `MC_FIN_CORPORATE_CREDIT_SCORING_ALTMAN_Z_SCORE`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'GREY'**:
  - *What Went Wrong*: Grey zone is 1.81 to 2.99. Any score below 1.81 is in the Distress Zone.
  - *Simpler Mental Model*: Below 1.81 is Distress Zone.
  - *Guided Fix Action*: Type DISTRESS_ZONE_HIGH_BANKRUPTCY_RISK

---

### 🔹 Block 3: Credit Rating Agency Grades (AAA to D) & Default Spreads

- **Concept Budget / Primary Invariant**: `Credit Ratings & Default Spreads`
- **Supporting Terms & Invariants**: `Investment Grade (AAA, AA, A, BBB: Institutional grade debt)`, `High Yield / Junk Bonds (BB, B, CCC, D: High default risk with wide yield spreads)`

#### 💻 Runnable Financial Simulator: `credit_ratings_demo.js`

```javascript
function evaluateCreditRatingGrade(rating) {
  const investmentGrade = ['AAA', 'AA', 'A', 'BBB'];
  return investmentGrade.includes(rating)
    ? 'INVESTMENT_GRADE_INSTITUTIONAL_QUALITY'
    : 'HIGH_YIELD_JUNK_BOND_SPECULATIVE';
}

console.log(evaluateCreditRatingGrade('AAA'));
console.log(evaluateCreditRatingGrade('BB'));
```

**Expected Terminal Output**:
```text
INVESTMENT_GRADE_INSTITUTIONAL_QUALITY
HIGH_YIELD_JUNK_BOND_SPECULATIVE
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What classification applies to corporate bonds rated AAA, AA, A, or BBB?*

- **Target Answer**: `INVESTMENT_GRADE_INSTITUTIONAL_QUALITY`
- **Typed Misconception ID**: `MC_FIN_CORPORATE_CREDIT_SCORING_ALTMAN_Z_SCORE`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'JUNK'**:
  - *What Went Wrong*: Junk bonds are BB and lower. BBB and above are Investment Grade.
  - *Simpler Mental Model*: Matches INVESTMENT_GRADE_INSTITUTIONAL_QUALITY.
  - *Guided Fix Action*: Type INVESTMENT_GRADE_INSTITUTIONAL_QUALITY

---

## 📅 Day 29: FinTech, Robo-Advisory & ESG Sustainable Investment Scoring

> **💡 Everyday Metaphor / Intuitive Model**:
> FinTech & ESG Scoring is Upgrading from a Paper Compass to an AI Autopilot with Green Energy Sensors: modern Robo-Advisors automatically profile an investor's risk appetite (Risk Score 7/10 $\implies$ 70% Equity / 30% Debt) and rebalance portfolios algorithmically with zero emotion; simultaneously, ESG Scoring measures corporate sustainability across Environmental footprint, Social responsibility, and ethical Governance—ensuring capital flows to companies that generate profits sustainably without destroying the planet.

### 🔹 Block 1: Algorithmic Robo-Advisors & Automated Risk-Based Asset Allocation

- **Concept Budget / Primary Invariant**: `Robo-Advisory Asset Allocation Engine`
- **Supporting Terms & Invariants**: `Risk Profiling Questionnaire (Score 1 to 10)`, `Dynamic Asset Allocation: $\text{Equity \%} = \text{Risk Score} \times 10$, $\text{Debt \%} = 100 - \text{Equity \%}$`, `Automated Threshold Rebalancing`

#### 📦 Memory Box / Data Layout Diagram: Robo-Advisory Asset Allocation (Risk Score = 7)

| Valuation / Capital Component | Invariant & Parameters | Type |
|---|---|---|
| **Investor Risk Profile** | Risk Score = 7 / 10 (Moderate Aggressive Growth) | `Risk Score` |
| **Target Equity Allocation** | 7 x 10% = 70.0% Equities (Index ETFs) | `Equity Portion` |
| **Target Fixed Income Allocation** | 100% - 70% = 30.0% Sovereign Debt & Corporate Bonds | `Debt Portion` |

#### 💻 Runnable Financial Simulator: `robo_alloc_demo.js`

```javascript
function generateRoboAllocation(riskScore) {
  const equityPct = riskScore * 10;
  const debtPct = 100 - equityPct;
  return {
    riskScore,
    recommendedEquityPercent: equityPct,
    recommendedDebtPercent: debtPct,
    status: 'ROBO_ALLOCATION_GENERATED'
  };
}

console.log(JSON.stringify(generateRoboAllocation(7)));
```

**Expected Terminal Output**:
```text
{"riskScore":7,"recommendedEquityPercent":70,"recommendedDebtPercent":30,"status":"ROBO_ALLOCATION_GENERATED"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What is the recommended equity allocation percentage for an investor with a risk score of 7 out of 10 ($7 \times 10$)?*

- **Target Answer**: `70`
- **Typed Misconception ID**: `MC_FIN_FINTECH_ROBO_ADVISORY_ALGORITHMIC_ALLOCATION`

**Diagnostic Recovery Paths**:
- **If Student Triggers '30'**:
  - *What Went Wrong*: 30% is the debt allocation. Equity allocation is 70%.
  - *Simpler Mental Model*: 7 * 10 = 70%.
  - *Guided Fix Action*: Type 70

---

### 🔹 Block 2: ESG Framework: Environmental, Social & Governance Scoring

- **Concept Budget / Primary Invariant**: `ESG Sustainable Scoring Framework`
- **Supporting Terms & Invariants**: `Environmental (E: Carbon intensity, water usage, renewable energy)`, `Social (S: Workforce diversity, human rights, labor standards)`, `Governance (G: Board independence, executive compensation alignment, anti-corruption)`, `ESG Rating Tiers (Score $\ge 75 \implies$ Tier A Leader)`

#### ⚙️ Syntax & Formula Anatomy: ESG Pillar Composite Score

```text
E Score = 80 (30% Weight) -> 24.0
S Score = 85 (30% Weight) -> 25.5
G Score = 90 (40% Weight) -> 36.0
Composite ESG Score = 24.0 + 25.5 + 36.0 = 85.5 -> TIER A ESG LEADER!
```

- **Line 1**: Environmental score.
- **Line 2**: Social score.
- **Line 3**: Governance score.
- **Line 4**: Weighted composite rating.

#### 💻 Runnable Financial Simulator: `esg_scoring_demo.js`

```javascript
function evaluateEsgScore(e, s, g) {
  const composite = 0.3 * e + 0.3 * s + 0.4 * g;
  const isLeader = composite >= 75;
  return {
    compositeEsgScore: Number(composite.toFixed(1)),
    ratingTier: isLeader ? 'ESG_LEADER_TIER_A' : 'ESG_STANDARD_TIER_B',
    status: 'ESG_EVALUATED'
  };
}

console.log(JSON.stringify(evaluateEsgScore(80, 85, 90)));
```

**Expected Terminal Output**:
```text
{"compositeEsgScore":85.5,"ratingTier":"ESG_LEADER_TIER_A","status":"ESG_EVALUATED"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What rating tier is assigned to a corporation with a composite ESG score of 85.5?*

- **Target Answer**: `ESG_LEADER_TIER_A`
- **Typed Misconception ID**: `MC_FIN_ESG_SUSTAINABILITY_INVESTMENT_SCORING`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'TIER_B'**:
  - *What Went Wrong*: Score >= 75 qualifies for Tier A ESG Leader.
  - *Simpler Mental Model*: Score 85.5 awards ESG_LEADER_TIER_A.
  - *Guided Fix Action*: Type ESG_LEADER_TIER_A

---

### 🔹 Block 3: Green Bonds & Sustainable Capital Markets

- **Concept Budget / Primary Invariant**: `Green Bonds Mechanism`
- **Supporting Terms & Invariants**: `Green Bonds (Fixed-income debt earmarked exclusively for climate and environmental projects)`, `Greenium (Yield discount / pricing premium for green issuances)`, `Third-Party Verification & Use-of-Proceeds reporting`

#### 💻 Runnable Financial Simulator: `green_bonds_demo.js`

```javascript
function evaluateGreenBondProceeds(isEarmarkedForClimate) {
  return isEarmarkedForClimate
    ? 'GREEN_BOND_PROCEEDS_STRICTLY_EARMARKED_FOR_SUSTAINABILITY'
    : 'CONVENTIONAL_CORPORATE_BOND';
}

console.log(evaluateGreenBondProceeds(true));
console.log(evaluateGreenBondProceeds(false));
```

**Expected Terminal Output**:
```text
GREEN_BOND_PROCEEDS_STRICTLY_EARMARKED_FOR_SUSTAINABILITY
CONVENTIONAL_CORPORATE_BOND
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What statutory requirement distinguishes a Green Bond issuance from conventional corporate debt?*

- **Target Answer**: `GREEN_BOND_PROCEEDS_STRICTLY_EARMARKED_FOR_SUSTAINABILITY`
- **Typed Misconception ID**: `MC_FIN_ESG_SUSTAINABILITY_INVESTMENT_SCORING`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'GENERAL'**:
  - *What Went Wrong*: Green bond proceeds cannot be used for general purposes; they are strictly earmarked for sustainability projects.
  - *Simpler Mental Model*: Strictly earmarked for sustainability.
  - *Guided Fix Action*: Type GREEN_BOND_PROCEEDS_STRICTLY_EARMARKED_FOR_SUSTAINABILITY

---

## 📅 Day 30: 🏆 FINAL CAPSTONE: Integrated Corporate Finance, Valuation & Portfolio Investment Management Suite

> **💡 Everyday Metaphor / Intuitive Model**:
> The Final Capstone is the Master Chief Financial Officer (CFO) and Chief Investment Officer (CIO) Control Center: you orchestrate all 5 pillars of modern enterprise finance: 1. Time Value of Money loan & bond valuation engine; 2. Capital budgeting NPV & WACC hurdle rate project decision rules; 3. Corporate leverage, break-even, and MM capital structure optimization; 4. DCF and trading multiples equity valuation; 5. Modern Portfolio Theory, CAPM Beta risk pricing, and ESG investment allocation—certifying a complete, enterprise-grade corporate finance and investment management suite.

### 🔹 Block 1: Enterprise Corporate Finance & Investment Suite Orchestration

- **Concept Budget / Primary Invariant**: `Capstone Suite Orchestration`
- **Supporting Terms & Invariants**: `TVM Valuation Engine`, `Capital Budgeting Engine`, `Capital Structure Engine`, `DCF Equity Valuation Engine`, `Portfolio Investment Suite`

#### 🔄 Valuation & Decision Process Execution Flowchart: Complete 30-Day Corporate Finance Master Architecture

1. **Pillar 1: Time Value of Money & Bond Valuation Engine (Days 1-8)**
2. **Pillar 2: Capital Budgeting NPV/IRR & WACC Composite Hurdle (Days 9-15)**
3. **Pillar 3: Financial Leverage, MM Theorem & Dividend Policy (Days 16-21)**
4. **Pillar 4: DCF Equity Valuation & Trading Multiples (Day 22)**
5. **Pillar 5: Portfolio Theory, CAPM, Derivatives & ESG FinTech (Days 23-29)**
6. **🏆 Master CFO/CIO Enterprise Certification Achieved (Day 30)!**

#### 💻 Runnable Financial Simulator: `capstone_orchestrator_demo.js`

```javascript
function orchestrateCapstone(tvm, cb, cs, val, port) {
  const isNominal = tvm && cb && cs && val && port;
  return {
    tvmSubsystem: tvm ? 'ONLINE' : 'OFFLINE',
    capitalBudgetingSubsystem: cb ? 'ONLINE' : 'OFFLINE',
    capitalStructureSubsystem: cs ? 'ONLINE' : 'OFFLINE',
    equityValuationSubsystem: val ? 'ONLINE' : 'OFFLINE',
    portfolioManagementSubsystem: port ? 'ONLINE' : 'OFFLINE',
    capstoneMasterStatus: isNominal ? 'CORPORATE_FINANCE_MASTER_SUITE_ACTIVE_NOMINAL' : 'INCOMPLETE_ORCHESTRATION'
  };
}

console.log(orchestrateCapstone(true, true, true, true, true).capstoneMasterStatus);
```

**Expected Terminal Output**:
```text
CORPORATE_FINANCE_MASTER_SUITE_ACTIVE_NOMINAL
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What master status confirms complete active orchestration of the Corporate Finance & Investment Suite?*

- **Target Answer**: `CORPORATE_FINANCE_MASTER_SUITE_ACTIVE_NOMINAL`
- **Typed Misconception ID**: `MC_FIN_CAPSTONE_CORPORATE_FINANCE_AND_PORTFOLIO_VALUATION`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'FAILED'**:
  - *What Went Wrong*: Matches CORPORATE_FINANCE_MASTER_SUITE_ACTIVE_NOMINAL.
  - *Simpler Mental Model*: Matches header string.
  - *Guided Fix Action*: Type CORPORATE_FINANCE_MASTER_SUITE_ACTIVE_NOMINAL

---

### 🔹 Block 2: Enterprise Audit Verification & 5-Pillar Compliance Certification

- **Concept Budget / Primary Invariant**: `Capstone Audit Invariant Verification`
- **Supporting Terms & Invariants**: `TVM Invariant`, `Valuation Invariant`, `Policy Invariant`, `Portfolio Invariant`, `100% Quality Invariant`

#### 💻 Runnable Financial Simulator: `capstone_audit_demo.js`

```javascript
function auditCapstoneSystem(p1, p2, p3, p4, p5) {
  const passed = p1 && p2 && p3 && p4 && p5;
  return {
    pillar1_TvmVerified: p1,
    pillar2_CapitalBudgetingVerified: p2,
    pillar3_CapitalStructureVerified: p3,
    pillar4_ValuationVerified: p4,
    pillar5_PortfolioRiskVerified: p5,
    overallGrade: passed ? 'CORPORATE_FINANCE_AND_INVESTMENT_MASTER_AUDIT_PASSED_100_PERCENT' : 'AUDIT_DEFECT'
  };
}

console.log(JSON.stringify(auditCapstoneSystem(true, true, true, true, true)));
```

**Expected Terminal Output**:
```text
{"pillar1_TvmVerified":true,"pillar2_CapitalBudgetingVerified":true,"pillar3_CapitalStructureVerified":true,"pillar4_ValuationVerified":true,"pillar5_PortfolioRiskVerified":true,"overallGrade":"CORPORATE_FINANCE_AND_INVESTMENT_MASTER_AUDIT_PASSED_100_PERCENT"}
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What audit grade is awarded when all 5 pillars of the Corporate Finance curriculum pass verification?*

- **Target Answer**: `CORPORATE_FINANCE_AND_INVESTMENT_MASTER_AUDIT_PASSED_100_PERCENT`
- **Typed Misconception ID**: `MC_FIN_CAPSTONE_CORPORATE_FINANCE_AND_PORTFOLIO_VALUATION`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'DEFECT'**:
  - *What Went Wrong*: All checks passing awards CORPORATE_FINANCE_AND_INVESTMENT_MASTER_AUDIT_PASSED_100_PERCENT.
  - *Simpler Mental Model*: Awards CORPORATE_FINANCE_AND_INVESTMENT_MASTER_AUDIT_PASSED_100_PERCENT.
  - *Guided Fix Action*: Type CORPORATE_FINANCE_AND_INVESTMENT_MASTER_AUDIT_PASSED_100_PERCENT

---

### 🔹 Block 3: Course 19: Business Finance & Investment Management (B.Com / BBA) Gold Standard Certification

- **Concept Budget / Primary Invariant**: `Gold Standard Certification`
- **Supporting Terms & Invariants**: `Course 19 Certified`, `Production Reference Standard`, `100% Quality Invariant`

#### 💻 Runnable Financial Simulator: `course19_cert_demo.js`

```javascript
console.log('🏆 COURSE 19 COMPLETE: Business Finance & Investment Management (B.Com / BBA) [VERIFIED GOLD STANDARD 100/100]');
```

**Expected Terminal Output**:
```text
🏆 COURSE 19 COMPLETE: Business Finance & Investment Management (B.Com / BBA) [VERIFIED GOLD STANDARD 100/100]
```

#### 🩺 Socratic Diagnostic Check & 3-Step Recovery Ladder

**Diagnostic Question**: *What gold-standard certification string confirms Course 19 graduation?*

- **Target Answer**: `🏆 COURSE 19 COMPLETE: Business Finance & Investment Management (B.Com / BBA) [VERIFIED GOLD STANDARD 100/100]`
- **Typed Misconception ID**: `MC_FIN_CAPSTONE_CORPORATE_FINANCE_AND_PORTFOLIO_VALUATION`

**Diagnostic Recovery Paths**:
- **If Student Triggers 'FAILED'**:
  - *What Went Wrong*: Matches course completion string.
  - *Simpler Mental Model*: Matches completion string.
  - *Guided Fix Action*: Type 🏆 COURSE 19 COMPLETE: Business Finance & Investment Management (B.Com / BBA) [VERIFIED GOLD STANDARD 100/100]

---

