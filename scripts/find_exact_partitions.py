courses = [
    ('devopsWebLongLessons.ts', 15, 'Tech', 'DevOps & CI/CD'),
    ('bcomOpsLongLessons.ts', 21, 'Commerce', 'Operations & Supply Chain'),
    ('bcomEcomLongLessons.ts', 29, 'Commerce', 'E-Commerce'),
    ('bcomAnaLongLessons.ts', 55, 'Commerce/Data', 'Business Analytics'),
    ('designWebLongLessons.ts', 30, 'Tech', 'Design Systems'),
    ('dsaWebLongLessons.ts', 30, 'Tech', 'DSA Optimizations'),
    ('cyberWebLongLessons.ts', 30, 'Tech', 'Cybersecurity'),
    ('distributedWebLongLessons.ts', 30, 'Tech', 'Distributed Systems'),
    ('aiWebLongLessons.ts', 30, 'Tech', 'AI Engineering'),
    ('fullstackJsLongLessons.ts', 30, 'Tech', 'Fullstack JS'),
    ('g3dLongLessons.ts', 30, 'Tech', '3D Graphics'),
    ('promptPythonLongLessons.ts', 30, 'AI', 'Prompt Literacy'),
    ('nlpPythonLongLessons.ts', 30, 'AI', 'NLP'),
    ('bcomMktLongLessons.ts', 30, 'Commerce', 'Marketing & Branding'),
    ('bcomDmktLongLessons.ts', 30, 'Commerce', 'Digital Marketing'),
    ('bcomScrmLongLessons.ts', 30, 'Commerce', 'Sales & CRM'),
    ('bcomAitLongLessons.ts', 30, 'Commerce', 'AI Digital Transformation'),
]

total = sum(c[1] for c in courses)
print(f"Total days: {total}, Target per branch: {total // 3}")

import itertools

subsets_170 = []
for r in range(1, len(courses)):
    for combo in itertools.combinations(range(len(courses)), r):
        s = sum(courses[i][1] for i in combo)
        if s == 170:
            subsets_170.append(set(combo))

print(f"Subsets summing to 170: {len(subsets_170)}")

valid_partitions = []
all_indices = set(range(len(courses)))

for i, s1 in enumerate(subsets_170):
    for j, s2 in enumerate(subsets_170):
        if j <= i: continue
        if s1.isdisjoint(s2):
            s3 = all_indices - s1 - s2
            if sum(courses[idx][1] for idx in s3) == 170:
                valid_partitions.append((s1, s2, s3))

print(f"Valid 3-way exact partitions found: {len(valid_partitions)}")

# Score partitions by thematic domain clustering:
# - Branch B should have maximum Commerce courses
# - Branch A should have maximum Tech/Web courses
# - Branch C should have remaining AI/Data courses
scored_partitions = []
for p in valid_partitions:
    s1, s2, s3 = p
    # Try all permutations of assigning s1, s2, s3 to Branch A, B, C
    for b_a, b_b, b_c in itertools.permutations([s1, s2, s3]):
        # Calculate domain purity score
        # Branch B: want Commerce (bcom)
        b_comm = sum(1 for i in b_b if 'bcom' in courses[i][0])
        # Branch A: want Tech (devops, distributed, cyber, 3d, design, dsa)
        a_tech = sum(1 for i in b_a if 'Web' in courses[i][0] or 'devops' in courses[i][0] or 'g3d' in courses[i][0])
        # Branch C: want AI / Python / Data
        c_ai = sum(1 for i in b_c if 'Python' in courses[i][0] or 'Ana' in courses[i][0] or 'ai' in courses[i][0].lower())
        total_score = b_comm * 10 + a_tech * 8 + c_ai * 6
        scored_partitions.append((total_score, b_a, b_b, b_c))

scored_partitions.sort(key=lambda x: x[0], reverse=True)

best_score, best_a, best_b, best_c = scored_partitions[0]
print(f"\n=======================================================")
print(f"BEST ARCHITECTURAL THEMATIC PARTITION (Score: {best_score})")
print(f"=======================================================")

for name, s in [('Branch A (Tech, Systems & Core Web)', best_a),
                ('Branch B (Flagship Commerce & Management)', best_b),
                ('Branch C (Data, AI & Business Intelligence)', best_c)]:
    days = sum(courses[i][1] for i in s)
    print(f"\n### {name} — TOTAL: {days} DAYS:")
    for i in sorted(list(s)):
        c_file, c_days, c_cat, c_title = courses[i]
        print(f"  * {c_title:<32} | {c_file:<30} | {c_days:>2} Days")
