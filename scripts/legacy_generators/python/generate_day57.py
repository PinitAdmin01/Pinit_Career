import json, subprocess

p1_say = [
    "Welcome to Day 57 of Full-Stack React Web Development: Industrial Architecture Case Study 2: Global E-Commerce Streaming Architecture & Partial Prerendering. In our second industrial case study, we examine the systems architecture behind world-class e-commerce platforms—such as Amazon, Shopify, Nike, and Target—during peak viral shopping events like Black Friday, Cyber Monday, and high-heat sneaker drops.",
    "During peak events, global retail platforms experience traffic spikes exceeding 500,000 requests per second. If thousands of shoppers rush to product detail pages and hit a centralized database directly, database connection pools exhaust in seconds, application servers crash under memory pressure, and checkout flows freeze, resulting in millions of dollars of lost revenue per minute.",
    "The central architectural principle for surviving 500,000 requests per second is Origin Shielding and Asymmetric Route Decomposition. E-commerce platforms strictly separate high-traffic, mostly static browsing experiences (product catalogs, search results, category pages) from personalized, transactional mutation funnels (cart mutation, checkout, payment processing).",
    "Browsing traffic is absorbed almost entirely by a multi-tiered global Edge CDN network running on hundreds of Points of Presence (PoPs) worldwide. By configuring aggressive stale-while-revalidate caching headers and edge request collapsing, 99.2% of incoming requests are satisfied directly at the edge without generating a single byte of origin database traffic. The origin server receives only a tiny, manageable trickle of 4,000 requests per second.",
    "In Part 1, we implement our `simulateOriginShield` validator. This model simulates a 500,000 request per second Black Friday thundering herd, verifies edge absorption rates, and ensures that forwarded origin traffic remains safely below origin database connection thresholds.",
    "Let us examine how edge shielding protects origin infrastructure during massive traffic spikes. Notice how our simulator calculates absorption rates and verifies that the origin status remains protected under extreme load."
]

p1_code = """function simulateOriginShield(totalRequests, edgeCacheHitRate) {
  const edgeAbsorbed = Math.floor(totalRequests * edgeCacheHitRate);
  const originForwarded = totalRequests - edgeAbsorbed;
  const originCapacity = 5000;
  const isHealthy = originForwarded <= originCapacity;

  return {
    totalRequests,
    edgeAbsorbed,
    originForwarded,
    originCapacity,
    status: isHealthy ? 'ORIGIN_PROTECTED' : 'THUNDERING_HERD_CRASH'
  };
}

const sim = simulateOriginShield(500000, 0.992);
console.log('Total Requests:', sim.totalRequests + ' req/s');
console.log('Edge Absorbed:', sim.edgeAbsorbed + ' req/s');
console.log('Origin Forwarded:', sim.originForwarded + ' req/s');
console.log('Origin Health:', sim.status);"""

p2_say = [
    "While edge caching shields the origin, e-commerce product pages cannot be 100% static. Shoppers require real-time stock levels (e.g. 'Only 3 left in stock!'), localized currency pricing, personalized coupon discounts, and dynamic recommendation carousels. In legacy architectures, teams had to choose between two unacceptable extremes: fully static pages that displayed stale inventory, or fully server-rendered pages that introduced 800ms TTFB latency and crashed under load.",
    "React 19 Partial Prerendering (PPR) solves this dilemma through Asynchronous Streaming Hole Demarcation. During deployment, Next.js compiles the static shell—including the global header, brand logo, navigation menus, product images, titles, and descriptions—into an immutable static HTML snapshot cached globally across 300+ edge nodes.",
    "When a user opens a product page, the static shell is delivered in under 15 milliseconds, achieving an instantaneous First Contentful Paint (FCP). The user immediately sees product photos, reads customer reviews, and perceives a blazing-fast shopping experience. Meanwhile, embedded Suspense boundaries demarcate dynamic holes: real-time inventory counts and personalized recommendations stream concurrently across the open HTTP connection.",
    "To eliminate visual disruption and maintain a pristine Cumulative Layout Shift (CLS) of 0.000, the platform strictly enforces Skeleton Bounding Box Contracts. Fallback skeleton containers declare the exact CSS aspect ratio and layout height as the final rendered inventory badge, ensuring zero page reflow when dynamic stock bytes arrive.",
    "Furthermore, dynamic holes resolve asynchronously in parallel. If an external recommendation machine learning microservice takes 55 milliseconds to respond, it streams independently without blocking the real-time inventory badge, which finishes rendering in 35 milliseconds.",
    "Let us explore our `PPRStreamingEngine`. Observe how it emits the static shell with sub-20ms TTFB and progressively streams dynamic holes without main-thread blocking or layout shifts."
]

p2_code = """class PPRStreamingEngine {
  constructor() {
    this.stream = [];
  }

  emitShell(shellHtml) {
    this.stream.push({ type: 'STATIC_SHELL', ttfbMs: 14, content: shellHtml });
  }

  streamHole(holeId, delayMs, payload) {
    this.stream.push({ type: 'DYNAMIC_HOLE', holeId, delayMs, payload });
  }

  getMetrics() {
    const ttfb = this.stream[0].ttfbMs;
    const totalTime = Math.max(...this.stream.map(s => s.delayMs || s.ttfbMs));
    return { ttfb, totalTime, chunks: this.stream.length };
  }
}

const ppr = new PPRStreamingEngine();
ppr.emitShell('<header>Nike Store</header><main><div id="prod-info">Air Max 90 - $140</div><div id="hole-inventory">Loading Stock...</div></main>');
ppr.streamHole('hole-inventory', 35, { stock: 14, inStock: true });
ppr.streamHole('hole-recommendations', 55, { items: ['Socks', 'Shoe Cleaner'] });

const metrics = ppr.getMetrics();
console.log('Static Shell TTFB:', metrics.ttfb + 'ms');
console.log('Total Streaming Duration:', metrics.totalTime + 'ms');
console.log('Stream Chunks:', metrics.chunks);"""

p3_say = [
    "In high-scale e-commerce, the most difficult cache invalidation problem is Surgical Granular Eviction. Consider an online retailer with 10 million active product SKUs. When an inventory mutation occurs (e.g. Size 10 of a sneaker sells out), purging the entire product catalog cache would trigger an immediate thundering herd, overwhelming backend databases with millions of re-rendering requests.",
    "Conversely, relying on fixed Time-to-Live (TTL) expiration (e.g. 10 minutes) means shoppers might spend 10 minutes attempting to purchase sold-out inventory, resulting in disastrous cart checkout failures, chargebacks, and frustrated customer complaints.",
    "Enterprise platforms solve this with Hierarchical Tag-Based Edge Invalidation. When a product page is cached at the edge, the server tags the cache entry with multi-dimensional semantic identifiers: brand tags (`brand:nike`), category tags (`cat:footwear`), and exact item tags (`sku:9921`).",
    "When a stock mutation occurs, the warehouse inventory microservice fires an authenticated webhook executing `revalidateTag('sku:9921')`. The edge CDN purges only the single cached page associated with that specific SKU in under 15 milliseconds. The remaining 9,999,999 cached products remain cached globally, maintaining a 99.4% cache hit ratio while completely abolishing stale inventory states.",
    "Let us examine how to implement a `CacheTagMesh`. Notice how our tag mesh associates cached routes with semantic tag arrays and purges targeted entries in constant time without disturbing unrelated cached product pages."
]

p3_code = """class CacheTagMesh {
  constructor() {
    this.cache = new Map();
  }

  set(key, val, tags) {
    this.cache.set(key, { val, tags });
  }

  invalidateTag(targetTag) {
    let purged = 0;
    for (const [key, entry] of this.cache.entries()) {
      if (entry.tags.includes(targetTag)) {
        this.cache.delete(key);
        purged++;
      }
    }
    return purged;
  }

  size() {
    return this.cache.size;
  }
}

const mesh = new CacheTagMesh();
mesh.set('/products/air-max-90', { title: 'Air Max 90' }, ['brand:nike', 'cat:footwear', 'sku:9921']);
mesh.set('/products/pegasus-40', { title: 'Pegasus 40' }, ['brand:nike', 'cat:footwear', 'sku:8814']);
mesh.set('/products/hoodie-club', { title: 'Club Hoodie' }, ['brand:nike', 'cat:apparel', 'sku:1102']);

const initialCount = mesh.size();
const purgedCount = mesh.invalidateTag('sku:9921');
const remainingCount = mesh.size();

console.log('Initial Cached Pages:', initialCount);
console.log('Purged Pages for SKU 9921:', purgedCount);
console.log('Remaining Cached Pages:', remainingCount);"""

p4_say = [
    "During viral flash sales, pricing rules and promotional discounts change dynamically based on time windows, user loyalty tiers, and cart coupon codes. For example, a retailer might offer a 15% site-wide Black Friday discount, while awarding an exclusive 30% discount to Platinum loyalty members on select premium items.",
    "If every price calculation required a server round-trip, users interacting with quantity steppers or coupon input boxes would experience noticeable interface lag. In Part 4, we examine how client-side promotional rule engines evaluate pricing hierarchies in sub-microsecond time using pure, sandboxed JavaScript logic.",
    "Our `resolveFlashSalePrice` engine iterates over active promotion rules, filters discounts by the user's authenticated loyalty tier, computes effective discounted prices, and formats exact savings metrics. By coupling client-side pricing evaluation with Server-Driven UI expression tokens, the e-commerce client dynamically displays personalized discount banners without modifying client source code.",
    "Furthermore, financial calculations in e-commerce must avoid IEEE 754 floating point rounding errors (e.g. `0.1 + 0.2 = 0.30000000000000004`). In production, price engines compute values in integer cents or use deterministic decimal rounders (`Number(val.toFixed(2))`), guaranteeing that order totals match invoice line items down to the exact penny.",
    "Let us explore the implementation of our flash sale pricing resolver. Observe how it evaluates loyalty tier restrictions, selects optimal discount percentages, and computes exact customer savings in real time."
]

p4_code = """function resolveFlashSalePrice(basePrice, discounts, userTier) {
  let effectivePrice = basePrice;
  let activeDiscountLabel = 'NONE';

  for (const disc of discounts) {
    if (disc.tier && disc.tier !== userTier) continue;
    const discounted = basePrice * (1 - disc.percent);
    if (discounted < effectivePrice) {
      effectivePrice = discounted;
      activeDiscountLabel = disc.label;
    }
  }

  return {
    basePrice,
    effectivePrice: Number(effectivePrice.toFixed(2)),
    savings: Number((basePrice - effectivePrice).toFixed(2)),
    activeDiscountLabel
  };
}

const discounts = [
  { label: 'BLACK_FRIDAY_GENERAL', percent: 0.15 },
  { label: 'VIP_PLATINUM_DROP', percent: 0.30, tier: 'PLATINUM' }
];

const p1 = resolveFlashSalePrice(200.0, discounts, 'REGULAR');
const p2 = resolveFlashSalePrice(200.0, discounts, 'PLATINUM');

console.log('Regular Promo Price: $' + p1.effectivePrice);
console.log('Regular Promo Applied:', p1.activeDiscountLabel);
console.log('VIP Promo Price: $' + p2.effectivePrice);
console.log('VIP Savings: $' + p2.savings);"""

p5_say = [
    "In the concluding phase of Day 57, we examine real-world e-commerce outages and implement our E-Commerce Production Resilience Certification Suite. On July 16, 2018, Amazon launched its annual Prime Day sale. Within minutes of kickoff, Amazon's homepage collapsed, displaying the infamous 'Dogs of Amazon' error page for hours.",
    "Forensic post-mortems revealed that an internal DynamoDB database service failed under an unexpected surge of read requests. Because certain homepage widgets lacked circuit breakers and fallback caching tiers, the database failure cascaded across dependent microservices, taking down navigation headers, search, and checkout. The outage cost Amazon an estimated \$100 million in lost sales and triggered massive brand reputation fallout.",
    "Modern enterprise platforms prevent cascading failures through Strict Service Level Agreements (SLAs) and Automated Resilience Gates. Our `auditECommerceResilience` suite programmatically audits five critical operational signals before certifying e-commerce infrastructure for production traffic.",
    "First, Edge Cache Hit Rate must meet or exceed 99.0%: ensuring origin databases are shielded from thundering herds. Second, Static Shell TTFB must not exceed 20.0 milliseconds: guaranteeing instant perceived page loads. Third, Dynamic Streaming Duration must finish within 80.0 milliseconds: delivering live inventory badges before user interest drifts. Fourth, Cumulative Layout Shift must be exactly 0.000: preventing accidental mis-clicks during checkout. Fifth, Thundering Herd Spike must be false: verifying that edge collapsed forwarding functions as intended.",
    "When all five criteria are satisfied, the platform is officially certified as `GRADE A+ CERTIFIED ECOMMERCE`. Congratulations on mastering Day 57! You have acquired the architectural knowledge needed to build, scale, and defend global retail web systems under extreme peak loads."
]

p5_code = """function auditECommerceResilience(metrics) {
  const targets = {
    edgeCacheHitRate: 0.99,
    staticShellTtfbMs: 20.0,
    dynamicStreamMs: 80.0,
    clsScore: 0.000,
    thunderingHerdSpike: false
  };

  const certified = (
    metrics.edgeCacheHitRate >= targets.edgeCacheHitRate &&
    metrics.staticShellTtfbMs <= targets.staticShellTtfbMs &&
    metrics.dynamicStreamMs <= targets.dynamicStreamMs &&
    metrics.clsScore === targets.clsScore &&
    metrics.thunderingHerdSpike === targets.thunderingHerdSpike
  );

  return {
    certified,
    slaStatus: certified ? 'GRADE A+ CERTIFIED ECOMMERCE' : 'SLA_BREACH',
    metrics
  };
}

const audit = auditECommerceResilience({
  edgeCacheHitRate: 0.994,
  staticShellTtfbMs: 14.5,
  dynamicStreamMs: 48.0,
  clsScore: 0.000,
  thunderingHerdSpike: false
});

console.log('Audit Certification:', audit.slaStatus);
console.log('Platform Certified:', audit.certified);
console.log('Edge Cache Hit Rate:', (audit.metrics.edgeCacheHitRate * 100).toFixed(1) + '%');
console.log('Static Shell TTFB:', audit.metrics.staticShellTtfbMs + 'ms');"""

def run_code(code):
    res = subprocess.run(['node', '-e', code], capture_output=True, text=True)
    return res.stdout.strip()

out1 = run_code(p1_code)
out2 = run_code(p2_code)
out3 = run_code(p3_code)
out4 = run_code(p4_code)
out5 = run_code(p5_code)

parts = [
    {
        "title": "Case Study Blueprint: The 500k RPS Black Friday Thundering Herd & Edge Shielding",
        "say": p1_say,
        "code": p1_code,
        "output": out1,
        "tryIt": "Modify edgeCacheHitRate to 0.98 and calculate the updated number of requests forwarded to the origin.",
        "check": {
            "question": "What is the primary role of an Edge Origin Shield during a 500k RPS e-commerce viral event?",
            "options": [
                "To absorb 99%+ of catalog browsing requests at distributed edge nodes, preventing database connection exhaustion",
                "To encrypt all product images with RSA-4096 before rendering in the browser",
                "To automatically cancel customer orders if the total cart value exceeds $500",
                "To force all shoppers to wait in a 30-minute queue before seeing product photos"
            ],
            "answer": 0,
            "why": "Edge origin shields absorb browsing traffic at edge PoPs, forwarding only a small, manageable trickle of requests to origin databases."
        }
    },
    {
        "title": "PPR at Scale: Edge Static Shell Distribution & Streaming Personalized Holes",
        "say": p2_say,
        "code": p2_code,
        "output": out2,
        "tryIt": "Add a third dynamic hole for shipping estimates with 40ms latency and inspect the updated total streaming duration.",
        "check": {
            "question": "How does Partial Prerendering (PPR) achieve sub-20ms TTFB while displaying live stock levels?",
            "options": [
                "It serves an edge-cached static shell immediately while streaming live inventory into reserved Suspense holes",
                "It uses an artificial timer that delays page loading until stock levels are calculated",
                "It stores user credit card numbers in browser local storage",
                "It converts all React JSX into static PNG screenshot images"
            ],
            "answer": 0,
            "why": "PPR decouples the static application shell from dynamic streaming holes, delivering instant FCP and live data concurrently."
        }
    },
    {
        "title": "Hierarchical Tag-Based Edge Cache Invalidation Mesh",
        "say": p3_say,
        "code": p3_code,
        "output": out3,
        "tryIt": "Invalidate tag 'brand:nike' in CacheTagMesh and verify how many product pages are purged across the catalog.",
        "check": {
            "question": "Why is tag-based cache invalidation superior to blanket cache flushing during inventory updates?",
            "options": [
                "It purges only the specific pages matching the mutated SKU tag, leaving millions of unrelated cached pages intact",
                "It reduces server memory consumption by 90% regardless of cache size",
                "It bypasses CDN networks and writes directly to user hard drives",
                "It prevents users from using discount promo codes"
            ],
            "answer": 0,
            "why": "Tag-based invalidation performs surgical eviction of affected items while preserving global cache hit ratios."
        }
    },
    {
        "title": "Dynamic Flash Sale Pricing Rules & Client-Side Promotion Engine",
        "say": p4_say,
        "code": p4_code,
        "output": out4,
        "tryIt": "Add a new VIP_GOLD discount of 25% and calculate the effective price for a user with tier 'GOLD'.",
        "check": {
            "question": "Why are promotional pricing calculations evaluated client-side in flash sale interfaces?",
            "options": [
                "To deliver instantaneous, sub-millisecond price updates when users toggle coupons or tiers without network latency",
                "Because backend databases cannot perform subtraction or percentage math",
                "To allow users to modify product prices in browser DevTools and buy items for free",
                "To prevent search engines from indexing product prices"
            ],
            "answer": 0,
            "why": "Client-side evaluation provides instant UI responsiveness during interactive shopping without incurring server round-trips."
        }
    },
    {
        "title": "Production Forensic Teardown: 2018 Amazon Prime Day Outage & Grade A+ Certification",
        "say": p5_say,
        "code": p5_code,
        "output": out5,
        "tryIt": "Set edgeCacheHitRate to 0.95 in the resilience suite and observe how the audit flags the SLA breach.",
        "check": {
            "question": "What primary engineering bottleneck caused the catastrophic $100M Amazon Prime Day outage in 2018?",
            "options": [
                "Cascading microservice failure caused by un-cached homepage read requests overwhelming an internal DynamoDB service",
                "A fiber optic cable was accidentally severed in the Atlantic Ocean",
                "The React virtual DOM exceeded its maximum recursion depth in Internet Explorer",
                "A CSS overflow bug broke the shopping cart icon on mobile devices"
            ],
            "answer": 0,
            "why": "Un-cached homepage reads caused a thundering herd on internal DynamoDB databases, crashing cascading microservices."
        }
    }
]

day57_data = {
    "day": 57,
    "title": "Industrial Architecture Case Study 2: Global E-Commerce Streaming Architecture & PPR",
    "goal": "Master high-scale global e-commerce architecture: shield origin databases from 500k RPS thundering herds, distribute static shells at the edge with Partial Prerendering, orchestrate surgical tag-based edge invalidations, and build zero-CLS flash-sale pricing engines.",
    "minutes": 38,
    "recap": "Yesterday, we analyzed institutional financial trading desks. Today, we conquer global e-commerce streaming systems capable of surviving 500,000 requests per second during peak viral flash sales.",
    "summary": [
        "Global retail platforms withstand 500k RPS thundering herds through asymmetric route decomposition and 99%+ edge caching.",
        "Partial Prerendering (PPR) delivers pre-compiled static shells in under 15ms while dynamic inventory and recommendations stream in parallel.",
        "Skeleton Bounding Box Contracts guarantee zero Cumulative Layout Shift (CLS = 0.000) during progressive dynamic streaming.",
        "Hierarchical tag-based edge invalidation purges mutated SKUs surgically without flushing millions of unaffected cached products.",
        "Client-side promotion rule engines evaluate loyalty tiers and discount hierarchies with sub-microsecond latency.",
        "Automated resilience auditing suites continuously verify five Golden Signals to prevent cascading failures like the 2018 Prime Day crash."
    ],
    "projectStep": {
        "title": "Architect and Certify a Black Friday Scale Global E-Commerce Streaming Platform with PPR",
        "steps": [
            "Construct a thundering herd traffic simulator and edge origin shield validator",
            "Build a Partial Prerendering (PPR) progressive streaming coordinator with skeleton contracts",
            "Implement a hierarchical tag-based edge cache invalidation mesh with surgical eviction",
            "Assemble a client-side promotional pricing engine and execute the 5-vector resilience audit"
        ]
    },
    "parts": parts
}

# Check word counts
total_words = 0
for i, p in enumerate(parts):
    wc = sum(len(s.split()) for s in p['say'])
    total_words += wc
    print(f"Day 57 Part {i+1}: {wc} words")
print(f"Total Day 57 Words: {total_words}")

with open('scripts/react_day57.json', 'w', encoding='utf-8') as f:
    json.dump(day57_data, f, indent=2)

with open('scripts/react_day57_data.py', 'w', encoding='utf-8') as f:
    f.write(f"DAY_57 = {json.dumps(day57_data, indent=2)}\n")

print("Generated scripts/react_day57.json and scripts/react_day57_data.py successfully!")
