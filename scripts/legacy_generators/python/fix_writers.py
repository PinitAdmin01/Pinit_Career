# scripts/fix_writers.py
for d in [53, 54, 55]:
    path = f"scripts/create_dist_day{d}_data.py"
    content = open(path, "r", encoding="utf-8").read()
    # find where with open("scripts/dist_day... is
    lines = content.split("\n")
    out = []
    i = 0
    while i < len(lines):
        line = lines[i]
        if f'with open("scripts/dist_day{d}_data.py"' in line:
            out.append(line)
            out.append(f'    f.write("# Dist Day {d} Data\\nDAY_{d}_DATA = " + repr(day{d}_data) + "\\nday{d}_data = DAY_{d}_DATA\\n")')
            # skip until print
            i += 1
            while i < len(lines) and not lines[i].startswith("print"):
                i += 1
            if i < len(lines):
                out.append(lines[i])
        else:
            out.append(line)
        i += 1
    open(path, "w", encoding="utf-8").write("\n".join(out))
    print(f"Fixed {path}")
