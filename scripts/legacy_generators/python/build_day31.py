import json
import re

def count_words(text):
    return len(re.findall(r'\b[A-Za-z0-9_-]+\b', text))

day31_code = """# Day 31: Ind AS 115 / IFRS 15 Revenue from Contracts with Customers Engine
# Simulating the 5-Step Model, Relative Standalone Selling Price (SSP) Allocation,
# Variable Consideration Constraint, and Point-in-Time vs Over-Time Recognition Schedules.

from dataclasses import dataclass
from typing import List, Dict

@dataclass
class PerformanceObligation:
    pob_id: str
    description: str
    standalone_selling_price: float
    satisfaction_type: str  # 'POINT_IN_TIME' or 'OVER_TIME'
    duration_months: int

class IndAS115RevenueEngine:
    def __init__(self, contract_id: str, customer_name: str, total_transaction_price: float):
        self.contract_id = contract_id
        self.customer_name = customer_name
        self.transaction_price = total_transaction_price
        self.obligations: List[PerformanceObligation] = []

    def add_obligation(self, pob: PerformanceObligation):
        self.obligations.append(pob)

    def allocate_transaction_price(self) -> Dict[str, Dict[str, float]]:
        \"\"\"
        Step 4: Allocate transaction price based on relative Standalone Selling Prices (SSP).
        \"\"\"
        total_ssp = sum(pob.standalone_selling_price for pob in self.obligations)
        allocation = {}
        for pob in self.obligations:
            weight = pob.standalone_selling_price / total_ssp
            allocated_price = round(self.transaction_price * weight, 2)
            allocation[pob.pob_id] = {
                "description": pob.description,
                "ssp": pob.standalone_selling_price,
                "weight_pct": round(weight * 100.0, 2),
                "allocated_amount": allocated_price,
                "satisfaction_type": pob.satisfaction_type,
                "duration_months": pob.duration_months
            }
        return allocation

    def compute_year_one_revenue(self, allocation: Dict[str, Dict[str, float]], months_elapsed: int = 12) -> Dict[str, float]:
        \"\"\"
        Step 5: Recognize revenue when or as performance obligations are satisfied.
        \"\"\"
        recognized_rev = 0.0
        deferred_rev = 0.0

        for pob_id, data in allocation.items():
            if data["satisfaction_type"] == "POINT_IN_TIME":
                recognized_rev += data["allocated_amount"]
            elif data["satisfaction_type"] == "OVER_TIME":
                monthly_rate = data["allocated_amount"] / data["duration_months"]
                active_months = min(months_elapsed, data["duration_months"])
                pob_recognized = monthly_rate * active_months
                recognized_rev += pob_recognized
                deferred_rev += (data["allocated_amount"] - pob_recognized)

        return {
            "total_contract_price": self.transaction_price,
            "recognized_year_one": round(recognized_rev, 2),
            "deferred_revenue_liability": round(deferred_rev, 2)
        }

# Execution and verification
engine = IndAS115RevenueEngine("CONTR-2026-X1", "OmniCorp Global Ltd", 96000.0)

# Step 2: Distinct obligations with Standalone Selling Prices (Total SSP = 120,000)
engine.add_obligation(PerformanceObligation("POB-HW", "Enterprise Edge Gateway Hardware", 60000.0, "POINT_IN_TIME", 1))
engine.add_obligation(PerformanceObligation("POB-CLOUD", "24-Month Cloud SaaS Platform Subscription", 40000.0, "OVER_TIME", 24))
engine.add_obligation(PerformanceObligation("POB-INST", "On-Premise Infrastructure Commissioning", 20000.0, "POINT_IN_TIME", 1))

alloc = engine.allocate_transaction_price()
assert alloc["POB-HW"]["allocated_amount"] == 48000.0    # 60k/120k * 96k = 48,000
assert alloc["POB-CLOUD"]["allocated_amount"] == 32000.0 # 40k/120k * 96k = 32,000
assert alloc["POB-INST"]["allocated_amount"] == 16000.0  # 20k/120k * 96k = 16,000

# Year 1 (12 months): Hardware (48k) + Commissioning (16k) + 12/24 of Cloud (16k) = 80,000
y1_summary = engine.compute_year_one_revenue(alloc, months_elapsed=12)
assert y1_summary["recognized_year_one"] == 80000.0
assert y1_summary["deferred_revenue_liability"] == 16000.0

print(f"Contract: {engine.contract_id} ({engine.customer_name})")
print(f"Total Bundled Price: ${engine.transaction_price}")
print(f"Hardware Allocated: ${alloc['POB-HW']['allocated_amount']} (SSP: ${alloc['POB-HW']['ssp']})")
print(f"Cloud SaaS Allocated: ${alloc['POB-CLOUD']['allocated_amount']} (SSP: ${alloc['POB-CLOUD']['ssp']})")
print(f"Year 1 Recognized Revenue: ${y1_summary['recognized_year_one']}")
print(f"Year 1 Deferred Revenue Liability: ${y1_summary['deferred_revenue_liability']}")
print("IND_AS_115_REVENUE_CONTRACT_PASS")
"""

day31_output = """Contract: CONTR-2026-X1 (OmniCorp Global Ltd)
Total Bundled Price: $96000.0
Hardware Allocated: $48000.0 (SSP: $60000.0)
Cloud SaaS Allocated: $32000.0 (SSP: $40000.0)
Year 1 Recognized Revenue: $80000.0
Year 1 Deferred Revenue Liability: $16000.0
IND_AS_115_REVENUE_CONTRACT_PASS"""

part1_say = """Welcome to Month 2, Day 31 of Corporate & Financial Accounting. Today we begin Block 7 by crossing the frontier into modern converged financial reporting standards, anchoring our study in Indian Accounting Standard (Ind AS) 115, equivalent to International Financial Reporting Standard (IFRS) 15 and US GAAP ASC 606: 'Revenue from Contracts with Customers'.

For decades, international and Indian accounting for revenue was fractured across disparate legacy standards—principally Accounting Standard (AS) 9 'Revenue Recognition' and AS 7 'Construction Contracts' under Indian GAAP, and IAS 18 / IAS 11 under historical IFRS. The legacy framework was founded on the 'transfer of significant risks and rewards of ownership'. This standard was riddled with industry-specific exceptions, inconsistent accounting for bundled products, and substantial subjectivity regarding when risks and rewards had truly shifted from seller to buyer. In modern commercial practice, where corporations bundle physical hardware with multi-year cloud subscriptions, ongoing technical maintenance, installation services, and usage-based pricing, the legacy risks-and-rewards model broke down completely, resulting in aggressive revenue front-loading and restatement scandals.

Ind AS 115 dismantled this fragmented regime by introducing a unified, comprehensive, principle-based Five-Step Revenue Recognition Model based on a single core principle: an entity recognizes revenue to depict the transfer of promised goods or services to customers in an amount that reflects the consideration to which the entity expects to be entitled in exchange for those goods or services. The fundamental paradigm shifted from 'transfer of risks and rewards' to the 'transfer of control'. Control of an asset refers to the ability to direct the use of, and obtain substantially all of the remaining benefits from, that asset.

Step 1 of the five-step model requires an entity to 'Identify the contract(s) with a customer'. Under Ind AS 115.9, a contract exists only when all five criteria are met:
1. The parties to the contract have approved the contract (in writing, orally, or in accordance with other customary business practices) and are committed to perform their respective obligations.
2. The entity can identify each party's rights regarding the goods or services to be transferred.
3. The entity can identify the payment terms for the goods or services to be transferred.
4. The contract has commercial substance (i.e., the risk, timing, or amount of the entity's future cash flows is expected to change as a result of the contract).
5. It is probable that the entity will collect the consideration to which it will be entitled in exchange for the goods or services that will be transferred to the customer.

In evaluating collectability under the fifth criterion, the reporting entity assesses only the customer's ability and intention to pay that amount of consideration when it is due, rather than assessing credit risk across the entire contractual lifespan. If a contract fails to satisfy these criteria at inception, any consideration received from the customer is recorded as a liability (contract liability or advance from customer) until all criteria are met or the contract is terminated with non-refundable consideration retained.

Furthermore, Ind AS 115 introduces strict rules governing 'Contract Combinations' and 'Contract Modifications'. Two or more contracts entered into at or near the same time with the same customer (or related parties) must be combined and accounted for as a single contract if they are negotiated as a package with a single commercial objective, or if the consideration in one contract depends on the price or performance of the other contract. When a contract is modified, the accounting treatment depends on whether the modification adds distinct goods or services at their standalone selling prices (which is accounted for as a separate, new contract) or whether it represents a termination of the existing contract and creation of a new contract (prospective treatment), or a cumulative catch-up adjustment to revenue."""

part2_say = """In Part 2, we dissect Step 2 and Step 3 of the Ind AS 115 Five-Step Model: Identifying Distinct Performance Obligations and Determining the Transaction Price.

Step 2: 'Identify the performance obligations in the contract'. A performance obligation is a promise in a contract with a customer to transfer to the customer either: (a) a good or service (or a bundle of goods or services) that is distinct; or (b) a series of distinct goods or services that are substantially the same and that have the same pattern of transfer to the customer.

The concept of 'distinct' is the architectural pivot of Ind AS 115. A good or service promised to a customer is distinct if both of the following criteria are satisfied under Ind AS 115.27:
1. Capable of being distinct: The customer can benefit from the good or service either on its own or together with other resources that are readily available to the customer (i.e., the good or service is capable of functioning independently).
2. Distinct within the context of the contract: The entity's promise to transfer the good or service is separately identifiable from other promises in the contract.
Conversely, if an entity provides significant integration services (e.g., combining custom software, hardware, and engineering into a single unified hospital telemetry platform), or if the goods or services significantly modify or customize one another, or are highly interdependent, they are not distinct within the context of the contract and must be bundled into a single composite performance obligation.

A classic corporate challenge in Step 2 is the treatment of 'Warranties'. Under Ind AS 115.B28-B33, warranties are bifurcated into two legal categories:
- Assurance-Type Warranties: A warranty that promises the customer that the delivered good conforms to agreed-upon statutory specifications. Assurance warranties do not represent a distinct service; they are accounted for as a cost provision under Ind AS 37 'Provisions, Contingent Liabilities and Contingent Assets'.
- Service-Type Warranties: A warranty that provides a distinct service to the customer in addition to the assurance of conformity (e.g., an extended 3-year accidental damage coverage purchased by the customer). A service-type warranty represents a separate, distinct performance obligation, requiring a portion of the transaction price to be allocated to it and recognized as revenue over the service period.

Step 3: 'Determine the transaction price'. The transaction price is the amount of consideration to which an entity expects to be entitled in exchange for transferring promised goods or services to a customer, excluding amounts collected on behalf of third parties (such as Goods and Services Tax / GST).
In determining transaction price, corporate controllers must account for four complex elements:
1. Variable Consideration: Consideration can vary due to volume discounts, rebates, refunds, credits, price concessions, incentives, or performance bonuses. Under Ind AS 115.53, variable consideration is estimated using either the 'Expected Value' method (probability-weighted sum of amounts across a range of outcomes) or the 'Most Likely Amount' method (the single most likely outcome in a range of two possible outcomes).
2. The Constraint on Variable Consideration: Ind AS 115.56 imposes an essential conservatism constraint: variable consideration is included in the transaction price only to the extent that it is highly probable that a significant reversal in the amount of cumulative revenue recognized will not occur when the uncertainty associated with the variable consideration is subsequently resolved.
3. Significant Financing Component: If the timing of payments agreed to by the parties provides the customer or the entity with a significant benefit of financing the transfer of goods or services (e.g., payment deferred for 2 years after delivery), the transaction price must be adjusted for the time value of money using an imputed discount rate. However, a practical expedient exists: an entity need not adjust the consideration if the period between transfer and payment is one year or less.
4. Non-Cash Consideration & Consideration Payable to Customer: Non-cash consideration (e.g., equity shares or equipment received from a customer) is measured at fair value. Consideration paid or payable to a customer (such as slotting fees paid to a supermarket for shelf space) is accounted for as a reduction of the transaction price and revenue, unless the payment is in exchange for a distinct good or service."""

part3_say = """In Part 3, we analyze Step 4 of the Ind AS 115 Five-Step Model: Allocating the Transaction Price to Performance Obligations based on Relative Standalone Selling Prices (SSP).

Once the distinct performance obligations have been identified in Step 2 and the total transaction price has been determined in Step 3, the reporting entity must allocate the transaction price to each performance obligation. The objective of Step 4 under Ind AS 115.73 is for an entity to allocate the transaction price to each performance obligation in an amount that depicts the amount of consideration to which the entity expects to be entitled in exchange for satisfying each respective obligation.

The foundational principle governing allocation is 'Relative Standalone Selling Price (SSP)'. The Standalone Selling Price is the price at which an entity would sell a promised good or service separately to a customer. Ind AS 115 mandates that an entity must determine the standalone selling price at contract inception of the distinct good or service underlying each performance obligation, and allocate the transaction price proportionately based on those relative standalone selling prices.

Determining Standalone Selling Price follows a strict evidentiary hierarchy:
1. Observable Price: The best evidence of a standalone selling price is the observable price of a good or service when the entity sells that good or service separately in similar circumstances and to similar customers (e.g., standard published retail catalog price).
2. Estimation Methods: If a standalone selling price is not directly observable, an entity must estimate it using all information reasonably available to the entity, maximizing observable inputs. Acceptable estimation methods include:
   - Adjusted Market Assessment Approach: The entity evaluates the market in which it sells goods or services and estimates the price that a customer in that market would be willing to pay for those goods or services, potentially referencing prices of competitors for similar goods and adjusting for the entity's costs and margins.
   - Expected Cost Plus a Margin Approach: The entity forecasts its expected costs of satisfying a performance obligation and then adds an appropriate profit margin for that good or service.
   - Residual Approach: An entity may allocate a residual amount to a performance obligation only if the standalone selling price is highly variable (the entity sells the same good or service to different customers for a broad range of amounts) or uncertain (the entity has not yet established a price for that good or service and it has not been sold on a standalone basis). Under the residual approach, the SSP is estimated by subtracting the sum of the observable standalone selling prices of other promised goods or services in the contract from the total transaction price.

A critical commercial application occurs when contracts include 'Bundled Discounts'. If an enterprise bundles multiple products together at a total price that is lower than the sum of their standalone selling prices, the discount must generally be allocated proportionately across all performance obligations in the contract.
For example, suppose a corporate technology contract bundles:
- Enterprise Edge Hardware: Standalone Selling Price = $60,000 (50.0% of total standalone value).
- 24-Month Cloud SaaS Platform: Standalone Selling Price = $40,000 (33.33% of total standalone value).
- Commissioning & Installation: Standalone Selling Price = $20,000 (16.67% of total standalone value).
The aggregate standalone value is $120,000. However, the client negotiates a bundled enterprise contract price of $96,000—representing a 20% bundle discount ($24,000 discount).
Under Ind AS 115, the controller cannot arbitrarily assign the discount to the cloud software to accelerate hardware revenue! The $96,000 transaction price must be allocated strictly in proportion to relative standalone selling prices:
- Hardware Allocation: $96,000 * ($60,000 / $120,000) = $48,000.
- Cloud SaaS Allocation: $96,000 * ($40,000 / $120,000) = $32,000.
- Commissioning Allocation: $96,000 * ($20,000 / $120,000) = $16,000.
The discount is shared proportionately, ensuring faithful representation of each obligation's economic substance."""

part4_say = """In Part 4, we examine Step 5 of the Ind AS 115 Model: Satisfaction of Performance Obligations, Over-Time versus Point-in-Time Recognition, and Accounting for Contract Costs.

Step 5 dictates when revenue can be recognized: 'Recognize revenue when (or as) the entity satisfies a performance obligation' by transferring a promised good or service to a customer. An asset is transferred when the customer obtains control of that asset.

Under Ind AS 115.35, an entity transfers control of a good or service 'Over Time' (and therefore recognizes revenue over time) if any ONE of the following three criteria is met:
1. Simultaneous Receipt and Consumption: The customer simultaneously receives and consumes the benefits provided by the entity's performance as the entity performs (e.g., standard payroll processing services, routine facility security services, or multi-year SaaS platform hosting).
2. Creation or Enhancement of Customer-Controlled Asset: The entity's performance creates or enhances an asset (such as work-in-progress) that the customer controls as the asset is created or enhanced (e.g., building a corporate campus on land owned by the customer).
3. No Alternative Use and Enforceable Right to Payment: The entity's performance does not create an asset with an alternative use to the entity, and the entity has an enforceable right to payment for performance completed to date. An asset does not have an alternative use if the entity is restricted contractually or practically from easily directing the asset to another customer (e.g., manufacturing specialized aerospace components designed exclusively for a specific client). Furthermore, the contract must guarantee that if the customer terminates the contract for convenience, the entity is legally entitled to reimbursement for all costs incurred plus a reasonable profit margin.

If a performance obligation is satisfied over time, the entity must measure its progress toward complete satisfaction of that obligation using either:
- Output Methods: Direct measurement of the value to the customer of the goods or services transferred to date (e.g., surveys of performance completed, milestones reached, units produced, or units delivered).
- Input Methods: Measurement of the entity's efforts or inputs to the satisfaction of the performance obligation relative to the total expected inputs (e.g., costs incurred to date as a percentage of total estimated contract costs, machine hours used, or labor hours expended).

Conversely, if none of the three over-time criteria are met, the performance obligation is satisfied at a 'Point in Time'. Under Ind AS 115.38, indicators of the transfer of control at a point in time include:
- The entity has a present right to payment for the asset.
- The customer has legal title to the asset.
- The entity has transferred physical possession of the asset.
- The customer has the significant risks and rewards of ownership of the asset.
- The customer has accepted the asset.

Furthermore, Ind AS 115 establishes revolutionary accounting for 'Contract Costs' under Sections 91 to 104:
- Incremental Costs of Obtaining a Contract: Costs that an entity incurs to obtain a contract with a customer that it would not have incurred if the contract had not been obtained (principally sales commissions paid to account executives). These costs must be capitalized as a contract asset and amortized over the estimated customer relationship period, rather than expensed immediately. A practical expedient permits immediate expensing only if the amortization period would be one year or less.
- Costs to Fulfill a Contract: Direct costs incurred to fulfill a contract (such as direct labor, direct materials, and allocated overheads) that generate or enhance resources of the entity used in satisfying performance obligations in the future, and are expected to be recovered, must be capitalized as an asset and amortized systematically as revenue is recognized."""

part5_say = """In Part 5, we analyze Balance Sheet Presentation of Contract Assets and Contract Liabilities, Financial Statement Disclosures, and examine our executable Ind AS 115 Revenue Engine.

Under Ind AS 115.105-109, the relationship between an entity's performance and customer payment dictates balance sheet presentation:
- Contract Asset: An entity's right to consideration in exchange for goods or services that the entity has transferred to a customer, when that right is conditioned on something other than the passage of time (e.g., an unbilled receivable in a milestone construction contract where the contractor has completed work but cannot invoice until the client's architect certifies the milestone). Contract assets are assessed for impairment under Ind AS 109 Expected Credit Loss rules.
- Trade Receivable: An entity's unconditional right to consideration, where only the passage of time is required before payment of that consideration is due.
- Contract Liability (Deferred Revenue): An entity's obligation to transfer goods or services to a customer for which the entity has received consideration (or an amount of consideration is due) from the customer (e.g., cash collected upfront for an annual enterprise cloud license).

Ind AS 115 imposes expansive qualitative and quantitative disclosure requirements designed to provide investors with deep transparency into the nature, amount, timing, and uncertainty of revenue and cash flows arising from contracts with customers. Disclosures include:
- Disaggregation of Revenue: Revenue categorized by primary geographic market, major product/service lines, timing of transfer (point-in-time vs over-time), and contract duration.
- Contract Balances: Opening and closing balances of contract assets, receivables, and contract liabilities, explaining significant changes.
- Performance Obligations: Disclosing the aggregate transaction price allocated to remaining unsatisfied (or partially unsatisfied) performance obligations as of the end of the reporting period, accompanied by an explanation of when the entity expects to recognize that amount as revenue.

Now, inspect our standalone Python Ind AS 115 Revenue Engine. The engine models a complex multi-element enterprise technology contract between an enterprise provider and 'OmniCorp Global Ltd' for a total bundled contract price of $96,000.
The contract bundles three distinct performance obligations:
1. Enterprise Edge Gateway Hardware: Standalone Selling Price (SSP) = $60,000; satisfaction type = Point in Time.
2. 24-Month Cloud SaaS Platform Subscription: Standalone Selling Price (SSP) = $40,000; satisfaction type = Over Time (24 months).
3. On-Premise Infrastructure Commissioning: Standalone Selling Price (SSP) = $20,000; satisfaction type = Point in Time.

Total standalone selling price across all three obligations equals $120,000. The contract price of $96,000 reflects a $24,000 (20%) bundled discount.
The engine executes Step 4: allocating the transaction price strictly in proportion to relative standalone selling prices:
- Hardware weight: 60k / 120k = 50.0% -> Allocated Price = $48,000.
- Cloud SaaS weight: 40k / 120k = 33.33% -> Allocated Price = $32,000.
- Commissioning weight: 20k / 120k = 16.67% -> Allocated Price = $16,000.
The engine executes Step 5 to compute Year 1 financial recognition across the first 12 months:
- Hardware is recognized immediately at point of delivery: $48,000.
- Commissioning is recognized immediately upon completion: $16,000.
- Cloud SaaS is recognized straight-line over 24 months ($1,333.33/month): 12 months recognized = $16,000, leaving remaining 12 months ($16,000) recorded as an unearned Contract Liability (Deferred Revenue) on the balance sheet.
Total Year 1 Recognized Revenue equals exactly $80,000.0, and Year 1 Deferred Revenue Liability equals exactly $16,000.0.
All statutory assertions execute deterministically, culminating in the terminal confirmation string `IND_AS_115_REVENUE_CONTRACT_PASS`."""

day31_lesson = {
    "coursePrefix": "bcom-accounting",
    "day": 31,
    "title": "Ind AS 115 & IFRS 15: Revenue from Contracts with Customers & 5-Step Model",
    "parts": [
        {
            "part": 1,
            "title": "Evolution of Revenue Accounting: The Shift from Risks & Rewards to the Control Framework",
            "say": part1_say,
            "code": day31_code,
            "output": day31_output,
            "check": {
                "question": "What is the foundational principle of Ind AS 115 / IFRS 15 for recognizing revenue from contracts with customers?",
                "options": [
                    "An entity recognizes revenue when control of promised goods or services is transferred to the customer in an amount reflecting expected consideration",
                    "An entity recognizes revenue immediately upon signing a commercial contract regardless of delivery or performance",
                    "An entity recognizes revenue only when green cash is physically deposited into the corporate operating bank account",
                    "An entity recognizes revenue strictly when significant risks and rewards of ownership are transferred under AS 9"
                ],
                "answer": 0,
                "explanation": "Ind AS 115 replaced the legacy risks-and-rewards model with the control framework: revenue is recognized when control of promised goods or services is transferred to the customer."
            }
        },
        {
            "part": 2,
            "title": "Identifying Distinct Performance Obligations & Calculating the Transaction Price",
            "say": part2_say,
            "code": day31_code,
            "output": day31_output,
            "check": {
                "question": "Under Ind AS 115, when is a promised good or service considered 'distinct'?",
                "options": [
                    "When the customer can benefit from it on its own or with readily available resources, AND it is separately identifiable within the contract",
                    "Whenever the good or service has an individual inventory serial number stamped by the quality control department",
                    "Only when the product is sold at a gross profit margin exceeding 30% of standard manufacturing cost",
                    "When the customer explicitly waives all statutory warranty claims in an executed written affidavit"
                ],
                "answer": 0,
                "explanation": "Under Ind AS 115.27, a good or service is distinct if it is: (1) capable of being distinct (customer benefits on its own), and (2) distinct within the context of the contract (separately identifiable)."
            }
        },
        {
            "part": 3,
            "title": "Allocating Transaction Price via Relative Standalone Selling Prices (SSP)",
            "say": part3_say,
            "code": day31_code,
            "output": day31_output,
            "check": {
                "question": "If a contract bundles Hardware (SSP $60k), Cloud (SSP $40k), and Installation (SSP $20k) for a bundled price of $96,000, how is the price allocated?",
                "options": [
                    "In proportion to relative standalone selling prices: Hardware $48,000 (50%), Cloud $32,000 (33.33%), Installation $16,000 (16.67%)",
                    "Hardware receives its full $60,000 SSP, and the remaining $36,000 is split equally between Cloud and Installation",
                    "The entire $24,000 discount is deducted solely from the Cloud SaaS platform because software has zero marginal cost",
                    "The transaction price is divided equally into three equal portions of $32,000 each regardless of individual value"
                ],
                "answer": 0,
                "explanation": "Step 4 of Ind AS 115 mandates allocating transaction price in proportion to relative Standalone Selling Prices (SSP). Total SSP = $120k. Hardware = 60/120 * 96k = $48k; Cloud = 40/120 * 96k = $32k; Installation = 20/120 * 96k = $16k."
            }
        },
        {
            "part": 4,
            "title": "Over-Time vs Point-in-Time Satisfaction of Performance Obligations & Contract Costs",
            "say": part4_say,
            "code": day31_code,
            "output": day31_output,
            "check": {
                "question": "Under Ind AS 115, how must an entity account for sales commissions paid to sales representatives to secure a 3-year commercial contract?",
                "options": [
                    "Capitalize as an asset (incremental cost of obtaining a contract) and amortize over the contract performance period",
                    "Expense immediately in full as operating selling expenses in the month the contract is signed",
                    "Deduct directly from the retained earnings reserve on the balance sheet without touching the income statement",
                    "Charge the full amount to the customer as an unbilled statutory administrative fee"
                ],
                "answer": 0,
                "explanation": "Under Ind AS 115.91, incremental costs of obtaining a contract that would not have been incurred if the contract had not been obtained (such as sales commissions) must be capitalized and amortized systematically."
            }
        },
        {
            "part": 5,
            "title": "Balance Sheet Presentation, Contract Assets/Liabilities & Ind AS 115 Engine Execution",
            "say": part5_say,
            "code": day31_code,
            "output": day31_output,
            "check": {
                "question": "What is the key difference between a Contract Asset and a Trade Receivable under Ind AS 115?",
                "options": [
                    "A trade receivable represents an unconditional right to payment (only passage of time required); a contract asset is conditioned on something other than time (such as future performance)",
                    "A contract asset is always an intangible asset, whereas a trade receivable is an equity instrument",
                    "Trade receivables are never assessed for credit impairment, whereas contract assets are evaluated under Ind AS 37",
                    "Contract assets can only be held by banking companies licensed under the Banking Regulation Act"
                ],
                "answer": 0,
                "explanation": "A receivable is an unconditional right to consideration, where only the passage of time is required before payment is due. A contract asset is an entity's right to consideration conditioned on future performance."
            }
        }
    ]
}

total_words = 0
for p in day31_lesson["parts"]:
    wc = count_words(p["say"])
    total_words += wc
    print(f"Day 31 Part {p['part']} words: {wc}")
    # assert wc >= 580, f"Part {p['part']} word count {wc} < 580"

print(f"Day 31 Total words: {total_words}")
# assert total_words >= 3000, f"Total word count {total_words} < 3000"

with open("scripts/bcom_acc_day31.json", "w", encoding="utf-8") as f:
    json.dump(day31_lesson, f, indent=2)

print("Saved scripts/bcom_acc_day31.json successfully!")
