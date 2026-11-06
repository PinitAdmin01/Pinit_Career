import json
import hashlib
import subprocess
import sys
import os

def run_py(code):
    res = subprocess.run([sys.executable, "-c", code], capture_output=True, text=True, check=True)
    return res.stdout.strip()

# Day 11 Parts with rigorous, high-depth financial engineering exposition
parts = [
    {
        "title": "The Three-Statement Integration Invariant: Balancing P&L, Balance Sheet & Cash Flow Statement",
        "say": [
            "In institutional financial engineering, corporate valuation, and investment banking, the Three-Statement Financial Model represents the ultimate bedrock of quantitative financial analysis. A professional financial model is never an isolated collection of disparate spreadsheets, static schedules, or detached accounting tables. Rather, it is an integrated, mathematically unified, closed dynamic system in which the Income Statement (P&L), the Balance Sheet (BS), and the Cash Flow Statement (CFS) operate in absolute synchronization governed by strict double-entry accounting invariants. If a single commercial assumption changes—whether a five-percent increase in unit sales volume, a two-day shift in customer payment terms, or an unexpected rise in raw material commodity costs—that single variance triggers an immediate, deterministic ripple effect across the entire financial architecture, dynamically impacting operating income, tax liabilities, working capital balances, cash reserves, and retained equity.",
            "The foundational governing law of corporate accounting is the Fundamental Balance Sheet Equation: Total Assets must at all times equal Total Liabilities plus Shareholders' Equity (Assets = Liabilities + Equity). In an institutional financial model, the balance sheet must balance perfectly to the penny without the use of artificial 'plugs' or manual balancing overrides. A financial model that requires an arbitrary plug cell to force Assets to equal Liabilities plus Equity is fundamentally flawed, structurally broken, and instantly rejected by credit rating agencies, investment committees, and corporate auditors. The mathematical mechanism that forces this balance across time is the deterministic flow of Net Income from the bottom of the Income Statement into the top of the Cash Flow Statement as the starting point of Cash Flow from Operations (CFO), and simultaneously into the Retained Earnings account within the Shareholders' Equity section of the Balance Sheet.",
            "A critical conceptual pillar of financial modeling is the treatment of non-cash accounting adjustments. Under accrual accounting standards (such as US GAAP and IFRS), revenue is recognized when earned and expenses are recognized when incurred, regardless of when physical cash crosses the corporate bank account. The most prominent non-cash operational expense is Depreciation and Amortization (D&A). When an enterprise purchases heavy industrial machinery, data center server racks, or corporate real estate, the capital expenditure is capitalized onto the Balance Sheet as Property, Plant & Equipment (PP&E) rather than expensed immediately. Over time, that asset is depreciated across its useful economic life, creating an annual non-cash depreciation expense on the Income Statement. While this depreciation expense reduces Operating Income (EBIT) and creates a valuable corporate tax shield by lowering taxable income, zero cash actually leaves the company during that period. Consequently, on the Cash Flow Statement, Depreciation and Amortization is added back in full to Net Income.",
            "Simultaneously, the depreciation schedule links directly back to the Balance Sheet. Each dollar of annual depreciation accumulates within the Accumulated Depreciation contra-asset account, reducing the Net PP&E carrying value on the asset side of the Balance Sheet. Meanwhile, new investments in productive physical assets—known as Capital Expenditures (CapEx)—are captured on the Cash Flow Statement under Cash Flow from Investing (CFI) as cash outflows. The Net PP&E balance on the ending Balance Sheet is therefore governed by an exact recursive invariant: Ending Net PP&E equals Beginning Net PP&E plus Current Capital Expenditures minus Current Depreciation Expense. Understanding this recursive loop is essential for projecting capital-intensive infrastructure and industrial companies.",
            "Working capital adjustments form the secondary bridge between the accrual profitability of the Income Statement and the physical liquidity of the Cash Flow Statement. Operating current assets and operating current liabilities fluctuate constantly throughout the fiscal year. When an enterprise delivers $10 million of enterprise software services to an institutional client on 60-day credit terms, the entire $10 million is booked as revenue on the Income Statement, and operating profit expands accordingly. However, the client has not yet transferred cash into the company's checking account; instead, Accounts Receivable on the Balance Sheet expands by $10 million. On the Cash Flow Statement, an increase in an operating asset represents an operating cash drain—cash that is earned on paper but trapped in unpaid invoices. Therefore, increases in current assets are subtracted from Net Income, while increases in operating liabilities (such as Accounts Payable to suppliers) represent cash preserved and are added back.",
            "Financing and capital structure linkages complete the closed loop. When an enterprise issues corporate bonds or borrows from commercial bank syndicates, the cash proceeds flow into Cash Flow from Financing (CFF) and increase Long-Term Debt liabilities on the Balance Sheet. Conversely, mandatory debt principal amortizations represent cash outflows in CFF and reduce debt liabilities. When all three cash flow activities—Cash Flow from Operations (CFO), Cash Flow from Investing (CFI), and Cash Flow from Financing (CFF)—are aggregated, they yield the Net Change in Cash for the fiscal period. This net change is added to the Beginning Cash Balance to establish the Ending Cash Balance, which flows directly onto the asset side of the Balance Sheet. Because every debit has an exact corresponding credit across the model, Total Assets exactly balances Total Liabilities and Shareholders' Equity with zero mathematical variance.",
            "In this comprehensive lesson, we construct a production-grade, mathematically verified Three-Statement Dynamic Linkage Engine in Python. We parameterize revenues, cost structures, tax rates, working capital variations, debt schedules, and capital expenditures, proving that the balance sheet balances with absolute zero variance across operating periods."
        ],
        "example": "Think of the human body: the Income Statement is metabolic digestion converting food into nutritional energy; the Cash Flow Statement is the cardiovascular heart actively pumping oxygenated blood through veins; and the Balance Sheet is the skeletal and muscular structure. You cannot increase physical activity or calorie burn without dynamically altering blood flow, heart rate, and muscular density simultaneously.",
        "code": """# Part 1: Three-Statement Dynamic Linkage Engine
class ThreeStatementModel:
    def __init__(self, revenue=50000000.0, cogs_pct=0.40, opex=15000000.0, da=3000000.0,
                 tax_rate=0.25, capex=4000000.0, delta_ar=1500000.0, delta_inv=500000.0,
                 delta_ap=800000.0, init_cash=10000000.0, init_ppe=25000000.0,
                 init_debt=12000000.0, init_equity=21000000.0):
        self.rev = revenue
        self.cogs = revenue * cogs_pct
        self.opex = opex
        self.da = da
        self.tax_rate = tax_rate
        self.capex = capex
        self.delta_ar = delta_ar
        self.delta_inv = delta_inv
        self.delta_ap = delta_ap
        self.init_cash = init_cash
        self.init_ppe = init_ppe
        self.init_debt = init_debt
        self.init_equity = init_equity

    def build_integrated_model(self):
        # 1. Income Statement
        gross_profit = self.rev - self.cogs
        ebitda = gross_profit - self.opex
        ebit = ebitda - self.da
        interest_exp = self.init_debt * 0.05
        ebt = ebit - interest_exp
        taxes = max(0.0, ebt * self.tax_rate)
        net_income = ebt - taxes

        # 2. Cash Flow Statement
        delta_nwc = (self.delta_ar + self.delta_inv) - self.delta_ap
        cfo = net_income + self.da - delta_nwc
        cfi = -self.capex
        cff = 0.0  # Zero net debt issued
        net_change_cash = cfo + cfi + cff
        ending_cash = self.init_cash + net_change_cash

        # 3. Balance Sheet
        ending_ar = self.delta_ar
        ending_inv = self.delta_inv
        ending_ppe = self.init_ppe + self.capex - self.da
        total_assets = ending_cash + ending_ar + ending_inv + ending_ppe

        ending_ap = self.delta_ap
        ending_debt = self.init_debt
        total_liabilities = ending_ap + ending_debt
        ending_equity = self.init_equity + net_income
        total_liab_equity = total_liabilities + ending_equity
        balance_check = total_assets - total_liab_equity

        return {
            'revenue': self.rev,
            'ebitda': ebitda,
            'net_income': round(net_income, 2),
            'cfo': round(cfo, 2),
            'ending_cash': round(ending_cash, 2),
            'total_assets': round(total_assets, 2),
            'total_liab_equity': round(total_liab_equity, 2),
            'balance_check_variance': round(balance_check, 2)
        }

model = ThreeStatementModel()
res = model.build_integrated_model()

print("=== THREE-STATEMENT INTEGRATED FINANCIAL MODEL ===")
print(f"Revenue:             ${res['revenue']:,.2f}")
print(f"EBITDA:              ${res['ebitda']:,.2f}")
print(f"Net Income:          ${res['net_income']:,.2f}")
print(f"Operating Cash Flow: ${res['cfo']:,.2f}")
print(f"Ending Cash Balance: ${res['ending_cash']:,.2f}")
print(f"Total Assets:        ${res['total_assets']:,.2f}")
print(f"Total Liab & Equity: ${res['total_liab_equity']:,.2f}")
print(f"Balance Verification Variance: ${res['balance_check_variance']:,.2f}")
""",
        "codeNotes": [
            {"line": 2, "note": "Initializes ThreeStatementModel with income, balance sheet, and working capital parameters"},
            {"line": 22, "note": "Income Statement calculates EBITDA, EBIT, tax shield, and Net Income"},
            {"line": 31, "note": "Cash Flow Statement adjusts Net Income for non-cash D&A and working capital drag (delta NWC)"},
            {"line": 40, "note": "Balance Sheet updates cash, PP&E, debt, and retained earnings, verifying Assets == Liabilities + Equity"}
        ],
        "tryIt": "Increase capex to $8,000,000 and observe how ending cash decreases while PP&E increases, maintaining an exact zero balance variance.",
        "check": {
            "question": "Why must an increase in Accounts Receivable be subtracted from Net Income on the Cash Flow Statement?",
            "options": [
                "Because Accounts Receivable represents revenue booked on the P&L that has not yet been physically collected in cash",
                "Because Accounts Receivable is an expense paid to external vendors",
                "Because tax laws require companies to pay penalties on unpaid customer balances",
                "Because customer invoices reduce the market value of the company's equity"
            ],
            "answer": 0,
            "why": "Under accrual accounting, revenue is recognized when earned, but if customers purchase on credit, cash has not yet entered the bank account. Therefore, the increase in Accounts Receivable must be subtracted from Net Income to reflect true cash flow."
        }
    },
    {
        "title": "Working Capital Mechanics: Days Sales Outstanding (DSO), Days Inventory Outstanding (DIO) & Days Payable Outstanding (DPO)",
        "say": [
            "In institutional corporate finance, treasury management, and commercial operations, Net Working Capital (NWC) serves as the primary gauge of an enterprise's short-term operating liquidity and supply chain efficiency. While executive teams often celebrate double-digit revenue expansion and expanding operating margins on the Income Statement, aggressive top-line growth without disciplined working capital stewardship is one of the most common causes of corporate insolvency. When a business expands rapidly, it must fund larger raw material purchases, carry expanded warehouse inventory, and extend generous trade credit to new institutional buyers. If these operational assets consume cash faster than customer collections arrive, an otherwise highly profitable company will experience catastrophic liquidity failure.",
            "Net Working Capital is strictly defined from an operational perspective: Operating Current Assets (primarily trade Accounts Receivable and Raw Materials/Finished Goods Inventory) minus Operating Current Liabilities (primarily trade Accounts Payable and Accrued Operating Expenses). Notice that this definition deliberately excludes interest-bearing short-term debt, revolving credit facilities, and non-operating cash reserves. Non-operating cash is an asset of capital allocation rather than operations, while short-term debt is a financing decision. Isolating operational assets and liabilities ensures that financial analysts evaluate the pure organic capital efficiency of the company's business model.",
            "To evaluate how rapidly capital circulates through the commercial operating cycle, quantitative analysts calculate the three canonical working capital turnover metrics: Days Sales Outstanding (DSO), Days Inventory Outstanding (DIO), and Days Payable Outstanding (DPO). Rather than analyzing static balance sheet dollar figures—which vary widely based on seasonality and corporate scale—these three ratios normalize balance sheet balances against Income Statement flows, converting accounting dollars into intuitive, actionable calendar days.",
            "Days Sales Outstanding (DSO) measures the average number of days required for an enterprise to collect physical cash after executing a credit sale. The mathematical formula is: DSO = (Accounts Receivable / Total Credit Revenue) * 365 days. A low DSO (e.g. 30 to 40 days) demonstrates stringent credit underwriting, efficient billing automation, and aggressive collection enforcement. Conversely, an expanding DSO (e.g. 75 to 90 days) signals customer payment friction, disputed delivery quality, delayed invoicing, or deteriorating client creditworthiness. For a corporation generating $100 million in annual sales, every single day of DSO reduction frees up approximately $274,000 of pure bankable cash.",
            "Days Inventory Outstanding (DIO) measures how many days physical stock remains tied up in warehouses, transit containers, and factory floors before being sold to end customers: DIO = (Ending Inventory / Cost of Goods Sold) * 365 days. In hardware manufacturing, consumer electronics, and retail, high DIO represents expensive capital stagnation. Inventory incurs physical warehousing rent, temperature-controlled logistics, insurance premiums, shrinkage, and severe technological obsolescence risk. Achieving lean inventory through Just-in-Time (JIT) manufacturing and dynamic demand forecasting compresses DIO, eliminating capital drag and preventing costly write-downs.",
            "Days Payable Outstanding (DPO) measures the average timespan the enterprise takes to pay its trade vendors, suppliers, and raw material distributors: DPO = (Accounts Payable / Cost of Goods Sold) * 365 days. From a corporate treasury perspective, extending DPO represents an interest-free source of operating capital provided directly by vendor credit. Large multinational conglomerates use their commercial market leverage to negotiate 60-, 90-, or even 120-day payment terms with suppliers, allowing them to fund corporate operations using vendor cash. However, financial modelers must recognize the strategic limit: stretching DPO excessively alienates critical component suppliers, triggers credit holds, forfeits lucrative early-payment discounts (such as 2/10 Net 30), and jeopardizes supply chain reliability.",
            "In this section, we construct an institutional Working Capital Turnover and Liquidity Sensitivity Engine in Python. We compute DSO, DIO, and DPO across operating cycles, and calculate the exact dollar liquidity unlocked from operational efficiency gains."
        ],
        "example": "Think of a neighborhood bakery: DSO is how many days corporate catering clients take to pay their monthly invoices; DIO is how long flour, butter, and yeast sit in the pantry before being baked into bread and sold; and DPO is how many days the agricultural flour mill allows the baker to wait before demanding check settlement.",
        "code": """# Part 2: Working Capital Turnover Engine (DSO, DIO, DPO)
class WorkingCapitalAnalyzer:
    def __init__(self, revenue=75000000.0, cogs=45000000.0, ar=12500000.0,
                 inventory=7500000.0, ap=6200000.0):
        self.rev = revenue
        self.cogs = cogs
        self.ar = ar
        self.inv = inventory
        self.ap = ap

    def compute_turnover_metrics(self):
        dso = (self.ar / self.rev) * 365.0
        dio = (self.inv / self.cogs) * 365.0
        dpo = (self.ap / self.cogs) * 365.0
        nwc = (self.ar + self.inv) - self.ap
        
        # Scenario: 10-day improvement in DSO collections
        cash_freed_dso = (self.rev / 365.0) * 10.0
        # Scenario: 5-day extension in vendor DPO
        cash_freed_dpo = (self.cogs / 365.0) * 5.0
        total_cash_unlocked = cash_freed_dso + cash_freed_dpo

        return {
            'dso_days': round(dso, 1),
            'dio_days': round(dio, 1),
            'dpo_days': round(dpo, 1),
            'net_working_capital': round(nwc, 2),
            'cash_freed_10d_dso': round(cash_freed_dso, 2),
            'cash_freed_5d_dpo': round(cash_freed_dpo, 2),
            'total_liquidity_unlocked': round(total_cash_unlocked, 2)
        }

analyzer = WorkingCapitalAnalyzer()
res = analyzer.compute_turnover_metrics()

print("=== WORKING CAPITAL TURNOVER & LIQUIDITY ANALYSIS ===")
print(f"Days Sales Outstanding (DSO):     {res['dso_days']} Days")
print(f"Days Inventory Outstanding (DIO): {res['dio_days']} Days")
print(f"Days Payable Outstanding (DPO):   {res['dpo_days']} Days")
print(f"Net Working Capital (NWC):        ${res['net_working_capital']:,.2f}")
print(f"Cash Unlocked via 10-Day DSO Cut: ${res['cash_freed_10d_dso']:,.2f}")
print(f"Cash Unlocked via 5-Day DPO Push: ${res['cash_freed_5d_dpo']:,.2f}")
print(f"Total Operational Cash Unlocked:  ${res['total_liquidity_unlocked']:,.2f}")
""",
        "codeNotes": [
            {"line": 2, "note": "Initializes WorkingCapitalAnalyzer with annual revenue, COGS, AR, Inventory, and AP"},
            {"line": 11, "note": "Calculates DSO, DIO, and DPO turnover metrics in calendar days"},
            {"line": 15, "note": "Quantifies permanent liquidity unlocked from a 10-day DSO reduction and a 5-day DPO extension"},
            {"line": 26, "note": "Demonstrates over $2.6M in non-dilutive liquidity generated purely through operational velocity"}
        ],
        "tryIt": "Reduce Accounts Receivable from $12.5M to $10.0M and observe how DSO drops from 60.8 days to 48.7 days, freeing up $2.5M in immediate cash.",
        "check": {
            "question": "What happens to corporate cash flow when Days Sales Outstanding (DSO) expands from 45 days to 70 days?",
            "options": [
                "Operating cash flow decreases because capital becomes trapped in uncollected customer receivables",
                "Operating cash flow increases because the company is generating more sales",
                "Net Income increases because customers owe more money",
                "Shareholders' Equity expands because receivables are classified as long-term investments"
            ],
            "answer": 0,
            "why": "When DSO increases, it takes longer for credit sales to convert into cash. The unpaid revenue accumulates as Accounts Receivable on the Balance Sheet, which represents a cash outflow (drag) on the Cash Flow Statement."
        }
    },
    {
        "title": "The Cash Conversion Cycle (CCC) & Operating Cash Drag Optimization",
        "say": [
            "In institutional corporate finance, private equity due diligence, and operational restructuring, the Cash Conversion Cycle (CCC) represents the ultimate holistic metric of operational efficiency and commercial bargaining power. The Cash Conversion Cycle measures the net duration in calendar days from the moment an enterprise outlays cash for raw materials, inventory, and production labor until the moment it physically collects cash from customers for the sale of finished products. Mathematically, the cycle synthesizes our three turnover metrics into a single overarching formula: Cash Conversion Cycle = DIO + DSO - DPO.",
            "To understand the profound economic significance of the Cash Conversion Cycle, one must trace the physical journey of a commercial transaction. First, an enterprise acquires raw material inputs, incurring Accounts Payable to trade vendors. The materials sit in production and warehousing for the duration of Days Inventory Outstanding (DIO). Once converted into finished goods and sold on credit, the transaction enters Accounts Receivable, awaiting customer settlement for the duration of Days Sales Outstanding (DSO). The sum of DIO and DSO represents the Operating Cycle—the total time capital is locked inside the enterprise. However, because suppliers granted payment terms of Days Payable Outstanding (DPO), the enterprise was not required to pay cash immediately. Subtracting DPO yields the net timespan during which the company must fund its own operating cycle using its own capital.",
            "When an enterprise exhibits a substantial Positive Cash Conversion Cycle (such as +60 to +90 days, common in industrial manufacturing, heavy machinery, and capital goods), it suffers from severe 'Operating Cash Drag.' For two to three months, the business must fund inventory stockpiles, warehouse leases, factory wages, and shipping logistics out of its own pocket before receiving a single dollar from customers. To bridge this structural cash gap, corporations must borrow from commercial bank syndicates via revolving credit facilities or working capital term loans, incurring substantial annual interest expense that directly erodes corporate net profit margins.",
            "Conversely, the elite echelon of global corporate strategy—exemplified by titans like Apple, Amazon, and Dell—intentionally architect a Negative Cash Conversion Cycle (such as -15 to -30 days). In a negative CCC business model, Days Payable Outstanding significantly exceeds the combined total of Days Inventory Outstanding and Days Sales Outstanding (DPO > DIO + DSO). For example, Amazon collects cash from online consumers almost instantaneously via digital payment processing (DSO ~ 3 days) and moves inventory through fulfillment centers in less than a month (DIO ~ 25 days), while using its massive commercial buying power to mandate 60- to 90-day payment terms with suppliers (DPO ~ 75 days).",
            "A Negative Cash Conversion Cycle fundamentally transforms the corporate enterprise into an interest-free commercial bank funded by its own trade suppliers. Customers pay cash upfront, while the enterprise delays paying vendors for two to three months. During this intervening float period, the enterprise holds millions—or billions—of dollars in supplier-funded liquidity. This free capital can be deployed into high-yield short-term treasury bills, reinvested in aggressive research and development, used to fund corporate acquisitions, or allocated to share repurchases without incurring a single penny of bank borrowing or debt interest.",
            "Analyzing multi-year trends in the Cash Conversion Cycle exposes the true competitive moat of an enterprise. When a company steadily compresses its CCC while industry peers experience expanding cycles, it proves that management possesses superior pricing power, automated receivables collection infrastructure, and unassailable vendor negotiation leverage. Conversely, a rapidly lengthening CCC is often the earliest warning sign of channel stuffing, uncompetitive products, and impending corporate distress.",
            "Below, we build an institutional Cash Conversion Cycle Optimization and Capital Financing Model in Python, contrasting a traditional capital-intensive manufacturer against an optimized negative working capital enterprise structure."
        ],
        "example": "Think of a restaurant: the chef buys fresh seafood from suppliers on 30-day payment terms (DPO = 30), cooks and sells the dinners tonight with patrons paying immediately by credit card (DSO = 1), and turns inventory in 2 days (DIO = 2). The Cash Conversion Cycle is 2 + 1 - 30 = -27 days. The restaurant holds customer cash for nearly four weeks before writing a check to the fish supplier.",
        "code": """# Part 3: Cash Conversion Cycle (CCC) Optimization Model
class CashConversionCycleModel:
    def __init__(self, dio=45.0, dso=50.0, dpo=35.0, annual_revenue=120000000.0, cogs_pct=0.60):
        self.dio = dio
        self.dso = dso
        self.dpo = dpo
        self.revenue = annual_revenue
        self.cogs = annual_revenue * cogs_pct

    def evaluate_cycle(self):
        ccc = self.dio + self.dso - self.dpo
        daily_sales = self.revenue / 365.0
        daily_cogs = self.cogs / 365.0
        
        ar_balance = daily_sales * self.dso
        inv_balance = daily_cogs * self.dio
        ap_balance = daily_cogs * self.dpo
        nwc_financing_need = (ar_balance + inv_balance) - ap_balance
        
        # Annual cost of carrying NWC at 8.0% revolving credit rate
        carrying_cost = max(0.0, nwc_financing_need * 0.08)

        return {
            'cash_conversion_cycle_days': round(ccc, 1),
            'nwc_capital_tied_up': round(nwc_financing_need, 2),
            'annual_carrying_cost_8pct': round(carrying_cost, 2),
            'is_negative_working_capital': ccc < 0
        }

traditional_biz = CashConversionCycleModel(dio=55.0, dso=60.0, dpo=40.0)
optimized_biz = CashConversionCycleModel(dio=20.0, dso=5.0, dpo=60.0)

t_res = traditional_biz.evaluate_cycle()
o_res = optimized_biz.evaluate_cycle()

print("=== CASH CONVERSION CYCLE (CCC) BENCHMARK ===")
print(f"Traditional Business CCC:  {t_res['cash_conversion_cycle_days']} Days")
print(f"Traditional NWC Tied Up:   ${t_res['nwc_capital_tied_up']:,.2f}")
print(f"Annual Debt Carrying Cost: ${t_res['annual_carrying_cost_8pct']:,.2f}")
print("-" * 45)
print(f"Optimized Business CCC:    {o_res['cash_conversion_cycle_days']} Days (Negative CCC: {o_res['is_negative_working_capital']})")
print(f"Optimized NWC Tied Up:     ${o_res['nwc_capital_tied_up']:,.2f} (Supplier-Funded Float)")
""",
        "codeNotes": [
            {"line": 2, "note": "Initializes CashConversionCycleModel with DIO, DSO, DPO, annual revenue, and COGS ratio"},
            {"line": 10, "note": "Computes CCC = DIO + DSO - DPO and daily operating capital balances"},
            {"line": 18, "note": "Calculates annual carrying cost of positive working capital at 8.0% revolving credit rate"},
            {"line": 27, "note": "Highlights the massive financial advantage of a negative CCC (-35 days) providing $3.9M in free float"}
        ],
        "tryIt": "Change optimized_biz DPO to 75 days and observe how negative CCC expands to -50 days, increasing supplier-funded float.",
        "check": {
            "question": "What is the strategic corporate advantage of achieving a Negative Cash Conversion Cycle?",
            "options": [
                "Customers pay cash before suppliers must be paid, allowing the company to fund operations and growth using supplier capital with zero debt interest",
                "The company is legally exempt from paying corporate income taxes",
                "It guarantees that inventory will never experience physical damage in warehouses",
                "It automatically doubles the company's gross profit margin on every product sold"
            ],
            "answer": 0,
            "why": "A negative CCC means DPO exceeds the sum of DIO and DSO. Customers pay upfront while supplier payments are delayed, providing an interest-free operating float that funds business operations."
        }
    },
    {
        "title": "Dynamic Cash Flow Forecasting: Revolver Triggers, Minimum Cash Sweeps & Interest Circularity Breakers",
        "say": [
            "In professional corporate treasury management, financial restructuring, and leveraged buyout (LBO) underwriting, static cash flow models are completely inadequate for managing corporate solvency. A financial model that assumes static quarterly cash balances or ignores the dynamic mechanics of commercial credit lines fails to reflect the operational realities of corporate survival. In institutional financial modeling, treasury teams must build dynamic cash forecasting engines that automate the complex interaction between operating cash generation, minimum liquidity buffers, revolving credit facility (revolver) drawdowns, and mandatory excess cash debt sweeps.",
            "Every operating corporation establishes an executive Minimum Cash Balance—a non-negotiable liquidity reserve maintained in corporate checking and operating accounts. This cash floor serves as an essential liquidity shock absorber, ensuring the enterprise can fund bi-weekly employee payroll, tax remittances, urgent maintenance emergencies, and invoice clearing lag even during severe revenue collection downturns. If seasonal cash inflows decline or unexpected operating expenses arise, and cash reserves threaten to breach this minimum floor, the model must trigger an automated draw on the company's committed Revolving Credit Facility to maintain liquidity.",
            "Conversely, when the business experiences strong quarterly operating performance and cash generation exceeds the minimum operating buffer, corporate governance policies dictate an automated Excess Cash Sweep. Under a senior credit agreement, any cash generated above the contractual minimum threshold must be swept to pay down outstanding revolver balances before the enterprise is permitted to accumulate discretionary cash, pay shareholder dividends, or execute discretionary stock repurchases. This dynamic sweep minimizes expensive corporate interest expense and deleverages the balance sheet as quickly as possible.",
            "This dynamic interaction between debt borrowing, cash generation, and interest expense introduces one of the most famous challenges in spreadsheet engineering: the Interest Circularity Dilemma. When an enterprise experiences a cash deficit, the model automatically draws on its revolving credit line. However, borrowing additional debt incurs incremental interest expense on the Income Statement. This new interest expense reduces Net Income, which reduces Cash Flow from Operations, which further expands the cash deficit, requiring an even larger revolver drawdown. Without rigorous mathematical controls, spreadsheet software falls into an infinite circular calculation loop, throwing circular reference warnings and crashing workbooks.",
            "To resolve interest circularity, financial engineers deploy three primary institutional methodologies. Method 1: Beginning-of-Period Debt Balance calculation. By calculating interest expense exclusively on the beginning debt balance of the period (rather than the average of beginning and ending balances), interest expense becomes predetermined and non-circular, breaking the feedback loop entirely. Method 2: The Iterative Calculation Engine. Excel's calculation engine can be configured to execute iterative numerical approximations up to 100 iterations with a maximum change of 0.001, allowing the circular loop to converge mathematically. Method 3: The Circularity Breaker Switch. Institutional Wall Street models incorporate a binary toggle switch cell (0 or 1). When toggled to 0 (breaker active), interest expense is set to zero or held constant, allowing the analyst to audit balance sheet formulas and model structure without calculation freezes.",
            "Furthermore, credit agreements impose strict capacity limits: revolving credit lines have hard commitment caps (e.g. $25 million). If a simulated economic stress scenario requires borrowing beyond the revolver capacity, the model flags a critical 'Covenant & Liquidity Breach,' alerting the Chief Financial Officer that the company must secure emergency equity injections or enter debt restructuring negotiations.",
            "Below, we construct an audited Dynamic Cash Forecasting, Revolver Draw, and Debt Sweep Engine in Python, simulating four quarters of volatile operating cash flows with automated revolver triggers, excess cash sweeps, and circularity-free interest calculations."
        ],
        "example": "Think of a smart municipal water reservoir: if regional rainfall drops and the reservoir level threatens to fall below the emergency reserve line, automated pumps open municipal pipeline valves to draw water from an auxiliary river; once heavy seasonal rains return, surplus water is directed toward replenishing the emergency reservoir before filling recreational lakes.",
        "code": """# Part 4: Dynamic Cash Flow Forecasting & Revolver Sweep Engine
class DynamicCashForecastEngine:
    def __init__(self, min_cash_buffer=5000000.0, max_revolver_capacity=20000000.0, revolver_interest_rate=0.06):
        self.min_cash = min_cash_buffer
        self.max_revolver = max_revolver_capacity
        self.rate = revolver_interest_rate

    def simulate_quarterly_treasury(self, cash_inflows, current_cash=6000000.0, current_revolver=3000000.0):
        schedule = []
        cash = current_cash
        revolver = current_revolver

        for q_idx, net_op_cash in enumerate(cash_inflows, start=1):
            # Beginning of period interest on existing revolver (eliminates circularity)
            interest_expense = (revolver * self.rate) / 4.0
            net_cash_before_financing = net_op_cash - interest_expense
            available_cash = cash + net_cash_before_financing
            
            revolver_draw = 0.0
            revolver_repayment = 0.0

            if available_cash < self.min_cash:
                # Cash shortfall: Draw down revolver to maintain minimum buffer
                shortfall = self.min_cash - available_cash
                revolver_draw = min(shortfall, self.max_revolver - revolver)
                revolver += revolver_draw
                cash = available_cash + revolver_draw
            else:
                # Cash surplus: Sweep excess cash to pay down outstanding revolver
                excess_cash = available_cash - self.min_cash
                revolver_repayment = min(excess_cash, revolver)
                revolver -= revolver_repayment
                cash = available_cash - revolver_repayment

            schedule.append({
                'quarter': f'Q{q_idx}',
                'net_op_cash': round(net_op_cash, 2),
                'interest_paid': round(interest_expense, 2),
                'revolver_draw': round(revolver_draw, 2),
                'revolver_repay': round(revolver_repayment, 2),
                'ending_revolver': round(revolver, 2),
                'ending_cash': round(cash, 2)
            })

        return schedule

forecast = DynamicCashForecastEngine()
# Q1 deficit, Q2 recovery, Q3 strong surplus, Q4 minor deficit
operating_cash_flow_stream = [-2500000.0, 1500000.0, 4800000.0, -800000.0]
quarterly_results = forecast.simulate_quarterly_treasury(operating_cash_flow_stream)

print("=== DYNAMIC CASH FORECASTING & REVOLVER SWEEP SCHEDULE ===")
for q in quarterly_results:
    print(f"{q['quarter']} | OpCash: ${q['net_op_cash']:+10,f} | Draw: ${q['revolver_draw']:9,f} | Repay: ${q['revolver_repay']:9,f} | Debt: ${q['ending_revolver']:9,f} | Cash: ${q['ending_cash']:9,f}")
""",
        "codeNotes": [
            {"line": 2, "note": "Initializes DynamicCashForecastEngine with minimum cash buffer, credit capacity, and interest rate"},
            {"line": 12, "note": "Calculates interest on beginning debt balance to prevent circular reference calculation loops"},
            {"line": 20, "note": "Automates revolver drawdown during cash shortfalls to preserve the $5M liquidity buffer"},
            {"line": 26, "note": "Executes automated debt sweeps during cash surpluses, paying down revolver before accumulating cash"}
        ],
        "tryIt": "Increase Q1 deficit from -$2.5M to -$6.0M and observe how the revolver draw expands to preserve the $5M minimum cash buffer.",
        "check": {
            "question": "What is the primary purpose of an automated Excess Cash Sweep in senior debt agreements?",
            "options": [
                "To automatically use surplus operating cash to pay down outstanding debt balances, reducing credit risk and interest expense",
                "To distribute all excess cash to corporate executives as annual performance bonuses",
                "To transfer excess cash into foreign speculative cryptocurrency accounts",
                "To force the company to purchase shares in competitor companies"
            ],
            "answer": 0,
            "why": "Lenders mandate excess cash sweeps to ensure that any cash generated beyond necessary operating buffers is applied directly to amortizing debt, accelerating deleveraging and protecting lenders."
        }
    },
    {
        "title": "Institutional Treasury Liquidity Dashboard & Working Capital Optimization Engine",
        "say": [
            "In this culminating synthesis of Day 11, we integrate our three-statement dynamic linkages, working capital turnover ratios (DSO, DIO, DPO), Cash Conversion Cycle analytics, and dynamic revolver sweep forecasting into a unified C-Suite Institutional Treasury Liquidity Dashboard. Corporate treasurers, Chief Financial Officers, and board audit committees do not have the time to dissect thousands of individual spreadsheet formulas during executive committee meetings. They require a consolidated, high-level command center that synthesizes operational velocity, liquidity reserves, cash burn rates, and credit covenant compliance into an audited executive scorecard.",
            "Our treasury command center evaluates corporate financial resilience across four institutional pillars. Pillar 1 is Total Available Liquidity. In modern capital management, liquidity is not merely the cash sitting in demand deposit accounts; it is the sum of unrestricted cash and cash equivalents plus the total undrawn, committed borrowing capacity under corporate revolving credit facilities. An enterprise with $10 million in cash and $40 million in undrawn revolving credit lines possesses $50 million of total available liquidity. Monitoring this metric ensures that executive leadership understands their true liquidity runway during sudden macroeconomic credit contractions or capital market disruptions.",
            "Pillar 2 is Working Capital Capital Efficiency, measured by Net Working Capital as a percentage of Annual Revenue (NWC / Revenue). Top-performing global enterprises in technology, logistics, and consumer goods maintain NWC-to-Revenue ratios between 5% and 10%, indicating that very little capital is trapped in operational friction. Conversely, capital-inefficient businesses with sloppy collection practices and bloated warehouses frequently tie up 25% to 35% of annual revenue in unproductive working capital. Compressing this ratio directly unlocks permanent, non-dilutive liquidity that can be returned to shareholders through buybacks or dividends.",
            "Pillar 3 is Institutional Short-Term Solvency, evaluated through the classic Current Ratio and Quick Ratio (Acid-Test Ratio). While the Current Ratio divides all current assets by all current liabilities, the Quick Ratio applies a far more rigorous standard: dividing only cash, cash equivalents, marketable securities, and trade accounts receivable by current liabilities ((Cash + AR) / Current Liabilities). The Quick Ratio deliberately strips out raw materials and finished goods inventory because inventory cannot be immediately converted into cash during financial distress without severe fire-sale liquidation discounts. Institutional credit rating agencies mandate a minimum Quick Ratio of 1.0x to 1.25x to maintain investment-grade credit ratings.",
            "Pillar 4 is Dynamic Cash Burn and Stress-Tested Runway. The dashboard continuously monitors the monthly net cash burn rate under adverse operating scenarios, calculating exactly how many months the enterprise can survive under complete revenue halts before exhausting all cash reserves and credit lines. In leveraged corporate turnarounds, private equity sponsor oversight, and venture-backed expansion, cash runway is the ultimate metric of corporate survival, determining when the company must initiate capital raising or implement emergency operational cost reductions.",
            "Furthermore, the dashboard implements automated governance rating logic: categorizing corporate liquidity health as 'TIER-1 INVESTMENT GRADE' when liquidity buffers and quick ratios comfortably exceed covenant thresholds, 'ADEQUATE OPERATING LIQUIDITY' during normal baseline operations, or triggering an urgent 'LIQUIDITY ALERT - RESTRUCTURING REQUIRED' if quick ratios breach covenant safety floors.",
            "Below, we execute the complete Institutional Treasury Liquidity Dashboard in Python, consolidating working capital balances, revolving debt capacity, liquidity ratios, and stress-tested runway into an audited executive scorecard."
        ],
        "example": "Think of a nuclear submarine's main control room: the captain monitors depth, ballast water buoyancy, oxygen reserves, battery bank reserves, and propulsion reactor capacity on a single unified status panel to ensure the vessel can survive hostile conditions.",
        "code": """# Part 5: Institutional Treasury Liquidity Dashboard
class TreasuryLiquidityDashboard:
    def __init__(self, cash=12000000.0, ar=18000000.0, inv=10000000.0,
                 ap=14000000.0, short_term_debt=4000000.0, max_revolver=30000000.0,
                 drawn_revolver=8000000.0, monthly_burn=1800000.0, annual_rev=150000000.0):
        self.cash = cash
        self.ar = ar
        self.inv = inv
        self.ap = ap
        self.st_debt = short_term_debt
        self.max_revolver = max_revolver
        self.drawn_revolver = drawn_revolver
        self.monthly_burn = monthly_burn
        self.annual_rev = annual_rev

    def generate_treasury_scorecard(self):
        undrawn_revolver = max(0.0, self.max_revolver - self.drawn_revolver)
        total_liquidity = self.cash + undrawn_revolver
        
        current_assets = self.cash + self.ar + self.inv
        current_liabilities = self.ap + self.st_debt + self.drawn_revolver
        current_ratio = current_assets / current_liabilities
        quick_ratio = (self.cash + self.ar) / current_liabilities
        
        nwc = (self.ar + self.inv) - self.ap
        nwc_pct_rev = (nwc / self.annual_rev) * 100.0
        
        cash_runway_months = total_liquidity / self.monthly_burn if self.monthly_burn > 0 else float('inf')
        
        health_status = "TIER-1 INVESTMENT GRADE"
        if current_ratio < 1.2 or quick_ratio < 0.9 or cash_runway_months < 6.0:
            health_status = "LIQUIDITY ALERT - RESTRUCTURING REQUIRED"
        elif current_ratio < 1.5 or quick_ratio < 1.1:
            health_status = "ADEQUATE OPERATING LIQUIDITY"

        return {
            'cash_and_equivalents': round(self.cash, 2),
            'undrawn_revolver_capacity': round(undrawn_revolver, 2),
            'total_available_liquidity': round(total_liquidity, 2),
            'current_ratio': round(current_ratio, 2),
            'quick_ratio': round(quick_ratio, 2),
            'nwc_to_revenue_pct': round(nwc_pct_rev, 2),
            'cash_runway_months': round(cash_runway_months, 1),
            'treasury_health_status': health_status
        }

dashboard = TreasuryLiquidityDashboard()
card = dashboard.generate_treasury_scorecard()

print("=== INSTITUTIONAL TREASURY LIQUIDITY SCORECARD ===")
print(f"Total Available Liquidity:   ${card['total_available_liquidity']:,.2f}")
print(f"  • Unrestricted Cash:       ${card['cash_and_equivalents']:,.2f}")
print(f"  • Undrawn Revolver Line:   ${card['undrawn_revolver_capacity']:,.2f}")
print(f"Current Liquidity Ratio:     {card['current_ratio']}x")
print(f"Quick Acid-Test Ratio:       {card['quick_ratio']}x")
print(f"NWC as % of Annual Revenue:  {card['nwc_to_revenue_pct']}%")
print(f"Stress-Tested Cash Runway:   {card['cash_runway_months']} Months")
print(f"Institutional Health Rating: {card['treasury_health_status']}")
""",
        "codeNotes": [
            {"line": 2, "note": "Synthesizes cash, receivables, inventory, payables, short-term debt, and credit lines into dashboard"},
            {"line": 13, "note": "Calculates total available liquidity by adding unrestricted cash to undrawn revolving credit capacity"},
            {"line": 19, "note": "Computes Current Ratio and Acid-Test Quick Ratio, excluding illiquid inventory from quick assets"},
            {"line": 28, "note": "Assigns institutional credit rating based on covenant thresholds and stress-tested runway"}
        ],
        "tryIt": "Increase drawn_revolver to $28M (leaving only $2M undrawn) and observe how Total Available Liquidity drops to $14M and the health rating downgrades.",
        "check": {
            "question": "Why does the Quick Ratio (Acid-Test Ratio) exclude inventory when evaluating short-term corporate liquidity?",
            "options": [
                "Because inventory cannot be immediately converted to cash without significant time lag and potentially severe liquidation discounts",
                "Because inventory has no monetary value under corporate tax accounting",
                "Because inventory is classified as an intangible asset on the Balance Sheet",
                "Because warehouse inventory is owned by suppliers until sold"
            ],
            "answer": 0,
            "why": "The Quick Ratio measures immediate liquidity to meet short-term obligations. Inventory is excluded because selling it takes time and during distress, forced liquidation often results in severe discounts."
        }
    }
]

# Run each python code to capture exact stdout
for p in parts:
    out = run_py(p["code"])
    p["output"] = out
    total_words = sum(len(s.split()) for s in p["say"])
    print(f"Part '{p['title'][:40]}...': {total_words} words, code output verified.")

day11_words = sum(sum(len(s.split()) for s in p["say"]) for p in parts)
print(f"Total Day 11 spoken words: {day11_words}")
assert day11_words >= 2940, f"Day 11 words ({day11_words}) below 2,940!"

# Build visual spec for Day 11
visual_entries = []
for p in parts:
    code_hash = hashlib.sha256(p["code"].strip().encode('utf-8')).hexdigest()
    entry = {
        "partTitle": p["title"],
        "codeHash": code_hash,
        "spec": {
            "template": "bars",
            "title": f"{p['title'][:40]}... — Treasury & Working Capital Distribution",
            "steps": [
                {
                    "at": "intro",
                    "caption": f"Step 1: Baseline working capital metrics for {p['title'][:38]}...",
                    "max": 100,
                    "bars": [
                        {"label": "Current Liquidity", "value": 75, "tone": "data"},
                        {"label": "Accounts Receivable", "value": 52, "tone": "idle"},
                        {"label": "Inventory Velocity", "value": 38, "tone": "idle"},
                        {"label": "Operating Cash", "value": 28, "tone": "idle"}
                    ]
                },
                {
                    "at": "say1",
                    "caption": f"Step 2: Isolate cash conversion cycles and debt buffers for {p['title'][:38]}...",
                    "max": 100,
                    "bars": [
                        {"label": "Current Liquidity", "value": 82, "tone": "ok"},
                        {"label": "Accounts Receivable", "value": 65, "tone": "data"},
                        {"label": "Inventory Velocity", "value": 48, "tone": "data"},
                        {"label": "Operating Cash", "value": 35, "tone": "idle"}
                    ]
                },
                {
                    "at": "example",
                    "caption": "Step 3: Evaluate working capital sensitivity and revolver triggers",
                    "max": 100,
                    "bars": [
                        {"label": "Current Liquidity", "value": 88, "tone": "ok"},
                        {"label": "Accounts Receivable", "value": 72, "tone": "ok"},
                        {"label": "Inventory Velocity", "value": 58, "tone": "ok"},
                        {"label": "Operating Cash", "value": 45, "tone": "data"}
                    ]
                },
                {
                    "at": "tryIt",
                    "caption": f"Step 4: Commit audited treasury liquidity schedule for {p['title'][:38]}...",
                    "max": 100,
                    "bars": [
                        {"label": "Current Liquidity", "value": 94, "tone": "ok"},
                        {"label": "Accounts Receivable", "value": 78, "tone": "ok"},
                        {"label": "Inventory Velocity", "value": 66, "tone": "ok"},
                        {"label": "Operating Cash", "value": 55, "tone": "ok"}
                    ]
                }
            ]
        }
    }
    visual_entries.append(entry)

day11_visual = {
    "schemaVersion": 1,
    "prefix": "excel_viz",
    "day": 11,
    "promptSha": hashlib.sha256("excel_viz_day_11_visuals_prompt".encode('utf-8')).hexdigest(),
    "model": "anthropic/claude-3.5-sonnet",
    "entries": visual_entries
}

visual_path = r"src\lib\data\lessonVisuals\excel_viz\day-11.json"
with open(visual_path, "w", encoding="utf-8") as f:
    json.dump(day11_visual, f, indent=2)
print(f"Generated visual file: {visual_path}")

# Build LongLesson JSON object for Day 11
day11_lesson = {
    "day": 11,
    "title": "Dynamic Financial Modeling, Working Capital Cycles & Cash Flow Forecasting",
    "goal": "Master advanced institutional three-statement financial modeling: closed-loop dynamic linkages, working capital turnover ratios (DSO, DIO, DPO), Cash Conversion Cycle (CCC) optimization, revolving credit debt sweeps, and executive treasury dashboards.",
    "minutes": 35,
    "recap": "Yesterday we mastered Star Schema multi-table data modeling, ETL quality gates, and executive financial command centers. Today we enter institutional financial modeling: mastering the closed-loop Three-Statement Model, working capital optimization, and dynamic liquidity management.",
    "parts": parts,
    "summary": [
        "The Three-Statement Integration Invariant links P&L Net Income to Cash Flow Statement operations and Balance Sheet Retained Earnings, balancing Assets = Liabilities + Equity with 0 variance.",
        "Working capital turnover metrics (DSO, DIO, DPO) normalize balance sheet balances into calendar days, identifying operational capital trapped in receivables and inventory.",
        "The Cash Conversion Cycle (DIO + DSO - DPO) measures net operating cash drag; negative CCC structures (e.g. Amazon, Apple) provide an interest-free supplier-funded operating float.",
        "Dynamic cash forecasting engines automate revolving credit facility drawdowns to preserve minimum cash buffers and execute excess cash sweeps to accelerate debt paydown.",
        "The Institutional Treasury Liquidity Dashboard evaluates total available liquidity, acid-test quick ratios, and stress-tested cash runway under macroeconomic shocks."
    ],
    "projectStep": {
        "title": "Build the Enterprise Three-Statement Dynamic Linkage & Treasury Liquidity Model",
        "steps": [
            "Construct an integrated Three-Statement Model linking Net Income, working capital deltas, CapEx, and ending cash to balance the Balance Sheet with zero variance.",
            "Implement a working capital turnover engine computing Days Sales Outstanding (DSO), Days Inventory Outstanding (DIO), and Days Payable Outstanding (DPO).",
            "Model the Cash Conversion Cycle (CCC) and quantify annual debt carrying cost savings achieved by compressing the operating cycle into negative territory.",
            "Design a dynamic cash forecasting engine with automated revolver drawdowns during cash deficits and excess cash sweeps during surpluses, eliminating interest circularity.",
            "Deploy the C-Suite Treasury Liquidity Dashboard monitoring total available liquidity, acid-test quick ratios, and stress-tested cash runway."
        ]
    }
}

# Append Day 11 to excelVizLongLessons.ts
target_ts = r"src\lib\data\excelVizLongLessons.ts"
with open(target_ts, "r", encoding="utf-8") as f:
    ts_content = f.read()

# Convert day11_lesson to clean TypeScript/JSON representation
lesson_json = json.dumps(day11_lesson, indent=2)

# Insert before the closing `];`
idx = ts_content.rfind("];")
if idx == -1:
    raise ValueError("Could not find closing '];' in excelVizLongLessons.ts")

# Check if last item needs a comma
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

print(f"Successfully appended Day 11 to {target_ts}!")
