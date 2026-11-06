with open('scripts/design_day37_data.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

lines[95] = 'console.log(`Did Tooltip (z: 999999) lose to Nav Header (z: 10)? ${isTrapped ? \'YES - TRAPPED IN LOCAL CONTEXT\' : \'NO\'}`);""",\n            "output": """=== CSS STACKING CONTEXT CONFLICT RESOLUTION ===\n'

with open('scripts/design_day37_data.py', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("Fixed line 96 in Day 37!")
