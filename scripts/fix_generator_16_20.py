with open('scripts/generate_iot_emb_days16_20.py', 'r', encoding='utf-8') as f:
    text = f.read()

lines = text.split('\n')
new_lines = []
in_code = False
in_output = False

for line in lines:
    if '"code": `' in line:
        line = line.replace('"code": `', '"code": r"""')
        in_code = True
        new_lines.append(line)
        continue
    elif in_code:
        if line.endswith('`,') or line.endswith('`'):
            if line.endswith('`,'):
                line = line[:-2] + '""",',
                line = line[0]
            else:
                line = line[:-1] + '"""'
            in_code = False
        new_lines.append(line)
        continue
        
    if '"output": `' in line:
        line = line.replace('"output": `', '"output": r"""')
        # Check if it also ends with backtick on the same line
        if line.rstrip().endswith('`,'):
            line = line.rstrip()[:-2] + '""",\n'
        elif line.rstrip().endswith('`'):
            line = line.rstrip()[:-1] + '"""\n'
        else:
            in_output = True
        new_lines.append(line)
        continue
    elif in_output:
        if line.endswith('`,') or line.endswith('`'):
            if line.endswith('`,'):
                line = line[:-2] + '""",',
                line = line[0]
            else:
                line = line[:-1] + '"""'
            in_output = False
        new_lines.append(line)
        continue
        
    # Any other backtick in prose
    line = line.replace('`', "'")
    new_lines.append(line)

fixed = '\n'.join(new_lines)
with open('scripts/generate_iot_emb_days16_20.py', 'w', encoding='utf-8') as f:
    f.write(fixed)

print("Fixed generate_iot_emb_days16_20.py syntax!")
