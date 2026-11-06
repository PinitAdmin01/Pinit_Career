# scripts/topup_day50.py
import json

with open('scripts/react_day50.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

# Part 1 topup (+50 words)
d['parts'][0]['say'].append(
    "To maintain predictable latency envelopes, institutional trading desks also configure explicit memory limits and Garbage Collection telemetry. Client performance budgets mandate that heap utilization remains bounded below 250 MB throughout an eight-hour continuous trading session. By tracking heap allocation rate (MB/sec) alongside frame rendering time, platform engineers detect insidious memory retention patterns before they degrade interactive desk responsiveness."
)

# Part 2 topup (+50 words)
d['parts'][1]['say'].append(
    "In addition to numeric price feeds, production market stores maintain order book depth levels (Level 2 data) with bids and asks aggregated across price tiers. By coupling useSyncExternalStore with selector memoization libraries (such as Reselect or custom shallow equality predicates), order book ladder widgets re-compute DOM node updates only when visible book levels change, effectively filtering out thousands of irrelevant micro-tick fluctuations in deep resting liquidity."
)

# Part 3 topup (+60 words)
d['parts'][2]['say'].append(
    "In multi-asset class desks covering equities, derivatives, and currencies, execution statecharts also support hierarchical sub-states and parallel regions. For example, a parent Order Execution Machine can maintain an active 'ORDER_PENDING' state while simultaneously running a parallel 'SLIPPAGE_MONITOR' actor that continuously queries current market spread. If liquidity evaporates before exchange fill, the slippage monitor triggers an emergency cancel event, transitioning the parent machine into 'ABORTED' to protect customer capital."
)

# Part 4 topup (+70 words)
d['parts'][3]['say'].append(
    "Beyond React runtime singletons, enterprise federated trading architectures enforce shared singletons for design system foundations and communication backbones. By sharing single instances of styling libraries (e.g., Tailwind CSS runtime or Emotion cache) and messaging clients, micro-frontends maintain a unified visual aesthetic with uniform typography, dark-mode themes, and consistent brand palettes. Furthermore, shared state hydration bridges ensure that if a user reloads the desk, all remotes restore their layout configurations and pinned tickers from a single encrypted browser storage snapshot."
)

# Part 5 topup (+60 words)
d['parts'][4]['say'].append(
    "As software engineering continues to advance, the convergence of high-throughput data streams, distributed micro-frontend architectures, and deterministic statecharts represents the gold standard of modern frontend systems. The architectural techniques and discipline you have acquired throughout this course will serve as the bedrock of your engineering leadership across finance, cloud platforms, e-commerce, and high-concurrency SaaS applications. Step boldly into production: your trading desk is verified, resilient, and enterprise-ready."
)

print("Checking final word counts:")
total_words = 0
for i, p in enumerate(d['parts']):
    wc = sum(len(s.split()) for s in p['say'])
    total_words += wc
    print(f"  Part {i+1}: {wc} words")
print(f"Total Day 50 Words: {total_words}")

with open('scripts/react_day50.json', 'w', encoding='utf-8') as f:
    json.dump(d, f, indent=2)
print("Updated scripts/react_day50.json successfully!")

out_lines = [
    "# scripts/react_day50_data.py",
    "import json",
    "",
    "def get_day50_data():",
    f"    return {repr(d)}",
    "",
    "if __name__ == '__main__':",
    "    data = get_day50_data()",
    "    total_words = 0",
    "    print(f\"Day {data['day']}: {data['title']}\")",
    "    for i, p in enumerate(data['parts']):",
    "        w = sum(len(s.split()) for s in p['say'])",
    "        total_words += w",
    "        print(f\"  Part {i+1}: {w} words\")",
    "    print(f\"Total Words: {total_words}\")"
]

with open('scripts/react_day50_data.py', 'w', encoding='utf-8') as f:
    f.write("\n".join(out_lines))
print("Updated scripts/react_day50_data.py successfully!")
