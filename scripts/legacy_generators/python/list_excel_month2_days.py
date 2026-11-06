import sys, re
sys.stdout.reconfigure(encoding='utf-8')

with open('docs/visuals/PINIT_MASTER_DEBUG.html', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

pos = text.find('38.2 Month 2: Advanced Financial Modeling')
pos_end = text.find('PART XXXIX: GIT', pos)

# Find all Day XX in this range
matches = re.findall(r'(Day \d+)\s*</span>\s*<strong[^>]*>([^<]+)</strong>', text[pos:pos_end])
print(f"Total days found in Excel Month 2: {len(matches)}")
for d, title in matches:
    print(f"  {d}: {title.strip()}")
