with open('src/lib/data/reactLongLessons.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
removed = 0
for line in lines:
    if 'desc: "' in line and any(k in line for k in ['Hybrid RSC', 'Streaming SSR', 'Selective Hydration', 'Server Actions', 'Milestone 8']):
        print('Removing line:', line.strip())
        removed += 1
        continue
    new_lines.append(line)

with open('src/lib/data/reactLongLessons.ts', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print(f'Done! Removed {removed} desc lines.')
