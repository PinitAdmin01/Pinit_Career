import re
import os

# Search curriculumEnricher.ts
with open('src/lib/data/curriculumEnricher.ts', 'r', encoding='utf-8') as f:
    ce_text = f.read()

for line in ce_text.splitlines():
    if 'AI_WEB_LONG_LESSONS' in line or 'aiWeb' in line or 'ai-web' in line:
        print("curriculumEnricher.ts:", line)

# Search coursesData.ts
with open('src/lib/data/coursesData.ts', 'r', encoding='utf-8') as f:
    cd_text = f.read()

for line in cd_text.splitlines():
    if 'AI_WEB_LONG_LESSONS' in line or 'aiWeb' in line or 'ai-web' in line:
        print("coursesData.ts:", line)

# Check folders under src/lib/data/lessonVisuals
visuals_dir = 'src/lib/data/lessonVisuals'
if os.path.exists(visuals_dir):
    folders = [d for d in os.listdir(visuals_dir) if os.path.isdir(os.path.join(visuals_dir, d))]
    ai_folders = [d for d in folders if 'ai' in d.lower()]
    print("AI folders in lessonVisuals:", ai_folders)
    print("All folders sample:", folders[:15])
