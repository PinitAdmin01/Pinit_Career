# scripts/print_scrm_syllabus.py
import sys
sys.path.insert(0, '.')
import scripts.visuals.sales_crm_spec_m2_part1 as p1
import scripts.visuals.sales_crm_spec_m2_part2 as p2

print("Part 1 days (31-45):", len(p1.DAYS_31_TO_45))
for d in p1.DAYS_31_TO_45:
    print(f"  Day {d['day']}: {d['title']}")

print("\nPart 2 days (46-60):", len(p2.DAYS_46_TO_60))
for d in p2.DAYS_46_TO_60:
    print(f"  Day {d['day']}: {d['title']}")
