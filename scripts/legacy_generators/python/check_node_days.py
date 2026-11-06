with open('src/lib/data/nodeWebLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r'"day":\s*(\d+)', text)
unquoted = re.findall(r'\bday:\s*(\d+)', text)
all_days = [int(x) for x in matches + unquoted]
print(f'Total days in nodeWebLongLessons.ts: {len(all_days)}')
if all_days:
    print(f'Min day: {min(all_days)}, Max day: {max(all_days)}')
    print('Last 5 days:', sorted(all_days)[-5:])
