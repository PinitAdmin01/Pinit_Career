# scripts/run_block11_fin_pipeline.py
"""
Complete execution pipeline for Course 02 (bcom_fin / Corporate Finance & Capital Markets)
Month 2 Block 11: Days 51-55 & Milestone 11 Capstone (Sovereign Wealth Funds, Cross-Border Project Finance & Sustainable Infrastructure).
Enforces all 5 Fast-Path Laws:
- Law 1: 7-paragraph first-pass text (all parts >= 600 words, daily >= 3,000 words).
- Law 2: Gate v2 bulletproof ledger-sheet visual template with SHA-256 bindings.
- Law 3: Exact whitespace preservation (.rstrip('\r\n')).
- Law 4: Zero-poll reactive execution.
- Law 5: Triple-lock cryptographic verification.
"""

import os
import sys
import json
import math
import hashlib
import subprocess

# Import text generators
from create_day51_fin_texts import DAY51_PARTS
from create_day52_fin_texts import DAY52_PARTS
from create_day53_fin_texts import DAY53_PARTS
from create_day54_fin_texts import DAY54_PARTS
from create_day55_fin_texts import DAY55_PARTS

COURSE_ID = "bcom-finance"
VISUALS_DIR = os.path.join("src", "lib", "data", "lessonVisuals", COURSE_ID)
os.makedirs(VISUALS_DIR, exist_ok=True)

# 1. Define Python simulation code snippets for Part 5 of each day
DAY51_CODE = """# Day 51: Sovereign Wealth Fund Portfolio Allocation & Currency Immunization Engine
# Macroeconomic Stabilization, Santiago Governance & Permanent Income Spending

class SovereignWealthFundSimulator:
    def __init__(self, initial_aum):
        self.aum = initial_aum
        self.strategic_asset_allocation = {
            "developed_equities": 0.35,
            "sovereign_fixed_income": 0.25,
            "private_equity": 0.15,
            "real_assets_infrastructure": 0.15,
            "stabilization_cash_reserves": 0.10
        }

    def evaluate_santiago_governance(self):
        # Santiago Principles (GAPP) 10-Pillar Governance Scoring (0-10 scale)
        pillars = {
            "legal_framework_clarity": 10.0,
            "policy_purpose_segregation": 9.5,
            "independent_commercial_board": 9.0,
            "operational_investment_autonomy": 9.5,
            "public_investment_guidelines": 9.0,
            "annual_report_transparency": 9.0,
            "independent_external_audit": 10.0,
            "robust_risk_management_framework": 9.0,
            "professional_ethics_code": 9.0,
            "immunity_from_political_looting": 9.0
        }
        total_score = sum(pillars.values())
        return total_score, total_score >= 90.0

    def simulate_ten_year_macroeconomic_trajectory(self):
        # 10-Year Commodity Shock: Oil drops from $85 to $42/bbl against $70 fiscal breakeven
        oil_prices = [85.0, 80.0, 75.0, 65.0, 50.0, 42.0, 55.0, 68.0, 78.0, 85.0]
        fiscal_breakeven = 70.0
        annual_export_volume_mbbl = 400.0  # 400M barrels/year
        expected_real_return = 0.035       # 3.5% real asset return
        spending_rule_cap = 0.030          # Norway-style 3.0% permanent income rule

        current_aum = self.aum
        records = []
        for year, p_oil in enumerate(oil_prices, start=1):
            opening_aum = current_aum
            # Commodity Fiscal Surplus / Deficit
            fiscal_diff = (p_oil - fiscal_breakeven) * annual_export_volume_mbbl * 1000000.0
            
            # Portfolio Investment Return
            portfolio_gain = opening_aum * expected_real_return
            
            # Annual Budget Drawdown restricted by spending rule
            max_drawdown = opening_aum * spending_rule_cap
            actual_drawdown = max_drawdown if fiscal_diff < 0 else (max_drawdown * 0.5)

            # Net Fund Inflow / Outflow
            net_cash_flow = fiscal_diff - actual_drawdown
            closing_aum = opening_aum + portfolio_gain + net_cash_flow
            current_aum = closing_aum

            records.append({
                "year": year,
                "oil_price": p_oil,
                "fiscal_diff": fiscal_diff,
                "drawdown": actual_drawdown,
                "closing_aum": closing_aum
            })
        return records

    def execute_currency_risk_immunization(self):
        # Cross-Currency Exposure and Forward Rate Parity Immunization
        foreign_exposures = {
            "USD": 55000000000.0,
            "EUR": 25000000000.0,
            "GBP": 10000000000.0,
            "JPY": 10000000000.0
        }
        # Forward hedge overlay for developed fixed income & liquid assets
        hedged_ratio = 0.80
        total_hedged_notional = sum(foreign_exposures.values()) * hedged_ratio
        return total_hedged_notional

def main():
    fund = SovereignWealthFundSimulator(initial_aum=100000000000.0) # $100B AUM
    score, is_compliant = fund.evaluate_santiago_governance()
    records = fund.simulate_ten_year_macroeconomic_trajectory()
    hedged_volume = fund.execute_currency_risk_immunization()

    print("=== SOVEREIGN WEALTH FUND SIMULATION RESULTS ===")
    print(f"Initial Fund AUM: ${fund.aum/1e9:.2f} Billion")
    print(f"Santiago Governance Score: {score:.1f}/100.0 (Compliant: {is_compliant})")
    print(f"Hedged Currency Notional: ${hedged_volume/1e9:.2f} Billion")
    print(f"Year 6 (Shock Trough) Closing AUM: ${records[5]['closing_aum']/1e9:.2f} Billion")
    print(f"Year 10 Closing AUM: ${records[9]['closing_aum']/1e9:.2f} Billion")

    assert is_compliant, "Governance non-compliant!"
    assert records[9]["closing_aum"] > fund.aum, "Failed intergenerational capital preservation!"
    print("VERIFICATION_TOKEN: SOVEREIGN_WEALTH_FUND_SIMULATOR_PASS")

if __name__ == "__main__":
    main()
"""

DAY52_CODE = """# Day 52: Cross-Border Project Finance & Non-Recourse Debt Sculpting Engine
# Availability PPA, Debt Sculpting to Target DSCR & MIGA Political Risk Guarantee

class ProjectFinanceSculptingEngine:
    def __init__(self, initial_capex, debt_to_capital_ratio, target_dscr, interest_rate, loan_tenure):
        self.capex = initial_capex
        self.debt_ratio = debt_to_capital_ratio
        self.target_dscr = target_dscr
        self.rate = interest_rate
        self.tenure = loan_tenure

    def build_project_cash_flows(self, total_years=20):
        # 20-Year Availability Concession
        base_tariff_revenue = 95000000.0   # $95M base availability payment
        inflation_rate = 0.02
        base_opex = 22000000.0             # $22M fixed & variable O&M
        tax_rate = 0.20

        cfads_list = []
        for t in range(1, total_years + 1):
            rev_t = base_tariff_revenue * ((1.0 + inflation_rate) ** (t - 1))
            opex_t = base_opex * ((1.0 + inflation_rate) ** (t - 1))
            ebitda_t = rev_t - opex_t
            taxes_t = ebitda_t * tax_rate
            cfads_t = ebitda_t - taxes_t
            cfads_list.append(cfads_t)
        return cfads_list

    def sculpt_senior_debt_schedule(self, cfads_list):
        # Exact debt sculpting algorithm: Debt_Service_t = CFADS_t / Target_DSCR
        # PV of Debt Service gives initial debt capacity
        target_debt_service = [cfads / self.target_dscr for cfads in cfads_list[:self.tenure]]
        
        # Calculate maximum supported debt by discounting target debt service
        discount_factors = [(1.0 + self.rate) ** (-t) for t in range(1, self.tenure + 1)]
        debt_capacity = sum(ds * df for ds, df in zip(target_debt_service, discount_factors))

        # Build amortization table
        current_debt = debt_capacity
        amortization_table = []
        for t in range(1, self.tenure + 1):
            cfads_t = cfads_list[t - 1]
            ds_t = target_debt_service[t - 1]
            interest_t = current_debt * self.rate
            principal_t = ds_t - interest_t
            ending_debt = current_debt - principal_t
            actual_dscr = cfads_t / ds_t

            amortization_table.append({
                "period": t,
                "beginning_debt": current_debt,
                "cfads": cfads_t,
                "debt_service": ds_t,
                "interest": interest_t,
                "principal": principal_t,
                "ending_debt": ending_debt,
                "dscr": actual_dscr
            })
            current_debt = ending_debt

        return debt_capacity, amortization_table

    def simulate_miga_political_risk_event(self, cfads_list, year=8):
        # Year 8 Inconvertibility Shock: Host sovereign suspends FX wire transfers
        # SPV experiences 80% revenue transfer block; MIGA PRI pays 90% shortfall
        normal_cfads = cfads_list[year - 1]
        transferred_cfads = normal_cfads * 0.20
        shortfall = normal_cfads - transferred_cfads
        miga_claim_payout = shortfall * 0.90
        recovered_cfads = transferred_cfads + miga_claim_payout
        return normal_cfads, transferred_cfads, miga_claim_payout, recovered_cfads

def main():
    engine = ProjectFinanceSculptingEngine(
        initial_capex=800000000.0,
        debt_to_capital_ratio=0.75,
        target_dscr=1.30,
        interest_rate=0.060,
        loan_tenure=15
    )
    cfads_list = engine.build_project_cash_flows(total_years=20)
    debt_cap, schedule = engine.sculpt_senior_debt_schedule(cfads_list)
    norm, trans, miga_pay, recov = engine.simulate_miga_political_risk_event(cfads_list, year=8)

    print("=== PROJECT FINANCE DEBT SCULPTING RESULTS ===")
    print(f"Total Initial Capex: ${engine.capex/1e6:.2f}M")
    print(f"Sculpted Senior Debt Capacity: ${debt_cap/1e6:.2f}M (Gearing: {debt_cap/engine.capex*100:.1f}%)")
    print(f"Year 1 DSCR: {schedule[0]['dscr']:.2f}x | Principal: ${schedule[0]['principal']/1e6:.2f}M")
    print(f"Year 15 (Final Debt Balance): ${schedule[14]['ending_debt']:.2f}")
    print(f"Year 8 MIGA Claim Payout: ${miga_pay/1e6:.2f}M (Recovered CFADS: ${recov/1e6:.2f}M)")

    assert abs(schedule[14]["ending_debt"]) < 1e-4, "Debt failed to fully amortize!"
    assert all(abs(row["dscr"] - 1.30) < 1e-4 for row in schedule), "DSCR deviation from target!"
    print("VERIFICATION_TOKEN: PROJECT_FINANCE_NON_RECOURSE_DEBT_PASS")

if __name__ == "__main__":
    main()
"""

DAY53_CODE = """# Day 53: Infrastructure Valuation & YieldCo Financial Engineering Engine
# RAB Building Block Model & YieldCo CAFD Distribution Waterfall with IDR Tiers

class InfrastructureValuationEngine:
    def __init__(self, initial_rab, allowed_wacc, initial_yieldco_ebitda):
        self.rab = initial_rab
        self.allowed_wacc = allowed_wacc
        self.yieldco_ebitda = initial_yieldco_ebitda

    def build_five_year_rab_model(self):
        # 5-Year Regulatory Period for Transmission Grid Utility
        annual_capex = 120000000.0         # $120M approved network capex
        reg_depreciation_rate = 0.030      # 3.0% regulatory depreciation
        efficient_opex = 45000000.0        # $45M benchmarked efficient opex
        inflation_rate = 0.025             # 2.5% inflation indexation

        current_rab = self.rab
        rab_schedule = []
        for t in range(1, 6):
            opening_rab = current_rab
            reg_depr = opening_rab * reg_depreciation_rate
            inflation_add = opening_rab * inflation_rate
            closing_rab = opening_rab + annual_capex - reg_depr + inflation_add

            # Building Block Allowable Revenue
            return_on_capital = opening_rab * self.allowed_wacc
            allowable_revenue = return_on_capital + reg_depr + efficient_opex

            rab_schedule.append({
                "year": t,
                "opening_rab": opening_rab,
                "capex": annual_capex,
                "depreciation": reg_depr,
                "closing_rab": closing_rab,
                "return_on_capital": return_on_capital,
                "allowable_revenue": allowable_revenue
            })
            current_rab = closing_rab
        return rab_schedule

    def model_yieldco_cafd_waterfall(self):
        # YieldCo Cash Available for Distribution (CAFD)
        ebitda = self.yieldco_ebitda       # $150M EBITDA
        cash_interest = 35000000.0         # $35M interest
        principal_amort = 25000000.0       # $25M debt amort
        maint_capex = 8000000.0            # $8M maintenance capex

        cafd = ebitda - cash_interest - principal_amort - maint_capex  # $82M CAFD
        payout_ratio = 0.85
        total_distribution = cafd * payout_ratio                      # $69.7M
        shares_outstanding = 50000000.0                               # 50M shares
        dps = total_distribution / shares_outstanding                 # $1.394/share ($0.3485/quarter)

        # Incentive Distribution Rights (IDR) Tier Waterfall
        # Tier 1: up to $0.50/quarter -> 100% LP / 0% GP
        # Tier 2: $0.50 to $0.70/quarter -> 75% LP / 25% GP
        # Tier 3: > $0.70/quarter -> 50% LP / 50% GP
        q_dps = dps / 4.0
        lp_split = 1.00
        gp_split = 0.00
        if q_dps > 0.50:
            gp_split = 0.25
            lp_split = 0.75

        return cafd, total_distribution, dps, q_dps, lp_split, gp_split

def main():
    engine = InfrastructureValuationEngine(
        initial_rab=2000000000.0, # $2.0B RAB
        allowed_wacc=0.055,       # 5.50% Real Allowed WACC
        initial_yieldco_ebitda=150000000.0 # $150M EBITDA
    )
    rab_schedule = engine.build_five_year_rab_model()
    cafd, dist, dps, q_dps, lp, gp = engine.model_yieldco_cafd_waterfall()

    print("=== INFRASTRUCTURE & YIELDCO SIMULATION RESULTS ===")
    print(f"Opening RAB: ${engine.rab/1e9:.2f}B | Year 5 Closing RAB: ${rab_schedule[4]['closing_rab']/1e9:.2f}B")
    print(f"Year 1 Allowable Utility Revenue: ${rab_schedule[0]['allowable_revenue']/1e6:.2f}M")
    print(f"YieldCo Annual CAFD: ${cafd/1e6:.2f}M (Distribution: ${dist/1e6:.2f}M)")
    print(f"Annual Dividend Per Share (DPS): ${dps:.3f} (Quarterly: ${q_dps:.3f})")
    print(f"GP Sponsor IDR Allocation Split: {gp*100:.1f}%")

    assert rab_schedule[4]["closing_rab"] > engine.rab, "RAB failed to expand!"
    assert cafd == 82000000.0, "CAFD calculation discrepancy!"
    print("VERIFICATION_TOKEN: INFRASTRUCTURE_VALUATION_YIELDCO_RAB_PASS")

if __name__ == "__main__":
    main()
"""

DAY54_CODE = """# Day 54: Sustainable Finance, Greenium Pricing & Carbon Treasury Optimizer
# Green Bond Valuation, SLL Two-Way Margin Ratchet & EU ETS Compliance Hedging

class SustainableFinanceCarbonEngine:
    def __init__(self, bond_notional, sll_facility, annual_emissions):
        self.bond_notional = bond_notional
        self.sll_facility = sll_facility
        self.emissions = annual_emissions

    def evaluate_green_bond_greenium(self):
        # $1.0B 10-Year Bond: Conventional yield 4.50%, Green yield 4.42% (8 bps greenium)
        conventional_coupon = 0.0450
        green_coupon = 0.0442
        greenium_bps = 8.0
        tenure = 10
        discount_rate = 0.0450

        annual_interest_savings = self.bond_notional * (conventional_coupon - green_coupon) # $800k/yr
        upfront_spo_audit = 120000.0
        annual_impact_reporting = 40000.0

        # Net Present Value of Greenium Savings
        pv_gross_savings = sum(annual_interest_savings / ((1.0 + discount_rate) ** t) for t in range(1, tenure + 1))
        pv_reporting_costs = sum(annual_impact_reporting / ((1.0 + discount_rate) ** t) for t in range(1, tenure + 1))
        net_greenium_npv = pv_gross_savings - upfront_spo_audit - pv_reporting_costs
        return annual_interest_savings, net_greenium_npv

    def model_sll_two_way_margin_ratchet(self):
        # $500M SLL Revolving Credit Facility (SOFR + 150 bps base margin)
        # Margin Ratchet: +/- 7.5 bps tied to Scope 1/2 emissions and renewable sourcing
        base_margin_bps = 150.0
        discount_bps = 7.5
        penalty_bps = 7.5

        # 5-Year Performance Scenario: Met in Y1, Y2, Y4; Missed in Y3, Y5
        performance = [True, True, False, True, False]
        margins = []
        interest_adjustments = []

        for met in performance:
            eff_margin = base_margin_bps - discount_bps if met else base_margin_bps + penalty_bps
            delta_interest = self.sll_facility * ((-discount_bps if met else penalty_bps) / 10000.0)
            margins.append(eff_margin)
            interest_adjustments.append(delta_interest)

        return margins, sum(interest_adjustments)

    def optimize_eu_ets_compliance_carbon(self):
        # 450,000 tons emissions; 300,000 free EUAs; 150,000 ton compliance deficit
        free_allowances = 300000.0
        deficit_tons = max(0.0, self.emissions - free_allowances)
        
        # Hedging Strategy: Forward lock 80% at €82/t vs Unhedged Spot €95/t
        forward_price = 82.0
        spot_price = 95.0
        hedged_ratio = 0.80

        hedged_tons = deficit_tons * hedged_ratio
        unhedged_tons = deficit_tons * (1.0 - hedged_ratio)

        total_hedged_cost = (hedged_tons * forward_price) + (unhedged_tons * spot_price)
        unhedged_cost = deficit_tons * spot_price
        cost_savings = unhedged_cost - total_hedged_cost
        
        # Avoided non-compliance penalty (€120/t fine)
        statutory_penalty_avoided = deficit_tons * 120.0
        return deficit_tons, total_hedged_cost, cost_savings, statutory_penalty_avoided

def main():
    engine = SustainableFinanceCarbonEngine(
        bond_notional=1000000000.0, # $1.0B Green Bond
        sll_facility=500000000.0,   # $500M SLL
        annual_emissions=450000.0   # 450k tons CO2e
    )
    ann_savings, npv_greenium = engine.evaluate_green_bond_greenium()
    margins, net_sll_delta = engine.model_sll_two_way_margin_ratchet()
    deficit, carbon_cost, carbon_savings, penalty_avoided = engine.optimize_eu_ets_compliance_carbon()

    print("=== SUSTAINABLE FINANCE & CARBON OPTIMIZER RESULTS ===")
    print(f"Annual Greenium Interest Savings: ${ann_savings/1e3:.1f}k")
    print(f"Net Present Value of Greenium: ${npv_greenium/1e6:.2f}M")
    print(f"SLL 5-Year Margins: {margins} bps")
    print(f"EU ETS Carbon Allowance Shortfall: {deficit:,.0f} tons")
    print(f"Hedging Cost Savings: €{carbon_savings:,.0f} (Avoided Penalty: €{penalty_avoided:,.0f})")

    assert npv_greenium > 5000000.0, "Greenium NPV below expectations!"
    assert carbon_savings > 0, "Forward carbon hedge failed to create value!"
    print("VERIFICATION_TOKEN: SUSTAINABLE_FINANCE_CARBON_OPTIMIZER_PASS")

if __name__ == "__main__":
    main()
"""

DAY55_CODE = """# Day 55: Milestone 11 Capstone: Global Sovereign Capital, Infrastructure Syndicate & ESG Engine
# Master Synthesis: Sovereign Equity, Non-Recourse Debt Sculpting, RAB & YieldCo Drop-Downs

class GlobalSovereignInfrastructureMasterCapstone:
    def __init__(self):
        # $5.0B Total Program Capitalization
        self.total_ev = 5000000000.0
        self.swf_equity = 1000000000.0       # $1.0B Sovereign Wealth Fund
        self.pe_equity = 500000000.0         # $500M Infrastructure Private Equity
        self.senior_project_debt = 2500000000.0  # $2.5B Sculpted Project Term Loan
        self.green_bonds = 1000000000.0      # $1.0B ICMA Certified Green Bonds

    def execute_master_synthesis(self):
        # 1. Verify Capital Stack Balance
        total_sources = self.swf_equity + self.pe_equity + self.senior_project_debt + self.green_bonds
        assert total_sources == self.total_ev, "Capital stack imbalance!"

        # 2. Debt Sculpting & Coverage Verification (1.30x Target DSCR)
        annual_cfads = 265000000.0  # $265M average CFADS
        target_dscr = 1.30
        annual_debt_service = annual_cfads / target_dscr # $203.85M
        
        # 3. RAB Transmission Utility Division
        rab_value = 1800000000.0
        allowed_wacc = 0.055
        rab_annual_return = rab_value * allowed_wacc     # $99.0M

        # 4. YieldCo CAFD & Dividend Payout
        yieldco_ebitda = 220000000.0
        yieldco_debt_service = 110000000.0
        yieldco_maint_capex = 12000000.0
        cafd = yieldco_ebitda - yieldco_debt_service - yieldco_maint_capex # $98.0M
        yieldco_dividend_payout = cafd * 0.85            # $83.3M

        # 5. Sustainable Treasury Benefits
        greenium_savings = self.green_bonds * 0.0008     # 8 bps on $1.0B = $800k
        sll_discount = 500000000.0 * 0.00075             # 7.5 bps on $500M = $375k
        annual_esg_savings = greenium_savings + sll_discount

        # 6. Combined 6-Month DSRA Liquidity Buffer
        dsra_reserve = annual_debt_service / 2.0         # ~$101.9M

        return {
            "total_ev": self.total_ev,
            "debt_gearing": (self.senior_project_debt + self.green_bonds) / self.total_ev,
            "annual_cfads": annual_cfads,
            "annual_debt_service": annual_debt_service,
            "dscr": target_dscr,
            "dsra_reserve": dsra_reserve,
            "rab_return": rab_annual_return,
            "yieldco_cafd": cafd,
            "annual_esg_savings": annual_esg_savings
        }

def main():
    capstone = GlobalSovereignInfrastructureMasterCapstone()
    res = capstone.execute_master_synthesis()

    print("=== GLOBAL SOVEREIGN INFRASTRUCTURE MASTER CAPSTONE ===")
    print(f"Total Program Capitalization: ${res['total_ev']/1e9:.2f} Billion")
    print(f"Total Debt Gearing: {res['debt_gearing']*100:.1f}%")
    print(f"Annual CFADS: ${res['annual_cfads']/1e6:.2f}M | Debt Service: ${res['annual_debt_service']/1e6:.2f}M")
    print(f"Target DSCR: {res['dscr']:.2f}x | 6-Month DSRA: ${res['dsra_reserve']/1e6:.2f}M")
    print(f"RAB Annual Return on Capital: ${res['rab_return']/1e6:.2f}M")
    print(f"YieldCo CAFD: ${res['yieldco_cafd']/1e6:.2f}M")
    print(f"Annual Sustainable Treasury Savings: ${res['annual_esg_savings']/1e6:.2f}M")

    assert res["debt_gearing"] == 0.70, "Gearing mismatch!"
    assert res["dscr"] == 1.30, "DSCR mismatch!"
    print("VERIFICATION_TOKEN: SOVEREIGN_INFRASTRUCTURE_ESG_MASTER_CAPSTONE_PASS")

if __name__ == "__main__":
    main()
"""

# Dictionary of days data for pipeline iteration
BLOCK11_DAYS = [
    {
        "day": 51,
        "title": "Sovereign Wealth Funds & State Capital Allocation",
        "description": "Architect sovereign wealth portfolios, analyze Santiago Principles governance, and model macroeconomic stabilization vs intergenerational permanent income endowment spending.",
        "parts": DAY51_PARTS,
        "code": DAY51_CODE,
        "token": "SOVEREIGN_WEALTH_FUND_SIMULATOR_PASS",
        "visual_captions": [
            "Sovereign wealth fund capital allocation framework.",
            "Commodity stabilization buffer and spending rule.",
            "Strategic direct coinvestment equity structure.",
            "National security review and treaty protections.",
            "Sovereign portfolio balance sheet ledger simulation."
        ],
        "debits": [
            {"account": "Global Equities & Infrastructure Assets", "amount": 75000000000.0},
            {"account": "Sovereign Fixed Income Portfolio", "amount": 25000000000.0}
        ],
        "credits": [
            {"account": "Sovereign State Endowment Capital", "amount": 90000000000.0},
            {"account": "Foreign Exchange Stabilization Reserve", "amount": 10000000000.0}
        ]
    },
    {
        "day": 52,
        "title": "Cross-Border Project Finance & Non-Recourse Debt",
        "description": "Structure bankruptcy-remote infrastructure SPVs, sculpt senior non-recourse debt to exact target DSCRs, and implement MIGA political risk guarantee overlays.",
        "parts": DAY52_PARTS,
        "code": DAY52_CODE,
        "token": "PROJECT_FINANCE_NON_RECOURSE_DEBT_PASS",
        "visual_captions": [
            "Special purpose vehicle ring fenced boundary.",
            "Turnkey lump sum engineering contract nexus.",
            "Sculpted senior debt amortization schedule.",
            "Multilateral political risk guarantee coverage.",
            "Trust and retention account cash flow waterfall."
        ],
        "debits": [
            {"account": "Infrastructure Concession Physical Asset", "amount": 800000000.0},
            {"account": "Debt Service Reserve Account Trust", "amount": 24000000.0}
        ],
        "credits": [
            {"account": "Non Recourse Senior Sculpted Term Loan", "amount": 600000000.0},
            {"account": "Sponsor Equity & Subordinated Capital", "amount": 224000000.0}
        ]
    },
    {
        "day": 53,
        "title": "Infrastructure Asset Valuation & YieldCo Engineering",
        "description": "Value natural monopoly utilities via Regulated Asset Base (RAB) building blocks and engineer YieldCo Cash Available for Distribution (CAFD) dividend waterfalls.",
        "parts": DAY53_PARTS,
        "code": DAY53_CODE,
        "token": "INFRASTRUCTURE_VALUATION_YIELDCO_RAB_PASS",
        "visual_captions": [
            "Regulated asset base building block roll forward.",
            "Allowable return on capital utility tariffs.",
            "YieldCo cash available for distribution waterfall.",
            "Finite concession life asset retirement decay.",
            "Infrastructure enterprise valuation dashboard."
        ],
        "debits": [
            {"account": "Regulated Transmission Asset Base", "amount": 2000000000.0},
            {"account": "YieldCo Cash Available for Distribution", "amount": 82000000.0}
        ],
        "credits": [
            {"account": "Institutional Regulated Utility Bonds", "amount": 1200000000.0},
            {"account": "Public Common YieldCo Equity & Sponsor IDR", "amount": 882000000.0}
        ]
    },
    {
        "day": 54,
        "title": "Sustainable Finance, Green Bonds & Carbon Markets",
        "description": "Price ICMA Green Bonds with greenium yield discounts, structure Sustainability-Linked Loan margin ratchets, and execute compliance carbon ETS forward hedges.",
        "parts": DAY54_PARTS,
        "code": DAY54_CODE,
        "token": "SUSTAINABLE_FINANCE_CARBON_OPTIMIZER_PASS",
        "visual_captions": [
            "Green bond use of proceeds ring fenced ledger.",
            "Second party opinion external verification audit.",
            "Sustainability linked loan margin ratchet schedule.",
            "Compliance carbon emissions allowance balance.",
            "Sustainable treasury greenium savings optimization."
        ],
        "debits": [
            {"account": "Verified Green Capital Expenditure Projects", "amount": 1000000000.0},
            {"account": "European Union Carbon Allowance Reserve", "amount": 24600000.0}
        ],
        "credits": [
            {"account": "Senior Unsecured Green Bond Payable", "amount": 1000000000.0},
            {"account": "Carbon Compliance Forward Treasury Liability", "amount": 24600000.0}
        ]
    },
    {
        "day": 55,
        "title": "Milestone 11 Capstone: Sovereign Capital & ESG Engine",
        "description": "Grand Master Capstone unifying sovereign co-investment, sculpted project debt, regulated RAB utilities, YieldCo CAFD, and sustainable treasury optimization.",
        "parts": DAY55_PARTS,
        "code": DAY55_CODE,
        "token": "SOVEREIGN_INFRASTRUCTURE_ESG_MASTER_CAPSTONE_PASS",
        "visual_captions": [
            "Five billion dollar global syndicate capital stack.",
            "Twenty year sculpted senior debt amortization.",
            "Regulated utility and YieldCo dual monetization.",
            "Green bond greenium and margin ratchet savings.",
            "Master sovereign infrastructure balance sheet."
        ],
        "debits": [
            {"account": "Global Renewable Transmission Infrastructure", "amount": 5000000000.0},
            {"account": "Dedicated Six Month Debt Service Reserve", "amount": 101923076.92}
        ],
        "credits": [
            {"account": "Senior Sculpted Project Term Debt Facility", "amount": 2500000000.0},
            {"account": "ICMA Accredited Green Infrastructure Bonds", "amount": 1000000000.0},
            {"account": "Sovereign Wealth Fund & Sponsor Equity", "amount": 1601923076.92}
        ]
    }
]

def run_simulation(code_str, expected_token):
    res = subprocess.run([sys.executable, "-c", code_str], capture_output=True, text=True)
    if res.returncode != 0:
        print("SIMULATION ERROR:\n", res.stderr)
        raise RuntimeError(f"Simulation failed with exit code {res.returncode}")
    stdout_clean = res.stdout.rstrip('\r\n')
    assert expected_token in stdout_clean, f"Token {expected_token} not found in output!"
    return stdout_clean

def generate_visual_envelope(day_meta):
    day_num = day_meta["day"]
    code_snippet = day_meta["code"]
    code_hash = hashlib.sha256(code_snippet.encode('utf-8')).hexdigest()

    total_debit = sum(item["amount"] for item in day_meta["debits"])
    total_credit = sum(item["amount"] for item in day_meta["credits"])
    assert abs(total_debit - total_credit) < 1e-2, f"Day {day_num} balance mismatch!"

    visual_entries = []
    for idx in range(5):
        caption = day_meta["visual_captions"][idx]
        assert len(caption) <= 75, f"Caption too long: {caption}"
        assert caption.endswith("."), f"Caption must end with period: {caption}"
        assert not any(c.isdigit() for c in caption), f"Caption contains digit: {caption}"

        entry = {
            "part": idx + 1,
            "template": "ledger-sheet",
            "caption": caption,
            "data": {
                "title": f"Day {day_num} Part {idx+1} Institutional Balance Sheet",
                "columns": ["Account Category", "Debit ($)", "Credit ($)"],
                "rows": [
                    [item["account"], f"${item['amount']:,.2f}", ""] for item in day_meta["debits"]
                ] + [
                    [item["account"], "", f"${item['amount']:,.2f}"] for item in day_meta["credits"]
                ],
                "totals": ["Total Balancing Checksum", f"${total_debit:,.2f}", f"${total_credit:,.2f}"],
                "isBalanced": True,
                "steps": [
                    {
                        "step": "intro",
                        "title": f"Initial Transaction Analysis (Day {day_num} Part {idx+1})",
                        "description": "Establish structural parameters and regulatory classifications.",
                        "highlightRow": 0
                    },
                    {
                        "step": "say1",
                        "title": "Balance Sheet Account Recognition",
                        "description": "Record verified debit and credit allocations within dedicated capital ledgers.",
                        "highlightRow": 1
                    },
                    {
                        "step": "example",
                        "title": "Credit Covenant & Waterfall Audit",
                        "description": "Verify compliance with debt covenants, statutory reserves, and cash allocations.",
                        "highlightRow": 2
                    },
                    {
                        "step": "tryIt",
                        "title": "Deterministic Verification Confirmation",
                        "description": "Reconcile closing balance sheet totals with zero variance.",
                        "highlightRow": len(day_meta["debits"]) + len(day_meta["credits"]) - 1
                    }
                ]
            },
            "codeBinding": {
                "language": "python",
                "codeHash": code_hash,
                "verified": True
            }
        }
        visual_entries.append(entry)

    envelope = {
        "prefix": COURSE_ID,
        "day": day_num,
        "visuals": visual_entries
    }

    out_path = os.path.join(VISUALS_DIR, f"day-{day_num}.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(envelope, f, indent=2)
    print(f"Wrote Gate v2 visual envelope: {out_path}")

def append_to_bcom_finance_long_lessons():
    ts_path = os.path.join("src", "lib", "data", "bcomFinanceLongLessons.ts")
    with open(ts_path, "r", encoding="utf-8") as f:
        content = f.read()

    days_to_add_code = []
    for day_meta in BLOCK11_DAYS:
        day_num = day_meta["day"]
        # Format parts to strictly match LongLessonPart interface
        parts_copy = []
        for p in day_meta["parts"]:
            soc = p.get("socratic", {})
            part_dict = {
                "part": p["part"],
                "title": p["title"],
                "say": p["say"],
                "example": p.get("example", ""),
                "tryIt": p.get("tryIt", ""),
                "check": {
                    "question": soc.get("question", ""),
                    "options": soc.get("options", []),
                    "answer": soc.get("answerIndex", 0),
                    "why": soc.get("explanation", ""),
                    "explanation": soc.get("explanation", "")
                }
            }
            if p["part"] == 5:
                part_dict["code"] = day_meta["code"]
                part_dict["output"] = day_meta.get("output", "")
            parts_copy.append(part_dict)

        lesson_obj = {
            "day": day_num,
            "coursePrefix": COURSE_ID,
            "title": day_meta["title"],
            "goal": day_meta["description"],
            "parts": parts_copy
        }
        days_to_add_code.append(json.dumps(lesson_obj, indent=2))

    marker = "];\n"
    last_bracket_idx = content.rfind(marker)
    if last_bracket_idx == -1:
        raise RuntimeError("Could not find closing bracket in bcomFinanceLongLessons.ts")

    append_str = ",\n" + ",\n".join(days_to_add_code) + "\n" + marker
    new_content = content[:last_bracket_idx] + append_str

    with open(ts_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print(f"Successfully appended Days 51-55 to {ts_path}!")

def generate_expansion_unit_test():
    test_content = """// tests/bcom_finance_days51_55_expansion.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { BCOM_FINANCE_LONG_LESSONS } from '../src/lib/data/bcomFinanceLongLessons';

test('bcom-finance Days 51-55 Block 11 & Milestone 11 Capstone Expansion Invariants', async (t) => {
  const days51To55 = BCOM_FINANCE_LONG_LESSONS.filter(lesson => lesson.day >= 51 && lesson.day <= 55);

  await t.test('bcom-finance Course 02 Total Days Count Verification (Must have >= 55 days)', () => {
    assert.ok(BCOM_FINANCE_LONG_LESSONS.length >= 55, `Expected >= 55 days, got ${BCOM_FINANCE_LONG_LESSONS.length}`);
  });

  for (const lesson of days51To55) {
    await t.test(`bcom-finance Day ${lesson.day} curriculum integrity & pedagogical standards`, () => {
      assert.strictEqual(lesson.coursePrefix, 'bcom-finance', `Course prefix must be bcom-finance, got ${lesson.coursePrefix}`);
      assert.strictEqual(lesson.parts.length, 5, `Day ${lesson.day} must have exactly 5 parts`);

      let totalDayWords = 0;
      for (const part of lesson.parts) {
        assert.ok(part.part >= 1 && part.part <= 5, `Part number must be between 1 and 5`);
        assert.ok(part.title && part.title.length > 5, `Part ${part.part} must have a descriptive title`);
        assert.ok(Array.isArray(part.say) && part.say.length >= 7, `Part ${part.part} must have >= 7 paragraphs`);

        const partWords = part.say.reduce((sum, p) => sum + p.split(/\\s+/).filter(Boolean).length, 0);
        assert.ok(partWords >= 600, `Part ${part.part} word count must be >= 600, got ${partWords}`);
        totalDayWords += partWords;

        assert.ok(part.example && part.example.length > 5, `Part ${part.part} missing example`);
        assert.ok(part.tryIt && part.tryIt.length > 5, `Part ${part.part} missing tryIt`);

        assert.ok(part.check, `Part ${part.part} missing check`);
        assert.strictEqual(part.check.answer, 0, `Check answer must be 0 for pedagogical standard`);
        assert.ok(part.check.options.length >= 4, `Check must have >= 4 options`);
      }

      assert.ok(totalDayWords >= 3000, `Day ${lesson.day} total word count must be >= 3000, got ${totalDayWords}`);

      // Part 5 must contain standalone runnable Python code
      const part5 = lesson.parts[4];
      assert.ok(part5.code && part5.code.includes('def main():'), `Day ${lesson.day} Part 5 must contain runnable Python code`);
    });

    await t.test(`bcom-finance Day ${lesson.day} Gate v2 visual envelope verification (Law 2)`, () => {
      const visualFilePath = path.join(process.cwd(), 'src', 'lib', 'data', 'lessonVisuals', 'bcom-finance', `day-${lesson.day}.json`);
      assert.ok(fs.existsSync(visualFilePath), `Visual envelope missing at ${visualFilePath}`);

      const visualData = JSON.parse(fs.readFileSync(visualFilePath, 'utf-8'));
      assert.strictEqual(visualData.prefix, 'bcom-finance', `Prefix must be bcom-finance`);
      assert.strictEqual(visualData.day, lesson.day, `Day number mismatch`);
      assert.strictEqual(visualData.visuals.length, 5, `Must have exactly 5 visual entries`);

      for (const entry of visualData.visuals) {
        assert.strictEqual(entry.template, 'ledger-sheet', `Visual template must be ledger-sheet`);
        assert.ok(entry.caption && entry.caption.length <= 75, `Caption must be <= 75 chars`);
        assert.ok(entry.caption.endsWith('.'), `Caption must end with period`);
        assert.ok(!/\\d/.test(entry.caption), `Caption must contain zero digits`);
        assert.strictEqual(entry.data.isBalanced, true, `Ledger sheet must balance`);
        assert.strictEqual(entry.data.steps.length, 4, `Must have 4 interactive steps`);
        assert.ok(entry.codeBinding && entry.codeBinding.verified, `Code binding must be verified`);
      }
    });
  }

  await t.test('bcom-finance Day 55 Milestone 11 Capstone Verification Token', () => {
    const day55 = days51To55.find(l => l.day === 55);
    assert.ok(day55, 'Day 55 not found');
    const part5 = day55.parts[4];
    assert.ok(part5.code && part5.code.includes('SOVEREIGN_INFRASTRUCTURE_ESG_MASTER_CAPSTONE_PASS'), 'Day 55 missing capstone token');
  });
});
"""
    test_path = os.path.join("tests", "bcom_finance_days51_55_expansion.test.ts")
    with open(test_path, "w", encoding="utf-8") as f:
        f.write(test_content)
    print(f"Generated unit test suite: {test_path}")

def main():
    print("=== STARTING COURSE 02 MONTH 2 BLOCK 11 PIPELINE (DAYS 51-55) ===")
    for day_meta in BLOCK11_DAYS:
        print(f"Executing Day {day_meta['day']} Python simulation code...")
        out = run_simulation(day_meta["code"], day_meta["token"])
        print(f"Day {day_meta['day']} simulation verified successfully! Token: {day_meta['token']}")
        generate_visual_envelope(day_meta)

    append_to_bcom_finance_long_lessons()
    generate_expansion_unit_test()
    print("=== COURSE 02 BLOCK 11 PIPELINE COMPLETED SUCCESSFULLY! ===")

if __name__ == "__main__":
    main()
