"""
Append completed tasks 1539-1543 to agent_tasks.csv
"""
tasks = '''TASK-1539,Course 33,bcom_aud,Day 6 - Professional Standards Engagement Terms & Risk Assessment Architecture: SAs 200 to 320,COMPLETED,"SA 200 overall objectives and professional skepticism doctrine, SA 210 preconditions and engagement terms, SA 220 / SQC 1 EQCR quality review, SA 230 working paper experienced auditor standard, 60-day file assembly and 7-year retention, SA 300 audit strategy vs plan, SA 315 RMM and 5 internal control components, and SA 320 quantitative materiality waterfall"
TASK-1540,Course 33,bcom_aud,Day 7 - Internal Financial Controls (IFCoFR) Test of Controls & Audit Sampling: SAs 330 450 & 530,COMPLETED,"SA 330 test of controls vs substantive testing mix, Sec 143(3)(i) IFCoFR mandate and ICAI guidance note, Walkthroughs and Material Weakness criteria, SA 450 factual/judgmental/projected misstatement evaluation, and SA 530 Monetary Unit Sampling Upper Error Limit (UEL) projection formulas"
TASK-1541,Course 33,bcom_aud,Day 8 - Audit Evidence Physical Inventories External Confirmations & Analytical Procedures: SAs 500 to 520,COMPLETED,"SA 500 evidence hierarchy, management experts and IPE testing, SA 501 mandatory physical inventory attendance and roll-forward equations, SA 505 positive vs negative external confirmations, and SA 520 substantive analytical reasonableness models and completion review"
TASK-1542,Course 33,bcom_aud,Day 9 - Companies Act Statutory Reporting & CARO 2020: Section 143 & The 21 Statutory Clauses,COMPLETED,"Sec 143 powers and mandatory inquiries, Sec 143(12) 2-day notice and Form ADT-4 MCA fraud reporting, CARO 2020 21 clauses: Clause (i) PPE and title deeds, Clause (ii) bank quarterly stock statement reconciliations, Clause (iii) loan evergreening, Clause (iv) Sec 185/186, Clause (vii) statutory dues, Clause (ix) fund diversion, Clause (xi) whistleblower, and Clause (xix) 1-year viability"
TASK-1543,Course 33,bcom_aud,Day 10 - Milestone Project 2: Enterprise Statutory Audit IFCoFR Verification & CARO 2020 Compliance Cockpit,COMPLETED,"Master audit risk and materiality allocation engine, automated IFCoFR 150-control diagnostic, Monetary Unit Sampling UEL projection on trade receivables, full CARO 2020 21-clause compliance engine, and independent auditor report synthesis under SA 700/705 conferring Senior Statutory Assurance Controller accreditation"
'''

csv_path = r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv"
with open(csv_path, "a", encoding="utf-8") as f:
    f.write(tasks)

print("Appended tasks 1539-1543 successfully!")
