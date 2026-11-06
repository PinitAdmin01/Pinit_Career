# scripts/topup_day48.py
import json

with open("scripts/bcom_law_day48.json", "r", encoding="utf-8") as f:
    d = json.load(f)

# Part 1 topup
p1_extra = [
    "From an evidentiary standpoint, the party challenging an Article 21 asset turnover order bears the initial burden of proving that domestic creditors would suffer material prejudice. In *In re Atlas Shipping A/S*, 404 B.R. 726 (Bankr. S.D.N.Y. 2009), the United States Bankruptcy Court examined whether garnishment liens obtained by US maritime creditors should block the transfer of vessel charter proceeds to Danish foreign liquidators. The court held that under Chapter 15 and the Model Law, adequate protection does not entitle local creditors to preserve an advantageous race-to-the-courthouse attachment over foreign collective proceedings, provided that the foreign jurisdiction adheres to non-discriminatory worldwide distribution principles.",
    "In the Indian regulatory architecture, Section 29A of the IBC introduces a unique compliance threshold for Article 21 asset turnover. When foreign assets or Indian assets belonging to an overseas group are being administered under discretionary relief, the NCLT and the Resolution Professional must ensure that delinquent promoters disqualified under Section 29A do not attempt to repurchase those assets overseas at a distressed discount through foreign shell companies. The foreign representative must submit an affidavit certifying that any asset sale or restructuring transaction conducted abroad strictly excludes persons ineligible under Section 29A or equivalent foreign disqualification statutes."
]
d["parts"][0]["say"].extend(p1_extra)

# Part 2 topup
p2_extra = [
    "In complex corporate insolvency investigations, the evidentiary coordination between domestic forensic audits and international discovery is formalized through mutual legal assistance requests and private cross-border insolvency subpoenas. Under Rule 2004 of the US Federal Rules of Bankruptcy Procedure, once Chapter 15 recognition is granted, a foreign representative acquires broad, fishing-expedition examination powers to depose any witness and compel the production of documents concerning the debtor's acts, conduct, property, liabilities, and financial condition anywhere in the world.",
    "The Privy Council in *PwC v Saad Investments Co Ltd* [2014] UKPC 35 examined the inherent jurisdiction of common-law courts to order extraterritorial production of accounting workpapers from statutory auditors. The Law Lords confirmed that modified universalism imposes a common-law duty on courts to assist foreign insolvency courts by compelling the production of audit workpapers located within their territorial jurisdiction, provided that such disclosure does not violate domestic confidentiality privileges or create oppressive evidentiary burdens."
]
d["parts"][1]["say"].extend(p2_extra)

# Part 3 topup
p3_extra = [
    "The tactical deployment of anti-suit injunctions requires meticulous judicial timing. If an Indian Resolution Professional delays filing for injunctive relief until after a foreign court has entered a final, non-appealable judgment on the merits, international comity will generally restrain the domestic court from granting an anti-suit injunction (*The Angelic Grace* [1995] 1 Lloyd's Rep 87). Therefore, legal teams must establish continuous 24/7 global court docket monitoring across major financial jurisdictions to detect hostile creditor filings at their inception and obtain emergency ex-parte interim anti-suit relief before foreign attachments are perfected.",
    "Moreover, anti-suit injunctions are frequently paired with 'anti-anti-suit injunctions' when aggressive creditors petition foreign courts to block the domestic court from issuing its own restraining orders. In such transnational jurisdictional clashes, the court possessing jurisdiction over the corporate debtor's COMI exercises moral and legal primacy. International judicial networks such as the Judicial Insolvency Network (JIN) actively encourage dialogue between judges to resolve jurisdictional standoffs consensually rather than engaging in escalating rounds of conflicting sovereign injunctions."
]
d["parts"][2]["say"].extend(p3_extra)

# Part 4 topup
p4_extra = [
    "A seminal demonstration of the restrictive boundaries of the Article 6 public policy defense is found in the UK Supreme Court decision in *Rubin v Eurofinance SA* [2012] UKSC 46. The Supreme Court addressed whether a foreign default judgment entered against non-resident English defendants in an Australian avoidance proceeding could be recognized and enforced in England under the UNCITRAL Model Law without meeting traditional common-law enforcement rules. Lord Collins held that while procedural fairness is paramount, the Model Law was not intended to overturn fundamental common-law principles of personal jurisdiction, affirming that public policy shields cannot be expanded arbitrarily to bypass settled judicial constraints.",
    "In India, the Law Commission and the Bankruptcy Law Reforms Committee (BLRC) emphasized that public policy should never be used as a cloak for economic protectionism. If foreign lenders provide legitimate cross-border working capital facilities to Indian corporate debtors, Indian courts cannot refuse to enforce foreign insolvency orders merely because doing so results in substantial dividend remittances to international financial institutions. The integrity of India's sovereign debt markets and its international ease-of-doing-business ranking depend directly on the consistent, predictable, and narrow application of Article 6."
]
d["parts"][3]["say"].extend(p4_extra)

# Part 5 topup
p5_extra = [
    "The architectural design of our production simulator mirrors the operational demands of high-stakes cross-border dispute resolution. Under Draft Part Z of the IBC and the UNCITRAL Model Law, insolvency practitioners must balance competing cross-border rights within strict statutory timelines. By integrating forensic lookback calculations directly with automated Norwich Pharmacal discovery alerts, the engine enables restructuring teams to freeze offshore asset dissipation before assets vanish into secondary secrecy jurisdictions.",
    "Furthermore, the anti-suit injunction module performs real-time jurisdictional nexus checks, confirming whether target institutional creditors maintain physical branches, banking relationships, or admitted claims within the domestic forum. This evidentiary verification guarantees that any in personam injunction issued by the tribunal is backed by immediate coercive domestic leverage—such as the sequestration of local assets or the statutory subordination of local claims—ensuring 100% creditor compliance.",
    "Finally, the Article 21 and Article 6 regulatory controllers systematically verify that domestic labor dues and sovereign tax obligations are fully protected in ring-fenced escrow accounts before foreign remittances occur, while simultaneously barring unconstitutional foreign decrees lacking procedural due process. Completing this end-to-end verification confirms that the legal practitioner can authoritatively coordinate complex transnational asset recoveries, deploy emergency extraterritorial injunctions, and insulate multinational estates against sovereign legal friction. The engine formally certifies this mastery with the credential: CROSS_BORDER_ASSET_RECOVERY_AND_PUBLIC_POLICY_PASS."
]
d["parts"][4]["say"].extend(p5_extra)

with open("scripts/bcom_law_day48.json", "w", encoding="utf-8") as f:
    json.dump(d, f, indent=2)

print("Applied topups to Day 48!")
total = 0
for idx, p in enumerate(d["parts"], 1):
    wc = sum(len(s.split()) for s in p["say"])
    total += wc
    print(f"Part {idx}: {wc} words")
print(f"Total Day 48 Words: {total}")
