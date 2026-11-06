# scripts/audit_block11_days.py
import json
import subprocess
import sys

def audit_block11():
    print("================================================================================")
    print("      BLOCK 11 (DAYS 51-55) & MILESTONE 11 FULL EXPANSION AUDIT SUITE           ")
    print("================================================================================")
    grand_total_words = 0

    for day in range(51, 56):
        json_path = f"scripts/iot_sec_day{day}.json"
        with open(json_path, 'r', encoding='utf-8') as f:
            d = json.load(f)

        assert d.get('day') == day, f"Day mismatch: expected {day}, got {d.get('day')}"
        assert d.get('minutes') == 38, f"Day {day}: minutes must be 38"
        assert len(d.get('parts', [])) == 5, f"Day {day}: must have exactly 5 parts"
        assert len(d.get('summary', [])) >= 4, f"Day {day}: summary must have >= 4 items"

        pstep = d.get('projectStep', {})
        assert 'title' in pstep and len(pstep['title']) > 10, f"Day {day}: projectStep missing title"
        assert len(pstep.get('steps', [])) >= 4, f"Day {day}: projectStep must have >= 4 steps"
        assert 'desc' not in pstep, f"Day {day}: projectStep must NOT have 'desc'"

        day_words = 0
        print(f"\n--- Day {day}: {d.get('title')} ---")
        for i, p in enumerate(d['parts']):
            say = p.get('say', [])
            assert isinstance(say, list) and len(say) >= 4, f"Day {day} Part {i+1}: say must have >= 4 paragraphs"
            words = sum(len(para.split()) for para in say)
            day_words += words
            assert words >= 580, f"Day {day} Part {i+1} has only {words} words (minimum 580 required)"
            assert len(p.get('example', '')) > 15, f"Day {day} Part {i+1}: example too short"
            assert len(p.get('codeNotes', [])) >= 3, f"Day {day} Part {i+1}: codeNotes must have >= 3 items"
            assert all(isinstance(cn, str) for cn in p['codeNotes']), f"Day {day} Part {i+1}: all codeNotes must be strings"
            assert isinstance(p.get('tryIt'), str) and len(p['tryIt']) > 15, f"Day {day} Part {i+1}: tryIt must be string > 15"

            check = p.get('check', {})
            assert len(check.get('question', '')) > 10, f"Day {day} Part {i+1}: check question too short"
            assert len(check.get('options', [])) == 4, f"Day {day} Part {i+1}: options must be 4"
            assert check.get('answer') == 0, f"Day {day} Part {i+1}: answer must be 0"
            assert len(check.get('why', '')) > 20, f"Day {day} Part {i+1}: why too short"

            # Execute code standalone
            code = p.get('code', '')
            proc = subprocess.run([sys.executable, '-'], input=code, capture_output=True, text=True, timeout=10)
            assert proc.returncode == 0, f"Day {day} Part {i+1} code failed:\n{proc.stderr}"
            assert len(proc.stdout.strip()) > 0, f"Day {day} Part {i+1} produced no stdout"
            print(f"  Part {i+1} ({p.get('title')[:32]}...): {words} words | Code OK ({len(proc.stdout.strip())} B)")

        print(f"Day {day} Total Words: {day_words} (>= 2,900 PASS)")
        assert day_words >= 2900, f"Day {day} total words {day_words} < 2900"
        grand_total_words += day_words

    print("\n================================================================================")
    print(f"GRAND TOTAL WORDS FOR BLOCK 11 (DAYS 51-55): {grand_total_words:,} WORDS")
    print(f"AVERAGE WORDS PER DAY:                      {grand_total_words / 5:.1f} WORDS/DAY")
    print("ALL 25 PARTS ACROSS ALL 5 DAYS MEET 100% OF INVARIANTS DETERMINISTICALLY!")
    print("================================================================================\n")

if __name__ == '__main__':
    audit_block11()
