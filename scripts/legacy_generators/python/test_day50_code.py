# Day 50: Milestone 10 Capstone - Advanced Corporate Financial Diagnostics & Forensic Audit Suite
# Comprehensive integrated simulator combining Financial Ratios, DuPont ROE/EVA, Leverage & Distress, and Forensic Beneish M-Score.

from dataclasses import dataclass
from typing import Dict, Any

class CorporateFinancialDiagnosticsSuite:
    def __init__(self, enterprise_name: str, tax_rate_pct: float, wacc_pct: float):
        self.enterprise_name = enterprise_name
        self.tax_rate = tax_rate_pct / 100.0
        self.wacc = wacc_pct / 100.0

    def process_module1_ratios(
        self,
        revenue: float,
        cogs: float,
        ebit: float,
        interest_expense: float,
        current_assets: float,
        current_liabilities: float,
        cash_and_sec: float,
        receivables: float,
        inventory: float,
        payables: float,
        total_debt: float,
        total_equity: float,
        principal_repayments: float
    ) -> Dict[str, float]:
        """Module 1: Liquidity, Solvency, and Working Capital Cycle."""
        cr = current_assets / current_liabilities
        quick_assets = cash_and_sec + receivables
        qr = quick_assets / current_liabilities
        cash_ratio = cash_and_sec / current_liabilities
        daily_opex = (revenue - ebit) / 365.0
        dir_days = quick_assets / daily_opex
        
        de_ratio = total_debt / total_equity
        icr = ebit / interest_expense
        dscr = ebit / (interest_expense + (principal_repayments / (1.0 - self.tax_rate)))
        
        dso = (receivables / revenue) * 365.0
        dio = (inventory / cogs) * 365.0
        dpo = (payables / cogs) * 365.0
        ccc = dio + dso - dpo
        
        return {
            "current_ratio": round(cr, 2),
            "quick_ratio": round(qr, 2),
            "cash_ratio": round(cash_ratio, 2),
            "defensive_interval_days": round(dir_days, 1),
            "debt_to_equity": round(de_ratio, 2),
            "interest_coverage": round(icr, 2),
            "dscr": round(dscr, 2),
            "cash_conversion_cycle": round(ccc, 1)
        }

    def process_module2_dupont_eva(
        self,
        revenue: float,
        ebit: float,
        interest_expense: float,
        net_income: float,
        total_assets: float,
        total_equity: float,
        total_debt: float,
        cash: float
    ) -> Dict[str, float]:
        """Module 2: 5-Stage DuPont ROE and ROIC/EVA Decomposition."""
        ebt = ebit - interest_expense
        tax_burden = net_income / ebt
        interest_burden = ebt / ebit
        op_margin = ebit / revenue
        ato = revenue / total_assets
        em = total_assets / total_equity
        roe_5stage = tax_burden * interest_burden * op_margin * ato * em
        
        nopat = ebit * (1.0 - self.tax_rate)
        invested_capital = (total_debt + total_equity) - cash
        roic = nopat / invested_capital
        capital_charge = invested_capital * self.wacc
        eva = nopat - capital_charge
        
        return {
            "tax_burden": round(tax_burden, 4),
            "interest_burden": round(interest_burden, 4),
            "operating_margin_pct": round(op_margin * 100, 2),
            "asset_turnover": round(ato, 4),
            "equity_multiplier": round(em, 4),
            "roe_pct": round(roe_5stage * 100, 2),
            "nopat": round(nopat, 2),
            "invested_capital": round(invested_capital, 2),
            "roic_pct": round(roic * 100, 2),
            "eva": round(eva, 2)
        }

    def process_module3_leverage_distress(
        self,
        revenue: float,
        variable_costs: float,
        fixed_operating_costs: float,
        interest_expense: float,
        working_capital: float,
        retained_earnings: float,
        market_cap_equity: float,
        total_liabilities: float,
        total_assets: float,
        shares_plan1: int,
        shares_plan2: int
    ) -> Dict[str, Any]:
        """Module 3: Operating/Financial Leverage, Indifference & Altman Z-Score."""
        contribution = revenue - variable_costs
        ebit = contribution - fixed_operating_costs
        dol = contribution / ebit
        dfl = ebit / (ebit - interest_expense)
        dcl = dol * dfl
        
        indiff_ebit = (interest_expense * shares_plan1) / (shares_plan1 - shares_plan2)
        
        x1 = working_capital / total_assets
        x2 = retained_earnings / total_assets
        x3 = ebit / total_assets
        x4 = market_cap_equity / total_liabilities
        x5 = revenue / total_assets
        z_score = (1.2 * x1) + (1.4 * x2) + (3.3 * x3) + (0.6 * x4) + (0.999 * x5)
        zone = "Safe Zone" if z_score > 2.99 else ("Grey Zone" if z_score >= 1.81 else "Distress Zone")
        
        return {
            "dol": round(dol, 4),
            "dfl": round(dfl, 4),
            "dcl": round(dcl, 4),
            "indifference_ebit": round(indiff_ebit, 2),
            "altman_z_score": round(z_score, 2),
            "distress_zone": zone
        }

    def process_module4_forensic_beneish(
        self,
        rev_t: float,
        rev_prev: float,
        cogs_t: float,
        cogs_prev: float,
        rec_t: float,
        rec_prev: float,
        ca_t: float,
        ca_prev: float,
        ppe_t: float,
        ppe_prev: float,
        ta_t: float,
        ta_prev: float,
        dep_t: float,
        dep_prev: float,
        sga_t: float,
        sga_prev: float,
        ltd_t: float,
        ltd_prev: float,
        ni_t: float,
        cfo_t: float
    ) -> Dict[str, Any]:
        """Module 4: Sloan Accruals, Cash Flow Realism, and Beneish M-Score."""
        accruals = ni_t - cfo_t
        avg_assets = (ta_t + ta_prev) / 2.0
        accrual_ratio = accruals / avg_assets
        cf_realism = cfo_t / ni_t if ni_t != 0 else 0.0
        
        dsri = (rec_t / rev_t) / (rec_prev / rev_prev)
        gm_prev = (rev_prev - cogs_prev) / rev_prev
        gm_t = (rev_t - cogs_t) / rev_t
        gmi = gm_prev / gm_t
        non_ca_ppe_t = 1.0 - ((ca_t + ppe_t) / ta_t)
        non_ca_ppe_prev = 1.0 - ((ca_prev + ppe_prev) / ta_prev)
        aqi = non_ca_ppe_t / non_ca_ppe_prev
        sgi = rev_t / rev_prev
        dep_rate_prev = dep_prev / (ppe_prev + dep_prev)
        dep_rate_t = dep_t / (ppe_t + dep_t)
        depi = dep_rate_prev / dep_rate_t
        sgai = (sga_t / rev_t) / (sga_prev / rev_prev)
        lvgi = (ltd_t / ta_t) / (ltd_prev / ta_prev)
        tata = (ni_t - cfo_t) / ta_t
        
        m_score = (
            -4.84
            + (0.920 * dsri)
            + (0.528 * gmi)
            + (0.404 * aqi)
            + (0.892 * sgi)
            + (0.115 * depi)
            - (0.172 * sgai)
            + (4.037 * tata)
            + (0.0327 * lvgi)
        )
        risk = "Low Risk (Unlikely Manipulator)" if m_score <= -1.78 else "High Risk (Likely Manipulator)"
        
        return {
            "total_accruals": round(accruals, 2),
            "accrual_ratio_pct": round(accrual_ratio * 100, 2),
            "cash_flow_realism": round(cf_realism, 2),
            "beneish_m_score": round(m_score, 2),
            "manipulation_risk": risk
        }

suite = CorporateFinancialDiagnosticsSuite("Apex Veritas Industrial Conglomerate Ltd", 25.168, 11.5)

# Module 1
m1 = suite.process_module1_ratios(
    revenue=120000000.0,
    cogs=72000000.0,
    ebit=24000000.0,
    interest_expense=4000000.0,
    current_assets=44000000.0,
    current_liabilities=22000000.0,
    cash_and_sec=10000000.0,
    receivables=16000000.0,
    inventory=18000000.0,
    payables=12000000.0,
    total_debt=40000000.0,
    total_equity=60000000.0,
    principal_repayments=3000000.0
)
assert m1["current_ratio"] == 2.0
assert m1["quick_ratio"] == 1.18
assert m1["cash_ratio"] == 0.45
assert m1["defensive_interval_days"] == 98.9
assert m1["debt_to_equity"] == 0.67
assert m1["interest_coverage"] == 6.0
assert m1["dscr"] == 3.0
assert m1["cash_conversion_cycle"] == 79.1

# Module 2
m2 = suite.process_module2_dupont_eva(
    revenue=120000000.0,
    ebit=24000000.0,
    interest_expense=4000000.0,
    net_income=14966400.0,
    total_assets=124000000.0,
    total_equity=60000000.0,
    total_debt=40000000.0,
    cash=6000000.0
)
assert m2["tax_burden"] == 0.7483
assert m2["interest_burden"] == 0.8333
assert m2["operating_margin_pct"] == 20.0
assert m2["asset_turnover"] == 0.9677
assert m2["equity_multiplier"] == 2.0667
assert m2["roe_pct"] == 24.94
assert m2["nopat"] == 17959680.0
assert m2["invested_capital"] == 94000000.0
assert m2["roic_pct"] == 19.11
assert m2["eva"] == 7149680.0

# Module 3
m3 = suite.process_module3_leverage_distress(
    revenue=100000000.0,
    variable_costs=60000000.0,
    fixed_operating_costs=15000000.0,
    interest_expense=5000000.0,
    working_capital=20000000.0,
    retained_earnings=30000000.0,
    market_cap_equity=120000000.0,
    total_liabilities=50000000.0,
    total_assets=100000000.0,
    shares_plan1=10000000,
    shares_plan2=6000000
)
assert m3["dol"] == 1.6
assert m3["dfl"] == 1.25
assert m3["dcl"] == 2.0
assert m3["indifference_ebit"] == 12500000.0
assert m3["altman_z_score"] == 3.92
assert m3["distress_zone"] == "Safe Zone"

# Module 4
m4 = suite.process_module4_forensic_beneish(
    rev_t=120000000.0,
    rev_prev=100000000.0,
    cogs_t=72000000.0,
    cogs_prev=60000000.0,
    rec_t=16000000.0,
    rec_prev=14000000.0,
    ca_t=44000000.0,
    ca_prev=38000000.0,
    ppe_t=60000000.0,
    ppe_prev=54000000.0,
    ta_t=124000000.0,
    ta_prev=110000000.0,
    dep_t=6000000.0,
    dep_prev=5000000.0,
    sga_t=18000000.0,
    sga_prev=16000000.0,
    ltd_t=30000000.0,
    ltd_prev=28000000.0,
    ni_t=14966400.0,
    cfo_t=18000000.0
)
assert m4["total_accruals"] == -3033600.0
assert m4["accrual_ratio_pct"] == -2.59
assert m4["cash_flow_realism"] == 1.20
assert m4["beneish_m_score"] == -2.09
assert m4["manipulation_risk"] == "Low Risk (Unlikely Manipulator)"

print(f"Enterprise: {suite.enterprise_name}")
print(f"Module 1 Ratios: CR {m1['current_ratio']} | DSCR {m1['dscr']}x | CCC {m1['cash_conversion_cycle']}d")
print(f"Module 2 DuPont & EVA: 5-Stage ROE {m2['roe_pct']}% | ROIC {m2['roic_pct']}% | EVA ${m2['eva']:,.2f}")
print(f"Module 3 Leverage & Distress: DCL {m3['dcl']}x | Indifference EBIT ${m3['indifference_ebit']:,.2f} | Z-Score {m3['altman_z_score']} ({m3['distress_zone']})")
print(f"Module 4 Forensic Screening: Accrual Ratio {m4['accrual_ratio_pct']}% | CF Realism {m4['cash_flow_realism']}x | Beneish M-Score {m4['beneish_m_score']} ({m4['manipulation_risk']})")
print("CORPORATE_FINANCIAL_DIAGNOSTICS_SUITE_PASS")
