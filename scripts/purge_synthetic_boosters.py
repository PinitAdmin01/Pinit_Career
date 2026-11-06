import os
import re

files_to_clean = [
    'src/lib/data/compFundLongLessons.ts',
    'src/lib/data/softSkillsLongLessons.ts',
    'src/lib/data/gitVcsLongLessons.ts',
    'src/lib/data/fullstackJsLongLessons.ts',
    'src/lib/data/iotEdgeLongLessons.ts',
    'src/lib/data/iotNetLongLessons.ts',
    'src/lib/data/bcomDmktLongLessons.ts',
    'src/lib/data/bcomOpsLongLessons.ts'
]

for filepath in files_to_clean:
    if not os.path.exists(filepath):
        continue
    with open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()

    original_len = len(text)
    
    # 1. Clean ' and verified its core production invariant (...)'
    cleaned_text = re.sub(r'\s+and verified its core production invariant\s*\(.*?\)', '.', text, flags=re.DOTALL)
    
    # 2. Clean ' and verified its core telemetry invariant (...)'
    cleaned_text = re.sub(r'\s+and verified its core telemetry invariant\s*\(.*?\)', '.', text, flags=re.DOTALL)
    
    # 3. Clean ' and verified its core distributed invariant (...)'
    cleaned_text = re.sub(r'\s+and verified its core distributed invariant\s*\(.*?\)', '.', text, flags=re.DOTALL)
    
    # 4. Clean stray double periods '..' -> '.'
    cleaned_text = re.sub(r'\.\.+', '.', cleaned_text)
    
    diff = original_len - len(cleaned_text)
    if diff > 0:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(cleaned_text)
        print(f"[PURGED] {os.path.basename(filepath)}: Removed {diff} bytes of synthetic booster filler!")
