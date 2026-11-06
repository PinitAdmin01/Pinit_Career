with open('src/lib/data/curriculumStructure.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

in_comp = False
for line in lines:
    if 'id: "comp_fund"' in line or "id: 'comp_fund'" in line or 'comp_fund:' in line:
        in_comp = True
    if in_comp:
        print(line, end="")
        if 'day: 25' in line or 'day: 30' in line:
            break
