with open('scripts/generate_iot_edge_day6.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if 'Audit Verdict:' in l:
        print(f"Line {i}: {l}")
    if i == 455:
        print(f"Old Line 455: {repr(l)}")
        lines[i] = '================================================================================""",\n'

with open('scripts/generate_iot_edge_day6.py', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("Replaced line 455 successfully.")
