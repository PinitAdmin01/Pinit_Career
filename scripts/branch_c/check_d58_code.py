with open('scripts/branch_c/build_day58.py', 'r', encoding='utf-8') as f:
    text = f.read()

for line in text.splitlines():
    if 'code1' in line or 'output1' in line:
        print(line.strip())
