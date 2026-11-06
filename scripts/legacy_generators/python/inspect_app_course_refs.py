import os, glob

# Search for references to coursesData or crashPlansData in src/app/
for root, dirs, files in os.walk('src/app'):
    for f in files:
        if f.endswith('.tsx') or f.endswith('.ts'):
            fp = os.path.join(root, f)
            with open(fp, 'r', encoding='utf-8', errors='ignore') as fp_in:
                text = fp_in.read()
            if 'coursesData' in text or 'LONG_LESSON' in text or 'longLessons' in text:
                print(f"File {fp} references coursesData or longLessons")
