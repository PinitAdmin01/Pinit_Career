"""
Build Day 22 JSON for Course: bcom_tax (Corporate Taxation & GST)
Topic: Income Escaping Assessment (Section 147), Reopening Architecture (Sections 148, 148A, 149) & Search Assessments
"""
import json
import os

day_data = {
    "day": 22,
    "title": "Income Escaping Assessment & Reopening Architecture: Sections 147 to 151",
    "parts": [
        {
            "title": "Income Escaping Assessment Scope under Section 147",
            "say": [
                "While regular assessments under Section 143(3) achieve initial finality, Section 147 of the Income Tax Act provides the revenue authorities with extraordinary statutory powers to assess or reassess income that has escaped assessment. Prior to Finance Act 2021, reopening was governed by the subjective standard of 'reason to believe'. Finance Act 2021 completely revamped this framework, replacing 'reason to believe' with an objective, code-driven benchmark: 'information with the Assessing Officer suggesting that income chargeable to tax has escaped assessment.'",
                "Under Explanation 1 to Section 148, 'information' is strictly defined. It encompasses: (1) any information in accordance with the risk management strategy formulated by the CBDT, (2) any audit objection raised by the Comptroller and Auditor General of India (CAG), (3) information received under an international agreement or tax treaty (DTAA/TIEA exchange of information), (4) information arising from any order passed by a court or tribunal, or (5) information requiring action pursuant to CBDT notifications under the Insight portal.",
                "Crucially, the historic bar against a mere 'change of opinion' remains an unshakeable constitutional shield (Supreme Court in CIT v. Kelvinator of India Ltd.). An Assessing Officer cannot reopen an assessment merely because a successor officer adopts a different view on the same disclosed facts; there must be tangible, fresh external material demonstrating that income escaped assessment.",
                "Corporate tax counsel must scrutinize the recorded reasons and information dossier. Demonstrating that the queried transaction was fully disclosed during original assessment proceedings bars reassessment under the Kelvinator doctrine."
            ],
            "example": "A company claimed Section 35(2AB) weighted R&D deduction during regular Section 143(3) scrutiny, submitting full DSIR approval certificates. Two years later, a new assessing officer issues a Section 148 notice seeking to disallow the deduction on the same records. Under the Kelvinator precedent, this constitutes an impermissible change of opinion, rendering the reopening void.",
            "code": '''def evaluate_sec147_reopening(has_fresh_tangible_material: bool, was_disclosed_in_original_scrutiny: bool, matches_cbdt_risk_strategy: bool) -> dict:
    # Kelvinator of India Ltd. (Supreme Court) Rule: No change of opinion
    if was_disclosed_in_original_scrutiny and not has_fresh_tangible_material:
        return {
            "reopening_valid": False,
            "status": "VOID: Impermissible Change of Opinion (CIT v. Kelvinator of India Ltd.)",
            "statutory_basis": "All primary facts were on record and examined during original Sec 143(3) assessment"
        }
        
    # Section 148 Explanation 1: Information Standard
    if has_fresh_tangible_material or matches_cbdt_risk_strategy:
        return {
            "reopening_valid": True,
            "status": "VALID: Backed by fresh tangible information under Section 148 Explanation 1",
            "statutory_basis": "Information suggests income escaping assessment within CBDT risk management parameters"
        }
    else:
        return {
            "reopening_valid": False,
            "status": "DEFECTIVE: Lacks statutory information under Section 148 Explanation 1",
            "statutory_basis": "Absence of fresh information or CBDT flagged data"
        }

reopening_eval = evaluate_sec147_reopening(has_fresh_tangible_material=False, was_disclosed_in_original_scrutiny=True, matches_cbdt_risk_strategy=False)
print(f"Reopening Valid: {reopening_eval['reopening_valid']}")
print(f"Finding: {reopening_eval['status']}")
print(f"Legal Doctrine: {reopening_eval['statutory_basis']}")
''',
            "tryIt": "Set has_fresh_tangible_material to True and matches_cbdt_risk_strategy to True to verify that fresh external intelligence overcomes the change of opinion defense.",
            "check": {
                "question": "What foundational legal doctrine was established by the Supreme Court of India in the landmark Kelvinator of India Ltd. case regarding reassessment under Section 147?",
                "options": [
                    "Reassessment cannot be initiated on the basis of a mere 'change of opinion' without fresh tangible material",
                    "Assessing Officers have unlimited discretionary power to reopen any assessment within 20 years",
                    "Reassessment orders cannot be appealed before the Income Tax Appellate Tribunal",
                    "The tax department is prohibited from conducting search and seizure operations"
                ],
                "answerIndex": 0,
                "why": "The Supreme Court in Kelvinator of India Ltd. held that reassessment cannot be justified on a mere change of opinion; the Assessing Officer must possess tangible fresh material demonstrating that income escaped assessment."
            }
        },
        {
            "title": "Mandatory Pre-Notice Inquiries under Section 148A",
            "say": [
                "Recognizing that arbitrary reassessment notices created immense harassment and clogged judicial dockets, Parliament enacted Section 148A through the Finance Act 2021. Section 148A establishes an exhaustive pre-notice inquiry procedure that the Assessing Officer must strictly execute before issuing any notice under Section 148.",
                "The Section 148A procedure comprises four sequential steps: (1) Section 148A(a): The Assessing Officer may conduct inquiries, with the prior approval of the specified authority, with respect to the information suggesting income leakage; (2) Section 148A(b): The officer MUST provide an opportunity of being heard by serving a formal Show Cause Notice (SCN) along with the underlying information/evidence, granting the taxpayer between 7 and 30 days to reply; (3) Section 148A(c): The officer must consider the taxpayer's written reply and evidentiary objections; and (4) Section 148A(d): The officer must pass a reasoned speaking order deciding whether or not it is a fit case to issue a Section 148 notice, having obtained the prior approval of the specified authority under Section 151.",
                "The Supreme Court in the historic Union of India v. Ashish Agarwal ruling affirmed that Section 148A is a mandatory statutory safeguard designed to weed out frivolous reopenings. Passing an order under Section 148A(d) without furnishing the underlying material or without considering the taxpayer's reply renders the Section 148 notice jurisdictionally fatal.",
                "Section 148A incorporates explicit carve-outs under its proviso: no inquiry or show-cause notice is required where search proceedings are initiated under Section 132, where books are requisitioned under Section 132A, or where money, bullion, or jewellery are seized during search operations."
            ],
            "example": "An Assessing Officer receives insight data alleging Rs 80 Lakh in bogus purchase entries. The AO must issue a notice under Section 148A(b) attaching the vendor data. The company submits bank proof, e-way bills, and physical delivery notes within 14 days. If the AO passes a Section 148A(d) order ignoring these documents without explanation, High Courts quash the notice for violation of statutory natural justice.",
            "code": '''def execute_sec148a_workflow(is_search_case: bool, scn_served_with_evidence: bool, reply_days_given: int, taxpayer_reply_submitted: bool, reply_considered_in_order: bool, specified_authority_approval: bool) -> dict:
    if is_search_case:
        return {
            "sec148a_applicable": False,
            "status": "Exempt from Sec 148A under Proviso (Search / Requisition case)",
            "can_issue_sec148": specified_authority_approval
        }
        
    audit_trail = []
    
    # Check SCN and evidence disclosure under 148A(b)
    if not scn_served_with_evidence:
        return {"valid": False, "status": "VOID: Failed to serve evidence with SCN under Sec 148A(b) (Ashish Agarwal violation)"}
    audit_trail.append("Step 1: Sec 148A(b) SCN served with underlying material")
    
    # Check reply time window (7 to 30 days)
    if reply_days_given < 7 or reply_days_given > 30:
        return {"valid": False, "status": f"DEFECTIVE: Reply window ({reply_days_given} days) outside statutory 7-30 day limit"}
    audit_trail.append(f"Step 2: Statutory reply window ({reply_days_given} days) compliant")
    
    # Check consideration of reply under 148A(c)
    if taxpayer_reply_submitted and not reply_considered_in_order:
        return {"valid": False, "status": "QUASHABLE: Failure to consider taxpayer's reply under Sec 148A(c)"}
    audit_trail.append("Step 3: Taxpayer objections analyzed on merit under Sec 148A(c)")
    
    # Check Sec 151 Specified Authority Approval
    if not specified_authority_approval:
        return {"valid": False, "status": "FATAL: Prior approval of Specified Authority under Sec 151 missing"}
    audit_trail.append("Step 4: Prior approval of Specified Authority obtained under Sec 151")
    
    audit_trail.append("Step 5: Speaking order passed under Sec 148A(d) certifying fit case for Sec 148 notice")
    return {
        "valid": True,
        "status": "Compliant Section 148A Pre-Notice Procedure",
        "audit_trail": audit_trail
    }

sec148a_check = execute_sec148a_workflow(
    is_search_case=False,
    scn_served_with_evidence=True,
    reply_days_given=14,
    taxpayer_reply_submitted=True,
    reply_considered_in_order=True,
    specified_authority_approval=True
)
print(f"Sec 148A Procedure Valid: {sec148a_check['valid']}")
print(f"Status: {sec148a_check['status']}")
for step in sec148a_check['audit_trail']:
    print(f"  {step}")
''',
            "tryIt": "Set reply_considered_in_order to False to verify that non-consideration of the taxpayer's written reply invalidates the subsequent Section 148 notice.",
            "check": {
                "question": "What is the statutory time window that an Assessing Officer must grant to a taxpayer to respond to a Show Cause Notice issued under Section 148A(b)?",
                "options": [
                    "Not less than 7 days and not more than 30 days",
                    "Exactly 3 business days",
                    "Not less than 60 days",
                    "Indefinite period until all inquiries are completed"
                ],
                "answerIndex": 0,
                "why": "Section 148A(b) explicitly provides that the Assessing Officer shall provide an opportunity of being heard by serving a show cause notice, granting a time of not less than seven days and but not exceeding thirty days."
            }
        },
        {
            "title": "Statutory Limitation Deadlines & High-Value Reopenings (Section 149)",
            "say": [
                "The power to reopen past assessments is bounded by rigid statutory limitation periods codified in Section 149. Finance Act 2021 drastically reduced the general limitation window while reserving extended periods exclusively for high-value tax evasion.",
                "Under Section 149(1)(a), the standard limitation period for issuing a notice under Section 148 is three years from the end of the relevant assessment year. If three years have elapsed from the end of the assessment year, no notice can be issued unless the case falls into the extended high-value category.",
                "Under Section 149(1)(b), an extended limitation period of up to ten years (or 5 years in recent amendments) applies if and only if the Assessing Officer has in his possession books of account, other documents, or evidence which reveal that the income chargeable to tax which has escaped assessment amounts to or is likely to amount to Rs 50 Lakh or more for that year. The escaped income must be represented in the form of an asset, expenditure in respect of a transaction or event, or entries in the books of account.",
                "Crucially, Section 149(1) First Proviso incorporates a grandfathering clause: no notice under Section 148 shall be issued for an assessment year if such notice could not have been issued at that time on account of being barred by limitation under the old pre-2021 law. Furthermore, time spent by the taxpayer in responding to the Section 148A(b) notice is excluded when calculating the limitation period under the Third Proviso."
            ],
            "example": "For AY 2021-22, the 3-year limitation under Section 149(1)(a) ended on March 31, 2025. In June 2026, the AO attempts to issue a Section 148 notice alleging Rs 35 Lakh of escaped income. Because the escaped income is less than Rs 50 Lakh, Section 149(1)(b) does not apply, and the notice is barred by limitation.",
            "code": '''def evaluate_sec149_limitation(assessment_year: int, current_year: int, escaped_income_inr: float, is_represented_by_asset: bool) -> dict:
    ay_end_year = assessment_year + 1
    years_elapsed = current_year - ay_end_year
    
    threshold_50_lakh = 5000000.0  # Rs 50 Lakh
    
    if years_elapsed <= 3:
        status = "Within Standard 3-Year Window under Sec 149(1)(a) - Valid regardless of amount"
        valid = True
    elif years_elapsed <= 10:
        if escaped_income_inr >= threshold_50_lakh and is_represented_by_asset:
            status = f"Within Extended Window under Sec 149(1)(b) - Valid (Escaped income INR {escaped_income_inr:,.2f} >= Rs 50 Lakh represented by asset/entry)"
            valid = True
        else:
            reasons = []
            if escaped_income_inr < threshold_50_lakh:
                reasons.append(f"Escaped income INR {escaped_income_inr:,.2f} < Rs 50 Lakh threshold")
            if not is_represented_by_asset:
                reasons.append("Not represented by asset/expenditure/entry")
            status = f"BARRED BY LIMITATION under Sec 149(1)(b): {', '.join(reasons)}"
            valid = False
    else:
        status = "ABSOLUTELY BARRED BY LIMITATION: Exceeded maximum statutory limitation ceiling"
        valid = False
        
    return {
        "assessment_year": f"AY {assessment_year}-{str(assessment_year+1)[-2:]}",
        "years_elapsed_since_ay_end": years_elapsed,
        "escaped_income_inr": escaped_income_inr,
        "reopening_permissible": valid,
        "statutory_ruling": status
    }

lim1 = evaluate_sec149_limitation(assessment_year=2021, current_year=2026, escaped_income_inr=3500000.0, is_represented_by_asset=True)
print(f"Case 1 (AY 2021-22, INR 35L): Permissible = {lim1['reopening_permissible']}")
print(f"  Ruling: {lim1['statutory_ruling']}")

lim2 = evaluate_sec149_limitation(assessment_year=2021, current_year=2026, escaped_income_inr=7500000.0, is_represented_by_asset=True)
print(f"\nCase 2 (AY 2021-22, INR 75L): Permissible = {lim2['reopening_permissible']}")
print(f"  Ruling: {lim2['statutory_ruling']}")
''',
            "tryIt": "Set escaped_income_inr in lim1 to 6000000.0 (Rs 60 Lakh) to observe how crossing the Rs 50 Lakh threshold brings the reopening into the valid extended window.",
            "check": {
                "question": "What is the monetary threshold of escaped income required under Section 149(1)(b) to issue a reassessment notice beyond the standard 3-year limitation window?",
                "options": [
                    "Escaped income amounts to or is likely to amount to Rs 50 Lakh or more",
                    "Escaped income amounts to at least Rs 10 Lakh",
                    "Escaped income amounts to at least Rs 1 Crore",
                    "Any amount of escaped income if approved by the CBDT Chairman"
                ],
                "answerIndex": 0,
                "why": "Section 149(1)(b) strictly prescribes that reassessment beyond three years is permissible only if the income chargeable to tax which has escaped assessment amounts to or is likely to amount to Rs 50 Lakh or more."
            }
        },
        {
            "title": "Specified Authority Approvals under Section 151",
            "say": [
                "To ensure senior bureaucratic oversight over reassessment proceedings, Section 151 establishes a two-tiered hierarchy of 'Specified Authorities' whose prior sanction is a mandatory jurisdictional prerequisite before issuing notices under Section 148 or Section 148A.",
                "Under Section 151(i), if three years or less have elapsed from the end of the relevant assessment year, the Specified Authority is the Principal Commissioner or Commissioner of Income Tax (PCIT/CIT) or Principal Director or Director of Income Tax (PDIT/DIT).",
                "Under Section 151(ii), if more than three years have elapsed from the end of the relevant assessment year, the sanction must be obtained from an authority of higher rank: the Principal Chief Commissioner or Chief Commissioner (PCCIT/CCIT) or Principal Director General or Director General of Income Tax (PDGIT/DGIT).",
                "The approval cannot be granted mechanically as a rubber stamp. In landmark High Court decisions (such as DSJ Communications and German Remedies), courts held that if the specified authority merely writes 'Yes, I am satisfied' or clicks an electronic approval button without independent application of mind, the approval is legally defective, rendering the entire reassessment notice null and void."
            ],
            "example": "An Assessing Officer seeks to reopen AY 2020-21 in year 2025 (more than 3 years have elapsed). The AO obtains approval from the jurisdictional PCIT. Because more than 3 years elapsed, Section 151(ii) strictly mandates approval from the Chief Commissioner (CCIT). The PCIT lacked statutory competence to grant approval; therefore, the Section 148 notice is quashed by the High Court.",
            "code": '''def verify_sec151_approval(assessment_year: int, current_year: int, approved_by_rank: str, independent_application_of_mind: bool) -> dict:
    ay_end_year = assessment_year + 1
    years_elapsed = current_year - ay_end_year
    
    if years_elapsed <= 3:
        required_authority = ["PCIT", "CIT", "PDIT", "DIT", "PCCIT", "CCIT", "PDGIT", "DGIT"]
        authority_tier = "Tier 1: PCIT / CIT or higher (within 3 years under Sec 151(i))"
    else:
        required_authority = ["PCCIT", "CCIT", "PDGIT", "DGIT"]
        authority_tier = "Tier 2: PCCIT / CCIT / DGIT (beyond 3 years under Sec 151(ii))"
        
    has_competent_authority = approved_by_rank in required_authority
    
    if not has_competent_authority:
        return {
            "valid_approval": False,
            "status": f"FATAL JURISDICTIONAL DEFECT: Approved by {approved_by_rank}, but statute mandates {authority_tier}",
            "remedy": "Section 148 notice liable to be quashed under writ jurisdiction"
        }
        
    if not independent_application_of_mind:
        return {
            "valid_approval": False,
            "status": "VOID: Mechanical / Rubber-stamp approval without independent application of mind",
            "remedy": "Quashable under German Remedies / DSJ Communications precedents"
        }
        
    return {
        "valid_approval": True,
        "status": f"Compliant Statutory Sanction granted by competent {approved_by_rank} under Sec 151",
        "authority_tier": authority_tier
    }

appr_check = verify_sec151_approval(assessment_year=2020, current_year=2025, approved_by_rank="PCIT", independent_application_of_mind=True)
print(f"Approval Valid: {appr_check['valid_approval']}")
print(f"Finding: {appr_check['status']}")
''',
            "tryIt": "Update approved_by_rank to 'CCIT' to verify that obtaining sanction from the Chief Commissioner satisfies the Tier 2 requirement beyond 3 years.",
            "check": {
                "question": "Under Section 151(ii), who is the competent Specified Authority to grant approval for reopening an assessment if more than three years have elapsed from the end of the relevant assessment year?",
                "options": [
                    "Principal Chief Commissioner or Chief Commissioner or Principal Director General or Director General",
                    "Principal Commissioner or Commissioner of Income Tax",
                    "The jurisdictional Assessing Officer independently",
                    "The Income Tax Appellate Tribunal Registrar"
                ],
                "answerIndex": 0,
                "why": "Section 151(ii) strictly provides that if more than three years have elapsed from the end of the relevant assessment year, approval must be granted by the Principal Chief Commissioner or Chief Commissioner or Principal Director General or Director General."
            }
        },
        {
            "title": "Search Assessments & Reopening Architecture (Section 132 & 148)",
            "say": [
                "Prior to April 1, 2021, income discovered during tax raids and search operations was assessed under specialized block assessment provisions codified in Section 153A through Section 153D. Finance Act 2021 harmonized the tax code by abolishing Section 153A and bringing all search-related assessments under the streamlined Section 147/148 reassessment regime.",
                "Where a search is initiated under Section 132 or books/assets are requisitioned under Section 132A on or after April 1, 2021, Section 148 establishes a conclusive legal presumption: the Assessing Officer is deemed to have 'information suggesting income escaping assessment' for the assessment year relevant to the previous year in which the search was conducted, as well as for the three assessment years immediately preceding.",
                "For reopening up to ten preceding assessment years in search cases, the Rs 50 Lakh threshold under Section 149(1)(b) applies. However, in search assessments, the threshold is evaluated on an aggregate basis across the block of assessment years, making it straightforward for revenue authorities to invoke the full 10-year lookback window.",
                "Furthermore, as noted in Section 148A, search assessments are completely exempt from the pre-notice inquiry and show-cause requirements. Assessing Officers issue Section 148 notices directly, demanding returns of income within three months and proceeding straight to comprehensive scrutiny."
            ],
            "example": "A corporate group undergoes a search operation under Section 132 in November 2024 (FY 2024-25, AY 2025-26). By operation of the legal presumption in Section 148, the AO automatically possesses 'information' for AY 2025-26, AY 2024-25, AY 2023-24, and AY 2022-23, and issues direct Section 148 notices without conducting Section 148A inquiries.",
            "code": '''def evaluate_search_assessment_framework(search_date: str, search_ay: int, aggregate_undisclosed_income_cr: float) -> dict:
    # Presumed Information years: Search AY + 3 immediately preceding AYs
    presumed_ays = [search_ay, search_ay - 1, search_ay - 2, search_ay - 3]
    
    # Extended 10-year lookback: Allowed if aggregate escaped income >= Rs 50 Lakh (0.5 Cr)
    extended_eligible = aggregate_undisclosed_income_cr >= 0.50
    extended_ays = [search_ay - i for i in range(4, 11)] if extended_eligible else []
    
    return {
        "search_execution_date": search_date,
        "search_assessment_regime": "Unified Section 147/148 Regime (Post-Finance Act 2021)",
        "sec148a_pre_notice_inquiry": "Exempt under First Proviso to Section 148A",
        "presumed_information_years": [f"AY {ay}-{str(ay+1)[-2:]}" for ay in presumed_ays],
        "extended_lookback_years": [f"AY {ay}-{str(ay+1)[-2:]}" for ay in extended_ays],
        "total_years_subject_to_reopening": len(presumed_ays) + len(extended_ays)
    }

search_case = evaluate_search_assessment_framework(search_date="2024-11-15", search_ay=2025, aggregate_undisclosed_income_cr=8.5)
print(f"Search Regime: {search_case['search_assessment_regime']}")
print(f"Sec 148A Pre-Notice Inquiries: {search_case['sec148a_pre_notice_inquiry']}")
print("Presumed Information AYs (Automatic Reopening):")
for ay in search_case['presumed_information_years']:
    print(f"  -> {ay}")
print(f"Total AYs Reopened under Sec 148: {search_case['total_years_subject_to_reopening']} Assessment Years")
''',
            "tryIt": "Set aggregate_undisclosed_income_cr to 0.30 (Rs 30 Lakh) to observe the extended lookback years being disallowed due to falling below the Rs 50 Lakh threshold.",
            "check": {
                "question": "Under the post-2021 search assessment architecture, what exemption is granted to search cases under the first proviso to Section 148A?",
                "options": [
                    "Search cases are completely exempt from conducting pre-notice inquiries and issuing show-cause notices under Section 148A",
                    "Search cases are exempt from paying any advance tax or interest under Section 234B",
                    "Search cases are exempt from filing returns of income",
                    "Search cases can only be assessed by the Income Tax Appellate Tribunal"
                ],
                "answerIndex": 0,
                "why": "The first proviso to Section 148A explicitly provides that the requirement of conducting inquiry and providing opportunity under Section 148A shall not apply to search cases initiated under Section 132."
            }
        }
    ]
}

with open("scripts/bcom_tax_day22_data.json", "w", encoding="utf-8") as f:
    json.dump(day_data, f, indent=2)

print("Successfully built scripts/bcom_tax_day22_data.json")
