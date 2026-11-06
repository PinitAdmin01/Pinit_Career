import json, re

for path in ['scripts/branch_c/build_day59.py', 'scripts/branch_c/build_day60.py']:
    with open(path, 'r', encoding='utf-8') as f:
        text = f.read()
    
    # Remove keyTakeaways block
    text = re.sub(r'\s*"keyTakeaways":\s*\[[\s\S]*?\],\n', '\n', text)
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(text)
    print(f"Removed keyTakeaways from {path}")
