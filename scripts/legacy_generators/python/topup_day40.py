with open('scripts/design_day40_data.py', 'r', encoding='utf-8') as f:
    text = f.read()

# Part 1
p1_old = """                "Architecturally, the Coordinator enforces four strict invariants across the entire application: First, LIFO Escape Key Unwinding—pressing Escape dismisses only the topmost active layer. Second, Scoped Outside-Click Interception—clicking outside the topmost layer dismisses only that layer, without triggering buttons on underlying layers. Third, Nested Focus Management—focus is strictly locked to the topmost modal or sheet, while underlying layers remain temporarily inert. Fourth, Reference-Counted Scroll Locking—the document body remains scroll-locked until the very last modal unmounts.",
                "Let us model this Unified Layer & Focus Coordinator in TypeScript. We will build a centralized registry that manages multi-layered overlay lifecycles, assigns deterministic z-index elevations, and coordinates global keyboard events."
            ],"""

p1_new = """                "Architecturally, the Coordinator enforces four strict invariants across the entire application: First, LIFO Escape Key Unwinding—pressing Escape dismisses only the topmost active layer. Second, Scoped Outside-Click Interception—clicking outside the topmost layer dismisses only that layer, without triggering buttons on underlying layers. Third, Nested Focus Management—focus is strictly locked to the topmost modal or sheet, while underlying layers remain temporarily inert. Fourth, Reference-Counted Scroll Locking—the document body remains scroll-locked until the very last modal unmounts.",
                "Consider also how our coordinator manages backdrop stacking and visual hierarchy. If every layer in a three-layer stack rendered a sixty-percent black backdrop scrim, the screen would progressively darken into an impenetrable black abyss (`0.6 + 0.6 + 0.6`), rendering underlying contextual forms completely invisible. The Coordinator resolves this by applying a Single Backdrop Protocol: only the lowest active modal layer renders a primary backdrop scrim, while subsequent child popovers or nested confirmation dialogs either skip the backdrop entirely or render a delicate fifteen-percent atmospheric tint.",
                "This guarantees that the user maintains visual continuity with the parent workflow while recognizing the active child prompt. Furthermore, the coordinator guarantees zero memory leaks: when an overlay unmounts through route transitions or component teardowns, its entry in the active stack is pruned automatically.",
                "Let us model this Unified Layer & Focus Coordinator in TypeScript. We will build a centralized registry that manages multi-layered overlay lifecycles, assigns deterministic z-index elevations, and coordinates global keyboard events."
            ],"""

text = text.replace(p1_old, p1_new)

# Part 2
p2_old = """                "Furthermore, our state machine manages backdrop occlusion transitions. When a child modal opens in front of an existing drawer, the drawer's backdrop dims further or remains stationary, while the child modal renders its own high-contrast backdrop scrim. This visual depth cues the user that they are operating in an isolated sub-context.",
                "Let us build an enterprise Overlay State Machine in TypeScript. We will implement atomic Push and Pop transitions, capture-phase outside-click interception, event cancellation, and verified stack integrity."
            ],"""

p2_new = """                "Furthermore, our state machine manages backdrop occlusion transitions. When a child modal opens in front of an existing drawer, the drawer's backdrop dims further or remains stationary, while the child modal renders its own high-contrast backdrop scrim. This visual depth cues the user that they are operating in an isolated sub-context.",
                "In addition to pointer click capture, our state machine must handle touch device interaction nuances. On touchscreens, a user may rest their thumb on the screen or perform a continuous drag gesture that begins inside the overlay and ends outside on the backdrop. In naive implementations, this registers as an outside click upon finger release, unintentionally dismissing the modal while the user was simply attempting to scroll.",
                "Our state machine resolves this by tracking both pointer-down and pointer-up targets: a dismissal is confirmed if and only if both the `pointerdown` and `pointerup` events occurred outside the topmost container. If the gesture originated inside the container, outside dismissal is strictly inhibited, eliminating accidental gesture dismissals.",
                "Moreover, the state machine coordinates atomic transition states: IDLE, PUSHING, ACTIVE, POPPING, and DISMISSED. By preventing user inputs during the brief three-hundred-millisecond transition window, the state machine eliminates double-click race conditions where rapid clicking could trigger duplicate pushes.",
                "Let us build an enterprise Overlay State Machine in TypeScript. We will implement atomic Push and Pop transitions, capture-phase outside-click interception, event cancellation, and verified stack integrity."
            ],"""

text = text.replace(p2_old, p2_new)

# Part 3
p3_old = """                "Once the First Officer certifies the auxiliary unit and closes the manual, command immediately returns to the exact line item where the Captain paused on the primary clipboard. At no point do both pilots attempt to read conflicting checklists simultaneously. Our Focus Stack Ledger provides this exact synchronized cockpit checklist.",
                "Let us model an enterprise Nested Focus Stack Engine in TypeScript. We will implement focus trap pausing, ledger stack caching, defensive focus restoration, and certified garbage-collection cleanup with zero memory leaks."
            ],"""

p3_new = """                "Once the First Officer certifies the auxiliary unit and closes the manual, command immediately returns to the exact line item where the Captain paused on the primary clipboard. At no point do both pilots attempt to read conflicting checklists simultaneously. Our Focus Stack Ledger provides this exact synchronized cockpit checklist.",
                "Consider also defensive focus recovery when a trigger element disappears from the DOM. What happens if a user opens a confirmation popover from a 'Delete Item' button inside a table row, confirms the deletion, and the parent table immediately re-renders, purging that button from the DOM entirely? If the focus engine blindly attempts to call `.focus()` on the cached element reference, the browser fails silently and drops focus to the document body.",
                "Our Nested Focus Stack Engine implements Defensive Fallback Focus Resolution: when attempting focus restoration, it verifies whether the target element is still connected to the active document tree (`document.contains(element)`). If the original trigger was destroyed, the engine gracefully traverses upward to the nearest surviving ancestor container (such as the parent table or modal body), guaranteeing that assistive software never gets disoriented in the void.",
                "Let us model an enterprise Nested Focus Stack Engine in TypeScript. We will implement focus trap pausing, ledger stack caching, defensive fallback focus restoration, and certified garbage-collection cleanup with zero memory leaks."
            ],"""

text = text.replace(p3_old, p3_new)

# Part 4
p4_old = """                "Only an automobile that survives these brutal extremes earns safety certification for passenger transport on public highways. In enterprise frontend engineering, automated chaos stress-testing is our structural crash barrier: proving that our design system never freezes, leaks focus, or crashes user workflows under extreme operational pressure.",
                "Let us write and execute a complete Multi-Layered Overlay Stress-Test Suite in TypeScript. We will simulate concurrent multi-layered stacking, rapid Escape key unwinding bursts, outside-click chaos, and assert zero memory leaks."
            ],"""

p4_new = """                "Only an automobile that survives these brutal extremes earns safety certification for passenger transport on public highways. In enterprise frontend engineering, automated chaos stress-testing is our structural crash barrier: proving that our design system never freezes, leaks focus, or crashes user workflows under extreme operational pressure.",
                "In our stress-testing framework, we also simulate asynchronous race conditions. Suppose an institutional trader triggers an asynchronous trade execution modal. While the network promise is in-flight, the user hits the Escape key, but three milliseconds later the server responds with an error popover. If the lifecycle states are loosely coupled, the error popover could mount into a destroyed modal container, creating an orphaned zombie layer that blocks user input indefinitely.",
                "By writing comprehensive automated stress tests that simulate concurrent event dispatches, network latency spikes, and cancelled promises, we guarantee that our overlay architecture remains deterministic under all operating conditions. Every test verifies explicit invariants: the stack depth must accurately match the count of mounted DOM nodes, all paused traps must resume in exact reverse order, and zero dangling event listeners may persist.",
                "Let us write and execute a complete Multi-Layered Overlay Stress-Test Suite in TypeScript. We will simulate concurrent multi-layered stacking, rapid Escape key unwinding bursts, outside-click chaos, and assert zero memory leaks."
            ],"""

text = text.replace(p4_old, p4_new)

# Part 5
p5_old = """                "Let us write and execute this complete, production-grade Institutional Trading Station Multi-Layered Overlay Hub in TypeScript. We will simulate the entire multi-layered transaction lifecycle, assert complete architectural invariants, and certify 100% completion of Block 8.",
                "This capstone system represents the absolute zenith of modern frontend design systems engineering: combining mathematical rigor, fluid physics, uncompromised accessibility, and enterprise-grade reliability."
            ],"""

p5_new = """                "Let us write and execute this complete, production-grade Institutional Trading Station Multi-Layered Overlay Hub in TypeScript. We will simulate the entire multi-layered transaction lifecycle, assert complete architectural invariants, and certify 100% completion of Block 8.",
                "Notice also the architectural elegance of our decoupled event bus. Individual trading widgets do not require direct coupling to one another: the portfolio audit sheet does not need to know the internal implementation of the liquidation modal, and the liquidation modal does not need to know the mechanics of the date-picker popover. Each component interacts exclusively through our centralized coordinator and state machine interfaces.",
                "This clean separation of concerns ensures that as our design system scales across dozens of enterprise engineering squads—each building independent trading micro-frontends—the multi-layered overlay mechanics remain unified, accessible, and completely immune to regression defects.",
                "This capstone system represents the absolute zenith of modern frontend design systems engineering: combining mathematical rigor, fluid physics, uncompromised accessibility, and enterprise-grade reliability."
            ],"""

text = text.replace(p5_old, p5_new)

with open('scripts/design_day40_data.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated Day 40 texts!")
