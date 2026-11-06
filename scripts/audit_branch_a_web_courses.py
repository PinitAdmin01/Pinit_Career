import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

web_courses = [
    ('cloud', 'src/lib/data/cloudWebLongLessons.ts'),
    ('devops', 'src/lib/data/devopsWebLongLessons.ts'),
    ('cyber', 'src/lib/data/cyberWebLongLessons.ts'),
    ('dist', 'src/lib/data/distributedWebLongLessons.ts'),
    ('sre', 'src/lib/data/sreWebLongLessons.ts'),
    ('stream', 'src/lib/data/streamWebLongLessons.ts'),
    ('ai', 'src/lib/data/aiWebLongLessons.ts'),
    ('aideploy', 'src/lib/data/aiDeployWebLongLessons.ts'),
    ('dsa-optim', 'src/lib/data/dsaWebLongLessons.ts'),
    ('fullstack-js', 'src/lib/data/fullstackJsLongLessons.ts'),
    ('g3d', 'src/lib/data/g3dLongLessons.ts'),
    ('design', 'src/lib/data/designWebLongLessons.ts'),
]

print("=== BRANCH A WEB FULL-STACK COURSES AUDIT ===")
for name, path in web_courses:
    try:
        content = open(path, encoding='utf-8').read()
        days = [int(m) for m in re.findall(r'"day":\s*(\d+)', content)]
        print(f"{name:15}: {len(days):2} days (min: {min(days) if days else 0}, max: {max(days) if days else 0})")
    except Exception as e:
        print(f"{name:15}: Error: {e}")
