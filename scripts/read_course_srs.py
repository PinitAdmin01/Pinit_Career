import re

with open('docs/visuals/PINIT_36_COURSES_MASTERCLASS_SRS_500P.md', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

def extract_course(cname):
    pattern = rf'(###\s+Course\s+\d+:\s+\[{cname}\].*?)(?=###\s+Course\s+\d+:|\Z)'
    m = re.search(pattern, text, re.DOTALL)
    if m:
        return m.group(1)
    return "Not found"

c31 = extract_course("course-ai-digital-transformation")
print("=== COURSE 31 SRS ===")
print(c31[:2000])

c37 = extract_course("course-nlp")
print("\n=== COURSE 37 SRS ===")
print(c37[:2000])
