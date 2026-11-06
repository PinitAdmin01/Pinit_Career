import re

with open('src/lib/data/bcomAccountingLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

days_unquoted = [int(x) for x in re.findall(r'\bday:\s*(\d+)', text)]
days_quoted = [int(x) for x in re.findall(r'\"day\":\s*(\d+)', text)]
all_days = sorted(list(set(days_unquoted + days_quoted)))

print(f"Unquoted days ({len(days_unquoted)}): {days_unquoted[:5]}...{days_unquoted[-5:] if days_unquoted else []}")
print(f"Quoted days ({len(days_quoted)}): {days_quoted}")
print(f"All unique days count: {len(all_days)}, range: {min(all_days)} to {max(all_days)}")
assert len(all_days) == 40
assert all_days == list(range(1, 41))
print("ALL 40 DAYS ARE PRESENT AND SEQUENTIAL!")
