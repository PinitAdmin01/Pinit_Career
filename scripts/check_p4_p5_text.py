with open('scripts/day57_builder.py', 'r', encoding='utf-8') as f:
    text = f.read()

p4_idx = text.find('"Secure Model Weight Decryption')
example_idx = text.find('"example":', p4_idx)
print(text[p4_idx:example_idx])
