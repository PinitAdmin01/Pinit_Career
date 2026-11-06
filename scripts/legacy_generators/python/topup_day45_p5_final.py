import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/build_day45_file.py', 'r', encoding='utf-8') as f:
    text = f.read()

add_p5 = '''    "You are now ready to lead enterprise frontend engineering initiatives at the highest level of industry excellence.",
'''

def insert_before_closing_bracket(content, array_name, addition):
    target = f"{array_name} = ["
    idx = content.find(target)
    if idx == -1:
        raise Exception(f"Target {target} not found")
    idx_close = content.find("\n]", idx)
    return content[:idx_close] + ",\n" + addition.rstrip(",\n") + content[idx_close:]

new_text = insert_before_closing_bracket(text, "p5_say", add_p5)

with open('scripts/build_day45_file.py', 'w', encoding='utf-8') as f:
    f.write(new_text)

print("Final sentence added to Day 45 Part 5!")
