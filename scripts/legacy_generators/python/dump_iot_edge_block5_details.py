import sys, re
sys.stdout.reconfigure(encoding='utf-8')

with open('docs/visuals/PINIT_MASTER_DEBUG.html', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

idx = text.find('TensorFlow Lite for Microcontrollers (TFLM): FlatBuffers, OpResolvers & Tensor Arena Memory Planning')
chunk = text[idx-100:idx+90000]

cards = chunk.split('daily-card-header')
for c in cards:
    m = re.search(r'Day\s*(2[1-5])</span>\s*<strong[^>]*>([^<]+)</strong>', c)
    if m:
        day_num, title = m.groups()
        print(f"\n========================================================")
        print(f"=== DAY {day_num}: {title.strip()} ===")
        print(f"========================================================")
        
        goal_m = re.search(r'<strong>🎯 Spoken Goal &amp; Invariant:</strong><br>\s*<span[^>]*>Goal:</span>\s*(.*?)(?=<span|<div|$)', c, re.DOTALL)
        if goal_m:
            print("GOAL:\n", goal_m.group(1).strip())
            
        inv_m = re.search(r'<code>(.*?)</code>', c, re.DOTALL)
        if inv_m:
            print("\nINVARIANT:\n", inv_m.group(1).strip())
            
        fail_m = re.search(r'<strong>Failure:</strong>\s*(.*?)(?=<div|$)', c, re.DOTALL)
        if fail_m:
            print("\nFAILURE:\n", fail_m.group(1).strip())
            
        quests = re.findall(r'<strong>Quest\s*(\d+):?\s*([^<]*)</strong>\s*<br>\s*(.*?)(?=<div style="margin-top: 6pt;"|</div>\s*</div>|$)', c, re.DOTALL)
        print("\nQUESTS:")
        for qnum, qtitle, qbody in quests:
            clean_body = re.sub(r'<[^>]+>', ' ', qbody).strip()
            print(f"  * Quest {qnum}: {qtitle.strip()}")
            print(f"    {clean_body[:200]}...")
