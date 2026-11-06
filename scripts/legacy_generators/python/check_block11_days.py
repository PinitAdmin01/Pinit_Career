import sys, re
sys.stdout.reconfigure(encoding='utf-8')
with open('scripts/visuals/cloud-masterclass-spec.ts', 'r', encoding='utf-8') as f:
    text = f.read()

matches = re.findall(r'day:\s*(\d+).*?title:\s*"(.*?)"', text, re.DOTALL)
for d, title in matches:
    if 51 <= int(d) <= 55:
        print(f"Day {d}: {title}")
