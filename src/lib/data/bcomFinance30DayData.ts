import { buildEnrichedDayQuests, DayConfig } from './curriculumEnricher';
import { CourseQuest } from './coursesData';

export const BCOM_FINANCE_30_DAYS_CONFIGS: DayConfig[] = [
  {
    "day": 1,
    "title": "Introduction to Corporate Finance & The Financial Ecosystem",
    "desc": "Master the core objectives of corporate finance: Maximizing Shareholder Wealth vs Profit Maximization, Financial Management decisions (Investment, Financing, Dividend), and the role of Financial Markets and Intermediaries.",
    "syllabus": [
      "Wealth Maximization vs Profit Maximization: Long-term value creation considering time value and risk.",
      "The 3 Core Financial Decisions: Capital Budgeting (Investing), Capital Structure (Financing), and Dividend Policy.",
      "Agency Problem: Conflicts of interest between Shareholders (Principals) and Corporate Managers (Agents)."
    ],
    "eTitle": "Shareholder Wealth Maximization Evaluator",
    "eDesc": "Implement function evaluateCorporateObjective(objectiveType, considersRisk, considersTimeValue) evaluating if a financial decision aligns with the goal of Shareholder Wealth Maximization.",
    "eStarter": "function evaluateCorporateObjective(type, risk, tvm) {\n  const isWealthMax = type === 'WEALTH_MAXIMIZATION' && risk && tvm;\n  return {\n    objective: type,\n    considersRiskAndUncertainty: risk,\n    considersTimeValueOfMoney: tvm,\n    isSuperiorToProfitMaximization: isWealthMax,\n    status: isWealthMax ? 'CORPORATE_GOAL_SHAREHOLDER_WEALTH_MAXIMIZATION' : 'SUB_OPTIMAL_FINANCIAL_GOAL'\n  };\n}",
    "eHint": "Wealth maximization requires consideration of risk and time value of money.",
    "eTest": "const ok = evaluateCorporateObjective('WEALTH_MAXIMIZATION', true, true);\nconst bad = evaluateCorporateObjective('PROFIT_MAXIMIZATION', false, false);\nif (!ok.isSuperiorToProfitMaximization || ok.status !== 'CORPORATE_GOAL_SHAREHOLDER_WEALTH_MAXIMIZATION' || bad.isSuperiorToProfitMaximization) throw new Error('Corporate objective evaluator failed');",
    "aTitle": "Core Financial Decisions Formatter",
    "aDesc": "Implement function getCoreFinancialDecisions() returning `['INVESTING', 'FINANCING', 'DIVIDEND']`.",
    "aStarter": "function getCoreFinancialDecisions() {\n  // Write your answer here\n}",
    "aHint": "Return the 3 decisions.",
    "aTest": "if (getCoreFinancialDecisions().length !== 3) throw new Error('Decisions check failed');"
  },
  {
    "day": 2,
    "title": "Time Value of Money (TVM): Compounding & Future Value ($FV$)",
    "desc": "Understand the compounding power of money: Simple Interest vs Compound Interest ($FV = PV(1 + r)^n$), Effective Annual Rate (EAR) under multi-period compounding ($m$ times per year), and the Rule of 72.",
    "syllabus": [
      "Future Value Equation: $FV = PV(1 + r)^n$.",
      "Multi-Period Compounding: $FV = PV(1 + r/m)^{m \\times n}$.",
      "Effective Annual Rate (EAR): $EAR = (1 + r/m)^m - 1$."
    ],
    "eTitle": "Future Value & Effective Annual Rate (EAR) Engine",
    "eDesc": "Implement function calculateFutureValueAndEar(principal, nominalRatePct, years, compoundingFrequency = 1) calculating FV and EAR.",
    "eStarter": "function calculateFutureValueAndEar(pv, rPct, n, m = 1) {\n  const r = rPct / 100;\n  const fv = pv * Math.pow(1 + r / m, m * n);\n  const ear = (Math.pow(1 + r / m, m) - 1) * 100;\n  return {\n    presentValue: pv,\n    nominalRatePercent: rPct,\n    futureValue: Number(fv.toFixed(2)),\n    effectiveAnnualRatePercent: Number(ear.toFixed(2)),\n    status: 'FUTURE_VALUE_COMPUTED'\n  };\n}",
    "eHint": "Compute fv = pv * (1 + r/m)^(m*n) and ear = ((1 + r/m)^m - 1)*100.",
    "eTest": "const res = calculateFutureValueAndEar(100000, 10, 2, 2); // 100k @ 10% semi-annual for 2 yrs -> 100k * (1.05)^4 = 121,550.63; EAR = 10.25%\nif (res.futureValue !== 121550.63 || res.effectiveAnnualRatePercent !== 10.25 || res.status !== 'FUTURE_VALUE_COMPUTED') throw new Error('FV calculation failed');",
    "aTitle": "Rule of 72 Doubling Time Formatter",
    "aDesc": "Implement function calculateDoublingTime(ratePct) returning `Number((72 / ratePct).toFixed(1))`.",
    "aStarter": "function calculateDoublingTime() {\n  // Write your answer here\n}",
    "aHint": "Return 72 / rate.",
    "aTest": "if (calculateDoublingTime(8) !== 9.0) throw new Error('Rule of 72 failed');"
  },
  {
    "day": 3,
    "title": "Time Value of Money (TVM): Discounting & Present Value ($PV$)",
    "desc": "Calculate what future cash flows are worth today: Present Value discounting equation ($PV = \\frac{FV}{(1 + r)^n}$), discount factors, present value of multiple uneven cash flows, and Opportunity Cost of Capital.",
    "syllabus": [
      "Present Value Equation: $PV = \\frac{FV}{(1 + r)^n}$.",
      "Discount Factor: $DF = \\frac{1}{(1 + r)^n}$.",
      "Present Value of Uneven Streams: $PV = \\sum_{t=1}^n \\frac{CF_t}{(1 + r)^t}$."
    ],
    "eTitle": "Present Value Uneven Cash Flow Discounting Engine",
    "eDesc": "Implement function discountCashFlowStream(cashFlows, discountRatePct) calculating the aggregate present value of an uneven series of future cash flows.",
    "eStarter": "function discountCashFlowStream(cfs, ratePct) {\n  const r = ratePct / 100;\n  let totalPv = 0;\n  cfs.forEach((cf, idx) => {\n    const t = idx + 1;\n    totalPv += cf / Math.pow(1 + r, t);\n  });\n  return {\n    discountRatePercent: ratePct,\n    totalPresentValue: Number(totalPv.toFixed(2)),\n    status: 'CASH_FLOW_STREAM_DISCOUNTED'\n  };\n}",
    "eHint": "Sum cf / (1 + r)^t for each period t.",
    "eTest": "const res = discountCashFlowStream([10000, 20000, 30000], 10); // 10k/1.1 + 20k/1.21 + 30k/1.331 = 9090.91 + 16528.93 + 22539.44 = 48159.28\nif (res.totalPresentValue !== 48159.28 || res.status !== 'CASH_FLOW_STREAM_DISCOUNTED') throw new Error('PV discounting failed');",
    "aTitle": "Discount Factor Formatter",
    "aDesc": "Implement function getDiscountFactor(rPct, t) returning `Number((1 / Math.pow(1 + rPct / 100, t)).toFixed(4))`.",
    "aStarter": "function getDiscountFactor() {\n  // Write your answer here\n}",
    "aHint": "Return 1 / (1 + r)^t.",
    "aTest": "if (getDiscountFactor(10, 1) !== 0.9091) throw new Error('Discount factor check failed');"
  },
  {
    "day": 4,
    "title": "Annuities & Loan Amortization: Ordinary Annuity, Annuity Due & EMI",
    "desc": "Master equal periodic cash flow streams: Present Value of Ordinary Annuity ($PVA = PMT \\times \\left[\\frac{1 - (1+r)^{-n}}{r}\\right]$), Annuity Due ($PVA_{\\text{due}} = PVA \\times (1 + r)$), Perpetuity ($PV = \\frac{PMT}{r}$), and Monthly Loan Amortization (Equated Monthly Installment EMI).",
    "syllabus": [
      "Ordinary Annuity (Payments at end of period) vs Annuity Due (Payments at beginning of period).",
      "Perpetuity Formula: $PV = \\frac{PMT}{r}$ (Infinite periodic stream).",
      "Loan EMI Formula: $EMI = \\frac{P \\times r \\times (1 + r)^n}{(1 + r)^n - 1}$."
    ],
    "eTitle": "Loan EMI & Annuity Present Value Engine",
    "eDesc": "Implement function calculateLoanEmi(principal, annualRatePct, tenureMonths) calculating monthly EMI.",
    "eStarter": "function calculateLoanEmi(p, annualRatePct, n) {\n  const r = (annualRatePct / 12) / 100;\n  const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);\n  const totalPayment = emi * n;\n  const totalInterest = totalPayment - p;\n  return {\n    loanPrincipal: p,\n    monthlyEmi: Number(emi.toFixed(2)),\n    totalRepayment: Number(totalPayment.toFixed(2)),\n    totalInterestPaid: Number(totalInterest.toFixed(2)),\n    status: 'LOAN_EMI_COMPUTED'\n  };\n}",
    "eHint": "Compute r = (annualRate/12)/100, EMI = (p * r * (1+r)^n)/((1+r)^n - 1).",
    "eTest": "const res = calculateLoanEmi(100000, 12, 12); // 100k @ 12% for 12 months -> EMI = 8884.88, total = 106,618.56, int = 6618.56\nif (res.monthlyEmi !== 8884.88 || res.totalInterestPaid !== 6618.56 || res.status !== 'LOAN_EMI_COMPUTED') throw new Error('EMI calculation failed');",
    "aTitle": "Perpetuity Present Value Calculator",
    "aDesc": "Implement function calculatePerpetuity(pmt, rPct) returning `Math.round(pmt / (rPct / 100))`.",
    "aStarter": "function calculatePerpetuity() {\n  // Write your answer here\n}",
    "aHint": "Return pmt / r.",
    "aTest": "if (calculatePerpetuity(10000, 10) !== 100000) throw new Error('Perpetuity failed');"
  },
  {
    "day": 5,
    "title": "⭐ MILESTONE 1: Complete Time Value of Money & Financial Valuation Engine",
    "desc": "Milestone 1: Build an enterprise TVM and financial math engine: Multi-period compounding, uneven cash flow discounting, ordinary & due annuities, loan amortization scheduling, and perpetuity valuation.",
    "syllabus": [
      "Time value of money mathematical synthesis.",
      "Loan amortization and interest schedule generation.",
      "TVM valuation engine certification."
    ],
    "eTitle": "Time Value of Money (TVM) Master Kernel",
    "eDesc": "Implement function executeTvmMasterKernel(principal, ratePct, years, annualPmt) calculating future value, annuity present value, and overall TVM valuation status.",
    "eStarter": "function executeTvmMasterKernel(pv, rPct, n, pmt) {\n  const r = rPct / 100;\n  const fv = pv * Math.pow(1 + r, n);\n  const pva = pmt * ((1 - Math.pow(1 + r, -n)) / r);\n  return {\n    singleCashFlowFv: Number(fv.toFixed(2)),\n    annuityStreamPv: Number(pva.toFixed(2)),\n    isTvmNominal: true,\n    engineStatus: 'TVM_MASTER_KERNEL_ACTIVE_NOMINAL'\n  };\n}",
    "eHint": "Compute FV and PVA, return operational status.",
    "eTest": "const res = executeTvmMasterKernel(100000, 10, 3, 10000); // FV = 133,100; PVA = 10k * 2.48685 = 24,868.52\nif (res.singleCashFlowFv !== 133100 || res.annuityStreamPv !== 24868.52 || res.engineStatus !== 'TVM_MASTER_KERNEL_ACTIVE_NOMINAL') throw new Error('Milestone 1 TVM kernel failed');",
    "aTitle": "TVM Engine Status Formatter",
    "aDesc": "Implement function formatTvmState(ok) returning `TVM_ENGINE_${ok ? 'ACTIVE' : 'OFFLINE'}`.",
    "aStarter": "function formatTvmState() {\n  // Write your answer here\n}",
    "aHint": "Format status string.",
    "aTest": "if (formatTvmState(true) !== 'TVM_ENGINE_ACTIVE') throw new Error('TVM state format failed');"
  },
  {
    "day": 6,
    "title": "Bond Valuation: Pricing Fixed Income Securities & Coupon Pricing",
    "desc": "Value fixed-income debt securities: Bond Price equation ($V_0 = \\sum_{t=1}^n \\frac{C}{(1 + k_d)^t} + \\frac{M}{(1 + k_d)^n}$), Par Value Bonds ($k_d = \\text{Coupon Rate}$), Discount Bonds ($k_d > \\text{Coupon Rate}$), and Premium Bonds ($k_d < \\text{Coupon Rate}$).",
    "syllabus": [
      "Bond Valuation Formula: Present value of coupon annuity + Present value of maturity face value.",
      "Relationship between Market Yield ($k_d$) and Bond Price: Inverse relationship!",
      "Zero Coupon Bonds (Pure Discount Bonds): $V_0 = \\frac{M}{(1 + k_d)^n}$."
    ],
    "eTitle": "Fixed-Rate Bond Valuation Engine",
    "eDesc": "Implement function calculateBondPrice(faceValue, couponRatePct, marketYieldPct, yearsToMaturity) calculating intrinsic bond price and pricing status (Par, Premium, Discount).",
    "eStarter": "function calculateBondPrice(m, couponPct, yieldPct, n) {\n  const c = m * (couponPct / 100);\n  const kd = yieldPct / 100;\n  let pvCoupons = 0;\n  for (let t = 1; t <= n; t++) {\n    pvCoupons += c / Math.pow(1 + kd, t);\n  }\n  const pvMaturity = m / Math.pow(1 + kd, n);\n  const bondPrice = pvCoupons + pvMaturity;\n  let pricingStatus = 'PAR_BOND';\n  if (bondPrice > m + 0.5) pricingStatus = 'PREMIUM_BOND';\n  else if (bondPrice < m - 0.5) pricingStatus = 'DISCOUNT_BOND';\n  return {\n    faceValue: m,\n    annualCoupon: c,\n    intrinsicBondPrice: Number(bondPrice.toFixed(2)),\n    pricingStatus,\n    status: 'BOND_PRICE_CALCULATED'\n  };\n}",
    "eHint": "Sum PV of coupons and PV of faceValue.",
    "eTest": "const par = calculateBondPrice(1000, 10, 10, 3); // 1000\nconst prem = calculateBondPrice(1000, 12, 10, 3); // Yield < Coupon -> Premium: 1049.74\nconst disc = calculateBondPrice(1000, 8, 10, 3);  // Yield > Coupon -> Discount: 950.26\nif (par.intrinsicBondPrice !== 1000 || prem.pricingStatus !== 'PREMIUM_BOND' || disc.pricingStatus !== 'DISCOUNT_BOND') throw new Error('Bond valuation failed');",
    "aTitle": "Zero Coupon Bond Pricer",
    "aDesc": "Implement function priceZeroCouponBond(m, yieldPct, n) returning `Number((m / Math.pow(1 + yieldPct / 100, n)).toFixed(2))`.",
    "aStarter": "function priceZeroCouponBond() {\n  // Write your answer here\n}",
    "aHint": "Return m / (1 + yield)^n.",
    "aTest": "if (priceZeroCouponBond(1000, 10, 2) !== 826.45) throw new Error('Zero coupon bond failed');"
  },
  {
    "day": 7,
    "title": "Yield to Maturity (YTM) & Bond Yield Approximation",
    "desc": "Calculate the total expected annualized return on a bond held to maturity: Yield to Maturity (YTM), Approximation Formula ($\\text{Approx YTM} = \\frac{C + \\frac{M - P}{n}}{\\frac{M + P}{2}}$), and Current Yield ($\\frac{C}{P}$).",
    "syllabus": [
      "Yield to Maturity (YTM): The internal rate of return (IRR) of a bond where $PV(\\text{Cash Flows}) = \\text{Market Price}$.",
      "Approximation Formula: $\\text{YTM} \\approx \\frac{C + (M - P)/n}{(M + P)/2}$.",
      "Current Yield: Annual coupon payment divided by current market price."
    ],
    "eTitle": "Bond Yield to Maturity (YTM) Approximation Engine",
    "eDesc": "Implement function calculateApproxYtm(faceValue, marketPrice, couponRatePct, yearsToMaturity) calculating Approx YTM and Current Yield.",
    "eStarter": "function calculateApproxYtm(m, p, couponPct, n) {\n  const c = m * (couponPct / 100);\n  const numerator = c + (m - p) / n;\n  const denominator = (m + p) / 2;\n  const ytm = (numerator / denominator) * 100;\n  const currentYield = (c / p) * 100;\n  return {\n    faceValue: m,\n    marketPrice: p,\n    currentYieldPercent: Number(currentYield.toFixed(2)),\n    approxYtmPercent: Number(ytm.toFixed(2)),\n    status: 'BOND_YIELD_COMPUTED'\n  };\n}",
    "eHint": "Compute c = m * couponPct, ytm = ((c + (m-p)/n) / ((m+p)/2)) * 100.",
    "eTest": "const res = calculateApproxYtm(1000, 950, 10, 5); // c=100, num = 100 + (1000-950)/5 = 110. den = 975. YTM = 110/975 = 11.28%, CY = 100/950 = 10.53%\nif (res.approxYtmPercent !== 11.28 || res.currentYieldPercent !== 10.53 || res.status !== 'BOND_YIELD_COMPUTED') throw new Error('YTM approximation failed');",
    "aTitle": "Current Yield Formula Formatter",
    "aDesc": "Implement function getYieldFormula() returning `'Current Yield = Annual Coupon / Market Price'`.",
    "aStarter": "function getYieldFormula() {\n  // Write your answer here\n}",
    "aHint": "Return formula string.",
    "aTest": "if (getYieldFormula() !== 'Current Yield = Annual Coupon / Market Price') throw new Error('Yield formula check failed');"
  },
  {
    "day": 8,
    "title": "Interest Rate Risk: Macaulay Duration & Modified Duration",
    "desc": "Measure bond price sensitivity to interest rate fluctuations: Macaulay Duration (Weighted average time to receive cash flows), Modified Duration ($MD = \\frac{D_{\\text{Mac}}}{1 + y}$), and Percentage Price Change ($\\Delta P \\approx -MD \\times \\Delta y$).",
    "syllabus": [
      "Macaulay Duration: $D_{\\text{Mac}} = \\frac{\\sum_{t=1}^n \\frac{t \\times CF_t}{(1 + y)^t}}{P}$.",
      "Modified Duration: Percentage change in bond price for a 1% change in yield.",
      "Inverse Volatility Rule: Longer maturity $\\implies$ Higher duration $\\implies$ Higher interest rate risk!"
    ],
    "eTitle": "Macaulay & Modified Duration Engine",
    "eDesc": "Implement function calculateDurationAndPriceSensitivity(faceValue, couponRatePct, yieldPct, years, basisPointsChange) calculating Macaulay Duration, Modified Duration, and estimated percentage price change.",
    "eStarter": "function calculateDurationAndPriceSensitivity(m, couponPct, yPct, n, bps) {\n  const y = yPct / 100;\n  const c = m * (couponPct / 100);\n  let bondPrice = 0;\n  let weightedTime = 0;\n  for (let t = 1; t <= n; t++) {\n    const cf = (t === n) ? (c + m) : c;\n    const pv = cf / Math.pow(1 + y, t);\n    bondPrice += pv;\n    weightedTime += t * pv;\n  }\n  const macD = weightedTime / bondPrice;\n  const modD = macD / (1 + y);\n  const dy = bps / 10000; // bps to decimal\n  const deltaPricePct = -modD * dy * 100;\n  return {\n    bondPrice: Number(bondPrice.toFixed(2)),\n    macaulayDurationYears: Number(macD.toFixed(2)),\n    modifiedDuration: Number(modD.toFixed(2)),\n    estimatedPriceChangePercent: Number(deltaPricePct.toFixed(2)),\n    status: 'DURATION_RISK_COMPUTED'\n  };\n}",
    "eHint": "Compute macD = weightedTime / bondPrice, modD = macD / (1+y), deltaPrice = -modD * dy * 100.",
    "eTest": "const res = calculateDurationAndPriceSensitivity(1000, 10, 10, 3, 100); // 3-yr 10% par bond -> MacD = 2.74 yrs, ModD = 2.49. For +100 bps (+1%), price drops ~ -2.49%\nif (res.bondPrice !== 1000 || res.macaulayDurationYears !== 2.74 || res.modifiedDuration !== 2.49 || res.estimatedPriceChangePercent !== -2.49) throw new Error('Duration calculation failed');",
    "aTitle": "Duration Direction Invariant Formatter",
    "aDesc": "Implement function getDurationSign() returning `'-'`.",
    "aStarter": "function getDurationSign() {\n  // Write your answer here\n}",
    "aHint": "Duration has an inverse price-yield relationship — bond price falls when yield rises, so the duration sign is negative (modified duration = -dP/dY × 1/P).",
    "aTest": "if (getDurationSign() !== '-') throw new Error('Duration sign check failed');"
  },
  {
    "day": 9,
    "title": "Capital Budgeting: Net Present Value (NPV) Decision Rule",
    "desc": "Evaluate corporate capital investment projects: Net Present Value ($NPV = \\sum_{t=1}^n \\frac{CF_t}{(1 + k)^t} - C_0$), Acceptance Rule ($NPV > 0 \\implies$ Accept), Independent vs Mutually Exclusive projects.",
    "syllabus": [
      "Core Foundations: Mathematical models and concepts of Capital Budgeting: Net Present Value (NPV) Decision Rule.",
      "Operational Architecture: Valuation formulas, decision rules, and execution flow.",
      "Production Best Practices: Financial risk metrics, statutory compliance, and corporate governance."
    ],
    "eTitle": "Net Present Value (NPV) Capital Budgeting Engine",
    "eDesc": "Implement function calculateProjectNpv(initialOutlay, cashInflows, costOfCapitalPct) calculating project NPV and decision recommendation.",
    "eStarter": "function calculateProjectNpv(c0, cfs, kPct) {\n  const k = kPct / 100;\n  let pvInflows = 0;\n  cfs.forEach((cf, idx) => {\n    pvInflows += cf / Math.pow(1 + k, idx + 1);\n  });\n  const npv = pvInflows - c0;\n  const isAccepted = npv > 0;\n  return {\n    initialOutlay: c0,\n    pvOfCashInflows: Number(pvInflows.toFixed(2)),\n    netPresentValue: Number(npv.toFixed(2)),\n    isProjectAccepted: isAccepted,\n    recommendation: isAccepted ? 'ACCEPT_PROJECT_CREATES_SHAREHOLDER_WEALTH' : 'REJECT_PROJECT_DESTROYS_VALUE',\n    status: 'NPV_EVALUATION_COMPLETED'\n  };\n}",
    "eHint": "Compute pvInflows = sum(cf / (1+k)^t), npv = pvInflows - c0.",
    "eTest": "const res = calculateProjectNpv(100000, [40000, 50000, 60000], 10); // PV = 36363.64 + 41322.31 + 45078.89 = 122,764.84; NPV = +22,764.84\nif (!res.isProjectAccepted || res.netPresentValue !== 22764.84 || res.recommendation !== 'ACCEPT_PROJECT_CREATES_SHAREHOLDER_WEALTH') throw new Error('NPV calculation failed');",
    "aTitle": "NPV Decision Rule Formatter",
    "aDesc": "Implement function getNpvDecisionRule(npv) returning `npv > 0 ? 'ACCEPT' : 'REJECT'`.",
    "aStarter": "function getNpvDecisionRule() {\n  // Write your answer here\n}",
    "aHint": "Check npv > 0.",
    "aTest": "if (getNpvDecisionRule(100) !== 'ACCEPT') throw new Error('NPV decision check failed');"
  },
  {
    "day": 10,
    "title": "Capital Budgeting: Internal Rate of Return (IRR) & Hurdle Rate",
    "desc": "Calculate the exact project discount rate that sets NPV to zero: Internal Rate of Return ($IRR$ where $\\sum \\frac{CF_t}{(1 + IRR)^t} - C_0 = 0$), Comparison with Hurdle Rate / Cost of Capital ($k$), and NPV vs IRR Conflicts in Mutually Exclusive projects.",
    "syllabus": [
      "Core Foundations: Mathematical models and concepts of Capital Budgeting: Internal Rate of Return (IRR) & Hurdle Rate.",
      "Operational Architecture: Valuation formulas, decision rules, and execution flow.",
      "Production Best Practices: Financial risk metrics, statutory compliance, and corporate governance."
    ],
    "eTitle": "Internal Rate of Return (IRR) Newton-Raphson Solver",
    "eDesc": "Implement function solveProjectIrr(initialOutlay, cashInflows, hurdleRatePct) solving IRR iteratively.",
    "eStarter": "function solveProjectIrr(c0, cfs, hurdlePct) {\n  let irr = 0.10; // Initial guess 10%\n  for (let iter = 0; iter < 100; iter++) {\n    let npv = -c0;\n    let dNpv = 0; // Derivative\n    cfs.forEach((cf, idx) => {\n      const t = idx + 1;\n      npv += cf / Math.pow(1 + irr, t);\n      dNpv -= (t * cf) / Math.pow(1 + irr, t + 1);\n    });\n    const diff = npv / dNpv;\n    irr -= diff;\n    if (Math.abs(diff) < 0.0001) break;\n  }\n  const irrPct = Number((irr * 100).toFixed(2));\n  const isAccepted = irrPct >= hurdlePct;\n  return {\n    hurdleRatePercent: hurdlePct,\n    internalRateOfReturnPercent: irrPct,\n    isProjectAccepted: isAccepted,\n    recommendation: isAccepted ? 'ACCEPT_IRR_EXCEEDS_HURDLE_RATE' : 'REJECT_IRR_BELOW_COST_OF_CAPITAL',\n    status: 'IRR_SOLVER_CONVERGED'\n  };\n}",
    "eHint": "Use Newton-Raphson to solve IRR and compare with hurdlePct.",
    "eTest": "const res = solveProjectIrr(100000, [60000, 60000], 10); // 100k outlay, 60k/yr for 2 yrs -> IRR = 13.07%\nif (res.internalRateOfReturnPercent !== 13.07 || !res.isProjectAccepted || res.status !== 'IRR_SOLVER_CONVERGED') throw new Error('IRR solver failed');",
    "aTitle": "IRR vs Hurdle Rate Acceptance Formatter",
    "aDesc": "Implement function evaluateIrrRule(irr, k) returning `irr >= k ? 'ACCEPT' : 'REJECT'`.",
    "aStarter": "function evaluateIrrRule() {\n  // Write your answer here\n}",
    "aHint": "Compare irr vs k.",
    "aTest": "if (evaluateIrrRule(15, 10) !== 'ACCEPT') throw new Error('IRR rule check failed');"
  },
  {
    "day": 11,
    "title": "Capital Budgeting: Payback Period & Profitability Index (PI)",
    "desc": "Evaluate liquidity risk and capital rationing: Payback Period (Time to recover initial cash outlay), Discounted Payback Period, and Profitability Index ($PI = \\frac{\\text{PV of Cash Inflows}}{\\text{Initial Outlay}}$ where $PI > 1.0 \\implies$ Accept).",
    "syllabus": [
      "Core Foundations: Mathematical models and concepts of Capital Budgeting: Payback Period & Profitability Index (PI).",
      "Operational Architecture: Valuation formulas, decision rules, and execution flow.",
      "Production Best Practices: Financial risk metrics, statutory compliance, and corporate governance."
    ],
    "eTitle": "Payback Period & Profitability Index (PI) Calculator",
    "eDesc": "Implement function calculatePaybackAndPi(initialOutlay, cashInflows, costOfCapitalPct) calculating traditional Payback Period and Profitability Index (PI).",
    "eStarter": "function calculatePaybackAndPi(c0, cfs, kPct) {\n  let cumulative = 0;\n  let paybackYears = 0;\n  for (let i = 0; i < cfs.length; i++) {\n    if (cumulative + cfs[i] >= c0) {\n      const needed = c0 - cumulative;\n      paybackYears = i + (needed / cfs[i]);\n      break;\n    }\n    cumulative += cfs[i];\n  }\n  const k = kPct / 100;\n  let pvInflows = 0;\n  cfs.forEach((cf, idx) => {\n    pvInflows += cf / Math.pow(1 + k, idx + 1);\n  });\n  const pi = pvInflows / c0;\n  return {\n    paybackPeriodYears: Number(paybackYears.toFixed(2)),\n    profitabilityIndex: Number(pi.toFixed(2)),\n    isPiAcceptable: pi > 1.0,\n    status: 'PAYBACK_AND_PI_COMPUTED'\n  };\n}",
    "eHint": "Compute paybackYears and PI = pvInflows / c0.",
    "eTest": "const res = calculatePaybackAndPi(100000, [50000, 50000, 50000], 10); // Payback = 2.0 yrs; PV = 124,342.60 -> PI = 1.24\nif (res.paybackPeriodYears !== 2.0 || res.profitabilityIndex !== 1.24 || !res.isPiAcceptable) throw new Error('Payback & PI calculation failed');",
    "aTitle": "PI Acceptance Threshold Formatter",
    "aDesc": "Implement function isPiAccepted(pi) returning `pi > 1.0`.",
    "aStarter": "function isPiAccepted() {\n  // Write your answer here\n}",
    "aHint": "Return pi > 1.0.",
    "aTest": "if (!isPiAccepted(1.15)) throw new Error('PI threshold check failed');"
  },
  {
    "day": 12,
    "title": "Cost of Capital: Cost of Debt ($K_d$) & Tax Shield",
    "desc": "Calculate debt financing costs: Pre-Tax Cost of Debt ($i$), Tax Shield of Debt, and After-Tax Cost of Debt ($K_d = i(1 - t)$), Flotation Costs, and redeemable debt yield.",
    "syllabus": [
      "Core Foundations: Mathematical models and concepts of Cost of Capital: Cost of Debt ($K_d$) & Tax Shield.",
      "Operational Architecture: Valuation formulas, decision rules, and execution flow.",
      "Production Best Practices: Financial risk metrics, statutory compliance, and corporate governance."
    ],
    "eTitle": "After-Tax Cost of Debt & Tax Shield Calculator",
    "eDesc": "Implement function calculateCostOfDebt(preTaxInterestRatePct, corporateTaxRatePct) calculating After-Tax Cost of Debt and tax shield percentage.",
    "eStarter": "function calculateCostOfDebt(iPct, taxPct) {\n  const i = iPct / 100;\n  const t = taxPct / 100;\n  const kd = i * (1 - t);\n  const taxShieldPct = iPct * t;\n  return {\n    preTaxCostOfDebtPercent: iPct,\n    corporateTaxRatePercent: taxPct,\n    taxShieldSavingsPercent: Number(taxShieldPct.toFixed(2)),\n    afterTaxCostOfDebtPercent: Number((kd * 100).toFixed(2)),\n    status: 'COST_OF_DEBT_COMPUTED'\n  };\n}",
    "eHint": "Interest payments are tax-deductible, so the government effectively subsidises part of the cost — multiply the pre-tax rate by (1 − tax rate) to find the true after-tax cost of debt.",
    "eTest": "const res = calculateCostOfDebt(10, 25); // 10% * (1 - 0.25) = 7.5%\nif (res.afterTaxCostOfDebtPercent !== 7.5 || res.taxShieldSavingsPercent !== 2.5 || res.status !== 'COST_OF_DEBT_COMPUTED') throw new Error('Cost of debt calculation failed');",
    "aTitle": "Cost of Debt Formula Formatter",
    "aDesc": "Implement function getKdFormula() returning `'Kd = i * (1 - t)'`.",
    "aStarter": "function getKdFormula() {\n  // Write your answer here\n}",
    "aHint": "Return formula string.",
    "aTest": "if (getKdFormula() !== 'Kd = i * (1 - t)') throw new Error('Kd formula check failed');"
  },
  {
    "day": 13,
    "title": "Cost of Capital: Cost of Equity ($K_e$) via CAPM & Dividend Growth",
    "desc": "Calculate equity investor required returns: Capital Asset Pricing Model ($K_e = R_f + \\beta(R_m - R_f)$), Gordon Constant Dividend Growth Model ($K_e = \\frac{D_1}{P_0} + g$), and Cost of Retained Earnings ($K_r$).",
    "syllabus": [
      "Core Foundations: Mathematical models and concepts of Cost of Capital: Cost of Equity ($K_e$) via CAPM & Dividend Growth.",
      "Operational Architecture: Valuation formulas, decision rules, and execution flow.",
      "Production Best Practices: Financial risk metrics, statutory compliance, and corporate governance."
    ],
    "eTitle": "Cost of Equity (CAPM & Gordon Growth) Dual Evaluator",
    "eDesc": "Implement function calculateCostOfEquity(riskFreeRatePct, beta, marketRiskPremiumPct, currentDividend, stockPrice, growthRatePct) calculating Ke under both models.",
    "eStarter": "function calculateCostOfEquity(rfPct, beta, mrpPct, d0, p0, gPct) {\n  const capmKe = rfPct + beta * mrpPct;\n  const d1 = d0 * (1 + gPct / 100);\n  const gordonKe = (d1 / p0) * 100 + gPct;\n  return {\n    capmCostOfEquityPercent: Number(capmKe.toFixed(2)),\n    gordonCostOfEquityPercent: Number(gordonKe.toFixed(2)),\n    status: 'COST_OF_EQUITY_EVALUATED'\n  };\n}",
    "eHint": "Compute capmKe = rf + beta * mrp, gordonKe = ((d0*(1+g))/p0)*100 + g.",
    "eTest": "const res = calculateCostOfEquity(6, 1.2, 5, 4, 50, 4); // CAPM = 6 + 1.2*5 = 12%; Gordon: D1=4.16, Ke = (4.16/50)*100 + 4 = 12.32%\nif (res.capmCostOfEquityPercent !== 12.0 || res.gordonCostOfEquityPercent !== 12.32 || res.status !== 'COST_OF_EQUITY_EVALUATED') throw new Error('Cost of equity failed');",
    "aTitle": "CAPM Equation Formatter",
    "aDesc": "Implement function getCapmFormula() returning `'Ke = Rf + Beta * (Rm - Rf)'`.",
    "aStarter": "function getCapmFormula() {\n  // Write your answer here\n}",
    "aHint": "Return CAPM formula.",
    "aTest": "if (getCapmFormula() !== 'Ke = Rf + Beta * (Rm - Rf)') throw new Error('CAPM formula check failed');"
  },
  {
    "day": 14,
    "title": "Weighted Average Cost of Capital (WACC) & Overall Hurdle Rate",
    "desc": "Determine the firm's composite cost of capital: Weighted Average Cost of Capital ($WACC = w_e K_e + w_d K_d + w_p K_p$), Book Value Weights vs Market Value Weights, and Marginal Cost of Capital (MCC).",
    "syllabus": [
      "Core Foundations: Mathematical models and concepts of Weighted Average Cost of Capital (WACC) & Overall Hurdle Rate.",
      "Operational Architecture: Valuation formulas, decision rules, and execution flow.",
      "Production Best Practices: Financial risk metrics, statutory compliance, and corporate governance."
    ],
    "eTitle": "Weighted Average Cost of Capital (WACC) Engine",
    "eDesc": "Implement function calculateWacc(equityValue, debtValue, costOfEquityPct, preTaxCostOfDebtPct, taxRatePct) calculating firm WACC.",
    "eStarter": "function calculateWacc(e, d, kePct, kdPrePct, tPct) {\n  const totalV = e + d;\n  const we = e / totalV;\n  const wd = d / totalV;\n  const kdAfter = kdPrePct * (1 - tPct / 100);\n  const wacc = we * kePct + wd * kdAfter;\n  return {\n    totalFirmValue: totalV,\n    equityWeight: Number(we.toFixed(2)),\n    debtWeight: Number(wd.toFixed(2)),\n    afterTaxCostOfDebtPercent: Number(kdAfter.toFixed(2)),\n    waccPercent: Number(wacc.toFixed(2)),\n    status: 'WACC_COMPUTED'\n  };\n}",
    "eHint": "Compute we = e/V, wd = d/V, kdAfter = kdPre * (1 - t), wacc = we*ke + wd*kdAfter.",
    "eTest": "const res = calculateWacc(600000, 400000, 15, 10, 25); // V=1M, We=0.6, Wd=0.4. KdAfter = 7.5%. WACC = 0.6*15 + 0.4*7.5 = 9.0 + 3.0 = 12.0%\nif (res.waccPercent !== 12.0 || res.equityWeight !== 0.6 || res.debtWeight !== 0.4 || res.status !== 'WACC_COMPUTED') throw new Error('WACC calculation failed');",
    "aTitle": "WACC Formula Formatter",
    "aDesc": "Implement function getWaccFormula() returning `'WACC = We * Ke + Wd * Kd + Wp * Kp'`.",
    "aStarter": "function getWaccFormula() {\n  // Write your answer here\n}",
    "aHint": "Return WACC formula.",
    "aTest": "if (getWaccFormula() !== 'WACC = We * Ke + Wd * Kd + Wp * Kp') throw new Error('WACC formula check failed');"
  },
  {
    "day": 15,
    "title": "⭐ MILESTONE 2: Complete Capital Budgeting & Cost of Capital Valuation Engine",
    "desc": "Milestone 2: Build a production corporate valuation engine: Multi-project NPV & IRR capital budgeting, debt tax shield evaluation, CAPM equity estimation, and enterprise WACC hurdle rate determination.",
    "syllabus": [
      "Core Foundations: Mathematical models and concepts of ⭐ MILESTONE 2: Complete Capital Budgeting & Cost of Capital Valuation Engine.",
      "Operational Architecture: Valuation formulas, decision rules, and execution flow.",
      "Production Best Practices: Financial risk metrics, statutory compliance, and corporate governance."
    ],
    "eTitle": "Corporate Capital Budgeting & WACC Master Engine",
    "eDesc": "Implement function executeCapitalBudgetingMaster(initialOutlay, cashInflows, equityValue, debtValue, costOfEquityPct, preTaxDebtRatePct, taxRatePct) determining WACC and project NPV at WACC.",
    "eStarter": "function executeCapitalBudgetingMaster(c0, cfs, e, d, kePct, kdPrePct, tPct) {\n  const totalV = e + d;\n  const we = e / totalV;\n  const wd = d / totalV;\n  const kdAfter = kdPrePct * (1 - tPct / 100);\n  const wacc = we * kePct + wd * kdAfter;\n  const waccRate = wacc / 100;\n  let pvInflows = 0;\n  cfs.forEach((cf, idx) => {\n    pvInflows += cf / Math.pow(1 + waccRate, idx + 1);\n  });\n  const npv = pvInflows - c0;\n  return {\n    enterpriseWaccPercent: Number(wacc.toFixed(2)),\n    projectNpvAtWacc: Number(npv.toFixed(2)),\n    isProjectAccepted: npv > 0,\n    engineStatus: 'CAPITAL_BUDGETING_WACC_MASTER_ACTIVE'\n  };\n}",
    "eHint": "Compute WACC, discount cash flows at WACC, verify NPV > 0.",
    "eTest": "const res = executeCapitalBudgetingMaster(100000, [60000, 60000], 600000, 400000, 15, 10, 25); // WACC = 12%, PV = 60k/1.12 + 60k/1.2544 = 53571.43 + 47831.63 = 101,403.06 -> NPV = +1403.06\nif (!res.isProjectAccepted || res.enterpriseWaccPercent !== 12.0 || res.projectNpvAtWacc !== 1403.06 || res.engineStatus !== 'CAPITAL_BUDGETING_WACC_MASTER_ACTIVE') throw new Error('Milestone 2 Capital Budgeting failed');",
    "aTitle": "Valuation Master Engine Formatter",
    "aDesc": "Implement function getValuationEngineStatus() returning `'CAPITAL_BUDGETING_WACC_MASTER_ACTIVE'`.",
    "aStarter": "function getValuationEngineStatus() {\n  // Write your answer here\n}",
    "aHint": "Return status.",
    "aTest": "if (getValuationEngineStatus() !== 'CAPITAL_BUDGETING_WACC_MASTER_ACTIVE') throw new Error('Status check failed');"
  },
  {
    "day": 16,
    "title": "Operating, Financial & Combined Leverage: DOL, DFL & DCL",
    "desc": "Analyze business and financial risk: Degree of Operating Leverage ($DOL = \\frac{\\text{Contribution}}{\\text{EBIT}}$), Degree of Financial Leverage ($DFL = \\frac{\\text{EBIT}}{\\text{EBT}}$), and Degree of Combined Leverage ($DCL = DOL \\times DFL = \\frac{\\text{Contribution}}{\\text{EBT}}$).",
    "syllabus": [
      "Core Foundations: Mathematical models and concepts of Operating, Financial & Combined Leverage: DOL, DFL & DCL.",
      "Operational Architecture: Valuation formulas, decision rules, and execution flow.",
      "Production Best Practices: Financial risk metrics, statutory compliance, and corporate governance."
    ],
    "eTitle": "Operating, Financial & Combined Leverage Engine",
    "eDesc": "Implement function calculateLeverages(salesRevenue, variableCost, fixedCost, interestExpense) calculating DOL, DFL, and DCL.",
    "eStarter": "function calculateLeverages(sales, vc, fc, interest) {\n  const contribution = sales - vc;\n  const ebit = contribution - fc;\n  const ebt = ebit - interest;\n  const dol = contribution / ebit;\n  const dfl = ebit / ebt;\n  const dcl = dol * dfl;\n  return {\n    contribution,\n    ebit,\n    ebt,\n    degreeOfOperatingLeverage: Number(dol.toFixed(2)),\n    degreeOfFinancialLeverage: Number(dfl.toFixed(2)),\n    degreeOfCombinedLeverage: Number(dcl.toFixed(2)),\n    status: 'LEVERAGE_METRICS_EVALUATED'\n  };\n}",
    "eHint": "Compute DOL = Contribution/EBIT, DFL = EBIT/EBT, DCL = DOL * DFL.",
    "eTest": "const res = calculateLeverages(500000, 200000, 100000, 50000); // Contrib = 300k, EBIT = 200k, EBT = 150k -> DOL = 1.5, DFL = 1.33, DCL = 2.0\nif (res.degreeOfOperatingLeverage !== 1.5 || res.degreeOfFinancialLeverage !== 1.33 || res.degreeOfCombinedLeverage !== 2.0) throw new Error('Leverage calculation failed');",
    "aTitle": "Combined Leverage Relationship Formatter",
    "aDesc": "Implement function getDclFormula() returning `'DCL = DOL * DFL'`.",
    "aStarter": "function getDclFormula() {\n  // Write your answer here\n}",
    "aHint": "Return DCL formula.",
    "aTest": "if (getDclFormula() !== 'DCL = DOL * DFL') throw new Error('DCL formula check failed');"
  },
  {
    "day": 17,
    "title": "Break-Even Analysis & Margin of Safety",
    "desc": "Calculate cost-volume-profit dynamics: Contribution Margin per unit ($P - V$), P/V Ratio ($\\frac{P - V}{P} \\times 100\\%$), Break-Even Point in Units ($Q_{BE} = \\frac{FC}{P - V}$), Break-Even in Dollars ($\\frac{FC}{P/V}$), and Margin of Safety ($MOS = \\text{Actual Sales} - \\text{BES}$).",
    "syllabus": [
      "Core Foundations: Mathematical models and concepts of Break-Even Analysis & Margin of Safety.",
      "Operational Architecture: Valuation formulas, decision rules, and execution flow.",
      "Production Best Practices: Financial risk metrics, statutory compliance, and corporate governance."
    ],
    "eTitle": "Break-Even Point & Margin of Safety Engine",
    "eDesc": "Implement function calculateBreakEvenAndMos(fixedCost, sellingPricePerUnit, variableCostPerUnit, actualSalesUnits) calculating BEP and MOS.",
    "eStarter": "function calculateBreakEvenAndMos(fc, p, v, actualUnits) {\n  const unitContrib = p - v;\n  const pvRatio = (unitContrib / p) * 100;\n  const bepUnits = fc / unitContrib;\n  const bepDollars = bepUnits * p;\n  const actualSalesDollars = actualUnits * p;\n  const mosDollars = actualSalesDollars - bepDollars;\n  const mosPct = (mosDollars / actualSalesDollars) * 100;\n  return {\n    breakEvenUnits: Math.round(bepUnits),\n    breakEvenSalesDollars: Math.round(bepDollars),\n    marginOfSafetyDollars: Math.round(mosDollars),\n    marginOfSafetyPercent: Number(mosPct.toFixed(2)),\n    status: 'BREAK_EVEN_ANALYSIS_COMPLETED'\n  };\n}",
    "eHint": "Compute bepUnits = fc / (p - v), mosDollars = actualSales - bepDollars.",
    "eTest": "const res = calculateBreakEvenAndMos(100000, 50, 30, 8000); // Contrib = 20, BEP = 5,000 units ($250k). Actual = 8,000 units ($400k). MOS = $150k (37.5%)\nif (res.breakEvenUnits !== 5000 || res.breakEvenSalesDollars !== 250000 || res.marginOfSafetyDollars !== 150000 || res.marginOfSafetyPercent !== 37.5) throw new Error('Break-even analysis failed');",
    "aTitle": "Break-Even Equation Formatter",
    "aDesc": "Implement function getBepFormula() returning `'BEP Units = Fixed Cost / (Selling Price - Variable Cost)'`.",
    "aStarter": "function getBepFormula() {\n  // Write your answer here\n}",
    "aHint": "Return BEP formula.",
    "aTest": "if (getBepFormula() !== 'BEP Units = Fixed Cost / (Selling Price - Variable Cost)') throw new Error('BEP formula check failed');"
  },
  {
    "day": 18,
    "title": "Working Capital Management & Quarterly Cash Budgeting",
    "desc": "Forecast short-term liquidity: Cash Receipts (Cash sales + debtor collections with lag), Cash Payments (Purchases, wages, taxes, dividends), Minimum Cash Balance requirements, and Short-Term Financing / Overdraft requirements.",
    "syllabus": [
      "Core Foundations: Mathematical models and concepts of Working Capital Management & Quarterly Cash Budgeting.",
      "Operational Architecture: Valuation formulas, decision rules, and execution flow.",
      "Production Best Practices: Financial risk metrics, statutory compliance, and corporate governance."
    ],
    "eTitle": "Quarterly Cash Budget Forecasting Engine",
    "eDesc": "Implement function generateCashBudget(openingCash, cashReceiptsList, cashPaymentsList, minimumCashRequired = 10000) forecasting closing cash and financing deficits across quarters.",
    "eStarter": "function generateCashBudget(opening, receipts, payments, minCash = 10000) {\n  let currCash = opening;\n  const closingBalances = [];\n  const overdraftRequired = [];\n  for (let q = 0; q < receipts.length; q++) {\n    const netFlow = receipts[q] - payments[q];\n    currCash += netFlow;\n    closingBalances.push(currCash);\n    overdraftRequired.push(currCash < minCash ? (minCash - currCash) : 0);\n  }\n  return {\n    openingCash: opening,\n    quarterlyClosingBalances: closingBalances,\n    quarterlyOverdraftNeeded: overdraftRequired,\n    status: 'CASH_BUDGET_GENERATED'\n  };\n}",
    "eHint": "Iterate quarters: currCash += receipts[q] - payments[q], track deficit below minCash.",
    "eTest": "const res = generateCashBudget(20000, [50000, 40000], [45000, 60000], 10000); // Q1: 20k + 5k = 25k (OD=0); Q2: 25k - 20k = 5k (OD=5k to maintain 10k)\nif (res.quarterlyClosingBalances[0] !== 25000 || res.quarterlyClosingBalances[1] !== 5000 || res.quarterlyOverdraftNeeded[1] !== 5000) throw new Error('Cash budget failed');",
    "aTitle": "Cash Budget Objective Formatter",
    "aDesc": "Implement function getCashBudgetGoal() returning `'PREVENT_LIQUIDITY_CRISIS_AND_OPTIMIZE_SURPLUS_CASH'`.",
    "aStarter": "function getCashBudgetGoal() {\n  // Write your answer here\n}",
    "aHint": "Return objective string.",
    "aTest": "if (getCashBudgetGoal() !== 'PREVENT_LIQUIDITY_CRISIS_AND_OPTIMIZE_SURPLUS_CASH') throw new Error('Goal check failed');"
  },
  {
    "day": 19,
    "title": "Capital Structure Theories: Modigliani-Miller (MM) Theorem",
    "desc": "Evaluate the impact of debt on firm value: Net Income (NI) Approach, Net Operating Income (NOI) Approach, Traditional Trade-Off Theory, MM Proposition I without taxes ($V_U = V_L$), and MM Proposition I with Corporate Taxes ($V_L = V_U + t \\times D$).",
    "syllabus": [
      "Core Foundations: Mathematical models and concepts of Capital Structure Theories: Modigliani-Miller (MM) Theorem.",
      "Operational Architecture: Valuation formulas, decision rules, and execution flow.",
      "Production Best Practices: Financial risk metrics, statutory compliance, and corporate governance."
    ],
    "eTitle": "Modigliani-Miller (MM) Levered Firm Value Evaluator",
    "eDesc": "Implement function calculateMmLeveredValue(unleveredFirmValue, debtValue, corporateTaxRatePct) calculating levered firm value under MM with taxes.",
    "eStarter": "function calculateMmLeveredValue(vu, d, taxPct) {\n  const t = taxPct / 100;\n  const taxShieldPv = t * d;\n  const vl = vu + taxShieldPv;\n  return {\n    unleveredFirmValue: vu,\n    debtValue: d,\n    presentValueOfTaxShield: Math.round(taxShieldPv),\n    leveredFirmValue: Math.round(vl),\n    status: 'MM_THEORY_WITH_TAXES_EVALUATED'\n  };\n}",
    "eHint": "Under MM with taxes, debt creates a 'tax shield' because interest is deductible — the present value of that shield is t × D, which is added directly to the unlevered firm value.",
    "eTest": "const res = calculateMmLeveredValue(1000000, 400000, 25); // V_L = 1M + 0.25 * 400k = 1M + 100k = 1,100,000\nif (res.leveredFirmValue !== 1100000 || res.presentValueOfTaxShield !== 100000 || res.status !== 'MM_THEORY_WITH_TAXES_EVALUATED') throw new Error('MM valuation failed');",
    "aTitle": "MM Proposition I Formula Formatter",
    "aDesc": "Implement function getMmFormula() returning `'VL = VU + t * D'`.",
    "aStarter": "function getMmFormula() {\n  // Write your answer here\n}",
    "aHint": "Return VL formula.",
    "aTest": "if (getMmFormula() !== 'VL = VU + t * D') throw new Error('MM formula check failed');"
  },
  {
    "day": 20,
    "title": "Dividend Policy Theories: Walter's Model & Gordon's Model",
    "desc": "Assess how dividend payout influences stock price: Walter's Model ($P = \\frac{D + \\frac{r}{K_e}(E - D)}{K_e}$ where $r > K_e \\implies$ Growth firm should retain 100%), Gordon's Model ($P = \\frac{E(1 - b)}{K_e - br}$), and Modigliani-Miller Dividend Irrelevance.",
    "syllabus": [
      "Core Foundations: Mathematical models and concepts of Dividend Policy Theories: Walter's Model & Gordon's Model.",
      "Operational Architecture: Valuation formulas, decision rules, and execution flow.",
      "Production Best Practices: Financial risk metrics, statutory compliance, and corporate governance."
    ],
    "eTitle": "Walter's Model Stock Price Evaluator",
    "eDesc": "Implement function calculateWalterModelPrice(dividendPerShare, earningsPerShare, internalReturnRatePct, costOfEquityPct) calculating share price under Walter's Model.",
    "eStarter": "function calculateWalterModelPrice(d, e, rPct, kePct) {\n  const r = rPct / 100;\n  const ke = kePct / 100;\n  const price = (d + (r / ke) * (e - d)) / ke;\n  let firmCategory = 'NORMAL_FIRM';\n  if (r > ke) firmCategory = 'GROWTH_FIRM_OPTIMAL_PAYOUT_ZERO';\n  else if (r < ke) firmCategory = 'DECLINING_FIRM_OPTIMAL_PAYOUT_100';\n  return {\n    earningsPerShare: e,\n    dividendPerShare: d,\n    calculatedSharePrice: Number(price.toFixed(2)),\n    firmCategory,\n    status: 'WALTER_MODEL_EVALUATED'\n  };\n}",
    "eHint": "Compute price = (d + (r/ke)*(e-d)) / ke.",
    "eTest": "const res = calculateWalterModelPrice(4, 10, 15, 10); // r=15%, ke=10% -> Growth firm! P = (4 + (0.15/0.10)*(10-4))/0.10 = (4 + 1.5*6)/0.10 = (4 + 9)/0.10 = $130.00\nif (res.calculatedSharePrice !== 130.0 || res.firmCategory !== 'GROWTH_FIRM_OPTIMAL_PAYOUT_ZERO') throw new Error('Walter model failed');",
    "aTitle": "Walter Model Growth Rule Formatter",
    "aDesc": "Implement function getGrowthFirmOptimalPayout() returning `0`.",
    "aStarter": "function getGrowthFirmOptimalPayout() {\n  // Write your answer here\n}",
    "aHint": "Return 0 (0% payout).",
    "aTest": "if (getGrowthFirmOptimalPayout() !== 0) throw new Error('Growth rule check failed');"
  },
  {
    "day": 21,
    "title": "⭐ MILESTONE 3: Complete Corporate Capital Structure & Dividend Optimization Engine",
    "desc": "Milestone 3: Build an enterprise capital structure optimization engine: Operating/financial leverage analysis, break-even CVP dynamics, MM debt tax shield valuation, and Walter/Gordon dividend optimization.",
    "syllabus": [
      "Core Foundations: Mathematical models and concepts of ⭐ MILESTONE 3: Complete Corporate Capital Structure & Dividend Optimization Engine.",
      "Operational Architecture: Valuation formulas, decision rules, and execution flow.",
      "Production Best Practices: Financial risk metrics, statutory compliance, and corporate governance."
    ],
    "eTitle": "Capital Structure & Corporate Policy Master Engine",
    "eDesc": "Implement function executeCorporatePolicyMaster(ebit, interest, debtValue, corporateTaxPct, eps, dps, roiPct, kePct) certifying combined capital structure and dividend policy optimization.",
    "eStarter": "function executeCorporatePolicyMaster(ebit, interest, debt, taxPct, eps, dps, roiPct, kePct) {\n  const ebt = ebit - interest;\n  const dfl = ebit / ebt;\n  const mmVl = debt * (taxPct / 100);\n  const r = roiPct / 100;\n  const ke = kePct / 100;\n  const walterPrice = (dps + (r / ke) * (eps - dps)) / ke;\n  return {\n    degreeOfFinancialLeverage: Number(dfl.toFixed(2)),\n    taxShieldBenefit: Math.round(mmVl),\n    walterEquityPrice: Number(walterPrice.toFixed(2)),\n    engineStatus: 'CORPORATE_POLICY_MASTER_ENGINE_ACTIVE'\n  };\n}",
    "eHint": "Compute DFL, MM tax shield, and Walter price, return active status.",
    "eTest": "const res = executeCorporatePolicyMaster(200000, 50000, 400000, 25, 10, 4, 15, 10); // DFL = 1.33, Tax shield = 100k, Walter = 130.0\nif (res.degreeOfFinancialLeverage !== 1.33 || res.taxShieldBenefit !== 100000 || res.walterEquityPrice !== 130.0 || res.engineStatus !== 'CORPORATE_POLICY_MASTER_ENGINE_ACTIVE') throw new Error('Milestone 3 Corporate Policy failed');",
    "aTitle": "Corporate Policy Engine Status Formatter",
    "aDesc": "Implement function formatPolicyEngineState(ok) returning `POLICY_ENGINE_${ok ? 'ACTIVE' : 'OFFLINE'}`.",
    "aStarter": "function formatPolicyEngineState() {\n  // Write your answer here\n}",
    "aHint": "Format status string.",
    "aTest": "if (formatPolicyEngineState(true) !== 'POLICY_ENGINE_ACTIVE') throw new Error('Policy state format failed');"
  },
  {
    "day": 22,
    "title": "Equity Valuation: DCF Free Cash Flow & Multiples Valuation (P/E, EV/EBITDA)",
    "desc": "Value equity shares: Discounted Free Cash Flow to Firm (FCFF), Free Cash Flow to Equity (FCFE), Price-to-Earnings (P/E), Price-to-Book (P/B), and Enterprise Value to EBITDA (EV/EBITDA).",
    "syllabus": [
      "Core Foundations: Mathematical models and concepts of Equity Valuation: DCF Free Cash Flow & Multiples Valuation (P/E, EV/EBITDA).",
      "Operational Architecture: Valuation formulas, decision rules, and execution flow.",
      "Production Best Practices: Financial risk metrics, statutory compliance, and corporate governance."
    ],
    "eTitle": "FCFF Enterprise Valuation & P/E Multiple Engine",
    "eDesc": "Implement function calculateEnterpriseAndPeValue(fcffList, terminalGrowthPct, waccPct, netDebt, sharesOutstanding, eps, peerPeMultiple) calculating intrinsic share price via DCF and comparative P/E.",
    "eStarter": "function calculateEnterpriseAndPeValue(fcffs, gPct, waccPct, netDebt, shares, eps, peMultiple) {\n  const wacc = waccPct / 100;\n  const g = gPct / 100;\n  let pvFcff = 0;\n  fcffs.forEach((cf, idx) => {\n    pvFcff += cf / Math.pow(1 + wacc, idx + 1);\n  });\n  const lastCf = fcffs[fcffs.length - 1];\n  const terminalVal = (lastCf * (1 + g)) / (wacc - g);\n  const pvTerminal = terminalVal / Math.pow(1 + wacc, fcffs.length);\n  const enterpriseValue = pvFcff + pvTerminal;\n  const equityValue = enterpriseValue - netDebt;\n  const dcfPricePerShare = equityValue / shares;\n  const pePricePerShare = eps * peMultiple;\n  return {\n    enterpriseValue: Math.round(enterpriseValue),\n    equityValue: Math.round(equityValue),\n    dcfIntrinsicPricePerShare: Number(dcfPricePerShare.toFixed(2)),\n    peComparativePricePerShare: Number(pePricePerShare.toFixed(2)),\n    status: 'EQUITY_VALUATION_COMPLETED'\n  };\n}",
    "eHint": "Compute PV of FCFFs + PV of Terminal Value, deduct netDebt to get equityValue, divide by shares.",
    "eTest": "const res = calculateEnterpriseAndPeValue([50000, 60000], 3, 10, 100000, 10000, 5, 15); // P/E price = 5 * 15 = 75.00\nif (res.peComparativePricePerShare !== 75.0 || res.status !== 'EQUITY_VALUATION_COMPLETED') throw new Error('Equity valuation failed');",
    "aTitle": "P/E Target Price Formatter",
    "aDesc": "Implement function calculatePeTarget(eps, pe) returning `Number((eps * pe).toFixed(2))`.",
    "aStarter": "function calculatePeTarget() {\n  // Write your answer here\n}",
    "aHint": "Return eps * pe.",
    "aTest": "if (calculatePeTarget(5, 20) !== 100.0) throw new Error('P/E target check failed');"
  },
  {
    "day": 23,
    "title": "Modern Portfolio Theory: 2-Asset Portfolio Return, Variance & Diversification",
    "desc": "Construct optimal investment portfolios: Expected Portfolio Return ($E(R_p) = w_1 R_1 + w_2 R_2$), Portfolio Variance ($\\sigma_p^2 = w_1^2 \\sigma_1^2 + w_2^2 \\sigma_2^2 + 2 w_1 w_2 \\text{Cov}_{12}$), Correlation Coefficient ($\\rho_{12}$), and Risk Diversification Benefits.",
    "syllabus": [
      "Core Foundations: Mathematical models and concepts of Modern Portfolio Theory: 2-Asset Portfolio Return, Variance & Diversification.",
      "Operational Architecture: Valuation formulas, decision rules, and execution flow.",
      "Production Best Practices: Financial risk metrics, statutory compliance, and corporate governance."
    ],
    "eTitle": "2-Asset Portfolio Risk & Return Engine",
    "eDesc": "Implement function calculatePortfolioRiskReturn(w1, r1Pct, std1Pct, w2, r2Pct, std2Pct, correlation) calculating expected return and portfolio standard deviation.",
    "eStarter": "function calculatePortfolioRiskReturn(w1, r1, s1, w2, r2, s2, rho) {\n  const portReturn = w1 * r1 + w2 * r2;\n  const var1 = Math.pow(w1 * s1, 2);\n  const var2 = Math.pow(w2 * s2, 2);\n  const covTerm = 2 * w1 * w2 * s1 * s2 * rho;\n  const portVar = var1 + var2 + covTerm;\n  const portStd = Math.sqrt(Math.max(0, portVar));\n  return {\n    expectedPortfolioReturnPercent: Number(portReturn.toFixed(2)),\n    portfolioVariance: Number(portVar.toFixed(2)),\n    portfolioStandardDeviationPercent: Number(portStd.toFixed(2)),\n    diversificationBenefitDetected: portStd < (w1 * s1 + w2 * s2),\n    status: 'PORTFOLIO_RISK_RETURN_COMPUTED'\n  };\n}",
    "eHint": "Compute portReturn = w1*r1 + w2*r2, portVar = (w1*s1)^2 + (w2*s2)^2 + 2*w1*w2*s1*s2*rho.",
    "eTest": "const res = calculatePortfolioRiskReturn(0.5, 12, 20, 0.5, 8, 10, 0.0); // Ret = 10%. Var = 0.25*400 + 0.25*100 + 0 = 100 + 25 = 125. Std = sqrt(125) = 11.18% (< weighted avg 15%!)\nif (res.expectedPortfolioReturnPercent !== 10.0 || res.portfolioStandardDeviationPercent !== 11.18 || !res.diversificationBenefitDetected) throw new Error('Portfolio calculation failed');",
    "aTitle": "Perfect Negative Correlation Formatter",
    "aDesc": "Implement function getMinRiskCorrelation() returning `-1.0`.",
    "aStarter": "function getMinRiskCorrelation() {\n  // Write your answer here\n}",
    "aHint": "Return -1.0.",
    "aTest": "if (getMinRiskCorrelation() !== -1.0) throw new Error('Min risk correlation check failed');"
  },
  {
    "day": 24,
    "title": "Capital Asset Pricing Model (CAPM) & Security Market Line (SML)",
    "desc": "Price systematic market risk: CAPM Formula ($E(R_i) = R_f + \\beta_i(E(R_m) - R_f)$), Systematic Risk (Beta $\\beta$) vs Unsystematic Risk (Diversifiable), Security Market Line (SML), and identifying Undervalued (Alpha $> 0$) vs Overvalued (Alpha $< 0$) securities.",
    "syllabus": [
      "Core Foundations: Mathematical models and concepts of Capital Asset Pricing Model (CAPM) & Security Market Line (SML).",
      "Operational Architecture: Valuation formulas, decision rules, and execution flow.",
      "Production Best Practices: Financial risk metrics, statutory compliance, and corporate governance."
    ],
    "eTitle": "CAPM Security Market Line & Alpha Mispricing Evaluator",
    "eDesc": "Implement function evaluateCapmMispricing(riskFreePct, marketReturnPct, beta, actualExpectedReturnPct) calculating required CAPM return, Jensen's Alpha, and valuation signal (Undervalued / Overvalued).",
    "eStarter": "function evaluateCapmMispricing(rf, rm, beta, actualReturn) {\n  const capmRequired = rf + beta * (rm - rf);\n  const alpha = actualReturn - capmRequired;\n  let signal = 'FAIRLY_PRICED_ON_SML';\n  if (alpha > 0.1) signal = 'UNDERVALUED_BUY_ABOVE_SML';\n  else if (alpha < -0.1) signal = 'OVERVALUED_SELL_BELOW_SML';\n  return {\n    riskFreeRatePercent: rf,\n    marketReturnPercent: rm,\n    betaCoefficient: beta,\n    capmRequiredReturnPercent: Number(capmRequired.toFixed(2)),\n    jensensAlphaPercent: Number(alpha.toFixed(2)),\n    investmentSignal: signal,\n    status: 'CAPM_SML_EVALUATED'\n  };\n}",
    "eHint": "Compute capmRequired = rf + beta*(rm - rf), alpha = actualReturn - capmRequired.",
    "eTest": "const buy = evaluateCapmMispricing(5, 11, 1.2, 14); // Required = 5 + 1.2*6 = 12.2%. Actual = 14% -> Alpha = +1.8% -> BUY\nconst sell = evaluateCapmMispricing(5, 11, 1.2, 10); // Required = 12.2%. Actual = 10% -> Alpha = -2.2% -> SELL\nif (buy.jensensAlphaPercent !== 1.8 || buy.investmentSignal !== 'UNDERVALUED_BUY_ABOVE_SML' || sell.investmentSignal !== 'OVERVALUED_SELL_BELOW_SML') throw new Error('CAPM mispricing failed');",
    "aTitle": "Beta Risk Benchmark Formatter",
    "aDesc": "Implement function getMarketBeta() returning `1.0`.",
    "aStarter": "function getMarketBeta() {\n  // Write your answer here\n}",
    "aHint": "The market portfolio (e.g., S&P 500 index) always has beta = 1.0 by definition — it IS the benchmark; any other asset's beta is measured relative to it via CAPM.",
    "aTest": "if (getMarketBeta() !== 1.0) throw new Error('Market beta check failed');"
  },
  {
    "day": 25,
    "title": "Portfolio Performance Measurement: Sharpe, Treynor & Jensen Ratios",
    "desc": "Benchmark investment manager performance: Sharpe Ratio ($SR = \\frac{R_p - R_f}{\\sigma_p}$ measuring excess return per unit of total risk), Treynor Ratio ($TR = \\frac{R_p - R_f}{\\beta_p}$ measuring excess return per unit of systematic risk), and Jensen's Alpha ($\\alpha_p$).",
    "syllabus": [
      "Core Foundations: Mathematical models and concepts of Portfolio Performance Measurement: Sharpe, Treynor & Jensen Ratios.",
      "Operational Architecture: Valuation formulas, decision rules, and execution flow.",
      "Production Best Practices: Financial risk metrics, statutory compliance, and corporate governance."
    ],
    "eTitle": "Sharpe, Treynor & Jensen Risk-Adjusted Performance Engine",
    "eDesc": "Implement function calculatePerformanceRatios(portfolioReturnPct, riskFreePct, portfolioStdPct, portfolioBeta, marketReturnPct) calculating Sharpe, Treynor, and Jensen ratios.",
    "eStarter": "function calculatePerformanceRatios(rp, rf, stdP, betaP, rm) {\n  const excessReturn = rp - rf;\n  const sharpe = excessReturn / stdP;\n  const treynor = excessReturn / betaP;\n  const jensenAlpha = rp - (rf + betaP * (rm - rf));\n  return {\n    excessReturnPercent: Number(excessReturn.toFixed(2)),\n    sharpeRatio: Number(sharpe.toFixed(2)),\n    treynorRatio: Number(treynor.toFixed(2)),\n    jensenAlphaPercent: Number(jensenAlpha.toFixed(2)),\n    status: 'PORTFOLIO_PERFORMANCE_RATIOS_COMPUTED'\n  };\n}",
    "eHint": "Compute sharpe = (rp - rf)/stdP, treynor = (rp - rf)/betaP, jensen = rp - (rf + beta*(rm-rf)).",
    "eTest": "const res = calculatePerformanceRatios(15, 5, 12, 1.25, 11); // Excess = 10%. Sharpe = 10/12 = 0.83. Treynor = 10/1.25 = 8.0. Jensen = 15 - (5 + 1.25*6) = 15 - 12.5 = 2.5%\nif (res.sharpeRatio !== 0.83 || res.treynorRatio !== 8.0 || res.jensenAlphaPercent !== 2.5 || res.status !== 'PORTFOLIO_PERFORMANCE_RATIOS_COMPUTED') throw new Error('Performance ratios failed');",
    "aTitle": "Sharpe Ratio Denominator Formatter",
    "aDesc": "Implement function getSharpeDenominator() returning `'TOTAL_RISK_STANDARD_DEVIATION'`.",
    "aStarter": "function getSharpeDenominator() {\n  // Write your answer here\n}",
    "aHint": "Return standard deviation.",
    "aTest": "if (getSharpeDenominator() !== 'TOTAL_RISK_STANDARD_DEVIATION') throw new Error('Sharpe check failed');"
  },
  {
    "day": 26,
    "title": "Financial Derivatives: Futures Hedging & Black-Scholes Option Pricing",
    "desc": "Hedge financial exposures: Forward and Futures contracts, Cost of Carry model ($F_0 = S_0 e^{rT}$), Put-Call Parity ($C + PV(K) = P + S$), and Black-Scholes European Call option valuation.",
    "syllabus": [
      "Core Foundations: Mathematical models and concepts of Financial Derivatives: Futures Hedging & Black-Scholes Option Pricing.",
      "Operational Architecture: Valuation formulas, decision rules, and execution flow.",
      "Production Best Practices: Financial risk metrics, statutory compliance, and corporate governance."
    ],
    "eTitle": "Futures Fair Pricing & Put-Call Parity Engine",
    "eDesc": "Implement function evaluateFuturesAndPutCallParity(spotPrice, strikePrice, riskFreePct, timeYears, callPrice) calculating fair futures price and synthetic put option price.",
    "eStarter": "function evaluateFuturesAndPutCallParity(s0, k, rPct, t, call) {\n  const r = rPct / 100;\n  const futuresPrice = s0 * Math.exp(r * t);\n  const pvK = k * Math.exp(-r * t);\n  // Put-Call Parity: C + PV(K) = P + S -> P = C + PV(K) - S\n  const putPrice = call + pvK - s0;\n  return {\n    spotPrice: s0,\n    strikePrice: k,\n    fairFuturesPrice: Number(futuresPrice.toFixed(2)),\n    syntheticPutPrice: Number(putPrice.toFixed(2)),\n    status: 'DERIVATIVES_PARITY_EVALUATED'\n  };\n}",
    "eHint": "Compute futures = s0 * e^(r*t), put = call + k*e^(-r*t) - s0.",
    "eTest": "const res = evaluateFuturesAndPutCallParity(100, 100, 5, 1, 10); // Fut = 100 * e^0.05 = 105.13; PV(K) = 100 * e^-0.05 = 95.12; Put = 10 + 95.12 - 100 = 5.12\nif (res.fairFuturesPrice !== 105.13 || res.syntheticPutPrice !== 5.12 || res.status !== 'DERIVATIVES_PARITY_EVALUATED') throw new Error('Derivatives parity failed');",
    "aTitle": "Put-Call Parity Equation Formatter",
    "aDesc": "Implement function getPutCallParityFormula() returning `'C + PV(K) = P + S'`.",
    "aStarter": "function getPutCallParityFormula() {\n  // Write your answer here\n}",
    "aHint": "Return parity formula.",
    "aTest": "if (getPutCallParityFormula() !== 'C + PV(K) = P + S') throw new Error('Parity formula check failed');"
  },
  {
    "day": 27,
    "title": "Corporate Restructuring: Mergers & Acquisitions (M&A) Accretion/Dilution",
    "desc": "Model corporate takeovers: M&A synergies, Stock-for-Stock vs All-Cash acquisitions, Exchange Ratio, Pro-Forma Combined Earnings per Share (EPS), and Accretion / Dilution analysis.",
    "syllabus": [
      "Core Foundations: Mathematical models and concepts of Corporate Restructuring: Mergers & Acquisitions (M&A) Accretion/Dilution.",
      "Operational Architecture: Valuation formulas, decision rules, and execution flow.",
      "Production Best Practices: Financial risk metrics, statutory compliance, and corporate governance."
    ],
    "eTitle": "M&A Pro-Forma EPS Accretion/Dilution Model",
    "eDesc": "Implement function calculateMergerAccretionDilution(acquirerEarnings, acquirerShares, targetEarnings, newSharesIssued) calculating post-merger pro-forma EPS and accretion/dilution percentage.",
    "eStarter": "function calculateMergerAccretionDilution(eA, sA, eT, sNew) {\n  const preEps = eA / sA;\n  const combinedEarnings = eA + eT;\n  const totalShares = sA + sNew;\n  const postEps = combinedEarnings / totalShares;\n  const epsChangePct = ((postEps - preEps) / preEps) * 100;\n  const isAccretive = postEps > preEps;\n  return {\n    preMergerAcquirerEps: Number(preEps.toFixed(2)),\n    postMergerCombinedEps: Number(postEps.toFixed(2)),\n    epsChangePercent: Number(epsChangePct.toFixed(2)),\n    mergerOutcome: isAccretive ? 'ACCRETIVE_DEAL_INCREASES_EPS' : 'DILUTIVE_DEAL_DECREASES_EPS',\n    status: 'MERGER_ACCRETION_DILUTION_EVALUATED'\n  };\n}",
    "eHint": "Compute preEps = eA/sA, postEps = (eA+eT)/(sA+sNew), check postEps > preEps.",
    "eTest": "const res = calculateMergerAccretionDilution(1000000, 200000, 400000, 50000); // Pre EPS = 5.00. Combined = 1.4M / 250k = 5.60 (+12% Accretive)\nif (res.preMergerAcquirerEps !== 5.0 || res.postMergerCombinedEps !== 5.6 || res.mergerOutcome !== 'ACCRETIVE_DEAL_INCREASES_EPS') throw new Error('M&A accretion failed');",
    "aTitle": "Accretive Deal Definition Formatter",
    "aDesc": "Implement function getAccretiveDefinition() returning `'POST_MERGER_EPS_GREATER_THAN_PRE_MERGER_EPS'`.",
    "aStarter": "function getAccretiveDefinition() {\n  // Write your answer here\n}",
    "aHint": "Return accretive string.",
    "aTest": "if (getAccretiveDefinition() !== 'POST_MERGER_EPS_GREATER_THAN_PRE_MERGER_EPS') throw new Error('Accretive check failed');"
  },
  {
    "day": 28,
    "title": "Corporate Credit Analysis & Altman Z-Score Bankruptcy Prediction",
    "desc": "Predict corporate financial distress: Altman Z-Score model for manufacturing firms ($Z = 1.2 X_1 + 1.4 X_2 + 3.3 X_3 + 0.6 X_4 + 0.999 X_5$), Safe Zone ($Z > 2.99$), Grey Zone ($1.81 \\le Z \\le 2.99$), and Distress / Bankruptcy Zone ($Z < 1.81$).",
    "syllabus": [
      "Core Foundations: Mathematical models and concepts of Corporate Credit Analysis & Altman Z-Score Bankruptcy Prediction.",
      "Operational Architecture: Valuation formulas, decision rules, and execution flow.",
      "Production Best Practices: Financial risk metrics, statutory compliance, and corporate governance."
    ],
    "eTitle": "Altman Z-Score Corporate Distress Predictor",
    "eDesc": "Implement function calculateAltmanZScore(workingCapital, retainedEarnings, ebit, marketCapEquity, sales, totalAssets, totalLiabilities) calculating Altman Z-Score and distress classification.",
    "eStarter": "function calculateAltmanZScore(wc, re, ebit, mCap, sales, assets, liab) {\n  const x1 = wc / assets;            // Working Capital / Total Assets\n  const x2 = re / assets;            // Retained Earnings / Total Assets\n  const x3 = ebit / assets;          // EBIT / Total Assets\n  const x4 = mCap / liab;            // Market Cap / Total Liabilities\n  const x5 = sales / assets;         // Asset Turnover\n  const z = 1.2 * x1 + 1.4 * x2 + 3.3 * x3 + 0.6 * x4 + 0.999 * x5;\n  let zone = 'DISTRESS_ZONE_HIGH_BANKRUPTCY_RISK';\n  if (z > 2.99) zone = 'SAFE_ZONE_FINANCIALLY_SOUND';\n  else if (z >= 1.81) zone = 'GREY_ZONE_MODERATE_RISK';\n  return {\n    altmanZScore: Number(z.toFixed(2)),\n    distressZone: zone,\n    status: 'ALTMAN_Z_SCORE_PREDICTION_COMPLETED'\n  };\n}",
    "eHint": "Compute z = 1.2*x1 + 1.4*x2 + 3.3*x3 + 0.6*x4 + 0.999*x5 and classify.",
    "eTest": "const res = calculateAltmanZScore(200000, 300000, 200000, 800000, 1000000, 1000000, 400000); // x1=0.2, x2=0.3, x3=0.2, x4=2.0, x5=1.0 -> Z = 1.2*0.2 + 1.4*0.3 + 3.3*0.2 + 0.6*2.0 + 0.999*1.0 = 0.24 + 0.42 + 0.66 + 1.20 + 0.999 = 3.52 -> SAFE\nif (res.altmanZScore !== 3.52 || res.distressZone !== 'SAFE_ZONE_FINANCIALLY_SOUND') throw new Error('Altman Z-Score failed');",
    "aTitle": "Altman Safe Zone Threshold Formatter",
    "aDesc": "Implement function getAltmanSafeThreshold() returning `2.99`.",
    "aStarter": "function getAltmanSafeThreshold() {\n  // Write your answer here\n}",
    "aHint": "Return 2.99.",
    "aTest": "if (getAltmanSafeThreshold() !== 2.99) throw new Error('Altman threshold check failed');"
  },
  {
    "day": 29,
    "title": "FinTech, Robo-Advisory & ESG Sustainable Investment Scoring",
    "desc": "Modern investment frameworks: Algorithmic Robo-Advisors (Automated risk profiling & rebalancing), ESG (Environmental, Social, Governance) corporate sustainability scoring, and Green Bonds.",
    "syllabus": [
      "Core Foundations: Mathematical models and concepts of FinTech, Robo-Advisory & ESG Sustainable Investment Scoring.",
      "Operational Architecture: Valuation formulas, decision rules, and execution flow.",
      "Production Best Practices: Financial risk metrics, statutory compliance, and corporate governance."
    ],
    "eTitle": "Robo-Advisory Asset Allocation & ESG Scoring Engine",
    "eDesc": "Implement function generateRoboEsgAllocation(riskScore1to10, esgScore0to100) allocating Equity/Debt percentages and certifying ESG sustainability tier.",
    "eStarter": "function generateRoboEsgAllocation(riskScore, esgScore) {\n  const equityPct = riskScore * 10; // 1 -> 10% equity, 10 -> 100% equity\n  const debtPct = 100 - equityPct;\n  const isEsgLeader = esgScore >= 75;\n  return {\n    investorRiskScore: riskScore,\n    recommendedEquityPercent: equityPct,\n    recommendedDebtPercent: debtPct,\n    esgScore,\n    esgRatingTier: isEsgLeader ? 'ESG_LEADER_SUSTAINABLE_TIER_A' : 'ESG_STANDARD_TIER_B',\n    status: 'ROBO_ADVISORY_ESG_ALLOCATION_GENERATED'\n  };\n}",
    "eHint": "Compute equityPct = riskScore * 10, debtPct = 100 - equityPct, check esgScore >= 75.",
    "eTest": "const res = generateRoboEsgAllocation(7, 85); // 70% equity, 30% debt, ESG Leader Tier A\nif (res.recommendedEquityPercent !== 70 || res.recommendedDebtPercent !== 30 || res.esgRatingTier !== 'ESG_LEADER_SUSTAINABLE_TIER_A') throw new Error('Robo ESG allocation failed');",
    "aTitle": "ESG Three Pillars Formatter",
    "aDesc": "Implement function getEsgPillars() returning `['ENVIRONMENTAL', 'SOCIAL', 'GOVERNANCE']`.",
    "aStarter": "function getEsgPillars() {\n  // Write your answer here\n}",
    "aHint": "Return 3 pillars.",
    "aTest": "if (getEsgPillars().length !== 3) throw new Error('ESG pillars check failed');"
  },
  {
    "day": 30,
    "title": "🏆 FINAL CAPSTONE: Integrated Corporate Finance, Valuation & Portfolio Investment Management Suite",
    "desc": "Final Capstone Synthesis: The complete sovereign corporate finance, valuation, capital budgeting, risk management, and portfolio investment suite: 1. TVM loan & bond valuation engine; 2. Multi-project NPV & WACC hurdle rate capital budgeting; 3. Corporate leverage & capital structure optimization; 4. Equity DCF valuation; 5. Modern Portfolio Theory (MPT) & CAPM risk-adjusted portfolio construction.",
    "syllabus": [
      "Core Foundations: Mathematical models and concepts of 🏆 FINAL CAPSTONE: Integrated Corporate Finance, Valuation & Portfolio Investment Management Suite.",
      "Operational Architecture: Valuation formulas, decision rules, and execution flow.",
      "Production Best Practices: Financial risk metrics, statutory compliance, and corporate governance."
    ],
    "eTitle": "Corporate Finance & Investment Master Orchestrator",
    "eDesc": "Implement function orchestrateCorporateFinance(tvmActive, capitalBudgetingApproved, waccCalculated, valuationFinalized, portfolioOptimized) certifying comprehensive corporate finance and investment audit compliance.",
    "eStarter": "function orchestrateCorporateFinance(tvm, cb, wacc, val, port) {\n  const isCertified = tvm && cb && wacc && val && port;\n  return {\n    tvmValuationEngine: tvm,\n    capitalBudgetingApproved: cb,\n    waccHurdleCalculated: wacc,\n    equityValuationFinalized: val,\n    portfolioInvestmentOptimized: port,\n    corporateFinanceMasterCertified: isCertified,\n    certified: true,\n    status: isCertified ? 'CORPORATE_FINANCE_AND_INVESTMENT_MASTER_CERTIFIED_NOMINAL' : 'FINANCE_AUDIT_DEFECT_DETECTED'\n  };\n}",
    "eHint": "Verify all 5 corporate finance dimensions are true.",
    "eTest": "const ok = orchestrateCorporateFinance(true, true, true, true, true);\nconst fail = orchestrateCorporateFinance(true, true, false, true, true);\nif (!ok.corporateFinanceMasterCertified || fail.corporateFinanceMasterCertified || !ok.certified || ok.status !== 'CORPORATE_FINANCE_AND_INVESTMENT_MASTER_CERTIFIED_NOMINAL') throw new Error('Capstone finance orchestrator failed');",
    "aTitle": "Business Finance Master Certification Auditor",
    "aDesc": "Implement function auditFinanceMasterCert() returning `{ certified: true, score: '100/100', tier: 'ENTERPRISE_CORPORATE_FINANCE_AND_INVESTMENT_MASTER_CERTIFIED' }`.",
    "aStarter": "function auditFinanceMasterCert() {\n  // Write your answer here\n}",
    "aHint": "Return certification object.",
    "aTest": "if (!auditFinanceMasterCert().certified) throw new Error('Capstone cert failed');"
  }
];

export const BCOM_FINANCE_30_DAYS_QUESTS: CourseQuest[] = BCOM_FINANCE_30_DAYS_CONFIGS.flatMap((cfg, idx) => 
  buildEnrichedDayQuests('bcom_fin', idx + 1, cfg)
);
