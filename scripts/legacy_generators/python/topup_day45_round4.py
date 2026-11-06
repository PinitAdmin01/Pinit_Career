import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/build_day45_file.py', 'r', encoding='utf-8') as f:
    text = f.read()

add_p3 = '''    "Ultimately, this balance of asynchronous streaming and selective interaction replay ensures that computational resources are deployed exactly where and when the user demands them.",
'''

add_p4 = '''    "This sophisticated synchronization engine eliminates race conditions and ensures complete transactional integrity across distributed cloud networks.",
'''

add_p5 = '''    "As a result, your team can deploy updates with supreme confidence, knowing that the platform delivers unmatched speed, scalability, and resilience across all devices.",
'''

def insert_before_closing_bracket(content, array_name, addition):
    target = f"{array_name} = ["
    idx = content.find(target)
    if idx == -1:
        raise Exception(f"Target {target} not found")
    idx_close = content.find("\n]", idx)
    return content[:idx_close] + ",\n" + addition.rstrip(",\n") + content[idx_close:]

new_text = insert_before_closing_bracket(text, "p3_say", add_p3)
new_text = insert_before_closing_bracket(new_text, "p4_say", add_p4)
new_text = insert_before_closing_bracket(new_text, "p5_say", add_p5)

with open('scripts/build_day45_file.py', 'w', encoding='utf-8') as f:
    f.write(new_text)

print("Topped up Day 45 round 4 successfully!")
