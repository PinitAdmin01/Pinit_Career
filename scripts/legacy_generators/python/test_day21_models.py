"""
Test script to prototype and verify all 5 Python models for Day 21.
Course: B.Com Banking & Financial Services (bcom_ban)
Task: TASK-791
"""

# Model 1: Joint Liability Group (JLG) Microfinance Model
def model_joint_liability_group_microfinance(
    group_size: int,
    loan_per_member_usd: float,
    interest_rate_annual_pct: float,
    tenor_months: int,
    group_peer_guarantee_pool_pct: float,
    member_repayment_statuses: list[bool]
) -> dict:
    assert len(member_repayment_statuses) == group_size, "Status count must match group size"
    
    total_group_disbursement = group_size * loan_per_member_usd
    total_repayment_per_member = loan_per_member_usd * (1.0 + (interest_rate_annual_pct / 100.0) * (tenor_months / 12.0))
    peer_guarantee_pool = total_group_disbursement * (group_peer_guarantee_pool_pct / 100.0)
    
    defaulting_members = member_repayment_statuses.count(False)
    solvent_members = member_repayment_statuses.count(True)
    
    unpaid_principal = defaulting_members * total_repayment_per_member
    
    if unpaid_principal == 0:
        pool_balance_post = peer_guarantee_pool
        peer_levy_per_solvent_member = 0.0
        group_status = "PERFECT_REPAYMENT_GRADUATED"
    elif unpaid_principal <= peer_guarantee_pool:
        pool_balance_post = peer_guarantee_pool - unpaid_principal
        peer_levy_per_solvent_member = 0.0
        group_status = "COVERED_BY_GUARANTEE_POOL"
    else:
        deficit = unpaid_principal - peer_guarantee_pool
        pool_balance_post = 0.0
        peer_levy_per_solvent_member = deficit / solvent_members if solvent_members > 0 else 0.0
        group_status = "JOINT_LIABILITY_PEER_LEVIED"
        
    recovery_rate_pct = ((group_size * total_repayment_per_member - (deficit if 'deficit' in locals() else 0.0)) / (group_size * total_repayment_per_member)) * 100.0

    return {
        "group_size": group_size,
        "total_disbursed_usd": total_group_disbursement,
        "defaulting_members": defaulting_members,
        "initial_guarantee_pool_usd": peer_guarantee_pool,
        "remaining_guarantee_pool_usd": round(pool_balance_post, 2),
        "peer_levy_per_solvent_member_usd": round(peer_levy_per_solvent_member, 2),
        "group_recovery_rate_pct": round(recovery_rate_pct, 1),
        "group_status": group_status
    }

# Model 2: Priority Sector Lending (PSL) Compliance & RIDF Penalty Calculator
def calculate_priority_sector_lending_compliance(
    adjusted_net_bank_credit_usd: float,
    total_psl_mandate_pct: float,
    agri_mandate_pct: float,
    micro_enterprises_mandate_pct: float,
    actual_psl_achieved_usd: float,
    actual_agri_achieved_usd: float,
    actual_micro_achieved_usd: float,
    ridf_penalty_penalty_yield_bps: float
) -> dict:
    required_total_psl = adjusted_net_bank_credit_usd * (total_psl_mandate_pct / 100.0)
    required_agri = adjusted_net_bank_credit_usd * (agri_mandate_pct / 100.0)
    required_micro = adjusted_net_bank_credit_usd * (micro_enterprises_mandate_pct / 100.0)
    
    total_shortfall = max(0.0, required_total_psl - actual_psl_achieved_usd)
    agri_shortfall = max(0.0, required_agri - actual_agri_achieved_usd)
    micro_shortfall = max(0.0, required_micro - actual_micro_achieved_usd)
    
    net_regulatory_shortfall = max(total_shortfall, agri_shortfall + micro_shortfall)
    mandatory_ridf_deposit = net_regulatory_shortfall
    
    # Opportunity cost: Bank cost of funds (6.5%) vs RIDF penal yield (3.5%) -> 300 bps drag
    annual_cost_drag_usd = mandatory_ridf_deposit * (ridf_penalty_penalty_yield_bps / 10000.0)
    
    return {
        "anbc_usd": adjusted_net_bank_credit_usd,
        "total_psl_required_usd": round(required_total_psl, 2),
        "actual_psl_achieved_usd": round(actual_psl_achieved_usd, 2),
        "net_regulatory_shortfall_usd": round(net_regulatory_shortfall, 2),
        "mandatory_ridf_deposit_usd": round(mandatory_ridf_deposit, 2),
        "annual_interest_drag_usd": round(annual_cost_drag_usd, 2),
        "psl_compliant": net_regulatory_shortfall == 0.0
    }

# Model 3: Digital e-KYC & Video KYC Verification Engine
def model_digital_ekyc_and_video_kyc_verification(
    customer_id: str,
    aadhaar_masked_uid: str,
    otp_authenticated: bool,
    liveness_confidence_pct: float,
    face_match_similarity_pct: float,
    geo_tagging_within_border: bool,
    aml_sanction_hit: bool,
    min_face_match_threshold: float = 85.0,
    min_liveness_threshold: float = 90.0
) -> dict:
    rejection_reasons = []
    
    if not otp_authenticated:
        rejection_reasons.append("INVALID_OTP_AUTHENTICATION")
    if liveness_confidence_pct < min_liveness_threshold:
        rejection_reasons.append(f"LIVENESS_FAILED: {liveness_confidence_pct}% < {min_liveness_threshold}%")
    if face_match_similarity_pct < min_face_match_threshold:
        rejection_reasons.append(f"FACIAL_MISMATCH: {face_match_similarity_pct}% < {min_face_match_threshold}%")
    if not geo_tagging_within_border:
        rejection_reasons.append("GEOLOCATION_OUTSIDE_DOMESTIC_TERRITORY")
    if aml_sanction_hit:
        rejection_reasons.append("AML_OFAC_SANCTION_MATCH")
        
    onboarding_cleared = len(rejection_reasons) == 0
    acquisition_cost_usd = 0.25 if onboarding_cleared else 0.10 # $0.25 digital e-KYC vs $15 paper KYC
    
    return {
        "customer_id": customer_id,
        "aadhaar_masked": aadhaar_masked_uid,
        "liveness_score_pct": liveness_confidence_pct,
        "face_match_score_pct": face_match_similarity_pct,
        "kyc_cleared": onboarding_cleared,
        "onboarding_status": "APPROVED_DIGITAL_KYC_FULL_TIER" if onboarding_cleared else "REJECTED_MANUAL_REVIEW_REQUIRED",
        "acquisition_cost_usd": acquisition_cost_usd,
        "rejection_flags": rejection_reasons
    }

# Model 4: Cash Flow-Based Micro-Underwriting & Alternative Credit Scoring
def simulate_cash_flow_micro_underwriting(
    merchant_name: str,
    monthly_upi_turnover_usd: float,
    upi_txn_count_monthly: int,
    utility_bill_on_time_ratio: float,
    supplier_invoice_repayment_ratio: float,
    existing_monthly_debt_service_usd: float,
    requested_loan_amount_usd: float,
    loan_tenor_months: int,
    interest_rate_pct: float = 18.0
) -> dict:
    # 1. Alternative Score (0 - 1000)
    score = (
        min(300, (monthly_upi_turnover_usd / 2000.0) * 150 + (upi_txn_count_monthly / 100.0) * 150) +
        (utility_bill_on_time_ratio * 350.0) +
        (supplier_invoice_repayment_ratio * 350.0)
    )
    score = round(min(1000.0, score), 1)
    
    # 2. Monthly Loan Repayment (EMI)
    monthly_rate = (interest_rate_pct / 100.0) / 12.0
    emi = (requested_loan_amount_usd * monthly_rate * ((1 + monthly_rate)**loan_tenor_months)) / (((1 + monthly_rate)**loan_tenor_months) - 1)
    
    # 3. Debt Service to Income Ratio (DSIR)
    estimated_net_margin = 0.20 # 20% margin on retail shop turnover
    monthly_net_income = monthly_upi_turnover_usd * estimated_net_margin
    total_debt_service = existing_monthly_debt_service_usd + emi
    dsir_pct = (total_debt_service / monthly_net_income) * 100.0
    
    # Underwriting Decision (Score >= 700 and DSIR <= 50%)
    approved = score >= 700.0 and dsir_pct <= 50.0
    
    return {
        "merchant": merchant_name,
        "alternative_credit_score": score,
        "monthly_net_income_usd": round(monthly_net_income, 2),
        "calculated_emi_usd": round(emi, 2),
        "total_monthly_debt_service_usd": round(total_debt_service, 2),
        "dsir_pct": round(dsir_pct, 1),
        "underwriting_verdict": "APPROVED_MICRO_FACILITY" if approved else "DECLINED_HIGH_DEBT_OR_LOW_SCORE"
    }

# Model 5: Fair Lending & Client Protection Governance Invariants
def audit_fair_microfinance_lending_governance(
    client_annual_household_income_usd: float,
    existing_micro_lenders_count: int,
    existing_aggregate_debt_usd: float,
    proposed_loan_usd: float,
    quoted_annual_interest_rate_pct: float,
    collateral_demanded: bool,
    max_household_indebtedness_usd: float = 3_000.0,
    max_lenders_allowed: int = 3,
    interest_rate_cap_pct: float = 24.0
) -> dict:
    compliance_checklist = []
    
    # 1. Total Indebtedness Cap
    post_loan_indebtedness = existing_aggregate_debt_usd + proposed_loan_usd
    indebtedness_ok = post_loan_indebtedness <= max_household_indebtedness_usd
    compliance_checklist.append(("TOTAL_INDEBTEDNESS_WITHIN_CAP", indebtedness_ok))
    
    # 2. Maximum Co-Lenders Limit (Prevention of Over-indebtedness)
    lenders_ok = existing_micro_lenders_count < max_lenders_allowed
    compliance_checklist.append(("CO_LENDER_COUNT_PERMISSIBLE", lenders_ok))
    
    # 3. Interest Rate Usury Cap
    rate_ok = quoted_annual_interest_rate_pct <= interest_rate_cap_pct
    compliance_checklist.append(("INTEREST_RATE_BELOW_USURY_CEILING", rate_ok))
    
    # 4. Collateral-Free Microfinance Invariant
    collateral_ok = not collateral_demanded
    compliance_checklist.append(("UNSECURED_COLLATERAL_FREE_MANDATE", collateral_ok))
    
    # 5. Debt Service Obligation Ceiling (<= 50% of monthly household income)
    monthly_income = client_annual_household_income_usd / 12.0
    annual_debt_service = (post_loan_indebtedness * (1 + quoted_annual_interest_rate_pct / 100.0)) / 1.0 # 1-year loan
    monthly_outflow = annual_debt_service / 12.0
    repayment_capacity_ok = (monthly_outflow / monthly_income) <= 0.50
    compliance_checklist.append(("REPAYMENT_CAPACITY_AFFORDABLE", repayment_capacity_ok))
    
    all_compliant = all(status for _, status in compliance_checklist)
    passed_count = sum(1 for _, status in compliance_checklist if status)
    
    return {
        "client_household_income_usd": client_annual_household_income_usd,
        "post_loan_debt_usd": post_loan_indebtedness,
        "quoted_rate_pct": quoted_annual_interest_rate_pct,
        "controls_passed": passed_count,
        "total_controls": len(compliance_checklist),
        "fair_lending_certified": all_compliant,
        "governance_status": "FAIR_LENDING_CERTIFIED_APPROVED" if all_compliant else "REJECTED_OVER_INDEBTEDNESS_BREACH",
        "audit_checklist": [{"rule": r, "passed": s} for r, s in compliance_checklist]
    }

if __name__ == "__main__":
    print("=== MODEL 1 TEST ===")
    r1 = model_joint_liability_group_microfinance(
        group_size=5,
        loan_per_member_usd=500.0,
        interest_rate_annual_pct=18.0,
        tenor_months=12,
        group_peer_guarantee_pool_pct=10.0,
        member_repayment_statuses=[True, True, True, True, False] # 1 member defaults
    )
    print(f"JLG Microfinance Simulation:")
    print(f"  Group Size: {r1['group_size']} members | Total Disbursed: ${r1['total_disbursed_usd']:,.2f}")
    print(f"  Defaulting Members: {r1['defaulting_members']} | Status: [{r1['group_status']}]")
    print(f"  Guarantee Pool: Initial ${r1['initial_guarantee_pool_usd']:,.2f} -> Remaining ${r1['remaining_guarantee_pool_usd']:,.2f}")
    print(f"  Peer Levy per Solvent Member: ${r1['peer_levy_per_solvent_member_usd']:,.2f}")
    print(f"  Portfolio Recovery Rate: {r1['group_recovery_rate_pct']}%")
    print("-" * 65)

    print("=== MODEL 2 TEST ===")
    r2 = calculate_priority_sector_lending_compliance(
        adjusted_net_bank_credit_usd=10_000_000_000.0, # $10B ANBC
        total_psl_mandate_pct=40.0,                     # 40% PSL mandate ($4.0B)
        agri_mandate_pct=18.0,                          # 18% Agri mandate ($1.8B)
        micro_enterprises_mandate_pct=7.5,              # 7.5% Micro ($750M)
        actual_psl_achieved_usd=3_600_000_000.0,        # $3.6B ($400M total shortfall)
        actual_agri_achieved_usd=1_500_000_000.0,       # $1.5B ($300M agri shortfall)
        actual_micro_achieved_usd=700_000_000.0,        # $700M ($50M micro shortfall)
        ridf_penalty_penalty_yield_bps=300.0            # 300 bps cost drag
    )
    print(f"Priority Sector Lending (PSL) Compliance:")
    print(f"  ANBC Base: ${r2['anbc_usd']:,.2f}")
    print(f"  Mandatory Total PSL: ${r2['total_psl_required_usd']:,.2f} | Achieved: ${r2['actual_psl_achieved_usd']:,.2f}")
    print(f"  Regulatory Shortfall: ${r2['net_regulatory_shortfall_usd']:,.2f}")
    print(f"  Mandatory RIDF Deposit: ${r2['mandatory_ridf_deposit_usd']:,.2f} (Annual Penalty Drag: ${r2['annual_interest_drag_usd']:,.2f})")
    print(f"  PSL Compliance Status: {r2['psl_compliant']}")
    print("-" * 65)

    print("=== MODEL 3 TEST ===")
    r3 = model_digital_ekyc_and_video_kyc_verification(
        customer_id="CUST-RURAL-9042",
        aadhaar_masked_uid="XXXX-XXXX-8921",
        otp_authenticated=True,
        liveness_confidence_pct=96.4,
        face_match_similarity_pct=92.1,
        geo_tagging_within_border=True,
        aml_sanction_hit=False
    )
    print(f"Digital e-KYC Verification:")
    print(f"  Customer: {r3['customer_id']} ({r3['aadhaar_masked']})")
    print(f"  Liveness Score: {r3['liveness_score_pct']}% | Face Match: {r3['face_match_score_pct']}%")
    print(f"  Onboarding Status: [{r3['onboarding_status']}] (KYC Cleared: {r3['kyc_cleared']})")
    print(f"  Digital Verification Cost: ${r3['acquisition_cost_usd']:.2f} (vs $15.00 Paper KYC)")
    print("-" * 65)

    print("=== MODEL 4 TEST ===")
    r4 = simulate_cash_flow_micro_underwriting(
        merchant_name="Sharma Kirana & General Store",
        monthly_upi_turnover_usd=3_500.0,
        upi_txn_count_monthly=240,
        utility_bill_on_time_ratio=0.98,
        supplier_invoice_repayment_ratio=0.95,
        existing_monthly_debt_service_usd=80.0,
        requested_loan_amount_usd=1_200.0,
        loan_tenor_months=12,
        interest_rate_pct=18.0
    )
    print(f"Cash Flow Micro-Underwriting:")
    print(f"  Merchant: {r4['merchant']}")
    print(f"  Alternative Credit Score: {r4['alternative_credit_score']} / 1000")
    print(f"  Monthly Net Income: ${r4['monthly_net_income_usd']:,.2f} | Calculated EMI: ${r4['calculated_emi_usd']:,.2f}")
    print(f"  Total Debt Service: ${r4['total_monthly_debt_service_usd']:,.2f} (DSIR: {r4['dsir_pct']}%)")
    print(f"  Underwriting Verdict: [{r4['underwriting_verdict']}]")
    print("-" * 65)

    print("=== MODEL 5 TEST ===")
    r5 = audit_fair_microfinance_lending_governance(
        client_annual_household_income_usd=4_500.0,
        existing_micro_lenders_count=1,
        existing_aggregate_debt_usd=600.0,
        proposed_loan_usd=800.0,
        quoted_annual_interest_rate_pct=21.5,
        collateral_demanded=False
    )
    print(f"Fair Lending & Client Protection Governance:")
    print(f"  Household Income: ${r5['client_household_income_usd']:,.2f} | Post-Loan Debt: ${r5['post_loan_debt_usd']:,.2f}")
    print(f"  Quoted APR: {r5['quoted_rate_pct']}% | Certified: {r5['fair_lending_certified']}")
    print(f"  Controls Satisfied: {r5['controls_passed']}/{r5['total_controls']} [{r5['governance_status']}]")
    for chk in r5['audit_checklist']:
        print(f"  - {chk['rule']}: {chk['passed']}")
