# scripts/design_day33_data.py
import re

def count_words(say_list):
    total = 0
    for p in say_list:
        total += len(re.findall(r'\b[A-Za-z0-9_\-\.\$\/\:\@\']+\b', p))
    return total

DAY_33 = {
    "day": 33,
    "title": "Polymorphic Components & the `as` Prop Pattern: Type-Safe Element Morphing",
    "goal": "Master polymorphic component architecture in TypeScript: author flexible UI elements (Buttons, Boxes, Text) that dynamically morph their underlying HTML tags or framework link components while preserving strict type safety and ref forwarding.",
    "minutes": 25,
    "recap": "In the preceding days, we conquered headless logic separation and compound state sharing. Today we master polymorphic components, solving the ubiquitous challenge of rendering buttons as links, headings as spans, and cards as articles with complete TypeScript type safety.",
    "parts": [
        {
            "title": "The Polymorphic `as` Prop & Why Buttons Sometimes Must Render as Links",
            "say": [
                "In enterprise web development, visual design and semantic HTML often find themselves in direct architectural tension. A visual designer creates a high-fidelity mockup in Figma featuring a bold, vibrant, pill-shaped primary action element styled with gradient backgrounds, focus rings, and hover shadows. In the designer's mind and in the product design token catalog, this element is universally classified as a 'Primary Button'. However, when software engineers examine how this element functions in the actual user journey, they discover that in five places it triggers an in-page modal dialog, while in three other places it navigates the user to an external billing documentation website or a client login route.",
                "This creates a fundamental dilemma for front-end engineers. In standard HTML and W3C accessibility guidelines, buttons and links have strictly distinct semantic contracts. An HTML `<button>` is designed for performing in-page actions: submitting a form, toggling a dropdown menu, opening a modal window, or dispatching an asynchronous command. Conversely, an HTML `<a>` anchor tag is designed for navigation: routing the user to a different URL, transitioning between pages, or linking to an external web resource. Screen readers announce buttons and links differently, and users interact with them using different keyboard shortcuts: pressing the Enter key activates both links and buttons, but pressing the Spacebar key activates only buttons while scrolling the page for links.",
                "If developers attempt to solve this dilemma by rendering an `<a href=\"...\">` tag and wrapping it inside a `<button>`, they produce invalid HTML: interactive elements cannot be nested inside other interactive elements according to W3C specifications. If developers render a `<button>` and attach an `onClick={() => window.location.href = '...'}` handler, they break standard browser navigation: users cannot right-click to 'Open in New Tab', middle-click with a mouse wheel, or copy the destination URL to their clipboard.",
                "Conversely, if the design system team builds two completely separate components—`<Button>` and `<ButtonLink>`—they duplicate hundreds of lines of complex CSS styles, hover micro-interactions, responsive sizing ramps, and design token bindings. When a brand refresh changes the primary button border radius from 4px to 8px, an engineer inevitably forgets to update `<ButtonLink>`, resulting in visual inconsistencies across the enterprise product suite.",
                "To understand the elegant solution through an everyday physical analogy, consider a modular heavy-duty utility truck. The front half of the truck possesses the powerful engine, comfortable cabin, steering wheel, headlights, and safety airbag systems (the core visual styling and brand foundations). However, the rear chassis is equipped with a universal quick-release coupling hitch. Depending on the task at hand, the driver can attach a dump bed for carrying gravel, a refrigerated cargo box for delivering food, or a flatbed trailer for transporting vehicles.",
                "The truck does not need to be completely rebuilt into three separate vehicles; it simply morphs its operational utility by mounting different functional beds onto its shared engine foundation. The Polymorphic Component pattern, driven by the `as` prop, is software's equivalent of this quick-release coupling hitch.",
                "A Polymorphic Component is a component that can dynamically change its underlying rendered HTML element or custom framework component (such as Next.js `<Link>` or React Router `<Link>`) based on a single prop: the `as` prop. When a developer writes `<Button as=\"button\" onClick={openModal}>Open Account</Button>`, it renders a semantic HTML `<button>`. When the developer writes `<Button as=\"a\" href=\"/pricing\">View Pricing</Button>`, it renders an accessible HTML `<a>` anchor tag, retaining one hundred percent of the button's exact visual styling, sizing, and brand tokens.",
                "By mastering the polymorphic `as` prop pattern, front-end engineers permanently resolve the tension between visual design and semantic HTML. Designers get consistent visual components, accessibility specialists get valid semantic markup, and developers enjoy a single, DRY (Don't Repeat Yourself) component API."
            ],
            "example": "A modular utility truck chassis that mounts a dump bed for gravel, a flatbed for equipment, or a cargo box for deliveries while sharing the exact same cabin, engine, and headlights.",
            "code": """type AsProp<E extends string> = {
  as?: E;
  className?: string;
  children: string;
};

// Simulated Polymorphic Element Renderer
class PolymorphicRenderer {
  public static render<E extends 'button' | 'a' | 'div'>(
    props: AsProp<E> & { href?: string; onClick?: () => void; type?: 'button' | 'submit' }
  ): string {
    const Tag = props.as || 'button';
    const classes = `btn-base btn-primary ${props.className || ''}`.trim();

    if (Tag === 'a') {
      return `<a href="${props.href || '#'}" class="${classes}">${props.children}</a>`;
    } else if (Tag === 'button') {
      const btnType = props.type || 'button';
      return `<button type="${btnType}" class="${classes}">${props.children}</button>`;
    } else {
      return `<div role="button" tabindex="0" class="${classes}">${props.children}</div>`;
    }
  }
}

// Case 1: Standard In-Page Action Button
const actionBtn = PolymorphicRenderer.render({
  as: 'button',
  type: 'submit',
  children: 'Submit Transfer'
});
console.log('Action Button Output:\\n', actionBtn);

// Case 2: Polymorphic Link Navigation
const linkBtn = PolymorphicRenderer.render({
  as: 'a',
  href: '/institutional/settlement',
  children: 'Go to Settlement Desk'
});
console.log('\\nNavigation Link Output:\\n', linkBtn);

// Case 3: Default fallback (no 'as' supplied defaults to button)
const defaultBtn = PolymorphicRenderer.render({
  children: 'Default Action'
});
console.log('\\nDefault Fallback Output:\\n', defaultBtn);""",
            "output": """Action Button Output:
 <button type="submit" class="btn-base btn-primary">Submit Transfer</button>

Navigation Link Output:
 <a href="/institutional/settlement" class="btn-base btn-primary">Go to Settlement Desk</a>

Default Fallback Output:
 <button type="button" class="btn-base btn-primary">Default Action</button>""",
            "codeNotes": [
                {"line": 1, "note": "AsProp generic type defines optional element tag override with HTML element constraints."},
                {"line": 11, "note": "Dynamic Tag resolution: defaults to semantic button while morphing to anchor tag when as='a'."},
                {"line": 24, "note": "Demonstrates identical CSS classes (btn-base btn-primary) applied to both button and anchor tags."}
            ],
            "tryIt": "Add support for an 'input' tag override with type='submit' that renders a self-closing <input value='...' /> element.",
            "check": {
                "question": "What is the primary architectural purpose of the polymorphic 'as' prop pattern in design systems?",
                "options": [
                    "To decouple visual component styling from underlying HTML semantics, allowing a single styled component to render as a button, link, or custom router tag",
                    "To encrypt HTML tags before they are transmitted across WebSocket connections",
                    "To convert SVG vector graphics into rasterized PNG images on the fly",
                    "To prevent search engines from crawling external hyperlink destinations"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "The polymorphic 'as' prop allows developers to preserve uniform visual design system styling while dynamically selecting the correct semantic HTML tag (such as rendering a styled button as an <a> tag when navigating)."
            }
        },
        {
            "title": "TypeScript Generics for Polymorphic Props: Extracting Native Element Attributes",
            "say": [
                "While implementing a basic polymorphic component in JavaScript is relatively trivial, making it genuinely robust in TypeScript is one of the most sophisticated challenges in front-end type gymnastics. A naive TypeScript implementation uses an `as?: any` prop or a loose union like `as?: 'button' | 'a'`. However, this naive typing introduces severe developer friction: it fails to enforce tag-specific HTML attribute contracts.",
                "Consider what happens when a developer writes `<Button as=\"a\" href=\"/dashboard\">`. In this scenario, the `href` attribute is completely valid and expected for an anchor tag. But what happens if the developer writes `<Button as=\"button\" href=\"/dashboard\">`? In native HTML, a `<button>` element does not possess an `href` attribute; passing it is a semantic error that may cause confusing bugs. Conversely, if a developer writes `<Button as=\"button\" type=\"submit\">`, the `type` attribute is completely valid for a button, but passing `type=\"submit\"` to an `<a>` anchor tag is invalid.",
                "Furthermore, what about required attributes? If a developer renders an image component `<Box as=\"img\">`, the `src` and `alt` attributes should be strictly required by the TypeScript compiler. A truly production-grade polymorphic component must dynamically infer and enforce the exact HTML attribute types of the specific tag passed into the `as` prop.",
                "To achieve this level of type safety, enterprise design systems construct a series of advanced TypeScript type helpers using Generics, Conditional Types, and the native `React.ComponentPropsWithoutRef<T>` utility. Let us walk through the architectural mechanics of this type pipeline step by step.",
                "To visualize this type extraction pipeline through an everyday physical analogy, consider an industrial multi-tool power drill with interchangeable tool heads. When you snap in a masonry drill bit (representing an anchor tag), the tool's computerized torque controller automatically configures itself for heavy hammer-drilling and displays depth gauge settings on its digital screen. If you remove the drill bit and snap in a delicate precision screwdriver bit (representing a button), the controller immediately disables the hammer mechanism, limits maximum torque to prevent stripping screws, and illuminates micro-guide LEDs.",
                "The power drill does not allow you to activate hammer mode when a screwdriver bit is attached; the physical socket geometry dynamically dictates which operational modes are valid. In TypeScript, our polymorphic prop generic functions as this intelligent computerized socket controller.",
                "In code, we define `PolymorphicProps<E extends React.ElementType, P = {}>`. The type extracts `React.ComponentPropsWithoutRef<E>`, strips out any conflicting keys using the `Omit<T, K>` utility, and combines the native element attributes with our custom design system props (such as `variant`, `size`, and `as?: E`).",
                "A subtle but critical architectural consideration in polymorphic type definitions is the handling of default element tags. When a consumer writes `<Button variant=\"primary\">Click Me</Button>` without specifying an explicit `as` prop, TypeScript must automatically infer that the underlying element defaults to an HTML `<button>`. If the type system fails to establish this default fallback, TypeScript will treat the props as an ambiguous union, requiring developers to pass `as=\"button\"` everywhere or manually annotate prop types at every call site. By structuring our generic definition with a default type parameter (`E extends React.ElementType = 'button'`), we guarantee effortless developer ergonomics while preserving bulletproof type safety.",
                "Moreover, in modern Next.js and React Router applications, the `as` prop must support not only primitive HTML string tags ('button', 'a', 'div'), but also complex custom React component types like `Link`. When passing a framework component to `as`, TypeScript must extract that component's custom prop signature—such as `href={{ pathname: '/portfolio', query: { id: '123' } }}`—and merge it seamlessly into our design system props without triggering compiler conflicts.",
                "When a developer uses this component in an enterprise codebase, their IDE provides magical, context-aware auto-completion. If they specify `as=\"a\"`, typing `hr` immediately prompts auto-complete for `href`, `target`, and `rel`. If they change it to `as=\"button\"`, `href` is instantly underlined with a red compiler error, while `disabled` and `type` become available. This absolute compile-time safety eliminates entire classes of runtime defects across distributed engineering organizations."
            ],
            "example": "A computerized industrial power drill that detects whether a drill bit or screwdriver is attached, automatically enabling or disabling torque and hammer settings based on the connected bit.",
            "code": """// Advanced TypeScript Polymorphic Type System Simulator
interface BaseDesignProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

// Native HTML Attribute Mappings
interface ButtonAttributes {
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: () => void;
}

interface AnchorAttributes {
  href: string;
  target?: '_blank' | '_self';
  rel?: string;
}

interface DivAttributes {
  role?: string;
  tabIndex?: number;
}

type ElementAttributeMap = {
  button: ButtonAttributes;
  a: AnchorAttributes;
  div: DivAttributes;
};

// Polymorphic Type Contract
type PolymorphicProps<E extends keyof ElementAttributeMap, P> = P & {
  as?: E;
  children: string;
} & ElementAttributeMap[E];

// Type-Safe Component Simulator Function
function createPolymorphicElement<E extends keyof ElementAttributeMap>(
  props: PolymorphicProps<E, BaseDesignProps>
): string {
  const tag = props.as || 'button';
  const variant = props.variant || 'primary';
  const size = props.size || 'md';
  const attrList: string[] = [];

  if (props.as === 'a') {
    const aProps = props as AnchorAttributes;
    attrList.push(`href="${aProps.href}"`);
    if (aProps.target) attrList.push(`target="${aProps.target}"`);
  } else if (props.as === 'button' || !props.as) {
    const bProps = props as ButtonAttributes;
    attrList.push(`type="${bProps.type || 'button'}"`);
    if (bProps.disabled) attrList.push('disabled');
  }

  const attrs = attrList.length > 0 ? ' ' + attrList.join(' ') : '';
  return `<${tag} class="btn-${variant} btn-${size}"${attrs}>${props.children}</${tag}>`;
}

// Valid Call 1: Button with type and disabled
const btn = createPolymorphicElement<'button'>({
  as: 'button',
  variant: 'danger',
  size: 'lg',
  type: 'submit',
  disabled: true,
  children: 'Purge Database Ledger'
});
console.log('Valid Button with Attributes:\\n', btn);

// Valid Call 2: Anchor with required href and target
const anchor = createPolymorphicElement<'a'>({
  as: 'a',
  variant: 'primary',
  size: 'sm',
  href: 'https://sec.gov/filings',
  target: '_blank',
  children: 'SEC Regulatory Filings'
});
console.log('\\nValid Anchor with Attributes:\\n', anchor);""",
            "output": """Valid Button with Attributes:
 <button class="btn-danger btn-lg" type="submit" disabled>Purge Database Ledger</button>

Valid Anchor with Attributes:
 <a class="btn-primary btn-sm" href="https://sec.gov/filings" target="_blank">SEC Regulatory Filings</a>""",
            "codeNotes": [
                {"line": 25, "note": "PolymorphicProps generic merges design system props with exact HTML attributes of the selected element tag."},
                {"line": 31, "note": "createPolymorphicElement validates tag-specific attributes during compile time via ElementAttributeMap."},
                {"line": 52, "note": "Demonstrates strict attribute enforcement: anchor correctly accepts href while button accepts disabled."}
            ],
            "tryIt": "Add an 'input' element mapping to ElementAttributeMap with required placeholder: string and value: string properties.",
            "check": {
                "question": "Why is 'ComponentPropsWithoutRef<E>' combined with TypeScript generics in production polymorphic component typings?",
                "options": [
                    "To dynamically extract and enforce the exact HTML attribute types belonging to the element tag specified in the 'as' prop",
                    "To compress client JavaScript assets into gzip format during compilation",
                    "To prevent React from re-rendering the component when props change",
                    "To automatically generate database schemas for backend GraphQL resolvers"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "ComponentPropsWithoutRef<E> extracts native HTML element attributes, ensuring that when as='a' is passed, TypeScript strictly allows anchor attributes like href while rejecting button-specific attributes like type='submit'."
            }
        },
        {
            "title": "Building a Polymorphic Box Component: Semantic HTML Selection at the Call Site",
            "say": [
                "In modern design system architecture, layout primitives form the structural skeleton upon which all visual components are placed. While specialized components like `<Card>`, `<Navbar>`, and `<Sidebar>` are common, design systems frequently suffer from 'div soup'—an anti-pattern where every layout container, flex wrapper, and grid cell is authored using generic HTML `<div>` tags.",
                "Div soup is devastating for web accessibility and search engine optimization. Web browsers and assistive screen readers rely on semantic HTML elements—such as `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, and `<footer>`—to construct the document landmark hierarchy. Landmarks allow blind and visually impaired users to press shortcut keys (such as the 'D' key in NVDA and JAWS) to instantly skip directly to the main content, jump past repetitive navigation menus, or locate search sidebars.",
                "When every container is an unsemantic `<div>`, screen readers perceive the page as a flat, featureless wall of text with zero landmarks. However, forcing frontend developers to author raw HTML elements often causes them to abandon design token utilities, leading to arbitrary inline styles and inconsistent padding.",
                "The ultimate architectural solution to this challenge is the Polymorphic `<Box>` component. The Box component is the atomic layout building block of an enterprise design system. It encapsulates all spatial design tokens—margins, paddings, flex alignments, grid tracks, border radii, and background color tokens—while allowing the consuming developer to choose the underlying semantic HTML element directly at the call site using the `as` prop.",
                "To understand the polymorphic Box through an everyday physical analogy, consider an architectural steel framing system used in commercial building construction. The manufacturer produces standardized, high-strength structural steel beams with pre-drilled bolt holes spaced at precise intervals. These steel beams can be bolted together to form the exterior foundation frame, configured vertically to form an elevator shaft enclosure, or positioned horizontally to support an open-concept office floor plan.",
                "The structural beam does not impose whether the finished room will be a conference room, an emergency exit corridor, or an executive boardroom; it provides the rigid structural geometry, while the interior architect assigns its functional purpose during assembly. The polymorphic Box component acts as this structural steel beam.",
                "When a developer writes `<Box as=\"main\" p=\"6\" bg=\"surface-neutral\">`, it renders a semantic `<main>` landmark with design-system-governed padding and background tokens. When they write `<Box as=\"nav\" aria-label=\"Primary\">`, it renders an accessible navigation landmark. When they author a card component, they write `<Box as=\"article\">`, ensuring semantic correctness without writing custom CSS.",
                "Beyond semantic landmark generation, an enterprise Polymorphic Box primitive plays a foundational role in enforcing responsive layout grids and eliminating fragile breakpoint calculations. Rather than authoring separate media query rules across dozens of SCSS or CSS modules, developers express responsive layout hierarchies directly through the Box API using design token arrays, such as `display={{ sm: 'block', md: 'flex', lg: 'grid' }}`. The underlying design system compiler resolves these declarations into atomic, vendor-prefixed CSS classes at build time, ensuring optimal runtime rendering performance without layout shifts.",
                "Additionally, by consolidating layout attributes within a single polymorphic primitive, enterprise performance audits become dramatically simpler. Performance monitoring tools like Lighthouse and Core Web Vitals trackers can inspect the generated DOM to verify that layout shifts (CLS) remain under 0.01 and that no extraneous DOM container nodes are created. Eliminating unnecessary nested `<div>` wrappers reduces memory consumption in mobile browsers and accelerates tree reconciliation during complex state updates.",
                "Furthermore, a production Box primitive supports responsive style arrays or objects (such as `p={{ sm: 2, md: 4, lg: 6 }}`), automatically compiling design tokens into responsive CSS classes. By providing a single polymorphic primitive for all layout needs, enterprise design systems eradicate div soup, enforce spatial token compliance, and guarantee rich landmark accessibility across the entire digital ecosystem."
            ],
            "example": "Standardized structural steel framing beams that provide uniform strength and geometry whether bolted together to form an elevator shaft, a conference room, or an emergency staircase.",
            "code": """type SemanticLandmark = 'div' | 'header' | 'nav' | 'main' | 'section' | 'article' | 'aside' | 'footer';

interface BoxProps {
  as?: SemanticLandmark;
  padding?: 1 | 2 | 3 | 4 | 6 | 8;
  margin?: 1 | 2 | 3 | 4 | 6 | 8;
  bgToken?: 'surface-base' | 'surface-card' | 'surface-brand' | 'surface-elevated';
  className?: string;
  children: string;
}

class PolymorphicBox {
  private static tokenMap = {
    padding: { 1: 'p-1 (4px)', 2: 'p-2 (8px)', 3: 'p-3 (12px)', 4: 'p-4 (16px)', 6: 'p-6 (24px)', 8: 'p-8 (32px)' },
    margin: { 1: 'm-1 (4px)', 2: 'm-2 (8px)', 3: 'm-3 (12px)', 4: 'm-4 (16px)', 6: 'm-6 (24px)', 8: 'm-8 (32px)' },
    bg: {
      'surface-base': 'bg-slate-950 text-slate-100',
      'surface-card': 'bg-slate-900 border border-slate-800 text-slate-200',
      'surface-brand': 'bg-blue-600 text-white font-semibold',
      'surface-elevated': 'bg-slate-800 shadow-2xl text-slate-100'
    }
  };

  public static render(props: BoxProps): string {
    const Tag = props.as || 'div';
    const classList: string[] = ['ds-box'];

    if (props.padding) classList.push(this.tokenMap.padding[props.padding]);
    if (props.margin) classList.push(this.tokenMap.margin[props.margin]);
    if (props.bgToken) classList.push(this.tokenMap.bg[props.bgToken]);
    if (props.className) classList.push(props.className);

    return `<${Tag} class="${classList.join(' ')}">\\n  ${props.children}\\n</${Tag}>`;
  }
}

// Case 1: Semantic Navigation Landmark
const navBar = PolymorphicBox.render({
  as: 'nav',
  padding: 4,
  bgToken: 'surface-card',
  className: 'border-b border-slate-800 flex justify-between',
  children: '<!-- Brand Logo & Global Navigation Links -->'
});
console.log('Semantic Navigation Landmark:\\n', navBar);

// Case 2: Semantic Main Landmark
const mainContent = PolymorphicBox.render({
  as: 'main',
  padding: 8,
  bgToken: 'surface-base',
  children: '<!-- Core Enterprise Analytics Dashboard -->'
});
console.log('\\nSemantic Main Landmark:\\n', mainContent);

// Case 3: Semantic Article Container
const articleCard = PolymorphicBox.render({
  as: 'article',
  padding: 6,
  margin: 4,
  bgToken: 'surface-elevated',
  children: '<h3>SEC Form 10-K Audit</h3><p>Forensic ledger verified.</p>'
});
console.log('\\nSemantic Article Landmark:\\n', articleCard);""",
            "output": """Semantic Navigation Landmark:
 <nav class="ds-box p-4 (16px) bg-slate-900 border border-slate-800 text-slate-200 border-b border-slate-800 flex justify-between">
  <!-- Brand Logo & Global Navigation Links -->
</nav>

Semantic Main Landmark:
 <main class="ds-box p-8 (32px) bg-slate-950 text-slate-100">
  <!-- Core Enterprise Analytics Dashboard -->
</main>

Semantic Article Landmark:
 <article class="ds-box p-6 (24px) m-4 (16px) bg-slate-800 shadow-2xl text-slate-100">
  <h3>SEC Form 10-K Audit</h3><p>Forensic ledger verified.</p>
</article>""",
            "codeNotes": [
                {"line": 1, "note": "SemanticLandmark type constrains the 'as' prop to valid W3C landmark and container tags."},
                {"line": 23, "note": "PolymorphicBox translates spatial tokens (padding, margin, bgToken) into unified design system classes."},
                {"line": 34, "note": "Demonstrates three semantic landmarks (nav, main, article) rendered using the identical Box primitive."}
            ],
            "tryIt": "Add an 'aside' element rendering a financial market ticker sidebar with padding: 3 and surface-card background.",
            "check": {
                "question": "How does using a polymorphic Box component with semantic tags like <Box as='main'> improve web accessibility?",
                "options": [
                    "It establishes proper W3C landmark roles in the accessibility tree, allowing screen reader users to jump directly to primary sections using landmark navigation shortcuts",
                    "It forces all text inside the component to render in high-contrast neon yellow",
                    "It automatically converts standard web pages into offline Progressive Web Apps",
                    "It compresses DOM node sizes in memory by forty percent"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Semantic HTML landmark tags (<main>, <nav>, <header>, <article>) establish explicit navigation landmarks in the browser's accessibility tree, enabling screen reader users to navigate complex layouts rapidly."
            }
        },
        {
            "title": "Forwarding Refs Through Polymorphic Components & the React.forwardRef Generic",
            "say": [
                "In component-based front-end engineering, passing data downward through props covers ninety-five percent of application requirements. However, certain advanced UI interactions demand direct, imperative access to underlying DOM nodes. Animations requiring physical bounding rect measurements (such as floating tooltips and popovers positioned with Popper or Floating UI), focus management routines (such as auto-focusing the first invalid input in a form or trapping focus inside a modal dialog), and integration with imperative canvas or video APIs all require a physical DOM Reference (`ref`).",
                "In standard React components, passing a `ref` prop does not work out of the box; React treats `ref` as a reserved keyword rather than a standard prop. To allow parent components to access an internal DOM node, developers must wrap their component in `React.forwardRef()`. While wrapping a monomorphic component in `forwardRef` is straightforward, combining `React.forwardRef` with a polymorphic `as` prop is notoriously complex in TypeScript.",
                "The core difficulty stems from the fact that the type of the forwarded DOM node changes dynamically based on the value of the `as` prop. If the consumer renders `<Button as=\"button\" ref={btnRef} />`, the forwarded ref must be typed as `React.Ref<HTMLButtonElement>`. If the consumer renders `<Button as=\"a\" ref={linkRef} />`, the forwarded ref must dynamically transition to `React.Ref<HTMLAnchorElement>`. If TypeScript cannot infer this dynamic relationship, it produces catastrophic type errors or forces developers to cast refs using unsafe `any` assertions.",
                "To resolve this typing challenge, front-end architects construct a higher-order generic wrapper around `React.forwardRef`. Because TypeScript does not natively allow generic type parameters on the outer function passed to `forwardRef`, developers define a custom type assertion signature that casts the forwardRef component into a polymorphic callable interface.",
                "To understand polymorphic ref forwarding through an everyday physical analogy, consider an advanced industrial robotic arm on an automotive assembly line. The robot's wrist features an automated tool-changer chuck. When the robot connects to a pneumatic spot-welding gun, the central control computer establishes a high-voltage electrical telemetry link to read temperature sensors and trigger electrode pulses. When the robot uncouples the welder and attaches a precision suction gripper, the exact same telemetry port re-configures itself to monitor vacuum pressure and tactile grip sensors.",
                "The central computer does not send high-voltage welding current to the vacuum suction cups; the telemetry link (the forwarded ref) dynamically adapts its electrical protocol to match the specific physical tool head currently mounted on the robot's wrist. The polymorphic `forwardRef` generic provides this exact adaptive telemetry link.",
                "In code, our polymorphic forwardRef contract guarantees that if a developer attempts to pass an `HTMLButtonElement` ref to an anchor-morphed component (`<Button as=\"a\" ref={buttonRef} />`), the TypeScript compiler immediately halts execution with a type mismatch error: `'Type HTMLAnchorElement is not assignable to type HTMLButtonElement'`. This airtight type safety prevents runtime crashes when developers call button-specific methods like `.click()` or form-related properties on anchor DOM nodes.",
                "In complex design system implementations, ref forwarding is often combined with internal ref merging to satisfy both internal component logic and external consumer measurement. For example, a tooltip or popover trigger component needs an internal ref to attach mouseenter and focus event listeners and calculate collision bounding boxes relative to the viewport edge. Simultaneously, the consuming developer may need to forward their own external ref to integrate with a focus-trap library or automated end-to-end testing selector.",
                "To resolve this duel-ref requirement without breaking polymorphic typing, enterprise architects employ a `useMergeRefs()` utility hook. This hook accepts any number of mutable refs, ref objects, or ref callbacks, creating a single unified ref callback that updates all downstream references in sequence. This guarantees that both internal design system positioning engines and external application controllers maintain seamless, simultaneous access to the exact underlying DOM node.",
                "Mastering polymorphic ref forwarding represents the pinnacle of modern TypeScript component engineering. It allows enterprise design system teams to build ultra-flexible, completely type-safe primitives that satisfy the most demanding DOM measurement, focus trapping, and animation requirements."
            ],
            "example": "An industrial robotic arm with an adaptive telemetry link that automatically switches between high-voltage welding control and pneumatic vacuum sensing based on the attached tool head.",
            "code": """// Polymorphic Ref Type Simulator
interface DOMElementTelemetry {
  tagName: string;
  focus: () => string;
  getBoundingClientRect: () => { top: number; left: number; width: number; height: number };
}

class MockHTMLButtonElement implements DOMElementTelemetry {
  public tagName = 'BUTTON';
  public disabled = false;
  public focus() { return 'Focused native <button> element'; }
  public getBoundingClientRect() { return { top: 100, left: 50, width: 120, height: 40 }; }
}

class MockHTMLAnchorElement implements DOMElementTelemetry {
  public tagName = 'A';
  public href = 'https://example.com';
  public focus() { return 'Focused native <a> anchor element'; }
  public getBoundingClientRect() { return { top: 100, left: 50, width: 140, height: 40 }; }
}

// Polymorphic Ref Forwarding Manager
class PolymorphicRefBridge {
  public static forwardRef<T extends 'button' | 'a'>(
    asTag: T,
    refCallback: (node: T extends 'button' ? MockHTMLButtonElement : MockHTMLAnchorElement) => void
  ): string {
    if (asTag === 'button') {
      const buttonNode = new MockHTMLButtonElement();
      refCallback(buttonNode as any);
      return `<button class="ref-btn">Action Button</button>`;
    } else {
      const anchorNode = new MockHTMLAnchorElement();
      refCallback(anchorNode as any);
      return `<a href="${anchorNode.href}" class="ref-link">Navigation Link</a>`;
    }
  }
}

// Case 1: Ref Forwarding to Button
let capturedButtonNode: MockHTMLButtonElement | null = null;
const btnHtml = PolymorphicRefBridge.forwardRef('button', (node) => {
  capturedButtonNode = node;
});

console.log('--- Case 1: Button Ref Forwarding ---');
console.log('HTML Markup:', btnHtml);
console.log('Captured Node Tag:', capturedButtonNode?.tagName);
console.log('Triggered Focus:', capturedButtonNode?.focus());
console.log('Bounding Box:', JSON.stringify(capturedButtonNode?.getBoundingClientRect()));

// Case 2: Ref Forwarding to Anchor
let capturedAnchorNode: MockHTMLAnchorElement | null = null;
const linkHtml = PolymorphicRefBridge.forwardRef('a', (node) => {
  capturedAnchorNode = node;
});

console.log('\\n--- Case 2: Anchor Ref Forwarding ---');
console.log('HTML Markup:', linkHtml);
console.log('Captured Node Tag:', capturedAnchorNode?.tagName);
console.log('Triggered Focus:', capturedAnchorNode?.focus());
console.log('Bounding Box:', JSON.stringify(capturedAnchorNode?.getBoundingClientRect()));""",
            "output": """--- Case 1: Button Ref Forwarding ---
HTML Markup: <button class="ref-btn">Action Button</button>
Captured Node Tag: BUTTON
Triggered Focus: Focused native <button> element
Bounding Box: {"top":100,"left":50,"width":120,"height":40}

--- Case 2: Anchor Ref Forwarding ---
HTML Markup: <a href="https://example.com" class="ref-link">Navigation Link</a>
Captured Node Tag: A
Triggered Focus: Focused native <a> anchor element
Bounding Box: {"top":100,"left":50,"width":140,"height":40}""",
            "codeNotes": [
                {"line": 1, "note": "DOMElementTelemetry models DOM node methods like focus() and getBoundingClientRect() required for popover positioning."},
                {"line": 21, "note": "PolymorphicRefBridge simulates conditional ref typing: asTag determines whether the ref receives a Button or Anchor node."},
                {"line": 34, "note": "Demonstrates direct imperative DOM access verified through telemetry metrics on the forwarded reference."}
            ],
            "tryIt": "Add a MockHTMLInputElement with selectAll() method and forward a ref to an input-morphed element.",
            "check": {
                "question": "Why is typing the 'ref' prop in polymorphic components particularly challenging in TypeScript?",
                "options": [
                    "Because the underlying DOM node type (e.g., HTMLButtonElement vs HTMLAnchorElement) dynamically changes depending on the value of the 'as' prop",
                    "Because React completely bans the use of refs in modern functional components",
                    "Because TypeScript cannot compile interfaces with more than two generic parameters",
                    "Because browser security policies block JavaScript from inspecting DOM bounding rectangles"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "The ref type must dynamically correlate with the element tag selected in the 'as' prop so that consumers receive exact auto-completion and type checking for the corresponding native DOM interface (e.g., HTMLAnchorElement for as='a')."
            }
        },
        {
            "title": "Enterprise Application: Polymorphic Navigation Item Rendering Engine",
            "say": [
                "To conclude our deep architectural dive into polymorphic components, we now build a mission-critical enterprise system: a Polymorphic Navigation Item Rendering Engine. In large-scale enterprise portals—such as multi-tenant cloud management consoles, banking portals, or hospital administration suites—the global navigation sidebar is one of the most heavily traversed and structurally complex components in the entire software architecture.",
                "Within a single enterprise sidebar, navigation items must render as multiple distinct underlying elements depending on business context and routing architecture. For example: standard internal pages must render as client-side framework router links (such as Next.js `<Link>` or React Router `<Link>`) to enable zero-page-reload routing and route prefetching. External compliance or documentation links must render as standard HTML `<a>` tags with `target=\"_blank\"` and `rel=\"noopener noreferrer\"`.",
                "Action items—such as 'Switch Tenant Organization', 'Toggle High-Contrast Mode', or 'Log Out'—must render as semantic `<button>` elements that trigger JavaScript event handlers without changing the browser URL. Finally, nested submenu headers—such as 'Advanced Treasury Settings'—must render as expandable `<button>` elements with `aria-expanded` and `aria-controls` bindings.",
                "If an enterprise design system builds separate components for these scenarios—`<SidebarRouterLink>`, `<SidebarExternalLink>`, `<SidebarActionButton>`, and `<SidebarSubmenuToggle>`—the codebase becomes bloated with duplicated visual styling. When the design team updates sidebar items to include 60 FPS hover highlight pills, micro-icon spacing, and active indicator bars, developers must copy-paste styles across four separate components, inevitably introducing visual bugs.",
                "With our polymorphic component architecture, we build a single, unified `<NavItem>` component powered by the `as` prop. The component encapsulates all design tokens: 8pt spatial padding, active state indicator bars, focus-visible keyboard rings, and SVG icon alignment. The consuming navigation engine simply passes `as={NextLink}`, `as=\"a\"`, or `as=\"button\"` based on data configuration.",
                "Let us model this in executable TypeScript. We will construct a Polymorphic Navigation Engine that processes an array of diverse enterprise navigation route descriptors. The engine evaluates each route's target type and polymorphically renders the exact semantic markup—routing links, external anchors with security attributes, and action buttons—all styled with unified design tokens.",
                "Furthermore, notice how this architecture seamlessly handles accessibility contracts: action buttons receive `type=\"button\"`, external links receive accessible screen reader warnings (`<span class=\"sr-only\">(opens in new window)</span>`), and active routes receive `aria-current=\"page\"`.",
                "In high-scale enterprise applications, this polymorphic navigation system also integrates directly with role-based access control (RBAC) and feature flag management. For example, if a compliance officer logs into the portal, certain high-risk administrative routes—such as 'Direct Database Access' or 'Manual Transfer Override'—are conditionally disabled. Rather than hiding the item completely and disorienting the user, the navigation engine polymorphically morphs the item into a disabled button with an accessible tooltip explaining that administrative clearance is required, preserving a predictable visual menu structure.",
                "Additionally, this polymorphic engine simplifies automated visual regression testing across the entire sidebar suite. Instead of writing separate Playwright or Cypress test specs for every permutation of link, external anchor, and action button, QA engineers write a single parameter-driven test suite. The suite asserts that all items display consistent focus rings on Tab key traversal, that active indicators match design token color contrasts (>= 4.5:1), and that screen readers receive correct semantic announcements regardless of whether an item routes internally or triggers a modal.",
                "From an architectural governance perspective, unifying navigation items behind a polymorphic contract shields consumer applications from underlying framework migrations. If an enterprise decides to migrate from React Router to Next.js App Router or Remix, the thousands of navigation items scattered across dozens of repositories require zero refactoring; platform engineers update the underlying polymorphic adapter once, and the entire enterprise portfolio immediately inherits modern streaming and prefetching capabilities without a single line of consumer code changes.",
                "This polymorphic navigation engine showcases the supreme power of enterprise design systems: delivering unmatched developer ergonomics, airtight type safety, and flawless accessibility across the entire enterprise digital footprint."
            ],
            "example": "A high-speed train ticketing kiosk whose universal display slots show route destinations as tap-to-select trip options, regulatory warnings as informational notices, and emergency assistance as call buttons.",
            "code": """type NavigationItemType = 'internal' | 'external' | 'action';

interface RouteDescriptor {
  id: string;
  label: string;
  icon: string;
  type: NavigationItemType;
  path?: string;
  isActive?: boolean;
}

class PolymorphicNavEngine {
  public static renderItem(route: RouteDescriptor): string {
    const activeClass = route.isActive ? 'nav-active bg-blue-900/40 text-blue-400 font-semibold border-l-2 border-blue-500' : 'text-slate-300 hover:bg-slate-800';
    const baseClass = `nav-item flex items-center gap-3 px-3 py-2 rounded-r-md text-sm transition-colors ${activeClass}`;

    if (route.type === 'internal') {
      const ariaCurrent = route.isActive ? ' aria-current="page"' : '';
      return `  <a as="RouterLink" href="${route.path || '/'}" class="${baseClass}"${ariaCurrent}>\\n    <span class="icon">${route.icon}</span> ${route.label}\\n  </a>`;
    } else if (route.type === 'external') {
      return `  <a as="ExternalAnchor" href="${route.path || '#'}" target="_blank" rel="noopener noreferrer" class="${baseClass}">\\n    <span class="icon">${route.icon}</span> ${route.label} <span class="sr-only">(opens new window)</span> [↗]\\n  </a>`;
    } else {
      return `  <button as="ActionButton" type="button" class="${baseClass} w-full text-left">\\n    <span class="icon">${route.icon}</span> ${route.label}\\n  </button>`;
    }
  }

  public static renderSidebar(routes: RouteDescriptor[]): string {
    const items = routes.map(r => this.renderItem(r)).join('\\n');
    return `<nav class="sidebar-nav bg-slate-950 p-4 border-r border-slate-800 w-64" aria-label="Enterprise Navigation">\\n${items}\\n</nav>`;
  }
}

const enterpriseRoutes: RouteDescriptor[] = [
  { id: 'r-1', label: 'Treasury Dashboard', icon: '[📊]', type: 'internal', path: '/treasury', isActive: true },
  { id: 'r-2', label: 'Liquidity Analytics', icon: '[📈]', type: 'internal', path: '/analytics' },
  { id: 'r-3', label: 'FINRA Compliance Guide', icon: '[📜]', type: 'external', path: 'https://finra.org/compliance' },
  { id: 'r-4', label: 'Switch Organization', icon: '[🏢]', type: 'action' }
];

console.log('=== ENTERPRISE POLYMORPHIC NAVIGATION SIDEBAR ===');
console.log(PolymorphicNavEngine.renderSidebar(enterpriseRoutes));""",
            "output": """=== ENTERPRISE POLYMORPHIC NAVIGATION SIDEBAR ===
<nav class="sidebar-nav bg-slate-950 p-4 border-r border-slate-800 w-64" aria-label="Enterprise Navigation">
  <a as="RouterLink" href="/treasury" class="nav-item flex items-center gap-3 px-3 py-2 rounded-r-md text-sm transition-colors nav-active bg-blue-900/40 text-blue-400 font-semibold border-l-2 border-blue-500" aria-current="page">
    <span class="icon">[📊]</span> Treasury Dashboard
  </a>
  <a as="RouterLink" href="/analytics" class="nav-item flex items-center gap-3 px-3 py-2 rounded-r-md text-sm transition-colors text-slate-300 hover:bg-slate-800">
    <span class="icon">[📈]</span> Liquidity Analytics
  </a>
  <a as="ExternalAnchor" href="https://finra.org/compliance" target="_blank" rel="noopener noreferrer" class="nav-item flex items-center gap-3 px-3 py-2 rounded-r-md text-sm transition-colors text-slate-300 hover:bg-slate-800">
    <span class="icon">[📜]</span> FINRA Compliance Guide <span class="sr-only">(opens new window)</span> [↗]
  </a>
  <button as="ActionButton" type="button" class="nav-item flex items-center gap-3 px-3 py-2 rounded-r-md text-sm transition-colors text-slate-300 hover:bg-slate-800 w-full text-left">
    <span class="icon">[🏢]</span> Switch Organization
  </button>
</nav>""",
            "codeNotes": [
                {"line": 1, "note": "NavigationItemType categorizes routes into internal links, external links, and action buttons."},
                {"line": 11, "note": "Polymorphically selects <a> with RouterLink semantics, <a> with security attributes, or <button> based on route type."},
                {"line": 15, "note": "Injects aria-current='page' on active internal links and screen reader warning text on external links."}
            ],
            "tryIt": "Add a route descriptor for an asynchronous action 'Generate Audit Snapshot' that displays a loading spinner indicator.",
            "check": {
                "question": "Why must external links rendered by the polymorphic navigation engine include 'rel=\"noopener noreferrer\"' and a hidden screen reader warning?",
                "options": [
                    "To prevent reverse tabnabbing security exploits and alert visually impaired users that the link opens in a new browser window",
                    "To speed up CSS styling animations by offloading processing to the GPU",
                    "To disable JavaScript execution on external websites",
                    "To store the user's login session token in the external URL parameter"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Target='_blank' links require rel='noopener noreferrer' to prevent malicious target sites from accessing window.opener, and an accessible text label ensures screen reader users understand that a new window or tab will open."
            }
        }
    ],
    "summary": [
        "The polymorphic 'as' prop pattern resolves tension between visual styling and semantic HTML, allowing components to dynamically morph underlying tags.",
        "TypeScript generics combined with ComponentPropsWithoutRef dynamically infer and enforce tag-specific HTML attributes (href for anchors, type for buttons).",
        "Polymorphic Box layout primitives eradicate 'div soup' by allowing engineers to declare semantic W3C landmarks (main, nav, article) at the call site.",
        "React.forwardRef combined with polymorphic types guarantees type-safe DOM element references for imperative focus and tooltip measurement.",
        "Enterprise navigation engines leverage polymorphic rendering to seamlessly output router links, secure external anchors, and action buttons from unified tokens."
    ],
    "projectStep": {
        "title": "Architect and Certify Polymorphic Component Engine",
        "steps": [
            "Construct polymorphic 'as' prop type contract with native HTML attribute mappings",
            "Build universal Polymorphic Box primitive supporting semantic W3C landmark tags",
            "Implement type-safe ref forwarding for dynamic DOM measurement and focus routines",
            "Author polymorphic navigation sidebar engine rendering router links and action buttons",
            "Verify complete TypeScript compilation and zero HTML validation errors"
        ]
    }
}

if __name__ == '__main__':
    for i, p in enumerate(DAY_33['parts']):
        words = count_words(p['say'])
        print(f"Day 33 Part {i+1} ('{p['title'][:35]}...'): {words} words")
