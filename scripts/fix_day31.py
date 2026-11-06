with open('scripts/fullstack_day31_data.py', 'r', encoding='utf-8') as f:
    text = f.read()

# In Python:
# replace `"code": [\n` with `"code": "\\n".join([\n`
# replace `"output": [\n` with `"output": "\\n".join([\n`
# and `].join('\\n'),` with `]),`

text = text.replace('"code": [', '"code": "\\n".join([')
text = text.replace('"output": [', '"output": "\\n".join([')
text = text.replace("].join('\\n'),", "]),")

with open('scripts/fullstack_day31_data.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated fullstack_day31_data.py")
