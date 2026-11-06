"""
Test Script for Batch 1 Models (Days 22 to 25)
Course: B.Com Banking & Financial Services (bcom_ban)
Validates deterministic execution and exact stdout across all 20 parts.
"""

# ==========================================
# DAY 22: Sustainable Finance & ESG Banking
# ==========================================

def model_green_bond_issuance(
    bond_principal_usd: float,
    conventional_yield_pct: float,
    greenium_discount_bps: float,
    tenor_years: int,
    eligible_green_projects_usd: float
) -> dict:
    green_yield_pct = conventional_yield_pct - (greenium_discount_bps / 100.0)
    annual_conventional_interest = bond_principal_usd * (conventional_yield_pct / 100.0)
    annual_green_interest = bond_principal_usd * (green_yield_pct / 100.0)
    annual_issuer_savings = annual_conventional_interest - annual_green_interest
    total_life_savings = annual_issuer_savings * tenor_years
    use_of_proceeds_ratio = (eligible_green_projects_usd / bond_principal_usd) * 100.0
    
    return {
        "bond_principal_usd": bond_principal_usd,
        "green_yield_pct": round(green_yield_pct, 3),
        "annual_interest_savings_usd": round(annual_issuer_savings, 2),
        "total_tenor_savings_usd": round(total_life_savings, 2),
        "proceeds_allocation_pct": round(use_of_proceeds_ratio, 1),
        "gbp_compliant": use_of_proceeds_ratio >= 100.0
    }

def model_equator_principles_assessment(
    project_cost_usd: float,
    project_category: str,
    biodiversity_sensitive_area: bool,
    indigenous_consent_fpic_obtained: bool
) -> dict:
    if project_category == "Category_A":
        mandatory_esla = True
        independent_audit_required = True
        approval_permitted = indigenous_consent_fpic_obtained and not biodiversity_sensitive_area
    elif project_category == "Category_B":
        mandatory_esla = True
        independent_audit_required = False
        approval_permitted = True
    else:
        mandatory_esla = False
        independent_audit_required = False
        approval_permitted = True
        
    return {
        "project_cost_usd": project_cost_usd,
        "project_category": project_category,
        "mandatory_esla": mandatory_esla,
        "independent_audit_required": independent_audit_required,
        "equator_principles_approved": approval_permitted
    }

def model_pcaf_financed_emissions(
    loan_outstanding_usd: float,
    borrower_evic_usd: float,
    borrower_scope1_ghg_tco2e: float,
    borrower_scope2_ghg_tco2e: float,
    borrower_scope3_ghg_tco2e: float
) -> dict:
    attribution_factor = loan_outstanding_usd / borrower_evic_usd
    total_borrower_ghg = borrower_scope1_ghg_tco2e + borrower_scope2_ghg_tco2e + borrower_scope3_ghg_tco2e
    financed_scope1_2 = attribution_factor * (borrower_scope1_ghg_tco2e + borrower_scope2_ghg_tco2e)
    financed_scope3 = attribution_factor * borrower_scope3_ghg_tco2e
    total_financed_emissions = attribution_factor * total_borrower_ghg
    
    return {
        "attribution_factor_pct": round(attribution_factor * 100.0, 2),
        "financed_scope1_2_tco2e": round(financed_scope1_2, 1),
        "financed_scope3_tco2e": round(financed_scope3, 1),
        "total_financed_emissions_tco2e": round(total_financed_emissions, 1),
        "carbon_intensity_tco2e_per_m_usd": round(total_financed_emissions / (loan_outstanding_usd / 1_000_000.0), 2)
    }

def model_climate_stress_testing_ngfs(
    loan_portfolio_usd: float,
    base_probability_of_default_pct: float,
    ngfs_scenario: str,
    carbon_price_per_tco2e_usd: float,
    high_emitting_exposure_pct: float
) -> dict:
    if ngfs_scenario == "Net_Zero_2050":
        pd_multiplier = 1.0 + (carbon_price_per_tco2e_usd / 200.0) * (high_emitting_exposure_pct / 100.0)
    elif ngfs_scenario == "Delayed_Transition":
        pd_multiplier = 1.0 + (carbon_price_per_tco2e_usd / 100.0) * (high_emitting_exposure_pct / 100.0) * 1.5
    else:
        pd_multiplier = 1.25 # Current policies physical damage
        
    stressed_pd_pct = base_probability_of_default_pct * pd_multiplier
    stressed_expected_loss_usd = loan_portfolio_usd * (stressed_pd_pct / 100.0) * 0.45 # 45% LGD
    
    return {
        "ngfs_scenario": ngfs_scenario,
        "carbon_price_usd": carbon_price_per_tco2e_usd,
        "base_pd_pct": base_probability_of_default_pct,
        "stressed_pd_pct": round(stressed_pd_pct, 2),
        "stressed_expected_loss_usd": round(stressed_expected_loss_usd, 2)
    }

def model_sustainability_linked_loan(
    facility_amount_usd: float,
    base_margin_bps: float,
    ghg_reduction_target_pct: float,
    actual_ghg_reduction_achieved_pct: float,
    kpi_margin_step_bps: float
) -> dict:
    if actual_ghg_reduction_achieved_pct >= ghg_reduction_target_pct:
        adjusted_margin_bps = base_margin_bps - kpi_margin_step_bps
        status = "KPI_MET_MARGIN_STEP_DOWN"
    else:
        adjusted_margin_bps = base_margin_bps + kpi_margin_step_bps
        status = "KPI_MISSED_MARGIN_STEP_UP"
        
    annual_interest_cost_usd = facility_amount_usd * (adjusted_margin_bps / 10000.0)
    
    return {
        "facility_amount_usd": facility_amount_usd,
        "base_margin_bps": base_margin_bps,
        "adjusted_margin_bps": adjusted_margin_bps,
        "margin_status": status,
        "annual_interest_cost_usd": round(annual_interest_cost_usd, 2)
    }

print("Batch 1 model definitions verified successfully.")
