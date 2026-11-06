import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/visuals/cloud-masterclass-spec.ts', 'r', encoding='utf-8') as f:
    text = f.read()

start = text.find('BLOCK 7: Advanced Kubernetes')
end = text.find('BLOCK 8:', start)
if start != -1:
    print(text[start:end if end != -1 else start+10000])
else:
    print("Could not find BLOCK 7")
