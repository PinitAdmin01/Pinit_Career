import json
import re

def count_words(text):
    return len(re.findall(r'\b[A-Za-z0-9_-]+\b', text))

day47_code = """# Day 47: DuPont Analysis & Return on Equity (ROE) Decomposition
# Comprehensive DuPont 3-stage and 5-stage decomposition engine with ROIC and EVA analytics.

from dataclasses import dataclass
from typing import Dict

@dataclass
class DuPontData:
    revenue: float
    cogs: float
    ebit: float
    interest_expense: float
    tax_expense: float
    net_income: float
    total_assets: float
    equity: float
    total_debt: float
    cash: float
    wacc_pct: float

class DuPontDecompositionEngine:
    def __init__(self, data: DuPontData):
        self.d = data
        self.ebt = self.d.ebit - self.d.interest_expense
        self.tax_rate = self.d.tax_expense / self.ebt if self.ebt != 0 else 0.0

    def compute_3stage_dupont(self) -> Dict[str, float]:
        npm = self.d.net_income / self.d.revenue
        ato = self.d.revenue / self.d.total_assets
        em = self.d.total_assets / self.d.equity
        roe_3stage = npm * ato * em
        return {
            "net_profit_margin_pct": round(npm * 100, 2),
            "asset_turnover": round(ato, 4),
            "equity_multiplier": round(em, 4),
            "roe_pct": round(roe_3stage * 100, 2)
        }

    def compute_5stage_dupont(self) -> Dict[str, float]:
        tax_burden = self.d.net_income / self.ebt
        interest_burden = self.ebt / self.d.ebit
        operating_margin = self.d.ebit / self.d.revenue
        asset_turnover = self.d.revenue / self.d.total_assets
        equity_multiplier = self.d.total_assets / self.d.equity
        roe_5stage = tax_burden * interest_burden * operating_margin * asset_turnover * equity_multiplier
        return {
            "tax_burden": round(tax_burden, 4),
            "interest_burden": round(interest_burden, 4),
            "operating_margin_pct": round(operating_margin * 100, 2),
            "asset_turnover": round(asset_turnover, 4),
            "equity_multiplier": round(equity_multiplier, 4),
            "roe_pct": round(roe_5stage * 100, 2)
        }

    def compute_roic_and_eva(self) -> Dict[str, float]:
        nopat = self.d.ebit * (1 - self.tax_rate)
        invested_capital = (self.d.total_debt + self.d.equity) - self.d.cash
        roic = nopat / invested_capital
        capital_charge = invested_capital * (self.d.wacc_pct / 100.0)
        eva = nopat - capital_charge
        return {
            "nopat": round(nopat, 2),
            "invested_capital": round(invested_capital, 2),
            "roic_pct": round(roic * 100, 2),
            "capital_charge": round(capital_charge, 2),
            "economic_value_added": round(eva, 2)
        }

# Enterprise Case Study: Apex Engineering Ltd
data = DuPontData(
    revenue=120000000.0,
    cogs=72000000.0,
    ebit=24000000.0,
    interest_expense=4000000.0,
    tax_expense=5033600.0,  # 25.168% on 20,000,000 EBT
    net_income=14966400.0,
    total_assets=124000000.0,
    equity=60000000.0,
    total_debt=40000000.0,
    cash=6000000.0,
    wacc_pct=11.5
)

engine = DuPontDecompositionEngine(data)
m3 = engine.compute_3stage_dupont()
m5 = engine.compute_5stage_dupont()
va = engine.compute_roic_and_eva()

assert m3["net_profit_margin_pct"] == 12.47
assert m3["asset_turnover"] == 0.9677
assert m3["equity_multiplier"] == 2.0667
assert m3["roe_pct"] == 24.94

assert m5["tax_burden"] == 0.7483
assert m5["interest_burden"] == 0.8333
assert m5["operating_margin_pct"] == 20.0
assert m5["asset_turnover"] == 0.9677
assert m5["equity_multiplier"] == 2.0667
assert m5["roe_pct"] == 24.94

assert va["nopat"] == 17959680.0
assert va["invested_capital"] == 94000000.0
assert va["roic_pct"] == 19.11
assert va["capital_charge"] == 10810000.0
assert va["economic_value_added"] == 7149680.0

print(f"3-Stage DuPont ROE: {m3['roe_pct']}% (Margin {m3['net_profit_margin_pct']}% * Turnover {m3['asset_turnover']} * Leverage {m3['equity_multiplier']})")
print(f"5-Stage DuPont ROE: {m5['roe_pct']}% (Tax {m5['tax_burden']} * Interest {m5['interest_burden']} * EBIT Margin {m5['operating_margin_pct']}% * ATO {m5['asset_turnover']} * EM {m5['equity_multiplier']})")
print(f"Value Creation: NOPAT ${va['nopat']:,.2f} | ROIC {va['roic_pct']}% vs WACC {data.wacc_pct}% | EVA ${va['economic_value_added']:,.2f}")
print("DUPONT_ROE_DECOMPOSITION_PASS")
"""

day47_output = """3-Stage DuPont ROE: 24.94% (Margin 12.47% * Turnover 0.9677 * Leverage 2.0667)
5-Stage DuPont ROE: 24.94% (Tax 0.7483 * Interest 0.8333 * EBIT Margin 20.0% * ATO 0.9677 * EM 2.0667)
Value Creation: NOPAT $17,959,680.00 | ROIC 19.11% vs WACC 11.5% | EVA $7,149,680.00
DUPONT_ROE_DECOMPOSITION_PASS"""

part1_say = r"""Welcome to Day 47 of Corporate & Financial Accounting! Today we master one of the most celebrated and powerful diagnostic frameworks in corporate finance and financial reporting: DuPont Analysis and Return on Equity (ROE) Decomposition.

Return on Equity (ROE) is widely regarded by public equity markets, institutional asset managers, and corporate boards of directors as the quintessential summary metric of firm performance. Expressed simply as:
$$\text{Return on Equity (ROE)} = \frac{\text{Net Income Attributable to Ordinary Shareholders}}{\text{Average Shareholders' Equity}}$$
ROE measures the profitability generated per rupee of capital entrusted to the corporation by its equity owners. However, unadjusted ROE is fraught with analytical peril. A company can artificially manufacture an eye-catching ROE of 30% or 40% not through superior engineering, pricing power, or lean operations, but by taking on dangerous mountains of high-interest debt that crush the equity denominator, bringing the firm to the brink of financial insolvency.

To solve this diagnostic blindness, in 1914, F. Donaldson Brown, an electrical engineer and financial executive at the DuPont Corporation, pioneered the 3-Stage DuPont Model. By mathematically decomposing single-point ROE into three multiplicative drivers, the DuPont model separates operational brilliance from capital structure gearing:
$$\text{ROE} = \left(\frac{\text{Net Income}}{\text{Revenue}}\right) \times \left(\frac{\text{Revenue}}{\text{Total Assets}}\right) \times \left(\frac{\text{Total Assets}}{\text{Shareholders' Equity}}\right)$$
$$\text{ROE} = \text{Net Profit Margin} \times \text{Asset Turnover} \times \text{Equity Multiplier}$$

Let us analyze each of these three distinct operational engines:
1. Net Profit Margin ($\text{Net Income} / \text{Revenue}$): This component reflects pricing power, value-added technological differentiation, and cost control discipline. It tells the analyst what percentage of every customer dollar flows down to the bottom line after satisfying manufacturing costs, administrative overhead, interest charges, and corporate income taxes.
2. Asset Turnover ($\text{Revenue} / \text{Total Assets}$): This measures asset utilization efficiency, capturing how aggressively and intensively management sweats its asset base (including factory machinery, manufacturing facilities, software platforms, and inventory) to generate gross revenue. A high-turnover business model is characteristic of retail discounters and lean contract manufacturers.
3. Financial Leverage / Equity Multiplier ($\text{Total Assets} / \text{Shareholders' Equity}$): This measures capital structure gearing. Since Assets equal Debt plus Equity, the equity multiplier expands as the enterprise replaces equity capital with debt financing. An equity multiplier of 2.0x means the corporation controls two dollars of productive economic assets for every one dollar of shareholder equity, with the remainder funded by debt and operating liabilities.

From a capital markets valuation perspective, the relationship between ROE and market multiples is fundamental. Under the Gordon Growth Model, the Price-to-Book (P/B) ratio of a listed company is directly determined by its ROE relative to the investor's required rate of return ($r$):
$$\frac{P}{B} = \frac{\text{ROE} - g}{r - g}$$
When an Indian enterprise listed on the National Stock Exchange (NSE) or Bombay Stock Exchange (BSE) consistently produces an ROE well above its cost of equity, its shares trade at a substantial premium to book value. Global institutional asset managers, sovereign wealth funds, and domestic mutual funds routinely run multi-year ROE consistency screens to filter out cyclical value traps from genuine compounding franchises. Furthermore, under Schedule III Division II of the Companies Act 2013, companies are mandatorily required to report ROE and capital turnover in their audited footnote disclosures. By deploying the 3-Stage DuPont model, equity analysts and board audit committees can immediately detect whether management is generating sustainable economic alpha through high profit margins and fast inventory turns, or merely amplifying accounting returns through excessive debt leverage that jeopardizes corporate survival during cyclical macroeconomic contractions."""

part2_say = r"""In Part 2 of Day 47, we advance beyond the classic three-stage framework to master the 5-Stage Extended DuPont Model, isolating operational productivity, financial gearing costs, and statutory tax burdens.

While the 3-stage model is an indispensable diagnostic baseline, it conflates core operational profitability with financing decisions and tax planning within the broad Net Profit Margin term. A corporation might boast an impressive net profit margin simply because it received a one-off tax holiday or deferred tax reversal under Ind AS 12, despite suffering from deteriorating factory floor gross margins.

To eliminate this ambiguity, corporate finance practitioners and institutional equity researchers disaggregate the Net Profit Margin into three granular components, creating the 5-Stage Extended DuPont Model:
$$\text{ROE} = \left(\frac{\text{Net Income}}{\text{EBT}}\right) \times \left(\frac{\text{EBT}}{\text{EBIT}}\right) \times \left(\frac{\text{EBIT}}{\text{Revenue}}\right) \times \left(\frac{\text{Revenue}}{\text{Total Assets}}\right) \times \left(\frac{\text{Total Assets}}{\text{Equity}}\right)$$
$$\text{ROE} = \text{Tax Burden} \times \text{Interest Burden} \times \text{Operating Margin} \times \text{Asset Turnover} \times \text{Equity Multiplier}$$

Let us examine the economic mechanics of each factor:
1. Tax Burden ($\text{Net Income} / \text{EBT}$):
   $$\text{Tax Burden} = 1 - \text{Effective Tax Rate}$$
   This metric measures the percentage of pre-tax earnings retained by shareholders after paying corporate income taxes. In India, under Section 115BAA of the Income Tax Act, 1961, domestic manufacturing companies paying the base 22% corporate tax plus 10% surcharge and 4% cess face an effective tax rate of 25.168%. Consequently, their normative tax burden is $1 - 0.25168 = 0.74832$. A higher tax burden indicates effective utilization of research and development deductions, capital investment allowances, or international tax treaty credits.
2. Interest Burden ($\text{EBT} / \text{EBIT}$):
   $$\text{Interest Burden} = 1 - \frac{\text{Interest Expense}}{\text{EBIT}} = \frac{\text{EBIT} - \text{Interest}}{\text{EBIT}}$$
   The interest burden reflects the proportion of operating profits preserved after satisfying debt service finance costs. If a firm carries zero debt, interest expense is zero, and the interest burden is exactly 1.0 (or 100%). As leverage increases, interest expense consumes an increasing fraction of operating earnings, driving the interest burden down toward zero. An interest burden below 0.60 indicates that debt financing costs are severely cannibalizing operating profits.
3. Operating Profit Margin ($\text{EBIT} / \text{Revenue}$):
   This metric isolates core operational profitability, completely untainted by how the company chooses to finance its capital structure (debt vs equity) or how the tax authorities tax its profits. It reflects pure industrial execution, procurement efficiency, and labor productivity.
4. Asset Turnover ($\text{Revenue} / \text{Total Assets}$):
   Maintains the identical asset utilization efficiency interpretation as in the 3-stage framework.
5. Equity Multiplier ($\text{Total Assets} / \text{Equity}$):
   Maintains the identical financial leverage interpretation.

Notice the profound analytical synergy: multiplying the Interest Burden ($\text{EBT} / \text{EBIT}$) by the Equity Multiplier ($\text{Total Assets} / \text{Equity}$) explicitly reveals the net financial leverage effect! If borrowing additional debt enhances ROE, the product of the interest burden and the equity multiplier will exceed 1.0; however, if the borrowing interest rate exceeds the firm's operating return on assets, the crushing drag of interest expense will outweigh the leverage boost, eroding shareholder value. In our Apex Engineering case study, the 5-stage decomposition confirms that an operating margin of 20.0%, tax burden of 0.7483, interest burden of 0.8333, asset turnover of 0.9677, and leverage multiplier of 2.0667 cleanly synthesize into an elite ROE of 24.94%."""

part3_say = r"""In Part 3 of Day 47, we explore the critical governance comparison between Return on Equity (ROE) and Return on Invested Capital (ROIC).

In modern corporate controllership and capital allocation, relying exclusively on ROE can be dangerous and misleading due to corporate financial engineering. Specifically, when an enterprise executes aggressive share buybacks under Section 68 of the Companies Act 2013, using debt proceeds to repurchase equity shares, the accounting book value of shareholders' equity shrinks dramatically. In extreme cases, repeated share buybacks can drive book equity near zero or even negative, creating an infinite or mathematically meaningless ROE!

To establish an objective, unalterable benchmark of industrial productivity that remains completely neutral to financial engineering, corporate boards and institutional investors rely on Return on Invested Capital (ROIC):
$$\text{Return on Invested Capital (ROIC)} = \frac{\text{Net Operating Profit After Tax (NOPAT)}}{\text{Invested Capital}}$$
ROIC measures the cash return generated by the core operating assets of the enterprise, regardless of whether those assets were financed through ordinary equity, preference shares, bank borrowings, or public debentures.

Let us define the precise quantitative components:
1. Net Operating Profit After Tax (NOPAT):
   $$\text{NOPAT} = \text{Operating Profit (EBIT)} \times (1 - \text{Effective Corporate Tax Rate})$$
   NOPAT represents the theoretical after-tax profit generated by core commercial operations assuming the corporation was financed entirely with 100% equity capital (i.e. zero debt, zero interest deductions). In our Apex Engineering case study, with $24,000,000 EBIT and an enacted Section 115BAA corporate tax rate of 25.168%:
   $$\text{NOPAT} = \$24,000,000.00 \times (1 - 0.25168) = \$24,000,000.00 \times 0.74832 = \$17,959,680.00$$
2. Invested Capital:
   Invested capital can be calculated via either the Financing Approach or the Operating Approach:
   - Financing Approach:
     $$\text{Invested Capital} = \text{Total Interest-Bearing Debt} + \text{Shareholders' Equity} - \text{Excess Cash and Marketable Securities}$$
   - Operating Approach:
     $$\text{Invested Capital} = \text{Net Working Capital (Current Operating Assets} - \text{Non-Interest Current Liabilities)} + \text{Net PP&E} + \text{Intangibles}$$
   Both approaches yield identical capital numbers. By subtracting excess cash, we isolate the capital actively tied up in generating operating profits. In Apex Engineering, Total Debt ($40M) plus Equity ($60M) minus Cash ($6M) yields an Invested Capital base of $94,000,000.00.

Now we compute Apex Engineering's ROIC:
$$\text{ROIC} = \frac{\$17,959,680.00}{\$94,000,000.00} = 19.106\% \approx 19.11\%$$

In addition, under Ind AS 116 (Leases), the mandatory capitalization of right-of-use (ROU) assets and lease liabilities expands both the invested capital denominator and NOPAT (as operating rent is eliminated, replaced by depreciation and interest). Corporate controllers must ensure that lease liabilities are treated consistently as debt capital across the ROIC calculation. Furthermore, when evaluating conglomerate multi-business entities, divisional controllers compute separate ROIC metrics for each operating segment under Ind AS 108, ensuring that underperforming divisions that drag down corporate capital efficiency are identified for restructuring or strategic divestiture.

The Golden Rule of Corporate Value Creation states that a company creates true shareholder wealth if and only if its ROIC exceeds its Weighted Average Cost of Capital (WACC):
$$\text{Value Creation Condition}: \text{ROIC} > \text{WACC}$$
If an enterprise delivers an ROE of 20% by borrowing at high interest rates, but its ROIC is only 8% while its WACC is 10%, the enterprise is destroying real economic wealth with every project it undertakes! Crucially, because WACC reflects the blended after-tax cost of both debt and equity financing, ROIC must be computed on an after-tax basis using NOPAT to ensure a mathematically consistent comparison. For Apex Engineering, an ROIC of 19.11% against a hurdle WACC of 11.5% generates an outstanding positive return spread of $+7.61\%$, confirming exceptional capital stewardship and sustainable competitive advantage across its industrial markets."""

part4_say = r"""In Part 4 of Day 47, we integrate Economic Value Added (EVA) and the Stern Stewart value-based management framework into corporate controllership.

Accounting net profit, computed strictly under accrual standards such as Ind AS, suffers from a fatal corporate finance limitation: it treats equity capital as free! While the profit and loss statement dutifully records interest expense paid to debt holders, it never deducts a single rupee for the opportunity cost of equity capital provided by ordinary shareholders. Consequently, an enterprise can report positive accounting net income year after year while simultaneously eroding investor wealth.

To correct this foundational flaw, G. Bennett Stewart III and Joel M. Stern formalized Economic Value Added (EVA), defined as the economic profit remaining after deducting the full cost of all capital deployed:
$$\text{Economic Value Added (EVA)} = \text{NOPAT} - (\text{Invested Capital} \times \text{WACC})$$
Alternatively, EVA can be expressed through the ROIC-WACC spread:
$$\text{EVA} = (\text{ROIC} - \text{WACC}) \times \text{Invested Capital}$$

To bridge the gap between statutory accounting and economic reality, the Stern Stewart framework prescribes specific accounting adjustments to GAAP/Ind AS financial statements:
1. Research and Development (R&D) Capitalization: Under Ind AS 38, research costs are expensed immediately to profit or loss. In calculating EVA, research outlays are capitalized and amortized over their multi-year economic useful life (typically 3 to 5 years), reversing the accounting distortion that penalizes innovative enterprises.
2. Operating Lease Capitalization: Prior to Ind AS 116, operating lease commitments were off-balance sheet; EVA converted them into debt and capitalized assets.
3. Reversal of Non-Cash Provisions: Subjective warranty provisions and restructuring accruals are added back to invested capital until cash settlements occur.
4. Goodwill Impairment: Goodwill write-downs under Ind AS 36 are added back to invested capital to ensure management remains accountable for historical acquisition premiums.

Let us analyze the components of the EVA calculation for Apex Engineering Ltd:
1. Net Operating Profit After Tax (NOPAT):
   As established in Part 3, NOPAT equals $\$17,959,680.00$.
2. Invested Capital:
   Total operating capital invested equals $\$94,000,000.00$.
3. Weighted Average Cost of Capital (WACC):
   Apex's blended capital hurdle rate is established by corporate treasury at 11.50%.
4. Capital Charge:
   $$\text{Capital Charge} = \text{Invested Capital} \times \text{WACC} = \$94,000,000.00 \times 11.50\% = \$10,810,000.00$$
   The capital charge represents the absolute minimum monetary return demanded by providers of debt and equity capital to compensate them for the systematic operational and financial risks of the business.
5. Net Economic Value Added:
   $$\text{EVA} = \$17,959,680.00 - \$10,810,000.00 = \$7,149,680.00$$
   Equivalently, using the return spread:
   $$\text{EVA} = (19.106\% - 11.50\%) \times \$94,000,000.00 = 7.606\% \times \$94,000,000.00 = \$7,149,680.00$$

Indian industrial leaders, including Tata Sons, Larsen & Toubro, and Godrej Consumer Products, utilize EVA-based frameworks to align executive compensation with true shareholder value creation. Rather than awarding management bonuses based on gross revenue growth or reported accounting EPS (both of which can be gamed through debt-fueled acquisitions or aggressive accrual accounting), EVA bonuses are tied directly to expanding the ROIC-WACC spread and maximizing economic profit. Under Regulation 34 of the SEBI (LODR) Regulations, 2015, listed enterprises frequently include EVA and capital allocation discussions in the Management Discussion and Analysis (MD&A) chapter of their annual reports. When Market Value Added is positive and growing over successive financial years, the equity market signals its confidence in management's project selection and capital discipline. Conversely, negative cumulative EVA destroys shareholder wealth, inevitably attracting activist shareholders and triggering corporate governance interventions under the Companies Act 2013. Furthermore, cumulative EVA discounted back to present value establishes Market Value Added (MVA), confirming sustained equity outperformance and long-term compounding for shareholders."""

part5_say = r"""In Part 5 of Day 47, we execute and verify our complete Python DuPont & EVA Decomposition Suite, validating every quantitative assertion across accounting returns, operating efficiency, and economic profit!

Let us review the corporate diagnostic results produced by our Python simulation engine for Apex Engineering Ltd:
1. Financial Statement Inputs:
   - Annual Revenue = $120,000,000.00.
   - Operating Profit (EBIT) = $24,000,000.00.
   - Pre-Tax Income (EBT) = $20,000,000.00 (reflecting $4,000,000 interest).
   - Corporate Tax Expense = $5,033,600.00 (25.168% Section 115BAA rate).
   - Net Income After Tax = $14,966,400.00.
   - Total Assets = $124,000,000.00; Shareholders' Equity = $60,000,000.00.
   - Total Interest-Bearing Debt = $40,000,000.00; Operating Cash = $6,000,000.00.
   - Treasury Blended WACC = 11.50%.
2. 3-Stage DuPont Breakdown:
   - Net Profit Margin = $\$14,966,400 / \$120,000,000 = 12.47\%$.
   - Asset Turnover (ATO) = $\$120,000,000 / \$124,000,000 = 0.9677$.
   - Equity Multiplier (EM) = $\$124,000,000 / \$60,000,000 = 2.0667$.
   - 3-Stage Return on Equity:
     $$\text{ROE} = 12.472\% \times 0.96774 \times 2.06667 = 24.94\%$$
3. 5-Stage Extended DuPont Breakdown:
   - Tax Burden = $\$14,966,400 / \$20,000,000 = 0.7483$.
   - Interest Burden = $\$20,000,000 / \$24,000,000 = 0.8333$.
   - Operating Profit Margin = $\$24,000,000 / \$120,000,000 = 20.00\%$.
   - Asset Turnover = $0.9677$.
   - Equity Multiplier = $2.0667$.
   - 5-Stage Return on Equity:
     $$\text{ROE} = 0.7483 \times 0.8333 \times 0.20 \times 0.9677 \times 2.0667 = 24.94\%$$
4. Value-Based Metrics (ROIC & EVA):
   - NOPAT = $\$24,000,000 \times (1 - 0.25168) = \$17,959,680.00$.
   - Invested Capital = $\$40,000,000 + \$60,000,000 - \$6,000,000 = \$94,000,000.00$.
   - Return on Invested Capital (ROIC) = $\$17,959,680 / \$94,000,000 = 19.11\%$.
   - Hurdle Capital Charge at 11.5% WACC = $\$94,000,000 \times 11.5\% = \$10,810,000.00$.
   - Economic Value Added (EVA) = $\$17,959,680 - \$10,810,000 = \$7,149,680.00$.

By unifying the 3-stage DuPont, 5-stage DuPont, ROIC, and EVA into an automated corporate reporting suite, the Chief Financial Officer and equity analysts gain 360-degree visibility into corporate performance. The calculations prove that Apex Engineering's 24.94% ROE is not a mirage manufactured by debt leverage: core operating margins are an impressive 20.0%, asset utilization is strong, and operations generate over $7.14 million of true economic profit above the blended cost of capital. In executive strategy sessions, management utilizes this decomposition tree to make targeted capital allocations—directing capex exclusively toward product divisions that deliver an ROIC-WACC spread exceeding 500 basis points. Each programmatic assertion executed within our Python platform directly verifies that the underlying accounting data reconciles across Schedule III Division II balance sheet and profit and loss items with zero mathematical error. Furthermore, under CARO 2020 Clause 3(xix), the statutory auditors review these capital return decompositions to confirm the ongoing economic viability of the corporate enterprise.

When our standalone Python simulation executes, every programmatic assertion validates with zero rounding error, culminating in the terminal output:
```
3-Stage DuPont ROE: 24.94% (Margin 12.47% * Turnover 0.9677 * Leverage 2.0667)
5-Stage DuPont ROE: 24.94% (Tax 0.7483 * Interest 0.8333 * EBIT Margin 20.0% * ATO 0.9677 * EM 2.0667)
Value Creation: NOPAT $17,959,680.00 | ROIC 19.11% vs WACC 11.5% | EVA $7,149,680.00
DUPONT_ROE_DECOMPOSITION_PASS
```
This certifies complete mastery of Day 47 DuPont Analysis & ROE Decomposition, providing corporate financial officers with an indispensable diagnostic toolkit and preparing us for Day 48: Operating & Financial Leverage and Financial Distress Models!"""

day47_lesson = {
    "coursePrefix": "bcom-accounting",
    "day": 47,
    "title": "DuPont Analysis & Return on Equity (ROE) Decomposition (3-Stage & 5-Stage Extended Models)",
    "parts": [
        {
            "part": 1,
            "title": "Strategic Foundations of ROE & The 3-Stage DuPont Architecture",
            "say": part1_say,
            "code": day47_code,
            "output": day47_output,
            "check": {
                "question": "In the 3-Stage DuPont Model, what three underlying operational and financial components drive Return on Equity (ROE)?",
                "options": [
                    "Net Profit Margin, Asset Turnover, and Equity Multiplier (Financial Leverage)",
                    "Gross Margin, Current Ratio, and Debt-to-Equity Ratio",
                    "Operating Cash Flow, Free Cash Flow, and WACC",
                    "EBITDA, Interest Coverage Ratio, and Price-to-Earnings Ratio"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "The 3-stage DuPont model decomposes ROE into Net Profit Margin (profitability), Asset Turnover (efficiency), and Equity Multiplier (leverage).",
                "why": "The 3-stage DuPont model decomposes ROE into Net Profit Margin (profitability), Asset Turnover (efficiency), and Equity Multiplier (leverage)."
            }
        },
        {
            "part": 2,
            "title": "5-Stage Extended DuPont Model: Operating Margin, Financing Burden & Tax Drag",
            "say": part2_say,
            "code": day47_code,
            "output": day47_output,
            "check": {
                "question": "What is the formula and economic interpretation of the Interest Burden in the 5-Stage Extended DuPont Model?",
                "options": [
                    "EBT divided by EBIT, measuring the proportion of operating profits preserved after deducting debt service finance costs",
                    "Interest Expense divided by Revenue, measuring interest cost percentage",
                    "EBIT divided by Interest Expense, measuring interest coverage safety",
                    "Total Debt divided by EBT, measuring debt repayment duration"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "Interest Burden equals EBT / EBIT (or 1 - Interest/EBIT), quantifying the fraction of operating income retained after paying financing costs.",
                "why": "Interest Burden equals EBT / EBIT (or 1 - Interest/EBIT), quantifying the fraction of operating income retained after paying financing costs."
            }
        },
        {
            "part": 3,
            "title": "ROIC vs ROE: The Neutrality of Capital Structure & The Hurdle Rate Rule",
            "say": part3_say,
            "code": day47_code,
            "output": day47_output,
            "check": {
                "question": "Why is Return on Invested Capital (ROIC) superior to ROE when evaluating companies that engage in massive debt-financed share buybacks?",
                "options": [
                    "Because ROIC is unaffected by equity-reducing financial engineering, measuring cash return on total operating capital deployed regardless of debt-equity mix",
                    "Because ROIC excludes all corporate income tax expenses from profit calculations",
                    "Because ROIC is required by the SEC while ROE is illegal under Ind AS",
                    "Because ROIC only looks at intangible software assets rather than factory machinery"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "Share buybacks shrink book equity, artificially inflating ROE. ROIC evaluates NOPAT relative to total invested capital, preventing buyback-induced distortions.",
                "why": "Share buybacks shrink book equity, artificially inflating ROE. ROIC evaluates NOPAT relative to total invested capital, preventing buyback-induced distortions."
            }
        },
        {
            "part": 4,
            "title": "Economic Value Added (EVA) & Value-Based Management Frameworks",
            "say": part4_say,
            "code": day47_code,
            "output": day47_output,
            "check": {
                "question": "Under the Stern Stewart Economic Value Added (EVA) framework, what does a positive EVA signify?",
                "options": [
                    "The company has earned a return on invested capital (ROIC) that exceeds its Weighted Average Cost of Capital (WACC), creating genuine shareholder wealth",
                    "The company has zero debt obligations on its consolidated balance sheet",
                    "The company's gross profit margin exceeds 50% of annual revenue",
                    "The company is exempt from paying corporate income taxes under Section 115BAA"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "Positive EVA occurs when NOPAT exceeds the capital charge (Invested Capital * WACC), meaning ROIC > WACC and true economic wealth is created.",
                "why": "Positive EVA occurs when NOPAT exceeds the capital charge (Invested Capital * WACC), meaning ROIC > WACC and true economic wealth is created."
            }
        },
        {
            "part": 5,
            "title": "Python DuPont & EVA Decomposition Suite Execution & Controllership Verification",
            "say": part5_say,
            "code": day47_code,
            "output": day47_output,
            "check": {
                "question": "In the Apex Engineering case study, what are the verified values for 3-Stage DuPont ROE and Economic Value Added (EVA)?",
                "options": [
                    "3-Stage DuPont ROE = 24.94%; Economic Value Added (EVA) = $7,149,680.00",
                    "3-Stage DuPont ROE = 12.47%; Economic Value Added (EVA) = $17,959,680.00",
                    "3-Stage DuPont ROE = 19.11%; Economic Value Added (EVA) = $10,810,000.00",
                    "3-Stage DuPont ROE = 35.00%; Economic Value Added (EVA) = Zero"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "Apex Engineering exhibits ROE = 12.47% * 0.9677 * 2.0667 = 24.94%, and EVA = $17,959,680 NOPAT - $10,810,000 Capital Charge = $7,149,680.00.",
                "why": "Apex Engineering exhibits ROE = 12.47% * 0.9677 * 2.0667 = 24.94%, and EVA = $17,959,680 NOPAT - $10,810,000 Capital Charge = $7,149,680.00."
            }
        }
    ]
}

total_words = 0
for p in day47_lesson["parts"]:
    wc = count_words(p["say"])
    total_words += wc
    print(f"Day 47 Part {p['part']} words: {wc}")

for p in day47_lesson["parts"]:
    wc = count_words(p["say"])
    assert wc >= 580, f"Part {p['part']} word count {wc} < 580"

print(f"Day 47 Total words: {total_words}")
assert total_words >= 3000, f"Total word count {total_words} < 3000"

with open("scripts/bcom_acc_day47.json", "w", encoding="utf-8") as f:
    json.dump(day47_lesson, f, indent=2)

print("Saved scripts/bcom_acc_day47.json successfully!")
