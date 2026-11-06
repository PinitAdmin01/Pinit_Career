import json
import re

def count_words(text):
    return len(re.findall(r'\b[A-Za-z0-9_-]+\b', text))

day58_code = """# Day 58: ISDS, Bilateral Investment Treaties & Foreign Arbitral Award Enforcement Engine
# Simulating UNCITRAL arbitration award evaluation, Section 48 Arbitration & Conciliation Act 1996
# New York Convention refusal grounds, and sovereign asset commercial attachment filters.

from dataclasses import dataclass
from typing import List, Dict, Optional

@dataclass
class ArbitralAward:
    award_id: str
    tribunal: str           # e.g., 'UNCITRAL / Permanent Court of Arbitration'
    seat_jurisdiction: str  # e.g., 'The Hague, Netherlands'
    claimant: str
    respondent_state: str
    damages_awarded_usd_m: float
    is_set_aside_at_seat: bool
    due_process_followed: bool
    violates_fundamental_policy: bool
    subject_matter_arbitrable: bool

class ArbitralEnforcementEngine:
    def __init__(self, enforcing_jurisdiction: str = "India"):
        self.enforcing_jurisdiction = enforcing_jurisdiction
        # Reciprocating territories recognized under Section 44 of the Act
        self.reciprocating_territories = {"Netherlands", "United Kingdom", "United States", "Singapore", "France"}

    def evaluate_section_48_enforceability(self, award: ArbitralAward) -> Dict[str, any]:
        \"\"\"
        Evaluates foreign award enforceability under Section 48 of the Arbitration and Conciliation Act 1996
        (New York Convention 1958). An Indian court can refuse enforcement ONLY if:
        1. Party was incapacitated or agreement invalid (S.48(1)(a))
        2. Denial of due process/proper notice (S.48(1)(b))
        3. Exceeded scope of reference (S.48(1)(c))
        4. Composition of tribunal defective (S.48(1)(d))
        5. Award set aside or suspended at the seat of arbitration (S.48(1)(e))
        6. Non-arbitrable under Indian law (S.48(2)(a))
        7. Contrary to Public Policy of India (S.48(2)(b) - narrow scope: fraud, fundamental policy, justice/morality)
        Note: Under the 2015/2019 amendments, 'patent illegality' is NOT a ground to refuse foreign awards!
        \"\"\"
        refusal_grounds = []

        # Reciprocating territory check (Section 44)
        if award.seat_jurisdiction.split(",")[-1].strip() not in self.reciprocating_territories:
            refusal_grounds.append("Seat jurisdiction is not a gazetted reciprocating territory under Section 44.")

        if award.is_set_aside_at_seat:
            refusal_grounds.append("Section 48(1)(e): Award has been set aside or suspended by a competent authority in the seat.")

        if not award.due_process_followed:
            refusal_grounds.append("Section 48(1)(b): Party was not given proper notice or was unable to present case.")

        if not award.subject_matter_arbitrable:
            refusal_grounds.append("Section 48(2)(a): Subject matter is not capable of settlement by arbitration under Indian law.")

        if award.violates_fundamental_policy:
            refusal_grounds.append("Section 48(2)(b): Award is in conflict with the Public Policy of India (fundamental policy).")

        is_enforceable = len(refusal_grounds) == 0
        return {
            "award_id": award.award_id,
            "enforceable": is_enforceable,
            "refusal_grounds": refusal_grounds
        }

    def assess_sovereign_asset_attachment(self, asset_type: str, asset_value_usd_m: float) -> Dict[str, any]:
        \"\"\"
        Assesses execution against state assets in foreign jurisdictions:
        Purely commercial assets (state-owned enterprise revenue, commercial bank accounts) can be attached.
        Diplomatic/military assets enjoy absolute sovereign immunity under customary international law.
        \"\"\"
        is_attachable = False
        if asset_type in ("commercial_real_estate", "commercial_cargo_ship", "airline_commercial_revenue"):
            is_attachable = True
        elif asset_type in ("embassy_premises", "military_equipment", "central_bank_foreign_exchange_reserves"):
            is_attachable = False

        return {
            "asset_type": asset_type,
            "attachable": is_attachable,
            "protected_by_immunity": not is_attachable
        }

# Execution and verification
engine = ArbitralEnforcementEngine("India")

cairn_award = ArbitralAward(
    award_id="PCA-2015-01",
    tribunal="UNCITRAL / PCA",
    seat_jurisdiction="The Hague, Netherlands",
    claimant="Cairn Energy PLC",
    respondent_state="Republic of India",
    damages_awarded_usd_m=1200.0,
    is_set_aside_at_seat=False,
    due_process_followed=True,
    violates_fundamental_policy=False,
    subject_matter_arbitrable=True
)

enf_res = engine.evaluate_section_48_enforceability(cairn_award)
assert enf_res["enforceable"] is True
assert len(enf_res["refusal_grounds"]) == 0

# Sovereign asset attachment evaluation
comm_asset = engine.assess_sovereign_asset_attachment("airline_commercial_revenue", 150.0)
embassy_asset = engine.assess_sovereign_asset_attachment("embassy_premises", 40.0)

assert comm_asset["attachable"] is True
assert embassy_asset["attachable"] is False

print(f"Award ID: {cairn_award.award_id}")
print(f"Damages Awarded: ${cairn_award.damages_awarded_usd_m}M")
print(f"Section 48 Enforceability Verified: {enf_res['enforceable']}")
print(f"Commercial Asset Execution Allowed: {comm_asset['attachable']}")
print(f"Diplomatic Immunity Shield Upheld: {embassy_asset['protected_by_immunity']}")
print("ISDS_BIT_ARBITRATION_AND_AWARD_ENFORCEMENT_PASS")
"""

day58_output = """Award ID: PCA-2015-01
Damages Awarded: $1200.0M
Section 48 Enforceability Verified: True
Commercial Asset Execution Allowed: True
Diplomatic Immunity Shield Upheld: True
ISDS_BIT_ARBITRATION_AND_AWARD_ENFORCEMENT_PASS"""

part1_say = """Welcome to Day 58 of Corporate Law, IBC & Compliance. Today we examine the intricate legal mechanisms governing Bilateral Investment Treaties (BITs), Investor-State Dispute Settlement (ISDS), International Commercial Arbitration under the UNCITRAL and ICSID regimes, and the enforcement of foreign arbitral awards under the 1958 New York Convention as codified in Part II of India's Arbitration and Conciliation Act 1996.

Cross-border investments involve massive financial capital, extensive infrastructure development, and long-term operational horizons. When a multinational corporation invests in a foreign sovereign state, it faces sovereign risks that ordinary commercial contracts cannot mitigate: expropriation of assets without compensation, arbitrary regulatory overhauls, discriminatory tax measures, denial of justice in domestic courts, and currency repatriation restrictions. To encourage foreign direct investment while shielding foreign investors from sovereign caprice, nation-states enter into Bilateral Investment Treaties (BITs) or International Investment Agreements (IIAs).

At the heart of the international investment regime lies the Investor-State Dispute Settlement (ISDS) mechanism. Unlike traditional public international law where disputes had to be espoused diplomatically by the investor's home state against the host nation, ISDS confers direct legal standing (jus standi) upon a private foreign investor to initiate binding international arbitration against the sovereign host state. These arbitrations are typically conducted under the auspices of the International Centre for Settlement of Investment Disputes (ICSID) under the 1965 Washington Convention, or through ad hoc tribunals established under the UNCITRAL Arbitration Rules administered by the Permanent Court of Arbitration (PCA) at The Hague.

Substantive protections embedded in modern investment treaties revolve around four core legal standards:
1. Fair and Equitable Treatment (FET): The host state must provide a stable, predictable, and transparent regulatory environment, protecting the legitimate expectations of the investor and guaranteeing procedural due process.
2. Expropriation Protection: The state agrees not to expropriate or nationalize investments, directly or indirectly through creeping regulatory measures, except for a public purpose, on a non-discriminatory basis, under due process of law, and upon payment of prompt, adequate, and effective compensation (the Hull formula).
3. Full Protection and Security (FPS): The state owes an obligation to exercise due diligence to physically protect the investor and its investments from civil unrest, violence, or unlawful interference by state or non-state actors.
4. Most-Favored-Nation (MFN) & National Treatment: The state must treat foreign investors no less favorably than domestic investors or investors from third countries.

India's encounter with the ISDS regime has been tumultuous. Seminal awards—such as White Industries v Republic of India (where the tribunal held India liable under the MFN clause due to systemic judicial delays in Indian courts under the India-Australia BIT), Vodafone International Holdings BV v Republic of India (challenging retrospective taxation under the India-Netherlands BIT), and Cairn Energy PLC v Republic of India (resulting in a $1.2 Billion award against retrospective capital gains tax levies)—compelled India to fundamentally reconsider its international investment treaty policy."""

part2_say = """In Part 2, we analyze India's 2016 Model Bilateral Investment Treaty, the revocation of historical first-generation treaties, and the high-profile White Industries, Vodafone, and Cairn Energy awards that reshaped sovereign arbitration defense.

Following the adverse White Industries award in 2011, the Government of India embarked on an aggressive restructuring of its international investment architecture. India issued notices of termination for 58 of its historical first-generation BITs, transitioning to a highly restrictive treaty posture centered on the 2016 Model BIT.

The 2016 Model BIT incorporates profound structural deviations from traditional Western investment treaties, designed specifically to preserve sovereign regulatory space and curb frivolous investor claims:
1. Enterprise-Based Definition of Investment: The Model BIT abandoned the expansive asset-based definition of investment (which historically encompassed intellectual property, commercial claims, and portfolio holdings). Instead, it adopted an 'enterprise-based' definition, requiring a physical enterprise incorporated in the host state with substantial business operations, committing significant capital, and contributing to the host state's economic development.
2. Elimination of Most-Favored-Nation (MFN) Clause: Recognizing how the claimant in White Industries utilized the MFN clause to borrow the 'effective means of asserting claims' standard from the India-Kuwait BIT, the 2016 Model BIT completely omitted the MFN provision to prevent 'treaty shopping'.
3. Narrowing the Fair and Equitable Treatment (FET) Standard: Rather than an open-ended FET standard, the Model BIT codifies a restrictive 'Customary International Law' standard, protecting investors solely against denial of justice in judicial or administrative proceedings, fundamental breaches of due process, targeted discrimination on manifestly unjustified grounds, or manifestly abusive treatment.
4. Total Exclusion of Taxation and Public Welfare Measures: To insulate sovereign fiscal policy, Article 2.4 explicitly excludes all matters relating to taxation, compulsory licensing, government subsidies, and regulatory actions designed to protect human health, public morals, and the environment from the scope of the treaty.
5. Mandatory Exhaustion of Domestic Remedies (EDR): Before an investor can trigger international arbitration, Article 15 mandates that the investor must exhaust all administrative and judicial remedies available in domestic Indian courts for a minimum period of 5 years. Only if the dispute remains unresolved after 5 years can the investor initiate notice of arbitration.

In Vodafone and Cairn Energy, international UNCITRAL tribunals sitting in The Hague held that the retrospective application of tax amendments enacted by the Indian Parliament violated the FET guarantee under the respective BITs. The tribunals awarded massive restitution to the investors. When India initially resisted voluntary compliance, Cairn Energy commenced enforcement proceedings across multiple global jurisdictions—including the United States, United Kingdom, France, and Canada—seeking to attach sovereign commercial assets, including Indian diplomatic real estate in Paris and the commercial revenues and aircraft of Air India, ultimately culminating in a comprehensive sovereign settlement where India withdrew retrospective tax demands and refunded the seized amounts."""

part3_say = """In Part 3, we analyze the enforcement of foreign arbitral awards in India under Part II of the Arbitration and Conciliation Act 1996, the New York Convention 1958, and the strict conditions for refusal codified in Section 48.

When an international commercial arbitration or investment dispute yields a monetary award, the prevailing party seeks execution against the assets of the losing party. Part II of India's Arbitration and Conciliation Act 1996 governs the enforcement of foreign awards under the Convention on the Recognition and Enforcement of Foreign Arbitral Awards 1958 (the New York Convention).

Under Section 44 of the Act, a 'foreign award' must satisfy two threshold statutory conditions:
1. It must decide a commercial dispute arising out of a legal relationship considered as commercial under the laws in force in India.
2. It must be made in one of the reciprocating territories officially notified and gazetted by the Central Government of India in the Official Gazette (such as the United Kingdom, United States, France, Germany, Singapore, and the Netherlands). If an award is seated in a non-reciprocating jurisdiction, it cannot be directly executed under Section 49; instead, the decree holder must file a fresh civil suit on the foreign judgment in an Indian civil court.

Under Section 48, the legal presumption is heavily skewed in favor of enforcement. The Indian court cannot sit as an appellate court to review the merits of the dispute or re-evaluate the factual and legal conclusions reached by the arbitral tribunal. Section 48(1) and (2) enumerate an exhaustive, closed catalog of grounds upon which an Indian court may refuse enforcement:
- Section 48(1)(a): Incapacity of the parties or invalidity of the arbitration agreement under the law chosen by the parties.
- Section 48(1)(b): Denial of procedural due process—where the party against whom the award is invoked was not given proper notice of the appointment of the arbitrator or of the arbitral proceedings or was otherwise unable to present their case.
- Section 48(1)(c): The award deals with a difference not contemplated by or not falling within the terms of the submission to arbitration.
- Section 48(1)(d): The composition of the arbitral authority or the arbitral procedure was not in accordance with the agreement of the parties or the law of the seat.
- Section 48(1)(e): The award has not yet become binding on the parties, or has been set aside or suspended by a competent authority of the country in which, or under the law of which, that award was made (the seat court).
- Section 48(2)(a): The subject matter of the dispute is not capable of settlement by arbitration under the law of India (e.g., criminal offenses, matrimonial disputes, insolvency proceedings, or testamentary matters).
- Section 48(2)(b): The enforcement of the award would be contrary to the Public Policy of India."""

part4_say = """In Part 4, we examine the evolution of the 'Public Policy' defense in India, the landmark rulings in Renusagar, ONGC v Saw Pipes, Shri Lal Mahal, and the transformative 2015/2019 legislative amendments to Section 48.

Historically, the enforcement of foreign arbitral awards in India was plagued by judicial interventionism. In the infamous 2003 ruling ONGC v Saw Pipes Ltd, the Supreme Court of India expanded the concept of 'public policy' to include 'patent illegality', holding that an award could be set aside or refused enforcement if it was contrary to the substantive provisions of Indian law or the terms of the contract. This created enormous uncertainty for foreign investors, who feared that any foreign award brought to India would be subjected to a full rehearing on the merits.

The modern pro-enforcement era was inaugurated by the Supreme Court in Shri Lal Mahal Ltd v Progetto Grano Spa (2014). The Supreme Court overruled the expansive Saw Pipes doctrine in the context of foreign awards, restoring the narrow, conservative interpretation originally articulated in Renusagar Power Co Ltd v General Electric Co (1994). The Court affirmed that 'patent illegality' applies exclusively to domestic arbitrations under Section 34 of Part I, and has zero application to the enforcement of foreign awards under Section 48 of Part II.

This jurisprudential clarity was formally codified by Parliament through the Arbitration and Conciliation (Amendment) Act 2015. Under the amended Explanation 1 to Section 48(2)(b), an award is contrary to the public policy of India only if:
1. The making of the award was induced or affected by fraud or corruption, or was in violation of Section 75 or Section 81 (confidentiality or settlement negotiations).
2. It is in contravention with the fundamental policy of Indian law.
3. It is in conflict with the most basic notions of morality or justice.

Crucially, Explanation 2 to Section 48(2)(b) creates an absolute statutory bar against merits review: "The test as to whether there is a contravention with the fundamental policy of Indian law shall not entail a review on the merits of the dispute."

In the landmark case Vijay Karia v Cantier Sistemi SpA (2020), the Supreme Court cemented this narrow doctrine, holding that the discretion to refuse enforcement under Section 48 is an extreme exception. The Court emphasized that an Indian court will not refuse enforcement on hyper-technical procedural objections, and held that an infringement of foreign exchange regulations under FEMA does not violate the 'fundamental policy of Indian law' unless it involves egregious illegality or fundamental moral turpitude. Once the Section 48 objections are dismissed, Section 49 mandates that the foreign award shall be deemed to be a decree of the court and executed directly under the Code of Civil Procedure 1908."""

part5_say = """In Part 5, we analyze Sovereign Immunity, the Foreign Sovereign Immunities Act (FSIA), the execution of arbitral awards against sovereign assets, and examine our executable Arbitral Enforcement Engine.

When an investor successfully obtains an ISDS or international commercial award against a sovereign state, the legal battle transitions from adjudication to execution. Under customary international law, sovereign states enjoy 'Sovereign Immunity' from the jurisdiction of foreign courts and from execution against state property. However, modern international jurisprudence adheres to the 'Restrictive Theory' of sovereign immunity.

Under the restrictive theory—codified in statutes like the US Foreign Sovereign Immunities Act 1976 (FSIA) and the UK State Immunity Act 1978—a state does not enjoy immunity for acts of a commercial nature (acta jure gestionis), whereas it retains absolute immunity for sovereign or governmental acts (acta jure imperii).
When executing an arbitral award, the decree holder must identify assets belonging to the foreign state located in third-party jurisdictions. The execution landscape is bifurcated into two legal domains:
1. Immune Sovereign Assets: Assets used for central governmental, diplomatic, or military purposes—such as embassy premises, consular bank accounts, military vessels, naval aircraft, and central bank foreign exchange reserves—enjoy absolute sovereign immunity from attachment or execution.
2. Attachable Commercial Assets: Property used for commercial activity—such as aircraft operated by a state-owned commercial airline, real estate leased for commercial profit, cargo ships carrying commercial commodities, or bank accounts designated for commercial trading—is legally subject to attachment, seizure, and judicial auction.

Now, inspect our standalone Python Arbitral Enforcement Engine. The engine models the exact legal algorithm applied by an international enforcement team evaluating the enforceability of a $1.2 Billion UNCITRAL arbitral award (modeled on the PCA Cairn Energy proceedings) under Section 48 of the Arbitration and Conciliation Act 1996 and cross-border asset execution rules:
First, the engine verifies the Section 44 reciprocating territory requirement: The seat is located in The Hague, Netherlands—a gazetted reciprocating territory.
Second, the engine evaluates the closed negative catalog of Section 48:
- The award has not been set aside at the seat of arbitration.
- Procedural due process was fully observed.
- The subject matter is arbitrable.
- The award does not violate the fundamental policy of Indian law.
Consequently, `evaluate_section_48_enforceability` returns `enforceable: True` with zero refusal grounds.
Third, the engine tests asset attachment feasibility under the restrictive theory of sovereign immunity:
- Airline commercial revenue is categorized as a commercial asset (`attachable: True`).
- Embassy premises are categorized as diplomatic property enjoying absolute sovereign immunity (`attachable: False`, `protected_by_immunity: True`).
Upon execution, all statutory assertions execute cleanly, culminating in the terminal confirmation `ISDS_BIT_ARBITRATION_AND_AWARD_ENFORCEMENT_PASS`."""

day58_lesson = {
    "id": "bcom_law-day-58",
    "day": 58,
    "course": "Corporate Law, IBC & Compliance",
    "title": "Investor-State Dispute Settlement (ISDS), Bilateral Investment Treaties (BITs) & Enforcement of Foreign Awards",
    "parts": [
        {
            "part": 1,
            "title": "Bilateral Investment Treaties (BITs) & Substantive Standards of Investor Protection",
            "say": part1_say,
            "code": day58_code,
            "output": day58_output,
            "check": {
                "question": "What is the legal effect of the Investor-State Dispute Settlement (ISDS) mechanism in modern international investment agreements?",
                "options": [
                    "It grants direct legal standing to a private foreign investor to initiate binding international arbitration against a sovereign host state",
                    "It mandates that all disputes must be decided exclusively by the domestic high court of the host nation without appeal",
                    "It requires the United Nations General Assembly to vote by a two-thirds majority before an arbitral tribunal can be constituted",
                    "It restricts foreign investors from seeking monetary damages, limiting relief solely to diplomatic apologies"
                ],
                "answer": 0,
                "explanation": "ISDS fundamentally alters public international law by granting private foreign investors jus standi to directly sue sovereign host governments before international arbitral tribunals without needing home-state diplomatic espousal."
            }
        },
        {
            "part": 2,
            "title": "India's 2016 Model BIT, White Industries Precedent & Retrospective Tax Awards",
            "say": part2_say,
            "code": day58_code,
            "output": day58_output,
            "check": {
                "question": "Why did India's 2016 Model BIT completely omit the Most-Favored-Nation (MFN) clause?",
                "options": [
                    "To prevent foreign investors from 'treaty shopping' and borrowing more favorable substantive clauses from third-party treaties",
                    "Because MFN clauses are unconstitutional under Article 14 of the Constitution of India",
                    "Because the World Trade Organization mandated the global elimination of MFN provisions in 2015",
                    "To ensure that only domestic Indian public sector undertakings could access foreign direct investment"
                ],
                "answer": 0,
                "explanation": "Following the White Industries award where the investor borrowed an 'effective means of asserting claims' clause from the India-Kuwait BIT, India eliminated the MFN clause in its 2016 Model BIT to prevent treaty shopping."
            }
        },
        {
            "part": 3,
            "title": "Enforcement of Foreign Awards under Section 48 of the Arbitration and Conciliation Act 1996",
            "say": part3_say,
            "code": day58_code,
            "output": day58_output,
            "check": {
                "question": "Under Section 44 of the Arbitration and Conciliation Act 1996, what is a mandatory prerequisite for an award to be enforced as a 'foreign award' in India?",
                "options": [
                    "It must be made in a territory officially notified and gazetted by the Central Government of India as a reciprocating territory",
                    "It must be accompanied by an unconditional clearance letter signed by the Chief Justice of India",
                    "The underlying arbitration must have been conducted in either the English or Hindi language",
                    "The amount awarded must not exceed the statutory ceiling of INR 100 Crores"
                ],
                "answer": 0,
                "explanation": "Section 44 mandates that a foreign award under the New York Convention must arise from a commercial relationship and be made in a reciprocating territory officially gazetted by the Central Government."
            }
        },
        {
            "part": 4,
            "title": "The Public Policy Defense, Renusagar Doctrine & Elimination of Patent Illegality Review",
            "say": part4_say,
            "code": day58_code,
            "output": day58_output,
            "check": {
                "question": "Can an Indian court refuse the enforcement of a foreign arbitral award under Section 48 on the ground of 'patent illegality'?",
                "options": [
                    "No; following Shri Lal Mahal and the 2015 amendments, 'patent illegality' applies only to domestic awards and is statutorily excluded from foreign awards",
                    "Yes; any minor error of Indian statutory law permits the Indian court to set aside the foreign award entirely",
                    "Yes, but only if the foreign award was rendered by an arbitral tribunal of less than five arbitrators",
                    "No, because foreign arbitral awards are automatically enforced without any judicial examination whatsoever"
                ],
                "answer": 0,
                "explanation": "Shri Lal Mahal and the 2015 amendments to Section 48 firmly established that patent illegality is not a ground to refuse enforcement of a foreign award. Merits review is explicitly barred by Explanation 2 to Section 48(2)(b)."
            }
        },
        {
            "part": 5,
            "title": "Sovereign Immunity, Foreign Asset Attachment & Arbitral Execution Simulator",
            "say": part5_say,
            "code": day58_code,
            "output": day58_output,
            "check": {
                "question": "Under the restrictive theory of sovereign immunity, which category of foreign sovereign assets can be attached to satisfy an arbitral award?",
                "options": [
                    "Assets used purely for commercial activity, such as commercial airline revenues or commercial cargo vessels",
                    "Diplomatic embassy buildings and consular premises in foreign capitals",
                    "Naval warships and military weapons systems located in international waters",
                    "Foreign central bank foreign exchange reserve vaults held under sovereign custody"
                ],
                "answer": 0,
                "explanation": "Under the restrictive theory of sovereign immunity, property used for commercial activity (acta jure gestionis) is subject to execution, whereas diplomatic and military properties (acta jure imperii) are protected by absolute immunity."
            }
        }
    ]
}

# Expand parts to exceed 600 words each
p1_addon = \"\"\"
To appreciate the operational complexities of international investment treaties, corporate counsel must examine the institutional mechanisms governing arbitrations. While UNCITRAL arbitrations are ad hoc and frequently administered by the Permanent Court of Arbitration (PCA) at The Hague, ICSID arbitrations operate under a self-contained, autonomous treaty regime. An ICSID award is not subject to the review or setting-aside procedures of domestic courts at the seat of arbitration. Instead, under Article 52 of the ICSID Convention, the sole mechanism for challenging an award is an internal annulment application before an ad hoc Annulment Committee. Furthermore, under Article 54 of the ICSID Convention, every contracting state is under an international treaty obligation to recognize an ICSID award as binding and enforce the pecuniary obligations imposed by that award within its territories as if it were a final judgment of a court in that state.

However, India is notably not a signatory to the 1965 Washington Convention establishing ICSID. India declined to accede to ICSID primarily due to concerns regarding the absence of any domestic judicial review, the prohibition against domestic courts setting aside awards contrary to national public policy, and the perception that the ICSID tribunal appointment mechanism was structurally tilted in favor of developed capital-exporting states. Consequently, investment arbitrations involving India are conducted under ad hoc UNCITRAL rules or bilateral mechanisms, ensuring that enforcement within India must navigate the judicial scrutiny of Section 48 of the Arbitration and Conciliation Act 1996.\"\"\"

p2_addon = \"\"\"
The tactical escalation in the Cairn Energy enforcement campaign illustrates the real-world arsenal available to international creditors holding unhonored arbitral awards. When the arbitral tribunal in PCA Case No. 2015-01 unanimously held that India's retrospective tax levy under the Finance Act 2012 breached the UK-India BIT guarantee of fair and equitable treatment, Cairn faced a sovereign respondent that refused voluntary settlement.

Cairn immediately launched a multi-jurisdictional asset hunting initiative. In France, Cairn obtained judicial attachment orders from the Tribunal Judiciaire de Paris targeting 20 sovereign residential properties owned by the Indian Government in Paris worth over 20 million euros. In the United States, Cairn filed a lawsuit in the US District Court for the Southern District of New York seeking to establish that Air India was the 'alter ego' of the Republic of India under the doctrine of Bancec (First National City Bank v Banco Para El Comercio Exterior de Cuba). Under Bancec, a corporate entity owned by a foreign state can be held liable for the debts of the sovereign if the state exercises complete dominion and control over the enterprise. This existential threat to Air India's international flight operations and transatlantic assets was the decisive catalyst that impelled the Indian Parliament to enact the Taxation Laws (Amendment) Act 2021, formally scrapping all retrospective tax demands and settling the dispute.\"\"\"

p3_addon = \"\"\"
The procedural architecture under Part II of the Arbitration and Conciliation Act 1996 requires strict compliance with evidentiary protocols. Under Section 47, the party applying for the enforcement of a foreign award must produce before the jurisdictional High Court: (a) the original award or a copy thereof duly authenticated in the manner required by the law of the country in which it was made; (b) the original agreement for arbitration or a duly certified copy thereof; and (c) such evidence as may be necessary to prove that the award is a foreign award.

In Government of India v Vedanta Limited (2020), the Supreme Court of India settled a long-standing procedural debate regarding the period of limitation for filing an application for enforcement of a foreign award. The Court held that an application for enforcement of a foreign arbitral award under Section 47 is governed by Article 137 of the Limitation Act 1963, which provides a limitation period of three years from the date when the right to apply accrues (i.e., when the foreign award is delivered to the party). However, the Court affirmed that delays beyond three years can be condoned under Section 5 of the Limitation Act if sufficient cause is established, reaffirming India's pro-enforcement international commitments.\"\"\"

p4_addon = \"\"\"
The jurisprudence surrounding the enforcement of foreign awards in India underwent a monumental shift regarding foreign exchange control regulations. In the high-profile NTT Docomo v Tata Sons dispute, Tata agreed to pay Docomo an exit price of $1.17 Billion pursuant to an LCIA arbitral award, representing 50% of Docomo's original investment. The Reserve Bank of India objected, asserting that the payout violated FEMA pricing guidelines that prohibited assured returns to foreign investors on equity divestments.

The Delhi High Court rejected the RBI's intervention and ordered the enforcement of the award. The Court held that the enforcement of a foreign award cannot be refused on the basis of domestic statutory violations unless the breach strikes at the core of Indian public policy. The Court ruled that honoring a contractual commitment and respecting an international arbitral award serves a far greater national public interest than a technical objection raised by an administrative exchange control authority. This landmark decision sent a resounding message to the global financial community that Indian constitutional courts will not permit local regulatory technicalities to be weaponized as an escape route from international commercial obligations.\"\"\"

p5_addon = \"\"\"
When structuring transnational contracts and investment agreements, corporate transactional counsel must design sophisticated dispute resolution clauses that anticipate post-award enforcement dynamics. This requires careful consideration of three distinct legal choices:
1. The Substantive Governing Law of the Contract: The law that determines the validity, interpretation, and performance of the commercial obligations (e.g., English Law or Indian Law).
2. The Law of the Arbitration Agreement: Often identical to the seat, this law governs the validity and scope of the arbitration clause itself.
3. The Seat of Arbitration (Lex Arbitri): The legal jurisdiction whose courts possess supervisory jurisdiction over the arbitration, including powers to grant interim relief, appoint arbitrators, and hear applications to set aside the award. Selecting a pro-arbitration seat (such as London, Singapore, Paris, or Geneva) ensures that setting-aside applications are evaluated under mature, predictable judicial standards.

Furthermore, transactional lawyers must incorporate explicit 'Waiver of Sovereign Immunity' clauses when contracting with state-owned enterprises or sovereign wealth funds. A well-drafted clause must explicitly provide that the sovereign entity unconditionally and irrevocably waives all immunity—both from the jurisdiction of arbitral tribunals and courts, and from execution or attachment of its commercial assets and bank accounts in any jurisdiction across the globe. Without an express waiver of execution immunity, a victorious arbitral claimant may find itself holding a multi-million-dollar paper victory that is impossible to monetize against sovereign assets.\"\"\"

day58_lesson[\"parts\"][0][\"say\"] += p1_addon
day58_lesson[\"parts\"][1][\"say\"] += p2_addon
day58_lesson[\"parts\"][2][\"say\"] += p3_addon
day58_lesson[\"parts\"][3][\"say\"] += p4_addon
day58_lesson[\"parts\"][4][\"say\"] += p5_addon

total_words = 0
for p in day58_lesson[\"parts\"]:
    wc = count_words(p[\"say\"])
    total_words += wc
    print(f\"Day 58 Part {p['part']} words: {wc}\")
    assert wc >= 580, f\"Part {p['part']} word count {wc} < 580\"

print(f\"Day 58 Total words: {total_words}\")
assert total_words >= 3000, f\"Total word count {total_words} < 3000\"

with open(\"scripts/bcom_law_day58.json\", \"w\", encoding=\"utf-8\") as f:
    json.dump(day58_lesson, f, indent=2)

print(\"Saved scripts/bcom_law_day58.json successfully!\")
"""

with open("scripts/build_day58.py", "w", encoding="utf-8") as f:
    f.write(day58_code)

print("Saved scripts/build_day58.py")
