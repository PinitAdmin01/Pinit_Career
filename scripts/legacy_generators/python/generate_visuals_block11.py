# scripts/generate_visuals_block11.py
import os, sys, json, hashlib

false = False
true = True

def sha256(text: str) -> str:
    return hashlib.sha256(text.encode('utf-8')).hexdigest()

VISUALS_DIR = os.path.abspath('src/lib/data/lessonVisuals/react-basics')
os.makedirs(VISUALS_DIR, exist_ok=True)

# Load days 51 to 55 data
days_data = {}
for d in range(51, 56):
    with open(f'scripts/react_day{d}.json', 'r', encoding='utf-8') as f:
        days_data[d] = json.load(f)

visual_templates_by_day = {
    51: [
        {
            "template": "component-tree",
            "title": "Next.js App Router Nested Layouts & Shared State Hierarchy",
            "root": {
                "id": "root_layout",
                "name": "RootLayout (html, body, GlobalNav)",
                "children": [
                    {
                        "id": "dashboard_layout",
                        "name": "DashboardLayout (Sidebar, UserProfile)",
                        "children": [
                            {"id": "analytics_page", "name": "AnalyticsPage (Charts, LiveCards)"},
                            {"id": "settings_page", "name": "SettingsPage (ProfileForm)"}
                        ]
                    }
                ]
            },
            "steps": [
                {"at": "say1", "caption": "RootLayout mounts top-level HTML and global navigation bar once.", "values": {"root_layout": {"state": "Mounted"}, "dashboard_layout": {"state": "Idle"}, "analytics_page": {"state": "Idle"}, "settings_page": {"state": "Idle"}}, "tones": {"root_layout": "ok", "dashboard_layout": "idle", "analytics_page": "idle", "settings_page": "idle"}},
                {"at": "say2", "caption": "DashboardLayout wraps internal administrative routes, persisting sidebar state.", "values": {"root_layout": {"state": "Preserved"}, "dashboard_layout": {"state": "Mounted"}, "analytics_page": {"state": "Idle"}, "settings_page": {"state": "Idle"}}, "tones": {"root_layout": "ok", "dashboard_layout": "ok", "analytics_page": "idle", "settings_page": "idle"}},
                {"at": "say3", "caption": "Navigating from Analytics to Settings swaps only leaf page components.", "values": {"root_layout": {"state": "No Re-render"}, "dashboard_layout": {"state": "State Intact"}, "analytics_page": {"state": "Unmounted"}, "settings_page": {"state": "Mounted"}}, "tones": {"root_layout": "ok", "dashboard_layout": "ok", "analytics_page": "idle", "settings_page": "ok"}},
                {"at": "say4", "caption": "Nested layouts completely eliminate layout thrashing and maintain 60 FPS transitions.", "values": {"root_layout": {"state": "Persistent"}, "dashboard_layout": {"state": "Zero Reflow"}, "analytics_page": {"state": "Cached"}, "settings_page": {"state": "Active"}}, "tones": {"root_layout": "ok", "dashboard_layout": "ok", "analytics_page": "idle", "settings_page": "ok"}}
            ]
        },
        {
            "template": "compare",
            "title": "Route Groups URL Architecture: Clean Public URLs vs Visual Grouping",
            "left": {"label": "Physical File Directory Structure", "items": ["app/(marketing)/about/page.tsx", "app/(dashboard)/analytics/page.tsx", "Route group folder in parens (marketing)", "Isolated layout tree for marketing landing"]},
            "right": {"label": "Resolved Public URL Path", "items": ["https://platform.com/about", "https://platform.com/analytics", "Parenthesis omitted from public path", "Zero URL pollution with clean routing"]},
            "steps": [
                {"at": "say1", "caption": "Route groups organize folders without altering the browser URL path.", "values": {"left": {"items": ["app/(marketing)/about", "Group parenthesised", "Layout scoped", "No URL segment"]}, "right": {"items": ["/about", "Clean public path", "Zero folder clutter", "SEO optimized"]}}, "tones": {"left": "data", "right": "ok"}},
                {"at": "say2", "caption": "Marketing routes use a lightweight layout without internal sidebar chrome.", "values": {"left": {"items": ["(marketing)/layout.tsx", "Public landing header", "Lead gen footer", "Zero auth chrome"]}, "right": {"items": ["Public Layout Rendered", "Fast static hydration", "Marketing CTA ready", "Zero dashboard bloat"]}}, "tones": {"left": "data", "right": "ok"}},
                {"at": "say3", "caption": "Dashboard routes use an authenticated layout with sidebar and user menus.", "values": {"left": {"items": ["(dashboard)/layout.tsx", "Authenticated sidebar", "Real-time websocket", "User profile badge"]}, "right": {"items": ["Secure Layout Rendered", "Protected session", "Live stream attached", "Enterprise layout"]}}, "tones": {"left": "data", "right": "ok"}},
                {"at": "say4", "caption": "Route groups enable multiple root layouts across distinct application sub-domains.", "values": {"left": {"items": ["Multi-Root Architecture", "Independent Head Tags", "Granular Theme Bundles", "Modular Organization"]}, "right": {"items": ["Unified Domain Name", "Clean URL Routes", "Optimized CSS Bundles", "Enterprise Certified"]}}, "tones": {"left": "ok", "right": "ok"}}
            ]
        },
        {
            "template": "boxes",
            "title": "Parallel Routes: Named Slots & Independent Hydration Streams",
            "boxes": [
                {"id": "parent_layout", "label": "Dashboard Layout (props.children, props.analytics, props.feed)", "tappable": false},
                {"id": "slot_analytics", "label": "@analytics Slot (Independent Suspense Boundary)", "tappable": false},
                {"id": "slot_feed", "label": "@feed Slot (Live Financial Ticker Stream)", "tappable": false},
                {"id": "slot_default", "label": "default.tsx Fallback (Unmatched Route Recovery)", "tappable": false}
            ],
            "steps": [
                {"at": "say1", "caption": "Parallel routes allow rendering multiple page slots simultaneously in the same layout.", "values": {"parent_layout": {"text": "\"Mounting Slots\""}, "slot_analytics": {"text": "\"Stream Initialized\""}, "slot_feed": {"text": "\"Stream Initialized\""}, "slot_default": {"text": "\"Standby\""}}, "tones": {"parent_layout": "data", "slot_analytics": "data", "slot_feed": "data", "slot_default": "idle"}},
                {"at": "say2", "caption": "Slots execute data fetching concurrently without blocking each other.", "values": {"parent_layout": {"text": "\"Layout Rendered\""}, "slot_analytics": {"text": "\"Computing PnL (45ms)\""}, "slot_feed": {"text": "\"Live Ticker Connected\""}, "slot_default": {"text": "\"Standby\""}}, "tones": {"parent_layout": "ok", "slot_analytics": "data", "slot_feed": "ok", "slot_default": "idle"}},
                {"at": "say3", "caption": "Each slot maintains its own error boundary and loading state.", "values": {"parent_layout": {"text": "\"Layout Healthy\""}, "slot_analytics": {"text": "\"Analytics Hydrated\""}, "slot_feed": {"text": "\"Real-Time Feed Hydrated\""}, "slot_default": {"text": "\"Inactive\""}}, "tones": {"parent_layout": "ok", "slot_analytics": "ok", "slot_feed": "ok", "slot_default": "idle"}},
                {"at": "say4", "caption": "default.tsx ensures graceful fallback when child routes navigate independently.", "values": {"parent_layout": {"text": "\"Fully Synchronized\""}, "slot_analytics": {"text": "\"60 FPS Live\""}, "slot_feed": {"text": "\"Stream Active\""}, "slot_default": {"text": "\"Guarded\""}}, "tones": {"parent_layout": "ok", "slot_analytics": "ok", "slot_feed": "ok", "slot_default": "ok"}}
            ]
        },
        {
            "template": "flow",
            "title": "Intercepting Routes: Soft Navigation Modal vs Hard Refresh Full Page",
            "nodes": [
                {"id": "feed_click", "label": "User Clicks Photo #42", "tappable": false},
                {"id": "intercept_match", "label": "Intercept Route (..)photo/[id]", "tappable": false},
                {"id": "modal_overlay", "label": "Render Modal in @modal Slot", "tappable": false},
                {"id": "hard_refresh", "label": "Direct URL /photo/42 Access", "tappable": false}
            ],
            "steps": [
                {"at": "say1", "caption": "Client-side soft navigation triggers route interception matching (..) convention.", "values": {"feed_click": {"text": "\"Soft Click\""}, "intercept_match": {"text": "\"Evaluating\""}, "modal_overlay": {"text": "\"Idle\""}, "hard_refresh": {"text": "\"Idle\""}}, "tones": {"feed_click": "data", "intercept_match": "data", "modal_overlay": "idle", "hard_refresh": "idle"}, "arrows": [["feed_click", "intercept_match"]]},
                {"at": "say2", "caption": "App Router updates browser URL to /photo/42 while keeping feed page mounted.", "values": {"feed_click": {"text": "\"Feed Kept in Background\""}, "intercept_match": {"text": "\"Intercepted\""}, "modal_overlay": {"text": "\"Opening Modal\""}, "hard_refresh": {"text": "\"Idle\""}}, "tones": {"feed_click": "ok", "intercept_match": "ok", "modal_overlay": "data", "hard_refresh": "idle"}, "arrows": [["intercept_match", "modal_overlay"]]},
                {"at": "say3", "caption": "The photo renders inside a modal overlay slot without unmounting the feed context.", "values": {"feed_click": {"text": "\"Feed Interactive\""}, "intercept_match": {"text": "\"URL: /photo/42\""}, "modal_overlay": {"text": "\"Modal Active\""}, "hard_refresh": {"text": "\"Bypassed\""}}, "tones": {"feed_click": "ok", "intercept_match": "ok", "modal_overlay": "ok", "hard_refresh": "idle"}},
                {"at": "say4", "caption": "A hard browser refresh or direct link navigates directly to the standalone photo page.", "values": {"feed_click": {"text": "\"N/A\""}, "intercept_match": {"text": "\"N/A\""}, "modal_overlay": {"text": "\"Closed\""}, "hard_refresh": {"text": "\"Dedicated Standalone Page\""}}, "tones": {"feed_click": "idle", "intercept_match": "idle", "modal_overlay": "idle", "hard_refresh": "ok"}, "arrows": [["hard_refresh", "hard_refresh"]]}
            ]
        },
        {
            "template": "compare",
            "title": "Architectural Audit: Legacy Pages Router vs App Router Architecture",
            "left": {"label": "Legacy Next.js Pages Router", "items": ["Root _app.tsx re-renders on route changes", "No built-in nested layout persistence", "Custom modal hacks lose shareable URLs", "Waterfall client-side data fetching"]},
            "right": {"label": "Modern App Router Architecture", "items": ["Persistent nested layouts with zero reflow", "Parallel slots with independent Suspense", "Intercepting routes provide shareable URLs", "Server Components stream flight data directly"]},
            "steps": [
                {"at": "say1", "caption": "App Router eliminates wasteful re-renders of parent navigation chrome.", "values": {"left": {"items": ["Full Tree Re-render", "Sidebar State Lost", "Flicker on Navigation", "High CPU Load"]}, "right": {"items": ["Leaf Node Swap Only", "Sidebar State Intact", "Zero Screen Flicker", "Smooth 60 FPS"]}}, "tones": {"left": "error", "right": "ok"}},
                {"at": "say2", "caption": "Parallel routes allow independent loading streams for complex dashboards.", "values": {"left": {"items": ["Sequential Fetching", "Slowest Query Blocks All", "Blank White Screen", "High Bounce Rate"]}, "right": {"items": ["Concurrent Slot Streams", "Fastest Slots Hydrate First", "Progressive UI", "Instant Engagement"]}}, "tones": {"left": "error", "right": "ok"}},
                {"at": "say3", "caption": "Intercepting routes combine fluid modal UX with deep bookmarkable URLs.", "values": {"left": {"items": ["Unshareable Modal State", "Back Button Closes Page", "Broken Deep Links", "Confusing UX"]}, "right": {"items": ["Shareable URL /photo/42", "Back Button Dismisses Modal", "Perfect Deep Linking", "Native App Feel"]}}, "tones": {"left": "error", "right": "ok"}},
                {"at": "say4", "caption": "App Router delivers enterprise-grade performance and architectural scalability.", "values": {"left": {"items": ["Monolithic Page Tree", "Fragile Global State", "High Maintenance Overhead", "Legacy Tech Debt"]}, "right": {"items": ["Modular Route Domains", "Isolated Slot Failures", "Zero Layout Thrash", "Enterprise Ready"]}}, "tones": {"left": "error", "right": "ok"}}
            ]
        }
    ],
    52: [
        {
            "template": "compare",
            "title": "Serverless Node.js Container vs Edge Runtime V8 Isolate",
            "left": {"label": "Node.js Serverless Container (AWS Lambda)", "items": ["Heavy container cold start (250ms - 1,200ms)", "Requires centralized origin VPC routing", "Node native C++ bindings supported", "High memory footprint (128MB - 1GB)"]},
            "right": {"label": "Edge Runtime V8 Isolate (Vercel / Cloudflare)", "items": ["Sub-millisecond cold start (< 2ms)", "Runs on 300+ edge Points of Presence", "Strict Web Standard APIs (Fetch, Web Crypto)", "Ultra-lean memory footprint (4MB - 16MB)"]},
            "steps": [
                {"at": "say1", "caption": "Edge isolates boot instantly without spinning up full operating system containers.", "values": {"left": {"items": ["Docker Container Spin-up", "Node.js Runtime Init", "350ms Cold Start", "Latency Spike"]}, "right": {"items": ["V8 Isolate Allocation", "Zero Boot Overhead", "1.8ms Startup", "Instant Execution"]}}, "tones": {"left": "error", "right": "ok"}},
                {"at": "say2", "caption": "Edge middleware intercepts requests within single-digit milliseconds of the user.", "values": {"left": {"items": ["Traffic Crosses Ocean", "180ms Network RTT", "High Latency Budget", "Slow Perceived Speed"]}, "right": {"items": ["Terminated at Local PoP", "8ms Local RTT", "Instant Edge Response", "Blazing Fast Response"]}}, "tones": {"left": "error", "right": "ok"}},
                {"at": "say3", "caption": "Web Standard APIs guarantee universal compatibility without Node dependencies.", "values": {"left": {"items": ["Node 'fs', 'net', 'crypto'", "Platform Locked", "Heavy Node Modules", "Large Deploy Bundles"]}, "right": {"items": ["Web Fetch, SubtleCrypto", "Edge Universal", "Zero Heavy Bundles", "Lean 15KB Functions"]}}, "tones": {"left": "data", "right": "ok"}},
                {"at": "say4", "caption": "Edge computing delivers unprecedented scale and cost efficiency.", "values": {"left": {"items": ["High Idle Costs", "Slow Scaling Spikes", "VPC Connection Exhaustion", "Legacy Infrastructure"]}, "right": {"items": ["Zero Idle Costs", "Instant 100k req/s Scale", "Zero VPC Bottlenecks", "Next-Gen Cloud"]}}, "tones": {"left": "error", "right": "ok"}}
            ]
        },
        {
            "template": "flow",
            "title": "Edge Middleware Pipeline: Rate Limit -> Auth Gate -> Geo Routing",
            "nodes": [
                {"id": "incoming_req", "label": "Incoming HTTP Request", "tappable": false},
                {"id": "rate_limiter", "label": "Token Bucket Rate Limiter", "tappable": false},
                {"id": "jwt_verifier", "label": "Web Crypto JWT Verifier", "tappable": false},
                {"id": "geo_router", "label": "Geo IP Header Injection & Rewrite", "tappable": false}
            ],
            "steps": [
                {"at": "say1", "caption": "Client request enters the edge network and hits the rate limiting filter first.", "values": {"incoming_req": {"text": "\"Client Req\""}, "rate_limiter": {"text": "\"Evaluating Quota\""}, "jwt_verifier": {"text": "\"Standby\""}, "geo_router": {"text": "\"Standby\""}}, "tones": {"incoming_req": "data", "rate_limiter": "data", "jwt_verifier": "idle", "geo_router": "idle"}, "arrows": [["incoming_req", "rate_limiter"]]},
                {"at": "say2", "caption": "Excessive requests are blocked immediately with HTTP 429 Too Many Requests.", "values": {"incoming_req": {"text": "\"Blocked Bot\""}, "rate_limiter": {"text": "\"429 Blocked\""}, "jwt_verifier": {"text": "\"Protected\""}, "geo_router": {"text": "\"Untouched\""}}, "tones": {"incoming_req": "error", "rate_limiter": "error", "jwt_verifier": "ok", "geo_router": "idle"}},
                {"at": "say3", "caption": "Valid requests proceed to Web Crypto JWT verification without external round trips.", "values": {"incoming_req": {"text": "\"Authorized Req\""}, "rate_limiter": {"text": "\"Quota OK\""}, "jwt_verifier": {"text": "\"Signature Verified\""}, "geo_router": {"text": "\"Evaluating Geo\""}}, "tones": {"incoming_req": "ok", "rate_limiter": "ok", "jwt_verifier": "ok", "geo_router": "data"}, "arrows": [["rate_limiter", "jwt_verifier"], ["jwt_verifier", "geo_router"]]},
                {"at": "say4", "caption": "Middleware injects geolocation headers and rewrites traffic to localized origins.", "values": {"incoming_req": {"text": "\"Completed\""}, "rate_limiter": {"text": "\"Pass\""}, "jwt_verifier": {"text": "\"Pass\""}, "geo_router": {"text": "\"Routed to /apac/desk\""}}, "tones": {"incoming_req": "ok", "rate_limiter": "ok", "jwt_verifier": "ok", "geo_router": "ok"}}
            ]
        },
        {
            "template": "boxes",
            "title": "Sub-Millisecond Edge JWT Verification via Web Crypto API",
            "boxes": [
                {"id": "raw_jwt", "label": "Incoming JWT Bearer Header (Header.Payload.Sig)", "tappable": false},
                {"id": "web_crypto", "label": "crypto.subtle.verify (HMAC SHA-256)", "tappable": false},
                {"id": "claims_context", "label": "Extracted Claims (sub, role: 'TRADER', exp)", "tappable": false},
                {"id": "downstream_headers", "label": "Injected Request Headers (x-user-id, x-role)", "tappable": false}
            ],
            "steps": [
                {"at": "say1", "caption": "The edge isolate extracts raw JWT tokens from Authorization headers or cookies.", "values": {"raw_jwt": {"text": "\"Extracted Bearer Token\""}, "web_crypto": {"text": "\"Importing Secret Key\""}, "claims_context": {"text": "\"Pending\""}, "downstream_headers": {"text": "\"Standby\""}}, "tones": {"raw_jwt": "data", "web_crypto": "data", "claims_context": "idle", "downstream_headers": "idle"}},
                {"at": "say2", "caption": "Web Crypto API verifies HMAC SHA-256 signature in under 0.5 milliseconds.", "values": {"raw_jwt": {"text": "\"Token Valid\""}, "web_crypto": {"text": "\"Signature 100% Match\""}, "claims_context": {"text": "\"Decoding Payload\""}, "downstream_headers": {"text": "\"Standby\""}}, "tones": {"raw_jwt": "ok", "web_crypto": "ok", "claims_context": "data", "downstream_headers": "idle"}},
                {"at": "say3", "caption": "Expiration timestamp is checked; claims are validated against role permissions.", "values": {"raw_jwt": {"text": "\"Valid\""}, "web_crypto": {"text": "\"Verified\""}, "claims_context": {"text": "\"User: u_101, Role: TRADER\""}, "downstream_headers": {"text": "\"Composing Headers\""}}, "tones": {"raw_jwt": "ok", "web_crypto": "ok", "claims_context": "ok", "downstream_headers": "data"}},
                {"at": "say4", "caption": "Verified user identity is injected into request headers for downstream Server Components.", "values": {"raw_jwt": {"text": "\"Processed\""}, "web_crypto": {"text": "\"Fast (<1ms)\""}, "claims_context": {"text": "\"Hydrated\""}, "downstream_headers": {"text": "\"x-user-id: u_101 Ready\""}}, "tones": {"raw_jwt": "ok", "web_crypto": "ok", "claims_context": "ok", "downstream_headers": "ok"}}
            ]
        },
        {
            "template": "states",
            "title": "Sliding Token Bucket Rate Limiter State Machine",
            "states": [
                {"id": "normal_flow", "label": "NORMAL_FLOW (Tokens > 50%)"},
                {"id": "burst_drain", "label": "BURST_DRAIN (Tokens < 20%)"},
                {"id": "blocked_429", "label": "BLOCKED_429 (Tokens = 0)"},
                {"id": "replenished", "label": "REPLENISHED (Tokens = Max)"}
            ],
            "transitions": [
                {"from": "normal_flow", "to": "burst_drain", "label": "High request volume"},
                {"from": "burst_drain", "to": "blocked_429", "label": "Bucket exhausted"},
                {"from": "blocked_429", "to": "replenished", "label": "Window expires & refills"},
                {"from": "replenished", "to": "normal_flow", "label": "Steady state restored"}
            ],
            "steps": [
                {"at": "say1", "caption": "Rate limiter starts in NORMAL_FLOW with full token capacity available.", "values": {"normal_flow": {"status": "ACTIVE"}, "burst_drain": {"status": "INACTIVE"}, "blocked_429": {"status": "INACTIVE"}, "replenished": {"status": "INACTIVE"}}, "tones": {"normal_flow": "ok", "burst_drain": "idle", "blocked_429": "idle", "replenished": "idle"}},
                {"at": "say2", "caption": "A sudden burst of user actions rapidly consumes tokens from the edge bucket.", "values": {"normal_flow": {"status": "INACTIVE"}, "burst_drain": {"status": "ACTIVE (12 Tokens Left)"}, "blocked_429": {"status": "INACTIVE"}, "replenished": {"status": "INACTIVE"}}, "tones": {"normal_flow": "idle", "burst_drain": "error", "blocked_429": "idle", "replenished": "idle"}},
                {"at": "say3", "caption": "When the bucket empties, edge immediately returns HTTP 429 with Retry-After header.", "values": {"normal_flow": {"status": "INACTIVE"}, "burst_drain": {"status": "INACTIVE"}, "blocked_429": {"status": "ACTIVE (HTTP 429 Issued)"}, "replenished": {"status": "INACTIVE"}}, "tones": {"normal_flow": "idle", "burst_drain": "idle", "blocked_429": "error", "replenished": "idle"}},
                {"at": "say4", "caption": "Tokens replenish automatically over time, restoring normal routing without server reboot.", "values": {"normal_flow": {"status": "ACTIVE (Restored)"}, "burst_drain": {"status": "INACTIVE"}, "blocked_429": {"status": "INACTIVE"}, "replenished": {"status": "100% Capacity"}}, "tones": {"normal_flow": "ok", "burst_drain": "idle", "blocked_429": "idle", "replenished": "ok"}}
            ]
        },
        {
            "template": "compare",
            "title": "Production Security Benchmark: Origin Security vs Edge Middleware Pipeline",
            "left": {"label": "Centralized Origin Security", "items": ["Origin servers absorb all malicious DDoS traffic", "JWT verified deep inside backend database stack", "Database connection pool exhausted by bots", "High latency penalty for international users"]},
            "right": {"label": "Edge Middleware Security Pipeline", "items": ["Bad traffic terminated at edge PoP in < 3ms", "Zero-database cryptographic token verification", "Origin shielded from 99.8% of automated bot attacks", "Sub-20ms localized edge response worldwide"]},
            "steps": [
                {"at": "say1", "caption": "Edge middleware terminates abusive traffic before it ever touches database infrastructure.", "values": {"left": {"items": ["100k Bot Reqs Hit DB", "Connection Pool Full", "Site Crash Risk", "Slow User Queries"]}, "right": {"items": ["Blocked at Edge PoP", "0 Bot Reqs Hit DB", "Zero Crash Risk", "Fast User Queries"]}}, "tones": {"left": "error", "right": "ok"}},
                {"at": "say2", "caption": "Web Crypto verification executes in 0.8ms without network round-trips.", "values": {"left": {"items": ["45ms Auth RTT", "Centralized Auth API", "Single Point of Failure", "High Overhead"]}, "right": {"items": ["0.8ms Local Compute", "Distributed Edge Crypto", "Zero Single Point", "Ultra Low Overhead"]}}, "tones": {"left": "error", "right": "ok"}},
                {"at": "say3", "caption": "Geo-IP header injection personalizes currency and region instantaneously.", "values": {"left": {"items": ["Geo Lookup in Server", "Added 30ms Per Request", "External IP Database", "Stale Geodata"]}, "right": {"items": ["Native Edge Geo Header", "0ms Overhead", "Hardware IP Geo Lookup", "Always Accurate"]}}, "tones": {"left": "data", "right": "ok"}},
                {"at": "say4", "caption": "The Edge Middleware Pipeline delivers enterprise-grade zero-trust defense.", "values": {"left": {"items": ["Vulnerable Perimeter", "High Infrastructure Costs", "Frustrated Global Users", "Grade C Security"]}, "right": {"items": ["Hardened Edge Perimeter", "Minimal Origin Burden", "Delighted Global Users", "Grade A+ Certified"]}}, "tones": {"left": "error", "right": "ok"}}
            ]
        }
    ],
    53: [
        {
            "template": "compare",
            "title": "Standard SSR vs Partial Prerendering (PPR) Streaming Architecture",
            "left": {"label": "Standard SSR (Blocking Server)", "items": ["Server waits for slowest database query", "High Time to First Byte (TTFB 800ms+)", "Users stare at blank white screen", "Complete re-render of static navigation chrome"]},
            "right": {"label": "Partial Prerendering (PPR) with Static Shell", "items": ["Instant static shell served from edge (< 20ms)", "Immediate First Contentful Paint (FCP)", "Dynamic holes stream concurrently via Suspense", "Cumulative Layout Shift (CLS) = 0.000"]},
            "steps": [
                {"at": "say1", "caption": "Standard SSR delays the entire response until the slowest dynamic query resolves.", "values": {"left": {"items": ["Slow DB Query: 650ms", "TTFB: 780ms", "White Screen of Death", "High Bounce Rate"]}, "right": {"items": ["Static Shell: 14ms", "TTFB: 18ms", "Instant Chrome Rendered", "Zero Bounce Rate"]}}, "tones": {"left": "error", "right": "ok"}},
                {"at": "say2", "caption": "PPR delivers the static header, layout, and navbars in the very first network chunk.", "values": {"left": {"items": ["No Shell Available", "User Waiting...", "CPU Idling in Browser", "Poor User Experience"]}, "right": {"items": ["Nav & Sidebar Ready", "User Reading Content", "Browser Ready to Paint", "Native App Responsiveness"]}}, "tones": {"left": "error", "right": "ok"}},
                {"at": "say3", "caption": "Dynamic holes stream in progressively, replacing skeleton placeholders in-place.", "values": {"left": {"items": ["Monolithic HTML Flush", "Massive DOM Replacement", "High Memory Spike", "Janky Render"]}, "right": {"items": ["Targeted Slot Hydration", "Skeleton Replacement", "Smooth Progressive Paint", "Zero Memory Spikes"]}}, "tones": {"left": "data", "right": "ok"}},
                {"at": "say4", "caption": "PPR combines the speed of static sites with the live power of dynamic servers.", "values": {"left": {"items": ["High Cloud Server Cost", "Brittle Under Load Spikes", "Sluggish Mobile Speed", "Legacy Architecture"]}, "right": {"items": ["Ultra Low Origin Load", "Survives Viral Spikes", "Blazing Mobile Performance", "React 19 Next-Gen"]}}, "tones": {"left": "error", "right": "ok"}}
            ]
        },
        {
            "template": "boxes",
            "title": "PPR Layout Decomposition: Static Shell vs Dynamic Streaming Holes",
            "boxes": [
                {"id": "static_shell", "label": "Static Shell (Header, Navigation, Footer - Cached at Edge)", "tappable": false},
                {"id": "dynamic_hole_1", "label": "Dynamic Hole #1: User Cart Widget (<Suspense fallback={<CartSkeleton/>}>)", "tappable": false},
                {"id": "dynamic_hole_2", "label": "Dynamic Hole #2: Real-Time Stock Feed (<Suspense fallback={<FeedSkeleton/>}>)", "tappable": false},
                {"id": "bounding_contract", "label": "Skeleton Bounding Box Contract (Zero Layout Shift - CLS: 0.000)", "tappable": false}
            ],
            "steps": [
                {"at": "say1", "caption": "Next.js compiles the static shell at build time; edge nodes cache it globally.", "values": {"static_shell": {"text": "\"Edge Cached 100%\""}, "dynamic_hole_1": {"text": "\"Demarcated with Suspense\""}, "dynamic_hole_2": {"text": "\"Demarcated with Suspense\""}, "bounding_contract": {"text": "\"Enforced\""}}, "tones": {"static_shell": "ok", "dynamic_hole_1": "data", "dynamic_hole_2": "data", "bounding_contract": "ok"}},
                {"at": "say2", "caption": "Browser receives the static shell instantly; skeletons hold reserved layout boxes.", "values": {"static_shell": {"text": "\"Painted on Screen (18ms)\""}, "dynamic_hole_1": {"text": "\"CartSkeleton Active\""}, "dynamic_hole_2": {"text": "\"FeedSkeleton Active\""}, "bounding_contract": {"text": "\"CLS = 0.000\""}}, "tones": {"static_shell": "ok", "dynamic_hole_1": "data", "dynamic_hole_2": "data", "bounding_contract": "ok"}},
                {"at": "say3", "caption": "Server resolves database queries asynchronously and streams chunks over HTTP.", "values": {"static_shell": {"text": "\"Untouched\""}, "dynamic_hole_1": {"text": "\"Cart Streamed (35ms)\""}, "dynamic_hole_2": {"text": "\"Feed Streamed (60ms)\""}, "bounding_contract": {"text": "\"Seamless Swap\""}}, "tones": {"static_shell": "ok", "dynamic_hole_1": "ok", "dynamic_hole_2": "ok", "bounding_contract": "ok"}},
                {"at": "say4", "caption": "The page reaches fully interactive readiness without a single visual jump.", "values": {"static_shell": {"text": "\"Fully Hydrated\""}, "dynamic_hole_1": {"text": "\"Cart Interactive\""}, "dynamic_hole_2": {"text": "\"Live Ticker Connected\""}, "bounding_contract": {"text": "\"Grade A+ Performance\""}}, "tones": {"static_shell": "ok", "dynamic_hole_1": "ok", "dynamic_hole_2": "ok", "bounding_contract": "ok"}}
            ]
        },
        {
            "template": "flow",
            "title": "Request-Scoped Memoization via React cache() Function",
            "nodes": [
                {"id": "incoming_req", "label": "Incoming User Request", "tappable": false},
                {"id": "comp_a", "label": "Component A (Header Profile)", "tappable": false},
                {"id": "cache_lookup", "label": "React cache() Registry", "tappable": false},
                {"id": "db_fetch", "label": "Database Fetch (Single Execution)", "tappable": false}
            ],
            "steps": [
                {"at": "say1", "caption": "Component A requests user data via cached fetcher function.", "values": {"incoming_req": {"text": "\"User Req\""}, "comp_a": {"text": "\"fetchUser('101')\""}, "cache_lookup": {"text": "\"Cache Miss\""}, "db_fetch": {"text": "\"Executing Query...\""}}, "tones": {"incoming_req": "data", "comp_a": "data", "cache_lookup": "error", "db_fetch": "data"}, "arrows": [["comp_a", "cache_lookup"], ["cache_lookup", "db_fetch"]]},
                {"at": "say2", "caption": "Database query resolves; result is stored in request-scoped cache registry.", "values": {"incoming_req": {"text": "\"Active\""}, "comp_a": {"text": "\"Rendered\""}, "cache_lookup": {"text": "\"Result Cached\""}, "db_fetch": {"text": "\"Query Done (12ms)\""}}, "tones": {"incoming_req": "ok", "comp_a": "ok", "cache_lookup": "ok", "db_fetch": "ok"}},
                {"at": "say3", "caption": "Component B requests the exact same user data later in the component tree.", "values": {"incoming_req": {"text": "\"Active\""}, "comp_a": {"text": "\"Intact\""}, "cache_lookup": {"text": "\"Cache HIT!\""}, "db_fetch": {"text": "\"Bypassed (0ms)\""}}, "tones": {"incoming_req": "ok", "comp_a": "ok", "cache_lookup": "ok", "db_fetch": "ok"}, "arrows": [["cache_lookup", "comp_a"]]},
                {"at": "say4", "caption": "Request-scoped memoization eliminates N+1 query overhead completely.", "values": {"incoming_req": {"text": "\"Request Finished\""}, "comp_a": {"text": "\"Profile Ready\""}, "cache_lookup": {"text": "\"Cleared On Finish\""}, "db_fetch": {"text": "\"Zero Leaks Across Users\""}}, "tones": {"incoming_req": "ok", "comp_a": "ok", "cache_lookup": "ok", "db_fetch": "ok"}}
            ]
        },
        {
            "template": "boxes",
            "title": "Granular Tag-Based Edge Cache Invalidation Mesh",
            "boxes": [
                {"id": "data_mutation", "label": "Backend Mutation (Server Action updateInventory())", "tappable": false},
                {"id": "revalidate_tag", "label": "revalidateTag('inventory-sku-99')", "tappable": false},
                {"id": "edge_purge", "label": "Edge CDN Global Purge Broadcast (< 15ms)", "tappable": false},
                {"id": "next_request", "label": "Subsequent Request Fetches Fresh Origin Data", "tappable": false}
            ],
            "steps": [
                {"at": "say1", "caption": "User or admin submits a mutation updating stock inventory in the database.", "values": {"data_mutation": {"text": "\"Stock Set to 0\""}, "revalidate_tag": {"text": "\"Pending\""}, "edge_purge": {"text": "\"Standby\""}, "next_request": {"text": "\"Standby\""}}, "tones": {"data_mutation": "data", "revalidate_tag": "idle", "edge_purge": "idle", "next_request": "idle"}},
                {"at": "say2", "caption": "Next.js invokes revalidateTag with the targeted product entity tag.", "values": {"data_mutation": {"text": "\"Committed\""}, "revalidate_tag": {"text": "\"Tag Invalidated\""}, "edge_purge": {"text": "\"Broadcasting Purge\""}, "next_request": {"text": "\"Standby\""}}, "tones": {"data_mutation": "ok", "revalidate_tag": "ok", "edge_purge": "data", "next_request": "idle"}},
                {"at": "say3", "caption": "Edge CDN mesh purges only cached entries matching that specific tag.", "values": {"data_mutation": {"text": "\"Finished\""}, "revalidate_tag": {"text": "\"Tag Cleared\""}, "edge_purge": {"text": "\"Purged Globally in 12ms\""}, "next_request": {"text": "\"Incoming User\""}}, "tones": {"data_mutation": "ok", "revalidate_tag": "ok", "edge_purge": "ok", "next_request": "data"}},
                {"at": "say4", "caption": "Unrelated product pages remain cached; stale inventory data is eliminated worldwide.", "values": {"data_mutation": {"text": "\"Audit Logged\""}, "revalidate_tag": {"text": "\"Mesh In Sync\""}, "edge_purge": {"text": "\"99.4% Hit Ratio Maintained\""}, "next_request": {"text": "\"Serves Fresh Stock: 0\""}}, "tones": {"data_mutation": "ok", "revalidate_tag": "ok", "edge_purge": "ok", "next_request": "ok"}}
            ]
        },
        {
            "template": "compare",
            "title": "Streaming Stability Audit: Unbounded Stream vs Skeleton Bounding Box Contract",
            "left": {"label": "Unbounded Naive Streaming", "items": ["Dynamic content jumps onto screen abruptly", "Cumulative Layout Shift (CLS) spikes to 0.28", "Users accidentally click wrong buttons", "Failed Google Core Web Vitals audit"]},
            "right": {"label": "Skeleton Bounding Box Contract", "items": ["Fallback matches exact dimensions of rendered card", "Cumulative Layout Shift (CLS) = 0.000", "Zero unexpected visual jumping", "Certified 100% Core Web Vitals Compliant"]},
            "steps": [
                {"at": "say1", "caption": "Unbounded streaming components cause jarring layout shifts when bytes arrive.", "values": {"left": {"items": ["No Pre-allocated Space", "Text Reflows 120px", "Content Jumps Down", "High User Frustration"]}, "right": {"items": ["Explicit Height/Width", "Exact Aspect Ratio", "Zero Text Reflow", "Silky Smooth Rendering"]}}, "tones": {"left": "error", "right": "ok"}},
                {"at": "say2", "caption": "High CLS scores severely penalize organic search engine search rankings.", "values": {"left": {"items": ["CLS: 0.28 (Poor)", "SEO Penalty Applied", "Lower Search Traffic", "High Bounce Rates"]}, "right": {"items": ["CLS: 0.000 (Good)", "Maximum SEO Boost", "Higher Search Rank", "Peak Conversion Rate"]}}, "tones": {"left": "error", "right": "ok"}},
                {"at": "say3", "caption": "Bounding box fallbacks preserve user scroll position and tap targets reliably.", "values": {"left": {"items": ["Mis-clicked Action Buttons", "Accidental Purchases", "Broken User Journeys", "Support Tickets Spiking"]}, "right": {"items": ["Precise Tap Target Stability", "Accurate User Clicks", "Flawless Purchase Flow", "Delighted Users"]}}, "tones": {"left": "error", "right": "ok"}},
                {"at": "say4", "caption": "PPR with strict bounding box contracts delivers the pinnacle of web engineering.", "values": {"left": {"items": ["Amateur Web Setup", "Fragile User Experience", "Unreliable Streaming", "Grade D Performance"]}, "right": {"items": ["Enterprise Grade Web App", "Flawless User Experience", "Resilient PPR Streaming", "Grade A+ Certified"]}}, "tones": {"left": "error", "right": "ok"}}
            ]
        }
    ],
    54: [
        {
            "template": "component-tree",
            "title": "Server-Driven UI (SDUI) Declarative JSON Wire Tree",
            "root": {
                "id": "page_root",
                "name": "PageContainer (id: 'page_home_01', padding: 16)",
                "children": [
                    {"id": "hero_node", "name": "HeroBanner (headline: 'Edge Streaming Active')"},
                    {
                        "id": "grid_node",
                        "name": "GridSection (columns: 2)",
                        "children": [
                            {"id": "metric_1", "name": "MetricCard (P99 Latency: 14ms)"},
                            {"id": "metric_2", "name": "MetricCard (Availability: 99.99%)"}
                        ]
                    }
                ]
            },
            "steps": [
                {"at": "say1", "caption": "The backend server transmits a declarative JSON wire schema over HTTP.", "values": {"page_root": {"state": "JSON Received"}, "hero_node": {"state": "Parsed"}, "grid_node": {"state": "Parsed"}, "metric_1": {"state": "Parsed"}, "metric_2": {"state": "Parsed"}}, "tones": {"page_root": "data", "hero_node": "data", "grid_node": "data", "metric_1": "data", "metric_2": "data"}},
                {"at": "say2", "caption": "The client schema validator checks node types, props, and hierarchical depth.", "values": {"page_root": {"state": "Validated"}, "hero_node": {"state": "Validated"}, "grid_node": {"state": "Validated"}, "metric_1": {"state": "Depth: 3"}, "metric_2": {"state": "Depth: 3"}}, "tones": {"page_root": "ok", "hero_node": "ok", "grid_node": "ok", "metric_1": "ok", "metric_2": "ok"}},
                {"at": "say3", "caption": "Nodes are instantiated into corresponding React design system components.", "values": {"page_root": {"state": "Mounted Container"}, "hero_node": {"state": "Rendered Hero"}, "grid_node": {"state": "Rendered Grid"}, "metric_1": {"state": "Rendered Card"}, "metric_2": {"state": "Rendered Card"}}, "tones": {"page_root": "ok", "hero_node": "ok", "grid_node": "ok", "metric_1": "ok", "metric_2": "ok"}},
                {"at": "say4", "caption": "SDUI allows updating screen layout instantly without app store or CDN deploys.", "values": {"page_root": {"state": "Dynamic"}, "hero_node": {"state": "Zero Deploy Update"}, "grid_node": {"state": "Flexible Layout"}, "metric_1": {"state": "Live Metric"}, "metric_2": {"state": "Live Metric"}}, "tones": {"page_root": "ok", "hero_node": "ok", "grid_node": "ok", "metric_1": "ok", "metric_2": "ok"}}
            ]
        },
        {
            "template": "boxes",
            "title": "Polymorphic Component Registry with Defensive Fallback Boundary",
            "boxes": [
                {"id": "incoming_type", "label": "Incoming Node Type (e.g. 'QuantumWidget')", "tappable": false},
                {"id": "registry_lookup", "label": "SDUIRegistry.get(node.type)", "tappable": false},
                {"id": "registered_component", "label": "Registered React Component (Page, Hero, Card)", "tappable": false},
                {"id": "fallback_boundary", "label": "Resilient Fallback Boundary (<UnsupportedWidgetFallback/>)", "tappable": false}
            ],
            "steps": [
                {"at": "say1", "caption": "Resolver queries the central component registry for each node type string.", "values": {"incoming_type": {"text": "\"type: 'Card'\""}, "registry_lookup": {"text": "\"Registry Query\""}, "registered_component": {"text": "\"Matching Component\""}, "fallback_boundary": {"text": "\"Standby\""}}, "tones": {"incoming_type": "data", "registry_lookup": "data", "registered_component": "ok", "fallback_boundary": "idle"}},
                {"at": "say2", "caption": "Registered types render the corresponding React component with declared props.", "values": {"incoming_type": {"text": "\"type: 'Hero'\""}, "registry_lookup": {"text": "\"Match Found\""}, "registered_component": {"text": "\"Hero Rendered\""}, "fallback_boundary": {"text": "\"Standby\""}}, "tones": {"incoming_type": "ok", "registry_lookup": "ok", "registered_component": "ok", "fallback_boundary": "idle"}},
                {"at": "say3", "caption": "Unrecognized or experimental widget types are intercepted by the fallback handler.", "values": {"incoming_type": {"text": "\"type: 'QuantumWidget'\""}, "registry_lookup": {"text": "\"Not Found\""}, "registered_component": {"text": "\"Bypassed\""}, "fallback_boundary": {"text": "\"Fallback Triggered\""}}, "tones": {"incoming_type": "error", "registry_lookup": "error", "registered_component": "idle", "fallback_boundary": "ok"}},
                {"at": "say4", "caption": "The application logs diagnostic telemetry while remaining 100% crash-free.", "values": {"incoming_type": {"text": "\"Handled Safely\""}, "registry_lookup": {"text": "\"Zero Crash\""}, "registered_component": {"text": "\"Siblings Rendered\""}, "fallback_boundary": {"text": "\"Safe Placeholder Visible\""}}, "tones": {"incoming_type": "ok", "registry_lookup": "ok", "registered_component": "ok", "fallback_boundary": "ok"}}
            ]
        },
        {
            "template": "flow",
            "title": "SDUI Declarative Action Dispatcher & Centralized Event Bus",
            "nodes": [
                {"id": "user_tap", "label": "User Clicks SDUI Action Button", "tappable": false},
                {"id": "action_payload", "label": "Action Object { type: 'MUTATE_CART', payload }", "tappable": false},
                {"id": "dispatcher_bus", "label": "Centralized SDUIActionDispatcher", "tappable": false},
                {"id": "execution_audit", "label": "Executed Handler & Immutable Audit Log", "tappable": false}
            ],
            "steps": [
                {"at": "say1", "caption": "Interactive widgets emit declarative action objects rather than raw functions.", "values": {"user_tap": {"text": "\"Tap 'Buy Now'\""}, "action_payload": {"text": "\"type: 'MUTATE_CART'\""}, "dispatcher_bus": {"text": "\"Receiving Action\""}, "execution_audit": {"text": "\"Standby\""}}, "tones": {"user_tap": "data", "action_payload": "data", "dispatcher_bus": "data", "execution_audit": "idle"}, "arrows": [["user_tap", "action_payload"], ["action_payload", "dispatcher_bus"]]},
                {"at": "say2", "caption": "Dispatcher enriches payload with client session ID, auth tokens, and device metadata.", "values": {"user_tap": {"text": "\"Tapped\""}, "action_payload": {"text": "\"Enriched with userId\""}, "dispatcher_bus": {"text": "\"Context Injected\""}, "execution_audit": {"text": "\"Checking Security Policy\""}}, "tones": {"user_tap": "ok", "action_payload": "ok", "dispatcher_bus": "ok", "execution_audit": "data"}},
                {"at": "say3", "caption": "The registered action handler executes safely without exposing arbitrary script injection.", "values": {"user_tap": {"text": "\"Completed\""}, "action_payload": {"text": "\"Validated\""}, "dispatcher_bus": {"text": "\"Handler Executing\""}, "execution_audit": {"text": "\"SKU Added to Cart\""}}, "tones": {"user_tap": "ok", "action_payload": "ok", "dispatcher_bus": "ok", "execution_audit": "ok"}, "arrows": [["dispatcher_bus", "execution_audit"]]},
                {"at": "say4", "caption": "All actions are recorded in an audit trail for observability and telemetry tracking.", "values": {"user_tap": {"text": "\"Success\""}, "action_payload": {"text": "\"Audit Logged\""}, "dispatcher_bus": {"text": "\"Idle\""}, "execution_audit": {"text": "\"Status: EXECUTED\""}}, "tones": {"user_tap": "ok", "action_payload": "ok", "dispatcher_bus": "ok", "execution_audit": "ok"}}
            ]
        },
        {
            "template": "states",
            "title": "Safe Zero-Eval Expression Evaluation Lifecycle",
            "states": [
                {"id": "parse_expression", "label": "PARSE_EXPRESSION (Regex Tokenizer)"},
                {"id": "resolve_context", "label": "RESOLVE_CONTEXT (Deep Property Traversal)"},
                {"id": "evaluate_operator", "label": "EVALUATE_OPERATOR (Safe JS Comparison)"},
                {"id": "filter_tree", "label": "FILTER_TREE (Mount / Omit Node)"}
            ],
            "transitions": [
                {"from": "parse_expression", "to": "resolve_context", "label": "Path extracted"},
                {"from": "resolve_context", "to": "evaluate_operator", "label": "Value resolved"},
                {"from": "evaluate_operator", "to": "filter_tree", "label": "Boolean result evaluated"},
                {"from": "filter_tree", "to": "parse_expression", "label": "Next node evaluated"}
            ],
            "steps": [
                {"at": "say1", "caption": "Tokenizer parses expressions like 'user.tier === VIP' into path, operator, and value.", "values": {"parse_expression": {"status": "TOKENIZING"}, "resolve_context": {"status": "IDLE"}, "evaluate_operator": {"status": "IDLE"}, "filter_tree": {"status": "IDLE"}}, "tones": {"parse_expression": "data", "resolve_context": "idle", "evaluate_operator": "idle", "filter_tree": "idle"}},
                {"at": "say2", "caption": "Resolver safely navigates nested client context objects without using eval().", "values": {"parse_expression": {"status": "PARSED"}, "resolve_context": {"status": "RESOLVED: 'VIP'"}, "evaluate_operator": {"status": "EVALUATING"}, "filter_tree": {"status": "IDLE"}}, "tones": {"parse_expression": "ok", "resolve_context": "ok", "evaluate_operator": "data", "filter_tree": "idle"}},
                {"at": "say3", "caption": "Comparison operators are evaluated against strict sandboxed boolean logic.", "values": {"parse_expression": {"status": "PARSED"}, "resolve_context": {"status": "RESOLVED"}, "evaluate_operator": {"status": "RESULT: TRUE"}, "filter_tree": {"status": "MOUNTING"}}, "tones": {"parse_expression": "ok", "resolve_context": "ok", "evaluate_operator": "ok", "filter_tree": "ok"}},
                {"at": "say4", "caption": "Zero-eval expression evaluation provides dynamic responsiveness with zero XSS vulnerabilities.", "values": {"parse_expression": {"status": "SECURE"}, "resolve_context": {"status": "ZERO EVAL"}, "evaluate_operator": {"status": "SAFE COMPARISON"}, "filter_tree": {"status": "VISIBLE"}}, "tones": {"parse_expression": "ok", "resolve_context": "ok", "evaluate_operator": "ok", "filter_tree": "ok"}}
            ]
        },
        {
            "template": "compare",
            "title": "Production Evolution: Hardcoded Releases vs Server-Driven UI Engine",
            "left": {"label": "Hardcoded Client Release Cycle", "items": ["Layout change requires 2-week app store review", "A/B test requires separate client binary builds", "Breaking backend change crashes older mobile apps", "Stale client bundles render inconsistent UI"]},
            "right": {"label": "Server-Driven UI Engine", "items": ["Layout update deploys in seconds via JSON wire", "Dynamic A/B experiments configured instantly", "Versioned schema migrator preserves older apps", "Universal consistency across Web, iOS, and Android"]},
            "steps": [
                {"at": "say1", "caption": "SDUI eliminates app store review delays for marketing and promotional campaigns.", "values": {"left": {"items": ["14 Days Review Delay", "Missed Holiday Promo", "Heavy App Updates", "User Churn"]}, "right": {"items": ["Instant Server Deploy", "Live in 5 Seconds", "Zero App Downloads", "Peak User Conversion"]}}, "tones": {"left": "error", "right": "ok"}},
                {"at": "say2", "caption": "Polymorphic registries ensure zero client crashes even when backend schemas evolve.", "values": {"left": {"items": ["Unhandled Type Crash", "White Screen of Death", "1-Star App Reviews", "Emergency Hotfix"]}, "right": {"items": ["Graceful Fallback", "Safe Skeletons Rendered", "5-Star App Reviews", "Zero Emergency Hotfixes"]}}, "tones": {"left": "error", "right": "ok"}},
                {"at": "say3", "caption": "Versioned migration pipelines transform legacy schemas forward and backward.", "values": {"left": {"items": ["Forced App Upgrades", "Locked Out Legacy Users", "Data Loss on Update", "Customer Complaints"]}, "right": {"items": ["Seamless Migration", "100% Backward Compatible", "Zero User Lockout", "Delighted Customers"]}}, "tones": {"left": "error", "right": "ok"}},
                {"at": "say4", "caption": "Server-Driven UI establishes the architectural pinnacle of agile enterprise applications.", "values": {"left": {"items": ["Rigid Monolithic Client", "Slow Innovation Cadence", "Fragile Mobile Releases", "Grade C Agility"]}, "right": {"items": ["Dynamic UI Engine", "Rapid Daily Iteration", "Fault-Tolerant Platform", "Grade A+ Certified"]}}, "tones": {"left": "error", "right": "ok"}}
            ]
        }
    ],
    55: [
        {
            "template": "boxes",
            "title": "Milestone 10 Architecture Topology: Enterprise Edge-Native Streaming Portal",
            "boxes": [
                {"id": "edge_layer", "label": "Edge Middleware (JWT Gate, Token Bucket Rate Limiting, Geo-Tagging)", "tappable": false},
                {"id": "ppr_layer", "label": "Partial Prerendering (Static Shell < 20ms, Suspense Dynamic Holes)", "tappable": false},
                {"id": "sdui_layer", "label": "Server-Driven UI Engine (Polymorphic Registry, Defensive Fallbacks)", "tappable": false},
                {"id": "cache_layer", "label": "Global Cache Invalidation Mesh (Tag-Based Edge Purge < 15ms)", "tappable": false}
            ],
            "steps": [
                {"at": "say1", "caption": "Edge layer terminates unauthorized requests and enriches headers in < 3ms.", "values": {"edge_layer": {"text": "\"Edge PoP Active (iad1, fra1, sin1)\""}, "ppr_layer": {"text": "\"Origin Ready\""}, "sdui_layer": {"text": "\"Registry Ready\""}, "cache_layer": {"text": "\"Mesh In Sync\""}}, "tones": {"edge_layer": "ok", "ppr_layer": "data", "sdui_layer": "data", "cache_layer": "ok"}},
                {"at": "say2", "caption": "Partial Prerendering streams the static shell instantly with zero white-screen delay.", "values": {"edge_layer": {"text": "\"Request Forwarded\""}, "ppr_layer": {"text": "\"Static Shell Flushed (18ms)\""}, "sdui_layer": {"text": "\"Parsing Wire Schemas\""}, "cache_layer": {"text": "\"Edge Cached\""}}, "tones": {"edge_layer": "ok", "ppr_layer": "ok", "sdui_layer": "data", "cache_layer": "ok"}},
                {"at": "say3", "caption": "Dynamic SDUI components stream into reserved bounding box holes with CLS = 0.000.", "values": {"edge_layer": {"text": "\"Pass\""}, "ppr_layer": {"text": "\"Dynamic Stream Complete\""}, "sdui_layer": {"text": "\"Widgets Mounted (100%)\""}, "cache_layer": {"text": "\"Tags Registered\""}}, "tones": {"edge_layer": "ok", "ppr_layer": "ok", "sdui_layer": "ok", "cache_layer": "ok"}},
                {"at": "say4", "caption": "All four subsystems synchronize into a unified, enterprise-grade streaming platform.", "values": {"edge_layer": {"text": "\"ONLINE (100%)\""}, "ppr_layer": {"text": "\"ONLINE (100%)\""}, "sdui_layer": {"text": "\"ONLINE (100%)\""}, "cache_layer": {"text": "\"ONLINE (100%)\""}}, "tones": {"edge_layer": "ok", "ppr_layer": "ok", "sdui_layer": "ok", "cache_layer": "ok"}}
            ]
        },
        {
            "template": "flow",
            "title": "Integrated Edge Middleware & Context Hydration Execution Pipeline",
            "nodes": [
                {"id": "client_req", "label": "Client HTTP Request (NYC / SG / LON)", "tappable": false},
                {"id": "rate_gate", "label": "Token Bucket Rate Limiter Check", "tappable": false},
                {"id": "auth_gate", "label": "Web Crypto JWT Verification", "tappable": false},
                {"id": "geo_context", "label": "Geo IP Header Injection & Origin Routing", "tappable": false}
            ],
            "steps": [
                {"at": "say1", "caption": "Incoming user request hits nearest edge PoP; rate limiter evaluates client IP bucket.", "values": {"client_req": {"text": "\"Incoming Request\""}, "rate_gate": {"text": "\"Checking Bucket (Quota: 3/5)\""}, "auth_gate": {"text": "\"Pending\""}, "geo_context": {"text": "\"Pending\""}}, "tones": {"client_req": "data", "rate_gate": "data", "auth_gate": "idle", "geo_context": "idle"}, "arrows": [["client_req", "rate_gate"]]},
                {"at": "say2", "caption": "Rate limiter allows valid traffic; rejects bot floods immediately with HTTP 429.", "values": {"client_req": {"text": "\"Traffic Cleared\""}, "rate_gate": {"text": "\"ALLOWED (Quota OK)\""}, "auth_gate": {"text": "\"Verifying JWT Signature\""}, "geo_context": {"text": "\"Pending\""}}, "tones": {"client_req": "ok", "rate_gate": "ok", "auth_gate": "data", "geo_context": "idle"}, "arrows": [["rate_gate", "auth_gate"]]},
                {"at": "say3", "caption": "Web Crypto validates JWT secret without database calls; rejects invalid signatures.", "values": {"client_req": {"text": "\"Authenticated\""}, "rate_gate": {"text": "\"Passed\""}, "auth_gate": {"text": "\"JWT Verified (<1ms)\""}, "geo_context": {"text": "\"Injecting Geo Headers\""}}, "tones": {"client_req": "ok", "rate_gate": "ok", "auth_gate": "ok", "geo_context": "data"}, "arrows": [["auth_gate", "geo_context"]]},
                {"at": "say4", "caption": "Middleware injects x-edge-geo: US-NYC header and forwards request to App Router origin.", "values": {"client_req": {"text": "\"Completed\""}, "rate_gate": {"text": "\"Passed\""}, "auth_gate": {"text": "\"Passed\""}, "geo_context": {"text": "\"Forwarded to Streaming Origin\""}}, "tones": {"client_req": "ok", "rate_gate": "ok", "auth_gate": "ok", "geo_context": "ok"}}
            ]
        },
        {
            "template": "boxes",
            "title": "PPR Streaming Coordinator: Progressive Chunks & Dynamic Holes",
            "boxes": [
                {"id": "chunk_0", "label": "Chunk 0 (T=0ms): Pre-rendered Static Shell (<header>, <nav>, Skeletons)", "tappable": false},
                {"id": "chunk_1", "label": "Chunk 1 (T=25ms): Dynamic Hole #1 (<section class='feed'>Live News</section>)", "tappable": false},
                {"id": "chunk_2", "label": "Chunk 2 (T=45ms): Dynamic Hole #2 (<section class='ticker'>AAPL, NVDA Quotes</section>)", "tappable": false},
                {"id": "stream_complete", "label": "Stream Completion (Total Time: 45ms, CLS: 0.000)", "tappable": false}
            ],
            "steps": [
                {"at": "say1", "caption": "Chunk 0 delivers the static shell in the very first TCP packet (TTFB 18ms).", "values": {"chunk_0": {"text": "\"Flushed Instantly (0ms)\""}, "chunk_1": {"text": "\"Querying Feed Service...\""}, "chunk_2": {"text": "\"Querying Market Service...\""}, "stream_complete": {"text": "\"In Flight\""}}, "tones": {"chunk_0": "ok", "chunk_1": "data", "chunk_2": "data", "stream_complete": "idle"}},
                {"at": "say2", "caption": "Dynamic Hole #1 resolves at T=25ms and replaces the feed skeleton in-place.", "values": {"chunk_0": {"text": "\"Painted\""}, "chunk_1": {"text": "\"Feed Streamed (25ms)\""}, "chunk_2": {"text": "\"Calculating Quotes...\""}, "stream_complete": {"text": "\"In Flight\""}}, "tones": {"chunk_0": "ok", "chunk_1": "ok", "chunk_2": "data", "stream_complete": "idle"}},
                {"at": "say3", "caption": "Dynamic Hole #2 resolves at T=45ms, streaming real-time equity quotes.", "values": {"chunk_0": {"text": "\"Painted\""}, "chunk_1": {"text": "\"Feed Ready\""}, "chunk_2": {"text": "\"Quotes Streamed (45ms)\""}, "stream_complete": {"text": "\"All Chunks Flushed\""}}, "tones": {"chunk_0": "ok", "chunk_1": "ok", "chunk_2": "ok", "stream_complete": "ok"}},
                {"at": "say4", "caption": "Entire page reaches interactive state in 45ms with absolute zero layout shift.", "values": {"chunk_0": {"text": "\"Zero Reflow\""}, "chunk_1": {"text": "\"Live Feed Active\""}, "chunk_2": {"text": "\"Live Quotes Active\""}, "stream_complete": {"text": "\"100% Complete (CLS: 0.000)\""}}, "tones": {"chunk_0": "ok", "chunk_1": "ok", "chunk_2": "ok", "stream_complete": "ok"}}
            ]
        },
        {
            "template": "component-tree",
            "title": "Portal SDUI Component Tree with Resilient Fallback Handling",
            "root": {
                "id": "portal_root",
                "name": "PortalShell (theme: 'dark')",
                "children": [
                    {
                        "id": "metrics_row",
                        "name": "MetricsRow (metrics-grid)",
                        "children": [
                            {"id": "stat_users", "name": "StatCard (Active Users: 18,420)"},
                            {"id": "stat_ttfb", "name": "StatCard (Edge TTFB: 14ms)"},
                            {"id": "ai_fallback", "name": "FallbackWidget ([Fallback: ExperimentalAiInsight])"}
                        ]
                    }
                ]
            },
            "steps": [
                {"at": "say1", "caption": "SDUI engine parses incoming wire schema and initializes the PortalShell dark theme.", "values": {"portal_root": {"state": "Theme: dark"}, "metrics_row": {"state": "Mounted"}, "stat_users": {"state": "Mounted"}, "stat_ttfb": {"state": "Mounted"}, "ai_fallback": {"state": "Evaluating"}}, "tones": {"portal_root": "ok", "metrics_row": "ok", "stat_users": "ok", "stat_ttfb": "ok", "ai_fallback": "data"}},
                {"at": "say2", "caption": "Standard registered StatCards render active user counts and edge TTFB latency.", "values": {"portal_root": {"state": "Active"}, "metrics_row": {"state": "Rendered"}, "stat_users": {"state": "18,420 Users"}, "stat_ttfb": {"state": "14ms TTFB"}, "ai_fallback": {"state": "Evaluating"}}, "tones": {"portal_root": "ok", "metrics_row": "ok", "stat_users": "ok", "stat_ttfb": "ok", "ai_fallback": "data"}},
                {"at": "say3", "caption": "Unregistered ExperimentalAiInsight widget triggers the defensive fallback handler.", "values": {"portal_root": {"state": "Active"}, "metrics_row": {"state": "Rendered"}, "stat_users": {"state": "Healthy"}, "stat_ttfb": {"state": "Healthy"}, "ai_fallback": {"state": "Fallback Rendered"}}, "tones": {"portal_root": "ok", "metrics_row": "ok", "stat_users": "ok", "stat_ttfb": "ok", "ai_fallback": "ok"}},
                {"at": "say4", "caption": "Declarative telemetry action is dispatched; zero crashes occur across the component tree.", "values": {"portal_root": {"state": "Stable"}, "metrics_row": {"state": "Stable"}, "stat_users": {"state": "Stable"}, "stat_ttfb": {"state": "Stable"}, "ai_fallback": {"state": "Telemetry Logged"}}, "tones": {"portal_root": "ok", "metrics_row": "ok", "stat_users": "ok", "stat_ttfb": "ok", "ai_fallback": "ok"}}
            ]
        },
        {
            "template": "compare",
            "title": "Milestone 10 Production SLA Certification Scorecard",
            "left": {"label": "Industry Baseline Standard", "items": ["Edge Auth Latency: 25.0ms", "Static Shell TTFB: 250.0ms", "Streaming Duration: 450.0ms", "Cumulative Layout Shift (CLS): 0.120", "SDUI Fallback Failure: 3.2%", "Cache Hit Ratio: 82.0%"]},
            "right": {"label": "Milestone 10 Enterprise Certified Portal", "items": ["Edge Auth Latency: 2.4ms (SLA <= 5.0ms)", "Static Shell TTFB: 18.2ms (SLA <= 35.0ms)", "Streaming Duration: 42.0ms (SLA <= 100.0ms)", "Cumulative Layout Shift: 0.000 (SLA <= 0.010)", "SDUI Fallback Failure: 0.0% (SLA <= 0.1%)", "Cache Hit Ratio: 99.4% (SLA >= 95.0%)"]},
            "steps": [
                {"at": "say1", "caption": "Sub-5ms edge authentication ensures instant, secure perimeter verification.", "values": {"left": {"items": ["25ms Auth Latency", "Central Auth API", "Slow Verification", "High Origin Burden"]}, "right": {"items": ["2.4ms Auth Latency", "Web Crypto at Edge", "Sub-Millisecond Check", "Origin Shielded"]}}, "tones": {"left": "error", "right": "ok"}},
                {"at": "say2", "caption": "PPR delivers sub-20ms TTFB and 42ms total streaming completion.", "values": {"left": {"items": ["250ms TTFB", "450ms Total Stream", "Blank Screen Lag", "High User Drop-off"]}, "right": {"items": ["18.2ms TTFB", "42.0ms Total Stream", "Instant Static Shell", "Zero User Drop-off"]}}, "tones": {"left": "error", "right": "ok"}},
                {"at": "say3", "caption": "Skeleton bounding box contracts guarantee a pristine CLS score of 0.000.", "values": {"left": {"items": ["CLS: 0.120 (Poor)", "Janky Layout Reflows", "Buttons Shift Around", "Failed Web Vitals"]}, "right": {"items": ["CLS: 0.000 (Perfect)", "Zero Layout Thrash", "Rock-Solid Elements", "100% Core Web Vitals"]}}, "tones": {"left": "error", "right": "ok"}},
                {"at": "say4", "caption": "Milestone 10 achieves 6/6 SLAs Passed with Grade A+ Enterprise Production Certification.", "values": {"left": {"items": ["Fragile Architecture", "High Operational Debt", "Frequent Downtime", "Uncertified Platform"]}, "right": {"items": ["World-Class Streaming", "Fault-Tolerant Platform", "99.99% Availability", "Grade A+ Certified"]}}, "tones": {"left": "error", "right": "ok"}}
            ]
        }
    ]
}

# Generate visual files for Days 51 to 55
for d in range(51, 56):
    day_data = days_data[d]
    specs = visual_templates_by_day[d]
    entries = []
    for i, part in enumerate(day_data['parts']):
        part_title = part['title']
        code_hash = sha256(part['code'])
        spec = specs[i]
        entries.append({
            "partTitle": part_title,
            "codeHash": code_hash,
            "spec": spec
        })
    visual_payload = {
        "schemaVersion": 2,
        "prefix": "react-basics",
        "day": d,
        "promptSha": "block11_generated",
        "model": "gpt-4o",
        "entries": entries
    }
    target_path = os.path.join(VISUALS_DIR, f'day-{d}.json')
    with open(target_path, 'w', encoding='utf-8') as f:
        json.dump(visual_payload, f, indent=2)
    print(f"Generated {target_path} with 5 visual entries!")

print("All Block 11 visual JSON files created successfully!")
