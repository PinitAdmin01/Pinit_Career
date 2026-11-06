import glob

for path in ['scripts/branch_c/build_day56.py', 'scripts/branch_c/build_day57.py', 'scripts/branch_c/build_day58.py',
             'src/lib/data/lessonVisuals/ai/day-56.json', 'src/lib/data/lessonVisuals/ai/day-57.json', 'src/lib/data/lessonVisuals/ai/day-58.json']:
    try:
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        if 'Production Standard V8' in content:
            content = content.replace('Production Standard V8', 'Production Standard Engine')
            with open(path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Replaced V8 in {path}")
    except Exception as e:
        print(f"Skipping {path}: {e}")
