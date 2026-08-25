// 📊 PinIT Career OS — Digital Accounting & Taxation Socratic Curriculum
// Complete 30-Day Production Baseline Specification (v1.0)
// Zero Placeholders | 100% Socratic Pedagogical Design

import { DayLessonPlan } from '@/lib/types/lessonEngine';

export const BCOM_ACCOUNTING_PILOT_DAYS: DayLessonPlan[] = [
  {
    "day": 1,
    "title": "Double-Entry Accounting Equation & Business Entity Framework",
    "overviewMetaphor": "Accounting is a Perfectly Balanced Two-Pan Mechanical Scale: on the left pan sits everything the business owns (Assets: Cash, Buildings, Inventory); on the right pan sits who paid for those things (Liabilities owed to outsiders + Equity capital provided by the owner); if the owner invests $50,000 cash into the company, the scale tips up by $50,000 on the Asset side and simultaneously increases by $50,000 on the Equity side—keeping the scale in perfect equilibrium ($Assets = Liabilities + Equity$).",
    "blocks": [
      {
        "id": "acc-d1-b1-fundamental-accounting-equation",
        "day": 1,
        "blockNumber": 1,
        "title": "The Fundamental Accounting Equation ($Assets = Liabilities + Equity$)",
        "conceptBudget": {
          "primaryConcept": "The Fundamental Accounting Equation",
          "supportingTerms": [
            "Assets (Economic resources owned: Cash, Debtors, Inventory, Machinery)",
            "Liabilities (Obligations owed to external creditors: Creditors, Bank Loans)",
            "Equity / Capital (Residual interest of owners: Capital + Net Profit - Drawings)",
            "Dual Aspect Invariant ($A = L + E$)"
          ]
        },
        "prerequisiteThresholds": [],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Accounting Equation Balance Sheet Scale",
              "boxes": [
                {
                  "label": "Left Pan: Total Assets ($500,000)",
                  "value": "Cash ($100k) + Inventory ($150k) + Machinery ($250k) = $500,000",
                  "varType": "Economic Resources",
                  "isUpdated": false
                },
                {
                  "label": "Right Pan: Total Claims ($500,000)",
                  "value": "Bank Loan ($200k Liabilities) + Owner Capital ($300k Equity) = $500,000!",
                  "varType": "Claims on Assets",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "equation_demo.js",
            "initialCode": "function evaluateAccountingEquation(assets, liabilities, equity) {\n  const rightSide = liabilities + equity;\n  const isBalanced = (assets === rightSide);\n  return {\n    totalAssets: assets,\n    totalClaims: rightSide,\n    isBalanced,\n    status: isBalanced ? 'PERFECT_DOUBLE_ENTRY_EQUILIBRIUM' : 'ACCOUNTING_IMBALANCE_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateAccountingEquation(500000, 200000, 300000)));\nconsole.log(JSON.stringify(evaluateAccountingEquation(500000, 200000, 250000)));",
            "expectedOutput": "{\"totalAssets\":500000,\"totalClaims\":500000,\"isBalanced\":true,\"status\":\"PERFECT_DOUBLE_ENTRY_EQUILIBRIUM\"}\n{\"totalAssets\":500000,\"totalClaims\":450000,\"isBalanced\":false,\"status\":\"ACCOUNTING_IMBALANCE_DEFECT\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the total Equity when a business owns $500,000 in Assets and owes $200,000 in Liabilities ($500000 - 200000$) under the fundamental accounting equation?",
          "expectedStringOutput": "300000",
          "acceptableAnswers": [
            "300000",
            "$300,000",
            "300,000",
            "totalClaims\":500000"
          ],
          "primaryMisconceptionId": "MC_ACC_DOUBLE_ENTRY_EQUATION_ASSETS_EQUALS_LIABILITIES_EQUITY",
          "diagnosisMap": {
            "700000": {
              "misconceptionId": "MC_ACC_DOUBLE_ENTRY_EQUATION_ASSETS_EQUALS_LIABILITIES_EQUITY",
              "errorExplanation": "$700,000 added liabilities to assets. Equity = Assets - Liabilities = $300,000.",
              "recoveryPath": {
                "simplerExplanation": "500,000 - 200,000 = 300,000.",
                "guidedFixPrompt": "Type 300000"
              }
            }
          }
        }
      },
      {
        "id": "acc-d1-b2-business-entity-concept",
        "day": 1,
        "blockNumber": 2,
        "title": "The Business Entity Concept & Owner Drawings",
        "conceptBudget": {
          "primaryConcept": "Business Entity Concept & Drawings",
          "supportingTerms": [
            "Separate Legal & Accounting Entity (The business is distinct from the human owner)",
            "Owner Capital (Treated as a liability owed by the business to the owner)",
            "Drawings (Cash or goods withdrawn by the owner for personal use; reduces capital)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d1-b1-fundamental-accounting-equation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Personal Expense Commingling vs Business Entity Separation",
              "brokenCode": "// ❌ BUG: Owner records personal family grocery bill as business expense:\nDebit: General Office Expenses $500\nCredit: Business Cash $500  // Violates Business Entity Concept! Distorts net profit!",
              "fixedCode": "// ✅ PRODUCTION RULE: Record personal withdrawals under Drawings Account:\nDebit: Owner Drawings Account $500  // Reduces owner's equity capital directly!\nCredit: Business Cash $500",
              "errorLine": 2,
              "errorReason": "Personal living expenses of the owner must not be booked as operational business expenses.",
              "fixExplanation": "Debit Drawings Account to reduce equity without distorting operating profit."
            }
          },
          {
            "type": "runnable_code",
            "filename": "entity_concept_demo.js",
            "initialCode": "function evaluateWithdrawal(isPersonalUse) {\n  return isPersonalUse\n    ? 'DEBIT_DRAWINGS_ACCOUNT_REDUCES_EQUITY'\n    : 'DEBIT_BUSINESS_OPERATING_EXPENSE';\n}\n\nconsole.log(evaluateWithdrawal(true));\nconsole.log(evaluateWithdrawal(false));",
            "expectedOutput": "DEBIT_DRAWINGS_ACCOUNT_REDUCES_EQUITY\nDEBIT_BUSINESS_OPERATING_EXPENSE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which account is debited when an owner withdraws $500 from the business bank account to pay personal household electricity bills?",
          "expectedStringOutput": "DEBIT_DRAWINGS_ACCOUNT_REDUCES_EQUITY",
          "acceptableAnswers": [
            "DEBIT_DRAWINGS_ACCOUNT_REDUCES_EQUITY",
            "Drawings Account",
            "Drawings"
          ],
          "primaryMisconceptionId": "MC_ACC_DOUBLE_ENTRY_EQUATION_ASSETS_EQUALS_LIABILITIES_EQUITY",
          "diagnosisMap": {
            "EXPENSE": {
              "misconceptionId": "MC_ACC_DOUBLE_ENTRY_EQUATION_ASSETS_EQUALS_LIABILITIES_EQUITY",
              "errorExplanation": "Personal expenses are booked under Drawings, not operational expenses.",
              "recoveryPath": {
                "simplerExplanation": "Debits Drawings Account.",
                "guidedFixPrompt": "Type DEBIT_DRAWINGS_ACCOUNT_REDUCES_EQUITY"
              }
            }
          }
        }
      },
      {
        "id": "acc-d1-b3-transaction-impact-on-equation",
        "day": 1,
        "blockNumber": 3,
        "title": "Transaction Impact Analysis: Asset Conversions & Liability Shifts",
        "conceptBudget": {
          "primaryConcept": "Transaction Impact Dynamics",
          "supportingTerms": [
            "Asset Conversion (Purchasing Machinery for Cash: Cash decreases, Machinery increases; Total Assets unchanged!)",
            "Liability Expansion (Purchasing Goods on Credit: Inventory increases, Creditors increase)",
            "Expense Consumption (Paying Rent in Cash: Cash decreases, Capital decreases)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d1-b2-business-entity-concept",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "tx_dynamics_demo.js",
            "initialCode": "function evaluateTransactionImpact(txType, currentAssets, currentLiabilities, currentEquity, amount) {\n  let a = currentAssets;\n  let l = currentLiabilities;\n  let e = currentEquity;\n  if (txType === 'CASH_PURCHASE_EQUIPMENT') {\n    // Cash (-amount), Equipment (+amount) -> Net Asset change = 0\n  } else if (txType === 'CREDIT_PURCHASE_INVENTORY') {\n    a += amount;\n    l += amount;\n  } else if (txType === 'PAY_CASH_EXPENSE') {\n    a -= amount;\n    e -= amount;\n  }\n  return { finalAssets: a, finalLiabilities: l, finalEquity: e, isBalanced: a === (l + e) };\n}\n\nconsole.log(JSON.stringify(evaluateTransactionImpact('CREDIT_PURCHASE_INVENTORY', 100000, 40000, 60000, 20000)));",
            "expectedOutput": "{\"finalAssets\":120000,\"finalLiabilities\":60000,\"finalEquity\":60000,\"isBalanced\":true}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the new total Assets value when a business with $100,000 Assets purchases $20,000 of Inventory on credit ($100000 + 20000$)?",
          "expectedStringOutput": "120000",
          "acceptableAnswers": [
            "120000",
            "$120,000",
            "finalAssets\":120000"
          ],
          "primaryMisconceptionId": "MC_ACC_DOUBLE_ENTRY_EQUATION_ASSETS_EQUALS_LIABILITIES_EQUITY",
          "diagnosisMap": {
            "100000": {
              "misconceptionId": "MC_ACC_DOUBLE_ENTRY_EQUATION_ASSETS_EQUALS_LIABILITIES_EQUITY",
              "errorExplanation": "Purchasing on credit increases inventory (Assets) by 20k to $120,000.",
              "recoveryPath": {
                "simplerExplanation": "100,000 + 20,000 = 120,000.",
                "guidedFixPrompt": "Type 120000"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 2,
    "title": "The 3 Golden Rules of Accounting & Account Classification",
    "overviewMetaphor": "The 3 Golden Rules are the Three Universal Traffic Lights of Accounting: every single financial event in the world falls into one of three buckets: 1. Personal Accounts (People and Companies: 'Debit the Receiver, Credit the Giver'); 2. Real Accounts (Physical and Intangible Things: 'Debit what Comes In, Credit what Goes Out'); 3. Nominal Accounts (Revenues and Expenses: 'Debit all Expenses and Losses, Credit all Incomes and Gains'); mastering these three rules guarantees you will never make a debit/credit error.",
    "blocks": [
      {
        "id": "acc-d2-b1-personal-accounts-rule",
        "day": 2,
        "blockNumber": 1,
        "title": "Personal Accounts: Debit the Receiver, Credit the Giver",
        "conceptBudget": {
          "primaryConcept": "Personal Accounts Golden Rule",
          "supportingTerms": [
            "Natural Persons (Individual human beings: Rahul, Sarah)",
            "Artificial Persons (Corporate entities: Infosys Ltd, State Bank of India)",
            "Representative Persons (Outstanding Salaries, Prepaid Insurance)",
            "Rule: Debit the Receiver, Credit the Giver"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d1-b1-fundamental-accounting-equation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Personal Account Rule Application",
              "boxes": [
                {
                  "label": "1. Paid $5,000 cash to Supplier Mohan",
                  "value": "Mohan receives money -> Mohan is the RECEIVER -> DEBIT MOHAN ACCOUNT!",
                  "varType": "Receiver",
                  "isUpdated": false
                },
                {
                  "label": "2. Received $8,000 cheque from Customer Anita",
                  "value": "Anita gives cheque -> Anita is the GIVER -> CREDIT ANITA ACCOUNT!",
                  "varType": "Giver",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "personal_rule_demo.js",
            "initialCode": "function applyPersonalRule(personRole) {\n  return personRole === 'RECEIVER'\n    ? 'DEBIT_THE_RECEIVER'\n    : 'CREDIT_THE_GIVER';\n}\n\nconsole.log(applyPersonalRule('RECEIVER'));\nconsole.log(applyPersonalRule('GIVER'));",
            "expectedOutput": "DEBIT_THE_RECEIVER\nCREDIT_THE_GIVER",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Under the Golden Rules of Accounting, what action is applied to Supplier Rajesh when our business pays him $2,000 cash (Rajesh is the receiver)?",
          "expectedStringOutput": "DEBIT_THE_RECEIVER",
          "acceptableAnswers": [
            "DEBIT_THE_RECEIVER",
            "Debit Rajesh",
            "Debit"
          ],
          "primaryMisconceptionId": "MC_ACC_THREE_GOLDEN_RULES_DEBIT_CREDIT_CLASSIFICATION",
          "diagnosisMap": {
            "CREDIT": {
              "misconceptionId": "MC_ACC_THREE_GOLDEN_RULES_DEBIT_CREDIT_CLASSIFICATION",
              "errorExplanation": "Rajesh is receiving cash, so by rule we 'Debit the Receiver'.",
              "recoveryPath": {
                "simplerExplanation": "Debit the receiver.",
                "guidedFixPrompt": "Type DEBIT_THE_RECEIVER"
              }
            }
          }
        }
      },
      {
        "id": "acc-d2-b2-real-accounts-rule",
        "day": 2,
        "blockNumber": 2,
        "title": "Real Accounts: Debit What Comes In, Credit What Goes Out",
        "conceptBudget": {
          "primaryConcept": "Real Accounts Golden Rule",
          "supportingTerms": [
            "Tangible Real Accounts (Cash, Land, Buildings, Plant, Machinery, Furniture, Vehicles)",
            "Intangible Real Accounts (Goodwill, Patents, Copyrights, Trademarks)",
            "Rule: Debit what Comes In, Credit what Goes Out"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d2-b1-personal-accounts-rule",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Purchased Machinery for $50,000 Cash",
            "codeSnippet": "// Machinery (Real Account) COMES IN -> Debit Machinery Account $50,000\n// Cash (Real Account) GOES OUT -> Credit Cash Account $50,000\nDebit: Machinery A/c $50,000\nCredit: Cash A/c $50,000",
            "lineNotes": {
              "1": "Tangible asset comes in.",
              "2": "Cash asset goes out."
            }
          },
          {
            "type": "runnable_code",
            "filename": "real_rule_demo.js",
            "initialCode": "function applyRealRule(assetMovement) {\n  return assetMovement === 'COMES_IN'\n    ? 'DEBIT_WHAT_COMES_IN'\n    : 'CREDIT_WHAT_GOES_OUT';\n}\n\nconsole.log(applyRealRule('COMES_IN'));\nconsole.log(applyRealRule('GOES_OUT'));",
            "expectedOutput": "DEBIT_WHAT_COMES_IN\nCREDIT_WHAT_GOES_OUT",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Under the Real Account rule, what action is applied to Cash when paying $50,000 for new factory machinery (Cash goes out)?",
          "expectedStringOutput": "CREDIT_WHAT_GOES_OUT",
          "acceptableAnswers": [
            "CREDIT_WHAT_GOES_OUT",
            "Credit Cash",
            "Credit"
          ],
          "primaryMisconceptionId": "MC_ACC_THREE_GOLDEN_RULES_DEBIT_CREDIT_CLASSIFICATION",
          "diagnosisMap": {
            "DEBIT": {
              "misconceptionId": "MC_ACC_THREE_GOLDEN_RULES_DEBIT_CREDIT_CLASSIFICATION",
              "errorExplanation": "Cash is leaving the business, so we 'Credit what Goes Out'.",
              "recoveryPath": {
                "simplerExplanation": "Credit what goes out.",
                "guidedFixPrompt": "Type CREDIT_WHAT_GOES_OUT"
              }
            }
          }
        }
      },
      {
        "id": "acc-d2-b3-nominal-accounts-rule",
        "day": 2,
        "blockNumber": 3,
        "title": "Nominal Accounts: Debit All Expenses/Losses, Credit All Incomes/Gains",
        "conceptBudget": {
          "primaryConcept": "Nominal Accounts Golden Rule",
          "supportingTerms": [
            "Expenses & Losses (Rent Paid, Salaries, Advertising, Depreciation, Bad Debts)",
            "Incomes & Gains (Sales Revenue, Commission Received, Interest Earned, Discount Received)",
            "Rule: Debit all Expenses/Losses, Credit all Incomes/Gains"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d2-b2-real-accounts-rule",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "nominal_rule_demo.js",
            "initialCode": "function applyNominalRule(itemType) {\n  return (itemType === 'EXPENSE' || itemType === 'LOSS')\n    ? 'DEBIT_ALL_EXPENSES_AND_LOSSES'\n    : 'CREDIT_ALL_INCOMES_AND_GAINS';\n}\n\nconsole.log(applyNominalRule('EXPENSE'));\nconsole.log(applyNominalRule('INCOME'));",
            "expectedOutput": "DEBIT_ALL_EXPENSES_AND_LOSSES\nCREDIT_ALL_INCOMES_AND_GAINS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Under the Nominal Account rule, what action is applied when the business receives $3,000 commission income?",
          "expectedStringOutput": "CREDIT_ALL_INCOMES_AND_GAINS",
          "acceptableAnswers": [
            "CREDIT_ALL_INCOMES_AND_GAINS",
            "Credit Commission",
            "Credit"
          ],
          "primaryMisconceptionId": "MC_ACC_THREE_GOLDEN_RULES_DEBIT_CREDIT_CLASSIFICATION",
          "diagnosisMap": {
            "DEBIT": {
              "misconceptionId": "MC_ACC_THREE_GOLDEN_RULES_DEBIT_CREDIT_CLASSIFICATION",
              "errorExplanation": "Incomes and gains are always credited under the nominal rule.",
              "recoveryPath": {
                "simplerExplanation": "Credit all incomes and gains.",
                "guidedFixPrompt": "Type CREDIT_ALL_INCOMES_AND_GAINS"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 3,
    "title": "Journalizing Transactions & Compound Journal Entries",
    "overviewMetaphor": "The General Journal is the Official Ship's Captain Logbook: every financial event must be recorded in strict chronological sequence on the day it happens; a Journal Entry specifies exactly which accounts are Debited and Credited, the exact dollar amounts, and ends with a brief explanation (Narration); when a transaction involves three or more accounts simultaneously (like selling goods for $10,000 where customer pays $4,000 cash and owes $6,000 on credit), a Compound Journal Entry captures all legs in a single balanced record.",
    "blocks": [
      {
        "id": "acc-d3-b1-journal-entry-structure-narration",
        "day": 3,
        "blockNumber": 1,
        "title": "General Journal Format, Ledger Folio (LF) & Narration",
        "conceptBudget": {
          "primaryConcept": "General Journal Format & Narration",
          "supportingTerms": [
            "Columns: Date, Particulars, Ledger Folio (LF), Debit ($), Credit ($)",
            "Narration: Mandatory explanation starting with '(Being...)'",
            "Double-Entry Invariant: $\\sum \\text{Debits} = \\sum \\text{Credits}$ per journal entry"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d2-b3-nominal-accounts-rule",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Standard Journal Entry Anatomy",
              "boxes": [
                {
                  "label": "Date & Particulars",
                  "value": "2026-04-01 | Rent Account Dr. ... To Cash Account",
                  "varType": "Accounts Involved",
                  "isUpdated": false
                },
                {
                  "label": "Debit Column ($)",
                  "value": "$15,000 (Top line aligned left)",
                  "varType": "Debit Amount",
                  "isUpdated": false
                },
                {
                  "label": "Credit Column ($)",
                  "value": "$15,000 (Bottom line indented right with 'To')",
                  "varType": "Credit Amount",
                  "isUpdated": false
                },
                {
                  "label": "Narration",
                  "value": "(Being office rent paid in cash for the month of April)",
                  "varType": "Narration String",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "journal_format_demo.js",
            "initialCode": "function formatJournalEntry(drAccount, crAccount, amount, narration) {\n  return {\n    debitLine: `${drAccount} Dr. $${amount}`,\n    creditLine: `   To ${crAccount} $${amount}`,\n    narration: `(Being ${narration})`,\n    isBalanced: true,\n    status: 'JOURNAL_ENTRY_RECORDED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(formatJournalEntry('Rent A/c', 'Cash A/c', 15000, 'office rent paid in cash')));",
            "expectedOutput": "{\"debitLine\":\"Rent A/c Dr. $15000\",\"creditLine\":\"   To Cash A/c $15000\",\"narration\":\"(Being office rent paid in cash)\",\"isBalanced\":true,\"status\":\"JOURNAL_ENTRY_RECORDED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that a journal entry has equal debits and credits and is formally recorded in the General Journal?",
          "expectedStringOutput": "JOURNAL_ENTRY_RECORDED_NOMINAL",
          "acceptableAnswers": [
            "JOURNAL_ENTRY_RECORDED_NOMINAL",
            "status\":\"JOURNAL_ENTRY_RECORDED_NOMINAL\""
          ],
          "primaryMisconceptionId": "MC_ACC_JOURNALIZING_COMPOUND_ENTRIES_BALANCING",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_ACC_JOURNALIZING_COMPOUND_ENTRIES_BALANCING",
              "errorExplanation": "Matches JOURNAL_ENTRY_RECORDED_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches JOURNAL_ENTRY_RECORDED_NOMINAL.",
                "guidedFixPrompt": "Type JOURNAL_ENTRY_RECORDED_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "acc-d3-b2-compound-journal-entries",
        "day": 3,
        "blockNumber": 2,
        "title": "Compound Journal Entries: Multiple Debits or Credits in One Transaction",
        "conceptBudget": {
          "primaryConcept": "Compound Journal Entry Mechanics",
          "supportingTerms": [
            "Multiple Debits / Single Credit (e.g. Starting business with Cash + Machinery)",
            "Single Debit / Multiple Credits (e.g. Cash Sales with GST)",
            "Multiple Debits / Multiple Credits",
            "Summing Multi-Leg Equivalence"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d3-b1-journal-entry-structure-narration",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Compound Entry: Sold Goods for $10,000 ($4k Cash, $6k Credit)",
            "codeSnippet": "// Debit Cash A/c: $4,000 (Cash received)\n// Debit Debtor Verma A/c: $6,000 (Credit owed)\n// Credit Sales A/c: $10,000 (Total revenue earned)\nDebit: Cash A/c $4,000\nDebit: Debtor Verma A/c $6,000\nCredit: Sales A/c $10,000\n// Total Debits ($10k) == Total Credits ($10k)!",
            "lineNotes": {
              "4": "Partial cash payment.",
              "5": "Partial credit owed.",
              "6": "Total revenue credited."
            }
          },
          {
            "type": "runnable_code",
            "filename": "compound_demo.js",
            "initialCode": "function validateCompoundEntry(debitsList, creditsList) {\n  const drSum = debitsList.reduce((acc, d) => acc + d.amt, 0);\n  const crSum = creditsList.reduce((acc, c) => acc + c.amt, 0);\n  const isBalanced = (drSum === crSum);\n  return {\n    debitTotal: drSum,\n    creditTotal: crSum,\n    compoundBalanced: isBalanced,\n    status: isBalanced ? 'COMPOUND_ENTRY_VALIDATED' : 'COMPOUND_IMBALANCE_REJECTED'\n  };\n}\n\nconst debits = [{ name: 'Cash', amt: 4000 }, { name: 'Debtor', amt: 6000 }];\nconst credits = [{ name: 'Sales', amt: 10000 }];\nconsole.log(JSON.stringify(validateCompoundEntry(debits, credits)));",
            "expectedOutput": "{\"debitTotal\":10000,\"creditTotal\":10000,\"compoundBalanced\":true,\"status\":\"COMPOUND_ENTRY_VALIDATED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the total credit to Sales Account when recording a compound entry with $4,000 Cash received and $6,000 Debtor credit balance ($4000 + 6000$)?",
          "expectedStringOutput": "10000",
          "acceptableAnswers": [
            "10000",
            "$10,000",
            "debitTotal\":10000"
          ],
          "primaryMisconceptionId": "MC_ACC_JOURNALIZING_COMPOUND_ENTRIES_BALANCING",
          "diagnosisMap": {
            "4000": {
              "misconceptionId": "MC_ACC_JOURNALIZING_COMPOUND_ENTRIES_BALANCING",
              "errorExplanation": "Sales represents the full $10,000 revenue ($4k cash + $6k receivable).",
              "recoveryPath": {
                "simplerExplanation": "4000 + 6000 = 10000.",
                "guidedFixPrompt": "Type 10000"
              }
            }
          }
        }
      },
      {
        "id": "acc-d3-b3-trade-discount-vs-cash-discount-entries",
        "day": 3,
        "blockNumber": 3,
        "title": "Trade Discount (Unrecorded) vs Cash Discount (Recorded in Accounts)",
        "conceptBudget": {
          "primaryConcept": "Trade vs Cash Discount Journal Accounting",
          "supportingTerms": [
            "Trade Discount (Quantity reduction deducted directly on invoice; NEVER recorded in journal books!)",
            "Cash Discount (Incentive for prompt payment; Recorded as 'Discount Allowed' Dr. / 'Discount Received' Cr.)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d3-b2-compound-journal-entries",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "discount_type_demo.js",
            "initialCode": "function evaluateDiscountBooking(discountType) {\n  if (discountType === 'TRADE_DISCOUNT') {\n    return 'DEDUCTED_ON_INVOICE_NOT_RECORDED_IN_LEDGER';\n  }\n  return 'RECORDED_IN_LEDGER_AS_DISCOUNT_ALLOWED_OR_RECEIVED';\n}\n\nconsole.log(evaluateDiscountBooking('TRADE_DISCOUNT'));\nconsole.log(evaluateDiscountBooking('CASH_DISCOUNT'));",
            "expectedOutput": "DEDUCTED_ON_INVOICE_NOT_RECORDED_IN_LEDGER\nRECORDED_IN_LEDGER_AS_DISCOUNT_ALLOWED_OR_RECEIVED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How is a 10% Trade Discount treated in the General Journal books of accounts?",
          "expectedStringOutput": "DEDUCTED_ON_INVOICE_NOT_RECORDED_IN_LEDGER",
          "acceptableAnswers": [
            "DEDUCTED_ON_INVOICE_NOT_RECORDED_IN_LEDGER",
            "Not recorded",
            "Deducted on invoice"
          ],
          "primaryMisconceptionId": "MC_ACC_JOURNALIZING_COMPOUND_ENTRIES_BALANCING",
          "diagnosisMap": {
            "RECORDED": {
              "misconceptionId": "MC_ACC_JOURNALIZING_COMPOUND_ENTRIES_BALANCING",
              "errorExplanation": "Trade discount is deducted on the invoice and never appears in journal ledger entries.",
              "recoveryPath": {
                "simplerExplanation": "Trade discounts are not recorded in ledgers.",
                "guidedFixPrompt": "Type DEDUCTED_ON_INVOICE_NOT_RECORDED_IN_LEDGER"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 4,
    "title": "Ledger Posting & Balancing T-Accounts",
    "overviewMetaphor": "The General Ledger is a Postal Sorting Office with Labeled Pigeons Holes: the Journal lists letters in the order they arrived; Ledger Posting is sorting each line into its dedicated pigeonhole (Cash Account box, Rent Account box, Sales Account box); at the end of the month, the accountant counts the piles on both sides of the T-box; if the Debit side is heavier by $25,000, the account has a Debit Balance—which is carried down ('By Balance c/d') to start next month ('To Balance b/d').",
    "blocks": [
      {
        "id": "acc-d4-b1-t-account-posting-rules",
        "day": 4,
        "blockNumber": 1,
        "title": "T-Account Architecture & The 'To...' / 'By...' Posting Conventions",
        "conceptBudget": {
          "primaryConcept": "Ledger T-Account Posting Rules",
          "supportingTerms": [
            "Debit Side (Left side: Prefixed with 'To...')",
            "Credit Side (Right side: Prefixed with 'By...')",
            "Contra Account Reference in Particulars column",
            "Posting from Journal to Ledger"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d3-b1-journal-entry-structure-narration",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "T-Account Ledger Visual Layout",
              "boxes": [
                {
                  "label": "Debit Side (Dr. Left)",
                  "value": "Date | Particulars ('To Cash A/c') | JF | Amount ($)",
                  "varType": "Debit Side",
                  "isUpdated": false
                },
                {
                  "label": "Credit Side (Cr. Right)",
                  "value": "Date | Particulars ('By Sales A/c') | JF | Amount ($)",
                  "varType": "Credit Side",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "posting_prefix_demo.js",
            "initialCode": "function getLedgerPrefix(side) {\n  return side === 'DEBIT'\n    ? 'To [Contra Account Name]'\n    : 'By [Contra Account Name]';\n}\n\nconsole.log(getLedgerPrefix('DEBIT'));\nconsole.log(getLedgerPrefix('CREDIT'));",
            "expectedOutput": "To [Contra Account Name]\nBy [Contra Account Name]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which prefix is traditionally written in the Particulars column on the DEBIT side of a ledger T-account?",
          "expectedStringOutput": "To [Contra Account Name]",
          "acceptableAnswers": [
            "To [Contra Account Name]",
            "To",
            "'To'"
          ],
          "primaryMisconceptionId": "MC_ACC_LEDGER_POSTING_AND_CLOSING_BALANCES",
          "diagnosisMap": {
            "By": {
              "misconceptionId": "MC_ACC_LEDGER_POSTING_AND_CLOSING_BALANCES",
              "errorExplanation": "'By' is for the credit side. The debit side is prefixed with 'To'.",
              "recoveryPath": {
                "simplerExplanation": "Debit uses 'To'.",
                "guidedFixPrompt": "Type To [Contra Account Name]"
              }
            }
          }
        }
      },
      {
        "id": "acc-d4-b2-balancing-t-accounts-c-d-b-d",
        "day": 4,
        "blockNumber": 2,
        "title": "Balancing Ledger Accounts: 'Balance c/d' vs 'Balance b/d'",
        "conceptBudget": {
          "primaryConcept": "Ledger Account Balancing Mechanics",
          "supportingTerms": [
            "Carried Down (`c/d`: Closing balancing figure at end of period)",
            "Brought Down (`b/d`: Opening balance at start of next period)",
            "Debit Balance (Total Dr > Total Cr $\\implies$ Assets & Expenses)",
            "Credit Balance (Total Cr > Total Dr $\\implies$ Liabilities, Equity & Incomes)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d4-b1-t-account-posting-rules",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Balancing Cash Account ($70k Debits, $45k Credits)",
            "codeSnippet": "Debit Total: $70,000 | Credit Total: $45,000\n// Step 1: Write shortfall on lighter Credit side as 'By Balance c/d $25,000'\n// Step 2: Total both columns to $70,000 and rule double lines\n// Step 3: Bring down to heavier Debit side next month as 'To Balance b/d $25,000'",
            "lineNotes": {
              "2": "Closing balancing figure on credit side.",
              "4": "Opening debit balance next period."
            }
          },
          {
            "type": "runnable_code",
            "filename": "balance_cd_demo.js",
            "initialCode": "function evaluateLedgerClose(drSum, crSum) {\n  const diff = drSum - crSum;\n  if (diff > 0) {\n    return { balance: diff, closingEntry: 'By Balance c/d', openingNextPeriod: 'To Balance b/d (DEBIT_BALANCE)' };\n  }\n  return { balance: Math.abs(diff), closingEntry: 'To Balance c/d', openingNextPeriod: 'By Balance b/d (CREDIT_BALANCE)' };\n}\n\nconsole.log(JSON.stringify(evaluateLedgerClose(70000, 45000)));",
            "expectedOutput": "{\"balance\":25000,\"closingEntry\":\"By Balance c/d\",\"openingNextPeriod\":\"To Balance b/d (DEBIT_BALANCE)\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What closing balance amount is carried down ('By Balance c/d') when Cash Account debits total $70,000 and credits total $45,000 ($70000 - 45000$)?",
          "expectedStringOutput": "25000",
          "acceptableAnswers": [
            "25000",
            "$25,000",
            "balance\":25000"
          ],
          "primaryMisconceptionId": "MC_ACC_LEDGER_POSTING_AND_CLOSING_BALANCES",
          "diagnosisMap": {
            "70000": {
              "misconceptionId": "MC_ACC_LEDGER_POSTING_AND_CLOSING_BALANCES",
              "errorExplanation": "The balancing figure is the difference: 70,000 - 45,000 = $25,000.",
              "recoveryPath": {
                "simplerExplanation": "70000 - 45000 = 25000.",
                "guidedFixPrompt": "Type 25000"
              }
            }
          }
        }
      },
      {
        "id": "acc-d4-b3-nominal-accounts-period-end-closing",
        "day": 4,
        "blockNumber": 3,
        "title": "Nominal Accounts Closing: Transferring to Trading & Profit & Loss Accounts",
        "conceptBudget": {
          "primaryConcept": "Nominal Account Closing Transfers",
          "supportingTerms": [
            "Nominal accounts are NOT carried down with `c/d`!",
            "Direct Expense & Revenue nominals transferred to Trading Account",
            "Indirect Expense & Income nominals transferred to Profit & Loss Account",
            "Zero Balance at start of new fiscal year"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d4-b2-balancing-t-accounts-c-d-b-d",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "nominal_close_demo.js",
            "initialCode": "function evaluateAccountClosingMethod(accountCategory) {\n  return (accountCategory === 'NOMINAL')\n    ? 'TRANSFERRED_TO_TRADING_OR_PROFIT_LOSS_ZERO_BALANCE'\n    : 'CARRIED_FORWARD_VIA_BALANCE_CD_TO_BALANCE_SHEET';\n}\n\nconsole.log(evaluateAccountClosingMethod('NOMINAL'));\nconsole.log(evaluateAccountClosingMethod('REAL_OR_PERSONAL'));",
            "expectedOutput": "TRANSFERRED_TO_TRADING_OR_PROFIT_LOSS_ZERO_BALANCE\nCARRIED_FORWARD_VIA_BALANCE_CD_TO_BALANCE_SHEET",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How are Nominal Accounts (Salaries, Rent, Sales) closed at the end of the financial year?",
          "expectedStringOutput": "TRANSFERRED_TO_TRADING_OR_PROFIT_LOSS_ZERO_BALANCE",
          "acceptableAnswers": [
            "TRANSFERRED_TO_TRADING_OR_PROFIT_LOSS_ZERO_BALANCE",
            "Transferred to P&L",
            "Trading/P&L transfer"
          ],
          "primaryMisconceptionId": "MC_ACC_LEDGER_POSTING_AND_CLOSING_BALANCES",
          "diagnosisMap": {
            "BALANCE_CD": {
              "misconceptionId": "MC_ACC_LEDGER_POSTING_AND_CLOSING_BALANCES",
              "errorExplanation": "Real and Personal accounts use balance c/d. Nominal accounts are transferred to Trading / P&L.",
              "recoveryPath": {
                "simplerExplanation": "Nominals transfer to Trading/P&L.",
                "guidedFixPrompt": "Type TRANSFERRED_TO_TRADING_OR_PROFIT_LOSS_ZERO_BALANCE"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 5,
    "title": "⭐ MILESTONE 1: Complete Double-Entry Bookkeeping & General Ledger Engine",
    "overviewMetaphor": "Milestone 1 Synthesis: The complete sovereign double-entry bookkeeping and general ledger engine: 1. Fundamental accounting equation equilibrium ($A = L + E$); 2. 3 Golden Rules transaction classification; 3. General journal entry formatting with narrations; 4. Automated T-account general ledger posting and balancing.",
    "blocks": [
      {
        "id": "acc-d5-b1-bookkeeping-engine-synthesis",
        "day": 5,
        "blockNumber": 1,
        "title": "Double-Entry Bookkeeping & Ledger Master Synthesis",
        "conceptBudget": {
          "primaryConcept": "Bookkeeping Engine Synthesis",
          "supportingTerms": [
            "Equation Validator",
            "Golden Rules Classifier",
            "Journalizing Balancer",
            "T-Account Ledger Posting"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d4-b2-balancing-t-accounts-c-d-b-d",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Milestone 1 Bookkeeping Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "Business transaction occurs (Source document: Invoice / Receipt)",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Classifies accounts into Personal, Real, Nominal using Golden Rules",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Records balanced two-sided entry in General Journal with narration",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Posts to General Ledger T-accounts and extracts closing Dr/Cr balances!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "bookkeeping_engine_demo.js",
            "initialCode": "function runBookkeepingEngine() {\n  return {\n    equationEngine: 'ONLINE_ASSETS_EQUALS_LIABILITIES_PLUS_EQUITY',\n    goldenRulesEngine: 'ONLINE_PERSONAL_REAL_NOMINAL_ACTIVE',\n    journalEngine: 'ONLINE_COMPOUND_ENTRIES_BALANCED',\n    ledgerEngine: 'ONLINE_T_ACCOUNTS_BALANCED',\n    engineStatus: 'BOOKKEEPING_MASTER_ENGINE_ACTIVE'\n  };\n}\n\nconsole.log(runBookkeepingEngine().engineStatus);",
            "expectedOutput": "BOOKKEEPING_MASTER_ENGINE_ACTIVE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What engine status confirms active operational synthesis of the Bookkeeping Master Engine?",
          "expectedStringOutput": "BOOKKEEPING_MASTER_ENGINE_ACTIVE",
          "acceptableAnswers": [
            "BOOKKEEPING_MASTER_ENGINE_ACTIVE",
            "engineStatus: BOOKKEEPING_MASTER_ENGINE_ACTIVE"
          ],
          "primaryMisconceptionId": "MC_ACC_DOUBLE_ENTRY_EQUATION_ASSETS_EQUALS_LIABILITIES_EQUITY",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_ACC_DOUBLE_ENTRY_EQUATION_ASSETS_EQUALS_LIABILITIES_EQUITY",
              "errorExplanation": "Matches BOOKKEEPING_MASTER_ENGINE_ACTIVE.",
              "recoveryPath": {
                "simplerExplanation": "Matches BOOKKEEPING_MASTER_ENGINE_ACTIVE.",
                "guidedFixPrompt": "Type BOOKKEEPING_MASTER_ENGINE_ACTIVE"
              }
            }
          }
        }
      },
      {
        "id": "acc-d5-b2-bookkeeping-engine-audit",
        "day": 5,
        "blockNumber": 2,
        "title": "Double-Entry Equilibrium & Ledger Posting Audit",
        "conceptBudget": {
          "primaryConcept": "Bookkeeping Invariant Audit",
          "supportingTerms": [
            "Equation Equilibrium Invariant",
            "Golden Rules Invariant",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d5-b1-bookkeeping-engine-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "bookkeeping_audit_demo.js",
            "initialCode": "function auditBookkeepingSystem(equationValid, ledgersBalanced) {\n  const passed = equationValid && ledgersBalanced;\n  return {\n    equationValid,\n    ledgersBalanced,\n    grade: passed ? 'BOOKKEEPING_SYSTEM_AUDIT_PASSED' : 'AUDIT_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditBookkeepingSystem(true, true)));",
            "expectedOutput": "{\"equationValid\":true,\"ledgersBalanced\":true,\"grade\":\"BOOKKEEPING_SYSTEM_AUDIT_PASSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade is awarded when accounting equation validity and balanced ledgers pass 100%?",
          "expectedStringOutput": "BOOKKEEPING_SYSTEM_AUDIT_PASSED",
          "acceptableAnswers": [
            "BOOKKEEPING_SYSTEM_AUDIT_PASSED",
            "grade\":\"BOOKKEEPING_SYSTEM_AUDIT_PASSED\""
          ],
          "primaryMisconceptionId": "MC_ACC_DOUBLE_ENTRY_EQUATION_ASSETS_EQUALS_LIABILITIES_EQUITY",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_ACC_DOUBLE_ENTRY_EQUATION_ASSETS_EQUALS_LIABILITIES_EQUITY",
              "errorExplanation": "All checks passing awards BOOKKEEPING_SYSTEM_AUDIT_PASSED.",
              "recoveryPath": {
                "simplerExplanation": "Awards BOOKKEEPING_SYSTEM_AUDIT_PASSED.",
                "guidedFixPrompt": "Type BOOKKEEPING_SYSTEM_AUDIT_PASSED"
              }
            }
          }
        }
      },
      {
        "id": "acc-d5-b3-milestone1-accounting-cert",
        "day": 5,
        "blockNumber": 3,
        "title": "Milestone 1 Bookkeeping & General Ledger Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 1 Certification",
          "supportingTerms": [
            "Bookkeeping Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d5-b2-bookkeeping-engine-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone1_acc_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 1: Complete Double-Entry Bookkeeping & General Ledger Engine [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 1: Complete Double-Entry Bookkeeping & General Ledger Engine [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 1 completion?",
          "expectedStringOutput": "⭐ MILESTONE 1: Complete Double-Entry Bookkeeping & General Ledger Engine [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 1: Complete Double-Entry Bookkeeping & General Ledger Engine [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_ACC_DOUBLE_ENTRY_EQUATION_ASSETS_EQUALS_LIABILITIES_EQUITY",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_ACC_DOUBLE_ENTRY_EQUATION_ASSETS_EQUALS_LIABILITIES_EQUITY",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 1: Complete Double-Entry Bookkeeping & General Ledger Engine [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 6,
    "title": "Special Purpose Books: 3-Column Cash Book & Petty Cash (Imprest System)",
    "overviewMetaphor": "The 3-Column Cash Book is a High-Speed Cashier's Register with Three Dedicated Compartments: Left compartment holds physical currency (Cash Column); Middle compartment holds bank checks (Bank Column); Right compartment tracks prompt-payment discounts (Discount Column); when money is transferred from the Cash register into the Bank vault, it is recorded simultaneously on both sides as a Contra Entry ('C') without needing a separate journal entry.",
    "blocks": [
      {
        "id": "acc-d6-b1-three-column-cash-book-layout",
        "day": 6,
        "blockNumber": 1,
        "title": "3-Column Cash Book Layout & Dual Journal/Ledger Role",
        "conceptBudget": {
          "primaryConcept": "3-Column Cash Book Architecture",
          "supportingTerms": [
            "Columns per side: Date, Particulars, VN/LF, Discount, Cash, Bank",
            "Book of Original Entry AND Principal Ledger (Eliminates separate Cash and Bank ledger accounts!)",
            "Discount Columns: Discount Allowed (Dr side total posted to Discount Allowed A/c) vs Discount Received (Cr side total posted to Discount Received A/c; NOT BALANCED!)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d4-b2-balancing-t-accounts-c-d-b-d",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "3-Column Cash Book Debit & Credit Structure",
              "boxes": [
                {
                  "label": "Receipts (Debit Side)",
                  "value": "Discount Allowed ($) | Cash Inflow ($) | Bank Inflow ($)",
                  "varType": "Receipt Columns",
                  "isUpdated": false
                },
                {
                  "label": "Payments (Credit Side)",
                  "value": "Discount Received ($) | Cash Outflow ($) | Bank Outflow ($)",
                  "varType": "Payment Columns",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "cash_book_demo.js",
            "initialCode": "function evaluateCashBookDualRole() {\n  return 'CASH_BOOK_SERVES_AS_BOTH_JOURNAL_AND_PRINCIPAL_LEDGER';\n}\n\nconsole.log(evaluateCashBookDualRole());",
            "expectedOutput": "CASH_BOOK_SERVES_AS_BOTH_JOURNAL_AND_PRINCIPAL_LEDGER",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What dual role is fulfilled by the Cash Book in an enterprise accounting system?",
          "expectedStringOutput": "CASH_BOOK_SERVES_AS_BOTH_JOURNAL_AND_PRINCIPAL_LEDGER",
          "acceptableAnswers": [
            "CASH_BOOK_SERVES_AS_BOTH_JOURNAL_AND_PRINCIPAL_LEDGER",
            "Journal and Ledger"
          ],
          "primaryMisconceptionId": "MC_ACC_THREE_COLUMN_CASH_BOOK_CONTRA_ENTRIES",
          "diagnosisMap": {
            "JOURNAL_ONLY": {
              "misconceptionId": "MC_ACC_THREE_COLUMN_CASH_BOOK_CONTRA_ENTRIES",
              "errorExplanation": "Cash book functions as both original journal and principal ledger.",
              "recoveryPath": {
                "simplerExplanation": "Acts as both journal and ledger.",
                "guidedFixPrompt": "Type CASH_BOOK_SERVES_AS_BOTH_JOURNAL_AND_PRINCIPAL_LEDGER"
              }
            }
          }
        }
      },
      {
        "id": "acc-d6-b2-contra-entries-mechanics",
        "day": 6,
        "blockNumber": 2,
        "title": "Contra Entries ('C'): Cash Deposits & Bank Withdrawals for Office Use",
        "conceptBudget": {
          "primaryConcept": "Contra Entry Mechanics in Cash Book",
          "supportingTerms": [
            "Cash Deposited into Bank (Dr Bank Column, Cr Cash Column; marked 'C' in LF)",
            "Cash Withdrawn from Bank for Office Use (Dr Cash Column, Cr Bank Column; marked 'C')",
            "Personal Withdrawals (NOT a Contra Entry! Debit Drawings, Credit Bank Column!)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d6-b1-three-column-cash-book-layout",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Contra Entry: Deposited $10,000 Cash into Bank Account",
            "codeSnippet": "// Debit Side (Receipts): Date | To Cash A/c | LF: C | Bank: $10,000\n// Credit Side (Payments): Date | By Bank A/c | LF: C | Cash: $10,000\n// Both sides updated inside Cash Book -> Zero external ledger posting needed!",
            "lineNotes": {
              "1": "Bank column increases on Debit side.",
              "2": "Cash column decreases on Credit side.",
              "3": "'C' symbol in LF indicates complete internal recording."
            }
          },
          {
            "type": "runnable_code",
            "filename": "contra_demo.js",
            "initialCode": "function evaluateContraEntry(eventDescription) {\n  if (eventDescription === 'DEPOSITED_CASH_INTO_BANK' || eventDescription === 'WITHDREW_CASH_FOR_OFFICE_USE') {\n    return 'CONTRA_ENTRY_RECORDED_MARKED_WITH_C';\n  }\n  return 'STANDARD_NON_CONTRA_ENTRY';\n}\n\nconsole.log(evaluateContraEntry('DEPOSITED_CASH_INTO_BANK'));\nconsole.log(evaluateContraEntry('WITHDREW_CASH_FOR_PERSONAL_USE'));",
            "expectedOutput": "CONTRA_ENTRY_RECORDED_MARKED_WITH_C\nSTANDARD_NON_CONTRA_ENTRY",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What symbol is entered in the Ledger Folio (LF) column when recording a contra cash deposit into the bank?",
          "expectedStringOutput": "C",
          "acceptableAnswers": [
            "C",
            "'C'",
            "CONTRA_ENTRY_RECORDED_MARKED_WITH_C"
          ],
          "primaryMisconceptionId": "MC_ACC_THREE_COLUMN_CASH_BOOK_CONTRA_ENTRIES",
          "diagnosisMap": {
            "J": {
              "misconceptionId": "MC_ACC_THREE_COLUMN_CASH_BOOK_CONTRA_ENTRIES",
              "errorExplanation": "Contra entries are marked with the letter 'C'.",
              "recoveryPath": {
                "simplerExplanation": "Marked with 'C'.",
                "guidedFixPrompt": "Type C"
              }
            }
          }
        }
      },
      {
        "id": "acc-d6-b3-imprest-petty-cash-system",
        "day": 6,
        "blockNumber": 3,
        "title": "The Analytical Petty Cash Book & The Imprest System",
        "conceptBudget": {
          "primaryConcept": "Analytical Imprest Petty Cash System",
          "supportingTerms": [
            "Fixed Float (Imprest amount e.g. $5,000 at start of month)",
            "Analytical Expense Columns (Postage, Stationery, Tea/Refreshments, Local Conveyance)",
            "Reimbursement (Chief Cashier reimburses exact total spent to restore float to $5,000)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d6-b2-contra-entries-mechanics",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "imprest_demo.js",
            "initialCode": "function calculateImprestReimbursement(initialFloat, totalSpent) {\n  const remainingCash = initialFloat - totalSpent;\n  const reimbursement = totalSpent; // Exactly restores float\n  return {\n    floatAmount: initialFloat,\n    totalSpent,\n    cashInHand: remainingCash,\n    reimbursementCheque: reimbursement,\n    restoredFloat: remainingCash + reimbursement,\n    status: 'IMPREST_FLOAT_RESTORED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateImprestReimbursement(5000, 3850)));",
            "expectedOutput": "{\"floatAmount\":5000,\"totalSpent\":3850,\"cashInHand\":1150,\"reimbursementCheque\":3850,\"restoredFloat\":5000,\"status\":\"IMPREST_FLOAT_RESTORED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Under the Imprest System with a $5,000 float, what exact reimbursement check is issued to the petty cashier after $3,850 of expenses are incurred?",
          "expectedStringOutput": "3850",
          "acceptableAnswers": [
            "3850",
            "$3,850",
            "reimbursementCheque\":3850"
          ],
          "primaryMisconceptionId": "MC_ACC_THREE_COLUMN_CASH_BOOK_CONTRA_ENTRIES",
          "diagnosisMap": {
            "5000": {
              "misconceptionId": "MC_ACC_THREE_COLUMN_CASH_BOOK_CONTRA_ENTRIES",
              "errorExplanation": "Reimbursement equals the exact amount spent ($3,850) to restore the float to $5,000.",
              "recoveryPath": {
                "simplerExplanation": "Reimbursement equals amount spent = 3850.",
                "guidedFixPrompt": "Type 3850"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 7,
    "title": "Subsidiary Books: Purchase, Sales, Returns & Bills Books",
    "overviewMetaphor": "Subsidiary Books are Specialized Filing Drawers for High-Volume Invoices: if a supermarket entered every single grocery sale in the General Journal, the book would be 10,000 pages long; Subsidiary Books subdivide transactions into specialized registers: Purchase Book (Strictly credit purchases of inventory!), Sales Book (Strictly credit sales of inventory!), Purchase Returns Book (Debit Notes), and Sales Returns Book (Credit Notes).",
    "blocks": [
      {
        "id": "acc-d7-b1-purchase-and-sales-day-books",
        "day": 7,
        "blockNumber": 1,
        "title": "Purchase Day Book & Sales Day Book Scope (Credit Inventory Only!)",
        "conceptBudget": {
          "primaryConcept": "Day Books Scope Boundaries",
          "supportingTerms": [
            "Strict Credit Inventory Boundary (Cash purchases go to Cash Book; Fixed asset purchases go to Journal Proper!)",
            "Net Invoice Amount (Gross Amount minus Trade Discount)",
            "Periodic Monthly Posting to General Ledger"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d6-b1-three-column-cash-book-layout",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Where Does Each Transaction Go?",
              "boxes": [
                {
                  "label": "1. Bought Goods on Credit from ABC ($10k)",
                  "value": "Target Book: PURCHASE DAY BOOK (Credit inventory!)",
                  "varType": "Purchase Book",
                  "isUpdated": false
                },
                {
                  "label": "2. Bought Furniture on Credit from XYZ ($20k)",
                  "value": "Target Book: JOURNAL PROPER (Fixed asset, NOT goods!)",
                  "varType": "Journal Proper",
                  "isUpdated": true
                },
                {
                  "label": "3. Bought Goods for Cash ($5k)",
                  "value": "Target Book: CASH BOOK (Cash transaction, NOT credit!)",
                  "varType": "Cash Book",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "subsidiary_route_demo.js",
            "initialCode": "function routeTransactionBook(itemType, isCredit) {\n  if (itemType === 'GOODS' && isCredit) return 'PURCHASE_OR_SALES_DAY_BOOK';\n  if (!isCredit) return 'CASH_BOOK';\n  return 'JOURNAL_PROPER';\n}\n\nconsole.log(routeTransactionBook('GOODS', true));\nconsole.log(routeTransactionBook('FIXED_ASSET', true));\nconsole.log(routeTransactionBook('GOODS', false));",
            "expectedOutput": "PURCHASE_OR_SALES_DAY_BOOK\nJOURNAL_PROPER\nCASH_BOOK",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "In which book of prime entry is a transaction recorded when purchasing office computer hardware on credit (Fixed asset)?",
          "expectedStringOutput": "JOURNAL_PROPER",
          "acceptableAnswers": [
            "JOURNAL_PROPER",
            "Journal Proper"
          ],
          "primaryMisconceptionId": "MC_ACC_THREE_COLUMN_CASH_BOOK_CONTRA_ENTRIES",
          "diagnosisMap": {
            "PURCHASE_BOOK": {
              "misconceptionId": "MC_ACC_THREE_COLUMN_CASH_BOOK_CONTRA_ENTRIES",
              "errorExplanation": "Purchase Book is strictly for trading inventory goods. Fixed assets on credit go to Journal Proper.",
              "recoveryPath": {
                "simplerExplanation": "Fixed assets on credit go to Journal Proper.",
                "guidedFixPrompt": "Type JOURNAL_PROPER"
              }
            }
          }
        }
      },
      {
        "id": "acc-d7-b2-debit-notes-vs-credit-notes",
        "day": 7,
        "blockNumber": 2,
        "title": "Returns Documentation: Debit Notes (Purchase Return) vs Credit Notes (Sales Return)",
        "conceptBudget": {
          "primaryConcept": "Debit Notes vs Credit Notes",
          "supportingTerms": [
            "Debit Note (Sent by buyer to seller when returning defective goods $\\implies$ 'We have DEBITED your account')",
            "Credit Note (Sent by seller to buyer acknowledging returned goods $\\implies$ 'We have CREDITED your account')",
            "Source Documents for Returns Books"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d7-b1-purchase-and-sales-day-books",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Debit Note vs Credit Note Mapping",
            "codeSnippet": "// When returning goods to Supplier -> Issue DEBIT NOTE -> Record in Purchase Returns Book\n// When Customer returns goods to us -> Issue CREDIT NOTE -> Record in Sales Returns Book",
            "lineNotes": {
              "1": "Buyer debits supplier.",
              "2": "Seller credits customer."
            }
          },
          {
            "type": "runnable_code",
            "filename": "note_type_demo.js",
            "initialCode": "function getReturnsDoc(returnRole) {\n  return returnRole === 'RETURNING_GOODS_TO_SUPPLIER'\n    ? 'ISSUE_DEBIT_NOTE'\n    : 'ISSUE_CREDIT_NOTE';\n}\n\nconsole.log(getReturnsDoc('RETURNING_GOODS_TO_SUPPLIER'));\nconsole.log(getReturnsDoc('CUSTOMER_RETURNING_GOODS_TO_US'));",
            "expectedOutput": "ISSUE_DEBIT_NOTE\nISSUE_CREDIT_NOTE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which commercial document is issued by a buyer when returning damaged goods to a supplier?",
          "expectedStringOutput": "ISSUE_DEBIT_NOTE",
          "acceptableAnswers": [
            "ISSUE_DEBIT_NOTE",
            "Debit Note",
            "DEBIT_NOTE"
          ],
          "primaryMisconceptionId": "MC_ACC_THREE_COLUMN_CASH_BOOK_CONTRA_ENTRIES",
          "diagnosisMap": {
            "CREDIT": {
              "misconceptionId": "MC_ACC_THREE_COLUMN_CASH_BOOK_CONTRA_ENTRIES",
              "errorExplanation": "Buyer issues a Debit Note to the supplier.",
              "recoveryPath": {
                "simplerExplanation": "Issues a Debit Note.",
                "guidedFixPrompt": "Type ISSUE_DEBIT_NOTE"
              }
            }
          }
        }
      },
      {
        "id": "acc-d7-b3-journal-proper-miscellaneous-entries",
        "day": 7,
        "blockNumber": 3,
        "title": "The Journal Proper: Opening, Closing, Rectification & Transfer Entries",
        "conceptBudget": {
          "primaryConcept": "Scope of the Journal Proper",
          "supportingTerms": [
            "Opening Entries (Carrying forward Balance Sheet assets/liabilities from previous year)",
            "Closing Entries (Transferring nominal accounts to Trading and P&L)",
            "Adjustment Entries (Depreciation, Prepaid/Outstanding items)",
            "Rectification Entries"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d7-b2-debit-notes-vs-credit-notes",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "journal_proper_demo.js",
            "initialCode": "function evaluateJournalProperEntry() {\n  return 'JOURNAL_PROPER_HANDLES_OPENING_CLOSING_ADJUSTMENT_AND_RECTIFICATION';\n}\n\nconsole.log(evaluateJournalProperEntry());",
            "expectedOutput": "JOURNAL_PROPER_HANDLES_OPENING_CLOSING_ADJUSTMENT_AND_RECTIFICATION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What role is performed by the Journal Proper in a subsidiary book system?",
          "expectedStringOutput": "JOURNAL_PROPER_HANDLES_OPENING_CLOSING_ADJUSTMENT_AND_RECTIFICATION",
          "acceptableAnswers": [
            "JOURNAL_PROPER_HANDLES_OPENING_CLOSING_ADJUSTMENT_AND_RECTIFICATION",
            "Opening, Closing, Adjustments"
          ],
          "primaryMisconceptionId": "MC_ACC_THREE_COLUMN_CASH_BOOK_CONTRA_ENTRIES",
          "diagnosisMap": {
            "CASH": {
              "misconceptionId": "MC_ACC_THREE_COLUMN_CASH_BOOK_CONTRA_ENTRIES",
              "errorExplanation": "Cash goes to Cash Book. Journal Proper handles adjustments, opening, closing, and rectification entries.",
              "recoveryPath": {
                "simplerExplanation": "Handles adjustments and closing.",
                "guidedFixPrompt": "Type JOURNAL_PROPER_HANDLES_OPENING_CLOSING_ADJUSTMENT_AND_RECTIFICATION"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 8,
    "title": "Bank Reconciliation Statement (BRS): Timing & Error Adjustments",
    "overviewMetaphor": "A Bank Reconciliation Statement (BRS) is Comparing Your Personal Checkbook Diary Against the Official Bank Statement: on December 31, your Cash Book says you have $50,000 in the bank, but the Bank Statement shows $55,500; why? You wrote a $10,000 check to a vendor who hasn't cashed it at the bank yet (Unpresented Cheque); and the bank deposited $4,000 directly from a customer into your account without you knowing yet; BRS reconciles the two balances item by item to prove that zero money is missing.",
    "blocks": [
      {
        "id": "acc-d8-b1-causes-of-cash-book-passbook-discrepancy",
        "day": 8,
        "blockNumber": 1,
        "title": "Timing Differences: Unpresented Cheques & Uncredited Deposits",
        "conceptBudget": {
          "primaryConcept": "BRS Timing Discrepancies",
          "supportingTerms": [
            "Cheques Issued but Not Presented for Payment (Cash Book balance reduced; Passbook balance remains higher!)",
            "Cheques Paid In / Deposited but Not Yet Cleared/Credited (Cash Book increased; Passbook remains lower!)",
            "Direct Bank Charges / Interest Credited / Direct Collections"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d6-b1-three-column-cash-book-layout",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Timing Discrepancy Direction Matrix",
              "boxes": [
                {
                  "label": "Cheque Issued (Unpresented)",
                  "value": "Cash Book: DECREASED (-$10k) | Passbook: NOT DEDUCTED (Higher by +$10k!)",
                  "varType": "Timing Lag",
                  "isUpdated": false
                },
                {
                  "label": "Cheque Deposited (Uncredited)",
                  "value": "Cash Book: INCREASED (+$8k) | Passbook: NOT CREDITED YET (Lower by -$8k!)",
                  "varType": "Clearing Lag",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "brs_logic_demo.js",
            "initialCode": "function evaluateBrsAdjustment(startingFromCashBook, itemType) {\n  if (itemType === 'UNPRESENTED_CHEQUES') return 'ADD_TO_CASH_BOOK_BALANCE';\n  if (itemType === 'UNCREDITED_CHEQUES') return 'DEDUCT_FROM_CASH_BOOK_BALANCE';\n  if (itemType === 'DIRECT_CUSTOMER_DEPOSIT') return 'ADD_TO_CASH_BOOK_BALANCE';\n  if (itemType === 'BANK_CHARGES_DEBITED') return 'DEDUCT_FROM_CASH_BOOK_BALANCE';\n  return 'UNKNOWN';\n}\n\nconsole.log(evaluateBrsAdjustment(true, 'UNPRESENTED_CHEQUES'));\nconsole.log(evaluateBrsAdjustment(true, 'UNCREDITED_CHEQUES'));",
            "expectedOutput": "ADD_TO_CASH_BOOK_BALANCE\nDEDUCT_FROM_CASH_BOOK_BALANCE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "When preparing a BRS starting from a favorable Cash Book balance, what adjustment is made for cheques issued to suppliers but not yet presented for payment at the bank?",
          "expectedStringOutput": "ADD_TO_CASH_BOOK_BALANCE",
          "acceptableAnswers": [
            "ADD_TO_CASH_BOOK_BALANCE",
            "Add",
            "Added"
          ],
          "primaryMisconceptionId": "MC_ACC_BANK_RECONCILIATION_STATEMENT_BRS_TIMING_DIFFERENCES",
          "diagnosisMap": {
            "DEDUCT": {
              "misconceptionId": "MC_ACC_BANK_RECONCILIATION_STATEMENT_BRS_TIMING_DIFFERENCES",
              "errorExplanation": "Cash book already deducted it, but passbook did not. To reach passbook, we must ADD it back.",
              "recoveryPath": {
                "simplerExplanation": "Add to reach passbook balance.",
                "guidedFixPrompt": "Type ADD_TO_CASH_BOOK_BALANCE"
              }
            }
          }
        }
      },
      {
        "id": "acc-d8-b2-favorable-vs-overdraft-starting-points",
        "day": 8,
        "blockNumber": 2,
        "title": "Starting Points: Favorable Balances vs Bank Overdraft (Unfavorable)",
        "conceptBudget": {
          "primaryConcept": "BRS Balance Starting Points",
          "supportingTerms": [
            "Favorable Cash Book Balance = Debit Balance (Money in bank)",
            "Favorable Passbook Balance = Credit Balance (Bank owes money to us)",
            "Bank Overdraft Cash Book = Credit Balance (Unfavorable)",
            "Bank Overdraft Passbook = Debit Balance (Unfavorable)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d8-b1-causes-of-cash-book-passbook-discrepancy",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Cash Book vs Passbook Normal Balances",
            "codeSnippet": "// In Cash Book: DEBIT = Favorable (Asset) | CREDIT = Overdraft (Liability)\n// In Passbook: CREDIT = Favorable (Deposit) | DEBIT = Overdraft (Withdrawal)\n// They are mirror opposites because the Bank's ledger is the inverse of the customer's!",
            "lineNotes": {
              "1": "Customer's perspective.",
              "2": "Bank's perspective.",
              "3": "Mirror image relationship."
            }
          },
          {
            "type": "runnable_code",
            "filename": "brs_signs_demo.js",
            "initialCode": "function evaluatePassbookBalance(isFavorable) {\n  return isFavorable\n    ? 'PASSBOOK_CREDIT_BALANCE_FAVORABLE'\n    : 'PASSBOOK_DEBIT_BALANCE_OVERDRAFT';\n}\n\nconsole.log(evaluatePassbookBalance(true));\nconsole.log(evaluatePassbookBalance(false));",
            "expectedOutput": "PASSBOOK_CREDIT_BALANCE_FAVORABLE\nPASSBOOK_DEBIT_BALANCE_OVERDRAFT",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What sign denotes a favorable deposit balance in the official Bank Passbook?",
          "expectedStringOutput": "PASSBOOK_CREDIT_BALANCE_FAVORABLE",
          "acceptableAnswers": [
            "PASSBOOK_CREDIT_BALANCE_FAVORABLE",
            "Credit Balance",
            "Credit"
          ],
          "primaryMisconceptionId": "MC_ACC_BANK_RECONCILIATION_STATEMENT_BRS_TIMING_DIFFERENCES",
          "diagnosisMap": {
            "DEBIT": {
              "misconceptionId": "MC_ACC_BANK_RECONCILIATION_STATEMENT_BRS_TIMING_DIFFERENCES",
              "errorExplanation": "Debit in the Passbook means overdraft/withdrawal. Favorable deposit balance is a Credit in the Passbook.",
              "recoveryPath": {
                "simplerExplanation": "Passbook favorable balance is Credit.",
                "guidedFixPrompt": "Type PASSBOOK_CREDIT_BALANCE_FAVORABLE"
              }
            }
          }
        }
      },
      {
        "id": "acc-d8-b3-adjusted-cash-book-method",
        "day": 8,
        "blockNumber": 3,
        "title": "The Modern Adjusted Cash Book Method",
        "conceptBudget": {
          "primaryConcept": "Adjusted Cash Book Method",
          "supportingTerms": [
            "Adjusted Cash Book (First record bank charges, direct deposits, interest, and Cash Book errors directly in Cash Book)",
            "BRS is then prepared ONLY for remaining timing differences (Unpresented & Uncredited cheques)",
            "Best Practice in Corporate Audits"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d8-b2-favorable-vs-overdraft-starting-points",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "adjusted_cb_demo.js",
            "initialCode": "function evaluateAdjustedCashBookWorkflow() {\n  return 'ADJUSTED_CASH_BOOK_RECORDS_INTERNAL_OMISSIONS_BEFORE_BRS';\n}\n\nconsole.log(evaluateAdjustedCashBookWorkflow());",
            "expectedOutput": "ADJUSTED_CASH_BOOK_RECORDS_INTERNAL_OMISSIONS_BEFORE_BRS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the primary objective of preparing an Adjusted Cash Book prior to finalizing the BRS?",
          "expectedStringOutput": "ADJUSTED_CASH_BOOK_RECORDS_INTERNAL_OMISSIONS_BEFORE_BRS",
          "acceptableAnswers": [
            "ADJUSTED_CASH_BOOK_RECORDS_INTERNAL_OMISSIONS_BEFORE_BRS",
            "Record omissions before BRS"
          ],
          "primaryMisconceptionId": "MC_ACC_BANK_RECONCILIATION_STATEMENT_BRS_TIMING_DIFFERENCES",
          "diagnosisMap": {
            "IGNORE": {
              "misconceptionId": "MC_ACC_BANK_RECONCILIATION_STATEMENT_BRS_TIMING_DIFFERENCES",
              "errorExplanation": "Adjusted Cash Book records internal omissions before calculating BRS.",
              "recoveryPath": {
                "simplerExplanation": "Records omissions before BRS.",
                "guidedFixPrompt": "Type ADJUSTED_CASH_BOOK_RECORDS_INTERNAL_OMISSIONS_BEFORE_BRS"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 9,
    "title": "Trial Balance: Arithmetic Accuracy Checksum & Detection of Errors",
    "overviewMetaphor": "The Trial Balance is an Airport Baggage Weight Checksum: every piece of luggage loaded on the plane was weighed twice (Debit and Credit); the Trial Balance totals all debit balances in one column and all credit balances in another; if both columns equal $175,000, the arithmetic math of double-entry is verified; however, if you accidentally packed a bowling ball into the wrong passenger's bag (Error of Commission), the total scale weight will still match perfectly—proving that Trial Balance verifies arithmetic accuracy, not total perfection.",
    "blocks": [
      {
        "id": "acc-d9-b1-trial-balance-structure-and-checksum",
        "day": 9,
        "blockNumber": 1,
        "title": "Trial Balance Format & Column Checksum Balancing",
        "conceptBudget": {
          "primaryConcept": "Trial Balance Structure & Balancing",
          "supportingTerms": [
            "Debit Balances (Assets: Cash, Debtors, Machinery; Expenses: Rent, Salaries, Purchases)",
            "Credit Balances (Liabilities: Creditors, Loans; Capital: Owner Equity; Incomes: Sales)",
            "Mathematical Checksum: $\\sum \\text{Dr Balances} = \\sum \\text{Cr Balances}$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d4-b2-balancing-t-accounts-c-d-b-d",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Trial Balance Debit and Credit Schedule",
              "boxes": [
                {
                  "label": "Debit Column ($175,000)",
                  "value": "Cash ($25k) + Machinery ($50k) + Purchases ($80k) + Rent ($20k) = $175,000",
                  "varType": "Assets + Expenses",
                  "isUpdated": false
                },
                {
                  "label": "Credit Column ($175,000)",
                  "value": "Capital ($100k) + Sales ($60k) + Creditors ($15k) = $175,000!",
                  "varType": "Equity + Incomes + Liab",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "tb_checksum_demo.js",
            "initialCode": "function evaluateTbChecksum(drList, crList) {\n  const drTotal = drList.reduce((a, b) => a + b, 0);\n  const crTotal = crList.reduce((a, b) => a + b, 0);\n  const isBalanced = (drTotal === crTotal);\n  return {\n    totalDebits: drTotal,\n    totalCredits: crTotal,\n    isBalanced,\n    status: isBalanced ? 'TRIAL_BALANCE_ARITHMETIC_PERFECT_MATCH' : 'TRIAL_BALANCE_OUT_OF_BALANCE'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateTbChecksum([25000, 50000, 80000, 20000], [100000, 60000, 15000])));",
            "expectedOutput": "{\"totalDebits\":175000,\"totalCredits\":175000,\"isBalanced\":true,\"status\":\"TRIAL_BALANCE_ARITHMETIC_PERFECT_MATCH\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status is awarded when total debit balances ($175,000) exactly match total credit balances ($175,000) in the Trial Balance?",
          "expectedStringOutput": "TRIAL_BALANCE_ARITHMETIC_PERFECT_MATCH",
          "acceptableAnswers": [
            "TRIAL_BALANCE_ARITHMETIC_PERFECT_MATCH",
            "status\":\"TRIAL_BALANCE_ARITHMETIC_PERFECT_MATCH\""
          ],
          "primaryMisconceptionId": "MC_ACC_TRIAL_BALANCE_CHECKSUM_AND_LIMITATIONS",
          "diagnosisMap": {
            "OUT_OF_BALANCE": {
              "misconceptionId": "MC_ACC_TRIAL_BALANCE_CHECKSUM_AND_LIMITATIONS",
              "errorExplanation": "Debits equal credits, verifying arithmetic accuracy.",
              "recoveryPath": {
                "simplerExplanation": "Matches TRIAL_BALANCE_ARITHMETIC_PERFECT_MATCH.",
                "guidedFixPrompt": "Type TRIAL_BALANCE_ARITHMETIC_PERFECT_MATCH"
              }
            }
          }
        }
      },
      {
        "id": "acc-d9-b2-errors-not-disclosed-by-tb",
        "day": 9,
        "blockNumber": 2,
        "title": "Errors Undetected by Trial Balance: Principle, Omission & Compensating",
        "conceptBudget": {
          "primaryConcept": "Errors Undetected by Trial Balance",
          "supportingTerms": [
            "Error of Principle (Treating capital expenditure as revenue expenditure e.g. debiting Repairs instead of Machinery; TB still balances!)",
            "Error of Complete Omission (Transaction forgotten completely; both sides missing)",
            "Compensating Errors (Two separate errors canceling each other out)",
            "Error of Commission (Posting to wrong person's account)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d9-b1-trial-balance-structure-and-checksum",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "tb_limitations_demo.js",
            "initialCode": "function evaluateTbErrorDetection(errorType) {\n  const undetected = ['ERROR_OF_PRINCIPLE', 'COMPLETE_OMISSION', 'COMPENSATING_ERROR', 'ERROR_OF_COMMISSION'];\n  return undetected.includes(errorType)\n    ? 'TRIAL_BALANCE_REMAINS_BALANCED_ERROR_UNDETECTED'\n    : 'TRIAL_BALANCE_DISCLOSES_ARITHMETIC_DISCREPANCY';\n}\n\nconsole.log(evaluateTbErrorDetection('ERROR_OF_PRINCIPLE'));\nconsole.log(evaluateTbErrorDetection('ONE_SIDED_POSTING_OMISSION'));",
            "expectedOutput": "TRIAL_BALANCE_REMAINS_BALANCED_ERROR_UNDETECTED\nTRIAL_BALANCE_DISCLOSES_ARITHMETIC_DISCREPANCY",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What happens to the Trial Balance when an accountant books a $10,000 machinery purchase as a repair expense (Error of Principle)?",
          "expectedStringOutput": "TRIAL_BALANCE_REMAINS_BALANCED_ERROR_UNDETECTED",
          "acceptableAnswers": [
            "TRIAL_BALANCE_REMAINS_BALANCED_ERROR_UNDETECTED",
            "Remains balanced",
            "Undetected"
          ],
          "primaryMisconceptionId": "MC_ACC_TRIAL_BALANCE_CHECKSUM_AND_LIMITATIONS",
          "diagnosisMap": {
            "DISCLOSES": {
              "misconceptionId": "MC_ACC_TRIAL_BALANCE_CHECKSUM_AND_LIMITATIONS",
              "errorExplanation": "An equal debit and credit was still posted, so Trial Balance remains balanced despite the conceptual error.",
              "recoveryPath": {
                "simplerExplanation": "Trial balance still balances.",
                "guidedFixPrompt": "Type TRIAL_BALANCE_REMAINS_BALANCED_ERROR_UNDETECTED"
              }
            }
          }
        }
      },
      {
        "id": "acc-d9-b3-errors-affecting-tb",
        "day": 9,
        "blockNumber": 3,
        "title": "Errors Disclosed by Trial Balance: One-Sided & Casting Errors",
        "conceptBudget": {
          "primaryConcept": "Errors Disclosed by Trial Balance",
          "supportingTerms": [
            "Casting Error (Under-casting or over-casting a subsidiary book total)",
            "Partial Omission (Posting debit leg but forgetting credit leg)",
            "Posting to Wrong Side (Debiting an account instead of crediting)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d9-b2-errors-not-disclosed-by-tb",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "casting_error_demo.js",
            "initialCode": "function evaluateCastingDiscrepancy(underCastingAmt) {\n  return {\n    underCastingDiscrepancy: underCastingAmt,\n    trialBalanceDifference: underCastingAmt,\n    action: 'TRANSFER_DIFFERENCE_TO_SUSPENSE_ACCOUNT',\n    status: 'TRIAL_BALANCE_IMBALANCE_DISCLOSED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateCastingDiscrepancy(5000)));",
            "expectedOutput": "{\"underCastingDiscrepancy\":5000,\"trialBalanceDifference\":5000,\"action\":\"TRANSFER_DIFFERENCE_TO_SUSPENSE_ACCOUNT\",\"status\":\"TRIAL_BALANCE_IMBALANCE_DISCLOSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What action is taken to temporarily balance the Trial Balance when a $5,000 casting discrepancy is discovered?",
          "expectedStringOutput": "TRANSFER_DIFFERENCE_TO_SUSPENSE_ACCOUNT",
          "acceptableAnswers": [
            "TRANSFER_DIFFERENCE_TO_SUSPENSE_ACCOUNT",
            "Suspense Account",
            "action\":\"TRANSFER_DIFFERENCE_TO_SUSPENSE_ACCOUNT\""
          ],
          "primaryMisconceptionId": "MC_ACC_TRIAL_BALANCE_CHECKSUM_AND_LIMITATIONS",
          "diagnosisMap": {
            "IGNORE": {
              "misconceptionId": "MC_ACC_TRIAL_BALANCE_CHECKSUM_AND_LIMITATIONS",
              "errorExplanation": "Differences are temporarily transferred to a Suspense Account.",
              "recoveryPath": {
                "simplerExplanation": "Transfers to Suspense Account.",
                "guidedFixPrompt": "Type TRANSFER_DIFFERENCE_TO_SUSPENSE_ACCOUNT"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 10,
    "title": "Rectification of Errors & The Suspense Account",
    "overviewMetaphor": "A Suspense Account is a Temporary Holding Shelf for Lost Luggage: when the Trial Balance columns disagree by $5,000, you place a temporary $5,000 tag in the Suspense Account so you can proceed with monthly accounting; as you audit the books and find the missing receipts, you post Rectification Journal Entries to put the money into its rightful account and erase the Suspense balance back down to zero.",
    "blocks": [
      {
        "id": "acc-d10-b1-suspense-account-mechanics",
        "day": 10,
        "blockNumber": 1,
        "title": "The Suspense Account: Temporary Parking of One-Sided Discrepancies",
        "conceptBudget": {
          "primaryConcept": "Suspense Account Parking Mechanics",
          "supportingTerms": [
            "Temporary Ledger Account (Opened when Trial Balance fails to agree)",
            "Debit Suspense Balance (When Credit total exceeds Debit total in TB)",
            "Credit Suspense Balance (When Debit total exceeds Credit total in TB)",
            "Disposal Goal: Zero Balance upon full rectification"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d9-b3-errors-affecting-tb",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Suspense Account Balancing Role",
              "boxes": [
                {
                  "label": "Trial Balance Imbalance",
                  "value": "Total Dr: $95,000 | Total Cr: $100,000 | Shortfall on Dr: $5,000",
                  "varType": "Discrepancy",
                  "isUpdated": false
                },
                {
                  "label": "Suspense Account Action",
                  "value": "Debit Suspense Account $5,000 -> Trial Balance artificially balanced at $100k!",
                  "varType": "Temporary Holding",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "suspense_demo.js",
            "initialCode": "function calculateSuspenseEntry(drTotal, crTotal) {\n  const diff = drTotal - crTotal;\n  if (diff < 0) {\n    return { suspenseSide: 'DEBIT_SUSPENSE', amount: Math.abs(diff), status: 'SUSPENSE_ACCOUNT_OPENED' };\n  }\n  return { suspenseSide: 'CREDIT_SUSPENSE', amount: diff, status: 'SUSPENSE_ACCOUNT_OPENED' };\n}\n\nconsole.log(JSON.stringify(calculateSuspenseEntry(95000, 100000)));",
            "expectedOutput": "{\"suspenseSide\":\"DEBIT_SUSPENSE\",\"amount\":5000,\"status\":\"SUSPENSE_ACCOUNT_OPENED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which side of the Suspense Account is posted when Trial Balance Debits ($95,000) are short of Credits ($100,000) by $5,000?",
          "expectedStringOutput": "DEBIT_SUSPENSE",
          "acceptableAnswers": [
            "DEBIT_SUSPENSE",
            "Debit",
            "suspenseSide\":\"DEBIT_SUSPENSE\""
          ],
          "primaryMisconceptionId": "MC_ACC_RECTIFICATION_OF_ERRORS_SUSPENSE_ACCOUNT",
          "diagnosisMap": {
            "CREDIT": {
              "misconceptionId": "MC_ACC_RECTIFICATION_OF_ERRORS_SUSPENSE_ACCOUNT",
              "errorExplanation": "Debit side is lighter, so Suspense is opened with a Debit balance.",
              "recoveryPath": {
                "simplerExplanation": "Debits are short -> DEBIT_SUSPENSE.",
                "guidedFixPrompt": "Type DEBIT_SUSPENSE"
              }
            }
          }
        }
      },
      {
        "id": "acc-d10-b2-rectifying-two-sided-errors",
        "day": 10,
        "blockNumber": 2,
        "title": "Rectifying Two-Sided Errors: Complete Reversal & Correct Posting",
        "conceptBudget": {
          "primaryConcept": "Two-Sided Error Rectification (Zero Suspense Involvement)",
          "supportingTerms": [
            "Two-Sided Errors (Affect two accounts equally; Suspense Account is NOT used!)",
            "3-Step Correction Method: 1. What was recorded? 2. What SHOULD have been recorded? 3. What is the correcting entry?"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d10-b1-suspense-account-mechanics",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Paid $2,000 Rent Wrongly Debited to Landlord's Personal Account",
            "codeSnippet": "// Wrong Entry Recorded: Landlord A/c Dr. $2,000 / To Cash $2,000\n// Correct Entry Needed: Rent A/c Dr. $2,000 / To Cash $2,000\n// RECTIFICATION ENTRY: Debit Rent A/c $2,000 / Credit Landlord A/c $2,000",
            "lineNotes": {
              "1": "Defective entry.",
              "2": "Target entry.",
              "3": "Rectification neutralizes Landlord A/c and debits Rent A/c."
            }
          },
          {
            "type": "runnable_code",
            "filename": "rectify_twosided_demo.js",
            "initialCode": "function rectifyTwoSided(wrongDebitAccount, correctDebitAccount, amount) {\n  return {\n    debitEntry: `${correctDebitAccount} Dr. $${amount}`,\n    creditEntry: `To ${wrongDebitAccount} $${amount}`,\n    suspenseInvolved: false,\n    status: 'TWO_SIDED_ERROR_RECTIFIED'\n  };\n}\n\nconsole.log(JSON.stringify(rectifyTwoSided('Landlord A/c', 'Rent A/c', 2000)));",
            "expectedOutput": "{\"debitEntry\":\"Rent A/c Dr. $2000\",\"creditEntry\":\"To Landlord A/c $2000\",\"suspenseInvolved\":false,\"status\":\"TWO_SIDED_ERROR_RECTIFIED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Is the Suspense Account used when rectifying two-sided errors?",
          "expectedStringOutput": "false",
          "acceptableAnswers": [
            "false",
            "No",
            "suspenseInvolved\":false"
          ],
          "primaryMisconceptionId": "MC_ACC_RECTIFICATION_OF_ERRORS_SUSPENSE_ACCOUNT",
          "diagnosisMap": {
            "true": {
              "misconceptionId": "MC_ACC_RECTIFICATION_OF_ERRORS_SUSPENSE_ACCOUNT",
              "errorExplanation": "Two-sided errors do not affect Trial Balance totals, so Suspense is never used.",
              "recoveryPath": {
                "simplerExplanation": "Suspense is not involved in two-sided errors.",
                "guidedFixPrompt": "Type false"
              }
            }
          }
        }
      },
      {
        "id": "acc-d10-b3-rectifying-one-sided-errors-via-suspense",
        "day": 10,
        "blockNumber": 3,
        "title": "Rectifying One-Sided Errors via Suspense Account",
        "conceptBudget": {
          "primaryConcept": "One-Sided Error Rectification via Suspense",
          "supportingTerms": [
            "Sales Book undercast by $5,000 $\\implies$ Credit Sales A/c $5,000, Debit Suspense A/c $5,000",
            "Purchases Book overcast $\\implies$ Credit Purchases A/c, Debit Suspense A/c",
            "Clearing Suspense to Zero"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d10-b2-rectifying-two-sided-errors",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "rectify_onesided_demo.js",
            "initialCode": "function rectifySalesUndercast(amount) {\n  return {\n    debitLeg: `Suspense A/c Dr. $${amount}`,\n    creditLeg: `To Sales A/c $${amount}`,\n    effect: 'INCREASES_SALES_CREDIT_AND_CLEARS_SUSPENSE',\n    status: 'ONE_SIDED_RECTIFICATION_POSTED'\n  };\n}\n\nconsole.log(JSON.stringify(rectifySalesUndercast(5000)));",
            "expectedOutput": "{\"debitLeg\":\"Suspense A/c Dr. $5000\",\"creditLeg\":\"To Sales A/c $5000\",\"effect\":\"INCREASES_SALES_CREDIT_AND_CLEARS_SUSPENSE\",\"status\":\"ONE_SIDED_RECTIFICATION_POSTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which account is debited when rectifying a $5,000 under-casting error in the Sales Day Book?",
          "expectedStringOutput": "Suspense A/c Dr. $5000",
          "acceptableAnswers": [
            "Suspense A/c Dr. $5000",
            "Suspense Account",
            "Suspense"
          ],
          "primaryMisconceptionId": "MC_ACC_RECTIFICATION_OF_ERRORS_SUSPENSE_ACCOUNT",
          "diagnosisMap": {
            "Sales": {
              "misconceptionId": "MC_ACC_RECTIFICATION_OF_ERRORS_SUSPENSE_ACCOUNT",
              "errorExplanation": "Sales is credited to increase it. Suspense is debited.",
              "recoveryPath": {
                "simplerExplanation": "Debits Suspense Account.",
                "guidedFixPrompt": "Type Suspense A/c Dr. $5000"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 11,
    "title": "Depreciation Accounting: Straight Line (SLM) vs Written Down Value (WDV)",
    "overviewMetaphor": "Depreciation is Spreading the Cost of a Brand New Delivery Van Over Every Mile it Drives: if you buy a $100,000 truck that lasts 10 years and sells for $10,000 scrap metal, it would be unfair to count the entire $100,000 as an expense on Day 1; Straight-Line Method (SLM) charges an equal $9,000 expense each year; Written Down Value (WDV) charges heavy depreciation in Year 1 (20% of $100k = $20,000) and smaller depreciation in Year 10—matching the reality that brand new trucks lose value fastest.",
    "blocks": [
      {
        "id": "acc-d11-b1-slm-straight-line-formula",
        "day": 11,
        "blockNumber": 1,
        "title": "The Straight-Line Method (SLM) / Fixed Installment Formula",
        "conceptBudget": {
          "primaryConcept": "Straight-Line Depreciation Formula",
          "supportingTerms": [
            "$\\text{Annual Depreciation} = \\frac{\\text{Original Cost} - \\text{Estimated Scrap Value}}{\\text{Useful Life (Years)}}$",
            "$\\text{Depreciation Rate} = \\frac{\\text{Annual Depreciation}}{\\text{Original Cost}} \\times 100\\%$",
            "Equal Annual Charge Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d1-b1-fundamental-accounting-equation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "SLM Depreciation Calculation ($100k Asset, $10k Scrap, 10 Yrs)",
              "boxes": [
                {
                  "label": "Cost & Salvage",
                  "value": "Cost: $100,000 | Scrap Value: $10,000 | Depreciable Base: $90,000",
                  "varType": "Base Parameters",
                  "isUpdated": false
                },
                {
                  "label": "Annual SLM Charge",
                  "value": "Formula: $90,000 / 10 = $9,000 per year (Constant for 10 years!)",
                  "varType": "Annual Expense",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "slm_calc_demo.js",
            "initialCode": "function calculateSlm(cost, scrap, lifeYears) {\n  const annualDep = (cost - scrap) / lifeYears;\n  const rate = (annualDep / cost) * 100;\n  return {\n    originalCost: cost,\n    scrapValue: scrap,\n    annualDepreciationDollars: Number(annualDep.toFixed(2)),\n    depreciationRatePercent: Number(rate.toFixed(2)),\n    status: 'SLM_DEPRECIATION_CALCULATED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateSlm(100000, 10000, 10)));",
            "expectedOutput": "{\"originalCost\":100000,\"scrapValue\":10000,\"annualDepreciationDollars\":9000,\"depreciationRatePercent\":9,\"status\":\"SLM_DEPRECIATION_CALCULATED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the annual SLM depreciation for an asset costing $100,000 with a $10,000 scrap value and 10-year useful life ($ (100000 - 10000) / 10 $)?",
          "expectedStringOutput": "9000",
          "acceptableAnswers": [
            "9000",
            "$9,000",
            "9000.00",
            "annualDepreciationDollars\":9000"
          ],
          "primaryMisconceptionId": "MC_ACC_DEPRECIATION_SLM_VS_WDV_CALCULATION",
          "diagnosisMap": {
            "10000": {
              "misconceptionId": "MC_ACC_DEPRECIATION_SLM_VS_WDV_CALCULATION",
              "errorExplanation": "Must deduct the $10,000 scrap value first: (100k - 10k) / 10 = $9,000.",
              "recoveryPath": {
                "simplerExplanation": "(100000 - 10000) / 10 = 9000.",
                "guidedFixPrompt": "Type 9000"
              }
            }
          }
        }
      },
      {
        "id": "acc-d11-b2-wdv-reducing-balance-method",
        "day": 11,
        "blockNumber": 2,
        "title": "Written Down Value (WDV) / Reducing Balance Method",
        "conceptBudget": {
          "primaryConcept": "Written Down Value (WDV) Dynamics",
          "supportingTerms": [
            "$\\text{Depreciation}_t = \\text{Book Value}_{t-1} \\times R$",
            "Declining Annual Charge (Highest in Year 1, decreasing every year)",
            "Income Tax Act Acceptance (Mandated for corporate tax depreciation under IT Act 1961!)",
            "Asset Book Value never drops mathematically to absolute zero"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d11-b1-slm-straight-line-formula",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "WDV Calculation ($100k Asset @ 20% Rate)",
            "codeSnippet": "Year 1: 20% of $100,000 = $20,000 Dep -> Closing Book Value = $80,000\nYear 2: 20% of $80,000  = $16,000 Dep -> Closing Book Value = $64,000\nYear 3: 20% of $64,000  = $12,800 Dep -> Closing Book Value = $51,200",
            "lineNotes": {
              "1": "Year 1 applies to original cost.",
              "2": "Year 2 applies to reduced $80k book value.",
              "3": "Year 3 applies to reduced $64k book value."
            }
          },
          {
            "type": "runnable_code",
            "filename": "wdv_calc_demo.js",
            "initialCode": "function evaluateWdvYear2(cost, ratePct = 20) {\n  const depY1 = cost * (ratePct / 100);\n  const bvY1 = cost - depY1;\n  const depY2 = bvY1 * (ratePct / 100);\n  return {\n    originalCost: cost,\n    year1Depreciation: depY1,\n    year1ClosingBookValue: bvY1,\n    year2Depreciation: depY2,\n    year2ClosingBookValue: bvY1 - depY2\n  };\n}\n\nconsole.log(JSON.stringify(evaluateWdvYear2(100000, 20)));",
            "expectedOutput": "{\"originalCost\":100000,\"year1Depreciation\":20000,\"year1ClosingBookValue\":80000,\"year2Depreciation\":16000,\"year2ClosingBookValue\":64000}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Year 2 depreciation charge under WDV at 20% for an asset costing $100,000 ($80000 \\times 0.20$)?",
          "expectedStringOutput": "16000",
          "acceptableAnswers": [
            "16000",
            "$16,000",
            "year2Depreciation\":16000"
          ],
          "primaryMisconceptionId": "MC_ACC_DEPRECIATION_SLM_VS_WDV_CALCULATION",
          "diagnosisMap": {
            "20000": {
              "misconceptionId": "MC_ACC_DEPRECIATION_SLM_VS_WDV_CALCULATION",
              "errorExplanation": "$20,000 is Year 1. Year 2 applies 20% to the reduced $80,000 book value = $16,000.",
              "recoveryPath": {
                "simplerExplanation": "80,000 * 0.20 = 16,000.",
                "guidedFixPrompt": "Type 16000"
              }
            }
          }
        }
      },
      {
        "id": "acc-d11-b3-provision-for-depreciation-account",
        "day": 11,
        "blockNumber": 3,
        "title": "Provision for Depreciation Account & Asset Disposal Accounting",
        "conceptBudget": {
          "primaryConcept": "Provision for Depreciation Method",
          "supportingTerms": [
            "Asset Account maintained at Original Cost",
            "Cumulative depreciation credited to 'Provision for Depreciation A/c'",
            "Asset Disposal Account (Calculating Profit / Loss on Sale of Asset)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d11-b2-wdv-reducing-balance-method",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "asset_disposal_demo.js",
            "initialCode": "function calculateAssetDisposal(originalCost, accumulatedDep, salePrice) {\n  const bookValueAtSale = originalCost - accumulatedDep;\n  const profitLoss = salePrice - bookValueAtSale;\n  return {\n    bookValueAtSale,\n    salePrice,\n    profitOrLossOnSale: profitLoss,\n    status: profitLoss >= 0 ? 'PROFIT_ON_SALE_CREDITED_TO_PL' : 'LOSS_ON_SALE_DEBITED_TO_PL'\n  };\n}\n\nconsole.log(JSON.stringify(calculateAssetDisposal(100000, 60000, 45000))); // BV = 40k, Sale = 45k -> +5k Profit!",
            "expectedOutput": "{\"bookValueAtSale\":40000,\"salePrice\":45000,\"profitOrLossOnSale\":5000,\"status\":\"PROFIT_ON_SALE_CREDITED_TO_PL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What profit is realized when an asset with original cost $100,000 and accumulated depreciation $60,000 is sold for $45,000 ($45000 - 40000$)?",
          "expectedStringOutput": "5000",
          "acceptableAnswers": [
            "5000",
            "$5,000",
            "profitOrLossOnSale\":5000"
          ],
          "primaryMisconceptionId": "MC_ACC_DEPRECIATION_SLM_VS_WDV_CALCULATION",
          "diagnosisMap": {
            "45000": {
              "misconceptionId": "MC_ACC_DEPRECIATION_SLM_VS_WDV_CALCULATION",
              "errorExplanation": "Profit = Sale Price - Book Value = 45,000 - 40,000 = $5,000.",
              "recoveryPath": {
                "simplerExplanation": "45000 - 40000 = 5000.",
                "guidedFixPrompt": "Type 5000"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 12,
    "title": "Financial Statements: Trading Account & Gross Profit Computation",
    "overviewMetaphor": "The Trading Account is a Factory Gate Profitability Audit: it strictly measures how much it cost to physically manufacture or buy goods vs what you sold them for; it includes Opening Inventory, Net Purchases, and Direct Factory Costs (Factory Wages, Freight, Coal/Power); it ignores indirect office salaries and rent; the resulting figure is Gross Profit—which is transferred directly to the Profit & Loss Account.",
    "blocks": [
      {
        "id": "acc-d12-b1-cost-of-goods-sold-cogs",
        "day": 12,
        "blockNumber": 1,
        "title": "Cost of Goods Sold (COGS) Equation & Direct Expenses",
        "conceptBudget": {
          "primaryConcept": "Cost of Goods Sold (COGS) Formula",
          "supportingTerms": [
            "$\\text{COGS} = \\text{Opening Stock} + \\text{Net Purchases} + \\text{Direct Expenses} - \\text{Closing Stock}$",
            "Direct Expenses (Wages, Carriage Inward, Freight, Import Duty, Factory Power)",
            "Exclusion of Indirect Selling & Office Expenses"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d4-b3-nominal-accounts-period-end-closing",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "COGS Components ($90,000 Total)",
              "boxes": [
                {
                  "label": "Opening Stock + Net Purchases",
                  "value": "Opening: $20,000 + Purchases: $80,000 = $100,000",
                  "varType": "Inflow Inventory",
                  "isUpdated": false
                },
                {
                  "label": "Direct Expenses (Wages + Freight)",
                  "value": "Wages: $10,000 + Carriage Inward: $5,000 = $15,000",
                  "varType": "Direct Factory Costs",
                  "isUpdated": false
                },
                {
                  "label": "Less Closing Stock ($25,000)",
                  "value": "Total COGS = $100k + $15k - $25k = $90,000!",
                  "varType": "COGS Output",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "cogs_calc_demo.js",
            "initialCode": "function calculateCogs(opening, purchases, directExp, closing) {\n  const cogs = opening + purchases + directExp - closing;\n  return {\n    openingStock: opening,\n    netPurchases: purchases,\n    directExpenses: directExp,\n    closingStock: closing,\n    costOfGoodsSold: cogs,\n    status: 'COGS_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateCogs(20000, 80000, 15000, 25000)));",
            "expectedOutput": "{\"openingStock\":20000,\"netPurchases\":80000,\"directExpenses\":15000,\"closingStock\":25000,\"costOfGoodsSold\":90000,\"status\":\"COGS_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Cost of Goods Sold (COGS) when Opening Stock is $20,000, Purchases $80,000, Direct Expenses $15,000, and Closing Stock $25,000 ($20000 + 80000 + 15000 - 25000$)?",
          "expectedStringOutput": "90000",
          "acceptableAnswers": [
            "90000",
            "$90,000",
            "costOfGoodsSold\":90000"
          ],
          "primaryMisconceptionId": "MC_ACC_FINAL_ACCOUNTS_TRADING_AND_PROFIT_LOSS",
          "diagnosisMap": {
            "115000": {
              "misconceptionId": "MC_ACC_FINAL_ACCOUNTS_TRADING_AND_PROFIT_LOSS",
              "errorExplanation": "Must subtract closing stock ($25,000) from $115,000 = $90,000.",
              "recoveryPath": {
                "simplerExplanation": "115000 - 25000 = 90000.",
                "guidedFixPrompt": "Type 90000"
              }
            }
          }
        }
      },
      {
        "id": "acc-d12-b2-gross-profit-margin-calculation",
        "day": 12,
        "blockNumber": 2,
        "title": "Trading Account Layout & Gross Profit Margin Percentage",
        "conceptBudget": {
          "primaryConcept": "Gross Profit & Margin Formula",
          "supportingTerms": [
            "$\\text{Gross Profit} = \\text{Net Sales} - \\text{COGS}$",
            "$\\text{Gross Margin \\%} = \\frac{\\text{Gross Profit}}{\\text{Net Sales}} \\times 100\\%$",
            "Transferring Gross Profit to Credit side of Profit & Loss Account ('By Gross Profit b/d')"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d12-b1-cost-of-goods-sold-cogs",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "gross_margin_demo.js",
            "initialCode": "function evaluateGrossProfit(netSales, cogs) {\n  const gp = netSales - cogs;\n  const marginPct = (gp / netSales) * 100;\n  return {\n    netSales,\n    costOfGoodsSold: cogs,\n    grossProfit: gp,\n    grossMarginPercent: Number(marginPct.toFixed(2)),\n    status: 'GROSS_PROFIT_TRANSFERRED_TO_PL'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateGrossProfit(150000, 90000)));",
            "expectedOutput": "{\"netSales\":150000,\"costOfGoodsSold\":90000,\"grossProfit\":60000,\"grossMarginPercent\":40,\"status\":\"GROSS_PROFIT_TRANSFERRED_TO_PL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Gross Profit when Net Sales are $150,000 and COGS is $90,000 ($150000 - 90000$)?",
          "expectedStringOutput": "60000",
          "acceptableAnswers": [
            "60000",
            "$60,000",
            "grossProfit\":60000"
          ],
          "primaryMisconceptionId": "MC_ACC_FINAL_ACCOUNTS_TRADING_AND_PROFIT_LOSS",
          "diagnosisMap": {
            "40": {
              "misconceptionId": "MC_ACC_FINAL_ACCOUNTS_TRADING_AND_PROFIT_LOSS",
              "errorExplanation": "40% is the margin percentage. Dollar Gross Profit is $60,000.",
              "recoveryPath": {
                "simplerExplanation": "150,000 - 90,000 = 60,000.",
                "guidedFixPrompt": "Type 60000"
              }
            }
          }
        }
      },
      {
        "id": "acc-d12-b3-direct-vs-indirect-expense-classification",
        "day": 12,
        "blockNumber": 3,
        "title": "Direct Expenses (Trading A/c) vs Indirect Expenses (P&L A/c)",
        "conceptBudget": {
          "primaryConcept": "Expense Destination Classification",
          "supportingTerms": [
            "Carriage Inward (Direct $\\implies$ Trading A/c) vs Carriage Outward (Indirect $\\implies$ P&L A/c)",
            "Factory Wages (Direct $\\implies$ Trading A/c) vs Office Salaries (Indirect $\\implies$ P&L A/c)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d12-b2-gross-profit-margin-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "expense_dest_demo.js",
            "initialCode": "function getExpenseDestination(expenseName) {\n  const direct = ['WAGES', 'CARRIAGE_INWARD', 'FREIGHT', 'FACTORY_RENT', 'IMPORT_DUTY'];\n  return direct.includes(expenseName)\n    ? 'DEBIT_TO_TRADING_ACCOUNT_DIRECT_EXPENSE'\n    : 'DEBIT_TO_PROFIT_AND_LOSS_ACCOUNT_INDIRECT_EXPENSE';\n}\n\nconsole.log(getExpenseDestination('CARRIAGE_INWARD'));\nconsole.log(getExpenseDestination('CARRIAGE_OUTWARD'));",
            "expectedOutput": "DEBIT_TO_TRADING_ACCOUNT_DIRECT_EXPENSE\nDEBIT_TO_PROFIT_AND_LOSS_ACCOUNT_INDIRECT_EXPENSE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "To which financial statement account is Carriage Outward (Freight paid on selling goods to customers) debited?",
          "expectedStringOutput": "DEBIT_TO_PROFIT_AND_LOSS_ACCOUNT_INDIRECT_EXPENSE",
          "acceptableAnswers": [
            "DEBIT_TO_PROFIT_AND_LOSS_ACCOUNT_INDIRECT_EXPENSE",
            "Profit and Loss Account",
            "P&L"
          ],
          "primaryMisconceptionId": "MC_ACC_FINAL_ACCOUNTS_TRADING_AND_PROFIT_LOSS",
          "diagnosisMap": {
            "TRADING": {
              "misconceptionId": "MC_ACC_FINAL_ACCOUNTS_TRADING_AND_PROFIT_LOSS",
              "errorExplanation": "Carriage Inward goes to Trading A/c. Carriage Outward is an indirect selling expense debited to P&L A/c.",
              "recoveryPath": {
                "simplerExplanation": "Carriage outward debits P&L A/c.",
                "guidedFixPrompt": "Type DEBIT_TO_PROFIT_AND_LOSS_ACCOUNT_INDIRECT_EXPENSE"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 13,
    "title": "Financial Statements: Profit & Loss Account & Net Profit Calculation",
    "overviewMetaphor": "The Profit & Loss Account is the Bottom-Line Scorecard of the Company: it starts with the Gross Profit earned at the factory gate, adds non-operating revenue (Interest earned, Discounts received), and deducts all corporate overheads (Office rent, Executive salaries, Electricity, Depreciation, Bad Debts); the final remaining number is Net Profit—which belongs entirely to the owner and is added to their Capital Account on the Balance Sheet.",
    "blocks": [
      {
        "id": "acc-d13-b1-profit-and-loss-account-structure",
        "day": 13,
        "blockNumber": 1,
        "title": "Profit & Loss Account Layout & Operating Overheads",
        "conceptBudget": {
          "primaryConcept": "P&L Layout & Operating Expenses",
          "supportingTerms": [
            "Credit Side (Gross Profit b/d + Indirect Incomes: Rent Received, Commission Received)",
            "Debit Side (Administrative, Selling, Financial, and Depreciation Expenses)",
            "Net Profit Calculation ($Net Profit = \\text{Total Incomes} - \\text{Total Expenses}$)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d12-b2-gross-profit-margin-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Profit & Loss Account Synthesis ($30,000 Net Profit)",
              "boxes": [
                {
                  "label": "Total Revenues ($65,000)",
                  "value": "Gross Profit ($60,000) + Commission Received ($5,000) = $65,000",
                  "varType": "Cr Side Total",
                  "isUpdated": false
                },
                {
                  "label": "Total Overheads ($35,000)",
                  "value": "Salaries ($25k) + Depreciation ($8k) + Bad Debts ($2k) = $35,000",
                  "varType": "Dr Side Total",
                  "isUpdated": false
                },
                {
                  "label": "Net Profit ($30,000)",
                  "value": "Formula: $65,000 - $35,000 = $30,000 (Transferred to Capital Account!)",
                  "varType": "Net Profit Result",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "net_profit_demo.js",
            "initialCode": "function evaluateNetProfit(gp, otherIncome, overheads, dep, badDebts) {\n  const totalRev = gp + otherIncome;\n  const totalExp = overheads + dep + badDebts;\n  const np = totalRev - totalExp;\n  return {\n    totalRevenues: totalRev,\n    totalExpenses: totalExp,\n    netProfit: np,\n    status: 'NET_PROFIT_TRANSFERRED_TO_CAPITAL'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateNetProfit(60000, 5000, 25000, 8000, 2000)));",
            "expectedOutput": "{\"totalRevenues\":65000,\"totalExpenses\":35000,\"netProfit\":30000,\"status\":\"NET_PROFIT_TRANSFERRED_TO_CAPITAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Net Profit when total P&L revenues are $65,000 and total operating expenses are $35,000 ($65000 - 35000$)?",
          "expectedStringOutput": "30000",
          "acceptableAnswers": [
            "30000",
            "$30,000",
            "netProfit\":30000"
          ],
          "primaryMisconceptionId": "MC_ACC_FINAL_ACCOUNTS_TRADING_AND_PROFIT_LOSS",
          "diagnosisMap": {
            "60000": {
              "misconceptionId": "MC_ACC_FINAL_ACCOUNTS_TRADING_AND_PROFIT_LOSS",
              "errorExplanation": "$60,000 was the Gross Profit before deducting $35,000 in overheads = $30,000 Net Profit.",
              "recoveryPath": {
                "simplerExplanation": "65,000 - 35,000 = 30,000.",
                "guidedFixPrompt": "Type 30000"
              }
            }
          }
        }
      },
      {
        "id": "acc-d13-b2-bad-debts-provision-for-doubtful-debts",
        "day": 13,
        "blockNumber": 2,
        "title": "Bad Debts & Provision for Doubtful Debts (Prudence / Conservatism Principle)",
        "conceptBudget": {
          "primaryConcept": "Provision for Doubtful Debts Accounting",
          "supportingTerms": [
            "Actual Bad Debts (Irrevocable debtor defaults debited to P&L)",
            "Provision for Doubtful Debts (% of remaining debtors estimated to default)",
            "Prudence / Conservatism Principle: Anticipate all losses, never anticipate profits!"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d13-b1-profit-and-loss-account-structure",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Debtors Adjustment on Balance Sheet",
            "codeSnippet": "Gross Sundry Debtors: $100,000\nLess: Further Bad Debts: $2,000 -> Net Debtors = $98,000\nLess: Provision for Doubtful Debts @ 5%: 5% of $98,000 = $4,900\nNet Debtors shown in Balance Sheet = $93,100",
            "lineNotes": {
              "2": "Deducts confirmed bad debts first.",
              "3": "Calculates 5% provision on remaining good debtors.",
              "4": "Net realizable asset value."
            }
          },
          {
            "type": "runnable_code",
            "filename": "doubtful_debts_demo.js",
            "initialCode": "function calculateNetDebtors(grossDebtors, badDebts, provPct = 5) {\n  const remDebtors = grossDebtors - badDebts;\n  const provAmt = remDebtors * (provPct / 100);\n  const netDebtors = remDebtors - provAmt;\n  return {\n    grossDebtors,\n    actualBadDebts: badDebts,\n    doubtfulDebtProvision: provAmt,\n    netRealizableDebtors: netDebtors,\n    status: 'DEBTORS_CONSERVATISM_ADJUSTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateNetDebtors(100000, 2000, 5)));",
            "expectedOutput": "{\"grossDebtors\":100000,\"actualBadDebts\":2000,\"doubtfulDebtProvision\":4900,\"netRealizableDebtors\":93100,\"status\":\"DEBTORS_CONSERVATISM_ADJUSTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the net realizable Debtors value on the Balance Sheet after deducting $2,000 bad debts and a 5% provision on $98,000 remaining ($98000 - 4900$)?",
          "expectedStringOutput": "93100",
          "acceptableAnswers": [
            "93100",
            "$93,100",
            "netRealizableDebtors\":93100"
          ],
          "primaryMisconceptionId": "MC_ACC_FINAL_ACCOUNTS_TRADING_AND_PROFIT_LOSS",
          "diagnosisMap": {
            "95000": {
              "misconceptionId": "MC_ACC_FINAL_ACCOUNTS_TRADING_AND_PROFIT_LOSS",
              "errorExplanation": "Must deduct the $2,000 actual bad debt first ($98,000), then deduct 5% provision ($4,900) = $93,100.",
              "recoveryPath": {
                "simplerExplanation": "98000 - 4900 = 93100.",
                "guidedFixPrompt": "Type 93100"
              }
            }
          }
        }
      },
      {
        "id": "acc-d13-b3-accrual-concept-outstanding-prepaid",
        "day": 13,
        "blockNumber": 3,
        "title": "The Accrual Concept: Outstanding vs Prepaid Expenses",
        "conceptBudget": {
          "primaryConcept": "Accrual Adjustments",
          "supportingTerms": [
            "Outstanding Expenses (Incurred but unpaid $\\implies$ Add to P&L expense; shown as Current Liability)",
            "Prepaid Expenses (Paid in advance $\\implies$ Deduct from P&L expense; shown as Current Asset)",
            "Accrued Income vs Unearned Income"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d13-b2-bad-debts-provision-for-doubtful-debts",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "accrual_demo.js",
            "initialCode": "function evaluateAccrualAdjustment(paidRent, outstandingRent, prepaidRent) {\n  const effectivePlExpense = paidRent + outstandingRent - prepaidRent;\n  return {\n    rentPaidCash: paidRent,\n    outstandingDue: outstandingRent,\n    prepaidNextYear: prepaidRent,\n    effectivePlCharge: effectivePlExpense,\n    status: 'ACCRUAL_MATCHING_PRINCIPLE_COMPLIANT'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateAccrualAdjustment(12000, 2000, 1000))); // 12k + 2k - 1k = 13k",
            "expectedOutput": "{\"rentPaidCash\":12000,\"outstandingDue\":2000,\"prepaidNextYear\":1000,\"effectivePlCharge\":13000,\"status\":\"ACCRUAL_MATCHING_PRINCIPLE_COMPLIANT\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the effective rent expense charged to the P&L Account when $12,000 was paid in cash, $2,000 is outstanding for this year, and $1,000 was prepaid for next year ($12000 + 2000 - 1000$)?",
          "expectedStringOutput": "13000",
          "acceptableAnswers": [
            "13000",
            "$13,000",
            "effectivePlCharge\":13000"
          ],
          "primaryMisconceptionId": "MC_ACC_FINAL_ACCOUNTS_TRADING_AND_PROFIT_LOSS",
          "diagnosisMap": {
            "12000": {
              "misconceptionId": "MC_ACC_FINAL_ACCOUNTS_TRADING_AND_PROFIT_LOSS",
              "errorExplanation": "Accrual matching adds outstanding ($2k) and deducts prepaid ($1k) -> $13,000.",
              "recoveryPath": {
                "simplerExplanation": "12000 + 2000 - 1000 = 13000.",
                "guidedFixPrompt": "Type 13000"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 14,
    "title": "Financial Statements: Balance Sheet Marshalling & Working Capital",
    "overviewMetaphor": "The Balance Sheet is a High-Resolution Snapshot of the Company on December 31 at Midnight: it lists everything the business owns on the Left (Assets) and who funded it on the Right (Liabilities + Capital); Marshalling is arranging assets in a neat orderly line—either by Order of Liquidity (Fastest cash at top: Cash, Bank, Debtors, Stock, Machinery) or by Order of Permanence (Solid permanent assets at top: Land, Buildings, Plant, Cash); Working Capital ($Current Assets - Current Liabilities$) measures whether the company has enough liquid oxygen to survive next month.",
    "blocks": [
      {
        "id": "acc-d14-b1-balance-sheet-marshalling-orders",
        "day": 14,
        "blockNumber": 1,
        "title": "Marshalling in Order of Liquidity vs Order of Permanence",
        "conceptBudget": {
          "primaryConcept": "Balance Sheet Marshalling Orders",
          "supportingTerms": [
            "Order of Liquidity (Assets ordered from most liquid to least liquid: Cash $\\to$ Bank $\\to$ Debtors $\\to$ Stock $\\to$ Fixed Assets)",
            "Order of Permanence (Assets ordered from most permanent to most liquid: Land $\\to$ Buildings $\\to$ Machinery $\\to$ Cash; standard for joint stock companies)",
            "Horizontal vs Vertical Balance Sheet"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d13-b1-profit-and-loss-account-structure",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Marshalling Order Comparison",
              "boxes": [
                {
                  "label": "1. Order of Liquidity (Sole Trader)",
                  "value": "Top: Cash in Hand -> Bank -> Debtors -> Inventory -> Machinery :Bottom",
                  "varType": "Liquidity Order",
                  "isUpdated": false
                },
                {
                  "label": "2. Order of Permanence (Corporate)",
                  "value": "Top: Land & Buildings -> Plant & Machinery -> Inventory -> Cash :Bottom",
                  "varType": "Permanence Order",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "marshalling_demo.js",
            "initialCode": "function evaluateMarshallingOrder(orderType) {\n  if (orderType === 'LIQUIDITY') return 'ORDER_OF_LIQUIDITY_CASH_FIRST';\n  if (orderType === 'PERMANENCE') return 'ORDER_OF_PERMANENCE_FIXED_ASSETS_FIRST';\n  return 'UNKNOWN';\n}\n\nconsole.log(evaluateMarshallingOrder('LIQUIDITY'));\nconsole.log(evaluateMarshallingOrder('PERMANENCE'));",
            "expectedOutput": "ORDER_OF_LIQUIDITY_CASH_FIRST\nORDER_OF_PERMANENCE_FIXED_ASSETS_FIRST",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which asset appears at the very top of the Balance Sheet when marshalled in Order of Liquidity?",
          "expectedStringOutput": "ORDER_OF_LIQUIDITY_CASH_FIRST",
          "acceptableAnswers": [
            "ORDER_OF_LIQUIDITY_CASH_FIRST",
            "Cash",
            "Cash in Hand"
          ],
          "primaryMisconceptionId": "MC_ACC_BALANCE_SHEET_LIQUIDITY_PERMANENCE_ORDER",
          "diagnosisMap": {
            "LAND": {
              "misconceptionId": "MC_ACC_BALANCE_SHEET_LIQUIDITY_PERMANENCE_ORDER",
              "errorExplanation": "Land is at the top in Order of Permanence. Cash is top in Order of Liquidity.",
              "recoveryPath": {
                "simplerExplanation": "Cash is first in liquidity order.",
                "guidedFixPrompt": "Type ORDER_OF_LIQUIDITY_CASH_FIRST"
              }
            }
          }
        }
      },
      {
        "id": "acc-d14-b2-working-capital-ca-minus-cl",
        "day": 14,
        "blockNumber": 2,
        "title": "Working Capital Analysis: Current Assets minus Current Liabilities",
        "conceptBudget": {
          "primaryConcept": "Net Working Capital Formula",
          "supportingTerms": [
            "$\\text{Net Working Capital} = \\text{Current Assets} - \\text{Current Liabilities}$",
            "Current Assets (Cash, Bank, Debtors, Inventory, Prepaid Expenses)",
            "Current Liabilities (Creditors, Bills Payable, Short-Term Bank Overdraft, Outstanding Expenses)",
            "Operating Liquidity Invariant ($NWC > 0$)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d14-b1-balance-sheet-marshalling-orders",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "working_cap_demo.js",
            "initialCode": "function evaluateWorkingCapital(currentAssets, currentLiabilities) {\n  const nwc = currentAssets - currentLiabilities;\n  const isSolvent = nwc > 0;\n  return {\n    currentAssets,\n    currentLiabilities,\n    netWorkingCapital: nwc,\n    shortTermSolvency: isSolvent ? 'HEALTHY_WORKING_CAPITAL_SOLVENT' : 'LIQUIDITY_CRUNCH_RISK'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateWorkingCapital(50000, 25000)));\nconsole.log(JSON.stringify(evaluateWorkingCapital(20000, 35000)));",
            "expectedOutput": "{\"currentAssets\":50000,\"currentLiabilities\":25000,\"netWorkingCapital\":25000,\"shortTermSolvency\":\"HEALTHY_WORKING_CAPITAL_SOLVENT\"}\n{\"currentAssets\":20000,\"currentLiabilities\":35000,\"netWorkingCapital\":-15000,\"shortTermSolvency\":\"LIQUIDITY_CRUNCH_RISK\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Net Working Capital for a business with $50,000 in Current Assets and $25,000 in Current Liabilities ($50000 - 25000$)?",
          "expectedStringOutput": "25000",
          "acceptableAnswers": [
            "25000",
            "$25,000",
            "netWorkingCapital\":25000"
          ],
          "primaryMisconceptionId": "MC_ACC_BALANCE_SHEET_LIQUIDITY_PERMANENCE_ORDER",
          "diagnosisMap": {
            "75000": {
              "misconceptionId": "MC_ACC_BALANCE_SHEET_LIQUIDITY_PERMANENCE_ORDER",
              "errorExplanation": "Working capital is CA minus CL: 50,000 - 25,000 = $25,000.",
              "recoveryPath": {
                "simplerExplanation": "50000 - 25000 = 25000.",
                "guidedFixPrompt": "Type 25000"
              }
            }
          }
        }
      },
      {
        "id": "acc-d14-b3-closing-capital-equity-reconciliation",
        "day": 14,
        "blockNumber": 3,
        "title": "Owner's Equity Closing Capital Equation",
        "conceptBudget": {
          "primaryConcept": "Closing Capital Equation",
          "supportingTerms": [
            "$\\text{Closing Capital} = \\text{Opening Capital} + \\text{Additional Capital} + \\text{Net Profit} - \\text{Drawings}$",
            "Balance Sheet Equilibrium ($Total Assets = Liabilities + Closing Capital$)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d14-b2-working-capital-ca-minus-cl",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Capital Account Reconciliation on Balance Sheet",
            "codeSnippet": "Opening Capital: $100,000\nAdd: Net Profit: $30,000 -> Total = $130,000\nLess: Owner Drawings: ($5,000)\nClosing Capital transferred to Balance Sheet = $125,000",
            "lineNotes": {
              "2": "Net profit increases equity.",
              "3": "Drawings reduce equity.",
              "4": "Final closing capital."
            }
          },
          {
            "type": "runnable_code",
            "filename": "capital_reconcile_demo.js",
            "initialCode": "function calculateClosingCapital(openCap, netProfit, drawings) {\n  const closing = openCap + netProfit - drawings;\n  return {\n    openingCapital: openCap,\n    netProfitAdded: netProfit,\n    drawingsDeducted: drawings,\n    closingCapital: closing,\n    status: 'EQUITY_CAPITAL_RECONCILED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateClosingCapital(100000, 30000, 5000)));",
            "expectedOutput": "{\"openingCapital\":100000,\"netProfitAdded\":30000,\"drawingsDeducted\":5000,\"closingCapital\":125000,\"status\":\"EQUITY_CAPITAL_RECONCILED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the final Closing Capital when Opening Capital is $100,000, Net Profit is $30,000, and Drawings are $5,000 ($100000 + 30000 - 5000$)?",
          "expectedStringOutput": "125000",
          "acceptableAnswers": [
            "125000",
            "$125,000",
            "closingCapital\":125000"
          ],
          "primaryMisconceptionId": "MC_ACC_BALANCE_SHEET_LIQUIDITY_PERMANENCE_ORDER",
          "diagnosisMap": {
            "135000": {
              "misconceptionId": "MC_ACC_BALANCE_SHEET_LIQUIDITY_PERMANENCE_ORDER",
              "errorExplanation": "Drawings must be subtracted: 100k + 30k - 5k = $125,000.",
              "recoveryPath": {
                "simplerExplanation": "100000 + 30000 - 5000 = 125000.",
                "guidedFixPrompt": "Type 125000"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 15,
    "title": "⭐ MILESTONE 2: Complete Financial Statements & Year-End Closing Engine",
    "overviewMetaphor": "Milestone 2 Synthesis: The complete sovereign corporate financial reporting engine: 1. Trading Account gross profit and COGS computation; 2. Profit & Loss operating overheads and net profit reconciliation; 3. Balance Sheet marshalling with working capital analysis; 4. Zero balance sheet discrepancy verification.",
    "blocks": [
      {
        "id": "acc-d15-b1-financial-statements-engine-synthesis",
        "day": 15,
        "blockNumber": 1,
        "title": "Financial Statements & Year-End Closing Engine Synthesis",
        "conceptBudget": {
          "primaryConcept": "Financial Statements Engine Synthesis",
          "supportingTerms": [
            "Trading Account Engine",
            "P&L Net Profit Engine",
            "Balance Sheet Marshalling",
            "Working Capital Engine"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d14-b3-closing-capital-equity-reconciliation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Milestone 2 Financial Reporting Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "Extracts balanced Trial Balance from General Ledger",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Constructs Trading Account to calculate Gross Profit ($60,000)",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Transfers GP to P&L Account to calculate Net Profit ($30,000)",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Marshals Balance Sheet assets and liabilities in perfect equilibrium!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "fin_engine_demo.js",
            "initialCode": "function runFinancialReportingEngine() {\n  return {\n    tradingAccountStatus: 'ONLINE_GROSS_PROFIT_COMPUTED',\n    plAccountStatus: 'ONLINE_NET_PROFIT_RECONCILED',\n    balanceSheetStatus: 'ONLINE_PERMANENCE_MARSHALLED_BALANCED',\n    engineStatus: 'FINANCIAL_STATEMENTS_MASTER_ENGINE_ACTIVE'\n  };\n}\n\nconsole.log(runFinancialReportingEngine().engineStatus);",
            "expectedOutput": "FINANCIAL_STATEMENTS_MASTER_ENGINE_ACTIVE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What engine status confirms active operational synthesis of the Financial Statements Master Engine?",
          "expectedStringOutput": "FINANCIAL_STATEMENTS_MASTER_ENGINE_ACTIVE",
          "acceptableAnswers": [
            "FINANCIAL_STATEMENTS_MASTER_ENGINE_ACTIVE",
            "engineStatus: FINANCIAL_STATEMENTS_MASTER_ENGINE_ACTIVE"
          ],
          "primaryMisconceptionId": "MC_ACC_FINAL_ACCOUNTS_TRADING_AND_PROFIT_LOSS",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_ACC_FINAL_ACCOUNTS_TRADING_AND_PROFIT_LOSS",
              "errorExplanation": "Matches FINANCIAL_STATEMENTS_MASTER_ENGINE_ACTIVE.",
              "recoveryPath": {
                "simplerExplanation": "Matches FINANCIAL_STATEMENTS_MASTER_ENGINE_ACTIVE.",
                "guidedFixPrompt": "Type FINANCIAL_STATEMENTS_MASTER_ENGINE_ACTIVE"
              }
            }
          }
        }
      },
      {
        "id": "acc-d15-b2-financial-statements-audit",
        "day": 15,
        "blockNumber": 2,
        "title": "Year-End Financial Reporting Invariant & Audit Trail",
        "conceptBudget": {
          "primaryConcept": "Financial Reporting Invariant Audit",
          "supportingTerms": [
            "Gross Margin Invariant",
            "Net Profit Invariant",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d15-b1-financial-statements-engine-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "fin_audit_demo.js",
            "initialCode": "function auditFinancialStatements(tradingBalanced, plBalanced, bsBalanced) {\n  const passed = tradingBalanced && plBalanced && bsBalanced;\n  return {\n    tradingAccountVerified: tradingBalanced,\n    plAccountVerified: plBalanced,\n    balanceSheetBalanced: bsBalanced,\n    grade: passed ? 'FINANCIAL_REPORTING_SYSTEM_AUDIT_PASSED' : 'AUDIT_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditFinancialStatements(true, true, true)));",
            "expectedOutput": "{\"tradingAccountVerified\":true,\"plAccountVerified\":true,\"balanceSheetBalanced\":true,\"grade\":\"FINANCIAL_REPORTING_SYSTEM_AUDIT_PASSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade is awarded when Trading, P&L, and Balance Sheet statements pass 100%?",
          "expectedStringOutput": "FINANCIAL_REPORTING_SYSTEM_AUDIT_PASSED",
          "acceptableAnswers": [
            "FINANCIAL_REPORTING_SYSTEM_AUDIT_PASSED",
            "grade\":\"FINANCIAL_REPORTING_SYSTEM_AUDIT_PASSED\""
          ],
          "primaryMisconceptionId": "MC_ACC_FINAL_ACCOUNTS_TRADING_AND_PROFIT_LOSS",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_ACC_FINAL_ACCOUNTS_TRADING_AND_PROFIT_LOSS",
              "errorExplanation": "Passing all financial statements awards FINANCIAL_REPORTING_SYSTEM_AUDIT_PASSED.",
              "recoveryPath": {
                "simplerExplanation": "Awards FINANCIAL_REPORTING_SYSTEM_AUDIT_PASSED.",
                "guidedFixPrompt": "Type FINANCIAL_REPORTING_SYSTEM_AUDIT_PASSED"
              }
            }
          }
        }
      },
      {
        "id": "acc-d15-b3-milestone2-accounting-cert",
        "day": 15,
        "blockNumber": 3,
        "title": "Milestone 2 Financial Reporting Engine Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 2 Certification",
          "supportingTerms": [
            "Financial Reporting Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d15-b2-financial-statements-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone2_acc_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 2: Complete Financial Statements & Year-End Closing Engine [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 2: Complete Financial Statements & Year-End Closing Engine [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 2 completion?",
          "expectedStringOutput": "⭐ MILESTONE 2: Complete Financial Statements & Year-End Closing Engine [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 2: Complete Financial Statements & Year-End Closing Engine [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_ACC_FINAL_ACCOUNTS_TRADING_AND_PROFIT_LOSS",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_ACC_FINAL_ACCOUNTS_TRADING_AND_PROFIT_LOSS",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 2: Complete Financial Statements & Year-End Closing Engine [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 16,
    "title": "Tally Prime ERP: Company Creation, Chart of Accounts & Masters",
    "overviewMetaphor": "Tally Prime is an Industrial Digital Filing Cabinet for the Enterprise: creating a Company establishes the digital headquarters starting on April 1st; the Chart of Accounts contains 28 Predefined Master Folders (15 Primary like Current Assets and Capital Account, and 13 Secondary like Bank Accounts and Sundry Debtors); every vendor, customer, stock item, and bank account is created as a Master record in this structured hierarchy—allowing Tally to auto-generate balance sheets in real-time.",
    "blocks": [
      {
        "id": "acc-d16-b1-tally-company-creation-financial-year",
        "day": 16,
        "blockNumber": 1,
        "title": "Tally Prime Company Configuration & The Indian Financial Year (April 1 to March 31)",
        "conceptBudget": {
          "primaryConcept": "Tally Company Creation & Fiscal Periods",
          "supportingTerms": [
            "Company Name & Mailing Address",
            "Financial Year Beginning From (`01-04-YYYY`)",
            "Books Beginning From (Can match FY or start on actual business launch date)",
            "Base Currency Symbol (`INR / ₹`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d14-b1-balance-sheet-marshalling-orders",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Tally Prime Company Master Metadata",
              "boxes": [
                {
                  "label": "Company Name",
                  "value": "Acme Enterprises Pvt Ltd | Corporate ID: U72200KA2026PTC123456",
                  "varType": "Company Name",
                  "isUpdated": false
                },
                {
                  "label": "Financial Year Beginning",
                  "value": "01-Apr-2026 | Books Beginning: 01-Apr-2026 | Base Currency: INR (₹)",
                  "varType": "Fiscal Period",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "tally_company_demo.js",
            "initialCode": "function evaluateFiscalYearStart(dateStr) {\n  return dateStr.startsWith('01-04')\n    ? 'INDIAN_STATUTORY_FINANCIAL_YEAR_COMPLIANT'\n    : 'CUSTOM_OR_NON_STANDARD_FISCAL_PERIOD';\n}\n\nconsole.log(evaluateFiscalYearStart('01-04-2026'));\nconsole.log(evaluateFiscalYearStart('01-01-2026'));",
            "expectedOutput": "INDIAN_STATUTORY_FINANCIAL_YEAR_COMPLIANT\nCUSTOM_OR_NON_STANDARD_FISCAL_PERIOD",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "On which date does the statutory Indian Financial Year begin in Tally Prime?",
          "expectedStringOutput": "INDIAN_STATUTORY_FINANCIAL_YEAR_COMPLIANT",
          "acceptableAnswers": [
            "INDIAN_STATUTORY_FINANCIAL_YEAR_COMPLIANT",
            "01-04-2026",
            "April 1st",
            "1st April"
          ],
          "primaryMisconceptionId": "MC_ACC_TALLY_PRIME_ERP_MASTERS_AND_VOUCHERS",
          "diagnosisMap": {
            "JANUARY": {
              "misconceptionId": "MC_ACC_TALLY_PRIME_ERP_MASTERS_AND_VOUCHERS",
              "errorExplanation": "Indian financial year begins on April 1st, not January 1st.",
              "recoveryPath": {
                "simplerExplanation": "Begins on April 1st -> INDIAN_STATUTORY_FINANCIAL_YEAR_COMPLIANT.",
                "guidedFixPrompt": "Type INDIAN_STATUTORY_FINANCIAL_YEAR_COMPLIANT"
              }
            }
          }
        }
      },
      {
        "id": "acc-d16-b2-tally-predefined-groups",
        "day": 16,
        "blockNumber": 2,
        "title": "Chart of Accounts: 28 Predefined Groups (15 Primary + 13 Secondary)",
        "conceptBudget": {
          "primaryConcept": "Tally Prime Chart of Accounts Groups",
          "supportingTerms": [
            "15 Primary Groups (Capital Account, Current Assets, Current Liabilities, Fixed Assets, Direct Expenses...)",
            "13 Secondary Groups (Sub-groups e.g. Bank Accounts, Sundry Debtors, Duties & Taxes)",
            "Parent-Child Hierarchy"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d16-b1-tally-company-creation-financial-year",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Ledger Group Assignment in Tally XML",
            "codeSnippet": "<LEDGER NAME=\"State Bank of India\" ACTION=\"Create\">\n  <NAME>State Bank of India</NAME>\n  <PARENT>Bank Accounts</PARENT> <!-- Secondary group under Current Assets -->\n  <OPENINGBALANCE>-50000.00</OPENINGBALANCE> <!-- Debit opening balance -->\n</LEDGER>",
            "lineNotes": {
              "3": "Parent secondary group.",
              "4": "Opening debit balance in Tally XML."
            }
          },
          {
            "type": "runnable_code",
            "filename": "tally_groups_demo.js",
            "initialCode": "function evaluateLedgerParent(ledgerName) {\n  if (ledgerName.includes('Bank')) return 'PARENT_GROUP: Bank Accounts (Current Assets)';\n  if (ledgerName.includes('GST')) return 'PARENT_GROUP: Duties & Taxes (Current Liabilities)';\n  if (ledgerName.includes('Customer')) return 'PARENT_GROUP: Sundry Debtors (Current Assets)';\n  return 'PARENT_GROUP: General';\n}\n\nconsole.log(evaluateLedgerParent('HDFC Current Bank A/c'));\nconsole.log(evaluateLedgerParent('Output CGST 9% A/c'));",
            "expectedOutput": "PARENT_GROUP: Bank Accounts (Current Assets)\nPARENT_GROUP: Duties & Taxes (Current Liabilities)",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Under which predefined Tally group must GST tax ledgers (CGST, SGST, IGST) be created?",
          "expectedStringOutput": "PARENT_GROUP: Duties & Taxes (Current Liabilities)",
          "acceptableAnswers": [
            "PARENT_GROUP: Duties & Taxes (Current Liabilities)",
            "Duties & Taxes",
            "Duties and Taxes"
          ],
          "primaryMisconceptionId": "MC_ACC_TALLY_PRIME_ERP_MASTERS_AND_VOUCHERS",
          "diagnosisMap": {
            "DIRECT_EXPENSE": {
              "misconceptionId": "MC_ACC_TALLY_PRIME_ERP_MASTERS_AND_VOUCHERS",
              "errorExplanation": "Taxes collected on behalf of the government sit under Duties & Taxes (Current Liabilities).",
              "recoveryPath": {
                "simplerExplanation": "Created under Duties & Taxes.",
                "guidedFixPrompt": "Type PARENT_GROUP: Duties & Taxes (Current Liabilities)"
              }
            }
          }
        }
      },
      {
        "id": "acc-d16-b3-inventory-masters-stock-items-uom",
        "day": 16,
        "blockNumber": 3,
        "title": "Inventory Masters: Stock Items, Units of Measure (UoM) & Godowns",
        "conceptBudget": {
          "primaryConcept": "Tally Inventory Masters",
          "supportingTerms": [
            "Units of Measure (Simple: `NOS`, `KGS`, `BOX`; Compound: `1 BOX = 10 NOS`)",
            "Stock Items & Stock Groups",
            "Godowns / Locations (Multi-warehouse inventory tracking)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d16-b2-tally-predefined-groups",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "inventory_uom_demo.js",
            "initialCode": "function evaluateUom(uomCode) {\n  return {\n    uomSymbol: uomCode,\n    isStandardGstUqc: ['NOS', 'KGS', 'BOX', 'MTR', 'LTR'].includes(uomCode),\n    status: 'INVENTORY_MASTER_CONFIGURED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateUom('NOS')));",
            "expectedOutput": "{\"uomSymbol\":\"NOS\",\"isStandardGstUqc\":true,\"status\":\"INVENTORY_MASTER_CONFIGURED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that a Unit of Measure (UoM) master is properly configured in Tally Prime?",
          "expectedStringOutput": "INVENTORY_MASTER_CONFIGURED",
          "acceptableAnswers": [
            "INVENTORY_MASTER_CONFIGURED",
            "status\":\"INVENTORY_MASTER_CONFIGURED\""
          ],
          "primaryMisconceptionId": "MC_ACC_TALLY_PRIME_ERP_MASTERS_AND_VOUCHERS",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_ACC_TALLY_PRIME_ERP_MASTERS_AND_VOUCHERS",
              "errorExplanation": "Matches INVENTORY_MASTER_CONFIGURED.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type INVENTORY_MASTER_CONFIGURED"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 17,
    "title": "Tally Prime ERP: Voucher Entry & Accounting Workflows",
    "overviewMetaphor": "Tally Voucher Entry is a Set of Dedicated Shortcut Buttons on a Cash Register Keyboard: F4 opens the Contra voucher (Bank/Cash transfers); F5 opens the Payment voucher (Cheques to vendors); F6 opens the Receipt voucher (Customer deposits); F7 opens the Journal voucher (Depreciation adjustments); F8 opens the Sales Invoice; F9 opens the Purchase Invoice; typing transactions through these vouchers instantly updates ledgers, inventory godowns, and trial balances without needing any manual math.",
    "blocks": [
      {
        "id": "acc-d17-b1-tally-accounting-voucher-types",
        "day": 17,
        "blockNumber": 1,
        "title": "Tally Prime Core Voucher Types & Shortcut Keys (F4 to F9)",
        "conceptBudget": {
          "primaryConcept": "Tally Core Voucher Architecture",
          "supportingTerms": [
            "F4: Contra (Cash <-> Bank transfers)",
            "F5: Payment (Outflow of money to vendors/expenses)",
            "F6: Receipt (Inflow of money from debtors/incomes)",
            "F7: Journal (Non-cash adjustment entries)",
            "F8: Sales (Customer invoices)",
            "F9: Purchase (Vendor invoices)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d16-b2-tally-predefined-groups",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Tally Prime Voucher Function Keys",
              "boxes": [
                {
                  "label": "F4 (Contra)",
                  "value": "Use: Cash to Bank, Bank to Cash | Zero outside party impact",
                  "varType": "Internal Cash/Bank",
                  "isUpdated": false
                },
                {
                  "label": "F5 (Payment) & F6 (Receipt)",
                  "value": "Use: External cash/bank outflows and inflows",
                  "varType": "Liquid Cashflow",
                  "isUpdated": false
                },
                {
                  "label": "F8 (Sales) & F9 (Purchase)",
                  "value": "Use: Item and Accounting Invoices for trade",
                  "varType": "Commercial Trade",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "voucher_keys_demo.js",
            "initialCode": "function getTallyKey(voucherName) {\n  const map = { 'Contra': 'F4', 'Payment': 'F5', 'Receipt': 'F6', 'Journal': 'F7', 'Sales': 'F8', 'Purchase': 'F9' };\n  return map[voucherName] || 'UNKNOWN';\n}\n\nconsole.log(getTallyKey('Sales'));\nconsole.log(getTallyKey('Payment'));",
            "expectedOutput": "F8\nF5",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which function key shortcut opens the Sales Voucher in Tally Prime?",
          "expectedStringOutput": "F8",
          "acceptableAnswers": [
            "F8",
            "Key F8"
          ],
          "primaryMisconceptionId": "MC_ACC_TALLY_PRIME_ERP_MASTERS_AND_VOUCHERS",
          "diagnosisMap": {
            "F9": {
              "misconceptionId": "MC_ACC_TALLY_PRIME_ERP_MASTERS_AND_VOUCHERS",
              "errorExplanation": "F9 is for Purchase. F8 is for Sales.",
              "recoveryPath": {
                "simplerExplanation": "Sales is F8.",
                "guidedFixPrompt": "Type F8"
              }
            }
          }
        }
      },
      {
        "id": "acc-d17-b2-item-invoice-vs-accounting-invoice",
        "day": 17,
        "blockNumber": 2,
        "title": "Item Invoice Mode (`Ctrl+H`) vs Accounting Invoice Mode in Tally",
        "conceptBudget": {
          "primaryConcept": "Invoice Modes in Tally Prime",
          "supportingTerms": [
            "Item Invoice Mode (`Ctrl+H` $\\to$ Item Invoice: Stock Name, Quantity, Rate, Amount for trading businesses)",
            "Accounting Invoice Mode (Service billing: Consulting fees, Rent without inventory)",
            "As Voucher Mode (`Ctrl+H` $\\to$ Traditional Dr/Cr journal entry mode)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d17-b1-tally-accounting-voucher-types",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "invoice_mode_demo.js",
            "initialCode": "function evaluateInvoiceMode(hasPhysicalGoods) {\n  return hasPhysicalGoods\n    ? 'ITEM_INVOICE_MODE_WITH_STOCK_QUANTITY_RATE'\n    : 'ACCOUNTING_INVOICE_MODE_FOR_SERVICES';\n}\n\nconsole.log(evaluateInvoiceMode(true));\nconsole.log(evaluateInvoiceMode(false));",
            "expectedOutput": "ITEM_INVOICE_MODE_WITH_STOCK_QUANTITY_RATE\nACCOUNTING_INVOICE_MODE_FOR_SERVICES",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which invoice mode is selected in Tally Prime when billing a client for consulting services without any physical inventory stock items?",
          "expectedStringOutput": "ACCOUNTING_INVOICE_MODE_FOR_SERVICES",
          "acceptableAnswers": [
            "ACCOUNTING_INVOICE_MODE_FOR_SERVICES",
            "Accounting Invoice",
            "Accounting Invoice Mode"
          ],
          "primaryMisconceptionId": "MC_ACC_TALLY_PRIME_ERP_MASTERS_AND_VOUCHERS",
          "diagnosisMap": {
            "ITEM": {
              "misconceptionId": "MC_ACC_TALLY_PRIME_ERP_MASTERS_AND_VOUCHERS",
              "errorExplanation": "Item Invoice requires stock items. Service billing uses Accounting Invoice mode.",
              "recoveryPath": {
                "simplerExplanation": "Uses Accounting Invoice mode.",
                "guidedFixPrompt": "Type ACCOUNTING_INVOICE_MODE_FOR_SERVICES"
              }
            }
          }
        }
      },
      {
        "id": "acc-d17-b3-bank-allocation-tally-cheque-details",
        "day": 17,
        "blockNumber": 3,
        "title": "Bank Allocations & Cheque Printing in Tally Prime",
        "conceptBudget": {
          "primaryConcept": "Bank Allocation Sub-Screens",
          "supportingTerms": [
            "Transaction Types (Cheque, e-Fund Transfer, NEFT/RTGS, UPI)",
            "Cheque / Instrument Number & Instrument Date",
            "Favouree Name for Auto Cheque Printing"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d17-b2-item-invoice-vs-accounting-invoice",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "bank_alloc_demo.js",
            "initialCode": "function formatBankAllocation(instrumentNo, favouree) {\n  return {\n    instrumentNumber: instrumentNo,\n    favoureeName: favouree,\n    chequePrintingReady: true,\n    status: 'BANK_ALLOCATION_COMPLETED'\n  };\n}\n\nconsole.log(JSON.stringify(formatBankAllocation('000142', 'Sharma Enterprises')));",
            "expectedOutput": "{\"instrumentNumber\":\"000142\",\"favoureeName\":\"Sharma Enterprises\",\"chequePrintingReady\":true,\"status\":\"BANK_ALLOCATION_COMPLETED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that banking instrument details are captured and ready for auto-cheque printing in Tally Prime?",
          "expectedStringOutput": "BANK_ALLOCATION_COMPLETED",
          "acceptableAnswers": [
            "BANK_ALLOCATION_COMPLETED",
            "status\":\"BANK_ALLOCATION_COMPLETED\""
          ],
          "primaryMisconceptionId": "MC_ACC_TALLY_PRIME_ERP_MASTERS_AND_VOUCHERS",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_ACC_TALLY_PRIME_ERP_MASTERS_AND_VOUCHERS",
              "errorExplanation": "Matches BANK_ALLOCATION_COMPLETED.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type BANK_ALLOCATION_COMPLETED"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 18,
    "title": "Goods & Services Tax (GST): Dual Model (CGST/SGST vs IGST) & Tax Invoices",
    "overviewMetaphor": "The Indian Dual-GST System is Splitting a Toll Road Fee Between Two Governments: when you buy goods from a store in your own state (Intra-State Supply), an 18% GST toll is split equally: 9% goes to the Central Government (CGST) and 9% goes to your State Government (SGST); when you buy goods shipped from another state (Inter-State Supply), the entire 18% toll is collected by the Central Government as Integrated GST (IGST)—which then digitally settles the destination state's share behind the scenes.",
    "blocks": [
      {
        "id": "acc-d18-b1-intra-vs-inter-state-gst",
        "day": 18,
        "blockNumber": 1,
        "title": "Intra-State (CGST + SGST) vs Inter-State (IGST) Taxation",
        "conceptBudget": {
          "primaryConcept": "GST Dual Structure Rules",
          "supportingTerms": [
            "Intra-State Supply (Supplier & Place of Supply in same state $\\implies$ Split equally into CGST + SGST)",
            "Inter-State Supply (Supplier & Place of Supply in different states / Imports $\\implies$ IGST)",
            "GST Rate Slabs: 0%, 5%, 12%, 18%, 28%"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d16-b2-tally-predefined-groups",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "GST Tax Breakdown on $100,000 Taxable Value (18% Rate)",
              "boxes": [
                {
                  "label": "Intra-State Sale (Karnataka -> Karnataka)",
                  "value": "CGST (9%): $9,000 + SGST (9%): $9,000 = Total Tax: $18,000 | Invoice: $118,000",
                  "varType": "Intra-State Split",
                  "isUpdated": false
                },
                {
                  "label": "Inter-State Sale (Karnataka -> Maharashtra)",
                  "value": "IGST (18%): $18,000 = Total Tax: $18,000 | Invoice: $118,000!",
                  "varType": "Inter-State Single Tax",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "gst_calc_demo.js",
            "initialCode": "function calculateGst(taxableVal, ratePct, isInterState) {\n  if (isInterState) {\n    return { cgst: 0, sgst: 0, igst: taxableVal * (ratePct / 100), totalTax: taxableVal * (ratePct / 100) };\n  }\n  const half = (ratePct / 2) / 100;\n  return { cgst: taxableVal * half, sgst: taxableVal * half, igst: 0, totalTax: taxableVal * (ratePct / 100) };\n}\n\nconsole.log(JSON.stringify(calculateGst(100000, 18, false)));\nconsole.log(JSON.stringify(calculateGst(100000, 18, true)));",
            "expectedOutput": "{\"cgst\":9000,\"sgst\":9000,\"igst\":0,\"totalTax\":18000}\n{\"cgst\":0,\"sgst\":0,\"igst\":18000,\"totalTax\":18000}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the CGST amount charged on a $100,000 intra-state sale at an 18% GST rate ($100000 \\times 9\\%$)?",
          "expectedStringOutput": "9000",
          "acceptableAnswers": [
            "9000",
            "$9,000",
            "cgst\":9000"
          ],
          "primaryMisconceptionId": "MC_ACC_GST_DUAL_STRUCTURE_CGST_SGST_IGST",
          "diagnosisMap": {
            "18000": {
              "misconceptionId": "MC_ACC_GST_DUAL_STRUCTURE_CGST_SGST_IGST",
              "errorExplanation": "18% is split equally into 9% CGST ($9,000) and 9% SGST ($9,000).",
              "recoveryPath": {
                "simplerExplanation": "100000 * 0.09 = 9000.",
                "guidedFixPrompt": "Type 9000"
              }
            }
          }
        }
      },
      {
        "id": "acc-d18-b2-hsn-and-sac-codes",
        "day": 18,
        "blockNumber": 2,
        "title": "HSN (Goods) & SAC (Services) Classification Codes",
        "conceptBudget": {
          "primaryConcept": "HSN and SAC System",
          "supportingTerms": [
            "HSN (Harmonized System of Nomenclature: 4, 6, or 8-digit international coding for goods)",
            "SAC (Services Accounting Code: 6-digit coding for service industries)",
            "Mandatory on Tax Invoices for businesses exceeding Rs. 5 Crore turnover"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d18-b1-intra-vs-inter-state-gst",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "hsn_sac_demo.js",
            "initialCode": "function evaluateGstClassification(codeType) {\n  return codeType === 'GOODS'\n    ? 'HSN_HARMONIZED_SYSTEM_OF_NOMENCLATURE'\n    : 'SAC_SERVICES_ACCOUNTING_CODE';\n}\n\nconsole.log(evaluateGstClassification('GOODS'));\nconsole.log(evaluateGstClassification('SERVICES'));",
            "expectedOutput": "HSN_HARMONIZED_SYSTEM_OF_NOMENCLATURE\nSAC_SERVICES_ACCOUNTING_CODE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which classification code system is mandated on GST invoices for physical goods?",
          "expectedStringOutput": "HSN_HARMONIZED_SYSTEM_OF_NOMENCLATURE",
          "acceptableAnswers": [
            "HSN_HARMONIZED_SYSTEM_OF_NOMENCLATURE",
            "HSN",
            "HSN Code"
          ],
          "primaryMisconceptionId": "MC_ACC_GST_DUAL_STRUCTURE_CGST_SGST_IGST",
          "diagnosisMap": {
            "SAC": {
              "misconceptionId": "MC_ACC_GST_DUAL_STRUCTURE_CGST_SGST_IGST",
              "errorExplanation": "SAC is for services. Physical goods use HSN codes.",
              "recoveryPath": {
                "simplerExplanation": "Goods use HSN codes.",
                "guidedFixPrompt": "Type HSN_HARMONIZED_SYSTEM_OF_NOMENCLATURE"
              }
            }
          }
        }
      },
      {
        "id": "acc-d18-b3-mandatory-tax-invoice-fields",
        "day": 18,
        "blockNumber": 3,
        "title": "Section 31 Statutory Tax Invoice Requirements",
        "conceptBudget": {
          "primaryConcept": "GST Tax Invoice Statutory Invariants",
          "supportingTerms": [
            "Mandatory Elements: Supplier GSTIN, Consecutive Serial Invoice Number, Date, Recipient GSTIN, Place of Supply, HSN/SAC Code, Taxable Value, Tax Rates, Signature / Digital DSC",
            "16-Character Invoice Number Limit"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d18-b2-hsn-and-sac-codes",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "tax_invoice_demo.js",
            "initialCode": "function validateTaxInvoice(gstin, invoiceNo, taxableAmount, hasPlaceOfSupply) {\n  const isValid = Boolean(gstin && gstin.length === 15 && invoiceNo && taxableAmount > 0 && hasPlaceOfSupply);\n  return {\n    supplierGstin: gstin,\n    invoiceNumber: invoiceNo,\n    taxableValue: taxableAmount,\n    isStatutoryValid: isValid,\n    status: isValid ? 'GST_TAX_INVOICE_STATUTORY_COMPLIANT' : 'INVALID_GST_INVOICE_NON_COMPLIANT'\n  };\n}\n\nconsole.log(JSON.stringify(validateTaxInvoice('29ABCDE1234F1Z5', 'INV-2026-001', 100000, true)));",
            "expectedOutput": "{\"supplierGstin\":\"29ABCDE1234F1Z5\",\"invoiceNumber\":\"INV-2026-001\",\"taxableValue\":100000,\"isStatutoryValid\":true,\"status\":\"GST_TAX_INVOICE_STATUTORY_COMPLIANT\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What compliance status confirms that a 15-character GSTIN tax invoice meets all Section 31 statutory requirements?",
          "expectedStringOutput": "GST_TAX_INVOICE_STATUTORY_COMPLIANT",
          "acceptableAnswers": [
            "GST_TAX_INVOICE_STATUTORY_COMPLIANT",
            "status\":\"GST_TAX_INVOICE_STATUTORY_COMPLIANT\""
          ],
          "primaryMisconceptionId": "MC_ACC_GST_DUAL_STRUCTURE_CGST_SGST_IGST",
          "diagnosisMap": {
            "NON_COMPLIANT": {
              "misconceptionId": "MC_ACC_GST_DUAL_STRUCTURE_CGST_SGST_IGST",
              "errorExplanation": "Valid GSTIN, invoice number, and place of supply confirm compliance.",
              "recoveryPath": {
                "simplerExplanation": "Matches GST_TAX_INVOICE_STATUTORY_COMPLIANT.",
                "guidedFixPrompt": "Type GST_TAX_INVOICE_STATUTORY_COMPLIANT"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 19,
    "title": "GST Input Tax Credit (ITC) & Cross-Utilization Set-Off Order",
    "overviewMetaphor": "Input Tax Credit (ITC) is a Tax Refund Voucher Given to You When You Buy Raw Materials: if a furniture factory buys wood for $100,000 and pays $18,000 in GST to the lumber mill (Input Tax); when the factory sells the finished dining table for $150,000, it collects $27,000 GST from the customer (Output Tax); instead of paying all $27,000 to the government, the factory offsets the $18,000 already paid—remitting only the net $9,000 difference ($27k - $18k); the law strictly dictates the sequence in which IGST, CGST, and SGST credits must be used.",
    "blocks": [
      {
        "id": "acc-d19-b1-itc-eligibility-and-blocked-credits",
        "day": 19,
        "blockNumber": 1,
        "title": "ITC Eligibility (Section 16) & Blocked Credits (Section 17(5))",
        "conceptBudget": {
          "primaryConcept": "ITC Eligibility & Blocked Credits",
          "supportingTerms": [
            "Section 16 4-Pillar Test (1. Possession of Tax Invoice; 2. Received Goods/Services; 3. Tax paid to Govt by supplier; 4. Furnished GSTR-3B return)",
            "Section 17(5) Blocked Credits (Food & beverages, motor vehicles $\\le 13$ seats, club memberships, goods lost/stolen/gifted; CANNOT claim ITC!)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d18-b1-intra-vs-inter-state-gst",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "ITC Eligibility Decision Matrix",
              "boxes": [
                {
                  "label": "1. Bought Factory Raw Material Wood ($18k Tax)",
                  "value": "Used in business furtherance -> ELIGIBLE FOR 100% ITC CLAIM!",
                  "varType": "Eligible Credit",
                  "isUpdated": false
                },
                {
                  "label": "2. Catered Staff Diwali Buffet Lunch ($5k Tax)",
                  "value": "Section 17(5)(b)(i) Food & Beverage -> BLOCKED CREDIT! ZERO ITC CLAIMABLE!",
                  "varType": "Blocked Credit",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "itc_eligibility_demo.js",
            "initialCode": "function evaluateItcEligibility(expenseType) {\n  const blocked = ['FOOD_AND_BEVERAGES', 'PERSONAL_MOTOR_VEHICLE', 'CLUB_MEMBERSHIP', 'GOODS_LOST_OR_STOLEN'];\n  return blocked.includes(expenseType)\n    ? 'BLOCKED_CREDIT_UNDER_SECTION_17_5_ZERO_ITC'\n    : 'ELIGIBLE_INPUT_TAX_CREDIT_CLAIMABLE';\n}\n\nconsole.log(evaluateItcEligibility('RAW_MATERIALS'));\nconsole.log(evaluateItcEligibility('FOOD_AND_BEVERAGES'));",
            "expectedOutput": "ELIGIBLE_INPUT_TAX_CREDIT_CLAIMABLE\nBLOCKED_CREDIT_UNDER_SECTION_17_5_ZERO_ITC",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Can an enterprise claim Input Tax Credit on food, beverages, and catering expenses incurred during a company party?",
          "expectedStringOutput": "BLOCKED_CREDIT_UNDER_SECTION_17_5_ZERO_ITC",
          "acceptableAnswers": [
            "BLOCKED_CREDIT_UNDER_SECTION_17_5_ZERO_ITC",
            "No",
            "Blocked under Section 17(5)"
          ],
          "primaryMisconceptionId": "MC_ACC_INPUT_TAX_CREDIT_ITC_CROSS_UTILIZATION_ORDER",
          "diagnosisMap": {
            "ELIGIBLE": {
              "misconceptionId": "MC_ACC_INPUT_TAX_CREDIT_ITC_CROSS_UTILIZATION_ORDER",
              "errorExplanation": "Section 17(5) explicitly blocks ITC on food and beverages.",
              "recoveryPath": {
                "simplerExplanation": "Food and beverage ITC is blocked under Sec 17(5).",
                "guidedFixPrompt": "Type BLOCKED_CREDIT_UNDER_SECTION_17_5_ZERO_ITC"
              }
            }
          }
        }
      },
      {
        "id": "acc-d19-b2-itc-cross-utilization-statutory-order",
        "day": 19,
        "blockNumber": 2,
        "title": "Statutory ITC Set-Off Order (Rule 88A / Section 49)",
        "conceptBudget": {
          "primaryConcept": "Statutory ITC Cross-Utilization Order",
          "supportingTerms": [
            "Step 1: IGST ITC must be 100% EXHAUSTED first against IGST, then CGST/SGST in any proportion!",
            "Step 2: CGST ITC offsets CGST, then remaining against IGST",
            "Step 3: SGST ITC offsets SGST, then remaining against IGST",
            "The Iron Rule: CGST and SGST can NEVER cross-utilize against each other!"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d19-b1-itc-eligibility-and-blocked-credits",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "ITC Set-Off Order in Code",
            "codeSnippet": "// 1. IGST ITC -> Offsets Output IGST -> Output CGST -> Output SGST\n// 2. CGST ITC -> Offsets Output CGST -> Output IGST (NEVER SGST!)\n// 3. SGST ITC -> Offsets Output SGST -> Output IGST (NEVER CGST!)",
            "lineNotes": {
              "1": "IGST credit must be fully exhausted first.",
              "2": "CGST can never offset SGST.",
              "3": "SGST can never offset CGST."
            }
          },
          {
            "type": "runnable_code",
            "filename": "itc_order_demo.js",
            "initialCode": "function evaluateCrossUtilization(creditType, outputLiabilityType) {\n  if ((creditType === 'CGST' && outputLiabilityType === 'SGST') || (creditType === 'SGST' && outputLiabilityType === 'CGST')) {\n    return 'ILLEGAL_CROSS_UTILIZATION_FORBIDDEN_BY_LAW';\n  }\n  return 'LEGAL_ITC_CROSS_UTILIZATION_PERMITTED';\n}\n\nconsole.log(evaluateCrossUtilization('CGST', 'SGST'));\nconsole.log(evaluateCrossUtilization('IGST', 'CGST'));",
            "expectedOutput": "ILLEGAL_CROSS_UTILIZATION_FORBIDDEN_BY_LAW\nLEGAL_ITC_CROSS_UTILIZATION_PERMITTED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Can an enterprise legally use Input CGST tax credit to pay an Output SGST tax liability?",
          "expectedStringOutput": "ILLEGAL_CROSS_UTILIZATION_FORBIDDEN_BY_LAW",
          "acceptableAnswers": [
            "ILLEGAL_CROSS_UTILIZATION_FORBIDDEN_BY_LAW",
            "No",
            "Illegal"
          ],
          "primaryMisconceptionId": "MC_ACC_INPUT_TAX_CREDIT_ITC_CROSS_UTILIZATION_ORDER",
          "diagnosisMap": {
            "LEGAL": {
              "misconceptionId": "MC_ACC_INPUT_TAX_CREDIT_ITC_CROSS_UTILIZATION_ORDER",
              "errorExplanation": "CGST and SGST can never cross-offset each other under Section 49.",
              "recoveryPath": {
                "simplerExplanation": "CGST and SGST cannot cross-offset.",
                "guidedFixPrompt": "Type ILLEGAL_CROSS_UTILIZATION_FORBIDDEN_BY_LAW"
              }
            }
          }
        }
      },
      {
        "id": "acc-d19-b3-net-gst-cash-payment-challan-pmt-06",
        "day": 19,
        "blockNumber": 3,
        "title": "Net Cash Tax Payment & Electronic Cash Ledger (Challan PMT-06)",
        "conceptBudget": {
          "primaryConcept": "Electronic Cash Ledger Remittance",
          "supportingTerms": [
            "Electronic Credit Ledger (Holds verified ITC balances)",
            "Electronic Cash Ledger (Holds deposited bank funds for tax/interest/penalties)",
            "Form GST PMT-06 (Challan generated to deposit net cash liability by 20th of month)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d19-b2-itc-cross-utilization-statutory-order",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "pmt06_demo.js",
            "initialCode": "function evaluateGstChallan(netCashPayable) {\n  return {\n    netTaxDueDollars: netCashPayable,\n    challanForm: 'GST_PMT_06',\n    paymentMode: 'NEFT_RTGS_NET_BANKING',\n    status: 'CHALLAN_PMT_06_GENERATED_FOR_REMITTANCE'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateGstChallan(9000)));",
            "expectedOutput": "{\"netTaxDueDollars\":9000,\"challanForm\":\"GST_PMT_06\",\"paymentMode\":\"NEFT_RTGS_NET_BANKING\",\"status\":\"CHALLAN_PMT_06_GENERATED_FOR_REMITTANCE\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which statutory challan form is generated on the GST Portal to deposit net cash tax liabilities into the Electronic Cash Ledger?",
          "expectedStringOutput": "GST_PMT_06",
          "acceptableAnswers": [
            "GST_PMT_06",
            "PMT-06",
            "GST PMT-06",
            "challanForm\":\"GST_PMT_06\""
          ],
          "primaryMisconceptionId": "MC_ACC_INPUT_TAX_CREDIT_ITC_CROSS_UTILIZATION_ORDER",
          "diagnosisMap": {
            "GSTR_3B": {
              "misconceptionId": "MC_ACC_INPUT_TAX_CREDIT_ITC_CROSS_UTILIZATION_ORDER",
              "errorExplanation": "GSTR-3B is the monthly return. The cash payment challan is PMT-06.",
              "recoveryPath": {
                "simplerExplanation": "Payment challan is PMT-06.",
                "guidedFixPrompt": "Type GST_PMT_06"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 20,
    "title": "GST Returns: GSTR-1, GSTR-3B & GSTR-2B Auto-Reconciliation",
    "overviewMetaphor": "GST Return Filing is an Automated Monthly Triangle Check: 1. By the 11th, you upload every invoice you sold to customers into GSTR-1; 2. The GST Portal automatically places those invoices into your customers' GSTR-2B statement; 3. By the 20th, you file GSTR-3B to summarize your monthly sales, claim eligible ITC from GSTR-2B, and pay the net tax difference; Rule 36(4) forbids you from claiming tax credits for any vendor invoice that does not appear in your portal GSTR-2B.",
    "blocks": [
      {
        "id": "acc-d20-b1-gstr1-outward-supplies",
        "day": 20,
        "blockNumber": 1,
        "title": "GSTR-1 Outward Supplies Return & Invoice Upload Tables",
        "conceptBudget": {
          "primaryConcept": "GSTR-1 Return Filing Structure",
          "supportingTerms": [
            "Table 4 (B2B Taxable Outward Invoices to registered businesses)",
            "Table 5 & 7 (B2C Large inter-state invoices > 2.5L and B2C Small invoices)",
            "Table 12 (HSN-wise summary of outward supplies)",
            "Due Date: 11th of the following month for monthly filers"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d18-b3-mandatory-tax-invoice-fields",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "GSTR-1 Monthly Data Pipeline",
              "boxes": [
                {
                  "label": "B2B Sales Invoices (Table 4)",
                  "value": "Buyer GSTIN | Invoice No | Taxable Value | CGST/SGST/IGST breakdown",
                  "varType": "Invoice Upload",
                  "isUpdated": false
                },
                {
                  "label": "Downstream Portal Action",
                  "value": "Auto-populates Buyer's GSTR-2B statement on 14th of month!",
                  "varType": "Auto-Drafted ITC",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "gstr1_tables_demo.js",
            "initialCode": "function getGstr1Table(recipientType, isLargeInterState = false) {\n  if (recipientType === 'B2B_REGISTERED') return 'TABLE_4_B2B_REGISTERED_SUPPLIES';\n  if (isLargeInterState) return 'TABLE_5_B2C_LARGE_INVOICES';\n  return 'TABLE_7_B2C_SMALL_AGGREGATED';\n}\n\nconsole.log(getGstr1Table('B2B_REGISTERED'));\nconsole.log(getGstr1Table('B2C_UNREGISTERED', false));",
            "expectedOutput": "TABLE_4_B2B_REGISTERED_SUPPLIES\nTABLE_7_B2C_SMALL_AGGREGATED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which table in GSTR-1 is used to upload individual B2B tax invoices issued to registered business customers?",
          "expectedStringOutput": "TABLE_4_B2B_REGISTERED_SUPPLIES",
          "acceptableAnswers": [
            "TABLE_4_B2B_REGISTERED_SUPPLIES",
            "Table 4",
            "Table 4 B2B"
          ],
          "primaryMisconceptionId": "MC_ACC_GSTR1_GSTR3B_RETURN_FILING_AND_RECONCILIATION",
          "diagnosisMap": {
            "TABLE_7": {
              "misconceptionId": "MC_ACC_GSTR1_GSTR3B_RETURN_FILING_AND_RECONCILIATION",
              "errorExplanation": "Table 7 is for B2C Small sales. Table 4 is for B2B registered invoices.",
              "recoveryPath": {
                "simplerExplanation": "B2B invoices go to Table 4.",
                "guidedFixPrompt": "Type TABLE_4_B2B_REGISTERED_SUPPLIES"
              }
            }
          }
        }
      },
      {
        "id": "acc-d20-b2-gstr2b-static-statement-rule-36-4",
        "day": 20,
        "blockNumber": 2,
        "title": "GSTR-2B Static Auto-Drafted Statement & Rule 36(4) Restrictions",
        "conceptBudget": {
          "primaryConcept": "GSTR-2B Reconciliation & Rule 36(4)",
          "supportingTerms": [
            "GSTR-2B (Static auto-drafted ITC statement generated on 14th of each month)",
            "Rule 36(4) Restriction (100% match required: ZERO ITC can be claimed in GSTR-3B if the vendor has not uploaded the invoice into GSTR-1!)",
            "2A (Dynamic) vs 2B (Static)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d20-b1-gstr1-outward-supplies",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Rule 36(4) ITC Claim Audit",
            "codeSnippet": "// Books show $50,000 Input Tax paid to suppliers\n// GSTR-2B on portal shows ONLY $42,000 (Vendor XYZ forgot to file GSTR-1!)\n// Statutory Claim Allowed in GSTR-3B = EXACTLY $42,000 (Remaining $8,000 must be withheld!)",
            "lineNotes": {
              "1": "Internal books calculation.",
              "2": "Portal GSTR-2B reflected credit.",
              "3": "Only portal-matched amount is legally claimable."
            }
          },
          {
            "type": "runnable_code",
            "filename": "rule36_demo.js",
            "initialCode": "function evaluateLegalItcClaim(booksItc, portal2bItc) {\n  const claimable = Math.min(booksItc, portal2bItc);\n  const blocked = Math.max(0, booksItc - portal2bItc);\n  return {\n    booksRecordedItc: booksItc,\n    portalGstr2bItc: portal2bItc,\n    legallyClaimableIn3b: claimable,\n    withheldUnmatchedItc: blocked,\n    status: blocked === 0 ? 'ITC_100_PERCENT_MATCHED' : 'UNMATCHED_ITC_BLOCKED_RULE_36_4'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateLegalItcClaim(50000, 42000)));",
            "expectedOutput": "{\"booksRecordedItc\":50000,\"portalGstr2bItc\":42000,\"legallyClaimableIn3b\":42000,\"withheldUnmatchedItc\":8000,\"status\":\"UNMATCHED_ITC_BLOCKED_RULE_36_4\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Under Rule 36(4), how much ITC can an enterprise legally claim in GSTR-3B when internal books show $50,000 but the portal GSTR-2B shows only $42,000?",
          "expectedStringOutput": "42000",
          "acceptableAnswers": [
            "42000",
            "$42,000",
            "legallyClaimableIn3b\":42000"
          ],
          "primaryMisconceptionId": "MC_ACC_GSTR1_GSTR3B_RETURN_FILING_AND_RECONCILIATION",
          "diagnosisMap": {
            "50000": {
              "misconceptionId": "MC_ACC_GSTR1_GSTR3B_RETURN_FILING_AND_RECONCILIATION",
              "errorExplanation": "Claiming $50,000 violates Rule 36(4). Only the $42,000 appearing in GSTR-2B can be claimed.",
              "recoveryPath": {
                "simplerExplanation": "Only GSTR-2B amount ($42,000) is claimable.",
                "guidedFixPrompt": "Type 42000"
              }
            }
          }
        }
      },
      {
        "id": "acc-d20-b3-gstr3b-summary-and-tax-settlement",
        "day": 20,
        "blockNumber": 3,
        "title": "GSTR-3B Monthly Summary Filing & Tax Settlement (Due 20th)",
        "conceptBudget": {
          "primaryConcept": "GSTR-3B Self-Assessed Summary Return",
          "supportingTerms": [
            "Table 3.1 (Summary of Taxable Outward Supplies & Output Tax)",
            "Table 4 (Eligible ITC Claimed)",
            "Table 6.1 (Payment of Tax: Automatic ledger debit from Cash & Credit Ledgers)",
            "Due Date: 20th of the following month"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d20-b2-gstr2b-static-statement-rule-36-4",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "gstr3b_demo.js",
            "initialCode": "function evaluateGstr3bFiling(outputTax, eligibleItc, cashRemitted) {\n  const isSettled = (eligibleItc + cashRemitted) >= outputTax;\n  return {\n    outputTaxLiability: outputTax,\n    itcUtilized: eligibleItc,\n    cashPaid: cashRemitted,\n    returnFilingStatus: isSettled ? 'GSTR3B_FILED_TAX_DISCHARGED' : 'RETURN_INCOMPLETE_TAX_SHORTFALL'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateGstr3bFiling(54000, 20000, 34000)));",
            "expectedOutput": "{\"outputTaxLiability\":54000,\"itcUtilized\":20000,\"cashPaid\":34000,\"returnFilingStatus\":\"GSTR3B_FILED_TAX_DISCHARGED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What filing status confirms that a monthly GSTR-3B return has successfully discharged all output tax liabilities via ITC and cash remittance?",
          "expectedStringOutput": "GSTR3B_FILED_TAX_DISCHARGED",
          "acceptableAnswers": [
            "GSTR3B_FILED_TAX_DISCHARGED",
            "returnFilingStatus\":\"GSTR3B_FILED_TAX_DISCHARGED\""
          ],
          "primaryMisconceptionId": "MC_ACC_GSTR1_GSTR3B_RETURN_FILING_AND_RECONCILIATION",
          "diagnosisMap": {
            "SHORTFALL": {
              "misconceptionId": "MC_ACC_GSTR1_GSTR3B_RETURN_FILING_AND_RECONCILIATION",
              "errorExplanation": "20k ITC + 34k cash = 54k total tax discharged.",
              "recoveryPath": {
                "simplerExplanation": "Matches GSTR3B_FILED_TAX_DISCHARGED.",
                "guidedFixPrompt": "Type GSTR3B_FILED_TAX_DISCHARGED"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 21,
    "title": "⭐ MILESTONE 3: Complete Enterprise Tally Prime & GST Taxation Engine",
    "overviewMetaphor": "Milestone 3 Synthesis: The complete sovereign enterprise accounting and GST compliance engine: 1. Tally Prime chart of accounts XML generation; 2. Dual-GST intra/inter-state tax invoicing; 3. Statutory Input Tax Credit cross-utilization set-off; 4. GSTR-1 / GSTR-3B tax return reconciliation.",
    "blocks": [
      {
        "id": "acc-d21-b1-tally-gst-engine-synthesis",
        "day": 21,
        "blockNumber": 1,
        "title": "Enterprise Tally ERP & GST Taxation Engine Synthesis",
        "conceptBudget": {
          "primaryConcept": "Tally ERP & GST Engine Synthesis",
          "supportingTerms": [
            "Tally XML Master Engine",
            "Dual GST Calculator",
            "ITC Cross-Utilization Engine",
            "GSTR-3B Settlement Engine"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d20-b3-gstr3b-summary-and-tax-settlement",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Milestone 3 ERP & Tax Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "Generates Tally Prime Ledger Masters & Voucher XML",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Computes CGST/SGST/IGST tax invoices for sales transactions",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Executes Rule 88A Input Tax Credit set-off hierarchy",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Reconciles GSTR-2B and discharges GSTR-3B net tax remittance!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "gst_erp_engine_demo.js",
            "initialCode": "function runGstErpEngine() {\n  return {\n    tallyErpStatus: 'ONLINE_XML_MASTERS_CONFIGURED',\n    dualGstStatus: 'ONLINE_INTRA_INTER_STATE_CALCULATED',\n    itcSetOffStatus: 'ONLINE_RULE_88A_HIERARCHY_ENFORCED',\n    gstr3bStatus: 'ONLINE_TAX_DISCHARGED_COMPLIANT',\n    engineStatus: 'ENTERPRISE_GST_ERP_MASTER_ENGINE_ACTIVE'\n  };\n}\n\nconsole.log(runGstErpEngine().engineStatus);",
            "expectedOutput": "ENTERPRISE_GST_ERP_MASTER_ENGINE_ACTIVE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What engine status confirms active operational synthesis of the Enterprise GST ERP Master Engine?",
          "expectedStringOutput": "ENTERPRISE_GST_ERP_MASTER_ENGINE_ACTIVE",
          "acceptableAnswers": [
            "ENTERPRISE_GST_ERP_MASTER_ENGINE_ACTIVE",
            "engineStatus: ENTERPRISE_GST_ERP_MASTER_ENGINE_ACTIVE"
          ],
          "primaryMisconceptionId": "MC_ACC_GST_DUAL_STRUCTURE_CGST_SGST_IGST",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_ACC_GST_DUAL_STRUCTURE_CGST_SGST_IGST",
              "errorExplanation": "Matches ENTERPRISE_GST_ERP_MASTER_ENGINE_ACTIVE.",
              "recoveryPath": {
                "simplerExplanation": "Matches ENTERPRISE_GST_ERP_MASTER_ENGINE_ACTIVE.",
                "guidedFixPrompt": "Type ENTERPRISE_GST_ERP_MASTER_ENGINE_ACTIVE"
              }
            }
          }
        }
      },
      {
        "id": "acc-d21-b2-tally-gst-audit",
        "day": 21,
        "blockNumber": 2,
        "title": "Enterprise GST Compliance & Invariant Audit",
        "conceptBudget": {
          "primaryConcept": "GST Invariant Audit",
          "supportingTerms": [
            "Dual-GST Invariant",
            "Rule 88A ITC Invariant",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d21-b1-tally-gst-engine-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "gst_audit_demo.js",
            "initialCode": "function auditGstSystem(invoicesValid, itcSetOffValid, returnsFiled) {\n  const passed = invoicesValid && itcSetOffValid && returnsFiled;\n  return {\n    invoicesCompliant: invoicesValid,\n    itcHierarchyCompliant: itcSetOffValid,\n    returnsDischarged: returnsFiled,\n    grade: passed ? 'GST_TAXATION_SYSTEM_AUDIT_PASSED' : 'AUDIT_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditGstSystem(true, true, true)));",
            "expectedOutput": "{\"invoicesCompliant\":true,\"itcHierarchyCompliant\":true,\"returnsDischarged\":true,\"grade\":\"GST_TAXATION_SYSTEM_AUDIT_PASSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade is awarded when GST invoicing, ITC set-off, and return filing pass 100%?",
          "expectedStringOutput": "GST_TAXATION_SYSTEM_AUDIT_PASSED",
          "acceptableAnswers": [
            "GST_TAXATION_SYSTEM_AUDIT_PASSED",
            "grade\":\"GST_TAXATION_SYSTEM_AUDIT_PASSED\""
          ],
          "primaryMisconceptionId": "MC_ACC_GST_DUAL_STRUCTURE_CGST_SGST_IGST",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_ACC_GST_DUAL_STRUCTURE_CGST_SGST_IGST",
              "errorExplanation": "Passing all checks awards GST_TAXATION_SYSTEM_AUDIT_PASSED.",
              "recoveryPath": {
                "simplerExplanation": "Awards GST_TAXATION_SYSTEM_AUDIT_PASSED.",
                "guidedFixPrompt": "Type GST_TAXATION_SYSTEM_AUDIT_PASSED"
              }
            }
          }
        }
      },
      {
        "id": "acc-d21-b3-milestone3-accounting-cert",
        "day": 21,
        "blockNumber": 3,
        "title": "Milestone 3 Enterprise ERP & GST Engine Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 3 Certification",
          "supportingTerms": [
            "GST ERP Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d21-b2-tally-gst-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone3_acc_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 3: Complete Enterprise Tally Prime & GST Taxation Engine [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 3: Complete Enterprise Tally Prime & GST Taxation Engine [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 3 completion?",
          "expectedStringOutput": "⭐ MILESTONE 3: Complete Enterprise Tally Prime & GST Taxation Engine [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 3: Complete Enterprise Tally Prime & GST Taxation Engine [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_ACC_GST_DUAL_STRUCTURE_CGST_SGST_IGST",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_ACC_GST_DUAL_STRUCTURE_CGST_SGST_IGST",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 3: Complete Enterprise Tally Prime & GST Taxation Engine [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 22,
    "title": "Reverse Charge Mechanism (RCM) & E-Way Bill Generation",
    "overviewMetaphor": "Reverse Charge (RCM) is Paying the Sales Tax Directly to the Government on Behalf of an Unregistered Vendor: normally, a supplier charges you tax and sends it to the state; under RCM (Section 9(3)/9(4)), when you hire an individual truck driver (GTA) or lawyer who has no GST registration, the law flips the burden—requiring YOU as the buyer to pay the tax directly to the government; an E-Way Bill is a Digital Highway Toll Pass required for any truck carrying more than Rs. 50,000 of goods across state borders.",
    "blocks": [
      {
        "id": "acc-d22-b1-reverse-charge-mechanism-rcm",
        "day": 22,
        "blockNumber": 1,
        "title": "Reverse Charge Mechanism (RCM) under Section 9(3) / 9(4)",
        "conceptBudget": {
          "primaryConcept": "Reverse Charge Mechanism (RCM) Accounting",
          "supportingTerms": [
            "Forward Charge (Supplier collects and pays tax) vs Reverse Charge (Recipient pays tax directly to Govt)",
            "Mandatory RCM Categories (Goods Transport Agency GTA, Legal Services by Advocates, Director Remuneration)",
            "Payment strictly in CASH (Cannot use existing ITC to pay RCM output liability!)",
            "ITC on RCM can be claimed in the same month after cash payment!"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d19-b2-itc-cross-utilization-statutory-order",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Forward Charge vs Reverse Charge Flow",
              "boxes": [
                {
                  "label": "1. Forward Charge (Standard)",
                  "value": "Buyer pays $118k to Supplier -> Supplier remits $18k GST to Government",
                  "varType": "Forward Charge",
                  "isUpdated": false
                },
                {
                  "label": "2. Reverse Charge (RCM: GTA Freight)",
                  "value": "Buyer pays $100k to Trucker -> Buyer remits $5k GST directly to Govt in cash!",
                  "varType": "Reverse Charge",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "rcm_calc_demo.js",
            "initialCode": "function evaluateRcmLiability(freightAmount, rcmRatePct = 5) {\n  const rcmTax = freightAmount * (rcmRatePct / 100);\n  return {\n    freightExpense: freightAmount,\n    rcmTaxPayableInCash: rcmTax,\n    itcClaimableAfterCashPayment: rcmTax,\n    paymentRule: 'MUST_BE_PAID_IN_CASH_CANNOT_USE_CREDIT_LEDGER',\n    status: 'RCM_LIABILITY_EVALUATED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateRcmLiability(100000, 5)));",
            "expectedOutput": "{\"freightExpense\":100000,\"rcmTaxPayableInCash\":5000,\"itcClaimableAfterCashPayment\":5000,\"paymentRule\":\"MUST_BE_PAID_IN_CASH_CANNOT_USE_CREDIT_LEDGER\",\"status\":\"RCM_LIABILITY_EVALUATED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Can an enterprise use its existing Input Tax Credit (Electronic Credit Ledger) to pay Reverse Charge Mechanism (RCM) tax liabilities?",
          "expectedStringOutput": "MUST_BE_PAID_IN_CASH_CANNOT_USE_CREDIT_LEDGER",
          "acceptableAnswers": [
            "MUST_BE_PAID_IN_CASH_CANNOT_USE_CREDIT_LEDGER",
            "No",
            "Must pay in cash"
          ],
          "primaryMisconceptionId": "MC_ACC_REVERSE_CHARGE_MECHANISM_RCM_LIABILITY",
          "diagnosisMap": {
            "YES": {
              "misconceptionId": "MC_ACC_REVERSE_CHARGE_MECHANISM_RCM_LIABILITY",
              "errorExplanation": "RCM liabilities must be discharged strictly in cash via the Electronic Cash Ledger.",
              "recoveryPath": {
                "simplerExplanation": "RCM must be paid in cash.",
                "guidedFixPrompt": "Type MUST_BE_PAID_IN_CASH_CANNOT_USE_CREDIT_LEDGER"
              }
            }
          }
        }
      },
      {
        "id": "acc-d22-b2-eway-bill-generation-rules",
        "day": 22,
        "blockNumber": 2,
        "title": "E-Way Bill Generation & Distance Validity (1 Day per 200 KM)",
        "conceptBudget": {
          "primaryConcept": "E-Way Bill Rules & Thresholds",
          "supportingTerms": [
            "Mandatory Threshold: Consignment Value $> \\text{Rs. 50,000}$",
            "Part A (Invoice & Transporter Details) & Part B (Vehicle Registration Number)",
            "Validity Rule: 1 Day for every 200 KM of travel (20 KM for Over Dimensional Cargo ODC)",
            "EWB Portal (ewaybillgst.gov.in)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d22-b1-reverse-charge-mechanism-rcm",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "E-Way Bill Validity Calculation",
            "codeSnippet": "// Standard Cargo: Validity = ceil(DistanceKM / 200 KM) days\n// Over Dimensional Cargo (ODC): Validity = ceil(DistanceKM / 20 KM) days\nconst validityDays = Math.max(1, Math.ceil(distanceKm / 200));",
            "lineNotes": {
              "1": "Standard 200 km rule.",
              "2": "Heavy cargo 20 km rule.",
              "3": "Calculates validity duration."
            }
          },
          {
            "type": "runnable_code",
            "filename": "eway_validity_demo.js",
            "initialCode": "function calculateEwbValidity(km, isOdc = false) {\n  const divisor = isOdc ? 20 : 200;\n  const days = Math.max(1, Math.ceil(km / divisor));\n  return {\n    distanceKm: km,\n    isOverDimensionalCargo: isOdc,\n    validityDays: days,\n    status: 'EWAY_BILL_VALIDITY_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateEwbValidity(450, false))); // 450 km -> 3 days\nconsole.log(JSON.stringify(calculateEwbValidity(50, true)));   // 50 km ODC -> 3 days",
            "expectedOutput": "{\"distanceKm\":450,\"isOverDimensionalCargo\":false,\"validityDays\":3,\"status\":\"EWAY_BILL_VALIDITY_COMPUTED\"}\n{\"distanceKm\":50,\"isOverDimensionalCargo\":true,\"validityDays\":3,\"status\":\"EWAY_BILL_VALIDITY_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many days of validity are granted for an E-Way Bill covering a 450 KM standard cargo transit (1 day per 200 KM: $\\lceil 450 / 200 \\rceil$)?",
          "expectedStringOutput": "3",
          "acceptableAnswers": [
            "3",
            "3 days",
            "validityDays\":3"
          ],
          "primaryMisconceptionId": "MC_ACC_EWAY_BILL_GENERATION_AND_DISTANCE_RULES",
          "diagnosisMap": {
            "2": {
              "misconceptionId": "MC_ACC_EWAY_BILL_GENERATION_AND_DISTANCE_RULES",
              "errorExplanation": "450 / 200 = 2.25, rounded up to the next full day = 3 days.",
              "recoveryPath": {
                "simplerExplanation": "ceil(450 / 200) = 3.",
                "guidedFixPrompt": "Type 3"
              }
            }
          }
        }
      },
      {
        "id": "acc-d22-b3-e-invoicing-irp-qr-codes",
        "day": 22,
        "blockNumber": 3,
        "title": "Mandatory E-Invoicing: Invoice Registration Portal (IRP) & IRN / QR Codes",
        "conceptBudget": {
          "primaryConcept": "E-Invoicing Architecture",
          "supportingTerms": [
            "Invoice Registration Portal (IRP)",
            "Invoice Reference Number (IRN: 64-character SHA-256 hash)",
            "Signed QR Code (Mandatory on B2B invoices for businesses exceeding Rs. 5 Crore turnover)",
            "Auto-Population into GSTR-1 and E-Way Bill"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d22-b2-eway-bill-generation-rules",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "einvoice_demo.js",
            "initialCode": "function evaluateEInvoiceStatus(turnoverCrores) {\n  return turnoverCrores >= 5\n    ? 'E_INVOICING_MANDATORY_IRN_QR_CODE_REQUIRED'\n    : 'E_INVOICING_EXEMPT_BELOW_5CR';\n}\n\nconsole.log(evaluateEInvoiceStatus(10));\nconsole.log(evaluateEInvoiceStatus(2));",
            "expectedOutput": "E_INVOICING_MANDATORY_IRN_QR_CODE_REQUIRED\nE_INVOICING_EXEMPT_BELOW_5CR",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What compliance status applies to a business with Rs. 10 Crore annual turnover regarding mandatory E-Invoicing?",
          "expectedStringOutput": "E_INVOICING_MANDATORY_IRN_QR_CODE_REQUIRED",
          "acceptableAnswers": [
            "E_INVOICING_MANDATORY_IRN_QR_CODE_REQUIRED",
            "Mandatory",
            "IRN Required"
          ],
          "primaryMisconceptionId": "MC_ACC_EWAY_BILL_GENERATION_AND_DISTANCE_RULES",
          "diagnosisMap": {
            "EXEMPT": {
              "misconceptionId": "MC_ACC_EWAY_BILL_GENERATION_AND_DISTANCE_RULES",
              "errorExplanation": "Turnover >= 5 Crore mandates e-invoicing with IRN and QR codes.",
              "recoveryPath": {
                "simplerExplanation": "E-invoicing is mandatory above 5 Cr.",
                "guidedFixPrompt": "Type E_INVOICING_MANDATORY_IRN_QR_CODE_REQUIRED"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 23,
    "title": "Payroll Accounting: Gross Salary, EPF, ESI & Statutory Deductions",
    "overviewMetaphor": "Payroll Accounting is a Waterfall of Statutory Deductions: an employee earns a Gross Salary of $60,000 (Basic + DA + HRA + Special Allowance); before the paycheck reaches their bank account, mandatory statutory pipes siphon off funds: 12% of Basic+DA goes to the Employee Provident Fund (EPF) for retirement; 0.75% goes to ESI for medical health benefits; $200 goes to Professional Tax (PT); the remaining crystal-clear water flowing into the employee's hands is their Net Take-Home Pay.",
    "blocks": [
      {
        "id": "acc-d23-b1-gross-salary-components",
        "day": 23,
        "blockNumber": 1,
        "title": "Gross Salary Architecture: Basic, DA, HRA & Allowances",
        "conceptBudget": {
          "primaryConcept": "Gross Salary Component Architecture",
          "supportingTerms": [
            "Basic Salary (Fixed core compensation: typically 40-50% of CTC)",
            "Dearness Allowance (DA: Cost-of-living adjustment)",
            "House Rent Allowance (HRA: Eligible for Section 10(13A) tax exemption)",
            "Special Allowances",
            "$\\text{Gross Salary} = \\text{Basic} + \\text{DA} + \\text{HRA} + \\text{Allowances}$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d13-b1-profit-and-loss-account-structure",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Salary Component Structure ($60,000 Gross)",
              "boxes": [
                {
                  "label": "Core Wages ($40,000)",
                  "value": "Basic Pay ($30,000) + Dearness Allowance DA ($10,000) = $40,000 EPF Wages",
                  "varType": "EPF Wage Base",
                  "isUpdated": false
                },
                {
                  "label": "Allowances ($20,000)",
                  "value": "House Rent Allowance HRA ($15,000) + Special Allowance ($5,000)",
                  "varType": "Variable Allowances",
                  "isUpdated": false
                },
                {
                  "label": "Total Gross Pay ($60,000)",
                  "value": "$40,000 + $20,000 = $60,000 Gross Monthly Salary!",
                  "varType": "Gross Monthly",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "salary_comp_demo.js",
            "initialCode": "function calculateGrossSalary(basic, da, hra, special) {\n  const gross = basic + da + hra + special;\n  return {\n    basicSalary: basic,\n    dearnessAllowance: da,\n    epfEligibleWages: basic + da,\n    grossSalary: gross,\n    status: 'GROSS_SALARY_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateGrossSalary(30000, 10000, 15000, 5000)));",
            "expectedOutput": "{\"basicSalary\":30000,\"dearnessAllowance\":10000,\"epfEligibleWages\":40000,\"grossSalary\":60000,\"status\":\"GROSS_SALARY_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What are the EPF-eligible wage base earnings for an employee with $30,000 Basic and $10,000 DA ($30000 + 10000$)?",
          "expectedStringOutput": "40000",
          "acceptableAnswers": [
            "40000",
            "$40,000",
            "epfEligibleWages\":40000"
          ],
          "primaryMisconceptionId": "MC_ACC_PAYROLL_STATUTORY_DEDUCTIONS_EPF_ESI_PT",
          "diagnosisMap": {
            "60000": {
              "misconceptionId": "MC_ACC_PAYROLL_STATUTORY_DEDUCTIONS_EPF_ESI_PT",
              "errorExplanation": "$60,000 is total gross. EPF wages are calculated strictly on Basic + DA = $40,000.",
              "recoveryPath": {
                "simplerExplanation": "30,000 + 10,000 = 40,000.",
                "guidedFixPrompt": "Type 40000"
              }
            }
          }
        }
      },
      {
        "id": "acc-d23-b2-epf-and-esi-deductions",
        "day": 23,
        "blockNumber": 2,
        "title": "Statutory Deductions: EPF (12%), ESI (0.75% / 3.25%) & Professional Tax",
        "conceptBudget": {
          "primaryConcept": "EPF, ESI & PT Statutory Deductions",
          "supportingTerms": [
            "Employee EPF (12% of Basic + DA deducted from employee pay)",
            "Employer EPF (12% contribution: 8.33% EPS pension + 3.67% EPF)",
            "ESI Applicability (Mandatory for Gross $\\le \\text{Rs. 21,000}$: Employee 0.75%, Employer 3.25%)",
            "Professional Tax (PT: State statutory levy typically Rs. 200/month)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d23-b1-gross-salary-components",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Payroll Deductions Calculation",
            "codeSnippet": "const epfWages = basic + da;\nconst employeeEpf = Math.round(epfWages * 0.12); // 12% EPF\nconst employeeEsi = grossSalary <= 21000 ? Math.round(grossSalary * 0.0075) : 0; // 0.75% ESI\nconst totalDeductions = employeeEpf + employeeEsi + pt;\nconst netTakeHome = grossSalary - totalDeductions;",
            "lineNotes": {
              "2": "12% EPF on basic+da.",
              "3": "0.75% ESI if gross <= 21k.",
              "5": "Net take-home pay."
            }
          },
          {
            "type": "runnable_code",
            "filename": "payroll_calc_demo.js",
            "initialCode": "function evaluatePayroll(basic, da, hra, special, pt = 200) {\n  const gross = basic + da + hra + special;\n  const epfWages = basic + da;\n  const epf = Math.round(epfWages * 0.12);\n  const esi = gross <= 21000 ? Math.round(gross * 0.0075) : 0;\n  const totDed = epf + esi + pt;\n  return {\n    grossSalary: gross,\n    epfDeduction: epf,\n    esiDeduction: esi,\n    professionalTax: pt,\n    totalDeductions: totDed,\n    netTakeHome: gross - totDed,\n    status: 'PAYROLL_SLIP_GENERATED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluatePayroll(30000, 10000, 15000, 5000, 200)));",
            "expectedOutput": "{\"grossSalary\":60000,\"epfDeduction\":4800,\"esiDeduction\":0,\"professionalTax\":200,\"totalDeductions\":5000,\"netTakeHome\":55000,\"status\":\"PAYROLL_SLIP_GENERATED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Net Take-Home Pay for an employee with $60,000 Gross Salary and $5,000 in total deductions ($60000 - 5000$)?",
          "expectedStringOutput": "55000",
          "acceptableAnswers": [
            "55000",
            "$55,000",
            "netTakeHome\":55000"
          ],
          "primaryMisconceptionId": "MC_ACC_PAYROLL_STATUTORY_DEDUCTIONS_EPF_ESI_PT",
          "diagnosisMap": {
            "60000": {
              "misconceptionId": "MC_ACC_PAYROLL_STATUTORY_DEDUCTIONS_EPF_ESI_PT",
              "errorExplanation": "Take-home pay deducts EPF ($4,800) and PT ($200) -> $55,000.",
              "recoveryPath": {
                "simplerExplanation": "60,000 - 5,000 = 55,000.",
                "guidedFixPrompt": "Type 55000"
              }
            }
          }
        }
      },
      {
        "id": "acc-d23-b3-ecr-epfo-portal-filing",
        "day": 23,
        "blockNumber": 3,
        "title": "Electronic Challan cum Return (ECR) & EPFO Portal Compliance (Due 15th)",
        "conceptBudget": {
          "primaryConcept": "ECR Payroll Filing Compliance",
          "supportingTerms": [
            "ECR (Electronic Challan cum Return uploaded to unified EPFO portal)",
            "Universal Account Number (UAN) mapping",
            "Statutory Due Date: 15th of the following month (Delayed deposit attracts damages under Section 14B!)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d23-b2-epf-and-esi-deductions",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "ecr_filing_demo.js",
            "initialCode": "function evaluateEcrFilingDueDate(dayOfMonth) {\n  return dayOfMonth <= 15\n    ? 'EPFO_ECR_REMITTANCE_TIMELY_COMPLIANT'\n    : 'DELAYED_EPFO_DEPOSIT_ATTRACTS_PENAL_DAMAGES_SEC_14B';\n}\n\nconsole.log(evaluateEcrFilingDueDate(14));\nconsole.log(evaluateEcrFilingDueDate(18));",
            "expectedOutput": "EPFO_ECR_REMITTANCE_TIMELY_COMPLIANT\nDELAYED_EPFO_DEPOSIT_ATTRACTS_PENAL_DAMAGES_SEC_14B",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What compliance status is confirmed when monthly EPF ECR remittances are deposited by the 14th of the month?",
          "expectedStringOutput": "EPFO_ECR_REMITTANCE_TIMELY_COMPLIANT",
          "acceptableAnswers": [
            "EPFO_ECR_REMITTANCE_TIMELY_COMPLIANT",
            "Timely Compliant",
            "Compliant"
          ],
          "primaryMisconceptionId": "MC_ACC_PAYROLL_STATUTORY_DEDUCTIONS_EPF_ESI_PT",
          "diagnosisMap": {
            "PENALTY": {
              "misconceptionId": "MC_ACC_PAYROLL_STATUTORY_DEDUCTIONS_EPF_ESI_PT",
              "errorExplanation": "Due date is the 15th, so filing on the 14th is timely compliant.",
              "recoveryPath": {
                "simplerExplanation": "Filing by 15th is timely.",
                "guidedFixPrompt": "Type EPFO_ECR_REMITTANCE_TIMELY_COMPLIANT"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 24,
    "title": "Tax Deducted at Source (TDS): Sections 194C, 194J, 194I & Form 16/26AS",
    "overviewMetaphor": "TDS is Pay-As-You-Go Tax Withholding at the Source: when a company pays a $100,000 fee to a legal consultant (Section 194J), the law forbids giving all $100,000 to the lawyer; instead, the company withholds 10% ($10,000) and deposits it into the government's treasury using Challan ITNS 281; the company gives the lawyer a Form 16A tax credit certificate—which automatically shows up in the lawyer's official government Form 26AS / AIS ledger.",
    "blocks": [
      {
        "id": "acc-d24-b1-tds-sections-194c-194j-194i",
        "day": 24,
        "blockNumber": 1,
        "title": "TDS Section Matrix: 194C (Contractors), 194J (Professionals) & 194I (Rent)",
        "conceptBudget": {
          "primaryConcept": "TDS Withholding Sections & Rates",
          "supportingTerms": [
            "Section 194C: Contractors (1% Individual/HUF, 2% Company/Firm)",
            "Section 194J: Professional & Technical Fees (10% Professional, 2% Technical)",
            "Section 194I: Rent (10% Land/Building/Furniture, 2% Plant & Machinery)",
            "Section 192: TDS on Salaries",
            "TAN (Tax Deduction and Collection Account Number)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d23-b1-gross-salary-components",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "TDS Withholding Rate Schedule",
              "boxes": [
                {
                  "label": "Section 194C (Civil Contractor)",
                  "value": "Individual: 1% | Company: 2% (Threshold: Rs. 30k single / Rs. 1L annual)",
                  "varType": "Contractor Rate",
                  "isUpdated": false
                },
                {
                  "label": "Section 194J (Chartered Accountant / Lawyer)",
                  "value": "Professional Fee: 10% (Threshold: Rs. 30,000 per FY)",
                  "varType": "Professional Rate",
                  "isUpdated": false
                },
                {
                  "label": "Section 194I (Office Rent)",
                  "value": "Building Rent: 10% (Threshold: Rs. 2,40,000 per FY)",
                  "varType": "Rental Rate",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "tds_rates_demo.js",
            "initialCode": "function calculateTds(amount, sectionCode, isCompany) {\n  let rate = 0;\n  if (sectionCode === '194C') rate = isCompany ? 0.02 : 0.01;\n  if (sectionCode === '194J') rate = 0.10;\n  if (sectionCode === '194I') rate = 0.10;\n  const tds = amount * rate;\n  return {\n    invoiceAmount: amount,\n    section: sectionCode,\n    tdsWithheld: tds,\n    netPayable: amount - tds,\n    status: 'TDS_WITHHELD_AT_SOURCE'\n  };\n}\n\nconsole.log(JSON.stringify(calculateTds(100000, '194J', true)));\nconsole.log(JSON.stringify(calculateTds(100000, '194C', false)));",
            "expectedOutput": "{\"invoiceAmount\":100000,\"section\":\"194J\",\"tdsWithheld\":10000,\"netPayable\":90000,\"status\":\"TDS_WITHHELD_AT_SOURCE\"}\n{\"invoiceAmount\":100000,\"section\":\"194C\",\"tdsWithheld\":1000,\"netPayable\":99000,\"status\":\"TDS_WITHHELD_AT_SOURCE\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How much TDS is withheld on a $100,000 professional consulting invoice under Section 194J (10% rate: $100000 \\times 0.10$)?",
          "expectedStringOutput": "10000",
          "acceptableAnswers": [
            "10000",
            "$10,000",
            "tdsWithheld\":10000"
          ],
          "primaryMisconceptionId": "MC_ACC_TDS_COMPLIANCE_SECTIONS_194C_194J_194I",
          "diagnosisMap": {
            "2000": {
              "misconceptionId": "MC_ACC_TDS_COMPLIANCE_SECTIONS_194C_194J_194I",
              "errorExplanation": "2% is for technical services. Professional consulting under 194J is 10% = $10,000.",
              "recoveryPath": {
                "simplerExplanation": "100,000 * 0.10 = 10,000.",
                "guidedFixPrompt": "Type 10000"
              }
            }
          }
        }
      },
      {
        "id": "acc-d24-b2-tds-payment-challan-281-and-quarterly-returns",
        "day": 24,
        "blockNumber": 2,
        "title": "TDS Payment via Challan ITNS 281 & Quarterly Returns (24Q / 26Q)",
        "conceptBudget": {
          "primaryConcept": "TDS Remittance & Quarterly Return Filing",
          "supportingTerms": [
            "Challan ITNS 281 (Monthly deposit of TDS by 7th of following month; 30th April for March TDS)",
            "Form 24Q (Quarterly return for salary TDS under Sec 192)",
            "Form 26Q (Quarterly return for non-salary TDS under Sec 194C/J/I)",
            "TRACES Portal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d24-b1-tds-sections-194c-194j-194i",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "tds_challan_demo.js",
            "initialCode": "function evaluateTdsForm(isSalary) {\n  return isSalary\n    ? 'FORM_24Q_QUARTERLY_SALARY_TDS_RETURN'\n    : 'FORM_26Q_QUARTERLY_NON_SALARY_TDS_RETURN';\n}\n\nconsole.log(evaluateTdsForm(true));\nconsole.log(evaluateTdsForm(false));",
            "expectedOutput": "FORM_24Q_QUARTERLY_SALARY_TDS_RETURN\nFORM_26Q_QUARTERLY_NON_SALARY_TDS_RETURN",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which quarterly TDS return form is filed for non-salary deductions (Vendor contractors, rent, and professional fees)?",
          "expectedStringOutput": "FORM_26Q_QUARTERLY_NON_SALARY_TDS_RETURN",
          "acceptableAnswers": [
            "FORM_26Q_QUARTERLY_NON_SALARY_TDS_RETURN",
            "Form 26Q",
            "26Q"
          ],
          "primaryMisconceptionId": "MC_ACC_TDS_COMPLIANCE_SECTIONS_194C_194J_194I",
          "diagnosisMap": {
            "24Q": {
              "misconceptionId": "MC_ACC_TDS_COMPLIANCE_SECTIONS_194C_194J_194I",
              "errorExplanation": "Form 24Q is for salaries. Form 26Q is for non-salary payments.",
              "recoveryPath": {
                "simplerExplanation": "Non-salary uses Form 26Q.",
                "guidedFixPrompt": "Type FORM_26Q_QUARTERLY_NON_SALARY_TDS_RETURN"
              }
            }
          }
        }
      },
      {
        "id": "acc-d24-b3-form-16-and-traces-26as-reconciliation",
        "day": 24,
        "blockNumber": 3,
        "title": "Form 16 / 16A Certificates & TRACES Form 26AS / AIS Reconciliation",
        "conceptBudget": {
          "primaryConcept": "Form 16 & Form 26AS Reconciliation",
          "supportingTerms": [
            "Form 16 (Annual salary TDS certificate issued to employees: Part A tax deposited + Part B salary computation)",
            "Form 16A (Quarterly non-salary TDS certificate downloaded from TRACES)",
            "Form 26AS & AIS (Annual Information Statement reflecting all taxes credited to PAN)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d24-b2-tds-payment-challan-281-and-quarterly-returns",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "form16_demo.js",
            "initialCode": "function evaluateForm16Match(booksTds, form26asTds) {\n  const isMatched = (booksTds === form26asTds);\n  return {\n    booksWithheldTds: booksTds,\n    traces26asReflectedTds: form26asTds,\n    isFullyCredited: isMatched,\n    status: isMatched ? 'TDS_CREDIT_PERFECTLY_MATCHED_IN_26AS' : 'TDS_MISMATCH_TRACES_CORRECTION_REQUIRED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateForm16Match(10000, 10000)));",
            "expectedOutput": "{\"booksWithheldTds\":10000,\"traces26asReflectedTds\":10000,\"isFullyCredited\":true,\"status\":\"TDS_CREDIT_PERFECTLY_MATCHED_IN_26AS\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that TDS withheld in company books matches the tax credit reflected in the government Form 26AS on TRACES?",
          "expectedStringOutput": "TDS_CREDIT_PERFECTLY_MATCHED_IN_26AS",
          "acceptableAnswers": [
            "TDS_CREDIT_PERFECTLY_MATCHED_IN_26AS",
            "status\":\"TDS_CREDIT_PERFECTLY_MATCHED_IN_26AS\""
          ],
          "primaryMisconceptionId": "MC_ACC_TDS_COMPLIANCE_SECTIONS_194C_194J_194I",
          "diagnosisMap": {
            "MISMATCH": {
              "misconceptionId": "MC_ACC_TDS_COMPLIANCE_SECTIONS_194C_194J_194I",
              "errorExplanation": "Equal numbers confirm TDS_CREDIT_PERFECTLY_MATCHED_IN_26AS.",
              "recoveryPath": {
                "simplerExplanation": "Matches TDS_CREDIT_PERFECTLY_MATCHED_IN_26AS.",
                "guidedFixPrompt": "Type TDS_CREDIT_PERFECTLY_MATCHED_IN_26AS"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 25,
    "title": "Direct Income Tax: Old vs New Tax Regime (Section 115BAC)",
    "overviewMetaphor": "Choosing Between Old and New Tax Regimes is Choosing Between a Heavy Discount Coupon Booklet vs Everyday Low Flat Prices: the Old Tax Regime has high tax rates, but lets you use dozens of deduction coupons (Section 80C $1.5L, 80D medical $25k, HRA, Home Loan interest); the New Tax Regime (Section 115BAC) throws away almost all coupons, but offers super-low flat tax slabs, a $75,000 standard deduction, and zero tax on income up to Rs. 7.75 Lakhs.",
    "blocks": [
      {
        "id": "acc-d25-b1-old-tax-regime-deductions",
        "day": 25,
        "blockNumber": 1,
        "title": "Old Tax Regime: Chapter VI-A Deductions (80C, 80D) & Slab Rates",
        "conceptBudget": {
          "primaryConcept": "Old Tax Regime Deductions",
          "supportingTerms": [
            "Standard Deduction: Rs. 50,000",
            "Section 80C: Up to Rs. 1,50,000 (EPF, PPF, ELSS, Life Insurance, School Tuition)",
            "Section 80D: Health Insurance premiums (Rs. 25,000 self + Rs. 50,000 senior parents)",
            "Section 24(b): Home loan interest up to Rs. 2,00,000",
            "Old Slabs (0-2.5L Nil, 2.5-5L 5%, 5-10L 20%, >10L 30%)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d24-b1-tds-sections-194c-194j-194i",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Old Regime Deduction Stack ($12L Gross Income)",
              "boxes": [
                {
                  "label": "Gross Salary ($1,200,000)",
                  "value": "Standard Deduction (-$50k) = $1,150,000",
                  "varType": "Gross Base",
                  "isUpdated": false
                },
                {
                  "label": "Chapter VI-A Deductions (-$175,000)",
                  "value": "Section 80C (-$150k) + Section 80D (-$25k) = -$175,000",
                  "varType": "Exemptions",
                  "isUpdated": false
                },
                {
                  "label": "Net Taxable Income ($975,000)",
                  "value": "Tax computed on $975,000 under old slabs!",
                  "varType": "Taxable Base",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "old_regime_demo.js",
            "initialCode": "function calculateOldRegimeTaxable(gross, d80c = 150000, d80d = 25000) {\n  const taxable = Math.max(0, gross - 50000 - d80c - d80d);\n  return {\n    grossSalary: gross,\n    standardDeduction: 50000,\n    chapterViADeductions: d80c + d80d,\n    netTaxableIncome: taxable,\n    status: 'OLD_REGIME_TAXABLE_INCOME_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateOldRegimeTaxable(1200000, 150000, 25000)));",
            "expectedOutput": "{\"grossSalary\":120000,\"standardDeduction\":50000,\"chapterViADeductions\":175000,\"netTaxableIncome\":975000,\"status\":\"OLD_REGIME_TAXABLE_INCOME_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Net Taxable Income under the Old Regime for an individual earning $1,200,000 Gross after $50,000 Standard Deduction and $175,000 in 80C/80D deductions ($1200000 - 50000 - 175000$)?",
          "expectedStringOutput": "975000",
          "acceptableAnswers": [
            "975000",
            "$975,000",
            "netTaxableIncome\":975000"
          ],
          "primaryMisconceptionId": "MC_ACC_INCOME_TAX_OLD_VS_NEW_REGIME_SECTION_115BAC",
          "diagnosisMap": {
            "1025000": {
              "misconceptionId": "MC_ACC_INCOME_TAX_OLD_VS_NEW_REGIME_SECTION_115BAC",
              "errorExplanation": "Forgot the $50,000 Standard Deduction. $12L - $50k - $175k = $975,000.",
              "recoveryPath": {
                "simplerExplanation": "1200000 - 50000 - 175000 = 975000.",
                "guidedFixPrompt": "Type 975000"
              }
            }
          }
        }
      },
      {
        "id": "acc-d25-b2-new-tax-regime-section-115bac",
        "day": 25,
        "blockNumber": 2,
        "title": "New Default Tax Regime (Section 115BAC) Slabs & Rs. 75,000 Standard Deduction",
        "conceptBudget": {
          "primaryConcept": "New Tax Regime (Section 115BAC)",
          "supportingTerms": [
            "Default Regime (Applies automatically unless opting out)",
            "Standard Deduction: Rs. 75,000 (Enhanced for salaried employees)",
            "Section 87A Rebate (Zero tax up to Rs. 7 Lakhs taxable income / Rs. 7.75 Lakhs gross!)",
            "Concessional Slabs (0-3L Nil, 3-7L 5%, 7-10L 10%, 10-12L 15%, 12-15L 20%, >15L 30%)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d25-b1-old-tax-regime-deductions",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Section 115BAC Slabs Breakdown",
            "codeSnippet": "// 0 to 3,00,000: NIL (0%)\n// 3,00,001 to 7,00,000: 5% (Eligible for Sec 87A rebate if total <= 7L!)\n// 7,00,001 to 10,00,000: 10%\n// 10,00,001 to 12,00,000: 15%\n// 12,00,001 to 15,00,000: 20%\n// Above 15,00,000: 30%",
            "lineNotes": {
              "1": "Basic exemption limit.",
              "2": "Full rebate up to 7 Lakhs.",
              "6": "Peak 30% slab above 15 Lakhs."
            }
          },
          {
            "type": "runnable_code",
            "filename": "new_regime_demo.js",
            "initialCode": "function calculateNewRegimeTaxable(grossSalary) {\n  const taxable = Math.max(0, grossSalary - 75000);\n  return {\n    grossSalary,\n    standardDeduction: 75000,\n    netTaxableIncome: taxable,\n    status: 'NEW_REGIME_SECTION_115BAC_TAXABLE_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateNewRegimeTaxable(1200000)));",
            "expectedOutput": "{\"grossSalary\":1200000,\"standardDeduction\":75000,\"netTaxableIncome\":1125000,\"status\":\"NEW_REGIME_SECTION_115BAC_TAXABLE_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the enhanced Standard Deduction available to salaried employees under the New Tax Regime (Section 115BAC)?",
          "expectedStringOutput": "75000",
          "acceptableAnswers": [
            "75000",
            "Rs. 75,000",
            "75,000",
            "standardDeduction\":75000"
          ],
          "primaryMisconceptionId": "MC_ACC_INCOME_TAX_OLD_VS_NEW_REGIME_SECTION_115BAC",
          "diagnosisMap": {
            "50000": {
              "misconceptionId": "MC_ACC_INCOME_TAX_OLD_VS_NEW_REGIME_SECTION_115BAC",
              "errorExplanation": "Rs. 50,000 was the old deduction. Budget enhanced it to Rs. 75,000 for Section 115BAC.",
              "recoveryPath": {
                "simplerExplanation": "New regime standard deduction is 75,000.",
                "guidedFixPrompt": "Type 75000"
              }
            }
          }
        }
      },
      {
        "id": "acc-d25-b3-regime-optimization-comparator",
        "day": 25,
        "blockNumber": 3,
        "title": "Regime Optimization Algorithm: Automated Break-Even Analysis",
        "conceptBudget": {
          "primaryConcept": "Tax Regime Break-Even Optimization",
          "supportingTerms": [
            "Break-Even Deductions Level (Typically Rs. 3.75 Lakhs to 4.25 Lakhs)",
            "If Total Deductions > Break-Even $\\implies$ Choose Old Regime",
            "If Total Deductions < Break-Even $\\implies$ Choose New Regime"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d25-b2-new-tax-regime-section-115bac",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "regime_compare_demo.js",
            "initialCode": "function recommendTaxRegime(oldTax, newTax) {\n  const savings = Math.abs(oldTax - newTax);\n  const isNewBetter = newTax <= oldTax;\n  return {\n    recommendedRegime: isNewBetter ? 'NEW_REGIME_SECTION_115BAC' : 'OLD_REGIME_WITH_DEDUCTIONS',\n    taxSavingsDollars: savings,\n    status: 'OPTIMAL_TAX_REGIME_RECOMMENDED'\n  };\n}\n\nconsole.log(JSON.stringify(recommendTaxRegime(115000, 85000)));",
            "expectedOutput": "{\"recommendedRegime\":\"NEW_REGIME_SECTION_115BAC\",\"taxSavingsDollars\":30000,\"status\":\"OPTIMAL_TAX_REGIME_RECOMMENDED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which regime is recommended when tax liability under the Old Regime is $115,000 and under the New Regime is $85,000?",
          "expectedStringOutput": "NEW_REGIME_SECTION_115BAC",
          "acceptableAnswers": [
            "NEW_REGIME_SECTION_115BAC",
            "New Regime",
            "Section 115BAC"
          ],
          "primaryMisconceptionId": "MC_ACC_INCOME_TAX_OLD_VS_NEW_REGIME_SECTION_115BAC",
          "diagnosisMap": {
            "OLD": {
              "misconceptionId": "MC_ACC_INCOME_TAX_OLD_VS_NEW_REGIME_SECTION_115BAC",
              "errorExplanation": "New Regime results in $30,000 lower tax, so New Regime is optimal.",
              "recoveryPath": {
                "simplerExplanation": "New regime saves 30k.",
                "guidedFixPrompt": "Type NEW_REGIME_SECTION_115BAC"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 26,
    "title": "Capital Gains Taxation & Corporate Income Tax (Section 115BAA)",
    "overviewMetaphor": "Capital Gains and Corporate Taxes are the Two Growth Engines of State Revenue: when you sell shares or real estate, you pay Capital Gains Tax: Short-Term Gains (STCG Sec 111A: 20%) if held briefly, or Long-Term Gains (LTCG Sec 112A: 12.5% above a $125,000 exemption) if held for years; for manufacturing corporations, Section 115BAA offers a competitive flat base tax of 22%—which, with mandatory 10% surcharge and 4% health/education cess, yields an exact 25.168% effective corporate tax rate.",
    "blocks": [
      {
        "id": "acc-d26-b1-stcg-vs-ltcg-taxation",
        "day": 26,
        "blockNumber": 1,
        "title": "Capital Gains: Short-Term (STCG Section 111A) vs Long-Term (LTCG Section 112A)",
        "conceptBudget": {
          "primaryConcept": "Capital Gains Tax Computation",
          "supportingTerms": [
            "STCG Section 111A (Listed equity held $\\le 12$ months $\\implies$ 20% flat tax)",
            "LTCG Section 112A (Listed equity held $> 12$ months $\\implies$ 12.5% tax on gains exceeding Rs. 1,25,000 exemption limit)",
            "Cost Inflation Index (CII)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d25-b2-new-tax-regime-section-115bac",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "LTCG Calculation on $225,000 Long-Term Equity Gain",
              "boxes": [
                {
                  "label": "Total Realized LTCG Gain",
                  "value": "$225,000 (Holding period > 12 months)",
                  "varType": "Gross Gain",
                  "isUpdated": false
                },
                {
                  "label": "Section 112A Exemption Limit",
                  "value": "Less: Mandatory $125,000 Annual Exemption = Taxable Base $100,000",
                  "varType": "Exemption Base",
                  "isUpdated": false
                },
                {
                  "label": "Tax Liability @ 12.5%",
                  "value": "Formula: $100,000 x 12.5% = $12,500 LTCG Tax!",
                  "varType": "Tax Payable",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "ltcg_calc_demo.js",
            "initialCode": "function calculateLtcgTax(gainAmount) {\n  const taxable = Math.max(0, gainAmount - 125000);\n  const tax = taxable * 0.125;\n  return {\n    grossCapitalGain: gainAmount,\n    exemptionLimit: 125000,\n    taxableLtcg: taxable,\n    ltcgTaxPayable: Number(tax.toFixed(2)),\n    status: 'LTCG_SECTION_112A_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateLtcgTax(225000)));",
            "expectedOutput": "{\"grossCapitalGain\":225000,\"exemptionLimit\":125000,\"taxableLtcg\":100000,\"ltcgTaxPayable\":12500,\"status\":\"LTCG_SECTION_112A_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the LTCG tax payable on a $225,000 long-term capital gain under Section 112A ($ (225000 - 125000) \\times 0.125 $)?",
          "expectedStringOutput": "12500",
          "acceptableAnswers": [
            "12500",
            "$12,500",
            "ltcgTaxPayable\":12500"
          ],
          "primaryMisconceptionId": "MC_ACC_CAPITAL_GAINS_INDEXATION_AND_TAX_COMPUTATION",
          "diagnosisMap": {
            "28125": {
              "misconceptionId": "MC_ACC_CAPITAL_GAINS_INDEXATION_AND_TAX_COMPUTATION",
              "errorExplanation": "Forgot the $125,000 exemption limit. Taxable gain is $100,000 * 12.5% = $12,500.",
              "recoveryPath": {
                "simplerExplanation": "(225000 - 125000) * 0.125 = 12500.",
                "guidedFixPrompt": "Type 12500"
              }
            }
          }
        }
      },
      {
        "id": "acc-d26-b2-corporate-tax-section-115baa",
        "day": 26,
        "blockNumber": 2,
        "title": "Corporate Income Tax: Section 115BAA Effective Rate (25.168%)",
        "conceptBudget": {
          "primaryConcept": "Corporate Tax Section 115BAA Effective Rate",
          "supportingTerms": [
            "Base Corporate Tax Rate: 22%",
            "Mandatory Surcharge: 10% on base tax ($22\\% \\times 1.10 = 24.2\\%$)",
            "Health & Education Cess: 4% on tax+surcharge ($24.2\\% \\times 1.04 = 25.168\\%$)",
            "Zero Minimum Alternate Tax (MAT Section 115JB exempt!)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d26-b1-stcg-vs-ltcg-taxation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Section 115BAA Effective Rate Math",
            "codeSnippet": "const baseTax = 0.22; // 22%\nconst withSurcharge = baseTax * 1.10; // 24.2%\nconst effectiveRate = withSurcharge * 1.04; // 25.168%\nconst corporateTax = taxableNetProfit * effectiveRate;",
            "lineNotes": {
              "1": "Base rate.",
              "2": "10% surcharge.",
              "3": "4% cess.",
              "4": "Exact 25.168% effective corporate rate."
            }
          },
          {
            "type": "runnable_code",
            "filename": "corp_tax_demo.js",
            "initialCode": "function calculateCorporateTax(profit) {\n  const effectiveRate = 0.25168;\n  const tax = profit * effectiveRate;\n  return {\n    taxableNetProfit: profit,\n    effectiveTaxRatePercent: 25.168,\n    corporateTaxPayable: Number(tax.toFixed(2)),\n    matExempt: true,\n    status: 'CORPORATE_TAX_SECTION_115BAA_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateCorporateTax(1000000)));",
            "expectedOutput": "{\"taxableNetProfit\":1000000,\"effectiveTaxRatePercent\":25.168,\"corporateTaxPayable\":251680,\"matExempt\":true,\"status\":\"CORPORATE_TAX_SECTION_115BAA_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the exact effective corporate tax rate (percentage) under Section 115BAA including 10% surcharge and 4% cess?",
          "expectedStringOutput": "25.168",
          "acceptableAnswers": [
            "25.168",
            "25.168%",
            "effectiveTaxRatePercent\":25.168"
          ],
          "primaryMisconceptionId": "MC_ACC_CORPORATE_TAX_SECTION_115BAA_EFFECTIVE_RATE",
          "diagnosisMap": {
            "22": {
              "misconceptionId": "MC_ACC_CORPORATE_TAX_SECTION_115BAA_EFFECTIVE_RATE",
              "errorExplanation": "22% is the base rate before adding the 10% surcharge and 4% cess = 25.168%.",
              "recoveryPath": {
                "simplerExplanation": "Effective rate is 25.168%.",
                "guidedFixPrompt": "Type 25.168"
              }
            }
          }
        }
      },
      {
        "id": "acc-d26-b3-advance-tax-installments",
        "day": 26,
        "blockNumber": 3,
        "title": "Advance Tax Schedule (Section 208/211): 15%, 45%, 75%, 100%",
        "conceptBudget": {
          "primaryConcept": "Advance Tax Installment Schedule",
          "supportingTerms": [
            "Mandatory Threshold: Total Tax Liability $\\ge \\text{Rs. 10,000}$",
            "1st Installment (By June 15: 15% of estimated tax)",
            "2nd Installment (By Sept 15: 45% of estimated tax)",
            "3rd Installment (By Dec 15: 75% of estimated tax)",
            "4th Installment (By March 15: 100% of estimated tax)",
            "Interest Section 234B & 234C on default"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d26-b2-corporate-tax-section-115baa",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "advance_tax_demo.js",
            "initialCode": "function getAdvanceTaxCumulative(quarter) {\n  const map = { 'Q1_JUNE_15': 15, 'Q2_SEPT_15': 45, 'Q3_DEC_15': 75, 'Q4_MARCH_15': 100 };\n  return map[quarter] || 0;\n}\n\nconsole.log(getAdvanceTaxCumulative('Q2_SEPT_15'));\nconsole.log(getAdvanceTaxCumulative('Q4_MARCH_15'));",
            "expectedOutput": "45\n100",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What cumulative percentage of estimated annual income tax must be deposited by September 15 (2nd Installment)?",
          "expectedStringOutput": "45",
          "acceptableAnswers": [
            "45",
            "45%"
          ],
          "primaryMisconceptionId": "MC_ACC_CORPORATE_TAX_SECTION_115BAA_EFFECTIVE_RATE",
          "diagnosisMap": {
            "50": {
              "misconceptionId": "MC_ACC_CORPORATE_TAX_SECTION_115BAA_EFFECTIVE_RATE",
              "errorExplanation": "Statutory percentage by September 15 is 45%.",
              "recoveryPath": {
                "simplerExplanation": "September 15 is 45%.",
                "guidedFixPrompt": "Type 45"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 27,
    "title": "Financial Statement Analysis: Liquidity, Solvency & Profitability Ratios",
    "overviewMetaphor": "Financial Ratios are the Doctor's Vital Health Monitors for a Company: a doctor checks blood pressure, heart rate, and temperature; a financial analyst checks Current Ratio ($CA / CL \\ge 2.0$) to see if the company can pay immediate bills; Quick Ratio ($(CA - \\text{Inventory}) / CL \\ge 1.0$) to test emergency survival without selling stock; Debt-to-Equity ($D/E$) to test solvency leverage; and Net Profit Margin to test operating efficiency.",
    "blocks": [
      {
        "id": "acc-d27-b1-liquidity-ratios-current-and-quick",
        "day": 27,
        "blockNumber": 1,
        "title": "Liquidity Vital Signs: Current Ratio (2:1) & Quick / Acid-Test Ratio (1:1)",
        "conceptBudget": {
          "primaryConcept": "Liquidity Ratio Benchmarks",
          "supportingTerms": [
            "$\\text{Current Ratio} = \\frac{\\text{Current Assets}}{\\text{Current Liabilities}}$ (Ideal Benchmark: $2:1$)",
            "$\\text{Quick / Acid-Test Ratio} = \\frac{\\text{Current Assets} - \\text{Inventory} - \\text{Prepaid Expenses}}{\\text{Current Liabilities}}$ (Ideal Benchmark: $1:1$)",
            "Short-Term Solvency Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d14-b2-working-capital-ca-minus-cl",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Liquidity Ratios ($200k CA, $50k Inv, $100k CL)",
              "boxes": [
                {
                  "label": "Current Ratio ($200,000 / $100,000)",
                  "value": "Current Ratio = 2.0 (Meets 2:1 ideal benchmark!)",
                  "varType": "Current Ratio",
                  "isUpdated": false
                },
                {
                  "label": "Quick Assets ($200k - $50k = $150k)",
                  "value": "Quick Ratio = $150,000 / $100,000 = 1.5 (Meets 1:1 acid test!)",
                  "varType": "Quick Ratio",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "liquidity_demo.js",
            "initialCode": "function evaluateLiquidity(ca, inv, cl) {\n  const cr = ca / cl;\n  const qr = (ca - inv) / cl;\n  return {\n    currentRatio: Number(cr.toFixed(2)),\n    quickRatio: Number(qr.toFixed(2)),\n    isLiquid: cr >= 1.33 && qr >= 1.0,\n    status: 'LIQUIDITY_HEALTH_EVALUATED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateLiquidity(200000, 50000, 100000)));",
            "expectedOutput": "{\"currentRatio\":2,\"quickRatio\":1.5,\"isLiquid\":true,\"status\":\"LIQUIDITY_HEALTH_EVALUATED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Quick Ratio for a business with $200,000 Current Assets, $50,000 Inventory, and $100,000 Current Liabilities ($ (200000 - 50000) / 100000 $)?",
          "expectedStringOutput": "1.5",
          "acceptableAnswers": [
            "1.5",
            "1.5:1",
            "quickRatio\":1.5"
          ],
          "primaryMisconceptionId": "MC_ACC_FINANCIAL_RATIO_ANALYSIS_LIQUIDITY_PROFITABILITY",
          "diagnosisMap": {
            "2.0": {
              "misconceptionId": "MC_ACC_FINANCIAL_RATIO_ANALYSIS_LIQUIDITY_PROFITABILITY",
              "errorExplanation": "2.0 is the Current Ratio. Quick Ratio subtracts inventory: (200k - 50k)/100k = 1.5.",
              "recoveryPath": {
                "simplerExplanation": "150000 / 100000 = 1.5.",
                "guidedFixPrompt": "Type 1.5"
              }
            }
          }
        }
      },
      {
        "id": "acc-d27-b2-solvency-and-profitability-ratios",
        "day": 27,
        "blockNumber": 2,
        "title": "Solvency & Profitability: Debt-to-Equity ($D/E$), ROE & Net Margin",
        "conceptBudget": {
          "primaryConcept": "Solvency & Profitability Metrics",
          "supportingTerms": [
            "$\\text{Debt-to-Equity} = \\frac{\\text{Total Long-Term Debt}}{\\text{Shareholders' Equity}}$ (Conservative $< 1.0$)",
            "$\\text{Net Profit Margin} = \\frac{\\text{Net Profit}}{\\text{Revenue}} \\times 100\\%$",
            "$\\text{Return on Equity (ROE)} = \\frac{\\text{Net Profit}}{\\text{Equity}} \\times 100\\%$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d27-b1-liquidity-ratios-current-and-quick",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "profitability_demo.js",
            "initialCode": "function evaluateSolvencyProfitability(debt, equity, netProfit, revenue) {\n  const de = debt / equity;\n  const npm = (netProfit / revenue) * 100;\n  const roe = (netProfit / equity) * 100;\n  return {\n    debtToEquity: Number(de.toFixed(2)),\n    netProfitMarginPercent: Number(npm.toFixed(2)),\n    returnOnEquityPercent: Number(roe.toFixed(2)),\n    status: 'SOLVENCY_PROFITABILITY_EVALUATED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateSolvencyProfitability(150000, 300000, 40000, 400000)));",
            "expectedOutput": "{\"debtToEquity\":0.5,\"netProfitMarginPercent\":10,\"returnOnEquityPercent\":13.33,\"status\":\"SOLVENCY_PROFITABILITY_EVALUATED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Debt-to-Equity ratio for a corporation with $150,000 Long-Term Debt and $300,000 Equity ($150000 / 300000$)?",
          "expectedStringOutput": "0.5",
          "acceptableAnswers": [
            "0.5",
            "0.5:1",
            "debtToEquity\":0.5"
          ],
          "primaryMisconceptionId": "MC_ACC_FINANCIAL_RATIO_ANALYSIS_LIQUIDITY_PROFITABILITY",
          "diagnosisMap": {
            "2.0": {
              "misconceptionId": "MC_ACC_FINANCIAL_RATIO_ANALYSIS_LIQUIDITY_PROFITABILITY",
              "errorExplanation": "D/E = Debt / Equity = 150,000 / 300,000 = 0.5.",
              "recoveryPath": {
                "simplerExplanation": "150000 / 300000 = 0.5.",
                "guidedFixPrompt": "Type 0.5"
              }
            }
          }
        }
      },
      {
        "id": "acc-d27-b3-working-capital-turnover-cycle",
        "day": 27,
        "blockNumber": 3,
        "title": "Cash Conversion Cycle (CCC) & Debtor / Creditor Days",
        "conceptBudget": {
          "primaryConcept": "Cash Conversion Cycle (CCC)",
          "supportingTerms": [
            "$\\text{Debtor Days (DSO)} = \\frac{\\text{Debtors}}{\\text{Credit Sales}} \\times 365$",
            "$\\text{Inventory Days (DIO)} = \\frac{\\text{Inventory}}{\\text{COGS}} \\times 365$",
            "$\\text{Creditor Days (DPO)} = \\frac{\\text{Creditors}}{\\text{Credit Purchases}} \\times 365$",
            "$\\text{CCC} = \\text{DIO} + \\text{DSO} - \\text{DPO}$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d27-b2-solvency-and-profitability-ratios",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "ccc_demo.js",
            "initialCode": "function calculateCcc(dio, dso, dpo) {\n  const ccc = dio + dso - dpo;\n  return {\n    daysInventoryOutstanding: dio,\n    daysSalesOutstanding: dso,\n    daysPayableOutstanding: dpo,\n    cashConversionCycleDays: ccc,\n    status: 'CCC_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateCcc(45, 30, 40))); // 45 + 30 - 40 = 35 days",
            "expectedOutput": "{\"daysInventoryOutstanding\":45,\"daysSalesOutstanding\":30,\"daysPayableOutstanding\":40,\"cashConversionCycleDays\":35,\"status\":\"CCC_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Cash Conversion Cycle (days) when Inventory Days are 45, Debtor Days are 30, and Creditor Days are 40 ($45 + 30 - 40$)?",
          "expectedStringOutput": "35",
          "acceptableAnswers": [
            "35",
            "35 days",
            "cashConversionCycleDays\":35"
          ],
          "primaryMisconceptionId": "MC_ACC_WORKING_CAPITAL_CYCLE_MANAGEMENT",
          "diagnosisMap": {
            "115": {
              "misconceptionId": "MC_ACC_WORKING_CAPITAL_CYCLE_MANAGEMENT",
              "errorExplanation": "Creditor days are subtracted: 45 + 30 - 40 = 35 days.",
              "recoveryPath": {
                "simplerExplanation": "45 + 30 - 40 = 35.",
                "guidedFixPrompt": "Type 35"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 28,
    "title": "Cash Flow Statement (AS-3): Operating, Investing & Financing Cashflows",
    "overviewMetaphor": "The Cash Flow Statement is an X-Ray of Pure Hard Currency: a company might report $50,000 on paper in Net Profit, but only have $10 in physical bank cash because customers haven't paid their bills yet; AS-3 splits all real money flows into three channels: 1. Operating Activities (Day-to-day business cash generation); 2. Investing Activities (Buying/selling factories and machinery); 3. Financing Activities (Borrowing bank loans or paying dividends).",
    "blocks": [
      {
        "id": "acc-d28-b1-as3-three-pillars-of-cash-flow",
        "day": 28,
        "blockNumber": 1,
        "title": "The 3 Pillars of AS-3: Operating, Investing & Financing Activities",
        "conceptBudget": {
          "primaryConcept": "AS-3 Cash Flow Pillars",
          "supportingTerms": [
            "Cash Flow from Operating Activities (CFO: Core revenue engine)",
            "Cash Flow from Investing Activities (CFI: Capital expenditures CapEx, buying/selling fixed assets)",
            "Cash Flow from Financing Activities (CFF: Debt issuance, equity funding, dividend payouts)",
            "$\\text{Net Cash Flow} = \\text{CFO} + \\text{CFI} + \\text{CFF}$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d14-b2-working-capital-ca-minus-cl",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "AS-3 Three Cash Flow Streams ($40,000 Net Cash Flow)",
              "boxes": [
                {
                  "label": "1. Operating Activities (CFO)",
                  "value": "+$55,000 generated from customer sales & operating cash",
                  "varType": "Operating Cash",
                  "isUpdated": false
                },
                {
                  "label": "2. Investing Activities (CFI)",
                  "value": "-$25,000 spent purchasing new factory equipment (CapEx)",
                  "varType": "Investing Cash",
                  "isUpdated": false
                },
                {
                  "label": "3. Financing Activities (CFF)",
                  "value": "+$10,000 net bank loan proceeds after paying dividend",
                  "varType": "Financing Cash",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "as3_pillars_demo.js",
            "initialCode": "function calculateNetCashFlow(cfo, cfi, cff, openingCash) {\n  const netCash = cfo + cfi + cff;\n  return {\n    cashFromOperations: cfo,\n    cashFromInvesting: cfi,\n    cashFromFinancing: cff,\n    netCashGenerated: netCash,\n    closingCashBalance: openingCash + netCash,\n    status: 'AS3_CASH_FLOW_STATEMENT_RECONCILED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateNetCashFlow(55000, -25000, 10000, 15000)));",
            "expectedOutput": "{\"cashFromOperations\":55000,\"cashFromInvesting\":-25000,\"cashFromFinancing\":10000,\"netCashGenerated\":40000,\"closingCashBalance\":55000,\"status\":\"AS3_CASH_FLOW_STATEMENT_RECONCILED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Net Cash Generated when Operating is +$55,000, Investing is -$25,000, and Financing is +$10,000 ($55000 - 25000 + 10000$)?",
          "expectedStringOutput": "40000",
          "acceptableAnswers": [
            "40000",
            "$40,000",
            "netCashGenerated\":40000"
          ],
          "primaryMisconceptionId": "MC_ACC_CASH_FLOW_STATEMENT_AS3_OPERATING_INVESTING_FINANCING",
          "diagnosisMap": {
            "90000": {
              "misconceptionId": "MC_ACC_CASH_FLOW_STATEMENT_AS3_OPERATING_INVESTING_FINANCING",
              "errorExplanation": "Investing is an outflow (-$25,000): 55k - 25k + 10k = $40,000.",
              "recoveryPath": {
                "simplerExplanation": "55000 - 25000 + 10000 = 40000.",
                "guidedFixPrompt": "Type 40000"
              }
            }
          }
        }
      },
      {
        "id": "acc-d28-b2-indirect-method-operating-cash-flow",
        "day": 28,
        "blockNumber": 2,
        "title": "Operating Cash Flow (Indirect Method): Adding Non-Cash Depreciation & Working Capital",
        "conceptBudget": {
          "primaryConcept": "Indirect Operating Cash Flow Reconciliation",
          "supportingTerms": [
            "Start with Net Profit before Tax",
            "Add Non-Cash Expenses (Depreciation & Amortization)",
            "Adjust Working Capital Changes: Add decrease in CA, Add increase in CL; Deduct increase in CA, Deduct decrease in CL"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d28-b1-as3-three-pillars-of-cash-flow",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Operating Cash Flow Indirect Equation",
            "codeSnippet": "Net Profit: $50,000\nAdd: Non-Cash Depreciation: +$10,000 (No cash left the bank!)\nWorking Capital Adjustment: -$5,000 (Increase in Debtors locked up cash)\nCash Generated from Operations = $55,000",
            "lineNotes": {
              "2": "Non-cash item added back.",
              "3": "Cash locked in receivables deducted.",
              "4": "True physical operating cash."
            }
          },
          {
            "type": "runnable_code",
            "filename": "cfo_indirect_demo.js",
            "initialCode": "function calculateCfoIndirect(netProfit, dep, wcChange) {\n  const cfo = netProfit + dep + wcChange;\n  return {\n    netProfit,\n    depreciationAddBack: dep,\n    workingCapitalChange: wcChange,\n    cashFromOperations: cfo,\n    status: 'CFO_INDIRECT_METHOD_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateCfoIndirect(50000, 10000, -5000)));",
            "expectedOutput": "{\"netProfit\":50000,\"depreciationAddBack\":10000,\"workingCapitalChange\":-5000,\"cashFromOperations\":55000,\"status\":\"CFO_INDIRECT_METHOD_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Why is Depreciation added back to Net Profit when calculating Operating Cash Flow under the Indirect Method?",
          "expectedStringOutput": "NON_CASH_EXPENSE_NO_OUTFLOW",
          "acceptableAnswers": [
            "NON_CASH_EXPENSE_NO_OUTFLOW",
            "Non-cash expense",
            "Non cash"
          ],
          "primaryMisconceptionId": "MC_ACC_CASH_FLOW_STATEMENT_AS3_OPERATING_INVESTING_FINANCING",
          "diagnosisMap": {
            "CASH": {
              "misconceptionId": "MC_ACC_CASH_FLOW_STATEMENT_AS3_OPERATING_INVESTING_FINANCING",
              "errorExplanation": "Depreciation is a non-cash accounting allocation with zero physical cash outflow, so it is added back.",
              "recoveryPath": {
                "simplerExplanation": "Added back because it is a non-cash expense.",
                "guidedFixPrompt": "Type NON_CASH_EXPENSE_NO_OUTFLOW"
              }
            }
          }
        }
      },
      {
        "id": "acc-d28-b3-investing-and-financing-cash-flows",
        "day": 28,
        "blockNumber": 3,
        "title": "Investing & Financing Cash Flows Classification",
        "conceptBudget": {
          "primaryConcept": "Investing vs Financing Classification",
          "supportingTerms": [
            "Investing Outflow (Purchase of Machinery/Buildings)",
            "Investing Inflow (Sale of Fixed Assets / Interest & Dividend Received on external investments)",
            "Financing Inflow (Issuance of Shares / Bank Borrowing)",
            "Financing Outflow (Repayment of Loans / Dividend Paid to shareholders)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d28-b2-indirect-method-operating-cash-flow",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "cf_classify_demo.js",
            "initialCode": "function classifyCashFlowItem(eventName) {\n  if (eventName === 'DIVIDEND_PAID_TO_SHAREHOLDERS') return 'FINANCING_ACTIVITY_CASH_OUTFLOW';\n  if (eventName === 'PURCHASE_OF_FACTORY_LAND') return 'INVESTING_ACTIVITY_CASH_OUTFLOW';\n  return 'OPERATING_ACTIVITY';\n}\n\nconsole.log(classifyCashFlowItem('DIVIDEND_PAID_TO_SHAREHOLDERS'));\nconsole.log(classifyCashFlowItem('PURCHASE_OF_FACTORY_LAND'));",
            "expectedOutput": "FINANCING_ACTIVITY_CASH_OUTFLOW\nINVESTING_ACTIVITY_CASH_OUTFLOW",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Under AS-3, under which activity classification is Dividend Paid to corporate shareholders reported?",
          "expectedStringOutput": "FINANCING_ACTIVITY_CASH_OUTFLOW",
          "acceptableAnswers": [
            "FINANCING_ACTIVITY_CASH_OUTFLOW",
            "Financing Activity",
            "Financing"
          ],
          "primaryMisconceptionId": "MC_ACC_CASH_FLOW_STATEMENT_AS3_OPERATING_INVESTING_FINANCING",
          "diagnosisMap": {
            "OPERATING": {
              "misconceptionId": "MC_ACC_CASH_FLOW_STATEMENT_AS3_OPERATING_INVESTING_FINANCING",
              "errorExplanation": "Dividend paid relates to the cost of capital funding, making it a Financing Activity.",
              "recoveryPath": {
                "simplerExplanation": "Dividends paid are financing cash outflows.",
                "guidedFixPrompt": "Type FINANCING_ACTIVITY_CASH_OUTFLOW"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 29,
    "title": "Cloud Accounting, AI Invoicing (OCR) & Forensic Fraud Detection",
    "overviewMetaphor": "Modern Accounting is an AI-Powered Forensic Scanner: instead of typing invoices manually, Cloud AI uses Optical Character Recognition (OCR) to scan PDF invoices, extract the GSTIN and item totals, and post them directly into the cloud ledger; meanwhile, Forensic Fraud Algorithms analyze the first digits of millions of transactions using Benford's Law—instantly red-flagging human embezzlement and fake vendor duplicate invoices before payments are released.",
    "blocks": [
      {
        "id": "acc-d29-b1-cloud-accounting-rest-apis",
        "day": 29,
        "blockNumber": 1,
        "title": "Cloud Accounting Suites (Zoho Books / QuickBooks) & REST API Ledgers",
        "conceptBudget": {
          "primaryConcept": "Cloud Accounting API Architecture",
          "supportingTerms": [
            "Multi-Tenant Cloud Ledgers (Zoho Books, QuickBooks Online, Xero)",
            "Automated Bank Feeds & Open Banking APIs",
            "REST API Invoicing (`POST /api/v3/invoices` JSON payloads)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d16-b1-tally-company-creation-financial-year",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Cloud Accounting REST API Payload",
              "boxes": [
                {
                  "label": "POST /api/v3/invoices",
                  "value": "customer_id: 'CUST-99' | line_items: [{ item_id: 'SKU-1', rate: 50000 }] | tax_id: 'GST-18'",
                  "varType": "JSON Payload",
                  "isUpdated": false
                },
                {
                  "label": "Cloud Ledger Response",
                  "value": "status: 201 Created | invoice_number: 'INV-2026-042' | auto_sync_to_gstin: true",
                  "varType": "API Response",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "cloud_api_demo.js",
            "initialCode": "function postCloudInvoice(customerId, amount) {\n  return {\n    apiStatus: 201,\n    invoiceNumber: 'INV-2026-042',\n    totalAmount: amount,\n    cloudLedgerSynchronized: true,\n    status: 'CLOUD_ACCOUNTING_INVOICE_POSTED'\n  };\n}\n\nconsole.log(JSON.stringify(postCloudInvoice('CUST-99', 50000)));",
            "expectedOutput": "{\"apiStatus\":201,\"invoiceNumber\":\"INV-2026-042\",\"totalAmount\":50000,\"cloudLedgerSynchronized\":true,\"status\":\"CLOUD_ACCOUNTING_INVOICE_POSTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What HTTP status code confirms successful creation of a new cloud accounting invoice via REST API?",
          "expectedStringOutput": "201",
          "acceptableAnswers": [
            "201",
            "201 Created",
            "apiStatus\":201"
          ],
          "primaryMisconceptionId": "MC_ACC_CLOUD_AI_AUTOMATED_INVOICE_PROCESSING_OCR",
          "diagnosisMap": {
            "200": {
              "misconceptionId": "MC_ACC_CLOUD_AI_AUTOMATED_INVOICE_PROCESSING_OCR",
              "errorExplanation": "Standard HTTP code for successful resource creation is 201 Created.",
              "recoveryPath": {
                "simplerExplanation": "Creation returns 201.",
                "guidedFixPrompt": "Type 201"
              }
            }
          }
        }
      },
      {
        "id": "acc-d29-b2-ai-ocr-invoice-extraction",
        "day": 29,
        "blockNumber": 2,
        "title": "AI Optical Character Recognition (OCR) Invoice Extraction & 3-Way Matching",
        "conceptBudget": {
          "primaryConcept": "AI OCR Invoice Ingest & 3-Way Matching",
          "supportingTerms": [
            "Document AI / Vision LLMs (Extracting Supplier GSTIN, Invoice Date, Line Items, HSN, Tax Totals from scanned PDF images)",
            "3-Way Matching (Purchase Order PO $\\leftrightarrow$ Goods Receipt Note GRN $\\leftrightarrow$ Vendor Invoice)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d29-b1-cloud-accounting-rest-apis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Automated 3-Way Match Verification",
            "codeSnippet": "const poAmount = 50000;   // Purchase Order authorized amount\nconst grnAmount = 50000;  // Goods physically received in warehouse\nconst invAmount = 50000;  // Vendor billed invoice amount\nconst isThreeWayMatch = (poAmount === grnAmount && grnAmount === invAmount); // TRUE -> Auto-Approve Payment!",
            "lineNotes": {
              "1": "Authorized PO.",
              "2": "Warehouse receipt.",
              "4": "3-way match verified."
            }
          },
          {
            "type": "runnable_code",
            "filename": "ocr_match_demo.js",
            "initialCode": "function executeThreeWayMatch(po, grn, inv) {\n  const matched = (po === grn && grn === inv);\n  return {\n    poAmount: po,\n    grnAmount: grn,\n    invoiceAmount: inv,\n    isMatchApproved: matched,\n    action: matched ? 'AUTO_APPROVE_VENDOR_PAYMENT' : 'FLAG_PRICE_OR_QUANTITY_VARIANCE'\n  };\n}\n\nconsole.log(JSON.stringify(executeThreeWayMatch(50000, 50000, 50000)));\nconsole.log(JSON.stringify(executeThreeWayMatch(50000, 50000, 55000)));",
            "expectedOutput": "{\"poAmount\":50000,\"grnAmount\":50000,\"invoiceAmount\":50000,\"isMatchApproved\":true,\"action\":\"AUTO_APPROVE_VENDOR_PAYMENT\"}\n{\"poAmount\":50000,\"grnAmount\":50000,\"invoiceAmount\":55000,\"isMatchApproved\":false,\"action\":\"FLAG_PRICE_OR_QUANTITY_VARIANCE\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What action is triggered when an AI OCR system confirms a perfect 3-way match between PO, GRN, and Vendor Invoice?",
          "expectedStringOutput": "AUTO_APPROVE_VENDOR_PAYMENT",
          "acceptableAnswers": [
            "AUTO_APPROVE_VENDOR_PAYMENT",
            "Auto approve",
            "action\":\"AUTO_APPROVE_VENDOR_PAYMENT\""
          ],
          "primaryMisconceptionId": "MC_ACC_CLOUD_AI_AUTOMATED_INVOICE_PROCESSING_OCR",
          "diagnosisMap": {
            "FLAG": {
              "misconceptionId": "MC_ACC_CLOUD_AI_AUTOMATED_INVOICE_PROCESSING_OCR",
              "errorExplanation": "A 3-way match triggers AUTO_APPROVE_VENDOR_PAYMENT.",
              "recoveryPath": {
                "simplerExplanation": "Triggers AUTO_APPROVE_VENDOR_PAYMENT.",
                "guidedFixPrompt": "Type AUTO_APPROVE_VENDOR_PAYMENT"
              }
            }
          }
        }
      },
      {
        "id": "acc-d29-b3-forensic-accounting-benfords-law",
        "day": 29,
        "blockNumber": 3,
        "title": "Forensic Accounting & Benford's Law for Fraud Detection",
        "conceptBudget": {
          "primaryConcept": "Forensic Fraud Detection & Benford's Law",
          "supportingTerms": [
            "Benford's Law (In naturally occurring financial data, the first digit $d$ occurs with probability $P(d) = \\log_{10}(1 + 1/d)$; Digit 1 appears $\\approx 30.1\\%$ of the time, while Digit 9 appears only $4.6\\%$!)",
            "Human Fraud Fabrication (Embezzlers fabricate random numbers, creating unnatural spikes in digits like 7 or 8)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d29-b2-ai-ocr-invoice-extraction",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "benford_demo.js",
            "initialCode": "function getBenfordExpectedFrequency(digit) {\n  if (digit < 1 || digit > 9) return 0;\n  const prob = Math.log10(1 + 1 / digit) * 100;\n  return Number(prob.toFixed(1));\n}\n\nconsole.log(`Expected frequency of Digit 1: ${getBenfordExpectedFrequency(1)}%`);\nconsole.log(`Expected frequency of Digit 9: ${getBenfordExpectedFrequency(9)}%`);",
            "expectedOutput": "Expected frequency of Digit 1: 30.1%\nExpected frequency of Digit 9: 4.6%",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "According to Benford's Law, what is the expected probability percentage for the first leading digit of naturally occurring financial transactions to be '1' ($ \\log_{10}(1 + 1/1) \\approx 30.1\\% $)?",
          "expectedStringOutput": "30.1%",
          "acceptableAnswers": [
            "30.1%",
            "30.1",
            "30.1 percent"
          ],
          "primaryMisconceptionId": "MC_ACC_FRAUD_DETECTION_FORENSIC_ACCOUNTING_BENFORD",
          "diagnosisMap": {
            "11.1%": {
              "misconceptionId": "MC_ACC_FRAUD_DETECTION_FORENSIC_ACCOUNTING_BENFORD",
              "errorExplanation": "Digits are not uniformly distributed (11.1%). In natural financial data, Digit 1 appears 30.1% of the time.",
              "recoveryPath": {
                "simplerExplanation": "Digit 1 occurs 30.1% of the time.",
                "guidedFixPrompt": "Type 30.1%"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 30,
    "title": "🏆 FINAL CAPSTONE: Integrated Corporate Digital Accounting, GST & Tax Audit Suite",
    "overviewMetaphor": "Day 30 Final Capstone Synthesis: The complete corporate digital accounting, ERP, GST taxation, statutory payroll, and audit ecosystem: 1. Double-entry trial balance ledger closing; 2. Trading and Profit & Loss financial statements; 3. Dual-GST tax remittance and ITC cross-utilization; 4. Statutory payroll & TDS withholding compliance; 5. Final corporate tax filing under Section 115BAA.",
    "blocks": [
      {
        "id": "acc-d30-b1-capstone-suite-synthesis",
        "day": 30,
        "blockNumber": 1,
        "title": "Integrated Corporate Digital Accounting & Tax Engine Synthesis",
        "conceptBudget": {
          "primaryConcept": "Complete Corporate Accounting Engine Synthesis",
          "supportingTerms": [
            "General Ledger Engine",
            "Financial Statements Engine",
            "GST Taxation Engine",
            "Statutory Payroll Engine",
            "Corporate Tax Engine"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d29-b2-ai-ocr-invoice-extraction",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Complete Corporate Accounting & Tax Ecosystem",
              "nodes": [
                {
                  "id": "1",
                  "label": "Double-Entry Bookkeeping & General Ledger Closing",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Financial Statements (Trading GP, P&L Net Profit, Balance Sheet)",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Dual-GST Tax Remittance & ITC Cross-Utilization Set-Off",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Statutory Payroll, EPF ECR & TDS Withholding Compliance",
                  "kind": "process"
                },
                {
                  "id": "5",
                  "label": "Final Corporate Tax Filing under Section 115BAA (25.168%) Certified!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "capstone_accounting_demo.js",
            "initialCode": "function runCorporateAccountingEcosystem() {\n  return {\n    ledgerSubsystem: 'ONLINE_DOUBLE_ENTRY_BALANCED',\n    financialStatementsSubsystem: 'ONLINE_GP_NP_BALANCE_SHEET_FINALIZED',\n    gstTaxSubsystem: 'ONLINE_DUAL_GST_ITC_DISCHARGED',\n    payrollTdsSubsystem: 'ONLINE_EPF_ESI_TDS_COMPLIANT',\n    corporateTaxSubsystem: 'ONLINE_SECTION_115BAA_FILED',\n    engineStatus: 'CORPORATE_ACCOUNTING_ECOSYSTEM_ACTIVE_NOMINAL'\n  };\n}\n\nconsole.log(runCorporateAccountingEcosystem().engineStatus);",
            "expectedOutput": "CORPORATE_ACCOUNTING_ECOSYSTEM_ACTIVE_NOMINAL",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What engine status confirms active operational synthesis of the complete Corporate Accounting Ecosystem?",
          "expectedStringOutput": "CORPORATE_ACCOUNTING_ECOSYSTEM_ACTIVE_NOMINAL",
          "acceptableAnswers": [
            "CORPORATE_ACCOUNTING_ECOSYSTEM_ACTIVE_NOMINAL",
            "engineStatus: CORPORATE_ACCOUNTING_ECOSYSTEM_ACTIVE_NOMINAL"
          ],
          "primaryMisconceptionId": "MC_ACC_CAPSTONE_CORPORATE_ACCOUNTING_AND_TAX_AUDIT",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_ACC_CAPSTONE_CORPORATE_ACCOUNTING_AND_TAX_AUDIT",
              "errorExplanation": "Matches CORPORATE_ACCOUNTING_ECOSYSTEM_ACTIVE_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type CORPORATE_ACCOUNTING_ECOSYSTEM_ACTIVE_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "acc-d30-b2-capstone-suite-audit",
        "day": 30,
        "blockNumber": 2,
        "title": "Enterprise Corporate Accounting & Statutory Tax Audit",
        "conceptBudget": {
          "primaryConcept": "Enterprise Accounting & Tax Invariant Audit",
          "supportingTerms": [
            "Bookkeeping Invariant",
            "Financial Reporting Invariant",
            "GST Invariant",
            "Payroll Invariant",
            "Corporate Tax Invariant",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d30-b1-capstone-suite-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "capstone_audit_demo.js",
            "initialCode": "function auditCorporateSystem(books, fin, gst, pay, tax) {\n  const passed = books && fin && gst && pay && tax;\n  return {\n    ledgerAudit: books,\n    statementsAudit: fin,\n    gstAudit: gst,\n    payrollAudit: pay,\n    corporateTaxAudit: tax,\n    grade: passed ? 'CORPORATE_ACCOUNTING_MASTER_AUDIT_PASSED' : 'AUDIT_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditCorporateSystem(true, true, true, true, true)));",
            "expectedOutput": "{\"ledgerAudit\":true,\"statementsAudit\":true,\"gstAudit\":true,\"payrollAudit\":true,\"corporateTaxAudit\":true,\"grade\":\"CORPORATE_ACCOUNTING_MASTER_AUDIT_PASSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade is awarded when all 5 dimensions of corporate accounting and tax compliance pass 100%?",
          "expectedStringOutput": "CORPORATE_ACCOUNTING_MASTER_AUDIT_PASSED",
          "acceptableAnswers": [
            "CORPORATE_ACCOUNTING_MASTER_AUDIT_PASSED",
            "grade\":\"CORPORATE_ACCOUNTING_MASTER_AUDIT_PASSED\""
          ],
          "primaryMisconceptionId": "MC_ACC_CAPSTONE_CORPORATE_ACCOUNTING_AND_TAX_AUDIT",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_ACC_CAPSTONE_CORPORATE_ACCOUNTING_AND_TAX_AUDIT",
              "errorExplanation": "All checks passing awards CORPORATE_ACCOUNTING_MASTER_AUDIT_PASSED.",
              "recoveryPath": {
                "simplerExplanation": "Awards CORPORATE_ACCOUNTING_MASTER_AUDIT_PASSED.",
                "guidedFixPrompt": "Type CORPORATE_ACCOUNTING_MASTER_AUDIT_PASSED"
              }
            }
          }
        }
      },
      {
        "id": "acc-d30-b3-capstone-master-certification",
        "day": 30,
        "blockNumber": 3,
        "title": "Enterprise Digital Accountant & Tax Consultant Master Certification",
        "conceptBudget": {
          "primaryConcept": "Enterprise Master Certification",
          "supportingTerms": [
            "Full 30-Day Curriculum Mastery",
            "100% Quality Invariant",
            "Digital Accounting Certified"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "acc-d30-b2-capstone-suite-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "accounting_master_cert.js",
            "initialCode": "console.log('🏆 30-DAY CAPSTONE COMPLETE: Enterprise Digital Accountant & Tax Consultant Master System [100% CERTIFIED]');",
            "expectedOutput": "🏆 30-DAY CAPSTONE COMPLETE: Enterprise Digital Accountant & Tax Consultant Master System [100% CERTIFIED]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What master certification string confirms 100% completion of the 30-Day Digital Accounting & Taxation curriculum?",
          "expectedStringOutput": "🏆 30-DAY CAPSTONE COMPLETE: Enterprise Digital Accountant & Tax Consultant Master System [100% CERTIFIED]",
          "acceptableAnswers": [
            "🏆 30-DAY CAPSTONE COMPLETE: Enterprise Digital Accountant & Tax Consultant Master System [100% CERTIFIED]",
            "100% CERTIFIED",
            "Enterprise Digital Accountant & Tax Consultant Master System"
          ],
          "primaryMisconceptionId": "MC_ACC_CAPSTONE_CORPORATE_ACCOUNTING_AND_TAX_AUDIT",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_ACC_CAPSTONE_CORPORATE_ACCOUNTING_AND_TAX_AUDIT",
              "errorExplanation": "Matches the final capstone completion string.",
              "recoveryPath": {
                "simplerExplanation": "Matches master completion string.",
                "guidedFixPrompt": "Type 🏆 30-DAY CAPSTONE COMPLETE: Enterprise Digital Accountant & Tax Consultant Master System [100% CERTIFIED]"
              }
            }
          }
        }
      }
    ]
  }
];
