import json
import re

def count_words(text):
    return len(re.findall(r'\b[A-Za-z0-9_-]+\b', text))

day49_code = """# Day 49: Quality of Earnings & Forensic Accounting Diagnostics
# Comprehensive forensic accounting suite computing Sloan Accruals, Cash Flow Realism, and Beneish M-Score.

from dataclasses import dataclass
from typing import Dict

@dataclass
class ForensicFinancials:
    # Year t (current)
    rev_t: float
    cogs_t: float
    rec_t: float
    ca_t: float
    ppe_t: float
    ta_t: float
    dep_t: float
    sga_t: float
    ltd_t: float
    ni_t: float
    cfo_t: float
    # Year t-1 (prior)
    rev_prev: float
    cogs_prev: float
    rec_prev: float
    ca_prev: float
    ppe_prev: float
    ta_prev: float
    dep_prev: float
    sga_prev: float
    ltd_prev: float
    ni_prev: float
    cfo_prev: float

class ForensicAccountingDiagnostics:
    def __init__(self, f: ForensicFinancials):
        self.f = f

    def compute_sloan_accrual_analysis(self) -> Dict[str, float]:
        accruals = self.f.ni_t - self.f.cfo_t
        avg_assets = (self.f.ta_t + self.f.ta_prev) / 2.0
        accrual_ratio = accruals / avg_assets
        cf_realism = self.f.cfo_t / self.f.ni_t if self.f.ni_t != 0 else 0.0
        return {
            "total_accruals": round(accruals, 2),
            "accrual_ratio_pct": round(accrual_ratio * 100, 2),
            "cash_flow_realism_ratio": round(cf_realism, 2)
        }

    def compute_beneish_m_score(self) -> Dict[str, any]:
        # 1. DSRI
        dsri = (self.f.rec_t / self.f.rev_t) / (self.f.rec_prev / self.f.rev_prev)
        # 2. GMI
        gm_prev = (self.f.rev_prev - self.f.cogs_prev) / self.f.rev_prev
        gm_t = (self.f.rev_t - self.f.cogs_t) / self.f.rev_t
        gmi = gm_prev / gm_t
        # 3. AQI
        non_ca_ppe_t = 1.0 - ((self.f.ca_t + self.f.ppe_t) / self.f.ta_t)
        non_ca_ppe_prev = 1.0 - ((self.f.ca_prev + self.f.ppe_prev) / self.f.ta_prev)
        aqi = non_ca_ppe_t / non_ca_ppe_prev
        # 4. SGI
        sgi = self.f.rev_t / self.f.rev_prev
        # 5. DEPI
        dep_rate_prev = self.f.dep_prev / (self.f.ppe_prev + self.f.dep_prev)
        dep_rate_t = self.f.dep_t / (self.f.ppe_t + self.f.dep_t)
        depi = dep_rate_prev / dep_rate_t
        # 6. SGAI
        sgai = (self.f.sga_t / self.f.rev_t) / (self.f.sga_prev / self.f.rev_prev)
        # 7. LVGI
        lvgi = (self.f.ltd_t / self.f.ta_t) / (self.f.ltd_prev / self.f.ta_prev)
        # 8. TATA
        tata = (self.f.ni_t - self.f.cfo_t) / self.f.ta_t

        m_score = (
            -4.84
            + (0.920 * dsri)
            + (0.528 * gmi)
            + (0.404 * aqi)
            + (0.892 * sgi)
            + (0.115 * depi)
            - (0.172 * sgai)
            + (4.037 * tata)
            + (0.0327 * lvgi)
        )

        manipulation_risk = "Low Risk (Unlikely Manipulator)" if m_score <= -1.78 else "High Risk (Likely Manipulator)"
        return {
            "dsri": round(dsri, 4),
            "gmi": round(gmi, 4),
            "aqi": round(aqi, 4),
            "sgi": round(sgi, 4),
            "depi": round(depi, 4),
            "sgai": round(sgai, 4),
            "lvgi": round(lvgi, 4),
            "tata": round(tata, 4),
            "m_score": round(m_score, 2),
            "manipulation_risk": manipulation_risk
        }

# Case Study: Veritas Technologies Ltd
fin = ForensicFinancials(
    rev_t=120000000.0,
    cogs_t=72000000.0,
    rec_t=16000000.0,
    ca_t=44000000.0,
    ppe_t=60000000.0,
    ta_t=124000000.0,
    dep_t=6000000.0,
    sga_t=18000000.0,
    ltd_t=30000000.0,
    ni_t=14966400.0,
    cfo_t=18000000.0,
    rev_prev=100000000.0,
    cogs_prev=60000000.0,
    rec_prev=14000000.0,
    ca_prev=38000000.0,
    ppe_prev=54000000.0,
    ta_prev=110000000.0,
    dep_prev=5000000.0,
    sga_prev=16000000.0,
    ltd_prev=28000000.0,
    ni_prev=12000000.0,
    cfo_prev=14000000.0
)

analyzer = ForensicAccountingDiagnostics(fin)
sloan = analyzer.compute_sloan_accrual_analysis()
beneish = analyzer.compute_beneish_m_score()

assert sloan["total_accruals"] == -3033600.0
assert sloan["accrual_ratio_pct"] == -2.59
assert sloan["cash_flow_realism_ratio"] == 1.20

assert beneish["dsri"] == 0.9524
assert beneish["gmi"] == 1.0
assert beneish["aqi"] == 0.9857
assert beneish["sgi"] == 1.20
assert beneish["depi"] == 0.9322
assert beneish["sgai"] == 0.9375
assert beneish["lvgi"] == 0.9505
assert beneish["tata"] == -0.0245
assert beneish["m_score"] == -2.09
assert beneish["manipulation_risk"] == "Low Risk (Unlikely Manipulator)"

print(f"Sloan Accruals: ${sloan['total_accruals']:,.2f} | Accrual Ratio: {sloan['accrual_ratio_pct']}% | CF Realism: {sloan['cash_flow_realism_ratio']}x")
print(f"Beneish M-Score: {beneish['m_score']} ({beneish['manipulation_risk']}) | DSRI: {beneish['dsri']} | SGI: {beneish['sgi']} | TATA: {beneish['tata']}")
print("EARNINGS_QUALITY_FORENSIC_PASS")
"""

day49_output = """Sloan Accruals: $-3,033,600.00 | Accrual Ratio: -2.59% | CF Realism: 1.2x
Beneish M-Score: -2.09 (Low Risk (Unlikely Manipulator)) | DSRI: 0.9524 | SGI: 1.2 | TATA: -0.0245
EARNINGS_QUALITY_FORENSIC_PASS"""

part1_say = r"""Welcome to Day 49 of Corporate & Financial Accounting! Today we enter the critical domain of forensic financial analysis, examining Quality of Earnings, Sloan's Accrual Anomaly, Cash Flow Realism, and the celebrated 8-variable Beneish M-Score manipulation detection model.

In modern financial reporting under converged Indian Accounting Standards (Ind AS) and IFRS, accrual accounting is the fundamental engine that matches revenues earned with expenses incurred, regardless of when cash is physically exchanged. While accruals provide a superior economic representation of long-term periodic performance compared to primitive cash-basis accounting, they simultaneously introduce immense managerial discretion. Executive leadership and corporate controllers must make subjective estimates regarding expected credit losses under Ind AS 109, warranty and decommissioning provisions under Ind AS 37, useful economic lives and salvage values under Ind AS 16, and multi-element revenue recognition milestones under Ind AS 115.

When management faces aggressive quarterly earnings targets from institutional Wall Street analysts or Dalal Street fund managers, or when executive remuneration bonuses are linked to reported earnings per share (EPS), the temptation arises to manipulate non-cash accruals to artificially flatter financial statements. Quality of Earnings analysis is the specialized forensic discipline that evaluates whether reported accounting profits reflect genuine economic vitality and sustainable operational cash flows, or merely temporary cosmetic accounting adjustments designed to meet short-term market expectations.

The primary diagnostic baseline in earnings quality analysis is Cash Flow Realism, measured by the ratio of Cash Flow from Operations (CFO) to Accounting Net Income:
$$\text{Cash Flow Realism Ratio} = \frac{\text{Cash Flow from Operating Activities (CFO)}}{\text{Net Income After Tax}}$$

The economic interpretation of the Cash Flow Realism ratio provides an immediate litmus test for corporate financial health:
1. High Earnings Quality ($\text{CFO} / \text{Net Income} \ge 1.0$): Operating cash flow equals or exceeds reported accounting net income. This indicates that net profit is fully backed by realized bank deposits, customer receivables are being collected promptly, and non-cash depreciation charges are naturally shielding cash from immediate taxation.
2. Moderate / Acceptable Quality ($0.80 \le \text{CFO} / \text{Net Income} < 1.0$): Acceptable in rapidly expanding enterprises where rapid revenue growth naturally requires ongoing investments in inventory and customer trade credit.
3. Severe Red Flag ($\text{CFO} / \text{Net Income} < 0.80$, or persistent divergence): When an enterprise reports surging accounting profits year after year while its operating cash flows are stagnant, declining, or negative, forensic red flags are triggered. This divergence was the hallmark of catastrophic corporate collapses—including Enron, WorldCom, Wirecard, and Satyam Computer Services—where billions in reported profits evaporated because they existed solely as paper accruals on the general ledger rather than verifiable cash in bank accounts.

In our case study of Veritas Technologies Ltd, an operating cash flow of $18,000,000.00 against net income of $14,966,400.00 yields a Cash Flow Realism ratio of 1.20x, proving that every rupee of reported accounting profit is backed by $1.20 of liquid operating cash flow, establishing an elite foundation of earnings integrity. Furthermore, when evaluating operating cash flows under Ind AS 7 (Statement of Cash Flows), forensic analysts examine whether cash flows are presented using the direct method or the indirect method. While the indirect method begins with net profit and adjusts for non-cash working capital changes, the direct method discloses gross cash receipts from customers and cash payments to suppliers. Credit rating agencies such as CRISIL, ICRA, and CARE place particular emphasis on Free Cash Flow to Firm (FCFF), ensuring that after funding routine capital expenditures, the enterprise generates surplus unencumbered cash to service long-term debt liabilities without relying on revolving credit lines."""

part2_say = r"""In Part 2 of Day 49, we explore Richard Sloan's Accrual Anomaly and the mathematical decomposition of accounting earnings persistence.

In 1996, Professor Richard Sloan of the Wharton School published a landmark empirical study titled "Do Stock Prices Fully Reflect Information in Accruals and Cash Flows About Future Earnings?" in The Accounting Review. Sloan discovered one of the most famous market inefficiencies in empirical financial economics: the Accrual Anomaly.

Sloan proved that accounting net income can be disaggregated into two mutually exclusive components:
$$\text{Net Income} = \text{Operating Cash Flow (CFO)} + \text{Total Accruals}$$
$$\text{Total Accruals} = \text{Net Income} - \text{Operating Cash Flow}$$
To standardize this metric across firms of varying size, Sloan constructed the Balance Sheet Accrual Ratio:
$$\text{Accrual Ratio} = \frac{\text{Net Income} - \text{Operating Cash Flow}}{\text{Average Total Assets}} = \frac{\Delta \text{Non-Cash Current Assets} - \Delta \text{Current Liabilities (non-debt)} - \text{Depreciation}}{\text{Average Total Assets}}$$

Sloan's empirical breakthrough established two foundational tenets regarding earnings persistence:
1. Cash Flow Persistence: The cash flow component of earnings is highly persistent, repeatable, and statistically robust. A company that generates $1.00 of operating cash flow is highly likely to reproduce that cash flow in subsequent financial years.
2. Accrual Low Persistence: The accrual component of earnings displays dramatically lower persistence and mean-reverts rapidly. Non-cash accruals represent temporary timing differences—such as unbilled revenues, deferred expenses, or capitalized inventory costs—that must eventually reverse in subsequent accounting periods.

The market anomaly arises because public equity markets and unsophisticated institutional investors fixate naively on bottom-line reported Net Income or EPS, failing to recognize whether that income was driven by cash or by accruals. Consequently, equity markets systematically overprice companies with high positive accrual ratios (treating them as high-quality growth businesses) and systematically underprice companies with negative accrual ratios. In subsequent quarters, when high accruals inevitably reverse (through large asset write-offs, bad debt provisions, or inventory impairments), high-accrual firms suffer catastrophic earnings misses and severe stock price collapses.

Conversely, an enterprise with negative total accruals—where Operating Cash Flow exceeds Net Income—demonstrates conservative accounting policies. Non-cash expenses (such as depreciation and amortizations under Ind AS 16 and 38) exceed working capital asset growth, ensuring that reported earnings are conservative and resilient against future write-downs. In our case study of Veritas Technologies Ltd, Net Income of $14,966,400 minus CFO of $18,000,000 yields Total Accruals of $-\$3,033,600.00$. Measured against average total assets of $117,000,000, the Accrual Ratio is $-2.59\%$, confirming superior earnings persistence and zero accrual inflation. In empirical asset management and quantitative equity research, the Sloan Accrual Anomaly has formed the foundation for systematic long-short hedge fund strategies. Quantitative investment managers rank public companies by their accrual ratios, taking long equity positions in the lowest-accrual decile (firms with dominant cash flow generation) and shorting the highest-accrual decile (firms with paper earnings inflated by aggressive receivables and capitalized overhead). In addition, forensic accountants contrast the balance sheet approach with the cash flow statement approach, adjusting for non-cash mergers and acquisitions under Ind AS 103 and foreign currency translation reserves under Ind AS 21 to ensure that working capital accruals are isolated with forensic precision. Under Indian capital market regulations, equity research analysts at leading institutional brokerages routinely incorporate Sloan accrual screens to protect retail and institutional investors from aggressive earnings management practices across mid-cap and small-cap listed equities. By systematically tracking whether earnings growth is led by operating cash flows or non-cash balance sheet deferrals, forensic analysts identify earnings inflection points long before they are reflected in headline quarterly results."""

part3_say = r"""In Part 3 of Day 49, we deconstruct Professor Messod Beneish's 8-variable M-Score model, the gold standard forensic tool for detecting corporate financial statement manipulation.

In 1999, Professor Messod Beneish developed a multivariate probit model designed to identify companies engaged in earnings manipulation before their accounting fraud was uncovered by regulators or media whistleblowers. The power of the Beneish M-Score was immortalized when Cornell University MBA students applied the model to Enron Corporation's 1998 and 1999 financial statements; the model flagged Enron as an aggressive, high-risk manipulator years before its bankruptcy, while Wall Street equity analysts maintained unanimous "Strong Buy" ratings!

The Beneish M-Score synthesizes eight individual financial ratio indices comparing current year performance ($t$) to prior year performance ($t-1$):
1. Days Sales in Receivables Index (DSRI):
   $$\text{DSRI} = \frac{\text{Receivables}_t / \text{Sales}_t}{\text{Receivables}_{t-1} / \text{Sales}_{t-1}}$$
   A DSRI significantly greater than 1.0 indicates that trade receivables are growing much faster than revenue, signaling aggressive revenue recognition, channel stuffing, or unearned milestone billings under Ind AS 115.
2. Gross Margin Index (GMI):
   $$\text{GMI} = \frac{(\text{Sales}_{t-1} - \text{COGS}_{t-1}) / \text{Sales}_{t-1}}{(\text{Sales}_t - \text{COGS}_t) / \text{Sales}_t}$$
   A GMI > 1.0 indicates that gross margins are deteriorating. Companies with eroding margins face intense pressure to engage in earnings manipulation to maintain market valuations.
3. Asset Quality Index (AQI):
   $$\text{AQI} = \frac{1 - (\text{Current Assets}_t + \text{Net PP\&E}_t) / \text{Total Assets}_t}{1 - (\text{Current Assets}_{t-1} + \text{Net PP\&E}_{t-1}) / \text{Total Assets}_{t-1}}$$
   AQI measures the proportion of total assets residing in non-current intangibles and deferred assets. An AQI > 1.0 signals that the company is capitalizing operational expenses into intangible assets rather than expensing them to profit and loss.
4. Sales Growth Index (SGI):
   $$\text{SGI} = \frac{\text{Sales}_t}{\text{Sales}_{t-1}}$$
   While sales growth is positive, hyper-growth firms often resort to accounting manipulation when their growth trajectory begins to decelerate.
5. Depreciation Index (DEPI):
   $$\text{DEPI} = \frac{\text{DepRate}_{t-1}}{\text{DepRate}_t} = \frac{\text{Dep}_{t-1} / (\text{PP\&E}_{t-1} + \text{Dep}_{t-1})}{\text{Dep}_t / (\text{PP\&E}_t + \text{Dep}_t)}$$
   A DEPI > 1.0 means the current depreciation rate has slowed, suggesting that management has extended asset useful lives to boost reported profits.
6. Sales, General & Administrative Expenses Index (SGAI):
   $$\text{SGAI} = \frac{\text{SGA}_t / \text{Sales}_t}{\text{SGA}_{t-1} / \text{Sales}_{t-1}}$$
   Evaluates managerial cost discipline.
7. Leverage Index (LVGI):
   $$\text{LVGI} = \frac{\text{Long-Term Debt}_t / \text{Total Assets}_t}{\text{Long-Term Debt}_{t-1} / \text{Total Assets}_{t-1}}$$
   Measures escalating financial leverage, which increases the temptation to manipulate earnings to avoid loan covenant breaches.
8. Total Accruals to Total Assets (TATA):
   $$\text{TATA} = \frac{\text{Net Income}_t - \text{CFO}_t}{\text{Total Assets}_t}$$
   Captures the overall magnitude of non-cash accounting discretion.

The calibrated 8-variable Beneish equation is:
$$\text{M-Score} = -4.84 + 0.920 \cdot \text{DSRI} + 0.528 \cdot \text{GMI} + 0.404 \cdot \text{AQI} + 0.892 \cdot \text{SGI} + 0.115 \cdot \text{DEPI} - 0.172 \cdot \text{SGAI} + 4.037 \cdot \text{TATA} + 0.0327 \cdot \text{LVGI}$$
The Critical Decision Cutoff established by Professor Beneish is $-1.78$, separating aggressive earnings manipulation from conservative accounting reporting:
- If $\text{M-Score} > -1.78$: High probability of financial statement manipulation.
- If $\text{M-Score} \le -1.78$: Low probability of manipulation (unlikely manipulator)."""

part4_say = r"""In Part 4 of Day 49, we examine forensic auditing standards, statutory fraud reporting, and regulatory enforcement under Indian corporate jurisprudence.

In India, the legal framework governing corporate financial integrity has been dramatically fortified following major corporate accounting scandals. The Ministry of Corporate Affairs (MCA), the National Financial Reporting Authority (NFRA), and the Securities and Exchange Board of India (SEBI) have established overlapping statutory mechanisms to identify and prosecute financial statement manipulation:
1. Section 143(12) of the Companies Act 2013 & Rule 13 of the Companies (Audit and Auditors) Rules, 2014:
   If an independent statutory auditor, during the course of performing audit procedures, has reason to believe that an offence of fraud involving an amount of one crore rupees (INR 10,000,000) or more is being or has been committed against the company by its officers or employees, the auditor is under a mandatory statutory obligation to report the matter directly to the Central Government (Ministry of Corporate Affairs) within 60 days using Form ADT-4! Failing to report fraud exposes the auditor to severe disciplinary penalties, statutory disqualification, and criminal prosecution.
2. CARO 2020 Clause 3(xi):
   Under the Companies (Auditor's Report) Order, 2020, statutory auditors must explicitly comment in their audit report:
   - Whether any fraud by the company or any fraud on the company has been noticed or reported during the year;
   - Whether any report under Section 143(12) has been filed by the auditors in Form ADT-4 with the Central Government;
   - Whether the auditor has taken into consideration whistle-blower complaints received during the year by the company.
3. Standard on Auditing (SA) 240:
   Issued by the Institute of Chartered Accountants of India (ICAI), SA 240 outlines "The Auditor's Responsibilities Relating to Fraud in an Audit of Financial Statements." SA 240 mandates that auditors maintain professional skepticism throughout the audit, specifically testing journal entries posted to the general ledger at fiscal year-end, reviewing accounting estimates for management bias under Ind AS (such as fair value step-ups and impairment models), and analyzing unusual or complex related-party transactions under Section 188.
4. National Financial Reporting Authority (NFRA) Inspections:
   As India's independent accounting oversight body established under Section 132 of the Companies Act 2013, NFRA conducts forensic inspections of public interest entities and audit firms. NFRA aggressively targets revenue manipulation under Ind AS 115, improper asset capitalization under Ind AS 38, and failure to challenge unrealistic management assumptions, imposing heavy civil penalties and multi-year debarments on negligent auditors.
5. Serious Fraud Investigation Office (SFIO):
   The multidisciplinary investigation agency under the Ministry of Corporate Affairs empowered under Section 211 and 212 of the Companies Act 2013 to investigate complex white-collar corporate frauds, freeze director assets, and initiate criminal proceedings before Special Courts.

By mastering forensic accounting diagnostics—including Sloan accruals and the Beneish M-Score—corporate controllers and audit committee members can proactively identify accounting anomalies, ensuring robust internal controls over financial reporting (IFC-FR) under Section 134(5) and Section 143(3)(i). In addition, listed companies in India must establish a robust Vigil Mechanism and Whistleblower Policy under Section 177(9) and (10) of the Companies Act 2013 and Regulation 22 of the SEBI (Listing Obligations and Disclosure Requirements) Regulations, 2015. This mechanism provides direct access to the Chairman of the Audit Committee for employees and directors to report genuine concerns regarding unethical behavior, suspected fraud, or violations of corporate accounting codes. Modern forensic audit teams deploy advanced cognitive data analytics and AI-driven pattern recognition algorithms to ingest millions of general ledger journal entries, flagging anomalous weekend postings, round-sum adjustments, and unauthorized override of automated controls."""

part5_say = r"""In Part 5 of Day 49, we execute and verify our complete Python Forensic Accounting & Earnings Quality Suite, validating every quantitative assertion across Sloan accruals, cash flow realism, and the Beneish M-Score!

Let us review the forensic diagnostic results computed by our Python software engine for Veritas Technologies Ltd:
1. Operational Cash Flow Realism:
   - Current Year Operating Revenue = $120,000,000.00 (Prior Year = $100,000,000.00).
   - Net Income After Tax = $14,966,400.00.
   - Cash Flow from Operating Activities (CFO) = $18,000,000.00.
   - Cash Flow Realism Ratio = $\$18,000,000.00 / \$14,966,400.00 = 1.20x$.
   - Because the ratio exceeds 1.0x, Veritas demonstrates stellar cash-backing of reported earnings.
2. Richard Sloan Accrual Analysis:
   - Total Accruals = $\text{Net Income} - \text{CFO} = \$14,966,400.00 - \$18,000,000.00 = -\$3,033,600.00$.
   - Average Total Assets = $(\$124,000,000 + \$110,000,000) / 2.0 = \$117,000,000.00$.
   - Accrual Ratio = $-\$3,033,600.00 / \$117,000,000.00 = -2.59\%$.
   - Negative accruals verify that cash generation outpaces accounting profit recognition, indicating conservative financial reporting and high earnings persistence.
3. Beneish M-Score 8-Variable Breakdown:
   - DSRI (Days Sales in Receivables Index) = $(16M / 120M) / (14M / 100M) = 0.1333 / 0.1400 = 0.9524$. (Receivables collection velocity improved).
   - GMI (Gross Margin Index) = $(40M / 100M) / (48M / 120M) = 0.4000 / 0.4000 = 1.0000$. (Gross margin remained rock-solid at 40.0%).
   - AQI (Asset Quality Index) = $(1 - (44M + 60M)/124M) / (1 - (38M + 54M)/110M) = (20/124) / (18/110) = 0.1613 / 0.1636 = 0.9857$. (Intangibles non-inflated).
   - SGI (Sales Growth Index) = $\$120,000,000 / \$100,000,000 = 1.2000$. (Disciplined 20% organic sales growth).
   - DEPI (Depreciation Index) = $(5M / 59M) / (6M / 66M) = 0.0847 / 0.0909 = 0.9322$. (Depreciation rate accelerated, highly conservative).
   - SGAI (SGA Expense Index) = $(18M / 120M) / (16M / 100M) = 0.1500 / 0.1600 = 0.9375$. (Overhead efficiency improved).
   - LVGI (Leverage Index) = $(30M / 124M) / (28M / 110M) = 0.2419 / 0.2545 = 0.9505$. (Long-term leverage reduced).
   - TATA (Total Accruals to Total Assets) = $(14.9664M - 18.0M) / 124M = -3.0336M / 124M = -0.0245$. (Negative accrual drag).
4. Final Beneish M-Score Synthesis:
   $$\text{M-Score} = -4.84 + (0.920 \times 0.9524) + (0.528 \times 1.0000) + (0.404 \times 0.9857) + (0.892 \times 1.2000) + (0.115 \times 0.9322) - (0.172 \times 0.9375) + (4.037 \times -0.0245) + (0.0327 \times 0.9505)$$
   $$\text{M-Score} = -4.84 + 0.8762 + 0.5280 + 0.3982 + 1.0704 + 0.1072 - 0.1613 - 0.0989 + 0.0311 = -2.09$$
   - Classification: $\text{M-Score} = -2.09 \le -1.78 \implies \text{Low Risk (Unlikely Manipulator)}$.

The forensic software confirms that Veritas Technologies Ltd exhibits pristine earnings quality: operating cash flows comfortably exceed net income, Sloan accruals are negative, and the Beneish M-Score sits safely below the -1.78 manipulation threshold.

When our standalone Python simulation executes, every programmatic assertion validates with zero rounding discrepancy, culminating in the terminal output:
```
Sloan Accruals: $-3,033,600.00 | Accrual Ratio: -2.59% | CF Realism: 1.2x
Beneish M-Score: -2.09 (Low Risk (Unlikely Manipulator)) | DSRI: 0.9524 | SGI: 1.2 | TATA: -0.0245
EARNINGS_QUALITY_FORENSIC_PASS
```
This certifies complete mastery of Day 49 Quality of Earnings & Forensic Accounting Diagnostics, setting the stage for our grand Milestone 10 Capstone in Day 50! Corporate controllers present these forensic diagnostic findings directly to the Board Audit Committee prior to the formal approval of annual financial statements. By confirming that the Cash Flow Realism ratio remains above 1.0x, Sloan accruals remain negative, and the Beneish M-Score remains safely below the -1.78 manipulation threshold, executive leadership provides statutory auditors and regulators with mathematical assurance that internal financial controls over financial reporting (IFC-FR) are operating with complete integrity and zero managerial manipulation."""

day49_lesson = {
    "coursePrefix": "bcom-accounting",
    "day": 49,
    "title": "Quality of Earnings & Forensic Accounting Diagnostics (Beneish M-Score, Sloan Accrual Anomaly & Cash Flow Realism)",
    "parts": [
        {
            "part": 1,
            "title": "Strategic Principles of Earnings Quality & Cash Flow Realism",
            "say": part1_say,
            "code": day49_code,
            "output": day49_output,
            "check": {
                "question": "What does a Cash Flow Realism ratio (Operating Cash Flow / Net Income) significantly less than 0.80 indicate to forensic auditors?",
                "options": [
                    "Reported accounting net income is not being supported by operating cash generation, signaling aggressive revenue accruals, uncollected receivables, or potential manipulation",
                    "The company has zero debt and pays high cash dividends to ordinary shareholders",
                    "The company is operating under primitive cash-basis accounting rather than Ind AS",
                    "The company has received an unqualified audit clean chit from NFRA inspectors"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "A Cash Flow Realism ratio below 0.80 signals that reported profits are not converting into cash, warning auditors of potential aggressive accruals or channel stuffing.",
                "why": "A Cash Flow Realism ratio below 0.80 signals that reported profits are not converting into cash, warning auditors of potential aggressive accruals or channel stuffing."
            }
        },
        {
            "part": 2,
            "title": "Richard Sloan's Accrual Anomaly & Earnings Persistence Modeling",
            "say": part2_say,
            "code": day49_code,
            "output": day49_output,
            "check": {
                "question": "According to Richard Sloan's 1996 Accrual Anomaly research, how does the persistence of the cash flow component of earnings compare to the accrual component?",
                "options": [
                    "Cash flows exhibit high, repeatable persistence, whereas accruals display low persistence and mean-revert rapidly due to eventual accounting reversals",
                    "Accruals exhibit 100% persistence while cash flows are completely random",
                    "Both cash flows and accruals display identical persistence across all industries",
                    "Accruals never reverse and permanently inflate balance sheet shareholders' equity"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "Sloan proved that cash flows have high persistence, while accruals have low persistence because non-cash estimates and timing differences eventually reverse.",
                "why": "Sloan proved that cash flows have high persistence, while accruals have low persistence because non-cash estimates and timing differences eventually reverse."
            }
        },
        {
            "part": 3,
            "title": "Messod Beneish's 8-Variable M-Score Forensic Architecture",
            "say": part3_say,
            "code": day49_code,
            "output": day49_output,
            "check": {
                "question": "In the Beneish M-Score manipulation detection model, what is the critical threshold value separating likely manipulators from unlikely manipulators?",
                "options": [
                    "-1.78 (an M-Score greater than -1.78 indicates high probability of earnings manipulation)",
                    "0.00 (any positive M-Score indicates manipulation)",
                    "1.81 (the Altman Z-score lower bound)",
                    "-4.84 (the constant intercept in the regression equation)"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "Beneish established that an M-Score > -1.78 signals a high risk of earnings manipulation, while M <= -1.78 indicates low risk.",
                "why": "Beneish established that an M-Score > -1.78 signals a high risk of earnings manipulation, while M <= -1.78 indicates low risk."
            }
        },
        {
            "part": 4,
            "title": "Forensic Auditing Standards, NFRA Inspections & CARO 2020 Fraud Governance",
            "say": part4_say,
            "code": day49_code,
            "output": day49_output,
            "check": {
                "question": "Under Section 143(12) of the Companies Act 2013, what is the statutory auditor's obligation upon discovering fraud involving one crore rupees or more?",
                "options": [
                    "Report the fraud directly to the Central Government (Ministry of Corporate Affairs) within 60 days using Form ADT-4",
                    "Conceal the fraud until management agrees to resign voluntarily",
                    "File an immediate lawsuit in civil court against all minority shareholders",
                    "Charge an additional forensic audit fee without reporting to regulators"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "Under Section 143(12), an auditor discovering fraud of INR 1 crore or more must report it to the Central Government (MCA) via Form ADT-4 within 60 days.",
                "why": "Under Section 143(12), an auditor discovering fraud of INR 1 crore or more must report it to the Central Government (MCA) via Form ADT-4 within 60 days."
            }
        },
        {
            "part": 5,
            "title": "Python Forensic Suite Execution & Quality Certification",
            "say": part5_say,
            "code": day49_code,
            "output": day49_output,
            "check": {
                "question": "In the Veritas Technologies case study, what are the verified values for the Accrual Ratio and Beneish M-Score?",
                "options": [
                    "Accrual Ratio = -2.59%; Beneish M-Score = -2.09 (Low Risk (Unlikely Manipulator))",
                    "Accrual Ratio = +12.50%; Beneish M-Score = -1.50 (High Risk (Likely Manipulator))",
                    "Accrual Ratio = 0.00%; Beneish M-Score = 0.00 (Indeterminate Risk)",
                    "Accrual Ratio = -15.00%; Beneish M-Score = -4.84 (Zero Risk)"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "Veritas exhibits an Accrual Ratio of -$3.0336M / $117M = -2.59%, and Beneish M-Score = -2.09, confirming Low Risk.",
                "why": "Veritas exhibits an Accrual Ratio of -$3.0336M / $117M = -2.59%, and Beneish M-Score = -2.09, confirming Low Risk."
            }
        }
    ]
}

total_words = 0
for p in day49_lesson["parts"]:
    wc = count_words(p["say"])
    total_words += wc
    print(f"Day 49 Part {p['part']} words: {wc}")

for p in day49_lesson["parts"]:
    wc = count_words(p["say"])
    assert wc >= 580, f"Part {p['part']} word count {wc} < 580"

print(f"Day 49 Total words: {total_words}")
assert total_words >= 3000, f"Total word count {total_words} < 3000"

with open("scripts/bcom_acc_day49.json", "w", encoding="utf-8") as f:
    json.dump(day49_lesson, f, indent=2)

print("Saved scripts/bcom_acc_day49.json successfully!")
