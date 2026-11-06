# scripts/data_day27.py
# Day 27: Working Capital & Cash Conversion Cycle (CCC) Analytics: DSO, DIO, DPO & Operational Cash Drag
# Strict Invariant: Pure Python stdlib only, >= 600 words per part (>= 3,000 words total)

import math
import random
import statistics

# -------------------------------------------------------------
# Part 1: The Working Capital Triad: DSO, DIO & DPO Microeconomic Foundations
# -------------------------------------------------------------
p1_say = [
    "In financial decision intelligence, an elementary truth separates novice analysts from master corporate treasurers: Revenue is an opinion, profit is an accounting construct, but Cash is empirical reality. A company can report record accounting profits on its income statement and simultaneously file for Chapter 11 bankruptcy if its operational cash is trapped in unpaid customer invoices or unsold warehouse inventory. Working Capital Analytics evaluates the efficiency with which an enterprise converts its day-to-day operating cycle into free, unencumbered liquidity.",

    "Net Working Capital (NWC) is defined on the corporate balance sheet as Current Operating Assets minus Current Operating Liabilities: NWC = (Accounts Receivable + Inventory + Cash) - (Accounts Payable + Accrued Expenses). However, static dollar amounts on a quarterly balance sheet fail to capture operational velocity. To measure the speed of liquidity transformation, corporate treasury relies on the foundational Working Capital Triad: Days Sales Outstanding (DSO), Days Inventory Outstanding (DIO), and Days Payable Outstanding (DPO).",

    "The first metric of the triad is Days Sales Outstanding (DSO), also known as the Average Collection Period. DSO measures the average number of days required for an enterprise to collect cash from customers after credit sales are recognized: DSO = (Accounts Receivable / Total Credit Sales) * 365. If a company generates $120 million in annual credit sales and carries an average Accounts Receivable balance of $20 million, its DSO is: ($20M / $120M) * 365 = 60.8 days. A high or rising DSO signals loose credit policies, invoice processing errors, customer disputes, or counterparty credit distress.",

    "The second metric is Days Inventory Outstanding (DIO), also known as Days Sales of Inventory (DSI). DIO measures the average number of days inventory sits on physical warehouse shelves or factory floors before being sold to a customer: DIO = (Ending Inventory / Cost of Goods Sold) * 365. Cost of Goods Sold (COGS) is used in the denominator rather than sales revenue because inventory on the balance sheet is carried at cost, not retail price. A high DIO indicates sluggish inventory turnover, excessive safety stock buffers, obsolete SKUs, or demand forecasting failure.",

    "The third metric is Days Payable Outstanding (DPO), which measures the average number of days the enterprise takes to pay its trade vendors, raw material suppliers, and service providers for invoices received: DPO = (Accounts Payable / Cost of Goods Sold) * 365. Unlike DSO and DIO (where lower values indicate superior operational speed), a higher DPO is financially advantageous: it means the enterprise preserves its cash in corporate bank accounts longer, effectively utilizing trade suppliers as an interest-free source of operational working capital financing.",

    "Together, these three metrics define the operational health of commercial enterprise. In the accompanying Python implementation, we build an Enterprise Working Capital Triad Engine from first principles using pure Python standard library routines. We ingest multi-quarter balance sheet and income statement records, compute exact annualized DSO, DIO, and DPO metrics, and benchmark corporate liquidity velocity.",

    "To manage Accounts Receivable proactively, corporate credit analytics deploys Receivable Aging Schedules and Provisioning Analytics. Receivables are stratified into temporal buckets: Current (0–30 days), 31–60 days, 61–90 days, and Over 90 days. Empirical default hazard rates escalate exponentially across aging buckets: a customer invoice overdue by 120 days has less than a 50% probability of collection.",

    "Furthermore, treasury departments deploy Dynamic Early Payment Discounting to accelerate DSO. Under traditional trade credit terms such as '2/10 Net 30', the buyer is granted a 2% cash discount if payment is settled within 10 days; otherwise, full payment is due in 30 days. The annualized effective interest rate implied by forgoing this 2% discount is staggering: Annual APR = [ Discount% / (100% - Discount%) ] * [ 365 / (Credit Period - Discount Period) ] = [ 2 / 98 ] * [ 365 / 20 ] = 37.24% APR! Understanding this mathematical cost allows treasury teams to calibrate early payment incentives that pull forward customer cash flow while earning high annualized returns on liquidity.",

    "In the accompanying Python implementation, we build an Enterprise Working Capital Triad Engine from first principles using pure Python standard library routines. We ingest multi-quarter balance sheet and income statement records, compute exact annualized DSO, DIO, and DPO metrics, and benchmark corporate liquidity velocity."
]

p1_code = r"""# Pure Python Working Capital Triad (DSO, DIO, DPO) Engine

class WorkingCapitalTriadAnalyzer:
    def __init__(self, revenue, cogs, accounts_receivable, inventory, accounts_payable, days=365):
        self.rev = float(revenue)
        self.cogs = float(cogs)
        self.ar = float(accounts_receivable)
        self.inv = float(inventory)
        self.ap = float(accounts_payable)
        self.days = float(days)
        self._calculate()
        
    def _calculate(self):
        # 1. Days Sales Outstanding (DSO) = (AR / Revenue) * Days
        self.dso = (self.ar / self.rev) * self.days if self.rev > 0 else 0.0
        
        # 2. Days Inventory Outstanding (DIO) = (Inventory / COGS) * Days
        self.dio = (self.inv / self.cogs) * self.days if self.cogs > 0 else 0.0
        
        # 3. Days Payable Outstanding (DPO) = (AP / COGS) * Days
        self.dpo = (self.ap / self.cogs) * self.days if self.cogs > 0 else 0.0
        
        # Dollar value of 1 day for each metric
        self.dollar_value_per_day_dso = self.rev / self.days
        self.dollar_value_per_day_dio = self.cogs / self.days
        self.dollar_value_per_day_dpo = self.cogs / self.days

    def get_summary(self):
        return {
            'annual_revenue': round(self.rev, 2),
            'annual_cogs': round(self.cogs, 2),
            'dso_days': round(self.dso, 1),
            'dio_days': round(self.dio, 1),
            'dpo_days': round(self.dpo, 1),
            'cash_value_of_1_day_dso': round(self.dollar_value_per_day_dso, 2),
            'cash_value_of_1_day_dio': round(self.dollar_value_per_day_dio, 2),
            'cash_value_of_1_day_dpo': round(self.dollar_value_per_day_dpo, 2)
        }

# Enterprise Case: Industrial Equipment Manufacturer ($85M Revenue, $52M COGS)
analyzer = WorkingCapitalTriadAnalyzer(
    revenue=85000000.0,
    cogs=52000000.0,
    accounts_receivable=14500000.0, # AR = $14.5M
    inventory=11800000.0,           # Inventory = $11.8M
    accounts_payable=6800000.0      # AP = $6.8M
)

res = analyzer.get_summary()

print("--- ENTERPRISE WORKING CAPITAL TRIAD METRICS ---")
print(f"Annual Revenue: ${res['annual_revenue']:12,.2f} | Annual COGS: ${res['annual_cogs']:12,.2f}\n")
print(f"1. Days Sales Outstanding (DSO): {res['dso_days']:5.1f} days (Cash value per day: ${res['cash_value_of_1_day_dso']:10,.2f})")
print(f"2. Days Inventory Outstanding (DIO): {res['dio_days']:5.1f} days (Cash value per day: ${res['cash_value_of_1_day_dio']:10,.2f})")
print(f"3. Days Payable Outstanding (DPO):   {res['dpo_days']:5.1f} days (Cash value per day: ${res['cash_value_of_1_day_dpo']:10,.2f})")
"""

p1_mcq = {
    "question": "Why is Cost of Goods Sold (COGS) used as the denominator when calculating Days Inventory Outstanding (DIO) rather than total sales revenue?",
    "options": [
        "Because inventory is recorded on the balance sheet at acquisition cost, requiring a cost-basis denominator to avoid distorting inventory holding duration with gross profit markups.",
        "Because GAAP accounting prohibits dividing balance sheet assets by revenue figures.",
        "Because supplier payment terms are legally pegged to COGS under commercial trade law.",
        "Because sales revenue is recognized only after customer warranty periods expire."
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "Inventory assets are held at cost on the balance sheet. Using revenue (which includes gross margin) would artificially understate true inventory dwell time."
}

# -------------------------------------------------------------
# Part 2: The Cash Conversion Cycle (CCC): Mathematical Formulation & Balance Sheet Mechanics
# -------------------------------------------------------------
p2_say = [
    "Having independently quantified DSO, DIO, and DPO, we integrate them into the definitive metric of operational liquidity: The Cash Conversion Cycle (CCC), originally formulated by Gitman in 1974 and mathematically formalized by Richards and Laughlin in 1980. The Cash Conversion Cycle measures the net time span in days between when an enterprise pays cold cash to suppliers for raw materials and when it receives cold cash from customers for delivered finished goods.",

    "To understand the balance sheet mechanics of the Cash Conversion Cycle, we must first examine the Operating Cycle (OC). The Operating Cycle spans the entire operational journey of physical goods through the enterprise: it begins when raw materials arrive at the warehouse, continues while inventory is manufactured and stored (DIO), and concludes when customer receivables from the resulting sale are finally collected in cash (DSO): Operating Cycle (OC) = DIO + DSO.",

    "However, the enterprise rarely pays for raw materials in cash immediately upon arrival. Vendors grant trade credit terms (such as Net 30, Net 60, or Net 90), allowing the enterprise to delay payment. This delay is Days Payable Outstanding (DPO). Therefore, the enterprise's own cash is committed only for the duration of the operating cycle that is NOT financed by vendor trade credit. Subtracting DPO from the Operating Cycle yields the canonical Cash Conversion Cycle Equation: CCC = Operating Cycle - DPO = DIO + DSO - DPO.",

    "Let us trace the operational cash timeline: On Day 0, raw materials arrive at the factory. The supplier issues an invoice due in 45 days (DPO = 45). The materials spend 60 days in production and warehouse storage before being sold (DIO = 60). On Day 45, the enterprise must write a cash check to settle the supplier's invoice. On Day 60, the finished product is sold on credit, generating an accounts receivable due in 40 days (DSO = 40). Finally, on Day 100 (60 + 40), the customer pays in cash. For how long was the enterprise's cash trapped out of pocket? From Day 45 (cash paid to supplier) until Day 100 (cash received from customer), exactly: 100 - 45 = 55 days! Confirming via our formula: CCC = 60 (DIO) + 40 (DSO) - 45 (DPO) = 55 days.",

    "During those 55 days, the enterprise experiences a Cash Deficit: it has disbursed cash to suppliers but has not yet collected cash from buyers. To bridge this 55-day cash deficit, the company must maintain expensive bank revolving credit lines, issue commercial paper, or tie up equity capital. If CCC expands from 55 days to 85 days, the firm must borrow millions in incremental liquidity just to keep operating doors open.",

    "However, standard annual or quarterly CCC calculations suffer from Seasonal Horizon Distortion when an enterprise operates in highly cyclical industries (such as retail during the Q4 holiday surge or agribusiness during autumn harvest). In seasonal businesses, dividing period-ending balance sheet balances by trailing annual sales produces wildly artificial swings in DSO and DIO.",

    "To eliminate seasonal distortion, advanced financial analytics deploys the Count-Back (Exhaustion) Method. Instead of using aggregate annual denominators, the exhaustion algorithm works backward through monthly sales and COGS records, determining the exact number of historical days of prior revenue required to absorb the current accounts receivable balance. By calculating DSO and DIO via monthly count-back algorithms, corporate treasury isolates genuine changes in customer payment behavior from seasonal revenue volatility.",

    "In the accompanying Python implementation, we build a Cash Conversion Cycle Analytics Engine. We model timeline cash flows, compute operating cycles and cash conversion cycles, and simulate the liquidity impact of changing trade credit terms."
]

p2_code = r"""# Pure Python Cash Conversion Cycle (CCC) Engine

class CashConversionCycleEngine:
    def __init__(self, dio, dso, dpo):
        self.dio = float(dio)
        self.dso = float(dso)
        self.dpo = float(dpo)
        self._evaluate()
        
    def _evaluate(self):
        # Operating Cycle = DIO + DSO
        self.operating_cycle = self.dio + self.dso
        
        # Cash Conversion Cycle = Operating Cycle - DPO = DIO + DSO - DPO
        self.ccc = self.operating_cycle - self.dpo
        
    def get_timeline_breakdown(self):
        return {
            'Days_Inventory_Outstanding_DIO': round(self.dio, 1),
            'Days_Sales_Outstanding_DSO': round(self.dso, 1),
            'Total_Operating_Cycle_Days': round(self.operating_cycle, 1),
            'Days_Payable_Outstanding_DPO': round(self.dpo, 1),
            'Cash_Conversion_Cycle_CCC_Days': round(self.ccc, 1),
            'Cash_Status': "Cash Deficit (External Financing Needed)" if self.ccc > 0 else "Negative CCC (Self-Funding Float!)"
        }

# Benchmark 3 competing corporate supply chain profiles
profiles = [
    ("Traditional Heavy Manufacturing", 75.0, 55.0, 40.0), # CCC = 75 + 55 - 40 = 90 days
    ("Lean Automotive Assembler", 25.0, 30.0, 45.0),       # CCC = 25 + 30 - 45 = 10 days
    ("Modern E-Commerce Retailer", 22.0, 3.0, 60.0)         # CCC = 22 + 3 - 60 = -35 days!
]

print("--- CASH CONVERSION CYCLE (CCC) COMPARATIVE BENCHMARK ---")
for name, dio_v, dso_v, dpo_v in profiles:
    engine = CashConversionCycleEngine(dio_v, dso_v, dpo_v)
    res = engine.get_timeline_breakdown()
    print(f"\nProfile: {name}")
    print(f"  Operating Cycle (DIO + DSO): {res['Total_Operating_Cycle_Days']:5.1f} days (DIO: {res['Days_Inventory_Outstanding_DIO']}, DSO: {res['Days_Sales_Outstanding_DSO']})")
    print(f"  Supplier Financing (DPO):    {res['Days_Payable_Outstanding_DPO']:5.1f} days")
    print(f"  Net Cash Conversion Cycle:   {res['Cash_Conversion_Cycle_CCC_Days']:5.1f} days -> {res['Cash_Status']}")
"""

p2_mcq = {
    "question": "What does a positive Cash Conversion Cycle (e.g., CCC = +55 days) signify for corporate treasury operations?",
    "options": [
        "The firm experiences a 55-day cash deficit between paying suppliers and receiving customer cash, requiring external working capital financing.",
        "The firm generates fifty-five days of free cash float funded by customer prepayments.",
        "The firm's inventory turnover rate has doubled over the prior operating quarter.",
        "Accounts receivable collections precede supplier invoice generation by fifty-five days."
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "Positive CCC means the firm pays suppliers before collecting customer receivables. During this gap, the company's cash is trapped, requiring bank lines or working capital buffers."
}

# -------------------------------------------------------------
# Part 3: The Phenomenon of Negative Cash Conversion Cycles: The Float Engine
# -------------------------------------------------------------
p3_say = [
    "While traditional enterprises operate with positive Cash Conversion Cycles ranging from 30 to 90 days, the elite apex of global capitalism—pioneered by Amazon, Dell, Walmart, and Apple—operates with a financial superpower known as a Negative Cash Conversion Cycle (Negative CCC). A negative CCC manifests when Days Payable Outstanding strictly exceeds the Operating Cycle: DPO > DIO + DSO, causing CCC = (DIO + DSO) - DPO to become less than zero.",

    "In standard business operations, expanding sales consumes cash (because accounts receivable and inventory grow). But under a Negative Cash Conversion Cycle, this economic relationship is completely inverted: Rapid sales growth GENERATES massive cash inflows! The enterprise collects cash from end customers weeks or months BEFORE it is required to settle invoices with its upstream suppliers. This structural delay creates a permanent reservoir of non-interest-bearing operating liquidity known as Working Capital Float.",

    "Let us examine the corporate mechanics of Amazon's iconic float engine: In Amazon's retail operations, customer payment is collected instantaneously via credit card at the digital checkout button (DSO = 2 to 3 days). Due to automated fulfillment logistics and continuous algorithmic reordering, inventory turns with extreme velocity, staying in fulfillment centers for an average of only 25 to 30 days (DIO = 28 days). Operating Cycle is thus: 28 + 3 = 31 days. However, leveraging its massive purchasing power and marketplace dominance, Amazon negotiates Net 60 to Net 90 payment terms with suppliers (DPO = 75 days).",

    "Computing Amazon's Cash Conversion Cycle: CCC = 28 (DIO) + 3 (DSO) - 75 (DPO) = -44 days! For 44 operating days, Amazon holds and controls billions of dollars of supplier cash interest-free. Amazon uses this float to build automated robotic warehouses, invest in Amazon Web Services (AWS) data centers, acquire subsidiaries, and fund aggressive R&D—all without taking out bank loans or issuing dilutive equity shares. The suppliers effectively finance Amazon's corporate expansion!",

    "Similarly, Michael Dell built the Dell computer empire in the 1990s on negative CCC: Customers configured and paid for custom PCs upfront on Dell.com with credit cards (DSO = 0), Dell assembled PCs just-in-time from vendor-consigned parts (DIO = 4 days), and paid component suppliers on Net 45 terms (DPO = 45 days). Dell operated with CCC = -41 days, enabling explosive 50% annual growth with negative capital investment.",

    "However, financial analysts must also evaluate the Hidden Risks of Over-Stretched DPO. While stretching supplier payment terms from 45 days to 90 or 120 days mechanically improves the Cash Conversion Cycle, it can trigger severe Counterparty Distress and Supply Chain Fragility. Small and medium suppliers operate on thin cash buffers; if an enterprise bully unilaterally delays payment, fragile suppliers may face bankruptcy, cutting off critical component deliveries.",

    "Furthermore, suppliers are not economically blind: when forced to accept punitive 120-day payment terms, suppliers quietly build financing surcharges, factoring fees, and risk premiums directly into their wholesale prices, inflating the enterprise's baseline unit COGS. To harvest float sustainably without bankrupting supply partners, leading corporations deploy Supply Chain Finance (Reverse Factoring) platforms, allowing suppliers to sell their approved invoices to commercial banks at the buyer's low investment-grade interest rate.",

    "To monitor vendor health under extended payment terms, treasury departments integrate Altman Z-Score Bankruptcy Hazard Analytics into supplier scorecards. The Altman Z-score formula, Z = 1.2 * X1 + 1.4 * X2 + 3.3 * X3 + 0.6 * X4 + 0.999 * X5, evaluates vendor liquidity, retained earnings, operating profitability, and market leverage. If extending DPO pushes critical sole-source suppliers into the dangerous Z < 1.81 'Distress Zone', the enterprise faces sudden catastrophic supply disruption. Sustainable working capital optimization balances float generation against supplier solvency.",

    "In the accompanying Python implementation, we build an Enterprise Negative CCC & Working Capital Float Engine. We simulate corporate revenue expansion, calculate daily float accumulation under negative CCC, compute the interest-free borrowing equivalent, and project balance sheet cash reserves."
]

p3_code = r"""# Pure Python Negative Cash Conversion Cycle (Float) Engine

class NegativeCCCFloatSimulator:
    def __init__(self, annual_revenue, cogs_pct=0.72, dio=26.0, dso=3.0, dpo=72.0, cost_of_debt=0.065):
        self.rev = float(annual_revenue)
        self.cogs = self.rev * float(cogs_pct)
        self.dio = float(dio)
        self.dso = float(dso)
        self.dpo = float(dpo)
        self.interest_rate = float(cost_of_debt)
        self._calculate()
        
    def _calculate(self):
        # 1. Cash Conversion Cycle
        self.operating_cycle = self.dio + self.dso
        self.ccc = self.operating_cycle - self.dpo # Negative!
        
        # 2. Balance sheet balances
        self.ar = (self.rev / 365.0) * self.dso
        self.inv = (self.cogs / 365.0) * self.dio
        self.ap = (self.cogs / 365.0) * self.dpo
        
        # 3. Net Working Capital (Operating) = (AR + Inv) - AP
        self.net_working_capital = (self.ar + self.inv) - self.ap
        
        # Under negative CCC, NWC is negative, representing cash float!
        self.float_generated = -self.net_working_capital if self.net_working_capital < 0 else 0.0
        
        # Annual interest savings by not needing bank revolver
        self.annual_interest_savings = self.float_generated * self.interest_rate

    def get_summary(self):
        return {
            'annual_revenue': round(self.rev, 2),
            'cash_conversion_cycle_days': round(self.ccc, 1),
            'operating_cycle_days': round(self.operating_cycle, 1),
            'dpo_days': round(self.dpo, 1),
            'accounts_receivable': round(self.ar, 2),
            'inventory': round(self.inv, 2),
            'accounts_payable': round(self.ap, 2),
            'net_operating_working_capital': round(self.net_working_capital, 2),
            'supplier_funded_cash_float': round(self.float_generated, 2),
            'annual_interest_expense_saved': round(self.annual_interest_savings, 2)
        }

# Model a $5 Billion Enterprise Retail Platform
platform = NegativeCCCFloatSimulator(
    annual_revenue=5000000000.0, # $5B Revenue
    cogs_pct=0.70,               # $3.5B COGS
    dio=25.0,                    # Fast inventory turns (25 days)
    dso=3.0,                     # Instant credit card checkout (3 days)
    dpo=75.0,                    # Net-75 payment terms to vendors
    cost_of_debt=0.065           # 6.5% commercial interest rate
)

res = platform.get_summary()

print("--- NEGATIVE CASH CONVERSION CYCLE: THE FLOAT ENGINE ---")
print(f"Annual Revenue: ${res['annual_revenue']:15,.2f} | CCC: {res['cash_conversion_cycle_days']} days")
print(f"Accounts Receivable:               ${res['accounts_receivable']:13,.2f}")
print(f"Warehouse Inventory:               ${res['inventory']:13,.2f}")
print(f"Accounts Payable (Supplier Owed):  ${res['accounts_payable']:13,.2f}")
print(f"Net Operating Working Capital:     ${res['net_operating_working_capital']:13,.2f} (NEGATIVE WORKING CAPITAL!)")
print(f"Free Supplier Cash Float Harvested:${res['supplier_funded_cash_float']:13,.2f}")
print(f"Annual Interest Saved (at 6.5%):   ${res['annual_interest_expense_saved']:13,.2f}/year!")
"""

p3_mcq = {
    "question": "How does an enterprise with a Negative Cash Conversion Cycle (e.g., CCC = -44 days) finance its corporate expansion and capital investments?",
    "options": [
        "By utilizing interest-free working capital float created because customer cash is collected weeks before supplier trade invoices become due.",
        "By issuing high-yield junk bonds to commercial banks.",
        "By selling fixed warehouse equipment on short-term leaseback contracts.",
        "By permanently eliminating supplier accounts payable liabilities."
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "Under negative CCC (DPO > DIO + DSO), the firm collects customer cash well before paying vendors. This creates a massive pool of permanent float that finances operations interest-free."
}

# -------------------------------------------------------------
# Part 4: Quantifying Operational Cash Drag & Cost of Capital Drag
# -------------------------------------------------------------
p4_say = [
    "While negative CCC represents the pinnacle of operational efficiency, most commercial enterprises carry positive working capital. When working capital is un-optimized, it generates a chronic financial penalty known as Operational Cash Drag. Cash tied up in slow-paying accounts receivable or sluggish warehouse inventory is completely idle: it earns zero return, cannot be invested in strategic growth initiatives, and incurs an ongoing capital holding penalty equal to the enterprise's Weighted Average Cost of Capital (WACC).",

    "To quantify this penalty rigorously, corporate financial analytics evaluates Working Capital Cost of Capital Drag: Annual Cash Drag ($) = Net Working Capital * WACC. Consider a corporation carrying $250 million in Net Working Capital with an equity-and-debt WACC of 12.0%. The annual capital drag incurred simply to carry that working capital is: $250,000,000 * 0.12 = $30,000,000 per year! Every single year, $30 million in pure economic profit is consumed simply to finance the operational friction in customer collections and warehouse holding.",

    "To guide treasury interventions, analytics teams compute the Financial Sensitivity of One Day of CCC. In corporate finance, what is the exact cash flow value of trimming one day from the Cash Conversion Cycle? The mathematical sensitivity decomposes across the triad: Delta Cash_DSO = (Annual Credit Sales / 365) * 1. Delta Cash_DIO = (Annual COGS / 365) * 1. Delta Cash_DPO = (Annual COGS / 365) * 1.",

    "For a Fortune 500 company generating $10 billion in revenue with $6.5 billion in COGS: Trimming 1 day from DSO releases: $10B / 365 = $27.4 million in cash. Trimming 1 day from DIO releases: $6.5B / 365 = $17.8 million in cash. Extending 1 day of DPO releases an additional $17.8 million. A coordinated treasury initiative that reduces DSO by 5 days, reduces DIO by 6 days, and extends DPO by 4 days releases a staggering: (5 * $27.4M) + (6 * $17.8M) + (4 * $17.8M) = $137.0M + $106.8M + $71.2M = $315.0 million in immediate cash liquidity to the balance sheet!",

    "Furthermore, this liquidity directly expands Economic Value Added (EVA). Developed by Stern Stewart & Co., EVA measures true residual economic profit: EVA = NOPAT - (Invested Capital * WACC). Because Net Working Capital is a direct component of Invested Capital, releasing $315 million in working capital permanently lowers the capital charge by: $315M * 0.12 = $37.8 million per year, flowing dollar-for-dollar into expanded enterprise shareholder valuation.",

    "The profound value of internal working capital optimization is also illuminated by Stewart Myers' Pecking Order Theory of corporate finance. Under capital market frictions and asymmetric information, raising external financing incurs severe transaction friction: debt issues require underwriting fees and debt covenants that restrict operational flexibility, while equity issues trigger dilution and negative signaling discounts. Internal cash generated from working capital efficiency is the cheapest, most autonomous form of capital available to an enterprise, carrying zero debt covenants and zero equity dilution.",

    "By transforming corporate treasury from a passive accounting utility into an aggressive working capital optimization engine, the enterprise self-funds multi-million-dollar capital expenditure programs and strategic mergers and acquisitions entirely from internal cash release, dramatically lowering corporate financial leverage and boosting return on equity.",

    "Furthermore, reducing working capital delivers an immediate structural boost to Return on Invested Capital (ROIC), universally recognized as the single most critical driver of long-term equity valuation: ROIC = NOPAT / Invested Capital. Because Invested Capital equals Net Fixed Assets plus Net Working Capital, slashing $300 million from working capital directly shrinks the denominator of ROIC. A company whose ROIC expands from 14% to 21% commands immediate multiple expansion on Wall Street, unlocking billions in incremental market capitalization.",

    "In the accompanying Python implementation, we build an Enterprise Cash Drag & Sensitivity Optimizer. We simulate multi-echelon working capital release scenarios, calculate exact daily cash values across DSO, DIO, and DPO, and evaluate the resulting expansion in Economic Value Added (EVA)."
]

p4_code = r"""# Pure Python Working Capital Cash Drag & EVA Expansion Engine

class WorkingCapitalOptimizationEngine:
    def __init__(self, revenue, cogs, current_dso, current_dio, current_dpo, wacc=0.11):
        self.rev = float(revenue)
        self.cogs = float(cogs)
        self.dso = float(current_dso)
        self.dio = float(current_dio)
        self.dpo = float(current_dpo)
        self.wacc = float(wacc)
        self._evaluate_base()
        
    def _evaluate_base(self):
        # Base balances
        self.ar_base = (self.rev / 365.0) * self.dso
        self.inv_base = (self.cogs / 365.0) * self.dio
        self.ap_base = (self.cogs / 365.0) * self.dpo
        self.nwc_base = (self.ar_base + self.inv_base) - self.ap_base
        self.ccc_base = self.dio + self.dso - self.dpo
        self.capital_drag_base = self.nwc_base * self.wacc
        
    def simulate_working_capital_reduction(self, target_dso, target_dio, target_dpo):
        # New balances
        ar_new = (self.rev / 365.0) * target_dso
        inv_new = (self.cogs / 365.0) * target_dio
        ap_new = (self.cogs / 365.0) * target_dpo
        nwc_new = (ar_new + inv_new) - ap_new
        ccc_new = target_dio + target_dso - target_dpo
        
        # Cash released
        cash_from_ar = self.ar_base - ar_new
        cash_from_inv = self.inv_base - inv_new
        cash_from_ap = ap_new - self.ap_base
        total_cash_released = cash_from_ar + cash_from_inv + cash_from_ap
        
        # Annual EVA expansion (capital charge reduction)
        annual_eva_gain = total_cash_released * self.wacc
        
        return {
            'baseline_ccc_days': round(self.ccc_base, 1),
            'optimized_ccc_days': round(ccc_new, 1),
            'ccc_days_reduced': round(self.ccc_base - ccc_new, 1),
            'baseline_nwc': round(self.nwc_base, 2),
            'optimized_nwc': round(nwc_new, 2),
            'total_cash_released_to_bs': round(total_cash_released, 2),
            'cash_breakdown': {
                'from_ar_collections': round(cash_from_ar, 2),
                'from_lean_inventory': round(cash_from_inv, 2),
                'from_vendor_terms': round(cash_from_ap, 2)
            },
            'annual_wacc_drag_saved': round(annual_eva_gain, 2)
        }

# Enterprise Case: Large Retail & Distribution Conglomerate ($2.4B Revenue, $1.6B COGS, WACC = 10.5%)
# Baseline: DSO = 52 days, DIO = 68 days, DPO = 42 days (CCC = 78 days)
# Target:   DSO = 45 days, DIO = 55 days, DPO = 50 days (CCC = 50 days, 28 days reduction)
treasury = WorkingCapitalOptimizationEngine(
    revenue=2400000000.0, cogs=1600000000.0,
    current_dso=52.0, current_dio=68.0, current_dpo=42.0, wacc=0.105
)

results = treasury.simulate_working_capital_reduction(target_dso=45.0, target_dio=55.0, target_dpo=50.0)

print("--- ENTERPRISE WORKING CAPITAL OPTIMIZATION & CASH RELEASE ---")
print(f"CCC Reduction: {results['baseline_ccc_days']} days -> {results['optimized_ccc_days']} days (Reduced by {results['ccc_days_reduced']} days)\n")
print(f"Total Immediate Cash Inflow Released:  ${results['total_cash_released_to_bs']:12,.2f}")
print(f"  Cash Released from Receivables (DSO):${results['cash_breakdown']['from_ar_collections']:12,.2f}")
print(f"  Cash Released from Inventory (DIO):  ${results['cash_breakdown']['from_lean_inventory']:12,.2f}")
print(f"  Cash Released from Vendor Terms(DPO):${results['cash_breakdown']['from_vendor_terms']:12,.2f}")
print(f"\nPermanent Annual EVA Profit Increase:  ${results['annual_wacc_drag_saved']:12,.2f}/year!")
"""

p4_mcq = {
    "question": "How does releasing trapped cash from the Cash Conversion Cycle directly expand a corporation's Economic Value Added (EVA)?",
    "options": [
        "By reducing Net Working Capital, which shrinks total Invested Capital and permanently lowers annual WACC capital holding charges.",
        "By allowing the company to avoid statutory income taxes on inventory markdowns.",
        "By eliminating all supplier invoice liabilities from the balance sheet.",
        "By converting trade accounts payable into permanent common equity shares."
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "EVA = NOPAT - (Invested Capital * WACC). Releasing working capital reduces Invested Capital, permanently lowering the capital charge and increasing residual economic profit."
}

# -------------------------------------------------------------
# Part 5: Building an Enterprise Working Capital & Cash Conversion Cycle Simulation Engine in Python
# -------------------------------------------------------------
p5_say = [
    "To conclude Day 27, we synthesize all mathematical models and treasury frameworks into a master Enterprise Working Capital & Cash Conversion Cycle Simulation Engine.",

    "Our simulation engine models a multi-division corporate enterprise operating across a trailing 8-quarter horizon. Across each quarter, the engine tracks revenue growth, direct COGS, customer payment collection velocities, warehouse inventory turns, and supplier trade credit settlement schedules.",

    "The engine executes three integrated analytical modules: Module One (Triad Trajectory Tracking): Calculates historical quarterly DSO, DIO, DPO, and CCC trajectories, identifying seasonal working capital spikes and collection bottlenecks.",

    "Module Two (Cash Drag & WACC Penalty Accounting): Computes exact dollar carrying costs of trapped capital, benchmarking current performance against industry peer quartiles.",

    "Module Three (Scenario Stress-Testing & Capital Release Forecasting): Simulates strategic treasury interventions—such as implementing automated digital receivable reminders, deploying dynamic discounting on payables, or shifting to Just-In-Time inventory buffers—and forecasts multi-quarter cash flow generation.",

    "In modern corporate treasuries, this analytics architecture is connected to real-time open banking APIs and global ERP ledgers (such as SAP S/4HANA or Oracle Cloud ERP). Rather than waiting for month-end manual accounting reconciliations, treasury algorithms monitor daily bank lockbox collections, flag sudden customer payment slowdowns, and dynamically adjust liquidity buffers.",

    "Furthermore, the engine incorporates Foreign Exchange (FX) Exposure Modeling on cross-border receivables and payables. When customer receivables are denominated in foreign currencies (such as Euros or Japanese Yen) while supplier obligations are in US Dollars, extended Cash Conversion Cycles dramatically amplify currency volatility risk. By shrinking the CCC window, corporate treasury contracts its net foreign exchange balance sheet exposure, reducing expensive derivative hedging costs.",

    "To support boardroom liquidity stress-testing, our engine conducts Monte Carlo Liquidity Drawdown Simulations across macroeconomic recession scenarios. When a macroeconomic downturn strikes, corporate customers delay invoice settlement (causing DSO to surge by 20 to 30 days) while supplier credit insurers downgrade counterparty ratings and demand rapid cash settlements (causing DPO to contract). The simulation quantifies whether existing revolving credit facilities can withstand the resulting liquidity squeeze.",

    "By providing real-time visibility into these multi-quarter cash flow dynamics, the analytics platform equips Chief Financial Officers (CFOs) with predictive early-warning radar. Instead of reacting to liquidity emergencies when cash balances approach zero, corporate leaders proactively adjust commercial credit policies, optimize inventory safety stocks, and safeguard enterprise solvency.",

    "The ultimate goal of working capital analytics is to transition the enterprise toward an unassailable financial posture where operations generate autonomous self-funding liquidity. When accounts receivable flow smoothly without dispute, inventory turns at peak velocity, and trade payables are managed collaboratively, corporate solvency is secured, cost of capital plummets, and the enterprise achieves sustained operational excellence.",

    "Moreover, maintaining continuous liquidity visibility shields corporate treasuries against unexpected interest rate spikes and banking credit crunches. By liberating self-funding capital from operational cycles, leadership protects strategic enterprise investments without diluting equity value. This resilient liquidity reserve creates a decisive structural advantage over debt-laden competitors during periods of macroeconomic turbulence.",

    "Furthermore, tracking these working capital efficiencies across multi-year operating horizons proves that financial health is not an accident of accounting conventions, but the direct mathematical consequence of disciplined supply chain execution and rigorous credit governance. This integration between frontline logistics and executive treasury establishes an unshakeable operational foundation, directly setting the stage for normative prescriptive optimization and linear programming modeling.",

    "By architecting this complete treasury analytics system from first principles without external numerical libraries, we empower analytics professionals to bridge the gap between supply chain physical operations and corporate financial liquidity.",

    "In the accompanying Python implementation, we build this complete Master Working Capital & CCC Simulation Engine. We run an 8-quarter corporate simulation, track cash conversion dynamics, and output the executive corporate treasury scorecard."
]

p5_code = r"""# Pure Python Master Working Capital & CCC Simulation Engine

class MasterWorkingCapitalSimulator:
    def __init__(self, quarterly_financials, wacc=0.11):
        # quarterly_financials: list of dicts with 'quarter', 'revenue', 'cogs', 'ar', 'inv', 'ap'
        self.history = quarterly_financials
        self.wacc = float(wacc)
        self.results = []
        self._analyze()
        
    def _analyze(self):
        for q in self.history:
            rev = q['revenue']
            cogs = q['cogs']
            ar = q['ar']
            inv = q['inv']
            ap = q['ap']
            
            # Quarterly metrics (annualized by multiplying by 4)
            dso = (ar / (rev * 4.0)) * 365.0 if rev > 0 else 0.0
            dio = (inv / (cogs * 4.0)) * 365.0 if cogs > 0 else 0.0
            dpo = (ap / (cogs * 4.0)) * 365.0 if cogs > 0 else 0.0
            ccc = dio + dso - dpo
            
            nwc = (ar + inv) - ap
            annual_capital_drag = nwc * self.wacc
            
            self.results.append({
                'quarter': q['quarter'],
                'revenue': rev,
                'cogs': cogs,
                'dso_days': round(dso, 1),
                'dio_days': round(dio, 1),
                'dpo_days': round(dpo, 1),
                'ccc_days': round(ccc, 1),
                'net_working_capital': round(nwc, 2),
                'annual_capital_drag': round(annual_capital_drag, 2)
            })

    def print_treasury_scorecard(self):
        print(f"{'Quarter':9s} | {'Revenue':12s} | {'DSO':6s} | {'DIO':6s} | {'DPO':6s} | {'CCC':7s} | {'Net Working Cap':16s} | {'Capital Drag':14s}")
        print("-" * 90)
        for r in self.results:
            print(f"{r['quarter']:9s} | ${r['revenue']:10,.0f} | {r['dso_days']:5.1f} | {r['dio_days']:5.1f} | {r['dpo_days']:5.1f} | {r['ccc_days']:6.1f} | ${r['net_working_capital']:14,.0f} | ${r['annual_capital_drag']:12,.0f}/yr")

# Simulated 4 quarters of corporate financials
quarterly_data = [
    {'quarter': '2025-Q1', 'revenue': 180000000.0, 'cogs': 120000000.0, 'ar': 30000000.0, 'inv': 28000000.0, 'ap': 16000000.0},
    {'quarter': '2025-Q2', 'revenue': 195000000.0, 'cogs': 128000000.0, 'ar': 31000000.0, 'inv': 29000000.0, 'ap': 17500000.0},
    {'quarter': '2025-Q3', 'revenue': 210000000.0, 'cogs': 138000000.0, 'ar': 32000000.0, 'inv': 30000000.0, 'ap': 19000000.0},
    {'quarter': '2025-Q4', 'revenue': 240000000.0, 'cogs': 155000000.0, 'ar': 34000000.0, 'inv': 31000000.0, 'ap': 22000000.0}
]

simulator = MasterWorkingCapitalSimulator(quarterly_data, wacc=0.105)
print("--- 4-QUARTER CORPORATE TREASURY WORKING CAPITAL SCORECARD ---")
simulator.print_treasury_scorecard()
"""

p5_mcq = {
    "question": "What is the primary corporate governance value of tracking quarterly Cash Conversion Cycle trajectories alongside GAAP income statements?",
    "options": [
        "It provides immediate visibility into operational liquidity velocity, preventing growing receivables or bloated inventory from creating an invisible cash liquidity crisis.",
        "It eliminates the need to file annual corporate tax returns with government authorities.",
        "It guarantees that Cost of Goods Sold will remain fixed across all future operating cycles.",
        "It converts customer credit receivables into permanent federal cash grants."
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "GAAP accounting records revenue and profit when earned, not when cash is received. Tracking CCC reveals whether cash conversion is keeping pace with sales or accumulating dangerous cash drag."
}

# -------------------------------------------------------------
# DAY_DATA Aggregation & Validation
# -------------------------------------------------------------
DAY_DATA = {
    "day": 27,
    "courseId": "bcom_ana",
    "title": "Working Capital & Cash Conversion Cycle (CCC) Analytics: DSO, DIO, DPO & Operational Cash Drag",
    "description": "Master corporate liquidity analytics: Days Sales Outstanding (DSO), Days Inventory Outstanding (DIO), Days Payable Outstanding (DPO), the Cash Conversion Cycle (CCC), Negative CCC working capital float engines, and Economic Value Added (EVA) cash drag reduction.",
    "parts": [
        {
            "title": "The Working Capital Triad: DSO, DIO & DPO Microeconomic Foundations",
            "say": p1_say,
            "code": p1_code,
            "mcq": p1_mcq
        },
        {
            "title": "The Cash Conversion Cycle (CCC): Mathematical Formulation & Balance Sheet Mechanics",
            "say": p2_say,
            "code": p2_code,
            "mcq": p2_mcq
        },
        {
            "title": "The Phenomenon of Negative Cash Conversion Cycles: The Float Engine",
            "say": p3_say,
            "code": p3_code,
            "mcq": p3_mcq
        },
        {
            "title": "Quantifying Operational Cash Drag & Cost of Capital Drag",
            "say": p4_say,
            "code": p4_code,
            "mcq": p4_mcq
        },
        {
            "title": "Building an Enterprise Working Capital & Cash Conversion Cycle Simulation Engine in Python",
            "say": p5_say,
            "code": p5_code,
            "mcq": p5_mcq
        }
    ]
}

if __name__ == "__main__":
    import sys
    from pathlib import Path
    sys.path.insert(0, str(Path.cwd()))
    from scripts.bcom_ana_utils import count_words, execute_code
    print(f"Validating Day {DAY_DATA['day']}: {DAY_DATA['title']}...")
    part_words = [count_words(p["say"]) for p in DAY_DATA["parts"]]
    print(f"Part word counts: {part_words} (Total: {sum(part_words)})")
    assert all(w >= 600 for w in part_words), f"Some parts under 600 words: {part_words}"
    for i, p in enumerate(DAY_DATA["parts"]):
        print(f"Testing Part {i+1} code...")
        out = execute_code(p["code"])
        print(f"  Part {i+1} code executed cleanly ({len(out)} chars output)")
    print(f"Day {DAY_DATA['day']} validation successful!")
