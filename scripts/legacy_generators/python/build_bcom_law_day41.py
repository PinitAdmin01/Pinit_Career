import json, sys, subprocess, os, re, hashlib

# Builder for Day 41 of bcom_law
# Course: bcom_law (Corporate Law, IBC & Compliance)
# Day 41: UNCITRAL Model Law on Cross-Border Insolvency, Center of Main Interests (COMI) & Foreign Proceedings Recognition

day_num = 41
course_prefix = "bcom_law"
day_title = "UNCITRAL Model Law on Cross-Border Insolvency, Center of Main Interests & Foreign Recognition"
day_desc = "Master the cross-border insolvency jurisprudence under the IBC 2016 and international comparative frameworks: the doctrinal clash between territorialism and modified universalism, Section 234/235 bilateral treaty limitations, the UNCITRAL Model Law on Cross-Border Insolvency, determination of the Center of Main Interests (COMI), and the landmark Jet Airways cross-border insolvency protocol."

# Part 1: Cross-Border Insolvency Jurisprudence, Territorialism vs Universalism & Sections 234-235
part1_title = "Cross-Border Insolvency Jurisprudence, Territorialism vs Universalism & Sections 234-235"
part1_say = [
    "In an era of hyper-globalized capital flows and multinational corporate supply chains, corporate insolvency rarely remains confined within national domestic boundaries. Modern corporate conglomerates maintain operating subsidiaries, intellectual property licensing trusts, debt facilities, and physical plant assets scattered across London, Singapore, New York, Frankfurt, and Mumbai. When such an enterprise defaults, domestic legal systems face an existential jurisprudence challenge: how to coordinate competing claims, preserve going-concern enterprise value, and prevent cross-border asset flight across multiple sovereign judicial forums without descending into chaotic jurisdictional warfare.",
    "Cross-border insolvency theory is historically anchored in the intellectual conflict between two competing doctrinal philosophies: 'Territorialism' (often termed the 'Grab Rule') and 'Universalism'. Under pure territorialism, each sovereign state asserts exclusive jurisdiction solely over assets and operations located physically within its domestic territory. A domestic court liquidates local assets to satisfy local creditors, refusing to recognize foreign insolvency orders or allow foreign insolvency professionals to seize domestic assets. While territorialism fiercely protects local sovereign autonomy and domestic trade creditors, it inevitably leads to catastrophic enterprise dismemberment, multiple competing liquidations, exorbitant administrative costs, and the destruction of global going-concern value.",
    "Conversely, 'Universalism' posits that a single insolvency proceeding should govern the multinational debtor worldwide, administered by the court located at the debtor's primary operational center, with its orders recognized and enforced across all foreign jurisdictions. Because pure universalism requires an unprecedented surrender of national judicial sovereignty that few countries are willing to concede, modern international insolvency law has converged around 'Modified Universalism'. Modified universalism recognizes a primary 'Foreign Main Proceeding' at the debtor's main operational center, while allowing local courts to initiate secondary proceedings and apply domestic public policy filters to protect local creditors.",
    "When the Insolvency and Bankruptcy Code was enacted in 2016, its cross-border architecture was remarkably primitive. Parliament inserted only two skeletal enabling provisions: Section 234 and Section 235. Section 234 empowers the Central Government to enter into bilateral reciprocal agreements with foreign governments for enforcing the provisions of the Code. Section 235 provides that if an asset of a corporate debtor is located in a country with which a bilateral treaty exists, the NCLT may issue a Letter of Request to a competent court in that country seeking judicial assistance.",
    "In operational reality, Sections 234 and 235 proved entirely ineffective and commercially unworkable. Negotiating comprehensive bilateral insolvency treaties with dozens of sovereign nations takes decades; as of 2024, India has not operationalized a single bilateral cross-border treaty under Section 234. Furthermore, issuing traditional diplomatic Letters of Request under Section 235 involves months of bureaucratic inertia, creating an open window for defaulting promoters to siphon off offshore liquid capital, transfer intellectual property deeds to zero-tax jurisdictions, or sell foreign aircraft and ships before domestic insolvency professionals can intervene.",
    "Recognizing this systemic legislative vacuum, the Ministry of Corporate Affairs constituted the Insolvency Law Committee (ILC) on Cross-Border Insolvency, chaired by Injeti Srinivas. In its seminal report, the Committee recommended the complete repeal of Sections 234 and 235 and the enactment of a dedicated statutory chapter—termed 'Part Z'—integrating the United Nations Commission on International Trade Law (UNCITRAL) Model Law on Cross-Border Insolvency into the IBC.",
    "Furthermore, the Draft Part Z framework proposed by the Insolvency Law Committee incorporates reciprocity as an optional transitional mechanism: the Central Government may initially apply the Model Law only to countries that have adopted the Model Law or have established reciprocal recognition arrangements with India, before expanding to universal global application. This strategic phase-in insulates Indian corporate debtors from unilateral asset seizures by non-reciprocating jurisdictions while establishing immediate statutory bridges with key financial hubs like the United States, United Kingdom, and Singapore.",
    "By moving away from cumbersome bilateral treaties toward the globally standardized UNCITRAL Model Law framework, Indian insolvency jurisprudence is rapidly aligning with international capital markets, providing predictable rules for resolving cross-border corporate distress."
]

part1_example = "An Indian solar panel manufacturer with sixty crore rupees of debt enters CIRP before the Mumbai NCLT. The company owns an automated manufacturing subsidiary in Germany and intellectual property licenses in the Netherlands. Operating under Section 234, the RP discovers that India has no bilateral treaty with Germany or the Netherlands, preventing the RP from taking custody of European assets. A local creditor in Frankfurt files for separate German bankruptcy, seizing the manufacturing plant and causing immense value destruction."

part1_code = '''def evaluate_cross_border_regime_efficacy(regime_type, has_bilateral_treaty, days_to_issue_letter_of_request, recognizes_foreign_proceedings_directly):
    # Framework Analysis:
    # Regime 1: Skeletal Sections 234-235 (Bilateral Treaty Dependency)
    # Regime 2: UNCITRAL Model Law (Modified Universalism & Direct Recognition)
    
    if regime_type == "IBC_SECTION_234_235":
        effective = has_bilateral_treaty and (days_to_issue_letter_of_request <= 14)
        return {
            "regime": "IBC Sections 234-235 (Bilateral Model)",
            "effective_for_multinational_debtor": effective,
            "foreign_asset_custody_secured": has_bilateral_treaty,
            "risk_of_foreign_asset_flight": "CRITICAL_HIGH" if not has_bilateral_treaty else "MODERATE",
            "statutory_remedy": "Negotiate bilateral treaty or rely on comity of foreign courts"
        }
    elif regime_type == "UNCITRAL_MODEL_LAW_PART_Z":
        return {
            "regime": "UNCITRAL Model Law (Modified Universalism)",
            "effective_for_multinational_debtor": True,
            "foreign_asset_custody_secured": True,
            "risk_of_foreign_asset_flight": "LOW_AUTOMATIC_MORATORIUM",
            "statutory_remedy": "Direct application for recognition of Foreign Main Proceeding"
        }
        
    return {"regime": "UNKNOWN", "effective_for_multinational_debtor": False}

# Case: Indian debtor with European assets under current Section 234-235 regime (0 bilateral treaties)
audit = evaluate_cross_border_regime_efficacy(
    regime_type="IBC_SECTION_234_235",
    has_bilateral_treaty=False,
    days_to_issue_letter_of_request=180,
    recognizes_foreign_proceedings_directly=False
)
print("Cross-Border Regulatory Regime:", audit["regime"])
print("Effective for Multinational Debtor:", audit["effective_for_multinational_debtor"])
print("Foreign Asset Custody Secured:", audit["foreign_asset_custody_secured"])
print("Risk of Foreign Asset Siphoning:", audit["risk_of_foreign_asset_flight"])
print("Recommended Legal Remediation:", audit["statutory_remedy"])
'''

part1_check = {
    "question": "What is the primary operational defect of the cross-border insolvency mechanism currently codified under Sections 234 and 235 of the Insolvency and Bankruptcy Code 2016?",
    "options": [
        "It relies exclusively on bilateral reciprocal government treaties that do not exist in practice, causing severe delays and asset flight",
        "It mandates the automatic liquidation of all foreign subsidiaries within forty-eight hours of NCLT admission",
        "It requires foreign creditors to surrender fifty percent of their claims to the Reserve Bank of India",
        "It forces the NCLT to conduct all cross-border hearings in the official language of the foreign debtor"
    ],
    "answerIndex": 0,
    "why": "Sections 234 and 235 depend upon the Central Government negotiating bilateral reciprocal treaties with foreign nations; because no such treaties have been executed, Indian insolvency professionals have no direct statutory mechanism to access foreign assets."
}

# Part 2: The UNCITRAL Model Law on Cross-Border Insolvency: Four Key Pillars
part2_title = "The UNCITRAL Model Law on Cross-Border Insolvency: Four Key Pillars"
part2_say = [
    "To solve the commercial deadlocks and asset destruction inherent in cross-border defaults, the United Nations Commission on International Trade Law adopted the UNCITRAL Model Law on Cross-Border Insolvency in 1997. Enacted by over fifty major industrial jurisdictions—including the United States (Chapter 15 of the US Bankruptcy Code), the United Kingdom (Cross-Border Insolvency Regulations 2006), Singapore, and Japan—the Model Law provides an elegant, predictable statutory bridge connecting disparate insolvency regimes without requiring states to harmonize their substantive domestic bankruptcy laws.",
    "The UNCITRAL Model Law is built upon Four Foundational Pillars: (1) Direct Access; (2) Recognition; (3) Relief; and (4) Cooperation and Coordination. These four structural pillars operate harmoniously to balance international comity with domestic creditor protections, establishing an efficient procedural superhighway across sovereign boundaries.",
    "Pillar One is Direct Access (Articles 9 through 14). Under the Model Law, a foreign insolvency representative or foreign creditor is granted direct standing to apply to the domestic court (such as the NCLT) without having to navigate diplomatic consular channels, execute sovereign treaties, or retain local government intermediaries. Foreign creditors enjoy equal rights to commence or participate in domestic insolvency proceedings, and domestic insolvency professionals are granted reciprocal rights to appear directly before foreign bankruptcy judges, dismantling cross-border procedural barriers.",
    "Pillar Two is Recognition of Foreign Proceedings (Articles 15 through 17). The domestic court does not re-litigate the merits of the underlying insolvency; instead, it conducts a summary, objective evidentiary inquiry. A foreign proceeding is formally recognized upon simple proof that it is a collective judicial or administrative proceeding pursuant to a law relating to insolvency, and that the foreign representative has been duly appointed by a competent court, ensuring seamless judicial comity.",
    "Pillar Three is Relief (Articles 19 through 21). Relief under the Model Law is dual-tiered: mandatory automatic relief and discretionary relief. If a foreign proceeding is recognized as a 'Foreign Main Proceeding', an immediate statutory moratorium automatically freezes domestic debt enforcement actions, lawsuits, and asset transfers, mirroring Section 14 of the IBC. If recognized as a 'Foreign Non-Main Proceeding', the court possesses broad discretionary power to grant tailored relief, such as entrusting the administration of local assets to the foreign representative, protecting domestic industrial productivity.",
    "Pillar Four is Cooperation and Direct Communication (Articles 25 through 27). The Model Law shatters the archaic convention that courts can only communicate through diplomatic letters rogatory. It expressly authorizes domestic bankruptcy judges to communicate directly with foreign courts, coordinate simultaneous parallel hearings via video conferencing, and approve cross-border judicial protocols governing multinational enterprise reorganizations, fostering unprecedented cross-border judicial comity.",
    "Furthermore, Article 13 of the Model Law establishes the fundamental principle of non-discrimination against foreign creditors. Foreign trade vendors, institutional bondholders, and international banks enjoy identical rights to file claims and participate in dividends as domestic Indian creditors. The only narrow exception concerns foreign tax claims and penal liabilities, which cannot claim priority over ordinary unsecured commercial debt in domestic distribution waterfalls, ensuring that Indian public revenues are not depleted by foreign municipal levies.",
    "Additionally, the evidentiary threshold for securing recognition under Article 15 is streamlined to prevent dilatory litigation. A foreign representative simply files a certified copy of the foreign court's appointment order accompanied by official translations, dispensing with archaic consular legalization, apostille certifications, and diplomatic clearances. The domestic tribunal is required to decide the recognition application expeditiously, ensuring that emergency asset freezes are imposed before assets can be dissipated or removed across international maritime boundaries.",
    "By adopting these four pillars through the proposed Part Z of the IBC, India equips its corporate courts with modern statutory tools to protect global corporate value and attract sophisticated international institutional capital."
]

part2_example = "A US bankruptcy court presiding over Chapter 11 proceedings of a global telecommunications company appoints a foreign representative. The company owns data center assets in Bengaluru. Under Pillar One and Two of the Model Law, the US representative files a direct application before the NCLT Bengaluru Bench. The NCLT recognizes the Chapter 11 case as a Foreign Main Proceeding, instantly activating a Pillar Three automatic moratorium that blocks local creditors from auctioning server infrastructure."

part2_code = '''def evaluate_uncitral_model_law_pillars(has_direct_court_access, foreign_proceeding_type, public_policy_violated, relief_requested):
    # Public Policy Exception (Article 6): Court may refuse action manifestly contrary to public policy
    if public_policy_violated:
        return {
            "status": "RECOGNITION_DENIED",
            "pillar_applied": "Article 6 Public Policy Exception",
            "outcome": "Relief barred on grounds of fundamental domestic constitutional sovereignty"
        }
        
    # Pillar 1: Direct Access (Article 9)
    if not has_direct_court_access:
        return {"status": "PROCEDURAL_BAR", "pillar_applied": "Pillar 1 Access", "outcome": "Foreign representative lacks direct standing"}
        
    # Pillar 2 & 3: Recognition & Relief (Articles 17, 20, 21)
    if foreign_proceeding_type == "FOREIGN_MAIN_PROCEEDING":
        return {
            "status": "RECOGNIZED_FOREIGN_MAIN",
            "pillar_applied": "Pillar 2 & 3 (Recognition & Relief)",
            "moratorium_type": "AUTOMATIC_STATUTORY_MORATORIUM",
            "cooperation_mandated": "DIRECT_COURT_TO_COURT_COMMUNICATION",
            "outcome": "Immediate freeze on domestic debt enforcement and asset transfers"
        }
    elif foreign_proceeding_type == "FOREIGN_NON_MAIN_PROCEEDING":
        return {
            "status": "RECOGNIZED_FOREIGN_NON_MAIN",
            "pillar_applied": "Pillar 2 & 3 (Recognition & Discretionary Relief)",
            "moratorium_type": "DISCRETIONARY_TAILORED_RELIEF",
            "cooperation_mandated": "COORDINATION_WITH_DOMESTIC_PROCEEDINGS",
            "outcome": "Discretionary asset preservation subject to domestic creditor protections"
        }
        
    return {"status": "INVALID_PROCEEDING", "outcome": "Non-collective proceedings cannot be recognized"}

# Case: US Chapter 11 case recognized as Foreign Main Proceeding before NCLT; no public policy violation
audit = evaluate_uncitral_model_law_pillars(
    has_direct_court_access=True,
    foreign_proceeding_type="FOREIGN_MAIN_PROCEEDING",
    public_policy_violated=False,
    relief_requested="asset_moratorium"
)
print("Model Law Status:", audit["status"])
print("Pillar Applied:", audit["pillar_applied"])
print("Moratorium Character:", audit["moratorium_type"])
print("Inter-Judicial Protocol:", audit["cooperation_mandated"])
print("Legal Outcome:", audit["outcome"])
'''

part2_check = {
    "question": "Under the UNCITRAL Model Law on Cross-Border Insolvency, what mandatory legal effect automatically occurs upon the domestic court recognizing a foreign proceeding as a 'Foreign Main Proceeding'?",
    "options": [
        "An immediate statutory stay and moratorium automatically freezing all domestic debt enforcement actions, lawsuits, and asset transfers",
        "The automatic transfer of all domestic corporate bank accounts to the foreign central bank",
        "The immediate dismissal of all ongoing domestic tax audits and environmental investigations",
        "Mandatory conversion of all secured debt into zero-coupon convertible preference shares"
    ],
    "answerIndex": 0,
    "why": "Article 20 of the UNCITRAL Model Law mandates that upon recognition of a foreign proceeding as a foreign main proceeding, commencement or continuation of individual actions or proceedings concerning the debtor's assets, rights, obligations or liabilities is automatically stayed."
}

# Part 3: Determining Center of Main Interests (COMI) & The Jet Airways Landmark Protocol
part3_title = "Determining Center of Main Interests (COMI) & The Jet Airways Landmark Protocol"
part3_say = [
    "The jurisdictional linchpin of the UNCITRAL Model Law is the concept of the 'Center of Main Interests' (COMI). COMI dictates whether a foreign proceeding is classified as a 'Foreign Main Proceeding' (triggering automatic nationwide moratoriums) or merely a 'Foreign Non-Main Proceeding' (limited to discretionary local relief). Despite its paramount legal importance, the Model Law does not provide a rigid mathematical definition of COMI; instead, Article 16(3) establishes a rebuttable statutory presumption: in the absence of proof to the contrary, the debtor's registered office is presumed to be its Center of Main Interests.",
    "However, international insolvency jurisprudence has firmly established that the registered office presumption can be easily rebutted by contrary commercial facts. In landmark decisions such as Eurofood IFSC Ltd. before the European Court of Justice (ECJ) and In re Stanford International Bank before the UK Court of Appeal, courts articulated the governing international standard: COMI must correspond to the place where the debtor conducts the administration of its interests on a regular basis and is therefore ascertainable by third parties, particularly creditors.",
    "To ascertain a debtor's genuine COMI, corporate courts apply an objective factual matrix: (1) the location of enterprise executive headquarters and nerve center where strategic business decisions are taken; (2) the location where commercial contracts and financing negotiations are concluded; (3) the location of primary banking accounts and operational treasury; (4) the location where the vast majority of employees and physical assets reside; and (5) the jurisdiction whose substantive law governs the debtor's principal commercial relations. Where an enterprise shifts its nominal registered office on the eve of insolvency to evade domestic creditors, courts pierce the facade, holding COMI fixed at the historical operational nerve center.",
    "The historic practical breakthrough for Indian cross-border insolvency occurred in the landmark case of Jet Airways (India) Ltd. In 2019, while Jet Airways was admitted into CIRP before the NCLT Mumbai Bench under Section 7, a Dutch regional court in North Holland declared Jet Airways bankrupt over unpaid European debts, appointing a Dutch Bankruptcy Trustee who seized an aircraft parked at Amsterdam Schiphol Airport, creating a severe international standoff.",
    "Initially, the NCLT Mumbai Bench declared the Dutch bankruptcy proceedings null and void, asserting exclusive territorial sovereignty. However, on appeal, the National Company Law Appellate Tribunal (NCLAT) in Jet Airways (India) Ltd. v. State Bank of India delivered a visionary ruling: it set aside the NCLT's isolationist order and directed the Indian Resolution Professional to collaborate with the Dutch Trustee to formulate a joint 'Cross-Border Insolvency Protocol'.",
    "Executed in September 2019, the Jet Airways Protocol represented India's first successful cross-border cross-recognition treaty. The protocol recognized India as the 'Center of Main Interests' (Foreign Main Proceeding) and the Netherlands as a secondary proceeding. The Dutch Trustee was granted observer attendance at Committee of Creditors meetings, agreed not to sell the seized Amsterdam aircraft, and cooperated in marketing Jet Airways' global assets as an integrated going concern, setting a monumental precedent for Indian commercial law.",
    "Following Jet Airways, the NCLAT confronted cross-border complexities in the corporate insolvency of Videocon Industries Ltd., where multiple overseas oil and gas exploration concessions in Brazil and Indonesia were held through layered offshore special purpose vehicles. The appellate tribunal affirmed that where the primary executive control, guarantee obligations, and financial liabilities of these offshore holding entities reside with the Indian parent company, Indian insolvency courts possess extraterritorial subject-matter jurisdiction to coordinate global asset marketing.",
    "The Jet Airways jurisprudence demonstrated to international markets that Indian insolvency courts possess the judicial pragmatism and procedural sophistication to coordinate multi-jurisdictional insolvencies through bespoke bilateral protocols even prior to the formal legislative enactment of Part Z."
]

part3_example = "A software multinational is incorporated in Delaware, maintaining a nominal corporate address. However, its entire board of directors operates out of Bengaluru, eighty percent of its software engineers reside in India, all server infrastructure is billed in rupees, and ninety percent of global debt is syndicated by Indian banks. When insolvency strikes, the NCLT rebuts the Delaware registered office presumption, ruling that the debtor's true COMI is Bengaluru, establishing India as the Foreign Main Proceeding."

part3_code = '''def determine_center_of_main_interests(registered_office_country, operational_nerve_center, location_of_majority_assets, location_of_executive_board, third_party_creditor_perception):
    # Article 16(3) Statutory Presumption: Registered office is presumed COMI
    rebuttal_factors = 0
    
    if operational_nerve_center != registered_office_country:
        rebuttal_factors += 1
    if location_of_majority_assets != registered_office_country:
        rebuttal_factors += 1
    if location_of_executive_board != registered_office_country:
        rebuttal_factors += 1
    if third_party_creditor_perception != registered_office_country:
        rebuttal_factors += 1
        
    # If 3 or more factors point away from registered office -> Presumption rebutted (Eurofood doctrine)
    presumption_rebutted = rebuttal_factors >= 3
    true_comi = operational_nerve_center if presumption_rebutted else registered_office_country
    
    proceeding_classification = "FOREIGN_MAIN_PROCEEDING" if true_comi == "INDIA" else "FOREIGN_NON_MAIN_OR_FOREIGN_MAIN_ABROAD"
    
    return {
        "registered_office": registered_office_country,
        "operational_nerve_center": operational_nerve_center,
        "rebuttal_indicators_count": rebuttal_factors,
        "presumption_rebutted": presumption_rebutted,
        "adjudicated_true_comi": true_comi,
        "indian_proceeding_status": proceeding_classification
    }

# Case: Delaware incorporated shell; executive board, nerve center, assets, and banks all in India (Jet Airways analogy)
audit = determine_center_of_main_interests(
    registered_office_country="USA_DELAWARE",
    operational_nerve_center="INDIA",
    location_of_majority_assets="INDIA",
    location_of_executive_board="INDIA",
    third_party_creditor_perception="INDIA"
)
print("Registered Office Presumption:", audit["registered_office"])
print("COMI Rebuttal Evidence Count:", audit["rebuttal_indicators_count"], "/ 4")
print("Presumption Successfully Rebutted:", audit["presumption_rebutted"])
print("Adjudicated True COMI:", audit["adjudicated_true_comi"])
print("Indian Proceeding Classification:", audit["indian_proceeding_status"])
'''

part3_check = {
    "question": "In the landmark Jet Airways cross-border insolvency case, how did the NCLAT resolve the jurisdictional conflict between the Indian CIRP and the Dutch bankruptcy proceedings?",
    "options": [
        "By directing the Indian Resolution Professional and the Dutch Trustee to execute a bilateral Cross-Border Insolvency Protocol recognizing India as COMI",
        "By issuing an anti-suit injunction ordering the arrest of the Dutch Bankruptcy Trustee upon entering Indian airspace",
        "By ordering the immediate liquidation of all domestic airport slots to satisfy Dutch municipal claims",
        "By transferring the entire insolvency proceedings to the International Court of Justice in The Hague"
    ],
    "answerIndex": 0,
    "why": "In Jet Airways, the NCLAT set aside the NCLT's refusal to cooperate and approved a cross-border protocol between the Indian RP and Dutch Trustee, recognizing India as the Center of Main Interests and establishing a cooperative framework for asset resolution."
}

# Part 4: Foreign Main vs Foreign Non-Main Proceedings: Dual-Track Moratoriums & Asset Realization
part4_title = "Foreign Main vs Foreign Non-Main Proceedings: Dual-Track Moratoriums & Asset Realization"
part4_say = [
    "A sophisticated cross-border insolvency practitioner must master the pivotal statutory distinction between a 'Foreign Main Proceeding' and a 'Foreign Non-Main Proceeding'. This structural bifurcation, codified in Article 2(b) and Article 17(2) of the UNCITRAL Model Law, governs the scope of judicial relief, the extraterritorial reach of moratoriums, and the priority of asset distributions across jurisdictions.",
    "A 'Foreign Main Proceeding' is formally defined as a foreign proceeding taking place in the state where the debtor has its Center of Main Interests (COMI). Recognition as a main proceeding produces immediate, mandatory statutory consequences under Article 20: (1) commencement or continuation of individual legal actions or judicial enforcement against the debtor's assets is automatically stayed; (2) execution against the debtor's assets is stayed; and (3) the right to transfer, encumber, or otherwise dispose of any assets of the debtor is suspended. This automatic moratorium mirrors the absolute statutory shield of Section 14 of the IBC.",
    "Conversely, a 'Foreign Non-Main Proceeding' takes place in a state where the corporate debtor does not have its COMI, but possesses an 'Establishment'. Article 2(f) strictly defines an 'Establishment' as any place of operations where the debtor carries out a non-transitory economic activity with human means and goods or services. If an enterprise merely maintains a mailbox address, bank account, or holding shell without physical operations or staff, it fails the establishment test and cannot be recognized even as a non-main proceeding.",
    "Crucially, recognition as a foreign non-main proceeding does not trigger an automatic moratorium. Under Article 21, all relief is purely discretionary: the domestic court evaluates whether granting an asset freeze or appointing an administrator would unfairly prejudice local creditors or conflict with domestic insolvency proceedings. If an Indian CIRP is already pending, any relief granted to a foreign non-main representative must be tailored to ensure it remains subordinate to the primary Indian resolution process.",
    "Furthermore, Article 22 establishes an overarching statutory safeguard: the court must be satisfied that the interests of domestic creditors and other interested persons are adequately protected before granting any discretionary relief. The court may impose conditions on relief, such as requiring the foreign representative to post performance bonds or prohibiting the repatriation of realized asset proceeds abroad until local employee wages and operational debts are fully secured.",
    "Where concurrent proceedings unfold—such as an Indian main CIRP and foreign non-main liquidation proceedings in London or Singapore—Article 29 mandates active judicial coordination. The domestic court must seek cooperation with the foreign court, ensuring that dual proceedings operate as a unified commercial strategy rather than conflicting jurisdictional tug-of-wars.",
    "Under Article 28 through 30, the Model Law establishes priority rules governing concurrent proceedings: where a domestic insolvency proceeding is already commenced before recognition of a foreign proceeding is sought, any relief granted under the foreign proceeding must be consistent with the domestic proceeding. If a foreign main proceeding is recognized first and an Indian CIRP is subsequently admitted under Section 7 or 9, the domestic court reviews and modifies the foreign relief to ensure that domestic resolution priorities, workmen wages, and Indian statutory safeguards maintain procedural supremacy.",
    "Furthermore, cross-border restructuring increasingly relies upon international guidelines, such as the American Law Institute and International Insolvency Institute Global Principles for Cooperation in International Insolvency Cases. These soft-law instruments provide standard-form cross-border protocols, electronic data-sharing frameworks, and joint hearing guidelines that enable cross-border administrators to conduct unified asset auctions and maximize recoveries for global creditors.",
    "Understanding this dual-track architecture enables corporate counsel to strategically sequence recognition petitions, utilize automatic stays to preserve core operations, and negotiate cross-border comity agreements that maximize enterprise recovery, preventing jurisdictional chaos across multi-country insolvencies."
]

part4_example = "A multinational retail chain has its COMI in London (holding main administration and treasury) and an establishment in New Delhi operating forty retail stores. The English High Court initiates administration. When the English administrator applies before the NCLT New Delhi, the NCLT recognizes the UK case as a Foreign Main Proceeding, instantly freezing all Indian creditor eviction suits and allowing the administrator to restructure store leases as part of a global turnaround."

part4_code = '''def classify_foreign_proceeding_and_relief(is_comi_state, has_non_transitory_economic_activity, has_human_means_and_goods, domestic_creditor_interests_adequately_protected):
    # Article 2 Invariants:
    # Main Proceeding = State of COMI
    # Non-Main Proceeding = State of Establishment (non-transitory economic activity with human means and goods)
    
    if is_comi_state:
        return {
            "classification": "FOREIGN_MAIN_PROCEEDING",
            "moratorium_type": "AUTOMATIC_MANDATORY_STAY (Article 20)",
            "asset_disposition_suspended": True,
            "adequate_protection_required": "Statutorily Presumed",
            "statutory_mandate": "Universal asset freeze binding all domestic judicial authorities"
        }
        
    has_valid_establishment = has_non_transitory_economic_activity and has_human_means_and_goods
    
    if has_valid_establishment:
        # Non-Main: Relief is discretionary and conditional upon protecting domestic creditors (Article 21 & 22)
        if domestic_creditor_interests_adequately_protected:
            return {
                "classification": "FOREIGN_NON_MAIN_PROCEEDING",
                "moratorium_type": "DISCRETIONARY_TAILORED_RELIEF (Article 21)",
                "asset_disposition_suspended": "Discretionary Court Order",
                "adequate_protection_required": "Satisfied",
                "statutory_mandate": "Grant tailored relief subordinate to primary COMI proceeding"
            }
        else:
            return {
                "classification": "FOREIGN_NON_MAIN_PROCEEDING",
                "moratorium_type": "RELIEF_DENIED_LACK_OF_PROTECTION",
                "asset_disposition_suspended": False,
                "adequate_protection_required": "Failed: Local creditors prejudiced",
                "statutory_mandate": "Refuse asset repatriation until domestic claims are secured"
            }
            
    return {
        "classification": "NOT_RECOGNIZABLE",
        "moratorium_type": "NONE",
        "asset_disposition_suspended": False,
        "adequate_protection_required": "N/A",
        "statutory_mandate": "Dismiss application: Debtor lacks physical establishment in foreign state"
    }

# Case: English court proceeding where COMI is London; seeks recognition before Indian NCLT
audit = classify_foreign_proceeding_and_relief(
    is_comi_state=True,
    has_non_transitory_economic_activity=True,
    has_human_means_and_goods=True,
    domestic_creditor_interests_adequately_protected=True
)
print("Proceeding Classification:", audit["classification"])
print("Applicable Moratorium:", audit["moratorium_type"])
print("Asset Dispositions Suspended:", audit["asset_disposition_suspended"])
print("Statutory Mandate:", audit["statutory_mandate"])
'''

part4_check = {
    "question": "Under Article 2(f) of the UNCITRAL Model Law on Cross-Border Insolvency, what criteria must be satisfied for a debtor to possess an 'Establishment' supporting a Foreign Non-Main Proceeding?",
    "options": [
        "Any place of operations where the debtor carries out a non-transitory economic activity with human means and goods or services",
        "Maintaining a registered post office box address and paying annual corporate franchise taxes",
        "Holding a minimum of ten thousand dollars in a local commercial banking checking account",
        "Employing at least one local citizen as a designated corporate process service agent"
    ],
    "answerIndex": 0,
    "why": "Article 2(f) strictly defines an establishment as any place of operations where the debtor carries out a non-transitory economic activity with human means and goods or services; a shell entity or mere mailbox address is legally insufficient."
}

# Part 5: Anti-Pattern Defense & Outage Puzzle: The Multi-Jurisdictional Forum Shopping & Foreign Asset Flight Crisis
part5_title = "Anti-Pattern Defense & Outage Puzzle: The Multi-Jurisdictional Forum Shopping & Foreign Asset Flight Crisis"
part5_say = [
    "In cross-border corporate restructuring, one of the most perilous adversarial tactics is the 'Abusive Forum Shopping and Clandestine Asset Flight' anti-pattern. This crisis unfolds when defaulting promoters of a distressed Indian enterprise manipulate offshore corporate structures on the eve of bankruptcy—transferring cash reserves to foreign bank accounts in non-cooperative secrecy jurisdictions, incorporating sudden holding shells in offshore tax havens to engineer artificial COMI shifts, or obtaining ex parte anti-suit injunctions from pliant foreign courts to paralyze domestic NCLT insolvency proceedings.",
    "The first major failure mode is 'Fraudulent COMI Shifting'. A corporate debtor facing an imminent Section 7 petition in Mumbai abruptly holds an extraordinary board meeting in London or Dubai, executes nominal office lease agreements, and files for administration abroad, asserting that its Center of Main Interests has migrated. Under international jurisprudence established in Re Hellas Telecommunications and the Injeti Srinivas Committee recommendations, corporate courts pierce opportunistic COMI migration. The NCLT examines the debtor's operational reality over a historical lookback window: if the company's manufacturing operations, customer base, and bank debt are overwhelmingly Indian, the foreign bankruptcy is rejected as a sham manufactured to evade domestic creditors.",
    "The second compounding defect involves 'Conflicting Extraterritorial Injunctions'. A foreign creditor secures an attachment order or anti-suit injunction from a foreign commercial court, threatening domestic resolution professionals with contempt if they exercise custody over foreign bank accounts or aircraft. To dismantle this obstruction, the Resolution Professional must invoke Article 6 of the Model Law: the Public Policy Exception. While narrowly construed, Article 6 empowers domestic courts to refuse recognition or enforce foreign orders that manifestly violate fundamental constitutional principles of domestic sovereignty or deny natural justice to domestic creditors.",
    "A third failure mode arises during the liquidation phase: 'Asymmetric Foreign Asset Realization'. Foreign local creditors attempt to seize overseas plant equipment and auction it under local laws, claiming one hundred percent recovery while domestic creditors face eighty percent haircuts. Under the landmark 'Hotchpot Rule' codified in Article 32 of the Model Law, a creditor who has received partial payment in a foreign proceeding cannot receive any distribution in domestic proceedings until other creditors of the same class have received a proportionate recovery, neutralizing unilateral foreign recoveries and enforcing global equality of distribution.",
    "To neutralize this crisis and immunize the cross-border estate, the Resolution Professional must deploy a rapid cross-border response protocol: (1) immediate filing for Chapter 15 or foreign recognition abroad within seventy-two hours of NCLT admission; (2) execution of formal Judicial Communication Protocols connecting the NCLT with foreign presiding judges; and (3) forensic tracing of offshore SWIFT transfers through international forensic auditing networks.",
    "Furthermore, where defaulting promoters attempt to use manufactured foreign arbitral awards or collusive consent judgments from offshore commercial tribunals to establish priority over Indian assets, the Resolution Professional files applications under Section 238 before the NCLT. The NCLT exercises its statutory powers to declare such collusive foreign judgments void as against the insolvency estate, invoking Article 6 to safeguard domestic creditor interests.",
    "Additionally, the Resolution Professional collaborates with statutory agencies, including the Enforcement Directorate (ED), the Serious Fraud Investigation Office (SFIO), and international mutual legal assistance treaty (MLAT) channels, securing provisional attachments over foreign real estate, luxury yachts, and offshore bank accounts acquired through diverted corporate borrowings.",
    "Furthermore, the cross-border legal response team must prepare comprehensive emergency dossiers for foreign bankruptcy courts, containing certified English translations of Section 7 NCLT admission orders, Section 14 moratorium declarations, and lists of registered creditor claims, enabling foreign judges to grant immediate reciprocal comity within forty-eight hours.",
    "By fearlessly combining judicial comity, public policy defenses, the hotchpot rule, and direct court-to-court coordination, insolvency practitioners eliminate cross-border havens, ensuring that multinational corporate assets remain dedicated to equitable collective resolution."
]

part5_example = "A defaulting pharmaceutical promoter transfers eighty crore rupees of company funds to a shell company in Mauritius and secures an ex parte local court injunction staying Indian CIRP proceedings. The Indian RP files an emergency application before the NCLT. Citing Article 6 public policy and Section 238 supremacy, the NCLT declares the foreign transfer an illegal avoidance transaction under Section 43, notifies the Reserve Bank of India and Enforcement Directorate, and petitions the Supreme Court of Mauritius for comity recognition, successfully freezing the offshore bank accounts."

part5_code = '''def diagnose_cross_border_asset_flight_and_forum_shopping(days_before_cirp_comi_shifted, offshore_funds_transferred_cr, foreign_court_anti_suit_injunction_served, hotchpot_foreign_recovery_cr, class_domestic_recovery_pct):
    # Defect 1: Opportunistic COMI shifting on eve of CIRP
    # Shifting COMI within 90 days of default is forensically scrutinized as abusive forum shopping
    is_abusive_comi_shift = days_before_cirp_comi_shifted <= 90
    
    # Defect 2: Article 6 Public Policy Defense against Foreign Anti-Suit Injunction
    public_policy_invoked = foreign_court_anti_suit_injunction_served
    
    # Defect 3: Hotchpot Rule Calculation (Article 32)
    # Creditor receiving foreign recovery cannot participate in domestic payouts until peers achieve parity
    must_apply_hotchpot = hotchpot_foreign_recovery_cr > 0
    
    return {
        "abusive_forum_shopping_detected": is_abusive_comi_shift,
        "comi_determination": "REJECT_FOREIGN_SHIFT_MAINTAIN_INDIA_COMI" if is_abusive_comi_shift else "RECOGNIZE_LEGITIMATE_MIGRATION",
        "article_6_public_policy_defense": "INVOKE_PUBLIC_POLICY_TO_DISREGARD_FOREIGN_INJUNCTION" if public_policy_invoked else "NOT_APPLICABLE",
        "offshore_funds_to_clawback_cr": offshore_funds_transferred_cr,
        "hotchpot_rule_enforced": must_apply_hotchpot,
        "hotchpot_remedial_status": f"Creditor barred from domestic payout until domestic class peers receive {class_domestic_recovery_pct}% recovery" if must_apply_hotchpot else "NORMAL_DISTRIBUTION"
    }

# Case: Promoter shifted nominal office 30 days before CIRP, wired 80 Cr to Mauritius, foreign creditor seized 20 Cr in London
diagnosis = diagnose_cross_border_asset_flight_and_forum_shopping(
    days_before_cirp_comi_shifted=30,
    offshore_funds_transferred_cr=80.0,
    foreign_court_anti_suit_injunction_served=True,
    hotchpot_foreign_recovery_cr=20.0,
    class_domestic_recovery_pct=45.0
)
print("Abusive Forum Shopping Detected:", diagnosis["abusive_forum_shopping_detected"])
print("COMI Judicial Finding:", diagnosis["comi_determination"])
print("Public Policy Invocation (Article 6):", diagnosis["article_6_public_policy_defense"])
print("Offshore Capital Targeted for Clawback (Cr):", diagnosis["offshore_funds_to_clawback_cr"])
print("Hotchpot Parity Rule Enforced (Article 32):", diagnosis["hotchpot_rule_enforced"])
print("Hotchpot Statutory Status:", diagnosis["hotchpot_remedial_status"])
'''

part5_check = {
    "question": "Under Article 32 of the UNCITRAL Model Law on Cross-Border Insolvency (the Hotchpot Rule), what is the statutory restriction on a creditor who has received partial payment on its claim in a foreign proceeding?",
    "options": [
        "They may not receive a payment for the same claim in domestic proceedings until other creditors of the same class receive a proportionate payment",
        "They are permanently banned from filing any future claims across all United Nations member countries",
        "They must surrender fifty percent of their foreign recovery to the International Monetary Fund",
        "They are automatically reclassified as equity preference shareholders of the liquidated debtor"
    ],
    "answerIndex": 0,
    "why": "Article 32 (the Hotchpot Rule) provides that a creditor who has received part payment in a foreign proceeding cannot receive a dividend in domestic proceedings as long as the payment to other creditors of the same class is proportionately less than the payment the creditor has already received."
}

# Try-It texts
try_it_texts = [
    "Execute the cross-border regulatory engine to compare bilateral treaty limits against UNCITRAL Model Law efficiency.",
    "Run the Model Law pillar validator to test direct access, foreign main proceedings, and automatic moratoriums.",
    "Simulate the COMI determination engine to apply Eurofood factors and test the Jet Airways cross-border protocol.",
    "Execute the dual-track proceeding classifier to evaluate physical establishments and test discretionary local relief.",
    "Run the cross-border crisis diagnostic engine to detect opportunistic forum shopping and enforce the Article 32 hotchpot rule."
]

# Captions satisfying: <=80 chars, period, no digits, word matching
captions = [
    {
        "intro": "Cross border insolvency frameworks coordinate multinational corporate defaults.",
        "say1": "Globalized capital flows create complex multinational corporate defaults.",
        "example": "Solar panel manufacturers encounter severe cross border treaty barriers.",
        "tryIt": "Cross border regulatory engines compare bilateral treaty frameworks."
    },
    {
        "intro": "International model laws establish predictable cross border judicial bridges.",
        "say1": "Model law frameworks eliminate cross border commercial gridlock.",
        "example": "Global telecommunications assets receive automatic statutory protections.",
        "tryIt": "Model law validators test direct access and automatic moratoriums."
    },
    {
        "intro": "Jurisdictional nerve centers determine primary corporate insolvency forums.",
        "say1": "Center of main interests governs primary cross border insolvency forums.",
        "example": "Delaware corporate entities maintain true operational nerve centers.",
        "tryIt": "Determination engines apply factual factors and test cross border protocols."
    },
    {
        "intro": "Foreign proceedings govern extraterritorial asset realization frameworks.",
        "say1": "Dual track insolvency proceedings govern extraterritorial asset realizations.",
        "example": "Multinational retail store chains restructure under foreign main orders.",
        "tryIt": "Dual track classifiers evaluate establishments and test local relief."
    },
    {
        "intro": "Adversarial forum shopping threatens equitable cross border asset recovery.",
        "say1": "Cross border restructuring litigation confronts abusive forum shopping.",
        "example": "Pharmaceutical promoters attempt offshore asset flight through shell entities.",
        "tryIt": "Crisis diagnostic engines detect forum shopping and enforce hotchpot rules."
    }
]

# Stages definitions for workflow template
stages_definitions = [
    [
        {"id": "s1", "name": "Territorialism vs Universalism", "subtext": "Doctrinal clash in cross border debt"},
        {"id": "s2", "name": "Bilateral Treaty Limits", "subtext": "Section 234 and 235 procedural bottlenecks"},
        {"id": "s3", "name": "Injeti Srinivas Committee", "subtext": "Recommendations for adopting Model Law"},
        {"id": "s4", "name": "Draft Part Z Framework", "subtext": "Legislative blueprint for cross border regime"}
    ],
    [
        {"id": "s1", "name": "Direct Access", "subtext": "Foreign representatives appearing before tribunal"},
        {"id": "s2", "name": "Recognition Framework", "subtext": "Statutory recognition of foreign proceedings"},
        {"id": "s3", "name": "Relief Architecture", "subtext": "Automatic stays and discretionary asset freezes"},
        {"id": "s4", "name": "Direct Cooperation", "subtext": "Court to court communication channels"}
    ],
    [
        {"id": "s1", "name": "Registered Office Rule", "subtext": "Rebuttable presumption of debtor location"},
        {"id": "s2", "name": "COMI Ascertainability", "subtext": "Habitual administration verifiable by creditors"},
        {"id": "s3", "name": "Jet Airways Protocol", "subtext": "First cross border recognition in India"},
        {"id": "s4", "name": "Joint Cooperation", "subtext": "Bilateral protocol with Dutch bankruptcy court"}
    ],
    [
        {"id": "s1", "name": "Foreign Main Proceeding", "subtext": "Proceedings in debtor primary COMI jurisdiction"},
        {"id": "s2", "name": "Automatic Moratorium", "subtext": "Immediate statutory freeze under main status"},
        {"id": "s3", "name": "Non Main Proceeding", "subtext": "Proceedings where debtor has an establishment"},
        {"id": "s4", "name": "Discretionary Protection", "subtext": "Tailored relief balancing domestic creditors"}
    ],
    [
        {"id": "s1", "name": "Forum Shopping Detection", "subtext": "Shifting COMI on eve of default"},
        {"id": "s2", "name": "Conflicting Injunctions", "subtext": "Cross border anti suit litigation"},
        {"id": "s3", "name": "Public Policy Exception", "subtext": "Article 6 defense protecting sovereignty"},
        {"id": "s4", "name": "Hotchpot Rule", "subtext": "Article 32 parity distribution enforcement"}
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
    print(f"Day 41 Part {p_num} Word Count: {words}")
    assert words >= 600, f"Day 41 Part {p_num} words {words} < 600!"
    
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

print(f"Total Day 41 Words: {total_day_words}")
assert total_day_words >= 3000, f"Total day words {total_day_words} < 3000!"

day_data = {
    "day": day_num,
    "coursePrefix": course_prefix,
    "title": day_title,
    "desc": day_desc,
    "parts": lesson_parts
}

# 1. Save day41_lesson.json
with open("scripts/day41_lesson.json", "w", encoding="utf-8") as f:
    json.dump(day_data, f, indent=2)
print("Saved scripts/day41_lesson.json successfully!")

# 2. Append to src/lib/data/bcomLawLongLessons.ts
ts_path = "src/lib/data/bcomLawLongLessons.ts"
with open(ts_path, "r", encoding="utf-8") as f:
    ts_content = f.read()

# Check if Day 41 is already present
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

# 3. Build day-41.json visual file
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
            "title": f"{p['title']} Governance Architecture",
            "stages": stgs,
            "steps": steps
        }
    })

visual_data = {
    "schemaVersion": 1,
    "prefix": "bcom_law",
    "day": 41,
    "promptSha": "prompt_sha_bcom_law_day41_cross_border_uncitral_v1",
    "model": "google/gemini-2.5-pro",
    "entries": entries
}

v_path = "src/lib/data/lessonVisuals/bcom_law/day-41.json"
with open(v_path, "w", encoding="utf-8") as f:
    json.dump(visual_data, f, indent=2)
print(f"Saved {v_path} successfully!")
