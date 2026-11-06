import sys
sys.stdout.reconfigure(encoding='utf-8')
with open('scripts/generate_block9_visuals.py', 'r', encoding='utf-8') as f:
    text = f.read()

lines = text.splitlines()
print(f"Total lines: {len(lines)}")
for l in lines[-45:]:
    print(l)
