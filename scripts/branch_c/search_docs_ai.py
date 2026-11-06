import os

# Search for any references to Course 12 or Applied AI in docs
for root, dirs, files in os.walk('docs'):
    for file in files:
        if file.endswith(('.md', '.txt')):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            if 'Applied AI' in content or 'aiWeb' in content or 'Course 12' in content:
                print(f"Found reference in {path}")
