import os, re

for root, dirs, files in os.walk('.'):
    for f in files:
        if f.endswith('.md') or f.endswith('.html') or f.endswith('.txt') or f.endswith('.ts'):
            path = os.path.join(root, f)
            try:
                with open(path, 'r', encoding='utf-8') as fl:
                    content = fl.read()
                if 'promptPython' in content and ('Day 31' in content or 'Days 31' in content):
                    print(f"Found in {path}")
                    m = re.search(r'promptPython[\s\S]{0,1000}', content)
                    if m:
                        print(m.group(0)[:500])
            except:
                pass
