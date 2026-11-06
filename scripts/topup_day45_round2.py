# scripts/topup_day45_round2.py
import sys
sys.path.insert(0, 'scripts')
from design_day45_data import DAY_45
import json

e2 = 'Additionally, the buying power calculator accounts for Intraday Volatility Haircuts mandated by clearinghouse risk frameworks. For volatile single-stock equities undergoing earnings announcements or corporate restructuring, clearing brokers dynamically raise initial margin requirements from standard fifty percent Reg-T leverage to eighty or one hundred percent cash coverage. The circuit breaker engine dynamically integrates these intraday haircut feeds, recalculating allowable order sizes in real time without requiring form reloads.'

e3 = 'In complex institutional trade tickets, the asset class combobox also features Rapid Cross-Asset Instrument Switching. With a single keystroke, an arbitrage trader can toggle the underlying instrument view between cash equity shares, single-stock futures, options straddles, and currency forward contracts. The form automatically morphs its secondary input fields—introducing expiration strike chains for options or swap points for foreign exchange—while preserving parent order metadata.'

e4 = 'Furthermore, settlement coordinators must support Delivery vs Payment Fails Tracking and Penalties under the Central Securities Depositories Regulation (CSDR). If a counterparty risks failing settlement delivery, the coordinator alerts the trader to historical settlement reliability metrics for the executing broker, prompting them to select an alternative clearing agent or request guaranteed borrow coverage prior to order execution.'

e5 = 'Finally, the completed institutional form suite is instrumented with End-to-End Observability and Crash Recovery. If a trader experiences an unexpected browser tab crash or hardware reboot during an active market session, the local state engine restores pending unexecuted drafts from secure session storage upon relaunch, while ensuring that submitted orders are never duplicated, completely eliminating the risk of accidental double executions.'

DAY_45['parts'][1]['say'].append(e2)
DAY_45['parts'][2]['say'].append(e3)
DAY_45['parts'][3]['say'].append(e4)
DAY_45['parts'][4]['say'].append(e5)

with open('scripts/design_day45_data.py', 'w', encoding='utf-8') as f:
    f.write('# scripts/design_day45_data.py\nimport re\n\ndef count_words(say_list):\n    total = 0\n    for p in say_list:\n        total += len(re.findall(r\'\\b[A-Za-z0-9_\\-\\.\\$\\/\\:\\@\\\']+\\b\', p))\n    return total\n\n')
    f.write('DAY_45 = ' + json.dumps(DAY_45, indent=2) + '\n')

print('Topped up Day 45 round 2.')
