import sys, io, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('scripts/visuals/ai-prompt-masterclass-spec.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# find days 31-35
for d in range(31, 36):
    pattern = rf'"day":\s*{d},[\s\S]*?"title":\s*"([^"]+)"[\s\S]*?"pedagogicalRole":\s*"([^"]+)"'
    m = re.search(pattern, text)
    if m:
        print(f"Day {d}: {m.group(1)}")
        print(f"  Role: {m.group(2)}")
