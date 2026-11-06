import sys, os
sys.path.insert(0, os.path.abspath('scripts'))
sys.stdout.reconfigure(encoding='utf-8')

from design_day51_data import DAY_51
from design_day52_data import DAY_52
from design_day53_data import DAY_53
from design_day54_data import DAY_54
from design_day55_data import DAY_55

days = [DAY_51, DAY_52, DAY_53, DAY_54, DAY_55]

for day in days:
    print(f"=== Checking Day {day['day']}: {day['title']} ===")
    assert len(day['title']) > 5, "Title too short"
    assert len(day['goal']) > 20, "Goal too short"
    assert day['minutes'] == 25, "Minutes must be 25"
    assert isinstance(day['recap'], str), "Recap must be string"
    assert 'theme' not in day, "Must not have theme"
    assert len(day['parts']) == 5, "Must have 5 parts"
    assert 'summary' in day and len(day['summary']) >= 3, "Missing summary"
    assert 'projectStep' in day and len(day['projectStep']['steps']) >= 3, "Missing projectStep"

    for i, part in enumerate(day['parts'], 1):
        assert 'id' not in part, f"Part {i} must not have 'id'"
        assert 'expectedOutput' not in part, f"Part {i} must not have 'expectedOutput'"
        assert 'output' in part and len(part['output']) > 5, f"Part {i} must have 'output'"
        assert len(part['title']) > 5, f"Part {i} title too short"
        
        say_array = part['say'] if isinstance(part['say'], list) else [part['say']]
        assert len(say_array) >= 4, f"Part {i} say array length < 4 (got {len(say_array)})"
        
        # Word count calculation matching test regex
        import re
        words = len(re.findall(r'\b[A-Za-z0-9_\-\.\$\/\:\@\']+\b', ' '.join(say_array)))
        assert words >= 580, f"Part {i} word count < 580 (got {words})"
        
        assert len(part.get('example', '')) > 20, f"Part {i} missing example"
        assert len(part.get('code', '')) > 30, f"Part {i} missing code"
        assert len(part.get('codeNotes', [])) >= 2, f"Part {i} codeNotes < 2"
        assert len(part.get('tryIt', '')) > 10, f"Part {i} missing tryIt"
        
        chk = part['check']
        assert len(chk['options']) == 4, f"Part {i} options != 4"
        assert chk['answer'] == 0, f"Part {i} answer != 0"
        assert chk['answerIndex'] == 0, f"Part {i} answerIndex != 0"
        assert len(chk['why']) >= 50, f"Part {i} why < 50 chars"
        
        print(f"  Part {i}: {words} words | {part['title'][:40]} | OK")

print("\nALL BLOCK 11 DAYS (51-55) PASSED INTEGRITY VERIFICATION!")
