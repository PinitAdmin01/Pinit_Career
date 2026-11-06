day35_code = """# Day 35: Milestone 7 Capstone - Enterprise Financial Controller Ind AS Suite
# Integrated corporate financial reporting simulator combining Ind AS 115 Revenue Allocation,
# Ind AS 116 ROU Leases Amortization, Ind AS 113 Level 3 Fair Value DCF, and Ind AS 109 3-Stage ECL.

from dataclasses import dataclass
from typing import List, Dict

class EnterpriseFinancialControllerSuite:
    def __init__(self, enterprise_name: str):
        self.enterprise_name = enterprise_name

    def process_ind_as_115_revenue(self, bundled_price: float, ssp_hw: float, ssp_cloud: float) -> Dict[str, float]:
        \"\"\"Module 1: Ind AS 115 Relative Standalone Selling Price Allocation\"\"\"
        total_ssp = ssp_hw + ssp_cloud
        alloc_hw = round(bundled_price * (ssp_hw / total_ssp), 2)
        alloc_cloud = round(bundled_price * (ssp_cloud / total_ssp), 2)
        # Year 1: Hardware 100% point-in-time + Cloud 50% over-time (12 of 24 months)
        rev_y1 = round(alloc_hw + (alloc_cloud * 0.5), 2)
        deferred_y1 = round(alloc_cloud * 0.5, 2)
        return {
            "alloc_hw": alloc_hw,
            "alloc_cloud": alloc_cloud,
            "recognized_revenue_y1": rev_y1,
            "deferred_revenue_liability": deferred_y1
        }

    def process_ind_as_116_lease(self, annual_rent: float, term_years: int, ibr: float, direct_costs: float) -> Dict[str, float]:
        \"\"\"Module 2: Ind AS 116 Lease Liability & ROU Asset Schedule\"\"\"
        pv_liability = sum(annual_rent / ((1.0 + ibr) ** y) for y in range(1, term_years + 1))
        initial_liability = round(pv_liability, 2)
        initial_rou = round(initial_liability + direct_costs, 2)
        # Year 1 Interest & Depreciation
        interest_y1 = round(initial_liability * ibr, 2)
        deprec_y1 = round(initial_rou / term_years, 2)
        total_pl_charge = round(interest_y1 + deprec_y1, 2)
        ebitda_benefit = annual_rent  # Rent removed from EBITDA
        return {
            "initial_lease_liability": initial_liability,
            "initial_rou_asset": initial_rou,
            "year1_interest_expense": interest_y1,
            "year1_rou_depreciation": deprec_y1,
            "year1_total_pl_charge": total_pl_charge,
            "ebitda_benefit": ebitda_benefit
        }

    def process_ind_as_113_fair_value(self, cash_flows: List[float], discount_rate: float, cva_pct: float) -> Dict[str, float]:
        \"\"\"Module 3: Ind AS 113 Level 3 Fair Value with CVA Credit Adjustment\"\"\"
        raw_pv = sum(cf / ((1.0 + discount_rate) ** t) for t, cf in enumerate(cash_flows, 1))
        cva_amount = raw_pv * (cva_pct / 100.0)
        final_fv = raw_pv - cva_amount
        return {
            "unadjusted_level3_dcf": round(raw_pv, 2),
            "cva_deduction": round(cva_amount, 2),
            "level3_fair_value": round(final_fv, 2)
        }

    def process_ind_as_109_ecl(self, gross_loan_usd: float, stage: int, pd_pct: float, lgd_pct: float) -> Dict[str, float]:
        \"\"\"Module 4: Ind AS 109 Expected Credit Loss Allowance\"\"\"
        pd = pd_pct / 100.0
        lgd = lgd_pct / 100.0
        ecl_allowance = round(gross_loan_usd * pd * lgd, 2)
        net_carrying = round(gross_loan_usd - ecl_allowance, 2)
        return {
            "gross_exposure": gross_loan_usd,
            "stage": stage,
            "ecl_allowance": ecl_allowance,
            "net_carrying_amount": net_carrying
        }

# Execution of Enterprise Financial Controller Simulation
controller = EnterpriseFinancialControllerSuite("Apex Global Enterprise Corp")

# 1. Ind AS 115 Revenue: $100k bundled package (Hardware SSP $75k, Cloud SSP $50k)
rev_mod = controller.process_ind_as_115_revenue(100000.0, 75000.0, 50000.0)
# HW: 75/125 * 100k = 60,000. Cloud: 50/125 * 100k = 40,000.
# Y1 Rev = 60,000 + 20,000 = 80,000. Deferred = 20,000.
assert rev_mod["alloc_hw"] == 60000.0
assert rev_mod["alloc_cloud"] == 40000.0
assert rev_mod["recognized_revenue_y1"] == 80000.0
assert rev_mod["deferred_revenue_liability"] == 20000.0

# 2. Ind AS 116 Lease: 5-year lease of $120,000/yr at 7% IBR with $25,000 direct costs
lease_mod = controller.process_ind_as_116_lease(120000.0, 5, 0.07, 25000.0)
# PV of 120k for 5 yrs at 7%: 120k * 4.100197 = 492,023.69
assert lease_mod["initial_lease_liability"] == 492023.69
assert lease_mod["initial_rou_asset"] == 517023.69
assert lease_mod["year1_interest_expense"] == 34441.66
assert lease_mod["year1_rou_depreciation"] == 103404.74

# 3. Ind AS 113 Fair Value: 3-year private equity DCF [$200k, $250k, $300k] at 12% with 2.0% CVA
fv_mod = controller.process_ind_as_113_fair_value([200000.0, 250000.0, 300000.0], 0.12, 2.0)
# PV = 200k/1.12 + 250k/1.2544 + 300k/1.404928 = 178,571.43 + 199,298.47 + 213,534.07 = 591,403.97
assert fv_mod["unadjusted_level3_dcf"] == 591403.97
assert fv_mod["cva_deduction"] == 11828.08
assert fv_mod["level3_fair_value"] == 579575.89

# 4. Ind AS 109 ECL: Corporate credit exposure of $2,000,000 in Stage 2 (SICR, Lifetime PD 8.5%, LGD 40%)
ecl_mod = controller.process_ind_as_109_ecl(2000000.0, 2, 8.5, 40.0)
# ECL = 2M * 8.5% * 40% = 68,000. Net = 1,932,000
assert ecl_mod["ecl_allowance"] == 68000.0
assert ecl_mod["net_carrying_amount"] == 1932000.0

print(f"Enterprise: {controller.enterprise_name}")
print(f"Ind AS 115 Year 1 Recognized Revenue: ${rev_mod['recognized_revenue_y1']} (Deferred: ${rev_mod['deferred_revenue_liability']})")
print(f"Ind AS 116 Initial ROU Asset: ${lease_mod['initial_rou_asset']} | Y1 Total P&L Charge: ${lease_mod['year1_total_pl_charge']}")
print(f"Ind AS 113 Level 3 Fair Value (Post-CVA): ${fv_mod['level3_fair_value']}")
print(f"Ind AS 109 Stage 2 ECL Allowance: ${ecl_mod['ecl_allowance']} | Net Loan Carrying Amount: ${ecl_mod['net_carrying_amount']}")
print("ENTERPRISE_CONTROLLER_IND_AS_SUITE_PASS")
"""

with open("scripts/test_day35_code.py", "w", encoding="utf-8") as f:
    f.write(day35_code)

print("Saved scripts/test_day35_code.py")
