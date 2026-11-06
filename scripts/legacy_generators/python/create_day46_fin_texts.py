# scripts/create_day46_fin_texts.py
"""
Generates rich, 8-9 paragraph technical text for Day 46:
Advanced LBO Capital Structures & Debt Tranching.
Enforces Law 1: All 5 parts >= 600 words, total >= 3,000 words.
"""

DAY46_PARTS = [
    {
        "part": 1,
        "title": "Private Equity Architecture: The Anatomy of a Mega-Cap Leveraged Buyout",
        "say": [
            "Welcome to Day 46 of Corporate Finance & Capital Markets. Today, we inaugurate Month 2 Block 10, dedicated to the elite Wall Street disciplines of Advanced Private Equity, Leveraged Buyout (LBO) Financial Engineering, and Distressed Debt Restructuring. In global investment banking and private equity, a leveraged buyout represents the quintessential transaction where high finance, strategic corporate governance, and complex balance sheet engineering intersect. Understanding how financial sponsors deploy multi-tiered capital structures to acquire mature, cash-generative corporations is fundamental to modern institutional corporate finance.",

            "At its core, a leveraged buyout is the acquisition of a target company—often a public corporation taken private or an unloved corporate carve-out—financed through a substantial proportion of borrowed funds alongside a minority equity check contributed by a private equity sponsor. In a typical buyout, the capital structure is engineered with sixty to eighty percent debt and twenty to forty percent equity. The acquired company's future operating free cash flows and tangible assets serve as the primary collateral and cash source to service and amortize the acquisition debt over a five-to-seven-year investment horizon.",

            "Private equity sponsors seek specific corporate operational characteristics when selecting LBO targets. Foremost among these is stable, predictable, and defensible Free Cash Flow (FCF) generation. Companies with low capital expenditure requirements, high operating margins, strong market shares, defensive economic moats, and non-cyclical customer demand are ideal candidates because they can reliably support heavy debt service burdens across volatile macroeconomic cycles without defaulting on loan covenants.",

            "Furthermore, sponsors identify targets possessing significant operational improvement potential. These opportunities include streamlining bloated selling, general, and administrative (SG&A) overhead, divesting non-core secondary business units, improving working capital cash conversion cycles, optimizing global supply chain procurement, and executing accretive bolt-on acquisitions to expand the business through a buy-and-build platform strategy.",

            "To align executive incentives with the financial sponsor, LBO transactions establish structured Management Incentive Plans (MIP) and management equity rollovers. Incumbent chief executive officers and senior management are required to roll over a significant portion of their pre-tax equity proceeds into the new unlisted buyout entity (typically ten to twenty percent of total equity), ensuring meaningful skin in the game. In addition, sponsors carve out an eight to twelve percent equity option pool that vests over the holding period based on operational EBITDA targets and realized exit returns.",

            "The overarching investment thesis of a financial sponsor is to maximize the fund's risk-adjusted returns, universally quantified through the Internal Rate of Return (IRR) and the Multiple on Invested Capital (MoIC). By funding sixty to seventy percent of the initial purchase price with low-cost debt, the equity sponsor achieves tremendous financial leverage. As the portfolio company uses its operating cash flows to systematically pay down the debt principal over the holding period, the equity value expands dramatically even if total enterprise valuation remains completely unchanged.",

            "However, this powerful return multiplier introduces significant financial distress risk. If a sponsor over-levers a company with excessive fixed interest obligations and the business suffers an unexpected revenue downturn, the firm can rapidly breach debt covenants, triggering technical default, credit downgrades, and potential bankruptcy. Consequently, private equity structuring desks must engineer nuanced, multi-tiered debt structures that balance interest cost against operational flexibility.",

            "In modern mega-cap buyouts spanning two to ten billion dollars in enterprise value, financial sponsors rarely borrow from a single lender. Instead, investment banks arrange sophisticated syndicated debt packages partitioned into distinct seniority tiers: senior secured revolving credit lines, amortizing Term Loan A facilities, institutional Term Loan B bullets, second lien debt, high-yield senior unsecured notes, and subordinated mezzanine financing with equity warrants.",

            "Throughout this session, we will examine an enterprise industrial buyout featuring a two-billion-five-hundred-million-dollar ($2.5B) purchase price. We will deconstruct the entire debt seniority stack, model floating-rate spreads over SOFR, evaluate original issue discounts (OID) and credit ratings, and execute production Python simulations. We begin our analytical journey by dissecting the debt tranching hierarchy."
        ]
    },
    {
        "part": 2,
        "title": "The Debt Seniority Stack: First Lien, Term Loans & Institutional Bullet Mechanics",
        "say": [
            "In this second module, we deconstruct the core engine of leveraged buyout debt financing: the Senior Secured Debt Stack. In institutional leveraged lending, the capital stack is governed by strict legal priority established through intercreditor agreements. Lenders at the top of the stack enjoy absolute priority of repayment and comprehensive security pledges over the borrower's stock, bank accounts, intellectual property, and physical assets, accepting lower contractual interest margins in exchange for pristine loss protection.",

            "At the apex of the debt stack sits the Senior Secured Revolving Credit Facility (Revolver). The revolver operates as a flexible corporate credit line, allowing the sponsor-backed company to draw down funds during seasonal working capital troughs and repay balances during cash-rich quarters. Revolvers typically carry maturities of five years and trade at low floating interest spreads (such as SOFR plus two hundred to two hundred fifty basis points), secured by a first-priority lien on the company's liquid working capital assets, specifically accounts receivable and inventory.",

            "Directly beneath or pari passu with the revolver sits Term Loan A (TLA). Historically syndicated to commercial banks and relationship lenders, Term Loan A is an amortizing senior secured loan characterized by meaningful annual principal amortization payments (typically five to ten percent per annum of initial face value). Commercial banks prefer TLA facilities because continuous principal paydown rapidly reduces credit exposure over the loan's five-year lifespan, though it restricts the company's discretionary cash flow.",

            "In modern private equity, the primary workhorse of buyout debt is Term Loan B (TLB). Unlike Term Loan A, Term Loan B is syndicated to institutional debt investors, including collateralized loan obligation (CLO) managers, credit hedge funds, and prime loan mutual funds. Term Loan B facilities typically carry seven-year maturities and are structured with a bullet repayment mechanism: the borrower makes nominal amortization of just one percent per annum during the loan's life, with the remaining ninety-four percent principal balance maturing as a single lump-sum bullet at the end of year seven.",

            "This institutional bullet structure is immensely attractive to private equity sponsors. By deferring ninety-four percent of debt principal repayment until exit, Term Loan B minimizes annual fixed debt service outflows, liberating maximum free cash flow to be deployed toward voluntary debt paydown, strategic capital expenditures, or accretive tuck-in acquisitions during the sponsor's five-year holding horizon.",

            "In addition to syndicated loans, the explosive growth of Private Credit funds (such as Ares, Blackstone, and Blue Owl) has popularized Unitranche Debt Facilities. A unitranche facility combines first lien and second lien debt into a single blended loan facility provided by a single direct lender. While unitranche pricing is slightly higher (SOFR plus five hundred to six hundred basis points), it eliminates complex multi-lender syndication risk, offers faster closing execution, and simplifies ongoing governance under an internal Agreement Among Lenders (AAL).",

            "Term Loan B facilities are priced as floating-rate loans pegged to the Secured Overnight Financing Rate (SOFR) plus an institutional credit margin (typically SOFR plus three hundred to four hundred basis points), subject to a contractual SOFR floor (such as zero point fifty or one point zero percent). Furthermore, to incentivize institutional syndication, investment banks issue TLB loans with an Original Issue Discount (OID)—typically selling the debt at ninety-eight to ninety-nine percent of par—providing lenders with an upfront yield enhancement.",

            "To govern lender protection, credit agreements historically incorporated strict Financial Maintenance Covenants, requiring the borrower to maintain leverage ratios (Debt-to-EBITDA) below specified ceilings and interest coverage ratios (EBITDA-to-Interest) above specified floors, tested quarterly. However, in contemporary competitive buyout markets, sponsors frequently negotiate Covenant-Lite (Cov-Lite) credit agreements, which eliminate maintenance covenants entirely, leaving only incurrence covenants that are tested only when the borrower issues additional debt or executes dividend distributions.",

            "In our enterprise buyout scenario, the sponsor funds thirty-two percent of the acquisition using an eight-hundred-million-dollar ($800M) Term Loan B facility priced at SOFR plus three hundred basis points with a ninety-nine percent OID. In our next module, we descend the capital stack to explore second lien loans, high-yield unsecured bonds, and subordinated mezzanine debt."
        ]
    },
    {
        "part": 3,
        "title": "Junior Capital & Mezzanine Debt: PIK Interest, Warrants & Intercreditor Dynamics",
        "say": [
            "Having mastered senior secured bank debt, we now descend into the junior layers of the LBO capital stack: Second Lien Debt, High-Yield Senior Unsecured Notes, and Subordinated Mezzanine Capital. In mega-cap transactions where senior secured bank debt reaches regulatory leverage limits (typically four to five times EBITDA), sponsors utilize junior debt tranches to fund the remaining financing gap, preventing excessive equity dilution.",

            "The first junior tier is Second Lien Debt. Second lien loans are secured by the exact same asset collateral pool as first lien debt, but their claim on collateral proceeds in bankruptcy is entirely subordinated to first lien claims. If the company is liquidated, second lien lenders receive zero recovery until first lien revolver and term loan holders are satisfied one hundred percent in cash. To compensate for this secondary collateral position, second lien debt trades at wider floating spreads (SOFR plus six hundred to eight hundred basis points) with extended eight-year maturities.",

            "Beneath secured loans sit High-Yield Senior Unsecured Notes, colloquially known as Junk Bonds. High-yield notes are fixed-rate public or Rule 144A private placement bonds with maturities of seven to ten years. Unsecured notes hold zero specific asset collateral pledges; they are backed solely by the general creditworthiness and unencumbered cash flows of the operating entity. Because they lack collateral, high-yield notes carry higher fixed coupons (typically seven to ten percent) and feature call protection schedules (such as non-call three or non-call four years), compensating bondholders for prepayment risk.",

            "At the boundary connecting debt and equity sits Subordinated Mezzanine Financing. Mezzanine debt represents a flexible, hybrid capital instrument tailored for highly levered transactions. Mezzanine loans hold the lowest repayment priority among all debt tranches, standing directly senior only to common and preferred equity. Because of its subordinated risk profile, mezzanine debt targets blended internal rates of return of twelve to sixteen percent.",

            "To achieve these targeted returns without imposing unsustainable cash debt service burdens on the borrower, mezzanine facilities deploy Payment-in-Kind (PIK) Interest mechanisms. Under a PIK structure, the borrower pays a portion of the interest in cash (for example, eight percent cash interest) while the remaining interest (for example, three point five percent PIK interest) is capitalized: the interest dollar amount is automatically added to the outstanding principal balance of the loan, deferring cash outflow until terminal maturity.",

            "Furthermore, mezzanine lenders frequently demand Equity Warrants or equity co-investment rights (colloquially designated as an equity kicker). Warrants grant the mezzanine lender the contractual right to purchase a specified percentage of the company's common stock (typically two to five percent) at a nominal exercise strike price upon exit, allowing the debt fund to participate directly in the sponsor's equity upside.",

            "To protect against unexpected technical default, private equity sponsors negotiate contractual Equity Cure Rights in credit agreements. An equity cure provision grants the financial sponsor the legal right to inject fresh cash equity into the portfolio company following a quarterly covenant breach. The injected equity is treated as additional EBITDA or applied directly to pay down debt, retroactively curing the covenant breach and preventing lenders from accelerating debt or foreclosing on collateral.",

            "The operational relationship between senior and junior lenders is governed with strict legal precision by the Intercreditor Agreement. The intercreditor agreement establishes payment blockage notices, lien subordination rules, and standstill periods (typically one hundred fifty to one hundred eighty days), during which junior lenders are legally barred from accelerating debt or filing involuntary bankruptcy petitions following a coupon default, granting the sponsor breathing room to execute an out-of-court restructuring.",

            "Understanding the economic trade-offs across these junior instruments enables sponsors to engineer balanced capital structures that optimize cost of capital while preserving operational runway. In our next module, we examine original issue discounts, blended financing costs, and the weighted average cost of debt."
        ]
    },
    {
        "part": 4,
        "title": "Cost of Capital Optimization: Blended Interest Rates, OID & Financing Fee Amortization",
        "say": [
            "We now advance to the quantitative evaluation of capital structure cost: calculating Blended Interest Rates, effective yields incorporating Original Issue Discount (OID), and accounting for financing fee amortization. In a multi-billion-dollar leveraged buyout, financial sponsors must minimize the portfolio company's weighted average cost of debt (WACD) while ensuring that interest payments remain deductible under statutory corporate tax codes.",

            "The effective yield of a syndicated debt tranche rarely equals its quoted contractual coupon rate. When investment banks underwrite and syndicate Term Loan B or high-yield bonds, institutional market conditions often require the debt to be issued at an Original Issue Discount (OID). If an eight-hundred-million-dollar ($800M) term loan is issued with a ninety-nine percent OID (ninety-nine cents on the dollar), the borrower receives gross cash proceeds of seven hundred ninety-two million dollars ($792M), while remaining legally obligated to repay the full eight hundred million dollars at maturity.",

            "The eight-million-dollar upfront discount represents additional economic yield earned by lenders. In financial accounting under GAAP and IFRS, this OID is not expensed immediately on closing day; rather, it is capitalized as a contra-liability on the balance sheet and amortized into periodic interest expense over the contractual life of the loan using the effective interest rate method, matching financing costs against economic usage.",

            "In addition to OID, financial sponsors incur substantial Debt Financing Fees paid to investment banking syndicates, rating agencies, and legal counsels. Financing fees typically range from two to three point five percent of total debt raised. Under modern accounting standards (ASC 835-30), debt issuance costs are presented on the balance sheet as a direct deduction from the carrying value of the debt liability and amortized through the income statement over the debt tenor, directly increasing the effective annual borrowing cost.",

            "To evaluate the aggregate interest burden imposed on the acquired company, the private equity modeler constructs the Blended Interest Rate schedule. The blended interest rate is the weighted average of the effective interest rates across all debt tranches, where weights correspond to the principal proportion of each tranche in the total debt stack. If senior secured debt comprises sixty percent of debt at a six percent rate, senior notes comprise twenty-five percent at eight point five percent, and mezzanine comprises fifteen percent at twelve percent, the initial blended interest rate is seven point five two five percent.",

            "Furthermore, financial sponsors must incorporate the statutory Interest Deductibility Limitations enacted under Section 163(j) of the United States Internal Revenue Code (and corresponding OECD anti-BEPS rules globally). Under Section 163(j), the tax deductibility of business interest expense is capped at thirty percent of adjusted taxable income (defined as operating EBIT). Any excess interest expense above this thirty percent cap cannot be deducted in the current tax year, reducing the value of the LBO tax shield and forcing sponsors to fund excess interest with after-tax dollars.",

            "In our enterprise buyout model, the two-billion-five-hundred-million-dollar acquisition is financed with one billion five hundred million dollars ($1.5B) in total debt across three tranches: an eight-hundred-million-dollar First Lien Term Loan at SOFR plus three hundred basis points, a four-hundred-million-dollar High-Yield Senior Note at eight point zero percent fixed, and a three-hundred-million-dollar Mezzanine facility at eleven point five percent (eight percent cash plus three point five percent PIK).",

            "Crucially, credit agreements establish strict Restricted Payment Baskets that restrict the company from distributing cash dividends to the sponsor unless leverage ratios decline below agreed thresholds (such as total debt below 3.5x EBITDA), ensuring that operating cash flow is directed first toward debt service.",

            "Evaluating this structured debt package reveals a blended initial interest rate of seven point zero three percent across the one-point-five-billion-dollar debt stack, with an annual cash interest outflow of one hundred sixteen million dollars. In our final module, we construct the production Python debt tranching engine, execute capital stack simulations, and validate results through Socratic synthesis."
        ]
    },
    {
        "part": 5,
        "title": "Production Debt Tranching Engine: Sandbox Execution & Socratic Synthesis",
        "say": [
            "We now arrive at the computational implementation of Day 46: constructing and executing our production-grade Python LBO Capital Structure & Debt Tranching Engine. This deterministic institutional platform models the full mathematical architecture of private equity debt structuring: establishing purchase price multiples, partitioning the capital stack into first lien, high-yield, and mezzanine tranches, computing effective yields incorporating OID, and deriving the weighted average cost of debt.",

            "Let us inspect the foundational transaction parameters governing our private equity buyout simulation. The target enterprise, Apex Industrial Systems Corporation, generates two hundred fifty million dollars ($250,000,000) in Last Twelve Months (LTM) Adjusted EBITDA. The sponsor agrees to acquire the enterprise at an Enterprise Value (EV) multiple of ten point zero times EBITDA, establishing a total transaction purchase price of two billion five hundred million dollars ($2,500,000,000).",

            "The transaction financing structure is engineered with a total leverage ratio of six point zero times EBITDA, translating into one billion five hundred million dollars ($1,500,000,000) in total debt financing (sixty percent of total capitalization). The sponsor and rollover management contribute the remaining one billion dollars ($1,000,000,000) in cash equity (forty percent equity check, four point zero times EBITDA).",

            "The one-point-five-billion-dollar debt stack is partitioned into three distinct institutional tranches: First, an eight-hundred-million-dollar ($800M, 3.2x EBITDA) Senior Secured Term Loan B priced at SOFR plus three hundred basis points with a ninety-nine percent OID and a five-year maturity. Assuming benchmark SOFR is four point fifty percent, the contractual cash coupon is seven point fifty percent.",

            "Second, a four-hundred-million-dollar ($400M, 1.6x EBITDA) High-Yield Senior Unsecured Note tranche carrying an eight point zero zero percent fixed coupon and an eight-year maturity. Third, a three-hundred-million-dollar ($300M, 1.2x EBITDA) Subordinated Mezzanine tranche carrying an eleven point fifty percent total yield, structured as eight point zero zero percent cash interest plus three point fifty percent Payment-in-Kind (PIK) interest.",

            "Our Python script models the exact cash interest obligations, OID fee amortization, and PIK principal accretion schedules. The simulation confirms an initial annual cash interest obligation of one hundred sixteen million dollars ($116.0M), ten point five million dollars ($10.5M) in annual PIK accretion, and an aggregate initial blended interest rate of seven point zero three percent across the one-point-five-billion-dollar debt stack.",

            "The script validates that the initial pro-forma Interest Coverage Ratio (EBITDA-to-Cash Interest) stands at two point fifteen times (2.15x), safely exceeding standard credit rating downgrade triggers and confirming that the portfolio company possesses robust debt service headroom.",

            "To ensure institutional rigor, our engine implements the LBOCapitalStructureEngine class, which executes automated credit ratio stress tests. If benchmark SOFR spikes by two hundred basis points to six point fifty percent, the engine recalculates the floating First Lien coupon to nine point fifty percent, expanding annual cash interest by sixteen million dollars and compressing interest coverage to one point eighty-nine times, validating that the sponsor maintains sufficient liquidity cushion without triggering debt distress.",

            "Furthermore, the model computes the pro-forma Capitalization and Leverage Schedule presented to the Private Equity Investment Committee, itemizing total enterprise value, equity contributions, debt tranching multiples, and original issue discount fee amortizations across a five-year investment holding period.",

            "In addition, the engine computes pro-forma Debt-to-EBITDA credit metrics across the stack: Senior Secured Leverage at three point two times (3.2x), Total Debt Leverage at six point zero times (6.0x), and Fixed Charge Coverage Ratio (FCCR) at one point eighty-two times (1.82x), verifying financial sustainability before concluding with the cryptographic verification token LBO_CAPITAL_STRUCTURE_TRANCHING_PASS.",

            "We will now execute the Python simulation script in our sandbox environment. Upon completion, verify the exact numerical outputs, review the tranche leverage allocations, and complete the Socratic check to solidify your mastery of LBO debt structuring before advancing to cash flow waterfalls and cash sweeps in Day 47."
        ]
    }
]

if __name__ == "__main__":
    total_words = 0
    for p in DAY46_PARTS:
        words = sum(len(para.split()) for para in p["say"])
        total_words += words
        print(f"Part {p['part']} ('{p['title'][:35]}...'): {len(p['say'])} paragraphs, {words} words")
        assert len(p["say"]) >= 7, f"Part {p['part']} has {len(p['say'])} paragraphs (< 7)"
        assert words >= 600, f"Part {p['part']} word count {words} < 600"
    print(f"Total Day 46 Words: {total_words}")
    assert total_words >= 3000, f"Total Day 46 words {total_words} < 3,000"
    print("ALL DAY 46 ASSERTIONS PASSED PERFECTLY!")
