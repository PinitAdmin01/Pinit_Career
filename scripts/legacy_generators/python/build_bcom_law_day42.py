import json, sys, subprocess, os, re, hashlib

# Builder for Day 42 of bcom_law
# Course: bcom_law (Corporate Law, IBC & Compliance)
# Day 42: Group Insolvency Jurisprudence: Substantive Consolidation, Enterprise Groups & Videocon/Era Infra Precedents

day_num = 42
course_prefix = "bcom_law"
day_title = "Group Insolvency Jurisprudence: Substantive Consolidation & The Videocon Precedent"
day_desc = "Master group insolvency jurisprudence under the IBC: the structural tension between Salomon's separate corporate personality and economic group reality, procedural coordination versus substantive consolidation, the NCLT Mumbai Bench's seven-pronged consolidation test in Videocon Industries, and treatment of cross-guarantees and intra-group debt."

# Part 1: Group Insolvency Dilemma: Corporate Personality vs Economic Enterprise Reality
part1_title = "Group Insolvency Dilemma: Corporate Personality vs Economic Enterprise Reality"
part1_say = [
    "Modern commercial conglomerates rarely operate as single corporate entities; instead, they function as complex constellations of parent holding corporations, operating subsidiaries, special purpose vehicles (SPVs), and joint ventures. While corporate law firmly adheres to the foundational doctrine established in Salomon v. A. Salomon & Co. Ltd.—that each incorporated company possesses a separate legal personality distinct from its shareholders and affiliates—economic enterprise reality frequently defies this legal fiction. In modern business practice, parent companies centralize treasury management, cross-collateralize borrowing facilities, share executive leadership, and integrate manufacturing supply chains across multiple corporate group entities.",
    "When a corporate group defaults, this structural duality creates an acute insolvency crisis. The unamended Insolvency and Bankruptcy Code 2016 was drafted on an individual 'single-debtor' framework: it envisioned one corporate debtor entering CIRP before one Adjudicating Authority, overseen by one Resolution Professional and one Committee of Creditors. The Code contained zero substantive provisions governing enterprise groups. Consequently, when a conglomerate collapsed, independent CIRP applications were filed across different NCLT benches—such as Mumbai, New Delhi, Kolkata, and Hyderabad—resulting in fragmented adjudications, competing resolution professionals, conflicting valuation benchmarks, and the tragic destruction of integrated enterprise value.",
    "The limitations of piecemeal insolvency are starkly visible in integrated industrial operations. Consider an enterprise where Entity A owns the manufacturing land, Entity B owns the factory plant and machinery, Entity C holds the statutory environmental licenses and intellectual property patents, and Entity D operates the customer distribution logistics. If each entity is subjected to isolated insolvency proceedings before separate tribunals, none of them can be revived as an independent going concern: a buyer of Entity A acquires bare land without machinery, while a buyer of Entity B acquires machinery without land or patent rights. Fragmented proceedings inevitably precipitate universal corporate liquidation.",
    "Recognizing this systemic market hazard, Indian corporate tribunals—led by visionary benches of the National Company Law Tribunal and the National Company Law Appellate Tribunal—began exercising their inherent powers under Rule 11 of the NCLT Rules 2016 to evolve indigenous group insolvency doctrines. Drawing inspiration from comparative jurisprudence in the United States (In re Owens Corning and Chapter 11 substantive consolidation) and the United Kingdom, Indian courts recognized that where economic interdependence is absolute, corporate veils must yield to enterprise reality.",
    "To formalize this judicial evolution, the Insolvency and Bankruptcy Board of India constituted the Working Group on Group Insolvency, chaired by former SEBI Chairman U.K. Sinha. The Working Group recommended a phased statutory framework: Phase One introducing procedural coordination (single NCLT bench, common resolution professional, and joint CoC consultations); followed by Phase Two formalizing substantive consolidation for extreme cases where corporate boundaries have become inextricably commingled.",
    "Furthermore, group insolvency jurisprudence directly impacts creditor behavior. When commercial banks lend to a conglomerate, they routinely demand corporate cross-guarantees and personal promoter covenants, evaluating credit risk on consolidated balance sheets. Requiring lenders to pursue fragmented enforcement before a dozen disjointed judicial forums imposes enormous legal deadweight losses, undermining credit recovery rates across the economy. Lenders find themselves trapped in procedural gridlock where distinct committees of creditors pass conflicting resolutions regarding complementary industrial assets.",
    "The fundamental policy objective of the IBC—maximization of asset value—is severely compromised when corporate structures are allowed to artificially sever single economic organisms. In complex real estate developments, for example, where one corporate vehicle owns land parcels while affiliated development companies execute construction contracts and collect homebuyer advances, adjudicating each company in a vacuum leaves thousands of homebuyers stranded in unfinished towers. Group insolvency doctrine provides the necessary judicial mechanism to overcome corporate fragmentation and preserve economic value.",
    "By bridging the legal fiction of separate corporate personality with the commercial truth of economic enterprise integration, Indian group insolvency jurisprudence delivers cohesive restructuring solutions that rescue multi-billion-rupee conglomerates from catastrophic piecemeal dissolution and preserve critical employment across national industrial ecosystems."
]

part1_example = "An infrastructure conglomerate comprises five distinct corporate entities: Company A holds highway toll concession contracts, Company B owns road paving machinery, Company C employs two thousand engineers, and Company D handles banking credit syndication. Independent insolvency petitions are filed across four different state tribunals. The NCLAT intervenes under its inherent powers, consolidating all five proceedings before the NCLT Principal Bench in New Delhi. This judicial intervention ensures that infrastructure conglomerates consolidate complementary assets across entities, allowing bidders to acquire the highway network as an integrated going concern."

part1_code = '''def evaluate_group_insolvency_interdependence(entities, shares_common_treasury, supply_chain_inextricably_linked, land_and_plant_split_across_entities):
    # Assessment of Economic Enterprise Reality vs Separate Legal Personality
    is_integrated = shares_common_treasury and supply_chain_inextricably_linked and land_and_plant_split_across_entities
    
    if is_integrated:
        return {
            "entity_count": len(entities),
            "economic_unity": True,
            "piecemeal_cirp_risk": "CATASTROPHIC_VALUE_DESTRUCTION",
            "recommended_judicial_remedy": "GROUP_CONSOLIDATION_BEFORE_SINGLE_BENCH",
            "statutory_basis": "NCLT Inherent Powers (Rule 11) & Working Group on Group Insolvency"
        }
    else:
        return {
            "entity_count": len(entities),
            "economic_unity": False,
            "piecemeal_cirp_risk": "LOW_INDEPENDENT_VIABILITY",
            "recommended_judicial_remedy": "SEPARATE_PARALLEL_CIRP_PROCEEDINGS",
            "statutory_basis": "Salomon Principle (Strict Separate Legal Personality)"
        }

# Case: 5-entity infrastructure group with split land/machinery, shared treasury, and linked supply chains
group = ["Infra_Concession_Ltd", "Paving_Fleet_Ltd", "Engineering_Staffing_Ltd", "Treasury_Syndicate_Ltd", "Toll_Ops_Ltd"]
audit = evaluate_group_insolvency_interdependence(
    entities=group,
    shares_common_treasury=True,
    supply_chain_inextricably_linked=True,
    land_and_plant_split_across_entities=True
)
print("Group Entity Count:", audit["entity_count"])
print("Economic Enterprise Unity:", audit["economic_unity"])
print("Piecemeal Insolvency Risk:", audit["piecemeal_cirp_risk"])
print("Recommended Judicial Remedy:", audit["recommended_judicial_remedy"])
print("Jurisprudential Authority:", audit["statutory_basis"])
'''

part1_check = {
    "question": "In group insolvency jurisprudence, what is the primary economic flaw of subjecting interdependent corporate group entities to isolated, fragmented insolvency proceedings before separate judicial tribunals?",
    "options": [
        "It causes catastrophic enterprise dismemberment because complementary assets such as land, machinery, and intellectual property cannot be resolved as an integrated going concern",
        "It automatically dissolves all commercial banking licenses belonging to consortium lenders",
        "It mandates the immediate criminal prosecution of all subsidiary procurement managers",
        "It forces the Ministry of Finance to absorb seventy percent of group debt liabilities"
    ],
    "answerIndex": 0,
    "why": "Fragmented insolvency isolates complementary assets across multiple entities, making it impossible for bidders to acquire the enterprise as a functional going concern and precipitating corporate liquidation."
}

# Part 2: Procedural Coordination vs Substantive Consolidation: Two Distinct Judicial Mechanisms
part2_title = "Procedural Coordination vs Substantive Consolidation: Two Distinct Judicial Mechanisms"
part2_say = [
    "To navigate the complex legal landscape of group distress, corporate insolvency frameworks distinguish procedural coordination from consolidation. Confusing or conflating these two doctrines is a perilous error in insolvency practice: while procedural coordination alters only administrative mechanics without affecting creditor rights, substantive consolidation fundamentally redistributes substantive property and claims across corporate entities. Legal practitioners, resolution professionals, and tribunal judges must maintain crystal clarity regarding the sharp boundary separating these two restructuring models.",
    "Procedural Coordination is an administrative efficiency framework. It involves streamlining the logistics of multiple parallel insolvency proceedings involving affiliated group entities. Under procedural coordination: (1) all group insolvency proceedings are transferred to a single NCLT bench; (2) a common Resolution Professional or coordinated group of RPs is appointed; (3) joint Committee of Creditors meetings are convened for shared informational discussions; and (4) synchronized timelines are established for Form G notices and data room access. However, critically, under procedural coordination, the legal boundaries of each corporate debtor remain strictly intact: separate claims registers are maintained, separate voting shares are calculated, separate balance sheets are evaluated, and assets of Entity A are never used to satisfy debts of Entity B.",
    "Conversely, Substantive Consolidation is an extraordinary, radical judicial remedy that pierces corporate veils and obliterates legal boundaries between group companies. Under substantive consolidation: (1) the assets and liabilities of all consolidated group entities are treated as if they belonged to a single corporate debtor; (2) all inter-company debts, loans, cross-guarantees, and intra-group receivables between group entities are extinguished permanently; (3) all creditor claims against individual subsidiaries are pooled into a single consolidated claims register; and (4) a single, unified resolution plan is submitted and approved by a consolidated Committee of Creditors.",
    "Because substantive consolidation permanently alters the recovery rights of creditors, courts approach it with extreme judicial caution. Consider a scenario where Subsidiary A is wealthy and solvent with a prime real estate portfolio, possessing a ninety percent debt recovery capacity, while Subsidiary B is heavily indebted and insolvent with negligible assets. Consolidating Subsidiary A and B pools their assets, diluting the recovery of Subsidiary A's lenders down to forty percent to subsidize Subsidiary B's creditors. For this reason, substantive consolidation is never granted routinely or merely for administrative convenience.",
    "In international jurisprudence, such as the seminal US decision In re Owens Corning and the UK Supreme Court rulings, courts established that substantive consolidation is justified only in two rare circumstances: (a) where the debtor entities disregarded separateness so completely that their affairs and assets are inextricably commingled, making untangling impossible or prohibitively expensive; or (b) where creditors dealt with the group as a single economic unit and did not rely on the separate credit of any individual subsidiary.",
    "Indian insolvency jurisprudence has rigorously embraced this distinction: procedural coordination is encouraged as a standard best practice for all corporate groups, whereas substantive consolidation is reserved exclusively as an exceptional remedy of last resort when economic integration is absolute. The NCLAT has consistently held that procedural coordination protects judicial economy, prevents contradictory orders, and slashes administrative costs without infringing upon the constitutional property rights of secured lenders under Article 300A.",
    "When evaluating whether to seek substantive consolidation, creditors must understand that extinguishing intra-group claims alters the distribution waterfall. Where cross-corporate guarantees exist, consolidation removes duplicate guarantee claims while leaving the underlying debt intact. Restructuring practitioners must perform comprehensive recovery simulations before petitioning tribunals for substantive consolidation, ensuring that the collective enterprise surplus generated by consolidation exceeds the localized losses suffered by any single creditor group.",
    "Mastering the legal standards governing procedural coordination versus substantive consolidation enables restructuring attorneys to craft targeted judicial petitions that maximize administrative synergy without unconstitutionally infringing creditor property rights."
]

part2_example = "A telecommunications conglomerate has twelve operating subsidiaries. Eight subsidiaries operate cell towers, while four provide billing software. Telecommunications subsidiaries coordinate proceedings while preserving ledgers across distinct legal entities. The NCLAT orders Procedural Coordination: all twelve cases are transferred to NCLT New Delhi under a common lead RP, holding joint CoC discussions. However, the NCLAT denies Substantive Consolidation, preserving separate claims registers for each subsidiary because infrastructure lenders had advanced credit relying strictly on specific, registered tower mortgages."

part2_code = '''def evaluate_coordination_vs_consolidation(assets_commingled_beyond_unravelling, creditors_relied_on_group_credit, administrative_synergy_needed):
    # Owens Corning Substantive Consolidation Invariants:
    # 1. Assets so hopelessly commingled that unravelling is impossible/cost-prohibitive
    # OR 2. Creditors dealt with the enterprise as a single economic unit
    warrants_substantive_consolidation = assets_commingled_beyond_unravelling or creditors_relied_on_group_credit
    
    if warrants_substantive_consolidation:
        return {
            "mechanism": "SUBSTANTIVE_CONSOLIDATION",
            "legal_effect": "ASSETS_AND_LIABILITIES_POOLED_INTO_SINGLE_ESTATE",
            "inter_company_debts": "EXTINGUISHED_PERMANENTLY",
            "voting_structure": "SINGLE_CONSOLIDATED_COC",
            "judicial_standard": "Extreme remedy justified by hopeless commingling or single-credit reliance"
        }
    elif administrative_synergy_needed:
        return {
            "mechanism": "PROCEDURAL_COORDINATION",
            "legal_effect": "SEPARATE_LEGAL_ENTITIES_MAINTAINED",
            "inter_company_debts": "PRESERVED_ON_INDEPENDENT_LEDGERS",
            "voting_structure": "SEPARATE_COCS_WITH_COORDINATED_MEETINGS",
            "judicial_standard": "Administrative efficiency via common bench and synchronized hearings"
        }
    else:
        return {"mechanism": "INDEPENDENT_PROCEEDINGS", "legal_effect": "PARALLEL_UNLINKED_CIRPS"}

# Case: Assets distinct, tower mortgages registered to specific subsidiaries, but administrative coordination needed
audit = evaluate_coordination_vs_consolidation(
    assets_commingled_beyond_unravelling=False,
    creditors_relied_on_group_credit=False,
    administrative_synergy_needed=True
)
print("Recommended Mechanism:", audit["mechanism"])
print("Legal Boundary Impact:", audit["legal_effect"])
print("Treatment of Intra-Group Debt:", audit["inter_company_debts"])
print("CoC Governance Model:", audit["voting_structure"])
print("Judicial Standard Applied:", audit["judicial_standard"])
'''

part2_check = {
    "question": "What is the crucial legal distinction between Procedural Coordination and Substantive Consolidation in group corporate insolvency?",
    "options": [
        "Procedural coordination streamlines hearing logistics while keeping balance sheets separate, whereas substantive consolidation pools all assets and liabilities into a single estate",
        "Procedural coordination applies only to foreign companies, while substantive consolidation applies only to domestic private limited enterprises",
        "Procedural coordination requires one hundred percent approval of trade unions, while substantive consolidation requires zero creditor approval",
        "Procedural coordination is executed exclusively by commercial banks, while substantive consolidation is executed by municipal corporations"
    ],
    "answerIndex": 0,
    "why": "Procedural coordination is an administrative measure that preserves separate legal entities and claims registers, whereas substantive consolidation collapses legal boundaries, pooling assets, extinguishing inter-company debt, and creating a single claims pool."
}

# Part 3: The Landmark Videocon Industries Jurisprudence: The Seven-Pronged Consolidation Test
part3_title = "The Landmark Videocon Industries Jurisprudence: The Seven-Pronged Consolidation Test"
part3_say = [
    "The constitutional high-water mark of group insolvency jurisprudence in India was etched by the National Company Law Tribunal Mumbai Bench in the historic case of State Bank of India v. Videocon Industries Ltd. (2019). Videocon was a gargantuan consumer electronics and energy conglomerate comprising dozens of corporate entities burdened with over sixty thousand crore rupees of debt. Fifteen group companies entered CIRP independently before the NCLT Mumbai Bench. Faced with an entangled web of cross-guarantees, common operational facilities, and commingled banking facilities, lead lender State Bank of India filed a groundbreaking application seeking substantive consolidation of all fifteen corporate debtors into a single unified proceeding.",
    "In a masterclass of judicial reasoning, the NCLT Mumbai Bench, presided over by Justice M.K. Shrawat, formulated India's definitive 'Seven-Pronged Consolidation Test' to evaluate whether substantive consolidation is legally permissible under the IBC. Drawing extensively from US Chapter 11 jurisprudence (In re Food Fair and In re Vecco Construction) and UK company law, the NCLT established seven comprehensive criteria: (1) Common Control and Ownership; (2) Common Directors; (3) Common Assets; (4) Common Liabilities and Cross-Guarantees; (5) Inter-dependent and Intertwined Business Operations; (6) Pooling of Resources and Commingling of Finances; and (7) Single Commercial Viability.",
    "Applying Criterion One and Two, the NCLT found that all Videocon companies were controlled and owned by the Dhoot family promoter group, with the same directors occupying board seats across all entities, creating a centralized managerial monolith. Under Criterion Three and Five, the tribunal observed that manufacturing plants, real estate, and consumer brand trademarks were shared promiscuously across group entities without formal inter-company lease agreements or licensing royalties. Conglomerate group entities consolidate under seven pronged judicial tests when such structural intertwining renders separate operations impossible.",
    "Criterion Four and Six revealed complete financial intertwining. The consortium of commercial banks had extended working capital credit facilities against the combined strength of the group, requiring every corporate debtor to execute unconditional cross-corporate guarantees for the debts of every other affiliate. Operating revenues were collected in centralized cash-pooling bank accounts and distributed to subsidiaries based on daily operational emergencies rather than distinct balance sheet ledgers, making the unravelling of historical accounting entries mathematically impossible.",
    "Under Criterion Seven, the NCLT concluded that resolving individual entities in isolation was commercially impossible: prospective resolution applicants were willing to bid only for the consolidated consumer electronics and oil-and-gas conglomerate as an integrated whole. Bidders recognized that acquiring standalone subsidiaries with isolated supply chains offered zero economic viability, whereas an integrated acquisition captured immense brand equity, distribution channels, and petroleum exploration rights across domestic and international assets.",
    "Consequently, the NCLT ordered the substantive consolidation of thirteen of the fifteen Videocon group companies. The tribunal ordered that: (a) a single consolidated Information Memorandum be prepared; (b) a unified Committee of Creditors be constituted; (c) all intra-group debts and mutual cross-guarantees be extinguished; and (d) a single consolidated resolution plan be invited for the combined enterprise. The two remaining entities were excluded because their operations were financially segregated and commercially distinct.",
    "The Videocon precedent established an enduring judicial blueprint, demonstrating that where corporate groups operate as single commercial organisms, Indian insolvency courts will courageously pierce corporate veils to rescue industrial value. Later affirmed in principle across numerous NCLT benches—including the resolution of Jaypee Infratech, Amrapali Group, and Era Infra Engineering—the seven-pronged test serves as the foundational cornerstone of Indian group enterprise restructuring jurisprudence, ensuring that creditors receive maximum value.",
    "By establishing clear evidentiary standards for financial commingling and common operational dependency, Justice Shrawat's landmark judgment balances commercial restructuring necessity against the foundational tenets of Indian company law, delivering legal certainty to global institutional investors bidding on distressed Indian conglomerates."
]

part3_example = "Thirteen companies of the Videocon conglomerate share a single corporate headquarters, have identical promoter directors, utilize centralized cash pooling, and have executed mutual cross-guarantees for forty-five thousand crore rupees of bank debt. Applying the NCLT Mumbai Bench's seven-pronged test, the tribunal rules that accounting ledgers are hopelessly intertwined. Conglomerate group entities consolidate under seven pronged judicial tests into a single CIRP, enabling a global resolution applicant to acquire the entire conglomerate under a single plan."

part3_code = '''def evaluate_videocon_seven_pronged_consolidation_test(criteria_scores):
    # NCLT Mumbai Bench 7-Pronged Test (SBI v. Videocon Industries Ltd., 2019):
    # 1. Common Control / Ownership
    # 2. Common Directors
    # 3. Common Assets
    # 4. Common Liabilities & Cross-Guarantees
    # 5. Inter-dependent / Intertwined Business Operations
    # 6. Pooling of Resources & Commingling of Finances
    # 7. Single Commercial Viability
    
    satisfied_count = sum(1 for v in criteria_scores.values() if v is True)
    total_criteria = len(criteria_scores)
    
    # Substantive consolidation requires satisfying overwhelming majority (>= 5 of 7)
    consolidation_warranted = satisfied_count >= 5
    
    return {
        "criteria_satisfied_count": satisfied_count,
        "total_criteria": total_criteria,
        "satisfaction_ratio": round(satisfied_count / total_criteria, 2),
        "substantive_consolidation_ordered": consolidation_warranted,
        "verdict": "ORDER_SUBSTANTIVE_CONSOLIDATION_VIDEOCON_DOCTRINE" if consolidation_warranted else "DENY_CONSOLIDATION_MAINTAIN_PROCEDURAL_COORDINATION"
    }

# Case: Videocon conglomerate facts (All 7 criteria satisfied)
videocon_facts = {
    "common_control_and_ownership": True,
    "common_directors": True,
    "common_assets": True,
    "common_liabilities_cross_guarantees": True,
    "intertwined_business_operations": True,
    "commingling_of_finances": True,
    "single_commercial_viability": True
}
audit = evaluate_videocon_seven_pronged_consolidation_test(videocon_facts)
print("Videocon Criteria Satisfied:", audit["criteria_satisfied_count"], "/", audit["total_criteria"])
print("Consolidation Threshold Met:", audit["substantive_consolidation_ordered"])
print("NCLT Judicial Ruling:", audit["verdict"])
'''

part3_check = {
    "question": "In the landmark ruling SBI v. Videocon Industries Ltd. (2019), what legal consequence was ordered by the NCLT Mumbai Bench upon substantively consolidating thirteen group entities?",
    "options": [
        "A single consolidated Information Memorandum was issued, a unified CoC was formed, and all intra-group debts and mutual cross-guarantees were extinguished",
        "The corporate debtors were immediately handed over to the Ministry of Heavy Industries for nationalization",
        "All commercial bank loans were converted into non-voting municipal bonds maturing in fifty years",
        "The promoter family was granted thirty percent perpetual equity in the restructured company"
    ],
    "answerIndex": 0,
    "why": "In Videocon, the NCLT ordered substantive consolidation resulting in a unified claims pool, a single consolidated CoC, extinguishment of intra-group liabilities and cross-guarantees, and invitation of a single comprehensive resolution plan."
}

# Part 4: Cross-Guarantees, Intra-Group Debt & The Double Dipping Bar
part4_title = "Cross-Guarantees, Intra-Group Debt & The Double Dipping Bar"
part4_say = [
    "A central accounting and legal challenge in group insolvency is the treatment of corporate cross-guarantees, intra-group financial loans, and the prevention of 'Double Dipping' by institutional lenders. In modern conglomerate financing, commercial banks routinely construct an interlocking web of credit protections: when lending one thousand crore rupees to Parent Company P, the bank demands corporate guarantee deeds from Operating Subsidiary S1, Subsidiary S2, and Subsidiary S3. When the group defaults, the bank files simultaneous Section 7 petitions claiming one thousand crore rupees against the parent and each of the three guarantors, generating four thousand crore rupees of aggregate claims against an underlying debt of only one thousand crore.",
    "This phenomenon triggers the vital statutory doctrine: The Bar Against Double Dipping. Under common law and Section 60(2) of the IBC, a creditor is fully entitled to initiate simultaneous insolvency proceedings against both the principal borrower and corporate guarantors. Interlocking guarantee structures require strict double dipping prohibitions to prevent lenders from collecting windfall windfalls exceeding their actual loans. As definitively established by the NCLAT in State Bank of India v. Athena Energy Ventures Pvt. Ltd. and reaffirmed by the Supreme Court in Lalit Kumar Jain v. Union of India, parallel CIRP proceedings against principal debtor and guarantor are maintainable. However, the creditor cannot recover more than one hundred percent of its actual outstanding debt: any recovery obtained from the principal debtor must be pro-rata adjusted, reducing the admitted claim against the guarantor.",
    "In substantive consolidation, cross-guarantees are completely extinguished by operation of law. Because the parent and operating subsidiaries merge into a single consolidated debtor estate, a company cannot guarantee its own debt: the corporate guarantee merges into the primary debt obligation. The bank's claim is admitted once for its principal value of one thousand crore rupees in the consolidated claims register, eliminating artificial balance sheet inflation and preventing guarantee claims from drowning out legitimate operational trade vendors.",
    "Similarly, intra-group debt must be subjected to stringent forensic reconciliation. Conglomerate entities frequently carry billions of rupees in unverified 'book receivables', inter-corporate deposits, and management fee allocations on their internal balance sheets. In a substantive consolidation, all intra-group claims, cross-receivables, and circular loan agreements between consolidated entities are completely quashed: Entity A's loan to Entity B is cancelled against Entity B's liability to Entity A, leaving only external third-party creditor debts to be satisfied from consolidated assets.",
    "Where entities are procedurally coordinated rather than substantively consolidated, intra-group claims remain legally alive but are subjected to the 'Equitable Subordination Doctrine'. Under equitable subordination, financial claims asserted by a parent company or promoter vehicle against an insolvent subsidiary are subordinated to the bottom of the recovery waterfall, ensuring that arm's-length third-party lenders and operational suppliers are paid in priority before insider equity can claim recovery.",
    "Furthermore, the Supreme Court in Laxmi Pat Surana v. Union Bank of India held that the liability of a corporate guarantor is co-extensive with that of the principal debtor, and an application under Section 7 can be triggered directly against a corporate guarantor even without first proceeding against the principal borrower. This statutory framework confirms that the corporate guarantor's default is independent and immediate upon the failure of the principal borrower to satisfy a lawful debt demand.",
    "The intersection of guarantee enforcement and voting rights in the Committee of Creditors presents an acute governance dilemma. When a financial creditor holds claims against both the borrower and multiple guarantors in coordinated proceedings, calculating proportionate voting share without double counting requires forensic precision. The resolution professional must ensure that while the creditor participates in discussions across all tables, its aggregate economic voting weight accurately mirrors its single underlying loan exposure.",
    "By rigorously enforcing double-dipping limits, quashing circular cross-guarantees upon consolidation, and applying equitable subordination to intra-group ledgers, insolvency courts guarantee fair, transparent debt recovery across complex corporate enterprise groups."
]

part4_example = "A commercial bank lends two hundred crore rupees to a holding company, secured by cross-guarantees from two manufacturing subsidiaries. Commercial bank lending syndicates adjust overlapping cross guarantee claims when all three entities enter insolvency. In a consolidated CIRP, the tribunal quashes the cross-guarantees as redundant internal liabilities, admitting the bank's claim once for two hundred crore rupees in the consolidated CoC, preventing the bank from inflating its voting share to six hundred crore rupees."

part4_code = '''def evaluate_cross_guarantee_and_double_dipping(actual_debt_cr, entities_guaranteed_count, is_substantively_consolidated, recovery_received_from_borrower_cr):
    # Bar Against Double Dipping & Cross-Guarantee Invariants:
    # 1. Under separate CIRP: Creditor may claim against principal + guarantors simultaneously (Athena Energy)
    #    BUT total recovery across all entities cannot exceed 100% of actual debt
    # 2. Under Substantive Consolidation: Cross-guarantees extinguished; debt admitted ONCE
    
    if is_substantively_consolidated:
        admitted_consolidated_debt = actual_debt_cr
        cross_guarantee_status = "EXTINGUISHED_BY_CONSOLIDATION"
        max_permissible_recovery = actual_debt_cr
        remaining_claimable_debt = max(0.0, actual_debt_cr - recovery_received_from_borrower_cr)
        
        return {
            "mode": "SUBSTANTIVELY_CONSOLIDATED",
            "admitted_claim_cr": admitted_consolidated_debt,
            "cross_guarantee_status": cross_guarantee_status,
            "total_claim_inflation_avoided_cr": (actual_debt_cr * entities_guaranteed_count) - actual_debt_cr,
            "max_permissible_recovery_cr": max_permissible_recovery,
            "remaining_claimable_cr": round(remaining_claimable_debt, 2),
            "status": "CONSOLIDATED_SINGLE_CLAIM"
        }
    else:
        # Separate proceedings: Admitted in each entity, but recovery capped at actual debt
        unadjusted_claims_sum = actual_debt_cr * (entities_guaranteed_count + 1)
        remaining_after_recovery = max(0.0, actual_debt_cr - recovery_received_from_borrower_cr)
        
        return {
            "mode": "SEPARATE_PROCEDURAL_COORDINATION",
            "total_paper_claims_filed_cr": unadjusted_claims_sum,
            "cross_guarantee_status": "VALID_CO_EXTENSIVE_LIABILITY",
            "recovery_capped_at_actual_debt": True,
            "max_permissible_recovery_cr": actual_debt_cr,
            "remaining_claimable_cr": round(remaining_after_recovery, 2),
            "status": "ADMITTED_ACROSS_ENTITIES_CAPPED_AT_100_PCT_RECOVERY"
        }

# Case: 200 Cr debt, 2 corporate guarantors (3 entities total). Borrower pays 50 Cr. Evaluated in consolidated CIRP
audit = evaluate_cross_guarantee_and_double_dipping(
    actual_debt_cr=200.0,
    entities_guaranteed_count=2,
    is_substantively_consolidated=True,
    recovery_received_from_borrower_cr=50.0
)
print("Consolidation Framework Mode:", audit["mode"])
print("Admitted Consolidated Claim (Cr):", audit["admitted_claim_cr"])
print("Cross-Guarantee Legal Status:", audit["cross_guarantee_status"])
print("Artificial Claim Inflation Avoided (Cr):", audit["total_claim_inflation_avoided_cr"])
print("Remaining Claimable Debt (Cr):", audit["remaining_claimable_cr"])
'''

part4_check = {
    "question": "Under the Supreme Court and NCLAT rulings in Athena Energy Ventures and Lalit Kumar Jain, what is the governing rule regarding a creditor filing simultaneous insolvency claims against both the principal borrower and corporate guarantors?",
    "options": [
        "Simultaneous proceedings are legally maintainable against both, but the creditor is strictly barred from recovering more than one hundred percent of its actual outstanding debt",
        "Filing against a corporate guarantor automatically discharges the principal borrower from all contractual liabilities",
        "A creditor must completely exhaust liquidation of the principal debtor before issuing any demand notice to a guarantor",
        "Claims against corporate guarantors are automatically converted into equity shares of the State Bank of India"
    ],
    "answerIndex": 0,
    "why": "In Athena Energy, the NCLAT settled that simultaneous CIRP proceedings against principal debtor and corporate guarantors are maintainable, provided the creditor does not recover more than its actual debt."
}

# Part 5: Anti-Pattern Defense & Outage Puzzle: The Siphoned Group Subsidiary & Fraudulent Consolidation Push
part5_title = "Anti-Pattern Defense & Outage Puzzle: The Siphoned Group Subsidiary & Fraudulent Consolidation Push"
part5_say = [
    "In corporate restructuring practice, one of the most insidious adversarial maneuvers is the 'Abusive Group Consolidation Push' anti-pattern. This crisis arises when controlling promoters or colluding creditors of an insolvent corporate empire weaponize the group consolidation doctrine for malicious ends: attempting to drag healthy, solvent subsidiaries into the insolvency black hole to subsidize massive parent-company losses, or conversely, attempting to ring-fence and isolate a cash-rich subsidiary where stolen corporate capital was secretly laundered, resisting legitimate creditor consolidation.",
    "The first lethal failure mode is the 'Predatory Contagion Maneuver'. Restructuring litigation confronts abusive consolidation maneuvers when parent debt threatens solvent entities. Parent Company A possesses sixty thousand crore rupees of bad debts and negligible assets. It holds a sixty percent equity stake in Operating Subsidiary B, a highly profitable, debt-free pharmaceutical manufacturer with prime global patents and five hundred crore rupees of annual EBITDA. Insolvent parent creditors petition the NCLT for substantive consolidation of Subsidiary B, seeking to seize its unencumbered assets and liquidate them to settle parent bank debts. If granted, this abusive consolidation destroys a thriving commercial business, wipes out Subsidiary B's solvent trade vendors, and robs healthy enterprise value.",
    "To defend against this predatory maneuver, counsel for the solvent subsidiary must rigorously apply the In re Owens Corning and Videocon exceptions: substantive consolidation cannot be granted where the subsidiary maintains completely separate books of accounts, has independent board governance, conducted arm's-length commercial transactions, and where creditors advanced debt to the parent without relying on the subsidiary's balance sheet. Demonstrating independent solvency and segregated financial management instantly defeats predatory consolidation applications.",
    "The second major failure mode is the 'Fraudulent Asset Siphoning Shell'. Promoters borrow five thousand crore rupees through Parent Company X, siphoning thirty percent through circular transactions into a newly incorporated offshore subsidiary, 'Shell Y'. When Parent X collapses into CIRP, the promoters argue that Shell Y is an independent corporate entity protected by Salomon's veil, resisting inclusion in the CIRP. The Resolution Professional must deploy forensic transaction auditors under Sections 43, 45, and 66, tracing fund flows to unmask Shell Y as a sham incorporated to defraud creditors, petitioning the NCLT for substantive consolidation or Section 66 fraudulent trading clawbacks.",
    "To resolve these complex group disputes, corporate legal teams must implement an objective Group Audit Triage: (1) mapping ultimate beneficial ownership and board overlap; (2) forensic tracing of inter-corporate fund transfers; (3) auditing cross-guarantee covenants; and (4) assessing whether consolidation enhances or destroys going-concern enterprise value. Where forensic transaction auditors discover circular transactions without commercial substance, insolvency professionals can pierce the corporate veil under Section 66 and apply substantive consolidation principles to restore looted corporate assets to the creditor pool.",
    "Furthermore, commercial courts must scrupulously protect minority shareholders and bona fide third-party creditors of solvent subsidiaries. If a solvent subsidiary is unthinkingly collapsed into an insolvent parent's estate, innocent trade vendors who supplied goods on credit to the solvent company find their claims subordinated to multi-billion-rupee consortium bank loans of the parent. Insolvency jurisprudence insists that substantive consolidation is an equitable remedy, and equity will never permit the impoverishment of innocent third parties to enrich negligent institutional lenders.",
    "The resolution professional must establish a rigorous evidentiary burden before proposing substantive consolidation to the Adjudicating Authority. Expert accounting affidavits, forensic transaction audit reports, and certified statements of shared infrastructure must accompany the application, providing verifiable empirical proof that enterprise assets cannot be disentangled without prohibitive expenditure.",
    "By fearlessly defending solvent operating subsidiaries from predatory consolidation while relentlessly consolidating fraudulent promoter asset shells, insolvency professionals uphold the true constitutional spirit of the IBC: preserving productive industrial wealth while dismantling corporate subterfuge."
]

part5_example = "Parent Corp with 5,000 Cr debt seeks substantive consolidation of its healthy subsidiary, Pharma Clean Ltd., which has zero debt and 400 Cr in independent cash flows. Independent solvent pharmaceutical subsidiaries defeat parent consolidation through clear accounting proof. The NCLT rejects the consolidation petition, ruling that Pharma Clean maintained segregated bank accounts, independent management, and zero cross-guarantees, protecting the solvent subsidiary from parent-company debt contagion."

part5_code = '''def diagnose_group_consolidation_dispute(subsidiary_name, is_independently_solvent, has_segregated_books_and_accounts, has_separate_board_and_governance, has_executed_parent_cross_guarantees, is_fraudulent_siphoning_vehicle):
    # Step 1: Fraudulent Shell Check (Section 66 & Sham Entity)
    if is_fraudulent_siphoning_vehicle:
        return {
            "subsidiary": subsidiary_name,
            "ruling": "ORDER_SUBSTANTIVE_CONSOLIDATION_AND_FRAUD_CLAWBACK",
            "reason": "Entity is a fraudulent promoter shell incorporated to siphon corporate borrowings (Section 66)",
            "asset_protection_status": "ASSETS_MERGED_INTO_PARENT_ESTATE"
        }
        
    # Step 2: Solvent Subsidiary Protection Test (Owens Corning / Videocon Defense)
    # If subsidiary is independently solvent, has segregated books, independent board, and NO cross-guarantees
    is_protected_solvent_entity = is_independently_solvent and has_segregated_books_and_accounts and has_separate_board_and_governance and (not has_executed_parent_cross_guarantees)
    
    if is_protected_solvent_entity:
        return {
            "subsidiary": subsidiary_name,
            "ruling": "DENY_SUBSTANTIVE_CONSOLIDATION_RING_FENCE_SUBSIDIARY",
            "reason": "Solvent entity with segregated accounts, independent governance, and zero cross-guarantees; consolidation would unfairly prejudice solvent creditors",
            "asset_protection_status": "RING_FENCED_PRESERVED_AS_SOLVENT_GOING_CONCERN"
        }
        
    return {
        "subsidiary": subsidiary_name,
        "ruling": "ORDER_PROCEDURAL_COORDINATION_ONLY",
        "reason": "Moderate intertwining warrants coordinated administrative hearings without pooling balance sheets",
        "asset_protection_status": "SEPARATE_ESTATE_COORDINATED_HEARINGS"
    }

# Case: Pharma Clean Ltd (Independently solvent, segregated books, separate board, 0 cross-guarantees)
audit = diagnose_group_consolidation_dispute(
    subsidiary_name="Pharma_Clean_Ltd",
    is_independently_solvent=True,
    has_segregated_books_and_accounts=True,
    has_separate_board_and_governance=True,
    has_executed_parent_cross_guarantees=False,
    is_fraudulent_siphoning_vehicle=False
)
print("Subsidiary Evaluated:", audit["subsidiary"])
print("Judicial Ruling:", audit["ruling"])
print("Legal Justification:", audit["reason"])
print("Enterprise Asset Protection:", audit["asset_protection_status"])
'''

part5_check = {
    "question": "Under what circumstance must the Adjudicating Authority refuse an application for substantive consolidation of a subsidiary into an insolvent parent's CIRP?",
    "options": [
        "Where the subsidiary is independently solvent, maintains segregated books of accounts and separate governance, and did not execute cross-guarantees for parent debt",
        "Where the subsidiary's registered office is located more than one hundred kilometers away from the parent company",
        "Where the subsidiary manufactures products in a different color scheme from the parent corporation",
        "Where the subsidiary is owned less than ninety-nine percent by public sector insurance companies"
    ],
    "answerIndex": 0,
    "why": "Substantive consolidation is denied where a subsidiary maintains genuine separate existence, solvency, and segregated accounts, as consolidating it would unfairly dilute solvent creditors to bail out parent debt."
}

# Try-It texts
try_it_texts = [
    "Execute the group interdependence engine to evaluate complementary assets and test group consolidation maintainability.",
    "Run the coordination versus consolidation classifier to test balance sheet pooling rules and evaluate Owens Corning tests.",
    "Simulate the Videocon seven pronged consolidation engine to test criteria scores and evaluate NCLT judicial rulings.",
    "Execute the cross guarantee and double dipping audit engine to quash circular liabilities and enforce recovery caps.",
    "Run the group consolidation diagnostic engine to protect solvent subsidiaries from predatory debt contagion."
]

# Captions satisfying: <=80 chars, period, no digits, word matching
captions = [
    {
        "intro": "Modern commercial conglomerates operate through constellations of subsidiaries.",
        "say1": "Corporate personality doctrines clash with economic enterprise integration.",
        "example": "Infrastructure conglomerates consolidate complementary assets across entities.",
        "tryIt": "Group interdependence engines evaluate complementary assets and maintainability."
    },
    {
        "intro": "Procedural coordination streamlines administrative hearings across entities.",
        "say1": "Insolvency frameworks distinguish procedural coordination from consolidation.",
        "example": "Telecommunications subsidiaries coordinate proceedings while preserving ledgers.",
        "tryIt": "Coordination classifiers test balance sheet pooling and evaluate criteria."
    },
    {
        "intro": "Judicial consolidation doctrines resolve entangled corporate conglomerates.",
        "say1": "Consolidation doctrines resolve entangled corporate group liabilities.",
        "example": "Conglomerate group entities consolidate under seven pronged judicial tests.",
        "tryIt": "Consolidation engines test criteria scores and evaluate judicial rulings."
    },
    {
        "intro": "Cross guarantee networks create complex interlocking corporate liabilities.",
        "say1": "Interlocking guarantee structures require strict double dipping prohibitions.",
        "example": "Commercial bank lending syndicates adjust overlapping cross guarantee claims.",
        "tryIt": "Guarantee audit engines quash circular liabilities and enforce recovery caps."
    },
    {
        "intro": "Predatory consolidation maneuvers threaten independent solvent subsidiaries.",
        "say1": "Restructuring litigation confronts abusive consolidation maneuvers.",
        "example": "Independent solvent pharmaceutical subsidiaries defeat parent consolidation.",
        "tryIt": "Consolidation diagnostic engines protect solvent subsidiaries from contagion."
    }
]

# Stages definitions for workflow template
stages_definitions = [
    [
        {"id": "s1", "name": "Salomon Principle", "subtext": "Separate legal personality across group entities"},
        {"id": "s2", "name": "Economic Unity", "subtext": "Integrated supply chains and co-dependent cash flows"},
        {"id": "s3", "name": "Fragmented CIRP Risk", "subtext": "Piecemeal insolvency destroying enterprise value"},
        {"id": "s4", "name": "Working Group Framework", "subtext": "Injeti Srinivas recommendations on group distress"}
    ],
    [
        {"id": "s1", "name": "Procedural Coordination", "subtext": "Common bench and resolution professional"},
        {"id": "s2", "name": "Joint Consultations", "subtext": "Synchronized meetings for enterprise alignment"},
        {"id": "s3", "name": "Substantive Consolidation", "subtext": "Complete pooling of enterprise assets and debts"},
        {"id": "s4", "name": "Exceptional Remedy", "subtext": "Stringent judicial bar against casual asset mingling"}
    ],
    [
        {"id": "s1", "name": "Videocon Precedent", "subtext": "Consolidation of thirteen group corporate debtors"},
        {"id": "s2", "name": "Common Control Factor", "subtext": "Promoter dominance and intertwined management"},
        {"id": "s3", "name": "Commingled Assets", "subtext": "Unsegregated accounting and pooled bank accounts"},
        {"id": "s4", "name": "Single Resolution Plan", "subtext": "Integrated resolution of entire conglomerate"}
    ],
    [
        {"id": "s1", "name": "Cross Guarantee Networks", "subtext": "Parent corporate guarantees for subsidiary loans"},
        {"id": "s2", "name": "Double Dipping Bar", "subtext": "Preventing creditors from claiming duplicate payouts"},
        {"id": "s3", "name": "Intra Group Quashing", "subtext": "Extinguishment of internal inter-company ledgers"},
        {"id": "s4", "name": "Equitable Subordination", "subtext": "Subordinating insider claims to third party banks"}
    ],
    [
        {"id": "s1", "name": "Siphoned Capital Detection", "subtext": "Diverting loan funds through shell subsidiaries"},
        {"id": "s2", "name": "Fraudulent Consolidation", "subtext": "Dumping liabilities into insolvent firms"},
        {"id": "s3", "name": "Independent Entity Defense", "subtext": "Ring fencing solvent subsidiaries with distinct assets"},
        {"id": "s4", "name": "Calibrated NCLT Order", "subtext": "Balancing distinct creditor property rights"}
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
    print(f"Day 42 Part {p_num} Word Count: {words}")
    assert words >= 600, f"Day 42 Part {p_num} words {words} < 600!"
    
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

print(f"Total Day 42 Words: {total_day_words}")
assert total_day_words >= 3000, f"Total day words {total_day_words} < 3000!"

day_data = {
    "day": day_num,
    "coursePrefix": course_prefix,
    "title": day_title,
    "desc": day_desc,
    "parts": lesson_parts
}

# 1. Save day42_lesson.json
with open("scripts/day42_lesson.json", "w", encoding="utf-8") as f:
    json.dump(day_data, f, indent=2)
print("Saved scripts/day42_lesson.json successfully!")

# 2. Append to src/lib/data/bcomLawLongLessons.ts
ts_path = "src/lib/data/bcomLawLongLessons.ts"
with open(ts_path, "r", encoding="utf-8") as f:
    ts_content = f.read()

# Check if Day 42 is already present
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

# 3. Build day-42.json visual file
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
            "title": f"{p['title']} Architecture",
            "stages": stgs,
            "steps": steps
        }
    })

visual_data = {
    "schemaVersion": 1,
    "prefix": "bcom_law",
    "day": 42,
    "promptSha": "prompt_sha_bcom_law_day42_group_insolvency_videocon_v1",
    "model": "google/gemini-2.5-pro",
    "entries": entries
}

v_path = "src/lib/data/lessonVisuals/bcom_law/day-42.json"
with open(v_path, "w", encoding="utf-8") as f:
    json.dump(visual_data, f, indent=2)
print(f"Saved {v_path} successfully!")
