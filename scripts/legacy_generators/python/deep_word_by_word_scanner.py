import glob
import os
import re
import json

BOOSTER_PATTERNS = [
    (r'heterogeneous distributed invariants?', 'core system consistency rules'),
    (r'distributed invariants?', 'system consistency rules'),
    (r'production invariants?', 'core reliability rules'),
    (r'telemetry invariants?', 'monitoring checks'),
    (r'architectural invariants?', 'design rules'),
    (r'security invariants?', 'security checks'),
    (r'operational invariants?', 'operating rules'),
    (r'canonical operational envelope', 'standard operating range'),
    (r'stripe/uber at peak scale', 'large-scale applications'),
    (r'hyper-scale telemetry', 'system monitoring'),
    (r'mechanical symmetry', 'consistent structure'),
    (r'suboptimal unvalidated implementation', 'an incomplete implementation'),
    (r'optimal production invariant', 'the recommended approach'),
]

DAY_RE = re.compile(r'(?:\"day\"|\'day\'|\bday)\s*:\s*(\d+)\b')
SAY_ITEM_RE = re.compile(r'\"(?:[^\"\\]|\\.)*\"|\'(?:[^\'\\]|\\.)*\'')

def scan_all_long_lessons():
    files = sorted([f for f in glob.glob('src/lib/data/*LongLessons.ts') if not f.endswith('longLessons.ts')])
    print(f"Scanning {len(files)} LongLesson files word-by-word (O(N) linear pass)...")

    summary_rows = []
    all_issues = []
    total_days_all = 0
    total_words_all = 0

    for fpath in files:
        fname = os.path.basename(fpath)
        course = fname.replace('LongLessons.ts', '')
        with open(fpath, 'r', encoding='utf-8') as fp:
            content = fp.read()

        words_in_file = content.count(' ') + content.count('\n')
        total_words_all += words_in_file

        matches = list(DAY_RE.finditer(content))
        days_found = []
        file_issues = []

        for idx, m_day in enumerate(matches):
            day_num = int(m_day.group(1))
            if day_num < 1 or day_num > 100:
                continue
            start_pos = m_day.start()
            end_pos = matches[idx + 1].start() if idx + 1 < len(matches) else len(content)
            chunk = content[start_pos:end_pos]
            days_found.append(day_num)

            # 1. Check synthetic booster phrases word-by-word
            for pat, replacement in BOOSTER_PATTERNS:
                for m in re.finditer(pat, chunk, re.IGNORECASE):
                    ctx = chunk[max(0, m.start() - 45):min(len(chunk), m.end() + 45)].replace('\n', ' ')
                    issue = {
                        'course': course,
                        'file': fname,
                        'day': day_num,
                        'category': 'SYNTHETIC_JARGON',
                        'what': f"Synthetic urgency jargon '{m.group(0)}' found in Day {day_num}.",
                        'why': "Inserted by automated word-count booster scripts during urgency.",
                        'where': f"src/lib/data/{fname} (Day {day_num})",
                        'how': f"Replace '{m.group(0)}' with clear pedagogical phrasing ('{replacement}').",
                        'evidence': ctx.strip()
                    }
                    file_issues.append(issue)
                    all_issues.append(issue)

            # 2. Check Check/MCQ answer vs answerIndex
            if 'answerIndex' in chunk and not re.search(r'(?:\"answer\"|\'answer\'|\banswer)\s*:', chunk):
                issue = {
                    'course': course,
                    'file': fname,
                    'day': day_num,
                    'category': 'MCQ_SCHEMA_MISMATCH',
                    'what': f"Day {day_num} uses 'answerIndex' without 'answer' in check object.",
                    'why': "courseTests.ts only read p.check?.answer ?? 0, ignoring answerIndex.",
                    'where': f"src/lib/data/{fname} (Day {day_num})",
                    'how': "Support both answer and answerIndex in courseTests.ts and normalize check objects.",
                    'evidence': "answerIndex used in LongLessonCheck"
                }
                file_issues.append(issue)
                all_issues.append(issue)

            # 3. Check early-day prerequisite traps
            if course == 'javaBasics' and day_num == 1 and re.search(r'Virtual Thread|Project Loom|AutoCloseable', chunk, re.IGNORECASE):
                issue = {
                    'course': course,
                    'file': fname,
                    'day': day_num,
                    'category': 'PREREQUISITE_TRAP',
                    'what': "Day 1 Java introduces Java 21 Virtual Threads, Project Loom, and AutoCloseable before basic variables.",
                    'why': "Advanced JVM concurrency concepts were placed into Day 1 during urgency.",
                    'where': f"src/lib/data/{fname} (Day 1)",
                    'how': "Replace Day 1 Virtual Threads/AutoCloseable jargon with beginner-friendly Java main(), print, and basic types.",
                    'evidence': "Virtual Threads / Project Loom in Day 1"
                }
                file_issues.append(issue)
                all_issues.append(issue)

        unique_days = sorted(list(set(days_found)))
        total_days_all += len(unique_days)
        summary_rows.append({
            'course': course,
            'file': fname,
            'days_count': len(unique_days),
            'min_day': min(unique_days) if unique_days else 0,
            'max_day': max(unique_days) if unique_days else 0,
            'words': words_in_file,
            'issues': len(file_issues)
        })

    print(f"Total LongLesson files: {len(files)}")
    print(f"Total Unique Course Days Scanned: {total_days_all}")
    print(f"Total Words Scanned: {total_words_all:,}")
    print(f"Total Issues Detected in LongLessons: {len(all_issues)}")
    for r in summary_rows:
        print(f"  {r['course']:<22} | days={r['days_count']:<3} ({r['min_day']}..{r['max_day']}) | words={r['words']:<10,} | issues={r['issues']}")

    with open('scripts/full_scan_results.json', 'w', encoding='utf-8') as out_f:
        json.dump({
            'total_files': len(files),
            'total_days': total_days_all,
            'total_words': total_words_all,
            'total_issues': len(all_issues),
            'courses': summary_rows,
            'issues': all_issues
        }, out_f, indent=2)

if __name__ == '__main__':
    scan_all_long_lessons()
