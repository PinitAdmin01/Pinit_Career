with open('src/lib/data/designWebLongLessons.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Check lines around 9000
for i in range(8995, 9010):
    print(f"{i+1}: {lines[i].strip()}")

# If line 9000 and 9003 are both goal:
# lines[8999] = goal 1
# lines[9000] = minutes 1
# lines[9001] = recap 1
# lines[9002] = goal 2
# lines[9003] = minutes 2
# lines[9004] = recap 2
if '"goal":' in lines[8999] and '"goal":' in lines[9002]:
    print("Deleting duplicate lines 9003-9005 (0-indexed 9002:9005)...")
    del lines[9002:9005]

with open('src/lib/data/designWebLongLessons.ts', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("Saved cleaned file!")
