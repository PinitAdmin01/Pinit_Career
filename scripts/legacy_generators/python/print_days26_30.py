import sys, os
sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, os.path.abspath('.'))
import scripts.visuals.iot_security_spec_m1_rest as m

for d in m.DAYS_16_TO_30:
    if d['day'] >= 26:
        print(f"Day {d['day']}: {d['title']}")
        print(f"  Pedagogical Role: {d.get('pedagogicalRole')}")
        print(f"  Stage: {d.get('stageName')}")
        print(f"  SpokenGoal: {d.get('spokenGoal')[:150]}...")
