import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/build_day43_file.py', 'r', encoding='utf-8') as f:
    text = f.read()

add_p3 = '    "Ultimately, user-driven priority promotion converts human intent into the ultimate scheduling signal. Instead of relying on static heuristics or guessing which components the user might care about, React allows real user actions to direct computational resources in real time, guaranteeing maximum perceived performance.",\n'
add_p4 = '    "Furthermore, this granular priority scheduling prevents low-priority background work from causing jank during critical user flows. If an idle hydration pass begins while a user starts scrolling, the scheduler detects the frame deadline pressure, yields immediately, and resumes only after the scroll animation has settled.",\n'
add_p5 = '    "As web applications continue to grow in visual sophistication and behavioral density, mastering Selective Hydration separates junior UI developers from world-class systems architects. It ensures that no matter how large the application scales, the user always experiences an interface that is instantaneous, reliable, and deeply delightful.",\n'

def insert_before_bracket(content, var_name, addition):
    target = f"{var_name} = ["
    idx = content.find(target)
    if idx == -1:
        raise Exception(f"Could not find {target}")
    close_idx = content.find("]", idx)
    return content[:close_idx] + addition + content[close_idx:]

new_text = insert_before_bracket(text, "p3_say", add_p3)
new_text = insert_before_bracket(new_text, "p4_say", add_p4)
new_text = insert_before_bracket(new_text, "p5_say", add_p5)

with open('scripts/build_day43_file.py', 'w', encoding='utf-8') as f:
    f.write(new_text)

print("Final top up 2 applied successfully!")
