with open('scripts/design_day57_data.py', 'r', encoding='utf-8') as f:
    text = f.read()

# Fix RegExp in Part 2
text = text.replace(
    r"const tagPattern = new RegExp(\`<\${imp.localName}\\\\b([^>]*)/?>\`, 'g');",
    r"const tagPattern = new RegExp('<' + imp.localName + '\\b([^>]*)' + '/?>', 'g');"
)
text = text.replace(
    r"const tagPattern = new RegExp(`<\${imp.localName}\\\\b([^>]*)/?>`, 'g');",
    r"const tagPattern = new RegExp('<' + imp.localName + '\\b([^>]*)' + '/?>', 'g');"
)
text = text.replace(
    r"new RegExp(\`<\${imp.localName}",
    r"new RegExp('<' + imp.localName"
)

with open('scripts/design_day57_data.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Fixed RegExp in design_day57_data.py")
