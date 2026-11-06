import os, glob, re

base_paths = {
    'Branch A': r'C:\Users\Admin\Desktop\projects\Present-Career-os\src\lib\data',
    'Branch B': r'C:\Users\Admin\Desktop\projects\Present-Career-os-commerce\src\lib\data',
    'Branch C': r'C:\Users\Admin\Desktop\projects\Present-Career-os-platform\src\lib\data'
}

treaty_courses = {
    'Branch A': {
        'designWebLongLessons.ts': (31, 60),
        'fullstackJsLongLessons.ts': (31, 60),
        'g3dLongLessons.ts': (31, 60),
        'distributedWebLongLessons.ts': (31, 60),
        'cyberWebLongLessons.ts': (31, 60),
    },
    'Branch B': {
        'bcomAnaLongLessons.ts': (6, 60),
        'bcomMktLongLessons.ts': (31, 60),
        'bcomDmktLongLessons.ts': (31, 60),
        'bcomEcomLongLessons.ts': (32, 60),
        'bcomScrmLongLessons.ts': (31, 60),
    },
    'Branch C': {
        'dsaWebLongLessons.ts': (38, 60),
        'aiWebLongLessons.ts': (31, 60),
        'promptPythonLongLessons.ts': (31, 60),
        'nlpPythonLongLessons.ts': (31, 60),
        'bcomAitLongLessons.ts': (31, 60),
    }
}

total_treaty_days = 0
completed_treaty_days = 0

print("=== ACCURATE TREATY AUDIT BY ASSIGNED BRANCH WORKTREE ===")
for branch, courses in treaty_courses.items():
    b_path = base_paths[branch]
    b_done = 0
    b_tot = 0
    print(f"\n{branch} ({b_path}):")
    for fname, (start_d, end_d) in courses.items():
        needed = end_d - start_d + 1
        b_tot += needed
        fpath = os.path.join(b_path, fname)
        actual_written = 0
        if os.path.exists(fpath):
            with open(fpath, 'r', encoding='utf-8', errors='ignore') as fp:
                c = fp.read()
            days = set(int(d) for d in re.findall(r'"day":\s*(\d+)', c))
            for d in range(start_d, end_d + 1):
                if d in days:
                    actual_written += 1
        b_done += actual_written
        pct = (actual_written / needed) * 100
        print(f"  {fname:<30}: {actual_written:>2}/{needed:>2} days done ({pct:>5.1f}%) [Target: Days {start_d}-{end_d}]")
    b_pct = (b_done / b_tot) * 100
    print(f"  --> {branch} Subtotal: {b_done}/{b_tot} ({b_pct:.1f}% Complete, {b_tot - b_done} days remaining)")
    total_treaty_days += b_tot
    completed_treaty_days += b_done

tot_pct = (completed_treaty_days / total_treaty_days) * 100
rem_days = total_treaty_days - completed_treaty_days
rem_pct = 100 - tot_pct

print("\n=======================================================")
print(f"TREATY OVERALL PROGRESS (Active 467-Day Scope):")
print(f"  Completed: {completed_treaty_days} / {total_treaty_days} days ({tot_pct:.2f}%)")
print(f"  Remaining: {rem_days} / {total_treaty_days} days ({rem_pct:.2f}%)")
print("=======================================================")
