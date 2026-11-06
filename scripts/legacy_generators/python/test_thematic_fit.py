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

import itertools

all_indices = set(range(len(courses)))
partitions = []

# Search for partitions where each branch has between 165 and 175 days
for r1 in range(3, 8):
    for c1 in itertools.combinations(range(len(courses)), r1):
        d1 = sum(courses[i][1] for i in c1)
        if not (165 <= d1 <= 175): continue
        s1 = set(c1)
        rem = all_indices - s1
        for r2 in range(3, 8):
            for c2 in itertools.combinations(rem, r2):
                d2 = sum(courses[i][1] for i in c2)
                if not (165 <= d2 <= 175): continue
                s2 = set(c2)
                s3 = rem - s2
                d3 = sum(courses[i][1] for i in s3)
                if 165 <= d3 <= 175:
                    p = tuple(sorted([tuple(sorted(s1)), tuple(sorted(s2)), tuple(sorted(s3))]))
                    if p not in partitions:
                        partitions.append(p)

print(f"Total partitions within +/- 5 days of 170: {len(partitions)}")

# Find partitions that have best thematic coherence
# Branch B: All Commerce courses (bcom_ops, bcom_ecom, bcom_mkt, bcom_dmkt, bcom_scrm, bcom_ait)
# Let's see: bcom courses total:
# ops (21) + ecom (29) + mkt (30) + dmkt (30) + scrm (30) + ait (30) = 170 DAYS!
print("\nWAIT! Look at Commerce courses:")
comm_courses = [c for c in courses if c[0].startswith('bcom') and c[0] != 'bcomAnaLongLessons.ts']
print("Sum of 6 BCom courses (ops, ecom, mkt, dmkt, scrm, ait):", sum(c[1] for c in comm_courses))
for c in comm_courses:
    print(f"  * {c[0]}: {c[1]}d")
