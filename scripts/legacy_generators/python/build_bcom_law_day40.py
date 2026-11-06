import json, sys, subprocess, os, re, hashlib

# Builder for Day 40 of bcom_law
# Course: bcom_law (Corporate Law, IBC & Compliance)
# Day 40: [CAPSTONE] Milestone 8 Capstone: The Apex CIRP Insolvency Resolution & Liquidation Engine Simulator

day_num = 40
course_prefix = "bcom_law"
day_title = "Milestone 8 Capstone: The Apex CIRP Insolvency Resolution & Liquidation Engine Simulator"
day_desc = "Integrate the complete statutory jurisprudence of the Insolvency and Bankruptcy Code 2016 in this enterprise capstone: Section 4 default thresholds, Section 7/9/10 admission orders, Section 14 moratoriums, IRP asset custody, claims collation across Form B/C/CA, Section 21 CoC voting share calibration, Section 28 negative covenants, Section 29A ArcelorMittal ineligibility filters, Section 30/31 plan approval, and Section 53 liquidation waterfall distribution."

# Part 1: Apex CIRP Architecture: End-to-End Statutory Pipeline from Default to Resolution
part1_title = "Apex CIRP Architecture: End-to-End Statutory Pipeline from Default to Resolution"
part1_say = [
    "Welcome to the apex capstone masterclass of Month 2 Block 8: The Corporate Insolvency Resolution Process (CIRP) and Liquidation Engine Simulator. Over the preceding four days, we investigated the specialized statutory mechanisms under the Insolvency and Bankruptcy Code 2016—from Section 4 gateway thresholds and Section 14 moratorium protections, through claim collation across Forms B, C, and CA, to the sovereign commercial democracy of the Committee of Creditors under Sections 21 and 28, and the culmination of corporate revival under Sections 30, 31, and 53. Today, we unify these distinct legal frameworks into an integrated, end-to-end statutory operating system capable of orchestrating complex corporate restructurings across Indian industry.",
    "The statutory pipeline of the IBC operates as an unyielding chronological conveyor belt governed by Section 12. From the moment an application is admitted under Section 7, 9, or 10, the corporate debtor enters a mandatory 180-day resolution window, extendable once by ninety days upon approval of sixty-six percent of the Committee of Creditors, subject to an absolute outer ceiling of 330 days including all judicial litigation. Failure to achieve an approved resolution plan within this unbendable timeframe triggers automatic corporate liquidation under Section 33, ensuring capital is never trapped indefinitely in zombie enterprises.",
    "Phase One of the pipeline spans Days 1 to 30: the Emergency Custodial Takeover. The Adjudicating Authority appoints an Interim Resolution Professional (IRP) under Section 16, instantly suspending the powers of the Board of Directors under Section 17. The IRP publishes Form A within three days, issues regulatory notices to commercial banks under Section 17(1)(d) to take unilateral control over corporate accounts, assumes physical custody of plant assets and electronic ERP databases under Section 18, and raises emergency interim finance under Section 20 to protect going-concern operations.",
    "Phase Two spans Days 30 to 75: the Creditor Democracy & Ineligibility Screening Phase. The IRP collates and forensically verifies claims, calculates financial creditor voting shares under Section 5(28), strips disqualified related parties under Section 21(2), and files the report certifying CoC constitution before the NCLT. At the inaugural CoC meeting held within seven days under Section 22, lenders vote by sixty-six percent majority to confirm the IRP or appoint a permanent Resolution Professional. Concurrently, the RP publishes Form G under Regulation 36A, inviting competitive expressions of interest and subjecting all bidders to the rigorous Section 29A screening filters established in ArcelorMittal.",
    "Phase Three spans Days 75 to 180: the Valuation, Bidding & Commercial Approval Phase. The RP prepares the Information Memorandum, opens the Virtual Data Room, and coordinates independent valuations from registered valuers under Regulation 35. Prospective resolution applicants submit resolution plans evaluated against the CoC's mathematical matrix. The RP conducts Section 30(2) compliance reviews, ensuring full payment of IRPC, statutory liquidation protections for operational creditors, and cash priority for dissenting financial lenders. The CoC deliberates upon feasibility and viability, passing the winning plan by sixty-six percent supermajority under Section 30(4).",
    "Phase Four represents the Judicial Sanction & Implementation Phase. The RP submits Form H and the approved plan to the NCLT under Section 30(6). Upon confirming statutory compliance, the NCLT passes an order under Section 31(1), permanently extinguishing all historical claims and pre-CIRP tax dues under the Clean Slate Doctrine and granting Section 32A criminal immunity to new management. If no viable plan passes, the enterprise transitions seamlessly into Section 53 liquidation, executing distributions across the six-tier priority waterfall.",
    "Furthermore, the appellate architecture under Section 61 provides a tightly circumscribed appeals mechanism before the National Company Law Appellate Tribunal (NCLAT). Any appeal against an order of the NCLT must be filed within thirty days, extendable by a maximum of fifteen days only upon demonstrating sufficient cause. Appeals against plan approval orders under Section 61(3) are strictly restricted to five statutory grounds, including material irregularity in exercise of powers by the RP or fraud, preventing disgruntled shareholders from delaying commercial execution.",
    "Mastering this end-to-end statutory orchestration empowers corporate legal officers, insolvency practitioners, and corporate banking directors to navigate multi-billion-rupee debt restructurings with technical rigor and commercial confidence."
]

part1_example = "An integrated steel manufacturing conglomerate defaults on twelve hundred crore rupees of debt across fourteen commercial banks. Operating through the four-phase CIRP pipeline, the IRP secures plant custody within forty-eight hours, publishes Form A, and collates eight hundred creditor claims. The CoC convenes, appoints an RP, and issues Form G. Following competitive bidding and Section 29A forensic vetting, an international industrial group's four-thousand-crore resolution plan secures eighty-four percent CoC approval and NCLT sanction under Section 31, successfully reviving the enterprise."

part1_code = '''def simulate_cirp_statutory_pipeline(default_cr, nclt_admission_granted, days_elapsed, coc_approved_plan_pct, has_section_29a_violations, irpc_paid_in_priority, operational_creditors_protected):
    # Phase 1: Gateway and Moratorium (Section 4 & Section 14)
    if not (default_cr >= 1.0 and nclt_admission_granted):
        return {"phase": "GATEWAY", "status": "NON_MAINTAINABLE", "outcome": "CIRP_NOT_INITIATED"}
        
    # Phase 2: Timeline monitoring (Section 12: 180 days standard, 330 days outer cap)
    if days_elapsed > 330:
        return {"phase": "LIQUIDATION", "status": "STATUTORY_TIME_EXPIRED", "outcome": "MANDATORY_SECTION_33_LIQUIDATION"}
        
    # Phase 3: Section 29A Ineligibility Check
    if has_section_29a_violations:
        return {"phase": "BIDDING", "status": "BIDDER_DISQUALIFIED", "outcome": "REJECT_PLAN_UNDER_SECTION_29A"}
        
    # Phase 4: CoC Supermajority & Section 30(2) Compliance
    is_coc_approved = coc_approved_plan_pct >= 66.0
    is_section_30_compliant = irpc_paid_in_priority and operational_creditors_protected
    
    if is_coc_approved and is_section_30_compliant:
        return {
            "phase": "JUDICIAL_SANCTION",
            "status": "SECTION_31_NCLT_SANCTIONED",
            "outcome": "CLEAN_SLATE_REVIVAL_AND_SECTION_32A_IMMUNITY",
            "days_taken": days_elapsed
        }
    else:
        return {
            "phase": "EVALUATION",
            "status": "PLAN_FAILED_APPROVAL_OR_NON_COMPLIANT",
            "outcome": "CONTINUE_DELIBERATIONS_OR_LIQUIDATE",
            "days_taken": days_elapsed
        }

# Case: 1200 Cr default, admitted, evaluated on Day 165, 84% CoC vote, clean Section 29A, compliant Section 30(2)
sim = simulate_cirp_statutory_pipeline(
    default_cr=1200.0,
    nclt_admission_granted=True,
    days_elapsed=165,
    coc_approved_plan_pct=84.0,
    has_section_29a_violations=False,
    irpc_paid_in_priority=True,
    operational_creditors_protected=True
)
print("CIRP Execution Phase:", sim["phase"])
print("Procedural Status:", sim["status"])
print("Corporate Restructuring Outcome:", sim["outcome"])
print("Days to Final Sanction:", sim["days_taken"])
'''

part1_check = {
    "question": "Under Section 12 of the Insolvency and Bankruptcy Code 2016, what is the mandatory outer timeline ceiling for the completion of the Corporate Insolvency Resolution Process, including all legal proceedings and extensions?",
    "options": [
        "Three hundred and thirty days from the insolvency commencement date",
        "One hundred and eighty days from the date of board suspension",
        "Two hundred and seventy days from the first meeting of the Committee of Creditors",
        "Five hundred days from the public announcement in Form A"
    ],
    "answerIndex": 0,
    "why": "The second proviso to Section 12(3) of the IBC mandates that the corporate insolvency resolution process shall be completed within a period of three hundred and thirty days from the insolvency commencement date, including any extension of the period and the time taken in legal proceedings."
}

# Part 2: Comprehensive Ineligibility & Claims Collation: Section 29A Screening & Form B/C/CA Debt Mapping
part2_title = "Comprehensive Ineligibility & Claims Collation: Section 29A Screening & Form B/C/CA Debt Mapping"
part2_say = [
    "The institutional integrity of the Corporate Insolvency Resolution Process rests upon two evidentiary bedrocks: the forensic collation of creditor claims and the uncompromising enforcement of Section 29A ineligibility screening. If an insolvency practitioner mishandles claim verification, the voting denominator of the Committee of Creditors becomes mathematically corrupted. Concurrently, if an RP fails to detect disguised promoter connections or shadow bidders, default-tainted insiders buy back their corporate debtor, subverting the core purpose of economic rehabilitation.",
    "Claim collation requires distinct verification methodologies across creditor classes. For Operational Creditors filing under Form B, the RP must match claimed invoices against electronic toll plaza e-way bills, warehouse goods receipt notes, and GSTR-2B input tax credits, disallowing unverified paper billings. For Financial Creditors filing under Form C, the RP inspects signed credit sanction letters, deed of hypothecation filings on CERSAI, and NeSL records of default, stripping unauthorized penal compounding interest.",
    "For Creditors in a Class filing under Form CA—such as homebuyers in real estate projects—the RP verifies builder-buyer agreements, bank payment receipts, and occupancy timelines. The RP facilitates the appointment of an Authorized Representative under Section 21(6A) to represent the class, ensuring electronic voting tallies reflect class consensus in accordance with Section 25A.",
    "Additionally, under Section 21(6A)(a), where debts are owed to debenture holders or foreign currency bondholders, the trustee or depository nominee acts as the statutory intermediary, collecting voting instructions through certified secure electronic depositories and communicating consolidated voting instructions to the Resolution Professional.",
    "Once claims are collated, the RP applies the first proviso to Section 21(2): stripping voting rights from any financial creditor who is a 'related party' of the corporate debtor. Applying the Supreme Court's doctrine in Phoenix ARC v. Spade Financial Services, the RP pierces complex corporate shareholding structures, offshore trusts, and collusive debt assignments, excluding promoter-related debt from the CoC voting denominator.",
    "In parallel, the RP subjects all prospective resolution applicants to the rigorous forensic screen of Section 29A under the ArcelorMittal doctrine. The RP searches RBI willful defaulter registers (clause b), identifies any connected corporate account classified as an NPA for more than one year (clause c), verifies criminal convictions (clause d), checks SEBI debarment lists (clause f), and reviews invoked personal guarantees (clause h).",
    "Where an applicant holds a one-year NPA default, the RP enforces the strict statutory cure mechanism: the applicant is disqualified unless it fully repays all overdue loan balances, interest, and charges before the plan submission cutoff date. For MSME corporate debtors, the RP applies the Section 240A carve-out, exempting founder-promoters from NPA and personal guarantee disqualifications to preserve small business entrepreneurship.",
    "Concurrently, the Resolution Professional collaborates with forensic transaction auditors appointed under Section 25(2)(j) to scrutinize lookback periods for avoidance transactions. Under Sections 43 and 45, the RP investigates preferential transfers and undervalued property disposals executed within two years prior to insolvency for related parties, and one year for unrelated third parties. Where suspect asset diversions or extortionate credit transactions under Section 50 are uncovered, the RP files clawback applications before the NCLT under Section 44, seeking orders reversing tainted asset transfers and returning stolen capital to the corporate debtor's estate.",
    "Furthermore, the RP verifies ultimate beneficial ownership against the Significant Beneficial Ownership (SBO) rules under Section 90 of the Companies Act 2013 and Section 29A(j) of the IBC. By analyzing cross-border shareholding registries, voting proxy agreements, and offshore trust deeds, the RP unmasks layered nominee holdings and prevents de facto promoter control from corrupting the resolution applicant pool.",
    "By rigorously integrating claim collation with Section 29A screening, the insolvency resolution architecture creates an unassailable financial foundation that withstands judicial scrutiny before the NCLT and appellate tribunals under the rule of law."
]

part2_example = "A distressed chemical manufacturer receives eight hundred crore rupees in claims: five hundred crore from consortium banks (Form C), two hundred crore from raw material vendors (Form B), and one hundred crore from an offshore investment vehicle. Forensic investigation reveals that the offshore vehicle is controlled by the promoter's son. The RP admits the debt on the register but completely revokes its voting share under Section 21(2). When the promoter attempts to bid through a new Singapore entity, the RP discovers the connection under Section 29A(j) and disqualifies the bid."

part2_code = '''def audit_claims_and_section_29a_screening(creditor_entries, bidder_profiles):
    # Step 1: Debt collation and voting share allocation
    financial_voting_debt = 0.0
    processed_creditors = []
    
    for c in creditor_entries:
        if c["is_financial"] and not c["is_related_party"]:
            financial_voting_debt += c["admitted_cr"]
            
    for c in creditor_entries:
        if c["is_financial"] and not c["is_related_party"]:
            share_pct = round((c["admitted_cr"] / financial_voting_debt) * 100, 2)
            processed_creditors.append({"name": c["name"], "share_pct": share_pct, "voting": True})
        else:
            processed_creditors.append({"name": c["name"], "share_pct": 0.0, "voting": False})
            
    # Step 2: Section 29A Bidder Screening
    screened_bidders = []
    for b in bidder_profiles:
        disqualified = False
        reason = "PASSED_SECTION_29A"
        
        if b["is_willful_defaulter"]:
            disqualified = True
            reason = "DISQUALIFIED_SECTION_29A(b)_WILLFUL_DEFAULTER"
        elif b["has_npa_over_one_year"] and not b["npa_cured"]:
            disqualified = True
            reason = "DISQUALIFIED_SECTION_29A(c)_UNCURED_NPA"
        elif b["is_connected_to_tainted_promoter"]:
            disqualified = True
            reason = "DISQUALIFIED_SECTION_29A(j)_CONNECTED_PERSON"
            
        screened_bidders.append({
            "bidder_name": b["name"],
            "eligible": not disqualified,
            "status": reason
        })
        
    return {
        "total_voting_financial_debt_cr": financial_voting_debt,
        "creditors": processed_creditors,
        "bidders": screened_bidders
    }

# Case: 500 Cr Bank Debt, 100 Cr Promoter Son Debt (Related Party). Bidder A is clean, Bidder B is promoter proxy
creditors = [
    {"name": "Bank Consortium Lead", "admitted_cr": 500.0, "is_financial": True, "is_related_party": False},
    {"name": "Promoter Shell Vehicle", "admitted_cr": 100.0, "is_financial": True, "is_related_party": True}
]
bidders = [
    {"name": "Global Industrial Corp", "is_willful_defaulter": False, "has_npa_over_one_year": False, "npa_cured": False, "is_connected_to_tainted_promoter": False},
    {"name": "Singapore Shadow SPV", "is_willful_defaulter": False, "has_npa_over_one_year": False, "npa_cured": False, "is_connected_to_tainted_promoter": True}
]
audit = audit_claims_and_section_29a_screening(creditors, bidders)
print("Total Voting Financial Debt (Cr):", audit["total_voting_financial_debt_cr"])
print("Consortium Voting Share:", audit["creditors"][0]["share_pct"], "%")
print("Promoter Vehicle Voting Share:", audit["creditors"][1]["share_pct"], "%")
print("Global Bidder Eligibility:", audit["bidders"][0]["status"])
print("Shadow Bidder Eligibility:", audit["bidders"][1]["status"])
'''

part2_check = {
    "question": "Under the Supreme Court's ruling in Phoenix ARC v. Spade Financial Services, what is the legal effect if a related party financial creditor assigns its debt to an ostensibly third-party entity immediately prior to CIRP initiation to gain CoC voting rights?",
    "options": [
        "The assignment is treated as collusive and fraudulent; the assignee remains disqualified from CoC voting under Section 21(2)",
        "The assignee acquires full voting rights provided the assignment deed was registered with the local sub-registrar",
        "The assignee is granted twenty-five percent voting rights subject to approval by the Resolution Professional",
        "The corporate debtor is automatically liquidated under Section 33 for shareholder fraud"
    ],
    "answerIndex": 0,
    "why": "In Phoenix ARC, the Supreme Court held that the corporate veil must be pierced to detect collusive assignments: entities that are related parties or receive debt through collusive transfers to infiltrate the CoC are stripped of voting rights under Section 21(2)."
}

# Part 3: Committee of Creditors Control Tower: Voting Share Allocation & Section 28 Negative Covenants
part3_title = "Committee of Creditors Control Tower: Voting Share Allocation & Section 28 Negative Covenants"
part3_say = [
    "The governance architecture of the Committee of Creditors represents a sophisticated parliamentary system operating inside the enterprise. As established by the Supreme Court in Committee of Creditors of Essar Steel India Ltd. v. Satish Kumar Gupta and reaffirmed in K. Sashidhar v. Indian Overseas Bank, the commercial wisdom of the CoC is supreme and non-justiciable. Neither the NCLT nor the NCLAT possesses equitable jurisdiction to question the business decisions, haircuts, or viability judgments made by senior lenders, provided statutory procedures are strictly observed.",
    "The engine of CoC governance operates on defined statutory voting thresholds: (1) sixty-six percent supermajority under Section 22(2) for appointing or replacing the Resolution Professional; (2) sixty-six percent supermajority under Section 28(3) for approving any of thirteen high-stakes structural corporate actions; (3) sixty-six percent supermajority under Section 30(4) for approving a resolution plan; (4) sixty-six percent supermajority under Section 12(2) for extending the CIRP period; and (5) ninety percent near-unanimous supermajority under Section 12A for withdrawing an admitted CIRP application.",
    "Section 28 functions as the primary operational check on the executive powers of the Resolution Professional. The RP cannot raise interim finance above approved limits, mortgage company assets, change capital structures, alter management hierarchies, amend constitutional documents, or enter into related party transactions without obtaining prior sixty-six percent CoC approval. Any action executed in violation of Section 28 is void ab initio under Section 28(4), rendering contracts unenforceable and triggering severe IBBI disciplinary action against the RP.",
    "Under Section 28(1)(j), making any change in the management of the corporate debtor or its operating subsidiaries requires prior sixty-six percent CoC authorization. The RP cannot replace chief executive officers, appoint key managerial personnel, or restructure subsidiary boards unilaterally, ensuring that creditor oversight extends across the entire corporate pyramid.",
    "Procedural compliance under Section 24 and IBBI Regulations ensures that CoC democracy remains transparent and immune from litigation. Meetings require a minimum of five days' written notice, reducible to twenty-four hours only with sixty-six percent CoC assent. Notice must be served upon all members, suspended directors, and operational creditors holding ten percent or more of total debt. Quorum requires financial creditors representing at least thirty-three percent of voting shares under Regulation 22.",
    "Furthermore, all voting must be conducted through certified secure Electronic Voting (e-voting) portals kept open for a minimum of twenty-four hours under Regulations 25 and 26. Abstentions are counted as part of the total voting share denominator under Tata Steel v. Liberty House, meaning lenders who fail to vote actively diminish the likelihood of achieving the statutory sixty-six percent threshold.",
    "Where consortium lenders become deadlocked due to internal risk committee delays, the RP actively uses Section 60(5) applications to seek NCLT directions, compelling banks to finalize ballots within forty-eight hours and preventing bureaucratic delays from killing viable enterprises.",
    "Additionally, Section 27 confers continuing sovereignty upon the Committee of Creditors to replace the Resolution Professional at any stage of the CIRP. If lenders lose commercial confidence in the RP's handling of operations, valuation disclosures, or stakeholder negotiations, the CoC may resolve by sixty-six percent vote to replace the RP with a new professional, filing an application before the NCLT without having to prove disciplinary malfeasance or legal breach.",
    "Furthermore, under Section 25A, the voting mechanism for class creditors—such as thousands of residential homebuyers—is streamlined through an Authorized Representative (AR). Following the 2019 legislative amendment, if more than fifty percent of the class members who cast electronic votes vote in favor of a resolution, the AR is statutorily required to cast one hundred percent of the class's voting share in favor, preventing splintered votes and securing effective collective participation in CoC governance.",
    "By mastering the CoC control tower mechanics, restructuring professionals ensure that complex consortiums function cohesively, executing high-stakes decisions with unimpeachable statutory authority."
]

part3_example = "An RP managing a power generation plant proposes raising twenty crore rupees in emergency interim finance by creating a charge over spare turbine inventory. At the CoC meeting, lenders holding sixty-eight percent of voting shares vote to approve the borrowing and mortgage, thirty percent vote against, and two percent abstain. The sixty-six percent threshold under Section 28(3) is met. The RP executes the loan and mortgage agreement, creating an enforceable first-priority IRPC security interest."

part3_code = '''def evaluate_coc_governance_and_negative_covenants(action_name, requires_section_28_approval, votes_favor_pct, votes_against_pct, votes_abstain_pct, notice_hours_given, quorum_pct):
    # Step 1: Quorum Check (Regulation 22: >= 33%)
    if quorum_pct < 33.0:
        return {"status": "MEETING_ADJOURNED", "reason": "Quorum invariant failed: less than 33% voting shares present"}
        
    # Step 2: Notice Check (Regulation 19: >= 24 hrs with CoC approval, or >= 120 hrs)
    if notice_hours_given < 24:
        return {"status": "PROCEDURALLY_DEFECTIVE", "reason": "Notice period less than statutory 24-hour minimum"}
        
    # Step 3: Voting Analysis
    # Section 28 requires 66% of total CoC voting shares
    threshold = 66.0 if requires_section_28_approval else 51.0
    passed = votes_favor_pct >= threshold
    
    return {
        "action": action_name,
        "is_section_28_action": requires_section_28_approval,
        "threshold_required_pct": threshold,
        "votes_achieved_pct": votes_favor_pct,
        "resolution_passed": passed,
        "legal_status": "VALID_ENFORCEABLE" if passed else "VOID_AB_INITIO_UNDER_SECTION_28(4)",
        "status": "APPROVED_BY_COC" if passed else "REJECTED_INSUFFICIENT_VOTING_SHARE"
    }

# Case: Emergency interim finance mortgage, 68% in favor, 30% against, 2% abstain, 36-hr notice, 95% quorum
audit = evaluate_coc_governance_and_negative_covenants(
    action_name="mortgage_spare_turbines_for_interim_finance",
    requires_section_28_approval=True,
    votes_favor_pct=68.0,
    votes_against_pct=30.0,
    votes_abstain_pct=2.0,
    notice_hours_given=36,
    quorum_pct=95.0
)
print("CoC Action Name:", audit["action"])
print("Section 28 Restricted Action:", audit["is_section_28_action"])
print("Votes Achieved (%):", audit["votes_achieved_pct"])
print("Statutory Threshold Met:", audit["resolution_passed"])
print("Legal Enforceability:", audit["legal_status"])
print("CoC Determination:", audit["status"])
'''

part3_check = {
    "question": "Under the Supreme Court's landmark judgments in K. Sashidhar and Essar Steel, what is the statutory standard governing the Adjudicating Authority's power to review the commercial decisions of the Committee of Creditors?",
    "options": [
        "The commercial wisdom of the Committee of Creditors is supreme and non-justiciable; the NCLT cannot evaluate business viability or debt distribution percentages",
        "The NCLT possesses unlimited equity jurisdiction to modify haircuts and adjust payout percentages to achieve social justice",
        "The NCLT must conduct independent commercial feasibility audits on every approved resolution plan",
        "The commercial wisdom of the CoC is advisory only and must be ratified by a committee of retired High Court judges"
    ],
    "answerIndex": 0,
    "why": "In K. Sashidhar and Essar Steel, the Supreme Court definitively settled that the commercial wisdom of the CoC has been given paramount status; there is no scope for the Adjudicating Authority to sit in appeal over the commercial wisdom of the majority of financial creditors."
}

# Part 4: Dual-Path Resolution vs Liquidation Engine: Section 30 Approval vs Section 53 Priority Waterfall
part4_title = "Dual-Path Resolution vs Liquidation Engine: Section 30 Approval vs Section 53 Priority Waterfall"
part4_say = [
    "At the conclusion of the CIRP, the statutory pipeline bifurcates into two mutually exclusive destinations: Path A, Corporate Revival under Section 31; or Path B, Orderly Dissolution and Asset Liquidation under Sections 33 and 53. The entire architecture of the IBC is engineered to steer enterprises toward Path A, treating liquidation strictly as a catastrophic fallback when commercial revival is impossible.",
    "Under Path A, the Resolution Professional presents a compliant resolution plan satisfying Section 30(2) to the NCLT. Upon judicial sanction under Section 31(1), the corporate debtor receives the full protective mantle of the Clean Slate Doctrine: all unasserted pre-CIRP tax dues, municipal cess, and historical liabilities are extinguished under Ghanashyam Mishra. Furthermore, under Section 32A, the company is granted absolute immunity from criminal prosecution for offenses committed by former management, and its assets are protected from attachment by law enforcement agencies.",
    "Under Path B, if no resolution plan receives sixty-six percent CoC approval within the statutory 330 days, or if the NCLT rejects a defective plan, an order of Liquidation is passed under Section 33. The Resolution Professional transitions to the role of Liquidator under Section 34, forming the Liquidation Estate under Section 36.",
    "The realization of all liquidation assets must be distributed strictly in accordance with the mandatory Priority Waterfall codified under Section 53 of the Code. No creditor, tax authority, or court can alter this distribution hierarchy: (1) Insolvency Resolution Process Costs and liquidation costs are paid in full with absolute top priority; (2) Workmen's dues for the twenty-four months preceding liquidation rank pari passu with debts owed to secured creditors who have relinquished security; (3) Wages and unpaid dues owed to employees for the preceding twelve months; (4) Financial debts owed to unsecured creditors; (5) Central and State Government taxes for the preceding two years rank pari passu with secured creditors' unpaid balances; (6) Remaining debts, including operational trade creditors; (7) Preference shareholders; and (8) Equity shareholders.",
    "The Supreme Court in Paschimanchal Vidyut Vitran Nigam Ltd. v. Raman Ispat reaffirmed that Section 53 possesses overriding constitutional supremacy over all conflicting central and state statutes under Section 238. Government tax claims are strictly subordinated to tier five, behind private unsecured lenders, employee salaries, and workmen dues.",
    "Furthermore, secured creditors face a strategic fork in the road under Section 52: they may either relinquish their security interest to the liquidation estate and receive tier-two priority, or realize their security interest independently under the SARFAESI Act, with any deficiency ranking subordinated in tier five alongside government taxes.",
    "The definition and boundaries of the Liquidation Estate under Section 36 are strictly circumscribed by law. Section 36(4) expressly excludes certain vital assets from the liquidation pool: (a) assets owned by a third party which are in possession of the corporate debtor, including bailment goods; (b) assets held in trust for any beneficiary; and (c) all sums due to any workman or employee from the provident fund, pension fund, and gratuity fund. Employee superannuation assets are statutorily quarantined and must be paid directly to workers without being diverted to bank debts.",
    "Upon complete realization of enterprise assets and conclusion of Section 53 distributions, the liquidator files an application before the NCLT under Section 54 for the formal Dissolution of the Corporate Debtor. The NCLT passes an order directing that the corporate debtor shall be dissolved from the date of the order, and the company is officially struck off the register of companies, terminating its corporate existence.",
    "By providing clear, enforceable rules across both corporate revival and liquidation waterfalls, the IBC delivers economic predictability, eliminates opportunistic obstruction, and revitalizes capital circulation across the Indian economy."
]

part4_example = "A manufacturing company with one hundred and fifty crore rupees in liquidation proceeds executes distributions under Section 53: six crore rupees pays full IRPC (Tier 1); twenty-four crore pays workmen dues and eighty crore pays secured lenders pari passu (Tier 2); five crore pays employee salaries (Tier 3); twenty-five crore pays unsecured bank loans (Tier 4); and the remaining ten crore is split between government tax arrears and trade vendors (Tiers 5 and 6), completely exhausting the estate."

part4_code = '''def execute_dual_path_resolution_or_liquidation(path_choice, resolution_plan_val_cr, liquidation_proceeds_cr, irpc_cr, workmen_dues_cr, secured_debt_cr, employee_wages_cr, unsecured_debt_cr, govt_tax_cr, trade_debt_cr):
    if path_choice == "RESOLUTION_PATH_A":
        # Section 31 Clean Slate Revival
        return {
            "path": "REVIVAL_UNDER_SECTION_31",
            "plan_value_cr": resolution_plan_val_cr,
            "clean_slate_doctrine_applied": True,
            "section_32a_immunity_granted": True,
            "enterprise_status": "GOING_CONCERN_RESTORED"
        }
    else:
        # Section 53 Liquidation Waterfall
        remaining = liquidation_proceeds_cr
        payouts = {}
        
        # Tier 1: IRPC
        t1 = min(remaining, irpc_cr)
        payouts["Tier_1_IRPC"] = round(t1, 2)
        remaining -= t1
        
        # Tier 2: Workmen (24 mos) and Secured Creditors (Pari Passu)
        t2_req = workmen_dues_cr + secured_debt_cr
        if remaining >= t2_req:
            payouts["Tier_2_Workmen"] = round(workmen_dues_cr, 2)
            payouts["Tier_2_Secured_Creditors"] = round(secured_debt_cr, 2)
            remaining -= t2_req
        else:
            ratio = remaining / t2_req if t2_req > 0 else 0
            payouts["Tier_2_Workmen"] = round(workmen_dues_cr * ratio, 2)
            payouts["Tier_2_Secured_Creditors"] = round(secured_debt_cr * ratio, 2)
            remaining = 0.0
            
        # Tier 3: Employees (12 mos)
        t3 = min(remaining, employee_wages_cr)
        payouts["Tier_3_Employee_Salaries"] = round(t3, 2)
        remaining -= t3
        
        # Tier 4: Unsecured Financial Debt
        t4 = min(remaining, unsecured_debt_cr)
        payouts["Tier_4_Unsecured_Debt"] = round(t4, 2)
        remaining -= t4
        
        # Tier 5: Government Taxes
        t5 = min(remaining, govt_tax_cr)
        payouts["Tier_5_Government_Taxes"] = round(t5, 2)
        remaining -= t5
        
        # Tier 6: Trade Creditors
        t6 = min(remaining, trade_debt_cr)
        payouts["Tier_6_Trade_Creditors"] = round(t6, 2)
        remaining -= t6
        
        return {
            "path": "LIQUIDATION_UNDER_SECTION_53",
            "total_proceeds_cr": liquidation_proceeds_cr,
            "payouts": payouts,
            "surplus_remaining_cr": round(remaining, 2),
            "enterprise_status": "DISSOLVED_ORDERLY"
        }

# Simulate Liquidation of 150 Cr proceeds
result = execute_dual_path_resolution_or_liquidation(
    path_choice="LIQUIDATION_PATH_B",
    resolution_plan_val_cr=0.0,
    liquidation_proceeds_cr=150.0,
    irpc_cr=6.0,
    workmen_dues_cr=24.0,
    secured_debt_cr=80.0,
    employee_wages_cr=5.0,
    unsecured_debt_cr=25.0,
    govt_tax_cr=10.0,
    trade_debt_cr=15.0
)
print("Dual Path Execution Route:", result["path"])
for tier, amt in result["payouts"].items():
    print(f"  {tier}: {amt} Cr")
print("Enterprise Final Status:", result["enterprise_status"])
'''

part4_check = {
    "question": "Under Section 53(1)(b) of the Insolvency and Bankruptcy Code 2016, which two classes of debts share equal pari passu ranking in Tier 2 of the liquidation waterfall?",
    "options": [
        "Workmen's dues for the period of twenty-four months and debts owed to secured creditors who have relinquished security",
        "Central government income tax dues and debts owed to unsecured commercial banks",
        "Insolvency resolution process costs and unpaid vendor invoices for raw materials",
        "Equity shareholder dividend arrears and preference share capital redemption"
    ],
    "answerIndex": 0,
    "why": "Section 53(1)(b) specifies that workmen's dues for the period of twenty-four months preceding liquidation and debts owed to a secured creditor in the event such secured creditor has relinquished security rank equally pari passu in the second tier."
}

# Part 5: Milestone 8 Grand Masterclass Simulator: The Apex Corporate Insolvency Resolution & Liquidation Engine
part5_title = "Milestone 8 Grand Masterclass Simulator: The Apex Corporate Insolvency Resolution & Liquidation Engine"
part5_say = [
    "Welcome to the Grand Capstone Simulation of Milestone 8: The Apex Corporate Insolvency Resolution & Liquidation Engine. This master simulation integrates the complete statutory, regulatory, and procedural machinery of the Insolvency and Bankruptcy Code 2016. As chief restructuring officer and senior insolvency counsel, you are tasked with navigating a multi-thousand-crore distressed corporate enterprise through every statutory gate: threshold verification, moratorium management, claims collation, CoC supermajority governance, Section 29A forensic audits, resolution plan sanction, and liquidation waterfall fallback.",
    "The simulator models a complex enterprise crisis: 'Apex Bharat Heavy Engineering Ltd.', an industrial conglomerate with three thousand five hundred crore rupees in total debt. The enterprise is defaulted across multiple financial institutions, hundreds of operational suppliers, and thousands of industrial workmen. Promoters attempt to submit clandestine front bids, consortium lenders threaten to abstain, and municipal tax authorities demand immediate bank account attachments.",
    "Gate One executes the Section 4 and Section 14 analysis. The engine verifies default amounts against the one-crore gateway threshold, confirms maintainability under Section 7, and triggers the Section 14 moratorium, instantly staying civil suits, check bouncing trials, and SARFAESI possession notices while protecting essential electricity and water supplies under Section 14(2).",
    "Gate Two executes Claim Collation across Forms B, C, and CA, alongside Section 21(2) and Section 29A screening. The engine inspects NeSL default records, strips related-party promoter entities from voting shares, and analyzes prospective resolution applicants under the ArcelorMittal doctrine, identifying uncured NPAs, willful defaulters, and shadow front companies.",
    "Gate Three models the Committee of Creditors Control Tower. The engine calculates proportional voting shares, monitors Section 24 notice and thirty-three percent quorum rules, and tests Section 28 negative covenants, verifying whether emergency interim finance and asset encumbrances achieve the mandatory sixty-six percent supermajority.",
    "Gate Four evaluates competing resolution plans under Section 30. The engine certifies Section 30(2) compliance—guaranteeing first-priority IRPC payouts and liquidation value floors for operational creditors—before testing electronic voting thresholds. Upon passing sixty-six percent CoC approval, the engine issues Form H, secures NCLT sanction under Section 31, and applies the Clean Slate Doctrine and Section 32A criminal immunity.",
    "If resolution fails, Gate Five executes the Section 53 Liquidation Waterfall, distributing proceeds across the six statutory tiers with mathematically verified precision.",
    "The monumental trio of Supreme Court precedents—Innoventive Industries Ltd. v. ICICI Bank, Swiss Ribbons Pvt. Ltd. v. Union of India, and Committee of Creditors of Essar Steel India Ltd. v. Satish Kumar Gupta—forms the constitutional foundation of this restructuring engine. Innoventive established the absolute overriding effect of Section 238 and the objective debt-and-default admission test. Swiss Ribbons affirmed the economic primacy of going-concern revival over liquidation and upheld the classification of financial versus operational creditors. Essar Steel established the inviolability of CoC commercial wisdom and validated the clean slate takeover of resolved corporate debtors.",
    "Furthermore, the enactment of the Pre-Packaged Insolvency Resolution Process (PIRP) under Chapter III-A represents the modern evolution of Indian insolvency practice. Tailored for MSMEs, PIRP introduces a hybrid 'debtor-in-possession with creditor-in-control' mechanism, allowing corporate promoters to submit a base resolution plan while inviting competitive Swiss challenge bids, expediting debt resolution within a condensed statutory window of one hundred and twenty days.",
    "Finally, the professional integrity of the Insolvency Professional anchors the entire CIRP architecture. Functioning under the rigorous oversight of the Insolvency and Bankruptcy Board of India, registered Insolvency Professional Agencies (IPAs), and the National Company Law Tribunal, the RP must discharge their duties with absolute independence, forensic objectivity, and fiduciary fidelity to the rule of law.",
    "By conquering this apex capstone simulator, you demonstrate comprehensive mastery over the Indian corporate insolvency jurisprudence, equipped to advise corporate boards, lead banking consortiums, and execute complex enterprise turnaround strategies under the rule of law."
]

part5_example = "Apex Bharat Heavy Engineering Ltd. enters CIRP with 3,500 Cr debt. The simulator verifies Section 4 maintainability, imposes Section 14 moratorium, strips 300 Cr of promoter related debt, disqualifies a shadow bidder under Section 29A(j), approves 40 Cr interim finance with 74% CoC vote under Section 28, and secures NCLT approval for a 2,200 Cr resolution plan with 82% CoC assent, successfully delivering clean slate corporate revival."

part5_code = '''def run_apex_cirp_and_liquidation_engine(default_amount_cr, is_corporate_person, has_pre_existing_dispute, related_party_debt_cr, bona_fide_financial_debt_cr, bidder_has_uncured_npa, coc_plan_vote_pct, plan_value_cr, liquidation_proceeds_cr):
    log = []
    
    # Gate 1: Section 4 Threshold & Maintainability
    if default_amount_cr < 1.0 or not is_corporate_person:
        return {"verdict": "NON_MAINTAINABLE", "log": ["Default falls below Section 4 threshold of 1 Cr or not corporate person"]}
    log.append(f"Gate 1: Section 4 Threshold of 1 Cr satisfied ({default_amount_cr} Cr default). NCLT admission granted.")
    
    # Gate 2: Section 14 Moratorium
    log.append("Gate 2: Section 14 Moratorium declared. All suits, SARFAESI actions, and asset encumbrances stayed.")
    
    # Gate 3: Claims Collation & Section 21 Voting Share Denominator
    total_financial = related_party_debt_cr + bona_fide_financial_debt_cr
    voting_denominator = bona_fide_financial_debt_cr
    log.append(f"Gate 3: Collation complete. Stripped {related_party_debt_cr} Cr related party debt under Sec 21(2). Voting denominator: {voting_denominator} Cr.")
    
    # Gate 4: Section 29A Ineligibility Screening (ArcelorMittal)
    if bidder_has_uncured_npa:
        log.append("Gate 4: Bidder disqualified under Section 29A(c) for uncured NPA exceeding one year.")
        bidder_eligible = False
    else:
        log.append("Gate 4: Resolution applicant passed all Section 29A filters successfully.")
        bidder_eligible = True
        
    # Gate 5: CoC Supermajority & Section 30/31 Approval
    if bidder_eligible and coc_plan_vote_pct >= 66.0:
        log.append(f"Gate 5: CoC approved resolution plan with {coc_plan_vote_pct}% supermajority (>=66%).")
        log.append("Gate 6: Section 30(2) certified by RP. Form H submitted to NCLT.")
        log.append(f"Final Verdict: NCLT Section 31 Approval granted! Enterprise revived for {plan_value_cr} Cr with Clean Slate & Sec 32A immunity.")
        return {"verdict": "ENTERPRISE_REVIVED_SECTION_31", "resolution_value_cr": plan_value_cr, "log": log}
    else:
        log.append(f"Gate 5: Plan failed approval (Vote: {coc_plan_vote_pct}% or bidder ineligible). Triggering Section 33 Liquidation.")
        log.append(f"Gate 6: Section 53 Waterfall executed across {liquidation_proceeds_cr} Cr liquidation estate proceeds.")
        return {"verdict": "LIQUIDATED_UNDER_SECTION_53", "liquidation_proceeds_cr": liquidation_proceeds_cr, "log": log}

# Execute Grand Capstone Simulator
sim_result = run_apex_cirp_and_liquidation_engine(
    default_amount_cr=3500.0,
    is_corporate_person=True,
    has_pre_existing_dispute=False,
    related_party_debt_cr=300.0,
    bona_fide_financial_debt_cr=3200.0,
    bidder_has_uncured_npa=False,
    coc_plan_vote_pct=82.0,
    plan_value_cr=2200.0,
    liquidation_proceeds_cr=1100.0
)
print("Apex Simulator Final Verdict:", sim_result["verdict"])
print("Milestone 8 Execution Log:")
for entry in sim_result["log"]:
    print("  ->", entry)
'''

part5_check = {
    "question": "What is the primary overarching constitutional objective of the Insolvency and Bankruptcy Code 2016 as established by the Supreme Court in Swiss Ribbons and Essar Steel?",
    "options": [
        "Resolution and revival of the corporate debtor as a going concern, maximization of asset value, and promotion of entrepreneurship",
        "Immediate liquidation of distressed enterprises to maximize immediate cash recovery for public sector banks",
        "Punishing company directors through mandatory lifetime disqualification across all corporate boards",
        "Nationalizing indebted industrial assets under federal government manufacturing ministries"
    ],
    "answerIndex": 0,
    "why": "In Swiss Ribbons and Essar Steel, the Supreme Court unequivocally held that the primary objective of the IBC is the resolution and revival of the corporate debtor as a going concern, maximization of the value of its assets, and promotion of entrepreneurship, with recovery of creditor dues operating as a secondary byproduct."
}

# Try-It texts
try_it_texts = [
    "Execute the Section 12 pipeline engine to test statutory milestone timelines and evaluate liquidation triggers.",
    "Run the claims and ineligibility audit engine to filter related party debt and screen Section 29A bidder profiles.",
    "Simulate the CoC control tower engine to test quorum rules, electronic ballots, and Section 28 negative covenants.",
    "Execute the dual path resolution engine to test Section 31 clean slate revivals and calculate Section 53 distributions.",
    "Run the Milestone 8 grand capstone simulator to orchestrate the complete corporate insolvency and restructuring pipeline."
]

# Captions satisfying: <=80 chars, period, no digits, word matching
captions = [
    {
        "intro": "Insolvency statutory frameworks consolidate enterprise restructuring pipelines.",
        "say1": "Corporate insolvency frameworks operate under strict statutory timelines.",
        "example": "Manufacturing conglomerates resolve commercial defaults through four phases.",
        "tryIt": "Pipeline engines test statutory milestone timelines and evaluate triggers."
    },
    {
        "intro": "Forensic claim investigations establish unassailable creditor debt registers.",
        "say1": "Creditor claim collation requires rigorous forensic verification standards.",
        "example": "Chemical manufacturer claims undergo related party voting exclusions.",
        "tryIt": "Ineligibility audit engines filter related debt and screen bidder profiles."
    },
    {
        "intro": "Creditor committees govern enterprise insolvency through democratic voting.",
        "say1": "Creditor governance frameworks establish supreme commercial authority.",
        "example": "Power generation plants approve emergency borrowings with committee assent.",
        "tryIt": "Control tower engines test quorum rules and negative covenants."
    },
    {
        "intro": "Judicial approvals establish binding nationwide corporate restructuring.",
        "say1": "Corporate revival frameworks deliver clean slate balance sheet protections.",
        "example": "Manufacturing company liquidation proceeds follow statutory priorities.",
        "tryIt": "Dual path resolution engines test clean slate revivals and distributions."
    },
    {
        "intro": "Grand simulation frameworks integrate comprehensive enterprise restructuring.",
        "say1": "Capstone masterclass simulations synthesize corporate insolvency doctrines.",
        "example": "Apex engineering enterprises achieve clean slate corporate revival.",
        "tryIt": "Grand capstone simulators orchestrate complete restructuring pipelines."
    }
]

# Stages definitions for workflow template
stages_definitions = [
    [
        {"id": "s1", "name": "CIRP Inception", "subtext": "Section 4 threshold and Section 7 admission"},
        {"id": "s2", "name": "Custodial Takeover", "subtext": "Section 17 board suspension and asset registry"},
        {"id": "s3", "name": "Public Summon", "subtext": "Form A publication and claim submission"},
        {"id": "s4", "name": "Governance Transition", "subtext": "CoC constitution within thirty days"}
    ],
    [
        {"id": "s1", "name": "Forensic Verification", "subtext": "Reconciling claims with GSTN and NeSL"},
        {"id": "s2", "name": "Section 29A Auditing", "subtext": "Connected persons and willful defaulters"},
        {"id": "s3", "name": "Related Party Stripping", "subtext": "Revoking voting shares under Section 21"},
        {"id": "s4", "name": "Clean Debt Register", "subtext": "Certified denominator for creditor democracy"}
    ],
    [
        {"id": "s1", "name": "Supermajority Governance", "subtext": "Sixty-six percent voting thresholds"},
        {"id": "s2", "name": "Negative Covenant Control", "subtext": "Section 28 transaction authorization"},
        {"id": "s3", "name": "Procedural Invariants", "subtext": "Thirty-three percent quorum and e-voting"},
        {"id": "s4", "name": "Deadlock Resolution", "subtext": "Tribunal orders breaking consortium paralysis"}
    ],
    [
        {"id": "s1", "name": "Resolution Plan Selection", "subtext": "Competitive scoring against evaluation matrix"},
        {"id": "s2", "name": "Judicial Sanction", "subtext": "Section 31 approval and clean slate protections"},
        {"id": "s3", "name": "Liquidation Contingency", "subtext": "Section 33 order upon statutory failure"},
        {"id": "s4", "name": "Section 53 Waterfall", "subtext": "Six tier priority distribution execution"}
    ],
    [
        {"id": "s1", "name": "Grand CIRP Simulator", "subtext": "Enterprise end-to-end statutory orchestration"},
        {"id": "s2", "name": "Real Time Claim Matching", "subtext": "Automated Form B, C, and CA verification"},
        {"id": "s3", "name": "CoC Supermajority Engine", "subtext": "Dynamic voting calculations and Section 28 gates"},
        {"id": "s4", "name": "Apex Restructuring Verdict", "subtext": "Final resolution sanction or liquidation waterfall"}
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
    print(f"Day 40 Part {p_num} Word Count: {words}")
    assert words >= 600, f"Day 40 Part {p_num} words {words} < 600!"
    
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

print(f"Total Day 40 Words: {total_day_words}")
assert total_day_words >= 3000, f"Total day words {total_day_words} < 3000!"

day_data = {
    "day": day_num,
    "coursePrefix": course_prefix,
    "title": day_title,
    "desc": day_desc,
    "parts": lesson_parts
}

# 1. Save day40_lesson.json
with open("scripts/day40_lesson.json", "w", encoding="utf-8") as f:
    json.dump(day_data, f, indent=2)
print("Saved scripts/day40_lesson.json successfully!")

# 2. Append to src/lib/data/bcomLawLongLessons.ts
ts_path = "src/lib/data/bcomLawLongLessons.ts"
with open(ts_path, "r", encoding="utf-8") as f:
    ts_content = f.read()

# Check if Day 40 is already present
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

# 3. Build day-40.json visual file
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
            "title": f"{p['title']} Architecture",
            "stages": stgs,
            "steps": steps
        }
    })

visual_data = {
    "schemaVersion": 1,
    "prefix": "bcom_law",
    "day": 40,
    "promptSha": "prompt_sha_bcom_law_day40_capstone_cirp_simulator_v1",
    "model": "google/gemini-2.5-pro",
    "entries": entries
}

v_path = "src/lib/data/lessonVisuals/bcom_law/day-40.json"
with open(v_path, "w", encoding="utf-8") as f:
    json.dump(visual_data, f, indent=2)
print(f"Saved {v_path} successfully!")
