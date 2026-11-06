import os
import re

files = {
    'devops': 'src/lib/data/devopsWebLongLessons.ts',
    'react_long': 'src/lib/data/reactLongLessons.ts',
    'react_30': 'src/lib/data/react30DayData.ts',
    'node': 'src/lib/data/nodeWebLongLessons.ts',
    'iot_net_long': 'src/lib/data/iotNetLongLessons.ts',
    'iot_net_pilot': 'src/lib/data/iotNetworkPilotDays.ts',
    'iot_net_30': 'src/lib/data/iotNetwork30DayData.ts',
    'iot_sec_long': 'src/lib/data/iotSecLongLessons.ts',
    'iot_sec_pilot': 'src/lib/data/iotSecurityPilotDays.ts',
    'iot_edge_long': 'src/lib/data/iotEdgeLongLessons.ts',
    'iot_edge_pilot': 'src/lib/data/iotEdgeAiPilotDays.ts',
    'iot_emb_long': 'src/lib/data/iotEmbLongLessons.ts',
}

print("=== Course Inventory Audit ===")
for name, path in files.items():
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        days = sorted([int(m) for m in re.findall(r'["\']day["\']\s*:\s*(\d+)', content)])
        unique_days = sorted(list(set(days)))
        max_day = max(unique_days) if unique_days else 0
        print(f"{name:15} | Unique Days: {len(unique_days):2d} | Min: {min(unique_days) if unique_days else 0:2d} | Max: {max_day:2d}")
    else:
        print(f"{name:15} | FILE NOT FOUND: {path}")
