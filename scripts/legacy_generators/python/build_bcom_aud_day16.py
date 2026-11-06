"""
Build Day 16 JSON for Course: bcom_aud (Auditing & Forensic Accounting)
Topic: Auditing Accounting Estimates & Fair Value Measurements: SA 540 & Ind AS 113
"""
import json

day_data = {
    "day": 16,
    "title": "Auditing Accounting Estimates, Fair Value Measurements & Disclosures: SA 540 & Ind AS 113",
    "parts": [
        {
            "title": "Nature of Accounting Estimates & Estimation Uncertainty: SA 540 Revised",
            "say": [
                "Standard on Auditing (SA) 540 (Revised), 'Auditing Accounting Estimates and Related Disclosures', governs the auditor's responsibilities relating to accounting estimates and related disclosures in an audit of financial statements. Accounting estimates are monetary amounts for which the measurement, in accordance with the applicable financial reporting framework (such as Ind AS or Indian GAAP), is subject to estimation uncertainty. Estimation uncertainty is the susceptibility of an accounting estimate and related disclosures to an inherent lack of precision in its measurement.",
                "Under modern accounting frameworks like Ind AS, financial statements are increasingly dominated by forward-looking, complex, and subjective estimates. Prominent examples include: Expected Credit Loss (ECL) provisions under Ind AS 109; fair value measurements of illiquid financial instruments and investment properties under Ind AS 113; impairment of goodwill and cash-generating units under Ind AS 36; share-based payment valuations under Ind AS 102; decommissioning liabilities and environmental restoration provisions under Ind AS 37; and defined benefit pension obligations under Ind AS 19.",
                "SA 540 (Revised) mandates a rigorous risk assessment framework based on three fundamental drivers: (1) Inherent Estimation Uncertainty—the degree to which the measurement relies on observable versus unobservable inputs, complex mathematical models, and long-term future assumptions; (2) Complexity—the mathematical sophistication of algorithms, valuation techniques (such as Monte Carlo simulations or discounted cash flow DCF models), and specialized data sources; and (3) Subjectivity—the extent to which judgment is required by management in selecting valuation methods, economic assumptions, and input parameters.",
                "The auditor must evaluate whether management has applied appropriate financial reporting requirements and whether the methods, assumptions, and data used are reasonable in light of the entity's circumstances and historical experience."
            ],
            "example": "A commercial real estate conglomerate holds unlisted commercial office towers valued at Rs 1,800 Crore. Management uses a discounted cash flow (DCF) model under Ind AS 113 with unobservable Level 3 inputs: an exit capitalization rate of 6.5% and a discount rate (WACC) of 9.2%. An independent sensitivity analysis shows that increasing the exit cap rate by just 50 basis points (to 7.0%) reduces the asset fair value by Rs 130 Crore, which exceeds the audit performance materiality of Rs 25 Crore. Under SA 540, this extreme estimation uncertainty mandates independent auditor point estimate modeling.",
            "code": '''def evaluate_sa540_estimation_uncertainty_spectrum(
    account_name: str,
    carrying_amount_cr: float,
    observable_inputs_ratio: float, # 0.0 (fully unobservable Level 3) to 1.0 (observable Level 1)
    model_complexity_score: int, # 1 (linear/simple) to 5 (dynamic stochastic/Monte Carlo)
    management_judgment_dependency: str, # "LOW", "MODERATE", "HIGH", "EXTREME"
    sensitivity_range_cr: float,
    performance_materiality_cr: float
) -> dict:
    # Evaluate Inherent Risk Factors under SA 540 Revised
    judgment_weights = {"LOW": 1.0, "MODERATE": 2.0, "HIGH": 3.5, "EXTREME": 5.0}
    j_score = judgment_weights.get(management_judgment_dependency.upper(), 3.0)
    
    # Uncertainty Score: Combined metric of unobservability, complexity, and subjectivity
    uncertainty_score = ((1.0 - observable_inputs_ratio) * 35.0) + (model_complexity_score * 6.5) + (j_score * 6.5)
    uncertainty_score = min(100.0, max(0.0, uncertainty_score))
    
    # Assess if Estimation Uncertainty results in a Significant Risk under SA 315
    is_extreme_uncertainty = (sensitivity_range_cr >= performance_materiality_cr) or (uncertainty_score >= 70.0)
    
    if is_extreme_uncertainty:
        audit_risk_rating = "SIGNIFICANT_RISK_REQUIRING_SPECIAL_AUDIT_CONSIDERATION"
        required_procedures = "INDEPENDENT_AUDITOR_RANGE_AND_AUDITORS_SPECIALIST_INVOLVEMENT"
    elif uncertainty_score >= 40.0:
        audit_risk_rating = "ELEVATED_RISK_OF_MATERIAL_MISSTATEMENT"
        required_procedures = "DETAILED_TESTING_OF_MANAGEMENT_DATA_AND_ASSUMPTIONS"
    else:
        audit_risk_rating = "LOW_TO_MODERATE_ESTIMATION_RISK"
        required_procedures = "STANDARD_RETROSPECTIVE_REVIEW_AND_MODEL_INSPECTION"
        
    return {
        "account_name": account_name,
        "carrying_amount_cr": carrying_amount_cr,
        "estimation_uncertainty_score_pct": round(uncertainty_score, 1),
        "sensitivity_exceeds_pm": sensitivity_range_cr >= performance_materiality_cr,
        "audit_risk_classification": audit_risk_rating,
        "mandated_substantive_response": required_procedures
    }

est_eval = evaluate_sa540_estimation_uncertainty_spectrum(
    account_name="Ind AS 113 Level 3 Commercial Towers Valuation",
    carrying_amount_cr=1800.0,
    observable_inputs_ratio=0.15,
    model_complexity_score=4,
    management_judgment_dependency="EXTREME",
    sensitivity_range_cr=130.0,
    performance_materiality_cr=25.0
)
print("SA 540 Estimation Uncertainty Risk Engine:")
print(f"  Account Balance Evaluated : {est_eval['account_name']}")
print(f"  Carrying Book Value       : INR {est_eval['carrying_amount_cr']} Crores")
print(f"  Uncertainty Spectrum Score: {est_eval['estimation_uncertainty_score_pct']}%")
print(f"  Sensitivity > Materiality : {est_eval['sensitivity_exceeds_pm']}")
print(f"  Risk Classification       : {est_eval['audit_risk_classification']}")
print(f"  Mandated Audit Response   : {est_eval['mandated_substantive_response']}")
''',
            "tryIt": "Increase observable_inputs_ratio to 0.95 and decrease model_complexity_score to 1 to observe the uncertainty spectrum score drop below 30%, shifting the classification to low risk.",
            "check": {
                "question": "Under SA 540 (Revised), which condition classifies an accounting estimate as having high estimation uncertainty representing a significant risk?",
                "options": [
                    "When the plausible sensitivity range of measurement outcomes exceeds the auditor's performance materiality, or when measurement relies heavily on unobservable Level 3 inputs with extreme management judgment",
                    "When the estimate is calculated using Microsoft Excel rather than enterprise SAP software",
                    "When the accounting estimate is approved by the external statutory tax authority",
                    "When the total book value of the asset is recorded in Indian Rupees rather than US Dollars"
                ],
                "answerIndex": 0,
                "why": "SA 540 Paragraph 11 and A84 define high estimation uncertainty as situations where the potential range of outcomes is highly sensitive to subjective assumptions and exceeds materiality, triggering mandatory significant risk classification."
            }
        },
        {
            "title": "Substantive Approaches: Testing Management Process vs Independent Point Estimates",
            "say": [
                "In responding to assessed risks of material misstatement in accounting estimates, SA 540 (Revised) provides three primary substantive approaches that the auditor may select individually or in combination: (1) Testing how management made the accounting estimate (testing management's process, data integrity, and assumptions); (2) Developing an independent auditor's point estimate or range to evaluate management's point estimate; and (3) Reviewing subsequent events and transactions occurring up to the date of the auditor's report that provide audit evidence regarding the estimate.",
                "Under Approach 1 (Testing Management's Process), the auditor rigorously evaluates: (a) whether the valuation method used is appropriate and consistent with prior periods; (b) whether the significant assumptions are reasonable, internally consistent, and supportable against macroeconomic benchmarks; and (c) the integrity, accuracy, and completeness of the underlying data (Information Produced by the Entity - IPE).",
                "Under Approach 2 (Developing an Independent Auditor Point Estimate or Range), when management's process is subjective or lacks adequate controls, the auditor builds an independent econometric or statistical valuation model. SA 540 establishes strict rules for auditor ranges: the range must be narrowed until all outcomes within the range are considered reasonable, and the width of the range cannot exceed performance materiality. If management's recorded estimate falls outside the auditor's range, the difference between management's estimate and the nearest endpoint of the auditor's range constitutes a factual audit misstatement under SA 450.",
                "Under Approach 3 (Subsequent Events), post-balance sheet evidence—such as the actual cash recovery of an overdue loan or the final court judgment of a pending lawsuit—provides definitive evidence that can supersede subjective models."
            ],
            "example": "In auditing a manufacturing client's environmental decommissioning provision of Rs 65 Crore under Ind AS 37, management uses a 15-year cash outflow schedule discounted at 7.0%. The audit team engages an independent environmental engineering specialist under SA 620, who develops an independent auditor range between Rs 78 Crore and Rs 86 Crore (range width of Rs 8 Crore, well within the performance materiality of Rs 12 Crore). Because management's recorded estimate of Rs 65 Crore is below the lower bound (Rs 78 Crore), an audit misstatement of Rs 13 Crore (78 - 65) is formally logged on the Summary of Unadjusted Audit Differences (SUAD).",
            "code": '''def evaluate_auditor_independent_range_vs_management(
    management_point_estimate_cr: float,
    auditor_lower_bound_cr: float,
    auditor_upper_bound_cr: float,
    performance_materiality_cr: float
) -> dict:
    range_width_cr = auditor_upper_bound_cr - auditor_lower_bound_cr
    range_is_valid_under_sa540 = range_width_cr <= performance_materiality_cr
    
    # Determine if management's estimate falls within auditor's reasonable range
    if management_point_estimate_cr < auditor_lower_bound_cr:
        misstatement_cr = auditor_lower_bound_cr - management_point_estimate_cr
        status = "UNDERSTATED_BELOW_REASONABLE_RANGE"
    elif management_point_estimate_cr > auditor_upper_bound_cr:
        misstatement_cr = management_point_estimate_cr - auditor_upper_bound_cr
        status = "OVERSTATED_ABOVE_REASONABLE_RANGE"
    else:
        misstatement_cr = 0.0
        status = "ACCEPTABLE_WITHIN_AUDITOR_RANGE"
        
    return {
        "management_estimate_cr": round(management_point_estimate_cr, 2),
        "auditor_range": [round(auditor_lower_bound_cr, 2), round(auditor_upper_bound_cr, 2)],
        "range_width_cr": round(range_width_cr, 2),
        "range_validity_sa540": range_is_valid_under_sa540,
        "audit_misstatement_cr": round(misstatement_cr, 2),
        "evaluation_verdict": status,
        "requires_suad_adjustment": misstatement_cr > 0
    }

range_eval = evaluate_auditor_independent_range_vs_management(
    management_point_estimate_cr=65.0,
    auditor_lower_bound_cr=78.0,
    auditor_upper_bound_cr=86.0,
    performance_materiality_cr=12.0
)
print("SA 540 Independent Auditor Range Evaluation Engine:")
print(f"  Management Estimate       : INR {range_eval['management_estimate_cr']} Cr")
print(f"  Auditor Range Bound       : INR {range_eval['auditor_range']} Cr")
print(f"  Range Width (<= PM)       : INR {range_eval['range_width_cr']} Cr (Valid: {range_eval['range_validity_sa540']})")
print(f"  Quantified Misstatement   : INR {range_eval['audit_misstatement_cr']} Cr")
print(f"  Audit Diagnostic Verdict  : {range_eval['evaluation_verdict']}")
print(f"  Post to SUAD Schedule     : {range_eval['requires_suad_adjustment']}")
''',
            "tryIt": "Adjust management_point_estimate_cr to 82.0 to see the estimate fall squarely within the auditor's range, reducing misstatement to 0.0 Cr.",
            "check": {
                "question": "If an auditor develops an independent range to evaluate management's accounting estimate under SA 540, what is the maximum permissible width of that range?",
                "options": [
                    "The width of the auditor's range must be narrowed until it is equal to or less than performance materiality",
                    "The width of the range can be up to 100% of total revenue",
                    "The width of the range must equal exactly twice the overall materiality",
                    "There is no limitation on range width as long as management signs a letter of representation"
                ],
                "answerIndex": 0,
                "why": "SA 540 Paragraph A125 mandates that when the auditor develops a range, the range must be narrowed until all outcomes are reasonable and its width is equal to or less than performance materiality."
            }
        },
        {
            "title": "Indicators of Management Bias & Retrospective Review: SA 540",
            "say": [
                "Management bias is a lack of neutrality by management in the preparation and presentation of financial information. Although individual accounting estimates may each appear individually defensible within a broad range of plausible outcomes, when considered in the aggregate, the directional clustering of estimates in management's favor reveals systemic bias. SA 540 requires the auditor to maintain professional skepticism and actively evaluate indicators of management bias.",
                "Common indicators of management bias include: (1) Aggressive selection of point estimates—consistently picking the absolute lowest estimate for liabilities (warranty provisions, litigation reserves) and the absolute highest point estimate for assets (impairment recoverability, fair value of real estate); (2) Opportunistic changes in estimation methodology or economic assumptions without commercial or objective justification; (3) Reversing previous provisions at year-end to manufacture earnings required to meet quarterly earnings-per-share (EPS) guidance or debt covenant thresholds; and (4) Selective reliance on external appraisals, discarding valuations that suggest impairments and shopping for appraisers willing to justify target asset valuations.",
                "To detect bias, SA 540 mandates the performance of a Retrospective Review. The auditor reviews the outcome of accounting estimates included in the prior period financial statements against actual cash settlements or updated estimates in the current period.",
                "The retrospective review is not conducted to question the historical judgments made in prior periods with the benefit of hindsight; rather, it is designed to evaluate the historical accuracy and reliability of management's estimation process, revealing whether management consistently overestimates earnings or underestimates costs."
            ],
            "example": "In reviewing prior-year warranty provisions for an automotive manufacturer, the retrospective review reveals that in each of the past 4 years, management estimated warranty costs at 1.5% of revenue, whereas actual warranty claims settled at 3.2%, 3.5%, 3.1%, and 3.4% of revenue. Every year, an unexpected 'catch-up' expense was deferred to future quarters. This consistent multi-year pattern proves systemic downward management bias, compelling the auditor to demand an upward revision in the current year's warranty model from 1.5% to 3.3%.",
            "code": '''def analyze_sa540_retrospective_management_bias(
    multi_year_estimates: list
) -> dict:
    deviations = []
    understatement_count = 0
    overstatement_count = 0
    
    for item in multi_year_estimates:
        year = item["year"]
        est = item["prior_year_estimate_cr"]
        act = item["actual_realized_outcome_cr"]
        diff = est - act
        pct_variance = (diff / act) * 100.0 if act > 0 else 0.0
        
        # In liability testing: est < act means management understated liability
        if diff < 0:
            understatement_count += 1
            direction = "UNDERSTATED_LIABILITY (AGGRESSIVE_EARNINGS_BOOST)"
        elif diff > 0:
            overstatement_count += 1
            direction = "CONSERVATIVE_OVERSTATEMENT"
        else:
            direction = "NEUTRAL_EXACT_MATCH"
            
        deviations.append({
            "year": year,
            "estimated_cr": est,
            "actual_outcome_cr": act,
            "variance_cr": round(diff, 2),
            "variance_pct": round(pct_variance, 1),
            "bias_direction": direction
        })
        
    total_years = len(multi_year_estimates)
    systemic_bias_ratio = understatement_count / total_years if total_years > 0 else 0.0
    
    if systemic_bias_ratio >= 0.75:
        verdict = "SYSTEMIC_MANAGEMENT_BIAS_CONFIRMED_HIGH_RISK_OF_FRAUD"
        audit_implication = "INCREASE_PROFESSIONAL_SKEPTICISM_AND_CHALLENGE_ALL_FORWARD_ASSUMPTIONS"
    elif systemic_bias_ratio >= 0.50:
        verdict = "MODERATE_DIRECTIONAL_BIAS_IDENTIFIED"
        audit_implication = "EXPAND_SUBSTANTIVE_CORROBORATION"
    else:
        verdict = "NO_SYSTEMIC_BIAS_IDENTIFIED_BALANCED_ACCURACY"
        audit_implication = "RELY_ON_CALIBRATED_MODELS"
        
    return {
        "years_evaluated": total_years,
        "understated_liability_years": understatement_count,
        "bias_ratio_pct": round(systemic_bias_ratio * 100.0, 1),
        "bias_diagnosis": verdict,
        "mandated_action": audit_implication,
        "historical_annual_deviations": deviations
    }

sample_history = [
    {"year": "FY 2022-23", "prior_year_estimate_cr": 15.0, "actual_realized_outcome_cr": 28.5},
    {"year": "FY 2023-24", "prior_year_estimate_cr": 16.5, "actual_realized_outcome_cr": 31.0},
    {"year": "FY 2024-25", "prior_year_estimate_cr": 18.0, "actual_realized_outcome_cr": 34.2},
    {"year": "FY 2025-26", "prior_year_estimate_cr": 19.5, "actual_realized_outcome_cr": 33.8}
]

bias_res = analyze_sa540_retrospective_management_bias(sample_history)
print("SA 540 Retrospective Review & Management Bias Diagnostic Engine:")
print(f"  Years Analyzed            : {bias_res['years_evaluated']}")
print(f"  Understated Liability Rate: {bias_res['bias_ratio_pct']}% ({bias_res['understated_liability_years']}/{bias_res['years_evaluated']} years)")
print(f"  Management Bias Verdict   : {bias_res['bias_diagnosis']}")
print(f"  Audit Strategy Mandate    : {bias_res['mandated_action']}")
print("  Multi-Year Deviation Audit Trail:")
for d in bias_res['historical_annual_deviations']:
    print(f"    * {d['year']}: Estimated INR {d['estimated_cr']} Cr vs Actual INR {d['actual_outcome_cr']} Cr (Variance: {d['variance_pct']}%)")
''',
            "tryIt": "Flip the estimates so that estimated values match actual outcomes within 5%, and observe the bias verdict transform to balanced accuracy.",
            "check": {
                "question": "What is the primary purpose of performing a retrospective review of prior-period accounting estimates under SA 540?",
                "options": [
                    "To evaluate whether management's estimation process exhibits indicators of management bias and assess the historical predictive reliability of management's models",
                    "To reopen and retroactively restate the audited prior-year income tax return with the tax department",
                    "To prosecute the previous statutory auditor for issuing an unqualified report",
                    "To calculate the annual bonus entitlement of the company's internal audit staff"
                ],
                "answerIndex": 0,
                "why": "SA 540 Paragraph 14 and A65 explicitly state that retrospective reviews are conducted to obtain information regarding the effectiveness of management's prior period estimation process and to identify indicators of management bias."
            }
        },
        {
            "title": "Auditing Fair Value Measurements & Hierarchy: Ind AS 113",
            "say": [
                "Ind AS 113 (Fair Value Measurement) defines fair value as the price that would be received to sell an asset or paid to transfer a liability in an orderly transaction between market participants at the measurement date (an exit price). In auditing fair value measurements, the auditor must rigorously evaluate the Fair Value Hierarchy established by Ind AS 113, which categorizes valuation inputs into three distinct levels.",
                "Level 1 inputs are quoted prices (unadjusted) in active markets for identical assets or liabilities that the entity can access at the measurement date (e.g., actively traded shares on the National Stock Exchange of India). Audit testing for Level 1 assets focuses on verifying exchange closing prices, trading volume, and market liquidity.",
                "Level 2 inputs are inputs other than quoted prices included within Level 1 that are observable for the asset or liability, either directly or indirectly (e.g., quoted prices for similar assets in active markets, interest rate yield curves, or observable credit default swap spreads). The auditor verifies benchmark yield curves and model calibration.",
                "Level 3 inputs are unobservable inputs for the asset or liability, reflecting management's own assumptions about the assumptions that market participants would use in pricing the asset or liability (e.g., private equity investments, real estate development projects, unlisted brand intangibles, and complex cross-currency swaps). Level 3 measurements carry maximum audit risk and require intensive scrutiny of discount rates, revenue growth rates, terminal growth rates, and sensitivity disclosures."
            ],
            "example": "A financial services client holds an unlisted private equity portfolio carried at Rs 450 Crore classified as Level 3 under Ind AS 113. Management uses an Enterprise Value to EBITDA multiple of 18.5x, citing high-growth tech peers. The auditor benchmarks the peer group and uncovers that the portfolio companies operate in heavy logistics with median industry multiples of only 9.2x. Recalculating the portfolio fair value using audited peer multiples produces an asset valuation of Rs 224 Crore, revealing a material fair value overstatement of Rs 226 Crore.",
            "code": '''def audit_indas113_fair_value_hierarchy(
    portfolio_assets: list
) -> dict:
    level_breakdown = {"LEVEL_1": 0.0, "LEVEL_2": 0.0, "LEVEL_3": 0.0}
    level_3_exceptions = []
    
    for asset in portfolio_assets:
        lvl = asset["level"].upper()
        val = asset["carrying_value_cr"]
        level_breakdown[lvl] = level_breakdown.get(lvl, 0.0) + val
        
        # Substantive audit of Level 3 inputs
        if lvl == "LEVEL_3":
            mgmt_multiple = asset.get("applied_multiple", 0.0)
            bench_multiple = asset.get("auditor_peer_median_multiple", 0.0)
            if bench_multiple > 0 and mgmt_multiple > (bench_multiple * 1.25):
                revalued = (val / mgmt_multiple) * bench_multiple
                overstatement = val - revalued
                level_3_exceptions.append({
                    "asset_name": asset["name"],
                    "book_val_cr": val,
                    "applied_multiple": mgmt_multiple,
                    "peer_benchmark": bench_multiple,
                    "audited_fair_val_cr": round(revalued, 2),
                    "fair_value_overstatement_cr": round(overstatement, 2)
                })
                
    total_val = sum(level_breakdown.values())
    l3_pct = (level_breakdown["LEVEL_3"] / total_val * 100.0) if total_val > 0 else 0.0
    total_l3_overstatement = sum(e["fair_value_overstatement_cr"] for e in level_3_exceptions)
    
    return {
        "total_portfolio_value_cr": round(total_val, 2),
        "level_1_liquid_cr": round(level_breakdown["LEVEL_1"], 2),
        "level_2_observable_cr": round(level_breakdown["LEVEL_2"], 2),
        "level_3_unobservable_cr": round(level_breakdown["LEVEL_3"], 2),
        "level_3_exposure_pct": round(l3_pct, 1),
        "level_3_overstatement_cr": round(total_l3_overstatement, 2),
        "level_3_audit_exceptions": level_3_exceptions,
        "audit_opinion_impact": "MATERIAL_ADVERSE_VALUATION_ADJUSTMENT_REQUIRED" if total_l3_overstatement >= 20.0 else "WITHIN_ACCEPTABLE_TOLERANCE"
    }

assets = [
    {"name": "Listed Blue-Chip Equities (NSE)", "level": "LEVEL_1", "carrying_value_cr": 850.0},
    {"name": "Government Benchmark Bonds (G-Sec)", "level": "LEVEL_2", "carrying_value_cr": 600.0},
    {"name": "Unlisted Fintech Preferred Series B", "level": "LEVEL_3", "carrying_value_cr": 250.0, "applied_multiple": 18.5, "auditor_peer_median_multiple": 9.2},
    {"name": "Specialty Logistics Warehousing SPV", "level": "LEVEL_3", "carrying_value_cr": 200.0, "applied_multiple": 14.0, "auditor_peer_median_multiple": 8.5}
]

fv_audit = audit_indas113_fair_value_hierarchy(assets)
print("Ind AS 113 Fair Value Hierarchy Substantive Audit Engine:")
print(f"  Total Portfolio Carrying Val: INR {fv_audit['total_portfolio_value_cr']} Crores")
print(f"  Level 1 (Quoted Active Mkts): INR {fv_audit['level_1_liquid_cr']} Cr")
print(f"  Level 2 (Observable Inputs) : INR {fv_audit['level_2_observable_cr']} Cr")
print(f"  Level 3 (Unobservable)      : INR {fv_audit['level_3_unobservable_cr']} Cr ({fv_audit['level_3_exposure_pct']}%)")
print(f"  Level 3 Material Overstat.  : INR {fv_audit['level_3_overstatement_cr']} Crores")
print(f"  Audit Diagnostic Verdict    : {fv_audit['audit_opinion_impact']}")
print("  Level 3 Valuation Audit Exceptions:")
for ex in fv_audit['level_3_audit_exceptions']:
    print(f"    * {ex['asset_name']}: Book INR {ex['book_val_cr']} Cr -> Audited INR {ex['audited_fair_val_cr']} Cr (Overstated by INR {ex['fair_value_overstatement_cr']} Cr)")
''',
            "tryIt": "Set applied_multiple to equal auditor_peer_median_multiple to eliminate valuation overstatement and observe the audit verdict change to within acceptable tolerance.",
            "check": {
                "question": "Under Ind AS 113, what constitutes a Level 3 input in the fair value measurement hierarchy?",
                "options": [
                    "Unobservable inputs for the asset or liability reflecting management's own assumptions about how market participants would price the asset",
                    "Unadjusted quoted prices in active markets for identical assets",
                    "Inputs other than quoted prices that are directly or indirectly observable such as interest rate yield curves",
                    "The original physical invoice purchase price from five years ago adjusted for GST"
                ],
                "answerIndex": 0,
                "why": "Ind AS 113 Paragraphs 72-90 classify unobservable inputs as Level 3, carrying the highest estimation risk and requiring comprehensive sensitivity and valuation model testing."
            }
        },
        {
            "title": "Using the Work of an Auditor's Expert: SA 620",
            "say": [
                "When auditing highly specialized, complex accounting estimates and fair value measurements—such as actuarial valuations of employee gratuity schemes, environmental contamination remediation liabilities, intellectual property valuations, or mineral reserves—the audit engagement team may lack the specialized expertise necessary to obtain sufficient appropriate audit evidence. Standard on Auditing (SA) 620, 'Using the Work of an Auditor's Expert', establishes the mandatory standards when the auditor employs an external or internal expert.",
                "An Auditor's Expert is an individual or organization possessing expertise in a field other than accounting or auditing, whose work in that field is used by the auditor to assist the auditor in obtaining sufficient appropriate audit evidence. It is crucial to distinguish an Auditor's Expert (engaged by the auditor) from a Management's Expert (engaged by management to prepare estimates, governed by SA 500).",
                "SA 620 mandates four non-negotiable requirements when using an auditor's expert: (1) Evaluating the Competence, Capabilities, and Objectivity of the expert—confirming professional certifications, independence, and absence of conflicts of interest; (2) Obtaining an Understanding of the Field of Expertise—ensuring the auditor understands the assumptions, methods, and frameworks used by the expert; (3) Executing a formal Agreement with the Auditor's Expert—defining the scope of work, objectives, confidentiality, and respective roles; and (4) Evaluating the Adequacy of the Expert's Work—reviewing the relevance and reasonableness of the expert's findings, the consistency of assumptions with audit evidence, and testing the source data used by the expert.",
                "Crucially, the auditor has sole responsibility for the audit opinion expressed. The auditor shall not refer to the work of an auditor's expert in an unmodified auditor's report unless required by law or regulation."
            ],
            "example": "In auditing a pharmaceutical conglomerate's Rs 300 Crore patent portfolio, the auditor contracts a certified patent valuation specialist under SA 620. The auditor reviews the expert's independence declaration, agrees upon the valuation scope in writing, tests the underlying patent renewal data (source IPE), and reviews the discounted cash flow model. The expert determines the patents are impaired by Rs 85 Crore due to generic drug competition. The auditor relies on this evidence to demand an Rs 85 Crore impairment entry.",
            "code": '''def evaluate_sa620_auditors_expert_work(
    expert_name: str,
    field_of_expertise: str,
    has_independence_confirmation: bool,
    professional_credential_verified: bool,
    source_data_tested_by_auditor: bool,
    expert_assumptions_corroborated: bool,
    identified_misstatement_cr: float,
    performance_materiality_cr: float
) -> dict:
    # Verify Prerequisites under SA 620
    is_competent_and_objective = has_independence_confirmation and professional_credential_verified
    is_work_adequate = source_data_tested_by_auditor and expert_assumptions_corroborated
    
    can_rely_on_expert = is_competent_and_objective and is_work_adequate
    
    if can_rely_on_expert:
        reliance_status = "FULL_RELIANCE_PERMITTED_UNDER_SA620"
        audit_action = f"PROPOSE_AUDIT_ADJUSTMENT_OF_INR_{identified_misstatement_cr}_CR"
    elif not is_competent_and_objective:
        reliance_status = "FAILED_OBJECTIVITY_OR_COMPETENCE_DISQUALIFIED"
        audit_action = "ENGAGE_ALTERNATIVE_INDEPENDENT_EXPERT"
    else:
        reliance_status = "INADEQUATE_WORK_AUDITOR_MUST_TEST_UNDERLYING_SOURCE_DATA"
        audit_action = "EXPAND_AUDIT_TESTING_OF_ASSUMPTIONS_AND_IPE"
        
    return {
        "expert_name": expert_name,
        "specialization": field_of_expertise,
        "competence_and_objectivity_verified": is_competent_and_objective,
        "work_adequacy_verified": is_work_adequate,
        "reliance_decision": reliance_status,
        "mandated_audit_action": audit_action,
        "misstatement_is_material": identified_misstatement_cr >= performance_materiality_cr
    }

expert_audit = evaluate_sa620_auditors_expert_work(
    expert_name="Apex Actuarial & Valuation Advisors LLP",
    field_of_expertise="Patent Intangibles & Royalty Relief DCF Modeling",
    has_independence_confirmation=True,
    professional_credential_verified=True,
    source_data_tested_by_auditor=True,
    expert_assumptions_corroborated=True,
    identified_misstatement_cr=85.0,
    performance_materiality_cr=20.0
)
print("SA 620 Auditor's Expert Evaluation & Reliance Engine:")
print(f"  Expert Name & Specialty   : {expert_audit['expert_name']} ({expert_audit['specialization']})")
print(f"  Objectivity & Competence  : {expert_audit['competence_and_objectivity_verified']}")
print(f"  Work Adequacy Tested      : {expert_audit['work_adequacy_verified']}")
print(f"  Reliance Decision         : {expert_audit['reliance_decision']}")
print(f"  Audit Action Mandated     : {expert_audit['mandated_audit_action']}")
print(f"  Material Misstatement     : {expert_audit['misstatement_is_material']}")
''',
            "tryIt": "Set source_data_tested_by_auditor to False to observe how reliance is immediately blocked under SA 620 until the auditor tests the underlying data.",
            "check": {
                "question": "Can a statutory auditor refer to the work of an Auditor's Expert in an unmodified (clean) audit report issued under SA 700 / SA 620?",
                "options": [
                    "No, the auditor shall not refer to the work of an auditor's expert in an unmodified audit report, as the auditor retains sole responsibility for the audit opinion",
                    "Yes, the auditor is legally required to list all external experts in the opening paragraph of the audit report",
                    "Yes, provided the expert signs the audit report alongside the statutory audit partner",
                    "Only if the expert's professional fees exceed the statutory audit fee"
                ],
                "answerIndex": 0,
                "why": "SA 620 Paragraph 14 explicitly prohibits the auditor from referring to the work of an auditor's expert in an unmodified audit report, maintaining undivided auditor responsibility."
            }
        }
    ]
}

if __name__ == "__main__":
    with open("scripts/temp_day16.json", "w", encoding="utf-8") as f:
        json.dump(day_data, f, indent=2)
    print("Day 16 base JSON created successfully.")
