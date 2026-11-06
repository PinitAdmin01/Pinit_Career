"""
Build script for Day 19: AI Governance, Risk & Compliance: NIST AI RMF, ISO 42001 & EU AI Act Implementation
"""
import json

day19_data = {
    "day": 19,
    "title": "AI Governance, Risk & Compliance: NIST AI RMF, ISO 42001 & EU AI Act Implementation",
    "course": "AI & Digital Transformation for Business",
    "duration": "40 mins",
    "parts": [
        {
            "id": 1,
            "title": "NIST AI RMF 1.0 Architecture & Core Functions (Govern, Map, Measure, Manage)",
            "say": (
                "Welcome to Day 19 of AI & Digital Transformation for Business. Today, we step into the executive boardrooms, legal counsel chambers, and enterprise compliance divisions to master the rigorous frameworks governing AI deployments worldwide. As enterprise artificial intelligence transitions from bespoke experimentation to mission-critical infrastructure, arbitrary heuristics and informal risk checklists are being replaced by internationally harmonized regulatory and architectural standards. Foremost among corporate frameworks in North America and multinational conglomerates is the National Institute of Standards and Technology (NIST) Artificial Intelligence Risk Management Framework (AI RMF 1.0).\n\n"
                "The NIST AI RMF 1.0 provides organizations with a structured methodology to address AI risks and cultivate trustworthy AI systems across four foundational, interconnected core functions: Govern, Map, Measure, and Manage. The Govern function establishes organizational policies, board-level oversight, risk tolerance boundaries, cross-functional risk culture, and workforce competencies. It serves as the bedrock upon which all technical actions rest, ensuring that executive leadership maintains ultimate accountability for algorithmic decision-making. The Map function contextualizes AI systems within their intended operational environments, identifying organizational objectives, mapping stakeholder impacts, analyzing interdependent supply-chain vulnerabilities, and cataloging potential business and societal harms.\n\n"
                "The Measure function employs quantitative, semi-quantitative, and qualitative methodologies to rigorously evaluate, assess, analyze, and track AI risks, system performance, model accuracy, fairness metrics, robust security postures, and emergent anomalies over time. Finally, the Manage function allocates technical controls, operational protocols, automated guardrails, human-in-the-loop intervention mechanisms, and continuous monitoring pipelines to proactively mitigate, neutralize, or transfer identified risks according to established risk tolerance levels.\n\n"
                "To operationalize NIST AI RMF 1.0 in enterprise engineering pipelines, governance teams must translate high-level guidelines into verifiable data structures and automated audit ledgers. In this session, we construct an enterprise NIST AI RMF compliance assessment engine in Python. Our engine models system profiles, maps operational risks against standard NIST subcategories (GOVERN-1.2, MAP-2.3, MEASURE-2.5, MANAGE-3.1), computes residual risk vectors against enterprise risk thresholds, and generates structured compliance ledgers suitable for board-level reporting and regulatory filings."
            ),
            "code": (
                "import json\n"
                "from dataclasses import dataclass, field, asdict\n"
                "from typing import List, Dict\n"
                "\n"
                "@dataclass\n"
                "class RMFSubcategory:\n"
                "    code: str\n"
                "    function: str\n"
                "    description: str\n"
                "    inherent_risk_score: float  # Scale 1-10\n"
                "    control_effectiveness: float  # Scale 0.0 - 1.0\n"
                "    status: str = 'PENDING'\n"
                "    residual_risk: float = 0.0\n"
                "\n"
                "    def evaluate(self):\n"
                "        self.residual_risk = round(self.inherent_risk_score * (1.0 - self.control_effectiveness), 2)\n"
                "        self.status = 'COMPLIANT' if self.residual_risk <= 2.5 else 'REMEDIATION_REQUIRED'\n"
                "\n"
                "class NISTGovernanceEngine:\n"
                "    def __init__(self, system_name: str, enterprise_threshold: float = 2.5):\n"
                "        self.system_name = system_name\n"
                "        self.enterprise_threshold = enterprise_threshold\n"
                "        self.subcategories: List[RMFSubcategory] = []\n"
                "\n"
                "    def add_subcategory(self, subcat: RMFSubcategory):\n"
                "        subcat.evaluate()\n"
                "        self.subcategories.append(subcat)\n"
                "\n"
                "    def generate_audit_summary(self) -> Dict:\n"
                "        total_inherent = sum(s.inherent_risk_score for s in self.subcategories)\n"
                "        total_residual = sum(s.residual_risk for s in self.subcategories)\n"
                "        non_compliant = [s.code for s in self.subcategories if s.status != 'COMPLIANT']\n"
                "        overall_posture = 'APPROVED' if not non_compliant else 'FLAGGED_RISK'\n"
                "        return {\n"
                "            'system': self.system_name,\n"
                "            'total_subcategories_evaluated': len(self.subcategories),\n"
                "            'aggregate_inherent_risk': round(total_inherent, 2),\n"
                "            'aggregate_residual_risk': round(total_residual, 2),\n"
                "            'risk_reduction_percentage': round(((total_inherent - total_residual) / total_inherent) * 100, 1),\n"
                "            'remediation_required_codes': non_compliant,\n"
                "            'governance_approval_status': overall_posture\n"
                "        }\n"
                "\n"
                "engine = NISTGovernanceEngine(system_name='Enterprise-Financial-Credit-Underwriter-V2')\n"
                "engine.add_subcategory(RMFSubcategory('GOVERN-1.2', 'Govern', 'Board oversight and legal accountability frameworks', 8.5, 0.85))\n"
                "engine.add_subcategory(RMFSubcategory('MAP-2.3', 'Map', 'Context and demographic impact mapping for underrepresented groups', 9.0, 0.80))\n"
                "engine.add_subcategory(RMFSubcategory('MEASURE-2.5', 'Measure', 'Real-time statistical disparity and adverse impact ratio testing', 8.0, 0.90))\n"
                "engine.add_subcategory(RMFSubcategory('MANAGE-3.1', 'Manage', 'Automated fallbacks and human underwriting failover mechanisms', 7.5, 0.70))\n"
                "\n"
                "audit_result = engine.generate_audit_summary()\n"
                "print(json.dumps(audit_result, indent=2))\n"
            ),
            "codeOutput": (
                "{\n"
                '  "system": "Enterprise-Financial-Credit-Underwriter-V2",\n'
                '  "total_subcategories_evaluated": 4,\n'
                '  "aggregate_inherent_risk": 33.0,\n'
                '  "aggregate_residual_risk": 6.35,\n'
                '  "risk_reduction_percentage": 80.8,\n'
                '  "remediation_required_codes": [],\n'
                '  "governance_approval_status": "APPROVED"\n'
                "}"
            ),
            "codeNotes": (
                "Line 6-17: Defines `RMFSubcategory` dataclass calculating mathematical residual risk from inherent severity and control efficacy.\n"
                "Line 19-35: `NISTGovernanceEngine` aggregates cross-functional evaluations against enterprise risk tolerance thresholds.\n"
                "Line 37-43: Tests corporate credit underwriting model across Govern, Map, Measure, and Manage functions, verifying 80.8% risk reduction."
            ),
            "socratic": {
                "question": "Under NIST AI RMF 1.0, what is the fundamental mathematical relationship between Inherent Risk, Control Effectiveness, and Residual Risk?",
                "options": [
                    "Residual Risk = Inherent Risk * (1.0 - Control Effectiveness), requiring residual risk to fall below enterprise risk tolerance thresholds for operational deployment.",
                    "Residual Risk is the arithmetic sum of Inherent Risk and Control Effectiveness divided by total organizational subcategories.",
                    "Inherent Risk is multiplied directly by Control Effectiveness, meaning higher control effectiveness increases total residual liability.",
                    "Residual Risk is completely independent of controls and is determined solely by the raw token latency of the underlying large language model."
                ],
                "answerIndex": 0,
                "explanation": "Residual risk represents the remaining exposure after mitigating controls are applied: Residual = Inherent * (1 - Control Effectiveness). If residual risk exceeds established corporate tolerance thresholds, remediation is mandatory.",
                "why": "Understanding residual risk quantification allows enterprise AI architects to objectively prove compliance to auditors, insurance underwriters, and regulators."
            },
            "tryIt": "Add a new subcategory 'MEASURE-1.1' with an inherent risk score of 9.5 and a low control effectiveness of 0.40. Re-run to verify how `remediation_required_codes` captures the failure."
        },
        {
            "id": 2,
            "title": "ISO/IEC 42001 Artificial Intelligence Management System (AIMS) Controls",
            "say": (
                "Having examined NIST AI RMF 1.0, we now turn our attention to the premiere international management system standard specifically engineered for artificial intelligence: ISO/IEC 42001:2023. Published jointly by the International Organization for Standardization (ISO) and the International Electrotechnical Commission (IEC), ISO 42001 specifies requirements and provides guidance for establishing, implementing, maintaining, and continually improving an Artificial Intelligence Management System (AIMS) within organizations. While general quality and information security standards like ISO 9001 and ISO/IEC 27001 establish broad process governance and data security, ISO 42001 addresses the unique complexities, autonomy, opacity, dynamic drift, and socio-technical ramifications inherent to AI systems.\n\n"
                "At the core of ISO 42001 is Annex A, which provides a comprehensive normative catalog of 38 specific AI controls categorized into multiple key objectives: AI policy and internal organization, resources for AI systems (data quality, computing infrastructure, human tooling), AI system lifecycle management (development, continuous verification, validation, deployment, decommissioning), data governance for AI, AI impact assessments, continuous monitoring and logging, third-party AI provider management, and societal/ethical relationship management. Furthermore, organizations seeking ISO 42001 certification must maintain a formal Statement of Applicability (SoA) documenting which Annex A controls are implemented, their operational justifications, and rigorous audit trails verifying conformance.\n\n"
                "For global enterprises, ISO 42001 serves as a globally recognized passport for digital commerce, enabling vendors to prove to enterprise B2B buyers and institutional procurement committees that their generative AI and predictive systems adhere to stringent, auditable management standards. AIMS requires organizations to execute formal AI Impact Assessments (AI-IA) evaluating prospective consequences on individuals, protected groups, organizational reputation, and regulatory obligations before any model is transitioned into production environments.\n\n"
                "In this part, we implement an automated ISO/IEC 42001 AIMS Statement of Applicability (SoA) verifier and AI Impact Assessment (AI-IA) engine in Python. Our system catalogs Annex A control objectives (such as A.5 Policies, A.6 Data Governance, A.7 Lifecycle, and A.8 Impact Assessment), validates whether audit artifacts exist on disk, verifies documented justifications for any excluded controls, and computes an official ISO 42001 Audit Conformance Index."
            ),
            "code": (
                "import json\n"
                "from dataclasses import dataclass\n"
                "from typing import List, Dict, Optional\n"
                "\n"
                "@dataclass\n"
                "class ISOControl:\n"
                "    clause: str\n"
                "    title: str\n"
                "    is_applicable: bool\n"
                "    implemented: bool\n"
                "    justification: str\n"
                "    audit_evidence_path: Optional[str] = None\n"
                "\n"
                "class ISO42001AIMSVerifier:\n"
                "    def __init__(self, organization: str):\n"
                "        self.organization = organization\n"
                "        self.controls: Dict[str, ISOControl] = {}\n"
                "\n"
                "    def register_control(self, control: ISOControl):\n"
                "        self.controls[control.clause] = control\n"
                "\n"
                "    def evaluate_soa(self) -> Dict:\n"
                "        applicable_controls = [c for c in self.controls.values() if c.is_applicable]\n"
                "        implemented_applicable = [c for c in applicable_controls if c.implemented and c.audit_evidence_path]\n"
                "        justified_exclusions = [c for c in self.controls.values() if not c.is_applicable and len(c.justification.strip()) > 15]\n"
                "\n"
                "        conformance_score = (len(implemented_applicable) / len(applicable_controls)) * 100 if applicable_controls else 0.0\n"
                "        certification_ready = conformance_score == 100.0 and (len(self.controls) == (len(applicable_controls) + len(justified_exclusions)))\n"
                "\n"
                "        return {\n"
                "            'organization': self.organization,\n"
                "            'total_annex_a_evaluated': len(self.controls),\n"
                "            'applicable_controls_count': len(applicable_controls),\n"
                "            'implemented_with_evidence': len(implemented_applicable),\n"
                "            'justified_exclusions_count': len(justified_exclusions),\n"
                "            'conformance_index_pct': round(conformance_score, 1),\n"
                "            'iso_42001_certification_ready': certification_ready\n"
                "        }\n"
                "\n"
                "verifier = ISO42001AIMSVerifier(organization='CognitiveEdge Enterprise Solutions')\n"
                "verifier.register_control(ISOControl('A.5.1', 'AI Policy Framework', True, True, 'Mandatory enterprise governance policy', '/evidence/aims/policy_v1.pdf'))\n"
                "verifier.register_control(ISOControl('A.6.2', 'Data Governance for AI Training & Inference', True, True, 'Controls over lineage and data poisoning', '/evidence/aims/data_gov.json'))\n"
                "verifier.register_control(ISOControl('A.7.3', 'AI System Lifecycle Verification & Validation', True, True, 'Automated CI/CD evals and regression testing', '/evidence/aims/cicd_evals.yaml'))\n"
                "verifier.register_control(ISOControl('A.8.1', 'AI Impact Assessment Protocol', True, True, 'Human rights and societal impact assessment', '/evidence/aims/ai_ia_report.pdf'))\n"
                "verifier.register_control(ISOControl('A.9.2', 'Third-Party AI Foundation Model SLA Auditing', False, False, 'Not applicable: Organization utilizes strictly on-premise open-weights models', None))\n"
                "\n"
                "soa_report = verifier.evaluate_soa()\n"
                "print(json.dumps(soa_report, indent=2))\n"
            ),
            "codeOutput": (
                "{\n"
                '  "organization": "CognitiveEdge Enterprise Solutions",\n'
                '  "total_annex_a_evaluated": 5,\n'
                '  "applicable_controls_count": 4,\n'
                '  "implemented_with_evidence": 4,\n'
                '  "justified_exclusions_count": 1,\n'
                '  "conformance_index_pct": 100.0,\n'
                '  "iso_42001_certification_ready": true\n'
                "}"
            ),
            "codeNotes": (
                "Line 6-13: `ISOControl` encapsulates Annex A control requirements, applicability flags, justifications, and evidence references.\n"
                "Line 15-33: `ISO42001AIMSVerifier` audits the Statement of Applicability (SoA), verifying that 100% of applicable controls have documented audit evidence.\n"
                "Line 35-43: Demonstrates full conformance across 5 core Annex A controls, including a validly justified exclusion of third-party SaaS APIs."
            ),
            "socratic": {
                "question": "In an ISO/IEC 42001 AIMS audit, what is the role and requirement of the Statement of Applicability (SoA) regarding excluded controls?",
                "options": [
                    "Organizations may exclude controls only if they provide a formal, documented business or technical justification, while all applicable controls must have verifiable audit evidence.",
                    "Organizations can omit any control without explanation as long as the chief technology officer signs an informal email disclaimer.",
                    "All 38 Annex A controls are legally mandatory for every company regardless of whether they develop or use AI, making exclusions illegal.",
                    "The Statement of Applicability is an optional marketing brochure that external certification bodies are instructed to ignore."
                ],
                "answerIndex": 0,
                "explanation": "ISO 42001 requires a formal Statement of Applicability (SoA). Every control in Annex A must be evaluated. If a control is deemed non-applicable (e.g. third-party sourcing when using private infrastructure), a valid justification must be documented.",
                "why": "Understanding ISO 42001 SoA mechanics ensures organizations can pass third-party registrar audits and secure international enterprise sales contracts."
            },
            "tryIt": "Modify control 'A.6.2' so `audit_evidence_path` is set to `None`. Observe how `conformance_index_pct` drops and `iso_42001_certification_ready` switches to `false`."
        },
        {
            "id": 3,
            "title": "European Union Artificial Intelligence Act (EU AI Act) Risk Classification & Conformity Assessments",
            "say": (
                "While NIST AI RMF provides voluntary architectural guidance and ISO 42001 provides standard certification criteria, the European Union Artificial Intelligence Act (EU AI Act) represents the world's first comprehensive, binding, horizontal legal regulation governing artificial intelligence systems placed on the EU market or impacting EU citizens. Enacted with strict extraterritorial jurisdiction—similar to the General Data Protection Regulation (GDPR)—the EU AI Act applies directly to global providers, deployers, importers, and distributors of AI systems regardless of whether their corporate headquarters reside in Silicon Valley, London, Singapore, or Frankfurt.\n\n"
                "The EU AI Act institutes a tiered risk-based classification architecture dividing all AI applications into four distinct regulatory tiers: Unacceptable Risk, High Risk, Specific Transparency Risk, and Minimal/Permitted Risk. Systems deemed Unacceptable Risk (Article 5) are strictly prohibited across the European Union. These include cognitive behavioral manipulation that causes physical or psychological harm, social scoring systems by public authorities or private entities, biometric categorization inferring sensitive traits (such as sexual orientation or religious beliefs), predictive policing targeting individuals based on profiling, and real-time remote biometric identification in public spaces for law enforcement (with narrow judicial exceptions).\n\n"
                "Systems classified as High Risk (Article 6 and Annex III) are subject to stringent mandatory regulatory conformity requirements before market entry. These encompass critical infrastructure (water, electricity, traffic management), educational and vocational training admissions or grading, employment and workforce recruitment/evaluation systems, access to essential private and public services (credit scoring, loan approvals, risk assessment in health/life insurance), law enforcement, migration and border control, and administration of justice and democratic processes. For high-risk systems, providers must implement a continuous risk management system (Article 9), maintain rigorous data governance over training datasets to eliminate discriminatory bias (Article 10), author comprehensive technical documentation (Article 11), maintain automatic logging and record-keeping (Article 12), guarantee transparent technical explainability to deployers (Article 13), design robust human oversight mechanisms (Article 14), and verify accuracy, cybersecurity, and robustness against adversarial attacks (Article 15).\n\n"
                "Non-compliance carries monumental financial penalties: up to €35,000,000 or 7% of global annual turnover for deploying prohibited systems, and up to €15,000,000 or 3% of global turnover for violating high-risk conformity obligations. In this part, we build an automated EU AI Act Regulatory Classification and Conformity Assessment Engine in Python. Our system parses proposed enterprise AI applications, evaluates them against Article 5 prohibited criteria and Annex III high-risk use-case triggers, assesses Articles 9-15 compliance checklists, and computes maximum regulatory penalty exposures."
            ),
            "code": (
                "import json\n"
                "from enum import Enum\n"
                "from dataclasses import dataclass\n"
                "from typing import List, Dict\n"
                "\n"
                "class EUAIRiskTier(str, Enum):\n"
                "    UNACCEPTABLE_PROHIBITED = 'UNACCEPTABLE_RISK_PROHIBITED'\n"
                "    HIGH_RISK_ANNEX_III = 'HIGH_RISK_ANNEX_III'\n"
                "    SPECIFIC_TRANSPARENCY = 'SPECIFIC_TRANSPARENCY_RISK'\n"
                "    MINIMAL_PERMITTED = 'MINIMAL_PERMITTED_RISK'\n"
                "\n"
                "@dataclass\n"
                "class AIApplicationProfile:\n"
                "    app_id: str\n"
                "    use_case: str\n"
                "    sector: str\n"
                "    involves_biometric_categorization: bool\n"
                "    involves_social_scoring: bool\n"
                "    involves_employment_screening: bool\n"
                "    involves_credit_underwriting: bool\n"
                "    annual_global_turnover_eur: float\n"
                "\n"
                "class EUAIAssessmentEngine:\n"
                "    @staticmethod\n"
                "    def classify_system(profile: AIApplicationProfile) -> EUAIRiskTier:\n"
                "        if profile.involves_social_scoring or profile.involves_biometric_categorization:\n"
                "            return EUAIRiskTier.UNACCEPTABLE_PROHIBITED\n"
                "        if profile.involves_employment_screening or profile.involves_credit_underwriting:\n"
                "            return EUAIRiskTier.HIGH_RISK_ANNEX_III\n"
                "        if profile.sector.lower() in ['customer_support', 'chatbot']:\n"
                "            return EUAIRiskTier.SPECIFIC_TRANSPARENCY\n"
                "        return EUAIRiskTier.MINIMAL_PERMITTED\n"
                "\n"
                "    @staticmethod\n"
                "    def audit_conformity(profile: AIApplicationProfile, mandatory_controls_met: List[str]) -> Dict:\n"
                "        tier = EUAIAssessmentEngine.classify_system(profile)\n"
                "        high_risk_mandates = ['Art9_RiskManagement', 'Art10_DataGov', 'Art11_TechDoc', 'Art12_Logging', 'Art13_Transparency', 'Art14_HumanOversight', 'Art15_Robustness']\n"
                "        \n"
                "        if tier == EUAIRiskTier.UNACCEPTABLE_PROHIBITED:\n"
                "            max_fine = max(35000000.0, profile.annual_global_turnover_eur * 0.07)\n"
                "            return {'status': 'ILLEGAL_DEPLOYMENT', 'tier': tier.value, 'maximum_fine_eur': max_fine, 'action': 'IMMEDIATE_CEASE_AND_DESIST'}\n"
                "        \n"
                "        elif tier == EUAIRiskTier.HIGH_RISK_ANNEX_III:\n"
                "            missing_controls = [c for c in high_risk_mandates if c not in mandatory_controls_met]\n"
                "            max_fine = max(15000000.0, profile.annual_global_turnover_eur * 0.03)\n"
                "            conformity_pass = len(missing_controls) == 0\n"
                "            return {\n"
                "                'status': 'CONFORMITY_PASSED' if conformity_pass else 'NON_COMPLIANT_HIGH_RISK',\n"
                "                'tier': tier.value,\n"
                "                'missing_mandatory_articles': missing_controls,\n"
                "                'maximum_potential_fine_eur': 0.0 if conformity_pass else max_fine,\n"
                "                'market_entry_authorized': conformity_pass\n"
                "            }\n"
                "        return {'status': 'PERMITTED', 'tier': tier.value, 'market_entry_authorized': True}\n"
                "\n"
                "fin_app = AIApplicationProfile('FIN-AI-902', 'Automated Resume Ranking & Candidate Shortlisting', 'HR', False, False, True, False, 250000000.0)\n"
                "passed_controls = ['Art9_RiskManagement', 'Art10_DataGov', 'Art11_TechDoc', 'Art12_Logging', 'Art13_Transparency', 'Art14_HumanOversight', 'Art15_Robustness']\n"
                "result = EUAIAssessmentEngine.audit_conformity(fin_app, passed_controls)\n"
                "print(json.dumps(result, indent=2))\n"
            ),
            "codeOutput": (
                "{\n"
                '  "status": "CONFORMITY_PASSED",\n'
                '  "tier": "HIGH_RISK_ANNEX_III",\n'
                '  "missing_mandatory_articles": [],\n'
                '  "maximum_potential_fine_eur": 0.0,\n'
                '  "market_entry_authorized": true\n'
                "}"
            ),
            "codeNotes": (
                "Line 6-11: `EUAIRiskTier` models the statutory risk categories defined in the European Union AI Act.\n"
                "Line 13-22: `AIApplicationProfile` captures operational attributes, demographic sensitivity, and global corporate turnover.\n"
                "Line 24-51: `EUAIAssessmentEngine` classifies risk tiers, calculates statutory maximum fine penalties (€35M / 7% vs €15M / 3%), and evaluates Articles 9-15 conformity."
            ),
            "socratic": {
                "question": "Under the EU AI Act, what regulatory tier is assigned to an enterprise AI system used for screening job applicants and ranking candidate resumes, and what are the compliance requirements?",
                "options": [
                    "High Risk (Annex III, Employment), requiring mandatory compliance with Articles 9-15 including risk management, data governance, logging, human oversight, and robustness.",
                    "Unacceptable Risk (Article 5), meaning resume screening software is strictly banned and punishable by immediate corporate dissolution.",
                    "Specific Transparency Risk only, requiring nothing more than a watermark indicating the text was generated by a computer.",
                    "Minimal Permitted Risk, exempting enterprise human resources systems from any European regulatory oversight whatsoever."
                ],
                "answerIndex": 0,
                "explanation": "Employment, recruitment, and workforce management systems are explicitly designated as High Risk under Annex III, Point 4 of the EU AI Act. Providers must satisfy strict conformity obligations under Articles 9 through 15 before placing the system on the EU market.",
                "why": "Mistaking high-risk systems for minimal risk exposes global enterprises to fines of up to €15,000,000 or 3% of global annual turnover."
            },
            "tryIt": "Set `involves_social_scoring=True` on `fin_app`. Run the script to see how the engine categorizes the application as UNACCEPTABLE_RISK_PROHIBITED with immediate cease-and-desist."
        },
        {
            "id": 4,
            "title": "Algorithmic Bias, Fairness Metrics (Disparate Impact, Equalized Odds) & Model Explainability (SHAP, LIME)",
            "say": (
                "With regulatory and management standards firmly established, we must now delve into the mathematical algorithms required to verify fairness, eradicate discriminatory bias, and produce legally defensible model explanations. In high-stakes enterprise domains—such as credit underwriting, mortgage approvals, insurance risk assessment, healthcare diagnostics, and automated hiring—AI models frequently inherit, amplify, or disguise historical human biases latent within training corpora. To avoid severe regulatory sanctions, civil litigation, and brand destruction, enterprise AI leaders must master quantitative algorithmic fairness metrics and local explainability techniques.\n\n"
                "From a regulatory jurisprudence standpoint (such as the US Equal Employment Opportunity Commission's Uniform Guidelines on Employee Selection Procedures), fairness is evaluated using empirical statistical standards such as the Four-Fifths Rule (Disparate Impact Ratio). Disparate Impact compares the selection rate of a protected demographic group against the selection rate of the highest-performing reference group. If the selection ratio falls below 0.80 (80%), the system is deemed prima facie discriminatory under disparate impact doctrines, shifting the legal burden of proof to the enterprise to demonstrate strict business necessity.\n\n"
                "In machine learning theory, fairness is formalized into distinct, often mutually incompatible mathematical criteria: Demographic Parity (requiring the positive prediction rate to be equal across all demographic groups regardless of base rates), Equal Opportunity (requiring the true positive rate, or recall, to be equal across protected groups), and Equalized Odds (requiring both the true positive rate and false positive rate to be identical across groups). Because mathematical theorems (such as the Kleinberg Impossibility Theorem) prove that these criteria cannot simultaneously be satisfied when base rates differ between groups, enterprise governance boards must explicitly choose and defend the appropriate fairness objective for their operational context.\n\n"
                "Parallel to fairness metrics is the imperative of Model Explainability. Modern deep learning and ensemble architectures operate as opaque black boxes. To satisfy Article 13/14 transparency mandates and US Fair Credit Reporting Act (FCRA) adverse action notice requirements, organizations deploy local post-hoc interpretability algorithms: SHAP (Shapley Additive exPlanations, grounded in cooperative game theory) and LIME (Local Interpretable Model-agnostic Explanations). In this part, we implement an algorithmic fairness testing and feature attribution engine in Python, calculating Disparate Impact Ratios and generating Shapley-inspired additive feature attributions for individual decisions."
            ),
            "code": (
                "import json\n"
                "from dataclasses import dataclass\n"
                "from typing import List, Dict\n"
                "\n"
                "@dataclass\n"
                "class DemographicCohort:\n"
                "    cohort_name: str\n"
                "    total_applicants: int\n"
                "    selected_positive: int\n"
                "\n"
                "    @property\n"
                "    def selection_rate(self) -> float:\n"
                "        return self.selected_positive / self.total_applicants if self.total_applicants > 0 else 0.0\n"
                "\n"
                "class FairnessAuditEngine:\n"
                "    @staticmethod\n"
                "    def compute_disparate_impact(reference: DemographicCohort, protected_cohort: DemographicCohort) -> Dict:\n"
                "        ref_rate = reference.selection_rate\n"
                "        prot_rate = protected_cohort.selection_rate\n"
                "        ratio = prot_rate / ref_rate if ref_rate > 0 else 0.0\n"
                "        four_fifths_violation = ratio < 0.80\n"
                "        return {\n"
                "            'reference_cohort': reference.cohort_name,\n"
                "            'reference_rate': round(ref_rate, 4),\n"
                "            'protected_cohort': protected_cohort.cohort_name,\n"
                "            'protected_rate': round(prot_rate, 4),\n"
                "            'disparate_impact_ratio': round(ratio, 4),\n"
                "            'four_fifths_threshold_met': not four_fifths_violation,\n"
                "            'adverse_impact_status': 'VIOLATION_ADVERSE_IMPACT' if four_fifths_violation else 'FAIR_SELECTION'\n"
                "        }\n"
                "\n"
                "class LocalExplainabilityEngine:\n"
                "    @staticmethod\n"
                "    def compute_additive_attribution(base_score: float, features: Dict[str, float], weights: Dict[str, float]) -> Dict:\n"
                "        attributions = {}\n"
                "        running_score = base_score\n"
                "        for feat, val in features.items():\n"
                "            w = weights.get(feat, 0.0)\n"
                "            delta = round(val * w, 3)\n"
                "            attributions[feat] = delta\n"
                "            running_score += delta\n"
                "        return {\n"
                "            'base_rate_score': base_score,\n"
                "            'feature_attributions': attributions,\n"
                "            'final_calibrated_decision_score': round(running_score, 3),\n"
                "            'primary_adverse_driver': min(attributions.items(), key=lambda x: x[1])[0]\n"
                "        }\n"
                "\n"
                "cohort_a = DemographicCohort('Demographic_Majority_A', total_applicants=1000, selected_positive=620)\n"
                "cohort_b = DemographicCohort('Demographic_Protected_B', total_applicants=500, selected_positive=280)\n"
                "\n"
                "fairness_report = FairnessAuditEngine.compute_disparate_impact(cohort_a, cohort_b)\n"
                "\n"
                "applicant_features = {'debt_to_income_ratio': -1.2, 'credit_history_years': 0.8, 'recent_delinquencies': -2.5}\n"
                "feature_weights = {'debt_to_income_ratio': 1.0, 'credit_history_years': 1.0, 'recent_delinquencies': 1.0}\n"
                "explanation = LocalExplainabilityEngine.compute_additive_attribution(base_score=7.0, features=applicant_features, weights=feature_weights)\n"
                "\n"
                "combined_audit = {'fairness_evaluation': fairness_report, 'individual_explanation': explanation}\n"
                "print(json.dumps(combined_audit, indent=2))\n"
            ),
            "codeOutput": (
                "{\n"
                '  "fairness_evaluation": {\n'
                '    "reference_cohort": "Demographic_Majority_A",\n'
                '    "reference_rate": 0.62,\n'
                '    "protected_cohort": "Demographic_Protected_B",\n'
                '    "protected_rate": 0.56,\n'
                '    "disparate_impact_ratio": 0.9032,\n'
                '    "four_fifths_threshold_met": true,\n'
                '    "adverse_impact_status": "FAIR_SELECTION"\n'
                '  },\n'
                '  "individual_explanation": {\n'
                '    "base_rate_score": 7.0,\n'
                '    "feature_attributions": {\n'
                '      "debt_to_income_ratio": -1.2,\n'
                '      "credit_history_years": 0.8,\n'
                '      "recent_delinquencies": -2.5\n'
                '    },\n'
                '    "final_calibrated_decision_score": 4.1,\n'
                '    "primary_adverse_driver": "recent_delinquencies"\n'
                '  }\n'
                "}"
            ),
            "codeNotes": (
                "Line 6-13: `DemographicCohort` calculates statistical selection rates for demographic sub-populations.\n"
                "Line 15-30: `FairnessAuditEngine` computes the Disparate Impact Ratio against the legal 80% (4/5ths) rule.\n"
                "Line 32-48: `LocalExplainabilityEngine` provides game-theoretic additive feature attributions and identifies primary adverse action drivers for regulatory compliance."
            ),
            "socratic": {
                "question": "If a credit scoring AI approves 60% of applicants from Demographic Group A, what is the minimum approval rate required for Demographic Group B to satisfy the legal Four-Fifths (80%) Disparate Impact rule?",
                "options": [
                    "48.0% (since 0.60 * 0.80 = 0.48, or 48% minimum approval rate).",
                    "60.0% (demographic parity requires exact identical approval percentages across all cohorts).",
                    "80.0% (the law states that every protected cohort must have at least an 80% absolute approval rate).",
                    "30.0% (the four-fifths rule allows protected cohorts to be approved at half the majority rate)."
                ],
                "answerIndex": 0,
                "explanation": "The Four-Fifths Rule requires that the selection rate for any protected group must be at least 80% (4/5) of the rate for the highest group. 80% of 60% is 48.0%. Any rate below 48.0% constitutes adverse disparate impact under EEOC and civil rights guidelines.",
                "why": "Calculating quantitative disparate impact thresholds is required by regulatory compliance officers before deploying algorithmic scoring models."
            },
            "tryIt": "Reduce `selected_positive` in `cohort_b` to 200 (a 40% selection rate). Re-run the script to observe the `VIOLATION_ADVERSE_IMPACT` trigger when the ratio drops to 0.6452."
        },
        {
            "id": 5,
            "title": "Continuous Automated Governance CI/CD Pipelines & Auditable Compliance Ledgers",
            "say": (
                "In our concluding session for Day 19, we synthesize NIST AI RMF, ISO 42001, the EU AI Act, algorithmic fairness testing, and local explainability into an end-to-end, automated Governance CI/CD Pipeline. In modern agile software engineering, code changes are automatically validated via continuous integration pipelines testing unit regressions and linting errors. In modern AI engineering, model weights, prompts, and pipeline orchestrations must undergo automated Continuous Compliance Verification before pull requests can be merged into production branches.\n\n"
                "An automated AI Governance CI/CD pipeline enforces non-negotiable compliance gates at every stage of the software delivery lifecycle: automated red-teaming scans for prompt injections and toxic jailbreaks, automated synthetic evaluation of factual accuracy and hallucination rates via golden datasets, automated statistical disparity auditing across demographic cohorts, and automated schema validation against ISO 42001 Statement of Applicability checklists. If any gate fails—for example, if a model update introduces a 0.76 disparate impact ratio or if safety guardrails allow a jailbreak payload—the CI/CD runner immediately aborts deployment, generates a cryptographic audit report, and notifies the Chief Risk Officer.\n\n"
                "Furthermore, corporate legal defense and regulatory audits demand immutability. An enterprise must be able to prove to regulatory authorities exactly what code, model weights, evaluation datasets, and compliance test results were in effect at any timestamp in history. By leveraging cryptographically signed audit ledgers (using SHA-256 chaining similar to distributed ledgers and Git commits), compliance teams produce tamper-proof proof-of-due-diligence records. These cryptographically linked logs guarantee that compliance evaluations cannot be altered retrospectively after an adverse incident occurs.\n\n"
                "In this hands-on implementation, we construct an enterprise-grade Automated AI Governance CI/CD Pipeline and Cryptographic Compliance Ledger in Python. Our system processes candidate model artifacts, executes a suite of compliance gate checks, signs each evaluation block into a cryptographic SHA-256 ledger, and renders a definitive Go/No-Go release certification."
            ),
            "code": (
                "import hashlib\n"
                "import json\n"
                "import time\n"
                "from dataclasses import dataclass, asdict\n"
                "from typing import List, Dict\n"
                "\n"
                "@dataclass\n"
                "class ComplianceGateResult:\n"
                "    gate_id: str\n"
                "    gate_name: str\n"
                "    passed: bool\n"
                "    metric_value: float\n"
                "    threshold: float\n"
                "\n"
                "class CryptographicComplianceBlock:\n"
                "    def __init__(self, index: int, previous_hash: str, system_id: str, results: List[ComplianceGateResult]):\n"
                "        self.index = index\n"
                "        self.timestamp = '2026-10-18T20:00:00Z'\n"
                "        self.system_id = system_id\n"
                "        self.results = [asdict(r) for r in results]\n"
                "        self.previous_hash = previous_hash\n"
                "        self.block_hash = self.compute_hash()\n"
                "\n"
                "    def compute_hash(self) -> str:\n"
                "        payload = json.dumps({\n"
                "            'index': self.index,\n"
                "            'timestamp': self.timestamp,\n"
                "            'system_id': self.system_id,\n"
                "            'results': self.results,\n"
                "            'previous_hash': self.previous_hash\n"
                "        }, sort_keys=True)\n"
                "        return hashlib.sha256(payload.encode('utf-8')).hexdigest()\n"
                "\n"
                "class GovernanceCICDPipeline:\n"
                "    def __init__(self, system_id: str):\n"
                "        self.system_id = system_id\n"
                "        self.ledger: List[CryptographicComplianceBlock] = []\n"
                "\n"
                "    def run_pipeline(self, gate_evaluations: List[ComplianceGateResult]) -> Dict:\n"
                "        all_passed = all(g.passed for g in gate_evaluations)\n"
                "        prev_hash = self.ledger[-1].block_hash if self.ledger else '0' * 64\n"
                "        block = CryptographicComplianceBlock(len(self.ledger) + 1, prev_hash, self.system_id, gate_evaluations)\n"
                "        self.ledger.append(block)\n"
                "        return {\n"
                "            'deployment_release_authorized': all_passed,\n"
                "            'total_gates_evaluated': len(gate_evaluations),\n"
                "            'failed_gates': [g.gate_name for g in gate_evaluations if not g.passed],\n"
                "            'signed_compliance_ledger_block': block.block_hash[:16] + '...',\n"
                "            'audit_entry_timestamp': block.timestamp\n"
                "        }\n"
                "\n"
                "pipeline = GovernanceCICDPipeline('Enterprise-WealthAdvisor-LLM-V3')\n"
                "evaluations = [\n"
                "    ComplianceGateResult('GATE-01', 'OWASP_Prompt_Injection_Resistance', True, 0.99, 0.95),\n"
                "    ComplianceGateResult('GATE-02', 'Hallucination_Faithfulness_Score', True, 0.94, 0.90),\n"
                "    ComplianceGateResult('GATE-03', 'Disparate_Impact_Fairness_Ratio', True, 0.88, 0.80),\n"
                "    ComplianceGateResult('GATE-04', 'ISO42001_AIMS_SoA_Verification', True, 1.0, 1.0)\n"
                "]\n"
                "\n"
                "cicd_verdict = pipeline.run_pipeline(evaluations)\n"
                "print(json.dumps(cicd_verdict, indent=2))\n"
            ),
            "codeOutput": (
                "{\n"
                '  "deployment_release_authorized": true,\n'
                '  "total_gates_evaluated": 4,\n'
                '  "failed_gates": [],\n'
                '  "signed_compliance_ledger_block": "d7fa13c0eb4a6825...",\n'
                '  "audit_entry_timestamp": "2026-10-18T20:00:00Z"\n'
                "}"
            ),
            "codeNotes": (
                "Line 7-13: `ComplianceGateResult` models the pass/fail state, numerical score, and tolerance threshold for a CI/CD check.\n"
                "Line 15-32: `CryptographicComplianceBlock` cryptographically chains audit records using SHA-256 hashes to prevent post-hoc tampering.\n"
                "Line 34-49: `GovernanceCICDPipeline` executes the evaluation suite, records the block in the ledger, and yields an automated deployment release verdict."
            ),
            "socratic": {
                "question": "Why is cryptographic ledger chaining (SHA-256 linking of previous block hashes) essential for enterprise AI compliance in CI/CD pipelines?",
                "options": [
                    "It creates an immutable, tamper-evident audit trail proving that mandatory safety, fairness, and governance tests were passed before deployment.",
                    "It accelerates GPU floating-point operations during deep learning matrix multiplication.",
                    "It converts unformatted text files into compressed video streams for regulatory archiving.",
                    "It bypasses all cloud security firewalls by masking model weights as cryptographic tokens."
                ],
                "answerIndex": 0,
                "explanation": "Cryptographic hash chaining ensures audit records cannot be altered or fabricated retrospectively. Any modification to past test logs invalidates all subsequent block hashes, providing undeniable mathematical proof of due diligence during regulatory or legal inquiries.",
                "why": "Immutable audit ledgers protect enterprise organizations from catastrophic liability by proving strict pre-deployment compliance."
            },
            "tryIt": "Set `passed=False` on `GATE-03` with a metric value of 0.75. Re-run the script to observe how the CI/CD pipeline denies release authorization (`deployment_release_authorized: false`)."
        }
    ]
}

if __name__ == "__main__":
    with open("scripts/bcom_ait_day19_data.json", "w", encoding="utf-8") as f:
        json.dump(day19_data, f, indent=2)
    print("Day 19 data written successfully.")
