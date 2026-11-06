with open('tests/ai_web_days31_35_expansion.test.ts', 'r', encoding='utf-8') as f:
    text = f.read()

idx34 = text.find("it('Day 34: Structural")
assert idx34 != -1, "Day 34 block not found"

last_brace = text.rfind('});')
assert last_brace != -1, "last brace not found"

day34_block = text[idx34:last_brace].rstrip()
day35_block = day34_block.replace('34', '35')

new_text = text[:last_brace] + '\n' + day35_block + '\n});\n'

with open('tests/ai_web_days31_35_expansion.test.ts', 'w', encoding='utf-8') as f:
    f.write(new_text)

print('Cleanly inserted Day 35 tests before final describe closing brace.')
