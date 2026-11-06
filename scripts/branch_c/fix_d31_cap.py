with open('scripts/branch_c/build_day31_prompt.py', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace(
    '"say2": "Explicit separation divides search harnesses from heuristic scoring oracles."',
    '"say2": "Separation divides search harnesses from heuristic scoring oracles."'
)

with open('scripts/branch_c/build_day31_prompt.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated Part 5 say2 caption in build_day31_prompt.py")
