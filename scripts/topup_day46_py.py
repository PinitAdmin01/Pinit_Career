# scripts/topup_day46_py.py
import sys
sys.path.insert(0, 'scripts')
from design_day46_data import DAY_46
import json

e2 = 'In addition, high-frequency two-dimensional grids must handle Variable Row Heights gracefully. While financial tables prefer fixed compact row heights (such as 28 or 32 pixels), document and asset management grids often display expandable rows containing multi-line text descriptions. The virtual engine integrates a dynamic row height measurement index, updating vertical prefix sums dynamically without triggering full-table layout reflows.'
e3 = 'Moreover, column resizing handles must provide accessible keyboard equivalents under WCAG 2.2 Level AA. When a keyboard user focuses a column header, pressing Shift+ArrowRight or Shift+ArrowLeft must expand or contract the column width in ten-pixel increments, accompanied by an assertive live-region speech announcement vocalizing: Column Symbol width 140 pixels.'
e4 = 'Furthermore, transform-proof pinning architectures must coordinate with Mobile Touch Scrolling. On touch devices, native momentum scrolling can cause visual tearing between sticky planes if scroll synchronization lags. By binding to native scroll events on the parent viewport and utilizing CSS will-change: transform hints, the grid achieves hardware-composited sticky alignment without visual jitter.'
e5 = 'Finally, the accessible grid descriptor engine must emit clear announcements for Dynamic Row State Changes. When an incoming real-time market tick updates a price cell or triggers a row flash animation, assistive technologies should not be spammed with hundreds of speech updates. Status changes are buffered and emitted through polite live regions only when significant thresholds are crossed.'

DAY_46['parts'][1]['say'].append(e2)
DAY_46['parts'][2]['say'].append(e3)
DAY_46['parts'][3]['say'].append(e4)
DAY_46['parts'][4]['say'].append(e5)

with open('scripts/design_day46_data.py', 'w', encoding='utf-8') as f:
    f.write('# scripts/design_day46_data.py\nimport re\n\ndef count_words(say_list):\n    total = 0\n    for p in say_list:\n        total += len(re.findall(r\'\\b[A-Za-z0-9_\\-\\.\\$\\/\\:\\@\\\']+\\b\', p))\n    return total\n\n')
    f.write('DAY_46 = ' + json.dumps(DAY_46, indent=2) + '\n')

print('Topped up Day 46 Parts 2-5 successfully!')
