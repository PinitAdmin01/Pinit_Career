# scripts/inspect_part45.py
with open('docs/visuals/PINIT_36_COURSES_MASTERCLASS_SRS_500P.md', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for line in lines[365:]:
    # Replace unicode special characters that fail on cp1252 stdout
    print(line.encode('ascii', errors='replace').decode('ascii'), end='')
