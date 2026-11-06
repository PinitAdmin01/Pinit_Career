import os, re

mapping = {
    'Course 01 [java-basics]': 'src/lib/data/javaBasicsLongLessons.ts',
    'Course 02 [react-web]': 'src/lib/data/reactLongLessons.ts',
    'Course 03 [node-web]': 'src/lib/data/nodeWebLongLessons.ts',
    'Course 04 [cloud-native]': 'src/lib/data/cloudWebLongLessons.ts',
    'Course 05 [devops-cicd]': 'src/lib/data/devopsWebLongLessons.ts',
    'Course 06 [design-systems]': 'src/lib/data/designWebLongLessons.ts',
    'Course 07 [dsa-optim]': 'src/lib/data/dsaWebLongLessons.ts',
    'Course 08 [mobile-dev]': 'src/lib/data/mobileLongLessons.ts',
    'Course 09 [cybersecurity]': 'src/lib/data/cyberWebLongLessons.ts',
    'Course 10 [database-eng]': 'src/lib/data/sqlLongLessons.ts',
    'Course 11 [distributed-sys]': 'src/lib/data/distributedWebLongLessons.ts',
    'Course 12 [ai-eng]': 'src/lib/data/aiWebLongLessons.ts',
    'Course 13 [fullstack-js]': 'src/lib/data/fullstackJsLongLessons.ts',
    'Course 14 [iot-embedded]': 'src/lib/data/iotEmbLongLessons.ts',
    'Course 15 [3d-graphics]': 'src/lib/data/g3dLongLessons.ts',
    'Course 16 [blockchain-web3]': 'src/lib/data/blockchainLongLessons.ts',
    'Course 17 [iot-network]': 'src/lib/data/iotNetLongLessons.ts',
    'Course 18 [iot-edge-ai]': 'src/lib/data/iotEdgeLongLessons.ts',
    'Course 19 [iot-security]': 'src/lib/data/iotSecLongLessons.ts',
    'Course 20 [python-backend]': 'src/lib/data/pythonLongLessons.ts',
    'Course 21 [quant-systems]': 'src/lib/data/quantSystemsLongLessons.ts',
    'Course 22 [digital-accounting]': 'src/lib/data/bcomAccountingLongLessons.ts',
    'Course 23 [finance-investment]': 'src/lib/data/bcomFinanceLongLessons.ts',
    'Course 24 [business-analytics]': 'src/lib/data/bcomAnaLongLessons.ts',
    'Course 25 [marketing-branding]': 'src/lib/data/bcomMktLongLessons.ts',
    'Course 26 [digital-marketing]': 'src/lib/data/bcomDmktLongLessons.ts',
    'Course 27 [ecommerce-digital-biz]': 'src/lib/data/bcomEcomLongLessons.ts',
    'Course 28 [entrepreneurship-biz]': 'src/lib/data/bcomEntLongLessons.ts',
    'Course 29 [sales-crm-success]': 'src/lib/data/bcomScrmLongLessons.ts',
    'Course 30 [operations-supplychain]': 'src/lib/data/bcomOpsLongLessons.ts',
    'Course 31 [ai-digital-transform]': 'src/lib/data/bcomAitLongLessons.ts',
    'Course 32 [computer-fundamentals]': 'src/lib/data/compFundLongLessons.ts',
    'Course 33 [ai-prompt-literacy]': 'src/lib/data/promptPythonLongLessons.ts',
    'Course 34 [excel-data-viz]': 'src/lib/data/excelVizLongLessons.ts',
    'Course 35 [git-version-control]': 'src/lib/data/gitVcsLongLessons.ts',
    'Course 36 [softskills-communication]': 'src/lib/data/softSkillsLongLessons.ts',
    'Course 37 [nlp]': 'src/lib/data/nlpPythonLongLessons.ts'
}

print("=== 37 MASTER COURSES DETAILED AUDIT ===")
total_days_37 = 0
target_month1_37 = 37 * 30 # 1,110 days (Exact volume scope stated in PDF)
target_full_37 = 37 * 60   # 2,220 days (Full 60-day curriculum)

completed_courses_m1 = 0
completed_courses_full = 0

for name, path in mapping.items():
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8', errors='ignore') as fp:
            txt = fp.read()
        matches = [int(m) for m in re.findall(r'[\'"]?day[\'"]?\s*:\s*(\d+)', txt)]
        u_days = len(set(matches))
    else:
        u_days = 0
    total_days_37 += u_days
    if u_days >= 30:
        completed_courses_m1 += 1
    if u_days >= 60:
        completed_courses_full += 1
    pct_m1 = min(100.0, (u_days / 30.0) * 100.0)
    pct_full = min(100.0, (u_days / 60.0) * 100.0)
    print(f"{name:38s}: {u_days:2d} days (Month 1: {pct_m1:5.1f}% | Full 60D: {pct_full:5.1f}%)")

print("\n--- SUMMARY METRICS ACCORDING TO PDF VOLUME SCOPE ---")
print(f"Total Implemented Days across 37 Courses: {total_days_37} days")
print(f"PDF Stated Scope (37 Courses x 30 Days = 1,110 Days):")
m1_pct = (total_days_37 / target_month1_37) * 100.0
print(f"  * Month 1 Scope Completion: {total_days_37} / {target_month1_37} = {m1_pct:.1f}%")
print(f"  * Remaining for Month 1 Foundation across all courses: {max(0.0, 100.0 - m1_pct):.1f}%")
print(f"  * Courses with Month 1 100% complete (>=30 days): {completed_courses_m1} / 37 ({completed_courses_m1/37*100:.1f}%)")

full_pct = (total_days_37 / target_full_37) * 100.0
print(f"\nFull 60-Day Curriculum Scope (37 Courses x 60 Days = 2,220 Days):")
print(f"  * Total 60-Day Completion: {total_days_37} / {target_full_37} = {full_pct:.1f}%")
print(f"  * Remaining for Full 60-Day Curriculum: {100.0 - full_pct:.1f}%")
print(f"  * Courses with Full 60 Days Complete: {completed_courses_full} / 37 ({completed_courses_full/37*100:.1f}%)")
