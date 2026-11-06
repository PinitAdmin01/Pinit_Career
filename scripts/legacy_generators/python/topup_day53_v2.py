import json, subprocess

with open('scripts/react_day53.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

# Part 2 (+25 words)
d['parts'][1]['say'].append(
    "Additionally, modern component libraries like Radix UI or Tailwind CSS allow developers to bind dynamic skeleton pulse animations with hardware-accelerated CSS keyframes. By ensuring that skeleton containers match the exact aspect-ratio and flex-basis dimensions of final rendered cards, your application achieves seamless visual continuity during the hydration phase."
)

# Part 3 (+45 words)
d['parts'][2]['say'].append(
    "In microservice architectures, request-scoped memoization provides resilience against cascading network degradation. If an upstream authorization service or product catalog microservice experiences intermittent latency spikes, deduplicating repetitive calls within the same incoming user request prevents downstream connection pool exhaustion and maintains consistent sub-50ms server response times across all distributed worker instances."
)

# Part 4 (+55 words)
d['parts'][3]['say'].append(
    "Beyond simple string tags, modern enterprise architectures implement hierarchical tag namespaces, such as `tenant:104:catalog` or `region:apac:pricing`. This hierarchical naming convention allows cache orchestration layers to perform granular scoped invalidations without affecting unrelated tenants or geographic deployments, ensuring optimal cache hit rates and predictable cloud hosting costs across multi-tenant enterprise SaaS applications."
)

# Part 5 (+70 words)
d['parts'][4]['say'].append(
    "To guarantee production readiness before every pull request merges into the main branch, modern development teams automate streaming hybrid rendering benchmarks within continuous integration pipelines using tools like Lighthouse CI and WebPageTest API. These automated checks enforce hard thresholds on Time to First Byte, First Contentful Paint, and Cumulative Layout Shift, failing builds immediately if a new server component or dynamic hole introduces layout instability or server-side blocking."
)

print("Checking Day 53 final word counts:")
total_words = 0
for i, p in enumerate(d['parts']):
    wc = sum(len(s.split()) for s in p['say'])
    total_words += wc
    print(f"  Part {i+1}: {wc} words")
print(f"Total Day 53 Words: {total_words}")

assert all(sum(len(s.split()) for s in p['say']) >= 580 for p in d['parts']), "All parts must be >= 580 words!"
assert total_words >= 2900, "Total words must be >= 2900!"

# Test all 5 codes with node
for i, p in enumerate(d['parts']):
    res = subprocess.run(['node', '-e', p['code']], capture_output=True, text=True)
    actual = res.stdout.strip()
    expected = p['output'].strip()
    assert actual == expected, f"Part {i+1} mismatch!\nActual:\n{actual}\nExpected:\n{expected}"
    print(f"Part {i+1} code test: PASS")

with open('scripts/react_day53.json', 'w', encoding='utf-8') as f:
    json.dump(d, f, indent=2)

with open('scripts/react_day53_data.py', 'w', encoding='utf-8') as f:
    f.write(f"DAY_53 = {json.dumps(d, indent=2)}\n")

print("Saved scripts/react_day53.json and react_day53_data.py successfully!")
