"""
Course 29: B.Com Corporate & Commercial Law, Contracts & Governance (bcom_law)
Day 19 Builder: Shareholder Voting, Proxy Contests & Schedule 14A: Activism & Universal Proxies
Milestone 4: Corporate Governance, Fiduciary Duties & Shareholder Democracy
Guarantees >= 580 words per part and >= 2,950 words total with deterministic Python simulations.
"""

from corporate_law_budget_ensurer import ensure_law_day_budget
from visual_builder import count_words

DAY_19 = {
    "coursePrefix": "bcom_law",
    "day": 19,
    "title": "Shareholder Voting, Proxy Contests & Schedule 14A: Activism & Universal Proxies",
    "goal": "Master the legal mechanisms of corporate democracy, SEC proxy regulation, and shareholder activism: evaluate statutory voting thresholds and written consents under DGCL §§ 211, 212, and 228, navigate SEC Schedule 14A disclosure rules and Rule 14a-9 anti-fraud liability, model Rule 14a-8 shareholder proposal exclusions and SEC No-Action Letters, analyze modern proxy fights under mandatory Universal Proxy Rule 14a-19 with ISS/Glass Lewis advisory dynamics, and enforce the Blasius compelling justification standard protecting the shareholder franchise.",
    "minutes": 45,
    "recap": "In Day 18, we mastered shareholder derivative litigation under the unified Zuckerberg demand futility test and Zapata Special Litigation Committees. Today in Day 19, we explore the shareholder franchise: corporate elections, SEC proxy battles, shareholder activism, and the judicial defense of voting rights.",
    "parts": [
        {
            "title": "Corporate Democracy & Statutory Shareholder Voting Rights",
            "say": [
                "The corporate franchise—the right of stockholders to elect directors and vote on fundamental enterprise transactions—is the ideological bedrock of Anglo-American corporate law. Because corporate directors wield immense statutory authority under DGCL § 141(a) to manage the business and affairs of the corporation, the shareholder vote serves as the ultimate democratic legitimacy mechanism, aligning directorial power with shareholder capital.",
                "Under Delaware General Corporation Law, shareholder voting rights are governed by clear statutory baselines. Section 211 mandates that an annual meeting of stockholders shall be held for the election of directors. If a corporation fails to hold an annual meeting within 13 months of the prior meeting, any stockholder may petition the Delaware Court of Chancery under DGCL § 211(c) to summarily order a meeting to be held, stripping the board of its power to delay elections.",
                "Under DGCL § 212(a), the statutory default is 'one share, one vote' on each matter submitted to a vote at a meeting of stockholders, unless the certificate of incorporation establishes a multi-class capital structure (such as high-vote Class B shares common in technology IPOs). Section 216 sets the default quorum at a majority of the shares entitled to vote. For standard corporate resolutions, approval requires the affirmative vote of a majority of shares present in person or represented by proxy.",
                "However, Delaware corporate law strictly reserves certain transformative transactions for mandatory stockholder approval, establishing a statutory check against unilateral board action. These mandatory vote triggers include: (1) Amendments to the Certificate of Incorporation under DGCL § 242; (2) Mergers and statutory consolidations under DGCL § 251; (3) Sale, lease, or exchange of all or substantially all corporate assets under DGCL § 271; and (4) Voluntary corporate dissolution under DGCL § 275.",
                "Furthermore, under DGCL § 228, unless specifically eliminated in the certificate of incorporation, stockholders may take any action without a meeting, without prior notice, and without a vote, through written consents signed by the holders of outstanding stock having not less than the minimum number of votes that would be necessary to authorize the action at a formal meeting. Shareholder written consent is a devastating offensive weapon utilized by activist hedge funds to replace boards rapidly between annual meetings."
            ],
            "example": "A board attempts to avoid an election defeat by postponing its annual meeting by 16 months. A shareholder owning 100 shares files a DGCL § 211(c) petition in the Court of Chancery. The judge summarily orders the meeting convened within 45 days, ruling that the right to elect directors cannot be suspended by managerial convenience.",
            "code": """# Simulation: Delaware Statutory Shareholder Voting & Transformation Threshold Engine
from typing import Dict, List

def evaluate_statutory_shareholder_vote_threshold(
    transaction_name: str,
    action_type: str, # 'DIRECTOR_ELECTION', 'CHARTER_AMENDMENT', 'MERGER_DGCL_251', 'ASSET_SALE_DGCL_271', 'WRITTEN_CONSENT_TAKEOVER'
    total_voting_shares_outstanding: int,
    shares_represented_at_meeting: int,
    votes_cast_in_favor: int,
    charter_restricts_written_consents: bool,
    charter_requires_supermajority_percentage: float # e.g. 0.667 for 66.7%
) -> dict:
    quorum_shares_required = total_voting_shares_outstanding / 2.0
    quorum_achieved = shares_represented_at_meeting > quorum_shares_required
    
    if action_type == 'WRITTEN_CONSENT_TAKEOVER':
        if charter_restricts_written_consents:
            return {
                'transaction_name': transaction_name,
                'action_type': action_type,
                'vote_outcome': "ACTION_BLOCKED_CHARTER_RESTRICTION",
                'rationale': "Certificate of incorporation expressly eliminates DGCL § 228 written consents.",
                'legally_approved': False
            }
        # DGCL § 228 requires majority of ALL OUTSTANDING shares, not just quorum
        required_consent_votes = total_voting_shares_outstanding * 0.50 + 1
        consents_approved = votes_cast_in_favor >= required_consent_votes
        return {
            'transaction_name': transaction_name,
            'action_type': action_type,
            'vote_outcome': "APPROVED_VIA_WRITTEN_CONSENT" if consents_approved else "FAILED_INSUFFICIENT_OUTSTANDING_CONSENTS",
            'rationale': f"Requires absolute majority of outstanding shares ({votes_cast_in_favor:,}/{int(required_consent_votes):,} votes).",
            'legally_approved': consents_approved
        }
        
    if not quorum_achieved:
        return {
            'transaction_name': transaction_name,
            'action_type': action_type,
            'vote_outcome': "FAILED_NO_QUORUM",
            'rationale': f"Shares represented ({shares_represented_at_meeting:,}) below 50% quorum ({quorum_shares_required:,}).",
            'legally_approved': False
        }
        
    # Statutory voting thresholds
    if action_type in ['CHARTER_AMENDMENT', 'MERGER_DGCL_251', 'ASSET_SALE_DGCL_271']:
        # Fundamental transactions require majority of OUTSTANDING voting shares
        required_threshold = max(0.50, charter_requires_supermajority_percentage)
        required_votes = total_voting_shares_outstanding * required_threshold
        approved = votes_cast_in_favor >= required_votes
        threshold_type = "MAJORITY_OF_OUTSTANDING_SHARES"
    else:
        # Standard business / director election: majority of shares PRESENT
        required_votes = shares_represented_at_meeting * 0.50
        approved = votes_cast_in_favor > required_votes
        threshold_type = "MAJORITY_OF_SHARES_PRESENT"
        
    return {
        'transaction_name': transaction_name,
        'action_type': action_type,
        'vote_outcome': "APPROVED_BY_STOCKHOLDERS" if approved else "FAILED_INSUFFICIENT_VOTES",
        'threshold_applied': threshold_type,
        'votes_cast': votes_cast_in_favor,
        'votes_required': int(required_votes),
        'legally_approved': approved
    }

# Execute deterministic validation
v1 = evaluate_statutory_shareholder_vote_threshold("Mega-Merger Agreement", "MERGER_DGCL_251", 100000000, 75000000, 52000000, False, 0.50)
v2 = evaluate_statutory_shareholder_vote_threshold("Activist Board Removal", "WRITTEN_CONSENT_TAKEOVER", 100000000, 0, 51000000, False, 0.50)
v3 = evaluate_statutory_shareholder_vote_threshold("Charter Supermajority Proposal", "CHARTER_AMENDMENT", 100000000, 80000000, 55000000, False, 0.667)

print(f"[{v1['transaction_name']}] -> Outcome: {v1['vote_outcome']} | Approved: {v1['legally_approved']}")
print(f"[{v2['transaction_name']}] -> Outcome: {v2['vote_outcome']} | Approved: {v2['legally_approved']}")
print(f"[{v3['transaction_name']}] -> Outcome: {v3['vote_outcome']} | Approved: {v3['legally_approved']}")
""",
            "output": """[Mega-Merger Agreement] -> Outcome: APPROVED_BY_STOCKHOLDERS | Approved: True
[Activist Board Removal] -> Outcome: APPROVED_VIA_WRITTEN_CONSENT | Approved: True
[Charter Supermajority Proposal] -> Outcome: FAILED_INSUFFICIENT_VOTES | Approved: False
""",
            "codeNotes": [
                {"line": 15, "note": "Enforces DGCL § 228 written consent rules requiring majority of all outstanding shares"},
                {"line": 28, "note": "Audits statutory quorum requirement under DGCL § 216"},
                {"line": 34, "note": "Applies DGCL §§ 242/251/271 mandatory approval based on total outstanding stock"}
            ],
            "tryIt": "Set charter_restricts_written_consents to True in v2 to observe how modern corporate charters shut down hostile activist written consent campaigns.",
            "check": {
                "question": "What is the crucial difference in voting baseline between electing directors at an annual meeting versus executing a corporate merger under DGCL § 251?",
                "options": [
                    "Electing directors typically requires a majority or plurality of shares present at a meeting with quorum, whereas a merger requires the affirmative vote of a majority of all outstanding shares entitled to vote.",
                    "Mergers require unanimous consent from every citizen of Delaware.",
                    "Electing directors is illegal in Delaware corporations.",
                    "Mergers do not require any shareholder vote."
                ],
                "answer": 0,
                "why": "Fundamental transactions under DGCL §§ 242, 251, and 271 require an absolute majority of all outstanding voting shares, not merely shares present at the meeting.",
                "answerIndex": 0,
                "explanation": "Fundamental transactions under DGCL §§ 242, 251, and 271 require an absolute majority of all outstanding voting shares, not merely shares present at the meeting."
            }
        },
        {
            "title": "SEC Proxy Regulation & Schedule 14A Mechanics",
            "say": [
                "In widely held public corporations with millions of shareholders scattered across the globe, in-person attendance at annual meetings is virtually non-existent. Instead, corporate democracy operates almost entirely through the Proxy System: shareholders designate proxy agents (usually members of corporate management) to vote their shares in accordance with their instructions. Recognizing that control over the proxy machinery is control over the enterprise, Congress enacted Section 14(a) of the Securities Exchange Act of 1934.",
                "Under SEC Section 14(a) and Rule 14a-3, it is unlawful for any person to solicit any proxy, consent, or authorization in respect of any security registered under Section 12 unless each person solicited is concurrently or previously furnished with a publicly filed, definitive Proxy Statement (Schedule 14A). The SEC's definition of 'solicitation' under Rule 14a-1(l) is extraordinarily broad: it encompasses not merely requests for a proxy card, but any communication to security holders under circumstances reasonably calculated to result in the procurement, withholding, or revocation of a proxy.",
                "Schedule 14A requires exhaustive, audited disclosures: executive compensation details (Compensation Discussion and Analysis / CD&A), board committee composition, director qualifications, related-party transactions, auditor fees, and detailed explanations of all matters submitted to a shareholder vote. In contested elections or major M&A transactions, preliminary proxy statements must be filed with the SEC for staff review at least 10 calendar days prior to distributing definitive materials to stockholders.",
                "The primary enforcement mechanism in proxy regulation is SEC Rule 14a-9, which strictly prohibits false or misleading statements of material fact, or omissions of material facts necessary to make the statements not misleading, in any proxy statement or solicitation communication. In J.I. Case Co. v. Borak (1964), the U.S. Supreme Court established an implied private right of action enabling shareholders to sue corporations and directors for Rule 14a-9 violations.",
                "In TSC Industries, Inc. v. Northway, Inc. (1976), the Supreme Court articulated the universal materiality standard: an omitted fact is material if there is a substantial likelihood that a reasonable shareholder would consider it important in deciding how to vote. Proving a Rule 14a-9 violation can result in federal court injunctions postponing annual meetings, voiding proxies, or ordering resolicitation."
            ],
            "example": "In a proxy statement soliciting votes for a $2 billion merger, management states that their investment banker performed extensive valuation checks, but deliberately omits that the lead banker is receiving a $15 million contingent success bonus payable only if the deal closes. Under TSC Industries v. Northway, this conflict of interest is a material omission violating Rule 14a-9, justifying an injunction halting the shareholder vote.",
            "code": """# Simulation: SEC Schedule 14A Proxy Solicitation & Rule 14a-9 Materiality Engine
from typing import Dict, List

def audit_schedule_14a_proxy_statement(
    company_name: str,
    solicitation_channel: str, # 'FORMAL_SCHEDULE_14A', 'PRESS_RELEASE', 'TWEET_CAMPAIGN'
    filed_preliminary_proxy_with_sec: bool,
    full_executive_compensation_cda_disclosed: bool,
    conflicts_of_interest_and_banker_success_fees_disclosed: bool,
    contains_unsupported_projected_growth_claims: bool,
    omitted_material_facts_influencing_voting_decision: bool
) -> dict:
    # 1. Rule 14a-3 Solicitation Compliance
    is_exempt_communication = solicitation_channel == 'FORMAL_SCHEDULE_14A' and filed_preliminary_proxy_with_sec
    
    # 2. Rule 14a-9 Anti-Fraud Materiality Audit (TSC Industries v. Northway)
    has_material_defect = (
        omitted_material_facts_influencing_voting_decision or 
        not conflicts_of_interest_and_banker_success_fees_disclosed or 
        contains_unsupported_projected_growth_claims
    )
    
    rule_14a9_violation = has_material_defect
    
    # Regulatory and Litigation Risk Assessment
    if rule_14a9_violation:
        compliance_status = "NON_COMPLIANT_RULE_14A9_FRAUD_RISK"
        sec_exposure = "SEC_ENFORCEMENT_ACTION_AND_INJUNCTION"
        shareholder_litigation_risk = "HIGH_PRIVATE_RIGHT_OF_ACTION_UNDER_BORAK"
        recommended_remedy = "FILE_CORRECTIVE_SUPPLEMENTAL_SCHEDULE_14A_AND_POSTPONE_VOTE"
    elif not filed_preliminary_proxy_with_sec and solicitation_channel != 'FORMAL_SCHEDULE_14A':
        compliance_status = "GUN_JUMPING_PROMOTION_WITHOUT_14A"
        sec_exposure = "SEC_DEFICIENCY_LETTER_CEASE_AND_DESIST"
        shareholder_litigation_risk = "MODERATE_SOLICITATION_DEFECT"
        recommended_remedy = "SUSPEND_PUBLIC_STATEMENTS_FILE_DEFINITIVE_14A"
    else:
        compliance_status = "FULLY_COMPLIANT_SCHEDULE_14A"
        sec_exposure = "SEC_ACCELERATED_CLEARANCE"
        shareholder_litigation_risk = "NEGLIGIBLE_BJR_PROTECTION"
        recommended_remedy = "COMMENCE_PROXY_SOLICITATION"
        
    return {
        'company_name': company_name,
        'solicitation_channel': solicitation_channel,
        'compliance_status': compliance_status,
        'rule_14a9_violation': rule_14a9_violation,
        'sec_exposure': sec_exposure,
        'shareholder_litigation_risk': shareholder_litigation_risk,
        'recommended_remedy': recommended_remedy
    }

# Execute deterministic validation
p1 = audit_schedule_14a_proxy_statement("Global Health Corp", "FORMAL_SCHEDULE_14A", True, True, True, False, False)
p2 = audit_schedule_14a_proxy_statement("BioTech M&A Target", "FORMAL_SCHEDULE_14A", True, True, False, True, True)

print(f"[{p1['company_name']}] -> Status: {p1['compliance_status']} | SEC Risk: {p1['sec_exposure']}")
print(f"[{p2['company_name']}] -> Status: {p2['compliance_status']} | SEC Risk: {p2['sec_exposure']}")
""",
            "output": """[Global Health Corp] -> Status: FULLY_COMPLIANT_SCHEDULE_14A | SEC Risk: SEC_ACCELERATED_CLEARANCE
[BioTech M&A Target] -> Status: NON_COMPLIANT_RULE_14A9_FRAUD_RISK | SEC Risk: SEC_ENFORCEMENT_ACTION_AND_INJUNCTION
""",
            "codeNotes": [
                {"line": 13, "note": "Audits SEC Rule 14a-3 pre-filing requirements for proxy solicitations"},
                {"line": 16, "note": "Implements TSC Industries v. Northway materiality test for omissions under Rule 14a-9"},
                {"line": 23, "note": "Prescribes corrective supplemental disclosures and voting postponement upon defect"}
            ],
            "tryIt": "Set omitted_material_facts_influencing_voting_decision to False and conflicts_of_interest_and_banker_success_fees_disclosed to True in p2 to verify clearance.",
            "check": {
                "question": "Under the U.S. Supreme Court's landmark decision in TSC Industries v. Northway, what is the legal standard for determining whether an omitted fact in a proxy statement is 'material' under Rule 14a-9?",
                "options": [
                    "There must be a substantial likelihood that a reasonable shareholder would consider the omitted fact important in deciding how to vote.",
                    "The fact must involve at least $10 billion in cash.",
                    "The CEO must admit under oath that they committed a crime.",
                    "The omitted fact must have been published on the front page of the New York Times."
                ],
                "answer": 0,
                "why": "TSC Industries established that materiality exists when there is a substantial likelihood that the disclosure of the omitted fact would have significantly altered the total mix of information made available.",
                "answerIndex": 0,
                "explanation": "TSC Industries established that materiality exists when there is a substantial likelihood that the disclosure of the omitted fact would have significantly altered the total mix of information made available."
            }
        },
        {
            "title": "Rule 14a-8 Shareholder Proposals & Exclusionary Grounds",
            "say": [
                "While management controls the corporate machinery, SEC Rule 14a-8 provides an extraordinary democratic gateway: it allows qualifying individual and institutional shareholders to place a proposal directly onto the corporation's official proxy card at the company's expense. Rule 14a-8 is the primary mechanism through which shareholders advocate for corporate governance reforms (e.g., majority voting in director elections, declassifying staggered boards, executive compensation clawbacks) and environmental, social, and governance (ESG) policies.",
                "To qualify under Rule 14a-8(b), a shareholder must satisfy strict ownership thresholds: holding at least $2,000 of stock continuously for at least 3 years, $15,000 for 2 years, or $25,000 for 1 year. The proposal must be submitted at least 120 calendar days before the anniversary date of the prior year's proxy statement, and the proposal plus supporting statement cannot exceed 500 words.",
                "To protect corporations from being flooded with frivolous, harassing, or improper petitions, Rule 14a-8(i) establishes thirteen substantive bases for exclusion. If a company believes a proposal fits within one of these exclusionary grounds, it submits a request for a No-Action Letter to the SEC Division of Corporation Finance, asking the SEC staff to confirm that they will not recommend enforcement action if the company omits the proposal from its proxy materials.",
                "The most heavily litigated exclusionary grounds include: (1) Rule 14a-8(i)(1) — Improper Under State Law (the proposal is not a proper subject for shareholder action under state law, e.g., attempting to mandate operational actions rather than expressing an advisory/precatory recommendation); (2) Rule 14a-8(i)(7) — Ordinary Business Operations (the proposal deals with matters relating to the company's ordinary business operations, such as employee work schedules or supplier selection, UNLESS it raises significant social policy issues like systemic human rights or climate risk); and (3) Rule 14a-8(i)(10) — Substantially Implemented (the company has already addressed the underlying concern).",
                "Navigating the delicate boundary between micro-management of ordinary business and significant social policy issues is one of the most critical responsibilities of public company corporate secretaries and securities counsel."
            ],
            "example": "A shareholder submits a mandatory resolution ordering the CEO to switch company coffee to fair-trade beans. Management seeks exclusion under Rule 14a-8(i)(7) (ordinary business) and (i)(1) (improper under DGCL § 141(a)). The SEC issues a No-Action Letter permitting exclusion. But if the proposal recommends an independent board chair, it involves governance structure and cannot be excluded under ordinary business.",
            "code": """# Simulation: SEC Rule 14a-8 Shareholder Proposal Eligibility & Exclusion Analyzer
from typing import Dict, List

def evaluate_rule_14a8_proposal_exclusion(
    proponent_name: str,
    proposal_title: str,
    continuous_holding_duration_years: float,
    holding_market_value_usd: float,
    word_count: int,
    is_mandatory_director_instruction: bool,
    relates_to_ordinary_business_operations: bool,
    raises_significant_social_policy_issue: bool,
    company_already_substantially_implemented: bool
) -> dict:
    # 1. Procedural Eligibility Audit under Rule 14a-8(b)
    # Tier 1: $2,000 for 3 years; Tier 2: $15,000 for 2 years; Tier 3: $25,000 for 1 year
    tier1_met = holding_market_value_usd >= 2000.0 and continuous_holding_duration_years >= 3.0
    tier2_met = holding_market_value_usd >= 15000.0 and continuous_holding_duration_years >= 2.0
    tier3_met = holding_market_value_usd >= 25000.0 and continuous_holding_duration_years >= 1.0
    ownership_satisfied = tier1_met or tier2_met or tier3_met
    
    length_satisfied = word_count <= 500
    procedurally_eligible = ownership_satisfied and length_satisfied
    
    if not procedurally_eligible:
        return {
            'proposal_title': proposal_title,
            'can_exclude_under_14a8': True,
            'exclusionary_ground': "RULE_14A8_B_OR_D_PROCEDURAL_DEFECT",
            'sec_no_action_letter_probable': True,
            'recommendation': "EXCLUDE_ON_PROCEDURAL_DEFECT_NOTICE_GIVEN"
        }
        
    # 2. Substantive Exclusionary Grounds under Rule 14a-8(i)
    # (i)(1): Improper under state law (Mandating board operational decisions violates DGCL § 141(a))
    if is_mandatory_director_instruction:
        return {
            'proposal_title': proposal_title,
            'can_exclude_under_14a8': True,
            'exclusionary_ground': "RULE_14A8_I_1_IMPROPER_UNDER_STATE_LAW",
            'sec_no_action_letter_probable': True,
            'recommendation': "EXCLUDE_UNLESS_RECAST_AS_PRECATORY_RECOMMENDATION"
        }
        
    # (i)(10): Substantially Implemented
    if company_already_substantially_implemented:
        return {
            'proposal_title': proposal_title,
            'can_exclude_under_14a8': True,
            'exclusionary_ground': "RULE_14A8_I_10_SUBSTANTIALLY_IMPLEMENTED",
            'sec_no_action_letter_probable': True,
            'recommendation': "FILE_NO_ACTION_REQUEST_ON_IMPLEMENTATION"
        }
        
    # (i)(7): Ordinary Business vs Significant Social Policy
    if relates_to_ordinary_business_operations and not raises_significant_social_policy_issue:
        return {
            'proposal_title': proposal_title,
            'can_exclude_under_14a8': True,
            'exclusionary_ground': "RULE_14A8_I_7_ORDINARY_BUSINESS_MICRO_MANAGEMENT",
            'sec_no_action_letter_probable': True,
            'recommendation': "FILE_NO_ACTION_REQUEST_ON_ORDINARY_BUSINESS"
        }
        
    # Proposal must be included in company proxy materials
    return {
        'proposal_title': proposal_title,
        'can_exclude_under_14a8': False,
        'exclusionary_ground': "NONE_VALID_SHAREHOLDER_PROPOSAL",
        'sec_no_action_letter_probable': False,
        'recommendation': "INCLUDE_IN_SCHEDULE_14A_OPPOSE_WITH_BOARD_STATEMENT"
    }

# Execute deterministic validation
prop1 = evaluate_rule_14a8_proposal_exclusion("Pension Fund", "Adopt Independent Board Chair", 3.5, 5000.0, 420, False, False, False, False)
prop2 = evaluate_rule_14a8_proposal_exclusion("Activist Individual", "Mandate Office Thermostat at 68F", 1.5, 3000.0, 480, True, True, False, False)
prop3 = evaluate_rule_14a8_proposal_exclusion("Green Fund", "Report on GHG Scope 3 Reductions", 2.5, 20000.0, 490, False, True, True, False)

print(f"[{prop1['proposal_title']}] -> Exclude: {prop1['can_exclude_under_14a8']} | Ground: {prop1['exclusionary_ground']}")
print(f"[{prop2['proposal_title']}] -> Exclude: {prop2['can_exclude_under_14a8']} | Ground: {prop2['exclusionary_ground']}")
print(f"[{prop3['proposal_title']}] -> Exclude: {prop3['can_exclude_under_14a8']} | Ground: {prop3['exclusionary_ground']}")
""",
            "output": """[Adopt Independent Board Chair] -> Exclude: False | Ground: NONE_VALID_SHAREHOLDER_PROPOSAL
[Mandate Office Thermostat at 68F] -> Exclude: True | Ground: RULE_14A8_B_OR_D_PROCEDURAL_DEFECT
[Report on GHG Scope 3 Reductions] -> Exclude: False | Ground: NONE_VALID_SHAREHOLDER_PROPOSAL
""",
            "codeNotes": [
                {"line": 14, "note": "Audits Rule 14a-8(b) tiered holding requirements and 500-word limit"},
                {"line": 28, "note": "Applies Rule 14a-8(i)(1) exclusion for mandatory operational instructions violating DGCL § 141(a)"},
                {"line": 42, "note": "Applies significant social policy override protecting ESG proposals under Rule 14a-8(i)(7)"}
            ],
            "tryIt": "Increase continuous_holding_duration_years to 3.0 in prop2 to bypass the procedural defect and see it trigger the (i)(1) improper under state law exclusion.",
            "check": {
                "question": "Why are shareholder proposals attempting to mandate operational corporate actions excludable under Rule 14a-8(i)(1) and Delaware corporate law?",
                "options": [
                    "Under DGCL § 141(a), managerial power is vested exclusively in the board of directors; shareholders cannot dictate operational decisions, so proposals must be precatory (advisory).",
                    "Shareholders are prohibited from submitting proposals if they do not hold a law degree.",
                    "The SEC bans all shareholder voting on technology companies.",
                    "All shareholder proposals are illegal under the United States Constitution."
                ],
                "answer": 0,
                "why": "Section 141(a) establishes that directors, not shareholders, direct enterprise business; mandatory shareholder commands invade the board's statutory purview.",
                "answerIndex": 0,
                "explanation": "Section 141(a) establishes that directors, not shareholders, direct enterprise business; mandatory shareholder commands invade the board's statutory purview."
            }
        },
        {
            "title": "Proxy Contests & The Universal Proxy Rule (Rule 14a-19)",
            "say": [
                "A proxy contest is the ultimate high-stakes battlefield in corporate governance. When an activist hedge fund or dissident shareholder group is dissatisfied with corporate performance, executive compensation, or capital allocation, they launch a campaign to replace some or all incumbent directors on the board. For decades, proxy contests were governed by a fragmented, two-card proxy system that heavily favored entrenched management.",
                "Under the historical two-card regime, management mailed a white proxy card listing only incumbent board nominees, while the activist mailed a gold or blue proxy card listing only dissident nominees. Because state law holds that a subsequently signed proxy card revokes an earlier one, shareholders voting by proxy could not split their vote—they were forced to vote entirely for management or entirely for the dissident slate, unless they traveled in person to the physical annual meeting to cast a paper ballot.",
                "This anti-democratic defect was revolutionized in November 2021 when the SEC adopted Rule 14a-19, mandating Universal Proxy Cards for all contested director elections taking place after August 31, 2022. Under Rule 14a-19, each proxy card distributed by management or the dissident must include the names of all director candidates nominated by both sides. Stockholders voting by proxy now possess the identical freedom of choice as an in-person voter: they can mix and match nominees from both slates, picking individual directors based on perceived merit.",
                "To utilize the Universal Proxy Rule, a dissident shareholder must comply with rigorous procedural requirements: (1) Provide written notice to the company of its intent to solicit proxies and list its nominees at least 60 calendar days before the anniversary of the prior year's annual meeting; (2) Solicit the holders of shares representing at least 67% of the voting power of outstanding shares entitled to vote; and (3) File a definitive proxy statement with the SEC by the later of 25 days before the meeting or 5 days after the company files its definitive statement.",
                "The advent of universal proxies has dramatically amplified the power of independent Proxy Advisory Firms, predominantly Institutional Shareholder Services (ISS) and Glass Lewis. Institutional asset managers (BlackRock, Vanguard, State Street) manage trillions in passive index funds and rely heavily on ISS and Glass Lewis recommendations. An ISS endorsement of one or two dissident nominees in a universal proxy contest virtually guarantees their election to the target board."
            ],
            "example": "An activist hedge fund owning 6% of an enterprise software firm launches a universal proxy fight nominating 3 directors to a 9-member board. Under Rule 14a-19, all 12 nominees appear on both proxy cards. ISS recommends electing 2 dissident nominees with AI operational expertise while retaining incumbent CEO and Chair. Major index funds follow ISS, electing the 2 dissidents and creating a hybrid board.",
            "code": """# Simulation: SEC Rule 14a-19 Universal Proxy Contest & ISS Vote Allocation Engine
from typing import Dict, List

def model_universal_proxy_contest_election(
    company_name: str,
    total_board_seats_up_for_election: int, # e.g. 3
    management_nominees: List[str],
    dissident_nominees: List[str],
    dissident_solicited_67pct_voting_power: bool,
    dissident_filed_timely_60day_notice: bool,
    iss_endorsed_dissident_nominees: List[str], # Nominees recommended by ISS
    institutional_investor_shares: int, # e.g. 70,000,000 shares
    retail_and_insider_shares: int # e.g. 30,000,000 shares
) -> dict:
    # 1. Rule 14a-19 Universal Proxy Eligibility Check
    rule_14a19_cleared = (
        dissident_solicited_67pct_voting_power and 
        dissident_filed_timely_60day_notice
    )
    
    if not rule_14a19_cleared:
        return {
            'company_name': company_name,
            'contest_status': "DISSIDENT_UNIVERSAL_PROXY_DISQUALIFIED",
            'rationale': "Dissident failed to meet Rule 14a-19 mandatory 67% solicitation or 60-day notice requirement.",
            'elected_board_members': management_nominees[:total_board_seats_up_for_election]
        }
        
    # 2. Vote Simulation across Universal Proxy Card
    # Institutional shares follow ISS recommendation (85% alignment), Retail splits 50/50, Insiders vote 100% management
    nominee_votes = {}
    
    for m in management_nominees:
        nominee_votes[m] = retail_and_insider_shares * 0.60
    for d in dissident_nominees:
        nominee_votes[d] = retail_and_insider_shares * 0.40
        
    # Allocate Institutional Block based on ISS recommendations
    for d in dissident_nominees:
        if d in iss_endorsed_dissident_nominees:
            nominee_votes[d] += institutional_investor_shares * 0.85
        else:
            nominee_votes[d] += institutional_investor_shares * 0.15
            
    for m in management_nominees:
        # If dissident is endorsed, corresponding management nominee loses institutional support
        if len(iss_endorsed_dissident_nominees) > 0 and m in management_nominees[-len(iss_endorsed_dissident_nominees):]:
            nominee_votes[m] += institutional_investor_shares * 0.20
        else:
            nominee_votes[m] += institutional_investor_shares * 0.80
            
    # Sort all candidates by total votes received
    sorted_nominees = sorted(nominee_votes.items(), key=lambda x: x[1], reverse=True)
    elected = [cand[0] for cand in sorted_nominees[:total_board_seats_up_for_election]]
    
    dissident_wins = sum(1 for cand in elected if cand in dissident_nominees)
    management_wins = total_board_seats_up_for_election - dissident_wins
    
    return {
        'company_name': company_name,
        'contest_status': "UNIVERSAL_PROXY_ELECTION_CONCLUDED",
        'elected_board_members': elected,
        'dissident_seats_won': dissident_wins,
        'management_seats_won': management_wins,
        'iss_impact_multiplier': "HIGH_INSTITUTIONAL_SWING",
        'vote_tallies': {k: int(v) for k, v in sorted_nominees}
    }

# Execute deterministic validation
u1 = model_universal_proxy_contest_election(
    "CloudTech Solutions", 3,
    ["Incumbent CEO", "Incumbent CFO", "Incumbent Chair"],
    ["Dissident Tech Guru", "Dissident AI Expert", "Dissident Turnaround Specialist"],
    True, True,
    ["Dissident Tech Guru", "Dissident Turnaround Specialist"],
    70000000, 30000000
)

print(f"[{u1['company_name']}] -> Status: {u1['contest_status']} | Elected: {u1['elected_board_members']} (Dissident: {u1['dissident_seats_won']}, Mgmt: {u1['management_seats_won']})")
""",
            "output": """[CloudTech Solutions] -> Status: UNIVERSAL_PROXY_ELECTION_CONCLUDED | Elected: ['Incumbent CEO', 'Dissident Tech Guru', 'Dissident Turnaround Specialist'] (Dissident: 2, Mgmt: 1)
""",
            "codeNotes": [
                {"line": 15, "note": "Enforces SEC Rule 14a-19 procedural gating: 67% solicitation and 60-day notice"},
                {"line": 28, "note": "Simulates universal proxy card mix-and-match voting across slates"},
                {"line": 40, "note": "Models ISS proxy advisory endorsements driving institutional index fund voting shifts"}
            ],
            "tryIt": "Set dissident_solicited_67pct_voting_power to False in u1 to see the entire universal proxy contest disqualified under Rule 14a-19.",
            "check": {
                "question": "What fundamental change did SEC Rule 14a-19 (the Universal Proxy Rule) introduce for contested director elections?",
                "options": [
                    "It requires both management and dissident proxy cards to include all director nominees, allowing shareholders voting by proxy to mix and match candidates from both slates.",
                    "It bans hedge funds from buying stock in public companies.",
                    "It forces all elections to be decided by a public coin flip.",
                    "It abolishes the Board of Directors and replaces it with an algorithm."
                ],
                "answer": 0,
                "why": "Rule 14a-19 democratized proxy voting by placing all nominees on a universal card, eliminating the requirement to vote exclusively for one slate.",
                "answerIndex": 0,
                "explanation": "Rule 14a-19 democratized proxy voting by placing all nominees on a universal card, eliminating the requirement to vote exclusively for one slate."
            }
        },
        {
            "title": "Defending Corporate Democracy & Blasius Compelling Justification Standard",
            "say": [
                "When incumbent corporate boards face an imminent proxy defeat or hostile election contest, management is sorely tempted to deploy defensive tactics that alter the electoral rules. Corporate boards possess broad managerial power under DGCL § 141(a), which includes the mechanical authority to set record dates, amend corporate bylaws, change meeting dates, or expand board size. However, when these ordinary powers are deployed to thwart shareholder voting, Delaware equity intervenes decisively.",
                "In the landmark decision Blasius Industries, Inc. v. Atlas Corp. (Del. Ch. 1988), Chancellor William T. Allen articulated one of the most potent doctrines in Delaware corporate law. In Blasius, an insurgent shareholder initiated a consent solicitation to expand the Atlas board from 7 to 15 members and elect 8 insurgent directors, gaining majority control. In response, the incumbent Atlas board quickly amended the bylaws, expanded the board by two seats, and filled the vacancies with friendly incumbents, mathematically precluding the insurgent from obtaining a majority.",
                "Chancellor Allen ruled that even if the board acted in subjective good faith, believing the insurgent's business plan would destroy enterprise value, board action taken for the primary purpose of interfering with or impeding the effectiveness of a stockholder vote cannot be shielded by the Business Judgment Rule. Instead, the board must satisfy the rigorous Blasius Standard by demonstrating a 'Compelling Justification' for its actions.",
                "Under Delaware corporate law, the 'Compelling Justification' standard is virtually insurmountable. Preventing shareholders from making what the board considers a foolish voting choice is NOT a compelling justification; the shareholder franchise is the structural foundation of board authority, and directors cannot disenfranchise their own masters.",
                "In MM Companies, Inc. v. Liquid Audio, Inc. (Del. 2003) and recent Delaware Supreme Court syntheses (Coster v. UIP Companies, Inc., Del. 2021), Delaware confirmed that the Blasius compelling justification standard operates within the enhanced scrutiny framework of Unocal. Whenever defensive measures touch upon the shareholder franchise, Delaware courts will issue immediate preliminary injunctions enjoining bylaw amendments, invalidating board expansions, and restoring the democratic vote."
            ],
            "example": "Facing a proxy contest from an activist owning 12% of shares, the board amends the bylaws 2 weeks before the annual meeting, postponing the election by 9 months and adding 4 friendly seats. The activist sues in Delaware Chancery. Under Blasius, the court invalidates the bylaw amendments and enjoins the board expansion, ruling that fear of electoral defeat is never a compelling justification.",
            "code": """# Simulation: Blasius Industries Compelling Justification & Franchise Protection Analyzer
from typing import Dict, List

def evaluate_blasius_board_franchise_interference(
    board_action_name: str,
    action_type: str, # 'POSTPONE_MEETING', 'EXPAND_BOARD_AND_FILL_VACANCIES', 'AMEND_ADVANCE_NOTICE_BYLAWS'
    timing_relative_to_contested_election: str, # 'ON_EVE_OF_ELECTION', 'ORDINARY_COURSE_TRANQUIL_PERIOD'
    primary_purpose_is_to_thwart_shareholder_vote: bool,
    board_subjective_good_faith_belief_in_defense: bool,
    board_asserted_justification: str # 'AVOID_SHAREHOLDER_MISTAKE', 'ACTUAL_DISENFRANCHISEMENT_PREVENTION'
) -> dict:
    # 1. Primary Purpose Inquiry under Blasius
    is_franchise_interference = (
        primary_purpose_is_to_thwart_shareholder_vote and 
        timing_relative_to_contested_election == 'ON_EVE_OF_ELECTION'
    )
    
    if not is_franchise_interference:
        return {
            'board_action_name': board_action_name,
            'review_standard': "BUSINESS_JUDGMENT_RULE_PRESUMPTION",
            'compelling_justification_required': False,
            'action_validity': "VALID_EXERCISE_OF_MANAGERIAL_AUTHORITY",
            'chancery_injunction_granted': False,
            'judicial_rationale': "Action adopted in ordinary course without primary purpose of impeding shareholder franchise."
        }
        
    # 2. Blasius Review Standard Triggered
    # Rule: Good faith belief that stockholders will make a poor choice is NEVER a compelling justification
    is_compelling_justification = (
        board_asserted_justification == 'ACTUAL_DISENFRANCHISEMENT_PREVENTION' or
        board_asserted_justification == 'EXISTENTIAL_EMERGENCY_DISRUPTION'
    )
    
    if is_compelling_justification:
        validity = "UPHELD_COMPELLING_JUSTIFICATION_ESTABLISHED"
        injunction = False
        rationale = "Board proved extraordinary compelling justification strictly necessary to preserve fair democratic process."
    else:
        validity = "VOIDABLE_BLASIUS_VIOLATION"
        injunction = True
        rationale = "Board acted for primary purpose of thwarting shareholder franchise without compelling justification (paternalism rejected)."
        
    return {
        'board_action_name': board_action_name,
        'review_standard': "BLASIUS_COMPELLING_JUSTIFICATION_STRICT_SCRUTINY",
        'compelling_justification_required': True,
        'action_validity': validity,
        'chancery_injunction_granted': injunction,
        'judicial_rationale': rationale
    }

# Execute deterministic validation
b1 = evaluate_blasius_board_franchise_interference("Eve-of-Vote Board Expansion", "EXPAND_BOARD_AND_FILL_VACANCIES", "ON_EVE_OF_ELECTION", True, True, "AVOID_SHAREHOLDER_MISTAKE")
b2 = evaluate_blasius_board_franchise_interference("Routine Bylaw Housekeeping", "AMEND_ADVANCE_NOTICE_BYLAWS", "ORDINARY_COURSE_TRANQUIL_PERIOD", False, True, "ROUTINE_ADMINISTRATION")

print(f"[{b1['board_action_name']}] -> Standard: {b1['review_standard']} | Injunction: {b1['chancery_injunction_granted']} | Validity: {b1['action_validity']}")
print(f"[{b2['board_action_name']}] -> Standard: {b2['review_standard']} | Injunction: {b2['chancery_injunction_granted']} | Validity: {b2['action_validity']}")
""",
            "output": """[Eve-of-Vote Board Expansion] -> Standard: BLASIUS_COMPELLING_JUSTIFICATION_STRICT_SCRUTINY | Injunction: True | Validity: VOIDABLE_BLASIUS_VIOLATION
[Routine Bylaw Housekeeping] -> Standard: BUSINESS_JUDGMENT_RULE_PRESUMPTION | Injunction: False | Validity: VALID_EXERCISE_OF_MANAGERIAL_AUTHORITY
""",
            "codeNotes": [
                {"line": 15, "note": "Identifies primary purpose of impeding stockholder vote triggering Blasius scrutiny"},
                {"line": 26, "note": "Rejects managerial paternalism: belief that shareholders will vote poorly is not compelling"},
                {"line": 34, "note": "Issues Delaware Court of Chancery preliminary injunction voiding retaliatory board actions"}
            ],
            "tryIt": "Set primary_purpose_is_to_thwart_shareholder_vote to False in b1 to see how the Business Judgment Rule is restored when no franchise interference exists.",
            "check": {
                "question": "Under the Blasius Industries doctrine, what standard of review applies when a corporate board takes defensive action for the primary purpose of interfering with or thwarting a shareholder vote?",
                "options": [
                    "The board must prove a 'Compelling Justification' for its action; paternalistic desire to protect shareholders from their own vote is legally insufficient.",
                    "The Business Judgment Rule automatically shields the board.",
                    "The board is dissolved and taken over by the U.S. Navy.",
                    "The shareholders lose their right to sue in court."
                ],
                "answer": 0,
                "why": "Blasius establishes that boards cannot act to disenfranchise stockholders without proving a compelling justification, which can almost never be met.",
                "answerIndex": 0,
                "explanation": "Blasius establishes that boards cannot act to disenfranchise stockholders without proving a compelling justification, which can almost never be met."
            }
        }
    ],
    "summary": [
        "Corporate Democracy & Statutory Voting: DGCL § 211 mandates annual meetings; fundamental mergers (§ 251), charter changes (§ 242), and asset sales (§ 271) require majority of outstanding shares.",
        "SEC Proxy Regulation & Schedule 14A: Section 14(a) regulates proxy solicitations; Rule 14a-9 prohibits material omissions under the TSC Industries reasonable investor standard.",
        "Rule 14a-8 Shareholder Proposals: Enables qualifying stockholders to submit proposals; excludable under (i)(1) improper under state law, (i)(7) ordinary business, or (i)(10) substantially implemented.",
        "Universal Proxy Contests (Rule 14a-19): Requires unified proxy cards listing all candidates, enabling mix-and-match voting influenced by ISS and Glass Lewis endorsements.",
        "Blasius Compelling Justification Standard: Board actions taken for the primary purpose of impeding the shareholder franchise trigger strict scrutiny requiring an insurmountable compelling justification."
    ],
    "projectStep": {
        "title": "Corporate Law Milestone 4 Step 4: Shareholder Proxy Architecture & Universal Proxy Strategy",
        "steps": [
            "Model statutory shareholder voting thresholds under DGCL §§ 211, 216, 228, and 251 for contested corporate actions.",
            "Draft Schedule 14A proxy disclosures and audit materiality omissions under SEC Rule 14a-9 and TSC Industries.",
            "Review Rule 14a-8 shareholder proposals, identify ordinary business exclusions, and prepare SEC No-Action requests.",
            "Formulate an SEC Rule 14a-19 universal proxy card strategy and model institutional index fund vote allocations.",
            "Evaluate board defense maneuvers under the Blasius Industries compelling justification doctrine to prevent injunctions."
        ]
    }
}

if __name__ == "__main__":
    total = ensure_law_day_budget(DAY_19)
    print(f"B.Com Corporate Law Day 19 Total Words: {total}")
    for i, p in enumerate(DAY_19['parts']):
        print(f"  Part {i+1} words: {count_words(p['say'])}")
