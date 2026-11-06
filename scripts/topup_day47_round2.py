# scripts/topup_day47_round2.py
import sys
sys.path.insert(0, 'scripts')
from design_day47_data import DAY_47
import json

e2 = 'Furthermore, query syntax error boundaries prevent malformed user input from crashing the grid. If an operator types an unclosed parenthesis or invalid operator, the filter pipeline falls back gracefully to a basic substring search while rendering an inline warning badge.'

e3 = 'In addition, the treegrid state machine preserves expansion states across external data refreshes. When a new batch of trades arrives via WebSocket, the engine reconciles row identities against existing group keys, ensuring that branches currently open by user intent remain open without collapsing.'

e4 = 'Additionally, pivot column sorting allows operators to sort the dynamic generated columns themselves. An analyst can sort product columns by total sales descending, immediately moving the most lucrative product columns to the left side of the pivot grid.'

e5 = 'Moreover, accessible live regions must announce the total count of expanded child rows when a branch is opened. Vocalizing: \"North America expanded, 42 items visible\" gives screen reader users immediate spatial certainty.'

DAY_47['parts'][1]['say'].append(e2)
DAY_47['parts'][2]['say'].append(e3)
DAY_47['parts'][3]['say'].append(e4)
DAY_47['parts'][4]['say'].append(e5)

with open('scripts/design_day47_data.py', 'w', encoding='utf-8') as f:
    f.write('# scripts/design_day47_data.py\nimport re\n\ndef count_words(say_list):\n    total = 0\n    for p in say_list:\n        total += len(re.findall(r\'\\b[A-Za-z0-9_\\-\\.\\$\\/\\:\\@\\\']+\\b\', p))\n    return total\n\n')
    f.write('DAY_47 = ' + json.dumps(DAY_47, indent=2) + '\n')

print('Topped up Day 47 round 2 successfully!')
