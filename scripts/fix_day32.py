with open('scripts/fullstack_day32_data.py', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('"code": [', '"code": "\\n".join([')
text = text.replace('"output": [', '"output": "\\n".join([')
text = text.replace("].join('\\n'),", "]),")

with open('scripts/fullstack_day32_data.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated fullstack_day32_data.py")
