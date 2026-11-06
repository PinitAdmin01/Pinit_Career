import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/build_day43_file.py', 'r', encoding='utf-8') as f:
    text = f.read()

add_p5 = '    "With this comprehensive architecture in place, our applications achieve absolute peak performance across every critical user-centric metric.",\n'

def insert_before_bracket(content, var_name, addition):
    target = f"{var_name} = ["
    idx = content.find(target)
    if idx == -1:
        raise Exception(f"Could not find {target}")
    close_idx = content.find("]", idx)
    return content[:close_idx] + addition + content[close_idx:]

new_text = insert_before_bracket(text, "p5_say", add_p5)

with open('scripts/build_day43_file.py', 'w', encoding='utf-8') as f:
    f.write(new_text)

print("Final sentence added to Day 43 Part 5!")
