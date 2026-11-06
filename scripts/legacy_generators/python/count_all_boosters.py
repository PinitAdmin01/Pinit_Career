import glob
import re
import os

files = sorted(glob.glob('src/lib/data/*LongLessons.ts'))

patterns = {
    'production invariant': re.compile(r'production invariant', re.IGNORECASE),
    'telemetry invariant': re.compile(r'telemetry invariant', re.IGNORECASE),
    'distributed invariant': re.compile(r'distributed invariant', re.IGNORECASE),
    'heterogeneous distributed invariant': re.compile(r'heterogeneous distributed invariant', re.IGNORECASE),
    'canonical operational envelope': re.compile(r'canonical operational envelope', re.IGNORECASE),
    'uber scale / peak scale': re.compile(r'uber at peak scale|stripe/uber', re.IGNORECASE),
    'hyper-scale telemetry': re.compile(r'hyper-scale telemetry', re.IGNORECASE),
    'mechanical symmetry': re.compile(r'mechanical symmetry', re.IGNORECASE)
}

pattern_totals = {k: 0 for k in patterns}
file_summary = {}

for f in files:
    fname = os.path.basename(f)
    with open(f, 'r', encoding='utf-8') as fp:
        c = fp.read()
    
    file_hits = {}
    for name, pat in patterns.items():
        hits = len(pat.findall(c))
        if hits > 0:
            pattern_totals[name] += hits
            file_hits[name] = hits
            
    if file_hits:
        file_summary[fname] = file_hits

print("=== PATTERN TOTALS ===")
for name, total in sorted(pattern_totals.items(), key=lambda x: -x[1]):
    print(f"{name}: {total}")

print("\n=== TOP AFFECTED FILES ===")
for fname, hits in sorted(file_summary.items(), key=lambda x: -sum(x[1].values())):
    print(f"{fname}: {sum(hits.values())} hits -> {hits}")
