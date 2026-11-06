with open('docs/visuals/PINIT_MASTER_DEBUG.html', 'r', encoding='utf-8') as f:
    text = f.read()

pos_m = text.find('Day 41')
# Let's find matches for Day 41 in the context of Course 22
import re
matches = [m.start() for m in re.finditer(r'Day 41', text)]
print('Matches for Day 41:', matches)

for m in matches:
    snippet = text[m-200:m+400]
    if 'Stage 4' in snippet or 'Soft Skills' in snippet or 'Negotiation' in snippet or 'Executive' in snippet:
        print(f"Target match at {m}:")
        print(snippet)
        m_end = text.find('Day 46', m)
        chunk = text[m-400:m_end] if m_end != -1 else text[m-400:m+200000]
        with open('scripts/soft_skills_month2_batch3_bible.txt', 'w', encoding='utf-8') as out:
            out.write(chunk)
        print('Wrote scripts/soft_skills_month2_batch3_bible.txt of length', len(chunk))
        break
