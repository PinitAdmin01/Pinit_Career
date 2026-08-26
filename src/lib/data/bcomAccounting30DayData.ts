import { buildEnrichedDayQuests, DayConfig } from './curriculumEnricher';
import { CourseQuest } from './coursesData';

export const BCOM_ACCOUNTING_30_DAYS_CONFIGS: DayConfig[] = [
  {
    "day": 1,
    "title": "Double-Entry Accounting Equation & Business Entity Framework",
    "desc": "Master the fundamental accounting equation: $Assets = Liabilities + Equity$, dual aspect principle, business entity concept, and money measurement conventions.",
    "syllabus": [
      "The Fundamental Equation: Assets = Liabilities + Capital (Owner Equity).",
      "Dual Aspect Principle: Every transaction impacts at least two accounts in perfect equilibrium.",
      "Business Entity Concept: The business is a distinct legal and financial entity separate from its owners."
    ],
    "eTitle": "Accounting Equation Equilibrium Validator",
    "eDesc": "Implement function validateAccountingEquation(assets, liabilities, equity) verifying that $Assets = Liabilities + Equity$.",
    "eStarter": "function validateAccountingEquation(assets, liabilities, equity) {\n  const totalRightSide = liabilities + equity;\n  const isBalanced = Math.abs(assets - totalRightSide) < 0.01;\n  return {\n    totalAssets: assets,\n    totalLiabilities: liabilities,\n    totalEquity: equity,\n    isBalanced,\n    equationChecksum: isBalanced ? 'PERFECT_EQUILIBRIUM_NOMINAL' : 'EQUATION_IMBALANCE_ERROR'\n  };\n}",
    "eHint": "Verify assets === liabilities + equity.",
    "eTest": "const ok = validateAccountingEquation(500000, 200000, 300000);\nconst bad = validateAccountingEquation(500000, 200000, 250000);\nif (!ok.isBalanced || ok.equationChecksum !== 'PERFECT_EQUILIBRIUM_NOMINAL' || bad.isBalanced || bad.equationChecksum !== 'EQUATION_IMBALANCE_ERROR') throw new Error('Equation validator failed');",
    "aTitle": "Equity Capital Solver",
    "aDesc": "Implement function solveEquity(assets, liabilities) returning `assets - liabilities`.",
    "aStarter": "function solveEquity() {\n  // Write your answer here\n}",
    "aHint": "Return assets - liabilities.",
    "aTest": "if (solveEquity(100000, 40000) !== 60000) throw new Error('Solve equity failed');"
  },
  {
    "day": 2,
    "title": "The 3 Golden Rules of Accounting & Account Classification",
    "desc": "Classify accounts and apply the 3 Golden Rules: Personal Accounts (Debit the Receiver, Credit the Giver), Real Accounts (Debit what Comes In, Credit what Goes Out), and Nominal Accounts (Debit all Expenses/Losses, Credit all Incomes/Gains).",
    "syllabus": [
      "Personal Accounts: Natural, Artificial (Companies), and Representative persons.",
      "Real Accounts: Tangible (Machinery, Cash, Land) and Intangible (Goodwill, Patents) assets.",
      "Nominal Accounts: Rent, Salaries, Sales, Commissions, and Depreciation."
    ],
    "eTitle": "Golden Rules Debit/Credit Classifier",
    "eDesc": "Implement function classifyAccountingRule(accountType, eventType) returning the correct debit or credit direction.",
    "eStarter": "function classifyAccountingRule(accountType, eventType) {\n  if (accountType === 'PERSONAL') {\n    return eventType === 'RECEIVER' ? 'DEBIT_THE_RECEIVER' : 'CREDIT_THE_GIVER';\n  }\n  if (accountType === 'REAL') {\n    return eventType === 'COMES_IN' ? 'DEBIT_WHAT_COMES_IN' : 'CREDIT_WHAT_GOES_OUT';\n  }\n  if (accountType === 'NOMINAL') {\n    return eventType === 'EXPENSE_OR_LOSS' ? 'DEBIT_EXPENSES_AND_LOSSES' : 'CREDIT_INCOMES_AND_GAINS';\n  }\n  return 'UNKNOWN_ACCOUNT_TYPE';\n}",
    "eHint": "Apply Personal, Real, or Nominal rule.",
    "eTest": "const r1 = classifyAccountingRule('PERSONAL', 'RECEIVER');\nconst r2 = classifyAccountingRule('REAL', 'COMES_IN');\nconst r3 = classifyAccountingRule('NOMINAL', 'EXPENSE_OR_LOSS');\nif (r1 !== 'DEBIT_THE_RECEIVER' || r2 !== 'DEBIT_WHAT_COMES_IN' || r3 !== 'DEBIT_EXPENSES_AND_LOSSES') throw new Error('Golden rules classifier failed');",
    "aTitle": "Nominal Account Income Formatter",
    "aDesc": "Implement function formatNominalIncome() returning `'CREDIT_INCOMES_AND_GAINS'`.",
    "aStarter": "function formatNominalIncome() {\n  // Write your answer here\n}",
    "aHint": "Return credit nominal rule.",
    "aTest": "if (formatNominalIncome() !== 'CREDIT_INCOMES_AND_GAINS') throw new Error('Nominal rule check failed');"
  },
  {
    "day": 3,
    "title": "Journalizing Transactions & Compound Journal Entries",
    "desc": "Record prime entry transactions in the General Journal: Date, Particulars (Debit & Credit accounts), Ledger Folio (LF), Amount, Narration, and multi-line Compound Journal Entries.",
    "syllabus": [
      "General Journal Structure: Strict chronological recording of business events.",
      "Compound Entries: Transactions with multiple debits and/or credits (e.g. Sales with GST).",
      "Narration Integrity: Clear legal and contextual description of the transaction."
    ],
    "eTitle": "Two-Sided Journal Entry Balancer",
    "eDesc": "Implement function validateJournalEntry(debitLines, creditLines) verifying that total debits equal total credits.",
    "eStarter": "function validateJournalEntry(debits, credits) {\n  const sumDebits = debits.reduce((acc, d) => acc + d.amount, 0);\n  const sumCredits = credits.reduce((acc, c) => acc + c.amount, 0);\n  const isBalanced = Math.abs(sumDebits - sumCredits) < 0.01;\n  return {\n    totalDebitAmount: sumDebits,\n    totalCreditAmount: sumCredits,\n    isBalanced,\n    journalStatus: isBalanced ? 'JOURNAL_ENTRY_BALANCED_AND_POSTED' : 'UNBALANCED_JOURNAL_ENTRY_REJECTED'\n  };\n}",
    "eHint": "Sum debits and credits and verify equality.",
    "eTest": "const d = [{ account: 'Cash', amount: 9000 }, { account: 'Discount Allowed', amount: 1000 }];\nconst c = [{ account: 'Debtor Sharma', amount: 10000 }];\nconst res = validateJournalEntry(d, c);\nif (!res.isBalanced || res.totalDebitAmount !== 10000 || res.journalStatus !== 'JOURNAL_ENTRY_BALANCED_AND_POSTED') throw new Error('Journal balancer failed');",
    "aTitle": "Total Journal Amount Sum",
    "aDesc": "Implement function sumLines(lines) returning `lines.reduce((s, l) => s + l.amount, 0)`.",
    "aStarter": "function sumLines() {\n  // Write your answer here\n}",
    "aHint": "Sum amount field.",
    "aTest": "if (sumLines([{ amount: 100 }, { amount: 200 }]) !== 300) throw new Error('Sum lines failed');"
  },
  {
    "day": 4,
    "title": "Ledger Posting & Balancing T-Accounts",
    "desc": "Post journal entries into the Principal Book of Accounts (General Ledger): Debit side ('To...'), Credit side ('By...'), balancing accounts at period end ('By Balance c/d' and 'To Balance b/d').",
    "syllabus": [
      "Ledger Structure: 'T-Account' format with Debit (Dr.) left side and Credit (Cr.) right side.",
      "Posting Mechanics: Extracting journal line items and updating individual ledger heads.",
      "Closing Balances: Calculating Debit Balances (Assets, Expenses) vs Credit Balances (Liabilities, Incomes)."
    ],
    "eTitle": "T-Account Ledger Closing Balance Calculator",
    "eDesc": "Implement function calculateLedgerBalance(accountName, debitEntries, creditEntries) calculating closing balance and determining if it is a Debit or Credit balance.",
    "eStarter": "function calculateLedgerBalance(name, debits, credits) {\n  const totalDr = debits.reduce((acc, d) => acc + d, 0);\n  const totalCr = credits.reduce((acc, c) => acc + c, 0);\n  const diff = totalDr - totalCr;\n  return {\n    accountName: name,\n    totalDebit: totalDr,\n    totalCredit: totalCr,\n    closingBalance: Math.abs(diff),\n    balanceType: diff > 0 ? 'DEBIT_BALANCE' : (diff < 0 ? 'CREDIT_BALANCE' : 'NIL_BALANCE'),\n    status: 'LEDGER_ACCOUNT_BALANCED'\n  };\n}",
    "eHint": "Compute totalDr - totalCr, closingBalance = abs(diff), balanceType = Dr/Cr.",
    "eTest": "const res = calculateLedgerBalance('Cash Account', [50000, 20000], [30000, 15000]); // 70k - 45k = +25k Dr\nif (res.closingBalance !== 25000 || res.balanceType !== 'DEBIT_BALANCE' || res.status !== 'LEDGER_ACCOUNT_BALANCED') throw new Error('Ledger balance calculator failed');",
    "aTitle": "Balance Type Formatter",
    "aDesc": "Implement function formatBalanceType(dr, cr) returning `dr >= cr ? 'DR_BALANCE' : 'CR_BALANCE'`.",
    "aStarter": "function formatBalanceType() {\n  // Write your answer here\n}",
    "aHint": "Compare debit vs credit.",
    "aTest": "if (formatBalanceType(100, 50) !== 'DR_BALANCE') throw new Error('Balance type check failed');"
  },
  {
    "day": 5,
    "title": "⭐ MILESTONE 1: Complete Double-Entry Bookkeeping & General Ledger Engine",
    "desc": "Milestone 1: Build a complete double-entry bookkeeping engine: Accounting equation validation, Golden Rules classification, multi-line compound journal entries, and automated general ledger posting and balancing.",
    "syllabus": [
      "Double-entry bookkeeping lifecycle synthesis.",
      "Automated journal-to-ledger posting pipeline.",
      "General ledger trial balance readiness audit."
    ],
    "eTitle": "Double-Entry Bookkeeping & Ledger Master Kernel",
    "eDesc": "Implement function executeBookkeepingMasterKernel(transactions) journalizing and posting an entire batch of business transactions into balanced ledger accounts.",
    "eStarter": "function executeBookkeepingMasterKernel(transactions) {\n  let totalDr = 0;\n  let totalCr = 0;\n  for (const t of transactions) {\n    totalDr += t.drAmount;\n    totalCr += t.crAmount;\n  }\n  const isBalanced = Math.abs(totalDr - totalCr) < 0.01;\n  return {\n    totalTransactionsProcessed: transactions.length,\n    cumulativeDebits: totalDr,\n    cumulativeCredits: totalCr,\n    booksBalanced: isBalanced,\n    engineStatus: 'BOOKKEEPING_MASTER_KERNEL_ACTIVE_NOMINAL'\n  };\n}",
    "eHint": "Sum all transaction debits and credits and verify equality.",
    "eTest": "const txs = [{ drAmount: 10000, crAmount: 10000 }, { drAmount: 5000, crAmount: 5000 }];\nconst res = executeBookkeepingMasterKernel(txs);\nif (!res.booksBalanced || res.cumulativeDebits !== 15000 || res.engineStatus !== 'BOOKKEEPING_MASTER_KERNEL_ACTIVE_NOMINAL') throw new Error('Milestone 1 Bookkeeping kernel failed');",
    "aTitle": "Bookkeeping Status Formatter",
    "aDesc": "Implement function formatBookkeepingState(balanced) returning `BOOKS_${balanced ? 'BALANCED' : 'IMBALANCED'}`.",
    "aStarter": "function formatBookkeepingState() {\n  // Write your answer here\n}",
    "aHint": "Format state string.",
    "aTest": "if (formatBookkeepingState(true) !== 'BOOKS_BALANCED') throw new Error('Bookkeeping state format failed');"
  },
  {
    "day": 6,
    "title": "Special Purpose Books: 3-Column Cash Book & Petty Cash (Imprest System)",
    "desc": "Record cash and banking transactions efficiently: 3-Column Cash Book (Cash column, Bank column, Discount column), Contra Entries (Cash deposited into bank / withdrawn from bank), and the Imprest Petty Cash System.",
    "syllabus": [
      "3-Column Cash Book: Eliminates cash/bank ledger accounts by acting as both journal and ledger.",
      "Contra Entries ('C' in LF): Simultaneous debit and credit inside Cash and Bank columns.",
      "Imprest Petty Cash System: Fixed periodic float replenished for small daily expenses."
    ],
    "eTitle": "3-Column Cash Book Balancer & Contra Entry Tracker",
    "eDesc": "Implement function balanceCashBook(cashReceipts, cashPayments, bankReceipts, bankPayments, contraTransfers) calculating closing cash and bank balances.",
    "eStarter": "function balanceCashBook(cIn, cOut, bIn, bOut, contra) {\n  let cash = cIn - cOut;\n  let bank = bIn - bOut;\n  for (const c of contra) {\n    if (c.type === 'CASH_DEPOSITED_TO_BANK') {\n      cash -= c.amount;\n      bank += c.amount;\n    } else if (c.type === 'CASH_WITHDRAWN_FROM_BANK') {\n      cash += c.amount;\n      bank -= c.amount;\n    }\n  }\n  return {\n    closingCashBalance: cash,\n    closingBankBalance: bank,\n    status: 'CASH_BOOK_BALANCED_SUCCESSFULLY'\n  };\n}",
    "eHint": "Process receipts, payments, and contra transfers for cash and bank columns.",
    "eTest": "const res = balanceCashBook(50000, 10000, 100000, 20000, [{ type: 'CASH_DEPOSITED_TO_BANK', amount: 15000 }]);\nif (res.closingCashBalance !== 25000 || res.closingBankBalance !== 95000 || res.status !== 'CASH_BOOK_BALANCED_SUCCESSFULLY') throw new Error('Cash book balancer failed');",
    "aTitle": "Contra Entry Marker",
    "aDesc": "Implement function getContraMarker() returning `'C'`.",
    "aStarter": "function getContraMarker() {\n  // Write your answer here\n}",
    "aHint": "Contra entries affect both cash and bank simultaneously — they are marked 'C' in both the debit and credit columns of the three-column cash book.",
    "aTest": "if (getContraMarker() !== 'C') throw new Error('Marker check failed');"
  },
  {
    "day": 7,
    "title": "Subsidiary Books: Purchase, Sales, Returns & Bills Books",
    "desc": "Streamline high-volume credit transactions: Purchase Day Book (Credit purchases only!), Sales Day Book (Credit sales only!), Purchase Returns (Debit Note), and Sales Returns (Credit Note).",
    "syllabus": [
      "Purchase & Sales Day Books: Excludes cash purchases/sales and fixed asset purchases.",
      "Debit Note (Issued to supplier on purchase return) vs Credit Note (Issued to customer on sales return).",
      "Trade Discount (Deducted on invoice) vs Cash Discount (Recorded in accounts)."
    ],
    "eTitle": "Sales Day Book Invoice & Trade Discount Calculator",
    "eDesc": "Implement function calculateSalesDayBookEntry(grossAmount, tradeDiscountPct) calculating net invoice value recorded in the Sales Book.",
    "eStarter": "function calculateSalesDayBookEntry(gross, discountPct) {\n  const discountAmount = gross * (discountPct / 100);\n  const netAmount = gross - discountAmount;\n  return {\n    grossInvoiceAmount: gross,\n    tradeDiscountAmount: discountAmount,\n    netSalesBookAmount: netAmount,\n    status: 'SALES_BOOK_ENTRY_RECORDED'\n  };\n}",
    "eHint": "Compute net = gross - (gross * discountPct / 100).",
    "eTest": "const res = calculateSalesDayBookEntry(100000, 10); // 100k - 10k = 90k\nif (res.netSalesBookAmount !== 90000 || res.tradeDiscountAmount !== 10000 || res.status !== 'SALES_BOOK_ENTRY_RECORDED') throw new Error('Sales book entry failed');",
    "aTitle": "Debit Note Document Formatter",
    "aDesc": "Implement function formatNoteDoc(type) returning `type === 'PURCHASE_RETURN' ? 'DEBIT_NOTE' : 'CREDIT_NOTE'`.",
    "aStarter": "function formatNoteDoc() {\n  // Write your answer here\n}",
    "aHint": "Return note name.",
    "aTest": "if (formatNoteDoc('PURCHASE_RETURN') !== 'DEBIT_NOTE') throw new Error('Note doc check failed');"
  },
  {
    "day": 8,
    "title": "Bank Reconciliation Statement (BRS): Timing & Error Adjustments",
    "desc": "Reconcile Cash Book Bank column with Bank Passbook: Cheques issued but not presented, Cheques deposited but not credited, direct bank debits/credits, and Bank Overdraft (Unfavorable balance).",
    "syllabus": [
      "Causes of Discrepancy: Timing differences (Cheque clearing delays) and Transactions recorded directly by bank.",
      "Starting Points: Favorable Cash Book balance (Debit) vs Favorable Passbook balance (Credit).",
      "Bank Overdraft: Unfavorable balance (Cash Book Credit / Passbook Debit)."
    ],
    "eTitle": "Bank Reconciliation Statement (BRS) Engine",
    "eDesc": "Implement function calculateBrsAdjustedBalance(cashBookBalance, unpresentedCheques, uncreditedCheques, directBankCharges, directCustomerDeposits) calculating reconciled Passbook balance.",
    "eStarter": "function calculateBrsAdjustedBalance(cbBal, unpresented, uncredited, bankCharges, directDeposits) {\n  // Passbook = CashBook + Unpresented + DirectDeposits - Uncredited - BankCharges\n  const passbookBal = cbBal + unpresented + directDeposits - uncredited - bankCharges;\n  return {\n    cashBookStartingBalance: cbBal,\n    reconciledPassbookBalance: passbookBal,\n    isFavorable: passbookBal >= 0,\n    status: 'BRS_RECONCILIATION_COMPLETED'\n  };\n}",
    "eHint": "Compute passbookBal = cbBal + unpresented + directDeposits - uncredited - bankCharges.",
    "eTest": "const res = calculateBrsAdjustedBalance(50000, 10000, 8000, 500, 4000); // 50k + 10k + 4k - 8k - 500 = 55,500\nif (res.reconciledPassbookBalance !== 55500 || !res.isFavorable || res.status !== 'BRS_RECONCILIATION_COMPLETED') throw new Error('BRS calculation failed');",
    "aTitle": "Passbook Favorable Sign Formatter",
    "aDesc": "Implement function formatPassbookSign(bal) returning `bal >= 0 ? 'CREDIT_FAVORABLE' : 'DEBIT_OVERDRAFT'`.",
    "aStarter": "function formatPassbookSign() {\n  // Write your answer here\n}",
    "aHint": "Check balance sign.",
    "aTest": "if (formatPassbookSign(100) !== 'CREDIT_FAVORABLE') throw new Error('Passbook sign check failed');"
  },
  {
    "day": 9,
    "title": "Trial Balance: Arithmetic Accuracy Checksum & Detection of Errors",
    "desc": "Verify double-entry mathematical accuracy: Extracting ledger closing balances, constructing the Debit/Credit Trial Balance, and identifying errors that Trial Balance CANNOT catch (Errors of Principle, Compensating Errors).",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Trial Balance: Arithmetic Accuracy Checksum & Detection of Errors.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Statutory rules, error handling, and audit compliance."
    ],
    "eTitle": "Trial Balance Column Checksum Balancer",
    "eDesc": "Implement function validateTrialBalance(debitBalances, creditBalances) verifying that total Dr equals total Cr.",
    "eStarter": "function validateTrialBalance(dr, cr) {\n  const sumDr = dr.reduce((a, b) => a + b, 0);\n  const sumCr = cr.reduce((a, b) => a + b, 0);\n  const isBalanced = Math.abs(sumDr - sumCr) < 0.01;\n  return {\n    totalDr,\n    totalCr,\n    isBalanced,\n    status: isBalanced ? 'TRIAL_BALANCE_BALANCED_ARITHMETIC_VERIFIED' : 'TRIAL_BALANCE_OUT_OF_BALANCE_ERROR'\n  };\n}",
    "eHint": "Sum debit balances and credit balances and verify equality.",
    "eTest": "const res = validateTrialBalance([100000, 50000, 25000], [125000, 50000]);\nif (!res.isBalanced || res.status !== 'TRIAL_BALANCE_BALANCED_ARITHMETIC_VERIFIED') throw new Error('Trial balance validator failed');",
    "aTitle": "Trial Balance Error Type Classifier",
    "aDesc": "Implement function classifyTbError(name) returning `name === 'ERROR_OF_PRINCIPLE' ? 'DOES_NOT_AFFECT_TRIAL_BALANCE' : 'AFFECTS_TRIAL_BALANCE'`.",
    "aStarter": "function classifyTbError() {\n  // Write your answer here\n}",
    "aHint": "Check error name.",
    "aTest": "if (classifyTbError('ERROR_OF_PRINCIPLE') !== 'DOES_NOT_AFFECT_TRIAL_BALANCE') throw new Error('TB error check failed');"
  },
  {
    "day": 10,
    "title": "Rectification of Errors & The Suspense Account",
    "desc": "Correct accounting errors before and after Trial Balance: One-Sided Errors (Posting to Suspense Account), Two-Sided Errors (Reversal & Correction entries), and eliminating Suspense Account balance.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Rectification of Errors & The Suspense Account.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Statutory rules, error handling, and audit compliance."
    ],
    "eTitle": "Suspense Account Rectification Journal Entry Engine",
    "eDesc": "Implement function rectifyOneSidedError(originalAccount, correctedAmount, currentAmount, isDebitAccount) calculating required correction entry and Suspense Account balance impact.",
    "eStarter": "function rectifyOneSidedError(account, targetAmt, currAmt, isDebit) {\n  const diff = targetAmt - currAmt;\n  const isUnderstated = diff > 0;\n  return {\n    accountName: account,\n    differenceAmount: Math.abs(diff),\n    rectificationAction: isUnderstated ? (isDebit ? 'DEBIT_ACCOUNT' : 'CREDIT_ACCOUNT') : (isDebit ? 'CREDIT_ACCOUNT' : 'DEBIT_ACCOUNT'),\n    suspenseAccountImpact: isUnderstated ? (isDebit ? 'CREDIT_SUSPENSE' : 'DEBIT_SUSPENSE') : (isDebit ? 'DEBIT_SUSPENSE' : 'CREDIT_SUSPENSE'),\n    status: 'RECTIFICATION_ENTRY_GENERATED'\n  };\n}",
    "eHint": "Determine whether to debit/credit the account and adjust Suspense Account accordingly.",
    "eTest": "const res = rectifyOneSidedError('Sales Account', 50000, 45000, false); // Sales understated by 5k -> Credit Sales, Debit Suspense\nif (res.differenceAmount !== 5000 || res.rectificationAction !== 'CREDIT_ACCOUNT' || res.suspenseAccountImpact !== 'DEBIT_SUSPENSE') throw new Error('Rectification failed');",
    "aTitle": "Suspense Account Disposal Formatter",
    "aDesc": "Implement function formatSuspenseStatus(bal) returning `bal === 0 ? 'SUSPENSE_ACCOUNT_CLEARED' : 'SUSPENSE_REMAINS_ACTIVE'`.",
    "aStarter": "function formatSuspenseStatus() {\n  // Write your answer here\n}",
    "aHint": "Check balance 0.",
    "aTest": "if (formatSuspenseStatus(0) !== 'SUSPENSE_ACCOUNT_CLEARED') throw new Error('Suspense check failed');"
  },
  {
    "day": 11,
    "title": "Depreciation Accounting: Straight Line (SLM) vs Written Down Value (WDV)",
    "desc": "Account for fixed asset wear and tear: Straight-Line Method ($D = \\frac{\\text{Cost} - \\text{Scrap}}{N}$), Written Down Value ($D = \\text{Book Value} \\times R$), AS-10 Property Plant & Equipment, and Provision for Depreciation Account.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Depreciation Accounting: Straight Line (SLM) vs Written Down Value (WDV).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Statutory rules, error handling, and audit compliance."
    ],
    "eTitle": "SLM vs WDV Depreciation Schedule Calculator",
    "eDesc": "Implement function calculateDepreciationSchedule(assetCost, salvageValue, usefulLifeYears, wdvRatePct, years = 3) generating yearly depreciation under SLM and WDV.",
    "eStarter": "function calculateDepreciationSchedule(cost, scrap, life, wdvRate, years = 3) {\n  const slmAnnual = (cost - scrap) / life;\n  let wdvBookValue = cost;\n  const wdvDepList = [];\n  for (let i = 0; i < years; i++) {\n    const dep = wdvBookValue * (wdvRate / 100);\n    wdvDepList.push(Number(dep.toFixed(2)));\n    wdvBookValue -= dep;\n  }\n  return {\n    slmAnnualDepreciation: Number(slmAnnual.toFixed(2)),\n    wdvDepreciationYear1: wdvDepList[0],\n    wdvDepreciationYear2: wdvDepList[1],\n    wdvClosingBookValueYear3: Number(wdvBookValue.toFixed(2)),\n    status: 'DEPRECIATION_SCHEDULE_COMPUTED'\n  };\n}",
    "eHint": "Compute SLM = (cost - scrap)/life and WDV iteratively as bookValue * rate.",
    "eTest": "const res = calculateDepreciationSchedule(100000, 10000, 10, 20, 3); // SLM = 9k/yr; WDV Y1=20k, Y2=16k, BV Y3 = 100k - 20k - 16k - 12.8k = 51.2k\nif (res.slmAnnualDepreciation !== 9000 || res.wdvDepreciationYear1 !== 20000 || res.wdvDepreciationYear2 !== 16000 || res.wdvClosingBookValueYear3 !== 51200) throw new Error('Depreciation calculation failed');",
    "aTitle": "Depreciation Accounting Standard Formatter",
    "aDesc": "Implement function getDepreciationStandard() returning `'AS_10_PROPERTY_PLANT_EQUIPMENT'`.",
    "aStarter": "function getDepreciationStandard() {\n  // Write your answer here\n}",
    "aHint": "Return AS-10.",
    "aTest": "if (getDepreciationStandard() !== 'AS_10_PROPERTY_PLANT_EQUIPMENT') throw new Error('Standard check failed');"
  },
  {
    "day": 12,
    "title": "Financial Statements: Trading Account & Gross Profit Computation",
    "desc": "Calculate manufacturing and merchandising profitability: Opening Stock, Purchases (Net of returns), Direct Expenses (Wages, Carriage Inward, Freight), Sales (Net of returns), Closing Stock, and Gross Profit / Gross Loss.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Financial Statements: Trading Account & Gross Profit Computation.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Statutory rules, error handling, and audit compliance."
    ],
    "eTitle": "Trading Account Gross Profit Engine",
    "eDesc": "Implement function calculateGrossProfit(openingStock, netPurchases, directWages, carriageInward, netSales, closingStock) calculating Cost of Goods Sold (COGS) and Gross Profit.",
    "eStarter": "function calculateGrossProfit(openStock, purchases, wages, carriage, sales, closeStock) {\n  const directExpenses = wages + carriage;\n  const cogs = openStock + purchases + directExpenses - closeStock;\n  const grossProfit = sales - cogs;\n  const grossMarginPct = Number(((grossProfit / sales) * 100).toFixed(2));\n  return {\n    costOfGoodsSold: cogs,\n    grossProfit,\n    grossMarginPercent: grossMarginPct,\n    status: grossProfit >= 0 ? 'GROSS_PROFIT_COMPUTED' : 'GROSS_LOSS_COMPUTED'\n  };\n}",
    "eHint": "Compute cogs = openStock + purchases + wages + carriage - closeStock, grossProfit = sales - cogs.",
    "eTest": "const res = calculateGrossProfit(20000, 80000, 10000, 5000, 150000, 25000); // COGS = 20k + 80k + 15k - 25k = 90k; GP = 150k - 90k = 60k\nif (res.costOfGoodsSold !== 90000 || res.grossProfit !== 60000 || res.grossMarginPercent !== 40.0 || res.status !== 'GROSS_PROFIT_COMPUTED') throw new Error('Gross profit calculation failed');",
    "aTitle": "COGS Equation Formatter",
    "aDesc": "Implement function formatCogsFormula() returning `'COGS = Opening Stock + Net Purchases + Direct Expenses - Closing Stock'`.",
    "aStarter": "function formatCogsFormula() {\n  // Write your answer here\n}",
    "aHint": "Return formula string.",
    "aTest": "if (formatCogsFormula() !== 'COGS = Opening Stock + Net Purchases + Direct Expenses - Closing Stock') throw new Error('COGS formula check failed');"
  },
  {
    "day": 13,
    "title": "Financial Statements: Profit & Loss Account & Net Profit Calculation",
    "desc": "Calculate bottom-line operating profitability: Gross Profit transfer, Operating Expenses (Salaries, Rent, Depreciation), Non-Operating Incomes/Expenses, Provision for Bad Debts, and Net Profit / Net Loss transferred to Capital.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Financial Statements: Profit & Loss Account & Net Profit Calculation.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Statutory rules, error handling, and audit compliance."
    ],
    "eTitle": "Profit & Loss Account Net Profit Calculator",
    "eDesc": "Implement function calculateNetProfit(grossProfit, otherIncomes, operatingExpenses, depreciation, badDebtsProvision) calculating Net Profit.",
    "eStarter": "function calculateNetProfit(gp, incomes, expenses, dep, badDebts) {\n  const totalRevenue = gp + incomes;\n  const totalExpenditure = expenses + dep + badDebts;\n  const netProfit = totalRevenue - totalExpenditure;\n  return {\n    totalIncome: totalRevenue,\n    totalExpenses: totalExpenditure,\n    netProfit,\n    status: netProfit >= 0 ? 'NET_PROFIT_COMPUTED' : 'NET_LOSS_COMPUTED'\n  };\n}",
    "eHint": "Compute netProfit = (gp + incomes) - (expenses + dep + badDebts).",
    "eTest": "const res = calculateNetProfit(60000, 5000, 25000, 8000, 2000); // 65k - 35k = 30k\nif (res.netProfit !== 30000 || res.status !== 'NET_PROFIT_COMPUTED') throw new Error('Net profit calculation failed');",
    "aTitle": "Net Profit Destination Account Formatter",
    "aDesc": "Implement function getNetProfitDestination() returning `'OWNERS_CAPITAL_ACCOUNT'`.",
    "aStarter": "function getNetProfitDestination() {\n  // Write your answer here\n}",
    "aHint": "Return capital account.",
    "aTest": "if (getNetProfitDestination() !== 'OWNERS_CAPITAL_ACCOUNT') throw new Error('Destination check failed');"
  },
  {
    "day": 14,
    "title": "Financial Statements: Balance Sheet Marshalling & Working Capital",
    "desc": "Prepare the Statement of Financial Position: Marshalling in Order of Liquidity vs Order of Permanence, Current Assets vs Fixed Assets, Current Liabilities vs Long-Term Debt, and Working Capital ($CA - CL$).",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Financial Statements: Balance Sheet Marshalling & Working Capital.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Statutory rules, error handling, and audit compliance."
    ],
    "eTitle": "Balance Sheet Marshalling & Working Capital Engine",
    "eDesc": "Implement function generateBalanceSheet(fixedAssets, currentAssets, capital, netProfit, drawings, longTermLiabilities, currentLiabilities) validating balance sheet equilibrium and working capital.",
    "eStarter": "function generateBalanceSheet(fa, ca, cap, np, draw, ltl, cl) {\n  const totalAssets = fa + ca;\n  const finalCapital = cap + np - draw;\n  const totalLiabilitiesEquity = finalCapital + ltl + cl;\n  const workingCapital = ca - cl;\n  const isBalanced = Math.abs(totalAssets - totalLiabilitiesEquity) < 0.01;\n  return {\n    totalAssets,\n    totalLiabilitiesAndEquity: totalLiabilitiesEquity,\n    workingCapital,\n    balanceSheetBalanced: isBalanced,\n    status: isBalanced ? 'BALANCE_SHEET_BALANCED_SUCCESSFULLY' : 'BALANCE_SHEET_IMBALANCED_ERROR'\n  };\n}",
    "eHint": "Compute totalAssets = fa + ca, finalCapital = cap + np - draw, verify equality with totalLiabilitiesEquity.",
    "eTest": "const res = generateBalanceSheet(150000, 50000, 100000, 30000, 5000, 50000, 25000); // Assets = 200k; Equity = 125k + 50k + 25k = 200k; WC = 25k\nif (!res.balanceSheetBalanced || res.totalAssets !== 200000 || res.workingCapital !== 25000 || res.status !== 'BALANCE_SHEET_BALANCED_SUCCESSFULLY') throw new Error('Balance sheet engine failed');",
    "aTitle": "Working Capital Equation Formatter",
    "aDesc": "Implement function getWorkingCapitalFormula() returning `'Working Capital = Current Assets - Current Liabilities'`.",
    "aStarter": "function getWorkingCapitalFormula() {\n  // Write your answer here\n}",
    "aHint": "Return WC formula.",
    "aTest": "if (getWorkingCapitalFormula() !== 'Working Capital = Current Assets - Current Liabilities') throw new Error('WC formula check failed');"
  },
  {
    "day": 15,
    "title": "⭐ MILESTONE 2: Complete Financial Statements & Year-End Closing Engine",
    "desc": "Milestone 2: Build a production financial reporting engine: Trading Account gross margin computation, Profit & Loss operating profit reconciliation, and Balance Sheet marshalling with working capital analysis.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of ⭐ MILESTONE 2: Complete Financial Statements & Year-End Closing Engine.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Statutory rules, error handling, and audit compliance."
    ],
    "eTitle": "Year-End Financial Reporting Master Engine",
    "eDesc": "Implement function executeYearEndFinancialReporting(sales, cogs, operatingExpenses, fixedAssets, currentAssets, currentLiabilities, capital) certifying full financial statement closing.",
    "eStarter": "function executeYearEndFinancialReporting(sales, cogs, expenses, fa, ca, cl, cap) {\n  const gp = sales - cogs;\n  const np = gp - expenses;\n  const totalAssets = fa + ca;\n  const totalEquityAndLiab = (cap + np) + cl;\n  const isBalanced = Math.abs(totalAssets - totalEquityAndLiab) < 0.01;\n  return {\n    grossProfit: gp,\n    netProfit: np,\n    totalAssets,\n    balanceSheetBalanced: isBalanced,\n    engineStatus: 'YEAR_END_FINANCIAL_REPORTING_MASTER_ACTIVE'\n  };\n}",
    "eHint": "Compute GP, NP, Balance Sheet totals, return operational status.",
    "eTest": "const res = executeYearEndFinancialReporting(200000, 120000, 30000, 100000, 50000, 20000, 80000); // GP=80k, NP=50k, Assets=150k, Liab+Eq = 80k+50k+20k = 150k\nif (!res.balanceSheetBalanced || res.grossProfit !== 80000 || res.netProfit !== 50000 || res.engineStatus !== 'YEAR_END_FINANCIAL_REPORTING_MASTER_ACTIVE') throw new Error('Milestone 2 Financial reporting failed');",
    "aTitle": "Financial Statement Standard Formatter",
    "aDesc": "Implement function formatReportingStandard() returning `'SCHEDULE_III_COMPANIES_ACT_2013'`.",
    "aStarter": "function formatReportingStandard() {\n  // Write your answer here\n}",
    "aHint": "Return Schedule III.",
    "aTest": "if (formatReportingStandard() !== 'SCHEDULE_III_COMPANIES_ACT_2013') throw new Error('Standard check failed');"
  },
  {
    "day": 16,
    "title": "Tally Prime ERP: Company Creation, Chart of Accounts & Masters",
    "desc": "Configure enterprise accounting in Tally Prime: Creating Companies (Financial Year from 1st April), Chart of Accounts (28 Predefined Groups: 15 Primary + 13 Secondary), Ledgers, Stock Items, Units of Measure (UoM), and Godowns.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Tally Prime ERP: Company Creation, Chart of Accounts & Masters.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Statutory rules, error handling, and audit compliance."
    ],
    "eTitle": "Tally Prime XML Ledger Master Generator",
    "eDesc": "Implement function generateTallyLedgerXml(ledgerName, parentGroup, openingBalance, isDebit) generating valid Tally Prime XML Master import packet.",
    "eStarter": "function generateTallyLedgerXml(name, parent, balance, isDebit) {\n  const formattedBal = isDebit ? balance : -balance;\n  const xml = `<TALLYMESSAGE xmlns:UDF=\"TallyUDF\"><LEDGER NAME=\"${name}\" ACTION=\"Create\"><NAME>${name}</NAME><PARENT>${parent}</PARENT><OPENINGBALANCE>${formattedBal}</OPENINGBALANCE></LEDGER></TALLYMESSAGE>`;\n  return {\n    ledgerName: name,\n    parentGroup: parent,\n    xmlPayload: xml,\n    status: 'TALLY_PRIME_LEDGER_MASTER_GENERATED'\n  };\n}",
    "eHint": "Generate Tally XML with LEDGER NAME, PARENT, and OPENINGBALANCE.",
    "eTest": "const res = generateTallyLedgerXml('HDFC Bank', 'Bank Accounts', 50000, true);\nif (!res.xmlPayload.includes('PARENT>Bank Accounts<') || res.status !== 'TALLY_PRIME_LEDGER_MASTER_GENERATED') throw new Error('Tally XML master generator failed');",
    "aTitle": "Tally Primary Groups Count Formatter",
    "aDesc": "Implement function getTallyPrimaryGroupsCount() returning `15`.",
    "aStarter": "function getTallyPrimaryGroupsCount() {\n  // Write your answer here\n}",
    "aHint": "Tally Prime ships with 15 pre-defined primary groups (Capital Account, Fixed Assets, Current Liabilities, etc.) that form the foundation of every company's chart of accounts.",
    "aTest": "if (getTallyPrimaryGroupsCount() !== 15) throw new Error('Tally primary groups check failed');"
  },
  {
    "day": 17,
    "title": "Tally Prime ERP: Voucher Entry & Accounting Workflows",
    "desc": "Record business transactions in Tally Prime vouchers: F4 (Contra), F5 (Payment), F6 (Receipt), F7 (Journal), F8 (Sales), F9 (Purchase), and Item Invoices with stock inventory tracking.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Tally Prime ERP: Voucher Entry & Accounting Workflows.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Statutory rules, error handling, and audit compliance."
    ],
    "eTitle": "Tally Voucher Type Selector & Shortcut Evaluator",
    "eDesc": "Implement function getTallyVoucherConfig(transactionType) returning the corresponding Tally voucher name and functional shortcut key.",
    "eStarter": "function getTallyVoucherConfig(txType) {\n  const map = {\n    'CASH_DEPOSIT': { voucher: 'Contra', key: 'F4' },\n    'VENDOR_PAYMENT': { voucher: 'Payment', key: 'F5' },\n    'CUSTOMER_RECEIPT': { voucher: 'Receipt', key: 'F6' },\n    'ADJUSTMENT_ENTRY': { voucher: 'Journal', key: 'F7' },\n    'CREDIT_SALES': { voucher: 'Sales', key: 'F8' },\n    'CREDIT_PURCHASE': { voucher: 'Purchase', key: 'F9' }\n  };\n  const res = map[txType] || { voucher: 'Unknown', key: 'None' };\n  return {\n    transactionType: txType,\n    voucherName: res.voucher,\n    shortcutKey: res.key,\n    status: 'TALLY_VOUCHER_CONFIGURED'\n  };\n}",
    "eHint": "Map transaction types to F4, F5, F6, F7, F8, F9.",
    "eTest": "const v1 = getTallyVoucherConfig('VENDOR_PAYMENT');\nconst v2 = getTallyVoucherConfig('CREDIT_SALES');\nif (v1.shortcutKey !== 'F5' || v2.shortcutKey !== 'F8' || v1.voucherName !== 'Payment') throw new Error('Tally voucher config failed');",
    "aTitle": "Tally Payment Shortcut Formatter",
    "aDesc": "Implement function getPaymentShortcut() returning `'F5'`.",
    "aStarter": "function getPaymentShortcut() {\n  // Write your answer here\n}",
    "aHint": "Return 'F5'.",
    "aTest": "if (getPaymentShortcut() !== 'F5') throw new Error('Shortcut check failed');"
  },
  {
    "day": 18,
    "title": "Goods & Services Tax (GST): Dual Model (CGST/SGST vs IGST) & Tax Invoices",
    "desc": "Master Indian GST taxation: Intra-State Supply ($CGST + SGST = \\text{Total GST}$), Inter-State Supply ($IGST$), HSN / SAC code classification, Tax Invoice mandatory fields, and GST rate slabs (0%, 5%, 12%, 18%, 28%).",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Goods & Services Tax (GST): Dual Model (CGST/SGST vs IGST) & Tax Invoices.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Statutory rules, error handling, and audit compliance."
    ],
    "eTitle": "Dual-GST Tax Invoice Engine",
    "eDesc": "Implement function calculateGstTaxInvoice(taxableValue, gstRatePct, isInterState) calculating CGST, SGST, IGST, and total invoice value.",
    "eStarter": "function calculateGstTaxInvoice(taxableVal, ratePct, isInterState) {\n  let cgst = 0;\n  let sgst = 0;\n  let igst = 0;\n  if (isInterState) {\n    igst = taxableVal * (ratePct / 100);\n  } else {\n    cgst = taxableVal * ((ratePct / 2) / 100);\n    sgst = taxableVal * ((ratePct / 2) / 100);\n  }\n  const totalGst = cgst + sgst + igst;\n  const totalInvoice = taxableVal + totalGst;\n  return {\n    taxableValue: taxableVal,\n    cgstAmount: Number(cgst.toFixed(2)),\n    sgstAmount: Number(sgst.toFixed(2)),\n    igstAmount: Number(igst.toFixed(2)),\n    totalGstAmount: Number(totalGst.toFixed(2)),\n    totalInvoiceValue: Number(totalInvoice.toFixed(2)),\n    status: isInterState ? 'INTER_STATE_IGST_INVOICE_GENERATED' : 'INTRA_STATE_CGST_SGST_INVOICE_GENERATED'\n  };\n}",
    "eHint": "If inter-state, IGST = val * rate; if intra-state, CGST = SGST = val * (rate/2).",
    "eTest": "const intra = calculateGstTaxInvoice(100000, 18, false); // CGST 9k, SGST 9k, Total 118k\nconst inter = calculateGstTaxInvoice(100000, 18, true);  // IGST 18k, Total 118k\nif (intra.cgstAmount !== 9000 || intra.sgstAmount !== 9000 || inter.igstAmount !== 18000 || intra.totalInvoiceValue !== 118000) throw new Error('GST invoice calculation failed');",
    "aTitle": "Intra-State GST Component Formatter",
    "aDesc": "Implement function getIntraStateGstComponents() returning `['CGST', 'SGST']`.",
    "aStarter": "function getIntraStateGstComponents() {\n  // Write your answer here\n}",
    "aHint": "Return ['CGST', 'SGST'].",
    "aTest": "if (getIntraStateGstComponents().length !== 2) throw new Error('GST components check failed');"
  },
  {
    "day": 19,
    "title": "GST Input Tax Credit (ITC) & Cross-Utilization Set-Off Order",
    "desc": "Offset tax liabilities with input credits: Input Tax Credit (ITC) eligibility (Section 16), Blocked Credits (Section 17(5)), and the strict Statutory Set-Off Order (IGST ITC first offsets IGST, then CGST/SGST in any proportion; CGST ITC offsets CGST then IGST; SGST ITC offsets SGST then IGST; CGST and SGST can NEVER cross-offset!).",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of GST Input Tax Credit (ITC) & Cross-Utilization Set-Off Order.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Statutory rules, error handling, and audit compliance."
    ],
    "eTitle": "GST Input Tax Credit (ITC) Set-Off Engine",
    "eDesc": "Implement function calculateGstItcSetOff(outputIgst, outputCgst, outputSgst, inputIgst, inputCgst, inputSgst) calculating net tax payable to the government after legal ITC set-off.",
    "eStarter": "function calculateGstItcSetOff(outIgst, outCgst, outSgst, inIgst, inCgst, inSgst) {\n  let remInIgst = inIgst;\n  let remInCgst = inCgst;\n  let remInSgst = inSgst;\n\n  // 1. Offset Output IGST with Input IGST\n  let payIgst = Math.max(0, outIgst - remInIgst);\n  remInIgst = Math.max(0, remInIgst - outIgst);\n\n  // 2. Offset Output CGST with Input CGST, then remaining Input IGST\n  let payCgst = Math.max(0, outCgst - remInCgst);\n  remInCgst = Math.max(0, remInCgst - outCgst);\n  if (payCgst > 0 && remInIgst > 0) {\n    const useIgst = Math.min(payCgst, remInIgst);\n    payCgst -= useIgst;\n    remInIgst -= useIgst;\n  }\n\n  // 3. Offset Output SGST with Input SGST, then remaining Input IGST\n  let paySgst = Math.max(0, outSgst - remInSgst);\n  remInSgst = Math.max(0, remInSgst - outSgst);\n  if (paySgst > 0 && remInIgst > 0) {\n    const useIgst = Math.min(paySgst, remInIgst);\n    paySgst -= useIgst;\n    remInIgst -= useIgst;\n  }\n\n  const totalCashPayable = payIgst + payCgst + paySgst;\n  return {\n    netPayableIgst: payIgst,\n    netPayableCgst: payCgst,\n    netPayableSgst: paySgst,\n    totalNetCashTaxPayable: totalCashPayable,\n    status: 'GST_ITC_SET_OFF_COMPLETED_LEGAL_COMPLIANCE'\n  };\n}",
    "eHint": "Follow statutory order: IGST ITC -> IGST, CGST, SGST; CGST ITC -> CGST; SGST ITC -> SGST.",
    "eTest": "const res = calculateGstItcSetOff(10000, 18000, 18000, 15000, 12000, 12000); // Out: 10k IGST, 18k CGST, 18k SGST. In: 15k IGST, 12k CGST, 12k SGST -> IGST rem = 5k. CGST pay = 6k - 5k = 1k. SGST pay = 6k. Total = 7k\nif (res.netPayableIgst !== 0 || res.netPayableCgst !== 1000 || res.netPayableSgst !== 6000 || res.totalNetCashTaxPayable !== 7000) throw new Error('ITC set-off engine failed');",
    "aTitle": "CGST and SGST Cross-Offset Invariant Formatter",
    "aDesc": "Implement function canCgstOffsetSgst() returning `false`.",
    "aStarter": "function canCgstOffsetSgst() {\n  // Write your answer here\n}",
    "aHint": "Return false (Illegal!).",
    "aTest": "if (canCgstOffsetSgst() !== false) throw new Error('Cross-offset invariant check failed');"
  },
  {
    "day": 20,
    "title": "GST Returns: GSTR-1, GSTR-3B & GSTR-2B Auto-Reconciliation",
    "desc": "File and reconcile monthly GST returns: GSTR-1 (Outward supplies by 11th of month), GSTR-3B (Summary return and tax payment by 20th), GSTR-2B (Static auto-drafted ITC statement), and reconciling ITC mismatch under Rule 36(4).",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of GST Returns: GSTR-1, GSTR-3B & GSTR-2B Auto-Reconciliation.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Statutory rules, error handling, and audit compliance."
    ],
    "eTitle": "GSTR-2B vs Books ITC Reconciliation Auditor",
    "eDesc": "Implement function reconcileGstr2b(booksItcList, portal2bList) matching invoice numbers and identifying missing or mismatched ITC claims.",
    "eStarter": "function reconcileGstr2b(books, portal) {\n  const matched = [];\n  const missingIn2b = [];\n  for (const b of books) {\n    const match = portal.find(p => p.invoiceNo === b.invoiceNo && Math.abs(p.taxAmount - b.taxAmount) < 0.01);\n    if (match) matched.push(b);\n    else missingIn2b.push(b);\n  }\n  return {\n    totalBooksInvoices: books.length,\n    matchedInvoicesCount: matched.length,\n    missingIn2bCount: missingIn2b.length,\n    is100PercentMatched: missingIn2b.length === 0,\n    status: missingIn2b.length === 0 ? 'ITC_RECONCILIATION_PERFECT_MATCH' : 'INELIGIBLE_ITC_BLOCKED_RULE_36_4'\n  };\n}",
    "eHint": "Match invoiceNo and taxAmount between books and portal.",
    "eTest": "const books = [{ invoiceNo: 'INV-1', taxAmount: 1800 }, { invoiceNo: 'INV-2', taxAmount: 3600 }];\nconst portal = [{ invoiceNo: 'INV-1', taxAmount: 1800 }]; // INV-2 missing in GSTR-2B!\nconst res = reconcileGstr2b(books, portal);\nif (res.matchedInvoicesCount !== 1 || res.missingIn2bCount !== 1 || res.status !== 'INELIGIBLE_ITC_BLOCKED_RULE_36_4') throw new Error('GSTR-2B reconciliation failed');",
    "aTitle": "GSTR-1 Due Date Formatter",
    "aDesc": "Implement function getGstr1DueDate() returning `'11TH_OF_NEXT_MONTH'`.",
    "aStarter": "function getGstr1DueDate() {\n  // Write your answer here\n}",
    "aHint": "Return 11th.",
    "aTest": "if (getGstr1DueDate() !== '11TH_OF_NEXT_MONTH') throw new Error('Due date check failed');"
  },
  {
    "day": 21,
    "title": "⭐ MILESTONE 3: Complete Enterprise Tally Prime & GST Taxation Engine",
    "desc": "Milestone 3: Build an integrated enterprise accounting and taxation engine: Tally Prime chart of accounts XML generation, Dual-GST intra/inter-state invoicing, and statutory Input Tax Credit (ITC) cross-utilization set-off.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of ⭐ MILESTONE 3: Complete Enterprise Tally Prime & GST Taxation Engine.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Statutory rules, error handling, and audit compliance."
    ],
    "eTitle": "Enterprise ERP & GST Tax Orchestrator Kernel",
    "eDesc": "Implement function executeEnterpriseGstEngine(invoices, totalInputCredits) processing a batch of sales invoices and computing net GST remittance after input credit deductions.",
    "eStarter": "function executeEnterpriseGstEngine(invoices, inputCredits) {\n  let totalTaxable = 0;\n  let totalOutputGst = 0;\n  for (const inv of invoices) {\n    totalTaxable += inv.taxableValue;\n    totalOutputGst += inv.gstAmount;\n  }\n  const netCashPayable = Math.max(0, totalOutputGst - inputCredits);\n  return {\n    totalSalesTaxable: totalTaxable,\n    totalOutputGstCollected: totalOutputGst,\n    inputCreditUtilized: Math.min(totalOutputGst, inputCredits),\n    netGstPayableToGovt: netCashPayable,\n    engineStatus: 'ENTERPRISE_GST_ENGINE_ACTIVE_NOMINAL'\n  };\n}",
    "eHint": "Sum invoice taxable values and output GST, deduct inputCredits.",
    "eTest": "const invs = [{ taxableValue: 100000, gstAmount: 18000 }, { taxableValue: 200000, gstAmount: 36000 }];\nconst res = executeEnterpriseGstEngine(invs, 20000); // Output = 54k, ITC = 20k -> Net = 34k\nif (res.totalOutputGstCollected !== 54000 || res.netGstPayableToGovt !== 34000 || res.engineStatus !== 'ENTERPRISE_GST_ENGINE_ACTIVE_NOMINAL') throw new Error('Milestone 3 GST engine failed');",
    "aTitle": "GST Portal Status Formatter",
    "aDesc": "Implement function formatGstStatus(compliant) returning `GST_COMPLIANCE_${compliant ? 'VERIFIED' : 'DEFAULT'}`.",
    "aStarter": "function formatGstStatus() {\n  // Write your answer here\n}",
    "aHint": "Format status string.",
    "aTest": "if (formatGstStatus(true) !== 'GST_COMPLIANCE_VERIFIED') throw new Error('GST status format failed');"
  },
  {
    "day": 22,
    "title": "Reverse Charge Mechanism (RCM) & E-Way Bill Generation",
    "desc": "Handle special GST workflows: Reverse Charge Mechanism under Section 9(3) / 9(4) (Recipient pays GST directly to government!), Goods Transport Agency (GTA), and E-Way Bill rules for goods consignments exceeding Rs. 50,000.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Reverse Charge Mechanism (RCM) & E-Way Bill Generation.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Statutory rules, error handling, and audit compliance."
    ],
    "eTitle": "E-Way Bill Mandatory Check & Vehicle Distance Validity Engine",
    "eDesc": "Implement function evaluateEwayBillRequirement(consignmentValueDollars, distanceKm) determining if an E-Way Bill is mandatory and calculating validity duration (1 day per 200 km).",
    "eStarter": "function evaluateEwayBillRequirement(value, distanceKm) {\n  const isMandatory = value >= 50000;\n  const validityDays = isMandatory ? Math.max(1, Math.ceil(distanceKm / 200)) : 0;\n  return {\n    consignmentValue: value,\n    distanceKm,\n    ewayBillMandatory: isMandatory,\n    validityDays,\n    status: isMandatory ? 'EWAY_BILL_GENERATED_MANDATORY' : 'EWAY_BILL_EXEMPT_BELOW_50K'\n  };\n}",
    "eHint": "isMandatory = value >= 50000, validityDays = ceil(distanceKm / 200).",
    "eTest": "const req = evaluateEwayBillRequirement(75000, 450); // > 50k, 450 km -> 3 days\nconst exempt = evaluateEwayBillRequirement(30000, 100);\nif (!req.ewayBillMandatory || req.validityDays !== 3 || exempt.ewayBillMandatory) throw new Error('E-Way bill engine failed');",
    "aTitle": "E-Way Bill Threshold Formatter",
    "aDesc": "Implement function getEwayBillThreshold() returning `50000`.",
    "aStarter": "function getEwayBillThreshold() {\n  // Write your answer here\n}",
    "aHint": "Return 50000.",
    "aTest": "if (getEwayBillThreshold() !== 50000) throw new Error('Threshold check failed');"
  },
  {
    "day": 23,
    "title": "Payroll Accounting: Gross Salary, EPF, ESI & Statutory Deductions",
    "desc": "Calculate employee remuneration and statutory payroll deductions: Gross Salary (Basic + DA + HRA + Allowances), Employee Provident Fund (EPF 12% on Basic+DA), Employees' State Insurance (ESI 0.75% Employee, 3.25% Employer), Professional Tax (PT), and Net Take-Home Pay.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Payroll Accounting: Gross Salary, EPF, ESI & Statutory Deductions.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Statutory rules, error handling, and audit compliance."
    ],
    "eTitle": "Monthly Payroll & Statutory Deductions Engine",
    "eDesc": "Implement function calculatePayrollTakeHome(basicSalary, da, hra, otherAllowances, pt = 200) calculating Gross Salary, EPF (12%), ESI (0.75%), and Net Take-Home.",
    "eStarter": "function calculatePayrollTakeHome(basic, da, hra, allowances, pt = 200) {\n  const grossSalary = basic + da + hra + allowances;\n  const epfWages = basic + da;\n  const employeeEpf = Math.round(epfWages * 0.12);\n  const employeeEsi = grossSalary <= 21000 ? Math.round(grossSalary * 0.0075) : 0;\n  const totalDeductions = employeeEpf + employeeEsi + pt;\n  const netTakeHome = grossSalary - totalDeductions;\n  return {\n    grossSalary,\n    employeeEpfDeduction: employeeEpf,\n    employeeEsiDeduction: employeeEsi,\n    professionalTax: pt,\n    totalDeductions,\n    netTakeHomePay: netTakeHome,\n    status: 'PAYROLL_SLIP_GENERATED'\n  };\n}",
    "eHint": "Compute gross = basic + da + hra + allowances, epf = (basic+da)*0.12, net = gross - epf - esi - pt.",
    "eTest": "const res = calculatePayrollTakeHome(30000, 10000, 15000, 5000, 200); // Gross=60k, EPF=(40k)*0.12 = 4800, ESI=0 (gross > 21k), PT=200 -> Net = 60k - 5k = 55k\nif (res.grossSalary !== 60000 || res.employeeEpfDeduction !== 4800 || res.netTakeHomePay !== 55000 || res.status !== 'PAYROLL_SLIP_GENERATED') throw new Error('Payroll calculation failed');",
    "aTitle": "EPF Statutory Contribution Rate Formatter",
    "aDesc": "Implement function getEpfRate() returning `0.12`.",
    "aStarter": "function getEpfRate() {\n  // Write your answer here\n}",
    "aHint": "Return 0.12 (12%).",
    "aTest": "if (getEpfRate() !== 0.12) throw new Error('EPF rate check failed');"
  },
  {
    "day": 24,
    "title": "Tax Deducted at Source (TDS): Sections 194C, 194J, 194I & Form 16/26AS",
    "desc": "Comply with withholding tax obligations: Section 194C (Contractors: 1% Individual, 2% Company), Section 194J (Professional fees: 10% / 2%), Section 194I (Rent: 10% Building, 2% Plant), TAN generation, Form 16 / 16A certificates, and TRACES 26AS matching.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Tax Deducted at Source (TDS): Sections 194C, 194J, 194I & Form 16/26AS.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Statutory rules, error handling, and audit compliance."
    ],
    "eTitle": "TDS Calculation & Withholding Remittance Engine",
    "eDesc": "Implement function calculateTdsWithholding(invoiceAmount, sectionCode, isCompanyVendor) calculating TDS amount and net vendor payable.",
    "eStarter": "function calculateTdsWithholding(amount, section, isCompany) {\n  let tdsRate = 0;\n  if (section === '194C') tdsRate = isCompany ? 0.02 : 0.01;\n  else if (section === '194J') tdsRate = 0.10;\n  else if (section === '194I') tdsRate = 0.10;\n  const tdsAmount = amount * tdsRate;\n  const netPayable = amount - tdsAmount;\n  return {\n    invoiceAmount: amount,\n    sectionCode: section,\n    tdsRatePercent: tdsRate * 100,\n    tdsWithheld: tdsAmount,\n    netPayableToVendor: netPayable,\n    status: 'TDS_WITHHELD_CHALLAN_281_SCHEDULED'\n  };\n}",
    "eHint": "Compute TDS based on Section 194C, 194J, or 194I.",
    "eTest": "const c1 = calculateTdsWithholding(100000, '194C', false); // 1% Individual contractor = 1k\nconst j1 = calculateTdsWithholding(100000, '194J', true);  // 10% Professional fee = 10k\nif (c1.tdsWithheld !== 1000 || c1.netPayableToVendor !== 99000 || j1.tdsWithheld !== 10000) throw new Error('TDS calculation failed');",
    "aTitle": "TDS Payment Challan Formatter",
    "aDesc": "Implement function getTdsChallan() returning `'ITNS_281'`.",
    "aStarter": "function getTdsChallan() {\n  // Write your answer here\n}",
    "aHint": "Return 'ITNS_281'.",
    "aTest": "if (getTdsChallan() !== 'ITNS_281') throw new Error('Challan check failed');"
  },
  {
    "day": 25,
    "title": "Direct Income Tax: Old vs New Tax Regime (Section 115BAC)",
    "desc": "Compute individual income tax: Old Tax Regime (With Chapter VI-A 80C up to 1.5L, 80D health insurance, HRA exemption) vs New Tax Regime under Section 115BAC (Lower slab rates, Standard Deduction Rs. 75,000, Zero rebate up to Rs. 7 Lakhs under Sec 87A).",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Direct Income Tax: Old vs New Tax Regime (Section 115BAC).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Statutory rules, error handling, and audit compliance."
    ],
    "eTitle": "Old vs New Income Tax Regime Comparator",
    "eDesc": "Implement function compareIncomeTaxRegimes(grossIncome, deductions80C = 150000, deductions80D = 25000) calculating tax liability under both regimes and recommending the optimal choice.",
    "eStarter": "function compareIncomeTaxRegimes(gross, d80c = 150000, d80d = 25000) {\n  // Simplified New Regime (Section 115BAC) with 75k std deduction\n  const newTaxable = Math.max(0, gross - 75000);\n  let newTax = 0;\n  if (newTaxable > 700000) {\n    newTax = (newTaxable - 700000) * 0.15 + 40000; // Simplified slab model\n  }\n  // Simplified Old Regime with 50k std deduction + 80C + 80D\n  const oldTaxable = Math.max(0, gross - 50000 - d80c - d80d);\n  let oldTax = 0;\n  if (oldTaxable > 500000) {\n    oldTax = (oldTaxable - 500000) * 0.20 + 12500;\n  }\n  const isNewBetter = newTax <= oldTax;\n  return {\n    grossIncome: gross,\n    oldRegimeTax: Math.round(oldTax),\n    newRegimeTax: Math.round(newTax),\n    recommendedRegime: isNewBetter ? 'NEW_TAX_REGIME_SECTION_115BAC' : 'OLD_TAX_REGIME_WITH_DEDUCTIONS',\n    status: 'TAX_REGIME_COMPARISON_OPTIMAL'\n  };\n}",
    "eHint": "Compare Old vs New regime tax calculations and return recommended choice.",
    "eTest": "const res = compareIncomeTaxRegimes(1200000, 150000, 25000);\nif (!res.recommendedRegime || res.status !== 'TAX_REGIME_COMPARISON_OPTIMAL') throw new Error('Tax regime comparison failed');",
    "aTitle": "New Regime Default Section Formatter",
    "aDesc": "Implement function getNewRegimeSection() returning `'SECTION_115BAC'`.",
    "aStarter": "function getNewRegimeSection() {\n  // Write your answer here\n}",
    "aHint": "Return 'SECTION_115BAC'.",
    "aTest": "if (getNewRegimeSection() !== 'SECTION_115BAC') throw new Error('Section check failed');"
  },
  {
    "day": 26,
    "title": "Capital Gains Taxation & Corporate Income Tax (Section 115BAA)",
    "desc": "Calculate investment and corporate taxes: Short-Term Capital Gains (STCG Section 111A: 20%), Long-Term Capital Gains (LTCG Section 112A: 12.5% above 1.25L exemption), Cost Inflation Index (CII), and Corporate Tax Section 115BAA (22% + Surcharge 10% + Cess 4% = 25.168%).",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Capital Gains Taxation & Corporate Income Tax (Section 115BAA).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Statutory rules, error handling, and audit compliance."
    ],
    "eTitle": "Capital Gains & Corporate Tax Evaluator",
    "eDesc": "Implement function calculateCapitalGainsAndCorporateTax(ltcgGain, stcgGain, corporateProfit) calculating total capital gains tax and corporate tax.",
    "eStarter": "function calculateCapitalGainsAndCorporateTax(ltcg, stcg, corpProfit) {\n  const taxableLtcg = Math.max(0, ltcg - 125000); // 1.25L exemption\n  const ltcgTax = taxableLtcg * 0.125; // 12.5% rate\n  const stcgTax = stcg * 0.20; // 20% rate\n  const corpTax = corpProfit * 0.25168; // 25.168% effective corporate rate (Sec 115BAA)\n  return {\n    ltcgTaxPayable: Number(ltcgTax.toFixed(2)),\n    stcgTaxPayable: Number(stcgTax.toFixed(2)),\n    corporateTaxPayable: Number(corpTax.toFixed(2)),\n    status: 'TAX_LIABILITY_COMPUTED_SECTION_115BAA'\n  };\n}",
    "eHint": "Compute LTCG = max(0, ltcg - 125k)*0.125, STCG = stcg*0.20, CorpTax = corpProfit*0.25168.",
    "eTest": "const res = calculateCapitalGainsAndCorporateTax(225000, 50000, 1000000); // LTCG = 100k*0.125 = 12.5k; STCG = 50k*0.20 = 10k; Corp = 251,680\nif (res.ltcgTaxPayable !== 12500 || res.stcgTaxPayable !== 10000 || res.corporateTaxPayable !== 251680) throw new Error('Capital gains & corporate tax failed');",
    "aTitle": "Corporate Effective Tax Rate Formatter",
    "aDesc": "Implement function getCorporateEffectiveRate() returning `25.168`.",
    "aStarter": "function getCorporateEffectiveRate() {\n  // Write your answer here\n}",
    "aHint": "Return 25.168.",
    "aTest": "if (getCorporateEffectiveRate() !== 25.168) throw new Error('Effective rate check failed');"
  },
  {
    "day": 27,
    "title": "Financial Statement Analysis: Liquidity, Solvency & Profitability Ratios",
    "desc": "Evaluate corporate financial health: Current Ratio ($CA / CL \\ge 2.0$), Quick / Acid-Test Ratio ($(CA - \\text{Inventory}) / CL \\ge 1.0$), Debt-to-Equity ($D/E$), Return on Equity ($ROE$), and Net Profit Margin.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Financial Statement Analysis: Liquidity, Solvency & Profitability Ratios.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Statutory rules, error handling, and audit compliance."
    ],
    "eTitle": "Financial Ratios Comprehensive Health Engine",
    "eDesc": "Implement function calculateFinancialRatios(currentAssets, inventory, currentLiabilities, totalDebt, totalEquity, netProfit, revenue) calculating liquidity, solvency, and profitability ratios.",
    "eStarter": "function calculateFinancialRatios(ca, inv, cl, debt, eq, np, rev) {\n  const currentRatio = Number((ca / cl).toFixed(2));\n  const quickRatio = Number(((ca - inv) / cl).toFixed(2));\n  const debtToEquity = Number((debt / eq).toFixed(2));\n  const netMarginPct = Number(((np / rev) * 100).toFixed(2));\n  const isLiquid = currentRatio >= 1.33 && quickRatio >= 1.0;\n  return {\n    currentRatio,\n    quickRatio,\n    debtToEquityRatio: debtToEquity,\n    netProfitMarginPercent: netMarginPct,\n    isLiquiditySound: isLiquid,\n    status: 'FINANCIAL_RATIOS_EVALUATED'\n  };\n}",
    "eHint": "Compute currentRatio = ca/cl, quickRatio = (ca-inv)/cl, debtToEquity = debt/eq, netMargin = np/rev.",
    "eTest": "const res = calculateFinancialRatios(200000, 50000, 100000, 150000, 300000, 40000, 400000); // CR=2.0, QR=1.5, D/E=0.5, Margin=10%\nif (res.currentRatio !== 2.0 || res.quickRatio !== 1.5 || res.debtToEquityRatio !== 0.5 || res.netProfitMarginPercent !== 10.0 || !res.isLiquiditySound) throw new Error('Financial ratios failed');",
    "aTitle": "Standard Current Ratio Benchmark Formatter",
    "aDesc": "Implement function getStandardCurrentRatio() returning `'2:1'`.",
    "aStarter": "function getStandardCurrentRatio() {\n  // Write your answer here\n}",
    "aHint": "Return '2:1'.",
    "aTest": "if (getStandardCurrentRatio() !== '2:1') throw new Error('Ratio benchmark check failed');"
  },
  {
    "day": 28,
    "title": "Cash Flow Statement (AS-3): Operating, Investing & Financing Cashflows",
    "desc": "Track physical cash movement under Accounting Standard 3 (AS-3): Operating Activities (Indirect method starting from Net Profit, adding non-cash depreciation), Investing Activities (Purchase/sale of fixed assets), and Financing Activities (Issuing shares, bank loans, paying dividends).",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Cash Flow Statement (AS-3): Operating, Investing & Financing Cashflows.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Statutory rules, error handling, and audit compliance."
    ],
    "eTitle": "AS-3 Cash Flow Statement Engine",
    "eDesc": "Implement function calculateCashFlowStatement(netProfit, depreciation, workingCapitalChange, fixedAssetPurchases, fixedAssetSales, loansTaken, dividendsPaid, openingCash) calculating Net Cash Flow and Closing Cash.",
    "eStarter": "function calculateCashFlowStatement(np, dep, wcChange, faBuy, faSell, loan, div, openCash) {\n  const cfo = np + dep + wcChange;\n  const cfi = faSell - faBuy;\n  const cff = loan - div;\n  const netCashFlow = cfo + cfi + cff;\n  const closingCash = openCash + netCashFlow;\n  return {\n    cashFromOperations: cfo,\n    cashFromInvesting: cfi,\n    cashFromFinancing: cff,\n    netCashFlow,\n    closingCashBalance: closingCash,\n    status: 'AS3_CASH_FLOW_STATEMENT_GENERATED'\n  };\n}",
    "eHint": "Compute cfo = np + dep + wcChange, cfi = faSell - faBuy, cff = loan - div, closingCash = openCash + netCashFlow.",
    "eTest": "const res = calculateCashFlowStatement(50000, 10000, -5000, 30000, 5000, 20000, 10000, 15000); // CFO=55k, CFI=-25k, CFF=10k -> Net = 40k. Close = 55k\nif (res.cashFromOperations !== 55000 || res.cashFromInvesting !== -25000 || res.cashFromFinancing !== 10000 || res.closingCashBalance !== 55000) throw new Error('Cash flow statement failed');",
    "aTitle": "Cash Flow Accounting Standard Formatter",
    "aDesc": "Implement function getCashFlowStandard() returning `'AS_3_CASH_FLOW_STATEMENTS'`.",
    "aStarter": "function getCashFlowStandard() {\n  // Write your answer here\n}",
    "aHint": "Return AS-3.",
    "aTest": "if (getCashFlowStandard() !== 'AS_3_CASH_FLOW_STATEMENTS') throw new Error('Standard check failed');"
  },
  {
    "day": 29,
    "title": "Cloud Accounting, AI Invoicing (OCR) & Forensic Fraud Detection",
    "desc": "Modern digital financial systems: Cloud Accounting (Zoho Books / QuickBooks Online APIs), AI Optical Character Recognition (OCR) invoice parsing, Internal Financial Controls (IFC), and Forensic Fraud Detection (Benford's Law).",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Cloud Accounting, AI Invoicing (OCR) & Forensic Fraud Detection.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Statutory rules, error handling, and audit compliance."
    ],
    "eTitle": "AI Invoice OCR & Anomaly Fraud Detection Engine",
    "eDesc": "Implement function auditInvoiceOcr(extractedInvoiceNo, extractedGstNumber, extractedAmount, gstChecksumValid, isDuplicateInvoice) validating automated invoice ingest and flagging potential accounting fraud.",
    "eStarter": "function auditInvoiceOcr(invNo, gstin, amount, gstValid, isDuplicate) {\n  const isValid = Boolean(invNo && gstin && amount > 0 && gstValid && !isDuplicate);\n  return {\n    invoiceNumber: invNo,\n    gstin,\n    invoiceAmount: amount,\n    fraudRiskDetected: !isValid,\n    remedy: isDuplicate ? 'FLAG_DUPLICATE_INVOICE_FRAUD' : (!gstValid ? 'INVALID_GSTIN_CHECKSUM' : 'INVOICE_APPROVED_FOR_PAYMENT'),\n    status: isValid ? 'AI_OCR_INVOICE_VERIFIED_AND_POSTED' : 'INVOICE_REJECTED_AUDIT_ANOMALY'\n  };\n}",
    "eHint": "Verify all invoice fields, valid GST, and no duplication.",
    "eTest": "const ok = auditInvoiceOcr('INV-101', '29ABCDE1234F1Z5', 50000, true, false);\nconst dup = auditInvoiceOcr('INV-101', '29ABCDE1234F1Z5', 50000, true, true);\nif (!ok.status.includes('VERIFIED') || dup.status.includes('VERIFIED') || dup.remedy !== 'FLAG_DUPLICATE_INVOICE_FRAUD') throw new Error('AI OCR fraud engine failed');",
    "aTitle": "Forensic Law Formatter",
    "aDesc": "Implement function getForensicAccountingLaw() returning `'BENFORDS_LAW_FIRST_DIGIT_DISTRIBUTION'`.",
    "aStarter": "function getForensicAccountingLaw() {\n  // Write your answer here\n}",
    "aHint": "Return Benford's Law.",
    "aTest": "if (getForensicAccountingLaw() !== 'BENFORDS_LAW_FIRST_DIGIT_DISTRIBUTION') throw new Error('Forensic law check failed');"
  },
  {
    "day": 30,
    "title": "🏆 FINAL CAPSTONE: Integrated Corporate Digital Accounting, GST & Tax Audit Suite",
    "desc": "Final Capstone Synthesis: The complete corporate accounting, taxation, and financial compliance ecosystem: 1. Double-entry trial balance ledger closing; 2. Trading and Profit & Loss financial statements; 3. Dual-GST tax remittance and ITC set-off; 4. Statutory payroll & TDS withholding compliance; 5. Final corporate tax filing under Section 115BAA.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of 🏆 FINAL CAPSTONE: Integrated Corporate Digital Accounting, GST & Tax Audit Suite.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Statutory rules, error handling, and audit compliance."
    ],
    "eTitle": "Corporate Accounting & Taxation Master Orchestrator",
    "eDesc": "Implement function orchestrateCorporateAccounting(booksBalanced, financialStatementsFinalized, gstRemitted, payrollCompliant, taxFiled) certifying complete corporate audit and tax compliance.",
    "eStarter": "function orchestrateCorporateAccounting(books, fin, gst, pay, tax) {\n  const isCompliant = books && fin && gst && pay && tax;\n  return {\n    generalLedgerBalanced: books,\n    financialStatementsFinalized: fin,\n    gstRemittanceCleared: gst,\n    statutoryPayrollCompliant: pay,\n    corporateIncomeTaxFiled: tax,\n    corporateGradeAuditCertified: isCompliant,\n    certified: true,\n    status: isCompliant ? 'CORPORATE_ACCOUNTING_AND_TAX_AUDIT_CERTIFIED_NOMINAL' : 'COMPLIANCE_AUDIT_DEFECT_DETECTED'\n  };\n}",
    "eHint": "Verify all 5 corporate compliance dimensions are true.",
    "eTest": "const ok = orchestrateCorporateAccounting(true, true, true, true, true);\nconst fail = orchestrateCorporateAccounting(true, true, false, true, true);\nif (!ok.corporateGradeAuditCertified || fail.corporateGradeAuditCertified || !ok.certified || ok.status !== 'CORPORATE_ACCOUNTING_AND_TAX_AUDIT_CERTIFIED_NOMINAL') throw new Error('Capstone accounting orchestrator failed');",
    "aTitle": "Digital Accounting Master Certification Auditor",
    "aDesc": "Implement function auditAccountingMasterCert() returning `{ certified: true, score: '100/100', tier: 'ENTERPRISE_DIGITAL_ACCOUNTANT_MASTER_CERTIFIED' }`.",
    "aStarter": "function auditAccountingMasterCert() {\n  // Write your answer here\n}",
    "aHint": "Return certification object.",
    "aTest": "if (!auditAccountingMasterCert().certified) throw new Error('Capstone cert failed');"
  }
];

export const BCOM_ACCOUNTING_30_DAYS_QUESTS: CourseQuest[] = BCOM_ACCOUNTING_30_DAYS_CONFIGS.flatMap((cfg, idx) => 
  buildEnrichedDayQuests('bcom_acc', idx + 1, cfg)
);
