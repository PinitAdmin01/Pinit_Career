# scripts/check_day_stats.py
import sys
import os
sys.path.insert(0, os.path.abspath("."))
sys.path.insert(0, os.path.abspath("scripts"))

def check_day(day_obj):
    print(f"Day {day_obj['day']}: {day_obj['title']}")
    total_words = 0
    all_ok = True
    for idx, p in enumerate(day_obj['parts']):
        wc = sum(len(s.split()) for s in p['say'])
        paras = len(p['say'])
        print(f"  Part {idx+1}: {paras} paras, {wc} words | Title: {p['title'][:50]}...")
        total_words += wc
        if paras < 7:
            print(f"    WARNING: Paras < 7 ({paras})")
            all_ok = False
        if wc < 600:
            print(f"    WARNING: Words < 600 ({wc})")
            all_ok = False
    print(f"Total Words: {total_words}")
    if total_words < 3000:
        print(f"  WARNING: Total words < 3000 ({total_words})")
        all_ok = False
    return all_ok

if __name__ == "__main__":
    day_num = int(sys.argv[1]) if len(sys.argv) > 1 else 41
    mod = __import__(f"data_devops_day{day_num}")
    day_obj = getattr(mod, f"DAY_{day_num}")
    ok = check_day(day_obj)
    print("Status:", "PASSED" if ok else "FAILED")
