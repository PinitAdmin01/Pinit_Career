import sys, re
sys.stdout.reconfigure(encoding='utf-8')

with open('docs/visuals/PINIT_MASTER_DEBUG.html', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

idx = text.find('TensorFlow Lite for Microcontrollers (TFLM): FlatBuffers, OpResolvers & Tensor Arena Memory Planning')
chunk = text[idx-100:idx+80000]

cards = chunk.split('daily-card-header')
print(f"Total cards split: {len(cards)}")
for c in cards:
    m = re.search(r'Day\s*(2[1-5])</span>\s*<strong[^>]*>([^<]+)</strong>', c)
    if m:
        day_num, title = m.groups()
        print(f"\n==========================================")
        print(f"=== Day {day_num}: {title.strip()} ===")
        print(f"==========================================")
        goal_m = re.search(r'<strong>🎯 Spoken Goal &amp; Invariant:</strong><br>\s*<span[^>]*>Goal:</span>\s*(.*?)(?=<span|<div|$)', c, re.DOTALL)
        if goal_m:
            print("GOAL:", goal_m.group(1).strip()[:200] + "...")
        inv_m = re.search(r'<code>(.*?)</code>', c, re.DOTALL)
        if inv_m:
            print("INVARIANT:", inv_m.group(1).strip())
        fail_m = re.search(r'<strong>Failure:</strong>\s*(.*?)(?=<div|$)', c, re.DOTALL)
        if fail_m:
            print("FAILURE:", fail_m.group(1).strip()[:200] + "...")
        quests = re.findall(r'<strong>(Quest\s*\d+[^<]*)</strong>', c)
        for q in quests:
            print("   *", q.strip())
