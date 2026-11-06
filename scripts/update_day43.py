import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/build_day43_file.py', 'r', encoding='utf-8') as f:
    text = f.read()

p1_add = '''    "To quantify this problem from an engineering standpoint, consider Google's Core Web Vitals metric: Total Blocking Time (TBT). Total Blocking Time measures the total amount of time between First Contentful Paint (FCP) and Time to Interactive (TTI) where the main thread was blocked by any task lasting longer than 50 milliseconds. In a traditional monolithic hydration pass of a complex dashboard containing 3,000 DOM nodes, the single hydration task often runs continuously for 250 to 450 milliseconds. This yields an immediate TBT penalty of 200 to 400 milliseconds, instantly dragging the page's performance score down from green into red.",
    "Furthermore, on low-end mobile devices, prolonged monolithic hydration triggers thermal throttling and aggressive garbage collection cycles. As React instantiates thousands of Fiber nodes, hook closures, and synthetic event wrappers simultaneously in a single turn of the event loop, V8's Young Generation heap overflows, forcing major scavenge and mark-sweep GC pauses. The phone's CPU cores spike to 100% utilization, battery drains, and the device stutters noticeably. Selective Hydration eliminates these giant allocations by breaking hydration into micro-batches.",
'''

p2_add = '''    "A profound architectural consequence of Suspense-driven subtree segmentation is the ability to stream hydration code alongside HTML. In React 17, the browser had to download the entire application JavaScript bundle before hydration could begin anywhere on the page. In React 18 and 19, when combined with React.lazy and Server Components, each Suspense boundary corresponds to a distinct code-splitting chunk. React can begin hydrating the navigation bar while the JavaScript chunk for the comments section is still traveling across the network!",
    "This decoupled loading means that slow client scripts for secondary features no longer delay interactivity for primary features. If a third-party charting widget or customer review carousel takes an extra 400 milliseconds to download over a cellular connection, the core buy button and product variant picker hydrate immediately, enabling instant user engagement without waiting for non-critical assets.",
'''

p3_add = '''    "To appreciate the engineering rigor of React's event replay mechanism, consider how edge cases are handled. What if the user clicks the unhydrated button twice in rapid succession, or clicks and then drags? React's event queue does not merely buffer a single generic callback; it records the full fidelity of the synthetic interaction: event phase, pointer coordinates, modifier keys (Shift, Alt, Meta), timestamps, and touch target identifiers.",
    "When priority promotion occurs, React ensures that the replayed event maintains complete chronological causality. If a user clicks an unhydrated navigation menu and then immediately clicks an unhydrated search input, React promotes both islands in the exact order of interaction, hydrating the menu first, replaying the menu click, then hydrating the search input, and replaying the focus event. The user perceives an uninterrupted, flawlessly responsive application that never drops an input frame.",
'''

p4_add = '''    "Under the hood, lane allocation during hydration interacts directly with React's MessageChannel scheduler. When React is performing background hydration on DefaultLane or IdleLane, it checks the 5ms cooperative time slice budget via shouldYieldToHost() after every Fiber subtree. If the 5ms deadline expires, React pauses hydration, returns execution control to the browser's event loop to allow UI reflows and input events to process, and schedules the continuation via port2.postMessage().",
    "In large enterprise applications with deep component hierarchies, this cooperative scheduling is complemented by memory-aware lane heuristics. If the browser reports low device memory via navigator.deviceMemory or indicates battery saver mode, enterprise architectures can dynamically demote below-the-fold hydration entirely until explicit user intent is signaled through mouse hover or viewport intersection, preserving hardware resources.",
'''

p5_add = '''    "In mission-critical enterprise platforms—such as high-frequency trading dashboards, SaaS productivity suites, and massive e-commerce marketplaces—this selective hydration engine forms the backbone of modern front-end reliability. By replacing fragile monolithic hydration with priority-driven concurrent islands, engineering teams achieve zero-regression interactivity across low-end mobile phones and high-end desktop workstations alike.",
    "As we prepare for Day 44's exploration of Server Actions and mutative transitions, notice how Selective Hydration completes the read side of the application lifecycle: Server Components stream the UI, Streaming SSR paints pixels immediately, and Selective Hydration activates interactivity without freezing the UI. In the upcoming session, we will turn to the write side: handling form actions, optimistic state updates, and automated server cache revalidations.",
'''

def insert_before_bracket(content, var_name, addition):
    target = f"{var_name} = ["
    idx = content.find(target)
    if idx == -1:
        raise Exception(f"Could not find {target}")
    close_idx = content.find("]", idx)
    return content[:close_idx] + addition + content[close_idx:]

new_text = insert_before_bracket(text, "p1_say", p1_add)
new_text = insert_before_bracket(new_text, "p2_say", p2_add)
new_text = insert_before_bracket(new_text, "p3_say", p3_add)
new_text = insert_before_bracket(new_text, "p4_say", p4_add)
new_text = insert_before_bracket(new_text, "p5_say", p5_add)

with open('scripts/build_day43_file.py', 'w', encoding='utf-8') as f:
    f.write(new_text)

print("Updated build_day43_file.py successfully!")
