import json
import re

with open('tests/fixtures/practice_solutions.json', 'r') as f:
    sols = json.load(f)

# check react-basics
with open('src/lib/data/react30DayData.ts', 'r', encoding='utf-8') as f:
    txt = f.read()

# Let's check day 21
print("Current sol day 21 exam:", repr(sols.get('react-basics-exam-day-21')))
print("Current sol day 21 assign:", repr(sols.get('react-basics-assign-day-21')))
