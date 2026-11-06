"""
Build Day 17 JSON for Course: bcom_tax (Corporate Taxation & GST)
Topic: Secondary Adjustments (Section 92CE), Thin Capitalisation (Section 94B) & GAAR (Chapter X-A)
"""
import json
import os

day_data = {
    "day": 17,
    "title": "Secondary Adjustments (Sec 92CE), Thin Capitalisation (Sec 94B) & GAAR (Chapter X-A)",
    "parts": [
        {
            "title": "Secondary Adjustments Mechanics & Repatriation Mandate (Section 92CE)",
            "say": [
                "Under the Indian transfer pricing framework, a primary transfer pricing adjustment increases the taxable profits of an Indian enterprise or reduces its allowable deductions. However, simply adding back profits on paper leaves the excess cash physically residing offshore in the bank account of the foreign Associated Enterprise. To bridge this economic divergence, Finance Act 2017 enacted Section 92CE, introducing mandatory Secondary Adjustments.",
                "A secondary adjustment is required when a primary adjustment exceeds Rs 1 Crore and arises from: (a) suo-moto addition by the taxpayer in the return of income, (b) an assessment order accepted by the taxpayer, (c) an Advance Pricing Agreement (APA) under Section 92CC, (d) Safe Harbour Rules under Section 92CB, or (e) a Mutual Agreement Procedure (MAP) resolution under Section 90/90A.",
                "Under Rule 10CB, the excess money resulting from the primary adjustment must be physically repatriated into India within 90 days from the date of filing the return, receipt of the assessment order, or signing of the APA. If the offshore AE fails to repatriate this capital within the 90-day window, the un-repatriated sum is conclusively deemed to be an advance made by the Indian company to its foreign affiliate, on which imputed interest income accrues annually.",
                "The imputed interest is computed under Rule 10CB at: (i) 1-year Marginal Cost of Funds Based Lending Rate (MCLR) of SBI plus 325 basis points for transactions denominated in Indian Rupees, or (ii) 6-month SOFR (Secured Overnight Financing Rate) plus 300 basis points for foreign currency transactions. This interest accrues perpetually until physical repatriation or payment of the additional corporate tax levy."
            ],
            "example": "An Indian company accepts a primary transfer pricing adjustment of Rs 10 Crore in its APA. If the foreign AE fails to repatriate the Rs 10 Crore within 90 days, the amount is deemed an overseas advance. Assuming SBI MCLR is 8.5%, imputed interest at 11.75% (8.5% + 3.25%) generates annual taxable interest income of Rs 1.175 Crore in the hands of the Indian entity.",
            "code": '''def calculate_secondary_adjustment(primary_adj_cr: float, is_accepted: bool, repatriated_within_90d: bool, is_inr: bool, base_rate: float) -> dict:
    # Threshold check: Primary adjustment > 1 Crore
    sec_adj_applicable = is_accepted and (primary_adj_cr > 1.0)
    
    if not sec_adj_applicable:
        return {
            "secondary_adj_triggered": False,
            "status": "Exempt: Primary adjustment <= Rs 1 Cr or contested",
            "annual_imputed_interest_cr": 0.0
        }
        
    if repatriated_within_90d:
        return {
            "secondary_adj_triggered": True,
            "repatriation_status": "Compliant: Repatriated within 90 days",
            "annual_imputed_interest_cr": 0.0
        }
        
    # Rule 10CB Interest Rate
    spread = 3.25 if is_inr else 3.00
    imputed_rate = base_rate + spread
    annual_interest = primary_adj_cr * (imputed_rate / 100.0)
    
    return {
        "secondary_adj_triggered": True,
        "repatriation_status": "Non-Compliant: Deemed Advance Triggered",
        "imputed_interest_rate_pct": imputed_rate,
        "annual_imputed_interest_cr": annual_interest
    }

sec_res = calculate_secondary_adjustment(primary_adj_cr=10.0, is_accepted=True, repatriated_within_90d=False, is_inr=True, base_rate=8.5)
print(f"Secondary Adjustment Triggered: {sec_res['secondary_adj_triggered']}")
print(f"Status: {sec_res['repatriation_status']}")
print(f"Statutory Imputed Rate (MCLR + 3.25%): {sec_res['imputed_interest_rate_pct']:.2f}%")
print(f"Annual Taxable Imputed Interest: INR {sec_res['annual_imputed_interest_cr']:.4f} Crores")
''',
            "tryIt": "Set repatriated_within_90d to True to verify that timely cash repatriation eliminates deemed advance status and imputed interest liability entirely.",
            "check": {
                "question": "What is the statutory monetary threshold and timeline for physical repatriation to avert imputed interest under Section 92CE and Rule 10CB?",
                "options": [
                    "Primary adjustment exceeding Rs 1 Crore, repatriated within 90 days from the prescribed trigger date",
                    "Primary adjustment exceeding Rs 5 Crore, repatriated within 180 days from the close of the financial year",
                    "Primary adjustment exceeding Rs 50 Lakh, repatriated within 30 days from the receipt of the draft assessment order",
                    "Any primary adjustment regardless of value, repatriated within 365 days of income tax return filing"
                ],
                "answerIndex": 0,
                "why": "Section 92CE(1) sets the monetary threshold at primary adjustments exceeding Rs 1 Crore, and Rule 10CB prescribes the strict 90-day physical repatriation timeline."
            }
        },
        {
            "title": "Option to Pay Additional Tax under Section 92CE(2A)",
            "say": [
                "Where a foreign Associated Enterprise is legally unable or commercially unwilling to repatriate funds back to India—often due to local exchange controls, insolvency, or minority shareholder disputes—the Indian taxpayer faced perpetual compounding interest liability under Section 92CE(2). To resolve this deadweight burden, Finance (No. 2) Act 2019 inserted Section 92CE(2A), providing an alternative settlement exit mechanism.",
                "Under Section 92CE(2A), the Indian company can elect to pay a one-time additional income tax on the un-repatriated excess money. The statutory tax rate is fixed at 18%, subject to a mandatory surcharge of 12% and Health & Education Cess of 4%, resulting in an effective tax rate of 20.9664% on the principal un-repatriated sum.",
                "Once this additional tax is remitted to the central government, three statutory immunities attach: (1) no imputed interest under Section 92CE(2) shall be calculated from the date of payment of such tax, (2) the taxpayer cannot claim any tax credit or deduction for the tax so paid, and (3) no further deduction shall be allowed under any other provision of the Act.",
                "Corporate CFOs must conduct financial trade-off evaluations comparing the discounted present value of ongoing imputed interest tax payments against immediate one-time payment of the 20.9664% additional tax. Where the cost of capital or long-term interest burden exceeds 21%, executing the Section 92CE(2A) buyout permanently insulates the corporate balance sheet."
            ],
            "example": "An Indian firm has Rs 5 Crore in un-repatriated primary adjustment. It faces annual imputed interest of Rs 58.75 Lakh (yielding Rs 14.8 Lakh in annual tax at 25.168%). Alternatively, it can pay a one-time additional tax of 20.9664% on Rs 5 Crore, equal to Rs 1.048 Crore, permanently terminating all future imputed interest obligations.",
            "code": '''def evaluate_sec92ce_tax_buyout(unrepatriated_amount_cr: float, annual_imputed_interest_cr: float, corporate_tax_rate_pct: float, horizon_years: int, discount_rate_pct: float) -> dict:
    # One-time additional tax: Base 18% + 12% Surcharge + 4% Cess = 20.9664%
    effective_buyout_tax_rate = 18.0 * 1.12 * 1.04
    one_time_buyout_tax = unrepatriated_amount_cr * (effective_buyout_tax_rate / 100.0)
    
    # Calculate NPV of ongoing tax on imputed interest over horizon
    annual_tax_on_interest = annual_imputed_interest_cr * (corporate_tax_rate_pct / 100.0)
    npv_ongoing_tax = 0.0
    for y in range(1, horizon_years + 1):
        npv_ongoing_tax += annual_tax_on_interest / ((1.0 + (discount_rate_pct / 100.0)) ** y)
        
    recommendation = "Pay One-Time 20.9664% Tax" if one_time_buyout_tax < npv_ongoing_tax else "Maintain Deemed Advance & Imputed Interest"
    
    return {
        "unrepatriated_principal_cr": unrepatriated_amount_cr,
        "effective_buyout_rate_pct": effective_buyout_tax_rate,
        "one_time_buyout_tax_cr": one_time_buyout_tax,
        "annual_tax_on_interest_cr": annual_tax_on_interest,
        "npv_ongoing_tax_cr": npv_ongoing_tax,
        "recommendation": recommendation
    }

buyout_eval = evaluate_sec92ce_tax_buyout(
    unrepatriated_amount_cr=5.0,
    annual_imputed_interest_cr=0.5875,
    corporate_tax_rate_pct=25.168,
    horizon_years=10,
    discount_rate_pct=8.0
)
print(f"One-Time Additional Tax (Sec 92CE(2A)): INR {buyout_eval['one_time_buyout_tax_cr']:.4f} Crores ({buyout_eval['effective_buyout_rate_pct']:.4f}%)")
print(f"NPV of 10-Yr Ongoing Interest Tax: INR {buyout_eval['npv_ongoing_tax_cr']:.4f} Crores")
print(f"Strategic Verdict: {buyout_eval['recommendation']}")
''',
            "tryIt": "Increase horizon_years to 15 years to observe how extended timelines make the one-time buyout significantly more cost-effective in present value terms.",
            "check": {
                "question": "What is the exact effective tax rate applicable to one-time settlements of un-repatriated secondary adjustments under Section 92CE(2A)?",
                "options": [
                    "20.9664% (Base 18% + 12% Surcharge + 4% Cess)",
                    "25.168% (Base 22% + 10% Surcharge + 4% Cess)",
                    "15.60% (Base 15% + flat 4% Cess with zero surcharge)",
                    "30.0% flat penalty rate without any surcharge or cess"
                ],
                "answerIndex": 0,
                "why": "Section 92CE(2A) prescribes a base tax rate of 18%, increased by a mandatory 12% surcharge and 4% cess: 18 * 1.12 * 1.04 = 20.9664%."
            }
        },
        {
            "title": "Thin Capitalisation & Interest Limitation Rules (Section 94B)",
            "say": [
                "Multinational groups historically leveraged debt financing to erode domestic tax bases through excessive cross-border interest deductions, a practice known as thin capitalisation. Responding to OECD BEPS Action 4, Section 94B was inserted into the Income Tax Act to restrict interest deductions claimed by Indian companies or permanent establishments on borrowings from non-resident Associated Enterprises.",
                "Under Section 94B, the statutory ceiling on deductible interest expense is capped at 30% of earnings before interest, taxes, depreciation, and amortisation (EBITDA), or the actual interest paid/payable to the AE, whichever is lower. Crucially, the restriction applies not only to direct loans from an AE, but also to third-party bank loans where the AE provides an implicit or explicit guarantee or deposits matching funds.",
                "The statute incorporates two essential carve-outs: (1) Section 94B does not apply if total interest paid or payable to non-resident AEs does not exceed Rs 1 Crore in the relevant financial year, and (2) banking and insurance companies are completely exempt from interest capping rules due to the fundamental nature of their financial intermediation business.",
                "Any interest disallowed under Section 94B is not permanently forfeited. The disallowed portion can be carried forward for up to 8 assessment years following the year of initial disallowance. In subsequent years, carried forward interest can be set off against corporate business profits, provided the aggregate interest deduction in that subsequent year remains within the 30% EBITDA cap."
            ],
            "example": "Industrial Logistics India reports EBITDA of Rs 20 Crore and incurs Rs 9 Crore in interest payable to its Netherlands AE. Under Section 94B, allowable interest is capped at 30% of Rs 20 Crore = Rs 6 Crore. The excess Rs 3 Crore is disallowed and added back to taxable income, but can be carried forward for 8 assessment years.",
            "code": '''def calculate_sec94b_limitation(ebitda_cr: float, ae_interest_cr: float, has_ae_guarantee: bool, is_banking_company: bool) -> dict:
    if is_banking_company:
        return {"exempt": True, "reason": "Banking/Insurance exempt under Sec 94B(3)", "disallowed_cr": 0.0, "allowable_cr": ae_interest_cr}
        
    if ae_interest_cr <= 1.0:
        return {"exempt": True, "reason": "De minimis threshold <= Rs 1 Cr under Sec 94B(1)", "disallowed_cr": 0.0, "allowable_cr": ae_interest_cr}
        
    # Statutory cap: 30% of EBITDA
    ebitda_cap = max(0.0, ebitda_cr * 0.30)
    allowable_interest = min(ae_interest_cr, ebitda_cap)
    disallowed_interest = max(0.0, ae_interest_cr - allowable_interest)
    
    return {
        "exempt": False,
        "ebitda_cr": ebitda_cr,
        "ae_interest_cr": ae_interest_cr,
        "statutory_30pct_cap_cr": ebitda_cap,
        "allowable_interest_deduction_cr": allowable_interest,
        "disallowed_interest_carried_forward_cr": disallowed_interest,
        "max_carry_forward_years": 8
    }

sec94b_res = calculate_sec94b_limitation(ebitda_cr=20.0, ae_interest_cr=9.0, has_ae_guarantee=True, is_banking_company=False)
print(f"EBITDA: INR {sec94b_res['ebitda_cr']:.2f} Cr, AE Interest: INR {sec94b_res['ae_interest_cr']:.2f} Cr")
print(f"30% EBITDA Cap: INR {sec94b_res['statutory_30pct_cap_cr']:.2f} Cr")
print(f"Allowable Deduction: INR {sec94b_res['allowable_interest_deduction_cr']:.2f} Cr")
print(f"Disallowed & Carried Forward: INR {sec94b_res['disallowed_interest_carried_forward_cr']:.2f} Cr (Carry forward window: {sec94b_res['max_carry_forward_years']} AYs)")
''',
            "tryIt": "Increase ebitda_cr to 35.0 Cr (30% cap = 10.5 Cr) to verify that interest is 100% deductible when EBITDA expansion absorbs the financial charge.",
            "check": {
                "question": "What is the maximum statutory interest deduction ceiling under Section 94B, and for how many assessment years can disallowed interest be carried forward?",
                "options": [
                    "Capped at 30% of EBITDA; carry forward permitted for up to 8 assessment years",
                    "Capped at 50% of EBIT; carry forward permitted indefinitely until absorbed",
                    "Capped at 25% of gross revenue; carry forward permitted for up to 4 assessment years",
                    "Capped at 15% of net profit; carry forward strictly prohibited"
                ],
                "answerIndex": 0,
                "why": "Section 94B(1) caps interest deduction at 30% of EBITDA, and Section 94B(4) permits the carried-forward set-off of disallowed interest for up to 8 assessment years."
            }
        },
        {
            "title": "General Anti-Avoidance Rule (GAAR) Framework (Chapter X-A, Sec 95-102)",
            "say": [
                "The General Anti-Avoidance Rule (GAAR), codified in Chapter X-A (Sections 95 to 102) and governed by Rule 10U-10UC, represents the ultimate weapon of the Indian revenue authorities against aggressive tax planning. GAAR grants the tax administration sweeping powers to disregard, reclassify, or look through artificial corporate arrangements designed primarily to obtain a tax benefit.",
                "Under Section 96, an arrangement is declared an Impermissible Avoidance Arrangement (IAA) if its main purpose is to obtain a tax benefit (the 'main purpose test') AND it satisfies any one of four statutory taint tests: (1) it creates rights or obligations not ordinarily created between parties dealing at arm's length (abnormal rights), (2) it results directly or indirectly in the misuse or abuse of statutory provisions, (3) it lacks commercial substance in whole or in part, or (4) it is entered into or carried out in a manner not ordinarily employed for bona fide purposes.",
                "Commercial substance is evaluated under Section 97. An arrangement lacks commercial substance if the substance of the arrangement differs from its legal form, or if it involves round-trip financing, accommodating parties, elements that have the effect of offsetting each other, or transactions conducted through tax-haven conduit entities with no significant commercial activities, assets, or employees.",
                "To prevent administrative harassment, the statute incorporates essential safe harbors under Rule 10U: GAAR cannot be invoked if the aggregate tax benefit arising to all parties in the relevant financial year does not exceed Rs 3 Crore. Furthermore, GAAR does not apply to Foreign Portfolio Investors (FPIs) in respect of investments made prior to April 1, 2017 (grandfathering), or where an arrangement has been validated by an Advance Ruling."
            ],
            "example": "A company routes an equity sale through a shell company in a low-tax treaty jurisdiction with zero employees, no local premises, and decisions made entirely in India. The main purpose is claiming treaty capital gains exemption saving Rs 8 Crore in tax. Because tax benefit exceeds Rs 3 Crore and the entity lacks commercial substance under Section 97, GAAR is invoked, piercing the corporate veil and taxing the capital gain in India.",
            "code": '''def evaluate_gaar_applicability(tax_benefit_cr: float, main_purpose_is_tax_saving: bool, has_taint_test: bool, has_commercial_substance: bool) -> dict:
    # Safe harbor check: Tax benefit threshold > Rs 3 Crore under Rule 10U
    if tax_benefit_cr <= 3.0:
        return {
            "gaar_invoked": False,
            "status": "Safe Harbor Protected: Tax benefit <= Rs 3 Cr under Rule 10U",
            "consequence": "Transaction evaluated under SAAR / specific provisions only"
        }
        
    # Main Purpose Test + Taint Test under Section 96
    is_iaa = main_purpose_is_tax_saving and (has_taint_test or not has_commercial_substance)
    
    if is_iaa:
        consequences = [
            "Disregard or combine steps in the arrangement",
            "Reallocate income, deductions, and tax treaty reliefs",
            "Treat accommodating conduit entities as non-existent",
            "Reclassify debt into equity or capital into revenue"
        ]
        return {
            "gaar_invoked": True,
            "status": "Impermissible Avoidance Arrangement (IAA) Certified under Sec 96",
            "statutory_remedies": consequences
        }
    else:
        return {
            "gaar_invoked": False,
            "status": "Arrangement Compliant: Commercial substance established with bona fide business purpose",
            "consequence": "Standard tax assessment applies"
        }

gaar_res = evaluate_gaar_applicability(tax_benefit_cr=8.5, main_purpose_is_tax_saving=True, has_taint_test=True, has_commercial_substance=False)
print(f"GAAR Invoked: {gaar_res['gaar_invoked']}")
print(f"Finding: {gaar_res['status']}")
if gaar_res['gaar_invoked']:
    print("Statutory Restructuring Consequences:")
    for r in gaar_res['statutory_remedies']:
        print(f"  -> {r}")
''',
            "tryIt": "Set tax_benefit_cr to 2.5 to verify that the statutory monetary safe harbor under Rule 10U shields transactions from GAAR invocation regardless of tax-saving intent.",
            "check": {
                "question": "Under Rule 10U of the Income Tax Rules, what is the statutory monetary threshold below which GAAR provisions cannot be invoked against an arrangement?",
                "options": [
                    "Aggregate tax benefit arising to all parties does not exceed Rs 3 Crore in the relevant financial year",
                    "Aggregate transaction value does not exceed Rs 50 Crore",
                    "Tax benefit does not exceed 10% of total commercial turnover",
                    "The arrangement involves investments made exclusively in listed equities"
                ],
                "answerIndex": 0,
                "why": "Rule 10U(1)(a) provides that Chapter X-A shall not apply to an arrangement where the tax benefit in the relevant assessment year arising, in aggregate, to all the parties to the arrangement does not exceed Rs 3 Crore."
            }
        },
        {
            "title": "GAAR vs SAAR & Approving Panel Governance (Sec 100 & Sec 144BA)",
            "say": [
                "A foundational tenet of corporate tax jurisprudence is the interaction between Specific Anti-Avoidance Rules (SAAR) and General Anti-Avoidance Rules (GAAR) under Section 100. SAAR includes targeted anti-abuse rules such as Section 92 (Transfer Pricing), Section 94B (Thin Capitalisation), and Section 50CA/56(2)(x) (Deemed Valuations). Section 100 clarifies that GAAR can be invoked in addition to, or in lieu of, any other anti-abuse provision.",
                "To ensure that GAAR is not invoked arbitrarily by field assessing officers, the statute establishes a rigorous three-tier administrative check under Section 144BA. An Assessing Officer cannot invoke GAAR independently; they must first issue a formal notice to the taxpayer and refer the case to the Principal Commissioner or Commissioner of Income Tax (PCIT).",
                "If the PCIT is satisfied that GAAR applies, the matter is referred to the statutory Approving Panel constituted under Section 144BA(4). The Approving Panel consists of three distinguished members: a Chairman who is or has been a Judge of a High Court, one member from the Indian Revenue Service (level of Chief Commissioner), and an independent academic or professional expert in taxation.",
                "The Approving Panel conducts detailed hearings, examines commercial justification dossiers, and issues binding directions within six months. Directions issued by the Approving Panel are binding on both the taxpayer and the tax department, providing institutional judicial oversight over the invocation of anti-avoidance measures."
            ],
            "example": "An Assessing Officer seeks to invoke GAAR to deny treaty benefits to a foreign holding company. The AO must make a reference under Section 144BA to the PCIT. If the PCIT concurs, the file is submitted to the High-Court-Judge-led Approving Panel. If the Approving Panel rules that the holding company has genuine management substance and commercial rationale, the reference is rejected, binding the assessing officer.",
            "code": '''def simulate_gaar_approving_panel_workflow(ao_reference_valid: bool, pcit_satisfaction: bool, has_genuine_substance: bool) -> dict:
    workflow = []
    workflow.append("Step 1: Assessing Officer issues Sec 144BA notice to taxpayer")
    
    if not ao_reference_valid:
        return {"approved": False, "stage": "Terminated at AO level", "workflow": workflow}
        
    workflow.append("Step 2: Reference made to PCIT / CIT under Sec 144BA(1)")
    if not pcit_satisfaction:
        workflow.append("Step 2 Outcome: PCIT rejects reference; GAAR dropped")
        return {"approved": False, "stage": "Dropped by PCIT", "workflow": workflow}
        
    workflow.append("Step 3: Reference submitted to 3-Member Approving Panel (High Court Judge Chaired)")
    if has_genuine_substance:
        workflow.append("Step 4: Approving Panel verifies commercial substance; rejects GAAR invocation")
        panel_decision = "GAAR Reference Quashed - Binding on Revenue"
        approved = False
    else:
        workflow.append("Step 4: Approving Panel confirms Impermissible Avoidance Arrangement")
        panel_decision = "GAAR Upheld - AO directed to recompute income under Chapter X-A"
        approved = True
        
    return {
        "gaar_approved_by_panel": approved,
        "panel_verdict": panel_decision,
        "workflow_audit_trail": workflow
    }

panel_res = simulate_gaar_approving_panel_workflow(ao_reference_valid=True, pcit_satisfaction=True, has_genuine_substance=True)
print(f"Panel Approval: {panel_res['gaar_approved_by_panel']}")
print(f"Final Verdict: {panel_res['panel_verdict']}")
for step in panel_res['workflow_audit_trail']:
    print(f"  {step}")
''',
            "tryIt": "Set has_genuine_substance to False to observe the Approving Panel issuing binding directions to restructure the arrangement under Chapter X-A.",
            "check": {
                "question": "Who chairs the statutory Approving Panel responsible for issuing binding directions on the invocation of GAAR under Section 144BA?",
                "options": [
                    "A person who is or has been a Judge of a High Court",
                    "The Chairman of the Central Board of Direct Taxes (CBDT)",
                    "The Comptroller and Auditor General of India (CAG)",
                    "The Secretary of the Ministry of Corporate Affairs"
                ],
                "answerIndex": 0,
                "why": "Section 144BA(4) explicitly specifies that the Approving Panel shall consist of three members, chaired by a person who is or has been a Judge of a High Court."
            }
        }
    ]
}

with open("scripts/bcom_tax_day17_data.json", "w", encoding="utf-8") as f:
    json.dump(day_data, f, indent=2)

print("Successfully built scripts/bcom_tax_day17_data.json")
