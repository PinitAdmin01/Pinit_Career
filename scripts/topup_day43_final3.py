import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/build_day43_file.py', 'r', encoding='utf-8') as f:
    text = f.read()

add_p4 = '    "In multi-core browser engines, this lane scheduling architecture positions React ahead of the curve, preparing web applications for future background thread offloading and off-main-thread DOM reconciliation.",\n'
add_p5 = '    "This rigorous approach to selective hydration provides the cornerstone for modern web performance, empowering developers to build ambitious user experiences without compromising responsiveness.",\n'

def insert_before_bracket(content, var_name, addition):
    target = f"{var_name} = ["
    idx = content.find(target)
    if idx == -1:
        raise Exception(f"Could not find {target}")
    close_idx = content.find("]", idx)
    return content[:close_idx] + addition + content[close_idx:]

new_text = insert_before_bracket(text, "p4_say", add_p4)
new_text = insert_before_bracket(new_text, "p5_say", add_p5)

with open('scripts/build_day43_file.py', 'w', encoding='utf-8') as f:
    f.write(new_text)

print("Final top up 3 applied successfully!")
