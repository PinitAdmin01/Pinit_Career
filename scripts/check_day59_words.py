with open('scripts/day59_builder.py', 'r', encoding='utf-8') as f:
    text = f.read()

code = text.replace('assert words >= 600', '# assert words >= 600')
code = code.replace('assert day_total_words >= 3000', '# assert day_total_words >= 3000')

loc = {}
exec(code, loc)
d = loc['build_day59']()

for i, p in enumerate(d['parts']):
    words = sum(len(s.split()) for s in p['say'])
    print(f"Part {i+1} ('{p['title']}'): {words} words")
