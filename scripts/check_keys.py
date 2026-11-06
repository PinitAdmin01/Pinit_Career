import data_devops_day36
import data_devops_day37
import data_devops_day38
import data_devops_day39
import data_devops_day40

for d in [data_devops_day36.DAY_36, data_devops_day37.DAY_37, data_devops_day38.DAY_38, data_devops_day39.DAY_39, data_devops_day40.DAY_40]:
    print(f'Day {d["day"]} keys: {list(d.keys())}')
    if 'summary' not in d:
        print(f'  WARNING: Day {d["day"]} missing summary')
    if 'projectStep' not in d:
        print(f'  WARNING: Day {d["day"]} missing projectStep')
