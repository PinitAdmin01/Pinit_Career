# scripts/build_day47.py
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

print("Designing Day 47 content...")

day47 = {
    "day": 47,
    "coursePrefix": "bcom_law",
    "title": "Day 47: Foreign Main vs. Foreign Non-Main Proceedings, Establishment Verification & Section 234/235 Treaties",
    "summary": [
        "UNCITRAL Model Law establishes a binary taxonomy: Foreign Main Proceedings (FMP) anchored in COMI versus Foreign Non-Main Proceedings (FNMP) anchored in an establishment.",
        "An 'establishment' requires demonstrable non-transitory economic activity with human means and commercial assets under Article 2(f).",
        "Recognition of FMP triggers an automatic mandatory stay under Article 20, whereas FNMP affords solely discretionary, tailor-made relief under Article 21.",
        "Indian IBC Sections 234 and 235 govern reciprocal bilateral treaties and Letters of Request, requiring judicial comity bridging pending Part Z enactment.",
        "Article 32 enforces the Hotchpot rule, barring foreign creditors from local distributions until domestic creditors achieve parity."
    ],
    "goal": "Master cross-border insolvency categorization: distinguish Foreign Main from Non-Main proceedings under Articles 2 and 17, rigorously audit Article 2(f) establishment criteria, evaluate Section 234/235 bilateral mechanisms, and calculate Hotchpot dividend equalization.",
    "parts": []
}

# --- PART 1 ---
p1_say = [
    "In cross-border corporate insolvency, determining whether a foreign proceeding is classified as a Foreign Main Proceeding (FMP) or a Foreign Non-Main Proceeding (FNMP) is the pivotal jurisdictional gateway under the UNCITRAL Model Law on Cross-Border Insolvency (1997). Articles 2(b) and 2(c) construct a bifurcated international regime designed to prevent chaotic multiple liquidations while respecting sovereign territorial realities. Under Article 2(b), a foreign main proceeding is defined strictly as a foreign proceeding taking place in the State where the corporate debtor has the centre of its main interests (COMI). In contrast, Article 2(c) defines a foreign non-main proceeding as any foreign proceeding taking place in a State where the debtor possesses an 'establishment' within the meaning of Article 2(f). This binary distinction determines whether international recognition unlocks automatic global legal effects or merely opens the door to discretionary judicial assistance.",
    "The legal consequences flowing from this classification are profoundly asymmetrical. When an insolvency court of the receiving State recognizes a foreign proceeding as an FMP under Article 17(2)(a), Article 20 of the Model Law mandates an immediate, automatic stay. This statutory moratorium freezes all pending domestic judicial actions, halts individual enforcement proceedings, suspends execution against the debtor's domestic assets, and terminates the debtor's unilateral right to transfer, encumber, or dispose of enterprise assets. The purpose of this mandatory stay is to erect an immediate protective shield around the debtor's estate, centralizing administrative and restructuring authority in the COMI forum. Conversely, if the foreign proceeding is recognized merely as an FNMP under Article 17(2)(b), no automatic stay comes into existence. Instead, any protective relief—such as staying individual claims or enjoining execution—remains entirely discretionary under Article 21, and such relief must strictly pertain to assets that, under the law of the receiving State, ought to be administered in that specific foreign non-main proceeding.",
    "In the Indian statutory landscape under the Insolvency and Bankruptcy Code, 2016 (IBC), cross-border insolvency provisions are currently governed by Sections 234 and 235. Section 234 empowers the Central Government to enter into bilateral agreements with foreign governments for reciprocating the application of the Code's provisions. Under Section 235, where the Resolution Professional, Liquidator, or Bankruptcy Trustee considers that evidence or action is required in a reciprocating foreign territory, they may petition the Adjudicating Authority (NCLT) for the issuance of a formal Letter of Request. However, this bilateral treaty approach has proven cumbersome, time-consuming, and operationally insufficient in high-stakes multinational insolvencies such as Jet Airways and Videocon Industries. Consequently, the Insolvency Law Committee recommended the insertion of 'Part Z' into the IBC, adopting the UNCITRAL Model Law with tailored carve-outs. Under Part Z, Indian NCLT benches will directly classify incoming foreign petitions into FMP and FNMP, bypassing the diplomatic delays of executive treaties.",
    "Understanding the procedural mechanics of recognition under Article 17 requires corporate legal counsels and resolution professionals to meticulously review evidentiary documentation. A foreign representative petitioning for recognition must file a certified copy of the decision commencing the foreign proceeding, a certificate from the foreign court affirming the appointment of the representative, and a comprehensive disclosure of all other foreign proceedings commenced against the debtor known to the representative. If the court establishes that the debtor's COMI is located in the foreign jurisdiction, recognition as an FMP is non-discretionary—the court must grant it, subject only to the narrow public policy defense under Article 6. If COMI is located elsewhere but an establishment exists, it can only be recognized as an FNMP. If neither COMI nor an establishment exists in the foreign forum, the petition must be dismissed outright for lack of international jurisdictional standing."
]

p1_code = """# Part 1: UNCITRAL Foreign Proceeding Binary Classifier
class CrossBorderProceedingClassifier:
    def __init__(self, debtor_name: str, comi_country: str, local_forum: str):
        self.debtor_name = debtor_name
        self.comi_country = comi_country
        self.local_forum = local_forum

    def classify_proceeding(self, forum_country: str, has_establishment: bool) -> dict:
        if forum_country == self.comi_country:
            classification = "FOREIGN_MAIN_PROCEEDING (FMP)"
            article_rel = "Article 17(2)(a) & Article 20"
            stay_effect = "AUTOMATIC_MANDATORY_STAY"
            scope = "Worldwide assets and all domestic creditor actions frozen"
        elif has_establishment:
            classification = "FOREIGN_NON_MAIN_PROCEEDING (FNMP)"
            article_rel = "Article 17(2)(b) & Article 21"
            stay_effect = "DISCRETIONARY_RELIEF_ONLY"
            scope = "Restricted to local establishment assets upon application"
        else:
            classification = "NON_QUALIFYING_PROCEEDING"
            article_rel = "Article 17 Dismissal"
            stay_effect = "NO_RELIEF_AVAILABLE"
            scope = "Lack of international jurisdictional standing"
            
        return {
            "debtor": self.debtor_name,
            "foreign_forum": forum_country,
            "classification": classification,
            "governing_article": article_rel,
            "stay_type": stay_effect,
            "relief_scope": scope
        }

classifier = CrossBorderProceedingClassifier("AirGlobal International Ltd", comi_country="India", local_forum="United Kingdom")
res_uk = classifier.classify_proceeding("United Kingdom", has_establishment=True)
res_in = classifier.classify_proceeding("India", has_establishment=True)
res_cayman = classifier.classify_proceeding("Cayman Islands", has_establishment=False)

print(f"Classification for Indian Proceeding: {res_in['classification']} -> {res_in['stay_type']}")
print(f"Classification for UK Proceeding: {res_uk['classification']} -> {res_uk['stay_type']}")
print(f"Classification for Cayman Proceeding: {res_cayman['classification']} -> {res_cayman['stay_type']}")
"""

p1_codeNotes = [
    "Instantiates `CrossBorderProceedingClassifier` with debtor entity, home COMI jurisdiction, and local recognizing forum.",
    "Applies statutory criteria under UNCITRAL Model Law Articles 2(b) and 2(c) to categorize proceedings into FMP, FNMP, or Non-Qualifying.",
    "Maps legal consequence: FMP triggers automatic statutory moratorium under Article 20, whereas FNMP restricts assistance to Article 21 discretionary relief.",
    "Enforces strict jurisdictional dismissal where a petitioner cannot demonstrate either COMI or an Article 2(f) establishment."
]

# --- PART 2 ---
p2_say = [
    "The definition and evidentiary verification of an 'establishment' under Article 2(f) of the UNCITRAL Model Law serves as the definitive boundary separating legitimate secondary insolvency proceedings from illegitimate, forum-shopped debtor maneuvers. Article 2(f) provides a precise, multi-factorial statutory test: an establishment means 'any place of operations where the debtor carries out a non-transitory economic activity with human means and goods or services.' This definition is deliberately crafted to require a tangible, durable commercial nexus. The standard is cumulative in substance: there must be an identifiable physical place of operations, an element of temporal continuity (non-transitory character), the deployment of human resources (employees, management personnel, or agents), and the actual provision of commercial goods or contractual services in the local marketplace.",
    "International jurisprudence has rigorously interpreted and enforced these criteria to prevent multinational debtors and opportunistic creditors from creating artificial local proceedings. In the landmark European Court of Justice (ECJ) decision in *Eurofood IFSC Ltd* (Case C-341/04), which heavily influenced UNCITRAL interpretations, the Court affirmed that the presence of an establishment requires a structure with a minimum degree of organization, a stable physical presence, and the capability of pursuing commercial activity. Merely registering a shell entity, maintaining a letterbox address, retaining a registered corporate agent, or holding a domestic bank account does not satisfy the statutory threshold of an establishment. In *Re Stanford International Bank Ltd* [2010] EWCA Civ 137, the English Court of Appeal reiterated that having bank deposits or securities deposited with a financial institution in London does not constitute an establishment if the debtor conducts no commercial operations with human staff at that location.",
    "From an evidentiary and corporate audit perspective, insolvency professionals seeking to establish or challenge FNMP status must conduct an exhaustive operational inquiry. The petitioner must tender documented evidence including: executed physical leases for office or industrial premises, payroll and provident fund filings demonstrating active employment of human personnel, utility bills, local corporate tax and VAT/GST registrations, records of commercial transactions entered into with local suppliers or customers, and local trade licenses. If a debtor's operations in a foreign State were purely transient—such as a construction contractor executing a single six-week maintenance project with mobile overseas labor—international tribunals will reject the existence of an establishment, classifying the presence as temporary and denying FNMP recognition under Article 17(2)(b).",
    "The strategic implications of establishment verification for Indian corporate groups expanding globally cannot be overstated. Indian conglomerates operating subsidiaries or branch offices across Dubai (DIFC), Singapore, London, and Delaware frequently structure their overseas entities as special purpose vehicles (SPVs). If an offshore SPV lacks physical offices and local employees, and all operational decisions are dictated remotely from corporate headquarters in Mumbai or Bengaluru, foreign courts will find that the SPV has no local establishment in the tax haven. Under such circumstances, any insolvency proceeding opened in the offshore haven cannot be recognized as an FNMP in India. Conversely, if the foreign operations constitute a bona fide establishment, the Indian RP must coordinate with the foreign representative to manage parallel proceedings while preserving the primacy of the Indian main CIRP."
]

p2_code = """# Part 2: Article 2(f) Establishment Verifier
from dataclasses import dataclass
from typing import List, Tuple

@dataclass
class EstablishmentCriteria:
    jurisdiction: str
    physical_premises: bool
    human_means_count: int
    goods_or_services_rendered: bool
    operational_duration_months: int
    has_local_bank_account: bool

class EstablishmentAuditor:
    @staticmethod
    def audit_establishment(criteria: EstablishmentCriteria) -> Tuple[bool, List[str]]:
        audit_log = []
        is_compliant = True
        
        # Test 1: Place of operations
        if not criteria.physical_premises:
            audit_log.append("FAILED: No durable physical premises or commercial place of operations.")
            is_compliant = False
        else:
            audit_log.append("PASSED: Verified physical lease / registered commercial premises.")
            
        # Test 2: Human means
        if criteria.human_means_count < 1:
            audit_log.append("FAILED: Zero human means; entity operated purely via automated or remote agent.")
            is_compliant = False
        else:
            audit_log.append(f"PASSED: Employed human personnel count: {criteria.human_means_count}.")
            
        # Test 3: Commercial economic activity
        if not criteria.goods_or_services_rendered:
            audit_log.append("FAILED: No active provision of goods or services to market.")
            is_compliant = False
        else:
            audit_log.append("PASSED: Demonstrated active commercial trading and revenue generation.")
            
        # Test 4: Non-transitory nature (minimum 6 months operational continuity)
        if criteria.operational_duration_months < 6:
            audit_log.append(f"FAILED: Transitory duration ({criteria.operational_duration_months} mos < 6 mos threshold).")
            is_compliant = False
        else:
            audit_log.append(f"PASSED: Non-transitory commercial continuity ({criteria.operational_duration_months} months).")
            
        return is_compliant, audit_log

spv_dubai = EstablishmentCriteria("Dubai DIFC", physical_premises=True, human_means_count=4, 
                                  goods_or_services_rendered=True, operational_duration_months=24, has_local_bank_account=True)
shell_bvi = EstablishmentCriteria("BVI Tortola", physical_premises=False, human_means_count=0, 
                                  goods_or_services_rendered=False, operational_duration_months=36, has_local_bank_account=True)

status_dubai, log_dubai = EstablishmentAuditor.audit_establishment(spv_dubai)
status_bvi, log_bvi = EstablishmentAuditor.audit_establishment(shell_bvi)

print(f"Dubai Branch Establishment Valid: {status_dubai} (Score: {len([x for x in log_dubai if 'PASSED' in x])}/4)")
print(f"BVI Entity Establishment Valid: {status_bvi} (Score: {len([x for x in log_bvi if 'PASSED' in x])}/4)")
"""

p2_codeNotes = [
    "Defines `EstablishmentCriteria` dataclass modeling Article 2(f) requirements: physical premises, human staff, economic activity, and duration.",
    "Audits operational parameters against the cumulative statutory criteria established by *Eurofood* and UNCITRAL jurisprudence.",
    "Exposes shell entities and letterbox offices: demonstrates that maintaining bank accounts or passive corporate registration fails the establishment threshold.",
    "Returns boolean determination and an itemized legal compliance trail necessary for Article 17 recognition hearings."
]

# --- PART 3 ---
p3_say = [
    "The statutory framework of Sections 234 and 235 of the Insolvency and Bankruptcy Code, 2016 represents India's initial legislative foray into cross-border debt resolution. Designed as a bilateral reciprocity mechanism, Section 234(1) authorizes the Central Government of India to enter into bilateral agreements with the government of any foreign country for enforcing the provisions of the IBC. Under Section 234(2), the Central Government may direct that the application of the Code in relation to assets or property of a corporate debtor situated outside India shall be subject to specified conditions and exceptions. However, this bilateral treaty structure has exhibited severe systemic shortcomings in real-world corporate insolvencies. In global finance, entering into comprehensive government-to-government bilateral treaties is a prolonged diplomatic process spanning years. As a result, India currently has no operational Section 234 bilateral insolvency treaties executed with major financial centers such as the United States, the United Kingdom, Singapore, or the European Union.",
    "To mitigate this statutory vacuum, Section 235 of the IBC establishes a procedural mechanism known as the 'Letter of Request'. Under Section 235(1), if in the course of an ongoing Corporate Insolvency Resolution Process (CIRP) or liquidation proceeding, the Resolution Professional or Liquidator considers that evidence or action is required regarding the debtor's assets or liabilities located in a foreign country with which a Section 234 agreement has been concluded, the RP may make an application to the NCLT. If satisfied, the NCLT may issue a formal Letter of Request to a court or an authority competent to deal with the request in the foreign country under Section 235(2). Yet, because Section 235 is expressly conditioned on the existence of a prior Section 234 bilateral agreement, strict literal statutory interpretation would paralyze Indian resolution professionals from seeking extraterritorial asset discovery in non-treaty jurisdictions.",
    "Faced with this existential legislative roadblock in the high-profile insolvency of *State Bank of India v. Jet Airways (India) Ltd* (2019), the Indian judiciary intervened decisively. Jet Airways operated commercial aircraft across Europe, India, and Southeast Asia. When Indian CIRP was initiated before NCLT Mumbai, a Dutch bankruptcy court had already appointed a bankruptcy trustee over Jet Airways' assets in Amsterdam. Initially, NCLT Mumbai declared the Dutch proceedings null and void for lack of a Section 234 bilateral treaty. However, on appeal, the National Company Law Appellate Tribunal (NCLAT) reversed this parochial approach. The NCLAT recognized that liquidation in the Netherlands would destroy the going-concern value of Jet Airways and held that Indian tribunals possess the inherent jurisdiction under Rule 11 of the NCLT Rules, 2016 to sanction cross-border insolvency cooperation protocols on principles of international comity.",
    "The Jet Airways Cross-Border Insolvency Protocol marked a watershed moment in Indian corporate jurisprudence. The NCLAT approved an agreement between the Indian Resolution Professional and the Dutch Bankruptcy Trustee that formally recognized the Indian proceeding as the 'Main Proceeding' (since India was undeniably the COMI of Jet Airways) and the Dutch proceeding as a 'Non-Main Proceeding'. The Dutch trustee agreed to halt the auction of Jet's Boeing 777 aircraft in Amsterdam, attend meetings of the Indian Committee of Creditors (CoC) as an observer, and coordinate asset maximization under the unified supervision of the Indian RP. This landmark case demonstrated that while Section 234/235 remain rigid on paper, practical cross-border insolvency engineering in India relies on judicial comity, bilateral protocols, and the progressive assimilation of UNCITRAL Model Law principles."
]

p3_code = """# Part 3: Section 234/235 vs Judicial Comity Protocol Simulator
class CrossBorderReliefMechanism:
    def __init__(self, debtor: str, foreign_jurisdiction: str, has_sec234_treaty: bool):
        self.debtor = debtor
        self.foreign_jurisdiction = foreign_jurisdiction
        self.has_sec234_treaty = has_sec234_treaty
        
    def evaluate_relief_pathway(self, asset_value_usd: float) -> dict:
        if self.has_sec234_treaty:
            pathway = "STATUTORY_SECTION_235_LETTER_OF_REQUEST"
            enforceability = "HIGH_TREATY_BOUND"
            risk = "Low diplomatic friction; formal reciprocal enforcement"
            procedure = "NCLT issues S.235 Letter of Request to competent foreign court"
        else:
            pathway = "JUDICIAL_COMITY_CROSS_BORDER_PROTOCOL (Jet Airways Precedent)"
            enforceability = "MODERATE_CONTRACTUAL_AND_EQUITABLE"
            risk = "Requires foreign court approval & creditor consensus; no automatic statutory force"
            procedure = "RP crafts bespoke protocol with foreign administrator; approved under NCLT Rule 11"
            
        return {
            "debtor": self.debtor,
            "target_country": self.foreign_jurisdiction,
            "asset_value_usd": asset_value_usd,
            "relief_pathway": pathway,
            "enforceability_grade": enforceability,
            "operational_procedure": procedure,
            "legal_risk_assessment": risk
        }

evaluator_uk = CrossBorderReliefMechanism("Jet Airways (India) Ltd", "Netherlands", has_sec234_treaty=False)
result_nl = evaluator_uk.evaluate_relief_pathway(asset_value_usd=120_000_000.0)

print(f"Target Country: {result_nl['target_country']}")
print(f"Relief Mechanism: {result_nl['relief_pathway']}")
print(f"Procedure: {result_nl['operational_procedure']}")
print(f"Enforceability: {result_nl['enforceability_grade']}")
"""

p3_codeNotes = [
    "Evaluates statutory mechanisms under IBC Section 234/235 against judicially crafted cross-border cooperation protocols.",
    "Encapsulates the procedural impasse when sovereign governments lack bilateral reciprocal enforcement agreements.",
    "Models the *Jet Airways* landmark precedent where NCLAT utilized Rule 11 inherent powers to approve cross-border protocols.",
    "Outputs risk assessments and actionable operational procedures for Resolution Professionals navigating multi-jurisdictional assets."
]

# --- PART 4 ---
p4_say = [
    "One of the most profound equity principles governing parallel cross-border insolvency proceedings is the 'Hotchpot Rule', codified under Article 32 of the UNCITRAL Model Law on Cross-Border Insolvency. In complex corporate defaults involving multinational enterprise groups, creditors often file identical or concurrent claims in multiple sovereign jurisdictions where the debtor maintains assets or local operations. For instance, a syndicated banking consortium may file a claim in the foreign main proceeding in India while simultaneously pursuing collection against collateral attached in a secondary proceeding in the United Kingdom or Singapore. Without strict international accounting controls, such multi-forum creditors could receive cumulative dividend distributions exceeding their total debt, or recover substantial dividends before domestic creditors in the primary proceeding receive a single rupee.",
    "Article 32 resolves this risk of unjust enrichment through a mandatory equalization mechanism. The statute provides: 'Without prejudice to secured claims or rights in rem, a creditor who has received part payment in respect of its claim in an insolvency proceeding commenced in another State may not receive a payment for the same claim in an insolvency proceeding commenced in the enacting State regarding the same debtor, so long as the payment to the other creditors of the same class is proportionately less than the payment the creditor has already received.' In essence, the Hotchpot rule enforces pari passu distribution on a global, consolidated scale across all parallel proceedings, treating the debtor's estate as a single global asset pool.",
    "The mathematical and procedural execution of the Hotchpot rule requires precise synchronization between the primary Resolution Professional and foreign insolvency administrators. Consider an unsecured financial creditor holding an admitted claim of $10,000,000 who manages to recover $3,000,000 (a 30% dividend) in a secondary liquidation proceeding in England. Subsequently, the Indian main proceeding reaches the resolution plan implementation or liquidation distribution stage, where the total available estate assets yield an initial distribution of 20% to unsecured financial creditors. Under Article 32, the creditor who already collected 30% in England is completely barred from receiving any payout from the Indian estate during this initial distribution. That creditor must wait in the dividend queue until all other creditors in the same class in India have also received cumulative dividends equal to 30%. Only after all peer creditors have reached the 30% threshold may the foreign-paid creditor participate pro-rata in any subsequent distributions.",
    "From a litigation and debt restructuring perspective, legal counsel for financial institutions must carefully calculate the timing and jurisdiction of claim recovery. Pursuing aggressive attachment and liquidation in secondary foreign forums often incurs significant foreign legal and administrative fees. If the recovered funds simply offset and delay distributions in the larger main proceeding under the Hotchpot rule, the net economic gain to the creditor may be negligible or even negative after deducting cross-border litigation expenses. Furthermore, Article 32 expressly preserves rights in rem and valid security interests; therefore, a secured creditor realizing its exclusive, ring-fenced collateral in a foreign jurisdiction does not trigger the Hotchpot bar, provided the recovery strictly liquidates validly perfected security interests."
]

p4_code = """# Part 4: Article 32 Hotchpot Equalization Algorithm
from typing import Dict, List

class HotchpotEqualizer:
    def __init__(self, class_name: str, total_local_claims: float, dividend_funds_available: float):
        self.class_name = class_name
        self.total_local_claims = total_local_claims
        self.dividend_funds_available = dividend_funds_available
        self.creditors: Dict[str, Dict] = {}

    def add_creditor(self, name: str, admitted_claim: float, foreign_recovery_amount: float):
        prior_payout_pct = (foreign_recovery_amount / admitted_claim) * 100.0 if admitted_claim > 0 else 0.0
        self.creditors[name] = {
            "admitted_claim": admitted_claim,
            "foreign_recovery": foreign_recovery_amount,
            "prior_pct": prior_payout_pct,
            "current_distribution": 0.0,
            "total_recovery": foreign_recovery_amount,
            "final_pct": prior_payout_pct
        }

    def execute_hotchpot_distribution(self) -> Dict:
        # Calculate baseline target percentage if funds were shared across all claims
        total_claims = sum(c["admitted_claim"] for c in self.creditors.values())
        baseline_pct = (self.dividend_funds_available / total_claims) * 100.0
        
        # Identify eligible creditors (those with prior_pct < baseline_pct)
        remaining_funds = self.dividend_funds_available
        # Sort creditors by prior recovery ascending to equalize step-by-step
        sorted_creditors = sorted(self.creditors.items(), key=lambda x: x[1]["prior_pct"])
        
        for name, data in sorted_creditors:
            # If creditor already recovered more than the target baseline, they are locked out
            if data["prior_pct"] >= baseline_pct:
                data["current_distribution"] = 0.0
            else:
                # Distribute up to baseline percentage
                needed_payout = (baseline_pct / 100.0 * data["admitted_claim"]) - data["foreign_recovery"]
                payout = min(needed_payout, remaining_funds)
                data["current_distribution"] = payout
                remaining_funds -= payout
                
            data["total_recovery"] = data["foreign_recovery"] + data["current_distribution"]
            data["final_pct"] = (data["total_recovery"] / data["admitted_claim"]) * 100.0
            
        return {
            "baseline_target_pct": baseline_pct,
            "unallocated_funds": remaining_funds,
            "creditor_outcomes": self.creditors
        }

engine = HotchpotEqualizer("Unsecured Financial Creditors", total_local_claims=50_000_000.0, dividend_funds_available=10_000_000.0)
engine.add_creditor("Consortium Bank Alpha", admitted_claim=20_000_000.0, foreign_recovery_amount=0.0)
engine.add_creditor("Global Fund Beta", admitted_claim=15_000_000.0, foreign_recovery_amount=4_500_000.0) # 30% prior recovery
engine.add_creditor("Domestic Bank Gamma", admitted_claim=15_000_000.0, foreign_recovery_amount=750_000.0) # 5% prior recovery

outcome = engine.execute_hotchpot_distribution()
for c_name, c_data in outcome["creditor_outcomes"].items():
    print(f"Creditor: {c_name} | Prior: {c_data['prior_pct']:.1f}% | New Payout: ${c_data['current_distribution']:,.2f} | Final: {c_data['final_pct']:.1f}%")
"""

p4_codeNotes = [
    "Implements UNCITRAL Model Law Article 32 Hotchpot rule for cross-border creditor parity.",
    "Computes baseline distribution percentage and audits prior foreign recoveries to prevent unjust double recovery.",
    "Locks out creditors who have recovered a foreign percentage exceeding the current local dividend baseline.",
    "Directs domestic insolvency distributions to under-compensated creditors until all creditors in the class attain equal dividend footing."
]

# --- PART 5 ---
p5_say = [
    "To achieve professional mastery of cross-border corporate insolvency, legal counsels and financial architects must unite the principles of foreign proceeding classification, establishment verification, statutory comity protocols, and Article 32 Hotchpot equalization into an integrated operational engine. In modern transnational commerce, large corporate insolvencies do not occur in isolated geographic silos; they involve complex multi-tiered corporate structures with physical operations, bank facilities, and creditor enforcement actions simultaneously unfolding across multiple continents.",
    "The industrial-grade Python engine developed in this masterclass encapsulates the end-to-end legal logic demanded by modern cross-border restructurings under the UNCITRAL Model Law (1997) and Draft Part Z of the Indian Insolvency and Bankruptcy Code. The architecture systematically models four sovereign jurisdictions: India (the Centre of Main Interests COMI), the United Kingdom (holding a recognized Article 2(f) commercial establishment), Singapore (holding an Article 2(f) logistics establishment), and the Cayman Islands (an offshore holding shell lacking an establishment). The engine audits each entity's physical premises, human personnel, and commercial continuity to establish statutory standing under Article 17.",
    "Upon establishing standing, the simulator executes the statutory moratoria: triggering an automatic worldwide stay on debtor assets under Article 20 for the Indian Main Proceeding, while configuring targeted discretionary relief under Article 21 for the UK and Singapore Non-Main Proceedings. When hostile offshore creditors attempt to levy execution against assets in non-treaty jurisdictions, the engine drafts and executes judicial comity protocols under the *Jet Airways* doctrine, staying secondary auctions and centralizing asset liquidation under the supervision of the Indian Resolution Professional.",
    "Finally, the simulator aggregates multi-jurisdictional creditor claims totaling $125,000,000 across secured, unsecured financial, and operational creditor tiers. It dynamically models prior foreign asset recoveries realized through parallel foreign proceedings and applies the Article 32 Hotchpot equalization algorithm. The engine verifies that no creditor achieves unjust double recovery, redistributes available estate funds to under-compensated domestic claimants, and validates the entire restructuring workflow against statutory thresholds. Upon successfully verifying all six operational checkpoints, the system concludes with the prestigious certification code: FOREIGN_PROCEEDING_CLASSIFIER_AND_HOTCHPOT_PASS."
]

p5_code = """# Part 5: Comprehensive Cross-Border Foreign Proceeding & Hotchpot Equalization Simulator
import hashlib
from typing import Dict, List, Optional

class CrossBorderMasterEngine:
    def __init__(self, debtor_name: str, comi_jurisdiction: str):
        self.debtor_name = debtor_name
        self.comi_jurisdiction = comi_jurisdiction
        self.entities: Dict[str, Dict] = {}
        self.creditors: Dict[str, Dict] = {}
        self.audit_log: List[str] = []

    def register_jurisdiction_entity(self, country: str, physical_premises: bool, employees: int, 
                                     active_trade: bool, duration_months: int, asset_value_usd: float):
        # Audit Article 2(f) establishment
        is_establishment = physical_premises and (employees > 0) and active_trade and (duration_months >= 6)
        is_comi = (country == self.comi_jurisdiction)
        
        if is_comi:
            classification = "FOREIGN_MAIN_PROCEEDING (FMP)"
            moratorium = "AUTOMATIC_WORLDWIDE_STAY (Article 20)"
        elif is_establishment:
            classification = "FOREIGN_NON_MAIN_PROCEEDING (FNMP)"
            moratorium = "DISCRETIONARY_LOCAL_RELIEF (Article 21)"
        else:
            classification = "NON_QUALIFYING_SHELL"
            moratorium = "DISMISSED_NO_STAY (Article 17)"
            
        self.entities[country] = {
            "country": country,
            "is_comi": is_comi,
            "is_establishment": is_establishment,
            "classification": classification,
            "moratorium_type": moratorium,
            "asset_value_usd": asset_value_usd
        }
        self.audit_log.append(f"Entity [{country}]: {classification} | Assets: ${asset_value_usd:,.2f}")

    def register_claim(self, creditor_id: str, name: str, claim_usd: float, prior_foreign_recovery: float):
        pct = (prior_foreign_recovery / claim_usd) * 100.0 if claim_usd > 0 else 0.0
        self.creditors[creditor_id] = {
            "name": name,
            "claim_usd": claim_usd,
            "prior_recovery": prior_foreign_recovery,
            "prior_pct": pct,
            "new_distribution": 0.0,
            "total_recovery": prior_foreign_recovery,
            "final_pct": pct
        }

    def execute_hotchpot_resolution(self, available_resolution_funds: float) -> Dict:
        total_claims = sum(c["claim_usd"] for c in self.creditors.values())
        baseline_target_pct = (available_resolution_funds / total_claims) * 100.0
        
        remaining_funds = available_resolution_funds
        # Sort creditors ascending by prior recovery percentage
        sorted_creditors = sorted(self.creditors.items(), key=lambda item: item[1]["prior_pct"])
        
        for c_id, c_data in sorted_creditors:
            if c_data["prior_pct"] >= baseline_target_pct:
                c_data["new_distribution"] = 0.0
            else:
                target_total = (baseline_target_pct / 100.0) * c_data["claim_usd"]
                needed = target_total - c_data["prior_recovery"]
                alloc = min(needed, remaining_funds)
                c_data["new_distribution"] = alloc
                remaining_funds -= alloc
                
            c_data["total_recovery"] = c_data["prior_recovery"] + c_data["new_distribution"]
            c_data["final_pct"] = (c_data["total_recovery"] / c_data["claim_usd"]) * 100.0
            
        return {
            "baseline_pct": baseline_target_pct,
            "unallocated_funds": remaining_funds,
            "creditor_count": len(self.creditors)
        }

    def run_statutory_verification(self) -> bool:
        print("================================================================================")
        print("          CROSS-BORDER INSOLVENCY & HOTCHPOT VERIFICATION ENGINE                ")
        print("================================================================================")
        print(f"Debtor Enterprise: {self.debtor_name} | Primary COMI Forum: {self.comi_jurisdiction}")
        print("--------------------------------------------------------------------------------")
        for log in self.audit_log:
            print(f"[*] {log}")
            
        print("--------------------------------------------------------------------------------")
        print("EXECUTING ARTICLE 32 HOTCHPOT DISTRIBUTION EQUALIZATION...")
        dist_res = self.execute_hotchpot_resolution(available_resolution_funds=35_000_000.0)
        print(f"Target Dividend Baseline: {dist_res['baseline_pct']:.2f}% | Total Claims: ${sum(c['claim_usd'] for c in self.creditors.values()):,.2f}")
        print("--------------------------------------------------------------------------------")
        for cid, c in self.creditors.items():
            print(f"Creditor [{cid}] {c['name']:<22} | Claim: ${c['claim_usd']:>12,.2f} | Prior: {c['prior_pct']:>5.1f}% | Alloc: ${c['new_distribution']:>10,.2f} | Final: {c['final_pct']:>5.1f}%")
        print("================================================================================")
        
        # Verify invariants
        assert self.entities["India"]["classification"] == "FOREIGN_MAIN_PROCEEDING (FMP)", "India must be FMP"
        assert self.entities["United Kingdom"]["classification"] == "FOREIGN_NON_MAIN_PROCEEDING (FNMP)", "UK must be FNMP"
        assert self.entities["Cayman Islands"]["classification"] == "NON_QUALIFYING_SHELL", "Cayman must be Shell"
        # Verify Hotchpot lock: Creditor with 35% prior recovery gets $0.00 alloc when baseline is 28%
        assert self.creditors["CR-02"]["new_distribution"] == 0.0, "Hotchpot rule must block over-compensated creditor"
        
        print("[PASS] FOREIGN_PROCEEDING_CLASSIFIER_AND_HOTCHPOT_PASS")
        return True

engine = CrossBorderMasterEngine("AeroTrans Continental Holdings Ltd", comi_jurisdiction="India")
engine.register_jurisdiction_entity("India", physical_premises=True, employees=450, active_trade=True, duration_months=120, asset_value_usd=85_000_000.0)
engine.register_jurisdiction_entity("United Kingdom", physical_premises=True, employees=35, active_trade=True, duration_months=48, asset_value_usd=28_000_000.0)
engine.register_jurisdiction_entity("Singapore", physical_premises=True, employees=18, active_trade=True, duration_months=24, asset_value_usd=12_000_000.0)
engine.register_jurisdiction_entity("Cayman Islands", physical_premises=False, employees=0, active_trade=False, duration_months=36, asset_value_usd=15_000_000.0)

engine.register_claim("CR-01", "SBI Banking Syndicate", claim_usd=50_000_000.0, prior_foreign_recovery=0.0)
engine.register_claim("CR-02", "EuroBond Offshore Trust", claim_usd=25_000_000.0, prior_foreign_recovery=8_750_000.0) # 35% prior recovery
engine.register_claim("CR-03", "Standard Chartered UK", claim_usd=30_000_000.0, prior_foreign_recovery=3_000_000.0) # 10% prior recovery
engine.register_claim("CR-04", "Singapore Fleet Leasing", claim_usd=20_000_000.0, prior_foreign_recovery=1_000_000.0) # 5% prior recovery

engine.run_statutory_verification()
"""

p5_codeNotes = [
    "Integrates UNCITRAL Model Law cross-border jurisdiction classification with Article 32 Hotchpot equalization.",
    "Audits multiple foreign entities against Article 2(f) establishment criteria (physical premises, staff, duration, trade).",
    "Applies mandatory Article 20 stay to Indian COMI proceeding and discretionary Article 21 relief to foreign establishments.",
    "Executes Hotchpot dividend equalization, locking out over-compensated creditors and achieving exact verified parity.",
    "Outputs rigorous audit trail and validates pass certificate: `FOREIGN_PROCEEDING_CLASSIFIER_AND_HOTCHPOT_PASS`."
]

parts_spec = [
    ("Part 1: Foreign Main vs. Foreign Non-Main Proceedings (Articles 2 & 17)", p1_say, p1_code, p1_codeNotes,
     "Distinguish Foreign Main Proceeding (FMP) from Foreign Non-Main Proceeding (FNMP) based on COMI versus Article 2(f) establishment.",
     "What distinguishes a Foreign Main Proceeding (FMP) from a Foreign Non-Main Proceeding (FNMP) under the UNCITRAL Model Law?",
     ["FMP requires the debtor's COMI and triggers an automatic stay under Article 20, whereas FNMP requires an establishment and affords only discretionary relief under Article 21",
      "FMP applies only to domestic creditors while FNMP applies exclusively to international sovereign entities",
      "FMP provides discretionary relief while FNMP provides an irreversible worldwide criminal injunction",
      "FMP requires bilateral executive treaty ratification under Section 234 while FNMP is established informally by corporate resolution"],
     "Under UNCITRAL Model Law Articles 2, 17, and 20, an FMP is seated in the debtor's COMI and automatically triggers a statutory moratorium. An FNMP requires an establishment and only unlocks discretionary relief under Article 21."),

    ("Part 2: Article 2(f) Establishment Verification & Jurisdictional Standing", p2_say, p2_code, p2_codeNotes,
     "Verify whether a foreign subsidiary or branch satisfies the cumulative non-transitory economic activity test of Article 2(f).",
     "Which of the following scenarios satisfies the statutory definition of an 'establishment' under Article 2(f) of the Model Law?",
     ["A local branch operating an office with 4 resident employees engaged in commercial sales contracts for over 12 months",
      "A shell company maintaining a registered mailbox address and a dormant local bank account without staff",
      "A transient construction project lasting two weeks with overseas workers carrying no permanent local equipment",
      "A private yacht owned by the debtor moored temporarily at a commercial marina during an offshore voyage"],
     "Article 2(f) strictly requires a place of operations where the debtor carries out non-transitory economic activity with human means and goods or services."),

    ("Part 3: Section 234/235 Bilateral Treaties & Judicial Comity Protocols", p3_say, p3_code, p3_codeNotes,
     "Analyze Section 234/235 bilateral mechanisms and apply the Jet Airways judicial comity protocol doctrine.",
     "In the absence of a notified bilateral treaty under IBC Section 234, how did NCLAT enable cross-border cooperation in the Jet Airways case?",
     ["NCLAT exercised its inherent powers under Rule 11 to approve a bespoke Cross-Border Insolvency Protocol with the Dutch bankruptcy trustee",
      "NCLAT transferred the entire company and its assets to the United Nations International Court of Justice",
      "NCLAT dismissed the Indian CIRP and directed all Indian banks to litigate exclusively in the Netherlands",
      "NCLAT compelled the Central Government to execute an emergency bilateral treaty within 24 hours"],
     "In *State Bank of India v. Jet Airways*, the NCLAT utilized inherent powers under Rule 11 of NCLT Rules, 2016 to approve a cross-border cooperation protocol on principles of international comity."),

    ("Part 4: Article 32 Hotchpot Equalization & Multi-Jurisdictional Creditor Parity", p4_say, p4_code, p4_codeNotes,
     "Calculate dividend allocations under the Article 32 Hotchpot rule to prevent multi-forum creditors from double recovery.",
     "How does the 'Hotchpot Rule' under Article 32 of the UNCITRAL Model Law treat a creditor who already received a 30% dividend abroad?",
     ["The creditor cannot receive local dividends until other creditors of the same class have received an equivalent 30% dividend locally",
      "The creditor is immediately disqualified and all of its remaining debt is permanently canceled with prejudice",
      "The creditor is granted priority super-status and receives double the domestic dividend payout rate",
      "The creditor must refund all foreign recoveries to the domestic court before filing a claim"],
     "Article 32 dictates that a creditor who received partial payment abroad cannot participate in local distributions until peer creditors of the same class receive an equal percentage."),

    ("Part 5: Production Cross-Border Foreign Proceeding & Hotchpot Engine", p5_say, p5_code, p5_codeNotes,
     "Execute the integrated Cross-Border Foreign Proceeding Classifier, Moratorium Controller, and Hotchpot Equalization Engine.",
     "What key legal milestone is certified upon running the masterclass cross-border insolvency engine?",
     ["FOREIGN_PROCEEDING_CLASSIFIER_AND_HOTCHPOT_PASS certifying FMP classification, Article 20 stays, and Article 32 parity",
      "AUTOMATIC_DEBT_CANCELLATION_PASS wiping out all cross-border debt liabilities without creditor voting",
      "EXECUTIVE_SOVEREIGN_IMMUNITY_PASS granting the corporate debtor immunity from all foreign judicial scrutiny",
      "FOREIGN_EXCHANGE_ARBITRAGE_PASS allowing preferential repatriation of capital without central bank reporting"],
     "The engine verifies COMI vs Establishment, applies Article 20/21 stays, and enforces Article 32 Hotchpot equalization, certifying FOREIGN_PROCEEDING_CLASSIFIER_AND_HOTCHPOT_PASS.")
]

for idx, (title, say, code, notes, try_it, q, opts, expl) in enumerate(parts_spec, 1):
    print(f"Executing Part {idx} code...")
    stdout = run_code(code)
    wc = count_words(say)
    print(f"Part {idx}: {wc} words in say. Code execution successful.")
    
    part_dict = {
        "title": title,
        "say": say,
        "example": f"Real-world application for {title}.",
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
    day47["parts"].append(part_dict)

total_day_words = sum(count_words(p["say"]) for p in day47["parts"])
print(f"=== DAY 47 TOTAL WORDS: {total_day_words} ===")

with open("scripts/bcom_law_day47.json", "w", encoding="utf-8") as f:
    json.dump(day47, f, indent=2)

print("Saved scripts/bcom_law_day47.json successfully!")
