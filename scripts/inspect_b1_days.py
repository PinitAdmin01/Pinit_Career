import os

for d in range(1, 6):
    p = f'scripts/block1_day{d}.py'
    if os.path.exists(p):
        with open(p, 'r', encoding='utf-8') as f:
            c = f.read()
        print(f"block1_day{d}.py: length={len(c)}")
    else:
        print(f"block1_day{d}.py DOES NOT EXIST")
