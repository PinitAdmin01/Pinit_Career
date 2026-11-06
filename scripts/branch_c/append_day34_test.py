with open('tests/ai_web_days31_35_expansion.test.ts', 'r', encoding='utf-8') as f:
    text = f.read()

idx33 = text.find("it('Day 33:")
idx34 = text.find("it('Day 34:")
assert idx33 != -1, "Day 33 block not found"
assert idx34 != -1, "Day 34 block not found"

day33_block = text[idx33:idx34]
day34_block = day33_block.replace('33', '34')

new_text = text[:idx34] + day34_block + '});\n'
with open('tests/ai_web_days31_35_expansion.test.ts', 'w', encoding='utf-8') as f:
    f.write(new_text)

print('Successfully updated Day 34 tests in tests/ai_web_days31_35_expansion.test.ts')
