"""
Course 29: B.Com Corporate & Commercial Law, Contracts & Governance (bcom_law)
Day 16 Builder: Board Governance, Duty of Care, Duty of Loyalty & In re Caremark Oversight
Milestone 4 Kickoff: Corporate Governance, Fiduciary Duties & Shareholder Democracy
Guarantees >= 580 words per part and >= 2,950 words total with deterministic Python simulations.
"""

from corporate_law_budget_ensurer import ensure_law_day_budget
from visual_builder import count_words

DAY_16 = {
    "coursePrefix": "bcom_law",
    "day": 16,
    "title": "Board Governance: Duty of Care, Duty of Loyalty & In re Caremark Oversight Invariants",
    "goal": "Master corporate board fiduciary jurisprudence under Delaware General Corporation Law (DGCL): dissect the dual duties of Care and Loyalty, analyze the Business Judgment Rule and gross negligence under Smith v. Van Gorkom, evaluate Section 102(b)(7) exculpation and the good-faith doctrine under In re Walt Disney Co., model board oversight liability under In re Caremark and Marchand v. Barnhill mission-critical standards, and structure DGCL § 145 officer indemnification and D&O insurance.",
    "minutes": 45,
    "recap": "In Milestone 3 (Days 11–15), we mastered the Securities Act registration timeline, private placements under Regulation D, IPO underwriting syndicates, and PSLRA class action defense. Today we launch Milestone 4: Corporate Governance, Board Fiduciary Duties, Shareholder Derivative Litigation, and Proxy Contests.",
    "parts": [
        {
            "title": "The Dual Fiduciary Pillars: Duty of Care vs. Duty of Loyalty under Delaware Law",
            "say": [
                "Corporate governance is the legal and institutional framework through which corporate power is exercised, monitored, and held accountable. In a modern corporation characterized by the separation of ownership and control, shareholders provide equity capital while delegating broad operational authority to a centralized Board of Directors. Under Section 141(a) of the Delaware General Corporation Law (DGCL § 141(a)), the business and affairs of every Delaware corporation are managed by or under the direction of its board of directors. To constrain this immense managerial discretion, equity imposes unyielding fiduciary obligations upon directors and officers.",
                "Delaware corporate jurisprudence structures fiduciary duties into two primary, unshakeable pillars: the Duty of Care and the Duty of Loyalty. These fiduciary duties are not mere ethical suggestions; they are equitable legal obligations enforceable by shareholders through derivative litigation, holding corporate fiduciaries personally liable for resulting enterprise damages.",
                "The Duty of Care requires directors to perform their directorial functions with the care that an ordinarily prudent person in a like position would exercise under similar circumstances. In practice, the duty of care is predominantly process-oriented: directors must make business decisions on an informed basis, conducting diligent factual inquiries, reviewing technical and financial documentation, consulting independent experts, and deliberating thoroughly before authorizing major transactions. Neglecting to become adequately informed constitutes actionable procedural failure.",
                "In stark contrast, the Duty of Loyalty demands undivided, unyielding allegiance to the corporation and its stockholders. It mandates that fiduciaries subordinate their personal financial interests, private ambitions, and external relationships to the welfare of the enterprise. Unlike the duty of care (which concerns competence and diligence), the duty of loyalty addresses honesty, self-dealing, conflict of interest, and good faith. A director breaches the duty of loyalty whenever they appropriate a corporate opportunity, vote on an interested transaction without full disclosure, or act with an intentional dereliction of corporate duty.",
                "The operational boundary between care and loyalty is profound in corporate litigation: while the duty of care can be shielded by the Business Judgment Rule and exculpated under corporate charters, breaches of the duty of loyalty cannot be exculpated under Delaware law, exposing directors to personal, out-of-pocket compensatory and disgorgement damages."
            ],
            "example": "A board approving a $500 million acquisition in a 20-minute meeting without reading the merger agreement or obtaining a banker fairness opinion breaches the duty of care. Conversely, a director secretly voting to award a lucrative IT supply contract to their brother's company without disclosing the family relationship commits a classic breach of the duty of loyalty.",
            "code": """# Simulation: Delaware Corporate Fiduciary Duty Classifier & Review Standard Engine
from typing import Dict, List

def evaluate_director_fiduciary_conduct(
    director_id: str,
    director_name: str,
    action_type: str, # 'M&A_APPROVAL', 'VENDOR_CONTRACT', 'CHARTER_AMENDMENT'
    conducted_adequate_information_gathering: bool,
    deliberated_thoroughly_with_independent_advisors: bool,
    has_personal_financial_conflict_of_interest: bool,
    fully_disclosed_conflict_to_board: bool,
    acted_in_subjective_good_faith_for_corporate_benefit: bool
) -> dict:
    # 1. Duty of Care Evaluation (Process-driven inquiry)
    duty_of_care_satisfied = (
        conducted_adequate_information_gathering and 
        deliberated_thoroughly_with_independent_advisors
    )
    
    # 2. Duty of Loyalty Evaluation (Conflict-of-interest and good faith inquiry)
    is_interested_transaction = has_personal_financial_conflict_of_interest
    if is_interested_transaction:
        duty_of_loyalty_satisfied = fully_disclosed_conflict_to_board and acted_in_subjective_good_faith_for_corporate_benefit
    else:
        duty_of_loyalty_satisfied = acted_in_subjective_good_faith_for_corporate_benefit
        
    # Judicial Scrutiny Standard
    if not duty_of_loyalty_satisfied:
        scrutiny_standard = "ENTIRE_FAIRNESS_BURDEN_ON_DEFENDANT"
        liability_category = "BREACH_OF_DUTY_OF_LOYALTY_NON_EXCULPABLE"
        exculpation_shield_available = False
    elif not duty_of_care_satisfied:
        scrutiny_standard = "GROSS_NEGLIGENCE_DUTY_OF_CARE_REVIEW"
        liability_category = "BREACH_OF_DUTY_OF_CARE_EXCULPABLE_UNDER_102B7"
        exculpation_shield_available = True
    else:
        scrutiny_standard = "BUSINESS_JUDGMENT_RULE_PRESUMPTION"
        liability_category = "NO_FIDUCIARY_BREACH_DIRECTOR_CONDUCT_CLEARED"
        exculpation_shield_available = True
        
    return {
        'director_id': director_id,
        'director_name': director_name,
        'duty_of_care_satisfied': duty_of_care_satisfied,
        'duty_of_loyalty_satisfied': duty_of_loyalty_satisfied,
        'judicial_scrutiny_standard': scrutiny_standard,
        'liability_category': liability_category,
        'can_exculpate_damages': exculpation_shield_available
    }

# Execute deterministic validation
d1 = evaluate_director_fiduciary_conduct("DIR-01", "Diligent Independent Director", "M&A_APPROVAL", True, True, False, False, True)
d2 = evaluate_director_fiduciary_conduct("DIR-02", "Hasty Uninformed Director", "M&A_APPROVAL", False, False, False, False, True)
d3 = evaluate_director_fiduciary_conduct("DIR-03", "Self-Dealing Conflicted Director", "VENDOR_CONTRACT", True, True, True, False, False)

print(f"[{d1['director_name']}] -> Standard: {d1['judicial_scrutiny_standard']} | Liability: {d1['liability_category']}")
print(f"[{d2['director_name']}] -> Standard: {d2['judicial_scrutiny_standard']} | Exculpable: {d2['can_exculpate_damages']}")
print(f"[{d3['director_name']}] -> Standard: {d3['judicial_scrutiny_standard']} | Exculpable: {d3['can_exculpate_damages']}")
""",
            "output": """[Diligent Independent Director] -> Standard: BUSINESS_JUDGMENT_RULE_PRESUMPTION | Liability: NO_FIDUCIARY_BREACH_DIRECTOR_CONDUCT_CLEARED
[Hasty Uninformed Director] -> Standard: GROSS_NEGLIGENCE_DUTY_OF_CARE_REVIEW | Exculpable: True
[Self-Dealing Conflicted Director] -> Standard: ENTIRE_FAIRNESS_BURDEN_ON_DEFENDANT | Exculpable: False
""",
            "codeNotes": [
                {"line": 15, "note": "Evaluates procedural duty of care: information gathering and independent deliberation"},
                {"line": 21, "note": "Evaluates duty of loyalty: conflict of interest disclosure and subjective good faith"},
                {"line": 28, "note": "Applies Entire Fairness strict review when duty of loyalty is compromised, barring exculpation"}
            ],
            "tryIt": "Set fully_disclosed_conflict_to_board and acted_in_subjective_good_faith_for_corporate_benefit to True in d3 to observe how complete disclosure moves interested conduct toward approval.",
            "check": {
                "question": "Under Delaware corporate law, what is the critical legal difference between a breach of the Duty of Care and a breach of the Duty of Loyalty?",
                "options": [
                    "A breach of the duty of care can be exculpated under DGCL § 102(b)(7) corporate charter provisions, whereas breaches of the duty of loyalty cannot be exculpated and expose fiduciaries to personal monetary liability.",
                    "The duty of care applies only to companies that sell automobiles.",
                    "The duty of loyalty only applies if the director is an elected politician.",
                    "There is no legal difference between care and loyalty under Delaware law."
                ],
                "answer": 0,
                "why": "Section 102(b)(7) explicitly permits corporations to eliminate director monetary liability for duty of care breaches, but strictly prohibits exculpating breaches of the duty of loyalty or bad faith.",
                "answerIndex": 0,
                "explanation": "Section 102(b)(7) explicitly permits corporations to eliminate director monetary liability for duty of care breaches, but strictly prohibits exculpating breaches of the duty of loyalty or bad faith."
            }
        },
        {
            "title": "The Business Judgment Rule & Gross Negligence: Smith v. Van Gorkom",
            "say": [
                "The cornerstone of Anglo-American corporate law is the Business Judgment Rule (BJR). The BJR is a powerful judicial presumption that in making a business decision, the directors of a corporation acted on an informed basis, in good faith, and in the honest belief that the action taken was in the best interests of the company. Unless a plaintiff shareholder affirmatively rebuts this presumption, a court of equity—including the Delaware Court of Chancery—will refuse to second-guess the commercial wisdom, risk profile, or profitability of the board's decision.",
                "The legal rationale underpinning the BJR is fundamental to capitalist enterprise: corporate risk-taking is inherently uncertain. If judges exercised hindsight review, punishing directors with personal liability whenever a risky acquisition or product launch failed, competent executives would refuse to serve, and corporate boards would descend into paralysis. Thus, under the standard BJR, mere bad business judgment—or even catastrophic failure—does not create legal liability.",
                "However, the BJR presumption is not absolute. To overcome the Business Judgment Rule on duty of care grounds, a plaintiff must prove that the board acted with 'Gross Negligence'. In the seminal decision Smith v. Van Gorkom (Del. 1985), the Delaware Supreme Court demonstrated that gross negligence refers to procedural recklessness—failing to inform oneself of all material information reasonably available before making a business decision.",
                "In Van Gorkom, Trans Union CEO Jerome Van Gorkom unilaterally negotiated a cash buyout of the company by corporate raider Jay Pritzker at $55 per share without investment bankers or valuation studies. The Trans Union board approved the $690 million merger during a two-hour meeting without reading the merger agreement, without seeing a written summary of the deal terms, and based solely on a 20-minute oral presentation by Van Gorkom.",
                "The Delaware Supreme Court held the directors personally liable for gross negligence, ruling that the board was uninformed. Van Gorkom sent shockwaves through Wall Street and established the modern M&A protocol: before approving a major transaction, directors must review draft agreements, receive detailed financial presentations, demand written Fairness Opinions from independent investment banks, and document rigorous boardroom deliberation."
            ],
            "example": "If a board approves selling a profitable pharmaceutical division after three months of advisor meetings, discounted cash flow (DCF) models, and a formal fairness opinion, the BJR insulates the board even if the buyer later discovers a blockbuster drug. But if the board approved the sale over dinner without reading the contract, Van Gorkom gross negligence strips away BJR protection.",
            "code": """# Simulation: Business Judgment Rule Rebuttal & Smith v. Van Gorkom Gross Negligence Analyzer
from typing import Dict, List

def evaluate_business_judgment_rule_presumption(
    transaction_name: str,
    transaction_value_usd: float,
    board_meeting_duration_minutes: int,
    reviewed_merger_agreement_draft: bool,
    obtained_written_fairness_opinion_from_investment_bank: bool,
    evaluated_alternative_market_valuations: bool,
    relied_solely_on_ceo_oral_summary: bool,
    directors_are_disinterested_and_independent: bool
) -> dict:
    # 1. Gross Negligence Process Score (0 to 100)
    procedural_score = 0
    if board_meeting_duration_minutes >= 60:
        procedural_score += 20
    if reviewed_merger_agreement_draft:
        procedural_score += 25
    if obtained_written_fairness_opinion_from_investment_bank:
        procedural_score += 35
    if evaluated_alternative_market_valuations:
        procedural_score += 20
        
    is_procedurally_grossly_negligent = (
        relied_solely_on_ceo_oral_summary or 
        not reviewed_merger_agreement_draft or 
        procedural_score < 60
    )
    
    # 2. BJR Presumption Evaluation
    rebutted = False
    rebuttal_reason = "NONE_BJR_APPLIES"
    
    if not directors_are_disinterested_and_independent:
        rebutted = True
        rebuttal_reason = "BJR_REBUTTED_LOYALTY_CONFLICT_OF_INTEREST"
    elif is_procedurally_grossly_negligent:
        rebutted = True
        rebuttal_reason = "BJR_REBUTTED_VAN_GORKOM_GROSS_NEGLIGENCE_UNINFORMED_BOARD"
        
    bjr_sustained = not rebutted
    
    return {
        'transaction_name': transaction_name,
        'procedural_score': procedural_score,
        'is_grossly_negligent': is_procedurally_grossly_negligent,
        'bjr_sustained': bjr_sustained,
        'rebuttal_reason': rebuttal_reason,
        'court_standard_applied': "BUSINESS_JUDGMENT_RULE" if bjr_sustained else "JUDICIAL_SCRUTINY_OF_FAIRNESS"
    }

# Execute deterministic validation
trans_union_scenario = evaluate_business_judgment_rule_presumption(
    "Trans Union Buyout (Van Gorkom)", 690_000_000.0, 20, False, False, False, True, True
)
modern_merger_scenario = evaluate_business_judgment_rule_presumption(
    "Modern Strategic Merger", 1_200_000_000.0, 180, True, True, True, False, True
)

print(f"[{trans_union_scenario['transaction_name']}] -> BJR Sustained: {trans_union_scenario['bjr_sustained']} | Reason: {trans_union_scenario['rebuttal_reason']}")
print(f"[{modern_merger_scenario['transaction_name']}] -> BJR Sustained: {modern_merger_scenario['bjr_sustained']} | Court Review: {modern_merger_scenario['court_standard_applied']}")
""",
            "output": """[Trans Union Buyout (Van Gorkom)] -> BJR Sustained: False | Reason: BJR_REBUTTED_VAN_GORKOM_GROSS_NEGLIGENCE_UNINFORMED_BOARD
[Modern Strategic Merger] -> BJR Sustained: True | Court Review: BUSINESS_JUDGMENT_RULE
""",
            "codeNotes": [
                {"line": 15, "note": "Quantifies procedural due diligence: meeting duration, contract review, and fairness opinion"},
                {"line": 23, "note": "Implements Van Gorkom rule: approving a deal solely on oral summary is gross negligence"},
                {"line": 31, "note": "Rebuts Business Judgment Rule presumption upon showing of gross negligence or disloyalty"}
            ],
            "tryIt": "Set reviewed_merger_agreement_draft and obtained_written_fairness_opinion_from_investment_bank to True in trans_union_scenario to observe how formal diligence reinstates the BJR.",
            "check": {
                "question": "Under the Delaware Supreme Court's landmark ruling in Smith v. Van Gorkom, what standard of fault must a shareholder plaintiff prove to overcome the Business Judgment Rule on duty of care grounds?",
                "options": [
                    "Gross Negligence—demonstrating that the directors acted with procedural recklessness by failing to inform themselves of all material information reasonably available.",
                    "Mere Simple Negligence—showing that an ordinary person would have made a slightly different choice.",
                    "Strict Liability—proving that the corporate share price declined by more than 5%.",
                    "Criminal Treason against the state of Delaware."
                ],
                "answer": 0,
                "why": "Van Gorkom established that director duty of care claims are evaluated under a gross negligence standard, requiring proof that the board failed to engage in an informed decision-making process.",
                "answerIndex": 0,
                "explanation": "Van Gorkom established that director duty of care claims are evaluated under a gross negligence standard, requiring proof that the board failed to engage in an informed decision-making process."
            }
        },
        {
            "title": "Section 102(b)(7) Charter Exculpation & Good Faith: In re Walt Disney Co.",
            "say": [
                "The Delaware Supreme Court's decision in Smith v. Van Gorkom terrified the corporate community: outside directors realized that serving on a public company board could result in millions of dollars of personal bankruptcy liability for mere procedural oversights during fast-paced merger negotiations. In direct legislative response, the Delaware General Assembly enacted Section 102(b)(7) of the Delaware General Corporation Law (DGCL § 102(b)(7)).",
                "Section 102(b)(7) authorizes corporations to insert a provision in their certificate of incorporation eliminating or limiting the personal liability of a director to the corporation or its stockholders for monetary damages for breach of fiduciary duty. Virtually every public Delaware corporation has adopted an exculpatory charter provision. However, Section 102(b)(7) contains four express statutory exceptions. An exculpatory provision CANNOT eliminate liability for: (1) Any breach of the director's duty of loyalty; (2) Acts or omissions not in good faith or which involve intentional misconduct or a knowing violation of law; (3) Unlawful dividends under DGCL § 174; or (4) Any transaction from which the director derived an improper personal benefit.",
                "Because duty of care claims are immediately exculpated under Section 102(b)(7), plaintiffs' attorneys shifted their litigation strategy to alleging 'bad faith'—arguing that gross negligence in oversight constitutes a failure to act in good faith, which bypasses the exculpatory shield.",
                "In the landmark litigation In re Walt Disney Co. Derivative Litigation (Del. 2006), the Delaware Supreme Court conclusively defined the legal standard for corporate 'Good Faith'. The Disney lawsuit challenged Michael Ovitz's $140 million no-fault severance payout after serving only 14 months as Disney president. Chancellor Chandler and the Supreme Court affirmed that while Disney CEO Michael Eisner and the compensation committee conducted flawed, casual deliberations, their conduct did not constitute bad faith.",
                "The Supreme Court established a tripartite continuum of corporate conduct: (1) Subjective Bad Faith—conduct motivated by actual intent to harm the corporation; (2) Gross Negligence—uninformed action without malevolent intent, which constitutes a breach of care and IS exculpated under 102(b)(7); and (3) Intentional Dereliction of Duty / Conscious Disregard for Responsibilities—where a fiduciary consciously fails to act in the face of a known duty, demonstrating a disregard for duties. This third category constitutes non-exculpable bad faith under the duty of loyalty."
            ],
            "example": "A board approving a massive executive severance package without reviewing final employment agreements acts with gross negligence; under DGCL § 102(b)(7), the directors are immune from personal damages. But if directors intentionally looked the other way to enrich a friend while knowing the contract would harm the company, this conscious dereliction constitutes non-exculpable bad faith.",
            "code": """# Simulation: DGCL § 102(b)(7) Charter Exculpation & In re Walt Disney Bad Faith Engine
from typing import Dict, List

def evaluate_section_102b7_exculpation_shield(
    fiduciary_id: str,
    breach_type: str, # 'DUTY_OF_CARE_PROCEDURAL', 'DUTY_OF_LOYALTY_SELF_DEALING', 'CONSCIOUS_DISREGARD_OF_DUTY', 'IMPROPER_PERSONAL_BENEFIT'
    charter_contains_102b7_exculpation: bool,
    fiduciary_acted_with_subjective_intent_to_harm: bool,
    fiduciary_derived_improper_personal_benefit: bool,
    is_corporate_director: bool, # DGCL § 102(b)(7) 2022 amendment extended partial coverage to officers
    monetary_damages_claimed: float
) -> dict:
    if not charter_contains_102b7_exculpation:
        return {
            'fiduciary_id': fiduciary_id,
            'exculpation_granted': False,
            'status': 'NO_102B7_CLAUSE_IN_CHARTER',
            'personal_liability_usd': monetary_damages_claimed,
            'reason': 'Corporate charter lacks Section 102(b)(7) exculpatory provision.'
        }
        
    # Section 102(b)(7) Statutory Bar Invariants
    is_exculpable = True
    disqualification_reason = "NONE_EXCULPATED"
    
    if breach_type == 'DUTY_OF_LOYALTY_SELF_DEALING':
        is_exculpable = False
        disqualification_reason = "STATUTORY_BAR_DGCL_102B7_I_BREACH_OF_DUTY_OF_LOYALTY"
    elif breach_type == 'CONSCIOUS_DISREGARD_OF_DUTY' or fiduciary_acted_with_subjective_intent_to_harm:
        is_exculpable = False
        disqualification_reason = "STATUTORY_BAR_DGCL_102B7_II_ACTS_NOT_IN_GOOD_FAITH"
    elif fiduciary_derived_improper_personal_benefit:
        is_exculpable = False
        disqualification_reason = "STATUTORY_BAR_DGCL_102B7_IV_IMPROPER_PERSONAL_BENEFIT"
    elif breach_type == 'DUTY_OF_CARE_PROCEDURAL':
        is_exculpable = True
        disqualification_reason = "FULLY_EXCULPATED_DUTY_OF_CARE_GROSS_NEGLIGENCE"
        
    personal_liability = 0.0 if is_exculpable else monetary_damages_claimed
    
    return {
        'fiduciary_id': fiduciary_id,
        'exculpation_granted': is_exculpable,
        'status': 'MONETARY_LIABILITY_ELIMINATED' if is_exculpable else 'PERSONAL_MONETARY_LIABILITY_ENFORCED',
        'disqualification_reason': disqualification_reason,
        'personal_liability_usd': personal_liability
    }

# Execute deterministic validation
c_care = evaluate_section_102b7_exculpation_shield("DIR-CARE", "DUTY_OF_CARE_PROCEDURAL", True, False, False, True, 140_000_000.0)
c_bad_faith = evaluate_section_102b7_exculpation_shield("DIR-DISNEY", "CONSCIOUS_DISREGARD_OF_DUTY", True, False, False, True, 140_000_000.0)
c_loyalty = evaluate_section_102b7_exculpation_shield("DIR-SELFDEAL", "DUTY_OF_LOYALTY_SELF_DEALING", True, False, True, True, 50_000_000.0)

print(f"[{c_care['fiduciary_id']}] -> Exculpated: {c_care['exculpation_granted']} | Liability: ${c_care['personal_liability_usd']}")
print(f"[{c_bad_faith['fiduciary_id']}] -> Exculpated: {c_bad_faith['exculpation_granted']} | Reason: {c_bad_faith['disqualification_reason']}")
print(f"[{c_loyalty['fiduciary_id']}] -> Exculpated: {c_loyalty['exculpation_granted']} | Liability: ${c_loyalty['personal_liability_usd']/1e6:.1f}M")
""",
            "output": """[DIR-CARE] -> Exculpated: True | Liability: $0.0
[DIR-DISNEY] -> Exculpated: False | Reason: STATUTORY_BAR_DGCL_102B7_II_ACTS_NOT_IN_GOOD_FAITH
[DIR-SELFDEAL] -> Exculpated: False | Liability: $50.0M
""",
            "codeNotes": [
                {"line": 15, "note": "Eliminates personal monetary liability for duty of care breaches under DGCL § 102(b)(7)"},
                {"line": 21, "note": "Enforces non-exculpable statutory bar for acts not in good faith under In re Walt Disney"},
                {"line": 24, "note": "Enforces absolute bar against exculpating duty of loyalty or improper personal benefits"}
            ],
            "tryIt": "Set charter_contains_102b7_exculpation to False in c_care to observe how a company lacking the charter clause exposes directors to $140M in duty of care damages.",
            "check": {
                "question": "Under DGCL § 102(b)(7) and the Delaware Supreme Court's ruling in In re Walt Disney Co., which of the following director actions CANNOT be exculpated from monetary liability?",
                "options": [
                    "Acts or omissions not in good faith (conscious disregard of known duties) and breaches of the Duty of Loyalty.",
                    "Reviewing a financial report that had a typographical error.",
                    "Failing to ask a question during an investment banker presentation.",
                    "Deciding to expand sales operations into Canada."
                ],
                "answer": 0,
                "why": "Section 102(b)(7) expressly excludes breaches of the duty of loyalty and bad faith (conscious disregard of duties) from charter exculpation.",
                "answerIndex": 0,
                "explanation": "Section 102(b)(7) explicitly excludes breaches of the duty of loyalty and bad faith (conscious disregard of duties) from charter exculpation."
            }
        },
        {
            "title": "The Caremark Doctrine: Board Oversight & Mission-Critical Failure to Monitor",
            "say": [
                "Corporate directors do not spend their days operating factories, underwriting loans, or writing software; their statutory mandate under DGCL § 141(a) is supervisory oversight. However, what happens when catastrophic fraud, health and safety disasters, or money laundering occur deep within the enterprise without the board's knowledge? The legal standard governing director oversight liability is known as the Caremark Doctrine.",
                "Originating in Chancellor Allen's landmark decision In re Caremark International Inc. Derivative Litigation (Del. Ch. 1996) and formally adopted by the Delaware Supreme Court in Stone v. Ritter (2006), Caremark established that director oversight liability is the most difficult theory in corporation law upon which a plaintiff might hope to win a judgment. Because Section 102(b)(7) exculpates duty of care, oversight liability cannot be predicated upon mere negligence. Caremark oversight failure constitutes a breach of the duty of loyalty, requiring proof that the directors acted in bad faith through a conscious failure to monitor.",
                "Stone v. Ritter articulated the two classic prongs of a Caremark claim: (1) The directors utterly failed to implement any reporting or information system or controls (a 'Prong One' lack of systems claim); or (2) Having implemented such a system, the directors consciously failed to monitor or oversee its operations, thus disabling themselves from being informed of risks or problems requiring their attention (a 'Prong Two' ignored red flags claim).",
                "For over two decades, Caremark claims were routinely dismissed at the motion to dismiss stage. However, the Delaware Supreme Court revitalized the doctrine in Marchand v. Barnhill (Del. 2019). Marchand involved Blue Bell Creameries, an ice cream manufacturer where a listeria outbreak killed three consumers, sickened dozens, and wiped out millions in enterprise value. The Supreme Court held that regarding 'Mission-Critical Compliance Risks'—risks central to the company's core business, such as food safety for an ice cream company, aircraft safety for an aerospace manufacturer, or cybersecurity for a payment processor—directors owe an active, non-delegable duty to implement rigorous board-level monitoring systems.",
                "In Marchand, while Blue Bell had food safety technicians on the factory floor, the board had NO board-level food safety committee, NO regular food safety updates on board agendas, and NO protocol to escalate health inspection warnings to the boardroom. The Delaware Supreme Court ruled that regarding mission-critical risks, utter board-level passivity constitutes bad faith under Caremark Prong One, exposing directors to personal liability."
            ],
            "example": "If a commercial airline manufacturer has factory inspectors but its board of directors never discusses flight control software safety, has no engineering safety committee, and ignores whistleblowers warning of crashes, Marchand establishes a mission-critical Caremark oversight breach.",
            "code": """# Simulation: In re Caremark & Marchand v. Barnhill Mission-Critical Oversight Engine
from typing import Dict, List

def evaluate_caremark_board_oversight_liability(
    company_name: str,
    industry_sector: str, # 'FOOD_MANUFACTURING', 'AEROSPACE_DEFENSE', 'FINTECH_PAYMENTS', 'GENERAL_RETAIL'
    is_mission_critical_risk: bool,
    has_board_level_compliance_committee: bool,
    compliance_regularly_scheduled_on_board_agendas: bool,
    management_system_for_escalating_red_flags_to_board: bool,
    board_actively_ignored_known_regulatory_red_flags: bool,
    board_took_corrective_action_upon_notice: bool
) -> dict:
    # 1. Caremark Prong 1: Implementation of Board-Level Reporting Controls
    has_board_level_monitoring = (
        has_board_level_compliance_committee and 
        compliance_regularly_scheduled_on_board_agendas and 
        management_system_for_escalating_red_flags_to_board
    )
    
    # 2. Caremark Prong 2: Monitoring Operations & Red Flags
    ignored_red_flags = board_actively_ignored_known_regulatory_red_flags and not board_took_corrective_action_upon_notice
    
    # Judicial Evaluation under Marchand v. Barnhill
    oversight_breach = False
    governing_doctrine = "CAREMARK_OVERSIGHT_DISMISSED"
    liability_tier = "ZERO_DIRECTOR_OVERSIGHT_LIABILITY"
    
    if is_mission_critical_risk and not has_board_level_monitoring:
        oversight_breach = True
        governing_doctrine = "MARCHAND_V_BARNHILL_MISSION_CRITICAL_FAILURE_TO_MONITOR"
        liability_tier = "CAREMARK_PRONG_1_BAD_FAITH_BREACH_OF_DUTY_OF_LOYALTY"
    elif ignored_red_flags:
        oversight_breach = True
        governing_doctrine = "STONE_V_RITTER_IGNORED_RED_FLAGS_CONSCIOUS_DERELICTION"
        liability_tier = "CAREMARK_PRONG_2_BAD_FAITH_BREACH_OF_DUTY_OF_LOYALTY"
        
    return {
        'company_name': company_name,
        'industry_sector': industry_sector,
        'is_mission_critical': is_mission_critical_risk,
        'has_board_level_monitoring': has_board_level_monitoring,
        'oversight_breach': oversight_breach,
        'governing_doctrine': governing_doctrine,
        'liability_tier': liability_tier,
        'exculpable_under_102b7': False if oversight_breach else True # Bad faith loyalty breaches cannot exculpate
    }

# Execute deterministic validation
o_blue_bell = evaluate_caremark_board_oversight_liability(
    "Blue Bell Creameries (Marchand)", "FOOD_MANUFACTURING", True, False, False, False, False, False
)
o_compliant = evaluate_caremark_board_oversight_liability(
    "AeroTech Systems", "AEROSPACE_DEFENSE", True, True, True, True, False, True
)
o_red_flag = evaluate_caremark_board_oversight_liability(
    "Fintech Crypto Bank", "FINTECH_PAYMENTS", False, True, True, True, True, False
)

print(f"[{o_blue_bell['company_name']}] -> Breach: {o_blue_bell['oversight_breach']} | Doctrine: {o_blue_bell['governing_doctrine']}")
print(f"[{o_compliant['company_name']}] -> Breach: {o_compliant['oversight_breach']} | Status: {o_compliant['liability_tier']}")
print(f"[{o_red_flag['company_name']}] -> Breach: {o_red_flag['oversight_breach']} | Doctrine: {o_red_flag['governing_doctrine']}")
""",
            "output": """[Blue Bell Creameries (Marchand)] -> Breach: True | Doctrine: MARCHAND_V_BARNHILL_MISSION_CRITICAL_FAILURE_TO_MONITOR
[AeroTech Systems] -> Breach: False | Status: ZERO_DIRECTOR_OVERSIGHT_LIABILITY
[Fintech Crypto Bank] -> Breach: True | Doctrine: STONE_V_RITTER_IGNORED_RED_FLAGS_CONSCIOUS_DERELICTION
""",
            "codeNotes": [
                {"line": 15, "note": "Audits board-level controls: compliance committee, regular agenda scheduling, escalation pipeline"},
                {"line": 28, "note": "Implements Marchand mission-critical standard: utter lack of board monitoring is bad faith per se"},
                {"line": 32, "note": "Enforces Stone v. Ritter Prong 2: conscious failure to act upon known regulatory red flags"}
            ],
            "tryIt": "Set has_board_level_compliance_committee, compliance_regularly_scheduled_on_board_agendas, and management_system_for_escalating_red_flags_to_board to True in o_blue_bell to observe how active board monitoring shields against Marchand liability.",
            "check": {
                "question": "Under the Delaware Supreme Court's landmark ruling in Marchand v. Barnhill, how does the Caremark oversight standard apply to 'mission-critical' compliance risks (such as food safety in a food company)?",
                "options": [
                    "Directors must make a good faith effort to implement and monitor an active board-level compliance and reporting system specifically addressing the mission-critical risk; passive reliance on floor managers is bad faith.",
                    "Directors are completely immune from any oversight liability regarding mission-critical risks.",
                    "Mission-critical risks can be outsourced entirely to an offshore consulting firm.",
                    "Directors only need to read customer reviews on Twitter once a year."
                ],
                "answer": 0,
                "why": "Marchand held that regarding central, mission-critical operational hazards, a board's complete failure to maintain a board-level oversight system constitutes bad faith under Caremark.",
                "answerIndex": 0,
                "explanation": "Marchand held that regarding central, mission-critical operational hazards, a board's complete failure to maintain a board-level oversight system constitutes bad faith under Caremark."
            }
        },
        {
            "title": "Officer Fiduciary Duties & Corporate Indemnification: DGCL § 145 & D&O Insurance",
            "say": [
                "While corporate governance discussions historically focused on directors, executive officers—including the Chief Executive Officer (CEO), Chief Financial Officer (CFO), and General Counsel (CLO)—exercise direct day-to-day operational control over corporate assets. In Gantler v. Stephens (Del. 2009), the Delaware Supreme Court explicitly established that corporate officers owe the exact same fiduciary duties of care and loyalty as corporate directors.",
                "Furthermore, until recently, officers faced greater personal litigation exposure than directors: while directors enjoyed Section 102(b)(7) charter exculpation, officers did not. In August 2022, Delaware amended DGCL § 102(b)(7) to permit corporations to exculpate senior officers from personal monetary liability for duty of care breaches. However, officer exculpation is subject to a vital statutory limitation: it applies ONLY to direct shareholder claims, and expressly CANNOT exculpate officers in derivative actions brought by or in the right of the corporation.",
                "To attract talented executives in an aggressively litigious environment, corporations construct a multi-layered liability shield comprising: (1) Mandatory Charter & Bylaw Indemnification, (2) Bilateral Indemnification Agreements, and (3) Directors & Officers (D&O) Liability Insurance.",
                "Under DGCL § 145, corporate indemnification is divided into mandatory and permissive categories. Section 145(c) establishes Mandatory Indemnification: to the extent that a director or officer has been successful 'on the merits or otherwise' in defense of any action, the corporation MUST indemnify them against expenses (including attorneys' fees) actually and reasonably incurred. Even if the case was dismissed on a technical statute of limitations defense ('or otherwise'), indemnification is legally required.",
                "Under Section 145(e), corporations are authorized to advance litigation defense expenses to an officer before the final disposition of the proceeding, upon receipt of an 'undertaking' by the officer to repay the advance if it is ultimately determined that they did not act in good faith. Because corporate indemnification can be voided during insolvency or hostile takeovers, executives demand standalone D&O insurance policies. D&O policies feature three distinct insuring agreements: Side A (direct unindemnified coverage for officers when the company cannot or will not indemnify), Side B (corporate reimbursement when the company indemnifies officers), and Side C (entity coverage for securities claims)."
            ],
            "example": "If a CFO defeats a securities lawsuit on a motion to dismiss, DGCL § 145(c) mandates that the company pay 100% of the CFO's legal fees. If the company enters Chapter 11 bankruptcy and cannot pay, the executive's Side A D&O policy steps in to pay defense counsel directly, shielding the executive's personal bank accounts.",
            "code": """# Simulation: DGCL § 145 Indemnification & D&O Insurance Waterfall Allocation Engine
from typing import Dict, List

def calculate_executive_indemnification_and_insurance_payout(
    executive_title: str,
    case_disposition: str, # 'DISMISSED_ON_MERITS', 'DISMISSED_ON_TECHNICALITY', 'FOUND_LIABLE_FOR_BAD_FAITH', 'SETTLED_WITHOUT_ADMISSION'
    defense_costs_incurred_usd: float,
    settlement_or_judgment_amount_usd: float,
    is_derivative_suit: bool,
    company_is_solvent: bool,
    d_and_o_policy_limit_usd: float
) -> dict:
    # 1. DGCL § 145(c) Mandatory Indemnification (Successful on merits or otherwise)
    is_successful_defense = case_disposition in ['DISMISSED_ON_MERITS', 'DISMISSED_ON_TECHNICALITY']
    mandatory_indemnification_triggered = is_successful_defense
    
    # 2. Bad Faith Exclusion (Section 145 prohibits indemnifying bad faith / intentional misconduct)
    is_bad_faith = case_disposition == 'FOUND_LIABLE_FOR_BAD_FAITH'
    
    # Corporate Indemnification Ability
    if is_bad_faith:
        corporate_indemnifies_expenses = False
        corporate_indemnifies_judgment = False
    elif is_derivative_suit and case_disposition == 'SETTLED_WITHOUT_ADMISSION':
        corporate_indemnifies_expenses = True
        corporate_indemnifies_judgment = False # DGCL § 145(a)/(b) bars indemnifying derivative settlements/judgments directly
    else:
        corporate_indemnifies_expenses = True
        corporate_indemnifies_judgment = True
        
    # 3. D&O Insurance Waterfall Allocation (Side A vs Side B vs Personal Loss)
    total_claim = defense_costs_incurred_usd + settlement_or_judgment_amount_usd
    
    if is_bad_faith:
        side_a_payout = 0.0
        side_b_payout = 0.0
        corporate_cash_paid = 0.0
        executive_out_of_pocket_loss = total_claim # Conduct exclusion in D&O policy
        status = "INDEMNIFICATION_AND_INSURANCE_DENIED_BAD_FAITH"
    elif company_is_solvent and corporate_indemnifies_expenses:
        # Company pays executive, Side B reimburses company
        corporate_cash_paid = total_claim
        side_b_payout = min(corporate_cash_paid, d_and_o_policy_limit_usd)
        side_a_payout = 0.0
        executive_out_of_pocket_loss = 0.0
        status = "INDEMNIFIED_BY_COMPANY_SIDE_B_REIMBURSEMENT"
    elif not company_is_solvent:
        # Company broke -> Side A D&O pays executive directly
        side_a_payout = min(total_claim, d_and_o_policy_limit_usd)
        side_b_payout = 0.0
        corporate_cash_paid = 0.0
        executive_out_of_pocket_loss = max(0.0, total_claim - side_a_payout)
        status = "INSOLVENT_COMPANY_SIDE_A_DIRECT_EXECUTIVE_PROTECTION"
    else:
        side_a_payout = 0.0
        side_b_payout = 0.0
        corporate_cash_paid = 0.0
        executive_out_of_pocket_loss = total_claim
        status = "INDEMNIFICATION_UNAVAILABLE"
        
    return {
        'executive_title': executive_title,
        'mandatory_indemnification_statutory': mandatory_indemnification_triggered,
        'status': status,
        'corporate_cash_paid': corporate_cash_paid,
        'side_a_d_and_o_payout': side_a_payout,
        'side_b_d_and_o_payout': side_b_payout,
        'executive_out_of_pocket_loss': executive_out_of_pocket_loss
    }

# Execute deterministic validation
c_dismiss = calculate_executive_indemnification_and_insurance_payout("CFO", "DISMISSED_ON_MERITS", 2_500_000.0, 0.0, False, True, 25_000_000.0)
c_insolvent = calculate_executive_indemnification_and_insurance_payout("CEO", "SETTLED_WITHOUT_ADMISSION", 3_000_000.0, 10_000_000.0, False, False, 25_000_000.0)
c_bad_faith = calculate_executive_indemnification_and_insurance_payout("COO", "FOUND_LIABLE_FOR_BAD_FAITH", 4_000_000.0, 20_000_000.0, False, True, 25_000_000.0)

print(f"[{c_dismiss['executive_title']}] -> Status: {c_dismiss['status']} | Out of Pocket: ${c_dismiss['executive_out_of_pocket_loss']}")
print(f"[{c_insolvent['executive_title']}] -> Status: {c_insolvent['status']} | Side A Payout: ${c_insolvent['side_a_d_and_o_payout']/1e6:.1f}M")
print(f"[{c_bad_faith['executive_title']}] -> Status: {c_bad_faith['status']} | Out of Pocket: ${c_bad_faith['executive_out_of_pocket_loss']/1e6:.1f}M")
""",
            "output": """[CFO] -> Status: INDEMNIFIED_BY_COMPANY_SIDE_B_REIMBURSEMENT | Out of Pocket: $0.0
[CEO] -> Status: INSOLVENT_COMPANY_SIDE_A_DIRECT_EXECUTIVE_PROTECTION | Side A Payout: $13.0M
[COO] -> Status: INDEMNIFICATION_AND_INSURANCE_DENIED_BAD_FAITH | Out of Pocket: $24.0M
""",
            "codeNotes": [
                {"line": 15, "note": "Implements DGCL § 145(c) mandatory indemnification upon success on merits or otherwise"},
                {"line": 20, "note": "Enforces statutory prohibition against indemnifying bad faith or intentional misconduct"},
                {"line": 42, "note": "Deploys Side A D&O direct insurance waterfall when company is insolvent or legally barred"}
            ],
            "tryIt": "Set company_is_solvent to True in c_insolvent to see how the payout shifts from Side A direct coverage to Side B corporate reimbursement.",
            "check": {
                "question": "Under DGCL § 145(c), what is the corporation's legal obligation when a corporate officer or director is sued and the lawsuit is dismissed on a procedural technicality?",
                "options": [
                    "The corporation MUST provide mandatory indemnification for all actual and reasonable legal expenses incurred, because the officer was successful 'on the merits or otherwise'.",
                    "The corporation can refuse to pay if the CEO does not like the officer.",
                    "The officer must forfeit all stock options.",
                    "The court must re-try the case in a federal military tribunal."
                ],
                "answer": 0,
                "why": "Section 145(c) establishes mandatory indemnification whenever a fiduciary is successful 'on the merits or otherwise', including procedural or technical dismissals.",
                "answerIndex": 0,
                "explanation": "Section 145(c) establishes mandatory indemnification whenever a fiduciary is successful 'on the merits or otherwise', including procedural or technical dismissals."
            }
        }
    ],
    "summary": [
        "Care vs Loyalty Fiduciary Matrix: Duty of Care governs informed procedural decision-making; Duty of Loyalty demands undivided allegiance, good faith, and absence of self-dealing.",
        "Business Judgment Rule & Gross Negligence: The BJR presumes directors act in good faith and on an informed basis; under Smith v. Van Gorkom, gross negligence requires proof of procedural recklessness.",
        "Section 102(b)(7) Charter Exculpation: Eliminates director monetary liability for duty of care breaches, but strictly excludes duty of loyalty breaches and bad faith (In re Walt Disney).",
        "Caremark & Marchand Oversight: Fiduciary oversight liability requires bad faith; under Marchand v. Barnhill, boards must implement rigorous board-level monitoring for mission-critical risks.",
        "Officer Fiduciary Duties & D&O Shield: Officers owe identical fiduciaries under Gantler; protected by DGCL § 145 mandatory indemnification on success and Side A D&O insurance."
    ],
    "projectStep": {
        "title": "Corporate Law Milestone 4 Step 1: Board Fiduciary Governance & Caremark Oversight Architecture",
        "steps": [
            "Structure a corporate board decision-making protocol complying with Smith v. Van Gorkom gross negligence thresholds.",
            "Audit certificate of incorporation provisions under DGCL § 102(b)(7) to establish director and officer care exculpation.",
            "Formulate a Marchand v. Barnhill mission-critical board compliance and escalation monitoring framework.",
            "Draft executive indemnification agreements and structure a comprehensive Side A/B/C D&O insurance program under DGCL § 145."
        ]
    }
}

if __name__ == "__main__":
    total = ensure_law_day_budget(DAY_16)
    print(f"B.Com Corporate Law Day 16 Total Words: {total}")
    for i, p in enumerate(DAY_16['parts']):
        print(f"  Part {i+1} words: {count_words(p['say'])}")
