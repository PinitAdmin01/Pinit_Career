with open('C:/Users/Admin/Desktop/projects/Present-Career-os-platform/scripts/branch_c/build_day36_prompt.py', 'r', encoding='utf-8') as f:
    text = f.read()

p5_add = '''    "Decentralized key management frameworks safeguard sensitive encryption keys used to authenticate structured API communications between constrained generation services and enterprise backend databases, preventing unauthorized access across corporate network boundaries.",\n'''

idx_parts = text.find('parts_data = [')
text = text[:idx_parts-3] + p5_add + text[idx_parts-3:]

with open('C:/Users/Admin/Desktop/projects/Present-Career-os-platform/scripts/branch_c/build_day36_prompt.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Added 30 words to Day 36 Part 5!")
