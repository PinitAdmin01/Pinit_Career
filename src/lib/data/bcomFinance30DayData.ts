import { buildEnrichedDayQuests, DayConfig } from './curriculumEnricher';
import { CourseQuest } from './coursesData';

export const BCOM_FINANCE_30_DAYS_CONFIGS: DayConfig[] = [
  {
    "day": 1,
    "title": "Introduction to Corporate Finance & The Financial Ecosystem",
    "desc": "Understand the core goal of financial management (Shareholder Wealth Maximization), corporate financial decisions (Investment, Financing, Dividend), primary vs secondary capital markets, and Money Market instruments.",
    "syllabus": [
      "Core Corporate Finance Objective: Maximizing long-term equity market capitalization.",
      "The Three Financial Decisions: Capital Budgeting, Capital Structure, and Dividend Policy.",
      "Financial Markets Architecture: Money Markets (< 1 yr: T-Bills, CP, CD) vs Capital Markets (> 1 yr: Equity, Bonds)."
    ],
    "eTitle": "Financial Market Instrument & Maturity Classifier",
    "eDesc": "Implement function `classifyFinancialInstrument(instrumentName, maturityDays)` classifying Money Market vs Capital Market instruments.",
    "eStarter": "function classifyFinancialInstrument(name, maturityDays) {\n  // TODO: If maturityDays <= 365 -> Money Market, else -> Capital Market; return classification object\n  \n}",
    "eHint": "Check if maturityDays <= 365: market = 'MONEY_MARKET', liquidity = 'HIGH_LIQUIDITY'; else market = 'CAPITAL_MARKET', liquidity = 'LONG_TERM_INVESTMENT'; return { instrument: name, market, maturityDays, liquidity }.",
    "eTest": "const tb = classifyFinancialInstrument('91-Day T-Bill', 91);\nif (tb.market !== 'MONEY_MARKET' || tb.liquidity !== 'HIGH_LIQUIDITY') throw new Error('Money market classification failed');\nconst bond = classifyFinancialInstrument('10-Year Govt Bond', 3650);\nif (bond.market !== 'CAPITAL_MARKET' || bond.liquidity !== 'LONG_TERM_INVESTMENT') throw new Error('Capital market classification failed');\nconst edgeYear = classifyFinancialInstrument('1-Year Commercial Paper', 365);\nif (edgeYear.market !== 'MONEY_MARKET') throw new Error('1-year boundary classification failed');",
    "aTitle": "Corporate Treasury Liquidity Splitter",
    "aDesc": "Implement function `calculateTreasuryAllocation(totalCash, operatingReservePct, capitalGrowthPct)` computing liquidity split between short-term commercial paper and long-term bonds.",
    "aStarter": "function calculateTreasuryAllocation(totalCash, operatingReservePct, capitalGrowthPct) {\n  // TODO: Compute operational liquidity and capital growth allocation amounts\n  \n}",
    "aHint": "operatingCash = totalCash * (operatingReservePct / 100); growthCash = totalCash * (capitalGrowthPct / 100); bufferCash = totalCash - operatingCash - growthCash; return { operatingCash, growthCash, bufferCash }.",
    "aTest": "const t = calculateTreasuryAllocation(1000000, 30, 50); // 300k, 500k, 200k\nif (t.operatingCash !== 300000 || t.growthCash !== 500000 || t.bufferCash !== 200000) throw new Error('Treasury allocation failed');"
  },
  {
    "day": 2,
    "title": "Time Value of Money (TVM): Compounding & Future Value ($FV$)",
    "desc": "Master the foundational axiom of finance: A dollar today is worth more than a dollar tomorrow. Compute Future Value ($FV = PV(1 + r)^t$), effective annual rate, and discrete vs continuous compounding.",
    "syllabus": [
      "Future Value Core Equation: $FV = PV(1 + r)^t$ for single cash flows.",
      "Multi-Period Compounding Frequency: Semi-annual, quarterly, monthly, and continuous compounding ($FV = PV \\cdot e^{rt}$).",
      "Effective Annual Rate (EAR): $EAR = (1 + r/m)^m - 1$."
    ],
    "eTitle": "Discrete & Continuous Future Value ($FV$) Engine",
    "eDesc": "Implement function `calculateFutureValue(presentValue, annualRatePct, years, compoundingFrequency)` computing Future Value under discrete or continuous compounding.",
    "eStarter": "function calculateFutureValue(pv, ratePct, years, freq = 1) {\n  // TODO: Apply FV = PV * (1 + r/m)^(m*t) for discrete compounding or PV * e^(r*t) for continuous\n  \n}",
    "eHint": "r = ratePct / 100; if freq === 'CONTINUOUS' fv = pv * Math.exp(r * years); else fv = pv * Math.pow(1 + r / freq, freq * years); return { presentValue: pv, futureValue: Number(fv.toFixed(2)), totalInterest: Number((fv - pv).toFixed(2)) }.",
    "eTest": "const annual = calculateFutureValue(10000, 10, 2, 1); // 10,000 * 1.10^2 = 12,100\nif (annual.futureValue !== 12100 || annual.totalInterest !== 2100) throw new Error('Annual compounding FV failed');\nconst quarterly = calculateFutureValue(10000, 12, 1, 4); // 10,000 * (1 + 0.03)^4 = 11,255.09\nif (quarterly.futureValue !== 11255.09) throw new Error('Quarterly compounding FV failed');\nconst cont = calculateFutureValue(10000, 5, 2, 'CONTINUOUS'); // 10000 * e^(0.10) = 11051.71\nif (cont.futureValue !== 11051.71) throw new Error('Continuous compounding FV failed');",
    "aTitle": "Rule of 72 & Doubling Period Estimator",
    "aDesc": "Implement function `estimateDoublingPeriod(annualRatePct, exact = false)` computing estimated doubling years via Rule of 72 and exact formula $\\ln(2) / \\ln(1 + r)$.",
    "aStarter": "function estimateDoublingPeriod(ratePct, exact = false) {\n  // TODO: Compute Rule of 72 (72/rate) and exact logarithmic doubling period\n  \n}",
    "aHint": "rule72Years = Number((72 / ratePct).toFixed(2)); exactYears = Number((Math.log(2) / Math.log(1 + ratePct / 100)).toFixed(2)); return { doublingYears: exact ? exactYears : rule72Years, rule72Years, exactYears }.",
    "aTest": "const d = estimateDoublingPeriod(8, true); // 72/8 = 9 yrs, exact = 9.01 yrs\nif (d.rule72Years !== 9 || d.exactYears !== 9.01) throw new Error('Doubling period estimation failed');"
  },
  {
    "day": 3,
    "title": "Time Value of Money (TVM): Discounting & Present Value ($PV$)",
    "desc": "Reverse the compounding timeline through Discounting: Present Value ($PV = FV / (1 + r)^t$), opportunity cost of capital, multi-period cash flow discounting, and zero-growth vs growing perpetuities.",
    "syllabus": [
      "Present Value Equation: $PV = FV / (1 + r)^t$ and Discount Factor ($DF = 1/(1+r)^t$).",
      "Multi-Period DCF Discounting: Summing present values of uneven future cash flow series.",
      "Perpetuity Formulas: Regular Perpetuity ($PV = C / r$) vs Gordon Growing Perpetuity ($PV = C / (r - g)$)."
    ],
    "eTitle": "Multi-Period Cash Flow Present Value ($PV$) Discount Engine",
    "eDesc": "Implement function `calculatePresentValue(cashFlows, discountRatePct)` computing the aggregate Present Value of a stream of future cash flows.",
    "eStarter": "function calculatePresentValue(cashFlows, discountRatePct) {\n  // TODO: Discount each cash flow by (1 + r)^t and return total present value\n  \n}",
    "eHint": "r = discountRatePct / 100; totalPv = cashFlows.reduce((sum, cf, idx) => sum + cf / Math.pow(1 + r, idx + 1), 0); return { totalPresentValue: Number(totalPv.toFixed(2)), cashFlowCount: cashFlows.length }.",
    "eTest": "const pv = calculatePresentValue([1000, 1000, 1000], 10); // 1000/1.1 + 1000/1.21 + 1000/1.331 = 909.09 + 826.45 + 751.31 = 2486.85\nif (pv.totalPresentValue !== 2486.85 || pv.cashFlowCount !== 3) throw new Error('3-period PV calculation failed');\nconst single = calculatePresentValue([1210], 10); // 1210/1.1 = 1100\nif (single.totalPresentValue !== 1100) throw new Error('Single period PV failed');\nconst zeroRate = calculatePresentValue([500, 500], 0);\nif (zeroRate.totalPresentValue !== 1000) throw new Error('Zero discount rate PV failed');",
    "aTitle": "Perpetuity & Growing Perpetuity Present Value Calculator",
    "aDesc": "Implement function `calculatePerpetuityValue(annualCashFlow, discountRatePct, growthRatePct)` calculating present value of zero-growth ($C/r$) and growing perpetuity ($C / (r - g)$).",
    "aStarter": "function calculatePerpetuityValue(cashFlow, discountRatePct, growthRatePct = 0) {\n  // TODO: Compute standard perpetuity C/r or Gordon growing perpetuity C / (r - g)\n  \n}",
    "aHint": "r = discountRatePct / 100; g = growthRatePct / 100; if (r <= g) throw new Error('Discount rate must exceed growth rate'); pv = cashFlow / (r - g); return { presentValue: Number(pv.toFixed(2)), isGrowing: growthRatePct > 0 }.",
    "aTest": "const p1 = calculatePerpetuityValue(10000, 10, 0); // 10,000 / 0.10 = 100,000\nif (p1.presentValue !== 100000 || p1.isGrowing) throw new Error('Standard perpetuity failed');\nconst p2 = calculatePerpetuityValue(10000, 10, 2); // 10,000 / (0.10 - 0.02) = 125,000\nif (p2.presentValue !== 125000 || !p2.isGrowing) throw new Error('Growing perpetuity failed');"
  },
  {
    "day": 4,
    "title": "Annuities & Loan Amortization: Ordinary Annuity, Annuity Due & EMI",
    "desc": "Model structured uniform periodic payment streams: Future Value of Ordinary Annuity vs Annuity Due, Loan Amortization Schedules, and Equated Monthly Installment (EMI) calculation.",
    "syllabus": [
      "Ordinary Annuity vs Annuity Due: Cash flow at end of period vs beginning of period ($FV_{Due} = FV_{Ord} \\times (1 + r)$).",
      "Loan Amortization Equation: $EMI = [P \\cdot r \\cdot (1+r)^n] / [(1+r)^n - 1]$.",
      "Principal vs Interest Breakdown: Progressively decreasing interest component over loan tenure."
    ],
    "eTitle": "Equated Monthly Installment (EMI) & Loan Amortization Engine",
    "eDesc": "Implement function `calculateLoanEmi(principal, annualInterestRatePct, tenureMonths)` computing monthly EMI and generating the first period principal/interest breakdown.",
    "eStarter": "function calculateLoanEmi(principal, annualRatePct, tenureMonths) {\n  // TODO: Compute monthly rate r = annualRate/12/100, EMI = [P * r * (1+r)^n] / [(1+r)^n - 1]\n  \n}",
    "eHint": "monthlyRate = annualRatePct / 12 / 100; emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / (Math.pow(1 + monthlyRate, tenureMonths) - 1); month1Interest = principal * monthlyRate; month1Principal = emi - month1Interest; return formatted object.",
    "eTest": "const emiRes = calculateLoanEmi(100000, 12, 12); // P=100k, r=1% per mo, n=12 -> EMI = 8,884.88. Month 1 Int = 1000.00, Prin = 7884.88\nif (emiRes.monthlyEmi !== 8884.88 || emiRes.month1Interest !== 1000.00 || emiRes.month1Principal !== 7884.88) throw new Error('EMI calculation failed');\nconst totalRepay = emiRes.totalAmountRepaid;\nif (totalRepay !== 106618.56) throw new Error('Total repayment calculation failed');\nconst shortLoan = calculateLoanEmi(12000, 0, 12); // 0% interest -> 1000/mo\nif (shortLoan.monthlyEmi !== 1000.00) throw new Error('Zero interest EMI calculation failed');",
    "aTitle": "Future Value of Ordinary Annuity vs Annuity Due Calculator",
    "aDesc": "Implement function `compareAnnuities(periodicPayment, annualRatePct, years, isDue)` computing accumulated future wealth for regular payment annuities vs beginning-of-period annuities.",
    "aStarter": "function compareAnnuities(payment, ratePct, years, isDue = false) {\n  // TODO: Calculate FVA = PMT * [((1+r)^n - 1) / r], multiply by (1+r) if annuity due\n  \n}",
    "aHint": "r = ratePct / 100; fvOrd = payment * ((Math.pow(1 + r, years) - 1) / r); fv = isDue ? fvOrd * (1 + r) : fvOrd; return { futureValue: Number(fv.toFixed(2)), isDue }.",
    "aTest": "const ord = compareAnnuities(10000, 10, 3, false); // 10k * [ (1.331 - 1)/0.10 ] = 33,100\nif (ord.futureValue !== 33100.00) throw new Error('Ordinary annuity FV failed');\nconst due = compareAnnuities(10000, 10, 3, true); // 33,100 * 1.10 = 36,410\nif (due.futureValue !== 36410.00) throw new Error('Annuity due FV failed');"
  },
  {
    "day": 5,
    "title": "⭐ MILESTONE 1: Complete Time Value of Money & Financial Valuation Engine",
    "desc": "Milestone 1: Build an industrial-grade Time Value of Money computation engine: Present value discounting, multi-frequency compounding, annuity scheduling, and automated loan amortization modeling.",
    "syllabus": [
      "TVM Mathematical Engine Synthesis: Unifying PV, FV, EAR, and Annuities.",
      "Comprehensive multi-period capital schedule generator.",
      "Production enterprise valuation test suite validation."
    ],
    "eTitle": "Comprehensive TVM & Multi-Stage Valuation Master Kernel",
    "eDesc": "Implement function `executeTvmMasterKernel(initialInvestment, cashFlows, discountRatePct, emiPrincipal, emiRatePct, emiMonths)` evaluating total DCF present value and debt service obligations.",
    "eStarter": "function executeTvmMasterKernel(c0, cfs, rPct, p, emiRate, n) {\n  // TODO: Synthesize DCF present value calculation, net investment surplus, and monthly debt EMI service\n  \n}",
    "eHint": "r = rPct / 100; pvInflows = cfs.reduce((s, cf, i) => s + cf / Math.pow(1 + r, i + 1), 0); netPresentSurplus = pvInflows - c0; mRate = emiRate / 12 / 100; emi = (p * mRate * Math.pow(1 + mRate, n)) / (Math.pow(1 + mRate, n) - 1); return status report.",
    "eTest": "const res = executeTvmMasterKernel(50000, [30000, 30000], 10, 100000, 12, 12); // PV = 30k/1.1 + 30k/1.21 = 27272.73 + 24793.39 = 52066.12. Surplus = 2066.12. EMI = 8884.88\nif (res.pvInflows !== 52066.12 || res.netPresentSurplus !== 2066.12 || res.monthlyEmi !== 8884.88) throw new Error('Milestone 1 TVM kernel failed');\nif (res.engineStatus !== 'TVM_MASTER_KERNEL_ACTIVE_NOMINAL') throw new Error('Kernel nominal status check failed');\nconst emptyKernel = executeTvmMasterKernel(0, [], 10, 0, 0, 12);\nif (emptyKernel.pvInflows !== 0 || emptyKernel.monthlyEmi !== 0) throw new Error('Zero baseline TVM kernel failed');",
    "aTitle": "Sinking Fund Periodic Provision Calculator",
    "aDesc": "Implement function `calculateSinkingFundPayment(targetFutureAmount, annualRatePct, years)` computing periodic deposit required to accumulate target capital replacement fund.",
    "aStarter": "function calculateSinkingFundPayment(targetAmount, ratePct, years) {\n  // TODO: Compute sinking fund deposit PMT = targetAmount / [((1+r)^n - 1) / r]\n  \n}",
    "aHint": "r = ratePct / 100; pmt = targetAmount / ((Math.pow(1 + r, years) - 1) / r); return { annualPayment: Number(pmt.toFixed(2)), targetAmount, totalInterestEarned: Number((targetAmount - pmt * years).toFixed(2)) }.",
    "aTest": "const sf = calculateSinkingFundPayment(100000, 10, 3); // 100k / 3.31 = 30,211.48\nif (sf.annualPayment !== 30211.48) throw new Error('Sinking fund calculation failed');"
  },
  {
    "day": 6,
    "title": "Bond Valuation: Pricing Fixed Income Securities & Coupon Pricing",
    "desc": "Value fixed-income debt securities: Par Value, Coupon Rate, Market Yield (Discount Rate), Term to Maturity, clean vs dirty price, and bond pricing relationships (Premium, Par, Discount bonds).",
    "syllabus": [
      "Bond Pricing Equation: $P = \\sum_{t=1}^n \\frac{C}{(1+y)^t} + \\frac{M}{(1+y)^n}$.",
      "Coupon vs Yield Relationship: $Coupon > Yield \\implies Premium$; $Coupon < Yield \\implies Discount$; $Coupon = Yield \\implies Par$.",
      "Accrued Interest & Settlement: Clean Price vs Dirty Price (Invoice Price)."
    ],
    "eTitle": "Fixed-Coupon Bond Fair Pricing Engine",
    "eDesc": "Implement function `calculateBondPrice(faceValue, couponRatePct, marketYieldPct, yearsToMaturity, couponsPerYear)` calculating fair value of fixed income security.",
    "eStarter": "function calculateBondPrice(faceValue, couponRatePct, yieldPct, years, freq = 1) {\n  // TODO: Sum discounted coupon annuity and discounted face value principal repayment\n  \n}",
    "eHint": "c = (faceValue * (couponRatePct / 100)) / freq; y = yieldPct / 100 / freq; n = years * freq; pvCoupons = y === 0 ? c * n : c * ((1 - Math.pow(1 + y, -n)) / y); pvFace = faceValue / Math.pow(1 + y, n); price = pvCoupons + pvFace; return status object.",
    "eTest": "const par = calculateBondPrice(1000, 10, 10, 5, 1); // 10% coupon, 10% yield -> Par 1000\nif (par.bondPrice !== 1000.00 || par.pricingType !== 'PAR_BOND') throw new Error('Par bond valuation failed');\nconst prem = calculateBondPrice(1000, 12, 10, 5, 1); // 12% coupon, 10% yield -> Premium 1075.82\nif (prem.bondPrice !== 1075.82 || prem.pricingType !== 'PREMIUM_BOND') throw new Error('Premium bond valuation failed');\nconst disc = calculateBondPrice(1000, 8, 10, 5, 1); // 8% coupon, 10% yield -> Discount 924.18\nif (disc.bondPrice !== 924.18 || disc.pricingType !== 'DISCOUNT_BOND') throw new Error('Discount bond valuation failed');",
    "aTitle": "Zero-Coupon Bond Pricing & Implied Yield Calculator",
    "aDesc": "Implement function `calculateZeroCouponBond(faceValue, marketYieldPct, years)` computing present value of zero-coupon bond and implied discount rate.",
    "aStarter": "function calculateZeroCouponBond(faceValue, yieldPct, years) {\n  // TODO: Compute ZCB price = faceValue / (1 + r)^n\n  \n}",
    "aHint": "r = yieldPct / 100; price = faceValue / Math.pow(1 + r, years); return { zcbPrice: Number(price.toFixed(2)), totalDiscount: Number((faceValue - price).toFixed(2)) }.",
    "aTest": "const z = calculateZeroCouponBond(1000, 10, 3); // 1000 / 1.331 = 751.31\nif (z.zcbPrice !== 751.31 || z.totalDiscount !== 248.69) throw new Error('Zero coupon bond pricing failed');"
  },
  {
    "day": 7,
    "title": "Yield to Maturity (YTM) & Bond Yield Approximation",
    "desc": "Calculate bond rate of return: Current Yield, Capital Gains Yield, and Yield to Maturity (YTM) using both the standard market approximation formula and exact trial-and-error yield interpolation.",
    "syllabus": [
      "Yield Measures: Nominal Coupon Yield vs Current Yield ($C / P$) vs Yield to Maturity.",
      "YTM Approximation Formula: $YTM \\approx \\frac{C + (F - P)/n}{(F + P)/2}$.",
      "Bond Yield Curve: Normal (Upward-sloping), Inverted (Recession signal), and Flat curves."
    ],
    "eTitle": "Bond Yield to Maturity (YTM) Numerical Solver",
    "eDesc": "Implement function `approximateYTM(faceValue, currentPrice, couponRatePct, yearsToMaturity)` computing approximate Yield to Maturity using standard market formula.",
    "eStarter": "function approximateYTM(faceValue, currentPrice, couponRatePct, years) {\n  // TODO: Compute YTM approx = [C + (F - P)/n] / [(F + P)/2]\n  \n}",
    "eHint": "c = faceValue * (couponRatePct / 100); num = c + (faceValue - currentPrice) / years; denom = (faceValue + currentPrice) / 2; ytmPct = Number(((num / denom) * 100).toFixed(2)); return { approximateYtmPercent: ytmPct, currentYieldPercent: Number(((c / currentPrice) * 100).toFixed(2)) }.",
    "eTest": "const ytmRes = approximateYTM(1000, 900, 10, 5); // C=100. (100 + 100/5) / ((1000+900)/2) = 120 / 950 = 12.63%\nif (ytmRes.approximateYtmPercent !== 12.63 || ytmRes.currentYieldPercent !== 11.11) throw new Error('Discount YTM approximation failed');\nconst parYtm = approximateYTM(1000, 1000, 8, 5);\nif (parYtm.approximateYtmPercent !== 8.00) throw new Error('Par YTM approximation failed');\nconst premYtm = approximateYTM(1000, 1100, 10, 5);\nif (premYtm.approximateYtmPercent >= 10.00) throw new Error('Premium YTM should be below coupon rate');",
    "aTitle": "Current Yield & Capital Gains Yield Splitter",
    "aDesc": "Implement function `calculateCurrentAndCapitalYield(annualCoupon, currentPrice, expectedNextPrice)` computing Current Yield and Expected Capital Gains Yield.",
    "aStarter": "function calculateCurrentAndCapitalYield(coupon, currentPrice, expectedPrice) {\n  // TODO: Compute current yield (coupon / price) and capital yield ((expected - current) / current)\n  \n}",
    "aHint": "currentYield = (coupon / currentPrice) * 100; capitalGainYield = ((expectedPrice - currentPrice) / currentPrice) * 100; totalExpectedReturn = currentYield + capitalGainYield; return { currentYield: Number(currentYield.toFixed(2)), capitalGainYield: Number(capitalGainYield.toFixed(2)), totalExpectedReturn: Number(totalExpectedReturn.toFixed(2)) }.",
    "aTest": "const y = calculateCurrentAndCapitalYield(80, 950, 980); // CY = 80/950 = 8.42%, CapG = 30/950 = 3.16%\nif (y.currentYield !== 8.42 || y.capitalGainYield !== 3.16) throw new Error('Yield split failed');"
  },
  {
    "day": 8,
    "title": "Interest Rate Risk: Macaulay Duration & Modified Duration",
    "desc": "Measure bond price volatility and sensitivity to interest rate fluctuations: Macaulay Duration (Weighted average maturity), Modified Duration ($D^* = D / (1 + y)$), and Convexity.",
    "syllabus": [
      "Macaulay Duration: Weighted average time until bond cash flows are received in years.",
      "Modified Duration: Percentage price sensitivity per 1% change in yield: $\\frac{\\Delta P}{P} \\approx -D^* \\times \\Delta y$.",
      "Duration Immunization: Matching portfolio duration to investment liability horizon."
    ],
    "eTitle": "Macaulay & Modified Duration Volatility Engine",
    "eDesc": "Implement function `calculateBondDuration(faceValue, couponRatePct, yieldPct, years)` computing Macaulay Duration in years and Modified Duration volatility percentage.",
    "eStarter": "function calculateBondDuration(faceValue, couponRatePct, yieldPct, years) {\n  // TODO: Calculate weighted average time of cash flows (MacD) and ModD = MacD / (1 + y)\n  \n}",
    "eHint": "Compute PV of each cash flow; sum(t * PV_t) / Price = macDuration; modDuration = macDuration / (1 + yieldPct/100); return { macaulayDurationYears: Number(macDuration.toFixed(2)), modifiedDuration: Number(modDuration.toFixed(2)) }.",
    "eTest": "const dur = calculateBondDuration(1000, 10, 10, 3); // 3-yr 10% par bond -> MacD = 2.74 yrs, ModD = 2.74/1.10 = 2.49\nif (dur.macaulayDurationYears !== 2.74 || dur.modifiedDuration !== 2.49) throw new Error('Bond duration calculation failed');\nconst zcb = calculateBondDuration(1000, 0, 10, 5); // ZCB MacD = 5.00 yrs exactly\nif (zcb.macaulayDurationYears !== 5.00 || zcb.modifiedDuration !== 4.55) throw new Error('Zero coupon duration failed');\nconst oneYr = calculateBondDuration(1000, 5, 5, 1);\nif (oneYr.macaulayDurationYears !== 1.00) throw new Error('1-year bond duration failed');",
    "aTitle": "Bond Price Sensitivity Percentage Estimator",
    "aDesc": "Implement function `estimateBondPriceChange(modifiedDuration, basisPointsChange)` calculating the percentage price movement of a bond for a given shift in interest rates.",
    "aStarter": "function estimateBondPriceChange(modDuration, bpsChange) {\n  // TODO: Compute estimated percentage price change = -modDuration * (bpsChange / 10000) * 100\n  \n}",
    "aHint": "deltaYield = bpsChange / 10000; pctChange = -modDuration * deltaYield * 100; return { percentagePriceChange: Number(pctChange.toFixed(3)), isPriceIncrease: pctChange > 0 }.",
    "aTest": "const sens = estimateBondPriceChange(5.0, 100); // 100 bps = +1.0% yield -> Price change = -5.0 * 0.01 * 100 = -5.0%\nif (sens.percentagePriceChange !== -5.0 || sens.isPriceIncrease) throw new Error('Price sensitivity estimation failed');"
  },
  {
    "day": 9,
    "title": "Capital Budgeting: Net Present Value (NPV) Decision Rule",
    "desc": "Evaluate major long-term capital investments: Net Present Value ($NPV = \\sum \\frac{CF_t}{(1+k)^t} - C_0$), the Gold Standard of investment appraisal, and handling uneven multi-year cash flow projections.",
    "syllabus": [
      "The NPV Criterion: Accept projects where $NPV > 0$; Reject where $NPV < 0$.",
      "DCF Free Cash Flow Modeling: Accounting for initial capital outlay, operating cash flows, and terminal salvage value.",
      "NPV Superiority: Shareholder wealth additivity property over accounting metrics."
    ],
    "eTitle": "Net Present Value (NPV) & Project Viability Analyzer",
    "eDesc": "Implement function `calculateNPV(initialOutlay, cashInflows, costOfCapitalPct)` calculating project NPV, Profitability Index, and ACCEPT/REJECT recommendation.",
    "eStarter": "function calculateNPV(initialOutlay, cashInflows, costOfCapitalPct) {\n  // TODO: Sum discounted cash inflows, subtract initial outlay, and return NPV and decision\n  \n}",
    "eHint": "k = costOfCapitalPct / 100; pvInflows = cashInflows.reduce((s, cf, t) => s + cf / Math.pow(1 + k, t + 1), 0); npv = pvInflows - initialOutlay; isViable = npv > 0; return { npv: Number(npv.toFixed(2)), decision: isViable ? 'ACCEPT_PROJECT_WEALTH_MAXIMIZING' : 'REJECT_PROJECT_WEALTH_DESTRUCTION' }.",
    "eTest": "const proj = calculateNPV(100000, [40000, 50000, 60000], 10); // PV = 36363.64 + 41322.31 + 45078.89 = 122,764.84. NPV = +22,764.84\nif (proj.npv !== 22764.84 || proj.decision !== 'ACCEPT_PROJECT_WEALTH_MAXIMIZING') throw new Error('Acceptable NPV failed');\nconst badProj = calculateNPV(150000, [40000, 40000], 10);\nif (badProj.npv >= 0 || badProj.decision !== 'REJECT_PROJECT_WEALTH_DESTRUCTION') throw new Error('Rejectable NPV failed');\nconst breakEvenProj = calculateNPV(1000, [1100], 10);\nif (breakEvenProj.npv !== 0.00) throw new Error('Zero NPV break-even check failed');",
    "aTitle": "Mutually Exclusive Project NPV Selector",
    "aDesc": "Implement function `selectOptimalProject(projectA, projectB, costOfCapitalPct)` comparing NPV of two mutually exclusive capital expenditure investments.",
    "aStarter": "function selectOptimalProject(projA, projB, costOfCapital) {\n  // TODO: Compute NPV for both projects and select the project with highest positive NPV\n  \n}",
    "aHint": "Compute npvA and npvB using DCF; return { optimalProject: npvA >= npvB ? 'PROJECT_A' : 'PROJECT_B', npvA, npvB, deltaNpv: Math.abs(npvA - npvB) }.",
    "aTest": "const sel = selectOptimalProject({ outlay: 50000, inflows: [35000, 35000] }, { outlay: 50000, inflows: [25000, 45000] }, 10);\nif (sel.optimalProject !== 'PROJECT_A') throw new Error('Mutually exclusive project selection failed');"
  },
  {
    "day": 10,
    "title": "Capital Budgeting: Internal Rate of Return (IRR) & Hurdle Rate Benchmark",
    "desc": "Compute the project break-even discount rate: Internal Rate of Return (IRR where $NPV = 0$), comparing IRR against Cost of Capital (Hurdle Rate), and handling unconventional cash flows.",
    "syllabus": [
      "IRR Equation: $0 = \\sum_{t=1}^n \\frac{CF_t}{(1+IRR)^t} - C_0$.",
      "Decision Rule: Accept if $IRR \\ge Hurdle\\ Rate$; Reject if $IRR < Hurdle\\ Rate$.",
      "Multiple IRRs & Reinvestment Rate Flaw: Why Modified IRR (MIRR) is required for non-conventional cash flows."
    ],
    "eTitle": "Internal Rate of Return (IRR) Bisection Engine",
    "eDesc": "Implement function `calculateIRR(initialOutlay, cashInflows, hurdleRatePct)` finding the exact discount rate where $NPV = 0$ using iterative numerical bisection.",
    "eStarter": "function calculateIRR(initialOutlay, cashInflows, hurdleRatePct) {\n  // TODO: Use bisection method between rate 0% and 100% to locate rate where NPV is zero\n  \n}",
    "eHint": "Implement bisection between low=0.0 and high=2.0. In loop, mid = (low+high)/2, compute npv(mid). If npv > 0 low = mid, else high = mid. Return { irrPercent: Number((mid * 100).toFixed(2)), isViable: irrPercent >= hurdleRatePct }.",
    "eTest": "const res = calculateIRR(10000, [6000, 6000], 10); // 10k outlay, 6k, 6k -> IRR is ~13.07%\nif (res.irrPercent < 13.00 || res.irrPercent > 13.20 || !res.isViable) throw new Error('IRR bisection solve failed');\nconst failRes = calculateIRR(10000, [5000, 5000], 10); // 10k outlay, 5k, 5k -> IRR = 0%\nif (res.irrPercent < 0 || failRes.isViable) throw new Error('Failing hurdle IRR check failed');\nconst highIrr = calculateIRR(1000, [2000], 15); // Double in 1 yr -> IRR = 100%\nif (highIrr.irrPercent !== 100.00) throw new Error('Single period 100% IRR solve failed');",
    "aTitle": "Modified Internal Rate of Return (MIRR) Calculator",
    "aDesc": "Implement function `calculateMIRR(initialOutlay, cashInflows, financingRatePct, reinvestmentRatePct)` resolving multiple IRR anomalies using terminal value reinvestment rate.",
    "aStarter": "function calculateMIRR(initialOutlay, cashInflows, finRate, reinvRate) {\n  // TODO: Compound cash inflows at reinvestment rate to terminal year, then compute MIRR = (TV/Outlay)^(1/n) - 1\n  \n}",
    "aHint": "n = cashInflows.length; r = reinvRate / 100; terminalValue = cashInflows.reduce((sum, cf, idx) => sum + cf * Math.pow(1 + r, n - 1 - idx), 0); mirr = Math.pow(terminalValue / initialOutlay, 1 / n) - 1; return { mirrPercent: Number((mirr * 100).toFixed(2)) }.",
    "aTest": "const m = calculateMIRR(10000, [6000, 6000], 10, 10); // TV = 6000*1.10 + 6000 = 12600. MIRR = sqrt(1.26) - 1 = 12.25%\nif (m.mirrPercent !== 12.25) throw new Error('MIRR calculation failed');"
  },
  {
    "day": 11,
    "title": "Capital Budgeting: Payback Period & Profitability Index (PI)",
    "desc": "Apply secondary investment criteria: Simple Payback Period (Cash liquidity recovery horizon), Discounted Payback Period (Time-value adjusted), and Profitability Index ($PI = PV(Inflows) / Outlay$) under capital rationing constraints.",
    "syllabus": [
      "Payback Period: Number of years to recoup original investment outlay.",
      "Discounted Payback Period: Incorporating TVM to find real economic breakeven.",
      "Profitability Index (Benefit-Cost Ratio): Ranking projects under limited capital budgets."
    ],
    "eTitle": "Payback Period (Simple vs Discounted) Engine",
    "eDesc": "Implement function `calculatePaybackPeriod(initialOutlay, cashFlows, discountRatePct)` computing simple Payback Period in years and Discounted Payback Period.",
    "eStarter": "function calculatePaybackPeriod(initialOutlay, cashFlows, discountRatePct = 0) {\n  // TODO: Track cumulative cash inflows (undiscounted and discounted) to find recovery point\n  \n}",
    "eHint": "Accumulate undiscounted inflows to find integer years + fraction needed. Accumulate discounted inflows (using discountRatePct) to find discounted payback period. Return both metrics.",
    "eTest": "const pb = calculatePaybackPeriod(100000, [50000, 50000, 50000], 10); // Simple: exactly 2.0 yrs\nif (pb.simplePaybackYears !== 2.00) throw new Error('Simple payback period failed');\nif (pb.discountedPaybackYears <= 2.00) throw new Error('Discounted payback must be longer than simple payback');\nconst unrecovered = calculatePaybackPeriod(200000, [50000, 50000], 10);\nif (unrecovered.isRecovered !== false) throw new Error('Unrecovered outlay check failed');",
    "aTitle": "Profitability Index Capital Rationing Ranker",
    "aDesc": "Implement function `rankProjectsByProfitabilityIndex(projectsList, budgetLimit)` ranking capital investment projects by $PI = PV(Inflows) / InitialOutlay$ under capital rationing.",
    "aStarter": "function rankProjectsByProfitabilityIndex(projects, budget) {\n  // TODO: Compute PI for each project, sort by PI descending, and select projects within budget limit\n  \n}",
    "aHint": "Compute PI = pvInflows / outlay for each project; sort descending; accumulate outlays until budgetLimit; return { selectedProjects, totalNpvCreated }.",
    "aTest": "const projs = [{ id: 'A', outlay: 50000, pvInflows: 75000 }, { id: 'B', outlay: 50000, pvInflows: 60000 }]; // PI_A = 1.5, PI_B = 1.2\nconst res = rankProjectsByProfitabilityIndex(projs, 60000);\nif (res.selectedProjects.length !== 1 || res.selectedProjects[0].id !== 'A') throw new Error('Capital rationing PI ranking failed');"
  },
  {
    "day": 12,
    "title": "Cost of Capital: Cost of Debt ($K_d$) & Tax Shield",
    "desc": "Determine corporate cost of debt financing: Pre-Tax Cost of Debt ($K_d$), Corporate Tax Shield ($T$), Effective After-Tax Cost of Debt ($K_{d,after} = K_{d,pre} \\times (1 - T)$), and flotation cost impact.",
    "syllabus": [
      "Pre-tax vs After-tax Debt Cost: Interest expense is tax-deductible under income tax laws.",
      "The Corporate Tax Shield: Shield Value = Debt \\times Interest \\times Tax Rate.",
      "Flotation Costs: Underwriting and legal fees reducing net bond issue proceeds."
    ],
    "eTitle": "After-Tax Cost of Debt ($K_d$) Valuation Engine",
    "eDesc": "Implement function `calculateCostOfDebt(interestRatePct, marginalTaxRatePct, flotationCostPct)` computing pre-tax and effective after-tax Cost of Debt accounting for corporate tax shields.",
    "eStarter": "function calculateCostOfDebt(interestPct, taxPct, flotationPct = 0) {\n  // TODO: Compute effective after-tax Kd = [interestPct * (1 - taxPct/100)] / (1 - flotationPct/100)\n  \n}",
    "eHint": "t = taxPct / 100; f = flotationPct / 100; preKd = interestPct / (1 - f); afterKd = (interestPct * (1 - t)) / (1 - f); return { preTaxKd: Number(preKd.toFixed(2)), afterTaxKd: Number(afterKd.toFixed(2)), annualTaxSavingsPct: Number((preKd - afterKd).toFixed(2)) }.",
    "eTest": "const kd = calculateCostOfDebt(10, 25, 0); // 10% debt, 25% tax -> After-tax Kd = 7.50%\nif (kd.afterTaxKd !== 7.50 || kd.preTaxKd !== 10.00) throw new Error('Standard after-tax Kd failed');\nconst floatKd = calculateCostOfDebt(10, 25, 5); // 5% flotation -> 7.50 / 0.95 = 7.89%\nif (floatKd.afterTaxKd !== 7.89) throw new Error('Flotation adjusted Kd failed');\nconst zeroTax = calculateCostOfDebt(8, 0, 0);\nif (zeroTax.afterTaxKd !== 8.00) throw new Error('Zero tax shield Kd failed');",
    "aTitle": "Corporate Interest Tax Shield Value Calculator",
    "aDesc": "Implement function `calculateTaxShieldValue(totalDebt, couponRatePct, corporateTaxPct)` computing annual interest tax shield cash savings and perpetual capitalized value.",
    "aStarter": "function calculateTaxShieldValue(debt, couponPct, taxPct) {\n  // TODO: Compute annual tax shield = debt * (couponPct/100) * (taxPct/100) and perpetual value = debt * (taxPct/100)\n  \n}",
    "aHint": "annualSavings = debt * (couponPct / 100) * (taxPct / 100); capitalizedValue = debt * (taxPct / 100); return { annualTaxSavings: annualSavings, capitalizedTaxShieldValue: capitalizedValue }.",
    "aTest": "const ts = calculateTaxShieldValue(1000000, 10, 25); // 1M * 10% * 25% = 25k/yr. Cap value = 1M * 25% = 250k\nif (ts.annualTaxSavings !== 25000 || ts.capitalizedTaxShieldValue !== 250000) throw new Error('Tax shield calculation failed');"
  },
  {
    "day": 13,
    "title": "Cost of Capital: Cost of Equity ($K_e$) via CAPM & Dividend Growth",
    "desc": "Calculate the expected return demanded by equity shareholders: Capital Asset Pricing Model ($K_e = R_f + \\beta(R_m - R_f)$), Gordon Constant Growth Dividend Model ($K_e = D_1/P_0 + g$), and Bond Yield Plus Risk Premium approach.",
    "syllabus": [
      "CAPM Equity Valuation: Risk-free rate ($R_f$), Systematic Risk Beta ($\\beta$), and Market Risk Premium ($R_m - R_f$).",
      "Dividend Discount Growth Model: Current dividend yield plus sustainable growth rate ($g = b \\times ROE$).",
      "Cost of Retained Earnings ($K_r$) vs Cost of New Equity ($K_e$) with issue underpricing."
    ],
    "eTitle": "Cost of Equity ($K_e$) Dual-Model Evaluator",
    "eDesc": "Implement function `calculateCostOfEquity(riskFreeRate, beta, marketRiskPremium, dividendD1, currentPrice, growthRatePct)` comparing CAPM $K_e = R_f + \\beta(R_m - R_f)$ and Gordon Growth Model $K_e = (D_1 / P_0) + g$.",
    "eStarter": "function calculateCostOfEquity(rf, beta, mrp, d1, p0, gPct) {\n  // TODO: Compute capmKe = rf + beta * mrp and gordonKe = (d1 / p0) * 100 + gPct\n  \n}",
    "eHint": "capmKe = rf + beta * mrp; gordonKe = (d1 / p0) * 100 + gPct; return { capmCostOfEquity: Number(capmKe.toFixed(2)), gordonCostOfEquity: Number(gordonKe.toFixed(2)), averageKe: Number(((capmKe + gordonKe) / 2).toFixed(2)) }.",
    "eTest": "const ke = calculateCostOfEquity(5, 1.2, 6, 4, 80, 5); // CAPM = 5 + 1.2*6 = 12.2%. Gordon = (4/80)*100 + 5 = 5 + 5 = 10.0%\nif (ke.capmCostOfEquity !== 12.20 || ke.gordonCostOfEquity !== 10.00 || ke.averageKe !== 11.10) throw new Error('Dual-model Ke calculation failed');\nconst marketBeta = calculateCostOfEquity(4, 1.0, 7, 5, 100, 6); // CAPM = 4 + 1.0*7 = 11.0%\nif (marketBeta.capmCostOfEquity !== 11.00) throw new Error('Unit beta CAPM calculation failed');\nconst zeroGrowth = calculateCostOfEquity(5, 1.0, 5, 10, 100, 0);\nif (zeroGrowth.gordonCostOfEquity !== 10.00) throw new Error('Zero growth dividend Ke failed');",
    "aTitle": "Preference Share Cost of Capital ($K_p$) Calculator",
    "aDesc": "Implement function `calculateCostOfPreferenceShares(preferenceDividend, marketPrice, flotationCostPct)` computing effective cost of redeemable or irredeemable preference capital.",
    "aStarter": "function calculateCostOfPreferenceShares(prefDiv, price, flotationPct = 0) {\n  // TODO: Compute Kp = prefDiv / [price * (1 - flotationPct/100)] * 100\n  \n}",
    "aHint": "netProceeds = price * (1 - flotationPct / 100); kp = (prefDiv / netProceeds) * 100; return { costOfPreferencePercent: Number(kp.toFixed(2)), netProceeds }.",
    "aTest": "const kp = calculateCostOfPreferenceShares(10, 100, 2); // 10 / 98 = 10.20%\nif (kp.costOfPreferencePercent !== 10.20 || kp.netProceeds !== 98) throw new Error('Preference share cost failed');"
  },
  {
    "day": 14,
    "title": "Weighted Average Cost of Capital (WACC) & Blended Financing Cost",
    "desc": "Consolidate the enterprise hurdle rate: Weighted Average Cost of Capital ($WACC = w_e K_e + w_d K_d(1-T) + w_p K_p$), Book Value vs Market Value weighting schemes, and marginal cost of capital (MCC) schedules.",
    "syllabus": [
      "WACC Formulation: Blending Equity, Debt, and Preference Capital by relative market value weights.",
      "Market Value vs Book Value Weights: Why market values reflect true current opportunity costs.",
      "WACC as Project Hurdle Rate: Requirements for applying corporate WACC to new division projects."
    ],
    "eTitle": "Enterprise Weighted Average Cost of Capital (WACC) Engine",
    "eDesc": "Implement function `calculateWACC(marketValueOfEquity, marketValueOfDebt, costOfEquityPct, preTaxCostOfDebtPct, corporateTaxPct)` computing overall corporate hurdle rate.",
    "eStarter": "function calculateWACC(e, d, kePct, kdPrePct, tPct) {\n  // TODO: Compute capital weights We = E/(E+D), Wd = D/(E+D), after-tax Kd = kdPre * (1 - t), and WACC = We*Ke + Wd*Kd\n  \n}",
    "eHint": "totalV = e + d; we = e / totalV; wd = d / totalV; kdAfter = kdPrePct * (1 - tPct / 100); wacc = we * kePct + wd * kdAfter; return { waccPercent: Number(wacc.toFixed(2)), equityWeight: Number(we.toFixed(4)), debtWeight: Number(wd.toFixed(4)), afterTaxCostOfDebt: Number(kdAfter.toFixed(2)) }.",
    "eTest": "const waccRes = calculateWACC(600000, 400000, 15, 10, 25); // V=1M, We=0.6, Wd=0.4. KdAfter = 7.5%. WACC = 0.6*15 + 0.4*7.5 = 9.0 + 3.0 = 12.0%\nif (waccRes.waccPercent !== 12.00 || waccRes.equityWeight !== 0.6000 || waccRes.debtWeight !== 0.4000) throw new Error('Standard WACC calculation failed');\nconst pureEquity = calculateWACC(1000000, 0, 12, 8, 25);\nif (pureEquity.waccPercent !== 12.00) throw new Error('Unlevered pure equity WACC failed');\nconst heavyDebt = calculateWACC(200000, 800000, 18, 10, 30); // We=0.2*18=3.6, Wd=0.8*7=5.6 -> WACC=9.2%\nif (heavyDebt.waccPercent !== 9.20) throw new Error('Levered WACC calculation failed');",
    "aTitle": "Target Capital Structure WACC Optimizer",
    "aDesc": "Implement function `evaluateWaccUnderLeverage(equityCostSchedule, debtCostSchedule, taxPct)` determining the optimal capital structure mix minimizing overall WACC.",
    "aStarter": "function evaluateWaccUnderLeverage(equitySchedule, debtSchedule, taxPct) {\n  // TODO: Iterate leverage ratios (0% to 80% debt), compute WACC for each tier, and find the minimum\n  \n}",
    "aHint": "For each debt ratio: compute wd = ratio, we = 1 - wd, kdAfter = debtSchedule[ratio] * (1 - taxPct/100), wacc = we * equitySchedule[ratio] + wd * kdAfter; track and return minimum wacc structure.",
    "aTest": "const eq = { '0.2': 12, '0.4': 14, '0.6': 18 };\nconst db = { '0.2': 8, '0.4': 9, '0.6': 12 };\nconst opt = evaluateWaccUnderLeverage(eq, db, 25);\nif (!opt.optimalDebtRatio || typeof opt.minimumWacc !== 'number') throw new Error('WACC leverage optimizer failed');"
  },
  {
    "day": 15,
    "title": "⭐ MILESTONE 2: Complete Capital Budgeting & Cost of Capital Valuation Engine",
    "desc": "Milestone 2: Construct an institutional capital budgeting appraisal suite: Computing enterprise WACC hurdle rates, discounting multi-year cash flow projections, resolving NPV/IRR conflicts, and determining capital allocation.",
    "syllabus": [
      "Capital Budgeting & WACC synthesis.",
      "Multi-project ranking and capital rationing matrix.",
      "Comprehensive corporate investment proposal audit."
    ],
    "eTitle": "Complete Capital Budgeting & WACC Hurdle Valuation Master",
    "eDesc": "Implement function `executeCapitalBudgetingMaster(initialOutlay, cashFlows, equityVal, debtVal, kePct, kdPrePct, taxPct)` computing enterprise WACC and project NPV.",
    "eStarter": "function executeCapitalBudgetingMaster(c0, cfs, e, d, kePct, kdPrePct, tPct) {\n  // TODO: Calculate enterprise WACC, discount project cash flows, compute NPV and profitability index\n  \n}",
    "eHint": "wacc = (e/(e+d))*kePct + (d/(e+d))*(kdPrePct * (1 - tPct/100)); pv = cfs.reduce((s, cf, t) => s + cf / Math.pow(1 + wacc/100, t + 1), 0); npv = pv - c0; pi = pv / c0; return { calculatedWaccPercent: Number(wacc.toFixed(2)), projectNpv: Number(npv.toFixed(2)), profitabilityIndex: Number(pi.toFixed(2)), isAccepted: npv > 0, engineStatus: 'CAPITAL_BUDGETING_WACC_MASTER_ACTIVE' }.",
    "eTest": "const res = executeCapitalBudgetingMaster(100000, [60000, 60000], 600000, 400000, 15, 10, 25); // WACC = 12%, PV = 60k/1.12 + 60k/1.2544 = 53571.43 + 47831.63 = 101,403.06. NPV = +1,403.06\nif (res.calculatedWaccPercent !== 12.00 || res.projectNpv !== 1403.06 || !res.isAccepted) throw new Error('Milestone 2 capital budgeting master failed');\nif (res.engineStatus !== 'CAPITAL_BUDGETING_WACC_MASTER_ACTIVE') throw new Error('Status flag check failed');\nconst badProj = executeCapitalBudgetingMaster(150000, [50000], 500000, 500000, 10, 8, 20);\nif (badProj.isAccepted) throw new Error('Loss making proposal accepted in error');",
    "aTitle": "Capital Investment Replacement Decision Engine",
    "aDesc": "Implement function `evaluateAssetReplacement(oldAssetSalvage, oldAssetOpCost, newAssetCost, newAssetOpCost, lifeYears, waccPct)` computing Equivalent Annual Cost (EAC) to evaluate equipment modernization.",
    "aStarter": "function evaluateAssetReplacement(oldSalvage, oldOpCost, newCost, newOpCost, life, wacc) {\n  // TODO: Compute Net Cost of new asset, annualized cost savings, and NPV of asset modernization\n  \n}",
    "aHint": "netInitialCost = newCost - oldSalvage; annualSavings = oldOpCost - newOpCost; r = wacc / 100; pvSavings = annualSavings * ((1 - Math.pow(1 + r, -life)) / r); npvModernization = pvSavings - netInitialCost; return { netInitialCost, npvModernization, shouldReplace: npvModernization > 0 }.",
    "aTest": "const rep = evaluateAssetReplacement(10000, 50000, 80000, 20000, 5, 10); // NetOutlay = 70k, Savings = 30k/yr for 5 yrs @ 10% (PVIFA = 3.7908) -> PV = 113,724. NPV = +43,724\nif (rep.netInitialCost !== 70000 || !rep.shouldReplace) throw new Error('Asset replacement evaluation failed');"
  },
  {
    "day": 16,
    "title": "Operating, Financial & Combined Leverage: DOL, DFL & DCL",
    "desc": "Quantify corporate business and financial risk: Degree of Operating Leverage ($DOL = Contribution / EBIT$), Degree of Financial Leverage ($DFL = EBIT / EBT$), and Degree of Combined Leverage ($DCL = DOL \\times DFL$).",
    "syllabus": [
      "Operating Leverage: Fixed operating cost multiplier magnifying sales volatility into EBIT swings.",
      "Financial Leverage: Fixed interest debt obligations magnifying EBIT volatility into EPS swings.",
      "Combined Leverage: Total risk exposure of the firm ($DCL = \\%\\Delta EPS / \\%\\Delta Sales$)."
    ],
    "eTitle": "Operating, Financial & Total Combined Leverage Engine",
    "eDesc": "Implement function `calculateLeverages(salesRevenue, variableCost, fixedCost, interestExpense)` computing Degree of Operating Leverage (DOL), Degree of Financial Leverage (DFL), and Degree of Combined Leverage (DCL).",
    "eStarter": "function calculateLeverages(sales, vc, fc, interest) {\n  // TODO: Compute Contribution = Sales - VC, EBIT = Contrib - FC, EBT = EBIT - Interest, DOL = Contrib/EBIT, DFL = EBIT/EBT, DCL = DOL*DFL\n  \n}",
    "eHint": "contribution = sales - vc; ebit = contribution - fc; ebt = ebit - interest; dol = contribution / ebit; dfl = ebit / ebt; dcl = dol * dfl; return { contribution, ebit, ebt, dol: Number(dol.toFixed(2)), dfl: Number(dfl.toFixed(2)), dcl: Number(dcl.toFixed(2)) }.",
    "eTest": "const lev = calculateLeverages(500000, 200000, 100000, 50000); // Contrib = 300k, EBIT = 200k, EBT = 150k -> DOL = 1.50, DFL = 1.33, DCL = 2.00\nif (lev.dol !== 1.50 || lev.dfl !== 1.33 || lev.dcl !== 2.00) throw new Error('Leverage metrics calculation failed');\nconst noDebt = calculateLeverages(100000, 40000, 20000, 0); // Contrib = 60k, EBIT = 40k, EBT = 40k -> DFL = 1.00\nif (noDebt.dfl !== 1.00 || noDebt.dcl !== 1.50) throw new Error('Zero debt financial leverage failed');\nconst highFixed = calculateLeverages(100000, 20000, 60000, 10000); // Contrib = 80k, EBIT = 20k -> DOL = 4.00\nif (highFixed.dol !== 4.00) throw new Error('High fixed cost DOL failed');",
    "aTitle": "EBIT-EPS Indifference Point Financial Plan Evaluator",
    "aDesc": "Implement function `calculateEbitEpsIndifference(sharesPlanA, debtPlanA, sharesPlanB, debtPlanB, interestRatePct, taxPct)` finding the EBIT level where two financing plans yield identical Earnings Per Share.",
    "aStarter": "function calculateEbitEpsIndifference(sA, dA, sB, dB, intRatePct, taxPct) {\n  // TODO: Solve for EBIT in [(EBIT - IntA) * (1 - t)] / sA = [(EBIT - IntB) * (1 - t)] / sB\n  \n}",
    "aHint": "intA = dA * (intRatePct / 100); intB = dB * (intRatePct / 100); ebitIndiff = (sA * intB - sB * intA) / (sA - sB); return { ebitIndifferencePoint: Number(ebitIndiff.toFixed(2)) }.",
    "aTest": "const indiff = calculateEbitEpsIndifference(100000, 0, 50000, 500000, 10, 25); // IntA = 0, IntB = 50k -> EBIT = (100k*50k - 0)/(100k - 50k) = 100,000\nif (indiff.ebitIndifferencePoint !== 100000.00) throw new Error('EBIT-EPS indifference point solve failed');"
  },
  {
    "day": 17,
    "title": "Break-Even Analysis & Margin of Safety",
    "desc": "Determine cost-volume-profit relationships: Profit-Volume ($P/V$) Ratio, Break-Even Point in physical units and monetary value ($BEP = Fixed\\ Costs / (P - V)$), and Margin of Safety ($MOS = Actual\\ Sales - BEP$).",
    "syllabus": [
      "Contribution Margin Concept: $Unit\\ Contribution = Selling\\ Price - Variable\\ Cost$.",
      "Break-Even Point: Sales volume at which Total Revenue exactly equals Total Costs (Zero Profit/Loss).",
      "Margin of Safety (MOS): Buffer zone before company enters unprofitable operational territory."
    ],
    "eTitle": "Break-Even Point (Units & Value) and Margin of Safety Engine",
    "eDesc": "Implement function `calculateBreakEvenAndMos(fixedCosts, sellingPricePerUnit, variableCostPerUnit, actualSalesUnits)` calculating Break-Even Units, Break-Even Revenue, P/V Ratio, and Margin of Safety (MOS).",
    "eStarter": "function calculateBreakEvenAndMos(fc, p, v, actualUnits) {\n  // TODO: unitContrib = p - v, bepUnits = fc / unitContrib, bepRev = bepUnits * p, mosRev = (actualUnits - bepUnits) * p\n  \n}",
    "eHint": "unitContrib = p - v; pvRatio = (unitContrib / p) * 100; bepUnits = fc / unitContrib; bepRevenue = bepUnits * p; actualRevenue = actualUnits * p; mosRevenue = actualRevenue - bepRevenue; mosPercent = (mosRevenue / actualRevenue) * 100; return formatted metrics.",
    "eTest": "const bep = calculateBreakEvenAndMos(100000, 50, 30, 8000); // Contrib = 20, BEP = 5,000 units ($250k). Actual = 8,000 units ($400k). MOS = $150k (37.5%)\nif (bep.bepUnits !== 5000 || bep.bepRevenue !== 250000 || bep.mosRevenue !== 150000 || bep.mosPercent !== 37.50) throw new Error('BEP and MOS calculation failed');\nconst exactBep = calculateBreakEvenAndMos(50000, 100, 50, 1000);\nif (exactBep.bepUnits !== 1000 || exactBep.mosRevenue !== 0) throw new Error('Exact break-even point zero MOS failed');\nconst highMargin = calculateBreakEvenAndMos(20000, 100, 20, 1000);\nif (highMargin.bepUnits !== 250) throw new Error('High margin BEP failed');",
    "aTitle": "Target Profit Required Sales Volume Calculator",
    "aDesc": "Implement function `calculateRequiredSalesForTargetProfit(fixedCosts, unitPrice, unitVarCost, targetProfit, taxRatePct)` computing units required to achieve desired pre-tax or post-tax profit.",
    "aStarter": "function calculateRequiredSalesForTargetProfit(fc, p, v, profit, taxPct = 0) {\n  // TODO: preTaxProfit = taxPct > 0 ? profit / (1 - taxPct/100) : profit; reqUnits = (fc + preTaxProfit) / (p - v)\n  \n}",
    "aHint": "preTax = taxPct > 0 ? profit / (1 - taxPct / 100) : profit; reqUnits = Math.ceil((fc + preTax) / (p - v)); return { requiredUnits: reqUnits, requiredRevenue: reqUnits * p }.",
    "aTest": "const tp = calculateRequiredSalesForTargetProfit(50000, 20, 10, 20000, 0); // (50k + 20k) / 10 = 7,000 units\nif (tp.requiredUnits !== 7000 || tp.requiredRevenue !== 140000) throw new Error('Target profit required sales volume failed');"
  },
  {
    "day": 18,
    "title": "Working Capital Management & Quarterly Cash Budgeting",
    "desc": "Manage short-term operating liquidity: The Cash Conversion Cycle ($CCC = DIO + DSO - DPO$), Gross vs Net Working Capital, and preparing dynamic rolling Cash Budgets with overdraft triggers.",
    "syllabus": [
      "Cash Conversion Cycle (CCC): Days Inventory Outstanding + Days Sales Outstanding - Days Payable Outstanding.",
      "Working Capital Policies: Aggressive (High short-term debt), Conservative (High liquidity buffer), and Matching (Hedging).",
      "Cash Budgeting: Forecasting monthly receipts and disbursements to prevent liquidity crunches."
    ],
    "eTitle": "Quarterly Cash Budget & Short-Term Overdraft Engine",
    "eDesc": "Implement function `generateCashBudget(openingCash, cashReceiptsArray, cashPaymentsArray, minimumCashBuffer)` compiling month-by-month cash balances and calculating temporary bank overdraft financing requirements.",
    "eStarter": "function generateCashBudget(opening, receipts, payments, minCash = 10000) {\n  // TODO: Step through months, update cash = prevClosing + receipts - payments, record overdraft if cash < minCash\n  \n}",
    "eHint": "Iterate periods: netCash = currCash + receipts[i] - payments[i]; if (netCash < minCash) overdraftNeeded = minCash - netCash, closing = minCash; else overdraftNeeded = 0, closing = netCash; update currCash = closing.",
    "eTest": "const budget = generateCashBudget(20000, [50000, 40000], [45000, 60000], 10000);\n// M1: 20k + 5k = 25k (OD=0); M2: 25k - 20k = 5k (<10k -> OD=5k, Closing=10k)\nif (budget.monthlyClosingBalances[0] !== 25000 || budget.overdraftRequired[1] !== 5000) throw new Error('Cash budget overdraft simulation failed');\nconst noOd = generateCashBudget(10000, [30000], [20000], 5000);\nif (noOd.overdraftRequired[0] !== 0 || noOd.monthlyClosingBalances[0] !== 20000) throw new Error('Surplus cash budget failed');\nconst zeroStart = generateCashBudget(0, [10000], [15000], 5000);\nif (zeroStart.overdraftRequired[0] !== 10000) throw new Error('Initial deficit overdraft failed');",
    "aTitle": "Operating Cycle & Cash Conversion Efficiency Optimizer",
    "aDesc": "Implement function `calculateOperatingCycle(rawMaterialDays, wipDays, finishedGoodsDays, debtorDays, creditorDays)` computing Gross Operating Cycle and Net Working Capital Cycle in days.",
    "aStarter": "function calculateOperatingCycle(rmDays, wipDays, fgDays, debtorDays, creditorDays) {\n  // TODO: grossCycle = rm + wip + fg + debtor; netCycle = grossCycle - creditor\n  \n}",
    "aHint": "gross = rmDays + wipDays + fgDays + debtorDays; net = gross - creditorDays; return { grossOperatingCycleDays: gross, netCashConversionCycleDays: net, isEfficient: net <= 60 }.",
    "aTest": "const ccc = calculateOperatingCycle(30, 15, 20, 45, 40); // Gross = 110 days, Net = 110 - 40 = 70 days\nif (ccc.grossOperatingCycleDays !== 110 || ccc.netCashConversionCycleDays !== 70) throw new Error('Operating cycle calculation failed');"
  },
  {
    "day": 19,
    "title": "Capital Structure Theories: Modigliani-Miller (MM) Theorem",
    "desc": "Examine whether capital structure impacts firm value: Net Income (NI) Approach, Net Operating Income (NOI) Approach, Modigliani-Miller Proposition I & II (Without Taxes and With Corporate Taxes), and Trade-Off Theory.",
    "syllabus": [
      "MM Proposition I (No Taxes): Capital structure is irrelevant; $V_L = V_U$ (Homemade leverage arbitrage).",
      "MM Proposition I (With Corporate Taxes): Debt adds value via interest tax shield: $V_L = V_U + T \\cdot D$.",
      "Trade-Off Theory: Balancing tax shield advantages against the Expected Cost of Financial Distress and Bankruptcy."
    ],
    "eTitle": "Modigliani-Miller Levered Firm Value Engine",
    "eDesc": "Implement function `calculateMmLeveredValue(unleveredFirmValue, debtAmount, corporateTaxPct)` computing Value of Levered Firm ($V_L = V_U + t \\times D$) and Gain from Leverage under MM Proposition I with corporate taxes.",
    "eStarter": "function calculateMmLeveredValue(vu, d, taxPct) {\n  // TODO: Compute taxShieldPv = (taxPct / 100) * d, vl = vu + taxShieldPv, gainFromLeverage = taxShieldPv\n  \n}",
    "eHint": "t = taxPct / 100; taxShieldPv = t * d; vl = vu + taxShieldPv; return { unleveredFirmValue: vu, debtAmount: d, leveredFirmValue: Number(vl.toFixed(2)), gainFromLeverage: Number(taxShieldPv.toFixed(2)) }.",
    "eTest": "const mm = calculateMmLeveredValue(1000000, 400000, 25); // V_L = 1M + 0.25 * 400k = 1M + 100k = 1,100,000\nif (mm.leveredFirmValue !== 1100000.00 || mm.gainFromLeverage !== 100000.00) throw new Error('MM with tax valuation failed');\nconst noTax = calculateMmLeveredValue(1000000, 400000, 0);\nif (noTax.leveredFirmValue !== 1000000.00 || noTax.gainFromLeverage !== 0) throw new Error('MM no tax proposition I failed');\nconst zeroDebt = calculateMmLeveredValue(500000, 0, 30);\nif (zeroDebt.leveredFirmValue !== 500000.00) throw new Error('Zero debt MM valuation failed');",
    "aTitle": "MM Proposition II Cost of Equity under Leverage Calculator",
    "aDesc": "Implement function `calculateMmCostOfEquity(unleveredKePct, preTaxKdPct, debtValue, equityValue, taxPct)` computing the rising cost of levered equity $K_e = K_{e,u} + (K_{e,u} - K_d)(1 - t)(D/E)$.",
    "aStarter": "function calculateMmCostOfEquity(keu, kd, d, e, taxPct) {\n  // TODO: Compute leveredKe = keu + (keu - kd) * (1 - taxPct/100) * (d / e)\n  \n}",
    "aHint": "t = taxPct / 100; financialRiskPremium = (keu - kd) * (1 - t) * (d / e); leveredKe = keu + financialRiskPremium; return { leveredCostOfEquityPercent: Number(leveredKe.toFixed(2)), financialRiskPremium: Number(financialRiskPremium.toFixed(2)) }.",
    "aTest": "const keLevered = calculateMmCostOfEquity(12, 8, 400000, 600000, 25); // Premium = (12 - 8) * 0.75 * (4/6) = 4 * 0.75 * 0.6667 = 2.0% -> Ke = 14.0%\nif (keLevered.leveredCostOfEquityPercent !== 14.00) throw new Error('MM proposition II Ke calculation failed');"
  },
  {
    "day": 20,
    "title": "Dividend Policy Theories: Walter's Model & Gordon's Model",
    "desc": "Evaluate corporate dividend distribution decisions: Walter's Model ($P = \\frac{D + (r/K_e)(E - D)}{K_e}$), Gordon's Dividend Growth Model, and Modigliani-Miller Dividend Irrelevance Theorem.",
    "syllabus": [
      "Walter's Valuation Model: Growth Firm ($r > K_e \\implies 0\\%\\ Payout$); Declining Firm ($r < K_e \\implies 100\\%\\ Payout$).",
      "Gordon's Model: Investor preference for current cash dividends ('Bird-in-the-Hand' theory).",
      "MM Dividend Irrelevance: Dividend payout does not affect shareholder wealth in frictionless markets."
    ],
    "eTitle": "Walter's Model Share Price & Optimal Dividend Engine",
    "eDesc": "Implement function `calculateWalterModelPrice(dividendPerShare, earningsPerShare, internalReturnRoiPct, costOfCapitalKePct)` computing equilibrium market share price.",
    "eStarter": "function calculateWalterModelPrice(d, e, rPct, kePct) {\n  // TODO: Compute P = [D + (r / ke) * (E - D)] / ke and identify optimal payout policy\n  \n}",
    "eHint": "r = rPct / 100; ke = kePct / 100; price = (d + (r / ke) * (e - d)) / ke; firmType = r > ke ? 'GROWTH_FIRM_OPTIMAL_PAYOUT_0_PCT' : (r < ke ? 'DECLINING_FIRM_OPTIMAL_PAYOUT_100_PCT' : 'NORMAL_FIRM_ANY_PAYOUT'); return { sharePrice: Number(price.toFixed(2)), firmType }.",
    "eTest": "const growth = calculateWalterModelPrice(4, 10, 15, 10); // r=15%, ke=10% -> P = (4 + 1.5*6)/0.10 = 13/0.10 = 130.00\nif (growth.sharePrice !== 130.00 || growth.firmType !== 'GROWTH_FIRM_OPTIMAL_PAYOUT_0_PCT') throw new Error('Growth firm Walter price failed');\nconst decline = calculateWalterModelPrice(4, 10, 8, 10); // r=8%, ke=10% -> P = (4 + 0.8*6)/0.10 = 8.8/0.10 = 88.00\nif (decline.sharePrice !== 88.00 || decline.firmType !== 'DECLINING_FIRM_OPTIMAL_PAYOUT_100_PCT') throw new Error('Declining firm Walter price failed');\nconst normal = calculateWalterModelPrice(4, 10, 10, 10); // r=10%, ke=10% -> P = 100.00\nif (normal.sharePrice !== 100.00 || normal.firmType !== 'NORMAL_FIRM_ANY_PAYOUT') throw new Error('Normal firm Walter price failed');",
    "aTitle": "Gordon Growth Model Dividend Valuation Calculator",
    "aDesc": "Implement function `calculateGordonSharePrice(earningsPerShare, retentionRatioB, returnOnInvestmentR, costOfEquityKe)` computing equilibrium stock price $P_0 = \\frac{E_1(1 - b)}{K_e - b \\cdot r}$.",
    "aStarter": "function calculateGordonSharePrice(eps, b, rPct, kePct) {\n  // TODO: Compute retention growth g = b * (rPct/100), d1 = eps * (1 - b), P0 = d1 / (kePct/100 - g)\n  \n}",
    "aHint": "g = b * (rPct / 100); ke = kePct / 100; if (ke <= g) throw new Error('Cost of equity must exceed growth rate'); d1 = eps * (1 - b); price = d1 / (ke - g); return { sharePrice: Number(price.toFixed(2)), growthRatePercent: Number((g * 100).toFixed(2)) }.",
    "aTest": "const gordon = calculateGordonSharePrice(10, 0.40, 15, 10); // g = 0.40*15% = 6.0%. D1 = 10 * 0.60 = 6. P0 = 6 / (0.10 - 0.06) = 6 / 0.04 = 150.00\nif (gordon.sharePrice !== 150.00 || gordon.growthRatePercent !== 6.00) throw new Error('Gordon share price calculation failed');"
  },
  {
    "day": 21,
    "title": "⭐ MILESTONE 3: Complete Corporate Capital Structure & Dividend Optimization Engine",
    "desc": "Milestone 3: Construct an integrated corporate financial policy engine: Analyzing financial leverage multipliers, optimizing MM capital structure tax shields, and determining value-maximizing dividend payout policies.",
    "syllabus": [
      "Capital Structure and Dividend Policy integration.",
      "Corporate leverage trade-off risk modeling.",
      "Board-level financial strategy recommendation synthesis."
    ],
    "eTitle": "Corporate Financial Policy Master Optimization Kernel",
    "eDesc": "Implement function `executeCorporatePolicyMaster(ebit, interest, debt, taxPct, eps, dps, roiPct, kePct)` consolidating DFL, tax shield value, and Walter dividend valuation.",
    "eStarter": "function executeCorporatePolicyMaster(ebit, interest, debt, taxPct, eps, dps, roiPct, kePct) {\n  // TODO: Consolidate leverage DFL, MM tax shield value, and Walter model share price into master corporate policy report\n  \n}",
    "eHint": "ebt = ebit - interest; dfl = Number((ebit / ebt).toFixed(2)); taxShield = Number((debt * (taxPct / 100)).toFixed(2)); walterPrice = Number(((dps + (roiPct/kePct) * (eps - dps)) / (kePct/100)).toFixed(2)); return comprehensive object with engineStatus: 'CORPORATE_FINANCIAL_POLICY_MASTER_ACTIVE'.",
    "eTest": "const res = executeCorporatePolicyMaster(200000, 50000, 400000, 25, 10, 4, 15, 10); // DFL = 1.33, Tax shield = 100k, Walter = 130.00\nif (res.degreeOfFinancialLeverage !== 1.33 || res.capitalizedTaxShield !== 100000.00 || res.walterTheoreticalPrice !== 130.00) throw new Error('Corporate policy master failed');\nif (res.engineStatus !== 'CORPORATE_FINANCIAL_POLICY_MASTER_ACTIVE') throw new Error('Master policy status check failed');\nconst noDebtPolicy = executeCorporatePolicyMaster(100000, 0, 0, 25, 10, 10, 10, 10);\nif (noDebtPolicy.degreeOfFinancialLeverage !== 1.00 || noDebtPolicy.capitalizedTaxShield !== 0) throw new Error('Unlevered policy check failed');",
    "aTitle": "Capital Structure Trade-Off Distress Cost Analyzer",
    "aDesc": "Implement function `evaluateTradeOffTheoryFirmValue(unleveredValue, debtAmount, taxPct, probabilityOfDefault, bankruptcyCost)` computing optimal firm value balancing tax shields against financial distress costs.",
    "aStarter": "function evaluateTradeOffTheoryFirmValue(vu, d, taxPct, pDefault, bCost) {\n  // TODO: Compute VL = VU + (t * D) - (pDefault * bCost) and evaluate net leverage benefit\n  \n}",
    "aHint": "taxShield = d * (taxPct / 100); expectedDistressCost = (pDefault / 100) * bCost; leveredValue = vu + taxShield - expectedDistressCost; return { leveredFirmValue: leveredValue, netBenefitOfDebt: taxShield - expectedDistressCost }.",
    "aTest": "const to = evaluateTradeOffTheoryFirmValue(1000000, 500000, 30, 5, 400000); // TaxShield = 150k, Distress = 5% of 400k = 20k -> NetBenefit = 130k -> VL = 1,130,000\nif (to.leveredFirmValue !== 1130000 || to.netBenefitOfDebt !== 130000) throw new Error('Trade-off theory evaluation failed');"
  },
  {
    "day": 22,
    "title": "Equity Valuation: DCF Free Cash Flow & Multiples Valuation (P/E, EV/EBITDA)",
    "desc": "Perform fundamental equity valuation: Discounted Cash Flow to Firm (FCFF), Terminal Value estimation via Gordon exit multiple, Equity Value per Share, and Comparable Company Analysis ($P/E$, $EV/EBITDA$).",
    "syllabus": [
      "Free Cash Flow to Firm (FCFF): $EBIT(1 - t) + Dep - CapEx - \\Delta NWC$.",
      "Terminal Value (TV): $TV_n = \\frac{FCFF_{n+1}}{WACC - g}$ discounted back to present value.",
      "Enterprise Value to Equity Value Bridge: $Equity\\ Value = Enterprise\\ Value - Debt + Cash$."
    ],
    "eTitle": "Discounted Free Cash Flow to Firm (FCFF) & Equity Per Share Engine",
    "eDesc": "Implement function `calculateEnterpriseAndPeValue(fcffArray, terminalGrowthPct, waccPct, netDebt, sharesCount, eps, peMultiple)` valuing enterprise value via DCF and benchmark P/E target price.",
    "eStarter": "function calculateEnterpriseAndPeValue(fcffs, gPct, waccPct, netDebt, shares, eps, peMultiple) {\n  // TODO: Discount FCFF cash flows, compute terminal value via Gordon model, subtract net debt, and compute price per share\n  \n}",
    "eHint": "wacc = waccPct / 100; g = gPct / 100; pvFcff = fcffs.reduce((s, cf, t) => s + cf / Math.pow(1 + wacc, t + 1), 0); lastCf = fcffs[fcffs.length - 1]; tv = (lastCf * (1 + g)) / (wacc - g); pvTv = tv / Math.pow(1 + wacc, fcffs.length); ev = pvFcff + pvTv; eqVal = ev - netDebt; dcfPrice = eqVal / shares; pePrice = eps * peMultiple; return formatted object.",
    "eTest": "const val = calculateEnterpriseAndPeValue([50000, 60000], 3, 10, 100000, 10000, 5, 15); // P/E price = 5 * 15 = 75.00\nif (val.peComparativePricePerShare !== 75.00 || typeof val.dcfTargetPricePerShare !== 'number') throw new Error('Valuation calculation failed');\nconst singleCf = calculateEnterpriseAndPeValue([100000], 0, 10, 0, 10000, 10, 12);\nif (singleCf.peComparativePricePerShare !== 120.00) throw new Error('Single period P/E failed');\nconst zeroPe = calculateEnterpriseAndPeValue([10000], 2, 8, 5000, 1000, 0, 10);\nif (zeroPe.peComparativePricePerShare !== 0.00) throw new Error('Zero EPS multiple check failed');",
    "aTitle": "Enterprise Value to EBITDA (EV/EBITDA) Multiple Valuation Calculator",
    "aDesc": "Implement function `calculateEvEbitdaTarget(ebitda, peerEvEbitdaMultiple, totalDebt, cashBalance, sharesCount)` estimating target equity share price using peer industry EV/EBITDA multiples.",
    "aStarter": "function calculateEvEbitdaTarget(ebitda, multiple, debt, cash, shares) {\n  // TODO: Compute Enterprise Value = EBITDA * multiple, Equity Value = EV - debt + cash, Share Price = Equity Value / shares\n  \n}",
    "aHint": "enterpriseValue = ebitda * multiple; equityValue = enterpriseValue - debt + cash; targetPrice = equityValue / shares; return { enterpriseValue, equityValue, targetPricePerShare: Number(targetPrice.toFixed(2)) }.",
    "aTest": "const ev = calculateEvEbitdaTarget(100000, 8, 200000, 50000, 10000); // EV = 800k, Equity = 800k - 200k + 50k = 650k -> Price = $65.00\nif (ev.enterpriseValue !== 800000 || ev.equityValue !== 650000 || ev.targetPricePerShare !== 65.00) throw new Error('EV/EBITDA valuation failed');"
  },
  {
    "day": 23,
    "title": "Modern Portfolio Theory: 2-Asset Portfolio Return, Variance & Diversification",
    "desc": "Engineer efficient multi-asset investment portfolios: Harry Markowitz Modern Portfolio Theory (MPT), Portfolio Expected Return, Portfolio Variance with Correlation Coefficient ($\\rho$), and the Power of Diversification.",
    "syllabus": [
      "Portfolio Expected Return: $E(R_p) = w_1 R_1 + w_2 R_2$.",
      "Portfolio Risk (Variance): $\\sigma_p^2 = w_1^2 \\sigma_1^2 + w_2^2 \\sigma_2^2 + 2 w_1 w_2 \\sigma_1 \\sigma_2 \\rho_{12}$.",
      "Diversification Effect: Why $\\rho < 1$ eliminates unsystematic risk without sacrificing expected returns."
    ],
    "eTitle": "Markowitz 2-Asset Portfolio Risk-Return Optimization Engine",
    "eDesc": "Implement function `calculatePortfolioRiskReturn(weight1, return1Pct, std1Pct, weight2, return2Pct, std2Pct, correlationCoeff)` computing portfolio expected return, variance, and standard deviation.",
    "eStarter": "function calculatePortfolioRiskReturn(w1, r1, s1, w2, r2, s2, rho) {\n  // TODO: Compute portReturn = w1*r1 + w2*r2 and portVar = w1^2*s1^2 + w2^2*s2^2 + 2*w1*w2*s1*s2*rho\n  \n}",
    "eHint": "portReturn = w1 * r1 + w2 * r2; portVar = Math.pow(w1 * s1, 2) + Math.pow(w2 * s2, 2) + 2 * w1 * w2 * s1 * s2 * rho; portStd = Math.sqrt(Math.max(0, portVar)); return { portfolioReturn: Number(portReturn.toFixed(2)), portfolioVariance: Number(portVar.toFixed(2)), portfolioStandardDeviation: Number(portStd.toFixed(2)) }.",
    "eTest": "const res = calculatePortfolioRiskReturn(0.5, 12, 20, 0.5, 8, 10, 0.0); // Ret = 10%. Var = 0.25*400 + 0.25*100 + 0 = 100 + 25 = 125. Std = sqrt(125) = 11.18%\nif (res.portfolioReturn !== 10.00 || res.portfolioVariance !== 125.00 || res.portfolioStandardDeviation !== 11.18) throw new Error('Uncorrelated portfolio risk return failed');\nconst perfHedge = calculatePortfolioRiskReturn(0.5, 10, 10, 0.5, 10, 10, -1.0); // rho = -1 -> Zero risk!\nif (perfHedge.portfolioStandardDeviation !== 0.00) throw new Error('Perfect negative correlation zero risk failed');\nconst perfCorr = calculatePortfolioRiskReturn(0.5, 10, 10, 0.5, 10, 10, 1.0); // rho = 1 -> Std = 10%\nif (perfCorr.portfolioStandardDeviation !== 10.00) throw new Error('Perfect positive correlation failed');",
    "aTitle": "Minimum Variance Portfolio (MVP) Optimal Weight Calculator",
    "aDesc": "Implement function `calculateMinimumVarianceWeights(std1, std2, correlationRho)` computing the exact asset weight allocation $w_1^*$ that minimizes total portfolio risk.",
    "aStarter": "function calculateMinimumVarianceWeights(s1, s2, rho) {\n  // TODO: Compute w1 = (s2^2 - s1*s2*rho) / (s1^2 + s2^2 - 2*s1*s2*rho) and w2 = 1 - w1\n  \n}",
    "aHint": "num = Math.pow(s2, 2) - s1 * s2 * rho; denom = Math.pow(s1, 2) + Math.pow(s2, 2) - 2 * s1 * s2 * rho; w1 = num / denom; w2 = 1 - w1; return { weightAsset1: Number(w1.toFixed(4)), weightAsset2: Number(w2.toFixed(4)) }.",
    "aTest": "const mvp = calculateMinimumVarianceWeights(20, 10, 0.0); // w1 = 100 / (400 + 100) = 100 / 500 = 0.20\nif (mvp.weightAsset1 !== 0.2000 || mvp.weightAsset2 !== 0.8000) throw new Error('MVP weight calculation failed');"
  },
  {
    "day": 24,
    "title": "Capital Asset Pricing Model (CAPM) & Security Market Line (SML)",
    "desc": "Priced market systematic risk: Beta ($\\beta$), Security Market Line (SML), estimating required returns under CAPM ($E(R_i) = R_f + \\beta_i(R_m - R_f)$), and identifying mispriced securities via Jensen's Alpha.",
    "syllabus": [
      "Systematic Risk vs Unsystematic Risk: Why diversification eliminates unsystematic risk but leaves systematic risk.",
      "Beta ($\\beta$) Coefficient: Covariance of asset return with market divided by market variance.",
      "Security Market Line (SML): Assets above SML are undervalued (Positive Alpha); assets below SML are overvalued."
    ],
    "eTitle": "CAPM Expected Return, SML & Jensen's Alpha Mispricing Engine",
    "eDesc": "Implement function `evaluateCapmMispricing(riskFreeRate, marketReturn, assetBeta, actualExpectedReturn)` calculating CAPM required return, Jensen's Alpha, and BUY/SELL recommendation.",
    "eStarter": "function evaluateCapmMispricing(rf, rm, beta, actualReturn) {\n  // TODO: Compute capmRequired = rf + beta * (rm - rf), alpha = actualReturn - capmRequired, signal = alpha > 0 ? 'UNDERVALUED_BUY' : 'OVERVALUED_SELL'\n  \n}",
    "eHint": "capmRequired = rf + beta * (rm - rf); alpha = actualReturn - capmRequired; signal = alpha > 0 ? 'UNDERVALUED_BUY' : (alpha < 0 ? 'OVERVALUED_SELL' : 'FAIRLY_PRICED_HOLD'); return { capmRequiredReturn: Number(capmRequired.toFixed(2)), jensenAlpha: Number(alpha.toFixed(2)), investmentSignal: signal }.",
    "eTest": "const buy = evaluateCapmMispricing(5, 11, 1.2, 14); // Required = 5 + 1.2*6 = 12.2%. Actual = 14% -> Alpha = +1.8% -> BUY\nif (buy.capmRequiredReturn !== 12.20 || buy.jensenAlpha !== 1.80 || buy.investmentSignal !== 'UNDERVALUED_BUY') throw new Error('Undervalued asset CAPM failed');\nconst sell = evaluateCapmMispricing(5, 11, 1.2, 10); // Required = 12.2%, Actual = 10% -> Alpha = -2.2% -> SELL\nif (sell.investmentSignal !== 'OVERVALUED_SELL' || sell.jensenAlpha !== -2.20) throw new Error('Overvalued asset CAPM failed');\nconst fair = evaluateCapmMispricing(5, 11, 1.0, 11);\nif (fair.investmentSignal !== 'FAIRLY_PRICED_HOLD' || fair.jensenAlpha !== 0.00) throw new Error('Fairly priced CAPM failed');",
    "aTitle": "Portfolio Beta & Systematic Risk Contribution Calculator",
    "aDesc": "Implement function `calculatePortfolioBeta(assetWeights, assetBetas)` computing the aggregate weighted beta of a multi-asset investment portfolio relative to benchmark index.",
    "aStarter": "function calculatePortfolioBeta(weights, betas) {\n  // TODO: Compute portfolio beta as the dot product sum of weights[i] * betas[i]\n  \n}",
    "aHint": "portfolioBeta = weights.reduce((sum, w, i) => sum + w * betas[i], 0); isMoreVolatileThanMarket = portfolioBeta > 1.0; return { portfolioBeta: Number(portfolioBeta.toFixed(2)), isMoreVolatileThanMarket }.",
    "aTest": "const pb = calculatePortfolioBeta([0.6, 0.4], [1.2, 0.8]); // 0.72 + 0.32 = 1.04\nif (pb.portfolioBeta !== 1.04 || !pb.isMoreVolatileThanMarket) throw new Error('Portfolio beta calculation failed');"
  },
  {
    "day": 25,
    "title": "Portfolio Performance Measurement: Sharpe, Treynor & Jensen Ratios",
    "desc": "Evaluate portfolio manager performance on a risk-adjusted basis: Sharpe Ratio (Excess return per unit of total risk $\\sigma$), Treynor Ratio (Excess return per unit of systematic risk $\\beta$), and Jensen's Alpha.",
    "syllabus": [
      "Sharpe Ratio: $S = \\frac{R_p - R_f}{\\sigma_p}$ (Evaluates un-diversified portfolios).",
      "Treynor Ratio: $T = \\frac{R_p - R_f}{\\beta_p}$ (Evaluates well-diversified portfolios).",
      "Jensen's Alpha: $\\alpha = R_p - [R_f + \\beta_p(R_m - R_f)]$ (Measures pure managerial stock-picking alpha)."
    ],
    "eTitle": "Risk-Adjusted Portfolio Performance Ratios Engine",
    "eDesc": "Implement function `calculatePerformanceRatios(portfolioReturn, riskFreeRate, portfolioStdDev, portfolioBeta, marketReturn)` computing Sharpe Ratio, Treynor Ratio, and Jensen's Alpha.",
    "eStarter": "function calculatePerformanceRatios(rp, rf, stdP, betaP, rm) {\n  // TODO: Compute excessReturn = rp - rf, Sharpe = excess / stdP, Treynor = excess / betaP, Jensen = rp - (rf + betaP * (rm - rf))\n  \n}",
    "eHint": "excessReturn = rp - rf; sharpe = excessReturn / stdP; treynor = excessReturn / betaP; jensen = rp - (rf + betaP * (rm - rf)); return { excessReturn: Number(excessReturn.toFixed(2)), sharpeRatio: Number(sharpe.toFixed(2)), treynorRatio: Number(treynor.toFixed(2)), jensenAlpha: Number(jensen.toFixed(2)) }.",
    "eTest": "const res = calculatePerformanceRatios(15, 5, 12, 1.25, 11); // Excess = 10%. Sharpe = 10/12 = 0.83. Treynor = 10/1.25 = 8.00. Jensen = 15 - (5 + 1.25*6) = 15 - 12.5 = 2.50\nif (res.sharpeRatio !== 0.83 || res.treynorRatio !== 8.00 || res.jensenAlpha !== 2.50) throw new Error('Performance ratios calculation failed');\nconst lowPerf = calculatePerformanceRatios(8, 5, 10, 1.0, 11); // Excess = 3%. Jensen = 8 - (5 + 6) = -3.00\nif (lowPerf.jensenAlpha !== -3.00 || lowPerf.sharpeRatio !== 0.30) throw new Error('Negative alpha evaluation failed');\nconst zeroRisk = calculatePerformanceRatios(5, 5, 10, 1.0, 10);\nif (zeroRisk.excessReturn !== 0.00) throw new Error('Zero excess return check failed');",
    "aTitle": "Information Ratio & Tracking Error Active Return Analyzer",
    "aDesc": "Implement function `calculateInformationRatio(portfolioReturns, benchmarkReturns)` computing Active Return (Alpha), Tracking Error standard deviation, and Information Ratio.",
    "aStarter": "function calculateInformationRatio(pReturns, bReturns) {\n  // TODO: Compute active returns differences, mean active return, tracking error (std of diffs), and IR = mean / TE\n  \n}",
    "aHint": "diffs = pReturns.map((r, i) => r - bReturns[i]); meanDiff = diffs.reduce((s, d) => s + d, 0) / diffs.length; variance = diffs.reduce((s, d) => s + Math.pow(d - meanDiff, 2), 0) / diffs.length; te = Math.sqrt(variance); ir = te === 0 ? 0 : meanDiff / te; return { activeReturn: Number(meanDiff.toFixed(2)), trackingError: Number(te.toFixed(2)), informationRatio: Number(ir.toFixed(2)) }.",
    "aTest": "const ir = calculateInformationRatio([12, 14, 16], [10, 12, 14]); // Diffs = [2, 2, 2] -> Mean = 2, TE = 0\nif (ir.activeReturn !== 2.00) throw new Error('Information ratio active return failed');"
  },
  {
    "day": 26,
    "title": "Financial Derivatives: Futures Hedging & Black-Scholes Option Pricing",
    "desc": "Hedge financial risk with derivatives: Forwards vs Futures contracts, Cost of Carry model ($F = S_0 e^{rT}$), European Call and Put options, Put-Call Parity ($C + PV(K) = P + S$), and Black-Scholes pricing.",
    "syllabus": [
      "Futures Fair Value & Cost of Carry: Compounding spot price at risk-free rate net of dividend yields.",
      "Put-Call Parity Law: Fundamental arbitrage relationship connecting call price, put price, spot price, and strike PV.",
      "Option Moneyness & Greeks: Delta (Hedge ratio), Gamma, Theta (Time decay), and Vega (Volatility sensitivity)."
    ],
    "eTitle": "Financial Futures Fair Pricing & Put-Call Parity Engine",
    "eDesc": "Implement function `evaluateFuturesAndPutCallParity(spotPrice, strikePrice, riskFreeRatePct, timeYears, callOptionPrice)` calculating Fair Theoretical Futures Price ($S_0 e^{rT}$) and implied Put Option price.",
    "eStarter": "function evaluateFuturesAndPutCallParity(s0, k, rPct, t, call) {\n  // TODO: Compute futuresPrice = s0 * e^(r*t), pvStrike = k * e^(-r*t), putPrice = call + pvStrike - s0\n  \n}",
    "eHint": "r = rPct / 100; futuresPrice = s0 * Math.exp(r * t); pvStrike = k * Math.exp(-r * t); putPrice = call + pvStrike - s0; return { fairFuturesPrice: Number(futuresPrice.toFixed(2)), pvOfStrike: Number(pvStrike.toFixed(2)), impliedPutPrice: Number(putPrice.toFixed(2)) }.",
    "eTest": "const res = evaluateFuturesAndPutCallParity(100, 100, 5, 1, 10); // Fut = 100 * e^0.05 = 105.13; PV(K) = 100 * e^-0.05 = 95.12; Put = 10 + 95.12 - 100 = 5.12\nif (res.fairFuturesPrice !== 105.13 || res.pvOfStrike !== 95.12 || res.impliedPutPrice !== 5.12) throw new Error('Futures and Put-Call parity failed');\nconst zeroRate = evaluateFuturesAndPutCallParity(100, 100, 0, 1, 10);\nif (zeroRate.fairFuturesPrice !== 100.00 || zeroRate.impliedPutPrice !== 10.00) throw new Error('Zero interest parity check failed');\nconst highStrike = evaluateFuturesAndPutCallParity(100, 120, 5, 1, 5);\nif (highStrike.impliedPutPrice <= 5.00) throw new Error('In-the-money put pricing check failed');",
    "aTitle": "Optimal Futures Hedge Ratio & Contract Calculator",
    "aDesc": "Implement function `calculateOptimalHedgeContracts(portfolioValue, portfolioBeta, futuresIndexPrice, contractMultiplier)` computing the exact number of futures contracts needed for full portfolio beta immunization.",
    "aStarter": "function calculateOptimalHedgeContracts(pVal, beta, indexPrice, multiplier) {\n  // TODO: Compute targetContracts = (beta * pVal) / (indexPrice * multiplier)\n  \n}",
    "aHint": "contractValue = indexPrice * multiplier; numContracts = Math.round((beta * pVal) / contractValue); return { contractValue, targetContractsCount: numContracts }.",
    "aTest": "const h = calculateOptimalHedgeContracts(10000000, 1.2, 20000, 50); // Contract = 20k * 50 = 1,000,000. N = (1.2 * 10M) / 1M = 12 contracts\nif (h.contractValue !== 1000000 || h.targetContractsCount !== 12) throw new Error('Hedge contracts calculation failed');"
  },
  {
    "day": 27,
    "title": "Corporate Restructuring: Mergers & Acquisitions (M&A) Accretion/Dilution",
    "desc": "Evaluate corporate restructuring and takeover transactions: Strategic synergies (Operational & Financial), M&A deal financing (Cash vs Stock swap), and Post-Merger EPS Accretion/Dilution analysis.",
    "syllabus": [
      "Motives for M&A: Economies of scale, horizontal/vertical integration, tax advantages, and market power.",
      "Stock Swap Exchange Ratio: Determining new shares issued based on agreed offer price per target share.",
      "EPS Accretion / Dilution: Comparing pre-merger vs post-merger earnings per share."
    ],
    "eTitle": "M&A EPS Accretion/Dilution & Synergy Valuation Engine",
    "eDesc": "Implement function `calculateMergerAccretionDilution(acquirerEarnings, acquirerShares, targetEarnings, newSharesIssued, postMergerSynergies)` calculating pre-merger vs post-merger EPS and percentage accretion/dilution.",
    "eStarter": "function calculateMergerAccretionDilution(eA, sA, eT, sNew, synergies = 0) {\n  // TODO: preEps = eA / sA; combinedEarnings = eA + eT + synergies; postEps = combinedEarnings / (sA + sNew); return accretion analysis\n  \n}",
    "eHint": "preEps = eA / sA; combinedEarnings = eA + eT + synergies; totalShares = sA + sNew; postEps = combinedEarnings / totalShares; epsChange = postEps - preEps; pctChange = (epsChange / preEps) * 100; return { preMergerEps: Number(preEps.toFixed(2)), postMergerEps: Number(postEps.toFixed(2)), isAccretive: epsChange > 0, percentageAccretionDilution: Number(pctChange.toFixed(2)) }.",
    "eTest": "const res = calculateMergerAccretionDilution(1000000, 200000, 400000, 50000, 0); // Pre EPS = 5.00. Combined = 1.4M / 250k = 5.60 (+12% Accretive)\nif (res.preMergerEps !== 5.00 || res.postMergerEps !== 5.60 || !res.isAccretive || res.percentageAccretionDilution !== 12.00) throw new Error('Accretive merger calculation failed');\nconst dil = calculateMergerAccretionDilution(1000000, 200000, 200000, 100000, 0); // Combined = 1.2M / 300k = 4.00 (-20% Dilutive)\nif (dil.isAccretive || dil.percentageAccretionDilution !== -20.00) throw new Error('Dilutive merger calculation failed');\nconst syn = calculateMergerAccretionDilution(1000000, 200000, 200000, 100000, 300000); // With 300k synergies -> 1.5M / 300k = 5.00 (Neutral)\nif (syn.postMergerEps !== 5.00) throw new Error('Synergy adjusted merger failed');",
    "aTitle": "Maximum Acquisition Offer Price & Synergy Cap Calculator",
    "aDesc": "Implement function `calculateMaxOfferPrice(targetStandaloneValue, presentValueOfSynergies, targetSharesCount)` computing maximum cash offer price per target share without destroying acquirer value.",
    "aStarter": "function calculateMaxOfferPrice(standaloneVal, synergiesPv, shares) {\n  // TODO: maxTotalOffer = standaloneVal + synergiesPv; maxPricePerShare = maxTotalOffer / shares\n  \n}",
    "aHint": "maxTotal = standaloneVal + synergiesPv; maxPerShare = maxTotal / shares; return { maxTotalOffer: maxTotal, maxPricePerShare: Number(maxPerShare.toFixed(2)), standalonePricePerShare: Number((standaloneVal / shares).toFixed(2)) }.",
    "aTest": "const maxO = calculateMaxOfferPrice(50000000, 15000000, 1000000); // MaxTotal = 65M -> MaxPrice = $65.00 (Standalone = $50.00)\nif (maxO.maxPricePerShare !== 65.00 || maxO.standalonePricePerShare !== 50.00) throw new Error('Max offer price calculation failed');"
  },
  {
    "day": 28,
    "title": "Corporate Credit Analysis & Altman Z-Score Bankruptcy Prediction",
    "desc": "Assess corporate creditworthiness and default probability: The 5 Cs of Credit, Credit Rating Agency matrices, and Edward Altman's 5-Factor $Z$-Score quantitative bankruptcy forecasting model.",
    "syllabus": [
      "Altman Z-Score Model: $Z = 1.2 X_1 + 1.4 X_2 + 3.3 X_3 + 0.6 X_4 + 1.0 X_5$.",
      "Zone of Discrimination: Safe Zone ($Z > 2.99$), Gray Zone ($1.81 \\le Z \\le 2.99$), Distress Zone ($Z < 1.81$).",
      "Credit Ratios: Interest Coverage Ratio, Debt Service Coverage Ratio (DSCR), and Debt-to-EBITDA leverage."
    ],
    "eTitle": "Altman Z-Score Corporate Distress & Bankruptcy Prediction Engine",
    "eDesc": "Implement function `calculateAltmanZScore(workingCapital, retainedEarnings, ebit, marketCapOfEquity, totalSales, totalAssets, totalLiabilities)` computing the 5-factor Altman Z-Score and credit zone classification.",
    "eStarter": "function calculateAltmanZScore(wc, re, ebit, mCap, sales, assets, liab) {\n  // TODO: Compute x1..x5 financial ratios, apply Altman weighting (1.2*x1 + 1.4*x2 + 3.3*x3 + 0.6*x4 + 1.0*x5), and classify zone\n  \n}",
    "eHint": "x1 = wc/assets; x2 = re/assets; x3 = ebit/assets; x4 = mCap/liab; x5 = sales/assets; z = 1.2*x1 + 1.4*x2 + 3.3*x3 + 0.6*x4 + 1.0*x5; zone = z > 2.99 ? 'SAFE_ZONE_MINIMAL_DEFAULT_RISK' : (z >= 1.81 ? 'GRAY_ZONE_MODERATE_DEFAULT_RISK' : 'DISTRESS_ZONE_HIGH_BANKRUPTCY_RISK'); return { zScore: Number(z.toFixed(2)), creditZone: zone }.",
    "eTest": "const safe = calculateAltmanZScore(200000, 300000, 200000, 800000, 1000000, 1000000, 400000); // x1=0.2, x2=0.3, x3=0.2, x4=2.0, x5=1.0 -> Z = 1.2*0.2 + 1.4*0.3 + 3.3*0.2 + 0.6*2.0 + 1.0 = 0.24 + 0.42 + 0.66 + 1.20 + 1.00 = 3.52\nif (safe.zScore !== 3.52 || safe.creditZone !== 'SAFE_ZONE_MINIMAL_DEFAULT_RISK') throw new Error('Safe zone Z-Score failed');\nconst distress = calculateAltmanZScore(-50000, -100000, 10000, 100000, 500000, 1000000, 800000); // Z < 1.81\nif (distress.creditZone !== 'DISTRESS_ZONE_HIGH_BANKRUPTCY_RISK') throw new Error('Distress zone Z-Score failed');\nconst gray = calculateAltmanZScore(100000, 100000, 100000, 300000, 800000, 1000000, 500000);\nif (gray.creditZone !== 'GRAY_ZONE_MODERATE_DEFAULT_RISK') throw new Error('Gray zone Z-Score failed');",
    "aTitle": "Debt Service Coverage Ratio (DSCR) Credit Risk Evaluator",
    "aDesc": "Implement function `calculateDSCR(netOperatingIncome, principalRepayment, interestExpense)` computing DSCR and evaluating loan repayment feasibility for commercial banking credit underwriting.",
    "aStarter": "function calculateDSCR(ebitda, principal, interest) {\n  // TODO: Compute totalDebtService = principal + interest; dscr = ebitda / totalDebtService; isAdequate = dscr >= 1.25\n  \n}",
    "aHint": "totalService = principal + interest; dscr = ebitda / totalService; isAdequate = dscr >= 1.25; return { dscr: Number(dscr.toFixed(2)), isAdequate, creditGrade: dscr >= 1.5 ? 'PRIME_INVESTMENT_GRADE' : (isAdequate ? 'ACCEPTABLE_RISK' : 'HIGH_CREDIT_RISK') }.",
    "aTest": "const cr = calculateDSCR(150000, 60000, 40000); // 150k / 100k = 1.50\nif (cr.dscr !== 1.50 || !cr.isAdequate || cr.creditGrade !== 'PRIME_INVESTMENT_GRADE') throw new Error('DSCR credit evaluation failed');"
  },
  {
    "day": 29,
    "title": "FinTech, Robo-Advisory & ESG Sustainable Investment Scoring",
    "desc": "Apply technology and sustainability frameworks in modern finance: Automated algorithmic Robo-Advisors (Risk-profile driven asset allocation), and Environmental, Social, and Governance (ESG) investment integration.",
    "syllabus": [
      "Robo-Advisory Mechanics: Rule-based utility optimization mapping risk tolerance questionnaires to target portfolios.",
      "ESG Scoring Framework: Environmental (Carbon intensity), Social (Human capital), and Governance (Board diversity) metrics.",
      "Green Bonds & Climate Finance: Capital market instruments earmarked for certified sustainable projects."
    ],
    "eTitle": "Robo-Advisory Asset Allocation & ESG Sustainable Portfolio Engine",
    "eDesc": "Implement function `generateRoboEsgAllocation(clientRiskScore, companyEsgScore)` computing algorithmic Equity/Debt asset allocation and ESG sustainability rating.",
    "eStarter": "function generateRoboEsgAllocation(riskScore, esgScore) {\n  // TODO: Map riskScore (1-10) to equity percentage (risk * 10) and debt percentage, evaluate ESG tier based on esgScore\n  \n}",
    "eHint": "equityPct = Math.max(10, Math.min(90, riskScore * 10)); debtPct = 100 - equityPct; esgTier = esgScore >= 80 ? 'TIER_A_ESG_LEADER' : (esgScore >= 50 ? 'TIER_B_ESG_COMPLIANT' : 'TIER_C_ESG_LAGGARD'); return { recommendedEquityPercent: equityPct, recommendedDebtPercent: debtPct, esgRatingTier: esgTier }.",
    "eTest": "const robo = generateRoboEsgAllocation(7, 85); // 70% equity, 30% debt, ESG Leader Tier A\nif (robo.recommendedEquityPercent !== 70 || robo.recommendedDebtPercent !== 30 || robo.esgRatingTier !== 'TIER_A_ESG_LEADER') throw new Error('Robo ESG allocation failed');\nconst cons = generateRoboEsgAllocation(2, 40); // 20% equity, 80% debt, ESG Laggard Tier C\nif (cons.recommendedEquityPercent !== 20 || cons.esgRatingTier !== 'TIER_C_ESG_LAGGARD') throw new Error('Conservative robo allocation failed');\nconst mid = generateRoboEsgAllocation(5, 60);\nif (mid.recommendedEquityPercent !== 50 || mid.esgRatingTier !== 'TIER_B_ESG_COMPLIANT') throw new Error('Moderate robo allocation failed');",
    "aTitle": "Carbon Intensity & Green Portfolio Alignment Calculator",
    "aDesc": "Implement function `calculatePortfolioCarbonIntensity(holdingsArray)` computing Weighted Average Carbon Intensity (WACI) per million dollars of enterprise revenue across portfolio investments.",
    "aStarter": "function calculatePortfolioCarbonIntensity(holdings) {\n  // TODO: Sum weight[i] * carbonIntensity[i] to compute portfolio WACI score\n  \n}",
    "aHint": "waci = holdings.reduce((sum, h) => sum + h.weight * h.carbonIntensity, 0); isParisAligned = waci <= 100; return { weightedAverageCarbonIntensity: Number(waci.toFixed(2)), isParisAligned }.",
    "aTest": "const h = [{ weight: 0.6, carbonIntensity: 80 }, { weight: 0.4, carbonIntensity: 120 }]; // 48 + 48 = 96\nconst c = calculatePortfolioCarbonIntensity(h);\nif (c.weightedAverageCarbonIntensity !== 96.00 || !c.isParisAligned) throw new Error('Carbon intensity calculation failed');"
  },
  {
    "day": 30,
    "title": "🏆 FINAL CAPSTONE: Integrated Corporate Finance, Valuation & Portfolio Investment Management Suite",
    "desc": "Final Capstone Synthesis: The complete corporate finance and institutional investment operating system bringing together TVM discounting, Capital Budgeting (NPV/IRR), WACC cost of capital, DCF Valuation, MPT Portfolio optimization, and Altman credit risk forecasting.",
    "syllabus": [
      "End-to-End Corporate Financial Decision Synthesis.",
      "Comprehensive Multi-Asset Valuation & Portfolio Optimization Suite.",
      "Boardroom Investment Committee Certification & Risk Matrix."
    ],
    "eTitle": "Enterprise Corporate Finance & Investment Suite Master",
    "eDesc": "Implement function `orchestrateCorporateFinance(tvmReady, capitalBudgetingReady, waccReady, valuationReady, portfolioReady, modelConfidenceScore)` certifying end-to-end corporate financial models.",
    "eStarter": "function orchestrateCorporateFinance(tvm, cb, wacc, val, port, score = 100) {\n  // TODO: Validate all five corporate finance modules and generate master investment committee audit certificate\n  \n}",
    "eHint": "isCertified = Boolean(tvm && cb && wacc && val && port && score >= 90); return { tvmValuationCertified: tvm, capitalBudgetingApproved: cb, waccHurdleVerified: wacc, dcfValuationAudited: val, portfolioOptimizationActive: port, investmentCommitteeApproved: isCertified, modelConfidenceScore: score, status: isCertified ? 'ENTERPRISE_FINANCE_AND_VALUATION_SUITE_CERTIFIED_NOMINAL' : 'VALUATION_AUDIT_DEFECT_DETECTED' }.",
    "eTest": "const ok = orchestrateCorporateFinance(true, true, true, true, true, 100);\nif (!ok.investmentCommitteeApproved || ok.status !== 'ENTERPRISE_FINANCE_AND_VALUATION_SUITE_CERTIFIED_NOMINAL') throw new Error('Capstone finance certification failed');\nconst fail = orchestrateCorporateFinance(true, true, false, true, true, 100);\nif (fail.investmentCommitteeApproved || fail.status !== 'VALUATION_AUDIT_DEFECT_DETECTED') throw new Error('Incomplete finance suite allowed');\nconst lowScore = orchestrateCorporateFinance(true, true, true, true, true, 60);\nif (lowScore.investmentCommitteeApproved) throw new Error('Low score finance certification allowed');",
    "aTitle": "Master Financial Risk Sensitivity & Stress Test Matrix",
    "aDesc": "Implement function `computeFinancialStressTest(baseNpv, interestRateShockBps, revenueShockPct, currencyDevaluationPct)` generating stressed project NPV and downside risk buffer under macroeconomic distress scenarios.",
    "aStarter": "function computeFinancialStressTest(baseNpv, rateShockBps, revShockPct, fxShockPct) {\n  // TODO: Apply macro shock discounts to base NPV and determine stressed project viability\n  \n}",
    "aHint": "ratePenalty = baseNpv * (rateShockBps / 10000) * 0.5; revPenalty = baseNpv * (revShockPct / 100); fxPenalty = baseNpv * (fxShockPct / 100) * 0.3; stressedNpv = baseNpv - ratePenalty - revPenalty - fxPenalty; return { baseNpv, stressedNpv: Number(stressedNpv.toFixed(2)), remainsViable: stressedNpv > 0 }.",
    "aTest": "const st = computeFinancialStressTest(1000000, 200, 10, 10); // RatePen = 1M * 0.02 * 0.5 = 10k, RevPen = 100k, FxPen = 30k -> Stressed = 860k\nif (st.stressedNpv !== 860000.00 || !st.remainsViable) throw new Error('Stress test matrix calculation failed');"
  }
];

export const BCOM_FINANCE_30_DAYS_QUESTS: CourseQuest[] = BCOM_FINANCE_30_DAYS_CONFIGS.flatMap((cfg, idx) => 
  buildEnrichedDayQuests('bcom-finance', idx + 1, cfg)
);
