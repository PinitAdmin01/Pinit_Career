# scripts/topup_day48_py.py
import sys
sys.path.insert(0, 'scripts')
from design_day48_data import DAY_48
import json

e1 = 'Additionally, the selection engine supports Full Row and Full Column Header Selection. Clicking a row number header highlights the entire horizontal row from column 0 to maxCols, while clicking a column letter header selects the entire vertical column from row 0 to maxRows. Holding Shift while clicking headers expands contiguous row or column multi-strip selections, mirroring native desktop spreadsheet capabilities.'

e2 = 'In addition, keyboard matrix navigation must support Right-to-Left (RTL) Writing Modes for international accounting software deployed in the Middle East. When document.dir is set to rtl, the horizontal arrow keys invert their physical traversal vectors: ArrowRight moves leftward toward preceding columns, while ArrowLeft advances forward. The navigation engine checks reading direction dynamically to maintain intuitive spatial orientation.'

e3 = 'Furthermore, inline cell editing coordinates with External Validation Webhooks for enterprise compliance checking. In corporate accounting journals, modifying a ledger entry may require synchronous verification against an external double-entry balancing rule before committing. The editor controller exposes an asynchronous commit pipeline that displays a transient validation spinner within the cell without blocking keyboard navigation.'

e4 = 'Moreover, clipboard paste operations must provide Sanitization Defenses against Formula Injection (CSV Injection / DDE attacks). If an untrusted external user copies a cell containing malicious formula syntax—such as =cmd|\'/C calc\'!\'!A0 or @SUM(1+1)—the paste engine detects the prohibited leading command characters and escapes them with a single quote prefix, protecting corporate workstations from malicious remote code execution.'

e5 = 'Finally, the spreadsheet accessibility engine must support High-Contrast Grid Focus Borders. Under WCAG 2.2 Success Criterion 1.4.11 (Non-text Contrast), active cell focus indicators must maintain at least a 3:1 contrast ratio against cell backgrounds and feature a two-pixel outline, ensuring that low-vision accountants can track active cells across high-density financial matrices without eye strain.'

DAY_48['parts'][0]['say'].append(e1)
DAY_48['parts'][1]['say'].append(e2)
DAY_48['parts'][2]['say'].append(e3)
DAY_48['parts'][3]['say'].append(e4)
DAY_48['parts'][4]['say'].append(e5)

with open('scripts/design_day48_data.py', 'w', encoding='utf-8') as f:
    f.write('# scripts/design_day48_data.py\nimport re\n\ndef count_words(say_list):\n    total = 0\n    for p in say_list:\n        total += len(re.findall(r\'\\b[A-Za-z0-9_\\-\\.\\$\\/\\:\\@\\\']+\\b\', p))\n    return total\n\n')
    f.write('DAY_48 = ' + json.dumps(DAY_48, indent=2) + '\n')

print('Topped up Day 48 successfully!')
