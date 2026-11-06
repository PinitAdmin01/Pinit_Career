import sys
sys.path.append('scripts')
import make_month2_days41_42 as m

for d in [m.day41_lesson, m.day42_lesson]:
    day_num = d["day"]
    print(f"=== DAY {day_num} ===")
    for idx, pt in enumerate(d["parts"]):
        s = sum(len(p.split()) for p in pt["say"])
        e = len(pt["example"].split())
        t = len(pt["tryIt"].split())
        w = len(pt["check"]["why"].split())
        total = s + e + t + w
        print(f"  Part {idx+1}: {total} words (say={s}, ex={e}, try={t}, why={w}) {'PASS' if total >= 580 else 'FAIL'}")
