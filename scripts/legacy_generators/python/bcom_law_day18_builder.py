"""
Course 29: B.Com Corporate & Commercial Law, Contracts & Governance (bcom_law)
Day 18 Builder: Shareholder Derivative Litigation: Demand Futility (Aronson / Zuckerberg) & Special Litigation Committees
Milestone 4: Corporate Governance, Fiduciary Duties & Shareholder Democracy
Guarantees >= 580 words per part and >= 2,950 words total with deterministic Python simulations.
"""

from corporate_law_budget_ensurer import ensure_law_day_budget
from visual_builder import count_words

DAY_18 = {
    "coursePrefix": "bcom_law",
    "day": 18,
    "title": "Shareholder Derivative Litigation: Demand Futility (Aronson / Zuckerberg) & Special Litigation Committees",
    "goal": "Master the procedural and substantive architecture of shareholder derivative litigation under Delaware Court of Chancery Rule 23.1: distinguish direct vs. derivative claims under the Tooley v. Donaldson standard, evaluate pre-suit demand and the catastrophic consequences of demand refusal under Spiegel v. Buntrock, apply the modern unified demand futility framework under United Food v. Zuckerberg, model Special Litigation Committees (SLCs) under the two-step Zapata v. Maldonado review, and calculate derivative fee awards under the Sugarland factors.",
    "minutes": 45,
    "recap": "In Day 17, we mastered the corporate opportunities doctrine under Guth v. Loft and interested director transactions under DGCL § 144. Today in Day 18, we examine the primary procedural engine through which corporate fiduciaries are held accountable: shareholder derivative litigation, demand futility, and board defensive mechanisms.",
    "parts": [
        {
            "title": "Direct vs. Derivative Shareholder Lawsuits & Tooley v. Donaldson",
            "say": [
                "When corporate misconduct occurs, shareholders seeking judicial redress must navigate a fundamental jurisdictional threshold: determining whether their lawsuit is Direct or Derivative. This classification dictates the procedural hurdles, standing requirements, demand prerequisites, and ultimate distribution of any monetary judgment or settlement.",
                "In a Direct action, the shareholder sues corporate fiduciaries in their individual capacity to redress an injury inflicted directly upon the shareholder's own rights, distinct from any harm to the corporate entity. Classic examples of direct claims include the denial of statutory voting rights, interference with pre-emptive rights, breach of a shareholder agreement, or failure to permit inspection of corporate books and records under DGCL § 220. In a direct action, any monetary recovery belongs directly and exclusively to the plaintiff shareholder.",
                "In a Derivative action, the shareholder asserts a corporate cause of action on behalf of the corporation because the board of directors has failed or refused to do so. The underlying harm was inflicted directly upon the corporation (such as executive embezzlement, breach of fiduciary care or loyalty, corporate opportunity usurpation, or waste). The harm to the individual shareholder is purely indirect and derivative—experienced solely as a reduction in the market value of their shares. Crucially, any monetary recovery obtained in a derivative lawsuit flows directly into the corporate treasury, not to the suing shareholder.",
                "To eliminate decades of conflicting and confusing precedent, the Delaware Supreme Court established a definitive, two-prong test in Tooley v. Donaldson, Lufkin & Jenrette, Inc. (Del. 2004). Under Tooley, the Court of Chancery determines the nature of a shareholder claim by answering two objective questions: (1) Who suffered the alleged harm (the corporation or the suing stockholders individually)?; and (2) Who would receive the benefit of any recovery or other remedy (the corporation or the stockholders individually)?",
                "If the corporation suffered the harm and would receive the recovery, the claim is strictly derivative as a matter of law. Derivative status triggers intense procedural scrutiny under Court of Chancery Rule 23.1, requiring contemporaneous share ownership, continuous standing, verified pleadings, and compliance with the pre-suit demand requirement."
            ],
            "example": "If a CEO steals $50 million from the corporate bank account, the harm is to the corporation and the money must be returned to the corporate treasury; under Tooley, this is an exclusively derivative claim. Conversely, if the board unlawfully cancels an annual meeting to prevent shareholders from voting for dissident directors, the injury is to individual voting rights; under Tooley, this is a direct claim.",
            "code": """# Simulation: Tooley v. Donaldson Direct vs. Derivative Claim Classifier
from typing import Dict, List

def evaluate_direct_vs_derivative_claim(
    plaintiff_name: str,
    claim_description: str,
    primary_entity_damaged: str, # 'CORPORATION' or 'STOCKHOLDER_INDIVIDUALLY'
    remedy_recipient_entity: str, # 'CORPORATE_TREASURY' or 'INDIVIDUAL_STOCKHOLDERS'
    involves_contractual_shareholder_voting_rights: bool,
    involves_fiduciary_waste_or_self_dealing: bool
) -> dict:
    # Tooley Prong 1: Who suffered the alleged harm?
    is_corporate_harm = (primary_entity_damaged == 'CORPORATION') or involves_fiduciary_waste_or_self_dealing
    
    # Tooley Prong 2: Who would receive the benefit of any recovery?
    is_corporate_recovery = (remedy_recipient_entity == 'CORPORATE_TREASURY') or involves_fiduciary_waste_or_self_dealing
    
    # Classification Engine
    if not is_corporate_harm and not is_corporate_recovery and involves_contractual_shareholder_voting_rights:
        claim_type = "DIRECT_ACTION"
        procedural_pathway = "INDIVIDUAL_OR_CLASS_ACTION"
        rule_23_1_demand_applies = False
        recovery_destination = "DISTRIBUTED_TO_STOCKHOLDERS"
    elif is_corporate_harm and is_corporate_recovery:
        claim_type = "DERIVATIVE_ACTION"
        procedural_pathway = "DELAWARE_CHANCERY_RULE_23_1_DERIVATIVE"
        rule_23_1_demand_applies = True
        recovery_destination = "RESTORED_TO_CORPORATE_TREASURY"
    else:
        # Dual-natured or hybrid claim (rare post-Tooley)
        claim_type = "HYBRID_REQUIRING_TOOLEY_SEVERANCE"
        procedural_pathway = "SEVERED_PROCEEDING"
        rule_23_1_demand_applies = True
        recovery_destination = "SPLIT_ALLOCATION"
        
    return {
        'plaintiff_name': plaintiff_name,
        'claim_description': claim_description,
        'tooley_prong1_harm_bearer': primary_entity_damaged,
        'tooley_prong2_remedy_recipient': remedy_recipient_entity,
        'claim_type': claim_type,
        'procedural_pathway': procedural_pathway,
        'rule_23_1_demand_applies': rule_23_1_demand_applies,
        'recovery_destination': recovery_destination
    }

# Execute deterministic validation
c1 = evaluate_direct_vs_derivative_claim("Shareholder Pension Fund", "CEO $40M Embezzlement & Waste", "CORPORATION", "CORPORATE_TREASURY", False, True)
c2 = evaluate_direct_vs_derivative_claim("Retail Investor Union", "Denial of Proxy Voting at AGM", "STOCKHOLDER_INDIVIDUALLY", "INDIVIDUAL_STOCKHOLDERS", True, False)

print(f"[{c1['claim_description']}] -> Type: {c1['claim_type']} | Rule 23.1 Applies: {c1['rule_23_1_demand_applies']} | Recovery: {c1['recovery_destination']}")
print(f"[{c2['claim_description']}] -> Type: {c2['claim_type']} | Rule 23.1 Applies: {c2['rule_23_1_demand_applies']} | Recovery: {c2['recovery_destination']}")
""",
            "output": """[CEO $40M Embezzlement & Waste] -> Type: DERIVATIVE_ACTION | Rule 23.1 Applies: True | Recovery: RESTORED_TO_CORPORATE_TREASURY
[Denial of Proxy Voting at AGM] -> Type: DIRECT_ACTION | Rule 23.1 Applies: False | Recovery: DISTRIBUTED_TO_STOCKHOLDERS
""",
            "codeNotes": [
                {"line": 13, "note": "Implements Tooley Prong 1: analyzing whether corporate or individual entity suffered harm"},
                {"line": 16, "note": "Implements Tooley Prong 2: verifying whether corporate treasury or stockholders receive recovery"},
                {"line": 24, "note": "Triggers Delaware Chancery Rule 23.1 demand requirements only for derivative claims"}
            ],
            "tryIt": "In c1, change primary_entity_damaged to STOCKHOLDER_INDIVIDUALLY and remedy_recipient_entity to INDIVIDUAL_STOCKHOLDERS to observe how the claim would transform under Tooley.",
            "check": {
                "question": "Under the Delaware Supreme Court's Tooley v. Donaldson framework, what two questions determine whether a shareholder lawsuit is direct or derivative?",
                "options": [
                    "(1) Who suffered the alleged harm (the corporation or suing stockholders individually)?; and (2) Who would receive the benefit of any recovery?",
                    "(1) Is the corporation incorporated in New York?; and (2) How many employees work at the company?",
                    "(1) What is the company's price-to-earnings ratio?; and (2) Does the CEO own private jets?",
                    "(1) Was the complaint filed in a federal military court?; and (2) Has the SEC approved the lawsuit?"
                ],
                "answer": 0,
                "why": "Tooley established that claim classification depends entirely on who suffered the harm and who receives the recovery, eliminating prior confusing tests.",
                "answerIndex": 0,
                "explanation": "Tooley established that claim classification depends entirely on who suffered the harm and who receives the recovery, eliminating prior confusing tests."
            }
        },
        {
            "title": "The Pre-Suit Demand Requirement & Universal Demand vs. Demand Futility",
            "say": [
                "Because a derivative claim belongs fundamentally to the corporation, the decision to initiate, settle, or dismiss corporate litigation is a core managerial function. Under DGCL § 141(a), managerial power resides with the Board of Directors, not with individual shareholders. Therefore, before a private shareholder can usurp the board's litigation authority and prosecute a lawsuit in the company's name, they must navigate the procedural gate of Pre-Suit Demand.",
                "Under Rule 23.1 of the Delaware Court of Chancery Rules, a complaint in a shareholder derivative action must state with particularity: (1) Any effort of the plaintiff to obtain the desired action from the directors (making a demand), and (2) The reasons for not obtaining the action or for not making the effort (pleading demand futility). This procedural hurdle protects corporate boards from strike suits and nuisance litigation.",
                "In Delaware, making a pre-suit demand is fraught with severe strategic danger. Under the landmark doctrine established in Spiegel v. Buntrock (Del. 1990), a shareholder who serves a formal demand on the board of directors is legally deemed to have conceded that the board is independent and disinterested with respect to the subject matter of the dispute! Once demand is made, the shareholder permanently forfeits the right to argue that the board was conflicted.",
                "When the board inevitably reviews and refuses the shareholder's demand, that refusal is protected by the deferential Business Judgment Rule presumption. To overcome a board's demand refusal, the plaintiff must prove that the board acted with gross negligence, bad faith, or without conducting a reasonable investigation—an almost insurmountable evidentiary hurdle at the motion-to-dismiss stage. Consequently, sophisticated corporate litigants in Delaware almost never make a pre-suit demand; instead, they choose to plead Demand Futility.",
                "By contrast, jurisdictions following the Model Business Corporation Act (MBCA § 7.42) have adopted a 'Universal Demand' rule, requiring a written demand in 100% of cases and abolishing demand futility entirely. Delaware deliberately rejects universal demand, preserving demand futility to ensure an equitable safety valve when corporate boards are hopelessly captured by self-dealing fiduciaries."
            ],
            "example": "A shareholder discovers that directors awarded themselves $10 million in unauthorized bonuses. If the shareholder mails a letter demanding the board sue themselves, under Spiegel v. Buntrock the shareholder concedes the board's independence. When the board refuses, the court dismisses the suit under the BJR. But if the shareholder files immediately, alleging demand futility, the court evaluates the board's conflicts directly.",
            "code": """# Simulation: Pre-Suit Demand Strategy & Spiegel v. Buntrock Concession Risk Engine
from typing import Dict, List

def evaluate_pre_suit_demand_posture(
    shareholder_name: str,
    jurisdiction: str, # 'DELAWARE' or 'MBCA_UNIVERSAL_DEMAND'
    made_formal_presuit_demand_on_board: bool,
    board_refused_demand: bool,
    board_conducted_reasonable_investigation: bool,
    shareholder_pleaded_particularized_facts_of_futility: bool,
    board_is_hopelessly_conflicted: bool
) -> dict:
    if jurisdiction == 'MBCA_UNIVERSAL_DEMAND':
        # Universal demand required in all cases
        if not made_formal_presuit_demand_on_board:
            return {
                'shareholder_name': shareholder_name,
                'posture': "DISMISSED_FAILURE_TO_MAKE_MANDATORY_UNIVERSAL_DEMAND",
                'spiegel_concession_triggered': False,
                'review_standard': "STATUTORY_BAR",
                'survives_motion_to_dismiss': False
            }
            
    # Delaware Chancery Rule 23.1 Analysis
    if made_formal_presuit_demand_on_board:
        # Spiegel v. Buntrock Effect: Concedes board independence!
        spiegel_concession = True
        if board_refused_demand:
            if board_conducted_reasonable_investigation:
                posture = "DEMAND_REFUSED_PROTECTED_BY_BUSINESS_JUDGMENT_RULE"
                review_standard = "BJR_DEFERENCE_ON_BOARD_REFUSAL"
                survives_mtd = False
            else:
                posture = "WRONGFUL_DEMAND_REFUSAL_UNREASONABLE_INVESTIGATION"
                review_standard = "GROSS_NEGLIGENCE_REVIEW"
                survives_mtd = True
    else:
        # Demand Futility Pleading Route
        spiegel_concession = False
        if shareholder_pleaded_particularized_facts_of_futility and board_is_hopelessly_conflicted:
            posture = "DEMAND_EXCUSED_AS_FUTILE"
            review_standard = "DE_NOVO_FIDUCIARY_REVIEW"
            survives_mtd = True
        else:
            posture = "DISMISSED_FAILURE_TO_PLEAD_PARTICULARIZED_FUTILITY"
            review_standard = "RULE_23_1_PLEADING_DEFECT"
            survives_mtd = False
            
    return {
        'shareholder_name': shareholder_name,
        'posture': posture,
        'spiegel_concession_triggered': spiegel_concession,
        'review_standard': review_standard,
        'survives_motion_to_dismiss': survives_mtd
    }

# Execute deterministic validation
p1 = evaluate_pre_suit_demand_posture("Unwary Shareholder A", "DELAWARE", True, True, True, False, True)
p2 = evaluate_pre_suit_demand_posture("Sophisticated Shareholder B", "DELAWARE", False, False, False, True, True)

print(f"[{p1['shareholder_name']}] -> Posture: {p1['posture']} | Spiegel Concession: {p1['spiegel_concession_triggered']} | Survives MTD: {p1['survives_motion_to_dismiss']}")
print(f"[{p2['shareholder_name']}] -> Posture: {p2['posture']} | Spiegel Concession: {p2['spiegel_concession_triggered']} | Survives MTD: {p2['survives_motion_to_dismiss']}")
""",
            "output": """[Unwary Shareholder A] -> Posture: DEMAND_REFUSED_PROTECTED_BY_BUSINESS_JUDGMENT_RULE | Spiegel Concession: True | Survives MTD: False
[Sophisticated Shareholder B] -> Posture: DEMAND_EXCUSED_AS_FUTILE | Spiegel Concession: False | Survives MTD: True
""",
            "codeNotes": [
                {"line": 21, "note": "Implements Spiegel v. Buntrock concession: making demand legally concedes board independence"},
                {"line": 25, "note": "Evaluates demand refusal under deferential Business Judgment Rule standard"},
                {"line": 34, "note": "Excuses pre-suit demand as futile upon pleading particularized facts of board conflict"}
            ],
            "tryIt": "Set board_conducted_reasonable_investigation to False in p1 to see how an egregious sham refusal can overcome the Spiegel concession.",
            "check": {
                "question": "What catastrophic legal consequence occurs under Delaware law (Spiegel v. Buntrock) when a shareholder serves a formal pre-suit demand on the board of directors?",
                "options": [
                    "The shareholder is legally deemed to have conceded that the board is disinterested and independent, forfeiting the right to argue demand futility.",
                    "The shareholder must transfer all their shares to the Governor of Delaware.",
                    "The corporation is forced into immediate bankruptcy.",
                    "The board of directors is automatically removed from office."
                ],
                "answer": 0,
                "why": "Spiegel v. Buntrock establishes that making demand waives any argument that the board was conflicted or lacked independence.",
                "answerIndex": 0,
                "explanation": "Spiegel v. Buntrock establishes that making demand waives any argument that the board was conflicted or lacked independence."
            }
        },
        {
            "title": "The Modern Demand Futility Standard: United Food v. Zuckerberg Unifying Aronson & Rales",
            "say": [
                "For nearly four decades, Delaware demand futility jurisprudence was fractured between two competing legal tests: Aronson v. Lewis (Del. 1984) and Rales v. Blasband (Del. 1993). Under Aronson, when a plaintiff challenged an affirmative business decision made by the very board currently in office, demand was excused if particularized facts raised a reasonable doubt that: (1) the directors were disinterested and independent, or (2) the transaction was the product of valid business judgment. Under Rales, when the board did not make an affirmative decision (such as Caremark oversight failures) or when the board composition had changed, courts applied a different test asking whether the board could exercise independent business judgment.",
                "In September 2021, the Delaware Supreme Court resolved this decades-long doctrinal bifurcation in United Food and Commercial Workers Union v. Zuckerberg (Del. 2021). The Supreme Court formally adopted Vice Chancellor J. Travis Laster's three-part framework, declaring it the universal, unified standard for demand futility across all derivative litigation under Delaware Court of Chancery Rule 23.1.",
                "Under the unified Zuckerberg test, courts evaluate the board of directors in office at the time the derivative complaint was filed (the 'demand board'). On a director-by-director basis, the court asks three sequential questions for each individual fiduciary: (1) Did the director receive a material personal benefit from the alleged misconduct that is the subject of the litigation?; (2) Does the director face a substantial likelihood of liability on any of the claims that would be asserted in the litigation?; and (3) Does the director lack independence from someone who received a material personal benefit or faces a substantial likelihood of liability?",
                "If the court answers 'YES' to any one of these three questions for a specific director, that director is disqualified from impartially considering a litigation demand. Crucially, in evaluating Question 2 (substantial likelihood of liability), exculpation provisions under DGCL § 102(b)(7) are decisive: an exculpated director does not face a substantial likelihood of liability for duty of care claims; the plaintiff must plead particularized facts demonstrating bad faith or a breach of the duty of loyalty.",
                "Finally, demand is legally excused as futile if a majority of the demand board (at least 50% under Delaware arithmetic, meaning half or more) is disqualified under the three Zuckerberg inquiries."
            ],
            "example": "A corporation has a 6-member board. The CEO engaged in interested self-dealing (disqualified under Q1). Director B is the CEO's brother and financial dependent (disqualified under Q3 for lack of independence). Director C acted in bad faith, facing personal liability (disqualified under Q2). With 3 out of 6 directors (50%) disqualified, demand is excused as futile under Zuckerberg.",
            "code": """# Simulation: United Food v. Zuckerberg Unified Demand Futility Engine
from typing import Dict, List

def evaluate_zuckerberg_demand_futility(
    company_name: str,
    board_roster: List[Dict[str, any]]
    # Each director dict: {
    #   'name': str,
    #   'received_material_personal_benefit': bool,
    #   'faces_substantial_likelihood_of_non_exculpable_liability': bool,
    #   'lacks_independence_from_conflicted_party': bool
    # }
) -> dict:
    total_directors = len(board_roster)
    disqualified_directors = []
    independent_disinterested_directors = []
    
    for d in board_roster:
        name = d['name']
        q1 = d['received_material_personal_benefit']
        q2 = d['faces_substantial_likelihood_of_non_exculpable_liability']
        q3 = d['lacks_independence_from_conflicted_party']
        
        # Zuckerberg Invariant: Disqualified if ANY of the three questions is True
        if q1 or q2 or q3:
            reasons = []
            if q1: reasons.append("Q1_MATERIAL_PERSONAL_BENEFIT")
            if q2: reasons.append("Q2_SUBSTANTIAL_LIABILITY_EXPOSURE")
            if q3: reasons.append("Q3_LACKS_INDEPENDENCE")
            disqualified_directors.append({'name': name, 'disqualification_reasons': reasons})
        else:
            independent_disinterested_directors.append(name)
            
    disqualified_count = len(disqualified_directors)
    # Demand is excused if at least 50% (half or more) of the board is disqualified
    futility_threshold = total_directors / 2.0
    demand_excused_as_futile = disqualified_count >= futility_threshold
    
    if demand_excused_as_futile:
        ruling = "DEMAND_EXCUSED_AS_FUTILE_UNDER_ZUCKERBERG"
        rationale = f"{disqualified_count}/{total_directors} directors disqualified (threshold: {futility_threshold:.1f})."
        survives_rule_23_1_mtd = True
    else:
        ruling = "DEMAND_NOT_EXCUSED_MOTION_TO_DISMISS_GRANTED"
        rationale = f"Only {disqualified_count}/{total_directors} directors disqualified; board maintains impartial majority."
        survives_rule_23_1_mtd = False
        
    return {
        'company_name': company_name,
        'total_directors_count': total_directors,
        'disqualified_count': disqualified_count,
        'demand_excused_as_futile': demand_excused_as_futile,
        'court_ruling': ruling,
        'judicial_rationale': rationale,
        'survives_rule_23_1_mtd': survives_rule_23_1_mtd,
        'disqualified_roster': disqualified_directors
    }

# Execute deterministic validation on a 6-member tech board
board_test = [
    {'name': 'CEO / Founder', 'received_material_personal_benefit': True, 'faces_substantial_likelihood_of_non_exculpable_liability': True, 'lacks_independence_from_conflicted_party': True},
    {'name': 'Affiliated Brother', 'received_material_personal_benefit': False, 'faces_substantial_likelihood_of_non_exculpable_liability': False, 'lacks_independence_from_conflicted_party': True},
    {'name': 'Director with Bad Faith Oversight', 'received_material_personal_benefit': False, 'faces_substantial_likelihood_of_non_exculpable_liability': True, 'lacks_independence_from_conflicted_party': False},
    {'name': 'Independent Director A', 'received_material_personal_benefit': False, 'faces_substantial_likelihood_of_non_exculpable_liability': False, 'lacks_independence_from_conflicted_party': False},
    {'name': 'Independent Director B', 'received_material_personal_benefit': False, 'faces_substantial_likelihood_of_non_exculpable_liability': False, 'lacks_independence_from_conflicted_party': False},
    {'name': 'Independent Director C', 'received_material_personal_benefit': False, 'faces_substantial_likelihood_of_non_exculpable_liability': False, 'lacks_independence_from_conflicted_party': False}
]

z_res = evaluate_zuckerberg_demand_futility("CyberTech Inc.", board_test)
print(f"[{z_res['company_name']}] -> Ruling: {z_res['court_ruling']} | Disqualified: {z_res['disqualified_count']}/{z_res['total_directors_count']} | Survives MTD: {z_res['survives_rule_23_1_mtd']}")
""",
            "output": """[CyberTech Inc.] -> Ruling: DEMAND_EXCUSED_AS_FUTILE_UNDER_ZUCKERBERG | Disqualified: 3/6 | Survives MTD: True
""",
            "codeNotes": [
                {"line": 21, "note": "Implements Zuckerberg 3-part inquiry evaluating personal benefit, liability exposure, and independence"},
                {"line": 31, "note": "Applies Delaware 50% threshold: demand is excused if half or more of the board is disqualified"},
                {"line": 34, "note": "Denies Rule 23.1 motion to dismiss when demand futility threshold is satisfied"}
            ],
            "tryIt": "Set lacks_independence_from_conflicted_party to False for 'Affiliated Brother' to see how the board drops to 2/6 disqualified, causing the derivative suit to be dismissed.",
            "check": {
                "question": "Under the unified Delaware Supreme Court demand futility standard in United Food v. Zuckerberg, what percentage of the demand board must be disqualified to excuse pre-suit demand?",
                "options": [
                    "At least 50% (half or more of the sitting directors).",
                    "Exactly 100% of all directors.",
                    "At least 85% of all independent directors.",
                    "Only one single director."
                ],
                "answer": 0,
                "why": "Under Delaware law and Zuckerberg, if half or more of the board (at least 50%) is disqualified, the board cannot act by an impartial majority, excusing demand.",
                "answerIndex": 0,
                "explanation": "Under Delaware law and Zuckerberg, if half or more of the board (at least 50%) is disqualified, the board cannot act by an impartial majority, excusing demand."
            }
        },
        {
            "title": "Special Litigation Committees (SLCs) & Zapata Corp. v. Maldonado",
            "say": [
                "Even when a shareholder plaintiff successfully pleads demand futility under the Zuckerberg standard and defeats a Rule 23.1 motion to dismiss, the corporation is not powerless. The board of directors possesses a powerful procedural countermeasure to reclaim control over the company's legal destiny: the formation of a Special Litigation Committee (SLC).",
                "The procedural mechanics of an SLC allow a conflicted board to appoint newly elected, pristine, and undisputedly independent directors to an autonomous committee. The full board delegates complete, irrevocable corporate authority to the SLC to investigate the derivative claims, retain independent counsel and financial experts, and make a binding determination whether prosecuting, settling, or dismissing the lawsuit serves the corporation's best business interests.",
                "If the SLC concludes after an exhaustive inquiry that pursuing the litigation would damage commercial relationships, incur excessive legal fees, or distract management without proportional financial recovery, the SLC files a motion to dismiss the derivative action. In the landmark ruling Zapata Corp. v. Maldonado (Del. 1980), the Delaware Supreme Court designed a specialized two-step judicial review framework to scrutinize SLC dismissal motions.",
                "Step 1 (Inquiry into Independence, Good Faith, and Investigation): The Court of Chancery examines whether the SLC members were genuinely independent, whether they acted in subjective good faith, and whether their investigation was thorough, reasonable, and well-documented. Unlike standard litigation where the plaintiff bears the burden of proof, under Zapata Step 1, the corporation bears the affirmative burden of proving its committee's independence and diligence.",
                "Step 2 (The Court's Independent Business Judgment): If—and only if—the SLC satisfies Step 1, the Court of Chancery proceeds to the extraordinary second step: the judge applies their own independent equitable and business judgment to determine whether dismissal serves the best interests of the corporation. Step 2 represents a rare departure from judicial deference, serving as a vital check against subtle boardroom bias and the 'structural bias' inherent in directors evaluating fellow board members."
            ],
            "example": "After demand is excused in a derivative suit against 4 conflicted directors, the board appoints a former federal judge and a university dean as an SLC. The SLC hires Kirkland & Ellis, interviews 25 witnesses, and concludes that continuing the $10 million lawsuit would cost $12 million in legal fees and destroy a crucial vendor partnership. The Chancery Court verifies their independence under Step 1 and exercises its own business judgment to grant the SLC's motion to dismiss under Step 2.",
            "code": """# Simulation: Zapata Corp. v. Maldonado Special Litigation Committee Two-Step Review
from typing import Dict, List

def evaluate_zapata_slc_dismissal(
    action_name: str,
    slc_members: List[str],
    members_free_from_social_and_financial_ties_to_defendants: bool,
    slc_retained_independent_outside_counsel: bool,
    slc_conducted_extensive_interviews_and_document_review: bool,
    slc_produced_comprehensive_written_report: bool,
    litigation_recovery_potential_usd: float,
    estimated_defense_and_business_disruption_cost_usd: float,
    chancery_judge_concurs_dismissal_serves_corporate_interests: bool
) -> dict:
    # Zapata Step 1: Independence, Good Faith, and Investigative Thoroughness
    step1_independence_satisfied = members_free_from_social_and_financial_ties_to_defendants
    step1_good_faith_investigation_satisfied = (
        slc_retained_independent_outside_counsel and 
        slc_conducted_extensive_interviews_and_document_review and 
        slc_produced_comprehensive_written_report
    )
    step1_cleared = step1_independence_satisfied and step1_good_faith_investigation_satisfied
    
    if not step1_cleared:
        return {
            'action_name': action_name,
            'zapata_step1_cleared': False,
            'zapata_step2_cleared': False,
            'slc_motion_verdict': "MOTION_TO_DISMISS_DENIED_STEP_1_FAILURE",
            'judicial_rationale': "Corporation failed to prove SLC independence or investigative adequacy under Zapata Step 1.",
            'litigation_posture': "DERIVATIVE_ACTION_PROCEEDS_TO_DISCOVERY"
        }
        
    # Zapata Step 2: The Court of Chancery's Independent Business Judgment
    net_economic_benefit_to_company = litigation_recovery_potential_usd - estimated_defense_and_business_disruption_cost_usd
    
    # Court weighs economics and equitable public interest
    court_agrees_to_dismiss = (
        chancery_judge_concurs_dismissal_serves_corporate_interests and 
        (net_economic_benefit_to_company <= 0 or estimated_defense_and_business_disruption_cost_usd > litigation_recovery_potential_usd * 0.8)
    )
    
    if court_agrees_to_dismiss:
        verdict = "MOTION_TO_DISMISS_GRANTED_ZAPATA_STEP_2_CLEARED"
        rationale = "Court exercised independent business judgment: litigation costs and disruption outweigh potential recovery."
        posture = "DERIVATIVE_ACTION_DISMISSED_WITH_PREJUDICE"
    else:
        verdict = "MOTION_TO_DISMISS_DENIED_ZAPATA_STEP_2_REJECTION"
        rationale = "Court determined in its independent business judgment that lawsuit asserts meritorious high-recovery claims."
        posture = "DERIVATIVE_ACTION_PROCEEDS_TO_TRIAL"
        
    return {
        'action_name': action_name,
        'zapata_step1_cleared': True,
        'zapata_step2_cleared': court_agrees_to_dismiss,
        'slc_motion_verdict': verdict,
        'judicial_rationale': rationale,
        'litigation_posture': posture
    }

# Execute deterministic validation
z1 = evaluate_zapata_slc_dismissal("MegaCorp Trade Secret Breach", ["Judge Roberts", "Dean Evans"], True, True, True, True, 10000000.0, 14000000.0, True)
z2 = evaluate_zapata_slc_dismissal("Founder Embezzlement Suit", ["Country Club Friend A"], False, True, True, True, 80000000.0, 5000000.0, False)

print(f"[{z1['action_name']}] -> Verdict: {z1['slc_motion_verdict']} | Posture: {z1['litigation_posture']}")
print(f"[{z2['action_name']}] -> Verdict: {z2['slc_motion_verdict']} | Posture: {z2['litigation_posture']}")
""",
            "output": """[MegaCorp Trade Secret Breach] -> Verdict: MOTION_TO_DISMISS_GRANTED_ZAPATA_STEP_2_CLEARED | Posture: DERIVATIVE_ACTION_DISMISSED_WITH_PREJUDICE
[Founder Embezzlement Suit] -> Verdict: MOTION_TO_DISMISS_DENIED_STEP_1_FAILURE | Posture: DERIVATIVE_ACTION_PROCEEDS_TO_DISCOVERY
""",
            "codeNotes": [
                {"line": 15, "note": "Implements Zapata Step 1: shifting burden to corporation to prove SLC independence and good faith"},
                {"line": 28, "note": "Implements Zapata Step 2: Chancery Court exercises independent business judgment on dismissal"},
                {"line": 34, "note": "Dismisses derivative suit with prejudice when both Zapata prongs are satisfied"}
            ],
            "tryIt": "Set chancery_judge_concurs_dismissal_serves_corporate_interests to False in z1 to see how Chancery Step 2 can override the SLC even when Step 1 was flawlessly satisfied.",
            "check": {
                "question": "What is unique about Step 2 of the Delaware Supreme Court's Zapata v. Maldonado framework for reviewing Special Litigation Committee dismissals?",
                "options": [
                    "The Court of Chancery applies its own independent business judgment to determine whether dismissing the derivative suit serves the best interests of the corporation.",
                    "The judge must flip a coin in open court.",
                    "The litigation is automatically transferred to the United States Supreme Court.",
                    "The plaintiff shareholder is awarded the company's patent portfolio."
                ],
                "answer": 0,
                "why": "Zapata Step 2 uniquely empowers the Chancery judge to apply their own business judgment, acting as an equitable check against boardroom structural bias.",
                "answerIndex": 0,
                "explanation": "Zapata Step 2 uniquely empowers the Chancery judge to apply their own business judgment, acting as an equitable check against boardroom structural bias."
            }
        },
        {
            "title": "Derivative Settlement Mechanics, Releases & Attorney's Fees (Sugarland Factors)",
            "say": [
                "Because a derivative lawsuit is prosecuted by an individual shareholder on behalf of all stockholders and the corporation itself, derivative settlements cannot be finalized by private agreement between the litigants. Under Delaware Court of Chancery Rule 23.1(c), a derivative action shall not be dismissed or compromised without the approval of the Court of Chancery, and notice of the proposed dismissal or compromise must be given to all stockholders.",
                "Before approving a derivative settlement, the Court of Chancery holds a formal Settlement Hearing to ensure that the agreement is fair, reasonable, and adequate, and that the global releases granted to defendant directors are proportionate to the corporate consideration provided. In many derivative settlements, consideration consists not of cash, but of 'Therapeutic Relief'—meaning corporate governance reforms, such as board declassification, enhanced committee charters, independent chairman mandates, orclawback policies.",
                "The economic engine driving derivative litigation is the judicial award of Plaintiff's Attorney's Fees. Under the Common Benefit Doctrine, when derivative counsel successfully creates a financial recovery or confers a substantial therapeutic benefit upon the corporation, counsel is entitled to an equitable fee paid directly from the corporate recovery or by the company.",
                "To determine the dollar amount of plaintiff attorney's fees, Delaware courts apply the seminal Sugarland factors established in Sugarland Industries, Inc. v. Thomas (Del. 1980): (1) The results achieved and the benefit conferred on the corporation; (2) The time, effort, and hours logged by counsel; (3) The contingent nature of the fee arrangement; (4) The difficulty and complexity of the litigation; and (5) The standing, skill, and reputation of counsel.",
                "Under Sugarland, the primary factor is the Benefit Conferred. In cash settlements, Chancery courts routinely award between 15% and 25% of the fund created, utilizing the lodestar cross-check (hours multiplied by hourly rates times a risk multiplier) to ensure the final fee award is non-windfall and thoroughly justified."
            ],
            "example": "Derivative counsel recovers $120 million in cash from self-dealing officers and establishes an independent risk committee. Counsel requests a $24 million fee (20% of the cash fund under Sugarland). Having logged 3,000 hours at an average lodestar rate of $1,000/hr ($3M base), the court approves the fee, finding the 8x multiplier justified by the extraordinary monetary result and full contingency risk.",
            "code": """# Simulation: Sugarland Derivative Attorney's Fee Calculator & Settlement Allocator
from typing import Dict, List

def calculate_sugarland_derivative_attorney_fees(
    settlement_case_name: str,
    monetary_settlement_fund_usd: float,
    conferred_therapeutic_governance_benefit: bool,
    plaintiff_counsel_logged_hours: float,
    blended_hourly_rate_usd: float,
    contingency_risk_tier: str, # 'HIGH_RISK', 'MODERATE_RISK', 'LOW_RISK'
    sugarland_percentage_benchmark: float # e.g. 0.20 for 20%
) -> dict:
    # 1. Base Monetary Benefit Fee under Sugarland Percentage
    base_conferred_benefit_fee = monetary_settlement_fund_usd * sugarland_percentage_benchmark
    
    # 2. Lodestar Calculation
    base_lodestar = plaintiff_counsel_logged_hours * blended_hourly_rate_usd
    
    # 3. Implied Multiplier
    implied_multiplier = (base_conferred_benefit_fee / base_lodestar) if base_lodestar > 0 else 1.0
    
    # 4. Cap Multiplier based on Contingency Risk
    if contingency_risk_tier == 'HIGH_RISK':
        max_allowable_multiplier = 9.0
    elif contingency_risk_tier == 'MODERATE_RISK':
        max_allowable_multiplier = 4.5
    else:
        max_allowable_multiplier = 2.0
        
    actual_approved_multiplier = min(implied_multiplier, max_allowable_multiplier)
    final_approved_fee_usd = base_lodestar * actual_approved_multiplier
    
    # Corporate Net Recovery
    net_corporate_treasury_recovery = monetary_settlement_fund_usd - final_approved_fee_usd
    
    return {
        'settlement_case_name': settlement_case_name,
        'gross_fund_created_usd': monetary_settlement_fund_usd,
        'base_lodestar_usd': base_lodestar,
        'implied_multiplier': round(implied_multiplier, 2),
        'approved_multiplier': round(actual_approved_multiplier, 2),
        'approved_attorney_fees_usd': round(final_approved_fee_usd, 2),
        'net_corporate_recovery_usd': round(net_corporate_treasury_recovery, 2),
        'effective_fee_percentage': round((final_approved_fee_usd / monetary_settlement_fund_usd) * 100, 1) if monetary_settlement_fund_usd > 0 else 0.0
    }

# Execute deterministic validation
fee1 = calculate_sugarland_derivative_attorney_fees("Pharma Derivative Cash Recovery", 100000000.0, True, 2500.0, 950.0, "HIGH_RISK", 0.20)
fee2 = calculate_sugarland_derivative_attorney_fees("Modest Fiduciary Settlement", 15000000.0, False, 1800.0, 850.0, "MODERATE_RISK", 0.22)

print(f"[{fee1['settlement_case_name']}] -> Approved Fee: ${fee1['approved_attorney_fees_usd']/1e6:.2f}M ({fee1['effective_fee_percentage']}%) | Net to Co: ${fee1['net_corporate_recovery_usd']/1e6:.2f}M | Multiplier: {fee1['approved_multiplier']}x")
print(f"[{fee2['settlement_case_name']}] -> Approved Fee: ${fee2['approved_attorney_fees_usd']/1e6:.2f}M ({fee2['effective_fee_percentage']}%) | Net to Co: ${fee2['net_corporate_recovery_usd']/1e6:.2f}M | Multiplier: {fee2['approved_multiplier']}x")
""",
            "output": """[Pharma Derivative Cash Recovery] -> Approved Fee: $20.00M (20.0%) | Net to Co: $80.00M | Multiplier: 8.42x
[Modest Fiduciary Settlement] -> Approved Fee: $3.30M (22.0%) | Net to Co: $11.70M | Multiplier: 2.16x
""",
            "codeNotes": [
                {"line": 15, "note": "Calculates Sugarland percentage fee based on quantifiable monetary common fund created"},
                {"line": 18, "note": "Computes baseline lodestar hours multiplied by hourly rate for judicial cross-check"},
                {"line": 34, "note": "Restores remaining net monetary recovery directly into the corporate treasury"}
            ],
            "tryIt": "Reduce plaintiff_counsel_logged_hours in fee1 to 1,000 to see how an excessive implied multiplier would test maximum allowable contingency caps.",
            "check": {
                "question": "Under Court of Chancery Rule 23.1(c) and Sugarland, what is required before a shareholder derivative action can be settled and attorney's fees awarded?",
                "options": [
                    "Notice to all stockholders, court approval following a fairness hearing, and fee determination grounded in the corporate benefit achieved under the Sugarland factors.",
                    "A private secret payment from the CEO directly to plaintiff counsel.",
                    "An executive order signed by the President of the United States.",
                    "Immediate dissolution of the corporate entity."
                ],
                "answer": 0,
                "why": "Rule 23.1(c) mandates judicial scrutiny and stockholder notice to prevent collusive settlements, with fees governed by Sugarland benefit analysis.",
                "answerIndex": 0,
                "explanation": "Rule 23.1(c) mandates judicial scrutiny and stockholder notice to prevent collusive settlements, with fees governed by Sugarland benefit analysis."
            }
        }
    ],
    "summary": [
        "Direct vs. Derivative Actions under Tooley: Claim characterization depends on (1) who suffered the harm, and (2) who receives the recovery; corporate harms are strictly derivative.",
        "Pre-Suit Demand & Spiegel v. Buntrock: Making a pre-suit demand in Delaware legally concedes board independence, exposing refusal to Business Judgment Rule deference.",
        "Unified Demand Futility under United Food v. Zuckerberg: Universal 3-part inquiry evaluates personal benefit, substantial liability, and lack of independence; 50% disqualification excuses demand.",
        "Special Litigation Committees & Zapata: Conflicted boards can appoint independent SLCs; judicial review follows Zapata Step 1 (independence/investigation) and Step 2 (court's own business judgment).",
        "Derivative Settlements & Sugarland Fees: Court approval and notice required under Rule 23.1(c); attorney's fees awarded under Sugarland benefit percentage cross-checked by lodestar multipliers."
    ],
    "projectStep": {
        "title": "Corporate Law Milestone 4 Step 3: Shareholder Derivative Defense & Demand Futility Architecture",
        "steps": [
            "Classify shareholder claims under Tooley v. Donaldson to determine direct vs. derivative jurisdictional posture.",
            "Formulate pre-suit demand litigation strategy and assess Spiegel v. Buntrock board independence concession risks.",
            "Conduct director-by-director audit under United Food v. Zuckerberg to model demand futility exposure under Rule 23.1.",
            "Draft Special Litigation Committee (SLC) charters establishing total independence and investigative protocols under Zapata.",
            "Structure derivative settlement packages with therapeutic governance relief and calculate Sugarland fee awards."
        ]
    }
}

if __name__ == "__main__":
    total = ensure_law_day_budget(DAY_18)
    print(f"B.Com Corporate Law Day 18 Total Words: {total}")
    for i, p in enumerate(DAY_18['parts']):
        print(f"  Part {i+1} words: {count_words(p['say'])}")
