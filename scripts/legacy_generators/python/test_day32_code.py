# Day 32: Ind AS 116 / IFRS 16 Leases Engine
# Simulating the Single Lessee Model: Initial ROU Asset & Lease Liability Measurement,
# Amortization Schedule (Effective Interest Method), Straight-Line Depreciation,
# and P&L Front-Loading vs EBITDA Metric Reclassification.

from dataclasses import dataclass
from typing import List, Dict

@dataclass
class LeaseContract:
    lease_id: str
    asset_name: str
    annual_lease_payment: float
    lease_term_years: int
    discount_rate_pct: float  # Incremental Borrowing Rate (IBR)
    initial_direct_costs: float
    dismantling_provision: float

class IndAS116LeaseEngine:
    def __init__(self, contract: LeaseContract):
        self.contract = contract
        self.ibr = contract.discount_rate_pct / 100.0

    def calculate_initial_measurement(self) -> Dict[str, float]:
        """
        Initial Measurement:
        Lease Liability = Present Value of future lease payments discounted at IBR.
        ROU Asset = Initial Lease Liability + Initial Direct Costs + Dismantling Provision.
        """
        pv_lease_payments = 0.0
        for year in range(1, self.contract.lease_term_years + 1):
            pv_lease_payments += self.contract.annual_lease_payment / ((1.0 + self.ibr) ** year)

        initial_lease_liability = round(pv_lease_payments, 2)
        initial_rou_asset = round(
            initial_lease_liability + self.contract.initial_direct_costs + self.contract.dismantling_provision,
            2
        )
        return {
            "initial_lease_liability": initial_lease_liability,
            "initial_rou_asset": initial_rou_asset
        }

    def generate_amortization_schedule(self, initial_liability: float, initial_rou: float) -> List[Dict[str, float]]:
        """
        Subsequent Measurement:
        Lease Liability increases by interest (effective rate) and decreases by annual payment.
        ROU Asset is depreciated straight-line over the lease term.
        """
        schedule = []
        opening_liability = initial_liability
        annual_depreciation = round(initial_rou / self.contract.lease_term_years, 2)

        for year in range(1, self.contract.lease_term_years + 1):
            interest_expense = round(opening_liability * self.ibr, 2)
            payment = self.contract.annual_lease_payment
            principal_repayment = round(payment - interest_expense, 2)
            closing_liability = round(opening_liability - principal_repayment, 2)

            # Avoid -0.01 rounding artifact in final year
            if year == self.contract.lease_term_years:
                closing_liability = 0.0
                principal_repayment = opening_liability

            total_pl_charge = round(interest_expense + annual_depreciation, 2)

            schedule.append({
                "year": year,
                "opening_liability": opening_liability,
                "interest_expense": interest_expense,
                "payment": payment,
                "principal_repayment": principal_repayment,
                "closing_liability": closing_liability,
                "rou_depreciation": annual_depreciation,
                "total_pl_charge": total_pl_charge
            })
            opening_liability = closing_liability

        return schedule

# Execution and verification
contract = LeaseContract(
    lease_id="LEASE-CORP-HQ",
    asset_name="Corporate Technology Headquarters",
    annual_lease_payment=100000.0,
    lease_term_years=5,
    discount_rate_pct=8.0,
    initial_direct_costs=15000.0,
    dismantling_provision=10000.0
)

engine = IndAS116LeaseEngine(contract)
init_res = engine.calculate_initial_measurement()

# PV of 100k for 5 years at 8%: 100k * 3.99271 = 399,271.00
assert init_res["initial_lease_liability"] == 399271.0
# ROU Asset = 399,271.00 + 15,000 + 10,000 = 424,271.00
assert init_res["initial_rou_asset"] == 424271.0

schedule = engine.generate_amortization_schedule(init_res["initial_lease_liability"], init_res["initial_rou_asset"])

# Year 1: Interest = 399,271 * 0.08 = 31,941.68. Depreciation = 424,271 / 5 = 84,854.20
y1 = schedule[0]
assert y1["interest_expense"] == 31941.68
assert y1["rou_depreciation"] == 84854.2
# Total Y1 P&L Charge = 31,941.68 + 84,854.20 = 116,795.88 (> 100k old rent -> front-loading!)
assert y1["total_pl_charge"] == 116795.88

# Year 5 closing liability must be exactly 0.0
assert schedule[-1]["closing_liability"] == 0.0

print(f"Contract: {contract.lease_id} ({contract.asset_name})")
print(f"Initial Lease Liability (PV at 8%): ${init_res['initial_lease_liability']}")
print(f"Initial ROU Asset: ${init_res['initial_rou_asset']}")
print(f"Year 1 Interest Expense: ${y1['interest_expense']}")
print(f"Year 1 ROU Depreciation: ${y1['rou_depreciation']}")
print(f"Year 1 Total P&L Charge (Front-Loaded): ${y1['total_pl_charge']} vs Old Rent: $100000.0")
print(f"Year 5 Final Closing Liability: ${schedule[-1]['closing_liability']}")
print("IND_AS_116_ROU_LEASE_LIABILITY_PASS")
