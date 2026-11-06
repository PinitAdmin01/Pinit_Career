import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/build_day43_file.py', 'r', encoding='utf-8') as f:
    text = f.read()

add_p2 = '    "This progressive hydration architecture is especially transformative on high-latency mobile networks. Even if the user is traveling through tunnels or low-signal rural zones with high packet loss, the client application activates features incrementally as packets arrive, providing responsive feedback instead of freezing.",\n'
add_p3 = '    "In multi-touch devices, React even handles complex pointer gestures during priority promotion. If a user begins a pinch-to-zoom or swipe gesture on an unhydrated carousel, React promotes the carousel island, binds the pointer handlers, and seamlessly hands off gesture tracking to the component without dropping touch events.",\n'
add_p4 = '    "In production monitoring, enterprise teams track these lane allocations using React DevTools profiler traces. By observing how many islands hydrate on IdleLane versus SyncLane, engineers can measure whether user interactions are frequently encountering unhydrated states, allowing targeted tuning of viewport prefetching thresholds.",\n'
add_p5 = '    "By decoupling visual rendering from interactive hydration, Selective Hydration bridges the final performance divide between server-rendered applications and client-side single page apps. The browser achieves the instantaneous load speeds of static HTML combined with the full rich statefulness of modern React.",\n'

def insert_before_bracket(content, var_name, addition):
    target = f"{var_name} = ["
    idx = content.find(target)
    if idx == -1:
        raise Exception(f"Could not find {target}")
    close_idx = content.find("]", idx)
    return content[:close_idx] + addition + content[close_idx:]

new_text = insert_before_bracket(text, "p2_say", add_p2)
new_text = insert_before_bracket(new_text, "p3_say", add_p3)
new_text = insert_before_bracket(new_text, "p4_say", add_p4)
new_text = insert_before_bracket(new_text, "p5_say", add_p5)

with open('scripts/build_day43_file.py', 'w', encoding='utf-8') as f:
    f.write(new_text)

print("Topped up Day 43 parts successfully!")
