with open('scripts/generate_iot_emb_days11_15.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    # If line starts with "output": r""" and has a backtick at the end
    if '"output": r"""' in line:
        # replace `,\n with """,\n or `\n with """\n
        if line.rstrip().endswith('`,'):
            line = line.rstrip()[:-2] + '""",\n'
        elif line.rstrip().endswith('`'):
            line = line.rstrip()[:-1] + '"""\n'
    # Any other backtick in prose
    line = line.replace('`', "'")
    new_lines.append(line)

with open('scripts/generate_iot_emb_days11_15.py', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Cleaned all remaining backticks!")
