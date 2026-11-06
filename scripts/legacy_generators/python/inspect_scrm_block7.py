# scripts/inspect_scrm_block7.py
import sys
sys.path.insert(0, '.')
import scripts.visuals.sales_crm_spec_m2_part1 as p1

for d in p1.DAYS_31_TO_45[:5]:
    print('=' * 60)
    print(f"Day {d['day']}: {d['title']}")
    print("Stage:", d.get('stageName'))
    print("Pedagogical Role:", d.get('pedagogicalRole'))
    print("Spoken Goal:", d.get('spokenGoal'))
    print("Concept Invariant:", d.get('conceptInvariant'))
    print("Failure Mode:", d.get('failureMode'))
    print("Quests:")
    for q in d.get('quests', []):
        print(f"  - [{q.get('type')}] {q.get('title')}")
