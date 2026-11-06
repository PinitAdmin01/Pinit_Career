import os
import sys
import json
import re

sys.path.insert(0, os.path.abspath('scripts'))
from react_day36_data import day36

# Paragraph additions for each part
part1_additions = [
    "To fully appreciate why frame budget violations are so visually destructive, we must examine the hardware synchronization mechanism known as Vertical Synchronization (V-Sync). The display monitor reads from a memory buffer on the GPU (the front buffer) and paints pixels onto the screen row by row from top to bottom. If the browser writes new pixel data into this buffer while the monitor is mid-refresh, the display renders half of the old frame and half of the new frame simultaneously—a jarring visual artifact known as screen tearing. To eliminate tearing, modern graphics systems use double or triple buffering, swapping the back buffer to the front buffer exclusively during the vertical blanking interval between refresh cycles.",
    "When a long synchronous JavaScript task exceeds 16.6ms, the browser engine cannot produce a new back buffer before the next V-Sync signal arrives. As a result, the graphics compositor is forced to repeat the previous frame, creating a visible pause. If the long task lasts 50ms, three successive V-Sync signals pass with no updated frame, causing 48 milliseconds of frozen animation. Furthermore, because user inputs (such as scroll gestures and keystrokes) are queued in the operating system input buffer during this freeze, the browser processes all accumulated events in a sudden, jarring burst once the long task finishes. By respecting the 16.6ms frame budget through cooperative multitasking, applications ensure steady back-buffer delivery, preserving smooth 60 FPS motion and instant input responsiveness."
]

part2_additions = [
    "To understand why timer clamping exists in modern browser engines, we must look at how browsers implement the timer queue internally. Inside engines like Chromium's V8 and Blink, setTimeout callbacks are managed inside a min-heap indexed by their target expiration timestamps. When a timer callback fires and immediately schedules another zero-delay timer, it creates a recursive nesting chain. In early web browsers without nesting guards, misbehaved scripts containing infinite zero-delay timer loops would completely saturate the event loop, driving CPU utilization to 100%, spinning laptop cooling fans, and rapidly draining device batteries.",
    "In response to this battery drain issue, the browser vendor working group formalized the timer clamping specification within the HTML standard: once the nesting counter of a timer chain exceeds five consecutive iterations, any subsequent timer in that chain must be clamped to a minimum delay of at least 4 milliseconds. While this 4ms floor effectively prevents runaway legacy scripts from freezing the host operating system, it imposes a devastating latency tax on modern high-performance client applications. If an algorithm attempts to break a heavy calculation into 100 fine-grained chunks using setTimeout(fn, 0), the cumulative clamping overhead introduces 400 milliseconds of mandatory dead time where the main thread is completely idle, making setTimeout fundamentally unusable as a cooperative time-slicing transport.",
    "Developers sometimes wonder whether queueMicrotask or Promise.resolve().then() can circumvent this limitation. However, microtasks operate under entirely different scheduling semantics: the ECMAScript specification mandates that the entire microtask queue must be completely drained before the event loop can yield control to the browser rendering pipeline. If a scheduler used microtasks to schedule consecutive work slices, the work loop would run uninterrupted until all tasks completed, completely blocking style calculation, layout reflow, and paint passes. Thus, microtasks fail to solve the fundamental problem of cooperative rendering, leaving true macro-tasks as the only viable mechanism for yielding."
]

part3_additions = [
    "Inside React's open-source repository, the scheduler package implements this MessageChannel transport within Scheduler.js. When the scheduler initializes in a browser environment, it instantiates a new MessageChannel instance and assigns its message listener: channel.port1.onmessage = performWorkUntilDeadline. When work needs to be scheduled, the scheduler calls channel.port2.postMessage(null). Because message port events are dispatched as standard macro-tasks, the browser's event loop executes port1's message listener immediately after completing any pending rendering passes, ensuring true zero-latency scheduling without the artificial 4ms clamping penalty imposed on timers.",
    "This architecture establishes a clean, predictable handshake between React and the browser event loop. During each macro-task, React invokes its work loop, reconciling Fiber nodes until the 5ms slice deadline is reached. The moment shouldYield() returns true, React pauses the work loop, preserves its internal traversal pointers, and issues another channel.port2.postMessage(null) call. It then exits the current macro-task entirely. This clean exit allows the browser engine to regain full control of the main thread, run style recalculations, execute geometric layout reflows, rasterize dirty rectangles, and dispatch paint commands to the GPU. The moment the paint pass completes, the browser picks up React's pending MessageChannel macro-task and resumes reconciliation immediately.",
    "Recognizing the genius and necessity of React's cooperative scheduler design, the W3C Web Performance Working Group has developed native browser scheduling primitives directly inspired by React: the Prioritized Task Scheduling API (scheduler.postTask) and the cooperative yielding API (scheduler.yield). These modern browser APIs provide native operating-system-level thread prioritization and yielding without needing userland MessageChannel polyfills. However, because React must run flawlessly across older browser versions, hybrid web views, and mobile Safari environments where native scheduler APIs are unavailable, the rock-solid MessageChannel implementation remains the battle-tested standard for production concurrent scheduling."
]

part4_additions = [
    "The evolution of React's shouldYield() heuristic is a masterclass in pragmatic systems engineering. In earlier experimental versions of the Fiber reconciler, the React core team attempted to compute dynamic frame budgets dynamically using window.requestAnimationFrame. The scheduler would record the start timestamp of each animation frame, estimate the remaining milliseconds before the next hardware V-Sync pulse, and dynamically adapt its yield deadline. However, in real-world production testing across millions of client devices, this dynamic approach proved fragile. Devices with variable refresh rate displays (such as Apple ProMotion displays dynamically shifting between 24Hz, 60Hz, and 120Hz) caused calculation drift, while background tabs throttled requestAnimationFrame callbacks entirely, causing the scheduler to freeze.",
    "By transitioning to a fixed 5ms execution slice target (yieldInterval = 5ms), React eliminated all device-specific timing fragility. A 5ms execution window is short enough that it easily fits within the tightest 8.3ms frame budget of a 120Hz display, leaving more than 3ms for browser layout and GPU rasterization. Simultaneously, 5ms is long enough to amortize the overhead of macro-task context switching: because posting and receiving a MessageChannel message incurs approximately 20 to 50 microseconds of event loop overhead, running 5ms of continuous JavaScript work ensures that over 99% of CPU time is spent on productive rendering rather than scheduler bookkeeping.",
    "Furthermore, the shouldYield() heuristic is designed to be completely non-destructive to in-flight work. Because the Fiber reconciler operates on an immutable, pointer-based singly-linked list (child, sibling, return), pausing the work loop simply requires storing the reference to the currently executing Fiber node in a module-scoped variable (workInProgress). When the next macro-task fires, the work loop simply reads workInProgress and resumes execution with zero state loss, zero garbage collection thrashing, and zero need to re-evaluate previously completed branches of the component tree."
]

part5_additions = [
    "To ensure that our production task scheduler operates with enterprise-grade reliability, we must understand how it integrates with real-world browser performance telemetry. In production web applications, teams monitor main-thread responsiveness using the PerformanceObserver API, subscribing to 'longtask' entry types to capture any execution block that exceeds 50 milliseconds. When monolithic calculations are refactored to execute through our cooperative task scheduler with 5ms slices, Chrome DevTools and Google Lighthouse report a dramatic reduction in Total Blocking Time (TBT), directly elevating the application's Core Web Vitals Interaction to Next Paint (INP) score from 'poor' into the top 75th percentile 'good' bracket.",
    "Another critical design principle in production scheduler engineering is deterministic testing. In automated CI/CD environments and unit test runners (such as Vitest, Jest, or Node.js test runners), relying on real-world wall-clock timestamps (Date.now() or performance.now()) can introduce subtle non-determinism, as virtual machine load and CPU throttling can vary between test runs. By architecting our scheduler with an internal virtual clock model that tracks declared task duration weights, we achieve 100% deterministic, reproducible test output while maintaining the exact operational semantics of time-sliced cooperative multitasking.",
    "Finally, this cooperative scheduling architecture provides the foundational bedrock for the advanced React hooks we will explore in subsequent days of this block. When you invoke useTransition or useDeferredValue, React internally assigns priority levels to your updates and schedules them through this exact cooperative macro-task pipeline. By mastering the low-level mechanics of time-slicing and cooperative yielding today, you possess the mental model necessary to build lightning-fast, non-blocking user interfaces that remain silky smooth regardless of dataset complexity."
]

# Append additions to each part's say array
day36['parts'][0]['say'].extend(part1_additions)
day36['parts'][1]['say'].extend(part2_additions)
day36['parts'][2]['say'].extend(part3_additions)
day36['parts'][3]['say'].extend(part4_additions)
day36['parts'][4]['say'].extend(part5_additions)

# Check word counts
print("Updated Day 36 Word Counts:")
for i, p in enumerate(day36['parts']):
    wc = sum(len(s.split()) for s in p['say'])
    print(f"Part {i+1} ({p['title'][:35]}...): words={wc}")

# Re-write react_day36_data.py
output_py = []
output_py.append("import hashlib\n")
output_py.append("def sha256(text: str) -> str:\n")
output_py.append("    return hashlib.sha256(text.encode('utf-8')).hexdigest()\n\n")
output_py.append("day36 = " + repr(day36) + "\n")

with open('scripts/react_day36_data.py', 'w', encoding='utf-8') as f:
    f.write("".join(output_py))

print("Successfully updated scripts/react_day36_data.py!")
