import re

for filename in ['src/lib/data/iotNetwork30DayData.ts', 'src/lib/data/iotNetworkPilotDays.ts']:
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            text = f.read()
        print(f"=== {filename} ===")
        matches = re.findall(r'day:\s*(\d+)[^}]*?title:\s*[\'"]([^\'"]+)', text)
        for d, t in matches[:15]:
            print(f"  Day {d}: {t}")
    except Exception as e:
        print(f"Error reading {filename}: {e}")
