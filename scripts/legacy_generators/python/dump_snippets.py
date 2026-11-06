import json
import data_devops_day36
import data_devops_day37
import data_devops_day38
import data_devops_day39
import data_devops_day40

snippets = []
for mod in [data_devops_day36, data_devops_day37, data_devops_day38, data_devops_day39, data_devops_day40]:
    day = getattr(mod, f'DAY_{mod.__name__.split("_")[-1][3:]}')
    for i, p in enumerate(day['parts']):
        snippets.append({
            'day': day['day'],
            'part': i + 1,
            'code': p['code'],
            'expectedOutput': p['output']
        })

with open('scripts/devops_block8_snippets.json', 'w', encoding='utf-8') as f:
    json.dump(snippets, f, indent=2)

print(f'Exported {len(snippets)} snippets from Days 36-40')
