with open('scripts/generate_visuals_block8.py', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace any occurrence of : \" with : "\"
# When read from disk, : \" is the characters ':', ' ', '\', '"'
text = text.replace(': \\"', ': "\\"')

with open('scripts/generate_visuals_block8.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Fixed escaped quotes successfully!")
