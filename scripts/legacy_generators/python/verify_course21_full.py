import sys
import os
import glob
import re

sys.stdout.reconfigure(encoding='utf-8')

ts_path = os.path.join('src', 'lib', 'data', 'excelVizLongLessons.ts')
with open(ts_path, 'r', encoding='utf-8') as f:
    text = f.read()

days = sorted([int(m.group(1)) for m in re.finditer(r'(?:"day"|\bday):\s*(\d+)', text)])
print(f"Detected Days in excelVizLongLessons.ts: count={len(days)}, min={min(days)}, max={max(days)}")
assert len(days) == 60, f"Expected 60 days, got {len(days)}"
assert days == list(range(1, 61)), "Days are not 1..60 sequence!"

visual_files = sorted(glob.glob(os.path.join('src', 'lib', 'data', 'lessonVisuals', 'excel_viz', 'day-*.json')))
print(f"Visual JSON files in lessonVisuals/excel_viz: count={len(visual_files)}")
assert len(visual_files) == 60, f"Expected 60 visual JSON files, got {len(visual_files)}"

print("ALL 60 DAYS OF EXCEL_VIZ CONFIRMED PERSISTENT ON DISK!")
