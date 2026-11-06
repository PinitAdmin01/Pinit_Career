import json
import re

def count_words(text):
    return len(re.findall(r'\b[A-Za-z0-9_-]+\b', text))

day42_code = """# Day 42: Ind AS 110 Consolidated Financial Statements & Elimination Engine
# Automated group consolidation simulator executing line-by-line aggregation,
# intra-group revenue/COGS eliminations, unrealized inventory profit, and NCI profit attribution.

from dataclasses import dataclass
from typing import Dict, Tuple

class ConsolidatedFinancialStatementsEngine:
    def __init__(self, parent: str, subsidiary: str, ownership_pct: float):
        self.parent = parent
        self.subsidiary = subsidiary
        self.ownership_pct = ownership_pct / 100.0
        self.nci_pct = 1.0 - self.ownership_pct

    def eliminate_intragroup_trading(
        self,
        parent_rev: float,
        sub_rev: float,
        intragroup_sales: float,
        unsold_inventory_at_cost_to_buyer: float,
        gross_profit_margin_pct: float,
        is_downstream: bool = True
    ) -> Dict[str, float]:
        \"\"\"Eliminates intra-group revenue and unrealized inventory profit.\"\"\"
        gross_rev = parent_rev + sub_rev
        elim_rev = gross_rev - intragroup_sales
        unrealized_profit = unsold_inventory_at_cost_to_buyer * (gross_profit_margin_pct / 100.0)
        
        return {
            "combined_revenue_pre_elim": round(gross_rev, 2),
            "consolidated_revenue": round(elim_rev, 2),
            "unrealized_inventory_profit": round(unrealized_profit, 2),
            "is_downstream": is_downstream
        }

    def allocate_consolidated_profit(
        self,
        parent_profit: float,
        sub_profit: float,
        unrealized_profit: float,
        is_downstream: bool = True
    ) -> Dict[str, float]:
        \"\"\"Calculates consolidated profit and attributes to Parent and NCI.\"\"\"
        if is_downstream:
            # Downstream: Parent made profit, so 100% eliminated from parent profit
            adj_parent_profit = parent_profit - unrealized_profit
            adj_sub_profit = sub_profit
        else:
            # Upstream: Sub made profit, so eliminated from sub profit (shared with NCI)
            adj_parent_profit = parent_profit
            adj_sub_profit = sub_profit - unrealized_profit
            
        nci_profit_share = adj_sub_profit * self.nci_pct
        parent_profit_share = adj_parent_profit + (adj_sub_profit * self.ownership_pct)
        total_consolidated_profit = parent_profit_share + nci_profit_share
        
        return {
            "total_consolidated_profit": round(total_consolidated_profit, 2),
            "profit_attributable_to_owners": round(parent_profit_share, 2),
            "profit_attributable_to_nci": round(nci_profit_share, 2)
        }

    def eliminate_intragroup_financing(
        self,
        loan_balance: float,
        annual_interest: float
    ) -> Dict[str, float]:
        \"\"\"Eliminates reciprocal loan balances and interest income/expense.\"\"\"
        return {
            "eliminated_loan_principal": round(loan_balance, 2),
            "eliminated_interest_pnl": round(annual_interest, 2)
        }

engine = ConsolidatedFinancialStatementsEngine("Phoenix Industrial Group Ltd", "Zenith Sensor Technologies Ltd", 80.0)

trade_res = engine.eliminate_intragroup_trading(
    parent_rev=50000000.0,
    sub_rev=20000000.0,
    intragroup_sales=4000000.0,
    unsold_inventory_at_cost_to_buyer=1000000.0,
    gross_profit_margin_pct=25.0,
    is_downstream=True
)
assert trade_res["consolidated_revenue"] == 66000000.0
assert trade_res["unrealized_inventory_profit"] == 250000.0

profit_res = engine.allocate_consolidated_profit(
    parent_profit=8500000.0,
    sub_profit=3000000.0,
    unrealized_profit=trade_res["unrealized_inventory_profit"],
    is_downstream=True
)
assert profit_res["total_consolidated_profit"] == 11250000.0
assert profit_res["profit_attributable_to_nci"] == 600000.0
assert profit_res["profit_attributable_to_owners"] == 10650000.0

fin_res = engine.eliminate_intragroup_financing(
    loan_balance=2000000.0,
    annual_interest=160000.0
)
assert fin_res["eliminated_loan_principal"] == 2000000.0
assert fin_res["eliminated_interest_pnl"] == 160000.0

print(f"Group: {engine.parent} + {engine.subsidiary} (Ownership: 80.0%)")
print(f"Consolidated Revenue: ${trade_res['consolidated_revenue']:,.2f}")
print(f"Unrealized Inventory Profit Eliminated: ${trade_res['unrealized_inventory_profit']:,.2f}")
print(f"Total Consolidated Net Profit: ${profit_res['total_consolidated_profit']:,.2f}")
print(f"Attributable to Owners of Parent: ${profit_res['profit_attributable_to_owners']:,.2f} | NCI Share: ${profit_res['profit_attributable_to_nci']:,.2f}")
print(f"Intragroup Loan Eliminated: ${fin_res['eliminated_loan_principal']:,.2f} | Interest: ${fin_res['eliminated_interest_pnl']:,.2f}")
print("IND_AS_110_CONSOLIDATION_ELIMINATIONS_PASS")
"""

day42_output = """Group: Phoenix Industrial Group Ltd + Zenith Sensor Technologies Ltd (Ownership: 80.0%)
Consolidated Revenue: $66,000,000.00
Unrealized Inventory Profit Eliminated: $250,000.00
Total Consolidated Net Profit: $11,250,000.00
Attributable to Owners of Parent: $10,650,000.00 | NCI Share: $600,000.00
Intragroup Loan Eliminated: $2,000,000.00 | Interest: $160,000.00
IND_AS_110_CONSOLIDATION_ELIMINATIONS_PASS"""

part1_say = r"""Welcome to Day 42 of Corporate & Financial Accounting! Having mastered the Acquisition Method and Purchase Price Allocation under Ind AS 103 in Day 41, today we advance to the operational cornerstone of holding company reporting: Ind AS 110 Consolidated Financial Statements, converged with International Financial Reporting Standard 10 (IFRS 10).

In complex modern conglomerates, holding structures span operating subsidiaries, special purpose entities, financing vehicles, and offshore holding companies. An investor or analyst examining only the standalone financial statements of a parent company sees merely an opaque line item entitled 'Investment in Subsidiaries' measured at cost or fair value under Ind AS 27. Such standalone reporting obscures the underlying operating debt, capital expenditure commitments, revenue growth, and operational risks of the economic group. Consequently, Section 129(3) of the Companies Act 2013 and SEBI Listing Regulations mandate that every company having one or more subsidiaries must prepare Consolidated Financial Statements (CFS) presenting the financial position and performance of the parent and its subsidiaries as a single unified economic entity. Furthermore, companies must attach a statement containing the salient features of the financial statement of their subsidiaries, associates, and joint ventures in Form AOC-1.

At the core of Ind AS 110 lies the unified 'Control Principle'. Under legacy accounting frameworks, consolidation was triggered mechanically by legal ownership of more than 50% of voting equity shares. Ind AS 110 completely replaces this rigid legalistic test with a substance-over-form, single-control model applicable across all entities, including voting-interest entities and structured entities (formerly known as Special Purpose Vehicles).

Under Ind AS 110 Paragraph 7, an investor controls an investee if, and only if, the investor possesses all three of the following cumulative elements:
1. Power over the Investee: The investor possesses existing rights that give it the current ability to direct the 'relevant activities'—defined as the operating, financing, and commercial activities that significantly affect the investee's returns. Power arises from voting rights, contractual arrangements, or potential voting rights (such as currently exercisable share call options or convertible debt). Under Ind AS 110 Paragraph B47, potential voting rights are considered only if they are substantive—meaning the holder has the practical ability to exercise them when decisions about relevant activities need to be made. Substantive rights must be distinguished from merely protective rights (which protect minority lenders or shareholders without granting operational control).
2. Exposure, or Rights, to Variable Returns: The investor has the right to variable economic returns from its involvement with the investee, which can be positive (dividends, interest, capital appreciation, tax synergies) or negative (absorbing operational losses).
3. The Link Between Power and Returns: The investor has the ability to use its power over the investee to affect the amount of the investor's returns. Here, controllers must perform a rigorous 'Principal versus Agent' assessment under Ind AS 110 Paragraph B58. An agent who exercises decision-making power on behalf of other parties does not control the investee! In addition, controllers must evaluate 'de facto control'—situations where an investor holds less than a 50% voting interest but holds the largest block of voting rights in an entity with widely dispersed minority shareholders who rarely attend shareholder meetings.

Statutory auditors and the National Financial Reporting Authority (NFRA) strictly inspect control assessments. If Phoenix Industrial Group exercises operational direction over Zenith Sensor Technologies Ltd, Phoenix cannot avoid consolidation simply by holding voting equity through complex intermediate shell companies. Once control is established, consolidation becomes legally mandatory. The only statutory exception is for an 'Investment Entity' under Ind AS 110 Paragraph 27—an entity whose business purpose is investing solely for capital appreciation and investment income, and which measures all investments at fair value through profit and loss under Ind AS 109. Because Phoenix is an active operating industrial conglomerate, this exemption does not apply."""

part2_say = r"""In Part 2, we dissect the mechanics of consolidation and the standard elimination entries required to transform independent trial balances into a unified group balance sheet.

Consolidation under Ind AS 110 is not a mere mathematical summation of lines. If a parent simply added the subsidiary's assets and liabilities to its own, the resulting group balance sheet would be severely distorted by double-counting. The parent would show both its 'Investment in Subsidiary' asset AND the subsidiary's underlying net assets, while group equity would artificially double-count share capital.

To execute a statutory consolidation under Ind AS 110 Paragraph B86, the controller applies four sequential consolidation protocols:
1. Line-by-Line Aggregation:
   The assets, liabilities, equity, income, expenses, and cash flows of the parent and its subsidiaries are combined line-by-line. Every rupee of cash, inventory, property, plant, and equipment, and trade payables is aggregated across all controlled entities from the date control is acquired.
2. Uniform Accounting Policies:
   Under Ind AS 110 Paragraph B87, consolidated financial statements must be prepared using uniform accounting policies for like transactions and other events in similar circumstances. If a subsidiary depreciates plant and equipment using the written-down value (WDV) method while the parent uses the straight-line method (SLM) for identical machinery, appropriate consolidation adjustments must be posted to align the subsidiary's numbers with group policies before aggregation. Similarly, revenue recognition timing under Ind AS 115 and inventory costing methods under Ind AS 2 (FIFO vs weighted average) must be standardized across the corporate perimeter.
3. Cancellation of Reciprocal Investment and Pre-Acquisition Equity:
   The carrying amount of the parent's 'Investment in Subsidiary' is eliminated in full against the parent's portion of the subsidiary's equity (share capital, securities premium, and pre-acquisition retained earnings) at the date of acquisition. Any differential between investment cost and net identifiable assets acquired forms Goodwill or Capital Reserve, as determined under Ind AS 103!
4. Segregation and Presentation of Non-Controlling Interest (NCI):
   Non-controlling interests in the net assets of consolidated subsidiaries are identified and presented within total Equity on the face of the consolidated balance sheet, distinctly separated from the equity of the parent company's shareholders, as required by Division II of Schedule III.

Furthermore, controllers must understand the strict accounting rules governing post-acquisition changes in ownership:
- Changes in Ownership Without Loss of Control (Ind AS 110 Paragraph 23): If a parent acquires an additional stake in an existing subsidiary (e.g., increasing from 80% to 90%) or sells a partial stake while maintaining control (e.g., reducing from 80% to 70%), the transaction is accounted for strictly as an Equity Transaction between owners! No gain or loss is recognized in Profit & Loss, and goodwill is never adjusted. The difference between consideration paid/received and the adjustment to NCI is recognized directly in Other Equity.
- Loss of Control (Ind AS 110 Paragraph 25): If the parent loses control, it must derecognize all assets, liabilities, and NCI, measure any retained non-controlling investment at fair value, and recognize the entire resulting gain or loss in Profit & Loss.

Under Ind AS 110 Paragraph B92, the reporting dates of the parent and its subsidiaries must coincide (e.g., March 31st). If the reporting dates differ, the difference cannot exceed three months, and adjustments must be made for significant intervening transactions. In addition, when consolidating foreign subsidiaries whose functional currency differs from the group's presentation currency under Ind AS 21, all assets and liabilities are translated at the closing spot exchange rate, and revenue and expense items are translated at average exchange rates for the period. The resulting exchange differences are recognized in Other Comprehensive Income (OCI) and accumulated in the Foreign Currency Translation Reserve (FCTR) within Other Equity, allocated proportionately between the parent and Non-Controlling Interest. Upon the eventual disposal of the foreign operation, the cumulative FCTR is reclassified from equity to profit or loss as a reclassification adjustment."""

part3_say = r"""In Part 3, we master one of the most critical and heavily tested areas of group accounting: the elimination of intra-group transactions and unrealized intercompany profits under Ind AS 110 Paragraph B86(c).

An enterprise cannot generate revenue or earn profit by selling goods to itself! In a corporate group, divisions and subsidiaries constantly trade with one another: transferring raw materials, licensing intellectual property, and sharing finished goods inventories. In standalone accounts, these transactions are recorded as legitimate sales, cost of goods sold, and trade receivables/payables. However, from the perspective of the single economic entity, no genuine third-party commercial sale has occurred until the goods are sold outside the group!

The controller must systematically eliminate all intra-group trading:
1. Intra-Group Revenue and COGS Elimination:
   The entire gross value of intra-group sales during the fiscal year must be debited to Consolidated Revenue and credited to Consolidated Cost of Goods Sold. This eliminates internal turnover without altering group net profit.
   In our case, Phoenix sold $4,000,000.00 of sensor sub-assemblies to Zenith.
   Consolidation Entry:
   - Debit: Sales Revenue — $\$4,000,000.00$
   - Credit: Cost of Goods Sold — $\$4,000,000.00$.
2. Elimination of Unrealized Profit in Ending Inventory:
   If the purchasing entity has already sold all transferred goods to external customers before year-end, the profit is realized and no further inventory adjustment is required.
   However, if any transferred goods remain in the purchasing entity's ending inventory, they are carried at the transfer price (which includes the selling entity's profit markup). This overstates group inventory and overstates group profit!
   The unrealized intercompany profit must be stripped out:
   $$\text{Unrealized Profit} = \text{Unsold Inventory at Cost to Buyer} \times \text{Gross Profit Margin Percentage}$$
   In our case study, Zenith holds $1,000,000.00 of unsold sub-assemblies at year-end. Phoenix's gross profit margin on invoice price is 25.0%.
   $$\text{Unrealized Inventory Profit} = \$1,000,000.00 \times 25\% = \$250,000.00$$

Now, evaluate the crucial distinction between Downstream and Upstream sales:
- Downstream Sale (Parent to Subsidiary): The parent made the profit. Therefore, 100% of the $250,000 unrealized profit is eliminated against the Parent's operating profit and consolidated inventory. Non-controlling interest is completely unaffected because NCI owns equity in the subsidiary, not the parent!
- Upstream Sale (Subsidiary to Parent): The subsidiary made the profit. Under Ind AS 110 Paragraph B86(c), the unrealized profit must be allocated proportionately between the parent and NCI in accordance with their shareholding percentages! For instance, if Zenith had sold goods to Phoenix at a $250,000 profit, 80% ($200,000) would reduce parent profit and 20% ($50,000) would reduce NCI's share of profit.

Finally, note the deferred tax impact under Ind AS 12: because the selling entity paid income tax on the intra-group sale in its standalone return, the elimination of profit for consolidation creates a deductible temporary difference. Under Ind AS 12, the group recognizes a Deferred Tax Asset (DTA) at the buyer's applicable tax rate:
$$\text{Deferred Tax Asset} = \text{Unrealized Profit} \times \text{Tax Rate} = \$250,000.00 \times 25.168\% = \$62,920.00$$
This entry debits Deferred Tax Asset $62,920.00 and credits Deferred Tax Expense (reducing tax expense in consolidated P&L). Furthermore, when intra-group transfers involve capital equipment or plant assets, the unrealized gain must be eliminated from Property, Plant and Equipment, and subsequent annual depreciation charges must be adjusted downward in each consolidated period to reflect historical cost depreciation, ensuring that group assets are never overstated."""

part4_say = r"""In Part 4, we govern intra-group financing balances, intercompany dividends, and the precise attribution of consolidated profit and comprehensive income to the owners of the parent and Non-Controlling Interest.

Beyond inventory trading, corporate groups frequently utilize centralized treasury management, where the parent acts as an internal bank, providing intercompany loans and cash sweeps to operating subsidiaries.
1. Intra-Group Loans and Receivables/Payables:
   Under Ind AS 110 Paragraph B86(b), intra-group balances—including intercompany loans, trade debtor/creditor accounts, bills of exchange, and interest accrued—must be eliminated in full.
   In our simulation, Phoenix provided a $2,000,000.00 long-term loan to Zenith at an 8.0% annual interest rate.
   - Balance Sheet Elimination: Debit Intercompany Loan Payable $2,000,000.00; Credit Intercompany Loan Receivable $2,000,000.00.
   - Profit & Loss Elimination: Debit Intercompany Interest Income $160,000.00; Credit Intercompany Finance Cost $160,000.00.
   This cleanly eliminates reciprocal financing balances without altering consolidated net earnings. Similarly, any intercompany management fees, IT service charges, or technical royalties are eliminated in full against the corresponding service expenses.
2. Intercompany Dividends:
   When a subsidiary pays a dividend to its parent, the parent records dividend income in its standalone P&L. Upon consolidation, this dividend income is an internal transfer of retained earnings and must be eliminated:
   - The parent's share of subsidiary dividends is eliminated against dividend income in consolidated P&L.
   - The minority share of subsidiary dividends is accounted for as a reduction in the carrying amount of Non-Controlling Interest on the balance sheet.
3. Attribution of Comprehensive Income (Parent vs NCI):
   Under Ind AS 110 Paragraph B94, an entity shall attribute the profit or loss and each component of Other Comprehensive Income (OCI) to the owners of the parent and to the non-controlling interests, even if this results in the non-controlling interests having a deficit balance!

Let us review the mathematical allocation for Phoenix Industrial Group:
- Parent Standalone Profit = $8,500,000.00.
- Subsidiary Standalone Profit = $3,000,000.00.
- Downstream Unrealized Profit = $250,000.00 (deducted 100% from Parent).
- Adjusted Parent Profit = $\$8,500,000 - \$250,000 = \$8,250,000.00$.
- Adjusted Subsidiary Profit = $\$3,000,000.00$.
- Total Consolidated Net Profit = $\$8,250,000.00 + \$3,000,000.00 = \$11,250,000.00$.
- NCI Share of Profit (20.0%) = $\$3,000,000.00 \times 20\% = \$600,000.00$.
- Profit Attributable to Owners of Parent = $\$8,250,000.00 + (\$3,000,000.00 \times 80\%) = \$8,250,000 + \$2,400,000 = \$10,650,000.00$.
Check: $\$10,650,000.00 + \$600,000.00 = \$11,250,000.00$.
Both components are presented with equal prominence on the face of the Consolidated Statement of Profit and Loss, fulfilling Schedule III and SEBI LODR requirements. In addition, when corporate groups operate in India, controllers leverage Section 80M of the Income Tax Act, 1961, which provides tax relief on inter-corporate dividends received by a domestic holding company from its domestic subsidiary, provided the dividend is further distributed to its own shareholders within the statutory deadline. This harmonizes tax cash flows across multi-tier corporate hierarchies.

Furthermore, controllers must navigate the intricate accounting mechanics of 'Step Acquisitions' (achieving control in stages). If Phoenix previously held a 25% associate stake accounted for under the equity method and subsequently acquires an additional 55% to achieve an 80% controlling stake, Ind AS 103 Paragraph 42 mandates a fundamental re-measurement: the previously held 25% equity interest must be re-measured to fair value on the date control is acquired! Any resulting difference between fair value and existing book carrying value is recognized immediately as a gain or loss in Profit & Loss. Any cumulative gains or losses previously recognized in Other Comprehensive Income relating to that associate are reclassified to P&L on the same basis as if the parent had disposed of the investment directly, ensuring a clean break between associate and subsidiary accounting."""

part5_say = r"""In Part 5, we execute our automated group consolidation software suite `ConsolidatedFinancialStatementsEngine`, audit every financial statement assertion, and review the corporate governance sign-off protocols.

Let us trace the complete algorithmic pipeline of our Python consolidation platform:
1. Top-Line Trading Consolidation:
   - Combines standalone revenues of Phoenix ($50,000,000.00) and Zenith ($20,000,000.00) for a pre-elimination total of $70,000,000.00.
   - Programmatically eliminates $4,000,000.00 of intra-group sensor sub-assembly sales.
   - Yields Consolidated Revenue of exactly $66,000,000.00.
2. Inventory Unrealized Profit Elimination:
   - Identifies $1,000,000.00 of transferred inventory remaining in Zenith's warehouse at year-end.
   - Applies the 25.0% gross profit margin to calculate $250,000.00 of unrealized profit.
   - Detects the downstream direction of the transaction, ensuring that the entire $250,000.00 reduction is charged against parent earnings, preserving NCI integrity.
3. Group Profit Allocation:
   - Aggregates adjusted parent earnings ($8,250,000.00) and subsidiary earnings ($3,000,000.00) to confirm Total Consolidated Net Profit of $11,250,000.00.
   - Accurately attributes $10,650,000.00 to the Equity Holders of Phoenix Industrial Group Ltd and $600,000.00 to Non-Controlling Interest.
4. Treasury Financing Elimination:
   - Reconciles the $2,000,000.00 intra-group loan and strips out $160,000.00 of internal interest expense and income.

As Group Financial Controller, you prepare the Consolidated Financial Statements in strict compliance with Division II of Schedule III of the Companies Act 2013 and SEBI Listing Obligations and Disclosure Requirements (LODR) Regulations. The Board Audit Committee reviews the complete working papers, verifying that:
- All subsidiaries within the consolidation perimeter meet the Ind AS 110 control criteria.
- Intra-group profit eliminations are supported by physical inventory audits, intercompany reconciliations, and markup schedules.
- The NCI equity balance and income statement attributions are calculated with mathematical precision.
- Intercompany dividend flows and financing charges are cleanly eliminated without residual balance sheet imbalances.
- The Statement of Changes in Equity (SOCIE) contains an explicit column for Non-Controlling Interests, tracing movements from opening balances to closing net assets.

The statutory auditors perform comprehensive test procedures on the consolidation elimination journal entries, verify the operating effectiveness of internal financial controls over reporting (IFC-FR), and issue an unqualified audit report on the consolidated financial statements. In addition, the Group Controller ensures that all eliminating journal entries are formally indexed, approved by senior finance leadership, and archived within the enterprise ERP data warehouse to withstand scrutiny during periodic regulatory inspections by the NFRA and stock exchange surveillance teams.

Furthermore, Division II of Schedule III of the Companies Act 2013 and Rule 6 of the Companies (Accounts) Rules, 2014, mandate a comprehensive disclosure schedule in the notes to the consolidated accounts. This statutory schedule requires an entity-by-entity breakdown disclosing: (1) each subsidiary's net assets as a percentage of consolidated net assets and monetary amount, (2) share in profit or loss as a percentage of consolidated profit and monetary amount, (3) share in Other Comprehensive Income as a percentage and amount, and (4) share in Total Comprehensive Income. This provides complete structural transparency to institutional shareholders, credit rating agencies, and debenture trustees.

Our automated validation framework executes programmatic assertion tests across every output field, confirming that no mathematical discrepancy or rounding anomaly exists within the corporate consolidation pipeline. Every calculation reconciles to the exact cent, ensuring complete compliance with the Ind AS framework. When our Python consolidation suite executes, every single assertion and statutory check validates with zero discrepancy, culminating in the terminal confirmation string:
`IND_AS_110_CONSOLIDATION_ELIMINATIONS_PASS`."""

day42_lesson = {
    "coursePrefix": "bcom-accounting",
    "day": 42,
    "title": "Ind AS 110 Consolidated Financial Statements: The Single Control Model & Elimination Engine",
    "parts": [
        {
            "part": 1,
            "title": "The Control Principle & Scope of Consolidated Financial Statements (Ind AS 110)",
            "say": part1_say,
            "code": day42_code,
            "output": day42_output,
            "check": {
                "question": "What are the three cumulative elements required to establish control over an investee under Ind AS 110?",
                "options": [
                    "Power over the investee, exposure/rights to variable returns, and the ability to use power to affect those returns",
                    "Holding more than 50% equity shares, regardless of voting rights or contractual veto powers",
                    "Appointing at least one executive director and holding long-term debt securities",
                    "Registering a trademark in the same jurisdiction as the subsidiary company"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "Ind AS 110 Paragraph 7 establishes three mandatory cumulative elements: power over relevant activities, variable returns exposure, and the ability to use power to affect returns.",
                "why": "Ind AS 110 Paragraph 7 establishes three mandatory cumulative elements: power over relevant activities, variable returns exposure, and the ability to use power to affect returns."
            }
        },
        {
            "part": 2,
            "title": "Mechanics of Consolidation & Acquisition Elimination Entries",
            "say": part2_say,
            "code": day42_code,
            "output": day42_output,
            "check": {
                "question": "Where is Non-Controlling Interest (NCI) presented on the consolidated balance sheet under Ind AS 110?",
                "options": [
                    "Within total Equity, but explicitly segregated from the equity attributable to the owners of the parent",
                    "Under Long-Term Borrowings as a financial liability",
                    "Deducted directly from total consolidated Property, Plant & Equipment",
                    "NCI is not presented on the consolidated balance sheet"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "Ind AS 110 and Schedule III mandate that NCI be presented within total Equity on the balance sheet, explicitly segregated from parent equity.",
                "why": "Ind AS 110 and Schedule III mandate that NCI be presented within total Equity on the balance sheet, explicitly segregated from parent equity."
            }
        },
        {
            "part": 3,
            "title": "Elimination of Intra-Group Transactions & Unrealized Inventory Profits",
            "say": part3_say,
            "code": day42_code,
            "output": day42_output,
            "check": {
                "question": "In a downstream sale of inventory from parent to subsidiary, how is unrealized intercompany profit eliminated?",
                "options": [
                    "100% against the parent's profit and consolidated inventory, leaving NCI completely unaffected",
                    "Proportionately between parent and NCI based on their shareholding percentages",
                    "100% against NCI's share of profit",
                    "It is never eliminated if the sale was conducted at market prices"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "In a downstream sale, the parent earned the profit; therefore, the elimination is charged 100% against parent profit, leaving NCI unaffected.",
                "why": "In a downstream sale, the parent earned the profit; therefore, the elimination is charged 100% against parent profit, leaving NCI unaffected."
            }
        },
        {
            "part": 4,
            "title": "Intercompany Financing, Dividends & Profit Attribution to NCI",
            "say": part4_say,
            "code": day42_code,
            "output": day42_output,
            "check": {
                "question": "In the Phoenix-Zenith case ($11.25M consolidated profit, Zenith profit $3M, 20% NCI), what is the profit attributable to NCI?",
                "options": [
                    "$600,000.00 (20% of Zenith's $3,000,000 net profit)",
                    "$2,250,000.00 (20% of total group consolidated profit)",
                    "$250,000.00 equal to the inventory unrealized profit",
                    "Zero, because minority shareholders do not share in profits"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "Because the transaction was downstream, Zenith's profit of $3M is unaffected by inventory elimination. NCI share = 20% * $3M = $600,000.00.",
                "why": "Because the transaction was downstream, Zenith's profit of $3M is unaffected by inventory elimination. NCI share = 20% * $3M = $600,000.00."
            }
        },
        {
            "part": 5,
            "title": "Executing the Python Consolidation Suite & Group Financial Statement Certification",
            "say": part5_say,
            "code": day42_code,
            "output": day42_output,
            "check": {
                "question": "What is the final confirmation string emitted by the Consolidated Financial Statements Engine?",
                "options": [
                    "IND_AS_110_CONSOLIDATION_ELIMINATIONS_PASS",
                    "CONSOLIDATION_FAILED_RECIPROCAL_IMBALANCE",
                    "NCI_ATTRIBUTION_ERROR_REJECTED",
                    "GROUP_REPORTING_TERMINATED_UNKNOWN"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "The consolidation engine successfully validates all line-by-line aggregations, eliminations, and profit attributions, emitting IND_AS_110_CONSOLIDATION_ELIMINATIONS_PASS.",
                "why": "The consolidation engine successfully validates all line-by-line aggregations, eliminations, and profit attributions, emitting IND_AS_110_CONSOLIDATION_ELIMINATIONS_PASS."
            }
        }
    ]
}

total_words = 0
for p in day42_lesson["parts"]:
    wc = count_words(p["say"])
    total_words += wc
    print(f"Day 42 Part {p['part']} words: {wc}")

for p in day42_lesson["parts"]:
    wc = count_words(p["say"])
    assert wc >= 580, f"Part {p['part']} word count {wc} < 580"

print(f"Day 42 Total words: {total_words}")
assert total_words >= 3000, f"Total word count {total_words} < 3000"

with open("scripts/bcom_acc_day42.json", "w", encoding="utf-8") as f:
    json.dump(day42_lesson, f, indent=2)

print("Saved scripts/bcom_acc_day42.json successfully!")
