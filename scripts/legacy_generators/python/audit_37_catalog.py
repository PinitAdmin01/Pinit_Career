import os, re, glob, json

# 37 canonical courses from coursesCatalog.ts
catalog = [
    ("course-java-logic", "javaBasicsLongLessons.ts", "java-basics"),
    ("course-react-web", "reactLongLessons.ts", "react-basics"),
    ("course-node-web", "nodeWebLongLessons.ts", "node-web"),
    ("course-cloud-native", "cloudWebLongLessons.ts", "cloud"),
    ("course-devops-cicd", "devopsWebLongLessons.ts", "devops"),
    ("course-design-systems", "designWebLongLessons.ts", "design"),
    ("course-dsa-optim", "dsaWebLongLessons.ts", "dsa-optim"),
    ("course-mobile-dev", "mobileLongLessons.ts", "mobile"),
    ("course-cybersecurity", "cyberWebLongLessons.ts", "cyber"),
    ("course-database-eng", "sqlLongLessons.ts", "sql-mastery"),
    ("course-distributed-sys", "distributedWebLongLessons.ts", "dist"),
    ("course-ai-eng", "aiWebLongLessons.ts", "ai"),
    ("course-fullstack-js", "fullstackJsLongLessons.ts", "fullstack-js"),
    ("course-iot-embedded", "iotEmbLongLessons.ts", "iot_emb"),
    ("course-3d-graphics", "g3dLongLessons.ts", "g3d"),
    ("course-blockchain-web3", "blockchainLongLessons.ts", "blockchain"),
    ("course-iot-network", "iotNetLongLessons.ts", "iot_net"),
    ("course-iot-edge-ai", "iotEdgeLongLessons.ts", "iot_edge"),
    ("course-iot-security", "iotSecLongLessons.ts", "iot_sec"),
    ("course-python-backend", "pythonLongLessons.ts", "python"),
    ("course-quant-systems", "quantSystemsLongLessons.ts", "quant-systems"),
    ("course-digital-accounting", "bcomAccountingLongLessons.ts", "bcom-accounting"),
    ("course-finance-investment", "bcomFinanceLongLessons.ts", "bcom-finance"),
    ("course-business-analytics", "bcomAnaLongLessons.ts", "bcom_ana"),
    ("course-marketing-branding", "bcomMktLongLessons.ts", "bcom-marketing"),
    ("course-digital-marketing", "bcomDmktLongLessons.ts", "bcom_dmkt"),
    ("course-ecommerce-digital-biz", "bcomEcomLongLessons.ts", "bcom_ecom"),
    ("course-entrepreneurship-biz-mgmt", "bcomEntLongLessons.ts", "bcom_ent"),
    ("course-sales-crm-success", "bcomScrmLongLessons.ts", "bcom_scrm"),
    ("course-operations-supplychain-compliance", "bcomOpsLongLessons.ts", "bcom_ops"),
    ("course-ai-digital-transformation", "bcomAitLongLessons.ts", "bcom_ait"),
    ("course-computer-fundamentals", "compFundLongLessons.ts", "comp_fund"),
    ("course-ai-prompt-literacy", "promptPythonLongLessons.ts", "prompt-py"),
    ("course-excel-data-viz", "excelVizLongLessons.ts", "excel_viz"),
    ("course-git-version-control", "gitVcsLongLessons.ts", "git_vcs"),
    ("course-softskills-communication", "softSkillsLongLessons.ts", "soft-skills"),
    ("course-nlp", "nlpPythonLongLessons.ts", "nlp-py")
]

print(f"{'#':<3} | {'Course ID':<26} | {'LongLessons File':<28} | {'Text Days':<10} | {'Visual Days':<12} | {'Status'}")
print("-" * 105)

perfect_37 = 0

for i, (cid, ll_file, vis_dir) in enumerate(catalog, 1):
    # Check text days
    ll_path = os.path.join("src/lib/data", ll_file)
    text_days = []
    if os.path.exists(ll_path):
        with open(ll_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        text_days = sorted(list(set(int(x) for x in re.findall(r'(?:["\']day["\']|day)\s*:\s*(\d+)', content) if 1 <= int(x) <= 60)))
    
    # Check visual days
    vis_path = os.path.join("src/lib/data/lessonVisuals", vis_dir)
    vis_days = []
    if os.path.exists(vis_path):
        vfiles = glob.glob(os.path.join(vis_path, "*.json"))
        for vf in vfiles:
            m = re.search(r'day[-_]?(\d+)\.json', os.path.basename(vf))
            if m:
                d = int(m.group(1))
                if 1 <= d <= 60:
                    vis_days.append(d)
        vis_days = sorted(list(set(vis_days)))
    
    t_cnt = len(text_days)
    v_cnt = len(vis_days)
    
    if t_cnt == 60 and v_cnt == 60:
        perfect_37 += 1
        status = "100% COMPLETE"
    else:
        status = f"DEFICIT: Text={t_cnt}/60, Vis={v_cnt}/60"
        
    print(f"{i:2d} | {cid:<26} | {ll_file:<28} | {t_cnt:2d}/60 days | {v_cnt:2d}/60 files  | {status}")

print("=" * 105)
print(f"Total 37 Canonical Courses 100% Complete: {perfect_37} / 37")
