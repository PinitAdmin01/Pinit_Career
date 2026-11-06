with open('scripts/design_day39_data.py', 'r', encoding='utf-8') as f:
    text = f.read()

# Part 1 topup
p1_old = """                "Furthermore, enterprise design systems must account for responsive breakpoints. A navigation menu that renders as a persistent left-hand sidebar on a twenty-seven-inch desktop monitor must automatically transform into an off-canvas overlay drawer on a tablet, and collapse into an ergonomic bottom sheet on a mobile smartphone. Managing this responsive polymorphic transformation requires clean decoupling of component state from CSS layout positioning.",
                "Let us build an enterprise Drawer and Sheet Layout Classifier in TypeScript. Our engine will model viewport breakpoints, evaluate modal overlay versus push modes, and generate appropriate CSS flexbox and transform layout configurations with zero layout thrashing."
            ],"""

p1_new = """                "Furthermore, enterprise design systems must account for responsive breakpoints. A navigation menu that renders as a persistent left-hand sidebar on a twenty-seven-inch desktop monitor must automatically transform into an off-canvas overlay drawer on a tablet, and collapse into an ergonomic bottom sheet on a mobile smartphone. Managing this responsive polymorphic transformation requires clean decoupling of component state from CSS layout positioning.",
                "Performance considerations also dictate how transitions are implemented. In naive layouts, developers animate `left`, `right`, or `margin` properties during drawer opening. Animating layout properties forces the browser to recalculate layout geometry and repaint pixels on every single frame, causing severe frame stutter and high GPU thermal throttling on mobile devices. Production-grade systems animate exclusively via CSS `transform: translate3d()` and `opacity`, offloading compositing directly to the device graphics processor for silky sixty-frames-per-second motion.",
                "Let us build an enterprise Drawer and Sheet Layout Classifier in TypeScript. Our engine will model viewport breakpoints, evaluate modal overlay versus push modes, and generate appropriate CSS flexbox and transform layout configurations with zero layout thrashing."
            ],"""

text = text.replace(p1_old, p1_new)

# Part 2 topup
p2_old = """                "To understand touch gesture physics through an everyday physical analogy, consider pulling down a spring-loaded window shade or roller blind in a sunlit bedroom. When you pull the shade cord down gently, it glides smoothly along its vertical guide wire. If you give the cord a sharp, rapid tug downward, the internal ratchet mechanism releases, and the blind snaps rolled up instantly. If you tug when the blind is already fully extended, the spring tension creates firm physical resistance. Digital bottom sheets replicate this exact spring-loaded roller blind physics.",
                "Let us implement an enterprise Touch Gesture & Velocity Tracking Engine in TypeScript. We will model pointer tracking, calculate instantaneous velocity vectors, apply rubber-band damping, and execute threshold snap decisions."
            ],"""

p2_new = """                "To understand touch gesture physics through an everyday physical analogy, consider pulling down a spring-loaded window shade or roller blind in a sunlit bedroom. When you pull the shade cord down gently, it glides smoothly along its vertical guide wire. If you give the cord a sharp, rapid tug downward, the internal ratchet mechanism releases, and the blind snaps rolled up instantly. If you tug when the blind is already fully extended, the spring tension creates firm physical resistance. Digital bottom sheets replicate this exact spring-loaded roller blind physics.",
                "We must also manage gesture conflict resolution when the bottom sheet contains internal scrollable content—such as a list of fifty bank transactions. What happens when the user places their finger in the middle of the sheet and drags downward? Are they trying to scroll the transaction list to see older records, or are they trying to drag the entire sheet down to dismiss it?",
                "To resolve this ambiguity, enterprise bottom sheets implement Nested Scroll Interception. If the internal scroll container's `scrollTop` is greater than zero, the touch event is consumed exclusively by internal content scrolling; the sheet remains firmly locked at its full height. Only when `scrollTop === 0` (the user has scrolled to the absolute top of the internal list) does a continuing downward drag transfer authority to the outer sheet kinematics engine, initiating drag-to-dismiss.",
                "Let us implement an enterprise Touch Gesture & Velocity Tracking Engine in TypeScript. We will model pointer tracking, calculate instantaneous velocity vectors, apply rubber-band damping, and execute threshold snap decisions."
            ],"""

text = text.replace(p2_old, p2_new)

# Part 3 topup
p3_old = """                "To master the virtual keyboard, enterprise systems subscribe to the modern browser `window.visualViewport` API. Unlike `window.innerHeight`, `window.visualViewport.height` reports the exact remaining visible screen area above the software keyboard. When the keyboard opens, the bottom sheet automatically translates upward or adjusts its scroll offset to keep the focused input visible.",
                "Let us model a Mobile Viewport Shield Engine in TypeScript. We will simulate dynamic address bar state changes, notch safe area insets, and visual viewport virtual keyboard resize events to guarantee bulletproof mobile rendering."
            ],"""

p3_new = """                "To master the virtual keyboard, enterprise systems subscribe to the modern browser `window.visualViewport` API. Unlike `window.innerHeight`, `window.visualViewport.height` reports the exact remaining visible screen area above the software keyboard. When the keyboard opens, the bottom sheet automatically translates upward or adjusts its scroll offset to keep the focused input visible.",
                "Consider also the hazardous phenomenon of Over-Scroll Bouncing (rubber-banding) on iOS Safari. If a user scrolls to the bottom of a sheet and drags further, the entire Safari browser window shifts, exposing the light gray browser canvas behind the web application. When the drag releases, the browser snaps back violently, often desynchronizing fixed position elements.",
                "To defeat overscroll bouncing, enterprise bottom sheets apply `overscroll-behavior: contain` to the sheet container and `touch-action: pan-y` to the drag handle. This CSS declaration instructs the browser's touch subsystem that scroll chaining must terminate strictly within the sheet, forbidding the mobile operating system from hijacking the gesture into a window-level bounce.",
                "Let us model a Mobile Viewport Shield Engine in TypeScript. We will simulate dynamic address bar state changes, notch safe area insets, and visual viewport virtual keyboard resize events to guarantee bulletproof mobile rendering."
            ],"""

text = text.replace(p3_old, p3_new)

# Part 4 topup
p4_old = """                "Once their task is complete, they exit through the hatch, and the submarine main cabin pressure door re-engages seamlessly (focus restoration). At no point are both doors open simultaneously, which would flood the cabin. In software, focus trapping and inert boundaries prevent navigational flooding.",
                "Let us model an enterprise Accessible Sheet Controller in TypeScript. We will implement ARIA contracts, manage inert background toggling, execute focus trapping and restoration, and verify keyboard Escape listeners."
            ],"""

p4_new = """                "Once their task is complete, they exit through the hatch, and the submarine main cabin pressure door re-engages seamlessly (focus restoration). At no point are both doors open simultaneously, which would flood the cabin. In software, focus trapping and inert boundaries prevent navigational flooding.",
                "Accessibility also requires comprehensive voice announcement of sliding state transitions. Sighted users see the sheet slide smoothly upward over three hundred milliseconds. Visually impaired users relying on screen readers receive zero information from a CSS transform. Therefore, our accessible sheet manager coordinates with ARIA live regions: upon mount, a polite live announcement vocalizes 'Panel opened', and upon dismissal, 'Panel closed'.",
                "Furthermore, touch accessibility mandates that users with motor impairments or those utilizing switch-access devices have an alternative to drag-to-dismiss gestures. Swiping a finger with specific velocity is physically impossible for users with tremors or paralyzed limbs. Every bottom sheet must include an unambiguous, high-contrast close button (`✕`) at the top-right corner with a minimum touch hit-target size of forty-four by forty-four physical pixels, satisfying WCAG 2.1 Success Criterion 2.5.5 (Target Size).",
                "Let us model an enterprise Accessible Sheet Controller in TypeScript. We will implement ARIA contracts, manage inert background toggling, execute focus trapping and restoration, and verify keyboard Escape listeners."
            ],"""

text = text.replace(p4_old, p4_new)

# Part 5 topup
p5_old = """                "Let us model and execute this complete Sovereign Mobile Banking Sheet system in TypeScript. We will simulate the complete lifecycle: viewport shielding, drag displacement, velocity threshold evaluation, and accessible focus restoration.",
                "This production-grade mobile overlay system represents the gold standard of mobile design engineering: delivering native-caliber fluid physics, zero layout shift, and uncompromised accessibility across millions of daily financial transactions."
            ],"""

p5_new = """                "Let us observe how our banking sheet handles security and state isolation: In financial applications, open transaction details sheets frequently display sensitive personal banking credentials, international bank account numbers (IBAN), and confidential tax identification numbers. If the user minimizes the mobile app or locks their device while the sheet is visible, the banking platform must mask the sheet content to prevent shoulder surfing or unencrypted operating system task-switcher screenshots.",
                "Our Sovereign Banking Sheet integrates with browser `visibilitychange` event listeners: the instant document visibility transitions to 'hidden', the sheet automatically applies a cryptographic blur overlay and temporarily clears plaintext ledger parameters from memory. When the user re-authenticates via biometrics, the clear state is seamlessly restored.",
                "Notice also how our typography and financial formatting enforce zero layout shift. All monetary figures are rendered using tabular monospace font numerals (`font-variant-numeric: tabular-nums`). When exchange rates or currency conversions update in real time, the digits change without shifting neighboring labels or buttons by a single subpixel.",
                "Let us model and execute this complete Sovereign Mobile Banking Sheet system in TypeScript. We will simulate the complete lifecycle: viewport shielding, drag displacement, velocity threshold evaluation, and accessible focus restoration.",
                "This production-grade mobile overlay system represents the gold standard of mobile design engineering: delivering native-caliber fluid physics, zero layout shift, and uncompromised accessibility across millions of daily financial transactions."
            ],"""

text = text.replace(p5_old, p5_new)

with open('scripts/design_day39_data.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated Day 39 texts!")
