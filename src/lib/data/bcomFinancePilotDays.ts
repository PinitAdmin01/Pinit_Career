import { DayLessonPlan } from '@/lib/types/lessonEngine';

export const BCOM_FINANCE_PILOT_DAYS: DayLessonPlan[] = [
  {
    "day": 1,
    "title": "Introduction to Corporate Finance & The Financial Ecosystem",
    "overviewMetaphor": "Corporate Finance is the Captain's Navigation Wheel of an Enterprise: a ship must decide three crucial maneuvers: 1. Investment Decision (Where to sail the ship to find treasure / Capital Budgeting); 2. Financing Decision (How to buy the ship—using the owners' gold or borrowing from bankers / Capital Structure); 3. Dividend Decision (How much gold to give back to the crew vs keeping in the ship's chest for future voyages); the ultimate goal is not just counting coins today (Profit Maximization), but making the entire fleet as valuable as possible over the long run (Shareholder Wealth Maximization).",
    "blocks": [
      {
        "id": "fin-d1-b1-wealth-vs-profit-maximization",
        "day": 1,
        "blockNumber": 1,
        "title": "Shareholder Wealth Maximization vs Profit Maximization",
        "conceptBudget": {
          "primaryConcept": "Wealth Maximization vs Profit Maximization",
          "supportingTerms": [
            "Profit Maximization (Short-sighted: Ignores timing of cash flows, risk, and accounting distortions)",
            "Shareholder Wealth Maximization (Maximizing the market value / stock price of equity shares)",
            "Time Value of Money & Risk Incorporation"
          ]
        },
        "prerequisiteThresholds": [],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Corporate Financial Objectives Comparison",
              "boxes": [
                {
                  "label": "Profit Maximization (Flawed)",
                  "value": "Goal: Maximize accounting Net Profit | Ignores risk, ignores cash flow timing!",
                  "varType": "Accounting Metric",
                  "isUpdated": false
                },
                {
                  "label": "Wealth Maximization (Superior)",
                  "value": "Goal: Maximize Market Value of Equity Shares | Considers risk, time value, and true cash flows!",
                  "varType": "Economic Value",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "objective_demo.js",
            "initialCode": "function evaluateFinancialGoal(goalType, considersRisk, considersTiming) {\n  const isWealthMax = (goalType === 'WEALTH_MAXIMIZATION' && considersRisk && considersTiming);\n  return {\n    goal: goalType,\n    isSuperiorLongTerm: isWealthMax,\n    status: isWealthMax ? 'SHAREHOLDER_WEALTH_MAXIMIZATION_PRIMARY_OBJECTIVE' : 'SUB_OPTIMAL_ACCOUNTING_METRIC'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateFinancialGoal('WEALTH_MAXIMIZATION', true, true)));\nconsole.log(JSON.stringify(evaluateFinancialGoal('PROFIT_MAXIMIZATION', false, false)));",
            "expectedOutput": "{\"goal\":\"WEALTH_MAXIMIZATION\",\"isSuperiorLongTerm\":true,\"status\":\"SHAREHOLDER_WEALTH_MAXIMIZATION_PRIMARY_OBJECTIVE\"}\n{\"goal\":\"PROFIT_MAXIMIZATION\",\"isSuperiorLongTerm\":false,\"status\":\"SUB_OPTIMAL_ACCOUNTING_METRIC\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that corporate financial decisions are guided by the superior long-term economic goal of Shareholder Wealth Maximization?",
          "expectedStringOutput": "SHAREHOLDER_WEALTH_MAXIMIZATION_PRIMARY_OBJECTIVE",
          "acceptableAnswers": [
            "SHAREHOLDER_WEALTH_MAXIMIZATION_PRIMARY_OBJECTIVE",
            "status\":\"SHAREHOLDER_WEALTH_MAXIMIZATION_PRIMARY_OBJECTIVE\""
          ],
          "primaryMisconceptionId": "MC_FIN_CAPSTONE_CORPORATE_FINANCE_AND_PORTFOLIO_VALUATION",
          "diagnosisMap": {
            "PROFIT": {
              "misconceptionId": "MC_FIN_CAPSTONE_CORPORATE_FINANCE_AND_PORTFOLIO_VALUATION",
              "errorExplanation": "Profit maximization ignores risk and cash timing. Wealth maximization is the primary corporate goal.",
              "recoveryPath": {
                "simplerExplanation": "Matches SHAREHOLDER_WEALTH_MAXIMIZATION_PRIMARY_OBJECTIVE.",
                "guidedFixPrompt": "Type SHAREHOLDER_WEALTH_MAXIMIZATION_PRIMARY_OBJECTIVE"
              }
            }
          }
        }
      },
      {
        "id": "fin-d1-b2-three-core-financial-decisions",
        "day": 1,
        "blockNumber": 2,
        "title": "The 3 Core Financial Decisions: Investing, Financing & Dividend",
        "conceptBudget": {
          "primaryConcept": "The Triad of Corporate Financial Decisions",
          "supportingTerms": [
            "Investment Decision (Capital Budgeting: Long-term asset selection & Working Capital management)",
            "Financing Decision (Capital Structure: Optimal debt-equity mix to minimize WACC)",
            "Dividend Decision (Retained Earnings for growth vs Cash Dividends to shareholders)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d1-b1-wealth-vs-profit-maximization",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Siloed Decision-Making vs Integrated Corporate Finance",
              "brokenCode": "// ❌ FLAWED APPROACH: Treating decisions independently:\nBuy factory ($10M) without knowing interest rates on debt,\nthen pay out 100% dividends leaving zero cash reserve!",
              "fixedCode": "// ✅ INTEGRATED CORPORATE FINANCE:\n1. Select project with NPV > 0 (Investment Decision)\n2. Fund via optimal Debt/Equity mix to minimize WACC (Financing Decision)\n3. Distribute only residual surplus as dividends (Dividend Decision)",
              "errorLine": 2,
              "errorReason": "Financial decisions cannot be made in isolation without evaluating cost of capital and liquidity.",
              "fixExplanation": "Align investment hurdle rates with optimal financing mix and sustainable dividend payout."
            }
          },
          {
            "type": "runnable_code",
            "filename": "decisions_demo.js",
            "initialCode": "function getDecisionCategory(question) {\n  if (question.includes('factory') || question.includes('project')) return 'INVESTMENT_DECISION_CAPITAL_BUDGETING';\n  if (question.includes('debt') || question.includes('equity') || question.includes('loan')) return 'FINANCING_DECISION_CAPITAL_STRUCTURE';\n  return 'DIVIDEND_DECISION_PAYOUT_POLICY';\n}\n\nconsole.log(getDecisionCategory('Should we purchase a new $10M automated factory?'));\nconsole.log(getDecisionCategory('Should we issue 8% debentures or equity shares?'));\nconsole.log(getDecisionCategory('What percentage of net profit should be distributed as cash?'));",
            "expectedOutput": "INVESTMENT_DECISION_CAPITAL_BUDGETING\nFINANCING_DECISION_CAPITAL_STRUCTURE\nDIVIDEND_DECISION_PAYOUT_POLICY",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which financial decision category determines whether a corporation should issue bonds vs common stock to fund its expansion?",
          "expectedStringOutput": "FINANCING_DECISION_CAPITAL_STRUCTURE",
          "acceptableAnswers": [
            "FINANCING_DECISION_CAPITAL_STRUCTURE",
            "Financing Decision",
            "Capital Structure"
          ],
          "primaryMisconceptionId": "MC_FIN_CAPITAL_STRUCTURE_MODIGLIANI_MILLER",
          "diagnosisMap": {
            "INVESTMENT": {
              "misconceptionId": "MC_FIN_CAPITAL_STRUCTURE_MODIGLIANI_MILLER",
              "errorExplanation": "Selecting projects is an Investment Decision. Choosing debt vs equity is a Financing Decision.",
              "recoveryPath": {
                "simplerExplanation": "Bonds vs stock is a Financing Decision.",
                "guidedFixPrompt": "Type FINANCING_DECISION_CAPITAL_STRUCTURE"
              }
            }
          }
        }
      },
      {
        "id": "fin-d1-b3-agency-problem-corporate-governance",
        "day": 1,
        "blockNumber": 3,
        "title": "The Agency Problem & Corporate Governance Mechanisms",
        "conceptBudget": {
          "primaryConcept": "The Principal-Agent Conflict",
          "supportingTerms": [
            "Principals (Shareholders who own the company)",
            "Agents (Executive managers hired to run the business)",
            "Agency Costs (Perks, executive jets, sub-optimal empire-building mergers)",
            "Governance Solutions (Stock options ESOPs, Board oversight, Performance bonuses)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d1-b2-three-core-financial-decisions",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "agency_demo.js",
            "initialCode": "function evaluateAgencyAlignment(incentiveType) {\n  return incentiveType === 'STOCK_OPTIONS_TIED_TO_SHARE_PRICE'\n    ? 'MANAGEMENT_GOALS_ALIGNED_WITH_SHAREHOLDER_WEALTH'\n    : 'POTENTIAL_AGENCY_CONFLICT_RISK';\n}\n\nconsole.log(evaluateAgencyAlignment('STOCK_OPTIONS_TIED_TO_SHARE_PRICE'));\nconsole.log(evaluateAgencyAlignment('FIXED_SALARY_WITH_NO_PERFORMANCE_GOALS'));",
            "expectedOutput": "MANAGEMENT_GOALS_ALIGNED_WITH_SHAREHOLDER_WEALTH\nPOTENTIAL_AGENCY_CONFLICT_RISK",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How do Employee Stock Option Plans (ESOPs) mitigate the corporate agency problem between managers and shareholders?",
          "expectedStringOutput": "MANAGEMENT_GOALS_ALIGNED_WITH_SHAREHOLDER_WEALTH",
          "acceptableAnswers": [
            "MANAGEMENT_GOALS_ALIGNED_WITH_SHAREHOLDER_WEALTH",
            "Aligns goals",
            "Aligns management with shareholders"
          ],
          "primaryMisconceptionId": "MC_FIN_CAPSTONE_CORPORATE_FINANCE_AND_PORTFOLIO_VALUATION",
          "diagnosisMap": {
            "CONFLICT": {
              "misconceptionId": "MC_FIN_CAPSTONE_CORPORATE_FINANCE_AND_PORTFOLIO_VALUATION",
              "errorExplanation": "Stock options align management incentives with shareholder wealth.",
              "recoveryPath": {
                "simplerExplanation": "Aligns management with shareholder wealth.",
                "guidedFixPrompt": "Type MANAGEMENT_GOALS_ALIGNED_WITH_SHAREHOLDER_WEALTH"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 2,
    "title": "Time Value of Money (TVM): Compounding & Future Value ($FV$)",
    "overviewMetaphor": "Compounding is a Rolling Snowball on a Mountain Slope: if you start with a $100,000 snowball and roll it down a 10% interest slope, in Year 1 it picks up $10,000 of snow ($110,000); in Year 2, the new snow also gathers snow—growing by $11,000 ($121,000); after 10 years, compounding expands the snowball to $259,374; Albert Einstein called compound interest the Eighth Wonder of the World: 'He who understands it, earns it; he who doesn't, pays it.'",
    "blocks": [
      {
        "id": "fin-d2-b1-future-value-single-cash-flow",
        "day": 2,
        "blockNumber": 1,
        "title": "Future Value Equation: $FV = PV(1 + r)^n$",
        "conceptBudget": {
          "primaryConcept": "Future Value Compound Interest Formula",
          "supportingTerms": [
            "$PV$ (Present Value / Initial Principal)",
            "$r$ (Annual interest / compounding rate)",
            "$n$ (Number of compounding time periods / years)",
            "$FV = PV(1 + r)^n$",
            "Simple Interest ($SI = P \\cdot r \\cdot n$) vs Compound Interest"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d1-b1-wealth-vs-profit-maximization",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Compound Growth ($100k @ 10% for 3 Years)",
              "boxes": [
                {
                  "label": "Year 0 (Present Value)",
                  "value": "$100,000 Principal",
                  "varType": "Initial PV",
                  "isUpdated": false
                },
                {
                  "label": "Year 1 ($100k x 1.10)",
                  "value": "$110,000 (+10k interest)",
                  "varType": "Compounded Y1",
                  "isUpdated": false
                },
                {
                  "label": "Year 2 ($110k x 1.10)",
                  "value": "$121,000 (+11k interest)",
                  "varType": "Compounded Y2",
                  "isUpdated": false
                },
                {
                  "label": "Year 3 ($121k x 1.10)",
                  "value": "$133,100 (+12.1k interest on interest!)",
                  "varType": "Final FV",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "fv_calc_demo.js",
            "initialCode": "function calculateFutureValue(pv, rPct, n) {\n  const r = rPct / 100;\n  const fv = pv * Math.pow(1 + r, n);\n  const totalInterest = fv - pv;\n  return {\n    presentValue: pv,\n    futureValue: Number(fv.toFixed(2)),\n    compoundInterestEarned: Number(totalInterest.toFixed(2)),\n    status: 'FUTURE_VALUE_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateFutureValue(100000, 10, 3)));",
            "expectedOutput": "{\"presentValue\":100000,\"futureValue\":133100,\"compoundInterestEarned\":33100,\"status\":\"FUTURE_VALUE_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Future Value of $100,000 invested for 3 years at 10% compound interest ($100000 \\times 1.10^3$)?",
          "expectedStringOutput": "133100",
          "acceptableAnswers": [
            "133100",
            "$133,100",
            "futureValue\":133100"
          ],
          "primaryMisconceptionId": "MC_FIN_TIME_VALUE_OF_MONEY_COMPOUND_INTEREST",
          "diagnosisMap": {
            "130000": {
              "misconceptionId": "MC_FIN_TIME_VALUE_OF_MONEY_COMPOUND_INTEREST",
              "errorExplanation": "$130,000 is simple interest ($10k x 3). Compound interest adds interest on interest = $133,100.",
              "recoveryPath": {
                "simplerExplanation": "100000 * 1.331 = 133100.",
                "guidedFixPrompt": "Type 133100"
              }
            }
          }
        }
      },
      {
        "id": "fin-d2-b2-multi-period-compounding-ear",
        "day": 2,
        "blockNumber": 2,
        "title": "Multi-Period Compounding & Effective Annual Rate (EAR)",
        "conceptBudget": {
          "primaryConcept": "Multi-Period Compounding & EAR",
          "supportingTerms": [
            "$m$ Compounding Frequency (Semi-Annual $m=2$, Quarterly $m=4$, Monthly $m=12$, Daily $m=365$)",
            "$FV = PV \\left(1 + \\frac{r}{m}\\right)^{m \\times n}$",
            "Effective Annual Rate: $EAR = \\left(1 + \\frac{r}{m}\\right)^m - 1$",
            "$EAR > \\text{Nominal Rate}$ when $m > 1$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d2-b1-future-value-single-cash-flow",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Nominal vs Effective Rate Calculation",
            "codeSnippet": "// 10% Nominal Rate Compounded Semi-Annually (m = 2):\n// Periodic Rate = 10% / 2 = 5% per half-year\n// EAR = (1 + 0.05)^2 - 1 = 1.1025 - 1 = 10.25% Effective Yield!",
            "lineNotes": {
              "2": "Periodic semi-annual rate.",
              "3": "Effective annual rate exceeds nominal rate."
            }
          },
          {
            "type": "runnable_code",
            "filename": "ear_calc_demo.js",
            "initialCode": "function calculateEar(nominalPct, m) {\n  const r = nominalPct / 100;\n  const ear = (Math.pow(1 + r / m, m) - 1) * 100;\n  return {\n    nominalRatePercent: nominalPct,\n    compoundingFrequencyPerYear: m,\n    effectiveAnnualRatePercent: Number(ear.toFixed(2)),\n    status: 'EAR_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateEar(10, 2)));\nconsole.log(JSON.stringify(calculateEar(10, 12)));",
            "expectedOutput": "{\"nominalRatePercent\":10,\"compoundingFrequencyPerYear\":2,\"effectiveAnnualRatePercent\":10.25,\"status\":\"EAR_COMPUTED\"}\n{\"nominalRatePercent\":10,\"compoundingFrequencyPerYear\":12,\"effectiveAnnualRatePercent\":10.47,\"status\":\"EAR_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Effective Annual Rate (EAR) percentage for a 10% nominal interest rate compounded semi-annually ($ (1 + 0.05)^2 - 1 $)?",
          "expectedStringOutput": "10.25",
          "acceptableAnswers": [
            "10.25",
            "10.25%",
            "effectiveAnnualRatePercent\":10.25"
          ],
          "primaryMisconceptionId": "MC_FIN_TIME_VALUE_OF_MONEY_COMPOUND_INTEREST",
          "diagnosisMap": {
            "10.0": {
              "misconceptionId": "MC_FIN_TIME_VALUE_OF_MONEY_COMPOUND_INTEREST",
              "errorExplanation": "10.0% is the nominal rate. Semi-annual compounding yields an effective 10.25%.",
              "recoveryPath": {
                "simplerExplanation": "1.05^2 - 1 = 10.25%.",
                "guidedFixPrompt": "Type 10.25"
              }
            }
          }
        }
      },
      {
        "id": "fin-d2-b3-rule-of-72-doubling-time",
        "day": 2,
        "blockNumber": 3,
        "title": "The Rule of 72 for Investment Doubling Time",
        "conceptBudget": {
          "primaryConcept": "Rule of 72 Mental Model",
          "supportingTerms": [
            "$\\text{Doubling Time (Years)} \\approx \\frac{72}{\\text{Annual Interest Rate (\\%)}}$",
            "At 6% $\\implies 72 / 6 = 12$ years to double",
            "At 12% $\\implies 72 / 12 = 6$ years to double"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d2-b2-multi-period-compounding-ear",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "rule72_demo.js",
            "initialCode": "function getDoublingTime(rPct) {\n  const approxYears = 72 / rPct;\n  const exactYears = Math.log(2) / Math.log(1 + rPct / 100);\n  return {\n    annualRatePercent: rPct,\n    rule72ApproxYears: Number(approxYears.toFixed(1)),\n    exactLogYears: Number(exactYears.toFixed(2)),\n    status: 'DOUBLING_TIME_EVALUATED'\n  };\n}\n\nconsole.log(JSON.stringify(getDoublingTime(8)));",
            "expectedOutput": "{\"annualRatePercent\":8,\"rule72ApproxYears\":9,\"exactLogYears\":9.01,\"status\":\"DOUBLING_TIME_EVALUATED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "According to the Rule of 72, approximately how many years will it take for an investment to double at an 8% annual return ($72 / 8$)?",
          "expectedStringOutput": "9",
          "acceptableAnswers": [
            "9",
            "9 years",
            "rule72ApproxYears\":9"
          ],
          "primaryMisconceptionId": "MC_FIN_TIME_VALUE_OF_MONEY_COMPOUND_INTEREST",
          "diagnosisMap": {
            "8": {
              "misconceptionId": "MC_FIN_TIME_VALUE_OF_MONEY_COMPOUND_INTEREST",
              "errorExplanation": "72 / 8 = 9 years.",
              "recoveryPath": {
                "simplerExplanation": "72 / 8 = 9.",
                "guidedFixPrompt": "Type 9"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 3,
    "title": "Time Value of Money (TVM): Discounting & Present Value ($PV$)",
    "overviewMetaphor": "Discounting is Shrinking a Distant Giant Down to Its True Size: a promise of receiving $133,100 three years from now sounds huge; but if money earns 10% a year in a safe bank, that future $133,100 is worth exactly $100,000 today; Discounting takes future cash flows and shrinks them backward in time ($PV = \\frac{FV}{(1 + r)^n}$) so you can compare whether an investment today is worth its future promises.",
    "blocks": [
      {
        "id": "fin-d3-b1-present-value-discounting-formula",
        "day": 3,
        "blockNumber": 1,
        "title": "Present Value Discounting Equation: $PV = \\frac{FV}{(1 + r)^n}$",
        "conceptBudget": {
          "primaryConcept": "Present Value Discounting Formula",
          "supportingTerms": [
            "$PV = \\frac{FV}{(1 + r)^n} = FV \\times (1 + r)^{-n}$",
            "Discount Rate ($r$: Required return / opportunity cost of capital)",
            "Discount Factor ($DF = \\frac{1}{(1 + r)^n}$)",
            "Inverse relationship between Discount Rate and Present Value"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d2-b1-future-value-single-cash-flow",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Discounting Backward in Time ($133.1k @ 10%)",
              "boxes": [
                {
                  "label": "Year 3 Promise",
                  "value": "$133,100 in the future",
                  "varType": "Future Cash",
                  "isUpdated": false
                },
                {
                  "label": "Discount Factor (1.10^-3)",
                  "value": "DF = 1 / 1.331 = 0.751315",
                  "varType": "Discount Factor",
                  "isUpdated": false
                },
                {
                  "label": "Present Value (Today)",
                  "value": "$133,100 x 0.751315 = EXACTLY $100,000 Today!",
                  "varType": "Present Value",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "pv_calc_demo.js",
            "initialCode": "function calculatePresentValue(fv, rPct, n) {\n  const r = rPct / 100;\n  const df = 1 / Math.pow(1 + r, n);\n  const pv = fv * df;\n  return {\n    futureValue: fv,\n    discountRatePercent: rPct,\n    discountFactor: Number(df.toFixed(6)),\n    presentValue: Number(pv.toFixed(2)),\n    status: 'PRESENT_VALUE_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculatePresentValue(133100, 10, 3)));",
            "expectedOutput": "{\"futureValue\":133100,\"discountRatePercent\":10,\"discountFactor\":0.751315,\"presentValue\":100000,\"status\":\"PRESENT_VALUE_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Present Value of $133,100 to be received 3 years from now at a 10% discount rate ($133100 / 1.10^3$)?",
          "expectedStringOutput": "100000",
          "acceptableAnswers": [
            "100000",
            "$100,000",
            "presentValue\":100000"
          ],
          "primaryMisconceptionId": "MC_FIN_PRESENT_VALUE_DISCOUNTING_CASH_FLOWS",
          "diagnosisMap": {
            "133100": {
              "misconceptionId": "MC_FIN_PRESENT_VALUE_DISCOUNTING_CASH_FLOWS",
              "errorExplanation": "Must discount by 1.10^3 = 1.331 -> $100,000.",
              "recoveryPath": {
                "simplerExplanation": "133100 / 1.331 = 100000.",
                "guidedFixPrompt": "Type 100000"
              }
            }
          }
        }
      },
      {
        "id": "fin-d3-b2-discounting-uneven-cash-flows",
        "day": 3,
        "blockNumber": 2,
        "title": "Discounting Uneven Cash Flow Streams ($PV = \\sum \\frac{CF_t}{(1 + r)^t}$)",
        "conceptBudget": {
          "primaryConcept": "Discounting Uneven Cash Streams",
          "supportingTerms": [
            "Multiple Cash Flows ($CF_1, CF_2, \\dots, CF_n$)",
            "Period-by-period discounting",
            "Linear Additivity of Present Values ($PV(\\text{Total}) = \\sum PV(CF_t)$)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d3-b1-present-value-discounting-formula",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Uneven Cash Flow Discounting Loop",
            "codeSnippet": "const cfs = [10000, 20000, 30000]; // Cash flows in Y1, Y2, Y3\nconst r = 0.10; // 10% discount rate\nlet totalPv = 0;\nfor (let t = 1; t <= cfs.length; t++) {\n  totalPv += cfs[t - 1] / Math.pow(1 + r, t);\n} // 10k/1.1 + 20k/1.21 + 30k/1.331 = $48,159.28",
            "lineNotes": {
              "1": "Uneven annual stream.",
              "5": "Discounts each flow to time 0."
            }
          },
          {
            "type": "runnable_code",
            "filename": "uneven_pv_demo.js",
            "initialCode": "function discountUnevenStream(cfs, rPct) {\n  const r = rPct / 100;\n  let totalPv = 0;\n  cfs.forEach((cf, idx) => {\n    totalPv += cf / Math.pow(1 + r, idx + 1);\n  });\n  return {\n    cashFlowStream: cfs,\n    totalPresentValue: Number(totalPv.toFixed(2)),\n    status: 'UNEVEN_STREAM_DISCOUNTED'\n  };\n}\n\nconsole.log(JSON.stringify(discountUnevenStream([10000, 20000, 30000], 10)));",
            "expectedOutput": "{\"cashFlowStream\":[10000,20000,30000],\"totalPresentValue\":48159.28,\"status\":\"UNEVEN_STREAM_DISCOUNTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the total Present Value of receiving $10,000 in Year 1, $20,000 in Year 2, and $30,000 in Year 3 at a 10% discount rate?",
          "expectedStringOutput": "48159.28",
          "acceptableAnswers": [
            "48159.28",
            "$48,159.28",
            "totalPresentValue\":48159.28"
          ],
          "primaryMisconceptionId": "MC_FIN_PRESENT_VALUE_DISCOUNTING_CASH_FLOWS",
          "diagnosisMap": {
            "60000": {
              "misconceptionId": "MC_FIN_PRESENT_VALUE_DISCOUNTING_CASH_FLOWS",
              "errorExplanation": "$60,000 is nominal un-discounted sum. Discounted present value is $48,159.28.",
              "recoveryPath": {
                "simplerExplanation": "Discounted sum is 48159.28.",
                "guidedFixPrompt": "Type 48159.28"
              }
            }
          }
        }
      },
      {
        "id": "fin-d3-b3-discount-rate-risk-relationship",
        "day": 3,
        "blockNumber": 3,
        "title": "Risk-Adjusted Discount Rates & Opportunity Cost of Capital",
        "conceptBudget": {
          "primaryConcept": "Risk-Adjusted Discounting Invariant",
          "supportingTerms": [
            "Risk-Free Rate ($R_f$) + Risk Premium ($RP$)",
            "Higher Risk $\\implies$ Higher Discount Rate $\\implies$ Lower Present Value!",
            "Hurdle Rate for Capital Investment"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d3-b2-discounting-uneven-cash-flows",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "risk_rate_demo.js",
            "initialCode": "function evaluateRiskDiscounting(isHighRisk) {\n  return isHighRisk\n    ? 'HIGHER_DISCOUNT_RATE_LOWERS_PRESENT_VALUE'\n    : 'LOWER_DISCOUNT_RATE_PRESERVES_HIGHER_VALUE';\n}\n\nconsole.log(evaluateRiskDiscounting(true));\nconsole.log(evaluateRiskDiscounting(false));",
            "expectedOutput": "HIGHER_DISCOUNT_RATE_LOWERS_PRESENT_VALUE\nLOWER_DISCOUNT_RATE_PRESERVES_HIGHER_VALUE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What effect does assigning a higher risk-adjusted discount rate have on the Present Value of a future cash flow?",
          "expectedStringOutput": "HIGHER_DISCOUNT_RATE_LOWERS_PRESENT_VALUE",
          "acceptableAnswers": [
            "HIGHER_DISCOUNT_RATE_LOWERS_PRESENT_VALUE",
            "Lowers PV",
            "Reduces Present Value"
          ],
          "primaryMisconceptionId": "MC_FIN_PRESENT_VALUE_DISCOUNTING_CASH_FLOWS",
          "diagnosisMap": {
            "INCREASES": {
              "misconceptionId": "MC_FIN_PRESENT_VALUE_DISCOUNTING_CASH_FLOWS",
              "errorExplanation": "Discount rate is in the denominator: higher rate reduces present value.",
              "recoveryPath": {
                "simplerExplanation": "Higher rate lowers present value.",
                "guidedFixPrompt": "Type HIGHER_DISCOUNT_RATE_LOWERS_PRESENT_VALUE"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 4,
    "title": "Annuities & Loan Amortization: Ordinary Annuity, Annuity Due & EMI",
    "overviewMetaphor": "An Annuity is a Regular Water Dripper That Dispenses Exactly One Cup of Water Every Hour: an Ordinary Annuity gives you the water at the END of each hour (like salary paid at month end); an Annuity Due gives you the water at the BEGINNING of each hour (like house rent paid in advance); because you get the water earlier in an Annuity Due, you earn one extra period of interest ($PVA_{\\text{due}} = PVA \\times (1 + r)$); Loan EMI divides your debt into equal monthly drips that pay down both interest and principal.",
    "blocks": [
      {
        "id": "fin-d4-b1-ordinary-annuity-vs-annuity-due",
        "day": 4,
        "blockNumber": 1,
        "title": "Ordinary Annuity vs Annuity Due Equations",
        "conceptBudget": {
          "primaryConcept": "Annuity Timing & Present Value",
          "supportingTerms": [
            "Ordinary Annuity ($PV = PMT \\times \\left[\\frac{1 - (1+r)^{-n}}{r}\\right]$: Payments at period end)",
            "Annuity Due ($PV_{\\text{due}} = PV_{\\text{ord}} \\times (1 + r)$: Payments at period start)",
            "Present Value Annuity Factor (PVAF)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d3-b1-present-value-discounting-formula",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Annuity Timing Comparison ($10k/yr for 3 Yrs @ 10%)",
              "boxes": [
                {
                  "label": "Ordinary Annuity (End of Period)",
                  "value": "PV = $10k x ((1 - 1.1^-3)/0.10) = $10k x 2.48685 = $24,868.52",
                  "varType": "Ordinary PV",
                  "isUpdated": false
                },
                {
                  "label": "Annuity Due (Start of Period)",
                  "value": "PV = $24,868.52 x 1.10 = $27,355.37 (One extra compounding period!)",
                  "varType": "Annuity Due PV",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "annuity_calc_demo.js",
            "initialCode": "function calculateAnnuityPv(pmt, rPct, n) {\n  const r = rPct / 100;\n  const pvaf = (1 - Math.pow(1 + r, -n)) / r;\n  const ordinaryPv = pmt * pvaf;\n  const duePv = ordinaryPv * (1 + r);\n  return {\n    periodicPayment: pmt,\n    ordinaryAnnuityPv: Number(ordinaryPv.toFixed(2)),\n    annuityDuePv: Number(duePv.toFixed(2)),\n    status: 'ANNUITIES_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateAnnuityPv(10000, 10, 3)));",
            "expectedOutput": "{\"periodicPayment\":10000,\"ordinaryAnnuityPv\":24868.52,\"annuityDuePv\":27355.37,\"status\":\"ANNUITIES_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Present Value of an Ordinary Annuity paying $10,000 annually for 3 years at a 10% discount rate?",
          "expectedStringOutput": "24868.52",
          "acceptableAnswers": [
            "24868.52",
            "$24,868.52",
            "ordinaryAnnuityPv\":24868.52"
          ],
          "primaryMisconceptionId": "MC_FIN_ANNUITY_ORDINARY_VS_DUE_CALCULATION",
          "diagnosisMap": {
            "30000": {
              "misconceptionId": "MC_FIN_ANNUITY_ORDINARY_VS_DUE_CALCULATION",
              "errorExplanation": "$30,000 is un-discounted sum. Present value of annuity is $24,868.52.",
              "recoveryPath": {
                "simplerExplanation": "Discounted annuity is 24868.52.",
                "guidedFixPrompt": "Type 24868.52"
              }
            }
          }
        }
      },
      {
        "id": "fin-d4-b2-perpetuity-and-growing-perpetuity",
        "day": 4,
        "blockNumber": 2,
        "title": "Perpetuity ($PV = \\frac{PMT}{r}$) & Growing Perpetuity ($PV = \\frac{PMT_1}{r - g}$)",
        "conceptBudget": {
          "primaryConcept": "Perpetuity Valuation Formulas",
          "supportingTerms": [
            "Perpetuity: Infinite equal periodic cash flow stream ($PV = \\frac{PMT}{r}$)",
            "Growing Perpetuity: Cash flows growing at constant rate $g$ ($PV = \\frac{PMT_1}{r - g}$ where $r > g$)",
            "Preferred Stock & Real Estate Ground Leases"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d4-b1-ordinary-annuity-vs-annuity-due",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Perpetuity vs Growing Perpetuity Math",
            "codeSnippet": "// Flat Perpetuity: $10,000 per year forever @ 10% discount rate:\n// PV = 10,000 / 0.10 = $100,000\n// Growing Perpetuity: $10,000 next year, growing at 3% forever @ 10% rate:\n// PV = 10,000 / (0.10 - 0.03) = 10,000 / 0.07 = $142,857.14",
            "lineNotes": {
              "2": "Flat perpetuity formula.",
              "4": "Growing perpetuity formula."
            }
          },
          {
            "type": "runnable_code",
            "filename": "perpetuity_calc_demo.js",
            "initialCode": "function evaluatePerpetuities(pmt, rPct, gPct = 3) {\n  const r = rPct / 100;\n  const g = gPct / 100;\n  const flatPv = pmt / r;\n  const growingPv = pmt / (r - g);\n  return {\n    annualPayment: pmt,\n    flatPerpetuityPv: Math.round(flatPv),\n    growingPerpetuityPv: Number(growingPv.toFixed(2)),\n    status: 'PERPETUITY_VALUED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluatePerpetuities(10000, 10, 3)));",
            "expectedOutput": "{\"annualPayment\":10000,\"flatPerpetuityPv\":100000,\"growingPerpetuityPv\":142857.14,\"status\":\"PERPETUITY_VALUED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Present Value of a flat perpetuity paying $10,000 per year forever at a 10% discount rate ($10000 / 0.10$)?",
          "expectedStringOutput": "100000",
          "acceptableAnswers": [
            "100000",
            "$100,000",
            "flatPerpetuityPv\":100000"
          ],
          "primaryMisconceptionId": "MC_FIN_ANNUITY_ORDINARY_VS_DUE_CALCULATION",
          "diagnosisMap": {
            "10000": {
              "misconceptionId": "MC_FIN_ANNUITY_ORDINARY_VS_DUE_CALCULATION",
              "errorExplanation": "10,000 / 0.10 = $100,000.",
              "recoveryPath": {
                "simplerExplanation": "10000 / 0.10 = 100000.",
                "guidedFixPrompt": "Type 100000"
              }
            }
          }
        }
      },
      {
        "id": "fin-d4-b3-loan-emi-amortization-schedule",
        "day": 4,
        "blockNumber": 3,
        "title": "Loan Amortization Mechanics & EMI Interest Breakdown",
        "conceptBudget": {
          "primaryConcept": "Loan Amortization & EMI Equation",
          "supportingTerms": [
            "$EMI = \\frac{P \\cdot r \\cdot (1 + r)^n}{(1 + r)^n - 1}$",
            "Interest Component (Highest in early months, decreases over time)",
            "Principal Repayment Component (Lowest in early months, increases over time)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d4-b2-perpetuity-and-growing-perpetuity",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "emi_amort_demo.js",
            "initialCode": "function evaluateAmortizationSplit(principal, monthlyRate, emi) {\n  const month1Interest = principal * monthlyRate;\n  const month1Principal = emi - month1Interest;\n  return {\n    monthlyEmi: emi,\n    month1InterestPortion: Number(month1Interest.toFixed(2)),\n    month1PrincipalPortion: Number(month1Principal.toFixed(2)),\n    status: 'AMORTIZATION_SPLIT_EVALUATED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateAmortizationSplit(100000, 0.01, 8884.88)));",
            "expectedOutput": "{\"monthlyEmi\":8884.88,\"month1InterestPortion\":1000,\"month1PrincipalPortion\":7884.88,\"status\":\"AMORTIZATION_SPLIT_EVALUATED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "In Month 1 of a $100,000 loan at 1% monthly interest with an $8,884.88 EMI, how much of the payment goes toward interest ($100000 \\times 0.01$)?",
          "expectedStringOutput": "1000",
          "acceptableAnswers": [
            "1000",
            "$1,000",
            "1000.00",
            "month1InterestPortion\":1000"
          ],
          "primaryMisconceptionId": "MC_FIN_ANNUITY_ORDINARY_VS_DUE_CALCULATION",
          "diagnosisMap": {
            "8884.88": {
              "misconceptionId": "MC_FIN_ANNUITY_ORDINARY_VS_DUE_CALCULATION",
              "errorExplanation": "$8,884.88 is the total EMI. Interest in month 1 is $100,000 * 1% = $1,000.",
              "recoveryPath": {
                "simplerExplanation": "100,000 * 0.01 = 1,000.",
                "guidedFixPrompt": "Type 1000"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 5,
    "title": "⭐ MILESTONE 1: Complete Time Value of Money & Financial Valuation Engine",
    "overviewMetaphor": "Milestone 1 Synthesis: The complete sovereign Time Value of Money (TVM) math and financial valuation engine: 1. Multi-period compounding and future value expansion; 2. Uneven cash flow discounting; 3. Ordinary and due annuities; 4. Loan amortization and perpetuity valuation.",
    "blocks": [
      {
        "id": "fin-d5-b1-tvm-engine-synthesis",
        "day": 5,
        "blockNumber": 1,
        "title": "Time Value of Money (TVM) Master Kernel Synthesis",
        "conceptBudget": {
          "primaryConcept": "TVM Engine Synthesis",
          "supportingTerms": [
            "Compounding Engine",
            "Discounting Engine",
            "Annuity Calculator",
            "Amortization Scheduler"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d4-b3-loan-emi-amortization-schedule",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Milestone 1 TVM Financial Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "Inputs Principal ($100k), Rate (10%), Time (3 Yrs)",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Calculates Future Value compound growth ($133,100)",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Discounts uneven future cash streams to Present Value ($48,159)",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Generates Ordinary Annuity & Loan Amortization schedules!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "tvm_kernel_demo.js",
            "initialCode": "function runTvmEngine() {\n  return {\n    futureValueSubsystem: 'ONLINE_COMPOUNDING_ACTIVE',\n    presentValueSubsystem: 'ONLINE_DISCOUNTING_ACTIVE',\n    annuitySubsystem: 'ONLINE_ORDINARY_AND_DUE_ACTIVE',\n    amortizationSubsystem: 'ONLINE_EMI_SCHEDULER_ACTIVE',\n    engineStatus: 'TVM_MASTER_VALUATION_ENGINE_ACTIVE'\n  };\n}\n\nconsole.log(runTvmEngine().engineStatus);",
            "expectedOutput": "TVM_MASTER_VALUATION_ENGINE_ACTIVE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What engine status confirms active operational synthesis of the TVM Master Valuation Engine?",
          "expectedStringOutput": "TVM_MASTER_VALUATION_ENGINE_ACTIVE",
          "acceptableAnswers": [
            "TVM_MASTER_VALUATION_ENGINE_ACTIVE",
            "engineStatus: TVM_MASTER_VALUATION_ENGINE_ACTIVE"
          ],
          "primaryMisconceptionId": "MC_FIN_TIME_VALUE_OF_MONEY_COMPOUND_INTEREST",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_FIN_TIME_VALUE_OF_MONEY_COMPOUND_INTEREST",
              "errorExplanation": "Matches TVM_MASTER_VALUATION_ENGINE_ACTIVE.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type TVM_MASTER_VALUATION_ENGINE_ACTIVE"
              }
            }
          }
        }
      },
      {
        "id": "fin-d5-b2-tvm-engine-audit",
        "day": 5,
        "blockNumber": 2,
        "title": "TVM Invariant Verification & Precision Audit",
        "conceptBudget": {
          "primaryConcept": "TVM Invariant Verification",
          "supportingTerms": [
            "Compounding Invariant",
            "Discounting Invariant",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d5-b1-tvm-engine-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "tvm_audit_demo.js",
            "initialCode": "function auditTvmEngine(fvValid, pvValid, annuityValid) {\n  const passed = fvValid && pvValid && annuityValid;\n  return {\n    fvVerified: fvValid,\n    pvVerified: pvValid,\n    annuityVerified: annuityValid,\n    grade: passed ? 'TVM_VALUATION_ENGINE_AUDIT_PASSED' : 'AUDIT_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditTvmEngine(true, true, true)));",
            "expectedOutput": "{\"fvVerified\":true,\"pvVerified\":true,\"annuityVerified\":true,\"grade\":\"TVM_VALUATION_ENGINE_AUDIT_PASSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade is awarded when Future Value, Present Value, and Annuity calculations pass 100%?",
          "expectedStringOutput": "TVM_VALUATION_ENGINE_AUDIT_PASSED",
          "acceptableAnswers": [
            "TVM_VALUATION_ENGINE_AUDIT_PASSED",
            "grade\":\"TVM_VALUATION_ENGINE_AUDIT_PASSED\""
          ],
          "primaryMisconceptionId": "MC_FIN_TIME_VALUE_OF_MONEY_COMPOUND_INTEREST",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_FIN_TIME_VALUE_OF_MONEY_COMPOUND_INTEREST",
              "errorExplanation": "All checks passing awards TVM_VALUATION_ENGINE_AUDIT_PASSED.",
              "recoveryPath": {
                "simplerExplanation": "Awards TVM_VALUATION_ENGINE_AUDIT_PASSED.",
                "guidedFixPrompt": "Type TVM_VALUATION_ENGINE_AUDIT_PASSED"
              }
            }
          }
        }
      },
      {
        "id": "fin-d5-b3-milestone1-finance-cert",
        "day": 5,
        "blockNumber": 3,
        "title": "Milestone 1 TVM Financial Engine Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 1 Certification",
          "supportingTerms": [
            "TVM Engine Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d5-b2-tvm-engine-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone1_fin_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 1: Complete Time Value of Money & Financial Valuation Engine [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 1: Complete Time Value of Money & Financial Valuation Engine [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 1 completion?",
          "expectedStringOutput": "⭐ MILESTONE 1: Complete Time Value of Money & Financial Valuation Engine [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 1: Complete Time Value of Money & Financial Valuation Engine [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_FIN_TIME_VALUE_OF_MONEY_COMPOUND_INTEREST",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_FIN_TIME_VALUE_OF_MONEY_COMPOUND_INTEREST",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 1: Complete Time Value of Money & Financial Valuation Engine [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 6,
    "title": "Bond Valuation: Pricing Fixed Income Securities & Coupon Pricing",
    "overviewMetaphor": "A Bond is an I.O.U. Note with Attached Gift Cards: when you lend $1,000 to the government, they give you a Bond certificate with 5 annual coupon cards worth $100 each, plus a promise to return your full $1,000 principal at maturity; Bond Pricing is discounting each annual $100 coupon plus the final $1,000 repayment back to today's present value; if interest rates in the market rise to 12%, your 10% bond looks unattractive, so its price drops below $1,000 (Discount Bond); if market rates drop to 8%, your 10% bond is attractive, so its price rises above $1,000 (Premium Bond).",
    "blocks": [
      {
        "id": "fin-d6-b1-bond-valuation-equation",
        "day": 6,
        "blockNumber": 1,
        "title": "The Bond Valuation Formula: Coupon Annuity + Face Value Discounting",
        "conceptBudget": {
          "primaryConcept": "Bond Valuation Formula",
          "supportingTerms": [
            "$V_0 = \\sum_{t=1}^n \\frac{C}{(1 + k_d)^t} + \\frac{M}{(1 + k_d)^n}$",
            "$C$ (Annual coupon payment = Face Value $\\times$ Coupon Rate)",
            "$M$ (Maturity Face Value e.g. $1,000)",
            "$k_d$ (Market required yield / discount rate)",
            "Inverse Price-Yield Relationship"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d4-b1-ordinary-annuity-vs-annuity-due",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Bond Cash Flow Stream ($1,000 Par, 10% Coupon, 3 Yrs @ 10%)",
              "boxes": [
                {
                  "label": "Coupons Annuity (Y1, Y2, Y3)",
                  "value": "PV of 3 x $100 coupons @ 10% = $100 x 2.48685 = $248.69",
                  "varType": "Coupon Stream",
                  "isUpdated": false
                },
                {
                  "label": "Maturity Principal (Y3)",
                  "value": "PV of $1,000 @ 10% = $1,000 / 1.331 = $751.31",
                  "varType": "Principal Repayment",
                  "isUpdated": false
                },
                {
                  "label": "Total Intrinsic Price",
                  "value": "$248.69 + $751.31 = EXACTLY $1,000.00 Par Bond!",
                  "varType": "Bond Price",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "bond_val_demo.js",
            "initialCode": "function calculateBondValue(m, couponRatePct, marketYieldPct, n) {\n  const c = m * (couponRatePct / 100);\n  const kd = marketYieldPct / 100;\n  let pvCoupons = 0;\n  for (let t = 1; t <= n; t++) {\n    pvCoupons += c / Math.pow(1 + kd, t);\n  }\n  const pvMaturity = m / Math.pow(1 + kd, n);\n  const price = pvCoupons + pvMaturity;\n  return {\n    annualCoupon: c,\n    pvOfCoupons: Number(pvCoupons.toFixed(2)),\n    pvOfMaturity: Number(pvMaturity.toFixed(2)),\n    bondPrice: Number(price.toFixed(2)),\n    status: 'BOND_VALUE_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateBondValue(1000, 10, 10, 3)));",
            "expectedOutput": "{\"annualCoupon\":100,\"pvOfCoupons\":248.69,\"pvOfMaturity\":751.31,\"bondPrice\":1000,\"status\":\"BOND_VALUE_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the intrinsic price of a 3-year $1,000 par bond paying a 10% annual coupon when the market required yield is also 10%?",
          "expectedStringOutput": "1000",
          "acceptableAnswers": [
            "1000",
            "$1,000",
            "1000.00",
            "bondPrice\":1000"
          ],
          "primaryMisconceptionId": "MC_FIN_BOND_VALUATION_YIELD_TO_MATURITY_YTM",
          "diagnosisMap": {
            "1300": {
              "misconceptionId": "MC_FIN_BOND_VALUATION_YIELD_TO_MATURITY_YTM",
              "errorExplanation": "$1,300 is nominal un-discounted cash flow. When coupon rate equals market yield, bond trades at exact par = $1,000.",
              "recoveryPath": {
                "simplerExplanation": "Coupon rate = Yield -> Trades at Par = 1000.",
                "guidedFixPrompt": "Type 1000"
              }
            }
          }
        }
      },
      {
        "id": "fin-d6-b2-par-premium-discount-bonds",
        "day": 6,
        "blockNumber": 2,
        "title": "Par, Premium & Discount Bonds: Coupon Rate vs Market Yield Dynamics",
        "conceptBudget": {
          "primaryConcept": "Bond Pricing States",
          "supportingTerms": [
            "Par Bond ($k_d = \\text{Coupon Rate} \\implies \\text{Price} = M$)",
            "Premium Bond ($k_d < \\text{Coupon Rate} \\implies \\text{Price} > M$)",
            "Discount Bond ($k_d > \\text{Coupon Rate} \\implies \\text{Price} < M$)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d6-b1-bond-valuation-equation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Bond Pricing States Mapping",
            "codeSnippet": "// If Market Yield = 10%, Coupon = 12% -> Yield < Coupon -> PREMIUM BOND (Price = $1,049.74)\n// If Market Yield = 10%, Coupon = 10% -> Yield = Coupon -> PAR BOND (Price = $1,000.00)\n// If Market Yield = 10%, Coupon = 8%  -> Yield > Coupon -> DISCOUNT BOND (Price = $950.26)",
            "lineNotes": {
              "1": "Higher coupon attracts premium.",
              "2": "Equal coupon trades at par.",
              "3": "Lower coupon trades at discount."
            }
          },
          {
            "type": "runnable_code",
            "filename": "pricing_states_demo.js",
            "initialCode": "function evaluateBondPricingState(couponRate, marketYield) {\n  if (couponRate > marketYield) return 'PREMIUM_BOND_PRICE_EXCEEDS_PAR';\n  if (couponRate < marketYield) return 'DISCOUNT_BOND_PRICE_BELOW_PAR';\n  return 'PAR_BOND_PRICE_EQUALS_PAR';\n}\n\nconsole.log(evaluateBondPricingState(12, 10));\nconsole.log(evaluateBondPricingState(8, 10));\nconsole.log(evaluateBondPricingState(10, 10));",
            "expectedOutput": "PREMIUM_BOND_PRICE_EXCEEDS_PAR\nDISCOUNT_BOND_PRICE_BELOW_PAR\nPAR_BOND_PRICE_EQUALS_PAR",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What pricing state occurs when a bond's coupon rate (12%) is higher than the prevailing market yield (10%)?",
          "expectedStringOutput": "PREMIUM_BOND_PRICE_EXCEEDS_PAR",
          "acceptableAnswers": [
            "PREMIUM_BOND_PRICE_EXCEEDS_PAR",
            "Premium Bond",
            "Premium"
          ],
          "primaryMisconceptionId": "MC_FIN_BOND_VALUATION_YIELD_TO_MATURITY_YTM",
          "diagnosisMap": {
            "DISCOUNT": {
              "misconceptionId": "MC_FIN_BOND_VALUATION_YIELD_TO_MATURITY_YTM",
              "errorExplanation": "Paying higher than market rates makes the bond attractive, trading at a premium.",
              "recoveryPath": {
                "simplerExplanation": "Coupon > Yield -> Premium Bond.",
                "guidedFixPrompt": "Type PREMIUM_BOND_PRICE_EXCEEDS_PAR"
              }
            }
          }
        }
      },
      {
        "id": "fin-d6-b3-zero-coupon-bonds-pricing",
        "day": 6,
        "blockNumber": 3,
        "title": "Zero Coupon Bonds (Deep Discount Bonds) Pricing",
        "conceptBudget": {
          "primaryConcept": "Zero Coupon Bond Pricing",
          "supportingTerms": [
            "Zero periodic coupon payments ($C = 0$)",
            "Issued at steep discount, redeemed at full par face value",
            "$V_0 = \\frac{M}{(1 + k_d)^n}$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d6-b2-par-premium-discount-bonds",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "zcb_calc_demo.js",
            "initialCode": "function priceZcb(faceValue, yieldPct, years) {\n  const price = faceValue / Math.pow(1 + yieldPct / 100, years);\n  return {\n    faceValue,\n    yearsToMaturity: years,\n    yieldPercent: yieldPct,\n    zeroCouponPrice: Number(price.toFixed(2)),\n    status: 'ZERO_COUPON_BOND_PRICED'\n  };\n}\n\nconsole.log(JSON.stringify(priceZcb(1000, 10, 2)));",
            "expectedOutput": "{\"faceValue\":1000,\"yearsToMaturity\":2,\"yieldPercent\":10,\"zeroCouponPrice\":826.45,\"status\":\"ZERO_COUPON_BOND_PRICED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the price of a 2-year $1,000 face value Zero Coupon Bond yielding 10% ($1000 / 1.10^2$)?",
          "expectedStringOutput": "826.45",
          "acceptableAnswers": [
            "826.45",
            "$826.45",
            "zeroCouponPrice\":826.45"
          ],
          "primaryMisconceptionId": "MC_FIN_BOND_VALUATION_YIELD_TO_MATURITY_YTM",
          "diagnosisMap": {
            "1000": {
              "misconceptionId": "MC_FIN_BOND_VALUATION_YIELD_TO_MATURITY_YTM",
              "errorExplanation": "Zero coupon bonds are issued at a deep discount: 1000 / 1.21 = $826.45.",
              "recoveryPath": {
                "simplerExplanation": "1000 / 1.21 = 826.45.",
                "guidedFixPrompt": "Type 826.45"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 7,
    "title": "Yield to Maturity (YTM) & Bond Yield Approximation",
    "overviewMetaphor": "Yield to Maturity (YTM) is the True Annualized Miles-Per-Gallon of a Bond: if you buy a $1,000 bond at a bargain discount of $950 with a $100 annual coupon, your total return consists of two engines: 1. The steady $100 annual coupon checks; 2. The $50 capital gain you pocket when the bond matures for $1,000; YTM combines both cash flow engines into a single annualized yield percentage (11.28%).",
    "blocks": [
      {
        "id": "fin-d7-b1-ytm-concept-and-definition",
        "day": 7,
        "blockNumber": 1,
        "title": "Yield to Maturity (YTM) Definition & The Internal Rate of Return of a Bond",
        "conceptBudget": {
          "primaryConcept": "Yield to Maturity (YTM) Invariant",
          "supportingTerms": [
            "YTM is the single discount rate where $PV(\\text{Coupons} + \\text{Principal}) = \\text{Market Price}$",
            "Assumes bond is held to maturity",
            "Assumes all coupons are reinvested at the same YTM rate (Reinvestment Risk)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d6-b1-bond-valuation-equation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "YTM Internal Rate of Return Equilibrium",
              "boxes": [
                {
                  "label": "Market Purchase Price",
                  "value": "Paid $950 today (Discount bond purchase)",
                  "varType": "Cash Outflow",
                  "isUpdated": false
                },
                {
                  "label": "Future Cash Flows",
                  "value": "$100/yr coupons for 5 years + $1,000 Face Value at maturity",
                  "varType": "Cash Inflows",
                  "isUpdated": false
                },
                {
                  "label": "YTM Equilibrium Rate",
                  "value": "Discount rate where PV(Inflows) = $950 -> YTM = 11.28%!",
                  "varType": "Annualized Yield",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "ytm_concept_demo.js",
            "initialCode": "function evaluateYtmConcept() {\n  return 'YTM_IS_THE_INTERNAL_RATE_OF_RETURN_EQUATING_PV_TO_MARKET_PRICE';\n}\n\nconsole.log(evaluateYtmConcept());",
            "expectedOutput": "YTM_IS_THE_INTERNAL_RATE_OF_RETURN_EQUATING_PV_TO_MARKET_PRICE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What financial rate equates the present value of a bond's future cash flows to its current market price?",
          "expectedStringOutput": "YTM_IS_THE_INTERNAL_RATE_OF_RETURN_EQUATING_PV_TO_MARKET_PRICE",
          "acceptableAnswers": [
            "YTM_IS_THE_INTERNAL_RATE_OF_RETURN_EQUATING_PV_TO_MARKET_PRICE",
            "Yield to Maturity",
            "YTM"
          ],
          "primaryMisconceptionId": "MC_FIN_BOND_VALUATION_YIELD_TO_MATURITY_YTM",
          "diagnosisMap": {
            "COUPON": {
              "misconceptionId": "MC_FIN_BOND_VALUATION_YIELD_TO_MATURITY_YTM",
              "errorExplanation": "Coupon rate is the fixed interest. YTM is the internal rate of return equating PV to market price.",
              "recoveryPath": {
                "simplerExplanation": "Equating rate is Yield to Maturity (YTM).",
                "guidedFixPrompt": "Type YTM_IS_THE_INTERNAL_RATE_OF_RETURN_EQUATING_PV_TO_MARKET_PRICE"
              }
            }
          }
        }
      },
      {
        "id": "fin-d7-b2-ytm-approximation-formula",
        "day": 7,
        "blockNumber": 2,
        "title": "The YTM Approximation Formula: $\\text{YTM} \\approx \\frac{C + \\frac{M - P}{n}}{\\frac{M + P}{2}}$",
        "conceptBudget": {
          "primaryConcept": "YTM Approximation Formula",
          "supportingTerms": [
            "Numerator: Annual Coupon $C$ + Annualized Capital Gain/Loss $\\frac{M - P}{n}$",
            "Denominator: Average Investment Value $\\frac{M + P}{2}$",
            "$\\text{Approx YTM} = \\frac{C + (M - P)/n}{(M + P)/2} \\times 100\\%$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d7-b1-ytm-concept-and-definition",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "YTM Approximation Math ($1k Face, $950 Price, 10% Coupon, 5 Yrs)",
            "codeSnippet": "C = $100 | M = $1,000 | P = $950 | n = 5\nNumerator = 100 + (1000 - 950)/5 = 100 + 10 = $110\nDenominator = (1000 + 950)/2 = $975\nApprox YTM = (110 / 975) * 100 = 11.28%",
            "lineNotes": {
              "2": "Coupon plus amortized discount.",
              "3": "Average bond investment.",
              "4": "Approximate annualized yield."
            }
          },
          {
            "type": "runnable_code",
            "filename": "ytm_approx_demo.js",
            "initialCode": "function calculateApproximateYtm(m, p, couponPct, n) {\n  const c = m * (couponPct / 100);\n  const num = c + (m - p) / n;\n  const den = (m + p) / 2;\n  const ytm = (num / den) * 100;\n  return {\n    annualCoupon: c,\n    numeratorIncome: num,\n    averageInvestment: den,\n    approxYtmPercent: Number(ytm.toFixed(2)),\n    status: 'YTM_APPROXIMATION_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateApproximateYtm(1000, 950, 10, 5)));",
            "expectedOutput": "{\"annualCoupon\":100,\"numeratorIncome\":110,\"averageInvestment\":975,\"approxYtmPercent\":11.28,\"status\":\"YTM_APPROXIMATION_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the approximate YTM percentage for a 5-year $1,000 par bond with a 10% coupon trading at $950 ($ 110 / 975 \\times 100 $)?",
          "expectedStringOutput": "11.28",
          "acceptableAnswers": [
            "11.28",
            "11.28%",
            "approxYtmPercent\":11.28"
          ],
          "primaryMisconceptionId": "MC_FIN_BOND_VALUATION_YIELD_TO_MATURITY_YTM",
          "diagnosisMap": {
            "10.0": {
              "misconceptionId": "MC_FIN_BOND_VALUATION_YIELD_TO_MATURITY_YTM",
              "errorExplanation": "10% is the coupon rate. Buying at a discount ($950) increases total yield to 11.28%.",
              "recoveryPath": {
                "simplerExplanation": "110 / 975 * 100 = 11.28%.",
                "guidedFixPrompt": "Type 11.28"
              }
            }
          }
        }
      },
      {
        "id": "fin-d7-b3-current-yield-vs-ytm",
        "day": 7,
        "blockNumber": 3,
        "title": "Current Yield ($\\frac{C}{P}$) vs Yield to Maturity (YTM)",
        "conceptBudget": {
          "primaryConcept": "Current Yield vs YTM",
          "supportingTerms": [
            "$\\text{Current Yield} = \\frac{\\text{Annual Coupon}}{\\text{Current Market Price}} \\times 100\\%$",
            "Ignores capital gains/losses upon maturity",
            "Relationship: For discount bonds, $\\text{Coupon Rate} < \\text{Current Yield} < \\text{YTM}$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d7-b2-ytm-approximation-formula",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "current_yield_demo.js",
            "initialCode": "function evaluateYieldHierarchy(couponPct, price, m = 1000) {\n  const c = m * (couponPct / 100);\n  const cy = (c / price) * 100;\n  return {\n    couponRatePercent: couponPct,\n    currentYieldPercent: Number(cy.toFixed(2)),\n    discountHierarchy: 'COUPON_RATE < CURRENT_YIELD < YTM',\n    status: 'YIELD_HIERARCHY_EVALUATED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateYieldHierarchy(10, 950)));",
            "expectedOutput": "{\"couponRatePercent\":10,\"currentYieldPercent\":10.53,\"discountHierarchy\":\"COUPON_RATE < CURRENT_YIELD < YTM\",\"status\":\"YIELD_HIERARCHY_EVALUATED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Current Yield percentage for a $1,000 par bond with a $100 annual coupon trading at $950 ($100 / 950 \\times 100$)?",
          "expectedStringOutput": "10.53",
          "acceptableAnswers": [
            "10.53",
            "10.53%",
            "currentYieldPercent\":10.53"
          ],
          "primaryMisconceptionId": "MC_FIN_BOND_VALUATION_YIELD_TO_MATURITY_YTM",
          "diagnosisMap": {
            "10.0": {
              "misconceptionId": "MC_FIN_BOND_VALUATION_YIELD_TO_MATURITY_YTM",
              "errorExplanation": "Current yield is 100 / 950 = 10.53%.",
              "recoveryPath": {
                "simplerExplanation": "100 / 950 = 10.53%.",
                "guidedFixPrompt": "Type 10.53"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 8,
    "title": "Interest Rate Risk: Macaulay Duration & Modified Duration",
    "overviewMetaphor": "Duration is the Balance Fulcrum of a Bond Seesaw: if a bond pays all its money at maturity in Year 30 (Zero Coupon Bond), the fulcrum sits way out at 30 years—making the seesaw extremely sensitive to interest rate winds; if a bond pays heavy coupon cash flows in Years 1 and 2, the fulcrum shifts forward to 2.74 years—damping price swings; Modified Duration ($MD$) tells you the exact percentage drop in bond price if interest rates jump by 1%.",
    "blocks": [
      {
        "id": "fin-d8-b1-macaulay-duration-fulcrum",
        "day": 8,
        "blockNumber": 1,
        "title": "Macaulay Duration: Weighted Average Time to Cash Receipt",
        "conceptBudget": {
          "primaryConcept": "Macaulay Duration Formula",
          "supportingTerms": [
            "$D_{\\text{Mac}} = \\frac{\\sum_{t=1}^n \\frac{t \\cdot CF_t}{(1 + y)^t}}{\\text{Bond Price}}$",
            "Measured in Years",
            "Macaulay Duration of a Zero Coupon Bond is EXACTLY equal to its maturity $n$!"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d6-b1-bond-valuation-equation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Macaulay Duration Calculation ($1k Par, 10% Coupon, 3 Yrs @ 10%)",
              "boxes": [
                {
                  "label": "Year 1 Cash Flow ($100)",
                  "value": "PV = $90.91 | Weighted Time = 1 x $90.91 = $90.91",
                  "varType": "Y1 Weight",
                  "isUpdated": false
                },
                {
                  "label": "Year 2 Cash Flow ($100)",
                  "value": "PV = $82.64 | Weighted Time = 2 x $82.64 = $165.29",
                  "varType": "Y2 Weight",
                  "isUpdated": false
                },
                {
                  "label": "Year 3 Cash Flow ($1,100)",
                  "value": "PV = $826.45 | Weighted Time = 3 x $826.45 = $2,479.34",
                  "varType": "Y3 Weight",
                  "isUpdated": false
                },
                {
                  "label": "Macaulay Duration",
                  "value": "Sum = $2,735.54 / $1,000 Price = 2.74 Years!",
                  "varType": "Duration Output",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "macd_calc_demo.js",
            "initialCode": "function calculateMacaulayDuration(m, couponPct, yPct, n) {\n  const y = yPct / 100;\n  const c = m * (couponPct / 100);\n  let bondPrice = 0;\n  let weightedTime = 0;\n  for (let t = 1; t <= n; t++) {\n    const cf = (t === n) ? (c + m) : c;\n    const pv = cf / Math.pow(1 + y, t);\n    bondPrice += pv;\n    weightedTime += t * pv;\n  }\n  const macD = weightedTime / bondPrice;\n  return {\n    bondPrice: Number(bondPrice.toFixed(2)),\n    weightedTimeSum: Number(weightedTime.toFixed(2)),\n    macaulayDurationYears: Number(macD.toFixed(2)),\n    status: 'MACAULAY_DURATION_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateMacaulayDuration(1000, 10, 10, 3)));",
            "expectedOutput": "{\"bondPrice\":1000,\"weightedTimeSum\":2735.54,\"macaulayDurationYears\":2.74,\"status\":\"MACAULAY_DURATION_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Macaulay Duration (in years) of a 3-year $1,000 par bond paying a 10% annual coupon at a 10% market yield ($2735.54 / 1000$)?",
          "expectedStringOutput": "2.74",
          "acceptableAnswers": [
            "2.74",
            "2.74 years",
            "macaulayDurationYears\":2.74"
          ],
          "primaryMisconceptionId": "MC_FIN_FIXED_INCOME_MACAULAY_MODIFIED_DURATION",
          "diagnosisMap": {
            "3.0": {
              "misconceptionId": "MC_FIN_FIXED_INCOME_MACAULAY_MODIFIED_DURATION",
              "errorExplanation": "3.0 years is the maturity. Because coupons are received early in Y1 and Y2, duration is shortened to 2.74 years.",
              "recoveryPath": {
                "simplerExplanation": "Coupons shorten duration to 2.74 years.",
                "guidedFixPrompt": "Type 2.74"
              }
            }
          }
        }
      },
      {
        "id": "fin-d8-b2-modified-duration-price-volatility",
        "day": 8,
        "blockNumber": 2,
        "title": "Modified Duration & Percentage Price Volatility ($MD = \\frac{D_{\\text{Mac}}}{1 + y}$)",
        "conceptBudget": {
          "primaryConcept": "Modified Duration Volatility Formula",
          "supportingTerms": [
            "Modified Duration: $MD = \\frac{D_{\\text{Mac}}}{1 + y}$",
            "Percentage Price Change: $\\frac{\\Delta P}{P} \\approx -MD \\times \\Delta y$",
            "Basis Point Value (DV01 / PV01)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d8-b1-macaulay-duration-fulcrum",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Price Sensitivity with Modified Duration",
            "codeSnippet": "// MacD = 2.74 yrs | Yield y = 10% (0.10)\n// Modified Duration = 2.74 / (1 + 0.10) = 2.49\n// If Yield rises by +100 bps (+1.0% = 0.01):\n// Delta Price = -2.49 * (+0.01) * 100 = -2.49% (Bond drops by ~$24.90!)",
            "lineNotes": {
              "2": "Modified duration calculation.",
              "4": "Price change approximation."
            }
          },
          {
            "type": "runnable_code",
            "filename": "modd_calc_demo.js",
            "initialCode": "function calculatePriceImpact(macD, yieldPct, deltaYieldBps) {\n  const y = yieldPct / 100;\n  const modD = macD / (1 + y);\n  const dy = deltaYieldBps / 10000;\n  const deltaPricePct = -modD * dy * 100;\n  return {\n    modifiedDuration: Number(modD.toFixed(2)),\n    deltaYieldBasisPoints: deltaYieldBps,\n    estimatedPriceChangePercent: Number(deltaPricePct.toFixed(2)),\n    status: 'MODIFIED_DURATION_PRICE_VOLATILITY_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculatePriceImpact(2.74, 10, 100)));",
            "expectedOutput": "{\"modifiedDuration\":2.49,\"deltaYieldBasisPoints\":100,\"estimatedPriceChangePercent\":-2.49,\"status\":\"MODIFIED_DURATION_PRICE_VOLATILITY_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Modified Duration for a bond with a Macaulay Duration of 2.74 years at a 10% market yield ($2.74 / 1.10$)?",
          "expectedStringOutput": "2.49",
          "acceptableAnswers": [
            "2.49",
            "modifiedDuration\":2.49"
          ],
          "primaryMisconceptionId": "MC_FIN_FIXED_INCOME_MACAULAY_MODIFIED_DURATION",
          "diagnosisMap": {
            "2.74": {
              "misconceptionId": "MC_FIN_FIXED_INCOME_MACAULAY_MODIFIED_DURATION",
              "errorExplanation": "2.74 is Macaulay duration. Modified duration divides by (1 + y) = 2.74 / 1.10 = 2.49.",
              "recoveryPath": {
                "simplerExplanation": "2.74 / 1.10 = 2.49.",
                "guidedFixPrompt": "Type 2.49"
              }
            }
          }
        }
      },
      {
        "id": "fin-d8-b3-bond-convexity-refinement",
        "day": 8,
        "blockNumber": 3,
        "title": "Bond Convexity: Curvature Adjustment for Large Yield Shifts",
        "conceptBudget": {
          "primaryConcept": "Bond Convexity Adjustment",
          "supportingTerms": [
            "Convexity (Second derivative of bond price with respect to yield)",
            "Convexity Effect: Prices rise more when yields fall than they drop when yields rise!",
            "Total Price Change: $\\frac{\\Delta P}{P} \\approx -MD \\cdot \\Delta y + \\frac{1}{2} \\text{Convexity} \\cdot (\\Delta y)^2$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d8-b2-modified-duration-price-volatility",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "convexity_demo.js",
            "initialCode": "function evaluateConvexityBenefit() {\n  return 'CONVEXITY_PROVIDES_POSITIVE_PRICE_CURVATURE_PROTECTION';\n}\n\nconsole.log(evaluateConvexityBenefit());",
            "expectedOutput": "CONVEXITY_PROVIDES_POSITIVE_PRICE_CURVATURE_PROTECTION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What protective benefit does positive bond convexity provide to fixed-income bondholders during large interest rate shifts?",
          "expectedStringOutput": "CONVEXITY_PROVIDES_POSITIVE_PRICE_CURVATURE_PROTECTION",
          "acceptableAnswers": [
            "CONVEXITY_PROVIDES_POSITIVE_PRICE_CURVATURE_PROTECTION",
            "Positive curvature protection",
            "Convexity protection"
          ],
          "primaryMisconceptionId": "MC_FIN_FIXED_INCOME_MACAULAY_MODIFIED_DURATION",
          "diagnosisMap": {
            "NEGATIVE": {
              "misconceptionId": "MC_FIN_FIXED_INCOME_MACAULAY_MODIFIED_DURATION",
              "errorExplanation": "Convexity provides positive price curvature protection.",
              "recoveryPath": {
                "simplerExplanation": "Provides positive curvature protection.",
                "guidedFixPrompt": "Type CONVEXITY_PROVIDES_POSITIVE_PRICE_CURVATURE_PROTECTION"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 9,
    "title": "Capital Budgeting: Net Present Value (NPV) Decision Rule",
    "overviewMetaphor": "Net Present Value (NPV) is the Gold-Standard Metal Detector for Capital Investments: you bury $100,000 in the ground today to build a new warehouse; the warehouse generates future cash inflows over 3 years ($40k, $50k, $60k); NPV discounts those future inflows at your cost of capital (10%) and discovers they are worth $122,765 in today's money; subtracting your $100,000 cost yields a positive NPV of +$22,765—meaning the project directly expands shareholder wealth by $22,765 today.",
    "blocks": [
      {
        "id": "fin-d9-b1-npv-equation-and-decision-rule",
        "day": 9,
        "blockNumber": 1,
        "title": "Net Present Value (NPV) Formula: $\\sum \\frac{CF_t}{(1 + k)^t} - C_0$",
        "conceptBudget": {
          "primaryConcept": "Net Present Value (NPV) Decision Rule",
          "supportingTerms": [
            "$NPV = \\sum_{t=1}^n \\frac{CF_t}{(1 + k)^t} - C_0$",
            "$C_0$ (Initial capital outlay / investment)",
            "$k$ (Cost of capital / hurdle rate)",
            "Decision Rule: If $NPV > 0 \\implies$ Accept; If $NPV < 0 \\implies$ Reject"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d3-b2-discounting-uneven-cash-flows",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "NPV Capital Investment Evaluation",
              "boxes": [
                {
                  "label": "Initial Capital Outlay (C0)",
                  "value": "-$100,000 spent today (Cash Outflow)",
                  "varType": "Initial Investment",
                  "isUpdated": false
                },
                {
                  "label": "PV of Future Cash Inflows",
                  "value": "PV($40k, $50k, $60k @ 10%) = +$122,764.84",
                  "varType": "Discounted Inflows",
                  "isUpdated": false
                },
                {
                  "label": "Net Present Value (NPV)",
                  "value": "+$122,764.84 - $100,000 = +$22,764.84 -> ACCEPT PROJECT!",
                  "varType": "NPV Output",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "npv_calc_demo.js",
            "initialCode": "function calculateNpv(initialOutlay, cfs, kPct) {\n  const k = kPct / 100;\n  let pvInflows = 0;\n  cfs.forEach((cf, idx) => {\n    pvInflows += cf / Math.pow(1 + k, idx + 1);\n  });\n  const npv = pvInflows - initialOutlay;\n  return {\n    initialOutlay,\n    pvOfInflows: Number(pvInflows.toFixed(2)),\n    netPresentValue: Number(npv.toFixed(2)),\n    recommendation: npv > 0 ? 'ACCEPT_PROJECT_POSITIVE_NPV' : 'REJECT_PROJECT_NEGATIVE_NPV',\n    status: 'NPV_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateNpv(100000, [40000, 50000, 60000], 10)));",
            "expectedOutput": "{\"initialOutlay\":100000,\"pvOfInflows\":122764.84,\"netPresentValue\":22764.84,\"recommendation\":\"ACCEPT_PROJECT_POSITIVE_NPV\",\"status\":\"NPV_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Net Present Value (NPV) of a project with a $100,000 initial outlay whose discounted cash inflows total $122,764.84 ($122764.84 - 100000$)?",
          "expectedStringOutput": "22764.84",
          "acceptableAnswers": [
            "22764.84",
            "$22,764.84",
            "netPresentValue\":22764.84"
          ],
          "primaryMisconceptionId": "MC_FIN_CAPITAL_BUDGETING_NET_PRESENT_VALUE_NPV",
          "diagnosisMap": {
            "122764.84": {
              "misconceptionId": "MC_FIN_CAPITAL_BUDGETING_NET_PRESENT_VALUE_NPV",
              "errorExplanation": "$122,764.84 is the gross PV of inflows. NPV subtracts the $100,000 initial outlay = $22,764.84.",
              "recoveryPath": {
                "simplerExplanation": "122764.84 - 100000 = 22764.84.",
                "guidedFixPrompt": "Type 22764.84"
              }
            }
          }
        }
      },
      {
        "id": "fin-d9-b2-independent-vs-mutually-exclusive",
        "day": 9,
        "blockNumber": 2,
        "title": "Independent vs Mutually Exclusive Capital Projects",
        "conceptBudget": {
          "primaryConcept": "Project Selection Types",
          "supportingTerms": [
            "Independent Projects (Accept ALL projects with $NPV > 0$)",
            "Mutually Exclusive Projects (Accept ONLY the single project with the HIGHEST positive $NPV$)",
            "Capital Rationing Constraints"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d9-b1-npv-equation-and-decision-rule",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Mutually Exclusive Project Selection",
            "codeSnippet": "// Project Alpha: NPV = +$50,000\n// Project Beta:  NPV = +$85,000\n// If Mutually Exclusive (Can only pick one site): SELECT PROJECT BETA (Highest NPV!)",
            "lineNotes": {
              "1": "Project Alpha value.",
              "2": "Project Beta value.",
              "3": "Selects highest positive NPV."
            }
          },
          {
            "type": "runnable_code",
            "filename": "project_type_demo.js",
            "initialCode": "function selectMutuallyExclusive(projectList) {\n  const sorted = projectList.filter(p => p.npv > 0).sort((a, b) => b.npv - a.npv);\n  return {\n    selectedProject: sorted[0]?.name || 'NONE',\n    highestNpv: sorted[0]?.npv || 0,\n    status: 'OPTIMAL_MUTUALLY_EXCLUSIVE_PROJECT_SELECTED'\n  };\n}\n\nconst projects = [{ name: 'Project Alpha', npv: 50000 }, { name: 'Project Beta', npv: 85000 }];\nconsole.log(JSON.stringify(selectMutuallyExclusive(projects)));",
            "expectedOutput": "{\"selectedProject\":\"Project Beta\",\"highestNpv\":85000,\"status\":\"OPTIMAL_MUTUALLY_EXCLUSIVE_PROJECT_SELECTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "When evaluating two mutually exclusive projects (Alpha: NPV $50,000 vs Beta: NPV $85,000), which project must management choose?",
          "expectedStringOutput": "Project Beta",
          "acceptableAnswers": [
            "Project Beta",
            "Beta",
            "selectedProject\":\"Project Beta\""
          ],
          "primaryMisconceptionId": "MC_FIN_CAPITAL_BUDGETING_NET_PRESENT_VALUE_NPV",
          "diagnosisMap": {
            "Alpha": {
              "misconceptionId": "MC_FIN_CAPITAL_BUDGETING_NET_PRESENT_VALUE_NPV",
              "errorExplanation": "Management chooses the project with the highest positive NPV = Project Beta.",
              "recoveryPath": {
                "simplerExplanation": "Highest NPV wins -> Project Beta.",
                "guidedFixPrompt": "Type Project Beta"
              }
            }
          }
        }
      },
      {
        "id": "fin-d9-b3-npv-profile-crossover-rate",
        "day": 9,
        "blockNumber": 3,
        "title": "The NPV Profile & Fisher's Crossover Rate",
        "conceptBudget": {
          "primaryConcept": "NPV Profile & Crossover Rate",
          "supportingTerms": [
            "NPV Profile Curve (Plot of project NPV as discount rate $k$ increases)",
            "Fisher's Crossover Rate (The exact discount rate where Project A and Project B have IDENTICAL NPV)",
            "Ranking Reversals below and above crossover rate"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d9-b2-independent-vs-mutually-exclusive",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "crossover_demo.js",
            "initialCode": "function evaluateCrossoverConcept() {\n  return 'CROSSOVER_RATE_IS_WHERE_NPV_OF_BOTH_PROJECTS_ARE_EQUAL';\n}\n\nconsole.log(evaluateCrossoverConcept());",
            "expectedOutput": "CROSSOVER_RATE_IS_WHERE_NPV_OF_BOTH_PROJECTS_ARE_EQUAL",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is Fisher's Crossover Rate in capital budgeting analysis?",
          "expectedStringOutput": "CROSSOVER_RATE_IS_WHERE_NPV_OF_BOTH_PROJECTS_ARE_EQUAL",
          "acceptableAnswers": [
            "CROSSOVER_RATE_IS_WHERE_NPV_OF_BOTH_PROJECTS_ARE_EQUAL",
            "Where NPVs are equal",
            "Equal NPV rate"
          ],
          "primaryMisconceptionId": "MC_FIN_CAPITAL_BUDGETING_NET_PRESENT_VALUE_NPV",
          "diagnosisMap": {
            "IRR": {
              "misconceptionId": "MC_FIN_CAPITAL_BUDGETING_NET_PRESENT_VALUE_NPV",
              "errorExplanation": "IRR is where NPV = 0. Crossover rate is where NPV(A) = NPV(B).",
              "recoveryPath": {
                "simplerExplanation": "Where NPVs of both projects are equal.",
                "guidedFixPrompt": "Type CROSSOVER_RATE_IS_WHERE_NPV_OF_BOTH_PROJECTS_ARE_EQUAL"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 10,
    "title": "Capital Budgeting: Internal Rate of Return (IRR) & Hurdle Rate",
    "overviewMetaphor": "Internal Rate of Return (IRR) is the Maximum Interest Rate a Project Can Pay Before Going Bankrupt: if a new factory yields an IRR of 13.07%, you can borrow money at 10% interest, pay off the bank, and pocket the 3.07% surplus; but if your bank demands a 15% hurdle rate, borrowing money for a 13.07% factory guarantees financial loss; IRR is the exact break-even discount rate where the project's Net Present Value equals zero.",
    "blocks": [
      {
        "id": "fin-d10-b1-irr-definition-and-hurdle-rule",
        "day": 10,
        "blockNumber": 1,
        "title": "Internal Rate of Return (IRR) Definition & The Hurdle Rate Comparison",
        "conceptBudget": {
          "primaryConcept": "IRR Definition & Decision Rule",
          "supportingTerms": [
            "IRR is the rate $r^*$ where $\\sum_{t=1}^n \\frac{CF_t}{(1 + r^*)^t} - C_0 = 0$",
            "Hurdle Rate ($k$: Cost of capital)",
            "Decision Rule: If $IRR \\ge k \\implies$ Accept; If $IRR < k \\implies$ Reject"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d9-b1-npv-equation-and-decision-rule",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "IRR vs Hurdle Rate Decision Framework",
              "boxes": [
                {
                  "label": "Project Internal Rate of Return (IRR)",
                  "value": "Factory generates 13.07% annualized rate of return",
                  "varType": "Project Return",
                  "isUpdated": false
                },
                {
                  "label": "Cost of Capital Hurdle Rate (k)",
                  "value": "Firm's WACC hurdle rate = 10.00%",
                  "varType": "Cost of Funds",
                  "isUpdated": false
                },
                {
                  "label": "Decision Outcome",
                  "value": "13.07% > 10.00% -> ACCEPT PROJECT (Generates positive economic value!)",
                  "varType": "Decision Result",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "irr_concept_demo.js",
            "initialCode": "function evaluateIrrDecision(irrPct, hurdlePct) {\n  const isAccepted = (irrPct >= hurdlePct);\n  return {\n    projectIrrPercent: irrPct,\n    hurdleRatePercent: hurdlePct,\n    isAccepted,\n    recommendation: isAccepted ? 'ACCEPT_IRR_EXCEEDS_HURDLE' : 'REJECT_IRR_BELOW_HURDLE',\n    status: 'IRR_DECISION_EVALUATED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateIrrDecision(13.07, 10.0)));",
            "expectedOutput": "{\"projectIrrPercent\":13.07,\"hurdleRatePercent\":10,\"isAccepted\":true,\"recommendation\":\"ACCEPT_IRR_EXCEEDS_HURDLE\",\"status\":\"IRR_DECISION_EVALUATED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What recommendation is given when a project's IRR (13.07%) exceeds the company's cost of capital hurdle rate (10%)?",
          "expectedStringOutput": "ACCEPT_IRR_EXCEEDS_HURDLE",
          "acceptableAnswers": [
            "ACCEPT_IRR_EXCEEDS_HURDLE",
            "Accept",
            "recommendation\":\"ACCEPT_IRR_EXCEEDS_HURDLE\""
          ],
          "primaryMisconceptionId": "MC_FIN_INTERNAL_RATE_OF_RETURN_IRR_HURDLE",
          "diagnosisMap": {
            "REJECT": {
              "misconceptionId": "MC_FIN_INTERNAL_RATE_OF_RETURN_IRR_HURDLE",
              "errorExplanation": "When IRR > Hurdle rate, the project creates value and is accepted.",
              "recoveryPath": {
                "simplerExplanation": "IRR > Hurdle -> Accept.",
                "guidedFixPrompt": "Type ACCEPT_IRR_EXCEEDS_HURDLE"
              }
            }
          }
        }
      },
      {
        "id": "fin-d10-b2-irr-newton-raphson-solver",
        "day": 10,
        "blockNumber": 2,
        "title": "Solving IRR: Iterative Interpolation & Newton-Raphson Solver",
        "conceptBudget": {
          "primaryConcept": "Numerical IRR Solver Mechanics",
          "supportingTerms": [
            "Trial and Error Interpolation: $\\text{IRR} = L + \\left[\\frac{NPV_L}{NPV_L - NPV_H}\\right] \\times (H - L)$",
            "Newton-Raphson Iteration ($r_{n+1} = r_n - \\frac{NPV(r_n)}{NPV'(r_n)}$)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d10-b1-irr-definition-and-hurdle-rule",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Newton-Raphson IRR Solver Loop",
            "codeSnippet": "let r = 0.10; // Start with 10% guess\nfor (let i = 0; i < 50; i++) {\n  const npv = -c0 + (cf1/(1+r)) + (cf2/Math.pow(1+r, 2));\n  const dNpv = -(cf1/Math.pow(1+r, 2)) - (2*cf2/Math.pow(1+r, 3));\n  r -= npv / dNpv; // Converges to exact IRR in ~5 iterations!\n}",
            "lineNotes": {
              "1": "Initial interest rate estimate.",
              "5": "Newton step updates rate toward NPV = 0."
            }
          },
          {
            "type": "runnable_code",
            "filename": "irr_solver_demo.js",
            "initialCode": "function solveIrr(c0, cf1, cf2) {\n  let r = 0.10;\n  for (let i = 0; i < 50; i++) {\n    const npv = -c0 + (cf1 / (1 + r)) + (cf2 / Math.pow(1 + r, 2));\n    const dNpv = -(cf1 / Math.pow(1 + r, 2)) - (2 * cf2 / Math.pow(1 + r, 3));\n    r -= npv / dNpv;\n  }\n  return {\n    initialCost: c0,\n    inflows: [cf1, cf2],\n    solvedIrrPercent: Number((r * 100).toFixed(2)),\n    status: 'IRR_SOLVED_CONVERGED'\n  };\n}\n\nconsole.log(JSON.stringify(solveIrr(100000, 60000, 60000)));",
            "expectedOutput": "{\"initialCost\":100000,\"inflows\":[60000,60000],\"solvedIrrPercent\":13.07,\"status\":\"IRR_SOLVED_CONVERGED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the exact IRR percentage for a $100,000 project that generates $60,000 at the end of Year 1 and $60,000 at Year 2?",
          "expectedStringOutput": "13.07",
          "acceptableAnswers": [
            "13.07",
            "13.07%",
            "solvedIrrPercent\":13.07"
          ],
          "primaryMisconceptionId": "MC_FIN_INTERNAL_RATE_OF_RETURN_IRR_HURDLE",
          "diagnosisMap": {
            "20.0": {
              "misconceptionId": "MC_FIN_INTERNAL_RATE_OF_RETURN_IRR_HURDLE",
              "errorExplanation": "$120k / $100k = 20% total nominal return over 2 years. Annualized compound IRR is 13.07%.",
              "recoveryPath": {
                "simplerExplanation": "Compound IRR is 13.07%.",
                "guidedFixPrompt": "Type 13.07"
              }
            }
          }
        }
      },
      {
        "id": "fin-d10-b3-npv-vs-irr-conflicts",
        "day": 10,
        "blockNumber": 3,
        "title": "NPV vs IRR Conflicts & The Reinvestment Rate Assumption",
        "conceptBudget": {
          "primaryConcept": "NPV vs IRR Flaw Analysis",
          "supportingTerms": [
            "Reinvestment Assumption: NPV assumes cash flows are reinvested at WACC ($k$); IRR unrealistically assumes reinvestment at the project's own IRR!",
            "Scale Problem & Timing Conflicts in Mutually Exclusive Projects",
            "Superiority of NPV in all conflict situations!"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d10-b2-irr-newton-raphson-solver",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "npv_irr_conflict_demo.js",
            "initialCode": "function evaluateMethodSuperiority(hasConflict) {\n  return hasConflict\n    ? 'ALWAYS_CHOOSE_NPV_OVER_IRR_IN_CONFLICT_SCENARIOS'\n    : 'NPV_AND_IRR_AGREE_ON_ACCEPT_REJECT';\n}\n\nconsole.log(evaluateMethodSuperiority(true));\nconsole.log(evaluateMethodSuperiority(false));",
            "expectedOutput": "ALWAYS_CHOOSE_NPV_OVER_IRR_IN_CONFLICT_SCENARIOS\nNPV_AND_IRR_AGREE_ON_ACCEPT_REJECT",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "When evaluating mutually exclusive projects where NPV and IRR give conflicting rankings, which capital budgeting metric must management follow?",
          "expectedStringOutput": "ALWAYS_CHOOSE_NPV_OVER_IRR_IN_CONFLICT_SCENARIOS",
          "acceptableAnswers": [
            "ALWAYS_CHOOSE_NPV_OVER_IRR_IN_CONFLICT_SCENARIOS",
            "NPV",
            "Net Present Value"
          ],
          "primaryMisconceptionId": "MC_FIN_INTERNAL_RATE_OF_RETURN_IRR_HURDLE",
          "diagnosisMap": {
            "IRR": {
              "misconceptionId": "MC_FIN_INTERNAL_RATE_OF_RETURN_IRR_HURDLE",
              "errorExplanation": "IRR makes unrealistic reinvestment assumptions. NPV directly maximizes shareholder wealth.",
              "recoveryPath": {
                "simplerExplanation": "Always choose NPV over IRR.",
                "guidedFixPrompt": "Type ALWAYS_CHOOSE_NPV_OVER_IRR_IN_CONFLICT_SCENARIOS"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 11,
    "title": "Capital Budgeting: Payback Period & Profitability Index (PI)",
    "overviewMetaphor": "Payback and Profitability Index are the Speedometer and Efficiency Rating of Capital Investments: Payback Period measures how fast you get your cash back (e.g. 2.0 years); Profitability Index ($PI$) measures bang-for-the-buck—telling you how many dollars of present value you get for every $1 invested ($PI = 1.24$ gives you $1.24 of value per dollar spent).",
    "blocks": [
      {
        "id": "fin-d11-b1-payback-period-calculation",
        "day": 11,
        "blockNumber": 1,
        "title": "Traditional Payback Period vs Discounted Payback Period",
        "conceptBudget": {
          "primaryConcept": "Payback Period Liquidity Analysis",
          "supportingTerms": [
            "Payback Period: Number of years to recoup initial investment outlay",
            "Flaws: Ignores time value of money, ignores cash flows after payback period",
            "Discounted Payback: Incorporates TVM discounting before accumulating cash flows"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d9-b1-npv-equation-and-decision-rule",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Payback Period Accumulation ($100k Outlay, $50k/yr)",
              "boxes": [
                {
                  "label": "Year 1 Cash Inflow",
                  "value": "+$50,000 recovered | Unrecovered balance = $50,000",
                  "varType": "Year 1 Recovery",
                  "isUpdated": false
                },
                {
                  "label": "Year 2 Cash Inflow",
                  "value": "+$50,000 recovered | Unrecovered balance = $0 -> PAYBACK = 2.0 YEARS!",
                  "varType": "Payback Milestone",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "payback_calc_demo.js",
            "initialCode": "function calculatePayback(outlay, cfs) {\n  let cumulative = 0;\n  let payback = 0;\n  for (let i = 0; i < cfs.length; i++) {\n    if (cumulative + cfs[i] >= outlay) {\n      payback = i + (outlay - cumulative) / cfs[i];\n      break;\n    }\n    cumulative += cfs[i];\n  }\n  return {\n    initialOutlay: outlay,\n    paybackYears: Number(payback.toFixed(2)),\n    status: 'PAYBACK_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculatePayback(100000, [50000, 50000, 50000])));",
            "expectedOutput": "{\"initialOutlay\":100000,\"paybackYears\":2,\"status\":\"PAYBACK_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Payback Period (in years) for a $100,000 investment generating equal cash inflows of $50,000 each year ($100000 / 50000$)?",
          "expectedStringOutput": "2",
          "acceptableAnswers": [
            "2",
            "2 years",
            "2.0",
            "paybackYears\":2"
          ],
          "primaryMisconceptionId": "MC_FIN_PAYBACK_PERIOD_AND_DISCOUNTED_PAYBACK",
          "diagnosisMap": {
            "3": {
              "misconceptionId": "MC_FIN_PAYBACK_PERIOD_AND_DISCOUNTED_PAYBACK",
              "errorExplanation": "100k is fully recovered by Year 2 (50k + 50k). Payback is 2.0 years.",
              "recoveryPath": {
                "simplerExplanation": "100,000 / 50,000 = 2 years.",
                "guidedFixPrompt": "Type 2"
              }
            }
          }
        }
      },
      {
        "id": "fin-d11-b2-profitability-index-pi",
        "day": 11,
        "blockNumber": 2,
        "title": "Profitability Index (PI) / Benefit-Cost Ratio: $PI = \\frac{\\text{PV of Inflows}}{C_0}$",
        "conceptBudget": {
          "primaryConcept": "Profitability Index (PI) Formula",
          "supportingTerms": [
            "$PI = \\frac{\\text{PV of Future Cash Inflows}}{\\text{Initial Outlay } C_0}$",
            "Decision Rule: If $PI > 1.0 \\implies$ Accept; If $PI < 1.0 \\implies$ Reject",
            "Bang-for-the-buck capital rationing ranking metric"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d11-b1-payback-period-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Profitability Index Math",
            "codeSnippet": "Initial Outlay C0 = $100,000\nPV of Future Inflows = $124,342.60\nProfitability Index (PI) = 124,342.60 / 100,000 = 1.24\nSince PI (1.24) > 1.0 -> ACCEPT PROJECT!",
            "lineNotes": {
              "2": "Total discounted inflows.",
              "3": "PI ratio.",
              "4": "Acceptance threshold."
            }
          },
          {
            "type": "runnable_code",
            "filename": "pi_calc_demo.js",
            "initialCode": "function calculatePi(outlay, pvInflows) {\n  const pi = pvInflows / outlay;\n  return {\n    initialOutlay: outlay,\n    pvOfInflows: pvInflows,\n    profitabilityIndex: Number(pi.toFixed(2)),\n    isAccepted: pi > 1.0,\n    status: 'PI_EVALUATED'\n  };\n}\n\nconsole.log(JSON.stringify(calculatePi(100000, 124342.60)));",
            "expectedOutput": "{\"initialOutlay\":100000,\"pvOfInflows\":124342.6,\"profitabilityIndex\":1.24,\"isAccepted\":true,\"status\":\"PI_EVALUATED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Profitability Index (PI) for a project with a $100,000 initial outlay and $124,342.60 present value of inflows ($124342.60 / 100000$)?",
          "expectedStringOutput": "1.24",
          "acceptableAnswers": [
            "1.24",
            "profitabilityIndex\":1.24"
          ],
          "primaryMisconceptionId": "MC_FIN_PROFITABILITY_INDEX_PI_PROJECT_RANKING",
          "diagnosisMap": {
            "0.80": {
              "misconceptionId": "MC_FIN_PROFITABILITY_INDEX_PI_PROJECT_RANKING",
              "errorExplanation": "PI is Inflows / Outlay = 124k / 100k = 1.24.",
              "recoveryPath": {
                "simplerExplanation": "124342.60 / 100000 = 1.24.",
                "guidedFixPrompt": "Type 1.24"
              }
            }
          }
        }
      },
      {
        "id": "fin-d11-b3-capital-rationing-pi-ranking",
        "day": 11,
        "blockNumber": 3,
        "title": "Capital Rationing: Maximizing Aggregate NPV via PI Ranking",
        "conceptBudget": {
          "primaryConcept": "Capital Rationing Optimization",
          "supportingTerms": [
            "Hard vs Soft Capital Rationing (Fixed budget ceiling e.g. $500,000)",
            "Ranking projects by Profitability Index ($PI$) to maximize cumulative portfolio NPV"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d11-b2-profitability-index-pi",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "rationing_demo.js",
            "initialCode": "function evaluateCapitalRationing() {\n  return 'RANK_BY_PROFITABILITY_INDEX_TO_MAXIMIZE_PORTFOLIO_NPV_UNDER_BUDGET_CEILING';\n}\n\nconsole.log(evaluateCapitalRationing());",
            "expectedOutput": "RANK_BY_PROFITABILITY_INDEX_TO_MAXIMIZE_PORTFOLIO_NPV_UNDER_BUDGET_CEILING",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How should management rank projects when subject to a strict capital budget ceiling (Capital Rationing)?",
          "expectedStringOutput": "RANK_BY_PROFITABILITY_INDEX_TO_MAXIMIZE_PORTFOLIO_NPV_UNDER_BUDGET_CEILING",
          "acceptableAnswers": [
            "RANK_BY_PROFITABILITY_INDEX_TO_MAXIMIZE_PORTFOLIO_NPV_UNDER_BUDGET_CEILING",
            "Rank by PI",
            "Rank by Profitability Index"
          ],
          "primaryMisconceptionId": "MC_FIN_PROFITABILITY_INDEX_PI_PROJECT_RANKING",
          "diagnosisMap": {
            "PAYBACK": {
              "misconceptionId": "MC_FIN_PROFITABILITY_INDEX_PI_PROJECT_RANKING",
              "errorExplanation": "Ranking by PI maximizes total created shareholder NPV within the budget.",
              "recoveryPath": {
                "simplerExplanation": "Rank by Profitability Index.",
                "guidedFixPrompt": "Type RANK_BY_PROFITABILITY_INDEX_TO_MAXIMIZE_PORTFOLIO_NPV_UNDER_BUDGET_CEILING"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 12,
    "title": "Cost of Capital: Cost of Debt ($K_d$) & Tax Shield",
    "overviewMetaphor": "The Debt Tax Shield is a Government Discount Coupon on Your Corporate Loan Interest: if your company borrows money at a 10% interest rate, interest is an allowable business expense that reduces your taxable profit; with a 25% corporate tax rate, the government effectively pays 2.5% of your interest bill—leaving your company with an After-Tax Cost of Debt of only 7.5% ($K_d = 10\\% \\times (1 - 0.25)$).",
    "blocks": [
      {
        "id": "fin-d12-b1-after-tax-cost-of-debt-formula",
        "day": 12,
        "blockNumber": 1,
        "title": "After-Tax Cost of Debt Formula: $K_d = i(1 - t)$",
        "conceptBudget": {
          "primaryConcept": "After-Tax Cost of Debt Formula",
          "supportingTerms": [
            "$K_d = i \\times (1 - t)$",
            "$i$ (Pre-tax interest / coupon rate on debt)",
            "$t$ (Marginal corporate tax rate)",
            "Tax Shield: Interest deductibility lowers effective borrowing cost"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d6-b1-bond-valuation-equation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Debt Tax Shield Breakdown (10% Interest, 25% Tax)",
              "boxes": [
                {
                  "label": "Pre-Tax Interest Rate (i)",
                  "value": "10.0% nominal rate paid to debenture holders",
                  "varType": "Nominal Cost",
                  "isUpdated": false
                },
                {
                  "label": "Government Tax Shield",
                  "value": "Less: 25% tax deductibility = 10% x 0.25 = 2.5% tax savings!",
                  "varType": "Tax Subsidy",
                  "isUpdated": false
                },
                {
                  "label": "Effective Cost of Debt (Kd)",
                  "value": "10% x (1 - 0.25) = EXACTLY 7.5% After-Tax Cost!",
                  "varType": "Net Effective Cost",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "kd_calc_demo.js",
            "initialCode": "function calculateKd(iPct, tPct) {\n  const i = iPct / 100;\n  const t = tPct / 100;\n  const kd = i * (1 - t);\n  return {\n    preTaxRatePercent: iPct,\n    corporateTaxRatePercent: tPct,\n    afterTaxCostOfDebtPercent: Number((kd * 100).toFixed(2)),\n    status: 'KD_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateKd(10, 25)));",
            "expectedOutput": "{\"preTaxRatePercent\":10,\"corporateTaxRatePercent\":25,\"afterTaxCostOfDebtPercent\":7.5,\"status\":\"KD_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the After-Tax Cost of Debt ($K_d$) percentage for a company borrowing at 10% pre-tax interest with a 25% corporate tax rate ($10 \\times (1 - 0.25)$)?",
          "expectedStringOutput": "7.5",
          "acceptableAnswers": [
            "7.5",
            "7.5%",
            "afterTaxCostOfDebtPercent\":7.5"
          ],
          "primaryMisconceptionId": "MC_FIN_COST_OF_DEBT_AFTER_TAX_SHIELD",
          "diagnosisMap": {
            "10.0": {
              "misconceptionId": "MC_FIN_COST_OF_DEBT_AFTER_TAX_SHIELD",
              "errorExplanation": "10.0% is pre-tax. Deducting the 25% tax shield yields 7.5%.",
              "recoveryPath": {
                "simplerExplanation": "10 * (1 - 0.25) = 7.5%.",
                "guidedFixPrompt": "Type 7.5"
              }
            }
          }
        }
      },
      {
        "id": "fin-d12-b2-flotation-costs-in-debt",
        "day": 12,
        "blockNumber": 2,
        "title": "Flotation Costs & Net Proceeds in Debt Issuance ($K_d = \\frac{i(1 - t)}{NP}$)",
        "conceptBudget": {
          "primaryConcept": "Debt Flotation Costs Adjustment",
          "supportingTerms": [
            "Flotation Costs (Underwriting fees, legal, printing fees per debenture)",
            "Net Proceeds ($NP = \\text{Issue Price} - \\text{Flotation Cost}$)",
            "$K_d = \\frac{I(1 - t)}{NP}$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d12-b1-after-tax-cost-of-debt-formula",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "flotation_demo.js",
            "initialCode": "function calculateKdWithFlotation(faceVal, couponPct, taxPct, floatPct) {\n  const interest = faceVal * (couponPct / 100);\n  const netProceeds = faceVal * (1 - floatPct / 100);\n  const t = taxPct / 100;\n  const kd = (interest * (1 - t)) / netProceeds;\n  return {\n    netProceedsPerBond: netProceeds,\n    afterTaxCostOfDebtPercent: Number((kd * 100).toFixed(2)),\n    status: 'KD_WITH_FLOTATION_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateKdWithFlotation(100, 10, 25, 5))); // Net = 95 -> Kd = 7.5 / 95 = 7.89%",
            "expectedOutput": "{\"netProceedsPerBond\":95,\"afterTaxCostOfDebtPercent\":7.89,\"status\":\"KD_WITH_FLOTATION_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the After-Tax Cost of Debt percentage when a $100 par 10% debenture is issued with 5% flotation costs ($NP = $95) at a 25% tax rate ($ (10 \\times 0.75) / 95 \\times 100 $)?",
          "expectedStringOutput": "7.89",
          "acceptableAnswers": [
            "7.89",
            "7.89%",
            "afterTaxCostOfDebtPercent\":7.89"
          ],
          "primaryMisconceptionId": "MC_FIN_COST_OF_DEBT_AFTER_TAX_SHIELD",
          "diagnosisMap": {
            "7.5": {
              "misconceptionId": "MC_FIN_COST_OF_DEBT_AFTER_TAX_SHIELD",
              "errorExplanation": "Flotation cost lowers net proceeds to $95, increasing Kd to 7.5 / 95 = 7.89%.",
              "recoveryPath": {
                "simplerExplanation": "7.5 / 95 = 7.89%.",
                "guidedFixPrompt": "Type 7.89"
              }
            }
          }
        }
      },
      {
        "id": "fin-d12-b3-debt-bankruptcy-risk-tradeoff",
        "day": 12,
        "blockNumber": 3,
        "title": "The Trade-Off: Tax Shield Benefits vs Financial Distress Costs",
        "conceptBudget": {
          "primaryConcept": "Debt Trade-Off Theory Invariant",
          "supportingTerms": [
            "Moderate Debt creates valuable tax shields",
            "Excessive Debt increases probability of bankruptcy and financial distress",
            "Optimal Capital Structure point"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d12-b2-flotation-costs-in-debt",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "tradeoff_demo.js",
            "initialCode": "function evaluateDebtTradeOff(leverageLevel) {\n  return leverageLevel === 'MODERATE_OPTIMAL'\n    ? 'MAXIMIZES_TAX_SHIELD_WHILE_CONTAINING_DISTRESS_RISK'\n    : 'EXCESSIVE_DEBT_CAUSES_FINANCIAL_DISTRESS_COSTS_TO_EXCEED_TAX_SHIELD';\n}\n\nconsole.log(evaluateDebtTradeOff('MODERATE_OPTIMAL'));\nconsole.log(evaluateDebtTradeOff('EXCESSIVE'));",
            "expectedOutput": "MAXIMIZES_TAX_SHIELD_WHILE_CONTAINING_DISTRESS_RISK\nEXCESSIVE_DEBT_CAUSES_FINANCIAL_DISTRESS_COSTS_TO_EXCEED_TAX_SHIELD",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What benefit is maximized when maintaining an optimal moderate debt level under the Trade-Off Theory of capital structure?",
          "expectedStringOutput": "MAXIMIZES_TAX_SHIELD_WHILE_CONTAINING_DISTRESS_RISK",
          "acceptableAnswers": [
            "MAXIMIZES_TAX_SHIELD_WHILE_CONTAINING_DISTRESS_RISK",
            "Tax shield maximized",
            "Contains distress risk"
          ],
          "primaryMisconceptionId": "MC_FIN_COST_OF_DEBT_AFTER_TAX_SHIELD",
          "diagnosisMap": {
            "EXCESSIVE": {
              "misconceptionId": "MC_FIN_COST_OF_DEBT_AFTER_TAX_SHIELD",
              "errorExplanation": "Moderate debt maximizes tax shield while containing distress risk.",
              "recoveryPath": {
                "simplerExplanation": "Matches MAXIMIZES_TAX_SHIELD_WHILE_CONTAINING_DISTRESS_RISK.",
                "guidedFixPrompt": "Type MAXIMIZES_TAX_SHIELD_WHILE_CONTAINING_DISTRESS_RISK"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 13,
    "title": "Cost of Capital: Cost of Equity ($K_e$) via CAPM & Dividend Growth",
    "overviewMetaphor": "Cost of Equity is the Minimum Return Demanded by Shareholders for Putting Their Money in Harm's Way: equity investors get zero guaranteed interest; they only get paid after all bankers and suppliers are satisfied; CAPM calculates their required return by taking a safe risk-free government bond yield (6%) and adding a risk penalty proportional to how wildly the company's stock moves with the market (Beta $\\beta = 1.2 \\implies K_e = 6\\% + 1.2 \\times 5\\% = 12\\%$).",
    "blocks": [
      {
        "id": "fin-d13-b1-capm-cost-of-equity",
        "day": 13,
        "blockNumber": 1,
        "title": "Cost of Equity via CAPM: $K_e = R_f + \\beta(R_m - R_f)$",
        "conceptBudget": {
          "primaryConcept": "CAPM Cost of Equity Formula",
          "supportingTerms": [
            "$K_e = R_f + \\beta \\times (R_m - R_f)$",
            "$R_f$ (Risk-Free Rate: 10-Yr Government Treasury Bond yield)",
            "$\\beta$ (Beta: Sensitivity of stock to broader market movements)",
            "$(R_m - R_f)$ (Equity Market Risk Premium)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d12-b1-after-tax-cost-of-debt-formula",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "CAPM Cost of Equity ($R_f = 6\\%, \\beta = 1.2, MRP = 5\\%$)",
              "boxes": [
                {
                  "label": "Risk-Free Baseline (Rf)",
                  "value": "6.0% guaranteed Treasury yield",
                  "varType": "Risk-Free Base",
                  "isUpdated": false
                },
                {
                  "label": "Equity Risk Premium (Beta x MRP)",
                  "value": "1.2 x 5.0% Market Premium = +6.0% Risk Premium!",
                  "varType": "Risk Premium",
                  "isUpdated": false
                },
                {
                  "label": "Cost of Equity (Ke)",
                  "value": "6.0% + 6.0% = 12.0% Required Return on Equity!",
                  "varType": "Cost of Equity",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "capm_ke_demo.js",
            "initialCode": "function calculateCapmKe(rfPct, beta, mrpPct) {\n  const ke = rfPct + beta * mrpPct;\n  return {\n    riskFreeRatePercent: rfPct,\n    betaCoefficient: beta,\n    marketRiskPremiumPercent: mrpPct,\n    costOfEquityPercent: Number(ke.toFixed(2)),\n    status: 'CAPM_KE_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateCapmKe(6, 1.2, 5)));",
            "expectedOutput": "{\"riskFreeRatePercent\":6,\"betaCoefficient\":1.2,\"marketRiskPremiumPercent\":5,\"costOfEquityPercent\":12,\"status\":\"CAPM_KE_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Cost of Equity ($K_e$) percentage under CAPM when Risk-Free Rate is 6%, Beta is 1.2, and Market Risk Premium is 5% ($6 + 1.2 \\times 5$)?",
          "expectedStringOutput": "12",
          "acceptableAnswers": [
            "12",
            "12%",
            "12.0",
            "costOfEquityPercent\":12"
          ],
          "primaryMisconceptionId": "MC_FIN_COST_OF_EQUITY_CAPM_AND_DIVIDEND_GROWTH",
          "diagnosisMap": {
            "11": {
              "misconceptionId": "MC_FIN_COST_OF_EQUITY_CAPM_AND_DIVIDEND_GROWTH",
              "errorExplanation": "6 + (1.2 * 5) = 6 + 6 = 12%.",
              "recoveryPath": {
                "simplerExplanation": "6 + 6 = 12%.",
                "guidedFixPrompt": "Type 12"
              }
            }
          }
        }
      },
      {
        "id": "fin-d13-b2-gordon-dividend-growth-ke",
        "day": 13,
        "blockNumber": 2,
        "title": "Cost of Equity via Gordon Dividend Growth Model: $K_e = \\frac{D_1}{P_0} + g$",
        "conceptBudget": {
          "primaryConcept": "Gordon Dividend Growth Model",
          "supportingTerms": [
            "$K_e = \\frac{D_1}{P_0} + g = \\frac{D_0(1 + g)}{P_0} + g$",
            "$D_1$ (Expected next year dividend)",
            "$P_0$ (Current market price per share)",
            "$g$ (Constant annual dividend growth rate)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d13-b1-capm-cost-of-equity",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Gordon Growth Math ($D0 = $4, P0 = $50, g = 4%)",
            "codeSnippet": "D1 = D0 * (1 + g) = 4 * 1.04 = $4.16\nDividend Yield = 4.16 / 50 = 8.32%\nCapital Gains Growth = 4.00%\nTotal Cost of Equity Ke = 8.32% + 4.00% = 12.32%",
            "lineNotes": {
              "1": "Expected dividend next year.",
              "2": "Dividend yield component.",
              "4": "Total required return."
            }
          },
          {
            "type": "runnable_code",
            "filename": "gordon_ke_demo.js",
            "initialCode": "function calculateGordonKe(d0, p0, gPct) {\n  const g = gPct / 100;\n  const d1 = d0 * (1 + g);\n  const divYield = (d1 / p0) * 100;\n  const ke = divYield + gPct;\n  return {\n    expectedDividendD1: Number(d1.toFixed(2)),\n    dividendYieldPercent: Number(divYield.toFixed(2)),\n    costOfEquityPercent: Number(ke.toFixed(2)),\n    status: 'GORDON_KE_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateGordonKe(4, 50, 4)));",
            "expectedOutput": "{\"expectedDividendD1\":4.16,\"dividendYieldPercent\":8.32,\"costOfEquityPercent\":12.32,\"status\":\"GORDON_KE_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the expected next year dividend ($D_1$) when current dividend $D_0 = $4 and growth rate $g = 4\\%$ ($4 \\times 1.04$)?",
          "expectedStringOutput": "4.16",
          "acceptableAnswers": [
            "4.16",
            "$4.16",
            "expectedDividendD1\":4.16"
          ],
          "primaryMisconceptionId": "MC_FIN_COST_OF_EQUITY_CAPM_AND_DIVIDEND_GROWTH",
          "diagnosisMap": {
            "4.00": {
              "misconceptionId": "MC_FIN_COST_OF_EQUITY_CAPM_AND_DIVIDEND_GROWTH",
              "errorExplanation": "D1 grows by 4%: 4 * 1.04 = $4.16.",
              "recoveryPath": {
                "simplerExplanation": "4 * 1.04 = 4.16.",
                "guidedFixPrompt": "Type 4.16"
              }
            }
          }
        }
      },
      {
        "id": "fin-d13-b3-cost-of-retained-earnings-kr",
        "day": 13,
        "blockNumber": 3,
        "title": "Cost of Retained Earnings ($K_r$) vs Fresh Equity ($K_e$)",
        "conceptBudget": {
          "primaryConcept": "Cost of Retained Earnings ($K_r$)",
          "supportingTerms": [
            "$K_r = K_e$ (Opportunity cost: shareholders could have earned $K_e$ elsewhere if paid as dividend!)",
            "Fresh Equity has higher cost due to Flotation Costs ($K_e > K_r$)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d13-b2-gordon-dividend-growth-ke",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "kr_demo.js",
            "initialCode": "function evaluateRetainedEarningsCost() {\n  return 'COST_OF_RETAINED_EARNINGS_EQUALS_EQUITY_OPPORTUNITY_COST_WITHOUT_FLOTATION';\n}\n\nconsole.log(evaluateRetainedEarningsCost());",
            "expectedOutput": "COST_OF_RETAINED_EARNINGS_EQUALS_EQUITY_OPPORTUNITY_COST_WITHOUT_FLOTATION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Why does Retained Earnings carry an explicit Cost of Capital ($K_r$) equal to the Cost of Equity?",
          "expectedStringOutput": "COST_OF_RETAINED_EARNINGS_EQUALS_EQUITY_OPPORTUNITY_COST_WITHOUT_FLOTATION",
          "acceptableAnswers": [
            "COST_OF_RETAINED_EARNINGS_EQUALS_EQUITY_OPPORTUNITY_COST_WITHOUT_FLOTATION",
            "Opportunity cost",
            "Shareholder opportunity cost"
          ],
          "primaryMisconceptionId": "MC_FIN_COST_OF_EQUITY_CAPM_AND_DIVIDEND_GROWTH",
          "diagnosisMap": {
            "FREE": {
              "misconceptionId": "MC_FIN_COST_OF_EQUITY_CAPM_AND_DIVIDEND_GROWTH",
              "errorExplanation": "Retained earnings is not free capital; it carries an opportunity cost equal to Ke.",
              "recoveryPath": {
                "simplerExplanation": "Carries shareholder opportunity cost.",
                "guidedFixPrompt": "Type COST_OF_RETAINED_EARNINGS_EQUALS_EQUITY_OPPORTUNITY_COST_WITHOUT_FLOTATION"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 14,
    "title": "Weighted Average Cost of Capital (WACC) & Overall Hurdle Rate",
    "overviewMetaphor": "WACC is the Blended Fuel Price of a Multi-Engine Rocket: a rocket uses 60% expensive High-Octane Equity Fuel (costing 15%) and 40% cheaper After-Tax Debt Fuel (costing 7.5%); the Weighted Average Cost of Capital (WACC) blends both fuel streams together: $(0.60 \\times 15\\%) + (0.40 \\times 7.5\\%) = 12.0\\%$; WACC is the ultimate benchmark hurdle rate: any corporate project that earns less than 12% is burning more fuel than the rocket generates—destroying company value.",
    "blocks": [
      {
        "id": "fin-d14-b1-wacc-blended-formula",
        "day": 14,
        "blockNumber": 1,
        "title": "Weighted Average Cost of Capital (WACC) Equation: $WACC = w_e K_e + w_d K_d$",
        "conceptBudget": {
          "primaryConcept": "WACC Blended Formula",
          "supportingTerms": [
            "$WACC = w_e K_e + w_d K_d(1 - t) + w_p K_p$",
            "$w_e = \\frac{E}{V}$ (Weight of Equity)",
            "$w_d = \\frac{D}{V}$ (Weight of Debt where $V = E + D$)",
            "Overall Corporate Hurdle Rate"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d13-b1-capm-cost-of-equity",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "WACC Weighted Calculation ($1M Firm: 60% Equity, 40% Debt)",
              "boxes": [
                {
                  "label": "Equity Portion (60% @ 15% Ke)",
                  "value": "Weight $w_e = 0.60$ | Weighted Equity Cost = $0.60 \\times 15\\% = 9.0\\%$",
                  "varType": "Equity Leg",
                  "isUpdated": false
                },
                {
                  "label": "Debt Portion (40% @ 7.5% Kd)",
                  "value": "Weight $w_d = 0.40$ | Weighted Debt Cost = $0.40 \\times 7.5\\% = 3.0\\%$",
                  "varType": "Debt Leg",
                  "isUpdated": false
                },
                {
                  "label": "Composite WACC",
                  "value": "$9.0\\% + 3.0\\% = 12.0\\%$ Corporate Hurdle Rate!",
                  "varType": "WACC Result",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "wacc_calc_demo.js",
            "initialCode": "function calculateWacc(e, d, kePct, kdPrePct, tPct) {\n  const totalV = e + d;\n  const we = e / totalV;\n  const wd = d / totalV;\n  const kdAfter = kdPrePct * (1 - tPct / 100);\n  const wacc = we * kePct + wd * kdAfter;\n  return {\n    equityWeight: Number(we.toFixed(2)),\n    debtWeight: Number(wd.toFixed(2)),\n    afterTaxCostOfDebt: Number(kdAfter.toFixed(2)),\n    compositeWaccPercent: Number(wacc.toFixed(2)),\n    status: 'WACC_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateWacc(600000, 400000, 15, 10, 25)));",
            "expectedOutput": "{\"equityWeight\":0.6,\"debtWeight\":0.4,\"afterTaxCostOfDebt\":7.5,\"compositeWaccPercent\":12,\"status\":\"WACC_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the composite WACC percentage for a company with 60% Equity ($K_e = 15\\%$) and 40% Debt ($K_d = 7.5\\%$) ($0.60 \\times 15 + 0.40 \\times 7.5$)?",
          "expectedStringOutput": "12",
          "acceptableAnswers": [
            "12",
            "12%",
            "12.0",
            "compositeWaccPercent\":12"
          ],
          "primaryMisconceptionId": "MC_FIN_WEIGHTED_AVERAGE_COST_OF_CAPITAL_WACC",
          "diagnosisMap": {
            "11.25": {
              "misconceptionId": "MC_FIN_WEIGHTED_AVERAGE_COST_OF_CAPITAL_WACC",
              "errorExplanation": "11.25% is an unweighted average ((15+7.5)/2). Weighted WACC is 0.6*15 + 0.4*7.5 = 12.0%.",
              "recoveryPath": {
                "simplerExplanation": "0.6*15 + 0.4*7.5 = 12.0%.",
                "guidedFixPrompt": "Type 12"
              }
            }
          }
        }
      },
      {
        "id": "fin-d14-b2-book-value-vs-market-value-weights",
        "day": 14,
        "blockNumber": 2,
        "title": "Book Value Weights vs Market Value Weights in WACC",
        "conceptBudget": {
          "primaryConcept": "Capital Weighting Systems",
          "supportingTerms": [
            "Book Value Weights (Historical accounting values from Balance Sheet)",
            "Market Value Weights (Current trading prices of shares and bonds $\\implies$ THEORETICALLY SUPERIOR!)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d14-b1-wacc-blended-formula",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "weights_demo.js",
            "initialCode": "function evaluateWeightingSystem(isMarketValue) {\n  return isMarketValue\n    ? 'MARKET_VALUE_WEIGHTS_ARE_ECONOMICALLY_SUPERIOR_REFLECTING_OPPORTUNITY_COST'\n    : 'BOOK_VALUE_WEIGHTS_DISTORTED_BY_HISTORICAL_ACCOUNTING';\n}\n\nconsole.log(evaluateWeightingSystem(true));\nconsole.log(evaluateWeightingSystem(false));",
            "expectedOutput": "MARKET_VALUE_WEIGHTS_ARE_ECONOMICALLY_SUPERIOR_REFLECTING_OPPORTUNITY_COST\nBOOK_VALUE_WEIGHTS_DISTORTED_BY_HISTORICAL_ACCOUNTING",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Why are Market Value Weights theoretically superior to Book Value Weights when computing WACC?",
          "expectedStringOutput": "MARKET_VALUE_WEIGHTS_ARE_ECONOMICALLY_SUPERIOR_REFLECTING_OPPORTUNITY_COST",
          "acceptableAnswers": [
            "MARKET_VALUE_WEIGHTS_ARE_ECONOMICALLY_SUPERIOR_REFLECTING_OPPORTUNITY_COST",
            "Reflects opportunity cost",
            "Economically superior"
          ],
          "primaryMisconceptionId": "MC_FIN_WEIGHTED_AVERAGE_COST_OF_CAPITAL_WACC",
          "diagnosisMap": {
            "BOOK": {
              "misconceptionId": "MC_FIN_WEIGHTED_AVERAGE_COST_OF_CAPITAL_WACC",
              "errorExplanation": "Market value weights reflect current economic reality and true opportunity cost of capital.",
              "recoveryPath": {
                "simplerExplanation": "Market value reflects true opportunity cost.",
                "guidedFixPrompt": "Type MARKET_VALUE_WEIGHTS_ARE_ECONOMICALLY_SUPERIOR_REFLECTING_OPPORTUNITY_COST"
              }
            }
          }
        }
      },
      {
        "id": "fin-d14-b3-marginal-cost-of-capital-mcc",
        "day": 14,
        "blockNumber": 3,
        "title": "Marginal Cost of Capital (MCC) & Investment Opportunity Schedule (IOS)",
        "conceptBudget": {
          "primaryConcept": "Marginal Cost of Capital (MCC)",
          "supportingTerms": [
            "Marginal Cost of Capital ($MCC$: Cost of obtaining the next additional dollar of new capital)",
            "Break-Points in Capital Raising (When low-cost retained earnings are exhausted)",
            "Optimal Capital Budgeting where $MCC = IOS$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d14-b2-book-value-vs-market-value-weights",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "mcc_demo.js",
            "initialCode": "function evaluateOptimalBudgetIntersection() {\n  return 'OPTIMAL_CAPITAL_BUDGET_IS_THE_INTERSECTION_OF_MCC_AND_IOS';\n}\n\nconsole.log(evaluateOptimalBudgetIntersection());",
            "expectedOutput": "OPTIMAL_CAPITAL_BUDGET_IS_THE_INTERSECTION_OF_MCC_AND_IOS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Where is the optimal corporate capital budget determined in finance theory?",
          "expectedStringOutput": "OPTIMAL_CAPITAL_BUDGET_IS_THE_INTERSECTION_OF_MCC_AND_IOS",
          "acceptableAnswers": [
            "OPTIMAL_CAPITAL_BUDGET_IS_THE_INTERSECTION_OF_MCC_AND_IOS",
            "Intersection of MCC and IOS",
            "MCC = IOS"
          ],
          "primaryMisconceptionId": "MC_FIN_WEIGHTED_AVERAGE_COST_OF_CAPITAL_WACC",
          "diagnosisMap": {
            "LOWEST": {
              "misconceptionId": "MC_FIN_WEIGHTED_AVERAGE_COST_OF_CAPITAL_WACC",
              "errorExplanation": "Optimal budget is where Marginal Cost of Capital intersects the Investment Opportunity Schedule (MCC = IOS).",
              "recoveryPath": {
                "simplerExplanation": "Intersection of MCC and IOS.",
                "guidedFixPrompt": "Type OPTIMAL_CAPITAL_BUDGET_IS_THE_INTERSECTION_OF_MCC_AND_IOS"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 15,
    "title": "⭐ MILESTONE 2: Complete Capital Budgeting & Cost of Capital Valuation Engine",
    "overviewMetaphor": "Milestone 2 Synthesis: The complete sovereign corporate capital budgeting and valuation engine: 1. Multi-project NPV and IRR decision rules; 2. Debt tax shield and CAPM cost of equity estimation; 3. Enterprise WACC composite hurdle rate determination; 4. Capital rationing and optimal capital budget synthesis.",
    "blocks": [
      {
        "id": "fin-d15-b1-capital-budgeting-wacc-engine-synthesis",
        "day": 15,
        "blockNumber": 1,
        "title": "Capital Budgeting & WACC Valuation Master Engine Synthesis",
        "conceptBudget": {
          "primaryConcept": "Capital Budgeting & WACC Synthesis",
          "supportingTerms": [
            "NPV Decision Engine",
            "IRR Newton-Raphson Solver",
            "WACC Composite Engine",
            "Capital Rationing Optimizer"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d14-b3-marginal-cost-of-capital-mcc",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Milestone 2 Corporate Valuation Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "Computes After-Tax Cost of Debt ($K_d$) and CAPM Cost of Equity ($K_e$)",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Determines Enterprise Weighted Average Cost of Capital (WACC = 12%)",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Evaluates multi-year project cash flows at WACC discount rate",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Validates NPV > 0 and IRR > Hurdle rate to certify value creation!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "cb_wacc_engine_demo.js",
            "initialCode": "function runCapitalBudgetingWaccEngine() {\n  return {\n    costOfDebtSubsystem: 'ONLINE_TAX_SHIELD_ACTIVE',\n    costOfEquitySubsystem: 'ONLINE_CAPM_GORDON_ACTIVE',\n    waccHurdleSubsystem: 'ONLINE_COMPOSITE_RATE_COMPUTED',\n    npvIrrSubsystem: 'ONLINE_CAPITAL_BUDGETING_DECISION_ACTIVE',\n    engineStatus: 'CAPITAL_BUDGETING_WACC_MASTER_ACTIVE'\n  };\n}\n\nconsole.log(runCapitalBudgetingWaccEngine().engineStatus);",
            "expectedOutput": "CAPITAL_BUDGETING_WACC_MASTER_ACTIVE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What engine status confirms active operational synthesis of the Capital Budgeting & WACC Master Engine?",
          "expectedStringOutput": "CAPITAL_BUDGETING_WACC_MASTER_ACTIVE",
          "acceptableAnswers": [
            "CAPITAL_BUDGETING_WACC_MASTER_ACTIVE",
            "engineStatus: CAPITAL_BUDGETING_WACC_MASTER_ACTIVE"
          ],
          "primaryMisconceptionId": "MC_FIN_CAPITAL_BUDGETING_NET_PRESENT_VALUE_NPV",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_FIN_CAPITAL_BUDGETING_NET_PRESENT_VALUE_NPV",
              "errorExplanation": "Matches CAPITAL_BUDGETING_WACC_MASTER_ACTIVE.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type CAPITAL_BUDGETING_WACC_MASTER_ACTIVE"
              }
            }
          }
        }
      },
      {
        "id": "fin-d15-b2-capital-budgeting-audit",
        "day": 15,
        "blockNumber": 2,
        "title": "Capital Budgeting & Valuation Invariant Audit",
        "conceptBudget": {
          "primaryConcept": "Valuation Invariant Verification",
          "supportingTerms": [
            "NPV Invariant",
            "WACC Invariant",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d15-b1-capital-budgeting-wacc-engine-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "cb_audit_demo.js",
            "initialCode": "function auditCapitalBudgetingSystem(waccValid, npvValid, irrValid) {\n  const passed = waccValid && npvValid && irrValid;\n  return {\n    waccVerified: waccValid,\n    npvVerified: npvValid,\n    irrVerified: irrValid,\n    grade: passed ? 'CAPITAL_BUDGETING_VALUATION_AUDIT_PASSED' : 'AUDIT_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditCapitalBudgetingSystem(true, true, true)));",
            "expectedOutput": "{\"waccVerified\":true,\"npvVerified\":true,\"irrVerified\":true,\"grade\":\"CAPITAL_BUDGETING_VALUATION_AUDIT_PASSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade is awarded when WACC, NPV, and IRR capital budgeting engines pass 100%?",
          "expectedStringOutput": "CAPITAL_BUDGETING_VALUATION_AUDIT_PASSED",
          "acceptableAnswers": [
            "CAPITAL_BUDGETING_VALUATION_AUDIT_PASSED",
            "grade\":\"CAPITAL_BUDGETING_VALUATION_AUDIT_PASSED\""
          ],
          "primaryMisconceptionId": "MC_FIN_CAPITAL_BUDGETING_NET_PRESENT_VALUE_NPV",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_FIN_CAPITAL_BUDGETING_NET_PRESENT_VALUE_NPV",
              "errorExplanation": "All checks passing awards CAPITAL_BUDGETING_VALUATION_AUDIT_PASSED.",
              "recoveryPath": {
                "simplerExplanation": "Awards CAPITAL_BUDGETING_VALUATION_AUDIT_PASSED.",
                "guidedFixPrompt": "Type CAPITAL_BUDGETING_VALUATION_AUDIT_PASSED"
              }
            }
          }
        }
      },
      {
        "id": "fin-d15-b3-milestone2-finance-cert",
        "day": 15,
        "blockNumber": 3,
        "title": "Milestone 2 Capital Budgeting & Valuation Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 2 Certification",
          "supportingTerms": [
            "Valuation Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d15-b2-capital-budgeting-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone2_fin_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 2: Complete Capital Budgeting & Cost of Capital Valuation Engine [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 2: Complete Capital Budgeting & Cost of Capital Valuation Engine [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 2 completion?",
          "expectedStringOutput": "⭐ MILESTONE 2: Complete Capital Budgeting & Cost of Capital Valuation Engine [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 2: Complete Capital Budgeting & Cost of Capital Valuation Engine [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_FIN_CAPITAL_BUDGETING_NET_PRESENT_VALUE_NPV",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_FIN_CAPITAL_BUDGETING_NET_PRESENT_VALUE_NPV",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 2: Complete Capital Budgeting & Cost of Capital Valuation Engine [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 16,
    "title": "Operating, Financial & Combined Leverage: DOL, DFL & DCL",
    "overviewMetaphor": "Financial Leverage is a Crowbar That Multiplies Every Movement in Sales: Operating Leverage (DOL) uses heavy fixed factory machines ($FC$) so that a 10% increase in sales creates a 15% surge in operating profit (EBIT); Financial Leverage (DFL) uses fixed interest debt to magnify that 15% EBIT surge into a 20% explosion in Earnings Per Share (EPS); Combined Leverage ($DCL = DOL \\times DFL = 1.5 \\times 1.33 = 2.0$) measures the total crowbar power—a 10% sales gain doubles earnings, but a 10% drop hits twice as hard.",
    "blocks": [
      {
        "id": "fin-d16-b1-degree-of-operating-leverage-dol",
        "day": 16,
        "blockNumber": 1,
        "title": "Degree of Operating Leverage (DOL): Fixed Operating Costs Magnifier",
        "conceptBudget": {
          "primaryConcept": "Degree of Operating Leverage (DOL)",
          "supportingTerms": [
            "$DOL = \\frac{\\text{Contribution}}{\\text{EBIT}} = \\frac{\\text{Sales} - \\text{Variable Cost}}{\\text{Sales} - \\text{Variable Cost} - \\text{Fixed Cost}}$",
            "Percentage Magnification: $DOL = \\frac{\\% \\Delta \\text{EBIT}}{\\% \\Delta \\text{Sales}}$",
            "High Fixed Costs $\\implies$ High Business Risk"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d14-b1-wacc-blended-formula",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "DOL Calculation ($500k Sales, $200k VC, $100k FC)",
              "boxes": [
                {
                  "label": "Contribution ($500k - $200k)",
                  "value": "Contribution = $300,000",
                  "varType": "Contribution",
                  "isUpdated": false
                },
                {
                  "label": "Operating Profit (EBIT)",
                  "value": "EBIT = $300,000 - $100,000 Fixed Cost = $200,000",
                  "varType": "EBIT",
                  "isUpdated": false
                },
                {
                  "label": "Degree of Operating Leverage",
                  "value": "DOL = $300,000 / $200,000 = 1.50 (A 10% sales rise boosts EBIT by 15%!)",
                  "varType": "DOL Result",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "dol_calc_demo.js",
            "initialCode": "function calculateDol(sales, vc, fc) {\n  const contribution = sales - vc;\n  const ebit = contribution - fc;\n  const dol = contribution / ebit;\n  return {\n    contribution,\n    ebit,\n    degreeOfOperatingLeverage: Number(dol.toFixed(2)),\n    ebitSensitivityPercentFor10PctSalesRise: Number((dol * 10).toFixed(2)),\n    status: 'DOL_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateDol(500000, 200000, 100000)));",
            "expectedOutput": "{\"contribution\":300000,\"ebit\":200000,\"degreeOfOperatingLeverage\":1.5,\"ebitSensitivityPercentFor10PctSalesRise\":15,\"status\":\"DOL_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Degree of Operating Leverage (DOL) for a firm with $300,000 Contribution and $200,000 EBIT ($300000 / 200000$)?",
          "expectedStringOutput": "1.5",
          "acceptableAnswers": [
            "1.5",
            "1.50",
            "degreeOfOperatingLeverage\":1.5"
          ],
          "primaryMisconceptionId": "MC_FIN_OPERATING_FINANCIAL_COMBINED_LEVERAGE",
          "diagnosisMap": {
            "0.67": {
              "misconceptionId": "MC_FIN_OPERATING_FINANCIAL_COMBINED_LEVERAGE",
              "errorExplanation": "DOL is Contribution / EBIT = 300,000 / 200,000 = 1.50.",
              "recoveryPath": {
                "simplerExplanation": "300000 / 200000 = 1.5.",
                "guidedFixPrompt": "Type 1.5"
              }
            }
          }
        }
      },
      {
        "id": "fin-d16-b2-degree-of-financial-leverage-dfl",
        "day": 16,
        "blockNumber": 2,
        "title": "Degree of Financial Leverage (DFL): Fixed Interest Debt Magnifier",
        "conceptBudget": {
          "primaryConcept": "Degree of Financial Leverage (DFL)",
          "supportingTerms": [
            "$DFL = \\frac{\\text{EBIT}}{\\text{EBT}} = \\frac{\\text{EBIT}}{\\text{EBIT} - \\text{Interest}}$",
            "Percentage Magnification: $DFL = \\frac{\\% \\Delta \\text{EPS}}{\\% \\Delta \\text{EBIT}}$",
            "High Debt Interest $\\implies$ High Financial Risk"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d16-b1-degree-of-operating-leverage-dol",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "DFL Calculation ($200k EBIT, $50k Interest)",
            "codeSnippet": "EBIT = $200,000\nInterest Expense = $50,000\nEBT = EBIT - Interest = $200,000 - $50,000 = $150,000\nDFL = EBIT / EBT = 200,000 / 150,000 = 1.33",
            "lineNotes": {
              "1": "Operating profit.",
              "3": "Earnings before tax.",
              "4": "Financial leverage multiplier."
            }
          },
          {
            "type": "runnable_code",
            "filename": "dfl_calc_demo.js",
            "initialCode": "function calculateDfl(ebit, interest) {\n  const ebt = ebit - interest;\n  const dfl = ebit / ebt;\n  return {\n    ebit,\n    ebt,\n    degreeOfFinancialLeverage: Number(dfl.toFixed(2)),\n    status: 'DFL_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateDfl(200000, 50000)));",
            "expectedOutput": "{\"ebit\":200000,\"ebt\":150000,\"degreeOfFinancialLeverage\":1.33,\"status\":\"DFL_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Degree of Financial Leverage (DFL) when EBIT is $200,000 and Interest is $50,000 ($200000 / 150000$)?",
          "expectedStringOutput": "1.33",
          "acceptableAnswers": [
            "1.33",
            "degreeOfFinancialLeverage\":1.33"
          ],
          "primaryMisconceptionId": "MC_FIN_OPERATING_FINANCIAL_COMBINED_LEVERAGE",
          "diagnosisMap": {
            "4.0": {
              "misconceptionId": "MC_FIN_OPERATING_FINANCIAL_COMBINED_LEVERAGE",
              "errorExplanation": "DFL is EBIT / (EBIT - Interest) = 200k / 150k = 1.33.",
              "recoveryPath": {
                "simplerExplanation": "200000 / 150000 = 1.33.",
                "guidedFixPrompt": "Type 1.33"
              }
            }
          }
        }
      },
      {
        "id": "fin-d16-b3-degree-of-combined-leverage-dcl",
        "day": 16,
        "blockNumber": 3,
        "title": "Degree of Combined Leverage (DCL): Total Corporate Risk Multiplier",
        "conceptBudget": {
          "primaryConcept": "Degree of Combined Leverage (DCL)",
          "supportingTerms": [
            "$DCL = DOL \\times DFL = \\frac{\\text{Contribution}}{\\text{EBT}}$",
            "Total Sensitivity: $DCL = \\frac{\\% \\Delta \\text{EPS}}{\\% \\Delta \\text{Sales}}$",
            "Balancing Operating Risk and Financial Risk"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d16-b2-degree-of-financial-leverage-dfl",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "dcl_calc_demo.js",
            "initialCode": "function calculateDcl(dol, dfl) {\n  const dcl = dol * dfl;\n  return {\n    dol,\n    dfl,\n    degreeOfCombinedLeverage: Number(dcl.toFixed(2)),\n    status: 'DCL_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateDcl(1.50, 1.333333)));",
            "expectedOutput": "{\"dol\":1.5,\"dfl\":1.333333,\"degreeOfCombinedLeverage\":2,\"status\":\"DCL_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Degree of Combined Leverage (DCL) for a corporation with DOL of 1.50 and DFL of 1.333 ($1.50 \\times 1.333$)?",
          "expectedStringOutput": "2",
          "acceptableAnswers": [
            "2",
            "2.0",
            "2.00",
            "degreeOfCombinedLeverage\":2"
          ],
          "primaryMisconceptionId": "MC_FIN_OPERATING_FINANCIAL_COMBINED_LEVERAGE",
          "diagnosisMap": {
            "2.83": {
              "misconceptionId": "MC_FIN_OPERATING_FINANCIAL_COMBINED_LEVERAGE",
              "errorExplanation": "DCL multiplies DOL and DFL (1.50 * 1.333 = 2.0), not adds them.",
              "recoveryPath": {
                "simplerExplanation": "1.5 * 1.333 = 2.0.",
                "guidedFixPrompt": "Type 2"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 17,
    "title": "Break-Even Analysis & Margin of Safety",
    "overviewMetaphor": "The Break-Even Point is Climbing Out of the Water to Take Your First Breath of Air: you invest $100,000 in fixed overhead rent ($FC$); each product you sell for $50 costs $30 in raw materials, leaving a $20 Contribution Margin per unit; selling 5,000 units covers your entire $100,000 rent exactly ($Q_{BE} = 100,000 / 20 = 5,000$ units); every unit sold beyond 5,000 units is your Margin of Safety—pure profit cushion protecting you from drowning if a storm hits.",
    "blocks": [
      {
        "id": "fin-d17-b1-bep-units-and-dollars-formula",
        "day": 17,
        "blockNumber": 1,
        "title": "Break-Even Point in Units ($Q_{BE} = \\frac{FC}{P - V}$) & Sales Dollars",
        "conceptBudget": {
          "primaryConcept": "Break-Even Point Formula",
          "supportingTerms": [
            "Contribution Margin per Unit ($CM = P - V$)",
            "Profit-Volume (P/V) Ratio ($\\frac{P - V}{P} \\times 100\\%$)",
            "$Q_{BE} = \\frac{\\text{Fixed Cost}}{P - V}$",
            "$\\text{BES (\\$)} = \\frac{\\text{Fixed Cost}}{\\text{P/V Ratio}} = Q_{BE} \\times P$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d16-b1-degree-of-operating-leverage-dol",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Break-Even Dynamics ($100k FC, P=$50, V=$30)",
              "boxes": [
                {
                  "label": "Unit Contribution ($50 - $30)",
                  "value": "$20 contribution per unit (40% P/V Ratio)",
                  "varType": "Unit Contribution",
                  "isUpdated": false
                },
                {
                  "label": "Break-Even Volume (Units)",
                  "value": "$100,000 / $20 = EXACTLY 5,000 Units to break even!",
                  "varType": "BEP Units",
                  "isUpdated": false
                },
                {
                  "label": "Break-Even Revenue ($)",
                  "value": "5,000 units x $50 = $250,000 Break-Even Sales Revenue",
                  "varType": "BEP Revenue",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "bep_calc_demo.js",
            "initialCode": "function calculateBep(fc, p, v) {\n  const cm = p - v;\n  const pvRatio = (cm / p) * 100;\n  const bepUnits = fc / cm;\n  const bepRevenue = bepUnits * p;\n  return {\n    fixedCost: fc,\n    unitContribution: cm,\n    pvRatioPercent: pvRatio,\n    breakEvenUnits: Math.round(bepUnits),\n    breakEvenSalesDollars: Math.round(bepRevenue),\n    status: 'BEP_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateBep(100000, 50, 30)));",
            "expectedOutput": "{\"fixedCost\":100000,\"unitContribution\":20,\"pvRatioPercent\":40,\"breakEvenUnits\":5000,\"breakEvenSalesDollars\":250000,\"status\":\"BEP_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many units must a firm sell to break even when Fixed Costs are $100,000, Selling Price is $50, and Variable Cost is $30 ($100000 / (50 - 30)$)?",
          "expectedStringOutput": "5000",
          "acceptableAnswers": [
            "5000",
            "5,000",
            "5000 units",
            "breakEvenUnits\":5000"
          ],
          "primaryMisconceptionId": "MC_FIN_BREAK_EVEN_POINT_AND_MARGIN_OF_SAFETY",
          "diagnosisMap": {
            "2000": {
              "misconceptionId": "MC_FIN_BREAK_EVEN_POINT_AND_MARGIN_OF_SAFETY",
              "errorExplanation": "100,000 / 50 = 2,000 forgets variable cost. Correct is 100,000 / (50 - 30) = 5,000 units.",
              "recoveryPath": {
                "simplerExplanation": "100000 / 20 = 5000.",
                "guidedFixPrompt": "Type 5000"
              }
            }
          }
        }
      },
      {
        "id": "fin-d17-b2-margin-of-safety-mos",
        "day": 17,
        "blockNumber": 2,
        "title": "Margin of Safety (MOS): Buffer Above Break-Even",
        "conceptBudget": {
          "primaryConcept": "Margin of Safety (MOS) Equation",
          "supportingTerms": [
            "$\\text{MOS (\\$)} = \\text{Actual Sales} - \\text{Break-Even Sales}$",
            "$\\text{MOS \\%} = \\frac{\\text{Actual Sales} - \\text{Break-Even Sales}}{\\text{Actual Sales}} \\times 100\\%$",
            "$\\text{Profit} = \\text{MOS} \\times \\text{P/V Ratio}$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d17-b1-bep-units-and-dollars-formula",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Margin of Safety Math ($400k Actual, $250k BES)",
            "codeSnippet": "Actual Sales = $400,000\nBreak-Even Sales = $250,000\nMargin of Safety ($) = 400,000 - 250,000 = $150,000\nMargin of Safety (%) = (150,000 / 400,000) * 100 = 37.5%",
            "lineNotes": {
              "1": "Current operating sales.",
              "3": "Safety buffer dollars.",
              "4": "Percentage risk cushion."
            }
          },
          {
            "type": "runnable_code",
            "filename": "mos_calc_demo.js",
            "initialCode": "function calculateMos(actualSales, bepSales) {\n  const mos = actualSales - bepSales;\n  const mosPct = (mos / actualSales) * 100;\n  return {\n    actualSales,\n    breakEvenSales: bepSales,\n    marginOfSafetyDollars: mos,\n    marginOfSafetyPercent: Number(mosPct.toFixed(2)),\n    status: 'MOS_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateMos(400000, 250000)));",
            "expectedOutput": "{\"actualSales\":400000,\"breakEvenSales\":250000,\"marginOfSafetyDollars\":150000,\"marginOfSafetyPercent\":37.5,\"status\":\"MOS_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Margin of Safety (in dollars) when Actual Sales are $400,000 and Break-Even Sales are $250,000 ($400000 - 250000$)?",
          "expectedStringOutput": "150000",
          "acceptableAnswers": [
            "150000",
            "$150,000",
            "marginOfSafetyDollars\":150000"
          ],
          "primaryMisconceptionId": "MC_FIN_BREAK_EVEN_POINT_AND_MARGIN_OF_SAFETY",
          "diagnosisMap": {
            "250000": {
              "misconceptionId": "MC_FIN_BREAK_EVEN_POINT_AND_MARGIN_OF_SAFETY",
              "errorExplanation": "MOS = Actual - BES = 400,000 - 250,000 = $150,000.",
              "recoveryPath": {
                "simplerExplanation": "400000 - 250000 = 150000.",
                "guidedFixPrompt": "Type 150000"
              }
            }
          }
        }
      },
      {
        "id": "fin-d17-b3-target-profit-volume-planning",
        "day": 17,
        "blockNumber": 3,
        "title": "Target Profit Volume Planning: $Q_{\\text{target}} = \\frac{FC + \\text{Target Profit}}{P - V}$",
        "conceptBudget": {
          "primaryConcept": "Target Profit Sales Volume Formula",
          "supportingTerms": [
            "$Q_{\\text{target}} = \\frac{\\text{Fixed Cost} + \\text{Desired Profit}}{P - V}$",
            "After-Tax Target Profit ($Q_{\\text{target}} = \\frac{\\text{FC} + \\frac{\\text{Desired Net Profit}}{1 - t}}{P - V}$)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d17-b2-margin-of-safety-mos",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "target_profit_demo.js",
            "initialCode": "function calculateTargetVolume(fc, p, v, desiredProfit) {\n  const unitContrib = p - v;\n  const targetUnits = (fc + desiredProfit) / unitContrib;\n  return {\n    fixedCost: fc,\n    desiredProfit,\n    requiredSalesUnits: Math.round(targetUnits),\n    requiredSalesRevenue: Math.round(targetUnits * p),\n    status: 'TARGET_PROFIT_VOLUME_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateTargetVolume(100000, 50, 30, 60000))); // (100k + 60k)/20 = 8,000 units ($400k)",
            "expectedOutput": "{\"fixedCost\":100000,\"desiredProfit\":60000,\"requiredSalesUnits\":8000,\"requiredSalesRevenue\":400000,\"status\":\"TARGET_PROFIT_VOLUME_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many units must be sold to earn a desired profit of $60,000 when Fixed Costs are $100,000 and unit contribution is $20 ($ (100000 + 60000) / 20 $)?",
          "expectedStringOutput": "8000",
          "acceptableAnswers": [
            "8000",
            "8,000",
            "8000 units",
            "requiredSalesUnits\":8000"
          ],
          "primaryMisconceptionId": "MC_FIN_BREAK_EVEN_POINT_AND_MARGIN_OF_SAFETY",
          "diagnosisMap": {
            "5000": {
              "misconceptionId": "MC_FIN_BREAK_EVEN_POINT_AND_MARGIN_OF_SAFETY",
              "errorExplanation": "5,000 units breaks even ($0 profit). To earn $60,000 profit requires (100k + 60k) / 20 = 8,000 units.",
              "recoveryPath": {
                "simplerExplanation": "160000 / 20 = 8000.",
                "guidedFixPrompt": "Type 8000"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 18,
    "title": "Working Capital Management & Quarterly Cash Budgeting",
    "overviewMetaphor": "A Cash Budget is the Blood Pressure Monitor of Corporate Solvency: an enterprise may be wildly profitable on paper, but if customers take 90 days to pay while suppliers demand cash in 15 days, the business will suffer cardiac arrest from lack of cash; a Cash Budget forecasts cash receipts and cash disbursements quarter by quarter—alerting the CFO months in advance to arrange a bank overdraft before payroll day.",
    "blocks": [
      {
        "id": "fin-d18-b1-cash-budget-structure-receipts-payments",
        "day": 18,
        "blockNumber": 1,
        "title": "Cash Budget Architecture: Inflows, Outflows & Minimum Cash Float",
        "conceptBudget": {
          "primaryConcept": "Cash Budget Forecasting Architecture",
          "supportingTerms": [
            "Cash Receipts (Cash Sales, Debtors collections lag e.g. 50% month 1, 50% month 2)",
            "Cash Disbursements (Purchases, Salaries, Rent, Taxes, Dividends)",
            "$\\text{Closing Balance} = \\text{Opening Cash} + \\text{Receipts} - \\text{Disbursements}$",
            "Short-Term Overdraft Line"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d17-b1-bep-units-and-dollars-formula",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Quarterly Cash Budget Forecast",
              "boxes": [
                {
                  "label": "Q1 Cash Flow",
                  "value": "Opening: $20k + Receipts: $50k - Payments: $45k = $25,000 Closing (No Overdraft!)",
                  "varType": "Q1 Surplus",
                  "isUpdated": false
                },
                {
                  "label": "Q2 Cash Flow",
                  "value": "Opening: $25k + Receipts: $40k - Payments: $60k = $5,000 Closing (Needs $5k Overdraft to maintain $10k min float!)",
                  "varType": "Q2 Deficit",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "cash_budget_demo.js",
            "initialCode": "function evaluateCashFlowQuarter(opening, inFlow, outFlow, minFloat = 10000) {\n  const closing = opening + inFlow - outFlow;\n  const deficit = closing < minFloat ? (minFloat - closing) : 0;\n  return {\n    openingCash: opening,\n    netCashFlow: inFlow - outFlow,\n    closingCash: closing,\n    overdraftRequired: deficit,\n    status: 'CASH_BUDGET_QUARTER_EVALUATED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateCashFlowQuarter(20000, 50000, 45000)));\nconsole.log(JSON.stringify(evaluateCashFlowQuarter(25000, 40000, 60000)));",
            "expectedOutput": "{\"openingCash\":20000,\"netCashFlow\":5000,\"closingCash\":25000,\"overdraftRequired\":0,\"status\":\"CASH_BUDGET_QUARTER_EVALUATED\"}\n{\"openingCash\":25000,\"netCashFlow\":-20000,\"closingCash\":5000,\"overdraftRequired\":5000,\"status\":\"CASH_BUDGET_QUARTER_EVALUATED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How much bank overdraft financing is required in Q2 when closing cash drops to $5,000 and management policy mandates a $10,000 minimum cash float ($10000 - 5000$)?",
          "expectedStringOutput": "5000",
          "acceptableAnswers": [
            "5000",
            "$5,000",
            "overdraftRequired\":5000"
          ],
          "primaryMisconceptionId": "MC_FIN_WORKING_CAPITAL_CASH_BUDGETING_FORECAST",
          "diagnosisMap": {
            "0": {
              "misconceptionId": "MC_FIN_WORKING_CAPITAL_CASH_BUDGETING_FORECAST",
              "errorExplanation": "Although cash is positive ($5k), it is $5k below the mandatory $10k float, requiring a $5,000 overdraft.",
              "recoveryPath": {
                "simplerExplanation": "10000 - 5000 = 5000.",
                "guidedFixPrompt": "Type 5000"
              }
            }
          }
        }
      },
      {
        "id": "fin-d18-b2-working-capital-financing-strategies",
        "day": 18,
        "blockNumber": 2,
        "title": "Working Capital Financing: Conservative, Aggressive & Matching (Hedging) Approaches",
        "conceptBudget": {
          "primaryConcept": "Working Capital Financing Strategies",
          "supportingTerms": [
            "Matching / Hedging Approach (Fixed assets & permanent working capital funded by long-term debt; temporary spikes funded by short-term loans)",
            "Aggressive Approach (Funding permanent assets with short-term cheap debt $\\implies$ High liquidity risk!)",
            "Conservative Approach (Funding everything with long-term capital $\\implies$ Safe but expensive)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d18-b1-cash-budget-structure-receipts-payments",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "wc_strategy_demo.js",
            "initialCode": "function evaluateWcStrategy(strategyName) {\n  if (strategyName === 'MATCHING_HEDGING') return 'MATURITY_OF_DEBT_MATCHES_LIFE_OF_ASSET';\n  if (strategyName === 'AGGRESSIVE') return 'USES_SHORT_TERM_DEBT_FOR_PERMANENT_ASSETS_HIGH_RISK';\n  return 'USES_LONG_TERM_CAPITAL_FOR_ALL_ASSETS_LOW_RISK_LOW_RETURN';\n}\n\nconsole.log(evaluateWcStrategy('MATCHING_HEDGING'));\nconsole.log(evaluateWcStrategy('AGGRESSIVE'));",
            "expectedOutput": "MATURITY_OF_DEBT_MATCHES_LIFE_OF_ASSET\nUSES_SHORT_TERM_DEBT_FOR_PERMANENT_ASSETS_HIGH_RISK",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What core financial principle governs the Matching / Hedging Approach to working capital financing?",
          "expectedStringOutput": "MATURITY_OF_DEBT_MATCHES_LIFE_OF_ASSET",
          "acceptableAnswers": [
            "MATURITY_OF_DEBT_MATCHES_LIFE_OF_ASSET",
            "Maturity matches life",
            "Maturity matching"
          ],
          "primaryMisconceptionId": "MC_FIN_WORKING_CAPITAL_CASH_BUDGETING_FORECAST",
          "diagnosisMap": {
            "SHORT_TERM": {
              "misconceptionId": "MC_FIN_WORKING_CAPITAL_CASH_BUDGETING_FORECAST",
              "errorExplanation": "Matching approach matches asset life with debt maturity.",
              "recoveryPath": {
                "simplerExplanation": "Matches maturity of debt with asset life.",
                "guidedFixPrompt": "Type MATURITY_OF_DEBT_MATCHES_LIFE_OF_ASSET"
              }
            }
          }
        }
      },
      {
        "id": "fin-d18-b3-operating-cycle-cash-turnover",
        "day": 18,
        "blockNumber": 3,
        "title": "Cash Turnover & Minimum Operating Cash Equation",
        "conceptBudget": {
          "primaryConcept": "Cash Turnover Invariant",
          "supportingTerms": [
            "$\\text{Cash Turnover} = \\frac{365}{\\text{Cash Conversion Cycle (Days)}}$",
            "$\\text{Minimum Operating Cash} = \\frac{\\text{Total Annual Operating Outlays}}{\\text{Cash Turnover}}$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d18-b2-working-capital-financing-strategies",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "cash_turnover_demo.js",
            "initialCode": "function calculateMinOperatingCash(annualOutlays, cccDays) {\n  const turnover = 365 / cccDays;\n  const minCash = annualOutlays / turnover;\n  return {\n    annualOutlays,\n    cashConversionCycleDays: cccDays,\n    cashTurnoverPerYear: Number(turnover.toFixed(2)),\n    minimumOperatingCashRequired: Math.round(minCash),\n    status: 'MIN_CASH_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateMinOperatingCash(3650000, 36.5)));",
            "expectedOutput": "{\"annualOutlays\":3650000,\"cashConversionCycleDays\":36.5,\"cashTurnoverPerYear\":10,\"minimumOperatingCashRequired\":365000,\"status\":\"MIN_CASH_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Minimum Operating Cash required for a firm with $3,650,000 in annual outlays and a Cash Turnover of 10 times per year ($3650000 / 10$)?",
          "expectedStringOutput": "365000",
          "acceptableAnswers": [
            "365000",
            "$365,000",
            "minimumOperatingCashRequired\":365000"
          ],
          "primaryMisconceptionId": "MC_FIN_WORKING_CAPITAL_CASH_BUDGETING_FORECAST",
          "diagnosisMap": {
            "3650000": {
              "misconceptionId": "MC_FIN_WORKING_CAPITAL_CASH_BUDGETING_FORECAST",
              "errorExplanation": "Cash turns over 10 times, so firm only needs 1/10th of annual outlays = $365,000.",
              "recoveryPath": {
                "simplerExplanation": "3650000 / 10 = 365000.",
                "guidedFixPrompt": "Type 365000"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 19,
    "title": "Capital Structure Theories: Modigliani-Miller (MM) Theorem",
    "overviewMetaphor": "The Modigliani-Miller Theorem is Slicing a Giant Pizza: MM Proposition I without taxes says that whether you slice a $1,000,000 company into 80% equity slices and 20% debt slices, or 50% equity and 50% debt, the total size of the pizza (firm value) never changes; however, in the real world with Corporate Taxes (MM with Taxes), every dollar of debt provides an interest tax shield that bakes EXTRA PIZZA—making the levered firm worth $V_L = V_U + t \\times D$.",
    "blocks": [
      {
        "id": "fin-d19-b1-mm-proposition-1-without-taxes",
        "day": 19,
        "blockNumber": 1,
        "title": "MM Proposition I (Without Taxes): Capital Structure Irrelevance ($V_U = V_L$)",
        "conceptBudget": {
          "primaryConcept": "MM Proposition I (No Taxes)",
          "supportingTerms": [
            "$V_U = V_L = \\frac{\\text{EBIT}}{K_e}$",
            "Assumptions: Perfect capital markets, zero taxes, zero transaction costs, homogeneous expectations",
            "Arbitrage Mechanism: Homemade Leverage proves investors can replicate corporate debt themselves!"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d14-b1-wacc-blended-formula",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "MM Proposition I Irrelevance Paradigm",
              "boxes": [
                {
                  "label": "Unlevered Firm (100% Equity)",
                  "value": "Firm Value $V_U = $1,000,000 | WACC = 12.0%",
                  "varType": "Unlevered",
                  "isUpdated": false
                },
                {
                  "label": "Levered Firm (50% Debt, 50% Equity)",
                  "value": "Firm Value $V_L = $1,000,000 | WACC = 12.0% (Zero value created by debt alone without taxes!)",
                  "varType": "Levered",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "mm_notax_demo.js",
            "initialCode": "function evaluateMmNoTax(ebit, kePct) {\n  const v = ebit / (kePct / 100);\n  return {\n    unleveredValue: Math.round(v),\n    leveredValue: Math.round(v),\n    isCapitalStructureRelevant: false,\n    status: 'MM_PROPOSITION_1_NO_TAX_EVALUATED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateMmNoTax(120000, 12)));",
            "expectedOutput": "{\"unleveredValue\":1000000,\"leveredValue\":1000000,\"isCapitalStructureRelevant\":false,\"status\":\"MM_PROPOSITION_1_NO_TAX_EVALUATED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Under Modigliani-Miller Proposition I without taxes, does changing the debt-equity ratio change the total valuation of the firm?",
          "expectedStringOutput": "false",
          "acceptableAnswers": [
            "false",
            "No",
            "isCapitalStructureRelevant\":false"
          ],
          "primaryMisconceptionId": "MC_FIN_CAPITAL_STRUCTURE_MODIGLIANI_MILLER",
          "diagnosisMap": {
            "true": {
              "misconceptionId": "MC_FIN_CAPITAL_STRUCTURE_MODIGLIANI_MILLER",
              "errorExplanation": "In a tax-free world, MM proves firm value is invariant to capital structure (VU = VL).",
              "recoveryPath": {
                "simplerExplanation": "MM Proposition I without taxes says capital structure is irrelevant.",
                "guidedFixPrompt": "Type false"
              }
            }
          }
        }
      },
      {
        "id": "fin-d19-b2-mm-proposition-1-with-taxes",
        "day": 19,
        "blockNumber": 2,
        "title": "MM Proposition I (With Taxes): Debt Tax Shield & Levered Value ($V_L = V_U + t \\times D$)",
        "conceptBudget": {
          "primaryConcept": "MM Proposition I (With Corporate Taxes)",
          "supportingTerms": [
            "$V_L = V_U + t \\times D$",
            "$t \\times D$ (Present value of permanent interest tax shield)",
            "Implication: Firm value increases linearly with debt; optimal capital structure theoretically approaches 100% debt without distress costs!"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d19-b1-mm-proposition-1-without-taxes",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "MM With Taxes Equation",
            "codeSnippet": "Unlevered Firm Value VU = $1,000,000\nDebt Issued D = $400,000 | Corporate Tax Rate t = 25% (0.25)\nPV of Tax Shield = t * D = 0.25 * 400,000 = $100,000\nLevered Firm Value VL = VU + (t * D) = 1,000,000 + 100,000 = $1,100,000!",
            "lineNotes": {
              "1": "Base unlevered value.",
              "3": "Tax subsidy created by debt.",
              "4": "Total levered value."
            }
          },
          {
            "type": "runnable_code",
            "filename": "mm_taxes_demo.js",
            "initialCode": "function calculateMmVl(vu, d, tPct) {\n  const t = tPct / 100;\n  const taxShield = t * d;\n  const vl = vu + taxShield;\n  return {\n    unleveredFirmValue: vu,\n    debtIssued: d,\n    taxShieldValue: Math.round(taxShield),\n    leveredFirmValue: Math.round(vl),\n    status: 'MM_WITH_TAXES_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateMmVl(1000000, 400000, 25)));",
            "expectedOutput": "{\"unleveredFirmValue\":1000000,\"debtIssued\":400000,\"taxShieldValue\":100000,\"leveredFirmValue\":1100000,\"status\":\"MM_WITH_TAXES_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Levered Firm Value ($V_L$) for a company with $1,000,000 unlevered value, $400,000 debt, and a 25% corporate tax rate ($1000000 + 0.25 \\times 400000$)?",
          "expectedStringOutput": "1100000",
          "acceptableAnswers": [
            "1100000",
            "$1,100,000",
            "leveredFirmValue\":1100000"
          ],
          "primaryMisconceptionId": "MC_FIN_CAPITAL_STRUCTURE_MODIGLIANI_MILLER",
          "diagnosisMap": {
            "1000000": {
              "misconceptionId": "MC_FIN_CAPITAL_STRUCTURE_MODIGLIANI_MILLER",
              "errorExplanation": "With taxes, debt adds a tax shield: 1M + (0.25 * 400k) = $1,100,000.",
              "recoveryPath": {
                "simplerExplanation": "1000000 + 100000 = 1100000.",
                "guidedFixPrompt": "Type 1100000"
              }
            }
          }
        }
      },
      {
        "id": "fin-d19-b3-pecking-order-theory",
        "day": 19,
        "blockNumber": 3,
        "title": "Myers' Pecking Order Theory of Capital Financing",
        "conceptBudget": {
          "primaryConcept": "Pecking Order Hierarchy",
          "supportingTerms": [
            "Hierarchy 1: Internal Retained Earnings (Zero asymmetric information costs)",
            "Hierarchy 2: Low-Risk Debt / Debentures",
            "Hierarchy 3: External Fresh Equity (Last resort due to negative signaling and undervaluation discount)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d19-b2-mm-proposition-1-with-taxes",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "pecking_order_demo.js",
            "initialCode": "function getPeckingOrderHierarchy() {\n  return ['1_INTERNAL_RETAINED_EARNINGS', '2_SECURED_DEBT', '3_EXTERNAL_EQUITY_SHARES'];\n}\n\nconsole.log(JSON.stringify(getPeckingOrderHierarchy()));",
            "expectedOutput": "[\"1_INTERNAL_RETAINED_EARNINGS\",\"2_SECURED_DEBT\",\"3_EXTERNAL_EQUITY_SHARES\"]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "According to Myers' Pecking Order Theory, what is the very first preferred source of capital financing for a corporation?",
          "expectedStringOutput": "1_INTERNAL_RETAINED_EARNINGS",
          "acceptableAnswers": [
            "1_INTERNAL_RETAINED_EARNINGS",
            "Internal Retained Earnings",
            "Retained Earnings"
          ],
          "primaryMisconceptionId": "MC_FIN_CAPITAL_STRUCTURE_MODIGLIANI_MILLER",
          "diagnosisMap": {
            "EQUITY": {
              "misconceptionId": "MC_FIN_CAPITAL_STRUCTURE_MODIGLIANI_MILLER",
              "errorExplanation": "Fresh equity is the last resort. Retained earnings is first.",
              "recoveryPath": {
                "simplerExplanation": "First preference is internal retained earnings.",
                "guidedFixPrompt": "Type 1_INTERNAL_RETAINED_EARNINGS"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 20,
    "title": "Dividend Policy Theories: Walter's Model & Gordon's Model",
    "overviewMetaphor": "Dividend Policy is Slicing Apples to Plant Apple Orchards vs Eating Them for Dessert: Walter's Model says that if your business is an Apple Orchard that generates a 15% return on reinvested apples ($r = 15\\%$) while investors can only get 10% elsewhere ($K_e = 10\\%$), you should NEVER distribute dividends (0% Payout)—retaining 100% of earnings maximizes the stock price ($P = $130$); but if your business is declining ($r < K_e$), paying out 100% dividends maximizes shareholder wealth.",
    "blocks": [
      {
        "id": "fin-d20-b1-walter-model-formula",
        "day": 20,
        "blockNumber": 1,
        "title": "Walter's Model Equation: $P = \\frac{D + \\frac{r}{K_e}(E - D)}{K_e}$",
        "conceptBudget": {
          "primaryConcept": "Walter's Dividend Model Formula",
          "supportingTerms": [
            "$P = \\frac{D + \\frac{r}{K_e}(E - D)}{K_e}$",
            "$E$ (Earnings Per Share EPS)",
            "$D$ (Dividend Per Share DPS)",
            "$r$ (Internal Rate of Return on investment / ROI)",
            "$K_e$ (Cost of equity capital)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d19-b2-mm-proposition-1-with-taxes",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Walter Model Math ($E=$10, D=$4, r=15%, Ke=10%)",
              "boxes": [
                {
                  "label": "Dividend Component (D)",
                  "value": "$4.00 cash dividend paid to shareholder",
                  "varType": "Direct Dividend",
                  "isUpdated": false
                },
                {
                  "label": "Retained Earnings Reinvestment",
                  "value": "(r / Ke) x (E - D) = (0.15 / 0.10) x ($10 - $4) = 1.5 x $6 = $9.00",
                  "varType": "Reinvestment Multiplier",
                  "isUpdated": false
                },
                {
                  "label": "Stock Price (P)",
                  "value": "($4.00 + $9.00) / 0.10 = $13.00 / 0.10 = EXACTLY $130.00!",
                  "varType": "Equity Share Price",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "walter_calc_demo.js",
            "initialCode": "function calculateWalterPrice(e, d, rPct, kePct) {\n  const r = rPct / 100;\n  const ke = kePct / 100;\n  const price = (d + (r / ke) * (e - d)) / ke;\n  return {\n    eps: e,\n    dps: d,\n    roiPercent: rPct,\n    costOfEquityPercent: kePct,\n    sharePrice: Number(price.toFixed(2)),\n    status: 'WALTER_PRICE_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateWalterPrice(10, 4, 15, 10)));",
            "expectedOutput": "{\"eps\":10,\"dps\":4,\"roiPercent\":15,\"costOfEquityPercent\":10,\"sharePrice\":130,\"status\":\"WALTER_PRICE_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the share price under Walter's Model when EPS is $10, DPS is $4, ROI ($r$) is 15%, and Cost of Equity ($K_e$) is 10% ($ (4 + 1.5 \\times 6) / 0.10 $)?",
          "expectedStringOutput": "130",
          "acceptableAnswers": [
            "130",
            "$130",
            "130.00",
            "sharePrice\":130"
          ],
          "primaryMisconceptionId": "MC_FIN_DIVIDEND_POLICY_WALTER_GORDON_MODELS",
          "diagnosisMap": {
            "100": {
              "misconceptionId": "MC_FIN_DIVIDEND_POLICY_WALTER_GORDON_MODELS",
              "errorExplanation": "10 / 0.10 = 100 ignores the superior 15% reinvestment return. Correct price is $130.00.",
              "recoveryPath": {
                "simplerExplanation": "(4 + 9) / 0.10 = 130.",
                "guidedFixPrompt": "Type 130"
              }
            }
          }
        }
      },
      {
        "id": "fin-d20-b2-growth-normal-declining-firms",
        "day": 20,
        "blockNumber": 2,
        "title": "Walter's 3 Firm Types: Growth ($r > K_e$), Normal ($r = K_e$), Declining ($r < K_e$)",
        "conceptBudget": {
          "primaryConcept": "Optimal Dividend Payout Rules",
          "supportingTerms": [
            "Growth Firm ($r > K_e \\implies$ Optimal Payout = 0% to maximize price)",
            "Declining Firm ($r < K_e \\implies$ Optimal Payout = 100% to maximize price)",
            "Normal Firm ($r = K_e \\implies$ Dividend payout is indifferent)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d20-b1-walter-model-formula",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Walter's Optimal Payout Decision Matrix",
            "codeSnippet": "// Growth Firm (r > Ke): Retaining capital generates superior return -> Optimal Payout = 0%\n// Declining Firm (r < Ke): Reinvestment destroys value -> Optimal Payout = 100%\n// Normal Firm (r = Ke): Reinvestment equals cost of capital -> Dividend policy indifferent",
            "lineNotes": {
              "1": "0% payout for growth firms.",
              "2": "100% payout for declining firms.",
              "3": "Indifferent for normal firms."
            }
          },
          {
            "type": "runnable_code",
            "filename": "firm_types_demo.js",
            "initialCode": "function getOptimalPayout(r, ke) {\n  if (r > ke) return 'GROWTH_FIRM_OPTIMAL_PAYOUT_ZERO_PERCENT';\n  if (r < ke) return 'DECLINING_FIRM_OPTIMAL_PAYOUT_100_PERCENT';\n  return 'NORMAL_FIRM_PAYOUT_INDIFFERENT';\n}\n\nconsole.log(getOptimalPayout(15, 10));\nconsole.log(getOptimalPayout(8, 10));\nconsole.log(getOptimalPayout(10, 10));",
            "expectedOutput": "GROWTH_FIRM_OPTIMAL_PAYOUT_ZERO_PERCENT\nDECLINING_FIRM_OPTIMAL_PAYOUT_100_PERCENT\nNORMAL_FIRM_PAYOUT_INDIFFERENT",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the optimal dividend payout ratio for a Growth Firm where ROI ($r = 15\\%$) exceeds Cost of Equity ($K_e = 10\\%$)?",
          "expectedStringOutput": "GROWTH_FIRM_OPTIMAL_PAYOUT_ZERO_PERCENT",
          "acceptableAnswers": [
            "GROWTH_FIRM_OPTIMAL_PAYOUT_ZERO_PERCENT",
            "0%",
            "0",
            "Zero percent"
          ],
          "primaryMisconceptionId": "MC_FIN_DIVIDEND_POLICY_WALTER_GORDON_MODELS",
          "diagnosisMap": {
            "100%": {
              "misconceptionId": "MC_FIN_DIVIDEND_POLICY_WALTER_GORDON_MODELS",
              "errorExplanation": "100% is for declining firms. Growth firms should retain 100% (0% payout).",
              "recoveryPath": {
                "simplerExplanation": "Growth firms have 0% optimal payout.",
                "guidedFixPrompt": "Type GROWTH_FIRM_OPTIMAL_PAYOUT_ZERO_PERCENT"
              }
            }
          }
        }
      },
      {
        "id": "fin-d20-b3-gordons-model-bird-in-the-hand",
        "day": 20,
        "blockNumber": 3,
        "title": "Gordon's Model ($P = \\frac{E(1 - b)}{K_e - br}$) & 'Bird-in-the-Hand' Fallacy",
        "conceptBudget": {
          "primaryConcept": "Gordon's Model & Bird-in-the-Hand Theory",
          "supportingTerms": [
            "Gordon Formula: $P = \\frac{E(1 - b)}{K_e - br}$ where $b$ is retention ratio and $g = br$",
            "Bird-in-the-Hand Theory (Investors prefer certain dividends today over uncertain future capital gains)",
            "MM Dividend Irrelevance rebuttal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d20-b2-growth-normal-declining-firms",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "gordon_model_demo.js",
            "initialCode": "function calculateGordonModelPrice(eps, b, kePct, rPct) {\n  const ke = kePct / 100;\n  const r = rPct / 100;\n  const g = b * r;\n  const price = (eps * (1 - b)) / (ke - g);\n  return {\n    eps,\n    retentionRatio: b,\n    dividendPayoutRatio: 1 - b,\n    growthRatePercent: Number((g * 100).toFixed(2)),\n    sharePrice: Number(price.toFixed(2)),\n    status: 'GORDON_MODEL_PRICE_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateGordonModelPrice(10, 0.4, 10, 15))); // P = 10*(0.6) / (0.10 - 0.06) = 6 / 0.04 = $150.00",
            "expectedOutput": "{\"eps\":10,\"retentionRatio\":0.4,\"dividendPayoutRatio\":0.6,\"growthRatePercent\":6,\"sharePrice\":150,\"status\":\"GORDON_MODEL_PRICE_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the stock price under Gordon's Model when EPS is $10, retention ratio $b = 0.40$, $K_e = 10\\%$, and ROI $r = 15\\%$ ($ 6 / (0.10 - 0.06) $)?",
          "expectedStringOutput": "150",
          "acceptableAnswers": [
            "150",
            "$150",
            "150.00",
            "sharePrice\":150"
          ],
          "primaryMisconceptionId": "MC_FIN_DIVIDEND_POLICY_WALTER_GORDON_MODELS",
          "diagnosisMap": {
            "60": {
              "misconceptionId": "MC_FIN_DIVIDEND_POLICY_WALTER_GORDON_MODELS",
              "errorExplanation": "6 / 0.04 = $150.00.",
              "recoveryPath": {
                "simplerExplanation": "6 / 0.04 = 150.",
                "guidedFixPrompt": "Type 150"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 21,
    "title": "⭐ MILESTONE 3: Complete Corporate Capital Structure & Dividend Optimization Engine",
    "overviewMetaphor": "Milestone 3 Synthesis: The complete sovereign corporate capital structure and dividend optimization engine: 1. Operating, financial, and combined leverage multipliers; 2. Break-even CVP dynamics and margin of safety; 3. Modigliani-Miller debt tax shield valuation; 4. Walter and Gordon dividend policy optimization.",
    "blocks": [
      {
        "id": "fin-d21-b1-capital-structure-dividend-engine-synthesis",
        "day": 21,
        "blockNumber": 1,
        "title": "Capital Structure & Dividend Policy Engine Synthesis",
        "conceptBudget": {
          "primaryConcept": "Capital Structure & Policy Synthesis",
          "supportingTerms": [
            "Leverage Engine",
            "Break-Even Engine",
            "MM Valuation Engine",
            "Walter Dividend Optimizer"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d20-b3-gordons-model-bird-in-the-hand",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Milestone 3 Corporate Policy Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "Evaluates Operating (DOL) and Financial (DFL) leverage multipliers",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Computes Break-Even sales volume ($250k) and Margin of Safety (37.5%)",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Calculates Modigliani-Miller Levered Firm Value with tax shield ($1.1M)",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Optimizes Walter & Gordon dividend payout to maximize equity share price!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "policy_engine_demo.js",
            "initialCode": "function runCorporatePolicyEngine() {\n  return {\n    leverageSubsystem: 'ONLINE_LEVERAGE_MULTIPLIERS_ACTIVE',\n    breakEvenSubsystem: 'ONLINE_CVP_MARGIN_OF_SAFETY_ACTIVE',\n    mmValuationSubsystem: 'ONLINE_TAX_SHIELD_VALUATION_ACTIVE',\n    dividendOptimizationSubsystem: 'ONLINE_WALTER_GORDON_ACTIVE',\n    engineStatus: 'CORPORATE_POLICY_MASTER_ENGINE_ACTIVE'\n  };\n}\n\nconsole.log(runCorporatePolicyEngine().engineStatus);",
            "expectedOutput": "CORPORATE_POLICY_MASTER_ENGINE_ACTIVE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What engine status confirms active operational synthesis of the Corporate Policy Master Engine?",
          "expectedStringOutput": "CORPORATE_POLICY_MASTER_ENGINE_ACTIVE",
          "acceptableAnswers": [
            "CORPORATE_POLICY_MASTER_ENGINE_ACTIVE",
            "engineStatus: CORPORATE_POLICY_MASTER_ENGINE_ACTIVE"
          ],
          "primaryMisconceptionId": "MC_FIN_CAPITAL_STRUCTURE_MODIGLIANI_MILLER",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_FIN_CAPITAL_STRUCTURE_MODIGLIANI_MILLER",
              "errorExplanation": "Matches CORPORATE_POLICY_MASTER_ENGINE_ACTIVE.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type CORPORATE_POLICY_MASTER_ENGINE_ACTIVE"
              }
            }
          }
        }
      },
      {
        "id": "fin-d21-b2-corporate-policy-audit",
        "day": 21,
        "blockNumber": 2,
        "title": "Capital Structure & Dividend Invariant Audit",
        "conceptBudget": {
          "primaryConcept": "Corporate Policy Invariant Verification",
          "supportingTerms": [
            "Leverage Invariant",
            "Dividend Invariant",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d21-b1-capital-structure-dividend-engine-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "policy_audit_demo.js",
            "initialCode": "function auditCorporatePolicySystem(leverageValid, bepValid, mmValid, dividendValid) {\n  const passed = leverageValid && bepValid && mmValid && dividendValid;\n  return {\n    leverageVerified: leverageValid,\n    bepVerified: bepValid,\n    mmVerified: mmValid,\n    dividendVerified: dividendValid,\n    grade: passed ? 'CORPORATE_POLICY_ENGINE_AUDIT_PASSED' : 'AUDIT_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditCorporatePolicySystem(true, true, true, true)));",
            "expectedOutput": "{\"leverageVerified\":true,\"bepVerified\":true,\"mmVerified\":true,\"dividendVerified\":true,\"grade\":\"CORPORATE_POLICY_ENGINE_AUDIT_PASSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade is awarded when Leverage, Break-Even, MM Valuation, and Dividend optimization pass 100%?",
          "expectedStringOutput": "CORPORATE_POLICY_ENGINE_AUDIT_PASSED",
          "acceptableAnswers": [
            "CORPORATE_POLICY_ENGINE_AUDIT_PASSED",
            "grade\":\"CORPORATE_POLICY_ENGINE_AUDIT_PASSED\""
          ],
          "primaryMisconceptionId": "MC_FIN_CAPITAL_STRUCTURE_MODIGLIANI_MILLER",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_FIN_CAPITAL_STRUCTURE_MODIGLIANI_MILLER",
              "errorExplanation": "All checks passing awards CORPORATE_POLICY_ENGINE_AUDIT_PASSED.",
              "recoveryPath": {
                "simplerExplanation": "Awards CORPORATE_POLICY_ENGINE_AUDIT_PASSED.",
                "guidedFixPrompt": "Type CORPORATE_POLICY_ENGINE_AUDIT_PASSED"
              }
            }
          }
        }
      },
      {
        "id": "fin-d21-b3-milestone3-finance-cert",
        "day": 21,
        "blockNumber": 3,
        "title": "Milestone 3 Capital Structure & Dividend Engine Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 3 Certification",
          "supportingTerms": [
            "Corporate Policy Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d21-b2-corporate-policy-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone3_fin_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 3: Complete Corporate Capital Structure & Dividend Optimization Engine [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 3: Complete Corporate Capital Structure & Dividend Optimization Engine [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 3 completion?",
          "expectedStringOutput": "⭐ MILESTONE 3: Complete Corporate Capital Structure & Dividend Optimization Engine [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 3: Complete Corporate Capital Structure & Dividend Optimization Engine [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_FIN_CAPITAL_STRUCTURE_MODIGLIANI_MILLER",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_FIN_CAPITAL_STRUCTURE_MODIGLIANI_MILLER",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 3: Complete Corporate Capital Structure & Dividend Optimization Engine [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 22,
    "title": "Equity Valuation: DCF Free Cash Flow & Multiples Valuation (P/E, EV/EBITDA)",
    "overviewMetaphor": "Valuing a Company is Like Appraising a Real Estate Apartment Complex: the DCF Method forecasts all net rental cash flows the complex will generate for the next 50 years and discounts them to today's cash value; the Multiples Method looks at neighboring apartment buildings on the same street (Comparable Companies) and checks their Price-to-Earnings (P/E = 15x) or EV/EBITDA ratios to estimate market value; combining DCF intrinsic value with peer multiples gives an ironclad valuation range.",
    "blocks": [
      {
        "id": "fin-d22-b1-free-cash-flow-to-firm-fcff",
        "day": 22,
        "blockNumber": 1,
        "title": "Free Cash Flow to Firm (FCFF) & Enterprise DCF Modeling",
        "conceptBudget": {
          "primaryConcept": "Free Cash Flow to Firm (FCFF) Formula",
          "supportingTerms": [
            "$\\text{FCFF} = \\text{EBIT}(1 - t) + \\text{Depreciation} - \\text{CapEx} - \\Delta \\text{Working Capital}$",
            "Terminal Value: $TV = \\frac{\\text{FCFF}_n(1 + g)}{\\text{WACC} - g}$",
            "$\\text{Enterprise Value (EV)} = \\sum \\text{PV(FCFF)} + \\text{PV(TV)}$",
            "$\\text{Equity Value} = \\text{EV} - \\text{Net Debt}$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d14-b1-wacc-blended-formula",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Enterprise DCF Bridge to Equity Value",
              "boxes": [
                {
                  "label": "1. PV of FCFFs (Years 1-5)",
                  "value": "Sum of discounted cash flows = $450,000",
                  "varType": "Explicit Forecast",
                  "isUpdated": false
                },
                {
                  "label": "2. PV of Terminal Value",
                  "value": "Perpetual terminal value discounted = $850,000",
                  "varType": "Terminal Value",
                  "isUpdated": false
                },
                {
                  "label": "3. Enterprise Value (EV)",
                  "value": "$450k + $850k = $1,300,000 EV | Less: $300k Net Debt = $1,000,000 Equity Value!",
                  "varType": "Equity Value",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "fcff_dcf_demo.js",
            "initialCode": "function calculateDcfEquityValue(pvForecast, pvTerminal, netDebt, shares) {\n  const ev = pvForecast + pvTerminal;\n  const equity = ev - netDebt;\n  const perShare = equity / shares;\n  return {\n    enterpriseValue: ev,\n    netDebtDeducted: netDebt,\n    equityValue: equity,\n    intrinsicPricePerShare: Number(perShare.toFixed(2)),\n    status: 'DCF_VALUATION_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateDcfEquityValue(450000, 850000, 300000, 10000)));",
            "expectedOutput": "{\"enterpriseValue\":1300000,\"netDebtDeducted\":300000,\"equityValue\":1000000,\"intrinsicPricePerShare\":100,\"status\":\"DCF_VALUATION_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the intrinsic price per share when Enterprise Value is $1,300,000, Net Debt is $300,000, and there are 10,000 shares outstanding ($ (1300000 - 300000) / 10000 $)?",
          "expectedStringOutput": "100",
          "acceptableAnswers": [
            "100",
            "$100",
            "100.00",
            "intrinsicPricePerShare\":100"
          ],
          "primaryMisconceptionId": "MC_FIN_EQUITY_VALUATION_DCF_AND_PE_MULTIPLES",
          "diagnosisMap": {
            "130": {
              "misconceptionId": "MC_FIN_EQUITY_VALUATION_DCF_AND_PE_MULTIPLES",
              "errorExplanation": "$130 is EV per share. Equity value must deduct net debt: (1.3M - 300k)/10k = $100.",
              "recoveryPath": {
                "simplerExplanation": "1000000 / 10000 = 100.",
                "guidedFixPrompt": "Type 100"
              }
            }
          }
        }
      },
      {
        "id": "fin-d22-b2-trading-multiples-pe-ev-ebitda",
        "day": 22,
        "blockNumber": 2,
        "title": "Trading Multiples: Price-to-Earnings (P/E) & EV/EBITDA Comparative Valuation",
        "conceptBudget": {
          "primaryConcept": "Trading Multiples Valuation",
          "supportingTerms": [
            "Price-to-Earnings: $\\text{Target Price} = \\text{EPS} \\times \\text{Peer P/E Multiple}$",
            "Enterprise Value to EBITDA ($EV / EBITDA$: Capital structure neutral!)",
            "Price-to-Book ($P/B$)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d22-b1-free-cash-flow-to-firm-fcff",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "P/E Target Price Math",
            "codeSnippet": "Company EPS = $5.00\nIndustry Average P/E Multiple = 15.0x\nTarget Equity Share Price = EPS * P/E = $5.00 * 15.0 = $75.00",
            "lineNotes": {
              "1": "Earnings per share.",
              "2": "Peer multiple.",
              "3": "Comparative equity price."
            }
          },
          {
            "type": "runnable_code",
            "filename": "multiples_demo.js",
            "initialCode": "function evaluateMultiples(eps, peerPe, ebitda, peerEvEbitdaMultiple, netDebt, shares) {\n  const pePrice = eps * peerPe;\n  const ev = ebitda * peerEvEbitdaMultiple;\n  const evPrice = (ev - netDebt) / shares;\n  return {\n    peImpliedPrice: Number(pePrice.toFixed(2)),\n    evEbitdaImpliedPrice: Number(evPrice.toFixed(2)),\n    status: 'MULTIPLES_VALUATION_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateMultiples(5, 15, 200000, 8, 100000, 20000))); // PE = $75; EV = 1.6M - 100k = 1.5M / 20k = $75",
            "expectedOutput": "{\"peImpliedPrice\":75,\"evEbitdaImpliedPrice\":75,\"status\":\"MULTIPLES_VALUATION_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the implied target share price for a firm with $5.00 EPS when peer companies trade at an average P/E multiple of 15.0x ($5.00 \\times 15.0$)?",
          "expectedStringOutput": "75",
          "acceptableAnswers": [
            "75",
            "$75",
            "75.00",
            "peImpliedPrice\":75"
          ],
          "primaryMisconceptionId": "MC_FIN_EQUITY_VALUATION_DCF_AND_PE_MULTIPLES",
          "diagnosisMap": {
            "3.0": {
              "misconceptionId": "MC_FIN_EQUITY_VALUATION_DCF_AND_PE_MULTIPLES",
              "errorExplanation": "Price = EPS * P/E = 5 * 15 = $75.00.",
              "recoveryPath": {
                "simplerExplanation": "5 * 15 = 75.",
                "guidedFixPrompt": "Type 75"
              }
            }
          }
        }
      },
      {
        "id": "fin-d22-b3-football-field-valuation-summary",
        "day": 22,
        "blockNumber": 3,
        "title": "Football Field Valuation Chart: Triangulating Valuation Ranges",
        "conceptBudget": {
          "primaryConcept": "Football Field Valuation Synthesis",
          "supportingTerms": [
            "Valuation Range Matrix (DCF Base/Bull/Bear, P/E Comps, EV/EBITDA Comps, 52-Week Range)",
            "Triangulating fair market value band for M&A and IPO pricing"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d22-b2-trading-multiples-pe-ev-ebitda",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "football_field_demo.js",
            "initialCode": "function evaluateValuationRange(dcfLow, dcfHigh, compsLow, compsHigh) {\n  const minVal = Math.min(dcfLow, compsLow);\n  const maxVal = Math.max(dcfHigh, compsHigh);\n  return {\n    fairValueRangeDollars: `$${minVal} - $${maxVal}`,\n    status: 'FOOTBALL_FIELD_VALUATION_RANGE_TRIANGULATED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateValuationRange(70, 90, 65, 85)));",
            "expectedOutput": "{\"fairValueRangeDollars\":\"$65 - $90\",\"status\":\"FOOTBALL_FIELD_VALUATION_RANGE_TRIANGULATED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that multiple valuation methodologies (DCF, P/E, EV/EBITDA) have been successfully triangulated into a fair market value range?",
          "expectedStringOutput": "FOOTBALL_FIELD_VALUATION_RANGE_TRIANGULATED",
          "acceptableAnswers": [
            "FOOTBALL_FIELD_VALUATION_RANGE_TRIANGULATED",
            "status\":\"FOOTBALL_FIELD_VALUATION_RANGE_TRIANGULATED\""
          ],
          "primaryMisconceptionId": "MC_FIN_EQUITY_VALUATION_DCF_AND_PE_MULTIPLES",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_FIN_EQUITY_VALUATION_DCF_AND_PE_MULTIPLES",
              "errorExplanation": "Matches FOOTBALL_FIELD_VALUATION_RANGE_TRIANGULATED.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type FOOTBALL_FIELD_VALUATION_RANGE_TRIANGULATED"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 23,
    "title": "Modern Portfolio Theory: 2-Asset Portfolio Return, Variance & Diversification",
    "overviewMetaphor": "Portfolio Diversification is Never Putting All Your Fragile Eggs in One Basket: Harry Markowitz proved that if you hold an Umbrella Company (which booms on rainy days) and an Ice Cream Company (which booms on sunny days), their uncorrelated cash flows cancel out each other's bad days; you get the same 10% average return, but your portfolio's risk (standard deviation) collapses from 15% down to 11.18%—diversification is the only 'Free Lunch' in finance.",
    "blocks": [
      {
        "id": "fin-d23-b1-portfolio-expected-return-and-variance",
        "day": 23,
        "blockNumber": 1,
        "title": "2-Asset Portfolio Expected Return ($E(R_p)$) & Variance ($\\sigma_p^2$)",
        "conceptBudget": {
          "primaryConcept": "2-Asset Portfolio Math",
          "supportingTerms": [
            "$E(R_p) = w_1 R_1 + w_2 R_2$",
            "Portfolio Variance: $\\sigma_p^2 = w_1^2 \\sigma_1^2 + w_2^2 \\sigma_2^2 + 2 w_1 w_2 \\sigma_1 \\sigma_2 \\rho_{12}$",
            "Correlation Coefficient ($-1.0 \\le \\rho_{12} \\le +1.0$)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d22-b1-free-cash-flow-to-firm-fcff",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Portfolio Diversification Math ($w_1=0.5, \\sigma_1=20\\%, w_2=0.5, \\sigma_2=10\\%, \\rho=0$)",
              "boxes": [
                {
                  "label": "Asset 1 Variance Term",
                  "value": "$w_1^2 \\sigma_1^2 = 0.5^2 \\times 20^2 = 0.25 \\times 400 = 100$",
                  "varType": "Asset 1 Risk",
                  "isUpdated": false
                },
                {
                  "label": "Asset 2 Variance Term",
                  "value": "$w_2^2 \\sigma_2^2 = 0.5^2 \\times 10^2 = 0.25 \\times 100 = 25$",
                  "varType": "Asset 2 Risk",
                  "isUpdated": false
                },
                {
                  "label": "Covariance Term (\\rho = 0)",
                  "value": "$2 w_1 w_2 \\sigma_1 \\sigma_2 \\rho = 0$",
                  "varType": "Covariance",
                  "isUpdated": false
                },
                {
                  "label": "Portfolio Standard Deviation",
                  "value": "$\\sigma_p = \\sqrt{100 + 25} = \\sqrt{125} = 11.18\\%$ (< weighted avg 15%!)",
                  "varType": "Diversified Risk",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "mpt_calc_demo.js",
            "initialCode": "function calculatePortfolioRisk(w1, r1, s1, w2, r2, s2, rho) {\n  const ret = w1 * r1 + w2 * r2;\n  const varP = Math.pow(w1 * s1, 2) + Math.pow(w2 * s2, 2) + 2 * w1 * w2 * s1 * s2 * rho;\n  const stdP = Math.sqrt(varP);\n  return {\n    expectedReturnPercent: ret,\n    portfolioVariance: Number(varP.toFixed(2)),\n    portfolioStdDevPercent: Number(stdP.toFixed(2)),\n    status: 'PORTFOLIO_RISK_RETURN_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculatePortfolioRisk(0.5, 12, 20, 0.5, 8, 10, 0.0)));",
            "expectedOutput": "{\"expectedReturnPercent\":10,\"portfolioVariance\":125,\"portfolioStdDevPercent\":11.18,\"status\":\"PORTFOLIO_RISK_RETURN_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the portfolio standard deviation percentage for a 50/50 portfolio where Asset 1 has $\\sigma=20\\%$, Asset 2 has $\\sigma=10\\%$, and correlation $\\rho=0$ ($\\sqrt{125}$)?",
          "expectedStringOutput": "11.18",
          "acceptableAnswers": [
            "11.18",
            "11.18%",
            "portfolioStdDevPercent\":11.18"
          ],
          "primaryMisconceptionId": "MC_FIN_MODERN_PORTFOLIO_THEORY_RISK_RETURN_VARIANCE",
          "diagnosisMap": {
            "15.0": {
              "misconceptionId": "MC_FIN_MODERN_PORTFOLIO_THEORY_RISK_RETURN_VARIANCE",
              "errorExplanation": "15.0% is the weighted average risk without diversification benefits. True standard deviation is 11.18%.",
              "recoveryPath": {
                "simplerExplanation": "sqrt(125) = 11.18%.",
                "guidedFixPrompt": "Type 11.18"
              }
            }
          }
        }
      },
      {
        "id": "fin-d23-b2-correlation-coefficient-power",
        "day": 23,
        "blockNumber": 2,
        "title": "The Power of the Correlation Coefficient ($\\rho = -1.0$ to $+1.0$)",
        "conceptBudget": {
          "primaryConcept": "Correlation Coefficient Invariant",
          "supportingTerms": [
            "$\\rho = +1.0$ (Perfect Positive: Zero diversification risk reduction)",
            "$\\rho = 0.0$ (Uncorrelated: Significant risk reduction)",
            "$\\rho = -1.0$ (Perfect Negative: Total risk elimination possible!)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d23-b1-portfolio-expected-return-and-variance",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Correlation Regimes in Portfolio Risk",
            "codeSnippet": "// rho = +1.0 -> sigma_p = w1*s1 + w2*s2 = 15.0% (Zero diversification)\n// rho =  0.0 -> sigma_p = sqrt(w1^2*s1^2 + w2^2*s2^2) = 11.18% (Substantial benefit)\n// rho = -1.0 -> sigma_p = |w1*s1 - w2*s2| = 5.0% (Maximum risk elimination!)",
            "lineNotes": {
              "1": "Perfect correlation gives no benefit.",
              "2": "Zero correlation cuts risk.",
              "3": "Negative correlation eliminates risk."
            }
          },
          {
            "type": "runnable_code",
            "filename": "correlation_demo.js",
            "initialCode": "function evaluateCorrelationBenefit(rho) {\n  if (rho === -1.0) return 'MAXIMUM_DIVERSIFICATION_TOTAL_RISK_ELIMINATION';\n  if (rho === 0.0) return 'SUBSTANTIAL_DIVERSIFICATION_RISK_REDUCTION';\n  return 'NO_DIVERSIFICATION_BENEFIT_AT_PERFECT_POSITIVE_CORRELATION';\n}\n\nconsole.log(evaluateCorrelationBenefit(-1.0));\nconsole.log(evaluateCorrelationBenefit(0.0));\nconsole.log(evaluateCorrelationBenefit(1.0));",
            "expectedOutput": "MAXIMUM_DIVERSIFICATION_TOTAL_RISK_ELIMINATION\nSUBSTANTIAL_DIVERSIFICATION_RISK_REDUCTION\nNO_DIVERSIFICATION_BENEFIT_AT_PERFECT_POSITIVE_CORRELATION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What correlation coefficient value between two assets provides the maximum possible risk elimination in portfolio theory?",
          "expectedStringOutput": "-1",
          "acceptableAnswers": [
            "-1",
            "-1.0",
            "-1.00"
          ],
          "primaryMisconceptionId": "MC_FIN_MODERN_PORTFOLIO_THEORY_RISK_RETURN_VARIANCE",
          "diagnosisMap": {
            "0": {
              "misconceptionId": "MC_FIN_MODERN_PORTFOLIO_THEORY_RISK_RETURN_VARIANCE",
              "errorExplanation": "0 provides good diversification, but -1.0 provides maximum risk elimination.",
              "recoveryPath": {
                "simplerExplanation": "Maximum risk elimination occurs at -1.",
                "guidedFixPrompt": "Type -1"
              }
            }
          }
        }
      },
      {
        "id": "fin-d23-b3-markowitz-efficient-frontier",
        "day": 23,
        "blockNumber": 3,
        "title": "The Markowitz Efficient Frontier & Minimum Variance Portfolio",
        "conceptBudget": {
          "primaryConcept": "Markowitz Efficient Frontier",
          "supportingTerms": [
            "Efficient Frontier (Set of optimal portfolios that offer the maximum expected return for a given level of risk)",
            "Minimum Variance Portfolio (MVP)",
            "Dominance Principle: Portfolios below the frontier are sub-optimal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d23-b2-correlation-coefficient-power",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "efficient_frontier_demo.js",
            "initialCode": "function evaluateEfficientFrontier(onFrontier) {\n  return onFrontier\n    ? 'OPTIMAL_MAXIMUM_RETURN_FOR_GIVEN_RISK_LEVEL'\n    : 'SUB_OPTIMAL_DOMINATED_PORTFOLIO';\n}\n\nconsole.log(evaluateEfficientFrontier(true));\nconsole.log(evaluateEfficientFrontier(false));",
            "expectedOutput": "OPTIMAL_MAXIMUM_RETURN_FOR_GIVEN_RISK_LEVEL\nSUB_OPTIMAL_DOMINATED_PORTFOLIO",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What defines an optimal portfolio lying on the Markowitz Efficient Frontier?",
          "expectedStringOutput": "OPTIMAL_MAXIMUM_RETURN_FOR_GIVEN_RISK_LEVEL",
          "acceptableAnswers": [
            "OPTIMAL_MAXIMUM_RETURN_FOR_GIVEN_RISK_LEVEL",
            "Maximum return for risk",
            "Optimal return"
          ],
          "primaryMisconceptionId": "MC_FIN_MODERN_PORTFOLIO_THEORY_RISK_RETURN_VARIANCE",
          "diagnosisMap": {
            "LOWEST": {
              "misconceptionId": "MC_FIN_MODERN_PORTFOLIO_THEORY_RISK_RETURN_VARIANCE",
              "errorExplanation": "The Efficient Frontier offers the maximum expected return for a given risk level.",
              "recoveryPath": {
                "simplerExplanation": "Matches OPTIMAL_MAXIMUM_RETURN_FOR_GIVEN_RISK_LEVEL.",
                "guidedFixPrompt": "Type OPTIMAL_MAXIMUM_RETURN_FOR_GIVEN_RISK_LEVEL"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 24,
    "title": "Capital Asset Pricing Model (CAPM) & Security Market Line (SML)",
    "overviewMetaphor": "The Security Market Line (SML) is the Fair Toll Booth on the Investment Highway: Systematic Risk (Beta $\\beta$) measures how much your vehicle shakes when the entire highway experiences an earthquake; the SML calculates the exact fair toll return ($E(R_i) = R_f + \\beta(R_m - R_f)$); if a stock gives you more return than the SML toll booth demands (Positive Jensen's Alpha $\\alpha > 0$), it is an Undervalued Bargain located above the SML—screaming BUY; if it gives less ($\\alpha < 0$), it is an Overvalued Trap located below the SML—screaming SELL.",
    "blocks": [
      {
        "id": "fin-d24-b1-capm-equation-and-beta",
        "day": 24,
        "blockNumber": 1,
        "title": "The CAPM Equation: $E(R_i) = R_f + \\beta_i(E(R_m) - R_f)$",
        "conceptBudget": {
          "primaryConcept": "CAPM Equation & Systematic Beta Risk",
          "supportingTerms": [
            "$E(R_i) = R_f + \\beta_i \\times (R_m - R_f)$",
            "Systematic Risk (Non-diversifiable market-wide risk measured by $\\beta$)",
            "Unsystematic Risk (Diversifiable firm-specific risk $\\implies$ Market pays ZERO premium for holding it!)",
            "Market Beta $\\beta_m = 1.0$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d23-b1-portfolio-expected-return-and-variance",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "CAPM Risk Pricing ($R_f=5\\%, R_m=11\\%, \\beta=1.2$)",
              "boxes": [
                {
                  "label": "Risk-Free Rate (Rf)",
                  "value": "5.0% Treasury baseline return",
                  "varType": "Base Rate",
                  "isUpdated": false
                },
                {
                  "label": "Market Risk Premium (Rm - Rf)",
                  "value": "11.0% - 5.0% = 6.0% Market Risk Premium",
                  "varType": "MRP",
                  "isUpdated": false
                },
                {
                  "label": "Required Return E(Ri)",
                  "value": "5.0% + (1.2 x 6.0%) = 5.0% + 7.2% = 12.20% SML Required Return!",
                  "varType": "CAPM Return",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "capm_calc_demo.js",
            "initialCode": "function calculateCapmReturn(rf, rm, beta) {\n  const mrp = rm - rf;\n  const required = rf + beta * mrp;\n  return {\n    riskFreeRatePercent: rf,\n    marketReturnPercent: rm,\n    betaCoefficient: beta,\n    marketRiskPremiumPercent: mrp,\n    requiredReturnPercent: Number(required.toFixed(2)),\n    status: 'CAPM_RETURN_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateCapmReturn(5, 11, 1.2)));",
            "expectedOutput": "{\"riskFreeRatePercent\":5,\"marketReturnPercent\":11,\"betaCoefficient\":1.2,\"marketRiskPremiumPercent\":6,\"requiredReturnPercent\":12.2,\"status\":\"CAPM_RETURN_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the CAPM required return percentage for a stock with Beta = 1.2 when Risk-Free Rate is 5% and Market Return is 11% ($5 + 1.2 \\times (11 - 5)$)?",
          "expectedStringOutput": "12.2",
          "acceptableAnswers": [
            "12.2",
            "12.2%",
            "12.20",
            "requiredReturnPercent\":12.2"
          ],
          "primaryMisconceptionId": "MC_FIN_CAPITAL_ASSET_PRICING_MODEL_CAPM_BETA",
          "diagnosisMap": {
            "13.2": {
              "misconceptionId": "MC_FIN_CAPITAL_ASSET_PRICING_MODEL_CAPM_BETA",
              "errorExplanation": "5 + 1.2 * 11 forgets to subtract Rf from Rm. Correct MRP is 11 - 5 = 6%, so 5 + 1.2 * 6 = 12.2%.",
              "recoveryPath": {
                "simplerExplanation": "5 + 1.2 * 6 = 12.2%.",
                "guidedFixPrompt": "Type 12.2"
              }
            }
          }
        }
      },
      {
        "id": "fin-d24-b2-security-market-line-alpha-mispricing",
        "day": 24,
        "blockNumber": 2,
        "title": "Security Market Line (SML) & Jensen's Alpha Mispricing ($\\alpha = R_{\\text{actual}} - R_{\\text{CAPM}}$)",
        "conceptBudget": {
          "primaryConcept": "SML & Jensen's Alpha Invariant",
          "supportingTerms": [
            "$\\alpha = R_{\\text{actual}} - R_{\\text{CAPM}}$",
            "Positive Alpha ($\\alpha > 0$): Stock plots ABOVE SML $\\implies$ Undervalued Bargain (BUY!)",
            "Negative Alpha ($\\alpha < 0$): Stock plots BELOW SML $\\implies$ Overvalued Trap (SELL!)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d24-b1-capm-equation-and-beta",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "SML Alpha Signal Logic",
            "codeSnippet": "// Required CAPM Return = 12.2%\n// Stock A Actual Return = 14.0% -> Alpha = +1.8% -> PLOTS ABOVE SML -> UNDERVALUED (BUY!)\n// Stock B Actual Return = 10.0% -> Alpha = -2.2% -> PLOTS BELOW SML -> OVERVALUED (SELL!)",
            "lineNotes": {
              "2": "Positive alpha buys.",
              "3": "Negative alpha sells."
            }
          },
          {
            "type": "runnable_code",
            "filename": "alpha_signal_demo.js",
            "initialCode": "function evaluateSmlSignal(actualReturn, capmRequired) {\n  const alpha = actualReturn - capmRequired;\n  let signal = 'FAIRLY_PRICED';\n  if (alpha > 0) signal = 'UNDERVALUED_BUY_ABOVE_SML';\n  else if (alpha < 0) signal = 'OVERVALUED_SELL_BELOW_SML';\n  return {\n    actualReturn,\n    capmRequired,\n    jensensAlphaPercent: Number(alpha.toFixed(2)),\n    investmentSignal: signal,\n    status: 'SML_SIGNAL_EVALUATED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateSmlSignal(14.0, 12.2)));\nconsole.log(JSON.stringify(evaluateSmlSignal(10.0, 12.2)));",
            "expectedOutput": "{\"actualReturn\":14,\"capmRequired\":12.2,\"jensensAlphaPercent\":1.8,\"investmentSignal\":\"UNDERVALUED_BUY_ABOVE_SML\",\"status\":\"SML_SIGNAL_EVALUATED\"}\n{\"actualReturn\":10,\"capmRequired\":12.2,\"jensensAlphaPercent\":-2.2,\"investmentSignal\":\"OVERVALUED_SELL_BELOW_SML\",\"status\":\"SML_SIGNAL_EVALUATED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the investment signal for a stock generating a 14.0% return when its CAPM required return is 12.2% ($\\alpha = +1.8\\%$)?",
          "expectedStringOutput": "UNDERVALUED_BUY_ABOVE_SML",
          "acceptableAnswers": [
            "UNDERVALUED_BUY_ABOVE_SML",
            "BUY",
            "Undervalued"
          ],
          "primaryMisconceptionId": "MC_FIN_CAPITAL_ASSET_PRICING_MODEL_CAPM_BETA",
          "diagnosisMap": {
            "OVERVALUED": {
              "misconceptionId": "MC_FIN_CAPITAL_ASSET_PRICING_MODEL_CAPM_BETA",
              "errorExplanation": "A positive alpha means the stock delivers higher return than required, making it undervalued (BUY).",
              "recoveryPath": {
                "simplerExplanation": "Positive alpha -> Undervalued (BUY).",
                "guidedFixPrompt": "Type UNDERVALUED_BUY_ABOVE_SML"
              }
            }
          }
        }
      },
      {
        "id": "fin-d24-b3-cml-vs-sml",
        "day": 24,
        "blockNumber": 3,
        "title": "Capital Market Line (CML) vs Security Market Line (SML)",
        "conceptBudget": {
          "primaryConcept": "CML vs SML Distinctions",
          "supportingTerms": [
            "CML (X-axis: Total Risk $\\sigma$; applies ONLY to efficient well-diversified portfolios)",
            "SML (X-axis: Systematic Risk $\\beta$; applies to ALL individual assets, inefficient portfolios, and efficient portfolios)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d24-b2-security-market-line-alpha-mispricing",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "cml_sml_demo.js",
            "initialCode": "function getRiskAxis(lineType) {\n  return lineType === 'SML' ? 'SYSTEMATIC_RISK_BETA' : 'TOTAL_RISK_STANDARD_DEVIATION';\n}\n\nconsole.log(getRiskAxis('SML'));\nconsole.log(getRiskAxis('CML'));",
            "expectedOutput": "SYSTEMATIC_RISK_BETA\nTOTAL_RISK_STANDARD_DEVIATION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the risk measure plotted on the horizontal X-axis of the Security Market Line (SML)?",
          "expectedStringOutput": "SYSTEMATIC_RISK_BETA",
          "acceptableAnswers": [
            "SYSTEMATIC_RISK_BETA",
            "Beta",
            "Systematic Risk"
          ],
          "primaryMisconceptionId": "MC_FIN_CAPITAL_ASSET_PRICING_MODEL_CAPM_BETA",
          "diagnosisMap": {
            "SIGMA": {
              "misconceptionId": "MC_FIN_CAPITAL_ASSET_PRICING_MODEL_CAPM_BETA",
              "errorExplanation": "Standard deviation (sigma) is on the CML. Beta is on the SML.",
              "recoveryPath": {
                "simplerExplanation": "SML measures Systematic Risk (Beta).",
                "guidedFixPrompt": "Type SYSTEMATIC_RISK_BETA"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 25,
    "title": "Portfolio Performance Measurement: Sharpe, Treynor & Jensen Ratios",
    "overviewMetaphor": "Performance Ratios are the Fuel Efficiency Gauges for Fund Managers: if Fund Manager Alpha earned a 15% return by driving a Ferrari at 200 mph with terrifying swings (high volatility), while Fund Manager Beta earned 14% driving a smooth sedan with zero turbulence; Sharpe Ratio ($SR = \\frac{R_p - R_f}{\\sigma_p}$) measures excess return per unit of Total Risk; Treynor Ratio ($TR = \\frac{R_p - R_f}{\\beta_p}$) measures excess return per unit of Market Risk; Jensen's Alpha ($\\alpha$) measures pure manager stock-picking genius.",
    "blocks": [
      {
        "id": "fin-d25-b1-sharpe-ratio-total-risk",
        "day": 25,
        "blockNumber": 1,
        "title": "Sharpe Ratio: Excess Return per Unit of Total Risk ($SR = \\frac{R_p - R_f}{\\sigma_p}$)",
        "conceptBudget": {
          "primaryConcept": "Sharpe Ratio Formula",
          "supportingTerms": [
            "$SR = \\frac{R_p - R_f}{\\sigma_p}$",
            "Measures reward-to-variability ratio",
            "Best for evaluating an investor's entire standalone portfolio"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d24-b1-capm-equation-and-beta",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Sharpe Ratio ($R_p=15\\%, R_f=5\\%, \\sigma_p=12\\%$)",
              "boxes": [
                {
                  "label": "Excess Return (Rp - Rf)",
                  "value": "15.0% - 5.0% = 10.0% excess return",
                  "varType": "Excess Return",
                  "isUpdated": false
                },
                {
                  "label": "Total Portfolio Risk (\\sigma)",
                  "value": "12.0% standard deviation of returns",
                  "varType": "Total Risk",
                  "isUpdated": false
                },
                {
                  "label": "Sharpe Ratio",
                  "value": "10.0% / 12.0% = 0.83 Excess Return per 1% of Total Risk!",
                  "varType": "Sharpe Output",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "sharpe_calc_demo.js",
            "initialCode": "function calculateSharpe(rp, rf, stdP) {\n  const excess = rp - rf;\n  const sr = excess / stdP;\n  return {\n    excessReturnPercent: excess,\n    portfolioStdDevPercent: stdP,\n    sharpeRatio: Number(sr.toFixed(2)),\n    status: 'SHARPE_RATIO_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateSharpe(15, 5, 12)));",
            "expectedOutput": "{\"excessReturnPercent\":10,\"portfolioStdDevPercent\":12,\"sharpeRatio\":0.83,\"status\":\"SHARPE_RATIO_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Sharpe Ratio for a portfolio with a 15% return, 5% risk-free rate, and 12% standard deviation ($ (15 - 5) / 12 $)?",
          "expectedStringOutput": "0.83",
          "acceptableAnswers": [
            "0.83",
            "sharpeRatio\":0.83"
          ],
          "primaryMisconceptionId": "MC_FIN_SHARPE_TREYNOR_JENSEN_PERFORMANCE_RATIOS",
          "diagnosisMap": {
            "1.25": {
              "misconceptionId": "MC_FIN_SHARPE_TREYNOR_JENSEN_PERFORMANCE_RATIOS",
              "errorExplanation": "15 / 12 = 1.25 forgets to subtract the risk-free rate (15 - 5 = 10 -> 10/12 = 0.83).",
              "recoveryPath": {
                "simplerExplanation": "10 / 12 = 0.83.",
                "guidedFixPrompt": "Type 0.83"
              }
            }
          }
        }
      },
      {
        "id": "fin-d25-b2-treynor-ratio-systematic-risk",
        "day": 25,
        "blockNumber": 2,
        "title": "Treynor Ratio: Excess Return per Unit of Systematic Risk ($TR = \\frac{R_p - R_f}{\\beta_p}$)",
        "conceptBudget": {
          "primaryConcept": "Treynor Ratio Formula",
          "supportingTerms": [
            "$TR = \\frac{R_p - R_f}{\\beta_p}$",
            "Measures reward-to-volatility ratio",
            "Best for evaluating a sub-fund being added to an already well-diversified master portfolio"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d25-b1-sharpe-ratio-total-risk",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Treynor Ratio Math ($R_p=15\\%, R_f=5\\%, \\beta_p=1.25$)",
            "codeSnippet": "Excess Return = 15.0% - 5.0% = 10.0%\nSystematic Beta = 1.25\nTreynor Ratio = 10.0% / 1.25 = 8.00 Excess Return per Unit of Beta!",
            "lineNotes": {
              "1": "Excess portfolio return.",
              "3": "Treynor ratio output."
            }
          },
          {
            "type": "runnable_code",
            "filename": "treynor_calc_demo.js",
            "initialCode": "function calculateTreynor(rp, rf, betaP) {\n  const excess = rp - rf;\n  const tr = excess / betaP;\n  return {\n    excessReturnPercent: excess,\n    portfolioBeta: betaP,\n    treynorRatio: Number(tr.toFixed(2)),\n    status: 'TREYNOR_RATIO_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateTreynor(15, 5, 1.25)));",
            "expectedOutput": "{\"excessReturnPercent\":10,\"portfolioBeta\":1.25,\"treynorRatio\":8,\"status\":\"TREYNOR_RATIO_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Treynor Ratio for a fund with a 15% return, 5% risk-free rate, and Beta of 1.25 ($ (15 - 5) / 1.25 $)?",
          "expectedStringOutput": "8",
          "acceptableAnswers": [
            "8",
            "8.0",
            "8.00",
            "treynorRatio\":8"
          ],
          "primaryMisconceptionId": "MC_FIN_SHARPE_TREYNOR_JENSEN_PERFORMANCE_RATIOS",
          "diagnosisMap": {
            "12": {
              "misconceptionId": "MC_FIN_SHARPE_TREYNOR_JENSEN_PERFORMANCE_RATIOS",
              "errorExplanation": "15 / 1.25 = 12 forgets to subtract the risk-free rate. Correct is 10 / 1.25 = 8.0.",
              "recoveryPath": {
                "simplerExplanation": "10 / 1.25 = 8.",
                "guidedFixPrompt": "Type 8"
              }
            }
          }
        }
      },
      {
        "id": "fin-d25-b3-jensens-alpha-manager-skill",
        "day": 25,
        "blockNumber": 3,
        "title": "Jensen's Alpha: Quantifying True Active Portfolio Manager Skill",
        "conceptBudget": {
          "primaryConcept": "Jensen's Alpha Performance Measure",
          "supportingTerms": [
            "$\\alpha_p = R_p - [R_f + \\beta_p(R_m - R_f)]$",
            "Positive Alpha $\\implies$ Manager added value beyond CAPM risk exposure",
            "Zero Alpha $\\implies$ Passive index return",
            "Negative Alpha $\\implies$ Manager underperformed net of fees"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d25-b2-treynor-ratio-systematic-risk",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "jensen_calc_demo.js",
            "initialCode": "function calculateJensenAlpha(rp, rf, betaP, rm) {\n  const benchmark = rf + betaP * (rm - rf);\n  const alpha = rp - benchmark;\n  return {\n    actualReturnPercent: rp,\n    benchmarkCapmReturnPercent: Number(benchmark.toFixed(2)),\n    jensenAlphaPercent: Number(alpha.toFixed(2)),\n    managerSkill: alpha > 0 ? 'ACTIVE_VALUE_ADDED_OUTPERFORMANCE' : 'UNDERPERFORMANCE',\n    status: 'JENSEN_ALPHA_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateJensenAlpha(15, 5, 1.25, 11))); // Benchmark = 5 + 1.25*6 = 12.5% -> Alpha = 15 - 12.5 = +2.5%",
            "expectedOutput": "{\"actualReturnPercent\":15,\"benchmarkCapmReturnPercent\":12.5,\"jensenAlphaPercent\":2.5,\"managerSkill\":\"ACTIVE_VALUE_ADDED_OUTPERFORMANCE\",\"status\":\"JENSEN_ALPHA_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is Jensen's Alpha percentage for a portfolio generating 15% when its CAPM benchmark return is 12.5% ($15 - 12.5$)?",
          "expectedStringOutput": "2.5",
          "acceptableAnswers": [
            "2.5",
            "2.5%",
            "2.50",
            "jensenAlphaPercent\":2.5"
          ],
          "primaryMisconceptionId": "MC_FIN_SHARPE_TREYNOR_JENSEN_PERFORMANCE_RATIOS",
          "diagnosisMap": {
            "10.0": {
              "misconceptionId": "MC_FIN_SHARPE_TREYNOR_JENSEN_PERFORMANCE_RATIOS",
              "errorExplanation": "15 - 5 = 10 is excess return over risk-free rate. Jensen's Alpha is excess over CAPM benchmark = 15 - 12.5 = 2.5%.",
              "recoveryPath": {
                "simplerExplanation": "15 - 12.5 = 2.5%.",
                "guidedFixPrompt": "Type 2.5"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 26,
    "title": "Financial Derivatives: Futures Hedging & Black-Scholes Option Pricing",
    "overviewMetaphor": "Derivatives are Financial Insurance Policies and Price Locks: a coffee company that needs 10,000 bags of beans in 6 months locks in a price of $100/bag today using a Futures Contract ($F_0 = S_0 e^{rT}$)—eliminating price uncertainty; an Option is buying a voucher that gives you the right (but not the obligation) to buy beans at $100; Put-Call Parity ($C + PV(K) = P + S$) proves that the price of call and put options must fit together like interlocking puzzle pieces to prevent free arbitrage profits.",
    "blocks": [
      {
        "id": "fin-d26-b1-futures-fair-pricing-cost-of-carry",
        "day": 26,
        "blockNumber": 1,
        "title": "Futures Pricing & Cost of Carry Model ($F_0 = S_0 e^{rT}$)",
        "conceptBudget": {
          "primaryConcept": "Futures Cost of Carry Formula",
          "supportingTerms": [
            "$F_0 = S_0 e^{rT}$ (Continuous compounding)",
            "$S_0$ (Spot price today)",
            "$r$ (Risk-free interest rate / financing cost)",
            "$T$ (Time to expiration in years)",
            "Arbitrage: Cash and Carry vs Reverse Cash and Carry"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d2-b1-future-value-single-cash-flow",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Futures Cost of Carry ($S_0 = $100, r = 5\\%, T = 1 \\text{ Yr}$)",
              "boxes": [
                {
                  "label": "Spot Price (S0)",
                  "value": "$100.00 cash purchase today",
                  "varType": "Spot Price",
                  "isUpdated": false
                },
                {
                  "label": "Financing Cost (e^rT)",
                  "value": "e^(0.05 x 1) = e^0.05 = 1.051271",
                  "varType": "Cost of Carry",
                  "isUpdated": false
                },
                {
                  "label": "Fair 1-Yr Futures Price (F0)",
                  "value": "$100 x 1.051271 = EXACTLY $105.13 Fair Futures Price!",
                  "varType": "Futures Price",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "futures_calc_demo.js",
            "initialCode": "function calculateFairFuturesPrice(s0, rPct, tYears) {\n  const r = rPct / 100;\n  const f0 = s0 * Math.exp(r * tYears);\n  return {\n    spotPrice: s0,\n    riskFreeRatePercent: rPct,\n    timeYears: tYears,\n    fairFuturesPrice: Number(f0.toFixed(2)),\n    status: 'FUTURES_PRICE_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateFairFuturesPrice(100, 5, 1)));",
            "expectedOutput": "{\"spotPrice\":100,\"riskFreeRatePercent\":5,\"timeYears\":1,\"fairFuturesPrice\":105.13,\"status\":\"FUTURES_PRICE_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the theoretical fair Futures Price for an asset with a $100 spot price and 5% continuous risk-free rate for 1 year ($100 \\times e^{0.05}$)?",
          "expectedStringOutput": "105.13",
          "acceptableAnswers": [
            "105.13",
            "$105.13",
            "fairFuturesPrice\":105.13"
          ],
          "primaryMisconceptionId": "MC_FIN_DERIVATIVES_FUTURES_FORWARDS_HEDGING",
          "diagnosisMap": {
            "105.00": {
              "misconceptionId": "MC_FIN_DERIVATIVES_FUTURES_FORWARDS_HEDGING",
              "errorExplanation": "$105.00 is simple compounding. Continuous compounding gives 100 * e^0.05 = $105.13.",
              "recoveryPath": {
                "simplerExplanation": "100 * exp(0.05) = 105.13.",
                "guidedFixPrompt": "Type 105.13"
              }
            }
          }
        }
      },
      {
        "id": "fin-d26-b2-put-call-parity-arbitrage",
        "day": 26,
        "blockNumber": 2,
        "title": "Put-Call Parity Equation: $C + PV(K) = P + S$",
        "conceptBudget": {
          "primaryConcept": "Put-Call Parity Relationship",
          "supportingTerms": [
            "$C + K e^{-rT} = P + S$",
            "$C$ (European Call price)",
            "$P$ (European Put price)",
            "$K e^{-rT}$ (Present value of strike price $K$)",
            "$S$ (Current spot price of underlying stock)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d26-b1-futures-fair-pricing-cost-of-carry",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Synthetic Put Pricing via Put-Call Parity",
            "codeSnippet": "Spot Price S = $100 | Strike K = $100 | Call C = $10.00 | r = 5% (T = 1)\nPV(K) = 100 * e^(-0.05) = $95.12\nPut Price P = C + PV(K) - S = 10.00 + 95.12 - 100.00 = $5.12",
            "lineNotes": {
              "2": "Present value of strike price.",
              "3": "Synthetic put price derived."
            }
          },
          {
            "type": "runnable_code",
            "filename": "parity_calc_demo.js",
            "initialCode": "function calculateSyntheticPutPrice(s, k, rPct, t, callPrice) {\n  const r = rPct / 100;\n  const pvK = k * Math.exp(-r * t);\n  const put = callPrice + pvK - s;\n  return {\n    callPrice,\n    pvOfStrike: Number(pvK.toFixed(2)),\n    spotPrice: s,\n    syntheticPutPrice: Number(put.toFixed(2)),\n    status: 'PUT_CALL_PARITY_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateSyntheticPutPrice(100, 100, 5, 1, 10.00)));",
            "expectedOutput": "{\"callPrice\":10,\"pvOfStrike\":95.12,\"spotPrice\":100,\"syntheticPutPrice\":5.12,\"status\":\"PUT_CALL_PARITY_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Under Put-Call Parity, what is the synthetic European Put price when Spot = $100, Strike = $100 ($PV(K) = $95.12$), and Call = $10.00 ($10 + 95.12 - 100$)?",
          "expectedStringOutput": "5.12",
          "acceptableAnswers": [
            "5.12",
            "$5.12",
            "syntheticPutPrice\":5.12"
          ],
          "primaryMisconceptionId": "MC_FIN_OPTION_PRICING_CALL_PUT_PARITY",
          "diagnosisMap": {
            "10.00": {
              "misconceptionId": "MC_FIN_OPTION_PRICING_CALL_PUT_PARITY",
              "errorExplanation": "Put price is Call + PV(K) - Spot = 10 + 95.12 - 100 = $5.12.",
              "recoveryPath": {
                "simplerExplanation": "10 + 95.12 - 100 = 5.12.",
                "guidedFixPrompt": "Type 5.12"
              }
            }
          }
        }
      },
      {
        "id": "fin-d26-b3-black-scholes-five-inputs",
        "day": 26,
        "blockNumber": 3,
        "title": "The Black-Scholes Model: The 5 Determinants of Option Value",
        "conceptBudget": {
          "primaryConcept": "Black-Scholes 5 Greeks/Inputs",
          "supportingTerms": [
            "1. Spot Price ($S$)",
            "2. Strike Price ($K$)",
            "3. Time to Expiration ($T$)",
            "4. Risk-Free Rate ($r$)",
            "5. Volatility ($\\sigma$: Most critical driver of option value!)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d26-b2-put-call-parity-arbitrage",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "bsm_inputs_demo.js",
            "initialCode": "function getBlackScholesInputs() {\n  return ['SPOT_PRICE', 'STRIKE_PRICE', 'TIME_TO_EXPIRATION', 'RISK_FREE_RATE', 'VOLATILITY_SIGMA'];\n}\n\nconsole.log(JSON.stringify(getBlackScholesInputs()));",
            "expectedOutput": "[\"SPOT_PRICE\",\"STRIKE_PRICE\",\"TIME_TO_EXPIRATION\",\"RISK_FREE_RATE\",\"VOLATILITY_SIGMA\"]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which input parameter in the Black-Scholes model is the only unobservable variable that must be estimated from market prices (Implied Volatility)?",
          "expectedStringOutput": "VOLATILITY_SIGMA",
          "acceptableAnswers": [
            "VOLATILITY_SIGMA",
            "Volatility",
            "Sigma",
            "Implied Volatility"
          ],
          "primaryMisconceptionId": "MC_FIN_OPTION_PRICING_CALL_PUT_PARITY",
          "diagnosisMap": {
            "SPOT": {
              "misconceptionId": "MC_FIN_OPTION_PRICING_CALL_PUT_PARITY",
              "errorExplanation": "Spot price is observable on the exchange. Volatility must be estimated.",
              "recoveryPath": {
                "simplerExplanation": "Matches VOLATILITY_SIGMA.",
                "guidedFixPrompt": "Type VOLATILITY_SIGMA"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 27,
    "title": "Corporate Restructuring: Mergers & Acquisitions (M&A) Accretion/Dilution",
    "overviewMetaphor": "An M&A Deal is Mixing Two Pitchers of Lemonade: Acquirer Inc. has 200,000 shares earning $1,000,000 ($5.00 EPS sweetness); Target Corp earns $400,000; if Acquirer only needs to issue 50,000 new shares to buy Target, the combined pitcher holds $1,400,000 across 250,000 shares ($5.60 EPS sweetness)—making the deal Accretive (+12% boost in EPS); but if Acquirer overpays and issues 100,000 shares ($4.67 EPS), the lemonade is Diluted—destroying shareholder value.",
    "blocks": [
      {
        "id": "fin-d27-b1-pro-forma-eps-accretion-dilution",
        "day": 27,
        "blockNumber": 1,
        "title": "Pro-Forma Combined EPS & Accretion/Dilution Analysis",
        "conceptBudget": {
          "primaryConcept": "M&A Accretion/Dilution Model",
          "supportingTerms": [
            "$\\text{Pre-Merger EPS}_A = \\frac{\\text{Net Income}_A}{\\text{Shares}_A}$",
            "$\\text{Pro-Forma Combined EPS} = \\frac{\\text{Net Income}_A + \\text{Net Income}_T + \\text{Synergies}}{\\text{Shares}_A + \\text{New Shares Issued}}$",
            "Accretive Deal (Combined EPS > Pre-Merger EPS)",
            "Dilutive Deal (Combined EPS < Pre-Merger EPS)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d22-b2-trading-multiples-pe-ev-ebitda",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "M&A Accretion Math ($1M Acquirer / 200k Shs, $400k Target / 50k Shs)",
              "boxes": [
                {
                  "label": "Pre-Merger Acquirer EPS",
                  "value": "$1,000,000 / 200,000 shares = $5.00 EPS",
                  "varType": "Pre-Deal EPS",
                  "isUpdated": false
                },
                {
                  "label": "Post-Merger Combined Earnings",
                  "value": "$1,000,000 + $400,000 = $1,400,000 Net Income",
                  "varType": "Combined Earnings",
                  "isUpdated": false
                },
                {
                  "label": "Post-Merger Total Shares",
                  "value": "200,000 + 50,000 new shares = 250,000 shares",
                  "varType": "Combined Shares",
                  "isUpdated": false
                },
                {
                  "label": "Post-Merger Combined EPS",
                  "value": "$1,400,000 / 250,000 = $5.60 EPS (+12.0% ACCRETIVE DEAL!)",
                  "varType": "Accretive Result",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "accretion_calc_demo.js",
            "initialCode": "function evaluateMerger(eA, sA, eT, sNew) {\n  const preEps = eA / sA;\n  const postEps = (eA + eT) / (sA + sNew);\n  const changePct = ((postEps - preEps) / preEps) * 100;\n  const isAccretive = postEps > preEps;\n  return {\n    preMergerEps: Number(preEps.toFixed(2)),\n    postMergerEps: Number(postEps.toFixed(2)),\n    epsChangePercent: Number(changePct.toFixed(2)),\n    dealOutcome: isAccretive ? 'ACCRETIVE_DEAL' : 'DILUTIVE_DEAL',\n    status: 'MERGER_ACCRETION_EVALUATED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateMerger(1000000, 200000, 400000, 50000)));",
            "expectedOutput": "{\"preMergerEps\":5,\"postMergerEps\":5.6,\"epsChangePercent\":12,\"dealOutcome\":\"ACCRETIVE_DEAL\",\"status\":\"MERGER_ACCRETION_EVALUATED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the post-merger combined EPS when Acquirer ($1,000,000 earnings, 200,000 shares) acquires Target ($400,000 earnings) by issuing 50,000 new shares ($1400000 / 250000$)?",
          "expectedStringOutput": "5.6",
          "acceptableAnswers": [
            "5.6",
            "$5.60",
            "5.60",
            "postMergerEps\":5.6"
          ],
          "primaryMisconceptionId": "MC_FIN_MERGERS_ACQUISITIONS_ACCRETION_DILUTION",
          "diagnosisMap": {
            "5.0": {
              "misconceptionId": "MC_FIN_MERGERS_ACQUISITIONS_ACCRETION_DILUTION",
              "errorExplanation": "$5.00 is pre-merger EPS. Post-merger combined EPS increases to $5.60.",
              "recoveryPath": {
                "simplerExplanation": "1400000 / 250000 = 5.60.",
                "guidedFixPrompt": "Type 5.6"
              }
            }
          }
        }
      },
      {
        "id": "fin-d27-b2-merger-synergies-hard-vs-soft",
        "day": 27,
        "blockNumber": 2,
        "title": "Merger Synergies: Cost Synergies (Hard) vs Revenue Synergies (Soft)",
        "conceptBudget": {
          "primaryConcept": "M&A Synergy Types",
          "supportingTerms": [
            "Cost Synergies (Operational cost reductions e.g. consolidating headquarters, shared IT systems $\\implies$ High certainty / Hard synergies)",
            "Revenue Synergies (Cross-selling products $\\implies$ Lower certainty / Soft synergies)",
            "Winner's Curse & Overpayment Risk"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d27-b1-pro-forma-eps-accretion-dilution",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "synergies_demo.js",
            "initialCode": "function evaluateSynergyCertainty(synergyType) {\n  return synergyType === 'COST_REDUCTION_HEADCOUNT_CONSOLIDATION'\n    ? 'HARD_SYNERGY_HIGH_PROBABILITY_OF_REALIZATION'\n    : 'SOFT_SYNERGY_LOWER_CERTAINTY_CROSS_SELLING';\n}\n\nconsole.log(evaluateSynergyCertainty('COST_REDUCTION_HEADCOUNT_CONSOLIDATION'));\nconsole.log(evaluateSynergyCertainty('REVENUE_CROSS_SELLING'));",
            "expectedOutput": "HARD_SYNERGY_HIGH_PROBABILITY_OF_REALIZATION\nSOFT_SYNERGY_LOWER_CERTAINTY_CROSS_SELLING",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which type of M&A synergy has the highest probability of execution realization in corporate restructuring?",
          "expectedStringOutput": "HARD_SYNERGY_HIGH_PROBABILITY_OF_REALIZATION",
          "acceptableAnswers": [
            "HARD_SYNERGY_HIGH_PROBABILITY_OF_REALIZATION",
            "Cost Synergies",
            "Hard Synergies"
          ],
          "primaryMisconceptionId": "MC_FIN_MERGERS_ACQUISITIONS_ACCRETION_DILUTION",
          "diagnosisMap": {
            "REVENUE": {
              "misconceptionId": "MC_FIN_MERGERS_ACQUISITIONS_ACCRETION_DILUTION",
              "errorExplanation": "Revenue cross-selling is uncertain. Cost reduction is a hard synergy with high certainty.",
              "recoveryPath": {
                "simplerExplanation": "Cost synergies have highest realization probability.",
                "guidedFixPrompt": "Type HARD_SYNERGY_HIGH_PROBABILITY_OF_REALIZATION"
              }
            }
          }
        }
      },
      {
        "id": "fin-d27-b3-merger-consideration-stock-vs-cash",
        "day": 27,
        "blockNumber": 3,
        "title": "Deal Consideration: Stock-for-Stock vs All-Cash Acquisitions",
        "conceptBudget": {
          "primaryConcept": "M&A Consideration Structure",
          "supportingTerms": [
            "All-Cash Deal (Acquirer assumes 100% of integration risk; target shareholders cash out with taxable gain)",
            "Stock-for-Stock Deal (Target shareholders share ongoing synergy upside and downside; tax-deferred reorganization)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d27-b2-merger-synergies-hard-vs-soft",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "consideration_demo.js",
            "initialCode": "function evaluateConsiderationRiskSharing(isStockDeal) {\n  return isStockDeal\n    ? 'TARGET_SHAREHOLDERS_SHARE_POST_MERGER_RISK_AND_UPSIDE'\n    : 'ACQUIRER_BEARS_100_PERCENT_INTEGRATION_RISK';\n}\n\nconsole.log(evaluateConsiderationRiskSharing(true));\nconsole.log(evaluateConsiderationRiskSharing(false));",
            "expectedOutput": "TARGET_SHAREHOLDERS_SHARE_POST_MERGER_RISK_AND_UPSIDE\nACQUIRER_BEARS_100_PERCENT_INTEGRATION_RISK",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What risk-sharing characteristic distinguishes a Stock-for-Stock merger from an All-Cash transaction?",
          "expectedStringOutput": "TARGET_SHAREHOLDERS_SHARE_POST_MERGER_RISK_AND_UPSIDE",
          "acceptableAnswers": [
            "TARGET_SHAREHOLDERS_SHARE_POST_MERGER_RISK_AND_UPSIDE",
            "Target shares risk",
            "Shared risk"
          ],
          "primaryMisconceptionId": "MC_FIN_MERGERS_ACQUISITIONS_ACCRETION_DILUTION",
          "diagnosisMap": {
            "CASH": {
              "misconceptionId": "MC_FIN_MERGERS_ACQUISITIONS_ACCRETION_DILUTION",
              "errorExplanation": "In stock deals, target shareholders share ongoing risk and upside.",
              "recoveryPath": {
                "simplerExplanation": "Target shareholders share risk and upside.",
                "guidedFixPrompt": "Type TARGET_SHAREHOLDERS_SHARE_POST_MERGER_RISK_AND_UPSIDE"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 28,
    "title": "Corporate Credit Analysis & Altman Z-Score Bankruptcy Prediction",
    "overviewMetaphor": "The Altman Z-Score is an Intensive Care Heart Monitor for Corporate Bankruptcy: Edward Altman synthesized 5 key financial ratios (Working Capital, Retained Earnings, Operating Profit, Market Equity, and Sales Turnover) into a single Z-Score equation ($Z = 1.2 X_1 + 1.4 X_2 + 3.3 X_3 + 0.6 X_4 + 0.999 X_5$); a score above 2.99 indicates a Safe Green Zone; between 1.81 and 2.99 is a Cautionary Grey Zone; below 1.81 indicates severe financial distress with high bankruptcy probability within 24 months.",
    "blocks": [
      {
        "id": "fin-d28-b1-altman-z-score-equation",
        "day": 28,
        "blockNumber": 1,
        "title": "Altman Z-Score Model: $Z = 1.2 X_1 + 1.4 X_2 + 3.3 X_3 + 0.6 X_4 + 0.999 X_5$",
        "conceptBudget": {
          "primaryConcept": "Altman Z-Score Formula",
          "supportingTerms": [
            "$X_1 = \\frac{\\text{Working Capital}}{\\text{Total Assets}}$ (Short-term liquidity)",
            "$X_2 = \\frac{\\text{Retained Earnings}}{\\text{Total Assets}}$ (Cumulative profitability)",
            "$X_3 = \\frac{\\text{EBIT}}{\\text{Total Assets}}$ (Operating asset productivity)",
            "$X_4 = \\frac{\\text{Market Value of Equity}}{\\text{Total Liabilities}}$ (Leverage cushion)",
            "$X_5 = \\frac{\\text{Sales}}{\\text{Total Assets}}$ (Asset turnover)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d16-b1-degree-of-operating-leverage-dol",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Altman Z-Score Components ($1M Firm)",
              "boxes": [
                {
                  "label": "X1 (WC/Assets = 0.20)",
                  "value": "1.2 x 0.20 = 0.240",
                  "varType": "Liquidity",
                  "isUpdated": false
                },
                {
                  "label": "X2 (RE/Assets = 0.30)",
                  "value": "1.4 x 0.30 = 0.420",
                  "varType": "Profitability",
                  "isUpdated": false
                },
                {
                  "label": "X3 (EBIT/Assets = 0.20)",
                  "value": "3.3 x 0.20 = 0.660",
                  "varType": "Productivity",
                  "isUpdated": false
                },
                {
                  "label": "X4 (Equity/Liab = 2.00)",
                  "value": "0.6 x 2.00 = 1.200",
                  "varType": "Leverage",
                  "isUpdated": false
                },
                {
                  "label": "X5 (Sales/Assets = 1.00)",
                  "value": "0.999 x 1.00 = 0.999",
                  "varType": "Turnover",
                  "isUpdated": false
                },
                {
                  "label": "Total Altman Z-Score",
                  "value": "Sum = 3.52 -> SAFE ZONE (FINANCIALLY SOUND!)",
                  "varType": "Z-Score",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "altman_calc_demo.js",
            "initialCode": "function calculateAltmanZ(wc, re, ebit, mCap, sales, assets, liab) {\n  const x1 = wc / assets;\n  const x2 = re / assets;\n  const x3 = ebit / assets;\n  const x4 = mCap / liab;\n  const x5 = sales / assets;\n  const z = 1.2 * x1 + 1.4 * x2 + 3.3 * x3 + 0.6 * x4 + 0.999 * x5;\n  let zone = 'DISTRESS_ZONE';\n  if (z > 2.99) zone = 'SAFE_ZONE_FINANCIALLY_SOUND';\n  else if (z >= 1.81) zone = 'GREY_ZONE_MODERATE_RISK';\n  return {\n    zScore: Number(z.toFixed(2)),\n    zone,\n    status: 'ALTMAN_Z_SCORE_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateAltmanZ(200000, 300000, 200000, 800000, 1000000, 1000000, 400000)));",
            "expectedOutput": "{\"zScore\":3.52,\"zone\":\"SAFE_ZONE_FINANCIALLY_SOUND\",\"status\":\"ALTMAN_Z_SCORE_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the calculated Altman Z-Score for a company with component sum $0.24 + 0.42 + 0.66 + 1.20 + 0.999$ ($3.519$)?",
          "expectedStringOutput": "3.52",
          "acceptableAnswers": [
            "3.52",
            "zScore\":3.52"
          ],
          "primaryMisconceptionId": "MC_FIN_CORPORATE_CREDIT_SCORING_ALTMAN_Z_SCORE",
          "diagnosisMap": {
            "2.99": {
              "misconceptionId": "MC_FIN_CORPORATE_CREDIT_SCORING_ALTMAN_Z_SCORE",
              "errorExplanation": "2.99 is the threshold for safe zone. The calculated score is 3.52.",
              "recoveryPath": {
                "simplerExplanation": "0.24 + 0.42 + 0.66 + 1.20 + 0.999 = 3.52.",
                "guidedFixPrompt": "Type 3.52"
              }
            }
          }
        }
      },
      {
        "id": "fin-d28-b2-altman-zones-of-discrimination",
        "day": 28,
        "blockNumber": 2,
        "title": "Altman Zones: Safe Zone ($Z > 2.99$), Grey Zone ($1.81 - 2.99$), Distress ($Z < 1.81$)",
        "conceptBudget": {
          "primaryConcept": "Altman Zones of Discrimination",
          "supportingTerms": [
            "Safe Zone ($Z > 2.99$: Very low bankruptcy probability)",
            "Grey Zone ($1.81 \\le Z \\le 2.99$: Moderate financial vulnerability)",
            "Distress Zone ($Z < 1.81$: Imminent bankruptcy risk)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d28-b1-altman-z-score-equation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Altman Z-Score Discrimination Thresholds",
            "codeSnippet": "// Z > 2.99  -> SAFE ZONE (Strong balance sheet, low credit default risk)\n// 1.81 - 2.99 -> GREY ZONE (Exercise caution, monitor liquidity)\n// Z < 1.81  -> DISTRESS ZONE (High probability of default within 2 years)",
            "lineNotes": {
              "1": "Safe territory.",
              "2": "Vulnerable middle tier.",
              "3": "Bankruptcy danger."
            }
          },
          {
            "type": "runnable_code",
            "filename": "zones_demo.js",
            "initialCode": "function evaluateZScoreZone(z) {\n  if (z > 2.99) return 'SAFE_ZONE_LOW_DEFAULT_RISK';\n  if (z >= 1.81) return 'GREY_ZONE_MONITOR_REQUIRED';\n  return 'DISTRESS_ZONE_HIGH_BANKRUPTCY_RISK';\n}\n\nconsole.log(evaluateZScoreZone(3.50));\nconsole.log(evaluateZScoreZone(2.40));\nconsole.log(evaluateZScoreZone(1.40));",
            "expectedOutput": "SAFE_ZONE_LOW_DEFAULT_RISK\nGREY_ZONE_MONITOR_REQUIRED\nDISTRESS_ZONE_HIGH_BANKRUPTCY_RISK",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Into which risk zone does a corporation with an Altman Z-Score of 1.40 fall?",
          "expectedStringOutput": "DISTRESS_ZONE_HIGH_BANKRUPTCY_RISK",
          "acceptableAnswers": [
            "DISTRESS_ZONE_HIGH_BANKRUPTCY_RISK",
            "Distress Zone",
            "High bankruptcy risk"
          ],
          "primaryMisconceptionId": "MC_FIN_CORPORATE_CREDIT_SCORING_ALTMAN_Z_SCORE",
          "diagnosisMap": {
            "GREY": {
              "misconceptionId": "MC_FIN_CORPORATE_CREDIT_SCORING_ALTMAN_Z_SCORE",
              "errorExplanation": "Grey zone is 1.81 to 2.99. Any score below 1.81 is in the Distress Zone.",
              "recoveryPath": {
                "simplerExplanation": "Below 1.81 is Distress Zone.",
                "guidedFixPrompt": "Type DISTRESS_ZONE_HIGH_BANKRUPTCY_RISK"
              }
            }
          }
        }
      },
      {
        "id": "fin-d28-b3-credit-rating-agency-mapping",
        "day": 28,
        "blockNumber": 3,
        "title": "Credit Rating Agency Grades (AAA to D) & Default Spreads",
        "conceptBudget": {
          "primaryConcept": "Credit Ratings & Default Spreads",
          "supportingTerms": [
            "Investment Grade (AAA, AA, A, BBB: Institutional grade debt)",
            "High Yield / Junk Bonds (BB, B, CCC, D: High default risk with wide yield spreads)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d28-b2-altman-zones-of-discrimination",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "credit_ratings_demo.js",
            "initialCode": "function evaluateCreditRatingGrade(rating) {\n  const investmentGrade = ['AAA', 'AA', 'A', 'BBB'];\n  return investmentGrade.includes(rating)\n    ? 'INVESTMENT_GRADE_INSTITUTIONAL_QUALITY'\n    : 'HIGH_YIELD_JUNK_BOND_SPECULATIVE';\n}\n\nconsole.log(evaluateCreditRatingGrade('AAA'));\nconsole.log(evaluateCreditRatingGrade('BB'));",
            "expectedOutput": "INVESTMENT_GRADE_INSTITUTIONAL_QUALITY\nHIGH_YIELD_JUNK_BOND_SPECULATIVE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What classification applies to corporate bonds rated AAA, AA, A, or BBB?",
          "expectedStringOutput": "INVESTMENT_GRADE_INSTITUTIONAL_QUALITY",
          "acceptableAnswers": [
            "INVESTMENT_GRADE_INSTITUTIONAL_QUALITY",
            "Investment Grade",
            "Institutional Quality"
          ],
          "primaryMisconceptionId": "MC_FIN_CORPORATE_CREDIT_SCORING_ALTMAN_Z_SCORE",
          "diagnosisMap": {
            "JUNK": {
              "misconceptionId": "MC_FIN_CORPORATE_CREDIT_SCORING_ALTMAN_Z_SCORE",
              "errorExplanation": "Junk bonds are BB and lower. BBB and above are Investment Grade.",
              "recoveryPath": {
                "simplerExplanation": "Matches INVESTMENT_GRADE_INSTITUTIONAL_QUALITY.",
                "guidedFixPrompt": "Type INVESTMENT_GRADE_INSTITUTIONAL_QUALITY"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 29,
    "title": "FinTech, Robo-Advisory & ESG Sustainable Investment Scoring",
    "overviewMetaphor": "FinTech & ESG Scoring is Upgrading from a Paper Compass to an AI Autopilot with Green Energy Sensors: modern Robo-Advisors automatically profile an investor's risk appetite (Risk Score 7/10 $\\implies$ 70% Equity / 30% Debt) and rebalance portfolios algorithmically with zero emotion; simultaneously, ESG Scoring measures corporate sustainability across Environmental footprint, Social responsibility, and ethical Governance—ensuring capital flows to companies that generate profits sustainably without destroying the planet.",
    "blocks": [
      {
        "id": "fin-d29-b1-robo-advisory-risk-profiling-allocation",
        "day": 29,
        "blockNumber": 1,
        "title": "Algorithmic Robo-Advisors & Automated Risk-Based Asset Allocation",
        "conceptBudget": {
          "primaryConcept": "Robo-Advisory Asset Allocation Engine",
          "supportingTerms": [
            "Risk Profiling Questionnaire (Score 1 to 10)",
            "Dynamic Asset Allocation: $\\text{Equity \\%} = \\text{Risk Score} \\times 10$, $\\text{Debt \\%} = 100 - \\text{Equity \\%}$",
            "Automated Threshold Rebalancing"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d23-b1-portfolio-expected-return-and-variance",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Robo-Advisory Asset Allocation (Risk Score = 7)",
              "boxes": [
                {
                  "label": "Investor Risk Profile",
                  "value": "Risk Score = 7 / 10 (Moderate Aggressive Growth)",
                  "varType": "Risk Score",
                  "isUpdated": false
                },
                {
                  "label": "Target Equity Allocation",
                  "value": "7 x 10% = 70.0% Equities (Index ETFs)",
                  "varType": "Equity Portion",
                  "isUpdated": false
                },
                {
                  "label": "Target Fixed Income Allocation",
                  "value": "100% - 70% = 30.0% Sovereign Debt & Corporate Bonds",
                  "varType": "Debt Portion",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "robo_alloc_demo.js",
            "initialCode": "function generateRoboAllocation(riskScore) {\n  const equityPct = riskScore * 10;\n  const debtPct = 100 - equityPct;\n  return {\n    riskScore,\n    recommendedEquityPercent: equityPct,\n    recommendedDebtPercent: debtPct,\n    status: 'ROBO_ALLOCATION_GENERATED'\n  };\n}\n\nconsole.log(JSON.stringify(generateRoboAllocation(7)));",
            "expectedOutput": "{\"riskScore\":7,\"recommendedEquityPercent\":70,\"recommendedDebtPercent\":30,\"status\":\"ROBO_ALLOCATION_GENERATED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the recommended equity allocation percentage for an investor with a risk score of 7 out of 10 ($7 \\times 10$)?",
          "expectedStringOutput": "70",
          "acceptableAnswers": [
            "70",
            "70%",
            "recommendedEquityPercent\":70"
          ],
          "primaryMisconceptionId": "MC_FIN_FINTECH_ROBO_ADVISORY_ALGORITHMIC_ALLOCATION",
          "diagnosisMap": {
            "30": {
              "misconceptionId": "MC_FIN_FINTECH_ROBO_ADVISORY_ALGORITHMIC_ALLOCATION",
              "errorExplanation": "30% is the debt allocation. Equity allocation is 70%.",
              "recoveryPath": {
                "simplerExplanation": "7 * 10 = 70%.",
                "guidedFixPrompt": "Type 70"
              }
            }
          }
        }
      },
      {
        "id": "fin-d29-b2-esg-three-pillars-scoring",
        "day": 29,
        "blockNumber": 2,
        "title": "ESG Framework: Environmental, Social & Governance Scoring",
        "conceptBudget": {
          "primaryConcept": "ESG Sustainable Scoring Framework",
          "supportingTerms": [
            "Environmental (E: Carbon intensity, water usage, renewable energy)",
            "Social (S: Workforce diversity, human rights, labor standards)",
            "Governance (G: Board independence, executive compensation alignment, anti-corruption)",
            "ESG Rating Tiers (Score $\\ge 75 \\implies$ Tier A Leader)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d29-b1-robo-advisory-risk-profiling-allocation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "ESG Pillar Composite Score",
            "codeSnippet": "E Score = 80 (30% Weight) -> 24.0\nS Score = 85 (30% Weight) -> 25.5\nG Score = 90 (40% Weight) -> 36.0\nComposite ESG Score = 24.0 + 25.5 + 36.0 = 85.5 -> TIER A ESG LEADER!",
            "lineNotes": {
              "1": "Environmental score.",
              "2": "Social score.",
              "3": "Governance score.",
              "4": "Weighted composite rating."
            }
          },
          {
            "type": "runnable_code",
            "filename": "esg_scoring_demo.js",
            "initialCode": "function evaluateEsgScore(e, s, g) {\n  const composite = 0.3 * e + 0.3 * s + 0.4 * g;\n  const isLeader = composite >= 75;\n  return {\n    compositeEsgScore: Number(composite.toFixed(1)),\n    ratingTier: isLeader ? 'ESG_LEADER_TIER_A' : 'ESG_STANDARD_TIER_B',\n    status: 'ESG_EVALUATED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateEsgScore(80, 85, 90)));",
            "expectedOutput": "{\"compositeEsgScore\":85.5,\"ratingTier\":\"ESG_LEADER_TIER_A\",\"status\":\"ESG_EVALUATED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What rating tier is assigned to a corporation with a composite ESG score of 85.5?",
          "expectedStringOutput": "ESG_LEADER_TIER_A",
          "acceptableAnswers": [
            "ESG_LEADER_TIER_A",
            "Tier A",
            "ESG Leader"
          ],
          "primaryMisconceptionId": "MC_FIN_ESG_SUSTAINABILITY_INVESTMENT_SCORING",
          "diagnosisMap": {
            "TIER_B": {
              "misconceptionId": "MC_FIN_ESG_SUSTAINABILITY_INVESTMENT_SCORING",
              "errorExplanation": "Score >= 75 qualifies for Tier A ESG Leader.",
              "recoveryPath": {
                "simplerExplanation": "Score 85.5 awards ESG_LEADER_TIER_A.",
                "guidedFixPrompt": "Type ESG_LEADER_TIER_A"
              }
            }
          }
        }
      },
      {
        "id": "fin-d29-b3-green-bonds-sustainable-finance",
        "day": 29,
        "blockNumber": 3,
        "title": "Green Bonds & Sustainable Capital Markets",
        "conceptBudget": {
          "primaryConcept": "Green Bonds Mechanism",
          "supportingTerms": [
            "Green Bonds (Fixed-income debt earmarked exclusively for climate and environmental projects)",
            "Greenium (Yield discount / pricing premium for green issuances)",
            "Third-Party Verification & Use-of-Proceeds reporting"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d29-b2-esg-three-pillars-scoring",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "green_bonds_demo.js",
            "initialCode": "function evaluateGreenBondProceeds(isEarmarkedForClimate) {\n  return isEarmarkedForClimate\n    ? 'GREEN_BOND_PROCEEDS_STRICTLY_EARMARKED_FOR_SUSTAINABILITY'\n    : 'CONVENTIONAL_CORPORATE_BOND';\n}\n\nconsole.log(evaluateGreenBondProceeds(true));\nconsole.log(evaluateGreenBondProceeds(false));",
            "expectedOutput": "GREEN_BOND_PROCEEDS_STRICTLY_EARMARKED_FOR_SUSTAINABILITY\nCONVENTIONAL_CORPORATE_BOND",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What statutory requirement distinguishes a Green Bond issuance from conventional corporate debt?",
          "expectedStringOutput": "GREEN_BOND_PROCEEDS_STRICTLY_EARMARKED_FOR_SUSTAINABILITY",
          "acceptableAnswers": [
            "GREEN_BOND_PROCEEDS_STRICTLY_EARMARKED_FOR_SUSTAINABILITY",
            "Earmarked for sustainability",
            "Climate earmarked"
          ],
          "primaryMisconceptionId": "MC_FIN_ESG_SUSTAINABILITY_INVESTMENT_SCORING",
          "diagnosisMap": {
            "GENERAL": {
              "misconceptionId": "MC_FIN_ESG_SUSTAINABILITY_INVESTMENT_SCORING",
              "errorExplanation": "Green bond proceeds cannot be used for general purposes; they are strictly earmarked for sustainability projects.",
              "recoveryPath": {
                "simplerExplanation": "Strictly earmarked for sustainability.",
                "guidedFixPrompt": "Type GREEN_BOND_PROCEEDS_STRICTLY_EARMARKED_FOR_SUSTAINABILITY"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 30,
    "title": "🏆 FINAL CAPSTONE: Integrated Corporate Finance, Valuation & Portfolio Investment Management Suite",
    "overviewMetaphor": "The Final Capstone is the Master Chief Financial Officer (CFO) and Chief Investment Officer (CIO) Control Center: you orchestrate all 5 pillars of modern enterprise finance: 1. Time Value of Money loan & bond valuation engine; 2. Capital budgeting NPV & WACC hurdle rate project decision rules; 3. Corporate leverage, break-even, and MM capital structure optimization; 4. DCF and trading multiples equity valuation; 5. Modern Portfolio Theory, CAPM Beta risk pricing, and ESG investment allocation—certifying a complete, enterprise-grade corporate finance and investment management suite.",
    "blocks": [
      {
        "id": "fin-d30-b1-capstone-suite-orchestration",
        "day": 30,
        "blockNumber": 1,
        "title": "Enterprise Corporate Finance & Investment Suite Orchestration",
        "conceptBudget": {
          "primaryConcept": "Capstone Suite Orchestration",
          "supportingTerms": [
            "TVM Valuation Engine",
            "Capital Budgeting Engine",
            "Capital Structure Engine",
            "DCF Equity Valuation Engine",
            "Portfolio Investment Suite"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d29-b3-green-bonds-sustainable-finance",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Complete 30-Day Corporate Finance Master Architecture",
              "nodes": [
                {
                  "id": "1",
                  "label": "Pillar 1: Time Value of Money & Bond Valuation Engine (Days 1-8)",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Pillar 2: Capital Budgeting NPV/IRR & WACC Composite Hurdle (Days 9-15)",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Pillar 3: Financial Leverage, MM Theorem & Dividend Policy (Days 16-21)",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Pillar 4: DCF Equity Valuation & Trading Multiples (Day 22)",
                  "kind": "process"
                },
                {
                  "id": "5",
                  "label": "Pillar 5: Portfolio Theory, CAPM, Derivatives & ESG FinTech (Days 23-29)",
                  "kind": "process"
                },
                {
                  "id": "6",
                  "label": "🏆 Master CFO/CIO Enterprise Certification Achieved (Day 30)!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "capstone_orchestrator_demo.js",
            "initialCode": "function orchestrateCapstone(tvm, cb, cs, val, port) {\n  const isNominal = tvm && cb && cs && val && port;\n  return {\n    tvmSubsystem: tvm ? 'ONLINE' : 'OFFLINE',\n    capitalBudgetingSubsystem: cb ? 'ONLINE' : 'OFFLINE',\n    capitalStructureSubsystem: cs ? 'ONLINE' : 'OFFLINE',\n    equityValuationSubsystem: val ? 'ONLINE' : 'OFFLINE',\n    portfolioManagementSubsystem: port ? 'ONLINE' : 'OFFLINE',\n    capstoneMasterStatus: isNominal ? 'CORPORATE_FINANCE_MASTER_SUITE_ACTIVE_NOMINAL' : 'INCOMPLETE_ORCHESTRATION'\n  };\n}\n\nconsole.log(orchestrateCapstone(true, true, true, true, true).capstoneMasterStatus);",
            "expectedOutput": "CORPORATE_FINANCE_MASTER_SUITE_ACTIVE_NOMINAL",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What master status confirms complete active orchestration of the Corporate Finance & Investment Suite?",
          "expectedStringOutput": "CORPORATE_FINANCE_MASTER_SUITE_ACTIVE_NOMINAL",
          "acceptableAnswers": [
            "CORPORATE_FINANCE_MASTER_SUITE_ACTIVE_NOMINAL",
            "capstoneMasterStatus: CORPORATE_FINANCE_MASTER_SUITE_ACTIVE_NOMINAL"
          ],
          "primaryMisconceptionId": "MC_FIN_CAPSTONE_CORPORATE_FINANCE_AND_PORTFOLIO_VALUATION",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_FIN_CAPSTONE_CORPORATE_FINANCE_AND_PORTFOLIO_VALUATION",
              "errorExplanation": "Matches CORPORATE_FINANCE_MASTER_SUITE_ACTIVE_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type CORPORATE_FINANCE_MASTER_SUITE_ACTIVE_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "fin-d30-b2-capstone-audit-verification",
        "day": 30,
        "blockNumber": 2,
        "title": "Enterprise Audit Verification & 5-Pillar Compliance Certification",
        "conceptBudget": {
          "primaryConcept": "Capstone Audit Invariant Verification",
          "supportingTerms": [
            "TVM Invariant",
            "Valuation Invariant",
            "Policy Invariant",
            "Portfolio Invariant",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d30-b1-capstone-suite-orchestration",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "capstone_audit_demo.js",
            "initialCode": "function auditCapstoneSystem(p1, p2, p3, p4, p5) {\n  const passed = p1 && p2 && p3 && p4 && p5;\n  return {\n    pillar1_TvmVerified: p1,\n    pillar2_CapitalBudgetingVerified: p2,\n    pillar3_CapitalStructureVerified: p3,\n    pillar4_ValuationVerified: p4,\n    pillar5_PortfolioRiskVerified: p5,\n    overallGrade: passed ? 'CORPORATE_FINANCE_AND_INVESTMENT_MASTER_AUDIT_PASSED_100_PERCENT' : 'AUDIT_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditCapstoneSystem(true, true, true, true, true)));",
            "expectedOutput": "{\"pillar1_TvmVerified\":true,\"pillar2_CapitalBudgetingVerified\":true,\"pillar3_CapitalStructureVerified\":true,\"pillar4_ValuationVerified\":true,\"pillar5_PortfolioRiskVerified\":true,\"overallGrade\":\"CORPORATE_FINANCE_AND_INVESTMENT_MASTER_AUDIT_PASSED_100_PERCENT\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade is awarded when all 5 pillars of the Corporate Finance curriculum pass verification?",
          "expectedStringOutput": "CORPORATE_FINANCE_AND_INVESTMENT_MASTER_AUDIT_PASSED_100_PERCENT",
          "acceptableAnswers": [
            "CORPORATE_FINANCE_AND_INVESTMENT_MASTER_AUDIT_PASSED_100_PERCENT",
            "overallGrade\":\"CORPORATE_FINANCE_AND_INVESTMENT_MASTER_AUDIT_PASSED_100_PERCENT\""
          ],
          "primaryMisconceptionId": "MC_FIN_CAPSTONE_CORPORATE_FINANCE_AND_PORTFOLIO_VALUATION",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_FIN_CAPSTONE_CORPORATE_FINANCE_AND_PORTFOLIO_VALUATION",
              "errorExplanation": "All checks passing awards CORPORATE_FINANCE_AND_INVESTMENT_MASTER_AUDIT_PASSED_100_PERCENT.",
              "recoveryPath": {
                "simplerExplanation": "Awards CORPORATE_FINANCE_AND_INVESTMENT_MASTER_AUDIT_PASSED_100_PERCENT.",
                "guidedFixPrompt": "Type CORPORATE_FINANCE_AND_INVESTMENT_MASTER_AUDIT_PASSED_100_PERCENT"
              }
            }
          }
        }
      },
      {
        "id": "fin-d30-b3-course-completion-ceremony",
        "day": 30,
        "blockNumber": 3,
        "title": "Course 19: Business Finance & Investment Management (B.Com / BBA) Gold Standard Certification",
        "conceptBudget": {
          "primaryConcept": "Gold Standard Certification",
          "supportingTerms": [
            "Course 19 Certified",
            "Production Reference Standard",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "fin-d30-b2-capstone-audit-verification",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "course19_cert_demo.js",
            "initialCode": "console.log('🏆 COURSE 19 COMPLETE: Business Finance & Investment Management (B.Com / BBA) [VERIFIED GOLD STANDARD 100/100]');",
            "expectedOutput": "🏆 COURSE 19 COMPLETE: Business Finance & Investment Management (B.Com / BBA) [VERIFIED GOLD STANDARD 100/100]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What gold-standard certification string confirms Course 19 graduation?",
          "expectedStringOutput": "🏆 COURSE 19 COMPLETE: Business Finance & Investment Management (B.Com / BBA) [VERIFIED GOLD STANDARD 100/100]",
          "acceptableAnswers": [
            "🏆 COURSE 19 COMPLETE: Business Finance & Investment Management (B.Com / BBA) [VERIFIED GOLD STANDARD 100/100]",
            "VERIFIED GOLD STANDARD 100/100"
          ],
          "primaryMisconceptionId": "MC_FIN_CAPSTONE_CORPORATE_FINANCE_AND_PORTFOLIO_VALUATION",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_FIN_CAPSTONE_CORPORATE_FINANCE_AND_PORTFOLIO_VALUATION",
              "errorExplanation": "Matches course completion string.",
              "recoveryPath": {
                "simplerExplanation": "Matches completion string.",
                "guidedFixPrompt": "Type 🏆 COURSE 19 COMPLETE: Business Finance & Investment Management (B.Com / BBA) [VERIFIED GOLD STANDARD 100/100]"
              }
            }
          }
        }
      }
    ]
  }
];
