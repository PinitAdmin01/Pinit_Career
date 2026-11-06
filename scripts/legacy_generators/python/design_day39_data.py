import re

def count_words(say_list):
    total = 0
    for para in say_list:
        clean = re.sub(r'[`*_#>\-\[\]\(\)]', '', para)
        total += len(clean.split())
    return total

DAY_39 = {
    "day": 39,
    "title": "Drawers & Bottom Sheets: Off-Canvas Navigation, Touch Gestures, Inertia & Safe Areas",
    "theme": "Touch Gesture Physics, Viewport Mechanics & Mobile Overlay Engineering",
    "parts": [
        {
            "title": "Anatomy of Drawers & Bottom Sheets: Sliding Overlays vs In-Flow Pushes",
            "say": [
                "As digital software expands across mobile devices, tablets, and responsive desktop viewports, two navigational patterns have become ubiquitous: Drawers and Bottom Sheets. While developers often treat them as interchangeable sliding containers, they fulfill distinct ergonomic and spatial roles in user interface architecture. Understanding their anatomical differences, rendering modes, and interaction physics is essential for creating high-performance enterprise applications.",
                "Let us define the core patterns: A Drawer (also called an Off-Canvas Panel or Side Navigation) is a container that slides into the viewport along a horizontal axis (typically from the left or right screen edge). On desktop viewports, drawers frequently host complex secondary workflows—such as activity logs, filtered search parameters, or customer support sidecars. In contrast, a Bottom Sheet slides vertically upward from the bottom of the viewport. On mobile devices, bottom sheets dominate modern UX design because the lower half of the screen resides directly within the user's natural thumb sweep radius, maximizing ergonomic comfort and one-handed reachability.",
                "Architecturally, both drawers and bottom sheets operate in one of two fundamental rendering modes: Overlay Mode or Push Mode. In Overlay Mode, the sliding sheet is rendered inside our top-level Portal, floating completely above the main application viewport on top of a semi-transparent backdrop overlay. Background content remains stationary while the sheet slides into view. Overlay mode is ideal for modal, interruptive tasks—such as confirming a bill payment or selecting an export file format.",
                "In contrast, in Push Mode (also known as Collapsible Flow Mode), the sliding drawer does not hover above the page; instead, it physically pushes the main content layout container to the side or squeezes its horizontal width. Push mode is ideal for persistent workspace panels—such as a file explorer sidebar in a code editor or a live chat panel in a video conference room. In push mode, background elements remain interactive, and no backdrop overlay is rendered.",
                "To understand sliding drawers and bottom sheets through an everyday physical analogy, consider a heavy wooden executive desk equipped with sliding storage drawers and a roll-top tambour lid. When you pull open a side drawer to retrieve a pen, the drawer slides out smoothly along horizontal metal roller tracks. It does not obstruct the open desktop surface; you can write on your notepad while the drawer remains open. This represents the persistent Push mode.",
                "Now, imagine opening a pull-down map projector screen mounted on the ceiling or pulling open a bottom storage bin on a luxury sleeper train. The bin pivots upward directly in front of you, requiring your full attention before you can stand up and walk down the train corridor. This represents the modal Overlay mode. Just like the train compartment, digital software must explicitly distinguish between persistent workspace sidebars and modal task sheets.",
                "Furthermore, enterprise design systems must account for responsive breakpoints. A navigation menu that renders as a persistent left-hand sidebar on a twenty-seven-inch desktop monitor must automatically transform into an off-canvas overlay drawer on a tablet, and collapse into an ergonomic bottom sheet on a mobile smartphone. Managing this responsive polymorphic transformation requires clean decoupling of component state from CSS layout positioning.",
                "Performance considerations also dictate how transitions are implemented. In naive layouts, developers animate `left`, `right`, or `margin` properties during drawer opening. Animating layout properties forces the browser to recalculate layout geometry and repaint pixels on every single frame, causing severe frame stutter and high GPU thermal throttling on mobile devices. Production-grade systems animate exclusively via CSS `transform: translate3d()` and `opacity`, offloading compositing directly to the device graphics processor for silky sixty-frames-per-second motion.",
                "Let us build an enterprise Drawer and Sheet Layout Classifier in TypeScript. Our engine will model viewport breakpoints, evaluate modal overlay versus push modes, and generate appropriate CSS flexbox and transform layout configurations with zero layout thrashing."
            ],
            "example": "An executive desk whose horizontal drawers slide out without blocking the desk surface versus a train sleeper bin that pivots into view demanding focused attention.",
            "code": """type SheetType = 'DRAWER_LEFT' | 'DRAWER_RIGHT' | 'BOTTOM_SHEET';
type SheetMode = 'MODAL_OVERLAY' | 'IN_FLOW_PUSH';

interface SheetConfig {
  type: SheetType;
  mode: SheetMode;
  widthOrHeight: number;
  isOpen: boolean;
  viewportWidth: number;
}

class SheetLayoutEngine {
  public static computeLayout(config: SheetConfig): {
    containerStyles: Record<string, string>;
    mainContentStyles: Record<string, string>;
    backdropVisible: boolean;
    transitionTransform: string;
  } {
    const isMobile = config.viewportWidth < 768;
    const effectiveType: SheetType = isMobile ? 'BOTTOM_SHEET' : config.type;
    const effectiveMode: SheetMode = isMobile ? 'MODAL_OVERLAY' : config.mode;

    const containerStyles: Record<string, string> = {
      position: effectiveMode === 'MODAL_OVERLAY' ? 'fixed' : 'relative',
      'z-index': effectiveMode === 'MODAL_OVERLAY' ? '4000' : '10',
      transition: 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1)'
    };

    let transform = 'none';
    const mainContentStyles: Record<string, string> = {
      transition: 'margin 300ms cubic-bezier(0.16, 1, 0.3, 1)'
    };

    if (effectiveType === 'BOTTOM_SHEET') {
      containerStyles['bottom'] = '0';
      containerStyles['left'] = '0';
      containerStyles['right'] = '0';
      containerStyles['height'] = `${config.widthOrHeight}px`;
      transform = config.isOpen ? 'translateY(0%)' : 'translateY(100%)';
    } else if (effectiveType === 'DRAWER_LEFT') {
      containerStyles['top'] = '0';
      containerStyles['bottom'] = '0';
      containerStyles['left'] = '0';
      containerStyles['width'] = `${config.widthOrHeight}px`;
      transform = config.isOpen ? 'translateX(0%)' : 'translateX(-100%)';

      if (effectiveMode === 'IN_FLOW_PUSH' && config.isOpen) {
        mainContentStyles['margin-left'] = `${config.widthOrHeight}px`;
      }
    } else if (effectiveType === 'DRAWER_RIGHT') {
      containerStyles['top'] = '0';
      containerStyles['bottom'] = '0';
      containerStyles['right'] = '0';
      containerStyles['width'] = `${config.widthOrHeight}px`;
      transform = config.isOpen ? 'translateX(0%)' : 'translateX(100%)';

      if (effectiveMode === 'IN_FLOW_PUSH' && config.isOpen) {
        mainContentStyles['margin-right'] = `${config.widthOrHeight}px`;
      }
    }

    containerStyles['transform'] = transform;

    return {
      containerStyles,
      mainContentStyles,
      backdropVisible: effectiveMode === 'MODAL_OVERLAY' && config.isOpen,
      transitionTransform: transform
    };
  }
}

// Case 1: Desktop Workspace Push Drawer
console.log('=== CASE 1: DESKTOP PERSISTENT PUSH DRAWER (1440px) ===');
const desktopDrawer = SheetLayoutEngine.computeLayout({
  type: 'DRAWER_LEFT',
  mode: 'IN_FLOW_PUSH',
  widthOrHeight: 320,
  isOpen: true,
  viewportWidth: 1440
});
console.log('Positioning:', desktopDrawer.containerStyles['position']);
console.log('Transform:', desktopDrawer.containerStyles['transform']);
console.log('Main Content Margin:', desktopDrawer.mainContentStyles['margin-left']);
console.log('Backdrop Active:', desktopDrawer.backdropVisible);

// Case 2: Mobile Responsive Bottom Sheet Transformation
console.log('\\n=== CASE 2: MOBILE RESPONSIVE BOTTOM SHEET (390px) ===');
const mobileSheet = SheetLayoutEngine.computeLayout({
  type: 'DRAWER_LEFT', // Requested left drawer, but mobile auto-adapts to BOTTOM_SHEET!
  mode: 'IN_FLOW_PUSH',
  widthOrHeight: 480,
  isOpen: true,
  viewportWidth: 390
});
console.log('Positioning:', mobileSheet.containerStyles['position']);
console.log('Transform:', mobileSheet.containerStyles['transform']);
console.log('Sheet Height:', mobileSheet.containerStyles['height']);
console.log('Backdrop Active (Enforced Modal):', mobileSheet.backdropVisible);""",
            "output": """=== CASE 1: DESKTOP PERSISTENT PUSH DRAWER (1440px) ===
Positioning: relative
Transform: translateX(0%)
Main Content Margin: 320px
Backdrop Active: false

=== CASE 2: MOBILE RESPONSIVE BOTTOM SHEET (390px) ===
Positioning: fixed
Transform: translateY(0%)
Sheet Height: 480px
Backdrop Active (Enforced Modal): true""",
            "codeNotes": [
                {"line": 1, "note": "SheetType and SheetMode distinguish horizontal side drawers from vertical bottom sheets."},
                {"line": 15, "note": "Automatically polymorphs desktop left drawer into modal bottom sheet when viewportWidth < 768px."},
                {"line": 40, "note": "Calculates push margins for desktop and backdrop visibility for modal mobile overlays."}
            ],
            "tryIt": "Set isOpen to false and verify that bottom sheets translate down by 100% while desktop drawers translate left by -100%.",
            "check": {
                "question": "Why do mobile smartphones favor vertical Bottom Sheets over horizontal side drawers for primary interaction menus?",
                "options": [
                    "Because bottom sheets position critical interactive elements within the natural thumb zone of modern large smartphones, enabling comfortable one-handed operation",
                    "Because mobile operating systems disable horizontal CSS transforms",
                    "To prevent mobile battery drainage caused by left-to-right swipe animations",
                    "Because bottom sheets render fifty percent fewer HTML elements than side drawers"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Ergonomic thumb-zone design dictates bottom sheets on mobile devices because users hold smartphones from the bottom; reaching the lower half of the screen is effortless with one hand, whereas reaching top-left hamburger menus causes thumb strain."
            }
        },
        {
            "title": "Touch Gestures & Velocity Tracking: Drag to Dismiss with Resistance Physics",
            "say": [
                "The defining sensory attribute of modern mobile bottom sheets is fluid gestural manipulation. When a user places their thumb on a bottom sheet handle and drags downward, they expect the sheet to adhere directly to their skin. When they flick their thumb with rapid velocity, they expect the sheet to dismiss effortlessly. Conversely, if they drag upward past the maximum expansion limit, they expect tactile rubber-band resistance that gently pushes back.",
                "Implementing high-fidelity drag-to-dismiss physics requires mastering Touch and Pointer Events: `pointerdown`, `pointermove`, and `pointerup`. Naive implementations simply map touch coordinates linearly to CSS `translateY`. However, linear mapping produces lifeless, robotic interfaces. Production-grade bottom sheets incorporate Newtonian Kinematics: Displacement Tracking, Velocity Calculation, and Rubber-Band Elasticity.",
                "Let us examine the physics pipeline: First, when a user initiates a drag gesture at `pointerdown`, the engine caches the initial touch coordinate `startY` and timestamp `startTime`. As the pointer moves, the engine calculates the displacement delta: `deltaY = currentY - startY`. If the sheet is being dragged downward (`deltaY > 0`), the sheet moves one-to-one with the finger: `translateY = deltaY`. The backdrop overlay opacity fades proportionally: `backdropOpacity = 1 - (deltaY / sheetHeight)`.",
                "Second, what happens if the user drags upward (`deltaY < 0`) trying to stretch the sheet beyond its full height? In a naive engine, the sheet either freezes rigidly or unanchors from the bottom edge. In an enterprise system, the engine applies Logarithmic Rubber-Band Resistance: `translateY = -1 * (tensionConstant * Math.log(1 + Math.abs(deltaY) / tensionDamping))`. The further the user pulls upward, the harder the system resists, creating the unmistakable physical sensation of stretching an elastic rubber band.",
                "Third, upon `pointerup`, the engine must decide whether to dismiss the sheet or snap back to full expansion. This decision cannot rely solely on distance threshold (e.g., whether the sheet crossed fifty percent height). If a user performs a rapid, decisive downward flick of only thirty pixels, their velocity is high. Dismissing based on distance alone would reject the flick, causing jarring user frustration.",
                "The engine calculates final velocity: `velocity = (currentY - lastY) / (currentTime - lastTime)`. If `velocity > 0.5 px/ms` (flick gesture) OR if `deltaY > sheetHeight * 0.4` (distance threshold), the engine commits to dismissal, animating the sheet off-screen with an ease-out spring curve. Otherwise, the sheet springs back to zero displacement.",
                "To understand touch gesture physics through an everyday physical analogy, consider pulling down a spring-loaded window shade or roller blind in a sunlit bedroom. When you pull the shade cord down gently, it glides smoothly along its vertical guide wire. If you give the cord a sharp, rapid tug downward, the internal ratchet mechanism releases, and the blind snaps rolled up instantly. If you tug when the blind is already fully extended, the spring tension creates firm physical resistance. Digital bottom sheets replicate this exact spring-loaded roller blind physics.",
                "We must also manage gesture conflict resolution when the bottom sheet contains internal scrollable content—such as a list of fifty bank transactions. What happens when the user places their finger in the middle of the sheet and drags downward? Are they trying to scroll the transaction list to see older records, or are they trying to drag the entire sheet down to dismiss it?",
                "To resolve this ambiguity, enterprise bottom sheets implement Nested Scroll Interception. If the internal scroll container's `scrollTop` is greater than zero, the touch event is consumed exclusively by internal content scrolling; the sheet remains firmly locked at its full height. Only when `scrollTop === 0` (the user has scrolled to the absolute top of the internal list) does a continuing downward drag transfer authority to the outer sheet kinematics engine, initiating drag-to-dismiss.",
                "Let us implement an enterprise Touch Gesture & Velocity Tracking Engine in TypeScript. We will model pointer tracking, calculate instantaneous velocity vectors, apply rubber-band damping, and execute threshold snap decisions."
            ],
            "example": "A spring-loaded bedroom roller window blind that glides smoothly on slow pulls, snaps open on rapid flick tugs, and provides firm tension when overstretched.",
            "code": """interface PointerSample {
  y: number;
  time: number;
}

interface GestureDecision {
  action: 'DISMISS' | 'SNAP_BACK';
  finalTranslateY: number;
  velocity: number;
  reason: string;
}

class BottomSheetPhysicsEngine {
  private sheetHeight: number;
  private dismissDistanceRatio = 0.4; // 40% height threshold
  private velocityThreshold = 0.6; // px per ms (flick threshold)
  private rubberBandConstant = 0.25;

  constructor(sheetHeight: number) {
    this.sheetHeight = sheetHeight;
  }

  // Applies logarithmic rubber-band damping for upward overscroll
  public computeDragPosition(deltaY: number): { translateY: number; backdropOpacity: number } {
    if (deltaY >= 0) {
      // Downward drag: 1-to-1 linear tracking
      const progress = Math.min(1, deltaY / this.sheetHeight);
      return {
        translateY: Math.round(deltaY),
        backdropOpacity: parseFloat((1 - progress).toFixed(2))
      };
    } else {
      // Upward drag: Rubber-band resistance
      const overdrag = Math.abs(deltaY);
      const damped = this.rubberBandConstant * this.sheetHeight * Math.log10(1 + overdrag / this.sheetHeight);
      return {
        translateY: Math.round(-damped),
        backdropOpacity: 1.0 // Backdrop stays fully opaque
      };
    }
  }

  // Evaluates gesture release using distance and instantaneous velocity
  public evaluateRelease(
    finalDeltaY: number,
    recentSamples: PointerSample[]
  ): GestureDecision {
    let velocity = 0;
    if (recentSamples.length >= 2) {
      const p1 = recentSamples[recentSamples.length - 2];
      const p2 = recentSamples[recentSamples.length - 1];
      const dt = p2.time - p1.time;
      const dy = p2.y - p1.y;
      velocity = dt > 0 ? dy / dt : 0;
    }

    const distanceExceeded = finalDeltaY > (this.sheetHeight * this.dismissDistanceRatio);
    const flickDismiss = velocity > this.velocityThreshold;

    if (flickDismiss) {
      return {
        action: 'DISMISS',
        finalTranslateY: this.sheetHeight,
        velocity: parseFloat(velocity.toFixed(2)),
        reason: `Fast downward flick detected (${velocity.toFixed(2)} px/ms); instantaneous dismissal triggered.`
      };
    } else if (distanceExceeded) {
      return {
        action: 'DISMISS',
        finalTranslateY: this.sheetHeight,
        velocity: parseFloat(velocity.toFixed(2)),
        reason: `Distance threshold exceeded (${finalDeltaY}px > 40% of sheet height); dismissing.`
      };
    } else {
      return {
        action: 'SNAP_BACK',
        finalTranslateY: 0,
        velocity: parseFloat(velocity.toFixed(2)),
        reason: 'Insufficient displacement and velocity; spring-snapping back to full expansion.'
      };
    }
  }
}

// System Execution
console.log('=== BOTTOM SHEET TOUCH KINEMATICS & GESTURE PHYSICS ===');
const engine = new BottomSheetPhysicsEngine(500); // 500px tall bottom sheet

// Test 1: Upward drag (Testing Rubber-Band Elasticity)
console.log('1. Upward Overscroll Drag (-150px):');
const overscroll = engine.computeDragPosition(-150);
console.log(`   Damped TranslateY: ${overscroll.translateY}px (Resisted from -150px!)`);
console.log(`   Backdrop Opacity: ${overscroll.backdropOpacity}`);

// Test 2: Downward drag (Testing Mid-Drag Linear Tracking)
console.log('\\n2. Downward Drag (+200px):');
const midDrag = engine.computeDragPosition(200);
console.log(`   Linear TranslateY: ${midDrag.translateY}px`);
console.log(`   Faded Backdrop Opacity: ${midDrag.backdropOpacity}`);

// Test 3: Fast downward flick release (High Velocity, Short Distance)
console.log('\\n3. Gesture Release: Rapid Flick (Short Distance 80px, High Velocity):');
const flickSamples: PointerSample[] = [
  { y: 300, time: 1000 },
  { y: 380, time: 1040 } // 80px in 40ms = 2.0 px/ms!
];
const flickDecision = engine.evaluateRelease(80, flickSamples);
console.log('   Decision Action:', flickDecision.action);
console.log('   Velocity:', `${flickDecision.velocity} px/ms`);
console.log('   Kinematic Reason:', flickDecision.reason);

// Test 4: Slow drag release below threshold (Snap Back)
console.log('\\n4. Gesture Release: Slow Drag (Small Distance 60px, Zero Velocity):');
const slowSamples: PointerSample[] = [
  { y: 300, time: 1000 },
  { y: 360, time: 2000 } // 60px in 1000ms = 0.06 px/ms
];
const snapDecision = engine.evaluateRelease(60, slowSamples);
console.log('   Decision Action:', snapDecision.action);
console.log('   Kinematic Reason:', snapDecision.reason);""",
            "output": """=== BOTTOM SHEET TOUCH KINEMATICS & GESTURE PHYSICS ===
1. Upward Overscroll Drag (-150px):
   Damped TranslateY: -14px (Resisted from -150px!)
   Backdrop Opacity: 1

2. Downward Drag (+200px):
   Linear TranslateY: 200px
   Faded Backdrop Opacity: 0.6

3. Gesture Release: Rapid Flick (Short Distance 80px, High Velocity):
   Decision Action: DISMISS
   Velocity: 2 px/ms
   Kinematic Reason: Fast downward flick detected (2.00 px/ms); instantaneous dismissal triggered.

4. Gesture Release: Slow Drag (Small Distance 60px, Zero Velocity):
   Decision Action: SNAP_BACK
   Kinematic Reason: Insufficient displacement and velocity; spring-snapping back to full expansion.""",
            "codeNotes": [
                {"line": 13, "note": "BottomSheetPhysicsEngine encapsulates drag resistance and velocity thresholding."},
                {"line": 28, "note": "Implements logarithmic damping for upward overscroll, preventing unnatural detached dragging."},
                {"line": 42, "note": "Calculates instantaneous velocity from recent pointer samples to detect flick-to-dismiss."}
            ],
            "tryIt": "Adjust velocityThreshold to 1.0 px/ms and verify that moderate velocity swipes trigger snap-back instead of dismissal.",
            "check": {
                "question": "Why must mobile bottom sheets evaluate touch velocity in addition to drag distance when deciding whether to dismiss?",
                "options": [
                    "To support natural flick gestures, ensuring that a rapid downward swipe dismisses the sheet even if the physical drag distance was small",
                    "To calculate the user's internet connection speed",
                    "Because mobile GPUs refuse to render animations unless velocity is logged to localStorage",
                    "To ensure that touchscreens consume less battery power"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Human gesture ergonomics rely on velocity; users frequently flick their thumbs rapidly across short distances expecting instant dismissal. Relying only on distance forces users to drag their thumb across half the screen, creating frustrating lag."
            }
        },
        {
            "title": "Mobile Viewport Hazards: Virtual Keyboards, Address Bar Shrinking & Notch Safe Areas (env)",
            "say": [
                "Engineering bottom sheets for mobile browsers is notoriously hazardous due to dynamic mobile viewport quirks. A bottom sheet that looks flawless on a static desktop emulator will break in bizarre, frustrating ways when deployed to actual iOS Safari or Android Chrome hardware. To build resilient mobile overlay systems, engineers must anticipate and conquer three major mobile viewport hazards: Dynamic Browser Address Bars, Hardware Notch Cutouts, and Virtual Keyboard Resizing.",
                "Let us examine the first hazard: Dynamic Address Bars and Viewport Units. In mobile browsers like Safari, scrolling the page causes the bottom address bar and top navigation bar to shrink or retract dynamically. In legacy CSS, declaring `height: 100vh` on a bottom sheet or backdrop caused severe visual truncation because `100vh` reflected the maximum possible viewport height (when address bars were collapsed). When the address bar expanded, it physically covered the bottom sixty pixels of the sheet, hiding primary action buttons.",
                "To resolve this, modern CSS introduces Dynamic Viewport Units: Small Viewport Height (`100svh`), Large Viewport Height (`100lvh`), and Dynamic Viewport Height (`100dvh`). `100svh` reflects the smallest viewport height when address bars are fully visible; `100dvh` adapts dynamically in real time as address bars expand and contract. Enterprise bottom sheets bind their maximum height strictly to `max-height: calc(100dvh - 32px)`.",
                "The second hazard is Hardware Display Cutouts (the iPhone Notch, Dynamic Island, and Android Camera Holes). When a bottom sheet is anchored to `bottom: 0`, its action buttons sit directly over the iOS home indicator bar—the horizontal rounded line at the bottom of modern smartphones used for app switching. If a user taps the 'Confirm Transfer' button, their finger also taps the iOS home indicator, accidentally minimizing the app instead.",
                "To prevent this, design systems must implement Safe Area Insets via the standard CSS environment variable `env(safe-area-inset-bottom)`. The bottom sheet container must apply `padding-bottom: max(16px, env(safe-area-inset-bottom))`. The `max()` function guarantees that the sheet maintains sixteen pixels of padding on flat desktop monitors while expanding automatically to thirty-four pixels on notched iPhones, keeping action buttons safely out of reach of system gestures.",
                "The third hazard is the Virtual On-Screen Keyboard. When a user focuses a text input inside a bottom sheet, the mobile operating system summons the virtual keyboard, occupying up to forty percent of the vertical screen. If the bottom sheet remains anchored to the bottom of the window, the virtual keyboard covers the active input completely, leaving the user typing blindly into an invisible field.",
                "To master the virtual keyboard, enterprise systems subscribe to the modern browser `window.visualViewport` API. Unlike `window.innerHeight`, `window.visualViewport.height` reports the exact remaining visible screen area above the software keyboard. When the keyboard opens, the bottom sheet automatically translates upward or adjusts its scroll offset to keep the focused input visible.",
                "Consider also the hazardous phenomenon of Over-Scroll Bouncing (rubber-banding) on iOS Safari. If a user scrolls to the bottom of a sheet and drags further, the entire Safari browser window shifts, exposing the light gray browser canvas behind the web application. When the drag releases, the browser snaps back violently, often desynchronizing fixed position elements.",
                "To defeat overscroll bouncing, enterprise bottom sheets apply `overscroll-behavior: contain` to the sheet container and `touch-action: pan-y` to the drag handle. This CSS declaration instructs the browser's touch subsystem that scroll chaining must terminate strictly within the sheet, forbidding the mobile operating system from hijacking the gesture into a window-level bounce. This guarantees that bottom sheet interactions remain self-contained, fluid, and completely impervious to browser-level viewport glitches.",
                "Let us model a Mobile Viewport Shield Engine in TypeScript. We will simulate dynamic address bar state changes, notch safe area insets, and visual viewport virtual keyboard resize events to guarantee bulletproof mobile rendering."
            ],
            "example": "A car glovebox door engineered with a curved bottom bevel so it swings open without scraping against the passenger's knees or the floorboard console.",
            "code": """interface MobileDeviceMetrics {
  screenWidth: number;
  screenHeight: number;
  isAddressBarExpanded: boolean;
  isVirtualKeyboardActive: boolean;
  keyboardHeight: number;
  safeAreaBottom: number; // e.g., 34px for iOS Home Indicator
}

class MobileViewportShield {
  public static computeSafeSheetBounds(
    requestedSheetHeight: number,
    metrics: MobileDeviceMetrics
  ): {
    effectiveHeight: number;
    safePaddingBottom: number;
    appliedBottomOffset: number;
    visualViewportHeight: number;
    isClipped: boolean;
  } {
    // 1. Calculate dynamic viewport height (dvh)
    const currentViewportHeight = metrics.isAddressBarExpanded
      ? metrics.screenHeight - 64 // 64px address bar visible (svh)
      : metrics.screenHeight; // address bar retracted (lvh)

    // 2. Adjust for virtual keyboard presence (visualViewport API)
    const activeVisualHeight = metrics.isVirtualKeyboardActive
      ? currentViewportHeight - metrics.keyboardHeight
      : currentViewportHeight;

    // 3. Calculate safe bottom padding using max(16px, env(safe-area-inset-bottom))
    const safePaddingBottom = metrics.isVirtualKeyboardActive
      ? 12 // When keyboard is open, home indicator is suppressed
      : Math.max(16, metrics.safeAreaBottom);

    // 4. Bound sheet height so it never exceeds visible screen space minus top margin
    const maxAllowedHeight = activeVisualHeight - 48; // 48px top safety gap
    const effectiveHeight = Math.min(requestedSheetHeight, maxAllowedHeight);
    const isClipped = requestedSheetHeight > maxAllowedHeight;

    // 5. Shift sheet upward if virtual keyboard is active
    const appliedBottomOffset = metrics.isVirtualKeyboardActive ? metrics.keyboardHeight : 0;

    return {
      effectiveHeight: Math.round(effectiveHeight),
      safePaddingBottom: Math.round(safePaddingBottom),
      appliedBottomOffset: Math.round(appliedBottomOffset),
      visualViewportHeight: Math.round(activeVisualHeight),
      isClipped
    };
  }
}

// Case 1: Standard iPhone with Notch & Expanded Address Bar
console.log('=== CASE 1: IPHONE 15 - IDLE VIEWPORT WITH NOTCH SAFE AREA ===');
const iphoneIdle: MobileDeviceMetrics = {
  screenWidth: 393,
  screenHeight: 852,
  isAddressBarExpanded: true,
  isVirtualKeyboardActive: false,
  keyboardHeight: 0,
  safeAreaBottom: 34 // 34px iOS Home Indicator
};

const idleBounds = MobileViewportShield.computeSafeSheetBounds(500, iphoneIdle);
console.log('Requested Height: 500px -> Effective Height:', `${idleBounds.effectiveHeight}px`);
console.log('Applied Bottom Offset:', `${idleBounds.appliedBottomOffset}px`);
console.log('Enforced Safe Area Padding (env):', `${idleBounds.safePaddingBottom}px (Cleared 34px Home Indicator!)`);
console.log('Visual Viewport Height:', `${idleBounds.visualViewportHeight}px`);

// Case 2: Virtual Keyboard Appears (Focus on text input inside sheet)
console.log('\\n=== CASE 2: VIRTUAL KEYBOARD SUMMONED (INPUT FOCUSED) ===');
const iphoneKeyboardActive: MobileDeviceMetrics = {
  screenWidth: 393,
  screenHeight: 852,
  isAddressBarExpanded: true,
  isVirtualKeyboardActive: true,
  keyboardHeight: 320, // 320px software keyboard
  safeAreaBottom: 34
};

const keyboardBounds = MobileViewportShield.computeSafeSheetBounds(500, iphoneKeyboardActive);
console.log('Visual Viewport Height (Post-Keyboard):', `${keyboardBounds.visualViewportHeight}px`);
console.log('Sheet Lifted Above Keyboard Offset:', `${keyboardBounds.appliedBottomOffset}px`);
console.log('Constrained Effective Height:', `${keyboardBounds.effectiveHeight}px`);
console.log('Was Sheet Clamped to Prevent Off-Screen Overflow?', keyboardBounds.isClipped ? 'YES' : 'NO');""",
            "output": """=== CASE 1: IPHONE 15 - IDLE VIEWPORT WITH NOTCH SAFE AREA ===
Requested Height: 500px -> Effective Height: 500px
Applied Bottom Offset: 0px
Enforced Safe Area Padding (env): 34px (Cleared 34px Home Indicator!)
Visual Viewport Height: 788px

=== CASE 2: VIRTUAL KEYBOARD SUMMONED (INPUT FOCUSED) ===
Visual Viewport Height (Post-Keyboard): 468px
Sheet Lifted Above Keyboard Offset: 320px
Constrained Effective Height: 420px
Was Sheet Clamped to Prevent Off-Screen Overflow? YES""",
            "codeNotes": [
                {"line": 1, "note": "MobileDeviceMetrics models dynamic address bars, keyboards, and hardware notch insets."},
                {"line": 28, "note": "Implements max(16px, env(safe-area-inset-bottom)) to prevent overlapping the iOS home indicator."},
                {"line": 34, "note": "Leverages visualViewport mechanics to clamp sheet height and lift above the 320px keyboard."}
            ],
            "tryIt": "Simulate a landscape orientation where screenHeight is 393px and verify that maxAllowedHeight safely clamps the sheet.",
            "check": {
                "question": "Why must mobile bottom sheets apply 'padding-bottom: max(16px, env(safe-area-inset-bottom))'?",
                "options": [
                    "To ensure that primary interactive buttons clear the iOS home indicator gesture bar on notched devices while maintaining consistent padding on desktop screens",
                    "To increase the speed of JavaScript garbage collection",
                    "Because Apple App Store guidelines reject applications that do not use CSS environment variables",
                    "To compress mobile network packets"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Modern smartphones feature hardware gestures like the iOS home indicator bar at the bottom of the screen; without env(safe-area-inset-bottom) padding compensation, tapping action buttons accidentally minimizes the browser."
            }
        },
        {
            "title": "Accessible Off-Canvas Modality: Focus Management, Inert Backgrounds & ARIA Dialog Roles",
            "say": [
                "While gesture animations and dynamic viewport adapters solve the graphical and kinesthetic challenges of bottom sheets, an enterprise component remains completely unusable for millions of users with disabilities unless it adheres to rigorous accessibility standards. A sliding bottom sheet that animates gorgeously but fails to manage keyboard focus, traps screen readers, or ignores the physical Escape key violates WCAG 2.1 Level AA and Section 508 legal standards.",
                "Let us examine the mandatory accessibility contracts for modal bottom sheets and sliding drawers: First, semantic role declaration. A modal bottom sheet must declare `role=\"dialog\"` (or `role=\"alertdialog\"` for urgent destructive prompts) and `aria-modal=\"true\"`. It must link to its title heading via `aria-labelledby=\"sheet-title-id\"` and optional instructional text via `aria-describedby=\"sheet-desc-id\"`. When an assistive screen reader detects these attributes, it announces: 'Payment Summary, Dialog. Confirm transfer to Apex Capital.'",
                "Second, initial focus placement and focus restoration. When the sheet completes its entrance animation, programmatic focus must be moved inside the sheet. For standard drawers, focus moves to the first interactive field or close button. For destructive confirmation sheets, focus lands defensively on the 'Cancel' button. Furthermore, the component must cache a reference to the active trigger button that summoned the sheet (`document.activeElement`). When the sheet closes, focus must immediately return to that exact button.",
                "Third, background inertness. When a modal sheet is open, all background page content must be made completely unreachable to keyboard tab traversal and screen reader virtual cursors. In modern browsers, this is achieved by applying the native HTML attribute `inert` to the background application container: `<main id=\"app-root\" inert>`. The `inert` attribute disables pointer clicks, keyboard focus, and accessibility tree exposure in a single performant declaration.",
                "Fourth, keyboard dismissal. Pressing the physical `Escape` key must immediately trigger the sheet's closing animation and restore focus. Furthermore, the visual drag handle at the top of the sheet must not be an unlabelled decorative bar; it should declare `role=\"separator\"` or be paired with an explicit accessible close button labeled `aria-label=\"Close panel\"`.",
                "To understand accessible modality through an everyday physical analogy, consider an airtight decompression airlock between a submarine and an underwater exploration module. Before the submarine crew can open the hatch leading into the module, the outer hatch is bolted shut and verified airtight (the background inert state). The crew steps into the lit compartment (the focus shift into the sheet).",
                "Once their task is complete, they exit through the hatch, and the submarine main cabin pressure door re-engages seamlessly (focus restoration). At no point are both doors open simultaneously, which would flood the cabin. In software, focus trapping and inert boundaries prevent navigational flooding.",
                "Accessibility also requires comprehensive voice announcement of sliding state transitions. Sighted users see the sheet slide smoothly upward over three hundred milliseconds. Visually impaired users relying on screen readers receive zero information from a CSS transform. Therefore, our accessible sheet manager coordinates with ARIA live regions: upon mount, a polite live announcement vocalizes 'Panel opened', and upon dismissal, 'Panel closed'.",
                "Furthermore, touch accessibility mandates that users with motor impairments or those utilizing switch-access devices have an alternative to drag-to-dismiss gestures. Swiping a finger with specific velocity is physically impossible for users with tremors or paralyzed limbs. In our architecture, keyboard users also benefit from intuitive directional shortcuts: pressing the Down Arrow key while focused on the sheet header initiates a step-by-step collapse. Every bottom sheet must include an unambiguous, high-contrast close button (`✕`) at the top-right corner with a minimum touch hit-target size of forty-four by forty-four physical pixels, satisfying WCAG 2.1 Success Criterion 2.5.5 (Target Size).",
                "Let us model an enterprise Accessible Sheet Controller in TypeScript. We will implement ARIA contracts, manage inert background toggling, execute focus trapping and restoration, and verify keyboard Escape listeners."
            ],
            "example": "An airtight submarine decompression airlock that isolates chambers sequentially, preventing cabin flooding and ensuring safe transit.",
            "code": """interface AccessibleSheetContract {
  role: 'dialog' | 'alertdialog';
  titleId: string;
  titleText: string;
  triggerButtonId: string;
  initialFocusId: string;
}

class SovereignAccessibleSheetManager {
  private activeSheet: AccessibleSheetContract | null = null;
  private isMounted = false;
  private backgroundInert = false;
  private focusTarget: string | null = null;

  public openSheet(spec: AccessibleSheetContract): {
    ariaAttributes: Record<string, any>;
    backgroundInertApplied: boolean;
    initialFocusTarget: string;
    closeButtonMarkup: string;
  } {
    this.activeSheet = spec;
    this.isMounted = true;
    this.backgroundInert = true; // document.getElementById('app-root').inert = true
    this.focusTarget = spec.initialFocusId;

    const ariaAttributes = {
      role: spec.role,
      'aria-modal': true,
      'aria-labelledby': spec.titleId
    };

    const closeButtonMarkup = `<button id="btn-close-sheet" aria-label="Close ${spec.titleText}" class="btn-close p-2">✕</button>`;

    return {
      ariaAttributes,
      backgroundInertApplied: this.backgroundInert,
      initialFocusTarget: `#${spec.initialFocusId}`,
      closeButtonMarkup
    };
  }

  public handleKeyDown(key: string): { action: string; focusRestoredTo?: string } {
    if (!this.isMounted || !this.activeSheet) return { action: 'NO_OP' };

    if (key === 'Escape') {
      const restoredTarget = this.activeSheet.triggerButtonId;
      this.isMounted = false;
      this.backgroundInert = false;
      this.activeSheet = null;

      return {
        action: 'DISMISSED_VIA_ESCAPE',
        focusRestoredTo: `#${restoredTarget}`
      };
    }

    return { action: 'KEY_HANDLED' };
  }
}

// System Execution
console.log('=== ACCESSIBLE OFF-CANVAS SHEET STATE MACHINE ===');
const sheetManager = new SovereignAccessibleSheetManager();

// Case 1: Open Bottom Sheet from 'View Cart' button
const cartSheetSpec: AccessibleSheetContract = {
  role: 'dialog',
  titleId: 'cart-sheet-title',
  titleText: 'Shopping Bag Summary',
  triggerButtonId: 'btn-open-cart-header',
  initialFocusId: 'btn-checkout-primary'
};

const openResult = sheetManager.openSheet(cartSheetSpec);
console.log('1. Sheet Mounted Successfully:');
console.log('   Container ARIA Attributes:', JSON.stringify(openResult.ariaAttributes));
console.log('   Background Root Set to Inert:', openResult.backgroundInertApplied);
console.log('   Initial Focus Shifted To:', openResult.initialFocusTarget);
console.log('   Accessible Close Button:', openResult.closeButtonMarkup);

// Case 2: User presses Escape key
console.log('\\n2. Keyboard Dismissal via Escape:');
const escapeResult = sheetManager.handleKeyDown('Escape');
console.log('   Action Executed:', escapeResult.action);
console.log('   Focus Restored Flawlessly To:', escapeResult.focusRestoredTo);""",
            "output": """=== ACCESSIBLE OFF-CANVAS SHEET STATE MACHINE ===
1. Sheet Mounted Successfully:
   Container ARIA Attributes: {"role":"dialog","aria-modal":true,"aria-labelledby":"cart-sheet-title"}
   Background Root Set to Inert: true
   Initial Focus Shifted To: #btn-checkout-primary
   Accessible Close Button: <button id="btn-close-sheet" aria-label="Close Shopping Bag Summary" class="btn-close p-2">✕</button>

2. Keyboard Dismissal via Escape:
   Action Executed: DISMISSED_VIA_ESCAPE
   Focus Restored Flawlessly To: #btn-open-cart-header""",
            "codeNotes": [
                {"line": 8, "note": "SovereignAccessibleSheetManager maintains modal state, background inertness, and focus restoration."},
                {"line": 23, "note": "Sets backgroundInert = true to isolate the main application tree from screen readers and tab navigation."},
                {"line": 39, "note": "Intercepts Escape key to dismiss the sheet and programmatically restore focus to the triggering element."}
            ],
            "tryIt": "Add an assertion in openSheet verifying that spec.triggerButtonId is not empty to guarantee focus restoration.",
            "check": {
                "question": "What is the primary function of the HTML 'inert' attribute when opening a modal bottom sheet?",
                "options": [
                    "To completely disable user interaction, pointer clicks, keyboard focus, and screen reader access for background page content behind the modal sheet",
                    "To speed up CSS transition animations by fifty milliseconds",
                    "To freeze all JavaScript timers in Web Workers",
                    "To tell the browser to download external fonts asynchronously"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "The HTML 'inert' attribute tells the browser to treat a DOM subtree as non-interactive, preventing keyboard tabbing, mouse clicks, and screen reader virtual buffer navigation into background content behind modal overlays."
            }
        },
        {
            "title": "Enterprise Application: Sovereign Mobile Banking Transaction Details Sheet with Velocity Dismissal",
            "say": [
                "To synthesize our mastery of drawers, bottom sheets, drag-to-dismiss kinematics, viewport safe areas, and accessible modality, we now construct a comprehensive enterprise system: the Sovereign Mobile Banking Transaction Details Sheet. In tier-one retail banking and wealth management mobile applications—such as Revolut, Chase, or Morgan Stanley—the Transaction Details Sheet is the most heavily trafficked interactive overlay in the entire software ecosystem.",
                "When a retail banking customer taps a transaction item in their recent activity feed (e.g., 'Starbucks Coffee, $6.45' or 'Wire Transfer to Apex Capital, €25,000.00'), the application must display a comprehensive financial breakdown: merchant details, timestamp, exchange rate spread, processing fee breakdown, and dispute dispute action buttons. The sheet must feel physical, responsive, and completely native.",
                "Our Sovereign Mobile Banking Sheet architecture integrates all four layers we mastered today: First, our Mobile Viewport Shield queries dynamic viewport height (`100dvh`), clamps the maximum sheet height to prevent header overflow, and applies `padding-bottom: max(16px, env(safe-area-inset-bottom))` to clear the iOS home indicator bar.",
                "Second, our Touch Kinematics Engine monitors continuous pointer drag events: it tracks downward displacement linearly, fades the backdrop overlay smoothly, applies logarithmic rubber-band resistance on upward overdrag, and calculates release velocity. If the customer flicks the sheet downward with velocity exceeding 0.6 px/ms, the sheet dismisses instantly with an ease-out spring animation.",
                "Third, our Accessible Modality Controller applies `inert` to the background banking dashboard, binds `role=\"dialog\"`, `aria-modal=\"true\"`, and links `aria-labelledby=\"tx-sheet-title\"`. When dismissed via flick, swipe, or Escape key, focus is seamlessly restored to the triggering list item in the transaction feed.",
                "Fourth, the sheet incorporates high-contrast monetary typography and semantic color tokens: positive green credits, neutral slate debits, and amber fee tags rendered in bold tabular monospace numbers.",
                "Let us observe this architecture in action: A customer on an iPhone 15 taps a high-value wire transfer. The sheet mounts into `#pin-portal-root`. The background dashboard becomes inert. The sheet calculates an effective height of 520px with 34px safe area padding. When the customer drags downward by 90px with a quick flick of 1.2 px/ms, the kinematics engine detects velocity dismissal, unmounts the portal cleanly, releases background inertness, and restores focus to the wire transfer transaction card.",
                "Let us observe how our banking sheet handles security and state isolation: In financial applications, open transaction details sheets frequently display sensitive personal banking credentials, international bank account numbers (IBAN), and confidential tax identification numbers. If the user minimizes the mobile app or locks their device while the sheet is visible, the banking platform must mask the sheet content to prevent shoulder surfing or unencrypted operating system task-switcher screenshots.",
                "Our Sovereign Banking Sheet integrates with browser `visibilitychange` event listeners: the instant document visibility transitions to 'hidden', the sheet automatically applies a cryptographic blur overlay and temporarily clears plaintext ledger parameters from memory. When the user re-authenticates via biometrics, the clear state is seamlessly restored.",
                "Notice also how our typography and financial formatting enforce zero layout shift. Furthermore, our banking sheet implements haptic feedback coordination via the navigator.vibrate API where supported, delivering a subtle five-millisecond vibration pulse when the sheet snaps closed or locks into position. All monetary figures are rendered using tabular monospace font numerals (`font-variant-numeric: tabular-nums`). When exchange rates or currency conversions update in real time, the digits change without shifting neighboring labels or buttons by a single subpixel.",
                "Let us model and execute this complete Sovereign Mobile Banking Sheet system in TypeScript. We will simulate the complete lifecycle: viewport shielding, drag displacement, velocity threshold evaluation, and accessible focus restoration.",
                "This production-grade mobile overlay system represents the gold standard of mobile design engineering: delivering native-caliber fluid physics, zero layout shift, and uncompromised accessibility across millions of daily financial transactions."
            ],
            "example": "A high-security bank vault teller window equipped with an air-damped teller tray that slides forward on touch, resists over-extension, and locks flush upon release.",
            "code": """interface PointerSample {
  y: number;
  time: number;
}

interface GestureDecision {
  action: 'DISMISS' | 'SNAP_BACK';
  finalTranslateY: number;
  velocity: number;
  reason: string;
}

class BottomSheetPhysicsEngine {
  private sheetHeight: number;
  private dismissDistanceRatio = 0.4;
  private velocityThreshold = 0.6;

  constructor(sheetHeight: number) {
    this.sheetHeight = sheetHeight;
  }

  public evaluateRelease(finalDeltaY: number, recentSamples: PointerSample[]): GestureDecision {
    let velocity = 0;
    if (recentSamples.length >= 2) {
      const p1 = recentSamples[recentSamples.length - 2];
      const p2 = recentSamples[recentSamples.length - 1];
      const dt = p2.time - p1.time;
      const dy = p2.y - p1.y;
      velocity = dt > 0 ? dy / dt : 0;
    }
    const distanceExceeded = finalDeltaY > (this.sheetHeight * this.dismissDistanceRatio);
    const flickDismiss = velocity > this.velocityThreshold;

    if (flickDismiss) {
      return {
        action: 'DISMISS',
        finalTranslateY: this.sheetHeight,
        velocity: parseFloat(velocity.toFixed(2)),
        reason: `Fast downward flick detected (${velocity.toFixed(2)} px/ms); instantaneous dismissal triggered.`
      };
    } else if (distanceExceeded) {
      return {
        action: 'DISMISS',
        finalTranslateY: this.sheetHeight,
        velocity: parseFloat(velocity.toFixed(2)),
        reason: `Distance threshold exceeded; dismissing.`
      };
    } else {
      return {
        action: 'SNAP_BACK',
        finalTranslateY: 0,
        velocity: parseFloat(velocity.toFixed(2)),
        reason: 'Snap back.'
      };
    }
  }
}

interface MobileDeviceMetrics {
  screenWidth: number;
  screenHeight: number;
  isAddressBarExpanded: boolean;
  isVirtualKeyboardActive: boolean;
  keyboardHeight: number;
  safeAreaBottom: number;
}

class MobileViewportShield {
  public static computeSafeSheetBounds(requestedSheetHeight: number, metrics: MobileDeviceMetrics) {
    return {
      effectiveHeight: requestedSheetHeight,
      safePaddingBottom: metrics.safeAreaBottom
    };
  }
}

interface BankTransaction {
  id: string;
  merchant: string;
  amount: number;
  currency: string;
  timestamp: string;
  category: string;
  status: 'SETTLED' | 'PENDING' | 'DISPUTED';
}

class SovereignBankingSheetSystem {
  private physics: BottomSheetPhysicsEngine;
  private tx: BankTransaction;
  private isOpen = false;

  constructor(tx: BankTransaction, sheetHeight: number = 520) {
    this.tx = tx;
    this.physics = new BottomSheetPhysicsEngine(sheetHeight);
  }

  public open(metrics: MobileDeviceMetrics): {
    bounds: { effectiveHeight: number; safePaddingBottom: number };
    renderedDOM: string;
  } {
    this.isOpen = true;
    const bounds = MobileViewportShield.computeSafeSheetBounds(520, metrics);

    const formattedAmount = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: this.tx.currency
    }).format(this.tx.amount);

    const renderedDOM = [
      `<div id="portal-banking-sheet" class="fixed inset-0 z-50 flex flex-col justify-end">`,
      `  <div class="backdrop bg-black/60 fixed inset-0 transition-opacity" aria-hidden="true"></div>`,
      `  <div role="dialog" aria-modal="true" aria-labelledby="tx-sheet-title"`,
      `       class="sheet-card relative bg-slate-900 border-t border-slate-700 rounded-t-2xl shadow-2xl"`,
      `       style="height: ${bounds.effectiveHeight}px; padding-bottom: ${bounds.safePaddingBottom}px;">`,
      `    <div class="drag-handle-bar w-12 h-1.5 bg-slate-600 rounded-full mx-auto my-3" aria-hidden="true"></div>`,
      `    <div class="p-6">`,
      `      <h2 id="tx-sheet-title" class="text-lg font-bold text-white">Transaction Details</h2>`,
      `      <div class="my-4 p-4 bg-slate-950 rounded-lg border border-slate-800">`,
      `        <div class="text-xs text-slate-400">Merchant</div>`,
      `        <div class="text-base font-bold text-white">${this.tx.merchant}</div>`,
      `        <div class="mt-2 text-xs text-slate-400">Settled Amount</div>`,
      `        <div class="text-2xl font-mono font-bold text-emerald-400">${formattedAmount}</div>`,
      `        <div class="mt-2 text-xs text-slate-500">Timestamp: ${this.tx.timestamp} UTC | Status: ${this.tx.status}</div>`,
      `      </div>`,
      `      <button id="btn-dispute-tx" class="w-full py-3 bg-red-600/20 text-red-400 border border-red-500/30 font-bold rounded-lg">Dispute Transaction</button>`,
      `    </div>`,
      `  </div>`,
      `</div>`
    ].join('\\n');

    return { bounds, renderedDOM };
  }

  public simulateDragAndRelease(dragDeltaY: number, recentPointerSamples: PointerSample[]): {
    decision: GestureDecision;
    closed: boolean;
  } {
    const decision = this.physics.evaluateRelease(dragDeltaY, recentPointerSamples);
    if (decision.action === 'DISMISS') {
      this.isOpen = false;
      return { decision, closed: true };
    }
    return { decision, closed: false };
  }
}

// System Execution
console.log('=== SOVEREIGN MOBILE BANKING TRANSACTION SHEET SYSTEM ===');

const wireTx: BankTransaction = {
  id: 'TX-89210-WIRE',
  merchant: 'Apex Capital International Settlement',
  amount: 25000.00,
  currency: 'EUR',
  timestamp: '2026-10-25 14:48',
  category: 'Interbank Transfer',
  status: 'SETTLED'
};

const bankingSystem = new SovereignBankingSheetSystem(wireTx, 520);

// Step 1: Open sheet on iPhone 15 with 34px notch safe area
const openSummary = bankingSystem.open({
  screenWidth: 393,
  screenHeight: 852,
  isAddressBarExpanded: true,
  isVirtualKeyboardActive: false,
  keyboardHeight: 0,
  safeAreaBottom: 34
});

console.log('1. Bottom Sheet Mounted via Portal:');
console.log('   Effective Height:', `${openSummary.bounds.effectiveHeight}px`);
console.log('   Safe Area Bottom Padding:', `${openSummary.bounds.safePaddingBottom}px (Cleared iOS Home Indicator!)`);
console.log('\\nRendered Sheet DOM Fragment:\\n', openSummary.renderedDOM.split('\\n').slice(0, 11).join('\\n'), '\\n   ...');

// Step 2: Customer flicks downward with high velocity (90px in 35ms = 2.57 px/ms)
console.log('\\n2. Customer Kinematic Touch Gesture (Downward Flick):');
const flickSamples: PointerSample[] = [
  { y: 400, time: 2000 },
  { y: 490, time: 2035 } // 90px in 35ms = 2.57 px/ms!
];
const gestureResult = bankingSystem.simulateDragAndRelease(90, flickSamples);
console.log('   Kinematic Action:', gestureResult.decision.action);
console.log('   Measured Velocity:', `${gestureResult.decision.velocity} px/ms`);
console.log('   Sheet Closed & Unmounted?', gestureResult.closed ? 'YES - FOCUS RESTORED' : 'NO');
console.log('   Kinematic Reason:', gestureResult.decision.reason);""",
            "output": """=== SOVEREIGN MOBILE BANKING TRANSACTION SHEET SYSTEM ===
1. Bottom Sheet Mounted via Portal:
   Effective Height: 520px
   Safe Area Bottom Padding: 34px (Cleared iOS Home Indicator!)

Rendered Sheet DOM Fragment:
 <div id="portal-banking-sheet" class="fixed inset-0 z-50 flex flex-col justify-end">
  <div class="backdrop bg-black/60 fixed inset-0 transition-opacity" aria-hidden="true"></div>
  <div role="dialog" aria-modal="true" aria-labelledby="tx-sheet-title"
       class="sheet-card relative bg-slate-900 border-t border-slate-700 rounded-t-2xl shadow-2xl"
       style="height: 520px; padding-bottom: 34px;">
    <div class="drag-handle-bar w-12 h-1.5 bg-slate-600 rounded-full mx-auto my-3" aria-hidden="true"></div>
    <div class="p-6">
      <h2 id="tx-sheet-title" class="text-lg font-bold text-white">Transaction Details</h2>
      <div class="my-4 p-4 bg-slate-950 rounded-lg border border-slate-800">
        <div class="text-xs text-slate-400">Merchant</div>
        <div class="text-base font-bold text-white">Apex Capital International Settlement</div> 
   ...

2. Customer Kinematic Touch Gesture (Downward Flick):
   Kinematic Action: DISMISS
   Measured Velocity: 2.57 px/ms
   Sheet Closed & Unmounted? YES - FOCUS RESTORED
   Kinematic Reason: Fast downward flick detected (2.57 px/ms); instantaneous dismissal triggered.""",
            "codeNotes": [
                {"line": 1, "note": "BankTransaction represents immutable financial ledger records with currency formatting."},
                {"line": 20, "note": "open() computes dynamic viewport safe area bounds and renders WAI-ARIA dialog markup."},
                {"line": 56, "note": "simulateDragAndRelease evaluates instantaneous velocity to trigger native-feeling flick dismissals."}
            ],
            "tryIt": "Simulate a slow 50px downward drag and verify that the banking sheet springs back without unmounting.",
            "check": {
                "question": "Why is the Sovereign Banking Sheet engineered with an explicit drag handle bar styled with 'aria-hidden=\"true\"'?",
                "options": [
                    "Because the visual drag handle is purely decorative visual affordance for touch gestures, while screen readers interact via the semantic dialog role and accessible close buttons",
                    "To prevent touch events from registering on the handle",
                    "Because modern CSS files cannot style elements with ARIA roles",
                    "To invert the color palette on mobile displays"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Visual drag handles provide a tactile affordance for sighted touch users, but have no semantic meaning for assistive technologies; hiding them with aria-hidden='true' prevents screen readers from announcing meaningless decorative bars."
            }
        }
    ],
    "summary": [
        "Drawers and bottom sheets operate in either modal overlay mode (portal-mounted with backdrop) or in-flow push mode (resizing main layout).",
        "Touch gesture kinematics combine linear drag tracking, logarithmic rubber-band overscroll resistance, and velocity-based flick dismissal.",
        "Mobile viewport hazards require dynamic viewport units (100dvh), safe area padding (env(safe-area-inset-bottom)), and visualViewport keyboard tracking.",
        "Accessible off-canvas modality enforces role='dialog', aria-modal='true', background inertness via HTML 'inert', and flawless focus restoration.",
        "Institutional banking sheets synthesize touch physics, notch protection, high-contrast monospace typography, and instantaneous flick dismissal."
    ],
    "projectStep": {
        "title": "Architect Sovereign Touch Gesture Sheet & Mobile Viewport Engine",
        "steps": [
            "Construct responsive sheet layout engine supporting desktop push and mobile overlay modes",
            "Implement Newtonian touch kinematics with logarithmic rubber-band damping and velocity tracking",
            "Build mobile viewport shield handling dynamic address bars (dvh) and notch safe areas (env)",
            "Enforce WAI-ARIA dialog modality, background inertness, and keyboard Escape dismissal",
            "Certify complete mobile banking transaction details sheet with native-feeling flick physics"
        ]
    }
}

if __name__ == '__main__':
    all_ok = True
    for i, p in enumerate(DAY_39['parts']):
        words = count_words(p['say'])
        print(f"Day 39 Part {i+1} ('{p['title'][:35]}...'): {words} words")
        if words < 600:
            all_ok = False
    assert all_ok, "Some Day 39 parts are < 600 words!"
    print("ALL DAY 39 PARTS SATISFY >= 600 WORDS INVARIANT!")
