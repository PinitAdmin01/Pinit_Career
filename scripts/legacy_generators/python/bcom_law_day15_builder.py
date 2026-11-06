"""
Course 29: B.Com Corporate & Commercial Law, Contracts & Governance (bcom_law)
Day 15 Builder: Milestone 3 Capstone: Capital Markets Syndicate & Securities Enforcement Control Tower
Milestone 3 Grand Finale: Securities Regulation, Capital Markets & Public Offerings
Guarantees >= 580 words per part and >= 2,950 words total with deterministic Python simulations.
"""

from corporate_law_budget_ensurer import ensure_law_day_budget
from visual_builder import count_words

DAY_15 = {
    "coursePrefix": "bcom_law",
    "day": 15,
    "title": "Milestone 3 Capstone: Capital Markets Syndicate & Securities Enforcement Control Tower",
    "goal": "Orchestrate an end-to-end sovereign capital markets transaction and securities defense framework: execute a multi-tier audit across Howey digital asset offerings, Regulation D private placements, Form S-1 underwriting syndicates, Regulation M Green Shoe stabilization, Escott v. BarChris due diligence defenses, and PSLRA class action econometric litigation defense, culminating in certified Milestone 3 Boardroom General Counsel Accreditation.",
    "minutes": 45,
    "recap": "In Days 11–14, we mastered the 1933 Act registration regime, gun-jumping rules, private placements under Regulation D/S, IPO underwriting syndicates, and securities class action litigation defense under the PSLRA. Today in Day 15, we integrate these doctrines into an executive Capital Markets Syndicate & Securities Enforcement Control Tower.",
    "parts": [
        {
            "title": "Tier 1 Command: Capital Formation Architecture & Howey / Regulation D Audit",
            "say": [
                "Welcome to the Milestone 3 Capstone of Corporate & Commercial Law: The Capital Markets Syndicate & Securities Enforcement Control Tower. In enterprise governance, the ability to architect institutional capital formation while insulating the corporation from existential regulatory enforcement and class action exposure represents the pinnacle of executive legal stewardship. In this capstone, you assume the role of Chief Legal Officer & Capital Markets General Counsel for an enterprise executing an $800 million global capital reorganization.",
                "Tier 1 of our Control Tower establishes the foundational Capital Formation Architecture. The modern corporate enterprise raises capital across multiple concurrent channels—ranging from private venture capital rounds and tokenized commercial instruments to international debt facilities. However, every capital instrument must be screened against the jurisdictional threshold of federal securities law. Under the landmark four-prong doctrine of SEC v. W.J. Howey Co. (1946), any arrangement involving an investment of tangible value in a common enterprise with an expectation of profits derived predominantly from the managerial efforts of others is an investment contract security.",
                "If an instrument constitutes a statutory security, Tier 1 enforces immediate classification under Section 5 of the Securities Act of 1933. Unless the offering is formally registered, the enterprise must establish a bulletproof statutory or regulatory exemption. For domestic private capital raises, the Control Tower evaluates Regulation D safe harbors under Section 4(a)(2). If the company chooses Rule 506(b), it enforces an absolute ban on general advertising (Rule 502(c)), restricting participation to accredited investors and up to 35 sophisticated non-accredited purchasers.",
                "Conversely, if the company leverages Title II of the JOBS Act under Rule 506(c) to market the offering through public media, Tier 1 mandates rigorous, objective accredited investor verification under Rule 501(a). The compliance engine verifies that every individual natural person satisfies either the $200,000 individual / $300,000 joint annual income threshold over the past two years, or the $1,000,000 net worth test strictly excluding primary residence equity under Dodd-Frank.",
                "Simultaneously, Tier 1 automates the preparation of SEC Form D filings within 15 calendar days of first sale, audits state blue sky preemption under Section 18 of the 1933 Act, and implements Rule 144 restrictive legend tracking to ensure that secondary market resales do not collapse into illegal statutory underwriter distributions."
            ],
            "example": "A corporation raises $150 million through a Series C preferred stock offering marketed via private institutional portals under Rule 506(b), and issues $50 million in tokenized revenue-participation notes. Tier 1 audits Howey commonality, verifies 100% accredited status, confirms absence of general solicitation, and files Form D on EDGAR within 15 days.",
            "code": """# Simulation: Tier 1 Capital Formation & Howey / Reg D Compliance Engine
from typing import Dict, List

def audit_tier1_capital_formation(
    instruments: List[dict] # Each dict: name, is_howey_security, target_exemption, general_solicitation_used, accredited_pct, form_d_filed
) -> dict:
    audit_results = []
    all_compliant = True
    
    for inst in instruments:
        errors = []
        if inst['is_howey_security']:
            if inst['target_exemption'] == 'RULE_506_B':
                if inst['general_solicitation_used']:
                    errors.append("Rule 506(b) violated by general solicitation.")
                if not inst['form_d_filed']:
                    errors.append("Form D not filed within 15 days.")
            elif inst['target_exemption'] == 'RULE_506_C':
                if inst['accredited_pct'] < 100.0:
                    errors.append("Rule 506(c) requires 100% verified accredited investors.")
                if not inst['form_d_filed']:
                    errors.append("Form D not filed within 15 days.")
            elif inst['target_exemption'] == 'NONE_UNREGISTERED':
                errors.append("Section 5 violation: Unregistered public offering without exemption.")
        
        is_inst_compliant = len(errors) == 0
        if not is_inst_compliant:
            all_compliant = False
            
        audit_results.append({
            'instrument': inst['name'],
            'compliant': is_inst_compliant,
            'errors': errors
        })
        
    return {
        'tier1_passed': all_compliant,
        'status': 'TIER_1_CAPITAL_FORMATION_CLEARED' if all_compliant else 'TIER_1_REGISTRATION_VIOLATIONS_DETECTED',
        'audited_instruments': audit_results
    }

# Execute deterministic validation
test_instruments = [
    {'name': 'Series C Preferred Shares', 'is_howey_security': True, 'target_exemption': 'RULE_506_B', 'general_solicitation_used': False, 'accredited_pct': 100.0, 'form_d_filed': True},
    {'name': 'Tokenized Revenue Notes', 'is_howey_security': True, 'target_exemption': 'RULE_506_C', 'general_solicitation_used': True, 'accredited_pct': 100.0, 'form_d_filed': True}
]

tier1 = audit_tier1_capital_formation(test_instruments)
print(f"Tier 1 Status: {tier1['status']} (Passed: {tier1['tier1_passed']})")
for res in tier1['audited_instruments']:
    print(f"  [{res['instrument']}] Compliant: {res['compliant']} | Errors: {res['errors']}")
""",
            "output": """Tier 1 Status: TIER_1_CAPITAL_FORMATION_CLEARED (Passed: True)
  [Series C Preferred Shares] Compliant: True | Errors: []
  [Tokenized Revenue Notes] Compliant: True | Errors: []
""",
            "codeNotes": [
                {"line": 12, "note": "Audits Howey securities across Rule 506(b) and Rule 506(c) safe harbor conditions"},
                {"line": 16, "note": "Enforces 100% accredited investor requirement and mandatory Form D filing"},
                {"line": 26, "note": "Validates enterprise private capital formation architecture prior to public offering"}
            ],
            "tryIt": "Set general_solicitation_used to True in Series C Preferred Shares to observe how Tier 1 detects Section 5 gun-jumping breaches.",
            "check": {
                "question": "In the Tier 1 Capital Formation Control Tower, what is the mandatory compliance requirement when utilizing Rule 506(c) for an institutional capital raise?",
                "options": [
                    "100% of all purchasers must be verified as accredited investors using objective reasonable verification methods, and Form D must be filed within 15 days.",
                    "The offering must be reviewed and approved by the International Monetary Fund.",
                    "The company must convert into a general partnership.",
                    "All investor funds must be converted into physical silver coins."
                ],
                "answer": 0,
                "why": "Rule 506(c) permits public advertising only if all purchasers are verified accredited investors and Form D is timely submitted.",
                "answerIndex": 0,
                "explanation": "Rule 506(c) permits public advertising only if all purchasers are verified accredited investors and Form D is timely submitted."
            }
        },
        {
            "title": "Tier 2 Command: S-1 Prospectus, Underwriting Syndicate & Regulation M Engine",
            "say": [
                "Tier 2 of our Control Tower directs the execution of a public registered Initial Public Offering (IPO) on Form S-1 under the Securities Act of 1933. Moving an enterprise from private ownership to a publicly listed corporation requires coordinating the S-1 disclosure drafting, underwriting syndicate allocation, and post-pricing market stabilization.",
                "The Tier 2 engine audits Form S-1 disclosures against SEC Regulations S-K and S-X. It ensures that Part I contains entity-specific, non-generic risk factors under Item 105, provides three full years of audited GAAP financial statements, reconciles any non-GAAP financial measures to primary GAAP metrics under Regulation G, and attaches all material commercial contracts under Item 601 with verified confidential treatment substantiation. Furthermore, it manages the SEC Comment Letter response cycle, generating amended S-1/A filings until Section 8(a) effectiveness is granted.",
                "Simultaneously, Tier 2 structures the Underwriting Syndicate. In a Firm Commitment agreement, the lead left bookrunner and syndicate members contractually agree to buy the entire offering from the issuer at the public offering price less the 7.0% gross spread. The underwriting agreement incorporates mandatory closing conditions: (1) 180-day lock-up agreements signed by 100% of executive officers, directors, and major pre-IPO shareholders; (2) Market Out / MAC clauses protecting underwriters against systemic exchange halts or material adverse operational changes; and (3) Delivery of independent auditor comfort letters at pricing and closing under PCAOB AS 6101.",
                "To manage post-debut trading volatility, Tier 2 executes the Green Shoe (Over-Allotment) Option under SEC Regulation M. Underwriters oversell the offering by 15%, establishing a syndicate short position. If the stock trades at a premium, underwriters exercise the Green Shoe with the issuer, providing the company with 15% in additional equity proceeds. If the stock drops below the IPO price, underwriters refrain from exercising the option, instead deploying open-market stabilizing purchases under Rule 104 of Regulation M.",
                "Under Rule 104, stabilizing bids cannot exceed the public offering price, must be pre-disclosed in the prospectus, and provide an artificial price floor that arrests downward volatility while generating syndicate trading profits."
            ],
            "example": "In an IPO of 20,000,000 shares at $25.00/share, the underwriting syndicate oversells by 3,000,000 shares (15% Green Shoe). When the stock opens at $21.50 under market pressure, Tier 2 activates Rule 104 stabilizing bids at $21.50, buying 3,000,000 shares to cover the short, halting the price slide and generating a $10.5M syndicate trading profit.",
            "code": """# Simulation: Tier 2 S-1 Prospectus & Regulation M Green Shoe Syndicate Engine
from typing import Dict, List

def execute_tier2_ipo_syndicate_command(
    base_shares: int,
    ipo_price: float,
    gross_spread_pct: float,
    current_market_price: float,
    all_lockups_executed: bool,
    comfort_letters_delivered: bool,
    disclosed_stabilization_in_prospectus: bool
) -> dict:
    # 1. Closing Condition Audit
    can_close = all_lockups_executed and comfort_letters_delivered
    if not can_close:
        return {
            'tier2_passed': False,
            'status': 'OFFERING_CLOSING_BLOCKED_UNSATISFIED_CONDITIONS',
            'capital_raised': 0.0
        }
        
    # 2. Base Proceeds Calculation
    spread_amount = ipo_price * (gross_spread_pct / 100.0)
    net_price_per_share = ipo_price - spread_amount
    base_net_capital = base_shares * net_price_per_share
    
    # 3. Green Shoe (15% Over-Allotment) & Regulation M Execution
    green_shoe_shares = int(base_shares * 0.15)
    
    if current_market_price >= ipo_price:
        # Hot IPO -> Exercise Green Shoe with Issuer
        strategy = "EXERCISE_GREEN_SHOE_EXPAND_OFFERING"
        extra_capital = green_shoe_shares * net_price_per_share
        total_net_capital = base_net_capital + extra_capital
        stabilization_purchases = 0
        syndicate_profit = 0.0
    else:
        # Broken IPO -> Open-market buyback under Reg M Rule 104
        strategy = "DEPLOY_REG_M_RULE_104_OPEN_MARKET_STABILIZATION"
        extra_capital = 0.0
        total_net_capital = base_net_capital
        stabilization_purchases = green_shoe_shares
        # Syndicate short profit = sold at IPO price, bought back at market price
        syndicate_profit = green_shoe_shares * (ipo_price - current_market_price)
        
    return {
        'tier2_passed': True,
        'status': 'TIER_2_IPO_SYNDICATE_SUCCESSFULLY_CLOSED',
        'strategy': strategy,
        'base_net_capital': base_net_capital,
        'extra_green_shoe_capital': extra_capital,
        'total_capital_raised': total_net_capital,
        'open_market_stabilization_shares': stabilization_purchases,
        'syndicate_profit': syndicate_profit,
        'syndicate_trading_profit': syndicate_profit
    }

# Execute deterministic validation
ipo_broken = execute_tier2_ipo_syndicate_command(20_000_000, 25.0, 7.0, 21.50, True, True, True)
print(f"Tier 2 Broken IPO Status: {ipo_broken['status']}")
print(f"  Strategy: {ipo_broken['strategy']}")
print(f"  Total Capital to Issuer: ${ipo_broken['total_capital_raised']/1e6:.1f}M")
print(f"  Stabilization Shares Bought: {ipo_broken['open_market_stabilization_shares']:,} (Syndicate Profit: ${ipo_broken['syndicate_profit']/1e6:.2f}M)")
""",
            "output": """Tier 2 Broken IPO Status: TIER_2_IPO_SYNDICATE_SUCCESSFULLY_CLOSED
  Strategy: DEPLOY_REG_M_RULE_104_OPEN_MARKET_STABILIZATION
  Total Capital to Issuer: $465.0M
  Stabilization Shares Bought: 3,000,000 (Syndicate Profit: $10.50M)
""",
            "codeNotes": [
                {"line": 15, "note": "Audits closing conditions: 100% insider lock-ups and auditor comfort letters"},
                {"line": 31, "note": "Calculates 15% Green Shoe exercise for hot IPOs raising additional issuer capital"},
                {"line": 39, "note": "Executes Regulation M Rule 104 open market buybacks to stabilize broken offerings"}
            ],
            "tryIt": "Set current_market_price to 32.0 in ipo_broken to simulate a hot IPO where the Green Shoe is exercised directly with the company.",
            "check": {
                "question": "In the Tier 2 IPO Syndicate Control Tower, what happens when the newly listed stock trades below the public offering price post-pricing?",
                "options": [
                    "The syndicate does not exercise the Green Shoe with the issuer; instead, it executes open-market stabilizing purchases under Rule 104 of Regulation M, buying shares at market price to cover its short position and establish a price floor.",
                    "The underwriter files an immediate Chapter 11 bankruptcy petition.",
                    "The issuer is forced to return all IPO proceeds to the Federal Reserve.",
                    "The stock exchange automatically doubles the stock price."
                ],
                "answer": 0,
                "why": "When stock trades at a discount, underwriters cover their 15% syndicate short via open-market purchases, injecting buying pressure that stabilizes the trading price.",
                "answerIndex": 0,
                "explanation": "When stock trades at a discount, underwriters cover their 15% syndicate short via open-market purchases, injecting buying pressure that stabilizes the trading price."
            }
        },
        {
            "title": "Tier 3 Command: Section 11 / BarChris Underwriter Due Diligence Clearance",
            "say": [
                "Tier 3 of our Control Tower establishes an unyielding defense shield under Section 11 of the Securities Act of 1933. Under Section 11, the issuing corporation is subject to absolute strict liability for any material misstatements or omissions in an effective registration statement. However, non-issuer defendants—including corporate directors, executive officers who sign the S-1, and every underwriting investment bank—can achieve complete immunity through the affirmative 'Due Diligence Defense' of Section 11(b)(3).",
                "The Tier 3 compliance engine operationalizes the definitive standards of Escott v. BarChris Construction Corp. (1968). In BarChris, the federal court held that underwriters cannot escape liability by merely questioning executives and accepting their answers without independent corroboration. Due diligence is legally required to be adversarial, independent, and rigorous.",
                "Tier 3 partitions the registration statement into its statutory components: (1) Non-Expertised Portions—comprising the business description, MD&A, management biographies, and commercial contract disclosures; and (2) Expertised Portions—comprising the audited financial statements certified by independent public accountants.",
                "For Non-Expertised Portions, Tier 3 enforces an exhaustive verification protocol: underwriters' counsel must independently review all material commercial contracts, inspect manufacturing facilities, examine corporate minute books across parent and subsidiary boards, verify intellectual property title chains, and conduct private, unscripted interviews with top customers and suppliers. Meeting minutes and interview transcripts are cryptographically hashed and logged to establish contemporaneous evidence of a 'reasonable investigation'.",
                "For Expertised Portions, Tier 3 ensures that underwriters and directors satisfy the reliance standard by actively screening for accounting red flags, evaluating off-balance-sheet arrangements, and securing formal PCAOB AS 6101 comfort letters at pricing and closing. By assembling an unimpeachable contemporaneously documented due diligence record, Tier 3 guarantees that any Section 11 lawsuit against underwriters or directors is dismissed on summary judgment."
            ],
            "example": "If a plaintiff class alleges the S-1 omitted a customer cancellation, but the underwriter's data room contains contemporaneous logs of customer verification calls conducted two days before pricing where the customer confirmed ongoing orders, the Section 11 due diligence defense is conclusively sustained.",
            "code": """# Simulation: Tier 3 Section 11 / BarChris Due Diligence Clearance Engine
from typing import Dict, List

def audit_tier3_barchris_due_diligence_clearance(
    syndicate_id: str,
    conducted_independent_customer_interviews: bool,
    audited_subsidiary_board_minutes: bool,
    verified_material_contracts_in_data_room: bool,
    investigated_accounting_red_flags: bool,
    pcaob_comfort_letters_in_hand: bool,
    relied_solely_on_executive_verbal_assurances: bool
) -> dict:
    due_diligence_pillars = [
        ('Customer Verifications', conducted_independent_customer_interviews),
        ('Minute Book Audit', audited_subsidiary_board_minutes),
        ('Contract Verification', verified_material_contracts_in_data_room),
        ('Red Flag Resolution', investigated_accounting_red_flags),
        ('Comfort Letter Delivery', pcaob_comfort_letters_in_hand)
    ]
    
    passed_pillars = [name for name, status in due_diligence_pillars if status]
    failed_pillars = [name for name, status in due_diligence_pillars if not status]
    
    # BarChris fatal flaw: Blind reliance on management assurances
    fatal_reliance_breach = relied_solely_on_executive_verbal_assurances
    
    defense_sustained = len(failed_pillars) == 0 and not fatal_reliance_breach
    
    if defense_sustained:
        status = "SECTION_11_AFFIRMATIVE_DUE_DILIGENCE_DEFENSE_CERTIFIED"
        underwriter_liability_exposure = 0.0
        director_liability_exposure = 0.0
    else:
        status = "DUE_DILIGENCE_DEFENSE_COLLAPSED_BARCHRIS_BREACH"
        underwriter_liability_exposure = 50_000_000.0 # Joint and several exposure
        director_liability_exposure = 15_000_000.0
        
    return {
        'syndicate_id': syndicate_id,
        'tier3_passed': defense_sustained,
        'status': status,
        'passed_pillars_count': len(passed_pillars),
        'failed_pillars': failed_pillars,
        'fatal_reliance_breach': fatal_reliance_breach,
        'underwriter_exposure': underwriter_liability_exposure,
        'director_exposure': director_liability_exposure
    }

# Execute deterministic validation
dd_clear = audit_tier3_barchris_due_diligence_clearance("Syndicate-Apex", True, True, True, True, True, False)
dd_fail = audit_tier3_barchris_due_diligence_clearance("Syndicate-Careless", True, False, False, False, True, True)

print(f"[{dd_clear['syndicate_id']}] -> Status: {dd_clear['status']} (Exposure: ${dd_clear['underwriter_exposure']})")
print(f"[{dd_fail['syndicate_id']}] -> Status: {dd_fail['status']} (Exposure: ${dd_fail['underwriter_exposure']/1e6:.1f}M) | Failed: {dd_fail['failed_pillars']}")
""",
            "output": """[Syndicate-Apex] -> Status: SECTION_11_AFFIRMATIVE_DUE_DILIGENCE_DEFENSE_CERTIFIED (Exposure: $0.0)
[Syndicate-Careless] -> Status: DUE_DILIGENCE_DEFENSE_COLLAPSED_BARCHRIS_BREACH (Exposure: $50.0M) | Failed: ['Minute Book Audit', 'Contract Verification', 'Red Flag Resolution']
""",
            "codeNotes": [
                {"line": 15, "note": "Audits 5 core BarChris pillars: customer calls, minute audits, contract reviews, red flag clearance"},
                {"line": 23, "note": "Disqualifies Section 11 defense if underwriters relied solely on management verbal statements"},
                {"line": 31, "note": "Eliminates $50M underwriter joint liability exposure upon certified due diligence completion"}
            ],
            "tryIt": "Set relied_solely_on_executive_verbal_assurances to False and verify the remaining pillars in dd_fail to restore Section 11 defense immunity.",
            "check": {
                "question": "Under the Tier 3 BarChris Due Diligence Control Tower, what is the legal consequence if an underwriting syndicate relies solely on verbal representations from corporate executives without independently examining underlying contracts?",
                "options": [
                    "The Section 11 affirmative due diligence defense is completely forfeited, subjecting underwriters to joint and several strict liability for registration statement misstatements.",
                    "The underwriters are awarded a medal by the SEC.",
                    "The offering is automatically converted into a private placement.",
                    "The corporate stock price is guaranteed to increase by 50%."
                ],
                "answer": 0,
                "why": "BarChris established that blind reliance on management verbal assurances without primary source verification eviscerates the Section 11 due diligence defense.",
                "answerIndex": 0,
                "explanation": "BarChris established that blind reliance on management verbal assurances without primary source verification eviscerates the Section 11 due diligence defense."
            }
        },
        {
            "title": "Tier 4 Command: PSLRA Class Action Defense & Event Study Econometrics",
            "say": [
                "Tier 4 of our Control Tower moves to the secondary securities litigation battlefield, defending against private class actions filed under Section 10(b) of the Securities Exchange Act of 1934 and SEC Rule 10b-5. When a public company's stock drops following an earnings miss or regulatory inquiry, class action law firms aggressively file strike suits. Tier 4 deploys a multi-phase corporate defense strategy designed to terminate litigation at the earliest procedural juncture.",
                "Phase 1: Rule 12(b)(6) Motion to Dismiss & PSLRA Discovery Stay. Under the Private Securities Litigation Reform Act of 1995 (PSLRA), all burdensome discovery is automatically stayed while the motion to dismiss is pending. The defense challenges the complaint under the Supreme Court's Tellabs v. Makor Issues & Rights (2007) standard, demonstrating that the plaintiff failed to plead a 'strong inference' of scienter that is at least as compelling as plausible non-fraudulent explanations of innocent executive conduct. Furthermore, forward-looking statements are screened under Section 21E Safe Harbor protections.",
                "Phase 2: Halliburton II Price Impact Rebuttal. If the lawsuit survives dismissal, plaintiffs seek Class Certification under Federal Rule of Civil Procedure 23(b)(3), invoking the Basic v. Levinson (1988) fraud-on-the-market presumption of reliance. Tier 4 immediately introduces empirical econometric Event Studies under Halliburton II (2014), proving that the alleged misstatement had zero statistically significant price impact on the stock, destroying class certification.",
                "Phase 3: Dura Pharmaceuticals Loss Causation Dismantling. Under Dura Pharmaceuticals v. Broudo (2005), plaintiffs cannot establish loss causation merely by proving they bought stock at an inflated price; they must prove the price drop was proximately caused by the revelation of the truth. Tier 4's econometric regression models isolate broader market movements, macroeconomic rate adjustments, and industry sector headwinds from the stock drop.",
                "If the event study demonstrates that macroeconomic or industry factors fully account for the observed price decline, loss causation fails as a matter of law. Armed with these economic proofs, defense counsel either achieves full summary judgment or forces plaintiffs to settle for nuisance value covered entirely by Directors & Officers (D&O) insurance."
            ],
            "example": "A shareholder class sues alleging a tech company misled the market about chip demand before a 20% stock drop. Tier 4 introduces an event study proving the semiconductor sector index fell 22% on the exact same day due to an Asian earthquake. Under Dura, macroeconomic confounding causes defeat loss causation, forcing dismissal.",
            "code": """# Simulation: Tier 4 PSLRA Class Action Defense & Econometric Loss Causation Engine
from typing import Dict, List

def execute_tier4_securities_defense_command(
    case_id: str,
    tellabs_innocent_inference_weight: int, # 0 to 100
    tellabs_fraud_inference_weight: int, # 0 to 100
    pslra_meaningful_cautionary_language_present: bool,
    event_study_abnormal_price_impact_statistically_significant: bool,
    dura_market_factor_drop_pct: float,
    dura_stock_gross_drop_pct: float,
    plaintiff_claimed_damages: float
) -> dict:
    # Phase 1: Motion to Dismiss (Tellabs & PSLRA Safe Harbor)
    scienter_dismissed = tellabs_innocent_inference_weight > tellabs_fraud_inference_weight
    safe_harbor_applies = pslra_meaningful_cautionary_language_present
    motion_to_dismiss_granted = scienter_dismissed or safe_harbor_applies
    
    if motion_to_dismiss_granted:
        return {
            'case_id': case_id,
            'tier4_passed': True,
            'status': 'CLASS_ACTION_DISMISSED_AT_PLEADING_STAGE_RULE_12_B_6',
            'defense_phase': 'PHASE_1_MOTION_TO_DISMISS',
            'rationale': 'Complaint failed Tellabs strong inference of scienter or protected under PSLRA Section 21E Safe Harbor.',
            'settlement_exposure': 0.0,
            'damages_eliminated': plaintiff_claimed_damages
        }
        
    # Phase 2: Class Certification (Halliburton II Price Impact)
    if not event_study_abnormal_price_impact_statistically_significant:
        return {
            'case_id': case_id,
            'tier4_passed': True,
            'status': 'CLASS_CERTIFICATION_DENIED_HALLIBURTON_II_REBUTTAL',
            'defense_phase': 'PHASE_2_CLASS_CERTIFICATION',
            'rationale': 'Econometric event study proved zero price impact, rebutting Basic presumption of reliance.',
            'settlement_exposure': 250_000.0, # Nuisance value
            'damages_eliminated': plaintiff_claimed_damages - 250_000.0
        }
        
    # Phase 3: Loss Causation (Dura Pharmaceuticals Regression)
    # If market/industry factors explain >= 80% of the drop
    market_explained_ratio = abs(dura_market_factor_drop_pct / dura_stock_gross_drop_pct) if dura_stock_gross_drop_pct != 0 else 0.0
    loss_causation_defeated = market_explained_ratio >= 0.80
    
    if loss_causation_defeated:
        return {
            'case_id': case_id,
            'tier4_passed': True,
            'status': 'SUMMARY_JUDGMENT_GRANTED_DURA_LOSS_CAUSATION_DEFEATED',
            'defense_phase': 'PHASE_3_LOSS_CAUSATION_SUMMARY_JUDGMENT',
            'rationale': f'Econometrics proved {market_explained_ratio*100:.1f}% of price drop caused by macroeconomic market factors.',
            'settlement_exposure': 0.0,
            'damages_eliminated': plaintiff_claimed_damages
        }
    else:
        return {
            'case_id': case_id,
            'tier4_passed': False,
            'status': 'DEFENSE_EXPOSURE_ACTIVE_MEDIATED_SETTLEMENT_REQUIRED',
            'defense_phase': 'PHASE_4_TRIAL_OR_MEDIATION',
            'rationale': 'Class certified and loss causation established; settle within D&O policy limits.',
            'settlement_exposure': plaintiff_claimed_damages * 0.15, # 15% settlement benchmark
            'damages_eliminated': plaintiff_claimed_damages * 0.85
        }

# Execute deterministic validation
case_dismissed = execute_tier4_securities_defense_command("SEC-LIT-01", 85, 40, True, True, -10.0, -12.0, 150_000_000.0)
case_dura = execute_tier4_securities_defense_command("SEC-LIT-02", 40, 75, False, True, -18.0, -20.0, 80_000_000.0)

print(f"[{case_dismissed['case_id']}] -> Status: {case_dismissed['status']} (Damages Eliminated: ${case_dismissed['damages_eliminated']/1e6:.1f}M)")
print(f"[{case_dura['case_id']}] -> Status: {case_dura['status']} (Damages Eliminated: ${case_dura['damages_eliminated']/1e6:.1f}M)")
""",
            "output": """[SEC-LIT-01] -> Status: CLASS_ACTION_DISMISSED_AT_PLEADING_STAGE_RULE_12_B_6 (Damages Eliminated: $150.0M)
[SEC-LIT-02] -> Status: SUMMARY_JUDGMENT_GRANTED_DURA_LOSS_CAUSATION_DEFEATED (Damages Eliminated: $80.0M)
""",
            "codeNotes": [
                {"line": 15, "note": "Dismisses complaint at pleading stage via Tellabs scienter comparative weighing"},
                {"line": 28, "note": "Defeats class certification under Halliburton II by proving zero price impact via event study"},
                {"line": 40, "note": "Grants summary judgment under Dura Pharmaceuticals by attributing price drop to market factors"}
            ],
            "tryIt": "Reduce dura_market_factor_drop_pct to -2.0% in case_dura to observe how severe firm-specific drops without market explanation trigger active settlement exposure.",
            "check": {
                "question": "In the Tier 4 Securities Defense Control Tower, what is the effect of proving via econometric regression that 90% of an observed stock price drop coincided with a broader macroeconomic market crash?",
                "options": [
                    "Loss causation is defeated under the Supreme Court's Dura Pharmaceuticals doctrine, eliminating plaintiff class damages and entitling the company to summary judgment dismissal.",
                    "The company must immediately file a Chapter 7 liquidation petition.",
                    "The federal court doubles the plaintiff class damages.",
                    "The corporate CEO is automatically barred from leaving the country."
                ],
                "answer": 0,
                "why": "Dura requires plaintiffs to prove the misrepresentation caused their loss; proving that macroeconomic forces caused the drop dismantles loss causation.",
                "answerIndex": 0,
                "explanation": "Dura requires plaintiffs to prove the misrepresentation caused their loss; proving that macroeconomic forces caused the drop dismantles loss causation."
            }
        },
        {
            "title": "Tier 5 Master Command: Boardroom Securities Defense & Milestone 3 Accreditation",
            "say": [
                "You have arrived at Tier 5: The Grand Master Synthesis of Milestone 3. In this final capstone tier, you assemble the composite findings of Tier 1 (Capital Formation & Reg D), Tier 2 (S-1 IPO Syndicate & Regulation M), Tier 3 (BarChris Due Diligence Defense), and Tier 4 (PSLRA Securities Class Action Econometrics) into an executive Boardroom Securities Counsel Certification.",
                "The corporate board of directors, audit committee, and capital allocation committee convene in an extraordinary session. As Chief Legal Officer & Securities General Counsel, you deliver a definitive evidentiary briefing demonstrating how the enterprise has fortified its capital architecture: (1) Validating $200 million in private capital raised under Rules 506(b) and 506(c) with 100% accredited verification and Form D filings; (2) Successfully pricing and closing a $500 million Form S-1 IPO with full Regulation M Rule 104 Green Shoe stabilization; (3) Establishing certified Section 11 affirmative due diligence defenses under BarChris, eliminating all underwriter and director liability exposure; and (4) Dismissing $230 million in predatory shareholder class action claims via Tellabs scienter challenges and Dura loss causation econometric modeling.",
                "The Board of Directors reviews the verified quantitative audit metrics. Across all four operational pillars, the compliance engine confirms zero Section 5 gun-jumping violations, zero unaccredited investor contamination, 100% lock-up execution, certified comfort letters, and zero unresolved class action exposure. The corporate enterprise has achieved complete sovereign capital markets integrity.",
                "Upon final review, the Chairman of the Board, Lead Independent Director, and Audit Committee Chair sign the formal Boardroom Resolution, certifying the enterprise's capital structure and conferring upon you the prestigious credential: Certified Sovereign Capital Markets General Counsel & Securities Defense Master (CSCM-SDM).",
                "This triumphant achievement concludes Milestone 3 of Course 29 (bcom_law), establishing the pinnacle of corporate governance, public securities underwriting, and capital markets litigation jurisprudence across all 15 Days of the Master Curriculum."
            ],
            "example": "The Boardroom General Counsel presents the integrated audit to the board: $700M in capital successfully cleared, $230M in strike suits dismissed with prejudice, 100% lock-up compliance, and zero underwriter liability, earning unanimous Board commendation and Milestone 3 certification.",
            "code": """# Simulation: Tier 5 Master Command Boardroom Defense & Milestone 3 Final Certification
from typing import Dict, List

def execute_milestone3_master_boardroom_certification(
    tier1_capital_formation_cleared: bool,
    tier2_ipo_syndicate_closed: bool,
    tier3_barchris_due_diligence_certified: bool,
    tier4_pslra_litigation_defeated: bool,
    total_capital_raised_usd: float,
    total_class_damages_eliminated_usd: float
) -> dict:
    pillars = [
        ('Tier 1 Capital Formation & Reg D/S', tier1_capital_formation_cleared),
        ('Tier 2 S-1 IPO Syndicate & Reg M', tier2_ipo_syndicate_closed),
        ('Tier 3 BarChris Due Diligence Shield', tier3_barchris_due_diligence_certified),
        ('Tier 4 PSLRA Securities Class Defense', tier4_pslra_litigation_defeated)
    ]
    
    passed_count = sum(1 for name, ok in pillars if ok)
    score_pct = (passed_count / 4.0) * 100.0
    all_tiers_cleared = passed_count == 4
    
    if all_tiers_cleared:
        board_verdict = "UNANIMOUS_BOARDROOM_APPROVAL_AND_SOVEREIGN_CERTIFICATION"
        accreditation_granted = "CERTIFIED_SOVEREIGN_CAPITAL_MARKETS_GENERAL_COUNSEL_AND_SECURITIES_DEFENSE_MASTER"
        governance_status = "CAPITAL_STRUCTURE_IMMUNIZED_AGAINST_REGULATORY_AND_LITIGATION_ATTACK"
    else:
        board_verdict = "BOARDROOM_CERTIFICATION_DENIED_DEFECTIVE_TIERS_DETECTED"
        accreditation_granted = "ACCREDITATION_DENIED_REMEDIATION_REQUIRED"
        governance_status = "CRITICAL_CAPITAL_MARKETS_EXPOSURE_DETECTED"
        
    return {
        'all_tiers_cleared': all_tiers_cleared,
        'composite_score_pct': score_pct,
        'passed_tiers_count': passed_count,
        'board_verdict': board_verdict,
        'accreditation_granted': accreditation_granted,
        'governance_status': governance_status,
        'total_capital_cleared_usd': total_capital_raised_usd,
        'total_damages_eliminated_usd': total_class_damages_eliminated_usd
    }

# Execute deterministic validation
final_master = execute_milestone3_master_boardroom_certification(
    True, True, True, True, 700_000_000.0, 230_000_000.0
)

print("=" * 60)
print(f"BOARDROOM MASTER VERDICT: {final_master['board_verdict']}")
print(f"Composite Score: {final_master['composite_score_pct']:.0f}% ({final_master['passed_tiers_count']}/4 Tiers Cleared)")
print(f"Total Capital Cleared: ${final_master['total_capital_cleared_usd']/1e6:.1f}M")
print(f"Total Class Action Exposure Eliminated: ${final_master['total_damages_eliminated_usd']/1e6:.1f}M")
print(f"Final Accreditation: [{final_master['accreditation_granted']}]")
print("=" * 60)
""",
            "output": """============================================================
BOARDROOM MASTER VERDICT: UNANIMOUS_BOARDROOM_APPROVAL_AND_SOVEREIGN_CERTIFICATION
Composite Score: 100% (4/4 Tiers Cleared)
Total Capital Cleared: $700.0M
Total Class Action Exposure Eliminated: $230.0M
Final Accreditation: [CERTIFIED_SOVEREIGN_CAPITAL_MARKETS_GENERAL_COUNSEL_AND_SECURITIES_DEFENSE_MASTER]
============================================================
""",
            "codeNotes": [
                {"line": 13, "note": "Synthesizes audit results across all 4 capital markets and securities defense tiers"},
                {"line": 20, "note": "Demands 100% composite clearance to confer Boardroom General Counsel Accreditation"},
                {"line": 28, "note": "Certifies $700M in capital formation and $230M in eliminated class action damages"}
            ],
            "tryIt": "Set tier4_pslra_litigation_defeated to False in final_master to observe how unresolved securities litigation blocks Boardroom Master Accreditation.",
            "check": {
                "question": "What is the ultimate strategic objective of the Tier 5 Master Command Boardroom Defense in the Milestone 3 Capstone?",
                "options": [
                    "To integrate capital formation compliance, S-1 IPO syndicate underwriting, BarChris due diligence defenses, and PSLRA econometric class action dismissals into a certified sovereign governance framework.",
                    "To dissolve the corporation and distribute company laptops to shareholders.",
                    "To file a lawsuit against the United States Supreme Court.",
                    "To replace all board members with automated chatbot accounts."
                ],
                "answer": 0,
                "why": "Tier 5 unifies all four operational pillars to establish complete sovereign capital markets integrity and confer Boardroom General Counsel Accreditation.",
                "answerIndex": 0,
                "explanation": "Tier 5 unifies all four operational pillars to establish complete sovereign capital markets integrity and confer Boardroom General Counsel Accreditation."
            }
        }
    ],
    "summary": [
        "Tier 1 Capital Formation: Audits Howey digital assets, enforces Regulation D Rule 506(b) private placement and 506(c) accredited verification, and files Form D on EDGAR.",
        "Tier 2 IPO Syndicate & Regulation M: Directs Form S-1 registration, 180-day insider lock-ups, auditor comfort letters, and executes Rule 104 Green Shoe stabilization buybacks.",
        "Tier 3 BarChris Due Diligence: Certified affirmative defense under Section 11(b) through adversarial primary contract verification, minute audits, and customer interviews.",
        "Tier 4 PSLRA Securities Defense: Dismantles strike suits via Tellabs scienter comparative analysis, Halliburton II event studies, and Dura loss causation econometrics.",
        "Tier 5 Master Boardroom Accreditation: Integrates all 4 tiers, clearing $700M in capital and eliminating $230M in class damages, conferring Certified Sovereign Capital Markets General Counsel accreditation."
    ],
    "projectStep": {
        "title": "Corporate Law Milestone 3 Capstone: Capital Markets Syndicate & Securities Enforcement Master Control Tower",
        "steps": [
            "Execute Tier 1 Howey test audit and Regulation D Rule 506(b)/(c) accredited investor verification program.",
            "Model Tier 2 Form S-1 firm commitment syndicate allocations and execute Regulation M Rule 104 Green Shoe stabilization.",
            "Audit Tier 3 Section 11 BarChris due diligence programs across contracts, minutes, and comfort letters to shield underwriters.",
            "Formulate Tier 4 PSLRA motions to dismiss and Dura Pharmaceuticals econometric loss causation event study models.",
            "Deliver Tier 5 Boardroom General Counsel Defense briefing and secure Milestone 3 Sovereign Capital Markets Accreditation."
        ]
    }
}

if __name__ == "__main__":
    total = ensure_law_day_budget(DAY_15)
    print(f"B.Com Corporate Law Day 15 Total Words: {total}")
    for i, p in enumerate(DAY_15['parts']):
        print(f"  Part {i+1} words: {count_words(p['say'])}")
