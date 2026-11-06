"""
Course 29: B.Com Corporate & Commercial Law, Contracts & Governance (bcom_law)
Day 14 Builder: Securities Litigation Defense: PSLRA Safe Harbor, Basic v. Levinson & Loss Causation
Milestone 3: Securities Regulation, Capital Markets & Public Offerings
Guarantees >= 580 words per part and >= 2,950 words total with deterministic Python simulations.
"""

from corporate_law_budget_ensurer import ensure_law_day_budget
from visual_builder import count_words

DAY_14 = {
    "coursePrefix": "bcom_law",
    "day": 14,
    "title": "Securities Litigation Defense: PSLRA Safe Harbor, Basic v. Levinson & Loss Causation",
    "goal": "Master federal securities litigation defense under Section 10(b) and SEC Rule 10b-5: navigate class action private right of action elements, analyze the Basic v. Levinson fraud-on-the-market presumption and Halliburton II price impact rebuttal, enforce PSLRA heightened scienter pleading standards under Tellabs, deploy the PSLRA safe harbor for forward-looking statements, and execute Dura Pharmaceuticals loss causation econometric defenses.",
    "minutes": 45,
    "recap": "In Day 13, we mastered S-1 registration, underwriting syndicate structures, lock-ups, comfort letters, and Regulation M stabilization. Today in Day 14, we enter the courtroom to master corporate securities defense: shielding public companies, executive officers, and directors against predatory shareholder class actions.",
    "parts": [
        {
            "title": "Section 10(b) & Rule 10b-5: The Six Elements of a Private Securities Fraud Claim",
            "say": [
                "While the Securities Act of 1933 governs the primary issuance of securities, the Securities Exchange Act of 1934 regulates secondary trading markets, ongoing disclosure, and market integrity. The preeminent weapon of federal securities litigation—and the source of billions of dollars in class action exposure—is Section 10(b) of the 1934 Act and SEC Rule 10b-5 promulgated thereunder. Rule 10b-5 makes it unlawful for any person, directly or indirectly, to employ any device, scheme, or artifice to defraud, to make any untrue statement of a material fact or omit to state a material fact necessary in order to make the statements made not misleading, or to engage in any act, practice, or course of business which operates as a fraud.",
                "Although the statutory text of Section 10(b) contains no express private right of action, federal courts—beginning with Kardon v. National Gypsum Co. (1946) and affirmed by the Supreme Court in Blue Chip Stamps v. Manor Drug Stores (1975)—have long recognized an implied private right of action for defrauded investors. To prevail in a private Section 10(b) lawsuit, a plaintiff class must establish six cumulative, non-negotiable legal elements simultaneously: (1) A material misrepresentation or omission; (2) Scienter (a wrongful state of mind); (3) A connection with the purchase or sale of a security; (4) Reliance; (5) Economic loss; and (6) Loss Causation.",
                "Under the first element, materiality is governed by the objective standard established in TSC Industries v. Northway (1976): a misstated or omitted fact is material if there is a substantial likelihood that a reasonable investor would view it as having significantly altered the 'total mix' of information made available. Vague corporate puffery—such as statements that the company is 'innovative' or 'optimistic about growth'—is immaterial as a matter of law.",
                "Under the third element, the landmark Blue Chip Stamps doctrine establishes that only actual purchasers or sellers of securities possess standing to sue under Rule 10b-5. Non-holders—shareholders who claim they decided not to buy or decided not to sell because of corporate statements—have zero standing.",
                "Because class action plaintiffs routinely file lawsuits immediately after any stock drop, the primary objective of corporate defense counsel is to dismantle the plaintiff's complaint at the Rule 12(b)(6) motion to dismiss stage. If even one of the six elements is deficiently pleaded, the entire class action must be dismissed with prejudice."
            ],
            "example": "A pharmaceutical CEO states, 'Our drug trials are progressing smoothly,' while concealing that the FDA issued a clinical trial halt order. Because the FDA halt significantly alters the total mix of information, this is a material omission. If the stock plunges 60% upon public disclosure, purchasing shareholders have standing to sue under Rule 10b-5, but frustrated investors who merely thought about buying do not.",
            "code": """# Simulation: Section 10(b) / Rule 10b-5 Six-Element Motion to Dismiss Evaluator
from typing import Dict, List

def evaluate_10b5_complaint_viability(
    case_caption: str,
    material_misstatement_or_omission_pleaded: bool,
    is_mere_corporate_puffery: bool,
    scienter_adequately_pleaded: bool,
    plaintiff_is_actual_purchaser_or_seller: bool, # Blue Chip Stamps standing
    reliance_established_or_presumed: bool,
    economic_loss_suffered: bool,
    loss_causation_adequately_pleaded: bool
) -> dict:
    elements = {
        'materiality': material_misstatement_or_omission_pleaded and not is_mere_corporate_puffery,
        'scienter': scienter_adequately_pleaded,
        'purchaser_seller_standing': plaintiff_is_actual_purchaser_or_seller,
        'reliance': reliance_established_or_presumed,
        'economic_loss': economic_loss_suffered,
        'loss_causation': loss_causation_adequately_pleaded
    }
    
    missing_elements = [name for name, satisfied in elements.items() if not satisfied]
    survives_motion_to_dismiss = len(missing_elements) == 0
    
    if survives_motion_to_dismiss:
        verdict = "MOTION_TO_DISMISS_DENIED_PROCEED_TO_DISCOVERY"
        action = "Prepare class certification defense and explore settlement mediation."
    else:
        verdict = "MOTION_TO_DISMISS_GRANTED_CASE_DISMISSED"
        action = f"Dismissed with prejudice under Rule 12(b)(6). Failed elements: {missing_elements}"
        
    return {
        'case_caption': case_caption,
        'survives_motion_to_dismiss': survives_motion_to_dismiss,
        'verdict': verdict,
        'missing_elements': missing_elements,
        'recommended_action': action
    }

# Execute deterministic validation
c1 = evaluate_10b5_complaint_viability(
    "In re Apex Tech Securities Litigation", True, False, True, True, True, True, True
)
c2 = evaluate_10b5_complaint_viability(
    "In re CloudSoft Puffery Class Action", True, True, True, True, True, True, True
)
c3 = evaluate_10b5_complaint_viability(
    "Shareholder Non-Seller Action", True, False, True, False, True, True, True
)

print(f"[{c1['case_caption']}] -> Verdict: {c1['verdict']}")
print(f"[{c2['case_caption']}] -> Verdict: {c2['verdict']} | Missing: {c2['missing_elements']}")
print(f"[{c3['case_caption']}] -> Verdict: {c3['verdict']} | Missing: {c3['missing_elements']}")
""",
            "output": """[In re Apex Tech Securities Litigation] -> Verdict: MOTION_TO_DISMISS_DENIED_PROCEED_TO_DISCOVERY
[In re CloudSoft Puffery Class Action] -> Verdict: MOTION_TO_DISMISS_GRANTED_CASE_DISMISSED | Missing: ['materiality']
[Shareholder Non-Seller Action] -> Verdict: MOTION_TO_DISMISS_GRANTED_CASE_DISMISSED | Missing: ['purchaser_seller_standing']
""",
            "codeNotes": [
                {"line": 13, "note": "Evaluates TSC Industries materiality and filters out corporate puffery"},
                {"line": 15, "note": "Enforces Blue Chip Stamps standing: requires actual purchase or sale of security"},
                {"line": 21, "note": "Requires all six cumulative elements to survive Rule 12(b)(6) motion to dismiss"}
            ],
            "tryIt": "Set is_mere_corporate_puffery to False in c2 to observe how non-puffery actionable misstatements allow a complaint to survive dismissal.",
            "check": {
                "question": "Under the Supreme Court's landmark decision in Blue Chip Stamps v. Manor Drug Stores, who has legal standing to bring a private damages lawsuit under Section 10(b) and Rule 10b-5?",
                "options": [
                    "Only actual purchasers or sellers of securities who bought or sold during the relevant class period.",
                    "Any individual who read a negative newspaper article about the corporation.",
                    "Any shareholder who thought about selling stock but decided to hold it.",
                    "Any citizen residing in the county where corporate headquarters is located."
                ],
                "answer": 0,
                "why": "Blue Chip Stamps established the strict purchaser-seller rule, holding that potential buyers who chose not to buy or holders who chose not to sell lack standing under Rule 10b-5.",
                "answerIndex": 0,
                "explanation": "Blue Chip Stamps established the strict purchaser-seller rule, holding that potential buyers who chose not to buy or holders who chose not to sell lack standing under Rule 10b-5."
            }
        },
        {
            "title": "Fraud-on-the-Market Presumption & Halliburton II Price Impact Rebuttal",
            "say": [
                "Under traditional common-law fraud, a plaintiff must prove direct reliance: demonstrating that they personally read the fraudulent document, believed its representations, and altered their financial behavior as a result. In modern anonymous electronic secondary stock markets, requiring millions of retail and institutional investors to prove individual direct reliance would make class certification under Federal Rule of Civil Procedure 23(b)(3) impossible, because individual questions of reliance would overwhelm common questions of law or fact.",
                "To overcome this barrier, the Supreme Court in Basic Inc. v. Levinson (1988) adopted the 'Fraud-on-the-Market Presumption'. Grounded in financial economics and the Semi-Strong Form of the Efficient Capital Markets Hypothesis (ECMH), the Basic doctrine presumes that in an efficient secondary market, all publicly available material information is rapidly absorbed and reflected in the market price of a stock. Therefore, when an investor buys shares at the market price, they are presumed to have relied upon the integrity of the market price itself, satisfying the Rule 10b-5 reliance element across the entire class.",
                "To invoke the Basic presumption, plaintiffs must prove four threshold predicates: (1) The alleged misrepresentation was publicly known; (2) The misrepresentation was material; (3) The company's stock traded in an efficient market; and (4) The plaintiff traded between the time the misrepresentation was made and the time the truth was revealed. Market efficiency is routinely tested using the five-factor Cammer test (including average weekly trading volume exceeding 1% of shares, analyst coverage, and market maker participation).",
                "However, the Supreme Court's watershed decision in Halliburton Co. v. Erica P. John Fund, Inc. (Halliburton II, 2014) granted corporate defense counsel a powerful procedural weapon. Halliburton II held that corporate defendants are legally entitled to rebut the fraud-on-the-market presumption at the Class Certification stage by introducing direct empirical economic evidence demonstrating that the alleged misrepresentation had 'no price impact'.",
                "Under Halliburton II, defense counsel deploys econometric Event Studies conducted by PhD financial economists. If the event study proves that the stock price did not move when the alleged misstatement was made (no price distortion), and did not drop when the corrective disclosure was released, the presumption of reliance is completely dismantled. Class certification is denied as a matter of law, destroying the multi-million-dollar class action."
            ],
            "example": "If a CEO falsely claims on May 1 that a patent was granted, and an econometric event study shows the stock didn't move at all on May 1, and didn't move when the truth came out on October 1, Halliburton II establishes zero price impact. The court denies class certification, forcing plaintiffs to proceed individually, which effectively terminates the lawsuit.",
            "code": """# Simulation: Basic v. Levinson & Halliburton II Class Certification Price Impact Engine
from typing import Dict, List

def evaluate_class_certification_price_impact(
    stock_ticker: str,
    misstatement_publicly_made: bool,
    weekly_trading_volume_pct: float, # Cammer Factor 1 (> 1.0% indicates efficiency)
    wall_street_analyst_coverage_count: int, # Cammer Factor 2 (>= 5 indicates efficiency)
    has_active_market_makers: bool, # Cammer Factor 3
    event_study_statistically_significant_price_movement: bool, # At p < 0.05
    event_study_abnormal_return_pct: float,
    confounding_market_or_industry_news_present: bool
) -> dict:
    # 1. Cammer Market Efficiency Evaluation
    is_efficient_market = (
        weekly_trading_volume_pct >= 1.0 and 
        wall_street_analyst_coverage_count >= 5 and 
        has_active_market_makers
    )
    
    if not (misstatement_publicly_made and is_efficient_market):
        return {
            'ticker': stock_ticker,
            'class_certification_granted': False,
            'status': 'BASIC_PRESUMPTION_DENIED_INEFFICIENT_MARKET',
            'rationale': 'Stock does not trade in an efficient market; individual reliance required.'
        }
        
    # 2. Halliburton II Price Impact Rebuttal (Defense Burden)
    # If price movement is not statistically significant or driven entirely by confounding news
    has_price_impact = event_study_statistically_significant_price_movement and not (
        confounding_market_or_industry_news_present and abs(event_study_abnormal_return_pct) < 2.0
    )
    
    if has_price_impact:
        return {
            'ticker': stock_ticker,
            'class_certification_granted': True,
            'status': 'CLASS_CERTIFIED_PRICE_IMPACT_ESTABLISHED',
            'rationale': f'Statistically significant abnormal return ({event_study_abnormal_return_pct:+.2f}%) establishes price distortion under Basic.'
        }
    else:
        return {
            'ticker': stock_ticker,
            'class_certification_granted': False,
            'status': 'CLASS_CERTIFICATION_DENIED_HALLIBURTON_II_REBUTTAL_SUSTAINED',
            'rationale': 'Defendants proved zero price impact via econometric event study, rebutting Basic presumption.'
        }

# Execute deterministic validation
c_cert = evaluate_class_certification_price_impact("APEX", True, 2.5, 14, True, True, -8.4, False)
c_rebut = evaluate_class_certification_price_impact("DEFENSE-CORP", True, 1.8, 8, True, False, -0.4, True)

print(f"[{c_cert['ticker']}] -> Certified: {c_cert['class_certification_granted']} | Status: {c_cert['status']}")
print(f"[{c_rebut['ticker']}] -> Certified: {c_rebut['class_certification_granted']} | Status: {c_rebut['status']}")
""",
            "output": """[APEX] -> Certified: True | Status: CLASS_CERTIFIED_PRICE_IMPACT_ESTABLISHED
[DEFENSE-CORP] -> Certified: False | Status: CLASS_CERTIFICATION_DENIED_HALLIBURTON_II_REBUTTAL_SUSTAINED
""",
            "codeNotes": [
                {"line": 14, "note": "Audits Cammer factors to determine market efficiency predicates for Basic presumption"},
                {"line": 26, "note": "Evaluates econometric event study abnormal returns at statistical significance threshold"},
                {"line": 37, "note": "Rebuts Basic presumption and defeats class certification under Halliburton II zero price impact doctrine"}
            ],
            "tryIt": "Set event_study_statistically_significant_price_movement to True and abnormal return to -6.5 in c_rebut to see how failing to disprove price impact leads to class certification.",
            "check": {
                "question": "Under the Supreme Court's ruling in Halliburton II, what direct evidentiary showing can corporate defendants make at the class certification stage to defeat the Basic fraud-on-the-market presumption?",
                "options": [
                    "Defendants can introduce econometric event studies proving that the alleged misstatement had no price impact on the company's stock price.",
                    "Defendants can argue that stock markets are inherently irrational.",
                    "Defendants can prove that the judge's pension owns company stock.",
                    "Defendants can show that the plaintiffs are not registered voters."
                ],
                "answer": 0,
                "why": "Halliburton II allows defendants to rebut the Basic presumption prior to class certification by demonstrating that the misrepresentation produced zero price impact.",
                "answerIndex": 0,
                "explanation": "Halliburton II allows defendants to rebut the Basic presumption prior to class certification by demonstrating that the misrepresentation produced zero price impact."
            }
        },
        {
            "title": "PSLRA Heightened Scienter Pleading Standards & The Tellabs Invariant",
            "say": [
                "Prior to 1995, securities class actions were plagued by widespread abuse: opportunistic plaintiffs' law firms filed massive lawsuits upon any routine 10% stock drop, weaponizing expensive discovery to coerce corporate boards into settling frivolous claims. To curb these abuses, Congress enacted the Private Securities Litigation Reform Act of 1995 (PSLRA), codified in Section 21D of the Securities Exchange Act of 1934.",
                "The PSLRA revolutionized securities litigation by imposing two insurmountable procedural hurdles upon plaintiffs: (1) An automatic stay of all discovery pending the outcome of a motion to dismiss, and (2) Heightened Pleading Standards for both material misstatements and scienter. Under Section 21D(b)(2), a plaintiff complaint cannot merely allege negligence or state broad conclusions; it must state with particularity facts giving rise to a 'Strong Inference' that the defendant acted with the required state of mind (scienter).",
                "Scienter in securities fraud is defined as an intent to deceive, manipulate, or defraud, or at minimum severe reckless disregard for the truth. In the landmark decision Tellabs, Inc. v. Makor Issues & Rights, Ltd. (2007), the Supreme Court established the definitive judicial standard for evaluating the PSLRA 'strong inference' requirement. The Court held that an inference of scienter cannot be evaluated in a vacuum; courts must engage in a comparative inquiry, weighing competing inferences.",
                "Justice Ginsburg formulated the Tellabs Rule: an inference of scienter is 'strong' under the PSLRA only if it is cogent and at least as compelling as any plausible non-fraudulent inference of innocent conduct. When a district court evaluates a motion to dismiss, the judge must compare the fraudulent explanation against plausible non-culpable explanations (e.g., unexpected supply chain delays, honest executive miscalculation, industry-wide economic downturns, or aggressive but sincere business optimism).",
                "If the plausible innocent inference is more compelling than the fraud inference, the complaint MUST be dismissed immediately. Furthermore, plaintiffs cannot manufacture scienter through 'motive and opportunity' alone (such as an executive owning stock or receiving standard stock options); they must plead specific internal documents, whistleblower communications, or suspicious, abnormal insider trading under SEC Rule 10b5-1 to survive Tellabs scrutiny."
            ],
            "example": "In Tellabs, the CEO stated demand for a flagship telecommunications product was strong, while customer orders were actually slowing down. The Supreme Court remanded for the lower court to determine whether the CEO's statements reflected reckless deception or merely honest executive optimism during an unpredictable macroeconomic downturn.",
            "code": """# Simulation: PSLRA Section 21D(b)(2) & Tellabs Comparative Scienter Evaluator
from typing import Dict, List

def evaluate_tellabs_scienter_pleading(
    complaint_id: str,
    defendants: List[str],
    pleaded_confidential_witness_statements: bool,
    pleaded_internal_memo_showing_actual_knowledge: bool,
    pleaded_suspicious_unusual_insider_stock_sales: bool,
    insider_trades_executed_under_pre_existing_10b5_1_plan: bool,
    plausible_non_culpable_explanations: List[str] # e.g. ['MACROECONOMIC_DOWNTURN', 'UNFORESEEN_SUPPLY_CHAIN_BOTTLENECK']
) -> dict:
    # 1. Score Fraud Inference Weight (0 to 100)
    fraud_weight = 0
    if pleaded_internal_memo_showing_actual_knowledge:
        fraud_weight += 50
    if pleaded_confidential_witness_statements:
        fraud_weight += 25
    if pleaded_suspicious_unusual_insider_stock_sales and not insider_trades_executed_under_pre_existing_10b5_1_plan:
        fraud_weight += 25
        
    # 2. Score Competing Non-Culpable / Innocent Inference Weight (0 to 100)
    innocent_weight = 30 # Baseline presumption of corporate good faith
    if insider_trades_executed_under_pre_existing_10b5_1_plan:
        innocent_weight += 25 # Negates suspicious trading inference
    innocent_weight += len(plausible_non_culpable_explanations) * 20
    innocent_weight = min(100, innocent_weight)
    
    # 3. Tellabs Comparative Test: Fraud inference must be at least as compelling as innocent inference
    is_strong_inference = fraud_weight >= innocent_weight and fraud_weight >= 50
    
    if is_strong_inference:
        status = "PSLRA_SCIENTER_SUSTAINED_STRONG_INFERENCE_ESTABLISHED"
        dismissal_granted = False
        rationale = f"Fraud inference ({fraud_weight}/100) is at least as compelling as innocent inference ({innocent_weight}/100)."
    else:
        status = "MOTION_TO_DISMISS_GRANTED_INSUFFICIENT_SCIENTER"
        dismissal_granted = True
        rationale = f"Innocent inference ({innocent_weight}/100) is more compelling than fraud inference ({fraud_weight}/100)."
        
    return {
        'complaint_id': complaint_id,
        'fraud_inference_weight': fraud_weight,
        'innocent_inference_weight': innocent_weight,
        'is_strong_inference': is_strong_inference,
        'dismissal_granted': dismissal_granted,
        'status': status,
        'rationale': rationale
    }

# Execute deterministic validation
t_strong = evaluate_tellabs_scienter_pleading(
    "SEC-CASE-STRONG", ["CEO", "CFO"], True, True, True, False, ["SUPPLY_CHAIN"]
)
t_weak = evaluate_tellabs_scienter_pleading(
    "SEC-CASE-WEAK", ["CEO"], False, False, True, True, ["MACROECONOMIC_DOWNTURN", "GLOBAL_SEMICONDUCTOR_SHORTAGE"]
)

print(f"[{t_strong['complaint_id']}] -> Dismissed: {t_strong['dismissal_granted']} | Status: {t_strong['status']}")
print(f"[{t_weak['complaint_id']}] -> Dismissed: {t_weak['dismissal_granted']} | Rationale: {t_weak['rationale']}")
""",
            "output": """[SEC-CASE-STRONG] -> Dismissed: False | Status: PSLRA_SCIENTER_SUSTAINED_STRONG_INFERENCE_ESTABLISHED
[SEC-CASE-WEAK] -> Dismissed: True | Rationale: Innocent inference (95/100) is more compelling than fraud inference (0/100).
""",
            "codeNotes": [
                {"line": 15, "note": "Implements comparative inference scoring between fraudulent intent and innocent explanation"},
                {"line": 23, "note": "Validates that Rule 10b5-1 pre-existing trading plans negate suspicious insider trading inferences"},
                {"line": 29, "note": "Enforces Tellabs requirement: fraud inference must be at least as compelling as non-culpable inference"}
            ],
            "tryIt": "Set insider_trades_executed_under_pre_existing_10b5_1_plan to False in t_weak to observe how unshielded insider trading increases fraud inference points.",
            "check": {
                "question": "Under the Supreme Court's decision in Tellabs v. Makor Issues & Rights, what standard must a federal judge apply when determining whether a complaint pleads a 'strong inference' of scienter under the PSLRA?",
                "options": [
                    "The judge must engage in a comparative analysis, and the inference of fraudulent scienter must be cogent and at least as compelling as any plausible non-fraudulent inference of innocent conduct.",
                    "The judge must automatically assume that corporate executives are guilty of fraud.",
                    "The judge must toss a coin in the courtroom.",
                    "The judge must wait until after a jury trial before evaluating the complaint."
                ],
                "answer": 0,
                "why": "Tellabs mandates comparative weighing of competing inferences, requiring the fraud inference to be at least as compelling as plausible non-culpable explanations to survive dismissal.",
                "answerIndex": 0,
                "explanation": "Tellabs mandates comparative weighing of competing inferences, requiring the fraud inference to be at least as compelling as plausible non-culpable explanations to survive dismissal."
            }
        },
        {
            "title": "Forward-Looking Statements & The PSLRA Statutory Safe Harbor",
            "say": [
                "Corporate executives must frequently provide earnings guidance, market projections, and strategic forecasts to financial analysts and the investing public. However, business forecasts are inherently uncertain; if every missed quarterly earnings forecast triggered a securities fraud lawsuit, public corporations would completely cease communicating with capital markets. To encourage open market disclosure, Congress established the PSLRA Statutory Safe Harbor for Forward-Looking Statements in Section 27A of the 1933 Act and Section 21E of the 1934 Act.",
                "The PSLRA Safe Harbor provides an absolute statutory shield for 'forward-looking statements'—defined as statements containing projections of revenues, income, earnings per share, capital expenditures, dividends, future economic performance, or plans and objectives for future operations. Under the two-pronged structure of Section 21E(c), an issuer or executive is protected from civil liability under either of two independent disjunctive prongs:",
                "Prong One: Meaningful Cautionary Language. A forward-looking statement is protected if it is identified as a forward-looking statement and is accompanied by 'meaningful cautionary statements identifying important factors that could cause actual results to differ materially from those in the forward-looking statement'. The cautionary language cannot be boilerplate or generic ('investing involves risk'); it must convey substantive, company-specific risks that match the actual hazards that ultimately materialized.",
                "Prong Two: Actual Knowledge of Falsity. Even if the statement completely lacked cautionary language, the plaintiff cannot prevail unless they prove that the forward-looking statement was made with 'actual knowledge' by that executive that the statement was false or misleading when made. Unlike historical statements (where severe recklessness suffices for scienter), forward-looking statements demand actual knowledge. Mere recklessness or negligence is legally insufficient.",
                "Furthermore, the safe harbor applies to both written statements (press releases, Form 10-Q) and oral statements made during earnings conference calls, provided the oral speaker: (a) identifies the statement as forward-looking, (b) cautions that actual results may differ materially, and (c) explicitly directs listeners to a readily available written document (such as the recent Form 10-K) containing detailed cautionary risk factors."
            ],
            "example": "On an earnings call, a CFO says, 'We expect full-year revenue of $500M, but as detailed in our 10-K, supply chain delays in our Taiwan fab could impact delivery.' Even if revenue falls to $300M due to fab shutdowns, the CFO is protected under Prong One because specific meaningful cautionary language accompanied the forecast.",
            "code": """# Simulation: PSLRA Section 21E Statutory Safe Harbor & Cautionary Language Validator
from typing import Dict, List

def evaluate_pslra_safe_harbor(
    statement_id: str,
    is_forward_looking_statement: bool,
    statement_type: str, # 'WRITTEN_PRESS_RELEASE', 'ORAL_EARNINGS_CALL'
    specifically_identified_as_forward_looking: bool,
    accompanied_by_meaningful_cautionary_statements: bool,
    cautionary_language_is_mere_boilerplate: bool,
    cautionary_statements_substantively_match_realized_risk: bool,
    directed_listeners_to_10k_risk_factors: bool, # For oral statements
    plaintiff_proved_executive_had_actual_knowledge_of_falsity: bool
) -> dict:
    if not is_forward_looking_statement:
        return {
            'statement_id': statement_id,
            'is_protected_by_safe_harbor': False,
            'status': 'UNPROTECTED_HISTORICAL_FACT_STATEMENT',
            'rationale': 'Statement concerns historical/present facts; PSLRA safe harbor unavailable.'
        }
        
    # Prong 1 Evaluation: Meaningful Cautionary Language
    prong1_cautionary_valid = (
        specifically_identified_as_forward_looking and 
        accompanied_by_meaningful_cautionary_statements and 
        not cautionary_language_is_mere_boilerplate and 
        cautionary_statements_substantively_match_realized_risk
    )
    if statement_type == 'ORAL_EARNINGS_CALL' and not directed_listeners_to_10k_risk_factors:
        prong1_cautionary_valid = False
        
    # Prong 2 Evaluation: Actual Knowledge of Falsity (Plaintiff's failure to prove actual knowledge)
    prong2_lacks_actual_knowledge = not plaintiff_proved_executive_had_actual_knowledge_of_falsity
    
    is_protected = prong1_cautionary_valid or prong2_lacks_actual_knowledge
    
    if is_protected:
        if prong1_cautionary_valid:
            governing_prong = "PRONG_1_MEANINGFUL_CAUTIONARY_LANGUAGE_SUSTAINED"
        else:
            governing_prong = "PRONG_2_NO_ACTUAL_KNOWLEDGE_PROVEN"
        status = "ABSOLUTE_PSLRA_SAFE_HARBOR_IMMUNITY_GRANTED"
    else:
        governing_prong = "NONE_SAFE_HARBOR_FORFEITED"
        status = "SAFE_HARBOR_DENIED_ACTUAL_KNOWLEDGE_ESTABLISHED_WITHOUT_CAUTION"
        
    return {
        'statement_id': statement_id,
        'is_protected_by_safe_harbor': is_protected,
        'status': status,
        'governing_prong': governing_prong,
        'prong1_valid': prong1_cautionary_valid,
        'prong2_valid': prong2_lacks_actual_knowledge
    }

# Execute deterministic validation
s1 = evaluate_pslra_safe_harbor(
    "EARNINGS-GUIDANCE-01", True, "ORAL_EARNINGS_CALL", True, True, False, True, True, False
)
s2 = evaluate_pslra_safe_harbor(
    "BOILERPLATE-RELEASE", True, "WRITTEN_PRESS_RELEASE", True, True, True, False, False, False
)
s3 = evaluate_pslra_safe_harbor(
    "INTENTIONAL_LIE", True, "WRITTEN_PRESS_RELEASE", False, False, False, False, False, True
)

print(f"[{s1['statement_id']}] -> Protected: {s1['is_protected_by_safe_harbor']} via {s1['governing_prong']}")
print(f"[{s2['statement_id']}] -> Protected: {s2['is_protected_by_safe_harbor']} via {s2['governing_prong']}")
print(f"[{s3['statement_id']}] -> Protected: {s3['is_protected_by_safe_harbor']} | Status: {s3['status']}")
""",
            "output": """[EARNINGS-GUIDANCE-01] -> Protected: True via PRONG_1_MEANINGFUL_CAUTIONARY_LANGUAGE_SUSTAINED
[BOILERPLATE-RELEASE] -> Protected: True via PRONG_2_NO_ACTUAL_KNOWLEDGE_PROVEN
[INTENTIONAL_LIE] -> Protected: False | Status: SAFE_HARBOR_DENIED_ACTUAL_KNOWLEDGE_ESTABLISHED_WITHOUT_CAUTION
""",
            "codeNotes": [
                {"line": 15, "note": "Validates Prong 1 meaningful cautionary language matching realized commercial risks"},
                {"line": 25, "note": "Enforces oral statement safe harbor requirements: cross-referencing Form 10-K risk factors"},
                {"line": 28, "note": "Validates Prong 2: requiring plaintiff to prove actual knowledge of falsity"}
            ],
            "tryIt": "Set cautionary_language_is_mere_boilerplate to False and cautionary_statements_substantively_match_realized_risk to True in s2 to activate Prong 1 protection.",
            "check": {
                "question": "Under the PSLRA Safe Harbor for Forward-Looking Statements (Section 21E), what is the legal effect of accompanying an executive forecast with 'meaningful cautionary statements'?",
                "options": [
                    "The forward-looking statement receives absolute statutory immunity from securities fraud liability, even if the forecast turns out to be completely inaccurate.",
                    "The company must immediately refund all shareholder capital.",
                    "The statement is automatically converted into a criminal confession.",
                    "The SEC requires the CEO to forfeit their salary for that quarter."
                ],
                "answer": 0,
                "why": "Under Prong 1 of the PSLRA Safe Harbor, statements accompanied by meaningful cautionary language identifying important factors that could cause actual results to differ are completely protected from liability.",
                "answerIndex": 0,
                "explanation": "Under Prong 1 of the PSLRA Safe Harbor, statements accompanied by meaningful cautionary language identifying important factors that could cause actual results to differ are completely protected from liability."
            }
        },
        {
            "title": "Loss Causation & The Dura Pharmaceuticals Econometric Defense",
            "say": [
                "Even if a shareholder class successfully pleads a material misrepresentation, scienter, and reliance, their lawsuit faces an impenetrable economic barrier: Loss Causation. Codified in Section 21D(b)(4) of the 1934 Act, loss causation requires the plaintiff to prove that the defendant's misstatement or omission actually caused the economic loss suffered by the investor.",
                "In the landmark decision Dura Pharmaceuticals, Inc. v. Broudo (2005), the Supreme Court fundamentally altered securities litigation. Dura manufactured an asthma medical device; plaintiffs alleged that Dura made false statements regarding FDA approval, and that they suffered damages because they purchased shares at an artificially inflated price. The Ninth Circuit had ruled that purchasing stock at an inflated price was sufficient to establish loss causation.",
                "The Supreme Court unanimously reversed, holding that an inflated purchase price does NOT constitute or cause economic loss! Justice Breyer explained that when an investor buys inflated stock, they suffer zero loss at that instant, because they possess a liquid asset whose market value equals the price paid. Economic loss occurs only if the stock price drops subsequently.",
                "Crucially, the Court held that the subsequent drop must be caused by the revelation of the truth (the 'Corrective Disclosure'), rather than other macroeconomic or market factors. Lower stock prices may reflect changed economic circumstances, industry downturns, interest rate hikes, or management shifts unrelated to the fraud. Plaintiffs must plead and prove a direct causal nexus between the corrective disclosure and the price drop.",
                "In high-stakes securities litigation, corporate defense teams execute sophisticated econometric Event Studies. By running multiple regression models against market indices and industry peers, defense economists isolate 'abnormal returns'. If the event study demonstrates that the price drop coincided with a broader market sell-off, or occurred prior to the corrective disclosure, loss causation fails as a matter of law. Under Dura, this eliminates class damages and forces complete dismissal."
            ],
            "example": "A company falsely overstates sales by 10%. On November 1, the Federal Reserve hikes interest rates by 100 bps, causing all tech stocks to drop 15%. On November 5, the company corrects its sales numbers, but the stock stays completely flat. Under Dura, plaintiffs have zero loss causation because the rate hike—not the accounting correction—caused the drop.",
            "code": """# Simulation: Dura Pharmaceuticals Loss Causation & Econometric Event Study Defense
from typing import Dict, List

def evaluate_loss_causation_econometrics(
    ticker: str,
    stock_price_at_purchase: float,
    stock_price_post_corrective_disclosure: float,
    gross_price_drop_pct: float,
    market_index_drop_pct_same_day: float,
    industry_peer_basket_drop_pct_same_day: float,
    market_beta: float,
    corrective_disclosure_revealed_fraud: bool,
    prior_leak_occurred: bool
) -> dict:
    # 1. Dura Invariant Check: Mere inflated purchase price is insufficient
    if not corrective_disclosure_revealed_fraud:
        return {
            'ticker': ticker,
            'loss_causation_established': False,
            'status': 'DISMISSED_UNDER_DURA_NO_CORRECTIVE_DISCLOSURE',
            'rationale': 'No corrective disclosure revealed the alleged fraud to the market.'
        }
        
    # 2. Econometric Capital Asset Pricing Model (CAPM) Abnormal Return Regression
    # Expected market-driven return = beta * market_drop
    expected_market_return = market_beta * market_index_drop_pct_same_day
    
    # Abnormal Return (alpha) = Actual stock drop minus market/industry component
    abnormal_return_pct = gross_price_drop_pct - expected_market_return
    
    # Statistical significance threshold (t-stat > 1.96, roughly > 3.0% unexplained abnormal drop)
    is_statistically_significant = abnormal_return_pct <= -3.0
    
    if is_statistically_significant:
        loss_causation_established = True
        status = "LOSS_CAUSATION_ESTABLISHED_PLAINTIFF_DAMAGE_CONFIRMED"
        damages_per_share = abs(abnormal_return_pct / 100.0) * stock_price_at_purchase
        rationale = f"Stock dropped {abnormal_return_pct:.2f}% beyond market and industry factors upon corrective disclosure."
    else:
        loss_causation_established = False
        status = "LOSS_CAUSATION_DISPROVED_MARKET_FACTORS_EXPLAIN_DROP"
        damages_per_share = 0.0
        rationale = f"Price decline ({gross_price_drop_pct:.2f}%) explained by general market movement ({expected_market_return:.2f}%); zero firm-specific fraud loss."
        
    return {
        'ticker': ticker,
        'gross_drop_pct': gross_price_drop_pct,
        'abnormal_return_pct': abnormal_return_pct,
        'loss_causation_established': loss_causation_established,
        'damages_per_share': damages_per_share,
        'status': status,
        'rationale': rationale
    }

# Execute deterministic validation
e_valid = evaluate_loss_causation_econometrics("APEX-FRAUD", 100.0, 75.0, -25.0, -2.0, -1.5, 1.2, True, False)
e_market = evaluate_loss_causation_econometrics("DEFENSE-CORP", 100.0, 85.0, -15.0, -12.0, -14.0, 1.2, True, False)

print(f"[{e_valid['ticker']}] -> Loss Causation: {e_valid['loss_causation_established']} | Abnormal Drop: {e_valid['abnormal_return_pct']:.2f}% | Damages/sh: ${e_valid['damages_per_share']:.2f}")
print(f"[{e_market['ticker']}] -> Loss Causation: {e_market['loss_causation_established']} | Status: {e_market['status']}")
""",
            "output": """[APEX-FRAUD] -> Loss Causation: True | Abnormal Drop: -22.60% | Damages/sh: $22.60
[DEFENSE-CORP] -> Loss Causation: False | Status: LOSS_CAUSATION_DISPROVED_MARKET_FACTORS_EXPLAIN_DROP
""",
            "codeNotes": [
                {"line": 13, "note": "Enforces Dura rule: mere price inflation at purchase is statutorily insufficient"},
                {"line": 21, "note": "Runs econometric regression isolating abnormal returns from broader market movements"},
                {"line": 28, "note": "Disproves loss causation if market/macro factors account for the observed stock decline"}
            ],
            "tryIt": "Increase gross_price_drop_pct to -35.0% in e_market to observe how a massive company-specific plunge overcomes the macroeconomic market decline.",
            "check": {
                "question": "Under the Supreme Court's landmark decision in Dura Pharmaceuticals, Inc. v. Broudo, what must a securities fraud plaintiff prove to satisfy the loss causation requirement?",
                "options": [
                    "The plaintiff must prove that the revelation of the alleged misrepresentation or corrective disclosure was the proximate cause of their economic loss, and that the price drop was not caused by general market or macroeconomic factors.",
                    "The plaintiff only needs to prove that they purchased stock at an artificially inflated price.",
                    "The plaintiff must show that the corporation filed for bankruptcy within 24 hours.",
                    "The plaintiff must prove that they never sold any shares."
                ],
                "answer": 0,
                "why": "Dura held that paying an inflated purchase price does not constitute economic loss; plaintiffs must prove that the truth leaked to the market and caused the subsequent decline.",
                "answerIndex": 0,
                "explanation": "Dura held that paying an inflated purchase price does not constitute economic loss; plaintiffs must prove that the truth leaked to the market and caused the subsequent decline."
            }
        }
    ],
    "summary": [
        "Rule 10b-5 Six Cumulative Elements: A private action demands material misrepresentation, scienter, purchase/sale connection under Blue Chip Stamps, reliance, economic loss, and loss causation.",
        "Basic & Halliburton II Price Impact: Basic presumes market-wide reliance under the fraud-on-the-market theory, but Halliburton II authorizes defendants to defeat class certification by proving zero price impact via event studies.",
        "Tellabs Comparative Scienter Standard: The PSLRA requires a strong inference of scienter that is at least as compelling as any plausible non-fraudulent inference of innocent conduct.",
        "PSLRA Safe Harbor Shield: Forward-looking forecasts are absolutely immune under Section 21E if accompanied by meaningful cautionary language or if plaintiffs fail to prove actual knowledge of falsity.",
        "Dura Loss Causation Econometrics: Paying an inflated purchase price is not economic loss; defense teams deploy econometric regressions to prove general market downturns caused the drop, eliminating liability."
    ],
    "projectStep": {
        "title": "Corporate Law Milestone 3 Step 4: Securities Class Action Defense & Econometric Loss Causation Architecture",
        "steps": [
            "Conduct a Rule 12(b)(6) motion to dismiss audit analyzing the six cumulative Rule 10b-5 elements and Blue Chip Stamps standing.",
            "Formulate a Halliburton II class certification defense utilizing econometric event studies to disprove price impact.",
            "Structure executive public forecasts under the PSLRA Section 21E Safe Harbor with tailored, meaningful cautionary risk factors.",
            "Execute Dura Pharmaceuticals loss causation regression modeling to isolate company-specific declines from macroeconomic market downturns."
        ]
    }
}

if __name__ == "__main__":
    total = ensure_law_day_budget(DAY_14)
    print(f"B.Com Corporate Law Day 14 Total Words: {total}")
    for i, p in enumerate(DAY_14['parts']):
        print(f"  Part {i+1} words: {count_words(p['say'])}")
