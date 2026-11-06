import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/build_day42_file.py', 'r', encoding='utf-8') as f:
    text = f.read()

add_p3 = '    "In complex single-page applications with multiple nested suspense boundaries, this replacement mechanism coordinates hierarchical resolution seamlessly. If an outer boundary resolves after an inner boundary, React preserves the inner component structure, ensuring zero redundant DOM updates and perfectly stable rendering across the entire document tree.",\n'
add_p4 = '    "Furthermore, by maintaining strict error boundary boundaries, development teams can deploy continuous updates with confidence. If an experimental feature or third-party personalization widget crashes, the core transaction funnel remains completely unharmed, protecting enterprise conversion rates and user trust.",\n'
add_p5 = '    "As web standards continue to evolve toward native HTML streaming and declarative shadow DOM, React streaming SSR stands as the gold standard of modern enterprise web delivery. It aligns physical network realities with component-driven architecture, delivering experiences that feel instantaneous and uncompromising.",\n'

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

with open('scripts/build_day42_file.py', 'w', encoding='utf-8') as f:
    f.write(new_text)

print("Topped up Day 42 parts 3, 4, 5 successfully!")
