import { buildEnrichedDayQuests, DayConfig } from './curriculumEnricher';
import { CourseQuest } from './coursesData';

export const BCOM_ACCOUNTING_30_DAYS_CONFIGS: DayConfig[] = [
  {
    "day": 1,
    "title": "Financial Accounting Invariants & 3-Statement Integration",
    "desc": "Master the fundamental accounting equation: $Assets = Liabilities + Equity$, the dual aspect principle, business entity concept, and money measurement conventions.",
    "syllabus": [
      "The Fundamental Equation: Assets = Liabilities + Capital (Owner Equity).",
      "Dual Aspect Principle: Every transaction impacts at least two accounts in perfect equilibrium.",
      "Business Entity Concept: The business is a distinct legal and financial entity separate from its owners."
    ],
    "eTitle": "Accounting Equation Equilibrium Validator",
    "eDesc": "Implement function `validateAccountingEquation(assets, liabilities, equity)` verifying that $Assets = Liabilities + Equity$. Return `{ isBalanced: boolean, totalRightSide: number, equationChecksum: 'PERFECT_EQUILIBRIUM_NOMINAL' | 'EQUATION_IMBALANCE_ERROR' }`.",
    "eStarter": "/**\n * Validates the fundamental accounting equation: Assets = Liabilities + Equity.\n * \n * @param {number} assets - Total economic resources owned\n * @param {number} liabilities - Total claims by outside creditors\n * @param {number} equity - Residual owner's capital\n * @returns {{\n *   isBalanced: boolean,\n *   totalRightSide: number,\n *   equationChecksum: 'PERFECT_EQUILIBRIUM_NOMINAL' | 'EQUATION_IMBALANCE_ERROR'\n * }} Equilibrium verification report\n */\nfunction validateAccountingEquation(assets, liabilities, equity) {\n  // TODO: Compute totalRightSide = liabilities + equity; check isBalanced = Math.abs(assets - totalRightSide) < 0.01; return status object\n  \n}",
    "eHint": "Compute totalRightSide = liabilities + equity; isBalanced = Math.abs(assets - totalRightSide) < 0.01; return object with totals and equationChecksum.",
    "eTest": "const ok = validateAccountingEquation(500000, 200000, 300000);\nif (!ok.isBalanced || ok.equationChecksum !== 'PERFECT_EQUILIBRIUM_NOMINAL') throw new Error('Balanced equation check failed');\nconst bad = validateAccountingEquation(500000, 200000, 250000);\nif (bad.isBalanced || bad.equationChecksum !== 'EQUATION_IMBALANCE_ERROR') throw new Error('Imbalanced equation check failed');\nconst zero = validateAccountingEquation(0, 0, 0);\nif (!zero.isBalanced) throw new Error('Zero baseline equation balance failed');",
    "aTitle": "Missing Equity & Capital Balance Solver",
    "aDesc": "Implement function `solveMissingEquity(assets, liabilities)` calculating owner capital and determining if the enterprise is solvent ($Assets \\ge Liabilities$). Return `{ equity: number, isSolvent: boolean }`.",
    "aStarter": "/**\n * Calculates owner equity and evaluates solvency (Assets >= Liabilities).\n * \n * @param {number} assets - Total economic assets\n * @param {number} liabilities - Total liabilities\n * @returns {{\n *   equity: number,\n *   isSolvent: boolean\n * }} Solvency evaluation object\n */\nfunction solveMissingEquity(assets, liabilities) {\n  // TODO: Calculate equity = assets - liabilities; isSolvent = assets >= liabilities; return { equity, isSolvent }\n  \n}",
    "aHint": "Calculate equity = assets - liabilities; isSolvent = assets >= liabilities; return { equity, isSolvent }.",
    "aTest": "const s1 = solveMissingEquity(100000, 40000);\nif (s1.equity !== 60000 || !s1.isSolvent) throw new Error('Solvent equity solve failed');\nconst s2 = solveMissingEquity(30000, 50000);\nif (s2.equity !== -20000 || s2.isSolvent) throw new Error('Insolvent equity solve failed');"
  },
  {
    "day": 2,
    "title": "ASC 842 Leases, Multi-Currency Consolidation, Inventory Dynamics & ERP Controls",
    "desc": "Classify accounts and apply the 3 Golden Rules: Personal Accounts (Debit the Receiver, Credit the Giver), Real Accounts (Debit what Comes In, Credit what Goes Out), and Nominal Accounts (Debit all Expenses/Losses, Credit all Incomes/Gains).",
    "syllabus": [
      "Personal Accounts: Natural, Artificial (Companies), and Representative persons.",
      "Real Accounts: Tangible (Machinery, Cash, Land) and Intangible (Goodwill, Patents) assets.",
      "Nominal Accounts: Rent, Salaries, Sales, Commissions, and Depreciation."
    ],
    "eTitle": "Golden Rules Debit/Credit Direction Classifier",
    "eDesc": "Implement function `classifyAccountingRule(accountType, eventType)` returning the debit or credit rule string under the 3 Golden Rules: PERSONAL ('DEBIT_THE_RECEIVER' | 'CREDIT_THE_GIVER'), REAL ('DEBIT_WHAT_COMES_IN' | 'CREDIT_WHAT_GOES_OUT'), or NOMINAL ('DEBIT_EXPENSES_AND_LOSSES' | 'CREDIT_INCOMES_AND_GAINS').",
    "eStarter": "/**\n * Classifies debit/credit directive based on the 3 Golden Rules of Accounting.\n * \n * @param {'PERSONAL' | 'REAL' | 'NOMINAL'} accountType - Account classification\n * @param {'RECEIVER' | 'GIVER' | 'COMES_IN' | 'GOES_OUT' | 'EXPENSE_OR_LOSS' | 'INCOME'} eventType - Transaction event type\n * @returns {string} One of:\n *   - 'DEBIT_THE_RECEIVER' | 'CREDIT_THE_GIVER'\n *   - 'DEBIT_WHAT_COMES_IN' | 'CREDIT_WHAT_GOES_OUT'\n *   - 'DEBIT_EXPENSES_AND_LOSSES' | 'CREDIT_INCOMES_AND_GAINS'\n */\nfunction classifyAccountingRule(accountType, eventType) {\n  // TODO: Evaluate accountType and eventType to return the standard Golden Rule string\n  \n}",
    "eHint": "Check accountType: PERSONAL -> RECEIVER ? 'DEBIT_THE_RECEIVER' : 'CREDIT_THE_GIVER'; REAL -> COMES_IN ? 'DEBIT_WHAT_COMES_IN' : 'CREDIT_WHAT_GOES_OUT'; NOMINAL -> EXPENSE_OR_LOSS ? 'DEBIT_EXPENSES_AND_LOSSES' : 'CREDIT_INCOMES_AND_GAINS'.",
    "eTest": "const r1 = classifyAccountingRule('PERSONAL', 'RECEIVER');\nif (r1 !== 'DEBIT_THE_RECEIVER') throw new Error('Personal receiver rule failed');\nconst r2 = classifyAccountingRule('REAL', 'COMES_IN');\nif (r2 !== 'DEBIT_WHAT_COMES_IN') throw new Error('Real comes in rule failed');\nconst r3 = classifyAccountingRule('NOMINAL', 'EXPENSE_OR_LOSS');\nif (r3 !== 'DEBIT_EXPENSES_AND_LOSSES') throw new Error('Nominal expense rule failed');\nconst r4 = classifyAccountingRule('NOMINAL', 'INCOME');\nif (r4 !== 'CREDIT_INCOMES_AND_GAINS') throw new Error('Nominal income rule failed');",
    "aTitle": "Transaction Double-Entry Legs Rule Mapper",
    "aDesc": "Implement function `mapTransactionRules(debitAccountType, creditAccountType)` returning `{ debitRule: string, creditRule: string, isValid: boolean }` mapping debit legs ('DEBIT_THE_RECEIVER' | 'DEBIT_WHAT_COMES_IN' | 'DEBIT_EXPENSES_AND_LOSSES') and credit legs ('CREDIT_THE_GIVER' | 'CREDIT_WHAT_GOES_OUT' | 'CREDIT_INCOMES_AND_GAINS').",
    "aStarter": "/**\n * Maps dual transaction legs to their respective Golden Rule directives.\n * \n * @param {'PERSONAL' | 'REAL' | 'NOMINAL'} debitAccountType - Account being debited\n * @param {'PERSONAL' | 'REAL' | 'NOMINAL'} creditAccountType - Account being credited\n * @returns {{\n *   debitRule: 'DEBIT_THE_RECEIVER' | 'DEBIT_WHAT_COMES_IN' | 'DEBIT_EXPENSES_AND_LOSSES',\n *   creditRule: 'CREDIT_THE_GIVER' | 'CREDIT_WHAT_GOES_OUT' | 'CREDIT_INCOMES_AND_GAINS',\n *   isValid: boolean\n * }} Transaction rule mapping object\n */\nfunction mapTransactionRules(debitAccountType, creditAccountType) {\n  // TODO: Map debit and credit account types to their corresponding Golden Rules\n  \n}",
    "aHint": "Use helper mapping object for debit types ('PERSONAL' -> 'DEBIT_THE_RECEIVER', 'REAL' -> 'DEBIT_WHAT_COMES_IN', 'NOMINAL' -> 'DEBIT_EXPENSES_AND_LOSSES') and corresponding credit rules.",
    "aTest": "const m = mapTransactionRules('NOMINAL', 'REAL');\nif (m.debitRule !== 'DEBIT_EXPENSES_AND_LOSSES' || m.creditRule !== 'CREDIT_WHAT_GOES_OUT' || !m.isValid) throw new Error('Transaction rule mapping failed');"
  },
  {
    "day": 3,
    "title": "Advanced Cost Accounting: Activity-Based Costing (ABC), Standard Costing & Flexible Budget Variances",
    "desc": "Record prime entry transactions in the General Journal: Date, Particulars (Debit & Credit accounts), Ledger Folio (LF), Amount, Narration, and multi-line Compound Journal Entries.",
    "syllabus": [
      "General Journal Structure: Strict chronological recording of business events.",
      "Compound Entries: Transactions with multiple debits and/or credits (e.g. Sales with GST).",
      "Narration Integrity: Clear legal and contextual description of the transaction."
    ],
    "eTitle": "Two-Sided Compound Journal Entry Balancer (Advanced Cost Accounting)",
    "eDesc": "Implement function `validateJournalEntry(debitLines, creditLines)` calculating total debits and credits and verifying two-sided equilibrium. Return `{ isBalanced: boolean, totalDebitAmount: number, totalCreditAmount: number, journalStatus: 'JOURNAL_ENTRY_BALANCED_AND_POSTED' | 'UNBALANCED_JOURNAL_ENTRY_REJECTED' }`.",
    "eStarter": "/**\n * Validates a compound journal entry's two-sided equilibrium.\n * \n * @param {Array<{ account: string, amount: number }>} debits - Array of debit lines\n * @param {Array<{ account: string, amount: number }>} credits - Array of credit lines\n * @returns {{\n *   isBalanced: boolean,\n *   totalDebitAmount: number,\n *   totalCreditAmount: number,\n *   journalStatus: 'JOURNAL_ENTRY_BALANCED_AND_POSTED' | 'UNBALANCED_JOURNAL_ENTRY_REJECTED'\n * }} Journal equilibrium validation result\n */\nfunction validateJournalEntry(debits, credits) {\n  // TODO: Sum debit and credit lines and return equilibrium verification object\n  \n}",
    "eHint": "Sum debits with reduce((s, d) => s + d.amount, 0), sum credits similarly; check Math.abs(sumDebits - sumCredits) < 0.01 and return status object.",
    "eTest": "const d = [{ account: 'Cash', amount: 9000 }, { account: 'Discount Allowed', amount: 1000 }];\nconst c = [{ account: 'Debtor Sharma', amount: 10000 }];\nconst res = validateJournalEntry(d, c);\nif (!res.isBalanced || res.totalDebitAmount !== 10000 || res.journalStatus !== 'JOURNAL_ENTRY_BALANCED_AND_POSTED') throw new Error('Balanced journal check failed');\nconst unbal = validateJournalEntry([{ account: 'Cash', amount: 5000 }], [{ account: 'Sales', amount: 4000 }]);\nif (unbal.isBalanced || unbal.journalStatus !== 'UNBALANCED_JOURNAL_ENTRY_REJECTED') throw new Error('Unbalanced journal check failed');\nconst empty = validateJournalEntry([], []);\nif (empty.totalDebitAmount !== 0 || empty.totalCreditAmount !== 0) throw new Error('Empty journal total failed');",
    "aTitle": "Trade & Cash Discount Invoice Calculator",
    "aDesc": "Implement function `calculatePurchaseJournal(grossAmount, tradeDiscountPct, cashDiscountPct)` computing trade discount, invoice value, cash discount, and net cash paid. Return `{ tradeDiscount: number, invoicePrice: number, cashDiscount: number, netPayable: number }`.",
    "aStarter": "/**\n * Calculates trade discount, net invoice price, cash settlement discount, and net payable.\n * \n * @param {number} grossAmount - Catalog or list purchase price\n * @param {number} tradeDiscountPct - Trade discount percentage deducted on invoice\n * @param {number} cashDiscountPct - Prompt payment cash discount percentage on invoice price\n * @returns {{\n *   tradeDiscount: number,\n *   invoicePrice: number,\n *   cashDiscount: number,\n *   netPayable: number\n * }} Purchase invoice discount breakdown\n */\nfunction calculatePurchaseJournal(grossAmount, tradeDiscountPct, cashDiscountPct) {\n  // TODO: Deduct trade discount first, then compute cash discount on remaining invoice amount\n  \n}",
    "aHint": "tradeDiscount = grossAmount * (tradeDiscountPct / 100); invoicePrice = grossAmount - tradeDiscount; cashDiscount = invoicePrice * (cashDiscountPct / 100); netPayable = invoicePrice - cashDiscount.",
    "aTest": "const p = calculatePurchaseJournal(10000, 10, 2); // 10k - 1k TD = 9k invoice. CD = 2% of 9k = 180. Net = 8820.\nif (p.tradeDiscount !== 1000 || p.invoicePrice !== 9000 || p.cashDiscount !== 180 || p.netPayable !== 8820) throw new Error('Discount calculation failed');"
  },
  {
    "day": 4,
    "title": "Complex Financial Instruments, ASC 326 CECL Credit Losses & Hedge Accounting",
    "desc": "Post journal entries into the Principal Book of Accounts (General Ledger): Debit side ('To...'), Credit side ('By...'), balancing accounts at period end ('By Balance c/d' and 'To Balance b/d').",
    "syllabus": [
      "Ledger Structure: 'T-Account' format with Debit (Dr.) left side and Credit (Cr.) right side.",
      "Posting Mechanics: Extracting journal line items and updating individual ledger heads.",
      "Closing Balances: Calculating Debit Balances (Assets, Expenses) vs Credit Balances (Liabilities, Incomes)."
    ],
    "eTitle": "T-Account Ledger Closing Balance Calculator",
    "eDesc": "Implement function `calculateLedgerBalance(accountName, debitEntries, creditEntries)` calculating closing balance and determining classification. Return `{ closingBalance: number, balanceType: 'DEBIT_BALANCE' | 'CREDIT_BALANCE' | 'NIL_BALANCE' }`.",
    "eStarter": "/**\n * Calculates T-Account closing balance and debit/credit orientation.\n * \n * @param {string} name - Account title\n * @param {number[]} debits - Array of debit entry amounts\n * @param {number[]} credits - Array of credit entry amounts\n * @returns {{\n *   closingBalance: number,\n *   balanceType: 'DEBIT_BALANCE' | 'CREDIT_BALANCE' | 'NIL_BALANCE'\n * }} T-account balance summary\n */\nfunction calculateLedgerBalance(name, debits, credits) {\n  // TODO: Sum debits and credits, determine difference and debit/credit balance classification\n  \n}",
    "eHint": "Compute totalDr = sum(debits), totalCr = sum(credits), diff = totalDr - totalCr, closingBalance = Math.abs(diff), balanceType = diff > 0 ? 'DEBIT_BALANCE' : (diff < 0 ? 'CREDIT_BALANCE' : 'NIL_BALANCE').",
    "eTest": "const res = calculateLedgerBalance('Cash Account', [50000, 20000], [30000, 15000]); // 70k - 45k = +25k Dr\nif (res.closingBalance !== 25000 || res.balanceType !== 'DEBIT_BALANCE') throw new Error('Debit balance ledger failed');\nconst crRes = calculateLedgerBalance('Creditor A/c', [10000], [25000]);\nif (crRes.closingBalance !== 15000 || crRes.balanceType !== 'CREDIT_BALANCE') throw new Error('Credit balance ledger failed');\nconst nilRes = calculateLedgerBalance('Settled A/c', [5000], [5000]);\nif (nilRes.closingBalance !== 0 || nilRes.balanceType !== 'NIL_BALANCE') throw new Error('Nil balance ledger failed');",
    "aTitle": "Multi-Account Ledger Trial Extractor",
    "aDesc": "Implement function `extractLedgerSummary(accounts)` aggregating total debit balances ('DEBIT_BALANCE') and total credit balances ('CREDIT_BALANCE') across balanced T-accounts. Return `{ totalDebit: number, totalCredit: number, isBalanced: boolean }`.",
    "aStarter": "/**\n * Aggregates ledger account balances into trial totals.\n * \n * @param {Array<{ balanceType: 'DEBIT_BALANCE' | 'CREDIT_BALANCE', closingBalance: number }>} accounts - List of balanced T-accounts\n * @returns {{\n *   totalDebit: number,\n *   totalCredit: number,\n *   isBalanced: boolean\n * }} Ledger trial balance summary\n */\nfunction extractLedgerSummary(accounts) {\n  // TODO: Iterate accounts and aggregate totalDebitBalances and totalCreditBalances\n  \n}",
    "aHint": "Loop accounts; if balanceType === 'DEBIT_BALANCE', add to totalDebit; if 'CREDIT_BALANCE', add to totalCredit; return { totalDebit, totalCredit, isBalanced: totalDebit === totalCredit }.",
    "aTest": "const accs = [{ balanceType: 'DEBIT_BALANCE', closingBalance: 50000 }, { balanceType: 'CREDIT_BALANCE', closingBalance: 50000 }];\nconst summ = extractLedgerSummary(accs);\nif (summ.totalDebit !== 50000 || summ.totalCredit !== 50000 || !summ.isBalanced) throw new Error('Ledger summary extract failed');"
  },
  {
    "day": 5,
    "title": "Milestone 1 Capstone: Global Financial Controller War Room & SEC Form 10-K Consolidation",
    "desc": "Milestone 1: Build a complete double-entry bookkeeping engine: Accounting equation validation, Golden Rules classification, multi-line compound journal entries, and automated general ledger posting and balancing.",
    "syllabus": [
      "Double-entry bookkeeping lifecycle synthesis.",
      "Automated journal-to-ledger posting pipeline.",
      "General ledger trial balance readiness audit."
    ],
    "eTitle": "Double-Entry Bookkeeping & Ledger Master Kernel",
    "eDesc": "Implement function `executeBookkeepingMasterKernel(transactions)` journalizing and posting transactions into balanced ledger accounts. Return `{ totalTransactionsProcessed: number, cumulativeDebits: number, cumulativeCredits: number, booksBalanced: boolean, engineStatus: 'BOOKKEEPING_MASTER_KERNEL_ACTIVE_NOMINAL' }`.",
    "eStarter": "/**\n * Processes a batch of double-entry transactions and verifies ledger trial integrity.\n * \n * @param {Array<{ drAmount: number, crAmount: number }>} transactions - Batch of transactions\n * @returns {{\n *   totalTransactionsProcessed: number,\n *   cumulativeDebits: number,\n *   cumulativeCredits: number,\n *   booksBalanced: boolean,\n *   engineStatus: 'BOOKKEEPING_MASTER_KERNEL_ACTIVE_NOMINAL'\n * }} Master bookkeeping engine report\n */\nfunction executeBookkeepingMasterKernel(transactions) {\n  // TODO: Process array of transactions and compute cumulative totals and balance integrity\n  \n}",
    "eHint": "Iterate transactions summing drAmount and crAmount; check isBalanced = Math.abs(totalDr - totalCr) < 0.01; return { totalTransactionsProcessed: transactions.length, cumulativeDebits: totalDr, cumulativeCredits: totalCr, booksBalanced: isBalanced, engineStatus: 'BOOKKEEPING_MASTER_KERNEL_ACTIVE_NOMINAL' }.",
    "eTest": "const txs = [{ drAmount: 10000, crAmount: 10000 }, { drAmount: 5000, crAmount: 5000 }];\nconst res = executeBookkeepingMasterKernel(txs);\nif (!res.booksBalanced || res.cumulativeDebits !== 15000 || res.engineStatus !== 'BOOKKEEPING_MASTER_KERNEL_ACTIVE_NOMINAL') throw new Error('Milestone 1 kernel balanced check failed');\nconst badTxs = [{ drAmount: 10000, crAmount: 9000 }];\nconst badRes = executeBookkeepingMasterKernel(badTxs);\nif (badRes.booksBalanced) throw new Error('Imbalanced transactions accepted by kernel');\nconst emptyRes = executeBookkeepingMasterKernel([]);\nif (emptyRes.totalTransactionsProcessed !== 0 || !emptyRes.booksBalanced) throw new Error('Empty transactions batch failed');",
    "aTitle": "Ledger Account Batch Settlement Auditor",
    "aDesc": "Implement function `auditBatchSettlement(openingBalances, journalTransactions)` computing updated closing balances across customer and vendor sub-ledgers. Return updated balance map `{ [accountName: string]: number }`.",
    "aStarter": "/**\n * Audits and updates sub-ledger account balances based on transaction batch.\n * \n * @param {Record<string, number>} openBalances - Opening account balances\n * @param {Array<{ account: string, dr: number, cr: number }>} transactions - Journal transactions\n * @returns {Record<string, number>} Updated closing balances by account\n */\nfunction auditBatchSettlement(openBalances, transactions) {\n  // TODO: Update each customer/vendor opening balance by applying debits and credits\n  \n}",
    "aHint": "Clone openingBalances map; for each tx, add debitAmount and subtract creditAmount for the target account; return updated balances map.",
    "aTest": "const open = { 'Sharma': 10000, 'Gupta': -5000 };\nconst txs = [{ account: 'Sharma', dr: 2000, cr: 5000 }]; // 10k + 2k - 5k = 7k\nconst res = auditBatchSettlement(open, txs);\nif (res['Sharma'] !== 7000 || res['Gupta'] !== -5000) throw new Error('Batch settlement audit failed');"
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
    "eDesc": "Implement function `balanceCashBook(cashReceipts, cashPayments, bankReceipts, bankPayments, contraTransfers)` calculating closing cash and bank balances. Return `{ closingCashBalance: number, closingBankBalance: number }`.",
    "eStarter": "/**\n * Balances a 3-column cash book incorporating cash and bank contra transfers.\n * \n * @param {number} cIn - Total cash receipts\n * @param {number} cOut - Total cash payments\n * @param {number} bIn - Total bank deposits/receipts\n * @param {number} bOut - Total bank withdrawals/payments\n * @param {Array<{ type: 'CASH_DEPOSITED_TO_BANK' | 'CASH_WITHDRAWN_FROM_BANK', amount: number }>} contra - Contra transfers\n * @returns {{\n *   closingCashBalance: number,\n *   closingBankBalance: number\n * }} Reconciled closing balances\n */\nfunction balanceCashBook(cIn, cOut, bIn, bOut, contra) {\n  // TODO: Calculate net cash and bank balances and apply contra deposits and withdrawals\n  \n}",
    "eHint": "Initialize cash = cIn - cOut, bank = bIn - bOut. For each contra transfer: if 'CASH_DEPOSITED_TO_BANK', cash -= amount and bank += amount; if 'CASH_WITHDRAWN_FROM_BANK', cash += amount and bank -= amount. Return closing balances.",
    "eTest": "const res = balanceCashBook(50000, 10000, 100000, 20000, [{ type: 'CASH_DEPOSITED_TO_BANK', amount: 15000 }]);\nif (res.closingCashBalance !== 25000 || res.closingBankBalance !== 95000) throw new Error('Cash book deposit contra failed');\nconst res2 = balanceCashBook(10000, 2000, 50000, 5000, [{ type: 'CASH_WITHDRAWN_FROM_BANK', amount: 4000 }]);\nif (res2.closingCashBalance !== 12000 || res2.closingBankBalance !== 41000) throw new Error('Cash book withdrawal contra failed');\nconst noContra = balanceCashBook(20000, 5000, 30000, 10000, []);\nif (noContra.closingCashBalance !== 15000 || noContra.closingBankBalance !== 20000) throw new Error('No contra balance failed');",
    "aTitle": "Petty Cash Imprest Float Replenishment Calculator",
    "aDesc": "Implement function `calculatePettyCashReplenishment(floatAmount, expenseVouchers)` computing total expenses incurred, remaining cash, and reimbursement needed to restore float. Return `{ totalSpent: number, remainingCash: number, replenishmentNeeded: number }`.",
    "aStarter": "/**\n * Calculates petty cash imprest float replenishment.\n * \n * @param {number} floatAmount - Designated imprest float ceiling\n * @param {Array<{ item: string, amount: number }>} expenseVouchers - Petty expense receipts\n * @returns {{\n *   totalSpent: number,\n *   remainingCash: number,\n *   replenishmentNeeded: number\n * }} Imprest reimbursement report\n */\nfunction calculatePettyCashReplenishment(floatAmount, expenseVouchers) {\n  // TODO: Sum expense vouchers and calculate reimbursement needed to restore imprest float\n  \n}",
    "aHint": "Sum voucher amounts: totalSpent = expenseVouchers.reduce((s, v) => s + v.amount, 0); remainingCash = floatAmount - totalSpent; replenishmentNeeded = totalSpent.",
    "aTest": "const p = calculatePettyCashReplenishment(5000, [{ item: 'Postage', amount: 450 }, { item: 'Tea', amount: 350 }]);\nif (p.totalSpent !== 800 || p.remainingCash !== 4200 || p.replenishmentNeeded !== 800) throw new Error('Petty cash replenishment failed');"
  },
  {
    "day": 7,
    "title": "Subsidiary Day Books: Purchase, Sales, Returns & Bills Books",
    "desc": "Maintain specialized day books for credit transactions: Purchases Book (Inward Invoice), Sales Book (Outward Invoice), Purchase Returns (Debit Note), Sales Returns (Credit Note), and Bills of Exchange registers.",
    "syllabus": [
      "Credit Transaction Recording: Excluding cash transactions from subsidiary day books.",
      "Debit Notes vs Credit Notes: Accounting for returns outwards and returns inwards.",
      "Trade Discount Treatment: Recording invoices net of trade discounts in subsidiary books."
    ],
    "eTitle": "Subsidiary Day Books Net Turnover Aggregator",
    "eDesc": "Implement function `aggregateSubsidiaryBooks(purchases, sales, purchaseReturns, salesReturns)` computing net purchases and net sales. Return `{ netPurchases: number, netSales: number }`.",
    "eStarter": "/**\n * Computes net purchases and net sales across subsidiary day books.\n * \n * @param {Array<{ amount: number }>} purchases - Purchases day book lines\n * @param {Array<{ amount: number }>} sales - Sales day book lines\n * @param {Array<{ amount: number }>} pReturns - Purchase returns day book lines\n * @param {Array<{ amount: number }>} sReturns - Sales returns day book lines\n * @returns {{\n *   netPurchases: number,\n *   netSales: number\n * }} Net subsidiary turnover summary\n */\nfunction aggregateSubsidiaryBooks(purchases, sales, pReturns, sReturns) {\n  // TODO: Sum each book and compute net purchases (purchases - returns) and net sales\n  \n}",
    "eHint": "Sum each array with reduce: totalPurchases, totalSales, totalPReturns, totalSReturns; netPurchases = totalPurchases - totalPReturns; netSales = totalSales - totalSReturns.",
    "eTest": "const res = aggregateSubsidiaryBooks([{ amount: 50000 }], [{ amount: 80000 }], [{ amount: 5000 }], [{ amount: 8000 }]);\nif (res.netPurchases !== 45000 || res.netSales !== 72000) throw new Error('Net subsidiary books aggregation failed');\nconst empty = aggregateSubsidiaryBooks([], [], [], []);\nif (empty.netPurchases !== 0 || empty.netSales !== 0) throw new Error('Empty subsidiary books failed');\nconst noRet = aggregateSubsidiaryBooks([{ amount: 10000 }], [{ amount: 20000 }], [], []);\nif (noRet.netPurchases !== 10000 || noRet.netSales !== 20000) throw new Error('Zero returns aggregation failed');",
    "aTitle": "Trade Debtor & Creditor Ledger Posting Calculator",
    "aDesc": "Implement function `calculateTradeLedgerTotals(openingDebtors, creditSales, collections, salesReturns)` computing closing accounts receivable balance. Return `{ closingDebtors: number }`.",
    "aStarter": "/**\n * Computes closing accounts receivable from trade debtor transactions.\n * \n * @param {number} openDebtors - Opening accounts receivable balance\n * @param {number} sales - Total credit sales\n * @param {number} collections - Cash collected from debtors\n * @param {number} sReturns - Sales returns credit notes\n * @returns {{\n *   closingDebtors: number\n * }} Closing trade receivables balance\n */\nfunction calculateTradeLedgerTotals(openDebtors, sales, collections, sReturns) {\n  // TODO: Compute closing trade receivables by adding credit sales and subtracting collections and returns\n  \n}",
    "aHint": "closingDebtors = openDebtors + sales - collections - sReturns; return { closingDebtors, turnoverRatio: sales / ((openDebtors + closingDebtors) / 2) }.",
    "aTest": "const t = calculateTradeLedgerTotals(100000, 400000, 350000, 10000);\nif (t.closingDebtors !== 140000) throw new Error('Trade receivables ledger total failed');"
  },
  {
    "day": 8,
    "title": "Bank Reconciliation Statement (BRS): Timing & Error Adjustments",
    "desc": "Reconcile differences between the Cash Book Bank Column and the Bank Pass Book / Statement: Cheques issued but not presented, cheques deposited but not cleared, direct bank debits/credits, and bank interest.",
    "syllabus": [
      "Causes of Disagreement: Timing differences vs clerical posting errors.",
      "Unpresented Cheques: Added to Cash Book to reach Pass Book balance.",
      "Uncredited Cheques: Deducted from Cash Book to reach Pass Book balance."
    ],
    "eTitle": "Bank Reconciliation Statement (BRS) Adjuster",
    "eDesc": "Implement function `calculateBRS(cashBookBalance, unpresentedCheques, uncreditedDeposits, bankCharges, directCredits)` computing passbook balance and status. Return `{ passBookBalance: number, status: 'BRS_RECONCILED_SUCCESSFULLY' }`.",
    "eStarter": "/**\n * Reconciles cash book ledger balance to bank statement passbook balance.\n * \n * @param {number} cashBookBalance - Balance per company cash book\n * @param {number} unpresentedCheques - Cheques issued but not yet presented at bank (+)\n * @param {number} uncreditedDeposits - Cheques paid into bank but not yet credited (-)\n * @param {number} bankCharges - Bank debits/charges not entered in cash book (-)\n * @param {number} directCredits - Customer deposits directly into bank (+)\n * @returns {{\n *   passBookBalance: number,\n *   status: 'BRS_RECONCILED_SUCCESSFULLY'\n * }} Bank reconciliation result\n */\nfunction calculateBRS(cashBookBalance, unpresentedCheques, uncreditedDeposits, bankCharges, directCredits) {\n  // TODO: Adjust cash book balance for timing differences to compute bank statement passbook balance\n  \n}",
    "eHint": "Compute adjustedBalance = cashBook + unpresented - uncredited - bankCharges + directDeposits; return { initialCashBook: cashBook, passBookBalance: adjustedBalance, status: 'BRS_RECONCILED_SUCCESSFULLY' }.",
    "eTest": "const res = calculateBRS(100000, 25000, 15000, 2000, 12000); // 100k + 25k - 15k - 2k + 12k = 120,000\nif (res.passBookBalance !== 120000 || res.status !== 'BRS_RECONCILED_SUCCESSFULLY') throw new Error('BRS standard reconciliation failed');\nconst res2 = calculateBRS(50000, 0, 10000, 0, 0);\nif (res2.passBookBalance !== 40000) throw new Error('Uncredited cheques subtraction failed');\nconst res3 = calculateBRS(0, 5000, 0, 0, 0);\nif (res3.passBookBalance !== 5000) throw new Error('Zero cash book balance reconciliation failed');",
    "aTitle": "Overdraft Bank Reconciliation Calculator",
    "aDesc": "Implement function `reconcileOverdraftBRS(odCashBook, unpresented, uncredited, interest)` reconciling unfavorable cash book balance to bank overdraft statement balance. Return `{ passBookOverdraft: number }`.",
    "aStarter": "/**\n * Reconciles an overdraft cash book balance to the bank overdraft statement.\n * \n * @param {number} odCashBook - Unfavorable cash book overdraft balance\n * @param {number} unpresented - Unpresented cheques\n * @param {number} uncredited - Uncredited deposits\n * @param {number} interest - Bank overdraft interest debited by bank\n * @returns {{\n *   passBookOverdraft: number\n * }} Reconciled bank overdraft figure\n */\nfunction reconcileOverdraftBRS(odCashBook, unpresented, uncredited, interest) {\n  // TODO: Reconcile unfavorable cash book balance to bank overdraft statement balance\n  \n}",
    "aHint": "Treat overdraft as negative cash: passBook = (-odCashBook) + unpresented - uncredited - interest; return { passBookOverdraft: -passBook }.",
    "aTest": "const od = reconcileOverdraftBRS(20000, 5000, 8000, 1000); // -20k + 5k - 8k - 1k = -24k OD\nif (od.passBookOverdraft !== 24000) throw new Error('Overdraft BRS reconciliation failed');"
  },
  {
    "day": 9,
    "title": "Trial Balance: Arithmetic Accuracy Checksum & Detection of Errors",
    "desc": "Prepare the Trial Balance to prove the arithmetic accuracy of double-entry ledger postings: Debit balance totals, Credit balance totals, agreement proof, and identifying errors that the Trial Balance does NOT reveal.",
    "syllabus": [
      "Trial Balance Mechanics: Extracting closing balances of all personal, real, and nominal accounts.",
      "Errors Disclosed: One-sided casting errors, partial postings, and posting to the wrong side.",
      "Errors Not Disclosed: Errors of Omission, Commission, Principle, and Compensating Errors."
    ],
    "eTitle": "Trial Balance Debit-Credit Checksum Validator",
    "eDesc": "Implement function `validateTrialBalance(ledgerBalances)` summing debit and credit balances and verifying trial balance agreement. Return `{ isMatched: boolean, totalDebits: number, trialBalanceChecksum: 'TRIAL_BALANCE_AGREED_NOMINAL' | 'TRIAL_BALANCE_DISAGREED_VARIANCE', differenceAmount: number }`.",
    "eStarter": "/**\n * Validates trial balance debit and credit equality.\n * \n * @param {Array<{ name: string, dr: number, cr: number }>} ledgerBalances - Account ledger balances\n * @returns {{\n *   isMatched: boolean,\n *   totalDebits: number,\n *   trialBalanceChecksum: 'TRIAL_BALANCE_AGREED_NOMINAL' | 'TRIAL_BALANCE_DISAGREED_VARIANCE',\n *   differenceAmount: number\n * }} Trial balance verification report\n */\nfunction validateTrialBalance(ledgerBalances) {\n  // TODO: Sum debit and credit balances and determine agreement and difference amount\n  \n}",
    "eHint": "Iterate ledgerBalances; accumulate debits and credits; check isMatched = Math.abs(totalDr - totalCr) < 0.01; diff = Math.abs(totalDr - totalCr).",
    "eTest": "const b = [{ name: 'Cash', dr: 50000, cr: 0 }, { name: 'Capital', dr: 0, cr: 50000 }];\nconst res = validateTrialBalance(b);\nif (!res.isMatched || res.totalDebits !== 50000 || res.trialBalanceChecksum !== 'TRIAL_BALANCE_AGREED_NOMINAL') throw new Error('Agreed trial balance failed');\nconst bad = [{ name: 'Cash', dr: 50000, cr: 0 }, { name: 'Capital', dr: 0, cr: 45000 }];\nconst badRes = validateTrialBalance(bad);\nif (badRes.isMatched || badRes.differenceAmount !== 5000) throw new Error('Disagreed trial balance detection failed');\nconst empty = validateTrialBalance([]);\nif (!empty.isMatched || empty.totalDebits !== 0) throw new Error('Empty trial balance failed');",
    "aTitle": "One-Sided Ledger Posting Error Estimator",
    "aDesc": "Implement function `estimateTrialBalanceDifference(correctAmount, postedAmount, isDebitSide)` calculating variance and affected side. Return `{ variance: number, affectedSide: 'DEBIT' | 'CREDIT' }`.",
    "aStarter": "/**\n * Estimates trial balance variance caused by a one-sided posting error.\n * \n * @param {number} correctAmount - Correct transaction amount\n * @param {number} postedAmount - Mistakenly posted amount\n * @param {boolean} isDebitSide - Whether error occurred on debit side\n * @returns {{\n *   variance: number,\n *   affectedSide: 'DEBIT' | 'CREDIT'\n * }} Trial balance error diagnostic\n */\nfunction estimateTrialBalanceDifference(correctAmount, postedAmount, isDebitSide) {\n  // TODO: Calculate the trial balance variance caused by a posting error on debit or credit side\n  \n}",
    "aHint": "variance = Math.abs(correctAmount - postedAmount); return { variance, affectedSide: isDebitSide ? 'DEBIT' : 'CREDIT' }.",
    "aTest": "const diff = estimateTrialBalanceDifference(5000, 500, true);\nif (diff.variance !== 4500 || diff.affectedSide !== 'DEBIT') throw new Error('Trial balance variance estimate failed');"
  },
  {
    "day": 10,
    "title": "Milestone 2 Capstone: Rectification of Errors, Suspense Account & Internal Controls",
    "desc": "Locate and rectify pre-trial and post-trial balance errors: Rectifying journal entries, Suspense Account creation, clearing one-sided posting errors, and adjusting final profit.",
    "syllabus": [
      "Error Classification: Errors before trial balance vs after trial balance preparation.",
      "Suspense Account Mechanics: Temporary ledger head to absorb trial balance debit/credit mismatch.",
      "Profit & Loss Adjustment Account: Rectifying prior period errors affecting nominal heads."
    ],
    "eTitle": "Suspense Account Variance Rectification Engine",
    "eDesc": "Implement function `rectifyErrorsViaSuspense(initialSuspenseBalance, errorCorrections)` applying rectifying adjustments to clear the suspense account. Return `{ isCleared: boolean, closingSuspenseBalance: number }`.",
    "eStarter": "/**\n * Rectifies trial balance errors through the suspense account until balance is nil.\n * \n * @param {number} initialSuspense - Initial suspense account balance\n * @param {Array<{ type: 'DEBIT_SUSPENSE' | 'CREDIT_SUSPENSE', amount: number }>} corrections - Rectifying entries\n * @returns {{\n *   isCleared: boolean,\n *   closingSuspenseBalance: number\n * }} Suspense account rectification report\n */\nfunction rectifyErrorsViaSuspense(initialSuspense, corrections) {\n  // TODO: Apply debit and credit adjustments to suspense account and determine if cleared to zero\n  \n}",
    "eHint": "Start with balance = initialSuspense; for each correction: if 'DEBIT_SUSPENSE', balance -= amount; if 'CREDIT_SUSPENSE', balance += amount; check isCleared = Math.abs(balance) < 0.01.",
    "eTest": "const res = rectifyErrorsViaSuspense(5000, [{ type: 'DEBIT_SUSPENSE', amount: 5000 }]); // Cr 5000 cleared by Dr 5000\nif (!res.isCleared || res.closingSuspenseBalance !== 0) throw new Error('Suspense clearance failed');\nconst partial = rectifyErrorsViaSuspense(5000, [{ type: 'DEBIT_SUSPENSE', amount: 2000 }]);\nif (partial.isCleared || partial.closingSuspenseBalance !== 3000) throw new Error('Partial suspense check failed');\nconst zero = rectifyErrorsViaSuspense(0, []);\nif (!zero.isCleared) throw new Error('Zero initial suspense failed');",
    "aTitle": "Compensating Error Net Profit Impact Calculator",
    "aDesc": "Implement function `calculateCompensatingErrorEffect(underCastSales, overCastPurchases)` determining net impact on reported gross profit. Return `{ profitUnderstatement: number, requiresAdjustment: boolean }`.",
    "aStarter": "/**\n * Calculates compounding effect of compensating errors on reported gross profit.\n * \n * @param {number} underSales - Amount by which sales book was under-cast\n * @param {number} overPurch - Amount by which purchases book was over-cast\n * @returns {{\n *   profitUnderstatement: number,\n *   requiresAdjustment: boolean\n * }} Compensating error impact analysis\n */\nfunction calculateCompensatingErrorEffect(underSales, overPurch) {\n  // TODO: Calculate how under-cast sales and over-cast purchases compound on profit\n  \n}",
    "aHint": "profitUnderstatement = underSales + overPurch; return { profitUnderstatement, requiresAdjustment: profitUnderstatement > 0 }.",
    "aTest": "const eff = calculateCompensatingErrorEffect(3000, 2000);\nif (eff.profitUnderstatement !== 5000 || !eff.requiresAdjustment) throw new Error('Compensating error effect failed');"
  },
  {
    "day": 11,
    "title": "Depreciation Accounting: Straight Line (SLM) vs Written Down Value (WDV)",
    "desc": "Calculate asset depreciation: Straight Line Method (Fixed Installment), Written Down Value Method (Reducing Balance), accounting for salvage value, useful life, and asset disposal accounting.",
    "syllabus": [
      "Causes of Depreciation: Physical wear and tear, passage of time, obsolescence, and depletion.",
      "Straight Line Method (SLM): Constant annual charge = (Cost - Scrap) / Useful Life.",
      "Written Down Value (WDV): Decreasing annual charge on opening book value."
    ],
    "eTitle": "Depreciation Schedule Generator (SLM vs WDV)",
    "eDesc": "Implement function `generateDepreciationSchedule(cost, salvage, lifeYears, wdvRatePct, periods)` comparing SLM vs WDV book values. Return `{ slmAnnualDepreciation: number, wdvYear1BookValue?: number, wdvYear2BookValue?: number }`.",
    "eStarter": "/**\n * Generates comparative depreciation schedules under Straight Line and WDV methods.\n * \n * @param {number} cost - Original asset historical acquisition cost\n * @param {number} salvage - Estimated residual scrap value\n * @param {number} lifeYears - Useful economic asset life in years\n * @param {number} wdvRatePct - Written Down Value percentage depreciation rate\n * @param {number} periods - Number of projection periods\n * @returns {{\n *   slmAnnualDepreciation: number,\n *   wdvYear1BookValue?: number,\n *   wdvYear2BookValue?: number\n * }} Depreciation comparison schedule\n */\nfunction generateDepreciationSchedule(cost, salvage, lifeYears, wdvRatePct, periods) {\n  // TODO: Compute annual SLM depreciation and year-by-year WDV depreciation schedule\n  \n}",
    "eHint": "annualSlm = (cost - salvage) / lifeYears; track wdvBookValue starting at cost; for each period wdvDep = wdvBookValue * (wdvRatePct / 100), wdvBookValue -= wdvDep.",
    "eTest": "const res = generateDepreciationSchedule(100000, 10000, 5, 20, 2); // SLM = (100k-10k)/5 = 18k/yr. WDV Y1=20k (BV=80k), Y2=16k (BV=64k)\nif (res.slmAnnualDepreciation !== 18000 || res.wdvYear2BookValue !== 64000) throw new Error('Depreciation schedule failed');\nconst single = generateDepreciationSchedule(50000, 0, 10, 10, 1);\nif (single.slmAnnualDepreciation !== 5000 || single.wdvYear1BookValue !== 45000) throw new Error('Single period depreciation failed');\nconst zeroDep = generateDepreciationSchedule(10000, 10000, 5, 0, 1);\nif (zeroDep.slmAnnualDepreciation !== 0) throw new Error('Zero depreciation calculation failed');",
    "aTitle": "Asset Disposal Profit and Loss Calculator",
    "aDesc": "Implement function `calculateAssetDisposalGainLoss(originalCost, accumulatedDepreciation, saleProceeds)` computing book value, net gain or loss on sale, and gain status. Return `{ bookValue: number, profitOnSale: number, isGain: boolean }`.",
    "aStarter": "/**\n * Calculates gain or loss upon disposal of fixed capital assets.\n * \n * @param {number} cost - Original historical cost\n * @param {number} accDep - Cumulative accumulated depreciation to disposal date\n * @param {number} proceeds - Net cash proceeds realized from asset sale\n * @returns {{\n *   bookValue: number,\n *   profitOnSale: number,\n *   isGain: boolean\n * }} Asset disposal financial outcome\n */\nfunction calculateAssetDisposalGainLoss(cost, accDep, proceeds) {\n  // TODO: Compute written down value and determine profit or loss on disposal\n  \n}",
    "aHint": "bookValue = originalCost - accumulatedDepreciation; profitOnSale = saleProceeds - bookValue; return { bookValue, profitOnSale, isGain: profitOnSale >= 0 }.",
    "aTest": "const d = calculateAssetDisposalGainLoss(100000, 60000, 45000); // BV = 40k, Sale = 45k -> Gain = +5k\nif (d.bookValue !== 40000 || d.profitOnSale !== 5000 || !d.isGain) throw new Error('Disposal gain calculation failed');"
  },
  {
    "day": 12,
    "title": "Financial Statements: Trading Account & Gross Profit Computation",
    "desc": "Construct the Trading Account to determine direct operating profitability: Opening Stock, Net Purchases, Direct Wages, Freight/Carriage Inwards, Net Sales, Closing Stock, and Gross Profit / Loss.",
    "syllabus": [
      "Purpose of Trading Account: Measuring core gross manufacturing and trading margin.",
      "Cost of Goods Sold (COGS): Opening Stock + Adjusted Purchases + Direct Expenses - Closing Stock.",
      "Gross Profit Equation: Gross Profit = Net Revenue from Operations - Cost of Goods Sold."
    ],
    "eTitle": "Trading Account Gross Profit Engine",
    "eDesc": "Implement function `calculateGrossProfit(openingStock, purchases, purchaseReturns, directExpenses, sales, salesReturns, closingStock)` calculating COGS and Gross Profit. Return `{ costOfGoodsSold: number, grossProfit: number }`.",
    "eStarter": "/**\n * Computes Cost of Goods Sold (COGS) and Gross Profit for trading account.\n * \n * @param {number} openStock - Beginning merchandise inventory\n * @param {number} purch - Gross purchases\n * @param {number} pRet - Purchase returns & allowances\n * @param {number} directExp - Direct manufacturing/inward freight expenses\n * @param {number} sales - Gross sales turnover\n * @param {number} sRet - Sales returns\n * @param {number} closeStock - Physical closing inventory at period end\n * @returns {{\n *   costOfGoodsSold: number,\n *   grossProfit: number\n * }} Trading statement margins\n */\nfunction calculateGrossProfit(openStock, purch, pRet, directExp, sales, sRet, closeStock) {\n  // TODO: Compute COGS = Opening + Net Purchases + Direct Expenses - Closing; Gross Profit = Net Sales - COGS\n  \n}",
    "eHint": "netPurch = purch - pRet; netSales = sales - sRet; cogs = openStock + netPurch + directExp - closeStock; gp = netSales - cogs; gpMargin = (gp / netSales) * 100.",
    "eTest": "const res = calculateGrossProfit(50000, 200000, 10000, 20000, 350000, 15000, 60000);\n// NetPurch = 190k, NetSales = 335k, COGS = 50k + 190k + 20k - 60k = 200k. GP = 335k - 200k = 135k\nif (res.costOfGoodsSold !== 200000 || res.grossProfit !== 135000) throw new Error('Gross profit calculation failed');\nconst lossRes = calculateGrossProfit(50000, 200000, 0, 10000, 200000, 0, 30000); // COGS = 230k, Sales = 200k -> GP = -30k\nif (lossRes.grossProfit !== -30000) throw new Error('Gross loss calculation failed');\nconst zeroCOGS = calculateGrossProfit(0, 0, 0, 0, 10000, 0, 0);\nif (zeroCOGS.grossProfit !== 10000) throw new Error('Pure margin calculation failed');",
    "aTitle": "Cost of Goods Sold (COGS) & Markup Margin Calculator",
    "aDesc": "Implement function `calculateCOGSAndMargin(netSales, grossProfit)` computing COGS, Gross Profit Margin %, and Cost Markup %. Return `{ cogs: number, marginPct: number, markupPct: number }`.",
    "aStarter": "/**\n * Calculates Cost of Goods Sold, Gross Margin percentage, and Markup on cost.\n * \n * @param {number} netSales - Net sales revenue\n * @param {number} grossProfit - Gross profit\n * @returns {{\n *   cogs: number,\n *   marginPct: number,\n *   markupPct: number\n * }} Margin and markup analysis\n */\nfunction calculateCOGSAndMargin(netSales, grossProfit) {\n  // TODO: Compute COGS = netSales - grossProfit, margin = GP/Sales, markup = GP/COGS\n  \n}",
    "aHint": "cogs = netSales - grossProfit; marginPct = (grossProfit / netSales) * 100; markupPct = (grossProfit / cogs) * 100; return { cogs, marginPct, markupPct }.",
    "aTest": "const m = calculateCOGSAndMargin(100000, 25000); // COGS = 75k, Margin = 25%, Markup = 33.33%\nif (m.cogs !== 75000 || m.marginPct !== 25 || Math.round(m.markupPct) !== 33) throw new Error('Margin and markup calculation failed');"
  },
  {
    "day": 13,
    "title": "Financial Statements: Profit & Loss Statement & Net Operating Income Calculation",
    "desc": "Prepare the Profit & Loss Statement to compute final business earnings: Operating Expenses (Admin, Selling & Distribution), Non-Operating Incomes/Expenses, Tax Provisions, and Net Profit After Tax.",
    "syllabus": [
      "Structure of P&L Statement: Credit side for Gross Profit + Incomes; Debit side for Operating/Financial Expenses.",
      "Operating Profit vs Net Profit: Distinguishing core operational margin from non-operating items.",
      "Tax Provisioning: Charging corporate/business tax before transferring profit to Capital A/c."
    ],
    "eTitle": "Profit & Loss Net Income & Operating Margin Engine",
    "eDesc": "Implement function `calculateNetProfit(grossProfit, operatingExpenses, otherIncome, interestExpense, taxRatePct)` computing operating profit, profit before tax, and net profit after tax. Return `{ operatingProfit: number, profitBeforeTax: number, netProfitAfterTax: number }`.",
    "eStarter": "/**\n * Computes operating profit, profit before tax (PBT), and net profit after tax (PAT).\n * \n * @param {number} grossProfit - Gross profit from trading operations\n * @param {number} operatingExpenses - Administrative and selling overheads\n * @param {number} otherIncome - Non-operating secondary income\n * @param {number} interestExpense - Debt borrowing finance costs\n * @param {number} taxRatePct - Applicable corporate tax rate percentage\n * @returns {{\n *   operatingProfit: number,\n *   profitBeforeTax: number,\n *   netProfitAfterTax: number\n * }} Profit & Loss summary report\n */\nfunction calculateNetProfit(grossProfit, operatingExpenses, otherIncome, interestExpense, taxRatePct) {\n  // TODO: operatingProfit = grossProfit - operatingExpenses; PBT = operatingProfit + otherIncome - interestExpense; tax = PBT > 0 ? PBT * (taxRatePct / 100) : 0; netProfitAfterTax = PBT - tax\n  \n}",
    "eHint": "operatingProfit = gp - opExp; profitBeforeTax = operatingProfit + nonOpInc - nonOpExp; taxAmount = Math.max(0, profitBeforeTax * (taxPct / 100)); netProfitAfterTax = profitBeforeTax - taxAmount.",
    "eTest": "const res = calculateNetProfit(150000, 50000, 10000, 5000, 25); // Op = 100k, PBT = 105k, Tax = 26,250, PAT = 78,750\nif (res.operatingProfit !== 100000 || res.profitBeforeTax !== 105000 || res.netProfitAfterTax !== 78750) throw new Error('Net profit calculation failed');\nconst zeroTax = calculateNetProfit(100000, 40000, 0, 0, 0);\nif (zeroTax.netProfitAfterTax !== 60000) throw new Error('Zero tax P&L failed');\nconst lossPnl = calculateNetProfit(20000, 50000, 0, 0, 25);\nif (lossPnl.profitBeforeTax !== -30000 || lossPnl.netProfitAfterTax !== -30000) throw new Error('Loss P&L tax zeroing failed');",
    "aTitle": "Operating Expense Ratio & Profitability Analyzer",
    "aDesc": "Implement function `calculateExpenseRatios(sales, adminExp, sellingExp, financeExp)` computing individual and operating expense ratios. Return `{ adminRatio: number, sellingRatio: number, totalOperatingRatio: number }`.",
    "aStarter": "/**\n * Computes administrative, selling, and total operating expense ratios relative to turnover.\n * \n * @param {number} sales - Net turnover revenue\n * @param {number} adminExp - Administrative expenses\n * @param {number} sellingExp - Selling & distribution overheads\n * @param {number} financeExp - Finance and interest charges\n * @returns {{\n *   adminRatio: number,\n *   sellingRatio: number,\n *   totalOperatingRatio: number\n * }} Operating expense ratio metrics\n */\nfunction calculateExpenseRatios(sales, adminExp, sellingExp, financeExp) {\n  // TODO: Compute adminRatio = (adminExp / sales) * 100, sellingRatio = (sellingExp / sales) * 100, totalOperatingRatio = ((adminExp + sellingExp) / sales) * 100\n  \n}",
    "aHint": "adminRatio = (adminExp / revenue) * 100; sellingRatio = (sellExp / revenue) * 100; totalOperatingRatio = ((adminExp + sellExp) / revenue) * 100.",
    "aTest": "const r = calculateExpenseRatios(500000, 50000, 25000, 10000);\nif (r.adminRatio !== 10 || r.sellingRatio !== 5 || r.totalOperatingRatio !== 15) throw new Error('Expense ratio calculation failed');"
  },
  {
    "day": 14,
    "title": "Financial Statements: Balance Sheet Marshalling & Working Capital",
    "desc": "Assemble the Balance Sheet presenting the financial position at a specific date: Marshalling of Assets and Liabilities (Order of Liquidity vs Order of Permanence) and Working Capital analysis.",
    "syllabus": [
      "Balance Sheet Architecture: Assets (Non-Current, Current) vs Liabilities (Owner Capital, Non-Current, Current).",
      "Marshalling Orders: Liquidity order (for sole proprietors/banks) vs Permanence order (for corporate entities).",
      "Net Working Capital Equation: $NWC = Current Assets - Current Liabilities$."
    ],
    "eTitle": "Marshalling Balance Sheet & Net Working Capital Classifier",
    "eDesc": "Implement function `marshalBalanceSheet(currentAssets, nonCurrentAssets, currentLiabilities, nonCurrentLiabilities, equity)` computing Net Working Capital and verifying balance sheet equality. Return `{ isBalanced: boolean, totalAssets: number, netWorkingCapital: number }`.",
    "eStarter": "/**\n * Marshals balance sheet sections and verifies fundamental asset-liability equality.\n * \n * @param {number} ca - Current Assets\n * @param {number} nca - Non-Current (Fixed & Intangible) Assets\n * @param {number} cl - Current Liabilities\n * @param {number} ncl - Non-Current Long-Term Liabilities\n * @param {number} eq - Shareholders' Equity & Reserves\n * @returns {{\n *   isBalanced: boolean,\n *   totalAssets: number,\n *   netWorkingCapital: number\n * }} Marshalled balance sheet verification\n */\nfunction marshalBalanceSheet(ca, nca, cl, ncl, eq) {\n  // TODO: Compute Total Assets, Total Liabilities + Equity, and Net Working Capital (CA - CL)\n  \n}",
    "eHint": "totalAssets = ca + nca; totalLiabEq = cl + ncl + eq; netWorkingCapital = ca - cl; isBalanced = Math.abs(totalAssets - totalLiabEq) < 0.01.",
    "eTest": "const res = marshalBalanceSheet(150000, 350000, 80000, 120000, 300000); // Assets = 500k, Liab+Eq = 500k, NWC = 70k\nif (!res.isBalanced || res.totalAssets !== 500000 || res.netWorkingCapital !== 70000) throw new Error('Balance sheet marshalling failed');\nconst unbal = marshalBalanceSheet(100000, 200000, 50000, 50000, 100000);\nif (unbal.isBalanced) throw new Error('Imbalanced balance sheet check failed');\nconst negWc = marshalBalanceSheet(50000, 250000, 80000, 20000, 200000);\nif (negWc.netWorkingCapital !== -30000) throw new Error('Negative working capital failed');",
    "aTitle": "Working Capital Current Ratio Health Checker",
    "aDesc": "Implement function `evaluateWorkingCapitalHealth(currentAssets, currentLiabilities, quickAssets)` computing Current Ratio and Quick Ratio with financial health status. Return `{ currentRatio: number, quickRatio: number, isHealthy: boolean }`.",
    "aStarter": "/**\n * Evaluates short-term enterprise liquidity and solvency health against standard benchmarks.\n * \n * @param {number} ca - Current Assets\n * @param {number} cl - Current Liabilities\n * @param {number} qa - Quick Assets (Current Assets minus Inventory)\n * @returns {{\n *   currentRatio: number,\n *   quickRatio: number,\n *   isHealthy: boolean\n * }} Liquidity health assessment\n */\nfunction evaluateWorkingCapitalHealth(ca, cl, qa) {\n  // TODO: Compute CR = CA/CL and QR = QA/CL and evaluate against ideal benchmarks (CR >= 1.5, QR >= 1.0)\n  \n}",
    "aHint": "currentRatio = ca / cl; quickRatio = qa / cl; isHealthy = currentRatio >= 2.0 && quickRatio >= 1.0; return { currentRatio, quickRatio, isHealthy }.",
    "aTest": "const h = evaluateWorkingCapitalHealth(200000, 100000, 100000); // CR = 2.0, QR = 1.0\nif (h.currentRatio !== 2.0 || h.quickRatio !== 1.0 || !h.isHealthy) throw new Error('Working capital health evaluation failed');"
  },
  {
    "day": 15,
    "title": "Milestone 3 Capstone: Complete Financial Statements & Year-End Closing Engine",
    "desc": "Milestone 2: Build an end-to-end year-end financial accounting closing engine: Trial balance import, closing adjusting entries (accruals, prepayments, depreciation), Trading A/c, P&L Statement, and Marshalling Balance Sheet.",
    "syllabus": [
      "Year-End Accounting Synthesis: Closing adjustments pipeline.",
      "Trading and Profit & Loss statement integration.",
      "Final Balance Sheet audit verification."
    ],
    "eTitle": "Complete Financial Statements Year-End Closing Master",
    "eDesc": "Implement function `executeYearEndFinancialStatements(trialBalanceData, adjustments)` generating Trading Account, Profit & Loss, and Balance Sheet with closing adjustments. Return `{ grossProfit: number, netProfit: number, status: 'FINANCIAL_STATEMENTS_CLOSED_AND_AUDITED' }`.",
    "eStarter": "/**\n * Executes complete year-end accounting closing and financial statement compilation.\n * \n * @param {{ sales: number, openStock: number, purchases: number, directWages: number, expenses: number }} tb - Trial balance figures\n * @param {{ salesReturns: number, purchReturns: number, closingStock: number, outstandingExp: number, prepaidExp: number }} adj - Year-end adjustments\n * @returns {{\n *   grossProfit: number,\n *   netProfit: number,\n *   status: 'FINANCIAL_STATEMENTS_CLOSED_AND_AUDITED'\n * }} Year-end financial statement closing report\n */\nfunction executeYearEndFinancialStatements(tb, adj) {\n  // TODO: Apply year-end adjustments (closing stock, outstanding expenses, prepaid) and compile complete statements\n  \n}",
    "eHint": "Calculate GP = (tb.sales - adj.salesReturns) - (tb.openStock + tb.purchases - adj.purchReturns + tb.directWages - adj.closingStock). Calculate NetProfit = GP - (tb.expenses + adj.outstandingExp - adj.prepaidExp). Return statements summary.",
    "eTest": "const tb = { sales: 500000, openStock: 60000, purchases: 300000, directWages: 20000, expenses: 80000 };\nconst adj = { salesReturns: 0, purchReturns: 0, closingStock: 80000, outstandingExp: 10000, prepaidExp: 5000 };\nconst res = executeYearEndFinancialStatements(tb, adj);\n// COGS = 60k + 300k + 20k - 80k = 300k. GP = 500k - 300k = 200k. AdjExp = 80k + 10k - 5k = 85k. NetProfit = 200k - 85k = 115k\nif (res.grossProfit !== 200000 || res.netProfit !== 115000) throw new Error('Year-end statements compilation failed');\nconst zeroAdj = executeYearEndFinancialStatements({ sales: 100000, openStock: 0, purchases: 50000, directWages: 0, expenses: 20000 }, { salesReturns: 0, purchReturns: 0, closingStock: 0, outstandingExp: 0, prepaidExp: 0 });\nif (zeroAdj.grossProfit !== 50000 || zeroAdj.netProfit !== 30000) throw new Error('Zero adjustments statements failed');\nif (res.status !== 'FINANCIAL_STATEMENTS_CLOSED_AND_AUDITED') throw new Error('Closing status flag failed');",
    "aTitle": "Balance Sheet Marshalling Order Reorganizer",
    "aDesc": "Implement function `reorganizeBalanceSheetOrder(items, orderType)` sorting asset and liability accounts in order of liquidity ('LIQUIDITY') or permanence ('PERMANENCE'). Return sorted string array of items.",
    "aStarter": "/**\n * Sorts balance sheet accounts in order of liquidity or permanence.\n * \n * @param {string[]} items - Account heads (e.g. ['PLANT', 'CASH', 'STOCK', 'DEBTORS'])\n * @param {'LIQUIDITY' | 'PERMANENCE'} orderType - Marshalling sorting rule\n * @returns {string[]} Sorted accounts array\n */\nfunction reorganizeBalanceSheetOrder(items, orderType) {\n  // TODO: Reorganize asset/liability items according to liquidity (Cash -> Debtors -> Stock -> Plant) or permanence ranking\n  \n}",
    "aHint": "Assign rank: 'CASH'=1, 'DEBTORS'=2, 'STOCK'=3, 'PLANT'=4. If orderType === 'LIQUIDITY', sort by rank ascending; if 'PERMANENCE', sort descending.",
    "aTest": "const items = ['PLANT', 'CASH', 'STOCK', 'DEBTORS'];\nconst sorted = reorganizeBalanceSheetOrder(items, 'LIQUIDITY');\nif (sorted[0] !== 'CASH' || sorted[3] !== 'PLANT') throw new Error('Balance sheet marshalling sort failed');"
  },
  {
    "day": 16,
    "title": "Tally Prime ERP: Company Creation, Chart of Accounts & Masters",
    "desc": "Navigate enterprise ERP accounting in Tally Prime: Company Master creation, Financial Year / Book Beginning configuration, Chart of Accounts, and the 28 pre-defined primary and secondary groups.",
    "syllabus": [
      "Tally Prime Setup: Company creation, Base Currency Symbol (INR), and Financial Year setup.",
      "Pre-Defined Groups: 15 Primary Groups (9 Balance Sheet, 6 P&L) and 13 Sub-Groups.",
      "Ledger Master Configuration: Parent group mapping, mailing details, and opening balances."
    ],
    "eTitle": "Tally Prime Chart of Accounts Group Allocator",
    "eDesc": "Implement function `allocateTallyGroup(ledgerName, category)` returning the standard Tally Prime 28 primary group hierarchy string ('Bank Accounts', 'Sundry Debtors', 'Duties & Taxes', 'Indirect Expenses').",
    "eStarter": "/**\n * Maps ledger masters to standard Tally Prime chart of accounts primary groups.\n * \n * @param {string} ledgerName - Ledger title (e.g. 'HDFC Bank', 'Office Rent')\n * @param {'BANK' | 'CUSTOMER' | 'TAX' | 'SALARY'} category - Operational classification\n * @returns {string} Primary group name ('Bank Accounts' | 'Sundry Debtors' | 'Duties & Taxes' | 'Indirect Expenses')\n */\nfunction allocateTallyGroup(ledgerName, category) {\n  // TODO: Map ledger names and categories to primary Tally Prime groups\n  \n}",
    "eHint": "Map category: 'BANK' -> 'Bank Accounts', 'CUSTOMER' -> 'Sundry Debtors', 'VENDOR' -> 'Sundry Creditors', 'TAX' -> 'Duties & Taxes', 'SALARY' -> 'Indirect Expenses'.",
    "eTest": "if (allocateTallyGroup('HDFC Bank', 'BANK') !== 'Bank Accounts') throw new Error('Bank allocation failed');\nif (allocateTallyGroup('Apex Corp', 'CUSTOMER') !== 'Sundry Debtors') throw new Error('Customer allocation failed');\nif (allocateTallyGroup('GST Payable', 'TAX') !== 'Duties & Taxes') throw new Error('Tax allocation failed');\nif (allocateTallyGroup('Office Rent', 'SALARY') !== 'Indirect Expenses') throw new Error('Expense allocation failed');",
    "aTitle": "Tally Prime Ledger Master Schema Validator",
    "aDesc": "Implement function `validateTallyLedgerMaster(ledgerConfig)` verifying that ledger master definitions contain valid parent groups and opening balances. Return `{ isValid: boolean, configured: boolean }`.",
    "aStarter": "/**\n * Validates Tally Prime ledger master configuration for mandatory schema attributes.\n * \n * @param {{ name: string, parentGroup?: string, openingBalance?: number }} ledgerConfig - Master record\n * @returns {{\n *   isValid: boolean,\n *   configured: boolean\n * }} Schema validity verdict\n */\nfunction validateTallyLedgerMaster(ledgerConfig) {\n  // TODO: Validate ledger name, parent group presence, and opening balance\n  \n}",
    "aHint": "Verify Boolean(ledgerConfig.name) && Boolean(ledgerConfig.parentGroup) && typeof ledgerConfig.openingBalance === 'number'; return { isValid: true, configured: true } or failing object.",
    "aTest": "const v = validateTallyLedgerMaster({ name: 'SBI Bank', parentGroup: 'Bank Accounts', openingBalance: 50000 });\nif (!v.isValid || !v.configured) throw new Error('Valid Tally ledger rejected');\nconst bad = validateTallyLedgerMaster({ name: 'Missing Parent' });\nif (bad.isValid) throw new Error('Invalid Tally ledger accepted');"
  },
  {
    "day": 17,
    "title": "Tally Prime ERP: Voucher Entry & Accounting Workflows",
    "desc": "Execute electronic accounting transactions in Tally Prime: Standard Accounting Vouchers (F4 Contra, F5 Payment, F6 Receipt, F7 Journal, F8 Sales, F9 Purchase), and shortcut workflow automation.",
    "syllabus": [
      "Voucher Keybindings: F4 (Contra), F5 (Payment), F6 (Receipt), F7 (Journal), F8 (Sales), F9 (Purchase).",
      "Voucher Modes: Item Invoice Mode, Accounting Invoice Mode, and As-Voucher (Dr/Cr) Mode.",
      "Post-Dated & Optional Vouchers: Managing provisional and future accounting events."
    ],
    "eTitle": "Tally Prime Voucher Type Selector & Validator",
    "eDesc": "Implement function `processTallyVoucher(voucherType, drAccounts, crAccounts, amount)` verifying voucher rules (F4 Contra, F5 Payment). Return `{ isApproved: boolean, voucherRef: string }` where voucherRef starts with 'VCH_CONTRA' or 'VCH_PAYMENT'.",
    "eStarter": "/**\n * Validates and approves specialized Tally Prime accounting voucher entries.\n * \n * @param {'F4_CONTRA' | 'F5_PAYMENT' | 'F6_RECEIPT' | 'F7_JOURNAL'} voucherType - Tally voucher category\n * @param {string[]} drAccs - Debited account heads\n * @param {string[]} crAccs - Credited account heads\n * @param {number} amount - Voucher monetary value\n * @returns {{\n *   isApproved: boolean,\n *   voucherRef: string\n * }} Voucher approval token and audit reference\n */\nfunction processTallyVoucher(voucherType, drAccs, crAccs, amount) {\n  // TODO: Verify voucher type rules (e.g. F4 Contra must be between Cash and Bank)\n  \n}",
    "eHint": "Check voucher rules: F4 requires cash/bank on both sides; F5 requires debit expense/creditor and credit cash/bank; F6 requires debit cash/bank and credit debtor/income. Return { isApproved: boolean, voucherRef: string }.",
    "eTest": "const contra = processTallyVoucher('F4_CONTRA', ['Bank'], ['Cash'], 10000);\nif (!contra.isApproved || !contra.voucherRef.startsWith('VCH_CONTRA')) throw new Error('Contra voucher validation failed');\nconst pay = processTallyVoucher('F5_PAYMENT', ['Salary'], ['Bank'], 25000);\nif (!pay.isApproved || !pay.voucherRef.startsWith('VCH_PAYMENT')) throw new Error('Payment voucher validation failed');\nconst badContra = processTallyVoucher('F4_CONTRA', ['Rent'], ['Cash'], 5000);\nif (badContra.isApproved) throw new Error('Invalid contra voucher accepted');",
    "aTitle": "Tally Prime Inventory Item Invoice Calculator",
    "aDesc": "Implement function `calculateTallyItemInvoice(quantity, ratePerUnit, discountPct, gstRatePct)` computing gross amount, taxable value, GST tax amount, and total invoice value. Return `{ gross: number, taxable: number, tax: number, invoiceTotal: number }`.",
    "aStarter": "/**\n * Computes itemized commercial invoice totals with trade discount and statutory GST in Tally.\n * \n * @param {number} qty - Quantity of inventory units\n * @param {number} rate - Rate per unit\n * @param {number} discPct - Trade discount percentage\n * @param {number} gstPct - Statutory GST slab percentage\n * @returns {{\n *   gross: number,\n *   taxable: number,\n *   tax: number,\n *   invoiceTotal: number\n * }} Item invoice breakdown\n */\nfunction calculateTallyItemInvoice(qty, rate, discPct, gstPct) {\n  // TODO: Compute gross = qty * rate, taxable = gross - disc, and tax breakdown for Tally item voucher\n  \n}",
    "aHint": "gross = qty * rate; disc = gross * (discPct / 100); taxable = gross - disc; tax = taxable * (gstPct / 100); total = taxable + tax; return { gross, taxable, tax, invoiceTotal: total }.",
    "aTest": "const inv = calculateTallyItemInvoice(10, 500, 10, 18); // Gross = 5000, Disc = 500 -> Taxable = 4500. Tax = 810 -> Total = 5310\nif (inv.gross !== 5000 || inv.taxable !== 4500 || inv.tax !== 810 || inv.invoiceTotal !== 5310) throw new Error('Item invoice calculation failed');"
  },
  {
    "day": 18,
    "title": "Goods & Services Tax (GST): Dual Model & Tax Invoices",
    "desc": "Master the Indian GST statutory framework: Constitutional framework (101st Amendment), Intra-State supply (CGST + SGST equal split), Inter-State supply (IGST), and statutory Tax Invoice requirements.",
    "syllabus": [
      "GST Dual Architecture: State GST (SGST), Central GST (CGST), and Integrated GST (IGST).",
      "Place of Supply Rules: Determining Intra-State (Location of Supplier == Place of Supply) vs Inter-State.",
      "HSN/SAC Codes & Tax Slabs: 0%, 5%, 12%, 18%, and 28% plus Compensation Cess."
    ],
    "eTitle": "Dual GST Inter-State vs Intra-State Tax Engine",
    "eDesc": "Implement function `calculateGstInvoice(taxableValue, gstRatePct, isInterState)` computing CGST, SGST, IGST, and total invoice value. Return `{ cgstAmount: number, sgstAmount: number, igstAmount: number, totalInvoiceValue: number }`.",
    "eStarter": "/**\n * Computes statutory GST invoice components under Dual GST architecture (Intra-state vs Inter-state).\n * \n * @param {number} taxableValue - Net assessable transaction base\n * @param {number} gstRate - Total statutory GST tariff percentage (e.g. 18%)\n * @param {boolean} isInterState - True if interstate supply (IGST), false if intrastate (CGST + SGST)\n * @returns {{\n *   cgstAmount: number,\n *   sgstAmount: number,\n *   igstAmount: number,\n *   totalInvoiceValue: number\n * }} Tax invoice schedule\n */\nfunction calculateGstInvoice(taxableValue, gstRate, isInterState) {\n  // TODO: Compute CGST & SGST (split equally) for intra-state, or full IGST for inter-state\n  \n}",
    "eHint": "isIntra = supplierState === buyerState; totalTax = taxableValue * (ratePct / 100); if isIntra -> cgst = totalTax/2, sgst = totalTax/2, igst = 0; if inter -> cgst = 0, sgst = 0, igst = totalTax; return invoice breakdown.",
    "eTest": "const intra = calculateGstInvoice(100000, 18, 'MH', 'MH');\nif (intra.cgst !== 9000 || intra.sgst !== 9000 || intra.igst !== 0 || intra.totalInvoiceAmount !== 118000) throw new Error('Intra-state GST failed');\nconst inter = calculateGstInvoice(100000, 18, 'MH', 'KA');\nif (inter.cgst !== 0 || inter.sgst !== 0 || inter.igst !== 18000 || inter.totalInvoiceAmount !== 118000) throw new Error('Inter-state GST failed');\nconst zero = calculateGstInvoice(50000, 0, 'DL', 'DL');\nif (zero.totalTaxAmount !== 0) throw new Error('Zero rate GST failed');",
    "aTitle": "Multi-Item Tax Invoice GST Aggregator",
    "aDesc": "Implement function `validateGstinChecksum(gstin)` validating 15-character GSTIN structure (state code, PAN, entity code, Z, checksum digit). Return `{ isValid: boolean, stateCode: string, pan: string }`.",
    "aStarter": "/**\n * Validates structure and extracts components of a 15-character statutory GSTIN identifier.\n * \n * @param {string} gstin - 15-character GSTIN string (e.g. '29ABCDE1234F1Z5')\n * @returns {{\n *   isValid: boolean,\n *   stateCode: string,\n *   pan: string\n * }} GSTIN validation analysis\n */\nfunction validateGstinChecksum(gstin) {\n  // TODO: Validate 15-char length, 2-digit state code, 10-char PAN, and 14th char 'Z'\n  \n}",
    "aHint": "Loop items, compute tax per item based on item.taxableValue and item.gstRatePct; aggregate totalTaxable, totalCgst, totalSgst, totalIgst, and grandTotal.",
    "aTest": "const items = [{ taxableValue: 10000, gstRatePct: 5 }, { taxableValue: 20000, gstRatePct: 18 }];\nconst agg = aggregateGstTaxInvoice(items, 'KA', 'KA'); // 500 + 3600 = 4100 tax -> CGST 2050, SGST 2050\nif (agg.totalTaxable !== 30000 || agg.totalCgst !== 2050 || agg.totalSgst !== 2050) throw new Error('Multi-item GST aggregation failed');"
  },
  {
    "day": 19,
    "title": "GST Input Tax Credit (ITC) & Cross-Utilization Set-Off Order",
    "desc": "Optimize Input Tax Credit (ITC) utilization under Section 49: Strict statutory set-off order (IGST credit exhausted first against IGST, then CGST/SGST; CGST against CGST/IGST; SGST against SGST/IGST; No cross-utilization between CGST and SGST).",
    "syllabus": [
      "Eligibility Conditions for ITC (Section 16): Tax invoice possession, goods receipt, tax payment by vendor, and return filing.",
      "Statutory Set-Off Sequence: Circular No. 98/17/2019 order minimizing cash tax outflow.",
      "Blocked Credits (Section 17(5)): Motor vehicles, food/catering, club memberships, and personal consumption."
    ],
    "eTitle": "GST ITC Cross-Utilization & Set-Off Optimization Engine",
    "eDesc": "Implement function `calculateGstItcSetOff(outIgst, outCgst, outSgst, inIgst, inCgst, inSgst)` applying Section 49 set-off order to minimize cash tax payout. Return `{ netPayableIgst: number, netPayableCgst: number, netPayableSgst: number, totalNetCashTaxPayable: number }`.",
    "eStarter": "/**\n * Optimizes GST Input Tax Credit (ITC) set-off under statutory Section 49 rules.\n * \n * @param {number} outIgst - Output IGST liability\n * @param {number} outCgst - Output CGST liability\n * @param {number} outSgst - Output SGST liability\n * @param {number} inIgst - Input IGST credit available\n * @param {number} inCgst - Input CGST credit available\n * @param {number} inSgst - Input SGST credit available\n * @returns {{\n *   netPayableIgst: number,\n *   netPayableCgst: number,\n *   netPayableSgst: number,\n *   totalNetCashTaxPayable: number\n * }} Net treasury cash liability schedule\n */\nfunction calculateGstItcSetOff(outIgst, outCgst, outSgst, inIgst, inCgst, inSgst) {\n  // TODO: Apply statutory GST set-off sequence to minimize cash tax payout\n  \n}",
    "eHint": "Offset outIgst with inIgst first. Excess inIgst offsets outCgst, then outSgst. Offset remaining outCgst with inCgst. Offset remaining outSgst with inSgst. Compute net payable in cash.",
    "eTest": "const res = calculateGstItcSetOff(10000, 18000, 18000, 15000, 12000, 12000);\n// Out: 10k IGST, 18k CGST, 18k SGST. In: 15k IGST, 12k CGST, 12k SGST -> IGST rem = 5k. CGST pay = 6k - 5k = 1k. SGST pay = 6k. Total = 7k\nif (res.netPayableIgst !== 0 || res.netPayableCgst !== 1000 || res.netPayableSgst !== 6000 || res.totalNetCashTaxPayable !== 7000) throw new Error('ITC set-off engine failed');\nconst fullCover = calculateGstItcSetOff(5000, 5000, 5000, 10000, 10000, 10000);\nif (fullCover.totalNetCashTaxPayable !== 0) throw new Error('Full ITC coverage failed');\nconst noItc = calculateGstItcSetOff(5000, 5000, 5000, 0, 0, 0);\nif (noItc.totalNetCashTaxPayable !== 15000) throw new Error('Zero ITC full payable check failed');",
    "aTitle": "Blocked Input Tax Credit (Section 17(5)) Evaluator",
    "aDesc": "Implement function `evaluateBlockedItc(purchasesList)` filtering eligible ITC vs blocked ITC under Section 17(5) where categories include 'RAW_MATERIAL' (eligible) and 'FOOD_BEVERAGES' (blocked). Return `{ eligibleItc: number, blockedItc: number }`.",
    "aStarter": "/**\n * Segregates eligible input tax credit from Section 17(5) blocked credits.\n * \n * @param {Array<{ category: 'RAW_MATERIAL' | 'FOOD_BEVERAGES' | string, tax: number }>} purchasesList - Input purchases with category and tax\n * @returns {{\n *   eligibleItc: number,\n *   blockedItc: number\n * }} ITC eligibility classification\n */\nfunction evaluateBlockedItc(purchasesList) {\n  // TODO: Evaluate purchase items: if category is 'FOOD_BEVERAGES', add to blockedItc; otherwise add to eligibleItc\n  \n}",
    "aHint": "Loop purchases; if item.category is in ['MOTOR_VEHICLES_PERSONAL', 'FOOD_BEVERAGES', 'CLUB_MEMBERSHIP'], add tax to blockedItc; else add to eligibleItc.",
    "aTest": "const list = [{ category: 'RAW_MATERIAL', tax: 18000 }, { category: 'FOOD_BEVERAGES', tax: 2000 }];\nconst r = evaluateBlockedItc(list);\nif (r.eligibleItc !== 18000 || r.blockedItc !== 2000) throw new Error('Blocked ITC evaluation failed');"
  },
  {
    "day": 20,
    "title": "Milestone 4 Capstone: GST Returns, Auto-Reconciliation & Compliance",
    "desc": "Prepare and reconcile statutory GST returns: GSTR-1 (Outward Supplies by 11th), GSTR-3B (Monthly Summary & Tax Payment by 20th), GSTR-2B (Static auto-drafted ITC statement), and Rule 36(4) compliance.",
    "syllabus": [
      "Return Architecture: GSTR-1 (B2B, B2CL, B2CS, Export) vs GSTR-3B summary self-assessment.",
      "GSTR-2B Auto-Drafting: Static monthly statement locking supplier-uploaded input tax credit.",
      "Reconciliation Best Practices: Identifying missing vendor invoices and chasing non-compliant suppliers."
    ],
    "eTitle": "GSTR-2B vs Purchase Register Auto-Reconciliation Engine",
    "eDesc": "Implement function `reconcileGstr2b(booksInvoices, portal2bInvoices)` matching invoices by invoice number and tax amount. Return `{ matchedInvoicesCount: number, missingIn2bCount: number, status: 'GSTR_2B_FULLY_RECONCILED_COMPLIANT' | 'INELIGIBLE_ITC_BLOCKED_RULE_36_4' }`.",
    "eStarter": "/**\n * Reconciles purchase register invoices against GSTR-2B portal data under Rule 36(4).\n * \n * @param {Array<{ invoiceNo: string, taxAmount: number }>} books - Books purchase register records\n * @param {Array<{ invoiceNo: string, taxAmount: number }>} portal - GSTR-2B portal eligible records\n * @returns {{\n *   matchedInvoicesCount: number,\n *   missingIn2bCount: number,\n *   status: 'GSTR_2B_FULLY_RECONCILED_COMPLIANT' | 'INELIGIBLE_ITC_BLOCKED_RULE_36_4'\n * }} GSTR-2B reconciliation report\n */\nfunction reconcileGstr2b(books, portal) {\n  // TODO: Compare purchase register with GSTR-2B portal data to flag matched and missing invoices\n  \n}",
    "eHint": "Iterate books invoices; search portal for matching invoiceNo and taxAmount. If found, add to matched; else add to missingIn2b. If missingIn2b.length > 0 set status 'INELIGIBLE_ITC_BLOCKED_RULE_36_4'.",
    "eTest": "const books = [{ invoiceNo: 'INV-1', taxAmount: 1800 }, { invoiceNo: 'INV-2', taxAmount: 3600 }];\nconst portal = [{ invoiceNo: 'INV-1', taxAmount: 1800 }]; // INV-2 missing in GSTR-2B!\nconst res = reconcileGstr2b(books, portal);\nif (res.matchedInvoicesCount !== 1 || res.missingIn2bCount !== 1 || res.status !== 'INELIGIBLE_ITC_BLOCKED_RULE_36_4') throw new Error('GSTR-2B reconciliation failed');\nconst allMatched = reconcileGstr2b(portal, portal);\nif (allMatched.missingIn2bCount !== 0 || allMatched.status !== 'GSTR_2B_FULLY_RECONCILED_COMPLIANT') throw new Error('Fully matched GSTR-2B failed');\nconst emptyRec = reconcileGstr2b([], []);\nif (emptyRec.matchedInvoicesCount !== 0) throw new Error('Empty reconciliation failed');",
    "aTitle": "GSTR-3B Net Cash Liability & Interest Calculator",
    "aDesc": "Implement function `calculateGstr3bLateFeeAndInterest(netTaxPayable, delayDays, dailyLateFeeRate)` computing Section 50 interest (18% p.a.) and late fees for delayed GSTR-3B filings. Return `{ lateFee: number, interest: number, totalDue: number }`.",
    "aStarter": "/**\n * Calculates statutory interest (Section 50 at 18% p.a.) and late fees for delayed GSTR-3B filings.\n * \n * @param {number} taxPayable - Net cash tax payable\n * @param {number} delayDays - Days elapsed past statutory filing due date\n * @param {number} dailyLateFee - Daily late filing penalty per Act\n * @returns {{\n *   lateFee: number,\n *   interest: number,\n *   totalDue: number\n * }} Statutory delay penalty schedule\n */\nfunction calculateGstr3bLateFeeAndInterest(taxPayable, delayDays, dailyLateFee) {\n  // TODO: Compute interest = taxPayable * (0.18/365) * delayDays + late fees capped at statutory limit\n  \n}",
    "aHint": "interest = delayDays > 0 ? Number((taxPayable * (0.18 / 365) * delayDays).toFixed(2)) : 0; lateFee = delayDays * dailyLateFee; totalDue = taxPayable + interest + lateFee.",
    "aTest": "const res = calculateGstr3bLateFeeAndInterest(100000, 30, 50); // Int = 100k * 0.18 * 30/365 = 1479.45. Late = 1500\nif (res.lateFee !== 1500 || res.interest < 1470 || res.totalDue < 102900) throw new Error('GSTR-3B late fee interest failed');"
  },
  {
    "day": 21,
    "title": "Enterprise Tally Prime & GST Taxation Engine",
    "desc": "Milestone 3: Build an enterprise-grade automated GST and Tally Prime compliance engine: Dual GST tax determination, Section 49 ITC set-off optimization, GSTR-2B automated reconciliation, and statutory tax return filing.",
    "syllabus": [
      "ERP Tally Prime and GST lifecycle integration.",
      "Automated tax invoice to return compilation pipeline.",
      "Enterprise statutory tax audit readiness check."
    ],
    "eTitle": "Enterprise Tally Prime & GST Compliance Master Kernel",
    "eDesc": "Implement function `executeEnterpriseGstEngine(invoices, inputCredits)` consolidating sales, purchases, ITC set-offs, and net tax payout. Return `{ totalOutputGstCollected: number, netGstPayableToGovt: number, engineStatus: 'ENTERPRISE_GST_ENGINE_ACTIVE_NOMINAL' }`.",
    "eStarter": "/**\n * Consolidates enterprise turnover and calculates net statutory tax treasury remittance.\n * \n * @param {Array<{ taxableValue: number, gstAmount: number }>} invoices - Outward supply invoices\n * @param {number} inputCredits - Total verified input tax credits available\n * @returns {{\n *   totalOutputGstCollected: number,\n *   netGstPayableToGovt: number,\n *   engineStatus: 'ENTERPRISE_GST_ENGINE_ACTIVE_NOMINAL'\n * }} Enterprise taxation engine report\n */\nfunction executeEnterpriseGstEngine(invoices, inputCredits) {\n  // TODO: Process invoice batch, aggregate output liabilities, offset eligible ITC, and generate compliance summary\n  \n}",
    "eHint": "Sum invoice taxableValue and gstAmount. netGstPayable = Math.max(0, totalOutputGst - inputCredits). Return { totalOutputGstCollected, netGstPayableToGovt, engineStatus: 'ENTERPRISE_GST_ENGINE_ACTIVE_NOMINAL' }.",
    "eTest": "const invs = [{ taxableValue: 100000, gstAmount: 18000 }, { taxableValue: 200000, gstAmount: 36000 }];\nconst res = executeEnterpriseGstEngine(invs, 20000); // Output = 54k, ITC = 20k -> Net = 34k\nif (res.totalOutputGstCollected !== 54000 || res.netGstPayableToGovt !== 34000 || res.engineStatus !== 'ENTERPRISE_GST_ENGINE_ACTIVE_NOMINAL') throw new Error('Milestone 3 GST engine failed');\nconst excessItc = executeEnterpriseGstEngine(invs, 60000);\nif (excessItc.netGstPayableToGovt !== 0) throw new Error('Excess ITC net payable should be 0');\nconst zeroEngine = executeEnterpriseGstEngine([], 0);\nif (zeroEngine.totalOutputGstCollected !== 0) throw new Error('Zero invoice engine check failed');",
    "aTitle": "Corporate GST Audit Discrepancy Detector",
    "aDesc": "Implement function `detectGstAuditDiscrepancies(gstr1Sales, gstr3bSales, booksSales)` comparing turnover reported across GSTR-1, GSTR-3B, and Financial Books. Return `{ hasRisk: boolean, diff1_3b: number }`.",
    "aStarter": "/**\n * Detects audit variances across GSTR-1 outward returns, GSTR-3B summary, and financial ledgers.\n * \n * @param {number} gstr1 - Turnover declared in GSTR-1\n * @param {number} gstr3b - Turnover declared in GSTR-3B\n * @param {number} books - Turnover recorded in financial general ledger\n * @returns {{\n *   hasRisk: boolean,\n *   diff1_3b: number\n * }} Multi-tier reconciliation risk audit\n */\nfunction detectGstAuditDiscrepancies(gstr1, gstr3b, books) {\n  // TODO: Identify turnover variances between GSTR-1, GSTR-3B, and books and flag discrepancies exceeding 1%\n  \n}",
    "aHint": "diff1_3b = Math.abs(gstr1 - gstr3b); diffBooks = Math.abs(gstr3b - books); hasRisk = diff1_3b > 0.01 || diffBooks > 0.01; return { diff1_3b, diffBooks, hasRisk }.",
    "aTest": "const d = detectGstAuditDiscrepancies(1000000, 950000, 1000000); // 50k gap\nif (!d.hasRisk || d.diff1_3b !== 50000) throw new Error('GST discrepancy detector failed');"
  },
  {
    "day": 22,
    "title": "Reverse Charge Mechanism (RCM) & E-Way Bill Generation",
    "desc": "Navigate advanced GST compliance: Reverse Charge Mechanism under Section 9(3)/9(4) (recipient pays tax directly to govt), E-Way Bill rules for goods movement above Rs 50,000, and distance-based validity calculations.",
    "syllabus": [
      "Reverse Charge Mechanism (RCM): Specified supplies (GTA, Legal services, Director fees) where recipient is liable.",
      "E-Way Bill Generation: Part-A (Consignment details, HSN, Value) and Part-B (Transporter ID, Vehicle Number).",
      "Validity Norms: 1 day per 200 km for normal cargo; 1 day per 20 km for Over Dimensional Cargo (ODC)."
    ],
    "eTitle": "E-Way Bill Requirement & Distance-Based Validity Engine",
    "eDesc": "Implement function `evaluateEwayBillRequirement(consignmentValue, distanceKm, isInterstate)` determining if E-Way bill is mandatory (threshold Rs 50,000) and calculating validity days (ceil(distance / 200)). Return `{ ewayBillMandatory: boolean, validityDays: number }`.",
    "eStarter": "/**\n * Evaluates statutory E-Way bill mandates and computes distance-based transit validity.\n * \n * @param {number} value - Consignment invoice consignment value\n * @param {number} distanceKm - Road transportation distance in kilometers\n * @param {boolean} isInterstate - True if crossing state borders\n * @returns {{\n *   ewayBillMandatory: boolean,\n *   validityDays: number\n * }} E-Way bill compliance verdict\n */\nfunction evaluateEwayBillRequirement(value, distanceKm, isInterstate) {\n  // TODO: Evaluate threshold of Rs 50,000 and calculate validity days as max(1, ceil(distance / 200))\n  \n}",
    "eHint": "isMandatory = value >= 50000; validityDays = isMandatory ? Math.max(1, Math.ceil(distanceKm / 200)) : 0; return { consignmentValue: value, ewayBillMandatory: isMandatory, validityDays }.",
    "eTest": "const req = evaluateEwayBillRequirement(75000, 450, true); // > 50k, 450 km -> ceil(450/200) = 3 days\nif (!req.ewayBillMandatory || req.validityDays !== 3) throw new Error('Mandatory E-Way bill check failed');\nconst exempt = evaluateEwayBillRequirement(30000, 100, false);\nif (exempt.ewayBillMandatory || exempt.validityDays !== 0) throw new Error('Exempt E-Way bill check failed');\nconst shortDist = evaluateEwayBillRequirement(50000, 50, true);\nif (shortDist.validityDays !== 1) throw new Error('Minimum 1-day validity check failed');",
    "aTitle": "Reverse Charge Mechanism (RCM) Self-Invoice & ITC Balancer",
    "aDesc": "Implement function `calculateRcmLiability(unregisteredPurchases, rcmRatePct)` computing output tax payable under RCM and eligible ITC claim. Return `{ rcmTaxDueInCash: number, eligibleItcNextMonth: number, selfInvoiceRequired: boolean }`.",
    "aStarter": "/**\n * Calculates Reverse Charge Mechanism (RCM) tax liability and subsequent ITC entitlement.\n * \n * @param {number} unregisteredPurchases - Value of supplies procured from unregistered vendors\n * @param {number} rcmRatePct - Applicable statutory RCM percentage rate\n * @returns {{\n *   rcmTaxDueInCash: number,\n *   eligibleItcNextMonth: number,\n *   selfInvoiceRequired: boolean\n * }} RCM liability and self-invoicing schedule\n */\nfunction calculateRcmLiability(unregisteredPurchases, rcmRatePct) {\n  // TODO: Calculate RCM output tax due, self-invoice requirement, and input tax credit available\n  \n}",
    "aHint": "rcmTax = unregisteredPurchases * (rcmRatePct / 100); return { rcmTaxDueInCash: rcmTax, eligibleItcNextMonth: rcmTax, selfInvoiceRequired: true }.",
    "aTest": "const r = calculateRcmLiability(100000, 5); // 5% GTA RCM = 5k\nif (r.rcmTaxDueInCash !== 5000 || r.eligibleItcNextMonth !== 5000 || !r.selfInvoiceRequired) throw new Error('RCM calculation failed');"
  },
  {
    "day": 23,
    "title": "Payroll Accounting: Gross Salary, EPF, ESI & Statutory Deductions",
    "desc": "Calculate corporate employee payroll and statutory compliance: Basic Pay, Dearness Allowance (DA), House Rent Allowance (HRA), Employee Provident Fund (EPF 12%), Employee State Insurance (ESI 0.75%), Professional Tax (PT), and Net Pay.",
    "syllabus": [
      "Salary Structure Components: Basic Pay, DA, HRA, Conveyance, Special Allowance.",
      "EPF Statutory Rules: 12% employee share on Basic + DA (statutory wage ceiling Rs 15,000 pm).",
      "ESI Applicability: 0.75% employee deduction for employees with gross monthly wages up to Rs 21,000."
    ],
    "eTitle": "Comprehensive Payroll Take-Home & Statutory Deductions Engine",
    "eDesc": "Implement function `calculatePayrollTakeHome(basicSalary, hra, da, specialAllowance, profTax)` computing gross salary, EPF deduction, ESI deduction, and net take-home pay. Return `{ grossSalary: number, employeeEpfDeduction: number, employeeEsiDeduction?: number, netTakeHomePay: number }`.",
    "eStarter": "/**\n * Computes gross earnings, EPF/ESI statutory deductions, and net take-home salary.\n * \n * @param {number} basicSalary - Basic wage component\n * @param {number} hra - House Rent Allowance\n * @param {number} da - Dearness Allowance\n * @param {number} specialAllowance - Special allowance\n * @param {number} profTax - Professional Tax flat monthly deduction\n * @returns {{\n *   grossSalary: number,\n *   employeeEpfDeduction: number,\n *   employeeEsiDeduction?: number,\n *   netTakeHomePay: number\n * }} Payroll take-home statement\n */\nfunction calculatePayrollTakeHome(basicSalary, hra, da, specialAllowance, profTax) {\n  // TODO: Compute gross = basic + hra + da + special; EPF = (basic + da) * 0.12; ESI = gross <= 21000 ? gross * 0.0075 : 0; net = gross - EPF - ESI - profTax\n  \n}",
    "eHint": "grossSalary = basic + da + hra + allowances; epfWages = basic + da; epfDeduction = Number((epfWages * 0.12).toFixed(2)); esiDeduction = grossSalary <= 21000 ? Number((grossSalary * 0.0075).toFixed(2)) : 0; netTakeHome = grossSalary - epfDeduction - esiDeduction - pt.",
    "eTest": "const res = calculatePayrollTakeHome(30000, 10000, 15000, 5000, 200); // Gross=60k, EPF=(40k)*0.12 = 4800, ESI=0 (gross > 21k), PT=200 -> Net = 60k - 5k = 55k\nif (res.grossSalary !== 60000 || res.employeeEpfDeduction !== 4800 || res.netTakeHomePay !== 55000) throw new Error('Standard payroll calculation failed');\nconst lowWage = calculatePayrollTakeHome(10000, 2000, 4000, 2000, 100); // Gross=18k (<=21k -> ESI=18k*0.0075=135), EPF=12k*0.12=1440, Net=18000-1440-135-100=16325\nif (lowWage.employeeEsiDeduction !== 135 || lowWage.netTakeHomePay !== 16325) throw new Error('Low-wage ESI calculation failed');\nconst zeroAll = calculatePayrollTakeHome(15000, 0, 0, 0, 0);\nif (zeroAll.grossSalary !== 15000 || zeroAll.employeeEpfDeduction !== 1800) throw new Error('Basic only payroll failed');",
    "aTitle": "Employer Statutory Contribution & CTC Cost Calculator",
    "aDesc": "Implement function `calculateEmployerCtcCost(grossSalary, basicSalary)` computing employer EPF (12% of basic) and total CTC. Return `{ employerEpf: number, totalCtc: number }`.",
    "aStarter": "/**\n * Computes employer statutory contributions and total Cost-to-Company (CTC).\n * \n * @param {number} grossSalary - Monthly gross compensation payable to employee\n * @param {number} basicSalary - Basic wage component\n * @returns {{\n *   employerEpf: number,\n *   totalCtc: number\n * }} Corporate Cost to Company (CTC) schedule\n */\nfunction calculateEmployerCtcCost(grossSalary, basicSalary) {\n  // TODO: Compute employer EPF = basic * 0.12, gratuity = basic * 0.0481, totalCtc = gross + employerEpf + gratuity\n  \n}",
    "aHint": "empEpf = basicAndDa * 0.12; empEsi = grossSalary <= 21000 ? grossSalary * 0.0325 : 0; gratuity = basicAndDa * 0.0481; totalCtc = grossSalary + empEpf + empEsi + gratuity.",
    "aTest": "const ctc = calculateEmployerCtcCost(50000, 30000); // EPF = 3600, ESI = 0, Grat = 1443 -> CTC = 55043\nif (ctc.employerEpf !== 3600 || Math.round(ctc.totalCtc) !== 55043) throw new Error('Employer CTC calculation failed');"
  },
  {
    "day": 24,
    "title": "Tax Deducted at Source (TDS): Sections 194C, 194J, 194I & Form 26Q",
    "desc": "Execute direct tax withholding at source: Section 194C (Contractor payments 1%/2%), Section 194J (Professional / Technical fees 10%/2%), Section 194I (Rent 2%/10%), TAN registration, and quarterly Form 26Q filing.",
    "syllabus": [
      "TDS Thresholds & Rates: 194C (Rs 30k single / Rs 1L aggregate), 194J (Rs 30,000 threshold).",
      "Section 206AA Penal Provision: Higher TDS deduction at 20% in case of non-furnishing of PAN.",
      "Form 26AS & AIS Reconciliation: Cross-verifying tax deducted by payers with IT portal records."
    ],
    "eTitle": "TDS Withholding & Section Threshold Evaluation Engine",
    "eDesc": "Implement function `calculateTdsWithholding(amount, section, isCompany, hasPan)` computing statutory TDS rate under Sections 194C, 194J, 194I and net vendor payout. Return `{ tdsWithheld: number, netPayableToVendor: number }`.",
    "eStarter": "/**\n * Computes statutory Tax Deducted at Source (TDS) withholding and net vendor settlement.\n * \n * @param {number} amount - Gross invoice value before TDS\n * @param {'194C' | '194J' | '194I'} section - Statutory Income Tax withholding section\n * @param {boolean} isCompany - True if vendor is a corporate entity, false for individual/proprietor\n * @param {boolean} [hasPan=true] - Whether vendor has provided a valid PAN (Section 206AA penal 20% if false)\n * @returns {{\n *   tdsWithheld: number,\n *   netPayableToVendor: number\n * }} Withholding tax remittance certificate\n */\nfunction calculateTdsWithholding(amount, section, isCompany, hasPan = true) {\n  // TODO: Apply Section TDS rates (194C: 1%/2%, 194J: 10%, 194I: 10%), Section 206AA penal rate if no PAN, and net payable\n  \n}",
    "eHint": "If !hasPan, rate = 0.20. Else if 194C -> isCompany ? 0.02 : 0.01; if 194J -> 0.10; if 194I -> 0.10. tds = amount * rate; net = amount - tds; return { tdsWithheld: tds, netPayableToVendor: net }.",
    "eTest": "const c1 = calculateTdsWithholding(100000, '194C', false, true); // 1% Individual contractor = 1k\nif (c1.tdsWithheld !== 1000 || c1.netPayableToVendor !== 99000) throw new Error('194C individual TDS failed');\nconst j1 = calculateTdsWithholding(100000, '194J', true, true);  // 10% Professional fee = 10k\nif (j1.tdsWithheld !== 10000 || j1.netPayableToVendor !== 90000) throw new Error('194J professional TDS failed');\nconst noPan = calculateTdsWithholding(100000, '194C', false, false); // No PAN -> 20% = 20k\nif (noPan.tdsWithheld !== 20000 || noPan.netPayableToVendor !== 80000) throw new Error('Section 206AA penal TDS failed');",
    "aTitle": "Form 26AS TDS Reconciliation Auditor",
    "aDesc": "Implement function `reconcileForm26AS(booksTdsReceivable, form26AsRecords)` comparing TDS deducted by clients with Form 26AS portal tax credits. Return `{ portalTotal: number, isMatched: boolean }`.",
    "aStarter": "/**\n * Reconciles company books TDS receivable against Form 26AS income tax portal credits.\n * \n * @param {number} booksTds - Total TDS deducted by clients per general ledger\n * @param {Array<{ deductor: string, tdsCredit: number }>} form26As - Array of deductor tax credits on portal\n * @returns {{\n *   portalTotal: number,\n *   isMatched: boolean\n * }} Form 26AS reconciliation audit\n */\nfunction reconcileForm26AS(booksTds, form26As) {\n  // TODO: Match TAN and amount between books and Form 26AS records, computing claimed and uncredited TDS\n  \n}",
    "aHint": "portalTotal = form26As.reduce((s, r) => s + r.tdsCredit, 0); difference = booksTds - portalTotal; return { booksTds, portalTotal, uncreditedTds: Math.max(0, difference), isMatched: difference === 0 }.",
    "aTest": "const rec = reconcileForm26AS(50000, [{ deductor: 'A', tdsCredit: 30000 }, { deductor: 'B', tdsCredit: 20000 }]);\nif (rec.portalTotal !== 50000 || !rec.isMatched) throw new Error('Form 26AS reconciliation failed');"
  },
  {
    "day": 25,
    "title": "Direct Income Tax: Old vs New Tax Regime (Section 115BAC)",
    "desc": "Compare Indian individual income tax systems: Old Tax Regime (Section 80C deductions, 80D medical, HRA exemption) vs New Concessional Tax Regime under Section 115BAC (Standard Deduction Rs 75,000 and lower slab rates).",
    "syllabus": [
      "Section 115BAC Slabs: Default tax regime with simplified slabs and Rs 75,000 standard deduction.",
      "Old Regime Deductions: Chapter VI-A deductions (80C up to 1.5L, 80D up to 25k/50k, 24(b) Home Loan Interest).",
      "Section 87A Rebate: Zero tax for taxable income up to Rs 7,00,000 under New Regime."
    ],
    "eTitle": "Income Tax Old vs New Regime Comparator & Optimizer",
    "eDesc": "Implement function `compareIncomeTaxRegimes(grossIncome, deductions80C, deductions80D, homeLoanInterest)` calculating tax slabs under Old Regime vs Section 115BAC New Regime and recommending lowest tax liability. Return `{ oldRegimeTax: number, newRegimeTax: number, recommendedRegime: string, status: 'TAX_REGIME_COMPARISON_OPTIMAL' }`.",
    "eStarter": "/**\n * Compares personal income tax liabilities between Old Regime and Section 115BAC New Regime.\n * \n * @param {number} gross - Annual gross total taxable earnings\n * @param {number} [d80c=150000] - Eligible Chapter VI-A Section 80C deductions (Old Regime only)\n * @param {number} [d80d=25000] - Medical insurance deductions under Section 80D (Old Regime only)\n * @param {number} [homeLoan=0] - Self-occupied home loan interest under Section 24(b) (Old Regime only)\n * @returns {{\n *   oldRegimeTax: number,\n *   newRegimeTax: number,\n *   recommendedRegime: 'OLD_REGIME' | 'NEW_REGIME_115BAC',\n *   status: 'TAX_REGIME_COMPARISON_OPTIMAL'\n * }} Comparative tax optimization assessment\n */\nfunction compareIncomeTaxRegimes(gross, d80c = 150000, d80d = 25000, homeLoan = 0) {\n  // TODO: Compute taxable income and slab taxes under Old Regime and New Section 115BAC regime, returning recommendation\n  \n}",
    "eHint": "newTaxable = Math.max(0, gross - 75000); oldTaxable = Math.max(0, gross - 50000 - Math.min(150000, d80c) - d80d - homeLoan); compute taxes with slab formulas; return { recommendedRegime: newTax < oldTax ? 'NEW_REGIME_115BAC' : 'OLD_REGIME', oldRegimeTax, newRegimeTax }.",
    "eTest": "const res = compareIncomeTaxRegimes(1200000, 150000, 25000, 0);\nif (!res.recommendedRegime || !res.status || res.status !== 'TAX_REGIME_COMPARISON_OPTIMAL') throw new Error('Regime comparison failed');\nconst lowGross = compareIncomeTaxRegimes(700000, 0, 0, 0); // New regime 87A rebate -> 0 tax\nif (lowGross.newRegimeTax !== 0) throw new Error('Section 87A zero tax rebate failed');\nconst highDeduct = compareIncomeTaxRegimes(1500000, 150000, 50000, 200000);\nif (typeof highDeduct.oldRegimeTax !== 'number' || typeof highDeduct.newRegimeTax !== 'number') throw new Error('High deduction tax calculation failed');",
    "aTitle": "Advance Tax Quarterly Installment Schedule Calculator",
    "aDesc": "Implement function `calculateAdvanceTaxInstallments(estimatedNetTaxLiability)` computing statutory advance tax quarterly installments. Return `{ q1Due: number, q2Due: number, q3Due: number, q4Due: number }`.",
    "aStarter": "/**\n * Generates statutory quarterly Advance Tax payment obligations under Section 208/211.\n * \n * @param {number} taxLiability - Estimated net annual income tax liability\n * @returns {{\n *   q1Due: number,\n *   q2Due: number,\n *   q3Due: number,\n *   q4Due: number\n * }} Quarterly installment schedule (15% Jun, 30% Sep, 30% Dec, 25% Mar)\n */\nfunction calculateAdvanceTaxInstallments(taxLiability) {\n  // TODO: Calculate quarterly advance tax installment obligations and cumulative due percentages\n  \n}",
    "aHint": "q1 = taxLiability * 0.15; q2 = taxLiability * 0.30; q3 = taxLiability * 0.30; q4 = taxLiability * 0.25; return { q1Due: q1, q2Due: q2, q3Due: q3, q4Due: q4, totalAdvanceTax: taxLiability }.",
    "aTest": "const adv = calculateAdvanceTaxInstallments(100000);\nif (adv.q1Due !== 15000 || adv.q2Due !== 30000 || adv.q4Due !== 25000) throw new Error('Advance tax installment calculation failed');"
  },
  {
    "day": 26,
    "title": "Capital Gains Taxation & Corporate Income Tax (Section 115BAA)",
    "desc": "Calculate direct taxation on capital assets and corporate profits: Long-Term Capital Gains (LTCG Section 112A 12.5%), Short-Term Capital Gains (STCG Section 111A 20%), and Base Corporate Tax under Section 115BAA (22% + 10% Surcharge + 4% Cess = 25.168%).",
    "syllabus": [
      "LTCG on Listed Equity (Section 112A): 12.5% tax on capital gains exceeding Rs 1,25,000 exemption limit.",
      "STCG on Listed Equity (Section 111A): Flat 20% tax on assets held for 12 months or less.",
      "Corporate Tax Section 115BAA: Concessional 25.168% effective corporate rate without exemptions."
    ],
    "eTitle": "Capital Gains & Corporate Section 115BAA Tax Engine",
    "eDesc": "Implement function `calculateCapitalGainsAndCorporateTax(ltcgEquity, stcgEquity, corporateProfits)` calculating 12.5% LTCG, 20% STCG, and corporate tax at effective 25.168%. Return `{ ltcgTaxPayable: number, stcgTaxPayable: number, corporateTaxPayable: number }`.",
    "eStarter": "/**\n * Computes capital gains tax on securities and Section 115BAA corporate income tax.\n * \n * @param {number} ltcg - Long-term capital gains on listed equity (exempt up to Rs 1.25 Lakh, then 12.5%)\n * @param {number} stcg - Short-term capital gains on equity under Section 111A (flat 20%)\n * @param {number} corpProfit - Corporate taxable net profit under Section 115BAA (22% + 10% surcharge + 4% cess = 25.168%)\n * @returns {{\n *   ltcgTaxPayable: number,\n *   stcgTaxPayable: number,\n *   corporateTaxPayable: number\n * }} Capital gains and corporate tax breakdown\n */\nfunction calculateCapitalGainsAndCorporateTax(ltcg, stcg, corpProfit) {\n  // TODO: Apply Section 112A LTCG (12.5% over 1.25L), Section 111A STCG (20%), and Section 115BAA corporate tax (25.168%)\n  \n}",
    "eHint": "taxableLtcg = Math.max(0, ltcg - 125000); ltcgTax = taxableLtcg * 0.125; stcgTax = stcg * 0.20; corpTax = corpProfit * 0.25168; return { ltcgTaxPayable: ltcgTax, stcgTaxPayable: stcgTax, corporateTaxPayable: corpTax }.",
    "eTest": "const res = calculateCapitalGainsAndCorporateTax(225000, 50000, 1000000); // LTCG = 100k*0.125 = 12.5k; STCG = 50k*0.20 = 10k; Corp = 251,680\nif (res.ltcgTaxPayable !== 12500 || res.stcgTaxPayable !== 10000 || res.corporateTaxPayable !== 251680) throw new Error('Capital gains and corporate tax failed');\nconst exemptLtcg = calculateCapitalGainsAndCorporateTax(100000, 0, 0); // < 1.25L -> 0 tax\nif (exemptLtcg.ltcgTaxPayable !== 0) throw new Error('LTCG exemption threshold failed');\nconst zeroTax = calculateCapitalGainsAndCorporateTax(0, 0, 0);\nif (zeroTax.corporateTaxPayable !== 0) throw new Error('Zero tax calculation failed');",
    "aTitle": "Cost Inflation Index (CII) Indexed Acquisition Cost Calculator",
    "aDesc": "Implement function `calculateIndexedCostOfAcquisition(purchasePrice, purchaseCii, saleCii)` computing indexed purchase price and benefit. Return `{ indexedCost: number, indexationBenefit: number }`.",
    "aStarter": "/**\n * Computes inflation-adjusted acquisition cost for real estate using official Cost Inflation Index (CII).\n * \n * @param {number} purchasePrice - Original historical acquisition price\n * @param {number} purchaseCii - Cost Inflation Index of acquisition year\n * @param {number} saleCii - Cost Inflation Index of transfer/sale year\n * @returns {{\n *   indexedCost: number,\n *   indexationBenefit: number\n * }} Indexed acquisition cost schedule\n */\nfunction calculateIndexedCostOfAcquisition(purchasePrice, purchaseCii, saleCii) {\n  // TODO: Compute indexed cost = purchasePrice * (saleCii / purchaseCii) and capital gain\n  \n}",
    "aHint": "indexedCost = Number((purchasePrice * (saleCii / purchaseCii)).toFixed(2)); return { purchasePrice, indexedCost, indexationBenefit: indexedCost - purchasePrice }.",
    "aTest": "const cii = calculateIndexedCostOfAcquisition(1000000, 200, 348); // 1M * (348/200) = 1,740,000\nif (cii.indexedCost !== 1740000 || cii.indexationBenefit !== 740000) throw new Error('CII indexation calculation failed');"
  },
  {
    "day": 27,
    "title": "Financial Statement Analysis: Liquidity, Solvency & Profitability Ratios",
    "desc": "Analyze financial statement quality through financial ratio diagnostics: Current Ratio, Acid-Test (Quick) Ratio, Debt-to-Equity Ratio, Gross Profit Margin, Net Profit Margin, and Return on Equity (ROE).",
    "syllabus": [
      "Liquidity Ratios: Current Ratio (Benchmark 2:1) and Quick Ratio (Benchmark 1:1).",
      "Solvency & Leverage: Debt-to-Equity Ratio ($Debt / Equity$) and Interest Coverage Ratio.",
      "Profitability Ratios: Net Profit Margin ($NP / Revenue$) and Return on Capital Employed (ROCE)."
    ],
    "eTitle": "Corporate Financial Ratio & Solvency Diagnostics Engine",
    "eDesc": "Implement function `calculateFinancialRatios(ca, inv, cl, debt, eq, np, rev)` computing Current Ratio, Quick Ratio, Debt-to-Equity, Net Profit Margin, and liquidity soundness flag. Return `{ currentRatio: number, quickRatio: number, debtToEquityRatio: number, netProfitMarginPercent: number, isLiquiditySound: boolean }`.",
    "eStarter": "/**\n * Computes essential liquidity, solvency, and profitability financial ratios.\n * \n * @param {number} ca - Current Assets\n * @param {number} inv - Inventory stock\n * @param {number} cl - Current Liabilities\n * @param {number} debt - Total interest-bearing debt\n * @param {number} eq - Shareholders' Equity\n * @param {number} np - Net Profit after tax\n * @param {number} rev - Top-line Turnover Revenue\n * @returns {{\n *   currentRatio: number,\n *   quickRatio: number,\n *   debtToEquityRatio: number,\n *   netProfitMarginPercent: number,\n *   isLiquiditySound: boolean\n * }} Corporate financial diagnostic report\n */\nfunction calculateFinancialRatios(ca, inv, cl, debt, eq, np, rev) {\n  // TODO: Compute liquidity, solvency, and profitability ratios and assess credit soundness\n  \n}",
    "eHint": "currentRatio = Number((ca / cl).toFixed(2)); quickRatio = Number(((ca - inv) / cl).toFixed(2)); debtToEquity = Number((debt / eq).toFixed(2)); npMargin = Number(((np / rev) * 100).toFixed(2)); isSound = currentRatio >= 1.5 && debtToEquity <= 2.0.",
    "eTest": "const res = calculateFinancialRatios(200000, 50000, 100000, 150000, 300000, 40000, 400000); // CR=2.0, QR=1.5, D/E=0.5, Margin=10%\nif (res.currentRatio !== 2.0 || res.quickRatio !== 1.5 || res.debtToEquityRatio !== 0.5 || res.netProfitMarginPercent !== 10.0) throw new Error('Financial ratios computation failed');\nif (!res.isLiquiditySound) throw new Error('Liquidity soundness flag failed');\nconst weak = calculateFinancialRatios(50000, 30000, 100000, 500000, 100000, 5000, 200000);\nif (weak.currentRatio !== 0.5 || weak.isLiquiditySound) throw new Error('Weak liquidity detection failed');",
    "aTitle": "DuPont 3-Step Return on Equity (ROE) Decomposition Analyzer",
    "aDesc": "Implement function `calculateDuPontROE(netProfit, revenue, totalAssets, equity)` breaking down Return on Equity into Profit Margin, Asset Turnover, and Financial Leverage multiplier. Return `{ profitMargin: number, assetTurnover: number, financialLeverage: number, roePercent: number }`.",
    "aStarter": "/**\n * Decomposes Return on Equity (ROE) using the 3-step DuPont model.\n * \n * @param {number} np - Net profit after tax\n * @param {number} rev - Total operational revenue\n * @param {number} assets - Total corporate asset base\n * @param {number} equity - Total shareholders' equity\n * @returns {{\n *   profitMargin: number,\n *   assetTurnover: number,\n *   financialLeverage: number,\n *   roePercent: number\n * }} DuPont decomposition analysis\n */\nfunction calculateDuPontROE(np, rev, assets, equity) {\n  // TODO: Compute Margin (NP/Rev), Turnover (Rev/Assets), Leverage (Assets/Equity), and ROE = Margin * Turnover * Leverage\n  \n}",
    "aHint": "profitMargin = netProfit / revenue; assetTurnover = revenue / assets; financialLeverage = assets / equity; roe = profitMargin * assetTurnover * financialLeverage * 100; return { profitMargin, assetTurnover, financialLeverage, roePercent: Number(roe.toFixed(2)) }.",
    "aTest": "const dp = calculateDuPontROE(100000, 1000000, 2000000, 500000); // Margin=0.10, Turnover=0.50, Lev=4.0 -> ROE = 0.10*0.50*4.0 = 20%\nif (dp.profitMargin !== 0.1 || dp.assetTurnover !== 0.5 || dp.financialLeverage !== 4 || dp.roePercent !== 20) throw new Error('DuPont ROE decomposition failed');"
  },
  {
    "day": 28,
    "title": "Cash Flow Statement (AS-3): Operating, Investing & Financing Cashflows",
    "desc": "Construct the Cash Flow Statement under Accounting Standard 3 (AS-3 / Ind AS 7): Indirect Method for Cash Flow from Operating Activities (CFO), Cash Flow from Investing Activities (CFI), and Cash Flow from Financing Activities (CFF).",
    "syllabus": [
      "Operating Activities (CFO): Adjusting Net Profit for non-cash expenses (Depreciation) and Working Capital changes.",
      "Investing Activities (CFI): Capital expenditure on fixed assets and proceeds from sale of investments.",
      "Financing Activities (CFF): Equity share issues, bank borrowing, and dividend payments."
    ],
    "eTitle": "AS-3 Indirect Cash Flow Statement Compilation Engine",
    "eDesc": "Implement function `calculateCashFlowStatement(netIncome, dep, changeAr, changeInv, changeAp, capex, debtProceeds, dividends)` compiling Operating, Investing, and Financing cash flows. Return `{ cashFromOperations: number, cashFromInvesting: number, cashFromFinancing: number, closingCashBalance: number }`.",
    "eStarter": "/**\n * Compiles a three-part Statement of Cash Flows using the Indirect Method.\n * \n * @param {number} netIncome - Bottom-line net income from Profit & Loss\n * @param {number} dep - Non-cash depreciation and amortization\n * @param {number} changeAr - Increase (+) or decrease (-) in accounts receivable\n * @param {number} changeInv - Increase (+) or decrease (-) in inventory stock\n * @param {number} changeAp - Increase (+) or decrease (-) in accounts payable\n * @param {number} capex - Capital expenditures on fixed assets (cash outflow)\n * @param {number} debtProceeds - Net borrowings from loans or bond issuances\n * @param {number} dividends - Dividend distributions paid to shareholders\n * @returns {{\n *   cashFromOperations: number,\n *   cashFromInvesting: number,\n *   cashFromFinancing: number,\n *   closingCashBalance: number\n * }} Reconciled cash flow statement\n */\nfunction calculateCashFlowStatement(netIncome, dep, changeAr, changeInv, changeAp, capex, debtProceeds, dividends) {\n  // TODO: CFO = netIncome + dep - changeAr - changeInv + changeAp; CFI = -capex; CFF = debtProceeds - dividends; closingCash = CFO + CFI + CFF + openingCash\n  \n}",
    "eHint": "cfo = np + dep + wcChange; cfi = faSell - faBuy; cff = loan - div; netChange = cfo + cfi + cff; closingCash = openCash + netChange; return { cashFromOperations: cfo, cashFromInvesting: cfi, cashFromFinancing: cff, netChangeInCash: netChange, closingCashBalance: closingCash }.",
    "eTest": "const res = calculateCashFlowStatement(50000, 10000, -5000, 30000, 5000, 20000, 10000, 15000); // CFO=55k, CFI=-25k, CFF=10k -> Net = 40k. Close = 55k\nif (res.cashFromOperations !== 55000 || res.cashFromInvesting !== -25000 || res.cashFromFinancing !== 10000 || res.closingCashBalance !== 55000) throw new Error('Cash flow statement compilation failed');\nconst zeroFlow = calculateCashFlowStatement(10000, 0, 0, 0, 0, 0, 0, 5000);\nif (zeroFlow.closingCashBalance !== 15000) throw new Error('Simple cash flow failed');\nconst negFlow = calculateCashFlowStatement(10000, 0, 0, 50000, 0, 0, 0, 60000);\nif (negFlow.closingCashBalance !== 20000) throw new Error('Negative investing cash flow failed');",
    "aTitle": "Free Cash Flow to Firm (FCFF) & Cash Conversion Cycle Calculator",
    "aDesc": "Implement function `calculateFCFFAndCCC(operatingCashFlow, capex, dioDays, dsoDays, dpoDays)` computing Free Cash Flow to Firm (FCFF) and Cash Conversion Cycle (CCC). Return `{ fcff: number, cashConversionCycleDays: number }`.",
    "aStarter": "/**\n * Computes Free Cash Flow to Firm (FCFF) and operational Cash Conversion Cycle (CCC).\n * \n * @param {number} ocf - Cash flow from operating activities\n * @param {number} capex - Capital expenditures on property, plant & equipment\n * @param {number} dio - Days Inventory Outstanding\n * @param {number} dso - Days Sales Outstanding (Receivables)\n * @param {number} dpo - Days Payables Outstanding\n * @returns {{\n *   fcff: number,\n *   cashConversionCycleDays: number\n * }} Free cash flow and working capital cycle metrics\n */\nfunction calculateFCFFAndCCC(ocf, capex, dio, dso, dpo) {\n  // TODO: Compute fcff = ocf - capex; cashConversionCycleDays = dio + dso - dpo\n  \n}",
    "aHint": "fcff = cfo - capex; cccDays = inventoryDays + debtorDays - creditorDays; return { fcff, cashConversionCycleDays: cccDays }.",
    "aTest": "const f = calculateFCFFAndCCC(150000, 50000, 45, 30, 25); // FCFF = 100k, CCC = 45 + 30 - 25 = 50 days\nif (f.fcff !== 100000 || f.cashConversionCycleDays !== 50) throw new Error('FCFF and CCC calculation failed');"
  },
  {
    "day": 29,
    "title": "Cloud Accounting, AI Invoicing (OCR) & Forensic Fraud Detection",
    "desc": "Leverage modern accounting technology and forensic controls: Cloud ERP integration, AI-powered Optical Character Recognition (OCR) for invoice data capture, automated 3-way matching, and Benford's Law anomaly detection.",
    "syllabus": [
      "AI Invoice OCR: Automated extraction of Vendor Name, GSTIN, Invoice Number, Line Items, and Total.",
      "3-Way Matching: Automated cross-verification of Purchase Order (PO), Goods Receipt Note (GRN), and Vendor Invoice.",
      "Forensic Accounting: Benford's Law distribution analysis to identify fabricated accounting ledger entries."
    ],
    "eTitle": "AI Invoicing OCR & Forensic Duplicate Detection Engine",
    "eDesc": "Implement function `auditInvoiceOcr(invNo, gstin, amount, gstValid, isDuplicate, poAmount)` verifying AI OCR data capture, GSTIN format, duplicate invoice fraud, and 3-way PO matching. Return `{ status: 'INVOICE_OCR_VERIFIED_NOMINAL' | string, remedy?: 'FLAG_DUPLICATE_INVOICE_FRAUD' }`.",
    "eStarter": "/**\n * Audits AI invoice OCR ingestion for format compliance, duplicate invoice fraud, and PO variance.\n * \n * @param {string} invNo - Extracted invoice serial identifier\n * @param {string} gstin - 15-character vendor GSTIN (e.g. '29ABCDE1234F1Z5')\n * @param {number} amount - Extracted monetary amount\n * @param {boolean} gstValid - Format validation status of vendor GSTIN\n * @param {boolean} isDuplicate - Flag indicating prior existence in accounting ledger\n * @param {number} [poAmount=amount] - Purchase Order matched amount (variance tolerance 0%)\n * @returns {{\n *   status: 'INVOICE_OCR_VERIFIED_NOMINAL' | string,\n *   remedy?: 'FLAG_DUPLICATE_INVOICE_FRAUD'\n * }} Forensic invoice audit result\n */\nfunction auditInvoiceOcr(invNo, gstin, amount, gstValid, isDuplicate, poAmount = amount) {\n  // TODO: Validate OCR invoice parameters, check GSTIN validity, detect duplicates, and perform 3-way PO match\n  \n}",
    "eHint": "isValid = Boolean(invNo && gstin && amount > 0 && gstValid && !isDuplicate && amount === poAmount); check if isDuplicate -> 'FLAG_DUPLICATE_INVOICE_FRAUD'; return status object.",
    "eTest": "const ok = auditInvoiceOcr('INV-101', '29ABCDE1234F1Z5', 50000, true, false, 50000);\nif (!ok.status.includes('VERIFIED')) throw new Error('Valid invoice OCR check failed');\nconst dup = auditInvoiceOcr('INV-101', '29ABCDE1234F1Z5', 50000, true, true, 50000);\nif (dup.status.includes('VERIFIED') || dup.remedy !== 'FLAG_DUPLICATE_INVOICE_FRAUD') throw new Error('Duplicate fraud detection failed');\nconst poMismatch = auditInvoiceOcr('INV-102', '29ABCDE1234F1Z5', 50000, true, false, 45000);\nif (poMismatch.status.includes('VERIFIED')) throw new Error('PO price variance check failed');",
    "aTitle": "Benford's Law Forensic Accounting Fraud Screener",
    "aDesc": "Implement function `evaluateBenfordsLawDistribution(firstDigitsArray)` analyzing the distribution frequency of first leading digits in ledger transactions. Return `{ pctLeadingOnes: number }`.",
    "aStarter": "/**\n * Screens ledger transactions for forensic fraud anomalies using Benford's Law of leading digits.\n * \n * @param {number[]} digits - Array of leading non-zero digits (1-9) from financial transaction entries\n * @returns {{\n *   pctLeadingOnes: number\n * }} Frequency analysis of digit 1 occurrence percentage\n */\nfunction evaluateBenfordsLawDistribution(digits) {\n  // TODO: Count leading digit frequencies and determine conformance with Benford's Law\n  \n}",
    "aHint": "Count frequencies of 1 through 9; count1 = digits.filter(d => d === 1).length; pct1 = (count1 / digits.length) * 100; isNaturalDistribution = pct1 >= 25 && pct1 <= 35; return { pctLeadingOnes: pct1, isNaturalDistribution }.",
    "aTest": "const nat = evaluateBenfordsLawDistribution([1, 1, 1, 2, 3, 4, 1, 5, 6, 1]); // 4 out of 10 = 40% (close to Benford ~30.1%)\nif (typeof nat.pctLeadingOnes !== 'number') throw new Error('Benford screener failed');"
  },
  {
    "day": 30,
    "title": "FINAL GRAND CAPSTONE: Integrated Corporate Digital Accounting, GST & Tax Audit Suite",
    "desc": "Final Capstone Synthesis: The complete corporate digital accounting and tax audit operating system bringing together Double-Entry Bookkeeping, Tally Prime workflows, GST Dual Model, ITC Set-Off, TDS withholding, and AS-3 Cash Flows.",
    "syllabus": [
      "End-to-End Corporate Accounting System Synthesis.",
      "Comprehensive Statutory Tax Compliance Integration (GST + TDS + Corporate Tax).",
      "Enterprise Digital Audit Verification & Risk Scoring Matrix."
    ],
    "eTitle": "Enterprise Digital Accounting & Tax Audit Suite Master",
    "eDesc": "Implement function `orchestrateCorporateAccounting(booksReady, finReady, gstReady, payReady, taxReady, booksScore)` conducting comprehensive corporate accounting compliance certification. Return `{ corporateGradeAuditCertified: boolean, status: 'CORPORATE_ACCOUNTING_AND_TAX_AUDIT_CERTIFIED_NOMINAL' | 'COMPLIANCE_DEFECT_DETECTED_AUDIT_HALTED' }`.",
    "eStarter": "/**\n * Orchestrates full-scope corporate enterprise accounting, GST, payroll, and tax compliance audit.\n * \n * @param {boolean} books - Books of accounts balanced and reconciled\n * @param {boolean} fin - Financial statements audited and signed off\n * @param {boolean} gst - GST returns and GSTR-2B ITC reconciled\n * @param {boolean} pay - Payroll statutory deductions (EPF, ESI, TDS) deposited\n * @param {boolean} tax - Advance corporate income tax installments completed\n * @param {number} [score=100] - Composite internal control quality rating (pass threshold >= 80)\n * @returns {{\n *   corporateGradeAuditCertified: boolean,\n *   status: 'CORPORATE_ACCOUNTING_AND_TAX_AUDIT_CERTIFIED_NOMINAL' | 'COMPLIANCE_DEFECT_DETECTED_AUDIT_HALTED'\n * }} Corporate certification verdict\n */\nfunction orchestrateCorporateAccounting(books, fin, gst, pay, tax, score = 100) {\n  // TODO: Verify all five accounting compliance modules and generate enterprise certification audit report\n  \n}",
    "eHint": "isCompliant = books && fin && gst && pay && tax && score >= 90; return { generalLedgerClosed: books, financialStatementsCertified: fin, gstReturnsReconciled: gst, payrollStatutoryCompliant: pay, directTaxAudited: tax, corporateGradeAuditCertified: isCompliant, auditScore: score, status: isCompliant ? 'CORPORATE_ACCOUNTING_AND_TAX_AUDIT_CERTIFIED_NOMINAL' : 'COMPLIANCE_DEFECT_DETECTED_AUDIT_HALTED' }.",
    "eTest": "const ok = orchestrateCorporateAccounting(true, true, true, true, true, 100);\nif (!ok.corporateGradeAuditCertified || ok.status !== 'CORPORATE_ACCOUNTING_AND_TAX_AUDIT_CERTIFIED_NOMINAL') throw new Error('Capstone full certification failed');\nconst fail = orchestrateCorporateAccounting(true, true, false, true, true, 100);\nif (fail.corporateGradeAuditCertified || fail.status !== 'COMPLIANCE_DEFECT_DETECTED_AUDIT_HALTED') throw new Error('Incomplete compliance allowed');\nconst lowScore = orchestrateCorporateAccounting(true, true, true, true, true, 70);\nif (lowScore.corporateGradeAuditCertified) throw new Error('Low audit score allowed');",
    "aTitle": "Master Accounting Audit Risk Scoring Matrix",
    "aDesc": "Implement function `computeAccountingAuditRiskMatrix(internalControlScore, gstReconciliationScore, taxComplianceScore)` generating composite audit confidence rating and audit readiness status. Return `{ compositeScore: number, isReady: boolean, auditTier: 'TIER_1_ENTERPRISE_READY' }`.",
    "aStarter": "/**\n * Computes composite corporate audit readiness score and assigns risk classification tier.\n * \n * @param {number} controls - Internal financial controls evaluation score (40% weight)\n * @param {number} gstScore - GST compliance and ITC reconciliation score (30% weight)\n * @param {number} taxScore - Income tax filing and TDS compliance score (30% weight)\n * @returns {{\n *   compositeScore: number,\n *   isReady: boolean,\n *   auditTier: 'TIER_1_ENTERPRISE_READY'\n * }} Comprehensive enterprise audit readiness matrix\n */\nfunction computeAccountingAuditRiskMatrix(controls, gstScore, taxScore) {\n  // TODO: Compute weighted score (Controls 40%, GST 30%, Tax 30%) and assign audit readiness tier\n  \n}",
    "aHint": "compositeScore = (controls * 0.40) + (gstScore * 0.30) + (taxScore * 0.30); isReady = compositeScore >= 80; return { compositeScore, isReady, auditTier: isReady ? 'TIER_1_ENTERPRISE_READY' : 'REMEDIATION_REQUIRED' }.",
    "aTest": "const r = computeAccountingAuditRiskMatrix(90, 85, 95); // 36 + 25.5 + 28.5 = 90.0\nif (r.compositeScore !== 90 || !r.isReady || r.auditTier !== 'TIER_1_ENTERPRISE_READY') throw new Error('Audit risk matrix calculation failed');"
  }
];

export const BCOM_ACCOUNTING_30_DAYS_QUESTS: CourseQuest[] = BCOM_ACCOUNTING_30_DAYS_CONFIGS.flatMap((cfg, idx) => 
  buildEnrichedDayQuests('bcom-accounting', idx + 1, cfg)
);
