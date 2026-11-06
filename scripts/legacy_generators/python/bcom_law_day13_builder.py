"""
Course 29: B.Com Corporate & Commercial Law, Contracts & Governance (bcom_law)
Day 13 Builder: Public Offerings & Underwriting Law: S-1 Registration, Syndicates & Green Shoe Options
Milestone 3: Securities Regulation, Capital Markets & Public Offerings
Guarantees >= 580 words per part and >= 2,950 words total with deterministic Python simulations.
"""

from corporate_law_budget_ensurer import ensure_law_day_budget
from visual_builder import count_words

DAY_13 = {
    "coursePrefix": "bcom_law",
    "day": 13,
    "title": "Public Offerings & Underwriting Law: S-1 Registration, Syndicates & Green Shoe Options",
    "goal": "Master the legal engineering of Initial Public Offerings (IPOs): dissect Form S-1 prospectus disclosures, analyze underwriting syndicate structures (firm commitment, best efforts, direct listings), draft underwriting agreements (gross spread, MAC clauses, lock-ups, comfort letters), enforce SEC Regulation M market stabilization and Green Shoe over-allotment options, and model the landmark Escott v. BarChris underwriter due diligence defense.",
    "minutes": 45,
    "recap": "In Days 11 and 12, we mastered the 1933 Act registration timeline, gun-jumping rules, civil liabilities, and private placements under Regulation D and Regulation S. Today in Day 13, we transition into the premier corporate event: taking an enterprise public via an S-1 IPO underwriting syndicate.",
    "parts": [
        {
            "title": "Form S-1 Registration Architecture & The SEC Disclosure Review Process",
            "say": [
                "An Initial Public Offering (IPO) transforms a privately held enterprise into a publicly traded corporation whose shares are freely accessible to millions of global market participants. At the heart of this transformation lies SEC Form S-1—the foundational registration statement mandated under Section 5 of the Securities Act of 1933 for issuers that do not yet qualify for short-form registration on Form S-3. Preparing an S-1 is an exhaustive, months-long exercise in corporate disclosure and legal engineering.",
                "Form S-1 is divided into two distinct legal sections: Part I and Part II. Part I constitutes the statutory Prospectus that must be distributed to prospective investors. Under SEC Regulation S-K (non-financial disclosures) and Regulation S-X (financial statement standards), the prospectus must disclose every material aspect of the enterprise: (1) Risk Factors—itemizing critical vulnerabilities ranging from customer concentration to macroeconomic exposure; (2) Use of Proceeds—detailing how offering capital will be deployed; (3) Management's Discussion and Analysis (MD&A)—providing executive analysis of liquidity, capital resources, and operating results; and (4) Executive Compensation and Related Party Transactions.",
                "Part II contains supplemental information that is filed on EDGAR for SEC review but not delivered in the physical prospectus—including itemized offering expenses, indemnification arrangements for directors and officers, recent sales of unregistered securities, and copies of material commercial contracts (e.g., major debt facilities, intellectual property licenses, and executive employment agreements). Sensitive commercial terms in contracts may be redacted pursuant to confidential treatment rules under Item 601 of Regulation S-K.",
                "Once the initial Form S-1 is submitted—often via confidential draft registration under the JOBS Act for Emerging Growth Companies (EGCs)—the SEC Division of Corporation Finance initiates a rigorous, iterative review process. An assigned team of SEC staff attorneys and accounting examiners conducts a deep-dive audit of the filing, looking for disclosure deficiencies, non-GAAP financial measures, or unverified marketing puffery.",
                "Approximately 30 days after submission, the SEC issues a comprehensive 'Comment Letter' containing dozens of detailed inquiries and revision demands. Corporate legal counsel, underwriters' counsel, and independent auditors must formulate formal response letters paired with amended filings (Form S-1/A). Only after all SEC comments are satisfactorily resolved will the SEC declare the registration statement 'effective' under Section 8(a), permitting pricing and public distribution."
            ],
            "example": "If a tech unicorn files an S-1 displaying a proprietary metric called 'Community Adjusted EBITDA' that strips out essential operating lease expenses, the SEC will issue a sharp comment letter demanding the metric be deleted or reconciled to GAAP operating income. The company must file an S-1/A removing the inflated metric before the SEC will declare the offering effective.",
            "code": """# Simulation: Form S-1 Disclosure Audit & SEC Comment Letter Workflow Engine
from typing import Dict, List

def audit_s1_registration_statement(
    filing_id: str,
    has_part1_prospectus: bool,
    has_part2_supplemental_info: bool,
    risk_factors_disclosed: List[str],
    audited_gaap_financial_years: int,
    uses_non_gaap_metrics_without_reconciliation: bool,
    unregistered_securities_disclosed: bool,
    material_contracts_attached: bool,
    redacted_without_confidential_treatment_request: bool
) -> dict:
    sec_comments = []
    
    # 1. Structural Checks
    if not (has_part1_prospectus and has_part2_supplemental_info):
        sec_comments.append("Deficient filing: Missing mandatory Part I Prospectus or Part II Exhibits.")
        
    # 2. Risk Factor Specificity
    if len(risk_factors_disclosed) < 5:
        sec_comments.append("Item 105 Deficiency: Generic risk disclosures; expand entity-specific operational risks.")
        
    # 3. Financial Statements (Regulation S-X)
    if audited_gaap_financial_years < 2:
        sec_comments.append("Regulation S-X Non-Compliance: Minimum 2 years of audited balance sheets required.")
        
    # 4. Non-GAAP Metrics (Regulation G)
    if uses_non_gaap_metrics_without_reconciliation:
        sec_comments.append("Regulation G Violation: Non-GAAP measures displayed with greater prominence or lacking GAAP reconciliation.")
        
    # 5. Exhibit Redaction Integrity (Item 601)
    if redacted_without_confidential_treatment_request:
        sec_comments.append("Item 601 Deficiency: Material contracts redacted without substantiating competitive harm.")
        
    is_ready_for_effectiveness = len(sec_comments) == 0
    status = "EFFECTIVENESS_RECOMMENDED" if is_ready_for_effectiveness else "COMMENT_LETTER_ISSUED_AMENDMENTS_REQUIRED"
    
    return {
        'filing_id': filing_id,
        'is_ready_for_effectiveness': is_ready_for_effectiveness,
        'status': status,
        'sec_comment_count': len(sec_comments),
        'sec_comments': sec_comments
    }

# Execute deterministic validation
audit1 = audit_s1_registration_statement(
    "S1-TECH-CORP", True, True, 
    ["Customer concentration", "Cloud hosting dependency", "Key person loss", "Regulatory tech risks", "Foreign currency exposure"],
    3, False, True, True, False
)
audit2 = audit_s1_registration_statement(
    "S1-DEFICIENT-INC", True, True,
    ["Market competition"],
    1, True, False, True, True
)

print(f"[{audit1['filing_id']}] -> Status: {audit1['status']} | Comments: {audit1['sec_comment_count']}")
print(f"[{audit2['filing_id']}] -> Status: {audit2['status']} | Comments: {audit2['sec_comments']}")
""",
            "output": """[S1-TECH-CORP] -> Status: EFFECTIVENESS_RECOMMENDED | Comments: 0
[S1-DEFICIENT-INC] -> Status: COMMENT_LETTER_ISSUED_AMENDMENTS_REQUIRED | Comments: ['Item 105 Deficiency: Generic risk disclosures; expand entity-specific operational risks.', 'Regulation S-X Non-Compliance: Minimum 2 years of audited balance sheets required.', 'Regulation G Violation: Non-GAAP measures displayed with greater prominence or lacking GAAP reconciliation.', 'Item 601 Deficiency: Material contracts redacted without substantiating competitive harm.']
""",
            "codeNotes": [
                {"line": 14, "note": "Validates mandatory Part I Prospectus and Part II EDGAR supplemental exhibits"},
                {"line": 26, "note": "Enforces Regulation G non-GAAP metric reconciliation to primary GAAP statements"},
                {"line": 30, "note": "Screens Item 601 contract redactions for proper confidential treatment substantiation"}
            ],
            "tryIt": "Fix audited_gaap_financial_years to 2 and uses_non_gaap_metrics_without_reconciliation to False in audit2 to observe how responding to SEC comments moves filing toward effectiveness.",
            "check": {
                "question": "During the SEC Division of Corporation Finance review of Form S-1, what is the legal effect of receiving an SEC Comment Letter?",
                "options": [
                    "The comment letter identifies disclosure deficiencies and legal ambiguities that the issuer must resolve via formal responses and Form S-1/A amendments before the SEC will declare the offering effective.",
                    "The comment letter constitutes a criminal indictment of the corporate board of directors.",
                    "The comment letter immediately forfeits the company's corporate charter.",
                    "The comment letter automatically forces the company to sell its assets at auction."
                ],
                "answer": 0,
                "why": "SEC comment letters are regulatory review tools identifying disclosure defects under Regulations S-K and S-X, requiring iterative S-1/A amendments before effectiveness can be granted.",
                "answerIndex": 0,
                "explanation": "SEC comment letters are regulatory review tools identifying disclosure defects under Regulations S-K and S-X, requiring iterative S-1/A amendments before effectiveness can be granted."
            }
        },
        {
            "title": "Underwriting Syndicates: Firm Commitment vs. Best Efforts vs. Direct Listings",
            "say": [
                "Taking a company public requires an intermediary bridge between the issuing corporation and global institutional investors. That bridge is constructed by investment banking underwriters. The legal rights, financial liabilities, and execution risks of an offering depend upon the contractual underwriting structure selected by the corporate board: (1) Firm Commitment Underwriting, (2) Best Efforts Underwriting, or (3) Direct Floor Listing.",
                "Firm Commitment Underwriting is the gold standard of enterprise public offerings. In a firm commitment agreement, the underwriting syndicate—led by one or more 'Lead Left' bookrunners—contracts to buy the entire offering of shares directly from the issuing corporation at a negotiated discount (the 'gross spread') on the evening of pricing. The underwriters then immediately resell those shares to the public at the public offering price. The legal hallmark of a firm commitment is that the underwriters assume 100% of the market placement risk. If institutional investors reject the stock or the market crashes overnight, the underwriters remain contractually bound to purchase every single share and bear the financial loss.",
                "In contrast, Best Efforts Underwriting provides zero price or volume guarantees. Under a best efforts contract, the investment bank acts purely as an agent or broker, agreeing merely to exercise its 'best efforts' to market and sell as many shares as possible to investors. If the offering is undersubscribed, the underwriters bear zero liability to buy unsold shares. Best efforts offerings are typically structured as 'All-or-None' or 'Part-or-None' (mini-maxi), where investor subscription proceeds must be deposited into a segregated bank escrow account under SEC Rule 15c2-4 until the minimum contingency threshold is satisfied.",
                "Direct Listings represent a disruptive alternative pioneered by modern technology giants (e.g., Spotify, Coinbase). In a direct listing, the corporation files a registration statement under the 1933 Act but engages NO underwriting syndicate! Existing private shareholders and venture capital funds simply sell their shares directly onto the stock exchange floor at a pure market-clearing opening price determined by the exchange designated market maker. While direct listings eliminate millions of dollars in underwriting gross spreads and eliminate shareholder lock-ups, the issuer receives zero underwriting guarantees or institutional roadshow stabilization.",
                "To manage risk in massive firm commitment offerings, lead investment banks organize an 'Underwriting Syndicate' of dozens of regional and global banks governed by an Agreement Among Underwriters (AAU), allocating specific underwriting percentages to share syndicate risk."
            ],
            "example": "In an IPO of 20,000,000 shares at $20.00/share with a 7% gross spread, the firm commitment syndicate pays the company $372,000,000 ($18.60/share) on closing day, retaining $28,000,000 in gross spread. Even if the market plunges to $12.00 at opening bell, the company still receives its full $372M, while the syndicate absorbs the $132M market loss.",
            "code": """# Simulation: Underwriting Syndicate Structure & Financial Risk Allocator
from typing import Dict, List

def model_underwriting_structure(
    structure_type: str, # 'FIRM_COMMITMENT', 'BEST_EFFORTS_ALL_OR_NONE', 'DIRECT_LISTING'
    shares_offered: int,
    public_offering_price: float,
    gross_spread_percentage: float, # e.g. 7.0%
    actual_investor_demand_shares: int,
    all_or_none_minimum_threshold_shares: int
) -> dict:
    total_offering_value = shares_offered * public_offering_price
    
    if structure_type == 'FIRM_COMMITMENT':
        spread_per_share = public_offering_price * (gross_spread_percentage / 100.0)
        net_price_to_issuer_per_share = public_offering_price - spread_per_share
        gross_spread_fees = shares_offered * spread_per_share
        net_capital_to_company = shares_offered * net_price_to_issuer_per_share
        
        # Underwriter risk: if demand < shares, underwriter owns residual inventory
        unsold_inventory = max(0, shares_offered - actual_investor_demand_shares)
        underwriter_inventory_exposure = unsold_inventory * net_price_to_issuer_per_share
        
        return {
            'structure': structure_type,
            'offering_successful': True,
            'net_capital_raised': net_capital_to_company,
            'underwriting_fees_paid': gross_spread_fees,
            'unsold_inventory_shares': unsold_inventory,
            'underwriter_balance_sheet_risk': underwriter_inventory_exposure,
            'company_placement_risk': 0.0
        }
        
    elif structure_type == 'BEST_EFFORTS_ALL_OR_NONE':
        met_threshold = actual_investor_demand_shares >= all_or_none_minimum_threshold_shares
        if met_threshold:
            shares_sold = min(shares_offered, actual_investor_demand_shares)
            gross_fees = shares_sold * public_offering_price * (gross_spread_percentage / 100.0)
            net_capital = (shares_sold * public_offering_price) - gross_fees
            return {
                'structure': structure_type,
                'offering_successful': True,
                'net_capital_raised': net_capital,
                'underwriting_fees_paid': gross_fees,
                'unsold_inventory_shares': 0,
                'underwriter_balance_sheet_risk': 0.0,
                'company_placement_risk': (shares_offered - shares_sold) * public_offering_price
            }
        else:
            return {
                'structure': structure_type,
                'offering_successful': False,
                'net_capital_raised': 0.0,
                'underwriting_fees_paid': 0.0,
                'status': 'OFFERING_CANCELLED_FUNDS_REFUNDED_FROM_ESCROW',
                'company_placement_risk': total_offering_value
            }
            
    elif structure_type == 'DIRECT_LISTING':
        return {
            'structure': structure_type,
            'offering_successful': True,
            'net_capital_raised': 0.0, # Existing shareholders sell, zero primary capital
            'underwriting_fees_paid': 0.0, # Zero underwriter gross spread
            'advisory_fees_only': 5_000_000.0,
            'underwriter_balance_sheet_risk': 0.0,
            'company_placement_risk': 'PURE_MARKET_VOLATILITY'
        }

# Execute deterministic validation
fc = model_underwriting_structure('FIRM_COMMITMENT', 10_000_000, 25.0, 7.0, 7_000_000, 0)
be_fail = model_underwriting_structure('BEST_EFFORTS_ALL_OR_NONE', 10_000_000, 25.0, 5.0, 4_000_000, 6_000_000)
dl = model_underwriting_structure('DIRECT_LISTING', 10_000_000, 25.0, 0.0, 10_000_000, 0)

print(f"Firm Commitment: Raised=${fc['net_capital_raised']/1e6:.1f}M | Underwriter Stuck With: {fc['unsold_inventory_shares']:,} shares (${fc['underwriter_balance_sheet_risk']/1e6:.1f}M risk)")
print(f"Best Efforts (Failed): Status={be_fail['status']} | Capital: ${be_fail['net_capital_raised']}")
print(f"Direct Listing: Underwriting Spread Paid: ${dl['underwriting_fees_paid']}")
""",
            "output": """Firm Commitment: Raised=$232.5M | Underwriter Stuck With: 3,000,000 shares ($69.8M risk)
Best Efforts (Failed): Status=OFFERING_CANCELLED_FUNDS_REFUNDED_FROM_ESCROW | Capital: $0.0
Direct Listing: Underwriting Spread Paid: $0.0
""",
            "codeNotes": [
                {"line": 13, "note": "Computes firm commitment net proceeds guaranteed to issuer regardless of demand"},
                {"line": 19, "note": "Allocates residual unsold inventory risk directly onto underwriter balance sheet"},
                {"line": 32, "note": "Enforces Rule 15c2-4 escrow refund if all-or-none best efforts threshold fails"}
            ],
            "tryIt": "Increase actual_investor_demand_shares to 8_000_000 in be_fail to observe how crossing the minimum threshold successfully closes the best efforts offering.",
            "check": {
                "question": "What is the primary legal and economic distinction between a 'Firm Commitment' underwriting agreement and a 'Best Efforts' underwriting agreement?",
                "options": [
                    "In a firm commitment, the underwriter contractually buys all shares from the issuer and bears 100% of the risk of unsold shares, whereas in best efforts, the underwriter acts as an agent without purchasing unsold shares.",
                    "Firm commitment is illegal under federal securities law.",
                    "Best efforts requires the underwriters to deposit gold bars into the Federal Reserve.",
                    "Firm commitment offerings cannot charge more than $1.00 per share."
                ],
                "answer": 0,
                "why": "Firm commitment underwritings transfer market risk to the investment bank syndicate, which legally purchases the entire issue; best efforts contracts involve no purchase commitment.",
                "answerIndex": 0,
                "explanation": "Firm commitment underwritings transfer market risk to the investment bank syndicate, which legally purchases the entire issue; best efforts contracts involve no purchase commitment."
            }
        },
        {
            "title": "The Underwriting Agreement: Gross Spread, MAC Clauses, Lock-Ups & Comfort Letters",
            "say": [
                "The primary contractual nexus of an IPO is the Underwriting Agreement (UA), executed between the issuing corporation, selling stockholders (if any), and the representatives of the underwriting syndicate. The Underwriting Agreement is signed on the evening of pricing, immediately before the stock commences trading on the exchange. It governs the closing conditions, legal representations, and risk allocations that must be satisfied before funds and shares are exchanged at closing (typically T+1 settlement).",
                "Four critical contractual mechanisms define the Underwriting Agreement: (1) The Gross Spread—the discount between the public offering price and the purchase price paid by underwriters, traditionally 7.0% for mid-cap IPOs, which is divided into a management fee (20%), underwriting fee (20%), and selling concession (60%); (2) The Material Adverse Change (MAC) or 'Market Out' clause; (3) Lock-Up Agreements; and (4) Independent Auditor Comfort Letters.",
                "The Market Out / MAC clause confers a conditional walk-away right upon the underwriters. Under standard MAC provisions, underwriters can terminate their purchase obligation without liability prior to closing if: (a) a material adverse change occurs in the company's financial condition, business, or operational results, (b) trading on major exchanges is suspended, (c) a banking moratorium is declared by federal authorities, or (d) an outbreak of major international armed hostilities or national emergency occurs. Invoking a MAC clause is rare but represents the underwriter's ultimate escape hatch.",
                "Lock-Up Agreements are mandatory contractual undertakings signed by existing executive officers, directors, and major venture capital shareholders prior to the IPO. Standard lock-up agreements strictly prohibit insiders from selling, transferring, pledging, or hedging their existing company shares for a period of 180 days following the IPO pricing date. The legal rationale is twofold: (a) ensuring executive alignment and operational focus post-IPO, and (b) preventing sudden market oversupply that would collapse the public trading price. Underwriters frequently negotiate phased early release triggers tied to stock performance.",
                "Finally, Section 11 due diligence requires delivery of an executed 'Comfort Letter' from the independent public accounting firm. Governed by PCAOB AS 6101 (formerly SAS 72), the comfort letter is delivered twice: first at pricing and updated at closing. It provides negative assurance on unaudited interim financial statements, confirming that nothing came to the auditors' attention indicating any material departure from GAAP or any material post-balance-sheet drop in net revenue or income."
            ],
            "example": "If war erupts and the New York Stock Exchange halts trading for two days after pricing an IPO, underwriters invoke the 'Market Out' clause to cancel the offering without penalty. Conversely, an executive who attempts to sell shares 60 days after the IPO is blocked by the transfer agent because of the 180-day lock-up agreement.",
            "code": """# Simulation: Underwriting Agreement Execution & Closing Condition Validator
from typing import Dict, List

def audit_underwriting_agreement_closing(
    deal_id: str,
    gross_spread_pct: float,
    mac_event_occurred: bool,
    market_trading_suspended: bool,
    all_insiders_executed_180day_lockup: bool,
    comfort_letter_delivered_at_pricing: bool,
    comfort_letter_bring_down_delivered_at_closing: bool,
    unregistered_material_debt_incurred_post_pricing: bool
) -> dict:
    closing_blocked = False
    termination_rights_triggered = []
    
    # 1. Market Out / MAC Clause Triggers
    if mac_event_occurred:
        closing_blocked = True
        termination_rights_triggered.append("UNDERWRITER_TERMINATION_RIGHT_MATERIAL_ADVERSE_CHANGE")
    if market_trading_suspended:
        closing_blocked = True
        termination_rights_triggered.append("UNDERWRITER_TERMINATION_RIGHT_EXCHANGE_MORATORIUM")
        
    # 2. Lock-Up Invariants
    if not all_insiders_executed_180day_lockup:
        closing_blocked = True
        termination_rights_triggered.append("CLOSING_CONDITION_FAILED_INCOMPLETE_INSIDER_LOCKUPS")
        
    # 3. Comfort Letter Requirements (PCAOB AS 6101)
    if not (comfort_letter_delivered_at_pricing and comfort_letter_bring_down_delivered_at_closing):
        closing_blocked = True
        termination_rights_triggered.append("CLOSING_CONDITION_FAILED_MISSING_AUDITOR_COMFORT_LETTER")
        
    # 4. Post-Pricing Representations
    if unregistered_material_debt_incurred_post_pricing:
        closing_blocked = True
        termination_rights_triggered.append("BREACH_OF_REPRESENTATION_UNAUTHORIZED_POST_PRICING_DEBT")
        
    can_close = not closing_blocked
    status = "CLOSING_AUTHORIZED_SETTLEMENT_PROCEEDS_RELEASED" if can_close else "CLOSING_ABORTED_OR_SUSPENDED"
    
    return {
        'deal_id': deal_id,
        'can_close': can_close,
        'status': status,
        'termination_triggers_count': len(termination_rights_triggered),
        'termination_rights_triggered': termination_rights_triggered
    }

# Execute deterministic validation
u1 = audit_underwriting_agreement_closing("DEAL-APEX-01", 7.0, False, False, True, True, True, False)
u2 = audit_underwriting_agreement_closing("DEAL-CRISIS-02", 7.0, True, False, True, True, True, False)
u3 = audit_underwriting_agreement_closing("DEAL-NO-COMFORT-03", 7.0, False, False, True, True, False, False)

print(f"[{u1['deal_id']}] -> Can Close: {u1['can_close']} | Status: {u1['status']}")
print(f"[{u2['deal_id']}] -> Can Close: {u2['can_close']} | Termination: {u2['termination_rights_triggered']}")
print(f"[{u3['deal_id']}] -> Can Close: {u3['can_close']} | Termination: {u3['termination_rights_triggered']}")
""",
            "output": """[DEAL-APEX-01] -> Can Close: True | Status: CLOSING_AUTHORIZED_SETTLEMENT_PROCEEDS_RELEASED
[DEAL-CRISIS-02] -> Can Close: False | Termination: ['UNDERWRITER_TERMINATION_RIGHT_MATERIAL_ADVERSE_CHANGE']
[DEAL-NO-COMFORT-03] -> Can Close: False | Termination: ['CLOSING_CONDITION_FAILED_MISSING_AUDITOR_COMFORT_LETTER']
""",
            "codeNotes": [
                {"line": 15, "note": "Evaluates underwriter Market Out termination rights for MAC and trading suspensions"},
                {"line": 23, "note": "Enforces 100% insider execution of 180-day lock-up agreements prior to closing"},
                {"line": 27, "note": "Validates PCAOB AS 6101 initial and bring-down comfort letters from independent auditors"}
            ],
            "tryIt": "Set comfort_letter_bring_down_delivered_at_closing to True in u3 to observe how delivering the final auditor bring-down letter authorizes closing.",
            "check": {
                "question": "What is the primary function of a 180-day 'Lock-Up Agreement' signed by existing corporate directors, officers, and venture investors in an IPO?",
                "options": [
                    "To contractually prohibit pre-IPO shareholders from selling or pledging their stock into the public market for 180 days following pricing, preventing market oversupply and price collapse.",
                    "To prevent the company from manufacturing any products for six months.",
                    "To force company executives to stay inside the corporate headquarters building.",
                    "To freeze all customer bank accounts."
                ],
                "answer": 0,
                "why": "Lock-up agreements prevent pre-IPO insiders from immediately dumping large blocks of stock into the newly public market, stabilizing trading prices and ensuring executive commitment.",
                "answerIndex": 0,
                "explanation": "Lock-up agreements prevent pre-IPO insiders from immediately dumping large blocks of stock into the newly public market, stabilizing trading prices and ensuring executive commitment."
            }
        },
        {
            "title": "Market Stabilization, SEC Regulation M & The Green Shoe Option",
            "say": [
                "When a company's shares debut on a national securities exchange, trading volatility can be extreme. If selling pressure drives the market price below the public offering price, the offering is deemed 'broken', causing severe reputational and financial damage to both the issuer and the underwriting syndicate. To manage this post-pricing price risk, the capital markets rely on two integrated mechanisms: (1) The Green Shoe (Over-Allotment) Option, and (2) Market Stabilization bids under SEC Regulation M.",
                "The Green Shoe Option—named after the Green Shoe Manufacturing Company, the first enterprise to implement it—is a standard contractual right granted by the issuer to the underwriting syndicate. It authorizes the underwriters to purchase up to an additional 15% of the total base shares offered at the original public offering price, exercisable for 30 calendar days following pricing.",
                "The mechanical brilliance of the Green Shoe lies in how underwriters deploy it to stabilize the market. At pricing, the syndicate deliberately 'oversells' the offering by 115% of the base shares, intentionally creating a 15% 'syndicate short position'. What happens next depends on market trading dynamics:",
                "Scenario A: The stock rises above the IPO price. Because the stock is trading at a premium, the underwriters do not buy shares in the open market (which would push prices even higher). Instead, they simply exercise the Green Shoe Option with the issuer, purchasing the extra 15% at the lower IPO price to cover their short position. The company issues 15% more shares and receives 15% more capital.",
                "Scenario B: The stock drops below the IPO price. Now the offering is under selling pressure. The underwriters DO NOT exercise the Green Shoe option. Instead, they enter the open market and buy shares below the IPO price to cover their short position! These massive buy orders create an artificial price floor that stabilizes the stock, while generating a trading profit for the syndicate (buying low to cover a short established at the higher IPO price).",
                "However, entering bids into the market to manipulate stock prices would ordinarily violate the anti-manipulation provisions of Sections 9 and 10(b) of the Exchange Act. To legitimize this practice, the SEC enacted Regulation M. Under Rule 104 of Regulation M, underwriters are granted a strict safe harbor to place stabilizing bids, provided: (a) stabilizing bids cannot exceed the public offering price, (b) only one stabilizing bid can be maintained per market at a time, (c) prior notice must be given to the exchange, and (d) full disclosure must be made in the prospectus."
            ],
            "example": "In an offering of 10,000,000 shares at $20.00, underwriters allocate 11,500,000 shares, creating a 1.5M share short. If the stock drops to $18.00 on Day 2, underwriters buy 1,500,000 shares in the open market at $18.00. This $27M buying program halts the price slide, covers their short, and nets the syndicate $3,000,000 in trading profit without diluting the company.",
            "code": """# Simulation: SEC Regulation M Rule 104 & Green Shoe Syndicate Stabilization Engine
from typing import Dict, List

def execute_green_shoe_stabilization(
    base_shares_offered: int,
    public_offering_price: float,
    current_market_trading_price: float,
    green_shoe_option_pct: float, # Max 15.0% by regulatory convention
    days_since_pricing: int,
    stabilizing_bid_price: float,
    disclosed_in_prospectus: bool
) -> dict:
    max_green_shoe_shares = int(base_shares_offered * (green_shoe_option_pct / 100.0))
    syndicate_short_shares = max_green_shoe_shares
    
    # Regulation M Rule 104 Compliance Checks
    reg_m_violations = []
    if not disclosed_in_prospectus:
        reg_m_violations.append("Rule 104 Violation: Stabilization intent not disclosed in prospectus.")
    if stabilizing_bid_price > public_offering_price:
        reg_m_violations.append(f"Rule 104 Violation: Stabilizing bid (${stabilizing_bid_price}) exceeds IPO price (${public_offering_price}).")
    if days_since_pricing > 30:
        reg_m_violations.append("Option Expired: Green Shoe option duration cannot exceed 30 days.")
        
    is_reg_m_compliant = len(reg_m_violations) == 0
    
    # Syndicate Execution Strategy
    if current_market_trading_price >= public_offering_price:
        # Stock trading at a premium -> Exercise Green Shoe with Issuer
        strategy = "EXERCISE_GREEN_SHOE_OPTION_WITH_ISSUER"
        shares_bought_in_open_market = 0
        shares_exercised_from_issuer = syndicate_short_shares
        syndicate_trading_profit = 0.0
        additional_capital_to_company = shares_exercised_from_issuer * public_offering_price * 0.93 # Net of 7% spread
        market_stabilization_action = "Zero open-market buying needed; strong organic market demand."
    else:
        # Stock trading at a discount -> Open-Market Buyback (Market Stabilization)
        strategy = "OPEN_MARKET_STABILIZING_PURCHASES_COVER_SHORT"
        shares_bought_in_open_market = syndicate_short_shares
        shares_exercised_from_issuer = 0
        # Profit = shorted at IPO price, bought back at market price
        syndicate_trading_profit = shares_bought_in_open_market * (public_offering_price - current_market_trading_price)
        additional_capital_to_company = 0.0
        market_stabilization_action = f"Deployed ${shares_bought_in_open_market * current_market_trading_price / 1e6:.1f}M buying program to establish price floor."
        
    return {
        'is_reg_m_compliant': is_reg_m_compliant,
        'strategy': strategy,
        'market_price': current_market_trading_price,
        'shares_bought_in_market': shares_bought_in_open_market,
        'shares_exercised_from_issuer': shares_exercised_from_issuer,
        'syndicate_trading_profit': syndicate_trading_profit,
        'additional_capital_to_company': additional_capital_to_company,
        'market_stabilization_action': market_stabilization_action,
        'reg_m_violations': reg_m_violations
    }

# Execute deterministic validation
sim_hot = execute_green_shoe_stabilization(10_000_000, 20.0, 24.50, 15.0, 5, 20.0, True)
sim_cold = execute_green_shoe_stabilization(10_000_000, 20.0, 17.50, 15.0, 3, 19.50, True)
sim_illegal = execute_green_shoe_stabilization(10_000_000, 20.0, 17.50, 15.0, 3, 21.00, True)

print(f"Hot IPO ($24.50): Strategy={sim_hot['strategy']} | Extra Co Capital: ${sim_hot['additional_capital_to_company']/1e6:.2f}M")
print(f"Broken IPO ($17.50): Strategy={sim_cold['strategy']} | Syndicate Profit: ${sim_cold['syndicate_trading_profit']/1e6:.2f}M | Action: {sim_cold['market_stabilization_action']}")
print(f"Illegal Bid ($21.00): Reg M Compliant={sim_illegal['is_reg_m_compliant']} | Violations: {sim_illegal['reg_m_violations']}")
""",
            "output": """Hot IPO ($24.50): Strategy=EXERCISE_GREEN_SHOE_OPTION_WITH_ISSUER | Extra Co Capital: $27.90M
Broken IPO ($17.50): Strategy=OPEN_MARKET_STABILIZING_PURCHASES_COVER_SHORT | Syndicate Profit: $3.75M | Action: Deployed $26.2M buying program to establish price floor.
Illegal Bid ($21.00): Reg M Compliant=False | Violations: ['Rule 104 Violation: Stabilizing bid ($21.0) exceeds IPO price ($20.0).']
""",
            "codeNotes": [
                {"line": 15, "note": "Enforces SEC Regulation M Rule 104 prohibition against bids exceeding public offering price"},
                {"line": 26, "note": "Exercises Green Shoe option with issuer when market trades at premium above IPO price"},
                {"line": 34, "note": "Executes open market buybacks to stabilize price and cover syndicate short when trading at discount"}
            ],
            "tryIt": "Set stabilizing_bid_price to 20.0 in sim_illegal to observe how bringing the stabilizing bid to or below the IPO price restores Rule 104 safe harbor compliance.",
            "check": {
                "question": "When an IPO stock begins trading BELOW the public offering price, how do underwriters utilize the Green Shoe Option under SEC Regulation M?",
                "options": [
                    "Underwriters DO NOT exercise the option with the company; instead, they purchase shares in the open market below the IPO price to cover their syndicate short position, creating an artificial price floor that stabilizes trading.",
                    "Underwriters demand that the SEC shut down the stock exchange for 90 days.",
                    "Underwriters exercise the option to buy more shares at the full IPO price from the company.",
                    "Underwriters cancel all shares previously sold to institutional investors."
                ],
                "answer": 0,
                "why": "When the stock breaks below the IPO price, underwriters cover their 15% short position by buying in the open market, injecting vital buying power that stabilizes the market price.",
                "answerIndex": 0,
                "explanation": "When the stock breaks below the IPO price, underwriters cover their 15% short position by buying in the open market, injecting vital buying power that stabilizes the market price."
            }
        },
        {
            "title": "Underwriter Due Diligence & The Escott v. BarChris Construction Doctrine",
            "say": [
                "The ultimate legal barrier separating underwriters from catastrophic civil liability under Section 11 of the Securities Act of 1933 is the 'Due Diligence Defense' of Section 11(b)(3). Investment bankers cannot simply claim they were unaware of corporate fraud or accounting manipulation. Under the definitive jurisprudence of Escott v. BarChris Construction Corp. (S.D.N.Y. 1968), the law imposes an affirmative, adversarial investigative duty upon underwriting syndicates.",
                "BarChris was a bowling alley construction company that issued convertible subordinated debentures to finance rapid expansion. The S-1 registration statement contained egregious misstatements: operating profits were overstated, liabilities were hidden, loans to corporate officers were concealed, and proceeds were used to pay off desperate operational debts rather than fund construction. When BarChris filed for bankruptcy shortly after the offering, purchasers sued the board, underwriters, and auditors under Section 11.",
                "The lead underwriter, Drexel & Co., argued that its counsel had attended meetings with management, examined board minutes, and read the draft S-1. The federal court resoundingly rejected the underwriters' defense, holding that underwriters must not accept management's representations at face value without independent verification. The court ruled that the underwriter's role is inherently adversarial: underwriters are expected to verify representations by examining underlying commercial contracts, bank records, customer invoices, and property titles.",
                "BarChris established the operational dichotomy between 'expertised' and 'non-expertised' portions of a registration statement: (1) For Non-Expertised Portions (business description, MD&A, management history), underwriters must conduct a 'reasonable investigation' and possess 'reasonable ground to believe and did believe' the statements were true; and (2) For Expertised Portions (audited financial statements certified by independent auditors), underwriters are not required to conduct an independent audit, but they cannot ignore visible 'red flags' or inconsistent operational data.",
                "In modern securities practice, fulfilling the BarChris standard requires underwriters' counsel to execute a meticulous, multi-week due diligence protocol: conducting formal management interviews, reviewing thousands of contracts in virtual data rooms, confirming customer references, auditing regulatory compliance, and obtaining written legal opinions and comfort letters at closing. Neglecting these steps results in catastrophic joint and several liability."
            ],
            "example": "In BarChris, the underwriters' lawyer failed to read the company's executive committee minutes and never checked whether bowling alley customers were actually paying their notes. The court held the underwriters liable under Section 11 because 'to say that it is enough for the underwriter to ask questions and accept the answers without more would eliminate the protection of investors.'",
            "code": """# Simulation: Escott v. BarChris Underwriter Due Diligence Audit Engine
from typing import Dict, List

def audit_underwriter_due_diligence_program(
    underwriter_firm: str,
    examined_underlying_contracts: bool,
    interviewed_major_customers_independently: bool,
    audited_board_and_committee_minutes: bool,
    relied_solely_on_management_verbal_assurances: bool,
    ignored_apparent_accounting_red_flags: bool,
    received_customary_officers_certificates: bool,
    obtained_full_legal_opinion_and_comfort_letter: bool
) -> dict:
    # BarChris Invariant Checks
    adversarial_verification_steps = [
        examined_underlying_contracts,
        interviewed_major_customers_independently,
        audited_board_and_committee_minutes,
        obtained_full_legal_opinion_and_comfort_letter
    ]
    verification_score = sum(1 for step in adversarial_verification_steps if step)
    
    fatal_defects = []
    if relied_solely_on_management_verbal_assurances:
        fatal_defects.append("BarChris Breach: Relying solely on management verbal assurances without independent verification eliminates due diligence defense.")
    if ignored_apparent_accounting_red_flags:
        fatal_defects.append("Red Flag Breach: Ignored visible accounting discrepancies in expertised financial statements.")
    if verification_score < 4:
        fatal_defects.append(f"Incomplete Investigation: Satisfied {verification_score}/4 core verification pillars.")
        
    defense_sustained = len(fatal_defects) == 0
    status = "SECTION_11_AFFIRMATIVE_DUE_DILIGENCE_DEFENSE_SUSTAINED" if defense_sustained else "DUE_DILIGENCE_DEFENSE_DENIED_UNDERWRITER_STRICTLY_LIABLE"
    
    return {
        'underwriter_firm': underwriter_firm,
        'defense_sustained': defense_sustained,
        'status': status,
        'verification_score_pct': (verification_score / 4.0) * 100.0,
        'fatal_defects_count': len(fatal_defects),
        'fatal_defects': fatal_defects
    }

# Execute deterministic validation
d_goldman = audit_underwriter_due_diligence_program("Tier 1 Bank", True, True, True, False, False, True, True)
d_negligent = audit_underwriter_due_diligence_program("Negligent Bank", False, False, False, True, True, True, False)

print(f"[{d_goldman['underwriter_firm']}] -> Defense Sustained: {d_goldman['defense_sustained']} | Status: {d_goldman['status']}")
print(f"[{d_negligent['underwriter_firm']}] -> Defense Sustained: {d_negligent['defense_sustained']} | Defects: {d_negligent['fatal_defects']}")
""",
            "output": """[Tier 1 Bank] -> Defense Sustained: True | Status: SECTION_11_AFFIRMATIVE_DUE_DILIGENCE_DEFENSE_SUSTAINED
[Negligent Bank] -> Defense Sustained: False | Defects: ['BarChris Breach: Relying solely on management verbal assurances without independent verification eliminates due diligence defense.', 'Red Flag Breach: Ignored visible accounting discrepancies in expertised financial statements.', 'Incomplete Investigation: Satisfied 0/4 core verification pillars.']
""",
            "codeNotes": [
                {"line": 15, "note": "Scores core BarChris investigative requirements: contract audits, customer interviews, minute reviews"},
                {"line": 23, "note": "Disqualifies due diligence defense if underwriter merely accepts executive verbal assurances"},
                {"line": 28, "note": "Affirms Section 11(b) underwriter defense only when independent adversarial investigation is complete"}
            ],
            "tryIt": "Set examined_underlying_contracts and audited_board_and_committee_minutes to True and relied_solely_on_management_verbal_assurances to False in d_negligent to test the path toward BarChris compliance.",
            "check": {
                "question": "Under the federal court's landmark ruling in Escott v. BarChris Construction Corp., what must an underwriter do to successfully establish a Section 11 due diligence defense?",
                "options": [
                    "The underwriter must conduct an independent, adversarial investigation into the issuer's business, examining underlying contracts, minutes, and records rather than merely accepting management's verbal assurances.",
                    "The underwriter only needs to attend a single golf outing with the CEO.",
                    "The underwriter can escape all liability by purchasing an insurance policy from Lloyd's of London.",
                    "The underwriter must obtain a personal guarantee from the governor of the state of incorporation."
                ],
                "answer": 0,
                "why": "BarChris established that underwriters owe an adversarial duty to the investing public to independently verify the accuracy of registration disclosures through primary source verification.",
                "answerIndex": 0,
                "explanation": "BarChris established that underwriters owe an adversarial duty to the investing public to independently verify the accuracy of registration disclosures through primary source verification."
            }
        }
    ],
    "summary": [
        "S-1 Registration Architecture: Form S-1 demands exhaustive disclosure under Regulations S-K and S-X, progressing through mandatory SEC Division of Corporation Finance comment letter iterations prior to Section 8(a) effectiveness.",
        "Underwriting Structure Spectrum: Firm commitment transfers 100% of placement risk to syndicate balance sheets; best efforts acts purely as broker agent; direct floor listings eliminate gross spreads and lock-ups.",
        "Underwriting Agreement Invariants: Governs 7% gross spreads, Market Out termination rights for MAC and trading halts, mandatory 180-day insider lock-up agreements, and PCAOB AS 6101 initial and bring-down comfort letters.",
        "Regulation M & Green Shoe Stabilization: Authorizes 15% syndicate short over-allotment options to stabilize broken IPOs through open market buybacks under Rule 104 without manipulating the market.",
        "BarChris Due Diligence Doctrine: Section 11(b) protects diligent underwriters only when they conduct thorough, independent, adversarial inquiries into underlying contracts, minutes, and records rather than blindly trusting executive assurances."
    ],
    "projectStep": {
        "title": "Corporate Law Milestone 3 Step 3: IPO Underwriting Syndicate & Regulation M Stabilization Control Tower",
        "steps": [
            "Structure an enterprise Form S-1 registration statement complying with Regulations S-K, S-X, and G non-GAAP reconciliation rules.",
            "Model firm commitment underwriting syndicate allocations, gross spreads, and Agreement Among Underwriters liability splits.",
            "Draft standard underwriting agreement closing conditions including 180-day insider lock-ups and PCAOB AS 6101 comfort letters.",
            "Formulate an SEC Regulation M Rule 104 market stabilization plan and execute Green Shoe over-allotment short-covering algorithms."
        ]
    }
}

if __name__ == "__main__":
    total = ensure_law_day_budget(DAY_13)
    print(f"B.Com Corporate Law Day 13 Total Words: {total}")
    for i, p in enumerate(DAY_13['parts']):
        print(f"  Part {i+1} words: {count_words(p['say'])}")
