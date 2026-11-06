import glob, json, os, re

tracks = [
    ('bcom_mkt', 'B.Com Marketing', 'src/lib/data/bcomMktLongLessons.ts'),
    ('bcom_ban', 'B.Com Banking', 'src/lib/data/bcomBanLongLessons.ts'),
    ('bcom_ecom', 'B.Com E-Commerce', 'src/lib/data/bcomEcomLongLessons.ts'),
    ('bcom_dmkt', 'B.Com Digital Marketing', 'src/lib/data/bcomDmktLongLessons.ts'),
    ('bcom_law', 'B.Com Corporate Law', 'src/lib/data/bcomLawLongLessons.ts'),
    ('bcom_ops', 'B.Com Operations', 'src/lib/data/bcomOpsLongLessons.ts'),
    ('bcom_ait', 'B.Com AI & Tech', 'src/lib/data/bcomAitLongLessons.ts'),
    ('bcom_scrm', 'B.Com Sales & CRM', 'src/lib/data/bcomScrmLongLessons.ts'),
    ('bcom_ent', 'B.Com Entrepreneurship', 'src/lib/data/bcomEntLongLessons.ts'),
    ('bcom_tax', 'B.Com Taxation', 'src/lib/data/bcomTaxLongLessons.ts'),
    ('bcom_aud', 'B.Com Auditing', 'src/lib/data/bcomAudLongLessons.ts'),
    ('bcom_finance', 'B.Com Finance', 'src/lib/data/bcomFinanceLongLessons.ts'),
    ('bcom_accounting', 'B.Com Accounting', 'src/lib/data/bcomAccountingLongLessons.ts'),
    ('bcom_ana', 'B.Com Business Analytics', 'src/lib/data/bcomAnaLongLessons.ts'),
    ('iot_emb', 'IoT Embedded Systems', 'src/lib/data/iotEmbLongLessons.ts'),
    ('iot_edge', 'IoT Edge AI', 'src/lib/data/iotEdgeLongLessons.ts'),
    ('iot_sec', 'IoT Security', 'src/lib/data/iotSecLongLessons.ts'),
    ('iot_net', 'IoT Networking', 'src/lib/data/iotNetLongLessons.ts'),
]

print("Prefix          | Name                      | Days | Max Day | Visuals")
print("-" * 65)
for prefix, name, path in tracks:
    visual_dir = f'src/lib/data/lessonVisuals/{prefix}'
    visual_count = len(glob.glob(f'{visual_dir}/*.json')) if os.path.exists(visual_dir) else 0
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    days = re.findall(r'[\"\']?day[\"\']?:\s*(\d+)', content)
    unique_days = sorted(list(set(int(d) for d in days)))
    max_d = max(unique_days) if unique_days else 0
    print(f"{prefix:15} | {name:25} | {len(unique_days):4} | {max_d:7} | {visual_count:7}")
