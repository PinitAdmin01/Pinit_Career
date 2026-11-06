# scripts/fix_bcom_law_summary.py
import json

with open("src/lib/data/bcomLawLongLessons.ts", "r", encoding="utf-8") as f:
    c = f.read()

# Add summary for day 21
target21 = '"goal": "Master corporate governance around Related Party'
summary21 = '''"summary": [
    "Section 188 of the Companies Act 2013 governs Related Party Transactions and board approval mandates.",
    "Section 2(76) codifies nine statutory categories of related parties across corporate ownership structures.",
    "Audit Committee omnibus approvals under Rule 6A enforce annual transaction caps and commercial review.",
    "Arm's length transfer pricing transactions in the ordinary course of business enjoy statutory safe harbor."
  ],
  "goal": "Master corporate governance around Related Party'''

# Add summary for day 22
target22 = '"goal": "Master the end-to-end operationalization of corporate'
summary22 = '''"summary": [
    "Section 149 mandates board composition and independent director eligibility criteria.",
    "Section 177 Audit Committee and Section 135 CSR committees enforce statutory compliance quotas.",
    "Section 188 RPT screening mandates Majority of Minority shareholder approval voting protocols.",
    "The Milestone 7 Governance Command Simulator unifies boardroom compliance architecture."
  ],
  "goal": "Master the end-to-end operationalization of corporate'''

new_c = c.replace(target21, summary21).replace(target22, summary22)

with open("src/lib/data/bcomLawLongLessons.ts", "w", encoding="utf-8") as f:
    f.write(new_c)

print("Added missing summary properties to bcomLawLongLessons.ts.")
