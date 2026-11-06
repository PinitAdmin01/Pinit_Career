# scripts/audit_all_37_ground_truth.py
import json
import os
import re

with open('docs/visuals/36_COURSES_DETAILED_AUDIT_REPORT.json', 'r', encoding='utf-8') as f:
    audit_data = json.load(f)

with open('scripts/course-curriculum-summary.json', 'r', encoding='utf-8') as f:
    summary_data = json.load(f)

# ID to ts file map
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

# Prefix map for visual folders
prefix_map = {
    'course-java-logic': 'java_basics',
    'course-react-web': 'react',
    'course-node-web': 'node',
    'course-cloud-native': 'cloud',
    'course-devops-cicd': 'devops',
    'course-design-systems': 'design',
    'course-dsa-optim': 'dsa',
    'course-mobile-dev': 'mobile',
    'course-cybersecurity': 'cyber',
    'course-database-eng': 'sql',
    'course-distributed-sys': 'distributed',
    'course-ai-eng': 'ai',
    'course-fullstack-js': 'fullstack',
    'course-iot-embedded': 'iot_emb',
    'course-3d-graphics': 'g3d',
    'course-blockchain-web3': 'blockchain',
    'course-iot-network': 'iot_net',
    'course-iot-edge-ai': 'iot_edge',
    'course-iot-security': 'iot_sec',
    'course-python-backend': 'python',
    'course-quant-systems': 'quant',
    'course-digital-accounting': 'bcom_acc',
    'course-finance-investment': 'bcom_fin',
    'course-business-analytics': 'bcom_ana',
    'course-marketing-branding': 'bcom_mkt',
    'course-digital-marketing': 'bcom_dmkt',
    'course-ecommerce-digital-biz': 'bcom_ecom',
    'course-entrepreneurship-biz-mgmt': 'bcom_ent',
    'course-sales-crm-success': 'bcom_scrm',
    'course-operations-supplychain-compliance': 'bcom_ops',
    'course-ai-digital-transformation': 'bcom_ait',
    'course-computer-fundamentals': 'comp_fund',
    'course-ai-prompt-literacy': 'prompt_py',
    'course-excel-data-viz': 'excel_viz',
    'course-git-version-control': 'git_vcs',
    'course-softskills-communication': 'soft_skills',
    'course-nlp': 'nlp_py',
}

print(f"{'Idx':<3} | {'Course ID':<30} | {'Days':<6} | {'Visuals':<8} | {'Status':<14} | {'Target Days':<11} | {'Title'}")
print("=" * 115)

total_target = 37 * 60
total_implemented = 0
total_visuals_found = 0
courses_done = 0
courses_in_progress = 0

for item in summary_data:
    idx = item.get('num', 0)
    cid = item.get('id', '')
    title = item.get('title', '')
    fname = id_to_file.get(cid, '')
    fpath = os.path.join('src/lib/data', fname)
    
    # Days in TS
    day_count = 0
    if os.path.exists(fpath):
        with open(fpath, 'r', encoding='utf-8', errors='ignore') as fp:
            content = fp.read()
        days = re.findall(r'["\']?day["\']?\s*:\s*(\d+)', content)
        day_nums = sorted(list(set(int(d) for d in days if 1 <= int(d) <= 60)))
        day_count = len(day_nums)
        
    total_implemented += day_count
    
    # Visuals count
    prefix = prefix_map.get(cid, '')
    vdir = os.path.join('src/lib/data/lessonVisuals', prefix)
    vcount = 0
    if os.path.exists(vdir):
        vfiles = [f for f in os.listdir(vdir) if f.startswith('day-') and f.endswith('.json')]
        vcount = len(vfiles)
    total_visuals_found += vcount
    
    status = "COMPLETE" if day_count == 60 else f"REMAINING ({60 - day_count}d)"
    if day_count == 60:
        courses_done += 1
    else:
        courses_in_progress += 1
        
    print(f"{idx:>3} | {cid:<30} | {day_count:>4}/60 | {vcount:>5} files | {status:<14} | 60 days     | {title}")

print("=" * 115)
print(f"Total Bible Courses: 37 Courses")
print(f"Courses Fully Completed (60/60 Days): {courses_done} / 37 ({courses_done/37*100:.1f}%)")
print(f"Courses In Progress: {courses_in_progress} / 37")
print(f"Total Target Curriculum Days: {total_target} Days (37 x 60)")
print(f"Total Completed Days Across Entire Codebase: {total_implemented} Days ({total_implemented/total_target*100:.2f}%)")
print(f"Total Remaining Days Across Entire Codebase: {total_target - total_implemented} Days ({(total_target - total_implemented)/total_target*100:.2f}%)")
print(f"Total Visual JSON Envelopes on disk: {total_visuals_found}")
