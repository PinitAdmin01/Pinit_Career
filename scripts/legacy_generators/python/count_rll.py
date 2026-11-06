import re

txt = open('src/lib/data/reactLongLessons.ts', encoding='utf-8').read()
matches = re.findall(r'["\']?day["\']?:\s*(\d+)', txt)
days = [int(m) for m in matches]
print("Total day matches in reactLongLessons:", len(days))
print("Unique days:", len(set(days)), "Min:", min(days), "Max:", max(days))
