import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/build_day45_file.py', 'r', encoding='utf-8') as f:
    text = f.read()

add_p1 = '''    "To appreciate the scale of this enterprise architecture, consider the multi-tier caching topology that powers our hybrid catalog. In our production design, caching operates across three coordinated tiers: Tier 1 is the Edge CDN cache, storing static HTML shells globally across 300 points of presence; Tier 2 is the Server Component Layout Cache, which memoizes expensive backend database queries and markdown compilation in Redis; and Tier 3 is the Client-Side Router Cache, which stores previously visited route segments in browser memory. When a product mutation occurs, Server Actions coordinate cache invalidation across all three tiers simultaneously via tagged cache keys, guaranteeing instantaneous global data consistency.",
    "Furthermore, this hybrid architecture resolves the longstanding tension between developer productivity and end-user performance. In legacy micro-frontend setups, teams were forced to configure complex iframe sandboxes or Module Federation orchestrators that duplicated runtime libraries. With React Server Components, the server acts as the unified integration hub. Individual domain teams can author independent catalog widgets, pricing modules, and inventory checkers using standard React components, while the compiler packages them into a cohesive, zero-bloat runtime stream.",
'''

add_p2 = '''    "In high-traffic enterprise architectures, managing database connection pools in server-rendered environments is a notorious operational challenge. If every incoming HTTP request opened a dedicated PostgreSQL connection, serverless functions and edge workers would quickly exhaust database connection limits during traffic spikes. Our Server Component Catalog Engine integrates with centralized connection poolers (such as PgBouncer or AWS RDS Proxy). Because Server Components execute directly on the server, database queries share persistent pooled connections, avoiding connection handshake overhead and scaling effortlessly to tens of thousands of concurrent requests.",
    "Additionally, this server-first architecture delivers immaculate Search Engine Optimization (SEO). Alongside the visual product layout, the server engine dynamically injects structured JSON-LD metadata (`<script type='application/ld+json'>`) directly into the document head. Search engine crawlers (Google, Bing) instantly parse the product's price, availability status, model numbers, and technical specifications from the very first HTML chunk, guaranteeing rich snippet search results and maximum organic discoverability.",
'''

add_p3 = '''    "To optimize network efficiency even further, our catalog integrates automated Client Module Preloading. As soon as the server identifies that the page contains the InteractiveAddToCartButton island, it emits a `<link rel='modulepreload' href='/chunks/AddToCart.client.js'>` hint in the document head. While the user is observing the initial HTML shell, the browser's preload engine downloads and compiles the client component's JavaScript code in the background. By the time the user's thumb moves toward the button, the client component is already warm in memory, ready for instant hydration.",
    "Moreover, the out-of-order reviews replacement coordinates with modern CSS containment (`contain: layout size`). By declaring layout containment on the Suspense fallback wrapper, the browser's rendering engine reserves exact dimensional boundaries for the reviews container. When the `$RC` script swaps the fallback spinner with live reviews, neighboring page elements do not shift or recalculate positions, achieving a Cumulative Layout Shift (CLS) score of exactly 0.000.",
'''

add_p4 = '''    "To guarantee strict correctness during high-volume flash sales where thousands of shoppers attempt to purchase the final 10 units simultaneously, our Server Action implements Optimistic Concurrency Control (OCC). Instead of relying on naive database reads, the action executes an atomic conditional update: `UPDATE products SET stock = stock - :qty, version = version + 1 WHERE id = :id AND stock >= :qty AND version = :expectedVersion`. If another user purchased the stock in that microsecond, the database returns zero affected rows. The Server Action catches this condition immediately, rejects the mutation, and triggers the client-side rollback handler.",
    "To protect customers against duplicate billing during flaky mobile network handoffs (such as switching from a home Wi-Fi network to cellular 5G while walking out the door), each purchase form submission includes a cryptographically unique UUID idempotency key. If the client re-submits the form due to a connection retry, the server identifies the existing transaction key, avoids double-charging, and returns the confirmed order status smoothly.",
'''

add_p5 = '''    "In enterprise production operations, certifying application quality requires continuous automated telemetry and Real User Monitoring (RUM). By instrumenting our catalog with Core Web Vitals reporting hooks, real user metrics (LCP, INP, CLS) are continuously streamed to analytics dashboards. Alerting policies notify on-call engineering teams if 95th-percentile TTFB exceeds 100ms or if client hydration tasks exceed 16.6ms, ensuring that production performance never degrades over time.",
    "As we conclude Month 2, Block 9 and look forward to the remaining advanced engineering curriculum in PinIT Career OS, you have mastered the foundational core of modern full-stack web engineering. You have transformed from an engineer who merely builds user interfaces into a systems architect who understands memory allocations, network packets, streaming runtimes, and distributed state consistency. Carry these architectural principles forward as you engineer the future of the web.",
'''

def insert_before_closing_bracket(content, array_name, addition):
    target = f"{array_name} = ["
    idx = content.find(target)
    if idx == -1:
        raise Exception(f"Target {target} not found")
    idx_close = content.find("\n]", idx)
    return content[:idx_close] + ",\n" + addition.rstrip(",\n") + content[idx_close:]

new_text = insert_before_closing_bracket(text, "p1_say", add_p1)
new_text = insert_before_closing_bracket(new_text, "p2_say", add_p2)
new_text = insert_before_closing_bracket(new_text, "p3_say", add_p3)
new_text = insert_before_closing_bracket(new_text, "p4_say", add_p4)
new_text = insert_before_closing_bracket(new_text, "p5_say", add_p5)

with open('scripts/build_day45_file.py', 'w', encoding='utf-8') as f:
    f.write(new_text)

print("Topped up Day 45 successfully!")
