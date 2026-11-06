import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/build_day42_file.py', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's inspect where each array is and expand it
p1_add = '''    "To appreciate the user experience transformation, compare the Core Web Vitals metrics. In traditional SSR, the user stares at a blank screen for 600ms to 1200ms while waiting for backend queries to resolve. Once the HTML finally arrives, the entire page renders at once, but the main thread is immediately locked up by a massive hydration script. Under Streaming SSR, First Contentful Paint drops to under 80 milliseconds. The user sees a fully styled layout immediately, complete with animated skeletons that provide clear visual reassurance that content is actively loading.",
'''

p2_add = '''    "When configuring reverse proxies—such as NGINX, Cloudflare, Envoy, or AWS Application Load Balancers—a critical operational requirement emerges: disabling response buffering. By default, many production proxies buffer backend responses in memory up to 64KB or 128KB before transmitting them to the client. If proxy buffering is left enabled, the reverse proxy absorbs React's early shell flush and holds it in memory until the entire response finishes, inadvertently degrading Streaming SSR back into traditional blocking SSR! In NGINX, engineers must specify 'proxy_buffering off;' and send the 'X-Accel-Buffering: no' header to ensure chunks pass through instantly.",
    "Furthermore, in modern HTTP/2 and HTTP/3 multiplexed architectures, streaming chunks are broken into binary DATA frames assigned to specific stream identifiers. This eliminates HTTP/1.1 head-of-line blocking on the connection level. The browser can receive an HTML stream chunk, an image binary asset, and a CSS stylesheet simultaneously over a single interleaved TCP/QUIC socket without waiting for sequential transmission.",
'''

p3_add = '''    "Beyond raw DOM insertion, a vital question arises: how does React hydrate this out-of-order chunk once it arrives in the browser? In traditional architectures, hydration required a single monolithic traversal of the entire document. With Streaming SSR, React selectively hydrates each chunk as soon as its replacement script executes! The browser runtime does not need to wait for lower page sections to load before attaching event listeners to the newly rendered reviews.",
    "Additionally, to deliver a seamless visual experience, enterprise design systems coordinate CSS transitions with $RC replacement scripts. When the fallback skeleton is replaced with the live reviews markup, CSS opacity fade-ins and height animations smooth the transition, eliminating cumulative layout shifts (CLS) and preventing jarring visual jumps as content streams into view.",
'''

p4_add = '''    "In enterprise observability architectures, handling streaming errors requires dedicated telemetry integration. When an error occurs mid-stream inside a nested boundary, React invokes the server-side onError callback with the error instance and component stack trace. Production monitoring platforms (such as Datadog, Sentry, or OpenTelemetry) capture these streaming exceptions, tagging them with unique request correlation IDs.",
    "Crucially, nested Error Boundaries allow fine-grained failure isolation. If the live reviews service suffers an outage, only the reviews card displays an inline warning banner with a retry button. The rest of the product page—pricing, technical specifications, and the interactive Add-to-Cart checkout button—remains fully operational. Customers can still purchase the product even when secondary recommendation systems are experiencing backend degradation.",
'''

p5_add = '''    "When contrasting React's streaming model with alternative architectures—such as static site generation (SSG) or partial hydration islands in frameworks like Astro—React's unified streaming pipeline provides a singular advantage: continuity of component identity and state. Because the streaming renderer outputs a cohesive virtual element model, client-side React can seamlessly transition from server-rendered HTML into active client-side component trees without tearing down the DOM.",
    "As we advance into hybrid architectures, this streaming engine also serves as the transport vehicle for React Server Component wire streams. During initial page delivery, modern meta-frameworks like Next.js App Router stream both the rendered HTML markup (for instant human viewing) and the parallel RSC wire format tokens (for client React hydration) over the exact same chunked HTTP connection. This dual-stream delivery guarantees that the browser receives both visual pixels and interactive Fiber data with zero wasted network round trips.",
'''

def insert_before_bracket(content, var_name, addition):
    target = f"{var_name} = ["
    idx = content.find(target)
    if idx == -1:
        raise Exception(f"Could not find {target}")
    # find closing bracket for this array
    close_idx = content.find("]", idx)
    return content[:close_idx] + addition + content[close_idx:]

new_text = insert_before_bracket(text, "p1_say", p1_add)
new_text = insert_before_bracket(new_text, "p2_say", p2_add)
new_text = insert_before_bracket(new_text, "p3_say", p3_add)
new_text = insert_before_bracket(new_text, "p4_say", p4_add)
new_text = insert_before_bracket(new_text, "p5_say", p5_add)

with open('scripts/build_day42_file.py', 'w', encoding='utf-8') as f:
    f.write(new_text)

print("Updated build_day42_file.py successfully!")
