import sys, os

sys.path.append(os.path.abspath('scripts'))

print("=== React Days 31 to 45 Script Check ===")
for d in range(31, 46):
    mod_name = f"react_day{d}_data"
    try:
        mod = __import__(mod_name)
        day_dict = getattr(mod, f"day{d}", None) or getattr(mod, f"DAY_{d}", None) or getattr(mod, "day_data", None)
        if day_dict:
            title = day_dict.get("title", "")
            parts = day_dict.get("parts", [])
            print(f"Day {d:2d} | Found: {title[:40]} | Parts: {len(parts)}")
            words = []
            for p in parts:
                say = p.get("say", [])
                text = " ".join(say) if isinstance(say, list) else str(say)
                words.append(len(text.split()))
            print(f"       | Words per part: {words} (Total: {sum(words)})")
        else:
            print(f"Day {d:2d} | Module found but day dict missing!")
    except Exception as e:
        print(f"Day {d:2d} | Error: {e}")
