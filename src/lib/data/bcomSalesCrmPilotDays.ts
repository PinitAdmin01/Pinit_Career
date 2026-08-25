import { DayLessonPlan } from '@/lib/types/lessonEngine';

export const BCOM_SALES_CRM_PILOT_DAYS: DayLessonPlan[] = [
  {
    "day": 1,
    "title": "Sales Foundations & Buying Psychology: Value Selling & Decision-Making Units (DMU)",
    "overviewMetaphor": "B2B Enterprise Sales is an Orchestra Where Every Stakeholder Must Play in Harmony to Win: In consumer sales, one person buys a soda on impulse; in B2B enterprise sales, you are selling to a 5-member Decision-Making Unit (DMU): The Economic Buyer who owns the budget ($100k+), the Internal Champion who sells on your behalf when you leave the room, the Technical Evaluator who inspects security/API compliance, the End User who uses the software daily, and the Deal Blocker whose objections must be neutralized; closing an enterprise contract requires orchestrating unanimous alignment across all DMU members.",
    "blocks": [
      {
        "id": "scrm-d1-b1-dmu-stakeholders-alignment",
        "day": 1,
        "blockNumber": 1,
        "title": "The 5 Stakeholder Roles of the B2B Decision-Making Unit (DMU)",
        "conceptBudget": {
          "primaryConcept": "DMU Multi-Stakeholder Alignment",
          "supportingTerms": [
            "Economic Buyer (Has signature budget authority)",
            "Champion (Internal advocate pushing your solution)",
            "Technical Evaluator (Validates InfoSec, architecture, & SLA compliance)",
            "User (End employees who experience daily workflow pain)",
            "Blocker (Gatekeeper or incumbent vendor ally)"
          ]
        },
        "prerequisiteThresholds": [],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "B2B Buying Center Stakeholder Matrix ($100k Deal)",
              "boxes": [
                {
                  "label": "Economic Buyer",
                  "value": "CFO / VP Finance (Signs check, cares about 3x ROI & cash flow)",
                  "varType": "Budget Owner",
                  "isUpdated": false
                },
                {
                  "label": "Internal Champion",
                  "value": "VP of Sales / Ops Leader (Pushes deal internally, gives insider Intel)",
                  "varType": "Champion",
                  "isUpdated": false
                },
                {
                  "label": "Close Readiness",
                  "value": "ALL 4 STAKEHOLDERS ALIGNED -> DMU READY TO CLOSE NOMINAL!",
                  "varType": "Close Ready",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "dmu_eval_demo.js",
            "initialCode": "function evaluateDmu(economicBuyer, champion, techApproved, blockerNeutralized) {\n  const isReady = economicBuyer && champion && techApproved && blockerNeutralized;\n  return {\n    economicBuyer,\n    champion,\n    techApproved,\n    blockerNeutralized,\n    isReady,\n    status: isReady ? 'DMU_STAKEHOLDERS_ALIGNED_READY_TO_CLOSE' : 'UNALIGNED_RISK'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateDmu(true, true, true, true)));\nconsole.log(JSON.stringify(evaluateDmu(true, false, true, true)));",
            "expectedOutput": "{\"economicBuyer\":true,\"champion\":true,\"techApproved\":true,\"blockerNeutralized\":true,\"isReady\":true,\"status\":\"DMU_STAKEHOLDERS_ALIGNED_READY_TO_CLOSE\"}\n{\"economicBuyer\":true,\"champion\":false,\"techApproved\":true,\"blockerNeutralized\":true,\"isReady\":false,\"status\":\"UNALIGNED_RISK\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms an enterprise deal has achieved full multi-stakeholder alignment across Economic Buyer, Champion, Technical Approval, and Blocker Neutralization?",
          "expectedStringOutput": "DMU_STAKEHOLDERS_ALIGNED_READY_TO_CLOSE",
          "acceptableAnswers": [
            "DMU_STAKEHOLDERS_ALIGNED_READY_TO_CLOSE",
            "DMU Aligned",
            "Ready to close"
          ],
          "primaryMisconceptionId": "MC_SCRM_SALES_FOUNDATIONS_BUYING_PSYCHOLOGY",
          "diagnosisMap": {
            "UNALIGNED_RISK": {
              "misconceptionId": "MC_SCRM_SALES_FOUNDATIONS_BUYING_PSYCHOLOGY",
              "errorExplanation": "All 4 stakeholders being true produces DMU_STAKEHOLDERS_ALIGNED_READY_TO_CLOSE.",
              "recoveryPath": {
                "simplerExplanation": "Matches DMU_STAKEHOLDERS_ALIGNED_READY_TO_CLOSE.",
                "guidedFixPrompt": "Type DMU_STAKEHOLDERS_ALIGNED_READY_TO_CLOSE"
              }
            }
          }
        }
      },
      {
        "id": "scrm-d1-b2-consultative-value-selling-vs-pitching",
        "day": 1,
        "blockNumber": 2,
        "title": "Consultative Value-Based Selling vs Transactional Feature Pitching",
        "conceptBudget": {
          "primaryConcept": "Consultative Selling Invariant",
          "supportingTerms": [
            "Transactional Selling (Show up and throw up: Dumping 50 software features without diagnosing customer problems)",
            "Consultative Selling (Diagnosing acute business bottlenecks like a trusted doctor, then prescribing a tailored high-ROI solution)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d1-b1-dmu-stakeholders-alignment",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Sales Approach Comparison",
            "codeSnippet": "// ❌ TRANSACTIONAL: 'Look at our 47 dropdown menus and new dark mode UI!' (Zero business relevance)\n// ✅ CONSULTATIVE:  'You mentioned invoice processing delays cost ₹40 Lakhs in late fees. Here is how we eliminate that delay'",
            "lineNotes": {
              "1": "Feature dumping amateur.",
              "2": "Value-driven consultative partner."
            }
          },
          {
            "type": "runnable_code",
            "filename": "consultative_demo.js",
            "initialCode": "function getGoldStandardSellingMethodology() {\n  return 'CONSULTATIVE_VALUE_BASED_PROBLEM_SOLVING';\n}\n\nconsole.log(getGoldStandardSellingMethodology());",
            "expectedOutput": "CONSULTATIVE_VALUE_BASED_PROBLEM_SOLVING",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which selling methodology focuses on diagnosing enterprise customer business pain and prescribing quantifiable financial solutions?",
          "expectedStringOutput": "CONSULTATIVE_VALUE_BASED_PROBLEM_SOLVING",
          "acceptableAnswers": [
            "CONSULTATIVE_VALUE_BASED_PROBLEM_SOLVING",
            "Consultative Selling",
            "Value-based selling"
          ],
          "primaryMisconceptionId": "MC_SCRM_SALES_FOUNDATIONS_BUYING_PSYCHOLOGY",
          "diagnosisMap": {
            "TRANSACTIONAL": {
              "misconceptionId": "MC_SCRM_SALES_FOUNDATIONS_BUYING_PSYCHOLOGY",
              "errorExplanation": "Transactional selling pushes product features. Modern enterprise sales is CONSULTATIVE_VALUE_BASED_PROBLEM_SOLVING.",
              "recoveryPath": {
                "simplerExplanation": "Matches CONSULTATIVE_VALUE_BASED_PROBLEM_SOLVING.",
                "guidedFixPrompt": "Type CONSULTATIVE_VALUE_BASED_PROBLEM_SOLVING"
              }
            }
          }
        }
      },
      {
        "id": "scrm-d1-b3-quantifying-business-pain-metrics",
        "day": 1,
        "blockNumber": 3,
        "title": "Quantifying Business Pain: Translating Emotional Frustration to Executive Dollars",
        "conceptBudget": {
          "primaryConcept": "Pain Quantification Formula",
          "supportingTerms": [
            "Operational Frustration ('Our team hates manual data entry')",
            "Executive Dollar Pain (15 reps $\\times$ 2 hours/day $\\times$ $\\$50$/hour = $\\$390,000$ in annual wasted salary expense)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d1-b2-consultative-value-selling-vs-pitching",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "pain_quant_demo.js",
            "initialCode": "function quantifyAnnualLaborWaste(reps, hoursPerDay, hourlyRate) {\n  return reps * hoursPerDay * hourlyRate * 260; // 260 working days/yr\n}\n\nconsole.log(quantifyAnnualLaborWaste(15, 2, 50));",
            "expectedOutput": "390000",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the annual quantified financial loss in dollars when 15 reps waste 2 hours per day on manual data entry at $50/hour across 260 working days ($15 \\times 2 \\times 50 \\times 260$)?",
          "expectedStringOutput": "390000",
          "acceptableAnswers": [
            "390000",
            "$390,000",
            "390,000"
          ],
          "primaryMisconceptionId": "MC_SCRM_SALES_FOUNDATIONS_BUYING_PSYCHOLOGY",
          "diagnosisMap": {
            "1500": {
              "misconceptionId": "MC_SCRM_SALES_FOUNDATIONS_BUYING_PSYCHOLOGY",
              "errorExplanation": "1500 is daily cost (30 hours * $50). Multiplying by 260 working days yields $390,000 annual waste.",
              "recoveryPath": {
                "simplerExplanation": "15 * 2 * 50 * 260 = 390,000.",
                "guidedFixPrompt": "Type 390000"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 2,
    "title": "Prospecting & Multi-Touch Outbound Cadences (ReplyRate >= 8.0%)",
    "overviewMetaphor": "A Multi-Touch Outbound Cadence is a Coordinated Precision Drumbeat Across Multiple Channels: Contacting a prospect once via email and giving up is amateur spam; orchestrating an 8-touch cadence across 14 days (Email $\\to$ LinkedIn Connect $\\to$ Custom Video $\\to$ Targeted Phone Call) generates 45 positive replies from 500 contacted target accounts ($45/500 = 9.0\\%$ Reply Rate), smashing the 8.0% high-performance outbound benchmark.",
    "blocks": [
      {
        "id": "scrm-d2-b1-outbound-reply-rate-benchmark",
        "day": 2,
        "blockNumber": 1,
        "title": "Outbound Cadence Performance: $\\text{Reply Rate}\\% = \\frac{\\text{Positive Replies}}{\\text{Contacted Accounts}} \\times 100\\% \\ge 8.0\\%$",
        "conceptBudget": {
          "primaryConcept": "Outbound Reply Rate Formula",
          "supportingTerms": [
            "Target Accounts Contacted ($500$)",
            "Positive Qualified Replies ($45$)",
            "Reply Rate = $\\frac{45}{500} \\times 100\\% = 9.0\\%$",
            "High-Performance Cadence Benchmark: $\\ge 8.0\\% \\implies$ High Performing; $< 4.0\\% \\implies$ Sub-Optimal Copy or ICP Mismatch"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d1-b1-dmu-stakeholders-alignment",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Outbound Cadence Performance Ledger (500 Accounts, 45 Replies)",
              "boxes": [
                {
                  "label": "Target Account Outreach",
                  "value": "500 Verified ICP Accounts Enrolled in 14-Day Cadence",
                  "varType": "Accounts",
                  "isUpdated": false
                },
                {
                  "label": "Positive Replies (45)",
                  "value": "45 Accounts booked discovery calls (9.00% Reply Rate)",
                  "varType": "Replies",
                  "isUpdated": false
                },
                {
                  "label": "Performance Rating",
                  "value": "9.0% >= 8.0% Benchmark -> HIGH PERFORMING OUTBOUND CADENCE!",
                  "varType": "Rating",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "cadence_calc_demo.js",
            "initialCode": "function evaluateCadence(accounts, replies, benchmarkPct) {\n  const rate = (replies / accounts) * 100;\n  const isElite = rate >= benchmarkPct;\n  return {\n    accounts,\n    replies,\n    replyRate: Number(rate.toFixed(2)),\n    isElite,\n    status: isElite ? 'HIGH_PERFORMING_OUTBOUND_CADENCE' : 'SUB_OPTIMAL'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateCadence(500, 45, 8.0)));",
            "expectedOutput": "{\"accounts\":500,\"replies\":45,\"replyRate\":9,\"isElite\":true,\"status\":\"HIGH_PERFORMING_OUTBOUND_CADENCE\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the reply rate percentage when 45 positive responses are generated from 500 contacted target accounts ($ (45 / 500) \\times 100 $)?",
          "expectedStringOutput": "9",
          "acceptableAnswers": [
            "9",
            "9%",
            "9.0",
            "replyRate\":9"
          ],
          "primaryMisconceptionId": "MC_SCRM_PROSPECTING_ICP_ACCOUNT_CADENCE",
          "diagnosisMap": {
            "0.09": {
              "misconceptionId": "MC_SCRM_PROSPECTING_ICP_ACCOUNT_CADENCE",
              "errorExplanation": "0.09 is decimal form. Multiplied by 100 yields 9.0%.",
              "recoveryPath": {
                "simplerExplanation": "45 / 500 * 100 = 9%.",
                "guidedFixPrompt": "Type 9"
              }
            }
          }
        }
      },
      {
        "id": "scrm-d2-b2-multi-channel-cadence-architecture",
        "day": 2,
        "blockNumber": 2,
        "title": "The 14-Day 8-Touch Multi-Channel Cadence Blueprint",
        "conceptBudget": {
          "primaryConcept": "Multi-Touch Cadence Sequence",
          "supportingTerms": [
            "Day 1: Personalized Cold Email",
            "Day 3: LinkedIn Profile View + Soft Connect",
            "Day 5: Personalized Loom / Vidyard Screen Share",
            "Day 8: Phone Call + Voicemail",
            "Day 11: Case Study Sharing",
            "Day 14: Permission-to-Close Breakup Email"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d2-b1-outbound-reply-rate-benchmark",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Multi-Touch Sequence Timing",
            "codeSnippet": "// Day 1: Email (Specific trigger: New VP hire or Series B funding)\n// Day 3: LinkedIn (Like executive post, send connection with zero pitch)\n// Day 5: Video (30-second walkthrough highlighting their checkout bug)\n// Day 8: Call (Reference video: 'Saw you checked the video on your cart error')",
            "lineNotes": {
              "1": "Relevant trigger.",
              "2": "Social touchpoint.",
              "3": "Visual evidence.",
              "4": "Contextual call."
            }
          },
          {
            "type": "runnable_code",
            "filename": "cadence_touches_demo.js",
            "initialCode": "function getStandardCadenceTouchCount() {\n  return 8;\n}\n\nconsole.log(getStandardCadenceTouchCount());",
            "expectedOutput": "8",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many coordinated touchpoints across email, social, and phone are recommended in a standard 14-day B2B outbound cadence?",
          "expectedStringOutput": "8",
          "acceptableAnswers": [
            "8",
            "Eight",
            "8 touches"
          ],
          "primaryMisconceptionId": "MC_SCRM_PROSPECTING_ICP_ACCOUNT_CADENCE",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_SCRM_PROSPECTING_ICP_ACCOUNT_CADENCE",
              "errorExplanation": "Single-touch emails have <1% reply rates. An 8-touch cadence is standard.",
              "recoveryPath": {
                "simplerExplanation": "Standard cadence has 8 touches.",
                "guidedFixPrompt": "Type 8"
              }
            }
          }
        }
      },
      {
        "id": "scrm-d2-b3-breakup-email-psychology",
        "day": 2,
        "blockNumber": 3,
        "title": "The Breakup Email: Reversing Reverse Psychology to Spark Replies",
        "conceptBudget": {
          "primaryConcept": "Breakup Email Psychology",
          "supportingTerms": [
            "Breakup Email (Politely offering to stop outreach: 'I assume this is not a priority right now, so I will stop following up')",
            "Drives a 33% response rate from dormant executive prospects"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d2-b2-multi-channel-cadence-architecture",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "breakup_demo.js",
            "initialCode": "function getBreakupEmailEffectiveness() {\n  return 'TRIGGERS_LOSS_AVERSION_AND_SPARKS_FINAL_REPLY';\n}\n\nconsole.log(getBreakupEmailEffectiveness());",
            "expectedOutput": "TRIGGERS_LOSS_AVERSION_AND_SPARKS_FINAL_REPLY",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What psychological phenomenon causes the final Breakup Email in an outbound cadence to generate disproportionate executive replies?",
          "expectedStringOutput": "TRIGGERS_LOSS_AVERSION_AND_SPARKS_FINAL_REPLY",
          "acceptableAnswers": [
            "TRIGGERS_LOSS_AVERSION_AND_SPARKS_FINAL_REPLY",
            "Loss aversion",
            "Triggers loss aversion"
          ],
          "primaryMisconceptionId": "MC_SCRM_PROSPECTING_ICP_ACCOUNT_CADENCE",
          "diagnosisMap": {
            "SPAM": {
              "misconceptionId": "MC_SCRM_PROSPECTING_ICP_ACCOUNT_CADENCE",
              "errorExplanation": "Permission-to-close emails leverage loss aversion to trigger responses.",
              "recoveryPath": {
                "simplerExplanation": "Matches TRIGGERS_LOSS_AVERSION_AND_SPARKS_FINAL_REPLY.",
                "guidedFixPrompt": "Type TRIGGERS_LOSS_AVERSION_AND_SPARKS_FINAL_REPLY"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 3,
    "title": "Lead Qualification Methodologies: BANT vs MEDDPICC Mastery",
    "overviewMetaphor": "MEDDPICC is a Structural Engineering Stress-Test for Enterprise Deals: While BANT only checks if they have a budget, MEDDPICC interrogates the entire commercial pipeline: 1. Metrics (Quantified economic impact); 2. Economic Buyer; 3. Decision Criteria; 4. Decision Process; 5. Paper Process; 6. Identify Pain; 7. Champion; 8. Competition; scoring 7 out of 8 verified pillars ($7/8$) confirms a high-probability opportunity, preventing quarter-end closing surprises.",
    "blocks": [
      {
        "id": "scrm-d3-b1-meddpicc-eight-pillars-scoring",
        "day": 3,
        "blockNumber": 1,
        "title": "MEDDPICC Deal Health Scoring: 8 Pillars ($Score \\ge 7/8 \\implies$ Qualified)",
        "conceptBudget": {
          "primaryConcept": "MEDDPICC Qualification Score",
          "supportingTerms": [
            "Metrics",
            "Economic Buyer",
            "Decision Criteria",
            "Decision Process",
            "Paper Process",
            "Identify Pain",
            "Champion",
            "Competition",
            "Score $\\ge 7/8 \\implies$ High Probability Qualified Opportunity"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d2-b1-outbound-reply-rate-benchmark",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "MEDDPICC Deal Scorecard (7 of 8 Pillars Verified)",
              "boxes": [
                {
                  "label": "Metrics & Economic Buyer",
                  "value": "Verified $200k Savings + Engaged CFO directly",
                  "varType": "Pillars 1&2",
                  "isUpdated": false
                },
                {
                  "label": "Paper Process & Champion",
                  "value": "Mapped Legal MSA timeline + VP Sales champion testing passed",
                  "varType": "Pillars 5&7",
                  "isUpdated": false
                },
                {
                  "label": "MEDDPICC Score",
                  "value": "7 / 8 Points -> HIGH PROBABILITY QUALIFIED OPPORTUNITY!",
                  "varType": "Score",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "meddpicc_calc_demo.js",
            "initialCode": "function scoreMeddpicc(m, eb, dc, dp, pp, ip, c, comp) {\n  const score = [m, eb, dc, dp, pp, ip, c, comp].filter(Boolean).length;\n  const isQualified = score >= 7;\n  return {\n    score,\n    maxScore: 8,\n    isQualified,\n    rating: isQualified ? 'HIGH_PROBABILITY_QUALIFIED_OPPORTUNITY' : 'HIGH_RISK_PIPELINE',\n    status: 'MEDDPICC_SCORED'\n  };\n}\n\nconsole.log(JSON.stringify(scoreMeddpicc(true, true, true, true, true, true, true, false)));",
            "expectedOutput": "{\"score\":7,\"maxScore\":8,\"isQualified\":true,\"rating\":\"HIGH_PROBABILITY_QUALIFIED_OPPORTUNITY\",\"status\":\"MEDDPICC_SCORED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What qualification score out of 8 points is earned by an enterprise opportunity verifying Metrics, Economic Buyer, Decision Criteria, Decision Process, Paper Process, Pain, and Champion?",
          "expectedStringOutput": "7",
          "acceptableAnswers": [
            "7",
            "7/8",
            "7 points",
            "score\":7"
          ],
          "primaryMisconceptionId": "MC_SCRM_LEAD_QUALIFICATION_MEDDPICC_BANT",
          "diagnosisMap": {
            "8": {
              "misconceptionId": "MC_SCRM_LEAD_QUALIFICATION_MEDDPICC_BANT",
              "errorExplanation": "Competition was not verified in this deal, so the score is exactly 7 out of 8.",
              "recoveryPath": {
                "simplerExplanation": "7 pillars verified = 7 points.",
                "guidedFixPrompt": "Type 7"
              }
            }
          }
        }
      },
      {
        "id": "scrm-d3-b2-paper-process-in-enterprise-sales",
        "day": 3,
        "blockNumber": 2,
        "title": "The 'Paper Process': Why Deals Slip on Legal, Procurement & Security",
        "conceptBudget": {
          "primaryConcept": "Paper Process Invariant",
          "supportingTerms": [
            "Paper Process (The legal contract journey: MSA redlining, vendor registration in Coupa/SAP, InfoSec security review, procurement discount negotiations)",
            "Takes 30-45 days after verbal yes"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d3-b1-meddpicc-eight-pillars-scoring",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Verbal Yes vs Paper Process",
            "codeSnippet": "// ❌ AMATEUR REP: 'The VP said yes on Dec 20, so it closes this quarter!' -> Deal slips to February!\n// ✅ MEDDPICC REP: 'Mapped the Paper Process: Legal redlines take 3 weeks + InfoSec audit takes 2 weeks'",
            "lineNotes": {
              "1": "Naive optimism.",
              "2": "Rigorous paper process timeline mapping."
            }
          },
          {
            "type": "runnable_code",
            "filename": "paper_process_demo.js",
            "initialCode": "function getPaperProcessComponents() {\n  return 'LEGAL_REDLINES_INFOSEC_REVIEW_AND_PROCUREMENT_PO_ISSUANCE';\n}\n\nconsole.log(getPaperProcessComponents());",
            "expectedOutput": "LEGAL_REDLINES_INFOSEC_REVIEW_AND_PROCUREMENT_PO_ISSUANCE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What administrative stages constitute the 'Paper Process' (PP) in enterprise B2B sales?",
          "expectedStringOutput": "LEGAL_REDLINES_INFOSEC_REVIEW_AND_PROCUREMENT_PO_ISSUANCE",
          "acceptableAnswers": [
            "LEGAL_REDLINES_INFOSEC_REVIEW_AND_PROCUREMENT_PO_ISSUANCE",
            "Legal redlines and procurement"
          ],
          "primaryMisconceptionId": "MC_SCRM_LEAD_QUALIFICATION_MEDDPICC_BANT",
          "diagnosisMap": {
            "VERBAL_YES": {
              "misconceptionId": "MC_SCRM_LEAD_QUALIFICATION_MEDDPICC_BANT",
              "errorExplanation": "Verbal yes is not the paper process. It includes LEGAL_REDLINES_INFOSEC_REVIEW_AND_PROCUREMENT_PO_ISSUANCE.",
              "recoveryPath": {
                "simplerExplanation": "Matches LEGAL_REDLINES_INFOSEC_REVIEW_AND_PROCUREMENT_PO_ISSUANCE.",
                "guidedFixPrompt": "Type LEGAL_REDLINES_INFOSEC_REVIEW_AND_PROCUREMENT_PO_ISSUANCE"
              }
            }
          }
        }
      },
      {
        "id": "scrm-d3-b3-testing-the-internal-champion",
        "day": 3,
        "blockNumber": 3,
        "title": "Testing the Champion: Advocate vs True Power Champion",
        "conceptBudget": {
          "primaryConcept": "Champion Testing Invariant",
          "supportingTerms": [
            "Advocate (Friendly employee who loves your software but has zero political power or influence)",
            "True Champion (Has executive access, sells for you, and passes the test of introducing you to the Economic Buyer)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d3-b2-paper-process-in-enterprise-sales",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "champion_test_demo.js",
            "initialCode": "function testChampion(canIntroduceToEconomicBuyer) {\n  return canIntroduceToEconomicBuyer\n    ? 'VALIDATED_TRUE_POWER_CHAMPION'\n    : 'FRIENDLY_COACH_WITHOUT_PURCHASING_INFLUENCE';\n}\n\nconsole.log(testChampion(true));\nconsole.log(testChampion(false));",
            "expectedOutput": "VALIDATED_TRUE_POWER_CHAMPION\nFRIENDLY_COACH_WITHOUT_PURCHASING_INFLUENCE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What qualification status is confirmed when an internal stakeholder successfully introduces you to the Economic Buyer and shares competitive insights?",
          "expectedStringOutput": "VALIDATED_TRUE_POWER_CHAMPION",
          "acceptableAnswers": [
            "VALIDATED_TRUE_POWER_CHAMPION",
            "True Champion",
            "Validated Champion"
          ],
          "primaryMisconceptionId": "MC_SCRM_LEAD_QUALIFICATION_MEDDPICC_BANT",
          "diagnosisMap": {
            "COACH": {
              "misconceptionId": "MC_SCRM_LEAD_QUALIFICATION_MEDDPICC_BANT",
              "errorExplanation": "Passing the access test validates them as a VALIDATED_TRUE_POWER_CHAMPION.",
              "recoveryPath": {
                "simplerExplanation": "Matches VALIDATED_TRUE_POWER_CHAMPION.",
                "guidedFixPrompt": "Type VALIDATED_TRUE_POWER_CHAMPION"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 4,
    "title": "Discovery Calls & Active Listening: The SPICED Framework",
    "overviewMetaphor": "Discovery Calls are an MRI Scan Before Operating: An amateur salesperson starts prescribing pills before knowing what hurts; the SPICED Discovery Framework diagnoses: 1. Situation (Current tool setup); 2. Pain (Billing reconciliation errors); 3. Impact ($10,000/month in wasted labor and software losses = $120,000 Annual Cost of Inaction); 4. Critical Event (Fiscal Year Audit in 90 days); 5. Decision Criteria; quantifying this $120,000 COI makes buying your $25,000 software an urgent no-brainer.",
    "blocks": [
      {
        "id": "scrm-d4-b1-cost-of-inaction-coi-calculation",
        "day": 4,
        "blockNumber": 1,
        "title": "Calculating the Annual Cost of Inaction (COI): $\\text{COI} = (\\text{Wasted Labor} + \\text{Software Loss}) \\times 12$",
        "conceptBudget": {
          "primaryConcept": "Cost of Inaction Formula",
          "supportingTerms": [
            "Monthly Wasted Hours ($100$ hours)",
            "Hourly Labor Rate ($50.00/\\text{hr} \\implies \\$5,000$ labor waste)",
            "Monthly Software Leakage ($5,000.00$)",
            "Monthly Total Loss = $5,000 + 5,000 = \\$10,000.00$",
            "Annual Cost of Inaction = $10,000 \\times 12 = \\$120,000.00$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d3-b1-meddpicc-eight-pillars-scoring",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Discovery Cost of Inaction Ledger ($10k/mo Loss)",
              "boxes": [
                {
                  "label": "Monthly Labor Waste",
                  "value": "100 Hours x $50/hr = $5,000.00 Monthly Manual Labor Drain",
                  "varType": "Labor Loss",
                  "isUpdated": false
                },
                {
                  "label": "Software Leakage",
                  "value": "$5,000.00 Monthly Legacy Subscription & SLA Penalties",
                  "varType": "Direct Loss",
                  "isUpdated": false
                },
                {
                  "label": "Annual Cost of Inaction",
                  "value": "$10,000/mo x 12 = $120,000.00 ANNUAL COST OF DOING NOTHING!",
                  "varType": "Annual COI",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "coi_calc_demo.js",
            "initialCode": "function calculateCoi(hours, rate, softwareLoss) {\n  const monthlyLabor = hours * rate;\n  const totalMonthly = monthlyLabor + softwareLoss;\n  const annualCoi = totalMonthly * 12;\n  return {\n    totalMonthly,\n    annualCoi,\n    status: 'COI_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateCoi(100, 50, 5000)));",
            "expectedOutput": "{\"totalMonthly\":10000,\"annualCoi\":120000,\"status\":\"COI_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the annual Cost of Inaction (COI) in dollars when a company suffers $5,000 in labor waste and $5,000 in software losses every month ($ (5,000 + 5,000) \\times 12 $)?",
          "expectedStringOutput": "120000",
          "acceptableAnswers": [
            "120000",
            "$120,000",
            "120,000",
            "annualCoi\":120000"
          ],
          "primaryMisconceptionId": "MC_SCRM_DISCOVERY_CALLS_SPICED_ACTIVE_LISTENING",
          "diagnosisMap": {
            "10000": {
              "misconceptionId": "MC_SCRM_DISCOVERY_CALLS_SPICED_ACTIVE_LISTENING",
              "errorExplanation": "10,000 is the monthly loss. Annualized across 12 months, the COI is $120,000.",
              "recoveryPath": {
                "simplerExplanation": "10,000 * 12 = 120,000.",
                "guidedFixPrompt": "Type 120000"
              }
            }
          }
        }
      },
      {
        "id": "scrm-d4-b2-critical-events-urgency-drivers",
        "day": 4,
        "blockNumber": 2,
        "title": "Uncovering the 'Critical Event' in SPICED to Prevent Deal Stalling",
        "conceptBudget": {
          "primaryConcept": "Critical Event Urgency Driver",
          "supportingTerms": [
            "Critical Event (A hard external deadline with negative business consequences if missed e.g. Black Friday launch, SOC 2 audit date, fiscal year-end budget lapse)",
            "Without a critical event, deals slip indefinitely"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d4-b1-cost-of-inaction-coi-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Critical Event Identification",
            "codeSnippet": "// ❌ NO CRITICAL EVENT: 'We want to upgrade billing sometime this year' -> Sits in pipeline for 14 months\n// ✅ CRITICAL EVENT:    'New GDPR compliance mandate takes effect on Oct 1 or we face €20M fine!'",
            "lineNotes": {
              "1": "Indefinite delay.",
              "2": "Non-negotiable hard deadline."
            }
          },
          {
            "type": "runnable_code",
            "filename": "critical_event_demo.js",
            "initialCode": "function evaluateDealUrgency(hasHardDeadlineWithConsequences) {\n  return hasHardDeadlineWithConsequences\n    ? 'HIGH_URGENCY_CRITICAL_EVENT_COMMITTED_TIMELINE'\n    : 'LOW_URGENCY_DESIRED_EVENT_HIGH_SLIPPAGE_RISK';\n}\n\nconsole.log(evaluateDealUrgency(true));",
            "expectedOutput": "HIGH_URGENCY_CRITICAL_EVENT_COMMITTED_TIMELINE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What deal urgency rating is established when a prospect identifies a hard deadline with severe regulatory financial penalties if missed?",
          "expectedStringOutput": "HIGH_URGENCY_CRITICAL_EVENT_COMMITTED_TIMELINE",
          "acceptableAnswers": [
            "HIGH_URGENCY_CRITICAL_EVENT_COMMITTED_TIMELINE",
            "High urgency",
            "Critical event committed"
          ],
          "primaryMisconceptionId": "MC_SCRM_DISCOVERY_CALLS_SPICED_ACTIVE_LISTENING",
          "diagnosisMap": {
            "LOW_URGENCY": {
              "misconceptionId": "MC_SCRM_DISCOVERY_CALLS_SPICED_ACTIVE_LISTENING",
              "errorExplanation": "Hard external deadlines create HIGH_URGENCY_CRITICAL_EVENT_COMMITTED_TIMELINE.",
              "recoveryPath": {
                "simplerExplanation": "Matches HIGH_URGENCY_CRITICAL_EVENT_COMMITTED_TIMELINE.",
                "guidedFixPrompt": "Type HIGH_URGENCY_CRITICAL_EVENT_COMMITTED_TIMELINE"
              }
            }
          }
        }
      },
      {
        "id": "scrm-d4-b3-spiced-framework-five-components",
        "day": 4,
        "blockNumber": 3,
        "title": "The 5 SPICED Discovery Dimensions: Situation, Pain, Impact, Critical Event, Decision",
        "conceptBudget": {
          "primaryConcept": "SPICED 5 Dimensions",
          "supportingTerms": [
            "S (Situation)",
            "P (Pain)",
            "I (Impact)",
            "C (Critical Event)",
            "ED (Decision Criteria & Decision Process)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d4-b2-critical-events-urgency-drivers",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "spiced_pillars_demo.js",
            "initialCode": "function getSpicedPillars() {\n  return ['SITUATION', 'PAIN', 'IMPACT', 'CRITICAL_EVENT', 'DECISION'];\n}\n\nconsole.log(JSON.stringify(getSpicedPillars()));",
            "expectedOutput": "[\"SITUATION\",\"PAIN\",\"IMPACT\",\"CRITICAL_EVENT\",\"DECISION\"]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What does the 'I' represent in the Winning by Design SPICED discovery framework?",
          "expectedStringOutput": "IMPACT",
          "acceptableAnswers": [
            "IMPACT",
            "Impact",
            "Quantifiable Impact"
          ],
          "primaryMisconceptionId": "MC_SCRM_DISCOVERY_CALLS_SPICED_ACTIVE_LISTENING",
          "diagnosisMap": {
            "INTEREST": {
              "misconceptionId": "MC_SCRM_DISCOVERY_CALLS_SPICED_ACTIVE_LISTENING",
              "errorExplanation": "In SPICED, 'I' stands for quantifiable business Impact.",
              "recoveryPath": {
                "simplerExplanation": "Matches IMPACT.",
                "guidedFixPrompt": "Type IMPACT"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 5,
    "title": "⭐ MILESTONE 1: Complete Prospecting, Discovery & Deal Qualification Engine",
    "overviewMetaphor": "Milestone 1 Synthesis: The complete sovereign prospecting, discovery, and qualification operating system: 1. DMU multi-stakeholder readiness; 2. Outbound cadence performance ($9.0\\%$ reply rate); 3. MEDDPICC deal health qualification ($7/8$ points); 4. SPICED discovery Cost of Inaction modeling ($120,000$ annual COI).",
    "blocks": [
      {
        "id": "scrm-d5-b1-prospecting-qualification-master-synthesis",
        "day": 5,
        "blockNumber": 1,
        "title": "Sales Prospecting & Qualification Master Kernel Synthesis",
        "conceptBudget": {
          "primaryConcept": "Prospecting & Qualification Engine Synthesis",
          "supportingTerms": [
            "DMU Stakeholder Engine",
            "Cadence Performance Engine",
            "MEDDPICC Qualification Engine",
            "COI Discovery Engine"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d4-b3-spiced-framework-five-components",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Milestone 1 Prospecting & Qualification Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "Validates DMU stakeholder alignment across 4 roles",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Executes 14-day multi-touch cadence achieving 9% reply rate",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Stress-tests deal health with 7/8 MEDDPICC qualification score",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Quantifies $120k annual COI and certifies qualification engine!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "prospecting_kernel_demo.js",
            "initialCode": "function runProspectingEngine() {\n  return {\n    dmuSubsystem: 'ONLINE_DMU_ALIGNED_ACTIVE',\n    cadenceSubsystem: 'ONLINE_9_PERCENT_REPLY_ACTIVE',\n    meddpiccSubsystem: 'ONLINE_7_OF_8_QUALIFIED_ACTIVE',\n    coiSubsystem: 'ONLINE_120K_COI_ACTIVE',\n    engineStatus: 'SALES_PROSPECTING_AND_QUALIFICATION_KERNEL_ACTIVE_NOMINAL'\n  };\n}\n\nconsole.log(runProspectingEngine().engineStatus);",
            "expectedOutput": "SALES_PROSPECTING_AND_QUALIFICATION_KERNEL_ACTIVE_NOMINAL",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What engine status confirms active operational synthesis of the Sales Prospecting & Qualification Master Kernel?",
          "expectedStringOutput": "SALES_PROSPECTING_AND_QUALIFICATION_KERNEL_ACTIVE_NOMINAL",
          "acceptableAnswers": [
            "SALES_PROSPECTING_AND_QUALIFICATION_KERNEL_ACTIVE_NOMINAL",
            "engineStatus: SALES_PROSPECTING_AND_QUALIFICATION_KERNEL_ACTIVE_NOMINAL"
          ],
          "primaryMisconceptionId": "MC_SCRM_PROSPECTING_ICP_ACCOUNT_CADENCE",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_SCRM_PROSPECTING_ICP_ACCOUNT_CADENCE",
              "errorExplanation": "Matches SALES_PROSPECTING_AND_QUALIFICATION_KERNEL_ACTIVE_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type SALES_PROSPECTING_AND_QUALIFICATION_KERNEL_ACTIVE_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "scrm-d5-b2-prospecting-engine-audit",
        "day": 5,
        "blockNumber": 2,
        "title": "Prospecting & Qualification Engine Invariant Verification & Precision Audit",
        "conceptBudget": {
          "primaryConcept": "Prospecting Invariant Verification",
          "supportingTerms": [
            "DMU Invariant",
            "Cadence Invariant",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d5-b1-prospecting-qualification-master-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "prospecting_audit_demo.js",
            "initialCode": "function auditProspectingEngine(dmuValid, cadValid, meddValid, coiValid) {\n  const passed = dmuValid && cadValid && meddValid && coiValid;\n  return {\n    dmuVerified: dmuValid,\n    cadenceVerified: cadValid,\n    meddpiccVerified: meddValid,\n    coiVerified: coiValid,\n    grade: passed ? 'PROSPECTING_QUALIFICATION_ENGINE_AUDIT_PASSED' : 'AUDIT_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditProspectingEngine(true, true, true, true)));",
            "expectedOutput": "{\"dmuVerified\":true,\"cadenceVerified\":true,\"meddpiccVerified\":true,\"coiVerified\":true,\"grade\":\"PROSPECTING_QUALIFICATION_ENGINE_AUDIT_PASSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade is awarded when DMU, Cadence, MEDDPICC, and COI engines pass 100%?",
          "expectedStringOutput": "PROSPECTING_QUALIFICATION_ENGINE_AUDIT_PASSED",
          "acceptableAnswers": [
            "PROSPECTING_QUALIFICATION_ENGINE_AUDIT_PASSED",
            "grade\":\"PROSPECTING_QUALIFICATION_ENGINE_AUDIT_PASSED\""
          ],
          "primaryMisconceptionId": "MC_SCRM_PROSPECTING_ICP_ACCOUNT_CADENCE",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_SCRM_PROSPECTING_ICP_ACCOUNT_CADENCE",
              "errorExplanation": "All checks passing awards PROSPECTING_QUALIFICATION_ENGINE_AUDIT_PASSED.",
              "recoveryPath": {
                "simplerExplanation": "Awards PROSPECTING_QUALIFICATION_ENGINE_AUDIT_PASSED.",
                "guidedFixPrompt": "Type PROSPECTING_QUALIFICATION_ENGINE_AUDIT_PASSED"
              }
            }
          }
        }
      },
      {
        "id": "scrm-d5-b3-milestone1-scrm-cert",
        "day": 5,
        "blockNumber": 3,
        "title": "Milestone 1 Sales Prospecting & Qualification Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 1 Certification",
          "supportingTerms": [
            "Prospecting Qualification Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d5-b2-prospecting-engine-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone1_scrm_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 1: Complete Prospecting, Discovery & Deal Qualification Engine [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 1: Complete Prospecting, Discovery & Deal Qualification Engine [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 1 completion?",
          "expectedStringOutput": "⭐ MILESTONE 1: Complete Prospecting, Discovery & Deal Qualification Engine [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 1: Complete Prospecting, Discovery & Deal Qualification Engine [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_SCRM_PROSPECTING_ICP_ACCOUNT_CADENCE",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_SCRM_PROSPECTING_ICP_ACCOUNT_CADENCE",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 1: Complete Prospecting, Discovery & Deal Qualification Engine [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 6,
    "title": "Sales Pitching & Solution Demonstrations: FAB & Mutual Action Plans (MAPs)",
    "overviewMetaphor": "A Mutual Action Plan (MAP) is a Shared GPS Navigation Itinerary for the Buying Committee: Without a MAP, buyers wander aimlessly and deals stall in legal limbo; co-authoring a 5-milestone Mutual Action Plan with target dates (Security Review $\\to$ Finance Approval $\\to$ Contract Sign-Off) keeps the deal on a strict schedule; completing 4 of 5 milestones ($4/5 = 80.0\\%$) ensures the closing timeline remains locked on schedule.",
    "blocks": [
      {
        "id": "scrm-d6-b1-mutual-action-plan-progress-audit",
        "day": 6,
        "blockNumber": 1,
        "title": "Mutual Action Plan (MAP) Progress: $\\text{Progress}\\% = \\frac{\\text{Completed Milestones}}{\\text{Total Required Milestones}} \\times 100\\% \\ge 80.0\\%$",
        "conceptBudget": {
          "primaryConcept": "MAP Progress Formula",
          "supportingTerms": [
            "Completed Milestones ($4$)",
            "Total Required Milestones ($5$)",
            "Progress = $\\frac{4}{5} \\times 100\\% = 80.0\\%$",
            "On-Track Benchmark: $\\ge 80.0\\% \\implies$ On Schedule; $< 60.0\\% \\implies$ Closing Slippage"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d1-b1-dmu-stakeholders-alignment",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Mutual Action Plan (MAP) Milestone Ledger (4 of 5 Completed)",
              "boxes": [
                {
                  "label": "Discovery & Solution Demo",
                  "value": "Completed on Schedule (Milestones 1 & 2)",
                  "varType": "Completed",
                  "isUpdated": false
                },
                {
                  "label": "Security & Legal Clearance",
                  "value": "Completed on Schedule (Milestones 3 & 4)",
                  "varType": "Completed",
                  "isUpdated": false
                },
                {
                  "label": "Closing Schedule Status",
                  "value": "4 / 5 = 80.0% -> MUTUAL ACTION PLAN ON SCHEDULE!",
                  "varType": "MAP Status",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "map_audit_calc_demo.js",
            "initialCode": "function auditMap(completed, total) {\n  const pct = (completed / total) * 100;\n  const onTrack = pct >= 80.0;\n  return {\n    completed,\n    total,\n    progressPct: Number(pct.toFixed(2)),\n    onTrack,\n    status: onTrack ? 'MUTUAL_ACTION_PLAN_ON_SCHEDULE' : 'SLIPPAGE'\n  };\n}\n\nconsole.log(JSON.stringify(auditMap(4, 5)));",
            "expectedOutput": "{\"completed\":4,\"total\":5,\"progressPct\":80,\"onTrack\":true,\"status\":\"MUTUAL_ACTION_PLAN_ON_SCHEDULE\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Mutual Action Plan progress percentage when 4 out of 5 agreed buying milestones are completed ($ (4 / 5) \\times 100 $)?",
          "expectedStringOutput": "80",
          "acceptableAnswers": [
            "80",
            "80%",
            "80.0",
            "progressPct\":80"
          ],
          "primaryMisconceptionId": "MC_SCRM_PITCHING_FAB_MUTUAL_ACTION_PLANS",
          "diagnosisMap": {
            "40": {
              "misconceptionId": "MC_SCRM_PITCHING_FAB_MUTUAL_ACTION_PLANS",
              "errorExplanation": "4 out of 5 is 80.0%.",
              "recoveryPath": {
                "simplerExplanation": "4 / 5 * 100 = 80%.",
                "guidedFixPrompt": "Type 80"
              }
            }
          }
        }
      },
      {
        "id": "scrm-d6-b2-fab-framework-benefit-translation",
        "day": 6,
        "blockNumber": 2,
        "title": "The FAB Framework: Translating Features into Business Benefits",
        "conceptBudget": {
          "primaryConcept": "Feature to Benefit Translation",
          "supportingTerms": [
            "Feature (What it is: 'AES-256 automated database encryption')",
            "Advantage (What it does: 'Encrypts credit card records in 1 millisecond')",
            "Benefit (What it means in executive profit/risk: 'Passes SOC 2 audit with $0 in compliance fines!')"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d6-b1-mutual-action-plan-progress-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "FAB Articulation Syntax",
            "codeSnippet": "// 1. FEATURE:   'Our platform has automated real-time Stripe webhooks'\n// 2. ADVANTAGE: 'Which eliminates manual CSV export/import between systems'\n// 3. BENEFIT:   'So your finance team saves 20 hours/month and eliminates billing reconciliation errors!'",
            "lineNotes": {
              "1": "Technical capability.",
              "2": "Operational advantage.",
              "3": "Executive business benefit."
            }
          },
          {
            "type": "runnable_code",
            "filename": "fab_demo.js",
            "initialCode": "function getFabPrimarySellingComponent() {\n  return 'EXECUTIVE_BUSINESS_BENEFIT_DOLLARS_AND_TIME_SAVED';\n}\n\nconsole.log(getFabPrimarySellingComponent());",
            "expectedOutput": "EXECUTIVE_BUSINESS_BENEFIT_DOLLARS_AND_TIME_SAVED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which component of the FAB framework directly influences executive budget approval by highlighting financial and operational ROI?",
          "expectedStringOutput": "EXECUTIVE_BUSINESS_BENEFIT_DOLLARS_AND_TIME_SAVED",
          "acceptableAnswers": [
            "EXECUTIVE_BUSINESS_BENEFIT_DOLLARS_AND_TIME_SAVED",
            "Benefit",
            "Business Benefit"
          ],
          "primaryMisconceptionId": "MC_SCRM_PITCHING_FAB_MUTUAL_ACTION_PLANS",
          "diagnosisMap": {
            "FEATURE": {
              "misconceptionId": "MC_SCRM_PITCHING_FAB_MUTUAL_ACTION_PLANS",
              "errorExplanation": "Features describe mechanics. Executive budget approval is driven by the Benefit.",
              "recoveryPath": {
                "simplerExplanation": "Matches EXECUTIVE_BUSINESS_BENEFIT_DOLLARS_AND_TIME_SAVED.",
                "guidedFixPrompt": "Type EXECUTIVE_BUSINESS_BENEFIT_DOLLARS_AND_TIME_SAVED"
              }
            }
          }
        }
      },
      {
        "id": "scrm-d6-b3-poc-pass-fail-success-criteria",
        "day": 6,
        "blockNumber": 3,
        "title": "Proof of Concept (PoC) Governance: Binary Pass/Fail Success Criteria",
        "conceptBudget": {
          "primaryConcept": "PoC Binary Criteria Invariant",
          "supportingTerms": [
            "Never start a trial or PoC without pre-agreed binary success metrics signed by the Economic Buyer ('If we prove 99.9% ingestion speed by Day 14, client executes production contract')"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d6-b2-fab-framework-benefit-translation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "poc_criteria_demo.js",
            "initialCode": "function evaluatePocGovernance(hasSignedExitCriteria) {\n  return hasSignedExitCriteria\n    ? 'CONTRACTUAL_POC_BOUND_TO_COMMERCIAL_PURCHASE'\n    : 'FREE_TRIAL_TRAP_NO_COMMITMENT_TO_BUY';\n}\n\nconsole.log(evaluatePocGovernance(true));",
            "expectedOutput": "CONTRACTUAL_POC_BOUND_TO_COMMERCIAL_PURCHASE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What governance status protects a sales team when a Proof of Concept is legally tied to pre-agreed binary purchase criteria?",
          "expectedStringOutput": "CONTRACTUAL_POC_BOUND_TO_COMMERCIAL_PURCHASE",
          "acceptableAnswers": [
            "CONTRACTUAL_POC_BOUND_TO_COMMERCIAL_PURCHASE",
            "Contractual PoC",
            "Commercial purchase"
          ],
          "primaryMisconceptionId": "MC_SCRM_PITCHING_FAB_MUTUAL_ACTION_PLANS",
          "diagnosisMap": {
            "FREE_TRIAL": {
              "misconceptionId": "MC_SCRM_PITCHING_FAB_MUTUAL_ACTION_PLANS",
              "errorExplanation": "Unbound trials lead nowhere. Pre-agreed criteria create CONTRACTUAL_POC_BOUND_TO_COMMERCIAL_PURCHASE.",
              "recoveryPath": {
                "simplerExplanation": "Matches CONTRACTUAL_POC_BOUND_TO_COMMERCIAL_PURCHASE.",
                "guidedFixPrompt": "Type CONTRACTUAL_POC_BOUND_TO_COMMERCIAL_PURCHASE"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 7,
    "title": "Objection Handling Frameworks: The LAER Framework & Defusing Price Pushback",
    "overviewMetaphor": "The LAER Framework is an Aikido Master Deflecting Aggression into Partnership: When a customer says 'Your software is too expensive ($25k)', an amateur rep gets defensive; using LAER (Listen $\\to$ Acknowledge $\\to$ Explore $\\to$ Respond), you explore their underlying numbers and demonstrate that your $25,000 product eliminates $100,000 in proven labor waste ($100k / 25k = 4.0x$ ROI); the price objection evaporates into an irresistible investment.",
    "blocks": [
      {
        "id": "scrm-d7-b1-laer-price-objection-resolution",
        "day": 7,
        "blockNumber": 1,
        "title": "Defusing Price Objections via ROI Multipliers: $\\text{ROI Multiple} = \\frac{\\text{Customer Annual Savings}}{\\text{Product Annual Price}} \\ge 3.0x$",
        "conceptBudget": {
          "primaryConcept": "Price Objection Neutralization Formula",
          "supportingTerms": [
            "Product Annual Price ($25,000.00$)",
            "Customer Annual Savings ($100,000.00$)",
            "Net Annual Benefit = $100,000 - 25,000 = \\$75,000.00$",
            "ROI Multiple = $\\frac{100,000}{25,000} = 4.0x$",
            "Objection Neutralized Threshold: $\\ge 3.0x$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d6-b1-mutual-action-plan-progress-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "LAER Price Defense Ledger ($100k Savings vs $25k Price)",
              "boxes": [
                {
                  "label": "Annual License Price",
                  "value": "$25,000.00 SaaS Subscription Investment",
                  "varType": "Price",
                  "isUpdated": false
                },
                {
                  "label": "Proven Customer Savings",
                  "value": "$100,000.00 Verified Labor Waste & Downtime Eliminated",
                  "varType": "Savings",
                  "isUpdated": false
                },
                {
                  "label": "Net ROI Multiple",
                  "value": "$100,000 / $25,000 = 4.00x ROI (PRICE OBJECTION DEFUSED VIA COMPELLING ROI!)",
                  "varType": "ROI",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "laer_calc_demo.js",
            "initialCode": "function resolvePrice(price, savings) {\n  const roi = savings / price;\n  const isDefused = roi >= 3.0;\n  return {\n    price,\n    savings,\n    roiMultiple: Number(roi.toFixed(2)),\n    isDefused,\n    status: isDefused ? 'PRICE_OBJECTION_DEFUSED_VIA_COMPELLING_ROI' : 'INSUFFICIENT_ROI'\n  };\n}\n\nconsole.log(JSON.stringify(resolvePrice(25000, 100000)));",
            "expectedOutput": "{\"price\":25000,\"savings\":100000,\"roiMultiple\":4,\"isDefused\":true,\"status\":\"PRICE_OBJECTION_DEFUSED_VIA_COMPELLING_ROI\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What ROI multiple is delivered to a customer when a $25,000 annual software subscription generates $100,000 in proven cost savings ($100,000 / 25,000$)?",
          "expectedStringOutput": "4",
          "acceptableAnswers": [
            "4",
            "4.0",
            "4x",
            "4.0x",
            "roiMultiple\":4"
          ],
          "primaryMisconceptionId": "MC_SCRM_OBJECTION_HANDLING_LAER_FRAMEWORK",
          "diagnosisMap": {
            "0.25": {
              "misconceptionId": "MC_SCRM_OBJECTION_HANDLING_LAER_FRAMEWORK",
              "errorExplanation": "0.25 divides price by savings (25k / 100k). ROI multiple divides savings by price = 4.0x.",
              "recoveryPath": {
                "simplerExplanation": "100,000 / 25,000 = 4.",
                "guidedFixPrompt": "Type 4"
              }
            }
          }
        }
      },
      {
        "id": "scrm-d7-b2-four-steps-of-laer-framework",
        "day": 7,
        "blockNumber": 2,
        "title": "The 4 Steps of the LAER Framework: Listen, Acknowledge, Explore, Respond",
        "conceptBudget": {
          "primaryConcept": "LAER Framework Roadmap",
          "supportingTerms": [
            "L (Listen: Let the prospect finish speaking completely without interrupting)",
            "A (Acknowledge: Validate their perspective: 'I completely understand why budget is tight')",
            "E (Explore: Ask clarifying questions to uncover root issue: 'What other priorities are competing for budget?')",
            "R (Respond: Provide tailored data, case study, or phased rollout)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d7-b1-laer-price-objection-resolution",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "LAER Conversation Flow",
            "codeSnippet": "// 1. LISTEN:      Pause 2 full seconds after prospect finishes\n// 2. ACKNOWLEDGE: 'I appreciate you sharing that. Implementing new software can feel daunting.'\n// 3. EXPLORE:     'When you evaluated previous tools, where did the team experience implementation friction?'\n// 4. RESPOND:     'That is why our onboarding team handles 100% of data migration within 7 days'",
            "lineNotes": {
              "1": "Active pause.",
              "2": "Empathy validation.",
              "3": "Root cause exploration.",
              "4": "Targeted solution response."
            }
          },
          {
            "type": "runnable_code",
            "filename": "laer_steps_demo.js",
            "initialCode": "function getLaerPillars() {\n  return ['LISTEN', 'ACKNOWLEDGE', 'EXPLORE', 'RESPOND'];\n}\n\nconsole.log(JSON.stringify(getLaerPillars()));",
            "expectedOutput": "[\"LISTEN\",\"ACKNOWLEDGE\",\"EXPLORE\",\"RESPOND\"]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What does the 'E' represent in the Carew International LAER objection handling methodology?",
          "expectedStringOutput": "EXPLORE",
          "acceptableAnswers": [
            "EXPLORE",
            "Explore",
            "Explore root hesitation"
          ],
          "primaryMisconceptionId": "MC_SCRM_OBJECTION_HANDLING_LAER_FRAMEWORK",
          "diagnosisMap": {
            "EXPLAIN": {
              "misconceptionId": "MC_SCRM_OBJECTION_HANDLING_LAER_FRAMEWORK",
              "errorExplanation": "Explaining too early is premature pitching. In LAER, 'E' stands for Explore root causes.",
              "recoveryPath": {
                "simplerExplanation": "Matches EXPLORE.",
                "guidedFixPrompt": "Type EXPLORE"
              }
            }
          }
        }
      },
      {
        "id": "scrm-d7-b3-feel-felt-found-methodology",
        "day": 7,
        "blockNumber": 3,
        "title": "The Feel-Felt-Found Empathy Architecture",
        "conceptBudget": {
          "primaryConcept": "Feel-Felt-Found Structure",
          "supportingTerms": [
            "Feel ('I understand how you feel about transition risk')",
            "Felt ('Other CIOs at Fortune 500 banks felt the exact same hesitation initially')",
            "Found ('What they found after 30 days was that our automated migration cut downtime to zero')"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d7-b2-four-steps-of-laer-framework",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "feel_felt_found_demo.js",
            "initialCode": "function formatFeelFeltFound(peerRole, outcome) {\n  return `Other ${peerRole} felt the exact same way initially, but what they found was ${outcome}`;\n}\n\nconsole.log(formatFeelFeltFound('VPs of Engineering', 'migration downtime was reduced to zero'));",
            "expectedOutput": "Other VPs of Engineering felt the exact same way initially, but what they found was migration downtime was reduced to zero",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What structured empathy sentence is generated when addressing a peer VP of Engineering regarding migration downtime?",
          "expectedStringOutput": "Other VPs of Engineering felt the exact same way initially, but what they found was migration downtime was reduced to zero",
          "acceptableAnswers": [
            "Other VPs of Engineering felt the exact same way initially, but what they found was migration downtime was reduced to zero"
          ],
          "primaryMisconceptionId": "MC_SCRM_OBJECTION_HANDLING_LAER_FRAMEWORK",
          "diagnosisMap": {
            "WRONG": {
              "misconceptionId": "MC_SCRM_OBJECTION_HANDLING_LAER_FRAMEWORK",
              "errorExplanation": "Matches full formatted string.",
              "recoveryPath": {
                "simplerExplanation": "Follows Feel-Felt-Found syntax.",
                "guidedFixPrompt": "Type Other VPs of Engineering felt the exact same way initially, but what they found was migration downtime was reduced to zero"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 8,
    "title": "Negotiation & Deal Closing: Harvard BATNA, ZOPA & Value Trades",
    "overviewMetaphor": "Negotiation is a Bridge Built Across the River of Surplus: If the Seller's absolute minimum reservation price is $40,000 and the Buyer's maximum budget ceiling is $55,000, the Zone of Possible Agreement (ZOPA) has a positive $15,000 deal spread ($55,000 - 40,000 = \\$15,000$); instead of giving away price discounts for free, an elite negotiator executes a Value Trade: offering a $5,000 concession only in exchange for a 2-year contract commitment and upfront annual cash payment.",
    "blocks": [
      {
        "id": "scrm-d8-b1-zopa-spread-calculation",
        "day": 8,
        "blockNumber": 1,
        "title": "Zone of Possible Agreement (ZOPA) Formula: $\\text{ZOPA Spread} = \\text{Buyer Ceiling} - \\text{Seller Reservation Floor} \\ge 0$",
        "conceptBudget": {
          "primaryConcept": "ZOPA Spread Formula",
          "supportingTerms": [
            "Seller Reservation Floor ($40,000.00$)",
            "Buyer Budget Ceiling ($55,000.00$)",
            "ZOPA Spread = $55,000 - 40,000 = \\$15,000.00$",
            "Feasibility: $\\ge 0 \\implies$ Positive ZOPA Deal Feasible; $< 0 \\implies$ Negative ZOPA Walk Away to BATNA"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d7-b1-laer-price-objection-resolution",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Harvard Negotiation ZOPA Ledger ($40k Floor, $55k Ceiling)",
              "boxes": [
                {
                  "label": "Seller Walk-Away Floor",
                  "value": "$40,000.00 Minimum Acceptable Contract Value",
                  "varType": "Seller Floor",
                  "isUpdated": false
                },
                {
                  "label": "Buyer Budget Ceiling",
                  "value": "$55,000.00 Maximum Approved Budget Allocation",
                  "varType": "Buyer Ceiling",
                  "isUpdated": false
                },
                {
                  "label": "ZOPA Deal Spread",
                  "value": "$55,000 - $40,000 = +$15,000.00 SPREAD (POSITIVE ZOPA DEAL FEASIBLE!)",
                  "varType": "ZOPA Spread",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "zopa_calc_demo.js",
            "initialCode": "function calculateZopa(sellerFloor, buyerCeiling) {\n  const spread = buyerCeiling - sellerFloor;\n  const isFeasible = spread >= 0;\n  return {\n    sellerFloor,\n    buyerCeiling,\n    zopaSpread: spread,\n    isFeasible,\n    status: isFeasible ? 'POSITIVE_ZOPA_DEAL_FEASIBLE' : 'NEGATIVE_ZOPA'\n  };\n}\n\nconsole.log(JSON.stringify(calculateZopa(40000, 55000)));",
            "expectedOutput": "{\"sellerFloor\":40000,\"buyerCeiling\":55000,\"zopaSpread\":15000,\"isFeasible\":true,\"status\":\"POSITIVE_ZOPA_DEAL_FEASIBLE\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the dollar value of the ZOPA spread when the buyer's maximum budget ceiling is $55,000 and the seller's walk-away floor is $40,000 ($55,000 - 40,000$)?",
          "expectedStringOutput": "15000",
          "acceptableAnswers": [
            "15000",
            "$15,000",
            "15,000",
            "zopaSpread\":15000"
          ],
          "primaryMisconceptionId": "MC_SCRM_NEGOTIATION_BATNA_ZOPA_VALUE_TRADES",
          "diagnosisMap": {
            "95000": {
              "misconceptionId": "MC_SCRM_NEGOTIATION_BATNA_ZOPA_VALUE_TRADES",
              "errorExplanation": "95,000 adds floor and ceiling. ZOPA spread is the difference: 55,000 - 40,000 = $15,000.",
              "recoveryPath": {
                "simplerExplanation": "55,000 - 40,000 = 15,000.",
                "guidedFixPrompt": "Type 15000"
              }
            }
          }
        }
      },
      {
        "id": "scrm-d8-b2-value-trades-give-get-rule",
        "day": 8,
        "blockNumber": 2,
        "title": "The Golden Rule of Value Trades: Never Concede Price Without a 'Get'",
        "conceptBudget": {
          "primaryConcept": "Value Trades (Give-Get) Invariant",
          "supportingTerms": [
            "Unilateral Concessions (Amateur rep: Customer asks for 10% off -> Rep says ok -> Erodes margin & credibility)",
            "Value Trade (Professional rep: 'We can explore that 10% discount if you can commit to a 2-year contract and quarterly case study participation')"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d8-b1-zopa-spread-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Value Trade Negotiation Give-Get",
            "codeSnippet": "// ❌ UNILATERAL: Customer: 'Can you do $45k?' -> Rep: 'Sure!' (Trained customer to demand more)\n// ✅ VALUE TRADE: Customer: 'Can you do $45k?' -> Rep: 'If we do $45k, can we agree to Net 15 payment and 2-year term?'",
            "lineNotes": {
              "1": "Weak margin giveaway.",
              "2": "Professional value trade."
            }
          },
          {
            "type": "runnable_code",
            "filename": "value_trade_demo.js",
            "initialCode": "function evaluateNegotiationConcession(receivedContractualCommitment) {\n  return receivedContractualCommitment\n    ? 'VALID_PROFESSIONAL_VALUE_TRADE'\n    : 'WEAK_UNILATERAL_DISCOUNT_CONCESSION';\n}\n\nconsole.log(evaluateNegotiationConcession(true));\nconsole.log(evaluateNegotiationConcession(false));",
            "expectedOutput": "VALID_PROFESSIONAL_VALUE_TRADE\nWEAK_UNILATERAL_DISCOUNT_CONCESSION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What negotiation standard is achieved when a price concession is paired with an exchange for a multi-year term or upfront payment?",
          "expectedStringOutput": "VALID_PROFESSIONAL_VALUE_TRADE",
          "acceptableAnswers": [
            "VALID_PROFESSIONAL_VALUE_TRADE",
            "Value Trade",
            "Valid Value Trade"
          ],
          "primaryMisconceptionId": "MC_SCRM_NEGOTIATION_BATNA_ZOPA_VALUE_TRADES",
          "diagnosisMap": {
            "UNILATERAL": {
              "misconceptionId": "MC_SCRM_NEGOTIATION_BATNA_ZOPA_VALUE_TRADES",
              "errorExplanation": "Trading a concession for a commitment is a VALID_PROFESSIONAL_VALUE_TRADE.",
              "recoveryPath": {
                "simplerExplanation": "Matches VALID_PROFESSIONAL_VALUE_TRADE.",
                "guidedFixPrompt": "Type VALID_PROFESSIONAL_VALUE_TRADE"
              }
            }
          }
        }
      },
      {
        "id": "scrm-d8-b3-deal-closing-techniques",
        "day": 8,
        "blockNumber": 3,
        "title": "Closing Techniques: Summary Close, Assumptive Close & Urgency Close",
        "conceptBudget": {
          "primaryConcept": "Closing Techniques Mastery",
          "supportingTerms": [
            "Summary Close ('Summarizing agreed value, ROI, and timeline before asking for signature')",
            "Assumptive Close ('Assuming deal is done and moving to onboarding paperwork')",
            "Urgency Close (Tied to fiscal year end or upcoming price increases)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d8-b2-value-trades-give-get-rule",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "closing_demo.js",
            "initialCode": "function selectClosingTechnique(method) {\n  return method === 'SUMMARY'\n    ? 'SUMMARY_CLOSE_REITERATING_ALL_DISCOVERED_VALUE_AND_ROI'\n    : 'ASSUMPTIVE_CLOSE_TRANSITIONING_TO_ONBOARDING';\n}\n\nconsole.log(selectClosingTechnique('SUMMARY'));",
            "expectedOutput": "SUMMARY_CLOSE_REITERATING_ALL_DISCOVERED_VALUE_AND_ROI",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What closing technique recaps all quantified ROI metrics and agreed milestones before presenting the signature order form?",
          "expectedStringOutput": "SUMMARY_CLOSE_REITERATING_ALL_DISCOVERED_VALUE_AND_ROI",
          "acceptableAnswers": [
            "SUMMARY_CLOSE_REITERATING_ALL_DISCOVERED_VALUE_AND_ROI",
            "Summary Close",
            "Summary"
          ],
          "primaryMisconceptionId": "MC_SCRM_NEGOTIATION_BATNA_ZOPA_VALUE_TRADES",
          "diagnosisMap": {
            "HARD_CLOSE": {
              "misconceptionId": "MC_SCRM_NEGOTIATION_BATNA_ZOPA_VALUE_TRADES",
              "errorExplanation": "Recapping value is SUMMARY_CLOSE_REITERATING_ALL_DISCOVERED_VALUE_AND_ROI.",
              "recoveryPath": {
                "simplerExplanation": "Matches SUMMARY_CLOSE_REITERATING_ALL_DISCOVERED_VALUE_AND_ROI.",
                "guidedFixPrompt": "Type SUMMARY_CLOSE_REITERATING_ALL_DISCOVERED_VALUE_AND_ROI"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 9,
    "title": "Sales Pipeline Velocity & Funnel Analytics (V = (N x W x S) / L)",
    "overviewMetaphor": "Pipeline Velocity is the Horsepower of a Commercial Jet Engine: If your sales pipeline contains 40 qualified opportunities ($N = 40$), an average win rate of 25.0% ($W = 0.25$), an average deal size of $30,000 ($S = \\$30,000$), and an average sales cycle length of 60 days ($L = 60$), the daily pipeline velocity is $V = \\frac{40 \\times 0.25 \\times 30,000}{60} = \\frac{300,000}{60} = \\$5,000/\\text{day}$ ($150,000/month in predictable closed-won revenue).",
    "blocks": [
      {
        "id": "scrm-d9-b1-pipeline-velocity-calculation",
        "day": 9,
        "blockNumber": 1,
        "title": "Sales Pipeline Velocity Equation: $V = \\frac{\\text{Deals } N \\times \\text{Win Rate } W \\times \\text{Deal Size } S}{\\text{Cycle Length } L}$",
        "conceptBudget": {
          "primaryConcept": "Pipeline Velocity Formula",
          "supportingTerms": [
            "Number of Deals ($N = 40$)",
            "Win Rate ($W = 25.0\\% = 0.25$)",
            "Average Deal Size ($S = \\$30,000.00$)",
            "Cycle Length ($L = 60$ days)",
            "Expected Pipeline Revenue = $40 \\times 0.25 \\times 30,000 = \\$300,000.00$",
            "Daily Pipeline Velocity = $\\frac{300,000}{60} = \\$5,000.00/\\text{day}$",
            "Monthly Velocity = $\\$150,000.00/\\text{mo}$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d8-b1-zopa-spread-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Pipeline Velocity Engine Ledger (40 Deals, 25% Win, $30k Size, 60 Days)",
              "boxes": [
                {
                  "label": "Expected Pipeline Value",
                  "value": "40 Deals x 25.0% Win Rate x $30k Size = $300,000.00",
                  "varType": "Expected Value",
                  "isUpdated": false
                },
                {
                  "label": "Sales Cycle Duration",
                  "value": "60 Days Average Pipeline Lead Time to Close-Won",
                  "varType": "Cycle Time",
                  "isUpdated": false
                },
                {
                  "label": "Pipeline Velocity",
                  "value": "$300,000 / 60 Days = $5,000.00/DAY ($150,000.00/MONTH PREDICTABLE ENGINE!)",
                  "varType": "Velocity",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "velocity_calc_demo.js",
            "initialCode": "function calculateVelocity(deals, winPct, size, cycleDays) {\n  const expected = deals * (winPct / 100) * size;\n  const daily = expected / cycleDays;\n  return {\n    expected,\n    dailyVelocity: Math.round(daily),\n    monthlyVelocity: Math.round(daily * 30),\n    status: 'VELOCITY_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateVelocity(40, 25, 30000, 60)));",
            "expectedOutput": "{\"expected\":300000,\"dailyVelocity\":5000,\"monthlyVelocity\":150000,\"status\":\"VELOCITY_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the daily pipeline velocity in dollars when a team manages 40 deals with 25% win rate, $30,000 average deal size, across a 60-day sales cycle ($ (40 \\times 0.25 \\times 30,000) / 60 $)?",
          "expectedStringOutput": "5000",
          "acceptableAnswers": [
            "5000",
            "$5,000",
            "5,000",
            "dailyVelocity\":5000"
          ],
          "primaryMisconceptionId": "MC_SCRM_PIPELINE_MANAGEMENT_STAGE_VELOCITY",
          "diagnosisMap": {
            "300000": {
              "misconceptionId": "MC_SCRM_PIPELINE_MANAGEMENT_STAGE_VELOCITY",
              "errorExplanation": "300,000 is total expected revenue. Divided by 60 days gives $5,000 daily velocity.",
              "recoveryPath": {
                "simplerExplanation": "300,000 / 60 = 5,000.",
                "guidedFixPrompt": "Type 5000"
              }
            }
          }
        }
      },
      {
        "id": "scrm-d9-b2-deal-slippage-root-causes",
        "day": 9,
        "blockNumber": 2,
        "title": "Diagnosing Deal Slippage: Uncovering Phantom Close Dates in CRM",
        "conceptBudget": {
          "primaryConcept": "Deal Slippage Diagnosis",
          "supportingTerms": [
            "Deal Slippage (Deals pushed to the next quarter when reps guess close dates without an agreed Mutual Action Plan)",
            "Root cause #1: Lack of Economic Buyer engagement; Root cause #2: Unmapped Paper Process"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d9-b1-pipeline-velocity-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Slippage Prevention Checklist",
            "codeSnippet": "// 1. Has the Economic Buyer verbally confirmed the close date in writing?\n// 2. Has InfoSec security questionnaire been approved by Legal?\n// 3. Has Procurement assigned a purchase order (PO) tracking number?",
            "lineNotes": {
              "1": "Executive confirmation.",
              "2": "Security clearance.",
              "3": "PO generation."
            }
          },
          {
            "type": "runnable_code",
            "filename": "slippage_audit_demo.js",
            "initialCode": "function evaluateSlippageRisk(hasEconomicBuyerConfirm, hasMapTargetDate) {\n  return (hasEconomicBuyerConfirm && hasMapTargetDate)\n    ? 'LOW_SLIPPAGE_COMMITTED_CLOSE_DATE'\n    : 'HIGH_SLIPPAGE_RISK_PHANTOM_FORECAST';\n}\n\nconsole.log(evaluateSlippageRisk(true, true));\nconsole.log(evaluateSlippageRisk(false, true));",
            "expectedOutput": "LOW_SLIPPAGE_COMMITTED_CLOSE_DATE\nHIGH_SLIPPAGE_RISK_PHANTOM_FORECAST",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What forecast reliability status is assigned to a deal that lacks direct Economic Buyer confirmation on the closing date?",
          "expectedStringOutput": "HIGH_SLIPPAGE_RISK_PHANTOM_FORECAST",
          "acceptableAnswers": [
            "HIGH_SLIPPAGE_RISK_PHANTOM_FORECAST",
            "High slippage risk",
            "Phantom forecast"
          ],
          "primaryMisconceptionId": "MC_SCRM_PIPELINE_MANAGEMENT_STAGE_VELOCITY",
          "diagnosisMap": {
            "COMMITTED": {
              "misconceptionId": "MC_SCRM_PIPELINE_MANAGEMENT_STAGE_VELOCITY",
              "errorExplanation": "Without Economic Buyer confirmation, deals are at HIGH_SLIPPAGE_RISK_PHANTOM_FORECAST.",
              "recoveryPath": {
                "simplerExplanation": "Matches HIGH_SLIPPAGE_RISK_PHANTOM_FORECAST.",
                "guidedFixPrompt": "Type HIGH_SLIPPAGE_RISK_PHANTOM_FORECAST"
              }
            }
          }
        }
      },
      {
        "id": "scrm-d9-b3-weighted-probability-forecast-categories",
        "day": 9,
        "blockNumber": 3,
        "title": "Forecasting Categories: Commit vs Best Case vs Pipeline",
        "conceptBudget": {
          "primaryConcept": "Forecasting Categories",
          "supportingTerms": [
            "Commit (90%+ confidence: Signed contract pending invoice)",
            "Best Case (50-75% confidence: In final legal redlines)",
            "Pipeline (20-40% confidence: In discovery and proposal)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d9-b2-deal-slippage-root-causes",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "forecast_cat_demo.js",
            "initialCode": "function getForecastCategoryThreshold(category) {\n  return category === 'COMMIT' ? 90 : (category === 'BEST_CASE' ? 60 : 25);\n}\n\nconsole.log(getForecastCategoryThreshold('COMMIT'));\nconsole.log(getForecastCategoryThreshold('BEST_CASE'));",
            "expectedOutput": "90\n60",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What minimum historical close probability percentage is required to classify an opportunity under the 'Commit' forecast category?",
          "expectedStringOutput": "90",
          "acceptableAnswers": [
            "90",
            "90%",
            "90 percent"
          ],
          "primaryMisconceptionId": "MC_SCRM_PIPELINE_MANAGEMENT_STAGE_VELOCITY",
          "diagnosisMap": {
            "50": {
              "misconceptionId": "MC_SCRM_PIPELINE_MANAGEMENT_STAGE_VELOCITY",
              "errorExplanation": "50% is Best Case. Commit requires >= 90% confidence.",
              "recoveryPath": {
                "simplerExplanation": "Commit requires 90%.",
                "guidedFixPrompt": "Type 90"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 10,
    "title": "Customer Onboarding & Time-to-Value (TTV <= 14 Days)",
    "overviewMetaphor": "Time-to-Value is the First Warm Meal in a 5-Star Hotel: After signing a contract, buyers experience maximum anxiety and buyer remorse; delivering their First Value Milestone within 10 days ($TTV = 10 \\le 14$ days) instantly validates their purchasing decision, creating deep customer trust and setting the stage for 100% renewal retention.",
    "blocks": [
      {
        "id": "scrm-d10-b1-ttv-first-value-milestone-audit",
        "day": 10,
        "blockNumber": 1,
        "title": "Time-to-Value (TTV) Audit: First Value Milestone Delivery ($\\text{TTV} \\le 14$ Days)",
        "conceptBudget": {
          "primaryConcept": "Time-to-Value Benchmark",
          "supportingTerms": [
            "Days to First Value Milestone ($10$ days)",
            "TTV Threshold: $\\le 14$ days $\\implies$ Rapid TTV & High Retention; $> 30$ days $\\implies$ High Buyer Remorse Risk"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d9-b1-pipeline-velocity-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Customer Onboarding TTV Ledger (10 Days to First Value)",
              "boxes": [
                {
                  "label": "Contract Signed",
                  "value": "Day 0: Sales-to-CS Handoff Completed with Full Context",
                  "varType": "Day 0",
                  "isUpdated": false
                },
                {
                  "label": "Kickoff & Integration",
                  "value": "Days 1-7: Single Sign-On (SSO) & Data Ingestion Live",
                  "varType": "Integration",
                  "isUpdated": false
                },
                {
                  "label": "First Value Realized",
                  "value": "Day 10 <= 14 Days Benchmark -> RAPID TIME TO VALUE ACHIEVED!",
                  "varType": "TTV",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "ttv_calc_demo.js",
            "initialCode": "function auditTtv(days) {\n  const isRapid = days <= 14;\n  return {\n    daysToFirstValue: days,\n    isRapid,\n    rating: isRapid ? 'RAPID_TIME_TO_VALUE_EXCELLENT_RETENTION' : 'SLOW_TTV',\n    status: 'TTV_EVALUATED'\n  };\n}\n\nconsole.log(JSON.stringify(auditTtv(10)));\nconsole.log(JSON.stringify(auditTtv(35)));",
            "expectedOutput": "{\"daysToFirstValue\":10,\"isRapid\":true,\"rating\":\"RAPID_TIME_TO_VALUE_EXCELLENT_RETENTION\",\"status\":\"TTV_EVALUATED\"}\n{\"daysToFirstValue\":35,\"isRapid\":false,\"rating\":\"SLOW_TTV\",\"status\":\"TTV_EVALUATED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What onboarding rating is awarded when a customer achieves their first measurable value milestone within 10 days of contract signature ($10 \\le 14$ days)?",
          "expectedStringOutput": "RAPID_TIME_TO_VALUE_EXCELLENT_RETENTION",
          "acceptableAnswers": [
            "RAPID_TIME_TO_VALUE_EXCELLENT_RETENTION",
            "Rapid TTV",
            "Rapid time to value"
          ],
          "primaryMisconceptionId": "MC_SCRM_CUSTOMER_ONBOARDING_TIME_TO_VALUE",
          "diagnosisMap": {
            "SLOW_TTV": {
              "misconceptionId": "MC_SCRM_CUSTOMER_ONBOARDING_TIME_TO_VALUE",
              "errorExplanation": "10 days satisfies the <= 14 day target, awarding RAPID_TIME_TO_VALUE_EXCELLENT_RETENTION.",
              "recoveryPath": {
                "simplerExplanation": "Matches RAPID_TIME_TO_VALUE_EXCELLENT_RETENTION.",
                "guidedFixPrompt": "Type RAPID_TIME_TO_VALUE_EXCELLENT_RETENTION"
              }
            }
          }
        }
      },
      {
        "id": "scrm-d10-b2-high-touch-vs-tech-touch-onboarding",
        "day": 10,
        "blockNumber": 2,
        "title": "High-Touch vs Low-Touch Tech-Touch Onboarding Models",
        "conceptBudget": {
          "primaryConcept": "Onboarding Delivery Models",
          "supportingTerms": [
            "High-Touch Onboarding (Dedicated CSM, custom integrations for ACV $> \\$50k$ enterprise accounts)",
            "Tech-Touch Onboarding (In-app product walkthroughs, video tutorials, and automated email nudges for SMB self-serve users)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d10-b1-ttv-first-value-milestone-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Onboarding Model Selection",
            "codeSnippet": "// ENTERPRISE ($100k ACV): 1:1 Implementation Manager + Weekly Standup + Dedicated Slack Channel\n// MID-MARKET ($20k ACV):  Group onboarding webinars + Tailored CSP success plan\n// SMB / PRODUCT-LED ($1k): Automated in-app checklist + Interactive product tours",
            "lineNotes": {
              "1": "High-touch white glove.",
              "2": "Hybrid touch.",
              "3": "Scalable tech-touch."
            }
          },
          {
            "type": "runnable_code",
            "filename": "onboarding_model_demo.js",
            "initialCode": "function selectOnboardingModel(acvUsd) {\n  return acvUsd >= 50000\n    ? 'HIGH_TOUCH_DEDICATED_CSM_IMPLEMENTATION'\n    : 'TECH_TOUCH_AUTOMATED_IN_APP_WALKTHROUGHS';\n}\n\nconsole.log(selectOnboardingModel(100000));\nconsole.log(selectOnboardingModel(5000));",
            "expectedOutput": "HIGH_TOUCH_DEDICATED_CSM_IMPLEMENTATION\nTECH_TOUCH_AUTOMATED_IN_APP_WALKTHROUGHS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which customer onboarding model is deployed for enterprise accounts with an Annual Contract Value (ACV) exceeding $50,000?",
          "expectedStringOutput": "HIGH_TOUCH_DEDICATED_CSM_IMPLEMENTATION",
          "acceptableAnswers": [
            "HIGH_TOUCH_DEDICATED_CSM_IMPLEMENTATION",
            "High Touch",
            "High-Touch Dedicated CSM"
          ],
          "primaryMisconceptionId": "MC_SCRM_CUSTOMER_ONBOARDING_TIME_TO_VALUE",
          "diagnosisMap": {
            "TECH_TOUCH": {
              "misconceptionId": "MC_SCRM_CUSTOMER_ONBOARDING_TIME_TO_VALUE",
              "errorExplanation": "Tech-touch is for low ACV. Accounts >$50k receive HIGH_TOUCH_DEDICATED_CSM_IMPLEMENTATION.",
              "recoveryPath": {
                "simplerExplanation": "Matches HIGH_TOUCH_DEDICATED_CSM_IMPLEMENTATION.",
                "guidedFixPrompt": "Type HIGH_TOUCH_DEDICATED_CSM_IMPLEMENTATION"
              }
            }
          }
        }
      },
      {
        "id": "scrm-d10-b3-customer-success-plan-csp",
        "day": 10,
        "blockNumber": 3,
        "title": "The Joint Customer Success Plan (CSP): Aligning Strategic Milestones",
        "conceptBudget": {
          "primaryConcept": "Customer Success Plan Invariant",
          "supportingTerms": [
            "Customer Success Plan (CSP: Document co-created during kickoff defining customer business objectives, target ROI metrics, key milestones, and renewal timelines)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d10-b2-high-touch-vs-tech-touch-onboarding",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "csp_demo.js",
            "initialCode": "function getCspPrimaryObjective() {\n  return 'DOCUMENT_CUSTOMER_BUSINESS_GOALS_AND_MEASURE_ROI_REALIZATION';\n}\n\nconsole.log(getCspPrimaryObjective());",
            "expectedOutput": "DOCUMENT_CUSTOMER_BUSINESS_GOALS_AND_MEASURE_ROI_REALIZATION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the primary operational purpose of a Joint Customer Success Plan (CSP)?",
          "expectedStringOutput": "DOCUMENT_CUSTOMER_BUSINESS_GOALS_AND_MEASURE_ROI_REALIZATION",
          "acceptableAnswers": [
            "DOCUMENT_CUSTOMER_BUSINESS_GOALS_AND_MEASURE_ROI_REALIZATION",
            "Document goals and measure ROI",
            "Measure ROI"
          ],
          "primaryMisconceptionId": "MC_SCRM_CUSTOMER_ONBOARDING_TIME_TO_VALUE",
          "diagnosisMap": {
            "SALES_PITCH": {
              "misconceptionId": "MC_SCRM_CUSTOMER_ONBOARDING_TIME_TO_VALUE",
              "errorExplanation": "A CSP is an alignment document to DOCUMENT_CUSTOMER_BUSINESS_GOALS_AND_MEASURE_ROI_REALIZATION.",
              "recoveryPath": {
                "simplerExplanation": "Matches DOCUMENT_CUSTOMER_BUSINESS_GOALS_AND_MEASURE_ROI_REALIZATION.",
                "guidedFixPrompt": "Type DOCUMENT_CUSTOMER_BUSINESS_GOALS_AND_MEASURE_ROI_REALIZATION"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 11,
    "title": "Customer Health Scoring & Proactive Churn Prediction (CHS)",
    "overviewMetaphor": "Customer Health Scoring is a Medical Vital Signs Monitor in an ICU: An account with 90 Product Usage points ($90 \\times 0.35 = 31.5$), 80 Support Satisfaction points ($80 \\times 0.25 = 20.0$), 90 NPS points ($90 \\times 0.20 = 18.0$), and 85 Executive Engagement points ($85 \\times 0.20 = 17.0$) produces a vibrant Green Composite Health Score of 86.5 ($31.5 + 20.0 + 18.0 + 17.0 = 86.5$); catching a drop below 50.0 immediately alerts the CSM to deploy a Churn Rescue Playbook months before renewal.",
    "blocks": [
      {
        "id": "scrm-d11-b1-composite-chs-calculation",
        "day": 11,
        "blockNumber": 1,
        "title": "Composite Customer Health Score (CHS): $\\text{CHS} = (U \\times 0.35) + (S \\times 0.25) + (N \\times 0.20) + (E \\times 0.20)$",
        "conceptBudget": {
          "primaryConcept": "Composite Health Score Formula",
          "supportingTerms": [
            "Product Usage Score ($U = 90 \\implies 31.5$ pts)",
            "Support Ticket Health ($S = 80 \\implies 20.0$ pts)",
            "NPS Sentiment ($N = 90 \\implies 18.0$ pts)",
            "Executive Engagement ($E = 85 \\implies 17.0$ pts)",
            "Composite CHS = $31.5 + 20.0 + 18.0 + 17.0 = 86.5$",
            "Tiers: $\\ge 75 \\implies$ Green (Expansion Ready); $50-74 \\implies$ Yellow; $< 50 \\implies$ Red (Churn Risk)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d10-b1-ttv-first-value-milestone-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Customer Health Score Ledger (Composite = 86.5 Green)",
              "boxes": [
                {
                  "label": "Usage & Support Health",
                  "value": "Usage (31.5 pts) + Support Health (20.0 pts) = 51.5 Points",
                  "varType": "Core Signals",
                  "isUpdated": false
                },
                {
                  "label": "Sentiment & Engagement",
                  "value": "NPS (18.0 pts) + Exec Sponsor (17.0 pts) = 35.0 Points",
                  "varType": "Relationship",
                  "isUpdated": false
                },
                {
                  "label": "Composite Health Rating",
                  "value": "86.5 Points (GREEN HEALTHY EXPANSION READY >= 75.0!)",
                  "varType": "Health Tier",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "chs_calc_demo.js",
            "initialCode": "function calculateChs(usage, support, nps, engagement) {\n  const chs = (usage * 0.35) + (support * 0.25) + (nps * 0.20) + (engagement * 0.20);\n  let tier = '';\n  if (chs >= 75) tier = 'GREEN_HEALTHY_EXPANSION_READY';\n  else if (chs >= 50) tier = 'YELLOW_NEUTRAL';\n  else tier = 'RED_CHURN_RISK';\n  return {\n    chsScore: Number(chs.toFixed(1)),\n    tier,\n    status: 'CHS_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateChs(90, 80, 90, 85)));",
            "expectedOutput": "{\"chsScore\":86.5,\"tier\":\"GREEN_HEALTHY_EXPANSION_READY\",\"status\":\"CHS_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Composite Customer Health Score (CHS) when usage is 90, support is 80, NPS is 90, and engagement is 85 ($ (90 \\times 0.35) + (80 \\times 0.25) + (90 \\times 0.20) + (85 \\times 0.20) $)?",
          "expectedStringOutput": "86.5",
          "acceptableAnswers": [
            "86.5",
            "86.5 points",
            "chsScore\":86.5"
          ],
          "primaryMisconceptionId": "MC_SCRM_HEALTH_SCORING_CHURN_PREVENTION",
          "diagnosisMap": {
            "86.25": {
              "misconceptionId": "MC_SCRM_HEALTH_SCORING_CHURN_PREVENTION",
              "errorExplanation": "Arithmetic gives 31.5 + 20.0 + 18.0 + 17.0 = 86.5.",
              "recoveryPath": {
                "simplerExplanation": "31.5 + 20.0 + 18.0 + 17.0 = 86.5.",
                "guidedFixPrompt": "Type 86.5"
              }
            }
          }
        }
      },
      {
        "id": "scrm-d11-b2-early-warning-red-flag-triggers",
        "day": 11,
        "blockNumber": 2,
        "title": "Early Warning Red Flag Triggers: Executive Sponsor Departure & License Drop",
        "conceptBudget": {
          "primaryConcept": "Churn Red Flag Triggers",
          "supportingTerms": [
            "Red Flag #1: Key Executive Sponsor leaves company (50% churn risk if not re-threaded in 30 days)",
            "Red Flag #2: Active weekly user logins decline by $> 40\\%$",
            "Red Flag #3: Unresolved severity-1 support ticket open $> 72$ hours"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d11-b1-composite-chs-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Automated Churn Trigger Workflow",
            "codeSnippet": "// TRIGGER: Executive Champion marks 'Left Company' on LinkedIn\n// ACTION:  1. Auto-create high-priority CS Task: 'Schedule new stakeholder discovery call'\n//          2. Alert VP of Customer Success & Account Executive on Slack",
            "lineNotes": {
              "1": "Signal detection.",
              "2": "Automated rescue workflow."
            }
          },
          {
            "type": "runnable_code",
            "filename": "churn_trigger_demo.js",
            "initialCode": "function evaluateAccountRisk(sponsorLeft, usageDroppedPct) {\n  return (sponsorLeft || usageDroppedPct >= 40)\n    ? 'CRITICAL_RISK_TRIGGER_EXECUTIVE_INTERVENTION'\n    : 'STABLE_ACCOUNT';\n}\n\nconsole.log(evaluateAccountRisk(true, 10));\nconsole.log(evaluateAccountRisk(false, 15));",
            "expectedOutput": "CRITICAL_RISK_TRIGGER_EXECUTIVE_INTERVENTION\nSTABLE_ACCOUNT",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What intervention action is triggered when an enterprise account's key executive sponsor departs the organization?",
          "expectedStringOutput": "CRITICAL_RISK_TRIGGER_EXECUTIVE_INTERVENTION",
          "acceptableAnswers": [
            "CRITICAL_RISK_TRIGGER_EXECUTIVE_INTERVENTION",
            "Executive intervention",
            "Critical risk intervention"
          ],
          "primaryMisconceptionId": "MC_SCRM_HEALTH_SCORING_CHURN_PREVENTION",
          "diagnosisMap": {
            "WAIT_FOR_RENEWAL": {
              "misconceptionId": "MC_SCRM_HEALTH_SCORING_CHURN_PREVENTION",
              "errorExplanation": "Waiting until renewal guarantees churn. Sponsor departure triggers CRITICAL_RISK_TRIGGER_EXECUTIVE_INTERVENTION.",
              "recoveryPath": {
                "simplerExplanation": "Matches CRITICAL_RISK_TRIGGER_EXECUTIVE_INTERVENTION.",
                "guidedFixPrompt": "Type CRITICAL_RISK_TRIGGER_EXECUTIVE_INTERVENTION"
              }
            }
          }
        }
      },
      {
        "id": "scrm-d11-b3-churn-rescue-playbook",
        "day": 11,
        "blockNumber": 3,
        "title": "The 30-Day Churn Rescue Playbook Execution",
        "conceptBudget": {
          "primaryConcept": "Churn Rescue Playbook",
          "supportingTerms": [
            "Step 1: Executive Sponsor outreach by VP/CEO",
            "Step 2: Technical health audit and bug resolution",
            "Step 3: Re-training sessions for end users",
            "Step 4: Revised ROI verification report"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d11-b2-early-warning-red-flag-triggers",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "rescue_playbook_demo.js",
            "initialCode": "function getRescuePlaybookInitialStep() {\n  return 'EXECUTIVE_SPONSOR_ALIGNMENT_CALL_BY_VP_OR_CEO';\n}\n\nconsole.log(getRescuePlaybookInitialStep());",
            "expectedOutput": "EXECUTIVE_SPONSOR_ALIGNMENT_CALL_BY_VP_OR_CEO",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the mandatory first executive step executed in a 30-Day Churn Rescue Playbook?",
          "expectedStringOutput": "EXECUTIVE_SPONSOR_ALIGNMENT_CALL_BY_VP_OR_CEO",
          "acceptableAnswers": [
            "EXECUTIVE_SPONSOR_ALIGNMENT_CALL_BY_VP_OR_CEO",
            "Executive call",
            "CEO sponsor call"
          ],
          "primaryMisconceptionId": "MC_SCRM_HEALTH_SCORING_CHURN_PREVENTION",
          "diagnosisMap": {
            "SEND_DISCOUNT": {
              "misconceptionId": "MC_SCRM_HEALTH_SCORING_CHURN_PREVENTION",
              "errorExplanation": "Discounts do not fix lost value. The first step is EXECUTIVE_SPONSOR_ALIGNMENT_CALL_BY_VP_OR_CEO.",
              "recoveryPath": {
                "simplerExplanation": "Matches EXECUTIVE_SPONSOR_ALIGNMENT_CALL_BY_VP_OR_CEO.",
                "guidedFixPrompt": "Type EXECUTIVE_SPONSOR_ALIGNMENT_CALL_BY_VP_OR_CEO"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 12,
    "title": "Customer Retention & Net Revenue Retention (NRR >= 120%)",
    "overviewMetaphor": "Net Revenue Retention (NRR) is a Leaky Bucket Filled by a High-Pressure Expansion Firehose: If you start the year with $1,000,000 in ARR, lose $50,000 to churn and $50,000 to contraction, but expand existing accounts by $300,000 through seat expansion and AI add-ons, your ending retained ARR is $1,200,000; your Net Revenue Retention is 120.0% ($NRR = \\frac{1.2M}{1.0M} \\times 100\\% = 120.0\\%$), meaning your company grows by 20% annually with zero new customer acquisition.",
    "blocks": [
      {
        "id": "scrm-d12-b1-nrr-and-grr-calculation",
        "day": 12,
        "blockNumber": 1,
        "title": "Net Revenue Retention (NRR) vs Gross Revenue Retention (GRR) Formulas",
        "conceptBudget": {
          "primaryConcept": "NRR and GRR Retention Formulas",
          "supportingTerms": [
            "Starting ARR ($1,000,000.00$)",
            "Expansion ARR ($300,000.00$)",
            "Contraction ARR ($50,000.00$)",
            "Churn ARR ($50,000.00$)",
            "Ending ARR = $1,000,000 + 300,000 - 50,000 - 50,000 = \\$1,200,000.00$",
            "$NRR = \\frac{1,200,000}{1,000,000} \\times 100\\% = 120.0\\%$",
            "$GRR = \\frac{1,000,000 - 50,000 - 50,000}{1,000,000} \\times 100\\% = 90.0\\%$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d11-b1-composite-chs-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "SaaS Revenue Retention Waterfall ($1M Base, $300k Expansion)",
              "boxes": [
                {
                  "label": "Starting ARR Base",
                  "value": "$1,000,000.00 Annual Recurring Revenue Base",
                  "varType": "Starting ARR",
                  "isUpdated": false
                },
                {
                  "label": "Expansion ARR",
                  "value": "+$300,000.00 Seat Expansion & Module Cross-Sell (+30%)",
                  "varType": "Expansion",
                  "isUpdated": false
                },
                {
                  "label": "Net Retention (NRR)",
                  "value": "Ending $1.2M / $1.0M = 120.00% NRR (ELITE VENTURE SCALE REVENUE COMPOUNDER!)",
                  "varType": "NRR",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "nrr_calc_demo.js",
            "initialCode": "function calculateNrrGrr(starting, expansion, contraction, churn) {\n  const ending = starting + expansion - contraction - churn;\n  const nrr = (ending / starting) * 100;\n  const grr = ((starting - contraction - churn) / starting) * 100;\n  return {\n    ending,\n    nrrPercent: Number(nrr.toFixed(2)),\n    grrPercent: Number(grr.toFixed(2)),\n    isElite: nrr >= 120.0,\n    status: 'RETENTION_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateNrrGrr(1000000, 300000, 50000, 50000)));",
            "expectedOutput": "{\"ending\":1200000,\"nrrPercent\":120,\"grrPercent\":90,\"isElite\":true,\"status\":\"RETENTION_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Net Revenue Retention percentage when a $1,000,000 starting ARR base generates $300,000 in expansion while losing $50,000 to contraction and $50,000 to churn ($ (1,200,000 / 1,000,000) \\times 100 $)?",
          "expectedStringOutput": "120",
          "acceptableAnswers": [
            "120",
            "120%",
            "120.0",
            "nrrPercent\":120"
          ],
          "primaryMisconceptionId": "MC_SCRM_RETENTION_EXPANSION_NRR_GRR",
          "diagnosisMap": {
            "90": {
              "misconceptionId": "MC_SCRM_RETENTION_EXPANSION_NRR_GRR",
              "errorExplanation": "90% is Gross Revenue Retention (GRR). Factoring in expansion yields 120.0% NRR.",
              "recoveryPath": {
                "simplerExplanation": "(1,000,000 + 300,000 - 50,000 - 50,000) / 1,000,000 * 100 = 120%.",
                "guidedFixPrompt": "Type 120"
              }
            }
          }
        }
      },
      {
        "id": "scrm-d12-b2-land-and-expand-playbook",
        "day": 12,
        "blockNumber": 2,
        "title": "The Land-and-Expand Playbook: Seat Expansion & Module Cross-Selling",
        "conceptBudget": {
          "primaryConcept": "Land and Expand Mechanics",
          "supportingTerms": [
            "Land (Initial $20k deployment with 1 department e.g. North America Sales)",
            "Expand (Scaling to 10 departments globally and adding analytics modules $\\implies \\$250k$ ARR)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d12-b1-nrr-and-grr-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Account Expansion Sequence",
            "codeSnippet": "// Year 1: Land 25 Sales Rep Seats ($25k ARR)\n// Year 2: Expand to 100 Customer Success Seats (+$75k ARR)\n// Year 3: Add Enterprise AI Intelligence Module (+$150k ARR -> Total $250k ARR!)",
            "lineNotes": {
              "1": "Initial beachhead.",
              "2": "Departmental seat expansion.",
              "3": "Module cross-sell."
            }
          },
          {
            "type": "runnable_code",
            "filename": "land_expand_demo.js",
            "initialCode": "function calculateExpansionMultiple(landArr, finalArr) {\n  return Number((finalArr / landArr).toFixed(1));\n}\n\nconsole.log(calculateExpansionMultiple(25000, 250000));",
            "expectedOutput": "10",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What account expansion revenue multiple is achieved when a $25,000 initial land deal grows into a $250,000 annual contract ($250,000 / 25,000$)?",
          "expectedStringOutput": "10",
          "acceptableAnswers": [
            "10",
            "10x",
            "10.0",
            "10.0x"
          ],
          "primaryMisconceptionId": "MC_SCRM_RETENTION_EXPANSION_NRR_GRR",
          "diagnosisMap": {
            "225000": {
              "misconceptionId": "MC_SCRM_RETENTION_EXPANSION_NRR_GRR",
              "errorExplanation": "225,000 is net dollar expansion. The expansion multiple is 250k / 25k = 10x.",
              "recoveryPath": {
                "simplerExplanation": "250,000 / 25,000 = 10.",
                "guidedFixPrompt": "Type 10"
              }
            }
          }
        }
      },
      {
        "id": "scrm-d12-b3-grr-floor-benchmark",
        "day": 12,
        "blockNumber": 3,
        "title": "Gross Revenue Retention (GRR): The 85-90% Enterprise Health Floor",
        "conceptBudget": {
          "primaryConcept": "GRR Floor Invariant",
          "supportingTerms": [
            "GRR cannot exceed 100%",
            "High NRR (130%) masking low GRR (70%) is dangerous because high expansion hides a churn crisis",
            "Enterprise GRR target $\\ge 90.0\\%$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d12-b2-land-and-expand-playbook",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "grr_floor_demo.js",
            "initialCode": "function evaluateGrrHealth(grrPct) {\n  return grrPct >= 90.0\n    ? 'HEALTHY_LOW_CHURN_FOUNDATION'\n    : 'LEAKY_BUCKET_ADDRESS_PRODUCT_DEFECTS';\n}\n\nconsole.log(evaluateGrrHealth(92.0));\nconsole.log(evaluateGrrHealth(75.0));",
            "expectedOutput": "HEALTHY_LOW_CHURN_FOUNDATION\nLEAKY_BUCKET_ADDRESS_PRODUCT_DEFECTS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What minimum Gross Revenue Retention (GRR) percentage benchmark represents a healthy enterprise SaaS foundation with minimal baseline customer churn?",
          "expectedStringOutput": "90",
          "acceptableAnswers": [
            "90",
            "90%",
            "90.0"
          ],
          "primaryMisconceptionId": "MC_SCRM_RETENTION_EXPANSION_NRR_GRR",
          "diagnosisMap": {
            "70": {
              "misconceptionId": "MC_SCRM_RETENTION_EXPANSION_NRR_GRR",
              "errorExplanation": "70% indicates heavy churn. The healthy enterprise benchmark is >= 90.0% GRR.",
              "recoveryPath": {
                "simplerExplanation": "Healthy GRR benchmark is 90%.",
                "guidedFixPrompt": "Type 90"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 13,
    "title": "Voice of Customer (VoC): Net Promoter Score (NPS = %Promoters - %Detractors)",
    "overviewMetaphor": "Net Promoter Score is a Thermometer of Customer Love vs Toxic Word-of-Mouth: Across 100 customer survey responses, if 70 users are Promoters rating 9-10 ($70\\%$), 20 users are Passives rating 7-8 ($20\\%$), and 10 users are Detractors rating 0-6 ($10\\%$), the Net Promoter Score is $+60$ ($NPS = 70\\% - 10\\% = +60$); scoring above $+50$ confirms World-Class customer loyalty where happy customers organically evangelize your brand.",
    "blocks": [
      {
        "id": "scrm-d13-b1-nps-calculation-and-benchmarks",
        "day": 13,
        "blockNumber": 1,
        "title": "Net Promoter Score (NPS) Formula: $\\text{NPS} = \\%\\text{Promoters (9-10)} - \\%\\text{Detractors (0-6)} \\ge +50$",
        "conceptBudget": {
          "primaryConcept": "Net Promoter Score Formula",
          "supportingTerms": [
            "Promoters Count ($70$ out of 100 $\\implies 70.0\\%$)",
            "Passives Count ($20$ out of 100 $\\implies 20.0\\%$)",
            "Detractors Count ($10$ out of 100 $\\implies 10.0\\%$)",
            "$NPS = 70 - 10 = +60$",
            "Scale: $-100 \\text{ to } +100$",
            "World-Class Benchmark: $\\ge +50 \\implies$ World-Class; $< 0 \\implies$ Severe Dissatisfaction"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d12-b1-nrr-and-grr-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Voice of Customer NPS Ledger (70 Promoters, 20 Passives, 10 Detractors)",
              "boxes": [
                {
                  "label": "Promoters (9-10)",
                  "value": "70 / 100 = 70.0% Enthusiastic Brand Champions",
                  "varType": "Promoters",
                  "isUpdated": false
                },
                {
                  "label": "Detractors (0-6)",
                  "value": "10 / 100 = 10.0% Unhappy at-risk accounts",
                  "varType": "Detractors",
                  "isUpdated": false
                },
                {
                  "label": "Net Promoter Score",
                  "value": "70% - 10% = +60 NPS (WORLD-CLASS CUSTOMER LOYALTY >= +50!)",
                  "varType": "NPS",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "nps_calc_demo.js",
            "initialCode": "function calculateNps(promoters, passives, detractors) {\n  const total = promoters + passives + detractors;\n  const promPct = (promoters / total) * 100;\n  const detPct = (detractors / total) * 100;\n  const nps = Math.round(promPct - detPct);\n  return {\n    total,\n    npsScore: nps,\n    isWorldClass: nps >= 50,\n    status: 'NPS_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateNps(70, 20, 10)));",
            "expectedOutput": "{\"total\":100,\"npsScore\":60,\"isWorldClass\":true,\"status\":\"NPS_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Net Promoter Score when a survey of 100 customers yields 70 Promoters, 20 Passives, and 10 Detractors ($70 - 10$)?",
          "expectedStringOutput": "60",
          "acceptableAnswers": [
            "60",
            "+60",
            "npsScore\":60"
          ],
          "primaryMisconceptionId": "MC_SCRM_VOC_NPS_CSAT_ADVOCACY",
          "diagnosisMap": {
            "40": {
              "misconceptionId": "MC_SCRM_VOC_NPS_CSAT_ADVOCACY",
              "errorExplanation": "40 subtracts passives (70 - 20 - 10). Passives are excluded from NPS calculation: 70 - 10 = +60.",
              "recoveryPath": {
                "simplerExplanation": "70 - 10 = 60.",
                "guidedFixPrompt": "Type 60"
              }
            }
          }
        }
      },
      {
        "id": "scrm-d13-b2-csat-vs-ces-metrics",
        "day": 13,
        "blockNumber": 2,
        "title": "Customer Satisfaction (CSAT) vs Customer Effort Score (CES)",
        "conceptBudget": {
          "primaryConcept": "CSAT vs CES Metrics",
          "supportingTerms": [
            "CSAT ('How satisfied were you with this support interaction?' Target $> 90\\%$)",
            "Customer Effort Score (CES: 'How easy was it to resolve your issue?' Target: Minimal friction)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d13-b1-nps-calculation-and-benchmarks",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "VoC Metric Comparison",
            "codeSnippet": "// NPS:  Relationship Metric (Will they recommend company to peers? Measured annually)\n// CSAT: Transaction Metric  (Were they happy with specific ticket? Measured per ticket)\n// CES:  Friction Metric     (Was onboarding effortless? Measured after setup)",
            "lineNotes": {
              "1": "Overall loyalty.",
              "2": "Support quality.",
              "3": "Effort friction."
            }
          },
          {
            "type": "runnable_code",
            "filename": "voc_metrics_demo.js",
            "initialCode": "function getRelationshipVsTransactionalMetric(isRelationshipLevel) {\n  return isRelationshipLevel\n    ? 'NET_PROMOTER_SCORE_NPS_RELATIONSHIP_METRIC'\n    : 'CSAT_TRANSACTIONAL_INTERACTION_METRIC';\n}\n\nconsole.log(getRelationshipVsTransactionalMetric(true));",
            "expectedOutput": "NET_PROMOTER_SCORE_NPS_RELATIONSHIP_METRIC",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which VoC metric serves as the primary overall relationship and brand advocacy gauge rather than evaluating an isolated support ticket?",
          "expectedStringOutput": "NET_PROMOTER_SCORE_NPS_RELATIONSHIP_METRIC",
          "acceptableAnswers": [
            "NET_PROMOTER_SCORE_NPS_RELATIONSHIP_METRIC",
            "NPS",
            "Net Promoter Score"
          ],
          "primaryMisconceptionId": "MC_SCRM_VOC_NPS_CSAT_ADVOCACY",
          "diagnosisMap": {
            "CSAT": {
              "misconceptionId": "MC_SCRM_VOC_NPS_CSAT_ADVOCACY",
              "errorExplanation": "CSAT is transactional. NPS is the NET_PROMOTER_SCORE_NPS_RELATIONSHIP_METRIC.",
              "recoveryPath": {
                "simplerExplanation": "Matches NET_PROMOTER_SCORE_NPS_RELATIONSHIP_METRIC.",
                "guidedFixPrompt": "Type NET_PROMOTER_SCORE_NPS_RELATIONSHIP_METRIC"
              }
            }
          }
        }
      },
      {
        "id": "scrm-d13-b3-customer-advocacy-case-studies",
        "day": 13,
        "blockNumber": 3,
        "title": "Transforming Promoters into Case Studies, Reference Calls & CABs",
        "conceptBudget": {
          "primaryConcept": "Advocacy Activation Invariant",
          "supportingTerms": [
            "Promoters (NPS 9-10) are automatically routed into marketing advocacy workflows: 1. Video Case Studies; 2. G2 / Gartner Peer Reviews; 3. Customer Advisory Board (CAB) invitations"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d13-b2-csat-vs-ces-metrics",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "advocacy_routing_demo.js",
            "initialCode": "function routeNpsFeedback(npsRating) {\n  return npsRating >= 9\n    ? 'INVITE_TO_CUSTOMER_ADVISORY_BOARD_AND_CASE_STUDY'\n    : (npsRating <= 6 ? 'DISPATCH_CSM_DETRACTOR_INTERVENTION' : 'NURTURE');\n}\n\nconsole.log(routeNpsFeedback(10));\nconsole.log(routeNpsFeedback(4));",
            "expectedOutput": "INVITE_TO_CUSTOMER_ADVISORY_BOARD_AND_CASE_STUDY\nDISPATCH_CSM_DETRACTOR_INTERVENTION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What workflow action is automatically triggered when an enterprise customer responds with a perfect 10 on their NPS survey?",
          "expectedStringOutput": "INVITE_TO_CUSTOMER_ADVISORY_BOARD_AND_CASE_STUDY",
          "acceptableAnswers": [
            "INVITE_TO_CUSTOMER_ADVISORY_BOARD_AND_CASE_STUDY",
            "Invite to CAB",
            "Case study invitation"
          ],
          "primaryMisconceptionId": "MC_SCRM_VOC_NPS_CSAT_ADVOCACY",
          "diagnosisMap": {
            "IGNORE": {
              "misconceptionId": "MC_SCRM_VOC_NPS_CSAT_ADVOCACY",
              "errorExplanation": "Happy promoters must be activated via INVITE_TO_CUSTOMER_ADVISORY_BOARD_AND_CASE_STUDY.",
              "recoveryPath": {
                "simplerExplanation": "Matches INVITE_TO_CUSTOMER_ADVISORY_BOARD_AND_CASE_STUDY.",
                "guidedFixPrompt": "Type INVITE_TO_CUSTOMER_ADVISORY_BOARD_AND_CASE_STUDY"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 14,
    "title": "Customer Success Operations (CS Ops): Portfolio Capacity & Whitespace Mapping",
    "overviewMetaphor": "CSM Portfolio Capacity is the Weight Limit on a Heavy Cargo Crane: If an enterprise SaaS business manages $15,000,000 in total ARR and each Customer Success Manager (CSM) has an optimal portfolio capacity of $1,500,000 in ARR, the required team size is exactly 10 CSMs ($Headcount = \\frac{15M}{1.5M} = 10$); overloading CSMs with $3M+ in ARR causes burnout, missed QBRs, and preventable customer churn.",
    "blocks": [
      {
        "id": "scrm-d14-b1-csm-portfolio-capacity-calculation",
        "day": 14,
        "blockNumber": 1,
        "title": "CSM Portfolio Headcount Capacity: $\\text{CSM Headcount} = \\lceil \\frac{\\text{Total Company ARR}}{\\text{Max ARR per CSM Cap}} \\rceil$",
        "conceptBudget": {
          "primaryConcept": "CSM Portfolio Capacity Formula",
          "supportingTerms": [
            "Total Company ARR ($15,000,000.00$)",
            "Max ARR Capacity per CSM ($1,500,000.00$)",
            "Required CSM Headcount = $\\frac{15,000,000}{1,500,000} = 10$ CSMs",
            "Enterprise SaaS Standard: $\\$1.5M - \\$2.0M$ ARR per CSM"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d13-b1-nps-calculation-and-benchmarks",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "CS Ops Headcount Capacity Ledger ($15M ARR / $1.5M Cap)",
              "boxes": [
                {
                  "label": "Total Company ARR",
                  "value": "$15,000,000.00 Enterprise Annual Recurring Revenue Base",
                  "varType": "ARR",
                  "isUpdated": false
                },
                {
                  "label": "Max ARR Cap per CSM",
                  "value": "$1,500,000.00 Optimal Portfolio Capacity Threshold",
                  "varType": "Cap",
                  "isUpdated": false
                },
                {
                  "label": "Required CSM Team",
                  "value": "$15M / $1.5M = 10 FULL-TIME DEDICATED CSMS REQUIRED!",
                  "varType": "Headcount",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "csm_capacity_demo.js",
            "initialCode": "function calculateCsmHeadcount(arr, capPerCsm) {\n  const count = Math.ceil(arr / capPerCsm);\n  return {\n    arr,\n    capPerCsm,\n    csmHeadcount: count,\n    status: 'CAPACITY_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateCsmHeadcount(15000000, 1500000)));",
            "expectedOutput": "{\"arr\":15000000,\"capPerCsm\":1500000,\"csmHeadcount\":10,\"status\":\"CAPACITY_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many Customer Success Managers are required to support a $15,000,000 ARR portfolio with a $1,500,000 ARR capacity limit per CSM ($15,000,000 / 1,500,000$)?",
          "expectedStringOutput": "10",
          "acceptableAnswers": [
            "10",
            "10 CSMs",
            "csmHeadcount\":10"
          ],
          "primaryMisconceptionId": "MC_SCRM_CS_OPS_PORTFOLIO_CAPACITY",
          "diagnosisMap": {
            "15": {
              "misconceptionId": "MC_SCRM_CS_OPS_PORTFOLIO_CAPACITY",
              "errorExplanation": "15 assumes $1M cap. At $1.5M cap per CSM, $15M / $1.5M = 10 CSMs.",
              "recoveryPath": {
                "simplerExplanation": "15,000,000 / 1,500,000 = 10.",
                "guidedFixPrompt": "Type 10"
              }
            }
          }
        }
      },
      {
        "id": "scrm-d14-b2-account-whitespace-mapping",
        "day": 14,
        "blockNumber": 2,
        "title": "Account Whitespace Mapping: Identifying Unpurchased Product Modules",
        "conceptBudget": {
          "primaryConcept": "Account Whitespace Analysis",
          "supportingTerms": [
            "Whitespace Grid (Matrix mapping all enterprise accounts against your full product suite to spotlight upsell expansion opportunities)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d14-b1-csm-portfolio-capacity-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Whitespace Opportunity Matrix",
            "codeSnippet": "// Account Acme Corp:\n// [X] Core Billing Module    ($50k ARR - Active)\n// [ ] AI Fraud Shield        ($30k ARR - WHITESPACE EXPANSION OPPORTUNITY!)\n// [ ] Multi-Currency Engine ($20k ARR - WHITESPACE EXPANSION OPPORTUNITY!)",
            "lineNotes": {
              "1": "Active subscribed product.",
              "2": "Unrealized module whitespace.",
              "3": "Target expansion module."
            }
          },
          {
            "type": "runnable_code",
            "filename": "whitespace_demo.js",
            "initialCode": "function calculateAccountWhitespace(allModulesVal, subscribedModulesVal) {\n  return allModulesVal - subscribedModulesVal;\n}\n\nconsole.log(calculateAccountWhitespace(100000, 50000));",
            "expectedOutput": "50000",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the whitespace expansion opportunity in dollars for an account currently paying $50,000 out of a total possible $100,000 product suite value ($100,000 - 50,000$)?",
          "expectedStringOutput": "50000",
          "acceptableAnswers": [
            "50000",
            "$50,000",
            "50,000"
          ],
          "primaryMisconceptionId": "MC_SCRM_CS_OPS_PORTFOLIO_CAPACITY",
          "diagnosisMap": {
            "100000": {
              "misconceptionId": "MC_SCRM_CS_OPS_PORTFOLIO_CAPACITY",
              "errorExplanation": "100,000 is total product suite. Subtracting the $50k active license leaves $50,000 whitespace.",
              "recoveryPath": {
                "simplerExplanation": "100,000 - 50,000 = 50,000.",
                "guidedFixPrompt": "Type 50000"
              }
            }
          }
        }
      },
      {
        "id": "scrm-d14-b3-playbook-automation-gainsight",
        "day": 14,
        "blockNumber": 3,
        "title": "Automated CS Playbooks & Lifecycle Alert Triggers",
        "conceptBudget": {
          "primaryConcept": "CS Playbook Automation",
          "supportingTerms": [
            "Automated Calls-to-Action (CTAs in Gainsight / ChurnZero when health drops or renewal approaches 90 days)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d14-b2-account-whitespace-mapping",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "cta_trigger_demo.js",
            "initialCode": "function getAutomatedCtaTrigger(daysToRenewal) {\n  return daysToRenewal === 90\n    ? 'DISPATCH_AUTOMATED_RENEWAL_READINESS_CTA_TO_CSM'\n    : 'MAINTAIN_STANDARD_NURTURE';\n}\n\nconsole.log(getAutomatedCtaTrigger(90));",
            "expectedOutput": "DISPATCH_AUTOMATED_RENEWAL_READINESS_CTA_TO_CSM",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What automated action is triggered in the CS operations platform exactly 90 days before an enterprise contract renewal date?",
          "expectedStringOutput": "DISPATCH_AUTOMATED_RENEWAL_READINESS_CTA_TO_CSM",
          "acceptableAnswers": [
            "DISPATCH_AUTOMATED_RENEWAL_READINESS_CTA_TO_CSM",
            "Renewal CTA",
            "Dispatch Renewal CTA"
          ],
          "primaryMisconceptionId": "MC_SCRM_CS_OPS_PORTFOLIO_CAPACITY",
          "diagnosisMap": {
            "NOTHING": {
              "misconceptionId": "MC_SCRM_CS_OPS_PORTFOLIO_CAPACITY",
              "errorExplanation": "90 days triggers DISPATCH_AUTOMATED_RENEWAL_READINESS_CTA_TO_CSM.",
              "recoveryPath": {
                "simplerExplanation": "Matches DISPATCH_AUTOMATED_RENEWAL_READINESS_CTA_TO_CSM.",
                "guidedFixPrompt": "Type DISPATCH_AUTOMATED_RENEWAL_READINESS_CTA_TO_CSM"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 15,
    "title": "⭐ MILESTONE 2: Complete Pipeline Velocity, Onboarding & NRR Retention Engine",
    "overviewMetaphor": "Milestone 2 Synthesis: The complete sovereign customer success, pipeline acceleration, and revenue retention suite: 1. Pipeline velocity engine ($5,000/day); 2. Rapid Time-to-Value onboarding ($10$ days TTV); 3. Composite Customer Health Score ($86.5$ Green CHS); 4. Net Revenue Retention ($120.0\\%$ NRR); 5. Net Promoter Score ($+60$ NPS); 6. CS Ops headcount capacity planning ($10$ CSMs for $15M ARR).",
    "blocks": [
      {
        "id": "scrm-d15-b1-customer-success-master-synthesis",
        "day": 15,
        "blockNumber": 1,
        "title": "Customer Success & Retention Master Engine Synthesis",
        "conceptBudget": {
          "primaryConcept": "Customer Success & Retention Engine Synthesis",
          "supportingTerms": [
            "Velocity Engine",
            "TTV Onboarding Engine",
            "CHS Health Engine",
            "NRR Retention Engine",
            "NPS Advocacy Engine",
            "CSM Capacity Engine"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d14-b3-playbook-automation-gainsight",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Milestone 2 Customer Success & Retention Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "Generates $5k/day pipeline velocity and enforces 10-day TTV",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Computes 86.5 Green composite CHS and prevents churn risks",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Validates 120.0% NRR and +60 world-class NPS sentiment",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Plans 10 CSMs for $15M ARR and certifies CS retention master engine!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "cs_master_kernel_demo.js",
            "initialCode": "function runCsRetentionEngine() {\n  return {\n    velocitySubsystem: 'ONLINE_5K_DAILY_VELOCITY_ACTIVE',\n    ttvSubsystem: 'ONLINE_10_DAYS_TTV_ACTIVE',\n    chsSubsystem: 'ONLINE_86_5_GREEN_CHS_ACTIVE',\n    nrrSubsystem: 'ONLINE_120_PERCENT_NRR_ACTIVE',\n    npsSubsystem: 'ONLINE_60_NPS_ACTIVE',\n    capacitySubsystem: 'ONLINE_10_CSMS_ACTIVE',\n    engineStatus: 'CUSTOMER_SUCCESS_AND_RETENTION_MASTER_ACTIVE'\n  };\n}\n\nconsole.log(runCsRetentionEngine().engineStatus);",
            "expectedOutput": "CUSTOMER_SUCCESS_AND_RETENTION_MASTER_ACTIVE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What engine status confirms active operational synthesis of the Customer Success & Retention Master Engine?",
          "expectedStringOutput": "CUSTOMER_SUCCESS_AND_RETENTION_MASTER_ACTIVE",
          "acceptableAnswers": [
            "CUSTOMER_SUCCESS_AND_RETENTION_MASTER_ACTIVE",
            "engineStatus: CUSTOMER_SUCCESS_AND_RETENTION_MASTER_ACTIVE"
          ],
          "primaryMisconceptionId": "MC_SCRM_RETENTION_EXPANSION_NRR_GRR",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_SCRM_RETENTION_EXPANSION_NRR_GRR",
              "errorExplanation": "Matches CUSTOMER_SUCCESS_AND_RETENTION_MASTER_ACTIVE.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type CUSTOMER_SUCCESS_AND_RETENTION_MASTER_ACTIVE"
              }
            }
          }
        }
      },
      {
        "id": "scrm-d15-b2-cs-engine-audit",
        "day": 15,
        "blockNumber": 2,
        "title": "Customer Success Engine Invariant Verification & Precision Audit",
        "conceptBudget": {
          "primaryConcept": "CS Invariant Verification",
          "supportingTerms": [
            "Velocity Invariant",
            "NRR Invariant",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d15-b1-customer-success-master-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "cs_audit_demo.js",
            "initialCode": "function auditCsEngine(velValid, ttvValid, chsValid, nrrValid, npsValid, capValid) {\n  const passed = velValid && ttvValid && chsValid && nrrValid && npsValid && capValid;\n  return {\n    velocityVerified: velValid,\n    ttvVerified: ttvValid,\n    chsVerified: chsValid,\n    nrrVerified: nrrValid,\n    npsVerified: npsValid,\n    capacityVerified: capValid,\n    grade: passed ? 'CUSTOMER_SUCCESS_ENGINE_AUDIT_PASSED' : 'AUDIT_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditCsEngine(true, true, true, true, true, true)));",
            "expectedOutput": "{\"velocityVerified\":true,\"ttvVerified\":true,\"chsVerified\":true,\"nrrVerified\":true,\"npsVerified\":true,\"capacityVerified\":true,\"grade\":\"CUSTOMER_SUCCESS_ENGINE_AUDIT_PASSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade is awarded when Velocity, TTV, CHS, NRR, NPS, and Capacity engines pass 100%?",
          "expectedStringOutput": "CUSTOMER_SUCCESS_ENGINE_AUDIT_PASSED",
          "acceptableAnswers": [
            "CUSTOMER_SUCCESS_ENGINE_AUDIT_PASSED",
            "grade\":\"CUSTOMER_SUCCESS_ENGINE_AUDIT_PASSED\""
          ],
          "primaryMisconceptionId": "MC_SCRM_RETENTION_EXPANSION_NRR_GRR",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_SCRM_RETENTION_EXPANSION_NRR_GRR",
              "errorExplanation": "All checks passing awards CUSTOMER_SUCCESS_ENGINE_AUDIT_PASSED.",
              "recoveryPath": {
                "simplerExplanation": "Awards CUSTOMER_SUCCESS_ENGINE_AUDIT_PASSED.",
                "guidedFixPrompt": "Type CUSTOMER_SUCCESS_ENGINE_AUDIT_PASSED"
              }
            }
          }
        }
      },
      {
        "id": "scrm-d15-b3-milestone2-scrm-cert",
        "day": 15,
        "blockNumber": 3,
        "title": "Milestone 2 Customer Success & Retention Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 2 Certification",
          "supportingTerms": [
            "Customer Success Retention Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d15-b2-cs-engine-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone2_scrm_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 2: Complete Pipeline Velocity, Onboarding & NRR Retention Engine [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 2: Complete Pipeline Velocity, Onboarding & NRR Retention Engine [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 2 completion?",
          "expectedStringOutput": "⭐ MILESTONE 2: Complete Pipeline Velocity, Onboarding & NRR Retention Engine [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 2: Complete Pipeline Velocity, Onboarding & NRR Retention Engine [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_SCRM_RETENTION_EXPANSION_NRR_GRR",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_SCRM_RETENTION_EXPANSION_NRR_GRR",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 2: Complete Pipeline Velocity, Onboarding & NRR Retention Engine [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 16,
    "title": "CRM Database Architecture & Data Hygiene: Objects, Relationships & Deduplication",
    "overviewMetaphor": "A CRM Database is the Relational Spine of Your Revenue Machine: The parent Account object (Company) links to child Contact records (People) and child Opportunity records (Deals); when incoming leads submit duplicate forms, the automated deduplication engine normalizes 'JOHN@ACME.COM' to 'john@acme.com' and merges activity history into the existing contact record, keeping your CRM database pristine and preventing multiple sales reps from calling the same lead.",
    "blocks": [
      {
        "id": "scrm-d16-b1-crm-lead-deduplication-logic",
        "day": 16,
        "blockNumber": 1,
        "title": "CRM Lead Deduplication & Normalization Logic",
        "conceptBudget": {
          "primaryConcept": "CRM Deduplication Mechanics",
          "supportingTerms": [
            "Parent Account (Company level)",
            "Child Contact (Individual people)",
            "Child Opportunity (Deal pipeline)",
            "Normalized Email Matching ('john@acme.com' $\\implies$ Merge Record)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d15-b1-customer-success-master-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "CRM Data Hygiene Deduplication Ledger",
              "boxes": [
                {
                  "label": "Incoming Web Lead",
                  "value": "'  JOHN@ACME.COM ' submitted eBook download form",
                  "varType": "Raw Lead",
                  "isUpdated": false
                },
                {
                  "label": "Normalized Email",
                  "value": "'john@acme.com' (Clean lower-case trimmed string)",
                  "varType": "Clean Lead",
                  "isUpdated": false
                },
                {
                  "label": "Deduplication Action",
                  "value": "Duplicate match found -> MERGE WITH EXISTING CRM CONTACT RECORD!",
                  "varType": "Action",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "dedup_calc_demo.js",
            "initialCode": "function deduplicateLead(email, existingLeads) {\n  const clean = email.trim().toLowerCase();\n  const isDup = existingLeads.some(l => l.email.trim().toLowerCase() === clean);\n  return {\n    clean,\n    isDup,\n    action: isDup ? 'MERGE_WITH_EXISTING_CRM_CONTACT' : 'CREATE_NEW_LEAD',\n    status: 'DEDUP_EVALUATED'\n  };\n}\n\nconst existing = [{ email: 'john@acme.com' }];\nconsole.log(JSON.stringify(deduplicateLead(' JOHN@ACME.COM ', existing)));\nconsole.log(JSON.stringify(deduplicateLead('alice@beta.com', existing)));",
            "expectedOutput": "{\"clean\":\"john@acme.com\",\"isDup\":true,\"action\":\"MERGE_WITH_EXISTING_CRM_CONTACT\",\"status\":\"DEDUP_EVALUATED\"}\n{\"clean\":\"alice@beta.com\",\"isDup\":false,\"action\":\"CREATE_NEW_LEAD\",\"status\":\"DEDUP_EVALUATED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What action is triggered in an enterprise CRM when an incoming form submission's normalized email matches an existing contact in the database?",
          "expectedStringOutput": "MERGE_WITH_EXISTING_CRM_CONTACT",
          "acceptableAnswers": [
            "MERGE_WITH_EXISTING_CRM_CONTACT",
            "Merge Contact",
            "Merge with existing"
          ],
          "primaryMisconceptionId": "MC_SCRM_CRM_OBJECT_ARCHITECTURE_HYGIENE",
          "diagnosisMap": {
            "CREATE_NEW": {
              "misconceptionId": "MC_SCRM_CRM_OBJECT_ARCHITECTURE_HYGIENE",
              "errorExplanation": "Creating a new record causes duplicate database clutter. It triggers MERGE_WITH_EXISTING_CRM_CONTACT.",
              "recoveryPath": {
                "simplerExplanation": "Matches MERGE_WITH_EXISTING_CRM_CONTACT.",
                "guidedFixPrompt": "Type MERGE_WITH_EXISTING_CRM_CONTACT"
              }
            }
          }
        }
      },
      {
        "id": "scrm-d16-b2-one-to-many-relational-model",
        "day": 16,
        "blockNumber": 2,
        "title": "The One-to-Many Account-to-Contacts Relational Data Model",
        "conceptBudget": {
          "primaryConcept": "CRM Relational Architecture",
          "supportingTerms": [
            "1 Account (Acme Corp) has Many Contacts (CEO, CFO, VP Sales, IT Director)",
            "1 Account has Many Opportunities (2024 Initial Deal, 2025 Expansion Deal)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d16-b1-crm-lead-deduplication-logic",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Relational Data Hierarchy",
            "codeSnippet": "// ACCOUNT: Acme Corporation (Parent Record)\n// |-- CONTACTS:      Alice (CFO), Bob (VP Sales), Charlie (IT Lead)\n// |-- OPPORTUNITIES: 2024 Core Subscription ($50k Won), 2025 AI Expansion ($30k Pipeline)\n// |-- CASES:        Support Ticket #492 (Resolved)",
            "lineNotes": {
              "1": "Parent entity.",
              "2": "Child stakeholder contacts.",
              "3": "Child revenue opportunities.",
              "4": "Child service tickets."
            }
          },
          {
            "type": "runnable_code",
            "filename": "crm_hierarchy_demo.js",
            "initialCode": "function getParentCrmObject() {\n  return 'ACCOUNT_IS_PRIMARY_PARENT_OBJECT';\n}\n\nconsole.log(getParentCrmObject());",
            "expectedOutput": "ACCOUNT_IS_PRIMARY_PARENT_OBJECT",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which standard CRM object serves as the primary root parent entity linking all child contacts, opportunities, and support tickets?",
          "expectedStringOutput": "ACCOUNT_IS_PRIMARY_PARENT_OBJECT",
          "acceptableAnswers": [
            "ACCOUNT_IS_PRIMARY_PARENT_OBJECT",
            "Account",
            "Account Object"
          ],
          "primaryMisconceptionId": "MC_SCRM_CRM_OBJECT_ARCHITECTURE_HYGIENE",
          "diagnosisMap": {
            "LEAD": {
              "misconceptionId": "MC_SCRM_CRM_OBJECT_ARCHITECTURE_HYGIENE",
              "errorExplanation": "Leads are unconverted prospect records. The root parent object is Account.",
              "recoveryPath": {
                "simplerExplanation": "Matches ACCOUNT_IS_PRIMARY_PARENT_OBJECT.",
                "guidedFixPrompt": "Type ACCOUNT_IS_PRIMARY_PARENT_OBJECT"
              }
            }
          }
        }
      },
      {
        "id": "scrm-d16-b3-stage-gating-validation-rules",
        "day": 16,
        "blockNumber": 3,
        "title": "Pipeline Stage-Gating: Enforcing Validation Rules Before Advancing Deals",
        "conceptBudget": {
          "primaryConcept": "CRM Validation Rules Invariant",
          "supportingTerms": [
            "Validation Rule (Preventing an AE from advancing an Opportunity to 'Negotiation' unless MEDDPICC Economic Buyer and Budget fields are populated)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d16-b2-one-to-many-relational-model",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "validation_rule_demo.js",
            "initialCode": "function canAdvanceToNegotiation(hasEconomicBuyerEngaged, hasQuantifiedRoi) {\n  return (hasEconomicBuyerEngaged && hasQuantifiedRoi)\n    ? 'VALIDATION_PASSED_ADVANCE_STAGE'\n    : 'BLOCKED_BY_VALIDATION_RULE_MISSING_MANDATORY_FIELDS';\n}\n\nconsole.log(canAdvanceToNegotiation(true, true));\nconsole.log(canAdvanceToNegotiation(false, true));",
            "expectedOutput": "VALIDATION_PASSED_ADVANCE_STAGE\nBLOCKED_BY_VALIDATION_RULE_MISSING_MANDATORY_FIELDS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What CRM system behavior occurs when a sales rep attempts to advance an opportunity stage without populating mandatory MEDDPICC fields?",
          "expectedStringOutput": "BLOCKED_BY_VALIDATION_RULE_MISSING_MANDATORY_FIELDS",
          "acceptableAnswers": [
            "BLOCKED_BY_VALIDATION_RULE_MISSING_MANDATORY_FIELDS",
            "Blocked by validation rule",
            "Blocked"
          ],
          "primaryMisconceptionId": "MC_SCRM_CRM_OBJECT_ARCHITECTURE_HYGIENE",
          "diagnosisMap": {
            "ALLOWED": {
              "misconceptionId": "MC_SCRM_CRM_OBJECT_ARCHITECTURE_HYGIENE",
              "errorExplanation": "Missing required fields triggers BLOCKED_BY_VALIDATION_RULE_MISSING_MANDATORY_FIELDS.",
              "recoveryPath": {
                "simplerExplanation": "Matches BLOCKED_BY_VALIDATION_RULE_MISSING_MANDATORY_FIELDS.",
                "guidedFixPrompt": "Type BLOCKED_BY_VALIDATION_RULE_MISSING_MANDATORY_FIELDS"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 17,
    "title": "CRM Workflow Automation & Lead Routing (Score >= 70 & Round-Robin)",
    "overviewMetaphor": "Automated Lead Routing is a High-Speed Air Traffic Controller for Inbound Prospects: An inbound lead with 40 demographic points ($40$ pts for VP Title at 500-employee company) and 35 behavioral points ($35$ pts for viewing the pricing page twice) achieves a composite score of 75 ($40 + 35 = 75$); because the score clears the 70-point SQL threshold, the routing engine instantly assigns the lead to the next Round-Robin sales rep (Sarah) within 60 seconds.",
    "blocks": [
      {
        "id": "scrm-d17-b1-lead-scoring-round-robin-routing",
        "day": 17,
        "blockNumber": 1,
        "title": "Automated Lead Scoring: $\\text{Total Score} = \\text{Demographic} + \\text{Behavioral} \\ge 70$ (SQL Handover)",
        "conceptBudget": {
          "primaryConcept": "Lead Scoring & Routing Formula",
          "supportingTerms": [
            "Demographic Points ($40$ pts)",
            "Behavioral Points ($35$ pts)",
            "Total Score = $40 + 35 = 75$ points",
            "SQL Threshold: $\\ge 70 \\implies$ Immediate Round-Robin Rep Assignment; $< 70 \\implies$ Automated Marketing Nurture"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d16-b1-crm-lead-deduplication-logic",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Automated Lead Scoring & Routing Ledger (75 Points SQL)",
              "boxes": [
                {
                  "label": "Demographic Score (40)",
                  "value": "VP Title (+25 pts) + 500-Employee Tier (+15 pts) = 40 Points",
                  "varType": "Demographic",
                  "isUpdated": false
                },
                {
                  "label": "Behavioral Score (35)",
                  "value": "Pricing Page View (+20 pts) + Webinar (+15 pts) = 35 Points",
                  "varType": "Behavioral",
                  "isUpdated": false
                },
                {
                  "label": "Round-Robin Routing",
                  "value": "75 >= 70 Threshold -> ASSIGNED TO REP SARAH (NEXT ROUND-ROBIN INDEX = 1)!",
                  "varType": "Routing",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "routing_calc_demo.js",
            "initialCode": "function scoreAndRoute(demo, behav, reps, currentIndex) {\n  const score = demo + behav;\n  const isSql = score >= 70;\n  const assignedRep = isSql ? reps[currentIndex % reps.length] : null;\n  return {\n    score,\n    isSql,\n    assignedRep,\n    nextIndex: isSql ? (currentIndex + 1) % reps.length : currentIndex,\n    status: isSql ? 'LEAD_SCORED_AND_ROUTED_TO_REP' : 'NURTURE'\n  };\n}\n\nconst reps = ['Sarah', 'David', 'Elena'];\nconsole.log(JSON.stringify(scoreAndRoute(40, 35, reps, 0)));\nconsole.log(JSON.stringify(scoreAndRoute(20, 20, reps, 0)));",
            "expectedOutput": "{\"score\":75,\"isSql\":true,\"assignedRep\":\"Sarah\",\"nextIndex\":1,\"status\":\"LEAD_SCORED_AND_ROUTED_TO_REP\"}\n{\"score\":40,\"isSql\":false,\"assignedRep\":null,\"nextIndex\":0,\"status\":\"NURTURE\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which sales representative is assigned from the round-robin pool ['Sarah', 'David', 'Elena'] when an inbound lead scores 75 total points at index 0?",
          "expectedStringOutput": "Sarah",
          "acceptableAnswers": [
            "Sarah",
            "assignedRep\":\"Sarah\""
          ],
          "primaryMisconceptionId": "MC_SCRM_CRM_WORKFLOW_AUTOMATION_ROUTING",
          "diagnosisMap": {
            "David": {
              "misconceptionId": "MC_SCRM_CRM_WORKFLOW_AUTOMATION_ROUTING",
              "errorExplanation": "Index 0 maps to Sarah. David is index 1 for the subsequent lead.",
              "recoveryPath": {
                "simplerExplanation": "Index 0 is Sarah.",
                "guidedFixPrompt": "Type Sarah"
              }
            }
          }
        }
      },
      {
        "id": "scrm-d17-b2-inbound-sla-fifteen-minute-rule",
        "day": 17,
        "blockNumber": 2,
        "title": "The 15-Minute Inbound Response SLA Rule (21x Conversion Advantage)",
        "conceptBudget": {
          "primaryConcept": "Inbound Lead SLA Invariant",
          "supportingTerms": [
            "Responding to an inbound demo request within 15 minutes yields a 21x higher qualification rate compared to waiting 24 hours",
            "Automated escalation triggers if untouched after 15 minutes"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d17-b1-lead-scoring-round-robin-routing",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Response Speed Multiplier",
            "codeSnippet": "// < 15 Minutes: 21x higher qualification conversion rate (Lead is actively at their desk!)\n// > 24 Hours:    80% decay in lead reachability and buyer interest",
            "lineNotes": {
              "1": "High velocity conversion.",
              "2": "Lead decay death zone."
            }
          },
          {
            "type": "runnable_code",
            "filename": "sla_demo.js",
            "initialCode": "function evaluateInboundSla(responseMinutes) {\n  return responseMinutes <= 15\n    ? 'OPTIMAL_HIGH_CONVERSION_SPEED_TO_LEAD'\n    : 'SLA_BREACH_TRIGGER_MANAGER_ALERT';\n}\n\nconsole.log(evaluateInboundSla(10));\nconsole.log(evaluateInboundSla(45));",
            "expectedOutput": "OPTIMAL_HIGH_CONVERSION_SPEED_TO_LEAD\nSLA_BREACH_TRIGGER_MANAGER_ALERT",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What performance status evaluates an SDR team that contacts an inbound enterprise demo lead within 10 minutes of form submission?",
          "expectedStringOutput": "OPTIMAL_HIGH_CONVERSION_SPEED_TO_LEAD",
          "acceptableAnswers": [
            "OPTIMAL_HIGH_CONVERSION_SPEED_TO_LEAD",
            "Optimal Speed to Lead",
            "Optimal"
          ],
          "primaryMisconceptionId": "MC_SCRM_CRM_WORKFLOW_AUTOMATION_ROUTING",
          "diagnosisMap": {
            "BREACH": {
              "misconceptionId": "MC_SCRM_CRM_WORKFLOW_AUTOMATION_ROUTING",
              "errorExplanation": "10 minutes is under the 15-minute SLA, earning OPTIMAL_HIGH_CONVERSION_SPEED_TO_LEAD.",
              "recoveryPath": {
                "simplerExplanation": "Matches OPTIMAL_HIGH_CONVERSION_SPEED_TO_LEAD.",
                "guidedFixPrompt": "Type OPTIMAL_HIGH_CONVERSION_SPEED_TO_LEAD"
              }
            }
          }
        }
      },
      {
        "id": "scrm-d17-b3-crm-auto-task-generation",
        "day": 17,
        "blockNumber": 3,
        "title": "Automated Task Generation & Notification Escalations",
        "conceptBudget": {
          "primaryConcept": "Task Automation Rules",
          "supportingTerms": [
            "Auto-task generation ('Call Lead within 15 min', 'Follow up on MSA contract in 48 hours')",
            "Slack/SMS webhook alerts dispatched directly to assigned reps"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d17-b2-inbound-sla-fifteen-minute-rule",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "auto_task_demo.js",
            "initialCode": "function generateAutoTasks(dealStage) {\n  return dealStage === 'CLOSED_WON'\n    ? 'TRIGGER_AUTOMATED_CS_ONBOARDING_HANDOFF_TASK'\n    : 'CREATE_NEXT_DISCOVERY_FOLLOWUP_TASK';\n}\n\nconsole.log(generateAutoTasks('CLOSED_WON'));",
            "expectedOutput": "TRIGGER_AUTOMATED_CS_ONBOARDING_HANDOFF_TASK",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What task workflow is automatically generated when an opportunity status transitions to 'Closed-Won' in the CRM?",
          "expectedStringOutput": "TRIGGER_AUTOMATED_CS_ONBOARDING_HANDOFF_TASK",
          "acceptableAnswers": [
            "TRIGGER_AUTOMATED_CS_ONBOARDING_HANDOFF_TASK",
            "Onboarding handoff task",
            "CS handoff task"
          ],
          "primaryMisconceptionId": "MC_SCRM_CRM_WORKFLOW_AUTOMATION_ROUTING",
          "diagnosisMap": {
            "ARCHIVE": {
              "misconceptionId": "MC_SCRM_CRM_WORKFLOW_AUTOMATION_ROUTING",
              "errorExplanation": "Closed-Won immediately triggers the TRIGGER_AUTOMATED_CS_ONBOARDING_HANDOFF_TASK.",
              "recoveryPath": {
                "simplerExplanation": "Matches TRIGGER_AUTOMATED_CS_ONBOARDING_HANDOFF_TASK.",
                "guidedFixPrompt": "Type TRIGGER_AUTOMATED_CS_ONBOARDING_HANDOFF_TASK"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 18,
    "title": "Sales Enablement & Competitive Battlecards: Killing Competitor FUD",
    "overviewMetaphor": "A Competitive Battlecard is an Elite Field Manual with Tactical Weakness Landmines: When a prospect brings up Legacy Incumbent Corp, an amateur rep tries to list 50 features; an enabled sales rep consulting a Battlecard lays an architectural landmine: 'Ask them how long it takes to deploy their on-prem server updates' — a question that instantly exposes the competitor's 6-month deployment flaw and establishes your modern cloud solution as the only viable choice.",
    "blocks": [
      {
        "id": "scrm-d18-b1-battlecard-differentiation-scripting",
        "day": 18,
        "blockNumber": 1,
        "title": "Competitive Battlecards: Strengths, Weaknesses, Landmines & Counter-Pitches",
        "conceptBudget": {
          "primaryConcept": "Battlecard Architecture",
          "supportingTerms": [
            "Competitor Weakness Landmines",
            "Quick-Dismiss Soundbites",
            "Proof Points / Customer Case Studies",
            "Counter-Pitch Scripts"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d17-b1-lead-scoring-round-robin-routing",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Competitive Battlecard Matrix (Legacy Incumbent Corp)",
              "boxes": [
                {
                  "label": "Competitor Claim",
                  "value": "'We have been in business for 30 years and have 10,000 features'",
                  "varType": "Claim",
                  "isUpdated": false
                },
                {
                  "label": "Tactical Landmine",
                  "value": "'Ask them what their average deployment and maintenance downtime is'",
                  "varType": "Landmine",
                  "isUpdated": false
                },
                {
                  "label": "Counter-Positioning",
                  "value": "FOCUS ON OUR 10X FASTER DEPLOYMENT AND ZERO MAINTENANCE!",
                  "varType": "Pitch",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "battlecard_demo.js",
            "initialCode": "function selectBattlecardScript(competitor) {\n  const cards = {\n    'LEGACY_INCUMBENT_CORP': 'FOCUS_ON_OUR_10X_FASTER_DEPLOYMENT_AND_ZERO_MAINTENANCE',\n    'CHEAP_LOW_END_DISRUPTOR': 'HIGHLIGHT_ENTERPRISE_SOC2_SECURITY_AND_99_99_PERCENT_SLA'\n  };\n  return cards[competitor] || 'DEFAULT_VALUE_SELLING_SCRIPT';\n}\n\nconsole.log(selectBattlecardScript('LEGACY_INCUMBENT_CORP'));\nconsole.log(selectBattlecardScript('CHEAP_LOW_END_DISRUPTOR'));",
            "expectedOutput": "FOCUS_ON_OUR_10X_FASTER_DEPLOYMENT_AND_ZERO_MAINTENANCE\nHIGHLIGHT_ENTERPRISE_SOC2_SECURITY_AND_99_99_PERCENT_SLA",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What counter-positioning strategy is prescribed by the sales battlecard when competing against a slow legacy incumbent vendor?",
          "expectedStringOutput": "FOCUS_ON_OUR_10X_FASTER_DEPLOYMENT_AND_ZERO_MAINTENANCE",
          "acceptableAnswers": [
            "FOCUS_ON_OUR_10X_FASTER_DEPLOYMENT_AND_ZERO_MAINTENANCE",
            "Faster deployment",
            "Zero maintenance"
          ],
          "primaryMisconceptionId": "MC_SCRM_SALES_ENABLEMENT_BATTLECARDS",
          "diagnosisMap": {
            "DISCOUNT_PRICE": {
              "misconceptionId": "MC_SCRM_SALES_ENABLEMENT_BATTLECARDS",
              "errorExplanation": "Price wars erode margin. The battlecard prescribes FOCUS_ON_OUR_10X_FASTER_DEPLOYMENT_AND_ZERO_MAINTENANCE.",
              "recoveryPath": {
                "simplerExplanation": "Matches FOCUS_ON_OUR_10X_FASTER_DEPLOYMENT_AND_ZERO_MAINTENANCE.",
                "guidedFixPrompt": "Type FOCUS_ON_OUR_10X_FASTER_DEPLOYMENT_AND_ZERO_MAINTENANCE"
              }
            }
          }
        }
      },
      {
        "id": "scrm-d18-b2-laying-competitor-landmines",
        "day": 2,
        "blockNumber": 2,
        "title": "The Art of Laying Competitor Landmines in Discovery Calls",
        "conceptBudget": {
          "primaryConcept": "Competitor Landmines Invariant",
          "supportingTerms": [
            "Landmine (Planting an objective evaluation question with the customer early in discovery that will cause the competitor to fail their demo e.g. 'Make sure you ask every vendor to demonstrate live SSO provisioning during their call')"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d18-b1-battlecard-differentiation-scripting",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Landmine Question Architecture",
            "codeSnippet": "// 1. Identify Competitor Flaw: Competitor X takes 4 weeks to ingest custom data formats\n// 2. Lay Landmine in Discovery: 'When evaluating solutions, make sure to test live custom schema ingestion'\n// 3. Result: Competitor is blindsided during their demo when the customer demands a live custom test!",
            "lineNotes": {
              "1": "Known weakness.",
              "2": "Objective customer criteria.",
              "3": "Competitor trap sprung."
            }
          },
          {
            "type": "runnable_code",
            "filename": "landmine_eval_demo.js",
            "initialCode": "function getLandmineStrategicGoal() {\n  return 'ESTABLISH_EVALUATION_CRITERIA_WHERE_COMPETITOR_FAILS';\n}\n\nconsole.log(getLandmineStrategicGoal());",
            "expectedOutput": "ESTABLISH_EVALUATION_CRITERIA_WHERE_COMPETITOR_FAILS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the strategic objective of laying a competitive landmine early in customer discovery questioning?",
          "expectedStringOutput": "ESTABLISH_EVALUATION_CRITERIA_WHERE_COMPETITOR_FAILS",
          "acceptableAnswers": [
            "ESTABLISH_EVALUATION_CRITERIA_WHERE_COMPETITOR_FAILS",
            "Trap competitor",
            "Fail competitor"
          ],
          "primaryMisconceptionId": "MC_SCRM_SALES_ENABLEMENT_BATTLECARDS",
          "diagnosisMap": {
            "BADMOUTH": {
              "misconceptionId": "MC_SCRM_SALES_ENABLEMENT_BATTLECARDS",
              "errorExplanation": "Badmouthing looks unprofessional. Landmines objectively ESTABLISH_EVALUATION_CRITERIA_WHERE_COMPETITOR_FAILS.",
              "recoveryPath": {
                "simplerExplanation": "Matches ESTABLISH_EVALUATION_CRITERIA_WHERE_COMPETITOR_FAILS.",
                "guidedFixPrompt": "Type ESTABLISH_EVALUATION_CRITERIA_WHERE_COMPETITOR_FAILS"
              }
            }
          }
        }
      },
      {
        "id": "scrm-d18-b3-sales-playbook-certification",
        "day": 18,
        "blockNumber": 3,
        "title": "Sales Playbooks & Certified Pitch Roleplaying",
        "conceptBudget": {
          "primaryConcept": "Playbook Certification Invariant",
          "supportingTerms": [
            "Sales Playbook (Standardized objection scripts, email templates, demo narratives)",
            "Reps must pass video certification roleplay before touching live accounts"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d18-b2-laying-competitor-landmines",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "certification_demo.js",
            "initialCode": "function isRepCertifiedToSell(passedRoleplayExam) {\n  return passedRoleplayExam\n    ? 'AUTHORIZED_TO_HANDLE_ENTERPRISE_PIPELINE'\n    : 'RETRAIN_IN_ENABLEMENT_SANDBOX';\n}\n\nconsole.log(isRepCertifiedToSell(true));",
            "expectedOutput": "AUTHORIZED_TO_HANDLE_ENTERPRISE_PIPELINE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What authorization status is unlocked when an Account Executive passes all certified pitch and objection handling roleplay exams?",
          "expectedStringOutput": "AUTHORIZED_TO_HANDLE_ENTERPRISE_PIPELINE",
          "acceptableAnswers": [
            "AUTHORIZED_TO_HANDLE_ENTERPRISE_PIPELINE",
            "Authorized",
            "Certified to sell"
          ],
          "primaryMisconceptionId": "MC_SCRM_SALES_ENABLEMENT_BATTLECARDS",
          "diagnosisMap": {
            "BLOCKED": {
              "misconceptionId": "MC_SCRM_SALES_ENABLEMENT_BATTLECARDS",
              "errorExplanation": "Passing certification unlocks AUTHORIZED_TO_HANDLE_ENTERPRISE_PIPELINE.",
              "recoveryPath": {
                "simplerExplanation": "Matches AUTHORIZED_TO_HANDLE_ENTERPRISE_PIPELINE.",
                "guidedFixPrompt": "Type AUTHORIZED_TO_HANDLE_ENTERPRISE_PIPELINE"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 19,
    "title": "Sales Compensation: OTE (50/50 Split) & Commission Accelerators",
    "overviewMetaphor": "Commission Accelerators are Turbochargers on a Formula 1 Racecar: A standard AE has a $200,000 On-Target Earnings package ($100k Base + $100k Variable Commission at 100% quota); hitting 120% of quota ($120\\%$) activates a 1.5x Accelerator on all revenue above 100%, paying out $100,000 base + $100,000 standard commission + $30,000 accelerated commission = $230,000 in total annual compensation ($100k + 100k + (20\\% \\times 1.5 = 30k)$).",
    "blocks": [
      {
        "id": "scrm-d19-b1-ote-accelerator-calculation",
        "day": 19,
        "blockNumber": 1,
        "title": "OTE & Commission Accelerator Calculation: Total Compensation at $120\\%$ Quota Attainment",
        "conceptBudget": {
          "primaryConcept": "Commission Accelerator Formula",
          "supportingTerms": [
            "Base Salary ($100,000.00$)",
            "Variable Commission OTE ($100,000.00$)",
            "Quota Attainment ($120.0\\%$)",
            "Standard Commission = $\\$100,000.00$",
            "Excess Attainment = $20.0\\%$",
            "Accelerated Payout = $100,000 \\times 0.20 \\times 1.5 = \\$30,000.00$",
            "Total Earnings = $100k + 100k + 30k = \\$230,000.00$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d18-b1-battlecard-differentiation-scripting",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Sales Compensation Payout Ledger ($100k Base, $100k OTE @ 120% Quota)",
              "boxes": [
                {
                  "label": "Base Salary",
                  "value": "$100,000.00 Fixed Annual Guaranteed Salary",
                  "varType": "Base Salary",
                  "isUpdated": false
                },
                {
                  "label": "100% Quota Commission",
                  "value": "$100,000.00 Variable Commission Earned on Base Quota",
                  "varType": "Base Commission",
                  "isUpdated": false
                },
                {
                  "label": "1.5x Accelerator (20% Excess)",
                  "value": "$100k x 20% x 1.5 = $30,000.00 Accelerated Super-Payout!",
                  "varType": "Accelerator",
                  "isUpdated": false
                },
                {
                  "label": "Total Annual Earnings",
                  "value": "$100k + $100k + $30k = $230,000.00 TOTAL ANNUAL COMPENSATION!",
                  "varType": "Total Payout",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "comp_calc_demo.js",
            "initialCode": "function calculateComp(base, variableOte, attainmentPct) {\n  let commission = 0;\n  if (attainmentPct <= 100) {\n    commission = variableOte * (attainmentPct / 100);\n  } else {\n    const baseOte = variableOte;\n    const excessPct = attainmentPct - 100;\n    const accelerated = variableOte * (excessPct / 100) * 1.5;\n    commission = baseOte + accelerated;\n  }\n  return {\n    base,\n    commission: Math.round(commission),\n    totalEarnings: Math.round(base + commission),\n    status: 'COMPENSATION_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateComp(100000, 100000, 120)));",
            "expectedOutput": "{\"base\":100000,\"commission\":130000,\"totalEarnings\":230000,\"status\":\"COMPENSATION_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the total annual compensation in dollars for an Account Executive with a $100k base and $100k variable OTE when achieving 120% of quota with a 1.5x accelerator above 100% ($100,000 + 100,000 + (100,000 \\times 0.20 \\times 1.5)$)?",
          "expectedStringOutput": "230000",
          "acceptableAnswers": [
            "230000",
            "$230,000",
            "230,000",
            "totalEarnings\":230000"
          ],
          "primaryMisconceptionId": "MC_SCRM_COMPENSATION_OTE_ACCELERATORS",
          "diagnosisMap": {
            "220000": {
              "misconceptionId": "MC_SCRM_COMPENSATION_OTE_ACCELERATORS",
              "errorExplanation": "220,000 forgets the 1.5x accelerator multiplier (100k * 20% = 20k). With 1.5x, 20k becomes 30k = $230,000 total.",
              "recoveryPath": {
                "simplerExplanation": "100k + 100k + (20k * 1.5) = 230,000.",
                "guidedFixPrompt": "Type 230000"
              }
            }
          }
        }
      },
      {
        "id": "scrm-d19-b2-draw-against-commission",
        "day": 19,
        "blockNumber": 2,
        "title": "Recoverable vs Non-Recoverable Draw During Sales Ramp Periods",
        "conceptBudget": {
          "primaryConcept": "Draw Against Commission Invariant",
          "supportingTerms": [
            "Non-Recoverable Draw (Guaranteed commission paid to new reps during 3-month ramp that does not need to be repaid if deals are slow)",
            "Recoverable Draw (Loan against future commission - High rep turnover risk)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d19-b1-ote-accelerator-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Draw Structure Comparison",
            "codeSnippet": "// NON-RECOVERABLE (Best Practice): New rep gets $8k/mo guaranteed while learning product\n// RECOVERABLE (High Churn Risk):  Rep owes company money if initial pipeline ramps slowly",
            "lineNotes": {
              "1": "Modern ramp support.",
              "2": "Demotivating debt structure."
            }
          },
          {
            "type": "runnable_code",
            "filename": "draw_demo.js",
            "initialCode": "function getStandardRampDrawType() {\n  return 'NON_RECOVERABLE_DRAW_DURING_90_DAY_RAMP';\n}\n\nconsole.log(getStandardRampDrawType());",
            "expectedOutput": "NON_RECOVERABLE_DRAW_DURING_90_DAY_RAMP",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which draw structure is standard practice for supporting newly hired Account Executives during their 90-day pipeline ramp period without burdening them with debt?",
          "expectedStringOutput": "NON_RECOVERABLE_DRAW_DURING_90_DAY_RAMP",
          "acceptableAnswers": [
            "NON_RECOVERABLE_DRAW_DURING_90_DAY_RAMP",
            "Non-recoverable draw",
            "Non recoverable draw"
          ],
          "primaryMisconceptionId": "MC_SCRM_COMPENSATION_OTE_ACCELERATORS",
          "diagnosisMap": {
            "RECOVERABLE": {
              "misconceptionId": "MC_SCRM_COMPENSATION_OTE_ACCELERATORS",
              "errorExplanation": "Recoverable creates debt. Best practice is NON_RECOVERABLE_DRAW_DURING_90_DAY_RAMP.",
              "recoveryPath": {
                "simplerExplanation": "Matches NON_RECOVERABLE_DRAW_DURING_90_DAY_RAMP.",
                "guidedFixPrompt": "Type NON_RECOVERABLE_DRAW_DURING_90_DAY_RAMP"
              }
            }
          }
        }
      },
      {
        "id": "scrm-d19-b3-spiffs-and-tactical-incentives",
        "day": 19,
        "blockNumber": 3,
        "title": "Tactical Incentives (SPIFFs): Driving Short-Term Strategic Focus",
        "conceptBudget": {
          "primaryConcept": "SPIFF Incentive Mechanics",
          "supportingTerms": [
            "SPIFF (Sales Performance Incentive Fund: Instant cash bonus e.g. $1,000 for closing a multi-year deal or selling a new AI module this month)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d19-b2-draw-against-commission",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "spiff_demo.js",
            "initialCode": "function getSpiffFullForm() {\n  return 'SALES_PERFORMANCE_INCENTIVE_FUND';\n}\n\nconsole.log(getSpiffFullForm());",
            "expectedOutput": "SALES_PERFORMANCE_INCENTIVE_FUND",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the full form acronym definition of a SPIFF incentive bonus in sales operations?",
          "expectedStringOutput": "SALES_PERFORMANCE_INCENTIVE_FUND",
          "acceptableAnswers": [
            "SALES_PERFORMANCE_INCENTIVE_FUND",
            "Sales Performance Incentive Fund"
          ],
          "primaryMisconceptionId": "MC_SCRM_COMPENSATION_OTE_ACCELERATORS",
          "diagnosisMap": {
            "COMMISSION": {
              "misconceptionId": "MC_SCRM_COMPENSATION_OTE_ACCELERATORS",
              "errorExplanation": "SPIFF stands for SALES_PERFORMANCE_INCENTIVE_FUND.",
              "recoveryPath": {
                "simplerExplanation": "Matches SALES_PERFORMANCE_INCENTIVE_FUND.",
                "guidedFixPrompt": "Type SALES_PERFORMANCE_INCENTIVE_FUND"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 20,
    "title": "Sales Coaching & Conversational Intelligence (Gong Talk/Listen <= 45/55)",
    "overviewMetaphor": "Conversational Intelligence is a Video Replay for an Olympic Athlete: Across a 3,000-second discovery call (50 minutes), if a sales rep talks for 1,200 seconds and the prospect speaks for 1,800 seconds, the rep's Talk Ratio is 40.0% ($1,200 / 3,000 = 40.0\\%$); because this is $\\le 45.0\\%$, the rep satisfies the Golden Active Listening Rule, allowing the customer to describe their deepest pain points without interruption.",
    "blocks": [
      {
        "id": "scrm-d20-b1-talk-to-listen-ratio-calculation",
        "day": 20,
        "blockNumber": 1,
        "title": "Gong Conversational Talk/Listen Ratio: $\\text{Rep Talk}\\% = \\frac{\\text{Rep Talk Time}}{\\text{Total Call Time}} \\times 100\\% \\le 45.0\\%$",
        "conceptBudget": {
          "primaryConcept": "Talk/Listen Ratio Formula",
          "supportingTerms": [
            "Rep Talk Time ($1,200$ seconds)",
            "Prospect Talk Time ($1,800$ seconds)",
            "Total Duration = $1,200 + 1,800 = 3,000$ seconds (50 minutes)",
            "Rep Talk % = $\\frac{1,200}{3,000} \\times 100\\% = 40.0\\%$",
            "Active Listening Benchmark: $\\le 45.0\\% \\implies$ Excellent; $> 60.0\\% \\implies$ Monopolizing the Call"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d19-b1-ote-accelerator-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Gong Conversational Intelligence Ledger (40% Talk Time)",
              "boxes": [
                {
                  "label": "Rep Speaking Time",
                  "value": "1,200 Seconds (20 Minutes of Focused Questions & Guidance)",
                  "varType": "Rep Time",
                  "isUpdated": false
                },
                {
                  "label": "Prospect Speaking Time",
                  "value": "1,800 Seconds (30 Minutes of Customer Pain Description)",
                  "varType": "Prospect Time",
                  "isUpdated": false
                },
                {
                  "label": "Conversational Balance",
                  "value": "1,200 / 3,000 = 40.0% (EXCELLENT ACTIVE LISTENING CONSULTATIVE CALL!)",
                  "varType": "Talk Ratio",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "talk_ratio_calc_demo.js",
            "initialCode": "function calculateTalkRatio(repSec, prospectSec) {\n  const total = repSec + prospectSec;\n  const pct = (repSec / total) * 100;\n  const isElite = pct <= 45.0;\n  return {\n    total,\n    repTalkPct: Number(pct.toFixed(1)),\n    isElite,\n    status: isElite ? 'EXCELLENT_ACTIVE_LISTENING_CONSULTATIVE_CALL' : 'MONOPOLIZING_CALL'\n  };\n}\n\nconsole.log(JSON.stringify(calculateTalkRatio(1200, 1800)));",
            "expectedOutput": "{\"total\":3000,\"repTalkPct\":40,\"isElite\":true,\"status\":\"EXCELLENT_ACTIVE_LISTENING_CONSULTATIVE_CALL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the sales rep's talk ratio percentage when speaking for 1,200 seconds during a 3,000-second total call ($ (1,200 / 3,000) \\times 100 $)?",
          "expectedStringOutput": "40",
          "acceptableAnswers": [
            "40",
            "40%",
            "40.0",
            "repTalkPct\":40"
          ],
          "primaryMisconceptionId": "MC_SCRM_PERFORMANCE_COACHING_TALK_RATIO",
          "diagnosisMap": {
            "60": {
              "misconceptionId": "MC_SCRM_PERFORMANCE_COACHING_TALK_RATIO",
              "errorExplanation": "60% is the prospect's listen/talk time (1800/3000). The rep's talk ratio is 40.0%.",
              "recoveryPath": {
                "simplerExplanation": "1,200 / 3,000 * 100 = 40%.",
                "guidedFixPrompt": "Type 40"
              }
            }
          }
        }
      },
      {
        "id": "scrm-d20-b2-question-pacing-and-monologues",
        "day": 20,
        "blockNumber": 2,
        "title": "Question Pacing & Maximum Monologue Length (< 90 Seconds)",
        "conceptBudget": {
          "primaryConcept": "Monologue Length Invariant",
          "supportingTerms": [
            "Maximum Monologue Length: Sales rep speech should never exceed 90 seconds consecutively without asking an engaging check-in question ('Does that match how your team operates?')"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d20-b1-talk-to-listen-ratio-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Pacing Guidelines",
            "codeSnippet": "// < 90 Seconds: Conversational dialog (Prospect stays engaged)\n// > 3 Minutes:    Lecture fatigue (Prospect checks email while rep talks)",
            "lineNotes": {
              "1": "Engaged interactive dialogue.",
              "2": "Customer disengagement trap."
            }
          },
          {
            "type": "runnable_code",
            "filename": "monologue_demo.js",
            "initialCode": "function evaluateMonologue(durationSec) {\n  return durationSec <= 90\n    ? 'OPTIMAL_PITCH_LENGTH'\n    : 'MONOLOGUE_TOO_LONG_INSERT_ENGAGEMENT_QUESTION';\n}\n\nconsole.log(evaluateMonologue(60));\nconsole.log(evaluateMonologue(180));",
            "expectedOutput": "OPTIMAL_PITCH_LENGTH\nMONOLOGUE_TOO_LONG_INSERT_ENGAGEMENT_QUESTION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the maximum recommended consecutive monologue duration in seconds for a sales rep during a discovery or demo call?",
          "expectedStringOutput": "90",
          "acceptableAnswers": [
            "90",
            "90 seconds",
            "90s"
          ],
          "primaryMisconceptionId": "MC_SCRM_PERFORMANCE_COACHING_TALK_RATIO",
          "diagnosisMap": {
            "300": {
              "misconceptionId": "MC_SCRM_PERFORMANCE_COACHING_TALK_RATIO",
              "errorExplanation": "5 minutes is far too long. The benchmark ceiling is 90 seconds.",
              "recoveryPath": {
                "simplerExplanation": "Maximum monologue length is 90 seconds.",
                "guidedFixPrompt": "Type 90"
              }
            }
          }
        }
      },
      {
        "id": "scrm-d20-b3-deal-inspection-pipeline-reviews",
        "day": 20,
        "blockNumber": 3,
        "title": "1-on-1 Deal Inspection: Pressure-Testing Next Steps & Paperwork",
        "conceptBudget": {
          "primaryConcept": "Deal Inspection Invariant",
          "supportingTerms": [
            "Sales Manager Deal Inspection (Asking: 'Who owns the signature? When was the last time the Economic Buyer spoke? What is the verified next date on the MAP?')"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d20-b2-question-pacing-and-monologues",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "inspection_demo.js",
            "initialCode": "function inspectDealHealth(hasSignedMap, hasNextMeetingScheduled) {\n  return (hasSignedMap && hasNextMeetingScheduled)\n    ? 'DEAL_VERIFIED_STRONG_CLOSE_PROBABILITY'\n    : 'DEAL_AT_RISK_LACKS_CONCRETE_NEXT_STEP';\n}\n\nconsole.log(inspectDealHealth(true, true));",
            "expectedOutput": "DEAL_VERIFIED_STRONG_CLOSE_PROBABILITY",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What inspection status is assigned to an opportunity possessing both a verified Mutual Action Plan and an agreed next calendar meeting?",
          "expectedStringOutput": "DEAL_VERIFIED_STRONG_CLOSE_PROBABILITY",
          "acceptableAnswers": [
            "DEAL_VERIFIED_STRONG_CLOSE_PROBABILITY",
            "Strong close probability",
            "Deal verified"
          ],
          "primaryMisconceptionId": "MC_SCRM_PERFORMANCE_COACHING_TALK_RATIO",
          "diagnosisMap": {
            "AT_RISK": {
              "misconceptionId": "MC_SCRM_PERFORMANCE_COACHING_TALK_RATIO",
              "errorExplanation": "Possessing a signed MAP and next meeting confirms DEAL_VERIFIED_STRONG_CLOSE_PROBABILITY.",
              "recoveryPath": {
                "simplerExplanation": "Matches DEAL_VERIFIED_STRONG_CLOSE_PROBABILITY.",
                "guidedFixPrompt": "Type DEAL_VERIFIED_STRONG_CLOSE_PROBABILITY"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 21,
    "title": "⭐ MILESTONE 3: Complete CRM Architecture, Routing, Enablement & Compensation Engine",
    "overviewMetaphor": "Milestone 3 Synthesis: The complete sovereign revenue operations, CRM architecture, enablement, and compensation engine: 1. Clean CRM lead deduplication; 2. Round-robin automated lead routing ($ge 70$ points); 3. Competitive battlecards; 4. OTE compensation with 1.5x accelerators ($230,000$ payout on 120% quota); 5. Gong conversational intelligence coaching ($40.0\\%$ talk ratio).",
    "blocks": [
      {
        "id": "scrm-d21-b1-sales-ops-master-synthesis",
        "day": 21,
        "blockNumber": 1,
        "title": "Sales Operations & RevOps Master Engine Synthesis",
        "conceptBudget": {
          "primaryConcept": "Sales Operations Master Engine Synthesis",
          "supportingTerms": [
            "CRM Architecture Engine",
            "Lead Scoring Routing Engine",
            "Battlecard Enablement Engine",
            "Compensation Accelerator Engine",
            "Conversational Intelligence Engine"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d20-b3-deal-inspection-pipeline-reviews",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Milestone 3 Sales Operations & RevOps Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "Deduplicates incoming leads and normalizes contact records",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Routes 75-point SQLs instantly via round-robin assignment",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Arms reps with battlecards and calculates $230k accelerated OTE",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Enforces 40% Gong talk ratio and certifies Sales Ops master engine!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "sales_ops_kernel_demo.js",
            "initialCode": "function runSalesOpsEngine() {\n  return {\n    crmSubsystem: 'ONLINE_DEDUP_ACTIVE',\n    routingSubsystem: 'ONLINE_ROUND_ROBIN_ACTIVE',\n    battlecardSubsystem: 'ONLINE_BATTLECARDS_ACTIVE',\n    oteSubsystem: 'ONLINE_1_5X_ACCELERATOR_ACTIVE',\n    coachingSubsystem: 'ONLINE_40_PERCENT_TALK_ACTIVE',\n    engineStatus: 'SALES_OPERATIONS_AND_REVOPS_MASTER_ACTIVE'\n  };\n}\n\nconsole.log(runSalesOpsEngine().engineStatus);",
            "expectedOutput": "SALES_OPERATIONS_AND_REVOPS_MASTER_ACTIVE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What engine status confirms active operational synthesis of the Sales Operations & RevOps Master Engine?",
          "expectedStringOutput": "SALES_OPERATIONS_AND_REVOPS_MASTER_ACTIVE",
          "acceptableAnswers": [
            "SALES_OPERATIONS_AND_REVOPS_MASTER_ACTIVE",
            "engineStatus: SALES_OPERATIONS_AND_REVOPS_MASTER_ACTIVE"
          ],
          "primaryMisconceptionId": "MC_SCRM_CRM_OBJECT_ARCHITECTURE_HYGIENE",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_SCRM_CRM_OBJECT_ARCHITECTURE_HYGIENE",
              "errorExplanation": "Matches SALES_OPERATIONS_AND_REVOPS_MASTER_ACTIVE.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type SALES_OPERATIONS_AND_REVOPS_MASTER_ACTIVE"
              }
            }
          }
        }
      },
      {
        "id": "scrm-d21-b2-sales-ops-engine-audit",
        "day": 21,
        "blockNumber": 2,
        "title": "Sales Operations Engine Invariant Verification & Precision Audit",
        "conceptBudget": {
          "primaryConcept": "Sales Ops Invariant Verification",
          "supportingTerms": [
            "CRM Invariant",
            "Routing Invariant",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d21-b1-sales-ops-master-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "sales_ops_audit_demo.js",
            "initialCode": "function auditSalesOpsEngine(crmValid, routeValid, battleValid, oteValid, talkValid) {\n  const passed = crmValid && routeValid && battleValid && oteValid && talkValid;\n  return {\n    crmVerified: crmValid,\n    routingVerified: routeValid,\n    battlecardVerified: battleValid,\n    oteVerified: oteValid,\n    coachingVerified: talkValid,\n    grade: passed ? 'SALES_OPS_ENGINE_AUDIT_PASSED' : 'AUDIT_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditSalesOpsEngine(true, true, true, true, true)));",
            "expectedOutput": "{\"crmVerified\":true,\"routingVerified\":true,\"battlecardVerified\":true,\"oteVerified\":true,\"coachingVerified\":true,\"grade\":\"SALES_OPS_ENGINE_AUDIT_PASSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade is awarded when CRM, Routing, Battlecard, OTE, and Coaching engines pass 100%?",
          "expectedStringOutput": "SALES_OPS_ENGINE_AUDIT_PASSED",
          "acceptableAnswers": [
            "SALES_OPS_ENGINE_AUDIT_PASSED",
            "grade\":\"SALES_OPS_ENGINE_AUDIT_PASSED\""
          ],
          "primaryMisconceptionId": "MC_SCRM_CRM_OBJECT_ARCHITECTURE_HYGIENE",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_SCRM_CRM_OBJECT_ARCHITECTURE_HYGIENE",
              "errorExplanation": "All checks passing awards SALES_OPS_ENGINE_AUDIT_PASSED.",
              "recoveryPath": {
                "simplerExplanation": "Awards SALES_OPS_ENGINE_AUDIT_PASSED.",
                "guidedFixPrompt": "Type SALES_OPS_ENGINE_AUDIT_PASSED"
              }
            }
          }
        }
      },
      {
        "id": "scrm-d21-b3-milestone3-scrm-cert",
        "day": 21,
        "blockNumber": 3,
        "title": "Milestone 3 Sales Operations & RevOps Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 3 Certification",
          "supportingTerms": [
            "Sales Operations Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d21-b2-sales-ops-engine-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone3_scrm_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 3: Complete CRM Architecture, Routing, Enablement & Compensation Engine [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 3: Complete CRM Architecture, Routing, Enablement & Compensation Engine [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 3 completion?",
          "expectedStringOutput": "⭐ MILESTONE 3: Complete CRM Architecture, Routing, Enablement & Compensation Engine [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 3: Complete CRM Architecture, Routing, Enablement & Compensation Engine [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_SCRM_CRM_OBJECT_ARCHITECTURE_HYGIENE",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_SCRM_CRM_OBJECT_ARCHITECTURE_HYGIENE",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 3: Complete CRM Architecture, Routing, Enablement & Compensation Engine [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 22,
    "title": "Territory Design, Account Segmentation & Hunter vs Farmer Models",
    "overviewMetaphor": "Territory Design is Partitioning Farmland to Ensure Every Farmer Has Rich Soil to Harvest: If an enterprise SaaS company identifies 600 target named accounts across 6 Account Executives, TAM-balanced territory carving allocates exactly 100 accounts per rep ($600 / 6 = 100$); keeping account loads between 50 and 150 accounts ensures Hunter reps have enough whitespace to hit quota while preventing neglected accounts.",
    "blocks": [
      {
        "id": "scrm-d22-b1-territory-balancing-calculation",
        "day": 22,
        "blockNumber": 1,
        "title": "TAM-Balanced Territory Carving: $\\text{Accounts per Rep} = \\lfloor \\frac{\\text{Total Enterprise Accounts}}{\\text{Sales Reps}} \\rfloor$",
        "conceptBudget": {
          "primaryConcept": "Territory Balance Formula",
          "supportingTerms": [
            "Total Enterprise Accounts ($600$)",
            "Sales Reps ($6$)",
            "Accounts per Rep = $\\frac{600}{6} = 100$ accounts",
            "Balanced Capacity Range: $50 - 150$ accounts per enterprise Account Executive"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d21-b1-sales-ops-master-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Territory Carving Ledger (600 Accounts / 6 Reps)",
              "boxes": [
                {
                  "label": "Total TAM Accounts",
                  "value": "600 Qualified Enterprise Accounts in Target Geography",
                  "varType": "TAM Accounts",
                  "isUpdated": false
                },
                {
                  "label": "Account Executive Pool",
                  "value": "6 Full-Time Enterprise Account Executives (Hunters)",
                  "varType": "AEs",
                  "isUpdated": false
                },
                {
                  "label": "Accounts per Territory",
                  "value": "600 / 6 = 100 ACCOUNTS PER REP (PERFECTLY BALANCED IN 50-150 RANGE!)",
                  "varType": "Allocation",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "territory_calc_demo.js",
            "initialCode": "function balanceTerritories(accounts, reps) {\n  const perRep = Math.floor(accounts / reps);\n  const isBalanced = perRep >= 50 && perRep <= 150;\n  return {\n    accounts,\n    reps,\n    perRep,\n    isBalanced,\n    status: 'TERRITORY_BALANCED'\n  };\n}\n\nconsole.log(JSON.stringify(balanceTerritories(600, 6)));",
            "expectedOutput": "{\"accounts\":600,\"reps\":6,\"perRep\":100,\"isBalanced\":true,\"status\":\"TERRITORY_BALANCED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many target enterprise accounts are allocated to each Account Executive when carving a balanced territory of 600 accounts among 6 reps ($600 / 6$)?",
          "expectedStringOutput": "100",
          "acceptableAnswers": [
            "100",
            "100 accounts",
            "perRep\":100"
          ],
          "primaryMisconceptionId": "MC_SCRM_TERRITORY_DESIGN_ACCOUNT_SEGMENTATION",
          "diagnosisMap": {
            "60": {
              "misconceptionId": "MC_SCRM_TERRITORY_DESIGN_ACCOUNT_SEGMENTATION",
              "errorExplanation": "600 / 6 = 100 accounts per rep.",
              "recoveryPath": {
                "simplerExplanation": "600 / 6 = 100.",
                "guidedFixPrompt": "Type 100"
              }
            }
          }
        }
      },
      {
        "id": "scrm-d22-b2-hunter-vs-farmer-specialization",
        "day": 22,
        "blockNumber": 2,
        "title": "Hunter (Account Executive) vs Farmer (Account Manager / CSM) Specialization",
        "conceptBudget": {
          "primaryConcept": "Hunter vs Farmer Sales Roles",
          "supportingTerms": [
            "Hunter (Account Executive: 100% focused on outbound prospecting, discovery, demo, and landing new logos)",
            "Farmer (Account Manager / CSM: 100% focused on onboarding, retention, and expanding existing accounts)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d22-b1-territory-balancing-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Sales Role Specialization",
            "codeSnippet": "// HUNTER (AE):  Compensated on New Logo ARR (Aggressive cold outreach & closing)\n// FARMER (AM):  Compensated on NRR & Renewal Rate (Deep relationship cultivation & upsells)",
            "lineNotes": {
              "1": "New business acquisition.",
              "2": "Expansion and retention."
            }
          },
          {
            "type": "runnable_code",
            "filename": "hunter_farmer_demo.js",
            "initialCode": "function getRoleResponsibility(roleType) {\n  return roleType === 'HUNTER'\n    ? 'NEW_LOGO_ACQUISITION_AND_FIRST_CONTRACT_CLOSING'\n    : 'EXISTING_CUSTOMER_EXPANSION_AND_RENEWAL_RETENTION';\n}\n\nconsole.log(getRoleResponsibility('HUNTER'));\nconsole.log(getRoleResponsibility('FARMER'));",
            "expectedOutput": "NEW_LOGO_ACQUISITION_AND_FIRST_CONTRACT_CLOSING\nEXISTING_CUSTOMER_EXPANSION_AND_RENEWAL_RETENTION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What core revenue objective defines the role of an Account Executive operating in a specialized Hunter capacity?",
          "expectedStringOutput": "NEW_LOGO_ACQUISITION_AND_FIRST_CONTRACT_CLOSING",
          "acceptableAnswers": [
            "NEW_LOGO_ACQUISITION_AND_FIRST_CONTRACT_CLOSING",
            "New Logo Acquisition",
            "New Business"
          ],
          "primaryMisconceptionId": "MC_SCRM_TERRITORY_DESIGN_ACCOUNT_SEGMENTATION",
          "diagnosisMap": {
            "RENEWALS": {
              "misconceptionId": "MC_SCRM_TERRITORY_DESIGN_ACCOUNT_SEGMENTATION",
              "errorExplanation": "Renewals are handled by Farmers. Hunters focus on NEW_LOGO_ACQUISITION_AND_FIRST_CONTRACT_CLOSING.",
              "recoveryPath": {
                "simplerExplanation": "Matches NEW_LOGO_ACQUISITION_AND_FIRST_CONTRACT_CLOSING.",
                "guidedFixPrompt": "Type NEW_LOGO_ACQUISITION_AND_FIRST_CONTRACT_CLOSING"
              }
            }
          }
        }
      },
      {
        "id": "scrm-d22-b3-sales-pod-structure",
        "day": 22,
        "blockNumber": 3,
        "title": "The Sales Pod Organizational Architecture (SDR + AE + CSM)",
        "conceptBudget": {
          "primaryConcept": "Sales Pod Structure",
          "supportingTerms": [
            "1 Sales Pod = 2 SDRs (Prospecting) + 1 AE (Closing) + 1 CSM (Retention & Onboarding)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d22-b2-hunter-vs-farmer-specialization",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "sales_pod_demo.js",
            "initialCode": "function getSalesPodRoles() {\n  return ['SALES_DEVELOPMENT_REPRESENTATIVE_SDR', 'ACCOUNT_EXECUTIVE_AE', 'CUSTOMER_SUCCESS_MANAGER_CSM'];\n}\n\nconsole.log(JSON.stringify(getSalesPodRoles()));",
            "expectedOutput": "[\"SALES_DEVELOPMENT_REPRESENTATIVE_SDR\",\"ACCOUNT_EXECUTIVE_AE\",\"CUSTOMER_SUCCESS_MANAGER_CSM\"]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which 3 core specialized roles constitute an autonomous enterprise Sales Pod revenue engine?",
          "expectedStringOutput": "[\"SALES_DEVELOPMENT_REPRESENTATIVE_SDR\",\"ACCOUNT_EXECUTIVE_AE\",\"CUSTOMER_SUCCESS_MANAGER_CSM\"]",
          "acceptableAnswers": [
            "[\"SALES_DEVELOPMENT_REPRESENTATIVE_SDR\",\"ACCOUNT_EXECUTIVE_AE\",\"CUSTOMER_SUCCESS_MANAGER_CSM\"]",
            "SDR, AE, CSM"
          ],
          "primaryMisconceptionId": "MC_SCRM_TERRITORY_DESIGN_ACCOUNT_SEGMENTATION",
          "diagnosisMap": {
            "WRONG": {
              "misconceptionId": "MC_SCRM_TERRITORY_DESIGN_ACCOUNT_SEGMENTATION",
              "errorExplanation": "Matches full JSON array of SDR, AE, and CSM roles.",
              "recoveryPath": {
                "simplerExplanation": "Pod includes SDR, AE, and CSM.",
                "guidedFixPrompt": "Type [\"SALES_DEVELOPMENT_REPRESENTATIVE_SDR\",\"ACCOUNT_EXECUTIVE_AE\",\"CUSTOMER_SUCCESS_MANAGER_CSM\"]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 23,
    "title": "Channel Sales & Partner Ecosystems: VARs, SIs & Deal Registration",
    "overviewMetaphor": "Deal Registration is an Official Land Registry Title Deed in Channel Sales: When a certified Value-Added Reseller (VAR) discovers and registers a $100,000 enterprise opportunity within 30 days, the partner portal locks the deal and protects a 20% margin ($100,000 \\times 0.20 = \\$20,000$); this prevents the software company's direct sales team from poaching the deal, fostering immense partner loyalty and ecosystem scaling.",
    "blocks": [
      {
        "id": "scrm-d23-b1-partner-deal-registration-margin",
        "day": 23,
        "blockNumber": 1,
        "title": "Deal Registration & Partner Margin Protection ($20,000 Margin at 20% Split)",
        "conceptBudget": {
          "primaryConcept": "Deal Registration Protection Formula",
          "supportingTerms": [
            "Registered Deal Value ($100,000.00$)",
            "Partner Margin Discount ($20.0\\%$)",
            "Partner Profit Margin = $100,000 \\times 0.20 = \\$20,000.00$",
            "Channel Status: Registered $\\implies$ Channel Locked & Protected; Unregistered $\\implies$ Open to Direct Sales"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d22-b1-territory-balancing-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Channel Sales Deal Registration Ledger ($100k Deal @ 20% Margin)",
              "boxes": [
                {
                  "label": "Partner Enterprise Deal",
                  "value": "$100,000.00 Contract Value Registered in Partner Portal",
                  "varType": "Deal Value",
                  "isUpdated": false
                },
                {
                  "label": "Partner Margin (20%)",
                  "value": "$100,000 x 20% = $20,000.00 Guaranteed Partner Margin",
                  "varType": "Margin",
                  "isUpdated": false
                },
                {
                  "label": "Channel Conflict Status",
                  "value": "DEAL REGISTERED -> CHANNEL LOCKED PARTNER PROTECTED!",
                  "varType": "Status",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "deal_reg_calc_demo.js",
            "initialCode": "function evaluateDealReg(isRegistered, dealVal, discountPct) {\n  const margin = isRegistered ? dealVal * (discountPct / 100) : 0;\n  return {\n    dealVal,\n    partnerMargin: margin,\n    isProtected: isRegistered,\n    channelStatus: isRegistered ? 'CHANNEL_LOCKED_PARTNER_PROTECTED' : 'OPEN_TO_DIRECT_SALES',\n    status: 'REGISTRATION_EVALUATED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateDealReg(true, 100000, 20)));\nconsole.log(JSON.stringify(evaluateDealReg(false, 100000, 20)));",
            "expectedOutput": "{\"dealVal\":100000,\"partnerMargin\":20000,\"isProtected\":true,\"channelStatus\":\"CHANNEL_LOCKED_PARTNER_PROTECTED\",\"status\":\"REGISTRATION_EVALUATED\"}\n{\"dealVal\":100000,\"partnerMargin\":0,\"isProtected\":false,\"channelStatus\":\"OPEN_TO_DIRECT_SALES\",\"status\":\"REGISTRATION_EVALUATED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the guaranteed partner margin in dollars when a registered VAR partner closes a $100,000 deal with an approved 20% channel discount ($100,000 \\times 0.20$)?",
          "expectedStringOutput": "20000",
          "acceptableAnswers": [
            "20000",
            "$20,000",
            "20,000",
            "partnerMargin\":20000"
          ],
          "primaryMisconceptionId": "MC_SCRM_CHANNEL_SALES_PARTNER_ECOSYSTEMS",
          "diagnosisMap": {
            "80000": {
              "misconceptionId": "MC_SCRM_CHANNEL_SALES_PARTNER_ECOSYSTEMS",
              "errorExplanation": "80,000 is the net software license remittance to vendor. The partner margin is $20,000.",
              "recoveryPath": {
                "simplerExplanation": "100,000 * 0.20 = 20,000.",
                "guidedFixPrompt": "Type 20000"
              }
            }
          }
        }
      },
      {
        "id": "scrm-d23-b2-partner-ecosystem-tiers",
        "day": 23,
        "blockNumber": 2,
        "title": "Partner Ecosystem Tiers: VARs, GSIs (Accenture/Deloitte) & ISV Alliances",
        "conceptBudget": {
          "primaryConcept": "Partner Tier Hierarchy",
          "supportingTerms": [
            "VAR (Value-Added Reseller: Resells licenses with localized setup)",
            "GSI (Global System Integrator: Accenture, Deloitte deploying multi-million dollar digital transformations)",
            "ISV Alliances (Independent Software Vendors co-selling integrations on Salesforce AppExchange or AWS Marketplace)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d23-b1-partner-deal-registration-margin",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Channel Partner Types",
            "codeSnippet": "// 1. VAR: Reseller adding localized deployment services\n// 2. GSI: Large consultancies leading enterprise digital transformation\n// 3. ISV: Tech alliance partners co-selling API marketplace integrations",
            "lineNotes": {
              "1": "Regional reselling.",
              "2": "Enterprise scale.",
              "3": "Ecosystem integration."
            }
          },
          {
            "type": "runnable_code",
            "filename": "partner_types_demo.js",
            "initialCode": "function getPartnerTierName(tier) {\n  return tier === 'GSI'\n    ? 'GLOBAL_SYSTEM_INTEGRATOR_ACCENTURE_DELOITTE'\n    : 'VALUE_ADDED_RESELLER_VAR';\n}\n\nconsole.log(getPartnerTierName('GSI'));",
            "expectedOutput": "GLOBAL_SYSTEM_INTEGRATOR_ACCENTURE_DELOITTE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which channel partner category describes global consultancies such as Accenture, Deloitte, and PwC that implement massive digital transformation projects?",
          "expectedStringOutput": "GLOBAL_SYSTEM_INTEGRATOR_ACCENTURE_DELOITTE",
          "acceptableAnswers": [
            "GLOBAL_SYSTEM_INTEGRATOR_ACCENTURE_DELOITTE",
            "GSI",
            "Global System Integrator"
          ],
          "primaryMisconceptionId": "MC_SCRM_CHANNEL_SALES_PARTNER_ECOSYSTEMS",
          "diagnosisMap": {
            "VAR": {
              "misconceptionId": "MC_SCRM_CHANNEL_SALES_PARTNER_ECOSYSTEMS",
              "errorExplanation": "VARs are smaller regional resellers. Large consultancies are GSIs: GLOBAL_SYSTEM_INTEGRATOR_ACCENTURE_DELOITTE.",
              "recoveryPath": {
                "simplerExplanation": "Matches GLOBAL_SYSTEM_INTEGRATOR_ACCENTURE_DELOITTE.",
                "guidedFixPrompt": "Type GLOBAL_SYSTEM_INTEGRATOR_ACCENTURE_DELOITTE"
              }
            }
          }
        }
      },
      {
        "id": "scrm-d23-b3-co-selling-gtm-motion",
        "day": 23,
        "blockNumber": 3,
        "title": "Co-Selling GTM: Account Mapping on Crossbeam",
        "conceptBudget": {
          "primaryConcept": "Co-Selling GTM Mechanics",
          "supportingTerms": [
            "Crossbeam Account Mapping (Overlapping customer account lists with partner without sharing private PII to identify mutual warm introductions)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d23-b2-partner-ecosystem-tiers",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "crossbeam_demo.js",
            "initialCode": "function evaluateAccountOverlap(sharedCustomersCount) {\n  return sharedCustomersCount >= 50\n    ? 'HIGH_CO_SELLING_POTENTIAL_LAUNCH_JOINT_CAMPAIGN'\n    : 'INSUFFICIENT_OVERLAP';\n}\n\nconsole.log(evaluateAccountOverlap(75));",
            "expectedOutput": "HIGH_CO_SELLING_POTENTIAL_LAUNCH_JOINT_CAMPAIGN",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What strategic GTM initiative is activated when Crossbeam account mapping identifies 75 overlapping target enterprise accounts with a certified partner?",
          "expectedStringOutput": "HIGH_CO_SELLING_POTENTIAL_LAUNCH_JOINT_CAMPAIGN",
          "acceptableAnswers": [
            "HIGH_CO_SELLING_POTENTIAL_LAUNCH_JOINT_CAMPAIGN",
            "Joint Campaign",
            "Co-selling potential"
          ],
          "primaryMisconceptionId": "MC_SCRM_CHANNEL_SALES_PARTNER_ECOSYSTEMS",
          "diagnosisMap": {
            "INSUFFICIENT": {
              "misconceptionId": "MC_SCRM_CHANNEL_SALES_PARTNER_ECOSYSTEMS",
              "errorExplanation": "75 shared accounts satisfies the >= 50 threshold, activating HIGH_CO_SELLING_POTENTIAL_LAUNCH_JOINT_CAMPAIGN.",
              "recoveryPath": {
                "simplerExplanation": "Matches HIGH_CO_SELLING_POTENTIAL_LAUNCH_JOINT_CAMPAIGN.",
                "guidedFixPrompt": "Type HIGH_CO_SELLING_POTENTIAL_LAUNCH_JOINT_CAMPAIGN"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 24,
    "title": "Sales Contract Management: MSAs, SOWs, Redlines & InfoSec SLAs",
    "overviewMetaphor": "The Contract Closing Highway is an Express Train that Stalls at the Legal Redline Station: An enterprise deal moves at lightning speed until legal redlines and InfoSec security reviews start; maintaining a 24-hour redline turnaround time ($24 \\le 48$ hours) combined with a pre-certified SOC 2 Type II compliance package prevents legal bottlenecks, propelling the contract directly into DocuSign e-signature without quarterly slippage.",
    "blocks": [
      {
        "id": "scrm-d24-b1-legal-redline-turnaround-audit",
        "day": 24,
        "blockNumber": 1,
        "title": "Legal Contract Velocity: Redline Turnaround ($\\text{Hours} \\le 48$ hrs & SOC 2 Approved)",
        "conceptBudget": {
          "primaryConcept": "Contract Velocity Benchmark",
          "supportingTerms": [
            "Legal Redline Turnaround Time ($24$ hours)",
            "SOC 2 Type II Security Clearance (Approved)",
            "Contract Velocity Benchmark: $\\le 48$ hrs $\\implies$ Expedited Ready for E-Signature; $> 72$ hrs $\\implies$ Legal Bottleneck"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d23-b1-partner-deal-registration-margin",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Enterprise Contract Velocity Ledger (24h Redlines, SOC 2 Cleared)",
              "boxes": [
                {
                  "label": "Redline Turnaround",
                  "value": "24 Hours <= 48h Benchmark (Rapid In-House Legal Review)",
                  "varType": "Redline Speed",
                  "isUpdated": false
                },
                {
                  "label": "InfoSec Compliance",
                  "value": "SOC 2 Type II + GDPR Data Processing Addendum (DPA) Approved",
                  "varType": "Security",
                  "isUpdated": false
                },
                {
                  "label": "Closing Readiness",
                  "value": "CONTRACT EXPEDITED READY FOR ESIGNATURE IN DOCUSIGN!",
                  "varType": "Velocity",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "contract_velocity_calc_demo.js",
            "initialCode": "function auditContractSpeed(hours, soc2Approved) {\n  const isFast = hours <= 48 && soc2Approved;\n  return {\n    hours,\n    soc2Approved,\n    isFast,\n    status: isFast ? 'CONTRACT_EXPEDITED_READY_FOR_ESIGNATURE' : 'CONTRACT_BOTTLENECK'\n  };\n}\n\nconsole.log(JSON.stringify(auditContractSpeed(24, true)));\nconsole.log(JSON.stringify(auditContractSpeed(96, true)));",
            "expectedOutput": "{\"hours\":24,\"soc2Approved\":true,\"isFast\":true,\"status\":\"CONTRACT_EXPEDITED_READY_FOR_ESIGNATURE\"}\n{\"hours\":96,\"soc2Approved\":true,\"isFast\":false,\"status\":\"CONTRACT_BOTTLENECK\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What contract readiness status is achieved when legal redlines are completed in 24 hours with pre-approved SOC 2 Type II compliance ($24 \\le 48$ hours)?",
          "expectedStringOutput": "CONTRACT_EXPEDITED_READY_FOR_ESIGNATURE",
          "acceptableAnswers": [
            "CONTRACT_EXPEDITED_READY_FOR_ESIGNATURE",
            "Ready for e-signature",
            "Expedited"
          ],
          "primaryMisconceptionId": "MC_SCRM_CONTRACT_MANAGEMENT_MSA_REDLINES",
          "diagnosisMap": {
            "BOTTLENECK": {
              "misconceptionId": "MC_SCRM_CONTRACT_MANAGEMENT_MSA_REDLINES",
              "errorExplanation": "24 hours is rapid, awarding CONTRACT_EXPEDITED_READY_FOR_ESIGNATURE.",
              "recoveryPath": {
                "simplerExplanation": "Matches CONTRACT_EXPEDITED_READY_FOR_ESIGNATURE.",
                "guidedFixPrompt": "Type CONTRACT_EXPEDITED_READY_FOR_ESIGNATURE"
              }
            }
          }
        }
      },
      {
        "id": "scrm-d24-b2-msa-vs-sow-vs-order-form",
        "day": 24,
        "blockNumber": 2,
        "title": "Contract Architecture: Master Services Agreement (MSA) vs Statement of Work (SOW)",
        "conceptBudget": {
          "primaryConcept": "Contract Document Hierarchy",
          "supportingTerms": [
            "MSA (Master Services Agreement: Umbrella legal terms governing liability, indemnification, intellectual property, and warranties)",
            "SOW (Statement of Work: Specific implementation scope, timelines, deliverables)",
            "Order Form (Pricing, seat counts, payment terms e.g. Net 30)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d24-b1-legal-redline-turnaround-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Contract Document Hierarchy",
            "codeSnippet": "// 1. MASTER SERVICES AGREEMENT (MSA): Governs legal liability & terms (Negotiated once)\n// 2. ORDER FORM:                      Governs annual license fees & user tier (Renewed annually)\n// 3. STATEMENT OF WORK (SOW):         Governs custom onboarding milestones (Executed once)",
            "lineNotes": {
              "1": "Umbrella legal framework.",
              "2": "Commercial pricing document.",
              "3": "Professional services scope."
            }
          },
          {
            "type": "runnable_code",
            "filename": "contract_docs_demo.js",
            "initialCode": "function getUmbrellaLegalContractName() {\n  return 'MASTER_SERVICES_AGREEMENT_MSA';\n}\n\nconsole.log(getUmbrellaLegalContractName());",
            "expectedOutput": "MASTER_SERVICES_AGREEMENT_MSA",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which umbrella legal agreement establishes core commercial terms regarding intellectual property, indemnification, and liability limits?",
          "expectedStringOutput": "MASTER_SERVICES_AGREEMENT_MSA",
          "acceptableAnswers": [
            "MASTER_SERVICES_AGREEMENT_MSA",
            "MSA",
            "Master Services Agreement"
          ],
          "primaryMisconceptionId": "MC_SCRM_CONTRACT_MANAGEMENT_MSA_REDLINES",
          "diagnosisMap": {
            "SOW": {
              "misconceptionId": "MC_SCRM_CONTRACT_MANAGEMENT_MSA_REDLINES",
              "errorExplanation": "SOW covers project scope. Umbrella terms are established in the MASTER_SERVICES_AGREEMENT_MSA.",
              "recoveryPath": {
                "simplerExplanation": "Matches MASTER_SERVICES_AGREEMENT_MSA.",
                "guidedFixPrompt": "Type MASTER_SERVICES_AGREEMENT_MSA"
              }
            }
          }
        }
      },
      {
        "id": "scrm-d24-b3-infosec-security-questionnaires",
        "day": 24,
        "blockNumber": 3,
        "title": "InfoSec Security Questionnaires & Standardized Compliance Packages",
        "conceptBudget": {
          "primaryConcept": "InfoSec Fast-Tracking",
          "supportingTerms": [
            "Standardized Security Packet (SOC 2 Type II report, ISO 27001 cert, Pen test executive summary, GDPR DPA) to bypass 200-question spreadsheets"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d24-b2-msa-vs-sow-vs-order-form",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "infosec_packet_demo.js",
            "initialCode": "function getSecurityCertificationPackage() {\n  return 'SOC_2_TYPE_II_AND_ISO_27001_CERTIFIED';\n}\n\nconsole.log(getSecurityCertificationPackage());",
            "expectedOutput": "SOC_2_TYPE_II_AND_ISO_27001_CERTIFIED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What gold-standard cloud security audit certification report is required to pass enterprise enterprise InfoSec vendor assessments?",
          "expectedStringOutput": "SOC_2_TYPE_II_AND_ISO_27001_CERTIFIED",
          "acceptableAnswers": [
            "SOC_2_TYPE_II_AND_ISO_27001_CERTIFIED",
            "SOC 2 Type II",
            "SOC 2"
          ],
          "primaryMisconceptionId": "MC_SCRM_CONTRACT_MANAGEMENT_MSA_REDLINES",
          "diagnosisMap": {
            "SELF_ASSESSMENT": {
              "misconceptionId": "MC_SCRM_CONTRACT_MANAGEMENT_MSA_REDLINES",
              "errorExplanation": "Self assessments fail enterprise scrutiny. SOC_2_TYPE_II_AND_ISO_27001_CERTIFIED is required.",
              "recoveryPath": {
                "simplerExplanation": "Matches SOC_2_TYPE_II_AND_ISO_27001_CERTIFIED.",
                "guidedFixPrompt": "Type SOC_2_TYPE_II_AND_ISO_27001_CERTIFIED"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 25,
    "title": "Executive Business Reviews (QBRs) & Value Realization Reporting",
    "overviewMetaphor": "A QBR is an Executive Dividend Presentation on Customer Value: When meeting the VP of Finance and Economic Buyer, delivering $120,000 in verified cost savings against a $100,000 target ($120k / 100k = 120.0\\%$ Value Delivery) with the Executive Sponsor in attendance mathematically proves your product's ROI; this turns an anxiety-ridden contract renewal negotiation into an immediate multi-year expansion commitment.",
    "blocks": [
      {
        "id": "scrm-d25-b1-qbr-value-delivery-renewal-readiness",
        "day": 25,
        "blockNumber": 1,
        "title": "QBR Value Realization: $\\text{Value Delivery}\\% = \\frac{\\text{Delivered Savings}}{\\text{Target Savings}} \\times 100\\% \\ge 100.0\\%$",
        "conceptBudget": {
          "primaryConcept": "QBR Value Realization Formula",
          "supportingTerms": [
            "Delivered Customer Savings ($120,000.00$)",
            "Target Business Goal ($100,000.00$)",
            "Value Delivery = $\\frac{120,000}{100,000} \\times 100\\% = 120.0\\%$",
            "Executive Sponsor Attended: True",
            "Renewal Confidence: High Confidence Renewal & Expansion Secured"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d24-b1-legal-redline-turnaround-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "QBR Value Realization Ledger ($120k Delivered vs $100k Target)",
              "boxes": [
                {
                  "label": "Agreed Business Goal",
                  "value": "$100,000.00 Target Cost Reduction from Initial Business Case",
                  "varType": "Target",
                  "isUpdated": false
                },
                {
                  "label": "Actual Verified Value",
                  "value": "$120,000.00 Delivered (120.0% OF TARGET EXCEEDED!)",
                  "varType": "Delivered",
                  "isUpdated": false
                },
                {
                  "label": "Renewal Probability",
                  "value": "Exec Sponsor Present -> HIGH CONFIDENCE RENEWAL EXPANSION SECURED!",
                  "varType": "Outcome",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "qbr_calc_demo.js",
            "initialCode": "function evaluateQbr(delivered, target, execAttended) {\n  const pct = (delivered / target) * 100;\n  const isReady = pct >= 100 && execAttended;\n  return {\n    delivered,\n    target,\n    valueDeliveryPct: Number(pct.toFixed(1)),\n    isReady,\n    status: isReady ? 'HIGH_CONFIDENCE_RENEWAL_EXPANSION_SECURED' : 'VALUE_GAP'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateQbr(120000, 100000, true)));\nconsole.log(JSON.stringify(evaluateQbr(80000, 100000, true)));",
            "expectedOutput": "{\"delivered\":120000,\"target\":100000,\"valueDeliveryPct\":120,\"isReady\":true,\"status\":\"HIGH_CONFIDENCE_RENEWAL_EXPANSION_SECURED\"}\n{\"delivered\":80000,\"target\":100000,\"valueDeliveryPct\":80,\"isReady\":false,\"status\":\"VALUE_GAP\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the value delivery realization percentage when a CSM demonstrates $120,000 in delivered cost savings against a $100,000 customer goal ($ (120,000 / 100,000) \\times 100 $)?",
          "expectedStringOutput": "120",
          "acceptableAnswers": [
            "120",
            "120%",
            "120.0",
            "valueDeliveryPct\":120"
          ],
          "primaryMisconceptionId": "MC_SCRM_QBR_VALUE_REALIZATION_REPORTING",
          "diagnosisMap": {
            "20": {
              "misconceptionId": "MC_SCRM_QBR_VALUE_REALIZATION_REPORTING",
              "errorExplanation": "20% is excess above target. Total value delivery is 120.0%.",
              "recoveryPath": {
                "simplerExplanation": "120,000 / 100,000 * 100 = 120%.",
                "guidedFixPrompt": "Type 120"
              }
            }
          }
        }
      },
      {
        "id": "scrm-d25-b2-qbr-agenda-architecture",
        "day": 25,
        "blockNumber": 2,
        "title": "The Strategic QBR Deck: Backward Looking (20%) vs Forward Looking (80%)",
        "conceptBudget": {
          "primaryConcept": "QBR Structure Architecture",
          "supportingTerms": [
            "20% Time: Review past quarter metrics & ROI realization",
            "80% Time: Align on customer's strategic priorities for next 12 months & product roadmap"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d25-b1-qbr-value-delivery-renewal-readiness",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "QBR Time Allocation",
            "codeSnippet": "// ❌ AMATEUR QBR: 45 minutes showing support ticket charts (Boring log)\n// ✅ EXECUTIVE QBR: 10 min ROI review -> 35 min mapping customer strategic business initiatives",
            "lineNotes": {
              "1": "Operational support dump.",
              "2": "Strategic executive partnership."
            }
          },
          {
            "type": "runnable_code",
            "filename": "qbr_agenda_demo.js",
            "initialCode": "function getQbrForwardLookingSplit() {\n  return 'EIGHTY_PERCENT_STRATEGIC_FORWARD_LOOKING_ALIGNMENT';\n}\n\nconsole.log(getQbrForwardLookingSplit());",
            "expectedOutput": "EIGHTY_PERCENT_STRATEGIC_FORWARD_LOOKING_ALIGNMENT",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What percentage of time during an executive QBR should be dedicated to forward-looking strategic roadmaps and joint planning?",
          "expectedStringOutput": "EIGHTY_PERCENT_STRATEGIC_FORWARD_LOOKING_ALIGNMENT",
          "acceptableAnswers": [
            "EIGHTY_PERCENT_STRATEGIC_FORWARD_LOOKING_ALIGNMENT",
            "80%",
            "80 percent"
          ],
          "primaryMisconceptionId": "MC_SCRM_QBR_VALUE_REALIZATION_REPORTING",
          "diagnosisMap": {
            "20%": {
              "misconceptionId": "MC_SCRM_QBR_VALUE_REALIZATION_REPORTING",
              "errorExplanation": "20% is for historical metrics. 80% is forward looking.",
              "recoveryPath": {
                "simplerExplanation": "Matches EIGHTY_PERCENT_STRATEGIC_FORWARD_LOOKING_ALIGNMENT.",
                "guidedFixPrompt": "Type EIGHTY_PERCENT_STRATEGIC_FORWARD_LOOKING_ALIGNMENT"
              }
            }
          }
        }
      },
      {
        "id": "scrm-d25-b3-ninety-day-renewal-lockin",
        "day": 25,
        "blockNumber": 3,
        "title": "The 90-Day Renewal Lock-In: Securing Commitments Before Expiry",
        "conceptBudget": {
          "primaryConcept": "Renewal Lock-In Rule",
          "supportingTerms": [
            "Never discuss renewal in the final 30 days. Locking in mutual renewal terms 90 days in advance prevents budget reallocation"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d25-b2-qbr-agenda-architecture",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "renewal_timeline_demo.js",
            "initialCode": "function getOptimalRenewalInitiationDays() {\n  return 90;\n}\n\nconsole.log(getOptimalRenewalInitiationDays());",
            "expectedOutput": "90",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many days in advance of contract expiration should a Customer Success Manager initiate executive renewal and expansion conversations?",
          "expectedStringOutput": "90",
          "acceptableAnswers": [
            "90",
            "90 days",
            "Ninety"
          ],
          "primaryMisconceptionId": "MC_SCRM_QBR_VALUE_REALIZATION_REPORTING",
          "diagnosisMap": {
            "30": {
              "misconceptionId": "MC_SCRM_QBR_VALUE_REALIZATION_REPORTING",
              "errorExplanation": "30 days is too late. Best practice is 90 days in advance.",
              "recoveryPath": {
                "simplerExplanation": "Standard is 90 days.",
                "guidedFixPrompt": "Type 90"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 26,
    "title": "Outbound Deliverability & Infrastructure: SPF, DKIM, DMARC & Inbox Warming",
    "overviewMetaphor": "Outbound Email Deliverability is a Passport with Holographic Visas: Sending outbound sales emails without SPF, DKIM, and DMARC DNS records is like travelling with a counterfeit passport; Google and Microsoft algorithms will flag your domain as spam and shadowban your emails; configuring strict DNS authentication combined with 21 days of automated inbox warming ($Warm-Up = 21 \\ge 21$ days) guarantees 99% primary inbox placement.",
    "blocks": [
      {
        "id": "scrm-d26-b1-email-dns-authentication-warming-audit",
        "day": 26,
        "blockNumber": 1,
        "title": "Email Deliverability Certification: SPF, DKIM, DMARC & 21-Day Warming",
        "conceptBudget": {
          "primaryConcept": "Email Deliverability Invariant",
          "supportingTerms": [
            "SPF (Sender Policy Framework: Validates sending IP)",
            "DKIM (DomainKeys Identified Mail: Cryptographic signature)",
            "DMARC (Domain-based Message Authentication: Alignment policy)",
            "Inbox Warming (Gradual volume ramp: $\\ge 21$ days before outbound volume)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d25-b1-qbr-value-delivery-renewal-readiness",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Email Deliverability Infrastructure Ledger (SPF, DKIM, DMARC, 21 Days)",
              "boxes": [
                {
                  "label": "DNS Authentication",
                  "value": "SPF TXT Record + DKIM 2048-bit Key + DMARC p=reject Aligned",
                  "varType": "DNS Auth",
                  "isUpdated": false
                },
                {
                  "label": "Inbox Warming Ramp",
                  "value": "21 Days Automated Peer-to-Peer Warm-Up Sequence Completed",
                  "varType": "Warming",
                  "isUpdated": false
                },
                {
                  "label": "Deliverability Status",
                  "value": "DOMAIN AUTHENTICATED READY FOR OUTBOUND SCALE (99% INBOX PLACEMENT!)",
                  "varType": "Deliverability",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "deliverability_calc_demo.js",
            "initialCode": "function auditDeliverability(spf, dkim, dmarc, warmingDays) {\n  const isReady = spf && dkim && dmarc && warmingDays >= 21;\n  return {\n    spf,\n    dkim,\n    dmarc,\n    warmingDays,\n    isCertified: isReady,\n    status: isReady ? 'DOMAIN_AUTHENTICATED_READY_FOR_OUTBOUND_SCALE' : 'DELIVERABILITY_RISK'\n  };\n}\n\nconsole.log(JSON.stringify(auditDeliverability(true, true, true, 21)));\nconsole.log(JSON.stringify(auditDeliverability(true, true, false, 21)));",
            "expectedOutput": "{\"spf\":true,\"dkim\":true,\"dmarc\":true,\"warmingDays\":21,\"isCertified\":true,\"status\":\"DOMAIN_AUTHENTICATED_READY_FOR_OUTBOUND_SCALE\"}\n{\"spf\":true,\"dkim\":true,\"dmarc\":false,\"warmingDays\":21,\"isCertified\":false,\"status\":\"DELIVERABILITY_RISK\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What deliverability status certifies an outbound sales domain that has configured SPF, DKIM, DMARC, and completed 21 days of automated inbox warming?",
          "expectedStringOutput": "DOMAIN_AUTHENTICATED_READY_FOR_OUTBOUND_SCALE",
          "acceptableAnswers": [
            "DOMAIN_AUTHENTICATED_READY_FOR_OUTBOUND_SCALE",
            "Domain Authenticated",
            "Ready for outbound"
          ],
          "primaryMisconceptionId": "MC_SCRM_OUTBOUND_DELIVERABILITY_DMARC_WARMUP",
          "diagnosisMap": {
            "RISK": {
              "misconceptionId": "MC_SCRM_OUTBOUND_DELIVERABILITY_DMARC_WARMUP",
              "errorExplanation": "All DNS records verified plus 21 days warming certifies DOMAIN_AUTHENTICATED_READY_FOR_OUTBOUND_SCALE.",
              "recoveryPath": {
                "simplerExplanation": "Matches DOMAIN_AUTHENTICATED_READY_FOR_OUTBOUND_SCALE.",
                "guidedFixPrompt": "Type DOMAIN_AUTHENTICATED_READY_FOR_OUTBOUND_SCALE"
              }
            }
          }
        }
      },
      {
        "id": "scrm-d26-b2-custom-tracking-domains",
        "day": 26,
        "blockNumber": 2,
        "title": "Secondary Domains & Custom Tracking Domain Architecture",
        "conceptBudget": {
          "primaryConcept": "Secondary Domain Architecture",
          "supportingTerms": [
            "Never send cold outbound emails from your primary domain (e.g. use getcompany.com or companyapp.io) to protect corporate email reputation"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d26-b1-email-dns-authentication-warming-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Outbound Domain Architecture",
            "codeSnippet": "// PRIMARY DOMAIN (acme.com):        Reserved 100% for existing customers, investor & team emails\n// SECONDARY DOMAIN (tryacme.com):   Configured exclusively for outbound sales prospecting",
            "lineNotes": {
              "1": "Protected corporate asset.",
              "2": "Dedicated outbound vessel."
            }
          },
          {
            "type": "runnable_code",
            "filename": "secondary_domain_demo.js",
            "initialCode": "function getOutboundDomainBestPractice() {\n  return 'DEPLOY_DEDICATED_SECONDARY_DOMAINS_FOR_OUTBOUND_PROSPECTING';\n}\n\nconsole.log(getOutboundDomainBestPractice());",
            "expectedOutput": "DEPLOY_DEDICATED_SECONDARY_DOMAINS_FOR_OUTBOUND_PROSPECTING",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What infrastructure architecture protects primary corporate domains from spam filters during high-volume outbound sales prospecting?",
          "expectedStringOutput": "DEPLOY_DEDICATED_SECONDARY_DOMAINS_FOR_OUTBOUND_PROSPECTING",
          "acceptableAnswers": [
            "DEPLOY_DEDICATED_SECONDARY_DOMAINS_FOR_OUTBOUND_PROSPECTING",
            "Secondary Domains",
            "Dedicated secondary domains"
          ],
          "primaryMisconceptionId": "MC_SCRM_OUTBOUND_DELIVERABILITY_DMARC_WARMUP",
          "diagnosisMap": {
            "USE_PRIMARY": {
              "misconceptionId": "MC_SCRM_OUTBOUND_DELIVERABILITY_DMARC_WARMUP",
              "errorExplanation": "Using primary domain risks burning corporate email. DEPLOY_DEDICATED_SECONDARY_DOMAINS_FOR_OUTBOUND_PROSPECTING is required.",
              "recoveryPath": {
                "simplerExplanation": "Matches DEPLOY_DEDICATED_SECONDARY_DOMAINS_FOR_OUTBOUND_PROSPECTING.",
                "guidedFixPrompt": "Type DEPLOY_DEDICATED_SECONDARY_DOMAINS_FOR_OUTBOUND_PROSPECTING"
              }
            }
          }
        }
      },
      {
        "id": "scrm-d26-b3-daily-sending-limits",
        "day": 26,
        "blockNumber": 3,
        "title": "Daily Sending Volume Caps: Maximum 50 Cold Emails per Inbox per Day",
        "conceptBudget": {
          "primaryConcept": "Sending Volume Cap Invariant",
          "supportingTerms": [
            "Never send > 50 cold emails per day per inbox. To send 500 emails/day, use 10 warmed inboxes across 3 secondary domains"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d26-b2-custom-tracking-domains",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "volume_cap_demo.js",
            "initialCode": "function calculateRequiredInboxes(targetDailyEmails, maxPerInbox) {\n  return Math.ceil(targetDailyEmails / maxPerInbox);\n}\n\nconsole.log(calculateRequiredInboxes(500, 50));",
            "expectedOutput": "10",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many separate warmed email inboxes are required to safely send 500 outbound sales emails per day under a 50 email/inbox cap ($500 / 50$)?",
          "expectedStringOutput": "10",
          "acceptableAnswers": [
            "10",
            "10 inboxes"
          ],
          "primaryMisconceptionId": "MC_SCRM_OUTBOUND_DELIVERABILITY_DMARC_WARMUP",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_SCRM_OUTBOUND_DELIVERABILITY_DMARC_WARMUP",
              "errorExplanation": "Sending 500 from 1 inbox burns the domain. 500 / 50 = 10 inboxes.",
              "recoveryPath": {
                "simplerExplanation": "500 / 50 = 10.",
                "guidedFixPrompt": "Type 10"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 27,
    "title": "Advanced Sales Methodology: The Challenger Sale (Teach, Tailor, Take Control)",
    "overviewMetaphor": "The Challenger Sale is a Master Surgeon Challenging the Patient's Assumptions: In complex enterprise sales, 'Relationship Builders' lose to 'Challengers' because buyers don't need a friend; they need an expert who: 1. Teaches them an unexpected commercial insight about their business; 2. Tailors the message directly to economic decision-makers; and 3. Takes Control of the pricing discussion without flinching.",
    "blocks": [
      {
        "id": "scrm-d27-b1-challenger-sale-three-pillars",
        "day": 27,
        "blockNumber": 1,
        "title": "The 3 Pillars of The Challenger Sale: Teach Commercial Insight, Tailor for Resonance, Take Control",
        "conceptBudget": {
          "primaryConcept": "Challenger Sale Methodology",
          "supportingTerms": [
            "Commercial Teaching (Reframing how the customer views their own market and operational vulnerabilities)",
            "Tailoring (Speaking directly to the CFO's cash flow concerns vs the CTO's latency concerns)",
            "Taking Control (Leading the pricing and commercial terms without backing down)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d26-b1-email-dns-authentication-warming-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "The Challenger Sale Execution Ledger",
              "boxes": [
                {
                  "label": "Commercial Teaching",
                  "value": "Delivers Provocative Industry Insight that Reframes Customer Strategy",
                  "varType": "Teach",
                  "isUpdated": false
                },
                {
                  "label": "Tailored Resonance",
                  "value": "Customized ROI Narrative for Economic Buyer & Executive Board",
                  "varType": "Tailor",
                  "isUpdated": false
                },
                {
                  "label": "Commercial Control",
                  "value": "CHALLENGER COMMERCIAL INSIGHT ACTIVE (HIGHEST B2B ENTERPRISE WIN RATE!)",
                  "varType": "Control",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "challenger_eval_demo.js",
            "initialCode": "function evaluateChallenger(teach, tailor, control) {\n  const isChallenger = teach && tailor && control;\n  return {\n    teach,\n    tailor,\n    control,\n    isChallenger,\n    status: isChallenger ? 'CHALLENGER_COMMERCIAL_INSIGHT_ACTIVE' : 'RELATIONSHIP_BUILDING_LOW_WINRATE'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateChallenger(true, true, true)));\nconsole.log(JSON.stringify(evaluateChallenger(false, true, true)));",
            "expectedOutput": "{\"teach\":true,\"tailor\":true,\"control\":true,\"isChallenger\":true,\"status\":\"CHALLENGER_COMMERCIAL_INSIGHT_ACTIVE\"}\n{\"teach\":false,\"tailor\":true,\"control\":true,\"isChallenger\":false,\"status\":\"RELATIONSHIP_BUILDING_LOW_WINRATE\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What sales execution status is validated when an Account Executive successfully teaches commercial insights, tailors for executive resonance, and asserts commercial control?",
          "expectedStringOutput": "CHALLENGER_COMMERCIAL_INSIGHT_ACTIVE",
          "acceptableAnswers": [
            "CHALLENGER_COMMERCIAL_INSIGHT_ACTIVE",
            "Challenger active",
            "Challenger Sale"
          ],
          "primaryMisconceptionId": "MC_SCRM_ADVANCED_METHODOLOGY_CHALLENGER_SALE",
          "diagnosisMap": {
            "RELATIONSHIP": {
              "misconceptionId": "MC_SCRM_ADVANCED_METHODOLOGY_CHALLENGER_SALE",
              "errorExplanation": "Executing all 3 pillars activates CHALLENGER_COMMERCIAL_INSIGHT_ACTIVE.",
              "recoveryPath": {
                "simplerExplanation": "Matches CHALLENGER_COMMERCIAL_INSIGHT_ACTIVE.",
                "guidedFixPrompt": "Type CHALLENGER_COMMERCIAL_INSIGHT_ACTIVE"
              }
            }
          }
        }
      },
      {
        "id": "scrm-d27-b2-five-sales-rep-profiles",
        "day": 27,
        "blockNumber": 2,
        "title": "The 5 Sales Profiles (Dixon & Adamson): Why Challengers Outperform",
        "conceptBudget": {
          "primaryConcept": "5 Rep Profiles",
          "supportingTerms": [
            "The Challenger (54% of top performers in complex sales)",
            "The Hard Worker",
            "The Lone Wolf",
            "The Reactive Problem Solver",
            "The Relationship Builder (Lowest performer in complex enterprise deals)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d27-b1-challenger-sale-three-pillars",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Top Performer Profile Distribution",
            "codeSnippet": "// 54% of top-performing enterprise B2B sales reps are CHALLENGERS\n// < 7% of top-performing enterprise reps are Relationship Builders",
            "lineNotes": {
              "1": "Dominant top profile.",
              "2": "Ineffective legacy profile."
            }
          },
          {
            "type": "runnable_code",
            "filename": "profiles_demo.js",
            "initialCode": "function getTopPerformerProfile() {\n  return 'THE_CHALLENGER';\n}\n\nconsole.log(getTopPerformerProfile());",
            "expectedOutput": "THE_CHALLENGER",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which of the 5 sales rep profiles identified in CEB research accounts for over 50% of all top-performing complex enterprise closers?",
          "expectedStringOutput": "THE_CHALLENGER",
          "acceptableAnswers": [
            "THE_CHALLENGER",
            "Challenger",
            "The Challenger"
          ],
          "primaryMisconceptionId": "MC_SCRM_ADVANCED_METHODOLOGY_CHALLENGER_SALE",
          "diagnosisMap": {
            "RELATIONSHIP_BUILDER": {
              "misconceptionId": "MC_SCRM_ADVANCED_METHODOLOGY_CHALLENGER_SALE",
              "errorExplanation": "Relationship builders perform poorly in complex sales. The top performer is THE_CHALLENGER.",
              "recoveryPath": {
                "simplerExplanation": "Matches THE_CHALLENGER.",
                "guidedFixPrompt": "Type THE_CHALLENGER"
              }
            }
          }
        }
      },
      {
        "id": "scrm-d27-b3-commercial-teaching-pitch-arc",
        "day": 27,
        "blockNumber": 3,
        "title": "The 6-Step Commercial Teaching Pitch Arc: The Warmer to The Solution",
        "conceptBudget": {
          "primaryConcept": "Pitch Arc Steps",
          "supportingTerms": [
            "1. The Warmer $\\to$ 2. The Reframe $\\to$ 3. Rational Drowning $\\to$ 4. Emotional Impact $\\to$ 5. A New Way $\\to$ 6. Our Solution"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d27-b2-five-sales-rep-profiles",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "pitch_arc_demo.js",
            "initialCode": "function getPitchArcStep(stepNum) {\n  const steps = ['WARMER', 'REFRAME', 'RATIONAL_DROWNING', 'EMOTIONAL_IMPACT', 'A_NEW_WAY', 'OUR_SOLUTION'];\n  return steps[stepNum - 1];\n}\n\nconsole.log(getPitchArcStep(2));",
            "expectedOutput": "REFRAME",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is Step 2 in the Challenger Commercial Teaching pitch arc where the sales rep shatters the customer's existing assumptions about their business?",
          "expectedStringOutput": "REFRAME",
          "acceptableAnswers": [
            "REFRAME",
            "The Reframe",
            "Reframe"
          ],
          "primaryMisconceptionId": "MC_SCRM_ADVANCED_METHODOLOGY_CHALLENGER_SALE",
          "diagnosisMap": {
            "SOLUTION": {
              "misconceptionId": "MC_SCRM_ADVANCED_METHODOLOGY_CHALLENGER_SALE",
              "errorExplanation": "Step 2 is REFRAME. The Solution is only introduced at Step 6.",
              "recoveryPath": {
                "simplerExplanation": "Matches REFRAME.",
                "guidedFixPrompt": "Type REFRAME"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 28,
    "title": "Sales Analytics: Win/Loss Ratio, Ramp Time & Discount Rate Leakage",
    "overviewMetaphor": "Sales Analytics is the Flight Telemetry Black Box of Your Revenue Machine: Across 100 closed deals, winning 30 deals and losing 70 ($30 / 100 = 30.0\\%$ Win Rate) while maintaining an average discount of only 8.0% ($8.0\\% \\le 10.0\\%$) proves pricing discipline; clamping discount rate leakage below 10.0% protects millions of dollars in gross margin from being needlessly surrendered by lazy sales reps.",
    "blocks": [
      {
        "id": "scrm-d28-b1-win-rate-discount-leakage-audit",
        "day": 28,
        "blockNumber": 1,
        "title": "Sales Performance Audit: Win Rate ($\\ge 25.0\\%$) & Discount Leakage ($\\le 10.0\\%$)",
        "conceptBudget": {
          "primaryConcept": "Win Rate & Pricing Discipline Formula",
          "supportingTerms": [
            "Won Deals ($30$)",
            "Lost Deals ($70$)",
            "Total Closed Deals = $30 + 70 = 100$",
            "Win Rate = $\\frac{30}{100} \\times 100\\% = 30.0\\%$",
            "Average Discount Given = $8.0\\%$",
            "Performance Standard: Win Rate $\\ge 25.0\\%$ and Discount $\\le 10.0\\% \\implies$ Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d27-b1-challenger-sale-three-pillars",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Sales Analytics Telemetry Ledger (30% Win Rate, 8% Discount)",
              "boxes": [
                {
                  "label": "Win Rate Performance",
                  "value": "30 Won / 100 Closed = 30.0% Win Rate (>= 25% Benchmark)",
                  "varType": "Win Rate",
                  "isUpdated": false
                },
                {
                  "label": "Discount Discipline",
                  "value": "8.0% Average Discount Given (<= 10.0% Maximum Ceiling)",
                  "varType": "Discount",
                  "isUpdated": false
                },
                {
                  "label": "Performance Rating",
                  "value": "HIGH WINRATE DISCIPLINED PRICING NOMINAL REVENUE ENGINE!",
                  "varType": "Rating",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "analytics_calc_demo.js",
            "initialCode": "function auditSalesPerformance(won, lost, discountPct) {\n  const total = won + lost;\n  const winRate = (won / total) * 100;\n  const isNominal = winRate >= 25.0 && discountPct <= 10.0;\n  return {\n    total,\n    winRate: Number(winRate.toFixed(1)),\n    discountPct,\n    isNominal,\n    status: isNominal ? 'HIGH_WINRATE_DISCIPLINED_PRICING' : 'PERFORMANCE_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditSalesPerformance(30, 70, 8.0)));\nconsole.log(JSON.stringify(auditSalesPerformance(15, 85, 25.0)));",
            "expectedOutput": "{\"total\":100,\"winRate\":30,\"discountPct\":8,\"isNominal\":true,\"status\":\"HIGH_WINRATE_DISCIPLINED_PRICING\"}\n{\"total\":100,\"winRate\":15,\"discountPct\":25,\"isNominal\":false,\"status\":\"PERFORMANCE_DEFECT\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Win Rate percentage when a sales team wins 30 deals out of 100 total closed opportunities ($ (30 / 100) \\times 100 $)?",
          "expectedStringOutput": "30",
          "acceptableAnswers": [
            "30",
            "30%",
            "30.0",
            "winRate\":30"
          ],
          "primaryMisconceptionId": "MC_SCRM_SALES_ANALYTICS_WIN_LOSS_METRICS",
          "diagnosisMap": {
            "70": {
              "misconceptionId": "MC_SCRM_SALES_ANALYTICS_WIN_LOSS_METRICS",
              "errorExplanation": "70% is the loss rate. The win rate is 30.0%.",
              "recoveryPath": {
                "simplerExplanation": "30 / 100 * 100 = 30%.",
                "guidedFixPrompt": "Type 30"
              }
            }
          }
        }
      },
      {
        "id": "scrm-d28-b2-rep-ramp-time-analysis",
        "day": 28,
        "blockNumber": 2,
        "title": "Account Executive Ramp Time Analytics (Target <= 90 Days)",
        "conceptBudget": {
          "primaryConcept": "AE Ramp Time Benchmark",
          "supportingTerms": [
            "Ramp Time (Months required for a newly hired rep to achieve 100% quota capacity; Target: $\\le 90$ days for mid-market, $\\le 180$ days for enterprise)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d28-b1-win-rate-discount-leakage-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Ramp Time Milestone Progression",
            "codeSnippet": "// Month 1: Product Certification & Shadowing (0% Quota Target)\n// Month 2: Pipeline Generation & First Discovery Calls (50% Quota Target)\n// Month 3: Full Enterprise Closing Capacity (100% Quota Attainment Target!)",
            "lineNotes": {
              "1": "Knowledge acquisition.",
              "2": "Pipeline buildup.",
              "3": "Full productive capacity."
            }
          },
          {
            "type": "runnable_code",
            "filename": "ramp_time_demo.js",
            "initialCode": "function evaluateRepRamp(daysToFullQuota) {\n  return daysToFullQuota <= 90\n    ? 'RAPID_PRODUCTIVE_RAMP_CYCLE'\n    : 'EXTENDED_RAMP_CYCLE_PROVIDE_ENABLEMENT_COACHING';\n}\n\nconsole.log(evaluateRepRamp(75));",
            "expectedOutput": "RAPID_PRODUCTIVE_RAMP_CYCLE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What ramp performance status evaluates an Account Executive achieving full 100% quota closing capacity within 75 days of onboarding?",
          "expectedStringOutput": "RAPID_PRODUCTIVE_RAMP_CYCLE",
          "acceptableAnswers": [
            "RAPID_PRODUCTIVE_RAMP_CYCLE",
            "Rapid ramp",
            "Productive ramp"
          ],
          "primaryMisconceptionId": "MC_SCRM_SALES_ANALYTICS_WIN_LOSS_METRICS",
          "diagnosisMap": {
            "EXTENDED": {
              "misconceptionId": "MC_SCRM_SALES_ANALYTICS_WIN_LOSS_METRICS",
              "errorExplanation": "75 days is under the 90-day ceiling, earning RAPID_PRODUCTIVE_RAMP_CYCLE.",
              "recoveryPath": {
                "simplerExplanation": "Matches RAPID_PRODUCTIVE_RAMP_CYCLE.",
                "guidedFixPrompt": "Type RAPID_PRODUCTIVE_RAMP_CYCLE"
              }
            }
          }
        }
      },
      {
        "id": "scrm-d28-b3-discount-leakage-governance",
        "day": 28,
        "blockNumber": 3,
        "title": "Discount Authority Matrix: VP & CFO Approval Tiers",
        "conceptBudget": {
          "primaryConcept": "Discount Approval Matrix",
          "supportingTerms": [
            "0-10% Discount: Account Executive discretion",
            "11-20% Discount: VP of Sales approval required",
            "> 20% Discount: CFO / CEO approval required with multi-year contract"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d28-b2-rep-ramp-time-analysis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "discount_matrix_demo.js",
            "initialCode": "function getDiscountApprover(discountPct) {\n  if (discountPct <= 10) return 'ACCOUNT_EXECUTIVE';\n  if (discountPct <= 20) return 'VP_OF_SALES';\n  return 'CFO_AND_CEO';\n}\n\nconsole.log(getDiscountApprover(8));\nconsole.log(getDiscountApprover(15));\nconsole.log(getDiscountApprover(25));",
            "expectedOutput": "ACCOUNT_EXECUTIVE\nVP_OF_SALES\nCFO_AND_CEO",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Who must approve a requested sales discount of 15% under an enterprise discount authority governance matrix?",
          "expectedStringOutput": "VP_OF_SALES",
          "acceptableAnswers": [
            "VP_OF_SALES",
            "VP of Sales",
            "Sales VP"
          ],
          "primaryMisconceptionId": "MC_SCRM_SALES_ANALYTICS_WIN_LOSS_METRICS",
          "diagnosisMap": {
            "AE": {
              "misconceptionId": "MC_SCRM_SALES_ANALYTICS_WIN_LOSS_METRICS",
              "errorExplanation": "AE discretion is capped at 10%. 15% requires VP_OF_SALES approval.",
              "recoveryPath": {
                "simplerExplanation": "Matches VP_OF_SALES.",
                "guidedFixPrompt": "Type VP_OF_SALES"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 29,
    "title": "AI in Sales & Customer Success: Autonomous Copilots & Predictive Opportunity Scoring",
    "overviewMetaphor": "An AI Sales Copilot is an Autonomous Co-Pilot in a Jet Fighter: By saving 8 hours of manual CRM logging per week ($8 \\times 5 = 40.0$ pts) and delivering 85% predictive opportunity win scoring accuracy ($85 \\times 0.5 = 42.5$ pts), the AI Sales Copilot achieves an elite Composite Efficiency Score of 82.5 ($40.0 + 42.5 = 82.5$); reps spend 80% of their day actually talking to buyers rather than updating CRM fields.",
    "blocks": [
      {
        "id": "scrm-d29-b1-ai-sales-copilot-efficiency-index",
        "day": 29,
        "blockNumber": 1,
        "title": "AI Sales Copilot Composite Index: $\\text{Index} = (\\text{Hours Saved} \\times 5) + (\\text{Accuracy} \\times 0.5) \\ge 75.0$",
        "conceptBudget": {
          "primaryConcept": "AI Sales Efficiency Formula",
          "supportingTerms": [
            "Weekly CRM Admin Hours Saved ($8.0$ hrs $\\implies 40.0$ pts)",
            "Predictive Opportunity Scoring Accuracy ($85.0\\% \\implies 42.5$ pts)",
            "Composite Index = $40.0 + 42.5 = 82.5$",
            "Elite AI Benchmark: $\\ge 75.0 \\implies$ Tier-1 AI Revenue Engine Active"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d28-b1-win-rate-discount-leakage-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "AI Revenue Copilot Telemetry Ledger (8h Saved, 85% Accuracy)",
              "boxes": [
                {
                  "label": "Admin Automation",
                  "value": "8 Hours Saved/Week x 5 = 40.0 Points (Auto-Meeting Transcripts & CRM Notes)",
                  "varType": "Admin",
                  "isUpdated": false
                },
                {
                  "label": "Predictive Win Scoring",
                  "value": "85% Accuracy x 0.5 = 42.5 Points (Machine Learning Deal Win Probability)",
                  "varType": "ML Accuracy",
                  "isUpdated": false
                },
                {
                  "label": "AI Sales Composite",
                  "value": "40.0 + 42.5 = 82.5 Points (TIER 1 AI SALES COPILOT ACTIVE >= 75.0!)",
                  "varType": "Index",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "ai_sales_calc_demo.js",
            "initialCode": "function evaluateAiSales(hoursSaved, accuracyPct) {\n  const composite = (hoursSaved * 5) + (accuracyPct * 0.5);\n  const isElite = composite >= 75.0;\n  return {\n    hoursSaved,\n    accuracyPct,\n    compositeScore: Number(composite.toFixed(1)),\n    isElite,\n    status: isElite ? 'TIER_1_AI_SALES_COPILOT_ACTIVE' : 'SUB_OPTIMAL'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateAiSales(8, 85)));",
            "expectedOutput": "{\"hoursSaved\":8,\"accuracyPct\":85,\"compositeScore\":82.5,\"isElite\":true,\"status\":\"TIER_1_AI_SALES_COPILOT_ACTIVE\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the AI sales efficiency composite score when an autonomous copilot saves 8 admin hours per week with 85% predictive win scoring accuracy ($ (8 \\times 5) + (85 \\times 0.5) $)?",
          "expectedStringOutput": "82.5",
          "acceptableAnswers": [
            "82.5",
            "82.5 points",
            "compositeScore\":82.5"
          ],
          "primaryMisconceptionId": "MC_SCRM_AI_SALES_AUTOMATION_COPILOTS",
          "diagnosisMap": {
            "93": {
              "misconceptionId": "MC_SCRM_AI_SALES_AUTOMATION_COPILOTS",
              "errorExplanation": "93 directly adds 8 + 85. The weighted formula is (8 * 5 = 40) + (85 * 0.5 = 42.5) = 82.5.",
              "recoveryPath": {
                "simplerExplanation": "(8 * 5) + (85 * 0.5) = 82.5.",
                "guidedFixPrompt": "Type 82.5"
              }
            }
          }
        }
      },
      {
        "id": "scrm-d29-b2-generative-call-summarization-crm",
        "day": 29,
        "blockNumber": 2,
        "title": "Generative AI Meeting Summaries & Automated CRM Field Updates",
        "conceptBudget": {
          "primaryConcept": "Generative CRM Automation",
          "supportingTerms": [
            "LLM Call Summarization (Instantly extracting Action Items, MEDDPICC updates, and Next Steps from Gong recordings and populating Salesforce fields via API)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d29-b1-ai-sales-copilot-efficiency-index",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Autonomous Post-Call Workflow",
            "codeSnippet": "// 1. Call concludes on Zoom/Google Meet\n// 2. Whisper/GPT-4o ingests audio -> Generates structured JSON\n// 3. Automated Webhook pushes Economic Buyer, Budget, and MAP dates to CRM Opportunity",
            "lineNotes": {
              "1": "Call completion.",
              "2": "LLM extraction.",
              "3": "Instant CRM update."
            }
          },
          {
            "type": "runnable_code",
            "filename": "llm_crm_demo.js",
            "initialCode": "function getPostCallAutomationState() {\n  return 'AUTONOMOUS_POST_CALL_CRM_SYNC_COMPLETED';\n}\n\nconsole.log(getPostCallAutomationState());",
            "expectedOutput": "AUTONOMOUS_POST_CALL_CRM_SYNC_COMPLETED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What synchronization status confirms an AI copilot has successfully parsed a sales recording and updated CRM deal stages?",
          "expectedStringOutput": "AUTONOMOUS_POST_CALL_CRM_SYNC_COMPLETED",
          "acceptableAnswers": [
            "AUTONOMOUS_POST_CALL_CRM_SYNC_COMPLETED",
            "CRM sync completed",
            "Autonomous sync"
          ],
          "primaryMisconceptionId": "MC_SCRM_AI_SALES_AUTOMATION_COPILOTS",
          "diagnosisMap": {
            "MANUAL": {
              "misconceptionId": "MC_SCRM_AI_SALES_AUTOMATION_COPILOTS",
              "errorExplanation": "AI copilots execute AUTONOMOUS_POST_CALL_CRM_SYNC_COMPLETED.",
              "recoveryPath": {
                "simplerExplanation": "Matches AUTONOMOUS_POST_CALL_CRM_SYNC_COMPLETED.",
                "guidedFixPrompt": "Type AUTONOMOUS_POST_CALL_CRM_SYNC_COMPLETED"
              }
            }
          }
        }
      },
      {
        "id": "scrm-d29-b3-predictive-churn-neural-models",
        "day": 29,
        "blockNumber": 3,
        "title": "Predictive Churn Machine Learning Models: Early Signal Detection",
        "conceptBudget": {
          "primaryConcept": "Machine Learning Churn Prediction",
          "supportingTerms": [
            "ML Churn Classifier (Random Forest / Gradient Boosted Trees detecting multi-variate drop in API usage 60 days before human CSM notices)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d29-b2-generative-call-summarization-crm",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "churn_ml_demo.js",
            "initialCode": "function predictChurnRisk(mlChurnProbability) {\n  return mlChurnProbability >= 0.70\n    ? 'HIGH_PROBABILITY_CHURN_RISK_DISPATCH_ALERT'\n    : 'STABLE_RETENTION_TRAJECTORY';\n}\n\nconsole.log(predictChurnRisk(0.85));",
            "expectedOutput": "HIGH_PROBABILITY_CHURN_RISK_DISPATCH_ALERT",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What automated alert status is triggered when a machine learning predictive model calculates an 85% probability of customer churn?",
          "expectedStringOutput": "HIGH_PROBABILITY_CHURN_RISK_DISPATCH_ALERT",
          "acceptableAnswers": [
            "HIGH_PROBABILITY_CHURN_RISK_DISPATCH_ALERT",
            "High churn risk",
            "Dispatch alert"
          ],
          "primaryMisconceptionId": "MC_SCRM_AI_SALES_AUTOMATION_COPILOTS",
          "diagnosisMap": {
            "STABLE": {
              "misconceptionId": "MC_SCRM_AI_SALES_AUTOMATION_COPILOTS",
              "errorExplanation": "85% probability triggers HIGH_PROBABILITY_CHURN_RISK_DISPATCH_ALERT.",
              "recoveryPath": {
                "simplerExplanation": "Matches HIGH_PROBABILITY_CHURN_RISK_DISPATCH_ALERT.",
                "guidedFixPrompt": "Type HIGH_PROBABILITY_CHURN_RISK_DISPATCH_ALERT"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 30,
    "title": "🏆 FINAL CAPSTONE: Enterprise Sales, Customer Success & CRM Master Suite",
    "overviewMetaphor": "Day 30 Final Capstone Synthesis: The complete sovereign enterprise revenue generation, sales operations, customer success, and CRM operating system: 1. Prospecting & Qualification (DMU alignment, 9% reply rate, 7/8 MEDDPICC score, and $120k COI discovery); 2. Sales Execution & Closing (80% MAP progress, 4.0x ROI objection defense, +$15k positive ZOPA spread, and $5,000/day pipeline velocity); 3. Customer Success & Retention (10 days TTV, 86.5 Green CHS, 120.0% NRR, +60 NPS, and 10 CSM headcount capacity); 4. Sales Ops & Enablement (Clean CRM deduplication, round-robin routing, battlecards, and $230k accelerated OTE with 40% talk ratio); 5. Advanced Revenue Scaling (100-account balanced territories, deal registration, <48h legal redlines, 120% QBR value realization, SPF/DKIM/DMARC warming, Challenger sales methodology, and 82.5 AI sales copilot efficiency composite).",
    "blocks": [
      {
        "id": "scrm-d30-b1-capstone-sales-master-orchestration",
        "day": 30,
        "blockNumber": 1,
        "title": "Enterprise Sales, Customer Success & CRM Master Suite Orchestration",
        "conceptBudget": {
          "primaryConcept": "Enterprise Revenue Master Suite Orchestration",
          "supportingTerms": [
            "Prospecting Module",
            "Closing Module",
            "CS Retention Module",
            "Sales Ops Module",
            "Enterprise Scaling Module"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d29-b3-predictive-churn-neural-models",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Enterprise Sales, Customer Success & CRM Master Architecture",
              "nodes": [
                {
                  "id": "1",
                  "label": "Prospecting & MEDDPICC Deal Qualification Engine Active",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "LAER Objection Defense & Value Trade Closing Engine Active",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Customer Health Scoring & 120% NRR Retention Engine Active",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "CRM Routing & Conversational Intelligence Engine Active",
                  "kind": "process"
                },
                {
                  "id": "5",
                  "label": "Autonomous AI Sales Copilot Active -> Master Suite Certified!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "capstone_sales_orchestrator.js",
            "initialCode": "function orchestrateSalesSuite(p, c, cs, ops, scale) {\n  const isNominal = p && c && cs && ops && scale;\n  return {\n    prospectingSubsystem: 'ONLINE_PROSPECTING_ACTIVE',\n    closingSubsystem: 'ONLINE_CLOSING_ACTIVE',\n    csRetentionSubsystem: 'ONLINE_CS_RETENTION_ACTIVE',\n    salesOpsSubsystem: 'ONLINE_SALES_OPS_ACTIVE',\n    enterpriseScalingSubsystem: 'ONLINE_ENTERPRISE_SCALING_ACTIVE',\n    masterStatus: isNominal ? 'ENTERPRISE_SALES_CS_AND_CRM_MASTER_CERTIFIED_NOMINAL' : 'DEFECT'\n  };\n}\n\nconsole.log(orchestrateSalesSuite(true, true, true, true, true).masterStatus);",
            "expectedOutput": "ENTERPRISE_SALES_CS_AND_CRM_MASTER_CERTIFIED_NOMINAL",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What master status confirms certified operational synthesis of the complete Enterprise Sales, Customer Success & CRM Master Suite?",
          "expectedStringOutput": "ENTERPRISE_SALES_CS_AND_CRM_MASTER_CERTIFIED_NOMINAL",
          "acceptableAnswers": [
            "ENTERPRISE_SALES_CS_AND_CRM_MASTER_CERTIFIED_NOMINAL",
            "masterStatus: ENTERPRISE_SALES_CS_AND_CRM_MASTER_CERTIFIED_NOMINAL"
          ],
          "primaryMisconceptionId": "MC_SCRM_CAPSTONE_ENTERPRISE_SALES_CRM_SUITE",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_SCRM_CAPSTONE_ENTERPRISE_SALES_CRM_SUITE",
              "errorExplanation": "Matches ENTERPRISE_SALES_CS_AND_CRM_MASTER_CERTIFIED_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ENTERPRISE_SALES_CS_AND_CRM_MASTER_CERTIFIED_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "scrm-d30-b2-capstone-sales-audit",
        "day": 30,
        "blockNumber": 2,
        "title": "Platform-Wide Sales & CS Invariant Verification & Precision Audit",
        "conceptBudget": {
          "primaryConcept": "Full Platform Sales Invariant Verification",
          "supportingTerms": [
            "Zero Defect Invariant",
            "100% Quality Invariant",
            "Audited Precision Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d30-b1-capstone-sales-master-orchestration",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "capstone_sales_audit.js",
            "initialCode": "function auditCapstoneSalesSuite(p, c, cs, ops, scale) {\n  const ok = p && c && cs && ops && scale;\n  return {\n    prospectingVerified: p,\n    closingVerified: c,\n    csRetentionVerified: cs,\n    salesOpsVerified: ops,\n    scalingAiVerified: scale,\n    score: ok ? '100/100' : '0/100',\n    grade: ok ? 'CAPSTONE_SALES_CRM_AUDIT_PASSED' : 'AUDIT_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditCapstoneSalesSuite(true, true, true, true, true)));",
            "expectedOutput": "{\"prospectingVerified\":true,\"closingVerified\":true,\"csRetentionVerified\":true,\"salesOpsVerified\":true,\"scalingAiVerified\":true,\"score\":\"100/100\",\"grade\":\"CAPSTONE_SALES_CRM_AUDIT_PASSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade and score are awarded when all 5 enterprise revenue subsystems pass 100% verification?",
          "expectedStringOutput": "CAPSTONE_SALES_CRM_AUDIT_PASSED",
          "acceptableAnswers": [
            "CAPSTONE_SALES_CRM_AUDIT_PASSED",
            "grade\":\"CAPSTONE_SALES_CRM_AUDIT_PASSED\""
          ],
          "primaryMisconceptionId": "MC_SCRM_CAPSTONE_ENTERPRISE_SALES_CRM_SUITE",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_SCRM_CAPSTONE_ENTERPRISE_SALES_CRM_SUITE",
              "errorExplanation": "All checks passing awards CAPSTONE_SALES_CRM_AUDIT_PASSED.",
              "recoveryPath": {
                "simplerExplanation": "Awards CAPSTONE_SALES_CRM_AUDIT_PASSED.",
                "guidedFixPrompt": "Type CAPSTONE_SALES_CRM_AUDIT_PASSED"
              }
            }
          }
        }
      },
      {
        "id": "scrm-d30-b3-final-sales-capstone-cert",
        "day": 30,
        "blockNumber": 3,
        "title": "Day 30 Final Capstone Sales & Customer Success Certification",
        "conceptBudget": {
          "primaryConcept": "Day 30 Final Capstone Certification",
          "supportingTerms": [
            "Enterprise Sales & CS Master Certified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "scrm-d30-b2-capstone-sales-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "final_sales_capstone_cert.js",
            "initialCode": "console.log('🏆 FINAL CAPSTONE: Enterprise Sales, Customer Success & CRM Master Suite [VERIFIED 100%]');",
            "expectedOutput": "🏆 FINAL CAPSTONE: Enterprise Sales, Customer Success & CRM Master Suite [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms full completion of Course 25: Sales, Customer Success & CRM?",
          "expectedStringOutput": "🏆 FINAL CAPSTONE: Enterprise Sales, Customer Success & CRM Master Suite [VERIFIED 100%]",
          "acceptableAnswers": [
            "🏆 FINAL CAPSTONE: Enterprise Sales, Customer Success & CRM Master Suite [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_SCRM_CAPSTONE_ENTERPRISE_SALES_CRM_SUITE",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_SCRM_CAPSTONE_ENTERPRISE_SALES_CRM_SUITE",
              "errorExplanation": "Matches final capstone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type 🏆 FINAL CAPSTONE: Enterprise Sales, Customer Success & CRM Master Suite [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  }
];
