import os
import sys

sys.path.insert(0, os.path.abspath('scripts'))
from react_day37_data import day37

part4_extra = [
    "In addition to protecting against continuous user interactions, expiration timestamps serve as a fail-safe mechanism against pathological rendering edge cases. In highly dynamic applications with streaming real-time subscriptions, WebSocket pushes, and recurring timers, background transitions could theoretically be interrupted indefinitely if new higher-priority work is continuously queued. By converting starved tasks into synchronous executions at the deadline, React ensures that user interface state converges toward consistency within a bounded, predictable timeframe under all conditions."
]

part5_extra = [
    "To conclude our architecture of the 31-bit bitmask scheduler, consider how this mathematical foundation interfaces with the upcoming concepts of useTransition and useDeferredValue. When a component calls `startTransition(() => setState(...))`, React marks the resulting Fiber update with one of the 16 TransitionLanes. When the work loop encounters this update, it evaluates `lanes & -lanes` and begins rendering. If an urgent discrete event (such as a keypress in SyncLane) arrives before the transition completes, React immediately clears its in-progress transition work, yields to the browser, processes the SyncLane update, and only then resumes the TransitionLane.",
    "Mastering this priority model unlocks a profound shift in how frontend engineers reason about user experience. Instead of artificially throttling user input with debounce timers or introducing jarring loading spinners for every operation, developers can treat the UI as a concurrent, multi-lane execution canvas. Fast interactions stay fast, heavy computations yield gracefully, and the entire application behaves with the fluidity and responsiveness of a native operating system desktop application."
]

day37['parts'][3]['say'].extend(part4_extra)
day37['parts'][4]['say'].extend(part5_extra)

print("Updated Day 37 Word Counts:")
for i, p in enumerate(day37['parts']):
    wc = sum(len(s.split()) for s in p['say'])
    print(f"Part {i+1} ({p['title'][:35]}...): words={wc}")

output_py = []
output_py.append("import hashlib\n")
output_py.append("import json\n\n")
output_py.append("def sha256(text: str) -> str:\n")
output_py.append("    return hashlib.sha256(text.encode('utf-8')).hexdigest()\n\n")
output_py.append("day37 = " + repr(day37) + "\n")

with open('scripts/react_day37_data.py', 'w', encoding='utf-8') as f:
    f.write("".join(output_py))

print("Successfully updated scripts/react_day37_data.py!")
