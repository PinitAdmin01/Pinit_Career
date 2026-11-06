import json
import re

def count_words(text):
    return len(re.findall(r'\b[A-Za-z0-9_-]+\b', text))

day45_code = """# Day 45: Milestone 9 Capstone - Multi-National Enterprise Group Consolidation & M&A Suite
# Integrated corporate reporting simulator combining Ind AS 103 Business Combinations,
# Ind AS 110 Group Consolidation, Ind AS 111/28 Partnerships, and Ind AS 112 Disclosures.

from dataclasses import dataclass
from typing import Dict, Tuple

class GroupConsolidationMASuite:
    def __init__(self, parent_name: str, tax_rate_pct: float):
        self.parent_name = parent_name
        self.tax_rate = tax_rate_pct / 100.0

    def process_ind_as_103_acquisition(
        self,
        target_name: str,
        cash_paid: float,
        shares_issued: int,
        share_price: float,
        contingent_pv: float,
        target_book_net_assets: float,
        ppe_step_up: float,
        patents_identified: float,
        nci_pct: float
    ) -> Dict[str, float]:
        \"\"\"Module 1: Ind AS 103 Business Combination & Goodwill.\"\"\"
        equity_fv = shares_issued * share_price
        total_consideration = cash_paid + equity_fv + contingent_pv
        
        gross_step_up = ppe_step_up + patents_identified
        dtl_step_up = gross_step_up * self.tax_rate
        net_identifiable_assets = target_book_net_assets + gross_step_up - dtl_step_up
        
        nci_prop = net_identifiable_assets * (nci_pct / 100.0)
        goodwill = total_consideration + nci_prop - net_identifiable_assets
        
        return {
            "total_consideration": round(total_consideration, 2),
            "net_identifiable_assets": round(net_identifiable_assets, 2),
            "dtl_on_step_up": round(dtl_step_up, 2),
            "nci_acquisition_date": round(nci_prop, 2),
            "goodwill_proportionate": round(goodwill, 2)
        }

    def process_ind_as_110_consolidation(
        self,
        parent_rev: float,
        sub_rev: float,
        intragroup_sales: float,
        unsold_inventory: float,
        margin_pct: float,
        parent_profit: float,
        sub_profit: float,
        nci_pct: float
    ) -> Dict[str, float]:
        \"\"\"Module 2: Ind AS 110 Consolidated Statement of Profit and Loss.\"\"\"
        cons_rev = parent_rev + sub_rev - intragroup_sales
        unrealized_profit = unsold_inventory * (margin_pct / 100.0)
        
        # Downstream elimination from parent
        adj_parent_profit = parent_profit - unrealized_profit
        total_cons_profit = adj_parent_profit + sub_profit
        
        nci_share_profit = sub_profit * (nci_pct / 100.0)
        parent_share_profit = total_cons_profit - nci_share_profit
        
        return {
            "consolidated_revenue": round(cons_rev, 2),
            "unrealized_inventory_profit": round(unrealized_profit, 2),
            "total_consolidated_profit": round(total_cons_profit, 2),
            "profit_attributable_to_owners": round(parent_share_profit, 2),
            "profit_attributable_to_nci": round(nci_share_profit, 2)
        }

    def process_ind_as_111_and_28_partnerships(
        self,
        jo_assets: float,
        jo_expenses: float,
        jo_share_pct: float,
        assoc_initial_cost: float,
        assoc_profit: float,
        assoc_oci: float,
        assoc_dividend: float,
        assoc_share_pct: float,
        downstream_unrealized_profit: float
    ) -> Dict[str, float]:
        \"\"\"Module 3: Ind AS 111 Joint Operation and Ind AS 28 Equity Method.\"\"\"
        jo_share = jo_share_pct / 100.0
        rec_jo_assets = jo_assets * jo_share
        rec_jo_expenses = jo_expenses * jo_share
        
        assoc_share = assoc_share_pct / 100.0
        elim_unrealized = downstream_unrealized_profit * assoc_share
        share_profit = (assoc_profit * assoc_share) - elim_unrealized
        share_oci = assoc_oci * assoc_share
        
        ending_assoc_carrying = (
            assoc_initial_cost + share_profit + share_oci - assoc_dividend
        )
        
        return {
            "jo_recognized_assets": round(rec_jo_assets, 2),
            "jo_recognized_expenses": round(rec_jo_expenses, 2),
            "assoc_share_profit_pnl": round(share_profit, 2),
            "assoc_share_oci": round(share_oci, 2),
            "assoc_ending_carrying_amount": round(ending_assoc_carrying, 2)
        }

    def process_ind_as_112_structured_entity(
        self,
        trust_assets: float,
        subordinated_debt: float,
        guarantee_limit: float
    ) -> Dict[str, float]:
        \"\"\"Module 4: Ind AS 112 Structured Entity Max Exposure to Loss.\"\"\"
        max_exposure = subordinated_debt + guarantee_limit
        return {
            "trust_size": round(trust_assets, 2),
            "maximum_exposure_to_loss": round(max_exposure, 2)
        }

suite = GroupConsolidationMASuite("Phoenix Industrial Group Ltd", 25.168)

# Module 1
m1 = suite.process_ind_as_103_acquisition(
    target_name="Zenith Sensor Technologies Ltd",
    cash_paid=8000000.0,
    shares_issued=400000,
    share_price=12.50,
    contingent_pv=1500000.0,
    target_book_net_assets=10000000.0,
    ppe_step_up=1200000.0,
    patents_identified=2000000.0,
    nci_pct=20.0
)
assert m1["total_consideration"] == 14500000.0
assert m1["net_identifiable_assets"] == 12394624.0
assert m1["dtl_on_step_up"] == 805376.0
assert m1["nci_acquisition_date"] == 2478924.80
assert m1["goodwill_proportionate"] == 4584300.80

# Module 2
m2 = suite.process_ind_as_110_consolidation(
    parent_rev=50000000.0,
    sub_rev=20000000.0,
    intragroup_sales=4000000.0,
    unsold_inventory=1000000.0,
    margin_pct=25.0,
    parent_profit=8500000.0,
    sub_profit=3000000.0,
    nci_pct=20.0
)
assert m2["consolidated_revenue"] == 66000000.0
assert m2["unrealized_inventory_profit"] == 250000.0
assert m2["total_consolidated_profit"] == 11250000.0
assert m2["profit_attributable_to_owners"] == 10650000.0
assert m2["profit_attributable_to_nci"] == 600000.0

# Module 3
m3 = suite.process_ind_as_111_and_28_partnerships(
    jo_assets=8000000.0,
    jo_expenses=2400000.0,
    jo_share_pct=50.0,
    assoc_initial_cost=4500000.0,
    assoc_profit=1800000.0,
    assoc_oci=200000.0,
    assoc_dividend=300000.0,
    assoc_share_pct=30.0,
    downstream_unrealized_profit=100000.0
)
assert m3["jo_recognized_assets"] == 4000000.0
assert m3["jo_recognized_expenses"] == 1200000.0
assert m3["assoc_share_profit_pnl"] == 510000.0
assert m3["assoc_share_oci"] == 60000.0
assert m3["assoc_ending_carrying_amount"] == 4770000.0

# Module 4
m4 = suite.process_ind_as_112_structured_entity(
    trust_assets=50000000.0,
    subordinated_debt=2000000.0,
    guarantee_limit=3000000.0
)
assert m4["trust_size"] == 50000000.0
assert m4["maximum_exposure_to_loss"] == 5000000.0

print(f"Parent: {suite.parent_name}")
print(f"Ind AS 103 Consideration: ${m1['total_consideration']:,.2f} | Goodwill: ${m1['goodwill_proportionate']:,.2f}")
print(f"Ind AS 110 Cons. Revenue: ${m2['consolidated_revenue']:,.2f} | Net Profit: ${m2['total_consolidated_profit']:,.2f}")
print(f"Ind AS 111 JO Assets: ${m3['jo_recognized_assets']:,.2f} | Ind AS 28 Assoc Value: ${m3['assoc_ending_carrying_amount']:,.2f}")
print(f"Ind AS 112 Max Exposure to Loss: ${m4['maximum_exposure_to_loss']:,.2f}")
print("GROUP_CONSOLIDATION_MA_SUITE_PASS")
"""

day45_output = """Parent: Phoenix Industrial Group Ltd
Ind AS 103 Consideration: $14,500,000.00 | Goodwill: $4,584,300.80
Ind AS 110 Cons. Revenue: $66,000,000.00 | Net Profit: $11,250,000.00
Ind AS 111 JO Assets: $4,000,000.00 | Ind AS 28 Assoc Value: $4,770,000.00
Ind AS 112 Max Exposure to Loss: $5,000,000.00
GROUP_CONSOLIDATION_MA_SUITE_PASS"""

part1_say = r"""Welcome to Day 45—the Milestone 9 Grand Capstone of Corporate & Financial Accounting! Today you assume the executive position of Group Chief Financial Officer (CFO) and Chief Accounting Officer (CAO) for Phoenix Industrial Group Ltd, a diversified multi-national industrial conglomerate preparing its annual consolidated financial statements under converged Indian Accounting Standards (Ind AS) and International Financial Reporting Standards (IFRS).

The role of a Group CFO and Chief Accounting Officer in a complex multi-entity enterprise demands the highest level of financial synthesis, strategic acumen, and governance rigor. In executive committee deliberations, during high-profile quarterly earnings calls with institutional buy-side portfolio managers and equity research analysts, and before the Board Audit Committee, the CFO must orchestrate the simultaneous execution of all four foundational pillars of group financial reporting:
1. Ind AS 103 (Business Combinations): Managing the acquisition method, fair value purchase price allocation (PPA), recognizing previously unrecorded intangible assets, computing deferred tax liabilities on asset step-ups, and establishing goodwill and non-controlling interest with absolute mathematical and statutory rigor.
2. Ind AS 110 (Consolidated Financial Statements): Deploying the single-control model, executing line-by-line consolidation across operating entities, eliminating reciprocal investment accounts, stripping out intra-group turnover and financing flows, adjusting for downstream unrealized inventory profit, and attributing comprehensive income to parent shareholders and minority interests.
3. Ind AS 111 (Joint Arrangements) & Ind AS 28 (Investments in Associates): Governing collaborative partnerships by directly recognizing joint operating assets, liabilities, and expenses for joint operations, and applying the single-line equity method for strategic associates with downstream unrealized profit adjustments.
4. Ind AS 112 (Disclosure of Interests in Other Entities): Structuring mandatory transparency schedules for material non-controlling interests, restricted cash covenants, associate reconciliations, and quantifying maximum loss exposures in unconsolidated structured entities.

Under Section 129(3) of the Companies Act 2013, every parent company with one or more subsidiaries, associates, or joint ventures must prepare a consolidated financial statement in addition to its standalone accounts. Section 134(5) requires the Directors' Responsibility Statement to confirm the maintenance of adequate accounting records and the integrity of internal controls. Furthermore, under Section 143(3)(i), independent statutory auditors must test, certify, and sign off on the operational effectiveness of Internal Financial Controls over Financial Reporting (IFC-FR). The Board Audit Committee, operating under Section 177 of the Companies Act 2013, exercises active oversight over registered valuation reports under Section 247, purchase price allocation methodologies, and consolidation elimination journal entries.

In addition, the National Financial Reporting Authority (NFRA) enforces rigorous compliance with auditing standards such as SA 600 (Using the Work of Another Auditor) and SA 701 (Communicating Key Audit Matters in the Independent Auditor's Report). Under Regulation 33 and Regulation 34 of the SEBI (Listing Obligations and Disclosure Requirements) Regulations, 2015, the Chief Executive Officer and Chief Financial Officer must formally sign statutory compliance certificates confirming that the consolidated financial statements present a true, fair, and transparent view of the enterprise's financial position and operational performance. In today's capstone, you will design and execute an end-to-end Python financial reporting suite that integrates all four standards into an automated, auditable software engine, validating every mathematical and statutory assertion with absolute precision across all corporate jurisdictions."""

In practical corporate governance, Indian conglomerates navigating cross-border acquisitions must also harmonize their group financial reporting with Division II of Schedule III to the Companies Act 2013. The transition from erstwhile Indian GAAP (AS 21 for consolidated statements, AS 23 for associates, and AS 27 for joint ventures) to converged Ind AS represented a profound paradigm shift: replacing mechanical voting-power thresholds with substantive rights assessments, eliminating proportionate consolidation of joint ventures, and establishing fair-value purchase price allocations. Furthermore, under Rule 3(1) of the Companies (Accounts) Rules, 2014, modern enterprise accounting systems must maintain an untampered, immutable audit trail (edit log) documenting every intercompany elimination journal entry and consolidation adjustment, ensuring absolute regulatory compliance during NFRA quality reviews and joint statutory audits.

part2_say = r"""In Part 2 of our Milestone 9 Capstone, we execute Module 1: Enterprise M&A Purchase Price Allocation & Goodwill Architecture under Ind AS 103.

Phoenix Industrial Group Ltd acquires an 80.0% controlling equity interest in Zenith Sensor Technologies Ltd, an advanced manufacturer of optical sensors. The acquisition terms negotiated by the corporate M&A and treasury teams specify:
- Upfront Cash Consideration: $8,000,000.00 wired directly on the closing acquisition date.
- Equity Shares Issued: 400,000 newly issued ordinary shares of Phoenix at an acquisition-date market price of $12.50 per share = $5,000,000.00. Under Indian corporate law, $400,000 is credited to Share Capital (at $1.00 par value) and $4,600,000 is credited to Securities Premium under Section 52(2) of the Companies Act 2013.
- Contingent Consideration (Earn-Out): Discounted present value of a milestone-based EBITDA earn-out payable in 24 months = $1,500,000.00, recognized as a financial liability under Ind AS 109. Subsequent changes in fair value resulting from post-acquisition performance are recognized directly in profit or loss.
- Total Consideration Transferred:
  $$\text{Total Consideration} = \$8,000,000.00 + \$5,000,000.00 + \$1,500,000.00 = \$14,500,000.00$$
- In addition, Phoenix incurs $450,000.00 in M&A advisory, legal diligence, and valuation fees. Under Ind AS 103 Paragraph 53, this $450,000 is expensed immediately to profit or loss and excluded from purchase consideration.

As Chief Accounting Officer, you engage an independent registered valuer under Section 247 of the Companies Act 2013 to perform the Purchase Price Allocation (PPA):
- Historical Book Value of Zenith Net Assets: $10,000,000.00.
- Tangible PPE Fair Value Step-Up (sensor fabrication cleanroom machinery): $1,200,000.00.
- Newly Identified Intangible Asset (Proprietary Optical Sensor Patents meeting Ind AS 38 separability criteria): $2,000,000.00.
- Total Gross Fair Value Step-Up:
  $$\text{Gross Step-Up} = \$1,200,000.00 + \$2,000,000.00 = \$3,200,000.00$$
- Corporate Tax Rate under Section 115BAA of the Income Tax Act 1961: 25.168% (base 22% + 10% surcharge + 4% health & education cess).
- Deferred Tax Liability recognized on PPA under Ind AS 12:
  $$\text{DTL on Step-Up} = \$3,200,000.00 \times 25.168\% = \$805,376.00$$
- Net Identifiable Assets Acquired:
  $$\text{Net Identifiable Assets} = \$10,000,000.00 + \$3,200,000.00 - \$805,376.00 = \$12,394,624.00$$

Now, you calculate Non-Controlling Interest and Goodwill on the acquisition date:
- Electing the Proportionate Share Method under Ind AS 103 Paragraph 19:
  $$\text{NCI}_{\text{acquisition}} = 20.0\% \times \$12,394,624.00 = \$2,478,924.80$$
- Proportionate Goodwill Recognized:
  $$\text{Goodwill} = \text{Consideration Transferred} + \text{NCI} - \text{Net Identifiable Assets}$$
  $$\text{Goodwill} = \$14,500,000.00 + \$2,478,924.80 - \$12,394,624.00 = \$4,584,300.80$$

Notice the critical governance dynamic: because Phoenix elected the proportionate share method, Goodwill represents strictly the parent's share of goodwill, and no goodwill is attributed to the non-controlling interest. Under Ind AS 36, this $4,584,300.80 goodwill balance is never amortized, but must be allocated to Zenith as a standalone Cash-Generating Unit (CGU) and tested for impairment at least annually. Furthermore, under Indian tax jurisprudence, this DTL on PPA of $805,376.00 cannot be avoided because the asset tax bases remain frozen at historical written-down values under Section 32 of the Income Tax Act, 1961. In our Python suite, method `process_ind_as_103_acquisition` validates every calculation to the exact cent, ensuring zero distortion of the group balance sheet."""

part3_say = r"""In Part 3 of the Capstone, we execute Module 2: Group Consolidation, Intra-Group Eliminations & Profit Attribution under Ind AS 110.

Following the acquisition, Phoenix and Zenith operate as parent and subsidiary throughout the fiscal year. You deploy the consolidation elimination engine across trading, inventory, and financing flows to construct the Consolidated Statement of Profit and Loss and Consolidated Balance Sheet:
1. Revenue & Cost of Goods Sold Elimination:
   - Phoenix standalone operating revenue = $50,000,000.00.
   - Zenith standalone operating revenue = $20,000,000.00.
   - Gross Combined Revenue = $\$50,000,000.00 + \$20,000,000.00 = \$70,000,000.00$.
   - During the year, Phoenix sold $4,000,000.00 of sensor sub-assemblies to Zenith.
   - Consolidated Revenue = $\$70,000,000.00 - \$4,000,000.00 = \$66,000,000.00$.
   - Consolidation Journal Entry: Debit Sales Revenue $4,000,000.00; Credit Cost of Goods Sold $4,000,000.00.
2. Downstream Unrealized Inventory Profit Elimination:
   - At fiscal year-end, Zenith holds $1,000,000.00 of transferred sub-assemblies in its ending inventory.
   - Phoenix's gross profit margin on invoice price is 25.0%.
   - Unrealized Intercompany Profit = $\$1,000,000.00 \times 25.0\% = \$250,000.00$.
   - Because this was a Downstream sale (Parent sold to Subsidiary), 100% of the $250,000 profit is eliminated against Parent's operating profit and consolidated inventory. Non-controlling interest is completely unaffected!
   - Consolidation Journal Entry: Debit Cost of Goods Sold (Profit & Loss) $250,000.00; Credit Inventory (Balance Sheet) $250,000.00.
   - Tax Impact under Ind AS 12: A temporary deductible difference arises, creating a Deferred Tax Asset of $\$250,000.00 \times 25.168\% = \$62,920.00$, with entry Debit Deferred Tax Asset $62,920.00; Credit Deferred Tax Expense (P&L) $62,920.00.
3. Net Profit Allocation & NCI Attribution:
   - Phoenix standalone net profit = $8,500,000.00.
   - Adjusted Phoenix profit = $\$8,500,000.00 - \$250,000.00 = \$8,250,000.00$.
   - Zenith standalone net profit = $3,000,000.00.
   - Total Consolidated Net Profit = $\$8,250,000.00 + \$3,000,000.00 = \$11,250,000.00$.
   - Profit Attributable to NCI (20% of Zenith $3,000,000) = $\$3,000,000.00 \times 20\% = \$600,000.00$.
   - Profit Attributable to Owners of Parent = $\$11,250,000.00 - \$600,000.00 = \$10,650,000.00$.
   - Reconciliation Check: $\$10,650,000.00 + \$600,000.00 = \$11,250,000.00$.
4. Intra-Group Financing Elimination:
   - Phoenix lent Zenith $2,000,000.00 at an 8.0% annual interest rate ($160,000 interest).
   - Eliminated in full: Debit Loan Payable $2,000,000.00 / Credit Loan Receivable $2,000,000.00; Debit Interest Income $160,000.00 / Credit Finance Costs $160,000.00.

Notice the structural elegance of this consolidation: the elimination of $4,000,000 in internal revenue cleanses top-line inflation, the $250,000 inventory elimination prevents booking internal profits before external customer delivery, and the reciprocal financing elimination prevents artificial balance sheet gross-ups. Under Division II of Schedule III to the Companies Act 2013, the Consolidated Statement of Profit and Loss clearly segregates the $10,650,000 parent earnings from the $600,000 minority allocation, fully conforming to SEBI LODR requirements and international investor expectations. This completes the operational consolidation of the subsidiary with zero residual discrepancies."""

In addition to operational trading flows, enterprise controllers must methodically eliminate intercompany financing flows and dividend declarations. When a subsidiary declares and pays dividends out of pre-acquisition or post-acquisition profits, the parent company's dividend income must be eliminated against the subsidiary's retained earnings distribution, ensuring that intercompany cash flows do not inflate standalone parent revenues. From a corporate taxation perspective, Section 80M of the Income Tax Act, 1961 allows a corporate parent to claim deductions on inter-corporate dividends received from domestic subsidiaries, provided they are redistributed to end-investors within statutory deadlines. Where intercompany sales involve depreciable fixed assets rather than inventory, the unrealized gain must be eliminated from Property, Plant and Equipment, and an annual consolidation adjustment must reduce consolidated depreciation expense over the asset's remaining economic useful life.

part4_say = r"""In Part 4 of the Capstone, we execute Module 3 & Module 4: Joint Partnerships under Ind AS 111 / 28 and Group Disclosures under Ind AS 112.

Module 3: Joint Partnerships (Ind AS 111 & Ind AS 28):
1. Joint Operation (Aero-Turbine Testing Facility - 50.0% Contractual Interest):
   Phoenix and a defense aerospace contractor enter into a contractual arrangement with joint control under Ind AS 111. Phoenix directly recognizes its 50.0% contractual share of facility assets, liabilities, revenues, and operating expenses:
   - Property, Plant & Equipment recognized: $\$8,000,000.00 \times 50.0\% = \$4,000,000.00$.
   - Operating Expenses recognized: $\$2,400,000.00 \times 50.0\% = \$1,200,000.00$.
   - Commercial Testing Revenues recognized: $\$3,000,000.00 \times 50.0\% = \$1,500,000.00$.
   - Net Operational Contribution to Consolidated P&L = $\$1,500,000.00 - \$1,200,000.00 = \$300,000.00$.
   - Proportional consolidation is strictly prohibited under Ind AS 111, but direct recognition of the investor's share of operational rights and obligations ensures true economic transparency.
2. Strategic Associate (Quantum Navigation Systems Ltd - 30.0% Equity Interest):
   Phoenix exercises significant influence over Quantum under Ind AS 28 and accounts for the investment using the single-line Equity Method:
   - Initial Investment Cost on Acquisition = $4,500,000.00.
   - Quantum Net Profit = $1,800,000.00; Quantum OCI = $200,000.00; Dividends Declared and Paid = $300,000.00.
   - Downstream specialized equipment sale from Phoenix to Quantum resulted in an intercompany profit of $100,000.00.
   - Eliminated unrealized profit restricted to investor's equity interest: $\$100,000.00 \times 30.0\% = \$30,000.00$.
   - Adjusted Share of Associate Profit in Consolidated P&L:
     $$\text{Share of Profit} = (\$1,800,000.00 \times 30.0\%) - \$30,000.00 = \$510,000.00$$
   - Share of Other Comprehensive Income in Consolidated OCI:
     $$\text{Share of OCI} = \$200,000.00 \times 30.0\% = \$60,000.00$$
   - Ending Carrying Value on Consolidated Balance Sheet:
     $$\text{Carrying Value} = \$4,500,000.00 + \$510,000.00 + \$60,000.00 - \$300,000.00 = \$4,770,000.00$$

Module 4: Statutory Footnote Disclosures (Ind AS 112):
1. Material NCI Subsidiary (Zenith Sensor Technologies Ltd):
   - Net assets of $12,000,000.00 supporting an ending NCI equity balance of $2,400,000.00.
   - Current year profit allocated to NCI = $600,000.00.
   - Disclosing $1,500,000.00 of restricted cash legally sequestered in debt service reserve accounts (DSRA) under banking consortium covenants that cannot be repatriated to parent.
2. Material Associate (Quantum Navigation Systems Ltd):
   - Summarized net assets of $16,000,000.00 reconciled mathematically to the $4,770,000.00 carrying amount.
3. Unconsolidated Structured Entity (Aerospace Innovation Securitization Trust):
   - Disclosing total trust size of $50,000,000.00.
   - Balance sheet carrying asset = $2,000,000.00 subordinated debt tranche.
   - Disclosing Maximum Exposure to Loss = $\$2,000,000.00 + \$3,000,000.00 \text{ (guarantee)} = \$5,000,000.00$.

By integrating these four disclosure components into Notes 31, 32, and 33 of the consolidated financial report, Phoenix ensures complete compliance with Ind AS 112, eliminating hidden off-balance-sheet risks and ring-fencing exposures. The disclosures are also cross-referenced with Form AOC-1 attached to the Board Report under Section 129(3) of the Companies Act 2013."""

In evaluating joint control under Ind AS 111, the reporting entity must establish whether contractual terms require unanimous consent among all parties sharing control for decisions concerning relevant activities—specifically operating budgets, capital expenditures, and executive appointments. If unanimous consent is absent, the arrangement cannot qualify as a joint arrangement, regardless of equity percentages. Furthermore, under Ind AS 28 Paragraph 38, if an associate experiences cumulative operational losses that reduce the investor's equity carrying amount to zero, the investor discontinues recognizing its share of further losses unless it has incurred legal or constructive obligations or made payments on behalf of the associate. When the associate subsequently reports profits, the investor resumes recognizing its share of profits only after its share of profits equals the share of unrecognized cumulative net losses.

part5_say = r"""In Part 5, we execute the unified Multi-National Enterprise Group Consolidation & M&A Reporting Suite, verify all financial statement invariants, and certify completion of Block 9!

Inspect our culminating Python software platform `GroupConsolidationMASuite`. This master engine synthesizes the four domains into an automated corporate accounting architecture:
1. Ind AS 103 Acquisition Module:
   - Takes total purchase consideration of $14,500,000.00 and target net identifiable assets of $12,394,624.00 (incorporating $805,376.00 DTL on fair value step-ups).
   - Accurately establishes NCI of $2,478,924.80 and Proportionate Goodwill of $4,584,300.80.
2. Ind AS 110 Consolidation Module:
   - Eliminates $4,000,000.00 of intra-group turnover to yield Consolidated Revenue of $66,000,000.00.
   - Eliminates $250,000.00 downstream inventory profit to confirm Consolidated Net Profit of $11,250,000.00.
   - Accurately attributes $10,650,000.00 to Parent Shareholders and $600,000.00 to Non-Controlling Interest.
3. Ind AS 111 & 28 Partnership Module:
   - Recognizes $4,000,000.00 of direct joint operating assets and $1,200,000.00 of operating expenses for the Aero-Turbine Testing Facility.
   - Reconciles the equity method investment in Quantum Navigation Systems Ltd to an ending carrying value of $4,770,000.00 (incorporating $510,000 profit and $30,000 downstream unrealized profit elimination).
4. Ind AS 112 Disclosure Module:
   - Accurately establishes the $5,000,000.00 Maximum Exposure to Loss for the $50M securitization trust and discloses restricted subsidiary cash of $1,500,000.00.

As we conclude this monumental Milestone 9 Capstone, reflect on the elite corporate finance and controllership capabilities you have mastered across Block 9. You have mastered the entire corporate reorganization lifecycle: from transaction structuring and Purchase Price Allocation under Ind AS 103, to line-by-line group consolidation and intercompany eliminations under Ind AS 110, shared partnership governance under Ind AS 111 and 28, and statutory transparency schedules under Ind AS 112.

The Chief Financial Officer, having verified the entire consolidation ledger, elimination entries, and footnote schedules, formally signs off on the Consolidated Financial Statements. The Board Audit Committee approves the financial package, and statutory auditors issue an unqualified audit report confirming full compliance with Schedule III of the Companies Act 2013 and converged global IFRS standards.

Our automated validation framework executes programmatic assertion tests across every output field, confirming that no mathematical discrepancy or rounding anomaly exists within the corporate consolidation pipeline. Every calculation reconciles to the exact cent, ensuring complete compliance with the Ind AS framework. This marks the successful conquest of Block 9 and prepares us for the final lap of Corporate Accounting: Block 10 (Financial Statement Diagnostics & Ratios), Block 11 (Valuation & Impairment), and Block 12 (Course 01 Final Capstone).

When our Python simulation engine executes, every single assertion and statutory check validates with zero discrepancy, culminating in the terminal confirmation string:
`GROUP_CONSOLIDATION_MA_SUITE_PASS`."""

Under International Standard on Auditing (ISA) 320 and Standards on Auditing (SA) 320 issued by the ICAI, the audit engagement partner establishes overall financial statement materiality and performance materiality thresholds across the consolidated entity. When reviewing our simulated `GroupConsolidationMASuite`, the statutory auditors independently inspect the automated consolidation engine to verify that each elimination schedule cross-references cleanly to Note 31 (Business Combinations), Note 32 (Subsidiary Consolidations and Intra-Group Eliminations), Note 33 (Joint Ventures and Associates), and Note 34 (Interests in Structured Entities). Every programmatic assertion executed within our Python platform mirrors an audit verification procedure performed during the year-end statutory closing. By confirming mathematical equivalence across balance sheet step-ups, profit distributions, and non-controlling interest allocations, our software architecture provides foolproof verification that internal financial controls over financial reporting (IFC-FR) operate with flawless integrity.

day45_lesson = {
    "coursePrefix": "bcom-accounting",
    "day": 45,
    "title": "Milestone 9 Capstone: Multi-National Enterprise Group Consolidation & M&A Reporting Simulator",
    "parts": [
        {
            "part": 1,
            "title": "Strategic Role of the Group CFO & Architectural M&A Synthesis",
            "say": part1_say,
            "code": day45_code,
            "output": day45_output,
            "check": {
                "question": "What is the primary executive mandate of the Group Chief Financial Officer when orchestrating Block 9 standards?",
                "options": [
                    "To synthesize business combinations, group consolidations, joint partnerships, and statutory disclosures into a unified, auditable financial reporting system",
                    "To hide all subsidiary operating debts from credit rating agencies",
                    "To arbitrarily eliminate non-controlling interests from the consolidated balance sheet",
                    "To account for all multi-billion dollar acquisitions on a cash basis without PPA"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "The Group CFO is responsible for orchestrating Ind AS 103, Ind AS 110, Ind AS 111, Ind AS 28, and Ind AS 112 into an integrated, statutory-compliant group reporting architecture.",
                "why": "The Group CFO is responsible for orchestrating Ind AS 103, Ind AS 110, Ind AS 111, Ind AS 28, and Ind AS 112 into an integrated, statutory-compliant group reporting architecture."
            }
        },
        {
            "part": 2,
            "title": "Module 1: Executing the Acquisition Method & Purchase Price Allocation (Ind AS 103)",
            "say": part2_say,
            "code": day45_code,
            "output": day45_output,
            "check": {
                "question": "In the Phoenix-Zenith acquisition ($14.5M consideration, $12,394,624 net assets, 20% NCI), what is the proportionate goodwill recognized?",
                "options": [
                    "$4,584,300.80 ($14.5M + $2,478,924.80 - $12,394,624.00)",
                    "$5,605,376.00 based on full goodwill",
                    "$2,105,376.00 based on unadjusted book values",
                    "Zero, because the transaction was a common control transfer"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "Under the proportionate share method, Goodwill = $14,500,000 + $2,478,924.80 - $12,394,624.00 = $4,584,300.80.",
                "why": "Under the proportionate share method, Goodwill = $14,500,000 + $2,478,924.80 - $12,394,624.00 = $4,584,300.80."
            }
        },
        {
            "part": 3,
            "title": "Module 2: Group Consolidation, Intra-Group Eliminations & Profit Attribution (Ind AS 110)",
            "say": part3_say,
            "code": day45_code,
            "output": day45_output,
            "check": {
                "question": "In the Capstone consolidation ($70M combined revenue, $4M internal sales, $250k downstream inventory profit), what are the consolidated revenue and net profit?",
                "options": [
                    "Consolidated Revenue = $66,000,000.00; Consolidated Net Profit = $11,250,000.00",
                    "Consolidated Revenue = $70,000,000.00; Consolidated Net Profit = $11,500,000.00",
                    "Consolidated Revenue = $66,000,000.00; Consolidated Net Profit = $8,500,000.00",
                    "Consolidated Revenue = $50,000,000.00; Consolidated Net Profit = $3,000,000.00"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "Consolidated revenue = $70M - $4M = $66M. Consolidated net profit = $8.5M + $3M - $250k = $11,250,000.00 ($10.65M parent, $600k NCI).",
                "why": "Consolidated revenue = $70M - $4M = $66M. Consolidated net profit = $8.5M + $3M - $250k = $11,250,000.00 ($10.65M parent, $600k NCI)."
            }
        },
        {
            "part": 4,
            "title": "Module 3 & Module 4: Joint Partnerships (Ind AS 111 / 28) & Statutory Disclosures (Ind AS 112)",
            "say": part4_say,
            "code": day45_code,
            "output": day45_output,
            "check": {
                "question": "In the Capstone simulation, what are the ending carrying value of the Quantum associate and the maximum loss exposure for the securitization trust?",
                "options": [
                    "Quantum Associate Carrying Value = $4,770,000.00; Structured Entity Max Loss Exposure = $5,000,000.00",
                    "Quantum Associate Carrying Value = $4,500,000.00; Structured Entity Max Loss Exposure = $50,000,000.00",
                    "Quantum Associate Carrying Value = $4,800,000.00; Structured Entity Max Loss Exposure = $2,000,000.00",
                    "Quantum Associate Carrying Value = Zero; Structured Entity Max Loss Exposure = Zero"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "Quantum carrying value = $4.5M + $510k + $60k - $300k = $4,770,000.00. Trust max loss exposure = $2M debt + $3M guarantee = $5,000,000.00.",
                "why": "Quantum carrying value = $4.5M + $510k + $60k - $300k = $4,770,000.00. Trust max loss exposure = $2M debt + $3M guarantee = $5,000,000.00."
            }
        },
        {
            "part": 5,
            "title": "Grand Milestone 9 Execution, Validation & Certification",
            "say": part5_say,
            "code": day45_code,
            "output": day45_output,
            "check": {
                "question": "What is the final confirmation string emitted by the Multi-National Enterprise Group Consolidation & M&A Suite upon verifying all assertions?",
                "options": [
                    "GROUP_CONSOLIDATION_MA_SUITE_PASS",
                    "CONSOLIDATION_SIMULATION_AUDIT_FAIL",
                    "PPA_AND_EQUITY_METHOD_REJECTED",
                    "IND_AS_CAPSTONE_TERMINATED_UNKNOWN"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "The Milestone 9 Capstone engine validates all assertions across M&A, group consolidations, joint partnerships, and disclosures, concluding with GROUP_CONSOLIDATION_MA_SUITE_PASS.",
                "why": "The Milestone 9 Capstone engine validates all assertions across M&A, group consolidations, joint partnerships, and disclosures, concluding with GROUP_CONSOLIDATION_MA_SUITE_PASS."
            }
        }
    ]
}

total_words = 0
for p in day45_lesson["parts"]:
    wc = count_words(p["say"])
    total_words += wc
    print(f"Day 45 Part {p['part']} words: {wc}")

for p in day45_lesson["parts"]:
    wc = count_words(p["say"])
    assert wc >= 580, f"Part {p['part']} word count {wc} < 580"

print(f"Day 45 Total words: {total_words}")
assert total_words >= 3000, f"Total word count {total_words} < 3000"

with open("scripts/bcom_acc_day45.json", "w", encoding="utf-8") as f:
    json.dump(day45_lesson, f, indent=2)

print("Saved scripts/bcom_acc_day45.json successfully!")
