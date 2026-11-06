# scripts/topup_day48_round2.py
import sys
sys.path.insert(0, 'scripts')
from design_day48_data import DAY_48
import json

e2 = 'Furthermore, keyboard matrix navigation coordinates with Screen Magnifiers and Zoom Tools. When a visually impaired user zooms their browser viewport to 400 percent, navigating across cells must smoothly pan the zoomed viewport so that the active cell and its row/column coordinate markers remain fully visible within the magnified viewing area.'

e3 = 'Moreover, inline cell editors must handle Mobile Soft Keyboards and Virtual Input Accessories on touch devices like iPad Pro. Tapping into an editable cell must automatically raise the software keyboard with an auxiliary accessory bar displaying Tab, Enter, and Escape shortcuts, allowing mobile power users to navigate and commit tabular edits with tactile speed.'

e4 = 'Additionally, clipboard copy operations should support Formatted Markdown Table Payloads. When an analyst copies a range and pastes into GitHub, Slack, or Notion, providing a text/markdown clipboard stream formats the selection into a clean Markdown table with column alignment colons, ensuring seamless cross-application sharing.'

e5 = 'In addition, screen reader auditory feedback must provide immediate confirmation during Cell Clear and Cut Operations. Pressing Delete or Backspace on a selected multi-cell range clears all interior cell values, while an assertive live region announces: \"Values cleared across 12 cells in range B2 to D5\". This guarantees complete auditory transparency.'

DAY_48['parts'][1]['say'].append(e2)
DAY_48['parts'][2]['say'].append(e3)
DAY_48['parts'][3]['say'].append(e4)
DAY_48['parts'][4]['say'].append(e5)

with open('scripts/design_day48_data.py', 'w', encoding='utf-8') as f:
    f.write('# scripts/design_day48_data.py\nimport re\n\ndef count_words(say_list):\n    total = 0\n    for p in say_list:\n        total += len(re.findall(r\'\\b[A-Za-z0-9_\\-\\.\\$\\/\\:\\@\\\']+\\b\', p))\n    return total\n\n')
    f.write('DAY_48 = ' + json.dumps(DAY_48, indent=2) + '\n')

print('Topped up Day 48 round 2 successfully!')
