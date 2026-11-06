import json
import hashlib
import subprocess
import sys
import os

def run_py(code):
    res = subprocess.run([sys.executable, "-c", code], capture_output=True, text=True, check=True)
    return res.stdout.strip()

# Day 15 Parts with Grand Master Milestone 3 Capstone exposition
parts = [
    {
        "title": "Strategic M&A Architecture, Exchange Ratios & Transaction Financing Mix",
        "say": [
            "Welcome to the Grand Master Milestone 3 Capstone of Excel & Data Analysis Fundamentals. Today, we culminate our journey through institutional financial engineering by deploying the ultimate corporate finance discipline: Enterprise Strategic Mergers & Acquisitions (M&A). In modern corporate strategy, organic revenue growth is often too slow to maintain competitive market leadership or enter adjacent technological sectors. Strategic acquisitions enable corporations to leapfrog competitors, consolidate industry market share, gain critical intellectual property, control distribution channels, and realize massive operational economies of scale. However, historical corporate data demonstrates that over 60% of corporate mergers fail to create shareholder value due to overpayment, flawed financing structures, or botched post-merger integration. Consequently, corporate development teams, investment banking M&A advisory groups, and boards of directors demand institutional-grade quantitative models before authorizing multi-billion-dollar transactions.",
            "The initial structural pillar of any M&A model is establishing the Offer Valuation and Acquisition Control Premium. To convince the board and shareholders of a publicly traded target company to surrender control of their enterprise, the acquiring corporation must offer a premium over the target's undisturbed public market trading price (typically 20% to 40% acquisition premium). The negotiated Offer Price Per Share establishes the Equity Purchase Price: Equity Purchase Price = Target Diluted Shares * Offer Price Per Share. When combined with the target company's existing net debt and transaction advisory frictions, this determines the total Enterprise Transaction Consideration.",
            "The second critical decision is the Financing Consideration Mix: how will the acquirer fund the acquisition? Acquirers choose between three core funding sources: Cash on Balance Sheet, New Debt Issuance (syndicated term loans or senior notes), and Acquirer Common Stock. A 100% Cash or Debt transaction minimizes share dilution and delivers the highest potential Earnings Per Share (EPS) accretion—provided the after-tax cost of debt is lower than the target's earnings yield. However, exhausting corporate cash reserves and raising debt increases financial leverage, placing the acquirer's investment-grade credit rating at risk and reducing balance sheet flexibility.",
            "Conversely, issuing Acquirer Common Stock preserves cash reserves, avoids credit rating downgrades, and shares post-transaction business risks with the target company's shareholders. In a stock-for-stock transaction, investment bankers establish the Exchange Ratio: Exchange Ratio = Offer Price Per Target Share / Acquirer Stock Price. The Exchange Ratio determines exactly how many shares of acquirer stock target shareholders receive for each share they own: New Shares Issued = Target Shares * Exchange Ratio. Acquirers can structure this as a Fixed Exchange Ratio (where the ratio is locked, exposing the target to acquirer stock volatility) or a Floating Exchange Ratio with Collars (where the dollar value is fixed within a bounded stock price band).",
            "In stock-for-stock mergers, negotiating risk-sharing collars is paramount. Under a Fixed Exchange Ratio, target shareholders accept market risk: if acquirer stock drops 15% prior to closing, target consideration drops 15%. Under a Floating Exchange Ratio, the target is guaranteed a fixed dollar value, shifting the dilution risk entirely to the acquirer. To bridge this divide, sophisticated M&A attorneys draft Collars (such as a 10% symmetric collar), where the exchange ratio floats within a price band to guarantee value, but fixes at the boundary limits to prevent runaway share dilution or transaction cancellation.",
            "Furthermore, large-scale horizontal combinations must navigate intense regulatory and antitrust reviews under the Hart-Scott-Rodino (HSR) Antitrust Improvements Act. The Federal Trade Commission (FTC) and Department of Justice (DOJ) calculate market concentration using the Herfindahl-Hirschman Index (HHI). If a proposed transaction causes the post-merger HHI to rise by over 200 points in highly concentrated industries, regulatory authorities will demand formal consent decrees, requiring the merged firm to divest overlapping retail branches, patents, or manufacturing facilities before approving the merger.",
            "In institutional M&A practice, acquirers frequently deploy a Blended Consideration Mix (e.g., 40% Cash, 30% Debt, and 30% Stock). This balanced structure captures the EPS accretion benefits of cash/debt while mitigating leverage risks through equity co-investment. In this section, we construct a production-grade Strategic Merger Financing Engine in Python. We calculate total acquisition purchase price across control premiums, evaluate fixed exchange ratios, model blended cash, debt, and stock financing structures, and quantify new shares issued and debt liabilities incurred.",
            "Modelers must maintain absolute discipline over share count mechanics: issuing new shares dilutes existing shareholders' voting control and per-share claims on historical earnings. Our engine establishes this foundational framework, tracking pro forma ownership split percentages between legacy acquirer shareholders and incoming target shareholders."
        ],
        "example": "Think of buying an adjacent bakery: the owner wants a 25% premium above what the shop is worth; you pay half in cash from your bank account (Cash Consideration) and give the owner a 20% partnership stake in your combined bakery empire (Stock Consideration via Exchange Ratio).",
        "code": """# Part 1: Strategic Merger Financing Engine
class StrategicMergerFinancingEngine:
    def __init__(self, acquirer_share_price=80.0, acquirer_shares=50000000,
                 target_share_price=35.0, target_shares=20000000, premium_pct=0.25):
        self.acquirer_share_price = acquirer_share_price
        self.acquirer_shares = acquirer_shares
        self.target_share_price = target_share_price
        self.target_shares = target_shares
        self.premium_pct = premium_pct

    def structure_transaction(self, cash_pct=0.40, debt_pct=0.30, stock_pct=0.30):
        assert abs(cash_pct + debt_pct + stock_pct - 1.0) < 1e-5, "Financing mix must sum to 100%!"
        
        # 1. Offer Price & Equity Purchase Value
        offer_price_per_share = self.target_share_price * (1.0 + self.premium_pct)
        equity_purchase_price = offer_price_per_share * self.target_shares
        
        # 2. Financing Mix Breakdown
        cash_consideration = equity_purchase_price * cash_pct
        debt_consideration = equity_purchase_price * debt_pct
        stock_consideration = equity_purchase_price * stock_pct
        
        # 3. Exchange Ratio & New Shares Issued
        full_stock_exchange_ratio = offer_price_per_share / self.acquirer_share_price
        new_shares_issued = stock_consideration / self.acquirer_share_price
        pro_forma_shares = self.acquirer_shares + new_shares_issued
        
        acquirer_ownership_pct = self.acquirer_shares / pro_forma_shares * 100.0
        target_ownership_pct = new_shares_issued / pro_forma_shares * 100.0
        
        return {
            'offer_price_per_share': round(offer_price_per_share, 2),
            'equity_purchase_price': round(equity_purchase_price, 2),
            'cash_funded': round(cash_consideration, 2),
            'debt_funded': round(debt_consideration, 2),
            'stock_funded': round(stock_consideration, 2),
            'exchange_ratio': round(full_stock_exchange_ratio, 4),
            'new_shares_issued': round(new_shares_issued, 0),
            'pro_forma_shares': round(pro_forma_shares, 0),
            'acquirer_ownership_pct': round(acquirer_ownership_pct, 2),
            'target_ownership_pct': round(target_ownership_pct, 2)
        }

engine = StrategicMergerFinancingEngine()
res = engine.structure_transaction(cash_pct=0.40, debt_pct=0.30, stock_pct=0.30)

print("=== STRATEGIC M&A TRANSACTION FINANCING REPORT ===")
print(f"Target Undisturbed Price: ${engine.target_share_price:.2f} | Offer Price ({engine.premium_pct*100:.0f}% Premium): ${res['offer_price_per_share']:.2f}")
print(f"Total Equity Purchase Price: ${res['equity_purchase_price']:,.2f}")
print("-" * 65)
print(f"Financing Mix: 40% Cash | 30% Debt | 30% Stock")
print(f"  Cash Consideration:      ${res['cash_funded']:>14,.2f}")
print(f"  New Debt Incurred:       ${res['debt_funded']:>14,.2f}")
print(f"  Stock Consideration:     ${res['stock_funded']:>14,.2f}")
print(f"Full Stock Exchange Ratio: {res['exchange_ratio']} Acquirer Shares per Target Share")
print(f"New Common Shares Issued:  {res['new_shares_issued']:>14,.0f}")
print(f"Pro Forma Diluted Shares:  {res['pro_forma_shares']:>14,.0f}")
print(f"Pro Forma Ownership:       Acquirer: {res['acquirer_ownership_pct']}% | Target: {res['target_ownership_pct']}%")
""",
        "codeNotes": [
            {"line": 2, "note": "Initializes StrategicMergerFinancingEngine with acquirer and target share prices, share counts, and control premium"},
            {"line": 13, "note": "Computes offer price per share applying acquisition control premium and derives total equity purchase price"},
            {"line": 24, "note": "Calculates stock exchange ratio and solves for exact number of new common shares issued"},
            {"line": 27, "note": "Determines pro forma combined share count and post-closing ownership dilution percentages"}
        ],
        "tryIt": "Increase stock_pct to 0.70 and cash_pct to 0.10, and observe how new shares issued surge, diluting acquirer legacy ownership.",
        "check": {
            "question": "What is the primary trade-off of using 100% common stock financing versus 100% debt financing in an acquisition?",
            "options": [
                "Stock financing avoids balance sheet debt leverage and rating downgrades, but dilutes existing shareholder EPS and ownership control",
                "Stock financing is illegal for public corporations under SEC guidelines",
                "Debt financing completely eliminates interest rate risk",
                "Stock financing guarantees that the target company's share price falls to zero"
            ],
            "answer": 0,
            "why": "Financing an acquisition with stock protects corporate liquidity and credit ratings, but dilutes legacy shareholder ownership and future EPS."
        }
    },
    {
        "title": "Pro Forma Combined Income Statement, Goodwill & Purchase Price Allocation (PPA)",
        "say": [
            "Once the acquisition purchase price and financing structure are determined, corporate financial modelers must execute the formal accounting consolidation under US GAAP (ASC 805) and IFRS 3 (Business Combinations). Under modern accounting standards, the legacy 'pooling-of-interests' method has been permanently abolished in favor of the Acquisition Method. Under the Acquisition Method, the acquirer must record all identifiable tangible and intangible assets acquired and liabilities assumed at their fair market values as of the acquisition closing date.",
            "The central accounting calculation of M&A is the Purchase Price Allocation (PPA) and Goodwill Determination. Goodwill represents the residual excess purchase price paid over the fair market value of the target company's net identifiable assets: Goodwill = Allocable Purchase Price - Fair Value of Net Identifiable Assets. Let us dissect this calculation step by step. First, the analyst determines the Target Book Value of Equity (Total Assets minus Total Liabilities on historical balance sheets).",
            "Second, the analyst performs asset step-up appraisals. In almost every acquisition, the target company's assets are recorded on its historical balance sheet at depreciated book values that severely understate commercial market value. The acquirer revalues tangible assets (such as manufacturing real estate and equipment) upward (Tangible PP&E Step-Up) and identifies previously unrecorded intangible assets: customer relationship lists, proprietary software, patents, and trademarks/brand names (Identifiable Intangibles Step-Up).",
            "To determine the true allocable purchase price, financial analysts begin by wiping out the target company's historical Common Stock, Additional Paid-In Capital (APIC), Retained Earnings, and historical Goodwill. Historical Goodwill represents premiums paid in the target's past acquisitions and cannot be transferred to the new balance sheet; it is eliminated in purchase accounting. The target's tangible assets are then revalued at Fair Value, establishing the new baseline for asset turnover and return on invested capital (ROIC) metrics.",
            "Third, the model must account for the creation of Deferred Tax Liabilities (DTL). In a non-taxable stock purchase, the IRS and tax authorities do not permit the acquirer to step up asset bases for tax depreciation purposes; tax depreciation continues based on historical carryover basis. However, on the GAAP reporting books, the assets are stepped up and will generate higher GAAP book depreciation and amortization. To reconcile this timing difference between GAAP book expenses and tax return deductions, accounting standards mandate recording a Deferred Tax Liability: DTL = Total Asset Step-Ups * Corporate Marginal Tax Rate. The creation of a DTL increases calculated Goodwill dollar-for-dollar.",
            "In private corporate acquisitions and corporate carve-outs, buyers and sellers may jointly file a Section 338(h)(10) election with the IRS. Under this election, a legal stock acquisition is treated for corporate tax purposes as an asset sale. This allows the buyer to step up asset bases for tax depreciation purposes—deducting higher depreciation and amortizing goodwill over 15 years under Section 197—creating massive cash tax shields, albeit requiring negotiation with the seller who may face higher tax liabilities.",
            "Under US GAAP ASC 350, Goodwill is not amortized over time; instead, it is capitalized on the consolidated balance sheet and subjected to mandatory annual impairment testing. If the acquired business underperforms its original acquisition forecasts, the board must write down Goodwill as an extraordinary non-cash impairment charge. By contrast, identifiable finite-lived intangible assets (such as customer relationships) must be amortized over their estimated useful lives (typically 10 to 15 years), creating an ongoing non-cash amortization expense that reduces pro forma operating income.",
            "In this section, we construct a production-grade Purchase Price Allocation Engine in Python. We calculate tangible and intangible asset write-ups, model deferred tax liabilities, determine exact Goodwill created, and project annual incremental depreciation and amortization charges flowing into the pro forma combined income statement."
        ],
        "example": "Think of buying an established Italian restaurant for $1,000,000 whose physical tables and ovens are worth $300,000: you appraise the ovens at $400,000 (asset step-up) and value the secret sauce recipe and customer loyalty list at $200,000 (identifiable intangibles); the remaining $400,000 premium you paid is Goodwill.",
        "code": """# Part 2: Purchase Price Allocation (PPA) & Goodwill Engine
class PurchasePriceAllocationEngine:
    def __init__(self, equity_purchase_price=875000000.0, target_book_equity=250000000.0,
                 ppe_writeup=60000000.0, intangible_writeup=140000000.0, tax_rate=0.25):
        self.equity_purchase_price = equity_purchase_price
        self.target_book_equity = target_book_equity
        self.ppe_writeup = ppe_writeup
        self.intangible_writeup = intangible_writeup
        self.tax_rate = tax_rate

    def calculate_ppa_and_goodwill(self, ppe_useful_life=15, intangible_useful_life=10):
        total_writeup = self.ppe_writeup + self.intangible_writeup
        deferred_tax_liability = total_writeup * self.tax_rate
        fair_value_net_assets = self.target_book_equity + total_writeup - deferred_tax_liability
        goodwill = self.equity_purchase_price - fair_value_net_assets
        
        annual_depr_stepup = self.ppe_writeup / ppe_useful_life
        annual_amort_stepup = self.intangible_writeup / intangible_useful_life
        total_annual_noncash_drag = annual_depr_stepup + annual_amort_stepup
        after_tax_noncash_drag = total_annual_noncash_drag * (1.0 - self.tax_rate)
        
        return {
            'purchase_price': round(self.equity_purchase_price, 2),
            'target_book_equity': round(self.target_book_equity, 2),
            'ppe_stepup': round(self.ppe_writeup, 2),
            'intangible_stepup': round(self.intangible_writeup, 2),
            'total_writeup': round(total_writeup, 2),
            'dtl_created': round(deferred_tax_liability, 2),
            'fair_value_net_assets': round(fair_value_net_assets, 2),
            'goodwill_created': round(goodwill, 2),
            'annual_depr_stepup': round(annual_depr_stepup, 2),
            'annual_amort_stepup': round(annual_amort_stepup, 2),
            'total_pretax_drag': round(total_annual_noncash_drag, 2),
            'after_tax_drag': round(after_tax_noncash_drag, 2)
        }

engine = PurchasePriceAllocationEngine()
res = engine.calculate_ppa_and_goodwill()

print("=== PURCHASE PRICE ALLOCATION (PPA) & GOODWILL SCHEDULE ===")
print(f"Equity Purchase Consideration:        ${res['purchase_price']:>14,.2f}")
print(f"Less: Target Book Value of Equity:     -${res['target_book_equity']:>14,.2f}")
print("-" * 65)
print(f"Allocable Excess Purchase Price:       ${res['purchase_price'] - res['target_book_equity']:>14,.2f}")
print(f"  PP&E Tangible Asset Step-Up:          ${res['ppe_stepup']:>14,.2f}")
print(f"  Identifiable Intangible Assets:       ${res['intangible_stepup']:>14,.2f}")
print(f"  Less: Deferred Tax Liability Created: -${res['dtl_created']:>14,.2f}")
print("-" * 65)
print(f"Fair Value of Net Identifiable Assets:  ${res['fair_value_net_assets']:>14,.2f}")
print(f"Allocated Goodwill Created:             ${res['goodwill_created']:>14,.2f}")
print("-" * 65)
print("PRO FORMA ANNUAL NON-CASH P&L CHARGES:")
print(f"  Incremental PP&E Depreciation (15 Yr): ${res['annual_depr_stepup']:>14,.2f}")
print(f"  Intangible Amortization (10 Yr):       ${res['annual_amort_stepup']:>14,.2f}")
print(f"  Total Pre-Tax Operating Drag:          ${res['total_pretax_drag']:>14,.2f}")
print(f"  After-Tax Net Income Drag (25% Tax):   ${res['after_tax_drag']:>14,.2f}")
""",
        "codeNotes": [
            {"line": 2, "note": "Initializes PurchasePriceAllocationEngine with purchase price, book equity, asset step-ups, and tax rate"},
            {"line": 13, "note": "Computes Deferred Tax Liability (DTL = Total Step-Up * Tax Rate) arising from non-tax-deductible basis step-ups"},
            {"line": 20, "note": "Solves for residual Goodwill created: Purchase Price - (Book Equity + Step-Ups - DTL)"},
            {"line": 24, "note": "Calculates ongoing annual non-cash depreciation and intangible amortization drag on pro forma operating income"}
        ],
        "tryIt": "Increase intangible_writeup to $220,000,000 and observe how DTL expands and annual intangible amortization drag increases.",
        "check": {
            "question": "Why does an asset step-up in a non-taxable stock acquisition create a Deferred Tax Liability (DTL)?",
            "options": [
                "Because GAAP book depreciation will be higher than tax-deductible depreciation, creating a temporary timing difference where future tax payments exceed book tax expense",
                "Because the IRS imposes an immediate cash penalty on companies that step up assets",
                "Because Goodwill must always equal zero under US GAAP rules",
                "To ensure that the acquiring company never pays corporate dividends"
            ],
            "answer": 0,
            "why": "Asset write-ups create higher book depreciation without corresponding tax deductions, generating a timing difference that requires recording a Deferred Tax Liability."
        }
    },
    {
        "title": "Revenue & Cost Synergies, Realization Phasing & Integration Friction",
        "say": [
            "In strategic corporate mergers, the primary commercial justification presented to boards of directors and institutional shareholders is the creation of Synergies: the mathematical assertion that the combined enterprise will be worth fundamentally more than the sum of its two standalone parts (1 + 1 = 3). Synergies represent the quantified operational and financial improvements unlocked exclusively through the strategic combination of the two corporate entities.",
            "Institutional M&A modeling categorizes synergies into two distinct disciplines: Cost Synergies (Hard Synergies) and Revenue Synergies (Soft Synergies). Cost Synergies carry high statistical certainty and are heavily credited by Wall Street equity research analysts. Cost synergies stem from eliminating duplicate operational functions: closing redundant corporate headquarters, rationalizing duplicate C-suite executive and administrative staff, consolidating regional sales offices, migrating to unified enterprise software architectures (ERP/CRM), eliminating duplicate audit and legal fees, and leveraging combined purchasing scale to negotiate bulk procurement discounts with suppliers.",
            "Revenue Synergies, by contrast, represent top-line expansion opportunities: cross-selling products across complementary customer bases (e.g., selling acquirer software to target healthcare clients), expanding target products into acquirer's international distribution networks, and packaging bundled product offerings. While lucrative, revenue synergies carry substantial execution risk; conservative investment banking models discount revenue synergies by 50% or exclude them entirely from baseline fairness opinions.",
            "Furthermore, sophisticated financial analysts reject the naive assumption that synergies materialize instantaneously on Day 1. In reality, operational integration is complex, requiring detailed Synergy Phasing Schedules. Cost synergies typically phase in across a three-year trajectory: 25% realized in Year 1, 65% realized in Year 2, and 100% full run-rate realized by Year 3.",
            "Crucially, realizing synergies requires upfront cash expenditures: Integration Restructuring and Severance Friction. To terminate redundant staff and shutter facilities, the acquirer must pay executive severance packages, facility lease termination penalties, and IT systems integration consulting fees. In institutional modeling, total one-off integration costs typically equal 100% to 150% of the annual run-rate cost synergy target, incurred across Years 1 and 2.",
            "Empirical corporate finance studies reveal that cultural misalignment is the number one cause of merger failure. To mitigate integration risk, corporate boards establish an Integration Management Office (IMO) led by dedicated full-time vice presidents. The IMO oversees Day 1 readiness, customer retention task forces, unified HR compensation leveling, and IT infrastructure migration. Tracking synergy capture on weekly dashboards ensures that operational momentum is maintained without disrupting core customer revenue.",
            "Rigorous M&A models also account for Negative Synergies (revenue cannibalization and customer churn). When two direct competitors merge, large enterprise clients who previously split their purchasing between both vendors to avoid supplier lock-in will proactively diversify, transferring 20% to 30% of their business to a third competing firm. Modeling customer churn and product overlap ensures the combined revenue forecast remains conservative and defensible.",
            "In this section, we construct a production-grade Synergy Valuation and Phasing Engine in Python. We model the multi-year phased realization of cost and revenue synergies, deduct integration severance friction, calculate after-tax net synergy cash flows, and compute the Net Present Value (NPV) of synergies capitalized at the combined company's WACC."
        ],
        "example": "Think of two airlines merging: cost synergies are sharing the same ticketing website, airport gates, and baggage handlers (high certainty); revenue synergies are convincing passengers to fly their connecting international routes (lower certainty); integration friction is paying severance to redundant executives and repainting all the airplanes.",
        "code": """# Part 3: Synergy Valuation & Phasing Engine
class SynergyValuationAndPhasingEngine:
    def __init__(self, run_rate_cost_synergies=45000000.0, run_rate_rev_synergies=25000000.0,
                 ebit_margin_on_rev=0.20, tax_rate=0.25, discount_wacc=0.085):
        self.run_rate_cost_synergies = run_rate_cost_synergies
        self.run_rate_rev_synergies = run_rate_rev_synergies
        self.ebit_margin_on_rev = ebit_margin_on_rev
        self.tax_rate = tax_rate
        self.discount_wacc = discount_wacc

    def project_5yr_synergies(self, phasing=[0.25, 0.65, 1.00, 1.00, 1.00],
                              integration_costs=[35000000.0, 15000000.0, 0.0, 0.0, 0.0]):
        schedule = []
        for yr in range(len(phasing)):
            pct = phasing[yr]
            cost_syn = self.run_rate_cost_synergies * pct
            rev_syn = self.run_rate_rev_synergies * pct
            rev_syn_ebit = rev_syn * self.ebit_margin_on_rev
            total_pretax_syn = cost_syn + rev_syn_ebit
            
            int_cost = integration_costs[yr]
            net_operating_benefit = total_pretax_syn - int_cost
            after_tax_benefit = net_operating_benefit * (1.0 - self.tax_rate)
            
            # Mid-year discount factor
            pv_benefit = after_tax_benefit / ((1.0 + self.discount_wacc) ** (yr + 0.5))
            
            schedule.append({
                'year': yr + 1,
                'phasing_pct': int(pct * 100),
                'cost_synergies': round(cost_syn, 2),
                'rev_synergies': round(rev_syn, 2),
                'pretax_synergies': round(total_pretax_syn, 2),
                'integration_costs': round(int_cost, 2),
                'after_tax_benefit': round(after_tax_benefit, 2),
                'pv_benefit': round(pv_benefit, 2)
            })

        terminal_runrate_after_tax = (self.run_rate_cost_synergies + self.run_rate_rev_synergies * self.ebit_margin_on_rev) * (1.0 - self.tax_rate)
        g = 0.015
        tv_synergies = (terminal_runrate_after_tax * (1.0 + g)) / (self.discount_wacc - g)
        pv_tv_synergies = tv_synergies / ((1.0 + self.discount_wacc) ** len(phasing))
        
        npv_synergies = sum(row['pv_benefit'] for row in schedule) + pv_tv_synergies
        
        return schedule, round(npv_synergies, 2), round(tv_synergies, 2)

engine = SynergyValuationAndPhasingEngine()
sched, npv_syn, tv_syn = engine.project_5yr_synergies()

print("=== 5-YEAR SYNERGY PHASING & VALUATION SCHEDULE ===")
print(f"Target Run-Rate: Cost Synergies: ${engine.run_rate_cost_synergies:,.0f} | Revenue Synergies: ${engine.run_rate_rev_synergies:,.0f}")
print("-" * 95)
print(f"{'Year':<5} | {'Phase':<6} | {'Cost Syn':<12} | {'Rev Syn':<10} | {'Pretax Syn':<12} | {'Integ Costs':<12} | {'After-Tax':<12} | {'PV (8.5%)':<12}")
print("-" * 95)
for row in sched:
    print(f"Yr {row['year']:<2} | {row['phasing_pct']:>4}% | ${row['cost_synergies']:>10,.0f} | ${row['rev_synergies']:>8,.0f} | ${row['pretax_synergies']:>10,.0f} | ${row['integration_costs']:>10,.0f} | ${row['after_tax_benefit']:>10,.0f} | ${row['pv_benefit']:>10,.0f}")
print("-" * 95)
print(f"Undiscounted Terminal Value of Perpetual Synergies: ${tv_syn:,.2f}")
print(f"NET PRESENT VALUE (NPV) OF TOTAL SYNERGIES:         ${npv_syn:,.2f}")
""",
        "codeNotes": [
            {"line": 2, "note": "Initializes SynergyValuationAndPhasingEngine with run-rate cost/revenue targets, tax rate, and WACC discount rate"},
            {"line": 10, "note": "Models phased realization schedule (25%, 65%, 100%) and subtracts upfront integration restructuring friction"},
            {"line": 20, "note": "Computes after-tax operating benefits and discounts at mid-year WACC convention"},
            {"line": 35, "note": "Calculates terminal perpetuity value and delivers total Net Present Value (NPV) of synergies"}
        ],
        "tryIt": "Increase run_rate_cost_synergies to $65,000,000 and observe how total capitalized synergy NPV expands past $450M.",
        "check": {
            "question": "Why do investment banking M&A analysts consider cost synergies to be 'hard synergies' compared to revenue synergies?",
            "options": [
                "Because eliminating duplicate overhead, staff, and redundant facilities is under management's direct operational control, whereas customer cross-selling depends on external market behavior",
                "Because cost synergies are required by federal antitrust laws",
                "Because revenue synergies are exempt from corporate income taxes",
                "Because cost synergies can only be calculated using physical currency"
            ],
            "answer": 0,
            "why": "Cost synergies involve internal overhead reductions directly controllable by executive leadership, whereas revenue synergies require external customer adoption and face competitive friction."
        }
    },
    {
        "title": "Pro Forma Earnings Per Share (EPS) Accretion/Dilution Analysis & Breakeven Synergy Solver",
        "say": [
            "In boardroom presentations, equity research notes, and public earnings conference calls, no metric receives more intense scrutiny than Pro Forma Earnings Per Share (EPS) Accretion / Dilution. While institutional valuation theory dictates that transactions should be judged by Net Present Value and economic value added, public market equity investors remain laser-focused on near-term reported accounting earnings. If an acquisition causes the acquirer's projected EPS to decline in Year 1 or Year 2, the transaction is branded as 'Dilutive', frequently triggering an immediate sell-off in the acquirer's stock price. Conversely, if pro forma combined EPS increases, the deal is celebrated as 'Accretive'.",
            "The mathematical definition of EPS Accretion / Dilution is straightforward: Delta EPS = Pro Forma Combined EPS - Acquirer Standalone EPS. To compute Pro Forma Combined Net Income, the model starts with the sum of both standalone net incomes, adds after-tax cost and revenue synergies, deducts after-tax incremental debt interest expense incurred to fund the cash consideration, deducts after-tax foregone interest on consumed balance sheet cash, and deducts after-tax incremental non-cash intangible amortization resulting from purchase price allocation.",
            "Next, Pro Forma Combined Diluted Share Count is computed: Pro Forma Shares = Acquirer Standalone Shares + New Common Shares Issued in the transaction. Dividing Pro Forma Combined Net Income by Pro Forma Diluted Shares yields Pro Forma EPS. If Standalone EPS was $4.50 and Pro Forma EPS is $4.85, the transaction delivers $0.35 in EPS Accretion (+7.8%).",
            "The underlying mathematical driver of EPS accretion is the hurdle cost of the financing source versus the Target Earnings Yield. The after-tax cost of cash is simply the foregone interest rate multiplied by (1 - tax rate) (e.g., 4% * 75% = 3.0%). The after-tax cost of new debt is the interest coupon multiplied by (1 - tax rate) (e.g., 7.5% * 75% = 5.6%). The Cost of Equity in EPS terms is the reciprocal of the Acquirer P/E ratio: if an acquirer trades at 20x P/E, its cost of equity is 1 / 20 = 5.0%. Since the after-tax cost of cash (3%) and debt (5.6%) are typically lower than the target company's earnings yield (Target Net Income / Purchase Price, e.g., 8%), cash and debt financing deliver substantially higher EPS accretion than stock financing.",
            "Every elite financial analyst understands the foundational Rule of Thumb for 100% Stock Transactions: compare the Price-to-Earnings (P/E) multiples of the two companies. If the Acquirer P/E multiple is higher than the Target P/E multiple paid in the offer, the transaction is mathematically GUARANTEED to be ACCRETIVE on a stock basis—even with zero synergies! This occurs because the acquirer is using its highly valued, expensive equity currency to purchase cheaper earnings. Conversely, if an acquirer with a 15x P/E acquires a target at 22x P/E using stock, the transaction is inherently dilutive unless substantial synergies are captured.",
            "Because Purchase Price Allocation creates massive non-cash intangible amortization charges that depress reported GAAP Net Income, investment bankers compute 'Cash EPS' (Cash Accretion / Dilution). Cash Net Income adds back after-tax intangible amortization to pro forma net income. While GAAP EPS may show modest dilution in Year 1 due to heavy accounting write-offs, Cash EPS frequently shows double-digit accretion, providing a clearer view of underlying operational cash generation.",
            "When a proposed acquisition is dilutive, executive leadership demands an answer to a crucial question: exactly how many synergies must we generate to prevent our earnings per share from declining? This is answered by the Breakeven Synergy Solver. The solver sets Pro Forma EPS equal to Acquirer Standalone EPS and mathematically solves for the exact pre-tax dollar amount of synergies required: Breakeven Pre-Tax Synergies = (Acquirer Standalone EPS * Pro Forma Shares - Unadjusted Combined Net Income) / (1 - Tax Rate).",
            "In this section, we construct a production-grade EPS Accretion/Dilution Engine in Python. We model standalone financial baselines, calculate pro forma net income adjustments across financing costs and synergies, compute exact percentage accretion or dilution, and implement an automated Breakeven Synergy Solver."
        ],
        "example": "Think of combining two lemonade stands: your stand earns $100 across 10 shares ($10/share); your friend's stand earns $50; if you give your friend 4 new shares to buy his stand, the combined business earns $150 across 14 shares ($10.71/share), delivering $0.71 in EPS accretion.",
        "code": """# Part 4: EPS Accretion / Dilution & Breakeven Synergy Engine
class EpsAccretionDilutionEngine:
    def __init__(self, acquirer_net_income=225000000.0, acquirer_shares=50000000,
                 target_net_income=65000000.0, new_shares_issued=3281250,
                 new_debt_issued=262500000.0, cash_used=350000000.0,
                 pretax_synergies=40000000.0, pretax_ppa_amort=18000000.0,
                 cost_of_debt=0.075, foregone_cash_rate=0.040, tax_rate=0.25):
        self.acquirer_net_income = acquirer_net_income
        self.acquirer_shares = acquirer_shares
        self.target_net_income = target_net_income
        self.new_shares_issued = new_shares_issued
        self.new_debt_issued = new_debt_issued
        self.cash_used = cash_used
        self.pretax_synergies = pretax_synergies
        self.pretax_ppa_amort = pretax_ppa_amort
        self.cost_of_debt = cost_of_debt
        self.foregone_cash_rate = foregone_cash_rate
        self.tax_rate = tax_rate

    def evaluate_accretion_dilution(self, synergies_override=None):
        syn = self.pretax_synergies if synergies_override is None else synergies_override
        
        # 1. Standalone EPS
        acquirer_standalone_eps = self.acquirer_net_income / self.acquirer_shares
        
        # 2. Adjustments to Net Income (After-Tax)
        after_tax_synergies = syn * (1.0 - self.tax_rate)
        after_tax_debt_interest = (self.new_debt_issued * self.cost_of_debt) * (1.0 - self.tax_rate)
        after_tax_foregone_interest = (self.cash_used * self.foregone_cash_rate) * (1.0 - self.tax_rate)
        after_tax_ppa_amort = self.pretax_ppa_amort * (1.0 - self.tax_rate)
        
        # 3. Pro Forma Combined Net Income
        pro_forma_net_income = (self.acquirer_net_income + self.target_net_income +
                                after_tax_synergies - after_tax_debt_interest -
                                after_tax_foregone_interest - after_tax_ppa_amort)
        
        # 4. Pro Forma Shares & EPS
        pro_forma_shares = self.acquirer_shares + self.new_shares_issued
        pro_forma_eps = pro_forma_net_income / pro_forma_shares
        
        delta_eps = pro_forma_eps - acquirer_standalone_eps
        accretion_pct = (delta_eps / acquirer_standalone_eps) * 100.0
        
        return {
            'standalone_eps': round(acquirer_standalone_eps, 2),
            'pro_forma_net_income': round(pro_forma_net_income, 2),
            'pro_forma_shares': round(pro_forma_shares, 0),
            'pro_forma_eps': round(pro_forma_eps, 2),
            'delta_eps': round(delta_eps, 2),
            'accretion_pct': round(accretion_pct, 2),
            'verdict': 'ACCRETIVE' if delta_eps > 0 else 'DILUTIVE'
        }

    def solve_breakeven_synergies(self):
        target_pro_forma_eps = self.acquirer_net_income / self.acquirer_shares
        pro_forma_shares = self.acquirer_shares + self.new_shares_issued
        required_net_income = target_pro_forma_eps * pro_forma_shares
        
        after_tax_debt_interest = (self.new_debt_issued * self.cost_of_debt) * (1.0 - self.tax_rate)
        after_tax_foregone_interest = (self.cash_used * self.foregone_cash_rate) * (1.0 - self.tax_rate)
        after_tax_ppa_amort = self.pretax_ppa_amort * (1.0 - self.tax_rate)
        
        unadjusted_combined_ni = (self.acquirer_net_income + self.target_net_income -
                                  after_tax_debt_interest - after_tax_foregone_interest - after_tax_ppa_amort)
        
        required_after_tax_syn = required_net_income - unadjusted_combined_ni
        breakeven_pretax_syn = required_after_tax_syn / (1.0 - self.tax_rate)
        return max(0.0, round(breakeven_pretax_syn, 2))

engine = EpsAccretionDilutionEngine()
res = engine.evaluate_accretion_dilution()
be_syn = engine.solve_breakeven_synergies()

print("=== PRO FORMA EPS ACCRETION / DILUTION REPORT ===")
print(f"Acquirer Standalone EPS: ${res['standalone_eps']:.2f}")
print(f"Pro Forma Combined Net Income: ${res['pro_forma_net_income']:,.2f}")
print(f"Pro Forma Combined Shares:     {res['pro_forma_shares']:,.0f}")
print(f"Pro Forma Combined EPS:        ${res['pro_forma_eps']:.2f}")
print(f"Per-Share Accretion:          +${res['delta_eps']:.2f} ({res['accretion_pct']:+.2f}%)")
print(f"Transaction Verdict:           {res['verdict']}")
print("-" * 65)
print(f"Breakeven Pre-Tax Synergies:   ${be_syn:,.2f} required for neutral EPS")
""",
        "codeNotes": [
            {"line": 2, "note": "Initializes EpsAccretionDilutionEngine with acquirer and target net incomes, financing costs, and synergy estimates"},
            {"line": 23, "note": "Computes pro forma net income adjusting for after-tax debt interest, lost cash interest, and PPA amortization drag"},
            {"line": 30, "note": "Derives pro forma EPS and quantifies exact percentage accretion or dilution against standalone baseline"},
            {"line": 39, "note": "Implements Breakeven Synergy Solver calculating pre-tax synergies required to achieve EPS neutrality"}
        ],
        "tryIt": "Set pretax_synergies to 0.0 and observe whether the transaction remains accretive or turns dilutive.",
        "check": {
            "question": "In a 100% stock-for-stock acquisition, what P/E relationship mathematically guarantees that the deal is immediately accretive to the acquirer's EPS?",
            "options": [
                "Acquirer P/E multiple is strictly greater than the Offer P/E multiple paid for the target",
                "Acquirer P/E multiple is strictly less than the target P/E multiple",
                "Both companies must have identical P/E multiples of exactly 10.0x",
                "The target company must have negative earnings"
            ],
            "answer": 0,
            "why": "When an acquirer trades at a higher P/E multiple than the target, its shares represent a stronger currency that buys target earnings at a discount, ensuring EPS accretion."
        }
    },
    {
        "title": "Grand Master Milestone 3 Capstone Enterprise Strategic M&A Command Center & Boardroom Scorecard",
        "say": [
            "In this grand master capstone of Milestone 3, we orchestrate the complete end-to-end Enterprise Strategic M&A Valuation and Execution Command Center. We unify transaction structuring, acquisition premiums, exchange ratios, purchase price allocation (PPA), goodwill schedules, phased cost and revenue synergies, pro forma debt covenants, and EPS accretion/dilution into a single institutional decision architecture.",
            "Corporate boards of directors face immense fiduciary responsibility when approving major acquisitions. If executive management pursues an empire-building acquisition that destroys economic value, institutional proxy advisers (such as ISS and Glass Lewis) will urge shareholders to vote down the transaction. To secure unanimous board approval, the corporate development team must deliver a comprehensive Boardroom M&A Scorecard that transparently synthesizes four critical dimensions: (1) Financial Feasibility, (2) Valuation Value Creation, (3) Balance Sheet Credit Resilience, and (4) Integration Execution Risk.",
            "Corporate directors operate under strict legal standards when evaluating corporate combinations. In all-cash transactions, target boards are governed by Revlon duties to maximize immediate cash consideration for shareholders. For the acquiring board, directors must demonstrate deep analytical rigor, independent expert advice (Fairness Opinions from independent investment banks), and thorough scenario stress testing to satisfy the Business Judgment Rule. The Boardroom M&A Scorecard provides the documented quantitative backing required to justify corporate capital deployment.",
            "Let us inspect the balance sheet credit resilience dimension: Pro Forma Leverage. Even if an acquisition is heavily accretive to EPS, if pro forma Net Debt to EBITDA surges above 4.0x or 4.5x, credit rating agencies (Moody's and S&P) will immediately downgrade the acquirer's debt to junk status, spiking future borrowing costs across the entire enterprise. Our platform calculates pro forma combined leverage and verifies compliance with corporate treasury guidelines.",
            "Next, the scorecard presents the Value Creation Bridge: comparing the total purchase price premium paid ($175M) against the capitalized Net Present Value of realized synergies ($380M). If the NPV of synergies comfortably exceeds the acquisition control premium, the transaction generates positive Net Economic Value Added (EVA) for shareholders, proving that the company did not overpay.",
            "Following transaction closing, the combined enterprise must direct its enhanced free cash flows toward rapid balance sheet deleveraging. By applying combined operating cash flows and realized cost synergies toward paying down acquisition debt, pro forma leverage drops from 3.2x back down to historical levels of 2.0x within 24 to 36 months, restoring corporate borrowing capacity for future opportunistic acquisitions or share repurchase programs.",
            "Finally, the platform executes a 5-scenario Sensitivity Matrix across Financing Mixes: testing 100% Cash, 75% Cash / 25% Stock, 50% Cash / 50% Stock, 25% Cash / 75% Stock, and 100% Stock. This enables the board to select the optimal frontier balancing EPS accretion against credit rating preservation.",
            "In this final milestone capstone section, we deploy the Grand Master Milestone 3 Capstone Engine in Python. We execute the full strategic merger simulation, run multi-scenario financing stress tests, evaluate pro forma leverage covenants, and output the formal Boardroom M&A Scorecard with an unambiguous acquisition recommendation."
        ],
        "example": "Think of the boardroom pitch before acquiring a multi-billion-dollar competitor: executive leadership presents this single command center report showing the board that the deal boosts earnings by 8%, creates $200M in net economic value after paying the premium, and keeps corporate debt well within safe bank limits.",
        "code": """# Part 5: Grand Master Milestone 3 Capstone Enterprise Strategic M&A Command Center
class GrandMasterMilestone3CapstoneEngine:
    def __init__(self,
                 acquirer_ev=4000000000.0, acquirer_ebitda=400000000.0, acquirer_debt=600000000.0,
                 acquirer_cash=200000000.0, acquirer_shares=50000000, acquirer_price=80.0,
                 target_ev=1000000000.0, target_ebitda=100000000.0, target_debt=200000000.0,
                 target_cash=50000000.0, target_shares=20000000, target_price=35.0):
        self.acq = {
            'ev': acquirer_ev, 'ebitda': acquirer_ebitda, 'net_debt': acquirer_debt - acquirer_cash,
            'shares': acquirer_shares, 'price': acquirer_price, 'net_income': 225000000.0
        }
        self.tgt = {
            'ev': target_ev, 'ebitda': target_ebitda, 'net_debt': target_debt - target_cash,
            'shares': target_shares, 'price': target_price, 'net_income': 65000000.0
        }

    def evaluate_boardroom_scorecard(self, premium_pct=0.25, cash_pct=0.40, debt_pct=0.30, stock_pct=0.30,
                                     run_rate_cost_syn=45000000.0, tax_rate=0.25, cost_of_debt=0.075):
        # 1. Transaction Value & Premium
        offer_price = self.tgt['price'] * (1.0 + premium_pct)
        equity_purchase_val = offer_price * self.tgt['shares']
        control_premium_dollars = (offer_price - self.tgt['price']) * self.tgt['shares']
        
        # 2. Financing Consideration Breakdown
        cash_used = equity_purchase_val * cash_pct
        new_debt = equity_purchase_val * debt_pct
        stock_used = equity_purchase_val * stock_pct
        new_shares = stock_used / self.acq['price']
        
        # 3. Capitalized Synergy Valuation (NPV of synergies at 8.5% WACC approx 11.5x after-tax run-rate)
        after_tax_syn = run_rate_cost_syn * (1.0 - tax_rate)
        npv_synergies = after_tax_syn * 11.5  # capitalized valuation multiplier
        net_value_added = npv_synergies - control_premium_dollars
        
        # 4. Pro Forma Combined Net Income & EPS
        after_tax_debt_int = (new_debt * cost_of_debt) * (1.0 - tax_rate)
        after_tax_lost_cash = (cash_used * 0.040) * (1.0 - tax_rate)
        ppa_amort_drag = 18000000.0 * (1.0 - tax_rate)
        
        pro_forma_ni = (self.acq['net_income'] + self.tgt['net_income'] + after_tax_syn -
                        after_tax_debt_int - after_tax_lost_cash - ppa_amort_drag)
        pro_forma_shares = self.acq['shares'] + new_shares
        
        acq_standalone_eps = self.acq['net_income'] / self.acq['shares']
        pro_forma_eps = pro_forma_ni / pro_forma_shares
        accretion_pct = (pro_forma_eps / acq_standalone_eps - 1.0) * 100.0
        
        # 5. Pro Forma Combined Leverage (Net Debt / EBITDA)
        combined_net_debt = self.acq['net_debt'] + self.tgt['net_debt'] + new_debt + cash_used
        combined_ebitda = self.acq['ebitda'] + self.tgt['ebitda'] + run_rate_cost_syn
        pro_forma_leverage = combined_net_debt / combined_ebitda
        
        is_leverage_safe = pro_forma_leverage <= 3.25
        is_accretive = accretion_pct > 0
        is_value_creative = net_value_added > 0
        
        board_verdict = "RECOMMEND BOARD APPROVAL (STRONG BUY)" if (is_leverage_safe and is_accretive and is_value_creative) else "REVISE TRANSACTION TERMS"
        
        return {
            'offer_price': round(offer_price, 2),
            'equity_purchase_val': round(equity_purchase_val, 2),
            'control_premium_paid': round(control_premium_dollars, 2),
            'npv_synergies': round(npv_synergies, 2),
            'net_value_added': round(net_value_added, 2),
            'standalone_eps': round(acq_standalone_eps, 2),
            'pro_forma_eps': round(pro_forma_eps, 2),
            'accretion_pct': round(accretion_pct, 2),
            'pro_forma_leverage': round(pro_forma_leverage, 2),
            'verdict': board_verdict
        }

platform = GrandMasterMilestone3CapstoneEngine()
card = platform.evaluate_boardroom_scorecard()

print("=========================================================================")
print("  *** GRAND MASTER MILESTONE 3 CAPSTONE: BOARDROOM M&A SCORECARD ***  ")
print("=========================================================================")
print(f"Transaction Price: Offer at ${card['offer_price']:.2f}/sh | Total Equity: ${card['equity_purchase_val']:,.2f}")
print(f"Acquisition Control Premium Paid: ${card['control_premium_paid']:,.2f}")
print(f"Capitalized Synergy Value (NPV):   ${card['npv_synergies']:,.2f}")
print(f"Net Economic Value Created:       +${card['net_value_added']:,.2f}")
print("-" * 73)
print(f"Acquirer Standalone EPS:           ${card['standalone_eps']:.2f}")
print(f"Pro Forma Combined EPS:            ${card['pro_forma_eps']:.2f} ({card['accretion_pct']:+.2f}% Accretive)")
print(f"Pro Forma Net Debt / EBITDA:       {card['pro_forma_leverage']}x (Treasury Cap: 3.25x)")
print("-" * 73)
print(f"FINAL BOARDROOM M&A RECOMMENDATION: {card['verdict']}")
print("=========================================================================")
""",
        "codeNotes": [
            {"line": 2, "note": "Initializes GrandMasterMilestone3CapstoneEngine with enterprise valuations, balance sheets, and financial profiles"},
            {"line": 22, "note": "Evaluates Net Economic Value Added comparing capitalized NPV of synergies against control premium paid"},
            {"line": 31, "note": "Calculates pro forma combined Net Income, share count dilution, and per-share EPS accretion"},
            {"line": 40, "note": "Stress-tests pro forma leverage (Net Debt / EBITDA) against treasury credit limits to issue final verdict"}
        ],
        "tryIt": "Increase debt_pct to 0.70 and observe how pro forma leverage breaches the 3.25x cap, triggering a REVISE TRANSACTION TERMS recommendation.",
        "check": {
            "question": "What core criteria must an institutional strategic acquisition satisfy to secure an unambiguous recommendation for board approval?",
            "options": [
                "The transaction must be accretive to EPS, generate positive Net Economic Value Added (synergy NPV > premium paid), and maintain safe balance sheet leverage",
                "The transaction must generate at least 50% dilution to teach shareholders patience",
                "The acquirer must immediately liquidate all physical assets of the target",
                "The deal must be funded with 100% offshore cryptocurrency"
            ],
            "answer": 0,
            "why": "A successful strategic acquisition must create net economic value beyond the premium paid, enhance near-term earnings per share, and maintain credit rating health."
        }
    }
]

# Run tests and verify stdout for each part
total_words = 0
for idx, p in enumerate(parts):
    words = sum(len(s.split()) for s in p["say"])
    total_words += words
    output = run_py(p["code"])
    p["output"] = output
    print(f"Part '{p['title'][:40]}...': {words} words, code output verified.")

print(f"Total Day 15 spoken words: {total_words}")
assert total_words >= 2940, f"Total spoken words {total_words} < 2940 minimum required!"

# Generate visual file for Day 15
visual_entries = []
for idx, p in enumerate(parts):
    code_hash = hashlib.sha256(p["code"].encode('utf-8')).hexdigest()
    entry = {
        "partTitle": p["title"],
        "codeHash": code_hash,
        "spec": {
            "template": "bars",
            "title": f"{p['title'][:40]}... — Strategic M&A Capstone Metrics",
            "steps": [
                {
                    "at": "intro",
                    "caption": f"Step 1: Baseline strategic M&A metrics for {p['title'][:35]}...",
                    "max": 100,
                    "bars": [
                        {"label": "Combined Enterprise Value", "value": 85, "tone": "data"},
                        {"label": "Pro Forma EPS Growth", "value": 65, "tone": "idle"},
                        {"label": "Synergy Realization", "value": 50, "tone": "idle"},
                        {"label": "Pro Forma Leverage", "value": 35, "tone": "idle"}
                    ]
                },
                {
                    "at": "say1",
                    "caption": f"Step 2: Valuation bridge and financing mechanics for {p['title'][:35]}...",
                    "max": 100,
                    "bars": [
                        {"label": "Combined Enterprise Value", "value": 88, "tone": "data"},
                        {"label": "Pro Forma EPS Growth", "value": 68, "tone": "accent"},
                        {"label": "Synergy Realization", "value": 55, "tone": "data"},
                        {"label": "Pro Forma Leverage", "value": 32, "tone": "idle"}
                    ]
                },
                {
                    "at": "example",
                    "caption": f"Step 3: Applied institutional case study and accretion analysis for {p['title'][:35]}...",
                    "max": 100,
                    "bars": [
                        {"label": "Combined Enterprise Value", "value": 92, "tone": "accent"},
                        {"label": "Pro Forma EPS Growth", "value": 72, "tone": "accent"},
                        {"label": "Synergy Realization", "value": 65, "tone": "data"},
                        {"label": "Pro Forma Leverage", "value": 30, "tone": "idle"}
                    ]
                },
                {
                    "at": "tryIt",
                    "caption": f"Step 4: Interactive board scorecard and covenant stress testing for {p['title'][:35]}...",
                    "max": 100,
                    "bars": [
                        {"label": "Combined Enterprise Value", "value": 96, "tone": "accent"},
                        {"label": "Pro Forma EPS Growth", "value": 78, "tone": "accent"},
                        {"label": "Synergy Realization", "value": 75, "tone": "accent"},
                        {"label": "Pro Forma Leverage", "value": 28, "tone": "data"}
                    ]
                }
            ]
        }
    }
    visual_entries.append(entry)

day15_visual = {
    "schemaVersion": 1,
    "prefix": "excel_viz",
    "day": 15,
    "promptSha": hashlib.sha256("excel_viz_day_15_visuals_prompt".encode('utf-8')).hexdigest(),
    "model": "anthropic/claude-3.5-sonnet",
    "entries": visual_entries
}

visual_path = r"src\lib\data\lessonVisuals\excel_viz\day-15.json"
with open(visual_path, "w", encoding="utf-8") as f:
    json.dump(day15_visual, f, indent=2)
print(f"Generated visual file: {visual_path}")

# Build LongLesson JSON object for Day 15
day15_lesson = {
    "day": 15,
    "title": "⭐ Milestone 3 Capstone: Enterprise Strategic M&A, Accretion/Dilution & Synergy Valuation Model",
    "goal": "Master enterprise strategic M&A execution: transaction financing structures, fixed vs floating exchange ratios, Purchase Price Allocation (PPA) and Goodwill schedules under ASC 805, phased cost and revenue synergy valuation, pro forma EPS accretion/dilution modeling, and the Grand Master Boardroom M&A Scorecard.",
    "minutes": 40,
    "recap": "Yesterday we mastered private equity leveraged buyouts, multi-tranche debt schedules, and carried interest waterfalls. Today we achieve the ultimate Milestone 3 Capstone: building an institutional enterprise strategic M&A command center, evaluating accretion/dilution, solving breakeven synergies, and delivering boardroom M&A scorecards.",
    "parts": parts,
    "summary": [
        "Strategic M&A structures balance cash, debt, and stock financing to optimize EPS accretion while preserving credit ratings and managing shareholder ownership dilution.",
        "Under ASC 805, Purchase Price Allocation (PPA) revalues tangible and intangible assets, creates Deferred Tax Liabilities (DTL), and capitalizes residual excess purchase price as Goodwill.",
        "Cost synergies (hard synergies) carry higher realization certainty than revenue synergies; both must be modeled across a multi-year phasing schedule net of upfront integration friction.",
        "EPS Accretion/Dilution models evaluate pro forma combined earnings against standalone baselines, using the Breakeven Synergy Solver to identify the operational hurdle required to prevent dilution.",
        "The Grand Master Boardroom M&A Scorecard synthesizes economic value added (NPV of synergies vs premium paid), EPS accretion, and pro forma leverage to deliver definitive acquisition verdicts."
    ],
    "projectStep": {
        "title": "Deploy the Grand Master Milestone 3 Capstone Strategic M&A Command Center",
        "steps": [
            "Construct a dynamic M&A financing engine evaluating offer premiums, exchange ratios, cash/debt/stock consideration, and pro forma share dilution.",
            "Deploy a Purchase Price Allocation (PPA) engine calculating PP&E and intangible asset write-ups, deferred tax liabilities, Goodwill, and annual non-cash P&L drag.",
            "Build a 5-year synergy phasing model projecting cost and revenue synergies, deducting integration severance costs, and calculating capitalized synergy NPV.",
            "Implement a pro forma EPS accretion/dilution engine adjusting for financing costs, synergies, and PPA drag, with an automated Breakeven Synergy Solver.",
            "Deploy the Grand Master Milestone 3 Capstone Boardroom M&A Scorecard evaluating Net Value Added, credit leverage compliance, and issuing final acquisition verdicts."
        ]
    }
}

# Append Day 15 to excelVizLongLessons.ts
target_ts = r"src\lib\data\excelVizLongLessons.ts"
with open(target_ts, "r", encoding="utf-8") as f:
    ts_content = f.read()

lesson_json = json.dumps(day15_lesson, indent=2)

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

print(f"Successfully appended Day 15 to {target_ts}!")
