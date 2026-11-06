import sys
import re

sys.stdout.reconfigure(encoding='utf-8')
with open('scripts/excel_month2_batch5_bible.txt', 'r', encoding='utf-8') as f:
    text = f.read()

days = text.split('='*80)
for block in days:
    if 'BIBLE CARD' in block:
        day_m = re.search(r'Day\s*(\d+)</span>', block)
        title_m = re.search(r'<strong[^>]*color: #065f46;\"[^>]*>(.*?)</strong>', block)
        goal_m = re.search(r'Goal:</span>(.*?)(?=<br|<div)', block, re.DOTALL)
        inv_m = re.search(r'Invariant:</span>(.*?)(?=<br|<div|</div>)', block, re.DOTALL)
        fail_m = re.search(r'Failure:</strong>(.*?)(?=<br)', block, re.DOTALL)
        
        d_num = day_m.group(1) if day_m else '?'
        t_str = title_m.group(1) if title_m else '?'
        print(f"\n--- DAY {d_num}: {t_str} ---")
        if goal_m:
            print("  GOAL:", re.sub(r'<[^>]+>', '', goal_m.group(1)).strip()[:140] + "...")
        if inv_m:
            print("  INVARIANT:", re.sub(r'<[^>]+>', '', inv_m.group(1)).strip()[:140] + "...")
        if fail_m:
            print("  FAILURE:", re.sub(r'<[^>]+>', '', fail_m.group(1)).strip()[:140] + "...")
