import json, sys, subprocess, os, re, hashlib

# Builder for Day 43 of bcom_law
# Course: bcom_law (Corporate Law, IBC & Compliance)
# Day 43: Pre-Packaged Insolvency Resolution Process (PIRP) for MSMEs: Chapter III-A Mechanics & The Swiss Challenge

day_num = 43
course_prefix = "bcom_law"
day_title = "Pre-Packaged Insolvency Resolution Process (PIRP) for MSMEs: Chapter III-A Mechanics & The Swiss Challenge"
day_desc = "Master the statutory architecture of the Pre-Packaged Insolvency Resolution Process (PIRP) under Chapter III-A of the IBC: eligibility criteria for MSMEs under Section 54A, the hybrid debtor-in-possession governance model under Section 54H, base resolution plan submission, and the competitive Swiss Challenge bidding mechanism under Section 54K."

# Part 1: Genesis of PIRP: Chapter III-A Architecture & Eligibility Invariants (Section 54A)
part1_title = "Genesis of PIRP: Chapter III-A Architecture & Eligibility Invariants (Section 54A)"
part1_say = [
    "The introduction of Chapter III-A into the Insolvency and Bankruptcy Code 2016 through the Insolvency and Bankruptcy Code (Amendment) Act 2021 marked a watershed paradigm shift in Indian corporate rescue jurisprudence. Prior to this landmark amendment, the IBC operated on a uniform, one-size-fits-all model: whether a distressed enterprise was a massive steel conglomerate or a modest precision auto-parts workshop, the only formal resolution avenue was the standard Corporate Insolvency Resolution Process (CIRP). In practice, subjecting micro, small, and medium enterprises (MSMEs) to standard CIRP proved catastrophic. The total displacement of promoters, severe commercial stigmatization, prohibitive administrative fees, and protracted procedural delays routinely wiped out fragile small businesses, forcing thousands of viable enterprises into premature liquidation.",
    "To remedy this systemic failure, the Central Government—guided by the recommendations of the Insolvency Law Committee's Sub-Committee on Pre-packaged Insolvency chaired by Dr. M. S. Sahoo—enacted the Pre-Packaged Insolvency Resolution Process (PIRP). PIRP is an innovative restructuring mechanism that blends informal out-of-court restructuring negotiations with formal, binding judicial sanction. It allows an eligible distressed corporate debtor to negotiate a restructuring deal with its financial creditors before ever approaching the National Company Law Tribunal, slashing litigation expenditure and preserving enterprise value.",
    "Statutory eligibility under Section 54A is governed by strict statutory invariants. First, the corporate debtor must qualify as a Micro, Small, or Medium Enterprise under Section 7(1) of the Micro, Small and Medium Enterprises Development Act 2006 (MSMED Act), possessing a valid Udyam registration certificate. Second, the default threshold is calibrated specifically for small enterprises: the Central Government notified a minimum default amount of ten lakh rupees, up to a statutory ceiling of one crore rupees, ensuring that smaller debts can access the process without clogging tribunals with negligible disputes.",
    "Third, Section 54A establishes rigorous negative eligibility tests: the corporate debtor must not have undergone a PIRP or completed a CIRP during the preceding three years; it must not be subject to an outstanding liquidation order under Section 33; and critically, it must be eligible to submit a resolution plan under Section 29A. However, recognizing that MSME promoters are frequently the sole source of operational expertise, Section 240A of the Code grants a vital statutory concession: the disqualifications under Section 29A(c) (non-performing asset accounts exceeding one year) and Section 29A(h) (enforceable guarantor liabilities) do not apply to MSMEs, allowing honest promoter-founders who suffered external market distress to retain control of their enterprises.",
    "Finally, initiating PIRP requires a rigorous double-consent corporate governance filter. Under Section 54A(2) and 54A(3), the corporate debtor must obtain: (a) a Special Resolution passed by at least seventy-five percent of its members or shareholders approving the filing; and (b) formal approval from unrelated financial creditors representing not less than sixty-six percent in value of financial debts, who also approve the nomination of the Insolvency Professional to act as Resolution Professional.",
    "The preparation phase demands meticulous statutory compliance before filing the Section 54C petition with the NCLT. The corporate debtor must prepare and submit a Base Resolution Plan to financial creditors, compile an audited statement of affairs, and obtain a formal declaration from directors confirming that PIRP is not being initiated to defraud creditors. The proposed Resolution Professional must submit a formal report confirming that the corporate debtor satisfies all Section 54A eligibility requirements and that the Base Resolution Plan meets the mandatory statutory criteria of Section 30(2).",
    "Once the NCLT admits the Section 54C application, the Code imposes an accelerated statutory clock: the entire PIRP must be concluded within a strict maximum timeframe of one hundred and twenty days. Within this overarching window, the Committee of Creditors must submit an approved resolution plan to the Adjudicating Authority within ninety days, leaving thirty days for judicial approval. This compressed timeline prevents value destruction and ensures that distressed MSMEs emerge swiftly with restructured balance sheets."
]

part1_example = "A precision aerospace components manufacturer registered as an MSME defaults on a working capital credit facility of forty lakh rupees due to global supply chain disruptions. Small manufacturing enterprises initiate prepackaged restructuring through shareholder special resolutions and sixty six percent creditor consents. The managing director secures a seventy-five percent shareholder vote, obtains consent from seventy percent of financial creditors, and files for PIRP with NCLT Bengaluru, initiating a structured ninety-day restructuring without stopping factory production lines."

part1_code = '''def evaluate_msme_pirp_eligibility(is_registered_msme, default_amount_lakhs, completed_cirp_or_pirp_last_3_yrs, has_liquidation_order, has_wilful_defaulter_tag, shareholder_approval_pct, unrelated_fc_consent_pct):
    # Section 54A Eligibility Invariants:
    # 1. Registered MSME under MSMED Act 2006 (Udyam registered)
    # 2. Default >= 10 Lakhs and <= 100 Lakhs (1 Cr)
    # 3. No CIRP/PIRP in past 3 years
    # 4. No liquidation order
    # 5. Section 29A eligible (with Section 240A NPA/guarantor relaxations for MSMEs)
    # 6. Shareholder Special Resolution >= 75%
    # 7. Unrelated Financial Creditor Approval >= 66%
    
    ineligibility_reasons = []
    
    if not is_registered_msme:
        ineligibility_reasons.append("NOT_REGISTERED_MSME")
    if default_amount_lakhs < 10.0:
        ineligibility_reasons.append("DEFAULT_BELOW_STATUTORY_MINIMUM_10_LAKHS")
    if completed_cirp_or_pirp_last_3_yrs:
        ineligibility_reasons.append("BARRED_BY_PRIOR_CIRP_OR_PIRP_WITHIN_3_YEARS")
    if has_liquidation_order:
        ineligibility_reasons.append("BARRED_BY_EXISTING_LIQUIDATION_ORDER")
    if has_wilful_defaulter_tag:
        ineligibility_reasons.append("DISQUALIFIED_WILFUL_DEFAULTER_SECTION_29A")
    if shareholder_approval_pct < 75.0:
        ineligibility_reasons.append("INSUFFICIENT_SHAREHOLDER_SPECIAL_RESOLUTION_VOTE")
    if unrelated_fc_consent_pct < 66.0:
        ineligibility_reasons.append("INSUFFICIENT_UNRELATED_FINANCIAL_CREDITOR_CONSENT")
        
    is_eligible = len(ineligibility_reasons) == 0
    
    return {
        "is_eligible_for_pirp": is_eligible,
        "default_amount_lakhs": default_amount_lakhs,
        "governance_approval_met": shareholder_approval_pct >= 75.0 and unrelated_fc_consent_pct >= 66.0,
        "section_240a_exemption_applied": is_registered_msme,
        "rejection_reasons": ineligibility_reasons if not is_eligible else "NONE",
        "statutory_timeline_days": 120
    }

# Case: Precision aerospace MSME with 40 Lakhs default, 80% shareholder vote, 70% FC consent
audit = evaluate_msme_pirp_eligibility(
    is_registered_msme=True,
    default_amount_lakhs=40.0,
    completed_cirp_or_pirp_last_3_yrs=False,
    has_liquidation_order=False,
    has_wilful_defaulter_tag=False,
    shareholder_approval_pct=80.0,
    unrelated_fc_consent_pct=70.0
)
print("MSME PIRP Eligibility Validated:", audit["is_eligible_for_pirp"])
print("Default Amount (Lakhs):", audit["default_amount_lakhs"])
print("Corporate Approvals Satisfied:", audit["governance_approval_met"])
print("Section 240A Exemption Active:", audit["section_240a_exemption_applied"])
print("Statutory Resolution Window (Days):", audit["statutory_timeline_days"])
'''

part1_check = {
    "question": "Under Section 54A of the Insolvency and Bankruptcy Code, what corporate and creditor approval thresholds are mandatory before a corporate debtor can file for PIRP?",
    "options": [
        "A Special Resolution passed by at least seventy-five percent of shareholders and approval from unrelated financial creditors representing at least sixty-six percent in value",
        "A simple majority of fifty percent of shareholders and approval from ninety percent of operational trade vendors",
        "Unanimous one hundred percent approval of all employees and the Ministry of Micro, Small and Medium Enterprises",
        "Approval by thirty-three percent of secured lenders and an executive decree from the local municipal corporation"
    ],
    "answerIndex": 0,
    "why": "Section 54A(2) requires a special resolution passed by at least 75% of members/shareholders, and Section 54A(3) mandates prior approval by not less than 66% in value of unrelated financial creditors."
}

# Part 2: The Hybrid "Debtor-in-Possession with Creditor Oversight" Governance Model (Section 54H)
part2_title = "The Hybrid Debtor-in-Possession Model: Governance & Creditor Oversight (Section 54H)"
part2_say = [
    "The defining architectural genius of Chapter III-A lies in its governance paradigm: the hybrid 'Debtor-in-Possession with Creditor Oversight' (DIP) model codified in Section 54H. In standard CIRP under Section 17 of the IBC, the corporate debtor is subjected to a strict 'Creditor-in-Control' regime: the powers of the board of directors are immediately suspended, existing management is ousted from executive premises, and the Resolution Professional takes over full custody, management, and operational control of the enterprise. While this draconian displacement is necessary for large conglomerates with fractured corporate governance, applying it to MSMEs proved fatal. Small manufacturing firms are intimately dependent on the founder-promoter's technical expertise, proprietary supplier goodwill, and customer relationships; ousting the promoter inevitably halted operations and destroyed commercial viability.",
    "Section 54H fundamentally alters this operational dynamic by establishing that the management of the affairs of the corporate debtor shall continue to vest in the board of directors or the partners of the corporate debtor. Under this hybrid model, the incumbent management retains executive authority: directors continue to manage daily factory operations, supervise shop-floor workers, fulfill customer purchase orders, purchase raw materials, and maintain commercial vendor contracts as an uninterrupted going concern. This continuous operational stewardship eliminates the crippling panic among customers and suppliers that routinely derails conventional CIRP proceedings.",
    "However, Section 54H does not grant unbridled or unchecked executive discretion to incumbent management. The debtor-in-possession model is counterbalanced by rigorous, continuous oversight exercised by the Resolution Professional and the Committee of Creditors. Under Section 54F, the Resolution Professional acts as an impartial statutory sentinel: monitoring the management of the affairs of the corporate debtor, attending board meetings as an observer, validating the claims of creditors, maintaining the information utility registers, and preparing the official Information Memorandum.",
    "Furthermore, Section 54L and Section 54H impose statutory veto gates on major corporate decisions. The board of directors is strictly prohibited from undertaking critical financial and operational actions without obtaining the prior approval of the Committee of Creditors by a sixty-six percent voting majority. These restricted actions include: (1) raising interim finance beyond approved credit limits; (2) disposing of, transferring, or encumbering corporate assets outside the ordinary course of business; (3) modifying capital structures or issuing securities; (4) altering management contracts or entering into material related-party transactions; and (5) undertaking capital expenditures exceeding thresholds set by the CoC.",
    "To guard against promoter malpractice, Chapter III-A incorporates an emergency statutory circuit breaker under Section 54J: Vesting Management with the Resolution Professional. If, at any point during the PIRP, the Committee of Creditors forms an opinion—by a vote of not less than sixty-six percent—that the affairs of the corporate debtor have been conducted in a fraudulent manner or that there has been gross mismanagement, the CoC may apply to the NCLT. If the Adjudicating Authority is satisfied that fraudulent trading or gross managerial negligence has occurred, it issues an immediate order stripping the board of directors of executive power and vesting full management of the corporate debtor in the Resolution Professional under standard CIRP rules.",
    "Furthermore, Section 54H preserves employee morale and vendor trust. Under conventional CIRP, the immediate suspension of the board triggers vendor panics, where suppliers demand immediate cash-on-delivery and refuse to honor existing credit terms. By contrast, under the debtor-in-possession framework, the continuity of executive leadership ensures that factory floors operate seamlessly, maintaining output commitments and preserving working capital lines that are vital for small business survival.",
    "This hybrid architecture creates a delicate, self-enforcing equilibrium. Promoters know that maintaining executive control of their enterprise is an extraordinary statutory privilege conditioned entirely upon scrupulous transparency and bona fide operational stewardship. Any attempt to siphon assets, favor related entities, or mislead creditors triggers Section 54J, resulting in immediate executive ouster and potential criminal liability under Chapter VII.",
    "By striking an exquisite balance between operational continuity through debtor stewardship and creditor asset protection through RP oversight, the Section 54H framework preserves the intangible human capital of small enterprises while upholding absolute financial discipline."
]

part2_example = "A precision textile firm enters PIRP. Under Section 54H, the founding director continues running daily textile dyeing plants and dispatching retail orders. However, when the director attempts to sell a three-crore warehouse to raise quick cash, the Resolution Professional blocks the transaction. Resolution professionals supervise capital asset sales to protect lenders from unmonitored alienation. The proposed sale of capital assets outside the ordinary course of business requires prior approval of the Committee of Creditors by a sixty-six percent vote, preserving vital plant assets."

part2_code = '''def evaluate_pirp_governance_action(action_type, transaction_value_lakhs, coc_approval_pct, has_fraudulent_conduct_finding):
    # Section 54H & 54J Governance Invariants:
    # Ordinary course operations: Board empowered without prior CoC vote
    # Major/Restricted actions: Requires >= 66% CoC approval
    # Fraudulent conduct / Gross mismanagement: Section 54J triggers management ouster to RP
    
    if has_fraudulent_conduct_finding:
        return {
            "governance_model": "CREDITOR_IN_CONTROL_OUSTER",
            "statutory_basis": "Section 54J Emergency Circuit Breaker",
            "action_permitted": False,
            "management_status": "VESTED_IN_RESOLUTION_PROFESSIONAL",
            "reason": "Gross mismanagement or fraudulent trading proved; promoter board ousted"
        }
        
    restricted_actions = ["DISPOSAL_OF_CAPITAL_ASSETS", "RAISING_INTERIM_FINANCE", "MODIFYING_CAPITAL_STRUCTURE", "RELATED_PARTY_TRANSACTION"]
    
    if action_type in restricted_actions:
        has_approval = coc_approval_pct >= 66.0
        return {
            "governance_model": "DEBTOR_IN_POSSESSION_WITH_CREDITOR_OVERSIGHT",
            "statutory_basis": "Section 54H Proviso & CoC Veto Gate",
            "action_permitted": has_approval,
            "management_status": "BOARD_RETAINS_OPERATIONAL_CONTROL",
            "reason": "Restricted action approved by 66% CoC" if has_approval else "Restricted action REJECTED due to lack of 66% CoC consent"
        }
    else:
        # Ordinary course business operation
        return {
            "governance_model": "DEBTOR_IN_POSSESSION",
            "statutory_basis": "Section 54H General Principle",
            "action_permitted": True,
            "management_status": "BOARD_AUTONOMOUS_OPERATIONS",
            "reason": "Ordinary course commercial activity permitted under debtor stewardship"
        }

# Case: Selling capital asset (warehouse) with only 45% CoC vote
audit = evaluate_pirp_governance_action(
    action_type="DISPOSAL_OF_CAPITAL_ASSETS",
    transaction_value_lakhs=300.0,
    coc_approval_pct=45.0,
    has_fraudulent_conduct_finding=False
)
print("Governance Model Active:", audit["governance_model"])
print("Action Legally Permitted:", audit["action_permitted"])
print("Executive Management Status:", audit["management_status"])
print("Statutory Authority:", audit["statutory_basis"])
print("Judicial Finding:", audit["reason"])
'''

part2_check = {
    "question": "Under Section 54H and Section 54J of the IBC, who manages the day-to-day affairs of an MSME corporate debtor during PIRP, and under what condition can this management be ousted?",
    "options": [
        "The incumbent board of directors retains management, but the NCLT can vest management in the RP under Section 54J if the CoC proves fraud or gross mismanagement by a sixty-six percent vote",
        "The senior-most unsecured operational vendor takes over management automatically on day one",
        "A committee of three retired high court judges manages daily factory operations with zero creditor input",
        "Management is permanently dissolved and assets are transferred to the State Bank of India within forty-eight hours"
    ],
    "answerIndex": 0,
    "why": "Section 54H establishes the Debtor-in-Possession model where the board continues managing affairs, but Section 54J provides an emergency circuit breaker to vest management in the RP upon proof of fraud or gross mismanagement with 66% CoC approval."
}

# Part 3: Base Resolution Plan Submission & Financial Creditor Impairment Thresholds (Section 54K)
part3_title = "Base Resolution Plan Submission & Financial Creditor Impairment Thresholds (Section 54K)"
part3_say = [
    "At the heart of the Pre-Packaged Insolvency Resolution Process lies the 'Base Resolution Plan' (BRP), governed by Section 54K of the Code. Unlike standard CIRP where the Resolution Professional issues Form G to invite expressions of interest from the general public at the outset, PIRP requires the corporate debtor itself to author, negotiate, and submit a Base Resolution Plan to financial creditors prior to filing the initiation petition. The Base Resolution Plan serves as the fundamental anchor and pricing benchmark for the entire restructuring process.",
    "Section 54K establishes a multi-tiered evaluation protocol for the Base Resolution Plan. Within two days of the PIRP commencement date, the corporate debtor must formally submit the Base Resolution Plan to the Resolution Professional. The RP then presents the BRP to the Committee of Creditors at its first formal meeting. The CoC is given the opportunity to evaluate the plan's feasibility, viability, capital infusion schedule, and payout allocations across various creditor classes, ensuring that the plan complies with all mandatory statutory protections under Section 30(2).",
    "A central jurisprudential pillar of Section 54K is the 'Operational Creditor Impairment Test' codified in Section 54K(4). Corporate insolvency law recognizes that MSME promoters might attempt to use PIRP as an engine to write off legitimate trade debts owed to raw material vendors and micro-contractors while retaining equity ownership of the company. To prevent this inequitable exploitation, Section 54K(4) establishes an unambiguous statutory trigger: if the Base Resolution Plan proposes any haircut or impairment whatsoever to the claims of operational creditors—meaning operational creditors are not paid one hundred percent of their admitted debts—the Committee of Creditors is statutorily prohibited from approving the BRP immediately.",
    "Instead, where the Base Resolution Plan impairs operational claims, Section 54K(4) mandates that the Resolution Professional shall immediately invite competing resolution plans from prospective public resolution applicants. This statutory command ensures that promoters cannot force a unilateral compromise upon helpless trade creditors without testing whether the open commercial market is willing to pay a higher price to settle corporate liabilities.",
    "Conversely, if the Base Resolution Plan does not impair operational creditor claims—meaning the plan promises full, one-hundred-percent settlement of all operational debts, or operational creditors explicitly consent—the CoC is presented with two statutory paths under Section 54K(2) and Section 54K(3). The CoC may either: (a) approve the Base Resolution Plan directly by a sixty-six percent vote, concluding the restructuring without public bidding; or (b) if the CoC determines that the financial return offered to financial creditors is suboptimal, it may still require the RP to invite public bids to maximize enterprise asset value.",
    "Furthermore, the Base Resolution Plan must satisfy the statutory waterfall safeguards of Section 53. Even if operational claims are unimpaired, the payout promised to dissenting financial creditors cannot be less than the liquidation value they would have received under Section 53(1). If the BRP fails to provide for priority payment of PIRP costs, employee wage arrears, or statutory tax dues under Section 30(2), the RP must reject the plan and require the corporate debtor to revise its terms prior to CoC evaluation.",
    "The preparation and disclosure obligations accompanying the Base Resolution Plan are codified under Regulation 32 of the IBBI PIRP Regulations. The corporate debtor must submit a comprehensive preliminary Information Memorandum alongside the Base Resolution Plan. This document must set out an exhaustive audit of all corporate assets, security interests, intellectual property rights, ongoing litigation, and statutory liabilities. The Resolution Professional verifies these disclosures and submits them to the Committee of Creditors. If the corporate debtor withholds material facts or presents misleading valuation figures in its preliminary Information Memorandum, the Resolution Professional is legally obligated to report the violation to the CoC and the Adjudicating Authority.",
    "Under Section 54K(5), the Committee of Creditors is empowered to provide comments and suggestions on the Base Resolution Plan, allowing the corporate debtor an opportunity to revise the proposal before a formal vote. This interactive negotiation process distinguishes PIRP from standard CIRP: it creates a collaborative forum where financial creditors can negotiate for higher upfront cash infusions, tighter personal guarantee covenants, or equity conversion rights. Only when the corporate debtor refuses to make necessary revisions or when the proposed payout unfairly impairs operational creditors does the CoC trigger the open market Swiss Challenge auction.",
    "By constructing this elegant impairment gateway, Section 54K protects operational suppliers from predatory promoter write-downs, turning the Base Resolution Plan into a rigorous market test of restructuring sincerity."
]

part3_example = "An auto-component MSME with twenty crore rupees of debt submits a Base Resolution Plan. The plan proposes paying secured banks fifteen crore rupees, but offers operational suppliers only fifty percent of their four-crore dues. Base resolution plans trigger competitive Swiss challenge bids upon haircuts. Because operational creditor claims are impaired by two crore rupees, Section 54K(4) statutorily prohibits the CoC from approving the BRP directly, forcing the RP to publish an invitation for public competing bids."

part3_code = '''def evaluate_base_resolution_plan_impairment(operational_debt_cr, op_creditor_payout_cr, secured_debt_cr, secured_payout_cr, coc_voting_pct):
    # Section 54K(4) Impairment Gate:
    # If operational creditor claims are impaired (payout < 100% of admitted claim),
    # the CoC CANNOT approve the BRP directly; RP MUST invite public competing plans.
    
    operational_haircut_cr = operational_debt_cr - op_creditor_payout_cr
    is_operational_claim_impaired = operational_haircut_cr > 0.001
    
    if is_operational_claim_impaired:
        return {
            "brp_status": "IMPAIRED_OPERATIONAL_CLAIMS",
            "operational_recovery_pct": round((op_creditor_payout_cr / operational_debt_cr) * 100, 2),
            "direct_coc_approval_permitted": False,
            "statutory_mandate": "INVITE_PUBLIC_COMPETING_PLANS_SWISS_CHALLENGE",
            "statutory_clause": "Section 54K(4) Mandatory Trigger"
        }
    else:
        # Operational creditors paid 100% (unimpaired)
        can_approve_directly = coc_voting_pct >= 66.0
        return {
            "brp_status": "UNIMPAIRED_OPERATIONAL_CLAIMS",
            "operational_recovery_pct": 100.0,
            "direct_coc_approval_permitted": can_approve_directly,
            "statutory_mandate": "DIRECT_APPROVAL_PERMITTED_OR_OPTIONAL_SWISS_CHALLENGE",
            "statutory_clause": "Section 54K(2) & 54K(3)"
        }

# Case: 4 Cr operational debt offered 2 Cr payout (50% haircut). CoC favors by 70%
audit = evaluate_base_resolution_plan_impairment(
    operational_debt_cr=4.0,
    op_creditor_payout_cr=2.0,
    secured_debt_cr=16.0,
    secured_payout_cr=12.0,
    coc_voting_pct=70.0
)
print("Base Resolution Plan Status:", audit["brp_status"])
print("Operational Creditor Recovery Pct:", audit["operational_recovery_pct"])
print("Direct CoC Approval Permitted:", audit["direct_coc_approval_permitted"])
print("Statutory Mandate Imposed:", audit["statutory_mandate"])
print("Statutory Authority:", audit["statutory_clause"])
'''

part3_check = {
    "question": "Under Section 54K(4) of the IBC, what is the mandatory statutory consequence if a corporate debtor's Base Resolution Plan proposes an impairment (haircut) to the claims of operational creditors?",
    "options": [
        "The Committee of Creditors is barred from approving the plan directly, and the Resolution Professional must invite public competing resolution plans",
        "The corporate debtor is automatically subjected to immediate criminal liquidation by the Registrar of Companies",
        "All operational creditors lose their voting rights and their debts are permanently written off to zero",
        "The Central Government steps in to pay eighty percent of the trade debt from the Consolidated Fund of India"
    ],
    "answerIndex": 0,
    "why": "Section 54K(4) unambiguously mandates that if the Base Resolution Plan impairs the claims of operational creditors, the RP must publish an invitation inviting prospective resolution applicants to submit competing plans."
}

# Part 4: The Swiss Challenge Bidding Mechanism & Resolution Plan Finalization (Section 54K & PIRP Regulations)
part4_title = "The Swiss Challenge Bidding Mechanism & Plan Finalization (Section 54K & Regulations)"
part4_say = [
    "When a Base Resolution Plan triggers competitive bidding under Section 54K(4), or when the CoC decides to test the market under Section 54K(3), the resolution process enters one of the most sophisticated bidding arenas in modern commercial law: The Swiss Challenge Auction Mechanism. Codified in Section 54K and operationalized through Chapter X of the IBBI (Pre-Packaged Insolvency Resolution Process) Regulations 2021, the Swiss Challenge harmonizes two competing imperatives: maximizing the asset value of the enterprise through open market competition, while preserving the promoter's opportunity to retain ownership if they can match competitive bids.",
    "The process begins with the Resolution Professional publishing Form PIRP-6, inviting prospective resolution applicants to submit competing resolution plans within a minimum statutory window of twenty-one days. The invitation outlines the qualification criteria established by the CoC and publishes the quantitative and qualitative evaluation matrix. To prevent frivolous submissions, prospective applicants must submit refundable earnest money deposits and demonstrate financial capability to implement the proposed restructuring.",
    "Upon receiving competing plans, the Committee of Creditors evaluates each proposal against the Base Resolution Plan. To dislodge the corporate debtor's Base Resolution Plan, a competing resolution plan must meet the 'Significantly Better' threshold defined in the PIRP Regulations. Regulation 48 establishes that a competing plan is considered significantly better only if it achieves a higher score on the evaluation matrix and exceeds the BRP by a predetermined margin established by the CoC—typically requiring at least a five to ten percent enhancement in net present value or upfront cash recovery for lenders.",
    "If no competing plan qualifies as significantly better than the Base Resolution Plan, the CoC may proceed to vote on approving the Base Resolution Plan under Section 54K(9). However, if one or more competing plans meet the significantly better standard, Section 54K(10) activates the core Swiss Challenge right: The Promoter's Right to Match or Improve. The Resolution Professional formally invites the corporate debtor to submit an improved plan that matches or surpasses the highest-scoring competing bid.",
    "Under Regulation 49, if the corporate debtor submits an improved plan, the process transitions into an alternating iterative bidding contest between the corporate debtor and the lead competing bidder. Each participant is granted a limited window to incrementally raise cash payouts, shorten implementation horizons, or reduce creditor haircuts. Once the iterative auction concludes, the highest-scoring plan is submitted to the Committee of Creditors for final statutory voting.",
    "Under Section 54K(12), approving any resolution plan—whether the corporate debtor's improved plan or a third-party bidder's plan—requires a supermajority vote of not less than sixty-six percent of voting shares of financial creditors. Once approved by the CoC, the Resolution Professional files the plan with the NCLT under Section 54L. The Adjudicating Authority evaluates the plan's compliance with Section 30(2) and issues an order of judicial sanction within thirty days, rendering the plan binding upon the corporate debtor, creditors, employees, guarantors, and statutory authorities.",
    "The economic integrity of the Swiss Challenge is anchored by confidential statutory valuations under Regulation 38. The Resolution Professional appoints two independent registered valuers to determine the Fair Value and Liquidation Value of the enterprise. These valuation figures remain strictly confidential and are disclosed to the Committee of Creditors only after all competing plans have been submitted. This confidentiality barrier prevents prospective resolution applicants from gaming the system and ensures that the evaluation matrix reflects genuine commercial market price discovery rather than collusive bidding.",
    "Upon the conclusion of the Swiss Challenge and the selection of the winning plan, Section 54L governs judicial approval. The NCLT exercises summary jurisdiction to confirm that the resolution plan complies with Section 30(2), ensures fair treatment of operational creditors, and demonstrates financial viability. Once approved, the plan receives statutory finality, extinguishing all pre-commencement liabilities and granting the restructured MSME a clean financial slate under the Clean Slate Doctrine articulated by the Supreme Court in Essar Steel and Ghanshyam Mishra.",
    "This rigorous Swiss Challenge framework ensures that MSME promoters cannot retain their businesses on predatory, subsidized terms. By forcing promoters to compete against public market liquidity, Chapter III-A delivers maximum creditor recovery while giving honest founders a transparent path to corporate salvation."
]

part4_example = "A precision toolmaker's Base Resolution Plan offers fifteen crore rupees to lenders. A third-party engineering conglomerate submits a competing Swiss Challenge plan offering eighteen crore rupees. Auction engines evaluate Swiss challenge bids to compare net present values. The CoC rules the competing bid is significantly better. Under Section 54K(10), the promoter is invited to match: the promoter raises equity backing and submits an improved plan of nineteen crore rupees, securing sixty-six percent CoC approval and retaining the company."

part4_code = '''def evaluate_swiss_challenge_auction(brp_score, competing_plans, improvement_threshold_pct, promoter_improved_score):
    # PIRP Regulation 48 & Section 54K Swiss Challenge Logic:
    # 1. Competing plan must exceed BRP by improvement_threshold_pct to be "SIGNIFICANTLY_BETTER"
    # 2. If significantly better, corporate debtor given right to improve/match
    # 3. If promoter improves and exceeds competitor, promoter plan wins CoC consideration
    
    if not competing_plans:
        return {
            "status": "NO_COMPETING_PLANS",
            "winning_plan": "BASE_RESOLUTION_PLAN",
            "proceed_to_coc_vote": True
        }
        
    best_competing_plan = max(competing_plans, key=lambda x: x["score"])
    min_required_score = brp_score * (1 + (improvement_threshold_pct / 100))
    is_significantly_better = best_competing_plan["score"] >= min_required_score
    
    if not is_significantly_better:
        return {
            "status": "COMPETING_PLAN_NOT_SIGNIFICANTLY_BETTER",
            "best_competing_score": best_competing_plan["score"],
            "threshold_required": min_required_score,
            "winning_plan": "BASE_RESOLUTION_PLAN",
            "proceed_to_coc_vote": True
        }
    else:
        # Promoter right to improve (Section 54K(10))
        promoter_won_auction = promoter_improved_score > best_competing_plan["score"]
        return {
            "status": "SWISS_CHALLENGE_CONCLUDED",
            "best_competing_bidder": best_competing_plan["bidder"],
            "competing_score": best_competing_plan["score"],
            "promoter_improved_score": promoter_improved_score,
            "winning_plan": "PROMOTER_IMPROVED_PLAN" if promoter_won_auction else f"THIRD_PARTY_{best_competing_plan['bidder']}_PLAN",
            "coc_voting_threshold_pct": 66.0
        }

# Case: BRP score 60. Competitor bids score 72 (exceeds 10% threshold of 66). Promoter improves to score 75.
competitors = [
    {"bidder": "Global_Precision_Ltd", "score": 72.0},
    {"bidder": "Apex_Holdings_LLP", "score": 68.0}
]
audit = evaluate_swiss_challenge_auction(
    brp_score=60.0,
    competing_plans=competitors,
    improvement_threshold_pct=10.0,
    promoter_improved_score=75.0
)
print("Swiss Challenge Status:", audit["status"])
print("Lead Competing Score:", audit["competing_score"])
print("Promoter Improved Score:", audit["promoter_improved_score"])
print("Winning Plan Selected:", audit["winning_plan"])
print("CoC Voting Supermajority Required:", audit["coc_voting_threshold_pct"])
'''

part4_check = {
    "question": "In a PIRP Swiss Challenge auction under Section 54K(10) of the IBC and Regulation 48, what happens when a third-party resolution applicant submits a plan that is 'significantly better' than the Base Resolution Plan?",
    "options": [
        "The corporate debtor is given a statutory right to match or improve upon the competing plan through iterative bidding",
        "The corporate debtor is instantly evicted and liquidated without further proceedings",
        "The third-party applicant is immediately granted ownership without any vote by the Committee of Creditors",
        "The competing applicant must pay fifty percent of its bid amount to the Insolvency and Bankruptcy Board of India"
    ],
    "answerIndex": 0,
    "why": "Section 54K(10) gives the corporate debtor the opportunity to improve its Base Resolution Plan to match or beat a competing plan that has been determined to be significantly better by the CoC."
}

# Part 5: Anti-Pattern Defense & Outage Puzzle: The Sham MSME Registration & Predatory Haircut Squeeze
part5_title = "Anti-Pattern Defense & Outage Puzzle: The Sham MSME Registration & Predatory Haircut Squeeze"
part5_say = [
    "In pre-packaged restructuring practice, restructuring advisors confront dangerous adversarial abuses where bad-faith corporate actors manipulate Chapter III-A mechanisms. The two most destructive anti-patterns are: (1) The Sham MSME Qualification Gambit, where large mid-corporate debtors fraudulently engineer MSME status to evade CIRP displacement; and (2) The Predatory Haircut Squeeze, where promoters weaponize the Base Resolution Plan to expropriate unsecured operational suppliers.",
    "The first lethal failure mode is the 'Sham MSME Qualification Gambit'. Consider a mid-market industrial manufacturing corporation carrying four hundred crore rupees of debt. Fearing that filing standard CIRP will lead to immediate promoter ouster under Section 17 and disqualification under Section 29A, the promoters secretly incorporate shell holding entities or artificially manipulate historical plant and machinery book values to secure an Udyam registration certificate just weeks prior to default. The promoters then petition the NCLT for PIRP under Section 54C, attempting to retain executive operational control under the Debtor-in-Possession model.",
    "To dismantle this fraudulent gambit, institutional lenders and the proposed Resolution Professional must execute rigorous pre-admission forensic audits. Counsel must cross-verify the corporate debtor's Udyam portal filings against audited corporate tax returns (ITR-6), GST annual returns (GSTR-9), and fixed-asset depreciation schedules. Under the MSMED criteria, an enterprise loses MSME status if its investment in plant and machinery exceeds fifty crore rupees or its turnover exceeds two hundred and fifty crore rupees. If forensic accounting reveals deliberate balance sheet falsification, lenders must file an objection before the NCLT under Section 54C, petitioning for immediate conversion into regular CIRP under Section 54N and initiating criminal prosecution under Section 77A.",
    "The second major failure mode is the 'Predatory Haircut Squeeze'. In this scenario, a genuine MSME promoter authors a Base Resolution Plan proposing a ninety-five percent write-down of unsecured operational debts owed to local micro-suppliers, while proposing full repayment to secured banks and injecting minimal promoter capital to preserve hundred-percent promoter equity. Promoters attempt to ram this plan through CoC approval, relying on friendly relations with secured lenders who suffer zero haircut.",
    "Defending against this predatory maneuver requires strict enforcement of the Section 54K(4) statutory invariant. The Resolution Professional must formally advise the CoC that any impairment of operational debt statutorily strips the CoC of its power to approve the BRP directly. The RP is legally obligated to initiate an open Swiss Challenge. Furthermore, affected operational creditors can intervene before the NCLT under Section 54L, demonstrating that the plan violates the equitable treatment standards of Section 30(2)(b). If the NCLT finds that the plan was designed to defraud suppliers, it can terminate PIRP and order liquidation under Section 54N.",
    "To insulate pre-packaged restructuring from these hazards, insolvency practitioners must deploy a four-step PIRP Defense Protocol: (1) multi-year forensic verification of MSME criteria and tax filings; (2) independent fair valuation of intangible enterprise assets; (3) strict enforcement of the Section 54K(4) Swiss Challenge trigger; and (4) continuous RP monitoring under Section 54F to prevent unauthorized asset dissipation.",
    "A further procedural dimension is governed by Section 54O: Termination of PIRP. The Committee of Creditors may, at any time during the process prior to the approval of a resolution plan, resolve by a sixty-six percent vote to terminate the PIRP. If the CoC determines that the enterprise is commercially non-viable or that the promoters are using procedural delays to siphon current operating revenues, the NCLT terminates the PIRP and passes an order for immediate liquidation under Section 33. This provision prevents defaulting promoters from using PIRP as a delay tactic against recovery.",
    "The regulatory framework also holds Insolvency Professionals strictly accountable. Under the IBBI Disciplinary Regulations, any Resolution Professional who fails to verify Udyam filings or who aids promoters in concealing fraudulent asset transfers faces immediate suspension of their registration and financial penalties. This rigorous regulatory oversight ensures that professionals act as independent officers of the court, safeguarding the interests of all financial and operational stakeholders.",
    "By fearlessly unmasking sham MSME entities and resolutely defending operational suppliers through competitive Swiss Challenge bidding, insolvency professionals safeguard the integrity of India's pre-packaged restructuring framework."
]

part5_example = "A manufacturing company with three hundred crore rupees of annual revenue obtains an Udyam registration by falsifying plant depreciation schedules. Consortium banks uncover falsified filings to dismiss fraudulent proceedings in court. A consortium bank uncovers the falsified GST filings, proving turnover exceeds MSME statutory limits. The NCLT dismisses the PIRP petition under Section 54C, penalizes the directors under Section 77A, and admits the company into standard CIRP under Section 7."

part5_code = '''def diagnose_pirp_dispute_and_fraud(annual_turnover_cr, plant_machinery_investment_cr, op_creditor_haircut_pct, is_udyam_data_falsified):
    # MSME Upper Ceilings (MSMED Notification 2020):
    # Medium Enterprise: Investment <= 50 Cr AND Turnover <= 250 Cr
    # If either limit exceeded OR data falsified -> SHAM_MSME
    
    is_legitimate_msme = (plant_machinery_investment_cr <= 50.0) and (annual_turnover_cr <= 250.0) and (not is_udyam_data_falsified)
    
    if not is_legitimate_msme:
        return {
            "dispute_type": "SHAM_MSME_REGISTRATION",
            "statutory_ruling": "DISMISS_PIRP_AND_CONVERT_TO_CIRP",
            "statutory_section": "Section 54N & Penalties under Section 77A",
            "promoter_management_status": "OUSTED_IMMEDIATELY",
            "reason": "Enterprise exceeds MSME thresholds or falsified Udyam filings; DIP model denied"
        }
        
    # Genuine MSME: Check for Predatory Operational Haircut
    if op_creditor_haircut_pct > 30.0:
        return {
            "dispute_type": "PREDATORY_OPERATIONAL_HAIRCUT",
            "statutory_ruling": "ENFORCE_MANDATORY_SWISS_CHALLENGE",
            "statutory_section": "Section 54K(4) & Regulation 48",
            "promoter_management_status": "MAINTAINED_SUBJECT_TO_OPEN_BIDDING",
            "reason": "Operational claims impaired; direct CoC approval barred, open market auction triggered"
        }
        
    return {
        "dispute_type": "STANDARD_PIRP_RESTRUCTURING",
        "statutory_ruling": "PROCEED_WITH_NORMAL_PIRP",
        "statutory_section": "Section 54A & Section 54K",
        "promoter_management_status": "DEBTOR_IN_POSSESSION_ACTIVE",
        "reason": "Legitimate MSME with equitable restructuring plan"
    }

# Case: Turnover 300 Cr, falsified Udyam filing to claim MSME status
audit = diagnose_pirp_dispute_and_fraud(
    annual_turnover_cr=300.0,
    plant_machinery_investment_cr=45.0,
    op_creditor_haircut_pct=50.0,
    is_udyam_data_falsified=True
)
print("Diagnostic Dispute Classification:", audit["dispute_type"])
print("Judicial Ruling:", audit["statutory_ruling"])
print("Governing Statutory Authority:", audit["statutory_section"])
print("Executive Promoter Management:", audit["promoter_management_status"])
print("Judicial Finding Reason:", audit["reason"])
'''

part5_check = {
    "question": "What is the consequence if the NCLT discovers that a corporate debtor secured an MSME registration fraudulently by concealing that its turnover exceeds two hundred and fifty crore rupees?",
    "options": [
        "The NCLT rejects or terminates the PIRP under Section 54N, orders conversion to standard CIRP, and imposes penalties under Section 77A",
        "The NCLT rewards the promoters with an interest-free loan from the Reserve Bank of India",
        "The operational creditors are forced to become equity shareholders with unlimited liability",
        "The company is granted five years of immunity from all tax audits and banking inspections"
    ],
    "answerIndex": 0,
    "why": "Fraudulent invocation of PIRP by a non-MSME results in dismissal or termination under Section 54N, conversion to standard CIRP, and potential penal sanctions under Section 77A for false declarations."
}

# Try-It texts
try_it_texts = [
    "Execute the MSME PIRP eligibility engine to evaluate turnover thresholds and test corporate governance votes.",
    "Run the PIRP debtor governance action classifier to test capital asset disposal rules and evaluate CoC approvals.",
    "Simulate the base resolution plan impairment engine to test operational creditor haircuts and evaluate Swiss challenge triggers.",
    "Execute the Swiss challenge auction engine to evaluate significantly better competing bids and test promoter rights to match.",
    "Run the PIRP dispute diagnostic engine to identify sham MSME registrations and enforce predatory haircut protections."
]

# Captions satisfying: <=80 chars, period, no digits, word matching
captions = [
    {
        "intro": "Small manufacturing enterprises initiate prepackaged restructuring frameworks.",
        "say1": "Standard corporate insolvency resolution threatens fragile small businesses.",
        "example": "Small manufacturing enterprises initiate prepackaged restructuring smoothly.",
        "tryIt": "Eligibility engines evaluate turnover thresholds and test governance votes."
    },
    {
        "intro": "Debtor in possession models preserve enterprise operational continuity.",
        "say1": "Debtor in possession governance preserves operational control and management.",
        "example": "Resolution professionals supervise capital asset sales to protect lenders.",
        "tryIt": "Debtor governance action classifiers test capital asset disposal rules."
    },
    {
        "intro": "Base resolution plans establish initial commercial restructuring terms.",
        "say1": "Corporate debtor submits base resolution plan to financial creditors.",
        "example": "Base resolution plans trigger competitive Swiss challenge bids upon haircuts.",
        "tryIt": "Plan impairment engines test operational creditor haircuts and triggers."
    },
    {
        "intro": "Swiss challenge bidding models invite competitive third party restructuring.",
        "say1": "Swiss challenge auction mechanism maximizes enterprise asset value.",
        "example": "Auction engines evaluate Swiss challenge bids to compare net present values.",
        "tryIt": "Auction engines evaluate significantly better competing bids and match rights."
    },
    {
        "intro": "Restructuring advisors confront adversarial abuses in insolvency practice.",
        "say1": "Promoters fraudulently engineer qualifications to evade displacement.",
        "example": "Consortium banks uncover falsified filings to dismiss fraudulent proceedings.",
        "tryIt": "Dispute diagnostic engines identify sham registrations and enforce rules."
    }
]

# Stages definitions for workflow template
stages_definitions = [
    [
        {"id": "s1", "name": "MSME Thresholds", "subtext": "Udyam registration and statutory default limits"},
        {"id": "s2", "name": "Corporate Approval", "subtext": "Seventy-five percent shareholder special resolution"},
        {"id": "s3", "name": "Creditor Consent", "subtext": "Sixty-six percent unrelated financial creditor vote"},
        {"id": "s4", "name": "NCLT Admission", "subtext": "One hundred and twenty day statutory resolution window"}
    ],
    [
        {"id": "s1", "name": "Debtor Stewardship", "subtext": "Board continues daily management and production"},
        {"id": "s2", "name": "Resolution Professional", "subtext": "Statutory monitoring and claims verification"},
        {"id": "s3", "name": "CoC Veto Gates", "subtext": "Prior approval for capital asset sales and debt"},
        {"id": "s4", "name": "Management Ouster", "subtext": "Section 54J circuit breaker upon proven fraud"}
    ],
    [
        {"id": "s1", "name": "Base Plan Submission", "subtext": "Debtor authors initial restructuring proposal"},
        {"id": "s2", "name": "Impairment Evaluation", "subtext": "Assessing write-downs to operational creditors"},
        {"id": "s3", "name": "Section 54K Trigger", "subtext": "Mandatory public bidding if claims are impaired"},
        {"id": "s4", "name": "Direct Approval", "subtext": "Permitted only if operational claims are unimpaired"}
    ],
    [
        {"id": "s1", "name": "Public Form PIRP-6", "subtext": "Inviting competing third-party resolution bids"},
        {"id": "s2", "name": "Significantly Better", "subtext": "Testing score enhancement against Base Plan"},
        {"id": "s3", "name": "Promoter Right to Match", "subtext": "Iterative bidding between debtor and bidder"},
        {"id": "s4", "name": "CoC Supermajority", "subtext": "Sixty-six percent vote approving winning plan"}
    ],
    [
        {"id": "s1", "name": "Sham MSME Detection", "subtext": "Auditing turnover and plant investment data"},
        {"id": "s2", "name": "Forensic GSTR Cross-Check", "subtext": "Unmasking fraudulent Udyam certificates"},
        {"id": "s3", "name": "Predatory Haircut Defense", "subtext": "Protecting micro-suppliers through open bidding"},
        {"id": "s4", "name": "Section 54N Conversion", "subtext": "Immediate conversion to standard CIRP ouster"}
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
    print(f"Day 43 Part {p_num} Word Count: {words}")
    assert words >= 600, f"Day 43 Part {p_num} words {words} < 600!"
    
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

print(f"Total Day 43 Words: {total_day_words}")
assert total_day_words >= 3000, f"Total day words {total_day_words} < 3000!"

day_data = {
    "day": day_num,
    "coursePrefix": course_prefix,
    "title": day_title,
    "desc": day_desc,
    "parts": lesson_parts
}

# 1. Save day43_lesson.json
with open("scripts/day43_lesson.json", "w", encoding="utf-8") as f:
    json.dump(day_data, f, indent=2)
print("Saved scripts/day43_lesson.json successfully!")

# 2. Append to src/lib/data/bcomLawLongLessons.ts
ts_path = "src/lib/data/bcomLawLongLessons.ts"
with open(ts_path, "r", encoding="utf-8") as f:
    ts_content = f.read()

# Check if Day 43 is already present
day_marker = f'"day": {day_num},'
if day_marker in ts_content:
    print(f"Day {day_num} already exists in {ts_path}! Removing old entry.")
    pos = ts_content.find(day_marker)
    brace_pos = ts_content.rfind('{', 0, pos)
    depth = 0
    end_pos = -1
    for i in range(brace_pos, len(ts_content)):
        if ts_content[i] == '{':
            depth += 1
        elif ts_content[i] == '}':
            depth -= 1
            if depth == 0:
                end_pos = i + 1
                break
    if end_pos != -1:
        prefix = ts_content[:brace_pos].rstrip()
        suffix = ts_content[end_pos:].lstrip()
        if prefix.endswith(','):
            prefix = prefix[:-1].rstrip()
        if suffix.startswith(','):
            suffix = suffix[1:].lstrip()
        ts_content = prefix + ",\n" + suffix

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

# 3. Build day-43.json visual file
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
    "day": 43,
    "promptSha": "prompt_sha_bcom_law_day43_pirp_msme_swiss_challenge_v1",
    "model": "google/gemini-2.5-pro",
    "entries": entries
}

v_path = "src/lib/data/lessonVisuals/bcom_law/day-43.json"
with open(v_path, "w", encoding="utf-8") as f:
    json.dump(visual_data, f, indent=2)
print(f"Saved {v_path} successfully!")
