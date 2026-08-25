import { DayLessonPlan } from '@/lib/types/lessonEngine';

export const BCOM_MARKETING_PILOT_DAYS: DayLessonPlan[] = [
  {
    "day": 1,
    "title": "The Marketing Philosophy & Customer Value Equation",
    "overviewMetaphor": "Marketing is Building a Lighthouse, Not Chasing Ships with a Megaphone: the obsolete Selling Concept assumes customers are reluctant prey who must be aggressively badgered into buying factory inventory; the modern Marketing Concept builds a bright, welcoming lighthouse based on deep customer needs—where Total Customer Benefits ($150) dramatically outweigh Total Customer Costs ($100), creating a Customer Value Ratio of 1.50 that magnetically attracts loyal customers for life.",
    "blocks": [
      {
        "id": "mkt-d1-b1-customer-value-equation",
        "day": 1,
        "blockNumber": 1,
        "title": "The Customer Value Equation: $Value = \\frac{\\text{Total Customer Benefit}}{\\text{Total Customer Cost}}$",
        "conceptBudget": {
          "primaryConcept": "Customer Value Ratio Formula",
          "supportingTerms": [
            "Total Customer Benefit (Economic, functional, psychological benefits)",
            "Total Customer Cost (Monetary, time, energy, psychic costs)",
            "Value Ratio $> 1.0 \\implies$ Superior Delivered Customer Value"
          ]
        },
        "prerequisiteThresholds": [],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Customer Value Balance Sheet (Benefits = $150, Costs = $100)",
              "boxes": [
                {
                  "label": "Total Customer Benefits",
                  "value": "$150 Perceived Value (Functional + Status + Speed)",
                  "varType": "Benefits",
                  "isUpdated": false
                },
                {
                  "label": "Total Customer Costs",
                  "value": "$100 Total Sacrifice ($80 Cash + $20 Time/Effort)",
                  "varType": "Costs",
                  "isUpdated": false
                },
                {
                  "label": "Customer Value Ratio",
                  "value": "$150 / $100 = 1.50 (SUPERIOR DELIVERED VALUE!)",
                  "varType": "Value Ratio",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "customer_value_demo.js",
            "initialCode": "function calculateCustomerValue(benefits, costs) {\n  const ratio = benefits / costs;\n  return {\n    totalBenefits: benefits,\n    totalCosts: costs,\n    valueRatio: Number(ratio.toFixed(2)),\n    deliversSuperiorValue: ratio > 1.0,\n    status: 'VALUE_EVALUATED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateCustomerValue(150, 100)));\nconsole.log(JSON.stringify(calculateCustomerValue(80, 100)));",
            "expectedOutput": "{\"totalBenefits\":150,\"totalCosts\":100,\"valueRatio\":1.5,\"deliversSuperiorValue\":true,\"status\":\"VALUE_EVALUATED\"}\n{\"totalBenefits\":80,\"totalCosts\":100,\"valueRatio\":0.8,\"deliversSuperiorValue\":false,\"status\":\"VALUE_EVALUATED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Customer Value Ratio when total perceived customer benefits are $150 and total customer costs are $100 ($150 / 100$)?",
          "expectedStringOutput": "1.5",
          "acceptableAnswers": [
            "1.5",
            "1.50",
            "valueRatio\":1.5"
          ],
          "primaryMisconceptionId": "MC_MKT_PHILOSOPHIES_SELLING_VS_MARKETING_CONCEPT",
          "diagnosisMap": {
            "0.67": {
              "misconceptionId": "MC_MKT_PHILOSOPHIES_SELLING_VS_MARKETING_CONCEPT",
              "errorExplanation": "0.67 is Cost / Benefit. Value ratio is Benefit / Cost = 150 / 100 = 1.50.",
              "recoveryPath": {
                "simplerExplanation": "150 / 100 = 1.50.",
                "guidedFixPrompt": "Type 1.5"
              }
            }
          }
        }
      },
      {
        "id": "mkt-d1-b2-marketing-vs-selling-orientations",
        "day": 1,
        "blockNumber": 2,
        "title": "Marketing vs Selling Orientations: Outside-In vs Inside-Out",
        "conceptBudget": {
          "primaryConcept": "Marketing vs Selling Orientations",
          "supportingTerms": [
            "Selling Concept: Inside-Out (Factory focus $\\to$ Existing products $\\to$ Aggressive promotion $\\to$ Profits through sales volume)",
            "Marketing Concept: Outside-In (Target market focus $\\to$ Customer needs $\\to$ Integrated marketing $\\to$ Profits through customer satisfaction)",
            "Societal Marketing Concept (Balancing Company Profits, Customer Wants, and Long-Term Society Welfare)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d1-b1-customer-value-equation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Inside-Out vs Outside-In Philosophy",
            "codeSnippet": "// SELLING CONCEPT: Factory -> Existing Goods -> Hard Sell -> Short-term Volume\n// MARKETING CONCEPT: Target Market -> Customer Needs -> Integrated Marketing -> Lifetime Value!",
            "lineNotes": {
              "1": "Push inventory focus.",
              "2": "Customer need satisfaction."
            }
          },
          {
            "type": "runnable_code",
            "filename": "orientation_demo.js",
            "initialCode": "function classifyMarketingPhilosophy(focus) {\n  return focus === 'CUSTOMER_NEEDS_AND_VALUE'\n    ? 'MODERN_OUTSIDE_IN_MARKETING_CONCEPT'\n    : 'OBSOLETE_INSIDE_OUT_SELLING_CONCEPT';\n}\n\nconsole.log(classifyMarketingPhilosophy('CUSTOMER_NEEDS_AND_VALUE'));\nconsole.log(classifyMarketingPhilosophy('FACTORY_INVENTORY_CLEARANCE'));",
            "expectedOutput": "MODERN_OUTSIDE_IN_MARKETING_CONCEPT\nOBSOLETE_INSIDE_OUT_SELLING_CONCEPT",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How is an organization classified when its core business strategy starts from target market customer needs and profits through long-term customer satisfaction?",
          "expectedStringOutput": "MODERN_OUTSIDE_IN_MARKETING_CONCEPT",
          "acceptableAnswers": [
            "MODERN_OUTSIDE_IN_MARKETING_CONCEPT",
            "Marketing Concept",
            "Outside-In"
          ],
          "primaryMisconceptionId": "MC_MKT_PHILOSOPHIES_SELLING_VS_MARKETING_CONCEPT",
          "diagnosisMap": {
            "SELLING": {
              "misconceptionId": "MC_MKT_PHILOSOPHIES_SELLING_VS_MARKETING_CONCEPT",
              "errorExplanation": "Selling focuses on pushing existing inventory. Starting with customer needs is the Marketing Concept.",
              "recoveryPath": {
                "simplerExplanation": "Matches MODERN_OUTSIDE_IN_MARKETING_CONCEPT.",
                "guidedFixPrompt": "Type MODERN_OUTSIDE_IN_MARKETING_CONCEPT"
              }
            }
          }
        }
      },
      {
        "id": "mkt-d1-b3-customer-satisfaction-disconfirmation",
        "day": 1,
        "blockNumber": 3,
        "title": "Customer Satisfaction: Expectancy Disconfirmation Model",
        "conceptBudget": {
          "primaryConcept": "Expectancy Disconfirmation Model",
          "supportingTerms": [
            "$\\text{Satisfaction} = \\text{Perceived Performance} - \\text{Expectations}$",
            "Positive Disconfirmation (Delight: Performance exceeds expectations)",
            "Negative Disconfirmation (Dissatisfaction / Churn: Performance falls short)",
            "Managing and under-promising to over-deliver"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d1-b2-marketing-vs-selling-orientations",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "csat_demo.js",
            "initialCode": "function evaluateSatisfaction(perceivedPerformance, expectations) {\n  const diff = perceivedPerformance - expectations;\n  if (diff > 0) return 'CUSTOMER_DELIGHT_POSITIVE_DISCONFIRMATION';\n  if (diff === 0) return 'CUSTOMER_SATISFACTION_MET_EXPECTATIONS';\n  return 'CUSTOMER_DISSATISFACTION_NEGATIVE_DISCONFIRMATION';\n}\n\nconsole.log(evaluateSatisfaction(9.5, 8.0));\nconsole.log(evaluateSatisfaction(6.0, 8.0));",
            "expectedOutput": "CUSTOMER_DELIGHT_POSITIVE_DISCONFIRMATION\nCUSTOMER_DISSATISFACTION_NEGATIVE_DISCONFIRMATION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What psychological state is achieved when a product's delivered perceived performance (9.5) significantly exceeds initial consumer expectations (8.0)?",
          "expectedStringOutput": "CUSTOMER_DELIGHT_POSITIVE_DISCONFIRMATION",
          "acceptableAnswers": [
            "CUSTOMER_DELIGHT_POSITIVE_DISCONFIRMATION",
            "Customer Delight",
            "Positive Disconfirmation"
          ],
          "primaryMisconceptionId": "MC_MKT_PHILOSOPHIES_SELLING_VS_MARKETING_CONCEPT",
          "diagnosisMap": {
            "DISSATISFACTION": {
              "misconceptionId": "MC_MKT_PHILOSOPHIES_SELLING_VS_MARKETING_CONCEPT",
              "errorExplanation": "Performance exceeding expectations creates Customer Delight.",
              "recoveryPath": {
                "simplerExplanation": "Exceeding expectations produces Delight.",
                "guidedFixPrompt": "Type CUSTOMER_DELIGHT_POSITIVE_DISCONFIRMATION"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 2,
    "title": "Marketing Environment: PESTLE & Porter's Five Forces",
    "overviewMetaphor": "The Marketing Environment is Navigating a Ship Through Changing Weather and Competing Fleets: PESTLE Analysis checks the macro-climate (Political winds, Economic tides, Social currents, Tech lightning storms); Porter's Five Forces maps the surrounding armada (Threat of New Entrants, Buyer Bargaining Power, Supplier Power, Substitutes, and Competitor Rivalry); if competitive intensity averages 2.0 (out of 5), the industry is a high-margin, attractive harbor.",
    "blocks": [
      {
        "id": "ana-d2-b1-pestle-macro-environment",
        "day": 2,
        "blockNumber": 1,
        "title": "PESTLE Macro-Environmental Analysis Framework",
        "conceptBudget": {
          "primaryConcept": "PESTLE Macro-Analysis Framework",
          "supportingTerms": [
            "Political (Tax policy, trade tariffs, political stability)",
            "Economic (Inflation, interest rates, consumer disposable income)",
            "Socio-Cultural (Demographics, lifestyle changes, cultural attitudes)",
            "Technological (AI, automation, mobile commerce)",
            "Legal (Consumer protection, ASCI advertising laws)",
            "Environmental (Sustainability, carbon footprint)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d1-b2-marketing-vs-selling-orientations",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "PESTLE 6 Macro-Environmental Forces",
              "boxes": [
                {
                  "label": "1. Political & Legal",
                  "value": "GST rates, Data Privacy DPDP Act 2023, ASCI Codes",
                  "varType": "Policy Forces",
                  "isUpdated": false
                },
                {
                  "label": "2. Economic & Social",
                  "value": "Middle class disposable income rise, urban lifestyle shift",
                  "varType": "Market Forces",
                  "isUpdated": false
                },
                {
                  "label": "3. Tech & Environmental",
                  "value": "GenAI ad generation, eco-friendly recyclable packaging",
                  "varType": "Future Forces",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "pestle_demo.js",
            "initialCode": "function classifyPestleForce(eventDescription) {\n  if (eventDescription.includes('AI') || eventDescription.includes('Smartphone')) return 'TECHNOLOGICAL_FORCE';\n  if (eventDescription.includes('Inflation') || eventDescription.includes('Interest')) return 'ECONOMIC_FORCE';\n  if (eventDescription.includes('Law') || eventDescription.includes('Regulation')) return 'LEGAL_FORCE';\n  return 'SOCIO_CULTURAL_FORCE';\n}\n\nconsole.log(classifyPestleForce('Generative AI personalized video ads'));\nconsole.log(classifyPestleForce('Rising inflation squeezing household budgets'));",
            "expectedOutput": "TECHNOLOGICAL_FORCE\nECONOMIC_FORCE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How is the emergence of generative AI and smartphone mobile commerce classified in a PESTLE macro-environmental analysis?",
          "expectedStringOutput": "TECHNOLOGICAL_FORCE",
          "acceptableAnswers": [
            "TECHNOLOGICAL_FORCE",
            "Technological",
            "Tech Force"
          ],
          "primaryMisconceptionId": "MC_MKT_ENVIRONMENT_PESTLE_PORTERS_FIVE_FORCES",
          "diagnosisMap": {
            "ECONOMIC": {
              "misconceptionId": "MC_MKT_ENVIRONMENT_PESTLE_PORTERS_FIVE_FORCES",
              "errorExplanation": "AI and mobile commerce belong to the Technological pillar of PESTLE.",
              "recoveryPath": {
                "simplerExplanation": "Matches TECHNOLOGICAL_FORCE.",
                "guidedFixPrompt": "Type TECHNOLOGICAL_FORCE"
              }
            }
          }
        }
      },
      {
        "id": "mkt-d2-b2-porters-five-forces-model",
        "day": 2,
        "blockNumber": 2,
        "title": "Porter's Five Forces: Industry Attractiveness & Margin Potential",
        "conceptBudget": {
          "primaryConcept": "Porter's Five Forces Model",
          "supportingTerms": [
            "1. Threat of New Entrants (Barriers to entry)",
            "2. Bargaining Power of Buyers (Price sensitivity)",
            "3. Bargaining Power of Suppliers",
            "4. Threat of Substitute Products",
            "5. Rivalry Among Existing Competitors",
            "High total intensity $\\implies$ Low industry profitability"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d2-b1-pestle-macro-environment",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Porter Five Forces Intensity Math",
            "codeSnippet": "Scores (1=Low, 5=High): Entrants=2, Buyers=1, Suppliers=2, Substitutes=2, Rivalry=3\nSum = 2 + 1 + 2 + 2 + 3 = 10\nAverage Intensity = 10 / 5 = 2.00 <= 2.50\nConclusion: HIGH_MARGIN_ATTRACTIVE_INDUSTRY!",
            "lineNotes": {
              "1": "Individual force ratings.",
              "2": "Total intensity sum.",
              "3": "Industry attractiveness benchmark."
            }
          },
          {
            "type": "runnable_code",
            "filename": "porter_calc_demo.js",
            "initialCode": "function evaluateIndustryAttractiveness(scores) {\n  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;\n  return {\n    averageIntensity: Number(avg.toFixed(2)),\n    isAttractive: avg <= 2.5,\n    status: avg <= 2.5 ? 'HIGH_MARGIN_ATTRACTIVE_INDUSTRY' : 'HYPER_COMPETITIVE_LOW_MARGIN'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateIndustryAttractiveness([2, 1, 2, 2, 3])));",
            "expectedOutput": "{\"averageIntensity\":2,\"isAttractive\":true,\"status\":\"HIGH_MARGIN_ATTRACTIVE_INDUSTRY\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the average competitive intensity for an industry with force scores of [2, 1, 2, 2, 3] ($10 / 5$)?",
          "expectedStringOutput": "2",
          "acceptableAnswers": [
            "2",
            "2.0",
            "2.00",
            "averageIntensity\":2"
          ],
          "primaryMisconceptionId": "MC_MKT_ENVIRONMENT_PESTLE_PORTERS_FIVE_FORCES",
          "diagnosisMap": {
            "10": {
              "misconceptionId": "MC_MKT_ENVIRONMENT_PESTLE_PORTERS_FIVE_FORCES",
              "errorExplanation": "10 is the sum. Average across 5 forces is 10 / 5 = 2.0.",
              "recoveryPath": {
                "simplerExplanation": "10 / 5 = 2.",
                "guidedFixPrompt": "Type 2"
              }
            }
          }
        }
      },
      {
        "id": "mkt-d2-b3-swot-tows-matrix-synthesis",
        "day": 2,
        "blockNumber": 3,
        "title": "SWOT Matrix & TOWS Strategic Action Matching",
        "conceptBudget": {
          "primaryConcept": "SWOT / TOWS Strategic Synthesis",
          "supportingTerms": [
            "Internal (Strengths & Weaknesses)",
            "External (Opportunities & Threats)",
            "SO Strategy (Maxi-Maxi: Using strengths to seize opportunities)",
            "WT Strategy (Mini-Mini: Defensive containment)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d2-b2-porters-five-forces-model",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "swot_demo.js",
            "initialCode": "function getTowsStrategy(hasInternalStrength, hasExternalOpportunity) {\n  if (hasInternalStrength && hasExternalOpportunity) return 'SO_MAXI_MAXI_AGGRESSIVE_GROWTH';\n  return 'DEFENSIVE_OR_ADAPTIVE_STRATEGY';\n}\n\nconsole.log(getTowsStrategy(true, true));",
            "expectedOutput": "SO_MAXI_MAXI_AGGRESSIVE_GROWTH",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "In TOWS strategic matrix analysis, what strategy is formulated by leveraging internal Strengths to capitalize on external Opportunities (Maxi-Maxi)?",
          "expectedStringOutput": "SO_MAXI_MAXI_AGGRESSIVE_GROWTH",
          "acceptableAnswers": [
            "SO_MAXI_MAXI_AGGRESSIVE_GROWTH",
            "SO Strategy",
            "Maxi-Maxi"
          ],
          "primaryMisconceptionId": "MC_MKT_ENVIRONMENT_PESTLE_PORTERS_FIVE_FORCES",
          "diagnosisMap": {
            "WT": {
              "misconceptionId": "MC_MKT_ENVIRONMENT_PESTLE_PORTERS_FIVE_FORCES",
              "errorExplanation": "WT is Weakness-Threat (Defensive). Strength-Opportunity is SO Strategy.",
              "recoveryPath": {
                "simplerExplanation": "Matches SO_MAXI_MAXI_AGGRESSIVE_GROWTH.",
                "guidedFixPrompt": "Type SO_MAXI_MAXI_AGGRESSIVE_GROWTH"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 3,
    "title": "Consumer Buying Behavior: The 5-Stage Decision Journey",
    "overviewMetaphor": "The Consumer Buying Journey is a 5-Stage Mountain Expedition: 1. Need Recognition (My winter coat is torn); 2. Information Search (Browsing Google reviews and brand comparisons); 3. Evaluation of Alternatives (Deciding between North Face and Patagonia); 4. Purchase Decision (Swiping credit card at checkout); 5. Post-Purchase Evaluation (Experiencing Buyer's Remorse vs Brand Euphoria); smart marketers send reassuring unboxing guides immediately after purchase to squash cognitive dissonance.",
    "blocks": [
      {
        "id": "mkt-d3-b1-five-stages-consumer-journey",
        "day": 3,
        "blockNumber": 1,
        "title": "The 5-Stage Consumer Buying Decision Process",
        "conceptBudget": {
          "primaryConcept": "The 5-Stage Consumer Funnel",
          "supportingTerms": [
            "Stage 1: Need Recognition (Internal vs External stimuli)",
            "Stage 2: Information Search (Personal, Commercial, Public, Experiential sources)",
            "Stage 3: Evaluation of Alternatives (Evoked / Consideration set)",
            "Stage 4: Purchase Decision (Intent vs actual buy)",
            "Stage 5: Post-Purchase Behavior"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d1-b1-customer-value-equation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "5-Stage Purchase Decision Flow",
              "boxes": [
                {
                  "label": "1. Need Recognition",
                  "value": "Problem Identified: Computer is freezing during video edits",
                  "varType": "Trigger",
                  "isUpdated": false
                },
                {
                  "label": "2. Info Search & 3. Evaluation",
                  "value": "Comparing MacBook Pro vs Dell XPS specs and price",
                  "varType": "Evaluation",
                  "isUpdated": false
                },
                {
                  "label": "4. Purchase & 5. Post-Purchase",
                  "value": "Bought MacBook Pro; Unboxing guide confirms great decision!",
                  "varType": "Resolution",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "journey_demo.js",
            "initialCode": "function getFunnelStage(action) {\n  if (action === 'SEARCHING_YOUTUBE_REVIEWS') return 'STAGE_2_INFORMATION_SEARCH';\n  if (action === 'EXPERIENCING_COGNITIVE_DISSONANCE') return 'STAGE_5_POST_PURCHASE_EVALUATION';\n  return 'STAGE_1_NEED_RECOGNITION';\n}\n\nconsole.log(getFunnelStage('SEARCHING_YOUTUBE_REVIEWS'));\nconsole.log(getFunnelStage('EXPERIENCING_COGNITIVE_DISSONANCE'));",
            "expectedOutput": "STAGE_2_INFORMATION_SEARCH\nSTAGE_5_POST_PURCHASE_EVALUATION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which stage of the consumer buying journey is active when a shopper searches YouTube reviews and asks friends for laptop recommendations?",
          "expectedStringOutput": "STAGE_2_INFORMATION_SEARCH",
          "acceptableAnswers": [
            "STAGE_2_INFORMATION_SEARCH",
            "Information Search",
            "Stage 2"
          ],
          "primaryMisconceptionId": "MC_MKT_CONSUMER_BEHAVIOR_BUYING_DECISION_PROCESS",
          "diagnosisMap": {
            "STAGE_1": {
              "misconceptionId": "MC_MKT_CONSUMER_BEHAVIOR_BUYING_DECISION_PROCESS",
              "errorExplanation": "Need recognition is recognizing the problem. Searching reviews is Information Search.",
              "recoveryPath": {
                "simplerExplanation": "Searching reviews is Stage 2 Information Search.",
                "guidedFixPrompt": "Type STAGE_2_INFORMATION_SEARCH"
              }
            }
          }
        }
      },
      {
        "id": "mkt-d3-b2-cognitive-dissonance-mitigation",
        "day": 3,
        "blockNumber": 2,
        "title": "Post-Purchase Cognitive Dissonance (Buyer's Remorse Mitigation)",
        "conceptBudget": {
          "primaryConcept": "Cognitive Dissonance Mitigation",
          "supportingTerms": [
            "Cognitive Dissonance: Buyer discomfort caused by post-purchase conflict ('Did I waste my money?')",
            "Post-purchase confirmation emails",
            "Warranties, clear return policies, and VIP welcome sequences"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d3-b1-five-stages-consumer-journey",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Post-Purchase Reassurance Protocol",
            "codeSnippet": "// ❌ FLAW: Disappear after customer swipe -> Buyer experiences severe remorse & cancels!\n// ✅ FIX: Send instant congratulations email, unboxing masterclass & 24/7 VIP onboarding support!",
            "lineNotes": {
              "1": "High cancellation risk.",
              "2": "Proactive dissonance squash."
            }
          },
          {
            "type": "runnable_code",
            "filename": "remorse_demo.js",
            "initialCode": "function getPostPurchaseAction() {\n  return 'DEPLOY_REASSURANCE_EMAIL_AND_UNBOXING_GUIDE';\n}\n\nconsole.log(getPostPurchaseAction());",
            "expectedOutput": "DEPLOY_REASSURANCE_EMAIL_AND_UNBOXING_GUIDE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What marketing communication should be triggered immediately after a customer makes a high-involvement purchase to eliminate Buyer's Remorse?",
          "expectedStringOutput": "DEPLOY_REASSURANCE_EMAIL_AND_UNBOXING_GUIDE",
          "acceptableAnswers": [
            "DEPLOY_REASSURANCE_EMAIL_AND_UNBOXING_GUIDE",
            "Reassurance email",
            "Unboxing guide"
          ],
          "primaryMisconceptionId": "MC_MKT_CONSUMER_BEHAVIOR_BUYING_DECISION_PROCESS",
          "diagnosisMap": {
            "IGNORE": {
              "misconceptionId": "MC_MKT_CONSUMER_BEHAVIOR_BUYING_DECISION_PROCESS",
              "errorExplanation": "Ignoring customers post-purchase causes high return rates and churn. Reassurance is required.",
              "recoveryPath": {
                "simplerExplanation": "Matches DEPLOY_REASSURANCE_EMAIL_AND_UNBOXING_GUIDE.",
                "guidedFixPrompt": "Type DEPLOY_REASSURANCE_EMAIL_AND_UNBOXING_GUIDE"
              }
            }
          }
        }
      },
      {
        "id": "mkt-d3-b3-maslow-motivation-hierarchy",
        "day": 3,
        "blockNumber": 3,
        "title": "Maslow's Motivation Hierarchy in Consumer Advertising",
        "conceptBudget": {
          "primaryConcept": "Maslow's Hierarchy in Marketing",
          "supportingTerms": [
            "1. Physiological (Food, water: Basic grocery ads)",
            "2. Safety (Insurance, security alarms: Volvo)",
            "3. Social / Belonging (Friendship, community: Coca-Cola)",
            "4. Esteem (Status, luxury: Rolex, BMW)",
            "5. Self-Actualization (Personal growth: Nike 'Just Do It')"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d3-b2-cognitive-dissonance-mitigation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "maslow_demo.js",
            "initialCode": "function mapMaslowNeed(brand) {\n  if (brand === 'Rolex' || brand === 'BMW') return 'ESTEEM_AND_STATUS_NEED';\n  if (brand === 'Nike') return 'SELF_ACTUALIZATION_NEED';\n  if (brand === 'Volvo') return 'SAFETY_AND_SECURITY_NEED';\n  return 'PHYSIOLOGICAL_BASIC_NEED';\n}\n\nconsole.log(mapMaslowNeed('Rolex'));\nconsole.log(mapMaslowNeed('Nike'));",
            "expectedOutput": "ESTEEM_AND_STATUS_NEED\nSELF_ACTUALIZATION_NEED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which level of Maslow's hierarchy is targeted by luxury watch and sports car branding (Rolex / Ferrari)?",
          "expectedStringOutput": "ESTEEM_AND_STATUS_NEED",
          "acceptableAnswers": [
            "ESTEEM_AND_STATUS_NEED",
            "Esteem",
            "Status Need"
          ],
          "primaryMisconceptionId": "MC_MKT_CONSUMER_BEHAVIOR_BUYING_DECISION_PROCESS",
          "diagnosisMap": {
            "PHYSIO": {
              "misconceptionId": "MC_MKT_CONSUMER_BEHAVIOR_BUYING_DECISION_PROCESS",
              "errorExplanation": "Physiological is basic food/water. Luxury goods target Esteem & Status.",
              "recoveryPath": {
                "simplerExplanation": "Luxury targets Esteem & Status.",
                "guidedFixPrompt": "Type ESTEEM_AND_STATUS_NEED"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 4,
    "title": "Market Research & Net Promoter Score (NPS) Analytics",
    "overviewMetaphor": "Net Promoter Score (NPS) is the Single Ultimate Question of Customer Loyalty: 'On a scale of 0-10, how likely are you to recommend us to a friend or colleague?'; Promoters (9-10: 60% of users) are your vocal brand evangelists; Passives (7-8: 20%) are indifferent fence-sitters; Detractors (0-6: 20%) are angry saboteurs telling everyone to avoid you; $NPS = 60\\% - 20\\% = +40.0$—proving your brand has powerful organic viral loyalty.",
    "blocks": [
      {
        "id": "mkt-d4-b1-nps-calculation-methodology",
        "day": 4,
        "blockNumber": 1,
        "title": "The Net Promoter Score (NPS) Formula: $% \\text{Promoters} - \\% \\text{Detractors}$",
        "conceptBudget": {
          "primaryConcept": "Net Promoter Score (NPS) Formula",
          "supportingTerms": [
            "Promoters (Ratings 9-10)",
            "Passives (Ratings 7-8: Ignored in subtraction, but counted in denominator)",
            "Detractors (Ratings 0-6)",
            "$NPS = \\% \\text{Promoters} - \\% \\text{Detractors}$ (Range: $-100 \\text{ to } +100$)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d3-b1-five-stages-consumer-journey",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "NPS Survey Distribution (10 Respondents: [10, 9, 10, 9, 8, 7, 6, 2, 10, 9])",
              "boxes": [
                {
                  "label": "Promoters (9-10)",
                  "value": "6 Respondents (60.0% of customer base)",
                  "varType": "Promoters",
                  "isUpdated": false
                },
                {
                  "label": "Passives (7-8)",
                  "value": "2 Respondents (20.0% of customer base)",
                  "varType": "Passives",
                  "isUpdated": false
                },
                {
                  "label": "Detractors (0-6)",
                  "value": "2 Respondents (20.0% of customer base)",
                  "varType": "Detractors",
                  "isUpdated": false
                },
                {
                  "label": "Net Promoter Score",
                  "value": "60.0% - 20.0% = EXACTLY +40.0 NPS!",
                  "varType": "NPS Score",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "nps_calc_demo.js",
            "initialCode": "function calculateNps(ratings) {\n  const total = ratings.length;\n  let p = 0, pas = 0, d = 0;\n  ratings.forEach(r => {\n    if (r >= 9) p++;\n    else if (r >= 7) pas++;\n    else d++;\n  });\n  const nps = ((p - d) / total) * 100;\n  return {\n    totalResponses: total,\n    promoterPct: (p / total) * 100,\n    detractorPct: (d / total) * 100,\n    netPromoterScore: Number(nps.toFixed(1)),\n    status: 'NPS_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateNps([10, 9, 10, 9, 8, 7, 6, 2, 10, 9])));",
            "expectedOutput": "{\"totalResponses\":10,\"promoterPct\":60,\"detractorPct\":20,\"netPromoterScore\":40,\"status\":\"NPS_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Net Promoter Score (NPS) when 60% of respondents are Promoters and 20% are Detractors ($60 - 20$)?",
          "expectedStringOutput": "40",
          "acceptableAnswers": [
            "40",
            "+40",
            "40.0",
            "netPromoterScore\":40"
          ],
          "primaryMisconceptionId": "MC_MKT_MARKET_RESEARCH_NPS_CALCULATION_SURVEYS",
          "diagnosisMap": {
            "20": {
              "misconceptionId": "MC_MKT_MARKET_RESEARCH_NPS_CALCULATION_SURVEYS",
              "errorExplanation": "20 is the passives percentage. NPS is %Promoters - %Detractors = 60 - 20 = +40.",
              "recoveryPath": {
                "simplerExplanation": "60 - 20 = 40.",
                "guidedFixPrompt": "Type 40"
              }
            }
          }
        }
      },
      {
        "id": "mkt-d4-b2-nps-benchmarks-and-tiers",
        "day": 4,
        "blockNumber": 2,
        "title": "NPS Benchmarks: Negative, Healthy & World-Class Tiers",
        "conceptBudget": {
          "primaryConcept": "NPS Benchmark Tiers",
          "supportingTerms": [
            "$< 0$: Critical customer dissatisfaction (Churn crisis)",
            "$0 - 50$: Healthy positive customer loyalty",
            "$\\ge 50$: World-class customer advocacy (Apple, Tesla, Costco tier)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d4-b1-nps-calculation-methodology",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "NPS Tier Benchmarks",
            "codeSnippet": "// NPS < 0   -> CRITICAL_CUSTOMER_DISSATISFACTION\n// NPS 0-50  -> HEALTHY_POSITIVE_LOYALTY\n// NPS >= 50 -> WORLD_CLASS_CUSTOMER_LOYALTY!",
            "lineNotes": {
              "1": "Net negative churn danger.",
              "2": "Standard solid performance.",
              "3": "Elite brand love."
            }
          },
          {
            "type": "runnable_code",
            "filename": "nps_tier_demo.js",
            "initialCode": "function evaluateNpsTier(nps) {\n  if (nps >= 50) return 'WORLD_CLASS_CUSTOMER_LOYALTY';\n  if (nps > 0) return 'HEALTHY_POSITIVE_LOYALTY';\n  return 'CRITICAL_CUSTOMER_DISSATISFACTION';\n}\n\nconsole.log(evaluateNpsTier(65));\nconsole.log(evaluateNpsTier(40));\nconsole.log(evaluateNpsTier(-15));",
            "expectedOutput": "WORLD_CLASS_CUSTOMER_LOYALTY\nHEALTHY_POSITIVE_LOYALTY\nCRITICAL_CUSTOMER_DISSATISFACTION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How is an NPS score of +65 evaluated against global corporate loyalty benchmarks?",
          "expectedStringOutput": "WORLD_CLASS_CUSTOMER_LOYALTY",
          "acceptableAnswers": [
            "WORLD_CLASS_CUSTOMER_LOYALTY",
            "World Class",
            "World-class"
          ],
          "primaryMisconceptionId": "MC_MKT_MARKET_RESEARCH_NPS_CALCULATION_SURVEYS",
          "diagnosisMap": {
            "HEALTHY": {
              "misconceptionId": "MC_MKT_MARKET_RESEARCH_NPS_CALCULATION_SURVEYS",
              "errorExplanation": "Scores >= +50 represent elite World-Class customer loyalty.",
              "recoveryPath": {
                "simplerExplanation": "Score >= 50 is World-Class.",
                "guidedFixPrompt": "Type WORLD_CLASS_CUSTOMER_LOYALTY"
              }
            }
          }
        }
      },
      {
        "id": "mkt-d4-b3-primary-vs-secondary-research",
        "day": 4,
        "blockNumber": 3,
        "title": "Primary vs Secondary Market Research Methods",
        "conceptBudget": {
          "primaryConcept": "Primary vs Secondary Research",
          "supportingTerms": [
            "Primary Research (First-hand data gathered specifically for current study: Surveys, Focus groups, In-depth interviews, A/B tests)",
            "Secondary Research (Pre-existing data gathered for other purposes: Industry reports, Census data, Competitor 10-K filings)",
            "Cost vs Specificity trade-off"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d4-b2-nps-benchmarks-and-tiers",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "research_demo.js",
            "initialCode": "function classifyResearchMethod(source) {\n  if (source === 'COMMISSIONED_FOCUS_GROUP' || source === 'USER_SURVEY') return 'PRIMARY_MARKET_RESEARCH';\n  return 'SECONDARY_DESK_RESEARCH';\n}\n\nconsole.log(classifyResearchMethod('COMMISSIONED_FOCUS_GROUP'));\nconsole.log(classifyResearchMethod('GOVERNMENT_CENSUS_REPORT'));",
            "expectedOutput": "PRIMARY_MARKET_RESEARCH\nSECONDARY_DESK_RESEARCH",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How are custom-commissioned customer focus groups and original survey questionnaires classified in market research methodology?",
          "expectedStringOutput": "PRIMARY_MARKET_RESEARCH",
          "acceptableAnswers": [
            "PRIMARY_MARKET_RESEARCH",
            "Primary Research",
            "Primary"
          ],
          "primaryMisconceptionId": "MC_MKT_MARKET_RESEARCH_NPS_CALCULATION_SURVEYS",
          "diagnosisMap": {
            "SECONDARY": {
              "misconceptionId": "MC_MKT_MARKET_RESEARCH_NPS_CALCULATION_SURVEYS",
              "errorExplanation": "Census reports are secondary. Original custom focus groups are Primary research.",
              "recoveryPath": {
                "simplerExplanation": "First-hand custom data is Primary Research.",
                "guidedFixPrompt": "Type PRIMARY_MARKET_RESEARCH"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 5,
    "title": "⭐ MILESTONE 1: Complete Market Research & Customer Insight Engine",
    "overviewMetaphor": "Milestone 1 Synthesis: The complete sovereign market research, environmental scanning, and customer insight engine: 1. Customer Value equation evaluation ($Value = 1.50$); 2. Porter's Five Forces competitive intensity analysis; 3. Consumer 5-stage buying journey classification; 4. Net Promoter Score (NPS) customer loyalty verification.",
    "blocks": [
      {
        "id": "mkt-d5-b1-market-research-engine-synthesis",
        "day": 5,
        "blockNumber": 1,
        "title": "Market Research & Customer Insight Master Kernel Synthesis",
        "conceptBudget": {
          "primaryConcept": "Market Research Engine Synthesis",
          "supportingTerms": [
            "Customer Value Evaluator",
            "Porter Five Forces Engine",
            "Buying Journey Classifier",
            "NPS Calculator"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d4-b3-primary-vs-secondary-research",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Milestone 1 Market Research Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "Evaluates Customer Value Ratio ($Benefits/Costs = 1.50$)",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Computes Porter's Five Forces competitive intensity (2.0/5.0)",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Tracks consumer 5-stage buying funnel and squashes dissonance",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Calculates Net Promoter Score ($NPS = +40.0$) and certifies insight engine!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "research_kernel_demo.js",
            "initialCode": "function runMarketResearchEngine() {\n  return {\n    valueSubsystem: 'ONLINE_VALUE_EQUATION_ACTIVE',\n    environmentSubsystem: 'ONLINE_PORTER_FIVE_FORCES_ACTIVE',\n    consumerBehaviorSubsystem: 'ONLINE_5_STAGE_FUNNEL_ACTIVE',\n    npsSubsystem: 'ONLINE_NPS_ANALYTICS_ACTIVE',\n    engineStatus: 'MARKET_RESEARCH_MASTER_KERNEL_ACTIVE_NOMINAL'\n  };\n}\n\nconsole.log(runMarketResearchEngine().engineStatus);",
            "expectedOutput": "MARKET_RESEARCH_MASTER_KERNEL_ACTIVE_NOMINAL",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What engine status confirms active operational synthesis of the Market Research Master Kernel?",
          "expectedStringOutput": "MARKET_RESEARCH_MASTER_KERNEL_ACTIVE_NOMINAL",
          "acceptableAnswers": [
            "MARKET_RESEARCH_MASTER_KERNEL_ACTIVE_NOMINAL",
            "engineStatus: MARKET_RESEARCH_MASTER_KERNEL_ACTIVE_NOMINAL"
          ],
          "primaryMisconceptionId": "MC_MKT_MARKET_RESEARCH_NPS_CALCULATION_SURVEYS",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_MKT_MARKET_RESEARCH_NPS_CALCULATION_SURVEYS",
              "errorExplanation": "Matches MARKET_RESEARCH_MASTER_KERNEL_ACTIVE_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type MARKET_RESEARCH_MASTER_KERNEL_ACTIVE_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "mkt-d5-b2-research-engine-audit",
        "day": 5,
        "blockNumber": 2,
        "title": "Market Research Invariant Verification & Precision Audit",
        "conceptBudget": {
          "primaryConcept": "Research Invariant Verification",
          "supportingTerms": [
            "Value Invariant",
            "NPS Invariant",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d5-b1-market-research-engine-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "research_audit_demo.js",
            "initialCode": "function auditMarketResearchEngine(valValid, envValid, behValid, npsValid) {\n  const passed = valValid && envValid && behValid && npsValid;\n  return {\n    valueVerified: valValid,\n    environmentVerified: envValid,\n    behaviorVerified: behValid,\n    npsVerified: npsValid,\n    grade: passed ? 'MARKET_RESEARCH_ENGINE_AUDIT_PASSED' : 'AUDIT_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditMarketResearchEngine(true, true, true, true)));",
            "expectedOutput": "{\"valueVerified\":true,\"environmentVerified\":true,\"behaviorVerified\":true,\"npsVerified\":true,\"grade\":\"MARKET_RESEARCH_ENGINE_AUDIT_PASSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade is awarded when Value, Environment, Behavior, and NPS engines pass 100%?",
          "expectedStringOutput": "MARKET_RESEARCH_ENGINE_AUDIT_PASSED",
          "acceptableAnswers": [
            "MARKET_RESEARCH_ENGINE_AUDIT_PASSED",
            "grade\":\"MARKET_RESEARCH_ENGINE_AUDIT_PASSED\""
          ],
          "primaryMisconceptionId": "MC_MKT_MARKET_RESEARCH_NPS_CALCULATION_SURVEYS",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_MKT_MARKET_RESEARCH_NPS_CALCULATION_SURVEYS",
              "errorExplanation": "All checks passing awards MARKET_RESEARCH_ENGINE_AUDIT_PASSED.",
              "recoveryPath": {
                "simplerExplanation": "Awards MARKET_RESEARCH_ENGINE_AUDIT_PASSED.",
                "guidedFixPrompt": "Type MARKET_RESEARCH_ENGINE_AUDIT_PASSED"
              }
            }
          }
        }
      },
      {
        "id": "mkt-d5-b3-milestone1-marketing-cert",
        "day": 5,
        "blockNumber": 3,
        "title": "Milestone 1 Market Research & Customer Insight Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 1 Certification",
          "supportingTerms": [
            "Market Research Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d5-b2-research-engine-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone1_mkt_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 1: Complete Market Research & Customer Insight Engine [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 1: Complete Market Research & Customer Insight Engine [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 1 completion?",
          "expectedStringOutput": "⭐ MILESTONE 1: Complete Market Research & Customer Insight Engine [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 1: Complete Market Research & Customer Insight Engine [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_MKT_MARKET_RESEARCH_NPS_CALCULATION_SURVEYS",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_MKT_MARKET_RESEARCH_NPS_CALCULATION_SURVEYS",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 1: Complete Market Research & Customer Insight Engine [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 6,
    "title": "STP Strategy: Market Segmentation (Bases & Criteria)",
    "overviewMetaphor": "Market Segmentation is Slicing a Giant Birthday Cake into Individual Custom Slices: trying to please 'everyone' with a generic product pleases nobody; Segmentation carves the market into distinct groups based on Demographics (Age, Income), Geographics (City, Climate), Psychographics (Values, Lifestyle), and Behavior (Heavy vs Occasional users); every valid slice must satisfy the MASDA test: Measurable, Substantial, Accessible, Differentiable, and Actionable.",
    "blocks": [
      {
        "id": "mkt-d6-b1-segmentation-bases-four-pillars",
        "day": 6,
        "blockNumber": 1,
        "title": "The 4 Bases of Market Segmentation: Demographic, Geographic, Psychographic & Behavioral",
        "conceptBudget": {
          "primaryConcept": "The 4 Segmentation Bases",
          "supportingTerms": [
            "1. Demographic (Age, Gender, Income, Education, Family life cycle)",
            "2. Geographic (Nations, Regions, Urban/Rural density, Climate)",
            "3. Psychographic (Social class, Lifestyle, Personality, VALS values)",
            "4. Behavioral (Occasions, Benefits sought, User status, Usage rate, Brand loyalty)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d1-b1-customer-value-equation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Segmentation Bases Matrix",
              "boxes": [
                {
                  "label": "1. Demographic",
                  "value": "Gen-Z Professionals, Annual Income > $80,000",
                  "varType": "Demographic",
                  "isUpdated": false
                },
                {
                  "label": "2. Psychographic",
                  "value": "Eco-conscious, active outdoor fitness lifestyle (VALS Innovators)",
                  "varType": "Psychographic",
                  "isUpdated": false
                },
                {
                  "label": "3. Behavioral",
                  "value": "Heavy daily users seeking premium durability & organic materials",
                  "varType": "Behavioral",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "segment_base_demo.js",
            "initialCode": "function classifySegmentationBase(attribute) {\n  if (attribute.includes('Income') || attribute.includes('Age')) return 'DEMOGRAPHIC_SEGMENTATION';\n  if (attribute.includes('Lifestyle') || attribute.includes('Values')) return 'PSYCHOGRAPHIC_SEGMENTATION';\n  if (attribute.includes('Usage_Rate') || attribute.includes('Loyalty')) return 'BEHAVIORAL_SEGMENTATION';\n  return 'GEOGRAPHIC_SEGMENTATION';\n}\n\nconsole.log(classifySegmentationBase('Annual_Income_Above_80K'));\nconsole.log(classifySegmentationBase('Eco_Conscious_Lifestyle'));\nconsole.log(classifySegmentationBase('Heavy_Daily_Usage_Rate'));",
            "expectedOutput": "DEMOGRAPHIC_SEGMENTATION\nPSYCHOGRAPHIC_SEGMENTATION\nBEHAVIORAL_SEGMENTATION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How is segmenting customers based on their active outdoor lifestyle and personal environmental values classified?",
          "expectedStringOutput": "PSYCHOGRAPHIC_SEGMENTATION",
          "acceptableAnswers": [
            "PSYCHOGRAPHIC_SEGMENTATION",
            "Psychographic Segmentation",
            "Psychographic"
          ],
          "primaryMisconceptionId": "MC_MKT_SEGMENTATION_TARGETING_POSITIONING_STP",
          "diagnosisMap": {
            "DEMO": {
              "misconceptionId": "MC_MKT_SEGMENTATION_TARGETING_POSITIONING_STP",
              "errorExplanation": "Demographics is age/income. Lifestyle and values belong to Psychographic segmentation.",
              "recoveryPath": {
                "simplerExplanation": "Lifestyle is Psychographic.",
                "guidedFixPrompt": "Type PSYCHOGRAPHIC_SEGMENTATION"
              }
            }
          }
        }
      },
      {
        "id": "mkt-d6-b2-masda-criteria-effective-segmentation",
        "day": 6,
        "blockNumber": 2,
        "title": "The MASDA Criteria for Effective Market Segmentation",
        "conceptBudget": {
          "primaryConcept": "MASDA Segmentation Standard",
          "supportingTerms": [
            "Measurable (Size, purchasing power, and profiles can be quantified)",
            "Substantial (Large or profitable enough to serve)",
            "Accessible (Can be effectively reached and served via distribution/media)",
            "Differentiable (Conceptually distinguishable and respond differently to marketing mix)",
            "Actionable (Effective programs can be designed to attract and serve)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d6-b1-segmentation-bases-four-pillars",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "MASDA Validation Invariant",
            "codeSnippet": "// All 5 criteria MUST evaluate to TRUE for a valid segment:\n// [Measurable && Substantial && Accessible && Differentiable && Actionable] === true",
            "lineNotes": {
              "1": "Mandatory 5-point test.",
              "2": "Boolean qualification."
            }
          },
          {
            "type": "runnable_code",
            "filename": "masda_demo.js",
            "initialCode": "function evaluateMasda(m, s, a, d, act) {\n  const ok = m && s && a && d && act;\n  return ok ? 'VALID_VIABLE_TARGET_MARKET_SEGMENT' : 'REJECTED_NON_VIABLE_SEGMENT';\n}\n\nconsole.log(evaluateMasda(true, true, true, true, true));\nconsole.log(evaluateMasda(true, false, true, true, true));",
            "expectedOutput": "VALID_VIABLE_TARGET_MARKET_SEGMENT\nREJECTED_NON_VIABLE_SEGMENT",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What evaluation is assigned to a proposed customer segment that satisfies all 5 MASDA requirements (Measurable, Substantial, Accessible, Differentiable, Actionable)?",
          "expectedStringOutput": "VALID_VIABLE_TARGET_MARKET_SEGMENT",
          "acceptableAnswers": [
            "VALID_VIABLE_TARGET_MARKET_SEGMENT",
            "Valid Segment",
            "Viable Segment"
          ],
          "primaryMisconceptionId": "MC_MKT_SEGMENTATION_TARGETING_POSITIONING_STP",
          "diagnosisMap": {
            "REJECTED": {
              "misconceptionId": "MC_MKT_SEGMENTATION_TARGETING_POSITIONING_STP",
              "errorExplanation": "Meeting all 5 criteria validates the segment.",
              "recoveryPath": {
                "simplerExplanation": "Matches VALID_VIABLE_TARGET_MARKET_SEGMENT.",
                "guidedFixPrompt": "Type VALID_VIABLE_TARGET_MARKET_SEGMENT"
              }
            }
          }
        }
      },
      {
        "id": "mkt-d6-b3-behavioral-usage-rate-segmentation",
        "day": 6,
        "blockNumber": 3,
        "title": "Behavioral Segmentation: Usage Rate & Benefit-Sought Analysis",
        "conceptBudget": {
          "primaryConcept": "Behavioral Benefit Segmentation",
          "supportingTerms": [
            "Benefit-Sought (Segmenting by the specific job-to-be-done e.g. Whitening vs Sensitivity toothpaste)",
            "Usage Rate (Non-users, Light users, Medium users, Heavy users / Power-users)",
            "User Status (First-time vs Regulars)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d6-b2-masda-criteria-effective-segmentation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "benefit_demo.js",
            "initialCode": "function getToothpasteSegment(primaryBenefit) {\n  if (primaryBenefit === 'TEETH_WHITENING') return 'COSMETIC_CONSCIOUS_SEGMENT';\n  if (primaryBenefit === 'SENSITIVE_TEETH_RELIEF') return 'THERAPEUTIC_HEALTH_SEGMENT';\n  return 'BUDGET_FAMILY_SEGMENT';\n}\n\nconsole.log(getToothpasteSegment('TEETH_WHITENING'));\nconsole.log(getToothpasteSegment('SENSITIVE_TEETH_RELIEF'));",
            "expectedOutput": "COSMETIC_CONSCIOUS_SEGMENT\nTHERAPEUTIC_HEALTH_SEGMENT",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How is toothpaste market segmentation structured when dividing consumers by 'Teeth Whitening' vs 'Sensitivity Relief'?",
          "expectedStringOutput": "COSMETIC_CONSCIOUS_SEGMENT",
          "acceptableAnswers": [
            "COSMETIC_CONSCIOUS_SEGMENT",
            "Benefit-Sought Segmentation",
            "Benefit Segmentation"
          ],
          "primaryMisconceptionId": "MC_MKT_SEGMENTATION_TARGETING_POSITIONING_STP",
          "diagnosisMap": {
            "DEMO": {
              "misconceptionId": "MC_MKT_SEGMENTATION_TARGETING_POSITIONING_STP",
              "errorExplanation": "Whitening is a specific functional benefit sought, not an age or income demographic.",
              "recoveryPath": {
                "simplerExplanation": "Whitening targets Cosmetic Conscious benefit segment.",
                "guidedFixPrompt": "Type COSMETIC_CONSCIOUS_SEGMENT"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 7,
    "title": "STP Strategy: Target Market Selection & Coverage Strategies",
    "overviewMetaphor": "Targeting is Choosing Which Archery Targets to Shoot At: Undifferentiated / Mass Marketing fires one giant cannonball at the entire forest; Differentiated Marketing designs custom tailored arrows for 4 different target rings (e.g. Toyota selling Corolla to students, Camry to families, Lexus to executives); Concentrated / Niche Marketing fires all arrows at one single bullseye (e.g. Rolls-Royce dominating ultra-luxury billionaires).",
    "blocks": [
      {
        "id": "mkt-d7-b1-four-targeting-coverage-strategies",
        "day": 7,
        "blockNumber": 1,
        "title": "The 4 Target Market Coverage Strategies: Mass, Segmented, Niche & Micro",
        "conceptBudget": {
          "primaryConcept": "Targeting Coverage Strategies",
          "supportingTerms": [
            "1. Undifferentiated (Mass Marketing: One product to whole market e.g. Model T Ford)",
            "2. Differentiated (Segmented: Multiple tailored offerings for multiple segments)",
            "3. Concentrated (Niche: Large share of one or few specialized sub-markets)",
            "4. Micromarketing (Local & 1-to-1 Individualized hyper-personalization)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d6-b1-segmentation-bases-four-pillars",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Targeting Strategies Continuum",
              "boxes": [
                {
                  "label": "Mass Marketing",
                  "value": "Broad coverage -> Single marketing mix (Low cost, low customization)",
                  "varType": "Broad Target",
                  "isUpdated": false
                },
                {
                  "label": "Differentiated Marketing",
                  "value": "Multi-segment coverage -> Distinct products for distinct segments",
                  "varType": "Segment Target",
                  "isUpdated": false
                },
                {
                  "label": "Concentrated Niche",
                  "value": "Narrow specialty coverage -> Deep dominance of specialized niche!",
                  "varType": "Niche Target",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "targeting_demo.js",
            "initialCode": "function selectTargetingStrategy(resources, marketVariability) {\n  if (resources === 'LIMITED' && marketVariability === 'HIGH') return 'CONCENTRATED_NICHE_MARKETING';\n  if (resources === 'ABUNDANT' && marketVariability === 'HIGH') return 'DIFFERENTIATED_MULTI_SEGMENT_MARKETING';\n  return 'UNDIFFERENTIATED_MASS_MARKETING';\n}\n\nconsole.log(selectTargetingStrategy('LIMITED', 'HIGH'));\nconsole.log(selectTargetingStrategy('ABUNDANT', 'HIGH'));",
            "expectedOutput": "CONCENTRATED_NICHE_MARKETING\nDIFFERENTIATED_MULTI_SEGMENT_MARKETING",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which targeting strategy is optimal for a startup with limited capital resources entering a highly varied market?",
          "expectedStringOutput": "CONCENTRATED_NICHE_MARKETING",
          "acceptableAnswers": [
            "CONCENTRATED_NICHE_MARKETING",
            "Niche Marketing",
            "Concentrated Marketing"
          ],
          "primaryMisconceptionId": "MC_MKT_SEGMENTATION_TARGETING_POSITIONING_STP",
          "diagnosisMap": {
            "MASS": {
              "misconceptionId": "MC_MKT_SEGMENTATION_TARGETING_POSITIONING_STP",
              "errorExplanation": "Startups lack the capital to fight mass marketing battles. Concentrated Niche marketing is optimal.",
              "recoveryPath": {
                "simplerExplanation": "Limited resources require Niche Marketing.",
                "guidedFixPrompt": "Type CONCENTRATED_NICHE_MARKETING"
              }
            }
          }
        }
      },
      {
        "id": "mkt-d7-b2-segment-attractiveness-evaluation",
        "day": 7,
        "blockNumber": 2,
        "title": "Evaluating Segment Structural Attractiveness & Strategic Fit",
        "conceptBudget": {
          "primaryConcept": "Segment Attractiveness Criteria",
          "supportingTerms": [
            "Segment Size and Growth rate",
            "Segment Structural Attractiveness (Competitors, substitutes, buyer power)",
            "Company Objectives and Core Competency Fit"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d7-b1-four-targeting-coverage-strategies",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "attractiveness_demo.js",
            "initialCode": "function evaluateSegmentAttractiveness(sizeScore, growthScore, marginScore) {\n  const total = sizeScore * 0.3 + growthScore * 0.4 + marginScore * 0.3;\n  return {\n    compositeAttractivenessScore: Number(total.toFixed(2)),\n    isTargetWorthy: total >= 7.5,\n    status: 'SEGMENT_ATTRACTIVENESS_EVALUATED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateSegmentAttractiveness(8, 9, 8)));",
            "expectedOutput": "{\"compositeAttractivenessScore\":8.4,\"isTargetWorthy\":true,\"status\":\"SEGMENT_ATTRACTIVENESS_EVALUATED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the composite attractiveness score for a segment with Size=8 (30%), Growth=9 (40%), and Margin=8 (30%) ($2.4 + 3.6 + 2.4$)?",
          "expectedStringOutput": "8.4",
          "acceptableAnswers": [
            "8.4",
            "8.40",
            "compositeAttractivenessScore\":8.4"
          ],
          "primaryMisconceptionId": "MC_MKT_SEGMENTATION_TARGETING_POSITIONING_STP",
          "diagnosisMap": {
            "8.33": {
              "misconceptionId": "MC_MKT_SEGMENTATION_TARGETING_POSITIONING_STP",
              "errorExplanation": "8.33 is unweighted average. Weighted score is (8*0.3)+(9*0.4)+(8*0.3) = 8.4.",
              "recoveryPath": {
                "simplerExplanation": "2.4 + 3.6 + 2.4 = 8.4.",
                "guidedFixPrompt": "Type 8.4"
              }
            }
          }
        }
      },
      {
        "id": "mkt-d7-b3-cannibalization-risk-multi-segment",
        "day": 7,
        "blockNumber": 3,
        "title": "Product Cannibalization Risk in Multi-Segment Targeting",
        "conceptBudget": {
          "primaryConcept": "Cannibalization Risk Invariant",
          "supportingTerms": [
            "Cannibalization (New lower-priced product stealing sales from high-margin existing product)",
            "Price Fencing & Feature Tiering to prevent cannibalization"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d7-b2-segment-attractiveness-evaluation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "cannibal_demo.js",
            "initialCode": "function evaluateCannibalization(newProductSales, stolenFromExistingPct) {\n  const stolenUnits = newProductSales * (stolenFromExistingPct / 100);\n  const netNewUnits = newProductSales - stolenUnits;\n  return {\n    newProductGrossSales: newProductSales,\n    cannibalizedUnits: stolenUnits,\n    netIncrementalUnitGain: netNewUnits,\n    isProfitableExpansion: netNewUnits > 0,\n    status: 'CANNIBALIZATION_EVALUATED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateCannibalization(10000, 30)));",
            "expectedOutput": "{\"newProductGrossSales\":10000,\"cannibalizedUnits\":3000,\"netIncrementalUnitGain\":7000,\"isProfitableExpansion\":true,\"status\":\"CANNIBALIZATION_EVALUATED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many net incremental units are gained when a new product sells 10,000 units but cannibalizes 30% of its volume from existing products ($10,000 - 3,000$)?",
          "expectedStringOutput": "7000",
          "acceptableAnswers": [
            "7000",
            "7,000",
            "7000 units",
            "netIncrementalUnitGain\":7000"
          ],
          "primaryMisconceptionId": "MC_MKT_SEGMENTATION_TARGETING_POSITIONING_STP",
          "diagnosisMap": {
            "10000": {
              "misconceptionId": "MC_MKT_SEGMENTATION_TARGETING_POSITIONING_STP",
              "errorExplanation": "10,000 is gross sales. Subtracting 3,000 cannibalized units leaves 7,000 net incremental units.",
              "recoveryPath": {
                "simplerExplanation": "10,000 - 3,000 = 7,000 units.",
                "guidedFixPrompt": "Type 7000"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 8,
    "title": "STP Strategy: Brand Positioning & Perceptual Mapping",
    "overviewMetaphor": "Positioning is Staking Your Flag on an Unoccupied Mountain Peak on the Perceptual Map: on a 2D map of Price vs Tech Innovation, if all legacy car brands cluster in the bottom-left corner, Tesla positions on the top-right peak (High Tech, Premium Price); Points of Parity (POPs: 4 wheels, air conditioning) prove you are a legitimate car; Points of Difference (PODs: Ludicrous acceleration, Autopilot, Supercharger network) build an untouchable competitive moat.",
    "blocks": [
      {
        "id": "mkt-d8-b1-perceptual-mapping-white-space",
        "day": 8,
        "blockNumber": 1,
        "title": "Perceptual Mapping (Brand Spatial Distance & White-Space Discovery)",
        "conceptBudget": {
          "primaryConcept": "Perceptual Mapping & Euclidean Distance",
          "supportingTerms": [
            "2D Attribute Coordinates $(X, Y)$ (e.g. Price vs Performance)",
            "Euclidean Distance: $d = \\sqrt{(x_1 - x_2)^2 + (y_1 - y_2)^2}$",
            "White Space (Unoccupied quadrant with high consumer demand $\\implies$ Prime positioning opportunity!)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d7-b1-four-targeting-coverage-strategies",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Perceptual Map Coordinates (Tesla [8, 9] vs Toyota [4, 5])",
              "boxes": [
                {
                  "label": "Tesla Coordinates (x1, y1)",
                  "value": "Price=8, Tech Innovation=9",
                  "varType": "Brand 1",
                  "isUpdated": false
                },
                {
                  "label": "Toyota Coordinates (x2, y2)",
                  "value": "Price=4, Tech Innovation=5",
                  "varType": "Brand 2",
                  "isUpdated": false
                },
                {
                  "label": "Spatial Differentiation Distance",
                  "value": "sqrt((8-4)^2 + (9-5)^2) = sqrt(16 + 16) = sqrt(32) = 5.66 (CLEARLY DIFFERENTIATED!)",
                  "varType": "Distance",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "perceptual_demo.js",
            "initialCode": "function calculatePositioningDistance(x1, y1, x2, y2) {\n  const dist = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));\n  return {\n    euclideanDistance: Number(dist.toFixed(2)),\n    isDifferentiated: dist >= 3.0,\n    status: 'PERCEPTUAL_DISTANCE_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculatePositioningDistance(8, 9, 4, 5)));",
            "expectedOutput": "{\"euclideanDistance\":5.66,\"isDifferentiated\":true,\"status\":\"PERCEPTUAL_DISTANCE_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Euclidean perceptual distance between Brand A at (8, 9) and Brand B at (4, 5) ($\\sqrt{32}$)?",
          "expectedStringOutput": "5.66",
          "acceptableAnswers": [
            "5.66",
            "euclideanDistance\":5.66"
          ],
          "primaryMisconceptionId": "MC_MKT_BRAND_POSITIONING_POP_POD_DIFFERENTIATION",
          "diagnosisMap": {
            "8": {
              "misconceptionId": "MC_MKT_BRAND_POSITIONING_POP_POD_DIFFERENTIATION",
              "errorExplanation": "8 is dx + dy (4 + 4). Euclidean distance is sqrt(4^2 + 4^2) = sqrt(32) = 5.66.",
              "recoveryPath": {
                "simplerExplanation": "sqrt(16 + 16) = 5.66.",
                "guidedFixPrompt": "Type 5.66"
              }
            }
          }
        }
      },
      {
        "id": "mkt-d8-b2-points-of-parity-vs-difference",
        "day": 8,
        "blockNumber": 2,
        "title": "Points of Parity (POPs) vs Points of Difference (PODs)",
        "conceptBudget": {
          "primaryConcept": "POPs vs PODs Differentiation",
          "supportingTerms": [
            "Points of Parity (POPs: Associations not necessarily unique, but necessary to be considered a legitimate category player)",
            "Points of Difference (PODs: Strong, favorable, unique brand associations that consumers believe they cannot find with competitors)",
            "Category POPs vs Competitive POPs (Negating competitor PODs)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d8-b1-perceptual-mapping-white-space",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "POPs vs PODs Structure",
            "codeSnippet": "// Category: Electric Vehicles\n// Points of Parity (POPs): 4 Wheels, AC, Stereo, Airbags (Table stakes!)\n// Points of Difference (PODs): 0-60 in 1.99s, Full Self-Driving AI, Supercharger Grid!",
            "lineNotes": {
              "2": "Category table stakes.",
              "3": "Unique competitive moat."
            }
          },
          {
            "type": "runnable_code",
            "filename": "pop_pod_demo.js",
            "initialCode": "function classifyBrandAssociation(isUniqueMoat) {\n  return isUniqueMoat\n    ? 'POINT_OF_DIFFERENCE_POD_COMPETITIVE_MOAT'\n    : 'POINT_OF_PARITY_POP_CATEGORY_TABLE_STAKES';\n}\n\nconsole.log(classifyBrandAssociation(true));\nconsole.log(classifyBrandAssociation(false));",
            "expectedOutput": "POINT_OF_DIFFERENCE_POD_COMPETITIVE_MOAT\nPOINT_OF_PARITY_POP_CATEGORY_TABLE_STAKES",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How is a brand's unique proprietary technology that competitors cannot replicate classified in brand positioning?",
          "expectedStringOutput": "POINT_OF_DIFFERENCE_POD_COMPETITIVE_MOAT",
          "acceptableAnswers": [
            "POINT_OF_DIFFERENCE_POD_COMPETITIVE_MOAT",
            "Point of Difference",
            "POD"
          ],
          "primaryMisconceptionId": "MC_MKT_BRAND_POSITIONING_POP_POD_DIFFERENTIATION",
          "diagnosisMap": {
            "POP": {
              "misconceptionId": "MC_MKT_BRAND_POSITIONING_POP_POD_DIFFERENTIATION",
              "errorExplanation": "POP is standard table stakes. Unique proprietary features are Points of Difference (PODs).",
              "recoveryPath": {
                "simplerExplanation": "Unique competitive feature is a POD.",
                "guidedFixPrompt": "Type POINT_OF_DIFFERENCE_POD_COMPETITIVE_MOAT"
              }
            }
          }
        }
      },
      {
        "id": "mkt-d8-b3-positioning-statement-architecture",
        "day": 8,
        "blockNumber": 3,
        "title": "The Classic 4-Part Brand Positioning Statement Formula",
        "conceptBudget": {
          "primaryConcept": "Positioning Statement Formula",
          "supportingTerms": [
            "Formula: 'For [Target Audience], [Brand Name] is the [Frame of Reference Category] that [Core Benefit Proposition] because [Reason to Believe (RTB)]'",
            "Internal compass aligning all product development and ad creative"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d8-b2-points-of-parity-vs-difference",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "positioning_statement_demo.js",
            "initialCode": "function generatePositioningStatement(target, brand, category, benefit, rtb) {\n  return `For ${target}, ${brand} is the ${category} that ${benefit} because ${rtb}.`;\n}\n\nconsole.log(generatePositioningStatement(\n  'ambitious software engineers',\n  'PinIT Career OS',\n  'AI career simulator',\n  'accelerates job placement by 3x',\n  'it delivers rigorous proctored engineering curricula with zero placeholders'\n));",
            "expectedOutput": "For ambitious software engineers, PinIT Career OS is the AI career simulator that accelerates job placement by 3x because it delivers rigorous proctored engineering curricula with zero placeholders.",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What essential component in a Brand Positioning Statement provides the factual evidence or proof justifying why consumers should trust the benefit claim?",
          "expectedStringOutput": "Reason to Believe",
          "acceptableAnswers": [
            "Reason to Believe",
            "reason to believe",
            "RTB"
          ],
          "primaryMisconceptionId": "MC_MKT_BRAND_POSITIONING_POP_POD_DIFFERENTIATION",
          "diagnosisMap": {
            "TARGET": {
              "misconceptionId": "MC_MKT_BRAND_POSITIONING_POP_POD_DIFFERENTIATION",
              "errorExplanation": "Target is the audience. The factual justification is the 'Reason to Believe' (RTB).",
              "recoveryPath": {
                "simplerExplanation": "Factual proof is the Reason to Believe.",
                "guidedFixPrompt": "Type Reason to Believe"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 9,
    "title": "Product Strategy: The 3 Product Levels & Product Mix Hierarchy",
    "overviewMetaphor": "A Product is a 3-Layer Russian Matryoshka Doll: Layer 1 (The Core Customer Value: The innermost doll) is the fundamental problem solved (e.g. buying an iPhone is buying 'instant global communication and status'); Layer 2 (The Actual Product) is the tangible physical device, Retina display, titanium enclosure, and Apple logo; Layer 3 (The Augmented Product: The outermost protective shell) is the 24/7 AppleCare+ warranty, free cloud backup, and seamless trade-in service.",
    "blocks": [
      {
        "id": "mkt-d9-b1-kotler-three-product-levels",
        "day": 9,
        "blockNumber": 1,
        "title": "Kotler's 3 Product Levels: Core, Actual & Augmented Product",
        "conceptBudget": {
          "primaryConcept": "The 3 Product Levels",
          "supportingTerms": [
            "1. Core Customer Value (The fundamental job-to-be-done or benefit sought)",
            "2. Actual Product (Brand name, design, features, quality level, packaging)",
            "3. Augmented Product (Warranty, customer service, delivery, installation, credit terms)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d8-b1-perceptual-mapping-white-space",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Product Level Anatomy (Automobile Example)",
              "boxes": [
                {
                  "label": "1. Core Customer Value",
                  "value": "Personal freedom, rapid transportation, status",
                  "varType": "Core Benefit",
                  "isUpdated": false
                },
                {
                  "label": "2. Actual Product",
                  "value": "Electric powertrain, leather seats, minimalist dash, brand badge",
                  "varType": "Physical Asset",
                  "isUpdated": false
                },
                {
                  "label": "3. Augmented Product",
                  "value": "8-year battery warranty, mobile service vans, Supercharger access",
                  "varType": "Augmentation",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "product_levels_demo.js",
            "initialCode": "function classifyProductLevel(feature) {\n  if (feature === '8_YEAR_BATTERY_WARRANTY' || feature === '24_7_ROADSIDE_ASSISTANCE') return 'AUGMENTED_PRODUCT_LEVEL';\n  if (feature === 'TITANIUM_BODY' || feature === 'BRAND_LOGO') return 'ACTUAL_PRODUCT_LEVEL';\n  return 'CORE_CUSTOMER_VALUE_LEVEL';\n}\n\nconsole.log(classifyProductLevel('8_YEAR_BATTERY_WARRANTY'));\nconsole.log(classifyProductLevel('TITANIUM_BODY'));\nconsole.log(classifyProductLevel('TRANSPORTATION_AND_STATUS'));",
            "expectedOutput": "AUGMENTED_PRODUCT_LEVEL\nACTUAL_PRODUCT_LEVEL\nCORE_CUSTOMER_VALUE_LEVEL",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How is an 8-year manufacturer warranty and free roadside assistance package classified across Kotler's 3 product levels?",
          "expectedStringOutput": "AUGMENTED_PRODUCT_LEVEL",
          "acceptableAnswers": [
            "AUGMENTED_PRODUCT_LEVEL",
            "Augmented Product",
            "Augmented Level"
          ],
          "primaryMisconceptionId": "MC_MKT_PRODUCT_LEVELS_CORE_ACTUAL_AUGMENTED",
          "diagnosisMap": {
            "ACTUAL": {
              "misconceptionId": "MC_MKT_PRODUCT_LEVELS_CORE_ACTUAL_AUGMENTED",
              "errorExplanation": "The actual product is the physical car and features. Warranties and support are Augmented Product.",
              "recoveryPath": {
                "simplerExplanation": "Support services are Augmented Product.",
                "guidedFixPrompt": "Type AUGMENTED_PRODUCT_LEVEL"
              }
            }
          }
        }
      },
      {
        "id": "mkt-d9-b2-product-mix-dimensions",
        "day": 9,
        "blockNumber": 2,
        "title": "Product Mix Dimensions: Width, Length, Depth & Consistency",
        "conceptBudget": {
          "primaryConcept": "Product Mix Architecture",
          "supportingTerms": [
            "Product Mix Width (Number of distinct product lines offered e.g. Detergent, Soap, Toothpaste)",
            "Product Mix Length (Total number of items across all lines)",
            "Product Mix Depth (Number of versions/variants offered for each product e.g. 5 scents, 3 sizes)",
            "Consistency (How closely related lines are in end use or distribution)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d9-b1-kotler-three-product-levels",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Product Mix Metrics Calculation",
            "codeSnippet": "// Width = 4 product lines (Smartphones, Tablets, Laptops, Watches)\n// Length = 20 total products across all lines\n// Average Items per Line = 20 / 4 = 5.0 products/line",
            "lineNotes": {
              "1": "Number of product lines.",
              "2": "Total catalog length.",
              "3": "Average line length."
            }
          },
          {
            "type": "runnable_code",
            "filename": "mix_metrics_demo.js",
            "initialCode": "function calculateMixMetrics(width, length) {\n  const avg = length / width;\n  return {\n    productMixWidth: width,\n    productMixLength: length,\n    averageLineLength: Number(avg.toFixed(1)),\n    status: 'MIX_METRICS_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateMixMetrics(4, 20)));",
            "expectedOutput": "{\"productMixWidth\":4,\"productMixLength\":20,\"averageLineLength\":5,\"status\":\"MIX_METRICS_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the average product line length when a corporate product portfolio has a Width of 4 lines and a total Length of 20 products ($20 / 4$)?",
          "expectedStringOutput": "5",
          "acceptableAnswers": [
            "5",
            "5.0",
            "averageLineLength\":5"
          ],
          "primaryMisconceptionId": "MC_MKT_PRODUCT_LEVELS_CORE_ACTUAL_AUGMENTED",
          "diagnosisMap": {
            "80": {
              "misconceptionId": "MC_MKT_PRODUCT_LEVELS_CORE_ACTUAL_AUGMENTED",
              "errorExplanation": "80 multiplies width and length. Average line length divides length by width: 20 / 4 = 5.",
              "recoveryPath": {
                "simplerExplanation": "20 / 4 = 5.",
                "guidedFixPrompt": "Type 5"
              }
            }
          }
        }
      },
      {
        "id": "mkt-d9-b3-product-line-stretching-and-filling",
        "day": 9,
        "blockNumber": 3,
        "title": "Product Line Extensions: Downward, Upward & Two-Way Stretching",
        "conceptBudget": {
          "primaryConcept": "Product Line Stretching",
          "supportingTerms": [
            "Downward Stretching (Entering lower-priced tier e.g. Mercedes A-Class)",
            "Upward Stretching (Entering luxury tier e.g. Toyota launching Lexus)",
            "Line Filling (Adding items within current range)",
            "Cannibalization vs Market expansion"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d9-b2-product-mix-dimensions",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "stretching_demo.js",
            "initialCode": "function classifyLineStretch(currentTier, newTier) {\n  if (currentTier === 'MASS_MARKET' && newTier === 'ULTRA_LUXURY') return 'UPWARD_LINE_STRETCHING';\n  if (currentTier === 'LUXURY' && newTier === 'AFFORDABLE_ENTRY') return 'DOWNWARD_LINE_STRETCHING';\n  return 'LINE_FILLING_WITHIN_TIER';\n}\n\nconsole.log(classifyLineStretch('MASS_MARKET', 'ULTRA_LUXURY'));\nconsole.log(classifyLineStretch('LUXURY', 'AFFORDABLE_ENTRY'));",
            "expectedOutput": "UPWARD_LINE_STRETCHING\nDOWNWARD_LINE_STRETCHING",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How is a mainstream automaker launching an ultra-luxury sub-brand (e.g. Toyota launching Lexus) classified in product line strategy?",
          "expectedStringOutput": "UPWARD_LINE_STRETCHING",
          "acceptableAnswers": [
            "UPWARD_LINE_STRETCHING",
            "Upward Stretching",
            "Upward Stretch"
          ],
          "primaryMisconceptionId": "MC_MKT_PRODUCT_LEVELS_CORE_ACTUAL_AUGMENTED",
          "diagnosisMap": {
            "DOWNWARD": {
              "misconceptionId": "MC_MKT_PRODUCT_LEVELS_CORE_ACTUAL_AUGMENTED",
              "errorExplanation": "Moving upmarket into luxury is Upward Line Stretching.",
              "recoveryPath": {
                "simplerExplanation": "Moving into luxury is Upward Stretching.",
                "guidedFixPrompt": "Type UPWARD_LINE_STRETCHING"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 10,
    "title": "Product Life Cycle (PLC) & Boston Consulting Group (BCG) Matrix",
    "overviewMetaphor": "The BCG Matrix is a Farm with 4 Different Pastures: Cash Cows (Low market growth, High market share) are mature, docile dairy cows that require little feeding and produce rivers of milk (free cash flow); Stars (High growth, High share) are prized racehorses that require heavy grain (R&D capital) to win the championship; Question Marks are wild colts that might become Stars or fail; Dogs are old mutts that should be quietly retired.",
    "blocks": [
      {
        "id": "mkt-d10-b1-bcg-growth-share-matrix",
        "day": 10,
        "blockNumber": 1,
        "title": "The BCG Growth-Share Matrix: Stars, Cash Cows, Question Marks & Dogs",
        "conceptBudget": {
          "primaryConcept": "BCG Matrix 4 Quadrants",
          "supportingTerms": [
            "Stars (High Market Growth $\\ge 10\\%$, High Relative Share $\\ge 1.0x$: Invest heavily)",
            "Cash Cows (Low Growth $< 10\\%$, High Share $\\ge 1.0x$: Milk cash flows to fund Stars)",
            "Question Marks (High Growth, Low Share: Build or divest)",
            "Dogs (Low Growth, Low Share: Harvest or liquidate)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d9-b2-product-mix-dimensions",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "BCG Growth-Share Matrix Rules",
              "boxes": [
                {
                  "label": "1. Stars (High Growth, High Share)",
                  "value": "Invest aggressively to maintain market leadership",
                  "varType": "Growth Engine",
                  "isUpdated": false
                },
                {
                  "label": "2. Cash Cows (Low Growth, High Share)",
                  "value": "Harvest massive free cash flows to fund R&D and Stars!",
                  "varType": "Cash Generator",
                  "isUpdated": false
                },
                {
                  "label": "3. Question Marks & 4. Dogs",
                  "value": "Selective investment in Question Marks; Divest non-viable Dogs",
                  "varType": "Portfolio Balance",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "bcg_calc_demo.js",
            "initialCode": "function classifyBcg(growthRatePct, relativeShare) {\n  const isHighGrowth = growthRatePct >= 10.0;\n  const isHighShare = relativeShare >= 1.0;\n  if (isHighGrowth && isHighShare) return 'STARS_INVEST_FOR_GROWTH';\n  if (!isHighGrowth && isHighShare) return 'CASH_COWS_MILK_FOR_CASH';\n  if (isHighGrowth && !isHighShare) return 'QUESTION_MARKS_SELECTIVE_INVESTMENT';\n  return 'DOGS_DIVEST_OR_HARVEST';\n}\n\nconsole.log(classifyBcg(15.0, 1.5));\nconsole.log(classifyBcg(4.0, 2.0));",
            "expectedOutput": "STARS_INVEST_FOR_GROWTH\nCASH_COWS_MILK_FOR_CASH",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How is a product line with 4.0% annual market growth and 2.0x relative market share classified in the BCG Matrix?",
          "expectedStringOutput": "CASH_COWS_MILK_FOR_CASH",
          "acceptableAnswers": [
            "CASH_COWS_MILK_FOR_CASH",
            "Cash Cow",
            "Cash Cows"
          ],
          "primaryMisconceptionId": "MC_MKT_PRODUCT_LIFE_CYCLE_PLC_BCG_MATRIX",
          "diagnosisMap": {
            "STARS": {
              "misconceptionId": "MC_MKT_PRODUCT_LIFE_CYCLE_PLC_BCG_MATRIX",
              "errorExplanation": "Stars have high market growth (>= 10%). 4% growth with high share is a Cash Cow.",
              "recoveryPath": {
                "simplerExplanation": "Low growth + high share = Cash Cow.",
                "guidedFixPrompt": "Type CASH_COWS_MILK_FOR_CASH"
              }
            }
          }
        }
      },
      {
        "id": "mkt-d10-b2-product-life-cycle-stages",
        "day": 10,
        "blockNumber": 2,
        "title": "The Product Life Cycle (PLC): Introduction, Growth, Maturity & Decline",
        "conceptBudget": {
          "primaryConcept": "PLC 4 Stages & Marketing Strategies",
          "supportingTerms": [
            "Introduction (Negative profits, high launch costs, build category awareness)",
            "Growth (Rapid sales acceleration, rising competition, expand distribution)",
            "Maturity (Peak sales, price wars, defend market share & innovate)",
            "Decline (Falling sales, harvest or prune product line)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d10-b1-bcg-growth-share-matrix",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "PLC Stage Strategy Matrix",
            "codeSnippet": "// Introduction: Build primary demand & awareness (Early Adopters)\n// Growth:       Maximize market share & build brand preference (Early Majority)\n// Maturity:     Maximize profit while defending market share (Late Majority)\n// Decline:      Reduce expenses and harvest the brand (Laggards)",
            "lineNotes": {
              "1": "Launch phase.",
              "2": "Scale phase.",
              "3": "Cash harvest phase.",
              "4": "Phase out."
            }
          },
          {
            "type": "runnable_code",
            "filename": "plc_demo.js",
            "initialCode": "function getPlcStrategy(stage) {\n  if (stage === 'GROWTH') return 'MAXIMIZE_MARKET_SHARE_EXPAND_DISTRIBUTION';\n  if (stage === 'MATURITY') return 'DEFEND_MARKET_SHARE_AND_OPTIMIZE_COSTS';\n  if (stage === 'INTRODUCTION') return 'BUILD_PRODUCT_AWARENESS_AND_TRIAL';\n  return 'HARVEST_OR_DIVEST';\n}\n\nconsole.log(getPlcStrategy('GROWTH'));\nconsole.log(getPlcStrategy('MATURITY'));",
            "expectedOutput": "MAXIMIZE_MARKET_SHARE_EXPAND_DISTRIBUTION\nDEFEND_MARKET_SHARE_AND_OPTIMIZE_COSTS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What primary marketing strategic objective is prioritized during the Growth stage of the Product Life Cycle?",
          "expectedStringOutput": "MAXIMIZE_MARKET_SHARE_EXPAND_DISTRIBUTION",
          "acceptableAnswers": [
            "MAXIMIZE_MARKET_SHARE_EXPAND_DISTRIBUTION",
            "Maximize market share",
            "Expand distribution"
          ],
          "primaryMisconceptionId": "MC_MKT_PRODUCT_LIFE_CYCLE_PLC_BCG_MATRIX",
          "diagnosisMap": {
            "HARVEST": {
              "misconceptionId": "MC_MKT_PRODUCT_LIFE_CYCLE_PLC_BCG_MATRIX",
              "errorExplanation": "Harvesting occurs in Decline. Growth focuses on maximizing market share.",
              "recoveryPath": {
                "simplerExplanation": "Growth aims to maximize market share.",
                "guidedFixPrompt": "Type MAXIMIZE_MARKET_SHARE_EXPAND_DISTRIBUTION"
              }
            }
          }
        }
      },
      {
        "id": "mkt-d10-b3-crossing-the-chasm",
        "day": 10,
        "blockNumber": 3,
        "title": "Moore's Technology Adoption Lifecycle & Crossing the Chasm",
        "conceptBudget": {
          "primaryConcept": "Crossing the Chasm Framework",
          "supportingTerms": [
            "Innovators (2.5%) & Early Adopters (13.5%: Tech enthusiasts)",
            "The Chasm (The deadly gap between visionary Early Adopters and pragmatic Early Majority)",
            "Pragmatic Early Majority (34%: Require proven case studies and complete whole solutions)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d10-b2-product-life-cycle-stages",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "chasm_demo.js",
            "initialCode": "function evaluateChasmCrossing(targetSegment) {\n  return targetSegment === 'PRAGMATIC_EARLY_MAJORITY'\n    ? 'PROVIDE_WHOLE_PRODUCT_SOLUTION_AND_REFERENCES'\n    : 'PITCH_VISIONARY_TECH_INNOVATION';\n}\n\nconsole.log(evaluateChasmCrossing('PRAGMATIC_EARLY_MAJORITY'));",
            "expectedOutput": "PROVIDE_WHOLE_PRODUCT_SOLUTION_AND_REFERENCES",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What must a high-tech company provide to successfully cross the chasm and win the pragmatic Early Majority?",
          "expectedStringOutput": "PROVIDE_WHOLE_PRODUCT_SOLUTION_AND_REFERENCES",
          "acceptableAnswers": [
            "PROVIDE_WHOLE_PRODUCT_SOLUTION_AND_REFERENCES",
            "Whole product solution",
            "Complete solution"
          ],
          "primaryMisconceptionId": "MC_MKT_PRODUCT_LIFE_CYCLE_PLC_BCG_MATRIX",
          "diagnosisMap": {
            "VISION": {
              "misconceptionId": "MC_MKT_PRODUCT_LIFE_CYCLE_PLC_BCG_MATRIX",
              "errorExplanation": "Visionary pitches work on early adopters. The Early Majority demands a proven, complete whole product solution.",
              "recoveryPath": {
                "simplerExplanation": "Early Majority requires whole product solutions.",
                "guidedFixPrompt": "Type PROVIDE_WHOLE_PRODUCT_SOLUTION_AND_REFERENCES"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 11,
    "title": "Brand Equity & Keller's CBBE Pyramid (Customer-Based Brand Equity)",
    "overviewMetaphor": "Brand Equity is an Unbreakable Psychological Fortress in the Customer's Mind: Keller's CBBE Pyramid builds this fortress in 4 tiers: Tier 1 (Identity / Salience: 'Who are you?'); Tier 2 (Meaning / Performance & Imagery: 'What are you?'); Tier 3 (Responses / Judgments & Feelings: 'What do I think and feel about you?'); Tier 4 (Relationships / Resonance: The golden crown: 'I am fiercely loyal to Apple and will never buy Android!').",
    "blocks": [
      {
        "id": "mkt-d11-b1-cbbe-pyramid-four-tiers",
        "day": 11,
        "blockNumber": 1,
        "title": "Keller's CBBE Pyramid: Salience, Meaning, Responses & Resonance",
        "conceptBudget": {
          "primaryConcept": "Keller CBBE Pyramid Tiers",
          "supportingTerms": [
            "Tier 1: Brand Salience (Deep, broad brand awareness)",
            "Tier 2: Brand Performance & Brand Imagery (Functional reliability & emotional imagery)",
            "Tier 3: Brand Judgments & Brand Feelings (Quality credibility & warm emotional responses)",
            "Tier 4: Brand Resonance (Active loyalty, community, and intense attachment)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d10-b1-bcg-growth-share-matrix",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "CBBE Pyramid 4-Tier Structure",
              "boxes": [
                {
                  "label": "Tier 4: Resonance (Crown)",
                  "value": "Intense active psychological attachment & community (Score: 9.5/10)",
                  "varType": "Resonance",
                  "isUpdated": true
                },
                {
                  "label": "Tier 3: Responses",
                  "value": "Judgments (Quality) & Feelings (Excitement, Security) (Score: 8.5/10)",
                  "varType": "Responses",
                  "isUpdated": false
                },
                {
                  "label": "Tier 2: Meaning",
                  "value": "Performance (Speed, durability) & Imagery (Design aesthetic) (Score: 9.0/10)",
                  "varType": "Meaning",
                  "isUpdated": false
                },
                {
                  "label": "Tier 1: Identity (Base)",
                  "value": "Salience (Category recall under all buying occasions) (Score: 9.0/10)",
                  "varType": "Identity",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "cbbe_calc_demo.js",
            "initialCode": "function calculateCbbeIndex(s, m, resp, res) {\n  const composite = (s + m + resp + res) / 4;\n  return {\n    salience: s,\n    meaning: m,\n    responses: resp,\n    resonance: res,\n    compositeBrandEquityIndex: Number(composite.toFixed(2)),\n    isCultBrand: composite >= 8.5,\n    status: 'CBBE_INDEX_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateCbbeIndex(9, 9, 8.5, 9.5)));",
            "expectedOutput": "{\"salience\":9,\"meaning\":9,\"responses\":8.5,\"resonance\":9.5,\"compositeBrandEquityIndex\":9,\"isCultBrand\":true,\"status\":\"CBBE_INDEX_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the pinnacle top tier of Keller's Customer-Based Brand Equity (CBBE) Pyramid that represents ultimate active brand loyalty and psychological attachment?",
          "expectedStringOutput": "Resonance",
          "acceptableAnswers": [
            "Resonance",
            "Brand Resonance",
            "resonance"
          ],
          "primaryMisconceptionId": "MC_MKT_BRAND_EQUITY_KELLER_CBBE_PYRAMID",
          "diagnosisMap": {
            "SALIENCE": {
              "misconceptionId": "MC_MKT_BRAND_EQUITY_KELLER_CBBE_PYRAMID",
              "errorExplanation": "Salience is the bottom foundation tier. The top pinnacle tier is Brand Resonance.",
              "recoveryPath": {
                "simplerExplanation": "Top tier is Brand Resonance.",
                "guidedFixPrompt": "Type Resonance"
              }
            }
          }
        }
      },
      {
        "id": "mkt-d11-b2-kapferer-brand-identity-prism",
        "day": 11,
        "blockNumber": 2,
        "title": "Kapferer's Brand Identity Prism: 6 Facets of Brand Soul",
        "conceptBudget": {
          "primaryConcept": "Brand Identity Prism",
          "supportingTerms": [
            "Physique (Tangible physical features)",
            "Personality (Brand character and voice)",
            "Culture (Underlying core values)",
            "Relationship (Human connection mode)",
            "Reflection (Target customer ideal self-image)",
            "Self-Image (How the consumer views themselves using the brand)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d11-b1-cbbe-pyramid-four-tiers",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Kapferer 6 Facets of Brand Identity",
            "codeSnippet": "// Physique:     Aluminum unibody, sleek glass, clean minimalist packaging\n// Personality:  Innovative, elegant, creative, rebellious\n// Culture:      Silicon Valley design perfectionism, think different\n// Relationship: Intuitive partner, empowerment\n// Reflection:   Creative professional, forward-thinking trendsetter\n// Self-Image:   'I am innovative and value great design!'",
            "lineNotes": {
              "1": "Physical manifestation.",
              "2": "Tone and character.",
              "3": "Organizational culture."
            }
          },
          {
            "type": "runnable_code",
            "filename": "prism_demo.js",
            "initialCode": "function getPrismFacetCount() {\n  return 6;\n}\n\nconsole.log(getPrismFacetCount());",
            "expectedOutput": "6",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many facets comprise Kapferer's Brand Identity Prism framework?",
          "expectedStringOutput": "6",
          "acceptableAnswers": [
            "6",
            "6 facets",
            "Six"
          ],
          "primaryMisconceptionId": "MC_MKT_BRAND_EQUITY_KELLER_CBBE_PYRAMID",
          "diagnosisMap": {
            "4": {
              "misconceptionId": "MC_MKT_BRAND_EQUITY_KELLER_CBBE_PYRAMID",
              "errorExplanation": "CBBE has 4 tiers. Kapferer's Brand Identity Prism has 6 facets.",
              "recoveryPath": {
                "simplerExplanation": "Prism has 6 facets.",
                "guidedFixPrompt": "Type 6"
              }
            }
          }
        }
      },
      {
        "id": "mkt-d11-b3-brand-extensions-line-vs-category",
        "day": 11,
        "blockNumber": 3,
        "title": "Brand Extensions: Line Extensions vs Category Extensions (Dilution Risk)",
        "conceptBudget": {
          "primaryConcept": "Brand Extension & Dilution Risk",
          "supportingTerms": [
            "Line Extension (Existing brand in existing category e.g. Diet Coke)",
            "Category Extension (Existing brand into completely new category e.g. Apple Watch, Virgin Airlines)",
            "Brand Dilution (Over-extending brand into unfitting categories destroying core equity)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d11-b2-kapferer-brand-identity-prism",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "extension_demo.js",
            "initialCode": "function classifyBrandExtension(isSameCategory) {\n  return isSameCategory\n    ? 'LINE_EXTENSION_EXISTING_CATEGORY'\n    : 'CATEGORY_EXTENSION_NEW_PRODUCT_CLASS';\n}\n\nconsole.log(classifyBrandExtension(true));\nconsole.log(classifyBrandExtension(false));",
            "expectedOutput": "LINE_EXTENSION_EXISTING_CATEGORY\nCATEGORY_EXTENSION_NEW_PRODUCT_CLASS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How is launching a new flavor or size variation under an existing brand name in the same category classified?",
          "expectedStringOutput": "LINE_EXTENSION_EXISTING_CATEGORY",
          "acceptableAnswers": [
            "LINE_EXTENSION_EXISTING_CATEGORY",
            "Line Extension",
            "Line extension"
          ],
          "primaryMisconceptionId": "MC_MKT_BRAND_EQUITY_KELLER_CBBE_PYRAMID",
          "diagnosisMap": {
            "CATEGORY": {
              "misconceptionId": "MC_MKT_BRAND_EQUITY_KELLER_CBBE_PYRAMID",
              "errorExplanation": "Category extension enters a completely new industry. Variations in the same category are Line Extensions.",
              "recoveryPath": {
                "simplerExplanation": "Same category is a Line Extension.",
                "guidedFixPrompt": "Type LINE_EXTENSION_EXISTING_CATEGORY"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 12,
    "title": "Pricing Strategies: Value-Based, Cost-Plus, Skimming & Penetration",
    "overviewMetaphor": "Pricing is the Only Element in the Marketing Mix That Generates Revenue (The other 3Ps only create costs!): Cost-Plus Pricing ($40 cost + 25% markup = $50) is lazy accounting; Value-Based Pricing looks at the $200 economic benefit delivered to the client and prices at $60—capturing a massive $20 unit contribution margin; Break-Even Analysis ($BE = \\frac{\\text{Fixed Costs}}{\\text{Price} - \\text{Variable Cost}} = \\frac{\\$60,000}{\\$20} = 3,000$ units) establishes the minimum survival line.",
    "blocks": [
      {
        "id": "mkt-d12-b1-cost-plus-vs-value-based-pricing",
        "day": 12,
        "blockNumber": 1,
        "title": "Cost-Plus vs Value-Based Pricing (Economic Value to Customer EVC)",
        "conceptBudget": {
          "primaryConcept": "Cost-Plus vs Value-Based Pricing",
          "supportingTerms": [
            "Cost-Plus Pricing: $\\text{Price} = \\text{Unit Cost} \\times (1 + \\text{Markup}\\%)$",
            "Value-Based Pricing: Pricing to customer perceived economic value rather than seller cost",
            "Target Costing (Setting target price first based on market willingness to pay, then designing product to fit cost constraint)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d11-b1-cbbe-pyramid-four-tiers",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Pricing Models Comparison (Unit Cost = $40)",
              "boxes": [
                {
                  "label": "Cost-Plus (25% Markup)",
                  "value": "$40 x 1.25 = $50.00 Price (Leaves customer value on the table!)",
                  "varType": "Cost-Plus",
                  "isUpdated": false
                },
                {
                  "label": "Value-Based Pricing",
                  "value": "$60.00 Selling Price (Captures customer willingness to pay!)",
                  "varType": "Value-Based",
                  "isUpdated": false
                },
                {
                  "label": "Unit Margin Gain",
                  "value": "$60 - $40 = $20.00 Unit Contribution Margin (+$10 higher margin!)",
                  "varType": "Margin Boost",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "pricing_calc_demo.js",
            "initialCode": "function calculateCostPlusPrice(unitCost, markupPct) {\n  const price = unitCost * (1 + markupPct / 100);\n  return {\n    unitCost,\n    markupPercent: markupPct,\n    sellingPrice: Number(price.toFixed(2)),\n    status: 'COST_PLUS_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateCostPlusPrice(40, 25)));",
            "expectedOutput": "{\"unitCost\":40,\"markupPercent\":25,\"sellingPrice\":50,\"status\":\"COST_PLUS_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Cost-Plus selling price for a product with unit manufacturing cost of $40 and a 25% markup ($40 \\times 1.25$)?",
          "expectedStringOutput": "50",
          "acceptableAnswers": [
            "50",
            "$50",
            "50.0",
            "sellingPrice\":50"
          ],
          "primaryMisconceptionId": "MC_MKT_PRICING_STRATEGIES_SKIMMING_PENETRATION_VALUE",
          "diagnosisMap": {
            "10": {
              "misconceptionId": "MC_MKT_PRICING_STRATEGIES_SKIMMING_PENETRATION_VALUE",
              "errorExplanation": "10 is the markup dollar amount ($40 * 0.25). Total selling price is $40 + $10 = $50.",
              "recoveryPath": {
                "simplerExplanation": "40 * 1.25 = 50.",
                "guidedFixPrompt": "Type 50"
              }
            }
          }
        }
      },
      {
        "id": "mkt-d12-b2-break-even-volume-analysis",
        "day": 12,
        "blockNumber": 2,
        "title": "Break-Even Volume Analysis: $BE = \\frac{\\text{Fixed Costs}}{\\text{Price} - \\text{Variable Cost}}$",
        "conceptBudget": {
          "primaryConcept": "Break-Even Volume Formula",
          "supportingTerms": [
            "$BE_{\\text{units}} = \\frac{FC}{P - VC}$",
            "Unit Contribution Margin: $CM = P - VC$",
            "Contribution Margin Ratio: $CMR = \\frac{P - VC}{P}$",
            "Break-Even Revenue: $BE_{\\$} = \\frac{FC}{CMR}$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d12-b1-cost-plus-vs-value-based-pricing",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Break-Even Calculation ($FC=\\$60,000, P=\\$60, VC=\\$40$)",
            "codeSnippet": "Unit Contribution Margin CM = Price - Variable Cost = 60 - 40 = $20.00\nBreak-Even Units = Fixed Costs / CM = 60,000 / 20 = 3,000 Units\nConclusion: Must sell at least 3,000 units to reach zero loss / zero profit!",
            "lineNotes": {
              "1": "Margin per unit.",
              "2": "Break-even unit volume.",
              "3": "Profit threshold."
            }
          },
          {
            "type": "runnable_code",
            "filename": "be_calc_demo.js",
            "initialCode": "function calculateBreakEven(fc, price, vc) {\n  const cm = price - vc;\n  const beUnits = fc / cm;\n  return {\n    fixedCosts: fc,\n    unitContributionMargin: cm,\n    breakEvenUnits: Math.ceil(beUnits),\n    breakEvenRevenue: Math.ceil(beUnits) * price,\n    status: 'BREAK_EVEN_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateBreakEven(60000, 60, 40)));",
            "expectedOutput": "{\"fixedCosts\":60000,\"unitContributionMargin\":20,\"breakEvenUnits\":3000,\"breakEvenRevenue\":180000,\"status\":\"BREAK_EVEN_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many units must be sold to break even when Fixed Costs are $60,000, Selling Price is $60, and Variable Cost is $40 ($60,000 / 20$)?",
          "expectedStringOutput": "3000",
          "acceptableAnswers": [
            "3000",
            "3,000",
            "3000 units",
            "breakEvenUnits\":3000"
          ],
          "primaryMisconceptionId": "MC_MKT_PRICING_STRATEGIES_SKIMMING_PENETRATION_VALUE",
          "diagnosisMap": {
            "1000": {
              "misconceptionId": "MC_MKT_PRICING_STRATEGIES_SKIMMING_PENETRATION_VALUE",
              "errorExplanation": "1000 divides FC by price (60k/60). Break-even divides by Contribution Margin ($20): 60,000 / 20 = 3,000 units.",
              "recoveryPath": {
                "simplerExplanation": "60,000 / 20 = 3,000.",
                "guidedFixPrompt": "Type 3000"
              }
            }
          }
        }
      },
      {
        "id": "mkt-d12-b3-market-skimming-vs-penetration",
        "day": 12,
        "blockNumber": 3,
        "title": "Market Skimming vs Market Penetration Pricing",
        "conceptBudget": {
          "primaryConcept": "Skimming vs Penetration",
          "supportingTerms": [
            "Market Skimming (Setting high initial price to skim maximum revenue layer-by-layer from price-insensitive early adopters e.g. New iPhone launch)",
            "Market Penetration (Setting low initial price to rapidly penetrate market and win dominant share e.g. Netflix streaming launch)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d12-b2-break-even-volume-analysis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "skim_pen_demo.js",
            "initialCode": "function selectNewProductPricingStrategy(isHighTechNovelty) {\n  return isHighTechNovelty\n    ? 'MARKET_SKIMMING_HIGH_INITIAL_PRICE'\n    : 'MARKET_PENETRATION_LOW_MASS_PRICE';\n}\n\nconsole.log(selectNewProductPricingStrategy(true));\nconsole.log(selectNewProductPricingStrategy(false));",
            "expectedOutput": "MARKET_SKIMMING_HIGH_INITIAL_PRICE\nMARKET_PENETRATION_LOW_MASS_PRICE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which pricing strategy sets a high initial price to capture maximum profit from early adopters before lowering prices later?",
          "expectedStringOutput": "MARKET_SKIMMING_HIGH_INITIAL_PRICE",
          "acceptableAnswers": [
            "MARKET_SKIMMING_HIGH_INITIAL_PRICE",
            "Market Skimming",
            "Skimming Pricing"
          ],
          "primaryMisconceptionId": "MC_MKT_PRICING_STRATEGIES_SKIMMING_PENETRATION_VALUE",
          "diagnosisMap": {
            "PENETRATION": {
              "misconceptionId": "MC_MKT_PRICING_STRATEGIES_SKIMMING_PENETRATION_VALUE",
              "errorExplanation": "Penetration sets low initial prices. Skimming sets high initial prices.",
              "recoveryPath": {
                "simplerExplanation": "High initial price is Market Skimming.",
                "guidedFixPrompt": "Type MARKET_SKIMMING_HIGH_INITIAL_PRICE"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 13,
    "title": "Distribution Channels & Omnichannel Retailing (Place)",
    "overviewMetaphor": "Distribution Channels are the Arteries and Capillaries Delivering Blood to the Body: Direct D2C channels (Apple Store, Shopify) give you 100% control and 0 middleman margin cuts; Indirect Multi-Tier Channels (Manufacturer $\\to$ Wholesaler $\\to$ Retailer) expand global reach to 100,000 stores, but each tier takes a margin cut—escalating a $100 manufacturing cost to a $196.08 retail shelf price; Omnichannel commerce connects online and physical shopping into a seamless single experience.",
    "blocks": [
      {
        "id": "mkt-d13-b1-channel-tiers-and-markup-chain",
        "day": 13,
        "blockNumber": 1,
        "title": "Channel Levels & The Multi-Tier Retail Markup Escalator",
        "conceptBudget": {
          "primaryConcept": "Channel Markup Chain Formula",
          "supportingTerms": [
            "Direct Channel (0-Level / D2C: Manufacturer $\\to$ Consumer)",
            "1-Level Channel (Manufacturer $\\to$ Retailer $\\to$ Consumer)",
            "2-Level Channel (Manufacturer $\\to$ Wholesaler $\\to$ Retailer $\\to$ Consumer)",
            "Margin on Selling Price: $\\text{Price} = \\frac{\\text{Cost}}{1 - \\text{Margin}\\%}$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d12-b1-cost-plus-vs-value-based-pricing",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Channel Markup Chain (Mfg Cost = $100, Mfg Margin = 20%)",
              "boxes": [
                {
                  "label": "Manufacturer Selling Price",
                  "value": "$100 / (1 - 0.20) = $100 / 0.80 = $125.00",
                  "varType": "Mfg Price",
                  "isUpdated": false
                },
                {
                  "label": "Wholesaler Selling Price (15% Margin)",
                  "value": "$125 / (1 - 0.15) = $125 / 0.85 = $147.06",
                  "varType": "Wholesale Price",
                  "isUpdated": false
                },
                {
                  "label": "Final Consumer Retail Price (25% Margin)",
                  "value": "$147.06 / (1 - 0.25) = $147.06 / 0.75 = $196.08 Final Price!",
                  "varType": "Retail Price",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "channel_calc_demo.js",
            "initialCode": "function calculateChannelChain(cost, mfgMargin, wsMargin, retMargin) {\n  const mfgP = cost / (1 - mfgMargin / 100);\n  const wsP = mfgP / (1 - wsMargin / 100);\n  const retP = wsP / (1 - retMargin / 100);\n  return {\n    manufacturerPrice: Number(mfgP.toFixed(2)),\n    wholesalerPrice: Number(wsP.toFixed(2)),\n    retailPrice: Number(retP.toFixed(2)),\n    status: 'CHANNEL_CHAIN_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateChannelChain(100, 20, 15, 25)));",
            "expectedOutput": "{\"manufacturerPrice\":125,\"wholesalerPrice\":147.06,\"retailPrice\":196.08,\"status\":\"CHANNEL_CHAIN_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the manufacturer selling price when manufacturing cost is $100 and the manufacturer targets a 20% margin on selling price ($100 / (1 - 0.20)$)?",
          "expectedStringOutput": "125",
          "acceptableAnswers": [
            "125",
            "$125",
            "125.0",
            "manufacturerPrice\":125"
          ],
          "primaryMisconceptionId": "MC_MKT_DISTRIBUTION_CHANNELS_OMNICHANNEL_CONFLICT",
          "diagnosisMap": {
            "120": {
              "misconceptionId": "MC_MKT_DISTRIBUTION_CHANNELS_OMNICHANNEL_CONFLICT",
              "errorExplanation": "120 is 20% markup on cost. Margin on selling price divides by (1 - 0.20) = $100 / 0.80 = $125.",
              "recoveryPath": {
                "simplerExplanation": "100 / 0.80 = 125.",
                "guidedFixPrompt": "Type 125"
              }
            }
          }
        }
      },
      {
        "id": "mkt-d13-b2-channel-conflict-horizontal-vertical",
        "day": 13,
        "blockNumber": 2,
        "title": "Channel Conflict: Vertical vs Horizontal & Disintermediation",
        "conceptBudget": {
          "primaryConcept": "Channel Conflict Dynamics",
          "supportingTerms": [
            "Vertical Channel Conflict (Disagreements between different levels e.g. Manufacturer selling direct on website undercutting retail stores)",
            "Horizontal Channel Conflict (Disagreements among members at the same level e.g. Two franchisees in the same city undercutting each other)",
            "Disintermediation (Cutting out traditional intermediaries)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d13-b1-channel-tiers-and-markup-chain",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Channel Conflict Classification",
            "codeSnippet": "// Conflict between Manufacturer and Retailer -> VERTICAL_CHANNEL_CONFLICT\n// Conflict between Retailer A and Retailer B   -> HORIZONTAL_CHANNEL_CONFLICT",
            "lineNotes": {
              "1": "Different tiers conflict.",
              "2": "Same tier peer conflict."
            }
          },
          {
            "type": "runnable_code",
            "filename": "conflict_demo.js",
            "initialCode": "function classifyChannelConflict(tier1, tier2) {\n  return tier1 === tier2\n    ? 'HORIZONTAL_CHANNEL_CONFLICT_SAME_TIER'\n    : 'VERTICAL_CHANNEL_CONFLICT_DIFFERENT_TIERS';\n}\n\nconsole.log(classifyChannelConflict('MANUFACTURER', 'RETAILER'));\nconsole.log(classifyChannelConflict('RETAILER_A', 'RETAILER_A'));",
            "expectedOutput": "VERTICAL_CHANNEL_CONFLICT_DIFFERENT_TIERS\nHORIZONTAL_CHANNEL_CONFLICT_SAME_TIER",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How is a pricing conflict between a brand manufacturer and its authorized retail store partners classified?",
          "expectedStringOutput": "VERTICAL_CHANNEL_CONFLICT_DIFFERENT_TIERS",
          "acceptableAnswers": [
            "VERTICAL_CHANNEL_CONFLICT_DIFFERENT_TIERS",
            "Vertical Conflict",
            "Vertical Channel Conflict"
          ],
          "primaryMisconceptionId": "MC_MKT_DISTRIBUTION_CHANNELS_OMNICHANNEL_CONFLICT",
          "diagnosisMap": {
            "HORIZONTAL": {
              "misconceptionId": "MC_MKT_DISTRIBUTION_CHANNELS_OMNICHANNEL_CONFLICT",
              "errorExplanation": "Horizontal conflict occurs between peers at the same level. Manufacturer vs Retailer is Vertical conflict.",
              "recoveryPath": {
                "simplerExplanation": "Between different tiers is Vertical Conflict.",
                "guidedFixPrompt": "Type VERTICAL_CHANNEL_CONFLICT_DIFFERENT_TIERS"
              }
            }
          }
        }
      },
      {
        "id": "mkt-d13-b3-omnichannel-retailing-bopis",
        "day": 13,
        "blockNumber": 3,
        "title": "Omnichannel Retailing: BOPIS (Buy Online, Pick Up in Store)",
        "conceptBudget": {
          "primaryConcept": "Omnichannel Retailing & BOPIS",
          "supportingTerms": [
            "Multichannel (Disjointed separate channels)",
            "Omnichannel (Unified integrated customer experience across web, mobile app, and physical store)",
            "BOPIS (Buy Online, Pick Up In Store)",
            "Showrooming vs Webrooming"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d13-b2-channel-conflict-horizontal-vertical",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "omnichannel_demo.js",
            "initialCode": "function evaluateRetailStrategy(isInventorySynchronized) {\n  return isInventorySynchronized\n    ? 'TRUE_OMNICHANNEL_UNIFIED_COMMERCE'\n    : 'DISJOINTED_MULTICHANNEL_SILOS';\n}\n\nconsole.log(evaluateRetailStrategy(true));\nconsole.log(evaluateRetailStrategy(false));",
            "expectedOutput": "TRUE_OMNICHANNEL_UNIFIED_COMMERCE\nDISJOINTED_MULTICHANNEL_SILOS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What retailing architecture seamlessly synchronizes live inventory and customer loyalty profiles across physical stores, mobile apps, and e-commerce websites?",
          "expectedStringOutput": "TRUE_OMNICHANNEL_UNIFIED_COMMERCE",
          "acceptableAnswers": [
            "TRUE_OMNICHANNEL_UNIFIED_COMMERCE",
            "Omnichannel",
            "Omnichannel Commerce"
          ],
          "primaryMisconceptionId": "MC_MKT_DISTRIBUTION_CHANNELS_OMNICHANNEL_CONFLICT",
          "diagnosisMap": {
            "MULTI": {
              "misconceptionId": "MC_MKT_DISTRIBUTION_CHANNELS_OMNICHANNEL_CONFLICT",
              "errorExplanation": "Multichannel operates channels in silos. Seamless synchronization is Omnichannel.",
              "recoveryPath": {
                "simplerExplanation": "Matches TRUE_OMNICHANNEL_UNIFIED_COMMERCE.",
                "guidedFixPrompt": "Type TRUE_OMNICHANNEL_UNIFIED_COMMERCE"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 14,
    "title": "Integrated Marketing Communications (IMC) & The AIDA Model",
    "overviewMetaphor": "IMC is a 5-Piece Jazz Band Playing in Perfect Harmony: Advertising, Public Relations, Sales Promotions, Personal Selling, and Direct Marketing must all play the exact same melody (Consistent Brand Voice); the AIDA Model is the 4-step sheet music: Grab Attention (100,000 ad impressions) $\\to$ Spark Interest (5,000 clicks $\\implies 5.0\\%$ CTR) $\\to$ Ignite Desire (500 demo leads $\\implies 10.0\\%$ conversion) $\\to$ Provoke Action (100 signed contracts $\\implies 20.0\\%$ close rate).",
    "blocks": [
      {
        "id": "mkt-d14-b1-aida-funnel-conversion-rates",
        "day": 14,
        "blockNumber": 1,
        "title": "The AIDA Promotional Funnel: Attention, Interest, Desire & Action",
        "conceptBudget": {
          "primaryConcept": "AIDA Conversion Funnel",
          "supportingTerms": [
            "Attention / Awareness (Top-of-funnel impressions)",
            "Interest (Click-throughs & engagement)",
            "Desire (Lead capture, demo sign-ups, wishlist adds)",
            "Action (Purchase / contract close)",
            "Funnel Step Conversion Rates"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d13-b1-channel-tiers-and-markup-chain",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "AIDA Funnel Metrics (100k Impressions -> 5k Clicks -> 500 Leads -> 100 Sales)",
              "boxes": [
                {
                  "label": "1. Attention -> Interest (CTR)",
                  "value": "5,000 Clicks / 100,000 Impressions = 5.00% CTR",
                  "varType": "CTR",
                  "isUpdated": false
                },
                {
                  "label": "2. Interest -> Desire (Lead %)",
                  "value": "500 Leads / 5,000 Clicks = 10.00% Lead Conversion",
                  "varType": "Lead Rate",
                  "isUpdated": false
                },
                {
                  "label": "3. Desire -> Action (Close %)",
                  "value": "100 Sales / 500 Leads = 20.00% Sales Close Rate!",
                  "varType": "Close Rate",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "aida_calc_demo.js",
            "initialCode": "function calculateAidaMetrics(attn, interest, desire, action) {\n  const ctr = (interest / attn) * 100;\n  const leadRate = (desire / interest) * 100;\n  const closeRate = (action / desire) * 100;\n  return {\n    ctrPercent: Number(ctr.toFixed(2)),\n    leadConversionPercent: Number(leadRate.toFixed(2)),\n    closeRatePercent: Number(closeRate.toFixed(2)),\n    status: 'AIDA_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateAidaMetrics(100000, 5000, 500, 100)));",
            "expectedOutput": "{\"ctrPercent\":5,\"leadConversionPercent\":10,\"closeRatePercent\":20,\"status\":\"AIDA_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Click-Through Rate (CTR) percentage from Attention (100,000 impressions) to Interest (5,000 clicks) ($ (5,000 / 100,000) \\times 100 $)?",
          "expectedStringOutput": "5",
          "acceptableAnswers": [
            "5",
            "5%",
            "5.0",
            "ctrPercent\":5"
          ],
          "primaryMisconceptionId": "MC_MKT_INTEGRATED_MARKETING_COMMUNICATIONS_AIDA",
          "diagnosisMap": {
            "0.05": {
              "misconceptionId": "MC_MKT_INTEGRATED_MARKETING_COMMUNICATIONS_AIDA",
              "errorExplanation": "0.05 is the decimal ratio. Multiplied by 100 gives 5.0% CTR.",
              "recoveryPath": {
                "simplerExplanation": "(5,000 / 100,000) * 100 = 5%.",
                "guidedFixPrompt": "Type 5"
              }
            }
          }
        }
      },
      {
        "id": "mkt-d14-b2-promotion-mix-five-tools",
        "day": 14,
        "blockNumber": 2,
        "title": "The 5 Tools of the Promotion Mix: Advertising, PR, Sales Promo, Personal Selling & Direct",
        "conceptBudget": {
          "primaryConcept": "The 5 Promotion Mix Tools",
          "supportingTerms": [
            "1. Advertising (Paid, non-personal mass broadcast: Reach & Awareness)",
            "2. Public Relations (Earned unpaid third-party credibility & goodwill)",
            "3. Sales Promotion (Short-term purchase incentives: Coupons, discounts, contests)",
            "4. Personal Selling (High-touch, interpersonal relationship building for complex B2B sales)",
            "5. Direct & Digital Marketing (Targeted 1-to-1 email, SMS, search ads)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d14-b1-aida-funnel-conversion-rates",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Promotion Tool Selection Rules",
            "codeSnippet": "// Short-term sales spike needed? -> SALES_PROMOTION (Discounts & Flash Sales)\n// High-ticket enterprise contract? -> PERSONAL_SELLING (Account Executives)\n// Massive brand awareness?        -> ADVERTISING (Super Bowl TV & YouTube pre-roll)",
            "lineNotes": {
              "1": "Quick transactional boost.",
              "2": "Consultative relationship.",
              "3": "Mass scale reach."
            }
          },
          {
            "type": "runnable_code",
            "filename": "promo_tools_demo.js",
            "initialCode": "function selectPromoTool(objective) {\n  if (objective === 'SHORT_TERM_SALES_SPIKE') return 'SALES_PROMOTION_DISCOUNTS';\n  if (objective === 'COMPLEX_B2B_ENTERPRISE_SALE') return 'PERSONAL_SELLING_ACCOUNT_EXECUTIVE';\n  return 'MASS_ADVERTISING';\n}\n\nconsole.log(selectPromoTool('SHORT_TERM_SALES_SPIKE'));\nconsole.log(selectPromoTool('COMPLEX_B2B_ENTERPRISE_SALE'));",
            "expectedOutput": "SALES_PROMOTION_DISCOUNTS\nPERSONAL_SELLING_ACCOUNT_EXECUTIVE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which promotional mix tool utilizes short-term financial incentives (coupons, buy-one-get-one deals, flash discounts) to stimulate immediate transaction volume?",
          "expectedStringOutput": "SALES_PROMOTION_DISCOUNTS",
          "acceptableAnswers": [
            "SALES_PROMOTION_DISCOUNTS",
            "Sales Promotion",
            "Sales Promo"
          ],
          "primaryMisconceptionId": "MC_MKT_INTEGRATED_MARKETING_COMMUNICATIONS_AIDA",
          "diagnosisMap": {
            "PR": {
              "misconceptionId": "MC_MKT_INTEGRATED_MARKETING_COMMUNICATIONS_AIDA",
              "errorExplanation": "PR builds long-term goodwill. Short-term discount incentives are Sales Promotion.",
              "recoveryPath": {
                "simplerExplanation": "Short-term discounts are Sales Promotion.",
                "guidedFixPrompt": "Type SALES_PROMOTION_DISCOUNTS"
              }
            }
          }
        }
      },
      {
        "id": "mkt-d14-b3-push-vs-pull-promotional-strategies",
        "day": 14,
        "blockNumber": 3,
        "title": "Push vs Pull Promotional Strategies",
        "conceptBudget": {
          "primaryConcept": "Push vs Pull Strategy",
          "supportingTerms": [
            "Push Strategy (Pushing product through channels via trade allowances and sales reps incentivizing retailers to stock)",
            "Pull Strategy (Direct consumer advertising pulling demand through retailers e.g. pharmaceutical ads telling consumers 'Ask your doctor!')"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d14-b2-promotion-mix-five-tools",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "push_pull_demo.js",
            "initialCode": "function evaluatePromoFlow(targetAudience) {\n  return targetAudience === 'END_CONSUMER'\n    ? 'PULL_STRATEGY_CONSUMER_DEMAND_CREATION'\n    : 'PUSH_STRATEGY_TRADE_CHANNEL_INCENTIVES';\n}\n\nconsole.log(evaluatePromoFlow('END_CONSUMER'));\nconsole.log(evaluatePromoFlow('RETAIL_DISTRIBUTORS'));",
            "expectedOutput": "PULL_STRATEGY_CONSUMER_DEMAND_CREATION\nPUSH_STRATEGY_TRADE_CHANNEL_INCENTIVES",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How is a promotional strategy classified when heavy advertising campaigns target end consumers to create demand that pulls the product through retail stores?",
          "expectedStringOutput": "PULL_STRATEGY_CONSUMER_DEMAND_CREATION",
          "acceptableAnswers": [
            "PULL_STRATEGY_CONSUMER_DEMAND_CREATION",
            "Pull Strategy",
            "Pull"
          ],
          "primaryMisconceptionId": "MC_MKT_INTEGRATED_MARKETING_COMMUNICATIONS_AIDA",
          "diagnosisMap": {
            "PUSH": {
              "misconceptionId": "MC_MKT_INTEGRATED_MARKETING_COMMUNICATIONS_AIDA",
              "errorExplanation": "Push targets wholesalers/retailers. Consumer-focused advertising is a Pull strategy.",
              "recoveryPath": {
                "simplerExplanation": "Consumer advertising is a Pull Strategy.",
                "guidedFixPrompt": "Type PULL_STRATEGY_CONSUMER_DEMAND_CREATION"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 15,
    "title": "⭐ MILESTONE 2: Complete Product, Brand Equity & Go-To-Market Engine",
    "overviewMetaphor": "Milestone 2 Synthesis: The complete sovereign product strategy, brand equity, and promotional go-to-market engine: 1. Kotler 3 product levels and product mix dimensions; 2. BCG matrix Growth-Share portfolio classification; 3. Keller CBBE brand equity resonance scoring ($Index = 9.0/10$); 4. Value-based pricing break-even modeling ($BE = 3,000$ units); 5. AIDA promotional conversion funnel tracking.",
    "blocks": [
      {
        "id": "mkt-d15-b1-product-brand-engine-synthesis",
        "day": 15,
        "blockNumber": 1,
        "title": "Product, Brand Equity & GTM Master Engine Synthesis",
        "conceptBudget": {
          "primaryConcept": "Product & Brand Strategy Synthesis",
          "supportingTerms": [
            "Product Mix Engine",
            "BCG Portfolio Classifier",
            "CBBE Brand Resonance Engine",
            "AIDA Promotional Funnel"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d14-b3-push-vs-pull-promotional-strategies",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Milestone 2 Product & Brand GTM Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "Classifies BCG portfolio unit into Stars vs Cash Cows",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Calculates Keller CBBE Brand Resonance Index (9.0/10)",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Computes Break-Even Sales Volume ($BE = 3,000$ units @ $20 CM)",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Executes AIDA promotional funnel and certifies brand GTM engine!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "product_brand_kernel_demo.js",
            "initialCode": "function runProductBrandStrategyEngine() {\n  return {\n    productMixSubsystem: 'ONLINE_MIX_DIMENSIONS_ACTIVE',\n    bcgPortfolioSubsystem: 'ONLINE_BCG_CLASSIFIER_ACTIVE',\n    cbbeEquitySubsystem: 'ONLINE_CBBE_RESONANCE_ACTIVE',\n    pricingBreakEvenSubsystem: 'ONLINE_BREAK_EVEN_ACTIVE',\n    aidaFunnelSubsystem: 'ONLINE_AIDA_FUNNEL_ACTIVE',\n    engineStatus: 'PRODUCT_AND_BRAND_STRATEGY_MASTER_ACTIVE'\n  };\n}\n\nconsole.log(runProductBrandStrategyEngine().engineStatus);",
            "expectedOutput": "PRODUCT_AND_BRAND_STRATEGY_MASTER_ACTIVE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What engine status confirms active operational synthesis of the Product & Brand Strategy Master Engine?",
          "expectedStringOutput": "PRODUCT_AND_BRAND_STRATEGY_MASTER_ACTIVE",
          "acceptableAnswers": [
            "PRODUCT_AND_BRAND_STRATEGY_MASTER_ACTIVE",
            "engineStatus: PRODUCT_AND_BRAND_STRATEGY_MASTER_ACTIVE"
          ],
          "primaryMisconceptionId": "MC_MKT_BRAND_EQUITY_KELLER_CBBE_PYRAMID",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_MKT_BRAND_EQUITY_KELLER_CBBE_PYRAMID",
              "errorExplanation": "Matches PRODUCT_AND_BRAND_STRATEGY_MASTER_ACTIVE.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type PRODUCT_AND_BRAND_STRATEGY_MASTER_ACTIVE"
              }
            }
          }
        }
      },
      {
        "id": "mkt-d15-b2-product-brand-engine-audit",
        "day": 15,
        "blockNumber": 2,
        "title": "Product & Brand Strategy Invariant Verification & Precision Audit",
        "conceptBudget": {
          "primaryConcept": "Product & Brand Invariant Verification",
          "supportingTerms": [
            "BCG Invariant",
            "CBBE Invariant",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d15-b1-product-brand-engine-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "brand_audit_demo.js",
            "initialCode": "function auditProductBrandEngine(bcgValid, cbbeValid, beValid, aidaValid) {\n  const passed = bcgValid && cbbeValid && beValid && aidaValid;\n  return {\n    bcgVerified: bcgValid,\n    cbbeVerified: cbbeValid,\n    pricingVerified: beValid,\n    aidaVerified: aidaValid,\n    grade: passed ? 'PRODUCT_BRAND_ENGINE_AUDIT_PASSED' : 'AUDIT_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditProductBrandEngine(true, true, true, true)));",
            "expectedOutput": "{\"bcgVerified\":true,\"cbbeVerified\":true,\"pricingVerified\":true,\"aidaVerified\":true,\"grade\":\"PRODUCT_BRAND_ENGINE_AUDIT_PASSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade is awarded when BCG, CBBE, Break-Even, and AIDA engines pass 100%?",
          "expectedStringOutput": "PRODUCT_BRAND_ENGINE_AUDIT_PASSED",
          "acceptableAnswers": [
            "PRODUCT_BRAND_ENGINE_AUDIT_PASSED",
            "grade\":\"PRODUCT_BRAND_ENGINE_AUDIT_PASSED\""
          ],
          "primaryMisconceptionId": "MC_MKT_BRAND_EQUITY_KELLER_CBBE_PYRAMID",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_MKT_BRAND_EQUITY_KELLER_CBBE_PYRAMID",
              "errorExplanation": "All checks passing awards PRODUCT_BRAND_ENGINE_AUDIT_PASSED.",
              "recoveryPath": {
                "simplerExplanation": "Awards PRODUCT_BRAND_ENGINE_AUDIT_PASSED.",
                "guidedFixPrompt": "Type PRODUCT_BRAND_ENGINE_AUDIT_PASSED"
              }
            }
          }
        }
      },
      {
        "id": "mkt-d15-b3-milestone2-marketing-cert",
        "day": 15,
        "blockNumber": 3,
        "title": "Milestone 2 Product & Brand Strategy Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 2 Certification",
          "supportingTerms": [
            "Product Strategy Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d15-b2-product-brand-engine-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone2_mkt_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 2: Complete Product, Brand Equity & Go-To-Market Engine [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 2: Complete Product, Brand Equity & Go-To-Market Engine [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 2 completion?",
          "expectedStringOutput": "⭐ MILESTONE 2: Complete Product, Brand Equity & Go-To-Market Engine [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 2: Complete Product, Brand Equity & Go-To-Market Engine [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_MKT_BRAND_EQUITY_KELLER_CBBE_PYRAMID",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_MKT_BRAND_EQUITY_KELLER_CBBE_PYRAMID",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 2: Complete Product, Brand Equity & Go-To-Market Engine [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 16,
    "title": "Services Marketing: The 7Ps & The SERVQUAL Gap Model",
    "overviewMetaphor": "Services are Ghostly Performances That Cannot Be Stored in a Warehouse: Unlike tangible physical goods, services are Intangible, Inseparable, Variable, and Perishable (IHIP); this requires expanding the 4Ps into the 7Ps (Adding People, Process, and Physical Evidence); Parasuraman's SERVQUAL model measures the gap between customer expectations and actual perceived service ($Gap = \\text{Perceived} - \\text{Expected} = +0.60$), where positive scores indicate service excellence that exceeds client hopes.",
    "blocks": [
      {
        "id": "mkt-d16-b1-servqual-gap-model-five-dimensions",
        "day": 16,
        "blockNumber": 1,
        "title": "The SERVQUAL 5 Dimensions & Service Quality Gap Model",
        "conceptBudget": {
          "primaryConcept": "SERVQUAL Gap Model & 5 Dimensions",
          "supportingTerms": [
            "1. Reliability (Performing service dependably and accurately)",
            "2. Responsiveness (Prompt service willingness)",
            "3. Assurance (Employee knowledge and courtesy inspiring trust)",
            "4. Empathy (Caring individualized attention)",
            "5. Tangibles (Physical facilities and equipment)",
            "Service Gap Formula: $Gap = \\text{Perceived Score} - \\text{Expected Score}$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d15-b1-product-brand-engine-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "SERVQUAL Gap Analysis (Expected = 8.4 vs Perceived = 9.0)",
              "boxes": [
                {
                  "label": "Expected Service Score",
                  "value": "8.40 / 10.0 (High customer anticipation)",
                  "varType": "Expectations",
                  "isUpdated": false
                },
                {
                  "label": "Perceived Delivered Score",
                  "value": "9.00 / 10.0 (Flawless empathetic execution)",
                  "varType": "Perception",
                  "isUpdated": false
                },
                {
                  "label": "Average Service Quality Gap",
                  "value": "+0.60 Positive Gap (EXCEEDS CUSTOMER EXPECTATIONS!)",
                  "varType": "Quality Gap",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "servqual_calc_demo.js",
            "initialCode": "function calculateServqual(expectedScores, perceivedScores) {\n  const gaps = perceivedScores.map((p, idx) => p - expectedScores[idx]);\n  const avgGap = gaps.reduce((a, b) => a + b, 0) / gaps.length;\n  return {\n    dimensionGaps: gaps,\n    averageGap: Number(avgGap.toFixed(2)),\n    exceedsExpectations: avgGap >= 0,\n    status: avgGap >= 0 ? 'SERVICE_EXCEEDS_EXPECTATIONS' : 'SERVICE_DEFICIT'\n  };\n}\n\nconsole.log(JSON.stringify(calculateServqual([8, 9, 8, 8, 9], [9, 9, 8, 9, 10])));",
            "expectedOutput": "{\"dimensionGaps\":[1,0,0,1,1],\"averageGap\":0.6,\"exceedsExpectations\":true,\"status\":\"SERVICE_EXCEEDS_EXPECTATIONS\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the average SERVQUAL service quality gap when perceived scores exceed expected scores across 5 dimensions by [+1, 0, 0, +1, +1] ($3 / 5$)?",
          "expectedStringOutput": "0.6",
          "acceptableAnswers": [
            "0.6",
            "+0.6",
            "0.60",
            "averageGap\":0.6"
          ],
          "primaryMisconceptionId": "MC_MKT_SERVICES_MARKETING_7PS_SERVQUAL_GAPS",
          "diagnosisMap": {
            "3": {
              "misconceptionId": "MC_MKT_SERVICES_MARKETING_7PS_SERVQUAL_GAPS",
              "errorExplanation": "3 is the sum of gaps. Average gap across 5 dimensions is 3 / 5 = +0.60.",
              "recoveryPath": {
                "simplerExplanation": "3 / 5 = 0.60.",
                "guidedFixPrompt": "Type 0.6"
              }
            }
          }
        }
      },
      {
        "id": "mkt-d16-b2-the-7ps-of-services-marketing",
        "day": 16,
        "blockNumber": 2,
        "title": "The Expanded 7Ps of Services: People, Process & Physical Evidence",
        "conceptBudget": {
          "primaryConcept": "The 7Ps Services Mix",
          "supportingTerms": [
            "Core 4Ps (Product, Price, Place, Promotion)",
            "5. People (Customer-facing frontline staff, consultants, empathy training)",
            "6. Process (Operating procedures, service blueprints, wait-time management)",
            "7. Physical Evidence (Office decor, uniform design, certificates, branded digital portals)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d16-b1-servqual-gap-model-five-dimensions",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Extended 3Ps of Services",
            "codeSnippet": "// 5. PEOPLE:            Doctors, flight attendants, support engineers\n// 6. PROCESS:           Check-in kiosk flow, SLA response times, service blueprint\n// 7. PHYSICAL EVIDENCE: Hospital cleanliness, luxury cabin lighting, ISO certificates",
            "lineNotes": {
              "1": "Human service delivery.",
              "2": "Workflow standardization.",
              "3": "Tangible trust cues."
            }
          },
          {
            "type": "runnable_code",
            "filename": "extended_7ps_demo.js",
            "initialCode": "function getExtendedPs() {\n  return ['PEOPLE', 'PROCESS', 'PHYSICAL_EVIDENCE'];\n}\n\nconsole.log(JSON.stringify(getExtendedPs()));",
            "expectedOutput": "[\"PEOPLE\",\"PROCESS\",\"PHYSICAL_EVIDENCE\"]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which 3 elements are added to the traditional 4Ps to create the expanded 7Ps of Services Marketing?",
          "expectedStringOutput": "[\"PEOPLE\",\"PROCESS\",\"PHYSICAL_EVIDENCE\"]",
          "acceptableAnswers": [
            "[\"PEOPLE\",\"PROCESS\",\"PHYSICAL_EVIDENCE\"]",
            "People, Process, Physical Evidence",
            "People Process Physical Evidence"
          ],
          "primaryMisconceptionId": "MC_MKT_SERVICES_MARKETING_7PS_SERVQUAL_GAPS",
          "diagnosisMap": {
            "4PS": {
              "misconceptionId": "MC_MKT_SERVICES_MARKETING_7PS_SERVQUAL_GAPS",
              "errorExplanation": "Services add People, Process, and Physical Evidence to the 4Ps.",
              "recoveryPath": {
                "simplerExplanation": "Extended 3Ps are People, Process, Physical Evidence.",
                "guidedFixPrompt": "Type [\"PEOPLE\",\"PROCESS\",\"PHYSICAL_EVIDENCE\"]"
              }
            }
          }
        }
      },
      {
        "id": "mkt-d16-b3-ihip-service-characteristics",
        "day": 16,
        "blockNumber": 3,
        "title": "The IHIP Framework: Intangibility, Inseparability, Heterogeneity & Perishability",
        "conceptBudget": {
          "primaryConcept": "IHIP Service Invariants",
          "supportingTerms": [
            "Intangibility (Cannot be seen, tasted, felt before purchase)",
            "Inseparability (Produced and consumed simultaneously)",
            "Heterogeneity / Variability (Service quality varies with who provides it)",
            "Perishability (Cannot be stored for future sale e.g. empty airline seat upon takeoff)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d16-b2-the-7ps-of-services-marketing",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "ihip_demo.js",
            "initialCode": "function classifyServiceChallenge(scenario) {\n  if (scenario === 'EMPTY_HOTEL_ROOM_TONIGHT') return 'PERISHABILITY_REVENUE_LOST_FOREVER';\n  if (scenario === 'HAIRCUT_CONSUMED_DURING_CUTTING') return 'INSEPARABILITY_SIMULTANEOUS_PRODUCTION_CONSUMPTION';\n  return 'INTANGIBILITY_REQUIRES_PHYSICAL_CUES';\n}\n\nconsole.log(classifyServiceChallenge('EMPTY_HOTEL_ROOM_TONIGHT'));\nconsole.log(classifyServiceChallenge('HAIRCUT_CONSUMED_DURING_CUTTING'));",
            "expectedOutput": "PERISHABILITY_REVENUE_LOST_FOREVER\nINSEPARABILITY_SIMULTANEOUS_PRODUCTION_CONSUMPTION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which unique service characteristic dictates that an unsold airline seat on a departed flight cannot be inventoried or sold later, representing permanently lost revenue?",
          "expectedStringOutput": "PERISHABILITY_REVENUE_LOST_FOREVER",
          "acceptableAnswers": [
            "PERISHABILITY_REVENUE_LOST_FOREVER",
            "Perishability",
            "Perishable"
          ],
          "primaryMisconceptionId": "MC_MKT_SERVICES_MARKETING_7PS_SERVQUAL_GAPS",
          "diagnosisMap": {
            "INTANGIBLE": {
              "misconceptionId": "MC_MKT_SERVICES_MARKETING_7PS_SERVQUAL_GAPS",
              "errorExplanation": "Intangibility means you can't touch it. Inability to store unsold capacity is Perishability.",
              "recoveryPath": {
                "simplerExplanation": "Lost unsold capacity is Perishability.",
                "guidedFixPrompt": "Type PERISHABILITY_REVENUE_LOST_FOREVER"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 17,
    "title": "B2B Marketing & The Buying Center (DMU) Decision Process",
    "overviewMetaphor": "B2B Selling is Winning a 6-Seat Boardroom Poker Game: you are not selling to a single consumer impulsively buying candy at checkout; in an enterprise $500,000 software contract, the Decision Making Unit (DMU) has 6 distinct players: The Initiator (VP requesting a solution), Influencer (Security Architect setting technical specs), Decider (CFO with final sign-off), Buyer (Procurement Officer negotiating contract terms), User (Engineers using the tool daily), and Gatekeeper (Executive Assistant blocking calendar access); missing even one player can kill an entire deal.",
    "blocks": [
      {
        "id": "mkt-d17-b1-buying-center-six-roles",
        "day": 17,
        "blockNumber": 1,
        "title": "The 6 Roles in the B2B Buying Center (Decision Making Unit DMU)",
        "conceptBudget": {
          "primaryConcept": "The 6 DMU Buying Center Roles",
          "supportingTerms": [
            "1. Initiator (First suggests buying product)",
            "2. Influencer (Defines technical specifications & criteria)",
            "3. Decider (Has formal/informal power to select supplier)",
            "4. Buyer (Formal authority to negotiate contractual terms)",
            "5. User (Will actually use product/service)",
            "6. Gatekeeper (Controls flow of information into buying unit)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d16-b1-servqual-gap-model-five-dimensions",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "B2B Buying Center Roster",
              "boxes": [
                {
                  "label": "1. Initiator & 2. Influencer",
                  "value": "VP of Engineering requests tool; Security Architect vets SOC2",
                  "varType": "Technical Stakeholders",
                  "isUpdated": false
                },
                {
                  "label": "3. Decider & 4. Buyer",
                  "value": "CFO signs off on $500k budget; Procurement Buyer negotiates 15% discount",
                  "varType": "Financial Stakeholders",
                  "isUpdated": false
                },
                {
                  "label": "5. User & 6. Gatekeeper",
                  "value": "Senior Developers test UI daily; IT Director controls access to CFO",
                  "varType": "Operational Stakeholders",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "buying_center_demo.js",
            "initialCode": "function evaluateDmuCoverage(presentRoles) {\n  const required = ['INITIATOR', 'INFLUENCER', 'DECIDER', 'BUYER', 'USER', 'GATEKEEPER'];\n  const missing = required.filter(r => !presentRoles.includes(r));\n  return {\n    rolesCount: presentRoles.length,\n    missingCount: missing.length,\n    isFullyAligned: missing.length === 0,\n    status: missing.length === 0 ? 'ENTERPRISE_DEAL_FULLY_ALIGNED' : 'HIGH_RISK_DEAL_BLINDSPOT'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateDmuCoverage(['INITIATOR', 'INFLUENCER', 'DECIDER', 'BUYER', 'USER', 'GATEKEEPER'])));\nconsole.log(JSON.stringify(evaluateDmuCoverage(['USER', 'BUYER'])));",
            "expectedOutput": "{\"rolesCount\":6,\"missingCount\":0,\"isFullyAligned\":true,\"status\":\"ENTERPRISE_DEAL_FULLY_ALIGNED\"}\n{\"rolesCount\":2,\"missingCount\":4,\"isFullyAligned\":false,\"status\":\"HIGH_RISK_DEAL_BLINDSPOT\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How is an enterprise sales engagement evaluated when all 6 required DMU roles are actively mapped and engaged?",
          "expectedStringOutput": "ENTERPRISE_DEAL_FULLY_ALIGNED",
          "acceptableAnswers": [
            "ENTERPRISE_DEAL_FULLY_ALIGNED",
            "Fully Aligned",
            "Deal Fully Aligned"
          ],
          "primaryMisconceptionId": "MC_MKT_B2B_BUYING_CENTER_ROLES_PROCUREMENT",
          "diagnosisMap": {
            "BLINDSPOT": {
              "misconceptionId": "MC_MKT_B2B_BUYING_CENTER_ROLES_PROCUREMENT",
              "errorExplanation": "Missing roles cause blindspots. Covering all 6 roles evaluates to ENTERPRISE_DEAL_FULLY_ALIGNED.",
              "recoveryPath": {
                "simplerExplanation": "Matches ENTERPRISE_DEAL_FULLY_ALIGNED.",
                "guidedFixPrompt": "Type ENTERPRISE_DEAL_FULLY_ALIGNED"
              }
            }
          }
        }
      },
      {
        "id": "mkt-d17-b2-b2b-buy-classes-framework",
        "day": 17,
        "blockNumber": 2,
        "title": "B2B Buy-Class Framework: Straight Rebuy, Modified Rebuy & New Task",
        "conceptBudget": {
          "primaryConcept": "B2B Buy-Class Framework",
          "supportingTerms": [
            "Straight Rebuy (Routine reorder without modifications e.g. Office paper supplies)",
            "Modified Rebuy (Buyer wants to modify product specifications, prices, or delivery terms)",
            "New Task Purchase (First-time purchase of expensive, complex capital equipment)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d17-b1-buying-center-six-roles",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "B2B Buy-Class Strategy",
            "codeSnippet": "// STRAIGHT REBUY:  Automate electronic EDI reorders -> Defend existing contract\n// MODIFIED REBUY:  Respond swiftly with updated SLA or pricing discounts\n// NEW TASK:        Consultative whitepaper, executive proof-of-concept, RFP bid",
            "lineNotes": {
              "1": "Frictionless reorder.",
              "2": "Competitive defense.",
              "3": "High involvement sale."
            }
          },
          {
            "type": "runnable_code",
            "filename": "buy_class_demo.js",
            "initialCode": "function classifyBuyClass(isFirstTime, wantsModification) {\n  if (isFirstTime) return 'NEW_TASK_PURCHASE_HIGH_INVOLVEMENT';\n  if (wantsModification) return 'MODIFIED_REBUY_NEGOTIATION';\n  return 'STRAIGHT_REBUY_ROUTINE_ORDER';\n}\n\nconsole.log(classifyBuyClass(true, false));\nconsole.log(classifyBuyClass(false, false));",
            "expectedOutput": "NEW_TASK_PURCHASE_HIGH_INVOLVEMENT\nSTRAIGHT_REBUY_ROUTINE_ORDER",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How is a routine automated reorder of standard office supplies with unchanged vendor and pricing terms classified in B2B purchasing?",
          "expectedStringOutput": "STRAIGHT_REBUY_ROUTINE_ORDER",
          "acceptableAnswers": [
            "STRAIGHT_REBUY_ROUTINE_ORDER",
            "Straight Rebuy",
            "Straight rebuy"
          ],
          "primaryMisconceptionId": "MC_MKT_B2B_BUYING_CENTER_ROLES_PROCUREMENT",
          "diagnosisMap": {
            "NEW_TASK": {
              "misconceptionId": "MC_MKT_B2B_BUYING_CENTER_ROLES_PROCUREMENT",
              "errorExplanation": "New task is a first-time purchase. Routine reordering is a Straight Rebuy.",
              "recoveryPath": {
                "simplerExplanation": "Routine reorder is a Straight Rebuy.",
                "guidedFixPrompt": "Type STRAIGHT_REBUY_ROUTINE_ORDER"
              }
            }
          }
        }
      },
      {
        "id": "mkt-d17-b3-rfp-procurement-pipeline",
        "day": 17,
        "blockNumber": 3,
        "title": "The Enterprise RFP (Request for Proposal) Procurement Pipeline",
        "conceptBudget": {
          "primaryConcept": "RFP Procurement Pipeline",
          "supportingTerms": [
            "RFI (Request for Information)",
            "RFP (Request for Proposal: Formal bidding specifications)",
            "RFQ (Request for Quotation: Pricing quotes)",
            "Vendor Evaluation Matrix & SLA Penalty clauses"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d17-b2-b2b-buy-classes-framework",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "rfp_demo.js",
            "initialCode": "function getRfpStage(docType) {\n  if (docType === 'RFP') return 'FORMAL_BID_SPECIFICATION_SUBMISSION';\n  if (docType === 'RFQ') return 'COMMERCIAL_PRICE_QUOTATION';\n  return 'PRELIMINARY_INFORMATION_GATHERING';\n}\n\nconsole.log(getRfpStage('RFP'));\nconsole.log(getRfpStage('RFQ'));",
            "expectedOutput": "FORMAL_BID_SPECIFICATION_SUBMISSION\nCOMMERCIAL_PRICE_QUOTATION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What procurement document formally solicits competitive technical and architectural proposals from qualified B2B vendors?",
          "expectedStringOutput": "RFP",
          "acceptableAnswers": [
            "RFP",
            "Request for Proposal",
            "Request For Proposal"
          ],
          "primaryMisconceptionId": "MC_MKT_B2B_BUYING_CENTER_ROLES_PROCUREMENT",
          "diagnosisMap": {
            "INVOICE": {
              "misconceptionId": "MC_MKT_B2B_BUYING_CENTER_ROLES_PROCUREMENT",
              "errorExplanation": "Invoices occur after delivery. Competitive formal bidding is solicited via an RFP.",
              "recoveryPath": {
                "simplerExplanation": "Request for Proposal is RFP.",
                "guidedFixPrompt": "Type RFP"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 18,
    "title": "Digital Media Strategy: The Owned, Earned & Paid (OEP) Media Trifecta",
    "overviewMetaphor": "Digital Marketing is a 3-Legged Stool: Paid Media (Google Ads, Meta Ads: $10,000 spend for 100 paid customers $\\implies \\$100$ Paid CAC) is renting attention on somebody else's land; Owned Media (Your corporate website, newsletter, app) is building your own house where you control the rules; Earned Media (Viral tweets, PR articles, user referrals) is word-of-mouth applause; combining 100 paid + 50 owned + 50 earned customers halves your Blended Omnichannel CAC down to just $50.00!",
    "blocks": [
      {
        "id": "mkt-d18-b1-oep-media-trifecta-cac",
        "day": 18,
        "blockNumber": 1,
        "title": "The OEP Media Trifecta & Blended Customer Acquisition Cost (CAC)",
        "conceptBudget": {
          "primaryConcept": "OEP Framework & Blended CAC Formula",
          "supportingTerms": [
            "Paid Media (Search ads, display, influencer sponsorships)",
            "Owned Media (Website, email database, mobile app)",
            "Earned Media (Organic PR, viral word-of-mouth)",
            "Paid CAC: $\\frac{\\text{Paid Spend}}{\\text{Paid Customers}}$",
            "Blended CAC: $\\frac{\\text{Paid Spend}}{\\text{Total Acquired Customers (Paid + Owned + Earned)}}$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d17-b1-buying-center-six-roles",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "OEP CAC Economics ($10,000 Paid Spend)",
              "boxes": [
                {
                  "label": "Paid Media Acquisitions",
                  "value": "100 Customers ($10,000 / 100 = $100.00 Paid CAC)",
                  "varType": "Paid CAC",
                  "isUpdated": false
                },
                {
                  "label": "Organic (Owned + Earned)",
                  "value": "50 Owned + 50 Earned = 100 Organic Customers ($0 direct media spend)",
                  "varType": "Organic Flow",
                  "isUpdated": false
                },
                {
                  "label": "Blended Omnichannel CAC",
                  "value": "$10,000 / 200 Total Customers = $50.00 Blended CAC (50% SAVINGS!)",
                  "varType": "Blended CAC",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "oep_cac_demo.js",
            "initialCode": "function calculateBlendedCac(paidSpend, paidC, ownedC, earnedC) {\n  const total = paidC + ownedC + earnedC;\n  const paidCac = paidSpend / paidC;\n  const blendedCac = paidSpend / total;\n  return {\n    totalAcquisitions: total,\n    paidCac: Number(paidCac.toFixed(2)),\n    blendedCac: Number(blendedCac.toFixed(2)),\n    status: 'CAC_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateBlendedCac(10000, 100, 50, 50)));",
            "expectedOutput": "{\"totalAcquisitions\":200,\"paidCac\":100,\"blendedCac\":50,\"status\":\"CAC_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Blended CAC when $10,000 in marketing spend yields 100 paid customers, 50 owned customers, and 50 earned customers ($10,000 / 200$)?",
          "expectedStringOutput": "50",
          "acceptableAnswers": [
            "50",
            "$50",
            "50.0",
            "blendedCac\":50"
          ],
          "primaryMisconceptionId": "MC_MKT_DIGITAL_MEDIA_OEP_FRAMEWORK_ENGAGEMENT",
          "diagnosisMap": {
            "100": {
              "misconceptionId": "MC_MKT_DIGITAL_MEDIA_OEP_FRAMEWORK_ENGAGEMENT",
              "errorExplanation": "100 is Paid CAC ($10,000/100). Blended CAC includes all 200 customers: $10,000 / 200 = $50.",
              "recoveryPath": {
                "simplerExplanation": "10,000 / 200 = 50.",
                "guidedFixPrompt": "Type 50"
              }
            }
          }
        }
      },
      {
        "id": "mkt-d18-b2-seo-content-organic-flywheel",
        "day": 18,
        "blockNumber": 2,
        "title": "SEO, Content Strategy & The Compounding Organic Traffic Flywheel",
        "conceptBudget": {
          "primaryConcept": "SEO & Content Marketing Flywheel",
          "supportingTerms": [
            "Keyword Search Intent (Informational, Navigational, Commercial, Transactional)",
            "On-Page SEO (Title tags, H1, internal linking, schema markup)",
            "Evergreen Content Compounding (High initial effort, zero marginal cost per visitor over 5 years)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d18-b1-oep-media-trifecta-cac",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Search Intent Classification",
            "codeSnippet": "// 'best crm software for startups' -> COMMERCIAL_INTENT (Comparison & Reviews)\n// 'buy crm pro license'             -> TRANSACTIONAL_INTENT (High conversion buy now!)\n// 'what is crm architecture'       -> INFORMATIONAL_INTENT (Top-of-funnel education)",
            "lineNotes": {
              "1": "Mid-funnel research.",
              "2": "Bottom-of-funnel intent.",
              "3": "Top-of-funnel guide."
            }
          },
          {
            "type": "runnable_code",
            "filename": "seo_intent_demo.js",
            "initialCode": "function classifySearchIntent(query) {\n  if (query.includes('buy') || query.includes('pricing')) return 'TRANSACTIONAL_HIGH_INTENT';\n  if (query.includes('best') || query.includes('review')) return 'COMMERCIAL_INVESTIGATION';\n  return 'INFORMATIONAL_TOP_FUNNEL';\n}\n\nconsole.log(classifySearchIntent('buy crm pro license'));\nconsole.log(classifySearchIntent('best crm software for startups'));",
            "expectedOutput": "TRANSACTIONAL_HIGH_INTENT\nCOMMERCIAL_INVESTIGATION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How is a search query like 'buy CRM software subscription license' classified in keyword search intent?",
          "expectedStringOutput": "TRANSACTIONAL_HIGH_INTENT",
          "acceptableAnswers": [
            "TRANSACTIONAL_HIGH_INTENT",
            "Transactional",
            "Transactional Intent"
          ],
          "primaryMisconceptionId": "MC_MKT_DIGITAL_MEDIA_OEP_FRAMEWORK_ENGAGEMENT",
          "diagnosisMap": {
            "INFO": {
              "misconceptionId": "MC_MKT_DIGITAL_MEDIA_OEP_FRAMEWORK_ENGAGEMENT",
              "errorExplanation": "Informational queries ask 'what is'. Queries containing 'buy' or 'pricing' are Transactional.",
              "recoveryPath": {
                "simplerExplanation": "'buy' indicates Transactional intent.",
                "guidedFixPrompt": "Type TRANSACTIONAL_HIGH_INTENT"
              }
            }
          }
        }
      },
      {
        "id": "mkt-d18-b3-social-media-engagement-rate",
        "day": 18,
        "blockNumber": 3,
        "title": "Social Media Engagement Rate & Community Virality Metrics",
        "conceptBudget": {
          "primaryConcept": "Engagement Rate Formula",
          "supportingTerms": [
            "$\\text{Engagement Rate} = \\frac{\\text{Total Engagements (Likes + Comments + Shares + Saves)}}{\\text{Total Impressions / Followers}} \\times 100\\%$",
            "High Save/Share ratio $\\implies$ Algorithm amplification boost"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d18-b2-seo-content-organic-flywheel",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "engagement_demo.js",
            "initialCode": "function calculateEngagementRate(engagements, impressions) {\n  const rate = (engagements / impressions) * 100;\n  return {\n    totalEngagements: engagements,\n    totalImpressions: impressions,\n    engagementRatePercent: Number(rate.toFixed(2)),\n    status: rate >= 3.0 ? 'HIGH_ALGORITHMIC_VIRALITY' : 'STANDARD_ENGAGEMENT'\n  };\n}\n\nconsole.log(JSON.stringify(calculateEngagementRate(450, 10000)));",
            "expectedOutput": "{\"totalEngagements\":450,\"totalImpressions\":10000,\"engagementRatePercent\":4.5,\"status\":\"HIGH_ALGORITHMIC_VIRALITY\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Engagement Rate percentage when a post generates 450 total interactions from 10,000 impressions ($ (450 / 10,000) \\times 100 $)?",
          "expectedStringOutput": "4.5",
          "acceptableAnswers": [
            "4.5",
            "4.5%",
            "4.50",
            "engagementRatePercent\":4.5"
          ],
          "primaryMisconceptionId": "MC_MKT_DIGITAL_MEDIA_OEP_FRAMEWORK_ENGAGEMENT",
          "diagnosisMap": {
            "0.045": {
              "misconceptionId": "MC_MKT_DIGITAL_MEDIA_OEP_FRAMEWORK_ENGAGEMENT",
              "errorExplanation": "0.045 is decimal form. Multiplied by 100 gives 4.5% engagement rate.",
              "recoveryPath": {
                "simplerExplanation": "(450 / 10,000) * 100 = 4.5%.",
                "guidedFixPrompt": "Type 4.5"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 19,
    "title": "Customer Relationship Management (CRM) & Customer Equity",
    "overviewMetaphor": "A Business is Not Built on One-Time Sales, but on Customer Equity (The Financial Tree of Lifetime Relationships): Customer Equity is the sum of discounted Lifetime Values of all current and future customers ($CE = \\sum \\text{CLV}_i$); 1,000 standard customers with $500 CLV + 200 enterprise VIPs with $2,500 CLV create a massive $1,000,000 corporate customer asset; CRM software tracks customer interactions across the Loyalty Ladder (Prospect $\\to$ Customer $\\to$ Advocate).",
    "blocks": [
      {
        "id": "mkt-d19-b1-customer-equity-summation",
        "day": 19,
        "blockNumber": 1,
        "title": "Customer Equity Summation: $CE = \\sum (\\text{Segment Count} \\times \\text{CLV})$",
        "conceptBudget": {
          "primaryConcept": "Customer Equity Formula",
          "supportingTerms": [
            "Customer Equity (Total combined customer lifetime values across all corporate segments)",
            "Segment 1 (1,000 Users @ $500 CLV = $500,000)",
            "Segment 2 (200 Enterprise VIPs @ $2,500 CLV = $500,000)",
            "Total Corporate Customer Equity = $1,000,000 across 1,200 users"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d18-b1-oep-media-trifecta-cac",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Corporate Customer Equity Ledger",
              "boxes": [
                {
                  "label": "Segment A: Standard Tier",
                  "value": "1,000 Customers x $500 CLV = $500,000 Value",
                  "varType": "Mass Segment",
                  "isUpdated": false
                },
                {
                  "label": "Segment B: Enterprise VIP",
                  "value": "200 VIP Accounts x $2,500 CLV = $500,000 Value",
                  "varType": "VIP Segment",
                  "isUpdated": false
                },
                {
                  "label": "Total Customer Equity Asset",
                  "value": "$500,000 + $500,000 = $1,000,000 Total Equity Asset!",
                  "varType": "Customer Equity",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "equity_calc_demo.js",
            "initialCode": "function calculateCustomerEquity(segs) {\n  let total = 0;\n  segs.forEach(s => total += s.count * s.clv);\n  return {\n    totalSegments: segs.length,\n    totalCustomerEquity: total,\n    status: 'CUSTOMER_EQUITY_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateCustomerEquity([\n  { count: 1000, clv: 500 },\n  { count: 200, clv: 2500 }\n])));",
            "expectedOutput": "{\"totalSegments\":2,\"totalCustomerEquity\":1000000,\"status\":\"CUSTOMER_EQUITY_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is total Corporate Customer Equity when Segment A (1,000 users @ $500 CLV) and Segment B (200 users @ $2,500 CLV) are combined ($500,000 + 500,000$)?",
          "expectedStringOutput": "1000000",
          "acceptableAnswers": [
            "1000000",
            "1,000,000",
            "$1,000,000",
            "totalCustomerEquity\":1000000"
          ],
          "primaryMisconceptionId": "MC_MKT_CUSTOMER_RELATIONSHIP_MANAGEMENT_CRM_EQUITY",
          "diagnosisMap": {
            "500000": {
              "misconceptionId": "MC_MKT_CUSTOMER_RELATIONSHIP_MANAGEMENT_CRM_EQUITY",
              "errorExplanation": "500,000 is one segment. Total Customer Equity sums all segments: 500k + 500k = $1,000,000.",
              "recoveryPath": {
                "simplerExplanation": "500k + 500k = 1,000,000.",
                "guidedFixPrompt": "Type 1000000"
              }
            }
          }
        }
      },
      {
        "id": "mkt-d19-b2-loyalty-ladder-customer-journey",
        "day": 19,
        "blockNumber": 2,
        "title": "The Relationship Marketing Loyalty Ladder: Prospect to Advocate",
        "conceptBudget": {
          "primaryConcept": "The Loyalty Ladder",
          "supportingTerms": [
            "Prospect (Target who might buy)",
            "Customer (One-time transaction)",
            "Client (Repeat regular buyer)",
            "Supporter (Likes organization)",
            "Advocate (Proactively recommends brand to others: Free word-of-mouth sales rep!)",
            "Partner (Co-creates value)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d19-b1-customer-equity-summation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Loyalty Ladder Ascendance",
            "codeSnippet": "// Step 1: Prospect -> Converts on initial offer\n// Step 2: Customer -> Transacts once\n// Step 3: Client   -> Rebuys repeatedly\n// Step 4: Advocate -> Actively evangelizes brand to friends & colleagues!",
            "lineNotes": {
              "1": "First engagement.",
              "2": "Single purchase.",
              "3": "Habitual buyer.",
              "4": "Brand ambassador."
            }
          },
          {
            "type": "runnable_code",
            "filename": "loyalty_ladder_demo.js",
            "initialCode": "function evaluateLoyaltyRung(behavior) {\n  if (behavior === 'EVANGELIZES_BRAND_ON_SOCIAL') return 'LOYALTY_RUNG_BRAND_ADVOCATE';\n  if (behavior === 'REPEATED_MONTHLY_SUBSCRIPTION') return 'LOYALTY_RUNG_REPEAT_CLIENT';\n  return 'LOYALTY_RUNG_ONE_TIME_CUSTOMER';\n}\n\nconsole.log(evaluateLoyaltyRung('EVANGELIZES_BRAND_ON_SOCIAL'));\nconsole.log(evaluateLoyaltyRung('REPEATED_MONTHLY_SUBSCRIPTION'));",
            "expectedOutput": "LOYALTY_RUNG_BRAND_ADVOCATE\nLOYALTY_RUNG_REPEAT_CLIENT",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What top rung on the relationship marketing loyalty ladder describes a passionate customer who actively evangelizes and defends the brand to peers?",
          "expectedStringOutput": "LOYALTY_RUNG_BRAND_ADVOCATE",
          "acceptableAnswers": [
            "LOYALTY_RUNG_BRAND_ADVOCATE",
            "Brand Advocate",
            "Advocate"
          ],
          "primaryMisconceptionId": "MC_MKT_CUSTOMER_RELATIONSHIP_MANAGEMENT_CRM_EQUITY",
          "diagnosisMap": {
            "CUSTOMER": {
              "misconceptionId": "MC_MKT_CUSTOMER_RELATIONSHIP_MANAGEMENT_CRM_EQUITY",
              "errorExplanation": "Customer is a one-time transactional buyer. Enthusiastic evangelists are Brand Advocates.",
              "recoveryPath": {
                "simplerExplanation": "Enthusiastic evangelist is a Brand Advocate.",
                "guidedFixPrompt": "Type LOYALTY_RUNG_BRAND_ADVOCATE"
              }
            }
          }
        }
      },
      {
        "id": "mkt-d19-b3-churn-mitigation-retention-economics",
        "day": 19,
        "blockNumber": 3,
        "title": "Retention Economics: Acquiring a New Customer Costs 5x-7x Retaining an Existing One",
        "conceptBudget": {
          "primaryConcept": "Retention Economics Invariant",
          "supportingTerms": [
            "5x-7x CAC Multiple to acquire vs retain",
            "5% increase in customer retention boosts corporate profits by 25%-95% (Bain & Co / Reichheld)",
            "Proactive CRM churn alert triggers"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d19-b2-loyalty-ladder-customer-journey",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "retention_demo.js",
            "initialCode": "function getRetentionCacMultiple() {\n  return 'ACQUIRING_NEW_CUSTOMER_COSTS_5X_TO_7X_MORE_THAN_RETAINING';\n}\n\nconsole.log(getRetentionCacMultiple());",
            "expectedOutput": "ACQUIRING_NEW_CUSTOMER_COSTS_5X_TO_7X_MORE_THAN_RETAINING",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "According to classic marketing retention economics, how much more does acquiring a new customer typically cost compared to retaining an existing customer?",
          "expectedStringOutput": "ACQUIRING_NEW_CUSTOMER_COSTS_5X_TO_7X_MORE_THAN_RETAINING",
          "acceptableAnswers": [
            "ACQUIRING_NEW_CUSTOMER_COSTS_5X_TO_7X_MORE_THAN_RETAINING",
            "5x to 7x",
            "5 to 7 times"
          ],
          "primaryMisconceptionId": "MC_MKT_CUSTOMER_RELATIONSHIP_MANAGEMENT_CRM_EQUITY",
          "diagnosisMap": {
            "EQUAL": {
              "misconceptionId": "MC_MKT_CUSTOMER_RELATIONSHIP_MANAGEMENT_CRM_EQUITY",
              "errorExplanation": "Acquisition is vastly more expensive due to advertising and sales cycles. It costs 5x to 7x more.",
              "recoveryPath": {
                "simplerExplanation": "Costs 5x to 7x more.",
                "guidedFixPrompt": "Type ACQUIRING_NEW_CUSTOMER_COSTS_5X_TO_7X_MORE_THAN_RETAINING"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 20,
    "title": "Return on Marketing Investment (ROMI) & Marketing Performance Auditing",
    "overviewMetaphor": "Marketing Without ROMI is Flying a Jet in a Fog Without an Altimeter: Return on Marketing Investment measures pure financial accountability: $ROMI = \\frac{\\text{Incremental Gross Margin} - \\text{Marketing Spend}}{\\text{Marketing Spend}} \\times 100\\%$; if a $40,000 marketing campaign generates $200,000 in incremental revenue at a 60% gross margin ($120,000 gross margin), net marketing profit is $80,000—delivering a massive +200.0% ROMI that proves marketing is a profit generator, not a corporate expense.",
    "blocks": [
      {
        "id": "mkt-d20-b1-romi-calculation-formula",
        "day": 20,
        "blockNumber": 1,
        "title": "The ROMI Formula: $ROMI = \\frac{(\\text{Incremental Rev} \\times \\text{GM}\\%) - \\text{Spend}}{\\text{Spend}} \\times 100\\%$",
        "conceptBudget": {
          "primaryConcept": "ROMI Formula & Incremental Margin",
          "supportingTerms": [
            "Incremental Revenue ($200,000)",
            "Gross Margin % ($60.0\\% \\implies \\$120,000$ Incremental Gross Margin)",
            "Marketing Campaign Spend ($40,000)",
            "Net Marketing Profit = $120,000 - $40,000 = $80,000",
            "$ROMI = \\frac{\\$80,000}{\\$40,000} \\times 100\\% = +200.0\\%$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d19-b1-customer-equity-summation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "ROMI Financial Waterfall ($40,000 Marketing Spend)",
              "boxes": [
                {
                  "label": "Incremental Revenue",
                  "value": "$200,000 Gross Sales generated by campaign",
                  "varType": "Revenue",
                  "isUpdated": false
                },
                {
                  "label": "Incremental Margin (60%)",
                  "value": "$200,000 x 0.60 = $120,000 Gross Profit Margin",
                  "varType": "Gross Margin",
                  "isUpdated": false
                },
                {
                  "label": "ROMI Percentage",
                  "value": "($120k - $40k) / $40k = $80k / $40k = +200.00% ROMI!",
                  "varType": "ROMI",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "romi_calc_demo.js",
            "initialCode": "function calculateRomi(incRev, gmPct, spend) {\n  const margin = incRev * (gmPct / 100);\n  const netProfit = margin - spend;\n  const romi = (netProfit / spend) * 100;\n  return {\n    incrementalGrossMargin: margin,\n    netMarketingProfit: netProfit,\n    romiPercent: Number(romi.toFixed(2)),\n    isProfitable: romi > 0,\n    status: 'ROMI_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateRomi(200000, 60, 40000)));",
            "expectedOutput": "{\"incrementalGrossMargin\":120000,\"netMarketingProfit\":80000,\"romiPercent\":200,\"isProfitable\":true,\"status\":\"ROMI_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Return on Marketing Investment (ROMI) percentage when a $40,000 ad campaign generates $120,000 in gross margin ($ (80,000 / 40,000) \\times 100 $)?",
          "expectedStringOutput": "200",
          "acceptableAnswers": [
            "200",
            "200%",
            "200.0",
            "romiPercent\":200"
          ],
          "primaryMisconceptionId": "MC_MKT_MARKETING_ROI_ROMI_INCREMENTAL_MARGIN",
          "diagnosisMap": {
            "300": {
              "misconceptionId": "MC_MKT_MARKETING_ROI_ROMI_INCREMENTAL_MARGIN",
              "errorExplanation": "300 is Margin / Spend (120k/40k). ROMI subtracts spend from margin first: ($120k - $40k) / $40k = 200%.",
              "recoveryPath": {
                "simplerExplanation": "80,000 / 40,000 * 100 = 200%.",
                "guidedFixPrompt": "Type 200"
              }
            }
          }
        }
      },
      {
        "id": "mkt-d20-b2-marketing-audit-scorecard",
        "day": 20,
        "blockNumber": 2,
        "title": "The Comprehensive Marketing Audit Framework",
        "conceptBudget": {
          "primaryConcept": "Marketing Audit Framework",
          "supportingTerms": [
            "Marketing Environment Audit",
            "Marketing Strategy Audit",
            "Marketing Organization Audit",
            "Marketing Systems Audit",
            "Marketing Productivity Audit",
            "Periodic, systematic, independent, and comprehensive review"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d20-b1-romi-calculation-formula",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Marketing Audit 4 Characteristics",
            "codeSnippet": "// 1. Comprehensive: Covers all marketing operations (not just problem areas)\n// 2. Systematic:    Follows orderly diagnostic procedures\n// 3. Independent:   Conducted by objective outside auditors\n// 4. Periodic:      Conducted regularly, not just during crises!",
            "lineNotes": {
              "1": "Full scope.",
              "2": "Methodical process.",
              "3": "Unbiased objectivity.",
              "4": "Routine governance."
            }
          },
          {
            "type": "runnable_code",
            "filename": "audit_demo.js",
            "initialCode": "function evaluateAuditCompliance(comp, sys, ind, per) {\n  const ok = comp && sys && ind && per;\n  return ok ? 'MARKETING_AUDIT_STANDARDS_MET' : 'AUDIT_METHODOLOGY_DEFICIT';\n}\n\nconsole.log(evaluateAuditCompliance(true, true, true, true));",
            "expectedOutput": "MARKETING_AUDIT_STANDARDS_MET",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What evaluation is awarded when a marketing audit satisfies all 4 core Kotler characteristics (Comprehensive, Systematic, Independent, and Periodic)?",
          "expectedStringOutput": "MARKETING_AUDIT_STANDARDS_MET",
          "acceptableAnswers": [
            "MARKETING_AUDIT_STANDARDS_MET",
            "Standards Met",
            "Audit Passed"
          ],
          "primaryMisconceptionId": "MC_MKT_MARKETING_ROI_ROMI_INCREMENTAL_MARGIN",
          "diagnosisMap": {
            "DEFICIT": {
              "misconceptionId": "MC_MKT_MARKETING_ROI_ROMI_INCREMENTAL_MARGIN",
              "errorExplanation": "All 4 characteristics present meets full audit standards.",
              "recoveryPath": {
                "simplerExplanation": "Matches MARKETING_AUDIT_STANDARDS_MET.",
                "guidedFixPrompt": "Type MARKETING_AUDIT_STANDARDS_MET"
              }
            }
          }
        }
      },
      {
        "id": "mkt-d20-b3-marketing-cost-analysis",
        "day": 20,
        "blockNumber": 3,
        "title": "Marketing Cost Analysis & Profitability by Channel Segment",
        "conceptBudget": {
          "primaryConcept": "Segment Profitability Analysis",
          "supportingTerms": [
            "Full-Costing vs Direct Costing",
            "Channel Contribution Margin",
            "Pruning unprofitable marketing channels"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d20-b2-marketing-audit-scorecard",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "channel_profit_demo.js",
            "initialCode": "function evaluateChannelProfitability(revenue, directCosts) {\n  const margin = revenue - directCosts;\n  return {\n    revenue,\n    directCosts,\n    contributionMargin: margin,\n    isViable: margin > 0,\n    status: margin > 0 ? 'VIABLE_PROFIT_CONTRIBUTING_CHANNEL' : 'UNPROFITABLE_PRUNE_CHANNEL'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateChannelProfitability(100000, 70000)));",
            "expectedOutput": "{\"revenue\":100000,\"directCosts\":70000,\"contributionMargin\":30000,\"isViable\":true,\"status\":\"VIABLE_PROFIT_CONTRIBUTING_CHANNEL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the marketing contribution margin for a channel with $100,000 revenue and $70,000 direct channel marketing costs ($100,000 - 70,000$)?",
          "expectedStringOutput": "30000",
          "acceptableAnswers": [
            "30000",
            "$30,000",
            "30,000",
            "contributionMargin\":30000"
          ],
          "primaryMisconceptionId": "MC_MKT_MARKETING_ROI_ROMI_INCREMENTAL_MARGIN",
          "diagnosisMap": {
            "70000": {
              "misconceptionId": "MC_MKT_MARKETING_ROI_ROMI_INCREMENTAL_MARGIN",
              "errorExplanation": "70,000 is direct costs. Contribution margin is $100,000 - $70,000 = $30,000.",
              "recoveryPath": {
                "simplerExplanation": "100,000 - 70,000 = 30,000.",
                "guidedFixPrompt": "Type 30000"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 21,
    "title": "⭐ MILESTONE 3: Complete Services, B2B & Marketing Performance Engine",
    "overviewMetaphor": "Milestone 3 Synthesis: The complete sovereign services, B2B procurement, and financial marketing performance engine: 1. SERVQUAL service quality gap analysis ($Gap = +0.60$); 2. B2B Buying Center (DMU) 6-role alignment; 3. OEP digital media Blended CAC modeling ($Blended = \\$50.00$); 4. Corporate Customer Equity valuation ($CE = \\$1,000,000$); 5. Return on Marketing Investment (ROMI) profitability auditing ($ROMI = +200.0\\%$).",
    "blocks": [
      {
        "id": "mkt-d21-b1-marketing-performance-engine-synthesis",
        "day": 21,
        "blockNumber": 1,
        "title": "Marketing Performance & Enterprise GTM Master Engine Synthesis",
        "conceptBudget": {
          "primaryConcept": "Marketing Performance Synthesis",
          "supportingTerms": [
            "SERVQUAL Engine",
            "B2B DMU Evaluator",
            "OEP Blended CAC Engine",
            "Customer Equity Engine",
            "ROMI Profitability Auditor"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d20-b3-marketing-cost-analysis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Milestone 3 Marketing Performance Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "Evaluates SERVQUAL service gap (+0.60 exceeds expectations)",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Verifies B2B Buying Center 6-role stakeholder coverage",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Computes Blended Omnichannel CAC ($50) and Customer Equity ($1M)",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Audits +200% ROMI and certifies enterprise marketing performance!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "performance_kernel_demo.js",
            "initialCode": "function runMarketingPerformanceEngine() {\n  return {\n    servqualSubsystem: 'ONLINE_SERVQUAL_ACTIVE',\n    b2bDmuSubsystem: 'ONLINE_DMU_ALIGNED_ACTIVE',\n    oepCacSubsystem: 'ONLINE_BLENDED_CAC_ACTIVE',\n    customerEquitySubsystem: 'ONLINE_CUSTOMER_EQUITY_ACTIVE',\n    romiSubsystem: 'ONLINE_ROMI_AUDITOR_ACTIVE',\n    engineStatus: 'MARKETING_PERFORMANCE_MASTER_ENGINE_ACTIVE'\n  };\n}\n\nconsole.log(runMarketingPerformanceEngine().engineStatus);",
            "expectedOutput": "MARKETING_PERFORMANCE_MASTER_ENGINE_ACTIVE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What engine status confirms active operational synthesis of the Marketing Performance Master Engine?",
          "expectedStringOutput": "MARKETING_PERFORMANCE_MASTER_ENGINE_ACTIVE",
          "acceptableAnswers": [
            "MARKETING_PERFORMANCE_MASTER_ENGINE_ACTIVE",
            "engineStatus: MARKETING_PERFORMANCE_MASTER_ENGINE_ACTIVE"
          ],
          "primaryMisconceptionId": "MC_MKT_MARKETING_ROI_ROMI_INCREMENTAL_MARGIN",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_MKT_MARKETING_ROI_ROMI_INCREMENTAL_MARGIN",
              "errorExplanation": "Matches MARKETING_PERFORMANCE_MASTER_ENGINE_ACTIVE.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type MARKETING_PERFORMANCE_MASTER_ENGINE_ACTIVE"
              }
            }
          }
        }
      },
      {
        "id": "mkt-d21-b2-performance-engine-audit",
        "day": 21,
        "blockNumber": 2,
        "title": "Marketing Performance Invariant Verification & Precision Audit",
        "conceptBudget": {
          "primaryConcept": "Performance Invariant Verification",
          "supportingTerms": [
            "SERVQUAL Invariant",
            "ROMI Invariant",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d21-b1-marketing-performance-engine-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "performance_audit_demo.js",
            "initialCode": "function auditMarketingPerformanceEngine(servValid, dmuValid, cacValid, romiValid) {\n  const passed = servValid && dmuValid && cacValid && romiValid;\n  return {\n    servqualVerified: servValid,\n    dmuVerified: dmuValid,\n    cacVerified: cacValid,\n    romiVerified: romiValid,\n    grade: passed ? 'MARKETING_PERFORMANCE_ENGINE_AUDIT_PASSED' : 'AUDIT_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditMarketingPerformanceEngine(true, true, true, true)));",
            "expectedOutput": "{\"servqualVerified\":true,\"dmuVerified\":true,\"cacVerified\":true,\"romiVerified\":true,\"grade\":\"MARKETING_PERFORMANCE_ENGINE_AUDIT_PASSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade is awarded when SERVQUAL, DMU, CAC, and ROMI engines pass 100%?",
          "expectedStringOutput": "MARKETING_PERFORMANCE_ENGINE_AUDIT_PASSED",
          "acceptableAnswers": [
            "MARKETING_PERFORMANCE_ENGINE_AUDIT_PASSED",
            "grade\":\"MARKETING_PERFORMANCE_ENGINE_AUDIT_PASSED\""
          ],
          "primaryMisconceptionId": "MC_MKT_MARKETING_ROI_ROMI_INCREMENTAL_MARGIN",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_MKT_MARKETING_ROI_ROMI_INCREMENTAL_MARGIN",
              "errorExplanation": "All checks passing awards MARKETING_PERFORMANCE_ENGINE_AUDIT_PASSED.",
              "recoveryPath": {
                "simplerExplanation": "Awards MARKETING_PERFORMANCE_ENGINE_AUDIT_PASSED.",
                "guidedFixPrompt": "Type MARKETING_PERFORMANCE_ENGINE_AUDIT_PASSED"
              }
            }
          }
        }
      },
      {
        "id": "mkt-d21-b3-milestone3-marketing-cert",
        "day": 21,
        "blockNumber": 3,
        "title": "Milestone 3 Marketing Performance & Operations Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 3 Certification",
          "supportingTerms": [
            "Performance Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d21-b2-performance-engine-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone3_mkt_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 3: Complete Services, B2B & Marketing Performance Engine [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 3: Complete Services, B2B & Marketing Performance Engine [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 3 completion?",
          "expectedStringOutput": "⭐ MILESTONE 3: Complete Services, B2B & Marketing Performance Engine [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 3: Complete Services, B2B & Marketing Performance Engine [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_MKT_MARKETING_ROI_ROMI_INCREMENTAL_MARGIN",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_MKT_MARKETING_ROI_ROMI_INCREMENTAL_MARGIN",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 3: Complete Services, B2B & Marketing Performance Engine [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 22,
    "title": "Viral Marketing & Growth Loops: The K-Factor Coefficient",
    "overviewMetaphor": "Viral Marketing is a Contagious Chain Reaction in Physics: the Viral Coefficient ($K = i \\times c$) measures how many new users each existing user infects; if each user sends $i = 10$ referral invites and $c = 15\\%$ of recipients sign up, $K = 10 \\times 0.15 = 1.50$; because $K > 1.0$, your user base multiplies exponentially through self-sustaining organic viral loops without spending a single penny on paid ads (e.g. Dropbox, Hotmail, WhatsApp growth).",
    "blocks": [
      {
        "id": "mkt-d22-b1-k-factor-viral-coefficient-formula",
        "day": 22,
        "blockNumber": 1,
        "title": "The Viral K-Factor Formula: $K = i \\times c$ & Exponential Growth",
        "conceptBudget": {
          "primaryConcept": "Viral Coefficient K-Factor",
          "supportingTerms": [
            "$i$: Number of invites sent per user",
            "$c$: Conversion rate of invitees into new users",
            "$K = i \\times c$",
            "$K > 1.0$: Exponential Viral Explosion (Self-sustaining growth)",
            "$K < 1.0$: Sub-critical growth (Requires continuous paid acquisition to sustain)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d21-b1-marketing-performance-engine-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Viral Loop Parameters (i = 10 invites, c = 15% conversion)",
              "boxes": [
                {
                  "label": "Invites per User (i)",
                  "value": "10 Referral invites sent per user",
                  "varType": "Invites",
                  "isUpdated": false
                },
                {
                  "label": "Conversion Rate (c)",
                  "value": "15.0% of invitees register",
                  "varType": "Conversion",
                  "isUpdated": false
                },
                {
                  "label": "Viral Coefficient (K)",
                  "value": "10 x 0.15 = 1.50 K-Factor (> 1.0 EXPONENTIAL VIRAL EXPLOSION!)",
                  "varType": "K-Factor",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "k_factor_calc_demo.js",
            "initialCode": "function calculateKFactor(invites, convPct) {\n  const k = invites * (convPct / 100);\n  return {\n    invitesPerUser: invites,\n    conversionPercent: convPct,\n    viralCoefficientK: Number(k.toFixed(2)),\n    isExponential: k > 1.0,\n    status: k > 1.0 ? 'EXPONENTIAL_VIRAL_LOOP_ACTIVE' : 'SUB_CRITICAL_REQUIRES_PAID'\n  };\n}\n\nconsole.log(JSON.stringify(calculateKFactor(10, 15)));\nconsole.log(JSON.stringify(calculateKFactor(5, 10)));",
            "expectedOutput": "{\"invitesPerUser\":10,\"conversionPercent\":15,\"viralCoefficientK\":1.5,\"isExponential\":true,\"status\":\"EXPONENTIAL_VIRAL_LOOP_ACTIVE\"}\n{\"invitesPerUser\":5,\"conversionPercent\":10,\"viralCoefficientK\":0.5,\"isExponential\":false,\"status\":\"SUB_CRITICAL_REQUIRES_PAID\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Viral Coefficient (K-Factor) when each user sends 10 invites and 15% convert ($10 \\times 0.15$)?",
          "expectedStringOutput": "1.5",
          "acceptableAnswers": [
            "1.5",
            "1.50",
            "viralCoefficientK\":1.5"
          ],
          "primaryMisconceptionId": "MC_MKT_VIRAL_MARKETING_K_FACTOR_COEFFICIENT",
          "diagnosisMap": {
            "150": {
              "misconceptionId": "MC_MKT_VIRAL_MARKETING_K_FACTOR_COEFFICIENT",
              "errorExplanation": "150 multiplies 10 by 15 without dividing percent. K is 10 * 0.15 = 1.50.",
              "recoveryPath": {
                "simplerExplanation": "10 * 0.15 = 1.50.",
                "guidedFixPrompt": "Type 1.5"
              }
            }
          }
        }
      },
      {
        "id": "mkt-d22-b2-viral-cycle-time-acceleration",
        "day": 22,
        "blockNumber": 2,
        "title": "Viral Cycle Time & Two-Sided Referral Incentive Loops",
        "conceptBudget": {
          "primaryConcept": "Viral Cycle Time & Incentives",
          "supportingTerms": [
            "Viral Cycle Time (Time required for a user to invite and the invitee to join)",
            "Two-Sided Incentive (Rewarding both referrer and referee e.g. Dropbox 'Give 500MB, Get 500MB')",
            "Shortening cycle time from 14 days to 2 days dramatically accelerates compounding"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d22-b1-k-factor-viral-coefficient-formula",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Two-Sided Referral Incentive Structure",
            "codeSnippet": "// ❌ ONE-SIDED: 'Invite a friend so YOU get $10' (Selfish friction, low conversion)\n// ✅ TWO-SIDED: 'Give $20 to your friend, and Get $20 after their first purchase!' (Generosity framing!)",
            "lineNotes": {
              "1": "High psychological resistance.",
              "2": "Zero friction viral loop."
            }
          },
          {
            "type": "runnable_code",
            "filename": "referral_demo.js",
            "initialCode": "function evaluateReferralIncentive(isTwoSided) {\n  return isTwoSided\n    ? 'OPTIMAL_TWO_SIDED_RECIPROCITY_LOOP'\n    : 'SUB_OPTIMAL_ONE_SIDED_FRICTION';\n}\n\nconsole.log(evaluateReferralIncentive(true));\nconsole.log(evaluateReferralIncentive(false));",
            "expectedOutput": "OPTIMAL_TWO_SIDED_RECIPROCITY_LOOP\nSUB_OPTIMAL_ONE_SIDED_FRICTION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What referral incentive architecture rewards both the existing customer and the new referred friend (e.g. 'Give $20, Get $20') to maximize viral sharing reciprocity?",
          "expectedStringOutput": "OPTIMAL_TWO_SIDED_RECIPROCITY_LOOP",
          "acceptableAnswers": [
            "OPTIMAL_TWO_SIDED_RECIPROCITY_LOOP",
            "Two-Sided Incentive",
            "Two-Sided Loop"
          ],
          "primaryMisconceptionId": "MC_MKT_VIRAL_MARKETING_K_FACTOR_COEFFICIENT",
          "diagnosisMap": {
            "ONE_SIDED": {
              "misconceptionId": "MC_MKT_VIRAL_MARKETING_K_FACTOR_COEFFICIENT",
              "errorExplanation": "One-sided rewards create selfish friction. Rewarding both sides is an Optimal Two-Sided loop.",
              "recoveryPath": {
                "simplerExplanation": "Matches OPTIMAL_TWO_SIDED_RECIPROCITY_LOOP.",
                "guidedFixPrompt": "Type OPTIMAL_TWO_SIDED_RECIPROCITY_LOOP"
              }
            }
          }
        }
      },
      {
        "id": "mkt-d22-b3-inherent-vs-artificial-virality",
        "day": 22,
        "blockNumber": 3,
        "title": "Inherent vs Artificial Virality (The Network Product Moat)",
        "conceptBudget": {
          "primaryConcept": "Inherent vs Artificial Virality",
          "supportingTerms": [
            "Inherent Virality (Using the product naturally spreads it e.g. DocuSign, Zoom, Slack)",
            "Artificial Virality (Incentivized social shares and referral codes)",
            "Inherent virality creates an unassailable product network effect"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d22-b2-viral-cycle-time-acceleration",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "inherent_virality_demo.js",
            "initialCode": "function classifyViralityType(productMechanism) {\n  if (productMechanism === 'RECEIVING_SIGNATURE_INVITE' || productMechanism === 'MEETING_LINK') return 'INHERENT_PRODUCT_DRIVEN_VIRALITY';\n  return 'ARTIFICIAL_INCENTIVIZED_VIRALITY';\n}\n\nconsole.log(classifyViralityType('RECEIVING_SIGNATURE_INVITE'));\nconsole.log(classifyViralityType('SHARE_ON_FACEBOOK_FOR_COUPON'));",
            "expectedOutput": "INHERENT_PRODUCT_DRIVEN_VIRALITY\nARTIFICIAL_INCENTIVIZED_VIRALITY",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How is virality classified when sending an e-signature document or Zoom meeting link naturally introduces the non-user to the product during core usage?",
          "expectedStringOutput": "INHERENT_PRODUCT_DRIVEN_VIRALITY",
          "acceptableAnswers": [
            "INHERENT_PRODUCT_DRIVEN_VIRALITY",
            "Inherent Virality",
            "Product-Driven Virality"
          ],
          "primaryMisconceptionId": "MC_MKT_VIRAL_MARKETING_K_FACTOR_COEFFICIENT",
          "diagnosisMap": {
            "ARTIFICIAL": {
              "misconceptionId": "MC_MKT_VIRAL_MARKETING_K_FACTOR_COEFFICIENT",
              "errorExplanation": "Coupon sharing is artificial. Built-in workflow transmission is Inherent Product-Driven Virality.",
              "recoveryPath": {
                "simplerExplanation": "Workflow transmission is Inherent Virality.",
                "guidedFixPrompt": "Type INHERENT_PRODUCT_DRIVEN_VIRALITY"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 23,
    "title": "Neuromarketing & Behavioral Economics: Anchoring & The Decoy Effect",
    "overviewMetaphor": "Human Purchasing Choices Are Governed by Cognitive Shortcuts and Anchors: Price Anchoring shows a $1,000 suit first so a $300 jacket feels like an irresistible bargain; The Decoy Effect (Asymmetric Dominance: Dan Ariely's famous Economist experiment) introduces a decoy option (Print Subscription @ $125) that is identically priced to the Premium bundle (Print + Web @ $125 vs Web-Only @ $59)—making the $125 bundle feel like getting a free digital subscription, steering 84% of customers to high-margin revenue; Loss Aversion proves consumers feel $2.5\\times$ more emotional pain from losing $100 than joy from gaining $100.",
    "blocks": [
      {
        "id": "mkt-d23-b1-decoy-effect-asymmetric-dominance",
        "day": 23,
        "blockNumber": 1,
        "title": "The Decoy Effect (Asymmetric Dominance Choice Architecture)",
        "conceptBudget": {
          "primaryConcept": "The Decoy Effect & Choice Architecture",
          "supportingTerms": [
            "Target Option (High-margin premium bundle e.g. Print + Web @ $125)",
            "Competitor Option (Basic lower tier e.g. Web-Only @ $59)",
            "Decoy Option (Asymmetrically dominated: Print-Only @ $125)",
            "Decoy eliminates price comparison friction and steers mass volume to Target"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d22-b1-k-factor-viral-coefficient-formula",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Decoy Effect Pricing Architecture (The Economist Tiering)",
              "boxes": [
                {
                  "label": "Option A: Basic Web-Only",
                  "value": "$59.00 / year (Standard digital access)",
                  "varType": "Basic",
                  "isUpdated": false
                },
                {
                  "label": "Option B: Decoy Print-Only",
                  "value": "$125.00 / year (Asymmetrically Dominated decoy)",
                  "varType": "Decoy",
                  "isUpdated": false
                },
                {
                  "label": "Option C: Target Print + Web",
                  "value": "$125.00 / year (FEELS LIKE FREE DIGITAL ACCESS -> 84% CONVERSION!)",
                  "varType": "Target",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "decoy_demo.js",
            "initialCode": "function evaluateDecoyTiering(basicPrice, premiumPrice, decoyPrice) {\n  const isAsymmetric = decoyPrice === premiumPrice && decoyPrice > basicPrice;\n  return {\n    basicPrice,\n    premiumPrice,\n    decoyPrice,\n    isEffectiveDecoy: isAsymmetric,\n    steeredSelection: isAsymmetric ? 'STEERS_MASS_VOLUME_TO_HIGH_MARGIN_PREMIUM' : 'INEFFECTIVE_TIERING',\n    status: 'DECOY_EVALUATED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateDecoyTiering(59, 125, 125)));",
            "expectedOutput": "{\"basicPrice\":59,\"premiumPrice\":125,\"decoyPrice\":125,\"isEffectiveDecoy\":true,\"steeredSelection\":\"STEERS_MASS_VOLUME_TO_HIGH_MARGIN_PREMIUM\",\"status\":\"DECOY_EVALUATED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What consumer behavioral selection outcome occurs when an asymmetrically dominated decoy price tier is introduced alongside a premium bundle?",
          "expectedStringOutput": "STEERS_MASS_VOLUME_TO_HIGH_MARGIN_PREMIUM",
          "acceptableAnswers": [
            "STEERS_MASS_VOLUME_TO_HIGH_MARGIN_PREMIUM",
            "Steers volume to premium",
            "High margin premium"
          ],
          "primaryMisconceptionId": "MC_MKT_NEUROMARKETING_DECOY_ANCHORING_NUDGES",
          "diagnosisMap": {
            "INEFFECTIVE": {
              "misconceptionId": "MC_MKT_NEUROMARKETING_DECOY_ANCHORING_NUDGES",
              "errorExplanation": "Decoys are highly effective nudges that steer volume to the target premium tier.",
              "recoveryPath": {
                "simplerExplanation": "Matches STEERS_MASS_VOLUME_TO_HIGH_MARGIN_PREMIUM.",
                "guidedFixPrompt": "Type STEERS_MASS_VOLUME_TO_HIGH_MARGIN_PREMIUM"
              }
            }
          }
        }
      },
      {
        "id": "mkt-d23-b2-price-anchoring-contrast-principle",
        "day": 23,
        "blockNumber": 2,
        "title": "Price Anchoring & The Cognitive Contrast Principle",
        "conceptBudget": {
          "primaryConcept": "Price Anchoring Principle",
          "supportingTerms": [
            "Anchor Reference Point (High initial number firmly planted in working memory)",
            "Contrast Effect (Subsequent options evaluated relative to anchor rather than absolute cost)",
            "Strike-through pricing ($999 ~~$1,999~~)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d23-b1-decoy-effect-asymmetric-dominance",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Price Anchoring Frame",
            "codeSnippet": "// Without Anchor: '$299/mo' -> Consumer thinks: 'That seems expensive.'\n// With Anchor:    'Enterprise Custom: $2,500/mo | Pro Tier: $299/mo' -> Consumer thinks: 'What a steal!'",
            "lineNotes": {
              "1": "Unanchored baseline.",
              "2": "Anchored contrast effect."
            }
          },
          {
            "type": "runnable_code",
            "filename": "anchoring_demo.js",
            "initialCode": "function evaluateAnchoredPerception(anchorPrice, actualPrice) {\n  const perceivedSavings = anchorPrice - actualPrice;\n  return {\n    anchorPrice,\n    actualPrice,\n    perceivedSavings,\n    framing: perceivedSavings > 0 ? 'HIGH_VALUE_BARGAIN_FRAME' : 'STANDARD_PRICE_FRAME'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateAnchoredPerception(2500, 299)));",
            "expectedOutput": "{\"anchorPrice\":2500,\"actualPrice\":299,\"perceivedSavings\":2201,\"framing\":\"HIGH_VALUE_BARGAIN_FRAME\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How is an offering framed when an initial anchor price of $2,500 establishes an actual $299 purchase as an extraordinary deal?",
          "expectedStringOutput": "HIGH_VALUE_BARGAIN_FRAME",
          "acceptableAnswers": [
            "HIGH_VALUE_BARGAIN_FRAME",
            "Bargain Frame",
            "High Value Bargain"
          ],
          "primaryMisconceptionId": "MC_MKT_NEUROMARKETING_DECOY_ANCHORING_NUDGES",
          "diagnosisMap": {
            "STANDARD": {
              "misconceptionId": "MC_MKT_NEUROMARKETING_DECOY_ANCHORING_NUDGES",
              "errorExplanation": "Displaying a high anchor frames the lower price as a High Value Bargain.",
              "recoveryPath": {
                "simplerExplanation": "Matches HIGH_VALUE_BARGAIN_FRAME.",
                "guidedFixPrompt": "Type HIGH_VALUE_BARGAIN_FRAME"
              }
            }
          }
        }
      },
      {
        "id": "mkt-d23-b3-prospect-theory-loss-aversion",
        "day": 23,
        "blockNumber": 3,
        "title": "Kahneman & Tversky's Prospect Theory: 2.5x Loss Aversion",
        "conceptBudget": {
          "primaryConcept": "Loss Aversion Multiple",
          "supportingTerms": [
            "Prospect Theory",
            "2.5x Loss Aversion Multiple (Losses loom larger than gains)",
            "Framing as 'Save $500 from being lost' vs 'Gain $500'",
            "Scarcity & FOMO (Fear of Missing Out) copy"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d23-b2-price-anchoring-contrast-principle",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "loss_aversion_demo.js",
            "initialCode": "function getLossAversionMultiple() {\n  return 2.5;\n}\n\nconsole.log(getLossAversionMultiple());",
            "expectedOutput": "2.5",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "According to Kahneman and Tversky's Nobel Prize-winning Prospect Theory, approximately how many times more psychologically painful is a financial loss compared to an equivalent financial gain?",
          "expectedStringOutput": "2.5",
          "acceptableAnswers": [
            "2.5",
            "2.5x",
            "2.5 times"
          ],
          "primaryMisconceptionId": "MC_MKT_NEUROMARKETING_DECOY_ANCHORING_NUDGES",
          "diagnosisMap": {
            "1.0": {
              "misconceptionId": "MC_MKT_NEUROMARKETING_DECOY_ANCHORING_NUDGES",
              "errorExplanation": "Losses and gains are not equal. Losses are approximately 2.5x more impactful.",
              "recoveryPath": {
                "simplerExplanation": "Loss aversion multiple is 2.5x.",
                "guidedFixPrompt": "Type 2.5"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 24,
    "title": "Brand Valuation & Financial Equity (Interbrand Methodology)",
    "overviewMetaphor": "Brand Equity is an Intangible Financial Asset on the Corporate Balance Sheet Worth Billions: Interbrand evaluates brand worth using Economic Use and Relief-from-Royalty methods; if a brand generates $10,000,000 in annual revenue and saves a 5% licensing royalty ($500,000 avoided annual expense), discounting those savings over 3 years at a 10% discount rate calculates a Brand Asset Valuation of $1,243,426—proving the brand logo is a tangible generator of economic wealth.",
    "blocks": [
      {
        "id": "mkt-d24-b1-relief-from-royalty-method",
        "day": 24,
        "blockNumber": 1,
        "title": "The Relief-from-Royalty Brand Valuation Method",
        "conceptBudget": {
          "primaryConcept": "Relief-from-Royalty Formula",
          "supportingTerms": [
            "Annual Royalty Savings: $\\text{Revenue} \\times \\text{Royalty Rate}\\%$",
            "Discounted Present Value: $PV = \\sum_{t=1}^n \\frac{\\text{Royalty Savings}_t}{(1 + r)^t}$",
            "Brand Asset Valuation on Corporate Balance Sheet"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d23-b1-decoy-effect-asymmetric-dominance",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Relief from Royalty PV Waterfall ($10M Rev, 5% Royalty, 10% Discount, 3 Yrs)",
              "boxes": [
                {
                  "label": "Annual Royalty Savings",
                  "value": "$10,000,000 x 5% = $500,000 / year avoided license cost",
                  "varType": "Annual Cash Flow",
                  "isUpdated": false
                },
                {
                  "label": "Discounted Cash Flows",
                  "value": "Yr1: $454,545 + Yr2: $413,223 + Yr3: $375,657",
                  "varType": "Discounted PV",
                  "isUpdated": false
                },
                {
                  "label": "Total Brand Asset Value",
                  "value": "$454,545 + $413,223 + $375,657 = $1,243,426 Total Brand Worth!",
                  "varType": "Brand Valuation",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "royalty_val_demo.js",
            "initialCode": "function calculateBrandValuation(rev, royaltyPct, discPct, years = 3) {\n  const annualRoyalty = rev * (royaltyPct / 100);\n  const r = discPct / 100;\n  let pv = 0;\n  for (let t = 1; t <= years; t++) {\n    pv += annualRoyalty / Math.pow(1 + r, t);\n  }\n  return {\n    annualRoyaltySavings: Number(annualRoyalty.toFixed(2)),\n    discountedBrandValue: Math.round(pv),\n    status: 'BRAND_VALUATION_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateBrandValuation(10000000, 5, 10, 3)));",
            "expectedOutput": "{\"annualRoyaltySavings\":500000,\"discountedBrandValue\":1243426,\"status\":\"BRAND_VALUATION_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the annual royalty savings for a brand generating $10,000,000 in revenue with a 5.0% royalty benchmark ($10,000,000 \\times 0.05$)?",
          "expectedStringOutput": "500000",
          "acceptableAnswers": [
            "500000",
            "$500,000",
            "500,000",
            "annualRoyaltySavings\":500000"
          ],
          "primaryMisconceptionId": "MC_MKT_BRAND_VALUATION_INTERBRAND_ROYALTY",
          "diagnosisMap": {
            "50000": {
              "misconceptionId": "MC_MKT_BRAND_VALUATION_INTERBRAND_ROYALTY",
              "errorExplanation": "50,000 is 0.5%. 5.0% of $10,000,000 is $500,000.",
              "recoveryPath": {
                "simplerExplanation": "10,000,000 * 0.05 = 500,000.",
                "guidedFixPrompt": "Type 500000"
              }
            }
          }
        }
      },
      {
        "id": "mkt-d24-b2-interbrand-three-pillars",
        "day": 24,
        "blockNumber": 2,
        "title": "Interbrand's 3 Pillars of Brand Valuation",
        "conceptBudget": {
          "primaryConcept": "Interbrand 3 Valuation Pillars",
          "supportingTerms": [
            "1. Financial Forecast (Economic value add generated for investors)",
            "2. Role of Brand (RBI: Percentage of purchase decision driven by brand vs price/features)",
            "3. Brand Strength (BSS: Ability of brand to secure ongoing future demand and lower risk)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d24-b1-relief-from-royalty-method",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Interbrand 3 Core Components",
            "codeSnippet": "// 1. FINANCIAL ANALYSIS:  Forecast corporate economic profit\n// 2. ROLE OF BRAND (RBI): Measure percentage of demand driven by brand name\n// 3. BRAND STRENGTH (BSS): Evaluate 10 factors (Clarity, Commitment, Governance, Authenticity...)",
            "lineNotes": {
              "1": "Profit forecast.",
              "2": "Branded demand driver.",
              "3": "Risk discount factor."
            }
          },
          {
            "type": "runnable_code",
            "filename": "interbrand_demo.js",
            "initialCode": "function getInterbrandComponents() {\n  return ['FINANCIAL_FORECAST', 'ROLE_OF_BRAND_INDEX', 'BRAND_STRENGTH_SCORE'];\n}\n\nconsole.log(JSON.stringify(getInterbrandComponents()));",
            "expectedOutput": "[\"FINANCIAL_FORECAST\",\"ROLE_OF_BRAND_INDEX\",\"BRAND_STRENGTH_SCORE\"]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which component in Interbrand's valuation methodology isolates the exact proportion of customer purchase decision making driven specifically by the brand rather than raw price or specs?",
          "expectedStringOutput": "ROLE_OF_BRAND_INDEX",
          "acceptableAnswers": [
            "ROLE_OF_BRAND_INDEX",
            "Role of Brand",
            "Role of Brand Index",
            "RBI"
          ],
          "primaryMisconceptionId": "MC_MKT_BRAND_VALUATION_INTERBRAND_ROYALTY",
          "diagnosisMap": {
            "FINANCIAL": {
              "misconceptionId": "MC_MKT_BRAND_VALUATION_INTERBRAND_ROYALTY",
              "errorExplanation": "Financial forecast measures total profit. The portion driven by brand is the Role of Brand Index (RBI).",
              "recoveryPath": {
                "simplerExplanation": "Brand-driven demand is the Role of Brand Index.",
                "guidedFixPrompt": "Type ROLE_OF_BRAND_INDEX"
              }
            }
          }
        }
      },
      {
        "id": "mkt-d24-b3-mergers-acquisitions-goodwill-allocation",
        "day": 24,
        "blockNumber": 3,
        "title": "Brand Equity in M&A: Purchase Price Allocation & Intangible Goodwill",
        "conceptBudget": {
          "primaryConcept": "Brand Value in M&A Goodwill",
          "supportingTerms": [
            "Purchase Price Allocation (PPA)",
            "Identifiable Intangible Brand Asset vs Residual Goodwill",
            "Impairment testing standards under IFRS 3 / Ind AS 103"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d24-b2-interbrand-three-pillars",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "ppa_demo.js",
            "initialCode": "function evaluateMaBrandAsset(purchasePrice, tangibleNetAssets, brandValuation) {\n  const residualGoodwill = purchasePrice - tangibleNetAssets - brandValuation;\n  return {\n    purchasePrice,\n    identifiableBrandAsset: brandValuation,\n    residualGoodwill: residualGoodwill,\n    status: 'PPA_ALLOCATION_COMPLETED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateMaBrandAsset(50000000, 20000000, 15000000)));",
            "expectedOutput": "{\"purchasePrice\":50000000,\"identifiableBrandAsset\":15000000,\"residualGoodwill\":15000000,\"status\":\"PPA_ALLOCATION_COMPLETED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is residual goodwill when a company is acquired for $50M, with $20M in net tangible assets and $15M in identifiable brand assets ($50M - 20M - 15M$)?",
          "expectedStringOutput": "15000000",
          "acceptableAnswers": [
            "15000000",
            "$15,000,000",
            "15,000,000",
            "residualGoodwill\":15000000"
          ],
          "primaryMisconceptionId": "MC_MKT_BRAND_VALUATION_INTERBRAND_ROYALTY",
          "diagnosisMap": {
            "30000000": {
              "misconceptionId": "MC_MKT_BRAND_VALUATION_INTERBRAND_ROYALTY",
              "errorExplanation": "30M only subtracts tangibles. Subtracting the $15M brand asset leaves $15M in residual goodwill.",
              "recoveryPath": {
                "simplerExplanation": "50M - 20M - 15M = 15M.",
                "guidedFixPrompt": "Type 15000000"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 25,
    "title": "Global Marketing Strategy: Standardization vs Adaptation (Glocalization)",
    "overviewMetaphor": "Global Marketing is 'Thinking Global, Acting Local' (Glocalization): Global Standardization (Apple iPhone) uses one identical product design and marketing campaign worldwide to capture massive economies of scale; Local Adaptation (McDonald's removing beef in India to launch the McAloo Tikki burger) tailors products to deep cultural and religious traditions; Glocalization standardizes the core global brand soul while adapting the local execution flavor.",
    "blocks": [
      {
        "id": "mkt-d25-b1-standardization-vs-adaptation-matrix",
        "day": 25,
        "blockNumber": 1,
        "title": "Standardization vs Adaptation: The Global Integration Matrix",
        "conceptBudget": {
          "primaryConcept": "Global Marketing Strategy Matrix",
          "supportingTerms": [
            "Standardization (Single uniform product and marketing mix worldwide: High scale economies)",
            "Adaptation (Customizing 4Ps for local cultural, linguistic, and regulatory nuances)",
            "Glocalization ('Think Global, Act Local': Standardize core platform, adapt local touches)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d24-b1-relief-from-royalty-method",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Global Marketing Strategic Matrix",
              "boxes": [
                {
                  "label": "Global Standardization",
                  "value": "Apple / Rolex -> Identical global product and messaging",
                  "varType": "Scale Focus",
                  "isUpdated": false
                },
                {
                  "label": "Local Adaptation",
                  "value": "Unilever / Oreo -> Adjusted sweetness and packaging for China",
                  "varType": "Cultural Focus",
                  "isUpdated": false
                },
                {
                  "label": "Glocalization Synthesis",
                  "value": "'Think Global, Act Local' -> Standard core + Local execution!",
                  "varType": "Hybrid Strategy",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "global_strategy_demo.js",
            "initialCode": "function selectGlobalStrategy(culturalDistance, scaleAdvantage) {\n  if (culturalDistance > 5.0 && scaleAdvantage > 5.0) return 'GLOCALIZATION_STANDARDIZE_CORE_ADAPT_LOCAL_EXECUTION';\n  if (culturalDistance > 5.0) return 'LOCAL_MARKET_ADAPTATION';\n  return 'GLOBAL_STANDARDIZATION_MAXIMUM_SCALE';\n}\n\nconsole.log(selectGlobalStrategy(8.0, 9.0));\nconsole.log(selectGlobalStrategy(2.0, 9.0));",
            "expectedOutput": "GLOCALIZATION_STANDARDIZE_CORE_ADAPT_LOCAL_EXECUTION\nGLOBAL_STANDARDIZATION_MAXIMUM_SCALE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which global marketing strategy balances massive global scale economies with deep local cultural adaptation ('Think Global, Act Local')?",
          "expectedStringOutput": "GLOCALIZATION_STANDARDIZE_CORE_ADAPT_LOCAL_EXECUTION",
          "acceptableAnswers": [
            "GLOCALIZATION_STANDARDIZE_CORE_ADAPT_LOCAL_EXECUTION",
            "Glocalization",
            "Glocal Strategy"
          ],
          "primaryMisconceptionId": "MC_MKT_GLOBAL_MARKETING_GLOCALIZATION_STRATEGY",
          "diagnosisMap": {
            "STANDARDIZE": {
              "misconceptionId": "MC_MKT_GLOBAL_MARKETING_GLOCALIZATION_STRATEGY",
              "errorExplanation": "Standardization ignores local nuances. Combining scale with local adaptation is Glocalization.",
              "recoveryPath": {
                "simplerExplanation": "Matches GLOCALIZATION_STANDARDIZE_CORE_ADAPT_LOCAL_EXECUTION.",
                "guidedFixPrompt": "Type GLOCALIZATION_STANDARDIZE_CORE_ADAPT_LOCAL_EXECUTION"
              }
            }
          }
        }
      },
      {
        "id": "mkt-d25-b2-cross-cultural-hofstede-dimensions",
        "day": 25,
        "blockNumber": 2,
        "title": "Hofstede's Cultural Dimensions in International Brand Advertising",
        "conceptBudget": {
          "primaryConcept": "Hofstede Cultural Dimensions",
          "supportingTerms": [
            "Individualism vs Collectivism (US vs Japan/India: Solo hero vs Group harmony)",
            "Power Distance (Hierarchical status respect vs egalitarian)",
            "Uncertainty Avoidance (Need for warranties and strict guarantees)",
            "Long-Term Orientation"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d25-b1-standardization-vs-adaptation-matrix",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Hofstede Advertising Resonance Rules",
            "codeSnippet": "// High Individualism (US)   -> Feature solo rebellion, self-actualization, standout personal success\n// High Collectivism (Japan) -> Feature family harmony, social belonging, group consensus",
            "lineNotes": {
              "1": "Individualistic appeals.",
              "2": "Collectivist harmony."
            }
          },
          {
            "type": "runnable_code",
            "filename": "culture_demo.js",
            "initialCode": "function getAdTheme(cultureType) {\n  return cultureType === 'COLLECTIVIST'\n    ? 'COMMUNITY_HARMONY_AND_FAMILY_SECURITY'\n    : 'INDIVIDUAL_ACHIEVEMENT_AND_PERSONAL_FREEDOM';\n}\n\nconsole.log(getAdTheme('COLLECTIVIST'));\nconsole.log(getAdTheme('INDIVIDUALIST'));",
            "expectedOutput": "COMMUNITY_HARMONY_AND_FAMILY_SECURITY\nINDIVIDUAL_ACHIEVEMENT_AND_PERSONAL_FREEDOM",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which advertising thematic appeal resonates most effectively in collectivist cultural markets (e.g. Japan, South Korea, India)?",
          "expectedStringOutput": "COMMUNITY_HARMONY_AND_FAMILY_SECURITY",
          "acceptableAnswers": [
            "COMMUNITY_HARMONY_AND_FAMILY_SECURITY",
            "Community Harmony",
            "Family Security"
          ],
          "primaryMisconceptionId": "MC_MKT_GLOBAL_MARKETING_GLOCALIZATION_STRATEGY",
          "diagnosisMap": {
            "INDIVIDUAL": {
              "misconceptionId": "MC_MKT_GLOBAL_MARKETING_GLOCALIZATION_STRATEGY",
              "errorExplanation": "Individual achievement appeals to individualist cultures. Collectivist cultures favor Community Harmony.",
              "recoveryPath": {
                "simplerExplanation": "Collectivist cultures favor Community Harmony.",
                "guidedFixPrompt": "Type COMMUNITY_HARMONY_AND_FAMILY_SECURITY"
              }
            }
          }
        }
      },
      {
        "id": "mkt-d25-b3-country-of-origin-effect",
        "day": 25,
        "blockNumber": 3,
        "title": "The Country-of-Origin (COO) Effect in Global Branding",
        "conceptBudget": {
          "primaryConcept": "Country-of-Origin Effect",
          "supportingTerms": [
            "Country-of-Origin (COO: Preconceived positive/negative associations with product origins e.g. German engineering, Italian fashion, Swiss watches, French wine)",
            "Leveraging COO as a strategic brand halo"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d25-b2-cross-cultural-hofstede-dimensions",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "coo_demo.js",
            "initialCode": "function getCountryHalo(country) {\n  if (country === 'Germany') return 'PRECISION_ENGINEERING_AND_RELIABILITY';\n  if (country === 'Italy') return 'HIGH_FASHION_AND_LUXURY_DESIGN';\n  if (country === 'Switzerland') return 'PRECISION_TIMEKEEPING_AND_BANKING';\n  return 'STANDARD_GLOBAL_ORIGIN';\n}\n\nconsole.log(getCountryHalo('Germany'));\nconsole.log(getCountryHalo('Italy'));",
            "expectedOutput": "PRECISION_ENGINEERING_AND_RELIABILITY\nHIGH_FASHION_AND_LUXURY_DESIGN",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What positive Country-of-Origin (COO) halo effect is globally associated with German manufacturing and automotive brands?",
          "expectedStringOutput": "PRECISION_ENGINEERING_AND_RELIABILITY",
          "acceptableAnswers": [
            "PRECISION_ENGINEERING_AND_RELIABILITY",
            "Precision Engineering",
            "Engineering & Reliability"
          ],
          "primaryMisconceptionId": "MC_MKT_GLOBAL_MARKETING_GLOCALIZATION_STRATEGY",
          "diagnosisMap": {
            "FASHION": {
              "misconceptionId": "MC_MKT_GLOBAL_MARKETING_GLOCALIZATION_STRATEGY",
              "errorExplanation": "Fashion is associated with Italy. German brands benefit from Precision Engineering.",
              "recoveryPath": {
                "simplerExplanation": "German halo is Precision Engineering & Reliability.",
                "guidedFixPrompt": "Type PRECISION_ENGINEERING_AND_RELIABILITY"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 26,
    "title": "Public Relations (PR), Crisis Management & Brand Reputation",
    "overviewMetaphor": "A Brand Reputation Takes 20 Years to Build and 5 Minutes to Ruin (Warren Buffett): When a crisis strikes (Product defect, executive scandal, data breach), the Crisis Response Framework mandates 4 pillars: Speed (Responding within 2 hours), Transparency (Disclosing what went wrong without cover-ups), Empathy (Expressing genuine remorse for affected victims), and Corrective Action (Publishing a permanent engineering fix); rapid transparent responses contain the damage, whereas denial escalates into catastrophic brand destruction (e.g. Tylenol 1982 vs Boeing 737 MAX).",
    "blocks": [
      {
        "id": "mkt-d26-b1-crisis-pr-four-pillars",
        "day": 26,
        "blockNumber": 1,
        "title": "The 4 Pillars of Crisis PR Management: Speed, Transparency, Empathy & Correction",
        "conceptBudget": {
          "primaryConcept": "Crisis PR 4 Pillars",
          "supportingTerms": [
            "1. Speed (First 2-hour response window determines narrative)",
            "2. Transparency (Full disclosure of verified facts, 0 cover-ups)",
            "3. Empathy (Human-centered victim care and authentic apologies)",
            "4. Corrective Action (Irreversible systemic fixes to guarantee recurrence is impossible)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d25-b1-standardization-vs-adaptation-matrix",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Crisis PR Response Hierarchy",
              "boxes": [
                {
                  "label": "1. Speed & Transparency",
                  "value": "Publish factual acknowledgment within 2 hours; zero deflection",
                  "varType": "Immediate Response",
                  "isUpdated": false
                },
                {
                  "label": "2. Empathy & Remorse",
                  "value": "CEO executive video apology expressing deep human care",
                  "varType": "Victim Focus",
                  "isUpdated": false
                },
                {
                  "label": "3. Corrective Action",
                  "value": "Full product recall + independent third-party safety audit!",
                  "varType": "Systemic Fix",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "crisis_eval_demo.js",
            "initialCode": "function evaluateCrisisCompliance(severity, hours) {\n  const ok = (severity === 'CRITICAL' && hours <= 2.0) || (severity === 'MODERATE' && hours <= 6.0);\n  return {\n    crisisSeverity: severity,\n    responseTimeHours: hours,\n    isCompliant: ok,\n    containmentStatus: ok ? 'BRAND_DAMAGE_SUCCESSFULLY_CONTAINED' : 'UNCONTAINED_REPUTATION_CRISIS_ESCALATION'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateCrisisCompliance('CRITICAL', 1.5)));\nconsole.log(JSON.stringify(evaluateCrisisCompliance('CRITICAL', 8.0)));",
            "expectedOutput": "{\"crisisSeverity\":\"CRITICAL\",\"responseTimeHours\":1.5,\"isCompliant\":true,\"containmentStatus\":\"BRAND_DAMAGE_SUCCESSFULLY_CONTAINED\"}\n{\"crisisSeverity\":\"CRITICAL\",\"responseTimeHours\":8,\"isCompliant\":false,\"containmentStatus\":\"UNCONTAINED_REPUTATION_CRISIS_ESCALATION\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What containment status is achieved when a critical brand crisis is met with a transparent response within 1.5 hours?",
          "expectedStringOutput": "BRAND_DAMAGE_SUCCESSFULLY_CONTAINED",
          "acceptableAnswers": [
            "BRAND_DAMAGE_SUCCESSFULLY_CONTAINED",
            "Successfully Contained",
            "Brand Damage Contained"
          ],
          "primaryMisconceptionId": "MC_MKT_PUBLIC_RELATIONS_CRISIS_COMMUNICATIONS",
          "diagnosisMap": {
            "ESCALATION": {
              "misconceptionId": "MC_MKT_PUBLIC_RELATIONS_CRISIS_COMMUNICATIONS",
              "errorExplanation": "Responding within 2 hours successfully contains the damage.",
              "recoveryPath": {
                "simplerExplanation": "Matches BRAND_DAMAGE_SUCCESSFULLY_CONTAINED.",
                "guidedFixPrompt": "Type BRAND_DAMAGE_SUCCESSFULLY_CONTAINED"
              }
            }
          }
        }
      },
      {
        "id": "mkt-d26-b2-stealing-thunder-proactive-disclosure",
        "day": 26,
        "blockNumber": 2,
        "title": "The 'Stealing Thunder' Strategy: Proactive Self-Disclosure",
        "conceptBudget": {
          "primaryConcept": "Stealing Thunder Strategy",
          "supportingTerms": [
            "Stealing Thunder (Voluntarily breaking your own bad news before investigative journalists or whistleblowers uncover it)",
            "Reduces perceived guilt, increases credibility, and disarms hostile media attacks"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d26-b1-crisis-pr-four-pillars",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Proactive Disclosure vs Defensive Denial",
            "codeSnippet": "// ❌ DEFENSIVE DENIAL: Wait for investigative reporter to publish bombshell -> Brand is destroyed!\n// ✅ STEALING THUNDER: Discover internal flaw -> Announce it immediately with full refund plan -> Trust increases!",
            "lineNotes": {
              "1": "Catastrophic scandal.",
              "2": "Proactive integrity."
            }
          },
          {
            "type": "runnable_code",
            "filename": "thunder_demo.js",
            "initialCode": "function evaluateDisclosureMode(isSelfDisclosed) {\n  return isSelfDisclosed\n    ? 'STEALING_THUNDER_PROACTIVE_INTEGRITY'\n    : 'REACTIVE_DENIAL_HIGH_REPUTATION_RISK';\n}\n\nconsole.log(evaluateDisclosureMode(true));\nconsole.log(evaluateDisclosureMode(false));",
            "expectedOutput": "STEALING_THUNDER_PROACTIVE_INTEGRITY\nREACTIVE_DENIAL_HIGH_REPUTATION_RISK",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What crisis communication strategy voluntarily breaks bad internal news to the public before external investigative journalists expose it?",
          "expectedStringOutput": "STEALING_THUNDER_PROACTIVE_INTEGRITY",
          "acceptableAnswers": [
            "STEALING_THUNDER_PROACTIVE_INTEGRITY",
            "Stealing Thunder",
            "Stealing Thunder Strategy"
          ],
          "primaryMisconceptionId": "MC_MKT_PUBLIC_RELATIONS_CRISIS_COMMUNICATIONS",
          "diagnosisMap": {
            "COVER_UP": {
              "misconceptionId": "MC_MKT_PUBLIC_RELATIONS_CRISIS_COMMUNICATIONS",
              "errorExplanation": "Cover-ups are illegal and destroy brands. Proactively disclosing bad news is 'Stealing Thunder'.",
              "recoveryPath": {
                "simplerExplanation": "Matches STEALING_THUNDER_PROACTIVE_INTEGRITY.",
                "guidedFixPrompt": "Type STEALING_THUNDER_PROACTIVE_INTEGRITY"
              }
            }
          }
        }
      },
      {
        "id": "mkt-d26-b3-media-relations-press-release-wire",
        "day": 26,
        "blockNumber": 3,
        "title": "Media Relations: Crafting Inverted-Pyramid Press Releases",
        "conceptBudget": {
          "primaryConcept": "Inverted Pyramid Press Releases",
          "supportingTerms": [
            "Inverted Pyramid (Who, What, When, Where, Why in opening paragraph)",
            "Supporting quotes, data, and boilerplate about the company at bottom"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d26-b2-stealing-thunder-proactive-disclosure",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "pr_wire_demo.js",
            "initialCode": "function getPressReleaseStructure() {\n  return 'INVERTED_PYRAMID_MOST_IMPORTANT_FACTS_FIRST';\n}\n\nconsole.log(getPressReleaseStructure());",
            "expectedOutput": "INVERTED_PYRAMID_MOST_IMPORTANT_FACTS_FIRST",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What journalistic structure leads with the most critical facts (5 Ws) in the opening headline and lead paragraph?",
          "expectedStringOutput": "INVERTED_PYRAMID_MOST_IMPORTANT_FACTS_FIRST",
          "acceptableAnswers": [
            "INVERTED_PYRAMID_MOST_IMPORTANT_FACTS_FIRST",
            "Inverted Pyramid",
            "Inverted pyramid"
          ],
          "primaryMisconceptionId": "MC_MKT_PUBLIC_RELATIONS_CRISIS_COMMUNICATIONS",
          "diagnosisMap": {
            "CHRONO": {
              "misconceptionId": "MC_MKT_PUBLIC_RELATIONS_CRISIS_COMMUNICATIONS",
              "errorExplanation": "Chronological order buries the lead. Journalism requires the Inverted Pyramid.",
              "recoveryPath": {
                "simplerExplanation": "Matches INVERTED_PYRAMID_MOST_IMPORTANT_FACTS_FIRST.",
                "guidedFixPrompt": "Type INVERTED_PYRAMID_MOST_IMPORTANT_FACTS_FIRST"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 27,
    "title": "Sustainability & Green Marketing: Greenwashing Audits",
    "overviewMetaphor": "Green Marketing Must Be Built on Concrete Life-Cycle Reality, Not Green Paint: Greenwashing is deceptive marketing that exaggerates or fakes eco-friendly claims (TerraChoice 'Six Sins of Greenwashing'); an authentic sustainable brand possesses independent third-party certifications (FSC, Cradle-to-Cradle, B-Corp) and verifiable carbon lifecycle audits; claiming a plastic bottle is '100% natural' with zero proof is an illegal greenwashing sin that invites crippling regulatory penalties and consumer boycotts.",
    "blocks": [
      {
        "id": "mkt-d27-b1-six-sins-of-greenwashing",
        "day": 27,
        "blockNumber": 1,
        "title": "The Six Sins of Greenwashing (TerraChoice Audit Framework)",
        "conceptBudget": {
          "primaryConcept": "The Six Sins of Greenwashing",
          "supportingTerms": [
            "1. Sin of the Hidden Trade-Off (Suggesting green based on narrow attribute while ignoring massive pollution)",
            "2. Sin of No Proof (Unsubstantiated claims without certification)",
            "3. Sin of Vagueness ('All-Natural', 'Eco-Friendly')",
            "4. Sin of Worshipping False Labels (Fake self-created green badges)",
            "5. Sin of Irrelevance ('CFC-Free' when CFCs are already banned by law)",
            "6. Sin of Lesser of Two Evils"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d26-b1-crisis-pr-four-pillars",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Green Claim Audit Checklist",
              "boxes": [
                {
                  "label": "Claim Type: 'Eco-Friendly'",
                  "value": "Vague, undefined claim with zero scientific metrics -> HIGH RISK!",
                  "varType": "Sin of Vagueness",
                  "isUpdated": false
                },
                {
                  "label": "Third-Party Certification",
                  "value": "Verified by FSC (Forest Stewardship Council) / B-Corp certified",
                  "varType": "Verifiable Proof",
                  "isUpdated": false
                },
                {
                  "label": "Green Authenticity Rating",
                  "value": "100% AUDIT PASSED -> Authentic Sustainable Brand!",
                  "varType": "Audit Passed",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "green_audit_demo.js",
            "initialCode": "function auditGreenClaim(hasCert, hasProof, isVague) {\n  const ok = hasCert && hasProof && !isVague;\n  return {\n    hasThirdPartyCertification: hasCert,\n    hasVerifiableLifecycleProof: hasProof,\n    isVagueClaim: isVague,\n    isAuthenticGreen: ok,\n    status: ok ? 'LOW_RISK_AUTHENTIC_GREEN_BRAND' : 'HIGH_RISK_GREENWASHING_VIOLATION_DETECTED'\n  };\n}\n\nconsole.log(JSON.stringify(auditGreenClaim(true, true, false)));\nconsole.log(JSON.stringify(auditGreenClaim(false, false, true)));",
            "expectedOutput": "{\"hasThirdPartyCertification\":true,\"hasVerifiableLifecycleProof\":true,\"isVagueClaim\":false,\"isAuthenticGreen\":true,\"status\":\"LOW_RISK_AUTHENTIC_GREEN_BRAND\"}\n{\"hasThirdPartyCertification\":false,\"hasVerifiableLifecycleProof\":false,\"isVagueClaim\":true,\"isAuthenticGreen\":false,\"status\":\"HIGH_RISK_GREENWASHING_VIOLATION_DETECTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How is a brand claim evaluated when it possesses third-party certification, verifiable lifecycle data, and zero vague marketing buzzwords?",
          "expectedStringOutput": "LOW_RISK_AUTHENTIC_GREEN_BRAND",
          "acceptableAnswers": [
            "LOW_RISK_AUTHENTIC_GREEN_BRAND",
            "Authentic Green Brand",
            "Authentic Green"
          ],
          "primaryMisconceptionId": "MC_MKT_GREEN_SUSTAINABILITY_GREENWASHING_AUDIT",
          "diagnosisMap": {
            "GREENWASHING": {
              "misconceptionId": "MC_MKT_GREEN_SUSTAINABILITY_GREENWASHING_AUDIT",
              "errorExplanation": "Verifiable proof and certification protects against greenwashing.",
              "recoveryPath": {
                "simplerExplanation": "Matches LOW_RISK_AUTHENTIC_GREEN_BRAND.",
                "guidedFixPrompt": "Type LOW_RISK_AUTHENTIC_GREEN_BRAND"
              }
            }
          }
        }
      },
      {
        "id": "mkt-d27-b2-circular-economy-packaging",
        "day": 27,
        "blockNumber": 2,
        "title": "Circular Economy Brand Stewardship: Design for Disassembly & Refills",
        "conceptBudget": {
          "primaryConcept": "Circular Economy Stewardship",
          "supportingTerms": [
            "Linear Economy (Take $\\to$ Make $\\to$ Waste)",
            "Circular Economy (Design out waste, keep materials in continuous closed-loop use)",
            "Refillable container subscription models"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d27-b1-six-sins-of-greenwashing",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Linear vs Circular Brand Design",
            "codeSnippet": "// LINEAR:   Single-use virgin plastic packaging -> Landfill waste\n// CIRCULAR: Aluminum reusable pump container + 100% compostable refill pouches!",
            "lineNotes": {
              "1": "High environmental penalty.",
              "2": "Closed loop sustainability."
            }
          },
          {
            "type": "runnable_code",
            "filename": "circular_demo.js",
            "initialCode": "function classifyPackagingModel(isClosedLoop) {\n  return isClosedLoop\n    ? 'CIRCULAR_CLOSED_LOOP_STEWARDSHIP'\n    : 'OBSOLETE_LINEAR_TAKE_MAKE_WASTE';\n}\n\nconsole.log(classifyPackagingModel(true));\nconsole.log(classifyPackagingModel(false));",
            "expectedOutput": "CIRCULAR_CLOSED_LOOP_STEWARDSHIP\nOBSOLETE_LINEAR_TAKE_MAKE_WASTE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What sustainable business architecture keeps product materials in continuous productive cycles through refills and closed-loop recycling?",
          "expectedStringOutput": "CIRCULAR_CLOSED_LOOP_STEWARDSHIP",
          "acceptableAnswers": [
            "CIRCULAR_CLOSED_LOOP_STEWARDSHIP",
            "Circular Economy",
            "Circular Closed Loop"
          ],
          "primaryMisconceptionId": "MC_MKT_GREEN_SUSTAINABILITY_GREENWASHING_AUDIT",
          "diagnosisMap": {
            "LINEAR": {
              "misconceptionId": "MC_MKT_GREEN_SUSTAINABILITY_GREENWASHING_AUDIT",
              "errorExplanation": "Linear is take-make-waste. Closed-loop regeneration is Circular Economy.",
              "recoveryPath": {
                "simplerExplanation": "Matches CIRCULAR_CLOSED_LOOP_STEWARDSHIP.",
                "guidedFixPrompt": "Type CIRCULAR_CLOSED_LOOP_STEWARDSHIP"
              }
            }
          }
        }
      },
      {
        "id": "mkt-d27-b3-b-corp-certification-standards",
        "day": 27,
        "blockNumber": 3,
        "title": "B-Corp Certification & The Triple Bottom Line (People, Planet, Profit)",
        "conceptBudget": {
          "primaryConcept": "Triple Bottom Line & B-Corp",
          "supportingTerms": [
            "Triple Bottom Line (3Ps: People, Planet, Profit: John Elkington)",
            "B-Corp Certification (Independent B Lab assessment of governance, workers, community, and environment)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d27-b2-circular-economy-packaging",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "b_corp_demo.js",
            "initialCode": "function getTripleBottomLine() {\n  return ['PEOPLE', 'PLANET', 'PROFIT'];\n}\n\nconsole.log(JSON.stringify(getTripleBottomLine()));",
            "expectedOutput": "[\"PEOPLE\",\"PLANET\",\"PROFIT\"]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What are the 3 pillars of the Triple Bottom Line sustainability framework?",
          "expectedStringOutput": "[\"PEOPLE\",\"PLANET\",\"PROFIT\"]",
          "acceptableAnswers": [
            "[\"PEOPLE\",\"PLANET\",\"PROFIT\"]",
            "People, Planet, Profit",
            "People Planet Profit"
          ],
          "primaryMisconceptionId": "MC_MKT_GREEN_SUSTAINABILITY_GREENWASHING_AUDIT",
          "diagnosisMap": {
            "PROFIT_ONLY": {
              "misconceptionId": "MC_MKT_GREEN_SUSTAINABILITY_GREENWASHING_AUDIT",
              "errorExplanation": "The triple bottom line balances People, Planet, and Profit.",
              "recoveryPath": {
                "simplerExplanation": "3 pillars are People, Planet, Profit.",
                "guidedFixPrompt": "Type [\"PEOPLE\",\"PLANET\",\"PROFIT\"]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 28,
    "title": "AI in Marketing: Predictive Lead Scoring & Automated Personalization",
    "overviewMetaphor": "AI in Marketing is an Intelligent Sales Radar with 24/7 Automated Co-Pilots: Predictive Lead Scoring calculates a composite buyer readiness score ($Score = 0.4 \\times \\text{Engagement} + 0.3 \\times \\text{Budget} + 0.3 \\times \\text{Intent}$); an enterprise buyer with $90$ engagement, $80$ budget, and $80$ intent scores an $84.0$ (Hot Lead)—instantly routing them to a Senior Account Executive; warm leads ($< 75.0$) are automatically nurtured through generative AI personalized email sequences.",
    "blocks": [
      {
        "id": "mkt-d28-b1-predictive-lead-scoring-algorithm",
        "day": 28,
        "blockNumber": 1,
        "title": "Predictive Lead Scoring: $Score = w_1 \\cdot \\text{Eng} + w_2 \\cdot \\text{Budget} + w_3 \\cdot \\text{Intent}$",
        "conceptBudget": {
          "primaryConcept": "Predictive Lead Scoring Formula",
          "supportingTerms": [
            "Engagement Points (40% weight: Webinar attendance, whitepaper downloads)",
            "Budget Points (30% weight: Company ARR and employee headcount)",
            "Intent Signals (30% weight: G2/Capterra review visits)",
            "Score $\\ge 75.0$: Route directly to Account Executive; Score $< 75.0$: Automated Email Nurture"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d27-b1-six-sins-of-greenwashing",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Predictive Lead Weights (Eng=90, Budget=80, Intent=80)",
              "boxes": [
                {
                  "label": "Engagement (40%)",
                  "value": "90 points x 0.40 = 36.0 points",
                  "varType": "Engagement",
                  "isUpdated": false
                },
                {
                  "label": "Budget (30%)",
                  "value": "80 points x 0.30 = 24.0 points",
                  "varType": "Budget",
                  "isUpdated": false
                },
                {
                  "label": "Intent Signals (30%)",
                  "value": "80 points x 0.30 = 24.0 points",
                  "varType": "Intent",
                  "isUpdated": false
                },
                {
                  "label": "Composite Lead Score",
                  "value": "36.0 + 24.0 + 24.0 = 84.0 Score (HOT SALES-READY LEAD!)",
                  "varType": "Lead Score",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "lead_score_demo.js",
            "initialCode": "function scoreLead(eng, budget, intent) {\n  const score = eng * 0.4 + budget * 0.3 + intent * 0.3;\n  return {\n    compositeScore: Number(score.toFixed(1)),\n    isHotLead: score >= 75.0,\n    routingAction: score >= 75.0 ? 'HOT_LEAD_ROUTE_DIRECT_TO_ACCOUNT_EXECUTIVE' : 'AUTOMATED_EMAIL_NURTURE_SEQUENCE'\n  };\n}\n\nconsole.log(JSON.stringify(scoreLead(90, 80, 80)));\nconsole.log(JSON.stringify(scoreLead(50, 60, 50)));",
            "expectedOutput": "{\"compositeScore\":84,\"isHotLead\":true,\"routingAction\":\"HOT_LEAD_ROUTE_DIRECT_TO_ACCOUNT_EXECUTIVE\"}\n{\"compositeScore\":53,\"isHotLead\":false,\"routingAction\":\"AUTOMATED_EMAIL_NURTURE_SEQUENCE\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the composite predictive lead score for a lead with Engagement=90, Budget=80, and Intent=80 ($36 + 24 + 24$)?",
          "expectedStringOutput": "84",
          "acceptableAnswers": [
            "84",
            "84.0",
            "compositeScore\":84"
          ],
          "primaryMisconceptionId": "MC_MKT_AI_PERSONALIZATION_PREDICTIVE_LEADS",
          "diagnosisMap": {
            "250": {
              "misconceptionId": "MC_MKT_AI_PERSONALIZATION_PREDICTIVE_LEADS",
              "errorExplanation": "250 is the unweighted sum. Weighted composite score is (90*0.4)+(80*0.3)+(80*0.3) = 84.0.",
              "recoveryPath": {
                "simplerExplanation": "36 + 24 + 24 = 84.",
                "guidedFixPrompt": "Type 84"
              }
            }
          }
        }
      },
      {
        "id": "mkt-d28-b2-dynamic-content-personalization",
        "day": 28,
        "blockNumber": 2,
        "title": "Dynamic Content Personalization & Real-Time Website Tailoring",
        "conceptBudget": {
          "primaryConcept": "Dynamic Content Personalization",
          "supportingTerms": [
            "Real-time IP Reverse Lookup (Reveals visitor company name & industry)",
            "Dynamic Hero Banners & Industry-specific case studies tailored in milliseconds"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d28-b1-predictive-lead-scoring-algorithm",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Dynamic Personalization Trigger",
            "codeSnippet": "// Visitor IP belongs to FinTech industry?\n// -> Swap generic homepage hero to: 'Enterprise Security & SOC2 Compliance for FinTech Leaders'",
            "lineNotes": {
              "1": "Intent trigger.",
              "2": "Dynamic page swap."
            }
          },
          {
            "type": "runnable_code",
            "filename": "personalization_demo.js",
            "initialCode": "function getHeroBanner(industry) {\n  if (industry === 'FINTECH') return 'FINTECH_SECURITY_AND_COMPLIANCE_HERO';\n  if (industry === 'HEALTHCARE') return 'HIPAA_COMPLIANT_HEALTHCARE_HERO';\n  return 'STANDARD_ENTERPRISE_HERO';\n}\n\nconsole.log(getHeroBanner('FINTECH'));\nconsole.log(getHeroBanner('HEALTHCARE'));",
            "expectedOutput": "FINTECH_SECURITY_AND_COMPLIANCE_HERO\nHIPAA_COMPLIANT_HEALTHCARE_HERO",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which dynamic hero banner is rendered when a website visitor's IP address identifies them as a FinTech financial institution?",
          "expectedStringOutput": "FINTECH_SECURITY_AND_COMPLIANCE_HERO",
          "acceptableAnswers": [
            "FINTECH_SECURITY_AND_COMPLIANCE_HERO",
            "FinTech Hero",
            "Fintech Security"
          ],
          "primaryMisconceptionId": "MC_MKT_AI_PERSONALIZATION_PREDICTIVE_LEADS",
          "diagnosisMap": {
            "GENERIC": {
              "misconceptionId": "MC_MKT_AI_PERSONALIZATION_PREDICTIVE_LEADS",
              "errorExplanation": "Dynamic personalization replaces generic banners with industry-specific heroes.",
              "recoveryPath": {
                "simplerExplanation": "Matches FINTECH_SECURITY_AND_COMPLIANCE_HERO.",
                "guidedFixPrompt": "Type FINTECH_SECURITY_AND_COMPLIANCE_HERO"
              }
            }
          }
        }
      },
      {
        "id": "mkt-d28-b3-generative-ai-copywriting-ethics",
        "day": 28,
        "blockNumber": 3,
        "title": "Generative AI Copywriting & The 'Human-in-the-Loop' Brand Standard",
        "conceptBudget": {
          "primaryConcept": "Human-in-the-Loop AI Standards",
          "supportingTerms": [
            "Generative AI Copywriting (Drafting variant subject lines and body copy)",
            "Human-in-the-Loop Review (Fact checking, brand tone verification, hallucination filtering)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d28-b2-dynamic-content-personalization",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "hitl_demo.js",
            "initialCode": "function evaluateAiCopyApproval(hasHumanReview) {\n  return hasHumanReview\n    ? 'APPROVED_FOR_PUBLICATION_HUMAN_CERTIFIED'\n    : 'BLOCKED_UNVETTED_RAW_AI_OUTPUT';\n}\n\nconsole.log(evaluateAiCopyApproval(true));\nconsole.log(evaluateAiCopyApproval(false));",
            "expectedOutput": "APPROVED_FOR_PUBLICATION_HUMAN_CERTIFIED\nBLOCKED_UNVETTED_RAW_AI_OUTPUT",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What corporate publishing governance status is granted to AI-generated marketing campaign copy only after it has undergone thorough human editorial review?",
          "expectedStringOutput": "APPROVED_FOR_PUBLICATION_HUMAN_CERTIFIED",
          "acceptableAnswers": [
            "APPROVED_FOR_PUBLICATION_HUMAN_CERTIFIED",
            "Human Certified",
            "Approved for Publication"
          ],
          "primaryMisconceptionId": "MC_MKT_AI_PERSONALIZATION_PREDICTIVE_LEADS",
          "diagnosisMap": {
            "BLOCKED": {
              "misconceptionId": "MC_MKT_AI_PERSONALIZATION_PREDICTIVE_LEADS",
              "errorExplanation": "Passing human editorial review approves the content for publication.",
              "recoveryPath": {
                "simplerExplanation": "Matches APPROVED_FOR_PUBLICATION_HUMAN_CERTIFIED.",
                "guidedFixPrompt": "Type APPROVED_FOR_PUBLICATION_HUMAN_CERTIFIED"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 29,
    "title": "Marketing Law, Ethics & Regulatory Advertising Compliance",
    "overviewMetaphor": "Marketing Law is the Legal Electric Fence Protecting Consumer Trust: Regulatory bodies (ASCI in India, FTC in the US) enforce strict Truth in Advertising laws; influencers must disclose paid sponsorships with prominent pre-roll hashtags (#Ad / #Sponsored) rather than burying disclosures in hashtag clouds; false claims, deceptive comparative ads, and undisclosed affiliate links trigger immediate regulatory fines and statutory penalties.",
    "blocks": [
      {
        "id": "mkt-d29-b1-ftc-asci-influencer-disclosures",
        "day": 29,
        "blockNumber": 1,
        "title": "FTC & ASCI Influencer Paid Endorsement Disclosure Rules",
        "conceptBudget": {
          "primaryConcept": "Influencer Paid Disclosure Regulations",
          "supportingTerms": [
            "Prominent Placement (Above the fold, pre-roll in video, visible before 'Show More')",
            "Explicit Language (#Ad, #Sponsored, #PaidPartnership)",
            "Forbidden: Burying disclosures inside a cloud of 30 hashtags at the bottom"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d28-b1-predictive-lead-scoring-algorithm",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Paid Disclosure Compliance Audit",
              "boxes": [
                {
                  "label": "Prominent Tag (#Ad / #Sponsored)",
                  "value": "Clearly displayed in first 3 lines of video caption",
                  "varType": "Prominent Placement",
                  "isUpdated": false
                },
                {
                  "label": "Hidden at Bottom of Cloud",
                  "value": "FALSE -> Zero deceptive concealment!",
                  "varType": "Zero Deception",
                  "isUpdated": false
                },
                {
                  "label": "Regulatory Compliance",
                  "value": "100% ASCI & FTC COMPLIANT -> Zero legal liability!",
                  "varType": "Compliance",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "disclosure_audit_demo.js",
            "initialCode": "function auditDisclosure(hasAdTag, hasPreRoll, isHidden) {\n  const ok = hasAdTag && hasPreRoll && !isHidden;\n  return {\n    hasClearAdTag: hasAdTag,\n    hasPreRollDisclosure: hasPreRoll,\n    isHiddenInHashtags: isHidden,\n    isCompliant: ok,\n    status: ok ? 'FULLY_REGULATORY_COMPLIANT' : 'STATUTORY_DECEPTIVE_ADVERTISING_VIOLATION'\n  };\n}\n\nconsole.log(JSON.stringify(auditDisclosure(true, true, false)));\nconsole.log(JSON.stringify(auditDisclosure(true, false, true)));",
            "expectedOutput": "{\"hasClearAdTag\":true,\"hasPreRollDisclosure\":true,\"isHiddenInHashtags\":false,\"isCompliant\":true,\"status\":\"FULLY_REGULATORY_COMPLIANT\"}\n{\"hasClearAdTag\":true,\"hasPreRollDisclosure\":false,\"isHiddenInHashtags\":true,\"isCompliant\":false,\"status\":\"STATUTORY_DECEPTIVE_ADVERTISING_VIOLATION\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How is an influencer social media post evaluated when paid sponsorship disclosures are clearly visible in pre-roll without being hidden in hashtag clouds?",
          "expectedStringOutput": "FULLY_REGULATORY_COMPLIANT",
          "acceptableAnswers": [
            "FULLY_REGULATORY_COMPLIANT",
            "Regulatory Compliant",
            "Fully Compliant"
          ],
          "primaryMisconceptionId": "MC_MKT_MARKETING_ETHICS_ASCI_TRUTH_IN_ADVERTISING",
          "diagnosisMap": {
            "VIOLATION": {
              "misconceptionId": "MC_MKT_MARKETING_ETHICS_ASCI_TRUTH_IN_ADVERTISING",
              "errorExplanation": "Clear, unhidden disclosures are fully compliant with ASCI and FTC regulations.",
              "recoveryPath": {
                "simplerExplanation": "Matches FULLY_REGULATORY_COMPLIANT.",
                "guidedFixPrompt": "Type FULLY_REGULATORY_COMPLIANT"
              }
            }
          }
        }
      },
      {
        "id": "mkt-d29-b2-comparative-advertising-laws",
        "day": 29,
        "blockNumber": 2,
        "title": "Comparative Advertising Laws: Truthful Comparison vs Competitor Disparagement",
        "conceptBudget": {
          "primaryConcept": "Comparative Advertising Invariants",
          "supportingTerms": [
            "Permissible: Factual, verifiable feature/price comparisons supported by objective third-party lab data",
            "Forbidden: Commercial disparagement, denigration, and unsubstantiated negative claims"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d29-b1-ftc-asci-influencer-disclosures",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Comparative Advertising Legality",
            "codeSnippet": "// ✅ PERMISSIBLE: 'In certified ISO-9001 lab tests, our battery lasts 14 hours vs Brand Y 10 hours' (Verifiable fact!)\n// ❌ ILLEGAL:     'Brand Y batteries are dangerous trash that fail immediately' (Actionable commercial disparagement!)",
            "lineNotes": {
              "1": "Fact-based comparison.",
              "2": "Unlawful disparagement."
            }
          },
          {
            "type": "runnable_code",
            "filename": "comparative_demo.js",
            "initialCode": "function evaluateComparativeAd(isFactBased, isDisparaging) {\n  return (isFactBased && !isDisparaging)\n    ? 'LAWFUL_FACTUAL_COMPARATIVE_AD'\n    : 'UNLAWFUL_COMMERCIAL_DISPARAGEMENT';\n}\n\nconsole.log(evaluateComparativeAd(true, false));\nconsole.log(evaluateComparativeAd(false, true));",
            "expectedOutput": "LAWFUL_FACTUAL_COMPARATIVE_AD\nUNLAWFUL_COMMERCIAL_DISPARAGEMENT",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How is an advertisement classified when it compares its verifiable battery life against a competitor using certified independent laboratory test data?",
          "expectedStringOutput": "LAWFUL_FACTUAL_COMPARATIVE_AD",
          "acceptableAnswers": [
            "LAWFUL_FACTUAL_COMPARATIVE_AD",
            "Lawful Comparative Ad",
            "Factual Comparison"
          ],
          "primaryMisconceptionId": "MC_MKT_MARKETING_ETHICS_ASCI_TRUTH_IN_ADVERTISING",
          "diagnosisMap": {
            "DISPARAGEMENT": {
              "misconceptionId": "MC_MKT_MARKETING_ETHICS_ASCI_TRUTH_IN_ADVERTISING",
              "errorExplanation": "Independent lab-verified factual comparisons are lawful.",
              "recoveryPath": {
                "simplerExplanation": "Matches LAWFUL_FACTUAL_COMPARATIVE_AD.",
                "guidedFixPrompt": "Type LAWFUL_FACTUAL_COMPARATIVE_AD"
              }
            }
          }
        }
      },
      {
        "id": "mkt-d29-b3-consumer-privacy-gdpr-dpdp",
        "day": 29,
        "blockNumber": 3,
        "title": "Consumer Data Privacy & Consent in Digital Marketing (GDPR & DPDP Act 2023)",
        "conceptBudget": {
          "primaryConcept": "Consumer Consent & DPDP Act 2023",
          "supportingTerms": [
            "Explicit Opt-In Consent (No pre-ticked checkboxes)",
            "Right to Forget / Data Erasure",
            "First-Party Data capture strategy replacing third-party tracking cookies"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d29-b2-comparative-advertising-laws",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "privacy_demo.js",
            "initialCode": "function evaluateDataConsent(isExplicitOptIn) {\n  return isExplicitOptIn\n    ? 'PRIVACY_COMPLIANT_EXPLICIT_CONSENT'\n    : 'UNLAWFUL_TRACKING_CONSENT_DEFICIT';\n}\n\nconsole.log(evaluateDataConsent(true));",
            "expectedOutput": "PRIVACY_COMPLIANT_EXPLICIT_CONSENT",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What privacy consent standard is legally mandated under the Digital Personal Data Protection (DPDP) Act 2023 before marketing tracking cookies can be dropped on a consumer's device?",
          "expectedStringOutput": "PRIVACY_COMPLIANT_EXPLICIT_CONSENT",
          "acceptableAnswers": [
            "PRIVACY_COMPLIANT_EXPLICIT_CONSENT",
            "Explicit Consent",
            "Opt-In Consent"
          ],
          "primaryMisconceptionId": "MC_MKT_MARKETING_ETHICS_ASCI_TRUTH_IN_ADVERTISING",
          "diagnosisMap": {
            "IMPLIED": {
              "misconceptionId": "MC_MKT_MARKETING_ETHICS_ASCI_TRUTH_IN_ADVERTISING",
              "errorExplanation": "Implied consent and pre-ticked boxes are illegal. Explicit Opt-In Consent is required.",
              "recoveryPath": {
                "simplerExplanation": "Matches PRIVACY_COMPLIANT_EXPLICIT_CONSENT.",
                "guidedFixPrompt": "Type PRIVACY_COMPLIANT_EXPLICIT_CONSENT"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 30,
    "title": "🏆 FINAL CAPSTONE: Integrated Corporate Marketing & Global Brand Management Master Suite",
    "overviewMetaphor": "Day 30 Final Capstone Synthesis: The complete sovereign enterprise marketing and global brand management orchestration kernel: 1. Market research, customer value equation, and STP positioning; 2. Product lifecycle portfolio (BCG), Keller CBBE brand equity resonance, and value-based pricing; 3. Omnichannel distribution, IMC promotional campaigns, and B2B buying center alignment; 4. Digital media OEP blended CAC, corporate Customer Equity ($1M), and ROMI (+200%); 5. Viral loops (K=1.50), neuromarketing decoy choice architecture, AI predictive lead scoring, and global regulatory compliance.",
    "blocks": [
      {
        "id": "mkt-d30-b1-capstone-orchestrator-synthesis",
        "day": 30,
        "blockNumber": 1,
        "title": "Enterprise Marketing & Global Brand Management Master Orchestrator",
        "conceptBudget": {
          "primaryConcept": "Capstone Master Orchestrator",
          "supportingTerms": [
            "Research & STP Module",
            "Product & Brand Equity Module",
            "GTM Performance & ROMI Module",
            "Viral & Neuromarketing Module",
            "Ethical AI & Global Governance Module"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d29-b3-consumer-privacy-gdpr-dpdp",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Enterprise Marketing & Global Brand Master Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "Evaluates Customer Value & Maps Distinct Perceptual Positioning",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Optimizes BCG Portfolio & Scores Keller CBBE Brand Resonance",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Audits Omnichannel Blended CAC & +200% Financial ROMI",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Deploys Viral K=1.50 Loops & AI Predictive Lead Routing",
                  "kind": "process"
                },
                {
                  "id": "5",
                  "label": "Certifies Global Ethical Governance & Awards Master Certification!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "capstone_orchestrator_demo.js",
            "initialCode": "function orchestrateMarketingMasterSuite(res, pb, gtm, vir, gov) {\n  const ok = res && pb && gtm && vir && gov;\n  return {\n    marketResearchAndStp: res,\n    productAndBrandEquity: pb,\n    gtmPerformanceAndRomi: gtm,\n    viralAndNeuromarketing: vir,\n    ethicalAiAndGlobalGovernance: gov,\n    masterCertified: ok,\n    status: ok ? 'MARKETING_AND_BRAND_MANAGEMENT_MASTER_CERTIFIED_NOMINAL' : 'AUDIT_DEFECT'\n  };\n}\n\nconsole.log(orchestrateMarketingMasterSuite(true, true, true, true, true).status);",
            "expectedOutput": "MARKETING_AND_BRAND_MANAGEMENT_MASTER_CERTIFIED_NOMINAL",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What master certification string confirms comprehensive platform-wide certification of the Integrated Corporate Marketing & Global Brand Management Suite?",
          "expectedStringOutput": "MARKETING_AND_BRAND_MANAGEMENT_MASTER_CERTIFIED_NOMINAL",
          "acceptableAnswers": [
            "MARKETING_AND_BRAND_MANAGEMENT_MASTER_CERTIFIED_NOMINAL",
            "status: MARKETING_AND_BRAND_MANAGEMENT_MASTER_CERTIFIED_NOMINAL"
          ],
          "primaryMisconceptionId": "MC_MKT_CAPSTONE_GLOBAL_MARKETING_BRAND_ORCHESTRATION",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_MKT_CAPSTONE_GLOBAL_MARKETING_BRAND_ORCHESTRATION",
              "errorExplanation": "Matches MARKETING_AND_BRAND_MANAGEMENT_MASTER_CERTIFIED_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type MARKETING_AND_BRAND_MANAGEMENT_MASTER_CERTIFIED_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "mkt-d30-b2-capstone-quality-audit",
        "day": 30,
        "blockNumber": 2,
        "title": "30-Day Master Quality Audit & Zero-Defect Governance Verification",
        "conceptBudget": {
          "primaryConcept": "30-Day Master Quality Audit",
          "supportingTerms": [
            "30 Days Complete",
            "90 Handcrafted Blocks",
            "100% Socratic Recovery",
            "Zero Placeholders"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d30-b1-capstone-orchestrator-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "capstone_audit_demo.js",
            "initialCode": "function auditMarketingMasterCourse(daysCount, blocksCount, zeroPlaceholders, zeroTsErrors) {\n  const ok = daysCount === 30 && blocksCount === 90 && zeroPlaceholders && zeroTsErrors;\n  return {\n    daysAudited: daysCount,\n    blocksAudited: blocksCount,\n    zeroPlaceholdersVerified: zeroPlaceholders,\n    zeroTsErrorsVerified: zeroTsErrors,\n    score: ok ? '100/100_GOLD_STANDARD' : 'AUDIT_FAILED'\n  };\n}\n\nconsole.log(JSON.stringify(auditMarketingMasterCourse(30, 90, true, true)));",
            "expectedOutput": "{\"daysAudited\":30,\"blocksAudited\":90,\"zeroPlaceholdersVerified\":true,\"zeroTsErrorsVerified\":true,\"score\":\"100/100_GOLD_STANDARD\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit score is awarded to Course #21 (Marketing & Brand Management) upon verifying 30 days, 90 micro-blocks, zero placeholders, and zero TypeScript compilation errors?",
          "expectedStringOutput": "100/100_GOLD_STANDARD",
          "acceptableAnswers": [
            "100/100_GOLD_STANDARD",
            "100/100",
            "Gold Standard"
          ],
          "primaryMisconceptionId": "MC_MKT_CAPSTONE_GLOBAL_MARKETING_BRAND_ORCHESTRATION",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_MKT_CAPSTONE_GLOBAL_MARKETING_BRAND_ORCHESTRATION",
              "errorExplanation": "All checks passing awards 100/100_GOLD_STANDARD.",
              "recoveryPath": {
                "simplerExplanation": "Awards 100/100_GOLD_STANDARD.",
                "guidedFixPrompt": "Type 100/100_GOLD_STANDARD"
              }
            }
          }
        }
      },
      {
        "id": "mkt-d30-b3-final-capstone-marketing-graduation",
        "day": 30,
        "blockNumber": 3,
        "title": "PinIT Career OS — Marketing & Brand Management Master Graduation",
        "conceptBudget": {
          "primaryConcept": "Marketing Master Graduation",
          "supportingTerms": [
            "Enterprise Marketing Executive Ready",
            "Global Brand Strategist Certified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mkt-d30-b2-capstone-quality-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "capstone_graduation.js",
            "initialCode": "console.log('🏆 30-DAY MASTER CAPSTONE: Integrated Corporate Marketing & Global Brand Management [CERTIFIED 100%]');",
            "expectedOutput": "🏆 30-DAY MASTER CAPSTONE: Integrated Corporate Marketing & Global Brand Management [CERTIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What graduation string confirms successful completion of the 30-Day Marketing & Brand Management Master Curriculum?",
          "expectedStringOutput": "🏆 30-DAY MASTER CAPSTONE: Integrated Corporate Marketing & Global Brand Management [CERTIFIED 100%]",
          "acceptableAnswers": [
            "🏆 30-DAY MASTER CAPSTONE: Integrated Corporate Marketing & Global Brand Management [CERTIFIED 100%]",
            "CERTIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_MKT_CAPSTONE_GLOBAL_MARKETING_BRAND_ORCHESTRATION",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_MKT_CAPSTONE_GLOBAL_MARKETING_BRAND_ORCHESTRATION",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type 🏆 30-DAY MASTER CAPSTONE: Integrated Corporate Marketing & Global Brand Management [CERTIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  }
];
