# scripts/audit_day_file.py
import sys
import json
import subprocess

def audit(json_path):
    with open(json_path, 'r', encoding='utf-8') as f:
        d = json.load(f)

    print(f"=== Auditing {json_path} ===")
    print(f"Day: {d.get('day')} | Title: {d.get('title')}")
    assert d.get('minutes') == 38, f"Minutes must be 38, got {d.get('minutes')}"
    assert len(d.get('parts', [])) == 5, f"Must have 5 parts, got {len(d.get('parts', []))}"
    assert len(d.get('summary', [])) >= 4, "Summary must have >= 4 items"
    pstep = d.get('projectStep', {})
    assert 'title' in pstep and len(pstep['title']) > 10, "projectStep must have title"
    assert len(pstep.get('steps', [])) >= 4, "projectStep must have >= 4 steps"
    assert 'desc' not in pstep, "projectStep must NOT have 'desc'"

    total_words = 0
    for i, p in enumerate(d['parts']):
        say = p.get('say', [])
        assert isinstance(say, list) and len(say) >= 4, f"Part {i+1}: say must have >= 4 paragraphs"
        words = sum(len(para.split()) for para in say)
        total_words += words
        print(f"  Part {i+1} ({p.get('title')[:35]}...): {words} words | {len(say)} paras")
        assert words >= 580, f"Part {i+1} has only {words} words, must be >= 580!"
        assert len(p.get('example', '')) > 15, f"Part {i+1}: example too short"
        assert len(p.get('codeNotes', [])) >= 3, f"Part {i+1}: codeNotes must have >= 3 items"
        assert all(isinstance(cn, str) for cn in p['codeNotes']), f"Part {i+1}: all codeNotes must be strings"
        assert isinstance(p.get('tryIt'), str) and len(p['tryIt']) > 15, f"Part {i+1}: tryIt must be string > 15"
        check = p.get('check', {})
        assert len(check.get('question', '')) > 10, f"Part {i+1}: check question too short"
        assert len(check.get('options', [])) == 4, f"Part {i+1}: options must be 4"
        assert check.get('answer') == 0, f"Part {i+1}: answer must be 0"
        assert len(check.get('why', '')) > 20, f"Part {i+1}: why too short"

        # Test code execution
        code = p.get('code', '')
        proc = subprocess.run([sys.executable, '-'], input=code, capture_output=True, text=True, timeout=10)
        assert proc.returncode == 0, f"Part {i+1} code execution failed:\n{proc.stderr}"
        assert len(proc.stdout.strip()) > 0, f"Part {i+1} produced no stdout"
        print(f"    -> Code executed standalone in Python successfully! Output length: {len(proc.stdout.strip())} chars")

    print(f"Total Day Words: {total_words} (Required: >= 2,900)")
    assert total_words >= 2900, f"Total day words {total_words} < 2900"
    print("ALL AUDIT INVARIANTS PASSED PERFECTLY!\n")

if __name__ == '__main__':
    audit(sys.argv[1])
