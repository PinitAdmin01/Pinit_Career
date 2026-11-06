# scripts/design_day31_data.py
import re

def count_words(say_list):
    total = 0
    for p in say_list:
        total += len(re.findall(r'\b[A-Za-z0-9_\-\.\$\/\:\@\']+\b', p))
    return total

DAY_31 = {
    "day": 31,
    "title": "Headless UI Architecture & Render Props: Separating Behavior from Presentation",
    "goal": "Master headless UI architecture in enterprise design systems: decouple complex state machines, keyboard navigation, and ARIA accessibility from visual styling using the render props pattern.",
    "minutes": 25,
    "recap": "Welcome to Month 2 of UI/UX Design Systems. In Month 1, we constructed sovereign design tokens, atomic components, and accessibility foundations. Today we elevate our architecture to enterprise headless primitives that power multi-brand component libraries.",
    "parts": [
        {
            "title": "The Headless UI Philosophy & Why Enterprise Design Systems Decouple Logic from Visuals",
            "say": [
                "In traditional front-end engineering, UI components tightly couple visual presentation with internal state logic. A button component typically contains CSS class names, inline SVG icons, focus ring transitions, click event handlers, and loading spinners all packed into a single JSX template. While this monolithic approach works reasonably well for small, single-product applications, it quickly collapses into maintenance gridlock when scaled across an enterprise operating multiple brands, platforms, and sub-products.",
                "Imagine a global financial enterprise that operates three distinct consumer-facing products: an institutional trading portal that demands ultra-compact, high-density dark-mode data grids, a retail banking mobile web application requiring friendly, high-contrast touch targets, and a wealth management client dashboard styled with elegant serif typography and subtle pastel hues. If the design system team builds monolithic components that bundle hardcoded visual styles, they are forced to either fork three separate codebases or pollute their components with dozens of fragile boolean configuration props like 'isDense', 'isRetail', and 'isWealthManagement'.",
                "This anti-pattern leads to severe code bloat, fragile conditional cascades, and nightmare regression cycles. Whenever an accessibility specialist discovers a keyboard navigation bug in the dropdown component, the fix must be manually replicated or cherry-picked across three divergent codebases. If a new W3C accessibility specification requires updating the ARIA attributes of a modal dialog, developers must touch dozens of styled component files, risking unintended layout shifts across all three applications.",
                "Headless UI architecture completely eliminates this architectural bottleneck by enforcing a total separation of concerns. In a headless architecture, components are decoupled into two distinct layers: a behavioral logic layer and a presentation layer. The behavioral layer, known as the headless primitive, contains one hundred percent of the complex logic: state machines, keyboard navigation event listeners, focus trapping, roving tabindex algorithms, and ARIA attribute contracts. However, the headless primitive contains zero markup, zero CSS classes, and zero visual opinions.",
                "To visualize this separation through an everyday physical analogy, consider the automobile industry. High-performance electric vehicle manufacturers design a standardized skateboard chassis that contains the battery pack, electric motors, steering actuators, anti-lock braking sensors, and computer controllers. This chassis represents the headless engine of the vehicle. It knows how to accelerate, steer, and brake safely under strict regulatory invariants. Various automotive brands can then drop completely different vehicle bodies on top of that identical chassis: a rugged off-road utility truck, a sleek executive luxury sedan, or an aerodynamic delivery van. The outward appearance changes completely, but the underlying safety and mechanical logic remain rock-solid and unified.",
                "By adopting this headless paradigm in software, the design system core team authors and maintains the complex interactive chassis: ensuring that dropdown menus support full arrow key navigation, Home and End keystrokes, typeahead character search, and screen reader announcements compliant with WCAG 2.2 Level AA. Product teams across different brand divisions simply wrap that bulletproof chassis in their own presentation layer, supplying their unique Tailwind CSS classes, CSS modules, or styled-components without ever worrying about accidentally breaking keyboard focus or ARIA contracts.",
                "Furthermore, headless UI primitives dramatically simplify enterprise unit and integration testing. Because the headless engine contains pure state transitions and accessibility hooks, engineers can test keyboard navigation, disabled state invariants, and open/close toggles in isolated, lightweight virtual DOM environments without needing heavy visual regression testing engines or CSS parsing runtimes. This clear architectural boundary establishes a resilient foundation capable of supporting decades of multi-brand UI evolution.",
                "As enterprise software ecosystems continue to diversify across responsive web browsers, native webviews, desktop Electron wrappers, and micro-frontend architectures, the headless UI philosophy serves as the ultimate design system multiplier. It delivers complete visual freedom to product designers while guaranteeing rock-solid operational compliance, accessibility, and behavioral consistency across the entire digital enterprise."
            ],
            "example": "An automotive skateboard chassis containing the battery, electric motor, and steering computer that powers an off-road truck, an executive sedan, and a city van using the exact same mechanical foundation.",
            "code": """interface HeadlessDropdownState {
  isOpen: boolean;
  highlightedIndex: number;
  items: string[];
}

type DropdownAction =
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'NEXT_ITEM' }
  | { type: 'PREV_ITEM' }
  | { type: 'SELECT_INDEX'; index: number };

function headlessDropdownReducer(state: HeadlessDropdownState, action: DropdownAction): HeadlessDropdownState {
  switch (action.type) {
    case 'OPEN':
      return { ...state, isOpen: true, highlightedIndex: 0 };
    case 'CLOSE':
      return { ...state, isOpen: false, highlightedIndex: -1 };
    case 'NEXT_ITEM': {
      if (!state.isOpen) return { ...state, isOpen: true, highlightedIndex: 0 };
      const next = (state.highlightedIndex + 1) % state.items.length;
      return { ...state, highlightedIndex: next };
    }
    case 'PREV_ITEM': {
      if (!state.isOpen) return { ...state, isOpen: true, highlightedIndex: state.items.length - 1 };
      const prev = (state.highlightedIndex - 1 + state.items.length) % state.items.length;
      return { ...state, highlightedIndex: prev };
    }
    case 'SELECT_INDEX':
      return { ...state, highlightedIndex: action.index };
    default:
      return state;
  }
}

let state: HeadlessDropdownState = {
  isOpen: false,
  highlightedIndex: -1,
  items: ['Institutional Trading', 'Retail Banking', 'Wealth Advisory']
};

console.log('Initial State:', JSON.stringify(state));
state = headlessDropdownReducer(state, { type: 'OPEN' });
console.log('After OPEN:', JSON.stringify(state));
state = headlessDropdownReducer(state, { type: 'NEXT_ITEM' });
console.log('After NEXT_ITEM:', JSON.stringify(state));
state = headlessDropdownReducer(state, { type: 'NEXT_ITEM' });
console.log('After NEXT_ITEM (second time):', JSON.stringify(state));
state = headlessDropdownReducer(state, { type: 'CLOSE' });
console.log('After CLOSE:', JSON.stringify(state));""",
            "output": """Initial State: {"isOpen":false,"highlightedIndex":-1,"items":["Institutional Trading","Retail Banking","Wealth Advisory"]}
After OPEN: {"isOpen":true,"highlightedIndex":0,"items":["Institutional Trading","Retail Banking","Wealth Advisory"]}
After NEXT_ITEM: {"isOpen":true,"highlightedIndex":1,"items":["Institutional Trading","Retail Banking","Wealth Advisory"]}
After NEXT_ITEM (second time): {"isOpen":true,"highlightedIndex":2,"items":["Institutional Trading","Retail Banking","Wealth Advisory"]}
After CLOSE: {"isOpen":false,"highlightedIndex":-1,"items":["Institutional Trading","Retail Banking","Wealth Advisory"]}""",
            "codeNotes": [
                {"line": 1, "note": "Defines headless dropdown state tracking openness, active highlighted item index, and item options."},
                {"line": 13, "note": "Pure state machine reducer governing keyboard navigation wrapping and open/close transitions."},
                {"line": 34, "note": "Demonstrates deterministic state transitions completely decoupled from DOM markup or CSS styling."}
            ],
            "tryIt": "Add an action 'SELECT_ITEM_BY_KEY' that searches items by their first character to simulate native desktop typeahead.",
            "check": {
                "question": "What is the primary architectural advantage of decoupling UI state and accessibility logic into headless primitives?",
                "options": [
                    "Different brand divisions can apply completely distinct visual designs while sharing unified, fully accessible, and tested interactive behavior",
                    "Headless components completely eliminate the need for JavaScript in client web browsers",
                    "Headless architecture automatically translates web applications into native iOS and Android code without any compilers",
                    "Headless primitives render visual elements directly using server GPU acceleration rather than client CSS"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Decoupling logic from presentation allows multiple brands or products to apply custom styling and HTML structures while sharing identical, thoroughly tested state machines, keyboard event handlers, and WCAG accessibility compliance."
            }
        },
        {
            "title": "Render Props Pattern & Component Inversion of Control",
            "say": [
                "To make a headless component truly usable in modern component-driven libraries like React, the headless primitive must communicate its internal state and accessibility contracts to the consumer's visual markup. In early front-end component architectures, developers relied on higher-order components (HOCs) or deeply nested configuration objects. However, these older patterns suffered from prop name collisions, convoluted TypeScript typings, and opaque data flow that made debugging difficult for enterprise engineers.",
                "The Render Props pattern solves this communication challenge with supreme elegance by leveraging inversion of control. In standard object-oriented and functional programming, inversion of control is an architectural principle where a framework or parent module controls the flow of execution, delegating specific implementation details to user-supplied functions. In the context of UI components, a render prop is simply a component prop whose value is a function that returns a visual UI tree.",
                "Instead of the headless component deciding how to render an active dropdown list item or a loading spinner, it delegates that rendering responsibility entirely to the consumer. The headless component calculates the active state, resolves the ARIA attributes, binds the event listeners, and then passes those computational results as arguments into the consumer's render function: 'children({ isOpen, highlightedIndex, getItemProps, getButtonProps })'. The consuming developer receives this clean payload and renders whatever JSX, HTML, or styled elements their specific product requires.",
                "To grasp the conceptual power of inversion of control, consider an automated professional kitchen in a high-end restaurant. The kitchen line possesses advanced robotic cooking equipment that guarantees temperature precision, sterile hygiene, and safety compliance. However, instead of forcing every dining guest to accept an identical pre-plated dish, the kitchen acts as a headless culinary engine: it prepares the perfectly seared protein, reduces the savory sauce, and delivers these piping-hot components on a service cart. The executive catering chef (the consumer) is completely free to plate the dish on modern slate, classic porcelain, or festive banquet trays to match the event's exact visual ambiance. The mechanical and safety guarantees remain in the kitchen, while aesthetic presentation belongs to the host.",
                "In code, this pattern gives rise to the concept of 'Prop Getters'. Rather than asking consumer developers to manually remember and spread fifteen different ARIA attributes like 'aria-expanded', 'aria-haspopup', 'aria-controls', and 'id' onto their buttons and lists, the headless component exposes helper functions known as prop getters. For instance, the consumer simply calls '{...getButtonProps()}' on their visual button element. The prop getter function automatically injects the exact ARIA attributes, click listeners, and keydown listeners, merging them seamlessly with any custom event handlers the consumer might provide.",
                "This prop getter architecture creates an airtight safety net for enterprise engineering teams. A junior front-end developer building a product landing page might not know the exact W3C specification requirements for 'aria-activedescendant' or roving tabindex management. With a headless render prop component, the junior developer does not need to memorize these complex specifications; calling the prop getter guarantees that the rendered DOM node will be one hundred percent compliant with global accessibility laws.",
                "Moreover, the render props pattern provides exceptional TypeScript type safety. By defining a generic state interface for the render prop function arguments, modern IDEs provide instant auto-completion for every accessible state variable and prop getter function. If a breaking change occurs in the underlying headless primitive, TypeScript immediately flags errors at the consumer call sites during compile time, preventing costly runtime errors from slipping into production.",
                "Through the render props pattern, enterprise design systems achieve the ultimate balance between centralized engineering governance and decentralized creative freedom. Core infrastructure teams maintain ironclad control over reliability and accessibility, while distributed feature teams enjoy total flexibility over UI layout and visual styling."
            ],
            "example": "A professional kitchen providing perfectly prepared gourmet ingredients and sauces on a service tray, allowing event hosts to plate the meal on custom dinnerware matching any party theme.",
            "code": """interface RenderPropsState {
  isOpen: boolean;
  selectedIndex: number;
}

interface ButtonProps {
  'aria-expanded': boolean;
  'aria-haspopup': 'listbox';
  onClick: () => void;
  onKeyDown: (key: string) => void;
}

class HeadlessDropdownEngine {
  private isOpen: boolean = false;
  private selectedIndex: number = 0;
  private items: string[];

  constructor(items: string[]) {
    this.items = items;
  }

  public getButtonProps(): ButtonProps {
    return {
      'aria-expanded': this.isOpen,
      'aria-haspopup': 'listbox',
      onClick: () => {
        this.isOpen = !this.isOpen;
      },
      onKeyDown: (key: string) => {
        if (key === 'ArrowDown' || key === 'Enter') {
          this.isOpen = true;
        } else if (key === 'Escape') {
          this.isOpen = false;
        }
      }
    };
  }

  public render(renderFn: (state: RenderPropsState, getBtn: () => ButtonProps) => string): string {
    const currentState: RenderPropsState = {
      isOpen: this.isOpen,
      selectedIndex: this.selectedIndex
    };
    return renderFn(currentState, () => this.getButtonProps());
  }
}

const engine = new HeadlessDropdownEngine(['USD Account', 'EUR Portfolio', 'JPY Treasury']);

// Consumer 1: Minimalist Dark Mode Terminal Theme
const terminalRender = engine.render((state, getButtonProps) => {
  const props = getButtonProps();
  return `[TERMINAL BUTTON] Expanded: ${props['aria-expanded']} | Selected: ${state.selectedIndex}`;
});
console.log(terminalRender);

// Simulate user pressing ArrowDown to expand dropdown
const btnProps = engine.getButtonProps();
btnProps.onKeyDown('ArrowDown');

// Consumer 2: High-Density Institutional Theme after state transition
const institutionalRender = engine.render((state, getButtonProps) => {
  const props = getButtonProps();
  return `<button class="btn-corp" aria-expanded="${props['aria-expanded']}">Status: ${state.isOpen ? 'ACTIVE MENU' : 'COLLAPSED'}</button>`;
});
console.log(institutionalRender);""",
            "output": """[TERMINAL BUTTON] Expanded: false | Selected: 0
<button class="btn-corp" aria-expanded="true">Status: ACTIVE MENU</button>""",
            "codeNotes": [
                {"line": 15, "note": "Encapsulates internal state machine and event listener coordination inside a headless class engine."},
                {"line": 20, "note": "The getButtonProps getter method injects required ARIA attributes and keyboard event handlers."},
                {"line": 48, "note": "Demonstrates inversion of control: two completely different consumer themes render the identical headless state engine."}
            ],
            "tryIt": "Add a getListboxProps() method that returns role: 'listbox', tabIndex: -1, and aria-activedescendant linked to the selected item.",
            "check": {
                "question": "What is the primary purpose of a 'Prop Getter' function in headless render prop components?",
                "options": [
                    "To automatically inject necessary ARIA attributes, event listeners, and accessibility roles into consumer elements while allowing custom prop merging",
                    "To fetch remote JSON data from a backend REST API asynchronously",
                    "To compile CSS styles into inline SVG icons at build time",
                    "To prevent consumer components from ever re-rendering when parent state changes"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Prop getters encapsulate complex accessibility contracts (like aria-expanded, aria-controls, and keydown listeners) into convenient helper functions that consumers spread onto their custom DOM elements."
            }
        },
        {
            "title": "Headless Listbox: Keyboard Navigation, ARIA Roles & Focus Management",
            "say": [
                "The HTML standard provides a native `<select>` element that handles basic single-select and multi-select dropdown interactions. However, the native select element is notoriously resistant to custom styling. Browsers render the dropdown menu using native operating system chrome, making it virtually impossible for front-end engineers to inject custom brand icons, secondary metadata descriptions, status badges, or custom animations. Consequently, enterprise design systems build custom listbox components to satisfy demanding UI specifications.",
                "Unfortunately, authoring a custom listbox from scratch is one of the most perilous endeavors in front-end development. When developers replace the native select element with a custom `<div>` and a list of clickable child elements, they frequently break fundamental accessibility guarantees. Users who rely on screen readers or physical keyboards become trapped, unable to navigate options using arrow keys, select items using the Space or Enter keys, or jump directly to items using typeahead search.",
                "To build a fully compliant, production-grade custom listbox, front-end engineers must rigorously adhere to the W3C Web Accessibility Initiative Accessible Rich Internet Applications (WAI-ARIA) Listbox pattern. This pattern mandates explicit structural roles: the container element triggering the dropdown must have a role of 'combobox' or 'button' with 'aria-haspopup=\"listbox\"' and 'aria-expanded=\"true|false\"'. The menu container itself must possess 'role=\"listbox\"', and every selectable child option must declare 'role=\"option\"'.",
                "Furthermore, the listbox must manage selection state accurately. Every option node must declare 'aria-selected=\"true|false\"' to inform assistive technologies which entity is currently chosen. In single-select listboxes, only one option can have 'aria-selected=\"true\"' at any given time. If an option is temporarily disabled, such as an out-of-stock product or an unapproved corporate expense category, it must declare 'aria-disabled=\"true\"' so screen readers announce its unavailable status while keyboard navigation smoothly skips past it.",
                "Consider an everyday physical analogy: a floor-selection control panel in a modern high-rise elevator. When you step into the elevator, you cannot simply kick the elevator doors open or guess which floor is active. The panel provides distinct, illuminated tactile buttons for each floor (the options). When an elevator floor button is pressed, an indicator light glows brightly (aria-selected=\"true\"), a digital voice synthesizer announces the active floor over the speaker for visually impaired passengers (screen reader announcement), and floors currently undergoing maintenance have their buttons locked with a physical service cover (aria-disabled=\"true\"). The elevator controller guarantees that only valid floors can be activated in sequence.",
                "In software focus management, listboxes implement one of two distinct strategies: Roving Tabindex or Virtual Focus via 'aria-activedescendant'. In the Roving Tabindex strategy, the listbox dynamically adjusts the 'tabIndex' attribute of each option element. The highlighted option receives 'tabIndex=\"0\"', while all other options are assigned 'tabIndex=\"-1\"'. As the user presses the Down Arrow key, the headless engine programmatically shifts DOM focus to the next option element.",
                "In the Virtual Focus strategy, DOM focus remains pinned permanently to the trigger input or listbox container. Instead of shifting real DOM focus from element to element, the container updates its 'aria-activedescendant' attribute to match the unique HTML ID of the currently highlighted option element (e.g., 'aria-activedescendant=\"option-trading-account\"'). The screen reader detects this attribute change and announces the option, while CSS highlights the element visually using an active class. Virtual focus eliminates the performance overhead of continuous DOM focus shifts, making it the preferred choice for virtualized lists containing thousands of items.",
                "A robust headless listbox primitive encapsulates all these mathematical focus algorithms, keyboard event listeners (handling ArrowDown, ArrowUp, Home, End, Enter, Space, and Escape), and ARIA bindings into an unstyled state machine. Product engineers can then build breathtakingly styled select menus with complete confidence that accessibility compliance is guaranteed by design."
            ],
            "example": "A high-rise elevator control panel where illuminated floor buttons declare active selection, a voice synthesizer announces floor arrivals for accessibility, and maintenance keys lock out restricted levels.",
            "code": """interface ListboxOption {
  id: string;
  label: string;
  disabled?: boolean;
}

interface ListboxState {
  isOpen: boolean;
  activeIndex: number;
  selectedIndex: number;
  options: ListboxOption[];
}

class HeadlessListbox {
  private state: ListboxState;

  constructor(options: ListboxOption[]) {
    this.state = {
      isOpen: false,
      activeIndex: 0,
      selectedIndex: 0,
      options
    };
  }

  public handleKeyDown(key: string): void {
    if (!this.state.isOpen) {
      if (key === 'Enter' || key === ' ' || key === 'ArrowDown') {
        this.state.isOpen = true;
      }
      return;
    }

    const max = this.state.options.length;
    switch (key) {
      case 'ArrowDown':
        this.moveActive(1);
        break;
      case 'ArrowUp':
        this.moveActive(-1);
        break;
      case 'Home':
        this.setActiveFirst();
        break;
      case 'End':
        this.setActiveLast();
        break;
      case 'Enter':
      case ' ':
        if (!this.state.options[this.state.activeIndex].disabled) {
          this.state.selectedIndex = this.state.activeIndex;
          this.state.isOpen = false;
        }
        break;
      case 'Escape':
        this.state.isOpen = false;
        break;
    }
  }

  private moveActive(delta: number): void {
    let next = this.state.activeIndex;
    const len = this.state.options.length;
    for (let i = 0; i < len; i++) {
      next = (next + delta + len) % len;
      if (!this.state.options[next].disabled) {
        this.state.activeIndex = next;
        return;
      }
    }
  }

  private setActiveFirst(): void {
    for (let i = 0; i < this.state.options.length; i++) {
      if (!this.state.options[i].disabled) {
        this.state.activeIndex = i;
        return;
      }
    }
  }

  private setActiveLast(): void {
    for (let i = this.state.options.length - 1; i >= 0; i--) {
      if (!this.state.options[i].disabled) {
        this.state.activeIndex = i;
        return;
      }
    }
  }

  public getAriaAttributes() {
    const activeOpt = this.state.options[this.state.activeIndex];
    return {
      container: {
        role: 'combobox',
        'aria-expanded': this.state.isOpen,
        'aria-haspopup': 'listbox',
        'aria-activedescendant': this.state.isOpen ? activeOpt.id : undefined
      },
      listbox: {
        role: 'listbox',
        'aria-label': 'Account Selection'
      },
      getOptionProps: (index: number) => {
        const opt = this.state.options[index];
        return {
          id: opt.id,
          role: 'option',
          'aria-selected': index === this.state.selectedIndex,
          'aria-disabled': opt.disabled || false
        };
      }
    };
  }

  public getState() {
    return this.state;
  }
}

const listbox = new HeadlessListbox([
  { id: 'opt-1', label: 'Treasury Reserves' },
  { id: 'opt-2', label: 'Restricted Collateral', disabled: true },
  { id: 'opt-3', label: 'Operational Float' }
]);

listbox.handleKeyDown('ArrowDown'); // Open
console.log('Opened listbox active ID:', listbox.getAriaAttributes().container['aria-activedescendant']);

listbox.handleKeyDown('ArrowDown'); // Moves past disabled item to opt-3
console.log('Skipped disabled to active ID:', listbox.getAriaAttributes().container['aria-activedescendant']);

listbox.handleKeyDown('Enter'); // Selects opt-3 and closes
console.log('Final selected index:', listbox.getState().selectedIndex, '| Open:', listbox.getState().isOpen);""",
            "output": """Opened listbox active ID: opt-1
Skipped disabled to active ID: opt-3
Final selected index: 2 | Open: false""",
            "codeNotes": [
                {"line": 23, "note": "Implements WAI-ARIA keyboard navigation handling ArrowDown, ArrowUp, Home, End, Space, and Escape."},
                {"line": 56, "note": "Safe active index traversal algorithm that systematically skips elements marked with disabled: true."},
                {"line": 86, "note": "Emits standard WAI-ARIA combobox/listbox attributes including virtual focus via aria-activedescendant."}
            ],
            "tryIt": "Add support for typing alphanumeric characters to jump directly to options starting with that letter (typeahead search).",
            "check": {
                "question": "When implementing a WAI-ARIA compliant headless listbox using the virtual focus strategy, how is the active item communicated to assistive technologies?",
                "options": [
                    "By updating the container's 'aria-activedescendant' attribute with the unique HTML id of the currently highlighted option while keeping DOM focus on the container",
                    "By continuously shifting physical document.activeElement focus to each DOM node on every arrow key press",
                    "By playing a loud sound effect through Web Audio API whenever the user presses an arrow key",
                    "By changing the browser's window.location.hash URL to match the highlighted item name"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Virtual focus keeps DOM focus on the combobox trigger or list container while updating 'aria-activedescendant' to point to the highlighted option's ID, allowing screen readers to announce changes without incurring heavy focus shift repaints."
            }
        },
        {
            "title": "Building a Headless Combobox: Typeahead Filtering, Virtual Focus & Announcements",
            "say": [
                "While a standard listbox allows users to pick from a modest list of ten or twenty options, modern enterprise software frequently requires users to select from thousands of records: selecting an international currency pair, assigning a corporate employee from an organizational directory, or choosing an equity ticker symbol across global stock exchanges. For these high-scale data workflows, a simple listbox is insufficient; users require an interactive Combobox.",
                "A Combobox is a composite widget that combines a single-line textbox input with an associated popover listbox. As the user types into the input field, the component dynamically filters the list of displayed options in real time. The user can either finish typing their query or use the arrow keys to seamlessly traverse down into the filtered recommendations, pressing Enter to finalize their selection.",
                "Constructing a headless combobox introduces significant algorithmic and accessibility complexities that far exceed a basic dropdown menu. First, the component must coordinate three independent data flows simultaneously: the raw string typed by the user in the input element, the filtered array of matching candidate options, and the currently highlighted active index within that filtered subset.",
                "A common failure mode in poorly engineered comboboxes is state synchronization corruption during filtering. When a user has highlighted the fourth item in an unfiltered list of one hundred items, and then types a character that reduces the filtered list to only two items, a naive state machine will keep the active index at four. This causes an out-of-bounds index error, breaking the UI or displaying phantom selection highlights. The headless combobox must enforce strict state invariants, automatically clamping the active index to zero whenever the underlying filtered collection changes.",
                "To understand the role of live accessibility announcements in comboboxes, consider an airport flight departure board combined with an information desk agent. When you walk up to the gate information desk and ask, 'Show me all flights departing to Tokyo', the customer service agent taps keys on their terminal. A large digital screen immediately narrows down the list of fifty international departures to the three scheduled flights to Tokyo. At the exact same moment, the agent speaks clearly into the microphone: 'Three flights to Tokyo found. The earliest flight departs at gate 14.' Visually oriented travelers look at the screen; visually impaired travelers hear the exact verbal announcement without having to inspect every single gate.",
                "In software, this verbal announcement is achieved using an ARIA Live Region: an HTML container with 'aria-live=\"polite\"' and 'aria-atomic=\"true\"'. When the headless combobox finishes filtering its dataset, it writes a concise, descriptive string to this live region, such as '5 results available. Use up and down arrow keys to navigate.' Assistive screen readers detect this DOM text insertion and vocalize the result count to the user without interrupting their active typing rhythm.",
                "Additionally, the headless combobox must provide sophisticated debounce and virtual focus contracts. When dealing with remote API searches, the headless engine debounces user keystrokes to prevent hammering backend servers with hundreds of redundant network requests per second. During rendering, virtual focus via 'aria-activedescendant' ensures that the user's cursor remains firmly inside the text input, preserving their active typing position while screen readers seamlessly track the highlighted recommendation in the popover.",
                "Finally, consider the edge-case handling of asynchronous network latency and stale query responses in enterprise search inputs. When an analyst types rapidly—entering 'TSLA' followed by 'AAPL' within three hundred milliseconds—two distinct asynchronous fetch promises are dispatched to the server. If network packets arrive out of chronological order, a slower response for the earlier query could overwrite the fresher response, displaying stale stock quotes under an active search for Apple. The headless combobox mitigates this race condition through internal cancellation tokens or sequence epoch identifiers, discarding any response whose request timestamp precedes the latest keystroke.",
                "By encapsulating search indexing, fuzzy string matching, race condition prevention, index clamping, and live region announcements into an unstyled headless combobox primitive, enterprise teams can rapidly construct lightning-fast, fully accessible search experiences across any web application."
            ],
            "example": "An airport information desk agent who filters international flights on their terminal and simultaneously speaks the matching flight count over the public address system for visually impaired travelers.",
            "code": """interface ComboboxItem {
  id: string;
  name: string;
  category: string;
}

interface ComboboxState {
  query: string;
  isOpen: boolean;
  activeIndex: number;
  filteredItems: ComboboxItem[];
  announcement: string;
}

class HeadlessCombobox {
  private allItems: ComboboxItem[];
  private state: ComboboxState;

  constructor(items: ComboboxItem[]) {
    this.allItems = items;
    this.state = {
      query: '',
      isOpen: false,
      activeIndex: -1,
      filteredItems: items,
      announcement: ''
    };
  }

  public setQuery(text: string): void {
    const q = text.toLowerCase().trim();
    const filtered = this.allItems.filter(item =>
      item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q)
    );

    this.state = {
      query: text,
      isOpen: true,
      activeIndex: filtered.length > 0 ? 0 : -1,
      filteredItems: filtered,
      announcement: `${filtered.length} matching result${filtered.length === 1 ? '' : 's'} available.`
    };
  }

  public handleKeyDown(key: string): void {
    if (!this.state.isOpen) return;

    const count = this.state.filteredItems.length;
    if (count === 0) return;

    if (key === 'ArrowDown') {
      this.state.activeIndex = (this.state.activeIndex + 1) % count;
    } else if (key === 'ArrowUp') {
      this.state.activeIndex = (this.state.activeIndex - 1 + count) % count;
    } else if (key === 'Escape') {
      this.state.isOpen = false;
      this.state.activeIndex = -1;
    }
  }

  public getInputProps() {
    const active = this.state.filteredItems[this.state.activeIndex];
    return {
      role: 'combobox',
      'aria-expanded': this.state.isOpen,
      'aria-autocomplete': 'list' as const,
      'aria-controls': 'combobox-options-list',
      'aria-activedescendant': active ? active.id : undefined,
      value: this.state.query
    };
  }

  public getLiveRegionText(): string {
    return this.state.announcement;
  }

  public getActiveItem(): ComboboxItem | null {
    if (this.state.activeIndex >= 0 && this.state.activeIndex < this.state.filteredItems.length) {
      return this.state.filteredItems[this.state.activeIndex];
    }
    return null;
  }
}

const directory = [
  { id: 'usr-1', name: 'Alice Chen', category: 'Quantitative Research' },
  { id: 'usr-2', name: 'Bob Martinez', category: 'Risk Analytics' },
  { id: 'usr-3', name: 'Alina Rostova', category: 'Treasury Engineering' }
];

const combobox = new HeadlessCombobox(directory);

// User types 'Ali'
combobox.setQuery('Ali');
console.log('Live Announcement:', combobox.getLiveRegionText());
console.log('Active Descendant:', combobox.getInputProps()['aria-activedescendant']);
console.log('Currently Highlighted:', combobox.getActiveItem()?.name);

// User presses ArrowDown to navigate to Alina
combobox.handleKeyDown('ArrowDown');
console.log('After ArrowDown Highlighted:', combobox.getActiveItem()?.name);""",
            "output": """Live Announcement: 2 matching results available.
Active Descendant: usr-1
Currently Highlighted: Alice Chen
After ArrowDown Highlighted: Alina Rostova""",
            "codeNotes": [
                {"line": 26, "note": "Filters dataset and automatically clamps active index to 0, synchronizing the live announcement text."},
                {"line": 40, "note": "Keyboard event handler managing roving highlight within the dynamically filtered items array."},
                {"line": 54, "note": "Exposes standard W3C combobox attributes binding input control to the options popover."}
            ],
            "tryIt": "Add a minimum query length check so that filtering only triggers after the user has entered at least 2 characters.",
            "check": {
                "question": "Why must a headless combobox update an 'aria-live' region whenever the filtered search results change?",
                "options": [
                    "To announce the number of matching search results to blind or visually impaired screen reader users without disrupting their active typing",
                    "To trigger a browser refresh and clear the internal network cache",
                    "To force search engine crawlers to index the user's private search query",
                    "To enable hardware acceleration on CSS transition animations"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "ARIA live regions announce dynamic content changes (such as '3 results available') to assistive technology users who cannot visually see the popover menu appear on screen."
            }
        },
        {
            "title": "Enterprise Application: Multi-Brand Theme Adapter Using Headless Primitives",
            "say": [
                "To see the ultimate practical payoff of headless UI architecture, we now assemble an enterprise-grade Multi-Brand Theme Adapter. Consider a global conglomerate that owns three distinct digital financial platforms: 'Apex Institutional', an ultra-high-density trading platform designed for Wall Street algorithmic traders; 'Nova Consumer', a playful, mobile-first neobanking app with large touch targets and rounded corners; and 'Veritas Wealth', a prestigious private banking portal emphasizing clean luxury typography and conservative spacing.",
                "Without headless architecture, the conglomerate's engineering department would employ three separate frontend teams writing three separate dropdown components. Each team would author its own keyboard handlers, its own ARIA roles, and its own state machine. When an international regulatory audit discovers that the dropdown menus fail WCAG 2.2 focus visibility criteria in high-contrast mode, all three teams must scramble to diagnose and patch their code, costing hundreds of thousands of dollars in duplicated engineering hours.",
                "With the headless adapter pattern, the conglomerate's central design systems team writes and maintains a single, mathematically verified headless listbox engine. This engine exposes pure state variables, prop getters, and event listeners. The three product teams act as consumers, each implementing an unopinionated Visual Theme Adapter that maps the headless engine's output to their specific brand tokens and CSS frameworks.",
                "Let us examine how the three brand adapters consume the identical headless engine: The Apex Institutional adapter consumes the engine and wraps it in a compact, zero-border-radius container with monochrome dark backgrounds, mono-spaced font tokens, and micro-spacing (4px padding) suited for multi-monitor trading desks. The Nova Consumer adapter takes the exact same engine and wraps it in bright gradients, 16px pill-shaped border radii, vibrant hover animations, and 48px touch targets compliant with mobile ergonomics.",
                "Finally, the Veritas Wealth adapter takes that same engine and applies classic serif headings, subtle 1px border lines, slate elevation shadows, and spacious 16px padding. Notice what has happened: the visual aesthetics of the three products could not be more divergent. A user looking at all three applications would never suspect they share a single line of frontend code.",
                "Yet, under the hood, every single mechanical interaction is one hundred percent identical. A blind trader using a screen reader on Apex Institutional experiences the exact same flawless ARIA announcements as a high-net-worth client using Veritas Wealth. An investor navigating with a keyboard uses the exact same ArrowDown, ArrowUp, Home, End, and Enter key shortcuts across all three platforms. If an accessibility defect is discovered, the central team fixes it in the headless core, and a single package update simultaneously resolves the defect across all three global products.",
                "Furthermore, the multi-brand adapter pattern provides profound operational efficiencies during enterprise mergers and corporate brand acquisitions. When a financial conglomerate acquires a fintech startup, leadership typically demands that the acquired company's customer-facing application immediately adopt corporate typography, color palettes, and navigation conventions without halting ongoing product development. In a monolithic codebase, such rebranding initiatives consume months of tedious CSS overrides and risk breaking customer checkout flows. Under a headless adapter architecture, engineers simply declare a new BrandThemeConfig mapping the acquired brand's tokens to the headless core, achieving day-one visual compliance within a single two-week sprint.",
                "Let us model this multi-brand theme adapter in executable TypeScript. We will construct a universal headless selector engine and instantiate three distinct brand transformers: Apex Terminal, Nova Consumer, and Veritas Wealth. The script demonstrates how identical state transitions compile into three distinct branded visual outputs with zero code duplication.",
                "From an architectural governance perspective, this clean decoupling also establishes clear boundaries between platform engineering teams and decentralized product squads. The platform team maintains sole ownership of the headless state machine, performance optimizations, and accessibility unit tests, publishing versioned npm packages. Meanwhile, individual product squads retain complete autonomy over their brand theme configurations and Tailwind design tokens. This operational separation of concerns prevents merge conflicts, eliminates duplicated QA testing, and empowers the organization to scale its digital portfolio seamlessly across dozens of sub-brands.",
                "This enterprise multi-brand adapter pattern represents the gold standard of modern enterprise front-end architecture. It empowers organizations to achieve unmatched brand flexibility without sacrificing software reliability, engineering velocity, or accessibility compliance."
            ],
            "example": "A universal Swiss watch movement (the headless mechanical caliber) powering a rugged diver's sports watch, a minimalist dress watch, and an avant-garde titanium chronograph with completely different exterior cases.",
            "code": """interface BrandThemeConfig {
  brandName: string;
  containerClass: string;
  itemActiveClass: string;
  itemInactiveClass: string;
  density: 'compact' | 'comfortable' | 'spacious';
}

interface SelectorOption {
  value: string;
  label: string;
}

class UniversalHeadlessEngine {
  private selectedValue: string;
  private options: SelectorOption[];

  constructor(options: SelectorOption[], defaultValue: string) {
    this.options = options;
    this.selectedValue = defaultValue;
  }

  public select(value: string): void {
    this.selectedValue = value;
  }

  public getState() {
    return {
      selectedValue: this.selectedValue,
      options: this.options
    };
  }
}

class MultiBrandThemeAdapter {
  public static render(engine: UniversalHeadlessEngine, theme: BrandThemeConfig): string {
    const state = engine.getState();
    const renderedItems = state.options.map(opt => {
      const isSelected = opt.value === state.selectedValue;
      const itemClass = isSelected ? theme.itemActiveClass : theme.itemInactiveClass;
      return `    <li class="${itemClass}" role="option" aria-selected="${isSelected}">${opt.label}</li>`;
    }).join('\\n');

    return `<!-- Brand: ${theme.brandName} (${theme.density}) -->\\n<ul class="${theme.containerClass}" role="listbox">\\n${renderedItems}\\n</ul>`;
  }
}

const currencyOptions: SelectorOption[] = [
  { value: 'USD', label: 'US Dollar ($)' },
  { value: 'EUR', label: 'Euro (EUR)' },
  { value: 'GBP', label: 'British Pound (GBP)' }
];

const engine = new UniversalHeadlessEngine(currencyOptions, 'USD');

const apexTheme: BrandThemeConfig = {
  brandName: 'Apex Institutional',
  density: 'compact',
  containerClass: 'apex-listbox bg-slate-900 border border-slate-700 text-xs p-1 font-mono',
  itemActiveClass: 'bg-blue-600 text-white px-2 py-0.5',
  itemInactiveClass: 'text-slate-300 hover:bg-slate-800 px-2 py-0.5'
};

const novaTheme: BrandThemeConfig = {
  brandName: 'Nova Consumer Neobank',
  density: 'comfortable',
  containerClass: 'nova-listbox bg-white shadow-xl rounded-2xl p-3 border-2 border-indigo-100',
  itemActiveClass: 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl p-3 font-bold',
  itemInactiveClass: 'text-gray-700 hover:bg-gray-50 rounded-xl p-3'
};

const veritasTheme: BrandThemeConfig = {
  brandName: 'Veritas Private Wealth',
  density: 'spacious',
  containerClass: 'veritas-listbox bg-stone-50 border-t border-b border-stone-300 p-4 font-serif',
  itemActiveClass: 'border-l-2 border-amber-700 pl-3 text-stone-900 font-semibold',
  itemInactiveClass: 'text-stone-600 hover:text-stone-900 pl-3'
};

console.log(MultiBrandThemeAdapter.render(engine, apexTheme));
console.log('------------------------------------------------------------');
console.log(MultiBrandThemeAdapter.render(engine, novaTheme));
console.log('------------------------------------------------------------');
console.log(MultiBrandThemeAdapter.render(engine, veritasTheme));""",
            "output": """<!-- Brand: Apex Institutional (compact) -->
<ul class="apex-listbox bg-slate-900 border border-slate-700 text-xs p-1 font-mono" role="listbox">
    <li class="bg-blue-600 text-white px-2 py-0.5" role="option" aria-selected="true">US Dollar ($)</li>
    <li class="text-slate-300 hover:bg-slate-800 px-2 py-0.5" role="option" aria-selected="false">Euro (EUR)</li>
    <li class="text-slate-300 hover:bg-slate-800 px-2 py-0.5" role="option" aria-selected="false">British Pound (GBP)</li>
</ul>
------------------------------------------------------------
<!-- Brand: Nova Consumer Neobank (comfortable) -->
<ul class="nova-listbox bg-white shadow-xl rounded-2xl p-3 border-2 border-indigo-100" role="listbox">
    <li class="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl p-3 font-bold" role="option" aria-selected="true">US Dollar ($)</li>
    <li class="text-gray-700 hover:bg-gray-50 rounded-xl p-3" role="option" aria-selected="false">Euro (EUR)</li>
    <li class="text-gray-700 hover:bg-gray-50 rounded-xl p-3" role="option" aria-selected="false">British Pound (GBP)</li>
</ul>
------------------------------------------------------------
<!-- Brand: Veritas Private Wealth (spacious) -->
<ul class="veritas-listbox bg-stone-50 border-t border-b border-stone-300 p-4 font-serif" role="listbox">
    <li class="border-l-2 border-amber-700 pl-3 text-stone-900 font-semibold" role="option" aria-selected="true">US Dollar ($)</li>
    <li class="text-stone-600 hover:text-stone-900 pl-3" role="option" aria-selected="false">Euro (EUR)</li>
    <li class="text-stone-600 hover:text-stone-900 pl-3" role="option" aria-selected="false">British Pound (GBP)</li>
</ul>""",
            "codeNotes": [
                {"line": 13, "note": "Defines universal headless selection engine that tracks active currency state completely independent of markup."},
                {"line": 31, "note": "MultiBrandThemeAdapter transforms headless state into custom HTML structures and CSS class bindings for each brand."},
                {"line": 70, "note": "Demonstrates three radically different visual outputs produced by the exact same underlying state engine."}
            ],
            "tryIt": "Add a fourth brand theme configuration 'CyberExchange' featuring neon green active borders and monospace terminal typography.",
            "check": {
                "question": "In an enterprise multi-brand design system architecture, what is the key responsibility of the Visual Theme Adapter layer?",
                "options": [
                    "To map headless state variables, ARIA contracts, and event handlers to brand-specific CSS classes, tokens, and visual styling",
                    "To handle complex user authentication and encryption handshakes with backend microservices",
                    "To replace the browser DOM parser with a custom WebGL canvas rendering loop",
                    "To compile TypeScript code directly into native ARM assembly instructions"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "The Visual Theme Adapter is the presentation layer that binds brand-specific CSS classes, tokens, and layouts to the shared, unopinionated headless state engine without duplicating behavioral logic."
            }
        }
    ],
    "summary": [
        "Headless UI architecture strictly decouples behavioral state machines, keyboard navigation, and ARIA contracts from visual styling and DOM presentation.",
        "The Render Props pattern implements inversion of control, allowing headless primitives to pass internal state and prop getters to consumer-defined JSX trees.",
        "A WAI-ARIA compliant headless listbox manages single/multi-selection, roving tabindex or virtual focus, and keyboard accessibility (Arrow keys, Home, End, Enter, Escape).",
        "Headless comboboxes coordinate real-time typeahead filtering, active index clamping, and live region announcements (aria-live='polite') for assistive technology.",
        "Enterprise multi-brand adapters enable institutional, consumer, and wealth management applications to maintain distinct aesthetics while sharing unified core logic."
    ],
    "projectStep": {
        "title": "Architect and Certify Headless UI Component Adapter",
        "steps": [
            "Construct headless dropdown and listbox state machine with full keyboard traversal",
            "Implement prop getter functions injecting standard WAI-ARIA attributes",
            "Integrate aria-live polite announcements for dynamic search filtering",
            "Author multi-brand theme adapter transforming headless state into branded DOM markup",
            "Verify complete WCAG 2.2 AA accessibility compliance and zero visual regressions"
        ]
    }
}

if __name__ == '__main__':
    for i, p in enumerate(DAY_31['parts']):
        words = count_words(p['say'])
        print(f"Day 31 Part {i+1} ('{p['title'][:35]}...'): {words} words")
