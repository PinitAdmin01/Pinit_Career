import sys, re
sys.stdout.reconfigure(encoding='utf-8')
with open('scripts/visuals/cloud-masterclass-spec.ts', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'day:\s*52,.*?(?=\n\s*day:\s*53|\Z)', text, re.DOTALL)
if m:
    print(m.group(0))
