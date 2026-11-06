import json
import re

def count_words(text):
    return len(re.findall(r'\b[A-Za-z0-9_-]+\b', text))

with open("scripts/bcom_acc_day34.json", "r", encoding="utf-8") as f:
    data = json.load(f)

p1_extra = """
To understand why the incurred loss model failed so catastrophically during the 2008 subprime crisis, financial analysts must examine the regulatory mechanics of Basel II capital adequacy. Under Basel II, banks held regulatory capital against risk-weighted assets, but accounting provisions directly reduced Common Equity Tier 1 (CET1) capital. Because IAS 39 and AS 30 forbade banks from recognizing provisions for anticipated economic downturns without an observable default event, banks reported artificially inflated accounting profits and paid massive cash dividends during the boom years of 2004 to 2007. When systemic liquidity froze in 2008, the sudden spike in credit losses forced banks into catastrophic capital breaches, leading to government bailouts.

Ind AS 109 completely reversed this procyclical dynamic. By mandating that entities must recognize at least 12-month expected credit losses from the very first day a loan is disbursed or a bond is purchased, the standard builds countercyclical capital buffers during benign economic periods. Furthermore, Ind AS 109 incorporates macro-economic forecasts—such as interest rate curves, inflation expectations, and unemployment projections—directly into loss provisioning, ensuring that balance sheets faithfully reflect latent credit risks long before borrowers formally miss a debt payment. The scope of Ind AS 109 encompasses all financial instruments, loan commitments, financial guarantee contracts, and lease receivables, establishing a universal risk governance standard."""

p2_extra = """
The SPPI test requires rigorous legal and structural analysis of loan covenants and bond indentures. Common commercial features that can cause an instrument to fail the SPPI test include: (a) profit-sharing mechanisms where interest payments depend on the borrower's operating profits; (b) inverse floating-rate notes where interest rates increase as benchmark rates decline; and (c) non-recourse loans where the lender can look only to specified assets of the borrower and those assets do not generate cash flows solely representing principal and interest. If a debt instrument fails the SPPI test, it cannot be classified at Amortized Cost or FVTOCI, regardless of the management business model; it is forcefully classified at Fair Value through Profit or Loss (FVTPL), subjecting the issuer and holder to quarterly P&L mark-to-market volatility.

For financial liabilities, the elimination of the 'own-credit risk anomaly' was a monumental victory for accounting common sense. Under IAS 39, when a bank's credit rating was downgraded from AAA to BBB, the secondary market value of its outstanding issued bonds dropped from 100 to 85. Under the fair value option, the bank recorded a 15-point liability reduction, generating an unearned accounting profit in P&L! Ind AS 109 eliminated this absurdity by segregating own-credit gains into Other Comprehensive Income (OCI), ensuring that distress cannot be disguised as accounting profitability."""

p3_extra = """
The determination of a 'Significant Increase in Credit Risk' (SICR) under Stage 2 requires financial institutions to deploy sophisticated credit scoring engines. While the 30-day past due presumption serves as a backstop, standard setters made clear that SICR must be detected long before 30 days elapse. Advanced risk management frameworks monitor forward-looking quantitative metrics, such as: (a) a significant increase in 12-month or lifetime PD relative to initial origination; (b) an actual or expected internal credit rating downgrade by two or more notches; (c) a significant widening of credit default swap (CDS) spreads for the borrower; and (d) adverse changes in commercial, financial, or economic conditions that will cause a significant reduction in the borrower's ability to meet its debt obligations. When any of these triggers are breached, the asset automatically transitions from Stage 1 into Stage 2, mandating full lifetime credit loss provisioning."""

p4_extra = """
The practical construction of a Trade Receivables Provision Matrix under the Simplified Approach requires robust historical data science. Corporate controllers typically examine loss histories across rolling 36-month or 60-month historical windows, calculating the historical default rate for each aging category (e.g., invoices 1-30 days overdue experiencing historical write-offs of 2.0%, while invoices 61-90 days overdue experience historical write-offs of 15.0%).

Under Ind AS 109, controllers cannot rely solely on historical data. If national economic data forecasts an imminent recession, rising corporate insolvencies, or severe sector-specific distress (such as an automotive downturn), the historical default rates must be adjusted upward using forward-looking scalars. For instance, if macroeconomic regression models indicate that credit defaults increase by 1.25x during recessionary periods, the historical 2.0% loss rate for 1-30 DPD must be scaled up to 2.5%, ensuring that the corporate allowance for doubtful accounts is forward-looking and compliant with statutory audit standards."""

p5_extra = """
The accounting interface between Ind AS 109 ECL provisioning and statutory corporate taxation under the Income Tax Act 1961 requires careful tax reconciliation under Ind AS 12 'Income Taxes'. Under Section 36(1)(vii) of the Income Tax Act, a deduction for bad debts is allowable only when the debt is actually written off as irrecoverable in the accounts of the assessee. General provisions for expected credit losses under Ind AS 109 are disallowable for tax purposes!

Consequently, recognizing an ECL impairment allowance creates a 'Deductible Temporary Difference' between the accounting carrying amount of the financial asset and its tax base. This temporary difference requires the recognition of a 'Deferred Tax Asset' (DTA) under Ind AS 12, to the extent that it is probable that future taxable profit will be available against which the deductible temporary difference can be utilized.

Furthermore, under the Reserve Bank of India (RBI) Prudential Framework for Resolution of Stressed Assets, scheduled commercial banks must maintain parallel asset classification records: Ind AS 109 accounting stages (Stages 1, 2, and 3) must be reconciled continuously against RBI prudential classifications (Standard, SMA-0, SMA-1, SMA-2, and Non-Performing Assets / NPA). When RBI provisioning norms exceed Ind AS 109 ECL allowances, banks must appropriate the difference into an 'Impairment Reserve' out of net profit, ensuring that statutory capital strength is strictly preserved across the banking sector.

Corporate audit committees and Chief Risk Officers (CROs) conduct quarterly stress testing of the Ind AS 109 impairment engine. Sensitivity disclosures under Ind AS 107 must detail the monetary impact on profit before tax if probability of default (PD) weights were to shift by +/- 100 basis points, or if severe economic downside scenarios (such as sharp currency depreciation or benchmark interest rate hikes) were given higher probability weightings in the macroeconomic model."""

data["parts"][0]["say"] += p1_extra
data["parts"][1]["say"] += p2_extra
data["parts"][2]["say"] += p3_extra
data["parts"][3]["say"] += p4_extra
data["parts"][4]["say"] += p5_extra

total_words = 0
for p in data["parts"]:
    wc = count_words(p["say"])
    total_words += wc
    print(f"Day 34 Part {p['part']} words: {wc}")
    assert wc >= 580, f"Part {p['part']} word count {wc} < 580"

print(f"Day 34 Total words: {total_words}")
assert total_words >= 3000, f"Total word count {total_words} < 3000"

with open("scripts/bcom_acc_day34.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)

print("Saved updated scripts/bcom_acc_day34.json successfully!")
