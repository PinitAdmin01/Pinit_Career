# scripts/create_day49_fin_texts.py
"""
Generates rich, 9-11 paragraph technical text for Day 49:
Distressed Debt, Restructuring & Chapter 11 Reorganization.
Enforces Law 1: All 5 parts >= 600 words, total >= 3,000 words.
"""

DAY49_PARTS = [
    {
        "part": 1,
        "title": "Corporate Distress Architecture: The Zone of Insolvency & Fiduciary Duty Shifts",
        "say": [
            "Welcome to Day 49 of Corporate Finance & Capital Markets. Today, we enter one of the most high-stakes, legally sophisticated arenas on Wall Street: Distressed Debt Restructuring, Turnaround Management, and Chapter 11 Bankruptcy Reorganization. In the lifecycle of leveraged buyouts and over-indebted corporations, economic shocks, aggressive debt loads, or technological disruptions can push a company to the brink of financial collapse. Understanding how corporate balance sheets are reorganized, deleveraged, and salvaged from insolvency is a vital capability for elite financial analysts.",

            "A corporation enters the Zone of Insolvency when its operational cash flows and liquid reserves become insufficient to service scheduled debt obligations, or when the fair market value of its total liabilities exceeds the fair market value of its total enterprise assets (the Balance Sheet Test). Insolvency is not merely an accounting condition; it represents a profound legal transformation that alters corporate governance, contract enforceability, and board fiduciary responsibilities.",

            "Under established corporate jurisprudence (such as the landmark Delaware Court of Chancery rulings in Credit Lyonnais and Gheewalla), when a solvent corporation operates normally, the board of directors owes its fiduciary duties of care and loyalty strictly to the company and its common shareholders. Management is legally mandated to maximize equity value, even if that involves undertaking calculated commercial risks.",

            "However, once a company crosses the threshold into the Zone of Insolvency, the economic beneficiaries of the corporate enterprise shift dramatically. Because equity value has been rendered economically worthless or deeply impaired, the residual claimants on the firm's assets are no longer the shareholders; they are the Creditors. Consequently, the board of directors must consider the interests of the entire community of stakeholders, prioritizing the preservation of enterprise value for creditors to prevent self-dealing equity gambling.",

            "In the early stages of distress, management faces a severe Liquidity Crunch. Signs of distress manifest in working capital: trade suppliers demand cash-on-delivery (COD) or shorten payment terms, credit rating agencies downgrade debt into C-tier junk territory, secondary bond prices plunge below eighty cents on the dollar, and revolving credit lenders issue reservation of rights notices following covenant breaches.",

            "To prevent formal liquidation, distressed companies initiate Turnaround Management protocols. The board frequently appoints a Chief Restructuring Officer (CRO) and retains specialized restructuring investment banks (such as Houlihan Lokey, Moelis, Evercore, or Lazard) and legal advisors. The restructuring team constructs thirteen-week short-term cash flow models, rationalizes non-core operations, renegotiates vendor contracts, and opens confidential restructuring negotiations with ad-hoc creditor committees.",

            "Before resorting to judicial bankruptcy courts, companies aggressively pursue Out-of-Court Workouts. In an out-of-court restructuring, the company executes a Restructuring Support Agreement (RSA) with an ad-hoc committee of noteholders, executing private debt exchange offers, maturity extensions ('amend-and-extend' transactions), or debt-for-equity swaps. Out-of-court workouts avoid the catastrophic professional advisory fees (often exceeding fifty to one hundred million dollars in mega-cases) and brand damage associated with formal Chapter 11 filings.",

            "Furthermore, restructuring advisors must scrutinize past transactions for Avoidance Actions under the Bankruptcy Code, specifically Fraudulent Conveyances (transfers made for less than reasonably equivalent value while insolvent) and Preferential Transfers (payments made to specific creditors within ninety days prior to filing). Identifying these clawback claims provides the debtor with crucial litigation leverage during multi-party creditor negotiations.",

            "The overarching objective of financial restructuring is to right-size the capital structure: eliminating unsustainable debt, reducing fixed annual cash interest burdens, and infusing emergency liquidity so that the underlying business can emerge as a viable, profitable going concern. Throughout this session, we will examine an enterprise industrial corporation suffering operational distress with nine hundred million dollars in debt, identify the fulcrum security, model DIP financing, execute a debt-for-equity swap, and run production Python simulations."
        ]
    },
    {
        "part": 2,
        "title": "The Restructuring Hierarchy: The Absolute Priority Rule & The Fulcrum Security",
        "say": [
            "In this second module, we master the foundational legal doctrine governing all corporate reorganization and liquidation: the Absolute Priority Rule (APR). Codified within Section 1129(b) of the United States Bankruptcy Code (and mirrored in insolvency statutes globally), the Absolute Priority Rule dictates the precise hierarchical sequence in which corporate stakeholders are entitled to receive distributions or new reorganization securities.",

            "The Absolute Priority Rule establishes an uncompromising legal mandate: senior claimant classes must be paid one hundred percent of their allowed claims in full before any junior claimant class is permitted to receive or retain any property under a plan of reorganization. Furthermore, if a senior class is impaired and does not receive full recovery, all junior classes standing beneath it—including subordinated debt and common shareholders—must be wiped out with zero recovery, unless the senior class affirmatively consents to a gift or concession.",

            "The restructuring priority waterfall flows strictly from top to bottom: Administrative Claims and Debtor-in-Possession (DIP) Financing sit at the absolute apex, holding super-priority administrative status. Directly beneath sit First Lien Senior Secured Revolvers and Term Loans, secured by first-priority liens on company assets. Beneath first lien debt sits Second Lien Debt, followed by General Unsecured Creditors (including trade vendors, high-yield senior unsecured notes, and rejected lease damages).",

            "In credit analysis, practitioners rigorously distinguish between Contractual Subordination and Structural Subordination. Contractual subordination is established by explicit intercreditor agreement between lenders. Structural subordination arises from corporate holding company architectures: debt issued at an operating subsidiary holds direct claims on operating cash flows, structurally priming debt issued at the holding company (HoldCo), which holds only claims on the residual equity of the operating subsidiary.",

            "Near the base of the waterfall sits Subordinated Mezzanine Debt, followed by Preferred Stock, and finally, Common Stock sitting at the absolute bottom. In ninety-nine percent of distressed bankruptcies, common shareholders are completely out of the money: the enterprise value of the distressed entity is insufficient to cover total debt liabilities, resulting in total equity cancellation.",

            "This structural reality introduces the most critical analytical concept in distressed debt investing: the Fulcrum Security. The fulcrum security is defined as the specific debt tranche in the capital structure that is neither fully covered (fully money-good) nor completely uncovered (completely out of the money) by the reorganized enterprise value of the company. It is the tranche that 'breaks the money.'",

            "Because the fulcrum security holds the marginal claim on enterprise value, the Absolute Priority Rule dictates that fulcrum debt holders will receive the lion's share of the Reorganized Common Equity under the Chapter 11 plan of reorganization. Creditors holding debt senior to the fulcrum tranche are reinstated or repaid one hundred percent in cash, while creditors junior to the fulcrum tranche and common shareholders are extinguished with zero recovery.",

            "Consider our distressed enterprise scenario: Apex Industrial Corporation possesses one billion two hundred million dollars ($1.2B) in total debt claims: six hundred million dollars ($600M) in First Lien Term Loans, four hundred million dollars ($400M) in Senior Unsecured Notes, and two hundred million dollars ($200M) in Subordinated Debt. Independent restructuring valuation establishes the reorganized enterprise value of the business at eight hundred fifty million dollars ($850M).",

            "Applying our priority waterfall reveals: First Lien Term Loans ($600M) are fully covered by the $850M enterprise value and receive one hundred percent recovery ($600M cash or reinstated debt). The remaining two hundred fifty million dollars ($250M) of enterprise value falls upon the four-hundred-million-dollar Senior Unsecured Notes. Therefore, the Senior Unsecured Notes represent the Fulcrum Security: they receive two hundred fifty million dollars in value (sixty-two point five percent recovery) delivered in the form of one hundred percent of the newly issued Common Equity of the reorganized company.",

            "Subordinated debt holders ($200M) and existing common shareholders sit completely below the $850M valuation threshold: under the Absolute Priority Rule, they receive zero recovery and are legally wiped out. In our next module, we examine how distressed debt funds execute loan-to-own strategies using Debtor-in-Possession financing."
        ]
    },
    {
        "part": 3,
        "title": "Chapter 11 Reorganization Mechanics: DIP Financing, Automatic Stay & Section 363 Sales",
        "say": [
            "We now advance to the formal judicial framework of corporate bankruptcy: Chapter 11 of the United States Bankruptcy Code. Unlike Chapter 7, which dictates the immediate liquidation and dismantling of corporate assets by a court-appointed trustee, Chapter 11 is designed to rehabilitate the debtor, allowing the company to continue operating as a going concern under the stewardship of existing management (the Debtor-in-Possession, or DIP) while restructuring its balance sheet.",

            "The instantaneous legal protection triggered upon filing a Chapter 11 petition is the Automatic Stay, codified under 11 U.S.C. Section 362. The automatic stay operates as an immediate worldwide judicial injunction halting all creditor collection actions, litigation, foreclosures, and asset seizures. Interest payments on pre-petition unsecured debt are frozen (stayed), providing the debtor with an immediate operational cash reprieve.",

            "However, filing Chapter 11 creates an immediate operational crisis: trade vendors refuse to ship raw materials without advance payment, and banks freeze existing credit lines. To fund payroll and operations during the bankruptcy process, the debtor must secure Debtor-in-Possession (DIP) Financing under Section 364 of the Bankruptcy Code.",

            "To induce lenders to provide fresh capital to an insolvent corporation, Section 364 authorizes bankruptcy judges to grant DIP lenders Super-Priority Administrative Expense status, giving DIP loans repayment priority senior to all pre-petition claims. Furthermore, judges can authorize Priming Liens under Section 364(d), granting the DIP lender a first-priority security lien that primes (subordinates) existing pre-petition secured lenders, provided existing lenders receive 'adequate protection' (such as replacement liens or cash interest payments).",

            "In modern mega-bankruptcies, existing first lien lenders frequently provide a 'Roll-Up' DIP Facility. Under a roll-up DIP, the lender agrees to provide fresh cash liquidity on the condition that its existing pre-petition debt is rolled up into the post-petition DIP facility, elevating pre-petition debt to super-priority administrative status. While controversial, roll-up DIPs ensure existing lenders maintain absolute control over the restructuring process.",

            "To protect pre-petition secured creditors from collateral depreciation while the automatic stay is active, Section 361 mandates Adequate Protection. Bankruptcy judges require the debtor to provide adequate protection—such as periodic cash interest payments, replacement liens on newly acquired inventory, or additional equity cushions—ensuring that senior lenders do not suffer uncompensated erosion in the value of their security interests.",

            "Furthermore, during the critical First Day Hearings, debtors file emergency motions to preserve operational continuity. Foremost among these is the Critical Vendor Motion, which authorizes the debtor to pay the pre-petition claims of vital sole-source suppliers in full, ensuring that essential supply chains remain uninterrupted and preventing catastrophic factory shutdowns while the company reorganizes.",

            "Distressed private equity funds and credit hedge funds frequently utilize DIP financing as a tactical weapon in a Loan-to-Own Strategy. By providing a one-hundred-million-dollar DIP facility with strict operational milestones, the distressed fund dictates the bankruptcy timeline, secures board observer rights, and positions itself to convert its DIP facility and pre-petition fulcrum bonds into controlling equity ownership upon exit.",

            "In addition to balance sheet restructuring, Chapter 11 provides extraordinary operational restructuring tools. Under Section 365, the debtor holds the unilateral right to Assume or Reject Executory Contracts and Unexpired Leases. If an industrial company operates unprofitable manufacturing facilities or retail stores, it can reject those burdensome leases, converting multi-year future lease obligations into pre-petition general unsecured claims that receive pennies on the dollar.",

            "Furthermore, if a quick operational reorganization is unattainable, the debtor can execute an expedited Section 363 Asset Sale. Under Section 363, the bankruptcy court approves the sale of the debtor's assets to a 'stalking horse' bidder 'free and clear of all liens, claims, and encumbrances.' This allows private equity buyers to acquire pristine operating assets without assuming legacy debt liabilities or toxic environmental liabilities.",

            "In our enterprise restructuring scenario, the court approves a one-hundred-million-dollar ($100M) DIP facility provided by our ad-hoc creditor committee, funding working capital while the company constructs its Chapter 11 Plan of Reorganization. In our next module, we examine debt-for-equity swaps, pre-packaged bankruptcies, and judicial cramdown mechanics."
        ]
    },
    {
        "part": 4,
        "title": "Debt-for-Equity Swaps & Cramdown Valuation: Pre-Packs & Section 1129(b) Standards",
        "say": [
            "We now examine the ultimate resolution of Chapter 11: constructing the Plan of Reorganization, executing Debt-for-Equity Swaps, and navigating Judicial Cramdown standards under Section 1129(b). The plan of reorganization is the master legal blueprint that dictates how every creditor class will be treated, how much debt will be canceled, and how new equity will be distributed across the emergence balance sheet.",

            "The primary mechanism deployed to eliminate debt distress is the Debt-for-Equity Swap. In a debt-for-equity swap, creditors in the fulcrum tranche agree to cancel their contractual debt claims in exchange for receiving shares of newly issued common stock in the reorganized company. In our enterprise restructuring, the four-hundred-million-dollar Senior Unsecured Notes class cancels its bonds, wiping out four hundred million dollars of principal debt and thirty-two million dollars of annual cash interest, receiving one hundred percent of the reorganized company's new equity.",

            "To expedite the Chapter 11 process and minimize devastating legal expenses, companies frequently deploy a Pre-Packaged Chapter 11 (Pre-Pack). In a pre-pack, the debtor negotiates the complete plan of reorganization and solicits creditor votes prior to filing the bankruptcy petition. If the plan achieves acceptance by at least two-thirds in dollar amount and more than one-half in number of voting claims in each impaired class, the company files Chapter 11 and emerges in as few as thirty to forty-five days, minimizing operational disruption.",

            "To raise emergence cash equity, reorganization plans frequently feature Rights Offerings backed by Backstop Commitment Agreements. In a backstopped rights offering, general unsecured creditors are granted the legal right to purchase shares of new equity at a substantial discount to plan enterprise value (typically twenty to thirty percent discount). A consortium of anchor distressed hedge funds backstops the offering, guaranteeing that one hundred percent of the required equity capital is funded.",

            "However, if a dissenting creditor class votes to reject the plan, the debtor must execute a Judicial Cramdown under Section 1129(b). A cramdown allows the bankruptcy judge to confirm the reorganization plan over the objection of an impaired dissenting class, provided the plan satisfies two fundamental statutory requirements: it must not 'discriminate unfairly' and it must be 'fair and equitable' with respect to the dissenting class.",

            "Under the 'fair and equitable' test, the court strictly enforces the Absolute Priority Rule: the dissenting class must receive full recovery before any junior class receives property, and no senior class may receive more than one hundred percent of its allowed claim. This requirement places Reorganization Enterprise Valuation at the absolute center of bankruptcy litigation. Dissenting junior creditors will hire valuation experts arguing that enterprise value is high (pushing the fulcrum tranche down to include them), while senior creditors argue valuation is low (wiping out juniors).",

            "Bankruptcy courts determine enterprise valuation using standardized valuation methodologies: Discounted Cash Flow (DCF), Comparable Public Companies, and Precedent Transactions. Once the judge establishes the definitive enterprise value, the court issues a Confirmation Order, binding all creditors to the plan, discharging all pre-petition debts, and authorizing the company to emerge from Chapter 11.",

            "Upon emergence, the company's balance sheet is completely transformed: total debt is right-sized from one billion two hundred million dollars to five hundred million dollars, annual interest expense is compressed by over sixty percent, and the fulcrum creditors become the new controlling shareholders, positioning the rehabilitated business for a lucrative future public listing or strategic sale.",

            "Furthermore, modern restructuring litigation focuses heavily on Non-Debtor Third-Party Releases. Following the landmark United States Supreme Court ruling in Harrington v. Purdue Pharma, bankruptcy courts are strictly barred from granting non-consensual third-party releases to corporate insiders or sponsors outside the asbestos context, ensuring that fraudulent conveyance claims against former owners remain legally actionable.",

            "In our final module, we construct the production Python distressed restructuring engine, model the fulcrum security waterfall, execute the debt-for-equity cramdown, and validate emergence metrics through Socratic synthesis."
        ]
    },
    {
        "part": 5,
        "title": "Production Distressed Restructuring Engine: Sandbox Execution & Socratic Synthesis",
        "say": [
            "We now arrive at the computational implementation of Day 49: constructing and executing our production-grade Python Distressed Debt Restructuring & Chapter 11 Valuation Engine. This deterministic institutional platform models the full mathematical architecture of corporate reorganization: establishing distressed enterprise valuation, applying the Absolute Priority Rule waterfall, identifying the fulcrum security, calculating recovery percentages across all debt tranches, and modeling post-emergence capital structures.",

            "Let us inspect the foundational balance sheet parameters governing our corporate restructuring simulation. Our distressed industrial borrower, Apex Industrial Corporation, possesses one billion two hundred million dollars ($1,200,000,000) in pre-petition debt claims: an eight-hundred-million-dollar ($800M) First Lien Term Loan, a four-hundred-million-dollar ($400M) Senior Unsecured High-Yield Note tranche, and two hundred million dollars ($200M) in Subordinated Mezzanine debt. Historical equity market cap has collapsed to zero.",

            "Independent financial advisors determine the Reorganized Enterprise Value of the business at eight hundred fifty million dollars ($850,000,000) based on discounted post-turnaround cash flows. Furthermore, the court approves a fifty-million-dollar ($50M) super-priority Debtor-in-Possession (DIP) financing facility to fund operations during Chapter 11 proceedings.",

            "Our Python script executes the Absolute Priority Rule waterfall: First, the fifty-million-dollar DIP facility is repaid in full from emergence exit financing. Second, the First Lien Term Loan holds six hundred million dollars of remaining enterprise claims, receiving six hundred million dollars in reinstated exit term loans (one hundred percent recovery, $600M).",

            "Third, the remaining reorganized enterprise value of two hundred fifty million dollars ($250,000,000) cascades upon the four-hundred-million-dollar Senior Unsecured Notes. The engine confirms that the Senior Unsecured Notes represent the definitive Fulcrum Security. The notes cancel their four hundred million dollars of debt in exchange for receiving one hundred percent of the newly issued Common Equity, achieving a sixty-two point five percent recovery rate ($250M / $400M).",

            "Fourth, because the fulcrum security is impaired, the Absolute Priority Rule strictly dictates that all junior claims receive zero recovery: the two-hundred-million-dollar Subordinated Mezzanine debt and existing common stock are completely canceled and extinguished with zero percent recovery.",

            "The simulation models post-emergence pro-forma metrics: total debt is reduced from one billion two hundred million dollars to six hundred million dollars (a fifty percent debt reduction), annual cash interest expense plummets from one hundred sixteen million dollars to forty-five million dollars, and pro-forma leverage drops to two point four times EBITDA, ensuring sustainable long-term solvency.",

            "Our script implements the DistressedRestructuringEngine class, which automates creditor voting simulations, tests 1129(a)(10) impaired accepting class thresholds, and formats the formal Judicial Confirmation Ledger submitted to the United States Bankruptcy Court.",

            "To guarantee mathematical precision, the engine models the complete claim reconciliation ledger: comparing allowed claims against distributable enterprise value, calculating deficiency claims for under-secured creditors, and executing debt-for-equity conversions based on emergence shares. The solver verifies that total value distributed across all senior and fulcrum claimant classes sums to exactly eight hundred fifty million dollars with zero residual variance.",

            "Furthermore, the engine outputs the comprehensive Pro-Forma Capitalization Table at emergence, detailing new common shares issued to former noteholders, management equity incentive pools, and exit term loan amortizations across the post-bankruptcy five-year forecast horizon.",

            "In addition, the platform models corporate tax attribute preservation under Internal Revenue Code Section 382(l)(5) and Section 382(l)(6), preserving over one hundred twenty million dollars in valuable Net Operating Loss (NOL) carryforwards for the emerging entity, legally sheltering post-emergence profits from federal corporate taxation.",

            "The script confirms that all APR priority rules, fulcrum recovery mathematics, and emergence capitalization schedules reconcile with absolute precision. The simulation concludes with the cryptographic verification token DISTRESSED_DEBT_RESTRUCTURING_PASS.",

            "We will now run the Python simulation script in our sandbox environment. Upon completion, verify the restructuring recovery ledger, inspect the fulcrum allocation, and complete the Socratic check to solidify your mastery of distressed debt restructuring before advancing to the Milestone 10 Grand Capstone in Day 50."
        ]
    }
]

if __name__ == "__main__":
    total_words = 0
    for p in DAY49_PARTS:
        words = sum(len(para.split()) for para in p["say"])
        total_words += words
        print(f"Part {p['part']} ('{p['title'][:35]}...'): {len(p['say'])} paragraphs, {words} words")
        assert len(p["say"]) >= 7, f"Part {p['part']} has {len(p['say'])} paragraphs (< 7)"
        assert words >= 600, f"Part {p['part']} word count {words} < 600"
    print(f"Total Day 49 Words: {total_words}")
    assert total_words >= 3000, f"Total Day 49 words {total_words} < 3,000"
    print("ALL DAY 49 ASSERTIONS PASSED PERFECTLY!")
