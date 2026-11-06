# scripts/create_day40_fin_texts.py
"""
Generates rich, 7-paragraph technical text for Day 40:
Milestone 8 Capstone: Global Treasury & Sovereign Fixed Income Syndicate Simulator.
Enforces Law 1: All 5 parts >= 580 words, total >= 3,000 words.
"""

DAY40_PARTS = [
    {
        "part": 1,
        "title": "Strategic Sovereign Syndicate Mandate: The Four Pillars of Capital Markets",
        "say": [
            "Welcome to Day 40 of Corporate Finance & Capital Markets. Today marks the triumphant completion of Month 2 Block 8: the Milestone 8 Grand Capstone Global Treasury and Sovereign Fixed Income Syndicate Simulator. Over the preceding four days, you have explored and mastered the individual institutional disciplines that define Tier-1 debt capital markets, global fixed-income trading, equity syndication, and international corporate treasury. You have bootstrapped sovereign zero-coupon spot curves, structured high-yield bond indentures with restricted payments builder baskets, calculated credit default swap hazard rates, modeled IPO gross underwriting spreads with Green Shoe overallotments, and engineered multilateral intercompany FX netting matrices.",

            "In global investment banking divisions, sovereign wealth funds, and Fortune 500 treasury command centers, financial professionals never manage capital structure in fragmented silos. When an enterprise operates across global capital markets, its corporate treasury executive team must orchestrate four interconnected pillars: Sovereign Fixed Income Analytics (benchmarking borrowing costs against bootstrapped spot curves), Corporate Debt Syndication (structuring senior notes, indenture covenants, and credit derivatives), Equity Capital Markets (raising primary public equity via IPO syndication and stabilizing secondary trading), and International Treasury Engineering (optimizing multilateral netting and managing cross-currency interest rate swaps).",

            "These four capital market pillars operate as a dynamic, synchronized financial engine. The sovereign yield curve established by central bank monetary policy and Treasury debt issuance dictates the base risk-free benchmark upon which all corporate borrowing spreads are calculated. In corporate bond syndication, the issuer's credit rating, indenture covenants, and market-implied CDS hazard rates determine the credit spread added to benchmark Treasuries. In Equity Capital Markets, the cost of equity and public market valuation multiples dictate whether the firm finances expansion through primary common stock or debt facilities.",

            "Simultaneously, international corporate treasury operations govern the operational liquidity and cross-border currency flows that connect global subsidiaries to the parent balance sheet. Multilateral netting compresses hundreds of millions of dollars in cross-border invoicing into minimal net settlement vectors, while cross-currency and plain-vanilla interest rate swaps eliminate foreign exchange translation risk and transform volatile floating-rate bank borrowings into predictable fixed-rate obligations.",

            "Furthermore, treasury architects must navigate macro interest rate volatility, shifting yield curve slopes, and central bank quantitative tightening regimes. A corporate debt strategy conceived during low-interest-rate environments can rapidly become toxic if benchmark sovereign yields spike or cross-currency basis spreads widen. By stress-testing the corporate balance sheet against simultaneous rate shocks, currency devaluations, and credit rating downgrades, the global treasury command center guarantees uninterrupted debt service and permanent operational liquidity.",

            "Our milestone capstone simulation focuses on Apex Global Technologies Corporation, a multi-billion-dollar international industrial conglomerate operating major manufacturing and technology subsidiaries across the United States, the Eurozone, the United Kingdom, and Japan. Apex's supervisory board and Chief Financial Officer have mandated the global treasury syndicate to execute a comprehensive capital markets restructuring program: refinancing maturing senior credit facilities, executing a two-hundred-million-dollar Initial Public Offering on the New York Stock Exchange, hedging five hundred million dollars of global currency exposures, and optimizing the multi-currency debt portfolio.",

            "As Lead Managing Director and Head of Global Capital Markets Syndication, your mandate is to synthesize these complex institutional disciplines into a unified, deterministic financial simulation engine. You will model the exact yield curve bootstrapping algorithm, calculate duration and convexity price sensitivities, audit high-yield restricted payments baskets and CDS pricing, track IPO gross spreads and Green Shoe allocations, and execute multilateral netting and swap cash flows.",

            "Throughout this capstone module, we will deconstruct each segment of the global treasury simulator, establishing the exact mathematical formulas, balance sheet linkages, and cryptographic proof gates that validate every quantitative line item. We will trace the transition from sovereign curve bootstrapping to corporate debt structuring, equity syndication, and cross-border derivatives, culminating in the execution of the full Global Treasury and Sovereign Fixed Income Syndicate Simulator engine."
        ]
    },
    {
        "part": 2,
        "title": "Sovereign Yield Curve Engine: Recursive Bootstrapping & Duration Elasticity",
        "say": [
            "We commence our capstone synthesis by building the first pillar of the simulator: the Sovereign Yield Curve and Fixed Income Analytics Engine. In global capital markets, every corporate debt offering, private credit placement, and interest rate derivative is priced as a spread over the default-free sovereign benchmark curve. To establish the pricing foundation for Apex Global's debt facilities, we execute the recursive bootstrapping algorithm across benchmark United States Treasury instruments spanning six-month bills to ten-year notes.",

            "The bootstrapping algorithm commences at the short end of the curve with the six-month Treasury bill yielding five point zero zero percent and the one-year bill yielding five point twenty-five percent. Advancing to the two-year benchmark note carrying a five point fifty percent annual coupon paid semi-annually, we discount the first three intermediate coupon payments using our established short-term spot rates. Subtracting their present value from the bond's par market price of one hundred dollars isolates the present value of the final bullet repayment, algebraically extracting the theoretical two-year zero-coupon spot rate of five point fifty-four percent.",

            "Iterating this recursive substitution across three-year, five-year, and ten-year benchmark par bonds constructs a complete, continuous zero-coupon discount factor curve. The resulting spot curve exhibits a normal, upward-sloping term structure, with the five-year spot rate settling at five point seventy-five percent and the ten-year spot rate reaching six point zero zero percent. By interpolating intermediate discount factors using cubic splines, the treasury engine is equipped to price any non-standard corporate cash flow with absolute no-arbitrage consistency.",

            "Next, we calculate the forward rate matrix to project future borrowing costs. Applying the no-arbitrage equilibrium linking one-year and two-year spot rates, the implied one-year forward rate beginning one year from today is calculated as five point eighty-three percent. For corporate treasurers planning future debt refinancings, forward rates provide the exact mathematical benchmark for locking in pre-hedges using forward starting swaps and Treasury rate locks, insulating the enterprise from impending central bank rate hikes.",

            "To quantify portfolio interest rate sensitivity, the engine computes Macaulay Duration, Modified Duration, and Convexity for Apex's core fixed-income asset portfolio. For a benchmark five-year five percent coupon bond trading at par, the cash-flow weighted time-to-receipt establishes a Macaulay Duration of four point thirty-six years. Dividing by one plus the semi-annual yield yields a Modified Duration of four point twenty-five percent, indicating that a one-hundred-basis-point increase in benchmark yields induces an approximate four point twenty-five percent decline in bond price.",

            "To account for the non-linear curvature of the price-yield relationship, the engine calculates a Convexity metric of twenty-three point forty. Deploying the second-order Taylor series expansion demonstrates that under a large two-hundred-basis-point upward yield shock, linear duration overestimates the price drop by approximately forty-seven basis points. Positive convexity acts as a structural shock absorber, preserving asset portfolio valuation during sudden monetary policy tightening cycles and rewarding investors who maintain long-duration holdings.",

            "In addition to parallel duration metrics, the engine constructs a Key Rate Duration profile across the two-year, five-year, and ten-year anchor nodes. Key rate duration measures portfolio vulnerability to non-parallel yield curve steepening and flattening, enabling quantitative traders to execute duration-neutral butterfly hedges using Treasury bond futures to insulate the balance sheet from yield curve twists.",

            "Finally, the engine computes the Dollar Value of an 01 (DV01) across Apex's two-hundred-and-fifty-million-dollar fixed-income reserve portfolio, establishing an aggregate DV01 limit of one hundred and six thousand two hundred and fifty dollars per basis point. This metric allows trading desks to execute precision macro interest rate hedges using standardized Treasury bond futures contracts traded on the Chicago Board of Trade. In the next module, we evaluate the second pillar: corporate debt syndication, indenture covenants, and credit default swaps."
        ]
    },
    {
        "part": 3,
        "title": "High-Yield Debt Syndication: Covenants, Builder Baskets & CDS Pricing",
        "say": [
            "We now construct the second pillar of our transaction simulator: the Corporate High-Yield Debt Syndication and Credit Derivatives Engine. To refinance existing short-term bank borrowings and fund international manufacturing facility expansions, Apex Global Technologies issues five hundred million dollars of eight-year senior unsecured high-yield notes rated BB by S&P and Ba2 by Moody's, priced at a credit spread of two hundred and forty basis points over benchmark Treasuries.",

            "Under the Trust Indenture Act, the syndication team structures protective negative incurrence covenants to safeguard institutional bondholders while preserving operational flexibility for management. The cornerstone of the indenture is the Restricted Payments Covenant, tracked through the 50% Consolidated Net Income builder basket. The basket initiates with an opening capacity of twenty-five million dollars and accumulates fifty percent of post-issuance consolidated net income, one hundred percent of new equity sales proceeds, and one hundred percent of cash returns on permitted investments.",

            "Over the initial three years of the debt program, Apex generates two hundred and ten million dollars in cumulative consolidated net income and raises fifty million dollars in primary equity proceeds, expanding the restricted payments basket capacity to one hundred and eighty million dollars. Simultaneously, the company distributes sixty million dollars in common stock dividends, leaving a pristine remaining basket capacity of one hundred and twenty million dollars. The engine verifies that every distribution satisfies indenture parameters without triggering an event of default.",

            "Alongside the restricted payments basket, the indenture enforces a Debt Incurrence Ratio requiring the consolidated Fixed Charge Coverage Ratio to remain strictly above two point zero times before any incremental debt can be issued. The contract also incorporates Permitted Liens and Anti-Layering covenants, preventing the issuer from creating junior liens that subordinately impair existing noteholders, ensuring that bondholders maintain structural priority across corporate asset liquidation waterfalls.",

            "Concurrently, the syndicate desk models the market pricing of Apex's five-year Credit Default Swap (CDS) contracts. In institutional derivatives markets, Apex's single-name CDS trades at a market-quoted spread of two hundred and forty basis points per annum. Deploying the structural credit triangle with an institutional standard recovery rate of forty percent (loss given default of sixty percent), the engine extracts the market-implied hazard rate (default intensity) lambda: zero point zero two four zero divided by zero point sixty yields an exact annual hazard rate of four point zero zero percent.",

            "Applying the exponential survival probability function reveals that Apex's cumulative probability of default over a five-year horizon equals one minus e raised to the power of negative zero point zero four multiplied by five, resulting in a cumulative default probability of eighteen point thirteen percent. This quantitative metric provides credit rating committees and bank syndicates with a transparent, market-implied assessment of corporate solvency.",

            "Next, the engine evaluates the CDS-Cash Basis. Apex's cash bonds trade at a Zero-Volatility Spread (Z-spread) of two hundred and sixty-five basis points over the sovereign spot curve, while its CDS trades at two hundred and forty basis points, establishing a negative basis of negative twenty-five basis points. The syndicate capital structure arbitrage desk identifies this pricing dislocation, executing the negative basis trade: buying the cash bond yielding two hundred and sixty-five basis points and purchasing CDS protection at two hundred and forty basis points, locking in an arbitrage carry of twenty-five basis points with eliminated credit risk.",

            "Auditing covenant headroom alongside live CDS default probabilities enables corporate management to proactively manage its capital structure and maintain an optimal borrowing profile. In the next module, we assemble the third pillar: Equity Capital Markets underwriting and global treasury derivatives."
        ]
    },
    {
        "part": 4,
        "title": "Equity Underwriting & Treasury Derivatives: Green Shoe & Cross-Currency Swaps",
        "say": [
            "We now assemble the third pillar of our transaction simulator: Equity Capital Markets Underwriting and Treasury Derivatives Engineering. To fund next-generation robotics research and lower balance sheet leverage, Apex conducts its landmark Initial Public Offering on the New York Stock Exchange, offering ten million primary common shares within an indicative price range of eighteen to twenty dollars per share.",

            "Following a successful global institutional roadshow, the institutional order book closes twelve times over-subscribed. The syndicate pricing committee prices the offering at the top of the range at twenty dollars per share, generating two hundred million dollars in gross offering proceeds. Applying the industry-standard seven point zero percent gross underwriting spread, total underwriter compensation equals fourteen million dollars, partitioned into a two-point-eight-million-dollar Management Fee (twenty percent), a two-point-eight-million-dollar Underwriting Fee (twenty percent), and an eight-point-four-million-dollar Selling Concession (sixty percent).",

            "After deducting three point five million dollars in non-spread direct offering expenses (legal retainers, accounting fees, SEC registration, and NYSE listing fees), Apex's corporate treasury receives one hundred and eighty-two million five hundred thousand dollars in clean net primary equity proceeds. On the share ledger, the lead left bookrunner over-allocates the deal by fifteen percent, allocating eleven million five hundred thousand shares to institutional accounts and opening trading with a one-point-five-million-share syndicate short position.",

            "Upon market opening, secondary demand drives the stock up twenty-five percent to twenty-five dollars per share. The syndicate immediately exercises the Green Shoe overallotment option in full, purchasing one million five hundred thousand additional shares from the issuer at the original twenty-dollar offer price. This exercise closes the syndicate short position with zero loss, while delivering an additional thirty million dollars in gross proceeds (twenty-seven point nine million dollars net of spread) to Apex, expanding total net IPO equity raised to two hundred and ten million four hundred thousand dollars.",

            "Conversely, if secondary trading had broken below the offer price, the lead underwriter would have executed SEC Rule 104 stabilizing bids, purchasing shares in the open market using the overallotment cash reserves to support the market price and cover the short position at a profit, demonstrating the complete two-sided risk mitigation provided by the Green Shoe mechanism.",

            "Simultaneously, the global corporate treasury department deploys cross-border derivatives to insulate operations from foreign exchange and interest rate volatility. The treasury team models Covered Interest Rate Parity for a one-year EUR/USD forward contract: with spot EUR/USD trading at one point zero eight five zero, US rates at five point zero percent, and Eurozone rates at three point five percent, the theoretical forward rate equals one point one zero zero seven (trading at a one-hundred-and-fifty-seven-pip forward premium).",

            "Furthermore, Apex executes a five-year one-hundred-million-dollar notional plain-vanilla interest rate swap, exchanging floating SOFR borrowings for a fixed rate of four point twenty percent. As benchmark SOFR rates rise to four point eighty percent, the swap generates six hundred thousand dollars in annual net interest savings, shielding corporate cash flows from central bank rate hikes and establishing absolute budgetary certainty for corporate treasury planning across volatile economic interest rate cycles.",

            "To hedge foreign currency bond issuances, Apex structures a five-year cross-currency interest rate swap, exchanging five hundred million euros of European debt into five hundred and forty-two point five million dollars at inception, exchanging interest streams throughout the term, and re-exchanging principal at the original historical spot rate at maturity.",

            "This multi-layered capital markets structure demonstrates why equity syndication and derivatives engineering must be planned in complete harmony: primary equity reduces balance sheet leverage, cross-currency swaps neutralize exchange rate volatility, and interest rate swaps lock in long-term predictable debt service costs. In our final module, we integrate all four modules into the executive command center."
        ]
    },
    {
        "part": 5,
        "title": "Executive Treasury Command Center Synthesis & Master Simulator Verification",
        "say": [
            "In our final capstone module, we synthesize all four institutional pillars into the executive Global Treasury Command Center and execute the master simulation engine. A world-class corporate treasury does not treat sovereign curves, bond indentures, equity offerings, and cross-border swaps as disjointed transactions; rather, it views them as an integrated multi-currency liquidity and solvency architecture designed to maximize firm enterprise value while guaranteeing operational resilience.",

            "The treasury command center integrates the multilateral intercompany netting matrix across Apex's four primary regional hubs: the United States Parent, the European Subsidiary, the United Kingdom Subsidiary, and the Japanese Subsidiary. By processing sixty-five million dollars in gross intercompany billings through centralized multilateral netting, the system reduces total cross-border settlement payments to just fourteen point two million dollars. This achieves a seventy-eight percent compression in gross currency volume, eliminates forty-eight international wire transfers, and saves hundreds of thousands of dollars in foreign exchange transaction friction.",

            "Simultaneously, the command center monitors the consolidated balance sheet capital structure against optimal WACC boundaries. By combining two hundred and ten point four million dollars of net IPO equity proceeds with five hundred million dollars of long-term BB senior notes and three hundred million dollars of syndicated bank facilities, Apex achieves a balanced capital structure of thirty percent debt to total capital, operating near the global minimum WACC corridor of eight point forty-one percent.",

            "To maintain institutional governance, the treasury committee presents an integrated Capital Markets Dashboard to the board of directors. The dashboard presents real-time key rate duration profiles, covenant compliance certificates verifying one hundred and twenty million dollars of restricted payments basket headroom, CDS-implied default probability curves, and mark-to-market swap valuations designated as qualifying accounting hedges under ASC 815 and Ind AS 109.",

            "Under rigorous scenario stress-testing—assuming a two-hundred-basis-point increase in sovereign benchmark yields combined with a fifteen percent foreign currency devaluation—the integrated treasury structure demonstrates complete operational resilience. Positive portfolio convexity buffers asset valuations, interest rate swaps cap floating borrowing costs, and forward contracts preserve foreign subsidiary cash repatriation values, insulating corporate profitability from turbulent global macroeconomic volatility.",

            "To comply with international regulatory frameworks including Basel III, Dodd-Frank, and EMIR, the treasury command center automates daily collateral management under bilateral Credit Support Annexes (CSAs). Variation margin is posted and collected in liquid sovereign paper on a daily mark-to-market basis, completely eliminating uncollateralized counterparty default risk across the global derivatives portfolio and ensuring full regulatory capital compliance with central bank oversight standards.",

            "Furthermore, executive treasury software establishes real-time Value at Risk (VaR) monitoring across the consolidated multi-currency balance sheet, simulating 10,000 Monte Carlo macroeconomic scenarios to verify that total treasury liquidity remains above two hundred million dollars under severe credit market contractions, ensuring permanent investment-grade solvency, liquidity ratios, and debt covenant compliance under all economic conditions.",

            "We will now construct and execute our master Python Global Treasury and Sovereign Fixed Income Syndicate Simulator engine. This deterministic script models the entire four-pillar architecture in memory: bootstrapping the sovereign spot curve, computing Macaulay and Modified duration, modeling high-yield restricted payments baskets and CDS hazard rates, partitioning IPO underwriting gross spreads and Green Shoe allocations, executing multilateral FX netting matrices, and valuing interest rate swaps.",

            "Upon successful execution, the transaction engine will programmatically verify that all four financial pillars reconcile with absolute mathematical precision across all balance sheet, income statement, and derivatives linkages, outputting the comprehensive transaction ledger and culminating in the cryptographic verification token GLOBAL_TREASURY_SYNDICATE_SIMULATOR_PASS. This milestone concludes Month 2 Block 8 and sets an unbreakable standard of institutional capital markets excellence."
        ]
    }
]

if __name__ == "__main__":
    total_words = 0
    print("Day 40 Word Counts:")
    for p in DAY40_PARTS:
        words = sum(len(para.split()) for para in p["say"])
        total_words += words
        assert words >= 580, f"Part {p['part']} word count {words} < 580!"
        print(f"  Part {p['part']}: {words} words - OK")
    print(f"Day 40 Total Words: {total_words}")
    assert total_words >= 3000, f"Total words {total_words} < 3000!"
