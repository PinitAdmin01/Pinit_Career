import os
import re

files = [
    ("bcom_acc", "src/lib/data/bcomAccountingLongLessons.ts"),
    ("bcom_fin", "src/lib/data/bcomFinanceLongLessons.ts"),
    ("bcom_scrm", "src/lib/data/bcomScrmLongLessons.ts"),
    ("bcom_tax", "src/lib/data/bcomTaxLongLessons.ts"),
    ("bcom_aud", "src/lib/data/bcomAudLongLessons.ts"),
    ("bcom_law", "src/lib/data/bcomLawLongLessons.ts"),
    ("bcom_ait", "src/lib/data/bcomAitLongLessons.ts"),
    ("bcom_ana", "src/lib/data/bcomAnaLongLessons.ts"),
    ("bcom_ban", "src/lib/data/bcomBanLongLessons.ts"),
    ("bcom_dmkt", "src/lib/data/bcomDmktLongLessons.ts"),
    ("bcom_ecom", "src/lib/data/bcomEcomLongLessons.ts"),
    ("bcom_ent", "src/lib/data/bcomEntLongLessons.ts"),
    ("bcom_mkt", "src/lib/data/bcomMktLongLessons.ts"),
    ("bcom_ops", "src/lib/data/bcomOpsLongLessons.ts"),
]

print("=== B.COM LONG LESSONS AUDIT ===")
for prefix, path in files:
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()
            day_matches = re.findall(r'"day":\s*(\d+)', content)
            if not day_matches:
                day_matches = re.findall(r'day:\s*(\d+)', content)
            days = sorted(list(set(int(d) for d in day_matches)))
            print(f"{prefix:10s} -> Registered Days: {len(days)} / 30 ({days[:3]}..{days[-3:] if len(days) >= 3 else days})")
    else:
        print(f"{prefix:10s} -> FILE NOT FOUND ({path})")
