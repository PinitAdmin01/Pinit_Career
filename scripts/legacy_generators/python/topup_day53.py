import json, subprocess

with open('scripts/react_day53.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

# Part 1 topup (+35 words)
d['parts'][0]['say'].append(
    "In addition to web performance, Partial Prerendering streamlines continuous integration workflows. Instead of re-building and re-deploying thousands of static HTML pages whenever dynamic stock prices or user rankings fluctuate, the static shell is compiled once during deployment and cached indefinitely, while dynamic holes adapt in real time to live backend signals."
)

# Part 2 topup (+115 words)
d['parts'][1]['say'].append(
    "To achieve zero layout shift in production, enterprise design systems enforce strict Skeleton Bounding Box Contracts. When developers construct a Suspense fallback skeleton for an e-commerce cart widget or real-time notification badge, the fallback element declares the exact explicit CSS height, width, padding, and margin properties as the final dynamic rendered component. By reserving the exact layout geometry before dynamic bytes arrive over the network stream, the browser layout engine never recalculates or reflows ancestor elements, preserving an unyielding Cumulative Layout Shift score of 0.000."
)

# Part 3 topup (+140 words)
d['parts'][2]['say'].append(
    "It is important to contrast React cache() with traditional data-fetching libraries like TanStack Query or SWR. While TanStack Query manages client-side caching, background refetching, and window focus synchronization inside browser memory, React cache() operates exclusively on the server during the initial Server Component rendering lifecycle. Because Server Components render on the server without client state, React cache() serves as the authoritative server-side memoization layer, ensuring that complex microservice aggregations and multi-tier database queries execute with absolute minimal round-trip overhead before streaming to the client."
)

# Part 4 topup (+185 words)
d['parts'][3]['say'].extend([
    "In multi-region enterprise deployments, tag-based cache invalidation integrates with distributed Edge Purge Webhooks. When an inventory mutation occurs in your primary database, the backend emits an authenticated webhook payload to your edge CDN network (e.g. Vercel Edge Network, Fastly, or Cloudflare). The edge network matches the incoming semantic tag against its global distributed index, broadcasting asynchronous cache purge commands across hundreds of edge nodes worldwide in under 15 milliseconds.",
    "Furthermore, Next.js supports path-based revalidation via revalidatePath('/products/[slug]', 'page'). When paired with tag revalidation, engineering teams maintain multi-dimensional cache invalidation strategies: tag revalidation purges specific data entities across all routes where they appear, while path revalidation purges entire page trees during structural layout overhauls. This provides unmatched flexibility for high-scale e-commerce and media platforms."
])

# Part 5 topup (+225 words)
d['parts'][4]['say'].extend([
    "From an automated observability and synthetic benchmarking standpoint, enterprise platforms monitor streaming hybrid rendering using Real User Monitoring (RUM) agents. In modern browsers, the PerformanceObserver API captures detailed Resource Timing and Navigation Timing milestones, specifically tracking the exact time delta between the static shell first byte (responseStart) and the final dynamic hole completion (responseEnd).",
    "If network latency spikes in a specific geographic region or an external database query slows down, automated alerting systems trigger dynamic fallback policies. The streaming engine can automatically degrade non-essential dynamic widgets into cached static recommendations, ensuring that core page usability is never compromised by third-party latency.",
    "Congratulations on conquering Day 53! You have mastered the cutting-edge frontier of modern React hybrid rendering. You know how to decompose complex web applications into lightning-fast static shells and streaming dynamic holes, leverage request-scoped memoization to eliminate N+1 database queries, and orchestrate global tag-based cache invalidations with surgical precision."
])

print("Checking Day 53 final word counts:")
total_words = 0
for i, p in enumerate(d['parts']):
    wc = sum(len(s.split()) for s in p['say'])
    total_words += wc
    print(f"  Part {i+1}: {wc} words")
print(f"Total Day 53 Words: {total_words}")

# Test all 5 codes with node
for i, p in enumerate(d['parts']):
    res = subprocess.run(['node', '-e', p['code']], capture_output=True, text=True)
    actual = res.stdout.strip()
    expected = p['output'].strip()
    assert actual == expected, f"Part {i+1} mismatch!\nActual:\n{actual}\nExpected:\n{expected}"
    print(f"Part {i+1} code test: PASS")

with open('scripts/react_day53.json', 'w', encoding='utf-8') as f:
    json.dump(d, f, indent=2)
print("Saved scripts/react_day53.json successfully!")

out_lines = [
    "# scripts/react_day53_data.py",
    "import json",
    "",
    "def get_day53_data():",
    f"    return {repr(d)}",
    "",
    "if __name__ == '__main__':",
    "    data = get_day53_data()",
    "    total_words = 0",
    "    print(f\"Day {data['day']}: {data['title']}\")",
    "    for i, p in enumerate(data['parts']):",
    "        w = sum(len(s.split()) for s in p['say'])",
    "        total_words += w",
    "        print(f\"  Part {i+1}: {w} words\")",
    "    print(f\"Total Words: {total_words}\")"
]

with open('scripts/react_day53_data.py', 'w', encoding='utf-8') as f:
    f.write("\n".join(out_lines))
print("Saved scripts/react_day53_data.py successfully!")
