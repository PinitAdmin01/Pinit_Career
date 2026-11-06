import re

with open('scripts/java_block8_raw.html', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

days = re.split(r'Day (\d+)', text)
# days[0] is before Day 36
print(f"Split segments: {len(days)}")

for i in range(1, len(days), 2):
    day_num = days[i]
    day_content = days[i+1]
    title_match = re.search(r'<strong style="[^"]*">([^<]+)</strong>', day_content)
    title = title_match.group(1) if title_match else 'Unknown'
    
    # Find all quests/cards
    quests = re.findall(r'Quest\s+(\d+\.\d+):?\s*([^<\n]+)', day_content)
    print(f"\n==================== DAY {day_num}: {ascii(title)} ====================")
    print(f"Quests ({len(quests)}):")
    for q_id, q_name in quests:
        print(f"  Quest {q_id}: {ascii(q_name.strip())}")
