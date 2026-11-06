import sys
sys.path.insert(0, r'c:\Users\Admin\Desktop\projects\Present-Career-os\scripts\puzzles')
sys.path.insert(0, r'c:\Users\Admin\Desktop\projects\Present-Career-os\scripts\puzzles\python_course')
from days_01_15 import PUZZLES
from puzzle_validator import validate_all

failed, report, results = validate_all(PUZZLES, range(1, 16))
for line in report:
    print(line)
print(f"\n{'='*60}")
print(f"TOTAL: {len(PUZZLES)} puzzles, {failed} FAILED")
