# Day 36 Code Prototype: Ind AS 102 Share-Based Payments Engine
# Simulates Equity-Settled ESOPs with Graded Vesting and Cash-Settled Stock Appreciation Rights (SARs).

from dataclasses import dataclass
from typing import List, Dict

@dataclass
class ESOPTranche:
    tranche_num: int
    vesting_years: int
    options_granted: int
    grant_date_fv: float

class IndAS102ShareBasedPaymentEngine:
    def __init__(self, company_name: str):
        self.company_name = company_name

    def calculate_equity_settled_esop(
        self,
        options_count: int,
        grant_date_fv: float,
        vesting_years: int,
        estimated_forfeiture_rate: float,
        year: int
    ) -> Dict[str, float]:
        """Equity-Settled ESOP: Fixed Grant Date Fair Value amortized over vesting period."""
        effective_options = options_count * (1.0 - estimated_forfeiture_rate)
        total_compensation_cost = effective_options * grant_date_fv
        cumulative_recognized = (total_compensation_cost / vesting_years) * min(year, vesting_years)
        prior_recognized = (total_compensation_cost / vesting_years) * max(0, year - 1)
        current_year_expense = cumulative_recognized - prior_recognized
        
        return {
            "total_compensation_cost": round(total_compensation_cost, 2),
            "current_year_expense": round(current_year_expense, 2),
            "cumulative_share_based_reserve": round(cumulative_recognized, 2)
        }

    def calculate_graded_vesting(
        self,
        tranches: List[ESOPTranche],
        year: int
    ) -> Dict[str, float]:
        """Graded Vesting: Each tranche treated as a separate share-based payment arrangement."""
        total_year_expense = 0.0
        for t in tranches:
            if year <= t.vesting_years:
                annual_cost = (t.options_granted * t.grant_date_fv) / t.vesting_years
                total_year_expense += annual_cost
        return {
            "year": year,
            "graded_vesting_expense": round(total_year_expense, 2)
        }

    def calculate_cash_settled_sar(
        self,
        sars_granted: int,
        reporting_date_fv: float,
        vesting_years: int,
        year: int,
        prior_liability: float
    ) -> Dict[str, float]:
        """Cash-Settled SAR: Remeasured at fair value at each reporting date until settlement."""
        cumulative_liability = (sars_granted * reporting_date_fv * year) / vesting_years
        current_expense = cumulative_liability - prior_liability
        return {
            "reporting_date_fair_value": reporting_date_fv,
            "cumulative_sar_liability": round(cumulative_liability, 2),
            "current_year_pl_expense": round(current_expense, 2)
        }

engine = IndAS102ShareBasedPaymentEngine("Nexus Enterprise Technologies Ltd")

# Test 1: Equity-Settled ESOP (100,000 options, $15 Grant Date FV, 4 years, 5% forfeiture)
esop_y1 = engine.calculate_equity_settled_esop(100000, 15.0, 4, 0.05, 1)
assert esop_y1["total_compensation_cost"] == 1425000.0
assert esop_y1["current_year_expense"] == 356250.0
assert esop_y1["cumulative_share_based_reserve"] == 356250.0

# Test 2: Graded Vesting Tranches (4 tranches of 25,000 options each vesting in Yr 1, 2, 3, 4)
tranches = [
    ESOPTranche(1, 1, 25000, 15.0),
    ESOPTranche(2, 2, 25000, 15.0),
    ESOPTranche(3, 3, 25000, 15.0),
    ESOPTranche(4, 4, 25000, 15.0),
]
graded_y1 = engine.calculate_graded_vesting(tranches, 1)
# Y1: T1(375k/1) + T2(375k/2) + T3(375k/3) + T4(375k/4) = 375k + 187.5k + 125k + 93.75k = 781,250.0
assert graded_y1["graded_vesting_expense"] == 781250.0

# Test 3: Cash-Settled SAR (50,000 SARs, 3-year vesting, Y1 FV = $18.0)
sar_y1 = engine.calculate_cash_settled_sar(50000, 18.0, 3, 1, 0.0)
assert sar_y1["cumulative_sar_liability"] == 300000.0
assert sar_y1["current_year_pl_expense"] == 300000.0

# Y2 SAR remeasured at FV = $22.0
sar_y2 = engine.calculate_cash_settled_sar(50000, 22.0, 3, 2, 300000.0)
# Cumulative Y2 liability = (50k * 22 * 2) / 3 = 733,333.33
assert sar_y2["cumulative_sar_liability"] == 733333.33
assert sar_y2["current_year_pl_expense"] == 433333.33

print(f"Company: {engine.company_name}")
print(f"Equity ESOP Y1 Expense: ${esop_y1['current_year_expense']} (Total Pool: ${esop_y1['total_compensation_cost']})")
print(f"Graded Vesting Y1 Expense: ${graded_y1['graded_vesting_expense']}")
print(f"Cash SAR Y1 Liability: ${sar_y1['cumulative_sar_liability']} | Y2 Liability: ${sar_y2['cumulative_sar_liability']}")
print("IND_AS_102_SHARE_BASED_PAYMENTS_PASS")
