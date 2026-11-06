import json
import re

def count_words(text):
    return len(re.findall(r'\b[A-Za-z0-9_-]+\b', text))

day38_code = """# Day 38: Ind AS 33 Earnings Per Share Engine
# Computes Basic EPS and Diluted EPS using the Treasury Stock Method and If-Converted Method.

from dataclasses import dataclass
from typing import List, Dict

class IndAS33EarningsPerShareEngine:
    def __init__(self, enterprise_name: str, tax_rate_pct: float):
        self.enterprise_name = enterprise_name
        self.tax_rate = tax_rate_pct / 100.0

    def compute_basic_eps(self, net_profit: float, wanos: int) -> Dict[str, float]:
        \"\"\"Module 1: Basic EPS calculation.\"\"\"
        basic_eps = net_profit / wanos
        return {
            "net_profit": net_profit,
            "wanos": float(wanos),
            "basic_eps": round(basic_eps, 2)
        }

    def compute_treasury_stock_options(self, options_count: int, strike_price: float, avg_market_price: float) -> Dict[str, float]:
        \"\"\"Module 2: Treasury Stock Method for options/warrants.\"\"\"
        if avg_market_price <= strike_price:
            return {"incremental_shares": 0.0, "is_dilutive": False}
        
        proceeds = options_count * strike_price
        shares_repurchased = proceeds / avg_market_price
        incremental_shares = options_count - shares_repurchased
        return {
            "options_count": float(options_count),
            "proceeds": round(proceeds, 2),
            "shares_repurchased": round(shares_repurchased, 2),
            "incremental_shares": round(incremental_shares, 2),
            "is_dilutive": True
        }

    def compute_if_converted_debentures(self, principal: float, coupon_rate_pct: float, conversion_shares: int) -> Dict[str, float]:
        \"\"\"Module 3: If-Converted Method for convertible bonds/debentures.\"\"\"
        gross_interest = principal * (coupon_rate_pct / 100.0)
        tax_shield = gross_interest * self.tax_rate
        after_tax_interest = gross_interest - tax_shield
        incremental_eps = after_tax_interest / conversion_shares
        
        return {
            "gross_interest_saved": round(gross_interest, 2),
            "after_tax_interest_saved": round(after_tax_interest, 2),
            "conversion_shares": float(conversion_shares),
            "incremental_eps": round(incremental_eps, 4)
        }

    def compute_diluted_eps(
        self,
        net_profit: float,
        wanos: int,
        options_data: Dict[str, float],
        debenture_data: Dict[str, float]
    ) -> Dict[str, float]:
        \"\"\"Module 4: Integrated Diluted EPS synthesis and anti-dilution filtering.\"\"\"
        basic_eps = net_profit / wanos
        adj_profit = net_profit
        adj_shares = float(wanos)

        # Options check
        if options_data.get("is_dilutive"):
            adj_shares += options_data["incremental_shares"]

        # Debentures check (dilutive if incremental EPS < basic EPS)
        if debenture_data["incremental_eps"] < basic_eps:
            adj_profit += debenture_data["after_tax_interest_saved"]
            adj_shares += debenture_data["conversion_shares"]

        diluted_eps = adj_profit / adj_shares
        eps_dilution_pct = ((basic_eps - diluted_eps) / basic_eps) * 100.0

        return {
            "basic_eps": round(basic_eps, 2),
            "adjusted_profit": round(adj_profit, 2),
            "adjusted_shares": round(adj_shares, 2),
            "diluted_eps": round(diluted_eps, 2),
            "dilution_percentage": round(eps_dilution_pct, 2)
        }

engine = IndAS33EarningsPerShareEngine("Titan Global Aerospace Corp", 25.168)

basic_res = engine.compute_basic_eps(5000000.0, 1000000)
assert basic_res["basic_eps"] == 5.00

opt_res = engine.compute_treasury_stock_options(100000, 30.0, 50.0)
assert opt_res["incremental_shares"] == 40000.0
assert opt_res["is_dilutive"] is True

deb_res = engine.compute_if_converted_debentures(5000000.0, 6.0, 200000)
assert deb_res["after_tax_interest_saved"] == 224496.0
assert deb_res["incremental_eps"] == 1.1225

dil_res = engine.compute_diluted_eps(5000000.0, 1000000, opt_res, deb_res)
assert dil_res["diluted_eps"] == 4.21
assert dil_res["adjusted_shares"] == 1240000.0
assert dil_res["dilution_percentage"] == 15.73

print(f"Enterprise: {engine.enterprise_name}")
print(f"Basic EPS: ${dil_res['basic_eps']} (WANOS: {int(basic_res['wanos'])})")
print(f"Treasury Stock Incremental Shares: {int(opt_res['incremental_shares'])}")
print(f"If-Converted Interest Saved: ${deb_res['after_tax_interest_saved']} (Shares: {int(deb_res['conversion_shares'])})")
print(f"Diluted EPS: ${dil_res['diluted_eps']} (Total Diluted Shares: {int(dil_res['adjusted_shares'])})")
print(f"EPS Dilution Drag: {dil_res['dilution_percentage']}%")
print("IND_AS_33_EARNINGS_PER_SHARE_PASS")
"""

day38_output = """Enterprise: Titan Global Aerospace Corp
Basic EPS: $5.0 (WANOS: 1000000)
Treasury Stock Incremental Shares: 40000
If-Converted Interest Saved: $224496.0 (Shares: 200000)
Diluted EPS: $4.21 (Total Diluted Shares: 1240000)
EPS Dilution Drag: 15.73%
IND_AS_33_EARNINGS_PER_SHARE_PASS"""

part1_say = r"""Welcome to Day 38 of Corporate & Financial Accounting. Today we examine the single most watched, quoted, and benchmarked metric in global equity capital markets: Earnings Per Share (EPS), governed by Indian Accounting Standard (Ind AS) 33 and International Accounting Standard (IAS) 33. For institutional investors, hedge funds, equity research analysts, and corporate boardrooms, EPS represents the ultimate bottom-line distillation of corporate profitability on a per-share basis. It forms the core denominator of the Price-to-Earnings (P/E) ratio and underpins multi-billion-dollar enterprise equity valuations across the Bombay Stock Exchange (BSE), National Stock Exchange (NSE), and global exchanges.

The scope of Ind AS 33 is mandatory for all entities whose ordinary shares or potential ordinary shares are traded in a public market (or that are in the process of issuing shares in public markets, such as during an Initial Public Offering). Furthermore, under Regulation 33 of the SEBI (Listing Obligations and Disclosure Requirements) Regulations, listed companies in India must disclose both Basic and Diluted EPS on the face of the Statement of Profit and Loss for both continuing operations and total operations, with equal prominence for both figures!

Ind AS 33 establishes two distinct EPS tiers:
1. Basic Earnings Per Share: Measures the performance of an entity over the reporting period attributable strictly to existing ordinary equity holders.
2. Diluted Earnings Per Share: Measures the potential dilution of ordinary shareholders' interests by factoring in the hypothetical conversion of all dilutive potential ordinary shares (such as stock options, convertible debentures, and convertible preference shares) that were outstanding during the period.

Let us master the Numerator Architecture for Basic EPS:
Under Ind AS 33 Paragraph 12, the numerator is 'Profit or Loss attributable to ordinary equity holders of the parent entity'. This is calculated by taking the consolidated Profit or Loss after tax, and making mandatory deductions:
1. Non-Controlling Interests (NCI): Deduct the portion of profit attributable to minority shareholders in subsidiaries under Ind AS 110.
2. Preference Dividends:
   * For Cumulative Preference Shares: Deduct the full contractual dividend for the period, WHETHER OR NOT the dividend has been declared by the Board of Directors!
   * For Non-Cumulative Preference Shares: Deduct the dividend ONLY if it has been formally declared during the period.
   * Any tax consequences or dividend distribution taxes associated with preference shares must also be factored into the numerator deduction.
3. Excess Consideration Paid on Buyback of Preference Shares: If preference shares are redeemed at a premium over carrying value, the premium is treated as an additional distribution to preference holders, reducing the profit available to ordinary equity holders.

Furthermore, corporate controllers must manage the interaction between Ind AS 33 and financial instrument classification under Ind AS 32. If an enterprise has issued redeemable preference shares with mandatory redemption dates, those preference shares are classified as Financial Liabilities under Ind AS 32! Consequently, their dividend distributions are recognized as Finance Costs (interest expense) within profit or loss before arriving at Profit After Tax; therefore, NO secondary numerator deduction is required for liability-classified preference shares. Only preference shares that are legally and conceptually classified as Equity require explicit numerator deductions from Profit After Tax.

Under Ind AS 33 Paragraph 68, if an enterprise reports a Discontinued Operation under Ind AS 105, it must disclose Basic and Diluted EPS for the discontinued operation either on the face of the Statement of Profit and Loss or in the notes to the financial statements. This dual disclosure allows equity analysts to evaluate whether continuing core operations are expanding even if discontinued non-core legacy businesses created a temporary drag on consolidated earnings.

Corporate controllers must ensure absolute precision in numerator calculations. Errors in classifying cumulative preference dividends or failing to adjust for perpetual hybrid debt instruments (classified as equity under Ind AS 32) result in immediate misstatements of Basic EPS, inviting regulatory scrutiny from SEBI and statutory audit qualifications under the Companies Act, 2013."""

part2_say = r"""In Part 2, we dissect the Denominator Architecture: the Weighted Average Number of Ordinary Shares (WANOS) and retrospective adjustments for non-cash share transactions.

The denominator of Basic EPS is not simply the number of shares outstanding at the end of the financial year! If a company starts the year with 1,000,000 shares and issues another 1,000,000 shares on the very last day of the fiscal year, dividing profit by 2,000,000 shares would severely distort performance because the new capital contributed to business operations for only one day!
Therefore, Ind AS 33 mandates the 'Weighted Average Number of Ordinary Shares' (WANOS):
The number of ordinary shares outstanding at the beginning of the period, adjusted by the number of ordinary shares bought back or issued during the period multiplied by a Time-Weighting Factor (the number of days that the shares are outstanding as a proportion of the total number of days in the period).

Let us examine how different commercial corporate actions impact the WANOS denominator:
1. Shares Issued for Cash Consideration: Time-weighted from the date cash consideration is receivable (typically the allotment date).
2. Shares Repurchased in a Buyback: Time-weighted from the date cash is disbursed and the shares are formally extinguished under Section 68 of the Companies Act.
3. Retrospective Adjustments Without Inflow of Resources: This is one of the most critical principles in Ind AS 33!
   When shares are issued WITHOUT a corresponding change in corporate resources—such as a Bonus Issue (Stock Dividend), Share Split, or Reverse Share Split (Share Consolidation)—the number of ordinary shares outstanding before the event is adjusted proportionally AS IF THE EVENT HAD OCCURRED AT THE VERY BEGINNING OF THE EARLIEST PERIOD REPORTED!
   * For example, if an enterprise has 1,000,000 shares outstanding throughout Year 1 and on December 31 of Year 2 issues a 1:1 Bonus Issue (doubling shares to 2,000,000):
     - The denominator for Year 2 is 2,000,000 shares.
     - Crucially, the WANOS for Year 1 MUST BE RESTATED to 2,000,000 shares in the comparative column of the published financial statements!
     - This retrospective restatement prevents an artificial, illusory halving of EPS in the trend analysis, ensuring that historic per-share comparisons remain economically meaningful.

4. Rights Issues with Bonus Elements:
   When an entity issues shares via a Rights Issue at a subscription price below current fair market value, the rights issue contains a built-in bonus element! Under Ind AS 33 Application Guidance, the Controller must calculate the 'Theoretical Ex-Rights Price' (TERP):
   $TERP = \frac{\text{Fair Value of all existing shares} + \text{Total cash proceeds from rights issue}}{\text{Total shares outstanding after rights issue}}$
   The bonus adjustment factor equals the Fair Value per share immediately prior to exercise divided by the TERP. All shares outstanding prior to the rights issue are multiplied by this factor retrospectively across all current and comparative periods.

5. Mandatorily Convertible Instruments:
   Where ordinary shares are issuable on the mandatory conversion of a hybrid instrument (such as Compulsorily Convertible Debentures / CCDs or Compulsorily Convertible Preference Shares / CCPS) where conversion is certain and requires no additional cash payment, those shares are included in the WANOS denominator from the date the contract is entered into, rather than the future date of actual legal share issuance.

Furthermore, under Ind AS 33 Paragraph 26, where share capital transactions occur after the balance sheet date but before the financial statements are authorized for issue (such as a post-balance-sheet bonus issue, share split, or reverse split approved by the board of directors), the per-share calculations for both current and all prior periods presented MUST BE CALCULATED BASED ON THE NEW NUMBER OF SHARES! That material fact must be explicitly disclosed in the notes. This statutory requirement guarantees that equity investors reading the published financial report receive metrics reflecting the physical capital structure existing at the publication date."""

part3_say = r"""In Part 3, we analyze Diluted Earnings Per Share, the universe of Potential Ordinary Shares, and the fundamental Anti-Dilution Filtering Rule.

Diluted EPS reflects the maximum potential dilution of corporate earnings that existing equity shareholders would suffer if all outstanding commitments to issue equity were exercised. A 'Potential Ordinary Share' is a financial instrument or other contract that may entitle its holder to ordinary shares. In modern corporate capital structures, potential ordinary shares include:
1. Employee Stock Option Plans (ESOPs) and share warrants.
2. Convertible Debentures and convertible bonds (foreign currency convertible bonds / FCCBs).
3. Convertible Preference Shares.
4. Contingently Issuable Shares (shares issuable upon achieving future earnings targets in an M&A earnout).

The overarching governing principle under Ind AS 33 Paragraph 41 is the ANTI-DILUTION PRINCIPLE:
"Potential ordinary shares shall be treated as dilutive when, and only when, their conversion to ordinary shares would DECREASE earnings per share or INCREASE loss per share from continuing operations."

Why does Ind AS 33 prohibit anti-dilutive adjustments?
The financial statements aim to present a prudent, conservative picture of earnings risk to public market investors. If hypothetical conversion of an instrument would make EPS look higher (better) than Basic EPS, including that instrument would deceive investors by painting an artificially flattering picture of earnings capacity! Therefore, any instrument that increases EPS upon conversion is classified as Anti-Dilutive and MUST BE COMPLETELY EXCLUDED from the Diluted EPS calculation!

To evaluate dilution across multiple instruments, the Controller must calculate the 'Incremental EPS' of each instrument:
$Incremental EPS = \frac{\text{Adjustment to Profit or Loss (Numerator)}}{\text{Incremental Shares Issued (Denominator)}}$
- For options and warrants: The incremental EPS is always $0.00$ (because options bring zero after-tax earnings adjustment to the numerator while increasing the denominator). Thus, in-the-money options are ALWAYS dilutive!
- For convertible debentures: The incremental EPS equals the After-Tax Interest Saved divided by the new shares issued upon conversion. If this incremental EPS is LESS than Basic EPS, the debenture is dilutive. If it is GREATER than Basic EPS, it is anti-dilutive!

Furthermore, when an enterprise has multiple classes of potential ordinary shares, Ind AS 33 Paragraph 44 mandates that they must be considered in order from the MOST DILUTIVE to the LEAST DILUTIVE. The Controller ranks each instrument by its incremental EPS and conducts a step-by-step sequencing analysis:
1. Rank all potential ordinary instruments in ascending order of their incremental EPS (options with incremental EPS of $0.00$ are always evaluated first).
2. Recalculate tentative EPS after introducing each instrument sequentially.
3. If introducing an instrument causes tentative EPS to rise above the preceding step's figure, that instrument and all subsequent instruments are ANTI-DILUTIVE and must be rejected from the diluted calculation!

A critical complexity arises in loss-making periods. If an enterprise reports a Net Loss from continuing operations, Basic EPS is negative (e.g. -$2.00). Under Ind AS 33 Paragraph 42, ANY potential ordinary share that would reduce the loss per share (e.g. from -$2.00 to -$1.75) is strictly ANTI-DILUTIVE! In loss-making periods, the conversion of options, convertibles, or warrants would divide the loss among more shares, diluting the perceived loss per share. Therefore, when an entity reports a net loss, Diluted EPS is mathematically capped to equal Basic EPS exactly, and all potential ordinary shares are deemed anti-dilutive for reporting purposes.

In addition, controllers must address Contingently Issuable Shares under Paragraphs 52–57 (such as milestone shares in cross-border acquisitions). In interim or annual reports, contingently issuable shares are included in Diluted EPS only if the contractual performance conditions (such as target EBITDA thresholds) have been satisfied at the balance sheet date, treating the end of the period as the end of the contingency period."""

part4_say = r"""In Part 4, we examine the quantitative methodologies for dilution: the Treasury Stock Method for options and the If-Converted Method for convertible debt.

Module 1: The Treasury Stock Method (for Options and Warrants):
Under Ind AS 33 Paragraphs 45–48, share options and warrants are assumed to be exercised on the first day of the financial year (or on the grant date, if later). However, when employees exercise options, they pay cash (the exercise strike price) into the company's bank account!
What does the company do with this hypothetical cash inflow?
The Treasury Stock Method assumes that the proceeds received from the exercise of options are used by the entity to REPURCHASE ITS OWN ORDINARY SHARES at the Average Market Price during the period!
- Let $N$ = Number of options outstanding.
- Let $K$ = Contractual exercise strike price.
- Let $P$ = Average market price of ordinary shares during the reporting period.
- Total Hypothetical Cash Proceeds = $N \times K$.
- Number of Shares Repurchased = $\frac{N \times K}{P}$.
- Incremental Net Dilutive Shares added to Denominator:
  $\Delta Shares = N - \frac{N \times K}{P} = N \times \left(1 - \frac{K}{P}\right)$.

Let us apply this to our corporate simulation:
Titan Global Aerospace Corp has 100,000 ESOPs outstanding with an exercise price ($K$) of $30.00. The average market price ($P$) of the stock is $50.00.
- Cash proceeds = $100,000 \times \$30.00 = \$3,000,000.00$.
- Shares repurchased at market price = $\$3,000,000 / \$50.00 = 60,000$ shares.
- Net Incremental Shares added to denominator = $100,000 - 60,000 = 40,000$ shares!
If the market price was $25.00 (below the $30 strike), the options would be 'out-of-the-money'; exercise would be irrational, proceeds would exceed market repurchase cost, and the options would be anti-dilutive (incremental shares = 0).

Module 2: The If-Converted Method (for Convertible Debt):
For convertible bonds and debentures, the If-Converted Method assumes conversion occurred at the beginning of the period. This has two simultaneous effects:
1. Denominator Impact: The denominator increases by the contractual conversion shares (e.g., 200,000 shares).
2. Numerator Impact: The company would NO LONGER PAY INTEREST on the converted debt! Therefore, the annual interest expense is added back to the profit numerator. Crucially, the add-back must be NET OF TAX!
   * Gross Interest Saved = $Principal \times Coupon Rate$.
   * Net Interest Saved (Numerator Add-Back) = $Gross Interest \times (1 - \text{Corporate Tax Rate})$.

In our simulation, Titan Global holds $5,000,000 of 6% convertible debentures convertible into 200,000 shares. The corporate tax rate under Section 115BAA is 25.168%:
- Gross Interest = $\$5,000,000 \times 6\% = \$300,000.00$.
- After-Tax Interest Add-Back = $\$300,000 \times (1 - 0.25168) = \$224,496.00$.
- Incremental EPS = $\$224,496.00 / 200,000 = \$1.1225$.
Because $1.1225 is vastly lower than Basic EPS ($5.00), the debentures are highly dilutive!

In financial practice, corporate treasury teams often issue Employee Stock Purchase Plans (ESPPs) that allow employees to purchase shares at a discount (such as a 15% discount to market price). In computing diluted EPS under the Treasury Stock Method, the discount element is treated as an option: the strike price is the discounted purchase price, and the proceeds are assumed to repurchase shares at full fair market value. If the plan includes a look-back provision, the option value is modeled using Black-Scholes formulas, ensuring total harmony between Ind AS 102 share-based compensation expense and Ind AS 33 dilution modeling.

Furthermore, when an entity has written put options (contracts obligating the entity to repurchase its own shares at a specified strike price), the reverse treasury stock method applies. If the exercise price of the put option is ABOVE the average market price, the contract is dilutive: the entity is assumed to issue sufficient shares at market value to fund the cash repurchase commitment, adding net incremental shares to the denominator."""

part5_say = r"""In Part 5, we execute our Python Ind AS 33 Earnings Per Share Engine, verify all dilution assertions, and review statutory disclosures.

Now, inspect our standalone Python class `IndAS33EarningsPerShareEngine`. This system encapsulates the complete end-to-end mathematical architecture of basic and diluted EPS for Titan Global Aerospace Corp:
1. Basic EPS Baseline:
   - Consolidated Net Profit attributable to ordinary equity = $\$5,000,000.00$.
   - Weighted Average Number of Ordinary Shares (WANOS) = $1,000,000$ shares.
   - Basic EPS = $\$5,000,000 / 1,000,000 = \$5.00$ per share.
2. Treasury Stock Method (ESOP Options):
   - 100,000 options with strike $\$30.00$ and average market price $\$50.00$.
   - Generates $\$3,000,000$ proceeds, repurchasing $60,000$ shares at market value.
   - Net incremental dilutive shares = $40,000$ shares added to denominator.
3. If-Converted Method (Convertible Debentures):
   - $\$5,000,000$ of 6% debentures with conversion ratio of $200,000$ shares.
   - Saves $\$300,000$ gross interest, yielding after-tax savings of $\$224,496.00$ at 25.168% tax rate.
   - Incremental EPS = $\$1.1225 < \$5.00$ (Dilutive test passed!).
4. Integrated Diluted EPS Synthesis:
   - Adjusted Numerator = $\$5,000,000 + \$224,496 = \$5,224,496.00$.
   - Adjusted Denominator = $1,000,000 \text{ (basic)} + 40,000 \text{ (options)} + 200,000 \text{ (debentures)} = 1,240,000$ shares.
   - Diluted EPS = $\$5,224,496.00 / 1,240,000 = \$4.2133 \rightarrow \$4.21$ per share!
   - EPS Dilution Drag: Diluted EPS is $15.73\%$ lower than Basic EPS!

Behind each formula in `IndAS33EarningsPerShareEngine` lies an automated corporate governance control. The method `compute_basic_eps` safeguards numerator purity, while `compute_treasury_stock_options` performs automatic in-the-money checks (rejecting out-of-the-money options where average price is below strike). The method `compute_if_converted_debentures` factors in the statutory Section 115BAA corporate tax shield (25.168%), and `compute_diluted_eps` executes the multi-instrument anti-dilution filter before publishing final diluted metrics.

Let us trace the complete financial narrative revealed by our simulation. Titan Global reported a robust Basic EPS of $5.00 based on 1,000,000 shares. However, sophisticated institutional investors and credit rating agencies inspect Diluted EPS to assess the latent claim on enterprise earnings. Because Titan granted 100,000 employee stock options and issued $5,000,000 in convertible debentures, fully 240,000 additional shares could flood the market. Even after crediting back $224,496 in after-tax interest saved, the per-share earnings power drops to $4.21—an eye-opening 15.73% earnings dilution drag! Understanding and forecasting this dilution curve allows corporate controllers to advise the board on optimal capital structure financing, avoiding excessive equity dilution that depresses share price valuations.

Let us review the statutory disclosure mandates under Ind AS 33 Paragraph 70. On the face of the Profit and Loss statement, entities must present Basic and Diluted EPS with equal prominence. In the financial statement notes, management must disclose:
1. The amounts used as the numerators in calculating basic and diluted EPS, and a reconciliation of those amounts to profit or loss.
2. The weighted average number of ordinary shares used as the denominator in calculating basic and diluted EPS, and a reconciliation between the two denominators.
3. Instruments that could potentially dilute basic EPS in the future, but were not included in the calculation because they were anti-dilutive for the periods presented.
4. Descriptions of ordinary share transactions occurring after the reporting date (such as post-balance-sheet bonus issues or share splits) that would have changed the share count significantly.

Upon execution of our Python validation engine, every dilution metric reconciles with mathematical perfection, validating the engine and emitting the terminal triumph confirmation string:
`IND_AS_33_EARNINGS_PER_SHARE_PASS`.
You have now conquered the advanced quantitative mechanics of Earnings Per Share and capital structure dilution under Ind AS 33. In Day 39, we will explore Ind AS 37, mastering corporate provisions, contingent liabilities, restructuring reserves, and environmental decommissioning obligations."""

day38_lesson = {
    "coursePrefix": "bcom-accounting",
    "day": 38,
    "title": "Ind AS 33 & IAS 33: Earnings Per Share (EPS), Dilution Modeling & Capital Structures",
    "parts": [
        {
            "part": 1,
            "title": "Capital Market Mandate of EPS, SEBI LODR Disclosure & Numerator Adjustments",
            "say": part1_say,
            "code": day38_code,
            "output": day38_output,
            "check": {
                "question": "Under Ind AS 33, how are dividends on cumulative preference shares treated in the calculation of the Basic EPS numerator?",
                "options": [
                    "Deducted in full for the period whether or not the preference dividend has been formally declared by the board",
                    "Deducted only if the dividend has been formally declared during the fiscal period",
                    "Added back to net profit because preference shares are treated as equity",
                    "Completely ignored in computing ordinary equity earnings"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "Ind AS 33 Paragraph 14 mandates that the contractual amount of cumulative preference dividends for the period is deducted from profit or loss, regardless of whether it has been declared.",
                "why": "Ind AS 33 Paragraph 14 mandates that the contractual amount of cumulative preference dividends for the period is deducted from profit or loss, regardless of whether it has been declared."
            }
        },
        {
            "part": 2,
            "title": "Denominator Architecture: WANOS Calculations & Retrospective Non-Cash Adjustments",
            "say": part2_say,
            "code": day38_code,
            "output": day38_output,
            "check": {
                "question": "When a company issues bonus shares or executes a share split without consideration, how is the weighted average number of shares treated under Ind AS 33?",
                "options": [
                    "Adjusted retrospectively for all periods presented as if the event had occurred at the beginning of the earliest period reported",
                    "Time-weighted from the date of the bonus issue without restating comparative periods",
                    "Excluded from the denominator until the shares are fully paid in cash",
                    "Recognized as an extraordinary loss in the current year profit and loss statement"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "Because bonus issues and share splits alter the number of shares without bringing in new resources, Ind AS 33 requires retrospective adjustment across all current and comparative periods.",
                "why": "Because bonus issues and share splits alter the number of shares without bringing in new resources, Ind AS 33 requires retrospective adjustment across all current and comparative periods."
            }
        },
        {
            "part": 3,
            "title": "Dilution Mechanics, Potential Ordinary Shares & The Anti-Dilution Principle",
            "say": part3_say,
            "code": day38_code,
            "output": day38_output,
            "check": {
                "question": "What is the core rule governing Anti-Dilutive potential ordinary shares under Ind AS 33?",
                "options": [
                    "They must be strictly excluded from the Diluted EPS calculation because including them would decrease loss or increase earnings per share",
                    "They must be included in Diluted EPS to show the highest possible upside to investors",
                    "They must be recognized as deferred tax liabilities on the balance sheet",
                    "They require immediate cash settlement by the issuing corporation"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "Ind AS 33 prohibits the inclusion of anti-dilutive potential shares in Diluted EPS, ensuring that the financial statements only portray potential dilution (downside risk) to shareholders.",
                "why": "Ind AS 33 prohibits the inclusion of anti-dilutive potential shares in Diluted EPS, ensuring that the financial statements only portray potential dilution (downside risk) to shareholders."
            }
        },
        {
            "part": 4,
            "title": "The Treasury Stock Method for Options & The If-Converted Method for Debt",
            "say": part4_say,
            "code": day38_code,
            "output": day38_output,
            "check": {
                "question": "Under the Treasury Stock Method, how are the cash proceeds from assumed option exercises treated in computing incremental diluted shares?",
                "options": [
                    "Assumed to be used to repurchase ordinary shares at the average market price, so only the net unrepurchased shares are added to the denominator",
                    "Added directly to the net profit numerator without changing the share count",
                    "Invested in government bonds at the risk-free rate of interest",
                    "Distributed immediately to existing shareholders as a special cash dividend"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "The Treasury Stock Method assumes option proceeds are used to repurchase shares at the prevailing average market price, adding only the net incremental shares: Options * (1 - Strike/MarketPrice).",
                "why": "The Treasury Stock Method assumes option proceeds are used to repurchase shares at the prevailing average market price, adding only the net incremental shares: Options * (1 - Strike/MarketPrice)."
            }
        },
        {
            "part": 5,
            "title": "Python EPS Engine Execution, Dilution Verification & Ind AS 33 Certification",
            "say": part5_say,
            "code": day38_code,
            "output": day38_output,
            "check": {
                "question": "What is the terminal confirmation string emitted by the Ind AS 33 simulation engine upon verifying all basic and diluted EPS assertions?",
                "options": [
                    "IND_AS_33_EARNINGS_PER_SHARE_PASS",
                    "DILUTED_EPS_CALCULATION_ABORTED_AUDIT_ERROR",
                    "TREASURY_STOCK_PROCEEDS_MISMATCH_FAIL",
                    "ANTI_DILUTIVE_FILTERING_EXCEPTION"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "The Ind AS 33 engine validates all calculations across basic EPS, options treasury stock adjustments, and if-converted debt, culminating in IND_AS_33_EARNINGS_PER_SHARE_PASS.",
                "why": "The Ind AS 33 engine validates all calculations across basic EPS, options treasury stock adjustments, and if-converted debt, culminating in IND_AS_33_EARNINGS_PER_SHARE_PASS."
            }
        }
    ]
}

total_words = 0
for p in day38_lesson["parts"]:
    wc = count_words(p["say"])
    total_words += wc
    print(f"Day 38 Part {p['part']} words: {wc}")

for p in day38_lesson["parts"]:
    wc = count_words(p["say"])
    assert wc >= 580, f"Part {p['part']} word count {wc} < 580"

print(f"Day 38 Total words: {total_words}")
assert total_words >= 3000, f"Total word count {total_words} < 3000"

with open("scripts/bcom_acc_day38.json", "w", encoding="utf-8") as f:
    json.dump(day38_lesson, f, indent=2)

print("Saved scripts/bcom_acc_day38.json successfully!")
