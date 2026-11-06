with open('graphify-out/GRAPH_REPORT.md', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

print("GRAPH_REPORT.md length:", len(text))
# Print table of contents or first 50 lines
lines = text.split('\n')
for l in lines[:60]:
    print(l)
