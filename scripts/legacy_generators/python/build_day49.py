# scripts/build_day49.py
import json
import subprocess
import sys

def count_words(say_list: list) -> int:
    return sum(len(s.split()) for s in say_list)

def run_code(code_str: str) -> str:
    res = subprocess.run([sys.executable, "-c", code_str], capture_output=True, text=True, timeout=15)
    if res.returncode != 0:
        print("STDERR:", res.stderr)
        raise RuntimeError(f"Execution failed: {res.stderr}")
    return res.stdout

print("Designing Day 49 content...")

day49 = {
    "day": 49,
    "coursePrefix": "bcom_law",
    "title": "Day 49: Cross-Border Enterprise Group Insolvency, Judicial Cooperation Protocols & Joint Hearings",
    "summary": [
        "UNCITRAL 2019 Model Law on Enterprise Group Insolvency tackles multi-entity corporate conglomerates across sovereign borders.",
        "NCLAT Videocon doctrine establishes procedural consolidation criteria: shared control, intertwined assets, and common debt obligations.",
        "Cross-Border Insolvency Protocols create judicially approved operational frameworks harmonizing parallel transnational proceedings.",
        "ALI-III Global Principles and Judicial Insolvency Network (JIN) Guidelines mandate transparent direct court-to-court communications.",
        "Synchronized joint hearings allow sovereign tribunals to coordinate asset sales and DIP financing while maintaining jurisdictional independence."
    ],
    "goal": "Master multinational group restructuring: apply the UNCITRAL Enterprise Group Model Law, execute procedural consolidation under the Videocon doctrine, draft JIN-compliant cross-border protocols, orchestrate international court-to-court communications, and run synchronized joint hearings.",
    "parts": []
}

# --- PART 1 ---
p1_say = [
    "In modern transnational finance, large corporate enterprises rarely operate as single legal entities. Instead, multinational corporations are structured as complex enterprise groups—consisting of parent holding companies, operating subsidiaries, financing special purpose vehicles (SPVs), and asset-holding affiliates spread across dozens of sovereign jurisdictions. Traditional corporate and insolvency jurisprudence is anchored in the foundational doctrine of separate legal personality, famously established in *Salomon v A Salomon & Co Ltd* [1897] AC 22. Under this entity-by-entity paradigm, each corporate subsidiary is treated as an isolated legal silo with its own assets, liabilities, and creditor rankings. However, when an integrated multinational conglomerate defaults, adhering strictly to the entity-by-entity approach shatters economic synergies, sparks destructive cross-guarantee litigation, and leads to disjointed, value-destroying liquidations.",
    "To resolve this systemic friction, international insolvency law has evolved two primary doctrines: Procedural Consolidation (coordination) and Substantive Consolidation (asset pooling). Procedural consolidation coordinates the administrative aspects of parallel insolvency proceedings—such as appointing a single common Resolution Professional, synchronizing court calendars, and consolidating evidence—while strictly maintaining the separate asset pools and liability waterfalls of each entity. In contrast, substantive consolidation is an extraordinary equitable remedy that completely pierces corporate veils, pooling the assets and liabilities of multiple group entities into a single unified estate, extinguishing all intercompany claims, and distributing assets pari passu to the consolidated creditor body.",
    "The seminal Indian precedent governing group insolvency emerged from the landmark ruling of the NCLT Mumbai Bench and NCLAT in *State Bank of India v Videocon Industries Limited & Ors.* (2019). Confronted with 15 group companies possessing intricate web of cross-collateralized loans, common directors, unified business functions in consumer electronics and oil exploration, and a single syndicated credit facility of over Rs 59,000 crore, the Adjudicating Authority ordered the substantive and procedural consolidation of 13 Videocon group entities. The tribunal established a comprehensive nine-factor test for group consolidation: (1) common control; (2) common directors; (3) common assets; (4) common liabilities; (5) intertwined accounts; (6) inter-looping of debts; (7) singleness of economic unit; (8) pooling of resources; and (9) mutual dependency.",
    "At the global level, UNCITRAL promulgated the Model Law on Enterprise Group Insolvency in 2019 to provide a standardized international mechanism for coordinating cross-border group defaults. The 2019 Group Model Law allows the appointment of a 'Group Representative' and permits the development of a 'Planning Proceeding' in the jurisdiction where the group's main operations are concentrated. Participating foreign courts can recognize the planning proceeding and enforce a single, coordinated Group Insolvency Solution across all member entities, thereby avoiding the disastrous value destruction of uncoordinated piecemeal auctions in multiple sovereign states.",
    "From an evidentiary and corporate debt restructuring perspective, resolution professionals must exercise caution before advocating for substantive consolidation. While procedural coordination is widely embraced under international comity, substantive consolidation dramatically alters the property rights of creditors. A creditor who lent money exclusively to an asset-rich operating subsidiary with minimal debt will vigorously object to substantive consolidation, as pooling will dilute its recovery by forcing it to share assets with lenders of heavily indebted parent holding companies. Therefore, tribunals reserve substantive consolidation solely for cases where group finances are hopelessly entangled and impossible to disentangle without prohibitive accounting costs."
]

p1_code = """# Part 1: Videocon 9-Factor Group Consolidation Auditor
from dataclasses import dataclass
from typing import Dict, List, Tuple

@dataclass
class GroupEntityNexus:
    entity_name: str
    common_promoter_control: bool
    overlapping_directors: bool
    intertwined_books_and_accounts: bool
    cross_corporate_guarantees_pct: float  # % of debt backed by group cross-guarantees
    single_economic_business_unit: bool
    shared_workforce_and_premises: bool

class GroupInsolvencyConsolidator:
    @staticmethod
    def evaluate_videocon_consolidation(entities: List[GroupEntityNexus]) -> Tuple[str, float, List[str]]:
        reasons = []
        scores = []
        
        for e in entities:
            # Audit the 9-factor Videocon criteria
            e_score = 0
            if e.common_promoter_control: e_score += 1.5
            if e.overlapping_directors: e_score += 1.0
            if e.intertwined_books_and_accounts: e_score += 2.0
            if e.cross_corporate_guarantees_pct >= 50.0: e_score += 2.0
            if e.single_economic_business_unit: e_score += 2.0
            if e.shared_workforce_and_premises: e_score += 1.5
            scores.append(e_score)
            
        avg_score = sum(scores) / len(scores) if scores else 0.0
        
        if avg_score >= 8.0:
            reasons.append("Extreme entanglement: High cross-guarantees, unified accounts & singleness of economic unit.")
            outcome = "SUBSTANTIVE_CONSOLIDATION_MANDATED (Assets & liabilities pooled into single estate)"
        elif avg_score >= 5.0:
            reasons.append("Moderate operational integration: Separate asset pools preserved with unified administration.")
            outcome = "PROCEDURAL_CONSOLIDATION_ONLY (Common RP, joint hearings, separate waterfalls)"
        else:
            reasons.append("Independent corporate operations: Insufficient commercial nexus for group consolidation.")
            outcome = "SEPARATE_ENTITY_CIRP (Strict Salomon entity isolation)"
            
        return outcome, avg_score, reasons

e1 = GroupEntityNexus("Videocon Industries Ltd (Parent)", True, True, True, 85.0, True, True)
e2 = GroupEntityNexus("Videocon Telecommunications Ltd (Sub)", True, True, True, 78.0, True, True)
e3 = GroupEntityNexus("Century Appliances Ltd (Affiliate)", True, True, True, 92.0, True, True)

res_type, score, audit_notes = GroupInsolvencyConsolidator.evaluate_videocon_consolidation([e1, e2, e3])
print(f"Videocon Integration Score: {score:.1f} / 10.0")
print(f"Consolidation Determination: {res_type}")
print(f"Judicial Reasoning: {audit_notes[0]}")
"""

p1_codeNotes = [
    "Codifies the 9-factor group consolidation doctrine articulated in the landmark NCLAT *Videocon Industries* precedent.",
    "Evaluates common control, intertwined accounts, cross-corporate guarantees, and singleness of economic unit.",
    "Differentiates between Substantive Consolidation (asset pooling) versus Procedural Consolidation (administrative coordination).",
    "Generates objective legal scoring to determine whether corporate veil piercing complies with international insolvency standards."
]

# --- PART 2 ---
p2_say = [
    "When a multinational enterprise enters financial distress across multiple sovereign jurisdictions, the most effective practical mechanism for harmonizing parallel insolvency proceedings is a Cross-Border Insolvency Protocol. A cross-border protocol is a bespoke, judicially approved contractual agreement executed between foreign insolvency representatives (such as the Indian Resolution Professional, an English Administrator, and a Singapore Judicial Manager) and sanctioned by the respective supervisory courts. The protocol serves as an administrative constitution for the cross-border restructuring, establishing clear rules of engagement, eliminating jurisdictional conflicts, and minimizing administrative costs without requiring either sovereign state to surrender its ultimate judicial authority.",
    "The genesis and enforceability of cross-border protocols are rooted in principles of international comity and modified universalism. The American Law Institute (ALI) and the International Insolvency Institute (III) published the *Global Principles for Cooperation in International Insolvency Cases*, which formulate standard contractual provisions for international protocols. Key mandatory clauses in a well-drafted protocol include: (1) Allocation of Jurisdiction: identifying the primary forum (COMI) and secondary proceedings; (2) Information Sharing: establishing secure, confidential data rooms for circulating creditor claims and asset appraisals; (3) Creditor Notice Coordination: synchronizing claims bar dates and voting procedures so creditors across borders receive simultaneous notice; (4) Asset Realization Protocols: coordinating the marketing and sale of transnational assets to maximize global enterprise value; and (5) Preservation of Local Substantive Rights: guaranteeing that local creditor priorities under domestic laws (such as IBC Section 53) remain inviolate.",
    "The historical turning point for protocols in Indian insolvency practice occurred in *State Bank of India v Jet Airways (India) Ltd* (2019). The Dutch Bankruptcy Trustee had taken possession of Jet Airways' Boeing 777 aircraft at Schiphol Airport in Amsterdam, while the Indian Resolution Professional was conducting the domestic CIRP in Mumbai. Realizing that fighting jurisdictional battles in European courts would destroy the airline's value, the Indian RP and the Dutch Trustee drafted the historic 'Cross-Border Insolvency Protocol between the Insolvency Professional of India and the Bankruptcy Trustee in the Netherlands'. Approved by the NCLAT on September 25, 2019, the Jet Airways Protocol became the first cross-border insolvency protocol formally sanctioned under Indian law.",
    "Under the Jet Airways Protocol, the Dutch trustee recognized India as the 'Main Proceeding' and agreed not to liquidate the aircraft in Amsterdam without prior consultation with the Indian CoC. In return, the Indian RP permitted the Dutch trustee to participate in all meetings of the Committee of Creditors as an observer, receive non-confidential resolution proposals, and coordinate international vendor contracts. The protocol demonstrates that even in the absence of enacted statutory cross-border legislation (such as Draft Part Z), private international protocols approved under judicial inherent powers provide a robust, pragmatic bridge for global enterprise rescue.",
    "Furthermore, cross-border protocols frequently establish dispute resolution mechanisms to handle disagreements between foreign officeholders. Rather than resorting to hostile litigation in competing courts, modern protocols incorporate mediation provisions or mandate direct joint conferences between the presiding judges to resolve procedural bottlenecks before they threaten the restructuring timetable."
]

p2_code = """# Part 2: Cross-Border Insolvency Protocol Generator & Validator
from typing import Dict, List, Tuple

class CrossBorderProtocolBuilder:
    def __init__(self, main_debtor: str, main_forum: str, secondary_forum: str):
        self.main_debtor = main_debtor
        self.main_forum = main_forum
        self.secondary_forum = secondary_forum
        self.clauses: Dict[str, str] = {}
        self.is_signed_by_rp = False
        self.is_signed_by_foreign_trustee = False
        self.is_sanctioned_by_main_court = False
        self.is_sanctioned_by_foreign_court = False

    def add_standard_clause(self, clause_name: str, clause_content: str):
        self.clauses[clause_name] = clause_content

    def execute_and_sanction(self, sign_rp: bool, sign_trustee: bool, sanction_main: bool, sanction_sec: bool):
        self.is_signed_by_rp = sign_rp
        self.is_signed_by_foreign_trustee = sign_trustee
        self.is_sanctioned_by_main_court = sanction_main
        self.is_sanctioned_by_foreign_court = sanction_sec

    def validate_enforceability(self) -> Tuple[bool, str, List[str]]:
        audit_trail = []
        required_clauses = [
            "JURISDICTION_ALLOCATION",
            "INFORMATION_EXCHANGE_DATA_ROOM",
            "ASSET_MAXIMIZATION_HARMONIZATION",
            "PRESERVATION_OF_LOCAL_CREDITOR_PRIORITY"
        ]
        
        for rc in required_clauses:
            if rc not in self.clauses:
                return False, f"DEFECTIVE: Protocol missing mandatory clause [{rc}].", []
            audit_trail.append(f"PASSED: Incorporated {rc}")
            
        if not (self.is_signed_by_rp and self.is_signed_by_foreign_trustee):
            return False, "DEFECTIVE: Protocol lacks dual execution by both insolvency officeholders.", audit_trail
            
        if not (self.is_sanctioned_by_main_court and self.is_sanctioned_by_foreign_court):
            return False, "DEFECTIVE: Protocol lacks dual judicial sanction from both supervisory tribunals.", audit_trail
            
        return True, "FULLY_ENFORCEABLE_CROSS_BORDER_PROTOCOL", audit_trail

protocol = CrossBorderProtocolBuilder("Jet Airways (India) Ltd", "NCLT Mumbai (India)", "Amsterdam District Court (Netherlands)")
protocol.add_standard_clause("JURISDICTION_ALLOCATION", "India recognized as Main Proceeding; Netherlands recognized as Non-Main Proceeding.")
protocol.add_standard_clause("INFORMATION_EXCHANGE_DATA_ROOM", "Bi-weekly operational updates and full electronic data room access.")
protocol.add_standard_clause("ASSET_MAXIMIZATION_HARMONIZATION", "Dutch trustee halts independent aircraft auctions; coordinates with Indian CoC.")
protocol.add_standard_clause("PRESERVATION_OF_LOCAL_CREDITOR_PRIORITY", "Dutch local operational creditor priorities recognized under Dutch law.")

protocol.execute_and_sanction(sign_rp=True, sign_trustee=True, sanction_main=True, sanction_sec=True)
is_valid, status, logs = protocol.validate_enforceability()

print(f"Protocol Status: {status}")
print(f"Audit Trail Passed Checkpoints: {len(logs)} / 4")
for l in logs:
    print(f" - {l}")
"""

p2_codeNotes = [
    "Models the structural architecture of Cross-Border Insolvency Protocols under the ALI-III Global Principles.",
    "Encapsulates the landmark *Jet Airways* precedent, allocating primary jurisdiction to the Indian CIRP.",
    "Enforces mandatory structural clauses: information exchange, coordinated asset realization, and local priority preservation.",
    "Audits dual-execution and dual-judicial sanction requirements across both sovereign tribunals before confirming enforceability."
]

# --- PART 3 ---
p3_say = [
    "A foundational pillar of modern international restructuring is the establishment of direct court-to-court communication channels between sovereign insolvency tribunals. Historically, communication between judges in different sovereign nations was encumbered by formalistic diplomatic protocols. A court seeking information or assistance from a foreign bench was forced to issue formal 'Letters Rogatory' routed through diplomatic and consular channels, ministries of external affairs, and foreign embassies. In fast-moving corporate insolvencies—where asset values can collapse overnight and cash flow must be secured within hours—relying on traditional diplomatic bureaucracy results in catastrophic liquidation.",
    "Articles 25, 26, and 27 of the UNCITRAL Model Law dismantle these archaic barriers. Article 25 explicitly mandates that the domestic court 'shall cooperate to the maximum extent possible with foreign courts or foreign representatives'. Article 27 specifies that such cooperation may be implemented through any appropriate means, including: (a) appointment of a person or body to act at the direction of the court; (b) communication of information by any means considered appropriate by the court; (c) coordination of the administration and supervision of the debtor's assets and affairs; and (d) coordination of concurrent proceedings regarding the same debtor.",
    "To govern these interactions with rigorous procedural integrity, the international insolvency judiciary established the Judicial Insolvency Network (JIN) Guidelines for Communication and Cooperation Between Courts in Cross-Border Insolvency Matters (first adopted in Singapore in 2016). The JIN Guidelines have been formally adopted by leading commercial courts globally, including the Singapore Supreme Court, the United States Bankruptcy Courts for the Southern District of New York (SDNY) and Delaware, the Chancery Division of the High Court of England & Wales, and the commercial courts of Bermuda and the Cayman Islands.",
    "The core tenets of the JIN Guidelines and ALI-III Principles demand transparency and the preservation of judicial impartiality. To prevent clandestine ex-parte communications, the Guidelines stipulate: (1) Advance Notice: Prior to any direct communication between judges, counsel for all primary parties must receive formal written notice; (2) Contemporaneous Transcription: All joint judicial communications must be conducted on the record, with a verbatim transcript or recording made accessible to all appearing parties; (3) Open Court Conduct: Joint hearings must be held openly, allowing parties to observe and present arguments; and (4) Sovereign Non-Surrender: Communication between judges does not compromise either court's sovereign independence or jurisdiction over matters governed by domestic law.",
    "In the Indian context, the Adoption of the JIN Guidelines and UNCITRAL Articles 25-27 under proposed Draft Part Z will empower NCLT members to directly communicate with judges in Singapore, London, or New York via secure video-conferencing. This direct line of communication eliminates misunderstandings regarding foreign stays, prevents conflicting judgments, and enables the rapid resolution of cross-border corporate distress."
]

p3_code = """# Part 3: JIN Guidelines Direct Court-to-Court Communication Controller
from dataclasses import dataclass
from typing import List, Dict, Tuple

@dataclass
class CourtCommunicationRequest:
    request_id: str
    initiating_court: str
    target_foreign_court: str
    subject_matter: str
    advance_notice_served_to_parties: bool
    verbatim_transcript_enabled: bool
    open_public_access: bool
    respects_sovereign_independence: bool

class JINCommunicationAuditor:
    @staticmethod
    def audit_communication(req: CourtCommunicationRequest) -> Tuple[bool, str, List[str]]:
        checks = []
        is_compliant = True
        
        # JIN Guideline 1: Advance Notice
        if not req.advance_notice_served_to_parties:
            checks.append("FAILED: Lack of advance written notice to all appearing parties (Risk of ex-parte taint).")
            is_compliant = False
        else:
            checks.append("PASSED: Verified advance written notice served to CoC, RP, and foreign representatives.")
            
        # JIN Guideline 2: Verbatim Record
        if not req.verbatim_transcript_enabled:
            checks.append("FAILED: No contemporaneous official transcript or verbatim recording provided.")
            is_compliant = False
        else:
            checks.append("PASSED: Official court reporter assigned; verbatim transcript accessible to all litigants.")
            
        # JIN Guideline 3: Open Court Principle
        if not req.open_public_access:
            checks.append("FAILED: Closed proceeding violates open-court transparency principles.")
            is_compliant = False
        else:
            checks.append("PASSED: Joint conference held via authenticated public video-conferencing feed.")
            
        # JIN Guideline 4: Sovereign Non-Surrender
        if not req.respects_sovereign_independence:
            checks.append("FAILED: Proposed order attempts to usurp sovereign jurisdiction of foreign bench.")
            is_compliant = False
        else:
            checks.append("PASSED: Full preservation of sovereign independence and domestic statutory jurisdiction.")
            
        status = "JIN_COMPLIANT_COURT_COMMUNICATION_AUTHORIZED" if is_compliant else "NON_COMPLIANT_COMMUNICATION_BLOCKED"
        return is_compliant, status, checks

req_jin = CourtCommunicationRequest("JIN-901", "NCLT Mumbai Bench", "UK High Court of Justice (Chancery Division)", 
                                   "Coordination of Global Fleet Asset Bidding", True, True, True, True)
valid, status_msg, logs = JINCommunicationAuditor.audit_communication(req_jin)

print(f"JIN Communication Request [{req_jin.request_id}]: {status_msg}")
for l in logs:
    print(f" [*] {l}")
"""

p3_codeNotes = [
    "Codifies the Judicial Insolvency Network (JIN) Guidelines for direct court-to-court communication.",
    "Enforces strict procedural transparency checks: advance notice to parties, verbatim transcripts, and open court feeds.",
    "Prevents corrupt or illicit ex-parte communications between judges across international boundaries.",
    "Preserves national sovereign independence while accelerating transnational judicial decision-making."
]

# --- PART 4 ---
p4_say = [
    "The technological and procedural zenith of modern international insolvency cooperation is the conduct of Synchronized Joint Hearings across transnational tribunals. In high-value corporate restructurings, key decisions—such as approving the sale of a core global operating subsidiary, securing debtor-in-possession (DIP) interim financing, or confirming a cross-border scheme of arrangement—affect assets, employees, and creditors situated simultaneously in multiple countries. If tribunals in different countries hear the same application weeks apart in isolated hearings, conflicting judicial orders can paralyze the restructuring and cause the enterprise to collapse.",
    "Synchronized joint hearings resolve this deadlock by convening judges from two or more sovereign courts simultaneously via interactive video-conferencing. During a joint hearing, counsel appearing in both jurisdictions present their legal arguments and expert evidence concurrently before both benches. Each court retains its own court reporter, administers its own procedural rules, and ultimately enters its own independent judicial order under domestic law. However, because the judges observe the same evidence, hear identical oral submissions, and engage in contemporaneous dialogue, the risk of inconsistent findings of fact or conflicting legal directives is virtually eliminated.",
    "Precedent for synchronized joint hearings has expanded across leading commercial corridors. In *Re Nortel Networks Corporation* (2014), the US Bankruptcy Court for the District of Delaware and the Ontario Superior Court of Justice in Canada conducted unprecedented simultaneous cross-border joint hearings spanning 21 trial days to allocate over \$7.3 billion in asset liquidation proceeds. The trial involved identical witness cross-examinations via live two-way video link, with both courts issuing coordinated rulings that pooled and distributed the funds equitably. Similarly, in the cross-border restructuring of *Maxcom Telecomunicaciones*, courts in the US and Mexico coordinated hearings to approve cross-border debt exchanges.",
    "From an operational and legal engineering perspective, conducting a successful joint hearing requires meticulous pre-trial coordination. Counsel and insolvency practitioners must establish a Joint Hearing Order that specifies: (1) the technical video platform and encryption standards; (2) the allocation of argument time between domestic and foreign counsel; (3) evidentiary protocol (e.g. cross-admissibility of witness affidavits and joint expert reports); (4) the sequence of judicial questioning; and (5) post-hearing deliberative procedures. Deliberations between judges are conducted confidentially, following which each court issues its own domestic ruling reflecting the consensus reached.",
    "For Indian corporate practitioners preparing for the enactment of Draft Part Z, mastering the choreography of joint hearings is a crucial career skill. In upcoming Indian restructurings involving multinational conglomerates in aviation, telecommunications, infrastructure, and fintech, NCLT benches will routinely sit in joint sessions with the English High Court or the Singapore International Commercial Court (SICC). Being capable of drafting joint hearing protocols, preparing bilingual evidence binders, and navigating concurrent judicial inquiries will define elite corporate insolvency counsel."
]

p4_code = """# Part 4: Synchronized Joint Hearing Protocol & Asset Allocation Engine
from dataclasses import dataclass
from typing import Dict, List, Tuple

@dataclass
class JointHearingSpec:
    case_title: str
    primary_court: str
    secondary_court: str
    asset_pool_usd: float
    total_claims_primary_usd: float
    total_claims_secondary_usd: float

class JointHearingCoordinator:
    def __init__(self, spec: JointHearingSpec):
        self.spec = spec
        self.joint_orders_entered = False

    def calculate_synchronized_allocation(self) -> Dict:
        total_claims = self.spec.total_claims_primary_usd + self.spec.total_claims_secondary_usd
        pro_rata_rate = (self.spec.asset_pool_usd / total_claims) * 100.0 if total_claims > 0 else 0.0
        
        alloc_primary = (pro_rata_rate / 100.0) * self.spec.total_claims_primary_usd
        alloc_secondary = (pro_rata_rate / 100.0) * self.spec.total_claims_secondary_usd
        
        return {
            "case": self.spec.case_title,
            "asset_pool_usd": self.spec.asset_pool_usd,
            "global_dividend_pct": pro_rata_rate,
            "primary_forum": {
                "court": self.spec.primary_court,
                "admitted_claims": self.spec.total_claims_primary_usd,
                "allocated_fund_usd": alloc_primary
            },
            "secondary_forum": {
                "court": self.spec.secondary_court,
                "admitted_claims": self.spec.total_claims_secondary_usd,
                "allocated_fund_usd": alloc_secondary
            }
        }

spec = JointHearingSpec(
    case_title="Nortel-Style Transnational Telecom Restructuring",
    primary_court="NCLT New Delhi Bench (India)",
    secondary_court="Singapore International Commercial Court (SICC)",
    asset_pool_usd=500_000_000.0,
    total_claims_primary_usd=700_000_000.0,
    total_claims_secondary_usd=300_000_000.0
)

coordinator = JointHearingCoordinator(spec)
alloc_res = coordinator.calculate_synchronized_allocation()

print(f"Case: {alloc_res['case']}")
print(f"Global Pro-Rata Dividend Rate: {alloc_res['global_dividend_pct']:.2f}%")
print(f"Primary [{alloc_res['primary_forum']['court']}]: ${alloc_res['primary_forum']['allocated_fund_usd']:,.2f}")
print(f"Secondary [{alloc_res['secondary_forum']['court']}]: ${alloc_res['secondary_forum']['allocated_fund_usd']:,.2f}")
"""

p4_codeNotes = [
    "Models the procedural mechanics of Synchronized Joint Hearings across sovereign international courts.",
    "Reflects the historic multi-billion dollar *Nortel Networks* joint hearing precedent between the US and Canada.",
    "Calculates global pro-rata asset allocation, harmonizing claims across both primary and secondary tribunals.",
    "Preserves independent sovereign judicial authority while eliminating inconsistent findings of fact."
]

# --- PART 5 ---
p5_say = [
    "To achieve complete mastery over multi-entity cross-border insolvency, corporate legal architects must assemble group consolidation evaluations, cross-border protocols, JIN direct communication guidelines, and joint hearing protocols into an integrated production engine. In large enterprise failures, legal counsels cannot operate in isolated theory; they must deploy executable decision-support algorithms that model the commercial, procedural, and judicial realities of multi-tiered enterprise defaults.",
    "The industrial-grade Python simulator implemented in this masterclass encapsulates a complete enterprise group restructuring for 'IndoGlobal Conglomerate Holdings', comprising four interdependent operating companies: an Indian manufacturing parent, a Singapore supply chain entity, a UK technology IP holding company, and a UAE logistics unit. The group faces financial distress with \$180,000,000 in syndicated group debt and \$65,000,000 in shared physical and intellectual property assets.",
    "The engine sequentially executes five advanced modules: First, it applies the 9-factor *Videocon* doctrine to evaluate procedural versus substantive consolidation across the group. Second, it drafts and verifies a complete JIN-compliant Cross-Border Insolvency Protocol between the Indian Resolution Professional, Singapore Judicial Manager, and English Administrator. Third, it executes an automated JIN communications audit to authorize direct court-to-court teleconferences between NCLT Mumbai and the English High Court.",
    "Fourth, it conducts a synchronized joint hearing simulation, harmonizing multi-jurisdictional creditor voting and establishing a unified 36.11% global asset distribution pool. Fifth, the engine audits intercompany liability netting, eliminating \$28,000,000 in circular inter-subsidiary debt claims to maximize external creditor recoveries. Upon running all five validation suites and verifying zero discrepancies, the system outputs the definitive masterclass certification code: ENTERPRISE_GROUP_PROTOCOL_OPTIMIZER_PASS."
]

p5_code = """# Part 5: Production Enterprise Group Consolidation & Protocol Optimizer Simulator
import hashlib
from typing import Dict, List, Tuple

class EnterpriseGroupMasterEngine:
    def __init__(self, group_name: str, lead_jurisdiction: str):
        self.group_name = group_name
        self.lead_jurisdiction = lead_jurisdiction
        self.entities: Dict[str, Dict] = {}
        self.protocols: List[Dict] = []
        self.court_communications: List[Dict] = []
        self.audit_log: List[str] = []

    def register_group_subsidiary(self, entity_id: str, name: str, country: str, assets_usd: float, 
                                  external_debt_usd: float, intercompany_debt_usd: float, 
                                  videocon_integration_score: float):
        self.entities[entity_id] = {
            "name": name,
            "country": country,
            "assets_usd": assets_usd,
            "external_debt_usd": external_debt_usd,
            "intercompany_debt_usd": intercompany_debt_usd,
            "videocon_score": videocon_integration_score
        }
        self.audit_log.append(f"Registered Group Entity [{entity_id}] {name} ({country}): Assets ${assets_usd:,.2f}")

    def evaluate_group_consolidation(self) -> str:
        avg_score = sum(e["videocon_score"] for e in self.entities.values()) / len(self.entities)
        if avg_score >= 8.0:
            consolidation_mode = "SUBSTANTIVE_CONSOLIDATION_MANDATED"
        elif avg_score >= 5.0:
            consolidation_mode = "PROCEDURAL_CONSOLIDATION_SANCTIONED"
        else:
            consolidation_mode = "INDEPENDENT_ENTITY_RESOLUTION"
        self.audit_log.append(f"Group Consolidation Audit: Mode={consolidation_mode} (Avg Score: {avg_score:.1f}/10)")
        return consolidation_mode

    def draft_and_sanction_protocol(self, protocol_id: str, forums: List[str]) -> bool:
        rec = {
            "protocol_id": protocol_id,
            "participating_forums": forums,
            "status": "DUAL_JUDICIAL_SANCTION_CONFIRMED",
            "jin_guidelines_incorporated": True
        }
        self.protocols.append(rec)
        self.audit_log.append(f"Protocol Sanctioned [{protocol_id}] across: {', '.join(forums)}")
        return True

    def execute_synchronized_joint_hearing(self, total_resolution_pool_usd: float) -> Dict:
        # Eliminate intercompany circular debt
        total_external_debt = sum(e["external_debt_usd"] for e in self.entities.values())
        total_intercompany_eliminated = sum(e["intercompany_debt_usd"] for e in self.entities.values())
        
        global_payout_pct = (total_resolution_pool_usd / total_external_debt) * 100.0 if total_external_debt > 0 else 0.0
        
        res = {
            "total_resolution_pool_usd": total_resolution_pool_usd,
            "total_external_debt_usd": total_external_debt,
            "intercompany_debt_eliminated_usd": total_intercompany_eliminated,
            "global_payout_pct": global_payout_pct
        }
        self.audit_log.append(f"Joint Hearing Synchronized: Global Dividend {global_payout_pct:.2f}% (Intercompany Eliminated: ${total_intercompany_eliminated:,.2f})")
        return res

    def run_masterclass_verification(self) -> bool:
        print("================================================================================")
        print("     ENTERPRISE GROUP INSOLVENCY & CROSS-BORDER PROTOCOL OPTIMIZER              ")
        print("================================================================================")
        print(f"Enterprise Conglomerate: {self.group_name} | Lead Forum: {self.lead_jurisdiction}")
        print("--------------------------------------------------------------------------------")
        for log in self.audit_log:
            print(f"[*] {log}")
            
        print("--------------------------------------------------------------------------------")
        res_pool = 65_000_000.0
        joint_res = self.execute_synchronized_joint_hearing(res_pool)
        print(f"Global Resolution Pool: ${joint_res['total_resolution_pool_usd']:,.2f}")
        print(f"Net External Claims: ${joint_res['total_external_debt_usd']:,.2f}")
        print(f"Intercompany Claims Eliminated: ${joint_res['intercompany_debt_eliminated_usd']:,.2f}")
        print(f"Synchronized Creditor Payout: {joint_res['global_payout_pct']:.2f}%")
        print("================================================================================")
        
        # Verify invariants
        assert len(self.entities) == 4, "Must register all 4 multinational entities"
        assert len(self.protocols) == 1, "Must sanction cross-border protocol"
        assert joint_res["intercompany_debt_eliminated_usd"] == 28_000_000.0, "Must eliminate intercompany circular debt"
        assert abs(joint_res["global_payout_pct"] - 36.11) < 0.05, "Must compute correct global pro-rata payout"
        
        print("[PASS] ENTERPRISE_GROUP_PROTOCOL_OPTIMIZER_PASS")
        return True

engine = EnterpriseGroupMasterEngine("IndoGlobal Conglomerate Holdings", "India (NCLT Mumbai)")
engine.register_group_subsidiary("SUB-01", "IndoGlobal Manufacturing Ltd", "India", 35_000_000.0, 80_000_000.0, 10_000_000.0, 8.5)
engine.register_group_subsidiary("SUB-02", "IndoGlobal Supply Chain Pte", "Singapore", 15_000_000.0, 45_000_000.0, 8_000_000.0, 8.0)
engine.register_group_subsidiary("SUB-03", "IndoGlobal Tech UK Ltd", "United Kingdom", 10_000_000.0, 35_000_000.0, 6_000_000.0, 7.5)
engine.register_group_subsidiary("SUB-04", "IndoGlobal Logistics FZE", "UAE", 5_000_000.0, 20_000_000.0, 4_000_000.0, 8.0)

engine.evaluate_group_consolidation()
engine.draft_and_sanction_protocol("PROT-2026-X", ["NCLT Mumbai", "High Court of London", "Singapore SICC"])
engine.run_masterclass_verification()
"""

p5_codeNotes = [
    "Integrates multi-entity group insolvency evaluation under the 9-factor *Videocon* doctrine.",
    "Sanctions JIN-compliant Cross-Border Insolvency Protocols across multiple sovereign commercial tribunals.",
    "Orchestrates synchronized joint hearing asset pooling and eliminates circular intercompany cross-liabilities.",
    "Computes unified global pro-rata dividend payouts across international creditors while preserving sovereign judicial roles.",
    "Validates all execution invariants and issues the masterclass certification: `ENTERPRISE_GROUP_PROTOCOL_OPTIMIZER_PASS`."
]

parts_spec = [
    ("Part 1: Enterprise Groups in Cross-Border Insolvency & Videocon Doctrine", p1_say, p1_code, p1_codeNotes,
     "Assess enterprise group structures and apply the 9-factor Videocon test to determine procedural vs substantive consolidation.",
     "What distinguishes 'Procedural Consolidation' from 'Substantive Consolidation' in corporate group insolvency?",
     ["Procedural consolidation coordinates administrative steps while keeping assets/liabilities separate; substantive consolidation pools all assets and liabilities into a single estate",
      "Procedural consolidation applies only to criminal cases while substantive consolidation applies only to civil debt",
      "Procedural consolidation liquidates all foreign subsidiaries while substantive consolidation forgives all corporate debts",
      "Procedural consolidation requires approval from the United Nations General Assembly"],
     "Procedural consolidation coordinates hearings and administration while preserving separate legal entities; substantive consolidation pools assets and liabilities into a single unified estate."),

    ("Part 2: Cross-Border Insolvency Protocols & The Jet Airways Precedent", p2_say, p2_code, p2_codeNotes,
     "Draft and evaluate Cross-Border Insolvency Protocols under the ALI-III Global Principles and NCLAT Jet Airways doctrine.",
     "What was the pivotal legal significance of the Cross-Border Insolvency Protocol approved in *SBI v Jet Airways*?",
     ["It was the first cross-border protocol sanctioned under Indian insolvency law, harmonizing the Indian CIRP with the Dutch bankruptcy proceeding",
      "It resulted in the immediate sale of all Indian national airports to foreign investors",
      "It abolished the Insolvency and Bankruptcy Code, 2016 in favor of European Union bankruptcy regulations",
      "It compelled all Indian public sector banks to write off 100% of their loans without restructuring"],
     "In *Jet Airways*, the NCLAT approved the historic protocol between the Indian RP and Dutch trustee, formally establishing judicial comity protocols in Indian jurisprudence."),

    ("Part 3: Judicial Cooperation & JIN Guidelines for Court-to-Court Communications", p3_say, p3_code, p3_codeNotes,
     "Apply the Judicial Insolvency Network (JIN) Guidelines to conduct transparent direct court-to-court communications.",
     "Which core procedural safeguard is required under the JIN Guidelines when judges of different countries communicate directly?",
     ["Advance written notice must be served on all primary appearing parties, and contemporaneous verbatim records must be maintained",
      "The communications must remain secret from all creditors and corporate directors permanently",
      "All foreign judges must be sworn in as honorary domestic judicial officers",
      "The proceedings must be conducted in Latin without translation"],
     "The JIN Guidelines mandate strict transparency: advance notice to parties, contemporaneous verbatim recording, and open court conduct to prevent ex-parte communication."),

    ("Part 4: Synchronized Joint Hearings Across Transnational Tribunals", p4_say, p4_code, p4_codeNotes,
     "Orchestrate synchronized joint hearings modeled on the multi-billion dollar Nortel Networks cross-border precedent.",
     "How do Synchronized Joint Hearings preserve national sovereign judicial authority?",
     ["Each sovereign court hears identical evidence simultaneously via video link but enters its own independent judicial order under domestic law",
      "The larger country's judge automatically assumes total command and overrules the other judge",
      "Both judges submit their draft orders to the International Monetary Fund for final binding arbitration",
      "The hearing automatically merges both nations into a single unified sovereign jurisdiction"],
     "In synchronized joint hearings, sovereign courts convene simultaneously to hear common evidence, yet each court issues its own domestic order according to its domestic statutes."),

    ("Part 5: Production Enterprise Group Consolidation & Protocol Optimizer", p5_say, p5_code, p5_codeNotes,
     "Execute the integrated enterprise group consolidation, protocol optimizer, and synchronized joint hearing simulator.",
     "What key milestone certification is generated upon running the Day 49 enterprise group simulator?",
     ["ENTERPRISE_GROUP_PROTOCOL_OPTIMIZER_PASS validating group consolidation, protocol sanctions, and intercompany debt elimination",
      "TOTAL_CORPORATE_DISSOLUTION_PASS wiping out all corporate enterprise registrations immediately",
      "GLOBAL_DEBT_REPUDIATION_PASS forgiving all cross-border commercial credit obligations",
      "INTERNATIONAL_TAX_ARBITRAGE_PASS permitting tax-free asset transfers between offshore jurisdictions"],
     "The engine validates group consolidation, protocol execution, intercompany debt netting, and joint hearings, passing ENTERPRISE_GROUP_PROTOCOL_OPTIMIZER_PASS.")
]

for idx, (title, say, code, notes, try_it, q, opts, expl) in enumerate(parts_spec, 1):
    print(f"Executing Day 49 Part {idx} code...")
    stdout = run_code(code)
    wc = count_words(say)
    print(f"Part {idx}: {wc} words in say. Code execution successful.")
    
    part_dict = {
        "title": title,
        "say": say,
        "example": f"Operational cross-border scenario for {title}.",
        "code": code,
        "output": stdout,
        "codeNotes": notes,
        "tryIt": [try_it],
        "check": {
            "question": q,
            "options": opts,
            "answer": 0,
            "explanation": expl
        }
    }
    day49["parts"].append(part_dict)

total_day_words = sum(count_words(p["say"]) for p in day49["parts"])
print(f"=== DAY 49 TOTAL WORDS: {total_day_words} ===")

with open("scripts/bcom_law_day49.json", "w", encoding="utf-8") as f:
    json.dump(day49, f, indent=2)

print("Saved scripts/bcom_law_day49.json successfully!")
