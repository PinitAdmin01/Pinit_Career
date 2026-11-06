with open('scripts/build_day47_cloud.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

current_part = None
counts = {}

for line in lines:
    if line.startswith('p1_say = ['): current_part = 1; counts[1] = 0
    elif line.startswith('p2_say = ['): current_part = 2; counts[2] = 0
    elif line.startswith('p3_say = ['): current_part = 3; counts[3] = 0
    elif line.startswith('p4_say = ['): current_part = 4; counts[4] = 0
    elif line.startswith('p5_say = ['): current_part = 5; counts[5] = 0
    elif line.startswith(']'): current_part = None
    elif current_part and line.strip().startswith('"'):
        words = line.strip().strip('",').split()
        counts[current_part] += len(words)

for p, c in counts.items():
    print(f"Part {p}: {c} words")
