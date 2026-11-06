"""
Comprehensive Auditor: Map every course in PINIT_36_COURSES_DEEP_CURRICULUM_AUDIT.md
to the actual LongLessons and count how many days exist!
"""
import re
import sys
sys.stdout.reconfigure(encoding='utf-8')

# Read longLessons.ts to map arrays and count
with open('src/lib/data/longLessons.ts', 'r', encoding='utf-8') as f:
    ll_content = f.read()

# All array names and their length
# Let's import them or count their occurrences in their source files
course_mappings = [
    ("Course 01: Java Enterprise Core (`course-java-core`)", "src/lib/data/javaBasicsLongLessons.ts", "JAVA_BASICS_LONG_LESSONS", "java-basics"),
    ("Course 02: Full-Stack React Web (`course-react-web`)", "src/lib/data/reactLongLessons.ts", "REACT_LONG_LESSONS", "react-basics"),
    ("Course 03: Cloud Native AWS (`course-cloud-native`)", "src/lib/data/cloudWebLongLessons.ts", "CLOUD_WEB_LONG_LESSONS", "cloud"),
    ("Course 04: DevOps & CI/CD Automation (`course-devops-cicd`)", "src/lib/data/devopsWebLongLessons.ts", "DEVOPS_WEB_LONG_LESSONS", "devops"),
    ("Course 05: UI/UX Design Systems (`course-design-systems`)", "src/lib/data/designWebLongLessons.ts", "DESIGN_WEB_LONG_LESSONS", "design"),
    ("Course 06: Data Structures & Algorithms (`course-dsa-optim`)", "src/lib/data/dsaWebLongLessons.ts", "DSA_WEB_LONG_LESSONS", "dsa-optim"),
    ("Course 07: Mobile Application Dev (`course-mobile-dev`)", "src/lib/data/mobileLongLessons.ts", "MOBILE_LONG_LESSONS", "mobile"),
    ("Course 08: Cybersecurity Principles (`course-cybersecurity`)", "src/lib/data/cyberWebLongLessons.ts", "CYBER_WEB_LONG_LESSONS", "cyber"),
    ("Course 09: Database Engineering (`course-database-eng`)", "src/lib/data/sqlLongLessons.ts", "SQL_LONG_LESSONS", "sql-mastery"),
    ("Course 10: Distributed Systems (`course-distributed-systems`)", "src/lib/data/distributedWebLongLessons.ts", "DISTRIBUTED_WEB_LONG_LESSONS", "dist"),
    ("Course 11: Applied AI Engineering (`course-ai-eng`)", "src/lib/data/aiWebLongLessons.ts", "AI_WEB_LONG_LESSONS", "ai"),
    ("Course 12: Full-Stack Web Dev & APIs (`course-fullstack-dev`)", "src/lib/data/fullstackJsLongLessons.ts", "FULLSTACK_JS_LONG_LESSONS", "fullstack-js"),
    ("Course 13: Embedded Systems (`course-iot-embedded`)", "src/lib/data/iotEmbLongLessons.ts", "IOT_EMB_LONG_LESSONS", "iot_emb"),
    ("Course 14: 3D Graphics & WebGL (`course-3d-graphics`)", "src/lib/data/g3dLongLessons.ts", "G3D_LONG_LESSONS", "g3d"),
    ("Course 15: Smart Contracts & Web3 (`course-blockchain-web3`)", "src/lib/data/blockchainLongLessons.ts", "BLOCKCHAIN_LONG_LESSONS", "blockchain"),
    ("Course 16: Wireless Mesh & IoT Networks (`course-iot-wireless`)", "src/lib/data/iotNetLongLessons.ts", "IOT_NET_LONG_LESSONS", "iot_net"),
    ("Course 17: Edge AI & Microcontrollers (`course-edge-ai`)", "src/lib/data/iotEdgeLongLessons.ts", "IOT_EDGE_LONG_LESSONS", "iot_edge"),
    ("Course 18: Industrial IoT Security (`course-industrial-iot-sec`)", "src/lib/data/iotSecLongLessons.ts", "IOT_SEC_LONG_LESSONS", "iot_sec"),
    ("Course 19: Python Backend Systems (`course-python-fastapi`)", "src/lib/data/pythonLongLessons.ts", "PYTHON_LONG_LESSONS", "python"),
    ("Course 20: Quantitative Trading Systems (`course-quant-trading`)", "src/lib/data/quantSystemsLongLessons.ts", "QUANT_SYSTEMS_LONG_LESSONS", "quant-systems"),
    ("Course 21: Accounting & ERP Compliance (`course-bcom-accounting`)", "src/lib/data/bcomAccountingLongLessons.ts", "BCOM_ACCOUNTING_LONG_LESSONS", "bcom_acc"),
    ("Course 22: Corporate Finance & Valuation (`course-bcom-finance`)", "src/lib/data/bcomFinanceLongLessons.ts", "BCOM_FINANCE_LONG_LESSONS", "bcom_fin"),
    ("Course 23: Business Analytics & Decision Making (`course-bcom-analytics`)", "src/lib/data/bcomAnaLongLessons.ts", "BCOM_ANA_LONG_LESSONS", "bcom_ana"),
    ("Course 24: Brand Marketing & Psychology (`course-bcom-marketing`)", "src/lib/data/bcomMktLongLessons.ts", "BCOM_MKT_LONG_LESSONS", "bcom_mkt"),
    ("Course 25: Performance Marketing & Growth (`course-bcom-digital-mktg`)", "src/lib/data/bcomDmktLongLessons.ts", "BCOM_DMKT_LONG_LESSONS", "bcom_dmkt"),
    ("Course 26: E-Commerce Operations (`course-bcom-ecommerce`)", "src/lib/data/bcomEcomLongLessons.ts", "BCOM_ECOM_LONG_LESSONS", "bcom_ecom"),
    ("Course 27: Venture Creation & Entrepreneurship (`course-bcom-entrepreneurship`)", "src/lib/data/bcomEntLongLessons.ts", "BCOM_ENT_LONG_LESSONS", "bcom_ent"),
    ("Course 28: Sales & CRM / Statutory Audit (`course-bcom-sales-crm`)", "src/lib/data/bcomAudLongLessons.ts", "BCOM_AUD_LONG_LESSONS", "bcom_aud"),
    ("Course 29: Supply Chain & Banking Operations (`course-bcom-operations`)", "src/lib/data/bcomBanLongLessons.ts", "BCOM_BAN_LONG_LESSONS", "bcom_ban"),
    ("Course 30: AI Transformation & Automation (`course-bcom-ai-transformation`)", "src/lib/data/bcomAitLongLessons.ts", "BCOM_AIT_LONG_LESSONS", "bcom_ait"),
    ("Course 31: Computer Fundamentals & Linux (`course-computer-fundamentals`)", "src/lib/data/compFundLongLessons.ts", "COMP_FUND_LONG_LESSONS", "comp_fund"),
    ("Course 32: AI Prompt Engineering (`course-ai-prompt-literacy`)", "src/lib/data/promptPythonLongLessons.ts", "PROMPT_PYTHON_LONG_LESSONS", "prompt-py"),
    ("Course 33: Excel & Visual Business Intelligence (`course-excel-data-viz`)", "src/lib/data/excelVizLongLessons.ts", "EXCEL_VIZ_LONG_LESSONS", "excel_viz"),
    ("Course 34: Git Version Control (`course-git-version-control`)", "src/lib/data/gitVcsLongLessons.ts", "GIT_VCS_LONG_LESSONS", "git_vcs"),
    ("Course 35: Executive Soft Skills (`course-soft-skills`)", "src/lib/data/softSkillsLongLessons.ts", "SOFT_SKILLS_LONG_LESSONS", "soft-skills"),
    ("Course 36: NLP & Computational Linguistics (`course-nlp-computational`)", "src/lib/data/nlpPythonLongLessons.ts", "NLP_PYTHON_LONG_LESSONS", "nlp-py"),
    ("Course 37 (Bonus): Corporate Law & Commercial Compliance (`course-bcom-law`)", "src/lib/data/bcomLawLongLessons.ts", "BCOM_LAW_LONG_LESSONS", "bcom_law"),
    ("Course 38 (Bonus): Direct & Indirect Taxation (`course-bcom-tax`)", "src/lib/data/bcomTaxLongLessons.ts", "BCOM_TAX_LONG_LESSONS", "bcom_tax"),
    ("Course 39 (Bonus): Supply Chain Risk Management (`course-bcom-scrm`)", "src/lib/data/bcomScrmLongLessons.ts", "BCOM_SCRM_LONG_LESSONS", "bcom_scrm"),
    ("Course 40 (Bonus): Node.js Web Microservices (`course-node-web`)", "src/lib/data/nodeWebLongLessons.ts", "NODE_WEB_LONG_LESSONS", "node-web"),
    ("Course 41 (Bonus): Operations & Logistics (`course-bcom-ops`)", "src/lib/data/bcomOpsLongLessons.ts", "BCOM_OPS_LONG_LESSONS", "bcom_ops"),
]

import os

print("=" * 90)
print(f"{'#':<3} | {'Course Identifier':<42} | {'Days':<6} | {'Status':<16} | {'File Exists'}")
print("-" * 90)

total_canonical_36_days = 0
courses_at_60 = 0

for idx, (title, fpath, arr_name, prefix) in enumerate(course_mappings[:36], 1):
    if not os.path.exists(fpath):
        print(f"{idx:<3} | {title:<42} | {'0':<6} | {'FILE MISSING':<16} | No")
        continue
    with open(fpath, 'r', encoding='utf-8') as f:
        src = f.read()
    days = [int(x) for x in re.findall(r'"day":\s*(\d+)', src)]
    day_count = len(set(days))
    total_canonical_36_days += day_count
    status = "60/60 (100.0%)" if day_count == 60 else f"{day_count}/60"
    if day_count == 60:
        courses_at_60 += 1
    print(f"{idx:<3} | {title:<42} | {day_count:<6} | {status:<16} | Yes")

print("-" * 90)
print(f"CANONICAL 36 COURSES AUDIT SUMMARY:")
print(f"  Courses 100% Complete (60/60 Days): {courses_at_60} / 36")
print(f"  Total Days across Canonical 36:     {total_canonical_36_days} / 2,160 Days ({(total_canonical_36_days / 2160)*100:.2f}%)")
print("=" * 90)

print("\nBONUS/ADDITIONAL COURSES AUDIT:")
print("-" * 90)
for idx, (title, fpath, arr_name, prefix) in enumerate(course_mappings[36:], 37):
    if not os.path.exists(fpath):
        print(f"{idx:<3} | {title:<42} | {'0':<6} | {'FILE MISSING':<16} | No")
        continue
    with open(fpath, 'r', encoding='utf-8') as f:
        src = f.read()
    days = [int(x) for x in re.findall(r'"day":\s*(\d+)', src)]
    day_count = len(set(days))
    status = "60/60 (100.0%)" if day_count == 60 else f"{day_count}/60"
    print(f"{idx:<3} | {title:<42} | {day_count:<6} | {status:<16} | Yes")
print("=" * 90)
