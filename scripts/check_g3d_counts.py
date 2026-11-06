import re

with open('scripts/create_g3d_day31_data.py', 'r', encoding='utf-8') as f:
    c = f.read()

exec_globals = {}
exec(c.split("day31_data = {")[0], exec_globals)
for i in range(1, 6):
    arr = exec_globals[f'say_p{i}']
    wc = sum(len(s.split()) for s in arr)
    print(f"say_p{i}: {wc} words")
