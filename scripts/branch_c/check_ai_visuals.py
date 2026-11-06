import os
import json

ai_dir = 'src/lib/data/lessonVisuals/ai'
if os.path.exists(ai_dir):
    files = sorted(os.listdir(ai_dir))
    print(f"Files in {ai_dir}: {len(files)} files")
    print("First 5 files:", files[:5])
    print("Last 5 files:", files[-5:])
    
    # inspect day-1.json or day-30.json
    sample_file = os.path.join(ai_dir, files[0])
    with open(sample_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    print("Sample prefix in json:", data.get('prefix'))
    print("Sample schemaVersion:", data.get('schemaVersion'))
    print("Sample day:", data.get('day'))
