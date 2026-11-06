# scripts/create_day59_texts.py
# Day 59: Ind AS 10 / IAS 10 Events after the Reporting Period & Going Concern Assessment
# 5 parts, each with 7 dense technical paragraphs (>= 600 words/part)

import re

def count_words(text):
    return len(re.findall(r'\b[A-Za-z0-9_-]+\b', text))

d59_p1 = r"""Welcome to Day 59 of Corporate & Financial Accounting! Today we master Indian Accounting Standard 10 (Ind AS 10) and International Accounting Standard 10 (IAS 10)—Events after the Reporting Period.

In corporate financial reporting, the fiscal year end (typically March 31 in India or December 31 under international frameworks) marks the cutoff date for recording transactions. However, the preparation, audit, and formal release of general purpose financial statements takes several weeks or months. During this post-balance sheet interregnum—the window between the end of the reporting period and the date when financial statements are approved for issue by the Board of Directors—new economic events inevitably occur: major customers may declare insolvency, pending litigations may be decided by courts, industrial fires may destroy warehouses, or corporate dividends may be declared. Ind AS 10 establishes the definitive regulatory framework governing how an enterprise must account for and disclose these subsequent events.

The Temporal Window of Ind AS 10:
Ind AS 10 applies to events, both favorable and unfavorable, that occur between the end of the reporting period and the date when the financial statements are approved for issue by the Board of Directors.
Understanding the Approval Date:
- Under Section 134(1) of the Companies Act 2013, financial statements must be signed on behalf of the Board of Directors at least by the Chairperson of the company where he is authorized by the Board, or by two directors out of which one shall be the managing director, and the Chief Executive Officer, the Chief Financial Officer, and the Company Secretary, wherever they are appointed.
- In some jurisdictions, financial statements are submitted to shareholders for approval after they have been issued. Under Ind AS 10.5, the financial statements are approved for issue on the date of approval by the Board of Directors, NOT on the date when shareholders approve them at the Annual General Meeting (AGM).
- Events occurring after the date the financial statements are approved for issue by the Board of Directors do not fall within the scope of Ind AS 10; they are accounted for in the subsequent financial period.

The Two Distinct Classes of Subsequent Events (Ind AS 10.3):
Ind AS 10 establishes a strict binary categorization of events occurring during the post-balance sheet window:
1. Adjusting Events after the Reporting Period: Those that provide evidence of conditions that existed at the end of the reporting period. These events require the entity to adjust the amounts recognized in its financial statements (both the Balance Sheet and Statement of Profit and Loss)!
2. Non-Adjusting Events after the Reporting Period: Those that are indicative of conditions that arose after the reporting period. These events do NOT result in adjustments to the amounts recognized in the financial statements; however, if material, they require comprehensive narrative and financial disclosure in the explanatory notes!

The Core Conceptual Rationale:
The boundary between adjusting and non-adjusting events reflects the fundamental objective of financial reporting: providing a true and fair view of the entity's financial position at the reporting date. If an event reveals facts that were already latent or developing as of March 31, failing to adjust the financial statements would present an inaccurate picture of asset recoverability or liability obligations. Conversely, if an event represents a brand new economic shock that occurred in April or May, adjusting the March 31 balance sheet would violate the historical cutoff and distort the financial position of the prior year.

The Regulatory and Governance Horizon:
During the subsequent events review period, the Chief Financial Officer, statutory audit partner, and Audit Committee maintain continuous communication. Under Standard on Auditing (SA) 560 (Subsequent Events), auditors are legally obligated to perform specific audit procedures up to the date of the auditor's report: reading minutes of board and management meetings, reviewing latest interim management accounts, inquiring with corporate legal counsel regarding litigation developments, and inspecting material customer credit profiles.

For Bharat Apex Global Enterprises Ltd, the corporate reporting close for the fiscal year ended March 31, 2026 is evaluated prior to the Board meeting on May 15, 2026. During this six-week window, four major events occur: a major customer bankruptcy, a court litigation decree, a warehouse fire, and a board proposal for equity dividends. In today's session, you will master the legal classification and financial quantification of each event, ensuring total compliance with Ind AS 10."""

d59_p2 = r"""In Part 2 of Day 59, we deconstruct Adjusting Events under Ind AS 10.8-9, analyzing forensic evidence standards and executing balance sheet and profit-and-loss adjustments.

The Statutory Rule for Adjusting Events (Ind AS 10.8):
An entity shall adjust the amounts recognized in its financial statements to reflect adjusting events after the reporting period.
Under Ind AS 10.9, the following are classic examples of adjusting events requiring adjustments to financial statement line items:
(a) The settlement after the reporting period of a court case that confirms that the entity had a present obligation at the end of the reporting period;
(b) The receipt of information after the reporting period indicating that an asset was impaired at the end of the reporting period, or that the amount of a previously recognized impairment loss needs to be adjusted;
(c) The determination after the reporting period of the cost of assets purchased, or the proceeds from assets sold, before the end of the reporting period;
(d) The determination after the reporting period of the amount of profit-sharing or bonus payments, if the entity had a present legal or constructive obligation at the end of the reporting period;
(e) The discovery of fraud or errors that show that the financial statements are incorrect.

Case Study 1: Major Customer Insolvency at Bharat Apex:
On March 31, 2026, Bharat Apex held a trade receivable balance of $2,500,000.00 from a major industrial client, Apex Heavy Industries. The client had an existing expected credit loss (ECL) allowance of zero based on historical payments.
- Post-Balance Sheet Event: On April 15, 2026, Apex Heavy Industries filed for corporate insolvency under the Insolvency and Bankruptcy Code (IBC).
- Forensic Evaluation: The insolvency filing was not an instantaneous shock; forensic investigation revealed that Apex Heavy Industries had been suffering severe structural liquidity distress, cash flow insolvency, and operational losses throughout the final quarter of FY 2025-26. The bankruptcy decree on April 15 confirms that condition of insolvency existed at the balance sheet date of March 31.
- Expected Recovery Analysis: Court insolvency filings indicate an anticipated liquidation dividend of only $500,000.00.
- Accounting Adjustment: Bharat Apex must recognize an additional Expected Credit Loss (ECL) bad debt impairment loss of:
$$\text{ECL Impairment Loss} = \$2,500,000.00 - \$500,000.00 = \$2,000,000.00$$
Journal Entry Recorded as of March 31, 2026:
- Debit: Impairment Loss on Financial Assets (Operating P&L) $2,000,000.00
- Credit: Allowance for Expected Credit Losses (Contra-Asset to Trade Receivables) $2,000,000.00.

Case Study 2: Court Litigation Settlement Decree:
On March 31, 2026, Bharat Apex was defending an ongoing patent infringement lawsuit filed by a competitor. Based on legal advice available in March, the company had established a litigation provision of $1,000,000.00 under Ind AS 37.
- Post-Balance Sheet Event: On April 28, 2026, the High Court issued a final and binding decree ordering Bharat Apex to pay $1,800,000.00 in total damages and legal costs to settle the infringement claim.
- Forensic Evaluation: The patent infringement occurred during the fiscal year 2025-26; the court decree does not create a new liability but provides conclusive judicial evidence of the exact monetary obligation existing at the reporting date.
- Accounting Adjustment: Bharat Apex must record an additional provision expense of:
$$\text{Additional Litigation Expense} = \$1,800,000.00 - \$1,000,000.00 = \$800,000.00$$
Journal Entry Recorded as of March 31, 2026:
- Debit: Legal & Litigation Claims Expense (Operating P&L) $800,000.00
- Credit: Provision for Legal Obligations (Current Liabilities) $800,000.00.

Combined Financial Statement Impact:
Summing the customer insolvency impairment ($2.0M) and the court litigation adjustment ($800k) results in a total pre-tax charge of:
$$\text{Total Pre-Tax Adjusting Loss} = \$2,000,000.00 + \$800,000.00 = \$2,800,000.00$$
Profit Before Tax (PBT) in the draft financial statements is reduced by $2,800,000.00, reducing current corporate tax liabilities under Section 115BAA by $704,704.00 ($2.8M $\times$ 25.168%), and decreasing net Profit After Tax (PAT) by $2,095,296.00.

Statutory Audit Verification of Adjusting Working Papers:
External auditors inspect the IBC petition filed with the National Company Law Tribunal (NCLT) and obtain a direct legal confirmation letter from external litigation counsel. The audit working papers confirm that both adjustments satisfy Ind AS 10.9 criteria, ensuring that balance sheet carrying values reflect true economic reality."""

d59_p3 = r"""In Part 3 of Day 59, we deconstruct Non-Adjusting Events under Ind AS 10.10-13, focusing on disclosure standards, casualty losses, and the revolutionary Proposed Dividends Rule under Ind AS 10.12.

The Statutory Rule for Non-Adjusting Events (Ind AS 10.10):
An entity shall NOT adjust the amounts recognized in its financial statements to reflect non-adjusting events after the reporting period.
Under Ind AS 10.11 and Ind AS 10.22, non-adjusting events are those that indicate conditions that arose subsequent to the balance sheet date. Examples include:
(a) Major business combinations under Ind AS 103 or disposals of major subsidiaries after the reporting period;
(b) Announcing a plan to discontinue an operation;
(c) Major purchases of assets or classification of assets as held for sale under Ind AS 105;
(d) The destruction of a major production plant by fire or natural catastrophe after the reporting period;
(e) Announcing or commencing a major restructuring;
(f) Abnormally large changes in asset prices or foreign exchange rates after the reporting period;
(g) Entering into significant commitments or contingent liabilities, for example, by issuing significant guarantees.

Case Study 3: Warehouse Fire Casualty at Bharat Apex:
On April 20, 2026, an accidental fire completely destroyed a regional distribution warehouse belonging to Bharat Apex, consuming finished goods inventory with an estimated cost of $3,500,000.00.
- Statutory Analysis under Ind AS 10.10: The physical inventory was in pristine condition, fully intact, and commercially marketable on March 31, 2026. The fire occurred entirely after the balance sheet date; therefore, the physical damage did NOT exist at the reporting date.
- Accounting Mandate: Bharat Apex must NOT write down inventory carrying values on the March 31, 2026 balance sheet! Writing down inventory on March 31 would falsely imply that the asset was impaired at the fiscal year end.
- Mandatory Footnote Disclosure (Ind AS 10.21): Because the fire casualty is material, failing to disclose it would impair the ability of financial statement users to make valid economic evaluations. Bharat Apex must disclose in the notes:
1. The nature of the event: Accidental warehouse fire at the Pune logistics hub on April 20, 2026;
2. An estimate of its financial effect: Finished goods inventory loss of $3,500,000.00, offset by an anticipated insurance claim recovery under an all-risk commercial policy currently under surveyor assessment.

Case Study 4: Proposed Equity Dividends Rule (Ind AS 10.12):
The treatment of proposed dividends represents one of the most fundamental shifts between historical Indian GAAP (AS 4) and converged Ind AS (Ind AS 10):
- Historical Indian GAAP Convention: Under old AS 4, dividends proposed by the Board of Directors after the balance sheet date but before the approval of accounts were recorded as a current liability and deducted from surplus on the balance sheet.
- Ind AS 10.12 Inflexible Mandate: If an entity declares dividends to holders of equity instruments after the reporting period, the entity shall NOT recognize those dividends as a liability at the end of the reporting period!
Conceptual Rationale: Under the Conceptual Framework and Ind AS 37, a liability exists only when the entity has a present obligation as a result of past events. A dividend proposed by the Board of Directors on May 2, 2026 requires approval by shareholders at the forthcoming AGM. As of March 31, no present legal or constructive obligation exists; management has no obligation to pay until declared.

Accounting Treatment for Bharat Apex Proposed Dividend:
On May 2, 2026, the Board of Directors of Bharat Apex proposed an equity dividend of $4,000,000.00 for the fiscal year ended March 31, 2026.
- Balance Sheet Impact: ZERO liability is recognized on the balance sheet at March 31, 2026. Cash and Retained Earnings remain completely unencumbered by the proposed dividend!
- Statutory Footnote Disclosure: Under Ind AS 1.137 and Ind AS 10.13, the company discloses in Note 34 that the Board has proposed a dividend of $4,000,000.00 subject to shareholder approval at the AGM, which will be accounted for in equity in the subsequent fiscal year FY 2026-27.

Summary of Non-Adjusting Disclosures:
Total material non-adjusting events disclosed in the notes equal:
$$\text{Total Non-Adjusting Disclosures} = \text{Fire Loss } (\$3.5\text{M}) + \text{Proposed Dividends } (\$4.0\text{M}) = \$7,500,000.00$$
This guarantees that capital market investors have complete forward-looking visibility into post-close cash commitments and operational disruptions without distorting historical balance sheet carrying amounts."""

d59_p4 = r"""In Part 4 of Day 59, we analyze the Going Concern Overriding Exception under Ind AS 10.14-16 and audit testing invariants under Standards on Auditing.

The Ultimate Overriding Exception (Ind AS 10.14):
While post-balance sheet events that indicate conditions arising after the reporting period are normally classified as non-adjusting events, Ind AS 10 establishes a supreme, non-negotiable exception:
An entity shall NOT prepare its financial statements on a going concern basis if management determines after the reporting period either that it intends to liquidate the entity or to cease trading, or that it has no realistic alternative but to do so!

Conceptual Rationale of the Override:
The Going Concern assumption is the foundational bedrock upon which all Ind AS measurement principles rest. It permits an entity to record plant machinery at depreciated historical cost rather than scrap value, and intangible assets at amortized carrying value. If catastrophic post-balance sheet events occur—such as the sudden revocation of an operating license by the government, a sovereign default, complete market technological obsolescence, or total destruction of all manufacturing facilities without insurance—the entity cannot survive. In such extreme circumstances, presenting financial statements under the going concern convention would be fundamentally misleading to creditors and investors.

The Accounting Consequences of Going Concern Destruction:
When the going concern assumption is vitiated by events after the reporting period:
1. Abandonment of Historical Cost: The entity must abandon normal Ind AS valuation models and prepare financial statements under the Liquidation Basis of Accounting;
2. Asset Revaluation to Net Realizable Value: All property, plant and equipment, intangible assets, and inventories are immediately written down to their estimated net liquidation values;
3. Provision for Closure Liabilities: The entity must recognize immediate provisions for contractual termination penalties, employee severance packages, environmental decommissioning costs, and lender acceleration penalties under Ind AS 37.

Statutory Auditor Testing under SA 570 (Revised) and SA 560:
External auditors must maintain heightened professional skepticism throughout the subsequent events audit window:
- Inquiring of Management: Inquiring whether any events have occurred that cast significant doubt upon the entity's ability to continue as a going concern;
- Cash Flow Forecast Reviews: Inspecting rolling 12-month treasury forecasts, debt covenant compliance headroom, and credit facility renewal agreements;
- Management Representation Letter: Obtaining an explicit written representation under SA 580 from the CEO and CFO confirming that all material events occurring after the reporting period have been identified, properly classified as adjusting or non-adjusting, and fully disclosed.

Going Concern Assessment for Bharat Apex Global Enterprises Ltd:
The CFO and Lead Audit Partner conduct an exhaustive going concern assessment:
- Net Operating Cash Flow: $20,666,400.00 (strong positive cash generation);
- Liquidity Buffers: $10,000,000.00 in unencumbered Cash and Cash Equivalents;
- Net Worth & Solvency: Total Equity of $64,000,000.00 against Total Liabilities of $60,000,000.00;
- Insurance Coverage: Comprehensive commercial property and business interruption insurance covers the Pune warehouse fire;
Conclusion: The going concern assumption is valid, robust, and verified with zero uncertainty.

Statutory Reporting under CARO 2020 Clause 3(xix):
Under the Companies (Auditor's Report) Order 2020, statutory auditors face explicit legal liability under Clause 3(xix) to report on whether any material uncertainty exists as on the date of the audit report that company is capable of meeting its liabilities existing at the date of balance sheet as and when they fall due within a period of one year from the balance sheet date. Auditors must scrutinize financial ratios, aging and expected dates of realization of financial assets and payment of financial liabilities, other information accompanying the financial statements, and the auditor's knowledge of the Board of Directors and management plans. For Bharat Apex, the auditors issue an unqualified clean declaration under Clause 3(xix).

Board of Directors Formal Authorization Resolution:
At the meeting of the Board of Directors held on May 15, 2026, the board formally adopts the adjusting entries (-$2.8M pre-tax), approves the footnote disclosures for non-adjusting items ($7.5M), reconfirms the going concern assumption, and authorizes the audited financial statements for issuance to shareholders and regulatory authorities."""

d59_p5 = r"""In Part 5 of Day 59, we deploy the Enterprise Ind AS 10 Subsequent Events Engine in Python, validating automated event classification algorithms, adjusting ledger postings, and statutory note disclosure generation.

Corporate governance platforms and enterprise reporting software must automate the collection and classification of post-balance sheet events. In multinational conglomerates operating hundreds of subsidiaries across diverse regulatory jurisdictions, subsequent events cannot be tracked on ad-hoc spreadsheets. ERP governance modules establish formal post-close checklists, requiring subsidiary controllers to log any material event occurring between the reporting date and the corporate authorization date, subjecting each event to automated Ind AS 10 decision trees.

Computational Architecture of the Python Ind AS 10 Engine:
Our simulation software models the complete corporate review workflow:
1. Event Ingestion Pipeline:
   - Event 1: Apex Heavy Industries customer insolvency ($2.5M balance, $500k expected recovery);
   - Event 2: High Court patent litigation decree ($1.8M settled amount vs $1.0M prior provision);
   - Event 3: Pune warehouse fire casualty ($3.5M inventory loss);
   - Event 4: Board proposed equity dividend ($4.0M distribution).
2. Algorithmic Classification Filter:
   - Evaluates whether the event provides evidence of conditions existing at March 31 (Adjusting) or arose after March 31 (Non-Adjusting);
   - Routes Event 1 and Event 2 to the Adjusting Ledger Engine;
   - Routes Event 3 and Event 4 to the Non-Adjusting Footnote Disclosure Engine.

Quantification and Verification of System Outputs:
The engine executes precision calculations:
- Adjusting Event 1 (Insolvency ECL): $2,500,000.00 - $500,000.00 = $2,000,000.00 pre-tax P&L deduction;
- Adjusting Event 2 (Litigation Decree): $1,800,000.00 - $1,000,000.00 = $800,000.00 pre-tax P&L deduction;
- Total Pre-Tax Net Adjustments to Reporting Date Balance Sheet: -$2,800,000.00;
- Non-Adjusting Event 3 (Warehouse Fire): $3,500,000.00 footnote disclosure (zero balance sheet change);
- Non-Adjusting Event 4 (Proposed Dividend): $4,000,000.00 footnote disclosure (zero balance sheet liability);
- Total Non-Adjusting Disclosures: $7,500,000.00.

Going Concern Solvency Assertions:
The engine tests core solvency invariants:
- Asserting that current liquid assets ($44.0M) exceed current liabilities ($22.0M);
- Asserting that post-adjustment EBITDA covers annual finance costs by > 5.0x;
- Emitting the verified going concern status: "Valid and Verified".

Continuous Algorithmic Risk Monitoring:
In Tier-1 enterprise architectures, subsequent event discovery is reinforced by automated web scrapers and legal API crawlers that monitor High Court dockets, NCLT filing registries, and credit bureau alerts (such as CRISIL, ICRA, and CIBIL). Whenever a formal notice is docketed against a corporate entity or key customer, the ERP generates an automated alert to the financial controller's compliance desk, ensuring that no adjusting event remains unaddressed during the crucial reporting window prior to board sign-off.

Double-Entry Ledger Architecture for Adjusting Events:
The Python engine generates the following standardized journal vouchers for direct posting into the reporting ledger:
1. Customer Insolvency Impairment Voucher:
   - Debit: Impairment Loss on Financial Assets (P&L) $2,000,000.00
   - Credit: Allowance for Expected Credit Losses (Trade Receivables) $2,000,000.00;
2. Litigation Settlement Decree Voucher:
   - Debit: Legal & Litigation Claims Expense (P&L) $800,000.00
   - Credit: Provision for Legal Obligations (Current Liabilities) $800,000.00;
3. Corporate Income Tax Shield Voucher:
   - Debit: Current Tax Liability / Advance Tax (Balance Sheet) $704,704.00
   - Credit: Current Tax Expense (P&L Tax Benefit at 25.168%) $704,704.00.
These automated postings ensure that the draft trial balance is adjusted with complete precision before final financial statement rendering.

Statutory Audit Sign-Off:
The statutory audit partner completes the subsequent events review under SA 560, verifying that the $2.8M adjusting entries have been posted to the general ledger, the $7.5M non-adjusting disclosures appear in Note 33 and Note 34, and the Board of Directors has authorized the accounts for issue. Upon successful completion of all programmatic checks, the engine outputs the confirmation string:
`IND_AS_10_EVENTS_AFTER_REPORTING_PASS`."""

parts = [d59_p1, d59_p2, d59_p3, d59_p4, d59_p5]
print("Day 59 Word Counts:")
for i, p in enumerate(parts, 1):
    wc = count_words(p)
    status = "OK" if wc >= 600 else f"SHORT ({wc}/600)"
    print(f"  Part {i}: {wc} words - {status}")
    assert wc >= 600, f"Part {i} failed Law 1: {wc} < 600!"
print("Day 59 Total Words:", sum(count_words(p) for p in parts))
