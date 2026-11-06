import os
if os.path.exists('scripts/assemble_block6.py'):
    with open('scripts/assemble_block6.py', 'r', encoding='utf-8') as f:
        print("Existing assemble_block6.py:")
        print(f.read()[:1000])
else:
    print("assemble_block6.py does not exist yet")
