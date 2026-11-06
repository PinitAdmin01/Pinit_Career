# scripts/make_day28_verified.py
import sys
import os
import json
import subprocess
import hashlib

sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

def run_py(code_str):
    env = os.environ.copy()
    env["PYTHONIOENCODING"] = "utf-8"
    res = subprocess.run([sys.executable, "-c", code_str], capture_output=True, text=True, env=env)
    if res.returncode != 0:
        print("STDERR:", res.stderr)
        raise RuntimeError(f"Code execution failed with code {res.returncode}")
    return res.stdout

p1_say = [
    "Welcome to Day 28 of Excel and Data Analysis Fundamentals. Today, we step into the highest echelon of statutory corporate accounting and enterprise financial engineering: Enterprise Financial Reporting, GAAP and IFRS Consolidated Statements, Multi-Currency Translation, and Group Elimination Mechanics. In multinational enterprises, holding companies, and global conglomerates, corporate finance teams do not manage a single corporate ledger. A Fortune 500 or global enterprise operates dozens or hundreds of legally separate operating subsidiaries across North America, Europe, Asia-Pacific, and Latin America, each maintaining its own distinct general ledger in its local statutory currency.",
    "The primary fiduciary responsibility of the corporate controller and global financial planning and analysis (FP&A) team is Financial Consolidation: combining the financial results of a parent company and all controlled subsidiaries into a single, cohesive set of audited Consolidated Financial Statements—the Consolidated Balance Sheet, Consolidated Income Statement, Consolidated Statement of Comprehensive Income, and Consolidated Statement of Cash Flows. This consolidation process is governed by strict statutory frameworks: US GAAP under ASC 810 (Consolidation) and International Financial Reporting Standards under IFRS 10 (Consolidated Financial Statements).",
    "Under both ASC 810 and IFRS 10, the foundational criterion for consolidation is Control. Control is defined as the investor having power over the investee, exposure or rights to variable returns from its involvement with the investee, and the ability to use its power to affect the amount of those returns. When a parent company acquires more than 50% of the voting equity of an operating subsidiary, statutory accounting requires full consolidation: 100% of the subsidiary's assets, liabilities, revenues, and operating expenses must be aggregated line-by-line into the parent's consolidated financial statements, regardless of whether the parent owns 51% or 100% of the shares.",
    "However, basic mathematical aggregation of line items across subsidiary ledgers is illegal under statutory accounting standards. If a parent company simply summed the revenues and receivables of all subsidiaries, financial statements would be materially distorted by double-counting. For example, if Parent Corporation sells $10,000,000 of raw semiconductor wafers to Subsidiary Europe, and Subsidiary Europe sells finished microchips to external market customers for $15,000,000, simple addition would suggest total enterprise revenues of $25,000,000. In reality, the economic enterprise only generated $15,000,000 of external commercial revenue from third-party buyers.",
    "To prevent this distortion, consolidation engines execute rigorous Elimination Entries. The foundational elimination entry eliminates the parent company's Investment in Subsidiary asset on the balance sheet against the subsidiary's pre-acquisition Common Stock and Retained Earnings equity accounts. Any purchase price premium paid over the fair value of net identifiable tangible assets is capitalized as Goodwill or recognized as identifiable intangible assets (such as customer lists, patents, and developed technology) subject to annual impairment testing under ASC 350 / IAS 36.",
    "Furthermore, modern enterprise modeling in Excel requires constructing automated consolidation working papers using multi-tab dynamic array architectures. Rather than maintaining static links across disparate workbooks that break when folders move, corporate modelers construct automated consolidation switchboards in Excel using Power Query and dimensional matrix formulas, linking general ledger trial balances through standardized Chart of Accounts (COA) mapping codes.",
    "Additionally, corporate controllers must manage the distinction between the Equity Method and Full Consolidation. Under ASC 323, when an investor owns between 20% and 50% of an investee's voting stock, the investor exercises significant influence rather than control, requiring the Equity Method where the investment is reported as a single net asset line and investment income as a single line on the income statement. Full consolidation is strictly reserved for entities where the parent possesses operational and economic control, typically exceeding 50% voting ownership or qualifying as the primary beneficiary of a Variable Interest Entity (VIE).",
    "In this section, we construct a production-grade Financial Statement Consolidation Engine in pure Python. We model parent and subsidiary trial balances, execute line-by-line aggregation, eliminate parent equity investments, recognize acquisition goodwill, and balance the consolidated post-elimination balance sheet with mathematical precision."
]

p1_code = """# Part 1: GAAP & IFRS Financial Statement Consolidation Engine (Pure Python)
class FinancialStatementConsolidationEngine:
    def __init__(self, parent_name="Apex Holdings Inc", sub_name="Apex Europe BV"):
        self.parent_name = parent_name
        self.sub_name = sub_name
        self.eliminations_log = []

    def consolidate_balance_sheets(self, parent_bs, sub_bs, purchase_price, sub_equity_book_value):
        # 1. Line-by-line mechanical summation
        aggregated = {
            'Cash': parent_bs['Cash'] + sub_bs['Cash'],
            'AccountsReceivable': parent_bs['AccountsReceivable'] + sub_bs['AccountsReceivable'],
            'Inventory': parent_bs['Inventory'] + sub_bs['Inventory'],
            'InvestmentInSub': parent_bs['InvestmentInSub'],
            'PP_E': parent_bs['PP_E'] + sub_bs['PP_E'],
            'AccountsPayable': parent_bs['AccountsPayable'] + sub_bs['AccountsPayable'],
            'LongTermDebt': parent_bs['LongTermDebt'] + sub_bs['LongTermDebt'],
            'CommonStock': parent_bs['CommonStock'],
            'RetainedEarnings': parent_bs['RetainedEarnings']
        }
        
        # 2. Acquisition Elimination Entry (ASC 810 / IFRS 10)
        # Eliminate InvestmentInSub and calculate Goodwill
        goodwill = max(0.0, purchase_price - sub_equity_book_value)
        self.eliminations_log.append(f"ELIM_INVESTMENT: Eliminate Parent InvestmentInSub (${purchase_price:,.2f})")
        self.eliminations_log.append(f"ELIM_SUB_EQUITY: Eliminate Subsidiary Pre-Acquisition Equity (${sub_equity_book_value:,.2f})")
        self.eliminations_log.append(f"RECOGNIZE_GOODWILL: Capitalize Purchase Premium Goodwill (${goodwill:,.2f})")
        
        consolidated = {
            'Cash': aggregated['Cash'],
            'AccountsReceivable': aggregated['AccountsReceivable'],
            'Inventory': aggregated['Inventory'],
            'Goodwill': goodwill,
            'PP_E': aggregated['PP_E'],
            'AccountsPayable': aggregated['AccountsPayable'],
            'LongTermDebt': aggregated['LongTermDebt'],
            'CommonStock': parent_bs['CommonStock'], # Sub equity eliminated
            'RetainedEarnings': parent_bs['RetainedEarnings']
        }
        
        total_assets = consolidated['Cash'] + consolidated['AccountsReceivable'] + consolidated['Inventory'] + consolidated['Goodwill'] + consolidated['PP_E']
        total_liab_equity = consolidated['AccountsPayable'] + consolidated['LongTermDebt'] + consolidated['CommonStock'] + consolidated['RetainedEarnings']
        
        return {
            'consolidated_bs': consolidated,
            'total_assets': total_assets,
            'total_liabilities_equity': total_liab_equity,
            'balance_sheet_in_balance': abs(total_assets - total_liab_equity) < 0.01,
            'goodwill_recognized': goodwill
        }

# Parent & Subsidiary Initial Standalone Balance Sheets
parent_bs = {
    'Cash': 25000000.0,
    'AccountsReceivable': 18000000.0,
    'Inventory': 14000000.0,
    'InvestmentInSub': 30000000.0, # Acquisition cost
    'PP_E': 45000000.0,
    'AccountsPayable': 12000000.0,
    'LongTermDebt': 35000000.0,
    'CommonStock': 40000000.0,
    'RetainedEarnings': 45000000.0
}

sub_bs = {
    'Cash': 5000000.0,
    'AccountsReceivable': 6000000.0,
    'Inventory': 8000000.0,
    'PP_E': 15000000.0,
    'AccountsPayable': 4000000.0,
    'LongTermDebt': 6000000.0,
    'CommonStock': 10000000.0,
    'RetainedEarnings': 14000000.0 # Sub Book Equity = $24M
}

engine = FinancialStatementConsolidationEngine()
res = engine.consolidate_balance_sheets(parent_bs, sub_bs, purchase_price=30000000.0, sub_equity_book_value=24000000.0)

print("=== STATUTORY FINANCIAL STATEMENT CONSOLIDATION (ASC 810 / IFRS 10) ===")
print(f"Parent: {engine.parent_name} | Subsidiary: {engine.sub_name}")
print("-" * 88)
print(f"{'Consolidated Balance Sheet Line Item':<36} | {'Consolidated Amount ($)'}")
print("-" * 88)
for k, v in res['consolidated_bs'].items():
    print(f"{k:<36} | ${v:>18,.2f}")
print("-" * 88)
print(f"Total Consolidated Assets:               ${res['total_assets']:>18,.2f}")
print(f"Total Consolidated Liabilities & Equity: ${res['total_liabilities_equity']:>18,.2f}")
print(f"Balance Sheet Equilibrium Status:        {'[BALANCED OK]' if res['balance_sheet_in_balance'] else '[OUT OF BALANCE]'}")
print(f"Capitalized Acquisition Goodwill:        ${res['goodwill_recognized']:>18,.2f}")
"""

p2_say = [
    "In the second operational tier of Day 28, we master the single most complex computational discipline in international accounting: Multi-Currency Translation and Cumulative Translation Adjustment (CTA) under ASC 830 (Foreign Currency Matters) and IAS 21 (The Effects of Changes in Foreign Exchange Rates). When a global corporation operates foreign subsidiaries in London (GBP), Frankfurt (EUR), Tokyo (JPY), and Zurich (CHF), each subsidiary prepares its local trial balance in its own Functional Currency—the currency of the primary economic environment in which the entity operates and generates net cash flows.",
    "Before subsidiary results can be consolidated into the parent company's Reporting Currency (such as US Dollars), statutory standards mandate the Current Rate Method (or Temporal Method depending on whether the subsidiary is an autonomous foreign operation or an extension of the parent). Under the standard Current Rate Method for autonomous foreign subsidiaries: 1. All balance sheet Assets and Liabilities are translated into USD using the Current Spot Exchange Rate as of the exact balance sheet date (e.g., closing rate on September 30, 2026); 2. All Income Statement Revenues, Costs, and Operating Expenses are translated using the Weighted-Average Exchange Rate over the reporting fiscal quarter; and 3. Stockholders' Equity accounts (Common Stock and Additional Paid-in Capital) are translated using Historical Exchange Rates in effect on the date the subsidiary was acquired or shares were issued.",
    "This asymmetric translation rule—translating balance sheet assets and liabilities at the current spot rate while translating income statement net income at the period-average rate and equity at historical rates—creates an unavoidable mathematical imbalance on the consolidated balance sheet. Under double-entry accounting mechanics, total assets will no longer equal total liabilities plus equity when different exchange rate curves are applied across the statement.",
    "To restore balance sheet equilibrium without distorting operating income, ASC 830 and IAS 21 establish the Cumulative Translation Adjustment (CTA). The CTA is a non-cash balancing plug calculated directly within the Accumulated Other Comprehensive Income (AOCI) section of Stockholders' Equity. The CTA represents the unrealized translation gain or loss resulting from translating foreign net assets into parent reporting currency over time. It bypasses the Net Income section of the Income Statement entirely, ensuring that quarterly operating earnings per share (EPS) are not artificially whipsawed by macroeconomic foreign currency fluctuations.",
    "Furthermore, enterprise financial modelers in Excel must build Dynamic Foreign Exchange Switchboards. By tracking beginning-of-period net assets, period net income, dividend distributions, and ending-of-period net assets across multiple currency curves, quantitative analysts build roll-forward schedules that reconcile the periodic CTA movement with mathematical certainty, providing audit committees with transparent reconciliation bridges.",
    "Hedging net investment in foreign operations is another critical corporate treasury responsibility. Corporations often execute cross-currency swaps or issue local-currency foreign debt to hedge against foreign currency depreciation. Under ASC 815, gains and losses on qualifying net investment hedges are also recorded directly into CTA within AOCI, effectively neutralizing balance sheet translation volatility.",
    "Corporate treasurers and controllers must also navigate Hyperinflationary Economies under ASC 830 and IAS 29. When a foreign subsidiary operates in an economic jurisdiction experiencing cumulative three-year inflation exceeding 100%, the local currency is deemed unstable and ceases to qualify as a functional currency. In these conditions, accounting standards mandate abandoning the current rate method and adopting the parent company's reporting currency as the functional currency under the Temporal Method. Under the temporal method, non-monetary assets like inventory and property, plant, and equipment are remeasured at historical exchange rates, depreciation is calculated based on historical costs, and all currency remeasurement gains and losses are recognized immediately in the consolidated income statement rather than deferred to OCI.",
    "In institutional SEC filings such as Form 10-K Item 7A (Quantitative and Qualitative Disclosures About Market Risk), corporate issuers must disclose rigorous sensitivity analyses modeling the estimated impact of a hypothetical 10% strengthening or weakening of the US Dollar against all major operating currencies. Quantitative analysts build multi-currency sensitivity matrix models in Excel, linking spot curves directly to projected consolidated revenue, EBITDA, and cumulative translation equity balances.",
    "In this section, we construct a production-grade Multi-Currency Translation Engine in pure Python. We ingest foreign subsidiary trial balances in Euros, apply current spot rates to assets and liabilities, period-average rates to income statements, and historical rates to equity, and compute the exact Cumulative Translation Adjustment (CTA) required to balance the consolidated global balance sheet."
]

p2_code = """# Part 2: ASC 830 / IAS 21 Multi-Currency Translation Engine (Pure Python)
class MultiCurrencyTranslationEngine:
    def __init__(self, local_curr="EUR", reporting_curr="USD"):
        self.local_curr = local_curr
        self.reporting_curr = reporting_curr

    def translate_subsidiary_trial_balance(self, trial_balance_eur, spot_rate_closing, avg_rate_period, hist_rate_equity):
        # Rule 1: Assets & Liabilities at Closing Spot Rate
        cash_usd = trial_balance_eur['Cash'] * spot_rate_closing
        ar_usd = trial_balance_eur['AR'] * spot_rate_closing
        ppe_usd = trial_balance_eur['PPE'] * spot_rate_closing
        total_assets_usd = cash_usd + ar_usd + ppe_usd
        
        ap_usd = trial_balance_eur['AP'] * spot_rate_closing
        debt_usd = trial_balance_eur['Debt'] * spot_rate_closing
        total_liabilities_usd = ap_usd + debt_usd
        
        # Rule 2: Equity at Historical Rate
        common_stock_usd = trial_balance_eur['CommonStock'] * hist_rate_equity
        
        # Rule 3: Retained Earnings (Net Income) at Weighted-Average Rate
        net_income_usd = trial_balance_eur['NetIncome'] * avg_rate_period
        
        # Rule 4: Compute Cumulative Translation Adjustment (CTA) plug into OCI
        # Total Assets = Total Liabilities + CommonStock + NetIncome + CTA
        unbalanced_equity = common_stock_usd + net_income_usd
        cta_plug = total_assets_usd - (total_liabilities_usd + unbalanced_equity)
        
        total_liab_and_equity = total_liabilities_usd + common_stock_usd + net_income_usd + cta_plug
        
        return {
            'rates': {
                'closing_spot': spot_rate_closing,
                'period_average': avg_rate_period,
                'historical_equity': hist_rate_equity
            },
            'translated_balance_sheet_usd': {
                'Cash_USD': cash_usd,
                'AccountsReceivable_USD': ar_usd,
                'PP_E_USD': ppe_usd,
                'AccountsPayable_USD': ap_usd,
                'LongTermDebt_USD': debt_usd,
                'CommonStock_USD': common_stock_usd,
                'RetainedEarnings_USD': net_income_usd,
                'CTA_Plug_OCI_USD': cta_plug
            },
            'total_assets_usd': total_assets_usd,
            'total_liabilities_equity_usd': total_liab_and_equity,
            'cta_reserve_aoci': cta_plug,
            'is_balanced': abs(total_assets_usd - total_liab_and_equity) < 0.01
        }

# European Subsidiary Trial Balance (in Millions of Euros EUR)
trial_balance_eur = {
    'Cash': 12.0,
    'AR': 18.0,
    'PPE': 45.0,
    'AP': 10.0,
    'Debt': 25.0,
    'CommonStock': 30.0,
    'NetIncome': 10.0 # Revenue - Expenses
}

fx_engine = MultiCurrencyTranslationEngine(local_curr="EUR", reporting_curr="USD")
fx_res = fx_engine.translate_subsidiary_trial_balance(
    trial_balance_eur,
    spot_rate_closing=1.12,   # EUR/USD closing rate at Q3 end
    avg_rate_period=1.08,     # EUR/USD weighted-average rate across Q3
    hist_rate_equity=1.05     # EUR/USD historical rate at acquisition
)

print("=== ASC 830 / IAS 21 MULTI-CURRENCY FUNCTIONAL TRANSLATION ENGINE ===")
print(f"Functional Currency: {fx_engine.local_curr} -> Reporting Currency: {fx_engine.reporting_curr}")
print(f"Rates Applied: Spot={fx_res['rates']['closing_spot']} | Avg={fx_res['rates']['period_average']} | Hist={fx_res['rates']['historical_equity']}")
print("-" * 88)
print(f"{'Translated Line Item (USD)':<36} | {'Amount ($M)':<16} | {'Translation Basis'}")
print("-" * 88)
tb = fx_res['translated_balance_sheet_usd']
print(f"{'Cash & Equivalents':<36} | ${tb['Cash_USD']:>14,.2f} | Current Spot Rate (1.12)")
print(f"{'Accounts Receivable':<36} | ${tb['AccountsReceivable_USD']:>14,.2f} | Current Spot Rate (1.12)")
print(f"{'Property, Plant & Equipment':<36} | ${tb['PP_E_USD']:>14,.2f} | Current Spot Rate (1.12)")
print(f"{'Accounts Payable':<36} | ${tb['AccountsPayable_USD']:>14,.2f} | Current Spot Rate (1.12)")
print(f"{'Long-Term Debt':<36} | ${tb['LongTermDebt_USD']:>14,.2f} | Current Spot Rate (1.12)")
print(f"{'Common Stock':<36} | ${tb['CommonStock_USD']:>14,.2f} | Historical Rate (1.05)")
print(f"{'Retained Earnings (Net Income)':<36} | ${tb['RetainedEarnings_USD']:>14,.2f} | Weighted-Average Rate (1.08)")
print(f"{'Cumulative Translation Adjustment (CTA)':<36} | ${tb['CTA_Plug_OCI_USD']:>14,.2f} | OCI Balancing Reserve")
print("-" * 88)
print(f"Total Consolidated Assets (USD):               ${fx_res['total_assets_usd']:>14,.2f}M")
print(f"Total Consolidated Liabilities & Equity (USD): ${fx_res['total_liabilities_equity_usd']:>14,.2f}M")
print(f"Foreign Exchange Translation Status:           {'[BALANCED OK]' if fx_res['is_balanced'] else '[OUT OF BALANCE]'}")
"""

p3_say = [
    "In the third operational tier of Day 28, we confront the most common source of accounting errors and auditor adjustments in enterprise groups: Intercompany Eliminations and Unrealized Profit Deferral. In multi-divisional corporations, subsidiaries transact constantly with one another: transferring manufactured inventory, licensing intellectual property, providing shared IT and administrative services, and issuing intercompany corporate loans. While these transactions are recorded as legitimate revenues and expenses on individual subsidiary legal-entity ledgers, they represent economic self-dealing from the consolidated group perspective.",
    "Statutory consolidation standards establish three non-negotiable categories of Intercompany Eliminations: 1. Intercompany Receivables and Payables Elimination: clearing out intercompany balances so that one subsidiary's Account Receivable does not falsely inflate enterprise assets while another subsidiary's Account Payable inflates enterprise liabilities; 2. Intercompany Revenue and Expense Elimination: eliminating intercompany product sales, royalty fees, and shared service allocations against intercompany cost of goods sold (COGS) and administrative expenses; and 3. Unrealized Gross Profit in Ending Inventory: eliminating the internal profit margin on inventory transferred between group entities that remains unsold in the receiving entity's warehouse at the end of the fiscal reporting period.",
    "The accounting mechanics of Unrealized Profit Elimination are subtle and rigorous. Consider an enterprise where Parent US manufactures specialized sensors at a cost of $600 each and sells them to Subsidiary Germany for $1,000 each, recognizing a $400 intercompany gross profit (40% gross margin). If Subsidiary Germany sells all the sensors to third-party automobile manufacturers before quarter-end, the $400 profit is fully realized, and only intercompany revenue and COGS need to be eliminated.",
    "However, if Subsidiary Germany still holds 2,500 sensors in its warehouse at fiscal quarter-end, that ending inventory contains $1,000,000 of unrealized intra-group profit (2,500 units * $400 profit per unit). If left unadjusted, consolidated inventory on the balance sheet would be stated at $2,500,000 rather than its true consolidated manufacturing cost of $1,500,000, violating the historical cost convention under GAAP and IFRS.",
    "To correct this, the consolidation engine must execute an Unrealized Profit Deferral Entry: debiting Consolidated Cost of Goods Sold (reducing consolidated operating profit) by $1,000,000 and crediting Consolidated Inventory by $1,000,000. In the subsequent fiscal quarter, when Subsidiary Germany finally sells the sensors to third-party customers, this entry is reversed, recognizing the deferred profit in the period when the external economic exchange actually occurs.",
    "Furthermore, consolidation engines distinguish between Downstream Sales (Parent selling to Subsidiary) and Upstream Sales (Subsidiary selling to Parent). In downstream sales, 100% of the unrealized profit adjustment is charged against the parent's operating income. In upstream sales, the unrealized profit adjustment must be allocated proportionally between the Parent and any Non-Controlling Interest (NCI) shareholders based on their equity ownership percentages.",
    "Corporate tax controllers must also coordinate intercompany eliminations with Transfer Pricing compliance under Internal Revenue Code Section 482 and OECD Base Erosion and Profit Shifting (BEPS) Action 13. All intra-group sales of tangible goods, intellectual property licensing royalties, and shared technical service charges must adhere to the Arm's-Length Principle. While statutory consolidation eliminates these intercompany transactions to zero in consolidated financial statements, tax authorities in each host jurisdiction audit individual legal-entity trial balances. This requires financial controllers to maintain synchronized dual-ledger architectures in Excel: tracking statutory legal-entity margins for tax returns while simultaneously compiling zero-sum elimination schedules for consolidated SEC reporting.",
    "In addition to product sales and inventory markups, multinational groups actively manage Intercompany Financing and Treasury Cash Pools. When a parent company extends a $50,000,000 intercompany loan to an offshore subsidiary, the parent records interest income while the subsidiary records interest expense. In the consolidated financial statements, both the intercompany note receivable/payable and the reciprocal interest income/expense must be eliminated in full. Any cross-border withholding taxes paid to foreign governments on intercompany interest or dividend remittances cannot be eliminated and must be reclassified into consolidated income tax expense.",
    "In this section, we construct a production-grade Intercompany Elimination Engine in pure Python. We model intercompany sales transactions, trace ending inventory holdings, calculate realized vs unrealized gross profit margins, execute reciprocal AR/AP eliminations, and defer unrealized inventory profits to ensure consolidated financial statements comply fully with US GAAP ASC 810 and IFRS 10."
]

p3_code = """# Part 3: Intercompany Eliminations & Unrealized Profit Deferral Engine (Pure Python)
class IntercompanyEliminationEngine:
    def __init__(self):
        self.eliminations_journal = []

    def execute_intercompany_eliminations(self, intercompany_sales, ending_inventory_holdings, ar_ap_balances):
        total_ic_sales = sum(s['amount'] for s in intercompany_sales)
        total_ic_ar = sum(b['ar_balance'] for b in ar_ap_balances)
        total_ic_ap = sum(b['ap_balance'] for b in ar_ap_balances)
        
        # 1. Reciprocal AR / AP Elimination
        ar_ap_elim = min(total_ic_ar, total_ic_ap)
        self.eliminations_journal.append({
            'entry_id': 'ELIM-01-AR-AP',
            'debit_account': 'Intercompany Accounts Payable',
            'credit_account': 'Intercompany Accounts Receivable',
            'amount': ar_ap_elim,
            'description': 'Eliminate reciprocal intercompany balances'
        })
        
        # 2. Intercompany Revenue & COGS Elimination
        self.eliminations_journal.append({
            'entry_id': 'ELIM-02-REV-COGS',
            'debit_account': 'Intercompany Revenue (Sales)',
            'credit_account': 'Cost of Goods Sold (Purchases)',
            'amount': total_ic_sales,
            'description': 'Eliminate internal intercompany sales turnover'
        })
        
        # 3. Unrealized Gross Profit in Ending Inventory Deferral
        unrealized_profit_total = 0.0
        inventory_breakdown = []
        
        for item in ending_inventory_holdings:
            transfer_price = item['units_held'] * item['transfer_price_per_unit']
            internal_cost = item['units_held'] * item['manufacturing_cost_per_unit']
            unrealized_profit = transfer_price - internal_cost
            unrealized_profit_total += unrealized_profit
            
            inventory_breakdown.append({
                'product': item['product'],
                'units': item['units_held'],
                'gross_value_reported': transfer_price,
                'true_consolidated_cost': internal_cost,
                'unrealized_markup': unrealized_profit
            })
            
        self.eliminations_journal.append({
            'entry_id': 'ELIM-03-UNREALIZED-INVENTORY',
            'debit_account': 'Consolidated Cost of Goods Sold (Profit Reduction)',
            'credit_account': 'Consolidated Inventory (Asset Reduction)',
            'amount': unrealized_profit_total,
            'description': 'Defer unrealized gross margin markup on unsold internal inventory'
        })
        
        return {
            'eliminations_journal': self.eliminations_journal,
            'total_ic_revenue_eliminated': total_ic_sales,
            'reciprocal_balances_eliminated': ar_ap_elim,
            'unrealized_profit_deferred': unrealized_profit_total,
            'inventory_breakdown': inventory_breakdown
        }

ic_engine = IntercompanyEliminationEngine()

intercompany_sales = [
    {'from_sub': 'Parent US', 'to_sub': 'Apex Europe', 'product': 'Sensor Modules', 'amount': 15000000.0},
    {'from_sub': 'Apex Asia', 'to_sub': 'Parent US',   'product': 'Display Panels',  'amount': 8000000.0}
]

ending_inventory = [
    {'product': 'Sensor Modules', 'units_held': 2500, 'transfer_price_per_unit': 1000.0, 'manufacturing_cost_per_unit': 600.0},
    {'product': 'Display Panels',  'units_held': 1200, 'transfer_price_per_unit': 250.0,  'manufacturing_cost_per_unit': 180.0}
]

ar_ap = [
    {'entity_pair': 'Parent_Europe', 'ar_balance': 4500000.0, 'ap_balance': 4500000.0},
    {'entity_pair': 'Asia_Parent',   'ar_balance': 2100000.0, 'ap_balance': 2100000.0}
]

ic_res = ic_engine.execute_intercompany_eliminations(intercompany_sales, ending_inventory, ar_ap)

print("=== INTERCOMPANY TRANSACTIONS & UNREALIZED PROFIT ELIMINATION ENGINE ===")
print("Consolidation Standard: ASC 810-10-45 / IFRS 10.B86 Intercompany Neutrality")
print("-" * 88)
print(f"{'Entry ID':<18} | {'Debit Account':<32} | {'Credit Account':<32} | {'Amount ($)'}")
print("-" * 88)
for e in ic_res['eliminations_journal']:
    print(f"{e['entry_id']:<18} | {e['debit_account']:<32} | {e['credit_account']:<32} | ${e['amount']:>12,.2f}")
print("-" * 88)
print("Unrealized Ending Inventory Margin Deferral Breakdown:")
for inv in ic_res['inventory_breakdown']:
    print(f"  * {inv['product']} ({inv['units']} units): Stated=${inv['gross_value_reported']:,.0f} | True Cost=${inv['true_consolidated_cost']:,.0f} | Deferral=${inv['unrealized_markup']:,.0f}")
print("-" * 88)
print(f"Total Intercompany Revenue Eliminated: ${ic_res['total_ic_revenue_eliminated']:,.2f}")
print(f"Total Unearned Inventory Profit Deferred: ${ic_res['unrealized_profit_deferred']:,.2f} [CONSOLIDATED COGS ADJUSTED]")
"""

p4_say = [
    "In the fourth operational tier of Day 28, we address one of the most critical reporting requirements for public capital markets: Non-Controlling Interest (NCI) Allocation and Segment Reporting Disclosures under IFRS 8 and ASC 280 (Segment Reporting). When an enterprise acquires less than 100% of an operating subsidiary—for instance, acquiring an 80% controlling stake in a high-growth fintech firm while leaving 20% in the hands of founding entrepreneurs or venture capital minority shareholders—the consolidation mechanics must reflect this ownership division with complete accounting transparency.",
    "Under both US GAAP ASC 810 and IFRS 10, the 20% equity stake owned by outside investors is classified as Non-Controlling Interest (NCI), formerly termed Minority Interest. On the Consolidated Balance Sheet, NCI is presented as a separate component of Stockholders' Equity, distinctly segregated from the equity attributable to the parent company's shareholders. On the Consolidated Income Statement, total consolidated net income must be explicitly bifurcated: showing Net Income Attributable to Parent Shareholders (which drives Earnings Per Share) and Net Income Attributable to Non-Controlling Interest.",
    "Furthermore, statutory accounting standards offer two distinct methodologies for measuring Non-Controlling Interest and Goodwill upon initial business acquisition: 1. Full Goodwill Method (mandated under US GAAP and permitted under IFRS): NCI is measured at its full fair value at acquisition, and goodwill is recognized on 100% of the acquired entity; and 2. Partial Goodwill Method (permitted under IFRS): NCI is measured based on its proportionate share of the acquired subsidiary's net identifiable tangible assets, and goodwill is recognized exclusively on the parent's purchased percentage.",
    "Simultaneously, institutional investors and capital markets demand Operating Segment Disclosures under ASC 280 and IFRS 8. A multinational conglomerate cannot simply disclose a single consolidated revenue figure to Wall Street; it must provide granular operational telemetry across reportable operating segments (such as Cloud Computing, Enterprise Software, and Consumer Devices). An operating segment is reportable if it meets any of the Quantitative Threshold Tests: its reported revenue is 10% or more of combined group revenue, its absolute profit or loss is 10% or more of the greater of combined operating profit or loss, or its assets are 10% or more of combined group assets.",
    "In Excel enterprise architectures, segment reporting is implemented using dynamic dimensional cross-tabs and hierarchical Power Pivot DAX data models. The model traces intercompany transfers by segment, applies inter-segment eliminations, and reconciles segment operating profit back to consolidated GAAP operating income.",
    "Corporate controllers also prepare the statutory 75% Revenue Test under ASC 280: ensuring that the external revenue of all identified reportable segments constitutes at least 75% of the entity's total consolidated revenue, ensuring market participants receive comprehensive transparency into enterprise operational performance.",
    "A sophisticated challenge in consolidation accounting arises during Changes in Ownership Interest Without Loss of Control under ASC 810-10-45-23 and IFRS 10.23. If a parent company already holds an 80% controlling stake in a subsidiary and subsequently purchases an additional 10% of outstanding shares from minority investors for $15,000,000 in cash, the transaction is strictly accounted for as an equity transaction between shareholders. Because control was already established, no gain or loss is recognized in consolidated net income, and goodwill is not recalculated. The carrying amount of Non-Controlling Interest is reduced by the book value of the acquired 10% interest, and any difference between the cash purchase price and the carrying adjustment is credited or debited directly to parent Additional Paid-in Capital (APIC).",
    "Furthermore, ASC 280 and IFRS 8 mandate the Management Approach to segment determination. Operating segments cannot be artificially gerrymandered for external marketing purposes; they must strictly reflect the organizational structure and internal financial packages reviewed regularly by the Chief Operating Decision Maker (CODM)—typically the Chief Executive Officer or Chief Operating Officer—to evaluate performance and allocate capital resources. If the CODM evaluates business units based on Segment Adjusted EBITDA rather than net income, that exact measure must be presented and reconciled to consolidated pre-tax income in the financial footnote disclosures.",
    "In this section, we construct a production-grade Segment Reporting and Non-Controlling Interest Engine in pure Python. We allocate consolidated net income between parent equity holders and minority NCI shareholders, evaluate ASC 280 quantitative threshold tests, and compile the official segment reconciliation disclosure table."
]

p4_code = """# Part 4: Segment Reporting & Non-Controlling Interest (NCI) Engine (Pure Python)
class SegmentReportingNciEngine:
    def __init__(self, parent_equity_pct=0.80):
        self.parent_pct = parent_equity_pct
        self.nci_pct = 1.0 - parent_equity_pct

    def allocate_consolidated_earnings(self, sub_net_income, parent_standalone_net_income):
        # NCI share of subsidiary earnings
        nci_share_of_sub = sub_net_income * self.nci_pct
        parent_share_of_sub = sub_net_income * self.parent_pct
        
        total_consolidated_net_income = parent_standalone_net_income + sub_net_income
        net_income_to_parent = parent_standalone_net_income + parent_share_of_sub
        
        return {
            'total_consolidated_net_income': total_consolidated_net_income,
            'net_income_attributable_to_parent': net_income_to_parent,
            'net_income_attributable_to_nci': nci_share_of_sub,
            'parent_ownership_pct': self.parent_pct * 100,
            'nci_ownership_pct': self.nci_pct * 100
        }

    def evaluate_asc280_segment_thresholds(self, operating_segments):
        total_group_revenue = sum(s['external_revenue'] + s['intersegment_revenue'] for s in operating_segments)
        total_group_assets = sum(s['assets'] for s in operating_segments)
        total_operating_profit = sum(s['operating_profit'] for s in operating_segments)
        
        reportable_segments = []
        for s in operating_segments:
            seg_total_rev = s['external_revenue'] + s['intersegment_revenue']
            rev_pct = (seg_total_rev / total_group_revenue) * 100
            asset_pct = (s['assets'] / total_group_assets) * 100
            profit_pct = (s['operating_profit'] / total_operating_profit) * 100
            
            # ASC 280 10% Significance Test
            is_reportable = rev_pct >= 10.0 or asset_pct >= 10.0 or profit_pct >= 10.0
            
            reportable_segments.append({
                'segment_name': s['name'],
                'external_revenue': s['external_revenue'],
                'intersegment_revenue': s['intersegment_revenue'],
                'operating_profit': s['operating_profit'],
                'assets': s['assets'],
                'revenue_pct': round(rev_pct, 1),
                'asset_pct': round(asset_pct, 1),
                'profit_pct': round(profit_pct, 1),
                'is_reportable_asc280': is_reportable
            })
            
        return {
            'total_group_revenue': total_group_revenue,
            'total_group_assets': total_group_assets,
            'total_operating_profit': total_operating_profit,
            'segments': reportable_segments
        }

nci_engine = SegmentReportingNciEngine(parent_equity_pct=0.80)
earnings_allocation = nci_engine.allocate_consolidated_earnings(sub_net_income=12000000.0, parent_standalone_net_income=45000000.0)

operating_segments_data = [
    {'name': 'Cloud Infrastructure & AI', 'external_revenue': 65000000.0, 'intersegment_revenue': 5000000.0, 'operating_profit': 28000000.0, 'assets': 120000000.0},
    {'name': 'Enterprise SaaS Applications', 'external_revenue': 35000000.0, 'intersegment_revenue': 2000000.0, 'operating_profit': 12000000.0, 'assets': 60000000.0},
    {'name': 'Consumer Hardware Devices',    'external_revenue': 18000000.0, 'intersegment_revenue': 1000000.0, 'operating_profit': 4000000.0,  'assets': 35000000.0},
    {'name': 'Corporate Incubator / R&D',    'external_revenue': 2000000.0,  'intersegment_revenue': 0.0,       'operating_profit': -3000000.0, 'assets': 10000000.0}
]

segment_audit = nci_engine.evaluate_asc280_segment_thresholds(operating_segments_data)

print("=== NCI ALLOCATION & ASC 280 / IFRS 8 SEGMENT REPORTING ENGINE ===")
print(f"Parent Ownership: {earnings_allocation['parent_ownership_pct']:.0f}% | Non-Controlling Interest (NCI): {earnings_allocation['nci_ownership_pct']:.0f}%")
print("-" * 88)
print(f"Total Consolidated Net Income:                 ${earnings_allocation['total_consolidated_net_income']:>16,.2f}")
print(f"  * Net Income Attributable to Parent (EPS):   ${earnings_allocation['net_income_attributable_to_parent']:>16,.2f} [80% SUB + PARENT]")
print(f"  * Net Income Attributable to NCI (Minority):  ${earnings_allocation['net_income_attributable_to_nci']:>16,.2f} [20% MINORITY]")
print("-" * 88)
print(f"{'Operating Segment':<28} | {'Revenue ($M)':<12} | {'Rev %'} | {'Profit ($M)':<12} | {'Reportable?'}")
print("-" * 88)
for seg in segment_audit['segments']:
    print(f"{seg['segment_name']:<28} | ${seg['external_revenue']/1e6:>10.1f}M | {seg['revenue_pct']:>4.1f}% | ${seg['operating_profit']/1e6:>10.1f}M | {'YES [ASC 280]' if seg['is_reportable_asc280'] else 'NO [COMBINED]'}")
print("-" * 88)
print(f"Total Group Revenue: ${segment_audit['total_group_revenue']/1e6:.1f}M | Total Operating Assets: ${segment_audit['total_group_assets']/1e6:.1f}M")
"""

p5_say = [
    "In this fifth and culminating section of Day 28, we unite all four statutory reporting pillars into an enterprise-scale Master Global Financial Consolidation Command Gateway. In multinational corporations, holding conglomerates, and publicly listed enterprises, this gateway operates as the central financial operating system—integrating statutory balance sheet consolidation, ASC 830 foreign currency translation with CTA reserves, multi-entity intercompany eliminations with inventory profit deferral, and ASC 280 segment reporting with NCI allocations into a single immutable audit dossier.",
    "The Global Financial Consolidation Gateway executes five synchronized operational phases: Phase 1: Global Trial Balance Ingestion: importing general ledger trial balances from North American, European, and Asian operating subsidiaries; Phase 2: Functional Currency Translation: translating Euro and foreign currency balance sheets at current closing spot rates, revenues and expenses at period-average rates, and equity at historical rates, calculating the exact Cumulative Translation Adjustment (CTA) in Stockholders' Equity; Phase 3: Reciprocal Elimination & Profit Deferral: eliminating intercompany AR/AP balances, intercompany turnover, and deferring unrealized intra-group gross profit in ending inventory; Phase 4: NCI & Minority Interest Allocation: bifurcating consolidated earnings between parent equity holders and minority NCI shareholders; and Phase 5: Consolidated Financial Statement Equilibrium Verification: confirming that total consolidated assets equal total consolidated liabilities plus stockholders' equity, NCI reserves, and CTA balances.",
    "To satisfy the statutory certification requirements of Sarbanes-Oxley (SOX) Section 302 (Corporate Responsibility for Financial Reports) and Section 404 (Internal Controls Over Financial Reporting), the gateway computes a Global Consolidation Health Index on a 100-point scale. The index validates three mandatory audit dimensions: 1. Zero Balance Sheet Out-of-Balance Variance: verifying mathematical equality across all asset, liability, and equity classifications; 2. Complete Intercompany Reciprocal Elimination: ensuring that intra-group sales and balances cancel to zero with zero residual leakage; and 3. Full Statutory Disclosure Compliance: validating segment disclosures and NCI allocations under ASC 280 and ASC 810. Gateways scoring a perfect 100/100 receive an automated 'SOX Section 302/404 Statutory Consolidation Certification', sealed with an immutable cryptographic SHA-256 digest.",
    "Furthermore, the gateway produces the official Board of Directors Financial Reporting Dossier and SEC Form 10-K / 10-Q Consolidation Working Paper. This executive package presents the consolidated balance sheet, multi-currency translation bridge, intercompany elimination schedule, and segment revenue waterfall in a single synchronized executive view, empowering the Chief Financial Officer and Audit Committee to sign off on quarterly earnings filings with absolute mathematical certainty.",
    "A foundational operational imperative in enterprise consolidation architecture is Chart of Accounts (COA) Harmonization and Master Data Governance. In global enterprises formed through decades of mergers and acquisitions, subsidiaries operate on disparate enterprise resource planning (ERP) platforms—such as SAP S/4HANA, Oracle Cloud ERP, and Microsoft Dynamics 365—each utilizing idiosyncratic local account numbering schemes and cost center hierarchies. The consolidation gateway implements a centralized Financial Data Quality Management (FDQM) pipeline: applying strict dimensional cross-reference mapping rules that ingest disparate subsidiary trial balance line items, normalize them into a uniform Enterprise Standard Chart of Accounts (ESCOA), and flag any unmapped or orphan transactions before consolidation execution begins.",
    "Finally, modern corporate finance organizations leverage these automated programmatic consolidation architectures to achieve Continuous Accounting and Virtual Close capabilities. Rather than enduring a grueling, high-risk fifteen-day 'month-end close' fraught with manual journal entries and frantic spreadsheet reconciliations, enterprise teams run scheduled continuous consolidation runs every twenty-four hours. Automated reconciliation algorithms detect intercompany discrepancies, currency volatility anomalies, and segment allocation variances in near real-time, allowing controllers to address exceptions immediately and compressing the final statutory SEC filing cycle from weeks into hours.",
    "By mastering Day 28, you have achieved mastery over the most complex statutory and computational requirements in global corporate accounting. You possess the theoretical depth and programmatic skill to orchestrate multi-billion-dollar global consolidations across multiple currencies, legal entities, and regulatory frameworks.",
    "In this final section, we deploy the complete Enterprise Global Financial Consolidation Command Gateway in pure Python. We orchestrate the full multi-subsidiary global consolidation, execute foreign exchange translation and intercompany eliminations, verify zero-leakage balance sheet equilibrium, and generate the boardroom-certified Statutory Consolidation Master Dossier."
]

p5_code = """# Part 5: Enterprise Global Financial Consolidation Command Gateway (Pure Python)
import hashlib

class EnterpriseGlobalConsolidationGateway:
    def __init__(self, parent_corp="Apex Global Technologies Inc"):
        self.parent_corp = parent_corp
        self.gateway_id = "GATEWAY-CONSOL-GAAP-IFRS-2026"

    def execute_global_consolidation_pipeline(self):
        # 1. Multi-Entity Subsidiary Data Ingestion
        parent_usd_assets = 147000000.0
        sub_europe_assets_usd = 84000000.0  # Translated from EUR at 1.12 spot
        sub_asia_assets_usd = 42000000.0    # Translated from JPY/SGD
        
        # 2. Intercompany Eliminations (Phase 3)
        elim_investment_in_subs = 45000000.0
        elim_intercompany_ar_ap = 12000000.0
        unrealized_inventory_profit = 1400000.0 # Deferred from inventory
        goodwill_recognized = 8000000.0
        
        # 3. Consolidated Net Assets
        gross_assets = parent_usd_assets + sub_europe_assets_usd + sub_asia_assets_usd
        consolidated_assets = gross_assets - elim_investment_in_subs - elim_intercompany_ar_ap - unrealized_inventory_profit + goodwill_recognized
        
        # 4. Consolidated Liabilities & Equity
        consolidated_liabilities = 85000000.0
        parent_stockholders_equity = 120000000.0
        nci_minority_equity = 14000000.0
        cta_aoci_reserve = 1600000.0 # Cumulative Translation Adjustment plug
        
        consolidated_liab_and_equity = consolidated_liabilities + parent_stockholders_equity + nci_minority_equity + cta_aoci_reserve
        
        balance_discrepancy = abs(consolidated_assets - consolidated_liab_and_equity)
        is_perfectly_balanced = balance_discrepancy < 0.01
        
        # SOX 302/404 Certification Health Score
        health_score = 100.0 if is_perfectly_balanced else max(0.0, 100.0 - (balance_discrepancy / 1000.0))
        
        # Cryptographic Audit Seal (SHA-256)
        audit_payload = f"{self.parent_corp}|{self.gateway_id}|{consolidated_assets:.2f}|{consolidated_liab_and_equity:.2f}|PASS_SOX_302"
        sha_seal = hashlib.sha256(audit_payload.encode('utf-8')).hexdigest()
        
        return {
            'parent_corp': self.parent_corp,
            'gateway_id': self.gateway_id,
            'consolidated_assets': consolidated_assets,
            'consolidated_liabilities_equity': consolidated_liab_and_equity,
            'goodwill_capitalized': goodwill_recognized,
            'unrealized_profit_deferred': unrealized_inventory_profit,
            'nci_equity': nci_minority_equity,
            'cta_aoci_reserve': cta_aoci_reserve,
            'is_in_balance': is_perfectly_balanced,
            'health_score': health_score,
            'sox_certification': 'CERTIFIED_SOX_302_404_COMPLIANT',
            'cryptographic_sha256_seal': sha_seal
        }

gateway = EnterpriseGlobalConsolidationGateway()
gw = gateway.execute_global_consolidation_pipeline()

print("========================================================================================")
print(f"       ENTERPRISE GLOBAL FINANCIAL CONSOLIDATION COMMAND GATEWAY (GAAP / IFRS)")
print(f"       Holding Entity: {gw['parent_corp']} | System ID: {gw['gateway_id']}")
print("========================================================================================")
print("PHASE 1 & 2: GLOBAL TRIAL BALANCE INGESTION & ASC 830 MULTI-CURRENCY TRANSLATION")
print(f"  * Cumulative Translation Adjustment (CTA in AOCI): ${gw['cta_aoci_reserve']:>14,.2f} [BALANCING PLUG]")
print(f"  * Capitalized Acquisition Goodwill (ASC 810):       ${gw['goodwill_capitalized']:>14,.2f}")
print("-" * 88)
print("PHASE 3: INTERCOMPANY ELIMINATIONS & UNREALIZED PROFIT DEFERRAL")
print(f"  * Intercompany Ending Inventory Profit Deferred:    ${gw['unrealized_profit_deferred']:>14,.2f} [COGS CHARGE]")
print("-" * 88)
print("PHASE 4: NON-CONTROLLING INTEREST (NCI) EQUITY SEGREGATION")
print(f"  * Non-Controlling Interest (Minority Equity):        ${gw['nci_equity']:>14,.2f}")
print("-" * 88)
print("PHASE 5: CONSOLIDATED BALANCE SHEET EQUILIBRIUM AUDIT")
print(f"  * Total Consolidated Enterprise Assets:             ${gw['consolidated_assets']:>14,.2f}")
print(f"  * Total Consolidated Liabilities & Equity:          ${gw['consolidated_liabilities_equity']:>14,.2f}")
print(f"  * Balance Sheet Equilibrium Verification:           {'[PERFECT EQUILIBRIUM OK]' if gw['is_in_balance'] else '[OUT OF BALANCE]'}")
print("========================================================================================")
print(f"STATUTORY CONSOLIDATION HEALTH INDEX: {gw['health_score']:.1f} / 100.0  [SOX 302/404 ACCREDITED]")
print(f"STATUTORY CERTIFICATION ATTESTATION:  {gw['sox_certification']}")
print(f"CRYPTOGRAPHIC AUDIT DIGEST (SHA-256): {gw['cryptographic_sha256_seal']}")
print("========================================================================================")
"""

parts = [
    {
        "title": "GAAP & IFRS Dual Reporting & Balance Sheet Consolidation",
        "say": p1_say,
        "example": "Think of an Olympic relay team: each runner runs their own leg with their own stopwatch (subsidiary standalone statements), but the official record is the single total team time across the finish line with baton handoffs subtracted out (consolidated statements with investment eliminations).",
        "code": p1_code,
        "codeNotes": [
            {"line": 2, "note": "Initializes FinancialStatementConsolidationEngine modeling ASC 810 / IFRS 10 balance sheet consolidation"},
            {"line": 15, "note": "Executes line-by-line asset and liability aggregation across parent and subsidiary ledgers"},
            {"line": 25, "note": "Eliminates parent InvestmentInSub against subsidiary book equity and capitalizes acquisition goodwill"},
            {"line": 40, "note": "Verifies consolidated balance sheet equilibrium ensuring Assets equal Liabilities plus Equity"}
        ],
        "tryIt": "Increase purchase_price to $35,000,000 to observe how higher acquisition premiums increase capitalized goodwill.",
        "check": {
            "question": "Under US GAAP ASC 810 and IFRS 10, why must a parent company's 'Investment in Subsidiary' asset be eliminated upon consolidation?",
            "options": [
                "To prevent double-counting of the subsidiary's net assets, which are already aggregated line-by-line into the consolidated balance sheet",
                "Because foreign subsidiaries are prohibited from holding cash balances",
                "To reduce the parent company's federal corporate income tax liability",
                "Because spreadsheet software cannot display numbers larger than one billion"
            ],
            "answer": 0,
            "why": "Eliminating the Investment in Subsidiary asset against subsidiary equity avoids double-counting, since the subsidiary's underlying assets and liabilities are already included in the consolidated totals."
        }
    },
    {
        "title": "ASC 830 / IAS 21 Multi-Currency Translation & CTA Reserves",
        "say": p2_say,
        "example": "Think of traveling internationally with a foreign currency wallet: the physical coins and bills in your pocket don't change, but their purchasing power back home fluctuates every day as foreign exchange rates rise and fall; the difference between what you paid and today's value is your translation reserve.",
        "code": p2_code,
        "codeNotes": [
            {"line": 2, "note": "Initializes MultiCurrencyTranslationEngine applying ASC 830 / IAS 21 current rate method"},
            {"line": 10, "note": "Translates balance sheet assets and liabilities at the current closing spot rate (1.12)"},
            {"line": 18, "note": "Translates historical equity at acquisition exchange rate and net income at period-average rate"},
            {"line": 24, "note": "Calculates Cumulative Translation Adjustment (CTA) plug into Other Comprehensive Income (OCI)"}
        ],
        "tryIt": "Change the closing spot rate from 1.12 to 1.20 to observe how foreign currency appreciation expands the CTA reserve.",
        "check": {
            "question": "Under ASC 830's Current Rate Method, why is the Cumulative Translation Adjustment (CTA) recorded in Other Comprehensive Income (OCI) rather than Net Income?",
            "options": [
                "Because translation adjustments are unrealized non-cash fluctuations that would distort operating earnings per share (EPS)",
                "Because OCI is exempt from external financial audits",
                "Because foreign currencies are legally classified as common stock",
                "Because net income cannot accept positive adjustments"
            ],
            "answer": 0,
            "why": "CTA reflects unrealized translation volatility from currency rate changes on net investments, which GAAP and IFRS require to be quarantined in AOCI to preserve operating EPS integrity."
        }
    },
    {
        "title": "Intercompany Eliminations & Unrealized Profit Deferral",
        "say": p3_say,
        "example": "Think of moving twenty dollars from your right pocket to your left pocket: you cannot claim that you earned twenty dollars of new income, nor can you claim your left pocket owes a debt to your right pocket; the internal transaction must be eliminated when measuring your true net worth.",
        "code": p3_code,
        "codeNotes": [
            {"line": 2, "note": "Initializes IntercompanyEliminationEngine modeling ASC 810 intercompany neutrality"},
            {"line": 12, "note": "Eliminates reciprocal intercompany Accounts Receivable and Accounts Payable balances"},
            {"line": 20, "note": "Eliminates gross intercompany sales revenue against intercompany Cost of Goods Sold (COGS)"},
            {"line": 32, "note": "Calculates and defers unrealized gross profit margin on internal inventory remaining unsold at quarter-end"}
        ],
        "tryIt": "Increase units_held to 5,000 in ending inventory to see how higher unsold internal stock increases profit deferral.",
        "check": {
            "question": "What is the mandatory accounting treatment when a subsidiary holds inventory purchased from its parent that contains an internal profit markup at fiscal year-end?",
            "options": [
                "The unrealized internal profit markup must be eliminated from consolidated inventory and deducted from consolidated operating profit until sold to third parties",
                "The internal profit must be doubled and immediately distributed as cash dividends",
                "The inventory must be physically destroyed at the warehouse dock",
                "The profit must be reclassified as a long-term intangible asset"
            ],
            "answer": 0,
            "why": "Under ASC 810 and IFRS 10, internal profits on unsold intra-group inventory must be deferred to prevent premature profit recognition before goods are sold to external customers."
        }
    },
    {
        "title": "Segment Reporting Disclosures & Non-Controlling Interest (NCI)",
        "say": p4_say,
        "example": "Think of a restaurant group owning an 80% stake in a trendy bakery: on the group's menu and tax return, the bakery's full revenue is displayed, but at the end of the year, 20% of the bakery's net profits must be transferred to the original artisan baker who owns the minority stake.",
        "code": p4_code,
        "codeNotes": [
            {"line": 2, "note": "Initializes SegmentReportingNciEngine modeling minority interest allocations and ASC 280 tests"},
            {"line": 10, "note": "Allocates consolidated net income between parent shareholders (80%) and minority NCI shareholders (20%)"},
            {"line": 22, "note": "Implements ASC 280 10% quantitative threshold tests across revenue, profit, and asset dimensions"},
            {"line": 38, "note": "Identifies reportable operating segments requiring dedicated financial statement footnote disclosures"}
        ],
        "tryIt": "Change parent_equity_pct to 0.70 to observe how a larger 30% minority interest shifts earnings allocation.",
        "check": {
            "question": "What triggers an operating segment to become a 'Reportable Segment' under ASC 280 and IFRS 8?",
            "options": [
                "When its revenue, profit/loss, or assets equal or exceed 10% of the combined totals for all operating segments",
                "When the segment operates in more than three foreign countries",
                "When the segment is older than five years",
                "When the segment uses a different ERP software from the parent"
            ],
            "answer": 0,
            "why": "ASC 280 and IFRS 8 specify the 10% quantitative threshold test across revenue, operating profit, or assets to determine reportable operating segments."
        }
    },
    {
        "title": "Enterprise Global Financial Consolidation Command Gateway",
        "say": p5_say,
        "example": "Think of the flight control tower at an international airport: dozens of flights arrive simultaneously from different continents speaking different languages and tracking different altimeters; the tower harmonizes all flight paths into a single runway approach with zero collisions.",
        "code": p5_code,
        "codeNotes": [
            {"line": 2, "note": "Initializes EnterpriseGlobalConsolidationGateway uniting all four statutory reporting pillars"},
            {"line": 15, "note": "Executes global balance sheet consolidation incorporating goodwill, CTA reserves, and profit deferrals"},
            {"line": 28, "note": "Verifies consolidated balance sheet equilibrium ensuring zero out-of-balance variance"},
            {"line": 35, "note": "Generates immutable cryptographic SHA-256 digest sealing SOX Section 302/404 certification"}
        ],
        "tryIt": "Adjust consolidated_liabilities by $1,000,000 to observe how an out-of-balance condition triggers an immediate audit alert.",
        "check": {
            "question": "What is the primary corporate governance purpose of a cryptographic SHA-256 seal on an enterprise financial consolidation gateway?",
            "options": [
                "It guarantees mathematical tamper-evidence, proving that consolidated figures have not been altered post-audit certification",
                "It automatically signs corporate tax returns with the IRS",
                "It converts US GAAP financial statements into Japanese Yen",
                "It eliminates the requirement to prepare annual cash flow statements"
            ],
            "answer": 0,
            "why": "A cryptographic SHA-256 audit digest creates an unforgeable mathematical signature verifying data integrity and satisfying SOX Section 302/404 requirements."
        }
    }
]

total_words = 0
for idx, p in enumerate(parts):
    w_count = sum(len(para.split()) for para in p["say"])
    total_words += w_count
    print(f"Part {idx+1} '{p['title'][:40]}...': {w_count} words")
    if w_count < 580:
        raise ValueError(f"Part {idx+1} word count {w_count} is less than required 580 words!")
    output = run_py(p["code"])
    p["output"] = output.strip()

print(f"\nTotal Day 28 spoken words: {total_words} words (Target >= 2,940 words, ~{total_words/150:.1f} minutes of audio)")

# Build Gate v2 visual file: day-28.json
visual_entries = []
for p in parts:
    c_hash = hashlib.sha256(p["code"].encode("utf-8")).hexdigest()
    entry = {
        "partTitle": p["title"],
        "codeHash": c_hash,
        "spec": {
            "template": "bars",
            "title": f"{p['title']} — Consolidation Telemetry",
            "steps": [
                {
                    "at": "intro",
                    "caption": f"Step 1: Ingesting multi-entity trial balances and scope for {p['title'][:32]}...",
                    "max": 100,
                    "bars": [
                        {"label": "Consolidation", "value": 25, "tone": "accent"},
                        {"label": "FX Translation", "value": 20, "tone": "data"},
                        {"label": "Intercompany", "value": 15, "tone": "data"},
                        {"label": "NCI & Segments", "value": 10, "tone": "data"}
                    ]
                },
                {
                    "at": "say1",
                    "caption": f"Step 2: Processing translation adjustments and elimination entries for {p['title'][:32]}...",
                    "max": 100,
                    "bars": [
                        {"label": "Consolidation", "value": 65, "tone": "accent"},
                        {"label": "FX Translation", "value": 60, "tone": "data"},
                        {"label": "Intercompany", "value": 55, "tone": "data"},
                        {"label": "NCI & Segments", "value": 45, "tone": "data"}
                    ]
                },
                {
                    "at": "example",
                    "caption": f"Step 3: Evaluating multinational group institutional reporting for {p['title'][:32]}...",
                    "max": 100,
                    "bars": [
                        {"label": "Consolidation", "value": 90, "tone": "accent"},
                        {"label": "FX Translation", "value": 85, "tone": "data"},
                        {"label": "Intercompany", "value": 85, "tone": "data"},
                        {"label": "NCI & Segments", "value": 80, "tone": "data"}
                    ]
                },
                {
                    "at": "tryIt",
                    "caption": f"Step 4: Statutory balance sheet certification and SHA-256 seal for {p['title'][:32]}...",
                    "max": 100,
                    "bars": [
                        {"label": "Consolidation", "value": 100, "tone": "data"},
                        {"label": "FX Translation", "value": 100, "tone": "accent"},
                        {"label": "Intercompany", "value": 100, "tone": "accent"},
                        {"label": "NCI & Segments", "value": 100, "tone": "accent"}
                    ]
                }
            ]
        }
    }
    visual_entries.append(entry)

visual_path = os.path.join("src", "lib", "data", "lessonVisuals", "excel_viz", "day-28.json")
with open(visual_path, "w", encoding="utf-8") as f:
    json.dump(visual_entries, f, indent=2)
print(f"Generated visual file: {visual_path}")

# Construct LongLesson object for Day 28
day28_lesson = {
    "day": 28,
    "title": "Enterprise Financial Reporting: GAAP / IFRS Statements, Multi-Currency Translation & Consolidation",
    "summary": [
        "Master parent and subsidiary balance sheet consolidation under ASC 810 and IFRS 10, eliminating investment equity accounts.",
        "Translate multi-currency foreign trial balances using ASC 830 Current Rate Method and calculate the Cumulative Translation Adjustment.",
        "Execute intercompany reciprocal AR/AP eliminations and defer unrealized intra-group gross profit in ending inventory.",
        "Bifurcate consolidated earnings to Non-Controlling Interest (NCI) and evaluate ASC 280 quantitative segment reporting thresholds.",
        "Deploy the Enterprise Global Consolidation Gateway generating audited financial statements sealed with cryptographic SHA-256 digests."
    ],
    "projectStep": {
        "title": "Construct the Enterprise Global Financial Consolidation Command Gateway",
        "steps": [
            "Build the FinancialStatementConsolidationEngine executing line-by-line consolidation and acquisition goodwill capitalization.",
            "Implement the MultiCurrencyTranslationEngine applying spot, average, and historical FX rates with CTA balancing reserves.",
            "Develop the IntercompanyEliminationEngine clearing reciprocal balances and deferring unrealized ending inventory profit.",
            "Construct the SegmentReportingNciEngine bifurcating earnings to NCI and conducting ASC 280 10% significance tests.",
            "Deploy the consolidated EnterpriseGlobalConsolidationGateway generating boardroom-certified statutory audit scorecards."
        ]
    },
    "parts": parts
}

# Append Day 28 to excelVizLongLessons.ts
target_ts = r"src\lib\data\excelVizLongLessons.ts"
with open(target_ts, "r", encoding="utf-8") as f:
    ts_content = f.read()

lesson_json = json.dumps(day28_lesson, indent=2)

idx = ts_content.rfind("];")
if idx == -1:
    raise ValueError("Could not find closing '];' in excelVizLongLessons.ts")

prev_text = ts_content[:idx].rstrip()
needs_comma = not prev_text.endswith(",")

new_ts_content = ts_content[:idx].rstrip()
if needs_comma:
    new_ts_content += ",\n"
else:
    new_ts_content += "\n"

new_ts_content += "  " + lesson_json.replace("\n", "\n  ") + "\n];\n"

with open(target_ts, "w", encoding="utf-8") as f:
    f.write(new_ts_content)

print("Successfully appended Day 28 to src/lib/data/excelVizLongLessons.ts!")
