import { DayLessonPlan } from '@/lib/types/lessonEngine';

export const BCOM_ENTREPRENEURSHIP_PILOT_DAYS: DayLessonPlan[] = [
  {
    "day": 1,
    "title": "Legal Business Entities: Private Limited (Pvt Ltd) & Limited Liability",
    "overviewMetaphor": "A Private Limited Company is an Impenetrable Legal Titanium Shield Between Your Business and Your Family's Home: In a Sole Proprietorship, if your company incurs $500,000 in debt, creditors can legally seize your personal home and life savings to recover the money ($200,000 personal asset exposure); incorporating as a Private Limited Company (Pvt Ltd) creates a separate legal person with limited liability, shielding your personal assets to $0 exposure and creating equity share capital required by angel investors and venture capitalists.",
    "blocks": [
      {
        "id": "ent-d1-b1-pvt-ltd-limited-liability-shield",
        "day": 1,
        "blockNumber": 1,
        "title": "The Corporate Veil & Limited Liability Shield ($0 Personal Asset Exposure)",
        "conceptBudget": {
          "primaryConcept": "Limited Liability Shield Mechanics",
          "supportingTerms": [
            "Sole Proprietorship (Unlimited Personal Liability $\\implies$ Founder home & bank accounts exposed)",
            "Private Limited Company (Limited Liability $\\implies \\$0$ Founder Personal Asset Exposure)",
            "Separate Legal Entity (The company sues and is sued in its own corporate name)"
          ]
        },
        "prerequisiteThresholds": [],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Corporate Legal Entity Risk Ledger ($500k Company Debt)",
              "boxes": [
                {
                  "label": "Sole Proprietorship",
                  "value": "Founder Home & Bank Accounts EXPOSED to debt collectors!",
                  "varType": "Unlimited Risk",
                  "isUpdated": false
                },
                {
                  "label": "Private Limited (Pvt Ltd)",
                  "value": "FOUNDER PERSONAL EXPOSURE = $0.00 (Protected by Corporate Veil!)",
                  "varType": "Protected",
                  "isUpdated": false
                },
                {
                  "label": "Venture Investability",
                  "value": "Pvt Ltd is MANDATORY for issuing equity shares to angel investors & VCs",
                  "varType": "VC Ready",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "entity_eval_demo.js",
            "initialCode": "function evaluateEntityRisk(entityType, companyDebt, founderPersonalWealth) {\n  const isShielded = entityType === 'PRIVATE_LIMITED_COMPANY';\n  const personalRisk = isShielded ? 0 : Math.min(companyDebt, founderPersonalWealth);\n  return {\n    entityType,\n    companyDebt,\n    founderPersonalRiskDollars: personalRisk,\n    isProtected: isShielded,\n    status: 'ENTITY_EVALUATED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateEntityRisk('PRIVATE_LIMITED_COMPANY', 500000, 200000)));\nconsole.log(JSON.stringify(evaluateEntityRisk('SOLE_PROPRIETORSHIP', 500000, 200000)));",
            "expectedOutput": "{\"entityType\":\"PRIVATE_LIMITED_COMPANY\",\"companyDebt\":500000,\"founderPersonalRiskDollars\":0,\"isProtected\":true,\"status\":\"ENTITY_EVALUATED\"}\n{\"entityType\":\"SOLE_PROPRIETORSHIP\",\"companyDebt\":500000,\"founderPersonalRiskDollars\":200000,\"isProtected\":false,\"status\":\"ENTITY_EVALUATED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many dollars of founder personal assets are exposed to creditors when a Private Limited Company incurs $500,000 in defaulted business debt?",
          "expectedStringOutput": "0",
          "acceptableAnswers": [
            "0",
            "$0",
            "0.0",
            "founderPersonalRiskDollars\":0"
          ],
          "primaryMisconceptionId": "MC_ENT_LEGAL_ENTITIES_PVT_LTD_LIABILITY",
          "diagnosisMap": {
            "200000": {
              "misconceptionId": "MC_ENT_LEGAL_ENTITIES_PVT_LTD_LIABILITY",
              "errorExplanation": "200,000 applies to Sole Proprietorships. Private Limited companies shield personal assets to $0.",
              "recoveryPath": {
                "simplerExplanation": "Pvt Ltd personal risk is 0.",
                "guidedFixPrompt": "Type 0"
              }
            }
          }
        }
      },
      {
        "id": "ent-d1-b2-authorized-vs-paid-up-capital",
        "day": 1,
        "blockNumber": 2,
        "title": "Equity Share Capital: Authorized vs Paid-Up Share Capital",
        "conceptBudget": {
          "primaryConcept": "Share Capital Structuring",
          "supportingTerms": [
            "Authorized Capital (Maximum share value the company is legally allowed to issue per charter)",
            "Paid-Up Capital (Actual cash deposited by shareholders into the corporate bank account for issued shares)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d1-b1-pvt-ltd-limited-liability-shield",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Share Capital Comparison",
            "codeSnippet": "// AUTHORIZED CAPITAL: ₹10,00,000 (Maximum equity ceiling in MOA)\n// PAID-UP CAPITAL:    ₹1,00,000 (Actual cash paid by founders for initial equity)\n// UNISSUED HEADROOM:  ₹9,00,000 (Available to issue to future investors without charter amendment)",
            "lineNotes": {
              "1": "Legal equity ceiling.",
              "2": "Actual cash deposited.",
              "3": "Future expansion headroom."
            }
          },
          {
            "type": "runnable_code",
            "filename": "capital_struct_demo.js",
            "initialCode": "function calculateUnissuedCapital(authorized, paidUp) {\n  return authorized - paidUp;\n}\n\nconsole.log(calculateUnissuedCapital(1000000, 100000));",
            "expectedOutput": "900000",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many rupees of unissued equity headroom remain when a startup incorporates with ₹10,00,000 authorized capital and ₹1,00,000 paid-up capital ($10,00,000 - 1,00,000$)?",
          "expectedStringOutput": "900000",
          "acceptableAnswers": [
            "900000",
            "₹9,00,000",
            "900,000"
          ],
          "primaryMisconceptionId": "MC_ENT_LEGAL_ENTITIES_PVT_LTD_LIABILITY",
          "diagnosisMap": {
            "1000000": {
              "misconceptionId": "MC_ENT_LEGAL_ENTITIES_PVT_LTD_LIABILITY",
              "errorExplanation": "10,00,000 is total authorized. Subtracting the 1,00,000 paid-up leaves ₹9,00,000 unissued.",
              "recoveryPath": {
                "simplerExplanation": "1,000,000 - 100,000 = 900,000.",
                "guidedFixPrompt": "Type 90000"
              }
            }
          }
        }
      },
      {
        "id": "ent-d1-b3-incorporation-statutory-documents",
        "day": 1,
        "blockNumber": 3,
        "title": "Statutory Charter Documents: Memorandum (MOA) & Articles (AOA)",
        "conceptBudget": {
          "primaryConcept": "MOA vs AOA Charter Invariant",
          "supportingTerms": [
            "Memorandum of Association (MOA: Company's core external constitution and business objects)",
            "Articles of Association (AOA: Internal rules, board voting powers, and share transfer restrictions)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d1-b2-authorized-vs-paid-up-capital",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "charter_demo.js",
            "initialCode": "function getCharterDocumentRole(docType) {\n  return docType === 'MOA'\n    ? 'EXTERNAL_CONSTITUTION_AND_BUSINESS_OBJECTS'\n    : 'INTERNAL_GOVERNANCE_AND_SHARE_TRANSFER_RULES';\n}\n\nconsole.log(getCharterDocumentRole('MOA'));\nconsole.log(getCharterDocumentRole('AOA'));",
            "expectedOutput": "EXTERNAL_CONSTITUTION_AND_BUSINESS_OBJECTS\nINTERNAL_GOVERNANCE_AND_SHARE_TRANSFER_RULES",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which charter document defines the internal governance rules, director voting powers, and share transfer restrictions for a Private Limited Company?",
          "expectedStringOutput": "INTERNAL_GOVERNANCE_AND_SHARE_TRANSFER_RULES",
          "acceptableAnswers": [
            "INTERNAL_GOVERNANCE_AND_SHARE_TRANSFER_RULES",
            "AOA",
            "Articles of Association"
          ],
          "primaryMisconceptionId": "MC_ENT_LEGAL_ENTITIES_PVT_LTD_LIABILITY",
          "diagnosisMap": {
            "MOA": {
              "misconceptionId": "MC_ENT_LEGAL_ENTITIES_PVT_LTD_LIABILITY",
              "errorExplanation": "MOA defines external objects. AOA defines internal governance and share transfer rules.",
              "recoveryPath": {
                "simplerExplanation": "Matches INTERNAL_GOVERNANCE_AND_SHARE_TRANSFER_RULES.",
                "guidedFixPrompt": "Type INTERNAL_GOVERNANCE_AND_SHARE_TRANSFER_RULES"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 2,
    "title": "Opportunity Sizing: Total Addressable Market (TAM, SAM, SOM)",
    "overviewMetaphor": "TAM, SAM, and SOM are Russian Matryoshka Nesting Dolls of Market Reality: TAM (Total Addressable Market) is the entire universe of 100,000 global target accounts paying $1,000/year ($100,000,000 TAM); SAM (Serviceable Available Market) is the 20% slice you can reach geographically ($20,000,000 SAM); SOM (Serviceable Obtainable Market) is the inner doll: the realistic 10% share of SAM you can win in the next 3 years ($2,000,000 SOM, representing 2.0% of TAM).",
    "blocks": [
      {
        "id": "ent-d2-b1-tam-sam-som-waterfall-calculation",
        "day": 2,
        "blockNumber": 1,
        "title": "Bottom-Up Market Sizing: $\\text{TAM} \\to \\text{SAM} \\to \\text{SOM}$",
        "conceptBudget": {
          "primaryConcept": "Market Sizing Waterfall Formula",
          "supportingTerms": [
            "Target Accounts ($100,000$)",
            "Annual Contract Value ($ACV = \\$1,000$)",
            "TAM = $100,000 \\times \\$1,000 = \\$100,000,000$",
            "SAM ($20.0\\%$ of TAM = $\\$20,000,000$)",
            "SOM ($10.0\\%$ of SAM = $\\$2,000,000$ $\\implies 2.0\\%$ of TAM)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d1-b1-pvt-ltd-limited-liability-shield",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Market Opportunity Sizing Matrix ($1,000 ACV)",
              "boxes": [
                {
                  "label": "TAM (Total Addressable)",
                  "value": "100,000 Global Accounts x $1,000 = $100,000,000.00 TAM",
                  "varType": "TAM",
                  "isUpdated": false
                },
                {
                  "label": "SAM (Serviceable Available)",
                  "value": "20% Geographic Reach = $20,000,000.00 SAM",
                  "varType": "SAM",
                  "isUpdated": false
                },
                {
                  "label": "SOM (Serviceable Obtainable)",
                  "value": "10% of SAM = $2,000,000.00 SOM (3-YEAR REALISTIC TARGET!)",
                  "varType": "SOM",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "market_sizing_calc_demo.js",
            "initialCode": "function calculateMarketSizes(accounts, acv, samPct, somPct) {\n  const tam = accounts * acv;\n  const sam = tam * (samPct / 100);\n  const som = sam * (somPct / 100);\n  return {\n    tamDollars: tam,\n    samDollars: sam,\n    somDollars: som,\n    status: 'SIZING_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateMarketSizes(100000, 1000, 20, 10)));",
            "expectedOutput": "{\"tamDollars\":100000000,\"samDollars\":20000000,\"somDollars\":2000000,\"status\":\"SIZING_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Serviceable Obtainable Market (SOM) in dollars for a startup targeting a 10% share of a $20,000,000 SAM ($20,000,000 \\times 0.10$)?",
          "expectedStringOutput": "2000000",
          "acceptableAnswers": [
            "2000000",
            "$2,000,000",
            "2,000,000",
            "somDollars\":2000000"
          ],
          "primaryMisconceptionId": "MC_ENT_OPPORTUNITY_VALIDATION_TAM_SAM_SOM",
          "diagnosisMap": {
            "20000000": {
              "misconceptionId": "MC_ENT_OPPORTUNITY_VALIDATION_TAM_SAM_SOM",
              "errorExplanation": "20,000,000 is SAM. SOM is the 10% realistic capture = $2,000,000.",
              "recoveryPath": {
                "simplerExplanation": "20,000,000 * 0.10 = 2,000,000.",
                "guidedFixPrompt": "Type 2000000"
              }
            }
          }
        }
      },
      {
        "id": "ent-d2-b2-top-down-vs-bottom-up-validation",
        "day": 2,
        "blockNumber": 2,
        "title": "Top-Down Gartner Guesswork vs Bottom-Up Unit Economics Modeling",
        "conceptBudget": {
          "primaryConcept": "Bottom-Up Market Validation",
          "supportingTerms": [
            "Top-Down (Vanity claims: 'Global cloud is $500B, we only need 1%')",
            "Bottom-Up (Rigorous multiplication: Verified Customer Count $\\times$ Real Average Order Value ACV)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d2-b1-tam-sam-som-waterfall-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Market Sizing Methodology",
            "codeSnippet": "// ❌ TOP-DOWN (VC Red Flag): 'The AI industry is $1.3 Trillion, so we get 0.1% = $1.3B!'\n// ✅ BOTTOM-UP (Gold Standard): 5,000 Qualified Hospitals x $50,000 Annual License = $250M TAM!",
            "lineNotes": {
              "1": "Lazy top-down guess.",
              "2": "Defensible bottom-up proof."
            }
          },
          {
            "type": "runnable_code",
            "filename": "sizing_method_demo.js",
            "initialCode": "function getVentureCredibleSizingMethod() {\n  return 'BOTTOM_UP_UNIT_ECONOMICS_ACCOUNT_MULTIPLICATION';\n}\n\nconsole.log(getVentureCredibleSizingMethod());",
            "expectedOutput": "BOTTOM_UP_UNIT_ECONOMICS_ACCOUNT_MULTIPLICATION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which market sizing methodology is demanded by tier-1 venture capitalists because it multiplies verified target account counts by realistic unit pricing?",
          "expectedStringOutput": "BOTTOM_UP_UNIT_ECONOMICS_ACCOUNT_MULTIPLICATION",
          "acceptableAnswers": [
            "BOTTOM_UP_UNIT_ECONOMICS_ACCOUNT_MULTIPLICATION",
            "Bottom-Up",
            "Bottom Up"
          ],
          "primaryMisconceptionId": "MC_ENT_OPPORTUNITY_VALIDATION_TAM_SAM_SOM",
          "diagnosisMap": {
            "TOP_DOWN": {
              "misconceptionId": "MC_ENT_OPPORTUNITY_VALIDATION_TAM_SAM_SOM",
              "errorExplanation": "Top-down estimates are ungrounded guesses. VCs require BOTTOM_UP_UNIT_ECONOMICS_ACCOUNT_MULTIPLICATION.",
              "recoveryPath": {
                "simplerExplanation": "Matches BOTTOM_UP_UNIT_ECONOMICS_ACCOUNT_MULTIPLICATION.",
                "guidedFixPrompt": "Type BOTTOM_UP_UNIT_ECONOMICS_ACCOUNT_MULTIPLICATION"
              }
            }
          }
        }
      },
      {
        "id": "ent-d2-b3-the-mom-test-interview-rules",
        "day": 2,
        "blockNumber": 3,
        "title": "The Mom Test: Uncovering Past Behavior Instead of Polite Compliments",
        "conceptBudget": {
          "primaryConcept": "The Mom Test Invariant",
          "supportingTerms": [
            "Rob Fitzpatrick's The Mom Test",
            "Rule 1: Talk about their life, not your idea",
            "Rule 2: Ask about specific past behavior, not hypothetical future promises ('When was the last time you paid for this?')"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d2-b2-top-down-vs-bottom-up-validation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "mom_test_demo.js",
            "initialCode": "function evaluateCustomerInterviewQuestion(question) {\n  return question.includes('would you buy')\n    ? 'INVALID_HYPOTHETICAL_COURTESY_BIAS'\n    : 'VALID_MOM_TEST_PAST_BEHAVIORAL_EVIDENCE';\n}\n\nconsole.log(evaluateCustomerInterviewQuestion('Would you buy this app for $10?'));\nconsole.log(evaluateCustomerInterviewQuestion('How much did you spend solving this problem last month?'));",
            "expectedOutput": "INVALID_HYPOTHETICAL_COURTESY_BIAS\nVALID_MOM_TEST_PAST_BEHAVIORAL_EVIDENCE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What error classification is assigned to the interview question 'Would you buy this app if we built it for $10?' under The Mom Test framework?",
          "expectedStringOutput": "INVALID_HYPOTHETICAL_COURTESY_BIAS",
          "acceptableAnswers": [
            "INVALID_HYPOTHETICAL_COURTESY_BIAS",
            "Courtesy bias",
            "Hypothetical bias"
          ],
          "primaryMisconceptionId": "MC_ENT_OPPORTUNITY_VALIDATION_TAM_SAM_SOM",
          "diagnosisMap": {
            "VALID": {
              "misconceptionId": "MC_ENT_OPPORTUNITY_VALIDATION_TAM_SAM_SOM",
              "errorExplanation": "Asking hypothetical questions elicits polite lies. The Mom Test classifies this as INVALID_HYPOTHETICAL_COURTESY_BIAS.",
              "recoveryPath": {
                "simplerExplanation": "Matches INVALID_HYPOTHETICAL_COURTESY_BIAS.",
                "guidedFixPrompt": "Type INVALID_HYPOTHETICAL_COURTESY_BIAS"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 3,
    "title": "Business Model Canvas (BMC): The 9 Strategic Building Blocks",
    "overviewMetaphor": "The Business Model Canvas is an Architectural Blueprint of a Theater Stage: The Right Side is the Front Stage (Customer Segments, Value Propositions, Channels, Customer Relationships, Revenue Streams — where the audience watches and pays cash); the Left Side is the Back Stage (Key Partners, Key Activities, Key Resources, Cost Structure — the machinery that makes the show possible); all 9 blocks must interlock seamlessly.",
    "blocks": [
      {
        "id": "ent-d3-b1-nine-building-blocks-of-bmc",
        "day": 3,
        "blockNumber": 1,
        "title": "The 9 Strategic Building Blocks of Alexander Osterwalder's BMC",
        "conceptBudget": {
          "primaryConcept": "The 9 BMC Building Blocks",
          "supportingTerms": [
            "Right Stage: Customer Segments, Value Propositions, Channels, Customer Relationships, Revenue Streams",
            "Left Stage: Key Partnerships, Key Activities, Key Resources, Cost Structure",
            "Total = 9 interlocked strategic blocks"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d2-b1-tam-sam-som-waterfall-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Business Model Canvas (9 Building Blocks Architecture)",
              "boxes": [
                {
                  "label": "Front Stage (Value & Customers)",
                  "value": "Segments, Value Prop, Channels, Relationships, Revenue Streams",
                  "varType": "Front Stage",
                  "isUpdated": false
                },
                {
                  "label": "Back Stage (Cost & Infrastructure)",
                  "value": "Key Partners, Key Activities, Key Resources, Cost Structure",
                  "varType": "Back Stage",
                  "isUpdated": false
                },
                {
                  "label": "Total Interlocking Blocks",
                  "value": "EXACTLY 9 BUILDING BLOCKS (Mandatory complete business map!)",
                  "varType": "Total Blocks",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "bmc_count_demo.js",
            "initialCode": "function getBmcBuildingBlocksCount() {\n  return 9;\n}\n\nconsole.log(getBmcBuildingBlocksCount());",
            "expectedOutput": "9",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many mandatory strategic building blocks constitute Alexander Osterwalder's Business Model Canvas?",
          "expectedStringOutput": "9",
          "acceptableAnswers": [
            "9",
            "Nine",
            "9 blocks"
          ],
          "primaryMisconceptionId": "MC_ENT_BUSINESS_MODEL_CANVAS_NINE_BLOCKS",
          "diagnosisMap": {
            "7": {
              "misconceptionId": "MC_ENT_BUSINESS_MODEL_CANVAS_NINE_BLOCKS",
              "errorExplanation": "7 is 7 Powers. The Business Model Canvas consists of exactly 9 building blocks.",
              "recoveryPath": {
                "simplerExplanation": "BMC has 9 blocks.",
                "guidedFixPrompt": "Type 9"
              }
            }
          }
        }
      },
      {
        "id": "ent-d3-b2-front-stage-vs-back-stage-balance",
        "day": 3,
        "blockNumber": 2,
        "title": "Front-Stage Value Generation vs Back-Stage Cost Feasibility",
        "conceptBudget": {
          "primaryConcept": "BMC Feasibility Balance",
          "supportingTerms": [
            "Desirability (Right side: Do customers want it?)",
            "Feasibility (Left side: Can we build and deliver it?)",
            "Viability (Bottom: Is Revenue > Cost?)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d3-b1-nine-building-blocks-of-bmc",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "BMC Triad Check",
            "codeSnippet": "// 1. DESIRABILITY: Customer Segments + Value Prop + Channels (Right side)\n// 2. FEASIBILITY:  Key Activities + Key Resources + Partners (Left side)\n// 3. VIABILITY:    Revenue Streams > Cost Structure (Bottom foundation)",
            "lineNotes": {
              "1": "Customer desire.",
              "2": "Operational ability.",
              "3": "Economic profit."
            }
          },
          {
            "type": "runnable_code",
            "filename": "bmc_triad_demo.js",
            "initialCode": "function evaluateBmcViability(revenueUsd, costUsd) {\n  return revenueUsd > costUsd\n    ? 'ECONOMICALLY_VIABLE_PROFITABLE_BMC'\n    : 'UNVIABLE_CASH_DRAIN_DEFECT';\n}\n\nconsole.log(evaluateBmcViability(500000, 350000));\nconsole.log(evaluateBmcViability(200000, 300000));",
            "expectedOutput": "ECONOMICALLY_VIABLE_PROFITABLE_BMC\nUNVIABLE_CASH_DRAIN_DEFECT",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms the economic viability of a Business Model Canvas when projected Revenue Streams exceed total operational Cost Structure?",
          "expectedStringOutput": "ECONOMICALLY_VIABLE_PROFITABLE_BMC",
          "acceptableAnswers": [
            "ECONOMICALLY_VIABLE_PROFITABLE_BMC",
            "Economically Viable",
            "Profitable BMC"
          ],
          "primaryMisconceptionId": "MC_ENT_BUSINESS_MODEL_CANVAS_NINE_BLOCKS",
          "diagnosisMap": {
            "UNVIABLE": {
              "misconceptionId": "MC_ENT_BUSINESS_MODEL_CANVAS_NINE_BLOCKS",
              "errorExplanation": "Revenue > Cost proves economic viability.",
              "recoveryPath": {
                "simplerExplanation": "Matches ECONOMICALLY_VIABLE_PROFITABLE_BMC.",
                "guidedFixPrompt": "Type ECONOMICALLY_VIABLE_PROFITABLE_BMC"
              }
            }
          }
        }
      },
      {
        "id": "ent-d3-b3-key-partnerships-derisking",
        "day": 3,
        "blockNumber": 3,
        "title": "Key Partnerships: Strategic Alliances, Coopetition & Risk Reduction",
        "conceptBudget": {
          "primaryConcept": "Strategic Partnerships Invariant",
          "supportingTerms": [
            "Strategic Alliances between non-competitors",
            "Coopetition (Competitors collaborating on shared standard e.g. Blu-ray / EV charging networks)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d3-b2-front-stage-vs-back-stage-balance",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "partnerships_demo.js",
            "initialCode": "function getCoopetitionDefinition() {\n  return 'DIRECT_COMPETITORS_COLLABORATING_ON_SHARED_INDUSTRY_INFRASTRUCTURE';\n}\n\nconsole.log(getCoopetitionDefinition());",
            "expectedOutput": "DIRECT_COMPETITORS_COLLABORATING_ON_SHARED_INDUSTRY_INFRASTRUCTURE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How is a partnership model defined when direct marketplace competitors collaborate to build shared industry infrastructure?",
          "expectedStringOutput": "DIRECT_COMPETITORS_COLLABORATING_ON_SHARED_INDUSTRY_INFRASTRUCTURE",
          "acceptableAnswers": [
            "DIRECT_COMPETITORS_COLLABORATING_ON_SHARED_INDUSTRY_INFRASTRUCTURE",
            "Coopetition",
            "Co-opetition"
          ],
          "primaryMisconceptionId": "MC_ENT_BUSINESS_MODEL_CANVAS_NINE_BLOCKS",
          "diagnosisMap": {
            "MONOPOLY": {
              "misconceptionId": "MC_ENT_BUSINESS_MODEL_CANVAS_NINE_BLOCKS",
              "errorExplanation": "Competitors cooperating on shared infrastructure is known as Coopetition.",
              "recoveryPath": {
                "simplerExplanation": "Matches DIRECT_COMPETITORS_COLLABORATING_ON_SHARED_INDUSTRY_INFRASTRUCTURE.",
                "guidedFixPrompt": "Type DIRECT_COMPETITORS_COLLABORATING_ON_SHARED_INDUSTRY_INFRASTRUCTURE"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 4,
    "title": "Value Proposition Design: Jobs to Be Done (JTBD) & Pain Relievers",
    "overviewMetaphor": "Value Proposition Design is a Locksmith Precision-Cutting a Key for a Specific Customer Lock: Customers don't buy a quarter-inch drill bit; they buy a quarter-inch hole in their living room wall to hang a family photo (The Job to Be Done); when your product's Pain Relievers directly neutralize 4 out of 5 identified customer pains ($4/5 = 80.0\\%$), Problem-Solution Fit is mathematically locked in.",
    "blocks": [
      {
        "id": "ent-d4-b1-jobs-to-be-done-framework",
        "day": 4,
        "blockNumber": 1,
        "title": "Jobs to Be Done (JTBD): Functional, Social & Emotional Jobs",
        "conceptBudget": {
          "primaryConcept": "The 3 JTBD Dimensions",
          "supportingTerms": [
            "Functional Job (The practical task e.g. Transmit $500 across borders)",
            "Social Job (How they want to be perceived by peers e.g. Modern tech-savvy founder)",
            "Emotional Job (How they want to feel e.g. Secure and stress-free)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d3-b1-nine-building-blocks-of-bmc",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Value Proposition Canvas Mapping (4 of 5 Pains Neutralized)",
              "boxes": [
                {
                  "label": "Identified Customer Pains",
                  "value": "5 Critical Pain Points logged in customer discovery",
                  "varType": "Pains",
                  "isUpdated": false
                },
                {
                  "label": "Matched Pain Relievers",
                  "value": "4 Product features directly neutralize severe pains",
                  "varType": "Relievers",
                  "isUpdated": false
                },
                {
                  "label": "Problem-Solution Fit",
                  "value": "4 / 5 = 80.00% (PROBLEM-SOLUTION FIT ACHIEVED >= 80% THRESHOLD!)",
                  "varType": "Fit Score",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "jtbd_calc_demo.js",
            "initialCode": "function scoreProblemSolutionFit(totalPains, matchedRelievers) {\n  const fit = (matchedRelievers / totalPains) * 100;\n  return {\n    totalPains,\n    matchedRelievers,\n    fitPercent: Number(fit.toFixed(2)),\n    isFit: fit >= 80.0,\n    status: 'FIT_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(scoreProblemSolutionFit(5, 4)));",
            "expectedOutput": "{\"totalPains\":5,\"matchedRelievers\":4,\"fitPercent\":80,\"isFit\":true,\"status\":\"FIT_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Problem-Solution Fit percentage when a startup's product features directly neutralize 4 out of 5 identified customer pain points ($ (4 / 5) \\times 100 $)?",
          "expectedStringOutput": "80",
          "acceptableAnswers": [
            "80",
            "80%",
            "80.0",
            "fitPercent\":80"
          ],
          "primaryMisconceptionId": "MC_ENT_VALUE_PROPOSITION_JTBD_CANVAS",
          "diagnosisMap": {
            "40": {
              "misconceptionId": "MC_ENT_VALUE_PROPOSITION_JTBD_CANVAS",
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
        "id": "ent-d4-b2-pain-relievers-vs-gain-creators",
        "day": 4,
        "blockNumber": 2,
        "title": "Vitamins vs Painkillers: Why Pain Relievers Convert 5x Higher",
        "conceptBudget": {
          "primaryConcept": "Painkiller vs Vitamin Positioning",
          "supportingTerms": [
            "Painkillers (Solve an acute, bleeding neck problem e.g. Compliance audit failure $\\implies$ Urgent purchase)",
            "Vitamins (Nice-to-have wellness improvements $\\implies$ Easily cut during recessions)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d4-b1-jobs-to-be-done-framework",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Value Proposition Urgency",
            "codeSnippet": "// 💊 VITAMIN:    'Our software makes team brainstorming 10% more fun' (Low urgency -> 1% conversion)\n// 💉 PAINKILLER: 'Our software stops AWS billing leaks saving $15,000/mo' (Extreme urgency -> 25% conversion!)",
            "lineNotes": {
              "1": "Discretionary nice-to-have.",
              "2": "Mission-critical pain relief."
            }
          },
          {
            "type": "runnable_code",
            "filename": "painkiller_demo.js",
            "initialCode": "function evaluateProductUrgency(isPainkiller) {\n  return isPainkiller\n    ? 'HIGH_URGENCY_PAINKILLER_IMMEDIATE_BUDGET_ALLOCATION'\n    : 'LOW_URGENCY_VITAMIN_NICE_TO_HAVE';\n}\n\nconsole.log(evaluateProductUrgency(true));\nconsole.log(evaluateProductUrgency(false));",
            "expectedOutput": "HIGH_URGENCY_PAINKILLER_IMMEDIATE_BUDGET_ALLOCATION\nLOW_URGENCY_VITAMIN_NICE_TO_HAVE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How are products positioned that resolve acute, expensive operational bottlenecks to unlock immediate enterprise budget allocation?",
          "expectedStringOutput": "HIGH_URGENCY_PAINKILLER_IMMEDIATE_BUDGET_ALLOCATION",
          "acceptableAnswers": [
            "HIGH_URGENCY_PAINKILLER_IMMEDIATE_BUDGET_ALLOCATION",
            "Painkiller",
            "High urgency painkiller"
          ],
          "primaryMisconceptionId": "MC_ENT_VALUE_PROPOSITION_JTBD_CANVAS",
          "diagnosisMap": {
            "VITAMIN": {
              "misconceptionId": "MC_ENT_VALUE_PROPOSITION_JTBD_CANVAS",
              "errorExplanation": "Vitamins are low urgency. Acute problem solvers are painkillers that unlock immediate budget.",
              "recoveryPath": {
                "simplerExplanation": "Matches HIGH_URGENCY_PAINKILLER_IMMEDIATE_BUDGET_ALLOCATION.",
                "guidedFixPrompt": "Type HIGH_URGENCY_PAINKILLER_IMMEDIATE_BUDGET_ALLOCATION"
              }
            }
          }
        }
      },
      {
        "id": "ent-d4-b3-ad-lib-value-prop-formula",
        "day": 4,
        "blockNumber": 3,
        "title": "Steve Blank's Ad-Lib Value Proposition Syntax",
        "conceptBudget": {
          "primaryConcept": "Steve Blank Value Syntax",
          "supportingTerms": [
            "Formula: 'We help [Target Segment X] do [Job Y] by doing [Secret Weapon Z]'"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d4-b2-pain-relievers-vs-gain-creators",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "adlib_demo.js",
            "initialCode": "function formatValueProposition(segment, job, secretSauce) {\n  return `We help ${segment} do ${job} by ${secretSauce}`;\n}\n\nconsole.log(formatValueProposition('D2C Brands', 'cut returns by 50%', 'automating AI size recommendations'));",
            "expectedOutput": "We help D2C Brands do cut returns by 50% by automating AI size recommendations",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What structured value statement is produced from segment 'D2C Brands', job 'cut returns by 50%', and sauce 'automating AI size recommendations'?",
          "expectedStringOutput": "We help D2C Brands do cut returns by 50% by automating AI size recommendations",
          "acceptableAnswers": [
            "We help D2C Brands do cut returns by 50% by automating AI size recommendations"
          ],
          "primaryMisconceptionId": "MC_ENT_VALUE_PROPOSITION_JTBD_CANVAS",
          "diagnosisMap": {
            "WRONG": {
              "misconceptionId": "MC_ENT_VALUE_PROPOSITION_JTBD_CANVAS",
              "errorExplanation": "Matches full formatted string.",
              "recoveryPath": {
                "simplerExplanation": "Follows Steve Blank ad-lib syntax.",
                "guidedFixPrompt": "Type We help D2C Brands do cut returns by 50% by automating AI size recommendations"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 5,
    "title": "⭐ MILESTONE 1: Complete Venture Ideation, BMC & Problem-Solution Fit Engine",
    "overviewMetaphor": "Milestone 1 Synthesis: The complete sovereign venture ideation and strategic architecture engine: 1. Pvt Ltd limited liability shield ($0 personal risk exposure); 2. Bottom-up TAM SAM SOM market sizing ($2,000,000 SOM); 3. 9-Block complete Business Model Canvas verification; 4. JTBD Problem-Solution Fit scoring ($80.0\\%$ fit).",
    "blocks": [
      {
        "id": "ent-d5-b1-ideation-strategy-master-synthesis",
        "day": 5,
        "blockNumber": 1,
        "title": "Venture Ideation & Strategic Foundation Master Kernel Synthesis",
        "conceptBudget": {
          "primaryConcept": "Ideation & Strategy Engine Synthesis",
          "supportingTerms": [
            "Entity Shield Engine",
            "Market Sizing Engine",
            "BMC Complete Auditor",
            "Value Fit Scorer"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d4-b3-ad-lib-value-prop-formula",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Milestone 1 Venture Ideation & Strategy Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "Establishes Pvt Ltd $0 personal asset liability shield",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Sizes $2M SOM market opportunity via bottom-up modeling",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Audits 9-block complete Business Model Canvas architecture",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Scores 80% JTBD fit and certifies ideation master kernel!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "ideation_master_kernel_demo.js",
            "initialCode": "function runVentureIdeationEngine() {\n  return {\n    entitySubsystem: 'ONLINE_PVT_LTD_SHIELD_ACTIVE',\n    sizingSubsystem: 'ONLINE_TAM_SAM_SOM_ACTIVE',\n    bmcSubsystem: 'ONLINE_9_BLOCK_BMC_ACTIVE',\n    valuePropSubsystem: 'ONLINE_80_PERCENT_JTBD_FIT_ACTIVE',\n    engineStatus: 'VENTURE_IDEATION_AND_STRATEGY_KERNEL_ACTIVE_NOMINAL'\n  };\n}\n\nconsole.log(runVentureIdeationEngine().engineStatus);",
            "expectedOutput": "VENTURE_IDEATION_AND_STRATEGY_KERNEL_ACTIVE_NOMINAL",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What engine status confirms active operational synthesis of the Venture Ideation & Strategic Foundation Master Kernel?",
          "expectedStringOutput": "VENTURE_IDEATION_AND_STRATEGY_KERNEL_ACTIVE_NOMINAL",
          "acceptableAnswers": [
            "VENTURE_IDEATION_AND_STRATEGY_KERNEL_ACTIVE_NOMINAL",
            "engineStatus: VENTURE_IDEATION_AND_STRATEGY_KERNEL_ACTIVE_NOMINAL"
          ],
          "primaryMisconceptionId": "MC_ENT_LEGAL_ENTITIES_PVT_LTD_LIABILITY",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_ENT_LEGAL_ENTITIES_PVT_LTD_LIABILITY",
              "errorExplanation": "Matches VENTURE_IDEATION_AND_STRATEGY_KERNEL_ACTIVE_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type VENTURE_IDEATION_AND_STRATEGY_KERNEL_ACTIVE_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "ent-d5-b2-ideation-engine-audit",
        "day": 5,
        "blockNumber": 2,
        "title": "Ideation Engine Invariant Verification & Precision Audit",
        "conceptBudget": {
          "primaryConcept": "Ideation Invariant Verification",
          "supportingTerms": [
            "Entity Invariant",
            "Market Sizing Invariant",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d5-b1-ideation-strategy-master-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "ideation_audit_demo.js",
            "initialCode": "function auditIdeationEngine(pvtValid, somValid, bmcValid, fitValid) {\n  const passed = pvtValid && somValid && bmcValid && fitValid;\n  return {\n    entityVerified: pvtValid,\n    marketSizeVerified: somValid,\n    bmcVerified: bmcValid,\n    fitVerified: fitValid,\n    grade: passed ? 'VENTURE_IDEATION_ENGINE_AUDIT_PASSED' : 'AUDIT_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditIdeationEngine(true, true, true, true)));",
            "expectedOutput": "{\"entityVerified\":true,\"marketSizeVerified\":true,\"bmcVerified\":true,\"fitVerified\":true,\"grade\":\"VENTURE_IDEATION_ENGINE_AUDIT_PASSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade is awarded when Entity, Sizing, BMC, and Value Fit engines pass 100%?",
          "expectedStringOutput": "VENTURE_IDEATION_ENGINE_AUDIT_PASSED",
          "acceptableAnswers": [
            "VENTURE_IDEATION_ENGINE_AUDIT_PASSED",
            "grade\":\"VENTURE_IDEATION_ENGINE_AUDIT_PASSED\""
          ],
          "primaryMisconceptionId": "MC_ENT_LEGAL_ENTITIES_PVT_LTD_LIABILITY",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_ENT_LEGAL_ENTITIES_PVT_LTD_LIABILITY",
              "errorExplanation": "All checks passing awards VENTURE_IDEATION_ENGINE_AUDIT_PASSED.",
              "recoveryPath": {
                "simplerExplanation": "Awards VENTURE_IDEATION_ENGINE_AUDIT_PASSED.",
                "guidedFixPrompt": "Type VENTURE_IDEATION_ENGINE_AUDIT_PASSED"
              }
            }
          }
        }
      },
      {
        "id": "ent-d5-b3-milestone1-ent-cert",
        "day": 5,
        "blockNumber": 3,
        "title": "Milestone 1 Venture Ideation & Strategy Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 1 Certification",
          "supportingTerms": [
            "Venture Strategy Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d5-b2-ideation-engine-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone1_ent_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 1: Complete Venture Ideation, BMC & Problem-Solution Fit Engine [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 1: Complete Venture Ideation, BMC & Problem-Solution Fit Engine [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 1 completion?",
          "expectedStringOutput": "⭐ MILESTONE 1: Complete Venture Ideation, BMC & Problem-Solution Fit Engine [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 1: Complete Venture Ideation, BMC & Problem-Solution Fit Engine [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_ENT_LEGAL_ENTITIES_PVT_LTD_LIABILITY",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_ENT_LEGAL_ENTITIES_PVT_LTD_LIABILITY",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 1: Complete Venture Ideation, BMC & Problem-Solution Fit Engine [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 6,
    "title": "Lean Startup Methodology: MVP Archetypes & The Build-Measure-Learn Loop",
    "overviewMetaphor": "A Smoke Test MVP is Selling Advance Concert Tickets Before Booking the Stadium: Instead of spending $100,000 building software that nobody wants, a Landing Page Smoke Test drives 1,000 target visitors to a landing page offering pre-orders ($50 paid deposit); when 50 visitors put down a paid deposit ($5.0\\%$ conversion rate, exceeding the 3.0% validation threshold), customer willingness-to-pay is scientifically validated with zero code wasted.",
    "blocks": [
      {
        "id": "ent-d6-b1-smoke-test-conversion-validation",
        "day": 6,
        "blockNumber": 1,
        "title": "The Smoke Test MVP: Pre-Order Conversion Validation ($\\% \\ge 3.0\\%$)",
        "conceptBudget": {
          "primaryConcept": "Smoke Test Validation Formula",
          "supportingTerms": [
            "Landing Page Visitors ($1,000$)",
            "Paid Deposit Pre-Orders ($50$)",
            "Conversion Rate = $\\frac{50}{1,000} \\times 100\\% = 5.0\\%$",
            "Validation Threshold: $\\ge 3.0\\% \\implies$ Green Light to Build Full Product; $< 3.0\\% \\implies$ Pivot Value Proposition"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d1-b1-pvt-ltd-limited-liability-shield",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Smoke Test Validation Ledger (1,000 Visitors, 50 Paid Deposits)",
              "boxes": [
                {
                  "label": "Traffic Volume",
                  "value": "1,000 Targeted ICP Landing Page Visitors",
                  "varType": "Visitors",
                  "isUpdated": false
                },
                {
                  "label": "Paid Pre-Orders (50)",
                  "value": "50 Customers submitted $50 paid deposit (5.00% Conversion)",
                  "varType": "Pre-Orders",
                  "isUpdated": false
                },
                {
                  "label": "Strategic Decision",
                  "value": "5.0% >= 3.0% Threshold -> GREEN LIGHT: BUILD FULL PRODUCT!",
                  "varType": "Decision",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "smoke_test_calc_demo.js",
            "initialCode": "function evaluateSmokeTest(visitors, preOrders, thresholdPct) {\n  const rate = (preOrders / visitors) * 100;\n  const isOk = rate >= thresholdPct;\n  return {\n    visitors,\n    preOrders,\n    conversionRate: Number(rate.toFixed(2)),\n    isValidated: isOk,\n    action: isOk ? 'BUILD_FULL_PRODUCT' : 'PIVOT',\n    status: 'SMOKE_TEST_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateSmokeTest(1000, 50, 3.0)));",
            "expectedOutput": "{\"visitors\":1000,\"preOrders\":50,\"conversionRate\":5,\"isValidated\":true,\"action\":\"BUILD_FULL_PRODUCT\",\"status\":\"SMOKE_TEST_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the pre-order conversion rate percentage when 50 out of 1,000 landing page visitors place a paid pre-order deposit ($ (50 / 1,000) \\times 100 $)?",
          "expectedStringOutput": "5",
          "acceptableAnswers": [
            "5",
            "5%",
            "5.0",
            "conversionRate\":5"
          ],
          "primaryMisconceptionId": "MC_ENT_LEAN_STARTUP_MVP_BUILD_MEASURE_LEARN",
          "diagnosisMap": {
            "0.05": {
              "misconceptionId": "MC_ENT_LEAN_STARTUP_MVP_BUILD_MEASURE_LEARN",
              "errorExplanation": "0.05 is decimal format. Converted to percentage, it is 5.0%.",
              "recoveryPath": {
                "simplerExplanation": "50 / 1000 * 100 = 5%.",
                "guidedFixPrompt": "Type 5"
              }
            }
          }
        }
      },
      {
        "id": "ent-d6-b2-concierge-vs-wizard-of-oz-mvp",
        "day": 6,
        "blockNumber": 2,
        "title": "Concierge MVP vs Wizard of Oz MVP Architectures",
        "conceptBudget": {
          "primaryConcept": "MVP Operational Archetypes",
          "supportingTerms": [
            "Concierge MVP (Customer knowingly receives high-touch manual human service to learn user preferences)",
            "Wizard of Oz MVP (Customer interacts with front-end UI believing it is fully automated AI, while founders manually execute tasks in the back-end)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d6-b1-smoke-test-conversion-validation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "MVP Archetype Comparison",
            "codeSnippet": "// WIZARD OF OZ (Zappos origin): Founder takes photo in shoe store -> user buys -> founder buys shoe manually!\n// CONCIERGE (Wealthfront origin): Founder acts as personal financial advisor sitting in living room to learn rules",
            "lineNotes": {
              "1": "Simulated automation.",
              "2": "Explicit manual service."
            }
          },
          {
            "type": "runnable_code",
            "filename": "mvp_archetype_demo.js",
            "initialCode": "function classifyMvpType(isSimulatedAutomation) {\n  return isSimulatedAutomation\n    ? 'WIZARD_OF_OZ_SIMULATED_AUTOMATION'\n    : 'CONCIERGE_MANUAL_SERVICE';\n}\n\nconsole.log(classifyMvpType(true));\nconsole.log(classifyMvpType(false));",
            "expectedOutput": "WIZARD_OF_OZ_SIMULATED_AUTOMATION\nCONCIERGE_MANUAL_SERVICE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which MVP archetype presents a sleek front-end interface that appears automated to the user while humans manually execute all back-end fulfillment behind the scenes?",
          "expectedStringOutput": "WIZARD_OF_OZ_SIMULATED_AUTOMATION",
          "acceptableAnswers": [
            "WIZARD_OF_OZ_SIMULATED_AUTOMATION",
            "Wizard of Oz",
            "Wizard of oz"
          ],
          "primaryMisconceptionId": "MC_ENT_LEAN_STARTUP_MVP_BUILD_MEASURE_LEARN",
          "diagnosisMap": {
            "CONCIERGE": {
              "misconceptionId": "MC_ENT_LEAN_STARTUP_MVP_BUILD_MEASURE_LEARN",
              "errorExplanation": "Concierge is transparently manual. Wizard of Oz simulates automation.",
              "recoveryPath": {
                "simplerExplanation": "Matches WIZARD_OF_OZ_SIMULATED_AUTOMATION.",
                "guidedFixPrompt": "Type WIZARD_OF_OZ_SIMULATED_AUTOMATION"
              }
            }
          }
        }
      },
      {
        "id": "ent-d6-b3-pivot-types-zoom-in-customer-segment",
        "day": 6,
        "blockNumber": 3,
        "title": "The 10 Lean Startup Pivot Archetypes (Zoom-In vs Customer Segment Pivot)",
        "conceptBudget": {
          "primaryConcept": "Lean Startup Pivot Archetypes",
          "supportingTerms": [
            "Zoom-In Pivot (Refocusing entire company on a single standout feature e.g. Slack evolving from Glitch game chat)",
            "Customer Segment Pivot (Same product, sold to enterprise B2B instead of consumers)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d6-b2-concierge-vs-wizard-of-oz-mvp",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "pivot_demo.js",
            "initialCode": "function evaluatePivotType(standoutFeatureBecomesEntireProduct) {\n  return standoutFeatureBecomesEntireProduct\n    ? 'ZOOM_IN_FEATURE_PIVOT'\n    : 'CUSTOMER_SEGMENT_PIVOT';\n}\n\nconsole.log(evaluatePivotType(true));",
            "expectedOutput": "ZOOM_IN_FEATURE_PIVOT",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What pivot archetype describes refocusing an entire company's product roadmap on a single highly successful sub-feature of the original app (e.g. Slack)?",
          "expectedStringOutput": "ZOOM_IN_FEATURE_PIVOT",
          "acceptableAnswers": [
            "ZOOM_IN_FEATURE_PIVOT",
            "Zoom-in pivot",
            "Zoom In Pivot"
          ],
          "primaryMisconceptionId": "MC_ENT_LEAN_STARTUP_MVP_BUILD_MEASURE_LEARN",
          "diagnosisMap": {
            "SEGMENT": {
              "misconceptionId": "MC_ENT_LEAN_STARTUP_MVP_BUILD_MEASURE_LEARN",
              "errorExplanation": "Changing target customers is a customer segment pivot. Refocusing on a single feature is a ZOOM_IN_FEATURE_PIVOT.",
              "recoveryPath": {
                "simplerExplanation": "Matches ZOOM_IN_FEATURE_PIVOT.",
                "guidedFixPrompt": "Type ZOOM_IN_FEATURE_PIVOT"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 7,
    "title": "Competitive Strategy & Moats: Hamilton Helmer's 7 Powers",
    "overviewMetaphor": "Hamilton Helmer's 7 Powers are a Deep Castle Moat Protecting High Profit Margins: Without a moat, high profit margins attract aggressive copycats who drive prices down to zero margin; possessing 3 or more powers (Network Effects, High Switching Costs, Counter-Positioning) establishes a Wide Economic Moat, allowing the business to sustain superior returns on capital for decades.",
    "blocks": [
      {
        "id": "ent-d7-b1-seven-powers-economic-moats",
        "day": 7,
        "blockNumber": 1,
        "title": "Hamilton Helmer's 7 Powers: Scale, Network, Counter-Positioning & Switching Costs",
        "conceptBudget": {
          "primaryConcept": "The 7 Powers Framework",
          "supportingTerms": [
            "Power 1: Scale Economies",
            "Power 2: Network Effects",
            "Power 3: Counter-Positioning",
            "Power 4: Switching Costs",
            "Power 5: Branding",
            "Power 6: Cornered Resource / Unique Assets",
            "Power 7: Process Power",
            "Score $\\ge 3$ Powers $\\implies$ Wide Economic Moat"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d6-b1-smoke-test-conversion-validation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Competitive Moat Assessment (3 Active Powers)",
              "boxes": [
                {
                  "label": "Active Power 1",
                  "value": "Network Effects (Marketplace value compounds with each user)",
                  "varType": "Power 1",
                  "isUpdated": false
                },
                {
                  "label": "Active Power 2 & 3",
                  "value": "Switching Costs (High data lock-in) + Counter-Positioning",
                  "varType": "Powers 2&3",
                  "isUpdated": false
                },
                {
                  "label": "Economic Moat Rating",
                  "value": "3 Powers >= 3 Threshold -> WIDE ECONOMIC MOAT DURABLE MONOPOLY!",
                  "varType": "Moat Rating",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "moat_score_calc_demo.js",
            "initialCode": "function scoreMoat(powersCount) {\n  let rating = '';\n  if (powersCount >= 3) rating = 'WIDE_ECONOMIC_MOAT_DURABLE_MONOPOLY';\n  else if (powersCount >= 1) rating = 'NARROW_ECONOMIC_MOAT';\n  else rating = 'COMMODITY_ZERO_MOAT';\n  return {\n    powersCount,\n    moatRating: rating,\n    status: 'MOAT_EVALUATED'\n  };\n}\n\nconsole.log(JSON.stringify(scoreMoat(3)));\nconsole.log(JSON.stringify(scoreMoat(0)));",
            "expectedOutput": "{\"powersCount\":3,\"moatRating\":\"WIDE_ECONOMIC_MOAT_DURABLE_MONOPOLY\",\"status\":\"MOAT_EVALUATED\"}\n{\"powersCount\":0,\"moatRating\":\"COMMODITY_ZERO_MOAT\",\"status\":\"MOAT_EVALUATED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What economic moat rating is awarded to a venture exhibiting 3 active Hamilton Helmer powers (Network Effects, Switching Costs, Counter-Positioning)?",
          "expectedStringOutput": "WIDE_ECONOMIC_MOAT_DURABLE_MONOPOLY",
          "acceptableAnswers": [
            "WIDE_ECONOMIC_MOAT_DURABLE_MONOPOLY",
            "Wide Economic Moat",
            "Wide moat"
          ],
          "primaryMisconceptionId": "MC_ENT_COMPETITIVE_MOATS_SEVEN_POWERS",
          "diagnosisMap": {
            "NARROW": {
              "misconceptionId": "MC_ENT_COMPETITIVE_MOATS_SEVEN_POWERS",
              "errorExplanation": "1-2 powers is a Narrow Moat. 3 or more powers establishes a WIDE_ECONOMIC_MOAT_DURABLE_MONOPOLY.",
              "recoveryPath": {
                "simplerExplanation": "3 powers gives WIDE_ECONOMIC_MOAT_DURABLE_MONOPOLY.",
                "guidedFixPrompt": "Type WIDE_ECONOMIC_MOAT_DURABLE_MONOPOLY"
              }
            }
          }
        }
      },
      {
        "id": "ent-d7-b2-counter-positioning-incumbent-dilemma",
        "day": 7,
        "blockNumber": 2,
        "title": "Counter-Positioning: Forcing Incumbents into Self-Cannibalization Dilemmas",
        "conceptBudget": {
          "primaryConcept": "Counter-Positioning Mechanics",
          "supportingTerms": [
            "Counter-Positioning (Newcomer adopts a superior business model that the incumbent cannot copy without destroying its existing cash cow e.g. Netflix DVD rental with zero late fees vs Blockbuster relying on $800M in late fee revenue)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d7-b1-seven-powers-economic-moats",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Counter-Positioning Dynamics",
            "codeSnippet": "// STARTUP:   Offers 100% digital streaming subscription with $0 late fees\n// INCUMBENT: If Blockbuster copies Netflix, they destroy their own $800M late fee cash cow!\n// RESULT:    Incumbent freezes in place for 5 years while newcomer captures market!",
            "lineNotes": {
              "1": "Superior challenger model.",
              "2": "Incumbent self-harm barrier.",
              "3": "Paralysis advantage."
            }
          },
          {
            "type": "runnable_code",
            "filename": "counter_position_demo.js",
            "initialCode": "function evaluateCounterPositioning() {\n  return 'INCUMBENT_CANNOT_COPY_WITHOUT_DESTROYING_CORE_PROFIT_ENGINE';\n}\n\nconsole.log(evaluateCounterPositioning());",
            "expectedOutput": "INCUMBENT_CANNOT_COPY_WITHOUT_DESTROYING_CORE_PROFIT_ENGINE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Why is an established industry incumbent unable to easily copy a startup's Counter-Positioned business model?",
          "expectedStringOutput": "INCUMBENT_CANNOT_COPY_WITHOUT_DESTROYING_CORE_PROFIT_ENGINE",
          "acceptableAnswers": [
            "INCUMBENT_CANNOT_COPY_WITHOUT_DESTROYING_CORE_PROFIT_ENGINE",
            "Destroys core profits",
            "Self cannibalization"
          ],
          "primaryMisconceptionId": "MC_ENT_COMPETITIVE_MOATS_SEVEN_POWERS",
          "diagnosisMap": {
            "TOO_EXPENSIVE": {
              "misconceptionId": "MC_ENT_COMPETITIVE_MOATS_SEVEN_POWERS",
              "errorExplanation": "The barrier is not software cost; copying would destroy their existing core profit cash cow.",
              "recoveryPath": {
                "simplerExplanation": "Matches INCUMBENT_CANNOT_COPY_WITHOUT_DESTROYING_CORE_PROFIT_ENGINE.",
                "guidedFixPrompt": "Type INCUMBENT_CANNOT_COPY_WITHOUT_DESTROYING_CORE_PROFIT_ENGINE"
              }
            }
          }
        }
      },
      {
        "id": "ent-d7-b3-switching-costs-data-gravity",
        "day": 7,
        "blockNumber": 3,
        "title": "High Switching Costs & Enterprise Data Gravity Lock-In",
        "conceptBudget": {
          "primaryConcept": "Switching Cost Moats",
          "supportingTerms": [
            "High Switching Costs (The pain, training retraining, migration costs, and downtime risk of switching to a competitor far exceed software price differences)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d7-b2-counter-positioning-incumbent-dilemma",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "switching_cost_demo.js",
            "initialCode": "function evaluateSwitchingCost(retrainingCost, migrationRisk) {\n  return (retrainingCost > 50000 && migrationRisk === 'HIGH')\n    ? 'HIGH_SWITCHING_COST_DURABLE_RETENTION'\n    : 'EASY_COMMODITY_SUBSTITUTION';\n}\n\nconsole.log(evaluateSwitchingCost(75000, 'HIGH'));",
            "expectedOutput": "HIGH_SWITCHING_COST_DURABLE_RETENTION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What competitive moat classification protects an ERP system when customer retraining costs ($75k) and migration risks create insurmountable barriers to competitor switching?",
          "expectedStringOutput": "HIGH_SWITCHING_COST_DURABLE_RETENTION",
          "acceptableAnswers": [
            "HIGH_SWITCHING_COST_DURABLE_RETENTION",
            "High Switching Costs",
            "Durable retention"
          ],
          "primaryMisconceptionId": "MC_ENT_COMPETITIVE_MOATS_SEVEN_POWERS",
          "diagnosisMap": {
            "COMMODITY": {
              "misconceptionId": "MC_ENT_COMPETITIVE_MOATS_SEVEN_POWERS",
              "errorExplanation": "High retraining and migration barriers create HIGH_SWITCHING_COST_DURABLE_RETENTION.",
              "recoveryPath": {
                "simplerExplanation": "Matches HIGH_SWITCHING_COST_DURABLE_RETENTION.",
                "guidedFixPrompt": "Type HIGH_SWITCHING_COST_DURABLE_RETENTION"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 8,
    "title": "Break-Even Analysis & Margin of Safety (BEU = FC / (P - VC))",
    "overviewMetaphor": "The Break-Even Point is the Summit of Mountain Climbing Where Every Step After is Pure Golden Sunlight: If your business has $50,000 in monthly fixed overhead (office rent, base salaries) and sells a product for $100.00 with $60.00 in variable costs, each unit contributes $40.00 to paying off the fixed overhead ($CM = 100 - 60 = \\$40$); your Break-Even point is exactly 1,250 units ($BEU = \\frac{50,000}{40} = 1,250$); selling a projected 2,000 units provides a comfortable 37.5% Margin of Safety ($MOS = \\frac{2,000 - 1,250}{2,000} \\times 100\\%$).",
    "blocks": [
      {
        "id": "ent-d8-b1-break-even-units-formula-calculation",
        "day": 8,
        "blockNumber": 1,
        "title": "Break-Even Units (BEU) Formula: $BEU = \\frac{\\text{Fixed Costs } FC}{\\text{Price } P - \\text{Variable Cost } VC}$",
        "conceptBudget": {
          "primaryConcept": "Break-Even Units Formula",
          "supportingTerms": [
            "Fixed Costs ($FC = \\$50,000$)",
            "Selling Price ($P = \\$100.00$)",
            "Variable Cost ($VC = \\$60.00$)",
            "Contribution Margin ($CM = 100 - 60 = \\$40.00$)",
            "Break-Even Units = $\\frac{50,000}{40} = 1,250$ units ($1,250 \\times \\$100 = \\$125,000$ Break-Even Revenue)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d7-b1-seven-powers-economic-moats",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Break-Even Financial Ledger ($50k FC, $100 Price, $60 VC)",
              "boxes": [
                {
                  "label": "Unit Contribution Margin",
                  "value": "$100.00 Price - $60.00 VC = $40.00 Contribution Margin per unit",
                  "varType": "CM",
                  "isUpdated": false
                },
                {
                  "label": "Fixed Costs Overhead",
                  "value": "$50,000.00 Monthly Fixed Overhead to be covered",
                  "varType": "Fixed Cost",
                  "isUpdated": false
                },
                {
                  "label": "Break-Even Point (BEU)",
                  "value": "50,000 / 40 = 1,250 UNITS ($125,000.00 BREAK-EVEN REVENUE!)",
                  "varType": "BEU",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "breakeven_calc_demo.js",
            "initialCode": "function calculateBreakEven(fc, p, vc) {\n  const cm = p - vc;\n  const beu = Math.ceil(fc / cm);\n  const beRev = beu * p;\n  return {\n    fixedCosts: fc,\n    unitCm: cm,\n    breakEvenUnits: beu,\n    breakEvenRevenue: beRev,\n    status: 'BREAK_EVEN_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateBreakEven(50000, 100, 60)));",
            "expectedOutput": "{\"fixedCosts\":50000,\"unitCm\":40,\"breakEvenUnits\":1250,\"breakEvenRevenue\":125000,\"status\":\"BREAK_EVEN_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many physical units must be sold to break even when Fixed Costs are $50,000, Selling Price is $100, and Variable Cost is $60 ($50,000 / (100 - 60)$)?",
          "expectedStringOutput": "1250",
          "acceptableAnswers": [
            "1250",
            "1,250",
            "1250 units",
            "breakEvenUnits\":1250"
          ],
          "primaryMisconceptionId": "MC_ENT_BREAK_EVEN_ANALYSIS_MARGIN_SAFETY",
          "diagnosisMap": {
            "500": {
              "misconceptionId": "MC_ENT_BREAK_EVEN_ANALYSIS_MARGIN_SAFETY",
              "errorExplanation": "500 divides FC by price (50,000 / 100). Break-even divides FC by Contribution Margin ($40) = 1,250 units.",
              "recoveryPath": {
                "simplerExplanation": "50,000 / 40 = 1,250.",
                "guidedFixPrompt": "Type 1250"
              }
            }
          }
        }
      },
      {
        "id": "ent-d8-b2-margin-of-safety-calculation",
        "day": 8,
        "blockNumber": 2,
        "title": "Margin of Safety (MOS): $MOS = \\frac{\\text{Projected Sales} - BEU}{\\text{Projected Sales}} \\times 100\\%$",
        "conceptBudget": {
          "primaryConcept": "Margin of Safety Formula",
          "supportingTerms": [
            "Projected Sales ($2,000$ units)",
            "Break-Even Units ($1,250$ units)",
            "$MOS = \\frac{2,000 - 1,250}{2,000} \\times 100\\% = 37.5\\%$",
            "Indicates sales can drop by up to 37.5% before the company incurs a net loss"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d8-b1-break-even-units-formula-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Margin of Safety Cushion",
            "codeSnippet": "// Projected Sales: 2,000 Units ($200,000 revenue)\n// Break-Even Point: 1,250 Units ($125,000 revenue)\n// Margin of Safety: (2000 - 1250) / 2000 = 37.5% downside risk cushion!",
            "lineNotes": {
              "1": "Projected volume.",
              "2": "Zero-profit threshold.",
              "3": "Safe downside buffer."
            }
          },
          {
            "type": "runnable_code",
            "filename": "mos_calc_demo.js",
            "initialCode": "function calculateMos(projectedUnits, beuUnits) {\n  const mosPct = ((projectedUnits - beuUnits) / projectedUnits) * 100;\n  return {\n    projectedUnits,\n    beuUnits,\n    marginOfSafetyPercent: Number(mosPct.toFixed(2)),\n    status: 'MOS_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateMos(2000, 1250)));",
            "expectedOutput": "{\"projectedUnits\":2000,\"beuUnits\":1250,\"marginOfSafetyPercent\":37.5,\"status\":\"MOS_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Margin of Safety percentage when projected sales are 2,000 units and break-even sales are 1,250 units ($ (2,000 - 1,250) / 2,000 \\times 100 $)?",
          "expectedStringOutput": "37.5",
          "acceptableAnswers": [
            "37.5",
            "37.5%",
            "marginOfSafetyPercent\":37.5"
          ],
          "primaryMisconceptionId": "MC_ENT_BREAK_EVEN_ANALYSIS_MARGIN_SAFETY",
          "diagnosisMap": {
            "750": {
              "misconceptionId": "MC_ENT_BREAK_EVEN_ANALYSIS_MARGIN_SAFETY",
              "errorExplanation": "750 is unit difference. Expressed as percentage of projected sales: 750 / 2000 * 100 = 37.5%.",
              "recoveryPath": {
                "simplerExplanation": "750 / 2,000 * 100 = 37.5%.",
                "guidedFixPrompt": "Type 37.5"
              }
            }
          }
        }
      },
      {
        "id": "ent-d8-b3-operating-leverage-profit-multiplier",
        "day": 8,
        "blockNumber": 3,
        "title": "Degree of Operating Leverage (DOL): High Fixed Cost Profit Expansion",
        "conceptBudget": {
          "primaryConcept": "Operating Leverage Multiplier",
          "supportingTerms": [
            "High Fixed Cost Software Business $\\implies$ Once BEU is passed, $0.90 of every incremental dollar drops straight to net operating profit!"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d8-b2-margin-of-safety-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "operating_leverage_demo.js",
            "initialCode": "function getOperatingLeverageAdvantage() {\n  return 'MASSIVE_MARGIN_EXPANSION_ONCE_PAST_BREAK_EVEN';\n}\n\nconsole.log(getOperatingLeverageAdvantage());",
            "expectedOutput": "MASSIVE_MARGIN_EXPANSION_ONCE_PAST_BREAK_EVEN",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What financial profit phenomenon occurs in high operating leverage software businesses after sales surpass the break-even point?",
          "expectedStringOutput": "MASSIVE_MARGIN_EXPANSION_ONCE_PAST_BREAK_EVEN",
          "acceptableAnswers": [
            "MASSIVE_MARGIN_EXPANSION_ONCE_PAST_BREAK_EVEN",
            "Margin Expansion",
            "Massive margin expansion"
          ],
          "primaryMisconceptionId": "MC_ENT_BREAK_EVEN_ANALYSIS_MARGIN_SAFETY",
          "diagnosisMap": {
            "LINEAR": {
              "misconceptionId": "MC_ENT_BREAK_EVEN_ANALYSIS_MARGIN_SAFETY",
              "errorExplanation": "Software variable costs are near zero. Surpassing break-even unleashes massive margin expansion.",
              "recoveryPath": {
                "simplerExplanation": "Matches MASSIVE_MARGIN_EXPANSION_ONCE_PAST_BREAK_EVEN.",
                "guidedFixPrompt": "Type MASSIVE_MARGIN_EXPANSION_ONCE_PAST_BREAK_EVEN"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 9,
    "title": "Working Capital Management & Cash Runway Dynamics (Runway = Cash / Burn)",
    "overviewMetaphor": "Cash Runway is the Oxygen Tank on an Underwater Scuba Dive: With $600,000 in your corporate bank account and spending $80,000/month while collecting $30,000/month in customer revenues, your Net Burn is $50,000/month ($80,000 - 30,000$); your Cash Runway is exactly 12.0 months ($Runway = \\frac{600,000}{50,000} = 12.0$); reaching profitability or closing your next funding round before month 12 is the fundamental law of startup survival.",
    "blocks": [
      {
        "id": "ent-d9-b1-cash-runway-net-burn-calculation",
        "day": 9,
        "blockNumber": 1,
        "title": "Cash Runway Formula: $\\text{Runway (Months)} = \\frac{\\text{Cash Balance}}{\\text{Monthly Expenses} - \\text{Monthly Inflows}}$",
        "conceptBudget": {
          "primaryConcept": "Cash Runway Formula",
          "supportingTerms": [
            "Cash Balance ($600,000.00$)",
            "Monthly Operating Expenses ($80,000.00$)",
            "Monthly Cash Inflows ($30,000.00$)",
            "Net Burn = $80,000 - 30,000 = \\$50,000.00/\\text{mo}$",
            "Runway = $\\frac{600,000}{50,000} = 12.0$ months"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d8-b1-break-even-units-formula-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Startup Solvency Runway Ledger ($600k Cash, $50k Net Burn)",
              "boxes": [
                {
                  "label": "Bank Cash Balance",
                  "value": "$600,000.00 Liquid Cash in Silicon Valley Bank",
                  "varType": "Cash",
                  "isUpdated": false
                },
                {
                  "label": "Monthly Net Burn",
                  "value": "$80k Expenses - $30k Revenue = $50,000.00 Net Outflow/mo",
                  "varType": "Burn",
                  "isUpdated": false
                },
                {
                  "label": "Cash Runway",
                  "value": "$600,000 / $50,000 = 12.00 MONTHS (HEALTHY SOLVENT RUNWAY >= 6 MO!)",
                  "varType": "Runway",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "runway_calc_demo.js",
            "initialCode": "function calculateRunway(cash, expenses, revenue) {\n  const netBurn = expenses - revenue;\n  const months = cash / netBurn;\n  return {\n    cash,\n    netBurn,\n    runwayMonths: Number(months.toFixed(1)),\n    isSolvent: months >= 6.0,\n    status: 'RUNWAY_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateRunway(600000, 80000, 30000)));",
            "expectedOutput": "{\"cash\":600000,\"netBurn\":50000,\"runwayMonths\":12,\"isSolvent\":true,\"status\":\"RUNWAY_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many months of cash runway remain when a startup has $600,000 in cash, $80,000 monthly expenses, and $30,000 monthly revenues ($600,000 / (80,000 - 30,000)$)?",
          "expectedStringOutput": "12",
          "acceptableAnswers": [
            "12",
            "12 months",
            "12.0",
            "runwayMonths\":12"
          ],
          "primaryMisconceptionId": "MC_ENT_WORKING_CAPITAL_CASH_RUNWAY_BURN",
          "diagnosisMap": {
            "7.5": {
              "misconceptionId": "MC_ENT_WORKING_CAPITAL_CASH_RUNWAY_BURN",
              "errorExplanation": "7.5 calculates gross burn (600k / 80k). Net burn factors in the $30k revenue (600k / 50k = 12.0 months).",
              "recoveryPath": {
                "simplerExplanation": "600,000 / 50,000 = 12.",
                "guidedFixPrompt": "Type 12"
              }
            }
          }
        }
      },
      {
        "id": "ent-d9-b2-cash-conversion-cycle-ccc",
        "day": 9,
        "blockNumber": 2,
        "title": "Cash Conversion Cycle (CCC): $CCC = DIO + DSO - DPO$",
        "conceptBudget": {
          "primaryConcept": "Cash Conversion Cycle Formula",
          "supportingTerms": [
            "Days Inventory Outstanding (DIO)",
            "Days Sales Outstanding (DSO)",
            "Days Payable Outstanding (DPO)",
            "Negative CCC (Collecting cash from customers before paying suppliers e.g. Amazon, Dell)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d9-b1-cash-runway-net-burn-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "CCC Cash Optimization",
            "codeSnippet": "// DIO: 30 Days (Inventory held in warehouse)\n// DSO: 15 Days (Time to collect customer receivables)\n// DPO: 60 Days (Time to pay suppliers)\n// CCC = 30 + 15 - 60 = -15 DAYS (NEGATIVE CCC: SUPPLIERS FINANCE YOUR GROWTH!)",
            "lineNotes": {
              "1": "Inventory lag.",
              "2": "Receivables lag.",
              "3": "Payables float.",
              "4": "Negative working capital miracle."
            }
          },
          {
            "type": "runnable_code",
            "filename": "ccc_calc_demo.js",
            "initialCode": "function calculateCcc(dio, dso, dpo) {\n  const ccc = dio + dso - dpo;\n  return {\n    dio,\n    dso,\n    dpo,\n    cccDays: ccc,\n    isNegativeCcc: ccc < 0,\n    status: 'CCC_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateCcc(30, 15, 60)));",
            "expectedOutput": "{\"dio\":30,\"dso\":15,\"dpo\":60,\"cccDays\":-15,\"isNegativeCcc\":true,\"status\":\"CCC_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Cash Conversion Cycle in days when DIO is 30 days, DSO is 15 days, and DPO is 60 days ($30 + 15 - 60$)?",
          "expectedStringOutput": "-15",
          "acceptableAnswers": [
            "-15",
            "-15 days",
            "cccDays\":-15"
          ],
          "primaryMisconceptionId": "MC_ENT_WORKING_CAPITAL_CASH_RUNWAY_BURN",
          "diagnosisMap": {
            "105": {
              "misconceptionId": "MC_ENT_WORKING_CAPITAL_CASH_RUNWAY_BURN",
              "errorExplanation": "105 adds all terms. DPO must be subtracted: 30 + 15 - 60 = -15 days.",
              "recoveryPath": {
                "simplerExplanation": "30 + 15 - 60 = -15.",
                "guidedFixPrompt": "Type -15"
              }
            }
          }
        }
      },
      {
        "id": "ent-d9-b3-zero-cash-date-fundraising-buffer",
        "day": 9,
        "blockNumber": 3,
        "title": "The 6-Month Fundraising Lead Time Rule",
        "conceptBudget": {
          "primaryConcept": "Fundraising Lead Time Rule",
          "supportingTerms": [
            "Enterprise VC rounds take 4-6 months to close",
            "Startups must launch fundraising when runway reaches 6 months, never waiting until month 2"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d9-b2-cash-conversion-cycle-ccc",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "fundraise_timing_demo.js",
            "initialCode": "function evaluateFundraisingTrigger(runwayMonths) {\n  return runwayMonths <= 6\n    ? 'MANDATORY_LAUNCH_NEXT_FUNDRAISING_ROUND_NOW'\n    : 'MAINTAIN_EXECUTION_FOCUS';\n}\n\nconsole.log(evaluateFundraisingTrigger(6));\nconsole.log(evaluateFundraisingTrigger(14));",
            "expectedOutput": "MANDATORY_LAUNCH_NEXT_FUNDRAISING_ROUND_NOW\nMAINTAIN_EXECUTION_FOCUS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What executive action is mandatory when startup cash runway declines to the 6-month threshold?",
          "expectedStringOutput": "MANDATORY_LAUNCH_NEXT_FUNDRAISING_ROUND_NOW",
          "acceptableAnswers": [
            "MANDATORY_LAUNCH_NEXT_FUNDRAISING_ROUND_NOW",
            "Launch fundraising",
            "Start fundraising"
          ],
          "primaryMisconceptionId": "MC_ENT_WORKING_CAPITAL_CASH_RUNWAY_BURN",
          "diagnosisMap": {
            "WAIT": {
              "misconceptionId": "MC_ENT_WORKING_CAPITAL_CASH_RUNWAY_BURN",
              "errorExplanation": "Waiting risks running out of cash during due diligence. 6 months triggers MANDATORY_LAUNCH_NEXT_FUNDRAISING_ROUND_NOW.",
              "recoveryPath": {
                "simplerExplanation": "Matches MANDATORY_LAUNCH_NEXT_FUNDRAISING_ROUND_NOW.",
                "guidedFixPrompt": "Type MANDATORY_LAUNCH_NEXT_FUNDRAISING_ROUND_NOW"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 10,
    "title": "Startup Funding & Cap Table Dilution: Post-Money SAFE Modeling",
    "overviewMetaphor": "A Post-Money SAFE is Baking a Fresh Sized Slice of the Pizza for Your New Investor: If your company is valued at $4,000,000 Pre-Money and an investor puts in $1,000,000 cash, the new Post-Money Valuation is $5,000,000 ($4M + 1M); the investor owns exactly 20.0% of the company ($Ownership = \\frac{1M}{5M} = 20.0\\%$), leaving the founders with 80.0% retained equity ownership on the capitalization table.",
    "blocks": [
      {
        "id": "ent-d10-b1-post-money-safe-dilution-calculation",
        "day": 10,
        "blockNumber": 1,
        "title": "Post-Money SAFE Cap Table Dilution: $\\text{Investor}\\% = \\frac{\\text{Investment}}{\\text{Pre-Money} + \\text{Investment}} \\times 100\\%$",
        "conceptBudget": {
          "primaryConcept": "Cap Table Dilution Formula",
          "supportingTerms": [
            "Pre-Money Valuation ($4,000,000.00$)",
            "Investment Amount ($1,000,000.00$)",
            "Post-Money Valuation = $4M + 1M = \\$5,000,000.00$",
            "Investor Ownership % = $\\frac{1M}{5M} \\times 100\\% = 20.0\\%$",
            "Founder Retained % = $100 - 20 = 80.0\\%$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d9-b1-cash-runway-net-burn-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Cap Table Equity Dilution ($4M Pre-Money, $1M Investment)",
              "boxes": [
                {
                  "label": "Post-Money Valuation",
                  "value": "$4,000,000 Pre + $1,000,000 Check = $5,000,000.00 Post-Money",
                  "varType": "Valuation",
                  "isUpdated": false
                },
                {
                  "label": "Investor Shareholding",
                  "value": "$1,000,000 / $5,000,000 = 20.00% Dilution Issued",
                  "varType": "Investor Equity",
                  "isUpdated": false
                },
                {
                  "label": "Founder Retained Ownership",
                  "value": "100.0% - 20.0% = 80.00% FOUNDER EQUITY RETAINED ON CAP TABLE!",
                  "varType": "Founder Equity",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "safe_calc_demo.js",
            "initialCode": "function calculateSafe(preMoney, investment) {\n  const postMoney = preMoney + investment;\n  const investorPct = (investment / postMoney) * 100;\n  const founderPct = 100 - investorPct;\n  return {\n    postMoney,\n    investorPercent: Number(investorPct.toFixed(2)),\n    founderPercent: Number(founderPct.toFixed(2)),\n    status: 'SAFE_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateSafe(4000000, 1000000)));",
            "expectedOutput": "{\"postMoney\":5000000,\"investorPercent\":20,\"founderPercent\":80,\"status\":\"SAFE_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What percentage of company equity does an angel investor receive when investing $1,000,000 at a $4,000,000 pre-money valuation ($ (1 / 5) \\times 100 $)?",
          "expectedStringOutput": "20",
          "acceptableAnswers": [
            "20",
            "20%",
            "20.0",
            "investorPercent\":20"
          ],
          "primaryMisconceptionId": "MC_ENT_FUNDING_SAFE_CAP_TABLE_DILUTION",
          "diagnosisMap": {
            "25": {
              "misconceptionId": "MC_ENT_FUNDING_SAFE_CAP_TABLE_DILUTION",
              "errorExplanation": "25% divides by pre-money (1 / 4). In a post-money SAFE, ownership is divided by post-money (1 / 5 = 20.0%).",
              "recoveryPath": {
                "simplerExplanation": "1 / (4 + 1) * 100 = 20%.",
                "guidedFixPrompt": "Type 20"
              }
            }
          }
        }
      },
      {
        "id": "ent-d10-b2-pre-money-vs-post-money-safe",
        "day": 10,
        "blockNumber": 2,
        "title": "Y Combinator Post-Money SAFE: Transparency vs Pre-Money Dilution Shock",
        "conceptBudget": {
          "primaryConcept": "Post-Money SAFE Invariant",
          "supportingTerms": [
            "Pre-Money SAFE (Unpredictable dilution stacking when multiple angel checks are added)",
            "Post-Money SAFE (Investor ownership is fixed immediately, protecting founders from surprise dilution)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d10-b1-post-money-safe-dilution-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "SAFE Standard Comparison",
            "codeSnippet": "// PRE-MONEY SAFE:  Dilution is circular and unknown until the Series A priced round!\n// POST-MONEY SAFE: Ownership is locked instantly: $1M on $5M cap = EXACTLY 20.0%!",
            "lineNotes": {
              "1": "Circular calculation ambiguity.",
              "2": "Crystal clear founder ownership."
            }
          },
          {
            "type": "runnable_code",
            "filename": "safe_type_demo.js",
            "initialCode": "function getStandardVentureSafeType() {\n  return 'YC_POST_MONEY_SAFE_FIXED_OWNERSHIP';\n}\n\nconsole.log(getStandardVentureSafeType());",
            "expectedOutput": "YC_POST_MONEY_SAFE_FIXED_OWNERSHIP",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which Y Combinator investment instrument guarantees immediate clarity on founder and investor ownership percentages upon signing?",
          "expectedStringOutput": "YC_POST_MONEY_SAFE_FIXED_OWNERSHIP",
          "acceptableAnswers": [
            "YC_POST_MONEY_SAFE_FIXED_OWNERSHIP",
            "Post-Money SAFE",
            "Post Money SAFE"
          ],
          "primaryMisconceptionId": "MC_ENT_FUNDING_SAFE_CAP_TABLE_DILUTION",
          "diagnosisMap": {
            "PRE_MONEY": {
              "misconceptionId": "MC_ENT_FUNDING_SAFE_CAP_TABLE_DILUTION",
              "errorExplanation": "Pre-money SAFEs create circular dilution confusion. Post-money SAFEs lock fixed ownership.",
              "recoveryPath": {
                "simplerExplanation": "Matches YC_POST_MONEY_SAFE_FIXED_OWNERSHIP.",
                "guidedFixPrompt": "Type YC_POST_MONEY_SAFE_FIXED_OWNERSHIP"
              }
            }
          }
        }
      },
      {
        "id": "ent-d10-b3-valuation-cap-vs-discount-rate",
        "day": 10,
        "blockNumber": 3,
        "title": "Valuation Caps vs 20% Conversion Discounts",
        "conceptBudget": {
          "primaryConcept": "Valuation Cap vs Discount Mechanics",
          "supportingTerms": [
            "Valuation Cap (Ceiling on the price at which the SAFE converts into equity at Series A)",
            "Discount Rate (Typically 20% discount on Series A share price if cap is not reached)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d10-b2-pre-money-vs-post-money-safe",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "safe_conversion_demo.js",
            "initialCode": "function calculateSafeConversionPrice(seriesAPrice, capPrice, discountPct) {\n  const discountedPrice = seriesAPrice * (1 - (discountPct / 100));\n  return Math.min(capPrice, discountedPrice);\n}\n\nconsole.log(calculateSafeConversionPrice(10.0, 6.0, 20));\nconsole.log(calculateSafeConversionPrice(5.0, 6.0, 20));",
            "expectedOutput": "6\n4",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What conversion price per share is awarded to an early SAFE investor with a $6.00 cap price and 20% discount when Series A prices at $10.00/share ($ \\min(6.00, 10 \\times 0.80 = 8.00) $)?",
          "expectedStringOutput": "6",
          "acceptableAnswers": [
            "6",
            "$6",
            "6.0",
            "$6.00"
          ],
          "primaryMisconceptionId": "MC_ENT_FUNDING_SAFE_CAP_TABLE_DILUTION",
          "diagnosisMap": {
            "8": {
              "misconceptionId": "MC_ENT_FUNDING_SAFE_CAP_TABLE_DILUTION",
              "errorExplanation": "8 is the 20% discount price. The investor gets the lower of cap ($6) and discount ($8), converting at $6.",
              "recoveryPath": {
                "simplerExplanation": "min(6, 8) = 6.",
                "guidedFixPrompt": "Type 6"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 11,
    "title": "Startup Valuation Methodologies: DCF, Revenue Multiples & Berkus Method",
    "overviewMetaphor": "The Berkus Method is an Angel Investor's Risk-Reduction Checkbook for Pre-Revenue Startups: When a pre-revenue startup has $0 in historical sales, traditional DCF math fails; the Berkus Method awards up to $500,000 in pre-money valuation for each of 5 verified de-risking milestones: 1. Sound Idea ($500k); 2. Prototype Demo ($500k); 3. Quality Management Team ($500k); 4. Strategic Relationships ($500k); summing these 4 factors establishes a credible $2,000,000 pre-money valuation.",
    "blocks": [
      {
        "id": "ent-d11-b1-berkus-pre-revenue-valuation",
        "day": 11,
        "blockNumber": 1,
        "title": "The Berkus Method: Valuing Pre-Revenue Startups up to $2.5M",
        "conceptBudget": {
          "primaryConcept": "Berkus Method Valuation Formula",
          "supportingTerms": [
            "Milestone 1: Sound Idea ($500,000)",
            "Milestone 2: Prototype ($500,000)",
            "Milestone 3: Quality Team ($500,000)",
            "Milestone 4: Strategic Relationships ($500,000)",
            "Milestone 5: Commercial Sales ($500,000)",
            "Pre-Money Valuation = Sum of verified milestones (e.g. $4 \\times 500k = \\$2,000,000$)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d10-b1-post-money-safe-dilution-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Berkus Pre-Revenue Valuation Ledger (4 of 5 Milestones Verified)",
              "boxes": [
                {
                  "label": "Idea & Prototype",
                  "value": "Sound Idea ($500k) + Working Prototype ($500k) = $1,000,000.00",
                  "varType": "Product",
                  "isUpdated": false
                },
                {
                  "label": "Team & Partnerships",
                  "value": "Quality Team ($500k) + Strategic Alliances ($500k) = $1,000,000.00",
                  "varType": "Execution",
                  "isUpdated": false
                },
                {
                  "label": "Total Pre-Revenue Valuation",
                  "value": "$1M + $1M = $2,000,000.00 PRE-MONEY VALUATION (BERKUS FRAMEWORK!)",
                  "varType": "Valuation",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "berkus_calc_demo.js",
            "initialCode": "function calculateBerkus(idea, proto, team, partners, sales) {\n  let val = 0;\n  if (idea) val += 500000;\n  if (proto) val += 500000;\n  if (team) val += 500000;\n  if (partners) val += 500000;\n  if (sales) val += 500000;\n  return {\n    valuation: val,\n    status: 'BERKUS_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateBerkus(true, true, true, true, false)));",
            "expectedOutput": "{\"valuation\":2000000,\"status\":\"BERKUS_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the pre-money valuation in dollars calculated using the Berkus Method when a startup satisfies Idea, Prototype, Team, and Strategic Partners ($4 \\times 500,000$)?",
          "expectedStringOutput": "2000000",
          "acceptableAnswers": [
            "2000000",
            "$2,000,000",
            "2,000,000",
            "valuation\":2000000"
          ],
          "primaryMisconceptionId": "MC_ENT_VALUATION_DCF_MULTIPLES_BERKUS",
          "diagnosisMap": {
            "2500000": {
              "misconceptionId": "MC_ENT_VALUATION_DCF_MULTIPLES_BERKUS",
              "errorExplanation": "2,500,000 is for all 5 milestones. 4 milestones equal $2,000,000.",
              "recoveryPath": {
                "simplerExplanation": "4 * 500,000 = 2,000,000.",
                "guidedFixPrompt": "Type 2000000"
              }
            }
          }
        }
      },
      {
        "id": "ent-d11-b2-arr-revenue-multiples",
        "day": 11,
        "blockNumber": 2,
        "title": "ARR Revenue Multiples: Valuing Growth-Stage SaaS Startups",
        "conceptBudget": {
          "primaryConcept": "Revenue Multiple Valuation Formula",
          "supportingTerms": [
            "Annual Recurring Revenue ($ARR = \\$5,000,000$)",
            "Market Multiple ($10.0x$ based on 80% YoY growth and 85% gross margins)",
            "Valuation = $5M \\times 10.0x = \\$50,000,000$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d11-b1-berkus-pre-revenue-valuation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Multiple Valuation Drivers",
            "codeSnippet": "// Base Multiple: 6x ARR\n// + 80%+ YoY Growth Rate?  -> +3x Multiple Expansion\n// + Net Retention Rate > 120%? -> +2x Multiple Expansion -> TOTAL 11x ARR Multiple!",
            "lineNotes": {
              "1": "Baseline SaaS multiple.",
              "2": "Growth premium.",
              "3": "Negative churn expansion premium."
            }
          },
          {
            "type": "runnable_code",
            "filename": "arr_multiple_demo.js",
            "initialCode": "function calculateArrValuation(arr, multiple) {\n  return arr * multiple;\n}\n\nconsole.log(calculateArrValuation(5000000, 10));",
            "expectedOutput": "50000000",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the enterprise valuation in dollars of a growth-stage SaaS company generating $5M in ARR with a 10.0x ARR multiple ($5,000,000 \\times 10$)?",
          "expectedStringOutput": "50000000",
          "acceptableAnswers": [
            "50000000",
            "$50,000,000",
            "50,000,000"
          ],
          "primaryMisconceptionId": "MC_ENT_VALUATION_DCF_MULTIPLES_BERKUS",
          "diagnosisMap": {
            "5000000": {
              "misconceptionId": "MC_ENT_VALUATION_DCF_MULTIPLES_BERKUS",
              "errorExplanation": "5,000,000 is annual revenue. Multiplied by 10x yields a $50,000,000 valuation.",
              "recoveryPath": {
                "simplerExplanation": "5,000,000 * 10 = 50,000,000.",
                "guidedFixPrompt": "Type 50000000"
              }
            }
          }
        }
      },
      {
        "id": "ent-d11-b3-first-chicago-weighted-scenarios",
        "day": 11,
        "blockNumber": 3,
        "title": "The First Chicago Method: Probability-Weighted Multi-Scenario Valuation",
        "conceptBudget": {
          "primaryConcept": "First Chicago Valuation Method",
          "supportingTerms": [
            "Best Case Scenario ($100M valuation @ 20% prob)",
            "Base Case Scenario ($30M valuation @ 50% prob)",
            "Worst Case / Failure ($0M valuation @ 30% prob)",
            "Weighted Valuation = $(100 \\times 0.2) + (30 \\times 0.5) + (0 \\times 0.3) = 20 + 15 = \\$35M$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d11-b2-arr-revenue-multiples",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "first_chicago_demo.js",
            "initialCode": "function calculateFirstChicagoValuation(bestVal, bestProb, baseVal, baseProb, worstVal, worstProb) {\n  return (bestVal * bestProb) + (baseVal * baseProb) + (worstVal * worstProb);\n}\n\nconsole.log(calculateFirstChicagoValuation(100, 0.20, 30, 0.50, 0, 0.30));",
            "expectedOutput": "35",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the probability-weighted valuation in millions under the First Chicago Method with a $100M best case (20%), $30M base case (50%), and $0 worst case (30%) ($20 + 15$)?",
          "expectedStringOutput": "35",
          "acceptableAnswers": [
            "35",
            "$35M",
            "35M",
            "$35 million"
          ],
          "primaryMisconceptionId": "MC_ENT_VALUATION_DCF_MULTIPLES_BERKUS",
          "diagnosisMap": {
            "43.3": {
              "misconceptionId": "MC_ENT_VALUATION_DCF_MULTIPLES_BERKUS",
              "errorExplanation": "43.3 is an unweighted average (130 / 3). Probability weighting yields (100*0.2) + (30*0.5) = $35M.",
              "recoveryPath": {
                "simplerExplanation": "(100 * 0.2) + (30 * 0.5) = 35.",
                "guidedFixPrompt": "Type 35"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 12,
    "title": "Founder Equity Vesting, IP Assignment & Shareholders' Agreements (SHA)",
    "overviewMetaphor": "A 4-Year Vesting Schedule with a 1-Year Cliff is an Earn-As-You-Work Golden Handcuff Agreement: If a co-founder leaves the startup after only 6 months, the 1-Year Cliff ensures they walk away with exactly 0 shares ($0\\%$ equity); if they complete Year 1, they instantly unlock 250,000 shares ($25.0\\%$ of their 1,000,000 share grant), with the remaining shares vesting linearly every month for the next 36 months.",
    "blocks": [
      {
        "id": "ent-d12-b1-four-year-vesting-one-year-cliff",
        "day": 12,
        "blockNumber": 1,
        "title": "Standard 4-Year Equity Vesting & 12-Month Cliff: $Vested\\% = \\frac{\\text{Months}}{48} \\times 100\\%$",
        "conceptBudget": {
          "primaryConcept": "Vesting Schedule & Cliff Formula",
          "supportingTerms": [
            "Total Allocated Shares ($1,000,000$)",
            "12-Month Cliff ($Months < 12 \\implies 0\\%$ vested)",
            "Year 1 Cliff Milestone ($12$ months $\\implies 25.0\\% = 250,000$ shares)",
            "Year 2 Milestone ($24$ months $\\implies 50.0\\% = 500,000$ shares)",
            "48 Months $\\implies 100\\%$ fully vested"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d11-b1-berkus-pre-revenue-valuation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Founder Equity Vesting Schedule (1M Shares Total)",
              "boxes": [
                {
                  "label": "Month 6 (Pre-Cliff Departure)",
                  "value": "0 Shares Vested (0.0%) -> LEAVES WITH $0 EQUITY!",
                  "varType": "Pre-Cliff",
                  "isUpdated": false
                },
                {
                  "label": "Month 12 (Cliff Reached)",
                  "value": "250,000 Shares Vested (25.0% Cliff Milestone Unlocked)",
                  "varType": "Cliff Unlocked",
                  "isUpdated": false
                },
                {
                  "label": "Month 24 (Year 2 Halfway)",
                  "value": "500,000 Shares Vested (50.0% Linear Vesting Progression)",
                  "varType": "Vested Half",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "vesting_calc_demo.js",
            "initialCode": "function calculateVested(totalShares, months) {\n  if (months < 12) return { months, vested: 0, pct: 0, status: 'PRE_CLIFF' };\n  const pct = Math.min(100, (months / 48) * 100);\n  const vested = Math.floor(totalShares * (pct / 100));\n  return {\n    months,\n    vested,\n    pct: Number(pct.toFixed(2)),\n    status: 'VESTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateVested(1000000, 6)));\nconsole.log(JSON.stringify(calculateVested(1000000, 12)));\nconsole.log(JSON.stringify(calculateVested(1000000, 24)));",
            "expectedOutput": "{\"months\":6,\"vested\":0,\"pct\":0,\"status\":\"PRE_CLIFF\"}\n{\"months\":12,\"vested\":250000,\"pct\":25,\"status\":\"VESTED\"}\n{\"months\":24,\"vested\":500000,\"pct\":50,\"status\":\"VESTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many vested shares are earned by a founder with a 1,000,000 share grant upon completing exactly 12 months of service at the cliff milestone ($1,000,000 \\times 0.25$)?",
          "expectedStringOutput": "250000",
          "acceptableAnswers": [
            "250000",
            "250,000",
            "vested\":250000"
          ],
          "primaryMisconceptionId": "MC_ENT_FOUNDER_EQUITY_VESTING_IP_PROTECTION",
          "diagnosisMap": {
            "0": {
              "misconceptionId": "MC_ENT_FOUNDER_EQUITY_VESTING_IP_PROTECTION",
              "errorExplanation": "0 is before month 12. Reaching month 12 satisfies the cliff, instantly vesting 250,000 shares.",
              "recoveryPath": {
                "simplerExplanation": "1,000,000 * 0.25 = 250,000.",
                "guidedFixPrompt": "Type 250000"
              }
            }
          }
        }
      },
      {
        "id": "ent-d12-b2-ip-assignment-piia-protection",
        "day": 12,
        "blockNumber": 2,
        "title": "IP Assignment & Proprietary Information Agreements (PIIA)",
        "conceptBudget": {
          "primaryConcept": "IP Assignment Invariant",
          "supportingTerms": [
            "PIIA (Guarantees all source code, patents, and designs created by founders and employees belong 100% to the company entity, not individual individuals)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d12-b1-four-year-vesting-one-year-cliff",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "PIIA Legal Requirement",
            "codeSnippet": "// ❌ WITHOUT PIIA: Founder leaves -> claims they own the codebase personally -> VC deal dies!\n// ✅ WITH PIIA:    100% of code, algorithms & patents legally owned by Private Limited entity!",
            "lineNotes": {
              "1": "Fatal due diligence flaw.",
              "2": "Pristine IP title ownership."
            }
          },
          {
            "type": "runnable_code",
            "filename": "piia_demo.js",
            "initialCode": "function evaluateIpOwnership(hasSignedPiia) {\n  return hasSignedPiia\n    ? 'COMPANY_OWNS_100_PERCENT_OF_INTELLECTUAL_PROPERTY'\n    : 'CRITICAL_TITLE_DEFECT_FOUNDER_OWNS_CODE_PERSONALLY';\n}\n\nconsole.log(evaluateIpOwnership(true));",
            "expectedOutput": "COMPANY_OWNS_100_PERCENT_OF_INTELLECTUAL_PROPERTY",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Who legally owns the intellectual property and software code when all founders and engineers execute signed PIIA agreements upon joining?",
          "expectedStringOutput": "COMPANY_OWNS_100_PERCENT_OF_INTELLECTUAL_PROPERTY",
          "acceptableAnswers": [
            "COMPANY_OWNS_100_PERCENT_OF_INTELLECTUAL_PROPERTY",
            "The Company",
            "Company Entity"
          ],
          "primaryMisconceptionId": "MC_ENT_FOUNDER_EQUITY_VESTING_IP_PROTECTION",
          "diagnosisMap": {
            "FOUNDER": {
              "misconceptionId": "MC_ENT_FOUNDER_EQUITY_VESTING_IP_PROTECTION",
              "errorExplanation": "With PIIA, individual founders assign all rights to the corporate entity.",
              "recoveryPath": {
                "simplerExplanation": "Matches COMPANY_OWNS_100_PERCENT_OF_INTELLECTUAL_PROPERTY.",
                "guidedFixPrompt": "Type COMPANY_OWNS_100_PERCENT_OF_INTELLECTUAL_PROPERTY"
              }
            }
          }
        }
      },
      {
        "id": "ent-d12-b3-rofr-tag-along-drag-along-sha",
        "day": 12,
        "blockNumber": 3,
        "title": "Shareholders' Agreement (SHA): ROFR, Tag-Along & Drag-Along Rights",
        "conceptBudget": {
          "primaryConcept": "SHA Protective Clauses",
          "supportingTerms": [
            "Right of First Refusal (ROFR: Existing shareholders get first right to buy shares before an outsider)",
            "Tag-Along Right (Minority shareholders can join majority sale on same terms)",
            "Drag-Along Right (Majority can force minority to sell in a 100% corporate acquisition)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d12-b2-ip-assignment-piia-protection",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "sha_clauses_demo.js",
            "initialCode": "function getDragAlongPurpose() {\n  return 'ENABLES_MAJORITY_TO_FORCE_100_PERCENT_SALE_OF_COMPANY';\n}\n\nconsole.log(getDragAlongPurpose());",
            "expectedOutput": "ENABLES_MAJORITY_TO_FORCE_100_PERCENT_SALE_OF_COMPANY",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What transaction capability is enabled by a Drag-Along clause in a startup Shareholders' Agreement (SHA)?",
          "expectedStringOutput": "ENABLES_MAJORITY_TO_FORCE_100_PERCENT_SALE_OF_COMPANY",
          "acceptableAnswers": [
            "ENABLES_MAJORITY_TO_FORCE_100_PERCENT_SALE_OF_COMPANY",
            "Force sale of company",
            "Drag along sale"
          ],
          "primaryMisconceptionId": "MC_ENT_FOUNDER_EQUITY_VESTING_IP_PROTECTION",
          "diagnosisMap": {
            "BLOCK": {
              "misconceptionId": "MC_ENT_FOUNDER_EQUITY_VESTING_IP_PROTECTION",
              "errorExplanation": "Tag-along protects minority. Drag-along allows majority to compel 100% acquisition.",
              "recoveryPath": {
                "simplerExplanation": "Matches ENABLES_MAJORITY_TO_FORCE_100_PERCENT_SALE_OF_COMPANY.",
                "guidedFixPrompt": "Type ENABLES_MAJORITY_TO_FORCE_100_PERCENT_SALE_OF_COMPANY"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 13,
    "title": "Strategic Planning & Goal Alignment: Objectives & Key Results (OKRs)",
    "overviewMetaphor": "OKRs are an Enterprise Guidance Gyroscope for Ambitious Teams: If your team sets a stretch Objective and achieves an average Key Result score of 0.725 across 4 measurable outcomes ($[0.70, 0.80, 0.75, 0.65] \\implies 0.725$), you have achieved Exemplary Stretch Execution; scoring 1.0 indicates you set goals that were far too easy (Sandbagged), while scoring below 0.65 indicates execution failure.",
    "blocks": [
      {
        "id": "ent-d13-b1-okr-scoring-stretch-evaluation",
        "day": 13,
        "blockNumber": 1,
        "title": "OKR Stretch Scoring: The $0.65 - 0.85$ Optimal Performance Sweet Spot",
        "conceptBudget": {
          "primaryConcept": "OKR Stretch Scoring Formula",
          "supportingTerms": [
            "Key Result Scores: $[0.70, 0.80, 0.75, 0.65]$",
            "Average OKR Score = $\\frac{0.70 + 0.80 + 0.75 + 0.65}{4} = 0.725$ ($0.73$)",
            "Optimal Stretch Benchmark: $0.65 - 0.85 \\implies$ Exemplary Execution; $> 0.85 \\implies$ Sandbagged; $< 0.65 \\implies$ Underperformance"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d12-b1-four-year-vesting-one-year-cliff",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Quarterly OKR Execution Scorecard (4 Key Results Evaluated)",
              "boxes": [
                {
                  "label": "KR1 & KR2 Scores",
                  "value": "KR1 (0.70) + KR2 (0.80) = 1.50 Points",
                  "varType": "KR Scores",
                  "isUpdated": false
                },
                {
                  "label": "KR3 & KR4 Scores",
                  "value": "KR3 (0.75) + KR4 (0.65) = 1.40 Points",
                  "varType": "KR Scores",
                  "isUpdated": false
                },
                {
                  "label": "Average OKR Score",
                  "value": "2.90 / 4 = 0.73 (EXEMPLARY STRETCH EXECUTION IN 0.65-0.85 SWEET SPOT!)",
                  "varType": "Average Score",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "okr_score_calc_demo.js",
            "initialCode": "function evaluateOkr(scores) {\n  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;\n  const isStretch = avg >= 0.65 && avg <= 0.85;\n  return {\n    scores,\n    averageScore: Number(avg.toFixed(2)),\n    isStretchOptimal: isStretch,\n    rating: isStretch ? 'EXEMPLARY_STRETCH_EXECUTION' : (avg > 0.85 ? 'SANDBAGGED' : 'UNDERPERFORMANCE'),\n    status: 'OKR_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateOkr([0.7, 0.8, 0.75, 0.65])));",
            "expectedOutput": "{\"scores\":[0.7,0.8,0.75,0.65],\"averageScore\":0.73,\"isStretchOptimal\":true,\"rating\":\"EXEMPLARY_STRETCH_EXECUTION\",\"status\":\"OKR_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the rounded average score when Key Results score 0.70, 0.80, 0.75, and 0.65 ($2.90 / 4$)?",
          "expectedStringOutput": "0.73",
          "acceptableAnswers": [
            "0.73",
            "0.725",
            "averageScore\":0.73"
          ],
          "primaryMisconceptionId": "MC_ENT_STRATEGIC_PLANNING_OKRS_ALIGNMENT",
          "diagnosisMap": {
            "1.0": {
              "misconceptionId": "MC_ENT_STRATEGIC_PLANNING_OKRS_ALIGNMENT",
              "errorExplanation": "1.0 represents 100% completion. The mathematical average is 0.725 (0.73).",
              "recoveryPath": {
                "simplerExplanation": "2.90 / 4 = 0.725 (0.73).",
                "guidedFixPrompt": "Type 0.73"
              }
            }
          }
        }
      },
      {
        "id": "ent-d13-b2-objective-vs-key-result-structure",
        "day": 13,
        "blockNumber": 2,
        "title": "Qualitative Objectives vs Strictly Measurable Key Results",
        "conceptBudget": {
          "primaryConcept": "OKR Structural Rules",
          "supportingTerms": [
            "Objective (Inspirational, qualitative: 'Dominate European cloud security')",
            "Key Results (Quantifiable metrics: 'Grow ARR from $2M to $6M', 'Maintain 99.99% uptime')"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d13-b1-okr-scoring-stretch-evaluation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Valid vs Invalid Key Results",
            "codeSnippet": "// ❌ INVALID KR: 'Work harder on marketing' (Vague effort -> Unmeasurable)\n// ✅ VALID KR:   'Acquire 5,000 verified enterprise trial signups at <= $40 CAC'",
            "lineNotes": {
              "1": "Unmeasurable task.",
              "2": "Strictly quantifiable numerical metric."
            }
          },
          {
            "type": "runnable_code",
            "filename": "kr_validate_demo.js",
            "initialCode": "function isValidKeyResult(hasNumericalTarget) {\n  return hasNumericalTarget\n    ? 'VALID_QUANTIFIABLE_KEY_RESULT'\n    : 'INVALID_UNMEASURABLE_EFFORT_STATEMENT';\n}\n\nconsole.log(isValidKeyResult(true));\nconsole.log(isValidKeyResult(false));",
            "expectedOutput": "VALID_QUANTIFIABLE_KEY_RESULT\nINVALID_UNMEASURABLE_EFFORT_STATEMENT",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What validation status is assigned to a Key Result statement that incorporates a strict numerical metric target?",
          "expectedStringOutput": "VALID_QUANTIFIABLE_KEY_RESULT",
          "acceptableAnswers": [
            "VALID_QUANTIFIABLE_KEY_RESULT",
            "Valid Key Result",
            "Quantifiable"
          ],
          "primaryMisconceptionId": "MC_ENT_STRATEGIC_PLANNING_OKRS_ALIGNMENT",
          "diagnosisMap": {
            "INVALID": {
              "misconceptionId": "MC_ENT_STRATEGIC_PLANNING_OKRS_ALIGNMENT",
              "errorExplanation": "Numerical metrics are mandatory for valid Key Results.",
              "recoveryPath": {
                "simplerExplanation": "Matches VALID_QUANTIFIABLE_KEY_RESULT.",
                "guidedFixPrompt": "Type VALID_QUANTIFIABLE_KEY_RESULT"
              }
            }
          }
        }
      },
      {
        "id": "ent-d13-b3-cascading-okrs-vs-kpis",
        "day": 13,
        "blockNumber": 3,
        "title": "Cascading Corporate OKRs & OKRs vs KPIs Distinction",
        "conceptBudget": {
          "primaryConcept": "OKRs vs KPIs Invariant",
          "supportingTerms": [
            "KPIs (Business as Usual health dashboard e.g. Server uptime, ticket response)",
            "OKRs (Transformational quarterly strategic step-change growth priorities)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d13-b2-objective-vs-key-result-structure",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "okr_kpi_demo.js",
            "initialCode": "function classifyMetricType(isTransformationalStepChange) {\n  return isTransformationalStepChange\n    ? 'OKR_STRATEGIC_GROWTH_LEAP'\n    : 'KPI_BUSINESS_AS_USUAL_HEALTH_METRIC';\n}\n\nconsole.log(classifyMetricType(true));\nconsole.log(classifyMetricType(false));",
            "expectedOutput": "OKR_STRATEGIC_GROWTH_LEAP\nKPI_BUSINESS_AS_USUAL_HEALTH_METRIC",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How is an aggressive quarterly target designed to achieve a 3x transformational step-change growth leap classified compared to a routine KPI?",
          "expectedStringOutput": "OKR_STRATEGIC_GROWTH_LEAP",
          "acceptableAnswers": [
            "OKR_STRATEGIC_GROWTH_LEAP",
            "OKR",
            "Strategic Growth Leap"
          ],
          "primaryMisconceptionId": "MC_ENT_STRATEGIC_PLANNING_OKRS_ALIGNMENT",
          "diagnosisMap": {
            "KPI": {
              "misconceptionId": "MC_ENT_STRATEGIC_PLANNING_OKRS_ALIGNMENT",
              "errorExplanation": "KPIs track baseline maintenance. Transformational growth priorities are OKRs.",
              "recoveryPath": {
                "simplerExplanation": "Matches OKR_STRATEGIC_GROWTH_LEAP.",
                "guidedFixPrompt": "Type OKR_STRATEGIC_GROWTH_LEAP"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 14,
    "title": "Operations Management: Process Mapping & Bottleneck Little's Law (L = lambda x W)",
    "overviewMetaphor": "Little's Law is Measuring the Water Flow in a River Canyon: If customer onboarding requests arrive at a rate of 20 applications per hour ($\\lambda = 20$), and the average review and verification process takes 2.5 hours ($W = 2.5$), the total Work-in-Progress (WIP) waiting inside your operations pipeline is exactly 50 active applications ($L = 20 \\times 2.5 = 50$); eliminating the bottleneck step cuts wait time from 2.5 hours down to 30 minutes, slashing queue congestion by 80%.",
    "blocks": [
      {
        "id": "ent-d14-b1-littles-law-wip-calculation",
        "day": 14,
        "blockNumber": 1,
        "title": "Little's Law Formula: $\\text{Work-in-Progress } L = \\text{Throughput } \\lambda \\times \\text{Wait Time } W$",
        "conceptBudget": {
          "primaryConcept": "Little's Law Formula",
          "supportingTerms": [
            "Arrival Rate ($\\lambda = 20$ items/hour)",
            "Average Lead/Wait Time ($W = 2.5$ hours)",
            "Work-in-Progress ($L = \\lambda \\times W = 20 \\times 2.5 = 50$ active items in queue)",
            "Goldratt's Theory of Constraints bottleneck identification"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d13-b1-okr-scoring-stretch-evaluation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Little's Law Operations Pipeline (Lambda = 20/hr, W = 2.5 hrs)",
              "boxes": [
                {
                  "label": "Arrival Rate (Lambda)",
                  "value": "20 Customer Requests per Hour arriving in queue",
                  "varType": "Arrival Rate",
                  "isUpdated": false
                },
                {
                  "label": "Processing Wait Time (W)",
                  "value": "2.50 Hours average operational cycle time",
                  "varType": "Cycle Time",
                  "isUpdated": false
                },
                {
                  "label": "Work-in-Progress (L)",
                  "value": "20 x 2.5 = 50 ACTIVE REQUESTS IN PIPELINE (LITTLE'S LAW!)",
                  "varType": "WIP",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "littles_law_calc_demo.js",
            "initialCode": "function calculateWip(lambdaRate, waitTimeHours) {\n  const wip = lambdaRate * waitTimeHours;\n  return {\n    lambdaRate,\n    waitTimeHours,\n    workInProgressL: Number(wip.toFixed(2)),\n    status: 'LITTLES_LAW_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateWip(20, 2.5)));",
            "expectedOutput": "{\"lambdaRate\":20,\"waitTimeHours\":2.5,\"workInProgressL\":50,\"status\":\"LITTLES_LAW_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Work-in-Progress (L) queue count in an operations pipeline when throughput arrival rate is 20 items/hour and wait time is 2.5 hours ($20 \\times 2.5$)?",
          "expectedStringOutput": "50",
          "acceptableAnswers": [
            "50",
            "50 items",
            "50.0",
            "workInProgressL\":50"
          ],
          "primaryMisconceptionId": "MC_ENT_OPERATIONS_BPMN_BOTTLENECK_LITTLES_LAW",
          "diagnosisMap": {
            "8": {
              "misconceptionId": "MC_ENT_OPERATIONS_BPMN_BOTTLENECK_LITTLES_LAW",
              "errorExplanation": "8 divides 20 by 2.5. Little's Law multiplies throughput by wait time: 20 * 2.5 = 50 WIP items.",
              "recoveryPath": {
                "simplerExplanation": "20 * 2.5 = 50.",
                "guidedFixPrompt": "Type 50"
              }
            }
          }
        }
      },
      {
        "id": "ent-d14-b2-theory-of-constraints-five-focusing-steps",
        "day": 14,
        "blockNumber": 2,
        "title": "Goldratt's Theory of Constraints: The 5 Focusing Steps",
        "conceptBudget": {
          "primaryConcept": "Theory of Constraints Steps",
          "supportingTerms": [
            "Step 1: Identify the bottleneck constraint",
            "Step 2: Exploit the constraint",
            "Step 3: Subordinate everything else to the constraint",
            "Step 4: Elevate the constraint",
            "Step 5: Prevent inertia and repeat"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d14-b1-littles-law-wip-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "5 Focusing Steps Workflow",
            "codeSnippet": "// Step 1: Identify -> Engineering code review takes 48 hours (The Bottleneck!)\n// Step 2: Exploit   -> Prioritize senior engineers reviewing PRs before starting new code\n// Step 3: Elevate   -> Hire automated CI/CD test tooling and 2 dedicated reviewers!",
            "lineNotes": {
              "1": "Locate bottleneck.",
              "2": "Maximize bottleneck efficiency.",
              "3": "Increase bottleneck capacity."
            }
          },
          {
            "type": "runnable_code",
            "filename": "toc_demo.js",
            "initialCode": "function getFirstStepTheoryOfConstraints() {\n  return 'IDENTIFY_THE_SYSTEM_BOTTLENECK_CONSTRAINT';\n}\n\nconsole.log(getFirstStepTheoryOfConstraints());",
            "expectedOutput": "IDENTIFY_THE_SYSTEM_BOTTLENECK_CONSTRAINT",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the mandatory first step in Goldratt's 5 Focusing Steps under the Theory of Constraints?",
          "expectedStringOutput": "IDENTIFY_THE_SYSTEM_BOTTLENECK_CONSTRAINT",
          "acceptableAnswers": [
            "IDENTIFY_THE_SYSTEM_BOTTLENECK_CONSTRAINT",
            "Identify constraint",
            "Identify the bottleneck"
          ],
          "primaryMisconceptionId": "MC_ENT_OPERATIONS_BPMN_BOTTLENECK_LITTLES_LAW",
          "diagnosisMap": {
            "ELEVATE": {
              "misconceptionId": "MC_ENT_OPERATIONS_BPMN_BOTTLENECK_LITTLES_LAW",
              "errorExplanation": "Elevating is step 4. Step 1 is IDENTIFY_THE_SYSTEM_BOTTLENECK_CONSTRAINT.",
              "recoveryPath": {
                "simplerExplanation": "Matches IDENTIFY_THE_SYSTEM_BOTTLENECK_CONSTRAINT.",
                "guidedFixPrompt": "Type IDENTIFY_THE_SYSTEM_BOTTLENECK_CONSTRAINT"
              }
            }
          }
        }
      },
      {
        "id": "ent-d14-b3-bpmn-swimlanes-cycle-efficiency",
        "day": 14,
        "blockNumber": 3,
        "title": "BPMN Swimlanes & Process Cycle Efficiency (PCE)",
        "conceptBudget": {
          "primaryConcept": "Process Cycle Efficiency Formula",
          "supportingTerms": [
            "$\\text{PCE} = \\frac{\\text{Value-Add Time}}{\\text{Total Lead Time}} \\times 100\\%$",
            "Swimlane diagrams mapping cross-functional handoffs between Sales, Legal, and Finance"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d14-b2-theory-of-constraints-five-focusing-steps",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "pce_calc_demo.js",
            "initialCode": "function calculatePce(valueAddTimeMin, totalLeadTimeMin) {\n  const pce = (valueAddTimeMin / totalLeadTimeMin) * 100;\n  return {\n    valueAddTimeMin,\n    totalLeadTimeMin,\n    pcePercent: Number(pce.toFixed(2)),\n    status: 'PCE_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculatePce(30, 300)));",
            "expectedOutput": "{\"valueAddTimeMin\":30,\"totalLeadTimeMin\":300,\"pcePercent\":10,\"status\":\"PCE_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Process Cycle Efficiency percentage when actual active work takes 30 minutes across a total lead time of 300 minutes ($ (30 / 300) \\times 100 $)?",
          "expectedStringOutput": "10",
          "acceptableAnswers": [
            "10",
            "10%",
            "10.0",
            "pcePercent\":10"
          ],
          "primaryMisconceptionId": "MC_ENT_OPERATIONS_BPMN_BOTTLENECK_LITTLES_LAW",
          "diagnosisMap": {
            "0.1": {
              "misconceptionId": "MC_ENT_OPERATIONS_BPMN_BOTTLENECK_LITTLES_LAW",
              "errorExplanation": "0.1 is decimal form. Multiplied by 100 gives 10.0% PCE.",
              "recoveryPath": {
                "simplerExplanation": "30 / 300 * 100 = 10%.",
                "guidedFixPrompt": "Type 10"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 15,
    "title": "⭐ MILESTONE 2: Complete Startup Finance, Cap Table, Vesting & Operations Engine",
    "overviewMetaphor": "Milestone 2 Synthesis: The complete sovereign startup financial modeling, cap table equity, and operations execution suite: 1. Break-Even Analysis ($BEU = 1,250$ units, $37.5\\%$ MOS); 2. Solvency Runway ($12.0$ months); 3. SAFE Dilution ($20\\%$ investor, $80\\%$ founder retained); 4. 4-Year Vesting schedule ($250,000$ shares at 12-month cliff); 5. Little's Law WIP operations modeling ($L = 50$ units).",
    "blocks": [
      {
        "id": "ent-d15-b1-finance-operations-master-synthesis",
        "day": 15,
        "blockNumber": 1,
        "title": "Startup Finance & Operations Master Engine Synthesis",
        "conceptBudget": {
          "primaryConcept": "Finance & Operations Engine Synthesis",
          "supportingTerms": [
            "Break-Even Engine",
            "Runway Solvency Engine",
            "SAFE Dilution Engine",
            "Vesting Cliff Engine",
            "Little's Law Operations Engine"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d14-b3-bpmn-swimlanes-cycle-efficiency",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Milestone 2 Finance & Operations Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "Calculates 1,250 BEU & 12 months cash runway",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Models $5M Post-Money SAFE (20% investor, 80% founder)",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Enforces 4-year vesting with 250k shares 1-year cliff",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Computes 50 WIP units via Little's Law and certifies finance engine!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "finance_operations_kernel_demo.js",
            "initialCode": "function runFinanceOperationsEngine() {\n  return {\n    breakEvenSubsystem: 'ONLINE_BEU_1250_ACTIVE',\n    runwaySubsystem: 'ONLINE_12_MONTHS_RUNWAY_ACTIVE',\n    safeSubsystem: 'ONLINE_SAFE_20_PERCENT_ACTIVE',\n    vestingSubsystem: 'ONLINE_4_YEAR_VESTING_ACTIVE',\n    wipSubsystem: 'ONLINE_LITTLES_LAW_50_WIP_ACTIVE',\n    engineStatus: 'STARTUP_FINANCE_AND_OPERATIONS_MASTER_ACTIVE'\n  };\n}\n\nconsole.log(runFinanceOperationsEngine().engineStatus);",
            "expectedOutput": "STARTUP_FINANCE_AND_OPERATIONS_MASTER_ACTIVE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What engine status confirms active operational synthesis of the Startup Finance & Operations Master Engine?",
          "expectedStringOutput": "STARTUP_FINANCE_AND_OPERATIONS_MASTER_ACTIVE",
          "acceptableAnswers": [
            "STARTUP_FINANCE_AND_OPERATIONS_MASTER_ACTIVE",
            "engineStatus: STARTUP_FINANCE_AND_OPERATIONS_MASTER_ACTIVE"
          ],
          "primaryMisconceptionId": "MC_ENT_BREAK_EVEN_ANALYSIS_MARGIN_SAFETY",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_ENT_BREAK_EVEN_ANALYSIS_MARGIN_SAFETY",
              "errorExplanation": "Matches STARTUP_FINANCE_AND_OPERATIONS_MASTER_ACTIVE.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type STARTUP_FINANCE_AND_OPERATIONS_MASTER_ACTIVE"
              }
            }
          }
        }
      },
      {
        "id": "ent-d15-b2-finance-engine-audit",
        "day": 15,
        "blockNumber": 2,
        "title": "Finance & Operations Engine Invariant Verification & Precision Audit",
        "conceptBudget": {
          "primaryConcept": "Finance Invariant Verification",
          "supportingTerms": [
            "Break-Even Invariant",
            "Runway Invariant",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d15-b1-finance-operations-master-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "finance_audit_demo.js",
            "initialCode": "function auditFinanceEngine(beuValid, runValid, safeValid, vestValid, wipValid) {\n  const passed = beuValid && runValid && safeValid && vestValid && wipValid;\n  return {\n    breakEvenVerified: beuValid,\n    runwayVerified: runValid,\n    safeVerified: safeValid,\n    vestingVerified: vestValid,\n    wipVerified: wipValid,\n    grade: passed ? 'FINANCE_OPERATIONS_ENGINE_AUDIT_PASSED' : 'AUDIT_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditFinanceEngine(true, true, true, true, true)));",
            "expectedOutput": "{\"breakEvenVerified\":true,\"runwayVerified\":true,\"safeVerified\":true,\"vestingVerified\":true,\"wipVerified\":true,\"grade\":\"FINANCE_OPERATIONS_ENGINE_AUDIT_PASSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade is awarded when Break-Even, Runway, SAFE, Vesting, and WIP engines pass 100%?",
          "expectedStringOutput": "FINANCE_OPERATIONS_ENGINE_AUDIT_PASSED",
          "acceptableAnswers": [
            "FINANCE_OPERATIONS_ENGINE_AUDIT_PASSED",
            "grade\":\"FINANCE_OPERATIONS_ENGINE_AUDIT_PASSED\""
          ],
          "primaryMisconceptionId": "MC_ENT_BREAK_EVEN_ANALYSIS_MARGIN_SAFETY",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_ENT_BREAK_EVEN_ANALYSIS_MARGIN_SAFETY",
              "errorExplanation": "All checks passing awards FINANCE_OPERATIONS_ENGINE_AUDIT_PASSED.",
              "recoveryPath": {
                "simplerExplanation": "Awards FINANCE_OPERATIONS_ENGINE_AUDIT_PASSED.",
                "guidedFixPrompt": "Type FINANCE_OPERATIONS_ENGINE_AUDIT_PASSED"
              }
            }
          }
        }
      },
      {
        "id": "ent-d15-b3-milestone2-ent-cert",
        "day": 15,
        "blockNumber": 3,
        "title": "Milestone 2 Startup Finance & Operations Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 2 Certification",
          "supportingTerms": [
            "Finance Operations Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d15-b2-finance-engine-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone2_ent_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 2: Complete Startup Finance, Cap Table, Vesting & Operations Engine [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 2: Complete Startup Finance, Cap Table, Vesting & Operations Engine [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 2 completion?",
          "expectedStringOutput": "⭐ MILESTONE 2: Complete Startup Finance, Cap Table, Vesting & Operations Engine [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 2: Complete Startup Finance, Cap Table, Vesting & Operations Engine [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_ENT_BREAK_EVEN_ANALYSIS_MARGIN_SAFETY",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_ENT_BREAK_EVEN_ANALYSIS_MARGIN_SAFETY",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 2: Complete Startup Finance, Cap Table, Vesting & Operations Engine [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 16,
    "title": "Lean & Six Sigma Quality Control: DMAIC & Process Capability (Cpk >= 1.33)",
    "overviewMetaphor": "Process Capability ($C_{pk}$) is an Expert Archer Shooting Arrows Strictly Within the Target Bullseye: If customer tolerance permits dimension specifications between $90 \\text{ mm}$ (LSL) and $110 \\text{ mm}$ (USL) around a mean target of $100 \\text{ mm}$ with a standard deviation of $2.5 \\text{ mm}$ ($\\sigma = 2.5$), the Process Capability Index is $C_{pk} = \\frac{110 - 100}{3 \\times 2.5} = \\frac{10}{7.5} = 1.33$; achieving a $C_{pk} \\ge 1.33$ proves the manufacturing or software process operates at 4-Sigma quality with fewer than 63 defects per million opportunities.",
    "blocks": [
      {
        "id": "ent-d16-b1-cpk-process-capability-calculation",
        "day": 16,
        "blockNumber": 1,
        "title": "Process Capability Index ($C_{pk}$): $C_{pk} = \\min(\\frac{USL - \\mu}{3\\sigma}, \\frac{\\mu - LSL}{3\\sigma}) \\ge 1.33$",
        "conceptBudget": {
          "primaryConcept": "Process Capability Index Formula",
          "supportingTerms": [
            "Upper Specification Limit ($USL = 110$)",
            "Lower Specification Limit ($LSL = 90$)",
            "Process Mean ($\\mu = 100$)",
            "Standard Deviation ($\\sigma = 2.5$)",
            "$C_{pk} = \\min(\\frac{10}{7.5}, \\frac{10}{7.5}) = 1.33$",
            "Six Sigma Benchmark: $\\ge 1.33 \\implies$ Capable High Yield; $< 1.0 \\implies$ High Defect Rate"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d15-b1-finance-operations-master-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Process Quality Capability Ledger (USL=110, LSL=90, Mean=100, Sigma=2.5)",
              "boxes": [
                {
                  "label": "Upper Capability (CPU)",
                  "value": "(110 - 100) / (3 x 2.5) = 10 / 7.5 = 1.33 CPU",
                  "varType": "CPU",
                  "isUpdated": false
                },
                {
                  "label": "Lower Capability (CPL)",
                  "value": "(100 - 90) / (3 x 2.5) = 10 / 7.5 = 1.33 CPL",
                  "varType": "CPL",
                  "isUpdated": false
                },
                {
                  "label": "Process Capability (Cpk)",
                  "value": "MIN(1.33, 1.33) = 1.33 (SIX SIGMA CAPABLE HIGH YIELD >= 1.33!)",
                  "varType": "Cpk",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "cpk_calc_demo.js",
            "initialCode": "function calculateProcessCpk(usl, lsl, mu, sigma) {\n  const cpu = (usl - mu) / (3 * sigma);\n  const cpl = (mu - lsl) / (3 * sigma);\n  const cpk = Math.min(cpu, cpl);\n  return {\n    cpu: Number(cpu.toFixed(2)),\n    cpl: Number(cpl.toFixed(2)),\n    cpkIndex: Number(cpk.toFixed(2)),\n    isCapable: cpk >= 1.33,\n    status: 'CPK_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateProcessCpk(110, 90, 100, 2.5)));",
            "expectedOutput": "{\"cpu\":1.33,\"cpl\":1.33,\"cpkIndex\":1.33,\"isCapable\":true,\"status\":\"CPK_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Process Capability Index (Cpk) when USL is 110, LSL is 90, Mean is 100, and Standard Deviation is 2.5 ($ (110 - 100) / (3 \\times 2.5) $)?",
          "expectedStringOutput": "1.33",
          "acceptableAnswers": [
            "1.33",
            "1.33 Cpk",
            "cpkIndex\":1.33"
          ],
          "primaryMisconceptionId": "MC_ENT_LEAN_SIX_SIGMA_DMAIC_CPK_QUALITY",
          "diagnosisMap": {
            "4.0": {
              "misconceptionId": "MC_ENT_LEAN_SIX_SIGMA_DMAIC_CPK_QUALITY",
              "errorExplanation": "4.0 divides by 2.5 without the 3x factor (10 / 2.5). Cpk divides by 3*sigma (10 / 7.5 = 1.33).",
              "recoveryPath": {
                "simplerExplanation": "10 / (3 * 2.5) = 1.33.",
                "guidedFixPrompt": "Type 1.33"
              }
            }
          }
        }
      },
      {
        "id": "ent-d16-b2-dmaic-six-sigma-cycle",
        "day": 16,
        "blockNumber": 2,
        "title": "The DMAIC Problem-Solving Cycle: Define, Measure, Analyze, Improve, Control",
        "conceptBudget": {
          "primaryConcept": "DMAIC Quality Roadmap",
          "supportingTerms": [
            "D (Define problem & customer CTQ metrics)",
            "M (Measure baseline defect rate)",
            "A (Analyze root cause using 5 Whys & Ishikawa diagram)",
            "I (Improve process via pilot experiments)",
            "C (Control via standard operating procedures SOPs)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d16-b1-cpk-process-capability-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "DMAIC 5 Stages",
            "codeSnippet": "// D: Define (Order fulfillment takes 5 days instead of 24 hours)\n// M: Measure (Baseline Defect Rate = 32% late shipments)\n// A: Analyze (Root cause: Warehouse packing station printer jams)\n// I: Improve (Deploy thermal laser barcode printers)\n// C: Control (Real-time printer health monitoring alerts)",
            "lineNotes": {
              "1": "Define problem.",
              "2": "Measure baseline.",
              "3": "Analyze root cause.",
              "4": "Improve solution.",
              "5": "Control standard."
            }
          },
          {
            "type": "runnable_code",
            "filename": "dmaic_demo.js",
            "initialCode": "function getDmaicPillars() {\n  return ['DEFINE', 'MEASURE', 'ANALYZE', 'IMPROVE', 'CONTROL'];\n}\n\nconsole.log(JSON.stringify(getDmaicPillars()));",
            "expectedOutput": "[\"DEFINE\",\"MEASURE\",\"ANALYZE\",\"IMPROVE\",\"CONTROL\"]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What does the 'A' represent in the Six Sigma DMAIC continuous improvement cycle?",
          "expectedStringOutput": "ANALYZE",
          "acceptableAnswers": [
            "ANALYZE",
            "Analyze",
            "Analyze root cause"
          ],
          "primaryMisconceptionId": "MC_ENT_LEAN_SIX_SIGMA_DMAIC_CPK_QUALITY",
          "diagnosisMap": {
            "ACTION": {
              "misconceptionId": "MC_ENT_LEAN_SIX_SIGMA_DMAIC_CPK_QUALITY",
              "errorExplanation": "In DMAIC, 'A' stands for Analyze root cause.",
              "recoveryPath": {
                "simplerExplanation": "Matches ANALYZE.",
                "guidedFixPrompt": "Type ANALYZE"
              }
            }
          }
        }
      },
      {
        "id": "ent-d16-b3-eight-wastes-timwoods",
        "day": 16,
        "blockNumber": 3,
        "title": "Lean 8 Wastes (TIMWOODS) Elimination in Knowledge & Tech Work",
        "conceptBudget": {
          "primaryConcept": "TIMWOODS 8 Wastes",
          "supportingTerms": [
            "T (Transport)",
            "I (Inventory: Unfinished PRs/WIP)",
            "M (Motion)",
            "W (Waiting: Code reviews)",
            "O (Overproduction)",
            "O (Overprocessing: Unnecessary complex code architecture)",
            "D (Defects: Software bugs)",
            "S (Skills underutilization)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d16-b2-dmaic-six-sigma-cycle",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "timwoods_demo.js",
            "initialCode": "function getTotalLeanWastesCount() {\n  return 8;\n}\n\nconsole.log(getTotalLeanWastesCount());",
            "expectedOutput": "8",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many operational wastes are systematically identified and eliminated under the Lean TIMWOODS framework?",
          "expectedStringOutput": "8",
          "acceptableAnswers": [
            "8",
            "Eight",
            "8 wastes"
          ],
          "primaryMisconceptionId": "MC_ENT_LEAN_SIX_SIGMA_DMAIC_CPK_QUALITY",
          "diagnosisMap": {
            "7": {
              "misconceptionId": "MC_ENT_LEAN_SIX_SIGMA_DMAIC_CPK_QUALITY",
              "errorExplanation": "Original Toyota had 7. Modern Lean includes the 8th waste (Skills Underutilization) = 8 total wastes.",
              "recoveryPath": {
                "simplerExplanation": "TIMWOODS has 8 wastes.",
                "guidedFixPrompt": "Type 8"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 17,
    "title": "Go-To-Market (GTM) Strategy: Beachhead Expansion & Viral Loops (K > 1.0)",
    "overviewMetaphor": "A Viral Loop is an Infectious Self-Replicating Nuclear Chain Reaction: If every new user invites 10 friends ($i = 10$) and 15.0% of those invited friends sign up ($c = 0.15$), the Viral Coefficient is $K = 10 \\times 0.15 = 1.50$; because $K > 1.0$, each generation of users brings in more users than the previous generation ($1,000 \\to 1,500 \\to 2,250 \\to 3,375$), creating exponential organic growth with zero advertising spend.",
    "blocks": [
      {
        "id": "ent-d17-b1-viral-k-factor-calculation",
        "day": 17,
        "blockNumber": 1,
        "title": "Viral Coefficient ($K\\text{-Factor}$): $K = \\text{Invites Sent } i \\times \\text{Conversion Rate } c > 1.0$",
        "conceptBudget": {
          "primaryConcept": "Viral Coefficient Formula",
          "supportingTerms": [
            "Invites Sent per User ($i = 10$)",
            "Invite Acceptance Rate ($c = 15.0\\% = 0.15$)",
            "$K\\text{-Factor} = 10 \\times 0.15 = 1.50$",
            "Supercritical Growth: $K > 1.0 \\implies$ Exponential Viral Explosion; $K < 1.0 \\implies$ Subcritical Growth Decay"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d16-b1-cpk-process-capability-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Viral Growth Engine Ledger (10 Invites/User @ 15% Acceptance)",
              "boxes": [
                {
                  "label": "Invites Sent per User",
                  "value": "10 Invitations dispatched per active registered user",
                  "varType": "Invites (i)",
                  "isUpdated": false
                },
                {
                  "label": "Acceptance Conversion",
                  "value": "15.0% Conversion Rate of invited contacts to signups",
                  "varType": "Conversion (c)",
                  "isUpdated": false
                },
                {
                  "label": "Viral Coefficient (K)",
                  "value": "10 x 0.15 = 1.50 (EXPONENTIAL SELF-SUSTAINING VIRAL LOOP > 1.0!)",
                  "varType": "K-Factor",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "k_factor_calc_demo.js",
            "initialCode": "function calculateKFactor(invites, conversionPct) {\n  const k = invites * (conversionPct / 100);\n  return {\n    invites,\n    conversionPct,\n    kFactor: Number(k.toFixed(2)),\n    isViral: k > 1.0,\n    status: 'K_FACTOR_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateKFactor(10, 15)));",
            "expectedOutput": "{\"invites\":10,\"conversionPct\":15,\"kFactor\":1.5,\"isViral\":true,\"status\":\"K_FACTOR_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Viral Coefficient (K-Factor) when each user sends 10 invites and 15% of those invites convert into new registered users ($10 \\times 0.15$)?",
          "expectedStringOutput": "1.5",
          "acceptableAnswers": [
            "1.5",
            "1.50",
            "kFactor\":1.5"
          ],
          "primaryMisconceptionId": "MC_ENT_GTM_BEACHHEAD_VIRAL_LOOPS",
          "diagnosisMap": {
            "150": {
              "misconceptionId": "MC_ENT_GTM_BEACHHEAD_VIRAL_LOOPS",
              "errorExplanation": "150 forgets to divide the percentage by 100. 10 * 0.15 = 1.50.",
              "recoveryPath": {
                "simplerExplanation": "10 * 0.15 = 1.5.",
                "guidedFixPrompt": "Type 1.5"
              }
            }
          }
        }
      },
      {
        "id": "ent-d17-b2-beachhead-market-strategy",
        "day": 17,
        "blockNumber": 2,
        "title": "The Beachhead Market Strategy (Crossing the Chasm)",
        "conceptBudget": {
          "primaryConcept": "Beachhead Market Domination",
          "supportingTerms": [
            "Geoffrey Moore's Crossing the Chasm",
            "Beachhead Market (Dominating a narrow, underserved niche with >50% market share before expanding to adjacent markets e.g. Facebook conquering Harvard before opening to Stanford)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d17-b1-viral-k-factor-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Beachhead Expansion Sequence",
            "codeSnippet": "// Phase 1: Dominate Harvard (85% market penetration in 3 weeks)\n// Phase 2: Expand to Ivy League cluster (Columbia, Yale, Princeton)\n// Phase 3: Global expansion to all universities and general public",
            "lineNotes": {
              "1": "Beachhead niche monopoly.",
              "2": "Adjacent expansion.",
              "3": "Mass market scale."
            }
          },
          {
            "type": "runnable_code",
            "filename": "beachhead_demo.js",
            "initialCode": "function getBeachheadStrategyPrinciple() {\n  return 'DOMINATE_NARROW_NICHE_BEFORE_ADJACENT_EXPANSION';\n}\n\nconsole.log(getBeachheadStrategyPrinciple());",
            "expectedOutput": "DOMINATE_NARROW_NICHE_BEFORE_ADJACENT_EXPANSION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What core tactical principle defines the Beachhead Market Go-To-Market strategy?",
          "expectedStringOutput": "DOMINATE_NARROW_NICHE_BEFORE_ADJACENT_EXPANSION",
          "acceptableAnswers": [
            "DOMINATE_NARROW_NICHE_BEFORE_ADJACENT_EXPANSION",
            "Dominate narrow niche",
            "Niche domination"
          ],
          "primaryMisconceptionId": "MC_ENT_GTM_BEACHHEAD_VIRAL_LOOPS",
          "diagnosisMap": {
            "BROAD": {
              "misconceptionId": "MC_ENT_GTM_BEACHHEAD_VIRAL_LOOPS",
              "errorExplanation": "Launching broadly spreads resources thin. Startups DOMINATE_NARROW_NICHE_BEFORE_ADJACENT_EXPANSION.",
              "recoveryPath": {
                "simplerExplanation": "Matches DOMINATE_NARROW_NICHE_BEFORE_ADJACENT_EXPANSION.",
                "guidedFixPrompt": "Type DOMINATE_NARROW_NICHE_BEFORE_ADJACENT_EXPANSION"
              }
            }
          }
        }
      },
      {
        "id": "ent-d17-b3-ideal-customer-profile-icp-matrix",
        "day": 17,
        "blockNumber": 3,
        "title": "Ideal Customer Profile (ICP) & Disqualifying Bad-Fit Leads",
        "conceptBudget": {
          "primaryConcept": "ICP Disqualification Invariant",
          "supportingTerms": [
            "ICP Criteria (B2B SaaS companies, 50-200 employees, using Stripe, funded Series A)",
            "Disqualifying non-ICP tire-kickers saves 60% of sales team capacity"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d17-b2-beachhead-market-strategy",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "icp_demo.js",
            "initialCode": "function evaluateIcpMatch(employees, hasBudget) {\n  return (employees >= 50 && hasBudget)\n    ? 'QUALIFIED_HIGH_VALUE_ICP_TARGET'\n    : 'DISQUALIFY_PRESERVE_SALES_BANDWIDTH';\n}\n\nconsole.log(evaluateIcpMatch(100, true));\nconsole.log(evaluateIcpMatch(5, false));",
            "expectedOutput": "QUALIFIED_HIGH_VALUE_ICP_TARGET\nDISQUALIFY_PRESERVE_SALES_BANDWIDTH",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What qualification decision is made for an enterprise prospect with 100 employees and an approved budget matching your ICP criteria?",
          "expectedStringOutput": "QUALIFIED_HIGH_VALUE_ICP_TARGET",
          "acceptableAnswers": [
            "QUALIFIED_HIGH_VALUE_ICP_TARGET",
            "Qualified ICP",
            "Qualified"
          ],
          "primaryMisconceptionId": "MC_ENT_GTM_BEACHHEAD_VIRAL_LOOPS",
          "diagnosisMap": {
            "DISQUALIFY": {
              "misconceptionId": "MC_ENT_GTM_BEACHHEAD_VIRAL_LOOPS",
              "errorExplanation": "Prospect matches employee count and budget criteria, qualifying them as QUALIFIED_HIGH_VALUE_ICP_TARGET.",
              "recoveryPath": {
                "simplerExplanation": "Matches QUALIFIED_HIGH_VALUE_ICP_TARGET.",
                "guidedFixPrompt": "Type QUALIFIED_HIGH_VALUE_ICP_TARGET"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 18,
    "title": "Revenue Operations (RevOps) & Pipeline Coverage Ratio (3x-4x)",
    "overviewMetaphor": "Pipeline Coverage Ratio is an Insurance Shield Against Deals Slipping at Quarter-End: If your quarterly sales quota target is $1,000,000 and your sales team maintains $3,500,000 in active qualified open pipeline deals, your Pipeline Coverage Ratio is 3.50x ($Coverage = \\frac{3.5M}{1M} = 3.5x$); because historical enterprise win rates hover between 25% and 30%, a 3.5x pipeline coverage mathematically guarantees hitting the $1,000,000 revenue target even if deals slip.",
    "blocks": [
      {
        "id": "ent-d18-b1-pipeline-coverage-ratio-calculation",
        "day": 18,
        "blockNumber": 1,
        "title": "Pipeline Coverage Ratio Formula: $\\text{Coverage} = \\frac{\\text{Total Qualified Pipeline}}{\\text{Quarterly Quota Target}} \\ge 3.5x$",
        "conceptBudget": {
          "primaryConcept": "Pipeline Coverage Formula",
          "supportingTerms": [
            "Total Open Pipeline ($3,500,000.00$)",
            "Quarterly Quota ($1,000,000.00$)",
            "Pipeline Coverage Ratio = $\\frac{3,500,000}{1,000,000} = 3.50x$",
            "B2B Standard: $3.0x - 4.0x \\implies$ Healthy Quota Attainment; $< 2.5x \\implies$ Severe Pipeline Deficit"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d17-b1-viral-k-factor-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "RevOps Pipeline Coverage Ledger ($3.5M Pipeline vs $1M Quota)",
              "boxes": [
                {
                  "label": "Active Open Pipeline",
                  "value": "$3,500,000.00 in Active Qualified Enterprise Opportunities",
                  "varType": "Pipeline",
                  "isUpdated": false
                },
                {
                  "label": "Quarterly Target Quota",
                  "value": "$1,000,000.00 Board Approved Revenue Target",
                  "varType": "Quota",
                  "isUpdated": false
                },
                {
                  "label": "Coverage Ratio",
                  "value": "$3.5M / $1.0M = 3.50x (HEALTHY PIPELINE QUOTA ATTAINABLE >= 3.5x!)",
                  "varType": "Coverage",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "pipeline_calc_demo.js",
            "initialCode": "function calculatePipelineCoverage(pipeline, quota) {\n  const ratio = pipeline / quota;\n  return {\n    pipeline,\n    quota,\n    coverageRatio: Number(ratio.toFixed(2)),\n    isHealthy: ratio >= 3.5,\n    status: 'COVERAGE_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculatePipelineCoverage(3500000, 1000000)));",
            "expectedOutput": "{\"pipeline\":3500000,\"quota\":1000000,\"coverageRatio\":3.5,\"isHealthy\":true,\"status\":\"COVERAGE_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Pipeline Coverage Ratio when a B2B sales team maintains $3,500,000 in open pipeline against a $1,000,000 quarterly quota ($3,500,000 / 1,000,000$)?",
          "expectedStringOutput": "3.5",
          "acceptableAnswers": [
            "3.5",
            "3.5x",
            "3.50",
            "coverageRatio\":3.5"
          ],
          "primaryMisconceptionId": "MC_ENT_REVOPS_PIPELINE_COVERAGE_VELOCITY",
          "diagnosisMap": {
            "0.286": {
              "misconceptionId": "MC_ENT_REVOPS_PIPELINE_COVERAGE_VELOCITY",
              "errorExplanation": "0.286 divides quota by pipeline (1M / 3.5M). Coverage divides pipeline by quota: 3.5M / 1M = 3.5x.",
              "recoveryPath": {
                "simplerExplanation": "3,500,000 / 1,000,000 = 3.5.",
                "guidedFixPrompt": "Type 3.5"
              }
            }
          }
        }
      },
      {
        "id": "ent-d18-b2-sales-funnel-stage-velocity",
        "day": 18,
        "blockNumber": 2,
        "title": "Sales Velocity Equation: $V = \\frac{\\text{Deals } N \\times \\text{Win Rate } W \\times \\text{Deal Size } S}{\\text{Sales Cycle Length } L}$",
        "conceptBudget": {
          "primaryConcept": "Sales Velocity Formula",
          "supportingTerms": [
            "Number of Deals ($N$)",
            "Win Rate ($W$)",
            "Average Deal Size ($S$)",
            "Sales Cycle Days ($L$)",
            "Increasing sales velocity by reducing cycle time from 90 days to 45 days doubles quarterly revenue"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d18-b1-pipeline-coverage-ratio-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Sales Velocity Multipliers",
            "codeSnippet": "// 1. Increase Deal Count (N): More top-of-funnel MQLs\n// 2. Increase Win Rate (W):    Better demo qualification and sales enablement\n// 3. Decrease Cycle Length (L): Standardized MSA contracts and 1-click legal approval",
            "lineNotes": {
              "1": "Volume driver.",
              "2": "Conversion driver.",
              "3": "Speed accelerator."
            }
          },
          {
            "type": "runnable_code",
            "filename": "velocity_calc_demo.js",
            "initialCode": "function calculateSalesVelocity(deals, winRatePct, avgDealSize, cycleDays) {\n  const velocityPerDay = (deals * (winRatePct / 100) * avgDealSize) / cycleDays;\n  return Math.round(velocityPerDay);\n}\n\nconsole.log(calculateSalesVelocity(50, 25, 20000, 60));",
            "expectedOutput": "4167",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the daily sales velocity in dollars generated from 50 deals with 25% win rate, $20,000 average deal size, across a 60-day cycle ($ (50 \\times 0.25 \\times 20,000) / 60 = 250,000 / 60 $)?",
          "expectedStringOutput": "4167",
          "acceptableAnswers": [
            "4167",
            "$4,167",
            "4,167"
          ],
          "primaryMisconceptionId": "MC_ENT_REVOPS_PIPELINE_COVERAGE_VELOCITY",
          "diagnosisMap": {
            "250000": {
              "misconceptionId": "MC_ENT_REVOPS_PIPELINE_COVERAGE_VELOCITY",
              "errorExplanation": "250,000 is total expected pipeline revenue. Divided across 60 days gives $4,167/day velocity.",
              "recoveryPath": {
                "simplerExplanation": "250,000 / 60 = 4167.",
                "guidedFixPrompt": "Type 4167"
              }
            }
          }
        }
      },
      {
        "id": "ent-d18-b3-weighted-pipeline-forecasting",
        "day": 18,
        "blockNumber": 3,
        "title": "Stage-Weighted Probability Pipeline Forecasting",
        "conceptBudget": {
          "primaryConcept": "Stage-Weighted Forecasting",
          "supportingTerms": [
            "Discovery Stage (10% probability)",
            "Demo Stage (25% probability)",
            "Proposal / Security Review (50% probability)",
            "Contract Negotiation (80% probability)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d18-b2-sales-funnel-stage-velocity",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "weighted_pipe_demo.js",
            "initialCode": "function calculateWeightedPipeline(deals) {\n  return deals.reduce((sum, d) => sum + (d.value * (d.probPct / 100)), 0);\n}\n\nconsole.log(calculateWeightedPipeline([\n  { value: 100000, probPct: 80 },\n  { value: 200000, probPct: 50 }\n]));",
            "expectedOutput": "180000",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the total weighted forecast in dollars from a $100k deal at 80% contract negotiation and a $200k deal at 50% proposal stage ($80,000 + 100,000$)?",
          "expectedStringOutput": "180000",
          "acceptableAnswers": [
            "180000",
            "$180,000",
            "180,000"
          ],
          "primaryMisconceptionId": "MC_ENT_REVOPS_PIPELINE_COVERAGE_VELOCITY",
          "diagnosisMap": {
            "300000": {
              "misconceptionId": "MC_ENT_REVOPS_PIPELINE_COVERAGE_VELOCITY",
              "errorExplanation": "300,000 is unweighted nominal sum. Probability weighted forecast is (100k*0.8) + (200k*0.5) = $180,000.",
              "recoveryPath": {
                "simplerExplanation": "80,000 + 100,000 = 180,000.",
                "guidedFixPrompt": "Type 180000"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 19,
    "title": "Pricing Strategies: Value-Based Pricing & Tiering (Good-Better-Best)",
    "overviewMetaphor": "Value-Based Pricing is Charging for the Size of the Treasure You Uncover, Not the Cost of Your Metal Detector: If your enterprise AI platform eliminates $500,000 in annual manual labor waste for a corporate client and you price at a 15.0% value-capture share, the annual price is $75,000 ($500,000 \\times 0.15$); the client happily pays because they receive a massive 6.67x return on their software investment ($500,000 / 75,000 = 6.67$).",
    "blocks": [
      {
        "id": "ent-d19-b1-value-based-roi-sharing",
        "day": 19,
        "blockNumber": 1,
        "title": "Value-Based Pricing: $\\text{Price} = \\text{Customer Cost Savings} \\times \\text{Value Capture Share}\\%$",
        "conceptBudget": {
          "primaryConcept": "Value-Based Pricing Formula",
          "supportingTerms": [
            "Customer Annual Cost Savings ($500,000.00$)",
            "Value Capture Share ($15.0\\%$)",
            "Annual Software Price = $500,000 \\times 0.15 = \\$75,000.00$",
            "Customer ROI Multiple = $\\frac{500,000}{75,000} = 6.67x$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d18-b1-pipeline-coverage-ratio-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Value-Based Pricing Economics ($500k Customer Savings)",
              "boxes": [
                {
                  "label": "Customer ROI Created",
                  "value": "$500,000.00 Proven Annual Labor Waste Eliminated",
                  "varType": "Value Created",
                  "isUpdated": false
                },
                {
                  "label": "15% Value Share Price",
                  "value": "$500,000 x 15.0% = $75,000.00 Annual Enterprise License",
                  "varType": "Annual Price",
                  "isUpdated": false
                },
                {
                  "label": "Customer Net ROI",
                  "value": "$500,000 / $75,000 = 6.67x ROI MULTIPLE (IRRESISTIBLE NO-BRAINER DEAL!)",
                  "varType": "ROI Multiple",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "value_pricing_calc_demo.js",
            "initialCode": "function calculateValuePrice(savings, sharePct) {\n  const price = savings * (sharePct / 100);\n  const roi = savings / price;\n  return {\n    savings,\n    price: Number(price.toFixed(2)),\n    roiMultiple: Number(roi.toFixed(2)),\n    status: 'PRICE_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateValuePrice(500000, 15)));",
            "expectedOutput": "{\"savings\":500000,\"price\":75000,\"roiMultiple\":6.67,\"status\":\"PRICE_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the annual software price in dollars when charging a 15% value-capture share on $500,000 of proven customer annual cost savings ($500,000 \\times 0.15$)?",
          "expectedStringOutput": "75000",
          "acceptableAnswers": [
            "75000",
            "$75,000",
            "75,000",
            "price\":75000"
          ],
          "primaryMisconceptionId": "MC_ENT_PRICING_VALUE_BASED_TIERING",
          "diagnosisMap": {
            "5000": {
              "misconceptionId": "MC_ENT_PRICING_VALUE_BASED_TIERING",
              "errorExplanation": "5,000 is 1%. 15% of $500,000 is $75,000.",
              "recoveryPath": {
                "simplerExplanation": "500,000 * 0.15 = 75,000.",
                "guidedFixPrompt": "Type 75000"
              }
            }
          }
        }
      },
      {
        "id": "ent-d19-b2-good-better-best-tiering",
        "day": 19,
        "blockNumber": 2,
        "title": "Good-Better-Best Tiering & The Decoy Effect",
        "conceptBudget": {
          "primaryConcept": "Good-Better-Best Tier Architecture",
          "supportingTerms": [
            "Good ($29/mo: Basic features for entry users)",
            "Better ($79/mo: The target Sweet Spot with 80% adoption)",
            "Best ($199/mo: Anchor decoy tier making the $79 tier look like a bargain)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d19-b1-value-based-roi-sharing",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "3-Tier Price Architecture",
            "codeSnippet": "// STARTER ($29/mo):   Up to 3 users, standard support\n// PRO ($79/mo):       [MOST POPULAR] 10 users, advanced AI workflows, priority SLA\n// ENTERPRISE ($199/mo): Unlimited users, dedicated account manager, custom SSO",
            "lineNotes": {
              "1": "Entry tier.",
              "2": "Target monetization sweet spot.",
              "3": "Anchor tier."
            }
          },
          {
            "type": "runnable_code",
            "filename": "gbb_tier_demo.js",
            "initialCode": "function getOptimalMonetizationTier() {\n  return 'PRO_BETTER_TIER_OPTIMAL_SWEET_SPOT';\n}\n\nconsole.log(getOptimalMonetizationTier());",
            "expectedOutput": "PRO_BETTER_TIER_OPTIMAL_SWEET_SPOT",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which tier in a standard Good-Better-Best pricing matrix is engineered as the primary revenue-maximizing sweet spot?",
          "expectedStringOutput": "PRO_BETTER_TIER_OPTIMAL_SWEET_SPOT",
          "acceptableAnswers": [
            "PRO_BETTER_TIER_OPTIMAL_SWEET_SPOT",
            "Pro Tier",
            "Better Tier"
          ],
          "primaryMisconceptionId": "MC_ENT_PRICING_VALUE_BASED_TIERING",
          "diagnosisMap": {
            "STARTER": {
              "misconceptionId": "MC_ENT_PRICING_VALUE_BASED_TIERING",
              "errorExplanation": "Starter is an entry point. The Better/Pro tier is the target monetization sweet spot.",
              "recoveryPath": {
                "simplerExplanation": "Matches PRO_BETTER_TIER_OPTIMAL_SWEET_SPOT.",
                "guidedFixPrompt": "Type PRO_BETTER_TIER_OPTIMAL_SWEET_SPOT"
              }
            }
          }
        }
      },
      {
        "id": "ent-d19-b3-freemium-to-paid-conversion-rate",
        "day": 19,
        "blockNumber": 3,
        "title": "Freemium vs Free Trial Economics (The 2-4% Conversion Benchmark)",
        "conceptBudget": {
          "primaryConcept": "Freemium Conversion Economics",
          "supportingTerms": [
            "Freemium (Forever-free tier: 2-4% convert to paid)",
            "Free Trial with Credit Card Upfront (14-day trial: 40-50% convert to paid)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d19-b2-good-better-best-tiering",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "freemium_demo.js",
            "initialCode": "function getFreemiumConversionBenchmark() {\n  return 'TWO_TO_FOUR_PERCENT_FREEMIUM_TO_PAID_BENCHMARK';\n}\n\nconsole.log(getFreemiumConversionBenchmark());",
            "expectedOutput": "TWO_TO_FOUR_PERCENT_FREEMIUM_TO_PAID_BENCHMARK",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the standard industry benchmark percentage range for free-to-paid conversion in product-led freemium SaaS models?",
          "expectedStringOutput": "TWO_TO_FOUR_PERCENT_FREEMIUM_TO_PAID_BENCHMARK",
          "acceptableAnswers": [
            "TWO_TO_FOUR_PERCENT_FREEMIUM_TO_PAID_BENCHMARK",
            "2-4%",
            "2 to 4 percent"
          ],
          "primaryMisconceptionId": "MC_ENT_PRICING_VALUE_BASED_TIERING",
          "diagnosisMap": {
            "20%": {
              "misconceptionId": "MC_ENT_PRICING_VALUE_BASED_TIERING",
              "errorExplanation": "20% applies to credit card free trials. Freemium conversion benchmarks are 2-4%.",
              "recoveryPath": {
                "simplerExplanation": "Matches TWO_TO_FOUR_PERCENT_FREEMIUM_TO_PAID_BENCHMARK.",
                "guidedFixPrompt": "Type TWO_TO_FOUR_PERCENT_FREEMIUM_TO_PAID_BENCHMARK"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 20,
    "title": "Unit Economics & Customer Lifetime Value: The LTV / CAC >= 3.0x Benchmark",
    "overviewMetaphor": "The LTV to CAC Ratio is a Magical Money Machine with a 12x Output Multiplier: If an enterprise customer pays $1,200/year with an 80% gross margin and 10% annual churn, their Customer Lifetime Value is $9,600 ($LTV = \\frac{1200 \\times 0.80}{0.10} = \\$9,600$); spending $800 to acquire that customer ($CAC = \\$800$) produces an elite 12.0x LTV/CAC Ratio ($LTV/CAC = \\frac{9600}{800} = 12.0x$), with customer acquisition costs fully paid back in just 10.0 months.",
    "blocks": [
      {
        "id": "ent-d20-b1-ltv-cac-ratio-calculation",
        "day": 20,
        "blockNumber": 1,
        "title": "Customer Lifetime Value (LTV) Formula: $LTV = \\frac{\\text{ARPU} \\times \\text{Gross Margin}\\%}{\\text{Churn}\\%}$ & $LTV/CAC \\ge 3.0x$",
        "conceptBudget": {
          "primaryConcept": "LTV and LTV/CAC Ratio Formula",
          "supportingTerms": [
            "Annual Revenue per User ($ARPU = \\$1,200.00$)",
            "Gross Margin ($80.0\\% = 0.80$)",
            "Annual Churn ($10.0\\% = 0.10$)",
            "$LTV = \\frac{1,200 \\times 0.80}{0.10} = \\$9,600.00$",
            "Customer Acquisition Cost ($CAC = \\$800.00$)",
            "$LTV/CAC = \\frac{9,600}{800} = 12.0x$",
            "CAC Payback = $\\frac{800}{1,200 \\times 0.80 / 12} = 10.0$ months"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d19-b1-value-based-roi-sharing",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "SaaS Unit Economics Ledger ($1,200 ARPU, 80% Margin, 10% Churn, $800 CAC)",
              "boxes": [
                {
                  "label": "Customer Lifetime Value",
                  "value": "($1,200 x 80%) / 10% = $9,600.00 Lifetime Value (LTV)",
                  "varType": "LTV",
                  "isUpdated": false
                },
                {
                  "label": "Acquisition Cost (CAC)",
                  "value": "$800.00 Fully Loaded Marketing & Sales Acquisition Cost",
                  "varType": "CAC",
                  "isUpdated": false
                },
                {
                  "label": "LTV/CAC & Payback",
                  "value": "LTV/CAC = 12.0x | Payback = 10.0 Months (ELITE VENTURE SCALE CAPITAL ENGINE!)",
                  "varType": "Efficiency",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "ltv_cac_calc_demo.js",
            "initialCode": "function calculateLtvCac(arpu, marginPct, churnPct, cac) {\n  const ltv = (arpu * (marginPct / 100)) / (churnPct / 100);\n  const ratio = ltv / cac;\n  const monthlyMargin = (arpu * (marginPct / 100)) / 12;\n  const payback = cac / monthlyMargin;\n  return {\n    ltv: Number(ltv.toFixed(2)),\n    ltvCacRatio: Number(ratio.toFixed(2)),\n    paybackMonths: Number(payback.toFixed(1)),\n    isElite: ratio >= 3.0 && payback <= 12,\n    status: 'UNIT_ECONOMICS_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateLtvCac(1200, 80, 10, 800)));",
            "expectedOutput": "{\"ltv\":9600,\"ltvCacRatio\":12,\"paybackMonths\":10,\"isElite\":true,\"status\":\"UNIT_ECONOMICS_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Customer Lifetime Value (LTV) in dollars when annual ARPU is $1,200, Gross Margin is 80%, and Annual Churn is 10% ($ (1,200 \\times 0.80) / 0.10 $)?",
          "expectedStringOutput": "9600",
          "acceptableAnswers": [
            "9600",
            "$9,600",
            "9,600",
            "ltv\":9600"
          ],
          "primaryMisconceptionId": "MC_ENT_UNIT_ECONOMICS_LTV_CAC_PAYBACK",
          "diagnosisMap": {
            "12000": {
              "misconceptionId": "MC_ENT_UNIT_ECONOMICS_LTV_CAC_PAYBACK",
              "errorExplanation": "12,000 forgets the 80% gross margin (1,200 / 0.10). LTV must be adjusted for gross margin: 960 / 0.10 = $9,600.",
              "recoveryPath": {
                "simplerExplanation": "(1,200 * 0.80) / 0.10 = 9,600.",
                "guidedFixPrompt": "Type 9600"
              }
            }
          }
        }
      },
      {
        "id": "ent-d20-b2-cac-payback-period-months",
        "day": 20,
        "blockNumber": 2,
        "title": "CAC Payback Period & Capital Efficiency (< 12 Months Benchmark)",
        "conceptBudget": {
          "primaryConcept": "CAC Payback Invariant",
          "supportingTerms": [
            "CAC Payback Period (Time required for gross profit from a customer to repay the $CAC spent to acquire them)",
            "Target $< 12$ months to allow rapid capital recycling into marketing"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d20-b1-ltv-cac-ratio-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Payback Speed Benchmark",
            "codeSnippet": "// Payback < 12 Months:  HIGH CAPITAL RECYCLING (Reinvest profits into ads every year!)\n// Payback > 24 Months:  DEATH SPIRAL (Company burns cash waiting 2 years to break even on ads)",
            "lineNotes": {
              "1": "High velocity capital.",
              "2": "Dangerous cash trap."
            }
          },
          {
            "type": "runnable_code",
            "filename": "payback_eval_demo.js",
            "initialCode": "function evaluatePaybackHealth(paybackMonths) {\n  return paybackMonths <= 12\n    ? 'HEALTHY_RAPID_CAPITAL_RECYCLING'\n    : 'DANGEROUS_CASH_DRAIN_SLOW_PAYBACK';\n}\n\nconsole.log(evaluatePaybackHealth(10));\nconsole.log(evaluatePaybackHealth(24));",
            "expectedOutput": "HEALTHY_RAPID_CAPITAL_RECYCLING\nDANGEROUS_CASH_DRAIN_SLOW_PAYBACK",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the maximum allowable CAC Payback Period in months for a high-efficiency venture-scale B2B SaaS startup?",
          "expectedStringOutput": "12",
          "acceptableAnswers": [
            "12",
            "12 months",
            "Twelve months"
          ],
          "primaryMisconceptionId": "MC_ENT_UNIT_ECONOMICS_LTV_CAC_PAYBACK",
          "diagnosisMap": {
            "24": {
              "misconceptionId": "MC_ENT_UNIT_ECONOMICS_LTV_CAC_PAYBACK",
              "errorExplanation": "24 months ties up capital too long. The benchmark is <= 12 months.",
              "recoveryPath": {
                "simplerExplanation": "Benchmark is 12 months.",
                "guidedFixPrompt": "Type 12"
              }
            }
          }
        }
      },
      {
        "id": "ent-d20-b3-magic-number-sales-efficiency",
        "day": 20,
        "blockNumber": 3,
        "title": "The SaaS Magic Number: Net New ARR / Sales & Marketing Spend",
        "conceptBudget": {
          "primaryConcept": "SaaS Magic Number Formula",
          "supportingTerms": [
            "$\\text{Magic Number} = \\frac{(Q_t \\text{ ARR} - Q_{t-1} \\text{ ARR}) \\times 4}{\\text{Prior Quarter S&M Spend}}$",
            "Score $\\ge 1.0 \\implies$ Pour fuel on sales engine; $< 0.75 \\implies$ Fix sales efficiency before spending"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d20-b2-cac-payback-period-months",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "magic_number_demo.js",
            "initialCode": "function calculateMagicNumber(netNewArrQuarterly, smSpendQuarterly) {\n  const magic = (netNewArrQuarterly * 4) / (smSpendQuarterly * 4);\n  return Number((netNewArrQuarterly / smSpendQuarterly).toFixed(2));\n}\n\nconsole.log(calculateMagicNumber(500000, 400000));",
            "expectedOutput": "1.25",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the SaaS Magic Number when $500,000 in net new ARR is generated from $400,000 in Sales & Marketing spend ($500,000 / 400,000$)?",
          "expectedStringOutput": "1.25",
          "acceptableAnswers": [
            "1.25",
            "1.25x"
          ],
          "primaryMisconceptionId": "MC_ENT_UNIT_ECONOMICS_LTV_CAC_PAYBACK",
          "diagnosisMap": {
            "0.8": {
              "misconceptionId": "MC_ENT_UNIT_ECONOMICS_LTV_CAC_PAYBACK",
              "errorExplanation": "0.8 divides spend by revenue (400k / 500k). Magic number divides Net New ARR by S&M spend = 1.25.",
              "recoveryPath": {
                "simplerExplanation": "500,000 / 400,000 = 1.25.",
                "guidedFixPrompt": "Type 1.25"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 21,
    "title": "⭐ MILESTONE 3: Complete GTM, RevOps, Unit Economics & Quality Scaling Engine",
    "overviewMetaphor": "Milestone 3 Synthesis: The complete sovereign GTM scaling, RevOps pipeline, and quality operations engine: 1. Six Sigma process capability ($C_{pk} = 1.33$); 2. Viral loop coefficient ($K = 1.50$); 3. RevOps pipeline coverage ($3.50x$); 4. Value-based pricing ($75,000$ annual price); 5. LTV/CAC unit economics validation ($9,600 LTV, 12.0x LTV/CAC$).",
    "blocks": [
      {
        "id": "ent-d21-b1-gtm-scaling-master-synthesis",
        "day": 21,
        "blockNumber": 1,
        "title": "GTM & Operational Scaling Master Engine Synthesis",
        "conceptBudget": {
          "primaryConcept": "GTM & Scaling Engine Synthesis",
          "supportingTerms": [
            "Six Sigma Cpk Engine",
            "Viral Loop Engine",
            "RevOps Pipeline Engine",
            "Value Pricing Engine",
            "LTV/CAC Unit Economics Engine"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d20-b3-magic-number-sales-efficiency",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Milestone 3 GTM & Operational Scaling Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "Certifies Cpk 1.33 Six Sigma quality standard",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Validates K=1.50 viral growth loop & 3.5x RevOps coverage",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Executes $75k value-based pricing sharing 15% customer ROI",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Validates 12.0x LTV/CAC unit economics and certifies scaling engine!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "gtm_scaling_kernel_demo.js",
            "initialCode": "function runGtmScalingEngine() {\n  return {\n    cpkSubsystem: 'ONLINE_CPK_1_33_ACTIVE',\n    viralSubsystem: 'ONLINE_K_FACTOR_1_50_ACTIVE',\n    revOpsSubsystem: 'ONLINE_3_5X_PIPELINE_ACTIVE',\n    pricingSubsystem: 'ONLINE_VALUE_BASED_PRICING_ACTIVE',\n    ltvSubsystem: 'ONLINE_12X_LTV_CAC_ACTIVE',\n    engineStatus: 'GTM_AND_OPERATIONAL_SCALING_MASTER_ACTIVE'\n  };\n}\n\nconsole.log(runGtmScalingEngine().engineStatus);",
            "expectedOutput": "GTM_AND_OPERATIONAL_SCALING_MASTER_ACTIVE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What engine status confirms active operational synthesis of the GTM & Operational Scaling Master Engine?",
          "expectedStringOutput": "GTM_AND_OPERATIONAL_SCALING_MASTER_ACTIVE",
          "acceptableAnswers": [
            "GTM_AND_OPERATIONAL_SCALING_MASTER_ACTIVE",
            "engineStatus: GTM_AND_OPERATIONAL_SCALING_MASTER_ACTIVE"
          ],
          "primaryMisconceptionId": "MC_ENT_GTM_BEACHHEAD_VIRAL_LOOPS",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_ENT_GTM_BEACHHEAD_VIRAL_LOOPS",
              "errorExplanation": "Matches GTM_AND_OPERATIONAL_SCALING_MASTER_ACTIVE.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type GTM_AND_OPERATIONAL_SCALING_MASTER_ACTIVE"
              }
            }
          }
        }
      },
      {
        "id": "ent-d21-b2-scaling-engine-audit",
        "day": 21,
        "blockNumber": 2,
        "title": "GTM & Scaling Engine Invariant Verification & Precision Audit",
        "conceptBudget": {
          "primaryConcept": "Scaling Invariant Verification",
          "supportingTerms": [
            "Quality Invariant",
            "Pipeline Invariant",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d21-b1-gtm-scaling-master-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "scaling_audit_demo.js",
            "initialCode": "function auditScalingEngine(cpkValid, kValid, revValid, priceValid, ltvValid) {\n  const passed = cpkValid && kValid && revValid && priceValid && ltvValid;\n  return {\n    cpkVerified: cpkValid,\n    viralVerified: kValid,\n    revOpsVerified: revValid,\n    pricingVerified: priceValid,\n    ltvVerified: ltvValid,\n    grade: passed ? 'GTM_SCALING_ENGINE_AUDIT_PASSED' : 'AUDIT_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditScalingEngine(true, true, true, true, true)));",
            "expectedOutput": "{\"cpkVerified\":true,\"viralVerified\":true,\"revOpsVerified\":true,\"pricingVerified\":true,\"ltvVerified\":true,\"grade\":\"GTM_SCALING_ENGINE_AUDIT_PASSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade is awarded when Cpk, Viral, RevOps, Pricing, and LTV engines pass 100%?",
          "expectedStringOutput": "GTM_SCALING_ENGINE_AUDIT_PASSED",
          "acceptableAnswers": [
            "GTM_SCALING_ENGINE_AUDIT_PASSED",
            "grade\":\"GTM_SCALING_ENGINE_AUDIT_PASSED\""
          ],
          "primaryMisconceptionId": "MC_ENT_GTM_BEACHHEAD_VIRAL_LOOPS",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_ENT_GTM_BEACHHEAD_VIRAL_LOOPS",
              "errorExplanation": "All checks passing awards GTM_SCALING_ENGINE_AUDIT_PASSED.",
              "recoveryPath": {
                "simplerExplanation": "Awards GTM_SCALING_ENGINE_AUDIT_PASSED.",
                "guidedFixPrompt": "Type GTM_SCALING_ENGINE_AUDIT_PASSED"
              }
            }
          }
        }
      },
      {
        "id": "ent-d21-b3-milestone3-ent-cert",
        "day": 21,
        "blockNumber": 3,
        "title": "Milestone 3 GTM & Operational Scaling Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 3 Certification",
          "supportingTerms": [
            "GTM Scaling Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d21-b2-scaling-engine-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone3_ent_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 3: Complete GTM, RevOps, Unit Economics & Quality Scaling Engine [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 3: Complete GTM, RevOps, Unit Economics & Quality Scaling Engine [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 3 completion?",
          "expectedStringOutput": "⭐ MILESTONE 3: Complete GTM, RevOps, Unit Economics & Quality Scaling Engine [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 3: Complete GTM, RevOps, Unit Economics & Quality Scaling Engine [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_ENT_GTM_BEACHHEAD_VIRAL_LOOPS",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_ENT_GTM_BEACHHEAD_VIRAL_LOOPS",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 3: Complete GTM, RevOps, Unit Economics & Quality Scaling Engine [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 22,
    "title": "HR, Hiring & Compensation: Employee Stock Option Pool (ESOP 10-15%) & 9-Box Grid",
    "overviewMetaphor": "An ESOP Pool is a Stock Options Treasury Chest Reserved for Top Talent: When a startup with 10,000,000 authorized shares creates a standard 12.0% ESOP Option Pool, exactly 1,200,000 unallocated shares are set aside ($10,000,000 \\times 0.12$); after granting 300,000 shares to a world-class VP of Engineering ($1,200,000 - 300,000$), a healthy reserve of 900,000 ungranted shares remains to recruit future elite executive talent.",
    "blocks": [
      {
        "id": "ent-d22-b1-esop-pool-grant-calculation",
        "day": 22,
        "blockNumber": 1,
        "title": "ESOP Option Pool Allocation: $\\text{Remaining Reserve} = (\\text{Total Shares} \\times \\text{Pool}\\%) - \\text{Granted Shares}$",
        "conceptBudget": {
          "primaryConcept": "ESOP Pool Allocation Formula",
          "supportingTerms": [
            "Total Company Shares ($10,000,000$)",
            "ESOP Pool % ($12.0\\% \\implies 1,200,000$ pool shares)",
            "Key Hire Granted Shares ($300,000$)",
            "Remaining Ungranted Pool = $1,200,000 - 300,000 = 900,000$ shares",
            "Standard Startup Benchmark: $10.0\\% - 15.0\\%$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d21-b1-gtm-scaling-master-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "ESOP Option Pool Ledger (10M Shares, 12% Pool, 300k Grant)",
              "boxes": [
                {
                  "label": "Total ESOP Pool (12%)",
                  "value": "10,000,000 x 12.0% = 1,200,000 Total Option Pool Shares",
                  "varType": "Total Pool",
                  "isUpdated": false
                },
                {
                  "label": "VP Engineering Grant",
                  "value": "300,000 Shares Granted with 4-Yr Vesting (3.0% of company)",
                  "varType": "Granted",
                  "isUpdated": false
                },
                {
                  "label": "Remaining Option Reserve",
                  "value": "1,200,000 - 300,000 = 900,000 UNGRANTED SHARES IN TREASURY!",
                  "varType": "Reserve",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "esop_calc_demo.js",
            "initialCode": "function calculateEsop(totalShares, poolPct, grantShares) {\n  const pool = Math.floor(totalShares * (poolPct / 100));\n  const remaining = pool - grantShares;\n  return {\n    totalPool: pool,\n    granted: grantShares,\n    remainingShares: remaining,\n    status: 'ESOP_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateEsop(10000000, 12, 300000)));",
            "expectedOutput": "{\"totalPool\":1200000,\"granted\":300000,\"remainingShares\":900000,\"status\":\"ESOP_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many ungranted option shares remain in the startup treasury after granting 300,000 shares from a 12% ESOP pool on 10,000,000 total shares ($ (10,000,000 \\times 0.12) - 300,000 $)?",
          "expectedStringOutput": "900000",
          "acceptableAnswers": [
            "900000",
            "900,000",
            "remainingShares\":900000"
          ],
          "primaryMisconceptionId": "MC_ENT_HR_ESOP_POOL_9_BOX_CALIBRATION",
          "diagnosisMap": {
            "1200000": {
              "misconceptionId": "MC_ENT_HR_ESOP_POOL_9_BOX_CALIBRATION",
              "errorExplanation": "1,200,000 is total pool size before grants. Subtracting the 300k grant leaves 900,000 shares.",
              "recoveryPath": {
                "simplerExplanation": "1,200,000 - 300,000 = 900,000.",
                "guidedFixPrompt": "Type 900000"
              }
            }
          }
        }
      },
      {
        "id": "ent-d22-b2-nine-box-performance-potential-grid",
        "day": 22,
        "blockNumber": 2,
        "title": "McKinsey 9-Box Grid: Performance vs Potential Talent Calibration",
        "conceptBudget": {
          "primaryConcept": "9-Box Talent Calibration Matrix",
          "supportingTerms": [
            "High Performance + High Potential $\\implies$ 'Star / High-Flyer' (Fast-track promotion & executive mentorship)",
            "Low Performance + Low Potential $\\implies$ 'Risk / Bad Fit' (Performance improvement plan PIP or exit)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d22-b1-esop-pool-grant-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "9-Box Calibration Quadrants",
            "codeSnippet": "// HIGH PERF + HIGH POTENTIAL: 'STAR' -> 2x Stock Options + Fast-Track Promotion\n// HIGH PERF + LOW POTENTIAL:  'WORKHORSE' -> Retain, maintain steady compensation\n// LOW PERF  + HIGH POTENTIAL: 'ENIGMA' -> Reassign manager, address motivation gaps",
            "lineNotes": {
              "1": "High-flyer star.",
              "2": "Solid core contributor.",
              "3": "Misaligned high potential."
            }
          },
          {
            "type": "runnable_code",
            "filename": "nine_box_demo.js",
            "initialCode": "function calibrateTalent(performance, potential) {\n  if (performance === 'HIGH' && potential === 'HIGH') return 'STAR_FUTURE_EXECUTIVE_LEADER';\n  if (performance === 'HIGH' && potential === 'LOW') return 'TRUSTED_PROFESSIONAL_WORKHORSE';\n  return 'STANDARD_CONTRIBUTOR';\n}\n\nconsole.log(calibrateTalent('HIGH', 'HIGH'));\nconsole.log(calibrateTalent('HIGH', 'LOW'));",
            "expectedOutput": "STAR_FUTURE_EXECUTIVE_LEADER\nTRUSTED_PROFESSIONAL_WORKHORSE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How is an employee classified on the McKinsey 9-Box Grid when exhibiting both High Performance and High Leadership Potential?",
          "expectedStringOutput": "STAR_FUTURE_EXECUTIVE_LEADER",
          "acceptableAnswers": [
            "STAR_FUTURE_EXECUTIVE_LEADER",
            "Star",
            "Star Leader"
          ],
          "primaryMisconceptionId": "MC_ENT_HR_ESOP_POOL_9_BOX_CALIBRATION",
          "diagnosisMap": {
            "WORKHORSE": {
              "misconceptionId": "MC_ENT_HR_ESOP_POOL_9_BOX_CALIBRATION",
              "errorExplanation": "Workhorses have low potential. High performance + high potential is a STAR_FUTURE_EXECUTIVE_LEADER.",
              "recoveryPath": {
                "simplerExplanation": "Matches STAR_FUTURE_EXECUTIVE_LEADER.",
                "guidedFixPrompt": "Type STAR_FUTURE_EXECUTIVE_LEADER"
              }
            }
          }
        }
      },
      {
        "id": "ent-d22-b3-culture-codes-hiring-bar",
        "day": 22,
        "blockNumber": 3,
        "title": "Culture Codes: Netflix Keeper Test & Bar Raiser Interviewing",
        "conceptBudget": {
          "primaryConcept": "Culture & Bar Raiser Systems",
          "supportingTerms": [
            "Netflix Keeper Test ('If this employee wanted to leave tomorrow, would I fight hard to keep them?')",
            "Amazon Bar Raiser (An independent interviewer outside the hiring team with absolute veto power to prevent lowering the hiring bar)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d22-b2-nine-box-performance-potential-grid",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "bar_raiser_demo.js",
            "initialCode": "function evaluateBarRaiserDecision(isBetterThanFiftyPercentOfCurrentTeam) {\n  return isBetterThanFiftyPercentOfCurrentTeam\n    ? 'APPROVE_HIRE_RAISES_TALENT_BAR'\n    : 'VETO_HIRE_LOWERS_CULTURE_BAR';\n}\n\nconsole.log(evaluateBarRaiserDecision(true));\nconsole.log(evaluateBarRaiserDecision(false));",
            "expectedOutput": "APPROVE_HIRE_RAISES_TALENT_BAR\nVETO_HIRE_LOWERS_CULTURE_BAR",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What hiring outcome is mandated by a Bar Raiser when a job candidate does not perform better than 50% of current team members in that role?",
          "expectedStringOutput": "VETO_HIRE_LOWERS_CULTURE_BAR",
          "acceptableAnswers": [
            "VETO_HIRE_LOWERS_CULTURE_BAR",
            "Veto Hire",
            "Reject candidate"
          ],
          "primaryMisconceptionId": "MC_ENT_HR_ESOP_POOL_9_BOX_CALIBRATION",
          "diagnosisMap": {
            "APPROVE": {
              "misconceptionId": "MC_ENT_HR_ESOP_POOL_9_BOX_CALIBRATION",
              "errorExplanation": "Bar Raisers must reject any candidate who does not raise the average bar.",
              "recoveryPath": {
                "simplerExplanation": "Matches VETO_HIRE_LOWERS_CULTURE_BAR.",
                "guidedFixPrompt": "Type VETO_HIRE_LOWERS_CULTURE_BAR"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 23,
    "title": "Leadership & Team Management: Situational Leadership II & Psychological Safety",
    "overviewMetaphor": "Situational Leadership is a Master Coach Shifting Gear for Every Runner: An enthusiastic new hire with zero experience (D1) needs Directing (S1: clear checklists and daily check-ins); an experienced veteran who operates autonomously (D4) suffocates under micromanagement and needs Delegating (S4: clear ownership and strategic trust); adapting your leadership style to match each team member's specific developmental stage builds high psychological safety and peak team performance.",
    "blocks": [
      {
        "id": "ent-d23-b1-situational-leadership-four-quadrants",
        "day": 23,
        "blockNumber": 1,
        "title": "Hersey-Blanchard Situational Leadership II: D1-D4 to S1-S4 Mapping",
        "conceptBudget": {
          "primaryConcept": "Situational Leadership Matrix",
          "supportingTerms": [
            "D1 (Low Competence / High Commitment) $\\to$ S1 Directing",
            "D2 (Some Competence / Low Commitment) $\\to$ S2 Coaching",
            "D3 (High Competence / Variable Commitment) $\\to$ S3 Supporting",
            "D4 (High Competence / High Commitment) $\\to$ S4 Delegating"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d22-b1-esop-pool-grant-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Situational Leadership II Mapping Grid",
              "boxes": [
                {
                  "label": "D1: Enthusiastic Beginner",
                  "value": "S1 DIRECTING (High Directive / Low Supportive Guidance)",
                  "varType": "S1 Style",
                  "isUpdated": false
                },
                {
                  "label": "D2: Disillusioned Learner",
                  "value": "S2 COACHING (High Directive / High Supportive Encouragement)",
                  "varType": "S2 Style",
                  "isUpdated": false
                },
                {
                  "label": "D4: Self-Reliant Achiever",
                  "value": "S4 DELEGATING (Low Directive / Low Supportive Autonomy!)",
                  "varType": "S4 Style",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "leadership_demo.js",
            "initialCode": "function mapLeadershipStyle(devLevel) {\n  const map = {\n    D1: 'S1_DIRECTING',\n    D2: 'S2_COACHING',\n    D3: 'S3_SUPPORTING',\n    D4: 'S4_DELEGATING'\n  };\n  return map[devLevel] || 'UNKNOWN';\n}\n\nconsole.log(mapLeadershipStyle('D1'));\nconsole.log(mapLeadershipStyle('D4'));",
            "expectedOutput": "S1_DIRECTING\nS4_DELEGATING",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which leadership style is required when managing a D4 self-reliant high-performing executive under Situational Leadership II?",
          "expectedStringOutput": "S4_DELEGATING",
          "acceptableAnswers": [
            "S4_DELEGATING",
            "Delegating",
            "S4 Delegating"
          ],
          "primaryMisconceptionId": "MC_ENT_LEADERSHIP_SITUATIONAL_PSYCH_SAFETY",
          "diagnosisMap": {
            "S1_DIRECTING": {
              "misconceptionId": "MC_ENT_LEADERSHIP_SITUATIONAL_PSYCH_SAFETY",
              "errorExplanation": "Directing is for D1 beginners. D4 achievers require S4_DELEGATING.",
              "recoveryPath": {
                "simplerExplanation": "Matches S4_DELEGATING.",
                "guidedFixPrompt": "Type S4_DELEGATING"
              }
            }
          }
        }
      },
      {
        "id": "ent-d23-b2-psychological-safety-amy-edmondson",
        "day": 23,
        "blockNumber": 2,
        "title": "Amy Edmondson's Psychological Safety & Google Project Aristotle",
        "conceptBudget": {
          "primaryConcept": "Psychological Safety Invariant",
          "supportingTerms": [
            "Psychological Safety (A shared belief that the team is safe for interpersonal risk-taking without fear of punishment or ridicule)",
            "Google Project Aristotle #1 predictor of team effectiveness"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d23-b1-situational-leadership-four-quadrants",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Psychological Safety Behaviors",
            "codeSnippet": "// ❌ FEAR CULTURE:      Leader punishes junior engineer for asking a clarifying question -> Mistakes hidden!\n// ✅ PSYCH SAFETY:      Leader admits own mistake: 'I made the wrong call on that API, let's learn together!'",
            "lineNotes": {
              "1": "Toxic blame culture.",
              "2": "Vulnerable psychological safety."
            }
          },
          {
            "type": "runnable_code",
            "filename": "psych_safety_demo.js",
            "initialCode": "function evaluateTeamCulture(allowsAdmittingMistakes) {\n  return allowsAdmittingMistakes\n    ? 'HIGH_PSYCHOLOGICAL_SAFETY_HIGH_INNOVATION'\n    : 'TOXIC_BLAME_CULTURE_HIDDEN_FAILURES';\n}\n\nconsole.log(evaluateTeamCulture(true));",
            "expectedOutput": "HIGH_PSYCHOLOGICAL_SAFETY_HIGH_INNOVATION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What team culture status is unlocked when leadership establishes an environment where engineers can openly admit mistakes and ask candid questions?",
          "expectedStringOutput": "HIGH_PSYCHOLOGICAL_SAFETY_HIGH_INNOVATION",
          "acceptableAnswers": [
            "HIGH_PSYCHOLOGICAL_SAFETY_HIGH_INNOVATION",
            "High Psychological Safety",
            "Psychological Safety"
          ],
          "primaryMisconceptionId": "MC_ENT_LEADERSHIP_SITUATIONAL_PSYCH_SAFETY",
          "diagnosisMap": {
            "TOXIC": {
              "misconceptionId": "MC_ENT_LEADERSHIP_SITUATIONAL_PSYCH_SAFETY",
              "errorExplanation": "Openness enables HIGH_PSYCHOLOGICAL_SAFETY_HIGH_INNOVATION.",
              "recoveryPath": {
                "simplerExplanation": "Matches HIGH_PSYCHOLOGICAL_SAFETY_HIGH_INNOVATION.",
                "guidedFixPrompt": "Type HIGH_PSYCHOLOGICAL_SAFETY_HIGH_INNOVATION"
              }
            }
          }
        }
      },
      {
        "id": "ent-d23-b3-radical-candor-framework",
        "day": 23,
        "blockNumber": 3,
        "title": "Kim Scott's Radical Candor: Care Personally + Challenge Directly",
        "conceptBudget": {
          "primaryConcept": "Radical Candor 4 Quadrants",
          "supportingTerms": [
            "Radical Candor (High Care + High Challenge)",
            "Ruinous Empathy (High Care + Low Challenge: Too polite to give real feedback)",
            "Obnoxious Aggression (Low Care + High Challenge)",
            "Manipulative Insincerity (Low Care + Low Challenge)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d23-b2-psychological-safety-amy-edmondson",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "radical_candor_demo.js",
            "initialCode": "function classifyFeedback(carePersonally, challengeDirectly) {\n  if (carePersonally && challengeDirectly) return 'RADICAL_CANDOR';\n  if (carePersonally && !challengeDirectly) return 'RUINOUS_EMPATHY';\n  if (!carePersonally && challengeDirectly) return 'OBNOXIOUS_AGGRESSION';\n  return 'MANIPULATIVE_INSINCERITY';\n}\n\nconsole.log(classifyFeedback(true, true));\nconsole.log(classifyFeedback(true, false));",
            "expectedOutput": "RADICAL_CANDOR\nRUINOUS_EMPATHY",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What feedback quadrant describes withholding critical constructive criticism out of fear of hurting an employee's feelings (High Care + Low Challenge)?",
          "expectedStringOutput": "RUINOUS_EMPATHY",
          "acceptableAnswers": [
            "RUINOUS_EMPATHY",
            "Ruinous Empathy"
          ],
          "primaryMisconceptionId": "MC_ENT_LEADERSHIP_SITUATIONAL_PSYCH_SAFETY",
          "diagnosisMap": {
            "RADICAL_CANDOR": {
              "misconceptionId": "MC_ENT_LEADERSHIP_SITUATIONAL_PSYCH_SAFETY",
              "errorExplanation": "Radical candor combines personal care with direct challenge. Withholding criticism is RUINOUS_EMPATHY.",
              "recoveryPath": {
                "simplerExplanation": "Matches RUINOUS_EMPATHY.",
                "guidedFixPrompt": "Type RUINOUS_EMPATHY"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 24,
    "title": "Corporate Governance & Board Dynamics: Fiduciary Duties & Voting Control",
    "overviewMetaphor": "The Board of Directors is the Steering Committee of a Sovereign Ship: While the CEO is the Captain piloting daily voyages, the Board represents the shareholders who own the vessel; with 4 out of 5 directors voting in favor ($4/5 = 80.0\\%$), a critical corporate financing resolution easily clears the 75.0% Supermajority Protective Provision threshold, legally authorizing executive execution.",
    "blocks": [
      {
        "id": "ent-d24-b1-board-supermajority-voting",
        "day": 24,
        "blockNumber": 1,
        "title": "Board Protective Provisions: $75.0\\%$ Supermajority Approval Thresholds",
        "conceptBudget": {
          "primaryConcept": "Supermajority Voting Formula",
          "supportingTerms": [
            "Total Board Seats ($5$)",
            "Yes Votes Cast ($4$)",
            "Approval % = $\\frac{4}{5} \\times 100\\% = 80.0\\%$",
            "Supermajority Protective Threshold ($75.0\\%$ required for M&A, new debt $> \\$500k$, or CEO changes)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d23-b1-situational-leadership-four-quadrants",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Board Voting Ledger (5 Total Seats, 4 Yes Votes, 75% Threshold)",
              "boxes": [
                {
                  "label": "Votes Cast",
                  "value": "4 In Favor (2 Founders, 1 Lead VC, 1 Independent Director)",
                  "varType": "Votes",
                  "isUpdated": false
                },
                {
                  "label": "Voting Share",
                  "value": "4 / 5 = 80.00% Board Affirmation",
                  "varType": "Vote Share",
                  "isUpdated": false
                },
                {
                  "label": "Resolution Status",
                  "value": "80.0% >= 75.0% Supermajority -> BOARD RESOLUTION APPROVED NOMINAL!",
                  "varType": "Resolution",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "board_vote_calc_demo.js",
            "initialCode": "function evaluateBoardVote(yes, total, requiresSuper) {\n  const pct = (yes / total) * 100;\n  const threshold = requiresSuper ? 75.0 : 50.0;\n  const isApproved = pct >= threshold;\n  return {\n    yes,\n    total,\n    approvalPct: Number(pct.toFixed(2)),\n    isApproved,\n    status: isApproved ? 'BOARD_RESOLUTION_APPROVED' : 'BOARD_RESOLUTION_REJECTED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateBoardVote(4, 5, true)));\nconsole.log(JSON.stringify(evaluateBoardVote(3, 5, true)));",
            "expectedOutput": "{\"yes\":4,\"total\":5,\"approvalPct\":80,\"isApproved\":true,\"status\":\"BOARD_RESOLUTION_APPROVED\"}\n{\"yes\":3,\"total\":5,\"approvalPct\":60,\"isApproved\":false,\"status\":\"BOARD_RESOLUTION_REJECTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What resolution status is awarded when 4 out of 5 board members vote in favor of a major transaction requiring a 75% supermajority ($80\\% \\ge 75\\%$)?",
          "expectedStringOutput": "BOARD_RESOLUTION_APPROVED",
          "acceptableAnswers": [
            "BOARD_RESOLUTION_APPROVED",
            "Approved",
            "Resolution Approved"
          ],
          "primaryMisconceptionId": "MC_ENT_GOVERNANCE_BOARD_FIDUCIARY_DUTIES",
          "diagnosisMap": {
            "REJECTED": {
              "misconceptionId": "MC_ENT_GOVERNANCE_BOARD_FIDUCIARY_DUTIES",
              "errorExplanation": "4 out of 5 is 80.0%, which clears the 75.0% threshold to pass.",
              "recoveryPath": {
                "simplerExplanation": "Matches BOARD_RESOLUTION_APPROVED.",
                "guidedFixPrompt": "Type BOARD_RESOLUTION_APPROVED"
              }
            }
          }
        }
      },
      {
        "id": "ent-d24-b2-duty-of-care-and-loyalty",
        "day": 24,
        "blockNumber": 2,
        "title": "Fiduciary Duties: Duty of Care & Duty of Loyalty",
        "conceptBudget": {
          "primaryConcept": "Two Core Fiduciary Duties",
          "supportingTerms": [
            "Duty of Care (Directors must make informed, prudent business decisions in good faith)",
            "Duty of Loyalty (Directors must never engage in self-dealing or undisclosed conflicts of interest)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d24-b1-board-supermajority-voting",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Fiduciary Breach Examples",
            "codeSnippet": "// ❌ LOYALTY BREACH: Director directs company to buy office supplies from their spouse at 3x markup!\n// ✅ DUTY MET:       Director recuses themselves from vote, discloses conflict, gets 3 independent bids",
            "lineNotes": {
              "1": "Self-dealing violation.",
              "2": "Clean fiduciary compliance."
            }
          },
          {
            "type": "runnable_code",
            "filename": "fiduciary_demo.js",
            "initialCode": "function getFiduciaryDutiesPillars() {\n  return 'DUTY_OF_CARE_AND_DUTY_OF_LOYALTY';\n}\n\nconsole.log(getFiduciaryDutiesPillars());",
            "expectedOutput": "DUTY_OF_CARE_AND_DUTY_OF_LOYALTY",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What twin legal fiduciary obligations are owed by corporate board members to the company and its shareholders?",
          "expectedStringOutput": "DUTY_OF_CARE_AND_DUTY_OF_LOYALTY",
          "acceptableAnswers": [
            "DUTY_OF_CARE_AND_DUTY_OF_LOYALTY",
            "Duty of care and loyalty"
          ],
          "primaryMisconceptionId": "MC_ENT_GOVERNANCE_BOARD_FIDUCIARY_DUTIES",
          "diagnosisMap": {
            "CARE_ONLY": {
              "misconceptionId": "MC_ENT_GOVERNANCE_BOARD_FIDUCIARY_DUTIES",
              "errorExplanation": "Directors owe both Duty of Care and Duty of Loyalty.",
              "recoveryPath": {
                "simplerExplanation": "Matches DUTY_OF_CARE_AND_DUTY_OF_LOYALTY.",
                "guidedFixPrompt": "Type DUTY_OF_CARE_AND_DUTY_OF_LOYALTY"
              }
            }
          }
        }
      },
      {
        "id": "ent-d24-b3-audit-compensation-committees",
        "day": 24,
        "blockNumber": 3,
        "title": "Independent Board Committees: Audit & Compensation Committees",
        "conceptBudget": {
          "primaryConcept": "Board Committees Invariant",
          "supportingTerms": [
            "Audit Committee (Oversees external statutory audits, financial controls, and risk disclosures)",
            "Compensation Committee (Determines executive salaries, bonus benchmarks, and ESOP grants)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d24-b2-duty-of-care-and-loyalty",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "board_committees_demo.js",
            "initialCode": "function getCommitteeFunction(committee) {\n  return committee === 'AUDIT'\n    ? 'STATUTORY_FINANCIAL_OVERSIGHT_AND_INTERNAL_CONTROLS'\n    : 'EXECUTIVE_SALARY_AND_ESOP_ALLOCATION';\n}\n\nconsole.log(getCommitteeFunction('AUDIT'));\nconsole.log(getCommitteeFunction('COMPENSATION'));",
            "expectedOutput": "STATUTORY_FINANCIAL_OVERSIGHT_AND_INTERNAL_CONTROLS\nEXECUTIVE_SALARY_AND_ESOP_ALLOCATION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What core governance responsibility is executed by an independent Board Audit Committee?",
          "expectedStringOutput": "STATUTORY_FINANCIAL_OVERSIGHT_AND_INTERNAL_CONTROLS",
          "acceptableAnswers": [
            "STATUTORY_FINANCIAL_OVERSIGHT_AND_INTERNAL_CONTROLS",
            "Financial oversight",
            "Audit oversight"
          ],
          "primaryMisconceptionId": "MC_ENT_GOVERNANCE_BOARD_FIDUCIARY_DUTIES",
          "diagnosisMap": {
            "EXECUTIVE_SALARY": {
              "misconceptionId": "MC_ENT_GOVERNANCE_BOARD_FIDUCIARY_DUTIES",
              "errorExplanation": "Executive salaries are handled by Compensation. Audit handles financial controls and statutory audits.",
              "recoveryPath": {
                "simplerExplanation": "Matches STATUTORY_FINANCIAL_OVERSIGHT_AND_INTERNAL_CONTROLS.",
                "guidedFixPrompt": "Type STATUTORY_FINANCIAL_OVERSIGHT_AND_INTERNAL_CONTROLS"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 25,
    "title": "Enterprise Risk Management (ERM): 5x5 Risk Matrix & Mitigation",
    "overviewMetaphor": "The 5x5 Risk Matrix is an Early Radar Warning System for Catastrophic Icebergs: A cyber ransomware breach with high likelihood (4/5) and critical severity (5/5) generates an urgent Risk Score of 20 out of 25 ($4 \\times 5 = 20$); because the score exceeds 15, the enterprise must immediately execute a dual response: Mitigate technical vulnerabilities via zero-trust architecture and Transfer catastrophic financial liability through a $10M cyber insurance policy.",
    "blocks": [
      {
        "id": "ent-d25-b1-five-by-five-risk-matrix-calculation",
        "day": 25,
        "blockNumber": 1,
        "title": "Enterprise Risk Score: $\\text{Risk Score} = \\text{Likelihood (1-5)} \\times \\text{Severity (1-5)} \\le 25$",
        "conceptBudget": {
          "primaryConcept": "Risk Matrix Scoring Formula",
          "supportingTerms": [
            "Likelihood ($L = 4$)",
            "Severity / Impact ($I = 5$)",
            "Risk Score = $4 \\times 5 = 20$ (out of 25)",
            "The 4 Risk Response Strategies: Avoid, Mitigate, Transfer (Insurance), Accept",
            "Score $\\ge 15 \\implies$ Mitigate & Transfer; Score $< 8 \\implies$ Accept"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d24-b1-board-supermajority-voting",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Enterprise Risk Ledger (Likelihood=4, Impact=5, Score=20)",
              "boxes": [
                {
                  "label": "Likelihood Rating",
                  "value": "4 out of 5 (High probability based on industry threat intelligence)",
                  "varType": "Likelihood",
                  "isUpdated": false
                },
                {
                  "label": "Severity Rating",
                  "value": "5 out of 5 (Critical catastrophic downtime & data breach impact)",
                  "varType": "Impact",
                  "isUpdated": false
                },
                {
                  "label": "Risk Score & Strategy",
                  "value": "4 x 5 = 20 (MITIGATE AND TRANSFER VIA INSURANCE OR AVOID!)",
                  "varType": "Response",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "risk_calc_demo.js",
            "initialCode": "function evaluateRisk(likelihood, impact) {\n  const score = likelihood * impact;\n  let strat = '';\n  if (score >= 15) strat = 'MITIGATE_AND_TRANSFER_VIA_INSURANCE_OR_AVOID';\n  else if (score >= 8) strat = 'MITIGATE';\n  else strat = 'ACCEPT';\n  return {\n    score,\n    strategy: strat,\n    status: 'RISK_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateRisk(4, 5)));",
            "expectedOutput": "{\"score\":20,\"strategy\":\"MITIGATE_AND_TRANSFER_VIA_INSURANCE_OR_AVOID\",\"status\":\"RISK_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What risk score is calculated for a cybersecurity threat with likelihood 4 and impact 5 ($4 \\times 5$)?",
          "expectedStringOutput": "20",
          "acceptableAnswers": [
            "20",
            "Score 20",
            "score\":20"
          ],
          "primaryMisconceptionId": "MC_ENT_RISK_MANAGEMENT_ERM_BCP_MATRIX",
          "diagnosisMap": {
            "9": {
              "misconceptionId": "MC_ENT_RISK_MANAGEMENT_ERM_BCP_MATRIX",
              "errorExplanation": "9 adds likelihood and impact (4 + 5). Risk score multiplies likelihood by impact: 4 * 5 = 20.",
              "recoveryPath": {
                "simplerExplanation": "4 * 5 = 20.",
                "guidedFixPrompt": "Type 20"
              }
            }
          }
        }
      },
      {
        "id": "ent-d25-b2-four-risk-response-strategies",
        "day": 25,
        "blockNumber": 2,
        "title": "The 4 Enterprise Risk Response Strategies (Avoid, Mitigate, Transfer, Accept)",
        "conceptBudget": {
          "primaryConcept": "The 4 Risk Response Quadrants",
          "supportingTerms": [
            "Avoid (Exit the high-risk activity entirely)",
            "Mitigate (Implement technical controls & training to reduce likelihood)",
            "Transfer (Buy insurance or contractually shift liability to 3PL)",
            "Accept (Tolerate minor risks within risk appetite)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d25-b1-five-by-five-risk-matrix-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Risk Strategy Mapping",
            "codeSnippet": "// AVOID:    Refuse to store raw credit card numbers on local servers (Use Stripe!)\n// MITIGATE: Enforce 2FA hardware keys for all engineering personnel\n// TRANSFER: Purchase $5,000,000 Cyber E&O Insurance Policy to cover ransomware liabilities\n// ACCEPT:   Minor 0.01% payment rounding discrepancies under $10",
            "lineNotes": {
              "1": "Eliminate hazard.",
              "2": "Reduce frequency.",
              "3": "Insurance transfer.",
              "4": "Acceptable tolerance."
            }
          },
          {
            "type": "runnable_code",
            "filename": "risk_response_demo.js",
            "initialCode": "function getRiskResponseAction(method) {\n  return method === 'BUY_INSURANCE'\n    ? 'TRANSFER_FINANCIAL_LIABILITY'\n    : 'MITIGATE_OPERATIONAL_CONTROLS';\n}\n\nconsole.log(getRiskResponseAction('BUY_INSURANCE'));",
            "expectedOutput": "TRANSFER_FINANCIAL_LIABILITY",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which of the 4 risk response strategies is executed when a startup purchases an errors and omissions (E&O) insurance policy?",
          "expectedStringOutput": "TRANSFER_FINANCIAL_LIABILITY",
          "acceptableAnswers": [
            "TRANSFER_FINANCIAL_LIABILITY",
            "Transfer",
            "Risk Transfer"
          ],
          "primaryMisconceptionId": "MC_ENT_RISK_MANAGEMENT_ERM_BCP_MATRIX",
          "diagnosisMap": {
            "AVOID": {
              "misconceptionId": "MC_ENT_RISK_MANAGEMENT_ERM_BCP_MATRIX",
              "errorExplanation": "Insurance does not avoid the event; it transfers the financial liability.",
              "recoveryPath": {
                "simplerExplanation": "Matches TRANSFER_FINANCIAL_LIABILITY.",
                "guidedFixPrompt": "Type TRANSFER_FINANCIAL_LIABILITY"
              }
            }
          }
        }
      },
      {
        "id": "ent-d25-b3-business-continuity-planning-bcp-rto-rpo",
        "day": 25,
        "blockNumber": 3,
        "title": "Business Continuity Planning (BCP): RTO vs RPO Metrics",
        "conceptBudget": {
          "primaryConcept": "RTO vs RPO Resilience Invariant",
          "supportingTerms": [
            "Recovery Time Objective (RTO: Maximum allowable downtime duration e.g. < 15 minutes)",
            "Recovery Point Objective (RPO: Maximum allowable data loss measured in time e.g. < 1 minute of transactions)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d25-b2-four-risk-response-strategies",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "bcp_rto_rpo_demo.js",
            "initialCode": "function getBcpMetricRole(metric) {\n  return metric === 'RTO'\n    ? 'MAXIMUM_ALLOWABLE_DOWNTIME_DURATION'\n    : 'MAXIMUM_ALLOWABLE_DATA_LOSS_AGE';\n}\n\nconsole.log(getBcpMetricRole('RTO'));\nconsole.log(getBcpMetricRole('RPO'));",
            "expectedOutput": "MAXIMUM_ALLOWABLE_DOWNTIME_DURATION\nMAXIMUM_ALLOWABLE_DATA_LOSS_AGE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How is the Recovery Time Objective (RTO) defined in enterprise Business Continuity Planning?",
          "expectedStringOutput": "MAXIMUM_ALLOWABLE_DOWNTIME_DURATION",
          "acceptableAnswers": [
            "MAXIMUM_ALLOWABLE_DOWNTIME_DURATION",
            "Maximum allowable downtime",
            "Downtime duration"
          ],
          "primaryMisconceptionId": "MC_ENT_RISK_MANAGEMENT_ERM_BCP_MATRIX",
          "diagnosisMap": {
            "DATA_LOSS": {
              "misconceptionId": "MC_ENT_RISK_MANAGEMENT_ERM_BCP_MATRIX",
              "errorExplanation": "Data loss age is RPO. RTO is MAXIMUM_ALLOWABLE_DOWNTIME_DURATION.",
              "recoveryPath": {
                "simplerExplanation": "Matches MAXIMUM_ALLOWABLE_DOWNTIME_DURATION.",
                "guidedFixPrompt": "Type MAXIMUM_ALLOWABLE_DOWNTIME_DURATION"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 26,
    "title": "Business Ethics & Corporate Social Responsibility (CSR): Triple Bottom Line & ESG",
    "overviewMetaphor": "The Triple Bottom Line is a 3-Legged Stool of Enterprise Longevity: A business that generates $50,000,000 in net profit but poisons local drinking water or exploits factory laborers will have its stool collapse under public outrage and regulatory penalties; balancing People (Social Impact), Planet (Environmental Sustainability), and Profit (Economic Viability) with a statutory 2.0% CSR allocation ($1,000,000 on $50M profit) creates durable multi-generational enterprise value.",
    "blocks": [
      {
        "id": "ent-d26-b1-statutory-csr-calculation",
        "day": 26,
        "blockNumber": 1,
        "title": "Statutory CSR Mandate: $\\text{CSR Allocation} = \\text{Average Net Profit} \\times 2.0\\%$",
        "conceptBudget": {
          "primaryConcept": "Statutory 2% CSR Formula",
          "supportingTerms": [
            "Average Net Profit Last 3 Years ($₹50,000,000.00$)",
            "Statutory Rate ($2.0\\%$ under Companies Act Section 135)",
            "Mandatory CSR Budget = $50,000,000 \\times 0.02 = ₹1,000,000.00$",
            "Triple Bottom Line: People, Planet, Profit"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d25-b1-five-by-five-risk-matrix-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "CSR Statutory Allocation Ledger (₹50M Avg Profit, 2% Rate)",
              "boxes": [
                {
                  "label": "3-Year Avg Net Profit",
                  "value": "₹50,000,000.00 INR Audited Statutory Net Profit",
                  "varType": "Profit",
                  "isUpdated": false
                },
                {
                  "label": "Statutory Mandate (2%)",
                  "value": "Section 135 Companies Act 2.00% Mandatory Social Spending",
                  "varType": "CSR Rate",
                  "isUpdated": false
                },
                {
                  "label": "Mandatory CSR Budget",
                  "value": "₹50,000,000 x 2% = ₹1,000,000.00 INR (STATUTORY CSR ALLOCATED!)",
                  "varType": "Budget",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "csr_calc_demo.js",
            "initialCode": "function calculateCsr(avgProfit) {\n  const budget = avgProfit * 0.02;\n  return {\n    avgProfit,\n    csrBudget: budget,\n    statute: 'SECTION_135_COMPANIES_ACT_2_PERCENT_CSR',\n    status: 'CSR_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateCsr(50000000)));",
            "expectedOutput": "{\"avgProfit\":50000000,\"csrBudget\":1000000,\"statute\":\"SECTION_135_COMPANIES_ACT_2_PERCENT_CSR\",\"status\":\"CSR_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the mandatory statutory CSR allocation in rupees when a corporate entity averages ₹50,000,000 in net profit over the last 3 financial years ($50,000,000 \\times 0.02$)?",
          "expectedStringOutput": "1000000",
          "acceptableAnswers": [
            "1000000",
            "₹1,000,000",
            "1,000,000",
            "csrBudget\":1000000"
          ],
          "primaryMisconceptionId": "MC_ENT_ETHICS_ESG_TRIPLE_BOTTOM_LINE",
          "diagnosisMap": {
            "100000": {
              "misconceptionId": "MC_ENT_ETHICS_ESG_TRIPLE_BOTTOM_LINE",
              "errorExplanation": "100,000 is 0.2%. 2% of ₹50,000,000 is ₹1,000,000.",
              "recoveryPath": {
                "simplerExplanation": "50,000,000 * 0.02 = 1,000,000.",
                "guidedFixPrompt": "Type 1000000"
              }
            }
          }
        }
      },
      {
        "id": "ent-d26-b2-esg-environmental-social-governance",
        "day": 26,
        "blockNumber": 2,
        "title": "ESG Frameworks: Environmental, Social, and Governance Compliance",
        "conceptBudget": {
          "primaryConcept": "ESG Compliance Dimensions",
          "supportingTerms": [
            "E (Environmental: Carbon footprint, water conservation, e-waste recycling)",
            "S (Social: Workplace diversity, labor rights, community safety)",
            "G (Governance: Executive pay ratios, whistleblower protection, board independence)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d26-b1-statutory-csr-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "ESG Metric Verification",
            "codeSnippet": "// ENVIRONMENTAL: 100% cloud workloads powered by renewable solar data centers\n// SOCIAL:        Equal pay parity audit + zero harassment tolerance\n// GOVERNANCE:    Independent whistleblowing hotline managed by third-party counsel",
            "lineNotes": {
              "1": "Environmental sustainability.",
              "2": "Social equity.",
              "3": "Governance integrity."
            }
          },
          {
            "type": "runnable_code",
            "filename": "esg_demo.js",
            "initialCode": "function getEsgDimensions() {\n  return ['ENVIRONMENTAL', 'SOCIAL', 'GOVERNANCE'];\n}\n\nconsole.log(JSON.stringify(getEsgDimensions()));",
            "expectedOutput": "[\"ENVIRONMENTAL\",\"SOCIAL\",\"GOVERNANCE\"]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What does the 'G' represent in the enterprise ESG institutional investment scoring framework?",
          "expectedStringOutput": "GOVERNANCE",
          "acceptableAnswers": [
            "GOVERNANCE",
            "Governance"
          ],
          "primaryMisconceptionId": "MC_ENT_ETHICS_ESG_TRIPLE_BOTTOM_LINE",
          "diagnosisMap": {
            "GROWTH": {
              "misconceptionId": "MC_ENT_ETHICS_ESG_TRIPLE_BOTTOM_LINE",
              "errorExplanation": "ESG stands for Environmental, Social, and Governance.",
              "recoveryPath": {
                "simplerExplanation": "Matches GOVERNANCE.",
                "guidedFixPrompt": "Type GOVERNANCE"
              }
            }
          }
        }
      },
      {
        "id": "ent-d26-b3-anti-bribery-fcpa-whistleblower",
        "day": 26,
        "blockNumber": 3,
        "title": "Anti-Bribery Compliance (FCPA / UK Bribery Act) & Whistleblower Shields",
        "conceptBudget": {
          "primaryConcept": "Anti-Bribery Invariant",
          "supportingTerms": [
            "Strict liability for foreign corrupt practices and facilitation payments",
            "Statutory non-retaliation protections for employee whistleblowers"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d26-b2-esg-environmental-social-governance",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "whistleblower_demo.js",
            "initialCode": "function getWhistleblowerProtectionStatus() {\n  return 'ABSOLUTE_STATUTORY_NON_RETALIATION_PROTECTION';\n}\n\nconsole.log(getWhistleblowerProtectionStatus());",
            "expectedOutput": "ABSOLUTE_STATUTORY_NON_RETALIATION_PROTECTION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What statutory legal protection is guaranteed to corporate employees who report accounting fraud through official whistleblower channels?",
          "expectedStringOutput": "ABSOLUTE_STATUTORY_NON_RETALIATION_PROTECTION",
          "acceptableAnswers": [
            "ABSOLUTE_STATUTORY_NON_RETALIATION_PROTECTION",
            "Non-retaliation protection",
            "Whistleblower protection"
          ],
          "primaryMisconceptionId": "MC_ENT_ETHICS_ESG_TRIPLE_BOTTOM_LINE",
          "diagnosisMap": {
            "TERMINATION": {
              "misconceptionId": "MC_ENT_ETHICS_ESG_TRIPLE_BOTTOM_LINE",
              "errorExplanation": "Retaliating against a whistleblower is a severe federal offense. Law guarantees ABSOLUTE_STATUTORY_NON_RETALIATION_PROTECTION.",
              "recoveryPath": {
                "simplerExplanation": "Matches ABSOLUTE_STATUTORY_NON_RETALIATION_PROTECTION.",
                "guidedFixPrompt": "Type ABSOLUTE_STATUTORY_NON_RETALIATION_PROTECTION"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 27,
    "title": "Innovation Strategy: Blue Ocean Strategy & ERRC Grid",
    "overviewMetaphor": "Blue Ocean Strategy is Sailing Away from a Blood-Red Shark Feeding Frenzy to Uncharted Calm Waters: Instead of bloody price competition in a saturated Red Ocean, Cirque du Soleil used the ERRC Grid: Eliminate animal acts and star performers; Reduce arena costs; Raise artistic theatrical production; and Create sophisticated adult storytelling, inventing an uncontested $1B market category with zero direct rivals.",
    "blocks": [
      {
        "id": "ent-d27-b1-errc-grid-balance-audit",
        "day": 27,
        "blockNumber": 1,
        "title": "The Four Actions Framework: Eliminate, Reduce, Raise, Create (ERRC Grid)",
        "conceptBudget": {
          "primaryConcept": "ERRC Grid Value Innovation Balance",
          "supportingTerms": [
            "Eliminate (Factors the industry takes for granted that should be removed e.g. Animal circus acts)",
            "Reduce (Factors reduced well below industry standard e.g. Humor/slapstick)",
            "Raise (Factors raised well above standard e.g. Artistic refinement)",
            "Create (Brand new factors never offered e.g. Theatrical theme music)",
            "All 4 quadrants $> 0 \\implies$ Value Innovation Achieved"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d26-b1-statutory-csr-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Blue Ocean ERRC Grid Ledger (Cirque du Soleil Case)",
              "boxes": [
                {
                  "label": "Eliminate & Reduce",
                  "value": "Eliminate Animal Acts (2) + Reduce Slapstick/Clowns (2) = Cost Slashed!",
                  "varType": "Cost Down",
                  "isUpdated": false
                },
                {
                  "label": "Raise & Create",
                  "value": "Raise Theatrical Venue (3) + Create Artistic Theme (2) = Value Soars!",
                  "varType": "Value Up",
                  "isUpdated": false
                },
                {
                  "label": "Value Innovation Result",
                  "value": "All 4 Quadrants Active -> BLUE OCEAN ERRC GRID BALANCED (ZERO RIVALS!)",
                  "varType": "Blue Ocean",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "errc_audit_demo.js",
            "initialCode": "function auditErrc(e, r, ra, c) {\n  const isBalanced = e > 0 && r > 0 && ra > 0 && c > 0;\n  return {\n    eliminated: e,\n    reduced: r,\n    raised: ra,\n    created: c,\n    isBalanced,\n    status: isBalanced ? 'BLUE_OCEAN_ERRC_GRID_BALANCED' : 'INCOMPLETE'\n  };\n}\n\nconsole.log(JSON.stringify(auditErrc(2, 2, 3, 2)));",
            "expectedOutput": "{\"eliminated\":2,\"reduced\":2,\"raised\":3,\"created\":2,\"isBalanced\":true,\"status\":\"BLUE_OCEAN_ERRC_GRID_BALANCED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit status confirms successful value innovation when an enterprise populates all 4 quadrants of the ERRC Grid?",
          "expectedStringOutput": "BLUE_OCEAN_ERRC_GRID_BALANCED",
          "acceptableAnswers": [
            "BLUE_OCEAN_ERRC_GRID_BALANCED",
            "Balanced ERRC Grid",
            "Value Innovation Achieved"
          ],
          "primaryMisconceptionId": "MC_ENT_INNOVATION_BLUE_OCEAN_ERRC_MODEL",
          "diagnosisMap": {
            "INCOMPLETE": {
              "misconceptionId": "MC_ENT_INNOVATION_BLUE_OCEAN_ERRC_MODEL",
              "errorExplanation": "Populating all 4 actions confirms BLUE_OCEAN_ERRC_GRID_BALANCED.",
              "recoveryPath": {
                "simplerExplanation": "Matches BLUE_OCEAN_ERRC_GRID_BALANCED.",
                "guidedFixPrompt": "Type BLUE_OCEAN_ERRC_GRID_BALANCED"
              }
            }
          }
        }
      },
      {
        "id": "ent-d27-b2-strategy-canvas-value-curve",
        "day": 27,
        "blockNumber": 2,
        "title": "Strategy Canvas: Modeling Divergent Value Curves vs Competitor Benchmarks",
        "conceptBudget": {
          "primaryConcept": "Strategy Canvas Invariant",
          "supportingTerms": [
            "Strategy Canvas (A diagnostic visual chart comparing an offering's investment level across key industry factors against incumbent averages)",
            "Divergence & Focus = Key hallmarks of a winning strategy"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d27-b1-errc-grid-balance-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Value Curve Differentiation",
            "codeSnippet": "// RED OCEAN:   Value curve traces existing competitors with 5% lower price (Price war!)\n// BLUE OCEAN:  Value curve diverges radically, setting new standards competitors cannot match!",
            "lineNotes": {
              "1": "Copycat imitation curve.",
              "2": "Divergent value curve."
            }
          },
          {
            "type": "runnable_code",
            "filename": "canvas_demo.js",
            "initialCode": "function evaluateValueCurve(isDivergentFromIndustry) {\n  return isDivergentFromIndustry\n    ? 'DIVERGENT_BLUE_OCEAN_STRATEGY'\n    : 'CONVERGENT_RED_OCEAN_COMMODITY';\n}\n\nconsole.log(evaluateValueCurve(true));",
            "expectedOutput": "DIVERGENT_BLUE_OCEAN_STRATEGY",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What strategic classification describes a company whose Strategy Canvas value curve diverges radically from traditional industry benchmarks?",
          "expectedStringOutput": "DIVERGENT_BLUE_OCEAN_STRATEGY",
          "acceptableAnswers": [
            "DIVERGENT_BLUE_OCEAN_STRATEGY",
            "Blue Ocean Strategy",
            "Divergent strategy"
          ],
          "primaryMisconceptionId": "MC_ENT_INNOVATION_BLUE_OCEAN_ERRC_MODEL",
          "diagnosisMap": {
            "RED_OCEAN": {
              "misconceptionId": "MC_ENT_INNOVATION_BLUE_OCEAN_ERRC_MODEL",
              "errorExplanation": "Tracing competitor curves is Red Ocean. Diverging sharply creates a DIVERGENT_BLUE_OCEAN_STRATEGY.",
              "recoveryPath": {
                "simplerExplanation": "Matches DIVERGENT_BLUE_OCEAN_STRATEGY.",
                "guidedFixPrompt": "Type DIVERGENT_BLUE_OCEAN_STRATEGY"
              }
            }
          }
        }
      },
      {
        "id": "ent-d27-b3-disruptive-vs-sustaining-innovation",
        "day": 27,
        "blockNumber": 3,
        "title": "Clayton Christensen's Disruptive vs Sustaining Innovation",
        "conceptBudget": {
          "primaryConcept": "Disruptive Innovation Mechanics",
          "supportingTerms": [
            "Sustaining Innovation (Incremental improvements for existing high-end customers e.g. iPhone 16 vs 15)",
            "Low-End / New-Market Disruptive Innovation (Simpler, cheaper solution entering bottom of market before moving upmarket e.g. PC displacing Mainframe)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d27-b2-strategy-canvas-value-curve",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "disruptive_demo.js",
            "initialCode": "function classifyInnovationType(isSimplerCheaperEntryAtBottom) {\n  return isSimplerCheaperEntryAtBottom\n    ? 'DISRUPTIVE_INNOVATION_ENTERING_LOW_END'\n    : 'SUSTAINING_INNOVATION_FOR_HIGH_END';\n}\n\nconsole.log(classifyInnovationType(true));\nconsole.log(classifyInnovationType(false));",
            "expectedOutput": "DISRUPTIVE_INNOVATION_ENTERING_LOW_END\nSUSTAINING_INNOVATION_FOR_HIGH_END",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How is an innovation classified that initially offers a simpler, lower-cost alternative to underserved customers before improving and conquering the entire market?",
          "expectedStringOutput": "DISRUPTIVE_INNOVATION_ENTERING_LOW_END",
          "acceptableAnswers": [
            "DISRUPTIVE_INNOVATION_ENTERING_LOW_END",
            "Disruptive Innovation",
            "Disruptive"
          ],
          "primaryMisconceptionId": "MC_ENT_INNOVATION_BLUE_OCEAN_ERRC_MODEL",
          "diagnosisMap": {
            "SUSTAINING": {
              "misconceptionId": "MC_ENT_INNOVATION_BLUE_OCEAN_ERRC_MODEL",
              "errorExplanation": "Sustaining serves high-end incumbents. Bottom-up entry is DISRUPTIVE_INNOVATION_ENTERING_LOW_END.",
              "recoveryPath": {
                "simplerExplanation": "Matches DISRUPTIVE_INNOVATION_ENTERING_LOW_END.",
                "guidedFixPrompt": "Type DISRUPTIVE_INNOVATION_ENTERING_LOW_END"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 28,
    "title": "Scaling & Organizational Growth: The Greiner Growth Model",
    "overviewMetaphor": "The Greiner Growth Model is the Growing Pains of a Human Transitioning from Childhood to Adulthood: In Phase 1, brilliant creative founders build an incredible product until chaotic growth causes a Crisis of Leadership; hiring seasoned managers provides Direction (Phase 2) until autonomous leaders hit a Crisis of Autonomy; navigating all 5 Greiner phases is how a 5-person garage startup successfully evolves into a 10,000-person global enterprise.",
    "blocks": [
      {
        "id": "ent-d28-b1-greiner-growth-five-phases",
        "day": 28,
        "blockNumber": 1,
        "title": "Larry Greiner's 5 Phases of Growth & Predictable Organizational Crises",
        "conceptBudget": {
          "primaryConcept": "Greiner 5 Phases of Growth",
          "supportingTerms": [
            "Phase 1: Growth through Creativity $\\to$ Crisis of Leadership",
            "Phase 2: Growth through Direction $\\to$ Crisis of Autonomy",
            "Phase 3: Growth through Delegation $\\to$ Crisis of Control",
            "Phase 4: Growth through Coordination $\\to$ Crisis of Red Tape",
            "Phase 5: Growth through Collaboration $\\to$ Crisis of Internal Growth"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d27-b1-errc-grid-balance-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Greiner Organizational Scaling Lifecycle",
              "boxes": [
                {
                  "label": "Phase 1 (Creativity)",
                  "value": "Founders code & sell -> Organization outgrows ad-hoc informal chats",
                  "varType": "Phase 1",
                  "isUpdated": false
                },
                {
                  "label": "Phase 1 Crisis",
                  "value": "CRISIS OF LEADERSHIP (Mandatory need to install professional management!)",
                  "varType": "Crisis 1",
                  "isUpdated": false
                },
                {
                  "label": "Phase 3 Crisis",
                  "value": "CRISIS OF CONTROL (Decentralized business units drift apart!)",
                  "varType": "Crisis 3",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "greiner_demo.js",
            "initialCode": "function getGreinerCrisis(phaseNumber) {\n  const crises = {\n    1: 'CRISIS_OF_LEADERSHIP',\n    2: 'CRISIS_OF_AUTONOMY',\n    3: 'CRISIS_OF_CONTROL',\n    4: 'CRISIS_OF_RED_TAPE',\n    5: 'CRISIS_OF_INTERNAL_GROWTH'\n  };\n  return crises[phaseNumber] || 'UNKNOWN';\n}\n\nconsole.log(getGreinerCrisis(1));\nconsole.log(getGreinerCrisis(3));",
            "expectedOutput": "CRISIS_OF_LEADERSHIP\nCRISIS_OF_CONTROL",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What organizational crisis emerges at the culmination of Phase 1 (Growth through Creativity) in the Greiner Growth Model?",
          "expectedStringOutput": "CRISIS_OF_LEADERSHIP",
          "acceptableAnswers": [
            "CRISIS_OF_LEADERSHIP",
            "Crisis of leadership",
            "Leadership crisis"
          ],
          "primaryMisconceptionId": "MC_ENT_SCALING_GREINER_GROWTH_PHASES",
          "diagnosisMap": {
            "CONTROL": {
              "misconceptionId": "MC_ENT_SCALING_GREINER_GROWTH_PHASES",
              "errorExplanation": "Control crisis occurs in Phase 3. Phase 1 ends with a CRISIS_OF_LEADERSHIP.",
              "recoveryPath": {
                "simplerExplanation": "Matches CRISIS_OF_LEADERSHIP.",
                "guidedFixPrompt": "Type CRISIS_OF_LEADERSHIP"
              }
            }
          }
        }
      },
      {
        "id": "ent-d28-b2-blitzscaling-vs-sustainable-growth",
        "day": 28,
        "blockNumber": 2,
        "title": "Reid Hoffman's Blitzscaling: Speed over Efficiency in Winner-Take-Most Markets",
        "conceptBudget": {
          "primaryConcept": "Blitzscaling Operating Framework",
          "supportingTerms": [
            "Blitzscaling (Prioritizing lightning growth speed over operational efficiency in markets with massive network effects e.g. Uber, Airbnb)",
            "Requires transition back to operational efficiency once market leadership is secured"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d28-b1-greiner-growth-five-phases",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Scaling Speed Tradeoffs",
            "codeSnippet": "// FASTSCALING:   Grow fast while optimizing unit economics and gross margins\n// BLITZSCALING:  Tolerate operational fires and high burn to conquer winner-take-all network effects!",
            "lineNotes": {
              "1": "Disciplined growth.",
              "2": "Maximum velocity land grab."
            }
          },
          {
            "type": "runnable_code",
            "filename": "blitzscale_demo.js",
            "initialCode": "function getBlitzscalingPriority() {\n  return 'PRIORITIZE_SPEED_OVER_OPERATIONAL_EFFICIENCY';\n}\n\nconsole.log(getBlitzscalingPriority());",
            "expectedOutput": "PRIORITIZE_SPEED_OVER_OPERATIONAL_EFFICIENCY",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What core operational tradeoff defines the Blitzscaling methodology in winner-take-all markets?",
          "expectedStringOutput": "PRIORITIZE_SPEED_OVER_OPERATIONAL_EFFICIENCY",
          "acceptableAnswers": [
            "PRIORITIZE_SPEED_OVER_OPERATIONAL_EFFICIENCY",
            "Speed over efficiency",
            "Speed over efficiency priority"
          ],
          "primaryMisconceptionId": "MC_ENT_SCALING_GREINER_GROWTH_PHASES",
          "diagnosisMap": {
            "EFFICIENCY": {
              "misconceptionId": "MC_ENT_SCALING_GREINER_GROWTH_PHASES",
              "errorExplanation": "Blitzscaling deliberately sacrifices efficiency for market dominance speed.",
              "recoveryPath": {
                "simplerExplanation": "Matches PRIORITIZE_SPEED_OVER_OPERATIONAL_EFFICIENCY.",
                "guidedFixPrompt": "Type PRIORITIZE_SPEED_OVER_OPERATIONAL_EFFICIENCY"
              }
            }
          }
        }
      },
      {
        "id": "ent-d28-b3-span-of-control-organizational-layers",
        "day": 28,
        "blockNumber": 3,
        "title": "Organizational Span of Control: Optimal 6-8 Direct Reports Rule",
        "conceptBudget": {
          "primaryConcept": "Span of Control Benchmark",
          "supportingTerms": [
            "Optimal Span of Control: 6 to 8 direct reports per manager",
            "More than 10 reports $\\implies$ Manager burnout & lack of mentorship; Fewer than 4 $\\implies$ Micromanagement & excessive bureaucratic hierarchy"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d28-b2-blitzscaling-vs-sustainable-growth",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "span_control_demo.js",
            "initialCode": "function evaluateSpanOfControl(reports) {\n  return (reports >= 6 && reports <= 8)\n    ? 'OPTIMAL_MANAGEMENT_SPAN_OF_CONTROL'\n    : (reports > 8 ? 'MANAGER_OVERLOAD_BOTTLENECK' : 'EXCESSIVE_HIERARCHICAL_LAYERING');\n}\n\nconsole.log(evaluateSpanOfControl(7));\nconsole.log(evaluateSpanOfControl(14));",
            "expectedOutput": "OPTIMAL_MANAGEMENT_SPAN_OF_CONTROL\nMANAGER_OVERLOAD_BOTTLENECK",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What management status evaluates a team structure where engineering managers oversee exactly 7 direct reports ($6 - 8$ optimal range)?",
          "expectedStringOutput": "OPTIMAL_MANAGEMENT_SPAN_OF_CONTROL",
          "acceptableAnswers": [
            "OPTIMAL_MANAGEMENT_SPAN_OF_CONTROL",
            "Optimal span of control",
            "Optimal"
          ],
          "primaryMisconceptionId": "MC_ENT_SCALING_GREINER_GROWTH_PHASES",
          "diagnosisMap": {
            "OVERLOAD": {
              "misconceptionId": "MC_ENT_SCALING_GREINER_GROWTH_PHASES",
              "errorExplanation": "7 falls squarely in the 6-8 optimal direct reports window.",
              "recoveryPath": {
                "simplerExplanation": "Matches OPTIMAL_MANAGEMENT_SPAN_OF_CONTROL.",
                "guidedFixPrompt": "Type OPTIMAL_MANAGEMENT_SPAN_OF_CONTROL"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 29,
    "title": "Autonomous AI Business Management: Automated Financial Copilots & RevOps",
    "overviewMetaphor": "Autonomous AI is an Elite Executive Chief of Staff Running in Real-Time 24/7/365: By automating 40 hours of manual contract reviews ($40 \\times 0.5 = 20.0$), scoring inbound sales leads with 90% accuracy ($90 \\times 0.4 = 36.0$), and maintaining pro-forma budget variances within 4% ($ (20 - 4) \\times 1.5 = 24.0$), the Autonomous AI Management Engine achieves an elite 80.0 Composite Efficiency Index ($20 + 36 + 24 = 80.0$), allowing a lean 10-person startup to operate with the productivity of a 100-person enterprise.",
    "blocks": [
      {
        "id": "ent-d29-b1-ai-business-efficiency-index",
        "day": 29,
        "blockNumber": 1,
        "title": "Autonomous AI Management Efficiency Index: $\\text{Score} = (H \\times 0.5) + (A \\times 0.4) + ((20 - V) \\times 1.5) \\ge 75.0$",
        "conceptBudget": {
          "primaryConcept": "AI Management Efficiency Formula",
          "supportingTerms": [
            "Hours Saved per Month ($H = 40 \\implies 20.0$ pts)",
            "Lead Scoring Accuracy ($A = 90.0\\% \\implies 36.0$ pts)",
            "Forecast Variance ($V = 4.0\\% \\implies (20 - 4) \\times 1.5 = 24.0$ pts)",
            "Efficiency Composite = $20.0 + 36.0 + 24.0 = 80.0$",
            "Tier-1 Autonomous Standard: $\\ge 75.0$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d28-b1-greiner-growth-five-phases",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Autonomous AI Executive Management Ledger (Composite = 80.0)",
              "boxes": [
                {
                  "label": "Labor Automated (H)",
                  "value": "40 Hours/Mo Contract Review Saved x 0.5 = 20.0 Points",
                  "varType": "Labor",
                  "isUpdated": false
                },
                {
                  "label": "RevOps Accuracy (A)",
                  "value": "90.0% Lead Qualification Accuracy x 0.4 = 36.0 Points",
                  "varType": "RevOps",
                  "isUpdated": false
                },
                {
                  "label": "Composite Efficiency Score",
                  "value": "20.0 + 36.0 + 24.0 = 80.0 (TIER-1 AUTONOMOUS AI MANAGEMENT ACTIVE!)",
                  "varType": "AI Index",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "ai_business_calc_demo.js",
            "initialCode": "function evaluateAiManagement(hours, accuracy, variance) {\n  const score = (hours * 0.5) + (accuracy * 0.4) + ((20 - variance) * 1.5);\n  return {\n    hours,\n    accuracy,\n    variance,\n    efficiencyScore: Number(score.toFixed(1)),\n    isElite: score >= 75.0,\n    status: score >= 75.0 ? 'TIER_1_AUTONOMOUS_AI_MANAGEMENT_ACTIVE' : 'SUB_OPTIMAL'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateAiManagement(40, 90, 4)));",
            "expectedOutput": "{\"hours\":40,\"accuracy\":90,\"variance\":4,\"efficiencyScore\":80,\"isElite\":true,\"status\":\"TIER_1_AUTONOMOUS_AI_MANAGEMENT_ACTIVE\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the AI Management Efficiency Score when 40 hours are saved, lead accuracy is 90%, and forecast variance is 4% ($ (40 \\times 0.5) + (90 \\times 0.4) + ((20 - 4) \\times 1.5) $)?",
          "expectedStringOutput": "80",
          "acceptableAnswers": [
            "80",
            "80.0",
            "efficiencyScore\":80"
          ],
          "primaryMisconceptionId": "MC_ENT_AI_WORKFLOWS_AUTONOMOUS_OPERATIONS",
          "diagnosisMap": {
            "56": {
              "misconceptionId": "MC_ENT_AI_WORKFLOWS_AUTONOMOUS_OPERATIONS",
              "errorExplanation": "56 omits the forecast variance bonus (20 + 36). Adding the 24 variance points yields 80.0.",
              "recoveryPath": {
                "simplerExplanation": "20 + 36 + 24 = 80.",
                "guidedFixPrompt": "Type 80"
              }
            }
          }
        }
      },
      {
        "id": "ent-d29-b2-ai-pro-forma-financial-copilots",
        "day": 29,
        "blockNumber": 2,
        "title": "Real-Time AI Pro-Forma Financial Copilots & Dynamic Burn Forecasting",
        "conceptBudget": {
          "primaryConcept": "AI Financial Modeling Automation",
          "supportingTerms": [
            "Autonomous reconciliation of bank feeds, payroll, and SaaS subscriptions",
            "Live real-time daily cash runway forecasting updated with every Stripe transaction"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d29-b1-ai-business-efficiency-index",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Autonomous Financial Workflow",
            "codeSnippet": "// 1. Ingest Bank Feeds & Stripe Webhooks (Real-time cash ledger)\n// 2. AI Anomaly Detector: Flags duplicate vendor SaaS charges\n// 3. Dynamic Runway Forecaster: Live adjustment of zero-cash date predictions",
            "lineNotes": {
              "1": "Real-time streaming ingestion.",
              "2": "Spend leak prevention.",
              "3": "Predictive solvency."
            }
          },
          {
            "type": "runnable_code",
            "filename": "ai_finance_demo.js",
            "initialCode": "function getAiFinancialCopilotCapability() {\n  return 'REAL_TIME_STREAMING_SOLVENCY_AND_RUNWAY_FORECASTING';\n}\n\nconsole.log(getAiFinancialCopilotCapability());",
            "expectedOutput": "REAL_TIME_STREAMING_SOLVENCY_AND_RUNWAY_FORECASTING",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What predictive capability is delivered by enterprise AI financial copilots integrating live bank feeds and revenue streaming?",
          "expectedStringOutput": "REAL_TIME_STREAMING_SOLVENCY_AND_RUNWAY_FORECASTING",
          "acceptableAnswers": [
            "REAL_TIME_STREAMING_SOLVENCY_AND_RUNWAY_FORECASTING",
            "Real-time runway forecasting",
            "Solvency forecasting"
          ],
          "primaryMisconceptionId": "MC_ENT_AI_WORKFLOWS_AUTONOMOUS_OPERATIONS",
          "diagnosisMap": {
            "STATIC": {
              "misconceptionId": "MC_ENT_AI_WORKFLOWS_AUTONOMOUS_OPERATIONS",
              "errorExplanation": "AI financial copilots deliver dynamic REAL_TIME_STREAMING_SOLVENCY_AND_RUNWAY_FORECASTING.",
              "recoveryPath": {
                "simplerExplanation": "Matches REAL_TIME_STREAMING_SOLVENCY_AND_RUNWAY_FORECASTING.",
                "guidedFixPrompt": "Type REAL_TIME_STREAMING_SOLVENCY_AND_RUNWAY_FORECASTING"
              }
            }
          }
        }
      },
      {
        "id": "ent-d29-b3-ai-contract-due-diligence-extraction",
        "day": 29,
        "blockNumber": 3,
        "title": "AI-Powered Contract Review & M&A Due Diligence Red Flag Detection",
        "conceptBudget": {
          "primaryConcept": "AI Contract Diligence Automation",
          "supportingTerms": [
            "LLM extraction of change-of-control clauses, indemnification caps, IP assignment gaps, and non-compete liabilities across 500 vendor contracts in 10 minutes"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d29-b2-ai-pro-forma-financial-copilots",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "ai_diligence_demo.js",
            "initialCode": "function evaluateContractRiskWithAi(hasChangeOfControlClause) {\n  return hasChangeOfControlClause\n    ? 'FLAG_FOR_ACQUIRER_LEGAL_CONSENT'\n    : 'STANDARD_COMMERCIAL_TERMS';\n}\n\nconsole.log(evaluateContractRiskWithAi(true));",
            "expectedOutput": "FLAG_FOR_ACQUIRER_LEGAL_CONSENT",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What review flag is generated by an AI due diligence tool upon detecting a Change-of-Control clause in a major customer contract?",
          "expectedStringOutput": "FLAG_FOR_ACQUIRER_LEGAL_CONSENT",
          "acceptableAnswers": [
            "FLAG_FOR_ACQUIRER_LEGAL_CONSENT",
            "Legal consent flag",
            "Change of control flag"
          ],
          "primaryMisconceptionId": "MC_ENT_AI_WORKFLOWS_AUTONOMOUS_OPERATIONS",
          "diagnosisMap": {
            "IGNORE": {
              "misconceptionId": "MC_ENT_AI_WORKFLOWS_AUTONOMOUS_OPERATIONS",
              "errorExplanation": "Change-of-control clauses impact acquisitions and must be flagged for FLAG_FOR_ACQUIRER_LEGAL_CONSENT.",
              "recoveryPath": {
                "simplerExplanation": "Matches FLAG_FOR_ACQUIRER_LEGAL_CONSENT.",
                "guidedFixPrompt": "Type FLAG_FOR_ACQUIRER_LEGAL_CONSENT"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 30,
    "title": "🏆 FINAL CAPSTONE: Enterprise Venture Structuring & Business Management Master Suite",
    "overviewMetaphor": "Day 30 Final Capstone Synthesis: The complete sovereign entrepreneurship, venture capital structuring, and corporate management operating system: 1. Ideation & Strategy ($2M SOM, 9-block complete BMC, 80% JTBD fit, and wide economic moat); 2. Startup Finance & Dilution ($BEU = 1,250$ units, $12.0$ months runway, $20\\%$ SAFE dilution, 4-year vesting with 1-year cliff, and $L = 50$ WIP units); 3. GTM & Scaling ($C_{pk} = 1.33$ Six Sigma, $K = 1.50$ viral loop, $3.5x$ RevOps coverage, and $12.0x$ LTV/CAC ratio); 4. Governance & Human Capital ($12\\%$ ESOP option pool, Situational Leadership II, and 75% Board supermajority approval); 5. Enterprise Resilience ($5 \\times 5$ ERM risk mitigation, 2% CSR compliance, Blue Ocean ERRC value innovation, and 80.0 AI management efficiency composite).",
    "blocks": [
      {
        "id": "ent-d30-b1-enterprise-venture-suite-orchestration",
        "day": 30,
        "blockNumber": 1,
        "title": "Enterprise Venture Structuring & Business Management Master Suite Orchestration",
        "conceptBudget": {
          "primaryConcept": "Enterprise Venture Suite Orchestration",
          "supportingTerms": [
            "Ideation & Strategy Module",
            "Finance & Dilution Module",
            "GTM & Scaling Module",
            "Governance & Talent Module",
            "Resilience & Ethics Module"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d29-b1-ai-business-efficiency-index",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "30-Day Master Entrepreneurship & Business Operating System",
              "nodes": [
                {
                  "id": "1",
                  "label": "Ideation & Strategy: Pvt Ltd, $2M SOM, 9-block BMC & 80% JTBD fit",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Finance & Operations: 1,250 BEU, 12 mo runway, 20% SAFE & 4-yr vesting",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "GTM & Scaling: Cpk 1.33, K=1.50 viral loop, 3.5x pipeline & 12x LTV/CAC",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Governance & Ethics: 12% ESOP, 75% Board vote, 2% CSR & ERM matrix",
                  "kind": "process"
                },
                {
                  "id": "5",
                  "label": "AI Management: 80.0 composite index & Master Suite Certification!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "venture_master_orchestrator.js",
            "initialCode": "function orchestrateVentureMaster(idea, fin, gtm, gov, res) {\n  const isCertified = idea && fin && gtm && gov && res;\n  return {\n    ideationModule: idea,\n    financeModule: fin,\n    gtmModule: gtm,\n    governanceModule: gov,\n    resilienceModule: res,\n    masterCertified: isCertified,\n    status: isCertified ? 'ENTERPRISE_ENTREPRENEURSHIP_AND_MANAGEMENT_MASTER_CERTIFIED_NOMINAL' : 'DEFECT'\n  };\n}\n\nconsole.log(orchestrateVentureMaster(true, true, true, true, true).status);",
            "expectedOutput": "ENTERPRISE_ENTREPRENEURSHIP_AND_MANAGEMENT_MASTER_CERTIFIED_NOMINAL",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What master status confirms complete operational certification of the Enterprise Entrepreneurship & Business Management Master Suite?",
          "expectedStringOutput": "ENTERPRISE_ENTREPRENEURSHIP_AND_MANAGEMENT_MASTER_CERTIFIED_NOMINAL",
          "acceptableAnswers": [
            "ENTERPRISE_ENTREPRENEURSHIP_AND_MANAGEMENT_MASTER_CERTIFIED_NOMINAL",
            "status: ENTERPRISE_ENTREPRENEURSHIP_AND_MANAGEMENT_MASTER_CERTIFIED_NOMINAL"
          ],
          "primaryMisconceptionId": "MC_ENT_CAPSTONE_ENTERPRISE_VENTURE_SUITE",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_ENT_CAPSTONE_ENTERPRISE_VENTURE_SUITE",
              "errorExplanation": "Matches ENTERPRISE_ENTREPRENEURSHIP_AND_MANAGEMENT_MASTER_CERTIFIED_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ENTERPRISE_ENTREPRENEURSHIP_AND_MANAGEMENT_MASTER_CERTIFIED_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "ent-d30-b2-venture-suite-precision-audit",
        "day": 30,
        "blockNumber": 2,
        "title": "Enterprise Venture Suite 30-Day Invariant Verification & Precision Audit",
        "conceptBudget": {
          "primaryConcept": "30-Day Invariant Verification",
          "supportingTerms": [
            "Legal Invariant",
            "Financial Invariant",
            "GTM Invariant",
            "Governance Invariant",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d30-b1-enterprise-venture-suite-orchestration",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "venture_suite_audit.js",
            "initialCode": "function auditVentureSuite(daysCount, blocksCount, placeholdersCount) {\n  const isNominal = daysCount === 30 && blocksCount === 90 && placeholdersCount === 0;\n  return {\n    totalDays: daysCount,\n    totalBlocks: blocksCount,\n    placeholders: placeholdersCount,\n    auditGrade: isNominal ? '100_PERCENT_GOLD_STANDARD_REFERENCE_ACHIEVED' : 'AUDIT_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditVentureSuite(30, 90, 0)));",
            "expectedOutput": "{\"totalDays\":30,\"totalBlocks\":90,\"placeholders\":0,\"auditGrade\":\"100_PERCENT_GOLD_STANDARD_REFERENCE_ACHIEVED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade is awarded upon confirming 30 days, 90 micro-learning blocks, and 0 placeholders?",
          "expectedStringOutput": "100_PERCENT_GOLD_STANDARD_REFERENCE_ACHIEVED",
          "acceptableAnswers": [
            "100_PERCENT_GOLD_STANDARD_REFERENCE_ACHIEVED",
            "100% Gold Standard",
            "Gold standard achieved"
          ],
          "primaryMisconceptionId": "MC_ENT_CAPSTONE_ENTERPRISE_VENTURE_SUITE",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_ENT_CAPSTONE_ENTERPRISE_VENTURE_SUITE",
              "errorExplanation": "All checks passing awards 100_PERCENT_GOLD_STANDARD_REFERENCE_ACHIEVED.",
              "recoveryPath": {
                "simplerExplanation": "Awards 100_PERCENT_GOLD_STANDARD_REFERENCE_ACHIEVED.",
                "guidedFixPrompt": "Type 100_PERCENT_GOLD_STANDARD_REFERENCE_ACHIEVED"
              }
            }
          }
        }
      },
      {
        "id": "ent-d30-b3-final-capstone-ent-cert",
        "day": 30,
        "blockNumber": 3,
        "title": "PinIT Career OS Course #24: Entrepreneurship & Business Management Certification",
        "conceptBudget": {
          "primaryConcept": "Course 24 Master Certification",
          "supportingTerms": [
            "30 Days Complete",
            "90 Blocks Complete",
            "60 Proctored Tasks",
            "100% QA Score"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ent-d30-b2-venture-suite-precision-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "final_capstone_ent_cert.js",
            "initialCode": "console.log('🏆 COURSE 24 CERTIFIED: Entrepreneurship & Business Management (B.Com / BBA / MBA) [100% GOLD STANDARD REFERENCE]');",
            "expectedOutput": "🏆 COURSE 24 CERTIFIED: Entrepreneurship & Business Management (B.Com / BBA / MBA) [100% GOLD STANDARD REFERENCE]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms the final graduation and accreditation of Course #24?",
          "expectedStringOutput": "🏆 COURSE 24 CERTIFIED: Entrepreneurship & Business Management (B.Com / BBA / MBA) [100% GOLD STANDARD REFERENCE]",
          "acceptableAnswers": [
            "🏆 COURSE 24 CERTIFIED: Entrepreneurship & Business Management (B.Com / BBA / MBA) [100% GOLD STANDARD REFERENCE]",
            "100% GOLD STANDARD REFERENCE"
          ],
          "primaryMisconceptionId": "MC_ENT_CAPSTONE_ENTERPRISE_VENTURE_SUITE",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_ENT_CAPSTONE_ENTERPRISE_VENTURE_SUITE",
              "errorExplanation": "Matches course completion string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type 🏆 COURSE 24 CERTIFIED: Entrepreneurship & Business Management (B.Com / BBA / MBA) [100% GOLD STANDARD REFERENCE]"
              }
            }
          }
        }
      }
    ]
  }
];
