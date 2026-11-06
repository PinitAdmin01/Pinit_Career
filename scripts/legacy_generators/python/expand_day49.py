with open("scripts/generate_day49_clean.py", "r", encoding="utf-8") as f:
    code = f.read()

p1_add = """ Furthermore, when evaluating operating cash flows under Ind AS 7 (Statement of Cash Flows), forensic analysts examine whether cash flows are presented using the direct method or the indirect method. While the indirect method begins with net profit and adjusts for non-cash working capital changes, the direct method discloses gross cash receipts from customers and cash payments to suppliers. Credit rating agencies such as CRISIL, ICRA, and CARE place particular emphasis on Free Cash Flow to Firm (FCFF), ensuring that after funding routine capital expenditures, the enterprise generates surplus unencumbered cash to service long-term debt liabilities without relying on revolving credit lines."""

p2_add = """ In empirical asset management and quantitative equity research, the Sloan Accrual Anomaly has formed the foundation for systematic long-short hedge fund strategies. Quantitative investment managers rank public companies by their accrual ratios, taking long equity positions in the lowest-accrual decile (firms with dominant cash flow generation) and shorting the highest-accrual decile (firms with paper earnings inflated by aggressive receivables and capitalized overhead). In addition, forensic accountants contrast the balance sheet approach with the cash flow statement approach, adjusting for non-cash mergers and acquisitions under Ind AS 103 and foreign currency translation reserves under Ind AS 21 to ensure that working capital accruals are isolated with forensic precision."""

p4_add = """ In addition, listed companies in India must establish a robust Vigil Mechanism and Whistleblower Policy under Section 177(9) and (10) of the Companies Act 2013 and Regulation 22 of the SEBI (Listing Obligations and Disclosure Requirements) Regulations, 2015. This mechanism provides direct access to the Chairman of the Audit Committee for employees and directors to report genuine concerns regarding unethical behavior, suspected fraud, or violations of corporate accounting codes. Modern forensic audit teams deploy advanced cognitive data analytics and AI-driven pattern recognition algorithms to ingest millions of general ledger journal entries, flagging anomalous weekend postings, round-sum adjustments, and unauthorized override of automated controls."""

p5_add = """ Corporate controllers present these forensic diagnostic findings directly to the Board Audit Committee prior to the formal approval of annual financial statements. By confirming that the Cash Flow Realism ratio remains above 1.0x, Sloan accruals remain negative, and the Beneish M-Score remains safely below the -1.78 manipulation threshold, executive leadership provides statutory auditors and regulators with mathematical assurance that internal financial controls over financial reporting (IFC-FR) are operating with complete integrity and zero managerial manipulation."""

code = code.replace(
    'integrity.\"\"\"',
    'integrity.' + p1_add + '\"\"\"'
)

code = code.replace(
    'accrual inflation.\"\"\"',
    'accrual inflation.' + p2_add + '\"\"\"'
)

code = code.replace(
    'Section 143(3)(i).\"\"\"',
    'Section 143(3)(i).' + p4_add + '\"\"\"'
)

code = code.replace(
    'Capstone in Day 50!\"\"\"',
    'Capstone in Day 50!' + p5_add + '\"\"\"'
)

with open("scripts/generate_day49_clean.py", "w", encoding="utf-8") as f:
    f.write(code)

print("Updated generate_day49_clean.py with rich expansions!")
