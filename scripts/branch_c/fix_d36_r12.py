with open('C:/Users/Admin/Desktop/projects/Present-Career-os-platform/scripts/branch_c/build_day36_prompt.py', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace(
    '"say2": "Incremental pushdown automata enforce balanced nested brackets."',
    '"say2": "Context free grammars define hierarchical production rules in EBNF."'
)
text = text.replace(
    '"say2": "Asynchronous parallel compilation prevents blocking inference workers."',
    '"say2": "Modular architectures center on schema ingestion and grammar compilers."'
)

with open('C:/Users/Admin/Desktop/projects/Present-Career-os-platform/scripts/branch_c/build_day36_prompt.py', 'w', encoding='utf-8') as f:
    f.write(text)

import subprocess
subprocess.run(['python', 'C:/Users/Admin/Desktop/projects/Present-Career-os-platform/scripts/branch_c/build_day36_prompt.py'], check=True)
print("Updated Day 36 captions and rebuilt successfully!")
