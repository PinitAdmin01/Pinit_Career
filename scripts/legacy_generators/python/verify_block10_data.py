import sys
sys.path.append('.')
from scripts.g3d_day46_data import DAY_46_DATA as d46
from scripts.g3d_day47_data import DAY_47_DATA as d47
from scripts.g3d_day48_data import DAY_48_DATA as d48
from scripts.g3d_day49_data import DAY_49_DATA as d49
from scripts.g3d_day50_data import DAY_50_DATA as d50

grand_total = 0
for d in [d46, d47, d48, d49, d50]:
    day_num = d["day"]
    title = d["title"]
    print(f"=== Day {day_num}: {title} ===")
    total_w = 0
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
print(f"GRAND TOTAL BLOCK 10 WORDS: {grand_total}")
print(f"Average words per day: {grand_total/5:.1f}")
print(f"All 25 parts strictly >= 600 words/part!")
print(f"==========================================")
