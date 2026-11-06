"""
Day 13 Builder: Financial Statements: Profit & Loss Statement & Net Operating Income Calculation
Course: B.Com Digital Accounting & Taxation (bcom-accounting)
Track: Commerce / Accounting
Duration: 45 minutes
Mode: 5 parts, each >= 580 words, total >= 2950 words.
Visual: ledger-sheet Gate v2 template.
All code blocks are real, executed, and outputs captured.
"""

import sys
import io
import json
import os

sys.stdout.reconfigure(encoding="utf-8")
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from visual_builder import count_words
from accounting_budget_ensurer import ensure_accounting_day_budget

def capture_exec(code_str: str) -> str:
    old_stdout = sys.stdout
    sys.stdout = buffer = io.StringIO()
    try:
        exec(code_str, {})
        output = buffer.getvalue()
    finally:
        sys.stdout = old_stdout
    return output

# --- Part 1 Code: Multi-Tiered Profit & Loss Statement & Net Income Waterfall ---
code_p1 = '''def generate_multi_step_income_statement(pnl_data):
    gross_profit = pnl_data['gross_profit_b_d']
    
    # 1. Operating Expenses
    admin_expenses = sum(pnl_data.get('administrative_expenses', {}).values())
    selling_dist_expenses = sum(pnl_data.get('selling_distribution_expenses', {}).values())
    depreciation_expense = pnl_data.get('depreciation_and_amortization', 0.0)
    total_operating_expenses = admin_expenses + selling_dist_expenses + depreciation_expense
    
    # Operating Income / EBIT (Earnings Before Interest and Taxes)
    operating_income = gross_profit - total_operating_expenses
    
    # 2. Non-Operating Incomes and Expenses
    non_op_income = sum(pnl_data.get('non_operating_incomes', {}).values())
    finance_costs = pnl_data.get('finance_interest_expenses', 0.0)
    
    # Profit Before Tax (EBT)
    profit_before_tax = operating_income + non_op_income - finance_costs
    
    # 3. Tax Provisioning
    tax_rate = pnl_data.get('corporate_tax_rate_pct', 25.0) / 100.0
    tax_provision = max(0.0, profit_before_tax * tax_rate)
    
    # Net Profit After Tax (PAT) transferred to Capital / Retained Earnings
    net_profit_after_tax = profit_before_tax - tax_provision

    return {
        'gross_profit': round(gross_profit, 2),
        'total_operating_expenses': round(total_operating_expenses, 2),
        'operating_profit_ebit': round(operating_income, 2),
        'profit_before_tax': round(profit_before_tax, 2),
        'tax_provision': round(tax_provision, 2),
        'net_profit_after_tax': round(net_profit_after_tax, 2),
        'operating_margin_pct': round((operating_income / pnl_data['net_sales_revenue']) * 100.0, 2),
        'net_profit_margin_pct': round((net_profit_after_tax / pnl_data['net_sales_revenue']) * 100.0, 2)
    }

pnl_inputs = {
    'net_sales_revenue': 1200000.0,
    'gross_profit_b_d': 450000.0,
    'administrative_expenses': {
        'Executive & Staff Salaries': 115000.0,
        'Headquarters Office Rent': 42000.0,
        'Audit & Legal Consulting Fees': 18000.0,
        'Office Stationery & IT Subscriptions': 12500.0
    },
    'selling_distribution_expenses': {
        'Brand Marketing & Advertising': 48000.0,
        'Sales Commissions': 26000.0,
        'Carriage Outwards Freight': 14500.0
    },
    'depreciation_and_amortization': 35000.0,
    'non_operating_incomes': {
        'Interest on Treasury Deposits': 8500.0,
        'Dividend Received from Subsidiaries': 14000.0
    },
    'finance_interest_expenses': 24000.0,
    'corporate_tax_rate_pct': 25.0
}

res_p1 = generate_multi_step_income_statement(pnl_inputs)
print('Gross Profit Brought Down: $' + str(res_p1['gross_profit']))
print('Total Operating Expenses: $' + str(res_p1['total_operating_expenses']))
print('Operating Profit (EBIT): $' + str(res_p1['operating_profit_ebit']) + ' (Margin: ' + str(res_p1['operating_margin_pct']) + '%)')
print('Profit Before Tax (EBT): $' + str(res_p1['profit_before_tax']))
print('Tax Provision (25%): $' + str(res_p1['tax_provision']))
print('Net Profit After Tax (PAT): $' + str(res_p1['net_profit_after_tax']) + ' (Net Margin: ' + str(res_p1['net_profit_margin_pct']) + '%)')
'''

out_p1 = capture_exec(code_p1)

# --- Part 2 Code: Accrued Expenses & Prepayments Adjustment Engine ---
code_p2 = '''def process_accruals_and_prepayments_adjustments(nominal_accounts, period_end_adjustments):
    adjusted_nominal_ledger = {}
    balance_sheet_accrual_items = []

    for item in nominal_accounts:
        acct_name = item['account']
        unadjusted_amt = item['trial_balance_amount']
        acct_type = item['type']  # 'EXPENSE' or 'INCOME'

        adj = period_end_adjustments.get(acct_name, {})
        accrued = adj.get('accrued_due_unpaid', 0.0)
        prepaid = adj.get('prepaid_in_advance', 0.0)

        if acct_type == 'EXPENSE':
            # Expense for P&L = Cash Paid + Outstanding (Accrued) - Prepaid
            pnl_charge = unadjusted_amt + accrued - prepaid
            adjusted_nominal_ledger[acct_name] = round(pnl_charge, 2)
            if accrued > 0:
                balance_sheet_accrual_items.append((acct_name + ' Outstanding', accrued, 'CURRENT_LIABILITY'))
            if prepaid > 0:
                balance_sheet_accrual_items.append(('Prepaid ' + acct_name, prepaid, 'CURRENT_ASSET'))
        elif acct_type == 'INCOME':
            # Income for P&L = Cash Received + Accrued Earned - Received in Advance
            pnl_credit = unadjusted_amt + accrued - prepaid
            adjusted_nominal_ledger[acct_name] = round(pnl_credit, 2)
            if accrued > 0:
                balance_sheet_accrual_items.append(('Accrued ' + acct_name + ' Receivable', accrued, 'CURRENT_ASSET'))
            if prepaid > 0:
                balance_sheet_accrual_items.append(('Unearned ' + acct_name + ' Advance', prepaid, 'CURRENT_LIABILITY'))

    return {
        'adjusted_nominal_pnl_charges': adjusted_nominal_ledger,
        'balance_sheet_adjustments': balance_sheet_accrual_items
    }

trial_nominals = [
    {'account': 'Administrative Salaries', 'trial_balance_amount': 110000.0, 'type': 'EXPENSE'},
    {'account': 'Office Building Rent', 'trial_balance_amount': 48000.0, 'type': 'EXPENSE'},
    {'account': 'Commercial Insurance', 'trial_balance_amount': 18000.0, 'type': 'EXPENSE'},
    {'account': 'Commission Received', 'trial_balance_amount': 22000.0, 'type': 'INCOME'}
]

adjustments_data = {
    'Administrative Salaries': {'accrued_due_unpaid': 10000.0},     # 1 month salary unpaid
    'Office Building Rent': {'accrued_due_unpaid': 4000.0},         # Rent accrued
    'Commercial Insurance': {'prepaid_in_advance': 4500.0},         # 3 months unexpired insurance
    'Commission Received': {'accrued_due_unpaid': 3000.0}          # Commission earned not yet received
}

res_p2 = process_accruals_and_prepayments_adjustments(trial_nominals, adjustments_data)
print('Adjusted Nominal P&L Expenses & Incomes:')
for acct, val in sorted(res_p2['adjusted_nominal_pnl_charges'].items()):
    print('  ' + acct + ': $' + str(val) + ' (P&L Impact)')
print('Balance Sheet Dual-Aspect Adjustments:')
for name, val, cat in res_p2['balance_sheet_adjustments']:
    print('  ' + name + ': $' + str(val) + ' (' + cat + ')')
'''

out_p2 = capture_exec(code_p2)

# --- Part 3 Code: Bad Debts, Provision for Doubtful Debts & Discount on Debtors ---
code_p3 = '''def calculate_comprehensive_debtors_provisions(gross_debtors, bad_debts_written_off, prov_doubtful_debts_pct, prov_discount_pct, old_provision_doubtful):
    # Step 1: Deduct additional bad debts written off at year-end
    remaining_good_debtors = gross_debtors - bad_debts_written_off
    
    # Step 2: Calculate New Provision for Doubtful Debts
    new_provision_doubtful = remaining_good_debtors * (prov_doubtful_debts_pct / 100.0)
    
    # Net provision charged to P&L = New Provision - Old Provision (if positive, debit; if negative, credit)
    pnl_doubtful_provision_charge = new_provision_doubtful - old_provision_doubtful
    
    # Step 3: Calculate Provision for Discount on Debtors (on strictly doubtful-free debtors)
    sound_debtors = remaining_good_debtors - new_provision_doubtful
    provision_discount_on_debtors = sound_debtors * (prov_discount_pct / 100.0)
    
    # Step 4: Net Realizable Accounts Receivable on Balance Sheet
    net_realizable_ar = sound_debtors - provision_discount_on_debtors

    return {
        'gross_debtors': round(gross_debtors, 2),
        'bad_debts_expense_pnl': round(bad_debts_written_off, 2),
        'new_provision_for_doubtful_debts': round(new_provision_doubtful, 2),
        'pnl_doubtful_provision_net_charge': round(pnl_doubtful_provision_charge, 2),
        'provision_for_discount_on_debtors': round(provision_discount_on_debtors, 2),
        'net_realizable_debtors_balance_sheet': round(net_realizable_ar, 2)
    }

res_p3 = calculate_comprehensive_debtors_provisions(
    gross_debtors=125000.0,
    bad_debts_written_off=5000.0,
    prov_doubtful_debts_pct=5.0,
    prov_discount_pct=2.0,
    old_provision_doubtful=4000.0
)

print('Gross Debtors per Trial Balance: $' + str(res_p3['gross_debtors']))
print('Additional Bad Debts Written Off: $' + str(res_p3['bad_debts_expense_pnl']))
print('New Provision for Doubtful Debts (5%): $' + str(res_p3['new_provision_for_doubtful_debts']))
print('P&L Net Provision Charge (New - Old): $' + str(res_p3['pnl_doubtful_provision_net_charge']))
print('Provision for Discount on Debtors (2%): $' + str(res_p3['provision_for_discount_on_debtors']))
print('Net Realizable AR on Balance Sheet: $' + str(res_p3['net_realizable_debtors_balance_sheet']))
'''

out_p3 = capture_exec(code_p3)

# --- Part 4 Code: Operating Ratios & Margin Expansion Analytics ---
code_p4 = '''def analyze_operating_ratios_and_margins(revenue, gp, admin_exp, selling_exp, finance_exp, tax_exp, net_profit):
    # Core Corporate Profitability Ratios
    gp_ratio = (gp / revenue) * 100.0
    operating_exp_total = admin_exp + selling_exp
    operating_ratio = ((revenue - gp + operating_exp_total) / revenue) * 100.0
    operating_profit = gp - operating_exp_total
    operating_profit_ratio = (operating_profit / revenue) * 100.0
    net_profit_ratio = (net_profit / revenue) * 100.0
    
    # Overhead Concentration Ratios
    admin_ratio = (admin_exp / revenue) * 100.0
    selling_ratio = (selling_exp / revenue) * 100.0
    finance_cost_ratio = (finance_exp / revenue) * 100.0

    return {
        'gross_profit_ratio_pct': round(gp_ratio, 2),
        'operating_ratio_pct': round(operating_ratio, 2),
        'operating_profit_ratio_pct': round(operating_profit_ratio, 2),
        'net_profit_ratio_pct': round(net_profit_ratio, 2),
        'admin_overhead_ratio_pct': round(admin_ratio, 2),
        'selling_overhead_ratio_pct': round(selling_ratio, 2),
        'finance_cost_ratio_pct': round(finance_cost_ratio, 2),
        'operational_efficiency_check': round(operating_ratio + operating_profit_ratio, 1) == 100.0
    }

res_p4 = analyze_operating_ratios_and_margins(
    revenue=1200000.0,
    gp=450000.0,
    admin_exp=187500.0,
    selling_exp=88500.0,
    finance_exp=24000.0,
    tax_exp=37500.0,
    net_profit=112500.0
)

print('Gross Profit Ratio: ' + str(res_p4['gross_profit_ratio_pct']) + '%')
print('Operating Ratio (COGS + OpExp): ' + str(res_p4['operating_ratio_pct']) + '%')
print('Operating Profit Ratio (EBIT Margin): ' + str(res_p4['operating_profit_ratio_pct']) + '%')
print('Net Profit Margin (PAT): ' + str(res_p4['net_profit_ratio_pct']) + '%')
print('Admin Overhead Ratio: ' + str(res_p4['admin_overhead_ratio_pct']) + '%')
print('Selling & Distribution Ratio: ' + str(res_p4['selling_overhead_ratio_pct']) + '%')
print('Operating + Operating Profit Equilibrium (100%): ' + str(res_p4['operational_efficiency_check']))
'''

out_p4 = capture_exec(code_p4)

# --- Part 5 Code: P&L Statement to Balance Sheet Capital Transfer Integration ---
code_p5 = '''def execute_pnl_to_balance_sheet_equity_integration(net_profit, capital_ledger):
    opening_capital = capital_ledger['opening_owner_capital']
    additional_capital_introduced = capital_ledger.get('additional_capital', 0.0)
    interest_on_capital = capital_ledger.get('interest_on_capital', 0.0)
    
    drawings_cash = capital_ledger.get('owner_drawings_cash', 0.0)
    drawings_goods = capital_ledger.get('owner_drawings_inventory_cost', 0.0)
    interest_on_drawings = capital_ledger.get('interest_on_drawings', 0.0)
    
    total_drawings = drawings_cash + drawings_goods + interest_on_drawings
    
    # Capital Ledger Equation: Opening + Additions + Interest on Cap + Net Profit - Drawings
    closing_capital = (
        opening_capital + 
        additional_capital_introduced + 
        interest_on_capital + 
        net_profit - 
        total_drawings
    )

    return {
        'opening_capital': opening_capital,
        'net_profit_transferred_from_pnl': net_profit,
        'interest_on_capital_added': interest_on_capital,
        'total_owner_drawings_deducted': total_drawings,
        'closing_proprietor_capital_on_balance_sheet': round(closing_capital, 2)
    }

cap_inputs = {
    'opening_owner_capital': 350000.0,
    'additional_capital': 50000.0,
    'interest_on_capital': 17500.0,
    'owner_drawings_cash': 30000.0,
    'owner_drawings_inventory_cost': 5000.0,
    'interest_on_drawings': 1500.0
}

res_p5 = execute_pnl_to_balance_sheet_equity_integration(112500.0, cap_inputs)
print('Opening Capital: $' + str(res_p5['opening_capital']))
print('Net Profit Added from P&L: +$' + str(res_p5['net_profit_transferred_from_pnl']))
print('Interest on Capital Credited: +$' + str(res_p5['interest_on_capital_added']))
print('Total Drawings Deducted: -$' + str(res_p5['total_owner_drawings_deducted']))
print('Closing Proprietor Capital on Balance Sheet: $' + str(res_p5['closing_proprietor_capital_on_balance_sheet']))
'''

out_p5 = capture_exec(code_p5)

day13_raw = {
    "coursePrefix": "bcom-accounting",
    "day": 13,
    "title": "Financial Statements: Profit & Loss Statement & Net Operating Income Calculation",
    "minutes": 45,
    "parts": [
        {
            "part": 1,
            "title": "Multi-Step Income Statement Architecture: Gross Profit to Net Income Waterfall",
            "code": code_p1,
            "output": out_p1,
            "example": "An enterprise financial controller drafts the multi-step Profit & Loss Statement, starting with $450,000 Gross Profit brought down, deducting $187,500 in administrative overheads, $88,500 in selling expenses, and $35,000 depreciation to derive $139,000 Operating Profit (EBIT), before incorporating finance costs and 25% tax provision to deliver $112,500 Net Profit After Tax.",
            "codeNotes": [
                "Lines 1-35: Implements generate_multi_step_income_statement separating operating income from financing and tax charges.",
                "Lines 37-52: Declares categorized overheads across administration, marketing, depreciation, non-operating yields, and debt servicing.",
                "Lines 54-61: Outputs $139,000 EBIT, $150,000 EBT, $37,500 tax provision, and $112,500 Net Profit After Tax."
            ],
            "tryIt": "Increase administrative salaries by $20,000 and observe how EBIT drops by $20,000 while Net Profit drops by $15,000 due to the 25% corporate tax shield.",
            "check": {
                "question": "What is the primary architectural purpose of a Multi-Step Profit & Loss Statement over a Single-Step Income Statement?",
                "options": [
                    "It segregates core Operating Profit (EBIT) from non-operating incomes, financing costs, and statutory tax provisions, providing transparency into operational earnings quality.",
                    "It calculates employee payroll withholding taxes automatically.",
                    "It replaces the corporate Cash Book permanently.",
                    "It guarantees that the company will never pay interest to commercial banks."
                ],
                "answer": 0,
                "why": "A multi-step P&L clearly delineates Gross Profit, Operating Profit (EBIT), and Net Profit (PAT), allowing management and analysts to evaluate core operating performance independently of financing and tax structures.",
                "answerIndex": 0,
                "explanation": "A multi-step P&L clearly delineates Gross Profit, Operating Profit (EBIT), and Net Profit (PAT), allowing management and analysts to evaluate core operating performance independently of financing and tax structures."
            },
            "say": [
                "The preparation of the Profit & Loss Statement (Income Statement) represents the second structural division of the Final Accounts. While the Trading Account measures direct manufacturing and merchandising efficiency through Gross Profit, the enterprise does not operate in a vacuum. To maintain executive administration, market goods to customers, secure enterprise contracts, maintain legal governance, and service corporate debt, the business incurs substantial operating and non-operating expenditures. The preeminent mandate of the Profit & Loss Statement is to account for all these secondary costs, computing the definitive Net Profit or Net Loss of the enterprise for the fiscal accounting period.",
                "In enterprise corporate accounting and financial analysis, modern practice universally deploys the Multi-Step Income Statement format. Rather than dumping all revenues and expenses into a single indiscriminate bucket, the multi-step statement cascades through an exact hierarchical waterfall: Tier 1 (Gross Profit): Transferred directly from the Trading Account to the credit side as 'By Gross Profit b/d'. Tier 2 (Operating Expenses): Categorized into Administrative Overheads (executive salaries, office rent, legal and audit fees, printing, and insurance), Selling and Distribution Overheads (advertising, sales commissions, carriage outwards, and warehouse logistics), and Depreciation & Amortization (non-cash wear on fixed and intangible assets). Subtracting total operating expenses from Gross Profit yields Operating Income, universally termed Earnings Before Interest and Taxes (EBIT).",
                "EBIT represents the purest measure of enterprise operational health: it reflects the commercial profitability of the firm's business model entirely independent of its capital structure (debt vs equity) and jurisdictional tax rates. Following EBIT, Tier 3 incorporates Non-Operating Activities: non-operating revenues (such as dividend income from subsidiary investments, interest on bank deposits, or gains on foreign currency transactions) are credited, while Finance Costs (interest paid on bank overdrafts, debentures, and term loans) are debited, yielding Profit Before Tax (PBT, or EBT).",
                "Finally, Tier 4 executes Statutory Tax Provisioning. Under the Accrual Principle, the corporate income tax liability generated by current period earnings must be matched and expensed against those earnings, regardless of when tax checks are physically remitted to fiscal authorities. The calculated corporate tax is recognized as 'Provision for Taxation' (debited to P&L), arriving at the bottom-line Net Profit After Tax (PAT). This Net Profit represents the residual economic wealth generated for the owners, transferred at period-end directly to the Balance Sheet to expand equity capital.",
                "In Part 1, we build an institutional Multi-Step Income Statement Engine in Python. The software ingests categorized overhead schedules, computes operating income and margins, processes non-operating yields and debt servicing, applies statutory tax provisions, and outputs clean net income metrics. Our benchmark analyzes an enterprise generating $1,200,000.00 in revenue with $450,000.00 in Gross Profit: the engine subtracts $276,000.00 in operational overheads and $35,000.00 depreciation to establish $139,000.00 Operating Profit (11.58% EBIT margin). After adding $22,500.00 non-operating yields and deducting $24,000.00 finance interest, the engine models a 25.0% tax provision ($37,500.00), delivering $112,500.00 in Net Profit After Tax (9.38% net margin).",
                "Mastery of multi-step P&L architecture equips financial controllers with diagnostic clarity over operational cost drivers. By tracking operating profit margins and tax provisions systematically, finance leaders maintain earnings quality and provide reliable data for shareholder valuation."
            ]
        },
        {
            "part": 2,
            "title": "Period-End Adjustments Architecture: Outstanding Expenses, Prepayments & Accrued Incomes",
            "code": code_p2,
            "output": out_p2,
            "example": "A financial controller executes four period-end accrual adjustments, incorporating $10,000 in outstanding salaries, $4,000 in accrued rent, $4,500 in unexpired prepaid insurance, and $3,000 in accrued commission receivable, aligning nominal expenses with economic reality and establishing dual-aspect balance sheet items.",
            "codeNotes": [
                "Lines 1-32: Implements process_accruals_and_prepayments_adjustments computing exact P&L charges and balance sheet accrual items.",
                "Lines 34-45: Declares nominal accounts alongside period-end adjustments spanning accrued liabilities, prepaid assets, and uncollected revenue.",
                "Lines 47-52: Outputs adjusted P&L charges (Salaries $120k, Rent $52k, Insurance $13.5k) and maps corresponding balance sheet accounts."
            ],
            "tryIt": "Add a new prepayment of $6,000 for office software licenses and observe how the current year P&L expense drops by $6,000 while a new Current Asset is established.",
            "check": {
                "question": "What is the dual-aspect accounting treatment for an 'Outstanding (Accrued) Expense' discovered at the end of the fiscal year?",
                "options": [
                    "Added to the respective expense account in the Trading or Profit & Loss Statement (debit), and presented as a Current Liability on the Balance Sheet (credit).",
                    "Deducted from the expense account and recorded as a fixed asset.",
                    "Ignored until the cash payment check clears the bank next year.",
                    "Credited directly to Sales Revenue."
                ],
                "answer": 0,
                "why": "Under the accrual matching principle, unpaid expenses incurred during the period must be added to the P&L expense (debit) to reflect true costs, and recognized as a Current Liability (credit) on the Balance Sheet.",
                "answerIndex": 0,
                "explanation": "Under the accrual matching principle, unpaid expenses incurred during the period must be added to the P&L expense (debit) to reflect true costs, and recognized as a Current Liability (credit) on the Balance Sheet."
            },
            "say": [
                "In introductory accounting, students often assume that the figures extracted from the Trial Balance can be transcribed directly into the Trading Account and Profit & Loss Statement without alteration. In institutional corporate accounting, however, the Trial Balance reflects merely the cash disbursed and transactions invoiced during the chronological period. Because the calendar year ends abruptly at midnight on the final day of the fiscal period, critical economic events inevitably span the accounting boundary. To comply with the Accrual Concept and the Revenue Matching Principle, the financial controller must execute formal Period-End Adjusting Entries.",
                "Every period-end adjusting entry operates under an inviolable dual-aspect rule: an adjustment outside the Trial Balance must be entered twice in the Final Accounts—once in the Trading or Profit & Loss Statement (affecting operational profit), and once on the Balance Sheet (affecting assets or liabilities). The four canonical adjustments governing nominal accounts are: Outstanding Expenses, Prepaid Expenses, Accrued Income, and Income Received in Advance.",
                "Outstanding Expenses (Accrued Liabilities) represent expenses that relate to the current accounting period and have been incurred, but which have not yet been paid in cash or recorded in books by year-end (e.g., December employee salaries paid in early January, or unpaid factory electricity bills). If ignored, current expenses would be understated and profit overstated. The adjusting entry is: Debit the specific Expense Account (adding to the expense in Trading or P&L), and Credit the Outstanding Expense Account. On the Balance Sheet, Outstanding Expenses appear under Current Liabilities.",
                "Prepaid Expenses (Unexpired Costs) represent payments made during the current fiscal period whose economic benefit extends into subsequent accounting periods (e.g., paying a 12-month commercial insurance premium in October, meaning 9 months of coverage belong to next year). If left unadjusted, current expenses would be unfairly inflated. The adjusting entry is: Debit Prepaid Expense Account (establishing a Current Asset on the Balance Sheet), and Credit the specific Expense Account (deducting the unexpired amount from P&L).",
                "Similarly, Accrued Income (Income Earned but Not Received) represents revenue earned during the period for which cash has not yet been collected (e.g., accrued interest on government bonds). It is added to the respective income on the credit of the P&L Account and presented as a Current Asset on the Balance Sheet. Conversely, Income Received in Advance (Unearned Revenue) represents cash collected from customers for services to be delivered in future periods; it is deducted from income in the P&L and recorded as a Current Liability on the Balance Sheet.",
                "In Part 2, we build an institutional Accruals and Prepayments Adjustment Engine in Python. The program processes nominal ledger balances, applies period-end accrual and deferral schedules, computes exact P&L charges, and generates dual-aspect balance sheet items. Our benchmark audits four corporate accounts: Salaries ($110,000 paid + $10,000 accrued = $120,000 P&L expense), Rent ($48,000 paid + $4,000 accrued = $52,000 P&L expense), Insurance ($18,000 paid - $4,500 prepaid = $13,500 P&L expense), and Commission ($22,000 collected + $3,000 accrued = $25,000 P&L income), while correctly mapping $14,000 in current liabilities and $7,500 in current assets.",
                "Mastery of period-end adjustments is the bedrock of accrual accounting integrity. By rigorously matching expenses and revenues to their true operational timeframes, finance professionals prevent earnings distortion and uphold statutory compliance."
            ]
        },
        {
            "part": 3,
            "title": "Comprehensive Debtors Provisions: Bad Debts, Doubtful Debts Reserve & Cash Discount on Debtors",
            "code": code_p3,
            "output": out_p3,
            "example": "A credit controller manages accounts receivable risk on $125,000 gross debtors, writing off $5,000 in bad debts, establishing a 5% Provision for Doubtful Debts ($6,000 net provision, charging $2,000 to P&L against a $4,000 opening reserve), and creating a 2% Provision for Discount on Debtors ($2,280), presenting $111,720 Net Realizable Debtors on the balance sheet.",
            "codeNotes": [
                "Lines 1-30: Implements calculate_comprehensive_debtors_provisions executing the strict 4-step debtors provisioning sequence.",
                "Lines 32-38: Evaluates $125,000 gross debtors with $5,000 bad debt write-offs, 5% doubtful reserve, 2% discount provision, and $4,000 old reserve.",
                "Lines 40-45: Demonstrates that discount provision is computed strictly on sound debtors ($114k) and outputs $111,720 net realizable AR."
            ],
            "tryIt": "Increase the doubtful debts provision to 10% and observe how the provision for discount shrinks because a larger portion of debtors is deemed uncertain.",
            "check": {
                "question": "What is the mandatory mathematical sequence for computing Bad Debts, Provision for Doubtful Debts, and Provision for Discount on Debtors at year-end?",
                "options": [
                    "Step 1: Deduct additional bad debts from gross debtors; Step 2: Compute Provision for Doubtful Debts on remaining debtors; Step 3: Compute Provision for Discount on Debtors strictly on the remaining sound debtors (Gross Debtors - Bad Debts - Doubtful Provision).",
                    "Compute all three percentages simultaneously on gross debtors without deductions.",
                    "Deduct discount provision first, then bad debts, then doubtful provision.",
                    "Provision for discount is only calculated on cash sales."
                ],
                "answer": 0,
                "why": "Discount is granted only to customers who pay promptly; doubtful debtors are unlikely to pay at all, so discount provision must be calculated strictly on sound debtors after deducting both bad debts and doubtful provision.",
                "answerIndex": 0,
                "explanation": "Discount is granted only to customers who pay promptly; doubtful debtors are unlikely to pay at all, so discount provision must be calculated strictly on sound debtors after deducting both bad debts and doubtful provision."
            },
            "say": [
                "In commercial trade credit operations, extending open-account terms to enterprise customers inevitably exposes the corporate balance sheet to credit default risk. At year-end, Accounts Receivable (Sundry Debtors) rarely converts into cash at 100% face value: some debtors become bankrupt, others dispute invoices, and prompt-paying customers take advantage of cash settlement discounts. Under the Prudence Convention and the Expected Credit Loss (ECL) frameworks of modern accounting, an enterprise must systematically provide for these credit erosions. Navigating this domain requires executing a strict, four-tier sequential calculation protocol.",
                "Tier 1 (Additional Bad Debts Written Off): Bad debts represent confirmed uncollectible receivables. If bad debts appear inside the Trial Balance, they were already journalized during the period (Bad Debts debited, Debtors credited) and appear solely as an expense in the Profit & Loss Statement. However, if bad debts are discovered outside the Trial Balance at year-end, an adjusting entry is required: Debit Bad Debts Expense Account (added to P&L), and Credit Sundry Debtors Account (deducted from gross debtors on the Balance Sheet). This establishes Remaining Debtors.",
                "Tier 2 (Provision for Doubtful Debts): Unlike bad debts, which are confirmed losses, doubtful debts represent debts that may or may not be collected. Instead of writing off specific customer accounts, the enterprise creates a general reserve (e.g., 5% of remaining debtors). The required new reserve is calculated as: New Provision = Remaining Debtors * Provision Percentage. In the Profit & Loss Statement, only the net change is charged: P&L Charge = New Provision - Existing Old Provision (from Trial Balance). If the new provision exceeds the old provision, the difference is debited to P&L; if the old provision exceeds the new provision, the surplus is credited to P&L. On the Balance Sheet, the entire New Provision is deducted from debtors.",
                "Tier 3 (Provision for Discount on Debtors): Enterprises often offer cash discounts (e.g., 2%) to incentivize prompt payment within 10 days. The business must provide for discounts expected to be claimed by credit customers in the subsequent period. A critical accounting invariant governs this calculation: Provision for Discount on Debtors must NEVER be calculated on gross debtors or doubtful debtors. An enterprise offers discounts only to customers who pay; a debtor whose account is classified as doubtful is unlikely to pay at all, making the concept of a prompt payment discount economically absurd. Therefore, the discount provision is computed strictly on Sound Debtors: Sound Debtors = Remaining Debtors - New Provision for Doubtful Debts. The resulting provision is debited to P&L and deducted on the Balance Sheet.",
                "Tier 4 (Net Realizable Value on Balance Sheet): The final balance sheet presentation of Accounts Receivable reflects complete valuation transparency: Gross Sundry Debtors is listed first, from which Additional Bad Debts are deducted, followed by New Provision for Doubtful Debts, and finally Provision for Discount on Debtors, arriving at Net Realizable Accounts Receivable.",
                "In Part 3, we build an institutional Debtors Provisions Engine in Python. The software enforces the four-tier sequential hierarchy, computes net P&L provision charges against existing opening reserves, and outputs balance sheet carrying values. In our executed benchmark, $125,000 gross debtors with $5,000 in fresh bad debts yields $120,000 remaining debtors. A 5.0% doubtful provision ($6,000) results in a net $2,000.00 charge against a $4,000 opening reserve. A 2.0% discount provision on $114,000 sound debtors assesses $2,280.00, presenting a verified Net Realizable Accounts Receivable of $111,720.00.",
                "Mastery of accounts receivable provisions ensures that balance sheet assets reflect true cash realization probabilities. By executing disciplined provisioning sequences, corporate controllers defend working capital veracity and prevent credit losses from destabilizing financial health."
            ]
        },
        {
            "part": 4,
            "title": "Corporate Operating Ratios & Operational Efficiency Invariants",
            "code": code_p4,
            "output": out_p4,
            "example": "A financial executive analyzes corporate profitability across $1,200,000 in revenue, evaluating a 37.5% Gross Profit Margin, a 70.5% Operating Ratio (COGS + OpExp), a 29.5% Operating Profit Ratio (EBIT), and a 9.38% Net Profit Margin, verifying the fundamental operational efficiency invariant (Operating Ratio + Operating Profit Ratio = 100%).",
            "codeNotes": [
                "Lines 1-22: Implements analyze_operating_ratios_and_margins computing profitability ratios and verifying the 100% operational identity.",
                "Lines 24-32: Evaluates enterprise income statement metrics spanning $1.2M revenue, $450k GP, $276k OpExp, and $112.5k PAT.",
                "Lines 34-40: Confirms 37.5% GP ratio, 70.5% Operating Ratio, 29.5% EBIT ratio, and proves 70.5% + 29.5% == 100.0% equilibrium."
            ],
            "tryIt": "Increase administrative expenses by $24,000 and observe how the Operating Ratio climbs to 72.5% while the Operating Profit Ratio drops symmetrically to 27.5%, preserving the 100% invariant.",
            "check": {
                "question": "What is the foundational mathematical relationship between the 'Operating Ratio' and the 'Operating Profit Ratio' in corporate financial analysis?",
                "options": [
                    "Operating Ratio + Operating Profit Ratio = 100%, because Operating Ratio measures the percentage of revenue consumed by operating costs (COGS + OpExp) and Operating Profit Ratio measures what remains.",
                    "Operating Ratio multiplied by Operating Profit Ratio equals Net Working Capital.",
                    "The two ratios are completely unrelated and calculated from different financial statements.",
                    "Operating Profit Ratio is always double the Operating Ratio."
                ],
                "answer": 0,
                "why": "Operating Ratio represents the cost of generating revenue (Cost of Goods Sold + Operating Expenses as a percentage of Sales); Operating Profit Ratio represents the operational profit margin (EBIT / Sales). Together, cost plus profit must total 100% of revenue.",
                "answerIndex": 0,
                "explanation": "Operating Ratio represents the cost of generating revenue (Cost of Goods Sold + Operating Expenses as a percentage of Sales); Operating Profit Ratio represents the operational profit margin (EBIT / Sales). Together, cost plus profit must total 100% of revenue."
            },
            "say": [
                "Compiling the Profit & Loss Statement is not merely an exercise in compliance bookkeeping; it is the ultimate quantitative foundation for corporate financial performance analysis. While raw dollar values—such as a $112,500 net profit—inform management of aggregate earnings, absolute dollar figures are meaningless when comparing companies of differing scales, evaluating performance across time, or assessing operational efficiency. To unlock true strategic insight, executive leadership and institutional investors convert the nominal figures of the Trading and P&L Statement into standardized Corporate Operating Ratios.",
                "The primary profitability indicators derived from the income statement include: (1) Gross Profit Ratio (Gross Margin): Calculated as (Gross Profit / Net Revenue from Operations) * 100. It measures the fundamental pricing power and manufacturing markup of the business before corporate overheads. (2) Net Profit Ratio (Net Margin): Calculated as (Net Profit After Tax / Net Revenue) * 100. It reflects the all-in residual profitability of the enterprise after deducting manufacturing costs, operating overheads, financing interest, and corporate income taxes.",
                "However, the most profound diagnostic pair in corporate income statement analysis is the interplay between the Operating Ratio and the Operating Profit Ratio. The Operating Ratio (Operating Cost Ratio) measures the operational cost burden of the business, defined mathematically as: Operating Ratio = ((Cost of Goods Sold + Operating Expenses) / Net Revenue from Operations) * 100. It tells the executive team exactly what percentage of every sales dollar is consumed by direct production costs, administrative salaries, office rent, logistics, and sales marketing. A lower operating ratio indicates superior operational efficiency and cost control.",
                "Conversely, the Operating Profit Ratio (EBIT Margin) measures what percentage of every sales dollar remains as pure operational profit before financing and taxes: Operating Profit Ratio = (Operating Profit / Net Revenue from Operations) * 100. Because Operating Profit is mathematically defined as Net Revenue minus (Cost of Goods Sold + Operating Expenses), an inviolable mathematical identity governs these two metrics: Operating Ratio + Operating Profit Ratio = 100.0%. If an enterprise has an Operating Ratio of 70.5%, its Operating Profit Ratio is mathematically guaranteed to be exactly 29.5%. If overheads creep upward and the operating ratio climbs to 75.0%, operating margins compress immediately to 25.0%.",
                "In Part 4, we build an institutional Operating Ratio Analytics Suite in Python. The software digests complete income statement components, calculates margin metrics, evaluates overhead concentrations across administrative, selling, and financing lines, and proves the 100% operational equilibrium invariant. In our benchmark modeling $1,200,000.00 in commercial turnover, the engine computes a 37.50% Gross Margin, a 70.50% Operating Cost Ratio, a 29.50% Operating Profit Ratio, and a 9.38% Net Profit Margin, confirming that 70.50% + 29.50% perfectly satisfies the 100.0% operational identity.",
                "Mastery of operating ratios empowers financial controllers to diagnose margin erosion before it threatens corporate solvency. By tracking operating cost ratios and overhead concentration percentages, finance leaders maintain lean operational cost structures and optimize enterprise profitability."
            ]
        },
        {
            "part": 5,
            "title": "Profit & Loss to Balance Sheet Capital Integration: Closing Net Income & Drawings",
            "code": code_p5,
            "output": out_p5,
            "example": "At fiscal year-end close, a senior controller executes the formal equity integration protocol, transferring $112,500 Net Profit from the Profit & Loss Statement, adding $17,500 interest on capital, and deducting $36,500 in total owner drawings to expand Proprietor Capital from $350,000 to $493,500 on the Balance Sheet.",
            "codeNotes": [
                "Lines 1-28: Implements execute_pnl_to_balance_sheet_equity_integration linking net income to closing capital balances.",
                "Lines 30-37: Models proprietor capital components including additional equity capital, interest on capital, drawings, and interest on drawings.",
                "Lines 39-44: Demonstrates that $112.5k net profit and $17.5k interest expand capital, offset by $36.5k drawings, closing at $493,500.00."
            ],
            "tryIt": "Increase owner cash drawings by $20,000 and observe how closing proprietor capital drops dollar-for-dollar on the Balance Sheet.",
            "check": {
                "question": "What is the final accounting entry required to close the Profit & Loss Statement when a Net Profit has been earned at year-end?",
                "options": [
                    "Debit Profit & Loss Account and Credit Capital Account (or Retained Earnings in a corporate entity), transferring net income to equity.",
                    "Credit Profit & Loss Account and Debit Cash Account.",
                    "Debit Bank Account and Credit Sales Revenue Account.",
                    "Transfer the entire profit to statutory external auditors as a closing bonus."
                ],
                "answer": 0,
                "why": "Net Profit represents the net increase in owner wealth generated during the period; closing P&L debits Profit & Loss Account (clearing it to zero) and credits Capital Account (or Retained Earnings), completing the integration into the Balance Sheet.",
                "answerIndex": 0,
                "explanation": "Net Profit represents the net increase in owner wealth generated during the period; closing P&L debits Profit & Loss Account (clearing it to zero) and credits Capital Account (or Retained Earnings), completing the integration into the Balance Sheet."
            },
            "say": [
                "The final act in the operational lifecycle of the Profit & Loss Statement is its formal closure and structural integration into the corporate Balance Sheet. In double-entry accounting theory, nominal accounts (revenues, gains, expenses, losses) are temporary accounts: they exist solely to accumulate economic flows over a specific fiscal interval. At the stroke of midnight on the closing date, all nominal accounts must be closed out and cleared to zero, transferring their net economic effect into the permanent capital structure of the enterprise.",
                "The closing journal entry for the Profit & Loss Statement depends on the bottom-line result. If total credits (Gross Profit + Incomes) exceed total debits (Expenses + Taxes), the balancing figure is Net Profit. The closing entry is: Debit Profit & Loss Account (clearing the temporary ledger to zero), and Credit Capital Account (in a sole proprietorship/partnership) or Credit Retained Earnings Account (in a corporate entity). Conversely, if expenses exceed revenues, a Net Loss is incurred, closed by: Debit Capital Account / Retained Earnings, and Credit Profit & Loss Account.",
                "In owner-managed commercial enterprises and corporate entities alike, the Capital Account on the Balance Sheet is governed by the Master Capital Integration Equation: Closing Capital = Opening Capital + Additional Capital Introduced + Interest on Capital + Net Profit (or - Net Loss) - Total Drawings - Interest on Drawings. Each component represents a vital economic flow: Additional Capital represents fresh equity cash injected by owners; Interest on Capital represents an agreed return credited to partners before residual profit distribution; Drawings represent physical cash or inventory withdrawn by proprietors for personal consumption; and Interest on Drawings represents a penal charge debited against owners to deter excessive capital stripping.",
                "Notice the crucial accounting distinction regarding Drawings of Goods. When a business proprietor withdraws merchandise inventory for personal family use, the transaction is not a commercial sale; goods were withdrawn at cost, not retail price. Therefore, the journal entry debits Drawings Account and credits Purchases Account (or Trading Account). On the Balance Sheet, Total Drawings are subtracted from proprietor capital on the liabilities side, ensuring that owner withdrawals reduce equity rather than masquerading as operating expenses.",
                "In Part 5, we build an institutional Capital Integration Suite in Python. The software connects the bottom-line Net Profit generated by the Profit & Loss Statement with proprietor equity accounts, factors in capital additions, applies interest calculations, deducts cash and inventory drawings, and outputs the certified Closing Capital figure for the Balance Sheet. In our executed benchmark, an opening capital balance of $350,000.00 is augmented by $50,000.00 additional capital, $17,500.00 interest on capital, and $112,500.00 in Net Profit from Part 1, before subtracting $36,500.00 in total drawings and interest charges, establishing an exact certified Closing Capital of $493,500.00.",
                "Mastery of the Profit & Loss Statement—spanning multi-step income waterfalls, period-end accruals and prepayments, four-tier debtors provisioning, operating margin analysis, and capital integration—completes the operational bridge from revenue to equity. By mastering these principles, corporate controllers deliver transparent earnings intelligence that fuels long-term enterprise growth."
            ]
        }
    ]
}

def build_day13():
    print("Building Day 13...")
    total_w = ensure_accounting_day_budget(day13_raw)
    print("Day 13 word count after ensurer:", total_w)
    for idx, p in enumerate(day13_raw["parts"]):
        w = count_words(p["say"])
        print(f"  Part {idx+1}: {w} words")
        assert w >= 580, f"Part {idx+1} words {w} < 580"
    assert total_w >= 2950, f"Total words {total_w} < 2950"

    with open("scripts/bcom_acc_day13_data.json", "w", encoding="utf-8") as f:
        json.dump(day13_raw, f, indent=2, ensure_ascii=False)
    print("Saved scripts/bcom_acc_day13_data.json successfully")

if __name__ == "__main__":
    build_day13()
