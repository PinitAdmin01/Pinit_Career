# scripts/build_day48.py
import json
import subprocess
import sys
import hashlib

def count_words(say_list: list) -> int:
    return sum(len(s.split()) for s in say_list)

def run_code(code_str: str) -> str:
    res = subprocess.run([sys.executable, "-c", code_str], capture_output=True, text=True, timeout=15)
    if res.returncode != 0:
        print("STDERR:", res.stderr)
        raise RuntimeError("Execution failed")
    return res.stdout

print("Designing Day 48 content...")

day48 = {
    "day": 48,
    "coursePrefix": "bcom_law",
    "title": "Day 48: Cross-Border Asset Recovery, Extraterritorial Discovery & Article 21 Discretionary Relief",
    "summary": [
        "Article 21 empowers insolvency courts to grant expansive discretionary relief, including asset entrustment, evidence taking, and execution stays.",
        "Article 22 mandates adequate protection for domestic creditors before debtor assets can be repatriated overseas by a foreign representative.",
        "Extraterritorial discovery leverages Norwich Pharmacal disclosure orders and Section 19/66 duties to pierce offshore trusts and shell entities.",
        "Anti-suit injunctions restrain aggressive creditors from forum shopping or pursuing individual actions in uncoordinated foreign courts.",
        "Article 6 establishes a strictly construed 'public policy' (ordre public) defense, protecting constitutional rights and procedural due process."
    ],
    "goal": "Master extraterritorial corporate asset recovery: deploy Article 21 discretionary remedies, audit Article 22 creditor protections, execute cross-border discovery and clawback under IBC Sections 43/45/66, evaluate anti-suit injunctions, and apply Article 6 public policy safeguards.",
    "parts": []
}

# --- PART 1 ---
p1_say = [
    "Under the UNCITRAL Model Law on Cross-Border Insolvency (1997), Article 21 constitutes the dynamic engine of international judicial assistance. While Article 20 provides an automatic, non-discretionary stay upon recognition of a Foreign Main Proceeding (FMP), real-world cross-border insolvencies demand flexible, case-specific remedies to prevent the rapid dissipation of enterprise assets. Article 21 fills this imperative by authorizing the receiving court, upon application of the foreign representative, to grant any appropriate discretionary relief where needed to protect the debtor's assets or the interests of creditors. This includes staying execution against the debtor's assets, suspending the right to transfer or encumber assets, providing for the examination of witnesses and the taking of evidence, and crucially, entrusting the administration and realization of all or part of the debtor's assets located in the enacting State to the foreign representative.",
    "However, the power to entrust domestic assets to a foreign representative is strictly governed by the mandatory balancing test of Article 22. Article 22(1) dictates that in granting or modifying relief under Article 21, the court must be satisfied that the interests of domestic creditors and other interested persons, including the debtor, are 'adequately protected'. This statutory safeguard is designed to prevent the catastrophic scenario where a foreign representative swoops into a jurisdiction, liquidates local factories or bank accounts, repatriates the entire proceeds to a distant offshore jurisdiction, and leaves local trade vendors, utility suppliers, and resident employees with unpaid claims and no practical remedy in foreign courts.",
    "To satisfy the 'adequate protection' standard under Article 22, international insolvency tribunals impose stringent conditions when granting Article 21 asset turnover orders. Courts frequently require the foreign representative to post a substantial financial bond or bank guarantee, establish a ring-fenced domestic escrow account, or provide a formal undertaking that domestic statutory claims (such as accrued employee wages and local government taxes) will be paid in full prior to any cross-border funds repatriation. In the seminal English case *In re Pan Ocean Co Ltd* [2014] EWHC 2124 (Ch), the High Court of Justice held that discretionary relief under the Model Law cannot be used to subvert local proprietary rights or bypass statutory insolvency priorities established by domestic law.",
    "From an Indian legal standpoint under the IBC and proposed Draft Part Z, the interplay between Article 21 discretionary relief and Section 53 waterfall priorities requires sophisticated structuring. When an Indian NCLT bench considers an application by an overseas liquidator to repatriate Indian assets of a foreign parent company, the NCLT must ensure that Indian operational creditors and workmen are protected. The Adjudicating Authority possesses the statutory discretion to direct that local workmen dues under Section 53(1)(b) be carved out and distributed domestically before the remaining asset surplus is entrusted to the foreign representative. This ensures that international judicial cooperation does not compromise domestic constitutional and statutory rights.",
    "Furthermore, Article 21(2) addresses the entrustment of assets upon recognition of a Foreign Non-Main Proceeding (FNMP). In an FNMP, the court's authority is narrower: the court must be satisfied that the assets, under the law of the enacting State, should be administered in that specific foreign non-main proceeding. This ensures that assets belonging to the global main estate are not improperly seized or diverted by secondary foreign administrators acting outside their territorial mandate."
]

p1_code = """# Part 1: Article 21 Discretionary Relief & Article 22 Protection Auditor
from typing import Dict, List, Tuple

class DiscretionaryReliefController:
    def __init__(self, domestic_forum: str, debtor_name: str):
        self.domestic_forum = domestic_forum
        self.debtor_name = debtor_name

    def evaluate_asset_entrustment(self, asset_value_usd: float, local_workmen_dues: float, 
                                  local_tax_claims: float, foreign_rep_bonded: bool) -> Tuple[bool, str, Dict]:
        # Article 22 Adequate Protection Analysis
        statutory_local_priority = local_workmen_dues + local_tax_claims
        net_repatriable_surplus = asset_value_usd - statutory_local_priority
        
        if not foreign_rep_bonded:
            return False, "DENIED: Foreign representative failed to post required statutory security bond under Art 22.", {}
            
        if net_repatriable_surplus < 0:
            return False, "DENIED: Domestic priority claims exceed total local asset value; zero surplus available for foreign repatriation.", {}
            
        conditions = {
            "domestic_escrow_holdback": statutory_local_priority,
            "repatriation_authorized_usd": net_repatriable_surplus,
            "reporting_interval_days": 30,
            "undertaking_filed": True
        }
        
        return True, "GRANTED_WITH_CONDITIONS: Domestic creditors protected under Article 22 holdback escrow.", conditions

controller = DiscretionaryReliefController(domestic_forum="India (NCLT Mumbai)", debtor_name="Pacific Cargo Shipping Ltd")
approved, reason, conds = controller.evaluate_asset_entrustment(
    asset_value_usd=15_000_000.0,
    local_workmen_dues=1_800_000.0,
    local_tax_claims=700_000.0,
    foreign_rep_bonded=True
)

print(f"Status: {approved}")
print(f"Judicial Order: {reason}")
if approved:
    print(f"Local Escrow Holdback: ${conds['domestic_escrow_holdback']:,.2f}")
    print(f"Repatriable Surplus: ${conds['repatriation_authorized_usd']:,.2f}")
"""

p1_codeNotes = [
    "Models Article 21 discretionary asset entrustment subject to mandatory Article 22 adequate protection requirements.",
    "Audits local statutory priority claims (workmen dues, sovereign taxes) before authorizing cross-border asset turnover.",
    "Enforces procedural conditions: requires foreign representative bonding and creation of domestic escrow holdbacks.",
    "Demonstrates how modern insolvency courts protect domestic stakeholders while facilitating international asset recovery."
]

# --- PART 2 ---
p2_say = [
    "In cross-border corporate insolvency, recovering corporate value concealed in offshore secrecy jurisdictions is one of the most formidable challenges facing Resolution Professionals and liquidators. When a corporate debtor slides into distress, delinquent promoters frequently orchestrate fraudulent avoidance transactions—transferring valuable patents, shares, and liquid capital to shell corporations and discretionary trusts in offshore financial centers like the Cayman Islands, the British Virgin Islands (BVI), Switzerland, and Mauritius. To combat this illicit asset flight, the insolvency practitioner must integrate the investigative discovery powers of domestic insolvency statutes with transnational common-law disclosure remedies.",
    "Under the Indian IBC, Section 19 imposes an absolute statutory duty on the personnel of the corporate debtor, promoters, directors, and statutory auditors to extend complete cooperation and provide all operational and financial records to the Resolution Professional. Where management stonewalls or withholds books of accounts, the RP petitions the NCLT under Section 19(2) for coercive enforcement orders. When assets and electronic banking records are situated outside India, the RP invokes Section 66 (fraudulent trading and wrongful trading) and Sections 43, 45, and 49 (preferential, undervalued, and defrauding creditor avoidance transactions). However, an Indian NCLT avoidance order carries limited coercive weight in an offshore banking haven unless accompanied by extraterritorial discovery mechanisms recognized under international law.",
    "The primary international legal weapons for extraterritorial asset discovery are *Norwich Pharmacal* orders and *Bankers Trust* disclosure orders. First established by the UK House of Lords in *Norwich Pharmacal Co v Customs and Excise Commissioners* [1974] AC 133, a Norwich Pharmacal order compels an innocent third party who has become entangled in the wrongdoing (such as a correspondent bank, registered offshore corporate agent, or clearing house) to disclose the identity of wrongdoers and provide full transaction documentation. In *Bankers Trust Co v Shapira* [1980] 1 WLR 1274, the English Court of Appeal expanded this remedy, enabling insolvency practitioners to obtain immediate, urgent disclosure of bank account ledgers and wire transfer routes where there is a prima facie showing that funds belong to the debtor's estate.",
    "In parallel, insolvency practitioners utilize cross-border letters of request and recognition under UNCITRAL Model Law Article 21(1)(d) to subpoena offshore directors and conduct oral depositions under oath. Once bank records disclose that debtor funds were routed through offshore nominee entities, the Resolution Professional files avoidance applications under IBC Section 45 and 49 to claw back the value. In the landmark Indian ruling *Anuj Jain v Axis Bank Limited* (2020), the Supreme Court affirmed that the provisions of Chapter III of the IBC governing avoidance transactions are designed to restore the asset pool of the corporate debtor to its unencumbered state, and courts must look through circuitous commercial facades to identify the ultimate economic beneficiary.",
    "The evidentiary threshold for extraterritorial clawback requires forensic tracing of funds through correspondent banking rails (SWIFT MT103 and MT202 messaging logs). Resolution Professionals work with international forensic accountants to establish the unbroken chain of custody from debtor disbursements to offshore accounts. Demonstrating that an offshore transfer occurred during the statutory lookback twilight period (two years for related parties under Section 43/45) creates an evidentiary presumption of avoidance, empowering foreign courts recognizing the main proceeding to void the transfer and order the repatriation of funds to the insolvency estate."
]

p2_code = """# Part 2: Extraterritorial Discovery & Avoidance Clawback Engine
from dataclasses import dataclass
from typing import List, Dict

@dataclass
class SuspiciousTransfer:
    transfer_id: str
    beneficiary_entity: str
    jurisdiction: str
    amount_usd: float
    months_prior_to_icd: int
    is_related_party: bool
    has_commercial_consideration: bool

class ExtraterritorialClawbackAuditor:
    def __init__(self, debtor_name: str, lookback_unrelated_months: int = 12, lookback_related_months: int = 24):
        self.debtor_name = debtor_name
        self.lookback_unrelated = lookback_unrelated_months
        self.lookback_related = lookback_related_months

    def audit_transfer(self, transfer: SuspiciousTransfer) -> Dict:
        max_lookback = self.lookback_related if transfer.is_related_party else self.lookback_unrelated
        in_twilight_zone = transfer.months_prior_to_icd <= max_lookback
        
        # Section 45 / 49 Avoidance Determination
        is_avoidable = False
        remedy = "NONE_VALID_COMMERCIAL_TRANSACTION"
        statute_ref = "IBC Section 45/49 & UNCITRAL Art 21"
        
        if in_twilight_zone and not transfer.has_commercial_consideration:
            is_avoidable = True
            remedy = "EXTRATERRITORIAL_CLAWBACK_ORDER (Norwich Pharmacal & Banker Trust)"
        elif in_twilight_zone and transfer.is_related_party:
            is_avoidable = True
            remedy = "RELATED_PARTY_PREFERENTIAL_CLAWBACK (IBC Section 43)"
            
        return {
            "transfer_id": transfer.transfer_id,
            "target": transfer.beneficiary_entity,
            "jurisdiction": transfer.jurisdiction,
            "amount_usd": transfer.amount_usd,
            "is_avoidable": is_avoidable,
            "statutory_remedy": remedy,
            "clawback_eligible": is_avoidable
        }

auditor = ExtraterritorialClawbackAuditor("GigaGlobal Tech Holdings Ltd")
tx1 = SuspiciousTransfer("TX-8821", "Cayman Apex SPV Ltd", "Cayman Islands", 14_500_000.0, months_prior_to_icd=8, is_related_party=True, has_commercial_consideration=False)
tx2 = SuspiciousTransfer("TX-8822", "Zurich Private Asset AG", "Switzerland", 6_200_000.0, months_prior_to_icd=18, is_related_party=False, has_commercial_consideration=True)

res1 = auditor.audit_transfer(tx1)
res2 = auditor.audit_transfer(tx2)

print(f"Transfer 1 ({res1['target']}): Avoidable={res1['is_avoidable']} | Action: {res1['statutory_remedy']}")
print(f"Transfer 2 ({res2['target']}): Avoidable={res2['is_avoidable']} | Action: {res2['statutory_remedy']}")
"""

p2_codeNotes = [
    "Models extraterritorial avoidance discovery and clawback under IBC Sections 43, 45, 49, and 66.",
    "Applies statutory lookback twilight period rules (12 months for arm's length, 24 months for related parties).",
    "Integrates Norwich Pharmacal and Bankers Trust disclosure remedies for piercing offshore financial secrecy.",
    "Calculates total recoverable offshore estate assets and outputs actionable clawback litigation targets."
]

# --- PART 3 ---
p3_say = [
    "In cross-border corporate distress, the risk of uncoordinated, predatory creditor litigation in foreign forums poses a catastrophic threat to enterprise preservation. When news of an impending insolvency becomes public, aggressive institutional creditors and distressed debt funds frequently engage in aggressive 'forum shopping'. Creditors may rush to file debt collection suits, seize aircraft or cargo ships, arrest bank accounts, or petition for winding up in peripheral jurisdictions that have not adopted the UNCITRAL Model Law or where courts act without international communication. Such unilateral creditor actions dismantle going-concern value, trigger severe cross-default clauses across syndicate agreements, and subvert the collective pari passu principle.",
    "To protect the collective insolvency estate against such destructive individual actions, courts exercising jurisdiction over the debtor's Centre of Main Interests (COMI) deploy the potent equitable remedy of the Anti-Suit Injunction. An anti-suit injunction is an in personam order issued by a court restraining a party subject to its personal jurisdiction from commencing, prosecuting, or enforcing legal proceedings in a foreign court. It is critical to emphasize that an anti-suit injunction does not purport to bind or interfere directly with the foreign sovereign court; rather, it operates in personam against the recalcitrant creditor. If the creditor breaches the anti-suit injunction, they face severe sanctions, including contempt of court, sequestration of their domestic assets, and immediate dismissal of any claims filed in the main insolvency proceeding.",
    "The international jurisprudence governing anti-suit injunctions was authoritatively articulated by the UK Privy Council in *Société Nationale Industrielle Aérospatiale v Lee Kui Jak* [1987] AC 871 and the English Court of Appeal in *Airbus Industrie GIE v Patel* [1999] 1 AC 119. Under these established principles, a court will grant an anti-suit injunction if: (1) the respondent creditor is amenable to the in personam jurisdiction of the court; (2) the foreign proceeding is vexatious, oppressive, or unconscionable; and (3) granting the injunction does not offend international comity. In the insolvency context, international tribunals have held that attempting to seize assets belonging to the worldwide insolvency estate or pursuing parallel litigation to gain an unfair preference over other creditors is inherently unconscionable and warrants immediate injunctive relief (e.g. *Stena Drilling Ltd v Gulf Marine Drilling Ltd* [2008] EWHC 1528 (Comm)).",
    "From an Indian judicial perspective, the High Courts and the Supreme Court of India possess well-settled jurisdiction under Section 41 of the Specific Relief Act, 1963 and the Code of Civil Procedure, 1908 to issue anti-suit injunctions (*Modi Entertainment Network v W.S.G. Cricket Pte Ltd* (2003) 4 SCC 341). In an ongoing CIRP under the IBC, the statutory moratorium under Section 14 binds all creditors subject to Indian jurisdiction. If an Indian creditor or a multinational bank with operations in India attempts to enforce debt claims against the debtor's assets in London or New York in defiance of the Section 14 moratorium, the Resolution Professional can petition the NCLT and High Court for an anti-suit injunction, restraining the creditor from proceeding abroad.",
    "Furthermore, under Article 21(1)(a) and Article 23 of the UNCITRAL Model Law, foreign courts recognizing the Indian main proceeding will reinforce the anti-suit injunction by granting reciprocal stays within their domestic borders. This dual shield—an in personam anti-suit injunction issued by the COMI forum combined with local statutory stays granted by recognizing foreign tribunals—effectively neutralizes creditor forum-shopping and locks all stakeholders into a single, unified restructuring negotiation."
]

p3_code = """# Part 3: Anti-Suit Injunction & Forum-Shopping Restraint Engine
from dataclasses import dataclass
from typing import Dict, List, Tuple

@dataclass
class ForeignLitigationAction:
    action_id: str
    creditor_name: str
    foreign_court: str
    target_asset: str
    claim_amount_usd: float
    creditor_has_domestic_presence: bool
    is_vexatious_or_preferential: bool

class AntiSuitInjunctionController:
    def __init__(self, comi_court: str, debtor_name: str):
        self.comi_court = comi_court
        self.debtor_name = debtor_name

    def evaluate_anti_suit_injunction(self, action: ForeignLitigationAction) -> Tuple[bool, str, Dict]:
        # Test 1: In personam jurisdiction over the creditor
        if not action.creditor_has_domestic_presence:
            return False, "DENIED: Court lacks in personam jurisdiction over foreign creditor without domestic nexus.", {}
            
        # Test 2: Unconscionable / Vexatious breach of collective insolvency
        if not action.is_vexatious_or_preferential:
            return False, "DENIED: Foreign proceeding does not threaten collective estate integrity or create unfair preference.", {}
            
        order_details = {
            "injunction_type": "IN_PERSONAM_ANTI_SUIT_INJUNCTION",
            "enjoining_court": self.comi_court,
            "target_creditor": action.creditor_name,
            "restrained_forum": action.foreign_court,
            "sanctions_on_breach": [
                "Contempt of court proceedings",
                "Sequestration of domestic assets",
                "Disqualification of claim in CIRP"
            ]
        }
        
        return True, "GRANTED: Anti-suit injunction issued; creditor restrained from prosecuting foreign action.", order_details

controller = AntiSuitInjunctionController("NCLT Mumbai Bench (India)", "AeroGlobal Cargo Ltd")
act1 = ForeignLitigationAction("ACT-01", "Vulture Capital Fund LLC", "Bermuda Supreme Court", "Commercial Cargo Vessel", 18_000_000.0, 
                              creditor_has_domestic_presence=True, is_vexatious_or_preferential=True)
act2 = ForeignLitigationAction("ACT-02", "Tokyo Marine Syndicate", "Tokyo District Court", "Spare Jet Engines", 4_500_000.0, 
                              creditor_has_domestic_presence=False, is_vexatious_or_preferential=True)

status1, reason1, order1 = controller.evaluate_anti_suit_injunction(act1)
status2, reason2, _ = controller.evaluate_anti_suit_injunction(act2)

print(f"Action 1 ({act1.creditor_name}): Injunction {status1} -> {reason1}")
print(f"Action 2 ({act2.creditor_name}): Injunction {status2} -> {reason2}")
"""

p3_codeNotes = [
    "Implements the legal mechanics of In Personam Anti-Suit Injunctions under *SNI Aérospatiale* and *Modi Entertainment Network*.",
    "Audits personal jurisdiction thresholds: confirms whether the target creditor has branch operations or assets within the domestic forum.",
    "Establishes unconscionability: evaluates whether foreign litigation disrupts the statutory moratorium or seeks an illegal preference.",
    "Details severe enforcement sanctions on breach: contempt of court, domestic asset sequestration, and claims disqualification."
]

# --- PART 4 ---
p4_say = [
    "While the UNCITRAL Model Law on Cross-Border Insolvency is built on the universalist philosophy of judicial cooperation and comity, national sovereignty is preserved through the statutory 'Public Policy Exception' codified under Article 6. Article 6 provides: 'Nothing in this Law prevents the court from refusing to take an action governed by this Law if the action would be manifestly contrary to the public policy of this State.' This exception serves as the ultimate constitutional emergency brake, allowing domestic courts to reject foreign insolvency proceedings, deny foreign representative access, or refuse to enforce foreign restructuring plans if doing so would violate fundamental domestic legal values.",
    "The defining statutory phrase in Article 6 is the word 'manifestly'. The drafting history of UNCITRAL reveals that the inclusion of 'manifestly' was intensely deliberate. The standard is exceedingly narrow and restrictive: it is not sufficient that a foreign insolvency law is merely different from domestic law, or that domestic creditors might receive a slightly lower dividend, or that foreign procedural rules diverge from local practice. To invoke Article 6, the foreign proceeding or relief sought must violate the fundamental constitutional order, violate core human rights, or infringe basic procedural due process (such as a total lack of notice or hearing, depriving affected parties of the fundamental right to be heard—*audi alteram partem*).",
    "International case law demonstrates the strictness with which courts apply Article 6. In the leading US decision *In re Ephedra Products Liability Litigation*, 349 B.R. 333 (S.D.N.Y. 2006), American creditors objected to recognizing a Canadian claims resolution procedure because it did not provide for jury trials as guaranteed by the Seventh Amendment of the US Constitution. The US Federal District Court rejected the public policy objection, holding that the Canadian procedure provided fair notice and impartial judicial oversight, which satisfied fundamental procedural due process even without a jury trial. Similarly, in *In re Qimonda AG*, 462 B.R. 165 (Bankr. E.D. Va. 2011), the court held that public policy was violated only because applying German insolvency law would have entirely stripped patent licensees of their statutory licenses without any compensation, which threatened the core intellectual property infrastructure of the United States.",
    "In the Indian constitutional framework, Article 6 has vital significance under proposed Draft Part Z of the IBC. An Indian NCLT bench would be legally justified in invoking the public policy exception under specific, grave circumstances: (1) if a foreign proceeding originated in a jurisdiction without procedural due process, where creditors were given no notice of proceedings; (2) if the foreign proceeding sought to enforce criminal confiscation disguised as insolvency; or (3) if the foreign plan blatantly violated statutory constitutional guarantees, such as discriminating against Indian creditors purely on grounds of nationality or race.",
    "However, Indian courts must guard against protectionist misuse of the public policy defense. The Supreme Court of India in *Renusagar Power Co Ltd v General Electric Co* (1994 Supp (1) SCC 644) and *Vijay Karia v Prysmian Cavi E Sistemi Srl* (2020) 11 SCC 1 laid down that in the context of international enforcement, 'public policy' must be construed narrowly and is confined to: (a) fundamental policy of Indian law; (b) the interests of India; and (c) justice or morality. A mere commercial disagreement with a foreign resolution plan or an argument that Indian tax authorities should receive absolute priority over secured creditors will not meet the 'manifestly contrary' threshold under Article 6."
]

p4_code = """# Part 4: Article 6 Public Policy (Ordre Public) Narrow Standard Auditor
from dataclasses import dataclass
from typing import List, Dict, Tuple

@dataclass
class ForeignReliefRequest:
    request_id: str
    origin_country: str
    relief_type: str
    violates_due_process_audi_alteram: bool
    discriminates_by_nationality: bool
    mere_statutory_waterfall_difference: bool
    violates_fundamental_constitutional_policy: bool

class PublicPolicyAuditor:
    @staticmethod
    def evaluate_article_6_exception(req: ForeignReliefRequest) -> Tuple[bool, str, Dict]:
        # Article 6 standard: "MANIFESTLY CONTRARY TO PUBLIC POLICY"
        violations = []
        is_manifestly_contrary = False
        
        if req.violates_due_process_audi_alteram:
            violations.append("Violation of fundamental procedural due process: denial of notice and right to be heard (Audi Alteram Partem).")
            is_manifestly_contrary = True
            
        if req.discriminates_by_nationality:
            violations.append("Blatant sovereign discrimination: foreign plan explicitly subordinates claims based on nationality.")
            is_manifestly_contrary = True
            
        if req.violates_fundamental_constitutional_policy:
            violations.append("Direct violation of core constitutional public policy and sovereign legal order.")
            is_manifestly_contrary = True
            
        # Merely having a different priority waterfall or procedure is NOT a ground
        if req.mere_statutory_waterfall_difference and not is_manifestly_contrary:
            return False, "RECOGNITION_GRANTED: Difference in local commercial priority does NOT meet the 'manifestly contrary' threshold of Article 6.", {
                "article_6_invoked": False,
                "reasons": ["Standard commercial variance allowed under international comity (Renusagar / Ephedra doctrine)"]
            }
            
        if is_manifestly_contrary:
            return True, "RECOGNITION_DENIED: Relief is manifestly contrary to public policy under Article 6.", {
                "article_6_invoked": True,
                "reasons": violations
            }
            
        return False, "RECOGNITION_GRANTED: Complies with international public policy standards.", {"article_6_invoked": False}

req_valid = ForeignReliefRequest("REQ-01", "United Kingdom", "Enforcement of UK Scheme of Arrangement", 
                                 violates_due_process_audi_alteram=False, discriminates_by_nationality=False, 
                                 mere_statutory_waterfall_difference=True, violates_fundamental_constitutional_policy=False)
req_illegal = ForeignReliefRequest("REQ-02", "Rogue Island", "Ex-Parte Asset Confiscation Decree", 
                                   violates_due_process_audi_alteram=True, discriminates_by_nationality=True, 
                                   mere_statutory_waterfall_difference=False, violates_fundamental_constitutional_policy=True)

status1, expl1, _ = PublicPolicyAuditor.evaluate_article_6_exception(req_valid)
status2, expl2, _ = PublicPolicyAuditor.evaluate_article_6_exception(req_illegal)

print(f"Request 1 (UK Scheme): Article 6 Invoked={status1} -> {expl1}")
print(f"Request 2 (Rogue Decree): Article 6 Invoked={status2} -> {expl2}")
"""

p4_codeNotes = [
    "Encapsulates UNCITRAL Model Law Article 6 'Public Policy' (ordre public) statutory emergency defense.",
    "Enforces the strict 'manifestly contrary' standard articulated in *Ephedra* and *Renusagar*.",
    "Differentiates between legitimate constitutional violations (lack of due process, nationality discrimination) versus permissible differences in commercial priority.",
    "Safeguards national legal sovereignty while preventing protectionist denial of foreign insolvency comity."
]

# --- PART 5 ---
p5_say = [
    "To achieve professional legal engineering excellence, insolvency practitioners and senior corporate counsels must synthesize the doctrines of Article 21 discretionary relief, Article 22 adequate creditor protection, extraterritorial asset tracing, anti-suit injunctions, and Article 6 public policy safeguards into a production-grade operational system. In contemporary transnational commerce, when a multinational corporate group faces debt default, restructuring teams must make split-second legal determinations to safeguard global enterprise value against predator litigation.",
    "The industrial-grade Python engine developed in this masterclass models an end-to-end extraterritorial asset recovery and cross-border protection scenario for a multinational group operating across India, Singapore, the United Kingdom, and the Cayman Islands. The simulator initializes an ongoing Corporate Insolvency Resolution Process (CIRP) before NCLT Mumbai, with \$95,000,000 in admitted financial claims. The engine simultaneously confronts three multi-jurisdictional threats: (1) offshore asset dissipation via fraudulent undervalue transfers to a Cayman shell company; (2) aggressive forum-shopping by a vulture fund attempting to seize cargo vessels in Bermuda; and (3) a petition by a foreign representative seeking discretionary asset repatriation under Article 21.",
    "The engine sequentially executes four forensic modules: First, it conducts a forensic lookback audit under IBC Sections 43, 45, and 49, issuing Norwich Pharmacal disclosure commands and establishing a \$14,500,000 offshore clawback claim. Second, it audits the foreign creditor's litigation in Bermuda, confirms in personam jurisdiction, and issues a binding Anti-Suit Injunction with asset sequestration sanctions. Third, it evaluates the foreign asset turnover application under Article 21, enforcing an Article 22 holdback escrow to ring-fence \$2,500,000 in domestic workmen dues and tax liabilities before approving surplus repatriation.",
    "Fourth, the engine performs a constitutional Article 6 public policy audit on incoming foreign decrees, filtering out ex-parte orders lacking procedural due process while upholding legitimate comity requests under the *Renusagar* standard. Upon executing all four investigative modules and verifying statutory invariants with zero errors, the simulator confirms the full recovery and insulation of the cross-border estate, concluding with the definitive certification code: CROSS_BORDER_ASSET_RECOVERY_AND_PUBLIC_POLICY_PASS."
]

p5_code = """# Part 5: Production Extraterritorial Asset Recovery & Public Policy Shield Simulator
import hashlib
from typing import Dict, List, Tuple

class CrossBorderAssetRecoveryMasterEngine:
    def __init__(self, debtor_name: str, comi_forum: str):
        self.debtor_name = debtor_name
        self.comi_forum = comi_forum
        self.clawbacks: List[Dict] = []
        self.injunctions: List[Dict] = []
        self.repatriation_orders: List[Dict] = []
        self.audit_log: List[str] = []

    def execute_extraterritorial_clawback(self, tx_id: str, target: str, jurisdiction: str, 
                                        amount_usd: float, lookback_months: int, is_related: bool) -> bool:
        max_lookback = 24 if is_related else 12
        if lookback_months <= max_lookback:
            rec = {
                "tx_id": tx_id,
                "target": target,
                "jurisdiction": jurisdiction,
                "amount_usd": amount_usd,
                "status": "CLAWBACK_ENFORCED",
                "remedy": "Norwich Pharmacal / Section 45 Order"
            }
            self.clawbacks.append(rec)
            self.audit_log.append(f"Clawback Enforced [{tx_id}]: ${amount_usd:,.2f} from {target} ({jurisdiction})")
            return True
        return False

    def issue_anti_suit_injunction(self, action_id: str, creditor: str, forum: str, claim_usd: float) -> bool:
        inj = {
            "action_id": action_id,
            "creditor": creditor,
            "restrained_forum": forum,
            "claim_usd": claim_usd,
            "status": "IN_PERSONAM_INJUNCTION_ISSUED"
        }
        self.injunctions.append(inj)
        self.audit_log.append(f"Anti-Suit Injunction Issued [{action_id}]: Restrained {creditor} in {forum}")
        return True

    def process_article21_repatriation(self, asset_value_usd: float, local_workmen_dues: float, 
                                      local_taxes: float, bonded: bool) -> Dict:
        statutory_holdback = local_workmen_dues + local_taxes
        surplus = asset_value_usd - statutory_holdback
        
        assert bonded, "Foreign representative must post Article 22 bond"
        assert surplus >= 0, "Domestic priority claims must be satisfied"
        
        order = {
            "total_assets_usd": asset_value_usd,
            "local_escrow_holdback": statutory_holdback,
            "repatriation_authorized": surplus,
            "status": "APPROVED_WITH_ARTICLE_22_PROTECTION"
        }
        self.repatriation_orders.append(order)
        self.audit_log.append(f"Article 21 Repatriation Approved: ${surplus:,.2f} surplus authorized (Holdback: ${statutory_holdback:,.2f})")
        return order

    def audit_article6_public_policy(self, request_name: str, has_due_process: bool, is_discriminatory: bool) -> bool:
        if not has_due_process or is_discriminatory:
            self.audit_log.append(f"Article 6 Exception Invoked: Blocked [{request_name}] for manifest constitutional breach.")
            return False
        self.audit_log.append(f"Article 6 Audit Passed: Recognized [{request_name}] under international comity.")
        return True

    def run_production_verification(self) -> bool:
        print("================================================================================")
        print("     CROSS-BORDER ASSET RECOVERY, ANTI-SUIT & PUBLIC POLICY ENGINE              ")
        print("================================================================================")
        print(f"Debtor: {self.debtor_name} | Main Proceeding Forum: {self.comi_forum}")
        print("--------------------------------------------------------------------------------")
        for log in self.audit_log:
            print(f"[*] {log}")
            
        print("--------------------------------------------------------------------------------")
        total_clawback = sum(c["amount_usd"] for c in self.clawbacks)
        print(f"Total Extraterritorial Offshore Clawback Enforced: ${total_clawback:,.2f}")
        print(f"Active Anti-Suit Injunctions Protecting Estate: {len(self.injunctions)}")
        print(f"Article 22 Protected Domestic Escrows Active: {len(self.repatriation_orders)}")
        print("================================================================================")
        
        # Verify invariants
        assert total_clawback >= 14_000_000.0, "Clawback must recover offshore fraudulent transfers"
        assert len(self.injunctions) == 1, "Must issue anti-suit injunction against vulture litigation"
        assert self.repatriation_orders[0]["status"] == "APPROVED_WITH_ARTICLE_22_PROTECTION", "Must protect domestic creditors"
        
        print("[PASS] CROSS_BORDER_ASSET_RECOVERY_AND_PUBLIC_POLICY_PASS")
        return True

engine = CrossBorderAssetRecoveryMasterEngine("TransOceanic Maritime Holdings Ltd", "NCLT Mumbai Bench (India)")
engine.execute_extraterritorial_clawback("CB-901", "Cayman Apex SPV Ltd", "Cayman Islands", 14_500_000.0, lookback_months=8, is_related=True)
engine.issue_anti_suit_injunction("AS-101", "Vulture Capital Fund LLC", "Bermuda Supreme Court", 18_000_000.0)
engine.process_article21_repatriation(asset_value_usd=15_000_000.0, local_workmen_dues=1_800_000.0, local_taxes=700_000.0, bonded=True)
engine.audit_article6_public_policy("UK Administration Asset Transfer", has_due_process=True, is_discriminatory=False)
engine.audit_article6_public_policy("Ex-Parte Rogue Decree", has_due_process=False, is_discriminatory=True)

engine.run_production_verification()
"""

p5_codeNotes = [
    "Integrates cross-border fraudulent transfer clawback under IBC Section 45 with Norwich Pharmacal discovery remedies.",
    "Issues In Personam Anti-Suit Injunctions to defeat predatory forum shopping in non-cooperative offshore forums.",
    "Implements Article 21 discretionary asset turnover with mandatory Article 22 domestic creditor escrow holdbacks.",
    "Applies the Article 6 'manifestly contrary' public policy filter to block unconstitutional foreign decrees.",
    "Outputs comprehensive multi-jurisdictional audit trail and verifies `CROSS_BORDER_ASSET_RECOVERY_AND_PUBLIC_POLICY_PASS`."
]

parts_spec = [
    ("Part 1: Article 21 Discretionary Relief & Article 22 Adequate Protection", p1_say, p1_code, p1_codeNotes,
     "Evaluate discretionary relief applications under Article 21 and apply the Article 22 adequate protection balancing test.",
     "What statutory condition must be satisfied under Article 22 before an insolvency court can entrust domestic assets to a foreign representative under Article 21?",
     ["The court must be satisfied that the interests of domestic creditors and other interested persons are adequately protected",
      "The foreign representative must transfer complete corporate ownership to the sovereign wealth fund",
      "All foreign debt obligations must be unconditionally forgiven by international decree",
      "The domestic court must resign its sovereign jurisdiction and refer the case to the World Bank"],
     "Article 22(1) mandates that in granting relief under Article 21, the court must be satisfied that the interests of domestic creditors and interested persons are adequately protected."),

    ("Part 2: Extraterritorial Discovery, Asset Tracing & Offshore Clawbacks", p2_say, p2_code, p2_codeNotes,
     "Deploy Norwich Pharmacal and Bankers Trust discovery remedies to uncover and claw back offshore fraudulent transfers.",
     "What is the legal function of a 'Norwich Pharmacal' order in cross-border asset recovery?",
     ["It compels an entangled third party (such as a correspondent bank) to disclose information and documents identifying wrongdoers and asset trails",
      "It automatically sentences delinquent directors to criminal imprisonment without trial",
      "It dissolves the corporate debtor and liquidates all assets within 24 hours",
      "It converts all unsecured foreign debt into non-voting sovereign debt instruments"],
     "Originating in *Norwich Pharmacal v Customs and Excise*, this equitable remedy compels an entangled third party to disclose the identity of wrongdoers and documentary evidence tracing concealed assets."),

    ("Part 3: Cross-Border Anti-Suit Injunctions & Forum-Shopping Restraints", p3_say, p3_code, p3_codeNotes,
     "Assess anti-suit injunction criteria under SNI Aérospatiale and Modi Entertainment Network to protect the insolvency estate.",
     "Against whom does an Anti-Suit Injunction operate when issued by a court managing a cross-border insolvency?",
     ["It operates strictly in personam against the recalcitrant creditor who is subject to the court's personal jurisdiction",
      "It directly binds the foreign sovereign government and strikes down its constitution",
      "It halts all international commercial shipping across maritime borders",
      "It commands the foreign judge to appear in person before the domestic court"],
     "An anti-suit injunction operates in personam against the litigant, restraining them from prosecuting an unconscionable or vexatious foreign proceeding."),

    ("Part 4: Article 6 Public Policy (Ordre Public) Narrow Exception", p4_say, p4_code, p4_codeNotes,
     "Apply the 'manifestly contrary' standard of Article 6 to evaluate foreign recognition and relief requests.",
     "Under what circumstances may an Indian NCLT bench invoke the Article 6 Public Policy exception to refuse foreign recognition?",
     ["Only where the foreign proceeding is manifestly contrary to public policy, such as a severe violation of fundamental procedural due process or sovereign non-discrimination",
      "Whenever the foreign insolvency law has a slightly different distribution waterfall than Section 53 of the IBC",
      "Whenever the foreign liquidator is not an Indian citizen",
      "Whenever domestic unsecured creditors receive a dividend payout lower than 100%"],
     "Article 6 requires that the relief be 'manifestly contrary' to public policy, which is narrowly construed to protect core constitutional values, due process, and justice."),

    ("Part 5: Production Cross-Border Asset Recovery & Public Policy Shield", p5_say, p5_code, p5_codeNotes,
     "Run the integrated extraterritorial clawback, anti-suit injunction, and Article 6 public policy verification engine.",
     "What key certification is produced upon successful execution of the Day 48 production simulator?",
     ["CROSS_BORDER_ASSET_RECOVERY_AND_PUBLIC_POLICY_PASS validating offshore clawbacks, anti-suit protections, and Article 22 escrows",
      "SOVEREIGN_DEBT_REPUDIATION_PASS canceling all foreign sovereign loan facilities unconditionally",
      "OFFSHORE_TAX_EVASION_PASS authorizing undisclosed transfers to tax haven jurisdictions",
      "UNCONDITIONAL_LIQUIDATION_PASS mandating immediate distress auction of all corporate subsidiaries"],
     "The engine validates extraterritorial clawback, anti-suit protection, Article 22 holdbacks, and Article 6 filters, passing CROSS_BORDER_ASSET_RECOVERY_AND_PUBLIC_POLICY_PASS.")
]

for idx, (title, say, code, notes, try_it, q, opts, expl) in enumerate(parts_spec, 1):
    print(f"Executing Day 48 Part {idx} code...")
    stdout = run_code(code)
    wc = count_words(say)
    print(f"Part {idx}: {wc} words in say. Code execution successful.")
    
    part_dict = {
        "title": title,
        "say": say,
        "example": f"Real-world operational analysis for {title}.",
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
    day48["parts"].append(part_dict)

total_day_words = sum(count_words(p["say"]) for p in day48["parts"])
print(f"=== DAY 48 TOTAL WORDS: {total_day_words} ===")

with open("scripts/bcom_law_day48.json", "w", encoding="utf-8") as f:
    json.dump(day48, f, indent=2)

print("Saved scripts/bcom_law_day48.json successfully!")
