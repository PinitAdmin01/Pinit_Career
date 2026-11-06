"""
Audit visual envelopes across all course folders in src/lib/data/lessonVisuals/
"""
import os, json, sys
sys.stdout.reconfigure(encoding='utf-8')

vis_dir = "src/lib/data/lessonVisuals"
if not os.path.exists(vis_dir):
    print("Visuals directory missing!")
    sys.exit(1)

subdirs = sorted([d for d in os.listdir(vis_dir) if os.path.isdir(os.path.join(vis_dir, d))])
print(f"Found {len(subdirs)} visual envelope folders in {vis_dir}:")

total_visual_files = 0
complete_folders = 0

for d in subdirs:
    folder_path = os.path.join(vis_dir, d)
    files = [f for f in os.listdir(folder_path) if f.startswith('day-') and f.endswith('.json')]
    count = len(files)
    total_visual_files += count
    status = "60/60 (100%)" if count == 60 else f"{count}/60"
    if count == 60:
        complete_folders += 1
    print(f"  {d:<20} | Visual Files: {count:<4} | Status: {status}")

print("=" * 60)
print(f"Total Visual Envelope Folders:  {len(subdirs)}")
print(f"Folders with all 60 Days:       {complete_folders} / {len(subdirs)}")
print(f"Total Visual Envelope JSONs:    {total_visual_files}")
print("=" * 60)
