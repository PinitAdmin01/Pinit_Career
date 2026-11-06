import sys
sys.path.append('scripts')
from design_day46_data import DAY_46
from design_day47_data import DAY_47
from design_day48_data import DAY_48
from design_day49_data import DAY_49
from design_day50_data import DAY_50

days = [DAY_46, DAY_47, DAY_48, DAY_49, DAY_50]

import re
def count_words(say_list):
    total = 0
    for p in say_list:
        total += len(re.findall(r"\b[A-Za-z0-9_\-\.\$\/\:\@\']+\b", p))
    return total

grand_total_words = 0
all_passed = True

for d in days:
    day_num = d['day']
    title = d['title']
    recap = d.get('recap', '')
    assert isinstance(recap, str), f"Day {day_num} recap must be string, got {type(recap)}"
    assert d.get('minutes') == 25, f"Day {day_num} minutes must be 25, got {d.get('minutes')}"
    assert 'theme' not in d, f"Day {day_num} should not have 'theme' property"
    
    day_words = 0
    print(f"\n--- Day {day_num}: {title} ---")
    for idx, p in enumerate(d['parts']):
        wc = count_words(p['say'])
        day_words += wc
        grand_total_words += wc
        
        # Check quiz
        check = p['check']
        assert len(check['options']) == 4, f"Day {day_num} Part {idx+1} must have 4 options"
        assert check['answer'] == 0, f"Day {day_num} Part {idx+1} answer must be 0"
        assert check['answerIndex'] == 0, f"Day {day_num} Part {idx+1} answerIndex must be 0"
        assert len(check['why']) >= 50, f"Day {day_num} Part {idx+1} why too short: {len(check['why'])}"
        
        status = "OK" if wc >= 600 else "FAIL (<600)"
        print(f"  Part {idx+1}: {wc} words [{status}] | {p['title'][:45]}")
        if wc < 600:
            all_passed = False
            
    print(f"Day {day_num} Total: {day_words} words")

print(f"\n=== BLOCK 10 SUMMARY ===")
print(f"Total Days: 5 (Days 46-50)")
print(f"Total Parts: 25")
print(f"Grand Total Words: {grand_total_words} words (avg {grand_total_words/25:.1f} words/part)")
print(f"All Parts >= 600 words: {all_passed}")
