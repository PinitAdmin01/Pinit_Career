with open('scripts/day57_builder.py', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('class EncryptedVectorRecord')
print(text[idx-250:idx])
