with open('scripts/branch_c/build_day58.py', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('Enterprise K8s Standard', 'Enterprise Kubernetes Standard')

with open('scripts/branch_c/build_day58.py', 'w', encoding='utf-8') as f:
    f.write(text)

with open('src/lib/data/lessonVisuals/ai/day-58.json', 'r', encoding='utf-8') as f:
    text2 = f.read()

text2 = text2.replace('Enterprise K8s Standard', 'Enterprise Kubernetes Standard')

with open('src/lib/data/lessonVisuals/ai/day-58.json', 'w', encoding='utf-8') as f:
    f.write(text2)

print("Replaced K8s with Kubernetes in Day 58!")
