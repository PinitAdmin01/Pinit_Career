import os
p = 'src/lib/data/lessonVisuals/java-basics'
if os.path.exists(p):
    files = sorted(os.listdir(p))
    print(f"Total visual files in {p}: {len(files)}")
    print("Files 20 to 35:", [f for f in files if any(f'day-{d:02d}' in f for d in range(20, 36))])
else:
    print(f"{p} does not exist!")
