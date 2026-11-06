with open('scripts/day55_builder.py', 'r', encoding='utf-8') as f:
    text = f.read()

lines = text.splitlines()
clean_lines = []
for l in lines:
    if 'assert words >= 600' in l or 'assert day_total_words >= 3000' in l or 'd55 = build_day55()' in l or 'if __name__' in l:
        clean_lines.append('# ' + l)
    else:
        clean_lines.append(l)

clean_code = '\n'.join(clean_lines)
g = {}
exec(clean_code, g)
d = g['build_day55']()
print("--- Day 55 Word Counts ---")
for i, p in enumerate(d['parts']):
    w = sum(len(x.split()) for x in p['say'])
    print(f"Part {i+1} ({p['title'][:40]}...): {w} words (needs {max(0, 600-w)} more)")
print("Total words:", sum(sum(len(x.split()) for x in p['say']) for p in d['parts']))
