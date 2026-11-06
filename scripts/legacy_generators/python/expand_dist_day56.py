# scripts/expand_dist_day56.py
import re

content = open("scripts/create_dist_day56_data.py", "r", encoding="utf-8").read()

p1_extra = """    "Sixth, Anycast BGP Route Flapping & Multi-Pathing Protection: While BGP Anycast provides automated geographic traffic steering, internet routing is not without operational hazards. If a network transit provider experiences intermittent link instability, BGP routes can oscillate rapidly—a phenomenon known as Route Flapping. In stateful protocols like TCP, if a client's packets suddenly shift mid-connection from the Frankfurt PoP to the London PoP, the London PoP will reject the packets with TCP RST because it lacks the client's TCP socket state! To prevent connection resets, modern Anycast architectures deploy Equal-Cost Multi-Path (ECMP) routing paired with Consistent Hashing at the network layer, ensuring that established TCP flows remain anchored to their originating PoP even during transient routing fluctuations.",
"""

p2_extra = """    "In addition to request collapsing, advanced edge caching architectures utilize Cache Purge Protocols and Surrogate Keys (Tag-Based Invalidation). In massive e-commerce catalogs or news sites containing millions of cached URLs, invalidating content URL-by-URL using exact string matching is hopelessly inefficient. Modern CDNs allow origin servers to attach `Surrogate-Key` or `Cache-Tag` HTTP response headers (e.g., `Surrogate-Key: product-9812 category-electronics`). When an inventory update occurs at the origin, the application issues an instantaneous API purge call for tag `product-9812`: the edge CDN invalidates all five thousand cached variants across all global PoPs within 150 milliseconds!",
    "Furthermore, edge proxies implement Dynamic Content Compression algorithms (such as Brotli and Zstandard) and HTTP/3 QUIC connection multiplexing. By terminating the TLS 1.3 cryptographic handshake directly at the edge PoP, the client completes the initial connection in a single round-trip time (1-RTT) or zero round-trip time (0-RTT resumption) to local edge hardware, eliminating the multi-round-trip TCP and TLS penalties across transoceanic distances.",
"""

p3_extra = """    "Beyond V8 Isolates, modern edge platforms increasingly deploy WebAssembly (Wasm) Micro-Runtimes (such as Wasmtime, Wasmer, or Lucet). WebAssembly provides a portable, low-level binary code format that allows developers to author ultra-performant edge workers in systems languages like Rust, C++, or Go, rather than solely JavaScript or TypeScript. WebAssembly binaries are ahead-of-time (AOT) compiled into native machine code directly on edge servers.",
    "This architecture delivers CPU-intensive processing at the edge—such as real-time cryptographic image watermarking, dynamic JWT signature verification, payload decryption, and machine learning inference via ONNX runtimes—with raw near-native speed. Crucially, WebAssembly's capability-based security model ensures that untrusted edge code has zero access to host system calls, sockets, or filesystems unless explicitly granted by the host runtime, delivering fortress-grade security alongside microsecond cold starts.",
"""

p4_extra = """    "To address state consistency challenges, modern edge architectures also implement Durable Objects and Edge Coordination Primitives. While simple Key-Value stores work brilliantly for read-heavy static datasets, collaborative applications (such as real-time multiplayer games, collaborative document editing, or live bidding auctions) require strongly consistent state coordinates. Durable Objects (pioneered by Cloudflare Workers) combine V8 isolate compute with local persistent storage on a single, globally coordinated edge node.",
    "Under the Durable Object model, an actor model guarantees that all requests for a specific coordination coordinate (e.g., a specific document ID or chat room) are routed to exactly one active memory instance in the world. This active actor maintains in-memory state with zero concurrency race conditions, writing changes to transactional SQLite databases backed by local NVMe disks, bridging the gap between edge responsiveness and ACID transactional consistency.",
"""

p5_extra = """    "Fifth, Edge Security & DDoS Deflection at Layer 3, 4, and 7: Because edge networks operate hundreds of high-capacity PoPs directly at Internet Exchange Points with tens of terabits of transit capacity, edge networks serve as the planetary shield against Distributed Denial of Service (DDoS) attacks. When a massive multi-terabit volumetric botnet launches an SYN flood or UDP reflection attack, BGP Anycast naturally scatters the attack volume across forty global PoPs, diluting the attack force. Automated eBPF/XDP kernel packet filters at each edge node drop malicious packets in nanoseconds before they reach user applications.",
    "Sixth, Sustainable Edge Cloud Economics & Serverless Efficiency: Traditional data centers run thousands of idle server instances twenty-four hours a day, burning electricity and cloud budgets even during dead of night traffic lulls. Serverless edge isolates invert cloud economics by operating on pure pay-per-execution models: edge workers consume CPU cycles and memory strictly during the five to fifteen milliseconds required to process a request, scaling dynamically from zero to millions of requests with zero idle carbon footprint.",
"""

lines = content

# Inject p1_extra before "Consider the everyday physical analogy of an international postal delivery courier service"
lines = lines.replace(
    '    "Consider the everyday physical analogy of an international postal delivery courier service',
    f'{p1_extra}    "Consider the everyday physical analogy of an international postal delivery courier service'
)

# Inject p2_extra before "Consider the everyday physical analogy of a neighborhood library"
lines = lines.replace(
    '    "Consider the everyday physical analogy of a neighborhood library',
    f'{p2_extra}    "Consider the everyday physical analogy of a neighborhood library'
)

# Inject p3_extra before "Consider the everyday physical analogy of an apartment building"
lines = lines.replace(
    '    "Consider the everyday physical analogy of an apartment building',
    f'{p3_extra}    "Consider the everyday physical analogy of an apartment building'
)

# Inject p4_extra before "Consider the everyday physical analogy of daily morning newspapers"
lines = lines.replace(
    '    "Consider the everyday physical analogy of daily morning newspapers',
    f'{p4_extra}    "Consider the everyday physical analogy of daily morning newspapers'
)

# Inject p5_extra before "Consider the final physical analogy of an international satellite telecommunications constellation"
lines = lines.replace(
    '    "Consider the final physical analogy of an international satellite telecommunications constellation',
    f'{p5_extra}    "Consider the final physical analogy of an international satellite telecommunications constellation'
)

open("scripts/create_dist_day56_data.py", "w", encoding="utf-8").write(lines)
print("Updated scripts/create_dist_day56_data.py with expansions.")
