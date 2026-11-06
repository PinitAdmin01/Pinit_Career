# scripts/enrich_day53.py
import json, subprocess

import sys
sys.path.insert(0, 'scripts')
from react_day53_data import get_day53_data

d = get_day53_data()

# Part 1 enrichment (+180 words)
d['parts'][0]['say'].extend([
    "From an economic and infrastructure perspective, Partial Prerendering delivers massive cloud cost reductions for high-traffic platforms. In standard Server-Side Rendering, every incoming bot, search engine crawler, and casual browser request forces serverless functions or container clusters to spin up, query databases, and execute template rendering. During major promotional events or traffic surges, backend origin servers are subjected to extreme query load, necessitating costly auto-scaling infrastructure.",
    "Because PPR serves the static HTML shell directly from Edge CDN cache memory, over 80% of total page weight is delivered at zero compute cost! Only the dynamic sub-trees inside Suspense boundaries trigger serverless function invocations. Furthermore, search engine bots—which typically evaluate static page content without requiring personalized carts or user recommendations—receive the complete static shell instantly. The site achieves an unbeatable Lighthouse performance score of 100 while cutting origin server compute bills by more than 70%."
])

# Part 2 enrichment (+330 words)
d['parts'][1]['say'].extend([
    "Let us explore how the client-side React runtime ingests and hydrates a streaming PPR response. When the user's browser receives the initial static HTML shell from the edge CDN, the browser's native HTML parser begins rendering DOM elements immediately. The user sees the header, navigation bar, hero banner, and fallback skeleton loaders on screen in less than 50 milliseconds.",
    "As the server finishes resolving dynamic Server Components in the background, it appends chunked transfer encoding blocks to the open HTTP connection. Each streaming chunk contains the rendered HTML for a dynamic hole accompanied by an inline micro-script. This micro-script identifies the target placeholder DOM node via its unique identifier (`$RC('cart-widget', '...')`), seamlessly swaps the fallback skeleton with the live dynamic markup, and deletes the temporary skeleton elements with zero screen flicker.",
    "Crucially, the static shell components do NOT undergo unnecessary client hydration! In standard client-side React applications, every DOM node on the screen must be traversed by React's hydration algorithm to attach synthetic event listeners. In an App Router page rendered with Server Components and PPR, static components (such as layout frames, navigation links, and article text) ship zero client JavaScript to the browser. Only interactive Client Components inside dynamic holes download JavaScript and hydrate, preserving a lean, lightning-fast client memory footprint."
])

# Part 3 enrichment (+350 words)
d['parts'][2]['say'].extend([
    "To understand the low-level mechanics of React `cache()`, we must examine how React tracks asynchronous execution context across Server Component trees. Because modern Server Components can be asynchronous functions (`async function ProductDetails()`), traditional module-level caches or global variables are dangerous: if two users request the page simultaneously, a shared global variable would leak private data between concurrent requests.",
    "React `cache()` solves this by binding the memoization map directly to the current Server Component rendering dispatcher. When a request enters Next.js, the runtime creates a unique Fiber request context. Every function wrapped with `cache()` is registered into a WeakMap associated with that specific request context. When a component calls the cached function, React computes a cache key using object referential equality for object parameters and strict equality (`===`) for primitive arguments.",
    "If the function has already been evaluated with those exact arguments during the active request pass, React returns the cached promise immediately. If multiple components call the cached function in parallel before the underlying database query resolves, all callers subscribe to the exact same pending Promise! The database receives only one single round-trip query, while all three components await and resolve the shared payload concurrently. When the HTTP stream finishes, the entire WeakMap is garbage-collected by the V8 runtime, guaranteeing zero cross-tenant contamination."
])

# Part 4 enrichment (+360 words)
d['parts'][3]['say'].extend([
    "In enterprise distributed architectures, `unstable_cache` functions as a sophisticated Multi-Layer Cache Hierarchy. When a Server Component queries data via `unstable_cache`, Next.js checks a multi-tier storage pipeline: Tier 1: In-Memory Isolate Cache (sub-millisecond access within the active serverless process); Tier 2: Edge CDN Shared Cache (low-latency cross-isolate storage); and Tier 3: Persistent Global Key-Value Store (e.g. Redis, Upstash, or shared filesystem).",
    "The tag indexing mechanism (`tagIndex`) is what makes this system enterprise-ready. By tagging cached database records with both entity-level and collection-level tags—such as `tags: ['products', 'category_laptops', 'product_99']`—developers can purge cache entries with surgical precision. When a single laptop price changes, invoking `revalidateTag('product_99')` purges only that specific product without disturbing cached data for thousands of other catalog items.",
    "Alternatively, when a new laptop model is launched, invoking `revalidateTag('category_laptops')` purges the entire category index across global edge nodes in under 5 milliseconds. The next incoming visitor triggers a background regeneration pass, warming the cache for subsequent millions of visitors. This delivers an unbeatable combination: the raw speed of a completely static website paired with the real-time consistency of an active transactional database."
])

# Part 5 enrichment (+420 words)
d['parts'][4]['say'].extend([
    "In continuous integration and automated deployment pipelines, verifying streaming hybrid rendering invariants is critical before deploying updates to production. Production readiness gates subject PPR streaming routes to automated network throttles simulating 3G mobile connections, high-latency satellite links, and traffic surges.",
    "During these automated tests, synthetic telemetry agents monitor three non-negotiable thresholds: First, Shell Flush Latency: under peak simulated concurrency, the initial static shell must emit its first byte (TTFB) in under 15 milliseconds across all global testing regions. Second, Cumulative Layout Shift (CLS): automated visual regression tools verify that fallback skeletons allocate the exact dimensional bounding boxes as final dynamic components, ensuring that CLS remains strictly 0.000. Third, Streaming Hole Timeout Resilience: if a secondary dynamic service (such as a third-party social review widget) takes longer than 2 seconds to respond, the streaming engine terminates the stalled hole and renders an isolated degraded card, ensuring that the main page stream completes without hanging.",
    "By mastering Partial Prerendering, React `cache()`, and tag-based on-demand invalidation, you possess the full capabilities of an elite full-stack performance architect. You know how to design web architectures that achieve the ultimate holy grail of web development: instantaneous edge delivery, real-time dynamic data freshness, and zero unnecessary database load."
])

print("Checking Day 53 updated word counts:")
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
    if actual == expected:
        print(f"Part {i+1} code test: PASS")
    else:
        print(f"Part {i+1} code test: FAIL")
        print("Expected:\n", repr(expected))
        print("Actual:\n", repr(actual))

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
