import sys, os
sys.stdout.reconfigure(encoding='utf-8')
sys.path.append(os.path.abspath('scripts/visuals'))
from iot_network_spec_m1 import DAYS_1_TO_15

print("=== Course 18: IoT Networking (iot_net) Block 2 (Days 6-10) Spec ===")
for d in DAYS_1_TO_15[5:10]:
    print(f"Day {d['day']}: {d['title']} | Block {d.get('blockNum')} | Stage {d.get('stageNum')}")
    print(f"  Spoken Goal: {d.get('spokenGoal')}")
    print(f"  Concept Invariant: {d.get('conceptInvariant')}")
    print(f"  Failure Mode: {d.get('failureMode')}")
    for q in d.get('quests', []):
        print(f"    - [{q.get('id')}] {q.get('title')}: {q.get('concept')}")
