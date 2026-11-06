"""
Course 29: B.Com Corporate & Commercial Law, Contracts & Governance (bcom_law)
Day 9 Builder: Copyright Law, DMCA Safe Harbors & Open-Source Software Licensing
Milestone 2: Intellectual Property & Technology Licensing Architecture
Guarantees >= 580 words per part and >= 2,950 words total with deterministic Python simulations.
"""

from corporate_law_budget_ensurer import ensure_law_day_budget
from visual_builder import count_words

DAY_09 = {
    "coursePrefix": "bcom_law",
    "day": 9,
    "title": "Copyright Law, DMCA Safe Harbors & Open-Source Software Licensing Governance",
    "goal": "Master software and digital copyright jurisprudence under Title 17 of the US Code: apply the Idea-Expression Dichotomy and Abstraction-Filtration-Comparison test to computer programs, enforce the Work-Made-for-Hire doctrine under CCNV v. Reid, evaluate DMCA Section 512 notice-and-takedown safe harbors, conduct Section 107 four-factor Fair Use analysis under Google v. Oracle, and audit reciprocal (GPL) vs permissive (Apache/MIT) open-source license compliance.",
    "minutes": 45,
    "recap": "In Days 6–8, we mastered patents, trademarks, and trade secrets. Today in Day 9, we master Copyright Law and Software Licensing: the legal architecture governing proprietary codebase ownership, cloud platform safe harbors, open-source contamination risks, and fair use boundaries.",
    "parts": [
        {
            "title": "The Idea-Expression Dichotomy & The Abstraction-Filtration-Comparison Test (Computer Associates v. Altai)",
            "say": [
                "Under Article I, Section 8, Clause 8 of the United States Constitution and the Copyright Act of 1976 (17 U.S.C. §§ 101 et seq.), copyright protection subsists in original works of authorship fixed in any tangible medium of expression. Unlike patents, copyright does not protect functional machines or processes; instead, under 17 U.S.C. § 102(b), copyright protection never extends to any idea, procedure, process, system, method of operation, concept, principle, or discovery, regardless of the form in which it is described, explained, illustrated, or embodied.",
                "This fundamental legal boundary is known as the Idea-Expression Dichotomy: the author owns a monopoly only over their specific, original expression, while the underlying ideas, mathematical algorithms, and functional concepts remain completely free for competitors to use and reimplement.",
                "Applying this dichotomy to computer software generated decades of judicial confusion because software is inherently functional—executing mechanical instructions on silicon microprocessors—while simultaneously consisting of expressive textual source code. To resolve software copyright infringement claims, the Second Circuit in Computer Associates International, Inc. v. Altai, Inc. (1992) established the classic three-step Abstraction-Filtration-Comparison (AFC) Test.",
                "In Step 1 (Abstraction), the court dissects the software program into hierarchical layers of decreasing abstraction, moving from the ultimate program purpose, to system architecture, modular flowcharts, parameter call lists, and finally line-by-line source code. In Step 2 (Filtration), the court systematically filters out all unprotectable elements: ideas, public domain elements, hardware constraints, industry standards (scenes a faire doctrine), and elements dictated by efficiency or external compatibility (merger doctrine). In Step 3 (Comparison), the court compares only the remaining 'core of protectable creative expression' against the accused software to determine whether substantial similarity exists.",
                "For corporate technology executives and software engineers, the Altai AFC test validates the legality of 'Cleanroom Reverse Engineering'. A competitor can legally analyze a proprietary software product, document its external functional APIs and parameter inputs in a functional specification document, and hand that specification to an isolated engineering team that has never seen the original source code. Because the cleanroom team writes completely new code to implement the functional idea, zero copyright infringement occurs."
            ],
            "example": "Company A creates an enterprise database connector and sues Competitor B for copying its parameter call routines. Under Altai filtration, the court filters out the parameter names and sorting loops because they are dictated by SQL syntax standards (scenes a faire) and database efficiency. The remaining original variable naming and comments show zero copying. The court dismisses the copyright infringement suit under Altai Step 3.",
            "code": """# Simulation: Abstraction-Filtration-Comparison (AFC) Software Copyright Infringement Engine
from typing import List, Set, Dict

class SoftwareCopyrightAFCEngine:
    @staticmethod
    def execute_afc_test(
        plaintiff_code_modules: List[dict],
        accused_competitor_code: List[dict]
    ) -> dict:
        total_lines_analyzed = sum(m['line_count'] for m in plaintiff_code_modules)
        protectable_core_lines = 0
        filtered_lines_breakdown = {'ideas_and_algorithms': 0, 'efficiency_merger': 0, 'scenes_a_faire_standards': 0}
        
        # Step 2: Filtration of unprotectable elements
        protectable_subroutines = []
        for mod in plaintiff_code_modules:
            filter_reason = mod.get('filtration_status', 'PROTECTABLE_ORIGINAL_EXPRESSION')
            if filter_reason == 'PROTECTABLE_ORIGINAL_EXPRESSION':
                protectable_core_lines += mod['line_count']
                protectable_subroutines.append(mod['module_name'])
            elif filter_reason == 'DICTATED_BY_EFFICIENCY_MERGER':
                filtered_lines_breakdown['efficiency_merger'] += mod['line_count']
            elif filter_reason == 'INDUSTRY_STANDARD_SCENES_A_FAIRE':
                filtered_lines_breakdown['scenes_a_faire_standards'] += mod['line_count']
            else:
                filtered_lines_breakdown['ideas_and_algorithms'] += mod['line_count']

        # Step 3: Comparison of protectable core against accused code
        accused_module_names = set(m['module_name'] for m in accused_competitor_code if m.get('identical_source_copied', False))
        infringing_modules = [name for name in protectable_subroutines if name in accused_module_names]
        
        infringement_established = len(infringing_modules) > 0
        substantial_similarity_ratio = len(infringing_modules) / max(1, len(protectable_subroutines))
        
        return {
            'total_source_lines_evaluated': total_lines_analyzed,
            'filtered_unprotectable_lines': sum(filtered_lines_breakdown.values()),
            'filtered_breakdown': filtered_lines_breakdown,
            'golden_core_protectable_lines': protectable_core_lines,
            'substantial_similarity_ratio': round(substantial_similarity_ratio, 2),
            'infringing_protectable_subroutines': infringing_modules,
            'altai_afc_infringement_verdict': 'COPYRIGHT_INFRINGEMENT_FOUND' if infringement_established else 'NO_INFRINGEMENT_LEGAL_CLEANROOM_REIMPLEMENTATION'
        }

plaintiff_modules = [
    {'module_name': 'b_tree_indexing_algorithm', 'line_count': 1200, 'filtration_status': 'DICTATED_BY_EFFICIENCY_MERGER'},
    {'module_name': 'sql_query_parser_grammar', 'line_count': 850, 'filtration_status': 'INDUSTRY_STANDARD_SCENES_A_FAIRE'},
    {'module_name': 'proprietary_dynamic_cache_eviction', 'line_count': 650, 'filtration_status': 'PROTECTABLE_ORIGINAL_EXPRESSION'},
    {'module_name': 'custom_telemetry_reporting_formatter', 'line_count': 400, 'filtration_status': 'PROTECTABLE_ORIGINAL_EXPRESSION'}
]

accused_code_cleanroom = [
    {'module_name': 'b_tree_indexing_algorithm', 'line_count': 1100, 'identical_source_copied': True},
    {'module_name': 'sql_query_parser_grammar', 'line_count': 800, 'identical_source_copied': True},
    {'module_name': 'proprietary_dynamic_cache_eviction', 'line_count': 600, 'identical_source_copied': False},
    {'module_name': 'custom_telemetry_reporting_formatter', 'line_count': 420, 'identical_source_copied': False}
]

afc_audit = SoftwareCopyrightAFCEngine.execute_afc_test(plaintiff_modules, accused_code_cleanroom)

print(f"Altai AFC Verdict: [{afc_audit['altai_afc_infringement_verdict']}]")
print(f"  Total Lines: {afc_audit['total_source_lines_evaluated']} | Filtered Out: {afc_audit['filtered_unprotectable_lines']} | Core Protectable: {afc_audit['golden_core_protectable_lines']}")
print(f"  Filtered Breakdown: Merger: {afc_audit['filtered_breakdown']['efficiency_merger']} | Standards: {afc_audit['filtered_breakdown']['scenes_a_faire_standards']}")
print(f"  Substantial Similarity: {afc_audit['substantial_similarity_ratio']*100}% | Infringing Modules: {afc_audit['infringing_protectable_subroutines']}")
""",
            "output": "Altai AFC Verdict: [NO_INFRINGEMENT_LEGAL_CLEANROOM_REIMPLEMENTATION]\n  Total Lines: 3100 | Filtered Out: 2050 | Core Protectable: 1050\n  Filtered Breakdown: Merger: 1200 | Standards: 850\n  Substantial Similarity: 0.0% | Infringing Modules: []",
            "codeNotes": [
                {"line": 4, "note": "Implements Computer Associates v. Altai three-step software copyright analysis"},
                {"line": 14, "note": "Applies Step 2 filtration screening out merger efficiency and scenes a faire standards"},
                {"line": 26, "note": "Compares only the filtered core of original creative expression against accused code"},
                {"line": 34, "note": "Validates legal cleanroom reimplementation where only unprotectable functional logic overlaps"}
            ],
            "tryIt": "Set identical_source_copied to True for 'proprietary_dynamic_cache_eviction' in accused_code_cleanroom to trigger infringement.",
            "check": {
                "question": "Under the Abstraction-Filtration-Comparison test established in Computer Associates v. Altai, what elements of a software program must be filtered out before determining infringement?",
                "options": [
                    "Ideas, algorithms, elements dictated by hardware or efficiency (merger doctrine), and elements required by industry compatibility or external standards (scenes a faire).",
                    "Any lines of code written during weekend hours.",
                    "All software subroutines licensed under non-exclusive commercial agreements.",
                    "Only elements that are written in low-level Assembly code."
                ],
                "answer": 0,
                "why": "Filtration strips away all unprotectable functional and standard elements under 17 U.S.C. § 102(b), leaving only the truly original creative expression to be compared for infringement.",
                "answerIndex": 0,
                "explanation": "Filtration strips away all unprotectable functional and standard elements under 17 U.S.C. § 102(b), leaving only the truly original creative expression to be compared for infringement."
            }
        },
        {
            "title": "Work-Made-for-Hire Doctrine & IP Assignment Invariants (CCNV v. Reid)",
            "say": [
                "Under fundamental principles of copyright law, initial ownership of copyright vests automatically in the human author who created the work. In corporate enterprise environments, where billions of dollars in software, marketing designs, and technical documentation are produced by thousands of individuals, establishing clear, unencumbered corporate ownership is an existential legal mandate.",
                "Under Section 201(b) and Section 101 of the Copyright Act (17 U.S.C. § 101), the 'Work-Made-for-Hire' (WMFH) doctrine creates a critical legal exception: if a work qualifies as a work made for hire, the employer or commissioning entity is legally considered the author from the moment of creation, owning 100% of the copyright without needing a separate transfer.",
                "Section 101 defines work made for hire across two mutually exclusive statutory prongs: (1) A work prepared by an employee within the scope of their employment; or (2) A work specially ordered or commissioned for use in one of nine specific statutory categories (e.g., a contribution to a collective work, as part of a motion picture, as a translation, as a compilation, as an instructional text, as a test), IF the parties expressly agree in a written instrument signed by them that the work shall be considered a work made for hire.",
                "The defining common-law decision interpreting this statute is Community for Creative Non-Violence (CCNV) v. Reid (1989). In CCNV, the Supreme Court ruled that whether a creator is an 'employee' or an 'independent contractor' is governed by traditional agency common law, evaluating factors including the hiring party's right to control the manner and means of creation, provision of employee benefits, tax withholding (W-2 vs 1099), and source of tools.",
                "The catastrophic corporate trap lies in hiring independent contractor software developers without explicit assignment language! Software is NOT one of the nine statutory commissioned categories under Section 101 Prong 2. Therefore, if a startup pays an independent contractor $100,000 to code an app under an agreement that merely states 'this is a work made for hire', the contractor legally OWNS the entire copyright! To prevent this disaster, corporate counsel must mandate dual-tier 'belt-and-suspenders' language: declaring the work a WMFH, and explicitly adding an affirmative Present Assignment: 'To the extent the work does not qualify as a work made for hire, Contractor hereby irrevocably assigns, transfers, and conveys all right, title, and interest, including all copyrights, to the Company in perpetuity.'"
            ],
            "example": "A fintech startup pays an outside freelance developer $50,000 to build its core iPhone app. The contract says 'Developer agrees this app is a work made for hire,' but contains no assignment clause. Two years later, the startup raises a $20M Series A. The investor's legal diligence halts the funding: because an independent contractor software code is not a statutory WMFH, the freelancer still owns the software. The freelancer demands $2M to sign an IP assignment.",
            "code": """# Simulation: Work-Made-for-Hire & IP Assignment Chain of Title Auditor
class CopyrightChainOfTitleAuditor:
    STATUTORY_9_CATEGORIES = [
        'collective_work_contribution',
        'motion_picture_or_audiovisual',
        'translation',
        'supplementary_work',
        'compilation',
        'instructional_text',
        'test',
        'answer_material_for_test',
        'atlas'
    ]

    @classmethod
    def audit_software_ip_ownership(
        cls,
        asset_title: str,
        creator_relationship: str, # 'W2_FULL_TIME_EMPLOYEE' vs '1099_INDEPENDENT_CONTRACTOR'
        created_within_scope_of_employment: bool,
        contract_has_wmfh_clause: bool,
        contract_has_explicit_present_assignment_clause: bool,
        work_category: str # 'software_source_code', 'motion_picture_video', etc.
    ) -> dict:
        is_w2_employee = creator_relationship == 'W2_FULL_TIME_EMPLOYEE'
        
        # Prong 1: Employee within scope of employment (17 U.S.C. 101(1))
        qualifies_prong_1 = is_w2_employee and created_within_scope_of_employment
        
        # Prong 2: Commissioned work under 9 statutory categories (17 U.S.C. 101(2))
        is_in_9_categories = work_category in cls.STATUTORY_9_CATEGORIES
        qualifies_prong_2 = not is_w2_employee and contract_has_wmfh_clause and is_in_9_categories
        
        is_statutory_wmfh = qualifies_prong_1 or qualifies_prong_2
        
        # Fallback Present Assignment Check (Transfers legal title under 17 U.S.C. 204(a))
        title_transferred_via_assignment = not is_statutory_wmfh and contract_has_explicit_present_assignment_clause
        
        company_owns_100_pct_ip = is_statutory_wmfh or title_transferred_via_assignment
        
        if is_statutory_wmfh:
            status = 'STATUTORY_WORK_MADE_FOR_HIRE_COMPANY_IS_LEGAL_AUTHOR'
            chain_of_title = 'CLEAN_ORIGINAL_OWNERSHIP_ESTABLISHED'
        elif title_transferred_via_assignment:
            status = 'OWNERSHIP_SECURED_VIA_PRESENT_ASSIGNMENT_TRANSFER'
            chain_of_title = 'VALID_ASSIGNMENT_TITLE_HELD_BY_COMPANY'
        else:
            status = 'FATAL_CHAIN_OF_TITLE_DEFECT_CREATOR_OWNS_COPYRIGHT'
            chain_of_title = 'SERIES_A_FINANCING_BLOCKED_FREELANCER_RETAINS_TITLE'

        return {
            'asset': asset_title,
            'is_wmfh': is_statutory_wmfh,
            'valid_present_assignment_present': contract_has_explicit_present_assignment_clause,
            'company_owns_copyright': company_owns_100_pct_ip,
            'legal_status': status,
            'chain_of_title_risk': chain_of_title
        }

# Audit A: In-house engineer writing backend services
audit_w2 = CopyrightChainOfTitleAuditor.audit_software_ip_ownership(
    asset_title='Payment Gateway Microservice',
    creator_relationship='W2_FULL_TIME_EMPLOYEE',
    created_within_scope_of_employment=True,
    contract_has_wmfh_clause=True,
    contract_has_explicit_present_assignment_clause=True,
    work_category='software_source_code'
)

# Audit B: Freelancer contract with flawed WMFH-only clause (No assignment)
audit_freelance_flawed = CopyrightChainOfTitleAuditor.audit_software_ip_ownership(
    asset_title='Mobile Banking App iOS',
    creator_relationship='1099_INDEPENDENT_CONTRACTOR',
    created_within_scope_of_employment=False,
    contract_has_wmfh_clause=True,
    contract_has_explicit_present_assignment_clause=False, # Missing assignment!
    work_category='software_source_code' # Not one of 9 categories!
)

print(f"Audit A (Employee): [{audit_w2['asset']}] Company Owns: {audit_w2['company_owns_copyright']} -> {audit_w2['legal_status']}")
print(f"Audit B (Contractor): [{audit_freelance_flawed['asset']}] Company Owns: {audit_freelance_flawed['company_owns_copyright']} -> {audit_freelance_flawed['legal_status']}")
print(f"  Risk Profile: {audit_freelance_flawed['chain_of_title_risk']}")
""",
            "output": "Audit A (Employee): [Payment Gateway Microservice] Company Owns: True -> STATUTORY_WORK_MADE_FOR_HIRE_COMPANY_IS_LEGAL_AUTHOR\nAudit B (Contractor): [Mobile Banking App iOS] Company Owns: False -> FATAL_CHAIN_OF_TITLE_DEFECT_CREATOR_OWNS_COPYRIGHT\n  Risk Profile: SERIES_A_FINANCING_BLOCKED_FREELANCER_RETAINS_TITLE",
            "codeNotes": [
                {"line": 4, "note": "Defines 17 U.S.C. Section 101 statutory nine categories of commissioned works"},
                {"line": 21, "note": "Evaluates CCNV v. Reid common-law employee scope of employment prongs"},
                {"line": 29, "note": "Identifies software exclusion from Section 101(2) commissioned work categories"},
                {"line": 34, "note": "Enforces dual-tier present assignment clause as indispensable corporate legal protection"}
            ],
            "tryIt": "Set contract_has_explicit_present_assignment_clause to True in Audit B to cure the chain of title defect.",
            "check": {
                "question": "Why does a contract stating 'all software created by the independent contractor shall be a work made for hire' fail to transfer copyright ownership to the hiring company under 17 U.S.C. § 101?",
                "options": [
                    "Because software is not one of the nine exclusive statutory categories of commissioned works under Section 101(2); without an explicit affirmative assignment clause, copyright remains vested in the contractor.",
                    "Because all independent contractors are legally minors under federal law.",
                    "Because copyright in computer software can only be owned by the United States Library of Congress.",
                    "Because works made for hire require a public notary seal from the Department of Transportation."
                ],
                "answer": 0,
                "why": "Section 101(2) lists nine exclusive categories for commissioned works made for hire, and software is not among them. Therefore, an explicit assignment clause is mandatory to transfer title.",
                "answerIndex": 0,
                "explanation": "Section 101(2) lists nine exclusive categories for commissioned works made for hire, and software is not among them. Therefore, an explicit assignment clause is mandatory to transfer title."
            }
        },
        {
            "title": "DMCA Safe Harbors, Notice-and-Takedown & Secondary Infringement Liability (17 U.S.C. § 512)",
            "say": [
                "In modern cloud hosting, digital commerce, social media, and SaaS platforms, users continuously upload millions of images, videos, audio files, and software scripts to centralized corporate servers. Under traditional copyright principles, reproducing or displaying infringing material subjects the platform to strict liability for Direct Infringement, alongside Contributory Infringement (materially contributing with knowledge) and Vicarious Infringement (profiting while possessing the right and ability to supervise).",
                "To prevent copyright liability from paralyzing the growth of the commercial internet, Congress enacted the Digital Millennium Copyright Act of 1998 (DMCA), establishing the Section 512 Safe Harbors (17 U.S.C. § 512). Section 512 shields Online Service Providers (OSPs) from monetary damages for copyright infringement committed by their users across four operational categories: (1) Transitory communications (§ 512(a)), (2) System caching (§ 512(b)), (3) Storage at the direction of users (§ 512(c)), and (4) Information location tools/search engines (§ 512(d)).",
                "To qualify and maintain Section 512(c) storage safe harbor immunity, an enterprise platform must satisfy strict statutory threshold invariants: (1) Adopt, reasonably implement, and inform users of a policy providing for the termination of 'Repeat Infringers' in appropriate circumstances; (2) Accommodate and not interfere with 'standard technical measures' used by copyright owners to identify protected works; (3) Register a Designated Copyright Agent with the US Copyright Office; and (4) Operate a responsive Notice-and-Takedown procedure.",
                "Under Section 512(c), upon receiving a formal DMCA takedown notice containing the statutory elements, the OSP must 'expeditiously remove or disable access to' the infringing material. To prevent abuse, Section 512(g) creates a Counter-Notification procedure: if the user files a sworn counter-notice asserting mistake or misidentification, the platform must restore the content within 10 to 14 business days unless the copyright owner files a federal court action.",
                "Furthermore, corporate counsel must manage 'Red Flag Knowledge' (Viacom v. YouTube). Safe harbor protection evaporates if the platform acquires actual knowledge or awareness of facts or circumstances from which infringing activity is obvious (red flag knowledge) and fails to act expeditiously, or if the platform receives a direct financial benefit attributable to the infringing activity while retaining the right and ability to control the infringing acts."
            ],
            "example": "A user uploads a bootlegged Hollywood blockbuster movie to a cloud video hosting platform. The studio sends an 17 U.S.C. § 512(c)(3) compliant takedown notice. Within 2 hours, the platform removes the video and notifies the user. Under the DMCA safe harbor, the platform cannot be sued for monetary damages, shielding its balance sheet from $150,000 statutory copyright penalties.",
            "code": """# Simulation: DMCA Section 512 Online Service Provider Safe Harbor Compliance Engine
from typing import Dict, List

class DMCASafeHarborComplianceEngine:
    @staticmethod
    def audit_platform_safe_harbor_eligibility(
        has_registered_dmca_agent_with_copyright_office: bool,
        has_enforced_repeat_infringer_policy: bool,
        operates_expeditious_notice_and_takedown: bool,
        had_red_flag_knowledge_of_infringement: bool,
        expeditiously_removed_upon_red_flag: bool,
        direct_financial_benefit_from_specific_infringement: bool,
        has_right_and_ability_to_supervise_infringing_activity: bool
    ) -> dict:
        # Mandatory threshold requirements under 17 U.S.C. 512(i)
        threshold_met = has_registered_dmca_agent_with_copyright_office and has_enforced_repeat_infringer_policy and operates_expeditious_notice_and_takedown
        
        # Red Flag Knowledge disqualification under 512(c)(1)(A)(ii)
        red_flag_disqualified = had_red_flag_knowledge_of_infringement and not expeditiously_removed_upon_red_flag
        
        # Vicarious liability disqualification under 512(c)(1)(B)
        vicarious_disqualified = direct_financial_benefit_from_specific_infringement and has_right_and_ability_to_supervise_infringing_activity
        
        is_protected = threshold_met and not red_flag_disqualified and not vicarious_disqualified
        
        if not threshold_met:
            status = 'SAFE_HARBOR_STRIPPED_THRESHOLD_INVARIANTS_BREACHED'
            damages_immunity = False
            rationale = 'Platform lacks registered Copyright Agent, repeat infringer policy, or expeditious takedown mechanism.'
        elif red_flag_disqualified:
            status = 'SAFE_HARBOR_LOST_UNACTED_RED_FLAG_KNOWLEDGE'
            damages_immunity = False
            rationale = 'Viacom v. YouTube: Platform had objective awareness of blatant infringement and failed to act expeditiously.'
        elif vicarious_disqualified:
            status = 'SAFE_HARBOR_LOST_VICARIOUS_CONTROL_AND_PROFIT'
            damages_immunity = False
            rationale = 'Platform derived direct financial profit from infringement while exercising right and ability to control content.'
        else:
            status = 'DMCA_SECTION_512_SAFE_HARBOR_IMMUNITY_ACTIVE'
            damages_immunity = True
            rationale = 'Platform is immune from monetary damages for user-generated copyright infringement.'

        return {
            'threshold_prongs_satisfied': threshold_met,
            'red_flag_knowledge_managed': not red_flag_disqualified,
            'monetary_damages_immunity': damages_immunity,
            'statutory_safe_harbor_status': status,
            'judicial_rationale': rationale
        }

# Scenario 1: Fully compliant SaaS storage platform
audit_compliant_saas = DMCASafeHarborComplianceEngine.audit_platform_safe_harbor_eligibility(
    has_registered_dmca_agent_with_copyright_office=True,
    has_enforced_repeat_infringer_policy=True,
    operates_expeditious_notice_and_takedown=True,
    had_red_flag_knowledge_of_infringement=True,
    expeditiously_removed_upon_red_flag=True, # Takedown executed within hours
    direct_financial_benefit_from_specific_infringement=False,
    has_right_and_ability_to_supervise_infringing_activity=False
)

# Scenario 2: Pirate movie hub ignoring repeat infringers and monetizing pirate ads
audit_pirate_hub = DMCASafeHarborComplianceEngine.audit_platform_safe_harbor_eligibility(
    has_registered_dmca_agent_with_copyright_office=True,
    has_enforced_repeat_infringer_policy=False, # Refuses to ban top pirate uploaders
    operates_expeditious_notice_and_takedown=False,
    had_red_flag_knowledge_of_infringement=True,
    expeditiously_removed_upon_red_flag=False,
    direct_financial_benefit_from_specific_infringement=True,
    has_right_and_ability_to_supervise_infringing_activity=True
)

print(f"[Compliant SaaS] Status: {audit_compliant_saas['statutory_safe_harbor_status']} | Immunity: {audit_compliant_saas['monetary_damages_immunity']}")
print(f"  Rationale: {audit_compliant_saas['judicial_rationale']}")
print(f"[Pirate Hub] Status: {audit_pirate_hub['statutory_safe_harbor_status']} | Immunity: {audit_pirate_hub['monetary_damages_immunity']}")
print(f"  Rationale: {audit_pirate_hub['judicial_rationale']}")
""",
            "output": "[Compliant SaaS] Status: DMCA_SECTION_512_SAFE_HARBOR_IMMUNITY_ACTIVE | Immunity: True\n  Rationale: Platform is immune from monetary damages for user-generated copyright infringement.\n[Pirate Hub] Status: SAFE_HARBOR_STRIPPED_THRESHOLD_INVARIANTS_BREACHED | Immunity: False\n  Rationale: Platform lacks registered Copyright Agent, repeat infringer policy, or expeditious takedown mechanism.",
            "codeNotes": [
                {"line": 4, "note": "Implements DMCA 17 U.S.C. Section 512(c) online service provider safe harbor validator"},
                {"line": 15, "note": "Evaluates mandatory threshold invariants: repeat infringer policy and registered agent"},
                {"line": 18, "note": "Applies Viacom v. YouTube red flag knowledge and willful blindness disqualification tests"},
                {"line": 28, "note": "Confirms complete immunity from civil copyright statutory damages for compliant platforms"}
            ],
            "tryIt": "Set expeditiously_removed_upon_red_flag to False in Scenario 1 to observe the red flag exception strip immunity.",
            "check": {
                "question": "Under 17 U.S.C. § 512(c), what mandatory threshold policy must an Online Service Provider adopt and reasonably implement to qualify for DMCA safe harbor immunity?",
                "options": [
                    "A policy that provides for the termination in appropriate circumstances of subscribers and account holders of the service provider's system or network who are repeat infringers.",
                    "A policy requiring all users to submit notarized identity cards before uploading text.",
                    "A mandatory 50% revenue-sharing agreement with the Recording Industry Association of America.",
                    "An agreement to store all user data exclusively on magnetic tape drives."
                ],
                "answer": 0,
                "why": "17 U.S.C. § 512(i)(1)(A) makes the adoption and reasonable implementation of a repeat infringer termination policy a strict prerequisite for all safe harbor protections.",
                "answerIndex": 0,
                "explanation": "17 U.S.C. § 512(i)(1)(A) makes the adoption and reasonable implementation of a repeat infringer termination policy a strict prerequisite for all safe harbor protections."
            }
        },
        {
            "title": "Open-Source Software Licensing (GPL vs Permissive) & Fair Use (Google v. Oracle)",
            "say": [
                "Modern enterprise software is assembled upon towering stacks of third-party open-source software (OSS). Over 90% of commercial enterprise applications contain open-source code libraries. However, open-source software is NOT public domain! OSS is protected by copyright and licensed under specific contractual terms. Incorporating OSS without strict license governance exposes an enterprise to severe copyright infringement liability, mandatory source code disclosure orders, and multi-million-dollar M&A deal termination.",
                "Open-source licenses divide into two broad categories: Permissive Licenses and Reciprocal (Copyleft) Licenses.",
                "Permissive licenses (e.g., MIT, Apache 2.0, BSD 3-Clause) grant broad freedom to copy, modify, and distribute the software for commercial purposes, imposing minimal obligations—chiefly retaining copyright notices and warranty disclaimers (and in Apache 2.0, an express patent license grant). In contrast, Reciprocal Copyleft licenses (e.g., GNU General Public License / GPL v2, GPL v3, AGPL v3) contain strict 'viral' provisions. Under Section 2 of GPL v2, if an enterprise distributes a derivative work containing GPL code, the enterprise MUST license the entire combined software program under the GPL and publicly disclose the proprietary source code for free!",
                "For corporate M&A transactions, 'GPL Contamination' is a fatal due diligence finding. If an enterprise statically links a GPL v2 library into its core proprietary SaaS database engine, competitors can sue for copyright infringement or demand the full public disclosure of the company's multi-million-dollar intellectual property under the GPL viral requirement.",
                "Finally, corporate legal counsel must navigate the Four-Factor Fair Use Defense under 17 U.S.C. § 107, as clarified in Google LLC v. Oracle America, Inc. (2021). The four statutory factors are: (1) Purpose and character of the use (transformative vs commercial copying), (2) Nature of the copyrighted work (creative vs functional), (3) Amount and substantiality of the portion used, and (4) Effect of the use upon the potential market for or value of the work. In Google v. Oracle, the Supreme Court ruled that Google's copying of 11,500 lines of Java API declaring code was a fair use as a matter of law, because declaring code is inherently functional and copying it allowed programmers to carry their skills into a new smartphone ecosystem without harming Sun/Oracle's market."
            ],
            "example": "A cybersecurity startup prepares for an IPO. Underwriter audit scans reveal a software developer incorporated a GPL v3 network scanning library directly into the core proprietary agent software. Because GPL v3 is strongly copyleft, the startup faces viral contamination: it must either spend $4M rewriting the entire subsystem cleanroom or publicly open-source its proprietary codebase. The IPO is delayed by 9 months.",
            "code": """# Simulation: Open-Source Software (OSS) License Compliance & Fair Use 4-Factor Engine
from typing import Dict, List

class OpenSourceAndFairUseAuditor:
    LICENSE_TAXONOMY = {
        'MIT': {'type': 'PERMISSIVE', 'viral_copyleft': False, 'commercial_safe': True, 'patent_grant': False},
        'APACHE_2_0': {'type': 'PERMISSIVE', 'viral_copyleft': False, 'commercial_safe': True, 'patent_grant': True},
        'BSD_3_CLAUSE': {'type': 'PERMISSIVE', 'viral_copyleft': False, 'commercial_safe': True, 'patent_grant': False},
        'LGPL_V2_1': {'type': 'WEAK_COPYLEFT', 'viral_copyleft': False, 'commercial_safe': True, 'patent_grant': False}, # Safe if dynamically linked
        'GPL_V2': {'type': 'STRONG_COPYLEFT', 'viral_copyleft': True, 'commercial_safe': False, 'patent_grant': False},
        'GPL_V3': {'type': 'STRONG_COPYLEFT', 'viral_copyleft': True, 'commercial_safe': False, 'patent_grant': True},
        'AGPL_V3': {'type': 'NETWORK_COPYLEFT', 'viral_copyleft': True, 'commercial_safe': False, 'patent_grant': True}
    }

    @classmethod
    def audit_oss_linkage(
        cls,
        library_name: str,
        license_name: str,
        linkage_type: str, # 'DYNAMIC_LINKAGE' vs 'STATIC_COMPILATION_LINKAGE'
        is_distributed_binary: bool
    ) -> dict:
        lic_info = cls.LICENSE_TAXONOMY.get(license_name, {'type': 'PROPRIETARY', 'viral_copyleft': True, 'commercial_safe': False})
        
        is_contaminated = False
        if lic_info['viral_copyleft']:
            if license_name in ['GPL_V2', 'GPL_V3'] and is_distributed_binary:
                is_contaminated = True
            elif license_name == 'AGPL_V3':
                is_contaminated = True # Network access triggers viral disclosure even without binary distribution
        elif license_name == 'LGPL_V2_1' and linkage_type == 'STATIC_COMPILATION_LINKAGE':
            is_contaminated = True # LGPL requires dynamic linking to avoid viral contamination

        return {
            'library': library_name,
            'license': license_name,
            'license_type': lic_info['type'],
            'viral_contamination_detected': is_contaminated,
            'mandatory_source_disclosure_order_risk': is_contaminated,
            'compliance_verdict': 'CRITICAL_LEGAL_CONTAMINATION_REWRITE_REQUIRED' if is_contaminated else 'PERMISSIBLE_COMMERCIAL_USE'
        }

    @staticmethod
    def evaluate_section_107_fair_use(
        purpose_transformative: bool,
        nature_highly_functional_declaring_code: bool,
        amount_used_percentage: float,
        market_effect_substitutes_original: bool
    ) -> dict:
        # 17 U.S.C. 107 Four Factors (Google v. Oracle Analysis)
        factor_1 = 30 if purpose_transformative else -20
        factor_2 = 20 if nature_highly_functional_declaring_code else -10
        factor_3 = 20 if amount_used_percentage <= 5.0 else -15
        factor_4 = -40 if market_effect_substitutes_original else 30 # Factor 4 is the most crucial
        
        composite_fair_use_score = factor_1 + factor_2 + factor_3 + factor_4
        is_fair_use = composite_fair_use_score >= 40
        
        return {
            'composite_fair_use_score': composite_fair_use_score,
            'factor_1_transformative': purpose_transformative,
            'factor_2_functional_nature': nature_highly_functional_declaring_code,
            'factor_4_no_market_substitution': not market_effect_substitutes_original,
            'fair_use_defense_sustained': is_fair_use,
            'judicial_verdict': 'FAIR_USE_AS_A_MATTER_OF_LAW_GOOGLE_V_ORACLE' if is_fair_use else 'INFRINGING_COPYING_FAIR_USE_DEFENSE_FAILS'
        }

# Audit 1: Proprietary backend incorporating GPL v3 statically
oss_audit = OpenSourceAndFairUseAuditor.audit_oss_linkage(
    library_name='CryptoKernelLib',
    license_name='GPL_V3',
    linkage_type='STATIC_COMPILATION_LINKAGE',
    is_distributed_binary=True
)

# Audit 2: Re-implementing API declarations under Google v. Oracle
fair_use_audit = OpenSourceAndFairUseAuditor.evaluate_section_107_fair_use(
    purpose_transformative=True,
    nature_highly_functional_declaring_code=True,
    amount_used_percentage=0.4, # 11,500 lines out of 2.86M lines
    market_effect_substitutes_original=False
)

print(f"OSS Audit: [{oss_audit['library']}] License: {oss_audit['license']} -> {oss_audit['compliance_verdict']}")
print(f"  Contamination: {oss_audit['viral_contamination_detected']} | Source Disclosure Risk: {oss_audit['mandatory_source_disclosure_order_risk']}")
print(f"Fair Use Audit: [{fair_use_audit['judicial_verdict']}] Score: {fair_use_audit['composite_fair_use_score']} | Sustained: {fair_use_audit['fair_use_defense_sustained']}")
""",
            "output": "OSS Audit: [CryptoKernelLib] License: GPL_V3 -> CRITICAL_LEGAL_CONTAMINATION_REWRITE_REQUIRED\n  Contamination: True | Source Disclosure Risk: True\nFair Use Audit: [FAIR_USE_AS_A_MATTER_OF_LAW_GOOGLE_V_ORACLE] Score: 100 | Sustained: True",
            "codeNotes": [
                {"line": 4, "note": "Classifies open-source software licenses across permissive, weak, and viral copyleft tiers"},
                {"line": 23, "note": "Identifies viral copyleft triggers: static compilation linkage and binary distribution"},
                {"line": 37, "note": "Implements 17 U.S.C. Section 107 four-factor Fair Use test under Google v. Oracle"},
                {"line": 44, "note": "Validates non-infringing reimplementation of functional API declaring code"}
            ],
            "tryIt": "Change license_name in oss_audit to 'APACHE_2_0' to eliminate viral contamination and clear commercial use.",
            "check": {
                "question": "In Google LLC v. Oracle America, Inc. (2021), why did the Supreme Court hold that Google's copying of 11,500 lines of Java API declaring code constituted Fair Use as a matter of law?",
                "options": [
                    "Because declaring code is inherently functional and closely tethered to unprotectable ideas, and Google's transformative implementation in the Android ecosystem did not harm Sun/Oracle's market for Java SE.",
                    "Because all computer code under 20,000 lines is automatically exempt from copyright law.",
                    "Because Google paid a $1 billion mandatory licensing fee to the Library of Congress.",
                    "Because Java source code was written in a foreign country outside US jurisdiction."
                ],
                "answer": 0,
                "why": "The Supreme Court emphasized that API declaring code is bound up with programmer habits and functional organization, and copying only what was needed for interoperability was transformative fair use.",
                "answerIndex": 0,
                "explanation": "The Supreme Court emphasized that API declaring code is bound up with programmer habits and functional organization, and copying only what was needed for interoperability was transformative fair use."
            }
        },
        {
            "title": "Copyright Damages Architecture: Statutory Damages, Infringer Profits & Section 412 Registration",
            "say": [
                "When an enterprise codebase, proprietary database, or creative digital asset is infringed, civil copyright litigation in federal district court provides some of the most formidable financial remedies in Anglo-American jurisprudence. Under 17 U.S.C. § 504, a copyright owner may elect between two fundamentally different monetary measures: (1) Actual Damages plus the Infringer's Additional Profits under Section 504(b), or (2) Statutory Damages under Section 504(c).",
                "Under Section 504(b), actual damages compensate the copyright owner for the quantifiable economic injury suffered, such as lost software licensing fees, discounted market value, or customer contract defection. Crucially, the plaintiff is also entitled to recover any profits of the infringer attributable to the infringement that are not taken into account in computing actual damages. The evidentiary burden of proof is heavily tilted in the copyright owner's favor: the plaintiff is required to present proof only of the infringer's gross revenues; the burden then flips entirely to the defendant to prove all deductible business expenses and the elements of profit attributable to factors other than the copyrighted work.",
                "Alternatively, proving actual lost profits or disentangling an infringer's multi-million-dollar software revenue streams can be mathematically complex and forensic-heavy. Therefore, the Copyright Act provides a potent statutory alternative: Statutory Damages under 17 U.S.C. § 504(c). For ordinary infringement, the court or jury may award an amount between $750 and $30,000 per work infringed, as the court considers just.",
                "However, if the copyright owner proves that the infringement was committed 'willfully'—meaning the defendant acted with actual knowledge of the infringement or in reckless disregard of the copyright owner's rights—the court possesses wide statutory discretion under Section 504(c)(2) to increase the award of statutory damages up to $150,000 per work infringed! For a company whose SaaS platform distributes 100 copyrighted modules or digital manuals, willful statutory damages can reach $15,000,000 without proving a single dollar of actual financial loss.",
                "Crucially, corporate general counsel must enforce the strict Section 412 Registration Invariant (17 U.S.C. § 412). Under Section 412, statutory damages and discretionary attorney's fees under Section 505 are completely barred unless the copyright owner registered the work with the US Copyright Office prior to the commencement of the infringement (or within a 3-month grace period from initial publication). Failing to register proprietary codebases before launch permanently strips the corporation of statutory damages and attorney's fees, leaving the company vulnerable to expensive litigation where only difficult-to-prove actual damages can be recovered."
            ],
            "example": "A SaaS enterprise registers its core microservice code with the US Copyright Office upon launch. A rogue enterprise client copies the code to launch a clone product. At trial, the jury finds willful infringement across 12 distinct copyrighted software libraries. Because the company registered in advance under Section 412, the judge awards the maximum statutory damages of $150,000 per work ($1.8M total) plus $650,000 in full attorney's fees under Section 505.",
            "code": """# Simulation: Copyright Damages (Actual vs Statutory) & Section 412 Registration Gate Engine
class CopyrightDamagesEngine:
    @staticmethod
    def calculate_infringement_damages(
        works_infringed_count: int,
        plaintiff_actual_lost_licensing_usd: float,
        infringer_gross_commercial_revenue_usd: float,
        proven_deductible_expenses_usd: float,
        portion_revenue_attributable_to_infringement_pct: float,
        is_willful_infringement: bool,
        is_innocent_infringement: bool,
        timely_registered_under_section_412: bool
    ) -> dict:
        # Measure 1: Section 504(b) Actual Damages + Infringer's Attributable Net Profits
        infringer_net_profit = max(0.0, infringer_gross_commercial_revenue_usd - proven_deductible_expenses_usd)
        attributable_infringer_profit = infringer_net_profit * portion_revenue_attributable_to_infringement_pct
        section_504b_actual_plus_profits = plaintiff_actual_lost_licensing_usd + attributable_infringer_profit
        
        # Measure 2: Section 504(c) Statutory Damages (Requires Section 412 timely registration!)
        if not timely_registered_under_section_412:
            statutory_damages_available = False
            statutory_damages_total = 0.0
            statutory_tier = 'STATUTORILY_BARRED_SECTION_412_LATE_REGISTRATION'
            attorney_fees_eligible = False
        else:
            statutory_damages_available = True
            attorney_fees_eligible = True
            if is_willful_infringement:
                per_work_rate = 150000.0 # Maximum willful penalty under 504(c)(2)
                statutory_tier = 'WILLFUL_INFRINGEMENT_MAXIMUM_TIER'
            elif is_innocent_infringement:
                per_work_rate = 200.0 # Reduced innocent infringer floor under 504(c)(2)
                statutory_tier = 'INNOCENT_INFRINGEMENT_REDUCED_FLOOR'
            else:
                per_work_rate = 30000.0 # Standard statutory ceiling
                statutory_tier = 'ORDINARY_INFRINGEMENT_STANDARD_TIER'
                
            statutory_damages_total = works_infringed_count * per_work_rate

        # Plaintiff's optimal recovery election
        if statutory_damages_available and statutory_damages_total > section_504b_actual_plus_profits:
            elected_measure = 'ELECT_SECTION_504C_STATUTORY_DAMAGES'
            final_recovery_usd = statutory_damages_total
        else:
            elected_measure = 'ELECT_SECTION_504B_ACTUAL_DAMAGES_AND_PROFITS'
            final_recovery_usd = section_504b_actual_plus_profits

        return {
            'works_infringed': works_infringed_count,
            'section_504b_actual_damages_plus_profits_usd': round(section_504b_actual_plus_profits, 2),
            'statutory_damages_available': statutory_damages_available,
            'statutory_damages_tier': statutory_tier,
            'statutory_damages_total_usd': round(statutory_damages_total, 2),
            'section_505_attorney_fees_eligible': attorney_fees_eligible,
            'optimal_plaintiff_election': elected_measure,
            'final_monetary_recovery_usd': round(final_recovery_usd, 2)
        }

# Scenario 1: Timely registered software suite with willful infringement
case_timely = CopyrightDamagesEngine.calculate_infringement_damages(
    works_infringed_count=10,
    plaintiff_actual_lost_licensing_usd=250000.0,
    infringer_gross_commercial_revenue_usd=2000000.0,
    proven_deductible_expenses_usd=1200000.0,
    portion_revenue_attributable_to_infringement_pct=0.45,
    is_willful_infringement=True,
    is_innocent_infringement=False,
    timely_registered_under_section_412=True
)

# Scenario 2: Unregistered software where statutory damages are legally barred
case_unregistered = CopyrightDamagesEngine.calculate_infringement_damages(
    works_infringed_count=10,
    plaintiff_actual_lost_licensing_usd=250000.0,
    infringer_gross_commercial_revenue_usd=2000000.0,
    proven_deductible_expenses_usd=1200000.0,
    portion_revenue_attributable_to_infringement_pct=0.45,
    is_willful_infringement=True,
    is_innocent_infringement=False,
    timely_registered_under_section_412=False # Registration neglected!
)

print(f"[Timely Registered] Optimal: {case_timely['optimal_plaintiff_election']} | Recovery: ${case_timely['final_monetary_recovery_usd']:,.2f} | Fees: {case_timely['section_505_attorney_fees_eligible']}")
print(f"  Statutory: ${case_timely['statutory_damages_total_usd']:,.2f} ({case_timely['statutory_damages_tier']}) vs Actual: ${case_timely['section_504b_actual_damages_plus_profits_usd']:,.2f}")
print(f"[Unregistered] Optimal: {case_unregistered['optimal_plaintiff_election']} | Recovery: ${case_unregistered['final_monetary_recovery_usd']:,.2f} | Fees: {case_unregistered['section_505_attorney_fees_eligible']}")
print(f"  Statutory Status: {case_unregistered['statutory_damages_tier']}")
""",
            "output": "[Timely Registered] Optimal: ELECT_SECTION_504C_STATUTORY_DAMAGES | Recovery: $1,500,000.00 | Fees: True\n  Statutory: $1,500,000.00 (WILLFUL_INFRINGEMENT_MAXIMUM_TIER) vs Actual: $610,000.00\n[Unregistered] Optimal: ELECT_SECTION_504B_ACTUAL_DAMAGES_AND_PROFITS | Recovery: $610,000.00 | Fees: False\n  Statutory Status: STATUTORILY_BARRED_SECTION_412_LATE_REGISTRATION",
            "codeNotes": [
                {"line": 3, "note": "Implements Copyright Act Section 504 monetary damages calculation engine"},
                {"line": 15, "note": "Applies Section 504(b) actual damages plus infringer's attributable gross margin profits"},
                {"line": 18, "note": "Enforces 17 U.S.C. Section 412 mandatory registration threshold for statutory damages"},
                {"line": 27, "note": "Computes Section 504(c)(2) willful statutory damages up to $150,000 per infringed work"}
            ],
            "tryIt": "Set timely_registered_under_section_412 to True in Scenario 2 to unlock $1.5M in statutory damages and attorney's fees.",
            "check": {
                "question": "Under 17 U.S.C. § 412 of the Copyright Act, what is the critical legal penalty for failing to register a copyrighted work with the US Copyright Office prior to the commencement of infringement?",
                "options": [
                    "The copyright owner is statutorily barred from recovering statutory damages under Section 504(c) and attorney's fees under Section 505, being limited strictly to actual damages and infringer's profits.",
                    "The copyright permanently transfers to the public domain.",
                    "The infringer is immune from federal preliminary injunctions.",
                    "The author must pay a $10,000 administrative fine to the Register of Copyrights."
                ],
                "answer": 0,
                "why": "Section 412 explicitly conditions the availability of statutory damages and attorney's fees upon timely registration prior to infringement or within three months of publication.",
                "answerIndex": 0,
                "explanation": "Section 412 explicitly conditions the availability of statutory damages and attorney's fees upon timely registration prior to infringement or within three months of publication."
            }
        }
    ],
    "summary": [
        "Idea-Expression Dichotomy & Altai AFC Test: Copyright protects original expression, not ideas; Computer Associates v. Altai filters out unprotectable merger efficiency and scenes a faire standards before comparing core code.",
        "Work-Made-for-Hire Doctrine: Under CCNV v. Reid, independent contractor software development is NOT a statutory WMFH category; contracts must include dual-tier present assignment language to secure corporate title.",
        "DMCA Section 512 Safe Harbors: Shields online platforms from monetary damages for user uploads, provided they register a copyright agent, enforce repeat infringer termination, and operate expeditious takedown procedures.",
        "Open-Source License Governance: Distinguishes permissive licenses (MIT/Apache) from viral copyleft licenses (GPL/AGPL); GPL contamination can legally mandate the public disclosure of proprietary enterprise code.",
        "Fair Use & Google v. Oracle: 17 U.S.C. § 107 balances four statutory factors; copying functional API declaring code for transformative interoperability without market harm is protected as fair use."
    ],
    "projectStep": {
        "title": "Corporate Law Milestone 2 Capstone Step 4: Software Copyright Chain of Title & Open-Source Compliance Architecture",
        "steps": [
            "Audit proprietary software modules under the Altai Abstraction-Filtration-Comparison test to establish cleanroom non-infringement.",
            "Verify employment and contractor agreements under CCNV v. Reid, embedding affirmative present assignment clauses.",
            "Institutionalize DMCA Section 512 notice-and-takedown protocols and register designated copyright agents with the US Copyright Office.",
            "Execute an enterprise open-source software scan, screening out viral GPL/AGPL contamination while evaluating Google v. Oracle fair use boundaries."
        ]
    }
}

if __name__ == "__main__":
    total = ensure_law_day_budget(DAY_09)
    print(f"B.Com Corporate Law Day 9 Total Words: {total}")
    for i, p in enumerate(DAY_09['parts']):
        print(f"  Part {i+1} words: {count_words(p['say'])}")
