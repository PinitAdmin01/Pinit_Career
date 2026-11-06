# Day 48: Operating & Financial Leverage Analysis & Distress Models
# Comprehensive combined leverage, EBIT-EPS indifference, and Altman Z-score distress classifier.

from dataclasses import dataclass
from typing import Dict, Tuple

@dataclass
class LeverageData:
    sales: float
    variable_costs: float
    fixed_operating_costs: float
    interest_expense: float
    preference_dividends: float
    tax_rate_pct: float
    # Balance sheet data for Altman Z-Score
    working_capital: float
    retained_earnings: float
    market_cap_equity: float
    total_liabilities: float
    total_assets: float
    shares_plan1: int
    interest_plan1: float
    shares_plan2: int
    interest_plan2: float

class LeverageAndDistressEngine:
    def __init__(self, data: LeverageData):
        self.d = data
        self.tax_rate = self.d.tax_rate_pct / 100.0
        self.contribution = self.d.sales - self.d.variable_costs
        self.ebit = self.contribution - self.d.fixed_operating_costs

    def compute_leverage_metrics(self) -> Dict[str, float]:
        dol = self.contribution / self.ebit
        pref_gross = self.d.preference_dividends / (1 - self.tax_rate)
        denom_dfl = self.ebit - self.d.interest_expense - pref_gross
        dfl = self.ebit / denom_dfl
        dcl = dol * dfl
        return {
            "contribution": round(self.contribution, 2),
            "ebit": round(self.ebit, 2),
            "dol": round(dol, 4),
            "dfl": round(dfl, 4),
            "dcl": round(dcl, 4)
        }

    def compute_ebit_eps_indifference(self) -> float:
        # ((EBIT - I1)(1 - t) - Dp) / N1 = ((EBIT - I2)(1 - t) - Dp) / N2
        # Plan 1 (All Equity): I1 = 0, N1 = shares_plan1
        # Plan 2 (Debt-Equity): I2 = interest_plan2, N2 = shares_plan2
        # EBIT * (1 - t) / N1 = (EBIT - I2) * (1 - t) / N2
        # EBIT / N1 = (EBIT - I2) / N2
        # EBIT * N2 = EBIT * N1 - I2 * N1
        # EBIT * (N1 - N2) = I2 * N1
        # EBIT* = (I2 * N1) / (N1 - N2)
        n1 = self.d.shares_plan1
        n2 = self.d.shares_plan2
        i2 = self.d.interest_plan2
        indiff_ebit = (i2 * n1) / (n1 - n2)
        return round(indiff_ebit, 2)

    def compute_altman_z_score(self) -> Dict[str, any]:
        x1 = self.d.working_capital / self.d.total_assets
        x2 = self.d.retained_earnings / self.d.total_assets
        x3 = self.ebit / self.d.total_assets
        x4 = self.d.market_cap_equity / self.d.total_liabilities
        x5 = self.d.sales / self.d.total_assets
        
        z = (1.2 * x1) + (1.4 * x2) + (3.3 * x3) + (0.6 * x4) + (0.999 * x5)
        
        zone = "Safe Zone" if z > 2.99 else ("Grey Zone" if z >= 1.81 else "Distress Zone")
        return {
            "x1_wc_ta": round(x1, 4),
            "x2_re_ta": round(x2, 4),
            "x3_ebit_ta": round(x3, 4),
            "x4_mve_tl": round(x4, 4),
            "x5_sales_ta": round(x5, 4),
            "z_score": round(z, 2),
            "zone": zone
        }

# Enterprise Case Study: Titan Manufacturing Ltd
data = LeverageData(
    sales=100000000.0,
    variable_costs=60000000.0,
    fixed_operating_costs=15000000.0,
    interest_expense=5000000.0,
    preference_dividends=0.0,
    tax_rate_pct=25.168,
    working_capital=20000000.0,
    retained_earnings=30000000.0,
    market_cap_equity=120000000.0,
    total_liabilities=50000000.0,
    total_assets=100000000.0,
    shares_plan1=10000000,
    interest_plan1=0.0,
    shares_plan2=6000000,
    interest_plan2=5000000.0
)

engine = LeverageAndDistressEngine(data)
lev = engine.compute_leverage_metrics()
indiff = engine.compute_ebit_eps_indifference()
z_res = engine.compute_altman_z_score()

assert lev["contribution"] == 40000000.0
assert lev["ebit"] == 25000000.0
assert lev["dol"] == 1.6
assert lev["dfl"] == 1.25
assert lev["dcl"] == 2.0

assert indiff == 12500000.0

assert z_res["x1_wc_ta"] == 0.20
assert z_res["x2_re_ta"] == 0.30
assert z_res["x3_ebit_ta"] == 0.25
assert z_res["x4_mve_tl"] == 2.40
assert z_res["x5_sales_ta"] == 1.0
assert z_res["z_score"] == 3.92
assert z_res["zone"] == "Safe Zone"

print(f"Leverage Profile: DOL {lev['dol']}x | DFL {lev['dfl']}x | DCL {lev['dcl']}x")
print(f"EBIT-EPS Indifference Point: ${indiff:,.2f}")
print(f"Altman Z-Score: {z_res['z_score']} ({z_res['zone']}) | Components: X1 {z_res['x1_wc_ta']}, X2 {z_res['x2_re_ta']}, X3 {z_res['x3_ebit_ta']}, X4 {z_res['x4_mve_tl']}, X5 {z_res['x5_sales_ta']}")
print("LEVERAGE_AND_DISTRESS_ANALYSIS_PASS")
