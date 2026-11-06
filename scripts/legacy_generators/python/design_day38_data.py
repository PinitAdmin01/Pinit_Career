import re

def count_words(say_list):
    total = 0
    for para in say_list:
        clean = re.sub(r'[`*_#>\-\[\]\(\)]', '', para)
        total += len(clean.split())
    return total

DAY_38 = {
    "day": 38,
    "title": "Popovers, Tooltips & Virtual Anchors: Collision Detection, Flip & Hover Bridges",
    "theme": "Micro-Overlay Interactions, Geometric Physics & Virtual Positioning",
    "parts": [
        {
            "title": "Popovers vs Tooltips vs Context Menus: Semantic Roles & Trigger Modalities",
            "say": [
                "In enterprise design systems, developers frequently conflate three distinct categories of micro-overlays: tooltips, popovers, and context menus. This conceptual confusion is not merely semantic; it leads to severe accessibility violations, broken keyboard navigation loops, and frustrating user experiences. To build world-class design systems, engineers must establish crisp, uncompromising boundaries between these three UI patterns based on semantic roles, content complexity, and trigger modalities.",
                "Let us begin with Tooltips. The W3C WAI-ARIA specification defines a tooltip strictly as a non-interactive, contextual textual hint that provides supplementary information about another element. Tooltips declare `role=\"tooltip\"` and are linked to their triggering control via `aria-describedby`. Crucially, tooltips must never contain interactive controls—no buttons, links, inputs, or copy icons. Why? Because a user navigating with assistive software or keyboard focus cannot tab into a tooltip without dismissing the very trigger that created it.",
                "Furthermore, tooltips trigger on both mouse hover and keyboard focus (`onFocus`/`onBlur`). When a keyboard user tabs to an icon button, the tooltip must appear instantly without requiring an Enter or Space key press. When the user tabs away, the tooltip must disappear. In contrast, Popovers are rich, interactive overlay containers. A popover declares `role=\"dialog\"` or `role=\"region\"` and is triggered exclusively by explicit user intent—typically a mouse click or Enter key activation on a button declaring `aria-haspopup=\"dialog\"` and `aria-expanded`.",
                "Popovers can house complex interactive workflows: date pickers, multi-select filter lists, user profile cards, or tabbed settings panels. Unlike tooltips, when a popover opens, keyboard focus may either shift inside the popover or roving tabindex may be enabled so users can interact with its internal controls without closing the container. Dismissal occurs through explicit close buttons, the Escape key, or outside click detection.",
                "To understand these differences through an everyday physical analogy, consider a museum exhibit featuring a rare historical manuscript. Attached to the wooden display frame is a small brass plaque that reads 'Printed in Venice, 1492' (the Tooltip). The visitor glances at the plaque to read the brief contextual note; there are no knobs, levers, or drawers on the plaque. Next to the glass case stands an interactive touchscreen kiosk (the Popover) where visitors tap buttons to zoom into high-resolution page scans, translate Latin text, and select commentary chapters. The kiosk is fully interactive and engaged with deliberate intent.",
                "Finally, Context Menus represent a specialized category of popover triggered by secondary mouse clicks (right-click) or context-menu keyboard shortcuts (`Shift+F10`). Context menus declare `role=\"menu\"`, contain `role=\"menuitem\"` descendants, and implement vertical arrow-key navigation rather than standard Tab key navigation.",
                "By differentiating these components at the architectural level, enterprise design systems avoid the fatal anti-pattern of the 'interactive tooltip'—an unmaintainable hybrid that baffles screen readers and breaks WCAG 2.1 Success Criterion 1.4.13 (Content on Hover or Focus).",
                "Under WCAG 2.1 Success Criterion 1.4.13, any content that appears on hover or focus must satisfy three mandatory criteria: Dismissable, Hoverable, and Persistent. Dismissable means users must be able to dismiss the overlay without moving mouse pointer or keyboard focus, typically by pressing the physical Escape key. Hoverable means if pointer hover triggered the overlay, the pointer must be able to move over the overlay content itself without the overlay disappearing. Persistent means the overlay must remain visible until the hover or focus trigger is removed or the user dismisses it.",
                "Notice how plain-text tooltips naturally satisfy these criteria when properly engineered: a user hovers an icon button, the tooltip appears, the user moves their mouse over the tooltip text to inspect it closely (Hoverable), or presses Escape to clear it from blocking background text (Dismissable). If the tooltip contained interactive buttons, attempting to tab to them would break the focus lifecycle. Therefore, enterprise design systems strictly mandate: if content requires interactive clicks, it is an interactive Popover, never a Tooltip.",
                "Let us model this triage system in TypeScript. We will build an Enterprise Overlay Classifier that analyzes component specifications, validates role contracts, detects WCAG violations, and assigns appropriate interaction state machines."
            ],
            "example": "A museum exhibit where a static brass plaque provides quick historical context while an interactive touchscreen kiosk enables deep exploration.",
            "code": """type OverlayType = 'TOOLTIP' | 'POPOVER' | 'CONTEXT_MENU';

interface OverlayContract {
  type: OverlayType;
  role: string;
  triggerEvent: 'hover_focus' | 'click' | 'contextmenu';
  ariaBinding: 'aria-describedby' | 'aria-controls' | 'aria-expanded';
  allowsInteractiveContent: boolean;
  dismissOnEscape: boolean;
}

class OverlayContractValidator {
  public static validate(type: OverlayType, containsInteractiveElements: boolean): {
    isValid: boolean;
    contract: OverlayContract;
    warning?: string;
  } {
    switch (type) {
      case 'TOOLTIP': {
        const isValid = !containsInteractiveElements;
        return {
          isValid,
          contract: {
            type: 'TOOLTIP',
            role: 'tooltip',
            triggerEvent: 'hover_focus',
            ariaBinding: 'aria-describedby',
            allowsInteractiveContent: false,
            dismissOnEscape: true
          },
          warning: isValid
            ? undefined
            : 'WCAG VIOLATION: Tooltips must never contain interactive controls (links, buttons). Upgrade to POPOVER.'
        };
      }
      case 'POPOVER': {
        return {
          isValid: true,
          contract: {
            type: 'POPOVER',
            role: 'dialog',
            triggerEvent: 'click',
            ariaBinding: 'aria-expanded',
            allowsInteractiveContent: true,
            dismissOnEscape: true
          }
        };
      }
      case 'CONTEXT_MENU': {
        return {
          isValid: true,
          contract: {
            type: 'CONTEXT_MENU',
            role: 'menu',
            triggerEvent: 'contextmenu',
            ariaBinding: 'aria-controls',
            allowsInteractiveContent: true,
            dismissOnEscape: true
          }
        };
      }
    }
  }
}

// Case 1: Simple Contextual Tooltip
console.log('=== CASE 1: ACCESSIBLE PLAIN-TEXT TOOLTIP ===');
const plainTooltip = OverlayContractValidator.validate('TOOLTIP', false);
console.log('Valid:', plainTooltip.isValid);
console.log('Role:', plainTooltip.contract.role);
console.log('Trigger:', plainTooltip.contract.triggerEvent);
console.log('ARIA Binding:', plainTooltip.contract.ariaBinding);

// Case 2: Illegal Interactive Tooltip
console.log('\\n=== CASE 2: ILLEGAL INTERACTIVE TOOLTIP ATTEMPT ===');
const illegalTooltip = OverlayContractValidator.validate('TOOLTIP', true);
console.log('Valid:', illegalTooltip.isValid);
console.log('Alert:', illegalTooltip.warning);

// Case 3: Rich Interactive Popover
console.log('\\n=== CASE 3: SOVEREIGN INTERACTIVE POPOVER ===');
const popover = OverlayContractValidator.validate('POPOVER', true);
console.log('Valid:', popover.isValid);
console.log('Role:', popover.contract.role);
console.log('Interactive Allowed:', popover.contract.allowsInteractiveContent);""",
            "output": """=== CASE 1: ACCESSIBLE PLAIN-TEXT TOOLTIP ===
Valid: true
Role: tooltip
Trigger: hover_focus
ARIA Binding: aria-describedby

=== CASE 2: ILLEGAL INTERACTIVE TOOLTIP ATTEMPT ===
Valid: false
Alert: WCAG VIOLATION: Tooltips must never contain interactive controls (links, buttons). Upgrade to POPOVER.

=== CASE 3: SOVEREIGN INTERACTIVE POPOVER ===
Valid: true
Role: dialog
Interactive Allowed: true""",
            "codeNotes": [
                {"line": 1, "note": "OverlayType partitions micro-overlays into distinct semantic and behavioral categories."},
                {"line": 15, "note": "Enforces WCAG 2.1 1.4.13 rule forbidding interactive buttons or links inside tooltips."},
                {"line": 52, "note": "Validates proper ARIA contracts: aria-describedby for tooltips and aria-expanded for popovers."}
            ],
            "tryIt": "Add an assertion in OverlayContractValidator that rejects context menus triggered on hover.",
            "check": {
                "question": "Why does the WAI-ARIA specification forbid interactive elements (like buttons or links) inside tooltips?",
                "options": [
                    "Because keyboard users navigating with Tab focus cannot interact with elements inside a tooltip without causing the tooltip trigger to lose focus and close",
                    "Because modern browsers block network requests that originate from inside tooltips",
                    "Because screen readers cannot synthesize speech for text rendered in yellow boxes",
                    "Because CSS transforms fail to render button click animations on floating elements"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Tooltips appear on hover and focus of their trigger element; attempting to tab into a tooltip moves focus away from the trigger, which instantly dismisses the tooltip, making its buttons permanently unreachable for keyboard users."
            }
        },
        {
            "title": "The Safe Triangle & Hover Bridge Problem: Avoiding Premature Dismissal",
            "say": [
                "When a design system implements an interactive floating overlay triggered on mouse hover—such as a rich mega-menu dropdown or an e-commerce shopping bag preview—engineers immediately encounter one of the most maddening geometric interaction bugs in frontend engineering: the Hover Gap Dilemma, also known as the Hover Bridge Problem.",
                "The bug manifests as follows: A user hovers their mouse pointer over a trigger navigation link labeled 'Products'. The floating mega-menu appears eight pixels below the link. To interact with a submenu link inside the mega-menu, the user moves their mouse pointer downward toward the menu card. However, in the brief eight-pixel physical gap between the bottom edge of the trigger button and the top edge of the floating card, the mouse pointer leaves the trigger element.",
                "Because standard DOM events fire `mouseleave` the instant the pointer crosses outside the trigger's bounding box, the application immediately unmounts the floating menu. The user experiences an infuriating interaction glitch where the menu vanishes before their mouse can ever reach it. Naive developers often attempt to fix this with arbitrary timeout delays, such as waiting three hundred milliseconds before closing. However, debounce timers make interfaces feel sluggish and leave lingering orphaned popovers when users navigate rapidly across adjacent navigation items.",
                "To solve this problem with mathematical precision, enterprise design systems implement the Safe Triangle Algorithm (often referred to as the Amazon Mega-Menu Pattern). Instead of relying on crude timers, the system tracks the user's continuous pointer trajectory. When the floating overlay mounts, the engine computes a dynamic geometric polygon—a triangle whose apex is the current cursor coordinate, and whose base spans the two bounding corners of the floating overlay card.",
                "To understand the Safe Triangle through an everyday physical analogy, consider an airport passenger boarding bridge (jet bridge) connecting the departure gate to an airplane door. When passengers walk from the terminal into the aircraft, they do not jump across an open eight-foot gap on the windy runway. The accordion-style jet bridge seals the entire path between the terminal doorway and the airplane door.",
                "As long as the passenger remains inside the enclosed bridge hallway, they are guaranteed safe transit from the terminal to the plane without falling onto the tarmac. The Safe Triangle provides this exact geometric jet bridge: as long as the user's cursor velocity vector points toward the floating card inside the geometric triangle, the system inhibits dismissal, guaranteeing uninterrupted passage.",
                "In code, detecting whether the cursor resides inside the safe triangle uses the standard Barycentric Coordinate or 2D Cross-Product Vector Test. If the cursor coordinates `(x, y)` lie inside the triangle formed by `(cursor_origin, floating_top_left, floating_top_right)`, any `mouseleave` events emitted by the trigger button are suppressed. The instant the cursor exits the triangle or enters the floating card itself, normal event handling resumes.",
                "Furthermore, what happens if the user suddenly changes their mind while their pointer is inside the safe triangle? Suppose a user hovers over 'Products', begins moving diagonally toward the mega-menu, but then realizes they actually wanted 'Pricing' located directly adjacent to 'Products'. If the safe triangle algorithm were naive, it would lock out the 'Pricing' navigation link until the cursor completely cleared the triangle.",
                "To prevent this navigation lock-in, high-performance engines calculate the velocity and angle of cursor movement. If the cursor stalls inside the triangle for more than one hundred fifty milliseconds without forward progress toward the base, or if the cursor direction reverses away from the floating card, the safe triangle instantly dissolves. This hybrid geometric-temporal model ensures that deliberate traversal is protected while intentional redirection is immediately acknowledged.",
                "Let us build an enterprise Safe Triangle Hover Bridge Engine in TypeScript. We will implement vector cross-product geometry, calculate dynamic bounding vectors, and certify that mouse movements toward the overlay never trigger premature dismissal."
            ],
            "example": "An airport accordion jet bridge that seals the entire walking path between the gate terminal and airplane door, preventing passengers from falling into the open gap.",
            "code": """interface Point2D {
  x: number;
  y: number;
}

interface Rect2D {
  top: number;
  left: number;
  width: number;
  height: number;
  bottom: number;
  right: number;
}

class SafeTriangleEngine {
  // 2D Vector Cross Product to test if point P is on the same side of line AB
  private static crossProduct(a: Point2D, b: Point2D, p: Point2D): number {
    return (b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x);
  }

  // Determines if point P lies inside triangle (V1, V2, V3)
  public static isPointInTriangle(p: Point2D, v1: Point2D, v2: Point2D, v3: Point2D): boolean {
    const d1 = this.crossProduct(v1, v2, p);
    const d2 = this.crossProduct(v2, v3, p);
    const d3 = this.crossProduct(v3, v1, p);

    const hasNeg = d1 < 0 || d2 < 0 || d3 < 0;
    const hasPos = d1 > 0 || d2 > 0 || d3 > 0;

    return !(hasNeg && hasPos);
  }

  public static evaluateHoverBridge(
    currentCursor: Point2D,
    previousCursor: Point2D,
    floatingCard: Rect2D
  ): { isProtectedByBridge: boolean; reason: string } {
    // Apex = previous cursor position when leaving trigger
    const apex = previousCursor;
    // Base corners of the floating card (top-left and top-right if card is below)
    const baseLeft: Point2D = { x: floatingCard.left, y: floatingCard.top };
    const baseRight: Point2D = { x: floatingCard.right, y: floatingCard.top };

    // Check if current cursor is inside the safe trajectory triangle
    const inTriangle = this.isPointInTriangle(currentCursor, apex, baseLeft, baseRight);

    if (inTriangle) {
      return {
        isProtectedByBridge: true,
        reason: 'Pointer is actively traveling inside the Safe Triangle toward the floating menu.'
      };
    } else {
      return {
        isProtectedByBridge: false,
        reason: 'Pointer trajectory has diverted away from the floating menu; safe to dismiss.'
      };
    }
  }
}

// Geometry Simulation:
// Floating mega-menu positioned at top: 100, left: 200, width: 300 (right: 500), height: 200
const floatingMenuRect: Rect2D = {
  top: 100,
  left: 200,
  width: 300,
  height: 200,
  bottom: 300,
  right: 500
};

// User was at trigger button at (350, 60) and moves downward toward the menu
const triggerExitPoint: Point2D = { x: 350, y: 60 };

console.log('=== SAFE TRIANGLE HOVER BRIDGE GEOMETRY EVALUATION ===');

// Vector 1: Cursor moves downward into the gap at (340, 80) heading directly for the menu
const intentionalMovement: Point2D = { x: 340, y: 80 };
const test1 = SafeTriangleEngine.evaluateHoverBridge(intentionalMovement, triggerExitPoint, floatingMenuRect);
console.log('Test 1 (Direct diagonal path to menu at x:340, y:80):');
console.log(' Protected:', test1.isProtectedByBridge);
console.log(' Reason:', test1.reason);

// Vector 2: Cursor swerves far to the left toward another nav link at (100, 80)
const strayMovement: Point2D = { x: 100, y: 80 };
const test2 = SafeTriangleEngine.evaluateHoverBridge(strayMovement, triggerExitPoint, floatingMenuRect);
console.log('\\nTest 2 (Stray cursor swerving away at x:100, y:80):');
console.log(' Protected:', test2.isProtectedByBridge);
console.log(' Reason:', test2.reason);""",
            "output": """=== SAFE TRIANGLE HOVER BRIDGE GEOMETRY EVALUATION ===
Test 1 (Direct diagonal path to menu at x:340, y:80):
 Protected: true
 Reason: Pointer is actively traveling inside the Safe Triangle toward the floating menu.

Test 2 (Stray cursor swerving away at x:100, y:80):
 Protected: false
 Reason: Pointer trajectory has diverted away from the floating menu; safe to dismiss.""",
            "codeNotes": [
                {"line": 13, "note": "crossProduct calculates 2D orientation vectors to verify point-in-polygon containment."},
                {"line": 28, "note": "evaluateHoverBridge constructs a dynamic geometric triangle between cursor and card corners."},
                {"line": 64, "note": "Demonstrates instantaneous protection during transit and instant dismissal when moving away."}
            ],
            "tryIt": "Simulate a cursor moving vertically upward away from the menu and verify that isProtectedByBridge returns false.",
            "check": {
                "question": "How does the Safe Triangle algorithm solve the hover gap problem without relying on clumsy timeout delays?",
                "options": [
                    "By forming a geometric vector triangle between the cursor's exit position and the overlay's boundaries, suppressing dismissal as long as the mouse pointer moves toward the overlay",
                    "By setting a fixed five-second CSS transition on all anchor elements",
                    "By locking the mouse pointer to the center of the screen via the Pointer Lock API",
                    "By forcing the browser to take a full screenshot before unmounting components"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "The Safe Triangle algorithm constructs a mathematical polygon connecting the cursor to the target card; if the user's cursor remains inside this trajectory corridor, dismissal is safely suppressed without adding laggy timers."
            }
        },
        {
            "title": "Virtual Anchoring: Tracking Text Selection, Mouse Coordinates & Canvas Nodes",
            "say": [
                "In traditional web development, floating positioning engines assume that every overlay is tethered to a physical, permanent Document Object Model element—such as a `<button>` or an `<a>` tag. The engine calls `anchorElement.getBoundingClientRect()` and computes coordinates. However, in modern advanced web applications—such as rich text editors, PDF document annotators, spreadsheet cell ranges, and WebGL financial charts—the object that requires an overlay is not an HTML element at all.",
                "Consider a collaborative document editor like Google Docs or Notion. When a user highlights three words in a sentence, an interactive formatting toolbar (bold, italic, comment) must float immediately above the highlighted text. There is no permanent `<button id=\"selection\">` in the DOM tree; the selection is an ephemeral browser Range object. Similarly, when a user hovers over a candlestick bar inside an HTML5 `<canvas>` stock chart, the canvas is a single monolithic DOM element. The individual candlestick has no DOM representation.",
                "To position floating overlays relative to non-DOM entities, enterprise design systems implement Virtual Anchoring. A Virtual Anchor is an abstract JavaScript object that satisfies the structural contract of a DOMRect without requiring a backing physical HTML element. Specifically, a Virtual Anchor implements a `getBoundingClientRect()` method that returns dynamic coordinates on demand.",
                "For text selections, the virtual anchor queries `window.getSelection()?.getRangeAt(0).getBoundingClientRect()`. For mouse tracking (such as a floating tooltip that follows the user's cursor across a map), the virtual anchor returns a zero-width, zero-height bounding box positioned exactly at the cursor's current `(clientX, clientY)` coordinates: `{ top: y, bottom: y, left: x, right: x, width: 0, height: 0 }`.",
                "To understand Virtual Anchoring through an everyday physical analogy, consider a laser-guided presentation pointer used in an auditorium. The speaker does not climb onto the stage and tape a physical post-it note to the projection screen. Instead, the speaker aims a handheld laser emitter (the virtual anchor) at a specific sentence on the screen. The illuminated red laser dot exists purely as a localized point of light. A camera tracking system can align a secondary spotlight with that exact red dot without needing a physical hook in the screen fabric.",
                "In software, Virtual Anchors provide this exact localized laser coordinate. The positioning engine processes the virtual anchor identically to a physical DOM element: calculating auto-placement, executing flip algorithms, and managing collision detection.",
                "Furthermore, high-performance virtual anchors must handle dynamic updates cleanly. If a user expands their text selection by dragging the mouse, the virtual anchor's coordinates change continuously. By subscribing to selectionchange and mousemove events through `requestAnimationFrame`, the floating overlay glides smoothly above the active coordinate vector.",
                "Virtual anchoring also resolves a profound architectural constraint in micro-frontend applications and Shadow DOM boundaries. When components are isolated inside disparate shadow roots, physical DOM element references cannot cross encapsulation barriers. An overlay manager living in the main document cannot directly attach event listeners or read private DOM nodes inside a closed shadow root. However, the shadow component can emit abstract coordinate payloads that the overlay manager wraps in a Virtual Anchor, enabling seamless positioning without violating encapsulation boundaries.",
                "Consider also performance optimizations for canvas and WebGL rendering. In high-frequency data applications, creating thousands of temporary JavaScript coordinate objects every second can trigger garbage collection pauses. Enterprise virtual anchor factories employ object pooling—reusing a single pre-allocated VirtualElement instance and simply mutating its numerical coordinate properties on each mouse move. This eliminates memory allocations entirely during chart scrubbing. Furthermore, by maintaining a stable object reference, downstream components can bind reactive listeners to the virtual anchor without causing unneeded re-renders or GC pressure.",
                "Let us build an enterprise Virtual Anchor Positioning Engine in TypeScript. We will implement virtual rect contracts for cursor tracking, text selection ranges, and canvas coordinate markers, and position floating overlays with pixel perfection."
            ],
            "example": "A laser presentation pointer that projects a red target dot onto a screen for a motorized spotlight to track without needing a physical hook in the fabric.",
            "code": """type Placement = 
  | 'top' | 'top-start' | 'top-end'
  | 'bottom' | 'bottom-start' | 'bottom-end'
  | 'left' | 'left-start' | 'left-end'
  | 'right' | 'right-start' | 'right-end';

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
  bottom: number;
  right: number;
}

class AnchorPositioningEngine {
  public static computeCoordinates(
    anchor: Rect,
    floating: { width: number; height: number },
    placement: Placement,
    gap: number = 8
  ): { x: number; y: number } {
    let x = 0;
    let y = 0;
    switch (placement) {
      case 'top':
        x = anchor.left + (anchor.width / 2) - (floating.width / 2);
        y = anchor.top - floating.height - gap;
        break;
      case 'bottom':
        x = anchor.left + (anchor.width / 2) - (floating.width / 2);
        y = anchor.bottom + gap;
        break;
      case 'right':
        x = anchor.right + gap;
        y = anchor.top + (anchor.height / 2) - (floating.height / 2);
        break;
      default:
        x = anchor.left;
        y = anchor.bottom + gap;
        break;
    }
    return { x: Math.round(x), y: Math.round(y) };
  }
}

interface VirtualElement {
  getBoundingClientRect(): Rect;
  contextName: string;
}

class VirtualAnchorFactory {
  // Creates a virtual anchor for mouse cursor tracking
  public static fromCursor(clientX: number, clientY: number): VirtualElement {
    return {
      contextName: `Cursor [${clientX}, ${clientY}]`,
      getBoundingClientRect: (): Rect => ({
        top: clientY,
        bottom: clientY,
        left: clientX,
        right: clientX,
        width: 0,
        height: 0
      })
    };
  }

  // Creates a virtual anchor for an ephemeral text selection range
  public static fromTextRange(startCoord: { x: number; y: number }, endCoord: { x: number; y: number }): VirtualElement {
    const left = Math.min(startCoord.x, endCoord.x);
    const top = Math.min(startCoord.y, endCoord.y);
    const right = Math.max(startCoord.x, endCoord.x);
    const bottom = Math.max(startCoord.y, endCoord.y);

    return {
      contextName: 'Text Selection Range',
      getBoundingClientRect: (): Rect => ({
        top,
        bottom,
        left,
        right,
        width: right - left,
        height: bottom - top
      })
    };
  }

  // Creates a virtual anchor for a canvas data node (e.g. candlestick bar)
  public static fromCanvasNode(canvasRect: Rect, nodeRelX: number, nodeRelY: number, nodeWidth: number, nodeHeight: number): VirtualElement {
    const absLeft = canvasRect.left + nodeRelX;
    const absTop = canvasRect.top + nodeRelY;

    return {
      contextName: 'Canvas Candlestick Marker',
      getBoundingClientRect: (): Rect => ({
        top: absTop,
        bottom: absTop + nodeHeight,
        left: absLeft,
        right: absLeft + nodeWidth,
        width: nodeWidth,
        height: nodeHeight
      })
    };
  }
}

// System Execution
console.log('=== VIRTUAL ANCHOR FLOATING SYSTEM TESTS ===');

// Case 1: Mouse-Tracking Tooltip
const cursorAnchor = VirtualAnchorFactory.fromCursor(450, 300);
const cursorTooltipCoords = AnchorPositioningEngine.computeCoordinates(
  cursorAnchor.getBoundingClientRect(),
  { width: 140, height: 36 },
  'top',
  10
);
console.log('1. Mouse-Tracking Virtual Anchor:');
console.log('   Anchor Context:', cursorAnchor.contextName);
console.log(`   Floating Tooltip Positioned at: (${cursorTooltipCoords.x}px, ${cursorTooltipCoords.y}px)`);

// Case 2: Highlighted Text Selection Bubble
const textAnchor = VirtualAnchorFactory.fromTextRange({ x: 220, y: 180 }, { x: 380, y: 200 });
const textToolbarCoords = AnchorPositioningEngine.computeCoordinates(
  textAnchor.getBoundingClientRect(),
  { width: 160, height: 40 },
  'top',
  8
);
console.log('\\n2. Text Selection Virtual Anchor:');
console.log('   Anchor Context:', textAnchor.contextName);
console.log(`   Toolbar Centered Above Selection at: (${textToolbarCoords.x}px, ${textToolbarCoords.y}px)`);

// Case 3: Canvas Chart Data Point
const canvasBox: Rect = { top: 400, left: 100, width: 800, height: 400, bottom: 800, right: 900 };
const canvasAnchor = VirtualAnchorFactory.fromCanvasNode(canvasBox, 250, 120, 14, 80);
const canvasTooltipCoords = AnchorPositioningEngine.computeCoordinates(
  canvasAnchor.getBoundingClientRect(),
  { width: 180, height: 90 },
  'right',
  12
);
console.log('\\n3. Canvas Data Node Virtual Anchor:');
console.log('   Anchor Context:', canvasAnchor.contextName);
console.log(`   Data Tooltip Positioned to Right at: (${canvasTooltipCoords.x}px, ${canvasTooltipCoords.y}px)`);""",
            "output": """=== VIRTUAL ANCHOR FLOATING SYSTEM TESTS ===
1. Mouse-Tracking Virtual Anchor:
   Anchor Context: Cursor [450, 300]
   Floating Tooltip Positioned at: (380px, 254px)

2. Text Selection Virtual Anchor:
   Anchor Context: Text Selection Range
   Toolbar Centered Above Selection at: (220px, 132px)

3. Canvas Data Node Virtual Anchor:
   Anchor Context: Canvas Candlestick Marker
   Data Tooltip Positioned to Right at: (376px, 515px)""",
            "codeNotes": [
                {"line": 1, "note": "VirtualElement defines an abstract interface implementing getBoundingClientRect() without DOM nodes."},
                {"line": 7, "note": "fromCursor converts point clientX/clientY coordinates into zero-dimension bounding rectangles."},
                {"line": 34, "note": "fromCanvasNode translates relative canvas coordinates into absolute viewport bounding rectangles."}
            ],
            "tryIt": "Create a virtual anchor representing a multi-line text selection and verify that floating toolbars align to its top edge.",
            "check": {
                "question": "What is the primary benefit of the Virtual Anchor pattern in enterprise design systems?",
                "options": [
                    "It allows floating overlays (toolbars, tooltips) to tether to abstract coordinates like text selections, canvas shapes, and mouse cursors that lack physical DOM nodes",
                    "It eliminates the need for CSS styles across the entire application",
                    "It converts JavaScript files directly into WebAssembly binaries",
                    "It forces screen readers to ignore background audio streams"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Virtual Anchors implement the getBoundingClientRect() contract for non-DOM entities (such as text selections, mouse coordinates, and canvas charts), enabling seamless positioning without requiring physical HTML elements."
            }
        },
        {
            "title": "Floating UI Arrow Positioning & Trigonometric Offset Compensation",
            "say": [
                "A hallmark of a polished, production-grade floating overlay is the visual indicator arrow (also called the caret, tip, or beak). The arrow serves a critical cognitive function: it establishes an unambiguous visual umbilical cord connecting the floating card directly to its source trigger. Without an arrow, a floating card hovering in whitespace can appear disoriented, leaving users uncertain which button or table row spawned the overlay.",
                "However, implementing a pixel-perfect floating arrow is surprisingly intricate. In naive implementations, developers position a small square rotated forty-five degrees (`transform: rotate(45deg)`) at `left: 50%` of the floating card. While this works when the floating card is perfectly centered above the anchor, it catastrophically breaks whenever the card triggers an auto-flip or a cross-axis shift. If the floating card shifts eighty pixels to the left to avoid a viewport boundary collision, a statically centered arrow now points into empty space, completely detached from the trigger button.",
                "To resolve this, enterprise design systems implement Trigonometric Arrow Offset Compensation. The arrow must be positioned dynamically along the floating element's perimeter so that its tip continuously aligns with the center of the anchor element, regardless of how far the floating card has shifted.",
                "Let us examine the geometry: In a bottom placement, the arrow is mounted along the top edge of the floating card. Its ideal horizontal position `arrowX` equals the anchor's horizontal center minus the floating card's left coordinate: `arrowX = (anchor.left + anchor.width / 2) - floating.left - (arrowWidth / 2)`. However, if the floating card shifted drastically, `arrowX` might calculate to a position beyond the edge of the card, causing the arrow to detach or overlap rounded card corners.",
                "To prevent this visual defect, the positioning engine clamps the arrow position using a safety padding: `minArrowX = cornerRadius + padding`, and `maxArrowX = floating.width - arrowWidth - cornerRadius - padding`. The arrow's position is strictly clamped between these two bounds: `clampedArrowX = Math.max(minArrowX, Math.min(arrowX, maxArrowX))`.",
                "To understand arrow compensation through an everyday physical analogy, consider a flexible automotive refueling nozzle connected to a fuel tanker truck. As the fuel truck pulls alongside diverse vehicles with fuel caps located at varying heights and angles, the dispensing nozzle does not remain rigidly fixed in one position. The nozzle pivots along an articulated swivel joint, adjusting its angle and reach to seal tightly against the vehicle's fuel inlet without leaking.",
                "In software, dynamic arrow positioning provides this exact articulated swivel joint. Whether the card is centered, flipped, or shifted, the arrow tip locks onto the anchor center while its base remains securely sealed inside the card perimeter.",
                "In addition to position clamping, design systems must address arrow visual styling and border rendering. An arrow is typically rendered using an absolute-positioned pseudo-element (`::before` or `::after`) or a dedicated SVG/HTML node rotated forty-five degrees. When the floating card has a visible border (e.g., `border: 1px solid #334155`) and a box shadow, the arrow must perfectly match both the card's background fill, border color, and drop shadow.",
                "If the arrow is a simple square rotated forty-five degrees, only two of its four borders should be styled with borders, depending on placement: for a bottom placement where the arrow points upward, only `border-top` and `border-left` are rendered, while the bottom and right borders remain transparent so they merge seamlessly into the card body. Furthermore, to avoid optical gaps where background pixels bleed between the arrow and card, the arrow offset is tucked by half a pixel into the container.",
                "Let us model an enterprise Floating Arrow Engine in TypeScript. We will implement coordinate alignment, corner-radius clamping, optical overlap tuning, and directional CSS transforms across all four cardinal sides."
            ],
            "example": "An articulated fueling nozzle on a delivery truck that swivels dynamically to match the exact fuel inlet angle of different vehicles.",
            "code": """interface ArrowConfig {
  size: number; // width/height of the square before 45-deg rotation
  cornerRadius: number; // card border-radius to prevent corner clipping
}

interface ArrowPositionResult {
  placement: Placement;
  style: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
    transform: string;
  };
  clampedOffset: number;
}

class FloatingArrowEngine {
  public static computeArrow(
    anchor: Rect,
    floatingRect: { left: number; top: number; width: number; height: number },
    placement: Placement,
    config: ArrowConfig = { size: 12, cornerRadius: 8 }
  ): ArrowPositionResult {
    const { size, cornerRadius } = config;
    const padding = 4; // safety gap from curved corners
    const isVertical = placement.startsWith('top') || placement.startsWith('bottom');

    if (isVertical) {
      // Calculate ideal center-to-center offset
      const anchorCenterX = anchor.left + (anchor.width / 2);
      const idealArrowLeft = anchorCenterX - floatingRect.left - (size / 2);

      // Clamp so arrow never bleeds over rounded card corners
      const minLeft = cornerRadius + padding;
      const maxLeft = floatingRect.width - size - cornerRadius - padding;
      const clampedLeft = Math.max(minLeft, Math.min(idealArrowLeft, maxLeft));

      const isBottom = placement.startsWith('bottom');
      return {
        placement,
        clampedOffset: Math.round(clampedLeft),
        style: {
          [isBottom ? 'top' : 'bottom']: `-${size / 2}px`,
          left: `${Math.round(clampedLeft)}px`,
          transform: 'rotate(45deg)'
        }
      };
    } else {
      // Horizontal placement (left or right)
      const anchorCenterY = anchor.top + (anchor.height / 2);
      const idealArrowTop = anchorCenterY - floatingRect.top - (size / 2);

      const minTop = cornerRadius + padding;
      const maxTop = floatingRect.height - size - cornerRadius - padding;
      const clampedTop = Math.max(minTop, Math.min(idealArrowTop, maxTop));

      const isRight = placement.startsWith('right');
      return {
        placement,
        clampedOffset: Math.round(clampedTop),
        style: {
          [isRight ? 'left' : 'right']: `-${size / 2}px`,
          top: `${Math.round(clampedTop)}px`,
          transform: 'rotate(45deg)'
        }
      };
    }
  }
}

// Coordinate Test:
// Anchor Button at left: 500, width: 80 (center: 540)
const btnAnchor: Rect = { top: 200, left: 500, width: 80, height: 36, bottom: 236, right: 580 };

// Floating Card shifted leftward to left: 420, width: 240 (card spans 420 to 660)
const shiftedCard = { top: 244, left: 420, width: 240, height: 120 };

console.log('=== FLOATING ARROW OFFSET CALCULATION ===');
const arrowResult = FloatingArrowEngine.computeArrow(btnAnchor, shiftedCard, 'bottom-start');

console.log('Placement:', arrowResult.placement);
console.log('Computed Clamped Offset:', `${arrowResult.clampedOffset}px`);
console.log('Generated Inline CSS Styles:', JSON.stringify(arrowResult.style, null, 2));

// Verify that the arrow aligns with the anchor center:
// Floating left (420) + Arrow left (114) + Half Arrow Size (6) = 540 (Exact Anchor Center!)
const actualArrowCenter = shiftedCard.left + arrowResult.clampedOffset + 6;
console.log('\\nVerification:');
console.log('Anchor Center X:', btnAnchor.left + btnAnchor.width / 2, 'px');
console.log('Arrow Tip Center X:', actualArrowCenter, 'px');
console.log('Exact Geometric Coincidence?', actualArrowCenter === (btnAnchor.left + btnAnchor.width / 2));""",
            "output": """=== FLOATING ARROW OFFSET CALCULATION ===
Placement: bottom-start
Computed Clamped Offset: 114px
Generated Inline CSS Styles: {
  "top": "-6px",
  "left": "114px",
  "transform": "rotate(45deg)"
}

Verification:
Anchor Center X: 540 px
Arrow Tip Center X: 540 px
Exact Geometric Coincidence? true""",
            "codeNotes": [
                {"line": 1, "note": "ArrowConfig defines size and border-radius thresholds for corner collision prevention."},
                {"line": 28, "note": "Clamps arrow offset between minLeft and maxLeft to guarantee the rotated box stays on flat edges."},
                {"line": 78, "note": "Proves exact geometric coincidence between arrow tip center and anchor button center."}
            ],
            "tryIt": "Simulate an extreme card shift where idealArrowLeft < minLeft and verify that the arrow clamps safely to minLeft.",
            "check": {
                "question": "Why must a floating UI arrow's position be clamped using the card's border radius and padding?",
                "options": [
                    "To prevent the rotated arrow from protruding over the rounded corners of the card when the overlay is shifted",
                    "To prevent CSS animations from exceeding the sixty-hertz refresh limit",
                    "Because rotated HTML elements crash if their coordinates are negative",
                    "To force graphics cards to antialias transparent gradients"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "If a floating overlay shifts significantly along the cross axis, an unclamped arrow could slide onto the rounded corner of the container, breaking visual continuity; clamping ensures the arrow remains on a flat surface."
            }
        },
        {
            "title": "Enterprise Application: Sovereign Financial Candlestick Chart with Virtual Anchor Tooltips",
            "say": [
                "To synthesize our mastery of popovers, tooltips, safe hover bridges, virtual anchors, and trigonometric arrow positioning, we now construct a state-of-the-art enterprise system: the Sovereign Financial Candlestick Chart with Virtual Anchor Tooltips. In institutional trading desks—such as Bloomberg, FactSet, or Goldman Sachs Marquee—financial analysts scrutinize multi-screen candlestick charts displaying millisecond tick data across global equity and foreign exchange markets.",
                "In high-density canvas rendering, traditional DOM-based overlays fail completely. Rendering five thousand individual DOM elements for candlestick bars brings browser engines to their knees, causing severe frame drops and catastrophic memory bloat. Instead, institutional charts render bars directly onto an HTML5 `<canvas>` surface using hardware-accelerated WebGL or 2D rasterization. But when an analyst hovers over a single candlestick, they expect a rich, pixel-perfect floating tooltip displaying Open, High, Low, Close (OHLC) values, Volume, and VWAP metrics.",
                "Our Sovereign Financial Candlestick Chart system solves this with zero DOM overhead: First, the chart maintains an internal spatial index (a high-performance binary search tree or flat coordinate index) of all rendered price bars. When the analyst moves their mouse over the canvas, a high-frequency `mousemove` listener interrogates the mouse coordinates and maps them to the nearest candlestick bar in logarithmic time.",
                "Second, our Virtual Anchor Factory converts the selected candlestick bar's spatial coordinates into a Virtual Anchor, complete with dynamic `getBoundingClientRect()` implementation. Third, our Anchor Positioning Engine calculates ideal tooltip coordinates, evaluating viewport boundaries to execute auto-flip if the bar is near the top or bottom of the screen.",
                "Fourth, our Floating Arrow Engine computes trigonometric arrow offset compensation, clamping the arrow along the card's edge so it points with subpixel precision directly at the wick of the active candlestick bar. Fifth, the tooltip mounts via our top-level Portal with `role=\"tooltip\"` and `aria-live=\"polite\"`, ensuring that assistive technologies announce active financial metrics without interrupting screen reader users.",
                "Let us observe this architecture in action: An analyst hovers over the 14:35 UTC Bitcoin/USD candlestick bar at pixel coordinates (480, 210). The chart engine resolves the bar, constructs a Virtual Anchor with dimensions width: 10, height: 60, and requests a 'top' placement. Because the bar is near the top of the viewport, the collision engine auto-flips placement to 'bottom', positions the tooltip at (395, 276), and calculates an arrow offset of 80px pointing directly to the bar's midpoint.",
                "Notice how our candlestick tooltip system satisfies institutional auditability and accessibility standards. In automated trading desks, analysts frequently capture screenshots or export PDF audit reports of price charts for regulatory compliance. Because our tooltip is rendered via semantic HTML and CSS rather than baked into canvas pixels, the financial metrics remain searchable, selectable, and machine-readable in automated test pipelines.",
                "Additionally, the candlestick tooltip integrates high-contrast visual states for accessibility. When users configure their operating system to high contrast mode (such as Windows High Contrast Black), the CSS engine replaces subtle background shadows with explicit two-pixel high-contrast border outlines. Assistive technology agents and keyboard magnification utilities can cleanly distinguish the floating overlay from the dense candlestick graph beneath it.",
                "Furthermore, our implementation incorporates touch device support. When an analyst operates on an iPad or Microsoft Surface touchscreen in an executive boardroom, mouse hover events do not exist. The chart engine seamlessly translates touch tap gestures into virtual anchor coordinate locks, displaying the tooltip with an explicit touch dismissal hit-area outside the chart bounds.",
                "Let us model and execute this complete Sovereign Financial Candlestick Chart system in TypeScript. We will simulate canvas coordinates, virtual anchor creation, collision detection with auto-flip, and certified arrow geometry alignment.",
                "This architecture represents the absolute pinnacle of modern frontend design systems: delivering unbreakable mathematical precision, blazing sixty-fps rendering, and uncompromised accessibility across the world's most demanding data applications."
            ],
            "example": "A marine sonar console that detects underwater topography on a raw radar sweep and superimposes sharp target telemetry tags over detected submarines.",
            "code": """type Placement = 
  | 'top' | 'top-start' | 'top-end'
  | 'bottom' | 'bottom-start' | 'bottom-end'
  | 'left' | 'left-start' | 'left-end'
  | 'right' | 'right-start' | 'right-end';

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
  bottom: number;
  right: number;
}

interface VirtualElement {
  getBoundingClientRect(): Rect;
  contextName: string;
}

class VirtualAnchorFactory {
  public static fromCanvasNode(canvasRect: Rect, nodeRelX: number, nodeRelY: number, nodeWidth: number, nodeHeight: number): VirtualElement {
    const absLeft = canvasRect.left + nodeRelX;
    const absTop = canvasRect.top + nodeRelY;
    return {
      contextName: 'Canvas Candlestick Marker',
      getBoundingClientRect: (): Rect => ({
        top: absTop,
        bottom: absTop + nodeHeight,
        left: absLeft,
        right: absLeft + nodeWidth,
        width: nodeWidth,
        height: nodeHeight
      })
    };
  }
}

class CollisionResolutionEngine {
  public static resolvePlacement(
    anchor: Rect,
    floating: { width: number; height: number },
    preferredPlacement: Placement,
    viewport: { width: number; height: number; padding: number },
    gap: number = 8
  ): { finalPlacement: Placement; finalCoordinates: { x: number; y: number } } {
    let finalPlacement = preferredPlacement;
    const spaceAbove = anchor.top - viewport.padding;
    if (preferredPlacement === 'top' && spaceAbove < (floating.height + gap)) {
      finalPlacement = 'bottom';
    }
    let x = anchor.left + (anchor.width / 2) - (floating.width / 2);
    let y = finalPlacement === 'bottom' ? anchor.bottom + gap : anchor.top - floating.height - gap;
    return {
      finalPlacement,
      finalCoordinates: { x: Math.round(x), y: Math.round(y) }
    };
  }
}

class FloatingArrowEngine {
  public static computeArrow(
    anchor: Rect,
    floatingRect: { left: number; top: number; width: number; height: number },
    placement: Placement
  ): { clampedOffset: number; style: { top?: string; bottom?: string; left?: string; transform: string } } {
    const anchorCenterX = anchor.left + (anchor.width / 2);
    const arrowLeft = anchorCenterX - floatingRect.left - 6;
    const clampedLeft = Math.max(12, Math.min(arrowLeft, floatingRect.width - 24));
    return {
      clampedOffset: Math.round(clampedLeft),
      style: {
        top: placement.startsWith('bottom') ? '-6px' : undefined,
        bottom: placement.startsWith('top') ? '-6px' : undefined,
        left: `${Math.round(clampedLeft)}px`,
        transform: 'rotate(45deg)'
      }
    };
  }
}

interface CandlestickData {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  relX: number;
  relY: number;
  width: number;
  height: number;
}

interface CanvasViewport {
  screenRect: Rect;
  viewportWidth: number;
  viewportHeight: number;
}

class SovereignCandlestickTooltipSystem {
  public static inspectCandlestick(
    bar: CandlestickData,
    canvas: CanvasViewport,
    tooltipDimensions: { width: number; height: number }
  ): {
    virtualAnchor: VirtualElement;
    finalPlacement: Placement;
    tooltipCoords: { x: number; y: number };
    arrowOffset: number;
    renderedHTML: string;
  } {
    // 1. Create Virtual Anchor from Canvas Bar coordinates
    const virtualAnchor = VirtualAnchorFactory.fromCanvasNode(
      canvas.screenRect,
      bar.relX,
      bar.relY,
      bar.width,
      bar.height
    );

    const anchorRect = virtualAnchor.getBoundingClientRect();

    // 2. Resolve placement & flip collision
    const collision = CollisionResolutionEngine.resolvePlacement(
      anchorRect,
      tooltipDimensions,
      'top',
      { width: canvas.viewportWidth, height: canvas.viewportHeight, padding: 12 },
      8
    );

    // 3. Compute Arrow Positioning
    const arrow = FloatingArrowEngine.computeArrow(
      anchorRect,
      {
        left: collision.finalCoordinates.x,
        top: collision.finalCoordinates.y,
        width: tooltipDimensions.width,
        height: tooltipDimensions.height
      },
      collision.finalPlacement
    );

    // 4. Format Financial Monospace Markup
    const delta = bar.close - bar.open;
    const isBullish = delta >= 0;
    const sign = isBullish ? '+' : '';
    const colorClass = isBullish ? 'text-emerald-400' : 'text-red-400';

    const renderedHTML = [
      `<div id="candlestick-tooltip" role="tooltip" aria-live="polite"`,
      `     class="fixed pointer-events-none z-50 bg-slate-950 border border-slate-700 rounded-lg p-3 shadow-2xl text-xs font-mono"`,
      `     style="top: ${collision.finalCoordinates.y}px; left: ${collision.finalCoordinates.x}px; width: ${tooltipDimensions.width}px;">`,
      `  <div class="header font-bold text-slate-300 pb-1 border-b border-slate-800">${bar.timestamp} UTC</div>`,
      `  <div class="grid grid-cols-2 gap-x-2 gap-y-1 mt-2">`,
      `    <div>Open: <span class="text-white">${bar.open.toFixed(2)}</span></div>`,
      `    <div>High: <span class="text-white">${bar.high.toFixed(2)}</span></div>`,
      `    <div>Low: <span class="text-white">${bar.low.toFixed(2)}</span></div>`,
      `    <div>Close: <span class="${colorClass}">${bar.close.toFixed(2)} (${sign}${delta.toFixed(2)})</span></div>`,
      `  </div>`,
      `  <div class="mt-1 text-slate-400">Vol: ${bar.volume.toLocaleString()} BTC</div>`,
      `  <div class="arrow absolute bg-slate-950 border-t border-l border-slate-700"`,
      `       style="top: ${arrow.style.top ?? ''}; bottom: ${arrow.style.bottom ?? ''}; left: ${arrow.style.left ?? ''}; transform: ${arrow.style.transform}; width: 10px; height: 10px;"></div>`,
      `</div>`
    ].join('\\n');

    return {
      virtualAnchor,
      finalPlacement: collision.finalPlacement,
      tooltipCoords: collision.finalCoordinates,
      arrowOffset: arrow.clampedOffset,
      renderedHTML
    };
  }
}

// System Execution:
// Canvas situated at top: 80, left: 100 on a 1440x900 viewport
const canvasEnv: CanvasViewport = {
  screenRect: { top: 80, left: 100, width: 1200, height: 600, bottom: 680, right: 1300 },
  viewportWidth: 1440,
  viewportHeight: 900
};

// Bullish BTC Candlestick bar rendered near top of canvas (triggers auto-flip to bottom!)
const btcBar: CandlestickData = {
  timestamp: '2026-10-25 14:35',
  open: 67800.00,
  high: 68250.50,
  low: 67750.00,
  close: 68190.25,
  volume: 142.8,
  relX: 420,
  relY: 15, // Extremely close to canvas top (top: 95px from viewport)
  width: 14,
  height: 55
};

console.log('=== INSTITUTIONAL FINANCIAL CANDLESTICK TOOLTIP SYSTEM ===');
const tooltipResult = SovereignCandlestickTooltipSystem.inspectCandlestick(
  btcBar,
  canvasEnv,
  { width: 220, height: 110 }
);

console.log('Virtual Anchor Generated:', tooltipResult.virtualAnchor.contextName);
console.log('Virtual Anchor Absolute Bounding Box:', JSON.stringify(tooltipResult.virtualAnchor.getBoundingClientRect()));
console.log('Resolved Final Placement (After Auto-Flip Check):', tooltipResult.finalPlacement);
console.log('Tooltip Rendered Coordinates (x, y):', `(${tooltipResult.tooltipCoords.x}px, ${tooltipResult.tooltipCoords.y}px)`);
console.log('Arrow Clamped Offset:', `${tooltipResult.arrowOffset}px`);
console.log('\\nGenerated WAI-ARIA Monospace Tooltip DOM Markup:\\n', tooltipResult.renderedHTML);""",
            "output": """=== INSTITUTIONAL FINANCIAL CANDLESTICK TOOLTIP SYSTEM ===
Virtual Anchor Generated: Canvas Candlestick Marker
Virtual Anchor Absolute Bounding Box: {"top":95,"bottom":150,"left":520,"right":534,"width":14,"height":55}
Resolved Final Placement (After Auto-Flip Check): bottom
Tooltip Rendered Coordinates (x, y): (417px, 158px)
Arrow Clamped Offset: 104px

Generated WAI-ARIA Monospace Tooltip DOM Markup:
 <div id="candlestick-tooltip" role="tooltip" aria-live="polite"
     class="fixed pointer-events-none z-50 bg-slate-950 border border-slate-700 rounded-lg p-3 shadow-2xl text-xs font-mono"
     style="top: 158px; left: 417px; width: 220px;">
  <div class="header font-bold text-slate-300 pb-1 border-b border-slate-800">2026-10-25 14:35 UTC</div>
  <div class="grid grid-cols-2 gap-x-2 gap-y-1 mt-2">
    <div>Open: <span class="text-white">67800.00</span></div>
    <div>High: <span class="text-white">68250.50</span></div>
    <div>Low: <span class="text-white">67750.00</span></div>
    <div>Close: <span class="text-emerald-400">68190.25 (+390.25)</span></div>
  </div>
  <div class="mt-1 text-slate-400">Vol: 142.8 BTC</div>
  <div class="arrow absolute bg-slate-950 border-t border-l border-slate-700"
       style="top: -6px; bottom: ; left: 104px; transform: rotate(45deg); width: 10px; height: 10px;"></div>
</div>""",
            "codeNotes": [
                {"line": 1, "note": "CandlestickData represents financial price tick geometry on an HTML5 canvas element."},
                {"line": 28, "note": "inspectCandlestick synthesizes virtual anchoring, auto-flip collision detection, and arrow clamping."},
                {"line": 52, "note": "Generates monospace financial markup with aria-live='polite' for non-disruptive assistive vocalization."}
            ],
            "tryIt": "Simulate a candlestick bar near the right edge of the canvas and verify cross-axis horizontal shift clamping.",
            "check": {
                "question": "Why is 'aria-live=\"polite\"' used for the financial candlestick tooltip rather than 'aria-live=\"assertive\"'?",
                "options": [
                    "To ensure that assistive screen readers announce price changes during user pauses without aggressively interrupting whatever the user is currently reading",
                    "Because assertive live regions are deprecated in modern HTML standards",
                    "To prevent high CPU usage on mobile devices",
                    "Because assertive live regions change the text font to bold comic sans"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "aria-live='polite' informs screen readers to queue and announce the financial metric updates during conversational pauses, avoiding the disruptive chatter that aria-live='assertive' creates during rapid mouse scrubbing."
            }
        }
    ],
    "summary": [
        "Micro-overlays are strictly partitioned into tooltips (plain-text, non-interactive, hover/focus), popovers (interactive, click), and context menus.",
        "The Safe Triangle algorithm resolves the hover gap dilemma using vector cross-products, suppressing premature dismissal along the cursor's path.",
        "Virtual Anchors implement getBoundingClientRect() contracts for non-DOM entities such as text selections, mouse coordinates, and canvas charts.",
        "Floating UI arrows use trigonometric offset compensation and border-radius clamping to align with anchor centers without bleeding over corners.",
        "Institutional financial charts combine canvas spatial indexing, virtual anchoring, auto-flip detection, and aria-live='polite' for zero-overhead tooltips."
    ],
    "projectStep": {
        "title": "Architect Sovereign Micro-Overlay & Virtual Anchor Suite",
        "steps": [
            "Enforce strict semantic contracts separating plain-text tooltips from interactive popovers",
            "Implement Safe Triangle hover bridge algorithm using 2D vector cross-product geometry",
            "Construct Virtual Anchor factory supporting cursor tracking, text ranges, and canvas nodes",
            "Build trigonometric floating arrow engine with corner-radius safety clamping",
            "Integrate complete financial candlestick chart tooltip system with auto-flip and aria-live"
        ]
    }
}

if __name__ == '__main__':
    all_ok = True
    for i, p in enumerate(DAY_38['parts']):
        words = count_words(p['say'])
        print(f"Day 38 Part {i+1} ('{p['title'][:35]}...'): {words} words")
        if words < 600:
            all_ok = False
    assert all_ok, "Some Day 38 parts are < 600 words!"
    print("ALL DAY 38 PARTS SATISFY >= 600 WORDS INVARIANT!")
