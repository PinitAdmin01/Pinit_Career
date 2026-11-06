# scripts/design_day32_data.py
import re

def count_words(say_list):
    total = 0
    for p in say_list:
        total += len(re.findall(r'\b[A-Za-z0-9_\-\.\$\/\:\@\']+\b', p))
    return total

DAY_32 = {
    "day": 32,
    "title": "Compound Components & Implicit State Sharing via React Context",
    "goal": "Master the compound component pattern: architect declarative, flexible component families (Tabs, Accordions, MenuBars) that share implicit state seamlessly via React Context without prop drilling.",
    "minutes": 25,
    "recap": "Yesterday we decoupled logic from presentation using headless primitives and render props. Today we advance to compound components, learning how complex widget hierarchies coordinate child state implicitly while offering declarative JSX ergonomics.",
    "parts": [
        {
            "title": "The Compound Component Pattern & Why Select/Option Anatomy Requires Implicit State",
            "say": [
                "In native HTML, some of the most expressive and intuitive user interface elements are built as collaborative component families. Consider the standard HTML `<select>` element: you never pass a massive array of option configuration objects into the select element as a single monolithic prop. Instead, you write `<select>` as a parent container and place individual `<option>` elements inside it as direct or indirect children. The parent select element and its child option elements collaborate invisibly behind the scenes to track selection state, synchronize value changes, and coordinate keyboard interactions.",
                "This declarative structure represents the essence of the Compound Component pattern. In modern component-driven libraries like React, compound components allow developers to author rich, multi-part UI widgets that communicate implicitly without requiring the developer to manually drill props down through every intermediate layer of the component hierarchy. Instead of forcing consumers to configure complex widgets through dozens of brittle configuration props, compound components provide an expressive, declarative vocabulary that feels as natural as writing semantic HTML.",
                "To appreciate the necessity of compound components, consider what happens when an engineering team attempts to build a complex UI widget using a monolithic configuration prop pattern. Imagine a multi-section accordion component: a naive design passes an array of objects like `items={[{ title: 'Overview', content: <p>...</p> }, { title: 'Billing', content: <p>...</p> }]}` into an `<Accordion>` component. While this appears simple at first glance, it quickly cripples consumer flexibility. What if a product team needs to inject a custom status badge into the third accordion header, or wrap the second accordion panel in a lazy-loaded analytics observer? In a monolithic design, the core team must continually invent new props like 'renderHeaderBadge', 'headerClassNames', and 'panelWrapperComponents'.",
                "This monolithic approach creates prop explosion and tightly couples the component's internal markup structure to the library's initial implementation. If the design system team decides to change the DOM structure from a `<div>` to a semantic `<section>`, or if a product engineer needs to place a marketing promotional banner between the second and third accordion items, the monolithic component completely fails because its internal loop assumes rigid, uniform children.",
                "To understand the compound component architecture through an everyday physical analogy, consider a modular home theater audio system. In a traditional all-in-one portable radio, the amplifier, tuner, volume knob, and speakers are permanently soldered inside a single plastic chassis; if you want to place the left speaker ten feet away or attach a subwoofer, you are completely out of luck. In a modular component audio system, you have a central receiver amplifier unit and multiple independent speaker units connected via standardized speaker cables.",
                "The receiver acts as the parent compound component, managing electrical power, audio decoding, and volume amplification state. The individual speakers act as child compound components: you can place two speakers on bookshelves, install a center speaker under the television, and mount rear surround speakers on the back wall. You can arrange and position the speakers anywhere in the living room according to your architectural layout, but they all share the central receiver's audio signal implicitly through the unified wiring. The receiver does not need to know the physical coordinates of each speaker; it simply broadcasts the audio channel state.",
                "In software engineering, compound components achieve this exact modular freedom. The parent container—such as an `<Accordion>` or `<Tabs>` component—acts as the central receiver, initializing and managing the active state machine (which tab is currently open, which accordion item is expanded, and which element currently holds focus). It provides this state to its child components—such as `<Accordion.Item>`, `<Accordion.Header>`, and `<Accordion.Panel>`—via a shared communication bus.",
                "By embracing compound components, enterprise design systems empower feature developers with maximum layout freedom while preserving strict behavioral guarantees. Developers can rearrange headers, inject decorative icons, nest sub-components, and introduce intermediate layout wrappers without ever breaking the underlying state synchronization or accessibility contracts."
            ],
            "example": "A modular home theater receiver that powers separate bookshelf speakers, subwoofers, and center channels through unified wiring, allowing custom living room arrangements while sharing audio signals implicitly.",
            "code": """interface CompoundChildProps {
  id: string;
  isOpen: boolean;
  onToggle: (id: string) => void;
  title: string;
  children: string;
}

class NaiveMonolithicAccordion {
  private items: { id: string; title: string; content: string }[];
  private openId: string | null = null;

  constructor(items: { id: string; title: string; content: string }[]) {
    this.items = items;
  }

  public toggle(id: string): void {
    this.openId = this.openId === id ? null : id;
  }

  public render(): string {
    return this.items.map(item => {
      const isOpen = this.openId === item.id;
      return `[${isOpen ? 'v' : '>'}] ${item.title}\\n${isOpen ? `    ${item.content}\\n` : ''}`;
    }).join('');
  }
}

// Compound Architecture Simulator
class CompoundContextBus {
  private activeId: string | null = null;
  private listeners: (() => void)[] = [];

  public getActiveId(): string | null {
    return this.activeId;
  }

  public setActiveId(id: string): void {
    this.activeId = this.activeId === id ? null : id;
    this.listeners.forEach(fn => fn());
  }

  public subscribe(fn: () => void): () => void {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }
}

const bus = new CompoundContextBus();

function renderCompoundItem(bus: CompoundContextBus, id: string, title: string, content: string): string {
  const isOpen = bus.getActiveId() === id;
  const icon = isOpen ? '[-] (Expanded)' : '[+] (Collapsed)';
  return `${icon} ${title}${isOpen ? `\\n      Body: ${content}` : ''}`;
}

console.log('--- Initial Collapsed State ---');
console.log(renderCompoundItem(bus, 'sec-1', 'Corporate Governance', 'Board charter and bylaws'));
console.log(renderCompoundItem(bus, 'sec-2', 'Financial Audit', 'Quarterly forensic ledger'));

console.log('\\n--- User clicks Section 1 ---');
bus.setActiveId('sec-1');
console.log(renderCompoundItem(bus, 'sec-1', 'Corporate Governance', 'Board charter and bylaws'));
console.log(renderCompoundItem(bus, 'sec-2', 'Financial Audit', 'Quarterly forensic ledger'));

console.log('\\n--- User clicks Section 2 (Single-open constraint) ---');
bus.setActiveId('sec-2');
console.log(renderCompoundItem(bus, 'sec-1', 'Corporate Governance', 'Board charter and bylaws'));
console.log(renderCompoundItem(bus, 'sec-2', 'Financial Audit', 'Quarterly forensic ledger'));""",
            "output": """--- Initial Collapsed State ---
[+] (Collapsed) Corporate Governance
[+] (Collapsed) Financial Audit

--- User clicks Section 1 ---
[-] (Expanded) Corporate Governance
      Body: Board charter and bylaws
[+] (Collapsed) Financial Audit

--- User clicks Section 2 (Single-open constraint) ---
[+] (Collapsed) Corporate Governance
[-] (Expanded) Financial Audit
      Body: Quarterly forensic ledger""",
            "codeNotes": [
                {"line": 28, "note": "CompoundContextBus simulates a shared React Context hub that coordinates child state without prop drilling."},
                {"line": 48, "note": "Child render function queries the shared bus to evaluate active expansion state and icon indicators."},
                {"line": 64, "note": "Demonstrates automatic single-open accordion mutual exclusion coordinated via implicit state sharing."}
            ],
            "tryIt": "Modify the context bus to support multi-expand mode where multiple sections can remain open simultaneously using a Set<string>.",
            "check": {
                "question": "Why is the compound component pattern preferred over monolithic prop configurations for complex multi-part widgets?",
                "options": [
                    "It allows consuming developers to declaratively customize layout, styling, and intermediate wrappers without breaking internal state sharing",
                    "It converts client-side JavaScript into WebAssembly to achieve sub-millisecond execution",
                    "It eliminates the need for HTML and CSS by rendering directly to native desktop canvas contexts",
                    "It prevents child components from ever re-rendering when their parent component updates"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Compound components decouple the visual structure and placement of child sub-components from internal state logic, giving consumers total layout flexibility while managing state implicitly via context."
            }
        },
        {
            "title": "React.createContext & Provider/Consumer Wiring for Compound Widget Families",
            "say": [
                "Under the hood, modern compound components in React are powered by the React Context API (`React.createContext`). Context provides a way to pass data through the component tree without having to manually pass props down through intermediate container components at every level. While context is often associated with global application state—such as user authentication, localized language settings, or active color themes—its true architectural superpower lies in scoping local state to discrete component families.",
                "When architecting a compound component family, the design system team defines a strictly scoped, private context. For example, a `TabsContext` holds the currently active tab value, the orientation of the tablist (horizontal or vertical), a unique prefix identifier for generating accessible HTML IDs, and a callback function for changing the active tab: `setActiveTab(value: string)`. The parent `<Tabs>` component instantiates this state and wraps its children in `<TabsContext.Provider value={contextValue}>`.",
                "Child components—such as `<Tabs.List>`, `<Tabs.Trigger>`, and `<Tabs.Content>`—consume this context using a custom hook, typically named `useTabsContext()`. This custom hook serves as an architectural guardrail: if a developer accidentally renders a `<Tabs.Trigger>` outside of a parent `<Tabs>` provider, the custom hook immediately throws a descriptive, actionable error: `'useTabsContext must be used within a <Tabs> component'`. This fail-fast mechanism prevents subtle runtime bugs and assists junior engineers during component assembly.",
                "To understand Context provider and consumer wiring through an everyday physical analogy, consider an office building intercom system. The main reception desk houses the central intercom base station (the Provider). When the receptionist speaks into the microphone or toggles a zone broadcast, the electrical signal travels through the building's internal wiring conduit. In every conference room and executive suite, there is an intercom speaker station mounted on the wall (the Consumers).",
                "The occupants of Conference Room B do not need to run their own private copper wire down three flights of stairs to the reception desk; they simply turn on their wall-mounted speaker unit, which is already tapped into the building's shared audio bus. If someone tries to install an intercom speaker in their car five miles away from the office building, the device will immediately indicate a disconnected line (the custom hook error), because it is outside the physical perimeter of the building's wiring conduit.",
                "In enterprise TypeScript codebases, type-safe context design requires meticulous attention to detail. Developers often make the mistake of creating a context with an initial default value of `undefined`. If consumers access this context directly without validation, TypeScript forces them to perform annoying null checks (`context?.activeTab`) throughout their component code. By encapsulating context consumption within a custom hook that asserts non-nullity, the returned context object is guaranteed to be fully typed, clean, and safe.",
                "Furthermore, performance optimization is critical when wiring compound context providers. If the parent component creates a new context object literal on every render (`value={{ activeTab, setActiveTab }}`), every child consumer in the subtree will re-render unnecessarily on every tick. Front-end architects must wrap the context value in `React.useMemo()` and memoize action callbacks using `React.useCallback()`. This guarantees that child components only re-render when the specific state values they depend upon actually transition.",
                "In addition to memoization, enterprise compound component architectures frequently implement context splitting to isolate high-frequency updates from static configuration values. For example, in a complex data grid or multi-step wizard, the active row selection changes continuously as the user interacts with the UI, while structural properties like column definitions, theme tokens, and orientation remain completely static. By splitting the architecture into a static `TabsConfigContext` and a dynamic `TabsStateContext`, child components that only need to read column labels or orientation never re-render when the active tab index shifts.",
                "Mastering `React.createContext` provider and consumer wiring elevates front-end engineers from basic template assemblers to sophisticated systems architects, capable of building reusable, high-performance compound widget families that scale across massive enterprise codebases."
            ],
            "example": "An office building intercom base station broadcasting audio through wall-mounted wiring conduits to speaker stations installed in every conference room.",
            "code": """interface TabsContextValue {
  activeTab: string;
  setActiveTab: (val: string) => void;
  orientation: 'horizontal' | 'vertical';
  baseId: string;
}

class TabsProviderScope {
  private value: TabsContextValue;
  private listeners: ((val: TabsContextValue) => void)[] = [];

  constructor(initialTab: string, orientation: 'horizontal' | 'vertical' = 'horizontal', baseId = 'tabs-widget') {
    this.value = {
      activeTab: initialTab,
      orientation,
      baseId,
      setActiveTab: (val: string) => this.updateTab(val)
    };
  }

  private updateTab(val: string): void {
    if (this.value.activeTab !== val) {
      this.value = { ...this.value, activeTab: val };
      this.notify();
    }
  }

  private notify(): void {
    this.listeners.forEach(fn => fn(this.value));
  }

  public subscribe(fn: (val: TabsContextValue) => void): () => void {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }

  public getContext(): TabsContextValue {
    return this.value;
  }
}

// Child Hook Guard Simulator
function useTabsContext(scope: TabsProviderScope | null): TabsContextValue {
  if (!scope) {
    throw new Error('useTabsContext must be used within a <Tabs> component!');
  }
  return scope.getContext();
}

// Instantiate Tab Provider with default 'dashboard' active
const tabsScope = new TabsProviderScope('dashboard', 'horizontal', 'prod-tabs');

// Child Tab Trigger Simulation
function renderTabTrigger(scope: TabsProviderScope, tabValue: string, label: string): string {
  const ctx = useTabsContext(scope);
  const isSelected = ctx.activeTab === tabValue;
  const triggerId = `${ctx.baseId}-trigger-${tabValue}`;
  const panelId = `${ctx.baseId}-panel-${tabValue}`;

  return `<button id="${triggerId}" role="tab" aria-selected="${isSelected}" aria-controls="${panelId}">` +
         `${label}${isSelected ? ' (ACTIVE)' : ''}</button>`;
}

// Child Tab Panel Simulation
function renderTabPanel(scope: TabsProviderScope, tabValue: string, content: string): string {
  const ctx = useTabsContext(scope);
  const isSelected = ctx.activeTab === tabValue;
  const triggerId = `${ctx.baseId}-trigger-${tabValue}`;
  const panelId = `${ctx.baseId}-panel-${tabValue}`;

  if (!isSelected) return `<!-- Panel ${tabValue} Hidden -->`;
  return `<div id="${panelId}" role="tabpanel" aria-labelledby="${triggerId}">${content}</div>`;
}

console.log('--- Initial Render (Dashboard Selected) ---');
console.log(renderTabTrigger(tabsScope, 'dashboard', 'Overview'));
console.log(renderTabTrigger(tabsScope, 'analytics', 'Metrics'));
console.log(renderTabPanel(tabsScope, 'dashboard', 'Welcome to Executive Overview'));
console.log(renderTabPanel(tabsScope, 'analytics', 'System Performance Metrics'));

console.log('\\n--- User clicks Metrics Tab ---');
tabsScope.getContext().setActiveTab('analytics');
console.log(renderTabTrigger(tabsScope, 'dashboard', 'Overview'));
console.log(renderTabTrigger(tabsScope, 'analytics', 'Metrics'));
console.log(renderTabPanel(tabsScope, 'dashboard', 'Welcome to Executive Overview'));
console.log(renderTabPanel(tabsScope, 'analytics', 'System Performance Metrics'));""",
            "output": """--- Initial Render (Dashboard Selected) ---
<button id="prod-tabs-trigger-dashboard" role="tab" aria-selected="true" aria-controls="prod-tabs-panel-dashboard">Overview (ACTIVE)</button>
<button id="prod-tabs-trigger-analytics" role="tab" aria-selected="false" aria-controls="prod-tabs-panel-analytics">Metrics</button>
<div id="prod-tabs-panel-dashboard" role="tabpanel" aria-labelledby="prod-tabs-trigger-dashboard">Welcome to Executive Overview</div>
<!-- Panel analytics Hidden -->

--- User clicks Metrics Tab ---
<button id="prod-tabs-trigger-dashboard" role="tab" aria-selected="false" aria-controls="prod-tabs-panel-dashboard">Overview</button>
<button id="prod-tabs-trigger-analytics" role="tab" aria-selected="true" aria-controls="prod-tabs-panel-analytics">Metrics (ACTIVE)</button>
<!-- Panel dashboard Hidden -->
<div id="prod-tabs-panel-analytics" role="tabpanel" aria-labelledby="prod-tabs-trigger-analytics">System Performance Metrics</div>""",
            "codeNotes": [
                {"line": 8, "note": "TabsProviderScope models React Context provider tracking active tab state and notifying listeners."},
                {"line": 40, "note": "useTabsContext custom hook guard enforces that child components are rendered strictly inside a parent provider."},
                {"line": 50, "note": "Child trigger and panel components automatically generate paired, accessible ARIA attributes linked via baseId."}
            ],
            "tryIt": "Verify the custom hook error guard by calling useTabsContext(null) inside a try/catch block and logging the caught error message.",
            "check": {
                "question": "What is the primary function of throwing an error in a custom hook like 'useTabsContext()' when context is null?",
                "options": [
                    "To provide an immediate, fail-fast error message informing developers that child components must be rendered inside their parent compound provider",
                    "To crash the user's browser operating system so they reboot their computer",
                    "To send an alert to Google Analytics reporting that the user navigated away from the page",
                    "To automatically download and install missing npm dependencies at runtime"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Throwing an error when context is missing provides immediate developer guidance during local development, preventing silent undefined errors when compound children are placed outside their parent container."
            }
        },
        {
            "title": "Building a Compound Accordion: Expandable Panels with Single-Open Constraint",
            "say": [
                "Accordions are essential layout components in modern enterprise web applications. They allow interfaces to present large volumes of categorized documentation, configuration options, or financial ledger details in a compact vertical space without overwhelming users with visual clutter. Users can click on individual section headers to expand relevant content while keeping non-essential information neatly tucked away.",
                "While building an accordion might seem straightforward, enterprise applications impose stringent requirements that quickly expose the limitations of amateur implementations. The most prominent requirement is the Single-Open (or Mutually Exclusive) constraint. In high-density financial or administrative dashboards, users must be allowed to focus on one operational workflow at a time; expanding a new section should automatically collapse whichever section was previously open, preventing page vertical sprawl.",
                "Achieving this behavior cleanly while allowing complete layout flexibility requires a robust compound component architecture. We structure our accordion into four distinct collaborative components: the parent `<Accordion>` root container, individual `<Accordion.Item>` boundary elements, `<Accordion.Header>` interactive trigger buttons, and `<Accordion.Panel>` collapsible content containers.",
                "The parent `<Accordion>` root component maintains the active selection state machine. It accepts configuration props such as 'type=\"single\"' (mutually exclusive) or 'type=\"multiple\"' (allowing concurrent expansions), as well as a 'collapsible={true}' boolean that determines whether clicking an already-expanded item collapses it back to an empty state. The root component shares this state machine with all child elements via our scoped React Context.",
                "To understand mutually exclusive state management through an everyday physical analogy, consider a mechanical push-button radio tuner in a vintage automobile. On the car's dashboard, there are five physical preset buttons for selecting radio stations (Jazz, Classical, News, Pop, Rock). Because the radio only has a single speaker amplifier and tuner mechanism, you cannot listen to the Jazz station and the News station simultaneously.",
                "When you press down on the News preset button, an internal mechanical rocker bar slides across the back of the switch assembly, physically releasing the spring-loaded latch on the previously pressed Jazz button, which instantly pops back out. You never have to manually pull the old button out before pushing the new one in; the shared mechanical linkage guarantees mutual exclusivity automatically. The Accordion root component acts as this internal rocker bar.",
                "From an accessibility perspective, the W3C WAI-ARIA Accordion pattern mandates strict semantic contracts. Every accordion header button must be an HTML `<button>` element nested inside a semantic heading tag (`<h2>`, `<h3>`, etc.). The button must declare 'aria-expanded=\"true|false\"' and 'aria-controls=\"panel-id\"'. In turn, the collapsible panel must declare 'role=\"region\"' and 'aria-labelledby=\"header-button-id\"'.",
                "Furthermore, keyboard navigation must be effortless: users should be able to navigate between accordion headers using the Tab key, and in advanced implementations, using the Up and Down arrow keys. When an accordion item is collapsed, the panel content must be completely removed from the accessibility tree and keyboard focus order (using `hidden` or `display: none`) so that screen readers and keyboard users do not inadvertently focus on invisible interactive elements.",
                "Another critical engineering challenge in production accordion design is managing smooth height animations without incurring layout recalculation jank. When expanding an accordion panel whose height is unknown prior to rendering, amateur developers often attempt to animate CSS `max-height` from zero to an arbitrary large value like 1000px. This causes awkward timing delays because the animation duration is calculated across the full 1000px range rather than the element's natural content height.",
                "To resolve this animation friction, modern design systems measure the scrollHeight of the panel DOM node using a `useLayoutEffect` hook or CSS grid transition techniques (`grid-template-rows: 0fr` to `1fr`). When the compound state machine triggers an expansion, the component dynamically interpolates the exact pixel height, providing a silky-smooth 60 frames-per-second transition while preserving complete layout stability across responsive screen resizing.",
                "By encapsulating these mechanical state linkages and accessibility invariants into compound accordion sub-components, enterprise design systems deliver bulletproof, ergonomic tools that empower engineers to craft rich, accessible content layouts with minimal boilerplate."
            ],
            "example": "A mechanical push-button car radio where pressing a new preset button automatically trips the mechanical rocker bar, popping the previously selected station button back up.",
            "code": """interface AccordionItemState {
  id: string;
  isExpanded: boolean;
}

class CompoundAccordionEngine {
  private mode: 'single' | 'multiple';
  private expandedIds: Set<string>;

  constructor(mode: 'single' | 'multiple' = 'single', initialOpen?: string) {
    this.mode = mode;
    this.expandedIds = new Set(initialOpen ? [initialOpen] : []);
  }

  public toggleItem(id: string): void {
    if (this.mode === 'single') {
      if (this.expandedIds.has(id)) {
        this.expandedIds.clear(); // Collapsible single mode
      } else {
        this.expandedIds.clear();
        this.expandedIds.add(id); // Mutually exclusive switch
      }
    } else {
      if (this.expandedIds.has(id)) {
        this.expandedIds.delete(id);
      } else {
        this.expandedIds.add(id);
      }
    }
  }

  public isExpanded(id: string): boolean {
    return this.expandedIds.has(id);
  }

  public getItemAria(id: string) {
    const expanded = this.isExpanded(id);
    return {
      headerBtn: {
        id: `accordion-header-${id}`,
        'aria-expanded': expanded,
        'aria-controls': `accordion-panel-${id}`
      },
      panel: {
        id: `accordion-panel-${id}`,
        role: 'region',
        'aria-labelledby': `accordion-header-${id}`,
        hidden: !expanded
      }
    };
  }

  public getExpandedList(): string[] {
    return Array.from(this.expandedIds);
  }
}

// Instantiate Single-Open Accordion with 'sec-1' open initially
const accordion = new CompoundAccordionEngine('single', 'sec-1');

console.log('--- Step 1: Initial State ---');
console.log('Currently Expanded:', accordion.getExpandedList());
console.log('Section 1 ARIA:', accordion.getItemAria('sec-1').headerBtn);
console.log('Section 2 Panel Hidden:', accordion.getItemAria('sec-2').panel.hidden);

console.log('\\n--- Step 2: Toggle Section 2 (Triggers Single-Open Latch) ---');
accordion.toggleItem('sec-2');
console.log('Currently Expanded:', accordion.getExpandedList());
console.log('Section 1 Panel Hidden:', accordion.getItemAria('sec-1').panel.hidden);
console.log('Section 2 Panel Hidden:', accordion.getItemAria('sec-2').panel.hidden);
console.log('Section 2 Button Expanded:', accordion.getItemAria('sec-2').headerBtn['aria-expanded']);

console.log('\\n--- Step 3: Toggle Section 2 again (Collapses to Empty) ---');
accordion.toggleItem('sec-2');
console.log('Currently Expanded:', accordion.getExpandedList());""",
            "output": """--- Step 1: Initial State ---
Currently Expanded: [ 'sec-1' ]
Section 1 ARIA: {
  id: 'accordion-header-sec-1',
  'aria-expanded': true,
  'aria-controls': 'accordion-panel-sec-1'
}
Section 2 Panel Hidden: true

--- Step 2: Toggle Section 2 (Triggers Single-Open Latch) ---
Currently Expanded: [ 'sec-2' ]
Section 1 Panel Hidden: true
Section 2 Panel Hidden: false
Section 2 Button Expanded: true

--- Step 3: Toggle Section 2 again (Collapses to Empty) ---
Currently Expanded: []""",
            "codeNotes": [
                {"line": 6, "note": "CompoundAccordionEngine models single and multiple expansion modes with Set-based state tracking."},
                {"line": 13, "note": "Implements mutually exclusive latch mechanics: opening a new section automatically clears previously active IDs."},
                {"line": 31, "note": "Generates linked WAI-ARIA accordion contracts ensuring panel hidden: true when collapsed."}
            ],
            "tryIt": "Instantiate the engine with mode: 'multiple' and verify that opening Section 1 and Section 2 preserves both in the expanded set.",
            "check": {
                "question": "According to the W3C WAI-ARIA Accordion pattern, what attribute must be updated on the header button when its panel expands?",
                "options": [
                    "aria-expanded must transition from false to true to inform assistive technology of the open content region",
                    "aria-live must be set to assertive to freeze the screen reader voice",
                    "tabindex must be set to 9999 to force high priority focus",
                    "role must change from button to document"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "The WAI-ARIA accordion specification requires the trigger button to declare aria-expanded='true' when its associated panel is visible and aria-expanded='false' when it is collapsed."
            }
        },
        {
            "title": "Compound Tabs Component: ARIA Tablist Roles, Arrow Key Cycling & Panel Association",
            "say": [
                "Tabbed interfaces are ubiquitous across web applications, organizing dense settings dashboards, code editors, and product specifications into switchable panels. However, because tabs appear so visually simple, front-end developers frequently build them using standard `<div>` or `<a>` elements styled with blue bottom borders. When examined through an accessibility lens, these informal tabs are completely invisible to screen readers and impossible to operate with standard keyboard shortcuts.",
                "To build a truly accessible tabs component, design systems must implement the official WAI-ARIA Tabs pattern. This pattern mandates a strict tripartite semantic hierarchy: a container with `role=\"tablist\"` that wraps the clickable tab buttons; individual tab triggers each bearing `role=\"tab\"`; and the associated content panels declaring `role=\"tabpanel\"`.",
                "The relationship between the tab trigger and the content panel must be explicitly cemented through bidirectional HTML IDs. The tab button must declare `aria-controls=\"panel-id\"`, informing assistive technologies which panel it operates. In turn, the tab panel must declare `aria-labelledby=\"tab-id\"`, ensuring that when a screen reader enters the panel, it announces the tab's title as the panel's accessible label.",
                "Beyond semantic roles, the Tabs pattern defines a rigorous keyboard navigation standard that distinguishes it from other interactive controls. Unlike a list of standard links where pressing the Tab key moves focus from link to link, inside an accessible `role=\"tablist\"`, pressing the Tab key moves focus directly out of the active tab and into the active tabpanel content. Moving between the individual tabs is handled exclusively using the Left Arrow and Right Arrow keys (or Up and Down arrow keys in vertical tabs).",
                "To visualize this keyboard cycling behavior, consider a physical rotary channel selector knob on an old-school television set. When you turn the knob one notch to the right, it smoothly clicks into channel 4; turn it another notch right, and you are on channel 5. When you reach the highest channel on the dial (channel 13) and click one notch further right, the mechanical dial wraps continuously back around to channel 2. You do not need to pull the knob outward or press secondary buttons; the physical rotation cycles forward and wraps seamlessly.",
                "In software, our compound tabs component implements this exact continuous cycling behavior through roving tabindex. Only the currently active tab has `tabIndex=\"0\"`, allowing it to be reached via the Tab key from the preceding page content. All other inactive tabs in the tablist are assigned `tabIndex=\"-1\"`. When the user presses the Right Arrow key, the component calculates the next index in sequence; if the user is on the final tab, it wraps around to index zero. It then programmatically shifts DOM focus and updates `aria-selected=\"true\"`.",
                "Furthermore, tabs can operate in one of two selection activation modes: Automatic Activation or Manual Activation. In Automatic Activation, shifting arrow focus to a tab immediately selects it and displays its panel content. In Manual Activation, moving arrow focus only highlights the tab button; the user must press Space or Enter to finalize the selection. Manual activation is strongly recommended for heavy panels that load remote data or charts asynchronously, preventing accidental network waterfalls as users arrow through the list.",
                "In addition to activation modes, production tablists must handle scroll overflow gracefully on narrow mobile displays. When an application features seven or eight extensive tabs that exceed the horizontal viewport width, wrapping them onto multiple lines breaks the clean visual hierarchy. The compound `<Tabs.List>` sub-component solves this by incorporating responsive horizontal scroll containers with visual scroll indicators or chevron overflow navigation buttons, ensuring that keyboard focus automatically scrolls offscreen tabs smoothly into the visible viewport.",
                "By packaging this bidirectional ARIA wiring, roving tabindex focus loop, and arrow key cycling into compound `<Tabs>`, `<Tabs.List>`, `<Tabs.Trigger>`, and `<Tabs.Panel>` components, our design system guarantees that complex dashboard interfaces remain effortlessly navigable for every user on every device."
            ],
            "example": "A rotary channel selector knob on a television set that clicks smoothly between stations and wraps from the last channel back to the first in a continuous physical loop.",
            "code": """interface TabDescriptor {
  id: string;
  label: string;
}

class AccessibleCompoundTabs {
  private tabs: TabDescriptor[];
  private selectedIndex: number = 0;
  private isVertical: boolean;

  constructor(tabs: TabDescriptor[], isVertical = false) {
    this.tabs = tabs;
    this.isVertical = isVertical;
  }

  public handleKeyDown(key: string): void {
    const nextKey = this.isVertical ? 'ArrowDown' : 'ArrowRight';
    const prevKey = this.isVertical ? 'ArrowUp' : 'ArrowLeft';
    const count = this.tabs.length;

    if (key === nextKey) {
      this.selectedIndex = (this.selectedIndex + 1) % count; // Cycle forward & wrap
    } else if (key === prevKey) {
      this.selectedIndex = (this.selectedIndex - 1 + count) % count; // Cycle backward & wrap
    } else if (key === 'Home') {
      this.selectedIndex = 0;
    } else if (key === 'End') {
      this.selectedIndex = count - 1;
    }
  }

  public getTabProps(index: number) {
    const tab = this.tabs[index];
    const isSelected = index === this.selectedIndex;
    return {
      id: `tab-${tab.id}`,
      role: 'tab' as const,
      'aria-selected': isSelected,
      'aria-controls': `panel-${tab.id}`,
      tabIndex: isSelected ? 0 : -1 // Roving tabindex
    };
  }

  public getListProps() {
    return {
      role: 'tablist' as const,
      'aria-orientation': this.isVertical ? ('vertical' as const) : ('horizontal' as const)
    };
  }

  public getPanelProps(index: number) {
    const tab = this.tabs[index];
    const isSelected = index === this.selectedIndex;
    return {
      id: `panel-${tab.id}`,
      role: 'tabpanel' as const,
      'aria-labelledby': `tab-${tab.id}`,
      hidden: !isSelected,
      tabIndex: 0 // Panel itself is focusable for scrollable content
    };
  }

  public getSelectedIndex(): number {
    return this.selectedIndex;
  }
}

const tabs = new AccessibleCompoundTabs([
  { id: 'ledger', label: 'General Ledger' },
  { id: 'tax', label: 'Statutory Taxation' },
  { id: 'audit', label: 'Compliance Audit' }
]);

console.log('--- Initial State (Tab 0 Selected) ---');
console.log('Tab 0 Props:', tabs.getTabProps(0));
console.log('Tab 1 Props (Inactive Roving -1):', tabs.getTabProps(1));

console.log('\\n--- User presses ArrowRight ---');
tabs.handleKeyDown('ArrowRight');
console.log('Active Tab Index:', tabs.getSelectedIndex());
console.log('Tab 1 Props (Now Active 0):', tabs.getTabProps(1));

console.log('\\n--- User presses ArrowRight again ---');
tabs.handleKeyDown('ArrowRight');
console.log('Active Tab Index:', tabs.getSelectedIndex());

console.log('\\n--- User presses ArrowRight on final tab (Wrap-around test) ---');
tabs.handleKeyDown('ArrowRight');
console.log('Wrapped to Tab Index:', tabs.getSelectedIndex(), '(Should be 0)');
console.log('Panel 0 Hidden Status:', tabs.getPanelProps(0).hidden);""",
            "output": """--- Initial State (Tab 0 Selected) ---
Tab 0 Props: {
  id: 'tab-ledger',
  role: 'tab',
  'aria-selected': true,
  'aria-controls': 'panel-ledger',
  tabIndex: 0
}
Tab 1 Props (Inactive Roving -1): {
  id: 'tab-tax',
  role: 'tab',
  'aria-selected': false,
  'aria-controls': 'panel-tax',
  tabIndex: -1
}

--- User presses ArrowRight ---
Active Tab Index: 1
Tab 1 Props (Now Active 0): {
  id: 'tab-tax',
  role: 'tab',
  'aria-selected': true,
  'aria-controls': 'panel-tax',
  tabIndex: 0
}

--- User presses ArrowRight again ---
Active Tab Index: 2

--- User presses ArrowRight on final tab (Wrap-around test) ---
Wrapped to Tab Index: 0 (Should be 0)
Panel 0 Hidden Status: false""",
            "codeNotes": [
                {"line": 15, "note": "Implements WAI-ARIA tablist arrow key navigation with modulo-based wrap-around cycling."},
                {"line": 34, "note": "Roving tabindex contract: active tab is assigned tabIndex: 0 while inactive tabs receive tabIndex: -1."},
                {"line": 49, "note": "Tabpanel declares aria-labelledby pointing back to the trigger button id for bidirectional association."}
            ],
            "tryIt": "Add support for the 'PageUp' and 'PageDown' keys in vertical mode to jump active selection by 2 tabs at a time.",
            "check": {
                "question": "In a WAI-ARIA compliant tablist, what is the role of the 'roving tabindex' strategy?",
                "options": [
                    "It ensures only the active tab can be focused via the Tab key, while inactive tabs are navigated using the arrow keys",
                    "It causes the web page to automatically reload whenever a new tab is selected",
                    "It encrypts tab labels before rendering them to the screen",
                    "It hides the tab buttons completely on mobile touch devices"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Roving tabindex assigns tabIndex='0' to the selected tab and tabIndex='-1' to inactive tabs, ensuring that pressing the Tab key moves focus into the panel content rather than stepping through every individual tab button."
            }
        },
        {
            "title": "Enterprise Application: White-Label Compound Dashboard Widget System",
            "say": [
                "To synthesize our mastery of compound components, we now architect an enterprise-grade White-Label Dashboard Widget System. In global SaaS platforms—such as ERP suites, hospital management systems, or institutional treasury desks—enterprise customers demand highly customizable dashboard layouts. One corporate client wants their financial widgets organized with tabbed navigation at the top, a second client wants collapsible accordions to minimize vertical space on mobile tablets, and a third client requires multi-panel split views with detachable toolbars.",
                "Building three separate widget systems for these clients would be an operational disaster for the software vendor. Code duplication would skyrocket, bug fixes would fragment across branches, and introducing a new financial metric or real-time trading chart would require rewriting markup three times.",
                "With our compound component architecture, we resolve this enterprise challenge with absolute elegance. We build an unstyled, headless `DashboardWidget` compound root component. This root component encapsulates all core business state: active metric timeframes (1D, 1W, 1M, 1Y), data refresh polling intervals, export modal toggles, and user permission gates (e.g., whether the current user is authorized to export audit logs as CSV).",
                "The root component exposes a rich family of compound child components: `<Widget.Header>`, `<Widget.Title>`, `<Widget.TimeframeSelector>`, `<Widget.Body>`, `<Widget.ExportButton>`, and `<Widget.Footer>`. Crucially, these child components communicate implicitly through our shared React Context. They do not care how they are visually arranged or whether they are styled with corporate navy blue, hospital clinical teal, or high-contrast dark mode slate.",
                "Let us examine how different enterprise white-label partners compose this single compound widget family: Partner A (Wall Street Trading Desk) arranges `<Widget.Header>` with a compact inline `<Widget.TimeframeSelector>` and an ultra-dense `<Widget.Body>` streaming live order book ticks at 60 FPS, styled with dark slate colors and monospace numbers. Partner B (Clinical Healthcare Portal) wraps the exact same `<Widget.Body>` inside an accessible collapsible card with large high-contrast text and a prominent `<Widget.ExportButton>` formatted with medical HIPAA compliance badges.",
                "Notice the profound architectural victory: the underlying business logic—how timeframes are filtered, how data is fetched from the WebSocket stream, and how export permissions are validated—is written exactly once inside the compound root engine. The white-label partners and frontend feature teams enjoy total declarative freedom over JSX composition, layout structure, and visual styling without ever writing a single line of fragile state synchronization code.",
                "Moreover, this compound widget architecture provides built-in resilience against catastrophic runtime failures through localized Error Boundaries. If an unhandled JavaScript exception occurs inside a third-party charting plugin embedded within `<Widget.Body>`, the error is trapped cleanly within that specific widget container. Instead of crashing the entire enterprise dashboard and logging out the user, the compound root gracefully displays a localized fallback UI while adjacent metrics widgets continue streaming live operational data uninterrupted.",
                "Let us construct this white-label compound dashboard system in executable TypeScript. We will implement the compound context engine and render two radically different white-label layouts: an Institutional High-Frequency Trading Widget and an Executive Compliance Audit Widget, proving how implicit state sharing powers diverse enterprise applications seamlessly.",
                "From an organizational perspective, this compound white-label architecture shortens feature delivery timelines from months to days. Front-end engineers are no longer bogged down in endless meetings negotiating which buttons belong in which order; designers simply assemble the Lego-like compound pieces directly in their page templates, knowing that compliance, accessibility, and state contracts are guaranteed by the underlying engine. This architectural paradigm empowers distributed teams to ship high-quality products rapidly with zero risk of visual or functional regressions.",
                "Mastering compound component orchestration completes the transformation of a frontend developer into a true systems architect. It provides the foundational design pattern upon which the world's most sophisticated design systems—including Radix UI, Reach UI, and Headless UI—are engineered."
            ],
            "example": "A modular surgical monitor in a hospital operating room that accepts plug-in modules for heart rate, blood oxygen, and blood pressure, sharing power and alarms through a unified central console.",
            "code": """interface WidgetContextState {
  widgetId: string;
  timeframe: '1D' | '1W' | '1M' | '1Y';
  setTimeframe: (tf: '1D' | '1W' | '1M' | '1Y') => void;
  isExporting: boolean;
  canExport: boolean;
}

class DashboardWidgetContextScope {
  private state: WidgetContextState;

  constructor(widgetId: string, initialTf: '1D' | '1W' | '1M' | '1Y' = '1M', canExport = true) {
    this.state = {
      widgetId,
      timeframe: initialTf,
      setTimeframe: (tf) => { this.state.timeframe = tf; },
      isExporting: false,
      canExport
    };
  }

  public getState(): WidgetContextState {
    return this.state;
  }
}

// Compound Sub-Component Simulators
class WidgetComponents {
  public static Header(scope: DashboardWidgetContextScope, title: string, subtitle: string): string {
    const s = scope.getState();
    return `  <header class="widget-header">\\n    <h3>${title}</h3>\\n    <span class="widget-sub">ID: ${s.widgetId} | ${subtitle}</span>\\n  </header>`;
  }

  public static TimeframeSelector(scope: DashboardWidgetContextScope, options: ('1D' | '1W' | '1M' | '1Y')[]): string {
    const s = scope.getState();
    const buttons = options.map(opt => {
      const isSelected = opt === s.timeframe;
      return `<button class="${isSelected ? 'active-tf' : 'idle-tf'}">${opt}</button>`;
    }).join(' ');
    return `  <div class="timeframe-group" role="group" aria-label="Select Timeframe">\\n    ${buttons}\\n  </div>`;
  }

  public static Body(scope: DashboardWidgetContextScope, dataSummary: string): string {
    const s = scope.getState();
    return `  <section class="widget-content">\\n    <p>Active Window: [${s.timeframe}] | ${dataSummary}</p>\\n  </section>`;
  }

  public static ExportButton(scope: DashboardWidgetContextScope, label: string): string {
    const s = scope.getState();
    if (!s.canExport) return `  <!-- Export disabled by enterprise policy -->`;
    return `  <button class="btn-export" aria-label="Export ${s.timeframe} audit report">${label}</button>`;
  }
}

// Instantiate Compound Widget for Treasury Operations
const widgetScope = new DashboardWidgetContextScope('TR-904', '1D', true);

// Layout 1: Wall Street Institutional Trading Desk (Compact Monospace)
console.log('=== BRAND A: WALL STREET INSTITUTIONAL TRADING DESK ===');
const wallStreetLayout = [
  '<div class="widget-card bg-slate-900 text-slate-100 font-mono p-2">',
  WidgetComponents.Header(widgetScope, 'USD Liquidity Pool', 'Real-Time Clearing'),
  WidgetComponents.TimeframeSelector(widgetScope, ['1D', '1W', '1M']),
  WidgetComponents.Body(widgetScope, 'Total Volume: $4.2B | Slippage: 0.002%'),
  WidgetComponents.ExportButton(widgetScope, 'CSV Data Export'),
  '</div>'
].join('\\n');
console.log(wallStreetLayout);

// User toggles timeframe to 1M
widgetScope.getState().setTimeframe('1M');

// Layout 2: Clinical Healthcare Compliance Audit Portal (Spacious White Theme)
console.log('\\n=== BRAND B: HEALTHCARE COMPLIANCE AUDIT PORTAL ===');
const healthcareLayout = [
  '<div class="widget-card bg-white shadow-md border border-teal-200 p-6 rounded-lg font-sans">',
  WidgetComponents.Header(widgetScope, 'Patient Data Access Audit', 'HIPAA Log Stream'),
  WidgetComponents.Body(widgetScope, 'Access Events: 14,290 | Anomaly Score: Normal'),
  WidgetComponents.TimeframeSelector(widgetScope, ['1W', '1M', '1Y']),
  WidgetComponents.ExportButton(widgetScope, 'Download Signed Compliance PDF'),
  '</div>'
].join('\\n');
console.log(healthcareLayout);""",
            "output": """=== BRAND A: WALL STREET INSTITUTIONAL TRADING DESK ===
<div class="widget-card bg-slate-900 text-slate-100 font-mono p-2">
  <header class="widget-header">
    <h3>USD Liquidity Pool</h3>
    <span class="widget-sub">ID: TR-904 | Real-Time Clearing</span>
  </header>
  <div class="timeframe-group" role="group" aria-label="Select Timeframe">
    <button class="active-tf">1D</button> <button class="idle-tf">1W</button> <button class="idle-tf">1M</button>
  </div>
  <section class="widget-content">
    <p>Active Window: [1D] | Total Volume: $4.2B | Slippage: 0.002%</p>
  </section>
  <button class="btn-export" aria-label="Export 1D audit report">CSV Data Export</button>
</div>

=== BRAND B: HEALTHCARE COMPLIANCE AUDIT PORTAL ===
<div class="widget-card bg-white shadow-md border border-teal-200 p-6 rounded-lg font-sans">
  <header class="widget-header">
    <h3>Patient Data Access Audit</h3>
    <span class="widget-sub">ID: TR-904 | HIPAA Log Stream</span>
  </header>
  <section class="widget-content">
    <p>Active Window: [1M] | Access Events: 14,290 | Anomaly Score: Normal</p>
  </section>
  <div class="timeframe-group" role="group" aria-label="Select Timeframe">
    <button class="idle-tf">1W</button> <button class="active-tf">1M</button> <button class="idle-tf">1Y</button>
  </div>
  <button class="btn-export" aria-label="Export 1M audit report">Download Signed Compliance PDF</button>
</div>""",
            "codeNotes": [
                {"line": 9, "note": "DashboardWidgetContextScope coordinates shared widget state including active timeframe and export permissions."},
                {"line": 26, "note": "WidgetComponents exposes modular compound sub-components that query the shared context implicitly."},
                {"line": 56, "note": "Demonstrates two completely different white-label layouts composed from the identical compound component family."}
            ],
            "tryIt": "Set canExport: false in the scope constructor and verify that the ExportButton sub-component renders a hidden comment rather than an interactive button.",
            "check": {
                "question": "How does the compound dashboard widget architecture prevent code duplication across white-label product variants?",
                "options": [
                    "By encapsulating state management, data filtering, and permissions in a shared compound root engine while allowing consumer brands to compose sub-components freely",
                    "By generating separate JavaScript bundles for each customer during runtime",
                    "By compiling React components into static JPEG images before sending them to the browser",
                    "By requiring all white-label clients to use identical CSS color schemes"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Compound component families encapsulate complex state and business logic in a shared root context, enabling multiple white-label partners to declare custom layouts and visual styling without rewriting functional code."
            }
        }
    ],
    "summary": [
        "Compound components allow parent and child elements to share implicit state via React Context without prop drilling, mirroring native select/option semantics.",
        "Private context providers (React.createContext) paired with custom hook guards (useTabsContext) ensure type safety and fail-fast developer error messaging.",
        "Accessible compound accordions enforce single-open (mutually exclusive) or multi-open constraints while synchronizing WAI-ARIA expanded and controls attributes.",
        "WAI-ARIA tablists implement roving tabindex (active tab index: 0, inactive: -1) and arrow key cycling with wrap-around to optimize keyboard navigation.",
        "White-label compound widget architectures empower enterprise partners to rearrange headers, tools, and content panels freely while sharing unified core logic."
    ],
    "projectStep": {
        "title": "Build and Verify Compound Component Dashboard Suite",
        "steps": [
            "Construct scoped React Context provider and fail-fast consumer hook",
            "Implement compound Accordion with single-open mutually exclusive state latch",
            "Build accessible Tabs family with roving tabindex and Arrow key cycling",
            "Architect white-label dashboard widget system with customizable child sub-components",
            "Verify complete keyboard navigation and WCAG 2.2 accessibility compliance"
        ]
    }
}

if __name__ == '__main__':
    for i, p in enumerate(DAY_32['parts']):
        words = count_words(p['say'])
        print(f"Day 32 Part {i+1} ('{p['title'][:35]}...'): {words} words")
