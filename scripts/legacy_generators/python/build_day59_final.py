import json
import re

def count_words(text):
    return len(re.findall(r'\b[A-Za-z0-9_-]+\b', text))

with open("scripts/bcom_law_day59.json", "r", encoding="utf-8") as f:
    data = json.load(f)

p1_addon = """
In addition to traditional Anglo-American structural defenses, takeover defense strategy in India requires analyzing the corporate charter and the rights of public financial institutions. During the 1980s Escorts raid, the Reserve Bank of India and public financial institutions (LIC, GIC, UTI) holding 52% of Escorts shares stepped in to block Swraj Paul's Caparo Group from registering transfer of shares, citing violations of foreign exchange investment ceilings under FERA. The Supreme Court in Escorts Ltd v LIC (1986) famously held that an investor who purchases shares through the open market has no automatic right to demand that the company register the share transfer if the acquisition violates statutory provisions or central bank notifications.

In contemporary Indian corporate finance, the most potent structural defense available to promoters is maintaining a formidable pre-takeover equity buffer (typically between 50% and 75%). When promoters hold upwards of 51% of voting rights, hostile takeovers through open market purchases become mathematically impossible because the public free float is insufficient to transfer control. However, where promoter shareholding is diluted below 30%—as was the case with Mindtree where founders held barely 13.3%—the enterprise is highly vulnerable to hostile advances. In such vulnerable scenarios, management must establish active surveillance programs monitoring depository volume alerts, non-disclosure agreement breaches, and clandestine block trades on stock exchanges to detect creeping accumulation before the 25% threshold is crossed."""

p2_addon = """
The legal nuances of the 5% creeping acquisition limit under Regulation 3(2) require rigorous mathematical vigilance. The 5.00% ceiling represents a gross acquisition ceiling, not a net calculation. An acquirer holding 30% of a company cannot purchase 8% in the market and sell 4% during the same financial year and claim compliance on the ground that the net increase was only 4%. In multiple enforcement orders, SEBI has firmly held that the creeping limit is breached the moment gross purchases exceed 5.00% of voting rights during the financial year.

Furthermore, Regulation 4 governs the 'Acquisition of Control' irrespective of whether there has been any acquisition of shares. Under Regulation 2(1)(e), 'Control' includes the right to appoint a majority of the directors or to control the management or policy decisions exercisable by a person or persons acting individually or in concert, directly or indirectly, including by virtue of their shareholding or management rights or shareholders agreements or voting agreements. In Subhkam Ventures (I) Private Limited v SEBI (2011), the Securities Appellate Tribunal considered whether affirmative veto rights granted to a minority private equity investor constituted 'control'. SAT held that negative rights intended to protect a financial investment (such as vetoes over capital expenditure or alteration of charter documents) do not constitute positive control. While the Supreme Court kept the question of law open on appeal due to subsequent settlement, SEBI continues to maintain that expansive affirmative voting rights can trigger mandatory open offer obligations under Regulation 4."""

p3_addon = """
The pricing formula under Regulation 8 incorporates sophisticated anti-manipulation safeguards. When evaluating the 60-day volume-weighted average market price (VWAMP) under Regulation 8(2)(d), SEBI surveillance algorithms actively monitor whether the target company's stock price was artificially ramped up or depressed through circular trading, synchronised trades, or pump-and-dump schemes in the weeks preceding the public announcement. If market manipulation is established, SEBI has the statutory power under Regulation 8(11) to discard the corrupted market price and direct a forensic valuation by an independent merchant banker.

Furthermore, Regulation 22 imposes severe restrictions on the completion of the underlying acquisition during the pendency of the open offer. As a general rule, an acquirer cannot complete the acquisition of shares or voting rights that triggered the open offer until the completion of the entire offer process and the settlement of consideration with tendering shareholders. However, Regulation 22(2) provides a vital exception: the acquirer may complete the acquisition through preferential allotment or stock exchange settlement prior to offer closure if the acquirer deposits 100% of the entire open offer consideration in cash into the escrow account. This 100% cash escrow ring-fences public shareholders from any financial loss while allowing transactional closing velocity."""

p4_addon = """
When a target company's board receives an unsolicited hostile bid, Regulation 26(6) mandates that the board of the target company must constitute a committee of independent directors to provide reasoned recommendations on the open offer to public shareholders. The committee of independent directors is legally entitled to appoint independent legal and financial advisors at the expense of the target company to conduct an objective valuation and review of the offer terms.

The written recommendations of the independent directors committee must address: (a) whether the offer is fair and reasonable to minority shareholders, (b) the commercial viability and track record of the hostile bidder, and (c) the assumptions underlying the offer price. These recommendations must be published in the same national newspapers where the detailed public statement was issued and communicated to SEBI and the stock exchanges at least two working days prior to the commencement of the tendering period.

The statutory interaction between Section 180(1)(a) of the Companies Act 2013 and Regulation 26 of the Takeover Code warrants rigorous analysis. Under Section 180(1)(a), the Board of Directors cannot sell, lease, or otherwise dispose of the whole or substantially the whole of the undertaking of the company without obtaining prior consent of shareholders by way of a Special Resolution. When an aggressive hostile bidder targets a company to seize a specific operational vertical, target directors often consider spinning off the vertical to a friendly joint venture. However, executing this Crown Jewel maneuver during an open offer period without a postal ballot special resolution is an ultra vires act that renders the transaction void ab initio and exposes directors to disqualification under Section 164 of the Companies Act."""

p5_addon = """
The procedural timeline of an open offer under the SEBI SAST Regulations is an uncompromising 70-working-day statutory relay:
- Day 0: The public announcement (PA) is made on the date of entering into the acquisition agreement.
- Within 5 working days: The acquirer publishes the Detailed Public Statement (DPS) in national English, Hindi, and regional language newspapers.
- Within 5 working days of DPS: The Draft Letter of Offer (DLOF) is submitted to SEBI along with the prescribed non-refundable fee.
- SEBI Review Window: SEBI reviews the DLOF and issues comments within 15 working days.
- Dispatch of Letter of Offer: Dispatched to all public shareholders within 7 working days from receipt of SEBI comments.
- Tendering Period: Opens within 12 working days from receipt of SEBI comments and remains open for exactly 10 working days.
- Settlement: Within 10 working days of the closure of the tendering period, all consideration must be paid to shareholders whose shares were accepted, and unaccepted shares must be returned to their demat accounts.

Failure to adhere to this statutory timeline or defaulting on payment triggers severe regulatory sanctions under Regulation 32 and Sections 11, 11B, and 15H of the SEBI Act. SEBI routinely levies 10% per annum compounding interest payable to tendering shareholders for any period of administrative delay caused by the acquirer, and may bar the acquirer and its promoters from accessing the securities market for up to five years."""

data["parts"][0]["say"] += p1_addon
data["parts"][1]["say"] += p2_addon
data["parts"][2]["say"] += p3_addon
data["parts"][3]["say"] += p4_addon
data["parts"][4]["say"] += p5_addon

total_words = 0
for p in data["parts"]:
    wc = count_words(p["say"])
    total_words += wc
    print(f"Day 59 Part {p['part']} words: {wc}")
    assert wc >= 580, f"Part {p['part']} word count {wc} < 580"

print(f"Day 59 Total words: {total_words}")
assert total_words >= 3000, f"Total word count {total_words} < 3000"

with open("scripts/bcom_law_day59.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)

print("Saved updated scripts/bcom_law_day59.json successfully!")
