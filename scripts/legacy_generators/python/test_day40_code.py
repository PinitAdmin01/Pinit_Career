# Day 40 Code Prototype: Milestone 8 Capstone - Corporate Tax, Equity & Capital Reporting Suite
# Integrated corporate reporting simulator combining Ind AS 102 ESOPs, Ind AS 12 Deferred Taxes,
# Ind AS 33 Diluted EPS, and Ind AS 37 Provisions & Decommissioning.

from dataclasses import dataclass
from typing import List, Dict

class CorporateTaxEquityCapitalSuite:
    def __init__(self, enterprise_name: str, tax_rate_pct: float):
        self.enterprise_name = enterprise_name
        self.tax_rate = tax_rate_pct / 100.0

    def process_ind_as_102_esop(self, count: int, fv: float, years: int, forf_rate: float) -> Dict[str, float]:
        """Module 1: Ind AS 102 Equity-Settled ESOP Amortization."""
        effective_pool = count * (1.0 - forf_rate)
        total_cost = effective_pool * fv
        annual_expense = total_cost / years
        return {
            "effective_options_pool": effective_pool,
            "total_compensation_cost": round(total_cost, 2),
            "year1_esop_expense": round(annual_expense, 2)
        }

    def process_ind_as_12_deferred_tax(self, taxable_diff: float, deductible_diff: float) -> Dict[str, float]:
        """Module 2: Ind AS 12 Balance Sheet Deferred Tax Position."""
        dtl = round(taxable_diff * self.tax_rate, 2)
        dta = round(deductible_diff * self.tax_rate, 2)
        net_dtl = round(dtl - dta, 2)
        return {
            "gross_dtl": dtl,
            "gross_dta": dta,
            "net_deferred_tax_liability": net_dtl
        }

    def process_ind_as_33_eps(
        self,
        net_profit: float,
        wanos: int,
        options_count: int,
        strike: float,
        market_price: float,
        deb_principal: float,
        deb_coupon: float,
        deb_shares: int
    ) -> Dict[str, float]:
        """Module 3: Ind AS 33 Basic & Diluted EPS."""
        basic_eps = net_profit / wanos
        
        # Options
        opt_proceeds = options_count * strike
        opt_repurchased = opt_proceeds / market_price
        opt_incremental_shares = options_count - opt_repurchased
        
        # Debentures
        deb_gross_int = deb_principal * (deb_coupon / 100.0)
        deb_after_tax_int = deb_gross_int * (1.0 - self.tax_rate)
        
        adj_num = net_profit + deb_after_tax_int
        adj_den = float(wanos) + opt_incremental_shares + float(deb_shares)
        diluted_eps = adj_num / adj_den
        
        return {
            "basic_eps": round(basic_eps, 2),
            "diluted_eps": round(diluted_eps, 2),
            "incremental_shares_options": round(opt_incremental_shares, 2),
            "after_tax_interest_saved": round(deb_after_tax_int, 2)
        }

    def process_ind_as_37_provisions(
        self,
        decom_future: float,
        decom_years: int,
        discount_rate: float,
        severance: float,
        lease_exit: float
    ) -> Dict[str, float]:
        """Module 4: Ind AS 37 Decommissioning & Restructuring Provisions."""
        initial_pv = decom_future / ((1.0 + discount_rate) ** decom_years)
        unwinding_y1 = initial_pv * discount_rate
        carrying_decom_y1 = initial_pv + unwinding_y1
        restructuring_provision = severance + lease_exit
        
        return {
            "initial_decommissioning_pv": round(initial_pv, 2),
            "year1_discount_unwinding": round(unwinding_y1, 2),
            "year1_decommissioning_liability": round(carrying_decom_y1, 2),
            "restructuring_provision": round(restructuring_provision, 2)
        }

suite = CorporateTaxEquityCapitalSuite("Global Aerospace & Industrial Technologies Corp", 25.168)

# Module 1
esop_res = suite.process_ind_as_102_esop(120000, 20.0, 4, 0.05)
assert esop_res["total_compensation_cost"] == 2280000.0
assert esop_res["year1_esop_expense"] == 570000.0

# Module 2
tax_res = suite.process_ind_as_12_deferred_tax(900000.0, 750000.0)
assert tax_res["gross_dtl"] == 226512.0
assert tax_res["gross_dta"] == 188760.0
assert tax_res["net_deferred_tax_liability"] == 37752.0

# Module 3
eps_res = suite.process_ind_as_33_eps(
    net_profit=6000000.0,
    wanos=1200000,
    options_count=100000,
    strike=30.0,
    market_price=60.0,
    deb_principal=4000000.0,
    deb_coupon=6.0,
    deb_shares=150000
)
assert eps_res["basic_eps"] == 5.00
assert eps_res["incremental_shares_options"] == 50000.0
assert eps_res["after_tax_interest_saved"] == 179596.80
assert eps_res["diluted_eps"] == 4.41

# Module 4
prov_res = suite.process_ind_as_37_provisions(
    decom_future=600000.0,
    decom_years=5,
    discount_rate=0.08,
    severance=500000.0,
    lease_exit=150000.0
)
assert prov_res["initial_decommissioning_pv"] == 408349.92
assert prov_res["year1_discount_unwinding"] == 32667.99
assert prov_res["year1_decommissioning_liability"] == 441017.91
assert prov_res["restructuring_provision"] == 650000.0

print(f"Enterprise: {suite.enterprise_name}")
print(f"Ind AS 102 Year 1 ESOP Expense: ${esop_res['year1_esop_expense']}")
print(f"Ind AS 12 Net DTL: ${tax_res['net_deferred_tax_liability']}")
print(f"Ind AS 33 Basic EPS: ${eps_res['basic_eps']} | Diluted EPS: ${eps_res['diluted_eps']}")
print(f"Ind AS 37 Decommissioning Y1 Liability: ${prov_res['year1_decommissioning_liability']} | Restructuring: ${prov_res['restructuring_provision']}")
print("CORPORATE_TAX_EQUITY_CAPITAL_SUITE_PASS")
