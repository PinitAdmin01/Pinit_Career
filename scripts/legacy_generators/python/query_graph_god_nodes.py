import json, sys
sys.stdout.reconfigure(encoding='utf-8')

print("Loading graph.json...")
with open('graphify-out/graph.json', 'r', encoding='utf-8') as f:
    graph = json.load(f)

nodes = graph.get('nodes', [])
edges = graph.get('links', [])
print(f"Graph loaded: {len(nodes)} nodes, {len(edges)} links.")

# Let's find god nodes / highest degree nodes
degree = {}
for e in edges:
    src = e.get('source')
    tgt = e.get('target')
    degree[src] = degree.get(src, 0) + 1
    degree[tgt] = degree.get(tgt, 0) + 1

top_nodes = sorted(degree.items(), key=lambda x: x[1], reverse=True)[:25]
print("\nTop 25 Architecture Hub Nodes (God Nodes):")
for node_id, deg in top_nodes:
    # find node label or type
    print(f"  {node_id:45s} (connections: {deg})")
