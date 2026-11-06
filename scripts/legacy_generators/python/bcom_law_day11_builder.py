"""
Course 29: B.Com Corporate & Commercial Law, Contracts & Governance (bcom_law)
Day 11 Builder: Securities Act of 1933: The Howey Test & Section 5 Gun-Jumping Invariants
Milestone 3 Kickoff: Securities Regulation, Capital Markets & Public Offerings
Guarantees >= 580 words per part and >= 2,950 words total with deterministic Python simulations.
"""

from corporate_law_budget_ensurer import ensure_law_day_budget
from visual_builder import count_words

DAY_11 = {
    "coursePrefix": "bcom_law",
    "day": 11,
    "title": "Securities Act of 1933: The Howey Test, Section 5 Registration & Gun-Jumping Invariants",
    "goal": "Master federal securities jurisprudence under the Securities Act of 1933: dissect the Howey Test four-prong investment contract doctrine, navigate the Section 5 registration timeline (pre-filing, waiting, post-effective periods), enforce gun-jumping restrictions and safe harbors, evaluate statutory exemptions, and model Section 11/12(a)(2) strict civil liability.",
    "minutes": 45,
    "recap": "In Milestone 2 (Days 6–10), we mastered patent law, trademark protection, trade secrets under DTSA, copyright and open-source licensing, and technology licensing capstones. Today we launch Milestone 3: Securities Regulation, Capital Markets, Underwriting, and Securities Litigation Defense.",
    "parts": [
        {
            "title": "The Statutory Definition of a Security & The Howey Investment Contract Doctrine",
            "say": [
                "Federal securities regulation originates from the fundamental imperative to restore investor confidence following the catastrophic stock market crash of 1929 and the Great Depression. The Securities Act of 1933 (the '33 Act') was enacted based on a philosophy of full and fair disclosure, requiring that investors receive financial and other significant information concerning securities being offered for public sale, while prohibiting deceit, misrepresentations, and fraud. However, the jurisdictional threshold of federal securities law hinges entirely on a single existential question: Is the instrument or financial arrangement a 'security'?",
                "Section 2(a)(1) of the 1933 Act defines 'security' through an expansive catalogue of conventional instruments—including stocks, bonds, debentures, notes, and collateral trust certificates—but crucially extends its reach to any 'investment contract'. In the seminal decision SEC v. W.J. Howey Co. (1946), the Supreme Court articulated the definitive four-prong test that governs modern capital markets: an investment contract exists when there is (1) an investment of money, (2) in a common enterprise, (3) with a reasonable expectation of profits, (4) derived solely from the entrepreneurial or managerial efforts of others.",
                "Under the first prong, an 'investment of money' is not restricted to fiat currency; it encompasses any commitment of capital, goods, services, or cryptocurrency tokens where the purchaser parts with tangible value. Under the second prong, courts examine commonality, either as 'horizontal commonality' (pooling of investor assets with pro-rata distribution of profits) or 'vertical commonality' (investor fortunes linked directly to the promoter's efforts or compensation). The third prong requires that profits be expected in the form of dividends, periodic distributions, or capital appreciation, rather than mere consumer utility.",
                "The fourth prong—profits derived 'solely' from the efforts of others—has been interpreted flexibly by appellate courts to mean 'predominantly' or 'substantially'. If the promoters, sponsors, or third-party managers retain essential managerial control over operations, product development, or asset appreciation while investors remain passive capital providers, the arrangement is legally an investment contract. The Supreme Court has repeatedly stressed that form must be disregarded for substance, and legal analysis must focus upon the economic reality of the transaction.",
                "In contemporary digital asset commerce, decentralized finance (DeFi), tokenized real estate, and revenue-sharing partnerships, the Howey doctrine remains the primary enforcement weapon of the Securities and Exchange Commission (SEC). When promoters issue utility tokens or participation interests without filing a registration statement, the SEC initiates enforcement actions alleging unregistered securities offerings. Corporate counsel must rigorously analyze every novel fundraising structure against Howey to prevent fatal regulatory enforcement actions."
            ],
            "example": "In SEC v. Howey, a Florida company sold citrus grove land contracts paired with optional service contracts to harvest and market the oranges. The Supreme Court held that despite the nominal sale of real estate, the transaction constituted an investment contract because purchasers were remote investors expecting profits solely from the company's agricultural management. Similarly, selling crypto tokens whose value depends on the issuer building an ecosystem constitutes an investment contract.",
            "code": """# Simulation: Howey Test Investment Contract Regulatory Classification Engine
from typing import Dict, List

def evaluate_howey_test(
    instrument_id: str,
    instrument_name: str,
    investment_of_tangible_value: bool,
    value_type: str, # 'FIAT', 'CRYPTO', 'SERVICES', 'NONE'
    horizontal_pooling_present: bool,
    promoter_vertical_linkage: bool,
    expectation_of_financial_profits: bool,
    profit_source: str, # 'DIVIDENDS_OR_APPRECIATION', 'CONSUMER_CONSUMPTION'
    managerial_efforts_substantially_others: bool,
    investor_control_percentage: float
) -> dict:
    # 1. Investment of Money / Value
    prong1 = investment_of_tangible_value and value_type != 'NONE'
    
    # 2. Common Enterprise (Horizontal or Vertical)
    prong2 = horizontal_pooling_present or promoter_vertical_linkage
    
    # 3. Expectation of Profits
    prong3 = expectation_of_financial_profits and profit_source == 'DIVIDENDS_OR_APPRECIATION'
    
    # 4. Derived from Managerial Efforts of Others (Passive investors)
    prong4 = managerial_efforts_substantially_others and investor_control_percentage < 25.0
    
    is_investment_contract = prong1 and prong2 and prong3 and prong4
    
    if is_investment_contract:
        classification = "STATUTORY_SECURITY_HOWEY_INVESTMENT_CONTRACT"
        regulatory_impact = "Subject to mandatory Section 5 registration or valid statutory exemption."
        sec_jurisdiction = True
    else:
        classification = "NON_SECURITY_COMMERCIAL_OR_UTILITY_ARRANGEMENT"
        regulatory_impact = "Outside SEC Title 15 jurisdiction; governed by commercial contract/UCC law."
        sec_jurisdiction = False
        
    return {
        'instrument_id': instrument_id,
        'instrument_name': instrument_name,
        'prongs': {
            'prong1_investment_of_value': prong1,
            'prong2_common_enterprise': prong2,
            'prong3_expectation_of_profits': prong3,
            'prong4_efforts_of_others': prong4
        },
        'is_investment_contract': is_investment_contract,
        'classification': classification,
        'regulatory_impact': regulatory_impact,
        'sec_jurisdiction': sec_jurisdiction
    }

# Execute deterministic validation
c1 = evaluate_howey_test(
    "INST-01", "Solana Staking Yield Note", True, "CRYPTO", True, True, True, "DIVIDENDS_OR_APPRECIATION", True, 0.0
)
c2 = evaluate_howey_test(
    "INST-02", "Decentralized File Storage Gas Token", True, "FIAT", False, False, False, "CONSUMER_CONSUMPTION", False, 100.0
)
print(f"[{c1['instrument_name']}] -> {c1['classification']} (SEC Jurisdiction: {c1['sec_jurisdiction']})")
print(f"[{c2['instrument_name']}] -> {c2['classification']} (SEC Jurisdiction: {c2['sec_jurisdiction']})")
""",
            "output": """[Solana Staking Yield Note] -> STATUTORY_SECURITY_HOWEY_INVESTMENT_CONTRACT (SEC Jurisdiction: True)
[Decentralized File Storage Gas Token] -> NON_SECURITY_COMMERCIAL_OR_UTILITY_ARRANGEMENT (SEC Jurisdiction: False)
""",
            "codeNotes": [
                {"line": 20, "note": "Validates four prongs of the landmark SEC v. Howey investment contract doctrine"},
                {"line": 28, "note": "Requires passive investor status where promoter supplies essential managerial efforts"},
                {"line": 40, "note": "Triggers federal SEC Section 5 registration mandate if all four prongs are satisfied"}
            ],
            "tryIt": "Set expectation_of_financial_profits to False and profit_source to 'CONSUMER_CONSUMPTION' in INST-01 to test how purely consumptive utility escapes Howey classification.",
            "check": {
                "question": "Under the Supreme Court's Howey doctrine, which of the following elements is REQUIRED to classify an innovative commercial transaction as an investment contract security?",
                "options": [
                    "An investment of money or tangible value in a common enterprise with an expectation of profits derived predominantly from the managerial efforts of others.",
                    "A formal issuance of physical paper stock certificates signed by the corporate president.",
                    "An explicit guarantee that the investor will never suffer a loss of principal.",
                    "A mandatory registration filing with the World Trade Organization."
                ],
                "answer": 0,
                "why": "Howey establishes a flexible four-prong economic reality test: investment of money/value, common enterprise, profit expectation, and reliance on the managerial efforts of promoters or third parties.",
                "answerIndex": 0,
                "explanation": "Howey establishes a flexible four-prong economic reality test: investment of money/value, common enterprise, profit expectation, and reliance on the managerial efforts of promoters or third parties."
            }
        },
        {
            "title": "The Section 5 Registration Timeline: Pre-Filing, Waiting & Post-Effective Invariants",
            "say": [
                "Section 5 of the Securities Act of 1933 represents the central operational axis of federal capital markets. It establishes a strict, threefold procedural prohibition: Section 5(a) prohibits the sale of securities unless a registration statement is in effect; Section 5(b)(1) prohibits the transmission of any prospectus relating to a security unless it meets the statutory requirements of Section 10; and Section 5(c) prohibits any offer to sell or offer to buy prior to the filing of a registration statement.",
                "To navigate these statutory commands, securities lawyers partition every public offering into three distinct temporal periods: (1) The Pre-Filing Period, (2) The Waiting Period, and (3) The Post-Effective Period. Each period imposes rigorous behavioral rules upon issuers, directors, underwriters, and selling syndicate brokers.",
                "The Pre-Filing Period begins the moment an issuer reaches an understanding with an underwriter to execute a public offering, and extends until the registration statement (typically Form S-1) is formally filed on the SEC EDGAR system. During this period, Section 5(c) strictly bans any offers to sell or buy securities. The definition of 'offer' is interpreted broadly by the SEC to include any public publicity, press releases, or speeches that have the effect of 'conditioning the market' or arousing public interest in the upcoming stock offering—a violation known as 'gun-jumping'.",
                "The Waiting Period begins the moment the registration statement is filed with the SEC and lasts until the SEC declares the statement effective. During the waiting period, oral offers to sell are legally permitted, allowing underwriters to conduct 'roadshows' and build an institutional book of orders. However, no written offers may be delivered unless they take the form of a preliminary statutory prospectus ('red herring') complying with Section 10(b), or qualify as a compliant Free Writing Prospectus (FWP) under SEC Rules 164 and 433. Crucially, no contracts of sale can be finalized during the waiting period; underwriters may only solicit non-binding indications of interest.",
                "The Post-Effective Period commences once the SEC Division of Corporation Finance declares the registration statement effective. At this juncture, contracts of sale may be legally closed, securities can be delivered, and confirmation of purchase can be dispatched. Under Section 5(b)(2), every sale must be accompanied or preceded by a final statutory prospectus meeting the comprehensive disclosure requirements of Section 10(a). Violating any of these Section 5 timeline invariants grants investors a statutory rescission right under Section 12(a)(1)."
            ],
            "example": "If a CEO announces on television, 'We are launching our groundbreaking IPO in three months and our revenue will explode 500%,' before filing Form S-1, this constitutes illegal gun-jumping in the pre-filing period. The SEC can impose a 'cooling-off period,' delaying the offering by months and forcing the company to disclose the premature statement as a risk factor in its prospectus.",
            "code": """# Simulation: Section 5 Offering Timeline & Permissible Communications Evaluator
from typing import Dict, List

def evaluate_section_5_compliance(
    period: str, # 'PRE_FILING', 'WAITING', 'POST_EFFECTIVE'
    communication_type: str, # 'ORAL_ROADSHOW', 'WRITTEN_PRESS_RELEASE', 'STATUTORY_RED_HERRING', 'FINAL_PROSPECTUS', 'CONTRACT_OF_SALE'
    is_wksi_issuer: bool, # Well-Known Seasoned Issuer (Rule 163 relief)
    qualifies_rule_163a_safe_harbor: bool, # 30+ days prior to filing, no mention of offering
    contains_statutory_legend: bool
) -> dict:
    violation = False
    statutory_breach = "NONE"
    remedy_risk = "NONE"
    
    if period == 'PRE_FILING':
        if communication_type == 'CONTRACT_OF_SALE':
            violation = True
            statutory_breach = "SECTION_5_A_ILLEGAL_PRE_FILING_SALE"
            remedy_risk = "STRICT_SECTION_12_A_1_RESCISSION_LIABILITY"
        elif communication_type in ['ORAL_ROADSHOW', 'WRITTEN_PRESS_RELEASE']:
            if is_wksi_issuer:
                statutory_breach = "PERMISSIBLE_WKSI_RULE_163_COMMUNICATION"
            elif qualifies_rule_163a_safe_harbor:
                statutory_breach = "PERMISSIBLE_RULE_163A_30_DAY_COMMUNICATION"
            else:
                violation = True
                statutory_breach = "SECTION_5_C_GUN_JUMPING_ILLEGAL_PRE_FILING_OFFER"
                remedy_risk = "MANDATORY_SEC_COOLING_OFF_PERIOD_AND_DELAY"
                
    elif period == 'WAITING':
        if communication_type == 'CONTRACT_OF_SALE':
            violation = True
            statutory_breach = "SECTION_5_A_PREMATURE_SALE_BEFORE_EFFECTIVENESS"
            remedy_risk = "STRICT_SECTION_12_A_1_RESCISSION_LIABILITY"
        elif communication_type == 'WRITTEN_PRESS_RELEASE' and not contains_statutory_legend:
            violation = True
            statutory_breach = "SECTION_5_B_1_NON_COMPLIANT_WRITTEN_PROSPECTUS"
            remedy_risk = "INJUNCTION_AND_OFFERING_SUSPENSION"
        elif communication_type in ['ORAL_ROADSHOW', 'STATUTORY_RED_HERRING']:
            statutory_breach = "PERMISSIBLE_WAITING_PERIOD_OFFER_NO_SALE"
            
    elif period == 'POST_EFFECTIVE':
        if communication_type == 'CONTRACT_OF_SALE':
            statutory_breach = "PERMISSIBLE_POST_EFFECTIVE_SALE"
        elif communication_type == 'FINAL_PROSPECTUS':
            statutory_breach = "COMPLIANT_SECTION_10_A_DELIVERY"
            
    return {
        'period': period,
        'communication_type': communication_type,
        'is_compliant': not violation,
        'statutory_breach': statutory_breach,
        'remedy_risk': remedy_risk
    }

# Execute deterministic validation
t1 = evaluate_section_5_compliance('PRE_FILING', 'WRITTEN_PRESS_RELEASE', False, False, False)
t2 = evaluate_section_5_compliance('WAITING', 'ORAL_ROADSHOW', False, False, False)
t3 = evaluate_section_5_compliance('POST_EFFECTIVE', 'CONTRACT_OF_SALE', False, False, True)

print(f"Pre-Filing Press Release: Compliant={t1['is_compliant']} | Breach: {t1['statutory_breach']}")
print(f"Waiting Period Roadshow: Compliant={t2['is_compliant']} | Status: {t2['statutory_breach']}")
print(f"Post-Effective Sale: Compliant={t3['is_compliant']} | Status: {t3['statutory_breach']}")
""",
            "output": """Pre-Filing Press Release: Compliant=False | Breach: SECTION_5_C_GUN_JUMPING_ILLEGAL_PRE_FILING_OFFER
Waiting Period Roadshow: Compliant=True | Status: PERMISSIBLE_WAITING_PERIOD_OFFER_NO_SALE
Post-Effective Sale: Compliant=True | Status: PERMISSIBLE_POST_EFFECTIVE_SALE
""",
            "codeNotes": [
                {"line": 13, "note": "Implements Section 5(c) absolute ban on pre-filing offers and conditioning the market"},
                {"line": 28, "note": "Allows oral roadshow offers during waiting period but forbids sales contracts"},
                {"line": 39, "note": "Validates post-effective closing of contracts of sale with Section 10(a) prospectus"}
            ],
            "tryIt": "Set qualifies_rule_163a_safe_harbor to True in t1 to verify how releases made >30 days before filing without offering reference escape Section 5(c) gun-jumping.",
            "check": {
                "question": "During the 'Waiting Period' (after Form S-1 is filed but before SEC effectiveness), which of the following activities is legally permissible under Section 5?",
                "options": [
                    "Conducting oral institutional roadshows and distributing preliminary red herring prospectuses to solicit non-binding indications of interest.",
                    "Executing binding purchase contracts and collecting investor subscription funds into an escrow account.",
                    "Issuing unregistered written guarantees promising a minimum 20% dividend yield.",
                    "Delivering final stock certificates without providing any disclosure document."
                ],
                "answer": 0,
                "why": "Section 5 permits oral offers and preliminary statutory prospectuses during the waiting period, but strictly prohibits entering into binding sales contracts before the registration statement is declared effective.",
                "answerIndex": 0,
                "explanation": "Section 5 permits oral offers and preliminary statutory prospectuses during the waiting period, but strictly prohibits entering into binding sales contracts before the registration statement is declared effective."
            }
        },
        {
            "title": "Gun-Jumping Invariants & Statutory Communication Safe Harbors (Rules 163A, 168 & 169)",
            "say": [
                "Gun-jumping doctrine reflects the SEC's deep suspicion of publicity campaigns orchestrated immediately prior to an IPO to artificially inflate investor appetite. Under Section 2(a)(3), the term 'offer' includes every attempt or offer to dispose of, or solicitation of an offer to buy, a security or interest in a security, for value. The Supreme Court and the SEC have established that whenever an issuer engages in publicity that conditions the public mind or creates a receptive atmosphere for an offering, an illegal 'offer' has occurred under Section 5(c).",
                "However, an enterprise in active commercial operations cannot freeze all customer communications, marketing campaigns, or financial reports simply because it contemplates a future public offering. To eliminate commercial paralysis and establish legal certainty, the SEC adopted a modernized architecture of statutory safe harbors under the Securities Offering Reform rules.",
                "Rule 163A provides a bright-line safe harbor for communications made by or on behalf of an issuer more than 30 days prior to filing a registration statement. Under Rule 163A, communications that do not reference a securities offering are deemed not to constitute an offer under Section 5(c), provided the issuer takes reasonable steps to prevent further distribution of the communication during the 30-day window preceding filing.",
                "For ongoing commercial activities, Rule 168 and Rule 169 provide permanent safe harbors for factual business communications. Rule 168 protects reporting issuers that regularly release factual business information and forward-looking financial information in the ordinary course of business, consistent with past practice. Rule 169 provides a parallel safe harbor for non-reporting (private) companies preparing for an IPO, protecting regularly released factual business information intended for customers, suppliers, and business counterparties, but strictly excluding forward-looking statements or investor-targeted communications.",
                "Finally, for the largest public corporations—designated as Well-Known Seasoned Issuers (WKSIs) having at least $700 million in public common equity float—Rule 163 grants sweeping relief. WKSIs are completely exempt from Section 5(c) pre-filing gun-jumping restrictions, allowing them to make oral and written offers at any time through compliant Free Writing Prospectuses. For standard corporate issuers, however, strict adherence to Rules 163A, 168, and 169 is mandatory to avoid catastrophic SEC delays."
            ],
            "example": "A SaaS enterprise preparing an IPO issues its standard monthly software patch notes and customer case studies 15 days before filing S-1. Under Rule 169, this factual business information is fully protected because it was released in the ordinary course to customers. But if the SaaS company published a blog post stating 'Our upcoming IPO will make investors rich,' Rule 169 is immediately forfeited, triggering a gun-jumping violation.",
            "code": """# Simulation: Gun-Jumping Invariant & SEC Safe Harbor Verification Matrix
from typing import Dict, List

def evaluate_gun_jumping_safe_harbor(
    communication_id: str,
    days_prior_to_filing: int,
    mentions_securities_offering: bool,
    target_audience: str, # 'CUSTOMERS_SUPPLIERS', 'GENERAL_PUBLIC_INVESTORS'
    is_factual_business_info: bool,
    is_forward_looking_projection: bool,
    released_in_ordinary_course_past_practice: bool,
    is_reporting_company: bool
) -> dict:
    # Rule 163A: 30-day bright-line exemption
    if days_prior_to_filing > 30 and not mentions_securities_offering:
        return {
            'communication_id': communication_id,
            'qualifies_safe_harbor': True,
            'governing_rule': 'SEC_RULE_163A_30_DAY_BRIGHT_LINE',
            'status': 'CLEARED_NO_GUN_JUMPING',
            'rationale': 'Communication released >30 days before filing without offering reference.'
        }
        
    # Rule 168: Reporting issuer ordinary course factual & forward-looking info
    if is_reporting_company and released_in_ordinary_course_past_practice and not mentions_securities_offering:
        return {
            'communication_id': communication_id,
            'qualifies_safe_harbor': True,
            'governing_rule': 'SEC_RULE_168_REPORTING_ISSUER_ORDINARY_COURSE',
            'status': 'CLEARED_NO_GUN_JUMPING',
            'rationale': 'Ordinary course factual/forward-looking communication by reporting issuer.'
        }
        
    # Rule 169: Non-reporting issuer factual business info for customers
    if (not is_reporting_company and 
        is_factual_business_info and 
        not is_forward_looking_projection and 
        target_audience == 'CUSTOMERS_SUPPLIERS' and 
        released_in_ordinary_course_past_practice and 
        not mentions_securities_offering):
        return {
            'communication_id': communication_id,
            'qualifies_safe_harbor': True,
            'governing_rule': 'SEC_RULE_169_NON_REPORTING_CUSTOMER_FACTUAL_INFO',
            'status': 'CLEARED_NO_GUN_JUMPING',
            'rationale': 'Factual business communication to customers consistent with past practice.'
        }
        
    # Gun-jumping violation
    return {
        'communication_id': communication_id,
        'qualifies_safe_harbor': False,
        'governing_rule': 'NONE_SAFE_HARBOR_BREACHED',
        'status': 'ILLEGAL_GUN_JUMPING_SECTION_5_C',
        'rationale': 'Conditions market prior to registration without meeting Rule 163A, 168, or 169 criteria.'
    }

# Execute deterministic validation
g1 = evaluate_gun_jumping_safe_harbor(
    "COMM-01", 45, False, "GENERAL_PUBLIC_INVESTORS", True, False, True, False
)
g2 = evaluate_gun_jumping_stage = evaluate_gun_jumping_safe_harbor(
    "COMM-02", 12, False, "CUSTOMERS_SUPPLIERS", True, False, True, False
)
g3 = evaluate_gun_jumping_safe_harbor(
    "COMM-03", 10, True, "GENERAL_PUBLIC_INVESTORS", False, True, False, False
)

print(f"[{g1['communication_id']}] -> {g1['status']} via {g1['governing_rule']}")
print(f"[{g2['communication_id']}] -> {g2['status']} via {g2['governing_rule']}")
print(f"[{g3['communication_id']}] -> {g3['status']} via {g3['governing_rule']}")
""",
            "output": """[COMM-01] -> CLEARED_NO_GUN_JUMPING via SEC_RULE_163A_30_DAY_BRIGHT_LINE
[COMM-02] -> CLEARED_NO_GUN_JUMPING via SEC_RULE_169_NON_REPORTING_CUSTOMER_FACTUAL_INFO
[COMM-03] -> ILLEGAL_GUN_JUMPING_SECTION_5_C via NONE_SAFE_HARBOR_BREACHED
""",
            "codeNotes": [
                {"line": 13, "note": "Evaluates Rule 163A 30-day pre-filing bright-line safe harbor"},
                {"line": 23, "note": "Evaluates Rule 168 regular release of business information for reporting companies"},
                {"line": 33, "note": "Enforces Rule 169 customer-directed factual information restrictions for private IPO issuers"}
            ],
            "tryIt": "Set mentions_securities_offering to False and is_forward_looking_projection to False in COMM-03 to see how removing promotional forward guidance restores compliance.",
            "check": {
                "question": "Under SEC Rule 169, what condition MUST be met for a pre-IPO private company to safely release factual business communications without violating Section 5 gun-jumping rules?",
                "options": [
                    "The communication must be factual business information intended for customers and suppliers, released in the ordinary course of business, without referencing the securities offering.",
                    "The company must purchase a full-page advertisement in the Wall Street Journal disclosing executive salaries.",
                    "The CEO must swear an oath before the SEC Commissioners in Washington D.C.",
                    "The communication must contain speculative 5-year revenue forecasts."
                ],
                "answer": 0,
                "why": "Rule 169 protects ordinary-course factual business information directed to customers and commercial counterparties, provided it does not mention the offering or include forward-looking projections.",
                "answerIndex": 0,
                "explanation": "Rule 169 protects ordinary-course factual business information directed to customers and commercial counterparties, provided it does not mention the offering or include forward-looking projections."
            }
        },
        {
            "title": "Exempted Securities (Section 3) vs. Exempted Transactions (Section 4)",
            "say": [
                "The expansive mandate of Section 5—requiring every offer and sale of a security to be registered—is subject to two profound statutory gateways: Exempted Securities under Section 3 and Exempted Transactions under Section 4. Understanding the fundamental jurisprudential boundary between an exempted security and an exempted transaction is paramount for corporate structuring.",
                "Section 3 exempts specific classes of securities based on the inherent nature or sovereign identity of the issuer. Under Section 3(a)(2), government securities issued by the United States Treasury, state municipalities, or public agencies are permanently exempt from registration. Similarly, bank-issued securities, short-term commercial paper with maturities under nine months issued for operational liquidity (Section 3(a)(3)), and securities issued by non-profit religious or charitable institutions (Section 3(a)(4)) qualify as exempt securities. Crucially, an exempt security retains its exemption forever; it can be bought, sold, and traded in secondary markets without ever requiring Section 5 registration.",
                "In stark contrast, Section 4 exempts specific transactions, not the underlying security itself. Section 4(a)(1) exempts 'transactions by any person other than an issuer, underwriter, or dealer'—the vital statutory engine that permits ordinary retail investors to trade shares on the New York Stock Exchange or Nasdaq without filing a registration statement. Section 4(a)(2) exempts 'transactions by an issuer not involving any public offering'—the foundation of the multi-trillion-dollar private placement market.",
                "Because a Section 4 exemption applies only to the specific transaction, the securities issued in an exempt transaction are classified as 'restricted securities'. A venture capital fund or private investor purchasing shares under Section 4(a)(2) cannot immediately resell those shares into the public secondary market; any subsequent resale represents a new transaction that must either be registered under Section 5 or independently qualify for an exemption, such as SEC Rule 144.",
                "If an issuer or investor improperly resells restricted securities into the public market without an available transaction exemption, they become an statutory underwriter under Section 2(a)(11), destroying the Section 4(a)(1) exemption and triggering strict liability for illegal unregistered distribution under Section 12(a)(1)."
            ],
            "example": "A municipal bond issued by the City of Chicago is an exempted security under Section 3(a)(2); it can be bought and resold infinitely without SEC registration. Conversely, equity shares sold by a tech startup to angel investors under Section 4(a)(2) represent an exempted transaction; the shares are restricted, and reselling them the next day on Twitter constitutes an illegal public distribution.",
            "code": """# Simulation: Statutory Exemption Classifier & Resale Restriction Analyzer
from typing import Dict, List

def classify_securities_exemption(
    instrument_id: str,
    issuer_type: str, # 'US_TREASURY_MUNICIPALITY', 'COMMERCIAL_BANK', 'NON_PROFIT_CHARITY', 'PRIVATE_CORPORATION'
    commercial_paper_maturity_days: int,
    is_transaction_private_placement: bool,
    buyer_is_retail_public: bool,
    resale_holding_period_days: int
) -> dict:
    # Section 3 Exempted Securities (Perpetual exemption attaches to instrument)
    if issuer_type in ['US_TREASURY_MUNICIPALITY', 'COMMERCIAL_BANK', 'NON_PROFIT_CHARITY']:
        return {
            'instrument_id': instrument_id,
            'exemption_category': 'SECTION_3_EXEMPTED_SECURITY',
            'statutory_section': 'Securities Act § 3(a)(2) / 3(a)(4)',
            'resale_restriction': 'FREELY_TRADABLE_PERPETUAL_EXEMPTION',
            'holding_period_required_days': 0,
            'can_resell_immediately': True
        }
        
    if commercial_paper_maturity_days > 0 and commercial_paper_maturity_days <= 270:
        return {
            'instrument_id': instrument_id,
            'exemption_category': 'SECTION_3_EXEMPTED_COMMERCIAL_PAPER',
            'statutory_section': 'Securities Act § 3(a)(3)',
            'resale_restriction': 'FREELY_TRADABLE_SHORT_TERM_NOTE',
            'holding_period_required_days': 0,
            'can_resell_immediately': True
        }
        
    # Section 4 Exempted Transactions (Exemption attaches only to specific trade)
    if is_transaction_private_placement and not buyer_is_retail_public:
        can_resell = resale_holding_period_days >= 180 # Rule 144 6-month threshold
        return {
            'instrument_id': instrument_id,
            'exemption_category': 'SECTION_4_EXEMPTED_TRANSACTION',
            'statutory_section': 'Securities Act § 4(a)(2) Private Placement',
            'resale_restriction': 'RESTRICTED_SECURITIES_SUBJECT_TO_RULE_144',
            'holding_period_required_days': 180,
            'can_resell_immediately': can_resell
        }
        
    # No Exemption Available -> Must Register under Section 5
    return {
        'instrument_id': instrument_id,
        'exemption_category': 'NON_EXEMPT_PUBLIC_OFFERING',
        'statutory_section': 'Mandatory Section 5 Registration Statement Form S-1',
        'resale_restriction': 'UNREGISTERED_SALE_STRICTLY_PROHIBITED',
        'holding_period_required_days': 9999,
        'can_resell_immediately': False
    }

# Execute deterministic validation
e1 = classify_securities_exemption("BOND-CHI", "US_TREASURY_MUNICIPALITY", 0, False, True, 0)
e2 = classify_securities_exemption("NOTE-CP90", "PRIVATE_CORPORATION", 90, False, True, 0)
e3 = classify_securities_exemption("SERIES-A-SHR", "PRIVATE_CORPORATION", 0, True, False, 30)

print(f"Municipal Bond: Category={e1['exemption_category']} | Resale: {e1['resale_restriction']}")
print(f"90-Day Commercial Paper: Category={e2['exemption_category']} | Resale: {e2['resale_restriction']}")
print(f"Series A Private Stock: Category={e3['exemption_category']} | Can Resell Day 30: {e3['can_resell_immediately']}")
""",
            "output": """Municipal Bond: Category=SECTION_3_EXEMPTED_SECURITY | Resale: FREELY_TRADABLE_PERPETUAL_EXEMPTION
90-Day Commercial Paper: Category=SECTION_3_EXEMPTED_COMMERCIAL_PAPER | Resale: FREELY_TRADABLE_SHORT_TERM_NOTE
Series A Private Stock: Category=SECTION_4_EXEMPTED_TRANSACTION | Can Resell Day 30: False
""",
            "codeNotes": [
                {"line": 12, "note": "Identifies Section 3 perpetual exempt securities that remain freely tradable forever"},
                {"line": 22, "note": "Validates Section 3(a)(3) short-term prime commercial paper exemption (<=270 days)"},
                {"line": 32, "note": "Enforces Section 4(a)(2) transaction exemption producing restricted securities under Rule 144"}
            ],
            "tryIt": "Set resale_holding_period_days to 185 in e3 to test how satisfying the Rule 144 6-month holding period unlocks secondary market transferability.",
            "check": {
                "question": "What is the critical legal distinction between a Section 3 'exempted security' and a Section 4 'exempted transaction' under the Securities Act of 1933?",
                "options": [
                    "A Section 3 exempted security permanently retains its exempt status and can be freely resold forever, whereas a Section 4 exemption applies only to a specific trade, generating restricted securities that cannot be freely resold without a separate exemption.",
                    "Section 3 applies only to gold and silver commodities, while Section 4 governs real estate.",
                    "Section 3 requires approval by state governors, while Section 4 requires SEC commissioner votes.",
                    "Section 4 grants absolute criminal immunity to corporate executives."
                ],
                "answer": 0,
                "why": "Section 3 exempts the security itself permanently based on issuer status, while Section 4 exempts only the isolated transaction, making the resulting securities restricted under Rule 144.",
                "answerIndex": 0,
                "explanation": "Section 3 exempts the security itself permanently based on issuer status, while Section 4 exempts only the isolated transaction, making the resulting securities restricted under Rule 144."
            }
        },
        {
            "title": "Civil Liability for Registration Deficiencies: Section 11 & Section 12(a)(2) Invariants",
            "say": [
                "The core enforcement teeth of the Securities Act of 1933 reside in its civil liability provisions: Section 11 and Section 12(a)(2). These statutes were engineered by Congress to shift the burden of disclosure accuracy entirely onto issuers, corporate directors, certified public accountants, and underwriting investment banks, stripping away the traditional common-law fraud requirements of privity, scienter, and reliance.",
                "Section 11 imposes strict liability for any materially false statement or omission of material fact in a registration statement at the time it becomes effective. An omitted or misstated fact is 'material' if there is a substantial likelihood that a reasonable investor would consider it important in deciding whether to purchase the security. Any investor who acquires a security traceable to the defective registration statement can file a Section 11 action against: (1) the issuer, (2) every director who signed the registration statement, (3) every underwriter, and (4) every certified expert (such as independent auditors certifying financial statements).",
                "For the issuing corporation, liability under Section 11 is absolute; the company has zero defenses other than proving the investor knew of the untruth at purchase, or proving negative causation (loss causation). However, non-issuer defendants—directors, officers, underwriters, and experts—are afforded the statutory 'Due Diligence Defense' under Section 11(b). For expertised portions (e.g., audited financial statements), non-experts must demonstrate they had no reasonable ground to believe the statements were untrue. For non-expertised portions, non-experts must prove that after reasonable investigation, they had reasonable ground to believe and did believe the statements were true.",
                "Section 12(a)(2) complements Section 11 by imposing prospectus liability for material misstatements or omissions made by statutory sellers in any prospectus or oral communication. Unlike Section 11, Section 12(a)(2) does not require the security to be registered, applying to both public offerings and secondary market solicitations. Defendants can escape liability only by meeting the affirmative defense of proving that they did not know, and in the exercise of reasonable care could not have known, of the untruth.",
                "Under Section 11(e), statutory damages are formulaic: the difference between the purchase price (capped at public offering price) and the value at the time the lawsuit is filed. If an underwriting syndicate fails to conduct independent, adversarial due diligence—relying blindly on executive representations—the underwriters face joint and several liability running into hundreds of millions of dollars."
            ],
            "example": "In Escott v. BarChris Construction Corp. (1968), a bowling alley construction firm went bankrupt after filing an S-1 with overstated profits and understated liabilities. The federal court held that outside directors, underwriters, and auditors were jointly liable because their superficial inquiries did not satisfy the reasonable investigation requirement of the Section 11 due diligence defense.",
            "code": """# Simulation: Section 11 & Section 12(a)(2) Statutory Liability & Due Diligence Engine
from typing import Dict, List

def calculate_section_11_damages_exposure(
    defendant_type: str, # 'ISSUER', 'DIRECTOR_OFFICER', 'UNDERWRITER', 'AUDITOR_EXPERT'
    material_untruth_in_registration: bool,
    conducted_reasonable_investigation: bool,
    had_reasonable_belief_in_truth: bool,
    is_expertised_portion: bool,
    offering_price_per_share: float,
    plaintiff_purchase_price: float,
    current_market_price_at_suit: float,
    shares_held_by_class: int
) -> dict:
    # Formulaic damages under Section 11(e)
    effective_purchase_price = min(plaintiff_purchase_price, offering_price_per_share)
    per_share_loss = max(0.0, effective_purchase_price - current_market_price_at_suit)
    total_class_exposure = per_share_loss * shares_held_by_class
    
    # 1. Issuer has absolute strict liability
    if defendant_type == 'ISSUER':
        liable = material_untruth_in_registration
        defense_status = "ZERO_DUE_DILIGENCE_DEFENSE_ABSOLUTE_LIABILITY"
    
    # 2. Non-expert defendants evaluating non-expertised portion
    elif defendant_type in ['DIRECTOR_OFFICER', 'UNDERWRITER'] and not is_expertised_portion:
        if conducted_reasonable_investigation and had_reasonable_belief_in_truth:
            liable = False
            defense_status = "AFFIRMATIVE_DUE_DILIGENCE_DEFENSE_SUSTAINED"
        else:
            liable = True
            defense_status = "DUE_DILIGENCE_DEFENSE_FAILED_SUPERFICIAL_INQUIRY"
            
    # 3. Non-expert defendants evaluating expertised portion (Audited Financials)
    elif defendant_type in ['DIRECTOR_OFFICER', 'UNDERWRITER'] and is_expertised_portion:
        if had_reasonable_belief_in_truth:
            liable = False
            defense_status = "REASONABLE_RELIANCE_ON_CERTIFIED_EXPERT_SUSTAINED"
        else:
            liable = True
            defense_status = "RELIANCE_UNREASONABLE_RED_FLAGS_IGNORED"
            
    # 4. Expert defendants evaluating expertised portion
    elif defendant_type == 'AUDITOR_EXPERT':
        if conducted_reasonable_investigation and had_reasonable_belief_in_truth:
            liable = False
            defense_status = "GAAS_AUDIT_DUE_DILIGENCE_DEFENSE_SUSTAINED"
        else:
            liable = True
            defense_status = "EXPERT_AUDIT_FAILURE_STRICT_LIABILITY"
            
    return {
        'defendant_type': defendant_type,
        'material_untruth': material_untruth_in_registration,
        'is_liable': liable,
        'defense_status': defense_status,
        'per_share_damage': per_share_loss,
        'total_class_exposure': total_class_exposure if liable else 0.0
    }

# Execute deterministic validation
c1 = calculate_section_11_damages_exposure('ISSUER', True, True, True, False, 20.0, 20.0, 8.0, 5000000)
c2 = calculate_section_11_damages_exposure('UNDERWRITER', True, False, True, False, 20.0, 20.0, 8.0, 5000000)
c3 = calculate_section_11_damages_exposure('UNDERWRITER', True, True, True, False, 20.0, 20.0, 8.0, 5000000)

print(f"Issuer: Liable={c1['is_liable']} | Defense: {c1['defense_status']} | Exposure: ${c1['total_class_exposure']/1e6:.1f}M")
print(f"Negligent Underwriter: Liable={c2['is_liable']} | Defense: {c2['defense_status']} | Exposure: ${c2['total_class_exposure']/1e6:.1f}M")
print(f"Diligent Underwriter: Liable={c3['is_liable']} | Defense: {c3['defense_status']} | Exposure: ${c3['total_class_exposure']/1e6:.1f}M")
""",
            "output": """Issuer: Liable=True | Defense: ZERO_DUE_DILIGENCE_DEFENSE_ABSOLUTE_LIABILITY | Exposure: $60.0M
Negligent Underwriter: Liable=True | Defense: DUE_DILIGENCE_DEFENSE_FAILED_SUPERFICIAL_INQUIRY | Exposure: $60.0M
Diligent Underwriter: Liable=False | Defense: AFFIRMATIVE_DUE_DILIGENCE_DEFENSE_SUSTAINED | Exposure: $0.0M
""",
            "codeNotes": [
                {"line": 15, "note": "Computes Section 11(e) statutory loss formula: purchase price less current market price"},
                {"line": 19, "note": "Enforces issuer absolute strict liability with zero due diligence defense"},
                {"line": 24, "note": "Implements Section 11(b) affirmative due diligence defense requiring reasonable investigation"}
            ],
            "tryIt": "Set conducted_reasonable_investigation to True in c2 to observe how documented adversarial due diligence eliminates $60M in underwriter joint liability.",
            "check": {
                "question": "In a class action lawsuit filed under Section 11 of the Securities Act of 1933 for material misstatements in a registration statement, what defense is available to the corporate ISSUER?",
                "options": [
                    "The corporate issuer has NO due diligence defense; issuer liability for material misstatements in an effective registration statement is absolute strict liability.",
                    "The issuer can argue that the CEO was on vacation when the S-1 was filed.",
                    "The issuer can prove that the underwriter was paid a commission.",
                    "The issuer can claim sovereign immunity under Delaware corporate law."
                ],
                "answer": 0,
                "why": "Under Section 11, the issuing corporation is strictly liable for material misstatements or omissions; the due diligence defense of Section 11(b) is available only to non-issuer defendants.",
                "answerIndex": 0,
                "explanation": "Under Section 11, the issuing corporation is strictly liable for material misstatements or omissions; the due diligence defense of Section 11(b) is available only to non-issuer defendants."
            }
        }
    ],
    "summary": [
        "Howey Investment Contract Invariants: Under 35 U.S.C. § 2(a)(1) and SEC v. Howey, any transaction involving an investment of value in a common enterprise with an expectation of profit derived predominantly from others is a statutory security.",
        "Section 5 Offering Timeline: Imposes strict three-phase discipline—banning pre-filing offers (Section 5(c)), allowing only oral roadshows and preliminary red herrings during the waiting period (Section 5(b)(1)), and authorizing sales contracts upon post-effective delivery of the Section 10(a) prospectus.",
        "Gun-Jumping Safe Harbors: SEC Rules 163A (30-day pre-filing bright-line), 168 (reporting issuer regular release), and 169 (private company customer factual info) shield normal commercial operations from gun-jumping violations.",
        "Exempted Securities vs Transactions: Section 3 exempt securities (Treasuries, municipal bonds, short-term commercial paper) remain permanently tradable forever; Section 4 exempt transactions (private placements) produce restricted securities governed by Rule 144 resale rules.",
        "Section 11 Strict Liability: Imposes absolute civil liability on issuers for registration misstatements, while offering a complete Due Diligence affirmative defense to diligent underwriters and directors who conduct reasonable adversarial investigations."
    ],
    "projectStep": {
        "title": "Corporate Law Milestone 3 Step 1: Securities Act Registration & Gun-Jumping Compliance Audit",
        "steps": [
            "Conduct an institutional Howey Test audit on corporate capital fundraising mechanisms and tokenized asset structures.",
            "Formulate an enterprise Section 5 offering calendar establishing strict pre-filing, waiting, and post-effective communication controls.",
            "Implement SEC Rules 163A and 169 factual business communication safe harbor protocols across marketing and public relations teams.",
            "Structure an underwriter Section 11 due diligence audit program to establish an ironclad affirmative defense against registration statement liabilities."
        ]
    }
}

if __name__ == "__main__":
    total = ensure_law_day_budget(DAY_11)
    print(f"B.Com Corporate Law Day 11 Total Words: {total}")
    for i, p in enumerate(DAY_11['parts']):
        print(f"  Part {i+1} words: {count_words(p['say'])}")
