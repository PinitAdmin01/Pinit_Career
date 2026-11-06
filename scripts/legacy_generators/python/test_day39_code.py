# Day 39 Code Prototype: Ind AS 37 Provisions, Contingent Liabilities & Restructuring Engine
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
        """Module 1: Present value discounting and finance cost unwinding under Ind AS 37."""
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
        """Module 2: Filters direct restructuring costs from ongoing operating expenditures."""
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
        """Module 3: Classifies claims into Provisions (>50%), Contingent Liabilities (5-50%), Remote (<5%)."""
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

# Test 1: Decommissioning Provision ($500k in 5 years at 8% discount rate)
# Initial PV = 500,000 / (1.08)^5 = 340,291.60
# Year 1 Unwinding = 340,291.60 * 8% = 27,223.33
# Year 1 End = 340,291.60 + 27,223.33 = 367,514.93
decom = engine.compute_decommissioning_provision(500000.0, 5, 0.08, 1)
assert decom["initial_capitalized_pv"] == 340291.60
assert decom["year_unwinding_finance_cost"] == 27223.33
assert decom["year_end_carrying_provision"] == 367514.93

# Test 2: Restructuring Provision
restruct_items = [
    RestructuringCostItem("Employee Redundancy Severance", 450000.0, is_direct_restructuring_cost=True),
    RestructuringCostItem("Onerous Lease Early Exit Penalty", 120000.0, is_direct_restructuring_cost=True),
    RestructuringCostItem("Retraining of Retained Staff", 80000.0, is_direct_restructuring_cost=False),
    RestructuringCostItem("Relocation of IT Data Centers", 50000.0, is_direct_restructuring_cost=False),
]
restruct = engine.compute_restructuring_provision(restruct_items)
assert restruct["qualifying_restructuring_provision"] == 570000.0
assert restruct["disallowed_ongoing_operating_costs"] == 130000.0

# Test 3: Legal Claims Tripartite Classification
claims = [
    LegalClaim("Claim_A_Breach_of_Supply_Contract", 200000.0, 75.0), # Provision
    LegalClaim("Claim_B_Patent_Infringement_Dispute", 500000.0, 30.0), # Contingent Liability
    LegalClaim("Claim_C_Frivolous_Customer_Lawsuit", 100000.0, 3.0), # Remote
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
