"""
Build Day 14 JSON for Course: bcom_aud (Auditing & Forensic Accounting)
Topic: Substantive Testing of PPE, Capital Work-in-Progress (CWIP) & Impairment: Ind AS 16 & Ind AS 36
"""
import json

day_data = {
    "day": 14,
    "title": "Substantive Testing of PPE, Capital Work-in-Progress (CWIP) & Asset Impairment: Ind AS 16 & Ind AS 36",
    "parts": [
        {
            "title": "Ind AS 16 Property, Plant and Equipment Substantive Testing: Capital vs Revenue Expenditure",
            "say": [
                "Under Indian Accounting Standard (Ind AS) 16 (Property, Plant and Equipment), the cost of an item of PPE shall be recognized as an asset if, and only if: (a) it is probable that future economic benefits associated with the item will flow to the entity; and (b) the cost of the item can be measured reliably. Cost comprises purchase price, import duties, non-refundable purchase taxes, and any directly attributable costs of bringing the asset to the location and condition necessary for it to be capable of operating in the manner intended by management.",
                "In statutory auditing, the core battleground in PPE substantive testing is distinguishing between Capital Expenditure (CapEx) and Revenue Expenditure (OpEx). Corrupt management facing earnings pressure has an immense incentive to improperly capitalize routine operating expenses (such as machine repairs, building maintenance, executive software subscriptions, or administrative overheads) into PPE asset accounts or Capital Work-in-Progress (CWIP).",
                "Improper capitalization bypasses the P&L entirely in the current year, artificially inflating operating profit and EBITDA, while spreading the cost over 10 to 30 years through future depreciation charges. This identical accounting fraud mechanism was used at WorldCom to improperly capitalize $3.8 billion in routine line maintenance telecommunications lease payments.",
                "Under Ind AS 16 and SA 500, the statutory auditor must substantively vouch all capital additions above performance materiality: inspecting supplier contracts, engineering work completion certificates, bill of entry customs slips, and detailed expense breakdowns. Routine maintenance that merely maintains the existing standard of performance of an asset must be expensed immediately to the P&L as repair and maintenance."
            ],
            "example": "During a substantive audit of a logistics corporation, the team samples an addition of Rs 14 Crore debited to 'Heavy Commercial Transport Vehicles'. Vouching reveals that Rs 8.5 Crore represents routine fleet engine oil changes, brake pad replacements, and minor servicing across 800 trucks over 12 months. Because these costs merely maintain existing operating efficiency and provide no new future economic benefits, the auditor disqualifies the capitalization under Ind AS 16, compelling an immediate Rs 8.5 Crore charge to operating repair expenses.",
            "code": '''def audit_indas16_capex_vs_opex(capex_additions_sample: list) -> dict:
    disallowed_items = []
    total_sampled_additions_cr = 0.0
    properly_capitalized_cr = 0.0
    improperly_capitalized_opex_cr = 0.0
    
    for item in capex_additions_sample:
        val = item["amount_cr"]
        total_sampled_additions_cr += val
        
        # Capitalization Criteria under Ind AS 16:
        # 1. Extends useful life or enhances capacity/efficiency beyond original standard
        # 2. Directly attributable to creating new asset
        # 3. Not routine repair/maintenance/consumable
        is_routine_maintenance = item["is_routine_repair_or_servicing"]
        enhances_future_economic_benefits = item["enhances_capacity_or_extends_life"]
        is_administrative_overhead = item["is_general_admin_overhead"]
        
        can_capitalize = enhances_future_economic_benefits and not is_routine_maintenance and not is_administrative_overhead
        
        if can_capitalize:
            properly_capitalized_cr += val
        else:
            improperly_capitalized_opex_cr += val
            disallowed_items.append({
                "asset_id": item["id"],
                "description": item["description"],
                "amount_cr": val,
                "violation": "ROUTINE_OPEX_REPAIR_CAPITALIZATION" if is_routine_maintenance else "UNALLOWABLE_ADMIN_OVERHEAD"
            })
            
    requires_adjustment = improperly_capitalized_opex_cr > 0.20 # > 20 Lakhs
    
    return {
        "total_capex_sampled_cr": round(total_sampled_additions_cr, 2),
        "properly_capitalized_cr": round(properly_capitalized_cr, 2),
        "improperly_capitalized_opex_cr": round(improperly_capitalized_opex_cr, 2),
        "disallowed_vouchers_count": len(disallowed_items),
        "audit_finding": "RECLASSIFY_TO_OPEX_REPAIRS_EXPENSE" if requires_adjustment else "CAPITAL_ADDITIONS_PROPER",
        "improper_additions": disallowed_items
    }

capex_vouchers = [
    {"id": "CAP-01", "description": "New robotic assembly line installation", "amount_cr": 22.0, "is_routine_repair_or_servicing": False, "enhances_capacity_or_extends_life": True, "is_general_admin_overhead": False},
    {"id": "CAP-02", "description": "Fleet engine oil & brake overhaul servicing", "amount_cr": 8.5, "is_routine_repair_or_servicing": True, "enhances_capacity_or_extends_life": False, "is_general_admin_overhead": False},
    {"id": "CAP-03", "description": "Corporate headquarters executive travel allocated to plant", "amount_cr": 1.2, "is_routine_repair_or_servicing": False, "enhances_capacity_or_extends_life": False, "is_general_admin_overhead": True}
]

capex_audit = audit_indas16_capex_vs_opex(capex_vouchers)
print("Ind AS 16 CapEx vs OpEx Substantive Audit Engine:")
print(f"  Total Sampled Additions: INR {capex_audit['total_capex_sampled_cr']} Crores")
print(f"  Valid Capital Assets   : INR {capex_audit['properly_capitalized_cr']} Crores")
print(f"  Improperly Capitalized : INR {capex_audit['improperly_capitalized_opex_cr']} Crores")
print(f"  Audit Ruling           : {capex_audit['audit_finding']}")
print("  Disallowed Vouchers (Reclassification to P&L Required):")
for d in capex_audit['improper_additions']:
    print(f"    * {d['asset_id']} ({d['description']}): INR {d['amount_cr']} Cr -> {d['violation']}")
''',
            "tryIt": "Modify CAP-02 to have is_routine_repair_or_servicing=False and enhances_capacity_or_extends_life=True to see capitalization authorized.",
            "check": {
                "question": "Under Ind AS 16, what is the mandatory statutory accounting treatment for day-to-day servicing, maintenance, and routine repairs of Property, Plant and Equipment?",
                "options": [
                    "They must be recognized in profit or loss as incurred as repairs and maintenance expense",
                    "They must be capitalized into the carrying value of the asset and depreciated over 30 years",
                    "They can be capitalized into intangible goodwill",
                    "They are deducted directly from corporate paid-up equity share capital"
                ],
                "answerIndex": 0,
                "why": "Ind AS 16 Paragraph 12 explicitly establishes that an entity does not recognize in the carrying amount of an item of PPE the costs of day-to-day servicing (repairs and maintenance); these costs are recognized in profit or loss as incurred."
            }
        },
        {
            "title": "Capital Work-in-Progress (CWIP) Aging Analytics & Project Suspension Forensics: CARO Clause i(a)",
            "say": [
                "Capital Work-in-Progress (CWIP) represents expenditure incurred on assets that are in the process of construction or acquisition and are not yet ready for their intended use. CWIP is not depreciated until the asset is commissioned. Because CWIP bypasses both the P&L (zero depreciation) and physical verification schedules applicable to active machinery, corrupt enterprises frequently use CWIP as an accounting 'parking lot' to conceal stalled, abandoned, or fraudulent capital projects.",
                "To counter this widespread abuse, Schedule III of the Companies Act, 2013 and CARO 2020 Clause (i) mandate extensive disclosures regarding CWIP aging: (1) CWIP Aging Schedule separating projects into: less than 1 year, 1–2 years, 2–3 years, and more than 3 years; and (2) CWIP Completion Schedule for projects whose completion is overdue or where costs have exceeded original budgeted plans, detailing project-wise cost overruns.",
                "In forensic auditing, projects stalled for extended periods (e.g., > 2 years with zero incremental expenditure) must be evaluated for immediate abandonment write-offs. When construction on an asset is permanently suspended due to environmental regulatory bans, litigation, or contractor bankruptcy, management cannot continue carrying the accumulated costs as an asset under Ind AS 16.",
                "The entire stalled CWIP balance must be evaluated for 100% impairment under Ind AS 36 and written off to the P&L. Statutory auditors must physically inspect construction sites, review contractor billing activity, and verify municipal environmental clearances."
            ],
            "example": "A chemical corporation carries Rs 65 Crore in CWIP for a new pesticide manufacturing facility in Gujarat. Audit inspection of the CWIP aging schedule reveals that Rs 48 Crore of this balance has been static for over three years. On-site physical inspection discovers that the National Green Tribunal (NGT) revoked environmental clearance 28 months ago, construction was permanently halted, and the partially erected steel frame is corroded. The auditor mandates an immediate Rs 48 Crore impairment write-off to P&L under Ind AS 36.",
            "code": '''def audit_cwip_aging_and_stalled_projects(
    cwip_projects_portfolio: list,
    materiality_threshold_cr: float = 5.0
) -> dict:
    impaired_projects = []
    total_cwip_balance_cr = 0.0
    active_cwip_cr = 0.0
    stalled_abandoned_cwip_cr = 0.0
    
    for proj in cwip_projects_portfolio:
        cost = proj["accumulated_cost_cr"]
        total_cwip_balance_cr += cost
        
        years_static = proj["years_without_meaningful_expenditure"]
        is_construction_halted = proj["is_construction_halted"]
        has_environmental_or_legal_ban = proj["has_regulatory_ban"]
        
        # Forensics Impairment Trigger: Static > 2 years or active regulatory ban
        is_impaired = years_static >= 2.0 or has_environmental_or_legal_ban or is_construction_halted
        
        if is_impaired:
            stalled_abandoned_cwip_cr += cost
            impaired_projects.append({
                "project_name": proj["name"],
                "cost_cr": cost,
                "years_static": years_static,
                "regulatory_ban": has_environmental_or_legal_ban,
                "audit_action": "MANDATORY_100_PCT_IMPAIRMENT_WRITEOFF_IND_AS_36"
            })
        else:
            active_cwip_cr += cost
            
    requires_writeoff = stalled_abandoned_cwip_cr >= materiality_threshold_cr
    
    return {
        "total_cwip_balance_cr": round(total_cwip_balance_cr, 2),
        "active_advancing_cwip_cr": round(active_cwip_cr, 2),
        "stalled_abandoned_cwip_cr": round(stalled_abandoned_cwip_cr, 2),
        "impaired_projects_count": len(impaired_projects),
        "schedule_iii_disclosure_mandated": True,
        "audit_finding": "SUBSTANTIVE_IMPAIRMENT_ADJUSTMENT_REQUIRED" if requires_writeoff else "CWIP_CARRYING_VALUE_FAIR",
        "stalled_project_details": impaired_projects
    }

projects = [
    {"name": "Expansion Plant Unit 4", "accumulated_cost_cr": 85.0, "years_without_meaningful_expenditure": 0.2, "is_construction_halted": False, "has_regulatory_ban": False},
    {"name": "Pesticide Facility Phase 2", "accumulated_cost_cr": 48.0, "years_without_meaningful_expenditure": 2.4, "is_construction_halted": True, "has_regulatory_ban": True},
    {"name": "Warehouse Automation Hub", "accumulated_cost_cr": 12.0, "years_without_meaningful_expenditure": 0.5, "is_construction_halted": False, "has_regulatory_ban": False}
]

cwip_audit = audit_cwip_aging_and_stalled_projects(projects)
print("Schedule III CWIP Aging & Project Suspension Forensics Engine:")
print(f"  Total Consolidated CWIP : INR {cwip_audit['total_cwip_balance_cr']} Crores")
print(f"  Active Construction     : INR {cwip_audit['active_advancing_cwip_cr']} Crores")
print(f"  Stalled / Abandoned CWIP: INR {cwip_audit['stalled_abandoned_cwip_cr']} Crores")
print(f"  Audit Finding           : {cwip_audit['audit_finding']}")
print("  Impaired Projects Identified:")
for p in cwip_audit['stalled_project_details']:
    print(f"    ! {p['project_name']} (INR {p['cost_cr']} Cr): Static for {p['years_static']} yrs | Regulatory Ban: {p['regulatory_ban']} -> {p['audit_action']}")
''',
            "tryIt": "Modify Pesticide Facility Phase 2 to have years_without_meaningful_expenditure=0.2 and has_regulatory_ban=False to see CWIP carrying value clear as fully active.",
            "check": {
                "question": "Under Schedule III of the Companies Act, 2013 and Ind AS 36, what is the required accounting and auditing treatment for CWIP projects where construction has been permanently halted due to regulatory bans?",
                "options": [
                    "The company must evaluate the project for impairment under Ind AS 36 and recognize an immediate write-off/impairment loss in the P&L, while disclosing aging in Schedule III",
                    "The company can continue carrying the full project cost in CWIP indefinitely without depreciation",
                    "The expenditure must be transferred to the local municipal corporation as a public park asset",
                    "The project cost is automatically converted into equity shares issued to the government"
                ],
                "answerIndex": 0,
                "why": "Ind AS 36 requires that when an asset suffers permanent cessation or regulatory revocation with zero future economic benefits, its recoverable amount is zero, requiring an immediate 100% impairment loss in profit or loss."
            }
        },
        {
            "title": "Substantive Testing of Borrowing Cost Capitalization: Ind AS 23",
            "say": [
                "Under Indian Accounting Standard (Ind AS) 23 (Borrowing Costs), borrowing costs that are directly attributable to the acquisition, construction, or production of a Qualifying Asset form part of the cost of that asset. Other borrowing costs are recognized as an expense in the period in which they are incurred. A Qualifying Asset is an asset that necessarily takes a substantial period of time to get ready for its intended use or sale (ordinarily established as a construction period of 12 months or longer).",
                "In statutory auditing, verifying borrowing cost capitalization is a critical procedure. Management under earnings pressure has an immense incentive to improperly capitalize general borrowing interest costs into PPE or CWIP rather than expensing interest to the P&L under Finance Costs, artificially boosting operating profit and interest coverage ratios.",
                "Ind AS 23 establishes strict conditions for capitalization: (1) Capitalization begins only when: expenditures for the asset are being incurred; borrowing costs are being incurred; and activities that are necessary to prepare the asset for its intended use are in progress; (2) Suspension of Capitalization—capitalization of borrowing costs shall be suspended during extended periods in which active development of a qualifying asset is interrupted; and (3) Cessation of Capitalization—an entity shall cease capitalizing borrowing costs when substantially all the activities necessary to prepare the qualifying asset for its intended use are complete.",
                "If construction on a building is finished and awaiting commercial launch, or if work is halted due to a labor strike, capitalizing interest during that idle period violates Ind AS 23. Auditors must verify loan drawdowns, interest calculations, construction milestones, and work suspension logs."
            ],
            "example": "A hotel resort developer borrows Rs 100 Crore at 10% interest (Rs 10 Crore annual interest) to construct a luxury resort. Construction was completed on September 30, and the resort was ready for guests. However, management delayed the grand opening until the following February and continued capitalizing Rs 4.16 Crore of interest incurred between October 1 and February 28 into the building asset account. The auditor disallows the post-completion interest under Ind AS 23, forcing an immediate reclassification to P&L finance expenses.",
            "code": '''def audit_indas23_borrowing_cost_capitalization(
    qualifying_asset_expenditure_cr: float,
    construction_period_months: int,
    is_qualifying_asset: bool,
    capitalized_interest_booked_cr: float,
    months_of_active_construction: int,
    months_construction_suspended: int,
    months_post_completion_capitalized: int,
    weighted_borrowing_rate_pct: float
) -> dict:
    # Rule 1: Qualifying Asset test (normally >= 12 months)
    qualifies = is_qualifying_asset and construction_period_months >= 12
    
    monthly_interest_cr = (qualifying_asset_expenditure_cr * (weighted_borrowing_rate_pct / 100.0)) / 12.0
    
    # Allowable capitalization: strictly during active construction
    allowable_capitalization_cr = monthly_interest_cr * months_of_active_construction
    
    # Disallowable capitalization: during suspension and post-completion
    disallowable_suspended_interest_cr = monthly_interest_cr * months_construction_suspended
    disallowable_post_completion_interest_cr = monthly_interest_cr * months_post_completion_capitalized
    total_disallowed_capitalization_cr = disallowable_suspended_interest_cr + disallowable_post_completion_interest_cr
    
    excess_capitalized_cr = max(0.0, capitalized_interest_booked_cr - allowable_capitalization_cr)
    requires_adjustment = excess_capitalized_cr > 0.10 # > 10 Lakhs
    
    return {
        "is_qualifying_asset_valid": qualifies,
        "allowable_capitalized_interest_cr": round(allowable_capitalization_cr, 2),
        "disallowed_suspended_interest_cr": round(disallowable_suspended_interest_cr, 2),
        "disallowed_post_completion_interest_cr": round(disallowable_post_completion_interest_cr, 2),
        "total_disallowed_interest_cr": round(total_disallowed_capitalization_cr, 2),
        "current_booked_capitalized_interest_cr": capitalized_interest_booked_cr,
        "mandatory_pnl_reclassification_cr": round(excess_capitalized_cr, 2),
        "audit_finding": "RECLASSIFY_EXCESS_INTEREST_TO_FINANCE_COSTS_PNL" if requires_adjustment else "BORROWING_COST_CAPITALIZATION_COMPLIANT"
    }

indas23_test = audit_indas23_borrowing_cost_capitalization(
    qualifying_asset_expenditure_cr=100.0,
    construction_period_months=24,
    is_qualifying_asset=True,
    capitalized_interest_booked_cr=10.0,
    months_of_active_construction=7,
    months_construction_suspended=2, # Suspension period
    months_post_completion_capitalized=3, # Post-completion period
    weighted_borrowing_rate_pct=10.0
)
print("Ind AS 23 Borrowing Cost Capitalization Substantive Audit Engine:")
print(f"  Qualifying Asset Valid : {indas23_test['is_qualifying_asset_valid']}")
print(f"  Allowable Cap Interest : INR {indas23_test['allowable_capitalized_interest_cr']} Crores")
print(f"  Suspension Period Disallowance: INR {indas23_test['disallowed_suspended_interest_cr']} Crores")
print(f"  Post-Completion Disallowance  : INR {indas23_test['disallowed_post_completion_interest_cr']} Crores")
print(f"  Total Disallowed Interest     : INR {indas23_test['total_disallowed_interest_cr']} Crores")
print(f"  Mandatory P&L Expense Charge  : INR {indas23_test['mandatory_pnl_reclassification_cr']} Crores")
print(f"  Audit Determination           : {indas23_test['audit_finding']}")
''',
            "tryIt": "Set months_construction_suspended=0 and months_post_completion_capitalized=0 (and active months to 12) to see borrowing cost capitalization fully cleared.",
            "check": {
                "question": "Under Ind AS 23, what must an entity do regarding borrowing cost capitalization during extended periods in which active development of a qualifying asset is interrupted?",
                "options": [
                    "Capitalization of borrowing costs shall be suspended during extended periods of interruption and charged directly to profit or loss as finance expense",
                    "Capitalization must be doubled to compensate for construction delays",
                    "The interest is deferred into future corporate dividends",
                    "Borrowing costs are paid directly by the lender bank without accounting entries"
                ],
                "answerIndex": 0,
                "why": "Ind AS 23 Paragraph 20 explicitly establishes that an entity shall suspend capitalization of borrowing costs during extended periods in which it suspends active development of a qualifying asset."
            }
        },
        {
            "title": "Asset Impairment Testing & Cash-Generating Unit (CGU) Valuation: Ind AS 36",
            "say": [
                "Under Indian Accounting Standard (Ind AS) 36 (Impairment of Assets), an entity shall assess at the end of each reporting period whether there is any indication that an asset may be impaired. If any such indication exists, the entity shall estimate the Recoverable Amount of the asset. Irrespective of whether there is any indication of impairment, an entity shall test an intangible asset with an indefinite useful life or goodwill acquired in a business combination for impairment annually.",
                "An asset is impaired when its Carrying Amount exceeds its Recoverable Amount. Recoverable Amount is the Higher of: (a) Fair Value Less Costs of Disposal (FVLCD); and (b) Value in Use (VIU). Fair Value Less Costs of Disposal reflects the price that would be received to sell an asset in an orderly transaction between market participants at the measurement date, less incremental direct disposal costs. Value in Use is the present value of the future cash flows expected to be derived from an asset or Cash-Generating Unit (CGU).",
                "A Cash-Generating Unit (CGU) is the smallest identifiable group of assets that generates cash inflows that are largely independent of the cash inflows from other assets or groups of assets. In auditing Value in Use (VIU) DCF models under SA 540, the statutory auditor must rigorously challenge and audit management's valuation assumptions: (1) Cash flow forecasts (limited to 5 years under Ind AS 36 unless justified); (2) Long-term terminal growth rates (cannot exceed the long-term average growth rate for the products/industry); and (3) Pre-tax discount rates (WACC adjusted for specific asset risks).",
                "If the Recoverable Amount of a CGU is less than its carrying amount, an Impairment Loss is recognized immediately. Ind AS 36 mandates a strict statutory allocation order: First, reduce the carrying amount of any Goodwill allocated to the CGU to zero; and Second, allocate remaining impairment to other non-current assets of the unit pro-rata on the basis of the carrying amount of each asset."
            ],
            "example": "A telecom CGU carries assets of Rs 250 Crore (including Rs 40 Crore of goodwill and Rs 210 Crore of network towers). Due to 5G technology shifts, management tests for impairment: FVLCD is Rs 180 Crore, and DCF Value in Use is Rs 195 Crore. Recoverable Amount is therefore Rs 195 Crore (the higher amount). The CGU carrying value (Rs 250 Crore) exceeds Recoverable Amount (Rs 195 Crore) by Rs 55 Crore. Under Ind AS 36, the auditor mandates: (1) 100% write-off of Goodwill (Rs 40 Crore to zero); and (2) remaining Rs 15 Crore allocated pro-rata to network towers.",
            "code": '''def audit_indas36_cgu_impairment(
    cgu_name: str,
    carrying_amount_ppe_cr: float,
    carrying_amount_goodwill_cr: float,
    carrying_amount_other_assets_cr: float,
    fair_value_less_costs_of_disposal_cr: float,
    value_in_use_dcf_cr: float
) -> dict:
    total_carrying_amount_cr = carrying_amount_ppe_cr + carrying_amount_goodwill_cr + carrying_amount_other_assets_cr
    
    # 1. Recoverable Amount = Higher of FVLCD and VIU
    recoverable_amount_cr = max(fair_value_less_costs_of_disposal_cr, value_in_use_dcf_cr)
    
    # 2. Impairment Loss = Carrying Amount - Recoverable Amount
    impairment_loss_cr = max(0.0, total_carrying_amount_cr - recoverable_amount_cr)
    is_impaired = impairment_loss_cr > 0.0
    
    # 3. Ind AS 36 Allocation Waterfall: First to Goodwill, then pro-rata to other assets
    goodwill_writeoff_cr = min(carrying_amount_goodwill_cr, impairment_loss_cr)
    remaining_loss_cr = impairment_loss_cr - goodwill_writeoff_cr
    
    base_other_assets_cr = carrying_amount_ppe_cr + carrying_amount_other_assets_cr
    if base_other_assets_cr > 0 and remaining_loss_cr > 0:
        ppe_impairment_cr = remaining_loss_cr * (carrying_amount_ppe_cr / base_other_assets_cr)
        other_impairment_cr = remaining_loss_cr * (carrying_amount_other_assets_cr / base_other_assets_cr)
    else:
        ppe_impairment_cr = 0.0
        other_impairment_cr = 0.0
        
    return {
        "cgu_name": cgu_name,
        "total_carrying_amount_cr": round(total_carrying_amount_cr, 2),
        "recoverable_amount_cr": round(recoverable_amount_cr, 2),
        "total_impairment_loss_cr": round(impairment_loss_cr, 2),
        "cgu_is_impaired": is_impaired,
        "goodwill_writeoff_cr": round(goodwill_writeoff_cr, 2),
        "ppe_writeoff_cr": round(ppe_impairment_cr, 2),
        "other_assets_writeoff_cr": round(other_impairment_cr, 2),
        "final_post_impairment_cgu_carrying_value_cr": round(recoverable_amount_cr if is_impaired else total_carrying_amount_cr, 2),
        "audit_finding": "RECORD_IMPAIRMENT_LOSS_IN_PNL" if is_impaired else "NO_IMPAIRMENT_REQUIRED"
    }

cgu_audit = audit_indas36_cgu_impairment(
    cgu_name="Telecom Wireless Network CGU",
    carrying_amount_ppe_cr=180.0,
    carrying_amount_goodwill_cr=40.0,
    carrying_amount_other_assets_cr=30.0, # Total carrying = 250 Cr
    fair_value_less_costs_of_disposal_cr=180.0,
    value_in_use_dcf_cr=195.0 # Recoverable = 195 Cr (Higher)
)
print("Ind AS 36 Asset Impairment & CGU Valuation Waterfall Engine:")
print(f"  CGU Unit Under Audit   : {cgu_audit['cgu_name']}")
print(f"  Total Carrying Value   : INR {cgu_audit['total_carrying_amount_cr']} Crores")
print(f"  Recoverable Amount     : INR {cgu_audit['recoverable_amount_cr']} Crores (Higher of FVLCD & VIU)")
print(f"  Total Impairment Loss  : INR {cgu_audit['total_impairment_loss_cr']} Crores")
print("  Impairment Allocation Waterfall (Ind AS 36):")
print(f"    1. Goodwill Write-off: INR {cgu_audit['goodwill_writeoff_cr']} Crores (Extinguished to Zero)")
print(f"    2. PPE Asset Write-off: INR {cgu_audit['ppe_writeoff_cr']} Crores")
print(f"    3. Other Asset Write-off: INR {cgu_audit['other_assets_writeoff_cr']} Crores")
print(f"  Post-Impairment Assets : INR {cgu_audit['final_post_impairment_cgu_carrying_value_cr']} Crores")
print(f"  Audit Ruling           : {cgu_audit['audit_finding']}")
''',
            "tryIt": "Increase value_in_use_dcf_cr to 265.0 Cr to verify that when Recoverable Amount exceeds carrying value, impairment is zero.",
            "check": {
                "question": "Under Ind AS 36, how is an impairment loss on a Cash-Generating Unit (CGU) allocated across the assets of that unit?",
                "options": [
                    "First, to reduce the carrying amount of any goodwill allocated to the CGU to zero, and then to the other non-current assets of the unit pro-rata on the basis of the carrying amount of each asset",
                    "Equally across all current and non-current assets without distinction",
                    "To corporate equity share capital first",
                    "To cash and bank accounts first"
                ],
                "answerIndex": 0,
                "why": "Ind AS 36 Paragraph 104 legally mandates that impairment losses for a CGU must be allocated first to extinguish any goodwill allocated to the unit, and subsequently pro-rata across other non-current assets."
            }
        },
        {
            "title": "Substantive Physical Verification of Fixed Assets & Asset Register Forensics: CARO Clause i",
            "say": [
                "Under CARO 2020 Clause (i), statutory auditors must evaluate and report on the physical existence, quantitative completeness, situation, title deeds, and revaluation of Property, Plant and Equipment and Intangible Assets. Ghost Assets—assets that remain recorded on the fixed asset register and balance sheet but no longer physically exist due to unrecorded theft, scrapping, or abandonment—distort corporate capital asset values.",
                "In executing substantive testing of fixed assets under SA 501 and CARO 2020, the auditor tests in two directions: (1) Floor-to-Register (Test of Completeness)—selecting physical machines, transport vehicles, and server racks on the factory floor and tracing their serial numbers/asset barcode tags to the Fixed Asset Register (FAR); and (2) Register-to-Floor (Test of Existence)—selecting high-value capital assets from the FAR and physically inspecting their existence and operating condition on site.",
                "The auditor must evaluate management's physical verification policy: whether all fixed assets are physically verified by management at reasonable intervals (ordinarily verified over a rolling three-year cycle); whether the coverage and procedure are appropriate; and whether any material discrepancies noticed during verification were properly dealt with in the books of account.",
                "Furthermore, under CARO 2020 Clause (i)(c), the auditor must verify the Title Deeds of all immovable properties (other than leased properties) disclosed in the financial statements. The auditor inspects original registered sale deeds, conveyance deeds, encumbrance certificates, and mutation extracts held in company vaults. If properties are mortgaged to lender banks, the auditor obtains direct confirmation of title deeds held as security."
            ],
            "example": "During a physical verification audit at a petrochemical refinery, the auditor samples 20 high-value heat exchangers totaling Rs 35 Crore from the asset register. On-site inspection reveals that three heat exchangers (book value Rs 8.5 Crore) were dismantled and discarded during an overhaul 18 months ago, but remain recorded in active assets. Under CARO 2020 Clause (i)(b), the auditor discloses an unadjusted material physical discrepancy of Rs 8.5 Crore and compels management to write off the ghost assets.",
            "code": '''def audit_fixed_asset_physical_verification_and_title(
    sampled_assets_far: list,
    materiality_threshold_cr: float = 1.0
) -> dict:
    discrepancy_assets = []
    total_sampled_book_value_cr = 0.0
    verified_existing_value_cr = 0.0
    ghost_asset_missing_value_cr = 0.0
    
    for asset in sampled_assets_far:
        val = asset["net_book_value_cr"]
        total_sampled_book_value_cr += val
        
        physically_located = asset["physically_located_and_tagged"]
        is_operational = asset["is_operational_condition"]
        title_deeds_in_company_name = asset["title_deeds_verified_in_company_name"]
        
        if physically_located and title_deeds_in_company_name:
            verified_existing_value_cr += val
        else:
            ghost_asset_missing_value_cr += val
            discrepancy_assets.append({
                "asset_tag": asset["tag_id"],
                "description": asset["description"],
                "book_value_cr": val,
                "physically_found": physically_located,
                "title_verified": title_deeds_in_company_name,
                "audit_action": "WRITE_OFF_GHOST_ASSET_FROM_FAR" if not physically_located else "CARO_CLAUSE_I_C_TITLE_DEED_DISCLOSURE"
            })
            
    is_discrepancy_material = ghost_asset_missing_value_cr >= materiality_threshold_cr
    
    return {
        "assets_sampled_count": len(sampled_assets_far),
        "total_sampled_book_value_cr": round(total_sampled_book_value_cr, 2),
        "verified_existing_assets_cr": round(verified_existing_value_cr, 2),
        "ghost_asset_discrepancy_cr": round(ghost_asset_missing_value_cr, 2),
        "is_material_discrepancy": is_discrepancy_material,
        "caro_clause_i_status": "ADVERSE_DISCREPANCY_DISCLOSURE_MANDATED" if is_discrepancy_material else "UNMODIFIED_CLEAN",
        "flagged_discrepancies": discrepancy_assets
    }

assets = [
    {"tag_id": "AST-101", "description": "Continuous Casting Machine #1", "net_book_value_cr": 45.0, "physically_located_and_tagged": True, "is_operational_condition": True, "title_deeds_verified_in_company_name": True},
    {"tag_id": "AST-102", "description": "Heat Exchanger Bank B", "net_book_value_cr": 8.5, "physically_located_and_tagged": False, "is_operational_condition": False, "title_deeds_verified_in_company_name": True},
    {"tag_id": "AST-103", "description": "Freehold Industrial Land Parcel 4", "net_book_value_cr": 14.0, "physically_located_and_tagged": True, "is_operational_condition": True, "title_deeds_verified_in_company_name": False}
]

fa_audit = audit_fixed_asset_physical_verification_and_title(assets)
print("CARO 2020 Clause (i) Fixed Asset Physical Verification & Title Forensics:")
print(f"  Assets Audited         : {fa_audit['assets_sampled_count']}")
print(f"  Sample Book Value      : INR {fa_audit['total_sampled_book_value_cr']} Crores")
print(f"  Verified Existing Stock: INR {fa_audit['verified_existing_assets_cr']} Crores")
print(f"  Discrepancy / Ghost Assets: INR {fa_audit['ghost_asset_discrepancy_cr']} Crores")
print(f"  CARO Clause (i) Status : {fa_audit['caro_clause_i_status']}")
print("  Identified Physical Discrepancies & Title Defects:")
for d in fa_audit['flagged_discrepancies']:
    print(f"    ! {d['asset_tag']} ({d['description']}): INR {d['book_value_cr']} Cr -> Found: {d['physically_found']}, Title: {d['title_verified']} -> {d['audit_action']}")
''',
            "tryIt": "Set physically_located_and_tagged=True on AST-102 and title_deeds_verified_in_company_name=True on AST-103 to see the CARO Clause (i) status transition to clean.",
            "check": {
                "question": "Under CARO 2020 Clause (i)(b), what must the statutory auditor report regarding physical verification of Property, Plant and Equipment conducted by management?",
                "options": [
                    "Whether PPE has been physically verified by management at reasonable intervals, whether any material discrepancies were noticed, and whether they have been properly dealt with in the books of account",
                    "Whether all factory machines were painted within the last 6 months",
                    "Whether factory security guards hold active military clearances",
                    "Whether the company owns real estate in more than 10 countries"
                ],
                "answerIndex": 0,
                "why": "CARO 2020 Clause (i)(b) requires statutory auditors to state whether PPE has been physically verified by management at reasonable intervals, whether material discrepancies were noticed, and whether properly accounted for in the books."
            }
        }
    ]
}

if __name__ == "__main__":
    with open("scripts/bcom_aud_day14_data.json", "w", encoding="utf-8") as f:
        json.dump(day_data, f, indent=2)
    print("Generated scripts/bcom_aud_day14_data.json successfully!")
