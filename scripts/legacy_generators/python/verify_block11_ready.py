import sys, os
sys.path.insert(0, os.path.abspath('.'))
sys.stdout.reconfigure(encoding='utf-8')

total_words = 0
for d in range(51, 56):
    mod_name = f"design_day{d}_data"
    mod = getattr(__import__(f"scripts.{mod_name}"), mod_name)
    data = getattr(mod, f"DAY_{d}")
    day_words = 0
    print(f"=== Day {d}: {data['title']} ===")
    assert len(data['parts']) == 5, f"Day {d} does not have 5 parts"
    for i, p in enumerate(data['parts'], 1):
        w = len(p['say'].split())
        day_words += w
        print(f"  Part {i}: {w} words | {p['title']}")
        assert w >= 600, f"Day {d} Part {i} has only {w} words (< 600)"
        assert p['check']['answer'] == 0, f"Day {d} Part {i} check answer != 0"
        assert p['check']['answerIndex'] == 0, f"Day {d} Part {i} check answerIndex != 0"
        assert len(p['check']['options']) == 4, f"Day {d} Part {i} check options != 4"
        assert len(p['check']['why']) >= 50, f"Day {d} Part {i} check why too short"
    total_words += day_words
    print(f"Day {d} Total Words: {day_words}\n")

print(f"Block 11 Grand Total Words: {total_words}")
