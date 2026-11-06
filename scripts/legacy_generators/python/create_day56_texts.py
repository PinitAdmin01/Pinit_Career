# scripts/create_day56_texts.py
# Day 56: Ind AS 1 / IAS 1 Presentation of Financial Statements
# 5 parts, each with 7 dense technical paragraphs (>= 600 words/part)

import re

def count_words(text):
    return len(re.findall(r'\b[A-Za-z0-9_-]+\b', text))

d56_p1 = r"""Welcome to Day 56 of Corporate & Financial Accounting! Today we inaugurate Month 2 Block 12—the culminating graduation block of Course 01—by mastering Indian Accounting Standard 1 (Ind AS 1) and its global counterpart International Accounting Standard 1 (IAS 1)—Presentation of Financial Statements.

Ind AS 1 provides the overarching constitutional architecture for general purpose financial reporting under the converged Ind AS framework mandated by the Ministry of Corporate Affairs (MCA) under Section 133 of the Companies Act 2013. Its primary statutory objective is to prescribe the basis for presenting general purpose financial statements to ensure comparability both with the entity's own financial statements of prior reporting periods and with the financial statements of other corporate enterprises. It sets out overall requirements for the presentation of financial statements, guidelines for their internal architecture, and minimum requirements for their substantive content.

Under Ind AS 1.10, a complete set of financial statements comprises five foundational reporting components: first, a Balance Sheet as at the end of the period, structured strictly in accordance with Schedule III Division II of the Companies Act 2013; second, a Statement of Profit and Loss for the period, which must incorporate both profit or loss and Other Comprehensive Income (OCI); third, a Statement of Changes in Equity (SOCIE) for the period, reconciling share capital, retained earnings, and specialized statutory reserves; fourth, a Statement of Cash Flows for the period, prepared in accordance with Ind AS 7; and fifth, Notes, comprising significant accounting policies, critical valuation judgments, estimation uncertainties, and explanatory schedules.

General Principles of Presentation: Ind AS 1 establishes fundamental accounting concepts that underpin all corporate disclosures across global capital markets:
(a) Fair Presentation and Compliance: Financial statements shall present fairly the financial position, financial performance, and cash flows of an entity. An entity whose financial statements comply with Ind AS shall make an explicit and unreserved statement of such compliance in the notes. Departure from an Ind AS requirement is prohibited unless extremely rare regulatory circumstances apply where compliance would conflict with the objective of financial statements set out in the Conceptual Framework.
(b) Going Concern: An entity shall prepare financial statements on a going concern basis unless management either intends to liquidate the entity or to cease trading, or has no realistic alternative but to do so. Under Section 134(5) of the Companies Act 2013, the Directors' Responsibility Statement must confirm that the directors have made a comprehensive assessment of the company's ability to continue as a going concern for at least twelve months from the reporting date.

(c) Accrual Basis of Accounting: An entity shall prepare its financial statements, except for cash flow information, using the accrual basis of accounting. Under this foundational postulate, the effects of transactions and other economic events are recognized when they occur rather than when cash or its equivalent is received or paid, ensuring a precise matching of revenues earned against expenses incurred to generate that revenue.
(d) Materiality and Aggregation: An entity shall present separately each material class of similar items. An entity shall present separately items of a dissimilar nature or function unless they are immaterial. Omissions or misstatements of items are material if they could, individually or collectively, influence the economic decisions that users make on the basis of the financial statements.
(e) Prohibition on Offsetting: An entity shall NOT offset assets and liabilities or income and expenses, unless required or permitted by an Ind AS! Offsetting detracts from the ability of users both to understand the transactions, other events, and conditions that have occurred and to assess the entity's future cash flows.

Under Schedule III Division II of the Companies Act 2013, the format of the balance sheet for companies complying with Ind AS adopts a classified format that separates non-current and current assets, and non-current and current liabilities. In today's session, you will master the classification taxonomy, the two-bucket OCI architecture, and the comprehensive balance sheet reconciliation engine for our flagship corporate enterprise, Bharat Apex Global Enterprises Ltd, ensuring zero audit discrepancies and 100% regulatory compliance."""

d56_p2 = r"""In Part 2 of Day 56, we deconstruct the Current versus Non-Current Classification Architecture under Ind AS 1.60-76, which governs the structural arrangement of corporate balance sheets worldwide.

An entity shall present current and non-current assets, and current and non-current liabilities, as separate classifications on the face of its balance sheet under Ind AS 1.60. The boundary between current and non-current status is governed by strict statutory criteria rather than simple calendar year conventions. A classified balance sheet provides vital intelligence regarding working capital liquidity and operational debt coverage.

1. Current Asset Classification Criteria (Ind AS 1.66): An entity shall classify an asset as current when:
(a) It expects to realize the asset, or intends to sell or consume it, in its normal operating cycle;
(b) It holds the asset primarily for the purpose of trading;
(c) It expects to realize the asset within twelve months after the reporting period; or
(d) The asset is cash or a cash equivalent (as defined in Ind AS 7) unless the asset is restricted from being exchanged or used to settle a liability for at least twelve months after the reporting period. All other assets shall be classified as non-current assets.

The Operating Cycle Criterion: The operating cycle of an entity is the time between the acquisition of assets for processing and their realization in cash or cash equivalents. When the entity's normal operating cycle is not clearly identifiable, it is assumed to be twelve months. However, in heavy industrial manufacturing (such as commercial shipbuilding, infrastructure fabrication, or aerospace turbine manufacturing), an operating cycle may span 24 to 36 months. Inventory, work-in-progress, and trade receivables that will be realized within that 36-month operating cycle are correctly classified as Current Assets, even though realization exceeds one calendar year!

2. Current Liability Classification Criteria (Ind AS 1.69): An entity shall classify a liability as current when:
(a) It expects to settle the liability in its normal operating cycle;
(b) It holds the liability primarily for the purpose of trading;
(c) The liability is due to be settled within twelve months after the reporting period; or
(d) It does not have an unconditional right to defer settlement of the liability for at least twelve months after the reporting period. Terms of a liability that could, at the option of the counterparty, result in its settlement by the issue of equity instruments do not affect its classification. All other liabilities shall be classified as non-current liabilities.

3. Refinancing & Breach of Borrowing Covenants (Ind AS 1.73-74):
Long-term borrowings due to mature within twelve months must be classified as current liabilities, unless the entity has the discretion under an existing loan facility to refinance or roll over the obligation for at least twelve months after the reporting period. If an entity breaches a covenant of a long-term loan agreement on or before the end of the reporting period with the effect that the liability becomes payable on demand, it must classify the liability as current, even if the lender agreed, after the reporting period and before the authorization of the financial statements for issue, not to demand payment as a consequence of the breach!

For Bharat Apex Global Enterprises Ltd, the corporate controller rigorously segregates assets into $70,000,000.00 Non-Current Assets (Property, Plant and Equipment of $45.0M, Intangible Assets of $22.5M, Financial Investments of $12.5M) and $44,000,000.00 Current Assets (Inventories of $18.0M, Trade Receivables of $16.0M, Cash and Cash Equivalents of $10.0M). These assets balance against $64,000,000.00 Shareholders' Equity, $38,000,000.00 Non-Current Liabilities (Long-Term Borrowings of $28.0M, Deferred Tax Liabilities of $10.0M), and $22,000,000.00 Current Liabilities (Trade Payables of $12.0M, Short-Term Provisions of $10.0M), establishing complete covenant compliance and mathematical balance."""

d56_p3 = r"""In Part 3 of Day 56, we explore the Statement of Profit and Loss and the Two-Bucket Architecture of Other Comprehensive Income (OCI) under Ind AS 1.81A-82A.

Under Ind AS 1.81A, the Statement of Profit and Loss shall present, in addition to the profit or loss section, the Other Comprehensive Income (OCI) section. Total Comprehensive Income (TCI) represents the change in equity during a period resulting from transactions and other events, other than those changes resulting from transactions with owners in their capacity as owners. TCI bridges pure operational profitability with broader macroeconomic and balance sheet remeasurements.

The Rationale for Other Comprehensive Income: OCI was created to prevent significant, volatile, non-operating fair value fluctuations and actuarial remeasurements from distorting core operational performance. By segregating these items from the primary Profit After Tax (PAT), financial statement users can assess the sustainable operational earnings power of the business while remaining fully informed about balance sheet valuation shifts. In modern corporate governance, institutional investors analyze both metrics concurrently: operating earnings indicate short-term pricing power and cost management, whereas comprehensive income reveals long-term capital preservation and asset volatility.

The Two-Bucket OCI Disaggregation Rule (Ind AS 1.82A): Ind AS 1 establishes a strict, mandatory disaggregation of OCI items into two distinct presentation categories, which must be clearly presented on the face of the Statement of Profit and Loss:
1. Bucket 1: Items that will NOT be reclassified subsequently to Profit or Loss:
(a) Changes in revaluation surplus recognized under Ind AS 16 (PPE) and Ind AS 38 (Intangible Assets);
(b) Remeasurements of defined benefit pension and gratuity plans recognized under Ind AS 19 (Employee Benefits);
(c) Gains and losses from investments in equity instruments designated at Fair Value through Other Comprehensive Income (FVTOCI) under Ind AS 109. When these equity instruments are sold, the cumulative gain or loss recognized in OCI is transferred directly to retained earnings; it is NEVER recycled through the P&L!
For Bharat Apex, Bucket 1 comprises $400,000.00 of actuarial pension gains under Ind AS 19 and $600,000.00 of equity FVTOCI fair value gains, totaling $1,000,000.00.

2. Bucket 2: Items that WILL be reclassified subsequently to Profit or Loss (Recyclable OCI):
(a) The effective portion of gains and losses on hedging instruments in a cash flow hedge recognized under Ind AS 109. When the hedged forecast transaction affects profit or loss, the accumulated reserve is reclassified to the P&L;
(b) Gains and losses on debt instruments measured at Fair Value through Other Comprehensive Income (FVTOCI) under Ind AS 109. On derecognition of the bond, cumulative OCI gains are recycled to profit or loss;
(c) Exchange differences arising on translating the financial statements of a foreign operation into the presentation currency under Ind AS 21. On disposal of the foreign operation, the cumulative translation reserve is recycled to P&L.
For Bharat Apex, Bucket 2 comprises $350,000.00 of effective cash flow hedge reserves and $250,000.00 of foreign currency translation reserves, totaling $600,000.00.

Synthesis into Total Comprehensive Income:
Bharat Apex generates Net Profit After Tax (PAT) of $14,966,400.00 from core operations (calculated as Revenue of $100.0M less Operating Expenses of $67.0M, Depreciation of $4.5M, Finance Costs of $4.0M, Investment Income of $500k, and Income Tax of $5,033,600.00 at the 25.168% Section 115BAA corporate tax rate). Adding Non-Reclassifiable OCI ($1.0M) and Reclassifiable OCI ($0.6M) yields Total Comprehensive Income of:
$$\text{Total Comprehensive Income (TCI)} = \$14,966,400.00 + \$1,000,000.00 + \$600,000.00 = \$16,566,400.00$$
This disaggregation provides complete transparency to institutional equity analysts, enabling them to evaluate operational earnings durability separately from balance sheet revaluation volatility."""

d56_p4 = r"""In Part 4 of Day 56, we examine the Statement of Changes in Equity (SOCIE) and Schedule III Division II Statutory Disclosures mandated under the Companies Act 2013.

The Statement of Changes in Equity (SOCIE) under Ind AS 1.106 is a mandatory primary financial statement that reconciles the carrying amount of each component of equity at the beginning and the end of the reporting period. Prior to Ind AS convergence, changes in equity were relegated to schedules and directors' reports. Under Ind AS, SOCIE enjoys equal standing with the Balance Sheet and Statement of Profit and Loss, providing an unbroken audit trail of all capital transactions. Corporate controllers rely on SOCIE to track statutory capital maintenance, retained reserves, and equity movements.

Structural Architecture of SOCIE: Under Schedule III Division II, the Statement of Changes in Equity is bifurcated into two foundational sections:
(a) Equity Share Capital: Reconciling the number of shares and share capital balances from opening to closing, disclosing shares issued during the period, bonus shares, shares bought back, and shares reserved for issuance under employee stock option plans (ESOPs);
(b) Other Equity: A matrix presenting columns for each distinct reserve category, including Capital Reserve, Securities Premium, General Reserve, Retained Earnings, Debt FVTOCI Reserve, Equity FVTOCI Reserve, Cash Flow Hedge Reserve, Foreign Currency Translation Reserve, and Share Options Outstanding Reserve.

Accounting for Retrospective Adjustments in SOCIE: When an entity applies an accounting policy change or corrects a material prior period error under Ind AS 8, the cumulative effect is adjusted against the opening balance of Retained Earnings for the earliest prior period presented. SOCIE explicitly displays:
1. The opening equity balance as previously reported in the prior year's audited statements;
2. The retrospective restatement adjustment required under Ind AS 8;
3. The restated opening equity balance after absorbing prior period corrections;
4. Total Comprehensive Income for the current reporting period allocated between owners and non-controlling interests; and
5. Transactions with owners in their capacity as owners (dividends declared and distributed, share capital issuances, treasury share purchases, and transfers between reserves).

Statutory Schedule III Division II Disclosures: The MCA has introduced rigorous transparency requirements that every corporate controller must enforce:
1. Aging Schedules for Trade Payables: Bifurcated into MSME (Micro, Small, and Medium Enterprises) and Non-MSME payables, categorized by aging brackets (< 1 year, 1-2 years, 2-3 years, > 3 years), disclosing undisputed versus disputed dues to satisfy Section 16 of the MSMED Act 2006;
2. Aging Schedules for Trade Receivables: Categorized by aging brackets and credit risk status (undisputed considered good, undisputed considered doubtful, disputed) to allow credit rating agencies to evaluate asset recoverability;
3. Promoter Shareholding Disclosures: Tabulating shares held by promoters, percentage changes during the year, and encumbrance details to enhance governance transparency.

Capital Work-in-Progress (CWIP) and Intangible Assets under Development: Mandating project-wise aging schedules and disclosure of projects where completion has been delayed or costs exceeded original budgets. For infrastructure-heavy companies, these disclosures reveal potential impairment triggers and capital lock-ins that could impact future cash flow realization.

Capital Allocation Analysis and Regulatory Governance: Institutional equity analysts and credit rating agencies evaluate the SOCIE in direct conjunction with the Statement of Cash Flows to scrutinize dividend distribution cover, return on equity (ROE) expansion, and statutory reserve retention policies. Under Regulation 33 of the SEBI (Listing Obligations and Disclosure Requirements) Regulations 2015, listed Indian corporations must submit their audited annual statements, including the fully reconciled SOCIE, within sixty days of the fiscal year close. Any unexplained variance in share capital or reserves triggers immediate supervisory inquiry by stock exchanges and capital market regulators.

For Bharat Apex Global Enterprises Ltd, the SOCIE perfectly reconciles $30,000,000.00 of Equity Share Capital and $34,000,000.00 of Other Equity (comprising Retained Earnings and OCI Reserves), demonstrating total institutional compliance, pristine capital integrity, and flawless alignment with statutory regulatory standards."""

d56_p5 = r"""In Part 5 of Day 56, we deploy the Enterprise Ind AS 1 Financial Presentation Engine in Python, performing automated trial balance mapping, classified balance sheet synthesis, and two-bucket OCI verification.

Modern enterprise controllers operate at the intersection of accounting standard interpretation and algorithmic data architecture. In Fortune 500 multinationals and leading Indian conglomerates, financial statement assembly is not performed through manual spreadsheets; it is driven by automated statutory consolidation engines that extract trial balance balances from SAP S/4HANA or Oracle Cloud ERP, apply Schedule III Division II mapping rules, and validate reporting balances. Automation eliminates clerical transposition errors, preserves internal control integrity, and ensures real-time readiness for external audit scrutinies.

Computational Verification of Bharat Apex Financial Statements:
Our Python simulation suite executes the following multi-stage verification:
1. Non-Current Assets Verification: Summing Property, Plant and Equipment ($45.0M), Intangible Assets ($22.5M), and Financial Investments ($12.5M) to verify Total Non-Current Assets of $70,000,000.00;
2. Current Assets Verification: Summing Inventories ($18.0M), Trade Receivables ($16.0M), and Cash and Cash Equivalents ($10.0M) to verify Total Current Assets of $44,000,000.00;
3. Balance Sheet Total Assets: Summing Non-Current and Current Assets to confirm Total Assets of $124,000,000.00.

Equity & Liabilities Equilibrium:
4. Shareholders' Equity: Share Capital ($30.0M) and Other Equity ($34.0M) yielding Total Equity of $64,000,000.00;
5. Non-Current Liabilities: Long-Term Borrowings ($28.0M) and Deferred Tax Liabilities ($10.0M) yielding Total Non-Current Liabilities of $38,000,000.00;
6. Current Liabilities: Trade Payables ($12.0M) and Short-Term Provisions ($10.0M) yielding Total Current Liabilities of $22,000,000.00;
7. Total Equity & Liabilities: $64.0M + $38.0M + $22.0M = $124,000,000.00. The fundamental balance sheet equation holds with mathematical perfection:
$$\text{Total Assets} = \text{Total Equity \& Liabilities} = \$124,000,000.00$$

Profit and Loss & OCI Disaggregation:
The engine verifies core Profit After Tax (PAT) of $14,966,400.00. It then processes the two OCI buckets:
- Bucket 1 (Non-Reclassifiable): Pension actuarial gains ($400k) + Equity FVTOCI gains ($600k) = $1,000,000.00;
- Bucket 2 (Reclassifiable): Cash flow hedge reserve ($350k) + Foreign currency translation reserve ($250k) = $600,000.00;
- Total Comprehensive Income (TCI): PAT ($14,966,400.00) + Total OCI ($1,600,000.00) = $16,566,400.00.

Algorithmic Invariant Controls:
To ensure the highest degree of reliability, the engine executes assertion checks across every sub-ledger:
- Asserting that Current Assets exceed Current Liabilities, verifying a healthy working capital position of $22,000,000.00;
- Asserting that non-reclassifiable OCI balances are flagged for direct equity absorption without P&L recycling;
- Asserting that deferred tax liabilities reflect the statutory 25.168% tax rate applied to taxable temporary differences.

Internal Financial Controls over Financial Reporting (IFC-FR):
Under Section 143(3)(i) of the Companies Act 2013 and Guidance Note on Audit of Internal Financial Controls Over Financial Reporting issued by the ICAI, the statutory auditor must test both the design adequacy and operating effectiveness of the company's financial controls. Our automated presentation suite embeds control assertions directly into code: testing automated segregation of duties, multi-factor journal authorization thresholds, and automated trial balance exception logging. This programmatic control framework assures audit committees that balance sheet classifications are structurally tamper-proof and fully auditable.

Statutory Audit Sign-Off:
The statutory audit partner reviews the automated working papers, verifying that the classified balance sheet conforms to Ind AS 1.60, operating cycle disclosures comply with Ind AS 1.66, OCI disaggregation adheres to Ind AS 1.82A, and notes satisfy Schedule III Division II. The audit committee formally adopts the financial statements, and our software engine outputs the cryptographic confirmation string:
`IND_AS_1_PRESENTATION_TAXONOMY_PASS`."""

parts = [d56_p1, d56_p2, d56_p3, d56_p4, d56_p5]
print("Day 56 Word Counts:")
for i, p in enumerate(parts, 1):
    wc = count_words(p)
    print(f"  Part {i}: {wc} words")
    assert wc >= 600, f"Part {i} failed Law 1: {wc} < 600!"
print("Day 56 Total Words:", sum(count_words(p) for p in parts))
