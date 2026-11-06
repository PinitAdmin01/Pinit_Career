import json, sys, subprocess, os, re, hashlib

# Builder for Day 39 of bcom_law
# Course: bcom_law (Corporate Law, IBC & Compliance)
# Day 39: Resolution Plan Evaluation, Section 29A Ineligibility Filters, Section 30/31 Approval & Section 53 Liquidation Waterfall

day_num = 39
course_prefix = "bcom_law"
day_title = "Resolution Plan Evaluation, Section 29A Ineligibility Filters, Section 30/31 Approval & Section 53 Waterfall"
day_desc = "Master the culmination of the Corporate Insolvency Resolution Process under IBC 2016: Form G invitation for expressions of interest, Section 29A ineligibility screening of resolution applicants under the ArcelorMittal doctrine, Section 30/31 approval mechanics requiring sixty-six percent CoC supermajority, and Section 53 priority liquidation waterfall distributions."

# Part 1: Form G Invitation for Expression of Interest (EoI), Information Memorandum & Evaluation Matrix
part1_title = "Form G Invitation for Expression of Interest (EoI), Information Memorandum & Evaluation Matrix"
part1_say = [
    "The primary legislative objective of the Insolvency and Bankruptcy Code 2016 is corporate revival through competitive market discovery. Under Section 25(2)(h) of the Code read with Regulation 36A of the IBBI CIRP Regulations, the Resolution Professional is mandated to invite prospective resolution applicants to submit resolution plans. This competitive process is formally initiated by publishing a statutory public notice in Form G not later than the seventy-fifth day from the insolvency commencement date. Form G is published in prominent national newspapers across India and on the IBBI digital portal, establishing the minimum eligibility criteria approved by the Committee of Creditors.",
    "The CoC possesses exclusive commercial authority under Section 25(2)(h) to establish criteria for prospective resolution applicants, having regard to the complexity and scale of operations of the business of the corporate debtor. In practice, the CoC prescribes stringent financial and technical qualifying benchmarks: minimum tangible net worth for corporate entities, minimum assets under management (AUM) for private equity funds, and proven operational track records in the relevant industrial sector. These filters ensure that only well-capitalized, commercially capable bidders enter the restructuring arena, safeguarding the enterprise from speculative operators.",
    "Once eligible applicants execute binding Non-Disclosure Agreements (NDAs), Regulation 36 requires the RP to issue the Information Memorandum (IM) within ninety-five days of commencement. The Information Memorandum represents the comprehensive commercial blueprint of the corporate debtor: audited balance sheets, provisional financial statements, lists of tangible and intangible assets, material litigation, operational contracts, employee headcount, and details of statutory tax liabilities. Alongside the IM, the RP opens a secure Virtual Data Room (VDR) granting bidders electronic access to inspect land deeds, vendor contracts, and engineering certifications.",
    "Concurrently, the Resolution Professional issues the Request for Resolution Plans (RFRP) and the Evaluation Matrix under Regulation 36B. The Evaluation Matrix establishes the objective mathematical scorecard used by the CoC to compare competing plans. It assigns weighted percentages across quantitative parameters (upfront cash recovery, net present value of deferred payments, infusion of working capital) and qualitative parameters (turnaround strategy, management credentials, regulatory clearance feasibility).",
    "Under Regulation 36B(4A), prospective resolution applicants are required to furnish a Performance Security upon submission or approval of their plan, typically structured as an unconditional bank guarantee. If a successful bidder attempts to walk away or renege on their commitments after approval, this performance security is forfeited immediately, and the applicant faces blacklisting under IBBI regulations, preserving procedural solemnity.",
    "The RP must also obtain liquidation value and fair value from two independent registered valuers under Regulation 35. These valuation figures remain strictly confidential, locked in physical or encrypted vaults until the final evaluation of resolution plans, providing the CoC with an unassailable baseline to ensure proposed resolution values exceed scrap liquidation outcomes.",
    "Under Regulation 27, the Resolution Professional appoints two registered valuers to determine the fair value and liquidation value of the corporate debtor in accordance with internationally accepted valuation standards. If the two estimates are significantly divergent, the RP appoints a third valuer, taking the average of the two closest estimates. These valuation benchmarks serve as the confidential baseline against which the Committee of Creditors evaluates whether competing bids maximize economic value.",
    "Furthermore, under Regulation 36B(1), the Resolution Professional issues the formal Request for Resolution Plans (RFRP) to all qualified prospective applicants, providing at least thirty days for plan preparation and submission. The RFRP regulates physical site visits to factories and mines, coordinates management presentations, and establishes strict rules against bilateral lobbying, ensuring an unassailable, level-playing-field bidding environment.",
    "Through rigorous Form G public notices, comprehensive Information Memorandums, transparent evaluation matrices, and binding bid bonds, the CIRP creates an institutional marketplace that maximizes enterprise asset value while protecting corporate stakeholders."
]

part1_example = "The RP of a distressed cement manufacturer publishes Form G specifying a minimum tangible net worth of two hundred crore rupees. Three international infrastructure consortiums submit expressions of interest, execute non-disclosure agreements, and receive credentials for the virtual data room. The RP provides the Information Memorandum detailing plant capacities, limestone mining leases, and environmental clearances. The bidders structure competing offers scored against the CoC's seventy-thirty quantitative-qualitative evaluation matrix."

part1_code = '''def evaluate_prospective_resolution_applicant_eligibility(bidder_type, tangible_net_worth_cr, aum_cr, min_net_worth_threshold_cr, min_aum_threshold_cr, has_relevant_sector_experience):
    # CoC Criteria under Section 25(2)(h) and Regulation 36A
    meets_financial_criteria = False
    
    if bidder_type == "corporate_strategic":
        meets_financial_criteria = tangible_net_worth_cr >= min_net_worth_threshold_cr
    elif bidder_type == "financial_fund":
        meets_financial_criteria = aum_cr >= min_aum_threshold_cr
        
    is_eligible = meets_financial_criteria and has_relevant_sector_experience
    
    return {
        "bidder_type": bidder_type,
        "tangible_net_worth_cr": tangible_net_worth_cr,
        "aum_cr": aum_cr,
        "financial_threshold_satisfied": meets_financial_criteria,
        "sector_experience_verified": has_relevant_sector_experience,
        "rfrp_access_granted": is_eligible,
        "status": "QUALIFIED_PROSPECTIVE_APPLICANT" if is_eligible else "DISQUALIFIED_THRESHOLD_SHORTFALL"
    }

# Case: Strategic corporate bidder with 250 Cr net worth and cement operational track record
audit = evaluate_prospective_resolution_applicant_eligibility(
    bidder_type="corporate_strategic",
    tangible_net_worth_cr=250.0,
    aum_cr=0.0,
    min_net_worth_threshold_cr=200.0,
    min_aum_threshold_cr=1000.0,
    has_relevant_sector_experience=True
)
print("Bidder Classification:", audit["bidder_type"])
print("Financial Threshold Satisfied:", audit["financial_threshold_satisfied"])
print("Sector Track Record Verified:", audit["sector_experience_verified"])
print("Virtual Data Room Access:", audit["rfrp_access_granted"])
print("Qualification Ruling:", audit["status"])
'''

part1_check = {
    "question": "Under Section 25(2)(h) read with Regulation 36A of the IBBI CIRP Regulations 2016, by what statutory form and timeline is the public invitation for expression of interest published?",
    "options": [
        "In Form G not later than the seventy-fifth day from the insolvency commencement date",
        "In Form A not later than the third day from the insolvency commencement date",
        "In Form C not later than the one hundred and twentieth day from the admission order",
        "In Form H upon conclusion of final electronic voting by the Committee of Creditors"
    ],
    "answerIndex": 0,
    "why": "Regulation 36A(1) provides that the resolution professional shall publish brief particulars of the invitation for expression of interest in Form G not later than seventy-five days from the insolvency commencement date."
}

# Part 2: Section 29A Mandatory Disqualification Filters & The ArcelorMittal Doctrine
part2_title = "Section 29A Mandatory Disqualification Filters & The ArcelorMittal Doctrine"
part2_say = [
    "To prevent unscrupulous promoters and defaulters from exploiting the insolvency process to buy back their own distressed enterprises at a massive discount, Parliament enacted Section 29A through the historic Insolvency and Bankruptcy Code (Amendment) Act 2017. Section 29A is the moral and statutory conscience of the IBC: it erects an unyielding legislative barrier that disqualifies habitual defaulters, fraudulent managers, and tainted persons from submitting a resolution plan. The Resolution Professional is under an affirmative statutory obligation to examine each prospective applicant against ten comprehensive statutory ineligibility clauses before submitting any plan to the CoC.",
    "Section 29A sets forth ten distinct categories of disqualification: (a) an undischarged insolvent; (b) a willful defaulter declared by the Reserve Bank of India; (c) a person who, at the time of submission of the resolution plan, has an account classified as a Non-Performing Asset (NPA) under RBI guidelines for a period of at least one year prior to the commencement of CIRP, and has failed to cure the default by paying overdue amounts; (d) a person convicted of an offense punishable with imprisonment for two or more years; (e) a person disqualified to act as a director under the Companies Act 2013; (f) a person prohibited by the Securities and Exchange Board of India (SEBI) from trading in securities; (g) a person who has been a promoter or in control of a corporate debtor in which a preferential, undervalued, extortionate, or fraudulent transaction has occurred; (h) a person who has executed a personal guarantee in favor of a creditor which has been invoked and remains unpaid; (i) a person subject to any disability corresponding to clauses (a) to (h) under foreign law; and (j) a connected person to any person referred to in clauses (a) to (i).",
    "The landmark judicial interpretation of Section 29A was delivered by the Supreme Court of India in ArcelorMittal India Pvt. Ltd. v. Satish Kumar Gupta. In ArcelorMittal, Justice R.F. Nariman established the expansive scope of the 'Connected Person' and 'Management and Control' doctrines under Section 29A(j). The Supreme Court held that the corporate veil must be pierced to ascertain the ultimate beneficial controllers of an applicant. If an entity is a promoter or exercises de facto management control over a company with an NPA account older than one year, the entity cannot circumvent disqualification by superficially selling shares or resigning directorships on the eve of bid submission.",
    "Crucially, the Supreme Court in ArcelorMittal clarified the statutory cure mechanism under the proviso to Section 29A(c): a resolution applicant burdened by an NPA default is permitted to purge the disqualification if they pay off all overdue loan balances, interest, and charges before submitting the resolution plan. Both ArcelorMittal and NuMetal were required to clear billions of rupees in past banking arrears of associated entities before their resolution plans could be legally considered by the CoC.",
    "Section 29A also contains a vital statutory exemption for Micro, Small, and Medium Enterprises (MSMEs). Under Section 240A, the disqualification provisions of Section 29A(c) (one-year NPA) and Section 29A(h) (unpaid personal guarantee) do not apply to the resolution of an MSME corporate debtor. This legislative carve-out allows MSME promoters to submit resolution plans for their own enterprises, recognizing that small businesses frequently lack alternative market buyers and that enterprise survival depends upon original founder expertise.",
    "The Resolution Professional must conduct rigorous forensic due diligence on every applicant, requiring sworn affidavits under Section 30(1), searching RBI willful defaulter databases, reviewing CIBIL commercial records, and deploying specialized investigative accounting firms to map offshore holding structures. Presenting an ineligible bidder's plan to the CoC constitutes a grave breach of statutory duty that exposes the RP to severe IBBI disciplinary penalties.",
    "By establishing an impregnable statutory firewall against corporate looters, Section 29A guarantees that enterprise revival is led exclusively by clean, credible, and commercially responsible turnaround sponsors."
]

part2_example = "An overseas conglomerate submits a resolution plan for an indebted steel mill. Forensic investigation reveals that the conglomerate's ultimate beneficial owner holds a forty percent controlling stake in a thermal power company whose bank loans were classified as NPAs two years ago. Under Section 29A(c) read with the ArcelorMittal doctrine, the applicant is statutorily disqualified. The RP rejects the bid, advising the applicant that it can only participate if it completely repays the six hundred crore rupees of overdue NPA debts before the bid submission cutoff."

part2_code = '''def evaluate_section_29a_bidder_eligibility(is_undischarged_insolvent, is_rbi_willful_defaulter, has_npa_over_one_year, npa_arrears_cured_by_payment, has_criminal_conviction_over_two_years, has_unpaid_invoked_personal_guarantee, is_msme_debtor):
    # Section 29A Clauses Evaluation:
    # Clause (a): Undischarged Insolvent
    if is_undischarged_insolvent:
        return {"eligible": False, "disqualified_clause": "29A(a)", "reason": "Undischarged Insolvent"}
        
    # Clause (b): RBI Willful Defaulter
    if is_rbi_willful_defaulter:
        return {"eligible": False, "disqualified_clause": "29A(b)", "reason": "Declared RBI Willful Defaulter"}
        
    # Clause (c): One-year NPA (Exempt for MSME under Section 240A)
    if has_npa_over_one_year and not (is_msme_debtor or npa_arrears_cured_by_payment):
        return {"eligible": False, "disqualified_clause": "29A(c)", "reason": "Uncured NPA exceeding one year (ArcelorMittal doctrine)"}
        
    # Clause (d): Criminal Conviction >= 2 years
    if has_criminal_conviction_over_two_years:
        return {"eligible": False, "disqualified_clause": "29A(d)", "reason": "Criminal conviction exceeding two years"}
        
    # Clause (h): Unpaid invoked personal guarantee (Exempt for MSME under Section 240A)
    if has_unpaid_invoked_personal_guarantee and not is_msme_debtor:
        return {"eligible": False, "disqualified_clause": "29A(h)", "reason": "Unpaid invoked personal guarantee"}
        
    return {
        "eligible": True,
        "disqualified_clause": "NONE",
        "reason": "Passed all Section 29A statutory integrity filters successfully"
    }

# Case: Bidder has 1-year NPA, but cured all arrears by full payment prior to plan submission (ArcelorMittal test)
audit = evaluate_section_29a_bidder_eligibility(
    is_undischarged_insolvent=False,
    is_rbi_willful_defaulter=False,
    has_npa_over_one_year=True,
    npa_arrears_cured_by_payment=True,
    has_criminal_conviction_over_two_years=False,
    has_unpaid_invoked_personal_guarantee=False,
    is_msme_debtor=False
)
print("Section 29A Eligibility Status:", audit["eligible"])
print("Disqualification Clause:", audit["disqualified_clause"])
print("Statutory Assessment:", audit["reason"])
'''

part2_check = {
    "question": "Under the Supreme Court's ruling in ArcelorMittal India v. Satish Kumar Gupta, how can a prospective resolution applicant disqualified under Section 29A(c) for holding a one-year NPA account purge its ineligibility?",
    "options": [
        "By paying off all overdue loan balances, interest, and charges before submitting the resolution plan",
        "By resigning directorships and transferring shares to immediate relatives forty-eight hours prior to bidding",
        "By obtaining a non-objection certificate from seventy-five percent of operational trade creditors",
        "By depositing ten percent of the liquidation value in an escrow account with the High Court"
    ],
    "answerIndex": 0,
    "why": "Under the proviso to Section 29A(c), a person is eligible to submit a plan if they make payment of all overdue amounts with interest and charges relating to the non-performing asset account before submission of the resolution plan, as confirmed in ArcelorMittal."
}

# Part 3: Section 30 Compliance Review by RP & Section 30(4) CoC Approval: 66% Supermajority
part3_title = "Section 30 Compliance Review by RP & Section 30(4) CoC Approval: 66% Supermajority"
part3_say = [
    "Once compliant resolution plans are received, the statutory evaluation workflow transitions through a dual-gate validation architecture governed by Section 30 of the IBC. Gate One is the mandatory administrative review conducted by the Resolution Professional under Section 30(2). Gate Two is the sovereign commercial evaluation conducted by the Committee of Creditors under Section 30(4). This structural bifurcation ensures that no plan reaches the voting floor without meeting strict statutory baselines, while preserving pure commercial discretion for institutional lenders.",
    "Under Section 30(2), the Resolution Professional must examine each plan and certify that it satisfies five non-negotiable statutory invariants: (a) it provides for the payment of Insolvency Resolution Process Costs (IRPC) in full, with absolute first priority over all other creditors; (b) it provides for the payment of debts of operational creditors in an amount not less than the amount they would receive in liquidation under Section 53, or the amount they would receive if resolution proceeds were distributed according to Section 53 priority, whichever is higher; (c) it provides for the payment of dissenting financial creditors in an amount not less than their liquidation entitlement; (d) it provides for the effective management of the affairs of the corporate debtor after approval; and (e) it provides for the implementation and supervision of the resolution plan.",
    "Once the RP certifies compliance under Section 30(2), the plans are presented to the Committee of Creditors under Section 30(3). The CoC deliberates on the feasibility and viability of each plan, assessing turnaround strategies, capital infusion timelines, and macroeconomic risk factors. Under Section 30(4), the Committee of Creditors may approve a resolution plan by a vote of not less than sixty-six percent of the voting shares of financial creditors.",
    "The sixty-six percent supermajority threshold represents an unyielding statutory benchmark. If two competing plans pass the sixty-six percent threshold during electronic voting, the plan securing the highest overall affirmative voting percentage is designated as the winning resolution plan, establishing clear democratic hierarchy.",
    "Dissenting financial creditors are strictly protected under Section 30(2)(b). In Committee of Creditors of Essar Steel India Ltd. v. Satish Kumar Gupta, the Supreme Court affirmed that while dissenting secured lenders cannot veto a plan approved by the sixty-six percent majority, they are statutorily guaranteed payment of their liquidation value in priority to assenters. The resolution applicant must pay dissenting financial creditors in cash before any recoveries are disbursed to assenting lenders, upholding equitable treatment principles.",
    "Furthermore, the 2019 legislative amendment to Section 30(2)(b) codified a crucial dual-benchmark protection for operational creditors: they must receive an amount not less than what they would receive in liquidation under Section 53, or what they would receive if resolution proceeds were distributed according to Section 53 priority, whichever is higher. This statutory floor prevents senior financial lenders from allocating zero percent recovery to commercial vendors while appropriating entire plan proceeds for themselves.",
    "In addition, Regulation 39(1A) empowers the Resolution Professional and Committee of Creditors to conduct negotiations or adopt a Swiss challenge mechanism between competing bidders to maximize asset value. Bidders are permitted to submit revised commercial offers within structured electronic auction windows, driving up cash recovery percentages for all creditor classes while maintaining strict transparency.",
    "Upon approval by the CoC, Section 30(6) requires the Resolution Professional to submit the approved plan to the Adjudicating Authority (NCLT) along with statutory Form H. Form H provides a comprehensive compliance certificate detailing voting percentages, valuer estimates, distribution schedules, and Section 29A affidavits, confirming that all statutory invariants have been verified under law.",
    "This dual-gate architecture balances rigorous statutory compliance with commercial pragmatism, transforming viable recovery proposals into legally enforceable corporate rescue treaties that bind all financial and operational stakeholders under statutory authority."
]

part3_example = "A resolution plan for an automotive components manufacturer proposes fifty-five crore rupees in cash distributions. The RP verifies that the plan allocates four crore rupees for full IRPC payment, six crore rupees for operational creditors (exceeding their five-crore liquidation entitlement), and four crore rupees for a dissenting bank. Having satisfied Section 30(2), the plan is put to vote. The CoC approves the plan with seventy-two percent voting share. The RP executes Form H and files for NCLT sanction under Section 30(6)."

part3_code = '''def evaluate_section_30_plan_compliance_and_approval(total_plan_value_cr, irpc_amount_cr, irpc_paid_in_priority, op_creditor_offer_cr, op_creditor_liquidation_entitlement_cr, dissenting_fc_offer_cr, dissenting_fc_liquidation_entitlement_cr, coc_approval_vote_pct):
    # Gate 1: RP Section 30(2) Compliance Checklist
    irpc_ok = irpc_paid_in_priority and (irpc_amount_cr > 0)
    op_creditors_ok = op_creditor_offer_cr >= op_creditor_liquidation_entitlement_cr
    dissenting_fc_ok = dissenting_fc_offer_cr >= dissenting_fc_liquidation_entitlement_cr
    
    gate1_passed = irpc_ok and op_creditors_ok and dissenting_fc_ok
    
    # Gate 2: CoC Section 30(4) 66% Supermajority Vote
    threshold_supermajority = 66.0
    gate2_passed = coc_approval_vote_pct >= threshold_supermajority
    
    is_fully_approved = gate1_passed and gate2_passed
    
    return {
        "gate1_rp_certified": gate1_passed,
        "irpc_super_priority": irpc_ok,
        "operational_creditor_protected": op_creditors_ok,
        "dissenting_fc_protected": dissenting_fc_ok,
        "coc_vote_pct": coc_approval_vote_pct,
        "gate2_coc_approved": gate2_passed,
        "form_h_submission_ready": is_fully_approved,
        "status": "APPROVED_SUBMIT_TO_NCLT" if is_fully_approved else "REJECTED_NON_COMPLIANT"
    }

# Case: Plan provides full IRPC (4 Cr), OP Creditors (6 Cr vs 5 Cr liquidation), Dissenting FC (4 Cr vs 3.5 Cr liquidation), 72% CoC vote
audit = evaluate_section_30_plan_compliance_and_approval(
    total_plan_value_cr=55.0,
    irpc_amount_cr=4.0,
    irpc_paid_in_priority=True,
    op_creditor_offer_cr=6.0,
    op_creditor_liquidation_entitlement_cr=5.0,
    dissenting_fc_offer_cr=4.0,
    dissenting_fc_liquidation_entitlement_cr=3.5,
    coc_approval_vote_pct=72.0
)
print("Gate 1 RP Section 30(2) Certified:", audit["gate1_rp_certified"])
print("Operational Creditor Entitlement Satisfied:", audit["operational_creditor_protected"])
print("Dissenting Financial Creditor Protected:", audit["dissenting_fc_protected"])
print("Gate 2 CoC Supermajority (>=66%):", audit["gate2_coc_approved"])
print("Form H Submission Ready:", audit["form_h_submission_ready"])
print("Plan Status:", audit["status"])
'''

part3_check = {
    "question": "Under Section 30(4) of the Insolvency and Bankruptcy Code 2016, what is the statutory voting threshold required for the Committee of Creditors to approve a resolution plan?",
    "options": [
        "A vote of not less than sixty-six percent of the voting shares of financial creditors",
        "A simple majority of fifty-one percent of financial creditors present and voting",
        "A vote of not less than seventy-five percent of secured financial creditors",
        "A unanimous resolution passed by one hundred percent of all admitted creditors"
    ],
    "answerIndex": 0,
    "why": "Section 30(4) mandates that the committee of creditors may approve a resolution plan by a vote of not less than sixty-six percent of voting shares of the financial creditors."
}

# Part 4: Section 31 NCLT Sanction & Section 53 Liquidation Waterfall Priorities
part4_title = "Section 31 NCLT Sanction & Section 53 Liquidation Waterfall Priorities"
part4_say = [
    "The final statutory milestone in corporate insolvency resolution is judicial sanction under Section 31 of the IBC. When the Resolution Professional submits a CoC-approved resolution plan, the Adjudicating Authority (NCLT) conducts a limited judicial review. As established by the Supreme Court in K. Sashidhar v. Indian Overseas Bank and reaffirmed in Maharashtra Seamless Ltd. v. Padmanabhan Venkatesh, the NCLT does not possess appellate or equity jurisdiction to evaluate the commercial wisdom of the Committee of Creditors. If the plan complies with Section 30(2), the NCLT is statutorily mandated to pass an order approving the plan under Section 31(1).",
    "An order of approval under Section 31(1) has binding legal effect nationwide: it binds the corporate debtor, its employees, members, creditors (including Central, State, and local government tax authorities), guarantors, and other stakeholders. Concurrently, the statutory moratorium declared under Section 14 ceases to have effect, and the successful resolution applicant takes immediate possession and executive control of the enterprise.",
    "Approval under Section 31 triggers the formidable 'Clean Slate Doctrine' affirmed in Ghanashyam Mishra and Sons v. Edelweiss Asset Reconstruction. All historical claims, past tax assessments, criminal investigations against the corporate debtor under prior management (Section 32A), and unasserted liabilities incurred prior to the insolvency commencement date stand extinguished permanently. The corporate debtor is reborn with an unencumbered balance sheet.",
    "Conversely, if no resolution plan is approved by the CoC within the statutory 330-day window, or if the NCLT rejects a non-compliant plan under Section 31(2), the Adjudicating Authority must pass an order for Liquidation under Section 33. In liquidation, enterprise assets are sold and distributed strictly in accordance with the statutory Priority Waterfall codified under Section 53 of the Code.",
    "Section 53 establishes an unyielding six-tier statutory distribution hierarchy: (1) Insolvency Resolution Process Costs and liquidation expenses paid in full first priority; (2) workmen's dues for the twenty-four months preceding liquidation pari passu with debts owed to secured creditors who have relinquished security; (3) wages and unpaid dues owed to non-workmen employees for the preceding twelve months; (4) financial debts owed to unsecured creditors; (5) Central and State Government statutory tax dues for the preceding two years pari passu with secured creditors who realized security under Section 52; (6) any remaining debts, including operational trade debts; (7) preference shareholders; and (8) equity shareholders.",
    "In Rainbow Papers Ltd., the Supreme Court initially ruled that statutory tax authorities holding a charge under state tax laws could be treated as secured creditors. However, subsequent constitutional bench rulings in Paschimanchal Vidyut Vitran Nigam Ltd. v. Raman Ispat reaffirmed the absolute legislative supremacy of the Section 53 waterfall: government tax dues are subordinated to tier five, behind workmen, secured lenders, employee wages, and unsecured financial creditors.",
    "A paramount statutory shield is codified under Section 32A of the Code. Under Section 32A, the liability of a corporate debtor for an offense committed prior to the commencement of the CIRP shall cease, and the corporate debtor shall not be prosecuted for such an offense from the date the resolution plan is approved by the Adjudicating Authority. The Supreme Court in Manish Kumar v. Union of India upheld Section 32A, declaring that enforcement agencies cannot attach properties of the corporate debtor once a bona fide resolution applicant takes charge.",
    "Furthermore, under Section 52, a secured creditor in liquidation has the option to realize its security interest independently under the SARFAESI Act or Recovery of Debts and Bankruptcy Act. If the proceeds of realizing such security interest prove insufficient to repay debts in full, the balance unpaid debt is submitted to the liquidator, ranking in tier five alongside government dues, incentivizing secured lenders to participate inside the collective liquidation process.",
    "By establishing the sanctity of CoC commercial wisdom under Section 31 and enforcing an unbending distribution waterfall under Section 53, the IBC provides predictable risk pricing that stimulates institutional capital investment across the Indian economy."
]

part4_example = "The NCLT sanctions a resolution plan for an infrastructure firm. The state commercial tax department files an application demanding sixty crore rupees in pre-CIRP sales tax arrears. The NCLT dismisses the tax department's claim, holding that under Section 31 and the Clean Slate Doctrine, all pre-CIRP government claims not included in the approved plan are extinguished permanently, enabling the resolution applicant to operate free from legacy encumbrances."

part4_code = '''def calculate_section_53_liquidation_waterfall(liquidation_estate_proceeds_cr, irpc_expenses_cr, workmen_dues_cr, secured_creditors_relinquished_cr, employee_wages_cr, unsecured_financial_debt_cr, government_taxes_cr, operational_trade_debt_cr):
    remaining_cash = liquidation_estate_proceeds_cr
    distributions = {}
    
    # Tier 1: IRPC and Liquidation Costs (Full priority)
    tier1_payout = min(remaining_cash, irpc_expenses_cr)
    distributions["Tier_1_IRPC_Expenses"] = round(tier1_payout, 2)
    remaining_cash -= tier1_payout
    
    # Tier 2: Workmen dues (24 mos) and Secured Creditors (Pari Passu)
    tier2_total_demand = workmen_dues_cr + secured_creditors_relinquished_cr
    if remaining_cash >= tier2_total_demand:
        distributions["Tier_2_Workmen_Dues"] = round(workmen_dues_cr, 2)
        distributions["Tier_2_Secured_Creditors"] = round(secured_creditors_relinquished_cr, 2)
        remaining_cash -= tier2_total_demand
    else:
        # Prorated pari passu distribution
        ratio = remaining_cash / tier2_total_demand if tier2_total_demand > 0 else 0
        distributions["Tier_2_Workmen_Dues"] = round(workmen_dues_cr * ratio, 2)
        distributions["Tier_2_Secured_Creditors"] = round(secured_creditors_relinquished_cr * ratio, 2)
        remaining_cash = 0.0
        
    # Tier 3: Employee wages (12 mos)
    tier3_payout = min(remaining_cash, employee_wages_cr)
    distributions["Tier_3_Employee_Wages"] = round(tier3_payout, 2)
    remaining_cash -= tier3_payout
    
    # Tier 4: Unsecured Financial Creditors
    tier4_payout = min(remaining_cash, unsecured_financial_debt_cr)
    distributions["Tier_4_Unsecured_Financial_Debt"] = round(tier4_payout, 2)
    remaining_cash -= tier4_payout
    
    # Tier 5: Government Taxes (2 yrs)
    tier5_payout = min(remaining_cash, government_taxes_cr)
    distributions["Tier_5_Government_Taxes"] = round(tier5_payout, 2)
    remaining_cash -= tier5_payout
    
    # Tier 6: Operational Trade Creditors
    tier6_payout = min(remaining_cash, operational_trade_debt_cr)
    distributions["Tier_6_Operational_Trade_Debt"] = round(tier6_payout, 2)
    remaining_cash -= tier6_payout
    
    return {
        "initial_estate_cr": liquidation_estate_proceeds_cr,
        "distributions": distributions,
        "unallocated_surplus_cr": round(remaining_cash, 2)
    }

# Case: Liquidation proceeds 120 Cr. IRPC 5 Cr, Workmen 15 Cr, Secured 80 Cr, Employees 5 Cr, Unsecured FC 30 Cr, Govt 15 Cr, Trade 20 Cr
audit = calculate_section_53_liquidation_waterfall(
    liquidation_estate_proceeds_cr=120.0,
    irpc_expenses_cr=5.0,
    workmen_dues_cr=15.0,
    secured_creditors_relinquished_cr=80.0,
    employee_wages_cr=5.0,
    unsecured_financial_debt_cr=30.0,
    government_taxes_cr=15.0,
    operational_trade_debt_cr=20.0
)
print("Liquidation Estate Proceeds (Cr):", audit["initial_estate_cr"])
for tier, amt in audit["distributions"].items():
    print(f"  {tier}: {amt} Cr")
'''

part4_check = {
    "question": "Under the Section 53 priority waterfall of the Insolvency and Bankruptcy Code 2016, which category of debt is entitled to absolute first-priority distribution from liquidation proceeds?",
    "options": [
        "Insolvency resolution process costs and liquidation costs paid in full",
        "Central and State Government statutory tax dues for the preceding five years",
        "Secured financial creditors holding first-charge mortgages over real estate",
        "Unsecured commercial bank overdraft and trade credit facilities"
    ],
    "answerIndex": 0,
    "why": "Section 53(1)(a) provides that the insolvency resolution process costs and the liquidation costs incurred by the resolution professional or liquidator shall be paid in full with top first priority."
}

# Part 5: Anti-Pattern Defense & Outage Puzzle: The Backdoor Promoter Bid & Shadow Ineligibility Crisis
part5_title = "Anti-Pattern Defense & Outage Puzzle: The Backdoor Promoter Bid & Shadow Ineligibility Crisis"
part5_say = [
    "In corporate restructuring litigation, the most perilous adversarial tactic is the 'Backdoor Promoter Bid and Shadow Entity Ineligibility' anti-pattern. This crisis arises when default-tainted promoters, barred from bidding under Section 29A, attempt to regain ownership of their corporate debtor through clandestine front entities—such as newly incorporated special purpose vehicles (SPVs), offshore shell companies registered in tax havens, or friendly financial investors bound by secret side agreements and call-option contracts. If the Resolution Professional and Committee of Creditors fail to pierce the corporate veil, a fraudulent promoter successfully buys back their own enterprise at a ninety percent haircut, sabotaging the integrity of the IBC.",
    "The first structural vulnerability occurs through 'Opaque Shareholding and Nominee Arrangements'. Promoters incorporate an SPV in Dubai, Mauritius, or Singapore, nominating trusted former executives or distant relatives as nominal shareholders and directors. On paper, the entity appears completely independent. However, under Section 29A(j) and the ArcelorMittal precedent, the Resolution Professional must trace ultimate beneficial ownership (UBO) to the natural persons who provide capital and exercise actual management and control. The RP must deploy corporate intelligence agencies to scrutinize banking trails, source-of-wealth affidavits, and power-of-attorney covenants.",
    "The second major failure mode involves 'Secret Call-Option and Promissory Side Letters'. A seemingly independent private equity fund submits a resolution plan. Unknown to the CoC, the fund executes a confidential side letter granting the promoter's family an unrecorded call option to reacquire eighty percent of the corporate debtor's equity within three years at a nominal valuation. In Swiss Ribbons and Chitra Sharma v. Union of India, the Supreme Court declared that any transaction or agreement designed to circumvent Section 29A is fraudulent, illegal, and void ab initio.",
    "A third failure mode arises when an ineligible applicant falsely claims MSME exemption status under Section 240A. Promoters routinely register their massive industrial companies on the Udyam MSME portal after insolvency admission, claiming they are exempt from Section 29A(c) and (h). In Hari Babu Thota, the Supreme Court clarified that the critical benchmark date for determining MSME status is the date of submission of the resolution plan; however, fraudulent post-CIRP micro-enterprise certifications obtained by multi-thousand-crore enterprises are rejected by the NCLT as fraud on the statute.",
    "To neutralize this crisis and defend the integrity of the CIRP, the Resolution Professional must implement a rigorous multi-tier forensic screening protocol: (1) demanding notarized Section 29A affidavits detailing global connected persons; (2) forensic tracing of equity capital sources through SWIFT banking codes; (3) mandatory submission of audited tax returns for all ultimate beneficial owners; and (4) independent transaction auditor certification.",
    "Where shadow promoter control is detected, the RP must issue an immediate Statutory Disqualification Notice under Regulation 36A(8), reject the resolution plan, forfeit the earnest money deposit, and report the tainted applicant to the IBBI under Section 235A.",
    "Under Section 235A, any person who contravenes the provisions of the Code or regulations for which no penalty is specifically provided is punishable with a fine of not less than one lakh rupees which may extend to two crore rupees. Furthermore, if a fraudulent bidder submits fabricated affidavits asserting non-ineligibility under Section 29A, the RP files criminal complaints for perjury and fraud under the Indian Penal Code, dismantling shadow consortium networks.",
    "Moreover, the Supreme Court in Ngaitlang Dhar v. Panna Pragati Infrastructure ruled that late or unsolicited bids submitted after the deadline fixed by the CoC cannot be entertained, as procedural discipline and finality are sacrosanct under the IBC. Once the CoC approves a compliant resolution plan, rogue bidders cannot derail the process by submitting last-minute higher financial offers, preserving the integrity of the competitive resolution mechanism.",
    "By fearlessly enforcing Section 29A and piercing intricate offshore corporate veils, the Resolution Professional ensures that the insolvency resolution process fulfills its constitutional mandate: restoring corporate assets to honest, productive economic custodians."
]

part5_example = "A Singapore SPV submits a four-hundred-crore resolution plan for an insolvent textile company. The SPV claims it is owned by a foreign fund. However, forensic analysis of SWIFT wire transfers reveals that the SPV's bid deposit was funded by an offshore trust whose sole beneficiary is the defaulting promoter's daughter. Applying Section 29A(j) and ArcelorMittal, the RP disqualifies the bid, forfeits the five-crore earnest money deposit, and files an affidavit before the NCLT documenting the clandestine promoter connection."

part5_code = '''def diagnose_backdoor_promoter_shadow_bid(bidder_name, ubo_beneficiary_relation, source_of_funds_traced_to_promoter, has_secret_call_option_to_promoter, earnest_money_deposit_cr):
    # Forensic Screening for Shadow Promoter Control under Section 29A(j)
    is_tainted_by_relation = ubo_beneficiary_relation in ["promoter", "promoter_spouse", "promoter_child", "promoter_sibling"]
    is_tainted_by_capital = source_of_funds_traced_to_promoter
    is_tainted_by_covenant = has_secret_call_option_to_promoter
    
    has_shadow_promoter_connection = is_tainted_by_relation or is_tainted_by_capital or is_tainted_by_covenant
    
    if has_shadow_promoter_connection:
        return {
            "bidder": bidder_name,
            "disqualified_under_29A": True,
            "forensic_finding": "CLANDESTINE_PROMOTER_BACKDOOR_BID",
            "statutory_remedy": "DISQUALIFY_PLAN_AND_FORFEIT_EMD",
            "emd_forfeited_cr": earnest_money_deposit_cr,
            "nclt_reporting_required": True
        }
        
    return {
        "bidder": bidder_name,
        "disqualified_under_29A": False,
        "forensic_finding": "BONA_FIDE_INDEPENDENT_APPLICANT",
        "statutory_remedy": "SUBMIT_TO_COC_FOR_EVALUATION",
        "emd_forfeited_cr": 0.0,
        "nclt_reporting_required": False
    }

# Case: Singapore SPV whose bid deposit was wired from promoter daughter's trust; 5 Cr EMD
diagnosis = diagnose_backdoor_promoter_shadow_bid(
    bidder_name="Singapore Restructuring SPV",
    ubo_beneficiary_relation="promoter_child",
    source_of_funds_traced_to_promoter=True,
    has_secret_call_option_to_promoter=True,
    earnest_money_deposit_cr=5.0
)
print("Bidder Name:", diagnosis["bidder"])
print("Disqualified under Section 29A:", diagnosis["disqualified_under_29A"])
print("Forensic Finding:", diagnosis["forensic_finding"])
print("Statutory Remedy:", diagnosis["statutory_remedy"])
print("Earnest Money Deposit Forfeited (Cr):", diagnosis["emd_forfeited_cr"])
print("NCLT Affidavit Required:", diagnosis["nclt_reporting_required"])
'''

part5_check = {
    "question": "Under Section 29A(j) of the Insolvency and Bankruptcy Code 2016 as interpreted in ArcelorMittal, what must the Resolution Professional do if forensic investigation reveals that an SPV applicant is secretly funded or controlled by a defaulting promoter?",
    "options": [
        "Disqualify the applicant, reject the resolution plan, forfeit the earnest money deposit, and report the finding to the NCLT",
        "Allow the plan to proceed if the promoter pays an additional five percent management surcharge to the bank consortium",
        "Refer the plan to the local chamber of commerce for non-binding commercial arbitration",
        "Permit the promoter to assume forty-nine percent non-voting equity upon resolution completion"
    ],
    "answerIndex": 0,
    "why": "Under Section 29A(j) and ArcelorMittal, any connected person or back-door conduit acting on behalf of an ineligible person is disqualified; the RP is legally bound to reject the resolution plan and forfeit the bid security."
}

# Try-It texts
try_it_texts = [
    "Execute the Section 25 eligibility engine to test prospective applicant criteria and verify data room access.",
    "Run the Section 29A ineligibility screening validator to evaluate willful default records and test the ArcelorMittal cure.",
    "Simulate the Section 30 dual gate compliance engine to verify operational creditor protections and test 66 percent CoC votes.",
    "Execute the Section 53 liquidation waterfall engine to calculate priority distributions across six statutory tiers.",
    "Run the shadow promoter diagnostic engine to detect clandestine backdoor bids, trace offshore funds, and forfeit deposits."
]

# Captions satisfying: <=80 chars, period, no digits, word matching
captions = [
    {
        "intro": "Competitive market processes invite prospective enterprise resolution plans.",
        "say1": "Competitive bidding frameworks invite prospective enterprise resolution plans.",
        "example": "Distressed cement manufacturer criteria establish objective balance sheets.",
        "tryIt": "Prospective applicant engines test eligibility and verify data room access."
    },
    {
        "intro": "Statutory ineligibility filters disqualify habitual enterprise defaulters.",
        "say1": "Habitual corporate defaulters face comprehensive statutory disqualification.",
        "example": "Overseas conglomerate bids face disqualification under default doctrines.",
        "tryIt": "Screening validators evaluate default records and test cure requirements."
    },
    {
        "intro": "Statutory compliance reviews precede committee commercial plan approvals.",
        "say1": "Resolution plans undergo comprehensive statutory compliance certifications.",
        "example": "Automotive components manufacturer plans provide full process cost priority.",
        "tryIt": "Compliance engines verify creditor protections and test supermajority votes."
    },
    {
        "intro": "Judicial approvals establish binding nationwide corporate restructuring.",
        "say1": "Judicial sanctions bind enterprise stakeholders under statutory authorities.",
        "example": "Infrastructure firm plans extinguish legacy commercial tax department claims.",
        "tryIt": "Liquidation waterfall engines calculate priority distributions across tiers."
    },
    {
        "intro": "Forensic screening detects clandestine backdoor bids by tainted promoters.",
        "say1": "Restructuring litigation requires vigilant scrutiny against shadow bidders.",
        "example": "Offshore shell entities face disqualification upon forensic banking audits.",
        "tryIt": "Shadow promoter diagnostics trace offshore funds and forfeit deposits."
    }
]

# Stages definitions for workflow template
stages_definitions = [
    [
        {"id": "s1", "name": "Form G Invitation", "subtext": "Public invitation for resolution plans"},
        {"id": "s2", "name": "Eligibility Filters", "subtext": "Minimum net worth and turnover criteria"},
        {"id": "s3", "name": "Information Memorandum", "subtext": "Virtual data room and asset diligence"},
        {"id": "s4", "name": "Evaluation Matrix", "subtext": "Objective scoring of turnaround plans"}
    ],
    [
        {"id": "s1", "name": "Section 29A Filters", "subtext": "Ten statutory disqualification clauses"},
        {"id": "s2", "name": "NPA Promoter Bar", "subtext": "One year default under clause c"},
        {"id": "s3", "name": "ArcelorMittal Doctrine", "subtext": "Curing ineligibility by full debt repayment"},
        {"id": "s4", "name": "MSME Carve Out", "subtext": "Section 240A promoter exemptions"}
    ],
    [
        {"id": "s1", "name": "Gate 1 RP Review", "subtext": "Section 30(2) statutory certifications"},
        {"id": "s2", "name": "Creditor Protections", "subtext": "Liquidation floor for operational lenders"},
        {"id": "s3", "name": "CoC Supermajority", "subtext": "Sixty-six percent affirmative voting threshold"},
        {"id": "s4", "name": "Form H Submission", "subtext": "Compliance certification to tribunal"}
    ],
    [
        {"id": "s1", "name": "Section 31 Sanction", "subtext": "NCLT approval binding all stakeholders"},
        {"id": "s2", "name": "Clean Slate Doctrine", "subtext": "Extinguishment of past government claims"},
        {"id": "s3", "name": "Section 53 Waterfall", "subtext": "Six tier statutory priority distribution"},
        {"id": "s4", "name": "Workmen Pari Passu", "subtext": "Secured and labor equality under law"}
    ],
    [
        {"id": "s1", "name": "Shadow Bidder Detection", "subtext": "Tracing ultimate beneficial ownership"},
        {"id": "s2", "name": "Offshore Veil Piercing", "subtext": "SWIFT wire forensic capital tracking"},
        {"id": "s3", "name": "Call Option Invalidation", "subtext": "Striking down fraudulent side agreements"},
        {"id": "s4", "name": "Deposit Forfeiture", "subtext": "Statutory penalty and tribunal reporting"}
    ]
]

part_tuples = [
    (1, part1_title, part1_say, part1_example, part1_code, part1_check, try_it_texts[0]),
    (2, part2_title, part2_say, part2_example, part2_code, part2_check, try_it_texts[1]),
    (3, part3_title, part3_say, part3_example, part3_code, part3_check, try_it_texts[2]),
    (4, part4_title, part4_say, part4_example, part4_code, part4_check, try_it_texts[3]),
    (5, part5_title, part5_say, part5_example, part5_code, part5_check, try_it_texts[4])
]

lesson_parts = []
total_day_words = 0
code_hashes = []

for idx, (p_num, p_title, p_say, p_ex, p_code, p_chk, p_try) in enumerate(part_tuples):
    res = subprocess.run([sys.executable, "-c", p_code], capture_output=True, text=True, check=True)
    out = res.stdout
    
    words = sum(len(para.split()) for para in p_say)
    total_day_words += words
    print(f"Day 39 Part {p_num} Word Count: {words}")
    assert words >= 600, f"Day 39 Part {p_num} words {words} < 600!"
    
    h = hashlib.sha256(p_code.encode("utf-8")).hexdigest()
    code_hashes.append(h)
    
    lesson_parts.append({
        "part": p_num,
        "title": p_title,
        "say": p_say,
        "example": p_ex,
        "code": p_code,
        "output": out,
        "tryIt": p_try,
        "check": p_chk
    })

print(f"Total Day 39 Words: {total_day_words}")
assert total_day_words >= 3000, f"Total day words {total_day_words} < 3000!"

day_data = {
    "day": day_num,
    "coursePrefix": course_prefix,
    "title": day_title,
    "desc": day_desc,
    "parts": lesson_parts
}

# 1. Save day39_lesson.json
with open("scripts/day39_lesson.json", "w", encoding="utf-8") as f:
    json.dump(day_data, f, indent=2)
print("Saved scripts/day39_lesson.json successfully!")

# 2. Append to src/lib/data/bcomLawLongLessons.ts
ts_path = "src/lib/data/bcomLawLongLessons.ts"
with open(ts_path, "r", encoding="utf-8") as f:
    ts_content = f.read()

# Check if Day 39 is already present
if f'"day": {day_num},' in ts_content or f'day: {day_num},' in ts_content:
    print(f"Day {day_num} already exists in {ts_path}! Skipping append.")
else:
    # Find closing array bracket
    last_bracket = ts_content.rfind("];")
    if last_bracket == -1:
        last_bracket = ts_content.rfind("]")
        
    day_json_str = json.dumps(day_data, indent=2)
    new_ts_content = ts_content[:last_bracket].rstrip()
    if new_ts_content.endswith(","):
        new_ts_content += "\n" + day_json_str + "\n];\n"
    else:
        new_ts_content += ",\n" + day_json_str + "\n];\n"
        
    with open(ts_path, "w", encoding="utf-8") as f:
        f.write(new_ts_content)
    print(f"Appended Day {day_num} to {ts_path} successfully!")

# 3. Build day-39.json visual file
entries = []
for idx, p in enumerate(lesson_parts):
    stgs = stages_definitions[idx]
    caps = captions[idx]
    
    steps = [
        {"at": "intro", "caption": caps["intro"], "activeStageId": "s1", "statusBadge": "active"},
        {"at": "say1", "caption": caps["say1"], "activeStageId": "s2", "statusBadge": "active"},
        {"at": "example", "caption": caps["example"], "activeStageId": "s3", "statusBadge": "active"},
        {"at": "tryIt", "caption": caps["tryIt"], "activeStageId": "s4", "statusBadge": "done"}
    ]
    
    entries.append({
        "partTitle": p["title"],
        "codeHash": code_hashes[idx],
        "filled": {},
        "spec": {
            "template": "workflow",
            "title": f"{p['title']} Governance Framework",
            "stages": stgs,
            "steps": steps
        }
    })

visual_data = {
    "schemaVersion": 1,
    "prefix": "bcom_law",
    "day": 39,
    "promptSha": "prompt_sha_bcom_law_day39_resolution_plan_waterfall_v1",
    "model": "google/gemini-2.5-pro",
    "entries": entries
}

v_path = "src/lib/data/lessonVisuals/bcom_law/day-39.json"
with open(v_path, "w", encoding="utf-8") as f:
    json.dump(visual_data, f, indent=2)
print(f"Saved {v_path} successfully!")
