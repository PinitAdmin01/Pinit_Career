import os

csv_path = r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv"
with open(csv_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

new_tasks = [
    'TASK-1559,Course 33,bcom_aud,"Day 26 - Digital Forensics, E-Discovery & Electronic Evidence Admissibility: Section 65B & NIST SP 800-86",COMPLETED,"Digital forensic order of volatility, bitstream imaging with write-blockers, Sec 65B Arjun Panditrao Khotkar certificates, and NTFS $MFT MACB timestomping."\n',
    'TASK-1560,Course 33,bcom_aud,"Day 27 - Cyber Incident Auditing, Ransomware Forensics & Business Email Compromise: CERT-In 6-Hour Rule",COMPLETED,"BEC wire fraud investigation, RFC 5322 email headers, CERT-In April 2022 6-hour incident reporting mandate, and Ind AS 37 cyber loss provisioning."\n',
    'TASK-1561,Course 33,bcom_aud,"Day 28 - Artificial Intelligence & Continuous Audit Analytics: Isolation Forests, Model Governance & Rule 11(g)",COMPLETED,"Continuous auditing pipelines, unsupervised Isolation Forest anomaly scoring, SHAP interpretability, and Rule 11(g) database audit trail verification."\n',
    'TASK-1562,Course 33,bcom_aud,"Day 29 - Courtroom Expert Testimony, Forensic Report Writing & NFRA Sanctions: Section 45 & Section 132",COMPLETED,"Section 45 expert witness standards, Daubert/Mohan admissibility, hostile cross-examination defense, SA 230 audit documentation shields, and NFRA Sec 132 penalties."\n',
    'TASK-1563,Course 33,bcom_aud,Day 30 - Milestone Project 6: Chief Audit Executive (CAE) Grand Master Capstone & Corporate Fraud War Room,COMPLETED,"Chief Audit Executive (CAE) Grand Master Capstone: Internal Audit Charter, Benford Chi-Square procurement screening, CERT-In cyber war room, Sec 65B trial dossier, and Board Audit Committee defense."\n'
]

insert_idx = -1
for i, l in enumerate(lines):
    if l.startswith("TASK-1558,Course 33"):
        insert_idx = i + 1
        break

if insert_idx != -1:
    lines[insert_idx:insert_idx] = new_tasks
    with open(csv_path, "w", encoding="utf-8") as f:
        f.writelines(lines)
    print(f"Successfully inserted tasks at index {insert_idx}")
else:
    print("Could not find TASK-1558")
