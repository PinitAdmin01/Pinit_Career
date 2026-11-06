import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

content = open('src/lib/data/cloudWebLongLessons.ts', encoding='utf-8').read()
days = [int(m) for m in re.findall(r'"day":\s*(\d+)', content)]

print(f"Total days found in cloudWebLongLessons.ts: {len(days)}")
print(f"Days list: {sorted(days)}")
assert len(days) == 60, f"Expected 60 days, found {len(days)}"
assert sorted(days) == list(range(1, 61)), "Missing days!"
print("🎉 VERIFICATION 100% COMPLETE: All 60 Days (1 to 60) exist in cloudWebLongLessons.ts!")
