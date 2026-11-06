"""
Course 29: B.Com Corporate & Commercial Law, Contracts & Governance (bcom_law)
Day 12 Builder: Private Placements, Regulation D (Rule 506) & Accredited Investor Invariants
Milestone 3: Securities Regulation, Capital Markets & Public Offerings
Guarantees >= 580 words per part and >= 2,950 words total with deterministic Python simulations.
"""

from corporate_law_budget_ensurer import ensure_law_day_budget
from visual_builder import count_words

DAY_12 = {
    "coursePrefix": "bcom_law",
    "day": 12,
    "title": "Private Placements, Regulation D (Rule 506) & Accredited Investor Invariants",
    "goal": "Master non-public capital formation under the Securities Act of 1933: navigate Section 4(a)(2) Ralston Purina jurisprudence, dissect Regulation D safe harbors (Rule 504, 506(b), and 506(c) general solicitation), audit Rule 501 accredited investor verification standards, manage Form D filings, and model Rule 144 restricted stock resale mechanics and Regulation S offshore offerings.",
    "minutes": 45,
    "recap": "Yesterday in Day 11, we mastered the Howey Test, the Section 5 registration timeline, gun-jumping rules, and Section 11/12(a)(2) liabilities. Today in Day 12, we explore the multi-trillion-dollar private capital ecosystem: private placements, Regulation D, accredited investor verification, and secondary resale restrictions.",
    "parts": [
        {
            "title": "The Statutory Private Placement Exemption: Section 4(a)(2) & Ralston Purina",
            "say": [
                "While public registered offerings capture public attention, the overwhelming majority of capital raised in modern corporate finance occurs through private capital formation. Section 4(a)(2) of the Securities Act of 1933 exempts from the mandatory registration requirements of Section 5 'transactions by an issuer not involving any public offering'. However, the statutory text of the 1933 Act failed to define what constitutes a 'public offering', leaving courts and corporate counsel in intense uncertainty for decades.",
                "In the landmark decision SEC v. Ralston Purina Co. (1953), the Supreme Court established the foundational judicial standard for private placements. Ralston Purina offered treasury common stock to hundreds of its own employees across dozens of operational facilities—including bakeshop workers, chow loading foremen, and clerical staff—claiming the offering was private because it was restricted to employees. The Supreme Court rejected the company's argument, ruling that the applicability of Section 4(a)(2) must turn on whether the particular class of persons affected needs the protection of the Act.",
                "The Supreme Court formulated the definitive test: an offering does not involve a public offering if all offerees are persons who are shown to be able to 'fend for themselves'. To satisfy this standard, the Court held that offerees must possess two essential qualities: (1) Financial Sophistication—the knowledge and experience in financial and business matters to evaluate the risks and merits of the prospective investment, and (2) Access to Information—economic bargaining power equivalent to that of an insider, enabling them to obtain the same comprehensive disclosures that would be contained in a formal Section 10 registration statement.",
                "Because Ralston Purina offered stock to rank-and-file factory workers who lacked executive financial access and could not fend for themselves, the offering was held to be an illegal unregistered public distribution. Subsequent appellate decisions reinforced that under statutory Section 4(a)(2), the issuer bears the absolute burden of proving that every single offeree—not merely actual purchasers—satisfies the sophistication and information access criteria. If even one offeree lacks sophistication, the entire Section 4(a)(2) exemption is destroyed.",
                "This all-or-nothing statutory vulnerability created immense legal peril for emerging growth companies, venture capital syndicates, and private equity sponsors. If an issuer inadvertently pitched a private round to an unsophisticated acquaintance, all investors gained an automatic statutory right of rescission under Section 12(a)(1) to demand their money back. To replace this unpredictable judicial framework with objective certainty, the SEC promulgated Regulation D."
            ],
            "example": "If a private enterprise pitches its Series A equity financing exclusively to institutional venture capital firms that have access to full data rooms and audited financials, it easily satisfies Ralston Purina. But if the company pitches the same deal to 50 retail warehouse employees without registration, the Section 4(a)(2) exemption is destroyed, granting every investor a right of rescission.",
            "code": """# Simulation: Section 4(a)(2) Ralston Purina Private Placement Compliance Engine
from typing import Dict, List

def evaluate_ralston_purina_exemption(
    offering_id: str,
    total_offerees_count: int,
    offerees: List[dict] # Each dict: {'id': str, 'is_sophisticated': bool, 'has_access_to_info': bool, 'is_insider_or_institutional': bool}
) -> dict:
    all_can_fend_for_themselves = True
    failing_offerees = []
    
    for offeree in offerees:
        can_fend = offeree['is_sophisticated'] and (offeree['has_access_to_info'] or offeree['is_insider_or_institutional'])
        if not can_fend:
            all_can_fend_for_themselves = False
            failing_offerees.append(offeree['id'])
            
    if all_can_fend_for_themselves and total_offerees_count <= len(offerees):
        exemption_status = "SECTION_4_A_2_STATUTORY_EXEMPTION_SUSTAINED"
        rescission_risk = "ZERO_RESCISSION_RISK_VALID_PRIVATE_PLACEMENT"
        is_valid = True
    else:
        exemption_status = "EXEMPTION_DESTROYED_ILLEGAL_PUBLIC_OFFERING"
        rescission_risk = "ABSOLUTE_SECTION_12_A_1_RESCISSION_LIABILITY_ALL_PURCHASERS"
        is_valid = False
        
    return {
        'offering_id': offering_id,
        'total_offerees': len(offerees),
        'failing_offerees_count': len(failing_offerees),
        'failing_offerees': failing_offerees,
        'is_valid_private_placement': is_valid,
        'exemption_status': exemption_status,
        'rescission_risk': rescission_risk
    }

# Execute deterministic validation
cohort_institutional = [
    {'id': 'VC-01', 'is_sophisticated': True, 'has_access_to_info': True, 'is_insider_or_institutional': True},
    {'id': 'VC-02', 'is_sophisticated': True, 'has_access_to_info': True, 'is_insider_or_institutional': True},
    {'id': 'PE-03', 'is_sophisticated': True, 'has_access_to_info': True, 'is_insider_or_institutional': True}
]
cohort_tainted = [
    {'id': 'VC-01', 'is_sophisticated': True, 'has_access_to_info': True, 'is_insider_or_institutional': True},
    {'id': 'EMP-02', 'is_sophisticated': False, 'has_access_to_info': False, 'is_insider_or_institutional': False}
]

r1 = evaluate_ralston_purina_exemption("ROUND-A", 3, cohort_institutional)
r2 = evaluate_ralston_purina_exemption("ROUND-B", 2, cohort_tainted)

print(f"[{r1['offering_id']}] -> Status: {r1['exemption_status']} | Rescission: {r1['rescission_risk']}")
print(f"[{r2['offering_id']}] -> Status: {r2['exemption_status']} | Failed: {r2['failing_offerees']}")
""",
            "output": """[ROUND-A] -> Status: SECTION_4_A_2_STATUTORY_EXEMPTION_SUSTAINED | Rescission: ZERO_RESCISSION_RISK_VALID_PRIVATE_PLACEMENT
[ROUND-B] -> Status: EXEMPTION_DESTROYED_ILLEGAL_PUBLIC_OFFERING | Failed: ['EMP-02']
""",
            "codeNotes": [
                {"line": 12, "note": "Implements Ralston Purina standard: every offeree must be able to fend for themselves"},
                {"line": 15, "note": "Single unsophisticated offeree destroys the entire Section 4(a)(2) statutory exemption"},
                {"line": 23, "note": "Triggers Section 12(a)(1) rescission liability across all investors if exemption fails"}
            ],
            "tryIt": "Modify EMP-02 in cohort_tainted to have is_sophisticated=True and has_access_to_info=True to observe how fulfilling the dual test rescues ROUND-B.",
            "check": {
                "question": "Under the Supreme Court's landmark decision in SEC v. Ralston Purina Co., what must an issuer prove to sustain a valid Section 4(a)(2) private placement exemption?",
                "options": [
                    "That all offerees possess financial sophistication and have access to the same kind of information that registration would disclose, enabling them to fend for themselves.",
                    "That the securities were sold exclusively on a weekend.",
                    "That the total amount of capital raised was less than $100,000.",
                    "That the CEO has never been convicted of a traffic violation."
                ],
                "answer": 0,
                "why": "Ralston Purina establishes that Section 4(a)(2) exempts only transactions where all offerees are sophisticated and possess information access equivalent to registration, eliminating the need for statutory protection.",
                "answerIndex": 0,
                "explanation": "Ralston Purina establishes that Section 4(a)(2) exempts only transactions where all offerees are sophisticated and possess information access equivalent to registration, eliminating the need for statutory protection."
            }
        },
        {
            "title": "Regulation D Safe Harbors: Rule 504 vs. Rule 506(b) vs. Rule 506(c)",
            "say": [
                "Promulgated in 1982 and expanded under the JOBS Act of 2012, Regulation D serves as the primary regulatory framework for private offerings in the United States, providing objective non-exclusive safe harbors under Section 4(a)(2). If an issuer complies with the precise structural requirements of Regulation D, the offering is deemed as a matter of law not to involve any public offering, insulating the company from Section 5 registration liability. Regulation D is structured primarily around three operational rules: Rule 504, Rule 506(b), and Rule 506(c).",
                "Rule 504 provides an exemption for small capital raises by non-reporting private companies of up to $10 million in any 12-month period. Under Rule 504, there is no limitation on the number or sophistication of investors, and general solicitation is permitted if the offering is registered under state blue sky laws or restricted to accredited investors. However, Rule 504 is unavailable to blank-check companies, investment funds, or SEC reporting entities.",
                "Rule 506(b) is the historic bedrock of venture capital and private equity financing. Under Rule 506(b), an issuer can raise an unlimited dollar amount of capital from an unlimited number of 'accredited investors', and up to 35 non-accredited but sophisticated investors. Crucially, Rule 506(b) strictly prohibits any form of 'General Solicitation or General Advertising' (Rule 502(c)). The issuer cannot publish advertisements, broadcast on television, host open public webinars, or blast social media promotions. All participating investors must be sourced through pre-existing substantive business relationships.",
                "Title II of the JOBS Act revolutionized capital formation by creating Rule 506(c). Under Rule 506(c), issuers are affirmatively authorized to engage in wide-open General Solicitation—including billboard advertising, podcast sponsorships, press releases, and public internet postings—to market their private placement without dollar limitation! However, this freedom comes with two non-negotiable statutory trade-offs: (1) All ultimate purchasers must be accredited investors (zero non-accredited investors permitted), and (2) The issuer must take 'reasonable steps to verify' that every purchaser is accredited, rather than relying on self-certification.",
                "Furthermore, under Section 18 of the 1933 Act, securities issued under Rule 506(b) and Rule 506(c) are classified as 'Covered Securities', which completely preempts state blue sky registration requirements. States cannot review or condition the offering; they are limited solely to requiring notice filings on Form D and charging statutory filing fees."
            ],
            "example": "A fintech startup raising a $50 million round under Rule 506(b) invites existing angel investors and venture funds via private password-protected portals; this is fully compliant. If another startup raising under Rule 506(c) announces its round on CNBC and Twitter, it is also fully compliant, provided it uses tax returns or CPA verification letters to verify every purchaser's accredited status.",
            "code": """# Simulation: Regulation D Safe Harbor Evaluator (Rule 504 vs 506(b) vs 506(c))
from typing import Dict, List

def evaluate_reg_d_offering_compliance(
    offering_id: str,
    target_rule: str, # 'RULE_504', 'RULE_506_B', 'RULE_506_C'
    capital_raised: float,
    used_general_solicitation: bool,
    accredited_investors_count: int,
    non_accredited_sophisticated_count: int,
    non_accredited_unsophisticated_count: int,
    took_reasonable_steps_to_verify_accredited: bool
) -> dict:
    errors = []
    
    if target_rule == 'RULE_504':
        if capital_raised > 10_000_000.0:
            errors.append("Rule 504 exceeds statutory 12-month cap of $10,000,000.")
        if used_general_solicitation:
            errors.append("Rule 504 general solicitation requires state blue sky registration.")
            
    elif target_rule == 'RULE_506_B':
        if used_general_solicitation:
            errors.append("Rule 506(b) strictly prohibits general solicitation or general advertising.")
        if non_accredited_unsophisticated_count > 0:
            errors.append("Rule 506(b) non-accredited investors must be sophisticated.")
        if non_accredited_sophisticated_count > 35:
            errors.append(f"Rule 506(b) exceeds maximum of 35 non-accredited purchasers (got {non_accredited_sophisticated_count}).")
            
    elif target_rule == 'RULE_506_C':
        if non_accredited_sophisticated_count > 0 or non_accredited_unsophisticated_count > 0:
            errors.append("Rule 506(c) strictly forbids non-accredited purchasers (100% accredited required).")
        if not took_reasonable_steps_to_verify_accredited:
            errors.append("Rule 506(c) requires objective reasonable verification of accredited status; self-certification is illegal.")
            
    is_compliant = len(errors) == 0
    status = f"COMPLIANT_{target_rule}_SAFE_HARBOR" if is_compliant else "REGULATION_D_SAFE_HARBOR_BREACHED"
    
    return {
        'offering_id': offering_id,
        'target_rule': target_rule,
        'is_compliant': is_compliant,
        'status': status,
        'state_blue_sky_preempted': target_rule in ['RULE_506_B', 'RULE_506_C'] and is_compliant,
        'errors': errors
    }

# Execute deterministic validation
o1 = evaluate_reg_d_offering_compliance("OFFER-506B", "RULE_506_B", 45_000_000.0, False, 120, 12, 0, False)
o2 = evaluate_reg_d_offering_compliance("OFFER-506B-ERR", "RULE_506_B", 20_000_000.0, True, 50, 0, 0, False)
o3 = evaluate_reg_d_offering_compliance("OFFER-506C", "RULE_506_C", 100_000_000.0, True, 450, 0, 0, True)

print(f"[{o1['offering_id']}] -> Status: {o1['status']} | Blue Sky Preemption: {o1['state_blue_sky_preempted']}")
print(f"[{o2['offering_id']}] -> Status: {o2['status']} | Errors: {o2['errors']}")
print(f"[{o3['offering_id']}] -> Status: {o3['status']} | Blue Sky Preemption: {o3['state_blue_sky_preempted']}")
""",
            "output": """[OFFER-506B] -> Status: COMPLIANT_RULE_506_B_SAFE_HARBOR | Blue Sky Preemption: True
[OFFER-506B-ERR] -> Status: REGULATION_D_SAFE_HARBOR_BREACHED | Errors: ['Rule 506(b) strictly prohibits general solicitation or general advertising.']
[OFFER-506C] -> Status: COMPLIANT_RULE_506_C_SAFE_HARBOR | Blue Sky Preemption: True
""",
            "codeNotes": [
                {"line": 15, "note": "Enforces Rule 504 12-month offering maximum of $10M"},
                {"line": 21, "note": "Enforces Rule 506(b) strict ban on general advertising and 35 non-accredited cap"},
                {"line": 29, "note": "Validates Rule 506(c) general solicitation with mandatory reasonable accredited verification"}
            ],
            "tryIt": "Set took_reasonable_steps_to_verify_accredited to False in o3 to observe how relying on mere check-the-box self-certification invalidates a Rule 506(c) offering.",
            "check": {
                "question": "What is the primary legal difference between an offering conducted under Rule 506(b) versus Rule 506(c) of Regulation D?",
                "options": [
                    "Rule 506(b) prohibits general solicitation but permits up to 35 non-accredited sophisticated investors, while Rule 506(c) allows wide general solicitation but requires 100% accredited investors with reasonable verification.",
                    "Rule 506(b) is limited to $5 million, while Rule 506(c) is limited to $10 million.",
                    "Rule 506(b) applies only to agricultural businesses, while Rule 506(c) applies only to oil companies.",
                    "Rule 506(c) requires immediate registration of common stock on the London Stock Exchange."
                ],
                "answer": 0,
                "why": "Rule 506(c) permits general solicitation provided that all purchasers are accredited and the issuer takes reasonable verification steps, whereas Rule 506(b) bans general advertising entirely.",
                "answerIndex": 0,
                "explanation": "Rule 506(c) permits general solicitation provided that all purchasers are accredited and the issuer takes reasonable verification steps, whereas Rule 506(b) bans general advertising entirely."
            }
        },
        {
            "title": "Accredited Investor Verification Invariants (Rule 501) & Form D Filings",
            "say": [
                "The entire architectural stability of Regulation D rests upon the definition of an 'Accredited Investor' under Rule 501(a). Accredited investors are legally presumed to have sufficient financial sophistication, wealth, or institutional expertise to evaluate risk and bear the economic loss of investing in unregistered, illiquid securities. If an issuer miscalculates an investor's accredited status in a Rule 506(c) offering or exceeds the 35 non-accredited limit in Rule 506(b), the safe harbor collapses.",
                "Under Rule 501(a), an individual natural person qualifies as an accredited investor under two primary objective financial prongs: (1) The Income Test—having an individual annual income exceeding $200,000 in each of the two most recent years, or joint income with a spouse or spousal equivalent exceeding $300,000, with a reasonable expectation of reaching the same income level in the current year; or (2) The Net Worth Test—having an individual net worth, or joint net worth with a spouse, exceeding $1,000,000 at the time of purchase. Crucially, the Dodd-Frank Act amended the net worth calculation to strictly exclude the value of the primary residence, as well as associated mortgage debt (except where debt exceeds fair market value).",
                "In 2020, the SEC modernized Rule 501(a) by expanding accredited status to individuals holding professional certifications in good standing—specifically the Series 7 (General Securities Representative), Series 65 (Investment Adviser Representative), and Series 82 (Private Securities Offerings Representative) licenses—regardless of their personal wealth. For entities, banks, registered investment companies, business development companies, venture capital funds with total assets exceeding $5,000,000, and entities where all equity owners are accredited also qualify.",
                "In Rule 506(c) offerings, the SEC established four non-exclusive safe harbor methods for issuers to satisfy the 'reasonable verification' requirement: (1) Reviewing IRS tax forms (W-2, 1099, Form 1040) for the two most recent years accompanied by written representation; (2) Reviewing bank statements, brokerage accounts, and credit reports dated within three months; (3) Obtaining written confirmation from a licensed attorney, Certified Public Accountant (CPA), registered broker-dealer, or registered investment adviser; or (4) Verifying existing investors from pre-JOBS Act rounds.",
                "Finally, within 15 calendar days after the first sale of securities in any Regulation D offering, Rule 503 mandates that the issuer file a Form D notice with the SEC via EDGAR. Form D is an informational notice detailing the issuer's identity, executive officers, offering size, and exemption claimed. While failure to file Form D does not automatically invalidate the safe harbor, it subjects the company to SEC disqualification from future Regulation D usage under Rule 507."
            ],
            "example": "An investor owns a $2,000,000 home with an $800,000 mortgage, and has $600,000 in liquid stock portfolios. Under the Dodd-Frank net worth rule, the primary residence and mortgage are excluded, leaving a net worth of $600,000. Unless their income exceeds $200,000 or they hold a Series 7 license, they are NOT an accredited investor.",
            "code": """# Simulation: Rule 501 Accredited Investor & Verification Compliance Engine
from typing import Dict, List

def audit_accredited_investor_status(
    investor_id: str,
    investor_type: str, # 'NATURAL_PERSON', 'INSTITUTIONAL_ENTITY'
    annual_income_year_1: float,
    annual_income_year_2: float,
    expected_current_year_income: float,
    joint_income: bool,
    total_assets: float,
    primary_residence_fair_market_value: float,
    primary_residence_mortgage_debt: float,
    other_liabilities: float,
    holds_professional_license: bool, # Series 7, 65, or 82
    entity_assets: float,
    verification_method_used: str # 'CPA_WRITTEN_CONFIRMATION', 'IRS_TAX_FORMS', 'BANK_BROKERAGE_STATEMENTS', 'SELF_CERTIFICATION_ONLY'
) -> dict:
    # 1. Income Test
    income_threshold = 300_000.0 if joint_income else 200_000.0
    qualifies_income = (
        annual_income_year_1 >= income_threshold and 
        annual_income_year_2 >= income_threshold and 
        expected_current_year_income >= income_threshold
    )
    
    # 2. Net Worth Test (Excluding Primary Residence under Dodd-Frank)
    # Excess mortgage debt over home value must be added to liabilities
    underwater_mortgage = max(0.0, primary_residence_mortgage_debt - primary_residence_fair_market_value)
    adjusted_assets = max(0.0, total_assets - primary_residence_fair_market_value)
    adjusted_liabilities = other_liabilities + underwater_mortgage
    calculated_net_worth = adjusted_assets - adjusted_liabilities
    qualifies_net_worth = calculated_net_worth >= 1_000_000.0
    
    # 3. Professional Certification Prong
    qualifies_license = holds_professional_license
    
    # 4. Entity Test (>= $5M assets)
    qualifies_entity = investor_type == 'INSTITUTIONAL_ENTITY' and entity_assets >= 5_000_000.0
    
    is_accredited = qualifies_income or qualifies_net_worth or qualifies_license or qualifies_entity
    
    # Verification rigor for Rule 506(c)
    valid_verification_methods = [
        'CPA_WRITTEN_CONFIRMATION', 'IRS_TAX_FORMS', 'BANK_BROKERAGE_STATEMENTS'
    ]
    verification_compliant = verification_method_used in valid_verification_methods
    
    return {
        'investor_id': investor_id,
        'is_accredited': is_accredited,
        'calculated_net_worth': calculated_net_worth,
        'qualifies_income': qualifies_income,
        'qualifies_net_worth': qualifies_net_worth,
        'qualifies_license': qualifies_license,
        'qualifies_entity': qualifies_entity,
        'verification_compliant_506c': is_accredited and verification_compliant
    }

# Execute deterministic validation
inv1 = audit_accredited_investor_status(
    "INV-01", "NATURAL_PERSON", 250_000, 260_000, 275_000, False,
    2_500_000, 1_500_000, 500_000, 100_000, False, 0, "IRS_TAX_FORMS"
)
inv2 = audit_accredited_investor_status(
    "INV-02", "NATURAL_PERSON", 120_000, 130_000, 140_000, False,
    2_200_000, 1_600_000, 600_000, 150_000, False, 0, "SELF_CERTIFICATION_ONLY"
)
inv3 = audit_accredited_investor_status(
    "INV-03", "NATURAL_PERSON", 80_000, 85_000, 90_000, False,
    200_000, 0, 0, 10_000, True, 0, "CPA_WRITTEN_CONFIRMATION"
)

print(f"High Earner: Accredited={inv1['is_accredited']} | 506(c) Verified: {inv1['verification_compliant_506c']}")
print(f"House Rich / Cash Poor: Accredited={inv2['is_accredited']} | Net Worth: ${inv2['calculated_net_worth']:,.0f}")
print(f"Licensed Professional: Accredited={inv3['is_accredited']} | 506(c) Verified: {inv3['verification_compliant_506c']}")
""",
            "output": """High Earner: Accredited=True | 506(c) Verified: True
House Rich / Cash Poor: Accredited=False | Net Worth: $450,000
Licensed Professional: Accredited=True | 506(c) Verified: True
""",
            "codeNotes": [
                {"line": 17, "note": "Applies $200k individual / $300k joint income threshold over past 2 years"},
                {"line": 25, "note": "Calculates Dodd-Frank net worth strictly excluding primary residence equity"},
                {"line": 43, "note": "Enforces Rule 506(c) verification requiring CPA letter, tax forms, or bank records"}
            ],
            "tryIt": "Set holds_professional_license to True in inv2 to see how Series 7/65/82 credentials grant accredited status regardless of income or home value.",
            "check": {
                "question": "Under the Dodd-Frank Act amendments to SEC Rule 501, how must an individual calculate their net worth to qualify as an accredited investor?",
                "options": [
                    "Net worth must exceed $1,000,000, strictly excluding the value of the primary residence and any associated debt (unless the mortgage is underwater).",
                    "Net worth must include all residential real estate, personal jewelry, and household furniture.",
                    "Net worth must be certified by the local county sheriff.",
                    "Net worth must equal at least 50% of the company's total authorized shares."
                ],
                "answer": 0,
                "why": "Dodd-Frank mandates that the primary residence value and associated normal mortgage debt be excluded from the $1,000,000 net worth calculation to protect unsophisticated homeowners.",
                "answerIndex": 0,
                "explanation": "Dodd-Frank mandates that the primary residence value and associated normal mortgage debt be excluded from the $1,000,000 net worth calculation to protect unsophisticated homeowners."
            }
        },
        {
            "title": "Secondary Resale Restrictions: Rule 144 Holding Periods & Volume Limitations",
            "say": [
                "Securities acquired in private placements under Section 4(a)(2) or Regulation D are classified under federal law as 'Restricted Securities'. When physical certificates are issued, they must bear a prominent red restrictive legend on the reverse side stating that the securities are unregistered and cannot be sold, transferred, or pledged in the absence of an effective registration statement or an opinion of counsel establishing an exemption. However, investors eventually require secondary market liquidity.",
                "To resolve the statutory bottleneck created by Section 4(a)(1) (which exempts non-underwriter transactions) and Section 2(a)(11) (which broadly defines an 'underwriter' as anyone who purchases from an issuer with a view to distribution), the SEC promulgated Rule 144. Rule 144 establishes a safe harbor under which an investor who resells restricted securities into the public secondary market is deemed not to be engaged in a distribution and is therefore not an underwriter.",
                "To satisfy Rule 144, the transaction must meet up to five strict conditions depending on whether the seller is an 'Affiliate' (a controlling person, director, officer, or 10% shareholder) or a 'Non-Affiliate' of the issuer. Condition 1 is the mandatory Holding Period: restricted securities of an SEC reporting company must be held for at least six months; restricted securities of a non-reporting private company must be held for at least one full year before any public resale.",
                "For Non-Affiliates of reporting issuers, Rule 144 is extraordinarily liberal: after holding the shares for six months, they can resell an unlimited volume of shares into the public market, subject only to the issuer maintaining current public information during months 6 through 12. After one year, non-affiliates can resell without any restrictions whatsoever—even if the company ceases filing SEC reports! The restrictive legend can be formally removed by the transfer agent upon receipt of a standard Rule 144 legal opinion.",
                "In sharp contrast, Affiliates (corporate insiders) remain permanently subject to ongoing Rule 144 restrictions forever, regardless of how many decades they hold the shares. Affiliates must comply with: (1) Volume Limitations—sales in any three-month period cannot exceed the greater of 1% of total outstanding shares or the average weekly trading volume of the prior four weeks; (2) Manner of Sale—sales must be conducted as unsolicited routine broker transactions; (3) Current Public Information; and (4) Filing Form 144 with the SEC concurrently with placing the sell order if sales exceed 5,000 shares or $50,000."
            ],
            "example": "A software engineer who left a private tech company after holding private shares for 14 months can resell all shares on Nasdaq without volume limits once the company goes public, because they are a non-affiliate past the 1-year mark. But the CEO (an affiliate) can only sell up to 1% of outstanding shares per quarter and must file Form 144.",
            "code": """# Simulation: SEC Rule 144 Restricted Stock Resale Compliance Engine
from typing import Dict, List

def evaluate_rule_144_resale(
    shareholder_id: str,
    is_affiliate: bool, # Director, officer, or >10% controlling owner
    is_reporting_issuer: bool,
    holding_period_months: int,
    company_has_current_public_info: bool,
    proposed_shares_to_sell: int,
    total_outstanding_shares: int,
    four_week_average_weekly_trading_volume: int,
    dollar_value_of_proposed_sale: float,
    filed_form_144: bool
) -> dict:
    required_holding_period = 6 if is_reporting_issuer else 12
    holding_satisfied = holding_period_months >= required_holding_period
    
    if not holding_satisfied:
        return {
            'shareholder_id': shareholder_id,
            'is_cleared_for_resale': False,
            'status': 'ILLEGAL_UNDERWRITER_DISTRIBUTION',
            'reason': f'Mandatory holding period unsatisfied: {holding_period_months} mo < {required_holding_period} mo.'
        }
        
    # Non-Affiliate Analysis
    if not is_affiliate:
        if holding_period_months >= 12:
            return {
                'shareholder_id': shareholder_id,
                'is_cleared_for_resale': True,
                'status': 'UNRESTRICTED_RULE_144_RESALE',
                'volume_limit': 'UNLIMITED',
                'form_144_required': False,
                'legend_removal_authorized': True
            }
        elif is_reporting_issuer and company_has_current_public_info:
            return {
                'shareholder_id': shareholder_id,
                'is_cleared_for_resale': True,
                'status': 'RULE_144_CLEARED_BETWEEN_6_AND_12_MONTHS',
                'volume_limit': 'UNLIMITED',
                'form_144_required': False,
                'legend_removal_authorized': True
            }
        else:
            return {
                'shareholder_id': shareholder_id,
                'is_cleared_for_resale': False,
                'status': 'PUBLIC_INFO_CONDITION_UNMET',
                'reason': 'Company lacks current public information during months 6-12.'
            }
            
    # Affiliate Analysis (Permanently subject to volume & Form 144 limits)
    if not company_has_current_public_info:
        return {
            'shareholder_id': shareholder_id,
            'is_cleared_for_resale': False,
            'status': 'AFFILIATE_SALE_BLOCKED_NO_PUBLIC_INFO',
            'reason': 'Affiliates require active public reporting.'
        }
        
    one_percent_shares = int(total_outstanding_shares * 0.01)
    volume_cap = max(one_percent_shares, four_week_average_weekly_trading_volume)
    exceeds_volume = proposed_shares_to_sell > volume_cap
    
    needs_form_144 = proposed_shares_to_sell > 5000 or dollar_value_of_proposed_sale > 50000.0
    form_144_compliant = not needs_form_144 or filed_form_144
    
    if exceeds_volume:
        return {
            'shareholder_id': shareholder_id,
            'is_cleared_for_resale': False,
            'status': 'RULE_144_VOLUME_LIMITATION_BREACHED',
            'volume_cap': volume_cap,
            'proposed': proposed_shares_to_sell
        }
    if not form_144_compliant:
        return {
            'shareholder_id': shareholder_id,
            'is_cleared_for_resale': False,
            'status': 'MANDATORY_FORM_144_FILING_MISSING',
            'reason': 'Exceeds 5,000 shares or $50k threshold without Form 144 notice.'
        }
        
    return {
        'shareholder_id': shareholder_id,
        'is_cleared_for_resale': True,
        'status': 'AFFILIATE_RULE_144_SALE_AUTHORIZED',
        'volume_cap': volume_cap,
        'legend_removal_authorized': True
    }

# Execute deterministic validation
r1 = evaluate_rule_144_resale("NON-AFF-ENG", False, True, 14, True, 50000, 10000000, 20000, 500000, False)
r2 = evaluate_rule_144_resale("CEO-AFFILIATE", True, True, 24, True, 80000, 10000000, 50000, 800000, True)
r3 = evaluate_rule_144_resale("CEO-GREEDY", True, True, 24, True, 300000, 10000000, 50000, 3000000, True)

print(f"Non-Affiliate Resale: Cleared={r1['is_cleared_for_resale']} | Status: {r1['status']}")
print(f"Compliant Affiliate: Cleared={r2['is_cleared_for_resale']} | Status: {r2['status']}")
print(f"Excessive Volume Affiliate: Cleared={r3['is_cleared_for_resale']} | Status: {r3['status']}")
""",
            "output": """Non-Affiliate Resale: Cleared=True | Status: UNRESTRICTED_RULE_144_RESALE
Compliant Affiliate: Cleared=True | Status: AFFILIATE_RULE_144_SALE_AUTHORIZED
Excessive Volume Affiliate: Cleared=False | Status: RULE_144_VOLUME_LIMITATION_BREACHED
""",
            "codeNotes": [
                {"line": 15, "note": "Enforces 6-month reporting and 12-month non-reporting holding period requirements"},
                {"line": 23, "note": "Unlocks unlimited public resale for non-affiliates after 12 months"},
                {"line": 48, "note": "Applies affiliate volume limitation: greater of 1% of shares or 4-week weekly average"}
            ],
            "tryIt": "Set holding_period_months to 4 in r1 to verify how premature resale triggers illegal underwriter distribution status under Rule 144.",
            "check": {
                "question": "Under SEC Rule 144, what volume restriction applies to a NON-AFFILIATE shareholder reselling restricted stock of an SEC reporting company after holding the shares for more than one year?",
                "options": [
                    "There are ZERO volume limitations; the non-affiliate can sell 100% of their shares immediately without volume caps or Form 144 filings.",
                    "The non-affiliate can sell no more than 10 shares per year.",
                    "The non-affiliate is permanently restricted to 1% of total outstanding shares.",
                    "The non-affiliate must obtain personal written permission from the United States Treasury Secretary."
                ],
                "answer": 0,
                "why": "Once a non-affiliate holds restricted stock for one full year, all Rule 144 restrictions fall away entirely, permitting unlimited secondary market resales.",
                "answerIndex": 0,
                "explanation": "Once a non-affiliate holds restricted stock for one full year, all Rule 144 restrictions fall away entirely, permitting unlimited secondary market resales."
            }
        },
        {
            "title": "Cross-Border Offerings: Regulation S Offshore Safe Harbors & Flowback Invariants",
            "say": [
                "In an interconnected global financial system, multinational corporations frequently issue debt and equity securities outside the United States to international institutional investors. However, Section 5 of the 1933 Act states on its face that it applies to any offer or sale involving 'interstate commerce'—a term defined in Section 2(a)(7) to include commerce between any foreign country and the United States. Read literally, this jurisdictional reach would require foreign corporations issuing bonds in London or Tokyo to register with the SEC.",
                "To resolve extraterritoriality conflicts and clarify the territorial boundaries of Section 5, the SEC adopted Regulation S. Regulation S establishes a fundamental territorial principle: Section 5 applies solely to offers and sales of securities that occur within the territorial United States, and does NOT apply to truly offshore transactions.",
                "Under Rule 901, any offer or sale made outside the United States is deemed not to be within the scope of Section 5. To ensure compliance, Rule 903 and Rule 904 provide two non-negotiable General Conditions that must be met in every Regulation S offering: (1) The offer or sale must be made in an 'Offshore Transaction'—meaning the buyer is outside the United States when the buy order is placed, or the sale is executed on the physical trading floor of an established foreign securities exchange; and (2) No 'Directed Selling Efforts' (DSE) may be conducted in the United States by the issuer, distributors, or affiliates.",
                "Directed Selling Efforts are defined as any marketing activity undertaken for the purpose of, or that could reasonably be expected to have the effect of, conditioning the U.S. market for the offshore securities. Examples include roadshows in New York, advertisements in publications with broad U.S. circulation, or targeted marketing emails sent to American IP addresses. Conducting DSE immediately forfeits Regulation S protection across the entire offering.",
                "Furthermore, to prevent fraudulent 'flowback' schemes—where issuers nominally sell cheap unregistered shares to foreign shell entities that immediately dump them back onto U.S. retail investors—Regulation S establishes three regulatory categories with mandatory Distribution Compliance Periods (DCP). For Category 3 equity offerings of U.S. reporting issuers, equity securities cannot be resold to U.S. persons for one full year, require purchaser certifications, and are classified as restricted securities subject to Rule 144 upon return to the U.S."
            ],
            "example": "A Delaware corporation issues $100 million in convertible Eurobonds to Swiss and Japanese pension funds in Zurich. Because the offering takes place entirely offshore with no marketing in the U.S., it qualifies under Regulation S Category 3. The bonds carry a 1-year distribution compliance period barring resale to U.S. persons.",
            "code": """# Simulation: Regulation S Offshore Offering & Flowback Protection Engine
from typing import Dict, List

def evaluate_reg_s_compliance(
    offering_id: str,
    buyer_physical_location_at_order: str, # 'OFFSHORE_JURISDICTION', 'INSIDE_UNITED_STATES'
    executed_on_foreign_exchange: bool,
    conducted_directed_selling_efforts_in_us: bool,
    issuer_category: str, # 'CATEGORY_1_FOREIGN', 'CATEGORY_2_REPORTING', 'CATEGORY_3_US_EQUITY'
    days_since_offshore_closing: int,
    proposed_resale_to_us_person: bool
) -> dict:
    # 1. Condition One: Offshore Transaction
    is_offshore_transaction = (
        buyer_physical_location_at_order == 'OFFSHORE_JURISDICTION' or 
        executed_on_foreign_exchange
    )
    
    # 2. Condition Two: Zero Directed Selling Efforts (DSE) in United States
    no_dse = not conducted_directed_selling_efforts_in_us
    
    if not (is_offshore_transaction and no_dse):
        return {
            'offering_id': offering_id,
            'is_compliant_reg_s': False,
            'status': 'REGULATION_S_BREACHED_TERRITORIAL_JURISDICTION_INVOKED',
            'reason': 'Failed offshore transaction requirement or tainted by US Directed Selling Efforts.'
        }
        
    # Distribution Compliance Period (DCP) Invariants to prevent Flowback
    dcp_days = 0 if issuer_category == 'CATEGORY_1_FOREIGN' else (40 if issuer_category == 'CATEGORY_2_REPORTING' else 365)
    
    flowback_blocked = False
    if proposed_resale_to_us_person and days_since_offshore_closing < dcp_days:
        flowback_blocked = True
        flowback_status = f"ILLEGAL_FLOWBACK_PROHIBITED_UNDER_DCP ({days_since_offshore_closing}/{dcp_days} days elapsed)"
    else:
        flowback_status = "RESALE_PERMISSIBLE_OR_POST_DCP"
        
    return {
        'offering_id': offering_id,
        'is_compliant_reg_s': True,
        'status': 'VALID_REGULATION_S_OFFSHORE_OFFERING',
        'distribution_compliance_period_days': dcp_days,
        'flowback_blocked': flowback_blocked,
        'flowback_status': flowback_status
    }

# Execute deterministic validation
s1 = evaluate_reg_s_compliance("OFFSHORE-SWISS", "OFFSHORE_JURISDICTION", False, False, "CATEGORY_3_US_EQUITY", 120, True)
s2 = evaluate_reg_s_compliance("OFFSHORE-SWISS-MATURE", "OFFSHORE_JURISDICTION", False, False, "CATEGORY_3_US_EQUITY", 370, True)
s3 = evaluate_reg_s_compliance("OFFSHORE-TAINTED", "OFFSHORE_JURISDICTION", False, True, "CATEGORY_3_US_EQUITY", 30, False)

print(f"Swiss Offering (Day 120): Valid={s1['is_compliant_reg_s']} | Flowback to US: {s1['flowback_status']}")
print(f"Swiss Offering (Day 370): Valid={s2['is_compliant_reg_s']} | Flowback to US: {s2['flowback_status']}")
print(f"Tainted DSE Offering: Valid={s3['is_compliant_reg_s']} | Status: {s3['status']}")
""",
            "output": """Swiss Offering (Day 120): Valid=True | Flowback to US: ILLEGAL_FLOWBACK_PROHIBITED_UNDER_DCP (120/365 days elapsed)
Swiss Offering (Day 370): Valid=True | Flowback to US: RESALE_PERMISSIBLE_OR_POST_DCP
Tainted DSE Offering: Valid=False | Status: REGULATION_S_BREACHED_TERRITORIAL_JURISDICTION_INVOKED
""",
            "codeNotes": [
                {"line": 14, "note": "Validates core Regulation S requirement: offshore transaction execution"},
                {"line": 20, "note": "Directed Selling Efforts (DSE) in the US permanently invalidates Regulation S"},
                {"line": 28, "note": "Enforces 365-day Category 3 Distribution Compliance Period blocking premature flowback"}
            ],
            "tryIt": "Set conducted_directed_selling_efforts_in_us to False in s3 to observe how strictly eliminating US roadshows rescues Regulation S compliance.",
            "check": {
                "question": "Under SEC Regulation S, what are the two core conditions that must ALWAYS be satisfied for an offering to escape Section 5 registration?",
                "options": [
                    "The transaction must be an Offshore Transaction (buyer outside the US or foreign exchange execution) and there must be NO Directed Selling Efforts in the United States.",
                    "The offering must be denominated in Japanese Yen and certified by the Swiss National Bank.",
                    "The issuer must physically destroy all corporate laptops located in America.",
                    "The securities must be shipped exclusively via ocean cargo freighters."
                ],
                "answer": 0,
                "why": "Rules 901 and 903 mandate that every Regulation S offering must be an offshore transaction with zero directed selling efforts in the United States.",
                "answerIndex": 0,
                "explanation": "Rules 901 and 903 mandate that every Regulation S offering must be an offshore transaction with zero directed selling efforts in the United States."
            }
        }
    ],
    "summary": [
        "Ralston Purina Private Placement Jurisprudence: Section 4(a)(2) exempts offerings where all offerees are sophisticated and possess information access equivalent to registration; a single unsophisticated offeree destroys the statutory exemption.",
        "Regulation D Safe Harbor Spectrum: Rule 504 allows up to $10M; Rule 506(b) permits unlimited capital from accredited investors and up to 35 sophisticated non-accredited investors without general solicitation; Rule 506(c) allows general advertising with mandatory accredited verification.",
        "Rule 501 Accredited Verification: Enforces $200k individual / $300k joint income and $1M net worth strictly excluding primary residence equity under Dodd-Frank, or Series 7/65/82 professional licensing.",
        "Rule 144 Resale Mechanics: Enforces 6-month or 12-month holding periods; non-affiliates gain unrestricted public liquidity after 1 year, while affiliates remain permanently subject to volume caps and Form 144 filings.",
        "Regulation S Cross-Border Discipline: Exempts foreign offerings meeting offshore transaction criteria with zero US directed selling efforts, enforcing strict Distribution Compliance Periods to prevent illegal US flowback."
    ],
    "projectStep": {
        "title": "Corporate Law Milestone 3 Step 2: Private Placement Syndicate & Regulation D/S Compliance Architecture",
        "steps": [
            "Structure an institutional Section 4(a)(2) private placement data room satisfying Ralston Purina information access invariants.",
            "Formulate a Regulation D Rule 506(b) vs 506(c) capital formation matrix and implement third-party accredited verification workflows.",
            "Execute Dodd-Frank primary residence net worth audits and prepare SEC Form D EDGAR filing packages.",
            "Model Rule 144 restricted stock legend removal opinions and design Regulation S offshore offering distribution compliance controls."
        ]
    }
}

if __name__ == "__main__":
    total = ensure_law_day_budget(DAY_12)
    print(f"B.Com Corporate Law Day 12 Total Words: {total}")
    for i, p in enumerate(DAY_12['parts']):
        print(f"  Part {i+1} words: {count_words(p['say'])}")
