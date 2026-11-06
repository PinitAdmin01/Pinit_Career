import os, glob, re, json

with open('scripts/course-curriculum-summary.json', 'r', encoding='utf-8') as f:
    courses = json.load(f)

# Mapping of course-id to main data file
id_to_file = {
    'course-java-logic': 'javaBasicsLongLessons.ts',
    'course-react-web': 'reactLongLessons.ts',
    'course-node-web': 'nodeWebLongLessons.ts',
    'course-cloud-native': 'cloudWebLongLessons.ts',
    'course-devops-cicd': 'devopsWebLongLessons.ts',
    'course-design-systems': 'designWebLongLessons.ts',
    'course-dsa-optim': 'dsaWebLongLessons.ts',
    'course-mobile-dev': 'mobileLongLessons.ts',
    'course-cybersecurity': 'cyberWebLongLessons.ts',
    'course-database-eng': 'sqlLongLessons.ts',
    'course-distributed-sys': 'distributedWebLongLessons.ts',
    'course-ai-eng': 'aiWebLongLessons.ts',
    'course-fullstack-js': 'fullstackJsLongLessons.ts',
    'course-iot-embedded': 'iotEmbLongLessons.ts',
    'course-3d-graphics': 'g3dLongLessons.ts',
    'course-blockchain-web3': 'blockchainLongLessons.ts',
    'course-iot-network': 'iotNetLongLessons.ts',
    'course-iot-edge-ai': 'iotEdgeLongLessons.ts',
    'course-iot-security': 'iotSecLongLessons.ts',
    'course-python-backend': 'pythonLongLessons.ts',
    'course-quant-systems': 'quantSystemsLongLessons.ts',
    'course-digital-accounting': 'bcomAccountingLongLessons.ts',
    'course-finance-investment': 'bcomFinanceLongLessons.ts',
    'course-business-analytics': 'bcomAnaLongLessons.ts',
    'course-marketing-branding': 'bcomMktLongLessons.ts',
    'course-digital-marketing': 'bcomDmktLongLessons.ts',
    'course-ecommerce-digital-biz': 'bcomEcomLongLessons.ts',
    'course-entrepreneurship-biz-mgmt': 'bcomEntLongLessons.ts',
    'course-sales-crm-success': 'bcomScrmLongLessons.ts',
    'course-operations-supplychain-compliance': 'bcomOpsLongLessons.ts',
    'course-ai-digital-transformation': 'bcomAitLongLessons.ts',
    'course-computer-fundamentals': 'compFundLongLessons.ts',
    'course-ai-prompt-literacy': 'promptPythonLongLessons.ts',
    'course-excel-data-viz': 'excelVizLongLessons.ts',
    'course-git-version-control': 'gitVcsLongLessons.ts',
    'course-softskills-communication': 'softSkillsLongLessons.ts',
    'course-nlp': 'nlpPythonLongLessons.ts',
}

print(f"{'#':<3} | {'Course ID':<32} | {'File':<28} | {'Days':<6} | {'Target':<6} | {'% Complete':<10}")
print("="*95)

total_bible_days = len(courses) * 60
bible_days_completed = 0

for c in courses:
    c_num = c.get('num', 0)
    cid = c.get('id', '')
    fname = id_to_file.get(cid, '')
    fpath = os.path.join('src/lib/data', fname)
    if os.path.exists(fpath):
        with open(fpath, 'r', encoding='utf-8', errors='ignore') as fp:
            content = fp.read()
        days = re.findall(r'["\']?day["\']?\s*:\s*(\d+)', content)
        day_nums = sorted(list(set(int(d) for d in days if 1 <= int(d) <= 60)))
        count = len(day_nums)
    else:
        count = 0
    bible_days_completed += count
    pct = (count / 60) * 100
    print(f"{c_num:>2}  | {cid:<32} | {fname:<28} | {count:>4}   |   60   | {pct:>6.1f}%")

print("="*95)
overall_pct = (bible_days_completed / total_bible_days) * 100
overall_remaining = 100.0 - overall_pct
print(f"TOTAL 37 BIBLE COURSES DAYS TARGET: {total_bible_days} Days (37 courses x 60 days)")
print(f"TOTAL BIBLE DAYS IMPLEMENTED:     {bible_days_completed} Days")
print(f"TOTAL BIBLE DAYS REMAINING:       {total_bible_days - bible_days_completed} Days")
print(f"EXACT PERCENTAGE COMPLETED:        {overall_pct:.2f}%")
print(f"EXACT PERCENTAGE REMAINING:        {overall_remaining:.2f}%")
