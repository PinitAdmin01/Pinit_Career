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

targets = ['production invariant', 'telemetry invariant', 'distributed invariant']

for fpath in files_to_check:
    if not os.path.exists(fpath):
        continue
    matches = []
    with open(fpath, 'r', encoding='utf-8') as f:
        for line_no, line in enumerate(f, 1):
            line_l = line.lower()
            for t in targets:
                if t in line_l:
                    matches.append((line_no, t, line.strip()))
                    break
    if matches:
        print(f"\n=== {os.path.basename(fpath)} ({len(matches)} matches) ===")
        for lno, t, l in matches[:3]:
            print(f"  Line {lno} [{t}]: {l[:120]}")
