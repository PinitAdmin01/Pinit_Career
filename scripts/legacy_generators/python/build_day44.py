import json
import re

def count_words(text):
    return len(re.findall(r'\b[A-Za-z0-9_-]+\b', text))

day44_code = """# Day 44: Ind AS 112 Disclosure of Interests in Other Entities Suite
# Automated group disclosure compliance engine formatting statutory disclosures for
# Material Non-Controlling Interests, Material Associates, and Unconsolidated Structured Entities.

from dataclasses import dataclass
from typing import Dict, List

class GroupDisclosuresEngine:
    def __init__(self, reporting_parent: str):
        self.reporting_parent = reporting_parent

    def format_material_nci_disclosure(
        self,
        subsidiary_name: str,
        nci_percentage: float,
        total_assets: float,
        total_liabilities: float,
        revenue: float,
        profit: float,
        restricted_cash_covenant: float
    ) -> Dict[str, float]:
        \"\"\"Module 1: Ind AS 112 Paragraph 12 Material NCI Subsidiary Disclosures.\"\"\"
        net_assets = total_assets - total_liabilities
        nci_share = nci_percentage / 100.0
        nci_carrying_equity = net_assets * nci_share
        nci_profit_share = profit * nci_share
        
        return {
            "subsidiary_name": subsidiary_name,
            "net_assets": round(net_assets, 2),
            "nci_equity_balance": round(nci_carrying_equity, 2),
            "nci_profit_allocated": round(nci_profit_share, 2),
            "restricted_cash_covenant": round(restricted_cash_covenant, 2)
        }

    def format_material_associate_disclosure(
        self,
        associate_name: str,
        ownership_pct: float,
        total_assets: float,
        total_liabilities: float,
        profit: float,
        oci: float,
        unrealized_profit_elim: float
    ) -> Dict[str, float]:
        \"\"\"Module 2: Ind AS 112 Paragraph 21 Material Associate Disclosures.\"\"\"
        net_assets = total_assets - total_liabilities
        share = ownership_pct / 100.0
        reconciled_carrying_value = (net_assets * share) - (unrealized_profit_elim * share)
        adj_share_profit = (profit * share) - (unrealized_profit_elim * share)
        adj_share_oci = oci * share
        
        return {
            "associate_name": associate_name,
            "investee_net_assets": round(net_assets, 2),
            "reconciled_carrying_value": round(reconciled_carrying_value, 2),
            "share_of_profit": round(adj_share_profit, 2),
            "share_of_oci": round(adj_share_oci, 2)
        }

    def format_unconsolidated_structured_entity(
        self,
        entity_name: str,
        total_entity_assets: float,
        subordinated_debt_held: float,
        liquidity_guarantee_limit: float
    ) -> Dict[str, float]:
        \"\"\"Module 3: Ind AS 112 Paragraph 24-31 Unconsolidated Structured Entities Disclosures.\"\"\"
        max_exposure = subordinated_debt_held + liquidity_guarantee_limit
        return {
            "entity_name": entity_name,
            "total_entity_size": round(total_entity_assets, 2),
            "carrying_value_asset": round(subordinated_debt_held, 2),
            "maximum_exposure_to_loss": round(max_exposure, 2)
        }

engine = GroupDisclosuresEngine("Phoenix Industrial Group Ltd")

nci_res = engine.format_material_nci_disclosure(
    subsidiary_name="Zenith Sensor Technologies Ltd",
    nci_percentage=20.0,
    total_assets=18000000.0,
    total_liabilities=6000000.0,
    revenue=20000000.0,
    profit=3000000.0,
    restricted_cash_covenant=1500000.0
)
assert nci_res["net_assets"] == 12000000.0
assert nci_res["nci_equity_balance"] == 2400000.0
assert nci_res["nci_profit_allocated"] == 600000.0
assert nci_res["restricted_cash_covenant"] == 1500000.0

assoc_res = engine.format_material_associate_disclosure(
    associate_name="Quantum Navigation Systems Ltd",
    ownership_pct=30.0,
    total_assets=25000000.0,
    total_liabilities=9000000.0,
    profit=1800000.0,
    oci=200000.0,
    unrealized_profit_elim=100000.0
)
assert assoc_res["investee_net_assets"] == 16000000.0
assert assoc_res["reconciled_carrying_value"] == 4770000.0
assert assoc_res["share_of_profit"] == 510000.0
assert assoc_res["share_of_oci"] == 60000.0

struct_res = engine.format_unconsolidated_structured_entity(
    entity_name="Aerospace Innovation Securitization Trust",
    total_entity_assets=50000000.0,
    subordinated_debt_held=2000000.0,
    liquidity_guarantee_limit=3000000.0
)
assert struct_res["total_entity_size"] == 50000000.0
assert struct_res["carrying_value_asset"] == 2000000.0
assert struct_res["maximum_exposure_to_loss"] == 5000000.0

print(f"Parent: {engine.reporting_parent}")
print(f"Material NCI ({nci_res['subsidiary_name']}): NCI Equity: ${nci_res['nci_equity_balance']:,.2f} | Restricted Cash: ${nci_res['restricted_cash_covenant']:,.2f}")
print(f"Material Associate ({assoc_res['associate_name']}): Carrying Value: ${assoc_res['reconciled_carrying_value']:,.2f} | Share of P&L: ${assoc_res['share_of_profit']:,.2f}")
print(f"Structured Entity ({struct_res['entity_name']}): Size: ${struct_res['total_entity_size']:,.2f} | Max Loss Exposure: ${struct_res['maximum_exposure_to_loss']:,.2f}")
print("IND_AS_112_GROUP_DISCLOSURES_SUITE_PASS")
"""

day44_output = """Parent: Phoenix Industrial Group Ltd
Material NCI (Zenith Sensor Technologies Ltd): NCI Equity: $2,400,000.00 | Restricted Cash: $1,500,000.00
Material Associate (Quantum Navigation Systems Ltd): Carrying Value: $4,770,000.00 | Share of P&L: $510,000.00
Structured Entity (Aerospace Innovation Securitization Trust): Size: $50,000,000.00 | Max Loss Exposure: $5,000,000.00
IND_AS_112_GROUP_DISCLOSURES_SUITE_PASS"""

part1_say = r"""Welcome to Day 44 of Corporate & Financial Accounting! Today we conquer Ind AS 112: Disclosure of Interests in Other Entities, converged with International Financial Reporting Standard 12 (IFRS 12). This critical standard serves as the comprehensive disclosure umbrella uniting all group reporting standards: Ind AS 110 (Subsidiaries), Ind AS 111 (Joint Arrangements), Ind AS 28 (Associates), and Unconsolidated Structured Entities.

In modern global corporate finance, financial statement integrity requires total transparency regarding the boundaries of the reporting entity. Investors, credit rating agencies, and statutory regulators cannot accurately assess an enterprise if off-balance-sheet risks, minority leakages, and encumbered assets remain buried in vague footnotes. Under Ind AS 112 Paragraph 1, the overarching objective is to require an entity to disclose information that enables users of its financial statements to evaluate:
(a) The nature of, and risks associated with, its interests in other entities; and
(b) The effects of those interests on its financial position, financial performance, and cash flows.

The first foundational pillar of Ind AS 112 is the mandatory disclosure of 'Significant Judgments and Assumptions'. Under Ind AS 112 Paragraph 7, an enterprise must disclose the significant judgments and assumptions it made (and changes to those judgments) in determining:
1. That it has Control over another entity under Ind AS 110:
   This includes disclosing why an investor controls an investee even if it holds less than half of the voting rights (such as de facto control arising from dispersed shareholdings, or contractual operational rights, or holding substantive potential voting rights like call options). Conversely, it requires explaining why an entity does NOT control an investee even though it holds more than half of the voting rights (e.g. where the entity is under court-ordered liquidation or subject to severe government restrictions).
2. That it has Joint Control over an arrangement under Ind AS 111:
   Explaining the contractual basis for unanimous consent across relevant activities, and the legal rationale for classifying the arrangement as a Joint Operation versus a Joint Venture.
3. That it has Significant Influence over another entity under Ind AS 28:
   Disclosing the basis for significant influence when holding less than 20% of voting rights, or explaining why significant influence is rebutted despite holding 20% or more.
4. The type of Joint Arrangement when structured through a separate vehicle:
   Disclosing how the legal form, contractual terms, and other facts and circumstances were analyzed under Ind AS 111.

Under Ind AS 112 Paragraph 4 and Application Guidance B2–B6, an entity must aggregate or disaggregate its disclosures so that useful information is not obscured by either the inclusion of a large amount of insignificant detail or the aggregating of items that have different risk characteristics. Furthermore, if the entity provides non-contractual financial or other support to a consolidated or unconsolidated investee (for example, stepping in to purchase distressed assets or infuse capital without any pre-existing legal duty), the reasons for providing that support must be fully disclosed to highlight potential moral hazards.

In India, corporate disclosures under Ind AS 112 are closely monitored by the Securities and Exchange Board of India (SEBI) under Regulation 33 and Schedule III of the Companies Act 2013, as well as the National Financial Reporting Authority (NFRA). In addition, Section 129(3) mandates the inclusion of Form AOC-1, ensuring that the Board of Directors presents a clear, comprehensive, and transparent roadmap of the corporate family tree. Under Section 143(3)(i) of the Companies Act 2013, independent statutory auditors must test and certify the operating effectiveness of disclosure management controls within the entity's Internal Financial Controls over Financial Reporting (IFC-FR) architecture, guaranteeing that all off-balance-sheet associations and equity stakes are disclosed without omission."""

part2_say = r"""In Part 2, we engineer the statutory disclosure schedules for Subsidiaries and Material Non-Controlling Interests (NCI) under Ind AS 112 Paragraph 10 through Paragraph 19.

To prevent holding companies from obscuring the operational performance of minority-owned businesses, Ind AS 112 requires granular disclosures regarding group composition and material non-controlling interests.
1. Group Composition Disclosures:
   The reporting entity must disclose the name of each subsidiary, its principal place of business (and country of incorporation if different), and the proportion of ownership interests and voting rights held by the parent.
2. Granular Financial Disclosures for Material NCI:
   Under Ind AS 112 Paragraph 12, for each subsidiary that has non-controlling interests that are material to the reporting entity, the group must disclose:
   - The name of the subsidiary and the proportion of voting rights and ownership held by NCI.
   - The profit or loss allocated to NCI during the reporting period.
   - The accumulated NCI balance in the consolidated balance sheet at the end of the reporting period.
   - Summarized financial information about the assets, liabilities, profit or loss, and cash flows of the subsidiary that enables users to understand the interest that NCI has in the group's activities. This requires presenting: current assets, non-current assets, current liabilities, non-current liabilities, revenue, net profit, total comprehensive income, and dividends paid to NCI, alongside summarized cash flows from operating, investing, and financing activities.

Let us examine Phoenix Industrial Group's material subsidiary, Zenith Sensor Technologies Ltd (20.0% NCI):
- Zenith Total Current Assets = $7,000,000.00; Total Non-Current Assets = $11,000,000.00; Total Assets = $18,000,000.00.
- Zenith Total Current Liabilities = $2,500,000.00; Total Non-Current Liabilities = $3,500,000.00; Total Liabilities = $6,000,000.00.
- Net Identifiable Assets = $\$18,000,000.00 - \$6,000,000.00 = \$12,000,000.00$.
- NCI Equity Share (20.0%) = $\$12,000,000.00 \times 20\% = \$2,400,000.00$.
- Zenith Annual Net Profit = $3,000,000.00; Other Comprehensive Income = $0.00.
- Profit Allocated to NCI = $\$3,000,000.00 \times 20\% = \$600,000.00$.
- Summarized Cash Flows: Cash generated from operations = $3,200,000.00; Net cash used in investing = -$1,800,000.00; Net cash used in financing = -$800,000.00; Net increase in cash = $600,000.00.

Now, examine the crucial disclosure of 'Significant Restrictions' under Ind AS 112 Paragraph 13:
Institutional investors need to know whether cash held by subsidiaries is freely accessible to the parent to service corporate debt or pay group dividends. An entity must disclose:
- Significant restrictions on its ability to access or use the assets and settle the liabilities of the group, such as statutory capital reserves, debt covenants, or foreign exchange controls.
- The nature and extent to which protective rights of non-controlling interests can significantly restrict the entity's ability to access or use the assets and settle the liabilities of the group.
- The carrying amounts in the consolidated financial statements of the assets and liabilities to which those restrictions apply.

In our simulation, Zenith is subject to a commercial term loan agreement with an institutional lender that contractually mandates maintaining a minimum liquidity balance of $1,500,000.00 in a debt service reserve account that cannot be distributed as dividends to Phoenix. Phoenix explicitly discloses this $1,500,000.00 restricted cash covenant in Note 31 of its Consolidated Accounts, alerting equity analysts to liquidity ring-fencing! Furthermore, under Paragraph 18, if Phoenix subsequently changes its ownership percentage in Zenith without losing control, it must present a schedule showing the effects on parent equity and NCI."""

part3_say = r"""In Part 3, we formulate the disclosure framework for Interests in Joint Arrangements and Associates under Ind AS 112 Paragraph 20 through Paragraph 23.

When an enterprise holds material investments in joint ventures or associates accounted for under the equity method, stakeholders require sufficient financial data to evaluate the investees' operational health, indebtedness, and liquidity. Ind AS 112 requires comprehensive summarized financial information for each material joint venture and associate, distinguished from aggregated disclosures for individually immaterial entities.

Under Ind AS 112 Paragraph 21 and Application Guidance B12–B13, the disclosure note must present:
1. Quantitative Summarized Balance Sheet Information:
   - Cash and cash equivalents.
   - Current financial liabilities (excluding trade and other payables and provisions).
   - Non-current financial liabilities (excluding trade and other payables and provisions).
   - Current assets, non-current assets, current liabilities, and non-current liabilities.
2. Quantitative Summarized Income Statement Information:
   - Revenue, depreciation and amortization, interest income, interest expense, and income tax expense.
   - Profit or loss from continuing operations, post-tax profit from discontinued operations, Other Comprehensive Income (OCI), and Total Comprehensive Income.
3. Mandatory Reconciliation to Carrying Amount:
   Under Ind AS 112 Paragraph B14, the reporting entity must provide a formal mathematical reconciliation between the summarized financial information of the associate (specifically its net assets) and the carrying amount of its interest in the associate recognized in the consolidated financial statements!

Let us analyze Phoenix's material 30.0% associate, Quantum Navigation Systems Ltd:
- Quantum Current Assets = $10,000,000.00 (including Cash of $3,500,000.00).
- Quantum Non-Current Assets = $15,000,000.00; Total Assets = $25,000,000.00.
- Quantum Current Liabilities = $4,000,000.00; Non-Current Financial Debt = $5,000,000.00; Total Liabilities = $9,000,000.00.
- Quantum Net Assets = $\$25,000,000.00 - \$9,000,000.00 = \$16,000,000.00$.
- Phoenix's 30% Share of Net Assets = $\$16,000,000.00 \times 30\% = \$4,800,000.00$.
- Downstream Unrealized Profit Elimination Adjustment ($100,000 * 30%) = -$30,000.00.
- Reconciled Carrying Value on Consolidated Balance Sheet:
  $$\text{Carrying Value} = \$4,800,000.00 - \$30,000.00 = \$4,770,000.00$$
- Quantum Operating Revenue = $12,000,000.00; Depreciation = $1,100,000.00; Interest Expense = $400,000.00; Tax Expense = $600,000.00.
- Quantum Net Profit = $1,800,000.00; Phoenix Share of Profit (after $30k elimination) = $510,000.00.
- Quantum Revaluation OCI = $200,000.00; Phoenix Share of OCI = $60,000.00.

In addition, under Ind AS 112 Paragraph 22(c), if an investor has stopped recognizing its share of losses of an associate under the equity method (because the carrying amount has reached zero), the entity must disclose both the unrecognized share of losses for the reporting period and cumulatively. Furthermore, if the associate is a listed company whose shares are actively traded on recognized stock exchanges (such as the National Stock Exchange of India or BSE), Ind AS 112 Paragraph 21(b)(iii) requires disclosure of the fair value of the investment based on quoted market prices, allowing investors to compare carrying value against active stock market capitalization!

Moreover, for all associates and joint ventures that are not individually material, the reporting entity must present aggregated disclosures under Ind AS 112 Paragraph 21(c), disclosing in the aggregate: (1) the carrying amount of its interests in all individually immaterial associates/JVs, (2) the investor's aggregate share of their profit or loss from continuing operations, (3) share of post-tax profit/loss from discontinued operations, (4) share of Other Comprehensive Income, and (5) share of Total Comprehensive Income. Finally, under Paragraph 23, the entity must disclose all commitments relating to its joint ventures (e.g. capital commitments to fund future development) and contingent liabilities incurred in relation to its interests, ensuring that off-balance-sheet exposure is fully visible to credit rating agencies and debenture trustees."""

part4_say = r"""In Part 4, we examine one of the most vital post-financial crisis transparency mandates: Disclosures for Unconsolidated Structured Entities under Ind AS 112 Paragraph 24 through Paragraph 31.

A 'Structured Entity' (formerly known as a Special Purpose Entity or SPE) is an entity that has been designed so that voting or similar rights are not the dominant factor in deciding who controls the entity—such as when any voting rights relate to administrative tasks only and the relevant activities are directed by means of contractual arrangements. Typical indicators of a structured entity include: (a) restricted operational activities, (b) a narrow and well-defined objective (e.g. executing an automated receivables securitization or research program), (c) insufficient equity capital to finance its activities without subordinated financial support, and (d) financing in the form of multiple contractually linked instruments issued to investors.

Historically, corporate entities utilized structured entities to execute aggressive off-balance-sheet financing, shifting debt off the balance sheet while retaining significant hidden risks (as seen in global corporate bankruptcies). Ind AS 112 establishes rigorous disclosure requirements for entities that have an interest in an UNCONSOLIDATED structured entity (where the reporting entity sponsored or invested in the vehicle but does not have control under Ind AS 110).

Under Ind AS 112 Paragraph 26 and Paragraph 29, the enterprise must disclose:
1. Qualitative Nature and Purpose:
   The nature, purpose, size, and activities of the structured entity and how the structured entity is financed.
2. Balance Sheet Carrying Amounts:
   The carrying amounts of the assets and liabilities recognized in the reporting entity's financial statements relating to its interests in unconsolidated structured entities, alongside the specific line items in which they are presented.
3. Maximum Exposure to Loss:
   The amount that best represents the entity's maximum exposure to loss from its interests in unconsolidated structured entities, including how the maximum exposure to loss is determined. If the entity cannot quantify its maximum exposure to loss, it must disclose that fact and the reasons.
4. Sponsored Entities with No Interest at Reporting Date (Ind AS 112 Paragraph 27):
   If an entity sponsored an unconsolidated structured entity for which it does not hold an interest at the reporting date, it must disclose: how it defines sponsorship, income from those entities during the reporting period (e.g., servicing fees, management fees), and the carrying amount of all assets transferred to those structured entities during the reporting period.

Let us inspect Phoenix Industrial Group's interest in the 'Aerospace Innovation Securitization Trust':
- Total Trust Assets = $50,000,000.00 (specialized aerospace receivables securitized).
- Phoenix sponsored the trust to monetize receivables and invested in subordinated credit enhancement notes: Carrying Value of Subordinated Debt Held = $2,000,000.00 (presented under Non-Current Financial Assets).
- In addition, Phoenix provided a first-loss liquidity guarantee contract capped at $3,000,000.00.
- Maximum Exposure to Loss Computation:
  $$\text{Maximum Exposure to Loss} = \text{Carrying Amount of Debt} + \text{Liquidity Guarantee}$$
  $$\text{Maximum Exposure} = \$2,000,000.00 + \$3,000,000.00 = \$5,000,000.00$$
By explicitly disclosing that Phoenix's maximum loss is capped at $5,000,000.00 against a $50M trust, investors receive complete clarity that Phoenix cannot be forced to absorb the trust's entire $50M liability portfolio!

Furthermore, under Ind AS 112 Paragraph 30, the entity must provide a tabular comparison reconciling the carrying amounts of assets and liabilities recognized in its balance sheet relating to its interests in unconsolidated structured entities against the maximum exposure to loss. If the entity has also entered into derivative contracts (such as credit default swaps, interest rate caps, or total return swaps) with the structured entity, or has commitments to repurchase assets upon credit deterioration, these contractual mechanisms and potential cash drain scenarios must be explicitly quantified in the explanatory narrative."""

part5_say = r"""In Part 5, we execute our deterministic Python disclosure suite `GroupDisclosuresEngine`, verify every disclosure assertion, and review the corporate reporting sign-off protocols.

Let us trace the complete algorithmic execution of our software platform:
1. Material NCI Subsidiary Module (Zenith Sensor Technologies Ltd):
   - Computes net assets of $12,000,000.00 from total assets of $18,000,000.00 and liabilities of $6,000,000.00.
   - Accurately establishes the 20% NCI equity balance of $2,400,000.00 and profit allocation of $600,000.00.
   - Formulates the statutory disclosure note highlighting the $1,500,000.00 restricted cash covenant.
2. Material Associate Module (Quantum Navigation Systems Ltd):
   - Analyzes Quantum's net assets of $16,000,000.00.
   - Reconciles Phoenix's 30% share ($4,800,000.00) adjusted for the $30,000.00 unrealized profit elimination to confirm the exact balance sheet carrying amount of $4,770,000.00.
   - Formulates disclosures for share of profit ($510,000.00) and share of OCI ($60,000.00).
3. Unconsolidated Structured Entity Module (Aerospace Innovation Securitization Trust):
   - Reports the total trust size of $50,000,000.00.
   - Discloses the balance sheet asset carrying value of $2,000,000.00 (subordinated debt).
   - Accurately computes and discloses the Maximum Exposure to Loss of $5,000,000.00 (incorporating the $3M liquidity guarantee).

Now, observe how these disclosure modules are integrated into the annual report under Division II of Schedule III:
- Note 31: Group Structure & Subsidiaries with Material NCI (presenting summarized financial position, cash flows, and restricted cash disclosures).
- Note 32: Interests in Joint Ventures & Associates (presenting summarized P&L, OCI, and formal reconciliation to the $4.77M carrying value).
- Note 33: Unconsolidated Structured Entities (disclosing the $50M securitization trust and $5M maximum loss exposure).
- Statutory Appendix: Form AOC-1 attached to the Board Report under Section 129(3) of the Companies Act 2013, providing salient features of all group entities.

The Chief Accounting Officer and Chief Financial Officer formally certify the completeness and accuracy of the disclosure tables before presenting them to the Board Audit Committee. The Audit Committee reviews the disclosures against the company's risk management framework, verifying that all credit guarantees, liquidity commitments, and potential voting rights are captured without discrepancy. Furthermore, the disclosures are reconciled with Operating Segment reporting under Ind AS 108, ensuring that revenues and asset allocations in the segment notes align seamlessly with the entity-level data in Ind AS 112.

The statutory auditors perform rigorous audit verification under Standard on Auditing (SA) 600 (Using the Work of Another Auditor) and NFRA quality standards. The auditors verify that all disclosures cross-reference seamlessly to component auditor working papers, audited subsidiary accounts, registered valuation certificates, and bank debt covenants, issuing an unqualified audit opinion on the consolidated financial statements and disclosure notes.

As we conclude Day 44, you have assembled the complete statutory reporting toolkit for multi-entity corporate architectures. Tomorrow in Day 45, we culminate Block 9 with the Milestone 9 Grand Capstone: Multi-National Enterprise Group Consolidation & M&A Reporting Simulator. You will step into the executive role of Group Chief Financial Officer to simultaneously execute the acquisition method under Ind AS 103, line-by-line consolidations and intercompany profit eliminations under Ind AS 110, joint arrangement and associate equity accounting under Ind AS 111 and 28, and statutory transparency disclosures under Ind AS 112.

Our automated validation framework executes programmatic assertion tests across every output field, confirming that no mathematical discrepancy or rounding anomaly exists within the corporate reporting pipeline. Every calculation reconciles to the exact cent, ensuring complete compliance with the Ind AS framework. When our Python simulation engine executes, every single assertion and statutory check validates with zero discrepancy, culminating in the terminal confirmation string:
`IND_AS_112_GROUP_DISCLOSURES_SUITE_PASS`."""

day44_lesson = {
    "coursePrefix": "bcom-accounting",
    "day": 44,
    "title": "Ind AS 112 Disclosure of Interests in Other Entities: Statutory Schedules & Transparency Architecture",
    "parts": [
        {
            "part": 1,
            "title": "Strategic Objective & Core Governance Architecture of Ind AS 112",
            "say": part1_say,
            "code": day44_code,
            "output": day44_output,
            "check": {
                "question": "What is the primary overarching objective of Ind AS 112?",
                "options": [
                    "To enable users to evaluate the nature, risks, and financial effects of an entity's interests in other entities",
                    "To completely conceal all minority ownership stakes from equity research analysts",
                    "To eliminate all statutory footnote disclosures from corporate annual reports",
                    "To mandate that all structured entities be liquidated immediately"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "Ind AS 112 Paragraph 1 mandates comprehensive disclosures enabling users to evaluate the nature of, risks associated with, and financial effects of interests in other entities.",
                "why": "Ind AS 112 Paragraph 1 mandates comprehensive disclosures enabling users to evaluate the nature of, risks associated with, and financial effects of interests in other entities."
            }
        },
        {
            "part": 2,
            "title": "Disclosures for Subsidiaries & Material Non-Controlling Interests (NCI)",
            "say": part2_say,
            "code": day44_code,
            "output": day44_output,
            "check": {
                "question": "Under Ind AS 112 Paragraph 13, why must an entity disclose significant restrictions on cash transfers from subsidiaries?",
                "options": [
                    "To alert investors to borrowing covenants or legal barriers preventing the parent from accessing subsidiary cash",
                    "Because all subsidiary cash is automatically transferred to the central tax authority",
                    "To avoid paying audit fees to independent statutory auditors",
                    "Because subsidiaries are legally prohibited from holding cash"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "Ind AS 112 Paragraph 13 requires disclosing significant restrictions so investors can assess whether cash held by subsidiaries is freely accessible to the parent.",
                "why": "Ind AS 112 Paragraph 13 requires disclosing significant restrictions so investors can assess whether cash held by subsidiaries is freely accessible to the parent."
            }
        },
        {
            "part": 3,
            "title": "Disclosures for Joint Arrangements & Associates (Ind AS 112 Paragraph 20–23)",
            "say": part3_say,
            "code": day44_code,
            "output": day44_output,
            "check": {
                "question": "Under Ind AS 112 Paragraph B14, what reconciliation must be provided for material associates?",
                "options": [
                    "A formal reconciliation between summarized financial information of the associate and the carrying amount of the investment",
                    "A reconciliation between total revenue and the CEO's annual compensation",
                    "A reconciliation between historical cost and the current price of gold",
                    "No reconciliation is permitted under Ind AS 112"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "Ind AS 112 Paragraph B14 requires a formal reconciliation between the net assets in the summarized financial information of the associate and the carrying amount of the interest.",
                "why": "Ind AS 112 Paragraph B14 requires a formal reconciliation between the net assets in the summarized financial information of the associate and the carrying amount of the interest."
            }
        },
        {
            "part": 4,
            "title": "Disclosures for Unconsolidated Structured Entities (Ind AS 112 Paragraph 24–31)",
            "say": part4_say,
            "code": day44_code,
            "output": day44_output,
            "check": {
                "question": "In the Phoenix case study ($2M subordinated debt + $3M liquidity guarantee for a $50M trust), what is Phoenix's Maximum Exposure to Loss?",
                "options": [
                    "$5,000,000.00 ($2M debt carrying value + $3M guarantee contract limit)",
                    "$50,000,000.00 equal to the total asset size of the securitization trust",
                    "Zero, because the structured entity is unconsolidated",
                    "$2,000,000.00 limited strictly to the balance sheet debt asset"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "Under Ind AS 112 Paragraph 29, Maximum Exposure to Loss is the sum of the carrying amount of assets held ($2M) plus contractually committed financial guarantees ($3M) = $5,000,000.00.",
                "why": "Under Ind AS 112 Paragraph 29, Maximum Exposure to Loss is the sum of the carrying amount of assets held ($2M) plus contractually committed financial guarantees ($3M) = $5,000,000.00."
            }
        },
        {
            "part": 5,
            "title": "Executing the Python Disclosures Suite & Group Governance Sign-Off",
            "say": part5_say,
            "code": day44_code,
            "output": day44_output,
            "check": {
                "question": "What is the final confirmation string emitted by the Group Disclosures Engine?",
                "options": [
                    "IND_AS_112_GROUP_DISCLOSURES_SUITE_PASS",
                    "DISCLOSURE_VALIDATION_FAILED_RECONCILIATION_ERROR",
                    "STRUCTURED_ENTITY_EXPOSURE_REJECTED",
                    "GROUP_TRANSPARENCY_TERMINATED_UNKNOWN"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "The Group Disclosures Engine validates all material NCI schedules, associate reconciliations, and structured entity exposures, concluding with IND_AS_112_GROUP_DISCLOSURES_SUITE_PASS.",
                "why": "The Group Disclosures Engine validates all material NCI schedules, associate reconciliations, and structured entity exposures, concluding with IND_AS_112_GROUP_DISCLOSURES_SUITE_PASS."
            }
        }
    ]
}

total_words = 0
for p in day44_lesson["parts"]:
    wc = count_words(p["say"])
    total_words += wc
    print(f"Day 44 Part {p['part']} words: {wc}")

for p in day44_lesson["parts"]:
    wc = count_words(p["say"])
    assert wc >= 580, f"Part {p['part']} word count {wc} < 580"

print(f"Day 44 Total words: {total_words}")
assert total_words >= 3000, f"Total word count {total_words} < 3000"

with open("scripts/bcom_acc_day44.json", "w", encoding="utf-8") as f:
    json.dump(day44_lesson, f, indent=2)

print("Saved scripts/bcom_acc_day44.json successfully!")
