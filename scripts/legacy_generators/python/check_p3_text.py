with open('scripts/day57_builder.py', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's find Part 3's last sentence
p3_idx = text.find('"Local Vector Databases')
p4_idx = text.find('"Secure Model Weight')
print("Part 3 say text:")
print(text[p3_idx:p4_idx])
