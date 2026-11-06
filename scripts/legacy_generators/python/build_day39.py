import json
import re

def count_words(text):
    return len(re.findall(r'\b[A-Za-z0-9_-]+\b', text))

day39_code = """# Day 39: Ind AS 37 Provisions, Contingent Liabilities & Restructuring Engine
# Simulates Decommissioning Discount Unwinding, Qualifying Restructuring Provisions, and Tripartite Legal Classifications.

from dataclasses import dataclass
from typing import List, Dict

@dataclass
class RestructuringCostItem:
    description: str
    amount: float
    is_direct_restructuring_cost: bool

@dataclass
class LegalClaim:
    claim_id: str
    estimated_amount: float
    probability_pct: float

class IndAS37ProvisionsEngine:
    def __init__(self, enterprise_name: str):
        self.enterprise_name = enterprise_name

    def compute_decommissioning_provision(
        self,
        future_cost: float,
        term_years: int,
        discount_rate: float,
        year: int
    ) -> Dict[str, float]:
        \"\"\"Module 1: Present value discounting and finance cost unwinding under Ind AS 37.\"\"\"
        initial_pv = future_cost / ((1.0 + discount_rate) ** term_years)
        carrying_provision = initial_pv
        finance_costs = []
        for y in range(1, year + 1):
            unwinding_charge = carrying_provision * discount_rate
            carrying_provision += unwinding_charge
            finance_costs.append(unwinding_charge)

        return {
            "initial_capitalized_pv": round(initial_pv, 2),
            "year_unwinding_finance_cost": round(finance_costs[year - 1], 2),
            "year_end_carrying_provision": round(carrying_provision, 2)
        }

    def compute_restructuring_provision(self, cost_items: List[RestructuringCostItem]) -> Dict[str, float]:
        \"\"\"Module 2: Filters direct restructuring costs from ongoing operating expenditures.\"\"\"
        qualifying_provision = 0.0
        disallowed_operating_costs = 0.0

        for item in cost_items:
            if item.is_direct_restructuring_cost:
                qualifying_provision += item.amount
            else:
                disallowed_operating_costs += item.amount

        return {
            "qualifying_restructuring_provision": round(qualifying_provision, 2),
            "disallowed_ongoing_operating_costs": round(disallowed_operating_costs, 2),
            "total_budgeted_spend": round(qualifying_provision + disallowed_operating_costs, 2)
        }

    def classify_legal_contingencies(self, claims: List[LegalClaim]) -> Dict[str, any]:
        \"\"\"Module 3: Classifies claims into Provisions (>50%), Contingent Liabilities (5-50%), Remote (<5%).\"\"\"
        provisions_recognized = 0.0
        contingent_liabilities_disclosed = 0.0
        remote_claims_ignored = 0.0

        for c in claims:
            if c.probability_pct > 50.0:
                provisions_recognized += c.estimated_amount
            elif c.probability_pct >= 5.0:
                contingent_liabilities_disclosed += c.estimated_amount
            else:
                remote_claims_ignored += c.estimated_amount

        return {
            "provisions_recognized_on_balance_sheet": round(provisions_recognized, 2),
            "contingent_liabilities_footnote_disclosure": round(contingent_liabilities_disclosed, 2),
            "remote_claims_no_disclosure": round(remote_claims_ignored, 2)
        }

engine = IndAS37ProvisionsEngine("AeroSpace Defense Systems Ltd")

decom = engine.compute_decommissioning_provision(500000.0, 5, 0.08, 1)
assert decom["initial_capitalized_pv"] == 340291.60
assert decom["year_unwinding_finance_cost"] == 27223.33
assert decom["year_end_carrying_provision"] == 367514.93

restruct_items = [
    RestructuringCostItem("Employee Redundancy Severance", 450000.0, is_direct_restructuring_cost=True),
    RestructuringCostItem("Onerous Lease Early Exit Penalty", 120000.0, is_direct_restructuring_cost=True),
    RestructuringCostItem("Retraining of Retained Staff", 80000.0, is_direct_restructuring_cost=False),
    RestructuringCostItem("Relocation of IT Data Centers", 50000.0, is_direct_restructuring_cost=False),
]
restruct = engine.compute_restructuring_provision(restruct_items)
assert restruct["qualifying_restructuring_provision"] == 570000.0
assert restruct["disallowed_ongoing_operating_costs"] == 130000.0

claims = [
    LegalClaim("Claim_A_Breach_of_Supply_Contract", 200000.0, 75.0),
    LegalClaim("Claim_B_Patent_Infringement_Dispute", 500000.0, 30.0),
    LegalClaim("Claim_C_Frivolous_Customer_Lawsuit", 100000.0, 3.0),
]
legal = engine.classify_legal_contingencies(claims)
assert legal["provisions_recognized_on_balance_sheet"] == 200000.0
assert legal["contingent_liabilities_footnote_disclosure"] == 500000.0
assert legal["remote_claims_no_disclosure"] == 100000.0

print(f"Enterprise: {engine.enterprise_name}")
print(f"Decommissioning Initial PV: ${decom['initial_capitalized_pv']} | Y1 Unwinding: ${decom['year_unwinding_finance_cost']}")
print(f"Restructuring Qualifying Provision: ${restruct['qualifying_restructuring_provision']} (Disallowed: ${restruct['disallowed_ongoing_operating_costs']})")
print(f"Balance Sheet Provisions Recognized: ${legal['provisions_recognized_on_balance_sheet']}")
print(f"Contingent Liabilities Footnote Disclosed: ${legal['contingent_liabilities_footnote_disclosure']}")
print("IND_AS_37_PROVISIONS_CONTINGENCIES_PASS")
"""

day39_output = """Enterprise: AeroSpace Defense Systems Ltd
Decommissioning Initial PV: $340291.6 | Y1 Unwinding: $27223.33
Restructuring Qualifying Provision: $570000.0 (Disallowed: $130000.0)
Balance Sheet Provisions Recognized: $200000.0
Contingent Liabilities Footnote Disclosed: $500000.0
IND_AS_37_PROVISIONS_CONTINGENCIES_PASS"""

part1_say = r"""Welcome to Day 39 of Corporate & Financial Accounting. Today we explore one of the most critical legal, operational, and financial governance standards in global corporate reporting: Indian Accounting Standard (Ind AS) 37 and International Accounting Standard (IAS) 37, 'Provisions, Contingent Liabilities and Contingent Assets'. In enterprise management, corporations constantly navigate commercial litigations, regulatory enforcement inquiries, product warranty obligations, environmental cleanup mandates, and major organizational restructuring programs. Understanding how to legally classify, measure, and report these uncertain future cash outflows is essential for corporate controllers, legal counsels, and statutory auditors.

To understand the core purpose of Ind AS 37, we must examine the corporate abuses of the past. Prior to the introduction of standard provisions accounting, companies engaged in aggressive earnings manipulation known as 'Big Bath Accounting' or 'Cookie Jar Reserving'. During exceptionally profitable years, management would create massive, arbitrary 'general contingency reserves' to depress reported profits and hide taxable earnings. Then, during lean or unprofitable years, management would reverse those unneeded reserves back into the Profit and Loss account to artificially inflate net earnings and meet Wall Street bonus targets! Ind AS 37 was explicitly enacted to completely eliminate this practice: general, arbitrary, or unprovable provisions are strictly prohibited!

Ind AS 37 establishes a clear tripartite classification framework for uncertain obligations:
1. Provisions: A provision is defined as a 'liability of uncertain timing or amount'. Unlike trade payables (which have agreed invoices and due dates) or standard accruals (which represent services received where timing and amount are known with high certainty, such as accrued utility bills), a provision involves significant management estimation. A provision MUST be recognized on the face of the Balance Sheet as a formal liability!
2. Contingent Liabilities: A contingent liability is defined as:
   - A POSSIBLE obligation that arises from past events and whose existence will be confirmed only by the occurrence or non-occurrence of one or more uncertain future events not wholly within the control of the entity (e.g. pending patent litigation); OR
   - A PRESENT obligation that arises from past events but is NOT recognized on the balance sheet because either: (a) it is NOT probable that an outflow of resources embodying economic benefits will be required to settle the obligation, OR (b) the amount of the obligation cannot be measured with sufficient reliability.
   Crucially, Contingent Liabilities are NEVER recognized on the Balance Sheet! They are disclosed exclusively in the Notes to Accounts, unless the possibility of an outflow of resources is Remote.
3. Contingent Assets: A contingent asset is a possible asset that arises from past events whose existence will be confirmed only by uncertain future events (e.g. an insurance claim under dispute). Under the principle of prudence, contingent assets are NEVER recognized on the balance sheet until realization is 'Virtually Certain' (100% confirmed). If an inflow of economic benefits is Probable (>50%), it is disclosed in the footnotes.

Furthermore, Ind AS 37 makes a pivotal distinction between 'Legal Obligations' and 'Constructive Obligations'. A legal obligation is an obligation that derives from a contract, statutory legislation, or other operation of law. A constructive obligation is an obligation that derives from an entity's actions where: (a) by an established pattern of past practice, published policies, or a sufficiently specific current statement, the entity has indicated to other parties that it will accept certain responsibilities; and (b) as a result, the entity has created a valid expectation on the part of those other parties that it will discharge those responsibilities. For example, if a chemical manufacturer has no statutory obligation to clean up soil contamination in a foreign jurisdiction, but has a published environmental charter and established history of cleaning up all contamination, a Constructive Obligation exists, mandating full provision recognition!"""

part2_say = r"""In Part 2, we dismantle the Three Mandatory Recognition Criteria and analyze environmental decommissioning provisions under Ind AS 37 and Ind AS 16.

Under Ind AS 37 Paragraph 14, an entity is legally permitted and required to recognize a Provision on its balance sheet IF, AND ONLY IF, ALL THREE of the following cumulative criteria are met:
1. The entity has a PRESENT OBLIGATION (legal or constructive) as a result of a PAST EVENT (known as an 'Obligating Event'); AND
2. It is PROBABLE that an outflow of resources embodying economic benefits will be required to settle the obligation; AND
3. A RELIABLE ESTIMATE can be made of the amount of the obligation.
If any single one of these three conditions is not satisfied, NO PROVISION CAN BE RECOGNIZED!

Let us dissect each criterion in deep operational detail:
- Criterion 1: Present Obligation from a Past Event (The Obligating Event):
  An obligating event is an event that creates a legal or constructive obligation that results in an entity having no realistic alternative to settling that obligation. Crucially, financial statements deal with the financial position of an entity at the end of its reporting period, NOT its possible position in the future! Therefore, no provision can be recognized for costs that need to be incurred to operate in the future.
  * For example, consider an airline required by aviation safety regulations to overhaul its aircraft engines every 3 years at a cost of $2,000,000. Can the airline accrue a provision for the future overhaul over the 3 years? NO! The entity has no present obligation: it can avoid the future overhaul by grounding the aircraft, selling the fleet, or leasing replacement planes. The cost of future maintenance relates to future operations, so no provision can be recognized until the maintenance is actually performed!
  * In contrast, consider an offshore oil drilling rig installed in the ocean. The environmental licensing agreement mandates that upon cessation of drilling in 20 years, the company must dismantle the platform and restore the seabed. Here, the construction and installation of the platform is the PAST OBLIGATING EVENT; the entity has an unavoidable legal obligation to restore the seabed. A provision MUST be recognized immediately!

- Criterion 2: Probable Outflow of Resources:
  In Ind AS 37 jurisprudence, 'Probable' is mathematically defined as: 'more likely than not'—representing a probability strictly greater than 50% ($P > 0.50$). If the likelihood of an outflow is 50% or less, it is classified as a 'Possible' obligation, transforming the item into a Contingent Liability disclosed in the notes. If the likelihood drops below 5%, it is classified as 'Remote', requiring zero disclosure!

- Criterion 3: Reliable Estimate:
  Except in extremely rare cases, an entity can determine a range of possible outcomes and make an estimate of the obligation that is sufficiently reliable to use in recognizing a provision. Paragraph 26 explicitly notes that the use of estimates is an essential part of the preparation of financial statements and does not undermine their reliability. If no reliable estimate can be made, a contingent liability is disclosed.

Controllers must also examine future statutory changes. If a government proposes new environmental legislation that will require industrial decontamination, does that proposed law create a present obligation before it is formally enacted? Under Ind AS 37 Paragraph 22, an obligation arises from legislation ONLY WHEN the legislation is VIRTUALLY CERTAIN to be enacted as drafted. In democratic legislative processes, amendments and delays are common, so no obligating event exists until enactment is virtually certain. Furthermore, management cannot avoid an existing legal obligation by intending to contest the liability in court: the existence of a formal legal claim alleging past harm creates a present legal obligation that must be evaluated under the probability and reliable estimate criteria."""

part3_say = r"""In Part 3, we analyze the Measurement Principles under Ind AS 37: Best Estimate, Present Value Discounting, and Discount Unwinding as Finance Costs.

The amount recognized as a provision must be the 'Best Estimate' of the expenditure required to settle the present obligation at the end of the reporting period. The best estimate is the amount that an entity would rationally pay to settle the obligation at the balance sheet date or to transfer it to a third party.
Ind AS 37 establishes two mathematical approaches depending on the nature of the obligation:
1. Expected Value Method (For a Large Population of Items): Where the provision being measured involves a large population of items (such as product warranties across 100,000 laptops sold), the obligation is estimated by weighting all possible outcomes by their associated probabilities:
   $Expected Value = \sum_{i=1}^{n} (Outcome_i \times Probability_i)$.
2. Mid-Point of a Continuous Range: Where there is a continuous range of possible outcomes and each point in that range is as likely as any other, the mid-point of the range is used.
3. Single Most Likely Outcome (For a Single Specific Obligation): Where a single obligation is being measured (such as a major legal lawsuit or an environmental disaster penalty), the individual most likely outcome is usually the best estimate of the liability.

Now, let us examine the vital principle of PRESENT VALUE DISCOUNTING under Paragraph 45:
"Where the effect of the time value of money is material, the amount of a provision shall be the PRESENT VALUE of the expenditures expected to be required to settle the obligation."
When an enterprise incurs an obligation that will be settled many years in the future (such as asset retirement and site restoration obligations maturing in 5 to 30 years), recognizing the undiscounted nominal liability would severely overstate the enterprise's current debt burden!
- The discount rate must be a PRE-TAX rate that reflects current market assessments of the time value of money and the risks specific to the liability.
- The discount rate must NOT reflect risks for which future cash flow estimates have already been adjusted.

In evaluating the best estimate of a provision, entities must also consider potential Future Events under Ind AS 37 Paragraphs 48–50. Future events that may affect the amount required to settle an obligation (such as expected technological advancements in decommissioning or new waste treatment techniques) must be reflected in the provision amount ONLY where there is sufficient objective evidence that they will occur. However, expected disposal gains on assets (such as the scrap recovery value of decommissioned steel) CANNOT be deducted from the provision carrying amount! Gains from the expected disposal of assets must be recognized separately when realized under Ind AS 16.

Let us trace the multi-year accounting mechanics for a Decommissioning Provision:
Assume AeroSpace Defense Systems Ltd builds a testing facility and incurs an obligation to dismantle and decontaminate the site in 5 years, with an estimated future cost of $500,000. The pre-tax risk-adjusted discount rate is 8.0%:
- Initial Capitalized Present Value:
  $PV = \frac{\$500,000}{(1.08)^5} = \$340,291.60$.
  * Accounting Entry at Inception:
    - Debit: Property, Plant & Equipment (Decommissioning Asset Cost) — $\$340,291.60$
    - Credit: Provision for Decommissioning (Non-Current Liability) — $\$340,291.60$
    *(Note: The initial provision cost is capitalized into the asset carrying amount under Ind AS 16 and depreciated over the 5-year facility life!)*
- Year 1 Discount Unwinding (Finance Cost):
  As time passes, the discount unwinds! In Year 1, the liability must grow toward its ultimate $500,000 maturity value:
  * Unwinding Charge = $\$340,291.60 \times 8.0\% = \$27,223.33$.
  * Accounting Entry at Year 1 Close:
    - Debit: Finance Costs (Profit & Loss) — $\$27,223.33$
    - Credit: Provision for Decommissioning (Liability) — $\$27,223.33$
  * Ending Carrying Amount of Provision at end of Year 1 = $\$340,291.60 + \$27,223.33 = \$367,514.93$.
  Crucially, the unwinding of the discount is recognized strictly as an INTEREST EXPENSE (Finance Cost) in P&L; it can never be classified as an operating or environmental expense!"""

part4_say = r"""In Part 4, we examine Restructuring Provisions, Onerous Contracts, and the strict boundaries separating direct restructuring costs from ongoing operating expenses.

A Restructuring is a program that is planned and controlled by management, and materially changes either the scope of a business undertaken by an entity or the manner in which that business is conducted. Examples include the sale or termination of a line of business, the closure of business locations in a country or region, the relocation of business activities, or fundamental reorganizations of corporate management structures.

Under Ind AS 37 Paragraph 72, a Board of Directors decision alone DOES NOT create a constructive obligation! A management decision made before the year-end date does not give rise to a constructive obligation unless, BEFORE THE END OF THE REPORTING PERIOD, the entity has:
1. Developed a DETAILED FORMAL PLAN for the restructuring identifying at least:
   - The business or part of a business concerned;
   - The principal locations affected;
   - The location, function, and approximate number of employees who will be compensated for terminating their services;
   - The expenditures that will be undertaken; and
   - When the plan will be implemented; AND
2. Raised a VALID EXPECTATION in those affected that it will carry out the restructuring by starting to implement that plan or announcing its main features to those affected by it (such as formal notices sent to employees or trade unions).

Next, controllers must enforce the strict boundary of QUALIFYING RESTRUCTURING COSTS under Paragraph 80:
A restructuring provision SHALL INCLUDE ONLY DIRECT EXPENDITURES ARISING FROM THE RESTRUCTURING, which are those that are BOTH:
1. Necessarily entailed by the restructuring; AND
2. NOT associated with the ONGOING ACTIVITIES of the entity!

Let us analyze the critical inclusions and statutory exclusions:
- Qualifying Expenditures (Included in Restructuring Provision):
  * Voluntary redundancy severance compensation paid to terminated employees ($450,000).
  * Contract termination penalties for early cancellation of commercial office leases ($120,000).
  * Direct legal and advisory fees required to execute the closure.
- Statutory Disallowances (STRICTLY EXCLUDED from Provision):
  * Retraining or relocating continuing staff ($80,000): Relates to the future conduct of the business and must be expensed as incurred in future periods.
  * Marketing and brand rebuilding campaigns for retained business units: Future operating expense.
  * Investments in new software systems or data center infrastructure relocation ($50,000): Capital asset or ongoing IT operating expenditure.
  * Future operating losses up to the date of restructuring closure: Ind AS 37 explicitly prohibits provisioning for future operating losses!

Another critical corporate application of Ind AS 37 is the treatment of 'Onerous Leases' following the adoption of Ind AS 116. Under legacy accounting, entities recognized separate onerous lease provisions for vacant office space. Under Ind AS 116, the Right-of-Use (ROU) asset is recognized on the balance sheet at lease inception. Therefore, when a leased facility becomes vacant or uneconomic, the entity does NOT create a separate provision under Ind AS 37! Instead, the entity must test the ROU asset for IMPAIRMENT under Ind AS 36 'Impairment of Assets', writing down the carrying amount of the ROU asset to its recoverable amount. A separate provision under Ind AS 37 is recognized only for contractual lease exit penalties or contractual liabilities in excess of the written-off ROU asset.

Finally, controllers must master ONEROUS CONTRACTS under Paragraphs 66–69:
An onerous contract is a contract in which the unavoidable costs of meeting the obligations under the contract exceed the economic benefits expected to be received under it. The unavoidable costs reflect the LEAST NET COST of exiting from the contract, which is the lower of:
1. The cost of fulfilling the contract; AND
2. Any compensation or penalties arising from failure to fulfill it."""

part5_say = r"""In Part 5, we execute our Python Ind AS 37 Provisions Engine, verify all statutory assertions, and review the balance sheet and footnote disclosures.

Now, inspect our standalone Python class `IndAS37ProvisionsEngine`. This platform executes the three core modules of Ind AS 37 for AeroSpace Defense Systems Ltd:
1. Decommissioning Discount Unwinding Module:
   - Evaluates the $500,000 site rehabilitation obligation maturing in 5 years at an 8% pre-tax discount rate.
   - Capitalizes initial present value of $\$340,291.60$ into property, plant, and equipment.
   - Computes Year 1 discount unwinding of $\$27,223.33$, advancing the carrying liability to $\$367,514.93$.
2. Restructuring Provision Boundary Filter:
   - Filters a $700,000 enterprise reorganization budget.
   - Accepts Qualifying Direct Costs: Employee Severance ($\$450,000$) + Lease Cancellation Penalty ($\$120,000$) = $\$570,000.00$ Provision recognized on the Balance Sheet.
   - Disallows Ongoing Operating Costs: Retraining ($\$80,000$) + IT Relocation ($\$50,000$) = $\$130,000.00$, preserving earnings integrity and preventing Big Bath abuse.
3. Legal Claims Tripartite Classification Engine:
   - Claim A (Supply Breach): Probability 75% ($>50\%$), amount $\$200,000 \rightarrow$ Recognized as a formal Balance Sheet Provision.
   - Claim B (Patent Infringement): Probability 30% ($5\% - 50\%$), amount $\$500,000 \rightarrow$ Disclosed in Notes as a Contingent Liability.
   - Claim C (Frivolous Lawsuit): Probability 3% ($<5\%$), amount $\$100,000 \rightarrow$ Classified as Remote; zero disclosure required.

Let us trace the complete financial narrative revealed by our simulation. In Module 1, the method `compute_decommissioning_provision` discounts the future $\$500,000$ obligation across 5 years at 8%, capitalizing $\$340,291.60$ into PPE. It advances time by one year, computing the exact interest unwinding charge of $\$27,223.33$ and growing the balance sheet liability to $\$367,514.93$. In Module 2, `compute_restructuring_provision` evaluates the $\$700,000$ corporate turnaround budget, accepting $\$450,000$ severance and $\$120,000$ lease exit penalties into a $\$570,000$ qualifying provision while rejecting $\$130,000$ of ongoing retraining and relocation costs. In Module 3, `classify_legal_contingencies` sorts corporate claims into their strict regulatory buckets: recognizing $\$200,000$ on the balance sheet, disclosing $\$500,000$ in footnotes, and filtering $\$100,000$ of remote claims.

Let us review the corporate governance and disclosure mandates under Ind AS 37 Paragraph 84:
For each class of provision, entities must present a complete Roll-Forward Table disclosing:
1. Opening carrying amount at the beginning of the period.
2. Additional provisions made in the period, including increases to existing provisions.
3. Amounts used (incurred and charged against the provision) during the period.
4. Unused amounts reversed during the period.
5. The increase during the period in the discounted amount arising from the passage of time (unwinding of discount) and the effect of any change in the discount rate.

Furthermore, management must provide a brief description of the nature of the obligation, expected timing of resulting economic outflows, and an indication of the uncertainties about the amount or timing of those outflows, including major assumptions concerning future events and any expected reimbursements.

Upon execution of our Python validation engine, every single mathematical and statutory assertion resolves with 100% precision, culminating in the terminal triumph confirmation string:
`IND_AS_37_PROVISIONS_CONTINGENCIES_PASS`.
You have now conquered the principles of provisions, contingent liabilities, restructuring reserves, and decommissioning under Ind AS 37. In Day 40, we will reach the grand Milestone 8 Capstone, where you will integrate Ind AS 102, Ind AS 12, Ind AS 33, and Ind AS 37 into an executive Corporate Tax, Equity & Capital Reporting Simulator, establishing yourself as an expert corporate controller with full command over statutory disclosures and corporate balance sheets!"""

day39_lesson = {
    "coursePrefix": "bcom-accounting",
    "day": 39,
    "title": "Ind AS 37 & IAS 37: Provisions, Contingent Liabilities, Restructuring Reserves & Decommissioning",
    "parts": [
        {
            "part": 1,
            "title": "Elimination of 'Big Bath' Reserving, The Tripartite Framework & Constructive Obligations",
            "say": part1_say,
            "code": day39_code,
            "output": day39_output,
            "check": {
                "question": "What is the primary difference between a Provision and a Contingent Liability under Ind AS 37?",
                "options": [
                    "A Provision is a present liability of uncertain timing or amount recognized on the balance sheet, whereas a Contingent Liability is a possible obligation disclosed only in the notes",
                    "A Provision is disclosed only in the footnotes, while a Contingent Liability is recognized on the balance sheet",
                    "A Provision is recognized only when an outflow is 100% virtually certain",
                    "There is no difference; both terms are used interchangeably under Ind AS"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "Provisions meet the definition of a liability and are recognized on the balance sheet when an outflow is probable (>50%) and reliably estimable. Contingent liabilities are possible obligations (<50%) disclosed only in notes.",
                "why": "Provisions meet the definition of a liability and are recognized on the balance sheet when an outflow is probable (>50%) and reliably estimable. Contingent liabilities are possible obligations (<50%) disclosed only in notes."
            }
        },
        {
            "part": 2,
            "title": "The Three Mandatory Recognition Criteria, Past Obligating Events & Maintenance Disallowance",
            "say": part2_say,
            "code": day39_code,
            "output": day39_output,
            "check": {
                "question": "Can an airline company accrue a provision for expected major aircraft overhaul expenses that will occur in 3 years under Ind AS 37?",
                "options": [
                    "No; there is no present obligation resulting from a past event because the company can avoid future overhaul costs by selling or grounding the aircraft",
                    "Yes; safety regulations make future maintenance costs 100% legally binding",
                    "Yes; provisions must be recognized for all future anticipated operating expenditures",
                    "No, unless approved by the Directorate General of Civil Aviation (DGCA)"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "Ind AS 37 explicitly prohibits provisioning for future operating or maintenance costs because no present obligation exists from a past event; the entity can avoid the cost through future operational decisions.",
                "why": "Ind AS 37 explicitly prohibits provisioning for future operating or maintenance costs because no present obligation exists from a past event; the entity can avoid the cost through future operational decisions."
            }
        },
        {
            "part": 3,
            "title": "Measurement Principles: Best Estimate, Present Value Discounting & Finance Cost Unwinding",
            "say": part3_say,
            "code": day39_code,
            "output": day39_output,
            "check": {
                "question": "When a long-term decommissioning provision is discounted to present value, how is the annual unwinding of the discount accounted for in subsequent periods?",
                "options": [
                    "Recognized as a Finance Cost (interest expense) in Profit or Loss, increasing the carrying amount of the provision liability",
                    "Capitalized into the cost of the property, plant, and equipment asset",
                    "Recognized as an extraordinary operating expense inside EBITDA",
                    "Credited directly to General Reserves within Equity"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "Under Ind AS 37 Paragraph 60, the increase in a provision due to the passage of time is recognized strictly as a Finance Cost (interest expense) in profit or loss.",
                "why": "Under Ind AS 37 Paragraph 60, the increase in a provision due to the passage of time is recognized strictly as a Finance Cost (interest expense) in profit or loss."
            }
        },
        {
            "part": 4,
            "title": "Restructuring Provisions: Detailed Formal Plans, Valid Expectations & Operating Disallowances",
            "say": part4_say,
            "code": day39_code,
            "output": day39_output,
            "check": {
                "question": "Which of the following costs can be legally included in a restructuring provision under Ind AS 37?",
                "options": [
                    "Direct employee redundancy severance packages and contractual lease termination penalties",
                    "Future retraining costs of retained employees and IT software infrastructure upgrades",
                    "Anticipated future operational losses up to the closure date",
                    "Marketing campaigns to promote the remaining corporate divisions"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "Ind AS 37 Paragraph 80 restricts restructuring provisions to direct expenditures necessarily entailed by the restructuring (severance, lease penalties), strictly excluding retraining, relocation, or future operating losses.",
                "why": "Ind AS 37 Paragraph 80 restricts restructuring provisions to direct expenditures necessarily entailed by the restructuring (severance, lease penalties), strictly excluding retraining, relocation, or future operating losses."
            }
        },
        {
            "part": 5,
            "title": "Python Provisions Engine Execution, Tripartite Classification & Ind AS 37 Certification",
            "say": part5_say,
            "code": day39_code,
            "output": day39_output,
            "check": {
                "question": "What is the terminal confirmation string emitted by the Ind AS 37 simulation engine upon verifying all provisioning and restructuring assertions?",
                "options": [
                    "IND_AS_37_PROVISIONS_CONTINGENCIES_PASS",
                    "RESTRUCTURING_PROVISION_DISALLOWED_FAIL",
                    "DECOMMISSIONING_DISCOUNT_MISMATCH_ERROR",
                    "CONTINGENT_LIABILITY_AUDIT_EXCEPTION"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "The Ind AS 37 engine validates all calculations across decommissioning unwinding, restructuring qualifying boundaries, and tripartite legal claim classification, concluding with IND_AS_37_PROVISIONS_CONTINGENCIES_PASS.",
                "why": "The Ind AS 37 engine validates all calculations across decommissioning unwinding, restructuring qualifying boundaries, and tripartite legal claim classification, concluding with IND_AS_37_PROVISIONS_CONTINGENCIES_PASS."
            }
        }
    ]
}

total_words = 0
for p in day39_lesson["parts"]:
    wc = count_words(p["say"])
    total_words += wc
    print(f"Day 39 Part {p['part']} words: {wc}")

for p in day39_lesson["parts"]:
    wc = count_words(p["say"])
    assert wc >= 580, f"Part {p['part']} word count {wc} < 580"

print(f"Day 39 Total words: {total_words}")
assert total_words >= 3000, f"Total word count {total_words} < 3000"

with open("scripts/bcom_acc_day39.json", "w", encoding="utf-8") as f:
    json.dump(day39_lesson, f, indent=2)

print("Saved scripts/bcom_acc_day39.json successfully!")
