import os
import re

files = [
    ('bcom_mkt', 'src/lib/data/bcomMktLongLessons.ts', 'B.Com Marketing & Brand Management'),
    ('bcom_ban', 'src/lib/data/bcomBanLongLessons.ts', 'B.Com Commercial Banking & ALM'),
    ('bcom_ecom', 'src/lib/data/bcomEcomLongLessons.ts', 'B.Com E-Commerce & DTC Operations'),
    ('bcom_dmkt', 'src/lib/data/bcomDmktLongLessons.ts', 'B.Com Digital Marketing & Growth'),
    ('bcom_law', 'src/lib/data/bcomLawLongLessons.ts', 'B.Com Corporate & Commercial Law'),
    ('bcom_ops', 'src/lib/data/bcomOpsLongLessons.ts', 'B.Com Operations & Supply Chain'),
    ('bcom_ait', 'src/lib/data/bcomAitLongLessons.ts', 'B.Com AI in Business & Enterprise Tech'),
    ('bcom_scrm', 'src/lib/data/bcomScrmLongLessons.ts', 'B.Com Sales, CRM & Revenue Ops'),
    ('bcom_ent', 'src/lib/data/bcomEntLongLessons.ts', 'B.Com Entrepreneurship & Venture Capital'),
    ('bcom_tax', 'src/lib/data/bcomTaxLongLessons.ts', 'B.Com Corporate Taxation & International Tax'),
    ('bcom_aud', 'src/lib/data/bcomAudLongLessons.ts', 'B.Com Auditing & Forensic Accounting'),
    ('bcom_finance', 'src/lib/data/bcomFinanceLongLessons.ts', 'B.Com Corporate Finance & Investment Banking'),
    ('bcom_accounting', 'src/lib/data/bcomAccountingLongLessons.ts', 'B.Com Financial Accounting & Reporting'),
    ('bcom_ana', 'src/lib/data/bcomAnaLongLessons.ts', 'B.Com Business Analytics & Quantitative Methods'),
    ('iot_net', 'src/lib/data/iotNetLongLessons.ts', 'IoT Wireless Networking & Protocols'),
    ('iot_edge', 'src/lib/data/iotEdgeLongLessons.ts', 'IoT Edge AI & TinyML'),
    ('iot_sec', 'src/lib/data/iotSecLongLessons.ts', 'IoT Hardware Security & Cryptography'),
    ('iot_emb', 'src/lib/data/iotEmbLongLessons.ts', 'IoT Embedded Systems & Firmware'),
]

print("=" * 95)
print(f"{'Code':<16} | {'Track Name':<42} | {'Days':<10} | {'Status'}")
print("=" * 95)

total_completed_days = 0
total_target_tier1_days = len(files) * 30 # 18 * 30 = 540 days

for prefix, path, name in files:
    if os.path.exists(path):
        content = open(path, encoding='utf-8').read()
        # Find all day values matching top-level day property (quoted or unquoted)
        days = sorted(list(set(map(int, re.findall(r'^\s*[\"\']?day[\"\']?\s*:\s*(\d+)\s*,', content, re.MULTILINE)))))
        count = len(days)
        total_completed_days += count
        status = "100% COMPLETE (30/30)" if count >= 30 else f"{count}/30 Days ({round(count/30*100, 1)}%)"
        print(f"{prefix:<16} | {name:<42} | {count:<10} | {status}")
    else:
        print(f"{prefix:<16} | {name:<42} | {0:<10} | MISSING FILE")

print("=" * 95)
tier1_pct_complete = (total_completed_days / total_target_tier1_days) * 100
tier1_pct_remaining = 100.0 - tier1_pct_complete

# In SOP, initial uncompleted days before Branch B started was 450 days (Days 6-30 for all 18 tracks, since Days 1-5 = 90 days existed)
initial_uncompleted_branch_b = 450 # 18 tracks * 25 days (Days 6-30)
days_added_by_branch_b = total_completed_days - (18 * 5) # Days added beyond Day 5
branch_b_expansion_pct_complete = (days_added_by_branch_b / initial_uncompleted_branch_b) * 100
branch_b_expansion_pct_remaining = 100.0 - branch_b_expansion_pct_complete

print(f"TIER 1 (30-DAY FOUNDATION MASTERCLASS TARGET):")
print(f" - Total Track Modules Assigned to Branch B: {len(files)} Tracks (14 B.Com + 4 IoT)")
print(f" - Total Days in Scope: {total_target_tier1_days} Days")
print(f" - Total Completed Days: {total_completed_days} Days")
print(f" - Total Remaining Days to Day 30: {total_target_tier1_days - total_completed_days} Days")
print(f" - Completion Rate: {tier1_pct_complete:.2f}%")
print(f" - Remaining Work: {tier1_pct_remaining:.2f}%\n")

print(f"BRANCH B WORKLOAD EXPANSION TARGET (Days 6-30 Expansion from SOP):")
print(f" - Assigned SOP Expansion Work: {initial_uncompleted_branch_b} Days (Days 6-30 across 18 tracks)")
print(f" - Days Expanded & Verified to Date: {days_added_by_branch_b} Days")
print(f" - Remaining Days to Expand: {initial_uncompleted_branch_b - days_added_by_branch_b} Days")
print(f" - Branch B Expansion Completion Rate: {branch_b_expansion_pct_complete:.2f}%")
print(f" - Branch B Expansion Remaining Work: {branch_b_expansion_pct_remaining:.2f}%\n")

# Check visual specs on disk
visual_base = "src/lib/data/lessonVisuals"
total_visuals = 0
for prefix, _, _ in files:
    v_dir = os.path.join(visual_base, prefix.replace("_", "-") if not os.path.exists(os.path.join(visual_base, prefix)) else prefix)
    if not os.path.exists(v_dir):
        # try both hyphen and underscore
        alt_v_dir = os.path.join(visual_base, prefix)
        if os.path.exists(alt_v_dir):
            v_dir = alt_v_dir
    if os.path.exists(v_dir):
        jsons = [f for f in os.listdir(v_dir) if f.startswith("day-") and f.endswith(".json")]
        total_visuals += len(jsons)

print(f"GATE v2 VISUAL ASSETS ON DISK FOR BRANCH B:")
print(f" - Generated On-Disk Visual Day Files: {total_visuals} / {total_target_tier1_days} ({round(total_visuals / total_target_tier1_days * 100, 2)}%)")
print(f" - Remaining Visual Day Files: {total_target_tier1_days - total_visuals} ({round((total_target_tier1_days - total_visuals) / total_target_tier1_days * 100, 2)}%)")
print("=" * 95)
