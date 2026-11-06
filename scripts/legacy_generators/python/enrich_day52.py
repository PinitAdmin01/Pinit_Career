# scripts/enrich_day52.py
import json, subprocess

with open('scripts/react_day52_data.py', 'r', encoding='utf-8') as f:
    text = f.read()

import sys
sys.path.insert(0, 'scripts')
from react_day52_data import get_day52_data

d = get_day52_data()

# Part 1 enrichment (+280 words)
d['parts'][0]['say'].extend([
    "To understand the radical speed of V8 isolates, consider how operating systems handle process isolation. In a traditional Linux serverless environment, handling an incoming HTTP request requires the operating system kernel to allocate virtual memory pages, spin up a new POSIX process or container namespace, and load the entire Node.js executable into RAM. This process allocation involves hundreds of system calls and takes between 50 and 500 milliseconds even when optimized.",
    "V8 isolates eliminate process boundaries entirely. A V8 isolate is an independent instance of the Google V8 JavaScript runtime engine with its own private heap memory, call stack, and garbage collector. Thousands of isolates can run simultaneously inside a single shared operating system process without sharing memory or security context! When a request arrives at an edge server, spinning up an isolate requires only allocating a lightweight memory struct in heap—taking less than 1 millisecond.",
    "Furthermore, edge networks leverage Anycast BGP Routing. In Anycast networking, hundreds of edge data centers worldwide announce the exact same public IP address to global internet service providers. When a mobile user in Tokyo types your website URL, their local ISP automatically routes network packets along the shortest physical BGP path to the Tokyo point of presence. The user's request terminates at the edge in 12 milliseconds, completely bypassing cross-continental transit."
])

# Part 2 enrichment (+310 words)
d['parts'][1]['say'].extend([
    "In high-scale enterprise architectures, edge middleware serves as the primary engine for Zero-Flicker A/B Testing and Canary Feature Rollouts. In traditional client-side experimentation tools (such as Optimizely or Google Optimize), the user's browser must first download the original web page, parse client JavaScript, query an analytics API, and then violently mutate the DOM to display the experimental variant. This anti-pattern causes severe visual layout shifts (CLS penalties) and jarring screen flicker that damages conversion rates.",
    "Edge middleware executes experimentation routing before the client browser receives a single byte of HTML! When a request enters the edge, the middleware inspects the user's persistent anonymous cookie or generates a deterministic MurmurHash of their IP address. If the hash falls within the 10% canary bucket, the middleware silently rewrites the request to the experimental route segment: `NextResponse.rewrite('/canary' + pathname)`. The user receives server-rendered HTML tailored specifically for their bucket with zero client-side JavaScript overhead and 0.00 CLS layout shift.",
    "Equally vital is Edge Geo-Localization. The incoming `NextRequest` object provides geographic telemetry extracted directly from IP lookup tables at the edge router: `request.geo.country`, `request.geo.city`, and `request.geo.latitude`. Middleware can automatically rewrite European visitors to localized GDPR compliance layouts, Japanese visitors to localized Yen currency headers, and Latin American visitors to regional payment gateway proxies—delivering hyper-personalized web experiences at the speed of light."
])

# Part 3 enrichment (+320 words)
d['parts'][2]['say'].extend([
    "When designing cryptographic authentication for global edge infrastructure, engineering teams must carefully select the underlying digital signature algorithm. While traditional RSA-2048 algorithms are widely supported, RSA signatures are computationally expensive to verify and require large 2048-bit keys. In high-concurrency edge nodes processing tens of thousands of requests per second, verifying RSA signatures can saturate V8 CPU cores and inflate request latency.",
    "Modern edge systems standardize on Elliptic Curve Cryptography (ECC)—specifically ECDSA using the P-256 curve or Ed25519. Elliptic curve algorithms achieve equivalent or superior cryptographic security to RSA-2048 while utilizing tiny 256-bit (32-byte) keys! Because elliptic curve mathematics requires significantly fewer CPU clock cycles, the Web Cryptography API (`crypto.subtle`) verifies ECDSA signatures in less than 0.15 milliseconds inside edge isolates.",
    "Furthermore, enterprise identity architectures decouple key management from edge nodes through JSON Web Key Sets (JWKS). When your application authenticates users via OAuth2 or OpenID Connect providers (such as Auth0, Okta, or Clerk), the identity provider publishes a public JWKS endpoint. The edge middleware fetches and caches these public keys in edge isolate memory using a Stale-While-Revalidate caching policy. Even if an attacker attempts to forge credentials, the edge validates the cryptographic signature against the cached public key, instantly rejecting unauthorized requests at the perimeter without placing a single query on your core PostgreSQL databases."
])

# Part 4 enrichment (+310 words)
d['parts'][3]['say'].extend([
    "In distributed edge systems, managing rate limits across hundreds of globally distributed edge points of presence introduces fascinating synchronization challenges. If an attacker coordinates a botnet with 10,000 IP addresses distributed across 50 countries, each individual edge node might only observe a handful of requests per second, masking the distributed Denial of Service attack.",
    "To solve this, enterprise platforms deploy a Two-Tier Rate Limiting Architecture. Tier 1 executes in-memory inside the local edge isolate using our token bucket algorithm to instantaneously block single-IP brute-force flooding and high-frequency scrapers in sub-millisecond time. Tier 2 coordinates across edge nodes via low-latency serverless Redis datastores (such as Upstash Redis or Cloudflare KV) using sliding-window logs and atomic Lua scripts.",
    "When an incoming request passes the Tier 1 in-memory check, the edge asynchronously increments a distributed counter in the regional Redis edge cache over HTTP pipeline batches. If global traffic for an organization or API token breaches the global threshold, the edge immediately terminates further requests with an HTTP 429 response. In addition, during extreme traffic surges or origin outages, the edge can activate Graceful Degradation policies—serving stale cached HTML copies to legitimate users while completely dropping unauthenticated traffic—preserving 100% platform availability under duress."
])

# Part 5 enrichment (+390 words)
d['parts'][4]['say'].extend([
    "The deployment of edge middleware also transforms production observability and reliability engineering. In traditional architectures, monitoring request errors and latency requires application-level logging agents running on origin servers. If the origin server experiences network partitions or crashes entirely, monitoring agents are blinded, leaving on-call engineering teams in the dark.",
    "Because Edge Middleware sits directly on the edge network perimeter, it possesses an uncompromised global view of platform health. Edge nodes emit distributed OpenTelemetry traces capturing the exact network transit time, TLS handshake duration, middleware execution time, and origin response time for every single request worldwide. When an origin data center experiences degraded performance, edge telemetry detects the anomaly within seconds.",
    "Moreover, edge middleware enables Active-Active Multi-Region Failover. If the primary origin database in us-east-1 suffers a cloud outage, the edge middleware catches the origin timeout and automatically re-routes traffic to the secondary failover origin in us-west-2 or eu-central-1. The global user base experiences zero downtime and zero broken links.",
    "As we prepare to transition to Day 53—where we combine Edge Middleware with Partial Prerendering (PPR) and streaming server components—you now command the complete distributed networking foundation of modern full-stack engineering. You understand how to leverage V8 isolates, Web Crypto APIs, token bucket rate limiters, and edge request rewrites to build web systems that are geographically boundless, cryptographically secure, and blistering fast."
])

print("Checking Day 52 updated word counts:")
total_words = 0
for i, p in enumerate(d['parts']):
    wc = sum(len(s.split()) for s in p['say'])
    total_words += wc
    print(f"  Part {i+1}: {wc} words")
print(f"Total Day 52 Words: {total_words}")

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

with open('scripts/react_day52.json', 'w', encoding='utf-8') as f:
    json.dump(d, f, indent=2)
print("Saved scripts/react_day52.json successfully!")

out_lines = [
    "# scripts/react_day52_data.py",
    "import json",
    "",
    "def get_day52_data():",
    f"    return {repr(d)}",
    "",
    "if __name__ == '__main__':",
    "    data = get_day52_data()",
    "    total_words = 0",
    "    print(f\"Day {data['day']}: {data['title']}\")",
    "    for i, p in enumerate(data['parts']):",
    "        w = sum(len(s.split()) for s in p['say'])",
    "        total_words += w",
    "        print(f\"  Part {i+1}: {w} words\")",
    "    print(f\"Total Words: {total_words}\")"
]

with open('scripts/react_day52_data.py', 'w', encoding='utf-8') as f:
    f.write("\n".join(out_lines))
print("Saved scripts/react_day52_data.py successfully!")
