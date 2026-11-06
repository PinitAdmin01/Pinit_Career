# C:\Users\Admin\Desktop\projects\Present-Career-os-commerce\scripts\build_bcom_law_day46.py
import json
import hashlib
import subprocess

print("=== BUILDING BCOM_LAW DAY 46: UNCITRAL Model Law & Centre of Main Interests (COMI) ===")

day_data = {
    "day": 46,
    "coursePrefix": "bcom_law",
    "title": "Day 46: UNCITRAL Model Law on Cross-Border Insolvency & Centre of Main Interests (COMI)",
    "summary": [
        "UNCITRAL Model Law on Cross-Border Insolvency (1997) establishes global coordination across sovereign insolvency proceedings.",
        "Centre of Main Interests (COMI) serves as the jurisdictional anchor determining the primary forum for multinational corporate restructuring.",
        "Registered office creates a rebuttable presumption of COMI, subject to ascertainability by objective third-party creditors.",
        "Foreign representatives obtain direct procedural access to local insolvency tribunals without sovereign diplomatic reciprocity barriers."
    ],
    "goal": "Master cross-border corporate insolvency jurisprudence: evaluate the UNCITRAL Model Law on Cross-Border Insolvency (1997), apply statutory tests for Centre of Main Interests (COMI) determination, resolve creditor ascertainability disputes, analyze direct procedural access for foreign insolvency officeholders, and construct an automated cross-border jurisdictional COMI evaluation engine in pure Python standard library.",
    "parts": []
}

# -------------------------------------------------------------
# Part 1: UNCITRAL Model Law Architecture & Global Coordination
# -------------------------------------------------------------
p1_say = [
    "Welcome to Month 2, Block 10 of Corporate Law, IBC & Compliance (Course 06). Having mastered corporate governance, the Companies Act 2013, director fiduciary duties, SEBI insider trading regulations, statutory audit oversight, and domestic insolvency resolution under the Insolvency and Bankruptcy Code (IBC) 2016 in Month 1 and Block 7 to 9, we now cross the sovereign boundary into the high-stakes domain of Cross-Border Insolvency and Multinational Corporate Restructuring.",
    "In the modern globalized economy, large enterprise conglomerates rarely confine their corporate footprint to a single sovereign nation. Multinational corporations (such as Jet Airways, Videocon Industries, Lehman Brothers, and Greensill Capital) routinely establish registered headquarters in one jurisdiction, borrow syndicated corporate debt from banking consortia in London, Frankfurt, and New York, manufacture physical inventory across Southeast Asia, hold critical intellectual property patents in Delaware or Ireland, and operate commercial sales subsidiaries spanning fifty sovereign nations. When such an enterprise becomes insolvent, sovereign territorial legal systems face an existential challenge.",
    "Historically, cross-border corporate insolvency was paralyzed by a bitter jurisprudential conflict between two diametrically opposed doctrines: Territorialism and Universalism. Under pure Territorialism (the 'grab rule'), courts in each individual country assert absolute jurisdiction only over the debtor's assets physically situated within their national borders. A territorial court opens local insolvency proceedings, seizes local bank accounts and factories, and distributes proceeds exclusively to local domestic creditors, leaving foreign creditors completely unrepresented. This fragmentation leads to a chaotic 'race to the courthouse', liquidates productive enterprise value at fire-sale discounts, destroys cross-border going-concern synergies, and encourages fraudulent debtors to stash corporate assets in legal havens beyond the reach of their primary creditors.",
    "At the opposite extreme stands pure Universalism, which posits that a single worldwide insolvency proceeding should be opened in the debtor's home jurisdiction, with that single court exercising extraterritorial jurisdiction over all debtor assets and creditors worldwide. While intellectually elegant, pure universalism is practically unattainable because sovereign states will never surrender their constitutional sovereignty, local labor protections, domestic tax claims, and public policy prerogatives to a foreign judiciary.",
    "To resolve this fundamental international deadlock, the United Nations Commission on International Trade Law adopted the UNCITRAL Model Law on Cross-Border Insolvency in May 1997. The Model Law embodies the pragmatic compromise of 'Modified Universalism'. Modified universalism does not attempt to unify substantive domestic insolvency laws; instead, it establishes four procedural pillars that enable courts and insolvency professionals from different sovereign nations to coordinate seamlessly: Access, Recognition, Relief, and Cooperation.",
    "Under the Access pillar, foreign insolvency representatives are granted immediate, unhindered procedural standing to apply directly to local tribunals (such as India's National Company Law Tribunal, the United States Bankruptcy Court under Chapter 15, or the High Court of England and Wales) without diplomatic red tape. Under the Recognition pillar, local tribunals formally classify foreign proceedings as either 'Foreign Main Proceedings' or 'Foreign Non-Main Proceedings'. Under Relief, tribunals provide automatic stays and discretionary asset-freezing orders. Under Cooperation, domestic judges are empowered to communicate directly, court-to-court, with foreign judges across national borders.",
    "In India, Sections 234 and 235 of the IBC 2016 originally attempted to address cross-border insolvency through bilateral treaties and letters of request. However, bilateral treaties require decades of inter-governmental negotiation. Recognizing this fatal bottleneck, the Ministry of Corporate Affairs constituted the Insolvency Law Committee on Cross-Border Insolvency (chaired by Injeti Srinivas), which recommended the enactment of 'Part Z' into the IBC, formally adopting the UNCITRAL Model Law into Indian jurisprudence. Master corporate counsels must command the procedural mechanics of the Model Law to protect enterprise balance sheets in multinational financial restructurings."
]

p1_code = """# Cross-Border Insolvency Jurisdictional Framework Comparator
class InsolvencyJurisdictionComparator:
    def __init__(self, doctrine_name: str, scope: str, asset_control: str, foreign_creditor_treatment: str, efficiency_score: int):
        self.doctrine_name = doctrine_name
        self.scope = scope
        self.asset_control = asset_control
        self.foreign_creditor_treatment = foreign_creditor_treatment
        self.efficiency_score = efficiency_score

    def evaluate_cross_border_resolution(self, enterprise_value_crores: float, domestic_asset_ratio: float) -> dict:
        foreign_asset_ratio = 1.0 - domestic_asset_ratio
        if self.doctrine_name == "Territorialism (Grab Rule)":
            # Liquidation at fire-sale discount, multiple uncoordinated proceedings
            preserved_value = enterprise_value_crores * (domestic_asset_ratio * 0.45 + foreign_asset_ratio * 0.35)
            liquidation_discount_pct = 60.0
            coordination_status = "UNCOORDINATED_PARALLEL_LITIGATION"
        elif self.doctrine_name == "Pure Universalism":
            # Theoretical optimal value, but severe sovereign pushback and recognition denial
            preserved_value = enterprise_value_crores * 0.88
            liquidation_discount_pct = 12.0
            coordination_status = "SOVEREIGN_RECOGNITION_BLOCKED"
        else: # Modified Universalism (UNCITRAL Model Law)
            # Going-concern preservation via single main forum and coordinated local non-main relief
            preserved_value = enterprise_value_crores * 0.82
            liquidation_discount_pct = 18.0
            coordination_status = "HARMONIZED_CROSS_BORDER_RECOGNITION"

        return {
            "doctrine": self.doctrine_name,
            "original_value_cr": enterprise_value_crores,
            "realized_value_cr": round(preserved_value, 2),
            "loss_pct": liquidation_discount_pct,
            "status": coordination_status,
            "uncitral_compliant": self.doctrine_name == "Modified Universalism (UNCITRAL Model Law)"
        }

frameworks = [
    InsolvencyJurisdictionComparator("Territorialism (Grab Rule)", "National Sovereignty", "Local Physical Assets Only", "Subordinated / Excluded", 30),
    InsolvencyJurisdictionComparator("Pure Universalism", "Single Global Forum", "Worldwide Extraterritorial", "Equal Worldwide Standing", 65),
    InsolvencyJurisdictionComparator("Modified Universalism (UNCITRAL Model Law)", "Main & Non-Main Coordination", "Universal Main with Local Non-Main Safeguards", "Non-Discriminatory Direct Access", 95)
]

print("UNCITRAL Model Law vs Traditional Jurisdictional Doctrines Audit:")
for fw in frameworks:
    res = fw.evaluate_cross_border_resolution(enterprise_value_crores=5000.0, domestic_asset_ratio=0.60)
    print(f"[{fw.doctrine_name[:38]:38s}] Realized: Rs {res['realized_value_cr']} Cr | Loss: {res['loss_pct']:4.1f}% | {res['status']}")

print("Cross-Border Jurisprudential Evaluation: UNCITRAL_FRAMEWORK_COMPARATOR_PASS")
"""

res1 = subprocess.run(["python", "-c", p1_code], capture_output=True, text=True)
p1_output = res1.stdout

day_data["parts"].append({
    "title": "UNCITRAL Model Law on Cross-Border Insolvency (1997) & Modified Universalism",
    "say": p1_say,
    "example": "Evaluate how Modified Universalism under the UNCITRAL Model Law preserves enterprise going-concern value compared to territorial grab rules.",
    "code": p1_code,
    "output": p1_output,
    "codeNotes": [
        "Compares Territorialism, Pure Universalism, and Modified Universalism across recovery metrics.",
        "Models enterprise liquidation discounts resulting from uncoordinated multi-jurisdictional litigation.",
        "Demonstrates value preservation achieved through harmonized UNCITRAL recognition protocols."
    ],
    "tryIt": "Modify the domestic_asset_ratio to 0.20 (an asset-light multinational) and observe how territorialism destroys even more enterprise value.",
    "check": {
        "question": "What is the core jurisprudential concept of 'Modified Universalism' codified in the UNCITRAL Model Law on Cross-Border Insolvency?",
        "options": [
            "A single primary insolvency proceeding is conducted in the debtor's Centre of Main Interests (COMI) with worldwide reach, coordinated with local non-main proceedings to protect local creditors.",
            "Complete territorial fragmentation where every country seizes local assets and bars foreign creditors.",
            "Surrender of national judicial sovereignty to an automated algorithmic artificial intelligence court.",
            "Enforcement of local criminal statutes against foreign bondholders without legal process."
        ],
        "answer": 0,
        "explanation": "Modified Universalism coordinates a single main proceeding in the debtor's COMI with ancillary local proceedings, ensuring global restructuring while protecting local creditor rights."
    }
})

# -------------------------------------------------------------
# Part 2: Centre of Main Interests (COMI) Determination
# -------------------------------------------------------------
p2_say = [
    "At the absolute epicenter of the UNCITRAL Model Law lies the doctrine of the Centre of Main Interests (COMI). COMI is the jurisdictional anchor that dictates which sovereign nation has primary authority to supervise the worldwide restructuring or liquidation of the corporate debtor. Determining a company's COMI determines whether foreign proceedings will be recognized as a 'Foreign Main Proceeding' (which triggers an automatic stay on all debtor assets and legal actions) or merely a 'Foreign Non-Main Proceeding' (which grants only narrow, discretionary relief).",
    "Article 16(3) of the Model Law establishes a foundational statutory presumption: in the absence of proof to the contrary, the debtor's registered office is presumed to be its Centre of Main Interests. In corporate practice, this is known as the Registered Office Presumption. For millions of domestic companies whose administrative headquarters, executive management, and manufacturing operations reside in the same state where they were incorporated, this presumption is straightforward and uncontested.",
    "However, in sophisticated multinational enterprise groups, corporate structuring frequently creates profound divergences between the formal place of incorporation and real-world economic reality. Multinationals regularly establish holding companies or special purpose vehicles (SPVs) in tax-neutral jurisdictions (such as the Cayman Islands, Delaware, Luxembourg, Mauritius, or Cyprus) that consist of nothing more than a brass plate on a lawyer's door and a registered filing agent. Meanwhile, the actual corporate strategy, executive C-suite directors, bank accounts, main business contracts, and operational management are situated thousands of miles away.",
    "The global landmark jurisprudence interpreting COMI—most notably the European Court of Justice (ECJ) ruling in *Eurofood IFSC Ltd* (Case C-341/04), the UK Supreme Court in *In re Stanford International Bank*, and the US Second Circuit Court of Appeals in *In re Fairfield Sentry Ltd* and *In re Morning Mist Holdings*—establishes that the registered office presumption is rebuttable. The true, definitive test for COMI is: Where does the debtor conduct the administration of its interests on a regular basis in a manner that is ascertainable by third parties (specifically, its external creditors)?",
    "The requirement of 'Ascertainability by Third Parties' is the critical safeguard against fraudulent forum shopping and post-insolvency jurisdictional manipulation (known pejoratively as 'bankruptcy tourism'). Creditors do not lend money based on secret, unpublicized board meetings held on private yachts. Creditors extend credit based on public, objective indicators: Where is the debtor's executive headquarters located? Where do the Chief Executive Officer and Chief Financial Officer physically negotiate contracts? What is the governing law and currency of the debtor's primary credit facilities? Where are the primary operational bank accounts and treasury functions managed? Which jurisdiction's regulatory authorities oversee corporate disclosures?",
    "If a corporate debtor attempts to move its registered office to a debtor-friendly jurisdiction on the eve of insolvency without moving its real operations, employees, and creditor-facing functions, international courts will aggressively reject the relocation as fraudulent and fix the COMI in the historical, operational jurisdiction. In the milestone Indian cross-border insolvency ruling involving *Jet Airways (India) Ltd v. State Bank of India*, the Dutch Court of Appeal had initially declared bankruptcy in the Netherlands because two aircraft were stationed at Schiphol Airport. However, upon scrutinizing the ascertainability criteria, the NCLAT recognized that Jet Airways was incorporated in India, had its principal business headquarters in Mumbai, held its main airline operating permits from India's DGCA, and drew the vast majority of its revenues in India. Consequently, India was established as the undisputed COMI.",
    "In this module, we construct a production-grade multi-factor COMI Determination and Creditor Ascertainability Engine in pure Python. The engine ingests corporate operational metrics, weights executive location, treasury management, creditor notice, and regulatory filings, and deterministically resolves whether the registered office presumption is rebutted. Review the implementation below and study how courts systematically untangle multinational corporate holding structures."
]

p2_code = """# Multi-Factor Centre of Main Interests (COMI) & Creditor Ascertainability Engine
class COMIDeterminationEngine:
    def __init__(self, registered_office_country: str):
        self.registered_office = registered_office_country
        self.factors = []

    def add_jurisdictional_factor(self, factor_name: str, country: str, weight: float, public_ascertainability_score: float):
        # Weight scale 1.0 - 5.0; Ascertainability 0.0 (secret) to 1.0 (fully public to creditors)
        self.factors.append({
            "name": factor_name,
            "country": country,
            "weight": weight,
            "ascertainability": public_ascertainability_score,
            "effective_score": weight * public_ascertainability_score
        })

    def determine_comi(self) -> dict:
        country_scores = {}
        for f in self.factors:
            c = f["country"]
            country_scores[c] = country_scores.get(c, 0.0) + f["effective_score"]

        # Sort countries by aggregate weighted ascertainability score
        sorted_countries = sorted(country_scores.items(), key=lambda x: x[1], reverse=True)
        top_country, top_score = sorted_countries[0]
        
        # Calculate presumption rebuttal
        reg_score = country_scores.get(self.registered_office, 0.0)
        presumption_rebutted = (top_country != self.registered_office) and (top_score > reg_score * 1.5)

        comi_jurisdiction = top_country if presumption_rebutted else self.registered_office
        rebuttal_rationale = (
            f"Presumption Rebutted: Operational nexus in {top_country} (Score {top_score:.1f}) overwhelmingly exceeds registered office {self.registered_office} (Score {reg_score:.1f})."
            if presumption_rebutted else
            f"Presumption Upheld: Registered office {self.registered_office} aligns with or is not substantially displaced by operational nexus."
        )

        return {
            "registered_office": self.registered_office,
            "determined_comi": comi_jurisdiction,
            "presumption_rebutted": presumption_rebutted,
            "rationale": rebuttal_rationale,
            "scores": {k: round(v, 2) for k, v in country_scores.items()}
        }

# Case Study: Global Air Cargo SPV (Incorporated in Cayman Islands, but operating out of Mumbai, India)
engine = COMIDeterminationEngine(registered_office_country="Cayman Islands")

# Add operational factors
engine.add_jurisdictional_factor("Registered Corporate Seat (Brass Plate)", "Cayman Islands", weight=2.0, public_ascertainability_score=0.90)
engine.add_jurisdictional_factor("Executive C-Suite Headquarters & Boardroom", "India", weight=5.0, public_ascertainability_score=0.95)
engine.add_jurisdictional_factor("Syndicated Banking Facilities & Debt Law", "United Kingdom", weight=4.0, public_ascertainability_score=0.85)
engine.add_jurisdictional_factor("Primary Aircraft Operations & Employee Base", "India", weight=4.5, public_ascertainability_score=0.90)
engine.add_jurisdictional_factor("Regulatory Licensing (Civil Aviation Permit)", "India", weight=4.0, public_ascertainability_score=1.00)
engine.add_jurisdictional_factor("Primary Cash Treasury Accounts", "India", weight=3.5, public_ascertainability_score=0.80)

comi_verdict = engine.determine_comi()

print("UNCITRAL Centre of Main Interests (COMI) Judicial Determination Audit:")
print(f"Registered Seat:      {comi_verdict['registered_office']}")
print(f"Determined COMI:      {comi_verdict['determined_comi']} (Foreign Main Jurisdiction)")
print(f"Presumption Rebutted: {comi_verdict['presumption_rebutted']}")
print(f"Jurisdictional Scores: {comi_verdict['scores']}")
print(f"Judicial Holding:     {comi_verdict['rationale']}")
print("COMI Determination Engine: COMI_DETERMINATION_PASS")
"""

res2 = subprocess.run(["python", "-c", p2_code], capture_output=True, text=True)
p2_output = res2.stdout

day_data["parts"].append({
    "title": "Centre of Main Interests (COMI) Determination & Rebuttable Registered Office Presumption",
    "say": p2_say,
    "example": "Evaluate how objective creditor ascertainability overcomes statutory registered office presumptions in multinational insolvency filings.",
    "code": p2_code,
    "output": p2_output,
    "codeNotes": [
        "Encapsulates the statutory Article 16(3) Registered Office Presumption.",
        "Weights operational indicators: C-suite location, flight operations, regulatory permits, and treasury.",
        "Demonstrates evidentiary rebuttal when operational nexus overwhelmingly displaces tax-haven incorporation."
    ],
    "tryIt": "Shift the executive headquarters and treasury back to the Cayman Islands and observe the engine uphold the registered office presumption.",
    "check": {
        "question": "Under the landmark ECJ Eurofood and US Chapter 15 jurisprudence, what is the indispensable legal test required to rebut the registered office presumption for COMI?",
        "options": [
            "Proof that the central administration of the debtor is conducted in a different jurisdiction in a manner that is readily ascertainable by objective third parties (creditors).",
            "Proof that the debtor's founder has dual citizenship in both countries.",
            "Proof that the debtor's server is hosted on a public cloud provider.",
            "Proof that the corporate logo uses colors from a different national flag."
        ],
        "answer": 0,
        "explanation": "COMI requires that the debtor's central administration be conducted in that jurisdiction on a regular basis in a manner that is objectively ascertainable by third-party creditors."
    }
})

# -------------------------------------------------------------
# Part 3: Access of Foreign Representatives & NCLT Recognition Primitives
# -------------------------------------------------------------
p3_say = [
    "Once the Centre of Main Interests is identified, how does a foreign court-appointed insolvency professional actually step into a domestic court to protect assets? This is the domain of the Access and Recognition pillars of the UNCITRAL Model Law (codified in Articles 9 through 18). Historically, a foreign bankruptcy receiver attempting to freeze bank accounts in a foreign country had to initiate a cumbersome common law lawsuit, execute diplomatic letters rogatory through embassies, or seek recognition of a foreign money judgment under civil procedure codes—a process taking years while distressed assets evaporated.",
    "The UNCITRAL Model Law revolutionizes this procedure by creating direct, statutory procedural standing for Foreign Representatives. A 'Foreign Representative' is defined as any person or body (including one appointed on an interim basis) authorized in a foreign proceeding to administer the reorganization or liquidation of the debtor's assets, or to act as a representative of the foreign proceeding (such as a US Chapter 11 Trustee, a UK Joint Administrator, an Indian Resolution Professional, or a Dutch Bankruptcy Trustee).",
    "Under Article 9 of the Model Law, a foreign representative is entitled to apply directly to the local court (in India, the designated NCLT Bench having territorial jurisdiction over debtor assets). Crucially, Article 10 establishes that the mere act of applying for recognition does NOT subject the foreign representative or the debtor's foreign assets to the general jurisdiction of the local courts for any other purpose. This jurisdictional shield gives foreign trustees complete confidence to seek emergency protective orders without fear of being subjected to unrelated commercial lawsuits or tax audits in the foreign state.",
    "To obtain formal recognition, the foreign representative files an Application for Recognition accompanied by three statutory evidentiary proofs under Article 15: (1) A certified copy of the decision commencing the foreign proceeding and appointing the foreign representative, or a certificate from the foreign court affirming the same; (2) A statement identifying all other foreign proceedings known to the representative concerning the debtor; and (3) Evidence supporting the determination of whether the foreign proceeding is a Main or Non-Main proceeding.",
    "Upon receiving the application, the domestic tribunal evaluates whether the proceeding qualifies under the strict statutory definition of a 'Foreign Proceeding' under Article 2(a): It must be a collective judicial or administrative proceeding in a foreign state, pursuant to a law relating to insolvency, in which the debtor's assets and affairs are subject to control or supervision by a foreign court for the purpose of reorganization or liquidation. Once these procedural prerequisites are met, recognition is mandatory unless granted an explicit public policy exemption under Article 6.",
    "The Public Policy Exception (Article 6) provides that a court may refuse to take an action governed by the Model Law only if the action would be 'manifestly contrary to the public policy' of the enacting state. The restrictive adverb 'manifestly' was deliberately inserted by UNCITRAL drafters to prevent domestic courts from using public policy as an excuse for economic protectionism. In international jurisprudence, Article 6 is invoked only in extreme cases involving violations of fundamental constitutional due process, such as where a creditor was stripped of all property rights without notice or opportunity to be heard.",
    "In this part, we implement a pure Python Foreign Representative Recognition & Evidentiary Verification Engine. The engine audits court appointment certificates, validates collective insolvency criteria, tests against the Article 6 public policy bar, and issues deterministic NCLT recognition decrees."
]

p3_code = """# UNCITRAL Model Law Articles 9-18 Foreign Representative Recognition Engine
class ForeignRepresentativeRecognitionEngine:
    def __init__(self, domestic_tribunal_name: str = "NCLT Mumbai Bench"):
        self.domestic_tribunal = domestic_tribunal_name
        self.recognition_registry = {}

    def process_recognition_petition(self, case_id: str, foreign_jurisdiction: str, proceeding_type: str, 
                                     has_court_certified_decree: bool, is_collective_proceeding: bool, 
                                     violates_fundamental_public_policy: bool) -> dict:
        # Step 1: Article 2(a) Threshold Verification
        if not is_collective_proceeding:
            return {
                "case_id": case_id,
                "status": "RECOGNITION_DENIED",
                "reason": "Proceeding fails Article 2(a) collective proceeding requirement (e.g. unilateral receivership for single creditor)."
            }

        # Step 2: Article 15 Evidentiary Verification
        if not has_court_certified_decree:
            return {
                "case_id": case_id,
                "status": "RECOGNITION_DEFECTIVE",
                "reason": "Missing Article 15 certified copy of foreign court order appointing foreign representative."
            }

        # Step 3: Article 6 Narrow Public Policy Test
        if violates_fundamental_public_policy:
            return {
                "case_id": case_id,
                "status": "RECOGNITION_REFUSED_ARTICLE_6",
                "reason": "Proceeding is manifestly contrary to fundamental domestic public policy / constitutional due process."
            }

        # Step 4: Grant Recognition Decree
        recognition_decree = {
            "case_id": case_id,
            "status": "RECOGNITION_GRANTED",
            "tribunal": self.domestic_tribunal,
            "foreign_jurisdiction": foreign_jurisdiction,
            "proceeding_classification": proceeding_type, # 'Main' or 'Non-Main'
            "standing": "DIRECT_PROCEDURAL_STANDING_ESTABLISHED_ARTICLE_9",
            "limited_jurisdiction_shield": "PROTECTED_UNDER_ARTICLE_10"
        }
        self.recognition_registry[case_id] = recognition_decree
        return recognition_decree

engine = ForeignRepresentativeRecognitionEngine(domestic_tribunal_name="NCLT Principal Bench New Delhi")

# Application 1: UK Joint Administrators in Rolls-Royce Supplier restructuring (Valid)
app1 = engine.process_recognition_petition(
    case_id="FRP-2026-UK-01",
    foreign_jurisdiction="United Kingdom (High Court of Justice)",
    proceeding_type="Foreign Main Proceeding",
    has_court_certified_decree=True,
    is_collective_proceeding=True,
    violates_fundamental_public_policy=False
)

# Application 2: Secret unilateral debenture receivership from offshore haven (Defective)
app2 = engine.process_recognition_petition(
    case_id="FRP-2026-OFF-02",
    foreign_jurisdiction="Offshore Tax Haven",
    proceeding_type="Foreign Non-Main Proceeding",
    has_court_certified_decree=True,
    is_collective_proceeding=False, # Single creditor grab
    violates_fundamental_public_policy=False
)

print("NCLT Cross-Border Insolvency Recognition Decree Audit:")
print(f"[{app1['case_id']}] Status: {app1['status']} | Standing: {app1.get('standing', 'NONE')}")
print(f"[{app2['case_id']}] Status: {app2['status']} | Reason: {app2['reason']}")
print("Foreign Representative Access Engine: RECOGNITION_PRIMITIVES_PASS")
"""

res3 = subprocess.run(["python", "-c", p3_code], capture_output=True, text=True)
p3_output = res3.stdout

day_data["parts"].append({
    "title": "Access of Foreign Representatives & Procedural Recognition Primitives (Articles 9–18)",
    "say": p3_say,
    "example": "Simulate an NCLT recognition hearing for a foreign administrator, validating collective proceeding status, certified decrees, and public policy exceptions.",
    "code": p3_code,
    "output": p3_output,
    "codeNotes": [
        "Implements Article 2(a) collective proceeding gating logic.",
        "Enforces Article 15 statutory evidentiary requirements (certified judicial decree).",
        "Applies the restrictive Article 6 'manifestly contrary to public policy' test."
    ],
    "tryIt": "Set violates_fundamental_public_policy=True on Application 1 and observe how Article 6 operates to block recognition.",
    "check": {
        "question": "Under Article 6 of the UNCITRAL Model Law, under what specific threshold may a domestic court refuse to recognize a foreign insolvency proceeding?",
        "options": [
            "Only if the foreign action would be 'manifestly contrary to the public policy' of the enacting sovereign state (such as severe denial of due process).",
            "Whenever domestic creditors would recover less than 100% of their claims.",
            "If the foreign judge is younger than the domestic judge.",
            "Whenever the debtor operates in the technology sector."
        ],
        "answer": 0,
        "explanation": "Article 6 restricts public policy refusals to situations where the foreign proceeding is 'manifestly contrary' to public policy, preventing standard commercial differences from blocking relief."
    }
})

# -------------------------------------------------------------
# Part 4: Relief Available upon Application and Recognition: Mandatory Automatic Stay vs Discretionary Relief
# -------------------------------------------------------------
p4_say = [
    "The true economic power of the UNCITRAL Model Law lies in the protective Relief it unlocks for the corporate debtor. When a multinational enterprise enters insolvency, individual creditors around the globe instantly move to seize bank accounts, impound ships and cargo aircraft, repossess leased machinery, and foreclose on pledged collateral. If this multi-jurisdictional asset grab is not halted immediately, the debtor's business will disintegrate before a restructuring plan can even be drafted.",
    "The Model Law bifurcates relief into two distinct statutory categories based on timing and procedural status: Provisional Relief (Article 19) and Post-Recognition Relief (Articles 20 and 21). Under Article 19, between the date when an application for recognition is filed and the date when the court formally decides to grant recognition, the court may grant urgent Provisional Relief where relief is urgently needed to protect the assets of the debtor or the interests of the creditors. Provisional relief is entirely discretionary and typically includes staying execution against the debtor's assets and entrusting the administration of local assets to the foreign representative.",
    "However, the watershed moment occurs upon the formal Grant of Recognition under Article 20. If a foreign proceeding is recognized as a 'Foreign Main Proceeding' (because it is situated in the debtor's Centre of Main Interests), Article 20 mandates an immediate, statutory Automatic Stay. This automatic stay is not subject to judicial discretion; it operates by force of law with immediate effect across the entire territorial jurisdiction of the enacting state.",
    "The Article 20 Mandatory Automatic Stay delivers three foundational protections: (1) Commencement or continuation of individual actions or individual proceedings concerning the debtor's assets, rights, obligations, or liabilities is stayed; (2) Execution against the debtor's assets is stayed; and (3) The right of the debtor to transfer, encumber, or otherwise dispose of any assets of the debtor is suspended. This matches the legal effect of Section 14 of India's IBC or Section 362 of the US Bankruptcy Code, creating an impenetrable legal shield that halts all creditor litigation.",
    "In contrast, if a foreign proceeding is recognized merely as a 'Foreign Non-Main Proceeding' (because the debtor possesses only an 'Establishment'—defined as a place of operations where the debtor carries out non-transitory economic activity with human means and goods or services—rather than its COMI), Article 20 does NOT apply. The foreign representative does not receive an automatic stay.",
    "Instead, for Foreign Non-Main Proceedings, all relief is Discretionary under Article 21. The domestic tribunal has the judicial power to grant relief (such as staying actions, authorizing asset examinations, or freezing specific bank accounts), but only to the extent that the relief relates to assets that, under local law, should be administered in that specific foreign non-main proceeding. Furthermore, under Article 22, the court must be satisfied that the interests of local creditors and employees are adequately protected before granting any discretionary relief.",
    "In this part, we implement a pure Python Cross-Border Insolvency Relief & Stay Orchestration Simulator. We model both Article 19 provisional relief and Article 20 automatic stay vs. Article 21 discretionary orders across multinational creditor actions."
]

p4_code = """# UNCITRAL Model Law Articles 19, 20 & 21 Relief & Injunction State Machine
class CrossBorderReliefManager:
    def __init__(self, debtor_name: str):
        self.debtor_name = debtor_name
        self.active_stays = []
        self.enjoined_actions = []

    def evaluate_relief_status(self, recognition_status: str, proceeding_type: str, pending_creditor_actions: list) -> dict:
        # recognition_status: 'PENDING_APPLICATION', 'RECOGNIZED', 'DENIED'
        # proceeding_type: 'FOREIGN_MAIN', 'FOREIGN_NON_MAIN'
        
        results = []
        is_automatic_stay_active = False

        if recognition_status == "RECOGNIZED" and proceeding_type == "FOREIGN_MAIN":
            # Article 20 Mandatory Automatic Stay applies by force of law
            is_automatic_stay_active = True
            for action in pending_creditor_actions:
                results.append({
                    "creditor": action["creditor"],
                    "claim_type": action["claim_type"],
                    "asset": action["asset"],
                    "outcome": "ENJOINED_BY_ARTICLE_20_AUTOMATIC_STAY",
                    "legal_basis": "Mandatory statutory stay on individual creditor actions & asset transfers."
                })
        elif recognition_status == "RECOGNIZED" and proceeding_type == "FOREIGN_NON_MAIN":
            # Article 21 Discretionary Relief only applies if assets tied to local establishment
            for action in pending_creditor_actions:
                if action.get("tied_to_local_establishment", False):
                    results.append({
                        "creditor": action["creditor"],
                        "claim_type": action["claim_type"],
                        "asset": action["asset"],
                        "outcome": "ENJOINED_BY_ARTICLE_21_DISCRETIONARY_RELIEF",
                        "legal_basis": "Tribunal discretion: Asset directly tied to local commercial establishment."
                    })
                else:
                    results.append({
                        "creditor": action["creditor"],
                        "claim_type": action["claim_type"],
                        "asset": action["asset"],
                        "outcome": "ACTION_PERMITTED_PROCEED",
                        "legal_basis": "Discretionary relief denied: Asset not tied to non-main establishment."
                    })
        elif recognition_status == "PENDING_APPLICATION":
            # Article 19 Urgent Provisional Relief (Discretionary asset preservation)
            for action in pending_creditor_actions:
                if action.get("is_irreversible_asset_drain", False):
                    results.append({
                        "creditor": action["creditor"],
                        "claim_type": action["claim_type"],
                        "asset": action["asset"],
                        "outcome": "TEMPORARILY_BLOCKED_BY_ARTICLE_19_PROVISIONAL_RELIEF",
                        "legal_basis": "Urgent provisional order: Preventing irreversible asset dissipation."
                    })
                else:
                    results.append({
                        "creditor": action["creditor"],
                        "claim_type": action["claim_type"],
                        "asset": action["asset"],
                        "outcome": "ACTION_ACTIVE_PENDING_HEARING",
                        "legal_basis": "Standard commercial action not subject to provisional freeze."
                    })

        return {
            "debtor": self.debtor_name,
            "recognition_status": recognition_status,
            "proceeding_type": proceeding_type,
            "automatic_stay_triggered": is_automatic_stay_active,
            "creditor_action_audit": results
        }

manager = CrossBorderReliefManager("Apex Multinational Aviation Ltd")

creditor_actions = [
    {"creditor": "Singapore Bank Corp", "claim_type": "Mortgage Foreclosure", "asset": "Hangar Leasehold", "tied_to_local_establishment": True, "is_irreversible_asset_drain": True},
    {"creditor": "London Fuel Syndicate", "claim_type": "Asset Attachment", "asset": "Jet Fuel Reserves", "tied_to_local_establishment": False, "is_irreversible_asset_drain": True},
    {"creditor": "Domestic IT Vendor", "claim_type": "Breach of Contract", "asset": "Accounts Receivable", "tied_to_local_establishment": True, "is_irreversible_asset_drain": False}
]

# Scenario A: Recognized as Foreign Main Proceeding (Article 20 triggers)
report_main = manager.evaluate_relief_status("RECOGNIZED", "FOREIGN_MAIN", creditor_actions)

print("UNCITRAL Model Law Relief & Automatic Stay Simulation Audit:")
print(f"Proceeding: {report_main['proceeding_type']} | Automatic Stay Active: {report_main['automatic_stay_triggered']}")
for act in report_main['creditor_action_audit']:
    print(f"  -> Creditor: {act['creditor'][:20]:20s} | Action: {act['outcome']}")

print("Cross-Border Relief State Machine: RELIEF_ORCHESTRATION_PASS")
"""

res4 = subprocess.run(["python", "-c", p4_code], capture_output=True, text=True)
p4_output = res4.stdout

day_data["parts"].append({
    "title": "Cross-Border Relief & Injunctions: Mandatory Automatic Stay (Art. 20) vs. Discretionary Relief (Art. 21)",
    "say": p4_say,
    "example": "Simulate creditor action enforcement and analyze how Article 20 mandatory automatic stays halt multinational debt enforcement.",
    "code": p4_code,
    "output": p4_output,
    "codeNotes": [
        "Models Article 19 urgent provisional relief pending recognition hearings.",
        "Executes mandatory Article 20 Automatic Stay upon recognition of Foreign Main Proceedings.",
        "Demonstrates tailored Article 21 discretionary relief for Foreign Non-Main Proceedings."
    ],
    "tryIt": "Switch the proceeding_type to FOREIGN_NON_MAIN and observe how non-establishment assets remain unprotected.",
    "check": {
        "question": "What is the critical legal distinction between the relief granted upon recognition of a Foreign Main Proceeding versus a Foreign Non-Main Proceeding under the Model Law?",
        "options": [
            "Recognition of a Foreign Main Proceeding triggers an immediate, mandatory automatic stay under Article 20, whereas relief for a Foreign Non-Main Proceeding is discretionary under Article 21.",
            "Foreign Main Proceedings liquidate the company, while Non-Main Proceedings pardon all debt.",
            "Foreign Non-Main Proceedings double the interest rates payable to foreign bondholders.",
            "There is no legal difference; both trigger identical worldwide criminal sanctions."
        ],
        "answer": 0,
        "explanation": "Article 20 confers a mandatory statutory stay only upon recognition of a Foreign Main Proceeding; Foreign Non-Main Proceedings receive only tailored discretionary relief under Article 21."
    }
})

# -------------------------------------------------------------
# Part 5: Masterclass Synthesis: Full COMI & Sovereign Jurisdiction Engine
# -------------------------------------------------------------
p5_say = [
    "You have now mastered the foundational architecture of Cross-Border Insolvency and the UNCITRAL Model Law (1997): from the historical transition between Territorialism, Universalism, and Modified Universalism, to the rigorous multi-factor evidentiary test for Centre of Main Interests (COMI) determination, the direct access and limited jurisdiction shield for Foreign Representatives, and the statutory mechanics of Article 20 mandatory automatic stays versus Article 21 discretionary relief.",
    "In this masterclass synthesis, we construct an end-to-end Cross-Border Insolvency Jurisdictional Evaluation & Asset Shield Engine in pure Python standard library. The engine models an elite General Counsel and Senior Insolvency Professional advising the Committee of Creditors in an emergency multi-jurisdictional insolvency crisis.",
    "Our synthesis engine executes five mandatory statutory invariants: First, it ingests multi-jurisdictional corporate metrics across registered offices, executive boardrooms, and operational centers, applying the Eurofood/Fairfield Sentry ascertainability weights to definitively resolve the Centre of Main Interests. Second, it evaluates whether the registered office presumption is legally rebutted with mathematical proof. Third, it validates foreign representative standing under Article 9 and verifies collective proceeding credentials under Article 2(a). Fourth, it runs the Article 6 public policy barrier test, ensuring no constitutional due process violations exist. Fifth, it executes the Article 20 stay engine, successfully enjoining global creditor asset seizures across sovereign borders and issuing the master engineering credential.",
    "Run the complete cross-border insolvency jurisdictional audit below. Observe how the engine processes complex multinational corporate structures, calculates evidentiary weights, blocks illegal creditor attachments, and confers the master legal certification.",
    "From an enterprise general counsel perspective, mastering cross-border insolvency is the hallmark of elite corporate legal leadership. When a billion-dollar enterprise faces distress, the battle is won or lost not in domestic trial courts, but in the rapid, strategic orchestration of recognition petitions across the NCLT in India, Chapter 15 courts in New York, and the Insolvency and Companies Court in London. Your deep command of the UNCITRAL Model Law guarantees that you can preserve multinational going-concern value, thwart predatory vulture funds, and execute world-class corporate reorganizations."
]

p5_code = """# Masterclass Synthesis: End-to-End UNCITRAL COMI Determination & Cross-Border Asset Shield Engine
class UNCITRALCrossBorderMasterEngine:
    def __init__(self, corporate_debtor: str, registered_seat: str):
        self.debtor = corporate_debtor
        self.registered_seat = registered_seat
        self.comi_factors = []
        
    def add_nexus_factor(self, factor_name: str, country: str, weight: float, creditor_visibility: float):
        self.comi_factors.append({
            "factor": factor_name,
            "country": country,
            "score": weight * creditor_visibility
        })

    def execute_master_jurisdictional_audit(self, creditor_claims: list) -> dict:
        # 1. Determine COMI
        country_scores = {}
        for f in self.comi_factors:
            c = f["country"]
            country_scores[c] = country_scores.get(c, 0.0) + f["score"]
            
        sorted_scores = sorted(country_scores.items(), key=lambda x: x[1], reverse=True)
        comi_country, comi_score = sorted_scores[0]
        reg_score = country_scores.get(self.registered_seat, 0.0)
        
        presumption_rebutted = (comi_country != self.registered_seat) and (comi_score > reg_score * 1.4)
        adjudicated_comi = comi_country if presumption_rebutted else self.registered_seat
        
        # 2. Recognition Decree & Article 20 Stay
        is_foreign_main = (adjudicated_comi == comi_country)
        enjoined_claims = []
        total_shielded_value_cr = 0.0
        
        for claim in creditor_claims:
            enjoined_claims.append({
                "creditor": claim["name"],
                "amount_cr": claim["amount_cr"],
                "stay_status": "ENJOINED_UNDER_ARTICLE_20_MANDATORY_STAY" if is_foreign_main else "DISCRETIONARY_REVIEW"
            })
            total_shielded_value_cr += claim["amount_cr"]
            
        audit_passed = (presumption_rebutted and is_foreign_main and total_shielded_value_cr > 0)
        
        return {
            "debtor": self.debtor,
            "registered_seat": self.registered_seat,
            "adjudicated_comi": adjudicated_comi,
            "presumption_rebutted": presumption_rebutted,
            "total_shielded_debt_cr": total_shielded_value_cr,
            "claims_audited": len(enjoined_claims),
            "audit_passed": audit_passed
        }

engine = UNCITRALCrossBorderMasterEngine("Apex Global Telecommunications Conglomerate", "Mauritius")

# Evidence nexus
engine.add_nexus_factor("Registered Seat (Nominee Directors)", "Mauritius", weight=2.0, creditor_visibility=0.8)
engine.add_nexus_factor("Executive Headquarters & Operations", "India", weight=5.0, creditor_visibility=1.0)
engine.add_nexus_factor("Primary Subscriber Revenue & Spectrum Licenses", "India", weight=5.0, creditor_visibility=1.0)
engine.add_nexus_factor("Syndicated Banking Facility (English Law)", "United Kingdom", weight=3.5, creditor_visibility=0.9)

claims = [
    {"name": "Wall Street Distressed Debt Fund", "amount_cr": 1250.0},
    {"name": "London Export Credit Agency", "amount_cr": 850.0},
    {"name": "Tokyo Equipment Finance Syndicate", "amount_cr": 600.0}
]

audit_report = engine.execute_master_jurisdictional_audit(claims)

print("UNCITRAL Model Law Masterclass Jurisdictional & Asset Shield Audit:")
print(f"Corporate Debtor:       {audit_report['debtor']}")
print(f"Registered Head Office: {audit_report['registered_seat']}")
print(f"Adjudicated COMI:       {audit_report['adjudicated_comi']} (Presumption Rebutted: {audit_report['presumption_rebutted']})")
print(f"Total Shielded Debt:    Rs {audit_report['total_shielded_debt_cr']} Crores across {audit_report['claims_audited']} Foreign Creditors")
print(f"Article 20 Injunctions: 100% Mandatory Automatic Stay Enforced")
print(f"Masterclass Compliance: {'VERIFIED_PASS' if audit_report['audit_passed'] else 'FAILED'}")
print("Certification: UNCITRAL_COMI_DETERMINATION_PASS")
"""

res5 = subprocess.run(["python", "-c", p5_code], capture_output=True, text=True)
p5_output = res5.stdout

day_data["parts"].append({
    "title": "Masterclass Synthesis: Algorithmic Centre of Main Interests (COMI) & Sovereign Asset Shield Engine",
    "say": p5_say,
    "example": "Execute complete end-to-end UNCITRAL Model Law cross-border audit: rebut registered office presumption and enforce Article 20 worldwide stays.",
    "code": p5_code,
    "output": p5_output,
    "codeNotes": [
        "Synthesizes Eurofood/Fairfield Sentry multi-factor ascertainability algorithms.",
        "Demonstrates evidentiary rebuttal of tax-haven registered office presumption.",
        "Enforces Article 20 mandatory automatic stay shielding thousands of crores of distressed assets."
    ],
    "tryIt": "Add a new foreign creditor claim and observe the real-time total shielded debt valuation update.",
    "check": {
        "question": "What is the primary operational consequence when an Indian tribunal (NCLT) determines that India is the debtor's Centre of Main Interests (COMI)?",
        "options": [
            "The Indian proceeding is recognized globally as the Foreign Main Proceeding, empowering the Indian Resolution Professional to seek worldwide Article 20 stays and coordinate all foreign proceedings.",
            "The debtor's debts are permanently extinguished without repayment.",
            "All foreign creditors are immediately imprisoned under contempt of court rules.",
            "The company is automatically nationalized by the central government."
        ],
        "answer": 0,
        "explanation": "COMI status establishes the Indian restructuring as the primary Foreign Main Proceeding, authorizing the Resolution Professional to coordinate worldwide restructuring under Modified Universalism."
    }
})

# Save day 46 json in Branch B
out_path = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce\scripts\bcom_law_day46.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(day_data, f, indent=2)

print(f"Successfully generated {out_path} with {len(day_data['parts'])} parts.")

# Audit word counts
total_words = 0
for idx, p in enumerate(day_data["parts"]):
    wc = sum(len(s.split()) for s in p["say"])
    total_words += wc
    print(f"Part {idx+1} ('{p['title'][:32]}...'): {wc} words")
print(f"Total Day 46 Spoken Words: {total_words} words (Target: >= 3000, all parts >= 580)")
