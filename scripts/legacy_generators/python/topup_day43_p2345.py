import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/build_day43_file.py', 'r', encoding='utf-8') as f:
    text = f.read()

p2_extra = '''    "To understand the low-level Fiber reconciler mechanics, inspect what happens during selective hydration. In React 17, the work loop walked the entire work-in-progress Fiber tree synchronously, executing completeWork and commitRoot in one uninterrupted phase. In React 18, each Suspense boundary creates a fiber with the flag ForceClientHydration or DeferHydration. The reconciler hydrates one subtree, yields control back to the browser's MessageChannel scheduler, checks if any user events are queued, and resumes hydration in the next tick.",
    "This cooperative multitasking model prevents hydration from starving the browser's compositor thread. Even if a user is rapidly scrolling down a lengthy product catalog, the scroll gestures and touch physics remain buttery smooth at 60 or 120 frames per second, because React yields before frame deadlines are violated.",
'''

p3_extra = '''    "An illuminating comparison is contrasting React's event replay with naive DOM event listeners. In naive implementations where developers manually bind addEventListener after an asynchronous fetch, any click occurring before the script runs is discarded by the browser. By registering capture-phase listeners on the document root before any component renders, React acts as a global event safety net, guaranteeing zero dropped clicks across the entire session.",
    "Furthermore, this replay mechanism is fully coordinated with React's synthetic event pool and event batching. When the replayed event is dispatched, state updates triggered by the event are automatically batched with any pending transitions, preventing intermediate visual flickers and ensuring that state transitions commit atomically.",
'''

p4_extra = '''    "Delving into the 31-bit Lane bitmask allocation reveals how hydration lanes interact with user transitions. In React's lane architecture, hydration work is mapped to specific lane ranges: SyncHydrationLane, DefaultHydrationLane, and IdleHydrationLane. When an unhydrated island is clicked, the lane scheduler executes a bitwise OR operation, combining the island's pending lanes with SyncLane (0b0000000000000000000000000000001).",
    "This bitmask manipulation immediately elevates the island above all transition work. Even if a heavy useTransition state computation or deferred data query is in progress, the SyncLane hydration preempts that work immediately. Once the urgent island is hydrated and its event replayed, the reconciler resumes the interrupted background transition right where it left off, maintaining absolute priority discipline.",
'''

p5_extra = '''    "In our upcoming Milestone 8 project, this selective hydration engine will directly power the interactive e-commerce product catalog. The catalog's header and product specifications will hydrate immediately, while the complex customer reviews stream and personalized recommendations hydrate lazily in the background. If a customer clicks 'Add to Cart' before reviews finish hydrating, React will promote the cart button, execute the purchase, and leave the reviews to hydrate smoothly during idle frames.",
    "By mastering the synthesis of Suspense boundaries, priority promotion, and interaction replay, you possess the architectural capability to build web applications that achieve flawless 100/100 Core Web Vitals scores while supporting arbitrary UI complexity and rich interactive depth.",
'''

def insert_before_bracket(content, var_name, addition):
    target = f"{var_name} = ["
    idx = content.find(target)
    if idx == -1:
        raise Exception(f"Could not find {target}")
    close_idx = content.find("]", idx)
    return content[:close_idx] + addition + content[close_idx:]

new_text = insert_before_bracket(text, "p2_say", p2_extra)
new_text = insert_before_bracket(new_text, "p3_say", p3_extra)
new_text = insert_before_bracket(new_text, "p4_say", p4_extra)
new_text = insert_before_bracket(new_text, "p5_say", p5_extra)

with open('scripts/build_day43_file.py', 'w', encoding='utf-8') as f:
    f.write(new_text)

print("Topped up Day 43 parts 2-5 successfully!")
