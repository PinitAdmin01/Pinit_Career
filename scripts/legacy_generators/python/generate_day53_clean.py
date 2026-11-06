import json
import re

def count_words(text):
    return len(re.findall(r'\b[A-Za-z0-9_-]+\b', text))

with open("scripts/test_day53_code.py", "r", encoding="utf-8") as f:
    day53_code = f.read()

day53_output = """Enterprise: Apex Global Assets Ltd
Level 1 Quoted Equity: $4,500,000.00
Level 2 Matrix Swaps: $12,850,000.00
Level 3 Real Estate: Existing Use $8,500,000.00 | HBU Fair Value $19,500,000.00 | HBU Premium $11,000,000.00
Level 3 Private Equity: DCF Base $15,200,000.00 | -100bps WACC $16,800,000.00 | +100bps WACC $13,850,000.00
Fair Value Hierarchy Distribution:
  - Level 1: $4,500,000.00 (8.65%)
  - Level 2: $12,850,000.00 (24.69%)
  - Level 3: $34,700,000.00 (66.67%)
Total Fair Value Portfolio: $52,050,000.00
IND_AS_113_FAIR_VALUE_MEASUREMENT_PASS"""

part1_say = r"""Welcome to Day 53 of Corporate & Financial Accounting! Today we conquer Indian Accounting Standard 113 (Ind AS 113) and its international counterpart International Financial Reporting Standard 13 (IFRS 13)—Fair Value Measurement.

Unlike other accounting standards that mandate when fair value measurement is required or permitted (such as Ind AS 109 for financial instruments, Ind AS 103 for business combinations, or Ind AS 16/38 for revalued assets), Ind AS 113 does not introduce new fair value requirements. Instead, Ind AS 113 serves as the universal, single-source conceptual framework that defines fair value, establishes a unified framework for measuring fair value, and dictates comprehensive disclosure requirements about fair value measurements across all Indian Accounting Standards.

Under Ind AS 113.9, Fair Value is formally defined as:
$$\text{Fair Value} = \text{The price that would be received to sell an asset or paid to transfer a liability in an orderly transaction between market participants at the measurement date.}$$
This definition embodies several critical, non-negotiable accounting invariants:
1. Exit Price Paradigm: Fair value is explicitly an exit price—the price to sell an asset or transfer a liability from the perspective of a market participant holding the asset or owing the liability. It is NOT an entry price (the price paid to acquire the asset or received to assume the liability). Although in many commercial transactions the entry price equals the exit price on initial recognition, they can diverge significantly when transaction fees, dealer markups, or distressed circumstances occur.
2. Orderly Transaction: The measurement assumes that the transaction to sell the asset or transfer the liability takes place in an orderly manner. An orderly transaction assumes exposure to the market for a period prior to the measurement date to allow for marketing activities that are usual and customary for transactions involving such assets or liabilities; it is not a forced transaction (e.g. a forced liquidation or distress sale).
3. Market Participants Perspective: Fair value is measured using the assumptions that market participants would use when pricing the asset or liability, assuming that market participants act in their economic best interest. It is strictly a market-based measurement, not an entity-specific measurement. An entity's specific intention to hold an asset, proprietary operating synergies, or unique tax situation are disregarded if they are not available to market participants generally.

The Principal Market Primacy Rule (Ind AS 113.16):
A fair value measurement assumes that the transaction to sell the asset or transfer the liability takes place either:
(a) In the principal market for the asset or liability; or
(b) In the absence of a principal market, in the most advantageous market for the asset or liability.
- The Principal Market is defined as the market with the greatest volume and level of activity for the asset or liability. An entity must have access to the principal market at the measurement date.
- Primacy Invariant: If there is a principal market for the asset or liability, the fair value measurement shall represent the price in that market, even if the price in a different market is potentially more advantageous at the measurement date!
- The Most Advantageous Market is the market that maximizes the amount that would be received to sell the asset (or minimizes the amount to transfer the liability), after taking into account transaction costs and transport costs.
- Transaction Costs vs Transport Costs: This distinction is crucial. Transaction costs (brokerage, exchange fees, transfer taxes) are NOT an attribute of an asset or liability; rather, they are specific to a transaction and will differ depending on how an entity enters into a transaction. Therefore, transaction costs do not adjust fair value (they are accounted for in accordance with other standards). In contrast, transport costs (costs necessary to transport an asset from its current location to the market) DO adjust fair value, because location is a physical characteristic of the asset!"""

part2_say = r"""In Part 2 of Day 53, we deconstruct the Highest and Best Use (HBU) valuation premise for non-financial assets under Ind AS 113.27-33.

When measuring the fair value of a non-financial asset (such as vacant land, factory real estate, or commercial buildings), Ind AS 113 introduces a powerful valuation principle that diverges sharply from traditional historical cost accounting: the Highest and Best Use (HBU) requirement.

1. Highest and Best Use Definition (Ind AS 113.27):
   A fair value measurement of a non-financial asset takes into account a market participant's ability to generate economic benefits by using the asset in its highest and best use or by selling it to another market participant that would use the asset in its highest and best use.
   The highest and best use of a non-financial asset takes into account the use of the asset that is:
   (a) Physically Possible: Takes into account the physical characteristics of the asset that market participants would consider (e.g. the topography, size, location, soil stability, and structural capacity of a property).
   (b) Legally Permissible: Takes into account any legal restrictions on the use of the asset that market participants would consider (e.g. zoning regulations, building height codes, historic preservation orders, and environmental protection easements).
   (c) Financially Feasible: Takes into account whether a use of the asset that is physically possible and legally permissible generates adequate income (after considering conversion and construction costs) to produce an investment return that market participants would require.

2. Presumption of Current Use:
   An entity's current use of a non-financial asset is presumed to be its highest and best use unless market or other factors suggest that a different use by market participants would maximize the value of the asset.
   When an alternative use maximizes economic value, fair value must reflect that alternative use, regardless of whether current management intends to continue using the asset in its existing capacity!

3. Case Study: Apex Global Assets Ltd - Metropolitan Tech Parcel:
   - Apex owns a 10-acre industrial site currently operating as a manufacturing warehouse.
   - Scenario A (Existing Industrial Use): Independent valuers evaluate continued warehouse operations using the income approach (discounted net rental flows), yielding a value of $8,500,000.00.
   - Scenario B (Alternative Redevelopment Use): The parcel is located in a rapidly expanding urban technology corridor. Valuers establish that:
     1. Physical possibility: The parcel can support a high-density commercial tech park and retail complex.
     2. Legal permissibility: Municipal zoning authorities recently rezoned the district for commercial mixed-use high-rise construction.
     3. Financial feasibility: Market participants are acquiring adjacent commercial land at $2,200,000.00 per acre, implying a gross commercial land value of:
        $$\text{Gross Commercial Land Value} = 10 \text{ acres} \times \$2,200,000.00 = \$22,000,000.00$$
     - Conversion Costs: However, to realize this commercial value, the existing industrial factory must be demolished, and environmental soil remediation must be performed, incurring total costs of $2,500,000.00.
   - Net Highest and Best Use Fair Value:
     $$\text{HBU Fair Value} = \$22,000,000.00 - \$2,500,000.00 = \$19,500,000.00$$
   - Decision Rule: Because the net redevelopment value of $\$19,500,000.00$ exceeds the existing use value of $\$8,500,000.00$, the Highest and Best Use is commercial redevelopment!
   - Under Ind AS 113, Apex must recognize the fair value of the land at $\$19,500,000.00$, reflecting an HBU premium of $\$11,000,000.00$ ($19.5M - $8.5M). Management cannot artificially depress fair value by citing its personal operational preference to keep the warehouse open."""

part3_say = r"""In Part 3 of Day 53, we evaluate the Three Universal Valuation Techniques and Input Maximization Rules under Ind AS 113.61-66.

An entity shall use valuation techniques that are appropriate in the circumstances and for which sufficient data are available to measure fair value, maximizing the use of relevant observable inputs and minimizing the use of unobservable inputs. Ind AS 113 synthesizes global valuation practice into three primary valuation approaches:

1. The Market Approach (Ind AS 113.B5-B7):
   - The market approach uses prices and other relevant information generated by market transactions involving identical or comparable (i.e. similar) assets, liabilities, or a group of assets and liabilities (such as a business).
   - Valuation techniques consistent with the market approach include:
     (a) Market Multiples: Using valuation multiples derived from a set of comparable publicly traded companies (e.g. Enterprise Value/EBITDA, Price/Earnings, Price/Book Value). Multiples must be adjusted for differences in growth, size, profitability, and geographic risk.
     (b) Matrix Pricing: A mathematical technique used principally to value certain types of financial instruments, such as debt securities, without relying exclusively on quoted prices for the specific securities, but rather relying on the securities' relationship to other benchmark quoted securities (e.g. yield curves, credit ratings, and prepayment speeds).
   - Application: In Apex's portfolio, the 100,000 shares of Blue-Chip NSE Equity are valued using direct active market quotes ($45.00/share = $4.50M). The SOFR Corporate Bond Swap is valued using matrix pricing based on observable SOFR yield curves and BBB credit spreads ($12.85M).

2. The Income Approach (Ind AS 113.B10-B11):
   - The income approach converts future amounts (e.g. cash flows or income and expenses) to a single current (i.e. discounted) amount. When the income approach is used, the fair value measurement reflects current market expectations about those future amounts.
   - Primary Income Techniques:
     (a) Discounted Cash Flow (DCF) Method: Future cash flows are projected over a discrete horizon and discounted back to the measurement date using a market-derived risk-adjusted discount rate (WACC or Cost of Equity).
     (b) Option Pricing Models: Black-Scholes-Merton formula, binomial lattice models, or Monte Carlo simulations that incorporate the time value and volatility of underlying variables (widely used for employee share options, warrants, and embedded convertibles).
     (c) Multi-Period Excess Earnings Method (MPEEM): Used extensively under Ind AS 103/38 to value customer relationships and core technology by isolating cash flows generated by the primary intangible asset after deducting contributory asset charges (CAC) for supporting assets.
   - Application: Apex values its Fintech Private Equity investment using a multi-stage DCF model, establishing a baseline fair value of $15,200,000.00.

3. The Cost Approach (Ind AS 113.B8-B9):
   - The cost approach reflects the amount that would be required currently to replace the service capacity of an asset (often referred to as current replacement cost).
   - From the perspective of a market participant seller, the price that would be received for the asset is based on the cost to a market participant buyer to acquire or construct a substitute asset of comparable utility, adjusted for obsolescence. Obsolescence encompasses physical deterioration, functional (technological) obsolescence, and economic (external) obsolescence.
   - The cost approach is primarily applied to specialized industrial machinery, specialized utility infrastructure, and specialized software where no active market or direct cash flows exist. Under the Depreciated Replacement Cost (DRC) method, the valuer calculates the current cost of constructing or acquiring a modern equivalent asset (MEA), and then deducts deductions for physical deterioration (wear and tear over time), functional obsolescence (inefficiencies relative to modern technology), and economic obsolescence (adverse external economic factors impacting utilization). When multiple valuation techniques are employed, management evaluates the reasonableness of the range of values indicated by those results. A fair value measurement is the point within that range that is most representative of fair value in the circumstances."""

part4_say = r"""In Part 4 of Day 53, we dissect the Three-Tier Fair Value Hierarchy (Levels 1, 2, and 3) and Mandatory Footnote Disclosures under Ind AS 113.72-99.

To increase consistency and comparability in fair value measurements and related disclosures, Ind AS 113 establishes a strict, three-level Fair Value Hierarchy that prioritizes the inputs to valuation techniques used to measure fair value:

1. Level 1 Inputs (Highest Priority):
   - Level 1 inputs are quoted prices (unadjusted) in active markets for identical assets or liabilities that the entity can access at the measurement date.
   - An active market is a market in which transactions for the asset or liability take place with sufficient frequency and volume to provide pricing information on an ongoing basis.
   - Absolute Invariant: A quoted market price in an active market provides the most reliable evidence of fair value and shall be used without adjustment whenever available (with extremely narrow exceptions, such as when an active market price does not represent fair value at the measurement date due to significant events occurring after close of trading).
   - In Apex's portfolio: The NSE quoted blue-chip shares are Level 1 ($4,500,000.00).

2. Level 2 Inputs (Intermediate Priority):
   - Level 2 inputs are inputs other than quoted prices included within Level 1 that are observable for the asset or liability, either directly or indirectly.
   - Level 2 inputs include:
     (a) Quoted prices for similar assets or liabilities in active markets;
     (b) Quoted prices for identical or similar assets or liabilities in markets that are not active;
     (c) Inputs other than quoted prices that are observable for the asset or liability (e.g. interest rates and yield curves observable at commonly quoted intervals, implied volatilities, and credit spreads);
     (d) Market-corroborated inputs (inputs derived principally from or corroborated by observable market data by correlation or other means).
   - In Apex's portfolio: The corporate bond swap valued via SOFR yield curves and observable credit spreads is Level 2 ($12,850,000.00).

3. Level 3 Inputs (Lowest Priority & Maximum Scrutiny):
   - Level 3 inputs are unobservable inputs for the asset or liability. Unobservable inputs shall be used to measure fair value to the extent that relevant observable inputs are not available, thereby allowing for situations in which there is little, if any, market activity for the asset or liability at the measurement date.
   - Unobservable inputs must reflect the assumptions that market participants would use when pricing the asset or liability, including assumptions about risk (risk premiums for forecasting uncertainty).
   - In Apex's portfolio: Both the Highest & Best Use Real Estate Parcel ($19,500,000.00) and the Fintech Private Equity DCF ($15,200,000.00) rely on unobservable inputs (redevelopment assumptions, internal cash flow projections, cost of capital), classifying them as Level 3 ($34,700,000.00 total).

4. Mandatory Disclosure Architecture (Ind AS 113.91-99):
   For recurring fair value measurements categorized within Level 3, the disclosure requirements are extraordinarily comprehensive:
   - Full Roll-Forward Reconciliation: Beginning balances, total gains or losses recognized in P&L and OCI, purchases, sales, issues, settlements, and transfers into or out of Level 3.
   - Quantitative Information about Significant Unobservable Inputs: Disclosing the valuation technique, specific unobservable inputs (e.g. discount rate 15.5%, terminal growth rate 3.0%), and the range/weighted average of those inputs.
   - Sensitivity Analysis: A narrative and quantitative description of the sensitivity of the fair value measurement to changes in unobservable inputs. In Apex's DCF, a 100 bps reduction in WACC expands fair value by $1.60M to $16.80M, while a 100 bps increase contracts fair value by $1.35M to $13.85M. This sensitivity matrix alerts investors to the degree of valuation estimation uncertainty."""

part5_say = r"""In Part 5 of Day 53, we execute our standalone Python software engine `IndAS113FairValueEngine`, verify portfolio balance sheet reconciliations, review statutory audit compliance, and certify completion of Day 53!

Inspect the Python simulation code in the interactive sandbox editor. It encapsulates the full multi-tier fair value hierarchy and valuation suite for Apex Global Assets & Capital Management Ltd:
1. Multi-Asset Portfolio Modeling:
   - Level 1 Asset: 100,000 quoted equity shares at $45.00/share = $4,500,000.00 (Active NSE Market).
   - Level 2 Asset: Corporate bond swap valued via matrix pricing using observable SOFR yield curves and credit spreads = $12,850,000.00.
   - Level 3 Asset (Non-Financial): Metropolitan Tech Parcel evaluated under Highest and Best Use ($22M gross commercial land - $2.5M demolition = $19,500,000.00), demonstrating an $11.0M premium over its $8.5M existing industrial warehouse use.
   - Level 3 Asset (Financial): Fintech Private Equity valued via Income Approach DCF at $15,200,000.00, with automated sensitivity testing showing values of $16,800,000.00 at -100 bps WACC and $13,850,000.00 at +100 bps WACC.
2. Fair Value Hierarchy Aggregation:
   - Level 1 Total: $4,500,000.00 (8.65% of portfolio)
   - Level 2 Total: $12,850,000.00 (24.69% of portfolio)
   - Level 3 Total: $34,700,000.00 ($19.5M real estate + $15.2M PE = 66.67% of portfolio)
   - Consolidated Fair Value Portfolio Total: $52,050,000.00.

Statutory Audit Verification & Independent Valuation Standards:
Statutory auditors auditing fair value measurements operate under Standard on Auditing (SA) 540 (Auditing Accounting Estimates and Related Disclosures) and SA 620 (Using the Work of an Auditor's Expert). The audit engagement team:
- Inspects Level 1 market closing prices from official stock exchange feeds as of the balance sheet date.
- Tests the observable curve inputs for Level 2 derivatives against independent Bloomberg/Refinitiv market pricing data.
- Employs an independent valuation specialist to assess the registered valuer's report for Level 3 assets under Section 247 of the Companies Act 2013, scrutinizing zoning approvals for HBU real estate and testing cash flow discount rates for private equity.
- Verifies that footnote disclosures under Schedule III and Ind AS 113 include the mandatory three-tier hierarchy table, Level 3 roll-forward schedule, and quantitative unobservable input sensitivity table.

Under SEBI (Alternative Investment Funds) Regulations, 2012 and SEBI (Mutual Funds) Regulations, 1996, asset managers must establish independent valuation committees that formally review and approve all Level 3 unobservable valuation models on a monthly and quarterly basis. Furthermore, under CARO 2020 Clause 3(ii), auditors must assess whether management has conducted appropriate physical verification and impairment testing of underlying collateral. In our simulation engine, the sensitivity modeling under Ind AS 113.93(h) provides clear quantitative boundaries: a 100 bps shift in discount rate triggers an asymmetric valuation swing of +$1.60M to -$1.35M. This sensitivity analysis gives the Board Audit Committee and credit rating agencies complete visibility into estimation risk.

Our automated software platform performs deterministic validation checks across each accounting step, ensuring that the trial balance, cash flow statement, and balance sheet reflect exact mathematical harmony. The platform confirms that Level 1 assets represent 8.65% of the total portfolio, Level 2 represents 24.69%, and Level 3 represents 66.67%, perfectly reconciling to the $52,050,000.00 gross fair value. By integrating these fair value metrics directly into executive reporting dashboards, corporate treasurers ensure that institutional investors and regulatory authorities receive transparent, reliable, and fully compliant fair value disclosures. When our Python simulation engine executes, every single assertion and statutory check validates with zero discrepancy, culminating in the terminal confirmation string:
`IND_AS_113_FAIR_VALUE_MEASUREMENT_PASS`."""

day53_lesson = {
    "coursePrefix": "bcom-accounting",
    "day": 53,
    "title": "Ind AS 113 / IFRS 13: Fair Value Measurement (Exit Price, Valuation Techniques, Highest and Best Use & Fair Value Hierarchy)",
    "parts": [
        {
            "part": 1,
            "title": "Ind AS 113 Framework, Exit Price Invariant & Principal vs Most Advantageous Market",
            "say": part1_say,
            "code": day53_code,
            "output": day53_output,
            "check": {
                "question": "How does Ind AS 113 formally define Fair Value, and what is the rule regarding the Principal Market?",
                "options": [
                    "Fair value is an exit price in an orderly transaction between market participants, and the price in the principal market must be used even if another market offers a more advantageous price",
                    "Fair value is the historical cost paid to purchase the asset plus accumulated depreciation",
                    "Fair value is always determined by the price in the most advantageous market regardless of trading volume in other markets",
                    "Fair value is the undiscounted liquidation value forced by bank creditors"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "Ind AS 113 defines fair value as an exit price, and establishes that the price in the principal market must be used whenever an active principal market exists.",
                "why": "Ind AS 113 defines fair value as an exit price, and establishes that the price in the principal market must be used whenever an active principal market exists."
            }
        },
        {
            "part": 2,
            "title": "Highest and Best Use (HBU) for Non-Financial Assets: Physical, Legal & Financial Feasibility",
            "say": part2_say,
            "code": day53_code,
            "output": day53_output,
            "check": {
                "question": "What three cumulative criteria must an alternative use satisfy to be established as the Highest and Best Use (HBU) of a non-financial asset?",
                "options": [
                    "It must be physically possible, legally permissible, and financially feasible",
                    "It must be approved by the tax department, insured against earthquakes, and fully depreciated",
                    "It must be identical to competitor usage, liquid within 24 hours, and paid in foreign currency",
                    "It must have zero conversion costs, government ownership, and guaranteed export subsidies"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "Ind AS 113.28 requires that the highest and best use of a non-financial asset must be physically possible, legally permissible, and financially feasible.",
                "why": "Ind AS 113.28 requires that the highest and best use of a non-financial asset must be physically possible, legally permissible, and financially feasible."
            }
        },
        {
            "part": 3,
            "title": "The Three Valuation Techniques: Market Approach, Income Approach & Cost Approach",
            "say": part3_say,
            "code": day53_code,
            "output": day53_output,
            "check": {
                "question": "Which of the following correctly pairs a valuation technique with its core operational methodology under Ind AS 113?",
                "options": [
                    "Income Approach converts future cash flows to a single current discounted amount using techniques such as DCF or option pricing models",
                    "Cost Approach relies exclusively on active stock exchange quoted prices",
                    "Market Approach estimates replacement cost adjusted for physical deterioration",
                    "Income Approach ignores future cash flows and uses original supplier invoices"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "Under Ind AS 113, the Income Approach converts future amounts (cash flows, earnings) into a single discounted present value using DCF or option pricing techniques.",
                "why": "Under Ind AS 113, the Income Approach converts future amounts (cash flows, earnings) into a single discounted present value using DCF or option pricing techniques."
            }
        },
        {
            "part": 4,
            "title": "The Three-Tier Fair Value Hierarchy (Levels 1, 2, and 3) & Mandatory Disclosures",
            "say": part4_say,
            "code": day53_code,
            "output": day53_output,
            "check": {
                "question": "Under Ind AS 113, what constitutes a Level 1 input in the fair value hierarchy?",
                "options": [
                    "Quoted prices (unadjusted) in active markets for identical assets or liabilities that the entity can access at the measurement date",
                    "Observable yield curves and credit default swap spreads in dealer markets",
                    "Internal management projections of discounted cash flows",
                    "Real estate appraisal estimates based on unobservable capitalization rates"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "Level 1 inputs are strictly unadjusted quoted prices in active markets for identical assets or liabilities that the entity can access at measurement date.",
                "why": "Level 1 inputs are strictly unadjusted quoted prices in active markets for identical assets or liabilities that the entity can access at measurement date."
            }
        },
        {
            "part": 5,
            "title": "Enterprise Ind AS 113 Software Engine, Statutory Footnote Modeling & Day 53 Certification",
            "say": part5_say,
            "code": day53_code,
            "output": day53_output,
            "check": {
                "question": "What is the final confirmation string emitted by the Enterprise Ind AS 113 Fair Value Engine upon verifying all hierarchy and portfolio reconciliations?",
                "options": [
                    "IND_AS_113_FAIR_VALUE_MEASUREMENT_PASS",
                    "FAIR_VALUE_HIERARCHY_RECONCILIATION_ERROR",
                    "HBU_VALUATION_PREMISE_FAILED",
                    "LEVEL3_DISCLOSURE_INCOMPLETE_HALT"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "The simulation engine verifies all fair value hierarchy tiers and concludes by emitting IND_AS_113_FAIR_VALUE_MEASUREMENT_PASS.",
                "why": "The simulation engine verifies all fair value hierarchy tiers and concludes by emitting IND_AS_113_FAIR_VALUE_MEASUREMENT_PASS."
            }
        }
    ]
}

total_words = 0
for p in day53_lesson["parts"]:
    wc = count_words(p["say"])
    total_words += wc
    print(f"Day 53 Part {p['part']} words: {wc}")

for p in day53_lesson["parts"]:
    wc = count_words(p["say"])
    assert wc >= 580, f"Part {p['part']} word count {wc} < 580"

print(f"Day 53 Total words: {total_words}")
assert total_words >= 3000, f"Total word count {total_words} < 3000"

with open("scripts/bcom_acc_day53.json", "w", encoding="utf-8") as f:
    json.dump(day53_lesson, f, indent=2)

print("Saved scripts/bcom_acc_day53.json successfully!")
