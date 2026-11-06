import sys, os

sys.path.append(os.path.abspath('scripts'))

print("=== Checking React Days 31 to 45 Word Counts ===")
below_600 = []

for d in range(31, 46):
    mod_name = f"react_day{d}_data"
    mod = __import__(mod_name)
    day_dict = getattr(mod, f"day{d}", None) or getattr(mod, f"DAY_{d}", None) or getattr(mod, "day_data", None) or getattr(mod, f"day{d}_data", None)
    parts = day_dict.get("parts", [])
    print(f"\nDay {d}: {day_dict['title'][:45]}")
    for i, p in enumerate(parts):
        say = p.get("say", [])
        text = " ".join(say) if isinstance(say, list) else str(say)
        w = len(text.split())
        status = "OK" if w >= 600 else "BELOW 600"
        print(f"  Part {i+1}: {w} words [{status}]")
        if w < 600:
            below_600.append((d, i+1, w, 600 - w))

print("\n=== SUMMARY OF PARTS BELOW 600 WORDS ===")
if not below_600:
    print("ALL PARTS >= 600 WORDS!")
else:
    for d, p, w, diff in below_600:
        print(f"Day {d} Part {p}: {w} words (needs +{diff} words)")
