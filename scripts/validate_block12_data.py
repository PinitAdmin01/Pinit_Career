import sys, os
sys.path.insert(0, os.path.abspath('scripts'))
sys.stdout.reconfigure(encoding='utf-8')

from design_day56_data import DAY_56
from design_day57_data import DAY_57
from design_day58_data import DAY_58
from design_day59_data import DAY_59
from design_day60_data import DAY_60

days = [DAY_56, DAY_57, DAY_58, DAY_59, DAY_60]
total_block_words = 0

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

    day_words = 0
    for i, part in enumerate(day['parts'], 1):
        assert 'id' not in part, f"Part {i} must not have 'id'"
        assert 'expectedOutput' not in part, f"Part {i} must not have 'expectedOutput'"
        assert 'output' in part and len(part['output']) > 5, f"Part {i} must have 'output'"
        assert len(part['title']) > 5, f"Part {i} title too short"
        
        say_array = part['say'] if isinstance(part['say'], list) else [part['say']]
        assert len(say_array) >= 4, f"Part {i} say array length < 4 (got {len(say_array)})"
        
        import re
        words = len(re.findall(r'\b[A-Za-z0-9_\-\.\$\/\:\@\']+\b', ' '.join(say_array)))
        day_words += words
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
    
    total_block_words += day_words
    print(f"Day {day['day']} Total: {day_words} words\n")

print(f"Block 12 Grand Total Words: {total_block_words} words")
print("\nALL BLOCK 12 DAYS (56-60) PASSED INTEGRITY VERIFICATION!")
