import json
import re

def count_words(text):
    return len(re.findall(r'\b[A-Za-z0-9_-]+\b', text))

with open("scripts/bcom_law_day60.json", "r", encoding="utf-8") as f:
    data = json.load(f)

extra_p1 = """
Furthermore, the modern General Counsel serves as the principal liaison with sovereign security and intelligence agencies. In high-profile cross-border hostile acquisitions involving critical infrastructure, telecommunications, energy grids, or defense supply chains, hostile bids frequently intersect with national security vetting mechanisms. Under India's Press Note 3 (2020 Series) amending the Consolidated FDI Policy, any investment from an entity of a country that shares a land border with India, or where the beneficial owner of an investment is situated in or is a citizen of any such country, requires mandatory prior Government approval regardless of sectoral caps. When evaluating hostile consortiums operating through tax-haven intermediaries, the General Counsel must coordinate with the Ministry of Home Affairs, Ministry of Finance, and intelligence agencies to verify national security clearances before any corporate control transfers are permitted."""

extra_p3 = """
In addition to filing with FIU-IND, the General Counsel must navigate the complex evidentiary rules governing parallel criminal proceedings. Under Section 66 of the PMLA, the Directorate of Enforcement possesses statutory authority to share information with other regulatory agencies, including SEBI, the Reserve Bank of India, and the Central Bureau of Investigation (CBI). Once an STR is transmitted to FIU-IND indicating a sanctions contagion and potential money laundering layering, the information is disseminated through confidential law enforcement intelligence channels.

Furthermore, under Section 438 of the Code of Criminal Procedure (and its corresponding provision under the Bharatiya Nagarik Suraksha Sanhita 2023), corporate officers named in financial investigations face extraordinary burdens when seeking anticipatory bail. The twin conditions of bail under Section 45(1) of the PMLA require the court to be prima facie satisfied that the accused is not guilty before granting protection. By proactively taking the initiative, conducting an independent internal investigation through forensic accounting specialists, and voluntary self-reporting to FIU-IND, the General Counsel establishes corporate innocence, ring-fences the bona fide management, and protects the enterprise from institutional criminal culpability."""

extra_p5 = """
This Milestone 12 Capstone marks your official certification as an Enterprise Corporate Counsel. You have synthesized statutory frameworks, judicial precedents from the Supreme Court of India, Delaware Court of Chancery, and international arbitral tribunals, alongside rigorous mathematical validation scripts. As you step into leadership roles in boardrooms, investment banks, corporate law firms, and regulatory institutions, you carry a peerless toolkit of legal excellence, strategic vision, and unyielding ethical commitment.

The operational playbook established in this Grand Master Capstone provides a reusable governance template for corporate leadership teams across the world. In the heat of boardroom crises, emotion, panic, and haste frequently lead to fatal missteps—premature press releases, illegal defensive share allotments that violate preemptive rights, or inadvertent sanctions breaches that cut off vital banking channels.

By relying on deterministic legal algorithms, rigorous statutory compliance checks, and clear escalation protocols, the executive leadership of Vanguard transformed an existential crisis into a masterclass of corporate governance and shareholder value preservation. The hostile raid was successfully blocked; the sanctions contagion was neutralized; the core enterprise assets were insulated in a tax-neutral demerger; and foreign arbitral restitution was aggressively pursued. This represents the pinnacle of modern corporate legal craftsmanship."""

data["parts"][0]["say"] += extra_p1
data["parts"][2]["say"] += extra_p3
data["parts"][4]["say"] += extra_p5

total_words = 0
for p in data["parts"]:
    wc = count_words(p["say"])
    total_words += wc
    print(f"Day 60 Part {p['part']} words: {wc}")
    assert wc >= 580, f"Part {p['part']} word count {wc} < 580"

print(f"Day 60 Total words: {total_words}")
assert total_words >= 3000, f"Total word count {total_words} < 3000"

with open("scripts/bcom_law_day60.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)

print("Saved updated scripts/bcom_law_day60.json successfully!")
