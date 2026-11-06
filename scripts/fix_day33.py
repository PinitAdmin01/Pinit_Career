# scripts/fix_day33.py
from pathlib import Path

path = Path('scripts/data_scrm_day33.py')
text = path.read_text(encoding='utf-8')

text = text.replace(
    'print("\\n--> INBOUND EVENT: Prospect sends reply email:',
    'print("")\nprint("--> INBOUND EVENT: Prospect sends reply email:'
)
text = text.replace(
    'print(f"\\nDelivery Attempt 2 (Network Retry):',
    'print("")\nprint(f"Delivery Attempt 2 (Network Retry):'
)
text = text.replace(
    'print(f"\\nDelivery Attempt 3 (Network Retry):',
    'print("")\nprint(f"Delivery Attempt 3 (Network Retry):'
)
text = text.replace(
    'print(f"\\nMalicious Attack Attempt:',
    'print("")\nprint(f"Malicious Attack Attempt:'
)
text = text.replace(
    'print(f"\\n--> INCOMING COMMUNICATION RECEIVED',
    'print("")\nprint(f"--> INCOMING COMMUNICATION RECEIVED'
)

path.write_text(text, encoding='utf-8')
print("Fixed print newlines in Day 33!")
