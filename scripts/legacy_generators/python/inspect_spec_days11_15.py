import re

with open('scripts/visuals/business_analytics_spec_m1.py', 'r', encoding='utf-8') as f:
    text = f.read()

pattern = re.compile(r'\{\s*"day":\s*(1[1-5]),[\s\S]*?"title":\s*"([^"]+)"[\s\S]*?"spokenGoal":\s*"([^"]+)"[\s\S]*?"conceptInvariant":\s*"([^"]+)"')
matches = pattern.findall(text)
for d, title, spokenGoal, conceptInvariant in matches:
    print(f"=== Day {d}: {title} ===")
    print(f"Goal: {spokenGoal[:120]}...")
    print(f"Invariant: {conceptInvariant[:120]}...\n")
