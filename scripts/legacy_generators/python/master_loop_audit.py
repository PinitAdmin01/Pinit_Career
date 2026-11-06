import os
import re
import json
import glob

SYNTHETIC_BOOSTER_PATTERNS = [
    r'heterogeneous distributed invariant',
    r'distributed invariant',
    r'production invariant',
    r'telemetry invariant',
    r'stripe/uber at peak scale',
    r'uber scale',
    r'canonical operational envelope',
    r'hyper-scale telemetry',
    r'enterprise-grade telemetry',
    r'mechanical symmetry'
]

def run_fast_linear_audit():
    files = sorted(glob.glob('src/lib/data/*LongLessons.ts'))
    print(f"Scanning {len(files)} curriculum files...")
    
    total_days_audited = 0
    all_findings = []
    course_stats = {}
    
    for f in files:
        fname = os.path.basename(f)
        if fname == 'longLessons.ts':
            continue
            
        with open(f, 'r', encoding='utf-8') as fp:
            content = fp.read()
            
        # Split linearly by day definition
        sections = re.split(r'(?=\b(?:day|\"day\")\s*:\s*\d+)', content)
        course_name = fname.replace('LongLessons.ts', '')
        course_days = 0
        course_issues = []
        
        for sec in sections[1:]:
            m_day = re.search(r'\b(?:day|\"day\")\s*:\s*(\d+)', sec)
            if not m_day:
                continue
            day_num = int(m_day.group(1))
            course_days += 1
            total_days_audited += 1
            
            # 1. Check for synthetic booster filler
            for pat in SYNTHETIC_BOOSTER_PATTERNS:
                matches = re.finditer(pat, sec, re.IGNORECASE)
                for m in matches:
                    snippet = sec[max(0, m.start()-50):min(len(sec), m.end()+50)].replace('\n', ' ')
                    issue = {
                        'course': course_name,
                        'day': day_num,
                        'category': 'SYNTHETIC_BOOSTER',
                        'title': f"Artificial Corporate Filler '{m.group(0)}'",
                        'what': f"Artificial enterprise jargon inserted into curriculum: '{m.group(0)}'.",
                        'why': "Injected by automated word-count booster scripts to hit the >=600 words/part gate during urgency.",
                        'where': f"src/lib/data/{fname}, Day {day_num}",
                        'evidence': snippet.strip(),
                        'how': "Remove the corporate buzzword and replace with plain, pedagogical language."
                    }
                    course_issues.append(issue)
                    all_findings.append(issue)
                    
            # 2. Check for prerequisite traps in early days
            if day_num <= 5:
                # Python functions/returns
                if 'python' in course_name.lower() and 'dsa' not in course_name.lower() and 'ai' not in course_name.lower():
                    if 'def ' in sec and day_num <= 3:
                        issue = {
                            'course': course_name,
                            'day': day_num,
                            'category': 'PREREQUISITE_TRAP',
                            'title': "Function Definition in Absolute Beginner Lesson",
                            'what': f"Uses 'def' statement on Day {day_num} before functions are introduced on Day 16.",
                            'why': "Author used full production function templates instead of top-to-bottom script execution.",
                            'where': f"src/lib/data/{fname}, Day {day_num}",
                            'evidence': "def statement found in code snippet",
                            'how': "Convert snippet to linear script statements (e.g. variable assignments, simple calculations, print)."
                        }
                        course_issues.append(issue)
                        all_findings.append(issue)

                # Java Virtual Threads on Day 1
                if 'java' in course_name.lower() and day_num <= 2:
                    if 'Virtual Threads' in sec:
                        issue = {
                            'course': course_name,
                            'day': day_num,
                            'category': 'PREREQUISITE_TRAP',
                            'title': "Virtual Threads Concurrency on Day 1",
                            'what': "Introduces Java 21 Virtual Threads & Loom concurrency on Day 1.",
                            'why': "Author wanted to highlight modern Java 21 features upfront without respecting beginner scaffolding.",
                            'where': f"src/lib/data/{fname}, Day {day_num}",
                            'evidence': "Virtual Threads in JVM Architecture Day 1",
                            'how': "Move Virtual Threads to Concurrency module (Day 25+); teach simple main() and variables on Day 1."
                        }
                        course_issues.append(issue)
                        all_findings.append(issue)

        course_stats[course_name] = {
            'days': course_days,
            'issues_count': len(course_issues)
        }
        print(f"[{course_name:25}] {course_days:2} days audited | {len(course_issues):2} issues found")

    print(f"\n========================================================")
    print(f"TOTAL DAYS AUDITED: {total_days_audited}")
    print(f"TOTAL FORENSIC ISSUES FOUND: {len(all_findings)}")
    print(f"========================================================")
    
    return {
        'total_days': total_days_audited,
        'total_issues': len(all_findings),
        'course_stats': course_stats,
        'findings': all_findings
    }

if __name__ == '__main__':
    res = run_fast_linear_audit()
    with open('scripts/audit_findings_fast.json', 'w', encoding='utf-8') as f:
        json.dump(res, f, indent=2)
    print("Saved findings to scripts/audit_findings_fast.json")
