import sys, re
sys.stdout.reconfigure(encoding='utf-8')

for fname in ['iotEmbedded30DayData.ts', 'iotEmbLongLessons.ts', 'react30DayData.ts', 'reactLongLessons.ts']:
    path = f'src/lib/data/{fname}'
    with open(path, 'r', encoding='utf-8') as f:
        text = f.read()
    days = re.findall(r'day:\s*(\d+)', text)
    if not days:
        days = re.findall(r'title:\s*["\']', text)
        print(f'{fname}: {len(days)} titles')
    else:
        dset = sorted(list(set(int(d) for d in days)))
        print(f'{fname}: {len(dset)} distinct days (min {min(dset)}, max {max(dset)})')
