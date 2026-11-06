# scripts/audit_block10_days.py
import json
import subprocess

def audit():
    days = [46, 47, 48, 49, 50]
    total_block_words = 0

    for d_num in days:
        with open(f"scripts/iot_sec_day{d_num}.json", "r", encoding="utf-8") as f:
            d = json.load(f)
        title = d["title"]
        print(f"=== Auditing Day {d_num}: {title} ===")
        assert d["day"] == d_num, f"Day number mismatch {d['day']} vs {d_num}"
        assert d["minutes"] == 38, f"Minutes must be 38, got {d['minutes']}"
        assert len(d["parts"]) == 5, f"Parts must be 5, got {len(d['parts'])}"
        assert len(d["summary"]) >= 4, f"Summary items must be >= 4"
        assert "desc" not in d["projectStep"], f"projectStep must not contain desc"
        assert len(d["projectStep"]["steps"]) >= 4, f"projectStep steps must be >= 4"

        day_words = 0
        for p_idx, p in enumerate(d["parts"]):
            words = sum(len(s.split()) for s in p["say"])
            day_words += words
            assert words >= 580, f"Day {d_num} Part {p_idx+1} has {words} words (< 580)"
            assert len(p["codeNotes"]) >= 3, f"Day {d_num} Part {p_idx+1} codeNotes < 3"
            assert isinstance(p["tryIt"], str) and len(p["tryIt"]) > 15, f"tryIt must be string > 15"
            assert len(p["check"]["options"]) == 4, f"check options must be 4"
            assert p["check"]["answer"] == 0, f"check answer must be 0"
            assert len(p["check"]["why"]) > 20, f"check why must be > 20"

            # Test code execution
            res = subprocess.run(["python", "-c", p["code"]], capture_output=True, text=True)
            assert res.returncode == 0, f"Day {d_num} Part {p_idx+1} code execution failed:\n{res.stderr}"

        assert day_words >= 2900, f"Day {d_num} total words {day_words} < 2900"
        total_block_words += day_words
        print(f"Day {d_num} PASSED all invariant checks! Total words: {day_words}")

    print(f"\nALL DAYS 46-50 100% VALIDATED AGAINST ALL SPECIFICATION INVARIANTS!")
    print(f"Total Block 10 Word Count: {total_block_words} words across 5 days (mean: {total_block_words/5:.1f} wpd)")

if __name__ == "__main__":
    audit()
