with open("src/lib/visuals/gate.ts", "r", encoding="utf-8") as f:
    text = f.read()

for template in ['table', 'bars', 'tree-graph', 'compare', 'cells']:
    idx = text.find(f"template === '{template}'")
    if idx == -1:
        idx = text.find(f'template === "{template}"')
    print(f"--- Template {template} ---")
    if idx != -1:
        print(text[idx:idx+400])
    else:
        print("Not found directly by strict equality")
