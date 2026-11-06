import os
import re

branches = {
    'Branch_A': r'C:\Users\Admin\Desktop\projects\Present-Career-os',
    'Branch_B': r'C:\Users\Admin\Desktop\projects\Present-Career-os-commerce',
    'Branch_C': r'C:\Users\Admin\Desktop\projects\Present-Career-os-platform',
}

# The 37 courses from COURSES_CATALOG mapped to their primary LongLessons file
courses_37 = [
    (1, "course-java-logic", "Java Fundamentals & Core Logic", "javaBasicsLongLessons.ts"),
    (2, "course-react-web", "Modern Frontend with React & Next.js", "reactLongLessons.ts"),
    (3, "course-node-web", "Backend Engineering with Node.js", "nodeWebLongLessons.ts"),
    (4, "course-cloud-native", "Cloud Native Architectures & Microservices", "cloudWebLongLessons.ts"),
    (5, "course-devops-cicd", "DevOps, CI/CD & Infrastructure as Code", "devopsWebLongLessons.ts"),
    (6, "course-design-systems", "UI/UX Architecture & Enterprise Design Systems", "designWebLongLessons.ts"),
    (7, "course-dsa-optim", "Algorithms, Data Structures & Optimization", "dsaWebLongLessons.ts"),
    (8, "course-mobile-dev", "Cross-Platform Mobile Engineering", "mobileLongLessons.ts"),
    (9, "course-cybersecurity", "Cybersecurity, AppSec & Threat Modeling", "cyberWebLongLessons.ts"),
    (10, "course-database-eng", "Database Internals, SQL & Data Pipelines", "sqlLongLessons.ts"),
    (11, "course-distributed-sys", "Distributed Systems, Consensus & Fault Tolerance", "distributedWebLongLessons.ts"),
    (12, "course-ai-eng", "Applied AI, Machine Learning & LLM Integration", "aiWebLongLessons.ts"),
    (13, "course-fullstack-js", "Full Stack TypeScript Mastery", "fullstackJsLongLessons.ts"),
    (14, "course-iot-embedded", "Embedded Systems, RTOS & Firmware Engineering", "iotEmbLongLessons.ts"),
    (15, "course-3d-graphics", "3D Graphics, WebGL & Spatial Computing", "g3dLongLessons.ts"),
    (16, "course-blockchain-web3", "Decentralized Systems, Smart Contracts & Web3", "blockchainLongLessons.ts"),
    (17, "course-iot-network", "IoT Wireless Networks & Protocols", "iotNetLongLessons.ts"),
    (18, "course-iot-edge-ai", "Edge AI, DSP & TinyML Systems", "iotEdgeLongLessons.ts"),
    (19, "course-iot-security", "IoT Hardware Security & Cryptography", "iotSecLongLessons.ts"),
    (20, "course-python-backend", "Python Backend & High-Performance Systems", "pythonLongLessons.ts"),
    (21, "course-quant-systems", "Quantitative Trading Systems & Financial Eng", "quantSystemsLongLessons.ts"),
    (22, "course-digital-accounting", "Digital Accounting, Forensics & Taxation", "bcomAccountingLongLessons.ts"),
    (23, "course-finance-investment", "Corporate Finance & Capital Markets", "bcomFinanceLongLessons.ts"),
    (24, "course-business-analytics", "Business Analytics & Predictive Modeling", "bcomAnaLongLessons.ts"),
    (25, "course-marketing-branding", "Strategic Marketing & Brand Engineering", "bcomMktLongLessons.ts"),
    (26, "course-digital-marketing", "Digital Marketing Performance & Attribution", "bcomDmktLongLessons.ts"),
    (27, "course-ecommerce-digital-biz", "E-Commerce Architecture & Digital Business", "bcomEcomLongLessons.ts"),
    (28, "course-entrepreneurship-biz-mgmt", "Venture Creation & Corporate Strategy", "bcomEntLongLessons.ts"),
    (29, "course-sales-crm-success", "Enterprise Sales Engineering & Customer Success", "bcomScrmLongLessons.ts"),
    (30, "course-operations-supplychain-compliance", "Operations, Logistics & Global Trade", "bcomOpsLongLessons.ts"),
    (31, "course-ai-digital-transformation", "AI, Automation & Fintech Systems", "bcomAitLongLessons.ts"),
    (32, "course-computer-fundamentals", "Computer Fundamentals & Architecture", "compFundLongLessons.ts"),
    (33, "course-ai-prompt-literacy", "Generative AI, Prompt Engineering & Agents", "promptPythonLongLessons.ts"),
    (34, "course-excel-data-viz", "Business Intelligence, Excel & Data Viz", "excelVizLongLessons.ts"),
    (35, "course-git-version-control", "Git, Source Control & Team Collaboration", "gitVcsLongLessons.ts"),
    (36, "course-softskills-communication", "Executive Soft Skills & Professional Mastery", "softSkillsLongLessons.ts"),
    (37, "course-nlp", "Natural Language Processing & Speech Tech", "nlpPythonLongLessons.ts")
]

results = []
m1_target_per_course = 30
m2_target_per_course = 30
total_target_per_course = 60

for num, cid, title, filename in courses_37:
    row = {
        'num': num,
        'id': cid,
        'title': title,
        'filename': filename,
        'branch_a': {'m1': 0, 'm2': 0, 'total': 0},
        'branch_b': {'m1': 0, 'm2': 0, 'total': 0},
        'branch_c': {'m1': 0, 'm2': 0, 'total': 0},
        'best_m1': 0,
        'best_m2': 0,
        'best_total': 0,
        'm1_remaining': 0,
        'm2_remaining': 0,
        'total_remaining': 0,
    }
    
    for bname, bpath in branches.items():
        fullpath = os.path.join(bpath, 'src/lib/data', filename)
        if os.path.exists(fullpath):
            with open(fullpath, 'r', encoding='utf-8', errors='ignore') as fp:
                c = fp.read()
            days = sorted(list(set([int(d) for d in re.findall(r'(?:\"day\"|day)\s*:\s*(\d+)', c)])))
            m1 = [d for d in days if 1 <= d <= 30]
            m2 = [d for d in days if 31 <= d <= 60]
            row[bname.lower()] = {'m1': len(m1), 'm2': len(m2), 'total': len(days)}
    
    best_m1 = max(row['branch_a']['m1'], row['branch_b']['m1'], row['branch_c']['m1'])
    best_m2 = max(row['branch_a']['m2'], row['branch_b']['m2'], row['branch_c']['m2'])
    
    row['best_m1'] = best_m1
    row['best_m2'] = best_m2
    row['best_total'] = best_m1 + best_m2
    row['m1_remaining'] = max(0, 30 - best_m1)
    row['m2_remaining'] = max(0, 30 - best_m2)
    row['total_remaining'] = row['m1_remaining'] + row['m2_remaining']
    
    results.append(row)

# Print Summary Table
print(f"{'#':<2} | {'Course ID':<28} | {'Best M1':<8} | {'Best M2':<8} | {'Total':<6} | {'Rem M1':<7} | {'Rem M2':<7} | {'Total Rem':<9} | {'Status'}")
print("-" * 115)

total_m1_done = 0
total_m2_done = 0
total_rem_m1 = 0
total_rem_m2 = 0
m1_100_count = 0
full_100_count = 0

for r in results:
    total_m1_done += r['best_m1']
    total_m2_done += r['best_m2']
    total_rem_m1 += r['m1_remaining']
    total_rem_m2 += r['m2_remaining']
    if r['best_m1'] == 30:
        m1_100_count += 1
    if r['best_m1'] == 30 and r['best_m2'] == 30:
        full_100_count += 1
    
    status = ""
    if r['total_remaining'] == 0:
        status = "COMPLETE (60/60)"
    elif r['m1_remaining'] > 0:
        status = f"M1 Missing {r['m1_remaining']}d, M2 Missing 30d"
    elif r['m2_remaining'] < 30:
        status = f"M1 DONE, M2 in progress ({r['best_m2']}/30 done)"
    else:
        status = "M1 DONE, M2 Not Started (0/30)"
        
    print(f"{r['num']:>2} | {r['id']:<28} | {r['best_m1']:>2}/30    | {r['best_m2']:>2}/30    | {r['best_total']:>2}/60  | {r['m1_remaining']:>2} days  | {r['m2_remaining']:>2} days  | {r['total_remaining']:>2} days   | {status}")

print("-" * 115)
print(f"TOTALS ACROSS ALL 37 COURSES:")
print(f"  * Month 1 Total Days Done: {total_m1_done} / {37*30} ({total_m1_done/(37*30)*100:.2f}%)")
print(f"  * Month 1 Remaining Days: {total_rem_m1} days (only in bcom_ana!)")
print(f"  * Month 1 100% Complete Courses: {m1_100_count} / 37 courses ({m1_100_count/37*100:.1f}%)")
print(f"  * Month 2 Total Days Done: {total_m2_done} / {37*30} ({total_m2_done/(37*30)*100:.2f}%)")
print(f"  * Month 2 Remaining Days: {total_rem_m2} days")
print(f"  * Full 60-Day 100% Complete Courses: {full_100_count} / 37 courses ({full_100_count/37*100:.1f}%)")
print(f"  * Total Platform Remaining Work: {total_rem_m1 + total_rem_m2} Days to write")
