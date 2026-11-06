import re

with open('scripts/soft_skills_batch6_true_bible.txt', 'r', encoding='utf-8') as f:
    text = f.read()

days = re.findall(r'<span[^>]*>(Day (?:5[6-9]|60))</span>\s*<strong[^>]*>([^<]+)</strong>', text)
for d, title in days:
    print(f"{d}: {title}")

# Extract quests for each day
quests = re.findall(r'<span[^>]*>(soft-skills-m2-d(?:5[6-9]|60)-q\d|soft-skills-m2-d60-cap)</span>\s*<strong>([^<]+)</strong>\s*<em>\(([^)]+)\)</em>:\s*<span[^>]*>([^<]+)</span>', text)
print(f"\nFound {len(quests)} quests:")
for q_id, q_title, q_type, q_desc in quests:
    print(f"  {q_id} [{q_type}]: {q_title} -> {q_desc[:80]}...")
