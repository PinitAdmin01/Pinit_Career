# scripts/check_exact_visual_folders.py
import os, json, re

with open('scripts/course-curriculum-summary.json', 'r', encoding='utf-8') as f:
    courses = json.load(f)

vdir = 'src/lib/data/lessonVisuals'
available_dirs = [d for d in os.listdir(vdir) if os.path.isdir(os.path.join(vdir, d))]

# Find best matching dir for each course
course_to_vdir = {}
for c in courses:
    cid = c['id']
    prefix = c.get('prefix', '')
    
    # Candidate matches
    candidates = []
    for d in available_dirs:
        # direct match with prefix or cid
        if d == prefix or d == prefix.replace('_', '-') or d == prefix.replace('-', '_'):
            candidates.append(d)
        elif d in cid or cid.endswith(d):
            candidates.append(d)
    
    # Manual overrides if needed
    mapping = {
        'course-java-logic': 'java-basics',
        'course-react-web': 'react-basics',
        'course-node-web': 'node-web',
        'course-cloud-native': 'cloud',
        'course-devops-cicd': 'devops',
        'course-design-systems': 'design',
        'course-dsa-optim': 'dsa-optim',
        'course-mobile-dev': 'mobile',
        'course-cybersecurity': 'cyber',
        'course-database-eng': 'sql-mastery',
        'course-distributed-sys': 'dist',
        'course-ai-eng': 'ai',
        'course-fullstack-js': 'fullstack-js',
        'course-iot-embedded': 'iot_emb',
        'course-3d-graphics': 'g3d',
        'course-blockchain-web3': 'blockchain',
        'course-iot-network': 'iot_net',
        'course-iot-edge-ai': 'iot_edge',
        'course-iot-security': 'iot_sec',
        'course-python-backend': 'python',
        'course-quant-systems': 'quant-systems',
        'course-digital-accounting': 'bcom-accounting',
        'course-finance-investment': 'bcom-finance',
        'course-business-analytics': 'bcom_ana',
        'course-marketing-branding': 'bcom-marketing',
        'course-digital-marketing': 'bcom_dmkt',
        'course-ecommerce-digital-biz': 'bcom_ecom',
        'course-entrepreneurship-biz-mgmt': 'bcom_ent',
        'course-sales-crm-success': 'bcom_scrm',
        'course-operations-supplychain-compliance': 'bcom_ops',
        'course-ai-digital-transformation': 'bcom_ait',
        'course-computer-fundamentals': 'comp_fund',
        'course-ai-prompt-literacy': 'prompt-py',
        'course-excel-data-viz': 'excel_viz',
        'course-git-version-control': 'git_vcs',
        'course-softskills-communication': 'soft-skills',
        'course-nlp': 'nlp-py',
    }
    course_to_vdir[cid] = mapping.get(cid, '')

print(f"{'Idx':<3} | {'Course ID':<30} | {'Visual Folder':<18} | {'Visuals':<10} | {'Status'}")
print("=" * 80)

total_visuals = 0
for c in courses:
    idx = c['num']
    cid = c['id']
    vf = course_to_vdir[cid]
    v_path = os.path.join(vdir, vf)
    if os.path.exists(v_path):
        count = len([f for f in os.listdir(v_path) if f.startswith('day-') and f.endswith('.json')])
    else:
        count = 0
    total_visuals += count
    status = "COMPLETE (60/60)" if count == 60 else f"PARTIAL ({count}/60)"
    print(f"{idx:>3} | {cid:<30} | {vf:<18} | {count:>4} files | {status}")

print("=" * 80)
print(f"Total Visual Files for 37 Courses: {total_visuals} / 2220 ({total_visuals/2220*100:.1f}%)")
