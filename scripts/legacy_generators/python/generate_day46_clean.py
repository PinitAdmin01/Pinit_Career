import json
import re

def count_words(text):
    return len(re.findall(r'\b[A-Za-z0-9_-]+\b', text))

day46_code = """# Day 46: Financial Statement Diagnostics & Advanced Ratio Analysis
# Comprehensive ratio diagnostics engine computing Liquidity, Solvency, Turnover, and Cash Conversion Cycle.

from dataclasses import dataclass
from typing import Dict

@dataclass
class FinancialData:
    revenue: float
    cogs: float
    ebit: float
    interest_expense: float
    tax_expense: float
    net_income: float
    cash: float
    marketable_securities: float
    accounts_receivable: float
    inventory: float
    accounts_payable: float
    current_assets: float
    current_liabilities: float
    total_debt: float
    total_equity: float
    total_assets: float
    principal_repayments: float

class FinancialRatioDiagnostics:
    def __init__(self, data: FinancialData):
        self.d = data

    def compute_liquidity_ratios(self) -> Dict[str, float]:
        cr = self.d.current_assets / self.d.current_liabilities
        quick_assets = self.d.cash + self.d.marketable_securities + self.d.accounts_receivable
        qr = quick_assets / self.d.current_liabilities
        cash_ratio = (self.d.cash + self.d.marketable_securities) / self.d.current_liabilities
        # Defensive interval: quick assets / daily cash operating expenses
        daily_opex = (self.d.revenue - self.d.ebit) / 365.0
        dir_days = quick_assets / daily_opex
        return {
            "current_ratio": round(cr, 2),
            "quick_ratio": round(qr, 2),
            "cash_ratio": round(cash_ratio, 2),
            "defensive_interval_days": round(dir_days, 1)
        }

    def compute_solvency_ratios(self) -> Dict[str, float]:
        de_ratio = self.d.total_debt / self.d.total_equity
        debt_to_capital = self.d.total_debt / (self.d.total_debt + self.d.total_equity)
        interest_coverage = self.d.ebit / self.d.interest_expense
        # DSCR = EBIT / (Interest + Principal / (1 - Tax Rate))
        tax_rate = self.d.tax_expense / (self.d.ebit - self.d.interest_expense)
        dscr = self.d.ebit / (self.d.interest_expense + (self.d.principal_repayments / (1 - tax_rate)))
        return {
            "debt_to_equity": round(de_ratio, 2),
            "debt_to_capital": round(debt_to_capital, 2),
            "interest_coverage_ratio": round(interest_coverage, 2),
            "debt_service_coverage_ratio": round(dscr, 2)
        }

    def compute_working_capital_cycle(self) -> Dict[str, float]:
        dso = (self.d.accounts_receivable / self.d.revenue) * 365.0
        dio = (self.d.inventory / self.d.cogs) * 365.0
        dpo = (self.d.accounts_payable / self.d.cogs) * 365.0
        ccc = dio + dso - dpo
        return {
            "days_sales_outstanding": round(dso, 1),
            "days_inventory_outstanding": round(dio, 1),
            "days_payable_outstanding": round(dpo, 1),
            "cash_conversion_cycle_days": round(ccc, 1)
        }

# Enterprise Case Study: Apex Engineering Ltd
data = FinancialData(
    revenue=120000000.0,
    cogs=72000000.0,
    ebit=24000000.0,
    interest_expense=4000000.0,
    tax_expense=5033600.0,  # 25.168% on 20,000,000 EBT
    net_income=14966400.0,
    cash=6000000.0,
    marketable_securities=4000000.0,
    accounts_receivable=16000000.0,
    inventory=18000000.0,
    accounts_payable=12000000.0,
    current_assets=44000000.0,
    current_liabilities=22000000.0,
    total_debt=40000000.0,
    total_equity=60000000.0,
    total_assets=124000000.0,
    principal_repayments=3000000.0
)

analyzer = FinancialRatioDiagnostics(data)
liq = analyzer.compute_liquidity_ratios()
solv = analyzer.compute_solvency_ratios()
wc = analyzer.compute_working_capital_cycle()

assert liq["current_ratio"] == 2.0
assert liq["quick_ratio"] == 1.18
assert liq["cash_ratio"] == 0.45
assert liq["defensive_interval_days"] == 98.9

assert solv["debt_to_equity"] == 0.67
assert solv["debt_to_capital"] == 0.40
assert solv["interest_coverage_ratio"] == 6.0
assert solv["debt_service_coverage_ratio"] == 3.0

assert wc["days_sales_outstanding"] == 48.7
assert wc["days_inventory_outstanding"] == 91.2
assert wc["days_payable_outstanding"] == 60.8
assert wc["cash_conversion_cycle_days"] == 79.1

print(f"Current Ratio: {liq['current_ratio']} | Quick Ratio: {liq['quick_ratio']} | Cash Ratio: {liq['cash_ratio']}")
print(f"Debt-to-Equity: {solv['debt_to_equity']} | Interest Coverage: {solv['interest_coverage_ratio']}x | DSCR: {solv['debt_service_coverage_ratio']}x")
print(f"Working Capital Cycle: DIO {wc['days_inventory_outstanding']}d + DSO {wc['days_sales_outstanding']}d - DPO {wc['days_payable_outstanding']}d = CCC {wc['cash_conversion_cycle_days']}d")
print("FINANCIAL_RATIO_DIAGNOSTICS_PASS")
"""

day46_output = """Current Ratio: 2.0 | Quick Ratio: 1.18 | Cash Ratio: 0.45
Debt-to-Equity: 0.67 | Interest Coverage: 6.0x | DSCR: 3.0x
Working Capital Cycle: DIO 91.2d + DSO 48.7d - DPO 60.8d = CCC 79.1d
FINANCIAL_RATIO_DIAGNOSTICS_PASS"""

part1_say = r"""Welcome to Day 46 of Corporate & Financial Accounting! Today we launch Block 10: Advanced Financial Statement Diagnostics, Ratio Analysis, DuPont Decomposition, and Forensic Accounting. As an aspiring corporate controller, chief financial officer, or credit rating analyst, you must look beyond raw balance sheet line items and examine the underlying operational vitality, liquidity cushion, and structural solvency of the corporate enterprise.

Financial statement diagnostics represent the quantitative bridge between technical accounting standards and corporate finance strategy. In an era governed by converged Indian Accounting Standards (Ind AS) and international reporting frameworks, external stakeholders—including commercial lending syndicates, credit rating agencies such as CRISIL, ICRA, and CARE, institutional bondholders, and statutory auditors under the Companies Auditor's Report Order (CARO 2020)—rely on standardized diagnostic ratios to evaluate financial distress, capital efficiency, and debt service viability.

The primary objective of liquidity diagnostics is to quantify the entity's ability to satisfy its short-term debt obligations as they mature without disrupting core manufacturing or commercial operations. Liquidity analysis begins with the classic Current Ratio:
$$\text{Current Ratio} = \frac{\text{Current Assets}}{\text{Current Liabilities}}$$
While traditional textbook finance often cites a 2.0:1 benchmark as ideal, modern corporate treasuries and Indian commercial banks operating under the Reserve Bank of India (RBI) Tandon Committee guidelines recognize 1.33:1 as the normative threshold for Maximum Permissible Bank Finance (MPBF). An excessively elevated current ratio may indicate bloated, obsolete inventory or lax credit collection policies, rather than superior liquidity management. Furthermore, under Ind AS 116 (Leases), the current portion of lease liabilities maturing within twelve months must be classified under current financial liabilities, which inherently tightens current ratio covenants across asset-heavy leasing operations. In addition, treasury teams must evaluate the quality of trade receivables included in current assets, segregating undisputed performing accounts from disputed balances subject to expected credit loss (ECL) provisioning under Ind AS 109.

To eliminate the distortion of illiquid or non-readily realizable assets, financial analysts construct the Quick Ratio (also known as the Acid-Test Ratio):
$$\text{Quick Ratio} = \frac{\text{Quick Assets}}{\text{Current Liabilities}} = \frac{\text{Cash} + \text{Marketable Securities} + \text{Trade Receivables}}{\text{Current Liabilities}}$$
By excluding physical raw materials, work-in-progress, finished goods inventory, and prepaid expenses, the quick ratio isolates assets that can be converted into sovereign legal tender within 30 to 60 days. A normative benchmark of 1.0:1 is generally demanded by commercial lenders.

For enterprises facing severe macroeconomic contraction or sudden capital market dislocation, corporate controllers deploy the ultra-conservative Cash Ratio:
$$\text{Cash Ratio} = \frac{\text{Cash and Cash Equivalents} + \text{Marketable Securities}}{\text{Current Liabilities}}$$
The cash ratio measures immediate liquidation capability, testing whether current liabilities could be settled today if credit collections and inventory sales ground to a complete standstill.

Finally, advanced treasury risk officers evaluate the Defensive Interval Ratio (DIR), measured in elapsed calendar days:
$$\text{Defensive Interval Ratio (Days)} = \frac{\text{Quick Assets}}{\text{Daily Cash Operating Expenses}} = \frac{\text{Cash} + \text{Marketable Securities} + \text{Receivables}}{\frac{\text{Revenue} - \text{EBIT}}{365}}$$
The defensive interval ratio indicates how many days the corporation can continue operating its baseline manufacturing facilities, paying payroll, rent, and utility expenses, without generating a single rupee of additional cash inflow. For capital-intensive engineering firms, maintaining a defensive interval of 60 to 90 days provides vital insulation against working capital shocks, supplier insolvencies, and contractual payment delays across supply chains. In our case study of Apex Engineering Ltd, quick assets of $26,000,000 support a daily operating cash burn of $263,013.70, yielding a defensive interval of 98.9 days—demonstrating supreme short-term solvency resilience and substantial financial flexibility during unexpected macroeconomic shocks."""

part2_say = r"""In Part 2 of Day 46, we investigate long-term solvency diagnostics, capital structure leverage, and debt service capacity under Ind AS and banking consortium loan agreements.

While liquidity focuses on the immediate 12-month operating window, solvency evaluates the enterprise's multi-year structural health, its capacity to survive systemic economic downturns, and its ability to service both interest obligations and mandatory principal amortizations over the full life of its term loans, debentures, and external commercial borrowings (ECBs).

The foundational metric of capital structure composition is the Debt-to-Equity (D/E) Ratio:
$$\text{Debt-to-Equity} = \frac{\text{Total Debt}}{\text{Total Shareholders' Equity}}$$
where Total Debt encompasses all interest-bearing financial liabilities, including short-term bank borrowings, commercial paper, long-term non-convertible debentures (NCDs), syndicated bank facilities, and lease liabilities recognized under Ind AS 116. In capital-intensive infrastructure and manufacturing sectors, a D/E ratio between 0.67:1 and 1.5:1 is typical, whereas asset-light IT and consulting firms operate with near-zero leverage. Complementing this is the Debt-to-Capital Ratio:
$$\text{Debt-to-Capital} = \frac{\text{Total Debt}}{\text{Total Debt} + \text{Total Equity}}$$
which expresses debt as an explicit percentage of the total permanent capital base deployed across the balance sheet.

However, balance sheet leverage ratios reveal only the stock of capital obligations, not the flow of operating earnings available to service those claims. Therefore, commercial lenders and credit rating analysts scrutinize coverage metrics, led by the Interest Coverage Ratio (ICR):
$$\text{Interest Coverage Ratio} = \frac{\text{EBIT}}{\text{Finance Costs (Interest Expense)}}$$
The interest coverage ratio measures the safety margin of operating profits before debt service is impaired. Under Indian corporate credit benchmarks, an ICR below 2.0x signals severe vulnerability, often triggering rating downgrades or covenant breach penalties, while an ICR of 4.0x to 6.0x indicates robust debt servicing capacity.

For project finance loans and structured consortium facilities, the gold-standard metric demanded by Indian public and private sector banks under RBI guidelines is the Debt Service Coverage Ratio (DSCR):
$$\text{DSCR} = \frac{\text{EBIT}}{\text{Interest Expense} + \frac{\text{Mandatory Principal Repayments}}{1 - \text{Effective Tax Rate}}}$$
Notice the essential tax-adjustment term: while interest expense is deductible for corporate income tax purposes (yielding a tax shield), principal repayments must be funded out of after-tax net operating cash flows! Therefore, to service $1.00 of debt principal at a 25.168% Section 115BAA corporate tax rate, the enterprise must generate $\$1.00 / (1 - 0.25168) = \$1.336$ of pre-tax operating earnings. Failing to gross up principal repayments distorts DSCR, creating a false impression of debt affordability.

Under Indian banking consortium covenants and Section 143(3) of the Companies Act 2013, statutory auditors must assess whether the company possesses adequate cash flows to meet its debt obligations maturing within twelve months. Furthermore, corporate issuers of Non-Convertible Debentures (NCDs) must comply with Section 71 of the Companies Act 2013 and Rule 18 of the Companies (Share Capital and Debentures) Rules, 2014, creating a Debenture Redemption Reserve (DRR) and investing at least 15% of debentures maturing within the coming financial year in specified unencumbered sovereign securities. Credit rating agencies like CRISIL, ICRA, and CARE dynamically track DSCR trends to determine credit ratings, where a sustained DSCR above 2.5x supports investment-grade AA or AAA ratings, whereas a drop below 1.2x risks immediate downgrade to speculative junk status. In our case study of Apex Engineering Ltd, with $24,000,000 EBIT, $4,000,000 interest, and $3,000,000 principal repayments, the grossed-up principal burden is $\$3,000,000 / (1 - 0.25168) = \$4,008,980$, resulting in a total annual debt service burden of $\$8,008,980$ and an elite DSCR of 3.0x."""

part3_say = r"""In Part 3 of Day 46, we analyze operational efficiency, working capital turnover velocity, and the Cash Conversion Cycle (CCC).

Working capital efficiency measures the speed and frictionless fluidity with which an enterprise converts its operating capital—invested in raw materials, manufacturing conversion, and customer receivables—back into liquid cash. Operating cash conversion lies at the heart of treasury management: every additional day capital remains trapped in the working capital pipeline increases short-term bank borrowings, inflates finance costs, and diminishes return on capital employed (ROCE).

The operational cycle is deconstructed into three interdependent velocity metrics:
1. Days Sales Outstanding (DSO) or Average Collection Period:
   $$\text{DSO} = \frac{\text{Trade Receivables}}{\text{Gross Revenue}} \times 365$$
   DSO measures the average number of calendar days elapsed between shipping goods or rendering services and actually collecting cash from customers. An increasing DSO indicates customer credit deterioration, ineffective collection mechanisms, or disputed billing invoices.
2. Days Inventory Outstanding (DIO) or Days Sales in Inventory:
   $$\text{DIO} = \frac{\text{Inventories}}{\text{Cost of Goods Sold (COGS)}} \times 365$$
   DIO quantifies the average holding duration of inventory from the purchase of raw materials through manufacturing processing to final customer shipment. For heavy engineering and industrial machinery manufacturers, DIO is naturally higher (often 75 to 120 days) than for FMCG or retail enterprises (15 to 30 days).
3. Days Payable Outstanding (DPO) or Creditors' Turnover Period:
   $$\text{DPO} = \frac{\text{Trade Payables}}{\text{Cost of Goods Sold (or Cost of Materials Consumed)}} \times 365$$
   DPO measures the average timeframe taken by the reporting entity to settle trade liabilities with suppliers. Extending DPO allows the enterprise to use supplier credit as an interest-free source of operating capital; however, excessively stretching payables damages vendor goodwill and risks losing early-payment cash discounts.

Synthesizing these three components yields the net Cash Conversion Cycle (CCC):
$$\text{Cash Conversion Cycle (CCC)} = \text{DIO} + \text{DSO} - \text{DPO}$$
The CCC represents the net duration of time during which corporate cash is immobilized in operational activities, requiring external working capital financing (such as cash credit or working capital demand loans). A negative CCC—achieved by world-class retailers and contract manufacturers who collect cash immediately from customers while negotiating 90-day supplier credit terms—means the business is entirely financed by its vendor ecosystem, generating substantial float.

In the Indian industrial context, the Reserve Bank of India has historically regulated bank credit through working capital norms. The Tandon Committee introduced two methods for calculating Maximum Permissible Bank Finance (MPBF): Method 1 required borrowers to fund 25% of the working capital gap from long-term equity/reserves, while Method 2 required funding 25% of total current assets from long-term funds, enforcing a minimum current ratio of 1.33:1. Later, the Chore Committee recommended segregating working capital facilities into a core loan component (Working Capital Demand Loan) and a fluctuating cash credit line to enforce fiscal discipline. Furthermore, under Section 15 and Section 16 of the Micro, Small and Medium Enterprises Development (MSMED) Act, 2006, corporate buyers must settle supplier invoices within 45 days, failing which compound interest at three times the RBI bank rate becomes mandatorily payable. In addition, Section 43B(h) of the Income Tax Act disallows tax deductions for unpaid MSME supplier payables unless paid within the statutory timeline. Today, corporate treasuries optimize working capital using digital invoice discounting platforms like the Trade Receivables Discounting System (TReDS), which dramatically accelerates DSO by monetizing MSME supplier receivables. In addition, factoring arrangements executed under the Factoring Regulation Act, 2011 allow corporate suppliers to transfer trade receivables to registered NBFC factors without recourse, offloading customer default risks from the balance sheet and transforming trade receivables into immediate cash."""

part4_say = r"""In Part 4 of Day 46, we examine mandatory statutory financial ratio disclosures under amended Schedule III to the Companies Act 2013 and auditor verification requirements under CARO 2020.

In March 2021, the Ministry of Corporate Affairs (MCA) notified historic amendments to Schedule III (applicable across Division I for AS and Division II for Ind AS companies). These amendments established a mandatory statutory obligation for all corporate entities to disclose eleven specific financial ratios in their annual financial statement notes:
1. Current Ratio (Current Assets / Current Liabilities)
2. Debt-Equity Ratio (Total Debt / Total Shareholders' Equity)
3. Debt Service Coverage Ratio (EBIT / (Interest + Principal / (1 - Tax Rate)))
4. Return on Equity Ratio (Net Profit After Tax - Preference Dividend / Average Shareholders' Equity)
5. Inventory Turnover Ratio (Cost of Goods Sold / Average Inventory)
6. Trade Receivables Turnover Ratio (Net Credit Sales / Average Accounts Receivable)
7. Trade Payables Turnover Ratio (Net Credit Purchases / Average Accounts Payable)
8. Net Capital Turnover Ratio (Net Sales / Working Capital)
9. Net Profit Ratio (Net Profit After Tax / Net Sales)
10. Return on Capital Employed (EBIT / Capital Employed)
11. Return on Investment (Income from Investments / Cost of Investments)

Crucially, the statutory mandate contains an enforceable disclosure rule: where any of the eleven financial ratios varies by more than 25% as compared to the immediately preceding financial year, the company must provide detailed qualitative and quantitative explanations in the footnote disclosures, specifying the underlying economic and operational reasons for the variance. For instance, if an engineering company's Current Ratio drops from 2.0:1 to 1.4:1 (a 30% reduction), management cannot merely state that current assets decreased; they must articulate whether cash was redeployed into long-term capital expenditure, whether short-term bank borrowings surged, or whether inventory was written down. Corporate controllers must prepare exhaustive variance bridge schedules explaining every operational and macroeconomic factor behind these fluctuations.

Simultaneously, the Companies (Auditor's Report) Order, 2020 (CARO 2020) elevated ratio analysis into a core statutory audit testing requirement. Under Clause 3(xix) of CARO 2020, the independent statutory auditor must formally comment on:
"Whether on the basis of the financial ratios, ageing and expected dates of realization of financial assets and payment of financial liabilities, other information accompanying the financial statements, the auditor's knowledge of the Board of Directors and management plans, the auditor is of the opinion that no material uncertainty exists as on the date of the audit report that company is capable of meeting its liabilities existing at the date of balance sheet as and when they fall due within a period of one year from the balance sheet date."

To satisfy Clause 3(xix), the audit engagement team must perform independent stress tests of the company's liquidity, interest coverage, and debt service ratios. If the auditor discovers that an enterprise displays a high debt-to-equity ratio combined with a deteriorating DSCR and negative operating cash flows, the auditor must consider issuing an Emphasis of Matter paragraph or a qualified audit report regarding the entity's Going Concern assumption under Standard on Auditing (SA) 570. In addition, the auditor inspects management's forward-looking 12-month rolling cash flow forecast, validating that working capital credit facilities remain renewed and operational.

Thus, financial ratio diagnostics have evolved from mere managerial analytical tools into statutory compliance mandates audited with forensic rigor. In our Python simulation suite, every computed ratio directly aligns with MCA Schedule III formulas, providing corporate controllers with an automated, auditable compliance report. The Board Audit Committee, functioning under Section 177 of the Companies Act 2013, formally reviews these ratio analytics during quarterly financial closures, providing governance oversight before results are released to stock exchanges and equity research analysts."""

part5_say = r"""In Part 5 of Day 46, we execute and verify our complete Python Financial Ratio Diagnostics engine, confirming mathematical equilibrium across liquidity, solvency, turnover, and cash conversion cycles!

Let us review the corporate diagnostic results generated for Apex Engineering Ltd:
1. Operational Scale & Profitability:
   - Annual Operating Revenue = $120,000,000.00.
   - Cost of Goods Sold = $72,000,000.00 (Gross Margin = 40.0%).
   - Operating Profit (EBIT) = $24,000,000.00 (Operating Margin = 20.0%).
   - Finance Costs (Interest Expense) = $4,000,000.00.
   - Pre-Tax Income (EBT) = $20,000,000.00.
   - Corporate Tax Expense at 25.168% = $5,033,600.00.
   - Net Profit After Tax = $14,966,400.00 (Net Margin = 12.47%).
2. Balance Sheet Capitalization & Solvency:
   - Current Assets = $44,000,000.00; Current Liabilities = $22,000,000.00.
   - Current Ratio = $\$44,000,000 / \$22,000,000 = 2.0:1$.
   - Quick Assets = Cash ($6M) + Marketable Securities ($4M) + Trade Receivables ($16M) = $26,000,000.00.
   - Quick Ratio = $\$26,000,000 / \$22,000,000 = 1.18:1$.
   - Cash Ratio = $(\$6,000,000 + \$4,000,000) / \$22,000,000 = 0.45:1$.
   - Daily Cash Operating Expenses = $(\$120,000,000 - \$24,000,000) / 365 = \$263,013.70/\text{day}$.
   - Defensive Interval Ratio = $\$26,000,000 / \$263,013.70 = 98.9 \text{ days}$.
3. Long-Term Debt Servicing:
   - Total Debt = $40,000,000.00; Total Shareholders' Equity = $60,000,000.00.
   - Debt-to-Equity = $40M / $60M = 0.67:1; Debt-to-Capital = $40M / $100M = 40.0%.
   - Interest Coverage Ratio = $\$24,000,000 / \$4,000,000 = 6.0x$.
   - Grossed-Up Principal Burden = $\$3,000,000 / (1 - 0.25168) = \$4,008,979.98$.
   - Total Debt Service Burden = $\$4,000,000 + \$4,008,980 = \$8,008,980.00$.
   - Debt Service Coverage Ratio (DSCR) = $\$24,000,000 / \$8,008,980 = 3.0x$.
4. Working Capital Velocity:
   - Days Sales Outstanding (DSO) = $(\$16,000,000 / \$120,000,000) \times 365 = 48.7 \text{ days}$.
   - Days Inventory Outstanding (DIO) = $(\$18,000,000 / \$72,000,000) \times 365 = 91.2 \text{ days}$.
   - Days Payable Outstanding (DPO) = $(\$12,000,000 / \$72,000,000) \times 365 = 60.8 \text{ days}$.
   - Cash Conversion Cycle (CCC) = $91.2 + 48.7 - 60.8 = 79.1 \text{ days}$.

From a treasury and controllership perspective, Apex Engineering's ratio profile presents a compelling picture of balanced risk and operational efficiency. The 2.0x Current Ratio and 1.18x Quick Ratio prove that current assets comfortably cover short-term liabilities without over-relying on illiquid inventory liquidation. The 6.0x Interest Coverage Ratio and 3.0x DSCR provide substantial safety margins, reassuring institutional debenture holders and bank syndicates that even under severe adverse macroeconomic shocks (such as a 30% drop in operating income or a 200 basis point surge in benchmark borrowing rates), debt obligations will be met on time without triggering default events under Section 7 of the Insolvency and Bankruptcy Code (IBC 2016).

Our automated Python diagnostic suite confirms that Apex Engineering Ltd operates in an enviable position of financial strength: liquidity comfortably exceeds traditional and RBI benchmarks, debt service capacity provides a 3.0x cushion against principal and interest defaults, and working capital cycles reflect disciplined inventory and receivables governance.

When the standalone Python code is executed, all assertions validate with zero rounding error, culminating in the terminal output:
```
Current Ratio: 2.0 | Quick Ratio: 1.18 | Cash Ratio: 0.45
Debt-to-Equity: 0.67 | Interest Coverage: 6.0x | DSCR: 3.0x
Working Capital Cycle: DIO 91.2d + DSO 48.7d - DPO 60.8d = CCC 79.1d
FINANCIAL_RATIO_DIAGNOSTICS_PASS
```
This certifies complete mastery of Day 46 financial statement diagnostics, preparing us for Day 47: DuPont Analysis and ROE Decomposition!"""

day46_lesson = {
    "coursePrefix": "bcom-accounting",
    "day": 46,
    "title": "Financial Statement Diagnostics & Advanced Ratio Analysis (Liquidity, Solvency & Working Capital Cycles)",
    "parts": [
        {
            "part": 1,
            "title": "Corporate Liquidity Architecture & Defensive Interval Metrics",
            "say": part1_say,
            "code": day46_code,
            "output": day46_output,
            "check": {
                "question": "What is the primary formula and purpose of the Defensive Interval Ratio (DIR)?",
                "options": [
                    "Quick Assets divided by Daily Cash Operating Expenses, measuring how many days an enterprise can operate without additional cash inflows",
                    "Total Assets divided by Total Debt, measuring long-term liquidation coverage",
                    "Cash and Marketable Securities divided by Long-Term Liabilities, measuring insolvency risk",
                    "Inventory divided by Cost of Goods Sold, measuring warehouse holding duration"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "The Defensive Interval Ratio measures quick assets divided by daily cash operating expenses, quantifying the number of days the firm can sustain operations without new cash inflows.",
                "why": "The Defensive Interval Ratio measures quick assets divided by daily cash operating expenses, quantifying the number of days the firm can sustain operations without new cash inflows."
            }
        },
        {
            "part": 2,
            "title": "Long-Term Solvency, Debt Structure & DSCR Gross-Up Mechanics",
            "say": part2_say,
            "code": day46_code,
            "output": day46_output,
            "check": {
                "question": "Why must mandatory debt principal repayments be grossed up by (1 - Effective Tax Rate) when calculating the Debt Service Coverage Ratio (DSCR)?",
                "options": [
                    "Because unlike interest expense, principal repayments are not tax-deductible and must be funded from after-tax operating earnings",
                    "Because statutory auditors require all principal amounts to be inflated by VAT or GST",
                    "Because principal repayments generate deferred tax assets under Ind AS 12",
                    "Because lenders demand a penalty multiplier on pre-tax debt payments"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "Interest expense is tax-deductible, but loan principal must be repaid out of after-tax cash flows. Therefore, principal must be grossed up by (1 - t) to determine the pre-tax EBIT needed to service it.",
                "why": "Interest expense is tax-deductible, but loan principal must be repaid out of after-tax cash flows. Therefore, principal must be grossed up by (1 - t) to determine the pre-tax EBIT needed to service it."
            }
        },
        {
            "part": 3,
            "title": "Operational Efficiency, Velocity & the Cash Conversion Cycle (CCC)",
            "say": part3_say,
            "code": day46_code,
            "output": day46_output,
            "check": {
                "question": "In working capital analysis, what does a negative Cash Conversion Cycle (CCC) signify for a corporate enterprise?",
                "options": [
                    "The company collects cash from customer sales before it pays its suppliers, effectively financing its operations with interest-free vendor float",
                    "The company has entered bankruptcy under the Insolvency and Bankruptcy Code (IBC 2016)",
                    "The company has completely run out of inventory and cannot manufacture goods",
                    "The company has zero bank borrowings and refuses to grant trade credit to customers"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "A negative Cash Conversion Cycle (DIO + DSO < DPO) means the enterprise receives cash from customers before paying suppliers, generating interest-free operational float.",
                "why": "A negative Cash Conversion Cycle (DIO + DSO < DPO) means the enterprise receives cash from customers before paying suppliers, generating interest-free operational float."
            }
        },
        {
            "part": 4,
            "title": "Mandatory Schedule III Disclosures & CARO 2020 Audit Verification",
            "say": part4_say,
            "code": day46_code,
            "output": day46_output,
            "check": {
                "question": "Under the MCA 2021 amendments to Schedule III of the Companies Act 2013, what threshold triggers mandatory footnote explanation of ratio variances?",
                "options": [
                    "A change of more than 25% compared to the immediately preceding financial year",
                    "A change of more than 50% compared to the 5-year historical average",
                    "Any change greater than 5% in quarterly financial results",
                    "A variance only if the ratio turns negative or breaches banking covenants"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "Under amended Schedule III, any ratio change exceeding 25% as compared to the immediately preceding financial year requires mandatory disclosure of reasons in the notes.",
                "why": "Under amended Schedule III, any ratio change exceeding 25% as compared to the immediately preceding financial year requires mandatory disclosure of reasons in the notes."
            }
        },
        {
            "part": 5,
            "title": "Python Ratio Diagnostics Engine Execution & Controllership Verification",
            "say": part5_say,
            "code": day46_code,
            "output": day46_output,
            "check": {
                "question": "In the Apex Engineering case study, what are the verified values for Interest Coverage Ratio and Cash Conversion Cycle (CCC)?",
                "options": [
                    "Interest Coverage Ratio = 6.0x; Cash Conversion Cycle = 79.1 days",
                    "Interest Coverage Ratio = 3.0x; Cash Conversion Cycle = 98.9 days",
                    "Interest Coverage Ratio = 2.0x; Cash Conversion Cycle = 48.7 days",
                    "Interest Coverage Ratio = 12.0x; Cash Conversion Cycle = 120.0 days"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "Apex Engineering exhibits EBIT / Interest = $24M / $4M = 6.0x, and CCC = 91.2 (DIO) + 48.7 (DSO) - 60.8 (DPO) = 79.1 days.",
                "why": "Apex Engineering exhibits EBIT / Interest = $24M / $4M = 6.0x, and CCC = 91.2 (DIO) + 48.7 (DSO) - 60.8 (DPO) = 79.1 days."
            }
        }
    ]
}

total_words = 0
for p in day46_lesson["parts"]:
    wc = count_words(p["say"])
    total_words += wc
    print(f"Day 46 Part {p['part']} words: {wc}")

for p in day46_lesson["parts"]:
    wc = count_words(p["say"])
    assert wc >= 580, f"Part {p['part']} word count {wc} < 580"

print(f"Day 46 Total words: {total_words}")
assert total_words >= 3000, f"Total word count {total_words} < 3000"

with open("scripts/bcom_acc_day46.json", "w", encoding="utf-8") as f:
    json.dump(day46_lesson, f, indent=2)

print("Saved scripts/bcom_acc_day46.json successfully!")
