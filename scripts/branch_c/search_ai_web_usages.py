import os
import re

for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith(('.ts', '.tsx', '.js')):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            if 'AI_WEB_LONG_LESSONS' in content or 'aiWebLongLessons' in content:
                print(f"Match in {path}")
