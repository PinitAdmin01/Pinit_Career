import sys
sys.path.insert(0, 'scripts')
from react_day48_data import get_day48_data

d = get_day48_data()

# Add to Part 4
d['parts'][3]['say'].append(
    "In addition to runtime network retries and CSS encapsulation, production micro-frontend hosts implement dynamic health-check ping telemetry. Before mounting an external remote into a critical transaction surface (such as a checkout payment iframe or biometric authentication module), the host dispatches a lightweight HTTP HEAD request to the remote origin. If the CDN returns high latency or packet loss, the host seamlessly pre-empts the load and switches to a local cached static component, ensuring the user experience is never degraded."
)

# Add to Part 5
d['parts'][4]['say'].extend([
    "From an automated continuous deployment and delivery perspective, Module Federation provides unprecedented agility for high-velocity software engineering teams. In a traditional monolithic frontend release cycle, coordinating deployments across disparate time zones requires extensive release trains, manual regression smoke tests, and tense on-call rotations. In a federated micro-frontend platform, every single remote application deploys completely independently on its own release schedule.",
    "When Team Navigation improves their search autocomplete algorithm, they build and deploy their new remoteEntry.js bundle to their S3 bucket or edge CDN endpoint in less than two minutes. The Host Shell does not re-build, does not re-test, and does not re-deploy! The moment the new bundle lands on the CDN edge, any user refreshing the page or navigating to a new route seamlessly pulls down the latest code. If a critical regression is detected, reverting the remote takes seconds because the previous version's immutable hashed chunks are still cached on the CDN.",
    "This architectural independence eliminates deployment bottlenecks and allows massive global organizations to innovate at the speed of nimble independent startups. As we advance to Day 49 to explore Custom React Reconcilers, keep this principle in mind: by mastering modular, decoupled boundaries across both the network and the virtual DOM runtime, you engineer web applications that scale effortlessly across thousands of developers and millions of global users."
])

print("Part 4 words:", sum(len(s.split()) for s in d['parts'][3]['say']))
print("Part 5 words:", sum(len(s.split()) for s in d['parts'][4]['say']))

out_lines = [
    "# scripts/react_day48_data.py",
    "import json",
    "",
    "def get_day48_data():",
    f"    return {repr(d)}",
    "",
    "if __name__ == '__main__':",
    "    data = get_day48_data()",
    "    total_words = 0",
    "    print(f\"Day {data['day']}: {data['title']}\")",
    "    for i, p in enumerate(data['parts']):",
    "        w = sum(len(s.split()) for s in p['say'])",
    "        total_words += w",
    "        print(f\"  Part {i+1}: {w} words\")",
    "    print(f\"Total Words: {total_words}\")"
]

with open('scripts/react_day48_data.py', 'w', encoding='utf-8') as f:
    f.write("\n".join(out_lines))
print("Saved updated react_day48_data.py!")
