"""
Course 29: B.Com Corporate & Commercial Law, Contracts & Governance (bcom_law)
Day 30 Builder: 🏆 GRAND FINAL CAPSTONE: Sovereign Transnational Enterprise Governance, Cross-Border M&A & Global Enforcement Control Tower
Milestone 6: Transnational Corporate Law, International Disputes & Global Governance
Guarantees >= 580 words per part and >= 2,950 words total with deterministic Python simulations.
Course 29 100% Grand Final Completion.
"""

from corporate_law_budget_ensurer import ensure_law_day_budget
from visual_builder import count_words

DAY_30 = {
    "coursePrefix": "bcom_law",
    "day": 30,
    "title": "🏆 Grand Final Capstone: Sovereign Transnational Enterprise Governance, Cross-Border M&A & Global Enforcement Control Tower",
    "goal": "Achieve ultimate mastery across the entirety of corporate and commercial jurisprudence: audit multi-jurisdictional corporate architecture, BEPS 2.0 Pillar Two 15% global minimum tax, and economic substance rules; orchestrate cross-border hostile M&A defense and Dual-Listed Company (DLC) governance under conflicting Delaware and UK Takeover Code rules; screen global commercial operations against OFAC 50 Percent sanctions and EAR export controls; prosecute investor-state dispute settlement (ISDS) claims under Bilateral Investment Treaties (BITs) and the ICSID Convention; and execute the Sovereign Transnational General Counsel Executive Boardroom Defense, conferring the Certified Master Transnational Corporate Counsel & Chief Legal Officer accreditation.",
    "minutes": 45,
    "recap": "Across Days 1 to 29, we mastered the complete corpus of corporate and commercial law: contract formation and liquidated damages, corporate veil piercing, director fiduciary duties, Caremark oversight, Chapter 11 distressed restructuring, patent/trademark/trade secret/copyright IP governance, securities underwriting and PSLRA litigation defense, Delaware takeover defense and poison pills, Revlon auctions, MFW controlling shareholder freeze-outs, HSR antitrust merger clearance, cross-border insolvency and Chapter 15, international commercial arbitration under the New York Convention, supply chain ESG due diligence under CSDDD and LkSG, and FCPA anti-corruption compliance. Today, in Day 30, we unite all 29 disciplines into the Sovereign Transnational Enterprise Governance Control Tower, marking the 100% GRAND FINAL COMPLETION OF COURSE 29!",
    "parts": [
        {
            "title": "Transnational Corporate Architecture: BEPS 2.0, Economic Substance & Veils",
            "say": [
                "Transnational enterprises operate across a vast labyrinth of sovereign tax and corporate legal systems. In establishing international corporate holding structures—typically utilizing intermediate holding companies in jurisdictions such as Ireland, the Netherlands, Luxembourg, Singapore, or the Cayman Islands—multinational enterprises historically sought to minimize global effective tax rates through aggressive transfer pricing, hybrid mismatches, and treaty shopping.",
                "However, global corporate jurisprudence has undergone a seismic transformation under the OECD/G20 Base Erosion and Profit Shifting (BEPS) project. The definitive centerpiece of this new architecture is BEPS 2.0 Pillar Two: the Global Anti-Base Erosion (GloBE) rules. Pillar Two establishes a mandatory 15% Global Minimum Effective Tax Rate for multinational enterprise groups with annual consolidated revenues exceeding €750,000,000.",
                "The legal machinery of Pillar Two operates through three interlocking mechanisms: (1) The Income Inclusion Rule (IIR)—which empowers the ultimate parent jurisdiction to levy a top-up tax on low-taxed constituent entities, (2) The Undertaxed Profits Rule (UTPR)—which serves as a backstop, allocating top-up taxes to subsidiary jurisdictions if the parent country has not implemented the IIR, and (3) Qualified Domestic Minimum Top-Up Taxes (QDMTT)—allowing source nations to collect top-up taxes locally before foreign treasuries can do so.",
                "Simultaneously, traditional tax havens have enacted strict 'Economic Substance' legislation in response to European Union and OECD pressure. Under these statutes, intermediate holding entities can no longer function as mere 'brass-plate' shell corporations with nominal postal boxes. To qualify for double tax treaty benefits and avoid the piercing of the transnational corporate veil, intermediate holding companies must demonstrate genuine operational substance: (a) Board of directors meetings physically held within the jurisdiction with a quorum of qualified local directors, (b) Strategic management decisions genuinely debated and authorized locally, (c) Adequate physical office premises and full-time professional personnel, and (d) Substantial operational operating expenses incurred locally.",
                "Failing to maintain economic substance exposes the holding company to tax treaty disqualification under the Principal Purpose Test (PPT) of the Multilateral Instrument (MLI) and risks foreign courts piercing the corporate veil under alter-ego doctrines."
            ],
            "example": "A U.S. technology conglomerate establishes an intermediate intellectual property holding entity in Ireland. Under BEPS 2.0 Pillar Two, if Ireland's effective tax on the subsidiary's software royalties falls to 9.5%, the U.S. parent is assessed a 5.5% top-up tax under the Income Inclusion Rule to reach the mandatory 15% global minimum tax rate.",
            "code": """# Simulation: BEPS 2.0 Pillar Two Global Minimum Tax & Economic Substance Auditor
from typing import Dict, List, Any

def audit_transnational_entity_substance_and_pillar2(
    entity_name: str,
    jurisdiction: str,
    annual_constituent_revenue_eur: float,
    covered_taxes_paid_eur: float,
    effective_globe_income_eur: float,
    board_meetings_held_locally: bool,
    majority_directors_qualified_residents: bool,
    has_physical_premises_and_local_staff: bool,
    principal_purpose_is_solely_tax_avoidance: bool
) -> dict:
    # 1. BEPS 2.0 Pillar Two Top-Up Tax Calculation
    # Effective Tax Rate (ETR) = Covered Taxes / GloBE Income
    if effective_globe_income_eur > 0:
        effective_tax_rate_pct = (covered_taxes_paid_eur / effective_globe_income_eur) * 100.0
    else:
        effective_tax_rate_pct = 15.0
        
    mandatory_minimum_rate_pct = 15.0
    top_up_tax_rate_pct = max(0.0, mandatory_minimum_rate_pct - effective_tax_rate_pct)
    top_up_tax_payable_eur = effective_globe_income_eur * (top_up_tax_rate_pct / 100.0)
    
    # 2. Economic Substance & Tax Treaty PPT Audit
    substance_factors = [
        board_meetings_held_locally,
        majority_directors_qualified_residents,
        has_physical_premises_and_local_staff,
        not principal_purpose_is_solely_tax_avoidance
    ]
    substance_score = (sum(1 for f in substance_factors if f) / len(substance_factors)) * 100.0
    
    has_economic_substance = substance_score >= 75.0
    treaty_benefits_denied = (not has_economic_substance) or principal_purpose_is_solely_tax_avoidance
    
    return {
        "entity": entity_name,
        "jurisdiction": jurisdiction,
        "effective_tax_rate_pct": round(effective_tax_rate_pct, 2),
        "top_up_tax_rate_pct": round(top_up_tax_rate_pct, 2),
        "top_up_tax_payable_eur": round(top_up_tax_payable_eur, 2),
        "economic_substance_score": substance_score,
        "has_adequate_substance": has_economic_substance,
        "tax_treaty_benefits_status": "DENIED_UNDER_MLI_PPT_RULE" if treaty_benefits_denied else "UPHELD_GENUINE_COMMERCIAL_SUBSTANCE",
        "corporate_veil_status": "HIGH_ALTER_EGO_EXPOSURE" if not has_economic_substance else "ISOLATED_CORPORATE_VEIL_UPHELD"
    }

# Execute deterministic simulation
sub_audit = audit_transnational_entity_substance_and_pillar2(
    entity_name="Helios Global IP Holdings DAC",
    jurisdiction="Ireland",
    annual_constituent_revenue_eur=180_000_000.0,
    covered_taxes_paid_eur=18_900_000.0, # 10.5% effective rate
    effective_globe_income_eur=180_000_000.0,
    board_meetings_held_locally=True,
    majority_directors_qualified_residents=True,
    has_physical_premises_and_local_staff=True,
    principal_purpose_is_solely_tax_avoidance=False
)
print(f"Entity: {sub_audit['entity']} ({sub_audit['jurisdiction']})")
print(f"Pillar Two ETR: {sub_audit['effective_tax_rate_pct']}% -> Top-Up Rate: {sub_audit['top_up_tax_rate_pct']}%")
print(f"Top-Up Tax Payable: EUR {sub_audit['top_up_tax_payable_eur']:,.2f}")
print(f"Substance Score: {sub_audit['economic_substance_score']}% -> Status: {sub_audit['has_adequate_substance']}")
print(f"Treaty Standing: {sub_audit['tax_treaty_benefits_status']}")
print(f"Corporate Veil: {sub_audit['corporate_veil_status']}")
""",
            "output": """Entity: Helios Global IP Holdings DAC (Ireland)
Pillar Two ETR: 10.5% -> Top-Up Rate: 4.5%
Top-Up Tax Payable: EUR 8,100,000.00
Substance Score: 100.0% -> Status: True
Treaty Standing: UPHELD_GENUINE_COMMERCIAL_SUBSTANCE
Corporate Veil: ISOLATED_CORPORATE_VEIL_UPHELD""",
            "tryIt": "Set `has_physical_premises_and_local_staff` to False and `principal_purpose_is_solely_tax_avoidance` to True and observe how treaty benefits are revoked and the corporate veil is compromised.",
            "check": {
                "question": "What is the primary operational effect of the OECD/G20 BEPS 2.0 Pillar Two Global Anti-Base Erosion (GloBE) rules on multinational enterprise groups with annual revenues exceeding €750M?",
                "options": [
                    "It eliminates all corporate income taxes worldwide",
                    "It imposes a mandatory 15% global minimum effective tax rate, levying top-up taxes on constituent entities taxed below that threshold",
                    "It mandates that all corporations move their headquarters to Switzerland",
                    "It requires all corporate profits to be converted into physical gold bars"
                ],
                "answerIndex": 1,
                "explanation": "BEPS 2.0 Pillar Two establishes a 15% global minimum tax rate. If an entity's effective tax rate in any jurisdiction is below 15%, the parent jurisdiction levies a top-up tax under the Income Inclusion Rule.",
                "why": "Pillar Two fundamentally curtails international tax competition and ends the era of artificial tax haven profit shifting."
            },
            "codeNotes": [
                "`audit_transnational_entity_substance_and_pillar2` models the OECD BEPS 2.0 Pillar Two GloBE top-up tax formula.",
                "Calculates top-up taxes when the effective tax rate falls below the 15% statutory floor.",
                "Audits economic substance factors under the Multilateral Instrument (MLI) Principal Purpose Test."
            ]
        },
        {
            "title": "Transnational Takeover Defense & Dual-Listed Company (DLC) Governance",
            "say": [
                "When cross-border mergers and acquisitions take place across different continents, transactional counsel must harmonize starkly conflicting takeover regulatory frameworks. Nowhere is this structural conflict more acute than between Delaware corporate law and the United Kingdom's City Code on Takeovers and Mergers.",
                "Under Delaware corporate law (as mastered in Days 21–22), target boards of directors operate under the business judgment rule and intermediate enhanced scrutiny under Unocal. Delaware boards possess formidable defensive weapons: they can adopt Shareholder Rights Plans (Poison Pills), maintain staggered boards under Airgas, grant matching rights, and actively 'just say no' to hostile bidders to preserve long-term corporate independence.",
                "In stark contrast, the UK Takeover Code is governed by the absolute 'General Principle 3' and 'Rule 21: Restrictions on Frustrating Action' (the Non-Frustration Rule). Under Rule 21, once a bona fide offer is communicated to the board (or is believed to be imminent), the target board is STRICTLY FORBIDDEN from taking any defensive action that may result in an offer being frustrated or shareholders being denied the opportunity to decide on its merits! Poison pills, defensive recapitalizations, issuance of shares, and disposal of material assets without prior shareholder approval are flatly illegal in the UK.",
                "To navigate these conflicting sovereign regimes in mega-mergers, corporations frequently utilize 'Dual-Listed Company' (DLC) structures (such as Rio Tinto, BHP Billiton, and Unilever historically). In a DLC structure, two separate legal corporations—typically one in the US/UK and one in Australia/Europe—retain their separate legal personalities, separate stock exchange listings, and separate domestic incorporation charters, while unifying their economic businesses completely through an 'Equalization Agreement'.",
                "Under the Equalization Agreement, the two entities share identical unified boards of directors, unified management committees, and identical dividend and voting rights ratios (e.g. 1:1 parity). In cross-border M&A transactions involving DLCs, multi-jurisdictional clearances must be coordinated across the U.S. FTC/DOJ, the European Commission DG COMP, the UK Competition and Markets Authority (CMA), and the Australian ACCC simultaneously."
            ],
            "example": "A U.S. defense conglomerate attempts an unsolicited takeover of a dual-listed aerospace enterprise incorporated in both Delaware and the UK. While the Delaware board attempts to trigger a poison pill, the UK Takeover Panel immediately halts the defense under Rule 21, forcing the combined board to seek shareholder approval before deploying any frustrating action.",
            "code": """# Simulation: Transnational Cross-Border M&A & Dual-Listed Takeover Conflict Engine
from typing import Dict, List, Any

def evaluate_cross_border_ma_takeover_clearance(
    deal_name: str,
    target_has_delaware_entity: bool,
    target_has_uk_entity_subject_to_takeover_code: bool,
    hostile_bidder_launched_unsolicited_tender: bool,
    board_deployed_unilateral_poison_pill: bool,
    us_ftc_doj_hsr_cleared: bool,
    eu_dg_comp_merger_cleared: bool,
    uk_cma_antitrust_cleared: bool
) -> dict:
    takeover_defense_audit = []
    
    # 1. Delaware Law Defense Analysis (Unocal / Moran)
    if target_has_delaware_entity and board_deployed_unilateral_poison_pill:
        takeover_defense_audit.append({
            "jurisdiction": "Delaware (United States)",
            "doctrine": "UNOCAL_ENHANCED_SCRUTINY_MORAN",
            "legality": "PERMISSIBLE_BOARD_DEFENSIVE_RIGHTS_PLAN",
            "status": "POISON_PILL_VALID_UNDER_DELAWARE_LAW"
        })
        
    # 2. UK Takeover Code Rule 21 Conflict (Strict Non-Frustration)
    if target_has_uk_entity_subject_to_takeover_code and board_deployed_unilateral_poison_pill:
        takeover_defense_audit.append({
            "jurisdiction": "United Kingdom (City Code)",
            "doctrine": "RULE_21_RESTRICTIONS_ON_FRUSTRATING_ACTION",
            "legality": "ILLEGAL_UNAUTHORIZED_DEFENSIVE_MEASURE",
            "status": "POISON_PILL_PROHIBITED_ABSENT_SHAREHOLDER_VOTE"
        })
        has_transnational_regulatory_impasse = True
    else:
        has_transnational_regulatory_impasse = False
        
    # 3. Multi-Jurisdictional Competition Clearances
    competition_approvals = {
        "US_FTC_DOJ_HSR": us_ftc_doj_hsr_cleared,
        "EU_COMMISSION_DG_COMP": eu_dg_comp_merger_cleared,
        "UK_CMA": uk_cma_antitrust_cleared
    }
    all_competition_clearances_secured = all(competition_approvals.values())
    
    # Master Transaction Status
    if has_transnational_regulatory_impasse:
        transaction_verdict = "REGULATORY_CONFLICT_UK_TAKEOVER_PANEL_INJUNCTION"
    elif not all_competition_clearances_secured:
        transaction_verdict = "PENDING_GLOBAL_ANTITRUST_CLEARANCES"
    else:
        transaction_verdict = "CROSS_BORDER_M_AND_A_TRANSACTION_CLEARED_FOR_CLOSING"
        
    return {
        "deal_name": deal_name,
        "dual_jurisdiction_conflict": has_transnational_regulatory_impasse,
        "takeover_defense_findings": takeover_defense_audit,
        "antitrust_clearance_matrix": competition_approvals,
        "all_antitrust_secured": all_competition_clearances_secured,
        "master_transaction_verdict": transaction_verdict
    }

# Execute deterministic simulation
deal_res = evaluate_cross_border_ma_takeover_clearance(
    deal_name="Titan Transatlantic Aerospace DLC Acquisition",
    target_has_delaware_entity=True,
    target_has_uk_entity_subject_to_takeover_code=True,
    hostile_bidder_launched_unsolicited_tender=True,
    board_deployed_unilateral_poison_pill=False, # Avoided Rule 21 breach by seeking vote
    us_ftc_doj_hsr_cleared=True,
    eu_dg_comp_merger_cleared=True,
    uk_cma_antitrust_cleared=True
)
print(f"Transaction: {deal_res['deal_name']}")
print(f"Dual-Jurisdiction Conflict: {deal_res['dual_jurisdiction_conflict']}")
print(f"All Global Antitrust Secured: {deal_res['all_antitrust_secured']}")
print(f"Final Clearance Verdict: {deal_res['master_transaction_verdict']}")
for k, v in deal_res['antitrust_clearance_matrix'].items():
    print(f" - {k}: {'CLEARED' if v else 'BLOCKED'}")
""",
            "output": """Transaction: Titan Transatlantic Aerospace DLC Acquisition
Dual-Jurisdiction Conflict: False
All Global Antitrust Secured: True
Final Clearance Verdict: CROSS_BORDER_M_AND_A_TRANSACTION_CLEARED_FOR_CLOSING
 - US_FTC_DOJ_HSR: CLEARED
 - EU_COMMISSION_DG_COMP: CLEARED
 - UK_CMA: CLEARED""",
            "tryIt": "Set `board_deployed_unilateral_poison_pill` to True and observe how the UK Takeover Code Rule 21 injunction blocks the cross-border transaction.",
            "check": {
                "question": "How does the United Kingdom's City Code on Takeovers and Mergers (Rule 21) differ fundamentally from Delaware corporate law regarding the deployment of poison pills by a target board?",
                "options": [
                    "The UK Takeover Code allows poison pills only if they dilute shares by at least 90%",
                    "Under UK Rule 21, the board is strictly prohibited from taking any frustrating action (including poison pills) without shareholder approval once an offer is imminent, whereas Delaware boards can unilaterally adopt poison pills under the business judgment rule",
                    "Delaware law requires all poison pills to be approved by the Governor of Delaware",
                    "There is no difference; UK and Delaware takeover laws are identical"
                ],
                "answerIndex": 1,
                "explanation": "UK Rule 21 imposes a strict non-frustration rule reserving takeover decisions for shareholders, directly conflicting with Delaware's board-centric model which empowers directors to maintain poison pills.",
                "why": "Recognizing this divergence is essential for structuring cross-border M&A transactions without violating foreign takeover regulations."
            },
            "codeNotes": [
                "`evaluate_cross_border_ma_takeover_clearance` models the direct clash between Delaware Unocal jurisprudence and UK Takeover Code Rule 21.",
                "Audits multi-jurisdictional merger clearance across the U.S. FTC/DOJ, European Commission, and UK CMA.",
                "Enforces transaction clearance gating based on simultaneous multi-agency approvals."
            ]
        },
        {
            "title": "Global Economic Sanctions & Export Controls: The OFAC 50% Rule",
            "say": [
                "In contemporary global commerce, transnational corporations must navigate the most complex and punitive regulatory compliance challenge in corporate history: international economic sanctions and export controls. Administered in the United States by the Department of the Treasury's Office of Foreign Assets Control (OFAC) and the Department of Commerce's Bureau of Industry and Security (BIS), these regimes operate under strict liability and carry severe criminal and civil penalties.",
                "OFAC administers two primary forms of economic sanctions: (1) Comprehensive Sanctions (prohibiting virtually all commercial transactions involving specific embargoed jurisdictions, such as Iran, Cuba, North Korea, and Syria), and (2) Targeted List-Based Sanctions (targeting specific individuals, entities, and vessels placed on the Specially Designated Nationals and Blocked Persons / SDN List). Under 31 C.F.R. regulations, U.S. persons—including all U.S. citizens, permanent residents, entities organized under U.S. law, and foreign subsidiaries owned or controlled by U.S. companies—are strictly prohibited from engaging in any direct or indirect commercial transactions with SDNs.",
                "The most treacherous trap for transnational corporate counsel is the 'OFAC 50 Percent Rule'. Under this rule, any legal entity that is owned in the aggregate, directly or indirectly, 50 percent or more by one or more blocked persons is ITSELF BLOCKED BY OPERATION OF LAW! The entity does NOT need to appear on the SDN List itself. If SDN Oligarch A owns 30% of a foreign manufacturing conglomerate, and SDN Oligarch B owns 20%, the entity is automatically blocked, and any transaction with it constitutes a federal sanctions felony.",
                "Furthermore, corporations must comply with the Export Administration Regulations (EAR) and the Foreign Direct Product Rule (FDPR). Under the FDPR, advanced technological items—such as microprocessors, artificial intelligence accelerators, and telecommunications equipment—manufactured outside the United States using U.S.-origin software or technology are subject to U.S. export licensing jurisdiction, even if no U.S. person touches the physical transaction.",
                "Violations of OFAC sanctions carry civil penalties exceeding $350,000 per transaction under the International Emergency Economic Powers Act (IEEPA), alongside criminal penalties up to 20 years imprisonment for willful violations."
            ],
            "example": "A European logistics company contracts to charter a cargo freighter owned by a Cypriot holding company. The Cypriot company is owned 51% by a sanctioned state-owned energy company. Under the OFAC 50% Rule, the Cypriot company is automatically blocked. If the charter payments clear in U.S. dollars through a correspondent bank in New York, the funds are frozen and the European company faces massive OFAC civil enforcement.",
            "code": """# Simulation: OFAC 50 Percent Sanctions & EAR Export Control Screening Engine
from typing import Dict, List, Any

def screen_transnational_ofac_sanctions_and_export_controls(
    counterparty_name: str,
    country_of_operation: str,
    is_directly_on_sdn_list: bool,
    aggregate_sdn_ownership_percentage: float, # Direct or indirect ownership by blocked persons
    transaction_currency: str, # 'USD', 'EUR', 'GBP'
    involves_us_origin_controlled_dual_use_tech: bool,
    has_valid_bis_export_license: bool,
    transaction_value_usd: float
) -> dict:
    sanctions_blocks = []
    
    # 1. Direct SDN Listing Check
    if is_directly_on_sdn_list:
        sanctions_blocks.append({
            "violation": "DIRECT_SPECIALLY_DESIGNATED_NATIONAL_SDN",
            "statute": "31 C.F.R. Parts 500-598 (OFAC)",
            "details": f"Counterparty '{counterparty_name}' is named directly on the OFAC SDN List."
        })
        
    # 2. OFAC 50 Percent Rule Check (Aggregate Blocked Ownership)
    is_blocked_by_50_pct_rule = (aggregate_sdn_ownership_percentage >= 50.0)
    if is_blocked_by_50_pct_rule and not is_directly_on_sdn_list:
        sanctions_blocks.append({
            "violation": "OFAC_50_PERCENT_RULE_AUTOMATIC_BLOCK",
            "statute": "OFAC Revised Guidance on Entities Owned by Blocked Persons",
            "details": f"Entity is owned {aggregate_sdn_ownership_percentage}% in the aggregate by blocked persons; blocked by operation of law."
        })
        
    # 3. U.S. Dollar Clearing Nexus Check
    involves_us_clearing = (transaction_currency == "USD")
    
    # 4. EAR Dual-Use Export Control Check (Foreign Direct Product Rule)
    if involves_us_origin_controlled_dual_use_tech and not has_valid_bis_export_license:
        sanctions_blocks.append({
            "violation": "EAR_UNLICENSED_CONTROLLED_TECH_EXPORT",
            "statute": "15 C.F.R. Parts 730-774 (BIS Export Regulations)",
            "details": "Export of controlled dual-use technology without a valid Bureau of Industry and Security (BIS) license."
        })
        
    is_prohibited = len(sanctions_blocks) > 0
    
    # Penalty Exposure under IEEPA
    if is_prohibited:
        status = "TRANSACTION_BLOCKED_AND_REJECTED"
        statutory_penalty_usd = max(356_579.0, transaction_value_usd * 2.0)
    else:
        status = "TRANSACTION_CLEARED_FOR_PROCESSING"
        statutory_penalty_usd = 0.0
        
    return {
        "counterparty": counterparty_name,
        "is_blocked_by_50_percent_rule": is_blocked_by_50_pct_rule,
        "is_transaction_prohibited": is_prohibited,
        "screening_status": status,
        "sanctions_violations": sanctions_blocks,
        "statutory_penalty_exposure_usd": statutory_penalty_usd
    }

# Execute deterministic simulation
screening = screen_transnational_ofac_sanctions_and_export_controls(
    counterparty_name="Baltic Marine Logistics SIA",
    country_of_operation="Cyprus",
    is_directly_on_sdn_list=False,
    aggregate_sdn_ownership_percentage=52.5, # Exceeds 50% threshold
    transaction_currency="USD",
    involves_us_origin_controlled_dual_use_tech=False,
    has_valid_bis_export_license=False,
    transaction_value_usd=12_000_000.0
)
print(f"Counterparty: {screening['counterparty']}")
print(f"OFAC 50% Rule Triggered: {screening['is_blocked_by_50_percent_rule']}")
print(f"Transaction Prohibited: {screening['is_transaction_prohibited']} -> Status: {screening['screening_status']}")
print(f"Statutory Penalty Exposure: ${screening['statutory_penalty_exposure_usd']:,.2f}")
for b in screening['sanctions_violations']:
    print(f" - [{b['violation']}]: {b['details']}")
""",
            "output": """Counterparty: Baltic Marine Logistics SIA
OFAC 50% Rule Triggered: True
Transaction Prohibited: True -> Status: TRANSACTION_BLOCKED_AND_REJECTED
Statutory Penalty Exposure: $24,000,000.00
 - [OFAC_50_PERCENT_RULE_AUTOMATIC_BLOCK]: Entity is owned 52.5% in the aggregate by blocked persons; blocked by operation of law.""",
            "tryIt": "Set `aggregate_sdn_ownership_percentage` to 45.0% and observe how falling below the 50% threshold clears the transaction under the rule.",
            "check": {
                "question": "Under the OFAC 50 Percent Rule, if an entity is owned 30% by SDN Individual A and 25% by SDN Company B, but the entity itself is NOT listed on the OFAC Specially Designated Nationals (SDN) list, is the entity blocked?",
                "options": [
                    "No, because the entity is not individually named on the SDN list",
                    "Yes, because entities owned in the aggregate 50% or more by one or more blocked persons are considered blocked by operation of law",
                    "Only if the entity conducts business inside the District of Columbia",
                    "Only if the entity operates in the commercial maritime shipping industry"
                ],
                "answerIndex": 1,
                "explanation": "Under OFAC's 50 Percent Rule, ownership stakes of multiple blocked persons are aggregated. Since 30% + 25% = 55% (exceeding 50%), the entity is automatically blocked.",
                "why": "The 50 Percent Rule prevents sanctioned oligarchs and rogue regimes from avoiding sanctions by hiding behind layered shell corporations."
            },
            "codeNotes": [
                "`screen_transnational_ofac_sanctions_and_export_controls` codifies the OFAC 50 Percent aggregation rule.",
                "Audits direct SDN status, indirect aggregate blocked ownership, and U.S. dollar correspondent clearing.",
                "Calculates statutory civil penalties under the International Emergency Economic Powers Act (IEEPA)."
            ]
        },
        {
            "title": "Investor-State Dispute Settlement (ISDS) & Bilateral Investment Treaties",
            "say": [
                "When a multinational enterprise invests billions of dollars in foreign capital infrastructure—such as oil pipelines, telecommunications networks, mining concessions, or renewable power grids—the enterprise is vulnerable to sovereign political risk. If the host sovereign state subsequently nationalizes the project, revokes regulatory concessions, imposes discriminatory tariffs, or confiscates private assets, the foreign investor cannot realistically obtain justice before the host state's own domestic courts.",
                "To protect transnational investments against sovereign predation, the international legal community forged the regime of 'Investor-State Dispute Settlement' (ISDS), established through a worldwide network of over 3,000 Bilateral Investment Treaties (BITs) and multilateral agreements, primarily administered under the Convention on the Settlement of Investment Disputes between States and Nationals of Other States (the ICSID Convention) in Washington, D.C.",
                "Bilateral Investment Treaties grant qualifying foreign investors direct procedural standing to initiate binding international arbitration against the sovereign host state itself, bypassing local courts entirely. Substantive BIT protections comprise five fundamental standards of treatment: (1) Protection Against Unlawful Expropriation (both direct confiscation and indirect 'creeping expropriation'—requiring that any taking be for a public purpose, non-discriminatory, and accompanied by prompt, adequate, and effective compensation under the Hull Formula), (2) Fair and Equitable Treatment (FET)—protecting the investor's legitimate expectations and barring arbitrary, discriminatory, or bad-faith state measures, (3) Full Protection and Security (FPS)—requiring the state to exercise physical and legal protection over the investor's assets, (4) National Treatment—barring discrimination favoring domestic firms, and (5) Most-Favored-Nation (MFN) Treatment.",
                "Under Article 54 of the ICSID Convention, an arbitral award rendered against a sovereign state is binding and immediately enforceable in all contracting states as if it were a final judgment of a domestic court, without the narrow refusal grounds of the New York Convention.",
                "However, enforcing money judgments against sovereign assets requires overcoming the Foreign Sovereign Immunities Act (FSIA). Under the FSIA, sovereign property is immune from attachment unless the assets are used for 'commercial activity' (such as state-owned commercial airline bank accounts or state trading corporation shipments)."
            ],
            "example": "A foreign mining corporation invests $400M constructing a copper mine pursuant to a 30-year state concession. A newly elected socialist regime passes a decree nationalizing the mine without compensation. The investor files an ICSID arbitration under the applicable Bilateral Investment Treaty, securing an award of $480M for unlawful expropriation, enforceable against the sovereign state's commercial assets worldwide.",
            "code": """# Simulation: Bilateral Investment Treaty (BIT) ISDS Expropriation & Award Engine
from typing import Dict, List, Any

def evaluate_isds_bilateral_investment_treaty_claim(
    investor_company: str,
    host_sovereign_state: str,
    qualifying_foreign_investment_usd: float,
    state_confiscated_assets_without_compensation: bool,
    state_action_for_valid_public_purpose: bool,
    state_breached_investor_legitimate_expectations: bool,
    state_offered_prompt_adequate_compensation: bool,
    sovereign_has_commercial_assets_in_us: bool
) -> dict:
    bit_violations = []
    
    # 1. Expropriation Analysis (Direct or Indirect / Creeping)
    is_unlawful_expropriation = False
    if state_confiscated_assets_without_compensation:
        if not state_action_for_valid_public_purpose:
            bit_violations.append("UNLAWFUL_EXPROPRIATION_NO_PUBLIC_PURPOSE")
            is_unlawful_expropriation = True
        if not state_offered_prompt_adequate_compensation:
            bit_violations.append("EXPROPRIATION_WITHOUT_HULL_FORMULA_COMPENSATION")
            is_unlawful_expropriation = True
            
    # 2. Fair and Equitable Treatment (FET) Breach
    if state_breached_investor_legitimate_expectations:
        bit_violations.append("BREACH_OF_FAIR_AND_EQUITABLE_TREATMENT_FET")
        
    has_valid_isds_claim = len(bit_violations) > 0
    
    # 3. ICSID Damages Valuation (Discounted Cash Flow Fair Market Value)
    if has_valid_isds_claim:
        damages_awarded_usd = qualifying_foreign_investment_usd * 1.35 # Investment + compounded ROI
        icsid_tribunal_verdict = "SOVEREIGN_FOUND_LIABLE_FOR_TREATY_BREACH"
    else:
        damages_awarded_usd = 0.0
        icsid_tribunal_verdict = "STATE_REGULATORY_POLICE_POWERS_UPHELD"
        
    # 4. Sovereign Immunity & FSIA Execution Audit (28 U.S.C. § 1605)
    fsia_commercial_exception = sovereign_has_commercial_assets_in_us and has_valid_isds_claim
    execution_status = "FSIA_COMMERCIAL_ASSETS_ATTACHABLE" if fsia_commercial_exception else "SOVEREIGN_IMMUNITY_BLOCKS_EXECUTION"
    
    return {
        "investor": investor_company,
        "host_state": host_sovereign_state,
        "has_valid_isds_claim": has_valid_isds_claim,
        "tribunal_verdict": icsid_tribunal_verdict,
        "treaty_violations": bit_violations,
        "damages_awarded_usd": round(damages_awarded_usd, 2),
        "fsia_execution_status": execution_status
    }

# Execute deterministic simulation
isds_res = evaluate_isds_bilateral_investment_treaty_claim(
    investor_company="Pacifica Critical Minerals Corp",
    host_sovereign_state="Republic of Andina",
    qualifying_foreign_investment_usd=350_000_000.0,
    state_confiscated_assets_without_compensation=True,
    state_action_for_valid_public_purpose=True, # Alleged public resource policy
    state_breached_investor_legitimate_expectations=True,
    state_offered_prompt_adequate_compensation=False, # Zero compensation offered
    sovereign_has_commercial_assets_in_us=True
)
print(f"Investor: {isds_res['investor']} v. {isds_res['host_state']}")
print(f"ISDS Claim Valid: {isds_res['has_valid_isds_claim']} -> Verdict: {isds_res['tribunal_verdict']}")
print(f"Treaty Breaches: {isds_res['treaty_violations']}")
print(f"Damages Awarded: ${isds_res['damages_awarded_usd']:,.2f}")
print(f"FSIA Asset Execution: {isds_res['fsia_execution_status']}")
""",
            "output": """Investor: Pacifica Critical Minerals Corp v. Republic of Andina
ISDS Claim Valid: True -> Verdict: SOVEREIGN_FOUND_LIABLE_FOR_TREATY_BREACH
Treaty Breaches: ['EXPROPRIATION_WITHOUT_HULL_FORMULA_COMPENSATION', 'BREACH_OF_FAIR_AND_EQUITABLE_TREATMENT_FET']
Damages Awarded: $472,500,000.00
FSIA Asset Execution: FSIA_COMMERCIAL_ASSETS_ATTACHABLE""",
            "tryIt": "Set `state_confiscated_assets_without_compensation` to False and observe how legitimate exercise of regulatory police powers defends against expropriation claims.",
            "check": {
                "question": "Under the Hull Formula recognized in international investment law and Bilateral Investment Treaties, what compensation must a sovereign state provide to lawfully expropriate foreign investor property?",
                "options": [
                    "Promissory notes payable over 100 years at zero percent interest",
                    "Prompt, adequate, and effective compensation representing the full fair market value of the expropriated asset",
                    "A formal diplomatic apology delivered to the United Nations",
                    "Shares in the host state's unprofitable state airline"
                ],
                "answerIndex": 1,
                "explanation": "The Hull Formula mandates that lawful expropriation requires prompt, adequate (fair market value), and effective (freely convertible currency) compensation.",
                "why": "This international legal standard prevents sovereign states from nationalizing foreign infrastructure without reimbursing the capital providers."
            },
            "codeNotes": [
                "`evaluate_isds_bilateral_investment_treaty_claim` codifies substantive Bilateral Investment Treaty (BIT) standards.",
                "Evaluates unlawful direct and creeping expropriation against the Hull Formula.",
                "Applies the Foreign Sovereign Immunities Act (FSIA) commercial activity exception for post-award asset attachment."
            ]
        },
        {
            "title": "🏆 Grand Final Boardroom Defense: Sovereign Transnational Enterprise Control Tower",
            "say": [
                "We now stand at the summit of Course 29: Corporate & Commercial Law, Contracts & Governance. To achieve complete curriculum finalization and earn the prestigious accreditation of Certified Master Transnational Corporate Counsel & Chief Legal Officer, we execute the ultimate grand capstone simulation: the 'Sovereign Transnational Enterprise Governance, Cross-Border M&A & Global Enforcement Control Tower'.",
                "This simulation places you in the executive command center as Global Chief Legal Officer of 'Aegis Transnational Industrial Group SE'—a global industrial and technological conglomerate with parent headquarters in the European Union, primary listings on the NYSE and London Stock Exchange, and worldwide operating assets valued at $4.2B across 45 nations.",
                "The master simulation models a simultaneous five-tier geopolitical, transactional, and regulatory trial: (1) Tier 1: BEPS 2.0 Pillar Two & Economic Substance Governance—auditing 12 foreign intermediate holding subsidiaries, ensuring 100% compliance with substance rules and calculating top-up tax distributions, (2) Tier 2: Transnational Takeover Defense & Cross-Border Merger Clearance—navigating an unsolicited $4.2B hostile takeover bid, harmonizing Delaware Unocal poison pill strategies with UK Takeover Code Rule 21 non-frustration mandates and securing multi-regulator HSR/EU/CMA antitrust clearances, (3) Tier 3: Global Supply Chain ESG & Modern Slavery Defense—executing German LkSG and EU CSDDD compliance across 850 suppliers, eliminating European civil tort exposure under Article 29, (4) Tier 4: FCPA, UKBA & DOJ Corporate Enforcement Policy Settlement—triage of a major cross-border bribery investigation, securing a full DOJ Criminal Declination with zero penalties and clawing back $6.5M in executive bonuses, and (5) Tier 5: Sovereign Investor-State Treaty Enforcement—recovering $472.5M under an ICSID Bilateral Investment Treaty award for expropriated mining assets via FSIA commercial attachment.",
                "Let us execute the master capstone simulation and enter the executive boardroom defense."
            ],
            "example": "Aegis Transnational Industrial Group executes an end-to-end global legal defense: clearing a $4.2B cross-border transaction, securing a DOJ FCPA criminal declination, shielding €113M in European ESG tort liabilities, and recovering $472.5M in an ICSID sovereign award, earning a perfect 100/100 composite score.",
            "code": """# Simulation: Sovereign Transnational Enterprise Governance Master Control Tower
from typing import Dict, List, Any

def simulate_master_transnational_general_counsel_boardroom_defense(
    corporation_name: str,
    enterprise_valuation_usd: float,
    tier1_pillar2_substance_verified: bool,
    tier2_transnational_ma_and_takeover_cleared: bool,
    tier3_csddd_and_lksg_esg_tort_shielded: bool,
    tier4_doj_fcpa_declination_secured: bool,
    tier5_isds_icsid_sovereign_recovery_achieved: bool
) -> dict:
    scores = {}
    
    # Tier 1: BEPS 2.0 Substance & Governance (20 pts)
    scores["TIER_1_BEPS2_SUBSTANCE"] = 20.0 if tier1_pillar2_substance_verified else 0.0
    
    # Tier 2: Transnational Takeover & M&A Clearance (20 pts)
    scores["TIER_2_TRANSNATIONAL_MA"] = 20.0 if tier2_transnational_ma_and_takeover_cleared else 0.0
    
    # Tier 3: Supply Chain ESG & CSDDD Civil Shield (20 pts)
    scores["TIER_3_ESG_CSDDD_SHIELD"] = 20.0 if tier3_csddd_and_lksg_esg_tort_shielded else 0.0
    
    # Tier 4: FCPA / UKBA DOJ Declination (20 pts)
    scores["TIER_4_ANTI_CORRUPTION_DECLINATION"] = 20.0 if tier4_doj_fcpa_declination_secured else 0.0
    
    # Tier 5: ISDS ICSID Sovereign Recovery (20 pts)
    scores["TIER_5_ISDS_SOVEREIGN_RECOVERY"] = 20.0 if tier5_isds_icsid_sovereign_recovery_achieved else 0.0
    
    composite_score = sum(scores.values())
    
    # Financial Value Preserved & Recovered
    total_value_shielded_and_recovered_usd = (
        enterprise_valuation_usd + # $4.2B transaction preserved
        113_000_000.0 + # ESG fines & tort damages shielded
        54_000_000.0 + # DOJ criminal fine eliminated
        472_500_000.0   # ICSID sovereign award recovered
    )
    
    if composite_score == 100.0:
        boardroom_verdict = "SOVEREIGN_TRANSNATIONAL_CHIEF_LEGAL_OFFICER_ACCREDITED"
        standing = "MASTER_TRANSNATIONAL_CORPORATE_GOVERNANCE_EMERITUS"
    else:
        boardroom_verdict = "SUBOPTIMAL_DEFENSE_TRANSNATIONAL_EXPOSURE_REMAINS"
        standing = "PROBATIONARY_GENERAL_COUNSEL"
        
    return {
        "corporation": corporation_name,
        "composite_boardroom_score": composite_score,
        "defense_verdict": boardroom_verdict,
        "accreditation_standing": standing,
        "tier_evaluations": scores,
        "total_enterprise_value_shielded_usd": total_value_shielded_and_recovered_usd,
        "course29_status": "COURSE_29_BCOM_LAW_100_PERCENT_COMPLETE"
    }

# Execute master capstone simulation
capstone = simulate_master_transnational_general_counsel_boardroom_defense(
    corporation_name="Aegis Transnational Industrial Group SE",
    enterprise_valuation_usd=4_200_000_000.0,
    tier1_pillar2_substance_verified=True,
    tier2_transnational_ma_and_takeover_cleared=True,
    tier3_csddd_and_lksg_esg_tort_shielded=True,
    tier4_doj_fcpa_declination_secured=True,
    tier5_isds_icsid_sovereign_recovery_achieved=True
)
print(f"================================================================================")
print(f"GRAND FINAL CAPSTONE: {capstone['corporation']}")
print(f"Master Boardroom Defense Score: {capstone['composite_boardroom_score']}/100.0")
print(f"Executive Accreditation: {capstone['defense_verdict']}")
print(f"Professional Standing: {capstone['accreditation_standing']}")
print(f"Total Value Shielded & Recovered: ${capstone['total_enterprise_value_shielded_usd']:,.2f}")
print(f"Course Status: {capstone['course29_status']}")
print(f"================================================================================")
for tier, pts in capstone['tier_evaluations'].items():
    print(f" - {tier}: {pts}/20.0 pts")
""",
            "output": """================================================================================
GRAND FINAL CAPSTONE: Aegis Transnational Industrial Group SE
Master Boardroom Defense Score: 100.0/100.0
Executive Accreditation: SOVEREIGN_TRANSNATIONAL_CHIEF_LEGAL_OFFICER_ACCREDITED
Professional Standing: MASTER_TRANSNATIONAL_CORPORATE_GOVERNANCE_EMERITUS
Total Value Shielded & Recovered: $4,839,500,000.00
Course Status: COURSE_29_BCOM_LAW_100_PERCENT_COMPLETE
================================================================================
 - TIER_1_BEPS2_SUBSTANCE: 20.0/20.0 pts
 - TIER_2_TRANSNATIONAL_MA: 20.0/20.0 pts
 - TIER_3_ESG_CSDDD_SHIELD: 20.0/20.0 pts
 - TIER_4_ANTI_CORRUPTION_DECLINATION: 20.0/20.0 pts
 - TIER_5_ISDS_SOVEREIGN_RECOVERY: 20.0/20.0 pts""",
            "tryIt": "Set `tier4_doj_fcpa_declination_secured` to False and observe how failing to secure a declination lowers the composite score to 80.0/100 and revokes the Master accreditation.",
            "check": {
                "question": "What is the primary role of the Chief Legal Officer and Transnational General Counsel in managing multi-jurisdictional legal and regulatory risk for a global enterprise?",
                "options": [
                    "Solely signing vendor nondisclosure agreements and delegating all strategic matters to outside accountants",
                    "Synthesizing corporate governance, cross-border M&A defenses, global tax substance, ESG supply chain liability shields, anti-corruption compliance, and sovereign treaty enforcement into an integrated, proactive balance-sheet protection system",
                    "Advising the board of directors to ignore all foreign legal systems and operate exclusively under local customary law",
                    "Eliminating all internal compliance documentation to prevent discovery in litigation"
                ],
                "answerIndex": 1,
                "explanation": "Modern transnational corporate counsel acts as an executive strategic partner, integrating all legal disciplines to protect enterprise value and maintain global regulatory license to operate.",
                "why": "This comprehensive capability represents the apex of corporate legal education and commercial jurisprudence."
            },
            "codeNotes": [
                "`simulate_master_transnational_general_counsel_boardroom_defense` unifies all 30 days of corporate law into a five-tier command tower.",
                "Evaluates BEPS 2.0 substance, cross-border M&A clearances, CSDDD tort shields, DOJ CEP declinations, and ICSID recoveries.",
                "Awards a 100.0/100 composite score conferring Certified Master Transnational Corporate Counsel & Chief Legal Officer accreditation."
            ]
        }
    ]
}
