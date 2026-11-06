import sys
import re

sys.stdout.reconfigure(encoding="utf-8")

with open("scripts/excel_month2_batch5_bible.txt", "r", encoding="utf-8") as f:
    text = f.read()

blocks = text.split("="*80)
day_indices = [2, 4, 6, 8, 10]
days = [51, 52, 53, 54, 55]

for day_num, idx in zip(days, day_indices):
    block = blocks[idx]
    title_m = re.search(r'<strong[^>]*color: #065f46;\"[^>]*>(.*?)</strong>', block)
    title = title_m.group(1) if title_m else "Unknown"
    
    goal_m = re.search(r'Goal:</span>(.*?)(?=<br|<div)', block, re.DOTALL)
    inv_m = re.search(r'Invariant:</span>(.*?)(?=<br|<div|</div>)', block, re.DOTALL)
    fail_m = re.search(r'Failure:</strong>(.*?)(?=<br)', block, re.DOTALL)
    tryit_m = re.search(r'tryIt Friction:</strong>(.*?)(?=</div>)', block, re.DOTALL)
    puzzle_m = re.search(r'<p style=\"margin: 2px 0; color: #1e293b;\">(.*?)</p>', block, re.DOTALL)
    opt_b_m = re.search(r'<strong>B:</strong>(.*?)</div>', block, re.DOTALL)
    
    print(f"\n{'='*70}\nDAY {day_num}: {title}\n{'='*70}")
    if goal_m:
        print("GOAL:", re.sub(r'<[^>]+>', '', goal_m.group(1)).strip())
    if inv_m:
        print("INVARIANT:", re.sub(r'<[^>]+>', '', inv_m.group(1)).strip())
    if fail_m:
        print("FAILURE MODE:", re.sub(r'<[^>]+>', '', fail_m.group(1)).strip())
    if tryit_m:
        print("TRYIT FRICTION:", re.sub(r'<[^>]+>', '', tryit_m.group(1)).strip())
    if puzzle_m:
        print("PUZZLE:", re.sub(r'<[^>]+>', '', puzzle_m.group(1)).strip())
    if opt_b_m:
        print("CORRECT ANSWER:", re.sub(r'<[^>]+>', '', opt_b_m.group(1)).strip())
