import json
import re

def count_words(text):
    return len(re.findall(r'\b[A-Za-z0-9_-]+\b', text))

day43_code = """# Day 43: Ind AS 111 Joint Arrangements & Ind AS 28 Equity Method Suite
# Automated joint arrangement simulator executing Joint Operation direct asset/liability
# recognition and Joint Venture / Associate Equity Method tracking with unrealized profit elimination.

from dataclasses import dataclass
from typing import Dict, Tuple

class JointArrangementsEquityMethodEngine:
    def __init__(self, investor_name: str):
        self.investor_name = investor_name

    def process_joint_operation(
        self,
        facility_name: str,
        total_assets: float,
        total_liabilities: float,
        total_revenue: float,
        total_expenses: float,
        participating_share_pct: float
    ) -> Dict[str, float]:
        \"\"\"Module 1: Ind AS 111 Joint Operation Line-by-Line Recognition.\"\"\"
        share = participating_share_pct / 100.0
        return {
            "facility_name": facility_name,
            "recognized_assets": round(total_assets * share, 2),
            "recognized_liabilities": round(total_liabilities * share, 2),
            "recognized_revenue": round(total_revenue * share, 2),
            "recognized_expenses": round(total_expenses * share, 2),
            "net_operational_contribution": round((total_revenue - total_expenses) * share, 2)
        }

    def process_equity_method_investment(
        self,
        investee_name: str,
        initial_cost: float,
        investee_net_profit: float,
        investee_oci: float,
        dividends_received: float,
        ownership_pct: float,
        downstream_unrealized_profit: float
    ) -> Dict[str, float]:
        \"\"\"Module 2: Ind AS 28 / Ind AS 111 Equity Method for Joint Ventures and Associates.\"\"\"
        share = ownership_pct / 100.0
        
        # Share of profit adjusted for investor's share of unrealized profit
        elim_unrealized = downstream_unrealized_profit * share
        share_of_profit = (investee_net_profit * share) - elim_unrealized
        share_of_oci = investee_oci * share
        
        # Carrying value: Initial Cost + Share of Profit + Share of OCI - Dividends Received
        ending_carrying_amount = (
            initial_cost + share_of_profit + share_of_oci - dividends_received
        )
        
        return {
            "investee_name": investee_name,
            "initial_investment_cost": round(initial_cost, 2),
            "eliminated_unrealized_profit": round(elim_unrealized, 2),
            "share_of_profit_pnl": round(share_of_profit, 2),
            "share_of_oci": round(share_of_oci, 2),
            "dividends_received_reduction": round(dividends_received, 2),
            "ending_carrying_amount": round(ending_carrying_amount, 2)
        }

engine = JointArrangementsEquityMethodEngine("Phoenix Industrial Group Ltd")

jo_res = engine.process_joint_operation(
    facility_name="Aero-Turbine Testing Facility",
    total_assets=8000000.0,
    total_liabilities=1500000.0,
    total_revenue=3000000.0,
    total_expenses=2400000.0,
    participating_share_pct=50.0
)
assert jo_res["recognized_assets"] == 4000000.0
assert jo_res["recognized_liabilities"] == 750000.0
assert jo_res["recognized_expenses"] == 1200000.0
assert jo_res["net_operational_contribution"] == 300000.0

eq_res = engine.process_equity_method_investment(
    investee_name="Quantum Navigation Systems Ltd",
    initial_cost=4500000.0,
    investee_net_profit=1800000.0,
    investee_oci=200000.0,
    dividends_received=300000.0,
    ownership_pct=30.0,
    downstream_unrealized_profit=100000.0
)
assert eq_res["eliminated_unrealized_profit"] == 30000.0
assert eq_res["share_of_profit_pnl"] == 510000.0
assert eq_res["share_of_oci"] == 60000.0
assert eq_res["ending_carrying_amount"] == 4770000.0

print(f"Investor: {engine.investor_name}")
print(f"Joint Operation ({jo_res['facility_name']}): Assets: ${jo_res['recognized_assets']:,.2f} | Expenses: ${jo_res['recognized_expenses']:,.2f}")
print(f"Equity Method ({eq_res['investee_name']}): Initial Cost: ${eq_res['initial_investment_cost']:,.2f}")
print(f"Equity Method: Share of P&L: ${eq_res['share_of_profit_pnl']:,.2f} | Share of OCI: ${eq_res['share_of_oci']:,.2f}")
print(f"Equity Method: Dividends: -${eq_res['dividends_received_reduction']:,.2f} | Ending Carrying Value: ${eq_res['ending_carrying_amount']:,.2f}")
print("IND_AS_111_JOINT_ARRANGEMENTS_EQUITY_METHOD_PASS")
"""

day43_output = """Investor: Phoenix Industrial Group Ltd
Joint Operation (Aero-Turbine Testing Facility): Assets: $4,000,000.00 | Expenses: $1,200,000.00
Equity Method (Quantum Navigation Systems Ltd): Initial Cost: $4,500,000.00
Equity Method: Share of P&L: $510,000.00 | Share of OCI: $60,000.00
Equity Method: Dividends: -$300,000.00 | Ending Carrying Value: $4,770,000.00
IND_AS_111_JOINT_ARRANGEMENTS_EQUITY_METHOD_PASS"""

part1_say = r"""Welcome to Day 43 of Corporate & Financial Accounting! Having mastered Business Combinations under Ind AS 103 and Consolidated Financial Statements under Ind AS 110, today we explore strategic corporate partnerships where an enterprise exercises shared governance: Ind AS 111 Joint Arrangements (converged with IFRS 11) and Ind AS 28 Investments in Associates and Joint Ventures (converged with IAS 28).

In high-technology, aerospace, defense, and capital-intensive infrastructure industries, enterprises frequently co-invest in joint research programs, technology development consortiums, and specialized manufacturing plants. Rather than unilateral control by a single entity, these strategic alliances are governed by contractual co-ownership. Under Ind AS 111 Paragraph 4, a 'Joint Arrangement' is defined as an arrangement of which two or more parties have contractually agreed joint control.

Joint Control is the contractually agreed sharing of control over an arrangement. Under Ind AS 111 Paragraph 7, joint control exists only when decisions about the 'relevant activities'—the operating, financial, and strategic activities that significantly influence the economic returns of the arrangement—require the UNANIMOUS CONSENT of the parties sharing control! If a partnership agreement allows operational decisions to be passed by a simple majority or by a 75% supermajority that can be achieved without the consent of a particular party, that party does NOT have joint control.

Once joint control is established, Ind AS 111 enforces a fundamental binary classification based on the contractual rights and obligations of the parties:
1. Joint Operation: A joint arrangement whereby the parties that have joint control of the arrangement have rights to the assets, and obligations for the liabilities, relating to the arrangement. Those parties are called 'Joint Operators'. Joint operations commonly arise when parties collaborate directly without forming a separate legal entity, or when an arrangement structured through a separate vehicle legally binds the co-venturers to absorb all liabilities and take all output of the facility.
2. Joint Venture: A joint arrangement whereby the parties that have joint control of the arrangement have rights to the net assets of the arrangement. Those parties are called 'Joint Venturers'. Joint ventures are almost invariably structured through a separate legal vehicle (such as a private limited company or limited liability partnership) where the legal form confers entity separation, insulating the venturers from direct liability.

Under Ind AS 111 Application Guidance B12–B33, controllers must evaluate three analytical layers when an arrangement is structured through a separate vehicle: (1) the legal form of the vehicle, (2) the terms of the contractual arrangement, and (3) other facts and circumstances. Crucially, if the arrangement is designed primarily to provide output exclusively to the joint venturers (e.g. an aerospace parts fabrication facility selling 100% of its production to the co-owners at cost), and the arrangement depends on the parties to settle its operational liabilities on an ongoing basis, the arrangement is legally and substantively classified as a Joint Operation, notwithstanding the existence of a separate corporate entity!

Under Section 129(3) of the Companies Act 2013 and SEBI LODR Regulations, corporate entities must disclose their interests in joint arrangements in their annual financial statements and attach Form AOC-1. In addition, transactions with joint arrangements must be reviewed by the Audit Committee under Section 177 and Section 188 of the Companies Act 2013 governing related party transactions. Furthermore, controllers must analyze dispute resolution mechanisms: partnership agreements often include deadlock-breaking provisions (such as mediation, arbitration, or Russian roulette buy-sell clauses). Under Ind AS 111 Application Guidance B8, the existence of a dispute resolution mechanism does not prevent an arrangement from being jointly controlled, provided unanimous consent is legally required before decisions can be implemented."""

part2_say = r"""In Part 2, we dismantle the operational accounting mechanics for Joint Operations under Ind AS 111 Paragraph 20.

The accounting treatment of a Joint Operation is characterized by 'Direct Recognition'. Because joint operators have direct rights to underlying assets and direct obligations for operational liabilities, they do NOT use the equity method or proportional consolidation. Instead, each joint operator accounts directly in its standalone and consolidated financial statements for its specific contractual share of assets, liabilities, revenues, and expenses!

Specifically, under Ind AS 111 Paragraph 20, a joint operator recognizes:
(a) Its assets, including its share of any assets held jointly;
(b) Its liabilities, including its share of any liabilities incurred jointly;
(c) Its revenue from the sale of its share of the output arising from the joint operation;
(d) Its share of the revenue from the sale of the output by the joint operation; and
(e) Its expenses, including its share of any expenses incurred jointly.

Let us examine our corporate simulation involving Phoenix Industrial Group Ltd:
Phoenix enters into a 50:50 joint operating agreement with an aerospace engine manufacturer to establish the 'Aero-Turbine Testing Facility'. The contractual charter establishes that the parties jointly own the test beds, are jointly and severally liable for facility debts, and share operational expenses equally.
During the fiscal year, the Aero-Turbine Testing Facility reports the following gross trial balance:
- Total Property, Plant & Equipment (Advanced Dyno Test Beds): $8,000,000.00.
- Total Operational Liabilities (Environmental & Equipment Payables): $1,500,000.00.
- Facility Total Commercial Testing Revenue: $3,000,000.00.
- Facility Total Operating Expenses (Aviation Fuel, Calibration, Labor): $2,400,000.00.

Applying Ind AS 111 Paragraph 20, Phoenix records its 50.0% participating interest directly onto its balance sheet and income statement:
- Property, Plant & Equipment recognized: $\$8,000,000.00 \times 50\% = \$4,000,000.00$.
- Operational Liabilities recognized: $\$1,500,000.00 \times 50\% = \$750,000.00$.
- Commercial Revenues recognized: $\$3,000,000.00 \times 50\% = \$1,500,000.00$.
- Operating Expenses recognized: $\$2,400,000.00 \times 50\% = \$1,200,000.00$.
- Net Operational Contribution to P&L = $\$1,500,000.00 - \$1,200,000.00 = \$300,000.00$.

Now, examine the accounting for transactions between a joint operator and a joint operation under Ind AS 111 Paragraph B34:
- When an operator contributes or sells assets to a joint operation (e.g. Phoenix selling specialized sensor probes to the facility at a profit), Phoenix is considered to be conducting the transaction with the other parties to the joint operation. Consequently, Phoenix recognizes gains and losses resulting from such a transaction ONLY to the extent of the OTHER parties' interests! If Phoenix sells an asset at a $100,000 profit to the 50% joint operation, it recognizes only 50% ($50,000) of the profit in P&L, while the remaining 50% is eliminated against the asset's carrying value.
- When an operator purchases assets from a joint operation, it does not recognize its share of the joint operation's profit until it resells those assets to an independent third party!

Notice the critical controllership benefit: Phoenix does not record an 'Investment in Joint Venture' asset. Instead, the advanced testing test beds are added directly to Phoenix's Property, Plant and Equipment schedule under Ind AS 16, and depreciated according to Phoenix's asset depreciation policies. This gives lenders, credit rating agencies, and equity analysts complete visibility into productive capacity. Furthermore, if the joint operation incurs site restoration or decommissioning liabilities at the end of its useful life, Phoenix recognizes its 50% share of the present value of the decommissioning provision under Ind AS 37 and Ind AS 16, ensuring that all environmental and site rehabilitation commitments are transparently reflected on the group balance sheet."""

part3_say = r"""In Part 3, we master the Equity Method of accounting under Ind AS 28, which governs investments in Joint Ventures (under Ind AS 111) and Associates (where an investor possesses Significant Influence).

Under legacy Indian GAAP (AS 27), joint ventures were accounted for using Proportionate Consolidation (adding 50% of the joint venture's revenues, expenses, assets, and liabilities line-by-line). Ind AS 111 completely abolished proportionate consolidation for joint ventures! Under converged standards, all Joint Ventures and Associates MUST be accounted for using the 'Equity Method' under Ind AS 28.

Significant Influence under Ind AS 28 Paragraph 5 is the power to participate in the financial and operating policy decisions of the investee, but is not control or joint control. A holding of 20% or more of voting power creates a rebuttable presumption of significant influence. However, significant influence can exist with less than 20% voting power if evidenced by: (a) representation on the board of directors, (b) participation in policy-making processes including dividend decisions, (c) material transactions between the investor and investee, (d) interchange of managerial personnel, or (e) provision of essential technical information. In addition, under Ind AS 28 Paragraph 7, controllers must examine potential voting rights (such as warrants or convertible debentures) that are currently exercisable.

The Equity Method operates as a 'Single-Line Consolidation' on the balance sheet and statement of profit and loss:
1. Initial Recognition:
   The investment in the associate or joint venture is initially recognized at cost (including acquisition-related transaction costs under Ind AS 28 Paragraph 10). Any difference between cost and the investor's share of net fair value of identifiable assets forms implicit goodwill (which is embedded in the carrying amount and not tested separately).
2. Ongoing Carrying Amount Adjustments:
   - The carrying amount of the investment is increased or decreased to recognize the investor's share of the profit or loss of the investee after the date of acquisition:
     Debit: Investment in Associate / JV (Balance Sheet); Credit: Share of Profit of Associate / JV (P&L).
   - The investor's share of the investee's Other Comprehensive Income (OCI)—such as revaluation surpluses or foreign exchange reserves—is recognized directly in the investor's OCI:
     Debit: Investment in Associate / JV; Credit: Share of OCI of Associate / JV (OCI).
3. Treatment of Dividends Received:
   When the investee declares and pays a cash dividend to the investor, this dividend is NOT recognized as income! Because the investor has already recognized its share of earnings as they accrued, recognizing dividend income would double-count profit. Instead, dividends received represent a liquidation of capital:
     Debit: Cash & Bank; Credit: Investment in Associate / JV (reducing carrying amount).

Let us trace Phoenix's 30.0% strategic investment in Quantum Navigation Systems Ltd:
- Initial Purchase Cost = $4,500,000.00.
- Investee Net Profit for the year = $1,800,000.00.
- Investee Revaluation OCI gain = $200,000.00.
- Cash Dividend paid by Quantum to Phoenix = $300,000.00.
- Phoenix's 30% Share of Profit = $\$1,800,000.00 \times 30\% = \$540,000.00$.
- Phoenix's 30% Share of OCI = $\$200,000.00 \times 30\% = \$60,000.00$.
- Dividend Reduction = $-\$300,000.00$.
Before considering unrealized intercompany transactions, the carrying amount rises from $4,500,000 to $\$4,500,000 + \$540,000 + \$60,000 - \$300,000 = \$4,800,000.00$, establishing the initial baseline. In addition, controllers must note Ind AS 28 Paragraph 36: if an associate has outstanding cumulative preference shares held by outside parties, the investor computes its share of profit or loss after adjusting for the preference dividends on such shares, regardless of whether those dividends have been officially declared by the associate's board of directors!"""

part4_say = r"""In Part 4, we examine the elimination of unrealized intercompany profits and the statutory limits on loss absorption under Ind AS 28 Paragraph 28 and Paragraph 38.

Corporate groups routinely conduct commercial business with their associates and joint ventures: selling components, providing technical services, or purchasing finished goods. However, because the investor owns a significant equity stake, an intercompany sale cannot be treated as a purely external third-party transaction!

Under Ind AS 28 Paragraph 28, profits and losses resulting from 'upstream' (associate to investor) and 'downstream' (investor to associate) transactions are recognized in the investor's financial statements ONLY to the extent of unrelated investors' interests in the associate or joint venture!
The investor's share in the associate's or joint venture's profits or losses resulting from these transactions must be systematically eliminated:
$$\text{Eliminated Unrealized Profit} = \text{Total Unrealized Intercompany Profit} \times \text{Investor's Ownership Percentage}$$

Let us analyze Phoenix's commercial transaction with Quantum Navigation Systems Ltd:
- During the year, Phoenix sold specialized optical navigation equipment to Quantum (a Downstream Sale).
- Phoenix recorded an intercompany gross profit on the sale in its standalone accounts.
- At fiscal year-end, Quantum still holds this equipment in its inventory/assets, containing an unrealized profit of $100,000.00.
- Because Phoenix owns 30.0% of Quantum, Phoenix must eliminate its 30% share:
  $$\text{Eliminated Profit} = \$100,000.00 \times 30\% = \$30,000.00$$
- This $30,000 is deducted directly from Phoenix's 'Share of Profit of Associate':
  $$\text{Adjusted Share of Profit (P&L)} = \$540,000.00 - \$30,000.00 = \$510,000.00$$
- The ending carrying amount of the investment in Quantum becomes:
  $$\text{Ending Carrying Value} = \$4,500,000.00 + \$510,000.00 + \$60,000.00 - \$300,000.00 = \$4,770,000.00$$

Now, evaluate the crucial loss absorption ceiling under Ind AS 28 Paragraph 38:
What happens if an associate suffers catastrophic operational losses?
Under the equity method:
- The investor's share of losses is recognized until the carrying amount of the investment is reduced to zero.
- The investment interest includes not only equity shares but also long-term debt or preference capital that in substance forms part of the net investment (e.g., long-term subordinated loans where settlement is neither planned nor likely to occur in the foreseeable future).
- Once the carrying amount is zero, additional losses are recognized only to the extent that the investor has incurred legal or constructive obligations or made payments on behalf of the associate (e.g., corporate guarantees issued to lenders under Section 186 of the Companies Act 2013).
- If the associate subsequently reports profits, the investor resumes recognizing its share of profits only after its share of profits equals the share of cumulative unrecognized losses!
- Furthermore, under Ind AS 28 Paragraph 40, because goodwill is not separately recognized, the entire carrying amount of the investment ($4,770,000) is tested for impairment as a single asset under Ind AS 36 whenever objective indicators of impairment exist.
- Finally, if an investor ceases to have significant influence or joint control (e.g., selling down its stake from 30% to 10%), Ind AS 28 Paragraph 22 requires the investor to derecognize the equity method, measure the retained 10% financial asset at fair value through P&L under Ind AS 109, recognize any difference in Profit & Loss, and reclassify all cumulative OCI balances to P&L on the same basis as a direct disposal! This ensures that subsequent returns on the passive equity interest are marked to market in full accordance with financial instrument standards."""

part5_say = r"""In Part 5, we execute our deterministic Python partnership engine `JointArrangementsEquityMethodEngine`, verify all financial statement assertions, and establish corporate governance sign-off protocols.

Let us trace the complete algorithmic pipeline of our software engine:
1. Joint Operation Module (Aero-Turbine Testing Facility):
   - Inputs total facility assets of $8,000,000.00 and liabilities of $1,500,000.00.
   - Accurately computes Phoenix's 50.0% direct share: $4,000,000.00 assets and $750,000.00 liabilities.
   - Inputs facility revenues of $3,000,000.00 and operational expenses of $2,400,000.00.
   - Accurately attributes $1,500,000.00 revenue and $1,200,000.00 expenses, confirming a net operational contribution of $300,000.00.
2. Equity Method Module (Quantum Navigation Systems Ltd):
   - Establishes initial investment cost of $4,500,000.00.
   - Deducts $30,000.00 for Phoenix's 30% share of downstream unrealized profit ($100,000 * 30%).
   - Recognizes adjusted Share of Associate Profit of $510,000.00 in Profit & Loss.
   - Recognizes Share of Associate OCI of $60,000.00 in Other Comprehensive Income.
   - Applies the $300,000.00 cash dividend as a balance sheet reduction.
   - Reconciles the ending balance sheet carrying amount to exactly $4,770,000.00.

Now, inspect how these balances are presented on the face of Phoenix's Consolidated Financial Statements under Division II of Schedule III:
1. Balance Sheet Presentation:
   - Non-Current Assets: Under Property, Plant and Equipment, Phoenix adds $4,000,000.00 representing its 50% share of test beds.
   - Non-Current Assets: Under Financial Assets, Phoenix presents a separate line item: 'Investments accounted for using the equity method' carrying value of $4,770,000.00.
   - Non-Current Liabilities: Under Borrowings/Trade Payables, Phoenix presents $750,000.00 representing its 50% share of facility liabilities.
2. Statement of Profit and Loss Presentation:
   - Operating Revenue: Includes $1,500,000.00 from testing facility output.
   - Operating Expenses: Includes $1,200,000.00 from testing facility costs.
   - Below Operating Profit: Presents a distinct statutory line item: 'Share of profit of associates and joint ventures accounted for using the equity method' of $510,000.00.
   - Other Comprehensive Income: Presents 'Share of OCI of associates and joint ventures' of $60,000.00.

Statutory auditors inspect the Joint Operating Agreement, verify unanimous consent clauses, review the audited financial statements of Quantum Navigation Systems Ltd, and confirm that all elimination entries conform to Ind AS 28 and Ind AS 111. The Audit Committee reviews the disclosures in Form AOC-1, ensuring that the accounting policies of associates and joint ventures are harmonized with group accounting standards. In addition, internal financial controls over financial reporting (IFC-FR) are documented to verify that data feeds from equity-accounted entities are reconciled to audited local GAAP or Ind AS accounts, preventing restatements. The disclosures in the notes to the financial statements include a detailed table breaking down the investor's share of assets, liabilities, revenues, and expenses from joint operations, as well as summarized financial information for material associates and joint ventures as required by Ind AS 112.

Our automated validation framework executes programmatic assertion tests across every output field, confirming that no mathematical discrepancy or rounding anomaly exists within the corporate partnership accounting pipeline. Every calculation reconciles to the exact cent, ensuring complete compliance with the Ind AS framework and statutory disclosure mandates. The Chief Accounting Officer and Chief Financial Officer formally certify the joint arrangement balances in their annual financial reporting package. When our Python simulation engine executes, every single assertion and statutory check validates with zero discrepancy, culminating in the terminal confirmation string:
`IND_AS_111_JOINT_ARRANGEMENTS_EQUITY_METHOD_PASS`."""

day43_lesson = {
    "coursePrefix": "bcom-accounting",
    "day": 43,
    "title": "Ind AS 111 Joint Arrangements & Ind AS 28 Investments in Associates: Dual Architecture & Equity Method",
    "parts": [
        {
            "part": 1,
            "title": "Contractual Joint Control & Classification of Joint Arrangements (Ind AS 111)",
            "say": part1_say,
            "code": day43_code,
            "output": day43_output,
            "check": {
                "question": "What is the defining legal criterion required to establish Joint Control under Ind AS 111?",
                "options": [
                    "Decisions about the relevant activities require the unanimous consent of the parties sharing control",
                    "One investor holding at least 51% of voting shares",
                    "The arrangement must be registered as a non-profit trust",
                    "A majority vote of directors regardless of contractual veto rights"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "Ind AS 111 Paragraph 7 establishes that joint control exists only when decisions about relevant activities require the unanimous consent of the parties sharing control.",
                "why": "Ind AS 111 Paragraph 7 establishes that joint control exists only when decisions about relevant activities require the unanimous consent of the parties sharing control."
            }
        },
        {
            "part": 2,
            "title": "Accounting for Joint Operations (Direct Asset & Liability Recognition)",
            "say": part2_say,
            "code": day43_code,
            "output": day43_output,
            "check": {
                "question": "How does a Joint Operator account for its interest in a Joint Operation under Ind AS 111?",
                "options": [
                    "By directly recognizing its share of assets, liabilities, revenues, and expenses line-by-line",
                    "By applying the equity method as a single line item on the balance sheet",
                    "By capitalizing all investments into goodwill without recognizing liabilities",
                    "By recording all cash outflows as charitable donations"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "Under Ind AS 111 Paragraph 20, a joint operator directly recognizes its share of assets, liabilities, revenues, and expenses in its financial statements.",
                "why": "Under Ind AS 111 Paragraph 20, a joint operator directly recognizes its share of assets, liabilities, revenues, and expenses in its financial statements."
            }
        },
        {
            "part": 3,
            "title": "The Equity Method under Ind AS 28 (Investments in Associates & Joint Ventures)",
            "say": part3_say,
            "code": day43_code,
            "output": day43_output,
            "check": {
                "question": "Under the Equity Method (Ind AS 28), how are cash dividends received from an associate or joint venture accounted for?",
                "options": [
                    "As a reduction in the carrying amount of the investment on the balance sheet, not as income",
                    "As operating revenue in the Statement of Profit and Loss",
                    "As an addition to share capital and securities premium",
                    "As an extraordinary gain in Other Comprehensive Income"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "Under Ind AS 28, dividends received represent a return of capital and reduce the carrying amount of the investment, preventing double-counting of accrued earnings.",
                "why": "Under Ind AS 28, dividends received represent a return of capital and reduce the carrying amount of the investment, preventing double-counting of accrued earnings."
            }
        },
        {
            "part": 4,
            "title": "Unrealized Profits Elimination & Loss Absorption Limits",
            "say": part4_say,
            "code": day43_code,
            "output": day43_output,
            "check": {
                "question": "In a downstream sale to a 30% associate with $100k unrealized profit, how much profit must the investor eliminate?",
                "options": [
                    "$30,000.00 (30% of $100,000, eliminated to the extent of the investor's ownership interest)",
                    "$100,000.00 (100% eliminated regardless of ownership interest)",
                    "Zero, because associates are separate legal entities",
                    "$70,000.00 equal to the unrelated investors' share"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "Under Ind AS 28 Paragraph 28, unrealized intercompany profits are eliminated only to the extent of the investor's interest in the associate ($100k * 30% = $30,000).",
                "why": "Under Ind AS 28 Paragraph 28, unrealized intercompany profits are eliminated only to the extent of the investor's interest in the associate ($100k * 30% = $30,000)."
            }
        },
        {
            "part": 5,
            "title": "Executing the Python Joint Arrangements Suite & Governance Certification",
            "say": part5_say,
            "code": day43_code,
            "output": day43_output,
            "check": {
                "question": "What is the final confirmation string emitted by the Joint Arrangements & Equity Method Engine?",
                "options": [
                    "IND_AS_111_JOINT_ARRANGEMENTS_EQUITY_METHOD_PASS",
                    "EQUITY_METHOD_FAILED_UNBALANCED_CARRYING_VALUE",
                    "JOINT_OPERATION_REVENUE_REJECTED",
                    "PARTNERSHIP_AUDIT_TERMINATED_UNKNOWN"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "The Joint Arrangements & Equity Method Engine verifies all joint operation allocations, equity method adjustments, and unrealized profit eliminations, emitting IND_AS_111_JOINT_ARRANGEMENTS_EQUITY_METHOD_PASS.",
                "why": "The Joint Arrangements & Equity Method Engine verifies all joint operation allocations, equity method adjustments, and unrealized profit eliminations, emitting IND_AS_111_JOINT_ARRANGEMENTS_EQUITY_METHOD_PASS."
            }
        }
    ]
}

total_words = 0
for p in day43_lesson["parts"]:
    wc = count_words(p["say"])
    total_words += wc
    print(f"Day 43 Part {p['part']} words: {wc}")

for p in day43_lesson["parts"]:
    wc = count_words(p["say"])
    assert wc >= 580, f"Part {p['part']} word count {wc} < 580"

print(f"Day 43 Total words: {total_words}")
assert total_words >= 3000, f"Total word count {total_words} < 3000"

with open("scripts/bcom_acc_day43.json", "w", encoding="utf-8") as f:
    json.dump(day43_lesson, f, indent=2)

print("Saved scripts/bcom_acc_day43.json successfully!")
