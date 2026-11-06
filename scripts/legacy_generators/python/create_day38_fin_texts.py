# scripts/create_day38_fin_texts.py
"""
Generates rich, 7-paragraph technical text for Day 38:
Equity Capital Markets (ECM), IPO Underwriting Spread & Green Shoe Mechanics.
Enforces Law 1: All 5 parts >= 580 words, total >= 3,000 words.
"""

DAY38_PARTS = [
    {
        "part": 1,
        "title": "Equity Capital Markets (ECM) Syndicate Structure & The S-1 Registration Lifecycle",
        "say": [
            "Welcome to Day 38 of Corporate Finance & Capital Markets. Today, we step into the premier tier of investment banking advisory: Equity Capital Markets (ECM) and Initial Public Offering (IPO) Syndication. The Initial Public Offering represents the ultimate corporate rite of passage, transforming a privately held enterprise into a publicly traded corporate institution. Through the IPO process, a company raises permanent, non-repayable primary equity capital to fund organic growth, provides liquidity to founding venture capital and private equity sponsors, establishes an acquisition currency via publicly quoted common stock, and gains enhanced commercial prestige and public visibility.",

            "The IPO execution lifecycle commences months prior to public listing with the investment banking beauty contest, known universally as the Bake-Off. During the bake-off, top-tier global investment banking syndicates pitch the company's board of directors, presenting detailed equity valuation models, institutional distribution capabilities, equity research analyst coverage commitments, and proposed syndicate structures. The issuing firm selects an underwriting syndicate led by the Lead Left Bookrunner—the investment bank that commands the left-hand position on the prospectus cover, manages the institutional order book, and directs pricing negotiations.",

            "The underwriting syndicate is organized into a formal hierarchy: the Lead Left Bookrunner is joined by Joint Bookrunners (who share book-building responsibilities and syndicate economics), Co-Managers (who provide specialized retail or regional institutional distribution), and Selling Group Members. This syndicate structure ensures broad institutional placement power across global pension funds, mutual funds, sovereign wealth portfolios, and qualified institutional buyers, minimizing single-allocator concentration risk.",

            "Simultaneously, corporate legal counsel, independent statutory auditors, and investment banking teams draft the registration statement filed with the Securities and Exchange Commission (SEC), designated as SEC Form S-1. The S-1 is a monumental legal disclosure document comprising two distinct sections: Part I, which forms the preliminary prospectus (the iconic Red Herring prospectus, named for the red-ink legend historically printed across its cover indicating that the registration statement is not yet effective), and Part II, containing confidential regulatory schedules, underwriting agreements, and executive compensation disclosures.",

            "The SEC conducts a rigorous, multi-round regulatory review of the Form S-1, issuing comment letters probing revenue recognition policies under ASC 606, customer concentration dependencies, related-party commercial transactions, and Non-GAAP financial reconciliation adjustments. Management and underwriters file sequential amended S-1/A disclosures addressing every SEC inquiry. Once the SEC issues a formal order declaring the registration statement effective, the company and underwriters are legally authorized to price the offering and distribute shares to the public.",

            "A critical legal and market stabilization component finalized during this phase is the Lock-Up Agreement. Under customary underwriting practice, pre-IPO shareholders—including company founders, venture capital partners, executive officers, and private equity sponsors—sign legally binding agreements barring them from selling, pledging, or hedging their existing shares for a period of exactly one hundred and eighty days following the IPO. The lock-up agreement prevents immediate market flooding, assuring institutional investors that insiders remain fully aligned with the long-term operational success of the public entity.",

            "During the intervening quiet period enforced under federal securities regulations and FINRA Rule 5130, executive management and lead investment bankers embark on the Institutional Roadshow. The roadshow is an intensive ten-to-fourteen-day global marketing campaign where the Chief Executive Officer and Chief Financial Officer present the corporate investment thesis to hundreds of institutional portfolio managers across New York, Boston, San Francisco, London, and Tokyo, answering rigorous questions regarding competitive moats, margin expansion curves, and total addressable market projections.",

            "In our master transaction scenario, we will evaluate Apex Technologies Corporation as it conducts its landmark two-hundred-million-dollar Initial Public Offering on the New York Stock Exchange. We will analyze the syndicate economics, track institutional indications of interest during book-building, calculate underwriting gross spreads, model the fifteen percent Green Shoe overallotment option, and evaluate post-listing trading stabilization under SEC Rule 104. In the next module, we deconstruct the book-building process and offer price discovery."
        ]
    },
    {
        "part": 2,
        "title": "Book-Building Mechanics, Indications of Interest (IOI) & Offer Price Discovery",
        "say": [
            "We now analyze the core price discovery engine of modern Equity Capital Markets: the Book-Building Process. Developed by Wall Street investment banking houses in the late twentieth century and now universally adopted across global exchanges, book-building is the systematic mechanism through which the lead left bookrunner collects, aggregates, and evaluates institutional investor demand to establish the final public offering price. Prior to book-building, traditional fixed-price offerings frequently resulted in severe capital misallocation and catastrophic underwriter losses.",

            "The book-building process initiates when the issuer and lead underwriters file an amended Form S-1 establishing the Indicative Price Range—for example, eighteen to twenty dollars per share. This preliminary range is constructed by synthesizing peer-group trading multiples (such as Enterprise Value to Next-Twelve-Months Revenue or Forward P/E multiples) with multi-stage discounted cash flow valuations, adjusted for a customary fifteen to twenty percent IPO discount designed to incentivize institutional participation.",

            "Throughout the institutional roadshow, institutional equity sales desks log investor orders into the confidential institutional order book. These orders are categorized as Indications of Interest (IOIs). Institutional investors submit orders specifying both quantity (number of shares demanded) and price elasticity. Orders are classified into three primary types: Strike Bids (orders agreeing to purchase shares at whatever final offer price is set by the syndicate), Limit Bids (orders specifying a maximum price the investor is willing to pay, e.g., twenty thousand shares at up to nineteen dollars and fifty cents), and Strike Orders with Quality Allocations.",

            "The lead bookrunner analyzes the resulting demand curve to evaluate the Quality of the Book. High-quality demand is defined by anchor orders submitted by long-only institutional asset managers (such as Fidelity, BlackRock, Wellington, and T. Rowe Price) and sovereign wealth funds. Long-only investors represent sticky, long-term capital that rarely liquidates shares in immediate secondary trading. Conversely, speculative orders from high-frequency quantitative hedge funds are viewed as lower-quality fast money prone to immediate flipping upon market opening.",

            "When aggregate institutional demand significantly exceeds the number of shares offered, the offering is categorized as Over-Subscribed. For highly sought-after technology and industrial issuers, book coverage frequently reaches ten times, twenty times, or even fifty times the available share supply. High over-subscription coverage provides the lead left bookrunner with immense tactical pricing power. If the book shows overwhelming limit demand above the upper bound of the indicative range, the syndicate can revise the price range upward (e.g., to twenty-one to twenty-three dollars) or price the deal at the top of the range.",

            "Pricing the IPO represents a delicate, high-stakes equilibrium. Setting the price too high risks pricing out institutional investors, leading to broken IPOs where the stock collapses below its offer price upon market opening, damaging the issuer's reputation and inflicting reputational harm on the lead underwriter. Conversely, setting the price too low leaves money on the table, diluting existing shareholders by raising less capital than the company could have commanded. The lead left bookrunner convenes a final pricing call with the board of directors on the evening prior to listing to lock in the final offer price.",

            "In our Apex Technologies model, the company offers ten million common shares. Following an exceptional institutional roadshow, the order book closes twelve times over-subscribed, with seventy percent of demand concentrated in premier long-only accounts. The pricing committee officially sets the offer price at the top of the range at twenty dollars per share, generating two hundred million dollars in gross offering proceeds. In our next module, we deconstruct the division of these proceeds across underwriting spreads, concessions, and net issuer cash."
        ]
    },
    {
        "part": 3,
        "title": "Underwriting Economics: The 7% Gross Spread, Selling Concessions & Net Proceeds",
        "say": [
            "We now deconstruct the financial economics of institutional underwriting: the Gross Spread, the Selling Concession, and Net Issuer Proceeds. In corporate investment banking, underwriting is not a gratuitous advisory service; it is a principal financial transaction where the underwriting syndicate agrees to purchase shares from the issuing corporation at a negotiated discount to the public offering price and resell those shares to institutional investors at the full public offer price.",

            "The total economic compensation earned by the underwriting syndicate is designated as the Gross Underwriting Spread, expressed as a fixed percentage of total gross offering proceeds. In mid-cap and upper-middle-market IPOs conducted on United States exchanges (offerings raising between one hundred million and five hundred million dollars), the gross underwriting spread has historically clustered around exactly seven point zero percent—a pricing convention established across decades of Wall Street syndicate practice. For mega-cap offerings exceeding one billion dollars, competitive bake-offs typically compress the gross spread to between three and five percent.",

            "In our Apex Technologies offering, raising two hundred million dollars through the sale of ten million shares at twenty dollars per share, the seven point zero percent gross spread generates exactly fourteen million dollars in total underwriter compensation. This fourteen-million-dollar syndicate compensation pool is strictly partitioned into three distinct economic buckets: the Management Fee, the Underwriting Fee, and the Selling Concession.",

            "The first component is the Management Fee, which historically captures twenty percent of the gross spread (one point four percent of gross proceeds, or two million eight hundred thousand dollars in our model). The management fee is allocated exclusively to the Lead Left Bookrunner and Joint Bookrunners as compensation for organizing the offering, leading the SEC registration process, structuring the financial model, and directing the roadshow logistics.",

            "The second component is the Underwriting Fee, capturing another twenty percent of the gross spread (two million eight hundred thousand dollars). The underwriting fee compensates all syndicate members for bearing legal liability and inventory market risk under Section 11 of the Securities Act of 1933 during the brief window between pricing and settlement. Out of this fee, the syndicate pays legal expenses incurred by underwriters' counsel, travel roadshow costs, and syndicate stabilization insurance.",

            "The third and largest component is the Selling Concession, representing sixty percent of the gross spread (four point two percent of gross proceeds, or eight million four hundred thousand dollars). The selling concession is distributed on a strictly performance-based commission structure, rewarding each individual syndicate bank and co-manager in direct proportion to the volume of shares successfully placed with institutional end-investors. A regional co-manager that places five hundred thousand shares receives two dollars and ten cents per share placed out of the selling concession pool.",

            "Modern equity syndicates administer the allocation of selling concessions through the Institutional Pot System. Under the fixed-pot system, all institutional orders are pooled into a centralized order book rather than retained on individual bank ledgers. When institutional investors submit orders, they designate which syndicate banks receive credit for the placement through institutional designation notices. This prevents destructive price competition and fee-slashing among syndicate members while ensuring that the issuer and lead bookrunner maintain centralized oversight over institutional allocations.",

            "To calculate Net Proceeds received by the corporate issuer, we subtract the gross spread and other non-spread direct offering expenses from gross proceeds. Direct offering expenses include independent legal fees, statutory auditor accounting retainers, printing costs, SEC filing registration fees, and exchange listing fees, typically consuming three to five million dollars. Deducting fourteen million dollars of gross spread and three point five million dollars of other expenses from two hundred million dollars in gross proceeds delivers exactly one hundred and eighty-two million five hundred thousand dollars in clean net primary capital to Apex's corporate treasury. In the next module, we master the Green Shoe overallotment option."
        ]
    },
    {
        "part": 4,
        "title": "The Green Shoe Overallotment Option & SEC Rule 104 Price Stabilization Mechanics",
        "say": [
            "We now examine the most elegant risk management and market stabilization mechanism in Equity Capital Markets: the Green Shoe Overallotment Option. Named after the Green Shoe Manufacturing Company (the first corporate issuer to implement this contractual feature in its 1919 offering, later known as Stride Rite), the Green Shoe option is a standard contractual provision embedded in every modern underwriting agreement that grants underwriters the right to purchase up to an additional fifteen percent of the base offering shares at the original public offer price within thirty days of listing.",

            "To understand why the Green Shoe option exists, one must master the mechanics of syndicate short positioning. When an IPO prices, the lead left bookrunner deliberately allocates one hundred and fifteen percent of the offering size to institutional investors. In our Apex Technologies offering, where the base offering is ten million shares, the syndicate allocates eleven million five hundred thousand shares. Because the issuer has only authorized and delivered ten million shares, the underwriting syndicate opens trading with a deliberate short position of one million five hundred thousand shares (fifteen percent).",

            "Opening trading with a short position provides the lead underwriter with powerful structural asymmetry to manage secondary market price volatility. Post-listing secondary trading unfolds along two diverging paths: a hot, surging IPO or a cold, broken IPO. The Green Shoe mechanism functions flawlessly under both market conditions, protecting both the issuing corporation and public investors.",

            "Scenario A represents the Hot IPO: upon market opening, massive secondary demand drives the stock price upward—for instance, surging twenty-five percent from twenty dollars to twenty-five dollars per share. If the syndicate were an unhedged short seller, it would face catastrophic trading losses of seven million five hundred thousand dollars covering its short in the open market. However, because the syndicate holds the contractual Green Shoe option, it simply exercises the option, requiring the issuer to issue one million five hundred thousand new shares at the original offer price of twenty dollars.",

            "Exercising the Green Shoe in a hot market closes the syndicate's short position at zero loss, while the issuer receives an additional thirty million dollars in gross equity proceeds (twenty-seven point nine million dollars net of the seven percent spread), capitalizing on strong institutional appetite to expand its balance sheet cash reserves. In hot offerings, the Green Shoe is virtually always exercised in full within forty-eight to seventy-two hours of listing.",

            "Scenario B represents the Cold or Broken IPO: market conditions deteriorate, and secondary selling pressure drives the stock down toward seventeen or eighteen dollars per share. In a broken market, the syndicate does NOT exercise the Green Shoe option. Instead, the lead underwriter enters the open market and acts as a stabilizing agent under SEC Regulation M, specifically Rule 104. Rule 104 permits underwriters to place stabilizing bids to support the market price of the stock, exempting them from statutory market manipulation restrictions so long as the stabilizing bid does not exceed the original IPO offer price.",

            "Under Rule 104, the lead underwriter uses the cash collected from institutional buyers on the original fifteen percent overallotment to buy one million five hundred thousand shares in the open market at prices below twenty dollars. This massive institutional buying absorbs secondary market sell orders, arresting the stock's price collapse and supporting market confidence. Simultaneously, because the underwriter buys back shares at an average price of, say, seventeen dollars and fifty cents after shorting them at twenty dollars, the syndicate generates an underwriting trading profit while fulfilling its market stabilization mandate. In our final module, we evaluate IPO underpricing and engine execution."
        ]
    },
    {
        "part": 5,
        "title": "IPO Underpricing Anomalies, Secondary Trading Pop & Algorithmic Syndicate Engine",
        "say": [
            "In our concluding module for Day 38, we examine one of the most extensively researched empirical anomalies in academic financial economics: IPO Underpricing and the First-Day Trading Pop. Across decades of global equity market data, initial public offerings exhibit a consistent statistical tendency to price below their closing market value on the first day of public trading. In the United States, historical first-day returns average between ten and twenty percent, with during technology bubble regimes expanding to over fifty percent.",

            "Financial economists explain IPO underpricing through several theoretical frameworks. The predominant academic explanation is the Winner's Curse hypothesis formulated by Kevin Rock. In an IPO, institutional investors possess superior analytical information regarding fair valuation compared to retail participants. If an IPO is overpriced, informed institutional investors refrain from bidding, leaving uninformed retail investors to receive full allocations of an overvalued asset. To induce uninformed investors to participate consistently in the IPO market and provide ongoing liquidity, underwriters must systematically underprice offerings on average, ensuring positive expected returns that compensate for the adverse selection penalty.",

            "A complementary framework is the Information Asymmetry and Signaling Model formulated by Allen and Gerald. High-quality corporate issuers deliberately leave money on the table in their initial public offering by pricing shares below intrinsic value as a credible, costly signal of corporate quality. By delivering a positive first-day pop to institutional investors, the issuer establishes goodwill in capital markets, enabling it to execute subsequent secondary seasoned equity offerings (SEOs) at significantly higher valuation multiples with minimal execution friction and tight underwriting discounts.",

            "Furthermore, agency incentives within investment banking syndicates contribute to underpricing. Underwriters face asymmetric reputational risk: pricing an IPO too high risks a broken deal that damages relationships with institutional investor clients who generate recurring trading commission revenue for the bank. Underpricing the offering eliminates allocation risk, ensures full book placement, and allows the syndicate to allocate underpriced shares to favored institutional clients, solidifying long-term prime brokerage and asset management relationships.",

            "Following the public listing, capital markets regulatory frameworks enforce strict Research Quiet Periods under FINRA Rule 2241. Historically, syndicate research analysts were barred from publishing equity research reports for forty calendar days post-IPO to prevent promotional conflicts of interest. Under the Jumpstart Our Business Startups (JOBS) Act, this research blackout period was reduced to ten calendar days for Emerging Growth Companies (EGCs). Once the research quiet period expires, syndicate equity analysts initiate formal research coverage with detailed earnings models, institutional price targets, and investment recommendations.",

            "For corporate chief financial officers and boards of directors, managing the trade-off between underpricing and gross proceeds is the central strategic imperative of IPO planning. An optimal IPO achieves a modest first-day pop of ten to fifteen percent—enough to generate positive global media headlines, reward early institutional believers, and establish liquid secondary trading, without leaving excessive capital on the table that dilutes existing pre-IPO shareholders.",

            "We will now construct and execute our deterministic Python Equity Capital Markets and IPO Syndication Engine. This script will programmatically model the complete IPO lifecycle for Apex Technologies: calculating gross offering proceeds across ten million shares, partitioning the seven percent gross underwriting spread into management fees, underwriting fees, and selling concessions, computing net issuer proceeds, modeling both hot market Green Shoe exercise and cold market Rule 104 open-market stabilization, measuring first-day trading pop returns, and emitting the cryptographic verification token ECM_IPO_SYNDICATE_UNDERWRITING_PASS.",

            "Executing this engine equips students with the exact quantitative frameworks deployed by Wall Street syndicate desks during multi-billion-dollar global IPOs. Let us proceed directly to programmatic verification."
        ]
    }
]

if __name__ == "__main__":
    total_words = 0
    print("Day 38 Word Counts:")
    for p in DAY38_PARTS:
        words = sum(len(para.split()) for para in p["say"])
        total_words += words
        assert words >= 580, f"Part {p['part']} word count {words} < 580!"
        print(f"  Part {p['part']}: {words} words - OK")
    print(f"Day 38 Total Words: {total_words}")
    assert total_words >= 3000, f"Total words {total_words} < 3000!"
