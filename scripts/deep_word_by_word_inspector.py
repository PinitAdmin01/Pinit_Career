import os
import re
import json
import glob

# Master Inspector for Word-by-Word Curriculum Quality & Mistakes During Urgency

COURSES_TO_INSPECT = [
    ('python', 'src/lib/data/pythonLongLessons.ts', 'Python Programming Mastery'),
    ('react-basics', 'src/lib/data/reactLongLessons.ts', 'React & Modern Frontend Architecture'),
    ('sql-mastery', 'src/lib/data/sqlLongLessons.ts', 'SQL, Database Systems & PostgreSQL'),
    ('java-basics', 'src/lib/data/javaBasicsLongLessons.ts', 'Java Systems & JVM Architecture'),
    ('devops', 'src/lib/data/devopsWebLongLessons.ts', 'DevOps, CI/CD & Cloud Infrastructure'),
    ('iot_emb', 'src/lib/data/iotEmbLongLessons.ts', 'Embedded Systems & Bare-Metal C++'),
    ('blockchain', 'src/lib/data/blockchainLongLessons.ts', 'Blockchain, EVM & Smart Contracts'),
    ('bcom-accounting', 'src/lib/data/bcomAccountingLongLessons.ts', 'Financial Accounting & Bookkeeping'),
    ('bcom-finance', 'src/lib/data/bcomFinanceLongLessons.ts', 'Corporate Finance & Valuation'),
    ('bcom_ban', 'src/lib/data/bcomBanLongLessons.ts', 'Banking, Treasury & Credit Operations'),
    ('bcom_aud', 'src/lib/data/bcomAudLongLessons.ts', 'Statutory Audit & Assurance'),
    ('bcom_tax', 'src/lib/data/bcomTaxLongLessons.ts', 'Taxation, GST & International Tax'),
    ('bcom_law', 'src/lib/data/bcomLawLongLessons.ts', 'Corporate Law & Governance'),
    ('bcom_ops', 'src/lib/data/bcomOpsLongLessons.ts', 'Supply Chain & Logistics Operations'),
    ('bcom_dmkt', 'src/lib/data/bcomDmktLongLessons.ts', 'Digital Marketing & Performance Analytics'),
    ('bcom_ecom', 'src/lib/data/bcomEcomLongLessons.ts', 'E-Commerce Platform Architecture')
]

SYNTHETIC_BOOSTER_PATTERNS = [
    r'heterogeneous distributed invariant',
    r'distributed invariant',
    r'production invariant',
    r'telemetry invariant',
    r'stripe/uber at peak scale',
    r'uber scale',
    r'canonical operational envelope',
    r'hyper-scale telemetry',
    r'enterprise-grade telemetry',
    r'mechanical symmetry'
]

def audit_course_file(prefix, filepath, course_name):
    if not os.path.exists(filepath):
        return None
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    print(f"\n========================================================")
    print(f"AUDITING: {course_name} ({prefix})")
    print(f"File size: {len(content) // 1024} KB")
    print(f"========================================================")

    # Extract days by looking for day: N
    day_matches = list(re.finditer(r'day:\s*(\d+)', content))
    print(f"Total days found: {len(day_matches)}")

    # Check for synthetic booster occurrences in the entire file
    booster_findings = {}
    for pat in SYNTHETIC_BOOSTER_PATTERNS:
        matches = re.findall(pat, content, re.IGNORECASE)
        if matches:
            booster_findings[pat] = len(matches)

    print(f"Synthetic booster matches across course: {booster_findings}")

    # Inspect Day 1 to 5 for Prerequisite Traps
    prereq_findings = []
    if prefix == 'python':
        # Check Day 1 for 'def ' or 'return '
        day1_m = re.search(r'day:\s*1,.*?parts:\s*\[(.*?)\],.*?(?:day:\s*2|$)', content, re.DOTALL)
        if day1_m:
            day1_text = day1_m.group(1)
            if 'def ' in day1_text or 'return ' in day1_text:
                prereq_findings.append({
                    'day': 1,
                    'issue': 'Prerequisite Trap: Functions (def/return) found in Day 1 before functions are taught (Day 16)',
                    'evidence': [line.strip() for line in day1_text.split('\n') if 'def ' in line or 'return ' in line][:3]
                })

    if prefix == 'java-basics':
        day1_m = re.search(r'day:\s*1,.*?parts:\s*\[(.*?)\],.*?(?:day:\s*2|$)', content, re.DOTALL)
        if day1_m:
            day1_text = day1_m.group(1)
            if 'Virtual Threads' in day1_text or 'AutoCloseable' in day1_text:
                prereq_findings.append({
                    'day': 1,
                    'issue': 'Prerequisite Trap: Virtual Threads & AutoCloseable taught in Day 1 before variables, if-statements, and loops',
                    'evidence': 'Advanced Java 21 concurrency concepts introduced to absolute beginners on Day 1'
                })

    return {
        'prefix': prefix,
        'course_name': course_name,
        'days_count': len(day_matches),
        'boosters': booster_findings,
        'prereqs': prereq_findings
    }

if __name__ == '__main__':
    all_reports = []
    for p, f, name in COURSES_TO_INSPECT:
        res = audit_course_file(p, f, name)
        if res:
            all_reports.append(res)
            
    print("\n\nMASTER AUDIT SUMMARY:")
    for r in all_reports:
        print(f"[{r['prefix']:16}] Days: {r['days_count']:2} | Boosters: {sum(r['boosters'].values())} | Prereq Traps: {len(r['prereqs'])}")
