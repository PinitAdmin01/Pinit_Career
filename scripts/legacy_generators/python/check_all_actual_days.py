import os
import re
import json

branches = {
    'Branch_A': r'C:\Users\Admin\Desktop\projects\Present-Career-os',
    'Branch_B': r'C:\Users\Admin\Desktop\projects\Present-Career-os-commerce',
    'Branch_C': r'C:\Users\Admin\Desktop\projects\Present-Career-os-platform',
}

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

def get_days_from_file(filepath):
    if not os.path.exists(filepath):
        return []
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    # Match patterns like: day: 1, "day": 1, 'day': 1
    matches = re.findall(r'(?:[\'"]?day[\'"]?)\s*:\s*(\d+)', content)
    # Ensure they are valid lesson days (1-60)
    valid_days = set()
    for m in matches:
        val = int(m)
        if 1 <= val <= 60:
            valid_days.add(val)
    return sorted(list(valid_days))

print(f"{'#':<2} | {'Course ID':<25} | {'File':<26} | {'Br A':<8} | {'Br B':<8} | {'Br C':<8} | {'Max Found':<10} | {'Missing Days'}")
print("-" * 115)

total_max_days = 0
total_missing_days = 0

for num, cid, title, filename in courses_37:
    days_a = get_days_from_file(os.path.join(branches['Branch_A'], 'src/lib/data', filename))
    days_b = get_days_from_file(os.path.join(branches['Branch_B'], 'src/lib/data', filename))
    days_c = get_days_from_file(os.path.join(branches['Branch_C'], 'src/lib/data', filename))
    
    # union of all branches to find best merged state
    all_found = sorted(list(set(days_a) | set(days_b) | set(days_c)))
    missing = [d for d in range(1, 61) if d not in all_found]
    
    total_max_days += len(all_found)
    total_missing_days += len(missing)
    
    str_a = f"{len(days_a)}/60"
    str_b = f"{len(days_b)}/60"
    str_c = f"{len(days_c)}/60"
    str_max = f"{len(all_found)}/60"
    missing_desc = f"{len(missing)} missing" if missing else "COMPLETE"
    if 0 < len(missing) <= 15:
        missing_desc += f" (Days {min(missing)}-{max(missing)})"
    elif len(missing) > 15:
        missing_desc += f" (e.g. Days {min(missing)}..{max(missing)})"
        
    print(f"{num:<2} | {cid:<25} | {filename:<26} | {str_a:<8} | {str_b:<8} | {str_c:<8} | {str_max:<10} | {missing_desc}")

print("-" * 115)
print(f"TOTAL DAYS ACROSS ALL 37 COURSES (37 x 60 = 2220 days target):")
print(f"Total Completed: {total_max_days} / 2220 ({total_max_days / 2220 * 100:.2f}%)")
print(f"Total Remaining: {total_missing_days} / 2220 ({total_missing_days / 2220 * 100:.2f}%)")
