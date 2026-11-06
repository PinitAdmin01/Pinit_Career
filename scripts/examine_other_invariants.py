import re
import os

files_to_check = [
    'src/lib/data/devopsWebLongLessons.ts',
    'src/lib/data/gitVcsLongLessons.ts',
    'src/lib/data/fullstackJsLongLessons.ts',
    'src/lib/data/iotEdgeLongLessons.ts',
    'src/lib/data/mobileLongLessons.ts',
    'src/lib/data/bcomDmktLongLessons.ts',
    'src/lib/data/bcomOpsLongLessons.ts',
    'src/lib/data/distributedWebLongLessons.ts',
    'src/lib/data/g3dLongLessons.ts',
    'src/lib/data/iotNetLongLessons.ts',
    'src/lib/data/nlpPythonLongLessons.ts',
    'src/lib/data/pythonLongLessons.ts'
]

pattern = re.compile(r'([^.\n]*?(?:production|telemetry|distributed)\s+invariant[^.\n]*?\.)', re.IGNORECASE)

for fpath in files_to_check:
    if not os.path.exists(fpath):
        continue
    with open(fpath, 'r', encoding='utf-8') as f:
        text = f.read()
    matches = pattern.findall(text)
    print(f"\n=== {os.path.basename(fpath)} ({len(matches)} matches) ===")
    for m in matches[:3]:
        print("  *", m.strip()[:140])
