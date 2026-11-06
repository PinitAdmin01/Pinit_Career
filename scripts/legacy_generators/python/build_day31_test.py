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

with open("scripts/test_day31_code.py", "w", encoding="utf-8") as f:
    f.write(day31_code)

print("Saved scripts/test_day31_code.py")
