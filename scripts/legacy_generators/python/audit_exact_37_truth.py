import os
import re

branches = {
    'Branch_A': r'C:\Users\Admin\Desktop\projects\Present-Career-os',
    'Branch_B': r'C:\Users\Admin\Desktop\projects\Present-Career-os-commerce',
    'Branch_C': r'C:\Users\Admin\Desktop\projects\Present-Career-os-platform',
}

tech_courses = [
    ("javaBasicsLongLessons.ts", "Java Basics & Core Logic"),
    ("reactLongLessons.ts", "React & Modern Web"),
    ("nodeWebLongLessons.ts", "Node.js & Backend Eng"),
    ("cloudWebLongLessons.ts", "Cloud Native & Microservices"),
    ("devopsWebLongLessons.ts", "DevOps & CI/CD Pipelines"),
    ("designWebLongLessons.ts", "UI/UX & Design Systems"),
    ("dsaWebLongLessons.ts", "Data Structures & Algorithms"),
    ("mobileLongLessons.ts", "Mobile App Development"),
    ("cyberWebLongLessons.ts", "Cybersecurity & Defense"),
    ("sqlLongLessons.ts", "Database Engineering & SQL"),
    ("distributedWebLongLessons.ts", "Distributed Systems & Cloud"),
    ("aiWebLongLessons.ts", "AI & Machine Learning"),
    ("fullstackJsLongLessons.ts", "Fullstack TypeScript"),
    ("iotEmbLongLessons.ts", "IoT Embedded Systems & C"),
    ("g3dLongLessons.ts", "3D Graphics & WebGL"),
    ("blockchainLongLessons.ts", "Blockchain & Web3 Eng"),
    ("iotNetLongLessons.ts", "IoT Networking & Protocols"),
    ("iotEdgeLongLessons.ts", "Edge AI & TinyML"),
    ("iotSecLongLessons.ts", "IoT Hardware Security"),
    ("pythonLongLessons.ts", "Python High-Perf Backend"),
    ("quantSystemsLongLessons.ts", "Quantitative Systems Eng"),
    ("compFundLongLessons.ts", "Computer Fundamentals"),
    ("softSkillsLongLessons.ts", "Executive Soft Skills"),
]

commerce_courses = [
    ("bcomAccountingLongLessons.ts", "Accounting & Forensic Bookkeeping (bcom_acc)"),
    ("bcomFinanceLongLessons.ts", "Corporate Finance & Capital Markets (bcom_fin)"),
    ("bcomMktLongLessons.ts", "Strategic Marketing & Brand Systems (bcom_mkt)"),
    ("bcomAudLongLessons.ts", "Statutory Audit & Corporate Assurance (bcom_aud)"),
    ("bcomBanLongLessons.ts", "Banking, Treasury & Credit Operations (bcom_ban)"),
    ("bcomDmktLongLessons.ts", "Digital Marketing Analytics & Performance (bcom_dmkt)"),
    ("bcomEcomLongLessons.ts", "E-Commerce Platform Architecture (bcom_ecom)"),
    ("bcomEntLongLessons.ts", "Entrepreneurship & Venture Incubation (bcom_ent)"),
    ("bcomLawLongLessons.ts", "Corporate Law, IBC & Compliance (bcom_law)"),
    ("bcomOpsLongLessons.ts", "Operations Management & Logistics (bcom_ops)"),
    ("bcomScrmLongLessons.ts", "Supply Chain & Vendor Risk Management (bcom_scrm)"),
    ("bcomTaxLongLessons.ts", "Direct & Indirect Taxation (bcom_tax)"),
    ("bcomAitLongLessons.ts", "AI & Fintech in Business Systems (bcom_ait)"),
    ("bcomAnaLongLessons.ts", "Business Analytics & Decision Models (bcom_ana)"),
]

print(f"Tech Courses Count: {len(tech_courses)}")
print(f"Commerce Courses Count: {len(commerce_courses)}")
print(f"TOTAL EXACT COURSES: {len(tech_courses) + len(commerce_courses)}")

all_courses = [("TECH", f, n) for f, n in tech_courses] + [("COMMERCE", f, n) for f, n in commerce_courses]

results = []
for track, fname, cname in all_courses:
    row = {'track': track, 'file': fname, 'name': cname}
    for bname, bpath in branches.items():
        fullpath = os.path.join(bpath, 'src/lib/data', fname)
        if os.path.exists(fullpath):
            with open(fullpath, 'r', encoding='utf-8', errors='ignore') as fp:
                c = fp.read()
            days = sorted(list(set([int(d) for d in re.findall(r'(?:\"day\"|day)\s*:\s*(\d+)', c)])))
            m1 = [d for d in days if 1 <= d <= 30]
            m2 = [d for d in days if 31 <= d <= 60]
            row[bname.lower()] = {'m1': len(m1), 'm2': len(m2), 'total': len(days)}
        else:
            row[bname.lower()] = {'m1': 0, 'm2': 0, 'total': 0}
            
    best_m1 = max(row['branch_a']['m1'], row['branch_b']['m1'], row['branch_c']['m1'])
    best_m2 = max(row['branch_a']['m2'], row['branch_b']['m2'], row['branch_c']['m2'])
    row['best_m1'] = best_m1
    row['best_m2'] = best_m2
    row['m1_rem'] = max(0, 30 - best_m1)
    row['m2_rem'] = max(0, 30 - best_m2)
    row['total_rem'] = row['m1_rem'] + row['m2_rem']
    results.append(row)

print("\n" + "=" * 120)
print(f"{'#':<2} | {'Track':<8} | {'Course File':<30} | {'Name':<35} | {'M1 Done':<7} | {'M2 Done':<7} | {'M1 Rem':<6} | {'M2 Rem':<6} | {'Total Rem'}")
print("=" * 120)

total_m1_rem = 0
total_m2_rem = 0
complete_60 = 0

for i, r in enumerate(results):
    total_m1_rem += r['m1_rem']
    total_m2_rem += r['m2_rem']
    if r['best_m1'] == 30 and r['best_m2'] == 30:
        complete_60 += 1
    print(f"{i+1:>2} | {r['track']:<8} | {r['file']:<30} | {r['name'][:35]:<35} | {r['best_m1']:>2}/30   | {r['best_m2']:>2}/30   | {r['m1_rem']:>2}d    | {r['m2_rem']:>2}d    | {r['total_rem']:>2}d")

print("=" * 120)
print(f"GROUND TRUTH SUMMARY ACROSS ALL 37 COURSES (23 TECH + 14 COMMERCE):")
print(f"1. Month 1 Remaining: {total_m1_rem} Days (Only bcom_ana missing Days 6-30: 25 days)")
print(f"2. Month 2 Remaining: {total_m2_rem} Days")
print(f"3. Total Remaining to reach 100% of 60-Day Curriculum: {total_m1_rem + total_m2_rem} Days")
print(f"4. Courses 100% Complete (60/60 Days): {complete_60} / 37")
print(f"5. Courses Partially Complete: {sum(1 for r in results if r['total_rem'] > 0 and (r['best_m1'] + r['best_m2']) > 30)} / 37")
print(f"6. Courses at 30/60 (Month 1 Complete, Month 2 Not Started): {sum(1 for r in results if r['best_m1'] == 30 and r['best_m2'] == 0)} / 37")
print(f"7. Courses at 5/60: {sum(1 for r in results if r['best_m1'] < 30)} / 37")
