import sys, re, os, json
sys.stdout.reconfigure(encoding='utf-8')

# Check bcom_ait days
t = open('src/lib/data/bcomAitLongLessons.ts', 'r', encoding='utf-8').read()
qdays = sorted(set(int(x) for x in re.findall(r'"day":\s*(\d+)', t)))
print(f'bcom_ait days in TS: {len(qdays)} -> {qdays}')

# Check nlp days
t2 = open('src/lib/data/nlpPythonLongLessons.ts', 'r', encoding='utf-8').read()
ndays = sorted(set(int(x) for x in re.findall(r'"day":\s*(\d+)', t2)))
print(f'nlp days in TS: {len(ndays)} -> {ndays}')

# Check visual envelopes
ait_vis = os.listdir('src/lib/data/lessonVisuals/bcom_ait') if os.path.isdir('src/lib/data/lessonVisuals/bcom_ait') else []
nlp_vis = os.listdir('src/lib/data/lessonVisuals/nlp-py') if os.path.isdir('src/lib/data/lessonVisuals/nlp-py') else []
print(f'bcom_ait visual files: {len(ait_vis)} -> {sorted(ait_vis)}')
print(f'nlp-py visual files: {len(nlp_vis)} -> {sorted(nlp_vis)}')

# Check day51 builder output
if os.path.exists('scripts/data_bcom_ait_block11.json'):
    with open('scripts/data_bcom_ait_block11.json', 'r', encoding='utf-8') as f:
        b11 = json.load(f)
    print(f'bcom_ait Block 11 JSON has {len(b11)} days')
else:
    print('bcom_ait Block 11 JSON: NOT YET CREATED')

# Check individual day builder outputs
for d in range(51, 56):
    fname = f'scripts/day{d}_data.json'
    if os.path.exists(fname):
        print(f'  day{d}_data.json EXISTS')
    else:
        print(f'  day{d}_data.json MISSING')

# Check git log
import subprocess
r = subprocess.run(['git', 'log', '--oneline', '-10'], capture_output=True, text=True)
print(f'\nRecent git log:\n{r.stdout}')
