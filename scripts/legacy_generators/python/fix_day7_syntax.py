with open('scripts/generate_iot_edge_day7.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    stripped = line.strip()
    if stripped.startswith('"code": """') or stripped.startswith('"output": """') or stripped.endswith('""",') or stripped == '"""':
        new_lines.append(line)
    elif '"""' in line:
        new_lines.append(line.replace('"""', "'"))
    else:
        new_lines.append(line)

with open('scripts/generate_iot_edge_day7.py', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("generate_iot_edge_day7.py fixed.")
