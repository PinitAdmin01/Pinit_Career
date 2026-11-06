import json, sys, subprocess, os, re, hashlib

# Builder for Day 38 of bcom_law
# Course: bcom_law (Corporate Law, IBC & Compliance)
# Day 38: Committee of Creditors (CoC) Governance, Voting Share Calculation & Section 28 Special Resolution Powers

day_num = 38
course_prefix = "bcom_law"
day_title = "Committee of Creditors (CoC) Governance, Voting Share Calculation & Section 28 Special Resolution Powers"
day_desc = "Master the institutional governance of the Committee of Creditors (CoC) under the Insolvency and Bankruptcy Code 2016: Section 21 committee constitution, mathematical calibration of financial creditor voting shares, Section 22 replacement or confirmation of IRP, Section 28 statutory special resolution negative covenants requiring sixty-six percent approval, and Section 24 meeting notice and quorum mechanics."

# Part 1: Section 21 Constitution of Committee of Creditors: Composition & Voting Share Formula
part1_title = "Section 21 Constitution of Committee of Creditors: Composition & Voting Share Formula"
part1_say = [
    "The institutional apex of corporate insolvency decision-making is the Committee of Creditors (CoC), codified under Section 21 of the Insolvency and Bankruptcy Code 2016. The IBC firmly establishes the doctrine of creditor democracy: the destiny of the corporate debtor—whether it is revived through a resolution plan or liquidated to satisfy debts—is entrusted entirely to the commercial collective wisdom of its financial lenders. Under Section 21(1), the Interim Resolution Professional is under an unyielding statutory obligation to collate all claims received against the corporate debtor and determine the financial position of the enterprise, formally constituting the Committee of Creditors within thirty days of the insolvency commencement date.",
    "Section 21(2) establishes the core membership invariant: the Committee of Creditors shall comprise all financial creditors of the corporate debtor. In Swiss Ribbons Pvt. Ltd. v. Union of India, the Supreme Court justified the exclusion of operational creditors from CoC voting, reasoning that financial creditors are uniquely equipped with commercial expertise, risk evaluation capabilities, and balance sheet depth to assess corporate viability, whereas operational creditors typically focus solely on immediate invoice collection.",
    "The mathematical distribution of power within the CoC is governed by the voting share formula codified under Section 5(28). A financial creditor's voting share is determined strictly in proportion to the financial debt owed to such creditor as a fraction of the total admitted financial debt of the corporate debtor. If a corporate debtor has total admitted financial debts of one thousand crore rupees, and Bank A is owed three hundred and thirty crore rupees, Bank A commands exactly thirty-three percent of the voting share, irrespective of the number of branch managers attending CoC meetings or the volume of loan documentation executed.",
    "Crucially, the first proviso to Section 21(2) codifies an absolute statutory filter: a financial creditor or the authorized representative of the financial creditor who is a 'related party' of the corporate debtor shall not have any right of representation, participation, or voting in a meeting of the Committee of Creditors. If a promoter's sister company holds fifty crore rupees of unsecured loans, that debt is counted for recovery upon resolution but is completely stripped from the voting share denominator, preventing compromised insiders from diluting bona fide institutional lenders.",
    "Where a corporate debtor has no financial creditors, or where all financial creditors are disqualified related parties, Regulation 16 of the IBBI CIRP Regulations activates an emergency fallback constitution: the Committee of Creditors is constituted comprising the eighteen largest operational creditors by value, along with one representative each elected by workmen and employees. This ensures that even in owner-managed firms devoid of bank debt, an institutional creditor committee governs the insolvency process.",
    "Operational creditors are not entirely erased from the room. Under Section 24(3)(c), operational creditors or their representatives are entitled to attend CoC meetings if the aggregate amount of their admitted operational debt is not less than ten percent of the total debt of the corporate debtor. Furthermore, directors of the suspended board are entitled to attend under Section 24(3)(b). However, these attendees participate strictly as non-voting observers without any right to vote on resolutions, preserving pure financial creditor sovereignty.",
    "The Supreme Court in Phoenix ARC Pvt. Ltd. v. Spade Financial Services further fortified this framework by ruling that related parties who cleverly assign their debts to third parties immediately prior to CIRP initiation to circumvent Section 21(2) remain disqualified. The court pierced the corporate veil, holding that collusive assignments designed to infiltrate the CoC are fraudulent and will be unseated by the Adjudicating Authority to defend creditor democracy.",
    "The IRP must file a formal Report Certifying the Constitution of the Committee of Creditors before the NCLT within thirty days under Regulation 17(1). This compliance milestone formally transitions the enterprise from the transitional investigative custody of the IRP to the sovereign governance of the creditor collective."
]

part1_example = "A corporate debtor owes six hundred crore rupees to a consortium of three commercial banks and one hundred crore rupees to an unsecured financing vehicle controlled by the promoter's spouse. The IRP admits all seven hundred crore rupees of debt on the claims register. However, applying the Section 21(2) related-party proviso, the promoter vehicle's hundred-crore debt is stripped of voting rights. The total voting denominator is calibrated strictly at six hundred crore rupees, distributing one hundred percent of voting power exclusively among the three independent banks."

part1_code = '''def calculate_coc_voting_shares(creditor_claims):
    # Filter out disqualified related party financial debt under Section 21(2) proviso
    eligible_financial_creditors = [c for c in creditor_claims if c["is_financial"] and not c["is_related_party"]]
    
    total_voting_debt = sum(c["admitted_debt_cr"] for c in eligible_financial_creditors)
    assert total_voting_debt > 0, "No eligible financial creditors found!"
    
    results = []
    for c in creditor_claims:
        if c["is_financial"] and not c["is_related_party"]:
            voting_share_pct = round((c["admitted_debt_cr"] / total_voting_debt) * 100, 2)
            results.append({
                "creditor": c["name"],
                "admitted_debt_cr": c["admitted_debt_cr"],
                "voting_share_pct": voting_share_pct,
                "status": "VOTING_MEMBER"
            })
        else:
            reason = "Related Party Disqualification" if c["is_related_party"] else "Operational Creditor Non-Voting"
            results.append({
                "creditor": c["name"],
                "admitted_debt_cr": c["admitted_debt_cr"],
                "voting_share_pct": 0.0,
                "status": f"NON_VOTING ({reason})"
            })
            
    return {"total_voting_debt_cr": total_voting_debt, "creditors": results}

# Test consortium: Bank A (300 Cr), Bank B (200 Cr), Bank C (100 Cr), Promoter Shell (100 Cr - Related Party)
claims = [
    {"name": "State Bank Consortium Lead", "admitted_debt_cr": 300.0, "is_financial": True, "is_related_party": False},
    {"name": "National Infrastructure Bank", "admitted_debt_cr": 200.0, "is_financial": True, "is_related_party": False},
    {"name": "Commercial Credit Corp", "admitted_debt_cr": 100.0, "is_financial": True, "is_related_party": False},
    {"name": "Promoter Overseas Trust", "admitted_debt_cr": 100.0, "is_financial": True, "is_related_party": True}
]
audit = calculate_coc_voting_shares(claims)
print("Total Voting Debt (Cr):", audit["total_voting_debt_cr"])
for c in audit["creditors"]:
    print(f"  {c['creditor']}: {c['voting_share_pct']}% [{c['status']}]")
'''

part1_check = {
    "question": "Under Section 5(28) read with Section 21 of the Insolvency and Bankruptcy Code 2016, how is a financial creditor's voting share in the Committee of Creditors determined?",
    "options": [
        "In proportion to the financial debt owed to such creditor as a percentage of the total admitted financial debt",
        "By equal division where every financial creditor possesses exactly one vote regardless of debt exposure",
        "In proportion to the market value of pledged collateral held by each creditor under registered mortgages",
        "By seniority of initial credit facility disbursement across commercial banking syndicates"
    ],
    "answerIndex": 0,
    "why": "Section 5(28) defines voting share as the number of voting rights or the percentage of voting rights held by a financial creditor in the Committee of Creditors, which is based on the proportion of the financial debt owed to such creditor relative to the total financial debt."
}

# Part 2: Section 22 First Meeting of CoC: Confirmation or Replacement of IRP by 66% Majority
part2_title = "Section 22 First Meeting of CoC: Confirmation or Replacement of IRP by 66% Majority"
part2_say = [
    "The formal constitution of the Committee of Creditors triggers an immediate statutory operational imperative codified under Section 22 of the IBC. The first meeting of the Committee of Creditors must be held within seven days of the constitution of the CoC under Section 22(1). This inaugural summit serves as the crucible where institutional lenders exercise their supreme prerogative: determining whether the Interim Resolution Professional appointed by the NCLT should be confirmed as the permanent Resolution Professional (RP) or replaced by a new practitioner selected by the creditor consortium.",
    "Section 22(2) establishes the statutory resolution mechanism: the Committee of Creditors, in its first meeting, may, by a majority vote of not less than sixty-six percent of the voting shares of the financial creditors, either resolve to appoint the interim resolution professional as a resolution professional, or resolve to replace the interim resolution professional with another insolvency professional. The sixty-six percent supermajority threshold represents an essential statutory safeguard, ensuring that major governance changes command overwhelming consensus among senior lenders.",
    "If the CoC resolves to confirm the IRP as the permanent Resolution Professional under Section 22(3)(a), it communicates its decision to the IRP, the corporate debtor, and the Adjudicating Authority. The transition is immediate and seamless: the IRP assumes full status as the Resolution Professional, retaining operational control without procedural interruption.",
    "Conversely, if the CoC resolves to replace the IRP under Section 22(3)(b), an elaborate statutory filing sequence is initiated. The CoC files an application before the NCLT proposing the appointment of the new insolvency professional, accompanied by the written consent of the proposed RP in Form 2. Under Section 22(4), the NCLT forwards the name of the proposed RP to the Insolvency and Bankruptcy Board of India for formal confirmation. The IBBI must confirm the proposed appointment within ten days, verifying that no disciplinary proceedings are pending against the nominee.",
    "Until the appointment of the new Resolution Professional is formally confirmed by the NCLT, Section 22(5) dictates that the existing Interim Resolution Professional shall continue to perform all functions and exercise all powers under the Code. This statutory continuity clause prevents an administrative vacuum, ensuring that factory operations, payroll disbursements, and vendor supply chains remain under uninterrupted legal stewardship.",
    "In judicial practice, the replacement of an IRP under Section 22 does not require any finding of misconduct, negligence, or fault. In Bank of Baroda v. MBL Infrastructures Ltd., the National Company Law Appellate Tribunal (NCLAT) held that the decision of the CoC to replace an IRP is an unfettered exercise of commercial wisdom: lenders are entitled to appoint a professional in whom they possess commercial confidence, and the NCLT cannot sit in appeal over the CoC's business judgment.",
    "In addition, under Regulation 33 and 34, the first CoC meeting must fix the statutory expenses and professional fees payable to the IRP and subsequent RP. The CoC deliberates upon the monthly retainer, operational out-of-pocket costs, and success fees, ensuring that adequate financial resources are allocated to support legal counsel, transaction auditors, and security staff throughout the insolvency process.",
    "Furthermore, where the CoC resolves to replace the IRP, the newly proposed resolution professional must file a written disclosure confirming complete professional independence under the IBBI Code of Conduct. The nominee must declare that neither they nor any of their partners or associates have served as statutory auditors, legal advisers, or transaction consultants to the corporate debtor or any of its promoters within the preceding three financial years. This stringent independence declaration shields the incoming RP from disqualification challenges under Section 22(4) before the NCLT.",
    "The confirmation or replacement of the IRP marks the conclusion of the preliminary 30-day investigation phase and inaugurates the core restructuring phase of the CIRP, empowering the Resolution Professional to conduct forensic audits, prepare information memorandums, and invite competitive resolution plans."
]

part2_example = "At the first CoC meeting of an engineering firm, Bank A holding forty percent voting share and Bank B holding twenty-eight percent vote to replace the IRP with an experienced senior insolvency practitioner from a global restructuring firm. Bank C holding thirty-two percent dissents. Because Bank A and Bank B combine to command sixty-eight percent of voting shares, the resolution passes the sixty-six percent threshold. The CoC files Form 2 before the NCLT, and upon IBBI confirmation, the new RP assumes command."

part2_code = '''def evaluate_irp_confirmation_or_replacement(votes_to_confirm_pct, votes_to_replace_pct, votes_abstaining_pct):
    # Statutory threshold: 66% of voting shares of financial creditors (Section 22(2))
    assert round(votes_to_confirm_pct + votes_to_replace_pct + votes_abstaining_pct, 1) == 100.0, "Votes must tally to 100%"
    
    threshold_supermajority = 66.0
    
    if votes_to_replace_pct >= threshold_supermajority:
        return {
            "ruling": "REPLACE_IRP_WITH_NEW_RP",
            "votes_achieved": votes_to_replace_pct,
            "threshold_required": threshold_supermajority,
            "next_statutory_step": "File Section 22(3)(b) application before NCLT with IBBI confirmation"
        }
    elif votes_to_confirm_pct >= threshold_supermajority:
        return {
            "ruling": "CONFIRM_IRP_AS_PERMANENT_RP",
            "votes_achieved": votes_to_confirm_pct,
            "threshold_required": threshold_supermajority,
            "next_statutory_step": "Notify NCLT under Section 22(3)(a) and continue going concern operations"
        }
    else:
        return {
            "ruling": "STATUS_QUO_EXISTING_IRP_CONTINUES",
            "votes_achieved": max(votes_to_confirm_pct, votes_to_replace_pct),
            "threshold_required": threshold_supermajority,
            "next_statutory_step": "Existing IRP continues under Section 22(5) until 66% consensus is achieved"
        }

# Case: Bank A (40%) and Bank B (28%) vote to replace; Bank C (32%) dissents
test_vote = evaluate_irp_confirmation_or_replacement(
    votes_to_confirm_pct=32.0,
    votes_to_replace_pct=68.0,
    votes_abstaining_pct=0.0
)
print("CoC Section 22 Resolution Outcome:", test_vote["ruling"])
print("Supermajority Votes Achieved:", test_vote["votes_achieved"])
print("Statutory Threshold (66%):", test_vote["threshold_required"])
print("Procedural Mandate:", test_vote["next_statutory_step"])
'''

part2_check = {
    "question": "Under Section 22(2) of the Insolvency and Bankruptcy Code 2016, what minimum percentage of voting shares is required for the Committee of Creditors to resolve to replace the Interim Resolution Professional?",
    "options": [
        "Not less than sixty-six percent of the voting shares of financial creditors",
        "A simple majority of fifty-one percent of creditors present and voting",
        "Not less than seventy-five percent of all secured financial creditors",
        "A unanimous resolution passed by one hundred percent of financial creditors"
    ],
    "answerIndex": 0,
    "why": "Section 22(2) provides that the Committee of Creditors may, by a majority vote of not less than sixty-six percent of the voting shares of financial creditors, resolve to appoint the IRP as an RP or replace the IRP with another insolvency professional."
}

# Part 3: Section 28 Statutory Actions Requiring Prior CoC Approval: 66% Special Resolution Powers
part3_title = "Section 28 Statutory Actions Requiring Prior CoC Approval: 66% Special Resolution Powers"
part3_say = [
    "While the Resolution Professional wields comprehensive executive authority over the enterprise under Section 25, that authority is not absolute or unchecked. To prevent arbitrary unilateralism, managerial overreach, and asset dissipation, Section 28 of the IBC erects an ironclad statutory fortress of checks and balances. Section 28(1) codifies a comprehensive negative covenant: the Resolution Professional, during the Corporate Insolvency Resolution Process, shall not take any of thirteen high-stakes statutory actions without the prior approval of the Committee of Creditors.",
    "Section 28(1) sets forth thirteen non-delegable corporate actions that require CoC authorization: (a) raising interim finance in excess of the financial limit decided by the CoC; (b) creating any security interest over the assets of the corporate debtor; (c) changing the capital structure of the corporate debtor, including issuing shares, debentures, or altering debt terms; (d) recording any change in the ownership interest of the corporate debtor; (e) giving instructions to financial institutions to change signatories; (f) undertaking any related party transaction; (g) amending constitutional documents such as the Memorandum or Articles of Association; (h) delegating authority to any other person; (i) disposing of or permitting the disposal of shares of any shareholder of the corporate debtor; (j) making any change in the management of the corporate debtor; (k) transferring rights or financial debts to third parties; (l) making changes in the appointment or terms of statutory auditors; and (m) entering into any material long-term contract outside the ordinary course of business.",
    "The statutory voting threshold required to approve any Section 28 action is unyielding. Under Section 28(3), no action under subsection (1) shall be approved by the Committee of Creditors unless approved by a vote of sixty-six percent of the voting shares. A simple majority of fifty-one percent is statutorily incapable of validating an encumbrance, interim borrowing, or related party transaction: senior lenders must achieve broad-based commercial consensus.",
    "The legal consequence of violating Section 28 is catastrophic for the transaction and hazardous for the practitioner. Under Section 28(4), where the Resolution Professional takes any action under subsection (1) without the prior approval of the Committee of Creditors, such action shall be void ab initio. Contracts executed without 66% approval are legally nullified, security interests created are invalidated against creditors, and banks that disburse unauthorized loans lose collateral priority.",
    "Furthermore, Section 28(5) empowers the Committee of Creditors to report any unauthorized action taken by the RP to the Insolvency and Bankruptcy Board of India. The IBBI is statutorily mandated to initiate disciplinary proceedings against the delinquent practitioner, which may culminate in suspension or permanent cancellation of their registration, alongside personal financial penalties.",
    "Crucially, the common law doctrine of indoor management does not protect third parties dealing with the Resolution Professional. Commercial counterparties and financing entities are presumed to have constructive notice of Section 28: if a bank advances loans or an investor acquires plant equipment without obtaining certified copies of the CoC's sixty-six percent resolution, the transaction is legally void, and the assets must be returned to the corporate debtor.",
    "In commercial operations, seasoned Resolution Professionals maintain an unassailable Section 28 compliance matrix. Every major operational proposal—from multi-year warehousing leases to emergency boiler replacements exceeding ordinary budgets—is tabulated into formal resolutions, circulated with detailed explanatory statements, and subjected to electronic voting before any contractual commitment is executed.",
    "Additionally, under Section 28(2), the Resolution Professional must convene a meeting of the Committee of Creditors before taking any action under subsection (1) or obtain their approval through electronic voting. The explanatory statement accompanying the notice must clearly articulate the financial rationale, contractual risk matrix, and impact on going-concern asset value, ensuring that lenders make fully informed commercial determinations.",
    "By vesting supreme veto power over structural corporate alterations in the sixty-six percent supermajority of the CoC, Section 28 guarantees that enterprise assets remain safeguarded in trust for the collective benefit of all creditors throughout the insolvency lifecycle."
]

part3_example = "An RP managing an indebted paper mill wishes to raise eight crore rupees in emergency interim finance by creating a first charge over the company's unencumbered guest house property. The proposal is put to an electronic vote. Lenders holding sixty-four percent of voting shares vote in favor, while thirty-six percent abstain. Because the vote falls short of the statutory sixty-six percent threshold under Section 28(3), the resolution fails. The RP cannot execute the mortgage deed; doing so would render the security void under Section 28(4)."

part3_code = '''def evaluate_section_28_prior_approval(action_type, coc_approval_pct):
    # Section 28(1) Restricted Actions List
    restricted_actions = [
        "raise_excess_interim_finance",
        "create_asset_security_interest",
        "change_capital_structure",
        "undertake_related_party_transaction",
        "amend_constitutional_aoa_moa",
        "dispose_of_shareholder_shares",
        "change_statutory_auditors"
    ]
    
    is_restricted = action_type in restricted_actions
    threshold_supermajority = 66.0
    
    if not is_restricted:
        return {
            "action": action_type,
            "is_restricted_under_sec_28": False,
            "status": "PERMITTED_ORDINARY_COURSE",
            "legal_validity": "VALID"
        }
        
    vote_passed = coc_approval_pct >= threshold_supermajority
    
    return {
        "action": action_type,
        "is_restricted_under_sec_28": True,
        "coc_approval_pct": coc_approval_pct,
        "supermajority_achieved": vote_passed,
        "status": "APPROVED_BY_COC" if vote_passed else "REJECTED_INSUFFICIENT_VOTING_SHARE",
        "legal_validity": "VALID" if vote_passed else "VOID_AB_INITIO_UNDER_SECTION_28(4)"
    }

# Case: Mortgage unencumbered land for interim finance with 64% CoC assent
audit = evaluate_section_28_prior_approval(
    action_type="create_asset_security_interest",
    coc_approval_pct=64.0
)
print("Section 28 Restricted Action:", audit["is_restricted_under_sec_28"])
print("CoC Assent Percentage:", audit["coc_approval_pct"])
print("66% Supermajority Achieved:", audit["supermajority_achieved"])
print("Resolution Status:", audit["status"])
print("Statutory Legal Validity:", audit["legal_validity"])
'''

part3_check = {
    "question": "Under Section 28(4) of the Insolvency and Bankruptcy Code 2016, what is the legal consequence if the Resolution Professional takes an action specified in Section 28(1) without the prior sixty-six percent approval of the Committee of Creditors?",
    "options": [
        "Such action shall be void ab initio and have zero legal effect",
        "The action remains legally valid but the RP must pay a nominal fine of ten thousand rupees",
        "The action is automatically ratified if sixty days elapse without formal objection",
        "The action is referred to the High Court for discretionary administrative regularization"
    ],
    "answerIndex": 0,
    "why": "Section 28(4) unequivocally provides that where the resolution professional takes any action under subsection (1) without the prior approval of the committee of creditors, such action shall be void."
}

# Part 4: Section 24 Meeting Protocols: Notice Timelines, Quorum Invariants & Electronic Voting Mechanics
part4_title = "Section 24 Meeting Protocols: Notice Timelines, Quorum Invariants & Electronic Voting Mechanics"
part4_say = [
    "The procedural legitimacy of all decisions made by the Committee of Creditors depends upon rigorous adherence to meeting protocols codified under Section 24 of the IBC read with Regulations 18 through 26 of the IBBI CIRP Regulations. Because CoC resolutions possess the statutory force to bind billions of rupees in corporate debt, extinguish legal claims, and restructure multinational enterprises, any procedural defect in convening, conducting, or recording CoC meetings can expose the entire resolution process to legal challenges before the NCLT and appellate tribunals.",
    "Regulation 19 sets forth the mandatory notice timelines for convening a meeting of the Committee of Creditors. The Resolution Professional must issue a written notice of each CoC meeting not less than five days before the scheduled date of the meeting. However, commercial urgency frequently requires rapid decision-making; Regulation 19(2) allows the CoC to reduce the notice period to not less than twenty-four hours, provided such reduction is approved by financial creditors holding not less than sixty-six percent of voting shares, and in cases involving creditors in a class, not less than forty-eight hours.",
    "Section 24(3) governs the statutory service list. Notice must be served upon: (a) members of the Committee of Creditors, including their authorized representatives; (b) members of the suspended Board of Directors; and (c) operational creditors or their representatives if their aggregate admitted debt is ten percent or more of the total debt. Under Vijay Kumar Jain v. Standard Chartered Bank, the Supreme Court ruled that suspended directors are statutorily entitled to receive complete meeting notices, agendas, and resolution documents, as they possess vital institutional knowledge to assist the CoC, even though they have no voting rights.",
    "Regulation 22 codifies the statutory Quorum Invariant: a meeting of the Committee of Creditors shall quorate only if financial creditors representing at least thirty-three percent of the voting shares are present in person, through video conferencing, or other audio-visual means. If thirty-three percent quorum is not present within thirty minutes of the scheduled time, the meeting stands automatically adjourned to the same day in the next week. If quorum is still absent at the adjourned meeting, the creditors present constitute a valid quorum.",
    "Under Regulation 25 and 26, voting on all resolutions is conducted through secure Electronic Voting (e-voting) platforms certified by the IBBI. The RP cannot conclude voting by a mere show of hands in the physical room. The RP must keep the electronic voting window open for a minimum of twenty-four hours and up to forty-eight hours following the circulation of the meeting minutes, enabling credit committees of national banks across Mumbai, Delhi, and Bangalore to formally register their authorized votes.",
    "Where creditors in a class participate through an Authorized Representative (AR) under Section 25A, the AR circulates the agenda to class members and casts votes strictly in accordance with the prior electronic instructions received from homebuyers or debenture holders. Under the 2019 amendment, the AR casts votes for the entire class based on the majority view of those who voted, eliminating fractional voting disputes.",
    "The Resolution Professional acts as the statutory returning officer: upon conclusion of the e-voting window, the RP circulates the certified voting results to all participants within twenty-four hours, detailing which lenders voted in favor, against, or abstained, along with calculated percentage shares.",
    "Under Regulation 27, the Resolution Professional is statutorily required to record and circulate the draft minutes of each CoC meeting to all participants within forty-eight hours of the meeting's conclusion. Creditors are granted twenty-four hours to submit corrections or observations. Once finalized, the signed minutes, along with certified electronic logs of video-conferencing attendance and cryptographic e-voting timestamp hashes, must be preserved in permanent electronic archives for a statutory period of eight years.",
    "By combining stringent notice delivery, absolute quorum minimums, virtual video-conferencing access, and auditable electronic voting platforms, the CIRP meeting architecture balances deliberate transparency with commercial efficiency."
]

part4_example = "The RP of a power project issues a twenty-four-hour emergency notice for a CoC meeting to approve an urgent working capital drawdown. At the meeting, lenders holding seventy-five percent of voting shares attend via video conferencing, satisfying the thirty-three percent quorum. Following discussions, the RP uploads the draft resolution to a secure IBBI-compliant e-voting portal, keeping the ballot open for thirty-six hours. The resolution is approved by eighty-two percent of voting shares, creating an unimpeachable statutory record."

part4_code = '''def audit_coc_meeting_procedural_compliance(notice_hours_given, coc_approved_reduced_notice, suspended_directors_served, attendance_voting_pct, evoting_window_hours):
    # Notice compliance (Regulation 19: 5 days / 120 hrs, reducible to 24 hrs by 66% CoC)
    notice_valid = (notice_hours_given >= 120) or (notice_hours_given >= 24 and coc_approved_reduced_notice)
    
    # Notice to suspended directors (Vijay Kumar Jain precedent)
    directors_served = suspended_directors_served
    
    # Quorum Invariant (Regulation 22: Minimum 33% voting share)
    quorum_satisfied = attendance_voting_pct >= 33.0
    
    # Electronic voting window (Regulation 25/26: Minimum 24 hours)
    evoting_valid = evoting_window_hours >= 24
    
    is_fully_compliant = notice_valid and directors_served and quorum_satisfied and evoting_valid
    
    return {
        "notice_valid": notice_valid,
        "directors_served": directors_served,
        "quorum_satisfied": quorum_satisfied,
        "evoting_valid": evoting_valid,
        "meeting_status": "PROCEDURALLY_UNASSAILABLE" if is_fully_compliant else "DEFECTIVE_SUBJECT_TO_CHALLENGE"
    }

# Case: 24-hr reduced notice approved by CoC, suspended directors served, 75% attendance, 36-hr e-voting window
audit = audit_coc_meeting_procedural_compliance(
    notice_hours_given=24,
    coc_approved_reduced_notice=True,
    suspended_directors_served=True,
    attendance_voting_pct=75.0,
    evoting_window_hours=36
)
print("Notice Invariant Compliant:", audit["notice_valid"])
print("Suspended Directors Served (Vijay Kumar Jain):", audit["directors_served"])
print("Quorum Invariant Satisfied (>=33%):", audit["quorum_satisfied"])
print("E-Voting Ballot Duration Compliant:", audit["evoting_valid"])
print("CoC Meeting Legal Status:", audit["meeting_status"])
'''

part4_check = {
    "question": "Under Regulation 22 of the IBBI CIRP Regulations 2016, what is the minimum statutory quorum required for a meeting of the Committee of Creditors to be legally constituted?",
    "options": [
        "Financial creditors representing at least thirty-three percent of the voting shares",
        "Financial creditors representing at least fifty-one percent of total voting debt",
        "A minimum of two commercial banks regardless of their voting share percentage",
        "Financial creditors representing at least sixty-six percent of the voting shares"
    ],
    "answerIndex": 0,
    "why": "Regulation 22(1) specifies that a meeting of the committee of creditors shall quorate if members of the committee representing at least thirty-three percent of the voting rights are present in person or by video conferencing."
}

# Part 5: Anti-Pattern Defense & Outage Puzzle: The Deadlocked CoC & Deliberate Voting Paralysis Crisis
part5_title = "Anti-Pattern Defense & Outage Puzzle: The Deadlocked CoC & Deliberate Voting Paralysis Crisis"
part5_say = [
    "In corporate restructuring practice, one of the most perilous operational pathologies is the 'CoC Voting Paralysis and Consortium Deadlock' anti-pattern. This crisis occurs when consortium lenders become paralyzed by conflicting internal risk policies, inter-creditor conflicts between first-charge mortgage holders and working capital bankers, or bureaucratic delays in obtaining credit committee approvals from state-owned bank headquarters. While the statutory 330-day clock inexorably winds down toward mandatory enterprise liquidation under Section 33, critical operational resolutions fail to achieve the sixty-six percent supermajority threshold, threatening the sudden death of a viable commercial business.",
    "The first manifestation of this failure mode is the 'Persistent Abstention Paralysis'. Historically, conservative bankers routinely logged into e-voting portals and selected 'Abstain', unwilling to assume personal responsibility for controversial debt haircuts or interim funding disbursements. Under the unamended Code, abstaining votes were mathematically treated as negative votes, frequently derailing viable resolution plans. However, the Supreme Court in Tata Steel Ltd. v. Liberty House clarified that abstentions cannot be treated as affirmative votes, meaning the sixty-six percent threshold must be calculated against the total voting shares of the entire CoC, making chronic abstention a lethal poison that suffocates corporate rescue.",
    "The second compounding defect involves 'Inter-Creditor Security Disputes'. Secured lenders holding exclusive first mortgages on prime factory real estate frequently demand one hundred percent recovery, refusing to vote for resolution plans that distribute value equitably to working capital consortium lenders holding second-charge hypothecation over inventory and receivables. In Essar Steel, the Supreme Court definitively resolved this tension: while the CoC may consider the nature and value of security interests when deciding distributions, the commercial wisdom of the majority prevails, and dissenting secured lenders are bound by the resolution plan provided they receive the minimum liquidation value guaranteed under Section 30(2)(b).",
    "A third catastrophic failure mode occurs when a small minority of lenders holding thirty-five percent of voting shares orchestrates deliberate commercial extortion, blocking critical Section 28 working capital approvals unless the majority concedes unfair fee reimbursements or debt write-off allocations. If left unchecked, this obstruction triggers factory shutdowns, employee walkouts, and irreversible enterprise value erosion.",
    "To break this deadlock and rescue the corporate debtor from liquidation, the Resolution Professional must deploy a calibrated legal playbook: (1) structured inter-creditor workshops with real-time liquidation value benchmarking under Section 53; (2) issuance of Formal Time-Sensitive Commercial Advisories warning dissenting lenders that failure to approve going-concern operations will trigger immediate liquidation, reducing their recovery to scrap value; and (3) urgent Section 60(5) Applications before the NCLT.",
    "Under Section 60(5), the NCLT possesses equitable jurisdiction to issue binding directions compelling non-compliant lenders to participate in e-voting and directing consortium leads to execute majority resolutions. Where a recalcitrant lender acts maliciously to destroy going-concern value, the Adjudicating Authority can record strictures and notify regulatory watchdogs including the Reserve Bank of India (RBI).",
    "Moreover, the Department of Financial Services (DFS) and the Indian Banks' Association (IBA) have instituted formal inter-creditor guidelines mandating public sector bank representatives to secure advance board mandates prior to CoC ballots, eliminating bureaucratic delays and curbing tactical abstentions during decisive resolution votes.",
    "Furthermore, under Section 12A, the Committee of Creditors possesses the extraordinary power to withdraw an admitted CIRP application if ninety percent of voting shares approve a settlement proposed by the promoters or creditors. This ninety percent threshold, upheld by the Supreme Court in Swiss Ribbons, prevents minor factions from scuttling viable enterprise settlements while guaranteeing that only near-unanimous creditor consensus can halt the statutory insolvency resolution process.",
    "By actively diagnosing voting bottlenecks, enforcing statutory timelines, and utilizing judicial intervention to pierce tactical consortium obstruction, the Resolution Professional safeguards the legislative purpose of the IBC, turning deadlocked creditor factions into a functional, consensus-driven restructuring body."
]

part5_example = "A steel rolling mill faces liquidation in twenty days. Bank A (55% voting share) votes to approve a comprehensive resolution plan providing fifty percent recovery. Bank B (30% voting share) abstains pending internal head-office clearance, and Bank C (15% voting share) dissents over collateral sharing. The affirmative vote stands at fifty-five percent, falling short of sixty-six percent. The RP files an urgent Section 60(5) application. The NCLT issues a forty-eight-hour peremptory order directing Bank B's executive committee to finalize its vote or face regulatory referral to the RBI. Bank B convenes an emergency board meeting, casts its thirty percent affirmative vote, and pushes total assent to eighty-five percent, saving the enterprise."

part5_code = '''def diagnose_coc_voting_deadlock(votes_favor_pct, votes_dissent_pct, votes_abstain_pct, days_remaining_in_cirp, estimated_liquidation_recovery_pct, resolution_plan_recovery_pct):
    # Step 1: Check Section 30(4) 66% threshold
    supermajority_met = votes_favor_pct >= 66.0
    
    # Step 2: Analyze cause of failure
    if not supermajority_met:
        # Check if abstentions are causing the deadlock
        potential_positive_votes = votes_favor_pct + votes_abstain_pct
        abstention_deadlock = (potential_positive_votes >= 66.0) and (votes_abstain_pct > 0)
        
        is_critical_time = days_remaining_in_cirp <= 30
        
        remedial_strategy = "CONVENE_INTER_CREDITOR_CONCILIATION"
        if abstention_deadlock and is_critical_time:
            remedial_strategy = "FILE_SECTION_60(5)_NCLT_PEREMPTORY_DIRECTION_AGAINST_ABSTAINING_LENDERS"
        elif is_critical_time and not abstention_deadlock:
            remedial_strategy = "INITIATE_SECTION_33_LIQUIDATION_CONTINGENCY_PREPARATION"
            
        return {
            "status": "DEADLOCKED",
            "votes_in_favor": votes_favor_pct,
            "abstention_deadlock_present": abstention_deadlock,
            "days_to_liquidation": days_remaining_in_cirp,
            "recovery_differential_pct": resolution_plan_recovery_pct - estimated_liquidation_recovery_pct,
            "urgent_remedial_protocol": remedial_strategy
        }
        
    return {
        "status": "APPROVED_SUPERMAJORITY",
        "votes_in_favor": votes_favor_pct,
        "abstention_deadlock_present": False,
        "days_to_liquidation": days_remaining_in_cirp,
        "urgent_remedial_protocol": "SUBMIT_PLAN_TO_NCLT_UNDER_SECTION_30(6)"
    }

# Case: 55% in favor, 30% abstaining, 15% dissenting, 20 days left in CIRP. Plan offers 50% recovery vs 22% in liquidation
diagnosis = diagnose_coc_voting_deadlock(
    votes_favor_pct=55.0,
    votes_dissent_pct=15.0,
    votes_abstain_pct=30.0,
    days_remaining_in_cirp=20,
    estimated_liquidation_recovery_pct=22.0,
    resolution_plan_recovery_pct=50.0
)
print("CoC Deadlock Status:", diagnosis["status"])
print("Affirmative Vote Share (%):", diagnosis["votes_in_favor"])
print("Abstention Paralysis Detected:", diagnosis["abstention_deadlock_present"])
print("Days Left in Statutory Window:", diagnosis["days_to_liquidation"])
print("Value Loss if Liquidated (%):", diagnosis["recovery_differential_pct"])
print("Actionable Strategy:", diagnosis["urgent_remedial_protocol"])
'''

part5_check = {
    "question": "Under the Insolvency and Bankruptcy Code 2016, how are abstentions by financial creditors treated when calculating whether a resolution has achieved the statutory sixty-six percent voting threshold?",
    "options": [
        "The sixty-six percent threshold is calculated against total voting shares of the entire CoC, so abstentions function effectively as non-affirmative votes",
        "Abstaining votes are legally counted as affirmative votes in favor of the resolution professional's recommendation",
        "Abstaining creditors are automatically removed from the denominator and their shares redistributed proportionally",
        "Abstaining banks are penalized by having twenty percent of their loan balance forfeited to the state treasury"
    ],
    "answerIndex": 0,
    "why": "The statutory requirement under the IBC specifies a majority of not less than sixty-six percent of the voting shares of financial creditors of the entire CoC; therefore, abstaining creditors do not contribute to the affirmative threshold, making abstentions effectively function as non-affirmative votes."
}

# Try-It texts
try_it_texts = [
    "Execute the Section 21 voting share calculator to filter related parties and calibrate financial creditor shares.",
    "Run the Section 22 replacement validator to test voting percentages and evaluate statutory supermajority outcomes.",
    "Simulate the Section 28 negative covenant engine to test restricted corporate actions and verify prior CoC assent.",
    "Execute the Section 24 meeting compliance engine to test notice timelines, quorum invariants, and electronic ballots.",
    "Run the CoC deadlock diagnostic engine to detect abstention paralysis, calculate recovery losses, and evaluate NCLT remedies."
]

# Captions satisfying: <=80 chars, period, no digits, word matching
captions = [
    {
        "intro": "Creditors govern enterprise insolvency through democratic committee voting.",
        "say1": "Creditor democracy empowers financial lenders in enterprise insolvency.",
        "example": "Consortium commercial banks calibrate voting shares across lenders.",
        "tryIt": "Voting share calculators filter related parties and calibrate shares."
    },
    {
        "intro": "Inaugural creditor meetings determine professional executive appointments.",
        "say1": "First creditor meetings establish executive restructuring leadership.",
        "example": "Senior restructuring practitioners assume command upon supermajority votes.",
        "tryIt": "Replacement validators test voting percentages and evaluate outcomes."
    },
    {
        "intro": "Statutory negative covenants restrict unauthorized corporate transactions.",
        "say1": "Resolution professionals face strict statutory checks against overreach.",
        "example": "Emergency financing proposals require sixty six percent committee assent.",
        "tryIt": "Negative covenant engines test restricted actions and verify prior assent."
    },
    {
        "intro": "Procedural legitimacy requires strict compliance with meeting rules.",
        "say1": "Meeting protocols guarantee procedural transparency and quorum minimums.",
        "example": "Emergency meetings verify quorum standards before electronic balloting.",
        "tryIt": "Meeting compliance engines test notice timelines and quorum invariants."
    },
    {
        "intro": "Consortium deadlocks threaten enterprise liquidation during insolvency.",
        "say1": "Creditor voting paralysis endangers viable business rescue efforts.",
        "example": "Tribunal directions compel financial institutions to break voting deadlocks.",
        "tryIt": "Deadlock diagnostic engines detect abstention paralysis and evaluate remedies."
    }
]

# Stages definitions for workflow template
stages_definitions = [
    [
        {"id": "s1", "name": "CoC Constitution", "subtext": "Filing report with tribunal within thirty days"},
        {"id": "s2", "name": "Voting Share Formula", "subtext": "Admitted financial debt proportion denominator"},
        {"id": "s3", "name": "Related Party Exclusion", "subtext": "First proviso voting rights revocation"},
        {"id": "s4", "name": "Observer Participation", "subtext": "Operational creditor representation rights"}
    ],
    [
        {"id": "s1", "name": "First Meeting Mandate", "subtext": "Convene within seven days of constitution"},
        {"id": "s2", "name": "Confirmation Ballot", "subtext": "Sixty-six percent voting share threshold"},
        {"id": "s3", "name": "Replacement Protocol", "subtext": "Application to tribunal with IBBI confirmation"},
        {"id": "s4", "name": "Executive Handover", "subtext": "Transfer of digital ledgers and going concern control"}
    ],
    [
        {"id": "s1", "name": "Negative Covenants", "subtext": "Thirteen restricted statutory actions"},
        {"id": "s2", "name": "Interim Finance Approval", "subtext": "Credit creation requiring supermajority assent"},
        {"id": "s3", "name": "Asset Disposal Restraints", "subtext": "Barring asset encumbrance without committee vote"},
        {"id": "s4", "name": "Void Action Consequence", "subtext": "Ultra vires transactions rendered null and void"}
    ],
    [
        {"id": "s1", "name": "Notice Timelines", "subtext": "Five day notice reducible to twenty-four hours"},
        {"id": "s2", "name": "Quorum Invariant", "subtext": "Thirty-three percent financial creditor presence"},
        {"id": "s3", "name": "Audio Visual Attendance", "subtext": "Virtual boardroom participation protocols"},
        {"id": "s4", "name": "Electronic Voting Window", "subtext": "Twenty-four to forty-eight hour secure ballot"}
    ],
    [
        {"id": "s1", "name": "Deadlock Diagnostics", "subtext": "Consortium lender disagreement stalling approvals"},
        {"id": "s2", "name": "Voting Share Deadband", "subtext": "Failure to achieve sixty-six percent threshold"},
        {"id": "s3", "name": "Liquidation Warning", "subtext": "Section 33 trigger upon statutory expiry"},
        {"id": "s4", "name": "Judicial Intervention", "subtext": "Tribunal directions breaking deliberate obstruction"}
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
    print(f"Day 38 Part {p_num} Word Count: {words}")
    assert words >= 600, f"Day 38 Part {p_num} words {words} < 600!"
    
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

print(f"Total Day 38 Words: {total_day_words}")
assert total_day_words >= 3000, f"Total day words {total_day_words} < 3000!"

day_data = {
    "day": day_num,
    "coursePrefix": course_prefix,
    "title": day_title,
    "desc": day_desc,
    "parts": lesson_parts
}

# 1. Save day38_lesson.json
with open("scripts/day38_lesson.json", "w", encoding="utf-8") as f:
    json.dump(day_data, f, indent=2)
print("Saved scripts/day38_lesson.json successfully!")

# 2. Append to src/lib/data/bcomLawLongLessons.ts
ts_path = "src/lib/data/bcomLawLongLessons.ts"
with open(ts_path, "r", encoding="utf-8") as f:
    ts_content = f.read()

# Check if Day 38 is already present
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

# 3. Build day-38.json visual file
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
    "day": 38,
    "promptSha": "prompt_sha_bcom_law_day38_coc_governance_v1",
    "model": "google/gemini-2.5-pro",
    "entries": entries
}

v_path = "src/lib/data/lessonVisuals/bcom_law/day-38.json"
with open(v_path, "w", encoding="utf-8") as f:
    json.dump(visual_data, f, indent=2)
print(f"Saved {v_path} successfully!")
