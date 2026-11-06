# scripts/design_day36_data.py
import re

def count_words(say_list):
    total = 0
    for p in say_list:
        total += len(re.findall(r'\b[A-Za-z0-9_\-\.\$\/\:\@\']+\b', p))
    return total

DAY_36 = {
    "day": 36,
    "title": "Accessible Modal Dialogs: Overlay Backdrop, Focus Trapping & aria-modal=\"true\"",
    "goal": "Master accessible modal dialog architecture: engineer portal-mounted overlays with mathematical focus trapping, body scroll locking, Esc key dismissal, and WAI-ARIA 1.2 modal contracts.",
    "minutes": 25,
    "recap": "In Block 7, we engineered headless primitives and compound components. Today we inaugurate Block 8 by building accessible modal dialogs, mastering the complex browser focus and scroll isolation techniques required for mission-critical enterprise workflows.",
    "parts": [
        {
            "title": "The Anatomy of a Modal Dialog & Why Naive Div Overlays Break Accessibility",
            "say": [
                "In enterprise web applications, few user interface components carry as much operational significance as the Modal Dialog. Whether confirming a ten-million-dollar wire transfer on an institutional treasury desk, displaying an emergency alert banner during an industrial network outage, or capturing multi-factor authentication credentials, modal dialogs interrupt the user's primary workflow to demand immediate, focused interaction. However, because a modal dialog appears visually simple—often consisting of a dimmed background overlay and a centered floating card—front-end developers frequently build them using naive `<div>` overlays styled with high CSS z-indexes. This amateur approach produces catastrophic accessibility and usability defects.",
                "To understand why naive modal implementations fail, we must examine how web browsers and assistive technologies interpret the Document Object Model (DOM). When a visual overlay appears on screen, a sighted user immediately understands that the rest of the application is temporarily inaccessible because the background is visibly darkened and blurred. However, to a blind or visually impaired user navigating via a screen reader, or an engineer navigating exclusively via a physical keyboard, that dimmed background remains fully active, fully focusable, and dangerously interactive.",
                "In a naive modal, pressing the Tab key allows keyboard focus to escape the floating dialog and traverse into the underlying background page. A user attempting to tab to the 'Confirm Transfer' button might inadvertently focus on a link in the global navigation header or trigger a delete button in an underlying data table, completely unaware that their keystrokes are affecting background elements. In high-stakes enterprise applications, this focus leakage can result in accidental data loss, unintended financial transactions, or security breaches.",
                "Furthermore, screen readers perceive the page linearly based on DOM hierarchy rather than visual z-index stacking. If a naive modal dialog is rendered deep inside a nested component tree—such as inside a table row cell or a sidebar item—screen reader users must listen to the entire background page before reaching the modal content, completely disorienting their mental model of the active application state.",
                "To understand the true architectural purpose of a modal dialog through an everyday physical analogy, consider an airlock security chamber in a maximum-security biomedical research laboratory. The facility contains two heavy, airtight steel doors: an exterior entrance door leading to the general administrative offices, and an interior cleanroom door leading to the hazardous pathogen containment bay. The two doors are mechanically and electronically interlocked: you cannot open the interior cleanroom door until the exterior door is completely sealed, and while you are standing inside the pressurized airlock chamber, you are physically isolated from both zones.",
                "You cannot accidentally reach through a window or toss equipment into the outer corridor while the decontamination cycle is active; the airlock establishes a strictly bounded, isolated physical containment zone. In software engineering, a true modal dialog must function as this airtight security chamber: it must isolate user attention and keyboard interactions, completely disabling the background environment until the modal is formally dismissed.",
                "A production-grade enterprise modal dialog is composed of five distinct anatomical layers: First, the Root Portal, which unmounts the dialog from its triggering component and mounts it directly into a top-level DOM container (such as `document.body`), escaping local CSS stacking contexts. Second, the Backdrop Overlay, a semi-transparent screen-covering surface that dims the background and captures outside click events. Third, the Focus Trap Boundary, an algorithmic loop that constrains the Tab and Shift+Tab keys exclusively within the dialog.",
                "Fourth, the Dialog Container, a semantic element bearing `role=\"dialog\"` or `role=\"alertdialog\"` with `aria-modal=\"true\"`, which announces its presence to assistive technologies. And fifth, the Restoration Anchor, an internal reference that remembers which DOM element originally held focus before the modal opened, programmatically returning focus to that exact element when the dialog closes. Mastering these five anatomical layers is mandatory for building resilient, compliant enterprise web applications."
            ],
            "example": "A maximum-security laboratory airlock chamber that locks both outer and inner doors during decontamination, completely isolating the occupant from the outside facility until the safety cycle completes.",
            "code": """interface ModalAnatomyContract {
  portalTarget: string;
  hasBackdrop: boolean;
  isFocusTrapped: boolean;
  ariaModal: boolean;
  returnFocusOnClose: boolean;
  activeRole: 'dialog' | 'alertdialog';
}

class EnterpriseModalInspector {
  public static audit(config: ModalAnatomyContract): { score: number; issues: string[]; status: string } {
    const issues: string[] = [];
    let score = 100;

    if (config.portalTarget !== 'document.body' && config.portalTarget !== '#modal-root') {
      issues.push('CRITICAL: Modal rendered inside local DOM tree rather than top-level portal; risks CSS overflow clipping and stacking context traps.');
      score -= 25;
    }
    if (!config.hasBackdrop) {
      issues.push('WARNING: Missing dimmed backdrop overlay; sighted users may fail to perceive modal workflow isolation.');
      score -= 15;
    }
    if (!config.isFocusTrapped) {
      issues.push('CRITICAL ACCESSIBILITY OUTAGE: Focus trap missing! Keyboard focus can leak into background application while modal is active.');
      score -= 30;
    }
    if (!config.ariaModal) {
      issues.push('ACCESSIBILITY DEFECT: aria-modal="true" missing; screen readers will continue announcing background DOM elements.');
      score -= 15;
    }
    if (!config.returnFocusOnClose) {
      issues.push('ERGONOMICS FLAW: Focus restoration missing; closing modal will dump user focus to document body rather than trigger button.');
      score -= 15;
    }

    return {
      score,
      issues,
      status: score === 100 ? 'CERTIFIED SOVEREIGN MODAL' : 'REJECTED - ACCESSIBILITY VIOLATIONS'
    };
  }
}

// Case 1: Naive Monolithic Div Overlay (Amateur Implementation)
const naiveConfig: ModalAnatomyContract = {
  portalTarget: 'div.table-row-cell',
  hasBackdrop: true,
  isFocusTrapped: false,
  ariaModal: false,
  returnFocusOnClose: false,
  activeRole: 'dialog'
};

console.log('=== AUDIT 1: NAIVE MONOLITHIC DIV OVERLAY ===');
const naiveResult = EnterpriseModalInspector.audit(naiveConfig);
console.log('Status:', naiveResult.status, `(Score: ${naiveResult.score}/100)`);
naiveResult.issues.forEach(iss => console.log(' •', iss));

// Case 2: Sovereign Enterprise Modal (WAI-ARIA 1.2 Compliant)
const sovereignConfig: ModalAnatomyContract = {
  portalTarget: '#modal-root',
  hasBackdrop: true,
  isFocusTrapped: true,
  ariaModal: true,
  returnFocusOnClose: true,
  activeRole: 'dialog'
};

console.log('\\n=== AUDIT 2: SOVEREIGN ENTERPRISE MODAL ===');
const sovereignResult = EnterpriseModalInspector.audit(sovereignConfig);
console.log('Status:', sovereignResult.status, `(Score: ${sovereignResult.score}/100)`);
console.log('Violations Detected:', sovereignResult.issues.length);""",
            "output": """=== AUDIT 1: NAIVE MONOLITHIC DIV OVERLAY ===
Status: REJECTED - ACCESSIBILITY VIOLATIONS (Score: 15/100)
 • CRITICAL: Modal rendered inside local DOM tree rather than top-level portal; risks CSS overflow clipping and stacking context traps.
 • CRITICAL ACCESSIBILITY OUTAGE: Focus trap missing! Keyboard focus can leak into background application while modal is active.
 • ACCESSIBILITY DEFECT: aria-modal="true" missing; screen readers will continue announcing background DOM elements.
 • ERGONOMICS FLAW: Focus restoration missing; closing modal will dump user focus to document body rather than trigger button.

=== AUDIT 2: SOVEREIGN ENTERPRISE MODAL ===
Status: CERTIFIED SOVEREIGN MODAL (Score: 100/100)
Violations Detected: 0""",
            "codeNotes": [
                {"line": 1, "note": "ModalAnatomyContract defines mandatory architectural criteria for enterprise modal compliance."},
                {"line": 10, "note": "EnterpriseModalInspector evaluates focus trapping, portal mounting, and ARIA modal contracts."},
                {"line": 40, "note": "Audits naive versus sovereign implementations, proving that visual overlays fail without focus isolation."}
            ],
            "tryIt": "Set activeRole to 'alertdialog' and explain why destructive confirmation modals must use alertdialog instead of standard dialog.",
            "check": {
                "question": "What is the most severe accessibility violation that occurs when a modal dialog is built without a focus trap?",
                "options": [
                    "Keyboard focus leaks into the background page, allowing users to inadvertently trigger background actions or become lost outside the dialog",
                    "The browser immediately crashes due to an unhandled memory stack overflow",
                    "CSS animations run at 30 frames per second rather than 60 frames per second",
                    "The user's network connection is throttled to 3G speeds"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Without a focus trap, pressing Tab allows keyboard focus to escape the modal into the underlying page, leading to disoriented navigation and accidental triggering of background buttons."
            }
        },
        {
            "title": "Focus Trapping Algorithms: Roving Focus, Sentinel Nodes & Keyboard Loops",
            "say": [
                "Achieving airtight focus containment inside a modal dialog requires a deep understanding of browser focus algorithms and keyboard event cycles. When a modal opens, the application must guarantee three distinct focus invariants: First, Initial Focus Placement: focus must immediately shift from the triggering element into the modal dialog, typically targeting the first focusable interactive element (or the dialog container itself if no interactive elements exist).",
                "Second, Focus Containment Loop: as the user presses the Tab key to navigate forward through the modal's interactive controls (input fields, checkboxes, buttons), when focus reaches the final focusable element, pressing Tab must cycle focus smoothly back to the very first focusable element. Conversely, when the user presses Shift+Tab to navigate backward, if focus is on the first focusable element, it must cycle back to the final element in the modal.",
                "Third, Initial Focus Restoration: when the modal closes (via an explicit 'Cancel' button, an Esc key press, or an outside backdrop click), DOM focus must be programmatically returned to the exact element that originally triggered the modal. If focus is not restored, the browser defaults focus to `document.body`, forcing keyboard users to re-tab through the entire page from the very beginning.",
                "To understand focus trapping through an everyday physical analogy, consider a closed-circuit conveyor belt in a robotic sorting warehouse. Packages are placed onto the belt and travel in a continuous, uninterrupted loop through scanning sensors, weighing scales, and sorting arms. When a package reaches the end of the conveyor line, a curved mechanical roller guides it smoothly back onto the front of the track, ensuring that no package ever falls off the edge of the belt onto the warehouse floor.",
                "If a package were to fall off the conveyor, the entire sorting facility would halt to prevent equipment damage. In software, our focus trap acts as these curved mechanical guide rails: it ensures that the user's keyboard focus travels continuously in a closed loop, preventing the active focus pointer from falling off the modal edge into the vast background DOM.",
                "In software engineering, there are two primary architectural strategies for implementing a focus trap: the Event Listener Trap and the Sentinel Node Trap. In the Event Listener strategy, the component attaches a `keydown` listener to the modal container. When a `Tab` key is intercepted, the code queries all focusable elements inside the dialog using a standard DOM selector (`button, [href], input, select, textarea, [tabindex]:not([tabindex=\"-1\"])`). The listener inspects `document.activeElement`; if the user is on the last element and presses Tab, the listener prevents the default browser behavior via `e.preventDefault()` and calls `.focus()` on the first element.",
                "While the event listener trap works well, advanced design systems—including Radix UI and Google Material—pair it with Sentinel Nodes (also known as Focus Guards). A sentinel node is an invisible, zero-pixel DOM element placed immediately before and after the modal dialog with `tabIndex={0}`. If browser focus somehow escapes the modal container (for example, due to a rapid window blur/refocus or an asynchronous iframe event), focus lands on the sentinel node.",
                "The sentinel node contains an `onFocus` handler that instantly redirects focus back into the opposite end of the modal dialog. Sentinel nodes provide an unbreakable safety net that catches focus escapes that pure keydown listeners might miss. Furthermore, focus trapping engines must handle dynamically updating content: if a user clicks 'Add Beneficiary' inside a modal, dynamically adding three new input fields, the focus trap must re-evaluate its list of focusable elements in real time without dropping focus.",
                "Mastering these mathematical focus containment loops and sentinel node algorithms guarantees that enterprise web applications remain one hundred percent accessible and compliant with global disability access mandates."
            ],
            "example": "A closed-circuit airport luggage carousel where baggage circulates continuously in an unbroken loop, guided by curved mechanical bumpers so no suitcase ever falls off the conveyor.",
            "code": """interface FocusableNode {
  id: string;
  tag: string;
  tabIndex: number;
  disabled?: boolean;
}

class FocusTrapLoopEngine {
  private containerId: string;
  private focusableElements: FocusableNode[];
  private activeIndex: number = 0;
  private previouslyFocusedElementId: string | null = null;

  constructor(containerId: string, elements: FocusableNode[], triggerElementId: string) {
    this.containerId = containerId;
    this.focusableElements = elements.filter(el => !el.disabled && el.tabIndex >= 0);
    this.previouslyFocusedElementId = triggerElementId;

    // Invariant: Initial focus placed on first interactive element
    if (this.focusableElements.length > 0) {
      this.activeIndex = 0;
    }
  }

  public handleKeyDown(key: 'Tab', shiftKey: boolean): { activeId: string; didWrap: boolean } {
    const total = this.focusableElements.length;
    if (total === 0) return { activeId: this.containerId, didWrap: false };

    let didWrap = false;
    if (shiftKey) {
      // Shift + Tab: Backward Traversal
      if (this.activeIndex === 0) {
        this.activeIndex = total - 1; // Wrap to end
        didWrap = true;
      } else {
        this.activeIndex--;
      }
    } else {
      // Tab: Forward Traversal
      if (this.activeIndex === total - 1) {
        this.activeIndex = 0; // Wrap to start
        didWrap = true;
      } else {
        this.activeIndex++;
      }
    }

    return {
      activeId: this.focusableElements[this.activeIndex].id,
      didWrap
    };
  }

  public getActiveNode(): FocusableNode {
    return this.focusableElements[this.activeIndex];
  }

  public closeAndRestoreFocus(): string {
    const returnTarget = this.previouslyFocusedElementId || 'document.body';
    return `Modal closed. Focus programmatically restored to: #${returnTarget}`;
  }
}

// Modal Form Elements
const modalElements: FocusableNode[] = [
  { id: 'input-account', tag: 'INPUT', tabIndex: 0 },
  { id: 'input-routing', tag: 'INPUT', tabIndex: 0 },
  { id: 'btn-cancel', tag: 'BUTTON', tabIndex: 0 },
  { id: 'btn-confirm', tag: 'BUTTON', tabIndex: 0 },
  { id: 'btn-locked', tag: 'BUTTON', tabIndex: -1, disabled: true } // Excluded from loop
];

// Open modal triggered from #btn-open-transfer
const trap = new FocusTrapLoopEngine('modal-dialog', modalElements, 'btn-open-transfer');

console.log('=== INITIAL FOCUS TRAP STATE ===');
console.log('Initial Active Focus:', trap.getActiveNode().id);

console.log('\\n--- Forward Traversal (Tab Key Presses) ---');
console.log('Tab 1 ->', trap.handleKeyDown('Tab', false).activeId);
console.log('Tab 2 ->', trap.handleKeyDown('Tab', false).activeId);
console.log('Tab 3 ->', trap.handleKeyDown('Tab', false).activeId);

console.log('\\n--- Focus Wrap Invariant Test ---');
const wrapRes = trap.handleKeyDown('Tab', false);
console.log('Tab on last item wrapped to:', wrapRes.activeId, '| Did Wrap:', wrapRes.didWrap);

console.log('\\n--- Backward Traversal Wrap Test (Shift + Tab) ---');
const backWrapRes = trap.handleKeyDown('Tab', true);
console.log('Shift+Tab on first item wrapped to:', backWrapRes.activeId, '| Did Wrap:', backWrapRes.didWrap);

console.log('\\n=== FOCUS RESTORATION UPON DISMISSAL ===');
console.log(trap.closeAndRestoreFocus());""",
            "output": """=== INITIAL FOCUS TRAP STATE ===
Initial Active Focus: input-account

--- Forward Traversal (Tab Key Presses) ---
Tab 1 -> input-routing
Tab 2 -> btn-cancel
Tab 3 -> btn-confirm

--- Focus Wrap Invariant Test ---
Tab on last item wrapped to: input-account | Did Wrap: true

--- Backward Traversal Wrap Test (Shift + Tab) ---
Shift+Tab on first item wrapped to: btn-confirm | Did Wrap: true

=== FOCUS RESTORATION UPON DISMISSAL ===
Modal closed. Focus programmatically restored to: #btn-open-transfer""",
            "codeNotes": [
                {"line": 13, "note": "Filters out disabled elements and negative tabIndexes to build the active focusable sequence."},
                {"line": 23, "note": "Implements bidirectional modulo focus wrapping for Tab and Shift+Tab keystrokes."},
                {"line": 52, "note": "closeAndRestoreFocus() returns focus to the original triggering button upon dialog dismissal."}
            ],
            "tryIt": "Add a dynamic addFocusableElement() method that updates the active loop when an extra input is inserted.",
            "check": {
                "question": "What is the primary role of 'Sentinel Nodes' (Focus Guards) in enterprise modal focus trap libraries?",
                "options": [
                    "To catch and redirect focus if it accidentally escapes the modal container due to rapid window blur, browser chrome shifts, or iframe events",
                    "To generate unique encryption keys for password input fields",
                    "To prevent users from opening browser developer tools using keyboard shortcuts",
                    "To animate the modal backdrop using hardware-accelerated CSS keyframes"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Sentinel nodes are invisible focusable anchor elements placed immediately before and after the modal container that catch any focus leaks escaping standard keydown listeners and redirect focus back into the dialog."
            }
        },
        {
            "title": "Body Scroll Locking & Layout Shift Prevention Across Mobile and Desktop",
            "say": [
                "When a modal dialog opens on screen, users instinctively expect that interacting with the mouse wheel, trackpad, or touch gesture will scroll only the content inside the modal dialog. However, in standard web browser architectures, scroll events bubble upward through the DOM tree. If a user opens a modal dialog and scrolls downward using a mouse wheel, once the modal's internal scroll container reaches the bottom—or if the user scrolls over the darkened backdrop overlay—the browser automatically begins scrolling the underlying page content behind the modal. This annoying phenomenon is known as 'Scroll Chaining' or 'Background Scroll Leaking'.",
                "Scroll chaining is severely jarring for users. A doctor reviewing a medical record modal might scroll down to read laboratory results, only to find that when they close the modal, the background patient dashboard has scrolled three pages down, disorienting their clinical workflow. On mobile touchscreen devices (iOS Safari and Android Chrome), scroll chaining is even more catastrophic: attempting to swipe inside an open modal can rubber-band the background document, causing the browser address bar to collapse and creating disorienting visual stutter.",
                "To eliminate scroll chaining, front-end developers implement Body Scroll Locking. A naive developer attempts to lock body scrolling with a single line of CSS: `document.body.style.overflow = 'hidden'`. While this simple technique appears to work on desktop Chrome, it introduces a notorious visual defect known as the 'Scrollbar Layout Shift'.",
                "On desktop operating systems (especially Windows and Linux), standard desktop browsers allocate a physical vertical scrollbar on the right edge of the viewport, typically measuring fifteen to seventeen pixels in width. When `overflow: hidden` is applied to the body element, the browser removes the vertical scrollbar. Because the viewport suddenly gains seventeen pixels of horizontal space, every centered layout container, navigation header, and text paragraph abruptly jumps seventeen pixels to the right. When the modal closes, the scrollbar reappears, and the entire page violently jumps seventeen pixels back to the left. This jarring visual stutter creates noticeable Cumulative Layout Shift (CLS), degrading user experience and harming Google Core Web Vitals rankings.",
                "To understand the elegant solution through an everyday physical analogy, consider a commercial cargo ship docking in a maritime canal lock. When the ship enters the narrow concrete lock chamber, the massive steel floodgates close behind it, temporarily sealing off the flowing river current (locking body scroll). However, the lock operators do not simply pump all the water out of the canal, which would cause the ship to violently crash against the concrete walls.",
                "Instead, the canal operators install heavy rubber pneumatic fenders along the concrete walls that compress and expand to maintain constant physical spacing between the ship's hull and the dock wall. The water flow is halted, but the physical clearance remains stable down to the millimeter. In software engineering, our layout shift compensation acts as these pneumatic fenders.",
                "To prevent scrollbar layout shifts, an enterprise design system calculates the exact pixel width of the browser's vertical scrollbar before locking: `const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth`. When applying `overflow: hidden` to the body, the engine simultaneously applies `paddingRight = scrollbarWidth + 'px'` to the body and to any fixed-position navigation headers. The padding perfectly fills the void left by the disappearing scrollbar, locking background scrolling while keeping the visual layout stable.",
                "On mobile iOS Safari, the problem requires an even more sophisticated solution. iOS Safari notoriously ignores `overflow: hidden` on the body element when users swipe with their fingers. To lock scrolling on iOS, design systems must apply `position: fixed`, save the current `window.scrollY` offset, and apply `top: -scrollY + 'px'`. When the modal closes, the engine removes the fixed positioning and calls `window.scrollTo(0, savedScrollY)`, restoring the exact historical scroll position.",
                "Mastering mathematical scrollbar measurement and platform-specific scroll lock drivers guarantees that enterprise modal overlays deliver silky-smooth, zero-layout-shift performance across every operating system."
            ],
            "example": "A maritime canal lock chamber using pneumatic rubber fenders to keep a cargo ship perfectly stable against the dock walls while the floodgates seal off the river current.",
            "code": """interface ScrollLockState {
  isLocked: boolean;
  savedScrollY: number;
  scrollbarWidth: number;
  appliedBodyStyles: Record<string, string>;
}

class SovereignScrollLockDriver {
  private static state: ScrollLockState = {
    isLocked: false,
    savedScrollY: 0,
    scrollbarWidth: 0,
    appliedBodyStyles: {}
  };

  public static lock(isMobileIOS = false): ScrollLockState {
    if (this.state.isLocked) return this.state;

    // Simulate calculating scrollbar width: window.innerWidth - clientWidth
    const simulatedScrollbarWidth = isMobileIOS ? 0 : 17; // 17px standard desktop scrollbar
    const simulatedCurrentScrollY = 480; // User had scrolled 480px down page

    this.state.isLocked = true;
    this.state.savedScrollY = simulatedCurrentScrollY;
    this.state.scrollbarWidth = simulatedScrollbarWidth;

    if (isMobileIOS) {
      // iOS Safari Driver: Position fixed with negative top offset
      this.state.appliedBodyStyles = {
        position: 'fixed',
        top: `-${simulatedCurrentScrollY}px`,
        width: '100%',
        overflow: 'hidden'
      };
    } else {
      // Desktop Driver: Overflow hidden with layout-shift padding compensation
      this.state.appliedBodyStyles = {
        overflow: 'hidden',
        paddingRight: `${simulatedScrollbarWidth}px` // Fills 17px void perfectly!
      };
    }

    return this.state;
  }

  public static unlock(): { restoredScrollY: number; isLocked: boolean; clearedStyles: string[] } {
    if (!this.state.isLocked) {
      return { restoredScrollY: 0, isLocked: false, clearedStyles: [] };
    }

    const restoredScrollY = this.state.savedScrollY;
    const clearedStyles = Object.keys(this.state.appliedBodyStyles);

    this.state = {
      isLocked: false,
      savedScrollY: 0,
      scrollbarWidth: 0,
      appliedBodyStyles: {}
    };

    return {
      restoredScrollY,
      isLocked: false,
      clearedStyles
    };
  }
}

console.log('=== CASE 1: DESKTOP WINDOWS/CHROME SCROLL LOCK ===');
const desktopLock = SovereignScrollLockDriver.lock(false);
console.log('Is Locked:', desktopLock.isLocked);
console.log('Measured Scrollbar Width:', desktopLock.scrollbarWidth + 'px');
console.log('Applied Body Styles (Zero Layout Shift):', JSON.stringify(desktopLock.appliedBodyStyles, null, 2));

console.log('\\n--- Desktop Modal Dismissed ---');
const desktopUnlock = SovereignScrollLockDriver.unlock();
console.log('Is Locked:', desktopUnlock.isLocked);
console.log('Restored Scroll Position:', desktopUnlock.restoredScrollY + 'px');
console.log('Cleared Styles:', desktopUnlock.clearedStyles.join(', '));

console.log('\\n=== CASE 2: MOBILE IOS SAFARI SCROLL LOCK ===');
const mobileLock = SovereignScrollLockDriver.lock(true);
console.log('Is Locked:', mobileLock.isLocked);
console.log('iOS Fixed Position Top Offset:', mobileLock.appliedBodyStyles.top);
console.log('Applied iOS Styles:', JSON.stringify(mobileLock.appliedBodyStyles, null, 2));

console.log('\\n--- Mobile Modal Dismissed ---');
const mobileUnlock = SovereignScrollLockDriver.unlock();
console.log('Restored Scroll Position to Exact Y Offset:', mobileUnlock.restoredScrollY + 'px');""",
            "output": """=== CASE 1: DESKTOP WINDOWS/CHROME SCROLL LOCK ===
Is Locked: true
Measured Scrollbar Width: 17px
Applied Body Styles (Zero Layout Shift): {
  "overflow": "hidden",
  "paddingRight": "17px"
}

--- Desktop Modal Dismissed ---
Is Locked: false
Restored Scroll Position: 480px
Cleared Styles: overflow, paddingRight

=== CASE 2: MOBILE IOS SAFARI SCROLL LOCK ===
Is Locked: true
iOS Fixed Position Top Offset: -480px
Applied iOS Styles: {
  "position": "fixed",
  "top": "-480px",
  "width": "100%",
  "overflow": "hidden"
}

--- Mobile Modal Dismissed ---
Restored Scroll Position to Exact Y Offset: 480px""",
            "codeNotes": [
                {"line": 15, "note": "Calculates scrollbar width to prevent Cumulative Layout Shift (CLS) when overflow: hidden is applied."},
                {"line": 26, "note": "Implements platform-specific iOS Safari fixed positioning with negative top offset to block touch scrolling."},
                {"line": 40, "note": "unlock() cleans up inline styles and restores the user's historical scrollY coordinate flawlessly."}
            ],
            "tryIt": "Simulate two nested modals opening in sequence and verify that scroll lock uses a reference counter so the lock remains until the final modal closes.",
            "check": {
                "question": "Why must an enterprise modal system apply padding-right equal to the scrollbar width when locking body scroll on desktop browsers?",
                "options": [
                    "To fill the physical void left by the disappearing scrollbar, preventing the entire page layout from visibly jumping to the right",
                    "To ensure that background images are compressed into WebP format",
                    "To increase the clickable surface area of the modal close button",
                    "To force desktop monitors to switch from 60Hz to 120Hz refresh rates"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "When overflow: hidden is applied to document.body, the browser removes the 15-17px vertical scrollbar; without padding-right compensation, the page abruptly expands, causing jarring layout shifts that degrade Core Web Vitals."
            }
        },
        {
            "title": "WAI-ARIA 1.2 Modal Dialog Contracts: aria-modal, aria-labelledby & Escape Dismissal",
            "say": [
                "While visual presentation, focus trapping, and scroll locking address the graphical and interactive mechanics of a modal dialog, the component remains completely inaccessible to screen readers unless it rigorously implements the W3C Web Accessibility Initiative Accessible Rich Internet Applications (WAI-ARIA) 1.2 Dialog specification. Assistive technologies do not possess human eyes; they interpret web software exclusively through semantic roles, states, and properties exposed in the accessibility tree.",
                "The foundation of the WAI-ARIA dialog pattern begins with semantic role selection. The dialog container must declare either `role=\"dialog\"` or `role=\"alertdialog\"`. The standard `role=\"dialog\"` is used for general interactive workflows, such as editing user profile settings, composing an email, or browsing a multi-step checkout form. Conversely, `role=\"alertdialog\"` is reserved strictly for high-urgency, interruptive prompts that require immediate user acknowledgement—such as confirming the permanent deletion of a production database or alerting a trader that their margin maintenance threshold has been breached.",
                "When assistive screen readers encounter `role=\"alertdialog\"`, they immediately announce the content with high priority, often reading the entire dialog description aloud before waiting for user input. Using `alertdialog` for non-critical, everyday forms is an accessibility anti-pattern that creates auditory fatigue for visually impaired users.",
                "Next, the dialog container must declare the modern WAI-ARIA property `aria-modal=\"true\"`. In legacy web development, developers were forced to manually traverse the background DOM tree and set `aria-hidden=\"true\"` on every sibling element of the modal to prevent screen readers from reading background content. The `aria-modal=\"true\"` attribute communicates to modern assistive technologies that all content outside this container is completely inert and unreachable. Supporting screen readers automatically prune background elements from the virtual accessibility buffer.",
                "To understand WAI-ARIA dialog contracts through an everyday physical analogy, consider an official courtroom legal subpoena. An official subpoena is not an informal handwritten note taped to a door. It bears an official state seal (the semantic role), an explicit legal caption naming the recipient and case docket number (the `aria-labelledby` attribute), and an enumerated statement of statutory requirements (the `aria-describedby` attribute).",
                "When a court bailiff hands the subpoena to an attorney, the document's formal structure immediately commands legal authority. The attorney does not have to guess whether the document is an advertisement, an informal memo, or a binding court order; the standardized legal formatting establishes its authority unambiguously. WAI-ARIA attributes provide this exact standardized legal contract for assistive software.",
                "In code, every modal dialog must establish bidirectional labeling via `aria-labelledby` and `aria-describedby`. The dialog container must declare `aria-labelledby=\"modal-title-id\"`, pointing directly to the heading element (`<h2>` or `<h3>`) that announces the modal's primary title. If the modal contains secondary instructional text, the container should also declare `aria-describedby=\"modal-desc-id\"`. When a screen reader enters the dialog, it immediately vocalizes: 'Confirm Wire Transfer, Dialog. You are transferring ten thousand dollars to Apex Capital.'",
                "Furthermore, screen reader accessibility requires graceful handling of dynamically loaded modal content. If the modal body loads async customer records or financial calculations via a background API fetch, the container should declare `aria-busy=\"true\"` while fetching, flipping to `aria-busy=\"false\"` once the content resolves. This prevents screen readers from announcing incomplete, half-rendered DOM fragments to users who rely on synthesized speech. An unlabelled dialog or an asynchronous race condition causes assistive software to read 'Dialog, empty window', leaving visually impaired operators completely blind to system state.",
                "Finally, the WAI-ARIA specification mandates keyboard dismissal invariants: pressing the physical `Escape` key must immediately close the dialog and restore focus, unless the dialog is a non-dismissible critical transaction gate. By enforcing role differentiation, `aria-modal=\"true\"`, accessible labeling, busy state flags, and Escape key listeners, enterprise design systems guarantee that their interfaces are fully compliant with Section 508, the Americans with Disabilities Act (ADA), and the European Accessibility Act (EAA)."
            ],
            "example": "An official courtroom legal subpoena bearing a state seal, case docket number, and statutory instructions that establish binding legal authority unambiguously.",
            "code": """interface AriaModalSpec {
  role: 'dialog' | 'alertdialog';
  titleId: string;
  titleText: string;
  descId?: string;
  descText?: string;
  isDismissibleOnEsc: boolean;
}

class WaiAriaModalValidator {
  public static generateAriaContract(spec: AriaModalSpec): {
    containerAttrs: Record<string, any>;
    titleMarkup: string;
    descMarkup: string;
    dismissBehavior: string;
  } {
    const containerAttrs: Record<string, any> = {
      role: spec.role,
      'aria-modal': true,
      'aria-labelledby': spec.titleId
    };

    if (spec.descId && spec.descText) {
      containerAttrs['aria-describedby'] = spec.descId;
    }

    const titleMarkup = `<h2 id="${spec.titleId}" class="modal-title font-bold text-lg">${spec.titleText}</h2>`;
    const descMarkup = spec.descId && spec.descText
      ? `<p id="${spec.descId}" class="modal-desc text-sm text-slate-300">${spec.descText}</p>`
      : '';

    const dismissBehavior = spec.isDismissibleOnEsc
      ? 'Keyboard Event: Esc key closes modal and triggers focus restoration.'
      : 'Statutory Lock: Esc key disabled; explicit affirmative action required.';

    return {
      containerAttrs,
      titleMarkup,
      descMarkup,
      dismissBehavior
    };
  }
}

// Case 1: Standard Interactive Dialog (Account Settings)
console.log('=== CASE 1: STANDARD WAI-ARIA DIALOG (ROLE=DIALOG) ===');
const settingsModal = WaiAriaModalValidator.generateAriaContract({
  role: 'dialog',
  titleId: 'dialog-settings-title',
  titleText: 'Security & Two-Factor Authentication',
  descId: 'dialog-settings-desc',
  descText: 'Configure hardware security keys and biometric authentication preferences.',
  isDismissibleOnEsc: true
});
console.log('Container ARIA Attributes:', JSON.stringify(settingsModal.containerAttrs, null, 2));
console.log('Title Element:', settingsModal.titleMarkup);
console.log('Dismissal Contract:', settingsModal.dismissBehavior);

// Case 2: High-Urgency Destructive Alert Dialog (Database Purge)
console.log('\\n=== CASE 2: HIGH-URGENCY ALERT DIALOG (ROLE=ALERTDIALOG) ===');
const alertModal = WaiAriaModalValidator.generateAriaContract({
  role: 'alertdialog',
  titleId: 'alert-purge-title',
  titleText: 'Permanent Ledger Purge Confirmation',
  descId: 'alert-purge-desc',
  descText: 'Warning: This action will permanently erase all historical transaction logs. This operation cannot be reversed.',
  isDismissibleOnEsc: false // Statutory lock: Esc key disabled
});
console.log('Container ARIA Attributes:', JSON.stringify(alertModal.containerAttrs, null, 2));
console.log('Title Element:', alertModal.titleMarkup);
console.log('Dismissal Contract:', alertModal.dismissBehavior);""",
            "output": """=== CASE 1: STANDARD WAI-ARIA DIALOG (ROLE=DIALOG) ===
Container ARIA Attributes: {
  "role": "dialog",
  "aria-modal": true,
  "aria-labelledby": "dialog-settings-title",
  "aria-describedby": "dialog-settings-desc"
}
Title Element: <h2 id="dialog-settings-title" class="modal-title font-bold text-lg">Security & Two-Factor Authentication</h2>
Dismissal Contract: Keyboard Event: Esc key closes modal and triggers focus restoration.

=== CASE 2: HIGH-URGENCY ALERT DIALOG (ROLE=ALERTDIALOG) ===
Container ARIA Attributes: {
  "role": "alertdialog",
  "aria-modal": true,
  "aria-labelledby": "alert-purge-title",
  "aria-describedby": "alert-purge-desc"
}
Title Element: <h2 id="alert-purge-title" class="modal-title font-bold text-lg">Permanent Ledger Purge Confirmation</h2>
Dismissal Contract: Statutory Lock: Esc key disabled; explicit affirmative action required.""",
            "codeNotes": [
                {"line": 1, "note": "AriaModalSpec defines role selection between standard dialog and high-priority alertdialog."},
                {"line": 10, "note": "generateAriaContract binds aria-labelledby and aria-describedby to matching HTML element IDs."},
                {"line": 34, "note": "Demonstrates role=alertdialog with disabled Esc dismissal for irreversible destructive operations."}
            ],
            "tryIt": "Add an assertion validating that titleId and descId are non-empty strings and conform to HTML id naming conventions.",
            "check": {
                "question": "When should an enterprise design system use 'role=\"alertdialog\"' instead of 'role=\"dialog\"'?",
                "options": [
                    "For urgent, high-stakes prompts (such as irreversible data deletions or critical security halts) that require immediate user attention and vocalization",
                    "For simple informational tooltips that appear on mouse hover",
                    "Whenever the modal contains more than two images",
                    "To change the browser's background color to bright red automatically"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "The WAI-ARIA specification reserves role='alertdialog' for urgent, interruptive prompts that require immediate user acknowledgement; assistive technologies treat alertdialog with high priority, vocalizing its contents immediately."
            }
        },
        {
            "title": "Enterprise Application: High-Stakes Financial Transaction Confirmation Modal",
            "say": [
                "To synthesize our mastery of accessible modal dialogs, we now build a mission-critical enterprise system: a High-Stakes Financial Transaction Confirmation Modal. In institutional financial platforms—such as Bloomberg Terminal trade execution, central bank liquidity clearing, or high-frequency FX settlements—executing a financial transfer involves irreversible consequences. A trader submitting a fifty-million-euro foreign exchange swap cannot be allowed to make a typing error, accidentally trigger background forms, or suffer from assistive technology disorientation.",
                "In our enterprise confirmation modal, we assemble all four foundational layers we engineered today: First, the modal is mounted via a top-level Portal, completely bypassing local component z-indexes and stacking contexts. Second, the background viewport is locked using our layout-shift-free Body Scroll Lock Driver, preserving the exact scroll position while adding padding compensation to prevent visual stutter.",
                "Third, our Focus Trap Loop Engine activates immediately upon mount: it caches the ID of the triggering 'Authorize Trade' button, programmatically shifts initial focus to the modal's 'Cancel' button (a defensive design best practice that prevents accidental rapid Enter key submissions), and traps the Tab and Shift+Tab keys in an unbreakable loop.",
                "Fourth, the dialog declares `role=\"alertdialog\"`, `aria-modal=\"true\"`, and links bidirectional headings and description IDs to satisfy WAI-ARIA 1.2. The modal incorporates a dual-action safety mechanism: a countdown safety lock that disables the primary 'Confirm & Settle' button for three seconds, forcing the user to review the financial settlement parameters (Counterparty, Currency Pair, Notional Amount, and Estimated Slippage) before the confirmation button becomes interactive.",
                "Let us examine how this component performs under assistive technologies: When the modal mounts, the screen reader detects `role=\"alertdialog\"` and immediately announces: 'Emergency Financial Settlement Authorization, Alert Dialog. You are executing an irreversible wire transfer of 50,000,000 EUR to Barclays Capital.' When the trader presses the Tab key, focus cycles between the Cancel button and the Confirm button. The trader cannot tab into the background trading grid; their attention is strictly bounded.",
                "When the trader clicks 'Cancel' or presses the Escape key, the modal cleanly unmounts: the body scroll lock releases, the backdrop fades out, and focus is programmatically returned to the original 'Authorize Trade' button on the main trading desk interface.",
                "In addition to visual and assistive accessibility, enterprise high-stakes modals enforce complete telemetry and state auditability. Every interaction event—modal trigger timestamp, initial focus landing confirmation, safety countdown expiration, tab navigation traversal counts, and the final dispatch decision (approved or aborted)—is serialized into a cryptographically signed client-side audit record before transmission. If a dispute arises regarding whether a trader intentionally authorized a high-value transfer or clicked accidentally due to an interface glitch, the audit log provides conclusive evidence of compliant user verification.",
                "Furthermore, our implementation accounts for extreme edge cases: what happens if the user attempts to close the browser tab or press browser navigation back while the modal is open? By coordinating with window beforeunload event listeners, blocking accidental navigation triggers, and maintaining an explicit modal stack state machine, the system prevents partial or orphaned transaction states. The dialog container maintains an impenetrable physical barrier until the user makes an explicit, conscious choice.",
                "Notice also how the dual-action safety latch fundamentally alters the psychological ergonomics of critical operations. By preventing instant muscle-memory clicking and forcing a brief three-second pause while displaying the high-contrast financial parameters in bold monospace font, cognitive ergonomics directly eliminate user error at the interaction threshold.",
                "Let us model this high-stakes confirmation modal in executable TypeScript. We will implement the complete state machine—portal mounting, scroll locking, focus trapping, countdown safety latching, defensive cancel focus, and focus restoration—and execute a complete transactional lifecycle.",
                "This high-stakes modal architecture represents the gold standard of enterprise UI design systems: delivering unbreakable accessibility, zero layout shifts, and bulletproof operational safety across the world's most demanding digital applications."
            ],
            "example": "A dual-key nuclear submarine missile launch console that requires two independent operators to turn keys simultaneously while alarms sound and background systems are locked out.",
            "code": """interface FinancialTradePayload {
  tradeId: string;
  counterparty: string;
  currencyPair: string;
  notionalAmount: number;
}

class SovereignConfirmationModal {
  private payload: FinancialTradePayload;
  private isOpen: boolean = false;
  private isSafetyLatchReleased: boolean = false;
  private triggerElementId: string;
  private focusIndex: number = 0; // 0 = Cancel, 1 = Confirm
  private focusableButtons = ['btn-cancel', 'btn-confirm-settle'];

  constructor(payload: FinancialTradePayload, triggerBtnId: string) {
    this.payload = payload;
    this.triggerElementId = triggerBtnId;
  }

  public openModal(): { portalMounted: boolean; scrollLocked: boolean; initialFocus: string } {
    this.isOpen = true;
    this.isSafetyLatchReleased = false; // Latch initially active
    this.focusIndex = 0; // Defensive UX: Focus lands on CANCEL first!

    return {
      portalMounted: true,
      scrollLocked: true,
      initialFocus: this.focusableButtons[this.focusIndex]
    };
  }

  public releaseSafetyLatch(): void {
    this.isSafetyLatchReleased = true;
  }

  public handleTabKey(shift = false): string {
    if (!this.isOpen) return 'Modal inactive';
    if (shift) {
      this.focusIndex = (this.focusIndex - 1 + this.focusableButtons.length) % this.focusableButtons.length;
    } else {
      this.focusIndex = (this.focusIndex + 1) % this.focusableButtons.length;
    }
    return this.focusableButtons[this.focusIndex];
  }

  public renderDOM(): string {
    if (!this.isOpen) return '<!-- Portal Unmounted -->';

    const p = this.payload;
    const formattedAmount = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }).format(p.notionalAmount);

    return [
      `<div id="modal-portal" class="fixed inset-0 z-50 flex items-center justify-center">`,
      `  <div class="backdrop bg-black/80 fixed inset-0" aria-hidden="true"></div>`,
      `  <div role="alertdialog" aria-modal="true" aria-labelledby="modal-trade-title" aria-describedby="modal-trade-desc"`,
      `       class="modal-card relative z-10 bg-slate-900 border-2 border-amber-500 rounded-xl p-6 max-w-lg shadow-2xl">`,
      `    <h2 id="modal-trade-title" class="text-xl font-bold text-amber-400">⚠️ Authorize High-Value Settlement</h2>`,
      `    <div id="modal-trade-desc" class="trade-summary my-4 p-4 bg-slate-950 rounded border border-slate-800 text-sm">`,
      `      <p>Trade ID: <strong>${p.tradeId}</strong></p>`,
      `      <p>Counterparty: <strong>${p.counterparty}</strong></p>`,
      `      <p>Notional: <strong class="text-emerald-400 font-mono text-base">${formattedAmount} (${p.currencyPair})</strong></p>`,
      `      <p class="text-xs text-red-400 mt-2">Warning: Irreversible interbank settlement execution.</p>`,
      `    </div>`,
      `    <div class="modal-actions flex justify-end gap-3">`,
      `      <button id="btn-cancel" class="btn-cancel px-4 py-2 bg-slate-800 text-white rounded">Cancel Transaction</button>`,
      `      <button id="btn-confirm-settle" class="btn-confirm px-4 py-2 bg-amber-600 text-black font-bold rounded" ${this.isSafetyLatchReleased ? '' : 'disabled'}>`,
      `        ${this.isSafetyLatchReleased ? 'Confirm & Authorize' : 'Safety Latch (3s)...'}`,
      `      </button>`,
      `    </div>`,
      `  </div>`,
      `</div>`
    ].join('\\n');
  }

  public closeModal(): { scrollUnlocked: boolean; restoredFocusTarget: string } {
    this.isOpen = false;
    return {
      scrollUnlocked: true,
      restoredFocusTarget: `#${this.triggerElementId}`
    };
  }
}

// Instantiate High-Value Trade Modal
const tradeModal = new SovereignConfirmationModal(
  {
    tradeId: 'FX-984210',
    counterparty: 'Barclays Capital Investment Banking',
    currencyPair: 'EUR/USD',
    notionalAmount: 50000000
  },
  'btn-execute-swap'
);

console.log('=== STEP 1: MODAL OPEN LIFECYCLE ===');
const openStats = tradeModal.openModal();
console.log('Portal Mounted:', openStats.portalMounted);
console.log('Body Scroll Locked:', openStats.scrollLocked);
console.log('Defensive Initial Focus (Landed on Cancel):', openStats.initialFocus);

console.log('\\n=== STEP 2: RENDERED WAI-ARIA MODAL DOM (SAFETY LATCH ACTIVE) ===');
console.log(tradeModal.renderDOM());

console.log('\\n=== STEP 3: 3-SECOND TIMER RELEASES SAFETY LATCH ===');
tradeModal.releaseSafetyLatch();
console.log('User Tabs to Confirm Button:', tradeModal.handleTabKey(false));
console.log('Updated Action Buttons:\\n', tradeModal.renderDOM().split('\\n').slice(-7, -3).join('\\n'));

console.log('\\n=== STEP 4: MODAL DISMISSED & FOCUS RESTORED ===');
const closeStats = tradeModal.closeModal();
console.log('Body Scroll Unlocked:', closeStats.scrollUnlocked);
console.log('Focus Restored to Original Button:', closeStats.restoredFocusTarget);""",
            "output": """=== STEP 1: MODAL OPEN LIFECYCLE ===
Portal Mounted: true
Body Scroll Locked: true
Defensive Initial Focus (Landed on Cancel): btn-cancel

=== STEP 2: RENDERED WAI-ARIA MODAL DOM (SAFETY LATCH ACTIVE) ===
<div id="modal-portal" class="fixed inset-0 z-50 flex items-center justify-center">
  <div class="backdrop bg-black/80 fixed inset-0" aria-hidden="true"></div>
  <div role="alertdialog" aria-modal="true" aria-labelledby="modal-trade-title" aria-describedby="modal-trade-desc"
       class="modal-card relative z-10 bg-slate-900 border-2 border-amber-500 rounded-xl p-6 max-w-lg shadow-2xl">
    <h2 id="modal-trade-title" class="text-xl font-bold text-amber-400">⚠️ Authorize High-Value Settlement</h2>
    <div id="modal-trade-desc" class="trade-summary my-4 p-4 bg-slate-950 rounded border border-slate-800 text-sm">
      <p>Trade ID: <strong>FX-984210</strong></p>
      <p>Counterparty: <strong>Barclays Capital Investment Banking</strong></p>
      <p>Notional: <strong class="text-emerald-400 font-mono text-base">€50,000,000.00 (EUR/USD)</strong></p>
      <p class="text-xs text-red-400 mt-2">Warning: Irreversible interbank settlement execution.</p>
    </div>
    <div class="modal-actions flex justify-end gap-3">
      <button id="btn-cancel" class="btn-cancel px-4 py-2 bg-slate-800 text-white rounded">Cancel Transaction</button>
      <button id="btn-confirm-settle" class="btn-confirm px-4 py-2 bg-amber-600 text-black font-bold rounded" disabled>
        Safety Latch (3s)...
      </button>
    </div>
  </div>
</div>

=== STEP 3: 3-SECOND TIMER RELEASES SAFETY LATCH ===
User Tabs to Confirm Button: btn-confirm-settle
Updated Action Buttons:
       <button id="btn-cancel" class="btn-cancel px-4 py-2 bg-slate-800 text-white rounded">Cancel Transaction</button>
      <button id="btn-confirm-settle" class="btn-confirm px-4 py-2 bg-amber-600 text-black font-bold rounded" >
        Confirm & Authorize
      </button>

=== STEP 4: MODAL DISMISSED & FOCUS RESTORED ===
Body Scroll Unlocked: true
Focus Restored to Original Button: #btn-execute-swap""",
            "codeNotes": [
                {"line": 20, "note": "openModal() mounts portal, locks body scroll, and defensively directs initial focus to Cancel."},
                {"line": 40, "note": "Renders WAI-ARIA alertdialog with aria-labelledby, aria-describedby, and countdown latch."},
                {"line": 64, "note": "closeModal() releases scroll lock and seamlessly restores focus to the triggering swap button."}
            ],
            "tryIt": "Add a handleEscapeKey() method that cancels the modal and restores focus unless the trade is actively transmitting.",
            "check": {
                "question": "Why is it an enterprise defensive UX best practice to place initial focus on the 'Cancel' button rather than 'Confirm' in high-stakes financial modals?",
                "options": [
                    "To prevent users from accidentally executing irreversible transactions if they happen to press the Enter or Space key immediately upon modal mount",
                    "To force users to spend more time inside the application to increase engagement metrics",
                    "Because HTML cancel buttons render forty percent faster than confirm buttons",
                    "Because screen readers refuse to read buttons labeled 'Confirm'"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Defensive UX mandates focusing 'Cancel' by default in high-stakes confirmations so that an accidental double-tap of Enter or Space dismisses the modal safely rather than authorizing a high-value irreversible transaction."
            }
        }
    ],
    "summary": [
        "Accessible modal dialogs require 5 anatomical layers: root portals, backdrop overlays, focus traps, WAI-ARIA semantics, and focus restoration.",
        "Focus trapping algorithms intercept Tab and Shift+Tab keydown events to create a closed loop, supported by sentinel nodes against focus leakage.",
        "Body scroll locking prevents background scroll chaining, while padding compensation equal to scrollbar width eliminates Cumulative Layout Shift (CLS).",
        "WAI-ARIA 1.2 modal contracts differentiate between role='dialog' and high-urgency role='alertdialog' while enforcing aria-modal='true'.",
        "Enterprise confirmation modals implement defensive initial focus on 'Cancel' and safety countdown latches to prevent accidental irreversible actions."
    ],
    "projectStep": {
        "title": "Architect and Certify Sovereign Enterprise Modal Dialog",
        "steps": [
            "Construct portal mount and layout-shift-free body scroll lock driver",
            "Implement bidirectional focus trap loop with sentinel guard nodes",
            "Integrate WAI-ARIA 1.2 role='alertdialog' and aria-modal='true' contracts",
            "Author high-stakes financial trade confirmation modal with defensive Cancel focus",
            "Verify complete keyboard accessibility, Esc dismissal, and focus restoration"
        ]
    }
}

if __name__ == '__main__':
    for i, p in enumerate(DAY_36['parts']):
        words = count_words(p['say'])
        print(f"Day 36 Part {i+1} ('{p['title'][:35]}...'): {words} words")
        assert words >= 600, f"Part {i+1} word count {words} < 600!"
    print("ALL DAY 36 PARTS SATISFY >= 600 WORDS INVARIANT!")
