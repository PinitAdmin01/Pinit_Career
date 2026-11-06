import sys
sys.path.append('.')
from scripts.g3d_day51_data import DAY_51_DATA as d51
from scripts.g3d_day52_data import DAY_52_DATA as d52
from scripts.g3d_day53_data import DAY_53_DATA as d53
from scripts.g3d_day54_data import DAY_54_DATA as d54
from scripts.g3d_day55_data import DAY_55_DATA as d55

grand_total = 0
for d in [d51, d52, d53, d54, d55]:
    day_num = d["day"]
    title = d["title"]
    print(f"=== Day {day_num}: {title} ===")
    total_w = 0
    assert d.get("coursePrefix") == "g3d"
    assert isinstance(d.get("projectStep"), dict)
    assert len(d.get("projectStep", {}).get("steps", [])) >= 3
    assert isinstance(d.get("summary"), list)
    assert len(d.get("summary", [])) >= 4
    for p in d['parts']:
        p_num = p['part']
        wc = sum(len(s.split()) for s in p['say'])
        assert wc >= 600, f"Day {day_num} Part {p_num} word count {wc} < 600"
        assert p['check']['answer'] == 0
        assert p['check']['answerIndex'] == 0
        assert len(p['check']['why']) >= 50, f"Why explanation too short in Day {day_num} Part {p_num}"
        assert len(p['check']['options']) == 4, f"Options count != 4 in Day {day_num} Part {p_num}"
        assert len(p['code']) > 0
        assert len(p['output']) > 0
        total_w += wc
        print(f"  Part {p_num}: {wc} words")
    print(f"Total: {total_w} words (average: {total_w/5:.1f} w/part)")
    grand_total += total_w

print(f"\n==========================================")
print(f"GRAND TOTAL BLOCK 11 WORDS: {grand_total}")
print(f"Average words per day: {grand_total/5:.1f}")
print(f"All 25 parts strictly >= 600 words/part!")
print(f"==========================================")
