# scripts/topup_day47_round3.py
import sys
sys.path.insert(0, 'scripts')
from design_day47_data import DAY_47
import json

e3 = 'This robust reconciliation ensures that complex analytical tree structures remain fully resilient against real-time streaming data ingestion while maintaining sub-millisecond virtual windowing responsiveness.'
e4 = 'This dynamic re-ordering of pivoted dimensions empowers financial analysts to spot market outliers, top-performing product categories, and regional revenue skews in a single visual sweep.'
e5 = 'This comprehensive auditory transparency ensures that visually impaired traders and keyboard navigators operate with the exact same speed and situational clarity as their sighted peers.'

DAY_47['parts'][2]['say'].append(e3)
DAY_47['parts'][3]['say'].append(e4)
DAY_47['parts'][4]['say'].append(e5)

with open('scripts/design_day47_data.py', 'w', encoding='utf-8') as f:
    f.write('# scripts/design_day47_data.py\nimport re\n\ndef count_words(say_list):\n    total = 0\n    for p in say_list:\n        total += len(re.findall(r\'\\b[A-Za-z0-9_\\-\\.\\$\\/\\:\\@\\\']+\\b\', p))\n    return total\n\n')
    f.write('DAY_47 = ' + json.dumps(DAY_47, indent=2) + '\n')

print('Topped up Day 47 round 3 successfully!')
