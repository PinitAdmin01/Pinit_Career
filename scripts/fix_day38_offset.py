with open('scripts/design_day38_data.py', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('Arrow Clamped Offset: 105px', 'Arrow Clamped Offset: 104px')
text = text.replace('left: 105px;', 'left: 104px;')

with open('scripts/design_day38_data.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated Day 38 Part 5 output to 104px!")
