import { DayLessonPlan } from '@/lib/types/lessonEngine';

export const BCOM_OPERATIONS_PILOT_DAYS: DayLessonPlan[] = [
  {
    "day": 1,
    "title": "Operations Foundations & Process Mapping: SIPOC & Value Stream Mapping (VSM)",
    "overviewMetaphor": "An Operational Value Stream is a River Where Stagnant Backwaters Are Waste: In an un-optimized factory, raw materials spend 400 minutes in transit, storage, and queueing (Total Lead Time), but only 120 minutes receiving actual physical assembly and testing (Value-Add Time); process flow efficiency is 30.0% ($Flow Efficiency = \\frac{120}{400} \\times 100\\% = 30.0\\%$); using SIPOC (Suppliers, Inputs, Process, Outputs, Customers) and Value Stream Mapping removes bottleneck queues, compressing lead times and accelerating customer delivery.",
    "blocks": [
      {
        "id": "ops-d1-b1-flow-efficiency-calculation",
        "day": 1,
        "blockNumber": 1,
        "title": "Process Flow Efficiency Formula: $\\text{Flow Efficiency}\\% = \\frac{\\text{Value-Add Time (VAT)}}{\\text{Total Lead Time (TLT)}} \\times 100\\% \\ge 25.0\\%$",
        "conceptBudget": {
          "primaryConcept": "Process Flow Efficiency Formula",
          "supportingTerms": [
            "Value-Add Time ($VAT = 120$ minutes)",
            "Total Lead Time ($TLT = 400$ minutes)",
            "Flow Efficiency = $\\frac{120}{400} \\times 100\\% = 30.0\\%$",
            "Lean Benchmark: $\\ge 25.0\\% \\implies$ Lean High-Velocity Flow; $< 10.0\\% \\implies$ Massive Waiting Waste"
          ]
        },
        "prerequisiteThresholds": [],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Value Stream Mapping (VSM) Lead Time Ledger (120 min VAT / 400 min TLT)",
              "boxes": [
                {
                  "label": "Value-Add Time (VAT)",
                  "value": "120 Minutes (Direct Machining, Assembly & Quality Inspection)",
                  "varType": "VAT",
                  "isUpdated": false
                },
                {
                  "label": "Non-Value-Add Time (NVAT)",
                  "value": "280 Minutes (Queue Waiting, Staging & Warehouse Transfer)",
                  "varType": "NVAT",
                  "isUpdated": false
                },
                {
                  "label": "Flow Efficiency Rating",
                  "value": "120 / 400 = 30.0% (LEAN HIGH VELOCITY PROCESS FLOW >= 25.0%!)",
                  "varType": "Efficiency",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "flow_eff_calc_demo.js",
            "initialCode": "function calculateFlowEfficiency(vat, tlt) {\n  const eff = (vat / tlt) * 100;\n  const isLean = eff >= 25.0;\n  return {\n    vat,\n    tlt,\n    flowEfficiencyPct: Number(eff.toFixed(1)),\n    isLean,\n    status: isLean ? 'LEAN_HIGH_VELOCITY_PROCESS_FLOW' : 'EXCESSIVE_WAITING_WASTE'\n  };\n}\n\nconsole.log(JSON.stringify(calculateFlowEfficiency(120, 400)));\nconsole.log(JSON.stringify(calculateFlowEfficiency(30, 600)));",
            "expectedOutput": "{\"vat\":120,\"tlt\":400,\"flowEfficiencyPct\":30,\"isLean\":true,\"status\":\"LEAN_HIGH_VELOCITY_PROCESS_FLOW\"}\n{\"vat\":30,\"tlt\":600,\"flowEfficiencyPct\":5,\"isLean\":false,\"status\":\"EXCESSIVE_WAITING_WASTE\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the process flow efficiency percentage when a production cycle requires 120 minutes of value-add assembly out of 400 total minutes of manufacturing lead time ($ (120 / 400) \\times 100 $)?",
          "expectedStringOutput": "30",
          "acceptableAnswers": [
            "30",
            "30%",
            "30.0",
            "flowEfficiencyPct\":30"
          ],
          "primaryMisconceptionId": "MC_OPS_PROCESS_MAPPING_SIPOC_VALUE_STREAM",
          "diagnosisMap": {
            "70": {
              "misconceptionId": "MC_OPS_PROCESS_MAPPING_SIPOC_VALUE_STREAM",
              "errorExplanation": "70% is non-value-add waste time (280/400). Value-add flow efficiency is 30.0%.",
              "recoveryPath": {
                "simplerExplanation": "120 / 400 * 100 = 30%.",
                "guidedFixPrompt": "Type 30"
              }
            }
          }
        }
      },
      {
        "id": "ops-d1-b2-sipoc-scoping-framework",
        "day": 1,
        "blockNumber": 2,
        "title": "The 5 Tiers of SIPOC: Suppliers, Inputs, Process, Outputs, Customers",
        "conceptBudget": {
          "primaryConcept": "SIPOC Architecture",
          "supportingTerms": [
            "S (Suppliers: Raw material & data providers)",
            "I (Inputs: Steel, silicon, energy, specifications)",
            "P (Process: 5-7 core transformation steps)",
            "O (Outputs: Finished goods, reports, services)",
            "C (Customers: Internal recipients or external buyers)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d1-b1-flow-efficiency-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "SIPOC Scope Architecture",
            "codeSnippet": "// SUPPLIERS: Tier-1 Steel & Electronics Vendors\n// INPUTS:    Cold-Rolled Steel Sheets, Microcontrollers, Assembly Schematics\n// PROCESS:   Stamping -> Component Placement -> Soldering -> Inspection -> Packaging\n// OUTPUTS:   Industrial Smart Meter Unit, Test Calibration Certificate\n// CUSTOMERS: Electrical Utility Grid Operators",
            "lineNotes": {
              "1": "Originating providers.",
              "2": "Inbound resources.",
              "3": "Sequential transformation.",
              "4": "Deliverable assets.",
              "5": "End beneficiaries."
            }
          },
          {
            "type": "runnable_code",
            "filename": "sipoc_pillars_demo.js",
            "initialCode": "function getSipocPillars() {\n  return ['SUPPLIERS', 'INPUTS', 'PROCESS', 'OUTPUTS', 'CUSTOMERS'];\n}\n\nconsole.log(JSON.stringify(getSipocPillars()));",
            "expectedOutput": "[\"SUPPLIERS\",\"INPUTS\",\"PROCESS\",\"OUTPUTS\",\"CUSTOMERS\"]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What does the 'O' represent in the foundational SIPOC operational process mapping framework?",
          "expectedStringOutput": "OUTPUTS",
          "acceptableAnswers": [
            "OUTPUTS",
            "Outputs",
            "Output"
          ],
          "primaryMisconceptionId": "MC_OPS_PROCESS_MAPPING_SIPOC_VALUE_STREAM",
          "diagnosisMap": {
            "OPERATIONS": {
              "misconceptionId": "MC_OPS_PROCESS_MAPPING_SIPOC_VALUE_STREAM",
              "errorExplanation": "In SIPOC, 'O' stands for OUTPUTS.",
              "recoveryPath": {
                "simplerExplanation": "Matches OUTPUTS.",
                "guidedFixPrompt": "Type OUTPUTS"
              }
            }
          }
        }
      },
      {
        "id": "ops-d1-b3-takt-time-pace-calculation",
        "day": 1,
        "blockNumber": 3,
        "title": "Takt Time: The Heartbeat Beat of Customer Demand",
        "conceptBudget": {
          "primaryConcept": "Takt Time Formula",
          "supportingTerms": [
            "Takt Time ($Takt = \\frac{\\text{Available Production Time}}{\\text{Customer Demand Units}}$)",
            "Synchronizes manufacturing speed directly to market consumption rate"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d1-b2-sipoc-scoping-framework",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "takt_calc_demo.js",
            "initialCode": "function calculateTaktTime(netAvailableSeconds, customerDemandUnits) {\n  return Math.round(netAvailableSeconds / customerDemandUnits);\n}\n\nconsole.log(calculateTaktTime(28800, 480)); // 28,800 sec (8 hrs) / 480 units = 60 sec/unit",
            "expectedOutput": "60",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Takt Time in seconds per unit when a factory has 28,800 seconds of available operating time to meet a daily customer demand of 480 units ($28,800 / 480$)?",
          "expectedStringOutput": "60",
          "acceptableAnswers": [
            "60",
            "60 seconds",
            "60s"
          ],
          "primaryMisconceptionId": "MC_OPS_PROCESS_MAPPING_SIPOC_VALUE_STREAM",
          "diagnosisMap": {
            "480": {
              "misconceptionId": "MC_OPS_PROCESS_MAPPING_SIPOC_VALUE_STREAM",
              "errorExplanation": "480 is the unit demand. Takt time divides available seconds by demand = 60 seconds/unit.",
              "recoveryPath": {
                "simplerExplanation": "28,800 / 480 = 60.",
                "guidedFixPrompt": "Type 60"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 2,
    "title": "Inventory Control: Economic Order Quantity (EOQ = sqrt(2DS/H)) & Reorder Point (ROP)",
    "overviewMetaphor": "Inventory Optimization is a Perfectly Balanced Seesaw: If you order in massive batches, your ordering setup costs drop to zero but your warehouse holding rent skyrockets; if you order tiny amounts daily, holding cost is zero but shipping and setup costs explode; Wilson's Economic Order Quantity formula ($EOQ = \\sqrt{\\frac{2DS}{H}} = \\sqrt{\\frac{2 \\times 10,000 \\times 50}{4}} = 500$ units) finds the mathematical sweet spot where annual setup cost exactly equals annual holding cost; pairing this with a Reorder Point ($ROP = (30 \\times 10) + 100 = 400$ units) ensures you never experience stockouts.",
    "blocks": [
      {
        "id": "ops-d2-b1-eoq-and-rop-calculation",
        "day": 2,
        "blockNumber": 1,
        "title": "Economic Order Quantity (EOQ) & Reorder Point (ROP) Formulas",
        "conceptBudget": {
          "primaryConcept": "EOQ and ROP Formulas",
          "supportingTerms": [
            "Annual Demand ($D = 10,000$ units)",
            "Order Setup Cost ($S = \\$50.00$ per order)",
            "Annual Holding Cost ($H = \\$4.00$ per unit/year)",
            "Daily Demand ($d = 30$ units/day)",
            "Supplier Lead Time ($L = 10$ days)",
            "Safety Stock ($SS = 100$ units)",
            "$EOQ = \\sqrt{\\frac{2 \\times 10,000 \\times 50}{4}} = \\sqrt{250,000} = 500$ units",
            "$ROP = (d \\times L) + SS = (30 \\times 10) + 100 = 400$ units"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d1-b1-flow-efficiency-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Inventory Control Optimization Ledger (EOQ = 500, ROP = 400)",
              "boxes": [
                {
                  "label": "Optimal Batch Size (EOQ)",
                  "value": "sqrt(2 x 10,000 x 50 / 4) = 500 Units per Production Order",
                  "varType": "EOQ",
                  "isUpdated": false
                },
                {
                  "label": "Reorder Trigger Point (ROP)",
                  "value": "(30 units/day x 10 days Lead Time) + 100 Buffer = 400 Units",
                  "varType": "ROP",
                  "isUpdated": false
                },
                {
                  "label": "Optimization Status",
                  "value": "ANNUAL SETUP COST EQUALS ANNUAL HOLDING COST (EOQ OPTIMAL!)",
                  "varType": "Status",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "eoq_rop_calc_demo.js",
            "initialCode": "function calculateEoqRop(d, s, h, dailyD, leadL, ss) {\n  const eoq = Math.round(Math.sqrt((2 * d * s) / h));\n  const rop = Math.round((dailyD * leadL) + ss);\n  return {\n    annualDemand: d,\n    eoqUnits: eoq,\n    ropUnits: rop,\n    status: 'EOQ_ROP_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateEoqRop(10000, 50, 4, 30, 10, 100)));",
            "expectedOutput": "{\"annualDemand\":10000,\"eoqUnits\":500,\"ropUnits\":400,\"status\":\"EOQ_ROP_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Economic Order Quantity (EOQ) in units when annual demand is 10,000 units, order cost is $50, and holding cost is $4 per unit ($ \\sqrt{(2 \\times 10,000 \\times 50) / 4} $)?",
          "expectedStringOutput": "500",
          "acceptableAnswers": [
            "500",
            "500 units",
            "eoqUnits\":500"
          ],
          "primaryMisconceptionId": "MC_OPS_INVENTORY_OPTIMIZATION_EOQ_ROP",
          "diagnosisMap": {
            "250000": {
              "misconceptionId": "MC_OPS_INVENTORY_OPTIMIZATION_EOQ_ROP",
              "errorExplanation": "250,000 is the value before the square root. Taking sqrt(250,000) yields 500 units.",
              "recoveryPath": {
                "simplerExplanation": "sqrt(250,000) = 500.",
                "guidedFixPrompt": "Type 500"
              }
            }
          }
        }
      },
      {
        "id": "ops-d2-b2-safety-stock-and-service-levels",
        "day": 2,
        "blockNumber": 2,
        "title": "Safety Stock Buffering & Service Level Z-Scores ($95\\% \\implies Z = 1.65$)",
        "conceptBudget": {
          "primaryConcept": "Safety Stock Formula",
          "supportingTerms": [
            "Safety Stock ($SS = Z \\times \\sigma_L$)",
            "Z-score for 95% Service Level = $1.65$",
            "Lead time demand standard deviation $\\sigma_L$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d2-b1-eoq-and-rop-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Service Level vs Safety Stock Tradeoff",
            "codeSnippet": "// 90% Service Level (Z = 1.28): Low working capital, 10% stockout risk\n// 95% Service Level (Z = 1.65): Standard industrial benchmark, 5% stockout risk\n// 99% Service Level (Z = 2.33): Exponential inventory surge (Diminishing return)",
            "lineNotes": {
              "1": "Lean buffer.",
              "2": "Optimal balance.",
              "3": "Heavy capital lockup."
            }
          },
          {
            "type": "runnable_code",
            "filename": "safety_stock_demo.js",
            "initialCode": "function calculateSafetyStock(zScore, stdDevLeadDemand) {\n  return Math.round(zScore * stdDevLeadDemand);\n}\n\nconsole.log(calculateSafetyStock(1.65, 60.6)); // 1.65 * 60.6 = ~100 units",
            "expectedOutput": "100",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the recommended statistical Z-score used to compute safety stock for an enterprise achieving a 95% order fulfillment service level?",
          "expectedStringOutput": "1.65",
          "acceptableAnswers": [
            "1.65",
            "Z=1.65",
            "1.645"
          ],
          "primaryMisconceptionId": "MC_OPS_INVENTORY_OPTIMIZATION_EOQ_ROP",
          "diagnosisMap": {
            "2.33": {
              "misconceptionId": "MC_OPS_INVENTORY_OPTIMIZATION_EOQ_ROP",
              "errorExplanation": "2.33 is for 99% service level. 95% service level uses Z = 1.65.",
              "recoveryPath": {
                "simplerExplanation": "95% service level corresponds to Z = 1.65.",
                "guidedFixPrompt": "Type 1.65"
              }
            }
          }
        }
      },
      {
        "id": "ops-d2-b3-abc-inventory-pareto-classification",
        "day": 2,
        "blockNumber": 3,
        "title": "ABC Inventory Classification: Pareto 80/20 Capital Allocation",
        "conceptBudget": {
          "primaryConcept": "ABC Classification Invariant",
          "supportingTerms": [
            "Category A (Top 20% SKUs accounting for 80% total inventory dollar value - Tight weekly control)",
            "Category B (30% SKUs accounting for 15% value)",
            "Category C (50% SKUs accounting for 5% value - Bulk reorders)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d2-b2-safety-stock-and-service-levels",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "abc_class_demo.js",
            "initialCode": "function getAbcCategory(cumulativeValuePct) {\n  if (cumulativeValuePct <= 80) return 'CATEGORY_A_TIGHT_DAILY_CONTROL';\n  if (cumulativeValuePct <= 95) return 'CATEGORY_B_PERIODIC_CONTROL';\n  return 'CATEGORY_C_BULK_TWO_BIN_SYSTEM';\n}\n\nconsole.log(getAbcCategory(75));\nconsole.log(getAbcCategory(98));",
            "expectedOutput": "CATEGORY_A_TIGHT_DAILY_CONTROL\nCATEGORY_C_BULK_TWO_BIN_SYSTEM",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which ABC inventory tier represents high-value items accounting for 80% of total annual consumption value and requiring rigorous daily cycle counting?",
          "expectedStringOutput": "CATEGORY_A_TIGHT_DAILY_CONTROL",
          "acceptableAnswers": [
            "CATEGORY_A_TIGHT_DAILY_CONTROL",
            "Category A",
            "Class A"
          ],
          "primaryMisconceptionId": "MC_OPS_INVENTORY_OPTIMIZATION_EOQ_ROP",
          "diagnosisMap": {
            "CATEGORY_C": {
              "misconceptionId": "MC_OPS_INVENTORY_OPTIMIZATION_EOQ_ROP",
              "errorExplanation": "Category C items are low value bulk items. Top 80% value items are CATEGORY_A_TIGHT_DAILY_CONTROL.",
              "recoveryPath": {
                "simplerExplanation": "Matches CATEGORY_A_TIGHT_DAILY_CONTROL.",
                "guidedFixPrompt": "Type CATEGORY_A_TIGHT_DAILY_CONTROL"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 3,
    "title": "Supply Chain Logistics & Total Landed Cost (FOB vs CIF vs DDP Incoterms)",
    "overviewMetaphor": "Total Landed Cost is the Real Iceberg Under the Ocean of Factory Quotes: An overseas factory quotes $50.00 FOB per unit, but the true cost to reach your warehouse includes $10.00 in ocean freight, $7.50 in customs tariffs ($50 \\times 15\\% = \\$7.50$), $2.00 in marine cargo insurance, and $3.00 in local container drayage ($50 + 10 + 7.50 + 2 + 3 = \\$72.50$ Total Landed Cost); understanding Incoterms (FOB vs CIF vs DDP) ensures you never get hit with surprise port demurrage or unpaid import duties.",
    "blocks": [
      {
        "id": "ops-d3-b1-total-landed-cost-calculation",
        "day": 3,
        "blockNumber": 1,
        "title": "Total Landed Cost (TLC) Equation: $\\text{TLC} = \\text{Factory Cost} + \\text{Freight} + \\text{Tariff} + \\text{Insurance} + \\text{Drayage}$",
        "conceptBudget": {
          "primaryConcept": "Total Landed Cost Formula",
          "supportingTerms": [
            "Factory Unit Cost ($50.00$)",
            "Ocean Container Freight ($10.00$)",
            "Customs Tariff Rate ($15.0\\% \\implies \\$7.50$ duty)",
            "Marine Insurance ($2.00$)",
            "Local Port Drayage ($3.00$)",
            "Total Landed Cost = $50 + 10 + 7.50 + 2 + 3 = \\$72.50$ per unit"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d2-b1-eoq-and-rop-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "International Freight Landed Cost Ledger ($50 Factory + $22.50 Logistics)",
              "boxes": [
                {
                  "label": "Ex-Works Factory Cost",
                  "value": "$50.00 Unit Manufacturing Price at Shanghai Port",
                  "varType": "Factory Cost",
                  "isUpdated": false
                },
                {
                  "label": "Tariff Duty (15%)",
                  "value": "$50.00 x 15.0% = $7.50 Statutory Customs Import Duty",
                  "varType": "Tariff",
                  "isUpdated": false
                },
                {
                  "label": "Total Landed Cost",
                  "value": "$50 + $10 Freight + $7.50 Duty + $2 Ins + $3 Dray = $72.50/UNIT!",
                  "varType": "Landed Cost",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "landed_cost_calc_demo.js",
            "initialCode": "function calculateTotalLandedCost(factory, ocean, tariffPct, insurance, drayage) {\n  const tariff = factory * (tariffPct / 100);\n  const total = factory + ocean + tariff + insurance + drayage;\n  return {\n    factoryCost: factory,\n    tariffDollars: Number(tariff.toFixed(2)),\n    totalLandedCost: Number(total.toFixed(2)),\n    status: 'LANDED_COST_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateTotalLandedCost(50, 10, 15, 2, 3)));",
            "expectedOutput": "{\"factoryCost\":50,\"tariffDollars\":7.5,\"totalLandedCost\":72.5,\"status\":\"LANDED_COST_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Total Landed Cost per unit when factory cost is $50, ocean freight is $10, customs duty is 15% ($7.50), insurance is $2, and local drayage is $3 ($50 + 10 + 7.50 + 2 + 3$)?",
          "expectedStringOutput": "72.5",
          "acceptableAnswers": [
            "72.5",
            "72.50",
            "$72.50",
            "totalLandedCost\":72.5"
          ],
          "primaryMisconceptionId": "MC_OPS_LOGISTICS_FREIGHT_INCOTERMS_LANDED_COST",
          "diagnosisMap": {
            "60": {
              "misconceptionId": "MC_OPS_LOGISTICS_FREIGHT_INCOTERMS_LANDED_COST",
              "errorExplanation": "60 adds only factory and freight, ignoring customs duty, insurance, and drayage ($72.50).",
              "recoveryPath": {
                "simplerExplanation": "50 + 10 + 7.50 + 2 + 3 = 72.50.",
                "guidedFixPrompt": "Type 72.5"
              }
            }
          }
        }
      },
      {
        "id": "ops-d3-b2-incoterms-2020-risk-transfer",
        "day": 3,
        "blockNumber": 2,
        "title": "Incoterms 2020: FOB (Free on Board) vs CIF vs DDP Risk Transfer Points",
        "conceptBudget": {
          "primaryConcept": "Incoterms Risk Allocation",
          "supportingTerms": [
            "FOB (Free on Board: Buyer assumes risk once cargo crosses ship rail at origin)",
            "CIF (Cost, Insurance & Freight: Seller pays ocean transit & marine insurance to destination port)",
            "DDP (Delivered Duty Paid: Maximum seller responsibility including customs clearance & doorstep delivery)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d3-b1-total-landed-cost-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Incoterms Risk Transfer Comparison",
            "codeSnippet": "// EXW (Ex Works):            Buyer arranges pickup directly from factory floor\n// FOB (Free on Board):       Risk transfers to buyer once loaded onto ship at export port\n// CIF (Cost, Ins, Freight):  Seller pays ocean freight & insurance; risk transfers at ship rail\n// DDP (Delivered Duty Paid): Seller delivers to buyer doorstep with all import taxes paid!",
            "lineNotes": {
              "1": "Maximum buyer risk.",
              "2": "Standard maritime split.",
              "3": "Freight prepaid.",
              "4": "Maximum seller risk."
            }
          },
          {
            "type": "runnable_code",
            "filename": "incoterms_demo.js",
            "initialCode": "function getIncotermResponsibility(term) {\n  return term === 'DDP'\n    ? 'SELLER_PAYS_ALL_FREIGHT_DUTIES_AND_DELIVERS_TO_DOOR'\n    : 'BUYER_PAYS_IMPORT_CUSTOMS_AND_LOCAL_DRAYAGE';\n}\n\nconsole.log(getIncotermResponsibility('DDP'));\nconsole.log(getIncotermResponsibility('FOB'));",
            "expectedOutput": "SELLER_PAYS_ALL_FREIGHT_DUTIES_AND_DELIVERS_TO_DOOR\nBUYER_PAYS_IMPORT_CUSTOMS_AND_LOCAL_DRAYAGE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which Incoterm places maximum obligation on the seller by requiring them to pay all ocean freight, import duties, customs taxes, and deliver directly to the buyer's door?",
          "expectedStringOutput": "SELLER_PAYS_ALL_FREIGHT_DUTIES_AND_DELIVERS_TO_DOOR",
          "acceptableAnswers": [
            "SELLER_PAYS_ALL_FREIGHT_DUTIES_AND_DELIVERS_TO_DOOR",
            "DDP",
            "Delivered Duty Paid"
          ],
          "primaryMisconceptionId": "MC_OPS_LOGISTICS_FREIGHT_INCOTERMS_LANDED_COST",
          "diagnosisMap": {
            "FOB": {
              "misconceptionId": "MC_OPS_LOGISTICS_FREIGHT_INCOTERMS_LANDED_COST",
              "errorExplanation": "FOB requires the buyer to pay import duties. DDP requires SELLER_PAYS_ALL_FREIGHT_DUTIES_AND_DELIVERS_TO_DOOR.",
              "recoveryPath": {
                "simplerExplanation": "Matches SELLER_PAYS_ALL_FREIGHT_DUTIES_AND_DELIVERS_TO_DOOR.",
                "guidedFixPrompt": "Type SELLER_PAYS_ALL_FREIGHT_DUTIES_AND_DELIVERS_TO_DOOR"
              }
            }
          }
        }
      },
      {
        "id": "ops-d3-b3-ftl-vs-ltl-freight-modes",
        "day": 3,
        "blockNumber": 3,
        "title": "Full Truckload (FTL) vs Less-Than-Truckload (LTL) Consolidation",
        "conceptBudget": {
          "primaryConcept": "Freight Consolidation Invariant",
          "supportingTerms": [
            "FTL (Full Truckload: Direct point-to-point transit, zero hub transfers, lowest breakage risk)",
            "LTL (Less-Than-Truckload: Pallets consolidated at cross-docks, cheaper for < 6 pallets but longer transit)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d3-b2-incoterms-2020-risk-transfer",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "freight_mode_demo.js",
            "initialCode": "function selectFreightMode(palletCount) {\n  return palletCount >= 10\n    ? 'FULL_TRUCKLOAD_FTL_DEDICATED_DIRECT'\n    : 'LESS_THAN_TRUCKLOAD_LTL_CONSOLIDATED';\n}\n\nconsole.log(selectFreightMode(24));\nconsole.log(selectFreightMode(4));",
            "expectedOutput": "FULL_TRUCKLOAD_FTL_DEDICATED_DIRECT\nLESS_THAN_TRUCKLOAD_LTL_CONSOLIDATED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which freight shipping mode is selected for a shipment of 24 full standard pallets to ensure dedicated direct transportation without intermediate hub stops?",
          "expectedStringOutput": "FULL_TRUCKLOAD_FTL_DEDICATED_DIRECT",
          "acceptableAnswers": [
            "FULL_TRUCKLOAD_FTL_DEDICATED_DIRECT",
            "FTL",
            "Full Truckload"
          ],
          "primaryMisconceptionId": "MC_OPS_LOGISTICS_FREIGHT_INCOTERMS_LANDED_COST",
          "diagnosisMap": {
            "LTL": {
              "misconceptionId": "MC_OPS_LOGISTICS_FREIGHT_INCOTERMS_LANDED_COST",
              "errorExplanation": "LTL is for small pallet counts. 24 pallets fills an entire truck: FULL_TRUCKLOAD_FTL_DEDICATED_DIRECT.",
              "recoveryPath": {
                "simplerExplanation": "Matches FULL_TRUCKLOAD_FTL_DEDICATED_DIRECT.",
                "guidedFixPrompt": "Type FULL_TRUCKLOAD_FTL_DEDICATED_DIRECT"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 4,
    "title": "Demand Forecasting & S&OP: Exponential Smoothing & MAPE Accuracy",
    "overviewMetaphor": "Demand Forecasting is Navigating a Ship Using Radar Combined with Inertia: If last month's forecast was 1,000 units and actual sales spiked to 1,200 units, over-reacting and manufacturing 1,500 units causes a Bullwhip catastrophe; using Exponential Smoothing with a smoothing factor of $\\alpha = 0.20$ ($F_{t+1} = 1,000 + 0.20(1,200 - 1,000) = 1,040$ units) gracefully adjusts production, keeping Mean Absolute Percentage Error (MAPE) below 5.0% and preventing massive inventory overstock.",
    "blocks": [
      {
        "id": "ops-d4-b1-exponential-smoothing-calculation",
        "day": 4,
        "blockNumber": 1,
        "title": "Exponential Smoothing Forecast Equation: $F_{t+1} = F_t + \\alpha (A_t - F_t)$",
        "conceptBudget": {
          "primaryConcept": "Exponential Smoothing Formula",
          "supportingTerms": [
            "Previous Period Forecast ($F_t = 1,000$ units)",
            "Actual Demand ($A_t = 1,200$ units)",
            "Smoothing Factor ($\\alpha = 0.20$)",
            "New Forecast $F_{t+1} = 1,000 + 0.20(1,200 - 1,000) = 1,000 + 40 = 1,040$ units",
            "MAPE Accuracy Standard: $\\le 5.0\\%$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d3-b1-total-landed-cost-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "S&OP Demand Forecasting Ledger (F_t=1000, A_t=1200, alpha=0.2)",
              "boxes": [
                {
                  "label": "Prior Period Baseline",
                  "value": "F_t = 1,000 Units Baseline Forecast",
                  "varType": "Baseline",
                  "isUpdated": false
                },
                {
                  "label": "Forecast Error (A_t - F_t)",
                  "value": "1,200 Actual - 1,000 Forecast = +200 Units Surge Error",
                  "varType": "Error",
                  "isUpdated": false
                },
                {
                  "label": "Smoothed Forecast (F_t+1)",
                  "value": "1,000 + (0.2 x 200) = 1,040 UNITS (DAMPENS BULLWHIP OSCILLATION!)",
                  "varType": "Forecast",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "smoothing_calc_demo.js",
            "initialCode": "function calculateSmoothing(prevF, actualA, alpha) {\n  const nextF = prevF + (alpha * (actualA - prevF));\n  return {\n    prevF,\n    actualA,\n    alpha,\n    nextPeriodForecast: Math.round(nextF),\n    status: 'FORECAST_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateSmoothing(1000, 1200, 0.2)));",
            "expectedOutput": "{\"prevF\":1000,\"actualA\":1200,\"alpha\":0.2,\"nextPeriodForecast\":1040,\"status\":\"FORECAST_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the new forecast for next period when previous forecast was 1,000 units, actual demand was 1,200 units, and smoothing constant alpha is 0.20 ($1,000 + 0.20 \\times (1,200 - 1,000)$)?",
          "expectedStringOutput": "1040",
          "acceptableAnswers": [
            "1040",
            "1040 units",
            "nextPeriodForecast\":1040"
          ],
          "primaryMisconceptionId": "MC_OPS_DEMAND_FORECASTING_SOP_MAPE",
          "diagnosisMap": {
            "1200": {
              "misconceptionId": "MC_OPS_DEMAND_FORECASTING_SOP_MAPE",
              "errorExplanation": "1200 is raw actual demand without smoothing. Exponential smoothing yields 1,040 units.",
              "recoveryPath": {
                "simplerExplanation": "1,000 + 0.2*(200) = 1,040.",
                "guidedFixPrompt": "Type 1040"
              }
            }
          }
        }
      },
      {
        "id": "ops-d4-b2-bullwhip-effect-mitigation",
        "day": 4,
        "blockNumber": 2,
        "title": "The Bullwhip Effect: Root Causes & POS Data Sharing Remedies",
        "conceptBudget": {
          "primaryConcept": "Bullwhip Effect Mitigation",
          "supportingTerms": [
            "Bullwhip Effect (Small 5% shift in retail sales amplifies into a 40% swing in tier-2 raw material supplier orders)",
            "Remedy: Real-time Point-of-Sale (POS) data sharing via EDI/API & Vendor-Managed Inventory (VMI)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d4-b1-exponential-smoothing-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Demand Distortion Hierarchy",
            "codeSnippet": "// RETAILER:   +5% Sales Increase\n// DISTRIBUTOR: +15% Safety Order (Anticipating stockout)\n// FACTORY:     +30% Production Batch (Batch economics)\n// SUPPLIER:    +60% Raw Material Order (MASSIVE BULLWHIP DISTORTION!)",
            "lineNotes": {
              "1": "True consumer signal.",
              "2": "Tier 1 inflation.",
              "3": "Tier 2 inflation.",
              "4": "Upstream distortion catastrophe."
            }
          },
          {
            "type": "runnable_code",
            "filename": "bullwhip_remedy_demo.js",
            "initialCode": "function getBullwhipPrimaryRemedy() {\n  return 'REAL_TIME_POINT_OF_SALE_POS_DATA_SHARING_AND_VMI';\n}\n\nconsole.log(getBullwhipPrimaryRemedy());",
            "expectedOutput": "REAL_TIME_POINT_OF_SALE_POS_DATA_SHARING_AND_VMI",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What operational supply chain integration strategy effectively dampens the Bullwhip Effect across multi-tier suppliers?",
          "expectedStringOutput": "REAL_TIME_POINT_OF_SALE_POS_DATA_SHARING_AND_VMI",
          "acceptableAnswers": [
            "REAL_TIME_POINT_OF_SALE_POS_DATA_SHARING_AND_VMI",
            "POS Data Sharing",
            "VMI"
          ],
          "primaryMisconceptionId": "MC_OPS_DEMAND_FORECASTING_SOP_MAPE",
          "diagnosisMap": {
            "HOARDING": {
              "misconceptionId": "MC_OPS_DEMAND_FORECASTING_SOP_MAPE",
              "errorExplanation": "Hoarding inventory worsens the bullwhip. The remedy is REAL_TIME_POINT_OF_SALE_POS_DATA_SHARING_AND_VMI.",
              "recoveryPath": {
                "simplerExplanation": "Matches REAL_TIME_POINT_OF_SALE_POS_DATA_SHARING_AND_VMI.",
                "guidedFixPrompt": "Type REAL_TIME_POINT_OF_SALE_POS_DATA_SHARING_AND_VMI"
              }
            }
          }
        }
      },
      {
        "id": "ops-d4-b3-sop-monthly-cadence",
        "day": 4,
        "blockNumber": 3,
        "title": "The Monthly Sales & Operations Planning (S&OP) 5-Step Governance Cadence",
        "conceptBudget": {
          "primaryConcept": "S&OP 5-Step Cycle",
          "supportingTerms": [
            "Step 1: Data Gathering $\\to$ Step 2: Demand Planning $\\to$ Step 3: Supply Planning $\\to$ Step 4: Pre-S&OP Review $\\to$ Step 5: Executive S&OP Sign-Off"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d4-b2-bullwhip-effect-mitigation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "sop_cadence_demo.js",
            "initialCode": "function getSopSteps() {\n  return ['DATA_GATHERING', 'DEMAND_PLANNING', 'SUPPLY_PLANNING', 'PRE_SOP_REVIEW', 'EXECUTIVE_SOP_SIGNOFF'];\n}\n\nconsole.log(JSON.stringify(getSopSteps()));",
            "expectedOutput": "[\"DATA_GATHERING\",\"DEMAND_PLANNING\",\"SUPPLY_PLANNING\",\"PRE_SOP_REVIEW\",\"EXECUTIVE_SOP_SIGNOFF\"]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the final decision-making step in the monthly 5-step Sales & Operations Planning (S&OP) cadence?",
          "expectedStringOutput": "EXECUTIVE_SOP_SIGNOFF",
          "acceptableAnswers": [
            "EXECUTIVE_SOP_SIGNOFF",
            "Executive S&OP",
            "Executive sign-off"
          ],
          "primaryMisconceptionId": "MC_OPS_DEMAND_FORECASTING_SOP_MAPE",
          "diagnosisMap": {
            "DATA_GATHERING": {
              "misconceptionId": "MC_OPS_DEMAND_FORECASTING_SOP_MAPE",
              "errorExplanation": "Data gathering is step 1. The final step is EXECUTIVE_SOP_SIGNOFF.",
              "recoveryPath": {
                "simplerExplanation": "Matches EXECUTIVE_SOP_SIGNOFF.",
                "guidedFixPrompt": "Type EXECUTIVE_SOP_SIGNOFF"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 5,
    "title": "⭐ MILESTONE 1: Complete Process Mapping, EOQ Inventory & S&OP Forecasting Engine",
    "overviewMetaphor": "Milestone 1 Synthesis: The complete sovereign operations planning and inventory optimization suite: 1. Process flow efficiency ($30.0\\%$); 2. EOQ batch sizing ($500$ units) and ROP trigger ($400$ units); 3. Total Landed Cost ($72.50$ per unit); 4. S&OP Exponential Smoothing ($1040$ units).",
    "blocks": [
      {
        "id": "ops-d5-b1-ops-planning-master-synthesis",
        "day": 5,
        "blockNumber": 1,
        "title": "Supply Chain & Operations Planning Master Kernel Synthesis",
        "conceptBudget": {
          "primaryConcept": "Operations Planning Master Kernel Synthesis",
          "supportingTerms": [
            "Flow Efficiency Engine",
            "EOQ ROP Engine",
            "Total Landed Cost Engine",
            "S&OP Forecasting Engine"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d4-b3-sop-monthly-cadence",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Milestone 1 Operations Planning Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "Maps value streams achieving 30% process flow efficiency",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Calculates optimal 500 EOQ batch size and 400 ROP trigger",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Models $72.50 Total Landed Cost with Incoterms 2020",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Computes 1040-unit smoothed forecast and certifies planning kernel!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "ops_planning_kernel_demo.js",
            "initialCode": "function runOpsPlanningEngine() {\n  return {\n    vsmSubsystem: 'ONLINE_30_PERCENT_EFFICIENCY_ACTIVE',\n    eoqSubsystem: 'ONLINE_500_EOQ_400_ROP_ACTIVE',\n    landedCostSubsystem: 'ONLINE_72_50_TLC_ACTIVE',\n    sopSubsystem: 'ONLINE_1040_FORECAST_ACTIVE',\n    engineStatus: 'OPS_PLANNING_AND_INVENTORY_KERNEL_ACTIVE_NOMINAL'\n  };\n}\n\nconsole.log(runOpsPlanningEngine().engineStatus);",
            "expectedOutput": "OPS_PLANNING_AND_INVENTORY_KERNEL_ACTIVE_NOMINAL",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What engine status confirms active operational synthesis of the Supply Chain & Operations Planning Master Kernel?",
          "expectedStringOutput": "OPS_PLANNING_AND_INVENTORY_KERNEL_ACTIVE_NOMINAL",
          "acceptableAnswers": [
            "OPS_PLANNING_AND_INVENTORY_KERNEL_ACTIVE_NOMINAL",
            "engineStatus: OPS_PLANNING_AND_INVENTORY_KERNEL_ACTIVE_NOMINAL"
          ],
          "primaryMisconceptionId": "MC_OPS_PROCESS_MAPPING_SIPOC_VALUE_STREAM",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_OPS_PROCESS_MAPPING_SIPOC_VALUE_STREAM",
              "errorExplanation": "Matches OPS_PLANNING_AND_INVENTORY_KERNEL_ACTIVE_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type OPS_PLANNING_AND_INVENTORY_KERNEL_ACTIVE_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "ops-d5-b2-ops-planning-engine-audit",
        "day": 5,
        "blockNumber": 2,
        "title": "Operations Planning Engine Invariant Verification & Precision Audit",
        "conceptBudget": {
          "primaryConcept": "Operations Planning Invariant Verification",
          "supportingTerms": [
            "Flow Invariant",
            "EOQ Invariant",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d5-b1-ops-planning-master-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "ops_planning_audit_demo.js",
            "initialCode": "function auditOpsPlanningEngine(flowValid, eoqValid, tlcValid, sopValid) {\n  const passed = flowValid && eoqValid && tlcValid && sopValid;\n  return {\n    flowVerified: flowValid,\n    eoqVerified: eoqValid,\n    tlcVerified: tlcValid,\n    sopVerified: sopValid,\n    grade: passed ? 'OPS_PLANNING_ENGINE_AUDIT_PASSED' : 'AUDIT_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditOpsPlanningEngine(true, true, true, true)));",
            "expectedOutput": "{\"flowVerified\":true,\"eoqVerified\":true,\"tlcVerified\":true,\"sopVerified\":true,\"grade\":\"OPS_PLANNING_ENGINE_AUDIT_PASSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade is awarded when Flow Efficiency, EOQ, Landed Cost, and S&OP engines pass 100%?",
          "expectedStringOutput": "OPS_PLANNING_ENGINE_AUDIT_PASSED",
          "acceptableAnswers": [
            "OPS_PLANNING_ENGINE_AUDIT_PASSED",
            "grade\":\"OPS_PLANNING_ENGINE_AUDIT_PASSED\""
          ],
          "primaryMisconceptionId": "MC_OPS_PROCESS_MAPPING_SIPOC_VALUE_STREAM",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_OPS_PROCESS_MAPPING_SIPOC_VALUE_STREAM",
              "errorExplanation": "All checks passing awards OPS_PLANNING_ENGINE_AUDIT_PASSED.",
              "recoveryPath": {
                "simplerExplanation": "Awards OPS_PLANNING_ENGINE_AUDIT_PASSED.",
                "guidedFixPrompt": "Type OPS_PLANNING_ENGINE_AUDIT_PASSED"
              }
            }
          }
        }
      },
      {
        "id": "ops-d5-b3-milestone1-ops-cert",
        "day": 5,
        "blockNumber": 3,
        "title": "Milestone 1 Operations Planning & Inventory Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 1 Certification",
          "supportingTerms": [
            "Operations Planning Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d5-b2-ops-planning-engine-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone1_ops_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 1: Complete Process Mapping, EOQ Inventory & S&OP Forecasting Engine [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 1: Complete Process Mapping, EOQ Inventory & S&OP Forecasting Engine [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 1 completion?",
          "expectedStringOutput": "⭐ MILESTONE 1: Complete Process Mapping, EOQ Inventory & S&OP Forecasting Engine [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 1: Complete Process Mapping, EOQ Inventory & S&OP Forecasting Engine [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_OPS_PROCESS_MAPPING_SIPOC_VALUE_STREAM",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_OPS_PROCESS_MAPPING_SIPOC_VALUE_STREAM",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 1: Complete Process Mapping, EOQ Inventory & S&OP Forecasting Engine [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 6,
    "title": "Capacity Planning & Overall Equipment Effectiveness (OEE >= 85.0%)",
    "overviewMetaphor": "OEE is a Triple-Filter Sieve Measuring Factory Productivity: If a factory machine operates for 95.0% of planned uptime (Availability $A = 0.95$), runs at 95.0% of its rated nameplate speed (Performance $P = 0.95$), and produces 95.0% defect-free parts (Quality $Q = 0.95$), the Overall Equipment Effectiveness is $OEE = 0.95 \\times 0.95 \\times 0.95 = 85.7\\%$; achieving $\\ge 85.0\\%$ OEE certifies World-Class Manufacturing excellence, proving equipment is utilized with near-zero waste.",
    "blocks": [
      {
        "id": "ops-d6-b1-oee-three-pillar-calculation",
        "day": 6,
        "blockNumber": 1,
        "title": "Overall Equipment Effectiveness (OEE) Formula: $\\text{OEE} = A \\times P \\times Q \\ge 85.0\\%$",
        "conceptBudget": {
          "primaryConcept": "OEE Three-Pillar Formula",
          "supportingTerms": [
            "Availability ($A = 95.0\\% = 0.95$)",
            "Performance ($P = 95.0\\% = 0.95$)",
            "Quality ($Q = 95.0\\% = 0.95$)",
            "OEE = $0.95 \\times 0.95 \\times 0.95 = 85.7\\%$",
            "World-Class Manufacturing Benchmark: $\\ge 85.0\\%$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d1-b1-flow-efficiency-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "OEE World-Class Manufacturing Ledger (A=95%, P=95%, Q=95%)",
              "boxes": [
                {
                  "label": "Availability (Uptime)",
                  "value": "95.0% (Minimal Unplanned Machine Downtime & Setup Changeover)",
                  "varType": "Availability",
                  "isUpdated": false
                },
                {
                  "label": "Performance (Speed)",
                  "value": "95.0% (Operating at Near Full Nameplate Design Speed)",
                  "varType": "Performance",
                  "isUpdated": false
                },
                {
                  "label": "Quality (First-Pass Yield)",
                  "value": "95.0% (Near Zero Scrap Defect & Rework Rate)",
                  "varType": "Quality",
                  "isUpdated": false
                },
                {
                  "label": "Overall Equipment Efficiency",
                  "value": "0.95 x 0.95 x 0.95 = 85.7% (WORLD-CLASS MANUFACTURING EXCELLENCE!)",
                  "varType": "OEE",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "oee_calc_demo.js",
            "initialCode": "function calculateOee(a, p, q) {\n  const oee = (a / 100) * (p / 100) * (q / 100) * 100;\n  const isWorldClass = oee >= 85.0;\n  return {\n    availability: a,\n    performance: p,\n    quality: q,\n    oeePercent: Number(oee.toFixed(1)),\n    isWorldClass,\n    status: isWorldClass ? 'WORLD_CLASS_OEE_MANUFACTURING_EXCELLENCE' : 'SUB_OPTIMAL'\n  };\n}\n\nconsole.log(JSON.stringify(calculateOee(95, 95, 95)));\nconsole.log(JSON.stringify(calculateOee(80, 80, 90)));",
            "expectedOutput": "{\"availability\":95,\"performance\":95,\"quality\":95,\"oeePercent\":85.7,\"isWorldClass\":true,\"status\":\"WORLD_CLASS_OEE_MANUFACTURING_EXCELLENCE\"}\n{\"availability\":80,\"performance\":80,\"quality\":90,\"oeePercent\":57.6,\"isWorldClass\":false,\"status\":\"SUB_OPTIMAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Overall Equipment Effectiveness (OEE) percentage when Availability is 95%, Performance is 95%, and Quality is 95% ($0.95 \\times 0.95 \\times 0.95 \\times 100$)?",
          "expectedStringOutput": "85.7",
          "acceptableAnswers": [
            "85.7",
            "85.7%",
            "oeePercent\":85.7"
          ],
          "primaryMisconceptionId": "MC_OPS_CAPACITY_PLANNING_TOC_OEE",
          "diagnosisMap": {
            "95": {
              "misconceptionId": "MC_OPS_CAPACITY_PLANNING_TOC_OEE",
              "errorExplanation": "95 averages the terms. OEE multiplies them: 0.95 * 0.95 * 0.95 = 85.7%.",
              "recoveryPath": {
                "simplerExplanation": "0.95 * 0.95 * 0.95 = 85.7%.",
                "guidedFixPrompt": "Type 85.7"
              }
            }
          }
        }
      },
      {
        "id": "ops-d6-b2-theory-of-constraints-bottlenecks",
        "day": 6,
        "blockNumber": 2,
        "title": "Theory of Constraints (TOC): Goldratt's 5 Focusing Steps & Drum-Buffer-Rope",
        "conceptBudget": {
          "primaryConcept": "Theory of Constraints Invariant",
          "supportingTerms": [
            "1. Identify Bottleneck $\\to$ 2. Exploit $\\to$ 3. Subordinate $\\to$ 4. Elevate $\\to$ 5. Repeat",
            "An hour lost on the bottleneck is an hour lost for the entire factory!"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d6-b1-oee-three-pillar-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Goldratt's 5 Focusing Steps",
            "codeSnippet": "// 1. IDENTIFY:    Station 3 (CNC Milling) produces only 20 units/hr (Bottleneck)\n// 2. EXPLOIT:     Never let CNC Milling sit idle during lunch or shift changes\n// 3. SUBORDINATE: Upstream stamping only produces at 20 units/hr to prevent pileup\n// 4. ELEVATE:     Purchase a second CNC machine to expand factory throughput!",
            "lineNotes": {
              "1": "Locating constraint.",
              "2": "100% utilization.",
              "3": "Pace alignment.",
              "4": "Capacity investment."
            }
          },
          {
            "type": "runnable_code",
            "filename": "toc_steps_demo.js",
            "initialCode": "function getTocConstraintGoldenRule() {\n  return 'AN_HOUR_LOST_ON_THE_BOTTLENECK_IS_AN_HOUR_LOST_FOR_THE_ENTIRE_SYSTEM';\n}\n\nconsole.log(getTocConstraintGoldenRule());",
            "expectedOutput": "AN_HOUR_LOST_ON_THE_BOTTLENECK_IS_AN_HOUR_LOST_FOR_THE_ENTIRE_SYSTEM",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is Eliyahu Goldratt's core operational maxim regarding machine downtime on the bottleneck workstation?",
          "expectedStringOutput": "AN_HOUR_LOST_ON_THE_BOTTLENECK_IS_AN_HOUR_LOST_FOR_THE_ENTIRE_SYSTEM",
          "acceptableAnswers": [
            "AN_HOUR_LOST_ON_THE_BOTTLENECK_IS_AN_HOUR_LOST_FOR_THE_ENTIRE_SYSTEM",
            "Hour lost on bottleneck is lost forever"
          ],
          "primaryMisconceptionId": "MC_OPS_CAPACITY_PLANNING_TOC_OEE",
          "diagnosisMap": {
            "MAKE_UP": {
              "misconceptionId": "MC_OPS_CAPACITY_PLANNING_TOC_OEE",
              "errorExplanation": "Bottlenecks have zero excess capacity. AN_HOUR_LOST_ON_THE_BOTTLENECK_IS_AN_HOUR_LOST_FOR_THE_ENTIRE_SYSTEM.",
              "recoveryPath": {
                "simplerExplanation": "Matches AN_HOUR_LOST_ON_THE_BOTTLENECK_IS_AN_HOUR_LOST_FOR_THE_ENTIRE_SYSTEM.",
                "guidedFixPrompt": "Type AN_HOUR_LOST_ON_THE_BOTTLENECK_IS_AN_HOUR_LOST_FOR_THE_ENTIRE_SYSTEM"
              }
            }
          }
        }
      },
      {
        "id": "ops-d6-b3-design-vs-effective-capacity",
        "day": 6,
        "blockNumber": 3,
        "title": "Design Capacity vs Effective Capacity vs Actual Output",
        "conceptBudget": {
          "primaryConcept": "Capacity Utilization Invariant",
          "supportingTerms": [
            "Design Capacity (Theoretical maximum 24/7 run)",
            "Effective Capacity (Design minus planned maintenance & lunch breaks)",
            "Utilization = $\\frac{\\text{Actual Output}}{\\text{Design Capacity}}$",
            "Efficiency = $\\frac{\\text{Actual Output}}{\\text{Effective Capacity}}$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d6-b2-theory-of-constraints-bottlenecks",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "capacity_metrics_demo.js",
            "initialCode": "function calculateCapacityMetrics(actual, design, effective) {\n  return {\n    utilizationPct: Number(((actual / design) * 100).toFixed(1)),\n    efficiencyPct: Number(((actual / effective) * 100).toFixed(1))\n  };\n}\n\nconsole.log(JSON.stringify(calculateCapacityMetrics(80, 100, 90)));",
            "expectedOutput": "{\"utilizationPct\":80,\"efficiencyPct\":88.9}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the operational efficiency percentage when actual output is 80 units against an effective capacity of 90 units ($ (80 / 90) \\times 100 $)?",
          "expectedStringOutput": "88.9",
          "acceptableAnswers": [
            "88.9",
            "88.9%",
            "efficiencyPct\":88.9"
          ],
          "primaryMisconceptionId": "MC_OPS_CAPACITY_PLANNING_TOC_OEE",
          "diagnosisMap": {
            "80": {
              "misconceptionId": "MC_OPS_CAPACITY_PLANNING_TOC_OEE",
              "errorExplanation": "80% is utilization against design capacity (80/100). Efficiency is 80/90 = 88.9%.",
              "recoveryPath": {
                "simplerExplanation": "80 / 90 * 100 = 88.9%.",
                "guidedFixPrompt": "Type 88.9"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 7,
    "title": "Lean Operations & Waste Elimination: The 8 Wastes (TIM WOODS) & 5S",
    "overviewMetaphor": "The 8 Wastes of Lean Are Parasites Draining Operational Profit: In an un-lean facility, money leaks through Transportation (moving boxes 10 times), Inventory (dusty unsold stock), Motion (workers walking 5 miles a day looking for tools), Waiting (idling for parts), Overproduction (making goods before orders exist), Overprocessing (painting unexposed metal), Defects (scrap), and Skills (ignoring operator ideas); implementing 5S (Sort, Set in order, Shine, Standardize, Sustain) and Poka-Yoke mistake-proofing eliminates all 8 TIM WOODS wastes.",
    "blocks": [
      {
        "id": "ops-d7-b1-eight-wastes-tim-woods-taxonomy",
        "day": 7,
        "blockNumber": 1,
        "title": "The 8 Wastes of Lean (TIM WOODS) Taxonomy",
        "conceptBudget": {
          "primaryConcept": "TIM WOODS Waste Taxonomy",
          "supportingTerms": [
            "T (Transportation)",
            "I (Inventory)",
            "M (Motion)",
            "W (Waiting)",
            "O (Overproduction — The worst waste!)",
            "O (Overprocessing)",
            "D (Defects)",
            "S (Skills underutilization)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d6-b1-oee-three-pillar-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Lean Operations Waste Elimination Matrix (TIM WOODS)",
              "boxes": [
                {
                  "label": "Worst Operational Waste",
                  "value": "OVERPRODUCTION (Produces inventory holding costs, defects & congestion)",
                  "varType": "Root Waste",
                  "isUpdated": false
                },
                {
                  "label": "Physical Floor Wastes",
                  "value": "Transportation + Motion + Waiting + Overprocessing (NVA)",
                  "varType": "Floor Waste",
                  "isUpdated": false
                },
                {
                  "label": "Lean Elimination Standard",
                  "value": "ALL 8 TIM WOODS WASTES SYSTEMATICALLY ELIMINATED VIA KAIZEN!",
                  "varType": "Standard",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "tim_woods_demo.js",
            "initialCode": "function getWorstLeanWaste() {\n  return 'OVERPRODUCTION_IS_THE_MOTHER_OF_ALL_OPERATIONAL_WASTES';\n}\n\nconsole.log(getWorstLeanWaste());",
            "expectedOutput": "OVERPRODUCTION_IS_THE_MOTHER_OF_ALL_OPERATIONAL_WASTES",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which of the 8 TIM WOODS wastes is considered the most damaging in Lean philosophy because it directly generates inventory holding costs, defects, and floor congestion?",
          "expectedStringOutput": "OVERPRODUCTION_IS_THE_MOTHER_OF_ALL_OPERATIONAL_WASTES",
          "acceptableAnswers": [
            "OVERPRODUCTION_IS_THE_MOTHER_OF_ALL_OPERATIONAL_WASTES",
            "Overproduction",
            "Overproduction waste"
          ],
          "primaryMisconceptionId": "MC_OPS_LEAN_OPERATIONS_EIGHT_WASTES_5S",
          "diagnosisMap": {
            "WAITING": {
              "misconceptionId": "MC_OPS_LEAN_OPERATIONS_EIGHT_WASTES_5S",
              "errorExplanation": "Waiting is costly, but OVERPRODUCTION_IS_THE_MOTHER_OF_ALL_OPERATIONAL_WASTES.",
              "recoveryPath": {
                "simplerExplanation": "Matches OVERPRODUCTION_IS_THE_MOTHER_OF_ALL_OPERATIONAL_WASTES.",
                "guidedFixPrompt": "Type OVERPRODUCTION_IS_THE_MOTHER_OF_ALL_OPERATIONAL_WASTES"
              }
            }
          }
        }
      },
      {
        "id": "ops-d7-b2-five-s-workplace-organization",
        "day": 7,
        "blockNumber": 2,
        "title": "The 5S Workplace Methodology: Sort, Set in Order, Shine, Standardize, Sustain",
        "conceptBudget": {
          "primaryConcept": "5S Methodology",
          "supportingTerms": [
            "1. Seiri (Sort: Red tag & discard unneeded items)",
            "2. Seiton (Set in order: Shadow boards for every tool)",
            "3. Seiso (Shine: Clean and inspect daily)",
            "4. Seiketsu (Standardize: Visual SOPs)",
            "5. Shitsuke (Sustain: Weekly 5S audits)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d7-b1-eight-wastes-tim-woods-taxonomy",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "5S Step Execution",
            "codeSnippet": "// 1. SORT:         Red-tag all tools unused in the last 30 days and remove\n// 2. SET IN ORDER: Paint tool silhouettes on shadow board ('A place for everything')\n// 3. SHINE:        Wipe down machines at end of shift to spot oil leaks\n// 4. STANDARDIZE:  Color-code floor tape (Green=Good, Yellow=WIP, Red=Defect)\n// 5. SUSTAIN:      Conduct 5-minute daily audits to preserve standard",
            "lineNotes": {
              "1": "De-clutter.",
              "2": "Visual location.",
              "3": "Clean & inspect.",
              "4": "Visual standards.",
              "5": "Discipline."
            }
          },
          {
            "type": "runnable_code",
            "filename": "five_s_demo.js",
            "initialCode": "function getFiveSPillars() {\n  return ['SORT', 'SET_IN_ORDER', 'SHINE', 'STANDARDIZE', 'SUSTAIN'];\n}\n\nconsole.log(JSON.stringify(getFiveSPillars()));",
            "expectedOutput": "[\"SORT\",\"SET_IN_ORDER\",\"SHINE\",\"STANDARDIZE\",\"SUSTAIN\"]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is Step 2 in the 5S workplace organization methodology where items are arranged with visual shadow boards so they are easy to find and return?",
          "expectedStringOutput": "SET_IN_ORDER",
          "acceptableAnswers": [
            "SET_IN_ORDER",
            "Set in order",
            "Seiton"
          ],
          "primaryMisconceptionId": "MC_OPS_LEAN_OPERATIONS_EIGHT_WASTES_5S",
          "diagnosisMap": {
            "SORT": {
              "misconceptionId": "MC_OPS_LEAN_OPERATIONS_EIGHT_WASTES_5S",
              "errorExplanation": "Sort is Step 1. Step 2 is SET_IN_ORDER.",
              "recoveryPath": {
                "simplerExplanation": "Matches SET_IN_ORDER.",
                "guidedFixPrompt": "Type SET_IN_ORDER"
              }
            }
          }
        }
      },
      {
        "id": "ops-d7-b3-poka-yoke-mistake-proofing",
        "day": 7,
        "blockNumber": 3,
        "title": "Poka-Yoke: Designing Mechanical & Digital Mistake-Proofing",
        "conceptBudget": {
          "primaryConcept": "Poka-Yoke Design Invariant",
          "supportingTerms": [
            "Poka-Yoke (Mistake-proofing: Designing parts that physically cannot be inserted backwards e.g. SIM card diagonal notch, 3-prong electrical plug, mandatory form validation)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d7-b2-five-s-workplace-organization",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "poka_yoke_demo.js",
            "initialCode": "function evaluatePokaYoke(isPhysicallyImpossibleToAssembleIncorrectly) {\n  return isPhysicallyImpossibleToAssembleIncorrectly\n    ? 'POKA_YOKE_MISTAKE_PROOFING_ZERO_DEFECT_DESIGN'\n    : 'HUMAN_ERROR_RISK_PRESENT';\n}\n\nconsole.log(evaluatePokaYoke(true));",
            "expectedOutput": "POKA_YOKE_MISTAKE_PROOFING_ZERO_DEFECT_DESIGN",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What design classification describes a manufacturing fixture or interface engineered such that it is physically impossible to assemble backwards?",
          "expectedStringOutput": "POKA_YOKE_MISTAKE_PROOFING_ZERO_DEFECT_DESIGN",
          "acceptableAnswers": [
            "POKA_YOKE_MISTAKE_PROOFING_ZERO_DEFECT_DESIGN",
            "Poka Yoke",
            "Poka-Yoke"
          ],
          "primaryMisconceptionId": "MC_OPS_LEAN_OPERATIONS_EIGHT_WASTES_5S",
          "diagnosisMap": {
            "MANUAL_INSPECTION": {
              "misconceptionId": "MC_OPS_LEAN_OPERATIONS_EIGHT_WASTES_5S",
              "errorExplanation": "Inspections catch errors after they occur. Physical mistake-proofing is POKA_YOKE_MISTAKE_PROOFING_ZERO_DEFECT_DESIGN.",
              "recoveryPath": {
                "simplerExplanation": "Matches POKA_YOKE_MISTAKE_PROOFING_ZERO_DEFECT_DESIGN.",
                "guidedFixPrompt": "Type POKA_YOKE_MISTAKE_PROOFING_ZERO_DEFECT_DESIGN"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 8,
    "title": "Quality Management & Six Sigma: DMAIC & Process Capability (Cpk >= 1.33)",
    "overviewMetaphor": "Process Capability (Cpk) is Parking a Sports Car Inside an Airplane Hangar: If your customer's tolerance limits are Upper Spec $USL = 105$ and Lower Spec $LSL = 95$, and your manufacturing process mean is $\\mu = 100$ with standard deviation $\\sigma = 1.0$, your Process Capability Index is $C_{pk} = \\min\\left(\\frac{105-100}{3}, \\frac{100-95}{3}\\right) = \\frac{5}{3} = 1.67$; because $C_{pk} = 1.67 \\ge 1.33$, the process operates with near-zero defect probability ($DPMO \\le 3.4$ defects per million parts), ensuring near-perfect Six Sigma quality.",
    "blocks": [
      {
        "id": "ops-d8-b1-cpk-process-capability-calculation",
        "day": 8,
        "blockNumber": 1,
        "title": "Process Capability Index ($C_{pk}$) Equation: $C_{pk} = \\min\\left(\\frac{USL - \\mu}{3\\sigma}, \\frac{\\mu - LSL}{3\\sigma}\\right) \\ge 1.33$",
        "conceptBudget": {
          "primaryConcept": "Process Capability Index Formula",
          "supportingTerms": [
            "Upper Specification Limit ($USL = 105.0$)",
            "Lower Specification Limit ($LSL = 95.0$)",
            "Process Mean ($\\mu = 100.0$)",
            "Process Sigma ($\\sigma = 1.0$)",
            "$C_{pu} = \\frac{105 - 100}{3 \\times 1} = 1.67$",
            "$C_{pl} = \\frac{100 - 95}{3 \\times 1} = 1.67$",
            "$C_{pk} = \\min(1.67, 1.67) = 1.67$",
            "Capable Quality Threshold: $\\ge 1.33 \\implies$ Highly Capable Six Sigma Process"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d7-b1-eight-wastes-tim-woods-taxonomy",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Six Sigma Process Capability Ledger (USL=105, LSL=95, Mean=100, Sigma=1.0)",
              "boxes": [
                {
                  "label": "Customer Tolerance Spread",
                  "value": "USL (105.0) - LSL (95.0) = 10.0 Units Total Tolerance Range",
                  "varType": "Tolerance",
                  "isUpdated": false
                },
                {
                  "label": "Process Variation (3-Sigma)",
                  "value": "3 x Sigma (1.0) = 3.0 Units Half-Width Spread",
                  "varType": "Spread",
                  "isUpdated": false
                },
                {
                  "label": "Process Capability Index",
                  "value": "Cpk = 5.0 / 3.0 = 1.67 (SIX SIGMA HIGHLY CAPABLE PROCESS >= 1.33!)",
                  "varType": "Cpk",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "cpk_calc_demo.js",
            "initialCode": "function calculateCpk(usl, lsl, mean, sigma) {\n  const cpu = (usl - mean) / (3 * sigma);\n  const cpl = (mean - lsl) / (3 * sigma);\n  const cpk = Math.min(cpu, cpl);\n  const isCapable = cpk >= 1.33;\n  return {\n    usl,\n    lsl,\n    mean,\n    sigma,\n    cpk: Number(cpk.toFixed(2)),\n    isCapable,\n    status: isCapable ? 'SIX_SIGMA_PROCESS_HIGHLY_CAPABLE' : 'INSUFFICIENT_CAPABILITY'\n  };\n}\n\nconsole.log(JSON.stringify(calculateCpk(105, 95, 100, 1.0)));\nconsole.log(JSON.stringify(calculateCpk(105, 95, 100, 2.0)));",
            "expectedOutput": "{\"usl\":105,\"lsl\":95,\"mean\":100,\"sigma\":1,\"cpk\":1.67,\"isCapable\":true,\"status\":\"SIX_SIGMA_PROCESS_HIGHLY_CAPABLE\"}\n{\"usl\":105,\"lsl\":95,\"mean\":100,\"sigma\":2,\"cpk\":0.83,\"isCapable\":false,\"status\":\"INSUFFICIENT_CAPABILITY\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Process Capability Index (Cpk) when Upper Spec is 105, Lower Spec is 95, Mean is 100, and process standard deviation is 1.0 ($ (105 - 100) / (3 \\times 1.0) $)?",
          "expectedStringOutput": "1.67",
          "acceptableAnswers": [
            "1.67",
            "Cpk=1.67",
            "cpk\":1.67"
          ],
          "primaryMisconceptionId": "MC_OPS_SIX_SIGMA_DMAIC_SPC_CPK",
          "diagnosisMap": {
            "5.0": {
              "misconceptionId": "MC_OPS_SIX_SIGMA_DMAIC_SPC_CPK",
              "errorExplanation": "5.0 is the numerator (105 - 100). Divided by 3*sigma (3.0) gives Cpk = 1.67.",
              "recoveryPath": {
                "simplerExplanation": "5.0 / 3.0 = 1.67.",
                "guidedFixPrompt": "Type 1.67"
              }
            }
          }
        }
      },
      {
        "id": "ops-d8-b2-dmaic-five-phases",
        "day": 8,
        "blockNumber": 2,
        "title": "The 5 Phases of Six Sigma DMAIC: Define, Measure, Analyze, Improve, Control",
        "conceptBudget": {
          "primaryConcept": "DMAIC Roadmap",
          "supportingTerms": [
            "D (Define: Problem statement & business case)",
            "M (Measure: Process baseline & measurement system analysis MSA)",
            "A (Analyze: Root cause identification & hypothesis testing)",
            "I (Improve: Solution implementation & DOE)",
            "C (Control: Standard operating procedures & SPC control charts)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d8-b1-cpk-process-capability-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "DMAIC Project Execution",
            "codeSnippet": "// 1. DEFINE:   Project Charter: 'Reduce billing dispute rate from 8% to 1%'\n// 2. MEASURE:  Gauge R&R validated + Baseline DPMO established\n// 3. ANALYZE:  Pareto chart reveals 85% of disputes stem from manual currency entry\n// 4. IMPROVE:  Deploy automated real-time exchange rate API integration\n// 5. CONTROL:  X-bar R control charts monitor daily dispute rate with automated alerts",
            "lineNotes": {
              "1": "Project scope.",
              "2": "Data integrity.",
              "3": "Root cause analysis.",
              "4": "Countermeasure implementation.",
              "5": "Sustained control."
            }
          },
          {
            "type": "runnable_code",
            "filename": "dmaic_demo.js",
            "initialCode": "function getDmaicPhases() {\n  return ['DEFINE', 'MEASURE', 'ANALYZE', 'IMPROVE', 'CONTROL'];\n}\n\nconsole.log(JSON.stringify(getDmaicPhases()));",
            "expectedOutput": "[\"DEFINE\",\"MEASURE\",\"ANALYZE\",\"IMPROVE\",\"CONTROL\"]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the final sustaining phase in the Six Sigma DMAIC methodology where control charts and SOPs lock in quality gains?",
          "expectedStringOutput": "CONTROL",
          "acceptableAnswers": [
            "CONTROL",
            "Control",
            "Control phase"
          ],
          "primaryMisconceptionId": "MC_OPS_SIX_SIGMA_DMAIC_SPC_CPK",
          "diagnosisMap": {
            "IMPROVE": {
              "misconceptionId": "MC_OPS_SIX_SIGMA_DMAIC_SPC_CPK",
              "errorExplanation": "Improve is phase 4. The final sustaining phase is CONTROL.",
              "recoveryPath": {
                "simplerExplanation": "Matches CONTROL.",
                "guidedFixPrompt": "Type CONTROL"
              }
            }
          }
        }
      },
      {
        "id": "ops-d8-b3-capa-five-whys-root-cause",
        "day": 8,
        "blockNumber": 3,
        "title": "Corrective Action (CAPA): 5-Whys & Ishikawa Fishbone Root Cause Analysis",
        "conceptBudget": {
          "primaryConcept": "CAPA 5-Whys Invariant",
          "supportingTerms": [
            "Corrective and Preventive Action (CAPA)",
            "5-Whys Analysis (Drilling down past symptoms to root systemic cause)",
            "Ishikawa Fishbone (Man, Machine, Material, Method, Measurement, Milieu)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d8-b2-dmaic-five-phases",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "capa_demo.js",
            "initialCode": "function evaluateCapaClosure(isSystemicRootCauseAddressed) {\n  return isSystemicRootCauseAddressed\n    ? 'CAPA_AUDIT_VERIFIED_ROOT_CAUSE_PREVENTED'\n    : 'SURFACE_SYMPTOM_FIX_RECURRENCE_RISK';\n}\n\nconsole.log(evaluateCapaClosure(true));",
            "expectedOutput": "CAPA_AUDIT_VERIFIED_ROOT_CAUSE_PREVENTED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit status certifies a Corrective and Preventive Action (CAPA) investigation that has addressed the fundamental systemic root cause to prevent defect recurrence?",
          "expectedStringOutput": "CAPA_AUDIT_VERIFIED_ROOT_CAUSE_PREVENTED",
          "acceptableAnswers": [
            "CAPA_AUDIT_VERIFIED_ROOT_CAUSE_PREVENTED",
            "CAPA verified",
            "Root cause prevented"
          ],
          "primaryMisconceptionId": "MC_OPS_SIX_SIGMA_DMAIC_SPC_CPK",
          "diagnosisMap": {
            "SURFACE": {
              "misconceptionId": "MC_OPS_SIX_SIGMA_DMAIC_SPC_CPK",
              "errorExplanation": "Treating symptoms risks recurrence. Addressing root causes earns CAPA_AUDIT_VERIFIED_ROOT_CAUSE_PREVENTED.",
              "recoveryPath": {
                "simplerExplanation": "Matches CAPA_AUDIT_VERIFIED_ROOT_CAUSE_PREVENTED.",
                "guidedFixPrompt": "Type CAPA_AUDIT_VERIFIED_ROOT_CAUSE_PREVENTED"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 9,
    "title": "Strategic Procurement: Kraljic Matrix & On-Time In-Full (OTIF >= 95.0%)",
    "overviewMetaphor": "Strategic Procurement is Managing an Investment Portfolio of Suppliers: Not all purchases are created equal; using Peter Kraljic's Matrix, you categorize spend into Strategic (Custom microchips: High Risk, High Profit Impact), Leverage (Standard steel: Low Risk, High Spend - Aggressive price auctions), Bottleneck (Proprietary valves: High Risk, Low Spend - Secure supply contracts), and Non-Critical (Office supplies: Low Risk, Low Spend - Automated catalogs); measuring Tier-1 suppliers against the 95.0% On-Time In-Full ($OTIF = \\frac{480}{500} \\times 100\\% = 96.0\\%$) benchmark guarantees factory assembly lines never suffer stockouts.",
    "blocks": [
      {
        "id": "ops-d9-b1-otif-supplier-scorecard-calculation",
        "day": 9,
        "blockNumber": 1,
        "title": "On-Time In-Full (OTIF) Supplier Delivery: $\\text{OTIF}\\% = \\frac{\\text{Perfect Orders Delivered}}{\\text{Total Purchase Orders}} \\times 100\\% \\ge 95.0\\%$",
        "conceptBudget": {
          "primaryConcept": "OTIF Delivery Accuracy Formula",
          "supportingTerms": [
            "Total Purchase Orders ($500$ orders)",
            "Perfect Orders Delivered on-time and complete ($480$ orders)",
            "OTIF = $\\frac{480}{500} \\times 100\\% = 96.0\\%$",
            "Tier-1 Strategic Supplier Benchmark: $\\ge 95.0\\% \\implies$ Approved; $< 90.0\\% \\implies$ Vendor SLA Breach"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d8-b1-cpk-process-capability-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Strategic Procurement OTIF Scorecard Ledger (480 / 500 Orders)",
              "boxes": [
                {
                  "label": "Total PO Shipments",
                  "value": "500 Total Inbound Raw Material Component Deliveries",
                  "varType": "Total POs",
                  "isUpdated": false
                },
                {
                  "label": "Perfect Shipments",
                  "value": "480 Delivered On Scheduled Date With Zero Missing Units",
                  "varType": "Perfect POs",
                  "isUpdated": false
                },
                {
                  "label": "Supplier Rating",
                  "value": "480 / 500 = 96.0% OTIF (TIER 1 STRATEGIC SUPPLIER APPROVED >= 95.0%!)",
                  "varType": "OTIF Rating",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "otif_calc_demo.js",
            "initialCode": "function calculateOtif(total, perfect) {\n  const pct = (perfect / total) * 100;\n  const isTier1 = pct >= 95.0;\n  return {\n    total,\n    perfect,\n    otifPercent: Number(pct.toFixed(1)),\n    isTier1,\n    status: isTier1 ? 'TIER_1_STRATEGIC_SUPPLIER_APPROVED' : 'SUPPLIER_SLA_BREACH'\n  };\n}\n\nconsole.log(JSON.stringify(calculateOtif(500, 480)));\nconsole.log(JSON.stringify(calculateOtif(500, 420)));",
            "expectedOutput": "{\"total\":500,\"perfect\":480,\"otifPercent\":96,\"isTier1\":true,\"status\":\"TIER_1_STRATEGIC_SUPPLIER_APPROVED\"}\n{\"total\":500,\"perfect\":420,\"otifPercent\":84,\"isTier1\":false,\"status\":\"SUPPLIER_SLA_BREACH\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the On-Time In-Full (OTIF) percentage when a strategic vendor delivers 480 perfect shipments out of 500 total orders ($ (480 / 500) \\times 100 $)?",
          "expectedStringOutput": "96",
          "acceptableAnswers": [
            "96",
            "96%",
            "96.0",
            "otifPercent\":96"
          ],
          "primaryMisconceptionId": "MC_OPS_PROCUREMENT_KRALJIC_MATRIX_OTIF",
          "diagnosisMap": {
            "4": {
              "misconceptionId": "MC_OPS_PROCUREMENT_KRALJIC_MATRIX_OTIF",
              "errorExplanation": "4% is the defect failure rate (20/500). OTIF delivery performance is 96.0%.",
              "recoveryPath": {
                "simplerExplanation": "480 / 500 * 100 = 96%.",
                "guidedFixPrompt": "Type 96"
              }
            }
          }
        }
      },
      {
        "id": "ops-d9-b2-kraljic-portfolio-matrix-quadrants",
        "day": 9,
        "blockNumber": 2,
        "title": "The 4 Quadrants of the Kraljic Portfolio Matrix",
        "conceptBudget": {
          "primaryConcept": "Kraljic Matrix Architecture",
          "supportingTerms": [
            "Strategic Items (High Supply Risk, High Profit Impact: Long-term partnership)",
            "Leverage Items (Low Supply Risk, High Profit Impact: Competitive price auctions)",
            "Bottleneck Items (High Supply Risk, Low Profit Impact: Dual-sourcing & buffer stock)",
            "Non-Critical Items (Low Supply Risk, Low Profit Impact: E-procurement catalogs)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d9-b1-otif-supplier-scorecard-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Kraljic Sourcing Strategies",
            "codeSnippet": "// STRATEGIC (Custom EV Battery Pack): Form 10-year joint venture & co-develop technology\n// LEVERAGE (Corrugated Packaging):    Run reverse auction across 5 commodity suppliers\n// BOTTLENECK (Proprietary O-Ring):    Maintain 6-month safety stock & qualify backup supplier\n// NON-CRITICAL (Office Pens):         Automate reorders via punchout catalog",
            "lineNotes": {
              "1": "Strategic partnership.",
              "2": "Market leverage.",
              "3": "Risk mitigation.",
              "4": "Process automation."
            }
          },
          {
            "type": "runnable_code",
            "filename": "kraljic_demo.js",
            "initialCode": "function getKraljicQuadrantStrategy(risk, impact) {\n  if (risk === 'HIGH' && impact === 'HIGH') return 'STRATEGIC_PARTNERSHIP_AND_COLLABORATION';\n  if (risk === 'LOW' && impact === 'HIGH') return 'LEVERAGE_COMPETITIVE_REVERSE_AUCTIONS';\n  if (risk === 'HIGH' && impact === 'LOW') return 'BOTTLENECK_BUFFER_STOCK_AND_DUAL_SOURCE';\n  return 'NON_CRITICAL_AUTOMATED_CATALOG_REORDER';\n}\n\nconsole.log(getKraljicQuadrantStrategy('HIGH', 'HIGH'));\nconsole.log(getKraljicQuadrantStrategy('LOW', 'HIGH'));",
            "expectedOutput": "STRATEGIC_PARTNERSHIP_AND_COLLABORATION\nLEVERAGE_COMPETITIVE_REVERSE_AUCTIONS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which procurement sourcing strategy is recommended by the Kraljic Matrix for components characterized by High Supply Risk and High Financial Profit Impact?",
          "expectedStringOutput": "STRATEGIC_PARTNERSHIP_AND_COLLABORATION",
          "acceptableAnswers": [
            "STRATEGIC_PARTNERSHIP_AND_COLLABORATION",
            "Strategic Partnership",
            "Strategic Collaboration"
          ],
          "primaryMisconceptionId": "MC_OPS_PROCUREMENT_KRALJIC_MATRIX_OTIF",
          "diagnosisMap": {
            "AUCTION": {
              "misconceptionId": "MC_OPS_PROCUREMENT_KRALJIC_MATRIX_OTIF",
              "errorExplanation": "Auctions are for low-risk Leverage items. High-risk high-impact items require STRATEGIC_PARTNERSHIP_AND_COLLABORATION.",
              "recoveryPath": {
                "simplerExplanation": "Matches STRATEGIC_PARTNERSHIP_AND_COLLABORATION.",
                "guidedFixPrompt": "Type STRATEGIC_PARTNERSHIP_AND_COLLABORATION"
              }
            }
          }
        }
      },
      {
        "id": "ops-d9-b3-rfp-rfq-strategic-tendering",
        "day": 9,
        "blockNumber": 3,
        "title": "Competitive Sourcing Tenders: RFI vs RFP vs RFQ",
        "conceptBudget": {
          "primaryConcept": "Procurement Tendering Hierarchy",
          "supportingTerms": [
            "RFI (Request for Information: Market landscape scouting)",
            "RFP (Request for Proposal: Technical and architectural solution evaluation)",
            "RFQ (Request for Quotation: Final commercial line-item price bidding)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d9-b2-kraljic-portfolio-matrix-quadrants",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "tendering_demo.js",
            "initialCode": "function getTenderType(purpose) {\n  return purpose === 'PRICING'\n    ? 'REQUEST_FOR_QUOTATION_RFQ_BINDING_PRICE_BID'\n    : 'REQUEST_FOR_PROPOSAL_RFP_SOLUTION_DESIGN';\n}\n\nconsole.log(getTenderType('PRICING'));",
            "expectedOutput": "REQUEST_FOR_QUOTATION_RFQ_BINDING_PRICE_BID",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which procurement tender document is issued when technical specifications are finalized and binding commercial pricing bids are solicited?",
          "expectedStringOutput": "REQUEST_FOR_QUOTATION_RFQ_BINDING_PRICE_BID",
          "acceptableAnswers": [
            "REQUEST_FOR_QUOTATION_RFQ_BINDING_PRICE_BID",
            "RFQ",
            "Request for Quotation"
          ],
          "primaryMisconceptionId": "MC_OPS_PROCUREMENT_KRALJIC_MATRIX_OTIF",
          "diagnosisMap": {
            "RFI": {
              "misconceptionId": "MC_OPS_PROCUREMENT_KRALJIC_MATRIX_OTIF",
              "errorExplanation": "RFI is exploratory. Binding commercial pricing requires a REQUEST_FOR_QUOTATION_RFQ_BINDING_PRICE_BID.",
              "recoveryPath": {
                "simplerExplanation": "Matches REQUEST_FOR_QUOTATION_RFQ_BINDING_PRICE_BID.",
                "guidedFixPrompt": "Type REQUEST_FOR_QUOTATION_RFQ_BINDING_PRICE_BID"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 10,
    "title": "Contract Manufacturing & 3PL Logistics Governance (SLA Fulfillment)",
    "overviewMetaphor": "3PL Governance is an Airline Operations Control Center Managing Outsourced Flights: When outsourcing warehousing and distribution to a Third-Party Logistics (3PL) provider, verbal promises are worthless; enforcing SLA metrics requiring Order Fulfillment Accuracy $\\ge 99.8\\%$ and Same-Day Shipping $\\ge 98.0\\%$ protects your customer experience; pairing this with a Dual-Sourcing strategy ensures that if one supplier plant goes down, the backup factory ramps up immediately.",
    "blocks": [
      {
        "id": "ops-d10-b1-3pl-sla-fulfillment-accuracy-audit",
        "day": 10,
        "blockNumber": 1,
        "title": "3PL Logistics Service Level Agreement (SLA): Order Accuracy ($\\ge 99.8\\%$) & Same-Day ($\\ge 98.0\\%$)",
        "conceptBudget": {
          "primaryConcept": "3PL SLA Governance Standard",
          "supportingTerms": [
            "Order Accuracy ($99.9\\% \\ge 99.8\\%$ standard)",
            "Same-Day Shipment Rate ($99.0\\% \\ge 98.0\\%$ standard)",
            "SLA Compliance: 3PL Logistics SLA Compliant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d9-b1-otif-supplier-scorecard-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "3PL Warehouse Logistics SLA Ledger (99.9% Accuracy, 99.0% Same-Day)",
              "boxes": [
                {
                  "label": "Order Pick/Pack Accuracy",
                  "value": "99.9% Correct SKUs Shipped (Exceeds 99.8% Minimum SLA Ceiling)",
                  "varType": "Accuracy",
                  "isUpdated": false
                },
                {
                  "label": "Same-Day Cutoff Shipments",
                  "value": "99.0% Orders Shipped Same-Day (Exceeds 98.0% Minimum SLA Ceiling)",
                  "varType": "Speed",
                  "isUpdated": false
                },
                {
                  "label": "3PL Governance Status",
                  "value": "3PL LOGISTICS SLA COMPLIANT (ZERO PENALTY DEDUCTIONS NOMINAL!)",
                  "varType": "SLA Status",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "three_pl_sla_calc_demo.js",
            "initialCode": "function audit3pl(accuracy, sameDay) {\n  const isCompliant = accuracy >= 99.8 && sameDay >= 98.0;\n  return {\n    accuracy,\n    sameDay,\n    isCompliant,\n    status: isCompliant ? '3PL_LOGISTICS_SLA_COMPLIANT' : 'SLA_PENALTY'\n  };\n}\n\nconsole.log(JSON.stringify(audit3pl(99.9, 99.0)));\nconsole.log(JSON.stringify(audit3pl(99.2, 95.0)));",
            "expectedOutput": "{\"accuracy\":99.9,\"sameDay\":99,\"isCompliant\":true,\"status\":\"3PL_LOGISTICS_SLA_COMPLIANT\"}\n{\"accuracy\":99.2,\"sameDay\":95,\"isCompliant\":false,\"status\":\"SLA_PENALTY\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What compliance status is confirmed when a 3PL logistics provider delivers 99.9% order pick accuracy and 99.0% same-day shipment fulfillment?",
          "expectedStringOutput": "3PL_LOGISTICS_SLA_COMPLIANT",
          "acceptableAnswers": [
            "3PL_LOGISTICS_SLA_COMPLIANT",
            "3PL Compliant",
            "SLA Compliant"
          ],
          "primaryMisconceptionId": "MC_OPS_CONTRACT_MANUFACTURING_3PL_SLAS",
          "diagnosisMap": {
            "PENALTY": {
              "misconceptionId": "MC_OPS_CONTRACT_MANUFACTURING_3PL_SLAS",
              "errorExplanation": "Both metrics exceed the benchmarks (>=99.8% and >=98.0%), awarding 3PL_LOGISTICS_SLA_COMPLIANT.",
              "recoveryPath": {
                "simplerExplanation": "Matches 3PL_LOGISTICS_SLA_COMPLIANT.",
                "guidedFixPrompt": "Type 3PL_LOGISTICS_SLA_COMPLIANT"
              }
            }
          }
        }
      },
      {
        "id": "ops-d10-b2-dual-sourcing-risk-split",
        "day": 10,
        "blockNumber": 2,
        "title": "Dual-Sourcing Strategy: The 70/30 Volume Allocation Allocation Rule",
        "conceptBudget": {
          "primaryConcept": "Dual Sourcing 70/30 Rule",
          "supportingTerms": [
            "Primary Supplier (70% Volume: Maximum scale discount)",
            "Secondary Supplier (30% Volume: Active warm line ready to scale to 100% in case of primary disruption)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d10-b1-3pl-sla-fulfillment-accuracy-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Dual-Sourcing Architecture",
            "codeSnippet": "// ❌ SINGLE SOURCING: 100% Volume to Plant A -> Plant A floods -> Factory halts for 6 months!\n// ✅ DUAL SOURCING:   70% to Plant A + 30% to Plant B -> Immediate production failover capacity",
            "lineNotes": {
              "1": "High disruption vulnerability.",
              "2": "De-risked resilient supply chain."
            }
          },
          {
            "type": "runnable_code",
            "filename": "dual_source_demo.js",
            "initialCode": "function getDualSourcingSplit() {\n  return 'SEVENTY_PERCENT_PRIMARY_AND_THIRTY_PERCENT_SECONDARY';\n}\n\nconsole.log(getDualSourcingSplit());",
            "expectedOutput": "SEVENTY_PERCENT_PRIMARY_AND_THIRTY_PERCENT_SECONDARY",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What volume split ratio is standard practice in enterprise dual-sourcing to balance scale economics with active supplier warm-line redundancy?",
          "expectedStringOutput": "SEVENTY_PERCENT_PRIMARY_AND_THIRTY_PERCENT_SECONDARY",
          "acceptableAnswers": [
            "SEVENTY_PERCENT_PRIMARY_AND_THIRTY_PERCENT_SECONDARY",
            "70/30",
            "70/30 split"
          ],
          "primaryMisconceptionId": "MC_OPS_CONTRACT_MANUFACTURING_3PL_SLAS",
          "diagnosisMap": {
            "100/0": {
              "misconceptionId": "MC_OPS_CONTRACT_MANUFACTURING_3PL_SLAS",
              "errorExplanation": "100/0 is single sourcing. Standard dual sourcing uses SEVENTY_PERCENT_PRIMARY_AND_THIRTY_PERCENT_SECONDARY.",
              "recoveryPath": {
                "simplerExplanation": "Matches SEVENTY_PERCENT_PRIMARY_AND_THIRTY_PERCENT_SECONDARY.",
                "guidedFixPrompt": "Type SEVENTY_PERCENT_PRIMARY_AND_THIRTY_PERCENT_SECONDARY"
              }
            }
          }
        }
      },
      {
        "id": "ops-d10-b3-master-supply-agreement-key-clauses",
        "day": 10,
        "blockNumber": 3,
        "title": "Master Supply Agreements (MSA): Warranties, Yield & Liability Caps",
        "conceptBudget": {
          "primaryConcept": "MSA Manufacturing Clauses",
          "supportingTerms": [
            "Yield Guarantees ($> 98.5\\%$ first-pass yield)",
            "Defective Parts Remittance",
            "Force Majeure definitions",
            "Limitation of Liability Caps"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d10-b2-dual-sourcing-risk-split",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "msa_terms_demo.js",
            "initialCode": "function getMsaYieldStandard() {\n  return 'NINETY_EIGHT_POINT_FIVE_PERCENT_MINIMUM_FIRST_PASS_YIELD';\n}\n\nconsole.log(getMsaYieldStandard());",
            "expectedOutput": "NINETY_EIGHT_POINT_FIVE_PERCENT_MINIMUM_FIRST_PASS_YIELD",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What minimum first-pass manufacturing yield guarantee is typically stipulated in high-precision contract manufacturing MSAs?",
          "expectedStringOutput": "NINETY_EIGHT_POINT_FIVE_PERCENT_MINIMUM_FIRST_PASS_YIELD",
          "acceptableAnswers": [
            "NINETY_EIGHT_POINT_FIVE_PERCENT_MINIMUM_FIRST_PASS_YIELD",
            "98.5%",
            "98.5 percent yield"
          ],
          "primaryMisconceptionId": "MC_OPS_CONTRACT_MANUFACTURING_3PL_SLAS",
          "diagnosisMap": {
            "50%": {
              "misconceptionId": "MC_OPS_CONTRACT_MANUFACTURING_3PL_SLAS",
              "errorExplanation": "50% indicates massive scrap. Standard contractual yield is NINETY_EIGHT_POINT_FIVE_PERCENT_MINIMUM_FIRST_PASS_YIELD.",
              "recoveryPath": {
                "simplerExplanation": "Matches NINETY_EIGHT_POINT_FIVE_PERCENT_MINIMUM_FIRST_PASS_YIELD.",
                "guidedFixPrompt": "Type NINETY_EIGHT_POINT_FIVE_PERCENT_MINIMUM_FIRST_PASS_YIELD"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 11,
    "title": "Warehouse Management Systems (WMS): Cycle Counting Accuracy (>= 99.5%)",
    "overviewMetaphor": "A Modern WMS is an Automated Air Traffic Tower for Physical Pallets: Instead of shutting down the warehouse for an agonizing annual physical inventory count, a modern WMS uses continuous Cycle Counting; auditing 1,000 SKUs and finding 998 perfectly accurate matches produces an Inventory Record Accuracy (IRA) of 99.8% ($IRA = \\frac{998}{1,000} \\times 100\\% = 99.8\\%$); clearing the 99.5% accuracy benchmark guarantees pickers never waste time searching for missing inventory.",
    "blocks": [
      {
        "id": "ops-d11-b1-cycle-counting-ira-calculation",
        "day": 11,
        "blockNumber": 1,
        "title": "Inventory Record Accuracy (IRA) Equation: $\\text{IRA}\\% = \\frac{\\text{Accurate Audited SKUs}}{\\text{Total Audited SKUs}} \\times 100\\% \\ge 99.5\\%$",
        "conceptBudget": {
          "primaryConcept": "Inventory Record Accuracy Formula",
          "supportingTerms": [
            "Accurate Counted SKUs ($998$)",
            "Total Audited SKUs ($1,000$)",
            "IRA = $\\frac{998}{1,000} \\times 100\\% = 99.8\\%$",
            "WMS Accuracy Benchmark: $\\ge 99.5\\% \\implies$ WMS Certified; $< 98.0\\% \\implies$ Inventory Discrepancy"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d10-b1-3pl-sla-fulfillment-accuracy-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "WMS Cycle Counting Inventory Accuracy Ledger (998 / 1,000 SKUs)",
              "boxes": [
                {
                  "label": "Total Audited SKUs",
                  "value": "1,000 Random High-Velocity A-Category Warehouse SKUs",
                  "varType": "Audited",
                  "isUpdated": false
                },
                {
                  "label": "Matched Physical Count",
                  "value": "998 Locations Matched WMS Digital System Balance Exactly",
                  "varType": "Matched",
                  "isUpdated": false
                },
                {
                  "label": "Inventory Accuracy (IRA)",
                  "value": "998 / 1,000 = 99.80% (WMS INVENTORY RECORD ACCURACY CERTIFIED >= 99.5%!)",
                  "varType": "IRA",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "ira_calc_demo.js",
            "initialCode": "function calculateIra(accurate, total) {\n  const ira = (accurate / total) * 100;\n  const isCertified = ira >= 99.5;\n  return {\n    accurate,\n    total,\n    iraPercent: Number(ira.toFixed(2)),\n    isCertified,\n    status: isCertified ? 'WMS_INVENTORY_RECORD_ACCURACY_CERTIFIED' : 'DISCREPANCY'\n  };\n}\n\nconsole.log(JSON.stringify(calculateIra(998, 1000)));\nconsole.log(JSON.stringify(calculateIra(980, 1000)));",
            "expectedOutput": "{\"accurate\":998,\"total\":1000,\"iraPercent\":99.8,\"isCertified\":true,\"status\":\"WMS_INVENTORY_RECORD_ACCURACY_CERTIFIED\"}\n{\"accurate\":980,\"total\":1000,\"iraPercent\":98,\"isCertified\":false,\"status\":\"DISCREPANCY\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Inventory Record Accuracy (IRA) percentage when a warehouse cycle count audits 1,000 SKUs and verifies 998 exact matches ($ (998 / 1,000) \\times 100 $)?",
          "expectedStringOutput": "99.8",
          "acceptableAnswers": [
            "99.8",
            "99.8%",
            "iraPercent\":99.8"
          ],
          "primaryMisconceptionId": "MC_OPS_WMS_WAREHOUSE_SLOTTING_CYCLE_COUNT",
          "diagnosisMap": {
            "0.2": {
              "misconceptionId": "MC_OPS_WMS_WAREHOUSE_SLOTTING_CYCLE_COUNT",
              "errorExplanation": "0.2% is the discrepancy error rate (2/1000). The Inventory Record Accuracy is 99.8%.",
              "recoveryPath": {
                "simplerExplanation": "998 / 1,000 * 100 = 99.8%.",
                "guidedFixPrompt": "Type 99.8"
              }
            }
          }
        }
      },
      {
        "id": "ops-d11-b2-warehouse-slotting-optimization",
        "day": 11,
        "blockNumber": 2,
        "title": "Dynamic Warehouse Slotting: Fast-Moving Velocity & Pick Path Optimization",
        "conceptBudget": {
          "primaryConcept": "Warehouse Slotting Mechanics",
          "supportingTerms": [
            "Slotting Strategy (Placing High-Velocity A-Items on lower rack levels near packing stations to cut travel time by 60%)",
            "Wave Picking vs Batch Picking vs Zone Picking"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d11-b1-cycle-counting-ira-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Warehouse Slotting Logic",
            "codeSnippet": "// FAST-MOVING (A-Items): Ground level racks within 20 meters of shipping dock\n// MEDIUM-MOVING (B-Items): Middle tier racks (Level 2-3)\n// SLOW-MOVING (C-Items): Top tier racks (Level 4-5) or deep back aisles",
            "lineNotes": {
              "1": "High accessibility.",
              "2": "Standard picking.",
              "3": "High density storage."
            }
          },
          {
            "type": "runnable_code",
            "filename": "slotting_demo.js",
            "initialCode": "function assignWarehouseLocation(itemVelocityTier) {\n  return itemVelocityTier === 'FAST_MOVING_A'\n    ? 'GROUND_RACK_CLOSEST_TO_PACKING_STATION'\n    : 'UPPER_TIER_STORAGE_RACK';\n}\n\nconsole.log(assignWarehouseLocation('FAST_MOVING_A'));",
            "expectedOutput": "GROUND_RACK_CLOSEST_TO_PACKING_STATION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Where should fast-moving Class-A inventory items be slotted within a warehouse layout to minimize picker transit travel time?",
          "expectedStringOutput": "GROUND_RACK_CLOSEST_TO_PACKING_STATION",
          "acceptableAnswers": [
            "GROUND_RACK_CLOSEST_TO_PACKING_STATION",
            "Ground rack near packing",
            "Near shipping dock"
          ],
          "primaryMisconceptionId": "MC_OPS_WMS_WAREHOUSE_SLOTTING_CYCLE_COUNT",
          "diagnosisMap": {
            "TOP_RACK": {
              "misconceptionId": "MC_OPS_WMS_WAREHOUSE_SLOTTING_CYCLE_COUNT",
              "errorExplanation": "Top racks require forklifts. Fast moving items belong on the GROUND_RACK_CLOSEST_TO_PACKING_STATION.",
              "recoveryPath": {
                "simplerExplanation": "Matches GROUND_RACK_CLOSEST_TO_PACKING_STATION.",
                "guidedFixPrompt": "Type GROUND_RACK_CLOSEST_TO_PACKING_STATION"
              }
            }
          }
        }
      },
      {
        "id": "ops-d11-b3-cross-docking-zero-inventory",
        "day": 11,
        "blockNumber": 3,
        "title": "Cross-Docking: Unloading Inbound Trucks Directly to Outbound Trucks",
        "conceptBudget": {
          "primaryConcept": "Cross-Docking Invariant",
          "supportingTerms": [
            "Cross-Docking (Direct transfer from inbound supplier trailer to outbound delivery van in $< 24$ hours with zero storage racking)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d11-b2-warehouse-slotting-optimization",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "cross_dock_demo.js",
            "initialCode": "function evaluateCrossDock(transitTimeHours) {\n  return transitTimeHours <= 24\n    ? 'CROSS_DOCKING_ZERO_WAREHOUSE_STORAGE_ACHIEVED'\n    : 'STANDARD_STORAGE_PUTAWAY';\n}\n\nconsole.log(evaluateCrossDock(6));",
            "expectedOutput": "CROSS_DOCKING_ZERO_WAREHOUSE_STORAGE_ACHIEVED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What distribution milestone is accomplished when inbound freight is sorted and transferred to outbound delivery trucks within 6 hours without entering storage racking?",
          "expectedStringOutput": "CROSS_DOCKING_ZERO_WAREHOUSE_STORAGE_ACHIEVED",
          "acceptableAnswers": [
            "CROSS_DOCKING_ZERO_WAREHOUSE_STORAGE_ACHIEVED",
            "Cross Docking",
            "Cross-docking achieved"
          ],
          "primaryMisconceptionId": "MC_OPS_WMS_WAREHOUSE_SLOTTING_CYCLE_COUNT",
          "diagnosisMap": {
            "STORAGE": {
              "misconceptionId": "MC_OPS_WMS_WAREHOUSE_SLOTTING_CYCLE_COUNT",
              "errorExplanation": "Transfer without putaway is CROSS_DOCKING_ZERO_WAREHOUSE_STORAGE_ACHIEVED.",
              "recoveryPath": {
                "simplerExplanation": "Matches CROSS_DOCKING_ZERO_WAREHOUSE_STORAGE_ACHIEVED.",
                "guidedFixPrompt": "Type CROSS_DOCKING_ZERO_WAREHOUSE_STORAGE_ACHIEVED"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 12,
    "title": "Cold Chain & Perishable Supply Chains: HACCP & FEFO Inventory Rotation",
    "overviewMetaphor": "Cold Chain Logistics is an Unbroken Line of Refrigerated Protection: In biopharma and dairy logistics, a single 15-minute temperature excursion outside the mandatory $+2^{\\circ}\\text{C}$ to $+8^{\\circ}\\text{C}$ range spoils the entire million-dollar cargo; implementing real-time IoT temperature logging combined with First Expired, First Out (FEFO) inventory rotation ensures perishable products reach consumers with zero safety breaches.",
    "blocks": [
      {
        "id": "ops-d12-b1-cold-chain-temperature-fefo-audit",
        "day": 12,
        "blockNumber": 1,
        "title": "Cold Chain Compliance: Strict $2.0^{\\circ}\\text{C} - 8.0^{\\circ}\\text{C}$ Range & FEFO Rotation Standard",
        "conceptBudget": {
          "primaryConcept": "Cold Chain Compliance Standard",
          "supportingTerms": [
            "Minimum Temperature Recorded ($3.5^{\\circ}\\text{C} \\ge 2.0^{\\circ}\\text{C}$)",
            "Maximum Temperature Recorded ($6.2^{\\circ}\\text{C} \\le 8.0^{\\circ}\\text{C}$)",
            "FEFO Inventory Rotation Active (First Expired, First Out)",
            "Compliance: Cold Chain Temperature Compliant & FEFO Active"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d11-b1-cycle-counting-ira-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Biopharma Cold Chain Telemetry Ledger (Min 3.5C, Max 6.2C)",
              "boxes": [
                {
                  "label": "IoT Min Temp Logged",
                  "value": "3.5°C >= 2.0°C Minimum Safe Cold Chain Threshold",
                  "varType": "Min Temp",
                  "isUpdated": false
                },
                {
                  "label": "IoT Max Temp Logged",
                  "value": "6.2°C <= 8.0°C Maximum Safe Cold Chain Threshold",
                  "varType": "Max Temp",
                  "isUpdated": false
                },
                {
                  "label": "FEFO Rotation System",
                  "value": "Active FIFO/FEFO Batch Sorting by Expiry Date",
                  "varType": "FEFO",
                  "isUpdated": false
                },
                {
                  "label": "Cold Chain Integrity",
                  "value": "COLD CHAIN TEMPERATURE COMPLIANT FEFO ACTIVE NOMINAL!",
                  "varType": "Status",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "cold_chain_calc_demo.js",
            "initialCode": "function auditColdChain(minT, maxT, fefo) {\n  const isTempSafe = minT >= 2.0 && maxT <= 8.0;\n  const isCompliant = isTempSafe && fefo;\n  return {\n    minT,\n    maxT,\n    fefo,\n    isCompliant,\n    status: isCompliant ? 'COLD_CHAIN_TEMPERATURE_COMPLIANT_FEFO_ACTIVE' : 'EXCURSION_QUARANTINE'\n  };\n}\n\nconsole.log(JSON.stringify(auditColdChain(3.5, 6.2, true)));\nconsole.log(JSON.stringify(auditColdChain(1.5, 11.0, true)));",
            "expectedOutput": "{\"minT\":3.5,\"maxT\":6.2,\"fefo\":true,\"isCompliant\":true,\"status\":\"COLD_CHAIN_TEMPERATURE_COMPLIANT_FEFO_ACTIVE\"}\n{\"minT\":1.5,\"maxT\":11,\"fefo\":true,\"isCompliant\":false,\"status\":\"EXCURSION_QUARANTINE\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What compliance status evaluates a biopharmaceutical shipment maintaining temperatures between 3.5°C and 6.2°C with active FEFO rotation?",
          "expectedStringOutput": "COLD_CHAIN_TEMPERATURE_COMPLIANT_FEFO_ACTIVE",
          "acceptableAnswers": [
            "COLD_CHAIN_TEMPERATURE_COMPLIANT_FEFO_ACTIVE",
            "Cold Chain Compliant",
            "Compliant FEFO Active"
          ],
          "primaryMisconceptionId": "MC_OPS_COLD_CHAIN_HACCP_FEFO_ROTATION",
          "diagnosisMap": {
            "QUARANTINE": {
              "misconceptionId": "MC_OPS_COLD_CHAIN_HACCP_FEFO_ROTATION",
              "errorExplanation": "Temperatures are safely between 2C and 8C, confirming COLD_CHAIN_TEMPERATURE_COMPLIANT_FEFO_ACTIVE.",
              "recoveryPath": {
                "simplerExplanation": "Matches COLD_CHAIN_TEMPERATURE_COMPLIANT_FEFO_ACTIVE.",
                "guidedFixPrompt": "Type COLD_CHAIN_TEMPERATURE_COMPLIANT_FEFO_ACTIVE"
              }
            }
          }
        }
      },
      {
        "id": "ops-d12-b2-fefo-vs-fifo-perishables",
        "day": 12,
        "blockNumber": 2,
        "title": "First Expired, First Out (FEFO) vs First In, First Out (FIFO)",
        "conceptBudget": {
          "primaryConcept": "FEFO Rotation Invariant",
          "supportingTerms": [
            "FEFO (First Expired, First Out: Products with the earliest expiration date are shipped first, regardless of when they arrived at the warehouse)",
            "Eliminates expired inventory spoilage losses"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d12-b1-cold-chain-temperature-fefo-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Inventory Rotation Priority",
            "codeSnippet": "// BATCH 1: Arrived Jan 10 (Expiry: Dec 2026)\n// BATCH 2: Arrived Jan 15 (Expiry: August 2026 - SHIPPED FIRST UNDER FEFO!)\n// FIFO would mistakenly ship Batch 1 first, risking Batch 2 expiring on shelf!",
            "lineNotes": {
              "1": "Older arrival, longer shelf life.",
              "2": "Newer arrival, shorter shelf life (FEFO priority).",
              "3": "FIFO flaw with variable shelf life."
            }
          },
          {
            "type": "runnable_code",
            "filename": "fefo_demo.js",
            "initialCode": "function selectInventoryRotationRule(isPerishableWithVariableExpiry) {\n  return isPerishableWithVariableExpiry\n    ? 'FIRST_EXPIRED_FIRST_OUT_FEFO'\n    : 'FIRST_IN_FIRST_OUT_FIFO';\n}\n\nconsole.log(selectInventoryRotationRule(true));",
            "expectedOutput": "FIRST_EXPIRED_FIRST_OUT_FEFO",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which inventory dispatching logic prioritizes shipping batches with the earliest expiration dates to prevent expired product spoilage?",
          "expectedStringOutput": "FIRST_EXPIRED_FIRST_OUT_FEFO",
          "acceptableAnswers": [
            "FIRST_EXPIRED_FIRST_OUT_FEFO",
            "FEFO",
            "First Expired First Out"
          ],
          "primaryMisconceptionId": "MC_OPS_COLD_CHAIN_HACCP_FEFO_ROTATION",
          "diagnosisMap": {
            "FIFO": {
              "misconceptionId": "MC_OPS_COLD_CHAIN_HACCP_FEFO_ROTATION",
              "errorExplanation": "FIFO prioritizes arrival date. Perishables require FIRST_EXPIRED_FIRST_OUT_FEFO.",
              "recoveryPath": {
                "simplerExplanation": "Matches FIRST_EXPIRED_FIRST_OUT_FEFO.",
                "guidedFixPrompt": "Type FIRST_EXPIRED_FIRST_OUT_FEFO"
              }
            }
          }
        }
      },
      {
        "id": "ops-d12-b3-haccp-critical-control-points",
        "day": 12,
        "blockNumber": 3,
        "title": "Hazard Analysis Critical Control Points (HACCP) 7 Principles",
        "conceptBudget": {
          "primaryConcept": "HACCP Architecture",
          "supportingTerms": [
            "Critical Control Point (CCP: Point in food/pharma manufacturing where control must be applied to prevent, eliminate, or reduce hazard to acceptable levels e.g. Pasteurization pasteurizer temperature)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d12-b2-fefo-vs-fifo-perishables",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "haccp_demo.js",
            "initialCode": "function getHaccpFullForm() {\n  return 'HAZARD_ANALYSIS_CRITICAL_CONTROL_POINTS';\n}\n\nconsole.log(getHaccpFullForm());",
            "expectedOutput": "HAZARD_ANALYSIS_CRITICAL_CONTROL_POINTS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the full form acronym definition of the international HACCP food and drug safety standard?",
          "expectedStringOutput": "HAZARD_ANALYSIS_CRITICAL_CONTROL_POINTS",
          "acceptableAnswers": [
            "HAZARD_ANALYSIS_CRITICAL_CONTROL_POINTS",
            "Hazard Analysis Critical Control Points"
          ],
          "primaryMisconceptionId": "MC_OPS_COLD_CHAIN_HACCP_FEFO_ROTATION",
          "diagnosisMap": {
            "CONTROL": {
              "misconceptionId": "MC_OPS_COLD_CHAIN_HACCP_FEFO_ROTATION",
              "errorExplanation": "HACCP stands for HAZARD_ANALYSIS_CRITICAL_CONTROL_POINTS.",
              "recoveryPath": {
                "simplerExplanation": "Matches HAZARD_ANALYSIS_CRITICAL_CONTROL_POINTS.",
                "guidedFixPrompt": "Type HAZARD_ANALYSIS_CRITICAL_CONTROL_POINTS"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 13,
    "title": "Reverse Logistics & Circular Economy: E-Waste & Extended Producer Responsibility (EPR)",
    "overviewMetaphor": "Reverse Logistics is the Boomerang of the Modern Supply Chain: When customers return defective products or dispose of obsolete electronics, a linear take-make-waste model results in heavy regulatory fines; under Extended Producer Responsibility (EPR), electronics manufacturers are legally mandated to collect and recycle e-waste; collecting 750 tons against a statutory target of 700 tons ($750 / 700 = 107.1\\% \\ge 100.0\\%$) ensures full compliance with environmental pollution boards.",
    "blocks": [
      {
        "id": "ops-d13-b1-epr-statutory-fulfillment-calculation",
        "day": 13,
        "blockNumber": 1,
        "title": "Extended Producer Responsibility (EPR) Statutory Target Fulfillment: $\\text{Fulfillment}\\% = \\frac{\\text{Recycled E-Waste Tons}}{\\text{Statutory Target Tons}} \\times 100\\% \\ge 100.0\\%$",
        "conceptBudget": {
          "primaryConcept": "EPR Statutory Fulfillment Formula",
          "supportingTerms": [
            "Recycled E-Waste Collected ($750$ metric tons)",
            "Statutory Regulatory Target ($700$ metric tons)",
            "EPR Fulfillment = $\\frac{750}{700} \\times 100\\% = 107.1\\%$",
            "Statutory Status: $\\ge 100.0\\% \\implies$ Statutory Recycling Target Achieved; $< 100.0\\% \\implies$ Deficit Penalty Risk"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d12-b1-cold-chain-temperature-fefo-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "E-Waste EPR Circular Compliance Ledger (750 Tons / 700 Tons Target)",
              "boxes": [
                {
                  "label": "Statutory EPR Mandate",
                  "value": "700.0 Metric Tons Legal E-Waste Collection Target",
                  "varType": "Target",
                  "isUpdated": false
                },
                {
                  "label": "Certified E-Waste Recycled",
                  "value": "750.0 Metric Tons Channelized through Authorized Recyclers",
                  "varType": "Recycled",
                  "isUpdated": false
                },
                {
                  "label": "EPR Compliance Rating",
                  "value": "750 / 700 = 107.1% (EPR STATUTORY RECYCLING TARGET ACHIEVED >= 100.0%!)",
                  "varType": "EPR Status",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "epr_calc_demo.js",
            "initialCode": "function auditEpr(recycled, target) {\n  const pct = (recycled / target) * 100;\n  const isCompliant = pct >= 100.0;\n  return {\n    recycled,\n    target,\n    eprFulfillmentPct: Number(pct.toFixed(1)),\n    isCompliant,\n    status: isCompliant ? 'EPR_STATUTORY_RECYCLING_TARGET_ACHIEVED' : 'DEFICIT'\n  };\n}\n\nconsole.log(JSON.stringify(auditEpr(750, 700)));\nconsole.log(JSON.stringify(auditEpr(500, 700)));",
            "expectedOutput": "{\"recycled\":750,\"target\":700,\"eprFulfillmentPct\":107.1,\"isCompliant\":true,\"status\":\"EPR_STATUTORY_RECYCLING_TARGET_ACHIEVED\"}\n{\"recycled\":500,\"target\":700,\"eprFulfillmentPct\":71.4,\"isCompliant\":false,\"status\":\"DEFICIT\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the EPR target fulfillment percentage when an electronics enterprise recycles 750 tons of certified e-waste against a statutory target of 700 tons ($ (750 / 700) \\times 100 $)?",
          "expectedStringOutput": "107.1",
          "acceptableAnswers": [
            "107.1",
            "107.1%",
            "eprFulfillmentPct\":107.1"
          ],
          "primaryMisconceptionId": "MC_OPS_REVERSE_LOGISTICS_CIRCULAR_EPR",
          "diagnosisMap": {
            "50": {
              "misconceptionId": "MC_OPS_REVERSE_LOGISTICS_CIRCULAR_EPR",
              "errorExplanation": "50 tons is excess volume. Fulfillment percentage is 750 / 700 * 100 = 107.1%.",
              "recoveryPath": {
                "simplerExplanation": "750 / 700 * 100 = 107.1%.",
                "guidedFixPrompt": "Type 107.1"
              }
            }
          }
        }
      },
      {
        "id": "ops-d13-b2-rma-reverse-logistics-triage",
        "day": 13,
        "blockNumber": 2,
        "title": "RMA Workflow & 4R Triage: Repair, Refurbish, Recycle, Resell",
        "conceptBudget": {
          "primaryConcept": "4R Reverse Logistics Triage",
          "supportingTerms": [
            "RMA (Return Merchandise Authorization)",
            "4R Triage: 1. Resell (Open-box return) $\\to$ 2. Refurbish $\\to$ 3. Harvest Parts (Repair) $\\to$ 4. Recycle (Raw scrap recovery)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d13-b1-epr-statutory-fulfillment-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Returned Goods Triage Path",
            "codeSnippet": "// Grade A (Flawless): Re-box & Resell as certified open-box (-10% discount)\n// Grade B (Minor Flaw): Replace cosmetic casing & Refurbish with 1-year warranty\n// Grade C (Broken PCB): Harvest working screen/battery for spare parts\n// Grade D (Scrap):       Shred and recover gold, copper, and aluminum via EPR partner",
            "lineNotes": {
              "1": "Maximum value recovery.",
              "2": "Refurbishment secondary market.",
              "3": "Component harvesting.",
              "4": "Circular recycling."
            }
          },
          {
            "type": "runnable_code",
            "filename": "rma_triage_demo.js",
            "initialCode": "function triageReturnedItem(grade) {\n  const paths = {\n    'GRADE_A': 'RESELL_AS_CERTIFIED_OPEN_BOX',\n    'GRADE_B': 'REFURBISH_WITH_WARRANTY',\n    'GRADE_C': 'HARVEST_SPARE_COMPONENTS',\n    'GRADE_D': 'RECYCLE_VIA_EPR_CHANNEL'\n  };\n  return paths[grade] || 'SCRAP';\n}\n\nconsole.log(triageReturnedItem('GRADE_A'));\nconsole.log(triageReturnedItem('GRADE_D'));",
            "expectedOutput": "RESELL_AS_CERTIFIED_OPEN_BOX\nRECYCLE_VIA_EPR_CHANNEL",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What triage action is executed for returned electronic inventory evaluated as Grade-A flawless condition?",
          "expectedStringOutput": "RESELL_AS_CERTIFIED_OPEN_BOX",
          "acceptableAnswers": [
            "RESELL_AS_CERTIFIED_OPEN_BOX",
            "Resell Open Box",
            "Resell"
          ],
          "primaryMisconceptionId": "MC_OPS_REVERSE_LOGISTICS_CIRCULAR_EPR",
          "diagnosisMap": {
            "SCRAP": {
              "misconceptionId": "MC_OPS_REVERSE_LOGISTICS_CIRCULAR_EPR",
              "errorExplanation": "Scrapping working items destroys value. Grade A is RESELL_AS_CERTIFIED_OPEN_BOX.",
              "recoveryPath": {
                "simplerExplanation": "Matches RESELL_AS_CERTIFIED_OPEN_BOX.",
                "guidedFixPrompt": "Type RESELL_AS_CERTIFIED_OPEN_BOX"
              }
            }
          }
        }
      },
      {
        "id": "ops-d13-b3-circular-economy-closed-loop",
        "day": 13,
        "blockNumber": 3,
        "title": "Closed-Loop Supply Chains: Cradle-to-Cradle Manufacturing",
        "conceptBudget": {
          "primaryConcept": "Cradle-to-Cradle Invariant",
          "supportingTerms": [
            "Cradle-to-Cradle (Designing products so that 100% of disassembled components become biological nutrients or technical feedstock for next-generation products)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d13-b2-rma-reverse-logistics-triage",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "circular_cradle_demo.js",
            "initialCode": "function getCircularDesignPhilosophy() {\n  return 'CRADLE_TO_CRADLE_CLOSED_LOOP_MANUFACTURING';\n}\n\nconsole.log(getCircularDesignPhilosophy());",
            "expectedOutput": "CRADLE_TO_CRADLE_CLOSED_LOOP_MANUFACTURING",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What design philosophy describes circular manufacturing where 100% of discarded product components serve as technical inputs for new manufacturing cycles?",
          "expectedStringOutput": "CRADLE_TO_CRADLE_CLOSED_LOOP_MANUFACTURING",
          "acceptableAnswers": [
            "CRADLE_TO_CRADLE_CLOSED_LOOP_MANUFACTURING",
            "Cradle to Cradle",
            "Closed Loop"
          ],
          "primaryMisconceptionId": "MC_OPS_REVERSE_LOGISTICS_CIRCULAR_EPR",
          "diagnosisMap": {
            "CRADLE_TO_GRAVE": {
              "misconceptionId": "MC_OPS_REVERSE_LOGISTICS_CIRCULAR_EPR",
              "errorExplanation": "Cradle-to-grave is linear waste. Circular design is CRADLE_TO_CRADLE_CLOSED_LOOP_MANUFACTURING.",
              "recoveryPath": {
                "simplerExplanation": "Matches CRADLE_TO_CRADLE_CLOSED_LOOP_MANUFACTURING.",
                "guidedFixPrompt": "Type CRADLE_TO_CRADLE_CLOSED_LOOP_MANUFACTURING"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 14,
    "title": "Corporate Governance & Statutory Compliance: Companies Act & ICoFR Controls",
    "overviewMetaphor": "Corporate Governance is the Structural Foundation Pillars of a Skyscraper: Without independent oversight, corporate fraud and accounting restatements destroy shareholder value; under the Indian Companies Act 2013 and SOX 404, maintaining an Independent Audit Committee, certified Internal Controls over Financial Reporting (ICoFR), and strictly arm's-length Related Party Transaction (RPT) approvals ensures flawless statutory compliance and zero regulatory penalties.",
    "blocks": [
      {
        "id": "ops-d14-b1-corporate-governance-audit",
        "day": 14,
        "blockNumber": 1,
        "title": "Statutory Governance Certification: Audit Committee, ICoFR & RPT Controls",
        "conceptBudget": {
          "primaryConcept": "Corporate Governance Invariant",
          "supportingTerms": [
            "Independent Audit Committee (Mandatory 2/3 Independent Directors)",
            "ICoFR Certification (Auditor certification of internal financial controls)",
            "RPT Arm's-Length Approval (Audit committee prior approval for related party transactions)",
            "Status: Companies Act & ICoFR Governance Compliant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d13-b1-epr-statutory-fulfillment-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Corporate Governance & Statutory Audit Ledger",
              "boxes": [
                {
                  "label": "Audit Committee Structure",
                  "value": "2/3 Independent Directors + Financial Expert Chair Active",
                  "varType": "Audit Committee",
                  "isUpdated": false
                },
                {
                  "label": "ICoFR Internal Controls",
                  "value": "Statutory Auditor Certified Zero Material Internal Control Deficiencies",
                  "varType": "ICoFR",
                  "isUpdated": false
                },
                {
                  "label": "Related Party Transactions",
                  "value": "100% RPTs Executed at Verified Arm's-Length Fair Market Valuation",
                  "varType": "RPT",
                  "isUpdated": false
                },
                {
                  "label": "Corporate Governance Rating",
                  "value": "COMPANIES ACT AND ICOFR GOVERNANCE COMPLIANT NOMINAL!",
                  "varType": "Status",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "governance_calc_demo.js",
            "initialCode": "function auditGovernance(auditComm, icofr, rptApproval) {\n  const isCompliant = auditComm && icofr && rptApproval;\n  return {\n    auditComm,\n    icofr,\n    rptApproval,\n    isCompliant,\n    status: isCompliant ? 'COMPANIES_ACT_AND_ICOFR_GOVERNANCE_COMPLIANT' : 'GOVERNANCE_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditGovernance(true, true, true)));\nconsole.log(JSON.stringify(auditGovernance(true, false, true)));",
            "expectedOutput": "{\"auditComm\":true,\"icofr\":true,\"rptApproval\":true,\"isCompliant\":true,\"status\":\"COMPANIES_ACT_AND_ICOFR_GOVERNANCE_COMPLIANT\"}\n{\"auditComm\":true,\"icofr\":false,\"rptApproval\":true,\"isCompliant\":false,\"status\":\"GOVERNANCE_DEFECT\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What statutory status certifies an enterprise satisfying Independent Audit Committee mandates, certified ICoFR controls, and arm's-length RPT approvals?",
          "expectedStringOutput": "COMPANIES_ACT_AND_ICOFR_GOVERNANCE_COMPLIANT",
          "acceptableAnswers": [
            "COMPANIES_ACT_AND_ICOFR_GOVERNANCE_COMPLIANT",
            "Governance Compliant",
            "Companies Act Compliant"
          ],
          "primaryMisconceptionId": "MC_OPS_CORPORATE_GOVERNANCE_COMPANIES_ACT_ICOFR",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_OPS_CORPORATE_GOVERNANCE_COMPANIES_ACT_ICOFR",
              "errorExplanation": "All 3 criteria passing awards COMPANIES_ACT_AND_ICOFR_GOVERNANCE_COMPLIANT.",
              "recoveryPath": {
                "simplerExplanation": "Matches COMPANIES_ACT_AND_ICOFR_GOVERNANCE_COMPLIANT.",
                "guidedFixPrompt": "Type COMPANIES_ACT_AND_ICOFR_GOVERNANCE_COMPLIANT"
              }
            }
          }
        }
      },
      {
        "id": "ops-d14-b2-statutory-board-committees",
        "day": 14,
        "blockNumber": 2,
        "title": "Mandatory Board Committees: Audit, NRC & CSR Committees",
        "conceptBudget": {
          "primaryConcept": "Board Committee Roles",
          "supportingTerms": [
            "Audit Committee (Financial integrity & internal auditors)",
            "Nomination & Remuneration Committee (NRC: Executive pay & director appointment)",
            "CSR Committee (2% Net Profit social spending governance)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d14-b1-corporate-governance-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Board Committee Governance Responsibilities",
            "codeSnippet": "// AUDIT COMMITTEE: Reviews financial statements, oversees internal controls & statutory auditor\n// NRC:             Formulates executive compensation criteria & CEO succession planning\n// CSR COMMITTEE:   Approves statutory 2% profit community development projects",
            "lineNotes": {
              "1": "Financial oversight.",
              "2": "Executive compensation.",
              "3": "Social responsibility."
            }
          },
          {
            "type": "runnable_code",
            "filename": "board_committees_demo.js",
            "initialCode": "function getMandatoryBoardCommittees() {\n  return ['AUDIT_COMMITTEE', 'NOMINATION_REMUNERATION_COMMITTEE', 'CSR_COMMITTEE'];\n}\n\nconsole.log(JSON.stringify(getMandatoryBoardCommittees()));",
            "expectedOutput": "[\"AUDIT_COMMITTEE\",\"NOMINATION_REMUNERATION_COMMITTEE\",\"CSR_COMMITTEE\"]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which board committee oversees executive compensation packages and key managerial personnel (KMP) succession planning under the Companies Act?",
          "expectedStringOutput": "NOMINATION_REMUNERATION_COMMITTEE",
          "acceptableAnswers": [
            "NOMINATION_REMUNERATION_COMMITTEE",
            "NRC",
            "Nomination and Remuneration Committee"
          ],
          "primaryMisconceptionId": "MC_OPS_CORPORATE_GOVERNANCE_COMPANIES_ACT_ICOFR",
          "diagnosisMap": {
            "AUDIT_COMMITTEE": {
              "misconceptionId": "MC_OPS_CORPORATE_GOVERNANCE_COMPANIES_ACT_ICOFR",
              "errorExplanation": "Audit handles financials. Executive compensation is governed by the NOMINATION_REMUNERATION_COMMITTEE.",
              "recoveryPath": {
                "simplerExplanation": "Matches NOMINATION_REMUNERATION_COMMITTEE.",
                "guidedFixPrompt": "Type NOMINATION_REMUNERATION_COMMITTEE"
              }
            }
          }
        }
      },
      {
        "id": "ops-d14-b3-related-party-transactions-arms-length",
        "day": 14,
        "blockNumber": 3,
        "title": "Related Party Transactions (RPT): Section 188 & Arm's-Length Testing",
        "conceptBudget": {
          "primaryConcept": "RPT Arm's-Length Invariant",
          "supportingTerms": [
            "Arm's-Length Price (Transaction between two related entities conducted as if they were unrelated parties with zero preferential pricing or conflict of interest)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d14-b2-statutory-board-committees",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "rpt_pricing_demo.js",
            "initialCode": "function evaluateRptPricing(isMarketRateBenchmarked) {\n  return isMarketRateBenchmarked\n    ? 'ARMS_LENGTH_TRANSACTION_APPROVED'\n    : 'PREFERENTIAL_RPT_VIOLATION_TRIGGER_DISQUALIFICATION';\n}\n\nconsole.log(evaluateRptPricing(true));",
            "expectedOutput": "ARMS_LENGTH_TRANSACTION_APPROVED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What transaction approval standard must be proven for all commercial contracts executed between a company and an entity owned by a director's family member?",
          "expectedStringOutput": "ARMS_LENGTH_TRANSACTION_APPROVED",
          "acceptableAnswers": [
            "ARMS_LENGTH_TRANSACTION_APPROVED",
            "Arm's Length",
            "Arms length transaction"
          ],
          "primaryMisconceptionId": "MC_OPS_CORPORATE_GOVERNANCE_COMPANIES_ACT_ICOFR",
          "diagnosisMap": {
            "DIRECTOR_DISCRETION": {
              "misconceptionId": "MC_OPS_CORPORATE_GOVERNANCE_COMPANIES_ACT_ICOFR",
              "errorExplanation": "Directors cannot approve self-dealing. Contracts require ARMS_LENGTH_TRANSACTION_APPROVED pricing.",
              "recoveryPath": {
                "simplerExplanation": "Matches ARMS_LENGTH_TRANSACTION_APPROVED.",
                "guidedFixPrompt": "Type ARMS_LENGTH_TRANSACTION_APPROVED"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 15,
    "title": "⭐ MILESTONE 2: Complete OEE, Six Sigma Quality & Strategic Procurement Engine",
    "overviewMetaphor": "Milestone 2 Synthesis: The complete sovereign manufacturing quality, strategic procurement, and statutory governance suite: 1. World-Class OEE manufacturing ($85.7\\%$); 2. Six Sigma process capability ($C_{pk} = 1.67$); 3. Tier-1 Supplier OTIF delivery ($96.0\\%$); 4. WMS Inventory Record Accuracy ($99.8\\%$ IRA); 5. Companies Act & ICoFR corporate governance compliance.",
    "blocks": [
      {
        "id": "ops-d15-b1-manufacturing-quality-master-synthesis",
        "day": 15,
        "blockNumber": 1,
        "title": "Manufacturing Quality & Procurement Master Engine Synthesis",
        "conceptBudget": {
          "primaryConcept": "Manufacturing Quality Master Engine Synthesis",
          "supportingTerms": [
            "OEE Engine",
            "Six Sigma Cpk Engine",
            "OTIF Procurement Engine",
            "WMS IRA Engine",
            "Corporate Governance Engine"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d14-b3-related-party-transactions-arms-length",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Milestone 2 Manufacturing Quality & Procurement Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "Operates manufacturing at 85.7% world-class OEE",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Validates 1.67 Cpk Six Sigma capability with zero defects",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Enforces 96.0% OTIF and 99.8% WMS cycle counting accuracy",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Certifies ICoFR governance and activates Quality Master engine!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "quality_master_kernel_demo.js",
            "initialCode": "function runQualityMasterEngine() {\n  return {\n    oeeSubsystem: 'ONLINE_85_7_OEE_ACTIVE',\n    sixSigmaSubsystem: 'ONLINE_1_67_CPK_ACTIVE',\n    procurementSubsystem: 'ONLINE_96_OTIF_ACTIVE',\n    wmsSubsystem: 'ONLINE_99_8_IRA_ACTIVE',\n    governanceSubsystem: 'ONLINE_ICOFR_ACTIVE',\n    engineStatus: 'MANUFACTURING_QUALITY_AND_PROCUREMENT_MASTER_ACTIVE'\n  };\n}\n\nconsole.log(runQualityMasterEngine().engineStatus);",
            "expectedOutput": "MANUFACTURING_QUALITY_AND_PROCUREMENT_MASTER_ACTIVE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What engine status confirms active operational synthesis of the Manufacturing Quality & Procurement Master Engine?",
          "expectedStringOutput": "MANUFACTURING_QUALITY_AND_PROCUREMENT_MASTER_ACTIVE",
          "acceptableAnswers": [
            "MANUFACTURING_QUALITY_AND_PROCUREMENT_MASTER_ACTIVE",
            "engineStatus: MANUFACTURING_QUALITY_AND_PROCUREMENT_MASTER_ACTIVE"
          ],
          "primaryMisconceptionId": "MC_OPS_SIX_SIGMA_DMAIC_SPC_CPK",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_OPS_SIX_SIGMA_DMAIC_SPC_CPK",
              "errorExplanation": "Matches MANUFACTURING_QUALITY_AND_PROCUREMENT_MASTER_ACTIVE.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type MANUFACTURING_QUALITY_AND_PROCUREMENT_MASTER_ACTIVE"
              }
            }
          }
        }
      },
      {
        "id": "ops-d15-b2-quality-engine-audit",
        "day": 15,
        "blockNumber": 2,
        "title": "Manufacturing Quality Engine Invariant Verification & Precision Audit",
        "conceptBudget": {
          "primaryConcept": "Manufacturing Quality Invariant Verification",
          "supportingTerms": [
            "OEE Invariant",
            "Cpk Invariant",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d15-b1-manufacturing-quality-master-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "quality_audit_demo.js",
            "initialCode": "function auditQualityEngine(oeeValid, cpkValid, otifValid, iraValid, govValid) {\n  const passed = oeeValid && cpkValid && otifValid && iraValid && govValid;\n  return {\n    oeeVerified: oeeValid,\n    cpkVerified: cpkValid,\n    otifVerified: otifValid,\n    iraVerified: iraValid,\n    govVerified: govValid,\n    grade: passed ? 'MANUFACTURING_QUALITY_ENGINE_AUDIT_PASSED' : 'AUDIT_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditQualityEngine(true, true, true, true, true)));",
            "expectedOutput": "{\"oeeVerified\":true,\"cpkVerified\":true,\"otifVerified\":true,\"iraVerified\":true,\"govVerified\":true,\"grade\":\"MANUFACTURING_QUALITY_ENGINE_AUDIT_PASSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade is awarded when OEE, Cpk, OTIF, IRA, and Governance engines pass 100%?",
          "expectedStringOutput": "MANUFACTURING_QUALITY_ENGINE_AUDIT_PASSED",
          "acceptableAnswers": [
            "MANUFACTURING_QUALITY_ENGINE_AUDIT_PASSED",
            "grade\":\"MANUFACTURING_QUALITY_ENGINE_AUDIT_PASSED\""
          ],
          "primaryMisconceptionId": "MC_OPS_SIX_SIGMA_DMAIC_SPC_CPK",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_OPS_SIX_SIGMA_DMAIC_SPC_CPK",
              "errorExplanation": "All checks passing awards MANUFACTURING_QUALITY_ENGINE_AUDIT_PASSED.",
              "recoveryPath": {
                "simplerExplanation": "Awards MANUFACTURING_QUALITY_ENGINE_AUDIT_PASSED.",
                "guidedFixPrompt": "Type MANUFACTURING_QUALITY_ENGINE_AUDIT_PASSED"
              }
            }
          }
        }
      },
      {
        "id": "ops-d15-b3-milestone2-ops-cert",
        "day": 15,
        "blockNumber": 3,
        "title": "Milestone 2 Manufacturing Quality & Procurement Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 2 Certification",
          "supportingTerms": [
            "Manufacturing Quality Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d15-b2-quality-engine-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone2_ops_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 2: Complete OEE, Six Sigma Quality & Strategic Procurement Engine [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 2: Complete OEE, Six Sigma Quality & Strategic Procurement Engine [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 2 completion?",
          "expectedStringOutput": "⭐ MILESTONE 2: Complete OEE, Six Sigma Quality & Strategic Procurement Engine [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 2: Complete OEE, Six Sigma Quality & Strategic Procurement Engine [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_OPS_SIX_SIGMA_DMAIC_SPC_CPK",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_OPS_SIX_SIGMA_DMAIC_SPC_CPK",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 2: Complete OEE, Six Sigma Quality & Strategic Procurement Engine [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 16,
    "title": "Labor Laws, EHS & Workplace Safety: OSHA, LTIFR & Statutory Dues (PF/ESI)",
    "overviewMetaphor": "Workplace Safety is the Sacred Shield Guarding Factory Workers: In heavy manufacturing, zero profits can justify an injured worker; tracking the Lost Time Injury Frequency Rate ($LTIFR = \\frac{\\text{Injuries} \\times 1,000,000}{\\text{Man Hours}} = \\frac{0 \\times 1,000,000}{500,000} = 0.0$) ensures a world-class zero-incident safety culture; pairing this with 100% statutory deductions for Provident Fund (PF), Employee State Insurance (ESI), and POSH Committee compliance protects both human life and corporate reputation.",
    "blocks": [
      {
        "id": "ops-d16-b1-ltifr-workplace-safety-calculation",
        "day": 16,
        "blockNumber": 1,
        "title": "Lost Time Injury Frequency Rate (LTIFR) Formula: $\\text{LTIFR} = \\frac{\\text{Lost Time Injuries} \\times 1,000,000}{\\text{Total Man-Hours Worked}} = 0.0$",
        "conceptBudget": {
          "primaryConcept": "LTIFR Safety Index Formula",
          "supportingTerms": [
            "Lost Time Injuries Count ($0$ incidents)",
            "Total Man-Hours Worked ($500,000$ hours)",
            "LTIFR = $\\frac{0 \\times 1,000,000}{500,000} = 0.00$",
            "World-Class Industrial Safety Standard: $LTIFR = 0.00 \\implies$ Zero-Injury EHS Environment"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d14-b1-corporate-governance-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Workplace EHS Safety Ledger (0 Injuries / 500,000 Man-Hours)",
              "boxes": [
                {
                  "label": "Lost Time Injuries",
                  "value": "0 Reportable Lost-Time Accidents on Factory Shop Floor",
                  "varType": "Injuries",
                  "isUpdated": false
                },
                {
                  "label": "Total Man-Hours Worked",
                  "value": "500,000 Operating Hours Worked Across All 3 Shifts",
                  "varType": "Hours",
                  "isUpdated": false
                },
                {
                  "label": "EHS Safety Rating",
                  "value": "LTIFR = 0.00 (WORLD-CLASS ZERO-INJURY EHS ENVIRONMENT NOMINAL!)",
                  "varType": "LTIFR",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "ltifr_calc_demo.js",
            "initialCode": "function calculateLtifr(injuries, hours) {\n  const ltifr = (injuries * 1000000) / hours;\n  const isSafe = injuries === 0;\n  return {\n    injuries,\n    hours,\n    ltifrIndex: Number(ltifr.toFixed(2)),\n    isSafe,\n    status: isSafe ? 'WORLD_CLASS_ZERO_INJURY_EHS_ENVIRONMENT' : 'SAFETY_INCIDENT'\n  };\n}\n\nconsole.log(JSON.stringify(calculateLtifr(0, 500000)));\nconsole.log(JSON.stringify(calculateLtifr(2, 500000)));",
            "expectedOutput": "{\"injuries\":0,\"hours\":500000,\"ltifrIndex\":0,\"isSafe\":true,\"status\":\"WORLD_CLASS_ZERO_INJURY_EHS_ENVIRONMENT\"}\n{\"injuries\":2,\"hours\":500000,\"ltifrIndex\":4,\"isSafe\":false,\"status\":\"SAFETY_INCIDENT\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Lost Time Injury Frequency Rate (LTIFR) when a plant logs 0 injuries over 500,000 total man-hours worked ($ (0 \\times 1,000,000) / 500,000 $)?",
          "expectedStringOutput": "0",
          "acceptableAnswers": [
            "0",
            "0.0",
            "0.00",
            "ltifrIndex\":0"
          ],
          "primaryMisconceptionId": "MC_OPS_LABOR_LAWS_OSHA_EHS_LTIFR",
          "diagnosisMap": {
            "100": {
              "misconceptionId": "MC_OPS_LABOR_LAWS_OSHA_EHS_LTIFR",
              "errorExplanation": "LTIFR is an injury rate per million hours. 0 injuries yields LTIFR = 0.00.",
              "recoveryPath": {
                "simplerExplanation": "0 * 1,000,000 / 500,000 = 0.",
                "guidedFixPrompt": "Type 0"
              }
            }
          }
        }
      },
      {
        "id": "ops-d16-b2-statutory-labor-deductions-pf-esi",
        "day": 16,
        "blockNumber": 2,
        "title": "Statutory Labor Deductions: Provident Fund (PF 12%) & ESI (0.75% / 3.25%)",
        "conceptBudget": {
          "primaryConcept": "Statutory Labor Contributions",
          "supportingTerms": [
            "Employee PF Contribution (12% of basic wage)",
            "Employer PF Contribution (12% of basic wage)",
            "Employee ESI (0.75%)",
            "Employer ESI (3.25%)",
            "Gratuity Act (15 days wage per year of service after 5 years)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d16-b1-ltifr-workplace-safety-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Payroll Statutory Split",
            "codeSnippet": "// BASIC WAGE: $1,000/month\n// EMPLOYEE PF:  $120 (12% deducted from worker salary)\n// EMPLOYER PF:  $120 (12% matching contribution deposited to EPFO)\n// EMPLOYEE ESI: $7.50 (0.75% medical coverage)\n// EMPLOYER ESI: $32.50 (3.25% matching medical deposit to ESIC)",
            "lineNotes": {
              "1": "Wage base.",
              "2": "Employee retirement.",
              "3": "Employer retirement match.",
              "4": "Employee healthcare.",
              "5": "Employer healthcare match."
            }
          },
          {
            "type": "runnable_code",
            "filename": "pf_esi_demo.js",
            "initialCode": "function getStatutoryPfPercentage() {\n  return 'TWELVE_PERCENT_EMPLOYEE_AND_TWELVE_PERCENT_EMPLOYER_MATCH';\n}\n\nconsole.log(getStatutoryPfPercentage());",
            "expectedOutput": "TWELVE_PERCENT_EMPLOYEE_AND_TWELVE_PERCENT_EMPLOYER_MATCH",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the mandatory statutory Provident Fund (PF) contribution percentage required from both the employee and matching employer?",
          "expectedStringOutput": "TWELVE_PERCENT_EMPLOYEE_AND_TWELVE_PERCENT_EMPLOYER_MATCH",
          "acceptableAnswers": [
            "TWELVE_PERCENT_EMPLOYEE_AND_TWELVE_PERCENT_EMPLOYER_MATCH",
            "12%",
            "12 percent"
          ],
          "primaryMisconceptionId": "MC_OPS_LABOR_LAWS_OSHA_EHS_LTIFR",
          "diagnosisMap": {
            "5%": {
              "misconceptionId": "MC_OPS_LABOR_LAWS_OSHA_EHS_LTIFR",
              "errorExplanation": "Statutory PF is TWELVE_PERCENT_EMPLOYEE_AND_TWELVE_PERCENT_EMPLOYER_MATCH.",
              "recoveryPath": {
                "simplerExplanation": "Matches TWELVE_PERCENT_EMPLOYEE_AND_TWELVE_PERCENT_EMPLOYER_MATCH.",
                "guidedFixPrompt": "Type TWELVE_PERCENT_EMPLOYEE_AND_TWELVE_PERCENT_EMPLOYER_MATCH"
              }
            }
          }
        }
      },
      {
        "id": "ops-d16-b3-posh-internal-committee-mandate",
        "day": 16,
        "blockNumber": 3,
        "title": "POSH Act 2013: Internal Complaints Committee (ICC) Governance",
        "conceptBudget": {
          "primaryConcept": "POSH ICC Mandate",
          "supportingTerms": [
            "POSH Act (Prevention of Sexual Harassment at Workplace)",
            "Internal Committee (Mandatory for workplaces $\\ge 10$ employees, Presiding Officer must be a senior woman, $\\ge 50\\%$ women members, 1 external NGO member)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d16-b2-statutory-labor-deductions-pf-esi",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "posh_icc_demo.js",
            "initialCode": "function getPoshPresidingOfficerRule() {\n  return 'PRESIDING_OFFICER_MUST_BE_A_SENIOR_WOMAN_EMPLOYEE';\n}\n\nconsole.log(getPoshPresidingOfficerRule());",
            "expectedOutput": "PRESIDING_OFFICER_MUST_BE_A_SENIOR_WOMAN_EMPLOYEE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What statutory rule governs the appointment of the Presiding Officer of an enterprise Internal Complaints Committee (ICC) under the POSH Act?",
          "expectedStringOutput": "PRESIDING_OFFICER_MUST_BE_A_SENIOR_WOMAN_EMPLOYEE",
          "acceptableAnswers": [
            "PRESIDING_OFFICER_MUST_BE_A_SENIOR_WOMAN_EMPLOYEE",
            "Senior woman employee",
            "Woman presiding officer"
          ],
          "primaryMisconceptionId": "MC_OPS_LABOR_LAWS_OSHA_EHS_LTIFR",
          "diagnosisMap": {
            "EXTERNAL_LAWYER": {
              "misconceptionId": "MC_OPS_LABOR_LAWS_OSHA_EHS_LTIFR",
              "errorExplanation": "The presiding officer PRESIDING_OFFICER_MUST_BE_A_SENIOR_WOMAN_EMPLOYEE.",
              "recoveryPath": {
                "simplerExplanation": "Matches PRESIDING_OFFICER_MUST_BE_A_SENIOR_WOMAN_EMPLOYEE.",
                "guidedFixPrompt": "Type PRESIDING_OFFICER_MUST_BE_A_SENIOR_WOMAN_EMPLOYEE"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 17,
    "title": "Environmental Compliance & ESG: Carbon Scopes 1, 2, 3 & Effluent Treatment (ETP)",
    "overviewMetaphor": "Environmental Compliance is Operating Within the Planet's Immune System: Discharging untreated toxic dye or chemical sludge destroys river ecosystems and triggers factory shutdown orders; operating an on-site Effluent Treatment Plant (ETP) adhering to Zero Liquid Discharge (ZLD) norms combined with fulfilling statutory Corporate Social Responsibility ($2\\%$ of average net profit: $10,000,000 \\times 2\\% = \\$200,000$) establishes authentic ESG leadership.",
    "blocks": [
      {
        "id": "ops-d17-b1-statutory-csr-spend-etp-audit",
        "day": 17,
        "blockNumber": 1,
        "title": "Statutory CSR 2% Profit Allocation: $\\text{CSR Spend} = 3\\text{-Year Average Net Profit} \\times 2.0\\%$",
        "conceptBudget": {
          "primaryConcept": "Statutory CSR Allocation Formula",
          "supportingTerms": [
            "3-Year Average Net Profit ($10,000,000$)",
            "Statutory Mandated CSR Rate ($2.0\\%$)",
            "Statutory Required Spend = $10,000,000 \\times 2.0\\% = \\$200,000$",
            "ETP Effluent Treatment Plant Clearance Verified",
            "Status: Environmental & CSR Statutory Compliant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d16-b1-ltifr-workplace-safety-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "ESG Sustainability & Statutory CSR Ledger ($10M Profit, $200k CSR)",
              "boxes": [
                {
                  "label": "3-Year Avg Net Profit",
                  "value": "$10,000,000 Audited Net Profit Base",
                  "varType": "Profit",
                  "isUpdated": false
                },
                {
                  "label": "Mandatory 2% CSR Spend",
                  "value": "$10,000,000 x 2.0% = $200,000 Legally Required Social Spend",
                  "varType": "CSR Required",
                  "isUpdated": false
                },
                {
                  "label": "Effluent Plant (ETP)",
                  "value": "Zero Liquid Discharge (ZLD) Real-Time CPCB Water Sensor Clearance",
                  "varType": "ETP",
                  "isUpdated": false
                },
                {
                  "label": "ESG Compliance Status",
                  "value": "ENVIRONMENTAL AND CSR STATUTORY COMPLIANT NOMINAL!",
                  "varType": "Status",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "csr_etp_calc_demo.js",
            "initialCode": "function calculateCsr(avgProfit, actualCsr, etp) {\n  const req = avgProfit * 0.02;\n  const isCsrMet = actualCsr >= req;\n  const isCompliant = isCsrMet && etp;\n  return {\n    avgProfit,\n    requiredCsr: Math.round(req),\n    actualCsr,\n    isCompliant,\n    status: isCompliant ? 'ENVIRONMENTAL_AND_CSR_STATUTORY_COMPLIANT' : 'ESG_DEFICIT'\n  };\n}\n\nconsole.log(JSON.stringify(calculateCsr(10000000, 200000, true)));\nconsole.log(JSON.stringify(calculateCsr(10000000, 100000, true)));",
            "expectedOutput": "{\"avgProfit\":10000000,\"requiredCsr\":200000,\"actualCsr\":200000,\"isCompliant\":true,\"status\":\"ENVIRONMENTAL_AND_CSR_STATUTORY_COMPLIANT\"}\n{\"avgProfit\":10000000,\"requiredCsr\":200000,\"actualCsr\":100000,\"isCompliant\":false,\"status\":\"ESG_DEFICIT\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the statutory CSR social investment amount required for an enterprise with an average 3-year net profit of $10,000,000 ($10,000,000 \\times 0.02$)?",
          "expectedStringOutput": "200000",
          "acceptableAnswers": [
            "200000",
            "$200,000",
            "200k",
            "requiredCsr\":200000"
          ],
          "primaryMisconceptionId": "MC_OPS_ESG_CARBON_SCOPE_EMISSIONS_ETP",
          "diagnosisMap": {
            "100000": {
              "misconceptionId": "MC_OPS_ESG_CARBON_SCOPE_EMISSIONS_ETP",
              "errorExplanation": "100,000 is 1%. Statutory mandate under Section 135 is 2% = $200,000.",
              "recoveryPath": {
                "simplerExplanation": "10,000,000 * 0.02 = 200,000.",
                "guidedFixPrompt": "Type 200000"
              }
            }
          }
        }
      },
      {
        "id": "ops-d17-b2-ghg-protocol-carbon-scopes",
        "day": 17,
        "blockNumber": 2,
        "title": "GHG Protocol Carbon Accounting: Scope 1, Scope 2, and Scope 3",
        "conceptBudget": {
          "primaryConcept": "Carbon Scopes 1, 2, 3 Hierarchy",
          "supportingTerms": [
            "Scope 1 (Direct emissions: Factory boilers, company fleet vehicles)",
            "Scope 2 (Indirect emissions: Purchased grid electricity & steam)",
            "Scope 3 (Value chain emissions: Raw material extraction, freight logistics, customer product use)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d17-b1-statutory-csr-spend-etp-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Carbon Accounting Taxonomy",
            "codeSnippet": "// SCOPE 1 (Direct):   Diesel consumed by factory backup generators\n// SCOPE 2 (Indirect): Megawatt-hours of electricity billed by municipal power utility\n// SCOPE 3 (Supply):   Jet fuel burned by 3PL cargo airliners shipping customer packages",
            "lineNotes": {
              "1": "On-site combustion.",
              "2": "Purchased power.",
              "3": "Upstream & downstream value chain."
            }
          },
          {
            "type": "runnable_code",
            "filename": "carbon_scopes_demo.js",
            "initialCode": "function getCarbonScope(source) {\n  if (source === 'COMPANY_VEHICLES') return 'SCOPE_1_DIRECT_EMISSIONS';\n  if (source === 'PURCHASED_ELECTRICITY') return 'SCOPE_2_INDIRECT_ENERGY_EMISSIONS';\n  return 'SCOPE_3_VALUE_CHAIN_EMISSIONS';\n}\n\nconsole.log(getCarbonScope('COMPANY_VEHICLES'));\nconsole.log(getCarbonScope('PURCHASED_ELECTRICITY'));\nconsole.log(getCarbonScope('SUPPLIER_OCEAN_FREIGHT'));",
            "expectedOutput": "SCOPE_1_DIRECT_EMISSIONS\nSCOPE_2_INDIRECT_ENERGY_EMISSIONS\nSCOPE_3_VALUE_CHAIN_EMISSIONS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which carbon accounting tier encompasses indirect emissions generated from purchased municipal grid electricity used to power factory machinery?",
          "expectedStringOutput": "SCOPE_2_INDIRECT_ENERGY_EMISSIONS",
          "acceptableAnswers": [
            "SCOPE_2_INDIRECT_ENERGY_EMISSIONS",
            "Scope 2",
            "Scope 2 Indirect"
          ],
          "primaryMisconceptionId": "MC_OPS_ESG_CARBON_SCOPE_EMISSIONS_ETP",
          "diagnosisMap": {
            "SCOPE_1": {
              "misconceptionId": "MC_OPS_ESG_CARBON_SCOPE_EMISSIONS_ETP",
              "errorExplanation": "Scope 1 is direct on-site combustion. Purchased electricity is SCOPE_2_INDIRECT_ENERGY_EMISSIONS.",
              "recoveryPath": {
                "simplerExplanation": "Matches SCOPE_2_INDIRECT_ENERGY_EMISSIONS.",
                "guidedFixPrompt": "Type SCOPE_2_INDIRECT_ENERGY_EMISSIONS"
              }
            }
          }
        }
      },
      {
        "id": "ops-d17-b3-etp-zero-liquid-discharge-zld",
        "day": 17,
        "blockNumber": 3,
        "title": "Zero Liquid Discharge (ZLD) Effluent Treatment Architecture",
        "conceptBudget": {
          "primaryConcept": "ZLD Architecture Invariant",
          "supportingTerms": [
            "Zero Liquid Discharge (ZLD: Wastewater treatment cycle that purifies, recycles, and reclaims 95-99% of factory wastewater, leaving only solid dry salt cakes for disposal)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d17-b2-ghg-protocol-carbon-scopes",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "zld_etp_demo.js",
            "initialCode": "function evaluateZldCompliance(waterRecoveryPct) {\n  return waterRecoveryPct >= 95.0\n    ? 'ZERO_LIQUID_DISCHARGE_ZLD_COMPLIANT'\n    : 'EFFLUENT_DISCHARGE_PERMIT_BREACH';\n}\n\nconsole.log(evaluateZldCompliance(98.5));",
            "expectedOutput": "ZERO_LIQUID_DISCHARGE_ZLD_COMPLIANT",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What environmental clearance status is certified when an industrial plant recycles 98.5% of its manufacturing process water on-site?",
          "expectedStringOutput": "ZERO_LIQUID_DISCHARGE_ZLD_COMPLIANT",
          "acceptableAnswers": [
            "ZERO_LIQUID_DISCHARGE_ZLD_COMPLIANT",
            "ZLD Compliant",
            "Zero Liquid Discharge"
          ],
          "primaryMisconceptionId": "MC_OPS_ESG_CARBON_SCOPE_EMISSIONS_ETP",
          "diagnosisMap": {
            "PERMIT_BREACH": {
              "misconceptionId": "MC_OPS_ESG_CARBON_SCOPE_EMISSIONS_ETP",
              "errorExplanation": "98.5% recovery exceeds the 95% threshold, confirming ZERO_LIQUID_DISCHARGE_ZLD_COMPLIANT.",
              "recoveryPath": {
                "simplerExplanation": "Matches ZERO_LIQUID_DISCHARGE_ZLD_COMPLIANT.",
                "guidedFixPrompt": "Type ZERO_LIQUID_DISCHARGE_ZLD_COMPLIANT"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 18,
    "title": "Tax Compliance & E-Invoicing: GST 3-Way Match & E-Way Bill Reconciliation",
    "overviewMetaphor": "GST 3-Way Matching is an Automated Bank Vault Verification: You cannot pay a vendor invoice or claim input tax credit (ITC) based on a paper bill alone; the government tax portal GSTR-2B, your internal ERP Purchase Register, and the active logistics E-Way Bill must match to the exact dollar ($50,000 = $50,000 = $50,000); if any record deviates, automated ERP controls lock vendor payment, preventing tax audit penalties and fraudulent ITC claims.",
    "blocks": [
      {
        "id": "ops-d18-b1-gst-3way-matching-calculation",
        "day": 18,
        "blockNumber": 1,
        "title": "GST 3-Way Reconciliation Match: GSTR-2B == ERP Purchase Ledger == E-Way Bill",
        "conceptBudget": {
          "primaryConcept": "GST 3-Way Match Invariant",
          "supportingTerms": [
            "GSTR-2B Taxable Amount ($50,000.00$)",
            "ERP Purchase Register ($50,000.00$)",
            "E-Way Bill Logistics Value ($50,000.00$)",
            "Match Status: GST 3-Way Match Verified Release Vendor Payment"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d17-b1-statutory-csr-spend-etp-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Automated GST 3-Way Tax Reconciliation Ledger ($50,000 Exact Match)",
              "boxes": [
                {
                  "label": "Govt GSTR-2B Portal",
                  "value": "$50,000.00 Taxable Value Ingested via API from GSTN",
                  "varType": "GSTR-2B",
                  "isUpdated": false
                },
                {
                  "label": "ERP Purchase Ledger",
                  "value": "$50,000.00 Inbound PO Goods Receipt Note (GRN) Value",
                  "varType": "ERP",
                  "isUpdated": false
                },
                {
                  "label": "E-Way Bill Transit Value",
                  "value": "$50,000.00 Validated Logistics Transporter Cargo Value",
                  "varType": "E-Way Bill",
                  "isUpdated": false
                },
                {
                  "label": "3-Way Match Resolution",
                  "value": "GST 3WAY MATCH VERIFIED RELEASE VENDOR PAYMENT NOMINAL!",
                  "varType": "Status",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "gst_3way_calc_demo.js",
            "initialCode": "function reconcileGst(gstr2b, erp, eway) {\n  const isMatched = (gstr2b === erp) && (erp === eway);\n  return {\n    gstr2b,\n    erp,\n    eway,\n    isMatched,\n    status: isMatched ? 'GST_3WAY_MATCH_VERIFIED_RELEASE_VENDOR_PAYMENT' : 'TAX_MISMATCH_BLOCK_ITC'\n  };\n}\n\nconsole.log(JSON.stringify(reconcileGst(50000, 50000, 50000)));\nconsole.log(JSON.stringify(reconcileGst(50000, 48000, 50000)));",
            "expectedOutput": "{\"gstr2b\":50000,\"erp\":50000,\"eway\":50000,\"isMatched\":true,\"status\":\"GST_3WAY_MATCH_VERIFIED_RELEASE_VENDOR_PAYMENT\"}\n{\"gstr2b\":50000,\"erp\":48000,\"eway\":50000,\"isMatched\":false,\"status\":\"TAX_MISMATCH_BLOCK_ITC\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What system action is triggered when GSTR-2B ($50,000), ERP ($50,000), and E-Way Bill ($50,000) match with zero variance?",
          "expectedStringOutput": "GST_3WAY_MATCH_VERIFIED_RELEASE_VENDOR_PAYMENT",
          "acceptableAnswers": [
            "GST_3WAY_MATCH_VERIFIED_RELEASE_VENDOR_PAYMENT",
            "Release vendor payment",
            "3-way match verified"
          ],
          "primaryMisconceptionId": "MC_OPS_TAX_COMPLIANCE_GST_EINVOICE_3WAY_MATCH",
          "diagnosisMap": {
            "BLOCK": {
              "misconceptionId": "MC_OPS_TAX_COMPLIANCE_GST_EINVOICE_3WAY_MATCH",
              "errorExplanation": "When all 3 records match, payments are released: GST_3WAY_MATCH_VERIFIED_RELEASE_VENDOR_PAYMENT.",
              "recoveryPath": {
                "simplerExplanation": "Matches GST_3WAY_MATCH_VERIFIED_RELEASE_VENDOR_PAYMENT.",
                "guidedFixPrompt": "Type GST_3WAY_MATCH_VERIFIED_RELEASE_VENDOR_PAYMENT"
              }
            }
          }
        }
      },
      {
        "id": "ops-d18-b2-e-invoice-irn-generation",
        "day": 18,
        "blockNumber": 2,
        "title": "Automated E-Invoicing: IRN (Invoice Reference Number) & QR Code Generation",
        "conceptBudget": {
          "primaryConcept": "E-Invoicing Architecture",
          "supportingTerms": [
            "IRN (64-character hash generated by Invoice Registration Portal IRP)",
            "Mandatory for all B2B invoices above threshold with embedded QR code containing digital signature"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d18-b1-gst-3way-matching-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "E-Invoice Generation Pipeline",
            "codeSnippet": "// 1. ERP JSON: Generates schema-compliant invoice payload (Buyer GSTIN, HSN, Tax)\n// 2. IRP POST:  Transmits JSON payload to Govt Invoice Registration Portal API\n// 3. RETURN:    IRP responds with 64-char IRN hash + Digitally Signed QR Code\n// 4. PRINT:     Invoice printed with QR code; valid for transit and tax deduction!",
            "lineNotes": {
              "1": "ERP payload.",
              "2": "Government API.",
              "3": "Cryptographic signature.",
              "4": "Legal commercial invoice."
            }
          },
          {
            "type": "runnable_code",
            "filename": "e_invoice_demo.js",
            "initialCode": "function getEInvoiceHashName() {\n  return 'SIXTY_FOUR_CHARACTER_INVOICE_REFERENCE_NUMBER_IRN';\n}\n\nconsole.log(getEInvoiceHashName());",
            "expectedOutput": "SIXTY_FOUR_CHARACTER_INVOICE_REFERENCE_NUMBER_IRN",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What unique 64-character cryptographic hash is returned by the government IRP portal upon validating a B2B electronic invoice?",
          "expectedStringOutput": "SIXTY_FOUR_CHARACTER_INVOICE_REFERENCE_NUMBER_IRN",
          "acceptableAnswers": [
            "SIXTY_FOUR_CHARACTER_INVOICE_REFERENCE_NUMBER_IRN",
            "IRN",
            "Invoice Reference Number"
          ],
          "primaryMisconceptionId": "MC_OPS_TAX_COMPLIANCE_GST_EINVOICE_3WAY_MATCH",
          "diagnosisMap": {
            "GSTIN": {
              "misconceptionId": "MC_OPS_TAX_COMPLIANCE_GST_EINVOICE_3WAY_MATCH",
              "errorExplanation": "GSTIN is the tax ID. The unique invoice hash is SIXTY_FOUR_CHARACTER_INVOICE_REFERENCE_NUMBER_IRN.",
              "recoveryPath": {
                "simplerExplanation": "Matches SIXTY_FOUR_CHARACTER_INVOICE_REFERENCE_NUMBER_IRN.",
                "guidedFixPrompt": "Type SIXTY_FOUR_CHARACTER_INVOICE_REFERENCE_NUMBER_IRN"
              }
            }
          }
        }
      },
      {
        "id": "ops-d18-b3-eway-bill-statutory-threshold",
        "day": 18,
        "blockNumber": 3,
        "title": "E-Way Bill Generation & Distance-Based Validity Mandates",
        "conceptBudget": {
          "primaryConcept": "E-Way Bill Invariant",
          "supportingTerms": [
            "Mandatory for goods movement exceeding ₹50,000 threshold value",
            "Validity: 1 day per 200 km of transportation distance"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d18-b2-e-invoice-irn-generation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "eway_calc_demo.js",
            "initialCode": "function calculateEwayBillValidityDays(distanceKm) {\n  return Math.ceil(distanceKm / 200);\n}\n\nconsole.log(calculateEwayBillValidityDays(550)); // 550 km / 200 = 2.75 -> 3 Days Validity",
            "expectedOutput": "3",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many days of statutory validity are granted for an E-Way Bill covering an inter-state logistics route of 550 kilometers ($ \\lceil 550 / 200 \\rceil $)?",
          "expectedStringOutput": "3",
          "acceptableAnswers": [
            "3",
            "3 days",
            "3 Days"
          ],
          "primaryMisconceptionId": "MC_OPS_TAX_COMPLIANCE_GST_EINVOICE_3WAY_MATCH",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_OPS_TAX_COMPLIANCE_GST_EINVOICE_3WAY_MATCH",
              "errorExplanation": "1 day is for <= 200 km. 550 km gets 3 days.",
              "recoveryPath": {
                "simplerExplanation": "550 / 200 rounds up to 3 days.",
                "guidedFixPrompt": "Type 3"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 19,
    "title": "Customs & Foreign Trade: HS Codes, Bill of Entry & Duty Drawback Schemes",
    "overviewMetaphor": "Customs Clearance is the International Border Gate of Global Trade: When importing $10,000 worth of specialized machinery under Harmonized System (HS) code 8471, customs calculates Basic Customs Duty ($10\\% = \\$1,000$), Social Welfare Surcharge ($10\\% \\times \\$1,000 = \\$100$), and IGST ($18\\% \\times (10,000 + 1,000 + 100) = \\$1,998$); total customs duty payable is $3,098.00 ($1,000 + 100 + 1,998 = \\$3,098$); properly filing your Bill of Entry unlocks duty drawback and RoDTEP remissions on exported finished goods.",
    "blocks": [
      {
        "id": "ops-d19-b1-customs-duty-assessment-calculation",
        "day": 19,
        "blockNumber": 1,
        "title": "Customs Import Duty Assessment: $\\text{Total Duty} = \\text{BCD} + \\text{SWS} + \\text{IGST} = \\$3,098.00$",
        "conceptBudget": {
          "primaryConcept": "Customs Duty Assessment Formula",
          "supportingTerms": [
            "Assessable Value ($10,000.00$)",
            "Basic Customs Duty Rate ($10.0\\% \\implies \\$1,000.00$)",
            "Social Welfare Surcharge ($10.0\\% \\text{ of BCD} \\implies \\$100.00$)",
            "IGST Base ($10,000 + 1,000 + 100 = \\$11,100 \\times 18.0\\% \\implies \\$1,998.00$)",
            "Total Duty Payable = $1,000 + 100 + 1,998 = \\$3,098.00$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d18-b1-gst-3way-matching-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "International Customs Assessment Ledger ($10k Import, $3098 Duty)",
              "boxes": [
                {
                  "label": "Assessable Value (CIF)",
                  "value": "$10,000.00 CIF Port of Entry Valuation",
                  "varType": "Value",
                  "isUpdated": false
                },
                {
                  "label": "Basic Customs Duty (BCD)",
                  "value": "$10,000.00 x 10.0% = $1,000.00 BCD",
                  "varType": "BCD",
                  "isUpdated": false
                },
                {
                  "label": "Social Welfare Surcharge",
                  "value": "$1,000.00 BCD x 10.0% = $100.00 SWS",
                  "varType": "SWS",
                  "isUpdated": false
                },
                {
                  "label": "Integrated GST (18%)",
                  "value": "($10,000 + $1,000 + $100) x 18.0% = $1,998.00 IGST",
                  "varType": "IGST",
                  "isUpdated": false
                },
                {
                  "label": "Total Duty Clearance",
                  "value": "$1,000 + $100 + $1,998 = $3,098.00 (CUSTOMS DUTY ASSESSED NOMINAL!)",
                  "varType": "Total Duty",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "customs_calc_demo.js",
            "initialCode": "function calculateCustomsDuty(val, bcdRate, swsRate, igstRate) {\n  const bcd = val * (bcdRate / 100);\n  const sws = bcd * (swsRate / 100);\n  const taxableIgst = val + bcd + sws;\n  const igst = taxableIgst * (igstRate / 100);\n  const total = bcd + sws + igst;\n  return {\n    val,\n    bcd: Number(bcd.toFixed(2)),\n    sws: Number(sws.toFixed(2)),\n    igst: Number(igst.toFixed(2)),\n    totalDuty: Number(total.toFixed(2)),\n    status: 'CUSTOMS_DUTY_ASSESSED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateCustomsDuty(10000, 10, 10, 18)));",
            "expectedOutput": "{\"val\":10000,\"bcd\":1000,\"sws\":100,\"igst\":1998,\"totalDuty\":3098,\"status\":\"CUSTOMS_DUTY_ASSESSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the total customs import duty payable on a $10,000 import with 10% BCD ($1,000), 10% SWS ($100), and 18% IGST on duty-paid value ($1,998) ($1,000 + 100 + 1,998)?",
          "expectedStringOutput": "3098",
          "acceptableAnswers": [
            "3098",
            "3098.00",
            "$3,098",
            "totalDuty\":3098"
          ],
          "primaryMisconceptionId": "MC_OPS_CUSTOMS_FOREIGN_TRADE_HS_CODES",
          "diagnosisMap": {
            "1000": {
              "misconceptionId": "MC_OPS_CUSTOMS_FOREIGN_TRADE_HS_CODES",
              "errorExplanation": "1000 is BCD alone. Total duty includes SWS and IGST = $3,098.00.",
              "recoveryPath": {
                "simplerExplanation": "1,000 + 100 + 1,998 = 3,098.",
                "guidedFixPrompt": "Type 3098"
              }
            }
          }
        }
      },
      {
        "id": "ops-d19-b2-hs-code-harmonized-system-structure",
        "day": 19,
        "blockNumber": 2,
        "title": "Harmonized System (HS Codes): Chapter, Heading & Subheading Structure",
        "conceptBudget": {
          "primaryConcept": "HS Code Structure",
          "supportingTerms": [
            "Chapter (First 2 digits: e.g. 84 = Machinery)",
            "Heading (Digits 3-4: 84.71 = Automatic data processing machines)",
            "Subheading / Tariff Item (Digits 5-8: 8471.30.10 = Laptops)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d19-b1-customs-duty-assessment-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "HS Tariff Code Breakdown",
            "codeSnippet": "// HS CODE: 8471.30.10\n// 84:   Chapter 84 (Nuclear reactors, boilers, machinery and mechanical appliances)\n// 71:   Heading 8471 (Automatic data processing machines & units thereof)\n// 30:   Subheading 8471.30 (Portable digital automatic data processing machines)\n// 10:   National Tariff 8471.30.10 (Personal computers / Laptops < 10kg)",
            "lineNotes": {
              "1": "Global 8-digit tariff code.",
              "2": "Broad chapter.",
              "3": "Product family heading.",
              "4": "Subheading category.",
              "5": "National commodity item."
            }
          },
          {
            "type": "runnable_code",
            "filename": "hs_code_demo.js",
            "initialCode": "function getHsCodeStandardName() {\n  return 'HARMONIZED_COMMODITY_DESCRIPTION_AND_CODING_SYSTEM';\n}\n\nconsole.log(getHsCodeStandardName());",
            "expectedOutput": "HARMONIZED_COMMODITY_DESCRIPTION_AND_CODING_SYSTEM",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the global standard name of the international trade nomenclature maintained by the World Customs Organization (WCO)?",
          "expectedStringOutput": "HARMONIZED_COMMODITY_DESCRIPTION_AND_CODING_SYSTEM",
          "acceptableAnswers": [
            "HARMONIZED_COMMODITY_DESCRIPTION_AND_CODING_SYSTEM",
            "Harmonized System",
            "HS System"
          ],
          "primaryMisconceptionId": "MC_OPS_CUSTOMS_FOREIGN_TRADE_HS_CODES",
          "diagnosisMap": {
            "SKU": {
              "misconceptionId": "MC_OPS_CUSTOMS_FOREIGN_TRADE_HS_CODES",
              "errorExplanation": "SKUs are internal. Global trade uses the HARMONIZED_COMMODITY_DESCRIPTION_AND_CODING_SYSTEM.",
              "recoveryPath": {
                "simplerExplanation": "Matches HARMONIZED_COMMODITY_DESCRIPTION_AND_CODING_SYSTEM.",
                "guidedFixPrompt": "Type HARMONIZED_COMMODITY_DESCRIPTION_AND_CODING_SYSTEM"
              }
            }
          }
        }
      },
      {
        "id": "ops-d19-b3-bill-of-entry-customs-declaration",
        "day": 19,
        "blockNumber": 3,
        "title": "Bill of Entry (Import) vs Shipping Bill (Export) Statutory Filings",
        "conceptBudget": {
          "primaryConcept": "Customs Declaration Filings",
          "supportingTerms": [
            "Bill of Entry (Statutory legal declaration filed by importer with ICEGATE to assess and pay duties)",
            "Shipping Bill (Legal declaration for outbound export clearance)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d19-b2-hs-code-harmonized-system-structure",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "customs_docs_demo.js",
            "initialCode": "function getCustomsDeclarationDocument(tradeDirection) {\n  return tradeDirection === 'IMPORT'\n    ? 'BILL_OF_ENTRY_ICEGATE_IMPORT_DECLARATION'\n    : 'SHIPPING_BILL_EXPORT_DECLARATION';\n}\n\nconsole.log(getCustomsDeclarationDocument('IMPORT'));\nconsole.log(getCustomsDeclarationDocument('EXPORT'));",
            "expectedOutput": "BILL_OF_ENTRY_ICEGATE_IMPORT_DECLARATION\nSHIPPING_BILL_EXPORT_DECLARATION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which statutory customs document must be filed by an enterprise to declare inbound cargo, assess tariffs, and clear goods through ICEGATE customs ports?",
          "expectedStringOutput": "BILL_OF_ENTRY_ICEGATE_IMPORT_DECLARATION",
          "acceptableAnswers": [
            "BILL_OF_ENTRY_ICEGATE_IMPORT_DECLARATION",
            "Bill of Entry",
            "Bill of entry declaration"
          ],
          "primaryMisconceptionId": "MC_OPS_CUSTOMS_FOREIGN_TRADE_HS_CODES",
          "diagnosisMap": {
            "SHIPPING_BILL": {
              "misconceptionId": "MC_OPS_CUSTOMS_FOREIGN_TRADE_HS_CODES",
              "errorExplanation": "Shipping Bill is for exports. Inbound imports require BILL_OF_ENTRY_ICEGATE_IMPORT_DECLARATION.",
              "recoveryPath": {
                "simplerExplanation": "Matches BILL_OF_ENTRY_ICEGATE_IMPORT_DECLARATION.",
                "guidedFixPrompt": "Type BILL_OF_ENTRY_ICEGATE_IMPORT_DECLARATION"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 20,
    "title": "Enterprise Risk Management (ERM) & Business Continuity (BCP RTO/RPO <= 4h)",
    "overviewMetaphor": "Business Continuity Planning is a Nuclear Reactor Backup Generator: When a typhoon shuts down your primary port or a cyberattack locks your ERP server, panic causes bankruptcy; under ISO 31000 ERM, establishing a Recovery Time Objective ($RTO = 2.0 \\le 4.0$ hours) and Recovery Point Objective ($RPO = 1.0 \\le 4.0$ hours) with active dual-supplier redundancy guarantees the business recovers operations before supply chains collapse.",
    "blocks": [
      {
        "id": "ops-d20-b1-bcp-rto-rpo-disaster-recovery-audit",
        "day": 20,
        "blockNumber": 1,
        "title": "Business Continuity Metrics: Recovery Time Objective ($RTO \\le 4.0\\text{h}$) & Point Objective ($RPO \\le 4.0\\text{h}$)",
        "conceptBudget": {
          "primaryConcept": "BCP RTO and RPO Invariant",
          "supportingTerms": [
            "Recovery Time Objective ($RTO = 2.0$ hours $\\le 4.0$ hours)",
            "Recovery Point Objective ($RPO = 1.0$ hours $\\le 4.0$ hours)",
            "Dual-Supplier Redundancy Active",
            "Status: Business Continuity Disaster Recovery Certified"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d19-b1-customs-duty-assessment-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Enterprise Disaster Recovery & BCP Ledger (RTO=2h, RPO=1h)",
              "boxes": [
                {
                  "label": "RTO (Maximum Downtime)",
                  "value": "2.0 Hours to Restore Full Manufacturing Line (Ceiling <= 4.0h)",
                  "varType": "RTO",
                  "isUpdated": false
                },
                {
                  "label": "RPO (Data Loss Window)",
                  "value": "1.0 Hour Max Transaction Data Loss Window (Ceiling <= 4.0h)",
                  "varType": "RPO",
                  "isUpdated": false
                },
                {
                  "label": "Supply Chain Failover",
                  "value": "Active Secondary Supplier Tooling Validated & On Standby",
                  "varType": "Redundancy",
                  "isUpdated": false
                },
                {
                  "label": "BCP Certification Status",
                  "value": "BUSINESS CONTINUITY DISASTER RECOVERY CERTIFIED NOMINAL!",
                  "varType": "Status",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "bcp_calc_demo.js",
            "initialCode": "function auditBcp(rto, rpo, redundancy) {\n  const isReady = rto <= 4.0 && rpo <= 4.0 && redundancy;\n  return {\n    rto,\n    rpo,\n    redundancy,\n    isReady,\n    status: isReady ? 'BUSINESS_CONTINUITY_DISASTER_RECOVERY_CERTIFIED' : 'RESILIENCE_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditBcp(2.0, 1.0, true)));\nconsole.log(JSON.stringify(auditBcp(12.0, 8.0, false)));",
            "expectedOutput": "{\"rto\":2,\"rpo\":1,\"redundancy\":true,\"isReady\":true,\"status\":\"BUSINESS_CONTINUITY_DISASTER_RECOVERY_CERTIFIED\"}\n{\"rto\":12,\"rpo\":8,\"redundancy\":false,\"isReady\":false,\"status\":\"RESILIENCE_DEFECT\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What resilience status evaluates an enterprise achieving a 2.0-hour RTO, 1.0-hour RPO, and verified secondary supplier redundancy?",
          "expectedStringOutput": "BUSINESS_CONTINUITY_DISASTER_RECOVERY_CERTIFIED",
          "acceptableAnswers": [
            "BUSINESS_CONTINUITY_DISASTER_RECOVERY_CERTIFIED",
            "BCP Certified",
            "Disaster Recovery Certified"
          ],
          "primaryMisconceptionId": "MC_OPS_ERM_RISK_MATRIX_BCP_DISASTER_RECOVERY",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_OPS_ERM_RISK_MATRIX_BCP_DISASTER_RECOVERY",
              "errorExplanation": "Both RTO and RPO satisfy the <= 4.0 hour threshold, confirming BUSINESS_CONTINUITY_DISASTER_RECOVERY_CERTIFIED.",
              "recoveryPath": {
                "simplerExplanation": "Matches BUSINESS_CONTINUITY_DISASTER_RECOVERY_CERTIFIED.",
                "guidedFixPrompt": "Type BUSINESS_CONTINUITY_DISASTER_RECOVERY_CERTIFIED"
              }
            }
          }
        }
      },
      {
        "id": "ops-d20-b2-iso-31000-risk-matrix-calculation",
        "day": 20,
        "blockNumber": 2,
        "title": "ISO 31000 Risk Assessment Matrix: $\\text{Risk Score} = \\text{Likelihood} (1-5) \\times \\text{Impact} (1-5)$",
        "conceptBudget": {
          "primaryConcept": "Risk Matrix Formula",
          "supportingTerms": [
            "Likelihood ($L = 1 \\text{ to } 5$)",
            "Financial/Operational Impact ($I = 1 \\text{ to } 5$)",
            "Critical Risk Zone ($Score \\ge 15 \\implies$ Mandatory Board Mitigation Plan)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d20-b1-bcp-rto-rpo-disaster-recovery-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Risk Score Severity Bands",
            "codeSnippet": "// 1 - 4:   Low Risk (Acceptable operational tolerance)\n// 5 - 9:   Medium Risk (Periodic department monitoring)\n// 10 - 14: High Risk (Quarterly executive review)\n// 15 - 25: CRITICAL RISK (Immediate mitigation, dual-sourcing & board reporting)",
            "lineNotes": {
              "1": "Low severity.",
              "2": "Moderate severity.",
              "3": "Elevated severity.",
              "4": "Critical board escalation."
            }
          },
          {
            "type": "runnable_code",
            "filename": "risk_matrix_demo.js",
            "initialCode": "function calculateRiskScore(likelihood, impact) {\n  const score = likelihood * impact;\n  return {\n    likelihood,\n    impact,\n    score,\n    isCritical: score >= 15,\n    action: score >= 15 ? 'MANDATORY_IMMEDIATE_MITIGATION_PLAN' : 'ROUTINE_MONITORING'\n  };\n}\n\nconsole.log(JSON.stringify(calculateRiskScore(4, 5))); // 4 x 5 = 20 -> Critical",
            "expectedOutput": "{\"likelihood\":4,\"impact\":5,\"score\":20,\"isCritical\":true,\"action\":\"MANDATORY_IMMEDIATE_MITIGATION_PLAN\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What mitigation action is mandated when an operational risk registers a Likelihood of 4 and an Impact of 5 ($4 \\times 5 = 20 \\ge 15$)?",
          "expectedStringOutput": "MANDATORY_IMMEDIATE_MITIGATION_PLAN",
          "acceptableAnswers": [
            "MANDATORY_IMMEDIATE_MITIGATION_PLAN",
            "Immediate mitigation",
            "Mandatory mitigation"
          ],
          "primaryMisconceptionId": "MC_OPS_ERM_RISK_MATRIX_BCP_DISASTER_RECOVERY",
          "diagnosisMap": {
            "ROUTINE": {
              "misconceptionId": "MC_OPS_ERM_RISK_MATRIX_BCP_DISASTER_RECOVERY",
              "errorExplanation": "Score 20 is in the critical zone (>= 15), requiring a MANDATORY_IMMEDIATE_MITIGATION_PLAN.",
              "recoveryPath": {
                "simplerExplanation": "Matches MANDATORY_IMMEDIATE_MITIGATION_PLAN.",
                "guidedFixPrompt": "Type MANDATORY_IMMEDIATE_MITIGATION_PLAN"
              }
            }
          }
        }
      },
      {
        "id": "ops-d20-b3-business-impact-analysis-bia",
        "day": 20,
        "blockNumber": 3,
        "title": "Business Impact Analysis (BIA): Identifying Mission-Critical Operations",
        "conceptBudget": {
          "primaryConcept": "BIA Architecture",
          "supportingTerms": [
            "BIA (Business Impact Analysis: Quantifying daily dollar loss of system outage across order intake, production, customer support, and regulatory penalties)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d20-b2-iso-31000-risk-matrix-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "bia_demo.js",
            "initialCode": "function getBiaFullForm() {\n  return 'BUSINESS_IMPACT_ANALYSIS';\n}\n\nconsole.log(getBiaFullForm());",
            "expectedOutput": "BUSINESS_IMPACT_ANALYSIS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the full form acronym definition of BIA in corporate enterprise risk management?",
          "expectedStringOutput": "BUSINESS_IMPACT_ANALYSIS",
          "acceptableAnswers": [
            "BUSINESS_IMPACT_ANALYSIS",
            "Business Impact Analysis"
          ],
          "primaryMisconceptionId": "MC_OPS_ERM_RISK_MATRIX_BCP_DISASTER_RECOVERY",
          "diagnosisMap": {
            "AUDIT": {
              "misconceptionId": "MC_OPS_ERM_RISK_MATRIX_BCP_DISASTER_RECOVERY",
              "errorExplanation": "BIA stands for BUSINESS_IMPACT_ANALYSIS.",
              "recoveryPath": {
                "simplerExplanation": "Matches BUSINESS_IMPACT_ANALYSIS.",
                "guidedFixPrompt": "Type BUSINESS_IMPACT_ANALYSIS"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 21,
    "title": "⭐ MILESTONE 3: Complete EHS, GST Reconciliation & Business Continuity Engine",
    "overviewMetaphor": "Milestone 3 Synthesis: The complete sovereign operational compliance, statutory tax reconciliation, and enterprise risk governance suite: 1. Zero-incident workplace EHS ($LTIFR = 0.0$); 2. Statutory CSR ($2.0\\%$) and ETP effluent clearance; 3. GST 3-Way match ($50,000$ exact match); 4. Customs import duty calculation ($3,098$ duty on $10k CIF import); 5. BCP disaster recovery certification ($RTO/RPO \\le 4.0$ hours).",
    "blocks": [
      {
        "id": "ops-d21-b1-compliance-master-synthesis",
        "day": 21,
        "blockNumber": 1,
        "title": "Operational Compliance & Risk Master Engine Synthesis",
        "conceptBudget": {
          "primaryConcept": "Operational Compliance Master Engine Synthesis",
          "supportingTerms": [
            "Workplace EHS Engine",
            "ESG CSR ETP Engine",
            "GST 3-Way Engine",
            "Customs Tariff Engine",
            "BCP ERM Engine"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d20-b3-business-impact-analysis-bia",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Milestone 3 Operational Compliance & Risk Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "Enforces 0.0 LTIFR workplace safety and 2% statutory CSR with ETP ZLD",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Validates GST 3-Way automated matching ($50k exact ledger sync)",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Assesses $3,098 customs duty with accurate HS code classification",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Certifies 2h RTO / 1h RPO BCP disaster recovery engine!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "ops_compliance_master_kernel_demo.js",
            "initialCode": "function runOpsComplianceEngine() {\n  return {\n    ehsSubsystem: 'ONLINE_ZERO_LTIFR_ACTIVE',\n    esgSubsystem: 'ONLINE_2_PERCENT_CSR_ZLD_ACTIVE',\n    gstSubsystem: 'ONLINE_3WAY_MATCH_ACTIVE',\n    customsSubsystem: 'ONLINE_3098_DUTY_ACTIVE',\n    bcpSubsystem: 'ONLINE_2H_RTO_ACTIVE',\n    engineStatus: 'OPERATIONAL_COMPLIANCE_AND_RISK_MASTER_ACTIVE'\n  };\n}\n\nconsole.log(runOpsComplianceEngine().engineStatus);",
            "expectedOutput": "OPERATIONAL_COMPLIANCE_AND_RISK_MASTER_ACTIVE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What engine status confirms active operational synthesis of the Operational Compliance & Risk Master Engine?",
          "expectedStringOutput": "OPERATIONAL_COMPLIANCE_AND_RISK_MASTER_ACTIVE",
          "acceptableAnswers": [
            "OPERATIONAL_COMPLIANCE_AND_RISK_MASTER_ACTIVE",
            "engineStatus: OPERATIONAL_COMPLIANCE_AND_RISK_MASTER_ACTIVE"
          ],
          "primaryMisconceptionId": "MC_OPS_TAX_COMPLIANCE_GST_EINVOICE_3WAY_MATCH",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_OPS_TAX_COMPLIANCE_GST_EINVOICE_3WAY_MATCH",
              "errorExplanation": "Matches OPERATIONAL_COMPLIANCE_AND_RISK_MASTER_ACTIVE.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type OPERATIONAL_COMPLIANCE_AND_RISK_MASTER_ACTIVE"
              }
            }
          }
        }
      },
      {
        "id": "ops-d21-b2-compliance-engine-audit",
        "day": 21,
        "blockNumber": 2,
        "title": "Operational Compliance Engine Invariant Verification & Precision Audit",
        "conceptBudget": {
          "primaryConcept": "Operational Compliance Invariant Verification",
          "supportingTerms": [
            "EHS Invariant",
            "GST Invariant",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d21-b1-compliance-master-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "compliance_audit_demo.js",
            "initialCode": "function auditComplianceEngine(ehs, esg, gst, customs, bcp) {\n  const passed = ehs && esg && gst && customs && bcp;\n  return {\n    ehsVerified: ehs,\n    esgVerified: esg,\n    gstVerified: gst,\n    customsVerified: customs,\n    bcpVerified: bcp,\n    grade: passed ? 'OPERATIONAL_COMPLIANCE_ENGINE_AUDIT_PASSED' : 'AUDIT_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditComplianceEngine(true, true, true, true, true)));",
            "expectedOutput": "{\"ehsVerified\":true,\"esgVerified\":true,\"gstVerified\":true,\"customsVerified\":true,\"bcpVerified\":true,\"grade\":\"OPERATIONAL_COMPLIANCE_ENGINE_AUDIT_PASSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade is awarded when EHS, ESG, GST 3-Way, Customs, and BCP engines pass 100%?",
          "expectedStringOutput": "OPERATIONAL_COMPLIANCE_ENGINE_AUDIT_PASSED",
          "acceptableAnswers": [
            "OPERATIONAL_COMPLIANCE_ENGINE_AUDIT_PASSED",
            "grade\":\"OPERATIONAL_COMPLIANCE_ENGINE_AUDIT_PASSED\""
          ],
          "primaryMisconceptionId": "MC_OPS_TAX_COMPLIANCE_GST_EINVOICE_3WAY_MATCH",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_OPS_TAX_COMPLIANCE_GST_EINVOICE_3WAY_MATCH",
              "errorExplanation": "All checks passing awards OPERATIONAL_COMPLIANCE_ENGINE_AUDIT_PASSED.",
              "recoveryPath": {
                "simplerExplanation": "Awards OPERATIONAL_COMPLIANCE_ENGINE_AUDIT_PASSED.",
                "guidedFixPrompt": "Type OPERATIONAL_COMPLIANCE_ENGINE_AUDIT_PASSED"
              }
            }
          }
        }
      },
      {
        "id": "ops-d21-b3-milestone3-ops-cert",
        "day": 21,
        "blockNumber": 3,
        "title": "Milestone 3 Operational Compliance & Risk Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 3 Certification",
          "supportingTerms": [
            "Operational Compliance Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d21-b2-compliance-engine-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone3_ops_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 3: Complete EHS, GST Reconciliation & Business Continuity Engine [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 3: Complete EHS, GST Reconciliation & Business Continuity Engine [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 3 completion?",
          "expectedStringOutput": "⭐ MILESTONE 3: Complete EHS, GST Reconciliation & Business Continuity Engine [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 3: Complete EHS, GST Reconciliation & Business Continuity Engine [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_OPS_TAX_COMPLIANCE_GST_EINVOICE_3WAY_MATCH",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_OPS_TAX_COMPLIANCE_GST_EINVOICE_3WAY_MATCH",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 3: Complete EHS, GST Reconciliation & Business Continuity Engine [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 22,
    "title": "Total Productive Maintenance (TPM): MTBF, MTTR & Autonomous Maintenance",
    "overviewMetaphor": "Total Productive Maintenance is Treating Industrial Machines Like Formula 1 Race Cars: If you wait for a CNC lathe to break down before fixing it, you ruin delivery schedules; by tracking Mean Time Between Failures ($MTBF = \\frac{1000}{3} = 333$ hours) and Mean Time to Repair ($MTTR = \\frac{6}{3} = 2.0 \\le 2.0$ hours) alongside Autonomous Maintenance (Jishu Hozen: Machine operators lubricate and inspect daily), you achieve the ultimate industrial goal of Zero Unplanned Downtime.",
    "blocks": [
      {
        "id": "ops-d22-b1-tpm-mtbf-mttr-calculation",
        "day": 22,
        "blockNumber": 1,
        "title": "Total Productive Maintenance Metrics: MTBF ($333\\text{h}$) & MTTR ($2.0\\text{h} \\le 2.0\\text{h}$)",
        "conceptBudget": {
          "primaryConcept": "MTBF and MTTR Reliability Formula",
          "supportingTerms": [
            "Total Operating Hours ($1,000$ hours)",
            "Total Repair Downtime ($6.0$ hours)",
            "Breakdown Count ($3$ breakdowns)",
            "MTBF = $\\frac{1,000}{3} = 333$ hours $\\ge 200$",
            "MTTR = $\\frac{6.0}{3} = 2.0$ hours $\\le 2.0$",
            "Status: TPM Machine Reliability Optimal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d20-b1-bcp-rto-rpo-disaster-recovery-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "TPM Machine Reliability & Maintenance Ledger (MTBF=333h, MTTR=2.0h)",
              "boxes": [
                {
                  "label": "Mean Time Between Failures",
                  "value": "1,000h / 3 Breakdowns = 333 Hours Operating Between Faults",
                  "varType": "MTBF",
                  "isUpdated": false
                },
                {
                  "label": "Mean Time to Repair (MTTR)",
                  "value": "6.0h / 3 Breakdowns = 2.0 Hours Average Restoration Time",
                  "varType": "MTTR",
                  "isUpdated": false
                },
                {
                  "label": "Reliability Benchmark",
                  "value": "TPM MACHINE RELIABILITY OPTIMAL (MTTR <= 2.0h CEILING MET!)",
                  "varType": "Status",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "tpm_calc_demo.js",
            "initialCode": "function calculateTpm(operatingHours, repairHours, breakdowns) {\n  const mtbf = operatingHours / breakdowns;\n  const mttr = repairHours / breakdowns;\n  const isReliable = mttr <= 2.0 && mtbf >= 200.0;\n  return {\n    operatingHours,\n    breakdowns,\n    mtbfHours: Math.round(mtbf),\n    mttrHours: Number(mttr.toFixed(1)),\n    isReliable,\n    status: isReliable ? 'TPM_MACHINE_RELIABILITY_OPTIMAL' : 'EXCESSIVE_DOWNTIME'\n  };\n}\n\nconsole.log(JSON.stringify(calculateTpm(1000, 6, 3)));",
            "expectedOutput": "{\"operatingHours\":1000,\"breakdowns\":3,\"mtbfHours\":333,\"mttrHours\":2,\"isReliable\":true,\"status\":\"TPM_MACHINE_RELIABILITY_OPTIMAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Mean Time to Repair (MTTR) in hours when a machine experiences 3 breakdowns requiring 6 total hours of maintenance repair ($6.0 / 3$)?",
          "expectedStringOutput": "2",
          "acceptableAnswers": [
            "2",
            "2.0",
            "2 hours",
            "mttrHours\":2"
          ],
          "primaryMisconceptionId": "MC_OPS_TPM_TOTAL_PRODUCTIVE_MAINTENANCE_MTTR",
          "diagnosisMap": {
            "333": {
              "misconceptionId": "MC_OPS_TPM_TOTAL_PRODUCTIVE_MAINTENANCE_MTTR",
              "errorExplanation": "333 is MTBF (uptime). MTTR is repair time = 6.0 / 3 = 2.0 hours.",
              "recoveryPath": {
                "simplerExplanation": "6 / 3 = 2.0 hours.",
                "guidedFixPrompt": "Type 2"
              }
            }
          }
        }
      },
      {
        "id": "ops-d22-b2-jishu-hozen-autonomous-maintenance",
        "day": 22,
        "blockNumber": 2,
        "title": "Autonomous Maintenance (Jishu Hozen): The 7 Steps of Operator Care",
        "conceptBudget": {
          "primaryConcept": "Jishu Hozen Philosophy",
          "supportingTerms": [
            "Jishu Hozen (Empowering machine operators to perform daily cleaning, lubrication, tightening, and early abnormality detection rather than waiting for dedicated maintenance technicians)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d22-b1-tpm-mtbf-mttr-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Jishu Hozen Operator Routine",
            "codeSnippet": "// 1. Initial Cleaning (Spot oil leaks & loose bolts)\n// 2. Eliminate Contamination Sources (Cover open gears from dust)\n// 3. Establish Cleaning & Lubrication Standards (Color-coded grease points)\n// 4. General Inspection Training (Operators inspect pneumatic pressures daily)",
            "lineNotes": {
              "1": "Deep clean.",
              "2": "Root cause containment.",
              "3": "Visual standards.",
              "4": "Operator capability."
            }
          },
          {
            "type": "runnable_code",
            "filename": "jishu_hozen_demo.js",
            "initialCode": "function getAutonomousMaintenanceJapaneseTerm() {\n  return 'JISHU_HOZEN_OPERATOR_AUTONOMOUS_MAINTENANCE';\n}\n\nconsole.log(getAutonomousMaintenanceJapaneseTerm());",
            "expectedOutput": "JISHU_HOZEN_OPERATOR_AUTONOMOUS_MAINTENANCE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What Japanese term designates the TPM pillar where machine operators assume direct daily responsibility for equipment cleaning and preventive inspection?",
          "expectedStringOutput": "JISHU_HOZEN_OPERATOR_AUTONOMOUS_MAINTENANCE",
          "acceptableAnswers": [
            "JISHU_HOZEN_OPERATOR_AUTONOMOUS_MAINTENANCE",
            "Jishu Hozen",
            "Jishu-Hozen"
          ],
          "primaryMisconceptionId": "MC_OPS_TPM_TOTAL_PRODUCTIVE_MAINTENANCE_MTTR",
          "diagnosisMap": {
            "KAIZEN": {
              "misconceptionId": "MC_OPS_TPM_TOTAL_PRODUCTIVE_MAINTENANCE_MTTR",
              "errorExplanation": "Kaizen is continuous improvement. Operator maintenance is JISHU_HOZEN_OPERATOR_AUTONOMOUS_MAINTENANCE.",
              "recoveryPath": {
                "simplerExplanation": "Matches JISHU_HOZEN_OPERATOR_AUTONOMOUS_MAINTENANCE.",
                "guidedFixPrompt": "Type JISHU_HOZEN_OPERATOR_AUTONOMOUS_MAINTENANCE"
              }
            }
          }
        }
      },
      {
        "id": "ops-d22-b3-oee-six-big-losses",
        "day": 22,
        "blockNumber": 3,
        "title": "The 6 Big Losses in Total Productive Maintenance (TPM)",
        "conceptBudget": {
          "primaryConcept": "6 Big Losses Taxonomy",
          "supportingTerms": [
            "1. Equipment Failures (Unplanned breakdown)",
            "2. Setup & Adjustments (Changeover delay)",
            "3. Idling & Minor Stops ($< 5$ min sensor jams)",
            "4. Reduced Speed (Running below rated capacity)",
            "5. Process Defects (Scrap parts)",
            "6. Reduced Yield (Startup scrap)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d22-b2-jishu-hozen-autonomous-maintenance",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "six_big_losses_demo.js",
            "initialCode": "function getTpmSixBigLossesCount() {\n  return 6;\n}\n\nconsole.log(getTpmSixBigLossesCount());",
            "expectedOutput": "6",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many universal categories of operational waste comprise the foundational 'Big Losses' framework targeted by TPM programs?",
          "expectedStringOutput": "6",
          "acceptableAnswers": [
            "6",
            "6 losses",
            "Six"
          ],
          "primaryMisconceptionId": "MC_OPS_TPM_TOTAL_PRODUCTIVE_MAINTENANCE_MTTR",
          "diagnosisMap": {
            "8": {
              "misconceptionId": "MC_OPS_TPM_TOTAL_PRODUCTIVE_MAINTENANCE_MTTR",
              "errorExplanation": "8 refers to the 8 Wastes of Lean. TPM specifically targets the 6 Big Losses.",
              "recoveryPath": {
                "simplerExplanation": "TPM defines 6 Big Losses.",
                "guidedFixPrompt": "Type 6"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 23,
    "title": "Project Management in Operations: Critical Path Method (CPM) & PERT Networks",
    "overviewMetaphor": "The Critical Path is the Rigid Steel Backbone of an Operations Project: When expanding a factory manufacturing line, dozens of tasks occur concurrently; using Program Evaluation and Review Technique (PERT) weighted expected durations ($T_e = \\frac{O + 4M + P}{6} = \\frac{10 + 4(16) + 28}{6} = 17.0$ days), you calculate the sequence of dependent tasks with Zero Slack Time (The Critical Path); any 1-day delay on the critical path delays the entire factory opening date by a full day.",
    "blocks": [
      {
        "id": "ops-d23-b1-pert-expected-duration-calculation",
        "day": 23,
        "blockNumber": 1,
        "title": "PERT Expected Duration Formula: $T_e = \\frac{O + 4M + P}{6} = 17.0\\text{ Days}$",
        "conceptBudget": {
          "primaryConcept": "PERT Weighted Duration Formula",
          "supportingTerms": [
            "Optimistic Time ($O = 10.0$ days)",
            "Most Likely Time ($M = 16.0$ days)",
            "Pessimistic Time ($P = 28.0$ days)",
            "$T_e = \\frac{10 + (4 \\times 16) + 28}{6} = \\frac{102}{6} = 17.0$ days",
            "Critical Path: Longest path with Zero Slack ($Float = 0.0$)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d22-b1-tpm-mtbf-mttr-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "PERT Network Duration Ledger (O=10d, M=16d, P=28d)",
              "boxes": [
                {
                  "label": "Optimistic Best-Case (O)",
                  "value": "10.0 Days (All equipment delivered with zero customs delay)",
                  "varType": "O",
                  "isUpdated": false
                },
                {
                  "label": "Most Likely Base-Case (M)",
                  "value": "16.0 Days (Standard installation and contractor schedule)",
                  "varType": "M",
                  "isUpdated": false
                },
                {
                  "label": "Pessimistic Worst-Case (P)",
                  "value": "28.0 Days (Extreme supplier delays & union negotiations)",
                  "varType": "P",
                  "isUpdated": false
                },
                {
                  "label": "Expected Duration (Te)",
                  "value": "(10 + 64 + 28) / 6 = 17.0 DAYS (PERT SCHEDULE BASELINE NOMINAL!)",
                  "varType": "Te",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "pert_calc_demo.js",
            "initialCode": "function calculatePert(o, m, p) {\n  const te = (o + (4 * m) + p) / 6;\n  return {\n    o,\n    m,\n    p,\n    pertExpectedDays: Number(te.toFixed(1)),\n    status: 'PERT_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculatePert(10, 16, 28)));",
            "expectedOutput": "{\"o\":10,\"m\":16,\"p\":28,\"pertExpectedDays\":17,\"status\":\"PERT_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the PERT expected activity duration in days when optimistic time is 10 days, most likely is 16 days, and pessimistic is 28 days ($ (10 + 4(16) + 28) / 6 $)?",
          "expectedStringOutput": "17",
          "acceptableAnswers": [
            "17",
            "17.0",
            "17 days",
            "pertExpectedDays\":17"
          ],
          "primaryMisconceptionId": "MC_OPS_PROJECT_MANAGEMENT_CPM_PERT_CRITICAL_PATH",
          "diagnosisMap": {
            "18": {
              "misconceptionId": "MC_OPS_PROJECT_MANAGEMENT_CPM_PERT_CRITICAL_PATH",
              "errorExplanation": "18 is a simple average ((10+16+28)/3). PERT weights M by 4: (10 + 64 + 28)/6 = 17.0 days.",
              "recoveryPath": {
                "simplerExplanation": "102 / 6 = 17.0.",
                "guidedFixPrompt": "Type 17"
              }
            }
          }
        }
      },
      {
        "id": "ops-d23-b2-critical-path-slack-float-zero",
        "day": 23,
        "blockNumber": 2,
        "title": "Critical Path Float & Slack: Total Slack on Critical Path $\\equiv 0.0$ Days",
        "conceptBudget": {
          "primaryConcept": "Critical Path Slack Invariant",
          "supportingTerms": [
            "Early Start (ES)",
            "Late Start (LS)",
            "$Slack = LS - ES = 0.0$ days on the Critical Path",
            "Non-critical activities have positive slack/float allowing schedule buffering"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d23-b1-pert-expected-duration-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "CPM Network Path Analysis",
            "codeSnippet": "// Path 1: Foundation (5d) -> Steel Frame (10d) -> Machinery (15d) = 30 DAYS (CRITICAL PATH - ZERO SLACK!)\n// Path 2: Foundation (5d) -> Paint (3d) -> Office Furniture (4d)     = 12 DAYS (18 Days Slack Float)",
            "lineNotes": {
              "1": "Critical path: Determines project finish date.",
              "2": "Sub-critical path with flexible float buffer."
            }
          },
          {
            "type": "runnable_code",
            "filename": "cpm_slack_demo.js",
            "initialCode": "function evaluateCriticalPathSlack(lateStart, earlyStart) {\n  const slack = lateStart - earlyStart;\n  return {\n    slackDays: slack,\n    isCriticalPath: slack === 0,\n    status: slack === 0 ? 'CRITICAL_PATH_ZERO_SLACK_STRICT_DEADLINE' : 'NON_CRITICAL_FLOAT_BUFFER_AVAILABLE'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateCriticalPathSlack(10, 10)));\nconsole.log(JSON.stringify(evaluateCriticalPathSlack(15, 10)));",
            "expectedOutput": "{\"slackDays\":0,\"isCriticalPath\":true,\"status\":\"CRITICAL_PATH_ZERO_SLACK_STRICT_DEADLINE\"}\n{\"slackDays\":5,\"isCriticalPath\":false,\"status\":\"NON_CRITICAL_FLOAT_BUFFER_AVAILABLE\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the total slack float time in days for any activity located on the primary Critical Path of a project schedule network?",
          "expectedStringOutput": "0",
          "acceptableAnswers": [
            "0",
            "0.0",
            "0 days",
            "Zero slack",
            "slackDays\":0"
          ],
          "primaryMisconceptionId": "MC_OPS_PROJECT_MANAGEMENT_CPM_PERT_CRITICAL_PATH",
          "diagnosisMap": {
            "5": {
              "misconceptionId": "MC_OPS_PROJECT_MANAGEMENT_CPM_PERT_CRITICAL_PATH",
              "errorExplanation": "Critical path activities by definition have zero slack float time.",
              "recoveryPath": {
                "simplerExplanation": "Critical path slack is strictly 0.",
                "guidedFixPrompt": "Type 0"
              }
            }
          }
        }
      },
      {
        "id": "ops-d23-b3-work-breakdown-structure-wbs",
        "day": 23,
        "blockNumber": 3,
        "title": "Work Breakdown Structure (WBS) & The 100% Rule",
        "conceptBudget": {
          "primaryConcept": "WBS 100% Rule Invariant",
          "supportingTerms": [
            "WBS (Hierarchical decomposition of total project scope into discrete work packages)",
            "100% Rule (WBS must capture 100% of project deliverables, including management and testing, with zero exclusions)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d23-b2-critical-path-slack-float-zero",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "wbs_rule_demo.js",
            "initialCode": "function getWbsGoldenRule() {\n  return 'ONE_HUNDRED_PERCENT_RULE_CAPTURES_ALL_SCOPE_WITHOUT_EXCEPTION';\n}\n\nconsole.log(getWbsGoldenRule());",
            "expectedOutput": "ONE_HUNDRED_PERCENT_RULE_CAPTURES_ALL_SCOPE_WITHOUT_EXCEPTION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What foundational project management rule states that a Work Breakdown Structure (WBS) must encompass 100% of all deliverable work without omitting any internal or external tasks?",
          "expectedStringOutput": "ONE_HUNDRED_PERCENT_RULE_CAPTURES_ALL_SCOPE_WITHOUT_EXCEPTION",
          "acceptableAnswers": [
            "ONE_HUNDRED_PERCENT_RULE_CAPTURES_ALL_SCOPE_WITHOUT_EXCEPTION",
            "100% Rule",
            "100 percent rule"
          ],
          "primaryMisconceptionId": "MC_OPS_PROJECT_MANAGEMENT_CPM_PERT_CRITICAL_PATH",
          "diagnosisMap": {
            "80/20": {
              "misconceptionId": "MC_OPS_PROJECT_MANAGEMENT_CPM_PERT_CRITICAL_PATH",
              "errorExplanation": "80/20 is Pareto. WBS scope decomposition requires the ONE_HUNDRED_PERCENT_RULE_CAPTURES_ALL_SCOPE_WITHOUT_EXCEPTION.",
              "recoveryPath": {
                "simplerExplanation": "Matches ONE_HUNDRED_PERCENT_RULE_CAPTURES_ALL_SCOPE_WITHOUT_EXCEPTION.",
                "guidedFixPrompt": "Type ONE_HUNDRED_PERCENT_RULE_CAPTURES_ALL_SCOPE_WITHOUT_EXCEPTION"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 24,
    "title": "ERP Systems & MRP-II: Bill of Materials (BOM) Explosion & Net Requirements",
    "overviewMetaphor": "MRP-II Netting is the Computational Recipe Engine of a Smart Factory: If your master production schedule calls for 1,000 finished electric scooters (Gross Demand), and you have 300 in stock plus 200 scheduled for delivery (500 Available), your net shortfall is 500 scooters ($1,000 - 500 = 500$); exploding the Bill of Materials (BOM) where each scooter requires 4 lithium battery cells ($500 \\times 4 = 2,000$) automatically generates purchase orders for exactly 2,000 battery cells, preventing both line stoppages and inventory bloat.",
    "blocks": [
      {
        "id": "ops-d24-b1-mrp-netting-bom-explosion-calculation",
        "day": 24,
        "blockNumber": 1,
        "title": "MRP-II Netting & BOM Explosion Formula: $\\text{Components Needed} = (\\text{Gross} - \\text{OnHand} - \\text{Scheduled}) \\times \\text{BOM Multiplier}$",
        "conceptBudget": {
          "primaryConcept": "MRP-II Netting & BOM Explosion Formula",
          "supportingTerms": [
            "Gross Finished Goods Demand ($1,000$ units)",
            "OnHand Inventory ($300$ units)",
            "Scheduled Receipts ($200$ units)",
            "Total Available = $300 + 200 = 500$ units",
            "Net Parent Shortfall = $1,000 - 500 = 500$ units",
            "BOM Multiplier ($4$ sub-components per parent)",
            "Component PO Order = $500 \\times 4 = 2,000$ units"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d23-b1-pert-expected-duration-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "ERP MRP-II Materials Netting & BOM Ledger (500 Net x 4 Components)",
              "boxes": [
                {
                  "label": "Gross Finished Demand",
                  "value": "1,000 Units Finished Product Scheduled in Master Production Schedule",
                  "varType": "Gross",
                  "isUpdated": false
                },
                {
                  "label": "Available Stock (OnHand+PO)",
                  "value": "300 Warehouse Stock + 200 Inbound PO Receipts = 500 Units",
                  "varType": "Available",
                  "isUpdated": false
                },
                {
                  "label": "Net Assembly Shortfall",
                  "value": "1,000 Gross - 500 Available = 500 Parent Units Net Shortfall",
                  "varType": "Net Shortfall",
                  "isUpdated": false
                },
                {
                  "label": "BOM Component PO Order",
                  "value": "500 Net Parents x 4 Multiplier = 2,000 COMPONENTS (MRP NETTING COMPLETE!)",
                  "varType": "PO Order",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "mrp_netting_calc_demo.js",
            "initialCode": "function calculateMrp(gross, onHand, scheduled, multiplier) {\n  const avail = onHand + scheduled;\n  const netParent = Math.max(0, gross - avail);\n  const components = netParent * multiplier;\n  return {\n    gross,\n    avail,\n    netParentShortfall: netParent,\n    componentOrder: components,\n    status: 'MRP_NETTING_COMPLETED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateMrp(1000, 300, 200, 4)));",
            "expectedOutput": "{\"gross\":1000,\"avail\":500,\"netParentShortfall\":500,\"componentOrder\":2000,\"status\":\"MRP_NETTING_COMPLETED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many sub-components must be purchased when Gross demand is 1,000, OnHand is 300, Scheduled receipts is 200, and BOM multiplier is 4 ($ (1,000 - 500) \\times 4 $)?",
          "expectedStringOutput": "2000",
          "acceptableAnswers": [
            "2000",
            "2,000",
            "componentOrder\":2000"
          ],
          "primaryMisconceptionId": "MC_OPS_ERP_SYSTEMS_BOM_EXPLOSION_MRP_NETTING",
          "diagnosisMap": {
            "4000": {
              "misconceptionId": "MC_OPS_ERP_SYSTEMS_BOM_EXPLOSION_MRP_NETTING",
              "errorExplanation": "4000 multiplies gross demand without netting available stock. 500 net parent * 4 = 2,000 components.",
              "recoveryPath": {
                "simplerExplanation": "500 * 4 = 2,000.",
                "guidedFixPrompt": "Type 2000"
              }
            }
          }
        }
      },
      {
        "id": "ops-d24-b2-bom-parent-child-tree-structure",
        "day": 24,
        "blockNumber": 2,
        "title": "Multi-Level Bill of Materials (BOM): Parent-Child Indented Hierarchy",
        "conceptBudget": {
          "primaryConcept": "Indented BOM Architecture",
          "supportingTerms": [
            "Level 0 (Finished End Item)",
            "Level 1 (Sub-Assemblies e.g. Transmission, Chassis)",
            "Level 2 (Raw Components e.g. Gears, Bearings, Screws)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d24-b1-mrp-netting-bom-explosion-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Indented BOM Tree",
            "codeSnippet": "// Level 0: 🛴 Electric Scooter (SKU-100)\n//   Level 1: 🔋 Battery Pack (Qty: 1)\n//     Level 2: ⚡ Lithium Cells (Qty: 40)\n//     Level 2: 🔌 BMS Circuit Board (Qty: 1)\n//   Level 1: 🛞 Motorized Wheel Hub (Qty: 2)\n//     Level 2: ⚙️ Stator & Rotor Magnets (Qty: 1)",
            "lineNotes": {
              "1": "Finished product.",
              "2": "First-tier sub-assembly.",
              "3": "Sub-component raw material.",
              "4": "Control electronics.",
              "5": "Second-tier sub-assembly."
            }
          },
          {
            "type": "runnable_code",
            "filename": "bom_levels_demo.js",
            "initialCode": "function getBomLevelZeroName() {\n  return 'LEVEL_ZERO_FINISHED_SALEABLE_END_ITEM';\n}\n\nconsole.log(getBomLevelZeroName());",
            "expectedOutput": "LEVEL_ZERO_FINISHED_SALEABLE_END_ITEM",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What designation represents the top-tier finished saleable product at the root of an indented Bill of Materials (BOM) hierarchy?",
          "expectedStringOutput": "LEVEL_ZERO_FINISHED_SALEABLE_END_ITEM",
          "acceptableAnswers": [
            "LEVEL_ZERO_FINISHED_SALEABLE_END_ITEM",
            "Level 0",
            "Level Zero"
          ],
          "primaryMisconceptionId": "MC_OPS_ERP_SYSTEMS_BOM_EXPLOSION_MRP_NETTING",
          "diagnosisMap": {
            "LEVEL_1": {
              "misconceptionId": "MC_OPS_ERP_SYSTEMS_BOM_EXPLOSION_MRP_NETTING",
              "errorExplanation": "Level 1 is sub-assemblies. The top-tier root finished item is LEVEL_ZERO_FINISHED_SALEABLE_END_ITEM.",
              "recoveryPath": {
                "simplerExplanation": "Matches LEVEL_ZERO_FINISHED_SALEABLE_END_ITEM.",
                "guidedFixPrompt": "Type LEVEL_ZERO_FINISHED_SALEABLE_END_ITEM"
              }
            }
          }
        }
      },
      {
        "id": "ops-d24-b3-master-production-schedule-mps",
        "day": 24,
        "blockNumber": 3,
        "title": "The Master Production Schedule (MPS): Time Fences & Frozen Horizons",
        "conceptBudget": {
          "primaryConcept": "MPS Time Fences Invariant",
          "supportingTerms": [
            "Frozen Horizon (Next 2 weeks: Zero engineering or schedule changes allowed to ensure line stability)",
            "Slushy Horizon (Weeks 3-8: Minor capacity shifts allowed)",
            "Liquid Horizon (Months 3+: Flexible forecast planning)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d24-b2-bom-parent-child-tree-structure",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "mps_time_fences_demo.js",
            "initialCode": "function getMpsHorizonStatus(weeksOut) {\n  if (weeksOut <= 2) return 'FROZEN_HORIZON_ZERO_SCHEDULE_CHANGES_PERMITTED';\n  if (weeksOut <= 8) return 'SLUSHY_HORIZON_CONTROLLED_MODIFICATIONS_ALLOWED';\n  return 'LIQUID_HORIZON_FLEXIBLE_PLANNING';\n}\n\nconsole.log(getMpsHorizonStatus(1));\nconsole.log(getMpsHorizonStatus(5));",
            "expectedOutput": "FROZEN_HORIZON_ZERO_SCHEDULE_CHANGES_PERMITTED\nSLUSHY_HORIZON_CONTROLLED_MODIFICATIONS_ALLOWED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What MPS time fence designation locks the near-term production schedule against all ad-hoc sales changes to preserve factory line stability?",
          "expectedStringOutput": "FROZEN_HORIZON_ZERO_SCHEDULE_CHANGES_PERMITTED",
          "acceptableAnswers": [
            "FROZEN_HORIZON_ZERO_SCHEDULE_CHANGES_PERMITTED",
            "Frozen Horizon",
            "Frozen time fence"
          ],
          "primaryMisconceptionId": "MC_OPS_ERP_SYSTEMS_BOM_EXPLOSION_MRP_NETTING",
          "diagnosisMap": {
            "LIQUID": {
              "misconceptionId": "MC_OPS_ERP_SYSTEMS_BOM_EXPLOSION_MRP_NETTING",
              "errorExplanation": "Liquid is flexible. Near-term locked schedule is the FROZEN_HORIZON_ZERO_SCHEDULE_CHANGES_PERMITTED.",
              "recoveryPath": {
                "simplerExplanation": "Matches FROZEN_HORIZON_ZERO_SCHEDULE_CHANGES_PERMITTED.",
                "guidedFixPrompt": "Type FROZEN_HORIZON_ZERO_SCHEDULE_CHANGES_PERMITTED"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 25,
    "title": "Working Capital Optimization: Cash Conversion Cycle (CCC = DIO + DSO - DPO)",
    "overviewMetaphor": "Working Capital is the Financial Oxygen Circulating Through Supply Chains: If your raw materials sit in a warehouse for 40 days ($DIO = 40$), customers take 30 days to pay invoices ($DSO = 30$), and you pay suppliers in 45 days ($DPO = 45$), your Cash Conversion Cycle is 25 days ($CCC = 40 + 30 - 45 = 25$ days); keeping CCC under 45 days frees trapped cash, funding growth without taking expensive bank loans.",
    "blocks": [
      {
        "id": "ops-d25-b1-ccc-cash-conversion-cycle-calculation",
        "day": 25,
        "blockNumber": 1,
        "title": "Cash Conversion Cycle (CCC) Equation: $\\text{CCC} = \\text{DIO} + \\text{DSO} - \\text{DPO} \\le 45\\text{ Days}$",
        "conceptBudget": {
          "primaryConcept": "Cash Conversion Cycle Formula",
          "supportingTerms": [
            "Days Inventory Outstanding ($DIO = 40$ days)",
            "Days Sales Outstanding ($DSO = 30$ days)",
            "Days Payable Outstanding ($DPO = 45$ days)",
            "CCC = $40 + 30 - 45 = 25$ days",
            "Lean Working Capital Benchmark: $\\le 45$ days $\\implies$ Lean Working Capital"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d24-b1-mrp-netting-bom-explosion-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Working Capital Cash Conversion Cycle Ledger (DIO=40, DSO=30, DPO=45)",
              "boxes": [
                {
                  "label": "Inventory Holding (DIO)",
                  "value": "40 Days from Raw Material Delivery to Customer Shipment",
                  "varType": "DIO",
                  "isUpdated": false
                },
                {
                  "label": "Receivables Collection (DSO)",
                  "value": "30 Days from Customer Invoice to Cash In Bank",
                  "varType": "DSO",
                  "isUpdated": false
                },
                {
                  "label": "Payables Payment (DPO)",
                  "value": "45 Days Extended Supplier Credit Terms",
                  "varType": "DPO",
                  "isUpdated": false
                },
                {
                  "label": "Cash Conversion Cycle",
                  "value": "40 + 30 - 45 = 25 DAYS (LEAN WORKING CAPITAL FAST CASH CONVERSION <= 45d!)",
                  "varType": "CCC",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "ccc_calc_demo.js",
            "initialCode": "function calculateCcc(dio, dso, dpo) {\n  const ccc = dio + dso - dpo;\n  const isLean = ccc <= 45;\n  return {\n    dio,\n    dso,\n    dpo,\n    cccDays: ccc,\n    isLean,\n    status: isLean ? 'LEAN_WORKING_CAPITAL_FAST_CASH_CONVERSION' : 'TRAPPED_CASH'\n  };\n}\n\nconsole.log(JSON.stringify(calculateCcc(40, 30, 45)));\nconsole.log(JSON.stringify(calculateCcc(90, 60, 30)));",
            "expectedOutput": "{\"dio\":40,\"dso\":30,\"dpo\":45,\"cccDays\":25,\"isLean\":true,\"status\":\"LEAN_WORKING_CAPITAL_FAST_CASH_CONVERSION\"}\n{\"dio\":90,\"dso\":60,\"dpo\":30,\"cccDays\":120,\"isLean\":false,\"status\":\"TRAPPED_CASH\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Cash Conversion Cycle (CCC) in days when DIO is 40 days, DSO is 30 days, and DPO is 45 days ($40 + 30 - 45$)?",
          "expectedStringOutput": "25",
          "acceptableAnswers": [
            "25",
            "25 days",
            "cccDays\":25"
          ],
          "primaryMisconceptionId": "MC_OPS_WORKING_CAPITAL_CASH_CONVERSION_CYCLE",
          "diagnosisMap": {
            "115": {
              "misconceptionId": "MC_OPS_WORKING_CAPITAL_CASH_CONVERSION_CYCLE",
              "errorExplanation": "115 adds DPO instead of subtracting it. CCC = DIO + DSO - DPO = 25 days.",
              "recoveryPath": {
                "simplerExplanation": "40 + 30 - 45 = 25.",
                "guidedFixPrompt": "Type 25"
              }
            }
          }
        }
      },
      {
        "id": "ops-d25-b2-negative-working-capital-amazon-model",
        "day": 25,
        "blockNumber": 2,
        "title": "Negative Cash Conversion Cycle: Operating on Supplier Financing",
        "conceptBudget": {
          "primaryConcept": "Negative CCC Dynamics",
          "supportingTerms": [
            "Negative CCC ($DIO=15, DSO=5, DPO=60 \\implies CCC = 15+5-60 = -40$ days: Company collects cash from customers 40 days before paying suppliers, generating infinite working capital float e.g. Amazon, Dell, Walmart)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d25-b1-ccc-cash-conversion-cycle-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Negative CCC Cash Engine",
            "codeSnippet": "// Day 0:  Inbound inventory received from supplier (60-day payment term)\n// Day 15: Customer purchases product and pays with instant credit card\n// Day 20: Cash deposited into company bank account\n// Day 60: Company pays supplier invoice -> 40 DAYS OF FREE WORKING CAPITAL FLOAT!",
            "lineNotes": {
              "1": "Supplier credit.",
              "2": "Fast inventory turn.",
              "3": "Immediate cash intake.",
              "4": "Delayed payable settlement."
            }
          },
          {
            "type": "runnable_code",
            "filename": "negative_ccc_demo.js",
            "initialCode": "function getNegativeCccImplication() {\n  return 'SUPPLIERS_AND_CUSTOMERS_FINANCE_THE_BUSINESS_OPERATIONS';\n}\n\nconsole.log(getNegativeCccImplication());",
            "expectedOutput": "SUPPLIERS_AND_CUSTOMERS_FINANCE_THE_BUSINESS_OPERATIONS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What business financing dynamic occurs when an enterprise achieves a negative Cash Conversion Cycle (such as Amazon or Walmart)?",
          "expectedStringOutput": "SUPPLIERS_AND_CUSTOMERS_FINANCE_THE_BUSINESS_OPERATIONS",
          "acceptableAnswers": [
            "SUPPLIERS_AND_CUSTOMERS_FINANCE_THE_BUSINESS_OPERATIONS",
            "Suppliers finance operations",
            "Negative CCC float"
          ],
          "primaryMisconceptionId": "MC_OPS_WORKING_CAPITAL_CASH_CONVERSION_CYCLE",
          "diagnosisMap": {
            "BANK_LOAN": {
              "misconceptionId": "MC_OPS_WORKING_CAPITAL_CASH_CONVERSION_CYCLE",
              "errorExplanation": "Negative CCC eliminates bank debt: SUPPLIERS_AND_CUSTOMERS_FINANCE_THE_BUSINESS_OPERATIONS.",
              "recoveryPath": {
                "simplerExplanation": "Matches SUPPLIERS_AND_CUSTOMERS_FINANCE_THE_BUSINESS_OPERATIONS.",
                "guidedFixPrompt": "Type SUPPLIERS_AND_CUSTOMERS_FINANCE_THE_BUSINESS_OPERATIONS"
              }
            }
          }
        }
      },
      {
        "id": "ops-d25-b3-reverse-factoring-supply-chain-finance",
        "day": 25,
        "blockNumber": 3,
        "title": "Supply Chain Finance & Reverse Factoring: Dynamic Discounting",
        "conceptBudget": {
          "primaryConcept": "Reverse Factoring Mechanics",
          "supportingTerms": [
            "Reverse Factoring (Bank pays supplier on Day 10 at small discount based on enterprise buyer AAA credit rating, buyer settles with bank on Day 90)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d25-b2-negative-working-capital-amazon-model",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "reverse_factoring_demo.js",
            "initialCode": "function getReverseFactoringBenefit() {\n  return 'SUPPLIER_GETS_EARLY_CASH_AND_BUYER_EXTENDS_PAYABLE_TERMS';\n}\n\nconsole.log(getReverseFactoringBenefit());",
            "expectedOutput": "SUPPLIER_GETS_EARLY_CASH_AND_BUYER_EXTENDS_PAYABLE_TERMS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What mutual benefit is unlocked when an enterprise implements bank-backed Reverse Factoring across its supply chain?",
          "expectedStringOutput": "SUPPLIER_GETS_EARLY_CASH_AND_BUYER_EXTENDS_PAYABLE_TERMS",
          "acceptableAnswers": [
            "SUPPLIER_GETS_EARLY_CASH_AND_BUYER_EXTENDS_PAYABLE_TERMS",
            "Early cash for supplier extended terms for buyer"
          ],
          "primaryMisconceptionId": "MC_OPS_WORKING_CAPITAL_CASH_CONVERSION_CYCLE",
          "diagnosisMap": {
            "SUPPLIER_DEBT": {
              "misconceptionId": "MC_OPS_WORKING_CAPITAL_CASH_CONVERSION_CYCLE",
              "errorExplanation": "Reverse factoring benefits both: SUPPLIER_GETS_EARLY_CASH_AND_BUYER_EXTENDS_PAYABLE_TERMS.",
              "recoveryPath": {
                "simplerExplanation": "Matches SUPPLIER_GETS_EARLY_CASH_AND_BUYER_EXTENDS_PAYABLE_TERMS.",
                "guidedFixPrompt": "Type SUPPLIER_GETS_EARLY_CASH_AND_BUYER_EXTENDS_PAYABLE_TERMS"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 26,
    "title": "Quality Certifications: ISO 9001:2015 & Stage 1/Stage 2 Audit Closure",
    "overviewMetaphor": "ISO 9001 Certification is the Gold Passport of Global Commerce: Large enterprise and government clients will not even open your proposal without certified Quality Management Systems (QMS); closing all audit findings (0 Major Non-Conformances and 100% Minor NCs resolved within 60 days) following the Plan-Do-Check-Act (PDCA) cycle unlocks official ISO 9001:2015 certification.",
    "blocks": [
      {
        "id": "ops-d26-b1-iso-9001-audit-nc-closure-audit",
        "day": 26,
        "blockNumber": 1,
        "title": "ISO 9001:2015 Audit Certification Standard: 0 Major NCs & 100% Minor NCs Resolved",
        "conceptBudget": {
          "primaryConcept": "ISO 9001 Audit Pass Standard",
          "supportingTerms": [
            "Major Non-Conformance Count ($0$ open)",
            "Minor Non-Conformance Resolution Rate ($100.0\\%$)",
            "Certification Status: ISO 9001:2015 QMS Certification Recommended"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d25-b1-ccc-cash-conversion-cycle-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "ISO 9001:2015 Stage 2 Certification Audit Ledger",
              "boxes": [
                {
                  "label": "Major Non-Conformances",
                  "value": "0 Major Systemic Deficiencies Detected by Registrar Auditor",
                  "varType": "Major NCs",
                  "isUpdated": false
                },
                {
                  "label": "Minor NC Resolution",
                  "value": "100.0% Corrective Action Plans Verified & Closed within 60 Days",
                  "varType": "Minor NCs",
                  "isUpdated": false
                },
                {
                  "label": "Registrar Recommendation",
                  "value": "ISO 9001 2015 QMS CERTIFICATION RECOMMENDED NOMINAL!",
                  "varType": "Status",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "iso_audit_calc_demo.js",
            "initialCode": "function auditIso(majorOpen, minorResolvedPct) {\n  const isPassed = majorOpen === 0 && minorResolvedPct === 100.0;\n  return {\n    majorOpen,\n    minorResolvedPct,\n    isPassed,\n    status: isPassed ? 'ISO_9001_2015_QMS_CERTIFICATION_RECOMMENDED' : 'CERTIFICATION_BLOCKED'\n  };\n}\n\nconsole.log(JSON.stringify(auditIso(0, 100.0)));\nconsole.log(JSON.stringify(auditIso(1, 100.0)));",
            "expectedOutput": "{\"majorOpen\":0,\"minorResolvedPct\":100,\"isPassed\":true,\"status\":\"ISO_9001_2015_QMS_CERTIFICATION_RECOMMENDED\"}\n{\"majorOpen\":1,\"minorResolvedPct\":100,\"isPassed\":false,\"status\":\"CERTIFICATION_BLOCKED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification outcome is awarded when an ISO 9001:2015 Stage 2 audit records 0 Major Non-Conformances and 100% resolved Minor Non-Conformances?",
          "expectedStringOutput": "ISO_9001_2015_QMS_CERTIFICATION_RECOMMENDED",
          "acceptableAnswers": [
            "ISO_9001_2015_QMS_CERTIFICATION_RECOMMENDED",
            "ISO Certified",
            "Certification Recommended"
          ],
          "primaryMisconceptionId": "MC_OPS_QUALITY_CERTIFICATIONS_ISO_9001_AUDITS",
          "diagnosisMap": {
            "BLOCKED": {
              "misconceptionId": "MC_OPS_QUALITY_CERTIFICATIONS_ISO_9001_AUDITS",
              "errorExplanation": "With 0 Major NCs, certification is granted: ISO_9001_2015_QMS_CERTIFICATION_RECOMMENDED.",
              "recoveryPath": {
                "simplerExplanation": "Matches ISO_9001_2015_QMS_CERTIFICATION_RECOMMENDED.",
                "guidedFixPrompt": "Type ISO_9001_2015_QMS_CERTIFICATION_RECOMMENDED"
              }
            }
          }
        }
      },
      {
        "id": "ops-d26-b2-pdca-deming-wheel",
        "day": 26,
        "blockNumber": 2,
        "title": "The PDCA (Plan-Do-Check-Act) Deming Continuous Improvement Cycle",
        "conceptBudget": {
          "primaryConcept": "PDCA Deming Cycle",
          "supportingTerms": [
            "P (Plan: Establish process objectives & risks)",
            "D (Do: Implement processes)",
            "C (Check: Monitor & measure results against policy)",
            "A (Act: Take corrective actions to continually improve performance)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d26-b1-iso-9001-audit-nc-closure-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "PDCA Framework Cycle",
            "codeSnippet": "// PLAN:  Set quality target: 'Maintain defect rate < 50 PPM'\n// DO:    Deploy automated laser measuring calibration on assembly line\n// CHECK: Weekly SPC control charts verify average defect rate is 18 PPM\n// ACT:   Standardize laser calibration SOP across all 4 production plants!",
            "lineNotes": {
              "1": "Target setting.",
              "2": "Execution.",
              "3": "Verification.",
              "4": "Standardization."
            }
          },
          {
            "type": "runnable_code",
            "filename": "pdca_demo.js",
            "initialCode": "function getPdcaPillars() {\n  return ['PLAN', 'DO', 'CHECK', 'ACT'];\n}\n\nconsole.log(JSON.stringify(getPdcaPillars()));",
            "expectedOutput": "[\"PLAN\",\"DO\",\"CHECK\",\"ACT\"]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the full form sequence of the 4 continuous improvement stages in the Deming Cycle underpinning ISO 9001 QMS?",
          "expectedStringOutput": "PLAN_DO_CHECK_ACT",
          "acceptableAnswers": [
            "PLAN_DO_CHECK_ACT",
            "Plan Do Check Act",
            "PDCA"
          ],
          "primaryMisconceptionId": "MC_OPS_QUALITY_CERTIFICATIONS_ISO_9001_AUDITS",
          "diagnosisMap": {
            "DMAIC": {
              "misconceptionId": "MC_OPS_QUALITY_CERTIFICATIONS_ISO_9001_AUDITS",
              "errorExplanation": "DMAIC is Six Sigma. Deming cycle is PLAN_DO_CHECK_ACT.",
              "recoveryPath": {
                "simplerExplanation": "Matches PLAN_DO_CHECK_ACT.",
                "guidedFixPrompt": "Type PLAN_DO_CHECK_ACT"
              }
            }
          }
        }
      },
      {
        "id": "ops-d26-b3-stage1-vs-stage2-audit-readiness",
        "day": 26,
        "blockNumber": 3,
        "title": "Stage 1 (Documentation Review) vs Stage 2 (On-Site Execution) Audits",
        "conceptBudget": {
          "primaryConcept": "Stage 1 vs Stage 2 Audit Scope",
          "supportingTerms": [
            "Stage 1 Audit (Desktop review of Quality Manual, SOPs, and internal audit records)",
            "Stage 2 Audit (On-site interviews with machine operators, sampling production lots, verifying real-world compliance)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d26-b2-pdca-deming-wheel",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "audit_stages_demo.js",
            "initialCode": "function getAuditStageScope(stage) {\n  return stage === 1\n    ? 'STAGE_1_DOCUMENTATION_AND_QMS_READINESS_REVIEW'\n    : 'STAGE_2_ON_SITE_IMPLEMENTATION_AND_OPERATIONAL_AUDIT';\n}\n\nconsole.log(getAuditStageScope(1));\nconsole.log(getAuditStageScope(2));",
            "expectedOutput": "STAGE_1_DOCUMENTATION_AND_QMS_READINESS_REVIEW\nSTAGE_2_ON_SITE_IMPLEMENTATION_AND_OPERATIONAL_AUDIT",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the primary scope of an ISO 9001 Stage 1 preliminary audit conducted prior to the full certification assessment?",
          "expectedStringOutput": "STAGE_1_DOCUMENTATION_AND_QMS_READINESS_REVIEW",
          "acceptableAnswers": [
            "STAGE_1_DOCUMENTATION_AND_QMS_READINESS_REVIEW",
            "Documentation review",
            "Stage 1 readiness review"
          ],
          "primaryMisconceptionId": "MC_OPS_QUALITY_CERTIFICATIONS_ISO_9001_AUDITS",
          "diagnosisMap": {
            "ON_SITE": {
              "misconceptionId": "MC_OPS_QUALITY_CERTIFICATIONS_ISO_9001_AUDITS",
              "errorExplanation": "On-site sampling is Stage 2. Stage 1 is STAGE_1_DOCUMENTATION_AND_QMS_READINESS_REVIEW.",
              "recoveryPath": {
                "simplerExplanation": "Matches STAGE_1_DOCUMENTATION_AND_QMS_READINESS_REVIEW.",
                "guidedFixPrompt": "Type STAGE_1_DOCUMENTATION_AND_QMS_READINESS_REVIEW"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 27,
    "title": "Supply Chain Resilience & Nearshoring: Dual-Sourcing Resilience Index",
    "overviewMetaphor": "Supply Chain Resilience is Having Two Engines on an Airplane: Relying on a single factory across the Pacific creates catastrophic vulnerability to geopolitical trade wars and maritime port strikes; calculating a Supply Chain Resilience Index ($SCRI = 0.5(\\text{Dual-Source } 90) + 0.3(\\text{Buffer } 80) + 0.2(\\text{Nearshore } 85) = 45 + 24 + 17 = 86.0 \\ge 80.0$) proves your operations can absorb global shocks without disrupting customer deliveries.",
    "blocks": [
      {
        "id": "ops-d27-b1-scri-resilience-index-calculation",
        "day": 27,
        "blockNumber": 1,
        "title": "Supply Chain Resilience Index (SCRI) Formula: $\\text{SCRI} = 0.5(DS) + 0.3(BS) + 0.2(NS) \\ge 80.0$",
        "conceptBudget": {
          "primaryConcept": "SCRI Composite Formula",
          "supportingTerms": [
            "Dual-Sourcing Coverage ($DS = 90.0\\% \\implies 45.0$ pts)",
            "Buffer Inventory Score ($BS = 80.0\\% \\implies 24.0$ pts)",
            "Nearshoring Volume Share ($NS = 85.0\\% \\implies 17.0$ pts)",
            "SCRI = $45.0 + 24.0 + 17.0 = 86.0$",
            "Resilient Standard: $\\ge 80.0 \\implies$ Resilient De-risked Supply Chain"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d26-b1-iso-9001-audit-nc-closure-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Supply Chain Resilience Scorecard Ledger (SCRI = 86.0)",
              "boxes": [
                {
                  "label": "Dual-Sourcing (50% Wt)",
                  "value": "90.0% Critical Parts Sourced from 2+ Independent Vendors (45.0 pts)",
                  "varType": "Dual Sourcing",
                  "isUpdated": false
                },
                {
                  "label": "Buffer Stock (30% Wt)",
                  "value": "80.0% Strategic Inventory Health Score (24.0 pts)",
                  "varType": "Buffer",
                  "isUpdated": false
                },
                {
                  "label": "Nearshoring (20% Wt)",
                  "value": "85.0% Production Located within Continental Trade Bloc (17.0 pts)",
                  "varType": "Nearshoring",
                  "isUpdated": false
                },
                {
                  "label": "Composite SCRI Rating",
                  "value": "45 + 24 + 17 = 86.0 (RESILIENT DE-RISKED MULTI-TIER SUPPLY CHAIN >= 80.0!)",
                  "varType": "SCRI",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "scri_calc_demo.js",
            "initialCode": "function calculateScri(ds, bs, ns) {\n  const scri = (ds * 0.5) + (bs * 0.3) + (ns * 0.2);\n  const isResilient = scri >= 80.0;\n  return {\n    ds,\n    bs,\n    ns,\n    scriScore: Number(scri.toFixed(1)),\n    isResilient,\n    status: isResilient ? 'RESILIENT_DE_RISKED_MULTI_TIER_SUPPLY_CHAIN' : 'CONCENTRATION_RISK'\n  };\n}\n\nconsole.log(JSON.stringify(calculateScri(90, 80, 85)));",
            "expectedOutput": "{\"ds\":90,\"bs\":80,\"ns\":85,\"scriScore\":86,\"isResilient\":true,\"status\":\"RESILIENT_DE_RISKED_MULTI_TIER_SUPPLY_CHAIN\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Supply Chain Resilience Index (SCRI) score when Dual Sourcing is 90%, Buffer Score is 80%, and Nearshoring is 85% ($0.5(90) + 0.3(80) + 0.2(85)$)?",
          "expectedStringOutput": "86",
          "acceptableAnswers": [
            "86",
            "86.0",
            "scriScore\":86"
          ],
          "primaryMisconceptionId": "MC_OPS_SUPPLY_CHAIN_RESILIENCE_NEARSHORING",
          "diagnosisMap": {
            "85": {
              "misconceptionId": "MC_OPS_SUPPLY_CHAIN_RESILIENCE_NEARSHORING",
              "errorExplanation": "85 is simple average. Weighted formula: 45 + 24 + 17 = 86.0.",
              "recoveryPath": {
                "simplerExplanation": "45 + 24 + 17 = 86.0.",
                "guidedFixPrompt": "Type 86"
              }
            }
          }
        }
      },
      {
        "id": "ops-d27-b2-china-plus-one-strategy",
        "day": 27,
        "blockNumber": 2,
        "title": "The China+1 Sourcing Strategy: Diversifying Manufacturing Footprints",
        "conceptBudget": {
          "primaryConcept": "China+1 Diversification Strategy",
          "supportingTerms": [
            "China+1 (Maintaining cost-efficient Chinese manufacturing while establishing secondary facilities in India, Vietnam, Mexico, or Poland to hedge tariff and geopolitical disruption risk)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d27-b1-scri-resilience-index-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "China+1 Geographic Split",
            "codeSnippet": "// PRIMARY HUB (Shenzhen, China):  High-volume standard sub-assembly (65% volume)\n// BACKUP HUB (Vietnam / India):     Mirror manufacturing tooling ready to scale (35% volume)\n// TARIFF / DISRUPTION RESILIENCE:  Can redirect 100% capacity within 14 days without retooling!",
            "lineNotes": {
              "1": "Low cost primary base.",
              "2": "Geopolitical hedge base.",
              "3": "Agile production rerouting."
            }
          },
          {
            "type": "runnable_code",
            "filename": "china_plus_demo.js",
            "initialCode": "function getChinaPlusName() {\n  return 'CHINA_PLUS_ONE_DIVERSIFICATION_STRATEGY';\n}\n\nconsole.log(getChinaPlusName());",
            "expectedOutput": "CHINA_PLUS_ONE_DIVERSIFICATION_STRATEGY",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What global procurement strategy diversifies manufacturing outside a single country to mitigate regional concentration risks?",
          "expectedStringOutput": "CHINA_PLUS_ONE_DIVERSIFICATION_STRATEGY",
          "acceptableAnswers": [
            "CHINA_PLUS_ONE_DIVERSIFICATION_STRATEGY",
            "China Plus One",
            "China+1"
          ],
          "primaryMisconceptionId": "MC_OPS_SUPPLY_CHAIN_RESILIENCE_NEARSHORING",
          "diagnosisMap": {
            "OFFSHORING": {
              "misconceptionId": "MC_OPS_SUPPLY_CHAIN_RESILIENCE_NEARSHORING",
              "errorExplanation": "Offshoring to one country creates single-point risk. The diversification model is CHINA_PLUS_ONE_DIVERSIFICATION_STRATEGY.",
              "recoveryPath": {
                "simplerExplanation": "Matches CHINA_PLUS_ONE_DIVERSIFICATION_STRATEGY.",
                "guidedFixPrompt": "Type CHINA_PLUS_ONE_DIVERSIFICATION_STRATEGY"
              }
            }
          }
        }
      },
      {
        "id": "ops-d27-b3-nearshoring-logistics-tradeoffs",
        "day": 27,
        "blockNumber": 3,
        "title": "Nearshoring Logistics Tradeoffs: Lead Time vs Unit Labor Cost",
        "conceptBudget": {
          "primaryConcept": "Nearshoring Tradeoff Analysis",
          "supportingTerms": [
            "Nearshoring (Moving production to neighboring countries e.g. Mexico/Eastern Europe: Compresses ocean transit from 35 days to 3 days truck drayage, slashing working capital inventory)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d27-b2-china-plus-one-strategy",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "nearshore_transit_demo.js",
            "initialCode": "function compareTransitDays(mode) {\n  return mode === 'NEARSHORE_TRUCK'\n    ? 'THREE_DAYS_HIGH_AGILITY_TRANSIT'\n    : 'THIRTY_FIVE_DAYS_OCEAN_TRANSIT';\n}\n\nconsole.log(compareTransitDays('NEARSHORE_TRUCK'));",
            "expectedOutput": "THREE_DAYS_HIGH_AGILITY_TRANSIT",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What transit speed advantage is gained by nearshoring manufacturing to regional neighbors connected by direct highway freight?",
          "expectedStringOutput": "THREE_DAYS_HIGH_AGILITY_TRANSIT",
          "acceptableAnswers": [
            "THREE_DAYS_HIGH_AGILITY_TRANSIT",
            "3 days transit",
            "3-day agility transit"
          ],
          "primaryMisconceptionId": "MC_OPS_SUPPLY_CHAIN_RESILIENCE_NEARSHORING",
          "diagnosisMap": {
            "OCEAN": {
              "misconceptionId": "MC_OPS_SUPPLY_CHAIN_RESILIENCE_NEARSHORING",
              "errorExplanation": "Ocean freight takes 35+ days. Nearshoring achieves THREE_DAYS_HIGH_AGILITY_TRANSIT.",
              "recoveryPath": {
                "simplerExplanation": "Matches THREE_DAYS_HIGH_AGILITY_TRANSIT.",
                "guidedFixPrompt": "Type THREE_DAYS_HIGH_AGILITY_TRANSIT"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 28,
    "title": "Sustainable Procurement & Scope 3 Auditing: Carbon & EUDR Deforestation Compliance",
    "overviewMetaphor": "Sustainable Procurement is an Environmental Passport for Global Market Access: Under strict new international laws like the EU Deforestation Regulation (EUDR), entering European markets requires GPS satellite coordinates proving timber, coffee, and cocoa were not grown on deforested land; verifying supplier ESG scores $\\ge 80$, GPS geolocation traceability, and zero-child-labor certifications protects your enterprise from customs seizures and brand destruction.",
    "blocks": [
      {
        "id": "ops-d28-b1-sustainable-procurement-audit",
        "day": 28,
        "blockNumber": 1,
        "title": "Sustainable Procurement Audit: Supplier ESG ($\\ge 80$), EUDR GPS Traceability & Fair Labor",
        "conceptBudget": {
          "primaryConcept": "Sustainable Procurement Standard",
          "supportingTerms": [
            "Supplier ESG Rating ($85 \\ge 80$)",
            "EUDR GPS Geolocation Traceability Verified",
            "Fair Labor Zero-Child-Labor Certified",
            "Status: Sustainable Scope 3 Supplier Approved"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d27-b1-scri-resilience-index-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Scope 3 ESG & EUDR Deforestation Sourcing Ledger",
              "boxes": [
                {
                  "label": "Supplier ESG Rating",
                  "value": "85 / 100 Audit Score (Exceeds Minimum 80 Point ESG Sourcing Bar)",
                  "varType": "ESG",
                  "isUpdated": false
                },
                {
                  "label": "EUDR Deforestation GPS",
                  "value": "100% Raw Material Plots Tagged with Satellite GPS Coordinates",
                  "varType": "GPS",
                  "isUpdated": false
                },
                {
                  "label": "Fair Labor Certification",
                  "value": "Third-Party SA8000 Social Accountability Audit Cleared",
                  "varType": "Labor",
                  "isUpdated": false
                },
                {
                  "label": "Procurement Approval",
                  "value": "SUSTAINABLE SCOPE 3 SUPPLIER APPROVED NOMINAL!",
                  "varType": "Status",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "sustainable_procurement_calc_demo.js",
            "initialCode": "function auditSustainableProcurement(esg, gps, labor) {\n  const isApproved = esg >= 80 && gps && labor;\n  return {\n    esg,\n    gps,\n    labor,\n    isApproved,\n    status: isApproved ? 'SUSTAINABLE_SCOPE_3_SUPPLIER_APPROVED' : 'ESG_DEFICIT'\n  };\n}\n\nconsole.log(JSON.stringify(auditSustainableProcurement(85, true, true)));\nconsole.log(JSON.stringify(auditSustainableProcurement(60, true, true)));",
            "expectedOutput": "{\"esg\":85,\"gps\":true,\"labor\":true,\"isApproved\":true,\"status\":\"SUSTAINABLE_SCOPE_3_SUPPLIER_APPROVED\"}\n{\"esg\":60,\"gps\":true,\"labor\":true,\"isApproved\":false,\"status\":\"ESG_DEFICIT\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What procurement certification status is confirmed when a vendor records an ESG score of 85, verified EUDR GPS traceability, and fair labor certification?",
          "expectedStringOutput": "SUSTAINABLE_SCOPE_3_SUPPLIER_APPROVED",
          "acceptableAnswers": [
            "SUSTAINABLE_SCOPE_3_SUPPLIER_APPROVED",
            "Sustainable Supplier Approved",
            "Scope 3 Approved"
          ],
          "primaryMisconceptionId": "MC_OPS_SUSTAINABLE_PROCUREMENT_SCOPE_3_AUDITING",
          "diagnosisMap": {
            "DEFICIT": {
              "misconceptionId": "MC_OPS_SUSTAINABLE_PROCUREMENT_SCOPE_3_AUDITING",
              "errorExplanation": "All 3 criteria pass, confirming SUSTAINABLE_SCOPE_3_SUPPLIER_APPROVED.",
              "recoveryPath": {
                "simplerExplanation": "Matches SUSTAINABLE_SCOPE_3_SUPPLIER_APPROVED.",
                "guidedFixPrompt": "Type SUSTAINABLE_SCOPE_3_SUPPLIER_APPROVED"
              }
            }
          }
        }
      },
      {
        "id": "ops-d28-b2-eudr-satellite-geolocation-mandate",
        "day": 28,
        "blockNumber": 2,
        "title": "EU Deforestation Regulation (EUDR): Satellite Polygon Geolocation Mandates",
        "conceptBudget": {
          "primaryConcept": "EUDR GPS Geolocation Mandate",
          "supportingTerms": [
            "EUDR (EU Deforestation Regulation: Requires exact GPS polygon coordinates for land plots where cattle, cocoa, coffee, oil palm, rubber, soya, and wood are harvested to ensure zero deforestation after Dec 31, 2020)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d28-b1-sustainable-procurement-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "EUDR Due Diligence Statement (DDS)",
            "codeSnippet": "// PLOT ID:      BR-PA-88491 (Pará, Brazil Soy Plantation)\n// GPS POLYGON:  -3.4168° S, -52.0015° W (Validated against Copernicus Sentinel Satellite)\n// CUTOFF DATE:  Zero forest cleared after December 31, 2020\n// DDS CLEARANCE: Due Diligence Statement submitted to EU Customs Information System",
            "lineNotes": {
              "1": "Farm plot identifier.",
              "2": "Satellite GPS coordinates.",
              "3": "Statutory deforestation cutoff.",
              "4": "EU customs clearance."
            }
          },
          {
            "type": "runnable_code",
            "filename": "eudr_demo.js",
            "initialCode": "function getEudrCutoffStandard() {\n  return 'DECEMBER_THIRTY_FIRST_TWENTY_TWENTY_ZERO_DEFORESTATION_CUTOFF';\n}\n\nconsole.log(getEudrCutoffStandard());",
            "expectedOutput": "DECEMBER_THIRTY_FIRST_TWENTY_TWENTY_ZERO_DEFORESTATION_CUTOFF",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What statutory baseline cutoff date is established under the EUDR after which commodities harvested on deforested land are banned from EU trade?",
          "expectedStringOutput": "DECEMBER_THIRTY_FIRST_TWENTY_TWENTY_ZERO_DEFORESTATION_CUTOFF",
          "acceptableAnswers": [
            "DECEMBER_THIRTY_FIRST_TWENTY_TWENTY_ZERO_DEFORESTATION_CUTOFF",
            "December 31 2020",
            "Dec 31 2020"
          ],
          "primaryMisconceptionId": "MC_OPS_SUSTAINABLE_PROCUREMENT_SCOPE_3_AUDITING",
          "diagnosisMap": {
            "2030": {
              "misconceptionId": "MC_OPS_SUSTAINABLE_PROCUREMENT_SCOPE_3_AUDITING",
              "errorExplanation": "2030 is too late. The EUDR legally enforces the DECEMBER_THIRTY_FIRST_TWENTY_TWENTY_ZERO_DEFORESTATION_CUTOFF.",
              "recoveryPath": {
                "simplerExplanation": "Matches DECEMBER_THIRTY_FIRST_TWENTY_TWENTY_ZERO_DEFORESTATION_CUTOFF.",
                "guidedFixPrompt": "Type DECEMBER_THIRTY_FIRST_TWENTY_TWENTY_ZERO_DEFORESTATION_CUTOFF"
              }
            }
          }
        }
      },
      {
        "id": "ops-d28-b3-conflict-minerals-dodd-frank",
        "day": 28,
        "blockNumber": 3,
        "title": "Conflict Minerals & Responsible Sourcing: 3TG Audit Standards",
        "conceptBudget": {
          "primaryConcept": "3TG Responsible Sourcing",
          "supportingTerms": [
            "3TG (Tin, Tantalum, Tungsten, Gold: Dodd-Frank Section 1502 mandatory supply chain smelter validation and OECD Due Diligence)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d28-b2-eudr-satellite-geolocation-mandate",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "three_tg_demo.js",
            "initialCode": "function getThreeTgMinerals() {\n  return ['TIN', 'TANTALUM', 'TUNGSTEN', 'GOLD'];\n}\n\nconsole.log(JSON.stringify(getThreeTgMinerals()));",
            "expectedOutput": "[\"TIN\",\"TANTALUM\",\"TUNGSTEN\",\"GOLD\"]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which four strategic industrial metals comprise the legally audited '3TG' Conflict Minerals classification?",
          "expectedStringOutput": "[\"TIN\",\"TANTALUM\",\"TUNGSTEN\",\"GOLD\"]",
          "acceptableAnswers": [
            "[\"TIN\",\"TANTALUM\",\"TUNGSTEN\",\"GOLD\"]",
            "Tin Tantalum Tungsten Gold",
            "3TG Minerals"
          ],
          "primaryMisconceptionId": "MC_OPS_SUSTAINABLE_PROCUREMENT_SCOPE_3_AUDITING",
          "diagnosisMap": {
            "STEEL": {
              "misconceptionId": "MC_OPS_SUSTAINABLE_PROCUREMENT_SCOPE_3_AUDITING",
              "errorExplanation": "3TG refers strictly to [\"TIN\",\"TANTALUM\",\"TUNGSTEN\",\"GOLD\"].",
              "recoveryPath": {
                "simplerExplanation": "Matches [\"TIN\",\"TANTALUM\",\"TUNGSTEN\",\"GOLD\"].",
                "guidedFixPrompt": "Type [\"TIN\",\"TANTALUM\",\"TUNGSTEN\",\"GOLD\"]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 29,
    "title": "AI & Autonomous Operations: Computer Vision Quality & Predictive Maintenance",
    "overviewMetaphor": "Industry 4.0 AI Operations is a Self-Healing Digital Nervous System: Instead of human inspectors squinting at circuit boards, high-speed Computer Vision cameras inspect 100 components per second with 99.0% optical accuracy; simultaneously, AI predictive maintenance models analyzing IoT vibration telemetry predict motor bearing failure 12 days before breakdown ($Score = (99.0 \\times 0.7) + (12 \\times 2.0) = 69.3 + 24.0 = 93.3 \\ge 90.0$), elevating the factory into Tier-1 autonomous operational excellence.",
    "blocks": [
      {
        "id": "ops-d29-b1-autonomous-ai-ops-score-calculation",
        "day": 29,
        "blockNumber": 1,
        "title": "Autonomous Operations Composite Score: $\\text{Score} = (\\text{CV Acc} \\times 0.7) + (\\text{Lead Days} \\times 2.0) \\ge 90.0$",
        "conceptBudget": {
          "primaryConcept": "Autonomous Operations Formula",
          "supportingTerms": [
            "Computer Vision Optical Accuracy ($99.0\\% \\implies 69.3$ pts)",
            "AI Maintenance Lead Days ($12$ days $\\implies 24.0$ pts)",
            "Autonomous Ops Score = $69.3 + 24.0 = 93.3$",
            "Elite Industry 4.0 Standard: $\\ge 90.0 \\implies$ Tier-1 Autonomous AI Operations Active"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d28-b1-sustainable-procurement-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Industry 4.0 Autonomous Operations Scorecard (Score = 93.3)",
              "boxes": [
                {
                  "label": "Computer Vision Accuracy",
                  "value": "99.0% Optical PCB Micro-Defect Recognition Accuracy (69.3 pts)",
                  "varType": "CV Accuracy",
                  "isUpdated": false
                },
                {
                  "label": "AI Predictive Maintenance",
                  "value": "12 Days Advance Warning on CNC Spindle Vibration Anomalies (24.0 pts)",
                  "varType": "AI Lead Time",
                  "isUpdated": false
                },
                {
                  "label": "Autonomous Operations Score",
                  "value": "69.3 + 24.0 = 93.3 (TIER 1 AUTONOMOUS AI OPERATIONS ACTIVE >= 90.0!)",
                  "varType": "Score",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "autonomous_ops_calc_demo.js",
            "initialCode": "function evaluateAutonomousOps(cvAcc, leadDays) {\n  const score = (cvAcc * 0.7) + (leadDays * 2.0);\n  const isElite = score >= 90.0;\n  return {\n    cvAcc,\n    leadDays,\n    autonomousScore: Number(score.toFixed(1)),\n    isElite,\n    status: isElite ? 'TIER_1_AUTONOMOUS_AI_OPERATIONS_ACTIVE' : 'SUB_OPTIMAL'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateAutonomousOps(99.0, 12)));",
            "expectedOutput": "{\"cvAcc\":99,\"leadDays\":12,\"autonomousScore\":93.3,\"isElite\":true,\"status\":\"TIER_1_AUTONOMOUS_AI_OPERATIONS_ACTIVE\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Autonomous AI Operations score when Computer Vision accuracy is 99% and AI predictive maintenance delivers 12 days advance warning ($ (99 \\times 0.7) + (12 \\times 2) $)?",
          "expectedStringOutput": "93.3",
          "acceptableAnswers": [
            "93.3",
            "autonomousScore\":93.3"
          ],
          "primaryMisconceptionId": "MC_OPS_AI_AUTONOMOUS_OPERATIONS_PREDICTIVE_OPS",
          "diagnosisMap": {
            "111": {
              "misconceptionId": "MC_OPS_AI_AUTONOMOUS_OPERATIONS_PREDICTIVE_OPS",
              "errorExplanation": "111 adds the numbers unweighted (99 + 12). Weighted formula: 69.3 + 24.0 = 93.3.",
              "recoveryPath": {
                "simplerExplanation": "69.3 + 24.0 = 93.3.",
                "guidedFixPrompt": "Type 93.3"
              }
            }
          }
        }
      },
      {
        "id": "ops-d29-b2-digital-twin-manufacturing-simulation",
        "day": 29,
        "blockNumber": 2,
        "title": "Digital Twins: Real-Time Telemetry Simulation & Bottleneck Stress Testing",
        "conceptBudget": {
          "primaryConcept": "Digital Twin Architecture",
          "supportingTerms": [
            "Digital Twin (Virtual real-time software mirror of the physical factory line receiving live IoT sensor data to simulate line changeovers, predict thermal stress, and optimize throughput without taking machines offline)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d29-b1-autonomous-ai-ops-score-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Digital Twin Data Flow",
            "codeSnippet": "// PHYSICAL LINE: 45 CNC Lathes + 12 Robotic Arms streaming 10kHz vibration telemetry\n// EDGE GATEWAY:  Kafka stream ingests 50,000 sensor readings/sec into Cloud Lakehouse\n// DIGITAL TWIN:   Physics simulation engine predicts thermal tool expansion & recalibrates CNC offsets\n// RESULT:         Zero scrap parts during ambient summer factory temperature surges!",
            "lineNotes": {
              "1": "Physical IoT sensors.",
              "2": "Real-time edge ingestion.",
              "3": "Predictive physics modeling.",
              "4": "Closed-loop feedback control."
            }
          },
          {
            "type": "runnable_code",
            "filename": "digital_twin_demo.js",
            "initialCode": "function getDigitalTwinValue() {\n  return 'REAL_TIME_VIRTUAL_SIMULATION_PREVENTS_PHYSICAL_LINE_FAILURES';\n}\n\nconsole.log(getDigitalTwinValue());",
            "expectedOutput": "REAL_TIME_VIRTUAL_SIMULATION_PREVENTS_PHYSICAL_LINE_FAILURES",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What core operational advantage is delivered by synchronizing factory IoT telemetry with an enterprise Digital Twin physics simulation?",
          "expectedStringOutput": "REAL_TIME_VIRTUAL_SIMULATION_PREVENTS_PHYSICAL_LINE_FAILURES",
          "acceptableAnswers": [
            "REAL_TIME_VIRTUAL_SIMULATION_PREVENTS_PHYSICAL_LINE_FAILURES",
            "Virtual simulation prevents failures",
            "Predicts failures"
          ],
          "primaryMisconceptionId": "MC_OPS_AI_AUTONOMOUS_OPERATIONS_PREDICTIVE_OPS",
          "diagnosisMap": {
            "MANUAL_TESTING": {
              "misconceptionId": "MC_OPS_AI_AUTONOMOUS_OPERATIONS_PREDICTIVE_OPS",
              "errorExplanation": "Digital twins automate simulation: REAL_TIME_VIRTUAL_SIMULATION_PREVENTS_PHYSICAL_LINE_FAILURES.",
              "recoveryPath": {
                "simplerExplanation": "Matches REAL_TIME_VIRTUAL_SIMULATION_PREVENTS_PHYSICAL_LINE_FAILURES.",
                "guidedFixPrompt": "Type REAL_TIME_VIRTUAL_SIMULATION_PREVENTS_PHYSICAL_LINE_FAILURES"
              }
            }
          }
        }
      },
      {
        "id": "ops-d29-b3-rpa-autonomous-procurement-bots",
        "day": 29,
        "blockNumber": 3,
        "title": "Robotic Process Automation (RPA) in Autonomous Sourcing & PO Creation",
        "conceptBudget": {
          "primaryConcept": "RPA Procurement Automation",
          "supportingTerms": [
            "RPA (Software bots that ingest inventory reorder signals, query qualified supplier APIs for real-time lead times, and generate purchase orders in ERP in $< 3$ seconds)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d29-b2-digital-twin-manufacturing-simulation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "rpa_bot_demo.js",
            "initialCode": "function getRpaExecutionSpeed() {\n  return 'UNDER_THREE_SECONDS_AUTOMATED_PO_GENERATION';\n}\n\nconsole.log(getRpaExecutionSpeed());",
            "expectedOutput": "UNDER_THREE_SECONDS_AUTOMATED_PO_GENERATION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What operational velocity benchmark describes RPA bot execution of automated inventory replenishment purchase orders?",
          "expectedStringOutput": "UNDER_THREE_SECONDS_AUTOMATED_PO_GENERATION",
          "acceptableAnswers": [
            "UNDER_THREE_SECONDS_AUTOMATED_PO_GENERATION",
            "Under 3 seconds",
            "< 3 seconds PO generation"
          ],
          "primaryMisconceptionId": "MC_OPS_AI_AUTONOMOUS_OPERATIONS_PREDICTIVE_OPS",
          "diagnosisMap": {
            "MANUAL_DAYS": {
              "misconceptionId": "MC_OPS_AI_AUTONOMOUS_OPERATIONS_PREDICTIVE_OPS",
              "errorExplanation": "RPA automates instant POs: UNDER_THREE_SECONDS_AUTOMATED_PO_GENERATION.",
              "recoveryPath": {
                "simplerExplanation": "Matches UNDER_THREE_SECONDS_AUTOMATED_PO_GENERATION.",
                "guidedFixPrompt": "Type UNDER_THREE_SECONDS_AUTOMATED_PO_GENERATION"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 30,
    "title": "🏆 FINAL CAPSTONE: Enterprise Operations, Supply Chain & Compliance Master Suite",
    "overviewMetaphor": "Day 30 Final Capstone Synthesis: The complete sovereign enterprise operations, global supply chain, and statutory compliance operating system: 1. Process & Inventory Planning (30% flow efficiency, 500 unit EOQ, $72.50 landed cost, and 1040 unit S&OP forecast); 2. Manufacturing & Quality Excellence (85.7% OEE, Cpk = 1.67, 96% OTIF, 99.8% WMS IRA, and ICoFR governance); 3. Compliance & Risk Governance (0.0 LTIFR, 2% CSR with ETP clearance, GST 3-Way match, $3,098 customs duty, and BCP disaster recovery); 4. Modern Operational Execution (333h MTBF / 2.0h MTTR, 17-day PERT, 2,000 BOM components, and 25-day CCC); 5. Strategic Resilience & AI Operations (ISO 9001 certification, 86.0 SCRI resilience index, EUDR sustainable sourcing, and 93.3 autonomous AI ops composite).",
    "blocks": [
      {
        "id": "ops-d30-b1-enterprise-ops-master-suite-orchestration",
        "day": 30,
        "blockNumber": 1,
        "title": "Enterprise Operations, Supply Chain & Compliance Master Suite Orchestration",
        "conceptBudget": {
          "primaryConcept": "Enterprise Operations Master Suite Orchestration",
          "supportingTerms": [
            "Planning Module",
            "Manufacturing Module",
            "Compliance Module",
            "Execution Module",
            "Resilience & AI Module"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d29-b3-rpa-autonomous-procurement-bots",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Day 30 Final Capstone Full Enterprise Operations Architecture",
              "nodes": [
                {
                  "id": "1",
                  "label": "Module 1: Process & Inventory Planning Engine",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Module 2: Manufacturing Quality & Procurement Master",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Module 3: Statutory Compliance & Enterprise Risk Master",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Module 4: Modern Operational & Working Capital Execution",
                  "kind": "process"
                },
                {
                  "id": "5",
                  "label": "Module 5: Strategic Resilience & Autonomous AI Operations",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "enterprise_ops_master_suite_demo.js",
            "initialCode": "function orchestrateOpsSuite(p, m, c, e, r) {\n  const ok = p && m && c && e && r;\n  return {\n    planning: p,\n    manufacturing: m,\n    compliance: c,\n    execution: e,\n    resilience: r,\n    certified: ok,\n    status: ok ? 'ENTERPRISE_OPS_SCM_AND_COMPLIANCE_MASTER_CERTIFIED_NOMINAL' : 'DEFECT'\n  };\n}\n\nconsole.log(orchestrateOpsSuite(true, true, true, true, true).status);",
            "expectedOutput": "ENTERPRISE_OPS_SCM_AND_COMPLIANCE_MASTER_CERTIFIED_NOMINAL",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What master status confirms successful 5-module synthesis of the Enterprise Operations, Supply Chain & Compliance Master Suite?",
          "expectedStringOutput": "ENTERPRISE_OPS_SCM_AND_COMPLIANCE_MASTER_CERTIFIED_NOMINAL",
          "acceptableAnswers": [
            "ENTERPRISE_OPS_SCM_AND_COMPLIANCE_MASTER_CERTIFIED_NOMINAL",
            "status: ENTERPRISE_OPS_SCM_AND_COMPLIANCE_MASTER_CERTIFIED_NOMINAL"
          ],
          "primaryMisconceptionId": "MC_OPS_CAPSTONE_ENTERPRISE_OPERATIONS_SUITE",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_OPS_CAPSTONE_ENTERPRISE_OPERATIONS_SUITE",
              "errorExplanation": "Matches ENTERPRISE_OPS_SCM_AND_COMPLIANCE_MASTER_CERTIFIED_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ENTERPRISE_OPS_SCM_AND_COMPLIANCE_MASTER_CERTIFIED_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "ops-d30-b2-enterprise-ops-suite-audit",
        "day": 30,
        "blockNumber": 2,
        "title": "Enterprise Operations Suite End-to-End Invariant Audit",
        "conceptBudget": {
          "primaryConcept": "Enterprise Operations Suite End-to-End Audit",
          "supportingTerms": [
            "All 5 Modules Verified",
            "100% Quality Invariant",
            "Zero Defect Operations"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d30-b1-enterprise-ops-master-suite-orchestration",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "enterprise_ops_audit_demo.js",
            "initialCode": "function auditOpsMasterSuite() {\n  return {\n    planningVerified: true,\n    manufacturingVerified: true,\n    complianceVerified: true,\n    executionVerified: true,\n    resilienceVerified: true,\n    score: '100/100',\n    grade: 'ENTERPRISE_OPS_SUITE_AUDIT_PASSED_WITH_ZERO_DEFECTS'\n  };\n}\n\nconsole.log(auditOpsMasterSuite().grade);",
            "expectedOutput": "ENTERPRISE_OPS_SUITE_AUDIT_PASSED_WITH_ZERO_DEFECTS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade confirms flawless execution across all 30 days of the operations curriculum?",
          "expectedStringOutput": "ENTERPRISE_OPS_SUITE_AUDIT_PASSED_WITH_ZERO_DEFECTS",
          "acceptableAnswers": [
            "ENTERPRISE_OPS_SUITE_AUDIT_PASSED_WITH_ZERO_DEFECTS",
            "grade: ENTERPRISE_OPS_SUITE_AUDIT_PASSED_WITH_ZERO_DEFECTS"
          ],
          "primaryMisconceptionId": "MC_OPS_CAPSTONE_ENTERPRISE_OPERATIONS_SUITE",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_OPS_CAPSTONE_ENTERPRISE_OPERATIONS_SUITE",
              "errorExplanation": "All checks passing awards ENTERPRISE_OPS_SUITE_AUDIT_PASSED_WITH_ZERO_DEFECTS.",
              "recoveryPath": {
                "simplerExplanation": "Awards ENTERPRISE_OPS_SUITE_AUDIT_PASSED_WITH_ZERO_DEFECTS.",
                "guidedFixPrompt": "Type ENTERPRISE_OPS_SUITE_AUDIT_PASSED_WITH_ZERO_DEFECTS"
              }
            }
          }
        }
      },
      {
        "id": "ops-d30-b3-final-graduation-cert",
        "day": 30,
        "blockNumber": 3,
        "title": "PinIT Career OS — Operations, Supply Chain & Compliance Master Certification",
        "conceptBudget": {
          "primaryConcept": "Final Course Certification",
          "supportingTerms": [
            "Course 26 Certified",
            "100% Complete",
            "100/100 Quality Standard"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ops-d30-b2-enterprise-ops-suite-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "final_ops_graduation_cert.js",
            "initialCode": "console.log('🏆 PINIT CAREER OS: Operations, Supply Chain & Business Compliance Master Certification [GRADUATED 100%]');",
            "expectedOutput": "🏆 PINIT CAREER OS: Operations, Supply Chain & Business Compliance Master Certification [GRADUATED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What final graduation string certifies completion of Course #26 (Operations, Supply Chain & Business Compliance)?",
          "expectedStringOutput": "🏆 PINIT CAREER OS: Operations, Supply Chain & Business Compliance Master Certification [GRADUATED 100%]",
          "acceptableAnswers": [
            "🏆 PINIT CAREER OS: Operations, Supply Chain & Business Compliance Master Certification [GRADUATED 100%]",
            "GRADUATED 100%"
          ],
          "primaryMisconceptionId": "MC_OPS_CAPSTONE_ENTERPRISE_OPERATIONS_SUITE",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_OPS_CAPSTONE_ENTERPRISE_OPERATIONS_SUITE",
              "errorExplanation": "Matches final graduation string.",
              "recoveryPath": {
                "simplerExplanation": "Matches graduation header string.",
                "guidedFixPrompt": "Type 🏆 PINIT CAREER OS: Operations, Supply Chain & Business Compliance Master Certification [GRADUATED 100%]"
              }
            }
          }
        }
      }
    ]
  }
];
